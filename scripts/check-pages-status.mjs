const repository = process.env.GITHUB_REPOSITORY || 'withAIcolleague/andongintro';
const baseUrl = (process.env.SITE_URL || 'https://withaicolleague.github.io/andongintro').replace(/\/$/, '');
const strict = process.argv.includes('--strict');

async function fetchStatus(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'andongintro-pages-check',
        ...options.headers
      }
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
  } catch (error) {
    return { ok: false, status: 0, text: error.message };
  }
}

const pagesApi = await fetchStatus(`https://api.github.com/repos/${repository}/pages`, {
  headers: { Accept: 'application/vnd.github+json' }
});
const publicPage = await fetchStatus(`${baseUrl}/`);

console.log(`Repository: ${repository}`);
console.log(`Expected URL: ${baseUrl}/`);
console.log(`GitHub Pages API: ${pagesApi.status}`);
console.log(`Public URL: ${publicPage.status}`);

if (pagesApi.status !== 200) {
  console.log('Action: GitHub repository Settings > Pages > Build and deployment > Source를 GitHub Actions로 설정하세요.');
} else {
  try {
    const payload = JSON.parse(pagesApi.text);
    console.log(`Pages status: ${payload.status || 'unknown'}`);
    console.log(`Pages html_url: ${payload.html_url || '(not provided)'}`);
  } catch {
    console.log('Pages API response could not be parsed as JSON.');
  }
}

if (publicPage.status === 404) {
  console.log('Action: 공개 URL이 404입니다. Pages 설정 또는 첫 배포 완료 여부를 확인하세요.');
}

if (strict && (!pagesApi.ok || !publicPage.ok)) {
  process.exit(1);
}
