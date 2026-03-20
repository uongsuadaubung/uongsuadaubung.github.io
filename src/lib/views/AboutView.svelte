<script lang="ts">
	import { nav } from '$lib/stores/nav';

	const skills = [
		{ category: 'Frontend', items: ['SvelteKit', 'TypeScript', 'SCSS/Sass', 'HTML5', 'Vite'] },
		{ category: 'Backend', items: ['Node.js', 'Python', 'REST API'] },
		{ category: 'Tools', items: ['Git', 'GitHub Actions', 'Linux', 'VS Code'] }
	];

	const timeline = [
		{ year: '2026', title: 'Tạo blog cá nhân', description: 'Xây dựng trang blog + CV này với SvelteKit, SCSS và mdsvex.', type: 'project' },
		{ year: '2025', title: 'Học lập trình web', description: 'Bắt đầu học HTML, CSS, JavaScript và framework hiện đại.', type: 'learning' }
	];

	const contacts = [
		{
			label: 'GitHub', value: 'github.com/uongsuadaubung', href: 'https://github.com/uongsuadaubung',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`
		},
		{
			label: 'Email', value: 'contact@uongsuadaubung.github.io', href: 'mailto:contact@uongsuadaubung.github.io',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
		}
	];
</script>

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
						{#each contacts as c}
							<a href={c.href} target="_blank" rel="noopener noreferrer" class="contact-chip">
								{@html c.icon}<span>{c.label}</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="container about-body">
		<section class="section">
			<h2 class="section-title">Kỹ năng</h2>
			<div class="skills-grid">
				{#each skills as group}
					<div class="skill-card">
						<h3 class="skill-category">{group.category}</h3>
						<div class="skill-tags">
							{#each group.items as item}<span class="skill-tag">{item}</span>{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="section-title">Timeline</h2>
			<div class="timeline">
				{#each timeline as item, i}
					<div class="timeline-item" style="animation-delay: {i * 100}ms">
						<div class="timeline-dot" class:project={item.type === 'project'}></div>
						<div class="timeline-content">
							<span class="timeline-year">{item.year}</span>
							<h3 class="timeline-title">{item.title}</h3>
							<p class="timeline-desc">{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<section class="section contact-section">
			<h2 class="section-title">Liên hệ</h2>
			<p class="contact-intro">Bạn muốn nói chuyện về code, hợp tác, hay chỉ đơn giản là chào hỏi? Mình luôn sẵn sàng!</p>
			<div class="contact-cards">
				{#each contacts as c}
					<a href={c.href} target="_blank" rel="noopener noreferrer" class="contact-card">
						<div class="contact-icon">{@html c.icon}</div>
						<div class="contact-info">
							<span class="contact-label">{c.label}</span>
							<span class="contact-value">{c.value}</span>
						</div>
						<div class="contact-arrow">→</div>
					</a>
				{/each}
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	.about-page { padding-bottom: var(--space-20); }

	.about-hero {
		padding: var(--space-16) 0;
		background: linear-gradient(to bottom, var(--bg-surface), transparent);
		border-bottom: 1px solid var(--border-subtle);
		margin-bottom: var(--space-12);
	}

	.hero-card { display: flex; align-items: flex-start; gap: var(--space-8); @media (max-width: 640px) { flex-direction: column; align-items: center; text-align: center; } }
	.avatar-wrap { flex-shrink: 0; position: relative; }
	.avatar { width: 120px; height: 120px; border-radius: var(--radius-xl); background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; color: #fff; position: relative; z-index: 1; }
	.avatar-glow { position: absolute; inset: -6px; border-radius: var(--radius-xl); background: var(--accent-gradient); opacity: 0.25; filter: blur(16px); animation: pulse-glow 3s ease-in-out infinite; }
	.hero-info { display: flex; flex-direction: column; gap: var(--space-3); }
	h1 { font-size: clamp(2rem, 4vw, 3rem); letter-spacing: -0.03em; line-height: 1; }
	.tagline { font-size: 1rem; color: var(--text-secondary); font-weight: 500; }
	.bio { font-size: 1rem; color: var(--text-secondary); line-height: 1.75; max-width: 560px; }
	.contact-row { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-2); @media (max-width: 640px) { justify-content: center; } }
	.contact-chip { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); border-radius: var(--radius-full); border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; text-decoration: none; transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast), transform var(--transition-fast); &:hover { color: var(--accent-1); border-color: var(--accent-1); background: var(--tag-bg); transform: translateY(-2px); } }

	.about-body { display: flex; flex-direction: column; gap: var(--space-16); }
	.section-title { font-size: 1.5rem; margin-bottom: var(--space-6); color: var(--text-heading); position: relative; padding-left: var(--space-4); &::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 1.2em; background: var(--accent-gradient); border-radius: var(--radius-full); } }

	.skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-4); }
	.skill-card { padding: var(--space-5); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); transition: border-color var(--transition-base), transform var(--transition-base); &:hover { border-color: var(--accent-1); transform: translateY(-2px); } }
	.skill-category { font-size: 0.85rem; font-weight: 700; color: var(--accent-1); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: var(--space-3); }
	.skill-tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
	.skill-tag { font-size: 0.8rem; padding: 3px var(--space-2); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-secondary); font-weight: 500; }

	.timeline { position: relative; padding-left: var(--space-8); &::before { content: ''; position: absolute; left: 11px; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(to bottom, var(--accent-1), transparent); } }
	.timeline-item { position: relative; margin-bottom: var(--space-8); animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; &:last-child { margin-bottom: 0; } }
	.timeline-dot { position: absolute; left: calc(-1 * var(--space-8) + var(--space-2)); top: 6px; width: 12px; height: 12px; border-radius: var(--radius-full); background: var(--bg-elevated); border: 2px solid var(--border); &.project { background: var(--accent-1); border-color: var(--accent-1); box-shadow: 0 0 12px rgba(129, 140, 248, 0.4); } }
	.timeline-year { font-size: 0.75rem; font-weight: 700; color: var(--accent-1); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: var(--space-1); }
	.timeline-title { font-size: 1.05rem; font-weight: 700; color: var(--text-heading); margin-bottom: var(--space-2); }
	.timeline-desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; }

	.contact-intro { color: var(--text-secondary); margin-bottom: var(--space-6); line-height: 1.7; }
	.contact-cards { display: flex; flex-direction: column; gap: var(--space-3); max-width: 480px; }
	.contact-card { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) var(--space-5); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); text-decoration: none; transition: border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base); &:hover { border-color: var(--accent-1); transform: translateX(4px); box-shadow: var(--accent-glow); } }
	.contact-icon { color: var(--accent-1); flex-shrink: 0; }
	.contact-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
	.contact-label { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
	.contact-value { font-size: 0.9rem; color: var(--text-primary); }
	.contact-arrow { color: var(--accent-1); font-size: 1.1rem; transition: transform var(--transition-fast); }
	.contact-card:hover .contact-arrow { transform: translateX(4px); }
</style>
