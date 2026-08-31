export type GroundsEntry = {
	date: string;
	note: string;
};

export type GroundsDay = {
	date: string;
	notes: string[];
};

export type GroundsMonth = {
	key: string;
	label: string;
	days: GroundsDay[];
};

export const groundsEntries: GroundsEntry[] = [
	{
		date: '2026-08-30',
		note: 'Around 10 PM, I took Nala for a long walk without listening to music.',
	},
];

export function getGroundsLog(): GroundsDay[] {
	const byDate = new Map<string, string[]>();

	for (const entry of groundsEntries) {
		const notes = byDate.get(entry.date) ?? [];
		notes.push(entry.note);
		byDate.set(entry.date, notes);
	}

	return [...byDate.entries()]
		.sort((a, b) => b[0].localeCompare(a[0]))
		.map(([date, notes]) => ({ date, notes }));
}

export function getGroundsMonths(): GroundsMonth[] {
	const months: GroundsMonth[] = [];

	for (const day of getGroundsLog()) {
		const key = day.date.slice(0, 7);
		const current = months.at(-1);

		if (!current || current.key !== key) {
			months.push({
				key,
				label: monthLabel(day.date),
				days: [day],
			});
		} else {
			current.days.push(day);
		}
	}

	return months;
}

export function dayNumber(date: string): string {
	return String(Number(date.slice(8)));
}

function monthLabel(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	});
}
