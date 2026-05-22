import fs from 'node:fs';
import { execSync } from 'node:child_process';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const siteUrl = 'https://withaicolleague.github.io/andongintro';
const groups = ['foods', 'events', 'places', 'courses'];
const requiredMeta = [
  '<title>',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"'
];
const listingPages = {
  food: 'food.html',
  event: 'events.html',
  place: 'places.html',
  course: 'courses.html'
};
const allowedStatuses = {
  food: ['상시', '예약 확인'],
  event: ['예정', '진행 중', '종료', '확인 필요'],
  place: ['상시'],
  course: ['추천', '일정 확인', '노선 확인']
};
const expectedNavLinks = '<div class="nav-links"><a href="index.html#taste" aria-label="안동의 맛">맛</a><a href="index.html#meot" aria-label="안동의 멋">멋</a><a href="index.html#heung" aria-label="안동의 흥">흥</a><a href="index.html#night" aria-label="안동의 밤">밤</a><a href="index.html#route" aria-label="안동의 길">길</a></div>';

function fail(message) {
  throw new Error(message);
}

function itemPath(item) {
  if (item.category === 'place' && item.id === 'yekki') return 'yekki.html';
  return `${item.category}-${item.id}.html`;
}

function allItems() {
  return groups.flatMap((group) => data[group].map((item) => ({ group, item })));
}

function assertFile(path) {
  if (!fs.existsSync(path)) fail(`Missing file: ${path}`);
}

function expectedSchemaType(item) {
  if (!item) return 'WebPage';
  return {
    food: 'Article',
    event: 'Event',
    place: 'TouristAttraction',
    course: 'Article'
  }[item.category] || 'WebPage';
}

function validateData() {
  const ids = new Set();
  for (const { group, item } of allItems()) {
    const key = `${group}:${item.id}`;
    if (ids.has(key)) fail(`Duplicate id: ${key}`);
    ids.add(key);
    for (const field of ['id', 'title', 'category', 'summary', 'image', 'status', 'lastChecked']) {
      if (!item[field]) fail(`${key} missing ${field}`);
    }
    validateFreshnessFields(key, item);
    if (!Array.isArray(item.richSections) || item.richSections.length !== 4) {
      fail(`${key} must have exactly 4 richSections`);
    }
    for (const section of item.richSections) {
      if (!section.eyebrow || !section.title || !section.image) fail(`${key} has incomplete richSection`);
      if (!Array.isArray(section.paragraphs) || section.paragraphs.length === 0) {
        fail(`${key} has richSection without paragraphs`);
      }
    }
  }
}

function validateFreshnessFields(key, item) {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(item.lastChecked)) {
    fail(`${key} lastChecked must use YYYY.MM.DD format`);
  }

  const [year, month, day] = item.lastChecked.split('.').map(Number);
  const checkedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    checkedDate.getUTCFullYear() !== year ||
    checkedDate.getUTCMonth() !== month - 1 ||
    checkedDate.getUTCDate() !== day
  ) {
    fail(`${key} lastChecked is not a valid calendar date`);
  }

  const statuses = allowedStatuses[item.category] || [];
  if (!statuses.includes(item.status)) {
    fail(`${key} has unsupported status "${item.status}" for category ${item.category}`);
  }

  if (item.category === 'event') {
    if (!item.period) fail(`${key} event missing period`);
    if (!item.location) fail(`${key} event missing location`);
    if (item.status === '확인 필요') {
      const freshnessText = [item.period, item.location, item.visitNote, item.summary].filter(Boolean).join(' ');
      if (!freshnessText.includes('확인 필요')) fail(`${key} confirmation-needed event must explain what needs checking`);
    } else if (!/^\d{4}\.\d{2}\.\d{2}\s*~\s*\d{4}\.\d{2}\.\d{2}$/.test(item.period)) {
      fail(`${key} confirmed event period must use YYYY.MM.DD ~ YYYY.MM.DD format`);
    }
  }
}

function validateImages() {
  for (const { group, item } of allItems()) {
    const paths = [
      item.image,
      ...(item.richImages || []),
      ...item.richSections.map((section) => section.image)
    ].filter(Boolean);

    for (const image of paths) {
      if (!fs.existsSync(image)) fail(`${group}:${item.id} references missing image ${image}`);
    }
  }
}

