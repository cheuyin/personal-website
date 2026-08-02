export const site = {
	name: 'Cheuyin',
	fullName: 'Stanley Cheung',
	shell: {
		user: 'cheuyin',
		host: 'local',
	},
	role: 'Software engineering student at UBC',
	tagline:
		'Building real projects, writing about what I learn, and getting better at the craft of software.',
	now: 'Looking for Summer 2027 SWE internships. Rebuilding this site and shipping one project write-up per month.',
	links: {
		github: 'https://github.com/cheuyin',
		linkedin: 'https://www.linkedin.com/in/yinstanleycheung/',
		email: 'mailto:yinstanleycheung@gmail.com',
	},
} as const;

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
		title: 'UBC Course Explorer',
		dirname: 'ubc-course-explorer',
		kind: 'Project',
		summary:
			'Full-stack data visualization for UBC course and campus facilities history — TypeScript, search, and section drill-down.',
		href: 'https://github.com/cheuyin/ubc-course-explorer',
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

export const posts: Post[] = [
	{
		slug: 'how-i-built-node-films',
		title: 'How I built Node Films',
		date: '2026-03-18',
		summary:
			'Project walkthrough: problem, approach, tradeoffs, and what I would do differently.',
		tags: ['project', 'learning', 'node'],
	},
	{
		slug: 'what-broke-when-i-tried-y',
		title: 'What broke when I tried Y',
		date: '2026-02-04',
		summary: 'Debugging story that shows how I think under uncertainty.',
		tags: ['debugging'],
	},
	{
		slug: 'notes-on-z',
		title: 'Notes on Z',
		date: '2026-01-12',
		summary: 'Short technical notes on a topic I care about.',
		tags: ['notes'],
	},
];
