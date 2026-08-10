export interface ContactInfo {
	label: string;
	value: string;
	href: string;
	type: 'email' | 'phone' | 'github' | 'location';
}

export interface SkillGroup {
	category: string;
	items: string[];
}

export interface CoreCompetency {
	title: string;
	icon: string;
	summary: string;
	highlights: string[];
	techPills: string[];
}

export interface WorkExperience {
	company: string;
	role: string;
	period: string;
	summary: string;
	tasks: string[];
	techStack: string[];
	achievements?: string[];
}

export interface CompanyProject {
	name: string;
	period: string;
	client?: string;
	teamSize?: string;
	role: string;
	link?: string;
	tech: string;
	tasks: string[];
	features?: string[];
}

export interface SideProject {
	name: string;
	period: string;
	link?: string;
	tech: string;
	desc: string;
}

export interface Education {
	school: string;
	major: string;
	degree: string;
	period: string;
}

export interface ResumeData {
	personalInfo: {
		name: string;
		title: string;
		tagline: string;
		bio: string;
		objective: string;
		email: string;
		phone: string;
		github: string;
		location: string;
	};
	contacts: ContactInfo[];
	technicalSkills: SkillGroup[];
	coreCompetencies: CoreCompetency[];
	softSkills: string[];
	experiences: WorkExperience[];
	companyProjects: CompanyProject[];
	sideProjects: SideProject[];
	education: Education[];
}

