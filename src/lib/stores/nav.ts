// Navigation store — manages which view is active
// URL stays fixed at uongsuadaubung.github.io throughout

import { writable } from 'svelte/store';

export type View =
	| { id: 'home' }
	| { id: 'blog' }
	| { id: 'post'; slug: string }
	| { id: 'about' };

function createNav() {
	const { subscribe, set } = writable<View>({ id: 'home' });

	return {
		subscribe,
		home: () => set({ id: 'home' }),
		blog: () => set({ id: 'blog' }),
		post: (slug: string) => set({ id: 'post', slug }),
		about: () => set({ id: 'about' })
	};
}

export const nav = createNav();
