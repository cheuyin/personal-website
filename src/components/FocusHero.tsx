import { site } from '../data/site';

export default function FocusHero() {
	return (
		<section className="section hero" id="top">
			<h1 className="hero__name">{site.fullName}</h1>
			<p className="hero__role">{site.role}</p>
			<p className="hero__tagline">{site.tagline}</p>

			<div className="focus-strip" role="status">
				<span className="focus-strip__label">Focus</span>
				<p className="focus-strip__value">{site.focus}</p>
			</div>

			<div className="hero__actions">
				<a className="btn btn--primary" href={site.links.email}>
					<svg
						className="btn__icon"
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
				<a className="btn btn--ghost" href="#work">
					<svg
						className="btn__icon"
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
					className="btn btn--ghost"
					href={site.links.github}
					target="_blank"
					rel="noreferrer"
				>
					<svg className="btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.59.69.48A10.16 10.16 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
					</svg>
					GitHub
				</a>
			</div>
		</section>
	);
}
