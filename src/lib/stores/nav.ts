// Navigation store — manages which view is active
// Uses location.hash to persist navigation across F5 reloads
// Hash format: #/ (home), #/blog, #/post/<slug>, #/about

import { writable } from 'svelte/store';

export type View =
	| { id: 'home' }
	| { id: 'blog' }
	| { id: 'post'; slug: string }
	| { id: 'about' };

function parseHash(hash: string): View {
	const path = hash.replace(/^#\/?/, '');
	if (path === 'blog') return { id: 'blog' };
	if (path === 'about') return { id: 'about' };
	if (path.startsWith('post/')) return { id: 'post', slug: path.slice(5) };
	return { id: 'home' };
}

function viewToHash(view: View): string {
	if (view.id === 'blog') return '#/blog';
	if (view.id === 'about') return '#/about';
	if (view.id === 'post') return `#/post/${view.slug}`;
	return '#/';
}

function createNav() {
	const initial: View =
		typeof window !== 'undefined' ? parseHash(window.location.hash) : { id: 'home' };

	const { subscribe, set } = writable<View>(initial);

	function navigate(view: View) {
		if (typeof window !== 'undefined') {
			window.location.hash = viewToHash(view);
		}
		set(view);
	}

	// Sync store when user presses Back/Forward (or edits hash manually)
	if (typeof window !== 'undefined') {
		window.addEventListener('hashchange', () => {
			set(parseHash(window.location.hash));
		});
	}

	return {
		subscribe,
		home: () => navigate({ id: 'home' }),
		blog: () => navigate({ id: 'blog' }),
		post: (slug: string) => navigate({ id: 'post', slug }),
		about: () => navigate({ id: 'about' })
	};
}

export const nav = createNav();
