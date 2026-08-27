export const site = {
	name: 'Stanley Cheung',
	givenName: 'Stanley',
	legalGivenName: 'Yin',
	familyName: 'Cheung',
	shortName: 'Cheuyin',
	homeGreetingPrefix: "Hi, I'm",
	role: 'Software engineer and CS student at UBC',
	description: 'I write about building software, and I ship products with agent systems.',
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

export type IntroSegment = {
	text: string;
	href?: string;
};

export const intro: IntroSegment[][] = [
	[
		{
			text: 'In 2024 I worked two terms at VoltSafe as a full stack engineer, shipping features for the web dashboard behind their smart chargers.',
		},
	],
	[
		{ text: 'In 2025 I stepped back. Essays like ' },
		{ text: 'AI 2027', href: 'https://ai-2027.com/' },
		{
			text: ' made me unsure whether coding was still the right path, so I spent the year exploring other interests: UX, sales, copywriting, product, and video. One of those experiments became a YouTube channel that reached 125,000 views.',
		},
	],
	[
		{
			text: "By the start of 2026, I realized I enjoy building things, with code or without. AI is more fascinating than it is scary, and being able to build software with natural language is frickin' awesome.",
		},
	],
	[
		{
			text: "Since then, I've returned to tech with ferocity, learning all I can about agentic AI, and shipping an assortment of useful tools and fun toys.",
		},
	],
	[
		{
			text: "Writing is the best tool I know for learning, thinking, and talking to other people, so that's mostly what this site is about.",
		},
	],
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
