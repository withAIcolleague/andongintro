# 안동 안내 사이트 콘텐츠 추가 가이드

이 문서는 다른 AI agent가 안동 안내 사이트에 새 콘텐츠를 추가할 때 따라야 하는 작성 규칙입니다.

## 1. 기본 구조

콘텐츠 데이터는 `assets/site-data.js`의 `window.AndongData`에 추가한다.

- 음식: `foods` 배열, `category: 'food'`
- 장소: `places` 배열, `category: 'place'`
- 축제/행사: `events` 배열, `category: 'event'`
- 코스: `courses` 배열, `category: 'course'`

랜딩 노출은 같은 파일 하단의 `fields` 배열에 참조를 추가한다.

- 안동의 맛: `id: 'taste'`
- 안동의 멋: `id: 'meot'`
- 안동의 흥: `id: 'heung'`
- 안동의 밤: `id: 'night'`
- 안동의 길: `id: 'route'`

참조 형식은 `category:id`이다.

```js
items: ['food:jjimdak', 'place:hahoe', 'event:maskdance', 'course:first-day']
```

## 2. 공통 작성 규칙

- `id`는 영문 소문자, 숫자, 하이픈만 사용한다.
- `id`는 같은 category 안에서 중복되면 안 된다.
- `image`는 `assets/...` 경로를 사용한다.
- `richImages`는 개별 페이지의 추가 감성 섹션에 사용할 사진 후보 배열이다.
- `summary`는 랜딩/히어로용 한 문장으로 짧게 쓴다.
- `detail`은 개별 페이지 첫 번째 본문에 들어가므로 감성적인 설명을 1~2문장으로 쓴다.
- `richSections`는 개별 페이지의 사진+글 감성 섹션이다. 현재 사이트 검증 기준은 콘텐츠마다 정확히 4개를 요구한다.
- 실시간성이 있는 정보는 반드시 `status`, `lastChecked`, 가능하면 `sources`를 넣는다.
- 사실 확인이 안 된 일정, 운영시간, 요금은 추정하지 말고 `확인 필요`로 둔다.

## 2-1. 사진+글 감성 섹션 양식

`richSections`는 현재 운영 데이터에서 필수 필드로 관리한다. 콘텐츠별로 사진과 글을 풍성하게 보여주기 위해 아래 형식으로 정확히 4개를 작성한다.

```js
richImages: [
  'assets/example-scene-1.jpg',
  'assets/example-scene-2.jpg'
],
richSections: [
  {
    eyebrow: 'SCENE',
    title: '큰 제목',
    image: 'assets/example-scene-1.jpg',
    paragraphs: [
      '첫 번째 문단. 사진 옆에 들어가는 감성 설명을 쓴다.',
      '두 번째 문단. 방문자가 어떤 장면을 보면 좋은지 구체적으로 쓴다.'
    ]
  },
  {
    eyebrow: 'WALK NOTE',
    title: '두 번째 큰 제목',
    image: 'assets/example-scene-2.jpg',
    paragraphs: [
      '동선, 시간대, 함께 보면 좋은 장소를 설명한다.',
      '운영시간이나 요금처럼 바뀌는 정보는 단정하지 않고 공식 확인을 유도한다.'
    ]
  },
  {
    eyebrow: 'DETAIL',
    title: '세 번째 큰 제목',
    image: 'assets/example-scene-3.jpg',
    paragraphs: [
      '콘텐츠의 역사, 배경, 지역 맥락을 설명한다.'
    ]
  },
  {
    eyebrow: 'VISIT NOTE',
    title: '네 번째 큰 제목',
    image: 'assets/example-scene-4.jpg',
    paragraphs: [
      '처음 방문자가 실제로 보면 좋은 순서와 주의할 점을 쓴다.'
    ]
  }
]
```

작성 기준:

- 섹션 하나는 `eyebrow`, `title`, `image`, `paragraphs`를 모두 가진다.
- 현재 자동 검증은 콘텐츠마다 `richSections` 4개를 요구한다.
- `paragraphs`는 1~3개가 적당하다.
- 사진은 실제 콘텐츠와 직접 관련된 이미지를 우선한다.
- 같은 이미지를 반복 사용해야 한다면 `richImages`에도 후보 이미지를 넣고, `richSections` 4개 안에서 가능한 한 다른 장면을 배치한다.
- 예끼마을처럼 별도 심층 페이지가 있는 콘텐츠는 `richSections`보다 개별 HTML을 직접 확장해도 된다.

## 3. 음식 템플릿

`foods` 배열에 추가한다.

```js
{
  id: 'new-food-id',
  title: '음식 이름',
  category: 'food',
  themeTags: ['대표 태그', '추천 상황', '권역'],
  summary: '랜딩과 히어로에 들어갈 짧은 소개 문장.',
  image: 'assets/example-food.jpg',
  richImages: ['assets/example-food-1.jpg', 'assets/example-food-2.jpg'],
  href: 'food.html#new-food-id',
  status: '상시',
  lastChecked: '2026.05.21',
  detail: '개별 페이지의 첫 본문에 들어갈 감성적인 설명.',
  storyTitle: '첫 번째 스토리 제목',
  story: '첫 번째 스토리 보조 문단.',
  contextTitle: '두 번째 스토리 제목',
  context: '두 번째 스토리 보조 문단.',
  where: '어디서 접하면 좋은지',
  bestFor: '추천 대상',
  nearby: '함께 보면 좋은 곳',
  tip: '방문자에게 줄 실용 팁'
}
```

HTML 파일도 추가한다.

파일명: `food-new-food-id.html`