function validateHtml() {
  const htmlFiles = fs.readdirSync('.').filter((file) => file.endsWith('.html'));
  const itemsByPath = new Map(allItems().map(({ item }) => [itemPath(item), item]));
  if (htmlFiles.length !== 37) fail(`Expected 37 html files, found ${htmlFiles.length}`);
  execSync('node scripts/update-seo.mjs --check', { stdio: 'pipe' });

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const token of requiredMeta) {
      if (!html.includes(token)) fail(`${file} missing ${token}`);
    }
    if (html.includes('20260521-rich')) fail(`${file} still uses old asset version`);
    if (!html.includes('class="skip-link"')) fail(`${file} missing skip link`);
    validateNavigation(file, html);
    if (file !== '404.html') {
      validateSeoEnhancements(file, html, itemsByPath.get(file) || null);
    }
    if (file === 'yekki.html') {
      if (!html.includes('href="#hero"') || !html.includes('id="hero" tabindex="-1"')) {
        fail('yekki.html skip target is not focusable');
      }
    } else if (!html.includes('<main id="content" tabindex="-1"')) {
      fail(`${file} main content target is not focusable`);
    }
  }

  for (const { item } of allItems()) {
    const file = itemPath(item);
    assertFile(file);
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes(`<title>${item.title} | 안동 안내</title>`)) fail(`${file} title does not match data`);
    if (!html.includes(`property="og:image" content="${item.image}"`)) fail(`${file} og:image does not match data`);
    if (!html.includes(`data-item="${item.category}:${item.id}"`) && item.id !== 'yekki') {
      fail(`${file} data-item does not match ${item.category}:${item.id}`);
    }
  }
}

function validateNavigation(file, html) {
  const nav = html.match(/<div class="nav-links">[\s\S]*?<\/div>/);
  if (!nav) fail(`${file} missing nav links`);
  const normalized = nav[0].replace(/\s+/g, '');
  const expected = expectedNavLinks.replace(/\s+/g, '');
  if (normalized !== expected) fail(`${file} nav links do not match the shared template`);
}

function validateSeoEnhancements(file, html, item = null) {
  const canonicalMatches = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)">/g)];
  if (canonicalMatches.length !== 1) fail(`${file} must have exactly one canonical link`);
  const canonical = canonicalMatches[0][1];
  if (canonical !== `${siteUrl}/${file}`) fail(`${file} canonical mismatch: ${canonical}`);

  const jsonLdMatches = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLdMatches.length !== 1) fail(`${file} must have exactly one JSON-LD block`);

  let schema;
  try {
    schema = JSON.parse(jsonLdMatches[0][1]);
  } catch (error) {
    fail(`${file} has invalid JSON-LD: ${error.message}`);
  }

  if (schema['@context'] !== 'https://schema.org') fail(`${file} JSON-LD context mismatch`);
  if (schema.url !== `${siteUrl}/${file}`) fail(`${file} JSON-LD url mismatch`);
  if (schema.inLanguage !== 'ko-KR') fail(`${file} JSON-LD language mismatch`);
  if (!schema.name || !schema.description || !schema.image) fail(`${file} JSON-LD missing required page fields`);
  if (schema['@type'] !== expectedSchemaType(item)) fail(`${file} JSON-LD type mismatch: ${schema['@type']}`);
}

function validateLinks() {
  const itemRefs = new Set(allItems().map(({ item }) => `${item.category}:${item.id}`));

  for (const { group, item } of allItems()) {
    const key = `${group}:${item.id}`;
    const listingPage = listingPages[item.category];
    const expectedHref = item.id === 'yekki' ? 'yekki.html' : `${listingPage}#${item.id}`;
    if (item.href !== expectedHref) fail(`${key} href should be ${expectedHref}, got ${item.href}`);
  }

  for (const field of data.fields || []) {
    if (!field.id || !field.title || !Array.isArray(field.items)) fail(`Invalid field definition: ${field.id || 'unknown'}`);
    for (const ref of field.items) {
      if (!itemRefs.has(ref)) fail(`Field ${field.id} references missing item ${ref}`);
    }
  }

  const expectedHtml = new Set([
    '404.html',
    'index.html',
    ...Object.values(listingPages),
    ...allItems().map(({ item }) => itemPath(item))
  ]);
  const htmlFiles = fs.readdirSync('.').filter((file) => file.endsWith('.html'));
  const extra = htmlFiles.filter((file) => !expectedHtml.has(file));
  if (extra.length) fail(`Unexpected html files: ${extra.join(', ')}`);
}

function validateSources() {
  const sourceDocs = ['docs/source-links.md', 'source.md'];
  const sourceText = sourceDocs.map((path) => {
    assertFile(path);
    return fs.readFileSync(path, 'utf8');
  }).join('\n');

  for (const { group, item } of allItems()) {
    const key = `${group}:${item.id}`;
    if (!Array.isArray(item.sources) || item.sources.length === 0) {
      fail(`${key} must have at least one source`);
    }

    for (const source of item.sources) {
      if (!source.label || !source.url) fail(`${key} has incomplete source`);
      if (!/^https?:\/\/[^\s]+$/i.test(source.url)) fail(`${key} has invalid source URL: ${source.url}`);
      if (source.url.includes('example.com')) fail(`${key} still uses placeholder source URL`);
      if (!sourceText.includes(source.url)) {
        fail(`${key} source URL is not documented in ${sourceDocs.join(' or ')}: ${source.url}`);
      }
    }
  }
}

