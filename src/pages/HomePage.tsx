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

			<section className="section" id="work">
				<h2 className="section__title">Work</h2>
				<div className="experience-list">
					{experience.map((entry) => (
						<ExperienceCard experience={entry} key={`${entry.company}-${entry.startDate}`} />
					))}
				</div>
				<div className="project-list project-list--follow">
					{featuredProjects.map((project) => (
						<ProjectCard project={project} key={project.href} />
					))}
				</div>
			</section>

			<section className="section" id="writing">
				<h2 className="section__title">Writing</h2>
				{latestPosts.length > 0 ? (
					<>
						<div className="post-list">
							{latestPosts.map((post) => (
								<PostRow post={post} key={post.slug} />
							))}
						</div>
						<p className="section__more">
							<Link className="text-link" to="/writing">
								All writing →
							</Link>
						</p>
					</>
				) : (
					<p className="section__text section__text--muted">No posts yet.</p>
				)}
			</section>

			<section className="section" id="contact">
				<h2 className="section__title">Contact</h2>
				<ContactList />
			</section>
		</SiteLayout>
	);
}
