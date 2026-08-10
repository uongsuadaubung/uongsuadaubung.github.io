import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const postsDir = path.join(rootDir, 'src/posts');
const outputFile = path.join(rootDir, 'public/sitemap.xml');

const files = fs.readdirSync(postsDir);
const postEntries = [];

files.forEach(file => {
  if (!file.endsWith('.md')) return;
  const slug = file.replace('.md', '');
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  
  const dateMatch = content.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
  const lastmod = dateMatch ? dateMatch[1] : '2026-08-10';

  postEntries.push({
    url: `https://uongsuadaubung.github.io/blog/${slug}/`,
    lastmod,
    priority: '0.8'
  });
});

// Sort posts by lastmod descending
postEntries.sort((a, b) => b.lastmod.localeCompare(a.lastmod));
const latestPostDate = postEntries.length > 0 ? postEntries[0].lastmod : '2026-08-10';

const staticPages = [
  { url: 'https://uongsuadaubung.github.io/', lastmod: latestPostDate, priority: '1.0' },
  { url: 'https://uongsuadaubung.github.io/about/', lastmod: latestPostDate, priority: '0.9' },
  { url: 'https://uongsuadaubung.github.io/blog/', lastmod: latestPostDate, priority: '0.9' },
  { url: 'https://uongsuadaubung.github.io/gistwarden/', lastmod: '2026-08-01', priority: '0.8' },
  { url: 'https://uongsuadaubung.github.io/cozy/', lastmod: '2026-07-15', priority: '0.8' },
  { url: 'https://uongsuadaubung.github.io/switch-games/', lastmod: '2026-03-20', priority: '0.8' },
  { url: 'https://uongsuadaubung.github.io/hom-nay-an-gi/', lastmod: '2026-03-13', priority: '0.8' }
];

const allEntries = [...staticPages, ...postEntries];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(outputFile, sitemapXml, 'utf-8');
console.log(`✅ Generated clean sitemap.xml with ${allEntries.length} entries & dynamic lastmod dates!`);
