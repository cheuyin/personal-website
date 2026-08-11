import { Link } from 'react-router-dom';
import ContactList from '../components/ContactList';
import ExperienceCard from '../components/ExperienceCard';
import FocusHero from '../components/FocusHero';
import PostRow from '../components/PostRow';
import ProjectCard from '../components/ProjectCard';
import SiteLayout from '../components/SiteLayout';
import { experience, projects, site, type Post } from '../data/site';

interface HomePageProps {
	posts: Post[];
}

export default function HomePage({ posts }: HomePageProps) {
	const latestPosts = posts.slice(0, site.homePreviewCount);
	const featuredProjects = projects.slice(0, site.homePreviewCount);

	return (
		<SiteLayout title={site.name} description={site.tagline} page="home">
			<FocusHero />

			<section className="scroll-mt-6 border-b border-site-rule/80 py-10 sm:py-14" id="work">
				<h2 className="mb-6 flex items-center gap-3 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-site-muted before:h-px before:w-7 before:bg-site-teal sm:mb-8">
					Work
				</h2>
				<div className="grid gap-0">
					{experience.map((entry) => (
						<ExperienceCard experience={entry} key={`${entry.company}-${entry.startDate}`} />
					))}
				</div>
				<div className="mt-8 grid gap-0 border-t border-site-rule/70">
					{featuredProjects.map((project) => (
						<ProjectCard project={project} key={project.href} />
					))}
				</div>
			</section>

			<section className="scroll-mt-6 border-b border-site-rule/80 py-10 sm:py-14" id="writing">
				<h2 className="mb-6 flex items-center gap-3 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-site-muted before:h-px before:w-7 before:bg-site-teal sm:mb-8">
					Writing
				</h2>
				{latestPosts.length > 0 ? (
					<>
						<div className="grid gap-0">
							{latestPosts.map((post) => (
								<PostRow post={post} key={post.slug} />
							))}
						</div>
						<p className="mt-5">
							<Link
								className="inline-flex items-center text-sm font-medium text-site-teal underline decoration-site-teal/0 underline-offset-4 transition-[color,text-decoration-color] duration-200 ease-site hover:text-site-teal-strong hover:decoration-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-teal motion-reduce:transition-none"
								to="/writing"
							>
								All writing →
							</Link>
						</p>
					</>
				) : (
					<p className="m-0 max-w-xl text-site-muted">No posts yet.</p>
				)}
			</section>

			<section className="scroll-mt-6 py-10 sm:py-14" id="contact">
				<h2 className="mb-6 flex items-center gap-3 font-site-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-site-muted before:h-px before:w-7 before:bg-site-teal sm:mb-8">
					Contact
				</h2>
				<ContactList />
			</section>
		</SiteLayout>
	);
}
