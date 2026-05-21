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

  function card(item, className = 'choice-card') {
    return `
      <a class="${className}" href="${item.href}">
        <span class="card-image" style="background-image: url('${item.image}')"></span>
        <span class="card-body">
          <h4>${item.title}</h4>
        </span>
      </a>
    `;
  }

  function renderThemeBoard(root) {
    root.innerHTML = data.themes.map((theme) => {
      const cards = theme.items.map(byRef).filter(Boolean).map((item) => card(item)).join('');
      return `
        <section class="theme-group" id="${theme.id}">
          <header>
            <div>
              <span class="eyebrow">THEME</span>
              <h3>${theme.title}</h3>
            </div>
            <p>${theme.description}</p>
          </header>
          <div class="choice-grid">${cards}</div>
        </section>
      `;
    }).join('');
  }

  function renderEventSummary(root) {
    root.innerHTML = data.events.slice(0, 5).map((item) => `
      <a class="summary-card" href="${item.href}">
        <span class="card-image" style="background-image: url('${item.image}')"></span>
        <span class="card-body">
          <h4>${item.title}</h4>
        </span>
      </a>
    `).join('');
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
    document.querySelectorAll('[data-render="theme-board"]').forEach(renderThemeBoard);
    document.querySelectorAll('[data-render="event-summary"]').forEach(renderEventSummary);
    document.querySelectorAll('[data-page]').forEach((root) => renderDetailPage(root, root.dataset.page));
    document.querySelectorAll('[data-render="event-sources"]').forEach(renderSources);
  }

  document.addEventListener('DOMContentLoaded', init);
}());
