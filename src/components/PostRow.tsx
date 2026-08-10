import { Link } from 'react-router-dom';
import type { Post } from '../data/site';

interface PostRowProps {
	post: Post;
}

export default function PostRow({ post }: PostRowProps) {
	return (
		<Link className="post-entry" to={`/writing/${post.slug}`}>
			<div className="post-entry__head">
				<h3 className="post-entry__title">{post.title}</h3>
				<time className="post-entry__date" dateTime={post.date}>
					{post.date}
				</time>
			</div>
			<p className="post-entry__summary">{post.summary}</p>
			{post.tags.length > 0 && (
				<div className="post-entry__tags">
					{post.tags.map((tag) => (
						<span className="tag" key={tag}>
							{tag}
						</span>
					))}
				</div>
			)}
		</Link>
	);
}
