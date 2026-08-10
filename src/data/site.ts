export const site = {
	name: 'Cheuyin',
	fullName: 'Stanley Cheung',
	role: '4th year CS student at UBC',
	tagline:
		'I use my CS background to take full advantage of agent systems and ship real products that solve real problems.',
	focus: 'Full-stack · Agents · Product design',
	writingBlurb: "Notes on projects, debugging, and things I'm still figuring out.",
	homePreviewCount: 3,
	links: {
		github: 'https://github.com/cheuyin',
		linkedin: 'https://www.linkedin.com/in/yinstanleycheung/',
		email: 'mailto:yinstanleycheung@gmail.com',
	},
} as const;

export const contactLinks = [
	{ label: 'GitHub', href: site.links.github },
	{ label: 'LinkedIn', href: site.links.linkedin },
	{ label: 'Email', href: site.links.email },
] as const;

export const homeNav = [
	{ href: '#top', label: 'Top', id: 'top' },
	{ href: '#work', label: 'Work', id: 'work' },
	{ href: '#writing', label: 'Writing', id: 'writing' },
	{ href: '#contact', label: 'Contact', id: 'contact' },
] as const;

export const writingNav = [
	{ href: '/', label: 'Home' },
	{ href: '/writing', label: 'Writing', current: true },
	{ href: '/#contact', label: 'Contact' },
] as const;

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

export type Post = {
	slug: string;
	title: string;
	date: string;
	summary: string;
	tags: string[];
};
