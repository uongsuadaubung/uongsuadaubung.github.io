import { For, Show, createResource } from 'solid-js';
import MiniGame from '../components/MiniGame';
import { generateCvPdf } from '../helpers/pdfGenerator';
import { resumeData } from '../data/resumeData';
import { getResumeSideProjects } from '../posts';
import './AboutView.scss';

export default function AboutView() {
	const info = resumeData.personalInfo;
	const [dynamicSideProjects] = createResource(getResumeSideProjects);

	const sideProjects = () => {
		const dynamic = dynamicSideProjects();
		return dynamic && dynamic.length > 0 ? dynamic : resumeData.sideProjects;
	};

	const contactIcons = {
		email: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
				<polyline points="22,6 12,13 2,6"/>
			</svg>
		),
		phone: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
			</svg>
		),
		github: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
			</svg>
		),
		location: (
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
				<circle cx="12" cy="10" r="3"/>
			</svg>
		)
	};

	return (
		<div class="about-page">
			{/* Hero Section */}
			<section class="about-hero">
				<div class="container">
					<div class="hero-card animate-fade-in-up">
						<div class="avatar-wrap">
							<div class="avatar">U</div>
							<div class="avatar-glow"></div>
						</div>
						<div class="hero-info">
							<h1><span class="gradient-text">{info.name}</span></h1>
							<p class="tagline">{info.tagline}</p>
							<p class="bio">{info.bio}</p>
							<div class="contact-row">
								<For each={resumeData.contacts}>
									{(c) => (
										<a
											href={c.href}
											target={c.href.startsWith('http') ? '_blank' : '_self'}
											rel="noopener noreferrer"
											class="contact-chip"
										>
											{contactIcons[c.type]}<span>{c.value}</span>
										</a>
									)}
								</For>
								<button
									onClick={generateCvPdf}
									class="download-cv-chip"
									title="Xuất & tải file CV PDF đầy đủ 100% bằng thư viện html2pdf.js / jsPDF"
								>
									📥 Tải CV Đầy Đủ (PDF)
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content Sections */}
			<div class="container about-body">

				{/* 🎮 Mini Game Section */}
				<section class="section game-section">
					<h2 class="section-title">🎮 Mini Game: Bắt Hộp Sữa</h2>
					<p class="game-intro">Tương tác trực tiếp bằng chuột hoặc di chuyển chiếc xô để bắt những hộp sữa uongsuadaubung rơi xuống!</p>
					<MiniGame />
				</section>

				{/* 💼 Work Experience */}
				<section class="section">
					<h2 class="section-title">💼 Kinh nghiệm làm việc</h2>
					<For each={resumeData.experiences}>
						{(exp) => (
							<div class="cv-card">
								<div class="card-header">
									<div>
										<h3 class="company-name">{exp.company}</h3>
										<span class="job-role">{exp.role}</span>
									</div>
									<span class="job-date">{exp.period}</span>
								</div>
								<div class="card-details">
									<p class="summary-text">{exp.summary}</p>
									<div class="tech-stack-chips">
										<For each={exp.techStack}>
											{(chip) => <span class="chip">{chip}</span>}
										</For>
									</div>
								</div>
							</div>
						)}
					</For>
				</section>

				{/* 🏛️ Company Projects */}
				<section class="section">
					<h2 class="section-title">🏛️ Dự án công ty nổi bật</h2>
					<div class="projects-list">
						<For each={resumeData.companyProjects}>
							{(proj) => (
								<div class="project-detail-card">
									<div class="proj-top">
										<div>
											<h3 class="proj-name">
												<Show when={proj.link} fallback={proj.name}>
													<a href={proj.link} target="_blank" rel="noopener noreferrer" class="proj-link">{proj.name} ↗</a>
												</Show>
											</h3>
											<span class="proj-client">
												{proj.client ? `Khách hàng: ${proj.client}` : ''} 
												{proj.teamSize ? ` | Quy mô: ${proj.teamSize}` : ''}
											</span>
										</div>
										<span class="proj-period">{proj.period}</span>
									</div>
									<p class="proj-tech-line"><strong>Công nghệ:</strong> {proj.tech}</p>
									<ul class="proj-bullets">
										<For each={proj.tasks}>
											{(task) => <li>{task}</li>}
										</For>
									</ul>
								</div>
							)}
						</For>
					</div>
				</section>

				{/* 🚀 Side Projects */}
				<section class="section">
					<h2 class="section-title">🚀 Dự án cá nhân & Open Source</h2>
					<div class="side-projects-grid">
						<For each={sideProjects()}>
							{(sp) => (
								<div class="side-card">
									<div class="side-header">
										<h3 class="side-title">
											<a href={sp.link} class="side-link">{sp.name} ➔</a>
										</h3>
										<span class="side-period">{sp.period}</span>
									</div>
									<span class="side-tech">{sp.tech}</span>
									<p class="side-desc">{sp.desc}</p>
								</div>
							)}
						</For>
					</div>
				</section>

				{/* ⚡ Core Competencies & Proven Value */}
				<section class="section">
					<h2 class="section-title">⚡ Năng lực cốt lõi & Giá trị đạt được</h2>
					<div class="competency-grid">
						<For each={resumeData.coreCompetencies}>
							{(comp) => (
								<div class="competency-card">
									<div class="comp-header">
										<span class="comp-icon">{comp.icon}</span>
										<h3 class="comp-title">{comp.title}</h3>
									</div>
									<p class="comp-summary">{comp.summary}</p>
									<ul class="comp-highlights">
										<For each={comp.highlights}>
											{(hl) => <li>{hl}</li>}
										</For>
									</ul>
									<div class="comp-tech-pills">
										<For each={comp.techPills}>
											{(pill) => <span class="tech-pill">{pill}</span>}
										</For>
									</div>
								</div>
							)}
						</For>
					</div>

					<h2 class="section-title" style={{ "margin-top": "var(--space-12)" }}>🎓 Học vấn & Bằng cấp</h2>
					<For each={resumeData.education}>
						{(edu) => (
							<div class="edu-card">
								<div class="edu-header">
									<div>
										<h3 class="edu-school">{edu.school}</h3>
										<p class="edu-major">Chuyên ngành: {edu.major}</p>
									</div>
									<span class="edu-degree">{edu.degree}</span>
								</div>
							</div>
						)}
					</For>
				</section>

			</div>
		</div>
	);
}
