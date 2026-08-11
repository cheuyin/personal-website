import { contactLinks } from '../data/site';

export default function ContactList() {
	return (
		<ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
			{contactLinks.map(({ label, href }) => {
				const external = !href.startsWith('mailto:');

				return (
					<li key={href}>
						<a
							className="font-site-display text-lg font-medium text-site-teal transition-[color,text-decoration-color] duration-200 ease-site decoration-site-teal/0 underline-offset-4 hover:text-site-teal-strong hover:decoration-site-teal-strong focus-visible:text-site-teal-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-teal motion-reduce:transition-none"
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
