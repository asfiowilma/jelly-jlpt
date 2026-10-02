"use strict";

"use strict";


// Level colors: the active palette's level tokens (styles.css)
var LEVEL_COLORS = { N5: 'var(--n5)', N4: 'var(--n4)', N3: 'var(--n3)', N2: 'var(--n2)', N1: 'var(--n1)' };

// ── Progressive UI Translations ──────────────────────────────────────────────
// As learning-related words are taught in the curriculum, the UI progressively
// switches from English to Japanese. Each entry has {en, ja, since} where
// `since` is the day number when the Japanese word is first taught.
var UI_STRINGS = {
  // Navigation / header
  day_label:      { en: 'Day',      ja: 'だい',       since: 38  },
  week_label:     { en: 'Week',     ja: 'しゅう',     since: 39  },
  of_total:       { en: 'of',       ja: '/',           since: 38  },
  // Navbar tabs: kanji labels, `rt` = furigana shown via tRuby() while the pref is on
  view_today:     { en: 'Today',    ja: '今日', rt: 'きょう',     since: 38   },
  view_overview:  { en: 'Overview', ja: '一覧', rt: 'いちらん',   since: 1044 },
  view_review:    { en: 'Review',   ja: '復習', rt: 'ふくしゅう', since: 49   },
  // Day status
  mark_complete:   { en: '✓ Mark Complete',   ja: '✓ かんりょう！', since: 203 },
  mark_incomplete: { en: '✕ Mark Incomplete', ja: '✕ まだ',         since: 53  },
  complete_badge:  { en: '✓ Complete',         ja: '✓ かんりょう',  since: 203 },
  // Navigation buttons
  nav_prev: { en: '← Previous', ja: '← まえ',   since: 62  },
  nav_next: { en: 'Next →',     ja: 'つぎ →',   since: 109 },
  // Section labels (inside a lesson)
  section_characters: { en: 'Characters',    ja: 'もじ',       since: 277 },
  section_vocabulary: { en: 'Vocabulary',    ja: 'たんご',     since: 140 },
  section_grammar:    { en: 'Grammar Point', ja: 'ぶんぽう',   since: 183 },
  section_practice:   { en: 'Practice',      ja: 'れんしゅう', since: 147 },
  section_exercises:  { en: 'Exercises',     ja: 'もんだい',   since: 212 },
  // Vocabulary table headers
  vocab_word:    { en: 'Word',    ja: 'ことば', since: 139 },
  vocab_reading: { en: 'Reading', ja: 'よみ',   since: 58  },
  vocab_meaning: { en: 'Meaning', ja: 'いみ',   since: 137 },
  // SRS review buttons
  btn_again: { en: 'Again', ja: 'もういちど',  since: 47  },
  btn_hard:  { en: 'Hard',  ja: 'むずかしい', since: 77  },
  btn_good:  { en: 'Good',  ja: 'いい',       since: 44  },
  btn_easy:  { en: 'Easy',  ja: 'かんたん',   since: 156 },
  // Review card labels
  card_char:    { en: 'Character',  ja: 'もじ',   since: 277 },
  card_vocab:   { en: 'Vocabulary', ja: 'たんご', since: 140 },
  tap_reveal:   { en: 'tap to reveal',                    ja: 'タップしてみる',  since: 15  },
  click_reveal: { en: 'Click the card to see the answer', ja: 'カードをクリック！', since: 46 },
  // Review completion messages
  all_caught_up:  { en: 'All caught up!',      ja: 'ぜんぶおわった！',  since: 179 },
  no_cards_due:   { en: 'No cards due for review right now.', ja: 'いまふくしゅうカードはありません。', since: 49 },
  session_done:   { en: 'Session complete!',   ja: 'よくできました！',  since: 140 },
  // Exercise / quiz labels
  start_quiz:  { en: 'Start Quiz',               ja: 'テストをはじめる',     since: 117 },
  try_again:   { en: 'Try Again',                ja: 'もういちど',            since: 47  },
  quiz_title:  { en: 'Ready to test yourself?',  ja: 'テストのじかんです！',  since: 117 },
  check_btn:   { en: 'Check',                    ja: 'かくにん',              since: 147 },
  // Exercise prompts (translated once prerequisite words are taught)
  prompt_listen:    { en: 'Listen and choose the meaning:', ja: 'きいて、いみをえらんでください：', since: 137 },
  prompt_mc_char:   { en: 'What is the reading for this character?', ja: 'このもじのよみは？', since: 277 },
  prompt_mc_word:   { en: 'What does this word mean?', ja: 'このことばのいみは？', since: 137 },
  prompt_type_char: { en: 'Type the reading for this character:', ja: 'このもじのよみをにゅうりょくしてください：', since: 277 },
  prompt_type_word: { en: 'What does this word mean? (type in English)', ja: 'このことばのいみは？（えいごで）', since: 137 },
  // N3 additions
  reading_passage: { en: 'Reading', ja: '読解', since: 935 },
  conjugate:       { en: 'Conjugate', ja: '活用', since: 775 },
  // N2 additions
  synonym_label:   { en: 'Synonym', ja: '類義語', since: 1100 },
  reorder_label:   { en: 'Reorder', ja: '並べ替え', since: 1150 },
  // N1 additions
  editorial:       { en: 'Editorial', ja: '社説', since: 1700 },
  mock_exam:       { en: 'Mock Exam', ja: '模擬試験', since: 1695 },
  furigana_show:   { en: 'Show furigana', ja: 'ふりがな表示', since: 400 },
  furigana_hide:   { en: 'Hide furigana', ja: 'ふりがな非表示', since: 400 },
  // Settings view. These words are never taught as lesson vocabulary, so in
  // 'auto' they switch with N1 (day 1321); 'ja' shows them immediately.
  settings_title:    { en: 'Settings',          ja: '設定',             since: 1321 },
  settings_back:     { en: '← Back',            ja: '← 戻る',           since: 1321 },
  set_appearance:    { en: 'Appearance',        ja: '外観',             since: 1321 },
  set_palette:       { en: 'Color palette',     ja: '配色',             since: 1321 },
  set_dark:          { en: '☾ Dark mode',       ja: '☾ ダークモード',   since: 1321 },
  set_on:            { en: 'On',                ja: 'オン',             since: 1321 },
  set_off:           { en: 'Off',               ja: 'オフ',             since: 1321 },
  set_language:      { en: 'Language',          ja: '言語',             since: 1321 },
  set_ui_lang:       { en: 'Interface language', ja: '表示言語',        since: 1321 },
  set_lang_auto:     { en: 'Auto — switch to Japanese as you learn', ja: '自動 — 学習に合わせて日本語に', since: 1321 },
  set_furigana:      { en: 'Furigana',          ja: 'ふりがな',         since: 1321 },
  set_furi_auto:     { en: 'Auto — on until N1', ja: '自動 — N1まで表示', since: 1321 },
  set_furi_always:   { en: 'Always show',       ja: '常に表示',         since: 1321 },
  set_furi_never:    { en: 'Never show',        ja: '表示しない',       since: 1321 },
  set_audio:         { en: 'Audio',             ja: '音声',             since: 1321 },
  set_speech_speed:  { en: 'Speech speed',      ja: '読み上げ速度',     since: 1321 },
  set_data:          { en: 'Data',              ja: 'データ',           since: 1321 },
  set_data_hint:     { en: 'Save your progress to a file, or restore it from one.', ja: '学習データをファイルに保存、またはファイルから復元します。', since: 1321 },
  set_export:        { en: 'Export',            ja: 'エクスポート',     since: 1321 },
  set_import:        { en: 'Import',            ja: 'インポート',       since: 1321 },
  set_sync:          { en: 'Sync',              ja: '同期',             since: 1321 },
  set_sync_soon:     { en: 'Multi-device sync — coming soon', ja: '複数端末の同期 — 近日公開', since: 1321 },
  set_sfx:           { en: 'Sound effects',     ja: '効果音',           since: 1321 },
};
// window._uiLang ('auto' | 'en' | 'ja', set by App from jlpt_ui_lang) overrides
// the progressive switch; 'auto' / unset keeps the day-based behavior.
function t(key, dayNum) {
  var s = UI_STRINGS[key];
  if (!s) return key;
  if (window._uiLang === 'en') return s.en;
  if (window._uiLang === 'ja') return s.ja;
  return (dayNum >= s.since) ? s.ja : s.en;
}
// tRuby: t() as a React node — a JA label with an `rt` reading gets ruby
// furigana when `furigana` is on (same pref DayView uses, see furiganaOn).
function tRuby(key, dayNum, furigana) {
  var s = UI_STRINGS[key], label = t(key, dayNum);
  if (!s || !s.rt || !furigana || label !== s.ja) return label;
  return React.createElement('ruby', null, s.ja, React.createElement('rt', null, s.rt));
}

