import { For } from 'solid-js';
import MiniGame from '../components/MiniGame';
import './AboutView.scss';

export default function AboutView() {
	const skills = [
		{ category: 'Frontend', items: ['Solid JS', 'TypeScript', 'SCSS/Sass', 'HTML5', 'Vite'] },
		{ category: 'Backend', items: ['Deno', 'Node.js', 'Python', 'REST API'] },
		{ category: 'Tools', items: ['Git', 'GitHub Actions', 'Linux', 'VS Code'] }
	];

	const timeline = [
		{ year: '2026', title: 'Tạo blog cá nhân', description: 'Xây dựng trang blog + CV này với Solid JS, SCSS và marked.', type: 'project' },
		{ year: '2025', title: 'Học lập trình web', description: 'Bắt đầu học HTML, CSS, JavaScript và framework hiện đại.', type: 'learning' }
	];

	const contacts = [
		{
			label: 'GitHub',
			value: 'github.com/uongsuadaubung',
			href: 'https://github.com/uongsuadaubung',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			)
		},
		{
			label: 'Email',
			value: 'contact@uongsuadaubung.github.io',
			href: 'mailto:contact@uongsuadaubung.github.io',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
					<polyline points="22,6 12,13 2,6"/>
				</svg>
			)
		}
	];

	return (
		<div class="about-page">
			<section class="about-hero">
				<div class="container">
					<div class="hero-card animate-fade-in-up">
						<div class="avatar-wrap">
							<div class="avatar">U</div>
							<div class="avatar-glow"></div>
						</div>
						<div class="hero-info">
							<h1><span class="gradient-text">uongsuadaubung</span></h1>
							<p class="tagline">Developer · Blog Writer · Life-long Learner</p>
							<p class="bio">
								Mình là một lập trình viên đang khám phá thế giới web development.
								Trang này là nơi mình chia sẻ những gì mình học được, những project
								đang làm, và những suy nghĩ trong quá trình phát triển bản thân.
							</p>
							<div class="contact-row">
								<For each={contacts}>
									{(c) => (
										<a href={c.href} target="_blank" rel="noopener noreferrer" class="contact-chip">
											{c.icon}<span>{c.label}</span>
										</a>
									)}
								</For>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div class="container about-body">
				<section class="section game-section">
					<MiniGame />
				</section>

				<section class="section">
					<h2 class="section-title">Kỹ năng</h2>
					<div class="skills-grid">
						<For each={skills}>
							{(group) => (
								<div class="skill-card">
									<h3 class="skill-category">{group.category}</h3>
									<div class="skill-tags">
										<For each={group.items}>
											{(item) => <span class="skill-tag">{item}</span>}
										</For>
									</div>
								</div>
							)}
						</For>
					</div>
				</section>

				<section class="section">
					<h2 class="section-title">Timeline</h2>
					<div class="timeline">
						<For each={timeline}>
							{(item, i) => (
								<div class="timeline-item" style={{ "animation-delay": `${i() * 100}ms` }}>
									<div class={`timeline-dot ${item.type === 'project' ? 'project' : ''}`}></div>
									<div class="timeline-content">
										<span class="timeline-year">{item.year}</span>
										<h3 class="timeline-title">{item.title}</h3>
										<p class="timeline-desc">{item.description}</p>
									</div>
								</div>
							)}
						</For>
					</div>
				</section>

				<section class="section contact-section">
					<h2 class="section-title">Liên hệ</h2>
					<p class="contact-intro">Bạn muốn nói chuyện về code, hợp tác, hay chỉ đơn giản là chào hỏi? Mình luôn sẵn sàng!</p>
					<div class="contact-cards">
						<For each={contacts}>
							{(c) => (
								<a href={c.href} target="_blank" rel="noopener noreferrer" class="contact-card">
									<div class="contact-icon">{c.icon}</div>
									<div class="contact-info">
										<span class="contact-label">{c.label}</span>
										<span class="contact-value">{c.value}</span>
									</div>
									<div class="contact-arrow">→</div>
								</a>
							)}
						</For>
					</div>
				</section>
			</div>
		</div>
	);
}
