(function () {
  const data = window.AndongData;
  const collections = {
    food: data.foods,
    event: data.events,
    place: data.places,
    course: data.courses
  };

  function byRef(ref) {
    const [type, id] = ref.split(':');
    return (collections[type] || []).find((item) => item.id === id);
  }

  function tags(item) {
    return (item.themeTags || []).slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join('');
  }

  function status(item) {
    return item.status ? `<span class="status-pill">${item.status}</span>` : '';
  }

  function itemPath(item) {
    if (item.category === 'place' && item.id === 'yekki') {
      return 'yekki.html';
    }
    return `${item.category}-${item.id}.html`;
  }

  function card(item, className = 'choice-card') {
    return `
      <a class="${className}" href="${itemPath(item)}">
        <span class="card-image" style="background-image: url('${item.image}')"></span>
        <span class="card-body">
          <h4>${item.title}</h4>
        </span>
      </a>
    `;
  }

  function renderFieldBoard(root) {
    root.innerHTML = data.fields.map((field) => {
      const cards = field.items.map(byRef).filter(Boolean).map((item) => card(item)).join('');
      return `
        <section class="theme-group" id="${field.id}">
          <header>
            <div>
              <span class="eyebrow">FIELD</span>
              <h3>${field.title}</h3>
            </div>
            <p>${field.description}</p>
          </header>
          <div class="choice-grid">${cards}</div>
        </section>
      `;
    }).join('');
  }

  function renderEventSummary(root) {
    root.innerHTML = data.events.slice(0, 5).map((item) => `
      <a class="summary-card" href="${itemPath(item)}">
        <span class="card-image" style="background-image: url('${item.image}')"></span>
        <span class="card-body">
          <h4>${item.title}</h4>
        </span>
      </a>
    `).join('');
  }

  function findItemByPage(pageId) {
    const [type, ...idParts] = pageId.split(':');
    const id = idParts.join(':');
    return (collections[type] || []).find((item) => item.id === id);
  }

  function renderItemPage(root) {
    const item = findItemByPage(root.dataset.item);
    if (!item) {
      root.innerHTML = '<section class="section"><h1>콘텐츠를 찾을 수 없습니다.</h1></section>';
      document.title = '콘텐츠를 찾을 수 없습니다 | 안동 안내';
      return;
    }

    document.title = `${item.title} | 안동 안내`;
    root.innerHTML = `
      <section class="page-hero" style="--page-image: url('../${item.image}')">
        <div class="page-hero-inner">
          <span class="eyebrow">${typeLabel(item.category)}</span>
          <h1>${item.title}</h1>
          <p>${item.summary}</p>
        </div>
      </section>
      <section class="story-section story-muted">
        <div class="story-grid">
          <div class="story-copy">
            <span class="eyebrow">${storyEyebrow(item.category, 0)}</span>
            <h2>${item.title}의 첫인상</h2>
            <p>${item.detail || item.summary}</p>
            <p>${storyLead(item)}</p>
          </div>
          <figure class="story-photo">
            <span class="story-img" style="background-image: url('${item.image}')"></span>
          </figure>
        </div>
      </section>
      <section class="story-section">
        <div class="story-grid reverse">
          <figure class="story-photo">
            <span class="story-img" style="background-image: url('${supportImage(item)}')"></span>
          </figure>
          <div class="story-copy">
            <span class="eyebrow">${storyEyebrow(item.category, 1)}</span>
            <h2>${storySecondTitle(item)}</h2>
            <p>${storySecondText(item)}</p>
            <p>${item.tip || item.summary}</p>
          </div>
        </div>
      </section>
      <section class="section compact-section">
        <div class="section-head">
          <span class="eyebrow">TRAVELER'S NOTE</span>
          <h2>방문 전에 보면 좋은 기록</h2>
          <p>${noteText(item)}</p>
        </div>
        <div class="source-grid">
          ${itemInfoCards(item)}
        </div>
      </section>
    `;
  }

  function storyEyebrow(type, index) {
    const labels = {
      food: ['TASTE', 'TABLE'],
      place: ['PLACE', 'SCENE'],
      event: ['FESTIVAL', 'SEASON'],
      course: ['ROUTE', 'FLOW']
    };
    return (labels[type] || ['ANDONG', 'NOTE'])[index];
  }

  function storyLead(item) {
    if (item.category === 'food') return '안동의 음식은 맛만이 아니라 시장, 종가, 의례, 손님맞이의 기억과 함께 이해할 때 더 선명해집니다.';
    if (item.category === 'place') return '안동의 장소들은 강과 마을, 오래된 건축과 생활의 흔적이 겹쳐 있어 천천히 걸을수록 결이 드러납니다.';
    if (item.category === 'event') return '축제는 계절마다 도시의 표정을 바꾸는 장면입니다. 일정과 장소를 확인하고 가면 훨씬 깊게 즐길 수 있습니다.';
    return '안동은 권역 사이 거리가 있어 동선을 먼저 잡으면 여행의 피로가 줄고, 각 장소의 이야기에 더 오래 머물 수 있습니다.';
  }

  function supportImage(item) {
    if (item.category === 'food') return item.id === 'soju' ? 'assets/hanokmaul.jpg' : 'assets/heotjesabap.png';
    if (item.category === 'event') return item.id === 'moonlight' ? 'assets/wolyeonggyo.jpg' : 'assets/hero_hahoe.png';
    if (item.category === 'course') return item.id.includes('night') ? 'assets/wolyeonggyo.jpg' : 'assets/yekki_village.jpg';
    if (item.id === 'wolyeonggyo' || item.id === 'andongdam') return 'assets/wolyeonggyo.png';
    if (item.id === 'susanggil' || item.id === 'yekki') return 'assets/susanggil.jpg';
    return 'assets/hanokmaul.jpg';
  }

  function storySecondTitle(item) {
    if (item.category === 'food') return '상 위에 남는 안동의 결';
    if (item.category === 'place') return '풍경 안에 겹친 시간';
    if (item.category === 'event') return '계절이 만드는 도시의 표정';
    return '길 위에서 이해하는 안동';
  }

  function storySecondText(item) {
    if (item.category === 'food') return `${item.where || '안동 곳곳'}에서 만나는 ${item.title}은 여행 중간의 식사가 아니라 안동의 생활 문화를 감각적으로 만나는 방식입니다.`;
    if (item.category === 'place') return `${item.area || '안동'}의 흐름 안에서 ${item.title}을 보면, 단일 명소가 아니라 주변 장소와 이어지는 장면으로 읽힙니다.`;
    if (item.category === 'event') return `${item.period || '일정 확인 필요'}에 맞춰 열리는 ${item.title}은 방문 시점에 따라 경험이 크게 달라지는 콘텐츠입니다.`;
    return `${item.route || item.title}의 흐름을 따라가면 안동의 대표 장면을 무리 없이 연결할 수 있습니다.`;
  }

  function noteText(item) {
    if (item.category === 'event') return '축제와 행사는 일정, 장소, 셔틀, 예매 여부가 바뀔 수 있으니 공식 출처를 우선 확인하세요.';
    if (item.category === 'course') return '이동 방식에 따라 체감 시간이 달라집니다. 대중교통과 차량 이동을 분리해 판단하는 것이 좋습니다.';
    return '운영시간, 예약, 교통, 주차 정보는 방문 시점에 달라질 수 있으니 마지막 확인일과 공식 안내를 함께 확인하세요.';
  }

  function typeLabel(type) {
    return {
      food: '안동의 맛',
      place: '안동의 멋',
      event: '안동의 흥',
      course: '안동의 길'
    }[type] || '안동 안내';
  }

  function itemInfoCards(item) {
    const cards = [];
    if (item.where) cards.push(['어디서', item.where]);
    if (item.area) cards.push(['권역', item.area]);
    if (item.period) cards.push(['일정', item.period]);
    if (item.location) cards.push(['장소', item.location]);
    if (item.route) cards.push(['동선', item.route]);
    if (item.tip) cards.push(['추천 팁', item.tip]);
    cards.push(['상태', item.status || '확인 필요']);
    cards.push(['확인일', item.lastChecked || '미확인']);

    const info = cards.map(([title, text]) => `
      <article class="source-card">
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `).join('');

    const sources = item.sources ? `
      <article class="source-card">
        <h3>공식 출처</h3>
        <ul>
          ${item.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`).join('')}
        </ul>
      </article>
    ` : '';

    return info + sources;
  }

  function renderDetailPage(root, type) {
    const list = collections[type] || [];
    root.innerHTML = list.map((item) => detailCard(item, type)).join('');
  }

  function detailCard(item, type) {
    const facts = detailFacts(item, type);
    return `
      <article class="detail-card" id="${item.id}">
        <div class="detail-image" style="background-image: url('${item.image}')"></div>
        <div class="detail-content">
          <span class="card-meta">${status(item)}${tags(item)}</span>
          <h3>${item.title}</h3>
          <p>${item.detail || item.summary}</p>
          <div class="facts">${facts}</div>
        </div>
      </article>
    `;
  }

  function detailFacts(item, type) {
    if (type === 'food') {
      return rows([
        ['어디서', item.where],
        ['추천 팁', item.tip],
        ['확인일', item.lastChecked]
      ]);
    }

    if (type === 'event') {
      return rows([
        ['일정', item.period],
        ['장소', item.location],
        ['확인일', item.lastChecked]
      ]);
    }

    if (type === 'place') {
      return rows([
        ['권역', item.area],
        ['추천 팁', item.tip],
        ['확인일', item.lastChecked]
      ]);
    }

    return rows([
      ['동선', item.route],
      ['추천 팁', item.tip],
      ['확인일', item.lastChecked]
    ]);
  }

  function rows(items) {
    return items.map(([label, value]) => `
      <div class="fact-row">
        <span>${label}</span>
        <span>${value || '-'}</span>
      </div>
    `).join('');
  }

  function renderSources(root) {
    const events = data.events.filter((event) => event.sources && event.sources.length);
    root.innerHTML = events.map((event) => `
      <article class="source-card">
        <h3>${event.title}</h3>
        <p>${event.period} · ${event.status} · 확인 ${event.lastChecked}</p>
        <ul>
          ${event.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`).join('')}
        </ul>
      </article>
    `).join('');
  }

  function init() {
    document.querySelectorAll('[data-render="field-board"]').forEach(renderFieldBoard);
    document.querySelectorAll('[data-render="event-summary"]').forEach(renderEventSummary);
    document.querySelectorAll('[data-page]').forEach((root) => renderDetailPage(root, root.dataset.page));
    document.querySelectorAll('[data-item]').forEach(renderItemPage);
    document.querySelectorAll('[data-render="event-sources"]').forEach(renderSources);
  }

  document.addEventListener('DOMContentLoaded', init);
}());
