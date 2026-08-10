import { contactLinks } from '../data/site';

export default function ContactList() {
	return (
		<ul className="contact-list">
			{contactLinks.map(({ label, href }) => {
				const external = !href.startsWith('mailto:');

				return (
					<li key={href}>
						<a
							href={href}
							target={external ? '_blank' : undefined}
							rel={external ? 'noreferrer' : undefined}
						>
							{label}
						</a>
					</li>
				);
			})}
		</ul>
	);
}
