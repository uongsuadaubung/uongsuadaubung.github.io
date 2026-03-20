<script lang="ts">
	import HomeView from '$lib/views/HomeView.svelte';
	import BlogView from '$lib/views/BlogView.svelte';
	import PostView from '$lib/views/PostView.svelte';
	import AboutView from '$lib/views/AboutView.svelte';
	import { nav } from '$lib/stores/nav';
	import { getPosts } from '$lib/posts';
	import type { Post } from '$lib/posts';

	let { data }: { data: { posts: Post[] } } = $props();
	let currentView = $state($nav);

	nav.subscribe((v) => (currentView = v));
</script>

<svelte:head>
	<title>uongsuadaubung — Blog & Portfolio</title>
	<meta name="description" content="Blog cá nhân về lập trình, công nghệ và những thứ mình đang làm." />
</svelte:head>

<div class="app-view" class:fade={true}>
	{#if currentView.id === 'home'}
		<HomeView posts={data.posts.slice(0, 3)} />
	{:else if currentView.id === 'blog'}
		<BlogView posts={data.posts} />
	{:else if currentView.id === 'post'}
		<PostView slug={currentView.slug} />
	{:else if currentView.id === 'about'}
		<AboutView />
	{/if}
</div>

<style lang="scss">
	.app-view {
		animation: fadeIn 0.25s ease both;
	}
</style>
