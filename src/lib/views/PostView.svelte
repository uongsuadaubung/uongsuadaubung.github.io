<script lang="ts">
	import { nav } from '$lib/stores/nav';
	import '$lib/styles/markdown.scss';
	import type { Component } from 'svelte';

	let { slug }: { slug: string } = $props();

	// Dynamically import the markdown post
	type PostModule = { default: Component; metadata: Record<string, unknown> };
	let postModule = $state<PostModule | null>(null);
	let loading = $state(true);
	let notFound = $state(false);

	$effect(() => {
		loading = true;
		notFound = false;
		postModule = null;

		import(`../../posts/${slug}.md`)
			.then((mod) => {
				postModule = mod as PostModule;
				loading = false;
			})
			.catch(() => {
				notFound = true;
				loading = false;
			});
	});

	const PostContent = $derived(postModule?.default);

	const meta = $derived(postModule?.metadata ?? {});
	const title = $derived(String(meta.title ?? 'Untitled'));
	const date = $derived(String(meta.date ?? ''));
	const tags = $derived(Array.isArray(meta.tags) ? (meta.tags as string[]) : []);
	const formatted = $derived(
		date
			? new Date(date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
			: ''
	);
</script>

<div class="post-page">
	<div class="content-container">
		<button class="back-link" onclick={() => nav.blog()}>← Về Blog</button>

		{#if loading}
			<div class="loading">
				<div class="spinner"></div>
				<p>Đang tải bài viết...</p>
			</div>
		{:else if notFound}
			<div class="not-found">
				<p>Không tìm thấy bài viết này.</p>
				<button onclick={() => nav.blog()}>← Về Blog</button>
			</div>
		{:else if postModule}
			<header class="post-header">
				{#if tags.length > 0}
					<div class="post-tags">
						{#each tags as tag}<span class="tag">#{tag}</span>{/each}
					</div>
				{/if}
				<div class="post-meta">
					{#if formatted}<time datetime={date}>{formatted}</time>{/if}
				</div>
				<div class="post-divider"></div>
			</header>

			<article class="markdown-body">
				<PostContent />
			</article>

			<div class="post-footer">
				<button class="back-btn" onclick={() => nav.blog()}>← Xem tất cả bài viết</button>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.post-page { padding: var(--space-10) 0 var(--space-20); }

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 0.875rem;
		color: var(--text-muted);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		margin-bottom: var(--space-8);
		transition: color var(--transition-fast);
		padding: 0;

		&:hover { color: var(--accent-1); }
	}

	.loading, .not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-16);
		color: var(--text-muted);
		text-align: center;
	}

	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--border);
		border-top-color: var(--accent-1);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.post-header { margin-bottom: var(--space-10); }

	.post-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }

	.tag {
		font-size: 0.75rem;
		color: var(--tag-text);
		background: var(--tag-bg);
		border: 1px solid var(--tag-border);
		padding: 2px var(--space-2);
		border-radius: var(--radius-full);
		font-weight: 500;
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.post-divider { width: 100%; height: 1px; background: var(--border); margin-top: var(--space-6); }

	.post-footer {
		margin-top: var(--space-16);
		padding-top: var(--space-8);
		border-top: 1px solid var(--border);
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-full);
		border: 1px solid var(--border);
		background: var(--bg-elevated);
		color: var(--text-secondary);
		font-size: 0.9rem;
		font-family: var(--font-sans);
		cursor: pointer;
		transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);

		&:hover { color: var(--accent-1); border-color: var(--accent-1); background: var(--tag-bg); }
	}
</style>
