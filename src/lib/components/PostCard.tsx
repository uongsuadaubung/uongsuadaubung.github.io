import { For, Show } from 'solid-js';
import { nav } from '../nav';
import './PostCard.scss';

interface Props {
	title: string;
	slug: string;
	date: string;
	tags?: string[];
	description?: string;
	readingTime?: string;
}

export default function PostCard(props: Props) {
	const tags = () => props.tags || [];
	const formattedDate = () => {
		try {
			return new Date(props.date).toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return props.date;
		}
	};

	return (
		<button class="post-card" onClick={() => nav.post(props.slug)}>
			<article>
				<div class="card-meta">
					<time datetime={props.date}>{formattedDate()}</time>
					<Show when={props.readingTime}>
						<span class="separator">·</span>
						<span>{props.readingTime}</span>
					</Show>
				</div>

				<h2 class="card-title">{props.title}</h2>

				<Show when={props.description}>
					<p class="card-description">{props.description}</p>
				</Show>

				<Show when={tags().length > 0}>
					<div class="card-tags">
						<For each={tags()}>
							{(tag) => <span class="tag">#{tag}</span>}
						</For>
					</div>
				</Show>

				<span class="read-more">
					Đọc bài →
				</span>
			</article>
		</button>
	);
}
