import { For, createResource } from 'solid-js';
import { nav } from '../nav';
import { getEcosystemApps } from '../posts';
import './EcosystemView.scss';

export default function EcosystemView() {
  const [liveApps] = createResource(getEcosystemApps);

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
          <For each={liveApps() || []}>
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
