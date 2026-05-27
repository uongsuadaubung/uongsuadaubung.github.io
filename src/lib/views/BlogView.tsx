import { createSignal, createMemo, onMount, For, Show } from 'solid-js';
import { getPosts } from '../posts';
import type { Post } from '../posts';
import { nav } from '../nav';
import './BlogView.scss';

export default function BlogView() {
	const [posts, setPosts] = createSignal<Post[]>([]);
	const [search, setSearch] = createSignal('');
	const [activeTag, setActiveTag] = createSignal('');

	onMount(async () => {
		const all = await getPosts();
		setPosts(all);
	});

	const allTags = createMemo(() => {
		const tags = posts().flatMap((p) => p.tags);
		return [...new Set(tags)].sort();
	});

	const filtered = createMemo(() => {
		return posts().filter((p) => {
			const matchSearch =
				search() === '' ||
				p.title.toLowerCase().includes(search().toLowerCase()) ||
				p.description.toLowerCase().includes(search().toLowerCase());
			const matchTag = activeTag() === '' || p.tags.includes(activeTag());
			return matchSearch && matchTag;
		});
	});

	const formatCardDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
		} catch {
			return dateStr;
		}
	};

	return (
		<div class="blog-page">
			<div class="page-header">
				<div class="container">
					<h1>Blog</h1>
					<p class="subtitle">Ghi chép, suy nghĩ và những thứ mình học được.</p>
				</div>
			</div>

			<div class="container blog-layout">
				<div class="controls">
					<div class="search-wrap">
						<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
						</svg>
						<input
							type="search"
							class="search-input"
							placeholder="Tìm kiếm bài viết..."
							value={search()}
							onInput={(e) => setSearch(e.currentTarget.value)}
						/>
					</div>
					<Show when={allTags().length > 0}>
						<div class="tag-filter">
							<button
								class={`tag-btn ${activeTag() === '' ? 'active' : ''}`}
								onClick={() => setActiveTag('')}
							>
								Tất cả
							</button>
							<For each={allTags()}>
								{(tag) => (
									<button
										class={`tag-btn ${activeTag() === tag ? 'active' : ''}`}
										onClick={() => setActiveTag(activeTag() === tag ? '' : tag)}
									>
										#{tag}
									</button>
								)}
							</For>
						</div>
					</Show>
				</div>

				<Show
					when={filtered().length > 0}
					fallback={
						<div class="empty-state">
							<div class="empty-icon">🔍</div>
							<p>Không tìm thấy bài viết nào.</p>
							<button onClick={() => { setSearch(''); setActiveTag(''); }}>Xóa bộ lọc</button>
						</div>
					}
				>
					<p class="results-count">{filtered().length} bài viết</p>
					<div class="posts-grid">
						<For each={filtered()}>
							{(post) => (
								<button class="post-card-wrap" onClick={() => nav.post(post.slug)}>
									<article class="post-card">
										<div class="card-meta">
											<time datetime={post.date}>{formatCardDate(post.date)}</time>
											<Show when={post.readingTime}>
												<span class="sep">·</span>
												<span>{post.readingTime}</span>
											</Show>
										</div>
										<h2 class="card-title">{post.title}</h2>
										<Show when={post.description}>
											<p class="card-desc">{post.description}</p>
										</Show>
										<Show when={post.tags.length > 0}>
											<div class="card-tags">
												<For each={post.tags}>
													{(tag) => <span class="tag">#{tag}</span>}
												</For>
											</div>
										</Show>
										<span class="read-more">Đọc bài →</span>
									</article>
								</button>
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	);
}
