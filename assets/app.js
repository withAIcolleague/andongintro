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
      <section class="section">
        <div class="section-head">
          <span class="eyebrow">ABOUT</span>
          <h2>${item.title} 자세히 보기</h2>
          <p>${item.detail || item.summary}</p>
        </div>
        <div class="source-grid">
          ${itemInfoCards(item)}
        </div>
      </section>
    `;
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
