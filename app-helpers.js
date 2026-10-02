"use strict";

// Level colors: the active palette's level tokens (styles.css)
var LEVEL_COLORS = { N5: 'var(--n5)', N4: 'var(--n4)', N3: 'var(--n3)', N2: 'var(--n2)', N1: 'var(--n1)' };

// ── Progressive UI Translations ──────────────────────────────────────────────
// As learning-related words are taught in the curriculum, the UI progressively
// switches from English to Japanese. Each entry has {en, ja, since} where
// `since` is the level from which the Japanese label shows (Q23): words taught
// during N5 switch at N4, and so on. Settings words are never taught → N1.
var UI_STRINGS = {
  // Navigation / header
  unit_label:     { en: 'Unit',     ja: 'ユニット',   since: 'N4' },
  // Navbar tabs: kanji labels, `rt` = furigana shown via tRuby() while the pref is on
  view_today:     { en: 'Today',    ja: '今日', rt: 'きょう',     since: 'N4'   },
  view_overview:  { en: 'Overview', ja: '一覧', rt: 'いちらん',   since: 'N1' },
  view_review:    { en: 'Review',   ja: '復習', rt: 'ふくしゅう', since: 'N4'   },
  // Day status
  mark_complete:   { en: '✓ Mark Complete',   ja: '✓ かんりょう！', since: 'N4' },
  mark_incomplete: { en: '✕ Mark Incomplete', ja: '✕ まだ',         since: 'N4'  },
  complete_badge:  { en: '✓ Complete',         ja: '✓ かんりょう',  since: 'N4' },
  // Navigation buttons
  nav_prev: { en: '← Previous', ja: '← まえ',   since: 'N4'  },
  nav_next: { en: 'Next →',     ja: 'つぎ →',   since: 'N4' },
  // Section labels (inside a lesson)
  section_kanji:      { en: 'Kanji',         ja: 'かんじ',     since: 'N4' },
  section_vocabulary: { en: 'Vocabulary',    ja: 'たんご',     since: 'N4' },
  section_grammar:    { en: 'Grammar Point', ja: 'ぶんぽう',   since: 'N4' },
  section_practice:   { en: 'Practice',      ja: 'れんしゅう', since: 'N4' },
  section_exercises:  { en: 'Exercises',     ja: 'もんだい',   since: 'N4' },
  // Vocabulary table headers
  vocab_word:    { en: 'Word',    ja: 'ことば', since: 'N4' },
  vocab_reading: { en: 'Reading', ja: 'よみ',   since: 'N4'  },
  vocab_meaning: { en: 'Meaning', ja: 'いみ',   since: 'N4' },
  // SRS review buttons
  btn_again: { en: 'Again', ja: 'もういちど',  since: 'N4'  },
  btn_hard:  { en: 'Hard',  ja: 'むずかしい', since: 'N4'  },
  btn_good:  { en: 'Good',  ja: 'いい',       since: 'N4'  },
  btn_easy:  { en: 'Easy',  ja: 'かんたん',   since: 'N4' },
  // Review card labels
  card_vocab:   { en: 'Vocabulary', ja: 'たんご', since: 'N4' },
  tap_reveal:   { en: 'tap to reveal',                    ja: 'タップしてみる',  since: 'N4'  },
  click_reveal: { en: 'Click the card to see the answer', ja: 'カードをクリック！', since: 'N4' },
  // Review completion messages
  all_caught_up:  { en: 'All caught up!',      ja: 'ぜんぶおわった！',  since: 'N4' },
  no_cards_due:   { en: 'No cards due for review right now.', ja: 'いまふくしゅうカードはありません。', since: 'N4' },
  session_done:   { en: 'Session complete!',   ja: 'よくできました！',  since: 'N4' },
  // Exercise / quiz labels
  start_quiz:  { en: 'Start Quiz',               ja: 'テストをはじめる',     since: 'N4' },
  try_again:   { en: 'Try Again',                ja: 'もういちど',            since: 'N4'  },
  quiz_title:  { en: 'Ready to test yourself?',  ja: 'テストのじかんです！',  since: 'N4' },
  check_btn:   { en: 'Check',                    ja: 'かくにん',              since: 'N4' },
  // Exercise prompts (translated once prerequisite words are taught)
  prompt_listen:    { en: 'Listen and choose the meaning:', ja: 'きいて、いみをえらんでください：', since: 'N4' },
  prompt_mc_char:   { en: 'What is the reading for this character?', ja: 'このもじのよみは？', since: 'N4' },
  prompt_mc_word:   { en: 'What does this word mean?', ja: 'このことばのいみは？', since: 'N4' },
  prompt_type_char: { en: 'Type the reading for this character:', ja: 'このもじのよみをにゅうりょくしてください：', since: 'N4' },
  prompt_type_word: { en: 'What does this word mean? (type in English)', ja: 'このことばのいみは？（えいごで）', since: 'N4' },
  // N3 additions
  reading_passage: { en: 'Reading', ja: '読解', since: 'N2' },
  conjugate:       { en: 'Conjugate', ja: '活用', since: 'N2' },
  // N2 additions
  synonym_label:   { en: 'Synonym', ja: '類義語', since: 'N1' },
  reorder_label:   { en: 'Reorder', ja: '並べ替え', since: 'N1' },
  // N1 additions
  editorial:       { en: 'Editorial', ja: '社説', since: 'N1' },
  mock_exam:       { en: 'Mock Exam', ja: '模擬試験', since: 'N1' },
  furigana_show:   { en: 'Show furigana', ja: 'ふりがな表示', since: 'N3' },
  furigana_hide:   { en: 'Hide furigana', ja: 'ふりがな非表示', since: 'N3' },
  // Settings view. These words are never taught as lesson vocabulary, so in
  // 'auto' they switch with N1; 'ja' shows them immediately.
  settings_title:    { en: 'Settings',          ja: '設定',             since: 'N1' },
  settings_back:     { en: '← Back',            ja: '← 戻る',           since: 'N1' },
  set_appearance:    { en: 'Appearance',        ja: '外観',             since: 'N1' },
  set_palette:       { en: 'Color palette',     ja: '配色',             since: 'N1' },
  set_dark:          { en: '☾ Dark mode',       ja: '☾ ダークモード',   since: 'N1' },
  set_on:            { en: 'On',                ja: 'オン',             since: 'N1' },
  set_off:           { en: 'Off',               ja: 'オフ',             since: 'N1' },
  set_language:      { en: 'Language',          ja: '言語',             since: 'N1' },
  set_ui_lang:       { en: 'Interface language', ja: '表示言語',        since: 'N1' },
  set_lang_auto:     { en: 'Auto — switch to Japanese as you learn', ja: '自動 — 学習に合わせて日本語に', since: 'N1' },
  set_furigana:      { en: 'Furigana',          ja: 'ふりがな',         since: 'N1' },
  set_furi_auto:     { en: 'Auto — on until N1', ja: '自動 — N1まで表示', since: 'N1' },
  set_furi_always:   { en: 'Always show',       ja: '常に表示',         since: 'N1' },
  set_furi_never:    { en: 'Never show',        ja: '表示しない',       since: 'N1' },
  set_audio:         { en: 'Audio',             ja: '音声',             since: 'N1' },
  set_speech_speed:  { en: 'Speech speed',      ja: '読み上げ速度',     since: 'N1' },
  set_data:          { en: 'Data',              ja: 'データ',           since: 'N1' },
  set_data_hint:     { en: 'Save your progress to a file, or restore it from one.', ja: '学習データをファイルに保存、またはファイルから復元します。', since: 'N1' },
  set_export:        { en: 'Export',            ja: 'エクスポート',     since: 'N1' },
  set_import:        { en: 'Import',            ja: 'インポート',       since: 'N1' },
  set_sync:          { en: 'Sync',              ja: '同期',             since: 'N1' },
  set_sync_soon:     { en: 'Multi-device sync — coming soon', ja: '複数端末の同期 — 近日公開', since: 'N1' },
  set_sfx:           { en: 'Sound effects',     ja: '効果音',           since: 'N1' },
};
// t(key, level): level = the learner's current unit level ('N5'…'N1').
// window._uiLang ('auto' | 'en' | 'ja', set by App from prefs) overrides
// the progressive switch; 'auto' / unset keeps the level-based behavior.
function t(key, level) {
  var s = UI_STRINGS[key];
  if (!s) return key;
  if (window._uiLang === 'en') return s.en;
  if (window._uiLang === 'ja') return s.ja;
  return levelRank(level) >= levelRank(s.since) ? s.ja : s.en;
}
// tRuby: t() as a React node — a JA label with an `rt` reading gets ruby
// furigana when `furigana` is on (same pref UnitView uses, see furiganaOn).
function tRuby(key, level, furigana) {
  var s = UI_STRINGS[key], label = t(key, level);
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
