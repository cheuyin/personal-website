import { site } from '../data/site';

export default function Footer() {
	return (
		<footer className="site-footer">
			<p className="footer__text">
				© {new Date().getFullYear()} {site.fullName}
			</p>
		</footer>
	);
}
