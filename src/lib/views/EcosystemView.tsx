import { For } from 'solid-js';
import { nav } from '../nav';
import './EcosystemView.scss';

interface LiveAppItem {
  id: string;
  name: string;
  badge: string;
  period: string;
  tech: string;
  desc: string;
  liveUrl: string;
  blogSlug: string;
  icon: string;
}

export default function EcosystemView() {
  const liveApps: LiveAppItem[] = [
    {
      id: 'gistwarden',
      name: 'Gistwarden',
      badge: '🟢 Sub-App Live',
      period: '08/2026',
      tech: 'TypeScript · Bun · Solid JS · Passkeys · Gist',
      desc: 'Trình quản lý mật khẩu & mã 2FA TOTP bảo mật client-side theo triết lý Zero-Knowledge. Hỗ trợ Local Vault ngoại tuyến và đồng bộ mã hóa qua GitHub Gist.',
      liveUrl: '/gistwarden/',
      blogSlug: 'gioi-thieu-gistwarden',
      icon: '🛡️'
    },
    {
      id: 'cozy',
      name: 'Cozy Feed',
      badge: '🟢 Sub-App Live',
      period: '07/2026',
      tech: 'TypeScript · Solid JS · Deno · RSS Parser',
      desc: 'Ứng dụng đọc và cào tin tức RSS cá nhân tập trung, thiết kế giao diện tối giản Cozy, không quảng cáo, tối ưu hiệu năng tải tin tức.',
      liveUrl: '/cozy/',
      blogSlug: 'tu-lam-cozy-feed',
      icon: '📰'
    },
    {
      id: 'switch-games',
      name: 'Switch Games Manager',
      badge: '🟢 Sub-App Live',
      period: '03/2026',
      tech: 'TypeScript · Solid JS · Web App · Canvas',
      desc: 'Ứng dụng quản lý thư viện game Nintendo Switch cá nhân với giao diện thẻ trực quan, tự động tải cover art và lọc danh sách game mượt mà.',
      liveUrl: '/switch-games/',
      blogSlug: 'tu-lam-app-quan-ly-game-switch',
      icon: '🎮'
    },
    {
      id: 'mobile-city',
      name: 'MobileCity Phone Specs Filter',
      badge: '🟢 Sub-App Live',
      period: '04/2026',
      tech: 'Svelte 5 · Node.js Crawler · Faceted Filtering',
      desc: 'Ứng dụng lọc và tìm kiếm điện thoại xách tay MobileCity với bộ lọc cấu hình đa chiều thông minh, tìm kiếm máy theo chipset, RAM và mức giá.',
      liveUrl: '/mobile-city/',
      blogSlug: 'crawl-mobile-city-tim-dien-thoai',
      icon: '📱'
    },
    {
      id: 'chat-p2p',
      name: 'WebRTC P2P Chat Application',
      badge: '🟢 Sub-App Live',
      period: '04/2026',
      tech: 'JavaScript · WebRTC · Svelte 5 · IndexedDB',
      desc: 'Ứng dụng nhắn tin trực tiếp ngang hàng bảo mật qua trình duyệt sử dụng WebRTC, mã hóa P2P, gọi video và chia sẻ màn hình không lưu vết server.',
      liveUrl: '/chat/',
      blogSlug: 'chat-p2p-webrtc',
      icon: '💬'
    },
    {
      id: 'hom-nay-an-gi',
      name: 'Hôm Nay Ăn Gì',
      badge: '🟢 Sub-App Live',
      period: '03/2026',
      tech: 'JavaScript · HTML5 · SCSS · Randomizer',
      desc: 'Ứng dụng gợi ý thực đơn ngẫu nhiên dẹp bỏ nỗi lo "Hôm nay ăn gì?" cho các bữa ăn hàng ngày với hiệu ứng xoay chọn món ăn trực quan.',
      liveUrl: '/hom-nay-an-gi/',
      blogSlug: 'hom-nay-an-gi',
      icon: '🍕'
    }
  ];

  return (
    <div class="ecosystem-page">
      <div class="page-header">
        <div class="container">
          <div class="header-badge">✦ Live Ecosystem</div>
          <h1>Hệ Sinh Thái Web Apps</h1>
          <p class="subtitle">
            Danh sách các ứng dụng web độc lập, công cụ tự động hóa và tiện ích được thiết kế theo chuẩn Jamstack, vận hành trực tiếp trên hạ tầng GitHub Pages.
          </p>
        </div>
      </div>

      <div class="container ecosystem-layout">
        <div class="apps-grid">
          <For each={liveApps}>
            {(app) => (
              <div class="app-card">
                <div class="card-top">
                  <span class="app-icon">{app.icon}</span>
                  <span class="app-badge">{app.badge}</span>
                </div>

                <h3 class="app-title">{app.name}</h3>
                <p class="app-tech">{app.tech}</p>
                <p class="app-desc">{app.desc}</p>

                <div class="card-footer">
                  <a
                    href={app.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-live"
                  >
                    🚀 Mở App ↗
                  </a>

                  <button
                    class="btn-blog"
                    onClick={() => nav.post(app.blogSlug)}
                  >
                    📖 Đọc Bài →
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
