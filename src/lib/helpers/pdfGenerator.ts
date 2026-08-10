// @ts-ignore
import html2pdf from 'html2pdf.js';
import { resumeData } from '../data/resumeData';

export function generateCvPdf() {
	const info = resumeData.personalInfo;

	const experiencesHtml = resumeData.experiences
		.map(
			(exp) => `
			<div style="margin-bottom: 16px; page-break-inside: avoid;">
				<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
					<div>
						<strong style="font-size: 13.5px; color: #0f172a;">${exp.company}</strong>
						<span style="font-size: 12px; color: #4f46e5; font-weight: 600; margin-left: 8px;">— ${exp.role}</span>
					</div>
					<span style="font-size: 11px; color: #64748b; font-weight: 600; background: #f1f5f9; padding: 2px 8px; border-radius: 12px;">${exp.period}</span>
				</div>
				<ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 11.5px;">
					${exp.tasks.map((task) => `<li style="margin-bottom: 3px; line-height: 1.5;">${task}</li>`).join('')}
				</ul>
			</div>
		`
		)
		.join('');

	const companyProjectsHtml = resumeData.companyProjects
		.map(
			(proj) => `
			<div style="margin-bottom: 14px; page-break-inside: avoid; background: #f8fafc; padding: 10px 14px; border-left: 3.5px solid #4f46e5; border-radius: 0 6px 6px 0;">
				<div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
					<strong style="font-size: 12.5px; color: #0f172a;">${proj.name}</strong>
					<span style="font-size: 11px; color: #64748b; font-weight: 600;">${proj.period}</span>
				</div>
				<div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
					${proj.client ? `<strong>Khách hàng:</strong> ${proj.client}` : ''} 
					${proj.teamSize ? ` | <strong>Quy mô:</strong> ${proj.teamSize}` : ''} 
					| <strong>Vai trò:</strong> ${proj.role}
				</div>
				<div style="font-size: 11px; color: #4338ca; font-weight: 600; margin-bottom: 6px;"><strong>Công nghệ:</strong> ${proj.tech}</div>
				
				<ul style="margin: 4px 0 0 0; padding-left: 16px; color: #334155; font-size: 11px;">
					${proj.tasks.map((t) => `<li style="margin-bottom: 3px; line-height: 1.45;">${t}</li>`).join('')}
				</ul>
				${
					proj.features
						? `
					<div style="font-weight: 700; color: #0f172a; font-size: 11px; margin-top: 5px;">Tính năng chính:</div>
					<ul style="margin: 2px 0 0 0; padding-left: 16px; color: #334155; font-size: 11px;">
						${proj.features.map((f) => `<li style="margin-bottom: 2px; line-height: 1.45;">${f}</li>`).join('')}
					</ul>
				`
						: ''
				}
			</div>
		`
		)
		.join('');

	const sideProjectsHtml = resumeData.sideProjects
		.map(
			(sp) => `
			<li style="margin-bottom: 5px; line-height: 1.5;">
				<strong>${sp.name} ${sp.period ? `(${sp.period})` : ''}:</strong> ${sp.desc} <span style="color: #4338ca; font-weight: 600;">(${sp.tech})</span>
			</li>
		`
		)
		.join('');

	const coreCompetenciesHtml = resumeData.coreCompetencies
		.map(
			(comp) => `
			<div style="margin-bottom: 10px; page-break-inside: avoid; background: #f8fafc; padding: 8px 12px; border-left: 3.5px solid #4f46e5; border-radius: 0 4px 4px 0;">
				<div style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 3px;">
					${comp.icon} ${comp.title}
				</div>
				<div style="font-size: 11px; color: #475569; margin-bottom: 4px; line-height: 1.4;">${comp.summary}</div>
				<ul style="margin: 2px 0 4px 0; padding-left: 16px; color: #334155; font-size: 10.5px;">
					${comp.highlights.map((h) => `<li style="margin-bottom: 2px;">${h}</li>`).join('')}
				</ul>
				<div style="font-size: 10px; color: #4338ca; font-weight: 600; margin-top: 2px;">
					Công nghệ: ${comp.techPills.join(' · ')}
				</div>
			</div>
		`
		)
		.join('');

	const eduHtml = resumeData.education
		.map(
			(edu) => `
			<div style="display: flex; justify-content: space-between; font-size: 12px;">
				<div>
					<strong style="color: #0f172a; font-size: 12.5px;">${edu.school}</strong>
					<span style="color: #4f46e5; font-weight: 600;"> — ${edu.degree} (${edu.major})</span>
				</div>
				<span style="font-weight: 600; color: #64748b; font-size: 11px;">${edu.period}</span>
			</div>
		`
		)
		.join('');

	const resumeHtml = `
		<div style="
			font-family: 'Segoe UI', Arial, Roboto, sans-serif;
			color: #1e293b;
			padding: 28px 32px;
			background: #ffffff;
			max-width: 800px;
			font-size: 11.5px;
			line-height: 1.55;
		">
			<!-- Header -->
			<div style="border-bottom: 2.5px solid #4f46e5; padding-bottom: 14px; margin-bottom: 18px;">
				<h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px;">${info.name.toUpperCase()}</h1>
				<p style="font-size: 14px; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.5px;">${info.title}</p>
				<div style="font-size: 11px; color: #475569; display: flex; flex-wrap: wrap; gap: 14px 20px;">
					<span>📧 <strong>Email:</strong> ${info.email}</span>
					<span>📞 <strong>Điện thoại:</strong> ${info.phone}</span>
					<span>🌐 <strong>GitHub:</strong> ${info.github}</span>
					<span>📍 <strong>Địa chỉ:</strong> ${info.location}</span>
				</div>
			</div>

			<!-- Mục tiêu nghề nghiệp -->
			<div style="margin-bottom: 18px; page-break-inside: avoid;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 8px 0; text-transform: uppercase;">Mục tiêu nghề nghiệp</h2>
				<p style="color: #334155; margin: 0; text-align: justify;">
					${info.objective}
				</p>
			</div>

			<!-- Năng lực cốt lõi & Giá trị đạt được -->
			<div style="margin-bottom: 18px; page-break-inside: avoid;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 10px 0; text-transform: uppercase;">Năng lực cốt lõi & Giá trị đạt được</h2>
				${coreCompetenciesHtml}
			</div>

			<!-- Kinh nghiệm việc làm -->
			<div style="margin-bottom: 20px;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 12px 0; text-transform: uppercase;">Kinh nghiệm việc làm</h2>
				${experiencesHtml}
			</div>

			<!-- Dự án công ty -->
			<div style="margin-bottom: 20px;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 12px 0; text-transform: uppercase;">Dự án công ty tiêu biểu</h2>
				${companyProjectsHtml}
			</div>

			<!-- Dự án cá nhân -->
			<div style="margin-bottom: 20px; page-break-inside: avoid;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 10px 0; text-transform: uppercase;">Dự án cá nhân</h2>
				<ul style="margin: 0; padding-left: 18px; color: #334155; font-size: 11px;">
					${sideProjectsHtml}
				</ul>
			</div>

			<!-- Học vấn -->
			<div style="page-break-inside: avoid;">
				<h2 style="font-size: 13.5px; font-weight: 700; color: #0f172a; border-left: 3.5px solid #4f46e5; padding-left: 10px; margin: 0 0 8px 0; text-transform: uppercase;">Học vấn & Bằng cấp</h2>
				${eduHtml}
			</div>
		</div>
	`;

	const element = document.createElement('div');
	element.innerHTML = resumeHtml;
	document.body.appendChild(element);

	const opt = {
		margin: [8, 8, 8, 8],
		filename: 'Ha-Manh-Kien-Resume-Full.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true, logging: false },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
		pagebreak: { mode: ['css', 'legacy'] }
	};

	html2pdf()
		.set(opt)
		.from(element)
		.save()
		.then(() => {
			document.body.removeChild(element);
		})
		.catch((err: any) => {
			console.error('Lỗi xuất PDF:', err);
			document.body.removeChild(element);
		});
}
