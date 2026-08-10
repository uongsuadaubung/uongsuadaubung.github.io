import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const postsDir = path.join(rootDir, 'src/posts');

if (!fs.existsSync(distDir)) {
  console.error('❌ Thư mục dist chưa được tạo. Hãy chạy vite build trước!');
  process.exit(1);
}

const templateHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
const files = fs.readdirSync(postsDir);

let prerenderCount = 0;

// Helper to write static HTML file for a route
function createStaticRoute(routePath, title, description, url, bodyHtml = '') {
  const targetDir = path.join(distDir, routePath);
  fs.mkdirSync(targetDir, { recursive: true });

  let html = templateHtml;
  
  if (title) {
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/gi, `<meta property="og:title" content="${title}" />`);
  }
  
  if (description) {
    html = html.replace(/<meta name="description" content=".*?" \/>/gi, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/gi, `<meta property="og:description" content="${description}" />`);
  }

  if (url) {
    html = html.replace(/<meta property="og:url" content=".*?" \/>/gi, `<meta property="og:url" content="${url}" />`);
    html = html.replace('</head>', `  <link rel="canonical" href="${url}" />\n  </head>`);
  }

  if (bodyHtml) {
    const prerenderContainer = `<div id="root"><article class="markdown-body" style="max-width:800px;margin:40px auto;padding:0 20px;font-family:sans-serif;line-height:1.6;">${bodyHtml}</article></div>`;
    html = html.replace('<div id="root"></div>', prerenderContainer);
  }

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  prerenderCount++;
}

// 1. Prerender static pages
createStaticRoute('about', 'Về mình & Portfolio — Hà Mạnh Kiên', 'Trang thông tin cá nhân, kinh nghiệm làm việc và các dự án nổi bật của Hà Mạnh Kiên (uongsuadaubung).', 'https://uongsuadaubung.github.io/about');
createStaticRoute('blog', 'Blog — uongsuadaubung', 'Danh sách các bài viết chia sẻ về lập trình, kinh nghiệm làm nghề và tự động hóa của Hà Mạnh Kiên.', 'https://uongsuadaubung.github.io/blog');
createStaticRoute('post', 'Blog — uongsuadaubung', 'Danh sách bài viết blog cá nhân.', 'https://uongsuadaubung.github.io/blog');

// 2. Prerender all Markdown posts with full HTML body inlined!
files.forEach(file => {
  if (!file.endsWith('.md')) return;
  const slug = file.replace('.md', '');
  const rawContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');

  const titleMatch = rawContent.match(/title:\s*["']?([^"'\r\n]+)["']?/);
  const descMatch = rawContent.match(/description:\s*["']?([^"'\r\n]+)["']?/);

  const title = titleMatch ? `${titleMatch[1]} — uongsuadaubung` : 'Blog — uongsuadaubung';
  const description = descMatch ? descMatch[1] : 'Bài viết trên blog uongsuadaubung';
  const postUrl = `https://uongsuadaubung.github.io/post/${slug}`;

  // Strip frontmatter to get markdown body
  const bodyMarkdown = rawContent.replace(/^---[\s\S]*?---\s*/, '');
  const bodyHtml = `<h1>${titleMatch ? titleMatch[1] : ''}</h1>` + marked.parse(bodyMarkdown);

  createStaticRoute(`post/${slug}`, title, description, postUrl, bodyHtml);
});

console.log(`🚀 SSG Prerender với nội dung HTML tĩnh hoàn tất! Đã sinh ${prerenderCount} file index.html tĩnh (HTTP 200 OK + Full Static HTML Body) cho tất cả bài viết!`);
