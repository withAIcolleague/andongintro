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

  function escapeAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function card(item, className = 'choice-card') {
    return `
      <a class="${className}" href="${itemPath(item)}" aria-label="${escapeAttr(item.title)} 상세 페이지로 이동">
        <span class="card-image" style="background-image: url('${item.image}')" aria-hidden="true"></span>
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
      <a class="summary-card" href="${itemPath(item)}" aria-label="${escapeAttr(item.title)} 상세 페이지로 이동">
        <span class="card-image" style="background-image: url('${item.image}')" aria-hidden="true"></span>
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
      <section class="page-hero" style="--page-image: url('../${item.image}')" aria-label="${escapeAttr(item.title)} 대표 이미지와 소개">
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
            <h2>${storyFirstTitle(item)}</h2>
            <p>${item.detail || item.summary}</p>
            <p>${storyFirstText(item)}</p>
          </div>
          <figure class="story-photo" role="img" aria-label="${escapeAttr(item.title)}의 분위기를 보여주는 사진">
            <span class="story-img" style="background-image: url('${primaryStoryImage(item)}')" aria-hidden="true"></span>
          </figure>
        </div>
      </section>
      <section class="story-section">
        <div class="story-grid reverse">
          <figure class="story-photo" role="img" aria-label="${escapeAttr(item.title)}와 함께 볼 장면 사진">
            <span class="story-img" style="background-image: url('${secondaryStoryImage(item)}')" aria-hidden="true"></span>
          </figure>
          <div class="story-copy">
            <span class="eyebrow">${storyEyebrow(item.category, 1)}</span>
            <h2>${storySecondTitle(item)}</h2>
            <p>${storySecondText(item)}</p>
            <p>${item.tip || item.summary}</p>
          </div>
        </div>
      </section>
      ${renderRichSections(item)}
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

  function renderRichSections(item) {
    return richSections(item).map((section, index) => `
      <section class="story-section ${index % 2 === 0 ? 'story-warm' : 'story-muted'}">
        <div class="story-grid ${index % 2 === 0 ? '' : 'reverse'}">
          ${index % 2 === 0 ? richSectionCopy(section) + richSectionPhoto(section) : richSectionPhoto(section) + richSectionCopy(section)}
        </div>
      </section>
    `).join('');
  }

  function richSectionCopy(section) {
    return `
      <div class="story-copy">
        <span class="eyebrow">${section.eyebrow}</span>
        <h2>${section.title}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}
      </div>
    `;
  }

  function richSectionPhoto(section) {
    return `
      <figure class="story-photo story-photo-wide" role="img" aria-label="${escapeAttr(section.title)} 사진">
        <span class="story-img" style="background-image: url('${section.image}')" aria-hidden="true"></span>
      </figure>
    `;
  }

  function richSections(item) {
    if (item.richSections && item.richSections.length) return item.richSections;

    return [
      {
        eyebrow: richEyebrow(item.category, 0),
        title: richFirstTitle(item),
        image: richImage(item, 0),
        paragraphs: [
          richFirstParagraph(item),
          richSecondParagraph(item)
        ]
      },
      {
        eyebrow: richEyebrow(item.category, 1),
        title: richSecondTitle(item),
        image: richImage(item, 1),
        paragraphs: [
          richThirdParagraph(item),
          item.visitNote || noteText(item)
        ]
      }
    ];
  }

  function richEyebrow(type, index) {
    const labels = {
      food: ['LOCAL TABLE', 'TASTE NOTE'],
      place: ['SCENE', 'WALK NOTE'],
      event: ['LIVE MOMENT', 'CHECK POINT'],
      course: ['DAY FLOW', 'ROUTE NOTE']
    };
    return (labels[type] || ['ANDONG', 'NOTE'])[index];
  }

  function richFirstTitle(item) {
    if (item.category === 'food') return `${item.title}을 맛보는 순간`;
    if (item.category === 'event') return `${item.title}이 열리는 날의 분위기`;
    if (item.category === 'course') return `${item.title}의 하루 흐름`;
    return `${item.title}을 천천히 보는 법`;
  }

  function richSecondTitle(item) {
    if (item.category === 'food') return '상차림 너머의 이야기';
    if (item.category === 'event') return '방문 전에 확인할 장면';
    if (item.category === 'course') return '길 위에서 놓치지 않을 것';
    return '사진보다 오래 남는 장면';
  }

  function richFirstParagraph(item) {
    if (item.category === 'food') return `${item.where || '안동 곳곳'}에서 만나는 ${item.title}은 여행 중간에 잠깐 먹는 메뉴가 아니라, 안동의 생활 방식과 손님맞이 문화를 함께 느끼게 하는 경험입니다.`;
    if (item.category === 'event') return `${item.title}은 일정과 장소가 맞아야 온전히 즐길 수 있는 콘텐츠입니다. 공연, 체험, 이동 동선을 미리 맞춰두면 현장에서 보내는 시간이 훨씬 부드러워집니다.`;
    if (item.category === 'course') return `${item.route || item.title}의 흐름은 대표 장면을 무리 없이 잇는 데 초점을 둡니다. 이동보다 머무는 시간을 확보하면 코스의 만족도가 높아집니다.`;
    return `${item.area || '안동'}의 흐름 안에서 ${item.title}을 보면 단일 명소보다 더 넓은 장면이 보입니다. 주변 장소와 함께 읽을 때 이 콘텐츠의 결이 살아납니다.`;
  }

  function richSecondParagraph(item) {
    if (item.bestFor) return `${item.bestFor}에게 특히 잘 맞고, ${item.nearby || '주변 콘텐츠'}와 함께 묶으면 일정의 흐름이 자연스럽습니다.`;
    return storyLead(item);
  }

  function richThirdParagraph(item) {
    if (item.category === 'food') return `${item.title}은 맛의 강도보다 어떤 장소에서, 누구와, 어느 일정 사이에 먹는지가 중요합니다. 처음 방문자는 대표 메뉴로 접근하고, 두 번째 방문부터는 시장과 전통 상차림의 차이를 비교해보면 좋습니다.`;
    if (item.category === 'event') return `축제와 행사는 같은 이름이어도 해마다 프로그램과 운영 방식이 달라질 수 있습니다. 그래서 이 페이지는 분위기와 동선은 풍성하게 보여주되, 일정과 장소는 공식 출처 확인을 기준으로 남겨둡니다.`;
    if (item.category === 'course') return `코스는 정답이 아니라 기준선입니다. 계절, 동행자, 교통수단에 따라 한두 지점을 빼거나 더해도 좋고, 마지막에는 식사나 산책처럼 여운이 남는 장면을 배치하는 편이 좋습니다.`;
    return `${item.title}에서 좋은 장면은 한 번에 보이지 않을 때가 많습니다. 입구에서 전체를 훑고, 중간에는 세부를 보고, 마지막에는 주변 풍경과 다시 연결해보면 장소의 인상이 오래 남습니다.`;
  }

  function richImage(item, index) {
    if (item.richImages && item.richImages[index]) return item.richImages[index];

    const images = {
      food: ['assets/jjimdak.png', 'assets/heotjesabap.png', 'assets/soju.png'],
      place: ['assets/hanokmaul.jpg', 'assets/hero_hahoe.png', 'assets/susanggil.jpg'],
      event: ['assets/mask_dance.png', 'assets/wolyeonggyo.jpg', 'assets/cherry_blossom.png'],
      course: ['assets/hero_hahoe.png', 'assets/wolyeonggyo.jpg', 'assets/yekki_village.jpg']
    };

    const candidates = [item.image, supportImage(item), ...(images[item.category] || [])];
    return candidates[index + 1] || candidates[0] || 'assets/hero_hahoe.png';
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

  function storyFirstTitle(item) {
    return item.storyTitle || `${item.title}의 첫인상`;
  }

  function storyFirstText(item) {
    return item.story || storyLead(item);
  }

  function supportImage(item) {
    if (item.category === 'food') return item.id === 'soju' ? 'assets/hanokmaul.jpg' : 'assets/heotjesabap.png';
    if (item.category === 'event') return item.id === 'moonlight' ? 'assets/wolyeonggyo.jpg' : 'assets/hero_hahoe.png';
    if (item.category === 'course') return item.id.includes('night') ? 'assets/wolyeonggyo.jpg' : 'assets/yekki_village.jpg';
    if (item.id === 'wolyeonggyo' || item.id === 'andongdam') return 'assets/wolyeonggyo.png';
    if (item.id === 'susanggil' || item.id === 'yekki') return 'assets/susanggil.jpg';
    return 'assets/hanokmaul.jpg';
  }

  function storyImageCandidates(item) {
    return [
      ...(item.richImages || []),
      supportImage(item),
      ...((item.richSections || []).map((section) => section.image))
    ].filter(Boolean);
  }

  function primaryStoryImage(item) {
    return storyImageCandidates(item).find((image) => image !== item.image) || item.image;
  }

  function secondaryStoryImage(item) {
    const primary = primaryStoryImage(item);
    return storyImageCandidates(item).find((image) => image !== item.image && image !== primary) || supportImage(item);
  }

  function storySecondTitle(item) {
    if (item.contextTitle) return item.contextTitle;
    if (item.category === 'food') return '상 위에 남는 안동의 결';
    if (item.category === 'place') return '풍경 안에 겹친 시간';
    if (item.category === 'event') return '계절이 만드는 도시의 표정';
    return '길 위에서 이해하는 안동';
  }

  function storySecondText(item) {
    if (item.context) return item.context;
    if (item.category === 'food') return `${item.where || '안동 곳곳'}에서 만나는 ${item.title}은 여행 중간의 식사가 아니라 안동의 생활 문화를 감각적으로 만나는 방식입니다.`;
    if (item.category === 'place') return `${item.area || '안동'}의 흐름 안에서 ${item.title}을 보면, 단일 명소가 아니라 주변 장소와 이어지는 장면으로 읽힙니다.`;
    if (item.category === 'event') return `${item.period || '일정 확인 필요'}에 맞춰 열리는 ${item.title}은 방문 시점에 따라 경험이 크게 달라지는 콘텐츠입니다.`;
    return `${item.route || item.title}의 흐름을 따라가면 안동의 대표 장면을 무리 없이 연결할 수 있습니다.`;
  }

  function noteText(item) {
    if (item.visitNote) return item.visitNote;
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
    if (item.bestFor) cards.push(['추천 대상', item.bestFor]);
    if (item.nearby) cards.push(['함께 보기', item.nearby]);
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
        <div class="detail-image" style="background-image: url('${item.image}')" role="img" aria-label="${escapeAttr(item.title)} 대표 사진"></div>
        <div class="detail-content">
          <span class="card-meta">${status(item)}${tags(item)}</span>
          <h3>${item.title}</h3>
          <p>${item.detail || item.summary}</p>
          <div class="facts">${facts}</div>
          <a class="detail-link" href="${itemPath(item)}" aria-label="${escapeAttr(item.title)} 상세 페이지로 이동">자세히 보기</a>
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
