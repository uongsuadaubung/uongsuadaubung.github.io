import { createSignal, For, onMount, Show } from 'solid-js';
import { getPosts } from '../posts';
import type { Post } from '../posts';
import PostCard from '../components/PostCard';
import { nav } from '../nav';
import './HomeView.scss';

export default function HomeView() {
	const [recentPosts, setRecentPosts] = createSignal<Post[]>([]);

	const heroTags = ['Solid JS', 'TypeScript', 'SCSS', 'Web Dev', 'Open Source'];

	onMount(async () => {
		const all = await getPosts();
		setRecentPosts(all.slice(0, 3));
	});

	return (
		<div class="home-page">
			{/* Hero Section */}
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
								<button class="btn btn-primary" onClick={nav.blog}>Đọc Blog</button>
								<button class="btn btn-secondary" onClick={nav.about}>Về mình</button>
							</div>
						</div>
					</div>
					<div class="hero-tags animate-fade-in">
						<For each={heroTags}>
							{(tag, i) => (
								<span class="hero-tag" style={{ "animation-delay": `${i() * 80}ms` }}>{tag}</span>
							)}
						</For>
					</div>
				</div>
			</section>

			{/* Recent Posts */}
			<section class="recent-posts">
				<div class="container">
					<div class="section-header">
						<h2 class="section-title">Bài viết gần đây</h2>
						<button class="section-link" onClick={nav.blog}>Xem tất cả →</button>
					</div>
					<Show
						when={recentPosts().length > 0}
						fallback={
							<div class="empty-state">
								<p>Chưa có bài viết nào. Hãy đón chờ nhé! 🚀</p>
							</div>
						}
					>
						<div class="posts-grid">
							<For each={recentPosts()}>
								{(post) => <PostCard {...post} />}
							</For>
						</div>
					</Show>
				</div>
			</section>
		</div>
	);
}
