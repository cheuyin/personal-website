import type { Project } from '../data/site';

interface ProjectCardProps {
	project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<article className="project-card">
			<h3 className="project-card__title">
				<a href={project.href} target="_blank" rel="noreferrer">
					{project.title}
				</a>
			</h3>
			<p className="project-card__summary">{project.summary}</p>
			<a className="project-card__link" href={project.href} target="_blank" rel="noreferrer">
				View on GitHub →
			</a>
		</article>
	);
}
