import { createSignal, createEffect, Show, For } from 'solid-js';
import { getPostBySlug } from '../posts';
import type { PostDetail } from '../posts';
import { nav } from '../nav';
import '../styles/markdown.scss';
import './PostView.scss';

interface Props {
	slug: string;
}

export default function PostView(props: Props) {
	const [post, setPost] = createSignal<PostDetail | null>(null);
	const [loading, setLoading] = createSignal(true);
	const [notFound, setNotFound] = createSignal(false);

	createEffect(async () => {
		setLoading(true);
		setNotFound(false);
		setPost(null);

		const result = await getPostBySlug(props.slug);
		if (result) {
			setPost(result);
		} else {
			setNotFound(true);
		}
		setLoading(false);
	});

	const formattedDate = () => {
		const p = post();
		if (!p) return '';
		try {
			return new Date(p.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
		} catch {
			return p.date;
		}
	};

	return (
		<div class="post-page">
			<div class="content-container">
				<button class="back-link" onClick={nav.blog}>← Về Blog</button>

				<Show when={loading()}>
					<div class="loading">
						<div class="spinner"></div>
						<p>Đang tải bài viết...</p>
					</div>
				</Show>

				<Show when={notFound() && !loading()}>
					<div class="not-found">
						<p>Không tìm thấy bài viết này.</p>
						<button onClick={nav.blog}>← Về Blog</button>
					</div>
				</Show>

				<Show when={post() && !loading()}>
					{(() => {
						const p = post()!;
						return (
							<>
								<header class="post-header">
									<Show when={p.tags && p.tags.length > 0}>
										<div class="post-tags">
											<For each={p.tags}>
												{(tag) => <span class="tag">#{tag}</span>}
											</For>
										</div>
									</Show>
									<div class="post-meta">
										<Show when={formattedDate()}>
											<time datetime={p.date}>{formattedDate()}</time>
										</Show>
										<span class="sep">·</span>
										<span>{p.readingTime}</span>
									</div>
									<h1>{p.title}</h1>
									<div class="post-divider"></div>
								</header>

								<article class="markdown-body" innerHTML={p.content} />

								<div class="post-footer">
									<button class="back-btn" onClick={nav.blog}>← Xem tất cả bài viết</button>
								</div>
							</>
						);
					})()}
				</Show>
			</div>
		</div>
	);
}
