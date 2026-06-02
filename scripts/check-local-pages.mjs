import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const baseUrlArg = process.argv.find((arg) => arg.startsWith('--base-url='));
const externalBaseUrl = baseUrlArg ? baseUrlArg.split('=').slice(1).join('=').replace(/\/+$/, '') : null;

function itemPath(item) {
  if (item.category === 'place' && item.id === 'yekki') return 'yekki.html';
  return `${item.category}-${item.id}.html`;
}

function allItems() {
  return ['foods', 'events', 'places', 'courses'].flatMap((group) => data[group]);
}

function expectedPages() {
  return [
    'index.html',
    'food.html',
    'events.html',
    'places.html',
    'courses.html',
    ...allItems().map(itemPath),
    '404.html',
    'sitemap.xml',
    'robots.txt'
  ];
}

function contentType(file) {
  if (file.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (file.endsWith('.txt')) return 'text/plain; charset=utf-8';
  return 'text/html; charset=utf-8';
}

function createServer(root) {
  return http.createServer((request, response) => {
    const pathname = decodeURIComponent((request.url || '/').split('?')[0]);
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(root + path.sep) && filePath !== root) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      response.writeHead(200, { 'Content-Type': contentType(relativePath) });
      response.end(data);
    });
  });
}

async function checkPage(baseUrl, page) {
  const response = await fetch(`${baseUrl}/${page}`);
  const body = await response.text();
  if (response.status !== 200) {
    throw new Error(`${page} returned ${response.status}`);
  }
  if (!body.trim()) {
    throw new Error(`${page} returned an empty body`);
  }
  console.log(`${page} ${response.status} ${body.length}`);
}

async function runChecks(baseUrl) {
  for (const page of expectedPages()) {
    await checkPage(baseUrl, page);
  }
}

if (externalBaseUrl) {
  await runChecks(externalBaseUrl);
} else {
  const root = process.cwd();
  const server = createServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const { port } = server.address();
    await runChecks(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
  }
}

