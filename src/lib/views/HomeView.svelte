<script lang="ts">
	import type { Post } from '$lib/posts';
	import PostCard from '$lib/components/PostCard.svelte';
	import { nav } from '$lib/stores/nav';

	let { posts }: { posts: Post[] } = $props();
</script>

<!-- Hero Section -->
<section class="hero">
	<div class="container hero-inner">
		<div class="hero-content animate-fade-in-up">
			<div class="avatar-wrap">
				<div class="avatar">U</div>
				<div class="avatar-glow"></div>
			</div>
			<div class="hero-text">
				<p class="hero-greeting">Xin chào, mình là</p>
				<h1><span class="gradient-text">uongsuadaubung</span></h1>
				<p class="hero-bio">
					Developer · Người hay thử những thứ mới · Viết blog về code, projects và những gì mình học được.
				</p>
				<div class="hero-actions">
					<button class="btn btn-primary" onclick={() => nav.blog()}>Đọc Blog</button>
					<button class="btn btn-secondary" onclick={() => nav.about()}>Về mình</button>
				</div>
			</div>
		</div>
		<div class="hero-tags animate-fade-in">
			{#each ['SvelteKit', 'TypeScript', 'SCSS', 'Web Dev', 'Open Source'] as tag, i}
				<span class="hero-tag" style="animation-delay: {i * 80}ms">{tag}</span>
			{/each}
		</div>
	</div>
</section>

<!-- Recent Posts -->
<section class="recent-posts">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">Bài viết gần đây</h2>
			<button class="section-link" onclick={() => nav.blog()}>Xem tất cả →</button>
		</div>
		{#if posts.length > 0}
			<div class="posts-grid">
				{#each posts as post}
					<PostCard {...post} />
				{/each}
			</div>
		{:else}
			<div class="empty-state"><p>Chưa có bài viết nào. Hãy đón chờ nhé! 🚀</p></div>
		{/if}
	</div>
</section>

<style lang="scss">
	.hero {
		padding: var(--space-20) 0 var(--space-16);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: -10%;
			width: 60%;
			height: 120%;
			background: radial-gradient(ellipse at center, rgba(129, 140, 248, 0.08) 0%, transparent 70%);
			pointer-events: none;
		}
	}

	.hero-inner {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
	}

	.hero-content {
		display: flex;
		align-items: center;
		gap: var(--space-8);

		@media (max-width: 640px) {
			flex-direction: column;
			text-align: center;
		}
	}

	.avatar-wrap { flex-shrink: 0; position: relative; }

	.avatar {
		width: 100px;
		height: 100px;
		border-radius: var(--radius-xl);
		background: var(--accent-gradient);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: 800;
		color: #fff;
		position: relative;
		z-index: 1;

		@media (max-width: 640px) { width: 80px; height: 80px; font-size: 2rem; }
	}

	.avatar-glow {
		position: absolute;
		inset: -4px;
		border-radius: var(--radius-xl);
		background: var(--accent-gradient);
		opacity: 0.3;
		filter: blur(12px);
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.hero-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.hero-greeting {
		font-size: 1rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: -0.03em;
		line-height: 1.1;
	}

	.hero-bio {
		font-size: 1.05rem;
		color: var(--text-secondary);
		max-width: 520px;
		line-height: 1.7;
	}

	.hero-actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;

		@media (max-width: 640px) { justify-content: center; }
	}

	.btn {
		display: inline-flex;
		align-items: center;
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-full);
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		border: none;
		font-family: var(--font-sans);
		transition: transform var(--transition-fast), box-shadow var(--transition-fast);

		&:hover { transform: translateY(-2px); }

		&-primary {
			background: var(--accent-gradient);
			color: #fff;
			box-shadow: 0 4px 15px rgba(129, 140, 248, 0.3);
			&:hover { box-shadow: 0 8px 25px rgba(129, 140, 248, 0.45); }
		}

		&-secondary {
			background: var(--bg-elevated);
			color: var(--text-primary);
			border: 1px solid var(--border);
			&:hover { border-color: var(--accent-1); color: var(--accent-1); background: var(--tag-bg); }
		}
	}

	.hero-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.hero-tag {
		padding: var(--space-2) var(--space-3);
		background: var(--bg-elevated);
		border: 1px solid var(--border);
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		color: var(--text-secondary);
		font-weight: 500;
		animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
		transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);

		&:hover { color: var(--accent-1); border-color: var(--accent-1); background: var(--tag-bg); }
	}

	.recent-posts { padding: var(--space-12) 0 var(--space-20); }

	.section-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: var(--space-8);
	}

	.section-title { font-size: 1.5rem; color: var(--text-heading); }

	.section-link {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--accent-1);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: color var(--transition-fast);
		&:hover { color: var(--accent-2); }
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-5);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-12);
		color: var(--text-muted);
		background: var(--bg-surface);
		border: 1px dashed var(--border);
		border-radius: var(--radius-lg);
	}
</style>
