import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const siteName = '안동 안내';
const siteUrl = (process.env.SITE_URL || 'https://withaicolleague.github.io/andongintro').replace(/\/$/, '');

function itemPath(item) {
  if (item.category === 'place' && item.id === 'yekki') return 'yekki.html';
  return `${item.category}-${item.id}.html`;
}

function absoluteUrl(path) {
  return `${siteUrl}/${path}`;
}

function cleanText(value, max = 155) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const pageMeta = new Map([
  ['index.html', {
    title: '안동 안내 | 처음 와도 고를 수 있는 안동 여행',
    description: '하회마을만 알고 와도 고를 수 있도록 안동의 맛, 멋, 흥, 밤, 길을 분야별 선택지로 정리한 안내 사이트입니다.',
    image: 'assets/andong_birdview.jpg',
    path: 'index.html'
  }],
  ['food.html', {
    title: '안동의 맛 | 안동 안내',
    description: '안동찜닭, 안동소주, 헛제사밥, 안동국시, 간고등어, 문어, 종가음식, 시장 먹거리를 한눈에 고르는 음식 안내입니다.',
    image: 'assets/jjimdak.png',
    path: 'food.html'
  }],
  ['events.html', {
    title: '안동의 흥 | 안동 축제 안내',
    description: '안동국제탈춤페스티벌, 월영야행, 안동벚꽃축제, 안동수페스타, 암산얼음축제의 일정과 상태, 공식 출처를 정리합니다.',
    image: 'assets/mask_dance.png',
    path: 'events.html'
  }],
  ['places.html', {
    title: '안동의 멋 | 안동 명소 안내',
    description: '하회마을, 월영교, 도산서원, 병산서원, 봉정사, 예끼마을, 선성수상길 등 안동의 대표 명소를 분야별로 안내합니다.',
    image: 'assets/hero_hahoe.png',
    path: 'places.html'
  }],
  ['courses.html', {
    title: '안동의 길 | 안동 여행 코스',
    description: '처음 가는 1일, 음식 중심, 축제 시즌, 야경, 역사·서원, 가족, 대중교통, 렌터카 코스를 정리한 안동 여행 동선 안내입니다.',
    image: 'assets/wolyeonggyo.jpg',
    path: 'courses.html'
  }]
]);

for (const group of ['foods', 'events', 'places', 'courses']) {
  for (const item of data[group]) {
    const path = itemPath(item);
    pageMeta.set(itemPath(item), {
      title: `${item.title} | ${siteName}`,
      description: cleanText(item.summary || item.detail),
      image: item.image || 'assets/hero_hahoe.png',
      item,
      path
    });
  }
}

function seoBlock(meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(cleanText(meta.description));
  const image = escapeHtml(meta.image);
  return [
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${escapeHtml(absoluteUrl(meta.path || 'index.html'))}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`
  ].join('');
}

function schemaType(item) {
  if (!item) return 'WebPage';
  return {
    food: 'Article',
    event: 'Event',
    place: 'TouristAttraction',
    course: 'Article'
  }[item.category] || 'WebPage';
}

function jsonLd(meta, file) {
  const item = meta.item;
  const pageUrl = absoluteUrl(meta.path || file);
  const base = {
    '@context': 'https://schema.org',
    '@type': schemaType(item),
    name: meta.title.replace(` | ${siteName}`, ''),
    headline: meta.title,
    description: cleanText(meta.description),
    image: absoluteUrl(meta.image),
    url: pageUrl,
    inLanguage: 'ko-KR',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: absoluteUrl('assets/andong_hahoetal_icon.png')
    }
  };

  if (item) {
    base.dateModified = item.lastChecked;
    base.about = item.themeTags || [];
    if (item.category === 'event') {
      base.eventStatus = item.status === '종료' ? 'https://schema.org/EventCompleted' : 'https://schema.org/EventScheduled';
      base.location = item.location ? { '@type': 'Place', name: item.location } : undefined;
    }
  }

  return `<script type="application/ld+json">${JSON.stringify(base).replace(/</g, '\\u003c')}</script>`;
}

function iconBlock() {
  return [
    `<link rel="icon" href="assets/andong_hahoetal_icon.png" type="image/png">`,
    `<link rel="apple-touch-icon" href="assets/andong_hahoetal_icon.png">`
  ].join('');
}

function renderSeoHtml(html, meta, file) {
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  next = next
    .replace(/<link\s+rel="canonical"[\s\S]*?>/gi, '')
    .replace(/<meta\s+name="description"[\s\S]*?>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, '')
    .replace(/<link\s+rel="icon"[\s\S]*?>/gi, '')
    .replace(/<link\s+rel="apple-touch-icon"[\s\S]*?>/gi, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  const block = `${seoBlock(meta)}${iconBlock()}`;
  if (/<meta\s+name="viewport"[\s\S]*?>/i.test(next)) {
    next = next.replace(/(<meta\s+name="viewport"[\s\S]*?>)/i, `$1${block}`);
  } else {
    next = next.replace(/<head>/i, `<head>${block}`);
  }

  next = next.replace(
    /<span class="logo-stamp">[\s\S]*?<\/span>/gi,
    '<span class="logo-stamp" aria-hidden="true">안동</span>'
  );

  next = next.replace(/site\.css\?v=[^"]+/g, 'site.css?v=20260721-hero-up');
  next = next.replace(/app\.js\?v=[^"]+/g, 'app.js?v=20260721-motion');

  return next.replace(/<\/head>/i, `${jsonLd(meta, file)}</head>`);
}

const checkOnly = process.argv.includes('--check');

for (const [file, meta] of pageMeta) {
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  const nextHtml = renderSeoHtml(html, meta, file);

  if (checkOnly) {
    if (html !== nextHtml) {
      throw new Error(`${file} SEO metadata is out of date. Run node scripts/update-seo.mjs`);
    }
  } else {
    fs.writeFileSync(file, nextHtml);
  }
}