```html
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>안동 음식 | 안동 안내</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/site.css?v=20260522-perf"></head><body><a class="skip-link" href="#content">본문으로 건너뛰기</a><header class="site-header"><nav class="nav"><a class="logo" href="index.html"><span class="logo-stamp">안<br>동</span><span>ANDONG</span></a><div class="nav-links"><a href="index.html#taste">맛</a><a href="index.html#meot">멋</a><a href="index.html#heung">흥</a><a href="index.html#night">밤</a><a href="index.html#route">길</a></div></nav></header><main id="content" tabindex="-1" data-item="food:new-food-id"></main><a class="fixed-home-link" href="index.html" aria-label="랜딩 페이지로 돌아가기">홈</a><script src="assets/site-data.js"></script><script src="assets/app.js?v=20260522-perf"></script></body></html>
```

## 4. 장소 템플릿

`places` 배열에 추가한다.

```js
{
  id: 'new-place-id',
  title: '장소 이름',
  category: 'place',
  themeTags: ['권역', '분위기', '추천 대상'],
  summary: '장소를 한 문장으로 설명한다.',
  image: 'assets/example-place.jpg',
  href: 'places.html#new-place-id',
  status: '상시',
  lastChecked: '2026.05.21',
  detail: '개별 페이지 첫 본문에 들어갈 장소의 감성 설명.',
  area: '권역명',
  tip: '동선, 주차, 시간대 등 방문 팁'
}
```

HTML 파일명: `place-new-place-id.html`

공통 HTML 뼈대는 음식 템플릿과 동일하게 쓰고, `main`의 `data-item`만 다음처럼 바꾼다. `skip-link`, `id="content"`, `tabindex="-1"`은 접근성 검증 대상이므로 빼지 않는다.

```html
<main id="content" tabindex="-1" data-item="place:new-place-id"></main>
```

## 5. 축제/행사 템플릿

`events` 배열에 추가한다.

```js
{
  id: 'new-event-id',
  title: '축제 이름',
  category: 'event',
  themeTags: ['계절', '상태', '추천 대상'],
  summary: '축제의 성격을 한 문장으로 설명한다.',
  image: 'assets/example-event.jpg',
  href: 'events.html#new-event-id',
  status: '예정',
  lastChecked: '2026.05.21',
  period: '2026.00.00 ~ 2026.00.00',
  location: '장소',
  sources: [
    { label: '공식 출처명', url: 'https://example.com' }
  ]
}
```

상태 값은 다음 중 하나를 우선 사용한다.

- `예정`
- `진행 중`
- `종료`
- `확인 필요`

HTML 파일명: `event-new-event-id.html`

```html
<main id="content" tabindex="-1" data-item="event:new-event-id"></main>
```

## 6. 코스 템플릿

`courses` 배열에 추가한다.

```js
{
  id: 'new-course-id',
  title: '코스 이름',
  category: 'course',
  themeTags: ['대상', '이동 방식', '기간'],
  summary: '코스의 목적을 한 문장으로 설명한다.',
  image: 'assets/example-course.jpg',
  href: 'courses.html#new-course-id',
  status: '추천',
  lastChecked: '2026.05.21',
  route: '장소 A → 장소 B → 장소 C',
  tip: '이동 시간, 교통, 계절 관련 팁'
}
```

HTML 파일명: `course-new-course-id.html`

```html
<main id="content" tabindex="-1" data-item="course:new-course-id"></main>
```

## 7. 랜딩에 노출하기

새 데이터를 추가한 뒤 `fields`의 적절한 `items`에 참조를 추가한다.

예: 새 음식 추가

```js
{
  id: 'taste',
  title: '안동의 맛',
  items: ['food:jjimdak', 'food:new-food-id']
}
```

예: 새 야경 장소 추가

```js
{
  id: 'night',
  title: '안동의 밤',
  items: ['place:wolyeonggyo', 'place:new-night-place-id']
}
```

같은 아이템을 여러 분야에 반복 노출하지 않는다. 중복을 피하는 것이 현재 랜딩 구조의 원칙이다.

## 8. 검증 체크리스트

콘텐츠 데이터와 HTML 파일을 추가한 뒤 페이지별 검색/공유 메타데이터를 갱신한다.

```bash
node scripts/update-seo.mjs
node scripts/update-sitemap.mjs
```

변경 후 로컬 서버에서 확인한다.

```bash
python -m http.server 8010
```

브라우저에서 확인할 것:

- `index.html`에서 새 카드가 적절한 분야에 보이는가
- 카드 클릭 시 새 개별 페이지로 이동하는가
- 개별 HTML의 `<title>`, `description`, `og:title`, `og:description`, `og:image`가 콘텐츠에 맞게 갱신되었는가
- `sitemap.xml`에 새 개별 페이지 URL이 포함되었는가
- `robots.txt`의 `Sitemap` URL이 실제 배포 주소와 맞는가
- 개별 페이지의 히어로, 글/사진 섹션, 추가 감성 섹션, Traveler's Note가 보이는가
- 모바일 폭에서 가로 스크롤이 생기지 않는가
- 축제/행사라면 공식 출처 링크가 보이는가
- 콘솔 오류가 없는가

## 9. 주의사항

- `assets/app.js`의 렌더링 구조를 임의로 바꾸지 않는다.
- `id`를 바꾸면 HTML 파일명, `data-item`, `fields` 참조도 함께 바꿔야 한다.
- 새 이미지는 가능하면 실제 장소/음식/축제와 직접 관련 있는 이미지를 사용한다.
- 임시 이미지 사용 시 나중에 교체할 수 있도록 커밋 메시지나 작업 메모에 남긴다.
- 출처가 불확실한 최신 일정은 본문에 확정처럼 쓰지 않는다.
