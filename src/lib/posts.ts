export interface Post {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	description: string;
	readingTime: string;
	published: boolean;
}

type MdsvexImport = {
	metadata: Omit<Post, 'slug'> & { [key: string]: unknown };
	default: unknown;
};

export async function getPosts(): Promise<Post[]> {
	const modules = import.meta.glob<MdsvexImport>('/src/posts/*.md', { eager: false });

	const posts: Post[] = [];

	for (const path in modules) {
		const mod = await modules[path]();
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const meta = mod.metadata;

		if (meta.published !== false) {
			const content = String(mod.default);
			const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
			const minutes = Math.max(1, Math.round(wordCount / 200));

			posts.push({
				slug,
				title: meta.title ?? 'Untitled',
				date: meta.date ?? new Date().toISOString(),
				tags: Array.isArray(meta.tags) ? meta.tags : [],
				description: meta.description ?? '',
				readingTime: `${minutes} phút đọc`,
				published: true
			});
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
