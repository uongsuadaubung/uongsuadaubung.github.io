<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let current = $state<'dark' | 'light'>('dark');

	onMount(() => {
		mounted = true;
		current = $theme as 'dark' | 'light';
	});

	function toggle() {
		theme.toggle();
		current = current === 'dark' ? 'light' : 'dark';
	}
</script>

<button onclick={toggle} aria-label="Toggle theme" class="theme-toggle" class:mounted>
	{#if current === 'dark'}
		<!-- Sun icon -->
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="5"/>
			<line x1="12" y1="1" x2="12" y2="3"/>
			<line x1="12" y1="21" x2="12" y2="23"/>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
			<line x1="1" y1="12" x2="3" y2="12"/>
			<line x1="21" y1="12" x2="23" y2="12"/>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
		</svg>
	{/if}
</button>

<style lang="scss">
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: var(--radius-full);
		border: 1px solid var(--border);
		background: var(--bg-elevated);
		color: var(--text-secondary);
		cursor: pointer;
		opacity: 0;
		transform: scale(0.8);
		transition:
			opacity var(--transition-base),
			transform var(--transition-base),
			color var(--transition-fast),
			background var(--transition-fast),
			border-color var(--transition-fast);

		&.mounted {
			opacity: 1;
			transform: scale(1);
		}

		&:hover {
			color: var(--accent-1);
			border-color: var(--accent-1);
			background: var(--tag-bg);
		}

		svg {
			transition: transform var(--transition-base);
		}

		&:active svg {
			transform: rotate(30deg) scale(0.9);
		}
	}
</style>
