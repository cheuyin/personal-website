import { useEffect } from 'react';

type SectionItem = {
	id: string;
	link: HTMLAnchorElement;
	section: HTMLElement;
};

export function useSectionNav(isHome: boolean) {
	useEffect(() => {
		const navRoot = document.querySelector<HTMLElement>('[data-section-nav]');
		const fill = document.querySelector<HTMLElement>('[data-progress-fill]');

		if (!navRoot || !fill) return;

		const items = isHome
			? Array.from(navRoot.querySelectorAll<HTMLAnchorElement>('a[data-section]'))
					.map((link): SectionItem | null => {
						const id = link.dataset.section;
						const section = id ? document.getElementById(id) : null;
						return id && section ? { id, link, section } : null;
					})
					.filter((item): item is SectionItem => item !== null)
			: [];

		let lockedId: string | null = null;
		let unlockTimer = 0;
		let frame = 0;

		const setActive = (id: string | null) => {
			for (const item of items) {
				if (item.id === id) {
					item.link.setAttribute('aria-current', 'true');
				} else {
					item.link.removeAttribute('aria-current');
				}
			}
		};

		const getScrollProgress = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			if (max <= 0) return 0;
			return Math.min(1, Math.max(0, window.scrollY / max));
		};

		const syncProgress = () => {
			fill.style.setProperty('--progress', String(getScrollProgress()));
		};

		const syncSection = () => {
			if (!isHome || items.length === 0 || lockedId) return;

			const marker = window.scrollY + window.innerHeight * 0.28;
			let current = items[0].id;

			for (const item of items) {
				if (item.section.offsetTop <= marker) {
					current = item.id;
				}
			}

			const atBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 8;

			if (atBottom) {
				current = items[items.length - 1].id;
			}

			setActive(current);
		};

		const onScroll = () => {
			if (frame) return;

			frame = window.requestAnimationFrame(() => {
				syncProgress();
				syncSection();
				frame = 0;
			});
		};

		const lock = (id: string) => {
			lockedId = id;
			setActive(id);
			window.clearTimeout(unlockTimer);
			unlockTimer = window.setTimeout(() => {
				lockedId = null;
				syncSection();
			}, 900);
		};

		const listeners: Array<{
			link: HTMLAnchorElement;
			handler: () => void;
		}> = [];

		for (const item of items) {
			const handler = () => lock(item.id);
			item.link.addEventListener('click', handler);
			listeners.push({ link: item.link, handler });
		}

		for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
			const id = link.hash.slice(1);
			if (!items.some((item) => item.id === id) || link.dataset.section) continue;

			const handler = () => lock(id);
			link.addEventListener('click', handler);
			listeners.push({ link, handler });
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		onScroll();

		if (isHome && window.location.hash) {
			const id = window.location.hash.slice(1);
			const match = items.find((item) => item.id === id);

			if (match) {
				lock(id);
				const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
				window.scrollTo(0, 0);
				window.requestAnimationFrame(() => {
					match.section.scrollIntoView({
						behavior: reduceMotion ? 'auto' : 'smooth',
						block: 'start',
					});
				});
			}
		}

		return () => {
			window.cancelAnimationFrame(frame);
			window.clearTimeout(unlockTimer);
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);

			for (const { link, handler } of listeners) {
				link.removeEventListener('click', handler);
			}
		};
	}, [isHome]);
}
