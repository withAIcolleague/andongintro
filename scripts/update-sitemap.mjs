import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const baseUrl = (process.env.SITE_URL || 'https://withaicolleague.github.io/andongintro').replace(/\/+$/, '');

function itemPath(item) {
  if (item.category === 'place' && item.id === 'yekki') return 'yekki.html';
  return `${item.category}-${item.id}.html`;
}

function normalizeDate(value) {
  const match = String(value || '').match(/(\d{4})[.-](\d{2})[.-](\d{2})/);
  if (!match) return '2026-05-22';
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const urls = [
  { path: 'index.html', lastmod: '2026-05-22', changefreq: 'weekly', priority: '1.0' },
  { path: 'food.html', lastmod: '2026-05-22', changefreq: 'weekly', priority: '0.8' },
  { path: 'events.html', lastmod: '2026-05-22', changefreq: 'weekly', priority: '0.8' },
  { path: 'places.html', lastmod: '2026-05-22', changefreq: 'weekly', priority: '0.8' },
  { path: 'courses.html', lastmod: '2026-05-22', changefreq: 'weekly', priority: '0.8' }
];

for (const group of ['foods', 'events', 'places', 'courses']) {
  for (const item of data[group]) {
    urls.push({
      path: itemPath(item),
      lastmod: normalizeDate(item.lastChecked),
      changefreq: item.category === 'event' ? 'weekly' : 'monthly',
      priority: item.category === 'event' ? '0.7' : '0.6'
    });
  }
}

const existingUrls = urls.filter((entry) => fs.existsSync(entry.path));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${existingUrls.map((entry) => `  <url>
    <loc>${escapeXml(`${baseUrl}/${entry.path}`)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync('sitemap.xml', sitemap);
fs.writeFileSync('robots.txt', robots);
