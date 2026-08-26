import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
	loader: glob({
		pattern: '**/index.md',
		base: './src/content/writing',
		generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
	}),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		summary: z.string(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

export const collections = { writing };
