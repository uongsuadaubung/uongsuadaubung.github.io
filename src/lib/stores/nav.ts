// Navigation store — manages which view is active
// Uses location.hash to persist navigation across F5 reloads
// Hash format: #/ (home), #/blog, #/post/<slug>, #/about

import { writable } from 'svelte/store';

export type View =
	| { id: 'home' }
	| { id: 'blog' }
	| { id: 'post'; slug: string }
	| { id: 'about' }
	| { id: 'resume' };

function parseHash(hash: string): View {
	const path = hash.replace(/^#\/?/, '');
	if (path === 'blog') return { id: 'blog' };
	if (path === 'about') return { id: 'about' };
	if (path.startsWith('post/')) return { id: 'post', slug: path.slice(5) };
	if (path === 'resume') return { id: 'resume' };
	return { id: 'home' };
}

function viewToHash(view: View): string {
	if (view.id === 'blog') return '#/blog';
	if (view.id === 'about') return '#/about';
	if (view.id === 'post') return `#/post/${view.slug}`;
	if (view.id === 'resume') return '#/resume';
	return '#/';
}

function createNav() {
	const initial: View =
		typeof window !== 'undefined' ? parseHash(window.location.hash) : { id: 'home' };

	const { subscribe, set } = writable<View>(initial);

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
			set(view);
			
			setTimeout(() => {
				const saved = scrollPositions.get(newHash);
				if (saved !== undefined) {
					window.scrollTo({ top: saved, behavior: 'instant' });
				} else {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}
			}, 10);
		} else {
			set(view);
		}
	}

	// Sync store when user presses Back/Forward (or edits hash manually)
	if (typeof window !== 'undefined') {
		window.addEventListener('hashchange', () => {
			const newHash = window.location.hash || '#/';
			if (currentHash === newHash) return; // Ignore if fired by navigate()

			scrollPositions.set(currentHash, window.scrollY);
			currentHash = newHash;
			set(parseHash(newHash));
			
			setTimeout(() => {
				const saved = scrollPositions.get(newHash);
				if (saved !== undefined) {
					window.scrollTo({ top: saved, behavior: 'instant' });
				} else {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}
			}, 10);
		});
	}

	return {
		subscribe,
		home: () => navigate({ id: 'home' }),
		blog: () => navigate({ id: 'blog' }),
		post: (slug: string) => navigate({ id: 'post', slug }),
		about: () => navigate({ id: 'about' }),
		resume: () => navigate({ id: 'resume' })
	};
}

export const nav = createNav();
