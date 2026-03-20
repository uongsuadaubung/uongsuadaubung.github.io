<script lang="ts">
	import type { Post } from '$lib/posts';
	import { nav } from '$lib/stores/nav';

	let { posts }: { posts: Post[] } = $props();

	let search = $state('');
	let activeTag = $state('');

	const allTags = $derived([...new Set(posts.flatMap((p) => p.tags))].sort());

	const filtered = $derived(
		posts.filter((p) => {
			const matchSearch =
				search === '' ||
				p.title.toLowerCase().includes(search.toLowerCase()) ||
				p.description.toLowerCase().includes(search.toLowerCase());
			const matchTag = activeTag === '' || p.tags.includes(activeTag);
			return matchSearch && matchTag;
		})
	);
</script>

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
			<input type="search" class="search-input" placeholder="Tìm kiếm bài viết..." bind:value={search} />
		</div>
		{#if allTags.length > 0}
			<div class="tag-filter">
				<button class="tag-btn" class:active={activeTag === ''} onclick={() => (activeTag = '')}>Tất cả</button>
				{#each allTags as tag}
					<button class="tag-btn" class:active={activeTag === tag} onclick={() => (activeTag = activeTag === tag ? '' : tag)}>#{tag}</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if filtered.length > 0}
		<p class="results-count">{filtered.length} bài viết</p>
		<div class="posts-grid">
			{#each filtered as post}
				<button class="post-card-wrap" onclick={() => nav.post(post.slug)}>
					<article class="post-card">
						<div class="card-meta">
							<time datetime={post.date}>{new Date(post.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
							{#if post.readingTime}<span class="sep">·</span><span>{post.readingTime}</span>{/if}
						</div>
						<h2 class="card-title">{post.title}</h2>
						{#if post.description}<p class="card-desc">{post.description}</p>{/if}
						{#if post.tags.length > 0}
							<div class="card-tags">
								{#each post.tags as tag}<span class="tag">#{tag}</span>{/each}
							</div>
						{/if}
						<span class="read-more">Đọc bài →</span>
					</article>
				</button>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<div class="empty-icon">🔍</div>
			<p>Không tìm thấy bài viết nào.</p>
			<button onclick={() => { search = ''; activeTag = ''; }}>Xóa bộ lọc</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.page-header {
		padding: var(--space-16) 0 var(--space-10);
		border-bottom: 1px solid var(--border-subtle);
		margin-bottom: var(--space-10);
		background: linear-gradient(to bottom, var(--bg-surface), transparent);

		h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: -0.03em; margin-bottom: var(--space-2); }
		.subtitle { color: var(--text-secondary); font-size: 1.05rem; }
	}

	.blog-layout { padding-bottom: var(--space-20); }

	.controls { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-8); }

	.search-wrap { position: relative; max-width: 400px; }

	.search-icon {
		position: absolute;
		left: var(--space-4);
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 24px);
		background: var(--bg-surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		color: var(--text-primary);
		font-family: var(--font-sans);
		font-size: 0.9rem;
		transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

		&::placeholder { color: var(--text-muted); }
		&:focus { outline: none; border-color: var(--accent-1); box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15); }
	}

	.tag-filter { display: flex; flex-wrap: wrap; gap: var(--space-2); }

	.tag-btn {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		border: 1px solid var(--border);
		background: var(--bg-elevated);
		color: var(--text-secondary);
		font-family: var(--font-sans);
		transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);

		&:hover, &.active { color: var(--accent-1); border-color: var(--accent-1); background: var(--tag-bg); }
	}

	.results-count { font-size: 0.85rem; color: var(--text-muted); margin-bottom: var(--space-5); }

	.posts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-5); }

	.post-card-wrap {
		display: block;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		text-align: left;
		cursor: pointer;
	}

	.post-card {
		padding: var(--space-6);
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		transition: border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base);
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);

		.post-card-wrap:hover & {
			border-color: var(--accent-1);
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), var(--accent-glow);

			.read-more { color: var(--accent-1); transform: translateX(4px); }
			.card-title { color: var(--accent-1); }
		}
	}

	.card-meta { display: flex; align-items: center; gap: var(--space-2); font-size: 0.8rem; color: var(--text-muted); }
	.sep { color: var(--border); }
	.card-title { font-size: 1.2rem; font-weight: 700; color: var(--text-heading); line-height: 1.3; margin: 0; transition: color var(--transition-fast); }
	.card-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.card-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
	.tag { font-size: 0.75rem; color: var(--tag-text); background: var(--tag-bg); border: 1px solid var(--tag-border); padding: 2px var(--space-2); border-radius: var(--radius-full); font-weight: 500; }
	.read-more { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-top: var(--space-2); display: inline-block; transition: color var(--transition-fast), transform var(--transition-fast); }

	.empty-state {
		text-align: center;
		padding: var(--space-16);
		color: var(--text-muted);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);

		.empty-icon { font-size: 3rem; }

		button {
			padding: var(--space-2) var(--space-4);
			border-radius: var(--radius-full);
			border: 1px solid var(--border);
			background: var(--bg-elevated);
			color: var(--accent-1);
			font-family: var(--font-sans);
			cursor: pointer;
			font-size: 0.875rem;
			&:hover { background: var(--tag-bg); }
		}
	}
</style>
