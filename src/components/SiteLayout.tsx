import type { ReactNode } from 'react';
import Footer from './Footer';
import PageMeta from './PageMeta';
import SectionNav from './SectionNav';

interface SiteLayoutProps {
	title: string;
	description?: string;
	page?: 'home' | 'writing';
	children: ReactNode;
}

export default function SiteLayout({
	title,
	description,
	page = 'home',
	children,
}: SiteLayoutProps) {
	return (
		<>
			<PageMeta title={title} description={description} />
			<div className="site-shell">
				<div className="site-frame">
					<SectionNav page={page} />
					<main className="site-main">{children}</main>
					<Footer />
				</div>
			</div>
		</>
	);
}
