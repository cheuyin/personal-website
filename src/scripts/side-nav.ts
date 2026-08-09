/** Section nav: scroll progress + active section highlight. */
export function initSideNav() {
	const navRoot = document.querySelector('.section-nav');
	const fill = document.querySelector<HTMLElement>('[data-progress-fill]');
	if (!(navRoot instanceof HTMLElement) || !fill) return;

	const list = navRoot.querySelector('.section-nav__list');
	const isHome = list?.getAttribute('data-page') === 'home';

	const items = isHome
		? [...navRoot.querySelectorAll<HTMLAnchorElement>('a[data-section]')]
				.map((link) => {
					const id = link.dataset.section;
					const section = id ? document.getElementById(id) : null;
					return id && section ? { id, link, section } : null;
				})
				.filter(
					(item): item is { id: string; link: HTMLAnchorElement; section: HTMLElement } =>
						Boolean(item),
				)
		: [];

	let lockedId: string | null = null;
	let unlockTimer = 0;
	let ticking = false;

	function setActive(id: string | null) {
		for (const item of items) {
			if (item.id === id) {
				item.link.setAttribute('aria-current', 'true');
			} else {
				item.link.removeAttribute('aria-current');
			}
		}
	}

	function scrollProgress() {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		if (max <= 0) return 0;
		return Math.min(1, Math.max(0, window.scrollY / max));
	}

	function syncProgress() {
		fill.style.setProperty('--progress', String(scrollProgress()));
	}

	function syncSection() {
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
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			syncProgress();
			syncSection();
			ticking = false;
		});
	}

	function lock(id: string) {
		lockedId = id;
		setActive(id);
		window.clearTimeout(unlockTimer);
		unlockTimer = window.setTimeout(() => {
			lockedId = null;
			syncSection();
		}, 900);
	}

	for (const item of items) {
		item.link.addEventListener('click', () => {
			lock(item.id);
		});
	}

	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
		const id = link.hash.slice(1);
		if (!items.some((item) => item.id === id)) return;
		if (link.dataset.section) return;
		link.addEventListener('click', () => {
			lock(id);
		});
	});

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });
	onScroll();

	if (!isHome || !location.hash) return;

	const id = location.hash.slice(1);
	const match = items.find((item) => item.id === id);
	if (!match) return;

	lock(id);

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}
	window.scrollTo(0, 0);
	requestAnimationFrame(() => {
		match.section.scrollIntoView({
			behavior: reduceMotion ? 'auto' : 'smooth',
			block: 'start',
		});
	});
}
