import { Link } from 'react-router-dom';
import { homeNav, writingNav } from '../data/site';
import { useSectionNav } from '../hooks/useSectionNav';

interface SectionNavProps {
	page?: 'home' | 'writing';
}

export default function SectionNav({ page = 'home' }: SectionNavProps) {
	useSectionNav(page === 'home');

	return (
		<aside className="section-nav" aria-label="Section navigation" data-section-nav>
			<div className="section-nav__progress" aria-hidden="true" data-progress-fill />
			<nav className="section-nav__list" data-page={page}>
				{page === 'home'
					? homeNav.map(({ href, label, id }) => (
							<a className="section-nav__link" href={href} data-section={id} key={id}>
								{label}
							</a>
						))
					: writingNav.map((item) => (
							<Link
								className="section-nav__link"
								to={item.href}
								aria-current={'current' in item && item.current ? 'page' : undefined}
								key={item.href}
							>
								{item.label}
							</Link>
						))}
			</nav>
		</aside>
	);
}
