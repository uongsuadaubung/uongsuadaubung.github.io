import { createSignal } from 'solid-js';

export type Theme = 'light' | 'dark';

// Read initial theme from localStorage or default to 'dark'
const initialTheme = (typeof window !== 'undefined' && localStorage.getItem('theme') as Theme) || 'dark';

const [theme, setThemeState] = createSignal<Theme>(initialTheme);

// Initialize document attribute immediately
if (typeof window !== 'undefined') {
	document.documentElement.setAttribute('data-theme', initialTheme);
}

export { theme };

export const toggleTheme = () => {
	const next: Theme = theme() === 'dark' ? 'light' : 'dark';
	setThemeState(next);
	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', next);
		document.documentElement.setAttribute('data-theme', next);
	}
};

export const setTheme = (t: Theme) => {
	setThemeState(t);
	if (typeof window !== 'undefined') {
		localStorage.setItem('theme', t);
		document.documentElement.setAttribute('data-theme', t);
	}
};
