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
- `node --check scripts/validate-site.mjs`가 통과하는가
- `node scripts/validate-site.mjs`가 통과하는가
- `node scripts/update-seo.mjs` 실행 후 HTML 메타데이터가 최신인가
- `node scripts/update-sitemap.mjs` 실행 후 `sitemap.xml`, `robots.txt`가 최신인가
- `sitemap.xml`의 URL 수가 현재 HTML 페이지 수와 일치하는가
- `robots.txt`의 `Sitemap` URL이 실제 배포 주소와 일치하는가

## 로컬 확인

```bash
node scripts/check-local-pages.mjs
```

이 스크립트는 내부 임시 HTTP 서버를 띄워 랜딩, 분야별 목록, 모든 개별 콘텐츠 페이지, `sitemap.xml`, `robots.txt`의 `200` 응답과 빈 본문 여부를 확인한다.

이미 별도 서버를 띄운 경우에는 주소를 지정한다.

```bash
node scripts/check-local-pages.mjs --base-url=http://127.0.0.1:8010
```

수동 브라우저 확인이 필요할 때 우선 확인할 페이지:

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

로컬에서 Pages API와 공개 URL 상태를 함께 확인한다.

```bash
node scripts/check-pages-status.mjs
```

배포 전 점검에서 공개 실패를 명확히 실패로 처리해야 한다면 `--strict`를 붙인다.

```bash
node scripts/check-pages-status.mjs --strict
```

## 배포 실패 시 확인

2026-05-22 확인 기준, 공개 URL `https://withaicolleague.github.io/andongintro/`는 아직 `404 Site not found` 상태였다.

GitHub Actions의 `Deploy static site to GitHub Pages` workflow는 먼저 GitHub Pages 활성화 여부를 확인한다. Pages가 아직 활성화되지 않았으면 deploy job은 스킵되고 workflow에는 설정 안내 notice만 남는다.

확인 경로:

1. GitHub repository `Settings`
2. `Pages`
3. `Build and deployment`
4. `Source`를 `GitHub Actions`로 설정
5. workflow를 다시 실행하거나 `main`에 새 커밋을 push

`actions/configure-pages`의 Pages enablement 기능은 일반 `GITHUB_TOKEN`만으로는 사용할 수 없고 별도 권한이 있는 토큰이 필요하므로, 이 저장소에서는 UI 설정으로 활성화하는 방식을 기본 운영 절차로 둔다.

## 콘텐츠 추가 후 반복 작업

콘텐츠를 추가하거나 `id`, `title`, `summary`, `image`, 개별 HTML 파일을 바꾼 뒤에는 반드시 아래 두 스크립트를 다시 실행한다.

```bash
node scripts/update-seo.mjs
node scripts/update-sitemap.mjs
node scripts/update-image-inventory.mjs
```
