import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import hljs from 'highlight.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md', '.svx'],
			smartypants: true,
			highlight: {
				highlighter: (code, lang) => {
					let highlighted;
					if (lang && hljs.getLanguage(lang)) {
						highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
					} else {
						highlighted = hljs.highlightAuto(code).value;
					}
					// Escape { and } so Svelte compiler doesn't treat them as expressions
					highlighted = highlighted.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
					return `<div class="code-block"><pre><code class="hljs language-${lang ?? 'text'}">${highlighted}</code></pre></div>`;
				}
			}
		})
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
