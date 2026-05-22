import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const siteName = '안동 안내';

function itemPath(item) {
  if (item.category === 'place' && item.id === 'yekki') return 'yekki.html';
  return `${item.category}-${item.id}.html`;
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
    image: 'assets/hero_hahoe.png'
  }],
  ['food.html', {
    title: '안동의 맛 | 안동 안내',
    description: '안동찜닭, 안동소주, 헛제사밥, 안동국시, 간고등어, 문어, 종가음식, 시장 먹거리를 한눈에 고르는 음식 안내입니다.',
    image: 'assets/jjimdak.png'
  }],
  ['events.html', {
    title: '안동의 흥 | 안동 축제 안내',
    description: '안동국제탈춤페스티벌, 월영야행, 안동벚꽃축제, 안동수페스타, 암산얼음축제의 일정과 상태, 공식 출처를 정리합니다.',
    image: 'assets/mask_dance.png'
  }],
  ['places.html', {
    title: '안동의 멋 | 안동 명소 안내',
    description: '하회마을, 월영교, 도산서원, 병산서원, 봉정사, 예끼마을, 선성수상길 등 안동의 대표 명소를 분야별로 안내합니다.',
    image: 'assets/hero_hahoe.png'
  }],
  ['courses.html', {
    title: '안동의 길 | 안동 여행 코스',
    description: '처음 가는 1일, 음식 중심, 축제 시즌, 야경, 역사·서원, 가족, 대중교통, 렌터카 코스를 정리한 안동 여행 동선 안내입니다.',
    image: 'assets/wolyeonggyo.jpg'
  }]
]);

for (const group of ['foods', 'events', 'places', 'courses']) {
  for (const item of data[group]) {
    pageMeta.set(itemPath(item), {
      title: `${item.title} | ${siteName}`,
      description: cleanText(item.summary || item.detail),
      image: item.image || 'assets/hero_hahoe.png'
    });
  }
}

function seoBlock(meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(cleanText(meta.description));
  const image = escapeHtml(meta.image);
  return [
    `<meta name="description" content="${description}">`,
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

for (const [file, meta] of pageMeta) {
  if (!fs.existsSync(file)) continue;

  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = html
    .replace(/<meta\s+name="description"[\s\S]*?>/gi, '')
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?>/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?>/gi, '');

  const block = seoBlock(meta);
  if (/<meta\s+name="viewport"[\s\S]*?>/i.test(html)) {
    html = html.replace(/(<meta\s+name="viewport"[\s\S]*?>)/i, `$1${block}`);
  } else {
    html = html.replace(/<head>/i, `<head>${block}`);
  }

  fs.writeFileSync(file, html);
}