function validateSitemap() {
  assertFile('sitemap.xml');
  assertFile('robots.txt');
  execSync('node scripts/update-sitemap.mjs --check', { stdio: 'pipe' });

  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  const expected = ['index.html', 'food.html', 'events.html', 'places.html', 'courses.html'];
  for (const { item } of allItems()) expected.push(itemPath(item));

  const missing = expected.filter((path) => !urls.some((url) => url.endsWith(`/${path}`)));
  const extra = urls.filter((url) => !expected.some((path) => url.endsWith(`/${path}`)));
  if (missing.length || extra.length || urls.length !== expected.length) {
    fail(`Sitemap mismatch: missing=${missing.join(',')} extra=${extra.join(',')} urls=${urls.length}`);
  }

  const robots = fs.readFileSync('robots.txt', 'utf8');
  if (!robots.includes('Sitemap: https://withaicolleague.github.io/andongintro/sitemap.xml')) {
    fail('robots.txt sitemap URL mismatch');
  }
}

function validateTrackedArtifacts() {
  const tracked = execSync('git ls-files', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
  const bad = tracked.filter((file) => file.endsWith('.zip') || file.includes('node_modules/'));
  if (bad.length) fail(`Unexpected tracked artifact: ${bad.join(', ')}`);
}

function validateImageInventory() {
  assertFile('docs/image-inventory.md');
  assertFile('scripts/update-image-inventory.mjs');
  execSync('node scripts/update-image-inventory.mjs --check', { stdio: 'pipe' });
}

function validateDeploymentDocs() {
  const docs = [
    ['README.md', fs.readFileSync('README.md', 'utf8')],
    ['docs/deployment-checklist.md', fs.readFileSync('docs/deployment-checklist.md', 'utf8')]
  ];
  const requiredSnippets = [
    'node scripts/check-pages-status.mjs',
    'node scripts/update-image-inventory.mjs'
  ];

  for (const [path, text] of docs) {
    for (const snippet of requiredSnippets) {
      if (!text.includes(snippet)) fail(`${path} missing deployment workflow snippet: ${snippet}`);
    }
  }
}

function validateSourceUi() {
  const app = fs.readFileSync('assets/app.js', 'utf8');
  const css = fs.readFileSync('assets/site.css', 'utf8');
  const requiredAppSnippets = [
    'SOURCE CHECK',
    '방문 전 확인 기준',
    '마지막 확인',
    '새 창으로 열기',
    'rel="noreferrer noopener"'
  ];
  const requiredCssSnippets = [
    '.source-card-primary',
    '.source-check-list'
  ];

  for (const snippet of requiredAppSnippets) {
    if (!app.includes(snippet)) fail(`assets/app.js missing source UI snippet: ${snippet}`);
  }
  for (const snippet of requiredCssSnippets) {
    if (!css.includes(snippet)) fail(`assets/site.css missing source UI style: ${snippet}`);
  }
}

function validateAuthoringGuide() {
  const path = 'docs/content-authoring-guide.md';
  assertFile(path);
  const guide = fs.readFileSync(path, 'utf8');
  const requiredSnippets = [
    '<a class="skip-link" href="#content">본문으로 건너뛰기</a>',
    expectedNavLinks,
    '<main id="content" tabindex="-1" data-item="food:new-food-id"></main>',
    '<main id="content" tabindex="-1" data-item="place:new-place-id"></main>',
    '<main id="content" tabindex="-1" data-item="event:new-event-id"></main>',
    '<main id="content" tabindex="-1" data-item="course:new-course-id"></main>',
    '정확히 4개',
    'YYYY.MM.DD',
    '음식: `상시`, `예약 확인`',
    '축제/행사: `예정`, `진행 중`, `종료`, `확인 필요`',
    '코스: `추천`, `일정 확인`, `노선 확인`',
    'node scripts/update-image-inventory.mjs'
  ];

  for (const snippet of requiredSnippets) {
    if (!guide.includes(snippet)) fail(`${path} missing current authoring rule: ${snippet}`);
  }

  if (guide.includes('<main data-item="')) {
    fail(`${path} still contains obsolete non-focusable main template`);
  }
}

validateData();
validateImages();
validateHtml();
validateLinks();
validateSources();
validateSitemap();
validateTrackedArtifacts();
validateImageInventory();
validateDeploymentDocs();
validateSourceUi();
validateAuthoringGuide();

console.log('Site validation passed');
