import { Link } from 'react-router-dom';
import type { Post } from '../data/site';

interface PostRowProps {
	post: Post;
}

export default function PostRow({ post }: PostRowProps) {
	return (
		<Link
			className="group block border-t border-site-rule/70 py-6 first:border-t-0 first:pt-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-teal"
			to={`/writing/${post.slug}`}
		>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
				<h3 className="font-site-display text-lg font-semibold tracking-[-0.02em] text-site-ink transition-colors duration-200 ease-site group-hover:text-site-teal-strong group-focus-visible:text-site-teal-strong motion-reduce:transition-none">
					{post.title}
				</h3>
				<time className="shrink-0 font-site-mono text-xs text-site-muted" dateTime={post.date}>
					{post.date}
				</time>
			</div>
			<p className="mt-2 max-w-2xl text-[0.9375rem] leading-7 text-site-muted">{post.summary}</p>
			{post.tags.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
					{post.tags.map((tag) => (
						<span
							className="font-site-mono text-[0.6875rem] uppercase tracking-[0.06em] text-site-teal-strong"
							key={tag}
						>
							#{tag}
						</span>
					))}
				</div>
			)}
		</Link>
	);
}
