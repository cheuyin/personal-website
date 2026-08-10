import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout';

export default function NotFoundPage() {
	return (
		<SiteLayout title="Not found">
			<section className="section hero">
				<h1 className="hero__name">Page not found</h1>
				<p className="hero__tagline">
					The page you requested does not exist.{' '}
					<Link className="text-link" to="/">
						Go home.
					</Link>
				</p>
			</section>
		</SiteLayout>
	);
}
