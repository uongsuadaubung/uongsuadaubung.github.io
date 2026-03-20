<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { nav } from '$lib/stores/nav';

	let mobileOpen = $state(false);

	const navLinks = [
		{ id: 'home', label: 'Home' },
		{ id: 'blog', label: 'Blog' },
		{ id: 'about', label: 'About' }
	] as const;

	let currentId = $state('home');
	nav.subscribe((v) => (currentId = v.id));

	function go(id: 'home' | 'blog' | 'about') {
		nav[id]();
		mobileOpen = false;
	}
</script>

<header class="navbar">
	<div class="container navbar-inner">
		<button class="logo" onclick={() => go('home')}>
			<span class="logo-mark">✦</span>
			<span class="logo-text">uongsuadaubung</span>
		</button>

		<nav class="nav-links" aria-label="Main navigation">
			{#each navLinks as link}
				<button
					class="nav-link"
					class:active={currentId === link.id || (link.id === 'blog' && currentId === 'post')}
					onclick={() => go(link.id)}
				>
					{link.label}
				</button>
			{/each}
		</nav>

		<div class="nav-actions">
			<ThemeToggle />
			<button class="hamburger" onclick={() => (mobileOpen = !mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
				<span></span><span></span><span></span>
			</button>
		</div>
	</div>

	<div class="mobile-menu" class:open={mobileOpen}>
		{#each navLinks as link}
			<button class="mobile-link" class:active={currentId === link.id} onclick={() => go(link.id)}>
				{link.label}
			</button>
		{/each}
	</div>
</header>

<style lang="scss">
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid var(--border-subtle);
		transition: border-color var(--transition-base);
		background: rgba(13, 15, 20, 0.8);

		:global([data-theme='light']) & {
			background: rgba(248, 249, 252, 0.85);
		}
	}

	.navbar-inner {
		display: flex;
		align-items: center;
		height: 64px;
		gap: var(--space-6);
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: 700;
		font-size: 1.05rem;
		color: var(--text-heading);
		white-space: nowrap;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		padding: 0;
		transition: opacity var(--transition-fast);

		&:hover { opacity: 0.8; }

		.logo-mark {
			background: var(--accent-gradient);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
			font-size: 1.3rem;
		}
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-left: auto;

		@media (max-width: 640px) { display: none; }
	}

	.nav-link {
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		transition: color var(--transition-fast), background var(--transition-fast);
		position: relative;

		&:hover {
			color: var(--text-primary);
			background: var(--bg-hover);
		}

		&.active {
			color: var(--accent-1);
			background: var(--tag-bg);
		}
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);

		@media (min-width: 641px) { .hamburger { display: none; } }
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 38px;
		height: 38px;
		padding: var(--space-2);
		border-radius: var(--radius-md);
		border: 1px solid var(--border);
		background: var(--bg-elevated);
		cursor: pointer;

		span {
			display: block;
			height: 2px;
			background: var(--text-secondary);
			border-radius: var(--radius-full);
			transition: background var(--transition-fast);
		}

		&:hover span { background: var(--accent-1); }
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		max-height: 0;
		overflow: hidden;
		transition: max-height var(--transition-slow);
		border-top: 1px solid transparent;

		&.open {
			max-height: 300px;
			border-top-color: var(--border-subtle);
		}

		@media (min-width: 641px) { display: none; }
	}

	.mobile-link {
		padding: var(--space-4) var(--space-6);
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: none;
		border: none;
		border-bottom: 1px solid var(--border-subtle);
		font-family: var(--font-sans);
		text-align: left;
		cursor: pointer;
		transition: color var(--transition-fast), background var(--transition-fast);

		&:hover, &.active {
			color: var(--accent-1);
			background: var(--tag-bg);
		}
	}
</style>
