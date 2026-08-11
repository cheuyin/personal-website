import { site } from '../data/site';

export default function Footer() {
	return (
		<footer className="border-t border-site-rule/70 py-6 sm:py-8">
			<p className="font-site-mono text-[0.6875rem] uppercase tracking-[0.08em] text-site-faint">
				© {new Date().getFullYear()} {site.fullName}
			</p>
		</footer>
	);
}
