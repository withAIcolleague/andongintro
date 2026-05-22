import fs from 'node:fs';
import { execSync } from 'node:child_process';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const groups = ['foods', 'events', 'places', 'courses'];
const requiredMeta = [
  '<title>',
  'name="description"',
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"'
];

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

function validateData() {
  const ids = new Set();
  for (const { group, item } of allItems()) {
    const key = `${group}:${item.id}`;
    if (ids.has(key)) fail(`Duplicate id: ${key}`);
    ids.add(key);
    for (const field of ['id', 'title', 'category', 'summary', 'image', 'status', 'lastChecked']) {
      if (!item[field]) fail(`${key} missing ${field}`);
    }
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
  if (htmlFiles.length !== 36) fail(`Expected 36 html files, found ${htmlFiles.length}`);

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    for (const token of requiredMeta) {
      if (!html.includes(token)) fail(`${file} missing ${token}`);
    }
    if (html.includes('20260521-rich')) fail(`${file} still uses old asset version`);
  }

  for (const { item } of allItems()) {
    const file = itemPath(item);
    assertFile(file);
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes(`<title>${item.title} | 안동 안내</title>`)) fail(`${file} title does not match data`);
    if (!html.includes(`property="og:image" content="${item.image}"`)) fail(`${file} og:image does not match data`);
  }
}

function validateSitemap() {
  assertFile('sitemap.xml');
  assertFile('robots.txt');

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

validateData();
validateImages();
validateHtml();
validateSitemap();
validateTrackedArtifacts();

console.log('Site validation passed');
