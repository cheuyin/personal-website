export const site = {
	name: 'Stanley Cheung',
	givenName: 'Stanley',
	legalGivenName: 'Yin',
	familyName: 'Cheung',
	shortName: 'Cheuyin',
	homeGreetingPrefix: "👋🏼 Hi, I'm",
	role: 'Software engineer and CS student at UBC',
	description: 'I build software and write about what I’m learning.',
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

export type ProjectPreviewLine = {
	label?: string;
	text?: string;
	highlight?: string;
	suffix?: string;
	isMuted?: boolean;
};

export type Project = {
	title: string;
	dates: string;
	summary: string;
	stack: string[];
	href: string;
	github?: string;
	image?: string;
	preview?: ProjectPreviewLine[];
};

export const projects: Project[] = [
	{
		title: 'CreateYourStory.ai',
		dates: 'Jun 2026 – Jul 2026',
		summary:
			'Choose-your-own-adventure story generator with a Python backend, branching narratives, and a live demo on Render.',
		stack: ['Python', 'FastAPI', 'React', 'SQLite'],
		href: 'https://createyourstory-ai-backend.onrender.com/',
		github: 'https://github.com/cheuyin/createyourstory.ai',
		image: '/projects/createyourstory.jpg',
		preview: [
			{ label: 'POST', text: '/api/story/generate' },
			{ label: 'TREE', text: 'depth 4 · nodes 15' },
			{ text: '▸ branch: choose torch path', isMuted: true },
			{ text: 'stream · tokens ', highlight: '1.2k', suffix: ' · 240ms', isMuted: true },
		],
	},
	{
		title: 'Local AI Coding Agent',
		dates: 'May 2026 – Jun 2026',
		summary:
			'Terminal coding agent using Gemini that can read, write, and run files in a sandboxed workspace.',
		stack: ['Python', 'Gemini API', 'CLI'],
		href: 'https://github.com/cheuyin/ai-agent-python',
		github: 'https://github.com/cheuyin/ai-agent-python',
		preview: [
			{ label: 'INIT', text: 'gemini-3.7-flash' },
			{ label: 'EXEC', text: 'sandbox workspace' },
			{ text: '▸ diff applied · 3 files', isMuted: true },
			{ text: 'eval · tests ', highlight: '12/12', suffix: ' passed', isMuted: true },
		],
	},
	{
		title: 'AutoDater',
		dates: 'May 2025 – Jul 2026',
		summary:
			'Obsidian plugin that keeps Created and Updated dates in Markdown frontmatter up to date. TypeScript, zero config.',
		stack: ['TypeScript', 'Obsidian API'],
		href: 'https://community.obsidian.md/plugins/autodater',
		github: 'https://github.com/cheuyin/autodater',
		image: '/projects/autodater.png',
		preview: [
			{ label: 'HOOK', text: 'vault.on("modify")' },
			{ label: 'SYNC', text: 'frontmatter yaml' },
			{ text: '▸ updated: 2026-08-27', isMuted: true },
			{ text: 'state · tracked ', highlight: '142', suffix: ' files', isMuted: true },
		],
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
