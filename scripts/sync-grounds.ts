/**
 * Pull the willpower log from Google Sheets into src/data/grounds.json.
 *
 * Reads Date (A) and Log (B) from the first tab, starting at row 2.
 * Auth is a service account JSON in GOOGLE_SERVICE_ACCOUNT_JSON or a
 * file path in GOOGLE_APPLICATION_CREDENTIALS.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { JWT } from 'google-auth-library';
import type { GroundsEntry } from '../src/data/grounds.ts';

type ServiceAccount = {
	client_email: string;
	private_key: string;
};

const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
const RANGE = 'A2:B';
const OUTPUT_PATH = path.join('src', 'data', 'grounds.json');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const GOOGLE_EPOCH_MS = Date.UTC(1899, 11, 30);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

loadLocalEnv();

const spreadsheetId = requiredEnv('GROUNDS_SPREADSHEET_ID');
const credentials = loadCredentials();
const entries = await fetchEntries(spreadsheetId, credentials);

writeFileSync(OUTPUT_PATH, `${JSON.stringify(entries, null, 2)}\n`);
console.log(`Wrote ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} to ${OUTPUT_PATH}`);

/** Download A2:B and return one { date, note } per non-empty row. */
async function fetchEntries(spreadsheetId: string, account: ServiceAccount): Promise<GroundsEntry[]> {
	const token = await accessToken(account);
	const url = new URL(
		`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${RANGE}`,
	);
	url.searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
	url.searchParams.set('dateTimeRenderOption', 'SERIAL_NUMBER');

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Sheets API ${response.status}: ${body.slice(0, 500)}`);
	}

	const payload = (await response.json()) as { values?: unknown[][] };
	return parseRows(payload.values ?? []);
}

/** Mint a short-lived token for the Sheets API. */
async function accessToken(account: ServiceAccount): Promise<string> {
	const client = new JWT({
		email: account.client_email,
		key: account.private_key,
		scopes: [SHEETS_SCOPE],
	});
	const { token } = await client.getAccessToken();

	if (!token) {
		throw new Error('Google auth did not return an access token.');
	}

	return token;
}

/** Skip blank rows; warn and skip rows with a missing note or bad date. */
function parseRows(rows: unknown[][]): GroundsEntry[] {
	const entries: GroundsEntry[] = [];

	for (const [index, row] of rows.entries()) {
		const sheetRow = index + 2;
		const dateValue = row[0];
		const note = cellText(row[1]);

		if (dateValue == null && note === '') {
			continue;
		}

		if (note === '') {
			console.warn(`Skipping row ${sheetRow}: empty log.`);
			continue;
		}

		const date = toIsoDate(dateValue);

		if (!date) {
			console.warn(`Skipping row ${sheetRow}: unreadable date.`);
			continue;
		}

		entries.push({ date, note });
	}

	return entries;
}

/** Turn a Sheets serial or date string into YYYY-MM-DD. */
function toIsoDate(value: unknown): string | null {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return new Date(GOOGLE_EPOCH_MS + Math.floor(value) * MS_PER_DAY).toISOString().slice(0, 10);
	}

	if (typeof value !== 'string') {
		return null;
	}

	const trimmed = value.trim();

	if (ISO_DATE.test(trimmed)) {
		return trimmed;
	}

	const parsed = Date.parse(trimmed);
	return Number.isNaN(parsed) ? null : new Date(parsed).toISOString().slice(0, 10);
}

/** Normalize a cell to trimmed text. Empty if the cell is blank. */
function cellText(value: unknown): string {
	return value == null ? '' : String(value).trim();
}

/** Load the service account from the env JSON or a credentials file. */
function loadCredentials(): ServiceAccount {
	const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();

	if (raw) {
		return parseServiceAccount(raw);
	}

	const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

	if (!credentialsPath) {
		throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
	}

	if (!existsSync(credentialsPath)) {
		throw new Error(`GOOGLE_APPLICATION_CREDENTIALS file not found: ${credentialsPath}`);
	}

	return parseServiceAccount(readFileSync(credentialsPath, 'utf8'));
}

/** Parse key JSON and require client_email plus private_key. */
function parseServiceAccount(raw: string): ServiceAccount {
	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.');
	}

	if (
		typeof parsed !== 'object' ||
		parsed === null ||
		typeof (parsed as ServiceAccount).client_email !== 'string' ||
		typeof (parsed as ServiceAccount).private_key !== 'string'
	) {
		throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must include client_email and private_key.');
	}

	return parsed as ServiceAccount;
}

/** Return a required env var, or throw. */
function requiredEnv(name: string): string {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

/** Load repo-root .env into process.env without overwriting existing vars. */
function loadLocalEnv() {
	const envPath = path.join(process.cwd(), '.env');

	if (!existsSync(envPath)) {
		return;
	}

	for (const line of readFileSync(envPath, 'utf8').split('\n')) {
		const trimmed = line.trim();

		if (trimmed === '' || trimmed.startsWith('#')) {
			continue;
		}

		const separator = trimmed.indexOf('=');

		if (separator <= 0) {
			continue;
		}

		const key = trimmed.slice(0, separator).trim();
		let value = trimmed.slice(separator + 1).trim();

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		if (process.env[key] === undefined) {
			process.env[key] = value;
		}
	}
}
