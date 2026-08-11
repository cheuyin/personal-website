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
			<div className="flex min-h-screen flex-col px-4 sm:px-6">
				<div className="mx-auto flex w-full max-w-[var(--page)] flex-1 flex-col">
					<SectionNav page={page} />
					<main className="flex-1 pb-20 pt-8 lg:pb-12 lg:pt-10">{children}</main>
					<Footer />
				</div>
			</div>
		</>
	);
}
