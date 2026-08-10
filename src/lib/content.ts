import { parse } from 'yaml';
import type { Post } from '../data/site';

export interface WritingDocument {
	post: Post;
	body: string;
}

const markdownFiles = import.meta.glob('../content/writing/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function readRequiredString(value: unknown, field: string, path: string) {
	if (typeof value !== 'string' || value.trim().length === 0) {
		throw new Error(`Writing post ${path} needs a non-empty ${field}.`);
	}

	return value;
}

function readDate(value: unknown, path: string) {
	const date = value instanceof Date ? value.toISOString().slice(0, 10) : value;

	if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		throw new Error(`Writing post ${path} needs a date in YYYY-MM-DD format.`);
	}

	return date;
}

function readTags(value: unknown, path: string) {
	if (!Array.isArray(value) || !value.every((tag) => typeof tag === 'string')) {
		throw new Error(`Writing post ${path} needs a tags list.`);
	}

	return value;
}

function slugFromPath(path: string) {
	const filename = path.split('/').pop() ?? '';
	return filename.replace(/\.md$/, '');
}

function parseMarkdownFile(path: string, source: string): WritingDocument {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

	if (!match) {
		throw new Error(`Writing post ${path} is missing YAML frontmatter.`);
	}

	const frontmatter = parse(match[1]);

	if (!isRecord(frontmatter)) {
		throw new Error(`Writing post ${path} has invalid frontmatter.`);
	}

	const post: Post = {
		slug: slugFromPath(path),
		title: readRequiredString(frontmatter.title, 'title', path),
		date: readDate(frontmatter.date, path),
		summary: readRequiredString(frontmatter.summary, 'summary', path),
		tags: readTags(frontmatter.tags, path),
	};

	return {
		post,
		body: match[2].trim(),
	};
}

const writingDocuments = Object.entries(markdownFiles)
	.map(([path, source]) => parseMarkdownFile(path, source))
	.sort((a, b) => b.post.date.localeCompare(a.post.date));

export function getWritingPosts(): Post[] {
	return writingDocuments.map(({ post }) => post);
}

export function getWritingPost(slug: string): WritingDocument | undefined {
	return writingDocuments.find(({ post }) => post.slug === slug);
}
