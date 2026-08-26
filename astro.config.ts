import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkMermaid } from './src/lib/remark-mermaid';
import { rehypeImageFigures } from './src/lib/rehype-image-figures';

export default defineConfig({
	site: 'https://stanleycheung.com',
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			theme: 'github-dark',
		},
		processor: unified({
			gfm: true,
			remarkPlugins: [remarkMath, remarkMermaid],
			rehypePlugins: [rehypeKatex, rehypeImageFigures],
		}),
	},
});
