import PostRow from '../components/PostRow';
import SiteLayout from '../components/SiteLayout';
import { site, type Post } from '../data/site';

interface WritingIndexPageProps {
	posts: Post[];
}

export default function WritingIndexPage({ posts }: WritingIndexPageProps) {
	return (
		<SiteLayout title="Writing" description={site.writingBlurb} page="writing">
			<section className="border-b border-site-rule/80 pb-10 pt-4 sm:pb-14 sm:pt-2">
				<h1 className="max-w-3xl font-site-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-site-ink sm:text-6xl">
					Writing
				</h1>
				<p className="mt-5 max-w-2xl text-xl leading-8 text-site-ink/90 sm:text-2xl sm:leading-9">
					{site.writingBlurb}
				</p>
			</section>

			<section className="py-10 sm:py-14">
				<h2 className="mb-6 flex items-center gap-3 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-site-muted before:h-px before:w-7 before:bg-site-teal sm:mb-8">
					Posts
				</h2>
				{posts.length > 0 ? (
					<div className="grid gap-0">
						{posts.map((post) => (
							<PostRow post={post} key={post.slug} />
						))}
					</div>
				) : (
					<p className="m-0 max-w-xl text-site-muted">No posts yet.</p>
				)}
			</section>
		</SiteLayout>
	);
}
