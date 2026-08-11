import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';

export default function NotFoundPage() {
	return (
		<SiteLayout title="Not found">
			<section className="border-b border-site-rule/80 pb-12 pt-8 sm:pb-16 sm:pt-12">
				<h1 className="max-w-3xl font-site-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-site-ink sm:text-6xl">
					Page not found
				</h1>
				<p className="mt-5 max-w-2xl text-xl leading-8 text-site-ink/90 sm:text-2xl sm:leading-9">
					The page you requested does not exist.{' '}
					<Link
						className="font-medium text-site-teal underline decoration-site-teal/0 underline-offset-4 transition-[color,text-decoration-color] duration-200 ease-site hover:text-site-teal-strong hover:decoration-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-teal motion-reduce:transition-none"
						to="/"
					>
						Go home.
					</Link>
				</p>
			</section>
		</SiteLayout>
	);
}
