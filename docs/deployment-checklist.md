# 배포 준비 체크리스트

## 기준 URL

현재 기본 배포 URL은 다음 값으로 둔다.

```text
https://withaicolleague.github.io/andongintro
```

다른 도메인이나 하위 경로로 배포한다면 `SITE_URL`을 지정해 검색 수집 파일을 다시 만든다.

```bash
SITE_URL=https://example.com node scripts/update-sitemap.mjs
```

PowerShell:

```powershell
$env:SITE_URL="https://example.com"; node scripts/update-sitemap.mjs; Remove-Item Env:SITE_URL
```

## 배포 전 확인

- `git status --short`에서 의도하지 않은 변경이 없는가
- `node --check assets/app.js`가 통과하는가
- `node --check scripts/update-seo.mjs`가 통과하는가
- `node --check scripts/update-sitemap.mjs`가 통과하는가
- `node scripts/update-seo.mjs` 실행 후 HTML 메타데이터가 최신인가
- `node scripts/update-sitemap.mjs` 실행 후 `sitemap.xml`, `robots.txt`가 최신인가
- `sitemap.xml`의 URL 수가 현재 HTML 페이지 수와 일치하는가
- `robots.txt`의 `Sitemap` URL이 실제 배포 주소와 일치하는가

## 로컬 확인

```bash
python -m http.server 8010
```

필수 확인 페이지:

- `http://127.0.0.1:8010/index.html`
- `http://127.0.0.1:8010/food.html`
- `http://127.0.0.1:8010/events.html`
- `http://127.0.0.1:8010/places.html`
- `http://127.0.0.1:8010/courses.html`
- 대표 개별 페이지 1개 이상
- `http://127.0.0.1:8010/sitemap.xml`
- `http://127.0.0.1:8010/robots.txt`

## GitHub Pages 설정

- Source: `GitHub Actions`
- Workflow: `.github/workflows/pages.yml`
- 사이트가 공개된 뒤 `sitemap.xml`과 `robots.txt`가 브라우저에서 직접 열리는지 확인한다.
- 공개 URL에서 `404 Site not found`가 보이면 Pages 설정 또는 첫 배포 완료 여부를 먼저 확인한다.

## 콘텐츠 추가 후 반복 작업

콘텐츠를 추가하거나 `id`, `title`, `summary`, `image`, 개별 HTML 파일을 바꾼 뒤에는 반드시 아래 두 스크립트를 다시 실행한다.

```bash
node scripts/update-seo.mjs
node scripts/update-sitemap.mjs
```
