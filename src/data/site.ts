export const site = {
	name: 'Cheuyin',
	fullName: 'Stanley Cheung',
	shell: {
		user: 'cheuyin',
		host: 'local',
	},
	role: '4th year CS student at UBC',
	tagline:
		'Interested in backend engineering, AI engineering, and building agentic systems.',
	now: 'Seeking Fall 2026 and Winter 2027 internships.',
	interests: [
		'Backend engineering',
		'AI agent engineering',
	],
	links: {
		github: 'https://github.com/cheuyin',
		linkedin: 'https://www.linkedin.com/in/yinstanleycheung/',
		email: 'mailto:yinstanleycheung@gmail.com',
	},
} as const;

export type Experience = {
	role: string;
	company: string;
	location: string;
	dates: string;
	startDate: string;
	stack: string;
	highlights: string[];
};

export const experience: Experience[] = [
	{
		role: 'Software Engineer Intern',
		company: 'VoltSafe Inc.',
		location: 'Vancouver, BC',
		dates: 'Jan 2024 – Jul 2024',
		startDate: '2024-01',
		stack: 'TypeScript · Express.js · PostgreSQL · AWS · React',
		highlights: [
			'Built end-to-end RBAC with Cognito, Express, and PostgreSQL for an internal admin dashboard.',
			'Dockerized a Prometheus monitoring stack tracking 7+ EC2 servers in real time.',
			'Shipped S3-backed file storage for a marina app, cutting bandwidth costs.',
			'Cut bundle size 22% via Lighthouse analysis and asset pruning.',
		],
	},
];

export type Project = {
	title: string;
	dirname: string;
	kind: string;
	summary: string;
	href: string;
};

export const projects: Project[] = [
	{
		title: 'CreateYourStory.ai',
		dirname: 'createyourstory.ai',
		kind: 'Project',
		summary:
			'Choose-your-own-adventure story generator — Python backend, branching narratives, live demo deployed on Render.',
		href: 'https://github.com/cheuyin/createyourstory.ai',
	},
	{
		title: 'Local AI Coding Agent',
		dirname: 'ai-agent-python',
		kind: 'Project',
		summary:
			'Terminal-based coding agent using Gemini — multi-turn tool loop to read, write, and run files in a sandboxed workspace.',
		href: 'https://github.com/cheuyin/ai-agent-python',
	},
	{
		title: 'AutoDater',
		dirname: 'autodater',
		kind: 'Code',
		summary:
			'Obsidian plugin that auto-manages Created and Updated dates in Markdown frontmatter — TypeScript, zero-config.',
		href: 'https://github.com/cheuyin/autodater',
	},
];

export type Post = {
	slug: string;
	title: string;
	date: string;
	summary: string;
	tags: string[];
};

export async function getWritingPosts(): Promise<Post[]> {
	const { getCollection } = await import('astro:content');
	const entries = await getCollection('writing');
	return entries
		.map((entry) => ({
			slug: entry.id,
			title: entry.data.title,
			date: entry.data.date.toISOString().slice(0, 10),
			summary: entry.data.summary,
			tags: entry.data.tags,
		}))
		.sort((a, b) => b.date.localeCompare(a.date));
}
