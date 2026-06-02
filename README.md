# 안동 안내

안동을 처음 방문하는 사람도 선택지를 고를 수 있도록 음식, 장소, 축제, 야경, 코스를 분야별로 정리한 정적 안내 사이트입니다.

## 사이트 구조

- `index.html`: 이미지 중심 랜딩 페이지
- `food.html`, `events.html`, `places.html`, `courses.html`: 분야별 목록 페이지
- `food-*.html`, `event-*.html`, `place-*.html`, `course-*.html`: 개별 콘텐츠 페이지
- `assets/site-data.js`: 콘텐츠 데이터 원본
- `assets/app.js`: 랜딩/목록/개별 페이지 렌더러
- `assets/site.css`: 공통 스타일
- `docs/content-authoring-guide.md`: 콘텐츠 추가 가이드
- `docs/source-links.md`: 자료 출처와 갱신 기록

## 로컬 확인

```bash
node scripts/check-local-pages.mjs
```

필요하면 별도 서버를 띄운 뒤 해당 주소를 지정해 확인한다.

```bash
node scripts/check-local-pages.mjs --base-url=http://127.0.0.1:8010
```

## 콘텐츠 갱신 절차

1. `assets/site-data.js`에 콘텐츠를 추가하거나 수정한다.
2. 필요하면 개별 HTML 파일을 추가한다.
3. 랜딩 노출은 `assets/site-data.js` 하단의 `fields` 배열에 `category:id` 형식으로 연결한다.
4. 검색/공유 메타데이터와 검색 수집 파일을 갱신한다.

```bash
node scripts/update-seo.mjs
node scripts/update-sitemap.mjs
node scripts/update-image-inventory.mjs
```

배포 도메인이 기본값과 다르면 sitemap 생성 시 `SITE_URL`을 지정한다.

```bash
SITE_URL=https://example.com node scripts/update-sitemap.mjs
```

Windows PowerShell에서는 다음처럼 실행한다.

```powershell
$env:SITE_URL="https://example.com"; node scripts/update-sitemap.mjs; Remove-Item Env:SITE_URL
```

## 검증

```bash
node --check assets/app.js
node --check scripts/update-seo.mjs
node --check scripts/update-sitemap.mjs
node --check scripts/update-image-inventory.mjs
node --check scripts/check-pages-status.mjs
node --check scripts/check-local-pages.mjs
node --check scripts/validate-site.mjs
node scripts/validate-site.mjs
node scripts/check-local-pages.mjs
```

확인할 항목:

- 랜딩 카드가 올바른 개별 페이지로 이동하는가
- 개별 페이지의 히어로, 사진+글 섹션, Traveler's Note가 렌더링되는가
- `sitemap.xml`에 현재 HTML 페이지가 모두 포함되는가
- `robots.txt`의 `Sitemap` URL이 실제 배포 주소와 일치하는가
- 모바일 폭에서 nav와 카드 텍스트가 겹치지 않는가

## 배포

정적 HTML 사이트이며, `main` 브랜치에 push되면 `.github/workflows/pages.yml`이 GitHub Pages 배포를 실행합니다. 현재 기본 검색 수집 URL은 다음 경로를 기준으로 생성됩니다.

```text
https://withaicolleague.github.io/andongintro
```

GitHub repository settings에서 Pages source를 `GitHub Actions`로 설정합니다. 공개 URL이 `404 Site not found`로 보이면 Pages가 아직 활성화되지 않았거나 첫 배포가 끝나지 않은 상태입니다.

공개 상태는 다음 명령으로 확인합니다.

```bash
node scripts/check-pages-status.mjs
```

배포 주소가 바뀌면 `SITE_URL`로 `sitemap.xml`과 `robots.txt`를 다시 생성한 뒤 커밋합니다.

배포 실패 시 세부 확인 절차는 `docs/deployment-checklist.md`를 따릅니다.
