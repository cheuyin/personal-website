import { getCollection, type CollectionEntry } from 'astro:content';

export type WritingPost = CollectionEntry<'writing'>;

export async function getWritingPosts(): Promise<WritingPost[]> {
	const posts = await getCollection('writing', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function countWords(markdown: string): number {
	const text = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/\$\$[\s\S]*?\$\$/g, ' ')
		.replace(/\$[^$]+\$/g, ' ')
		.replace(/[#>*_~|[\]()-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	if (!text) {
		return 0;
	}

	return text.split(' ').length;
}

export function formatWordCount(count: number): string {
	const formatted = count.toLocaleString('en-US');
	return count === 1 ? '1 word' : `${formatted} words`;
}

