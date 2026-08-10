import PostRow from '../components/PostRow';
import SiteLayout from '../components/SiteLayout';
import { site, type Post } from '../data/site';

interface WritingIndexPageProps {
	posts: Post[];
}

export default function WritingIndexPage({ posts }: WritingIndexPageProps) {
	return (
		<SiteLayout title="Writing" description={site.writingBlurb} page="writing">
			<section className="section hero hero--compact">
				<h1 className="hero__name">Writing</h1>
				<p className="hero__tagline">{site.writingBlurb}</p>
			</section>

			<section className="section">
				<h2 className="section__title">Posts</h2>
				{posts.length > 0 ? (
					<div className="post-list">
						{posts.map((post) => (
							<PostRow post={post} key={post.slug} />
						))}
					</div>
				) : (
					<p className="section__text section__text--muted">No posts yet.</p>
				)}
			</section>
		</SiteLayout>
	);
}
