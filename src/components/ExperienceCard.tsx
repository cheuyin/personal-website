import type { Experience } from '../data/site';

interface ExperienceCardProps {
	experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
	return (
		<article className="border-t border-site-rule/70 py-6 first:border-t-0 first:pt-0">
			<div className="mb-4 grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-6">
				<h3 className="font-site-display text-xl font-semibold leading-tight tracking-[-0.02em] text-site-ink">
					{experience.role}
				</h3>
				<p className="text-sm font-medium text-site-teal-strong">
					{experience.company} · {experience.location}
				</p>
				<p className="flex flex-wrap gap-x-4 gap-y-1 font-site-mono text-xs text-site-muted sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:justify-self-end">
					<time dateTime={experience.startDate}>{experience.dates}</time>
					<span className="text-site-faint">{experience.stack}</span>
				</p>
			</div>
			<ul className="m-0 list-disc space-y-2 pl-5 text-[0.9375rem] leading-7 text-site-ink/90 marker:text-site-teal">
				{experience.highlights.map((highlight) => (
					<li key={highlight}>{highlight}</li>
				))}
			</ul>
		</article>
	);
}
