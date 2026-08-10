import { createSignal } from 'solid-js';

export type View =
	| { id: 'home' }
	| { id: 'blog' }
	| { id: 'post'; slug: string }
	| { id: 'about' }
	| { id: 'apps' };

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
		case 'apps':
			document.title = 'Hệ sinh thái Apps & Ứng dụng — uongsuadaubung';
			break;
		case 'post':
			// Post view will update title with actual post title
			break;
	}
}

export function viewToPath(view: View): string {
	if (view.id === 'blog') return '/blog/';
	if (view.id === 'about') return '/about/';
	if (view.id === 'apps') return '/apps/';
	if (view.id === 'post') return `/blog/${view.slug}/`;
	return '/';
}

function parseLocation(): View {
	if (typeof window === 'undefined') return { id: 'home' };

	// Legacy hash fallback migration (#/post/slug -> /blog/slug/)
	if (window.location.hash && window.location.hash.length > 1) {
		const hashPath = window.location.hash.replace(/^#\/?/, '').replace(/^post\//, '');
		window.history.replaceState(null, '', '/blog/' + hashPath + '/');
	}

	const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
	if (path === 'blog' || path === 'post' || path === 'blog/post') return { id: 'blog' };
	if (path === 'about' || path === 'resume') return { id: 'about' };
	if (path === 'apps' || path === 'ecosystem' || path === 'projects') return { id: 'apps' };
	if (path.startsWith('blog/post/')) return { id: 'post', slug: path.slice(10) };
	if (path.startsWith('blog/')) return { id: 'post', slug: path.slice(5) };
	if (path.startsWith('post/')) return { id: 'post', slug: path.slice(5) };
	return { id: 'home' };
}

const initialView: View = parseLocation();
const [currentView, setCurrentView] = createSignal<View>(initialView);
updateTitle(initialView);

let currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
const scrollPositions = new Map<string, number>();

function navigate(view: View) {
	if (typeof window !== 'undefined') {
		const newPath = viewToPath(view);
		if (currentPath === newPath) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		scrollPositions.set(currentPath, window.scrollY);
		window.history.pushState(null, '', newPath);
		currentPath = newPath;
		setCurrentView(view);
		updateTitle(view);
		
		setTimeout(() => {
			const saved = scrollPositions.get(newPath);
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

// Sync store when user presses Back/Forward browser buttons
if (typeof window !== 'undefined') {
	const handlePopState = () => {
		const newPath = window.location.pathname;
		if (currentPath === newPath) return;

		scrollPositions.set(currentPath, window.scrollY);
		currentPath = newPath;
		const view = parseLocation();
		setCurrentView(view);
		updateTitle(view);
		
		setTimeout(() => {
			const saved = scrollPositions.get(newPath);
			if (saved !== undefined) {
				window.scrollTo({ top: saved, behavior: 'instant' as ScrollBehavior });
			} else {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 10);
	};

	window.addEventListener('popstate', handlePopState);
	window.addEventListener('hashchange', () => {
		const view = parseLocation();
		navigate(view);
	});
}

export { currentView };

export const nav = {
	home: () => navigate({ id: 'home' }),
	blog: () => navigate({ id: 'blog' }),
	apps: () => navigate({ id: 'apps' }),
	post: (slug: string) => navigate({ id: 'post', slug }),
	about: () => navigate({ id: 'about' })
};
