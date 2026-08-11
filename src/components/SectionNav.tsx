import { Link } from 'react-router-dom';
import { homeNav, writingNav } from '../data/site';
import { useSectionNav } from '../hooks/useSectionNav';

interface SectionNavProps {
	page?: 'home' | 'writing';
}

export default function SectionNav({ page = 'home' }: SectionNavProps) {
	useSectionNav(page === 'home');

	return (
		<aside
			className="pointer-events-none fixed bottom-4 left-1/2 z-30 w-[min(calc(100vw-1.5rem),30rem)] -translate-x-1/2 lg:bottom-auto lg:left-[max(1rem,calc(50%_-_var(--page)/2_-_var(--nav-width)_-_var(--nav-gap)))] lg:top-1/2 lg:w-[var(--nav-width)] lg:-translate-y-1/2 lg:translate-x-0"
			aria-label="Section navigation"
			data-section-nav
		>
			<div
				className="pointer-events-none absolute inset-x-3 -top-2 h-0.5 overflow-hidden rounded-full bg-site-rule/80 lg:hidden"
				aria-hidden="true"
				data-progress-fill
			>
				<div className="h-full origin-left scale-x-[var(--progress,0)] bg-gradient-to-r from-site-teal to-site-teal-strong transition-transform duration-300 ease-site motion-reduce:transition-none" />
			</div>
			<nav
				className="pointer-events-auto flex items-center justify-between gap-1 rounded-2xl border border-site-rule/80 bg-site-surface/85 p-2 shadow-site-panel backdrop-blur-xl lg:flex-col lg:items-start lg:justify-start lg:gap-2 lg:rounded-none lg:border-0 lg:border-l lg:border-site-rule/80 lg:bg-transparent lg:p-0 lg:pl-4 lg:shadow-none lg:backdrop-blur-none"
				data-page={page}
			>
				{page === 'home'
					? homeNav.map(({ href, label, id }) => (
							<a
								className="relative inline-flex min-h-10 flex-1 items-center justify-center rounded-lg px-2 py-2 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-site-muted transition-[color,background-color] duration-200 ease-site hover:bg-site-teal/10 hover:text-site-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-teal aria-[current=true]:text-site-teal-strong aria-[current=true]:after:scale-x-100 after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-5 after:-translate-x-1/2 after:scale-x-0 after:bg-site-teal after:transition-transform after:duration-200 after:ease-site motion-reduce:transition-none lg:flex-none lg:justify-start lg:rounded-none lg:px-0 lg:py-1.5 lg:text-[0.6875rem] lg:hover:bg-transparent lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:translate-x-0 lg:after:origin-left"
								href={href}
								data-section={id}
								key={id}
							>
								{label}
							</a>
						))
					: writingNav.map((item) => (
							<Link
								className="relative inline-flex min-h-10 flex-1 items-center justify-center rounded-lg px-2 py-2 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-site-muted transition-[color,background-color] duration-200 ease-site hover:bg-site-teal/10 hover:text-site-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-teal aria-[current=page]:text-site-teal-strong aria-[current=page]:after:scale-x-100 after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-5 after:-translate-x-1/2 after:scale-x-0 after:bg-site-teal after:transition-transform after:duration-200 after:ease-site motion-reduce:transition-none lg:flex-none lg:justify-start lg:rounded-none lg:px-0 lg:py-1.5 lg:text-[0.6875rem] lg:hover:bg-transparent lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:translate-x-0 lg:after:origin-left"
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
