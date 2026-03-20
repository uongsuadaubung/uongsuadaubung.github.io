<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import '../app.scss';

	let { children } = $props();

	onMount(() => {
		const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
		if (stored) {
			theme.set(stored);
		}
	});
</script>

<Navbar />
<main class="main-content">
	{@render children()}
</main>
<Footer />

<style lang="scss">
	.main-content {
		flex: 1;
		width: 100%;
	}
</style>
