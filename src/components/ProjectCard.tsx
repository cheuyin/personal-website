import type { Project } from '../data/site';

interface ProjectCardProps {
	project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<article className="group border-t border-site-rule/70 py-6 first:border-t-0 first:pt-0">
			<h3 className="font-site-display text-xl font-semibold leading-tight tracking-[-0.02em] text-site-ink">
				<a
					className="transition-colors duration-200 ease-site hover:text-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-none motion-reduce:transition-none"
					href={project.href}
					target="_blank"
					rel="noreferrer"
				>
					{project.title}
				</a>
			</h3>
			<p className="mt-2 max-w-2xl text-[0.9375rem] leading-7 text-site-muted">{project.summary}</p>
			<a
				className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-site-teal transition-[color,transform] duration-200 ease-site hover:text-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-none group-hover:translate-x-0.5 motion-reduce:transition-none"
				href={project.href}
				target="_blank"
				rel="noreferrer"
			>
				View on GitHub <span aria-hidden="true">→</span>
			</a>
		</article>
	);
}
