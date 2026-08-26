export const site = {
	name: 'Stanley Cheung',
	shortName: 'Cheuyin',
	role: 'CS student at UBC',
	tagline: 'I write about building software, and I ship products with agent systems.',
	writingBlurb: 'Notes on projects, debugging, and things I am still figuring out.',
	url: 'https://stanleycheung.com',
	links: {
		github: 'https://github.com/cheuyin',
		linkedin: 'https://www.linkedin.com/in/yinstanleycheung/',
		x: 'https://x.com/stanleycwins',
		email: 'mailto:yinstanleycheung@gmail.com',
	},
} as const;

export const nav = [
	{ href: '/', label: 'Home' },
	{ href: '/writing', label: 'Writing' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/experience', label: 'Experience' },
] as const;

export const contactLinks = [
	{ label: 'GitHub', href: site.links.github },
	{ label: 'LinkedIn', href: site.links.linkedin },
	{ label: 'X', href: site.links.x },
	{ label: 'Email', href: site.links.email },
] as const;

export type Project = {
	title: string;
	summary: string;
	href: string;
};

export const projects: Project[] = [
	{
		title: 'CreateYourStory.ai',
		summary:
			'Choose-your-own-adventure story generator with a Python backend, branching narratives, and a live demo on Render.',
		href: 'https://github.com/cheuyin/createyourstory.ai',
	},
	{
		title: 'Local AI Coding Agent',
		summary:
			'Terminal coding agent using Gemini that can read, write, and run files in a sandboxed workspace.',
		href: 'https://github.com/cheuyin/ai-agent-python',
	},
	{
		title: 'AutoDater',
		summary:
			'Obsidian plugin that keeps Created and Updated dates in Markdown frontmatter up to date. TypeScript, zero config.',
		href: 'https://github.com/cheuyin/autodater',
	},
];

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
		dates: 'Jan 2024 – Oct 2024',
		startDate: '2024-01',
		stack: 'TypeScript · Express.js · PostgreSQL · AWS · React',
		highlights: [
			'Built permissions for an internal admin dashboard so staff only saw what they were allowed to.',
			'Set up live monitoring across 7+ servers so the team could catch issues early.',
			'Added file storage to a marina app and cut bandwidth costs.',
			'Made the frontend 22% smaller and faster to load by cleaning up unused assets.',
		],
	},
];

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC',
	});
}
