import { site } from '../data/site';

export default function FocusHero() {
	return (
		<section className="border-b border-site-rule/80 pb-12 pt-8 sm:pb-16 sm:pt-12" id="top">
			<h1 className="max-w-3xl animate-rise-in font-site-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-site-ink motion-reduce:animate-none sm:text-6xl md:text-7xl">
				{site.fullName}
			</h1>
			<p className="mt-5 animate-rise-in font-site-mono text-xs font-medium uppercase tracking-[0.12em] text-site-teal-strong motion-reduce:animate-none">
				{site.role}
			</p>
			<p className="mt-5 max-w-2xl animate-rise-in text-xl leading-8 text-site-ink/90 motion-reduce:animate-none sm:text-2xl sm:leading-9">
				{site.tagline}
			</p>

			<div
				className="mt-8 flex animate-focus-in flex-col gap-2 rounded-2xl border border-site-teal/20 bg-site-surface/70 p-4 shadow-site-panel backdrop-blur-md motion-reduce:animate-none sm:flex-row sm:items-baseline sm:gap-x-5"
				role="status"
			>
				<span className="font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-site-teal">
					Focus
				</span>
				<p className="m-0 text-[0.9375rem] font-medium leading-6 text-site-ink">{site.focus}</p>
			</div>

			<div className="mt-8 flex animate-rise-in flex-wrap gap-3 motion-reduce:animate-none">
				<a
					className="inline-flex items-center justify-center gap-2 rounded-full border border-site-teal/40 bg-site-teal px-4 py-2.5 text-sm font-semibold leading-5 text-site-paper shadow-[0_8px_24px_rgb(73_211_173_/_0.18)] transition-[background-color,box-shadow,color] duration-200 ease-site hover:bg-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-teal motion-reduce:transition-none"
					href={site.links.email}
				>
					<svg
						className="size-4 shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.75"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M4 6.5h16v11H4z" />
						<path d="m4 7 8 6 8-6" />
					</svg>
					Email me
				</a>
				<a
					className="inline-flex items-center justify-center gap-2 rounded-full border border-site-rule bg-site-surface/60 px-4 py-2.5 text-sm font-medium leading-5 text-site-ink transition-[background-color,border-color,color] duration-200 ease-site hover:border-site-teal/50 hover:bg-site-teal/10 hover:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-teal motion-reduce:transition-none"
					href="#work"
				>
					<svg
						className="size-4 shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.75"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
						<rect x="4" y="7" width="16" height="13" rx="2" />
						<path d="M4 12h16" />
					</svg>
					See work
				</a>
				<a
					className="inline-flex items-center justify-center gap-2 rounded-full border border-site-rule bg-site-surface/60 px-4 py-2.5 text-sm font-medium leading-5 text-site-ink transition-[background-color,border-color,color] duration-200 ease-site hover:border-site-teal/50 hover:bg-site-teal/10 hover:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-teal motion-reduce:transition-none"
					href={site.links.github}
					target="_blank"
					rel="noreferrer"
				>
					<svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.16 10.16 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
					</svg>
					GitHub
				</a>
			</div>
		</section>
	);
}
