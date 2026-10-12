// Poruch Mini App — day-1 scaffold: library + comfortable reader.
// No build step, no dependencies: plain static files any host can serve.
// Sample stories are embedded; the real backend API comes next.

const SAMPLE_STORIES = [
  {
    id: '1',
    title: 'Ромчик і школярський мотоцикл',
    date: '12 жовтня',
    voice: 'Голос тата',
    paragraphs: [
      'Рома вже в ліжку, ковдра під самий ніс. За вікном тихо, лише вітер гортає листя, як сторінки книжки.',
      'Сьогоднішня пригода починається просто тут, у кімнаті: на поличці стоїть маленький іграшковий мотоцикл, і вночі він уміє світитися.',
      '«Поїхали?» — підморгнув мотоцикл фарою. І Ромчик, найсміливіший хлопчик на нашій вулиці, кивнув.',
      'Вони проїхали повз сонну школу, де парти бачили сни про канікули, повз ліхтарі, що грали в піжмурки з метеликами.',
      'А коли мотор стомився, мотоцикл прошепотів: «З таким сміливим другом я нічого не боюся. Навіть темряви».',
      'Ромчик усміхнувся. Темрява — це просто ковдра для міста. Під нею всі відпочивають: і будинки, і гойдалки, і мотоцикли.',
      'Спи солодко, Ромчику. Я поруч.',
    ],
  },
  {
    id: '2',
    title: 'Рома і маленьке динозавреня',
    date: '12 жовтня',
    voice: 'Голос тата',
    paragraphs: [
      'У парку за будинком, там, де найвища гірка, Рома знайшов маленьке динозавреня. Воно загубило маму і трішки тремтіло.',
      '«Не бійся, — сказав Рома. — Я вмію знаходити. Я одного разу знайшов шкарпетку, яку не могла знайти навіть мама».',
      'Вони пішли по слідах — великих, як калюжі після дощу. Динозавреня тримало Рому за палець, бо лапка була ще маленька.',
      'Мама-динозавриха чекала біля верби і так зраділа, що аж захиталися гілки.',
      '«Дякую, сміливий хлопчику», — прогула вона. А динозавреня лизнуло Рому в щоку. Лоскотно!',
      'Удома Рома подумав: допомагати — це як світити ліхтариком. Світла стає більше в усіх.',
      'Добраніч, Ромчику. Хай тобі насняться добрі динозаврики.',
    ],
  },
];

const FONT_KEY = 'poruch.reader.fontSize';
const THEME_KEY = 'poruch.reader.theme';
const BRIGHTNESS_KEY = 'poruch.reader.brightness';
const LINE_KEY = 'poruch.reader.lineHeight';
const FONT_MIN = 16;
const FONT_MAX = 28;
const FONT_STEP = 2;
const READER_THEMES = ['night', 'sepia', 'day'];

const tg = window.Telegram ? window.Telegram.WebApp : null;

const library = document.getElementById('library');
const reader = document.getElementById('reader');
const storyList = document.getElementById('story-list');

function readStored(key, fallback, validate) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && validate(raw)) return raw;
  } catch { /* storage unavailable — use default */ }
  return fallback;
}

function store(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* ignore */ }
}

let fontSize = Number.parseInt(
  readStored(FONT_KEY, '20', (v) => {
    const n = Number.parseInt(v, 10);
    return n >= FONT_MIN && n <= FONT_MAX;
  }),
  10,
);
let readerTheme = readStored(THEME_KEY, 'night', (v) => READER_THEMES.includes(v));
let brightness = Number.parseInt(
  readStored(BRIGHTNESS_KEY, '100', (v) => {
    const n = Number.parseInt(v, 10);
    return n >= 55 && n <= 100;
  }),
  10,
);
let lineHeight = Number.parseFloat(
  readStored(LINE_KEY, '1.65', (v) => {
    const n = Number.parseFloat(v);
    return n >= 1.4 && n <= 2.1;
  }),
);

function applyFontSize() {
  document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
  store(FONT_KEY, fontSize);
}

function applyTheme() {
  document.body.dataset.readerTheme = readerTheme;
  for (const btn of document.querySelectorAll('.theme-btn')) {
    btn.classList.toggle('active', btn.dataset.theme === readerTheme);
  }
  store(THEME_KEY, readerTheme);
}

function applyBrightness() {
  // 100% → no veil; 55% → a soft 45% dim. Night-light friendly.
  document.getElementById('dim-overlay').style.opacity = String((100 - brightness) / 100);
  document.getElementById('brightness').value = String(brightness);
  store(BRIGHTNESS_KEY, brightness);
}

function applyLineHeight() {
  document.documentElement.style.setProperty('--reader-line-height', String(lineHeight));
  store(LINE_KEY, lineHeight);
}

function renderLibrary() {
  storyList.innerHTML = '';
  for (const story of SAMPLE_STORIES) {
    const card = document.createElement('button');
    card.className = 'story-card';
    card.innerHTML = `
      <div class="card-title">🌙 ${story.title}</div>
      <div class="card-meta">${story.date} · ${story.voice}</div>`;
    card.addEventListener('click', () => openReader(story));
    storyList.appendChild(card);
  }
}

function openReader(story) {
  document.getElementById('story-title').textContent = story.title;
  document.getElementById('story-meta').textContent = `${story.date} · ${story.voice}`;
  const text = document.getElementById('story-text');
  text.innerHTML = '';
  for (const paragraph of story.paragraphs) {
    const p = document.createElement('p');
    p.textContent = paragraph;
    text.appendChild(p);
  }
  library.hidden = true;
  reader.hidden = false;
  window.scrollTo(0, 0);
  if (tg) tg.BackButton.show();
}

function closeReader() {
  reader.hidden = true;
  library.hidden = false;
  if (tg) tg.BackButton.hide();
}

document.getElementById('back-btn').addEventListener('click', closeReader);
document.getElementById('font-minus').addEventListener('click', () => {
  fontSize = Math.max(FONT_MIN, fontSize - FONT_STEP);
  applyFontSize();
});
document.getElementById('font-plus').addEventListener('click', () => {
  fontSize = Math.min(FONT_MAX, fontSize + FONT_STEP);
  applyFontSize();
});
document.getElementById('settings-btn').addEventListener('click', () => {
  const panel = document.getElementById('reader-settings');
  panel.hidden = !panel.hidden;
});
for (const btn of document.querySelectorAll('.theme-btn')) {
  btn.addEventListener('click', () => {
    readerTheme = btn.dataset.theme;
    applyTheme();
  });
}
document.getElementById('brightness').addEventListener('input', (event) => {
  brightness = Number.parseInt(event.target.value, 10);
  applyBrightness();
});
document.getElementById('line-tight').addEventListener('click', () => {
  lineHeight = Math.max(1.4, Math.round((lineHeight - 0.15) * 100) / 100);
  applyLineHeight();
});
document.getElementById('line-loose').addEventListener('click', () => {
  lineHeight = Math.min(2.1, Math.round((lineHeight + 0.15) * 100) / 100);
  applyLineHeight();
});

if (tg) {
  tg.ready();
  tg.expand();
  tg.BackButton.onClick(closeReader);
}

applyFontSize();
applyTheme();
applyBrightness();
applyLineHeight();
renderLibrary();
