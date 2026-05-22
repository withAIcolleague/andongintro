import fs from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/site-data.js', 'utf8'), context);

const data = context.window.AndongData;
const groups = ['foods', 'events', 'places', 'courses'];
const sourceNotes = [
  fs.existsSync('docs/source-links.md') ? fs.readFileSync('docs/source-links.md', 'utf8') : '',
  fs.existsSync('source.md') ? fs.readFileSync('source.md', 'utf8') : ''
].join('\n');

function allItems() {
  return groups.flatMap((group) => data[group].map((item) => ({ group, item })));
}

function itemRef(item) {
  return `${item.category}:${item.id}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function imageList(item) {
  return unique([
    item.image,
    ...(item.richImages || []),
    ...((item.richSections || []).map((section) => section.image))
  ]);
}

function itemHasTemporaryImageNote(item) {
  const sections = sourceNotes.split(/\n(?=#{2,3}\s+)/);
  return sections.some((section) => {
    const heading = section.split(/\r?\n/, 1)[0] || '';
    return heading.includes(item.title) && /(임시 사용|이미지(?:가)? (?:부족|없어)|사진 확보|교체하면 된다)/.test(section);
  });
}

const usage = new Map();
const rows = allItems().map(({ item }) => {
  const images = imageList(item);
  for (const image of images) {
    if (!usage.has(image)) usage.set(image, []);
    usage.get(image).push(itemRef(item));
  }
  return { item, images };
});

const sharedImages = [...usage.entries()]
  .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
  .map(([image, refs]) => ({ image, refs: unique(refs) }));

const temporaryRows = rows
  .filter(({ item }) => itemHasTemporaryImageNote(item))
  .map(({ item, images }) => ({
    ref: itemRef(item),
    title: item.title,
    primary: item.image,
    imageCount: images.length
  }));

const lines = [
  '# 안동 안내 이미지 인벤토리',
  '',
  '이 문서는 `assets/site-data.js`와 `docs/source-links.md`를 기준으로 생성한다.',
  '이미지 교체 작업 전후에는 `node scripts/update-image-inventory.mjs`를 실행한다.',
  '',
  `- 콘텐츠 수: ${rows.length}`,
  `- 사용 중인 고유 이미지: ${sharedImages.length}`,
  `- 임시 이미지 교체 메모가 있는 콘텐츠: ${temporaryRows.length}`,
  '',
  '## 임시 이미지 교체 우선순위',
  '',
  temporaryRows.length
    ? '| 콘텐츠 | 제목 | 대표 이미지 | 이미지 수 |\n|---|---|---|---|\n' + temporaryRows
      .map((row) => `| \`${row.ref}\` | ${row.title} | \`${row.primary}\` | ${row.imageCount} |`)
      .join('\n')
    : '현재 문서화된 임시 이미지 교체 항목이 없다.',
  '',
  '## 이미지 재사용 현황',
  '',
  '| 이미지 | 사용 콘텐츠 수 | 사용 콘텐츠 |',
  '|---|---:|---|',
  ...sharedImages.map(({ image, refs }) => `| \`${image}\` | ${refs.length} | ${refs.map((ref) => `\`${ref}\``).join(', ')} |`),
  '',
  '## 운영 기준',
  '',
  '- 대표 이미지가 실제 콘텐츠와 직접 관련 없는 경우 `docs/source-links.md`에 임시 사용 사유를 남긴다.',
  '- 새 전용 이미지를 추가하면 `assets/site-data.js`의 `image`, `richImages`, `richSections[].image`를 함께 검토한다.',
  '- 이미지 파일은 `assets/...` 경로를 사용하고, 사용하지 않는 파일을 추가하지 않는다.',
  ''
];

const output = lines.join('\n');
const target = 'docs/image-inventory.md';

if (process.argv.includes('--check')) {
  if (!fs.existsSync(target)) {
    throw new Error(`${target} does not exist. Run node scripts/update-image-inventory.mjs`);
  }
  const current = fs.readFileSync(target, 'utf8');
  if (current !== output) {
    throw new Error(`${target} is out of date. Run node scripts/update-image-inventory.mjs`);
  }
} else {
  fs.writeFileSync(target, output);
}
