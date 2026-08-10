import ReactMarkdown from 'react-markdown';
import { Link, Navigate, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import SiteLayout from '../components/SiteLayout';
import { getWritingPost } from '../lib/content';

export default function WritingPostPage() {
	const { slug } = useParams<{ slug: string }>();
	const document = slug ? getWritingPost(slug) : undefined;

	if (!document) {
		return <Navigate to="/writing" replace />;
	}

	const { post, body } = document;

	return (
		<SiteLayout title={post.title} description={post.summary} page="writing">
			<article className="post">
				<header className="post__header">
					<p className="post__back">
						<Link className="text-link" to="/writing">
							← Writing
						</Link>
					</p>
					<h1 className="post__title">{post.title}</h1>
					<dl className="post__meta">
						<div className="post__field">
							<dt>Date</dt>
							<dd>
								<time dateTime={post.date}>{post.date}</time>
							</dd>
						</div>
						{post.tags.length > 0 && (
							<div className="post__field">
								<dt>Tags</dt>
								<dd>
									{post.tags.map((tag) => (
										<span className="tag" key={tag}>
											{tag}
										</span>
									))}
								</dd>
							</div>
						)}
					</dl>
					<p className="post__summary">{post.summary}</p>
				</header>

				<div className="post-body">
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
				</div>
			</article>
		</SiteLayout>
	);
}
