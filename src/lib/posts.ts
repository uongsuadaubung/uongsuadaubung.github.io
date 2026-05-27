import { marked } from 'marked';
import hljs from 'highlight.js';

// Configure marked with highlight.js renderer
marked.use({
	renderer: {
		code({ text, lang }: { text: string; lang?: string }) {
			let highlighted = '';
			const language = lang || 'text';
			try {
				if (lang && hljs.getLanguage(lang)) {
					highlighted = hljs.highlight(text, { language: lang, ignoreIllegals: true }).value;
				} else {
					highlighted = hljs.highlightAuto(text).value;
				}
			} catch {
				highlighted = text;
			}
			return `<div class="code-block"><pre><code class="hljs language-${language}">${highlighted}</code></pre></div>`;
		}
	}
});

export interface Post {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	description: string;
	readingTime: string;
	published: boolean;
}

export interface PostDetail extends Post {
	content: string;
}

// Vite glob import of raw markdown files
const modules = import.meta.glob('/src/posts/*.md', { query: '?raw', eager: true });

function parseFrontMatter(rawMarkdown: string): { metadata: Record<string, any>; content: string } {
	const match = rawMarkdown.match(/^---\r?\n([\s\S]+?)\r?\n---/);
	if (!match) return { metadata: {}, content: rawMarkdown };

	const frontMatterBlock = match[1];
	const content = rawMarkdown.slice(match[0].length).trim();
	const metadata: Record<string, any> = {};

	frontMatterBlock.split('\n').forEach(line => {
		const colonIndex = line.indexOf(':');
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			let val = line.slice(colonIndex + 1).trim();
			
			// Remove surrounding quotes
			if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
				val = val.slice(1, -1);
			}

			if (key === 'tags') {
				try {
					metadata[key] = JSON.parse(val.replace(/'/g, '"'));
				} catch {
					metadata[key] = val.split(',').map(t => t.trim().replace(/[\[\]"']/g, ''));
				}
			} else if (key === 'published') {
				metadata[key] = val === 'true';
			} else {
				metadata[key] = val;
			}
		}
	});

	return { metadata, content };
}

export async function getPosts(): Promise<Post[]> {
	const posts: Post[] = [];

	for (const path in modules) {
		try {
			const rawContent = (modules[path] as { default: string }).default;
			const slug = path.split('/').pop()?.replace('.md', '') ?? '';
			const { metadata, content } = parseFrontMatter(rawContent);

			if (metadata.published !== false) {
				const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
				const minutes = Math.max(1, Math.round(wordCount / 200));

				posts.push({
					slug,
					title: metadata.title ?? 'Untitled',
					date: metadata.date ?? new Date().toISOString(),
					tags: Array.isArray(metadata.tags) ? metadata.tags : [],
					description: metadata.description ?? '',
					readingTime: `${minutes} phút đọc`,
					published: true
				});
			}
		} catch (e) {
			console.error(`Error loading post ${path}:`, e);
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
	const path = `/src/posts/${slug}.md`;
	if (!(path in modules)) return null;

	try {
		const rawContent = (modules[path] as { default: string }).default;
		const { metadata, content } = parseFrontMatter(rawContent);
		const htmlContent = await marked.parse(content);

		const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
		const minutes = Math.max(1, Math.round(wordCount / 200));

		return {
			slug,
			title: metadata.title ?? 'Untitled',
			date: metadata.date ?? new Date().toISOString(),
			tags: Array.isArray(metadata.tags) ? metadata.tags : [],
			description: metadata.description ?? '',
			readingTime: `${minutes} phút đọc`,
			published: true,
			content: htmlContent
		};
	} catch (e) {
		console.error(`Error rendering post ${slug}:`, e);
		return null;
	}
}
