import type { Experience } from '../data/site';

interface ExperienceCardProps {
	experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
	return (
		<article className="experience-card">
			<div className="experience-card__head">
				<h3 className="experience-card__title">{experience.role}</h3>
				<p className="experience-card__company">
					{experience.company} · {experience.location}
				</p>
				<p className="experience-card__meta">
					<time dateTime={experience.startDate}>{experience.dates}</time>
					<span className="experience-card__stack">{experience.stack}</span>
				</p>
			</div>
			<ul className="experience-card__highlights">
				{experience.highlights.map((highlight) => (
					<li key={highlight}>{highlight}</li>
				))}
			</ul>
		</article>
	);
}