// ── Icons (navbar / settings) ────────────────────────────────────────────────
// Stroke icons from the navbar sketch; styled by .tab svg / .icon-btn svg.
var ICONS = {
  today: [['path', { d: 'M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2z' }], ['path', { d: 'M8 8h6' }]],
  overview: [['rect', { x: 4, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 4, y: 13, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 13, width: 7, height: 7, rx: 1.5 }]],
  review: [['rect', { x: 3, y: 7, width: 14, height: 12, rx: 2 }], ['path', { d: 'M7 4h12a2 2 0 0 1 2 2v10' }]],
  gear: [['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' }]]
};
function icon(name) {
  return React.createElement('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    ICONS[name].map(function (el, i) { return React.createElement(el[0], Object.assign({ key: i }, el[1])); }));
}

// ── localStorage ─────────────────────────────────────────────────────────────
var LS_KEY = 'n5_2025';
function lsLoad() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}
function lsSave(data) {
  safeSave(LS_KEY, JSON.stringify(data));
}

// ── TTS ──────────────────────────────────────────────────────────────────────
window._ttsRate = 0.85;
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var doSpeak = function() {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = window._ttsRate || 0.85;
    var vs = window.speechSynthesis.getVoices();
    var ja = vs.find(function(v) { return v.lang && v.lang.startsWith('ja'); });
    if (ja) u.voice = ja;
    window.speechSynthesis.speak(u);
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, {once: true});
  }
}

