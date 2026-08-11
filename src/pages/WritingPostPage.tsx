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
			<article className="pt-4 sm:pt-2">
				<header className="mb-10 border-b border-site-rule/80 pb-8">
					<p className="mb-5 text-sm">
						<Link
							className="font-medium text-site-teal underline decoration-site-teal/0 underline-offset-4 transition-[color,text-decoration-color] duration-200 ease-site hover:text-site-teal-strong hover:decoration-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-teal motion-reduce:transition-none"
							to="/writing"
						>
							← Writing
						</Link>
					</p>
					<h1 className="max-w-3xl font-site-display text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-site-ink sm:text-5xl">
						{post.title}
					</h1>
					<dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
						<div className="flex flex-wrap items-baseline gap-x-2">
							<dt className="font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-site-muted after:content-[':']">
								Date
							</dt>
							<dd className="m-0 text-sm text-site-ink">
								<time dateTime={post.date}>{post.date}</time>
							</dd>
						</div>
						{post.tags.length > 0 && (
							<div className="flex flex-wrap items-baseline gap-x-2">
								<dt className="font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.06em] text-site-muted after:content-[':']">
									Tags
								</dt>
								<dd className="m-0 flex flex-wrap gap-x-3 gap-y-1">
									{post.tags.map((tag) => (
										<span
											className="font-site-mono text-[0.6875rem] uppercase tracking-[0.06em] text-site-teal-strong"
											key={tag}
										>
											#{tag}
										</span>
									))}
								</dd>
							</div>
						)}
					</dl>
					<p className="mt-5 max-w-2xl text-lg leading-8 text-site-muted">{post.summary}</p>
				</header>

				<div className="prose prose-invert prose-lg max-w-2xl font-site-ui text-site-ink prose-headings:font-site-display prose-headings:font-semibold prose-headings:tracking-[-0.02em] prose-headings:text-site-ink prose-p:text-site-ink prose-p:leading-[1.75] prose-a:text-site-teal prose-a:decoration-site-teal/50 prose-a:underline-offset-4 prose-strong:text-site-ink prose-code:rounded-sm prose-code:border prose-code:border-site-teal/20 prose-code:bg-site-focus prose-code:px-1.5 prose-code:py-0.5 prose-code:font-site-mono prose-code:text-[0.875em] prose-code:font-medium prose-code:text-site-teal-strong prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-sm prose-pre:border prose-pre:border-site-rule prose-pre:bg-site-code prose-pre:p-4 prose-pre:font-site-mono prose-pre:text-sm prose-pre:leading-6 prose-pre:text-site-code-fg prose-blockquote:border-l-site-teal prose-blockquote:text-site-muted prose-hr:border-site-rule prose-li:marker:text-site-teal prose-th:border-site-rule prose-th:bg-site-surface prose-th:text-site-ink prose-td:border-site-rule prose-td:text-site-muted prose-table:text-sm"
				>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
				</div>
			</article>
		</SiteLayout>
	);
}
