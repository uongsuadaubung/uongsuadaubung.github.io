// Theme store - persists to localStorage
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

const defaultTheme: Theme = 'dark';

function createThemeStore() {
	const stored = browser ? (localStorage.getItem('theme') as Theme) : null;
	const { subscribe, set, update } = writable<Theme>(stored ?? defaultTheme);

	return {
		subscribe,
		toggle: () =>
			update((t) => {
				const next: Theme = t === 'dark' ? 'light' : 'dark';
				if (browser) {
					localStorage.setItem('theme', next);
					document.documentElement.setAttribute('data-theme', next);
				}
				return next;
			}),
		set: (t: Theme) => {
			if (browser) {
				localStorage.setItem('theme', t);
				document.documentElement.setAttribute('data-theme', t);
			}
			set(t);
		}
	};
}

export const theme = createThemeStore();