// ── Stroke Order ─────────────────────────────────────────────────────────────
// Convert a kanji character to its Unicode hex filename (e.g., 一 → 04e00)
function kanjiToUnicodeHex(char) {
  var code = char.charCodeAt(0);
  return code.toString(16).padStart(5, '0');
}

// Load stroke order SVG for a kanji character (sessionStorage cache + 2 retries)
function loadStrokeOrderSvg(char) {
  var hex = kanjiToUnicodeHex(char);
  var cacheKey = 'svg_' + hex;
  try {
    var cached = sessionStorage.getItem(cacheKey);
    if (cached) return Promise.resolve(cached);
  } catch(e) {}

  function attempt(n) {
    return fetch('kanji-svg/' + hex + '.svg')
      .then(function(response) {
        if (!response.ok) throw new Error('SVG not found');
        return response.text();
      })
      .then(function(svg) {
        try { sessionStorage.setItem(cacheKey, svg); } catch(e) {}
        return svg;
      })
      .catch(function(err) {
        if (n < 2) {
          var delay = n === 0 ? 1000 : 2000;
          return new Promise(function(resolve, reject) {
            setTimeout(function() { attempt(n + 1).then(resolve, reject); }, delay);
          });
        }
        throw err;
      });
  }
  return attempt(0);
}
