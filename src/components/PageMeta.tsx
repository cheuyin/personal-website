import { useEffect } from 'react';
import { site } from '../data/site';

interface PageMetaProps {
	title: string;
	description?: string;
}

export default function PageMeta({ title, description = site.tagline }: PageMetaProps) {
	useEffect(() => {
		document.title = title === site.name ? site.fullName : `${title} — ${site.fullName}`;

		const descriptionTag = document.querySelector<HTMLMetaElement>(
			'meta[name="description"]',
		);

		descriptionTag?.setAttribute('content', description);
	}, [description, title]);

	return null;
}
