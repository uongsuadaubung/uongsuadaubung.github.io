import { createSignal } from 'solid-js';

export type View =
	| { id: 'home' }
	| { id: 'blog' }
	| { id: 'post'; slug: string }
	| { id: 'about' };

function updateTitle(view: View) {
	if (typeof document === 'undefined') return;
	switch (view.id) {
		case 'home':
			document.title = 'uongsuadaubung — Personal Blog & Portfolio';
			break;
		case 'blog':
			document.title = 'Blog — uongsuadaubung';
			break;
		case 'about':
			document.title = 'Về mình & Portfolio — Hà Mạnh Kiên';
			break;
		case 'post':
			// Post view will update title with actual post title
			break;
	}
}

function parseHash(hash: string): View {
	const path = hash.replace(/^#\/?/, '');
	if (path === 'blog') return { id: 'blog' };
	if (path === 'about' || path === 'resume') return { id: 'about' };
	if (path.startsWith('post/')) return { id: 'post', slug: path.slice(5) };
	return { id: 'home' };
}

function viewToHash(view: View): string {
	if (view.id === 'blog') return '#/blog';
	if (view.id === 'about') return '#/about';
	if (view.id === 'post') return `#/post/${view.slug}`;
	return '#/';
}

const initialView: View =
	typeof window !== 'undefined' ? parseHash(window.location.hash) : { id: 'home' };

const [currentView, setCurrentView] = createSignal<View>(initialView);
updateTitle(initialView);

let currentHash = typeof window !== 'undefined' ? (window.location.hash || '#/') : '#/';
const scrollPositions = new Map<string, number>();

function navigate(view: View) {
	if (typeof window !== 'undefined') {
		const newHash = viewToHash(view);
		if (currentHash === newHash) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		scrollPositions.set(currentHash, window.scrollY);
		window.location.hash = newHash;
		currentHash = newHash;
		setCurrentView(view);
		updateTitle(view);
		
		setTimeout(() => {
			const saved = scrollPositions.get(newHash);
			if (saved !== undefined) {
				window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
			} else {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 10);
	} else {
		setCurrentView(view);
		updateTitle(view);
	}
}

// Sync store when user presses Back/Forward
if (typeof window !== 'undefined') {
	window.addEventListener('hashchange', () => {
		const newHash = window.location.hash || '#/';
		if (currentHash === newHash) return;

		scrollPositions.set(currentHash, window.scrollY);
		currentHash = newHash;
		const view = parseHash(newHash);
		setCurrentView(view);
		updateTitle(view);
		
		setTimeout(() => {
			const saved = scrollPositions.get(newHash);
			if (saved !== undefined) {
				window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
			} else {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 10);
	});
}

export { currentView };

export const nav = {
	home: () => navigate({ id: 'home' }),
	blog: () => navigate({ id: 'blog' }),
	post: (slug: string) => navigate({ id: 'post', slug }),
	about: () => navigate({ id: 'about' })
};
