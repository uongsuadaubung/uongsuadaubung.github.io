<script lang="ts">
	import { nav } from '$lib/stores/nav';

	interface Props {
		title: string;
		slug: string;
		date: string;
		tags?: string[];
		description?: string;
		readingTime?: string;
	}

	let { title, slug, date, tags = [], description, readingTime }: Props = $props();

	const formatted = $derived(new Date(date).toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}));
</script>

<button class="post-card" onclick={() => nav.post(slug)}>
	<article>
		<div class="card-meta">
			<time datetime={date}>{formatted}</time>
			{#if readingTime}
				<span class="separator">·</span>
				<span>{readingTime}</span>
			{/if}
		</div>

		<h2 class="card-title">{title}</h2>

		{#if description}
			<p class="card-description">{description}</p>
		{/if}

		{#if tags.length > 0}
			<div class="card-tags">
				{#each tags as tag}
					<span class="tag">#{tag}</span>
				{/each}
			</div>
		{/if}

		<span class="read-more">
			Đọc bài →
		</span>
	</article>
</button>

<style lang="scss">
	.post-card {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--font-sans);
		article {
			padding: var(--space-6);
			background: var(--bg-card);
			border: 1px solid var(--border);
			border-radius: var(--radius-lg);
			transition:
				border-color var(--transition-base),
				transform var(--transition-base),
				box-shadow var(--transition-base);
			height: 100%;
			display: flex;
			flex-direction: column;
			gap: var(--space-3);
			position: relative;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				inset: 0;
				background: var(--accent-gradient);
				opacity: 0;
				transition: opacity var(--transition-base);
				border-radius: inherit;
			}
		}

		&:hover article {
			border-color: var(--accent-1);
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), var(--accent-glow);

			.read-more {
				color: var(--accent-1);
				transform: translateX(4px);
			}
		}
	}

	.card-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: 0.8rem;
		color: var(--text-muted);

		time { font-variant-numeric: tabular-nums; }
	}

	.separator { color: var(--border); }

	.card-title {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--text-heading);
		line-height: 1.3;
		letter-spacing: -0.02em;
		margin: 0;
		transition: color var(--transition-fast);
	}

	.post-card:hover .card-title {
		color: var(--accent-1);
	}

	.card-description {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.6;
		flex: 1;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.tag {
		font-size: 0.75rem;
		color: var(--tag-text);
		background: var(--tag-bg);
		border: 1px solid var(--tag-border);
		padding: 2px var(--space-2);
		border-radius: var(--radius-full);
		font-weight: 500;
	}

	.read-more {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-top: var(--space-2);
		display: inline-block;
		transition:
			color var(--transition-fast),
			transform var(--transition-fast);
	}
</style>