export const resumeData: ResumeData = {
	personalInfo: {
		name: 'Hà Mạnh Kiên',
		title: 'Full Stack Web Developer',
		tagline: 'Full Stack Web Developer · @uongsuadaubung',
		bio: 'Lập trình viên yêu thích công nghệ với nền tảng vững chắc về Full-stack Web & Mobile Development. Tốt nghiệp Khoa Công nghệ Thông tin — Đại học Mở Hà Nội (2015 - 2019). Đam mê ứng dụng tư duy logic và công nghệ hiện đại để tạo ra những sản phẩm thực tế, hiệu quả cao.',
		objective: 'Tôi là lập trình viên yêu thích công nghệ, có nền tảng vững chắc về full-stack. Sự nhạy bén với tư duy logic giúp tôi luôn nỗ lực ứng dụng kỹ năng của bản thân để tạo ra những sản phẩm thực tế và hữu ích. Mong muốn đóng góp cho tổ chức và liên tục phát triển chuyên môn nghề nghiệp.',
		email: 'k97.dev@gmail.com',
		phone: '0868931497',
		github: 'github.com/uongsuadaubung',
		location: 'Định Công, Hà Nội'
	},

	contacts: [
		{
			label: 'Email',
			value: 'k97.dev@gmail.com',
			href: 'mailto:k97.dev@gmail.com',
			type: 'email'
		},
		{
			label: 'Điện thoại',
			value: '0868931497',
			href: 'tel:0868931497',
			type: 'phone'
		},
		{
			label: 'GitHub',
			value: 'github.com/uongsuadaubung',
			href: 'https://github.com/uongsuadaubung',
			type: 'github'
		},
		{
			label: 'Địa điểm',
			value: 'Định Công, Hà Nội',
			href: '#',
			type: 'location'
		}
	],

	technicalSkills: [
		{ category: 'Ngôn ngữ lập trình', items: ['JavaScript (ES6+)', 'TypeScript', 'C# (.NET)', 'Java', 'Dart'] },
		{ category: 'Frontend', items: ['React.js', 'Next.js', 'Vue.js', 'Nuxt.js', 'Solid JS', 'Angular', 'SCSS/Sass'] },
		{ category: 'Backend & API', items: ['Spring Boot 3', '.NET C# Web API', 'Nest.js', 'Fastify', 'Node.js', 'Deno', 'RESTful API'] },
		{ category: 'Database & Cache', items: ['Oracle Database', 'MySQL', 'MongoDB', 'Redis', 'SQLite'] },
		{ category: 'Mobile & Tools', items: ['Flutter', 'React Native', 'AWS S3', 'Zalo Mini App', 'Git', 'GitLab', 'SVN', 'Linux', 'PM2', 'Docker'] }
	],

	coreCompetencies: [
		{
			title: 'Kiến trúc Backend & Tích hợp API Gateway',
			icon: '🏗️',
			summary: 'Thiết kế và phát triển các hệ thống backend, API Gateway xử lý dữ liệu bồi thường bảo hiểm lớn cho Prudential, Sun Life, Tokio Marine và Insmart Core.',
			highlights: [
				'Phát triển dịch vụ xác thực tập trung Spring Boot 3 (Java 17) & JWT/OAuth 2.0.',
				'Chuẩn hóa API Gateway đồng bộ dữ liệu đa doanh nghiệp bảo hiểm (Prudential, Sun Life, TMIV).',
				'Tối ưu hiệu năng truy vấn Oracle DB / SQL Server với Redis Caching.'
			],
			techPills: ['Java 17', 'Spring Boot 3', 'C# .NET', 'Fastify', 'Oracle DB', 'Redis', 'JWT/OAuth2']
		},
		{
			title: 'Phát triển Ứng dụng Di động & Đa nền tảng',
			icon: '📱',
			summary: 'Phát triển các ứng dụng di động chất lượng cao phục vụ NĐBH, bác sĩ và khách hàng cá nhân trên iOS, Android và nền tảng Zalo.',
			highlights: [
				'Xây dựng ứng dụng di động NĐBH bằng Flutter (Dart/GetX) hỗ trợ e-Card & Google Maps.',
				'Phát triển app di động y tế ClickCure (React Native) tích hợp thiết bị đo sinh hiệu IoMT.',
				'Triển khai Insmart Zalo Mini App tra cứu quyền lợi bảo hiểm trực tiếp trên Zalo OA.'
			],
			techPills: ['Flutter', 'Dart', 'React Native', 'Zalo Mini App SDK', 'Next.js', 'Expo', 'SQLite']
		},
		{
			title: 'Dẫn dắt Kỹ thuật & Quản lý Đội ngũ (Technical Leadership)',
			icon: '👑',
			summary: 'Kinh nghiệm đảm nhận vai trò Trưởng nhóm (Team Lead), quản lý tiến độ, dẫn dắt đội ngũ kỹ thuật và tối ưu quy trình phát triển.',
			highlights: [
				'Thăng chức Trưởng nhóm tại Salework (07/2022) nhờ thành tích xuất sắc trong quản lý dự án.',
				'Rút ngắn thời gian phát triển và nâng cao hiệu suất phối hợp nhóm 5+ lập trình viên.',
				'Thiết kế kiến trúc hệ thống, phân tích yêu cầu nghiệp vụ (BA) & thực thi Code Review.'
			],
			techPills: ['Team Leadership', 'System Architecture', 'Agile/Scrum', 'Code Review', 'RBAC', 'PM2']
		},
		{
			title: 'Bảo mật, Tự động hóa & Kỹ thuật Chuyên sâu',
			icon: '🛡️',
			summary: 'Nghiên cứu ứng dụng công nghệ hiện đại, phát triển các giải pháp bảo mật dữ liệu, bot tự động hóa và kỹ thuật xử lý sâu.',
			highlights: [
				'Xây dựng Gistwarden — App quản lý mật khẩu Zero-Knowledge mã hóa client-side & Passkeys.',
				'Tự động hóa săn game free, crawler dữ liệu thông số thiết bị và proxy vượt rào cản mạng.',
				'Ứng dụng C# Reverse Engineering, Memory Reading & WinAPI giải quyết bài toán kỹ thuật phức tạp.'
			],
			techPills: ['TypeScript', 'Bun', 'Solid JS', 'Passkeys/FIDO2', 'C++', 'Reverse Engineering', 'WinAPI']
		}
	],

	softSkills: [
		'Giải quyết vấn đề và chủ động nghiên cứu công nghệ mới',
		'Giao tiếp rõ ràng và làm việc nhóm hiệu quả',
		'Quản lý tiến độ dự án và phân tích yêu cầu nghiệp vụ',
		'Thiết kế hệ thống và dẫn dắt đội ngũ kỹ thuật'
	],

	experiences: [
		{
			company: 'Insmart',
			role: 'Full Stack Web Developer',
			period: '09/2023 - Hiện tại',
			summary: 'Phát triển và duy trì hệ thống web & mobile bảo hiểm, đảm bảo hiệu suất và độ ổn định cao cho sản phẩm. Phân tích yêu cầu, thiết kế tính năng và triển khai giải pháp.',
			techStack: ['React.js', 'Next.js', '.NET C#', 'Spring Boot', 'Flutter', 'Zalo Mini App', 'React Native', 'Oracle DB'],
			tasks: [
				'Nhiệm vụ chính: Phát triển và duy trì hệ thống web và mobile, đảm bảo hiệu suất và ổn định cho sản phẩm. Làm việc với các bộ phận liên quan để phân tích yêu cầu, thiết kế tính năng và triển khai giải pháp.',
				'Frontend: Xây dựng giao diện với React.js, Next.js, tối ưu tốc độ và trải nghiệm đa thiết bị. Phát triển Zalo Mini App sử dụng React.js theo tiêu chuẩn Zalo OA.',
				'Backend: Phát triển API backend bằng .NET C#, xây dựng kiến trúc RESTful, đảm bảo khả năng mở rộng và bảo mật.',
				'Mobile: Xây dựng ứng dụng di động bằng React Native, tận dụng code-base chung và tối ưu trải nghiệm người dùng.'
			]
		},
		{
			company: 'Salework',
			role: 'Full Stack Web Developer & Team Lead',
			period: '12/2020 - 04/2023',
			summary: 'Phát triển & duy trì hệ sinh thái Quản lý Kinh doanh TMĐT Salework (Stock, Finance, Store). Đạt thành tích xuất sắc và được thăng chức Trưởng nhóm vào tháng 07/2022.',
			techStack: ['Vue.js', 'Fastify', 'MongoDB', 'Redis', 'PM2', 'TMĐT API'],
			tasks: [
				'Nhiệm vụ chính: Phát triển và duy trì các thành phần phần mềm trong Hệ sinh thái Quản lý Kinh doanh Thương mại Điện tử của Salework. Xây dựng giao diện người dùng bằng Vue.js. Phát triển backend sử dụng Fastify. Hỗ trợ và hướng dẫn đội ngũ phát triển. Triển khai ứng dụng bằng PM2.',
				'Thành tựu đạt được: Được thăng chức Trưởng nhóm vào tháng 07/2022 nhờ thành tích nổi bật. Cải thiện quy trình làm việc nhóm và giao tiếp nội bộ. Triển khai thành công nhiều tính năng mới tăng mức độ tương tác và sự hài lòng của người dùng.'
			],
			achievements: [
				'Được thăng chức Trưởng nhóm vào tháng 07/2022 nhờ thành tích xuất sắc.',
				'Cải thiện quy trình làm việc nhóm giúp rút ngắn thời gian hoàn thành dự án.',
				'Triển khai thành công các tính năng chính cho Salework Stock, Finance và Store.'
			]
		}
	],

	companyProjects: [
		{
			name: 'Hệ thống Quản lý Bồi thường & Ứng dụng Mobile Insmart RMS',
			period: '05/2026 - Hiện tại',
			client: 'Insmart TPA',
			teamSize: '5 thành viên',
			role: 'Lập trình viên chính (Full Stack)',
			tech: 'Java 17 · Spring Boot 3 · Flutter (Dart/GetX) · Nuxt.js/Vue.js · Oracle DB · Redis · JWT',
			tasks: [
				'RMS Backend: Phát triển dịch vụ xác thực & phân quyền RBAC tập trung (JWT, OTP Email, OAuth Google/Apple) và API Gateway kết nối Insmart Core.',
				'App Mobile: Xây dựng ứng dụng di động NĐBH đa nền tảng (Flutter) tra cứu quyền lợi bảo hiểm, thẻ điện tử e-Card, lịch sử bồi thường và định vị cơ sở y tế.',
				'Admin Portal: Phát triển Web Admin Portal (Nuxt/Vue) quản trị danh mục, phân quyền người dùng và giám sát cấu hình ứng dụng.',
				'Tối ưu hiệu năng: Tích hợp Redis Caching tăng tốc độ phản hồi API và đảm bảo hệ thống vận hành ổn định trên Oracle Database.'
			]
		},
		{
			name: 'Tích hợp Dữ liệu Bồi thường TMIV (Tokio Marine Vietnam)',
			period: '01/2026 - 05/2026',
			client: 'Tokio Marine Insurance Vietnam (TMIV)',
			teamSize: '4 thành viên',
			role: 'Lập trình viên (Backend & Integration)',
			tech: 'C# .NET Framework · SQL Server / Oracle DB · XML Integration · Deno/TypeScript · SMTP',
			tasks: [
				'Phát triển hệ thống tự động hóa chuẩn hóa & đồng bộ dữ liệu bồi thường giữa Insmart và bảo hiểm Tokio Marine Vietnam (TMIV).',
				'Xây dựng XML Generator Engine sinh dữ liệu bồi thường chuẩn nghiệp vụ và tự động mapping mã quyền lợi giữa hai hệ thống.',
				'Tích hợp dịch vụ thông báo tự động và xuất báo cáo đối soát số lượng hồ sơ bồi thường.'
			]
		},
		{
			name: 'Hệ thống Tự động hóa Dữ liệu Bảo hiểm Medihome & AWS S3 Sync',
			period: '06/2025 - 12/2025',
			client: 'Bảo hiểm Medihome',
			teamSize: '3 thành viên',
			role: 'Lập trình viên (Backend & Cloud Integration)',
			tech: 'C# .NET · AWS S3 · SQL Server · XmlWriter Engine',
			tasks: [
				'Xây dựng dịch vụ tự động hóa trích xuất dữ liệu hợp đồng bảo hiểm Medihome và truyền tải dung lượng lớn lên hạ tầng mây Amazon S3.',
				'Tự động hóa chu trình đồng bộ, xác thực dữ liệu và giải phóng bộ nhớ tạm sau khi hoàn tất.'
			]
		},
		{
			name: 'Tích hợp API Insmart - PVA (Prudential Vietnam)',
			period: '10/2025 - 04/2026',
			client: 'Prudential Việt Nam',
			teamSize: '4 thành viên',
			role: 'Lập trình viên',
			tech: 'C# · ASP.NET Web API · Oracle Database · SVN',
			tasks: [
				'Phát triển và tích hợp các API đồng bộ dữ liệu hồ sơ bồi thường giữa hệ thống lõi Insmart (NewCore) và Prudential (PVA).',
				'Xây dựng luồng xử lý nhận thông tin yêu cầu bồi thường, quản lý trạng thái thanh toán.',
				'Triển khai cơ chế đồng bộ gửi/nhận file (Upload/Download) hồ sơ y khoa, chứng từ bồi thường bảo vệ an toàn cao.'
			],
			features: [
				'Register & Update Claim Status: API đăng ký hồ sơ khởi tạo và cập nhật trạng thái vòng đời bảo hiểm liên tục.',
				'Submit Claim: Hệ thống tiếp nhận yêu cầu bồi thường chính thức.',
				'Update Payment Status: Đồng bộ trạng thái thanh toán từ hệ thống trung tâm.',
				'Docs Import/Export: API Upload / Download chuyên dụng cho các luồng file hồ sơ bệnh án nặng.'
			]
		},
		{
			name: 'Sun Life Policy & Claim Data Integration',
			period: '08/2025 - Hiện tại',
			client: 'Sunlife Việt Nam',
			teamSize: '6 thành viên',
			role: 'Lập trình viên',
			tech: 'C# · .NET Framework · Oracle / MySQL · SVN',
			tasks: [
				'Phát triển và tích hợp các API xử lý dữ liệu hợp đồng và yêu cầu bồi thường.',
				'Tham gia phân tích nghiệp vụ bảo hiểm, chuẩn hóa dữ liệu và xây dựng quy tắc nhận diện & mapping.',
				'Xây dựng luồng xử lý yêu cầu bồi thường: đăng ký, đối soát, bổ sung hồ sơ, theo dõi trạng thái.',
				'Tối ưu quy trình giao tiếp nội bộ và Sun Life (upload/download tài liệu, kiểm tra AML...).'
			],
			features: [
				'Quản lý dữ liệu hợp đồng và dữ liệu yêu cầu bồi thường.',
				'API đăng ký yêu cầu bồi thường và lấy Claim ID.',
				'Xử lý OCR dữ liệu hồ sơ và Tải lên/tải xuống tài liệu liên quan.',
				'Kiểm tra AML và trạng thái yêu cầu.'
			]
		},
		{
			name: 'Insmart Portal CMS – Hệ thống quản trị cho Zalo Mini App',
			period: '01/2025 - Hiện tại',
			client: 'Insmart',
			teamSize: '3 thành viên',
			role: 'Lập trình viên',
			tech: 'C# · .NET C# · MySQL Server · SVN',
			tasks: [
				'Thiết kế, phát triển hệ thống quản trị (portal) cho các chức năng quản lý nghiệp vụ bảo hiểm.',
				'Tích hợp các tính năng, đảm bảo tương tác, chia sẻ dữ liệu với Zalo Mini App.',
				'Chủ động tối ưu hóa hiệu năng, bảo mật truy cập, trải nghiệm người quản trị.'
			],
			features: [
				'Quản lý khách hàng, nhóm bảo hiểm, sản phẩm bảo hiểm, ngân hàng.',
				'Quản lý tham số hệ thống, lịch sử upload file, lịch sử nộp hồ sơ bảo hiểm.',
				'Quản lý dữ liệu hệ thống (log), người dùng, vai trò, phân quyền truy cập.'
			]
		},
		{
			name: 'Insmart Zalo Mini App',
			period: '01/2025 - Hiện tại',
			client: 'Khách hàng của Insmart',
			teamSize: '3 thành viên',
			role: 'Lập trình viên',
			link: 'https://miniapp.zaloplatforms.com/apps/1489521811738115015',
			tech: 'React.js · .NET C# · MySQL Server · Zalo OA Platform',
			tasks: [
				'Tham gia phát triển giao diện ứng dụng trên nền tảng Zalo Mini App bằng React.js.',
				'Xây dựng Backend giao tiếp API với các dịch vụ khác trong hệ sinh thái Insmart, đảm bảo luồng dữ liệu an toàn.',
				'Đảm bảo các quy trình kiểm thử, vận hành ứng dụng đúng yêu cầu và tối ưu trải nghiệm người dùng.'
			],
			features: [
				'Cung cấp công cụ truy vấn thông tin bảo hiểm cho khách hàng Insmart.',
				'Tra cứu quyền lợi bảo hiểm cá nhân, tình trạng hồ sơ bồi thường bảo hiểm.',
				'Xem danh sách các bệnh viện bảo lãnh viện phí.'
			]
		},
		{
			name: 'ClickCure — Hệ sinh thái y tế & chăm sóc sức khỏe',
			period: '09/2023 - 12/2024',
			client: 'Khách hàng của Insmart',
			teamSize: '13 thành viên',
			role: 'Lập trình viên',
			link: 'https://ksk.insmart.com.vn/',
			tech: 'React Native · Next.js · .NET C# · MySQL · SQLite · IoMT',
			tasks: [
				'Phát triển, rà soát, tối ưu hoá và sửa lỗi mã nguồn cho các sản phẩm ClickCure gồm Back Office, ứng dụng di động cho bác sĩ (React Native), và cổng thông tin khám bệnh (Next.js).',
				'Đảm bảo hệ thống vận hành trơn tru, tối ưu hiệu suất và chất lượng phần mềm.'
			],
			features: [
				'Đặt lịch tư vấn và khám bệnh trực tuyến với bác sĩ/chuyên khoa.',
				'Quản lý cuộc hẹn, tra cứu lịch sử khám và thông tin sức khỏe cá nhân.',
				'Tích hợp IoMT (Internet of Medical Things) hỗ trợ đo chỉ số sức khỏe (đường huyết, cholesterol, acid uric...).'
			]
		},
		{
			name: 'Salework Store, Salework Finance và Salework Stock',
			period: '11/2020 - 04/2023',
			client: 'Nhà bán hàng sàn TMĐT',
			teamSize: '5 thành viên',
			role: 'Lập trình viên',
			link: 'https://salework.net/',
			tech: 'Vue.js · Fastify · MongoDB · Redis · PM2',
			tasks: [
				'Tham gia phát triển và tối ưu các tính năng hệ thống: quản lý kho, xử lý đơn hàng, đồng bộ dữ liệu đa kênh.',
				'Rà soát, đánh giá mã nguồn, sửa lỗi, cải thiện hiệu năng & độ ổn định ứng dụng.',
				'Tham gia thiết kế, xây dựng API, giao diện người dùng, cơ chế phân quyền.'
			],
			features: [
				'Salework Stock: Quản lý kho và xử lý đơn hàng đa kênh, đồng bộ hàng hóa/đơn hàng từ Shopee, Lazada, Tiki.',
				'Salework Finance: Quản lý tài chính tự động cho nhà bán hàng, đối soát công nợ trực tiếp từ sàn TMĐT.',
				'Salework Store: Quản lý bán lẻ tại quầy, quét mã vạch, tính tiền nhanh, tạo và in hóa đơn.'
			]
		}
	],

	sideProjects: [
		{
			name: 'Gistwarden',
			period: '08/2026',
			link: '/blog/gioi-thieu-gistwarden/',
			tech: 'TypeScript · Bun · Solid JS · Passkeys',
			desc: 'Trình quản lý mật khẩu & 2FA mã hóa cá nhân Zero-Knowledge hỗ trợ Local Vault ngoại tuyến và đồng bộ GitHub Gist.'
		},
		{
			name: 'Cozy Feed',
			period: '07/2026',
			link: '/blog/tu-lam-cozy-feed/',
			tech: 'TypeScript · Solid JS · Deno',
			desc: 'Bộ cào và ứng dụng đọc tin tức RSS cá nhân tập trung, thiết kế tối giản, hiệu năng cao.'
		},
		{
			name: 'PVZGE Cloud Sync Extension',
			period: '05/2026',
			link: '/blog/tu-lam-browser-extension-pvzge-sync/',
			tech: 'JavaScript · Chrome Extension API · Cloud Sync',
			desc: 'Chrome Extension tự động hóa đồng bộ dữ liệu save game lên mây cho tựa game Plants vs. Zombies Gardenless Edition (PvZGE).'
		},
		{
			name: 'Epic Games Free Claim Bot',
			period: '05/2026',
			link: '/blog/tu-lam-he-thong-san-game-mien-phi-epic-games/',
			tech: 'Deno · GitHub Actions · Telegram Bot',
			desc: 'Hệ thống tự động săn game miễn phí trên Epic Games Store và gửi thông báo Telegram.'
		},
		{
			name: 'MobileCity Phone Data Crawler',
			period: '04/2026',
			link: '/blog/crawl-mobile-city-tim-dien-thoai/',
			tech: 'Node.js · Cheerio · Web Scraping',
			desc: 'Tool crawler tự động thu thập và tổng hợp bảng thông số kỹ thuật điện thoại từ MobileCity.'
		},
		{
			name: 'WebRTC P2P Chat Application',
			period: '04/2026',
			link: '/blog/chat-p2p-webrtc/',
			tech: 'JavaScript · WebRTC · Svelte 5 · Peer-to-Peer',
			desc: 'Ứng dụng nhắn tin trực tiếp ngang hàng bảo mật qua trình duyệt sử dụng WebRTC.'
		},
		{
			name: 'Switch Games Manager',
			period: '03/2026',
			link: '/blog/tu-lam-app-quan-ly-game-switch/',
			tech: 'TypeScript · Solid JS · Desktop App',
			desc: 'Ứng dụng quản lý thư viện game Nintendo Switch cá nhân với giao diện trực quan, tự động cập nhật cover art & thông tin game.'
		},
		{
			name: 'App "Hôm Nay Ăn Gì"',
			period: '03/2026',
			link: '/blog/hom-nay-an-gi/',
			tech: 'JavaScript · Web App',
			desc: 'Ứng dụng gợi ý thực đơn và chọn món ăn ngẫu nhiên dẹp bỏ cơn đau đầu mỗi tối.'
		},
		{
			name: 'Website Đám Cưới Cá Nhân (Wedding Web)',
			period: '02/2026',
			link: '/blog/my-wedding/',
			tech: 'HTML5 · SCSS · Google Apps Script',
			desc: 'Trang web thiệp cưới và kỷ niệm cá nhân tích hợp Google Apps Script phân luồng chia 2 họ.'
		},
		{
			name: 'Chrome Extensions Suite',
			period: '05/2025',
			link: '/blog/chrome-extension/',
			tech: 'JavaScript · Extension API',
			desc: 'Bộ extension tiện ích duyệt web cá nhân.'
		},
		{
			name: 'Slideshare Downloader',
			period: '02/2025',
			link: '/blog/tu-lam-slideshare-downloader/',
			tech: 'JavaScript · Web Scraping',
			desc: 'Công cụ hỗ trợ bóc tách và tải tài liệu/slide từ Slideshare nhanh chóng.'
		},
		{
			name: 'Windows Minesweeper & Sudoku Memory Solvers',
			period: '09/2023',
			link: '/blog/sudoku-solver/',
			tech: 'C++ / C# · Reverse Engineering · Memory Reading · Algorithms',
			desc: 'Bộ công cụ can thiệp bộ nhớ RAM game Windows (Minesweeper & Sudoku) bằng kỹ thuật Reverse Engineering và giải thuật tự động.'
		},
		{
			name: 'Auto Game Tools (Pikachu & Kawai 2003)',
			period: '08/2023',
			link: '/blog/auto-game-pikachupokemon-part-1/',
			tech: 'C# · Reverse Engineering · Memory Reading · WinAPI',
			desc: 'Ứng dụng C# tự động hóa game Pikachu & Kawai 2003 bằng kỹ thuật Reverse Engineering, đọc bộ nhớ RAM của process và gọi WinAPI tự động click.'
		},
		{
			name: 'Facebook Newsfeed Extension',
			period: '10/2021',
			link: '/blog/tu-lam-facebook-extension/',
			tech: 'JavaScript · Extension API',
			desc: 'Chrome Extension dọn dẹp và tối ưu Newsfeed Facebook.'
		},
		{
			name: 'PVZ GOTY Memory Hack Tools',
			period: '06/2020',
			link: '/blog/plants-vs-zombies-goty-edition-part-1/',
			tech: 'C++ · Reverse Engineering · Memory Hacking',
			desc: 'Bộ công cụ can thiệp bộ nhớ RAM game Plants vs. Zombies GOTY Edition bằng kỹ thuật Reverse Engineering C++.'
		}
	],

	education: [
		{
			school: 'Đại học Mở Hà Nội',
			major: 'Khoa Công nghệ Thông tin',
			degree: 'Cử nhân CNTT',
			period: '2015 - 2019'
		}
	]
};
