"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function hasKanji(str) { return /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(str); }

// ── Furigana helper ──────────────────────────────────────────────────────────
function furiganaHTML(word, reading) {
  if (!reading || reading === word || !hasKanji(word)) return word;
  return '<ruby>' + word + '<rt>' + reading + '</rt></ruby>';
}

// furiganaParts: sentence furigana ('[毎日|まい|にち]ここで[食|た]べる', Tatoeba style:
// one reading for the block, or one per kanji) → [{ t: text, r: ruby? }, ...].
function furiganaParts(s) {
  var out = [], re = /\[([^|\]]+)((?:\|[^|\]]*)+)\]/g, last = 0, m;
  while (m = re.exec(s)) {
    if (m.index > last) out.push({ t: s.slice(last, m.index) });
    var chars = Array.from(m[1]), rs = m[2].slice(1).split('|');
    if (rs.length > 1 && rs.length === chars.length) {
      chars.forEach(function (c, i) { out.push(rs[i] ? { t: c, r: rs[i] } : { t: c }); });
    } else out.push({ t: m[1], r: rs.join('') });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ t: s.slice(last) });
  return out;
}

// ── Levels ───────────────────────────────────────────────────────────────────
var LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
// levelRank: 0 (N5) … 4 (N1); -1 for anything else. "N3+" = levelRank(lv) >= 2.
function levelRank(level) { return LEVELS.indexOf(level); }

// ── Units: PLAN + CATALOG joined (spec §4) ──────────────────────────────────
var UNIT_KINDS = ['kana', 'lesson', 'review', 'prep', 'mock'];
var UNIT_ITEM_FIELDS = { kana: 'kana', vocab: 'vocab', kanji: 'kanji', grammar: 'grammar' }; // unit field → item kind (taught)
// practice: a kana unit's reading-drill words — vocab shown in kana, taught in a later
// lesson, so not counted as taught and no SRS card here.
var UNIT_REF_FIELDS = Object.assign({ practice: 'vocab' }, UNIT_ITEM_FIELDS);
// unit field → item kind asked in its quiz but not taught (review units, tickets 15 / 17)
var UNIT_QUIZ_FIELDS = { passages: 'passage', listening: 'listening' };

// validatePlan: every unit well-formed and every referenced id in the catalog
// with the right kind. Returns { valid, error } (first problem only).
function validatePlan(plan, catalog) {
  var seen = {};
  for (var p = 0; p < plan.length; p++) {
    var lp = plan[p];
    if (levelRank(lp.level) < 0) return { valid: false, error: 'plan level ' + lp.level };
    for (var i = 0; i < lp.units.length; i++) {
      var u = lp.units[i];
      if (!/^n[1-5]\.u\d{3}$/.test(u.id || '')) return { valid: false, error: 'bad unit id ' + u.id };
      if (seen[u.id]) return { valid: false, error: 'duplicate unit id ' + u.id };
      seen[u.id] = true;
      if (u.level !== lp.level) return { valid: false, error: u.id + ' level ' + u.level + ' in ' + lp.level + ' plan' };
      if (UNIT_KINDS.indexOf(u.kind) < 0) return { valid: false, error: u.id + ' kind ' + u.kind };
      if (!u.title) return { valid: false, error: u.id + ' missing title' };
      for (var f in UNIT_REF_FIELDS) {
        var ids = u[f] || [];
        for (var j = 0; j < ids.length; j++) {
          var it = catalog.items[ids[j]];
          if (!it) return { valid: false, error: u.id + ' references missing ' + ids[j] };
          if (it.kind !== UNIT_REF_FIELDS[f]) return { valid: false, error: u.id + '.' + f + ' has ' + it.kind + ' ' + ids[j] };
        }
      }
      // prep: a timed drill per blueprint key (prepDrill); mock: the fixed mock it runs (ticket 18)
      if (u.kind === 'prep' && !Object.keys(u.drill || {}).length) return { valid: false, error: u.id + ' prep without a drill' };
      for (var dk in u.drill || {}) {
        if (!MONDAI[dk] && ['short', 'mid', 'info'].indexOf(dk) < 0 && !LISTEN_PROMPTS[dk]) return { valid: false, error: u.id + ' drill ' + dk };
      }
      if (u.kind === 'mock' && !(catalog.items[u.mock] && catalog.items[u.mock].kind === 'mock')) return { valid: false, error: u.id + ' references missing mock ' + u.mock };
      // passages / listening: texts and dialogues a unit's quiz asks about (tickets 15, 17);
      // not taught items, no cards
      for (var pf in UNIT_QUIZ_FIELDS) {
        var ps = u[pf] || [];
        for (var q = 0; q < ps.length; q++) {
          var pi = catalog.items[ps[q]];
          if (!pi || pi.kind !== UNIT_QUIZ_FIELDS[pf]) return { valid: false, error: u.id + ' references missing ' + UNIT_QUIZ_FIELDS[pf] + ' ' + ps[q] };
        }
      }
    }
  }
  return { valid: true, error: null };
}

// buildUnits: flat, ordered list of resolved units — plan fields + `index`
// (global position) with kana/vocab/kanji/grammar/practice as catalog items.
// A review unit gets the items of every kana/lesson unit since the previous
// review. Call validatePlan first.
function buildUnits(plan, catalog) {
  var out = [];
  var since = [];
  plan.slice().sort(function (a, b) { return levelRank(a.level) - levelRank(b.level); }).forEach(function (lp) {
    lp.units.forEach(function (u) {
      var r = Object.assign({}, u, { index: out.length });
      if (u.kind === 'review') {
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
          r[f] = [].concat.apply([], since.map(function (x) { return x[f]; }));
        });
        r.practice = [];
        since = [];
      } else {
        Object.keys(UNIT_REF_FIELDS).forEach(function (f) {
          r[f] = (u[f] || []).map(function (id) { return catalog.items[id]; });
        });
        if (u.kind === 'lesson' || u.kind === 'kana') since.push(r);
      }
      out.push(r);
    });
  });
  return out;
}

// nextUnit: index of the suggested unit = first one not done (nothing is locked, Q22).
function nextUnit(units, completed) {
  for (var i = 0; i < units.length; i++) if (!completed.has(units[i].id)) return i;
  return units.length - 1;
}

// levelRamp: the N5→N1 ramp atop Overview. One segment per level that has
// units, sized by unit count, filled up to and including unit `current`
// (index). `here` = marker position in % of the ramp.
// ponytail: levels with no units yet ("coming soon") get no segment.
function levelRamp(units, current) {
  var segments = [];
  units.forEach(function (u) {
    var s = segments[segments.length - 1];
    if (!s || s.level !== u.level) segments.push(s = { level: u.level, start: u.index, len: 0 });
    s.len++;
  });
  segments.forEach(function (s) {
    s.fill = Math.max(0, Math.min(s.len, current - s.start + 1)) / s.len * 100;
  });
  return { segments: segments, here: units.length ? (current + 0.5) / units.length * 100 : 0 };
}

// furiganaOn: the furigana pref ('true'/'false' string, or null when unset).
// Unset → on through N2, off for N1.
function furiganaOn(stored, level) {
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  return level !== 'N1';
}

// ── Quiz gate (ticket 35, Q28/Q29) ──────────────────────────────────────────
// A unit completes only by passing its quiz. Unlimited retakes, fresh questions.
// Kana quizzes (ticket 44) pass on reading at 85%: passMark('kana') is the reading mark.
function passMark(kind) { return kind === 'kana' ? KANA_READ_PASS : 0.8; }
function quizPassed(right, total, kind) { return total > 0 && right / total >= passMark(kind) - 1e-9; }
// quizLength: the target length. Kana 10, lesson N5 12 / N4 14 / N3+ 16, review 20. Kana and
// lesson quizzes grow to ask every item once (nItems), capped at QUIZ_MAX_QUESTIONS. It is a
// maximum: quizSize shortens it when there are few items (ticket 43).
// ponytail: 30 = the biggest N5 unit (21 kana) with room; units past it get
// a random 30 of their items — split the unit if that ever happens.
var QUIZ_MAX_QUESTIONS = 30;
function quizLength(unit, nItems) {
  if (unit.kind === 'review') return 20;
  var base = unit.kind === 'kana' ? 10 : [12, 14][levelRank(unit.level)] || 16;
  return Math.min(QUIZ_MAX_QUESTIONS, Math.max(base, nItems || 0));
}
// Variety (ticket 43): an item is asked at most twice in a quiz (re-asked misses don't count), never
// within QUIZ_SPACING questions of itself. Few items → a shorter quiz, down to QUIZ_MIN_QUESTIONS;
// a second ask only to reach that minimum.
var QUIZ_ITEM_MAX = 2, QUIZ_SPACING = 3, QUIZ_MIN_QUESTIONS = 8;
function quizCapacity(n) { return Math.max(n, Math.min(QUIZ_MIN_QUESTIONS, QUIZ_ITEM_MAX * n)); }
// Kana quizzes (ticket 44): reading is tested mostly through words written only in kana learned so
// far (kanaReadWords); a single-kana question only for a new kana no word covers. Two marks, both
// required: reading questions (single kana + kana words) 85%, meaning questions on taught words 80%.
// A kana review asks KANA_REVIEW_MEANING_SHARE of its questions about taught words' meanings.
// Single-kana questions aim at ≤ KANA_SINGLE_SHARE of the reading; stages whose new kana are in
// hardly any N5 word (yōon, early katakana) can't get there.
var KANA_READ_PASS = 0.85, KANA_MEANING_PASS = 0.8, KANA_REVIEW_MEANING_SHARE = 0.3, KANA_SINGLE_SHARE = 0.2;
// quizSize(unit, items): questions in the unit's quiz: quizLength, shortened to what the items
// can fill (quizCapacity). A kana quiz (kanaQuizSlots) can fill: each taught word's meaning, each
// word read once (reading words + taught words) and a single-kana question for each kana no word
// holds; its marks (っ, ー) count as items, a word covers them.
function quizSize(unit, items) {
  var target = quizLength(unit, items.length + (unit.kind === 'kana' ? (unit.marks || []).length : 0));
  if (!items.some(function (it) { return it.kind === 'kana'; })) return Math.min(target, quizCapacity(items.length));
  var words = items.filter(function (it) { return it.kind !== 'kana'; }), reads = kanaReadWords(unit, items).concat(words.filter(function (w) { return hasNewKana(unit, w.word); })), has = {};
  reads.forEach(function (w) { kanaSyllables(w.word).forEach(function (c) { has[c] = true; }); });
  var singles = items.filter(function (it) { return it.kind === 'kana' && !has[it.char]; }).length;
  // room for enough words that single kana stay ≤ KANA_SINGLE_SHARE of the reading, up to the cap
  if (unit.kind === 'kana') target = Math.min(QUIZ_MAX_QUESTIONS, Math.max(target, words.length + Math.ceil(singles / KANA_SINGLE_SHARE)));
  return Math.min(target, Math.max(QUIZ_MIN_QUESTIONS, words.length + reads.length + singles));
}
// isKanaQuiz(unit): a kana unit, or a review of kana units (split pass mark).
function isKanaQuiz(unit) { return quizItems(unit).some(function (it) { return it.kind === 'kana'; }); }
// passMarkText(unit): the pass mark as shown on the quiz card and the stage bar.
function passMarkText(unit) {
  return isKanaQuiz(unit) ? Math.round(KANA_READ_PASS * 100) + '% on reading, ' + Math.round(KANA_MEANING_PASS * 100) + '% on meanings'
    : Math.round(passMark(unit.kind) * 100) + '%';
}

// Catalog item → display strings
function glossText(v) { return v.gloss.join(' / '); }

// noteParts(notes): a unit note → { head, body[] } for the lesson note box. head = the first
// sentence of the first paragraph; the rest of that paragraph is split into sentences, later
// paragraphs (prep/mock notes: one per line) stay whole. "e.g." / "i.e." / "etc." don't end a sentence.
function noteParts(notes) {
  var paras = String(notes || '').split('\n').map(function (p) { return p.trim(); }).filter(Boolean);
  if (!paras.length) return { head: '', body: [] };
  var sentences = [];
  paras[0].replace(/([.!?])\s+/g, '$1\u0000').split('\u0000').forEach(function (s) {
    var last = sentences.length - 1;
    if (last >= 0 && /(?:e\.g\.|i\.e\.|etc\.|vs\.)$/i.test(sentences[last])) sentences[last] += ' ' + s;
    else sentences.push(s);
  });
  return { head: sentences[0], body: sentences.slice(1).concat(paras.slice(1)) };
}
function kataToHira(s) { return s.replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); }); }
// kanjiReadings: readings as typed/shown (kun okurigana dot dropped, on in katakana).
function kanjiReadings(k) {
  return (k.kun || []).map(function (r) { return r.replace('.', ''); }).concat(k.on || []);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function rndShuffle(arr) {
  var a = _toConsumableArray(arr);
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref7 = [a[j], a[i]];
    a[i] = _ref7[0];
    a[j] = _ref7[1];
  }
  return a;
}
// ── Verb conjugation ─────────────────────────────────────────────────────────
var CONJ_FORMS = ['て-form', 'ない-form', 'た-form', 'potential', 'passive', 'causative', 'volitional'];
var GODAN_ROWS = { 'う': 'わえお', 'く': 'かけこ', 'ぐ': 'がげご', 'す': 'させそ', 'つ': 'たてと', 'ぬ': 'なねの', 'ぶ': 'ばべぼ', 'む': 'まめも', 'る': 'られろ' };
var GODAN_TE = { 'う': 'って', 'つ': 'って', 'る': 'って', 'く': 'いて', 'ぐ': 'いで', 'す': 'して', 'ぬ': 'んで', 'ぶ': 'んで', 'む': 'んで' };
// ponytail: i/e-row る verbs that are godan anyway; kanji-only match, so an all-kana
// ambiguous word (かえる, いる) falls back to ichidan. Extend the list when one bites.
var GODAN_RU_EXCEPTIONS = /(帰|返|還|入|走|知|要|切|限|減|喋|滑|握|蹴|参|混じ|交じ|照|散|焦|茂|湿|練|遮|覆|陥|蘇|甦|罵|翻|捻|嘲|耽|詰|弄|煎|炒|しゃべ)る$/;

// conjugate(dictForm, reading, form, pos?) → { kanji, kana } or null when the word
// isn't a verb we can conjugate with certainty. form is one of CONJ_FORMS.
// pos ('verb-ichidan' | 'verb-godan', catalog item field) overrides the る-verb guess.
function conjugate(dict, reading, form, pos) {
  var idx = CONJ_FORMS.indexOf(form);
  if (idx < 0 || !dict || !reading || dict.slice(-1) !== reading.slice(-1)) return null;
  var suffixes, cut = 1;
  if (/する$/.test(dict) && /する$/.test(reading)) {
    suffixes = ['して', 'しない', 'した', 'できる', 'される', 'させる', 'しよう'];
    cut = 2;
  } else if ((/来る$/.test(dict) || dict === 'くる') && /くる$/.test(reading)) {
    var k = ['きて', 'こない', 'きた', 'こられる', 'こられる', 'こさせる', 'こよう'][idx];
    var kana = reading.slice(0, -2) + k;
    return { kanji: dict === 'くる' ? kana : dict.slice(0, -1) + k.slice(1), kana: kana };
  } else if (/(ずる|ある)$/.test(reading)) {
    return null; // ponytail: 信ずる-type and ある (ない-form) are irregular; not handled
  } else if (/る$/.test(reading) && (pos === 'verb-ichidan' || pos !== 'verb-godan' &&
             'いきぎしじちぢにひびみりえけげせぜてでねへべめれ'.indexOf(reading.slice(-2, -1)) >= 0 &&
             !GODAN_RU_EXCEPTIONS.test(dict))) {
    suffixes = ['て', 'ない', 'た', 'られる', 'られる', 'させる', 'よう'];
  } else {
    var last = reading.slice(-1), row = GODAN_ROWS[last];
    if (!row) return null;
    var te = /行く$/.test(dict) || dict === 'いく' ? 'って' : GODAN_TE[last];
    suffixes = [te, row[0] + 'ない', te.replace('て', 'た').replace('で', 'だ'), row[1] + 'る', row[0] + 'れる', row[0] + 'せる', row[2] + 'う'];
  }
  return { kanji: dict.slice(0, -cut) + suffixes[idx], kana: reading.slice(0, -cut) + suffixes[idx] };
}

// catalogOf: every catalog item of one kind (distractor pools).
// ponytail: O(catalog) per call; cache per kind if quizzes ever feel slow.
function catalogOf(kind) {
  return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) {
    return it.kind === kind;
  });
}

// ── Kana distractors ────────────────────────────────────────────────────────
// Shapes learners mix up (same script only), one string per look-alike set.
var KANA_LOOKALIKES = ['あおめぬ', 'いりこに', 'うらつ', 'きさち', 'くへ', 'けはほま', 'しつ', 'たなに', 'ねれわ', 'るろ', 'まも', 'せや',
  'シツミ', 'ソンリノ', 'クケタワウフ', 'スヌフラ', 'コロユヨ', 'チテナ', 'アマヤ', 'セヒサ', 'ノメソ', 'オホ', 'エニ', 'ルレ'];
function kanaBase(ch) { return ch.normalize('NFD').charAt(0); } // が → か, ぱ → は
// kanaDistractors(k, n, pool): n same-script kana of the same size (single / combo)
// whose romaji can't be confused with k's: look-alikes and dakuten siblings first
// (し/つ, か/が, きゃ/きゅ, しゃ/ちゃ), then the unit's own kana (pool), then any. learned ({ char:
// true }, optional): kana not learned yet come only after every learned one (audit P2-3).
function kanaDistractors(k, n, pool, learned) {
  var first = k.char.charAt(0), small = k.char.slice(1);
  var like = KANA_LOOKALIKES.filter(function (s) { return s.indexOf(kanaBase(first)) >= 0; }).join('');
  var tier = function (x) {
    var f = x.char.charAt(0);
    var sameSmall = x.char.slice(1) === small;
    if (learned && !learned[x.char]) return 4;
    if (like.indexOf(f) >= 0 && sameSmall) return 0; // シ → ツ before ジ/ヅ
    if (kanaBase(f) === kanaBase(first) || like.indexOf(kanaBase(f)) >= 0 && sameSmall) return 1;
    return pool.indexOf(x) >= 0 ? 2 : 3;
  };
  var cands = catalogOf('kana').filter(function (x) {
    return x.script === k.script && x.id !== k.id && x.char.length === k.char.length &&
      x.answers.indexOf(k.romaji) < 0 && k.answers.indexOf(x.romaji) < 0;
  });
  return [0, 1, 2, 3, 4].reduce(function (acc, t) {
    return acc.concat(rndShuffle(cands.filter(function (x) { return tier(x) === t; })));
  }, []).slice(0, n);
}

// ── Kana words (ticket 42, Q45) ─────────────────────────────────────────────
// Kana units teach a few real words spelled in kana. Their quiz reads them in romaji, spells
// them from romaji, and links them to their meaning.
var KANA_WORD_RE = /^[ぁ-ゖァ-ヺー]+$/;
var _kanaAns = null;
function kanaAnswers() { // kana char → romaji answers (Hepburn first)
  if (!_kanaAns) { _kanaAns = {}; catalogOf('kana').forEach(function (k) { _kanaAns[k.char] = k.answers; }); }
  return _kanaAns;
}
// kanaChunks(word): per syllable, the romaji spellings accepted for it. Small っ doubles the next
// consonant (ch → tch, Hepburn, or cch); ー repeats the vowel before it ('-' accepted too).
function kanaChunks(word) {
  var map = kanaAnswers(), ch = Array.from(word), out = [], dbl = false;
  for (var i = 0; i < ch.length; i++) {
    var two = ch[i] + (ch[i + 1] || ''), alts;
    if (map[two]) { alts = map[two]; i++; }
    else if (ch[i] === 'っ' || ch[i] === 'ッ') { dbl = true; continue; }
    else if (ch[i] === 'ー') { var prev = out.length ? out[out.length - 1][0] : ''; alts = [prev.slice(-1), '-']; }
    else alts = map[ch[i]] || [ch[i]];
    if (ch[i] === 'ん' || ch[i] === 'ン') alts = alts.concat("n'");
    if (dbl) alts = [].concat.apply([], alts.map(function (a) { return /^ch/.test(a) ? ['t' + a, 'c' + a] : [a.charAt(0) + a]; }));
    dbl = false;
    out.push(alts);
  }
  return out;
}
// kanaToRomaji(word): modified Hepburn, long vowels doubled (コーヒー koohii, マッチ matchi);
// ん before a vowel or y is n' (きんようび kin'youbi, never read as き + にょ). macron: ー as a macron
// on its vowel (コーヒー kōhī), for romaji the learner spells back in kana: ō is typed o-, while
// oo / ou stay おお / おう.
var MACRON = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' };
function kanaToRomaji(word, macron) {
  var ch = kanaChunks(word), out = '';
  ch.forEach(function (a, i) {
    if (macron && a[1] === '-' && MACRON[out.slice(-1)]) { out = out.slice(0, -1) + MACRON[out.slice(-1)]; return; }
    out += a.indexOf("n'") >= 0 && ch[i + 1] && /^[aiueoy]/.test(ch[i + 1][0]) ? "n'" : a[0];
  });
  return out;
}
// romajiMatches(typed, word): typed romaji spells word exactly — any kana's accepted spelling
// (shi / si; m for ん before p/b/m), macrons (kōhī), case and spaces ignored. No typo tolerance: a wrong kana is wrong.
function romajiMatches(typed, word) {
  var esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&'); };
  var ch = kanaChunks(word).map(function (a, i, all) { // ん before p / b / m: traditional Hepburn m too (shimbun)
    return a.indexOf("n'") >= 0 && all[i + 1] && /^[pbm]/.test(all[i + 1][0]) ? a.concat('m') : a;
  });
  var re = new RegExp('^' + ch.map(function (a) { return '(?:' + a.map(esc).join('|') + ')'; }).join('') + '$');
  var s = String(typed == null ? '' : typed).normalize('NFC').toLowerCase().replace(/[\s’]/g, function (c) { return c === '’' ? "'" : ''; });
  var dbl = { 'ā': 'aa', 'ī': 'ii', 'ū': 'uu', 'ē': 'ee', 'ō': 'oo', 'â': 'aa', 'î': 'ii', 'û': 'uu', 'ê': 'ee', 'ô': 'oo' };
  return [s.replace(/[āīūēōâîûêô]/g, function (c) { return dbl[c]; }), s.replace(/[āīūēōâîûêô]/g, function (c) { return c === 'ō' || c === 'ô' ? 'ou' : c === 'ē' || c === 'ê' ? 'ei' : dbl[c]; })]
    .some(function (x) { return re.test(x); });
}
// kanaReadable(s, learned): s uses only learned kana ({ char: true }, combos and marks っ ー too).
function kanaReadable(s, learned) {
  var ch = Array.from(s);
  for (var i = 0; i < ch.length; i++) {
    if (learned[ch[i] + (ch[i + 1] || '')] && ch[i + 1]) { i++; continue; }
    if (!learned[ch[i]]) return false;
  }
  return true;
}
// learnedKana(unit): kana (and marks) taught by this unit or any earlier one.
function learnedKana(unit) {
  var out = {};
  var add = function (u) {
    (u.kana || []).forEach(function (k) { if (k) out[k.char] = true; });
    (u.marks || []).forEach(function (m) { out[m] = true; });
  };
  allUnits().forEach(function (u) { if (u.index <= (unit.index || 0)) add(u); });
  add(unit);
  return out;
}
// kanaWordFakes(word, learned): wrong spellings of a kana word, same script, only learned kana,
// none read like the word (ず / づ): one edit each — dakuten on/off, small ゃ as big や, small っ
// or ー added/dropped, a long vowel added/dropped, a look-alike kana; then any learned kana swap.
function kanaWordFakes(word, learned) {
  var kata = /[ァ-ヺ]/.test(word);
  var ch = Array.from(word), near = [], far = [], r = kanaToRomaji(word);
  var put = function (list, arr) { list.push(arr.join('')); };
  var at = function (i, x) { return ch.slice(0, i).concat(x, ch.slice(i + 1)); };
  ch.forEach(function (c, i) {
    var d = c.normalize('NFD'), t = d.length > 1 ? d.charAt(0) : (c + '゙').normalize('NFC');
    if (t.length === 1 && t !== c && t !== 'ゔ' && t !== 'ヴ') put(near, at(i, t));
    if ('ゃゅょャュョ'.indexOf(c) >= 0) put(near, at(i, String.fromCharCode(c.charCodeAt(0) + 1)));
    if (c === 'っ' || c === 'ッ' || c === 'ー') put(near, at(i, []));
    if (i > 0 && /[かきくけこさしすせそたちつてとぱぴぷぺぽカキクケコサシスセソタチツテトパピプペポ]/.test(c) && kanaVowel(kataToHira(ch[i - 1]))) put(near, ch.slice(0, i).concat(kata ? 'ッ' : 'っ', ch.slice(i)));
    if (kata && i > 0 && c !== 'ー' && ch[i + 1] !== 'ー' && 'ャュョッ'.indexOf(c) < 0) put(near, ch.slice(0, i + 1).concat('ー', ch.slice(i + 1)));
    KANA_LOOKALIKES.filter(function (s) { return s.indexOf(c) >= 0; }).join('').split('').forEach(function (x) { if (x !== c) put(near, at(i, x)); });
    Object.keys(learned).forEach(function (x) { if (x.length === 1 && /[ぁ-ゖァ-ヺ]/.test(x) && /[ァ-ヺ]/.test(x) === kata && 'ゃゅょャュョっッ'.indexOf(x) < 0 && x !== c) put(far, at(i, x)); });
  });
  if (!kata) readingFakes(word).forEach(function (f) { near.push(f); });
  var out = [], seen = {}, all = rndShuffle(near).concat(rndShuffle(far));
  seen[r] = true;
  for (var i = 0; i < all.length && out.length < 6; i++) {
    var f = all[i];
    if (f === word || /^[ぁぃぅぇぉゃゅょっァィゥェォャュョッー]/.test(f) || !kanaReadable(f, learned)) continue;
    var fr = kanaToRomaji(f);
    if (seen[fr]) continue;
    seen[fr] = true;
    out.push(f);
  }
  return out;
}

// ── Kana reading words (ticket 44) ──────────────────────────────────────────
// kanaReadWords(unit, items?): reading-only words for a kana quiz: verified, free (not bound, not a
// particle) vocab of the unit's level, spelled in the stage's script with only the kana learned up
// to this stage (plan order, not the learner's history). Hiragana stages read the hiragana reading
// of any word (魚 → さかな); katakana stages only katakana words (never a transliterated one). Never
// a word the quiz asks as an item, nor a single syllable (that is a single-kana question). One per
// spelling. On a kana stage every word holds a new kana or mark of the stage (hasNewKana). The
// level's words first, then (N5) Tanos N4 / N3 words from KANA_READ_EXTRA. Item shape
// { kind: 'kanaword', id: 'w:<kana>', word, level }: no card, no meaning asked.
function kanaReadWords(unit, items) {
  items = items || quizItems(unit);
  var ks = items.filter(function (it) { return it.kind === 'kana'; });
  if (!ks.length) return [];
  var kata = ks[ks.length - 1].script === 'katakana', learned = learnedKana(unit), seen = {}, out = [];
  items.forEach(function (it) { if (it.kind === 'vocab') seen[it.word] = true; });
  var add = function (s, level) {
    // ponytail: では / それでは read "dewa" (particle は); the only such readings
    if (seen[s] || !(kata ? /^[ァ-ヺー]+$/ : /^[ぁ-ゖ]+$/).test(s) || /では$/.test(s)) return;
    if (kanaSyllables(s).length < 2 || !kanaReadable(s, learned) || !hasNewKana(unit, s)) return;
    seen[s] = true;
    out.push({ kind: 'kanaword', id: 'w:' + s, word: s, level: level });
  };
  catalogOf('vocab').forEach(function (v) {
    if (v.verified && v.level === unit.level && !isBound(v) && v.pos !== 'particle') add(kata ? v.word : v.reading, v.level);
  });
  // beyond the level (Q47-1): Tanos N4 then N3 words, reading checked against JMdict (data/n5/read-words.js)
  if (unit.level === 'N5' && typeof KANA_READ_EXTRA !== 'undefined') {
    ['N4', 'N3'].forEach(function (lv) { (KANA_READ_EXTRA[lv] || []).forEach(function (s) { add(s, lv); }); });
  }
  return out;
}
// hasNewKana(unit, word): on a kana stage, word holds one of the stage's new kana or marks (owner
// rule, Q47: no word made only of earlier kana). A review teaches nothing new: any word passes.
function hasNewKana(unit, word) {
  if (unit.kind !== 'kana') return true;
  var fresh = (unit.kana || []).map(function (k) { return k.char; }).concat(unit.marks || []);
  return kanaSyllables(word).some(function (c) { return fresh.indexOf(c) >= 0; });
}
// kanaSyllables(word): the kana a word is read with: combos whole (きゃ, ティ), っ and ー as marks.
function kanaSyllables(word) {
  var map = kanaAnswers(), ch = Array.from(word), out = [];
  for (var i = 0; i < ch.length; i++) {
    if (ch[i + 1] && map[ch[i] + ch[i + 1]]) { out.push(ch[i] + ch[i + 1]); i++; } else out.push(ch[i]);
  }
  return out;
}
// kanaSpellable(word): the word's romaji names exactly one kana spelling, so it can be typed from
// romaji: no ぢ/づ/を (read like じ/ず/お), no small ァィゥェォ (ティ is typed ti → チ). ー is fine:
// the romaji shows it as a macron (kōhī) and the box types it from - (Q47-2).
function kanaSpellable(word) { return !/[ぢづをヂヅヲァィゥェォ]/.test(word); }
// kanaBox(ex, typed): what a kana answer box shows: romaji → hiragana, or katakana (ex.kata);
// - is ー, as with a Japanese IME (ko-hi- → コーヒー).
function kanaBox(ex, typed) { var s = romajiToKana(typed); return ex.kata ? hiraToKata(s) : s; }

// ── Distractor engine (ticket 09) ───────────────────────────────────────────
// Sense words: a gloss's content words, so "blue" and "blue / green" overlap
// (two right answers) but "to eat" and "to drink" don't.
var SENSE_STOPWORDS = ' a an the to of in on at for by with and or not no is are be it it\'s its i you your one one\'s' +
  ' someone something sb sth do does doing don\'t that this x y n b please marks thing things etc ';
var _senseMemo = {}; // glosses are a finite catalog set; memo keeps pickDistractors fast
function senseWords(s) {
  return _senseMemo[s] || (_senseMemo[s] = s.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(' ').filter(function (w) {
    return w && SENSE_STOPWORDS.indexOf(' ' + w + ' ') < 0;
  }).map(function (w) { return w.length > 3 && !/ss$/.test(w) ? w.replace(/s$/, '') : w; })); // ponytail: plural -s only
}
function sharesSense(a, b) {
  var sa = senseWords(a);
  return senseWords(b).some(function (w) { return sa.indexOf(w) >= 0; });
}
// Vocab pairs that answer the same prompt though their glosses share no sense word ("do" is a
// stopword; a glass vs a cup): never options or typed answers against each other (audit P1-14,
// P2-4). ponytail: hand list; extend when a quiz shows another pair.
var NEAR_SYNONYMS = [['v:する|する', 'v:やる|やる'], ['v:コップ|コップ', 'v:カップ|カップ']];
function nearSynonyms(a, b) {
  return !!a && !!b && a.id !== b.id && NEAR_SYNONYMS.some(function (s) { return s.indexOf(a.id) >= 0 && s.indexOf(b.id) >= 0; });
}

// Kanji learners mix up by shape, and kanji that share a category. Only pairs
// that are both in the pool matter; add sets as levels grow.
var KANJI_LOOKALIKES = ['日目白百田旦', '木本休体末未', '人入八大火', '土士工王上', '大太犬天夫', '午牛年', '右左石',
  '千干十', '力刀', '見貝', '間聞門問', '読語話', '男田町', '雨両', '生先', '東車', '小少', '母毎', '北比', '今会',
  '西四', '円内', '学字', '名各', '外夕', '山出', '子了', '万方', '金全', '校交', '気汽', '電雷'];
var KANJI_GROUPS = ['一二三四五六七八九十百千万', '日月火水木金土', '東西南北上下左右中前後外', '人子女男母父友',
  '年時間今午毎週半先後前', '山川天雨水火木土気', '大小高長白安新古', '行来出入見聞読書話食休買', '国語学校名電車'];
function sameSet(sets, a, b) {
  return a !== b && sets.some(function (s) { return s.indexOf(a) >= 0 && s.indexOf(b) >= 0; });
}
// Grammar points learners confuse (ids). Pairs with the same meaning (から/ので,
// けど/けれども) drop out via sharesSense while the prompt is the meaning.
var GRAMMAR_CONFUSABLES = [['g:wa-desu', 'g:ga', 'g:mo'], ['g:de', 'g:ni', 'g:ni-ikimasu', 'g:wo', 'g:to', 'g:made'],
  ['g:kara', 'g:node', 'g:te-kara', 'g:made'], ['g:te-mo-ii', 'g:te-wa-ikemasen', 'g:nai-de-kudasai', 'g:nakute-wa-ikenai',
  'g:nakute-wa-naranai', 'g:nakucha-ikenai'], ['g:mashou', 'g:masen-ka', 'g:mashou-ka'], ['g:mada', 'g:mou', 'g:mada-te-imasen'],
  ['g:kedo', 'g:keredomo', 'g:ga'], ['g:ya', 'g:to', 'g:ka-ka'], ['g:hou-ga-ii', 'g:hou-ga-yori'], ['g:tai', 'g:tsumori'],
  ['g:no-ga-suki', 'g:no-ga-jouzu', 'g:no-ga-heta'], ['g:ne', 'g:yo', 'g:ka'], ['g:te-iru', 'g:te-kudasai', 'g:te-kara']];

function hiraToKata(s) { return s.replace(/[ぁ-ゖ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); }); }
// kanjiValidReadings: every reading of k in hiragana, incl. extra (okurigana glued) and the bare
// stems of kun / extra readings (た of た.べる), deduped.
function kanjiValidReadings(k) {
  var kunLike = (k.kun || []).concat(k.extra || []);
  return kanjiReadings(k).concat(kunLike.map(function (r) { return r.replace('.', ''); }), kunLike.map(function (r) { return r.split('.')[0]; }))
    .map(kataToHira).filter(function (r, i, a) { return a.indexOf(r) === i; });
}
function scriptShape(s) { return hasKanji(s) ? 'kanji' : /[ァ-ヶ]/.test(s) ? 'kata' : 'hira'; }
function editDistance(a, b) {
  var prev = [], i, j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (i = 1; i <= a.length; i++) {
    var cur = [i];
    for (j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

// readingFakes: sound-confuser misreadings of a hiragana reading, one safe edit
// each — lengthen/shorten a vowel (おばさん/おばあさん), toggle dakuten (か/が),
// add/remove small っ (きて/きって). Only for "how do you read it" questions.
var KANA_VOWEL = { a: 'あかさたなはまやらわがざだばぱゃ', i: 'いきしちにひみりぎじぢびぴ', u: 'うくすつぬふむゆるぐずづぶぷゅ',
  e: 'えけせてねへめれげぜでべぺ', o: 'おこそとのほもよろをごぞどぼぽょ' };
var LONG_VOWEL = { a: 'あ', i: 'い', u: 'う', e: 'い', o: 'う' };
function kanaVowel(c) {
  for (var v in KANA_VOWEL) if (c && KANA_VOWEL[v].indexOf(c) >= 0) return v;
  return null;
}
function readingFakes(s) {
  var out = [], ch = Array.from(s);
  var put = function (arr) { var t = arr.join(''); if (t !== s && out.indexOf(t) < 0) out.push(t); };
  ch.forEach(function (c, i) {
    var v = kanaVowel(c), next = ch[i + 1], prev = ch[i - 1];
    if (v && 'ゃゅょ'.indexOf(next) < 0 && next !== LONG_VOWEL[v]) put(ch.slice(0, i + 1).concat(LONG_VOWEL[v], ch.slice(i + 1)));
    var pv = kanaVowel(prev);
    if (i > 0 && pv && (c === LONG_VOWEL[pv] || c === 'あいうえお'[['a', 'i', 'u', 'e', 'o'].indexOf(pv)])) put(ch.slice(0, i).concat(ch.slice(i + 1)));
    var d = c.normalize('NFD');
    var t = d.length > 1 ? d.charAt(0) : (c + '゙').normalize('NFC');
    if (t.length === 1 && t !== c && t !== 'ゔ' && d.charAt(1) !== '゚') put(ch.slice(0, i).concat(t, ch.slice(i + 1)));
    if (c === 'っ') put(ch.slice(0, i).concat(ch.slice(i + 1)));
    if (i > 0 && 'かきくけこさしすせそたちつてとぱぴぷぺぽ'.indexOf(c) >= 0 && kanaVowel(prev)) put(ch.slice(0, i).concat('っ', ch.slice(i)));
  });
  return out;
}
// squareFakes(s, ok): three misreadings [m1, m2, m12]: two one-edit fakes at different places and
// both edits together, all passing ok, or null. Every option is then 4 edits from the other three,
// so the answer is no longer the "centre" of one-edit fakes (audit P1-13: it won 77-87%).
function squareFakes(s, ok) {
  var f1 = rndShuffle(readingFakes(s).filter(ok));
  for (var i = 0; i < f1.length; i++) {
    var near1 = readingFakes(f1[i]);
    for (var j = i + 1; j < f1.length; j++) {
      if (editDistance(f1[i], f1[j]) !== 2) continue;
      var both = readingFakes(f1[j]).filter(function (x) { return x !== s && near1.indexOf(x) >= 0 && editDistance(x, s) === 2 && ok(x); });
      if (both.length) return [f1[i], f1[j], rndShuffle(both)[0]];
    }
  }
  return null;
}

// Per field: texts(item, answer) = the option text(s) an item offers; reject(cand,
// target, answer, prep(target)) = would be a second right answer; score(cand, target, answer)
// = tuple after [level distance], lower first. cand = { it, text, taught }.
var lenBucket = function (a, b, step) { return Math.min(3, Math.floor(Math.abs(a.length - b.length) / step)); };
var posFamily = function (p) { return (p || '').split('-')[0]; };
var DISTRACTOR_RULES = {
  gloss: { // vocab meaning
    texts: function (it) { return [glossText(it)]; },
    // same word/reading = homograph or homophone: right answer too (and in listening)
    reject: function (c, t, ans) { return c.it.word === t.word || c.it.reading === t.reading || sharesSense(c.text, ans) || nearSynonyms(c.it, t); },
    score: function (c, t, ans) {
      var tags = t.tags || [];
      return [posFamily(c.it.pos) !== posFamily(t.pos), !c.taught, c.it.pos !== t.pos,
        !(c.it.tags || []).some(function (x) { return tags.indexOf(x) >= 0; }), lenBucket(c.text, ans, 6)];
    }
  },
  word: { // meaning → word
    texts: function (it) { return [it.word]; },
    reject: function (c, t) { return sharesSense(glossText(c.it), glossText(t)) || nearSynonyms(c.it, t); },
    score: function (c, t, ans) {
      return [scriptShape(c.text) !== scriptShape(ans), !c.taught, posFamily(c.it.pos) !== posFamily(t.pos),
        lenBucket(c.text, ans, 1), Math.min(3, editDistance(kataToHira(c.it.reading), kataToHira(t.reading)))];
    }
  },
  reading: { // word → reading; synthesized fakes allowed here only
    texts: function (it) { return [it.reading]; },
    fakes: true,
    prep: function (t) { // every reading of the same spelling (一日: いちにち, ついたち; alsoRead: 明日 あす)
      return [].concat.apply([], catalogOf('vocab').filter(function (v) { return v.word === t.word; }).map(function (v) { return [v.reading].concat(v.alsoRead || []); }));
    },
    reject: function (c, t, ans, valid) { return valid.indexOf(c.text) >= 0; },
    score: function (c, t, ans) {
      return [scriptShape(c.text) !== scriptShape(ans), Math.min(3, editDistance(c.text, ans)), !c.taught, lenBucket(c.text, ans, 1)];
    }
  },
  kanjiReading: { // kanji → one reading, all options in the answer's script (on/kun swap)
    texts: function (it, ans) {
      var conv = /[ァ-ヶ]/.test(ans) ? hiraToKata : kataToHira;
      return kanjiReadings(it).map(conv);
    },
    reject: function (c, t) { return kanjiValidReadings(t).indexOf(kataToHira(c.text)) >= 0; },
    score: function (c, t, ans) {
      return [sameSet(KANJI_LOOKALIKES, c.it.char, t.char) ? 0 : sameSet(KANJI_GROUPS, c.it.char, t.char) ? 1 : 2,
        !c.taught, lenBucket(c.text, ans, 1)];
    }
  },
  kanjiMeaning: {
    texts: function (it) { return [it.meaning.join(', ')]; },
    reject: function (c, t, ans) { return sharesSense(c.text, ans); },
    score: function (c, t, ans) {
      return [!sameSet(KANJI_GROUPS, c.it.char, t.char), !c.taught, !sameSet(KANJI_LOOKALIKES, c.it.char, t.char), lenBucket(c.text, ans, 6)];
    }
  },
  pattern: { // grammar meaning → pattern
    texts: function (it) { return [it.pattern]; },
    reject: function (c, t) { return sharesSense(c.it.meaning, t.meaning); },
    score: function (c, t) {
      return [!GRAMMAR_CONFUSABLES.some(function (s) { return s.indexOf(c.it.id) >= 0 && s.indexOf(t.id) >= 0; }), !c.taught];
    }
  }
};

// pickDistractors(target, pool, field, n, opts) → up to n distinct wrong option
// strings, best first. pool = items of target's kind; field = DISTRACTOR_RULES key.
// opts: taught ({ id: true }, preferred: learners know them), answer (correct
// text, default the field's text of target), level (when target has none).
// Ranking: level distance (same, then ±1, further only if nothing else), then the
// field's score; random within a tie. No cap or recency penalty on how often a word is a wrong
// option (owner, ticket 43): a good trap stays available.
var DISTRACTOR_MIN_POOL = 15;
function cmpTuple(a, b) {
  for (var i = 0; i < a.length; i++) if (+a[i] !== +b[i]) return +a[i] - +b[i];
  return 0;
}
function pickDistractors(target, pool, field, n, opts) {
  opts = opts || {};
  var rule = DISTRACTOR_RULES[field], taught = opts.taught || {};
  var ans = opts.answer || rule.texts(target, '')[0];
  var lv = levelRank(target.level || opts.level);
  var ctx = rule.prep ? rule.prep(target) : null, cands = [];
  if (rule.fakes && n === 3) { // misreadings in a square first (squareFakes), else ranked as below
    var sq = squareFakes(kataToHira(ans), function (t) { return t !== ans && !rule.reject({ it: target, text: t, taught: true }, target, ans, ctx); });
    if (sq) return sq;
  }
  pool.forEach(function (it) {
    if (it.id === target.id || it.kind !== target.kind || isBound(it)) return; // a bare suffix is no option (ticket 40)
    rule.texts(it, ans).forEach(function (text) { cands.push({ it: it, text: text, taught: !!taught[it.id] }); });
  });
  if (rule.fakes) readingFakes(kataToHira(ans)).forEach(function (text) { cands.push({ it: target, text: text, taught: true }); });
  var ok = rndShuffle(cands).filter(function (c) {
    return c.text && c.text !== ans && !rule.reject(c, target, ans, ctx);
  });
  // Few taught candidates (early units): random untaught same-level items that fit as well on the
  // field's first rule (same pos family / script / look-alike set) join the taught tier up to
  // DISTRACTOR_MIN_POOL, so the same few words aren't the only wrong options (ticket 43).
  var taughtN = {}, extra = [];
  ok.forEach(function (c) { if (c.taught && c.it !== target && !+rule.score(c, target, ans)[0]) taughtN[c.it.id] = true; }); // of the right kind
  var room = DISTRACTOR_MIN_POOL - Object.keys(taughtN).length;
  if (room > 0) {
    ok.filter(function (c) { return !c.taught && levelRank(c.it.level || opts.level) === lv; }).map(function (c) {
      return { c: c, s: [rule.score(c, target, ans)[0]] }; // ok is shuffled and sort is stable: random within a tie
    }).sort(function (a, b) { return cmpTuple(a.s, b.s); }).forEach(function (x) {
      if (extra.length < room && extra.indexOf(x.c.it) < 0) extra.push(x.c.it);
    });
    ok = ok.map(function (c) { return extra.indexOf(c.it) >= 0 ? Object.assign({}, c, { taught: true }) : c; });
  }
  var scored = ok.map(function (c) {
    var l = levelRank(c.it.level || opts.level);
    return { text: c.text, s: [lv < 0 || l < 0 ? 0 : Math.abs(l - lv)].concat(rule.score(c, target, ans)) };
  });
  scored.sort(function (a, b) { return cmpTuple(a.s, b.s); });
  var out = [];
  scored.forEach(function (x) { if (out.length < n && out.indexOf(x.text) < 0) out.push(x.text); });
  return out;
}

// allUnits: the plan's resolved units, built once (PLAN/CATALOG don't change after load).
var _allUnits = null;
function allUnits() {
  if (typeof PLAN === 'undefined') return [];
  return _allUnits || (_allUnits = buildUnits(PLAN, CATALOG));
}

// taughtIds(unit): ids of items taught in this unit or any earlier one (by index).
function taughtIds(unit) {
  var ids = {};
  var add = function (u) {
    Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) { (u[f] || []).forEach(function (it) { if (it) ids[it.id] = true; }); });
  };
  allUnits().forEach(function (u) { if (u.index <= (unit.index || 0)) add(u); });
  add(unit);
  return ids;
}

// learnedKanji(units, completed): { char: true } for the kanji taught by completed units
// (a stage skipped through placement is completed, so it counts).
function learnedKanji(units, completed) {
  var out = {};
  unitItems(units.filter(function (u) { return completed.has(u.id); })).forEach(function (it) {
    if (it.kind === 'kanji') out[it.char || it.id.slice(2)] = true;
  });
  return out;
}

// uiJaShown(ja, level, learned): may this Japanese UI string show? N5: never. N4+: only when
// every kanji in it is learned (no kanji = always). Kanji outside the catalog are never learned.
function uiJaShown(ja, level, learned) {
  if (levelRank(level) < 1) return false;
  return Array.from(ja).every(function (ch) { return !hasKanji(ch) || learned[ch]; });
}

// unitItems(units): the taught items (kana, vocab, kanji, grammar) of some units, deduped.
function unitItems(units) {
  var seen = {}, out = [];
  units.forEach(function (u) {
    Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
      (u[f] || []).forEach(function (it) { if (it && !seen[it.id]) { seen[it.id] = true; out.push(it); } });
    });
  });
  return out;
}
// quizItems(unit): what a quiz asks about. A review mixes every
// kana/lesson unit since the previous review (Q29), else its own items.
function quizItems(unit) {
  // A review quizzes every kana/lesson unit since the previous review (so the
  // hiragana review covers all hiragana units, not just the last 6).
  if (unit.kind === 'review') {
    var before = allUnits().filter(function (u) { return u.index < unit.index; });
    var lastRev = before.filter(function (u) { return u.kind === 'review'; }).pop();
    var prev = before.filter(function (u) {
      return (!lastRev || u.index > lastRev.index) && (u.kind === 'lesson' || u.kind === 'kana');
    });
    if (prev.length) return unitItems(prev);
  }
  return unitItems([unit]);
}

// ── Quiz furigana (Q33) ─────────────────────────────────────────────────────
// quizFurigana(parts, taughtKanji, tested): furigana parts ({ t, r? }) with ruby
// kept only on blocks holding an untaught kanji, and never on a block holding a
// kanji in `tested` (the string the question tests).
function quizFurigana(parts, taughtKanji, tested) {
  return parts.map(function (p) {
    if (!p.r) return p;
    var ks = Array.from(p.t).filter(hasKanji);
    var keep = ks.some(function (c) { return !taughtKanji[c]; }) && !ks.some(function (c) { return (tested || '').indexOf(c) >= 0; });
    return keep ? p : { t: p.t };
  });
}

// ── Sentence gap (Q30) ──────────────────────────────────────────────────────
var GAP_BLANK = '（　）';
// gapSurfaces(g): the pattern's written forms ('〜に/へ (行く・来る・帰る)' → に, へ);
// patterns with placeholders ('X は Y です', 'V-る', 'まだ〜ていません') have none.
function gapSurfaces(g) {
  return g.pattern.split('/').map(function (s) {
    return s.replace(/\([^)]*\)/g, '').trim().replace(/^[〜～]|[〜～]$/g, '');
  }).filter(function (s) { return s && !/[\sA-Za-z〜～]/.test(s); });
}
// gapParts(parts, surface): furigana parts with the first occurrence of surface
// blanked, or null when it isn't there. A one-kana surface skips です/でし/ます-
// style hits (で of です). ponytail: first fitting hit only.
function gapParts(parts, surface) {
  var text = parts.map(function (p) { return p.t; }).join(''), at = -1, from = 0;
  while ((at = text.indexOf(surface, from)) >= 0 && surface.length === 1 && 'すし'.indexOf(text.charAt(at + 1)) >= 0) from = at + 1;
  return at < 0 ? null : spliceParts(parts, at, at + surface.length, [{ t: GAP_BLANK }]);
}
// sliceParts(parts, a, b): the furigana parts covering text offsets [a, b); a ruby
// block only partly inside loses its ruby.
function sliceParts(parts, a, b) {
  var pos = 0, out = [];
  parts.forEach(function (p) {
    var s = pos, e = pos + p.t.length;
    pos = e;
    if (e <= a || s >= b) return;
    out.push(p.r && s >= a && e <= b ? p : { t: p.t.slice(Math.max(0, a - s), b - s) });
  });
  return out;
}
function cutsRuby(parts, x) {
  var pos = 0;
  return parts.some(function (p) { var s = pos; pos += p.t.length; return !!p.r && s < x && x < pos; });
}
// spliceParts(parts, at, end, insert): [at, end) replaced by the parts in insert;
// null when an edge falls inside a furigana block.
function spliceParts(parts, at, end, insert) {
  if (cutsRuby(parts, at) || cutsRuby(parts, end)) return null;
  return sliceParts(parts, 0, at).concat(insert, sliceParts(parts, end, Infinity));
}
// Confusables that fit the same slot (same meaning, or a meaning only the English note
// tells apart): no two of one set in an option set (two right answers). Ichidan / する
// stems take both て and ない patterns (見てもいい, 見なくちゃ), so the permission and
// obligation patterns are one set. ponytail: hand list from reviewing every generated N5
// gap (audit P0-4); extend it when a new level's confusables land.
var GAP_INTERCHANGEABLE = [['g:kedo', 'g:keredomo', 'g:ga'], ['g:kara', 'g:node'], ['g:ni', 'g:ni-ikimasu', 'g:made'], ['g:to', 'g:ya'],
  ['g:ne', 'g:yo'], ['g:mashou', 'g:masen-ka', 'g:mashou-ka'], ['g:te-mo-ii', 'g:te-wa-ikemasen', 'g:nai-de-kudasai',
  'g:nakute-wa-ikenai', 'g:nakute-wa-naranai', 'g:nakucha-ikenai'], ['g:no-ga-suki', 'g:no-ga-jouzu', 'g:no-ga-heta'],
  ['g:mou', 'g:mada', 'g:mada-te-imasen'], ['g:de', 'g:wo']];
// One way only: から as "from" fits where まで does (７時から / ７時まで), まで never fits for から "because".
var GAP_ANSWER_BLOCKS = { 'g:made': ['g:kara'] };
// gapClash(a, b): grammar ids a and b share a GAP_INTERCHANGEABLE set.
function gapClash(a, b) {
  return a === b || GAP_INTERCHANGEABLE.some(function (set) { return set.indexOf(a) >= 0 && set.indexOf(b) >= 0; });
}

// ── Exam-format questions: N5 mondai (ticket 11) ───────────────────────────
// Question types modelled on the official sections. Unit quizzes reach the item-based
// ones through formsFor (form name = MONDAI key); mocks assemble sections with
// mondaiQuestions(type, item, ctx).
var MONDAI = {
  kanjiYomi: { section: 'moji-goi', no: 1, name: '漢字読み' },  // underlined kanji word → reading
  hyouki: { section: 'moji-goi', no: 2, name: '表記' },         // underlined hiragana word → kanji
  bunmyaku: { section: 'moji-goi', no: 3, name: '文脈規定' },   // word that fits the blank
  iikae: { section: 'moji-goi', no: 4, name: '言い換え類義' },  // closest sentence (authored, data/n5/mondai.js)
  gap: { section: 'bunpou', no: 1, name: '文の文法1' },         // grammar that fits the blank
  order: { section: 'bunpou', no: 2, name: '文の文法2' },       // ★ sentence composition (authored chunks)
  bunshou: { section: 'bunpou', no: 3, name: '文章の文法' }     // text with blanks (authored)
};
var STAR_SLOTS = ['＿＿', '＿＿', '＿＿', '＿＿'];

// sentencesUsing(id): catalog sentences whose `uses` lists the item.
function sentencesUsing(id) {
  return catalogOf('sentence').filter(function (s) { return (s.uses || []).indexOf(id) >= 0; });
}
// Teaching order (audit P1-1, docs/adr/0002): a sentence shown or asked in a unit should only use
// items taught by then. untaughtCount(s, known): how many of s.uses known (taughtIds) lacks; another
// spelling (alt: 有る for ある) counts as taught with the spelling the plan teaches.
function untaughtCount(s, known) {
  return (s.uses || []).filter(function (u) { var it = CATALOG.items[u]; return !known[u] && !(it && it.alt && known[it.alt]); }).length;
}
// byUntaught(sents, known): fewest untaught uses first, authored order kept within a tie.
function byUntaught(sents, known) {
  return sents.map(function (s, i) { return { s: s, n: untaughtCount(s, known), i: i }; })
    .sort(function (a, b) { return a.n - b.n || a.i - b.i; }).map(function (x) { return x.s; });
}
// quizSentences(sents, ctx): the sentences a quiz question may use, random order: only those using
// nothing taught later; with ctx.leakOk (makeQuestion's last resort) all, fewest untaught first.
function quizSentences(sents, ctx) {
  sents = rndShuffle(sents);
  return ctx.leakOk ? byUntaught(sents, ctx.taught) : sents.filter(function (s) { return !untaughtCount(s, ctx.taught); });
}
// lessonExamples(g, unit): the grammar point's examples shown in a lesson, at most 3, cleanest first.
function lessonExamples(g, unit) {
  var ex = (g.examples || []).map(function (id) { return CATALOG.items[id]; }).filter(Boolean);
  return byUntaught(ex, taughtIds(unit)).slice(0, 3);
}
// wordSpan(raw, word, reading): { at, end } of word in furigana parts when it occurs
// exactly once, no furigana block is cut, and the furigana there reads `reading`
// (so カナダ人 is not 人|ひと). Else null.
function wordSpan(raw, word, reading) {
  var text = raw.map(function (p) { return p.t; }).join(''), at = text.indexOf(word);
  if (at < 0 || text.indexOf(word, at + 1) >= 0) return null;
  var end = at + word.length, pos = 0, rd = '', ok = true;
  raw.forEach(function (p) {
    var s = pos, e = pos + p.t.length;
    pos = e;
    if (e <= at || s >= end) return;
    if (p.r && (s < at || e > end)) ok = false;
    rd += p.r || p.t.slice(Math.max(0, at - s), end - s);
  });
  return ok && kataToHira(rd) === kataToHira(reading) ? { at: at, end: end } : null;
}
// allKanjiTaught(word, taughtKanji): every kanji in word has been taught.
function allKanjiTaught(w, taughtKanji) {
  return Array.from(w).every(function (ch) { return !hasKanji(ch) || taughtKanji[ch]; });
}
// spellingFakes(v): wrong kanji spellings of a vocab word for 表記 — one kanji swapped
// for a real kanji with a shared on-reading (校 → 高 交) or a look-alike (KANJI_LOOKALIKES),
// then, only if that gives fewer than 3, one of the same set (KANJI_GROUPS: 山 → 川).
// Shuffled within each tier. Never a spelling any catalog word with the same reading uses.
function spellingFakes(v) {
  var real = catalogOf('vocab').filter(function (x) { return kataToHira(x.reading) === kataToHira(v.reading); }).map(function (x) { return x.word; });
  var on = function (k) { return k ? (k.on || []).concat((k.extra || []).filter(function (r) { return /^[ァ-ヶ]/.test(r); })) : []; };
  var setsWith = function (sets, ch) { return sets.filter(function (s) { return s.indexOf(ch) >= 0; }).join('').split(''); };
  var chars = Array.from(v.word), tiers = [[], []];
  chars.forEach(function (ch, i) {
    if (!hasKanji(ch)) return;
    var mine = on(CATALOG.items['k:' + ch]);
    var sound = catalogOf('kanji').filter(function (k) { return on(k).some(function (r) { return mine.indexOf(r) >= 0; }); })
      .map(function (k) { return k.char; });
    [sound.concat(setsWith(KANJI_LOOKALIKES, ch)), setsWith(KANJI_GROUPS, ch)].forEach(function (cs, t) {
      cs.forEach(function (c) {
        var w = chars.slice(0, i).concat(c, chars.slice(i + 1)).join('');
        if (chars.indexOf(c) < 0 && real.indexOf(w) < 0) tiers[t].push(w);
      });
    });
  });
  var out = [];
  rndShuffle(tiers[0]).concat(rndShuffle(tiers[1])).forEach(function (w) { if (out.indexOf(w) < 0) out.push(w); });
  return out;
}
// orderQuestion(s, taughtKanji, star?, order?): ★ sentence composition from s.chunks. The ★ goes
// in one of the slots the author marked as fixed by grammar (default all four). star / order
// (chunk indexes as shown) fix the question for a mock; random when left out.
function orderQuestion(s, taughtKanji, fixedStar, fixedOrder) {
  var c = s.chunks, raw = quizFurigana(furiganaParts(s.furigana || s.jp), taughtKanji, '');
  var star = fixedStar !== undefined ? fixedStar : rndShuffle(c.star || [0, 1, 2, 3])[0], at = c.pre.length;
  var chunkParts = c.move.map(function (m) { var p = sliceParts(raw, at, at + m.length); at += m.length; return p; });
  var slots = STAR_SLOTS.map(function (x, i) { return i === star ? '＿★＿' : x; }).join(' ');
  var order = fixedOrder || rndShuffle([0, 1, 2, 3]);
  return { type: 'order', prompt: 'Which goes in the ★ slot?', question: c.pre + ' ' + slots + ' ' + c.post,
    parts: sliceParts(raw, 0, c.pre.length).concat({ t: ' ' + slots + ' ' }, sliceParts(raw, at, Infinity)),
    options: order.map(function (i) { return c.move[i]; }), optionParts: order.map(function (i) { return chunkParts[i]; }),
    correct: order.indexOf(star), star: star, sentence: s.id };
}
// mcFromAuthored(options, answer, order?): options shuffled (or in `order`, indexes into
// options: a mock's fixed order) + the answer's new index.
function mcFromAuthored(options, answer, order) {
  var opts = order ? order.map(function (i) { return options[i]; }) : rndShuffle(options);
  return { options: opts, correct: opts.indexOf(options[answer]) };
}
function iikaeQuestion(m, taughtKanji, order) {
  var raw = quizFurigana(furiganaParts(m.furigana || m.jp), taughtKanji, ''), at = m.jp.indexOf(m.underline);
  var parts = spliceParts(raw, at, at + m.underline.length, [{ t: m.underline, u: true }]);
  return Object.assign({ type: 'iikae', prompt: 'Which sentence means about the same? (look at the underlined part)', question: m.jp, parts: parts },
    mcFromAuthored(m.options, m.answer, order));
}
// bunshouQuestion(m, n, taughtKanji, order?): blank n (1-based) of a text with blanks; the
// passage shows every blank as （ k ）, the asked one underlined.
function bunshouQuestion(m, n, taughtKanji, order) {
  var passage = [];
  quizFurigana(furiganaParts(m.text), taughtKanji, '').forEach(function (p) {
    if (p.r) return passage.push(p);
    p.t.split(/(［\d+］)/).forEach(function (x) {
      var k = /^［(\d+)］$/.exec(x);
      if (k) passage.push({ t: '（ ' + k[1] + ' ）', u: +k[1] === n });
      else if (x) passage.push({ t: x });
    });
  });
  var b = m.blanks[n - 1];
  return Object.assign({ type: 'bunshou', prompt: 'Which fits blank (' + n + ')?', question: '（ ' + n + ' ）', passageParts: passage, blank: n },
    mcFromAuthored(b.options, b.answer, order));
}
// mondaiQuestions(type, item, ctx) → [question] (bunshou: one per blank; [] when the
// item can't make that type). type = a MONDAI key; ctx = quizContext(unit).
function mondaiQuestions(type, item, ctx) {
  var tag = function (ex) { return ex && Object.assign(ex, { itemId: item.id, item: item, form: type, recall: false }); };
  if (type === 'bunshou') return item.blanks.map(function (_, i) { return tag(bunshouQuestion(item, i + 1, ctx.taughtKanji)); });
  var fm = formsFor(item, ctx).filter(function (x) { return x.name === type; })[0];
  var ex = fm && fm.make();
  return ex && !answerLeaks(tag(ex)) ? [ex] : [];
}

// ── Quiz composition (Q29-Q31) ──────────────────────────────────────────────
var RECALL_SHARE = 0.4; // Q30: at least this share typed (recall), the rest MC
var IME_HINT = 'Type in romaji (it turns into kana) or use a Japanese keyboard (IME).';
var KANA_INPUT = { hint: IME_HINT, kana: true }; // kana: the answer box converts romaji as you type

// romajiToKana(s): romaji → hiragana, for the kana answer boxes. Already-converted kana and
// anything unknown pass through; an unfinished tail ('k', 'sh', 'n') stays latin until the
// next key, so the whole box value can be re-converted on every keystroke.
var ROMAJI = (function () {
  var m = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お', ya: 'や', yu: 'ゆ', yo: 'よ', wa: 'わ', wo: 'を', '-': 'ー',
    shi: 'し', chi: 'ち', tsu: 'つ', fu: 'ふ', ji: 'じ', si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ',
    sha: 'しゃ', shu: 'しゅ', sho: 'しょ', cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ' };
  var rows = { k: 'かきくけこ', s: 'さしすせそ', t: 'たちつてと', n: 'なにぬねの', h: 'はひふへほ', m: 'まみむめも',
    r: 'らりるれろ', g: 'がぎぐげご', z: 'ざじずぜぞ', d: 'だぢづでど', b: 'ばびぶべぼ', p: 'ぱぴぷぺぽ' };
  Object.keys(rows).forEach(function (c) {
    'aiueo'.split('').forEach(function (v, i) { if (!m[c + v]) m[c + v] = rows[c][i]; });
    'auo'.split('').forEach(function (v, i) { m[c + 'y' + v] = rows[c][1] + 'ゃゅょ'[i]; });
  });
  return m;
})();
function romajiToKana(s) {
  var out = '', i = 0, lower = s.toLowerCase();
  while (i < s.length) {
    var c = lower[i], next = lower[i + 1];
    if (c === 'n' && next === 'n') { // 'nn' = ん, but 'nna' = んな
      var after = lower[i + 2];
      out += 'ん'; i += after && 'aiueoy'.indexOf(after) >= 0 ? 1 : 2; continue;
    }
    if (c === 'n' && (next === "'" || (next && !/[aiueoy]/.test(next) && /[a-z]/.test(next)))) { out += 'ん'; i += next === "'" ? 2 : 1; continue; }
    if (c === next && /[bcdfghjklmpqrstvwxyz]/.test(c)) { out += 'っ'; i++; continue; }
    var len = 3, hit = null;
    for (; len > 0 && !hit; len--) hit = ROMAJI[lower.substr(i, len)];
    if (hit) { out += hit; i += len + 1; } else { out += s[i]; i++; }
  }
  return out;
}
// meaningAnswers: glosses as accepted answers, plus each without a leading "to "
// or a parenthetical ("to see (a person)" → "see").
function meaningAnswers(glosses) {
  var out = [];
  glosses.forEach(function (g) {
    [g, g.replace(/\([^)]*\)/g, '').trim(), g.replace(/^to /, '').replace(/\([^)]*\)/g, '').trim()].forEach(function (a) {
      if (a && out.indexOf(a) < 0) out.push(a);
    });
  });
  return out;
}
function isVerbItem(v) {
  return v.pos ? /^verb/.test(v.pos) : /^to /i.test(glossText(v)) && !/passive|potential|causative/i.test(glossText(v));
}

// quizContext(unit): what every question builder needs, computed once per quiz.
function quizContext(unit) {
  var items = quizItems(unit);
  var taught = taughtIds(unit);
  var taughtKanji = {};
  Object.keys(taught).forEach(function (id) { if (id.indexOf('k:') === 0) taughtKanji[id.slice(2)] = true; });
  var own = function (kind) { return items.filter(function (it) { return it.kind === kind; }); };
  var poolOf = function (kind) { // the quiz's own items (may be outside the catalog) + the catalog's
    var o = own(kind);
    return o.concat(catalogOf(kind).filter(function (x) { return o.indexOf(x) < 0; }));
  };
  var conjPoint = (unit.grammar || []).filter(function (g) { return g && g.conjForm; })[0];
  var rank = levelRank(unit.level);
  var taughtVocab = Object.keys(taught).map(function (id) { return CATALOG.items[id]; }).filter(function (v) { return v && v.kind === 'vocab'; });
  // kana quizzes (ticket 42): words are asked as kana; options only use kana learned so far
  var kanaMode = own('kana').length > 0, learned = kanaMode ? learnedKana(unit) : {};
  return {
    kanaMode: kanaMode, learned: learned, recent: recentAsked(),
    readWords: kanaMode ? kanaReadWords(unit, items) : [],
    kanaPool: kanaMode ? poolOf('vocab').filter(function (v) { return !v.alt && KANA_WORD_RE.test(v.word) && kanaReadable(v.word, learned); }) : [],
    unit: unit, items: items, rank: rank, taught: taught, taughtKanji: taughtKanji,
    vocab: own('vocab'), vPool: poolOf('vocab'), kPool: poolOf('kanji'), gPool: poolOf('grammar'),
    // verbs to conjugate: the quiz's own first, then any taught one
    verbs: own('vocab').filter(isVerbItem).concat(taughtVocab.filter(isVerbItem)),
    // N3+ cycles through the forms by unit; below that only a unit teaching a form point asks one
    conjForm: conjPoint ? conjPoint.conjForm : rank >= 2 ? CONJ_FORMS[(unit.index || 0) % CONJ_FORMS.length] : null
  };
}

// ── Bound morphemes (ticket 40) ─────────────────────────────────────────────
// Suffixes, prefixes and counters (人|じん, さん, 枚, お…) mean nothing on their own, so a quiz
// only asks them inside one of their authored contexts (vocab `contexts`: host + morpheme, 日本人):
// the morpheme that fills the blank, and the reading of the whole (sound changes: 三階 さんがい).
var BOUND_POS = { suffix: true, prefix: true, counter: true };
function isBound(it) { return !!it && it.kind === 'vocab' && !!BOUND_POS[it.pos]; }
// Same meaning in the same slot: never distractors for each other (三回 = 三度, "three times").
var BOUND_SYNONYMS = [['v:回|かい', 'v:度|ど']];
var NUMERAL_HOST = /^[〇一二三四五六七八九十百千万]+$/;
// boundContext(v, c): context { f (furigana), en, alt? } → { parts, at, end (the morpheme), word,
// reading, host, answers (reading + alt), en }; null when the morpheme isn't its own block at the
// end (the start, for a prefix).
function boundContext(v, c) {
  var parts = furiganaParts(c.f), text = parts.map(function (p) { return p.t; }).join('');
  var pre = v.pos === 'prefix', at = pre ? 0 : text.length - v.word.length, end = at + v.word.length;
  if (text.slice(at, end) !== v.word || cutsRuby(parts, pre ? end : at)) return null;
  var reading = kataToHira(parts.map(function (p) { return p.r || p.t; }).join(''));
  return { parts: parts, at: at, end: end, word: text, reading: reading, host: pre ? text.slice(end) : text.slice(0, at),
    answers: [reading].concat(c.alt || []), en: c.en };
}
function boundContexts(v) {
  return (v.contexts || []).map(function (c) { return boundContext(v, c); }).filter(Boolean);
}
// boundLabel(x): a morpheme as an option, with its reading: 人 (じん), さん.
function boundLabel(x) { return hasKanji(x.word) ? x.word + ' (' + x.reading + ')' : x.word; }
// boundGapOptions(v, bc): up to n wrong morphemes for v's blank in context bc, best first: the
// same spelling (人 じん / にん), then one used after the same kind of host (numeral or not), then
// any (a prefix has no prefix to compete with). Never a synonym, nor one whose meaning shares a
// word with the context's English: only the English tells 三人 "three people" from 三枚 "three sheets".
function boundGapOptions(v, bc, n) {
  var syn = [].concat.apply([], BOUND_SYNONYMS.filter(function (s) { return s.indexOf(v.id) >= 0; }));
  var numeric = NUMERAL_HOST.test(bc.host);
  var tier = function (x) {
    if (x.word === v.word) return 0;
    if ((x.pos === 'prefix') !== (v.pos === 'prefix')) return 3;
    return NUMERAL_HOST.test(boundContexts(x)[0].host) === numeric ? 1 : 2;
  };
  var cands = rndShuffle(catalogOf('vocab').filter(function (x) {
    return isBound(x) && x.id !== v.id && !x.alt && boundContexts(x).length && syn.indexOf(x.id) < 0 &&
      boundLabel(x) !== boundLabel(v) && !sharesSense(glossText(x), bc.en);
  })).map(function (x) { return { x: x, t: tier(x) }; }).sort(function (a, b) { return a.t - b.t; });
  return cands.slice(0, n || 3).map(function (c) { return c.x; });
}
// boundForms(v, ctx, f, typing): formsFor's forms for a bound item.
function boundForms(v, ctx, f, typing) {
  var bcs = boundContexts(v);
  var pick = function () { return rndShuffle(bcs)[0]; };
  // the compound with ruby on untaught host kanji; never on the morpheme (its reading is asked)
  var shown = function (bc) { return quizFurigana(bc.parts, ctx.taughtKanji, v.word); };
  var optParts = function (x) { return [hasKanji(x.word) ? { t: x.word, r: x.reading } : { t: x.word }]; };
  return [
    f('ctxGap', false, function () {
      var bc = pick(), d = bc ? boundGapOptions(v, bc) : [];
      if (d.length < 2) return null;
      var parts = spliceParts(quizFurigana(bc.parts, ctx.taughtKanji, ''), bc.at, bc.end, [{ t: GAP_BLANK }]);
      var items = rndShuffle([v].concat(d));
      return parts && { type: 'gap', prompt: 'Choose what fills the gap:', question: parts.map(function (p) { return p.t; }).join(''),
        parts: parts, note: bc.en, options: items.map(boundLabel), optionParts: items.map(optParts), correct: items.indexOf(v), speech: bc.reading };
    }),
    f('ctxRead', true, function () {
      var bc = hasKanji(v.word) && pick();
      return bc ? typing('Type the reading of this word in hiragana:', bc.word, bc.answers, 'hiragana…',
        Object.assign({ parts: shown(bc), note: bc.en, speech: bc.reading }, KANA_INPUT)) : null;
    }),
    f('ctxReadMc', false, function () {
      var bc = hasKanji(v.word) && pick();
      if (!bc) return null;
      // misreadings of the morpheme first (さんかい for 三回 is right, さんがい for 三階 too: alt)
      var hostR = kataToHira(sliceParts(bc.parts, v.pos === 'prefix' ? bc.end : 0, v.pos === 'prefix' ? Infinity : bc.at).map(function (p) { return p.r || p.t; }).join(''));
      var fakes = rndShuffle(readingFakes(bc.reading).filter(function (r) { return bc.answers.indexOf(r) < 0; }));
      var mine = function (r) { return v.pos === 'prefix' ? r.slice(-hostR.length) === hostR : r.indexOf(hostR) === 0; };
      var wrong = function (r) { return bc.answers.indexOf(r) < 0; };
      fakes = squareFakes(bc.reading, function (r) { return wrong(r) && mine(r); }) || squareFakes(bc.reading, wrong) ||
        fakes.filter(mine).concat(fakes.filter(function (r) { return !mine(r); })).slice(0, 3);
      if (fakes.length < 2) return null;
      var opts = rndShuffle([bc.reading].concat(fakes));
      return { type: 'mc', prompt: 'How do you read this word?', question: bc.word, parts: shown(bc), note: bc.en, speech: bc.reading,
        options: opts, correct: opts.indexOf(bc.reading) };
    })
  ];
}

// formsFor(item, ctx) → [{ name, recall, make() → exercise | null }]: every way
// to ask about one item. recall = typed answer; the rest are MC.
function formsFor(item, ctx) {
  var rank = ctx.rank, opt = { taught: ctx.taught, level: ctx.unit.level };
  var mc = function (type, prompt, question, field, pool, answer, extra) {
    answer = answer || DISTRACTOR_RULES[field].texts(item, '')[0];
    var d = pickDistractors(item, pool, field, 3, Object.assign({ answer: answer }, opt));
    if (d.length < 2) return null;
    var opts = rndShuffle([answer].concat(d));
    return Object.assign({ type: type, prompt: prompt, question: question, options: opts, correct: opts.indexOf(answer) }, extra);
  };
  var typing = function (prompt, question, answers, placeholder, extra) {
    return Object.assign({ type: 'typing', prompt: prompt, question: question, answers: answers, placeholder: placeholder }, extra);
  };
  var wordParts = function (w) { return quizFurigana([{ t: w.word, r: w.reading }], ctx.taughtKanji, ''); };
  var conjEx = function (v, form) {
    var c = v && conjugate(v.word, v.reading, form, v.pos);
    if (!c) return null;
    // another spelling of the word (alt: 終る for 終わる) conjugates to a right answer too
    var alts = catalogOf('vocab').filter(function (x) { return x.alt === v.id; }).map(function (x) { var a = conjugate(x.word, x.reading, form, x.pos); return a && a.kanji; });
    var answers = [c.kanji, c.kana].concat(alts).filter(function (a, i, arr) { return a && arr.indexOf(a) === i; });
    return { type: 'conjugation', prompt: 'Conjugate to ' + form + ':', question: v.word, parts: wordParts(v),
      answers: answers, targetForm: form, placeholder: form + '...', conjItem: v.id };
  };
  var f = function (name, recall, make) { return { name: name, recall: recall, make: make }; };
  // inSentence(w, make): make(sentence, raw furigana parts, span) for a random catalog
  // sentence that uses vocab w and holds it once with its reading; first non-null result.
  var inSentence = function (w, make) {
    var sents = quizSentences(sentencesUsing(w.id), ctx);
    for (var i = 0; i < sents.length; i++) {
      var raw = furiganaParts(sents[i].furigana || sents[i].jp), sp = wordSpan(raw, w.word, w.reading);
      var ex = sp && make(sents[i], raw, sp);
      if (ex) return ex;
    }
    return null;
  };
  // 表記 for vocab w: only once all its kanji are taught (asked from the word or its kanji)
  var hyouki = function (w) {
    if (!hasKanji(w.word) || !allKanjiTaught(w.word, ctx.taughtKanji)) return null;
    var d = spellingFakes(w).slice(0, 3);
    return d.length < 3 ? null : inSentence(w, function (s, raw, sp) {
      var parts = spliceParts(quizFurigana(raw, ctx.taughtKanji, w.word), sp.at, sp.end, [{ t: w.reading, u: true }]);
      var opts = rndShuffle([w.word].concat(d));
      return { type: 'hyouki', prompt: 'How is the underlined word written?', question: s.jp, parts: parts, options: opts,
        correct: opts.indexOf(w.word), sentence: s.id, word: w.id };
    });
  };

  if (item.kind === 'mondai') {
    if (item.type === 'iikae') return [f('iikae', false, function () { return iikaeQuestion(item, ctx.taughtKanji); })];
    if (item.type === 'bunshou') return [f('bunshou', false, function () { return bunshouQuestion(item, 1 + Math.floor(Math.random() * item.blanks.length), ctx.taughtKanji); })];
    return [];
  }

  if (item.kind === 'kana') {
    var k = item;
    var mcKana = function (toRomaji) {
      var d = kanaDistractors(k, 8, ctx.items.filter(function (x) { return x.kind === 'kana'; }), ctx.kanaMode ? ctx.learned : null);
      var right = toRomaji ? k.romaji : k.char;
      // ず / づ share a romaji: keep the first 3 distinct option texts
      var texts = [right];
      d.forEach(function (x) { var s = toRomaji ? x.romaji : x.char; if (texts.length < 4 && texts.indexOf(s) < 0) texts.push(s); });
      var opts = rndShuffle(texts);
      return { type: 'mc', prompt: toRomaji ? 'How do you read this kana?' : 'Which kana is "' + k.romaji + '"?',
        question: toRomaji ? k.char : k.romaji, options: opts, correct: opts.indexOf(right) };
    };
    // romaji → kana only when the romaji names one kana (not ji: じ/ぢ, o: お/を)
    var ambiguous = catalogOf('kana').some(function (x) { return x.script === k.script && x.id !== k.id && x.answers.indexOf(k.romaji) >= 0; });
    return [
      f('kanaType', true, function () { return typing('Type the romaji for this kana:', k.char, k.answers, 'romaji…'); }),
      f('kanaRead', false, function () { return mcKana(true); }),
      f('kanaPick', false, function () { return ambiguous ? null : mcKana(false); })
    ];
  }

  if (isBound(item)) return boundForms(item, ctx, f, typing);

  // Reading a kana word (ticket 44): kana → romaji typed, romaji → kana typed (only when the romaji
  // names one spelling) or picked among one-edit fakes in learned kana. Never its meaning.
  if (item.kind === 'kanaword' || item.kind === 'vocab' && ctx.kanaMode) {
    // shown romaji: ー as a macron (kōhī), so it names one spelling; typed answers take kōhī or koohii
    var kw = item, rom = kanaToRomaji(kw.word), shown = kanaToRomaji(kw.word, true), kata = /[ァ-ヺ]/.test(kw.word);
    var read = [
      f('romajiType', true, function () { return typing('Type this word in romaji:', kw.word, [rom], 'romaji…', { romaji: kw.word }); }),
      f('romajiPick', false, function () {
        var fakes = kanaWordFakes(kw.word, ctx.learned).slice(0, 3);
        if (fakes.length < 2) return null;
        var opts = rndShuffle([kw.word].concat(fakes));
        return { type: 'mc', prompt: 'Which is "' + shown + '"?', question: shown, options: opts, correct: opts.indexOf(kw.word) };
      }),
      f('kanaSpell', true, function () {
        var hint = kata ? { hint: IME_HINT + ' Type - for ー (ō is o-).' } : {};
        return kanaSpellable(kw.word) ? typing('Type this word in ' + (kata ? 'katakana' : 'hiragana') + ':', shown, [kw.word],
          kata ? 'katakana…' : 'hiragana…', Object.assign({}, KANA_INPUT, kata ? { kata: true } : {}, hint)) : null;
      })
    ];
    if (item.kind === 'kanaword') return read;
    // a taught word (ticket 42) is also asked for its meaning, and as the word for a meaning (only
    // when no other taught word shares that meaning)
    return read.concat([
      f('meaningMc', false, function () { return mc('mc', 'What does this word mean?', kw.word, 'gloss', ctx.vPool); }),
      f('wordMc', false, function () {
        var clash = Object.keys(ctx.taught).some(function (id) {
          var x = CATALOG.items[id];
          return x && x.kind === 'vocab' && x !== kw && !isBound(x) && (sharesSense(glossText(x), glossText(kw)) || nearSynonyms(x, kw));
        });
        return clash ? null : mc('mc', 'Which word means "' + glossText(kw) + '"?', '', 'word', ctx.kanaPool);
      })
    ]);
  }

  if (item.kind === 'vocab') {
    var v = item, kanjiWord = hasKanji(v.word);
    // Same spelling, other reading (人: ひと / じん / にん): typing one of those is not a miss but a
    // retry (otherReading); while one of them is taught, the reading question names the meaning.
    // Same meaning (九 きゅう / く, 私 わたし / わたくし): that reading is simply right too.
    var spellings = catalogOf('vocab').filter(function (x) { return x.word === v.word && x.id !== v.id && kataToHira(x.reading) !== kataToHira(v.reading); });
    var same = function (x) { return !isBound(x) && normEn(x.gloss[0]) === normEn(v.gloss[0]); };
    var alsoRight = spellings.filter(same).map(function (x) { return kataToHira(x.reading); }).concat(v.alsoRead || []); // 明日: あす too
    var homographs = spellings.filter(function (x) { return !same(x); });
    var others = homographs.map(function (x) { return { id: x.id, word: x.word, reading: kataToHira(x.reading), gloss: glossText(x) }; });
    var kanaIn = Object.assign({ others: others }, KANA_INPUT);
    var forms = [
      f('meaningType', true, function () {
        return typing('What does this word mean? (type in English)', v.word, meaningAnswers(v.gloss).concat(v.accept || []), 'English meaning...', { parts: wordParts(v) });
      }),
      f('readingType', true, function () {
        var hint = homographs.some(function (x) { return ctx.taught[x.id]; }) ? { note: '"' + glossText(v) + '"' } : {};
        return kanjiWord ? typing('Type the reading of this word in hiragana:', v.word, [kataToHira(v.reading), v.reading].concat(alsoRight).filter(function (a, i, arr) { return arr.indexOf(a) === i; }),
          'hiragana…', Object.assign(hint, kanaIn)) : null;
      }),
      f('enToJp', true, function () {
        // only when no other taught word shares a sense (else two right answers)
        var clash = ctx.vPool.some(function (x) { return x !== v && ctx.taught[x.id] && x.word !== v.word && !isBound(x) && (sharesSense(glossText(x), glossText(v)) || nearSynonyms(x, v)); });
        var ans = [v.reading, kataToHira(v.reading), v.word].concat(alsoRight).filter(function (a, i, arr) { return arr.indexOf(a) === i; });
        return clash ? null : typing('Type the Japanese for "' + glossText(v) + '":', '', ans, 'in Japanese…', kanaIn);
      }),
      f('meaningMc', false, function () { return mc('mc', 'What does this word mean?', v.word, 'gloss', ctx.vPool, null, { parts: wordParts(v) }); }),
      f('wordMc', false, function () { return mc('mc', 'Which word means "' + glossText(v) + '"?', '', 'word', ctx.vPool); }),
      f('readingMc', false, function () { return kanjiWord ? mc('mc', 'How do you read this word?', v.word, 'reading', ctx.vPool) : null; }),
      // exam formats (ticket 11): the word inside a catalog sentence that uses it
      f('kanjiYomi', false, function () {
        return kanjiWord ? inSentence(v, function (s, raw, sp) {
          var parts = spliceParts(quizFurigana(raw, ctx.taughtKanji, v.word), sp.at, sp.end, [{ t: v.word, u: true }]);
          return mc('kanji_yomi', 'How is the underlined word read?', s.jp, 'reading', ctx.vPool, null, { parts: parts, sentence: s.id });
        }) : null;
      }),
      f('hyouki', false, function () { return hyouki(v); }),
      f('bunmyaku', false, function () {
        // ponytail: all-hiragana words under 3 kana match inside other words too often; skipped
        if (!kanjiWord && scriptShape(v.word) === 'hira' && v.word.length < 3) return null;
        // same exact pos, no shared sense (the English note then leaves one fit), taught first,
        // then another topic tag; shown in kana while a kanji is untaught (Q33)
        var tags = v.tags || [];
        var cands = rndShuffle(ctx.vPool.filter(function (x) {
          return x.pos === v.pos && x.id !== v.id && !x.alt && x.word !== v.word && x.reading !== v.reading &&
            (x.level === v.level || ctx.taught[x.id]) && !sharesSense(glossText(x), glossText(v)) && !nearSynonyms(x, v);
        })).map(function (x) {
          return { it: x, s: [!ctx.taught[x.id], (x.tags || []).some(function (t) { return tags.indexOf(t) >= 0; })] };
        }).sort(function (a, b) { return a.s[0] - b.s[0] || a.s[1] - b.s[1]; });
        var shown = function (x) { return allKanjiTaught(x.word, ctx.taughtKanji) ? x.word : x.reading; };
        var picks = [v];
        cands.forEach(function (c) {
          if (picks.length < 4 && picks.map(shown).indexOf(shown(c.it)) < 0) picks.push(c.it);
        });
        if (picks.length < 4) return null;
        return inSentence(v, function (s, raw, sp) {
          var parts = spliceParts(quizFurigana(raw, ctx.taughtKanji, ''), sp.at, sp.end, [{ t: GAP_BLANK }]);
          var items = rndShuffle(picks);
          return parts && { type: 'bunmyaku', prompt: 'Which word fits the gap?', question: s.jp, parts: parts, note: s.en,
            options: items.map(shown), optionItems: items, correct: items.indexOf(v), sentence: s.id };
        });
      })
    ];
    if (ctx.conjForm && isVerbItem(v)) forms.push(f('conj', true, function () { return conjEx(v, ctx.conjForm); }));
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      forms.push(f('listen', false, function () { return mc('listen', 'Listen and choose the meaning:', v.word, 'gloss', ctx.vPool, null, { audio: v.reading || v.word }); }));
    }
    var free = ctx.vocab.filter(function (x) { return x !== v && !isBound(x); });
    if (rank >= 2 && free.length >= 3) forms.push(f('pairMatch', false, function () {
      var pairs = [v].concat(rndShuffle(free).slice(0, 3)).map(function (x) { return [x.word, glossText(x)]; });
      var ans = pairs.map(function (p) { return p[1]; });
      return { type: 'pair_match', prompt: 'Match each word to its meaning:', question: '', items: rndShuffle(pairs.map(function (p) { return p[0]; })),
        answers: ans, pairs: pairs, options: rndShuffle(ans) };
    }));
    if (rank >= 3) forms.push(f('synonym', false, function () { return mc('synonym', 'Choose the closest meaning to: ' + v.word, v.word, 'gloss', ctx.vPool); }));
    return forms;
  }

  if (item.kind === 'kanji') {
    var kj = item, rs = kanjiReadings(kj);
    return [
      // any one reading (on, kun, extra; kun with or without okurigana), on in katakana or hiragana
      // (no sample reading as placeholder: it'd be an answer)
      f('kanjiReadType', true, function () {
        var ons = (kj.on || []).concat((kj.extra || []).filter(function (r) { return /^[ァ-ヶ]/.test(r); }));
        return typing('Type the reading for this character:', kj.char, ons.concat(kanjiValidReadings(kj)), 'reading…', KANA_INPUT);
      }),
      f('kanjiMeanType', true, function () { return typing('What does this kanji mean? (type in English)', kj.char, meaningAnswers(kj.meaning).concat(kj.accept || []), 'English meaning...'); }),
      f('kanjiReadMc', false, function () {
        return rank >= 3 ? mc('kanji_reading', 'Select the correct reading:', kj.char, 'kanjiReading', ctx.kPool, rndShuffle(rs)[0])
          : mc('mc', 'Which is a reading of this kanji?', kj.char, 'kanjiReading', ctx.kPool, rndShuffle(rs)[0]);
      }),
      f('kanjiMeanMc', false, function () { return mc('mc', 'What does this kanji mean?', kj.char, 'kanjiMeaning', ctx.kPool); }),
      // 表記 of a taught word written with this kanji (words come before their kanji)
      f('hyouki', false, function () {
        var ws = rndShuffle((kj.words || []).filter(function (id) { return ctx.taught[id]; }));
        for (var i = 0; i < ws.length; i++) { var ex = CATALOG.items[ws[i]] && hyouki(CATALOG.items[ws[i]]); if (ex) return ex; }
        return null;
      })
    ];
  }

  if (item.kind === 'grammar') {
    var g = item;
    var gForms = [
      f('patternMc', false, function () {
        return mc(rank >= 2 ? 'fill_blank' : 'mc', 'Choose the correct grammar pattern:', g.meaning, 'pattern', ctx.gPool);
      }),
      f('gap', false, function () {
        var sents = quizSentences((g.examples || []).map(function (id) { return CATALOG.items[id]; }).filter(Boolean), ctx);
        var surfaces = gapSurfaces(g);
        for (var i = 0; i < sents.length; i++) {
          var s = sents[i], base = quizFurigana(furiganaParts(s.furigana || s.jp), ctx.taughtKanji, '');
          for (var j = 0; j < surfaces.length; j++) {
            var parts = gapParts(base, surfaces[j]);
            if (!parts) continue;
            var ans = surfaces[j];
            // distractors: confusables, no two from one GAP_INTERCHANGEABLE set (answer included)
            var ids = [g.id], d = [];
            rndShuffle([].concat.apply([], GRAMMAR_CONFUSABLES.filter(function (set) { return set.indexOf(g.id) >= 0; }))).forEach(function (id) {
              var c = CATALOG.items[id], txt = c && gapSurfaces(c)[0];
              if (!txt || d.length >= 3 || ids.some(function (x) { return gapClash(x, id); }) || (GAP_ANSWER_BLOCKS[g.id] || []).indexOf(id) >= 0 || surfaces.indexOf(txt) >= 0 ||
                  d.indexOf(txt) >= 0 || sharesSense(c.meaning, g.meaning)) return;
              ids.push(id);
              d.push(txt);
            });
            if (d.length < 2) return null;
            var opts = rndShuffle([ans].concat(d));
            return { type: 'gap', prompt: 'Choose what fills the gap:', question: parts.map(function (p) { return p.t; }).join(''),
              parts: parts, note: s.en, options: opts, correct: opts.indexOf(ans), sentence: s.id };
          }
        }
        return null;
      }),
      f('order', false, function () {
        var s = quizSentences(sentencesUsing(g.id).filter(function (x) { return x.chunks; }), ctx)[0];
        return s ? orderQuestion(s, ctx.taughtKanji) : null;
      })
    ];
    if (g.conjForm) gForms.push(f('conj', true, function () {
      var vs = ctx.verbs.filter(function (x) { return conjugate(x.word, x.reading, g.conjForm, x.pos); });
      var mine = vs.filter(function (x) { return ctx.vocab.indexOf(x) >= 0; });
      return conjEx(rndShuffle(mine.length ? mine : vs)[0], g.conjForm);
    }));
    return gForms;
  }
  return [];
}

// ── Answer-leak guard ───────────────────────────────────────────────────────
var JA_CHARS = /[぀-ヿ㐀-鿿]/;
// Types whose sentence body may repeat a particle or chunk of the answer: only the
// instructions and English note count there. Listening shows only its prompt.
var LEAK_BODY_OK = { gap: true, order: true, bunshou: true, iikae: true, reading: true, listen_dialog: true };
// answerLeaks(ex): the accepted answer ex shows before it is answered, else null. A Japanese
// answer (and a word answer's reading, except in 表記, which shows it on purpose) must not be
// in the prompt / note / hint / placeholder, nor (2+ chars) in the shown question; an English
// answer not as a whole word in the shown question (prompts are fixed English instructions).
// MC: no other option may equal the answer. makeQuestion and mondaiQuestions skip a leaking
// question, so every generator goes through it.
function answerLeaks(ex) {
  if (ex.type === 'pair_match') return null;
  var shown = function (ps) { return ps.map(function (p) { return p.t + ' ' + (p.r || ''); }).join(' '); };
  var answers = ex.answers ? ex.answers.slice() : [ex.options[ex.correct]], it = ex.item;
  if (it && it.kind === 'vocab' && ex.type !== 'hyouki' && answers.indexOf(it.word) >= 0) answers.push(it.reading);
  var en = [ex.prompt, ex.note, ex.hint, ex.placeholder].join('\n');
  var body = LEAK_BODY_OK[ex.type] ? '' : (ex.parts ? shown(ex.parts) : ex.question || '').toLowerCase();
  var hit = answers.filter(function (a) {
    if (JA_CHARS.test(a)) return en.indexOf(a) >= 0 || (a.length > 1 && body.indexOf(a) >= 0);
    var at = body.indexOf(a.toLowerCase()); // ponytail: first hit only
    return at >= 0 && !/[a-z]/.test(body.charAt(at - 1)) && !/[a-z]/.test(body.charAt(at + a.length));
  })[0];
  if (hit) return hit;
  if (!ex.answers && ex.options) {
    var ans = kataToHira(ex.options[ex.correct]);
    if (ex.options.some(function (o, i) { return i !== ex.correct && kataToHira(o) === ans; })) return ans;
  }
  return null;
}

// ── Recent questions (ticket 43) ────────────────────────────────────────────
// Device-local memory of the last RECENT_Q_MAX questions asked ('<itemId>|<form>'), so the next quiz
// prefers other forms (and, where it samples, other items). localStorage only: never synced, never
// touches the SRS. The quiz records a question when it is answered (rememberAsked).
var RECENT_Q_KEY = 'jlpt_recent_q', RECENT_Q_MAX = 100;
function recentList() {
  try { var a = JSON.parse(localStorage.getItem(RECENT_Q_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}
function recentAsked() { // { '<itemId>|<form>': true }
  var o = {};
  recentList().forEach(function (k) { o[k] = true; });
  return o;
}
function rememberAsked(ex) {
  var id = ex && (ex.item && ex.item.id || ex.itemId);
  if (!id || !ex.form) return;
  var k = id + '|' + ex.form;
  var a = recentList().filter(function (x) { return x !== k; }).concat([k]);
  try { localStorage.setItem(RECENT_Q_KEY, JSON.stringify(a.slice(-RECENT_Q_MAX))); } catch (e) {}
}
// notRecentFirst(list, isRecent): list with the entries not asked recently first (order kept).
function notRecentFirst(list, isRecent) {
  return list.filter(function (x) { return !isRecent(x); }).concat(list.filter(isRecent));
}
// askedRecently(recent, id): any recent question about item id.
function askedRecently(recent, id) {
  return Object.keys(recent || {}).some(function (k) { return k.indexOf(id + '|') === 0; });
}

// Kana quiz parts (ticket 44): reading forms (single kana, kana words) vs the meaning forms of a taught word.
var KANA_READ_FORMS = { kanaType: true, kanaRead: true, kanaPick: true, romajiType: true, romajiPick: true, kanaSpell: true };
function formPart(name) { return KANA_READ_FORMS[name] ? 'read' : 'meaning'; }

// makeQuestion(item, ctx, wantRecall, avoid, strict, part): one exercise for item — a form
// of the wanted kind (true recall / false MC / null any) not in avoid if
// possible, then any other fresh form, then a repeat; forms asked recently on this device last.
// part ('read' | 'meaning', kana quizzes) keeps to that part's forms. Tagged with itemId (not for
// a kanaword: no card), form, recall, part (kana quizzes) and the item itself (for the re-queue).
// null when nothing fits.
function makeQuestion(item, ctx, wantRecall, avoid, strict, part) {
  var forms = formsFor(item, ctx).filter(function (fm) { return !part || formPart(fm.name) === part; });
  var fresh = forms.filter(function (fm) { return avoid.indexOf(fm.name) < 0; });
  var tryAll = function (fs) {
    var list = notRecentFirst(rndShuffle(fs), function (fm) { return !!(ctx.recent || {})[item.id + '|' + fm.name]; });
    for (var i = 0; i < list.length; i++) {
      var ex = list[i].make();
      if (!ex || answerLeaks(Object.assign(ex, { item: item }))) continue;
      Object.assign(ex, { item: item, form: list[i].name, recall: list[i].recall });
      if (item.kind !== 'kanaword') ex.itemId = item.id;
      if (ctx.kanaMode) ex.part = formPart(list[i].name);
      return ex;
    }
    return null;
  };
  var want = function (fs) { return wantRecall === null ? fs : fs.filter(function (fm) { return fm.recall === wantRecall; }); };
  if (strict) return tryAll(want(fresh));
  var ex = tryAll(want(fresh)) || tryAll(fresh) || tryAll(want(forms)) || tryAll(forms);
  if (ex || ctx.leakOk) return ex;
  // last resort: a sentence using items taught later (quizSentences), rather than no question
  ctx.leakOk = true;
  ex = tryAll(forms);
  ctx.leakOk = false;
  return ex && Object.assign(ex, { leaky: true });
}

// itemSlots(ctx, n): the items a lesson / review quiz asks, in order. Grammar first, so a form
// point (て-form…) gets its recall (conjugation) question while the recall share is still open.
// Every item once; a review samples, items not asked recently first; a second ask (each item at
// most QUIZ_ITEM_MAX times: quizCapacity) only when n is more than the items.
function itemSlots(ctx, n) {
  var fresh = function (list) { return notRecentFirst(rndShuffle(list), function (it) { return askedRecently(ctx.recent, it.id); }); };
  var order = fresh(ctx.items.filter(function (it) { return it.kind === 'grammar'; }))
    .concat(fresh(ctx.items.filter(function (it) { return it.kind !== 'grammar'; }))).slice(0, n);
  order = order.concat(rndShuffle(ctx.items).slice(0, Math.max(0, n - order.length)));
  return order.map(function (it) { return { item: it }; });
}
// kanaQuizSlots(unit, ctx, n): a kana quiz's questions (ticket 44) as { item, part }. Meaning: each
// taught word once (at most half the quiz); a review samples KANA_REVIEW_MEANING_SHARE. Reading:
// words (kanaReadWords + the taught words) chosen greedily to cover every new kana and mark of the
// stage (a review: all its kana), then a single-kana question for each new kana no word holds,
// then more words. Items not asked recently first; each item at most QUIZ_ITEM_MAX times.
function kanaQuizSlots(unit, ctx, n) {
  var fresh = function (list) { return notRecentFirst(rndShuffle(list), function (it) { return askedRecently(ctx.recent, it.id); }); };
  var kana = ctx.items.filter(function (it) { return it.kind === 'kana'; });
  var words = ctx.items.filter(function (it) { return it.kind !== 'kana'; });
  var nMean = Math.min(words.length, unit.kind === 'review' ? Math.round(n * KANA_REVIEW_MEANING_SHARE) : Math.floor(n / 2));
  var slots = fresh(words).slice(0, nMean).map(function (it) { return { item: it, part: 'meaning' }; });
  var r = n - nMean, count = {}, readN = {}, reads = [], left = {};
  slots.forEach(function (sl) { count[sl.item.id] = 1; }); // a taught word: its meaning + one reading
  var add = function (it) {
    reads.push({ item: it, part: 'read' });
    count[it.id] = (count[it.id] || 0) + 1;
    readN[it.id] = (readN[it.id] || 0) + 1;
  };
  var once = function (it) { return !readN[it.id] && (count[it.id] || 0) < QUIZ_ITEM_MAX; };
  kana.map(function (k) { return k.char; }).concat(unit.kind === 'kana' ? unit.marks || [] : []).forEach(function (c) { left[c] = true; });
  // taught words read only when they hold a new kana (hasNewKana); the level's words before N4, N3
  var pool = fresh(ctx.readWords.concat(words.filter(function (w) { return hasNewKana(unit, w.word); }))).map(function (w) {
    return { it: w, syl: kanaSyllables(w.word), rank: levelRank(w.level || unit.level) - levelRank(unit.level) };
  }).sort(function (a, b) { return a.rank - b.rank; });
  var gain = function (w) { return w.syl.filter(function (c, i) { return left[c] && w.syl.indexOf(c) === i; }).length; };
  while (reads.length < r) { // greedy cover: the lowest-level word with the most kana not covered yet
    var best = null, bestGain = 0;
    pool.forEach(function (w) { var g = once(w.it) && gain(w); if (g > 0 && (!best || w.rank < best.rank || w.rank === best.rank && g > bestGain)) { best = w; bestGain = g; } });
    if (!best) break;
    add(best.it);
    best.syl.forEach(function (c) { left[c] = false; });
  }
  kana.forEach(function (k) { if (left[k.char] && reads.length < r) add(k); }); // no word holds it
  pool.forEach(function (w) { if (once(w.it) && reads.length < r) add(w.it); });
  fresh(kana).forEach(function (k) { if (!count[k.id] && reads.length < r) add(k); });
  pool.forEach(function (w) { if ((count[w.it.id] || 0) < QUIZ_ITEM_MAX && reads.length < r) add(w.it); });
  return slots.concat(reads);
}
// spaceOut(exs): exs in random order, no item within QUIZ_SPACING questions of itself where that
// is possible (ticket 43).
function spaceOut(exs) {
  var key = function (e) { return e.item ? e.item.id : e.itemId; };
  var best = null, bestBad = Infinity;
  // ponytail: greedy, retried on a fresh shuffle when it gets stuck; fine at ≤ 30 questions
  for (var t = 0; t < 10 && bestBad > 0; t++) {
    var rest = rndShuffle(exs), out = [], bad = 0;
    while (rest.length) {
      var near = out.slice(-QUIZ_SPACING).map(key), i = 0;
      while (i < rest.length && near.indexOf(key(rest[i])) >= 0) i++;
      if (i === rest.length) { bad++; i = 0; }
      out.push(rest.splice(i, 1)[0]);
    }
    if (bad < bestBad) { best = out; bestBad = bad; }
  }
  return best || [];
}

// buildExercises(unit): a fresh quiz for one resolved unit (buildUnits): quizSize questions, every
// item once (a review samples 20), a second ask only to reach QUIZ_MIN_QUESTIONS; a kana quiz reads
// mostly words (kanaQuizSlots). At least RECALL_SHARE typed answers. A unit with passages / listening
// (reviews) ends with their reading then listening questions, in place of as many item questions.
function buildExercises(unit) {
  if (unit.kind === 'prep') return prepDrill(unit); // ticket 18; a mock unit runs MockExam instead
  var ctx = quizContext(unit);
  if (!ctx.items.length) return [];
  var total = quizSize(unit, ctx.items);
  var reading = readingExercises(unit, ctx.taughtKanji); // takes slots from the item questions
  var listening = listeningExercises(unit, ctx.taughtKanji);
  var n = total - reading.length - listening.length;
  var slots = ctx.kanaMode ? kanaQuizSlots(unit, ctx, n) : itemSlots(ctx, n);
  var need = Math.ceil(total * RECALL_SHARE), used = {}, out = [];
  var recallCount = function () { return out.filter(function (e) { return e.recall; }).length; };
  slots.forEach(function (sl) {
    var ex = makeQuestion(sl.item, ctx, recallCount() < need, used[sl.item.id] || [], false, sl.part);
    if (!ex) return;
    out.push(ex);
    (used[sl.item.id] = used[sl.item.id] || []).push(ex.form);
  });
  // top-up: swap MC questions for recall ones until the share is met
  for (var i = 0; i < out.length && recallCount() < need; i++) {
    if (out[i].recall) continue;
    var it = out[i].item, part = out[i].part;
    var r = makeQuestion(it, ctx, true, used[it.id], true, part) || makeQuestion(it, ctx, true, [], true, part);
    if (r) out[i] = r;
  }
  // reading then listening last, as on the test
  return spaceOut(out).concat(reading, listening);
}

// ── Reading passages (ticket 15) ────────────────────────────────────────────
// passagesFor(level, format?): the catalog's passages of a level (format 'short' | 'mid' |
// 'info', or all), in catalog order. For test prep and mocks (ticket 18).
function passagesFor(level, format) {
  return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (p) {
    return p.kind === 'passage' && p.level === level && (!format || p.format === format);
  });
}
// readingExercises(unit, taughtKanji): one MC 'reading' question per question of each passage
// in unit.passages. passage / parts / optionParts are furigana parts, ruby only on kanji not
// taught yet (Q33); options shuffled. Not tied to an SRS card (itemId is the passage id).
function readingExercises(unit, taughtKanji) {
  var out = [];
  (unit.passages || []).forEach(function (id) {
    var p = CATALOG.items[id];
    if (!p || p.kind !== 'passage') return;
    p.questions.forEach(function (q, qi) { out.push(readingQuestion(p, qi, taughtKanji)); });
  });
  return out;
}
// readingQuestion(p, qi, taughtKanji, order?): question qi of passage p; options shuffled, or in
// `order` (indexes into the authored options: a mock's fixed order).
function readingQuestion(p, qi, taughtKanji, order) {
  var ruby = function (s) { return quizFurigana(furiganaParts(s), taughtKanji || {}, ''); };
  var text = function (s) { return furiganaParts(s).map(function (x) { return x.t; }).join(''); };
  var q = p.questions[qi];
  order = order || rndShuffle(q.options.map(function (_, i) { return i; }));
  return { type: 'reading', prompt: 'Read the text and answer the question.', passage: ruby(p.furigana),
    question: text(q.q), parts: ruby(q.q), options: order.map(function (i) { return text(q.options[i]); }),
    optionParts: order.map(function (i) { return ruby(q.options[i]); }), correct: order.indexOf(q.answer),
    explain: q.explain, itemId: p.id, form: 'reading', recall: false };
}

// ── Listening (ticket 17) ───────────────────────────────────────────────────
// Items: data/<lvl>/listening.js (format task | point | utterance | quick). Audio is the
// pre-rendered clips of audio/manifest.js when present, else the browser's speech synthesis (app-helpers.js speakScript); the pure parts live here.
var LISTEN_PROMPTS = {
  task: 'Listen, then answer the question.',
  point: 'Listen, then answer the question.',
  utterance: 'Listen to the situation. What do you say?',
  quick: 'Listen and choose the best reply.'
};
var LISTEN_SPOKEN_OPTIONS = { utterance: true, quick: true }; // options heard, not printed
var LISTEN_NUMBERS = ['いち', 'に', 'さん', 'よん'];
var LISTEN_MOCK_PLAYS = 2; // mocks: play once + one replay; lessons: unlimited (0)

// listeningFor(level, format?): the catalog's listening items of a level, in catalog order.
// For test prep and mocks (ticket 18): listenQuestion(item, taughtKanji, { mock: true }).
function listeningFor(level, format) {
  return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (p) {
    return p.kind === 'listening' && p.level === level && (!format || p.format === format);
  });
}
// speechText: furigana markup → what the voice reads (kana readings, so no kanji is misread).
// readingKana: a kanji reading as the voice should hear it ("た.べる" -> "たべる", "-ちゅう" -> "ちゅう").
function readingKana(r) { return r.replace(/[.\-\s]/g, ''); }
function speechText(s) { return furiganaParts(s).map(function (p) { return p.r || p.t; }).join(''); }

// listeningScript(item, order?): the whole play sequence [{ speaker, text }], options in
// `order` (indexes into item.options). task / point: scene, question, dialogue, question again.
// utterance: situation, question, then each option (narrator says its number). quick: the line,
// then each reply.
function listeningScript(it, order) {
  order = order || it.options.map(function (_, i) { return i; });
  var say = function (speaker, s) { return { speaker: speaker, text: speechText(s) }; };
  var lines = it.lines.map(function (l) { return say(l.speaker, l.furigana); });
  var q = it.question && say('N', it.question);
  var seq;
  if (!LISTEN_SPOKEN_OPTIONS[it.format]) seq = [lines[0], q].concat(lines.slice(1), [q]);
  else seq = lines.concat(q ? [q] : [], [].concat.apply([], order.map(function (i, n) {
    return [{ speaker: 'N', text: LISTEN_NUMBERS[n] }, say(it.optionSpeaker, it.options[i])];
  })));
  // Pre-rendered audio (audio/manifest.js, authored order): clips[j] is the clip of authored slot j.
  // A spoken option's clip follows the option (authored index), its number clip stays at its slot.
  var clips = listenClips(it);
  if (clips) {
    var base = lines.length + (q ? 1 : 0);
    seq = seq.map(function (l, j) { // copies: the question object appears twice
      var k = j - base, c = { speaker: l.speaker, text: l.text };
      c.clip = clips[k >= 0 && k % 2 === 1 ? base + 2 * order[(k - 1) / 2] + 1 : j];
      return c;
    });
  }
  return seq;
}
// listenClips(item): the track's clip file names in authored order, or null (no manifest / track).
function listenClips(it) {
  var c = typeof AUDIO_MANIFEST !== 'undefined' && AUDIO_MANIFEST.tracks[it.id];
  return c || null;
}

// listenQuestion(item, taughtKanji, opts): one MC 'listen_dialog' question. lines / questionParts /
// optionParts: furigana parts for the transcript (ruby only on kanji not taught yet, Q33), shown
// after answering. optionSpeech: each option alone, for its play button. maxPlays: 0 = unlimited;
// opts.mock → LISTEN_MOCK_PLAYS.
function listenQuestion(it, taughtKanji, opts) {
  var ruby = function (s) { return quizFurigana(furiganaParts(s), taughtKanji || {}, ''); };
  var text = function (s) { return furiganaParts(s).map(function (p) { return p.t; }).join(''); };
  // options keep their authored order (numbered 1-4 as on the test; `en` and `explain` follow it)
  var order = it.options.map(function (_, i) { return i; });
  return { type: 'listen_dialog', format: it.format, prompt: LISTEN_PROMPTS[it.format],
    script: listeningScript(it, order), spokenOptions: !!LISTEN_SPOKEN_OPTIONS[it.format],
    lines: it.lines.map(function (l) { return { speaker: l.speaker, parts: ruby(l.furigana) }; }),
    questionParts: it.question ? ruby(it.question) : null,
    options: order.map(function (i) { return text(it.options[i]); }),
    optionParts: order.map(function (i) { return ruby(it.options[i]); }),
    optionSpeech: order.map(function (i, n) {
      var l = { speaker: it.optionSpeaker, text: speechText(it.options[i]) }, c = listenClips(it);
      if (c && LISTEN_SPOKEN_OPTIONS[it.format]) l.clip = c[it.lines.length + (it.question ? 1 : 0) + 2 * i + 1];
      return l;
    }),
    correct: order.indexOf(it.answer), en: it.en, explain: it.explain,
    maxPlays: opts && opts.mock ? LISTEN_MOCK_PLAYS : 0,
    itemId: it.id, form: 'listening', recall: false };
}
// listeningExercises(unit, taughtKanji): the questions for unit.listening (review units).
function listeningExercises(unit, taughtKanji) {
  return (unit.listening || []).map(function (id) { return CATALOG.items[id]; })
    .filter(function (it) { return it && it.kind === 'listening'; })
    .map(function (it) { return listenQuestion(it, taughtKanji); });
}

// ── Timed quizzes, test prep and mock exams (ticket 18, Q32 / Q36-Q39) ──────
// Pacing per question from the real N5 test (jlpt.jp, item counts since 2020; research:
// .scratch/roadmap/research/jlpt-scoring.md): 文字・語彙 20 min / 21 items; 文法・読解 40 min for
// 17 grammar + 5 reading items, 1 min per grammar item leaving 23 min for reading; 聴解 30 min /
// 24 items. A full mock's sections come out at exactly 20 / 40 / 30 minutes.
// ponytail: N5 pacing at every level; add per-level paces when N4 gets mocks.
var MOCK_PACE = { vocab: 1200 / 21, grammar: 60, reading: 1380 / 5, listening: 1800 / 24 };
var MOCK_SECTIONS = [
  { key: 'vocab', name: '文字・語彙', nameF: '[文字|もじ]・[語彙|ごい]', en: 'Vocabulary' },
  { key: 'grammar', name: '文法・読解', nameF: '[文法|ぶんぽう]・[読解|どっかい]', en: 'Grammar · Reading' },
  { key: 'listening', name: '聴解', nameF: '[聴解|ちょうかい]', en: 'Listening' }
];
// Questions per mondai (jlpt-scoring.md §3, N5). Reading and listening count by item format.
// diagnostic: about half a full mock, every mondai kept.
var MOCK_BLUEPRINT = {
  full: { vocab: { kanjiYomi: 7, hyouki: 5, bunmyaku: 6, iikae: 3 },
    grammar: { gap: 9, order: 4, bunshou: 4, short: 2, mid: 2, info: 1 },
    listening: { task: 7, point: 6, utterance: 5, quick: 6 } },
  diagnostic: { vocab: { kanjiYomi: 4, hyouki: 3, bunmyaku: 3, iikae: 2 },
    grammar: { gap: 5, order: 2, bunshou: 3, short: 1, mid: 2, info: 1 },
    listening: { task: 3, point: 3, utterance: 2, quick: 3 } }
};
var MOCK_LABELS = { short: '内容理解（短文）', mid: '内容理解（中文）', info: '情報検索', task: '課題理解', point: 'ポイント理解',
  utterance: '発話表現', quick: '即時応答' };
// JLPT pass rules (jlpt.jp): total pass mark + sectional minimums, N5 scoring sections
// 言語知識・読解 0-120 and 聴解 0-60.
var JLPT_PASS = { N5: { total: 80, lkr: 38, listening: 19 } };

// paceKind(ex): which pacing a question gets. Exam formats by their section; typed recall
// and other quiz questions at the vocabulary pace.
function paceKind(ex) {
  if (ex.type === 'listen_dialog') return 'listening';
  if (ex.type === 'reading') return 'reading';
  return MONDAI[ex.form] && MONDAI[ex.form].section === 'bunpou' ? 'grammar' : 'vocab';
}
// quizSeconds(exs): time limit for a timed quiz or mock section (re-asked questions are free).
function quizSeconds(exs) {
  return Math.round(exs.reduce(function (n, e) { return e.requeue ? n : n + MOCK_PACE[paceKind(e)]; }, 0));
}
// isTimedQuiz(unit): lesson reviews (mini-mocks, Q36) and prep drills run against the clock;
// lessons, kana units and kana reviews stay untimed (Q32).
function isTimedQuiz(unit) {
  if (unit.kind === 'prep') return true;
  return unit.kind === 'review' && quizItems(unit).every(function (it) { return it.kind !== 'kana'; });
}
// timeUpResults(exs, results): results once the clock runs out — every unanswered question wrong.
function timeUpResults(exs, results) {
  return results.concat(exs.slice(results.length).map(function () { return false; }));
}

// mockItemIds(): passage / listening / mondai ids some mock uses (prep drills leave them alone).
function mockItemIds() {
  var ids = {};
  catalogOf('mock').forEach(function (m) {
    MOCK_SECTIONS.forEach(function (s) {
      m.sections[s.key].forEach(function (q) { ids[q.p || q.l || q.item || ''] = true; });
    });
  });
  delete ids[''];
  return ids;
}
// levelKanji(level): { char: true } for every kanji at or below the level (a mock assumes the
// whole level is taught, so ruby shows only on harder kanji, Q33).
function levelKanji(level) {
  var out = {};
  catalogOf('kanji').forEach(function (k) { if (levelRank(k.level) <= levelRank(level)) out[k.char] = true; });
  return out;
}
// mondaiKey(q): blueprint key of a fixed mock question (reading / listening: the item's format).
function mondaiKey(q) {
  return q.m === 'reading' ? CATALOG.items[q.p].format : q.m === 'listening' ? CATALOG.items[q.l].format : q.m;
}

// mockQuestion(q, taughtKanji): a fixed mock question (data/<lvl>/mocks.js) → an exercise in the
// shape Exercises renders, with `mondai` (blueprint key) and `explain` (shown in the results).
// Options are in the authored order, so the same mock always shows the same test.
function mockQuestion(q, tk) {
  var it = function (id) { return CATALOG.items[id]; };
  var ruby = function (s) { return quizFurigana(furiganaParts(s), tk, ''); };
  var text = function (s) { return furiganaParts(s).map(function (p) { return p.t; }).join(''); };
  var ex;
  if (q.m === 'kanjiYomi' || q.m === 'hyouki') {
    var s = it(q.s), w = it(q.w), raw = furiganaParts(s.furigana || s.jp), sp = wordSpan(raw, w.word, w.reading);
    var yomi = q.m === 'kanjiYomi';
    ex = { type: yomi ? 'kanji_yomi' : 'hyouki', prompt: yomi ? 'How is the underlined word read?' : 'How is the underlined word written?',
      // 表記 of a katakana word (official もんだい2 style): shown in hiragana, options in katakana
      question: s.jp, parts: spliceParts(quizFurigana(raw, tk, w.word), sp.at, sp.end, [{ t: yomi ? w.word : kataToHira(w.reading), u: true }]),
      options: q.o.slice(), correct: q.a, itemId: w.id,
      explain: '「' + w.word + '」 is ' + (hasKanji(w.word) ? 'read ' + w.reading : 'written in katakana') + ': "' + glossText(w) + '". ' + s.en };
  } else if (q.m === 'bunmyaku' || q.m === 'gap') {
    ex = { type: q.m, prompt: q.m === 'gap' ? 'Choose what fills the gap:' : 'Which word fits the gap?', question: text(q.f),
      parts: ruby(q.f), options: q.o.map(text), optionParts: q.o.map(ruby), correct: q.a, explain: q.en + ' ' + q.explain };
  } else if (q.m === 'order') {
    var os = it(q.s);
    ex = Object.assign(orderQuestion(os, tk, q.star, q.o), { itemId: os.id, explain: os.jp + ' "' + os.en + '"' });
  } else if (q.m === 'iikae') {
    var im = it(q.item);
    ex = Object.assign(iikaeQuestion(im, tk, q.o), { itemId: im.id, explain: im.underline + ' → ' + im.options[im.answer] + ' "' + im.en + '"' + (im.notes ? ' ' + im.notes : '') });
  } else if (q.m === 'bunshou') {
    var bm = it(q.item), b = bm.blanks[q.blank - 1];
    ex = Object.assign(bunshouQuestion(bm, q.blank, tk, q.o), { itemId: bm.id, explain: '(' + q.blank + ') ' + b.options[b.answer] + '. "' + bm.en + '"' + (bm.notes ? ' ' + bm.notes : '') });
  } else if (q.m === 'reading') {
    ex = readingQuestion(it(q.p), q.q, tk, q.o);
  } else if (q.m === 'listening') {
    ex = listenQuestion(it(q.l), tk, { mock: true });
  }
  return Object.assign(ex, { mondai: mondaiKey(q), form: ex.form || q.m, recall: false });
}
// mockSections(mock) → [{ key, name, en, seconds, questions: [exercise] }] in test order.
function mockSections(mock) {
  var tk = levelKanji(mock.level);
  return MOCK_SECTIONS.map(function (s) {
    var qs = mock.sections[s.key].map(function (q) { return mockQuestion(q, tk); });
    return Object.assign({}, s, { questions: qs, seconds: quizSeconds(qs) });
  });
}

// mockSteps(sections, phase, sec) → { label, note, steps: [{ state: done|live|later, n, key, side }] } for the
// start ('intro', part 1 live) and between-parts ('between', `sec` = 0-based next part) screens.
function mockSteps(sections, phase, sec) {
  var live = phase === 'intro' ? 0 : sec;
  return {
    label: phase === 'intro' ? 'Three parts, one at a time' : 'Part ' + sec + ' done',
    note: phase === 'intro'
      ? 'Each part has its own clock, and it can’t be paused. Rest between parts if you like. The next clock starts only when you press Start.'
      : 'Rest if you need to. The clock for part ' + (sec + 1) + ' starts when you press Start.',
    steps: sections.map(function (s, i) {
      var state = i < live ? 'done' : i === live ? 'live' : 'later';
      return { state: state, n: i + 1, key: s.key,
        side: state === 'live' ? 'Start part ' + (i + 1) : state === 'done' ? 'Done' : 'Starts after part ' + i };
    })
  };
}

// mockEstimate(p, level): estimated scaled scores from raw accuracy (0-1) per part
// { vocab, grammar, reading, listening }. Linear proxy (labelled an estimate in the UI): the
// real test scores answer patterns with IRT and equates sessions, so no exact conversion
// exists. 言語知識・読解 (0-120) weights the three parts by their official N5 item counts
// (21 / 17 / 5), so a short diagnostic counts each part as much as the real test does:
//   lkr = 120 × (21·vocab + 17·grammar + 5·reading) / 43,  listening = 60 × listening,
// each rounded; pass = total ≥ 80 and lkr ≥ 38 and listening ≥ 19 (JLPT_PASS).
function mockEstimate(p, level) {
  var rule = JLPT_PASS[level || 'N5'];
  var lkr = Math.round(120 * (21 * p.vocab + 17 * p.grammar + 5 * p.reading) / 43);
  var lis = Math.round(60 * p.listening);
  return { lkr: lkr, listening: lis, total: lkr + lis, passed: lkr + lis >= rule.total && lkr >= rule.lkr && lis >= rule.listening };
}
// wilson(k, n, z): Wilson score interval [lo, hi] (0-1) for k right of n; z 1.28 = an 80% interval.
// Sane at 0% / 100% and on a few questions. n = 0 → [0, 1] (nothing asked, anything is possible).
function wilson(k, n, z) {
  if (!n) return [0, 1];
  z = z || 1.28;
  var p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d,
    h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
// mockOutlook(parts, level): the estimate as a range plus a verdict (ticket 48; research .scratch/roadmap/
// research/jlpt-scoring.md §6). parts = a result's { vocab | grammar | reading | listening: [right, total] }.
// Each part's accuracy gets a Wilson interval; both ends go through the same linear scaling as mockEstimate,
// so { lkr, listening, total } are [low, high] pairs (sections sum, which is wider than the truth: the
// safe direction). verdict: 'likely' when the LOW end clears the total mark and both section minimums,
// 'unlikely' when the HIGH end misses the total mark or either minimum, else 'borderline'.
function mockOutlook(parts, level) {
  var rule = JLPT_PASS[level || 'N5'];
  var band = function (k) { return wilson(parts[k][0], parts[k][1]); };
  var scaled = function (i) {
    var v = band('vocab')[i], g = band('grammar')[i], r = band('reading')[i];
    return { lkr: Math.round(120 * (21 * v + 17 * g + 5 * r) / 43), listening: Math.round(60 * band('listening')[i]) };
  };
  var lo = scaled(0), hi = scaled(1);
  var out = { lkr: [lo.lkr, hi.lkr], listening: [lo.listening, hi.listening], total: [lo.lkr + lo.listening, hi.lkr + hi.listening] };
  out.verdict = out.total[0] >= rule.total && lo.lkr >= rule.lkr && lo.listening >= rule.listening ? 'likely'
    : out.total[1] < rule.total || hi.lkr < rule.lkr || hi.listening < rule.listening ? 'unlikely' : 'borderline';
  return out;
}
// mockResult(mock, sections, answers, now) → the mock:<mockId>:<takenAt> doc body.
// answers[sectionKey][i] = chosen option index, or null (unanswered or out of time = wrong).
// parts: { vocab | grammar | reading | listening: [right, total] }; byMondai: { key: [right, total] }.
function mockResult(mock, sections, answers, now) {
  var parts = { vocab: [0, 0], grammar: [0, 0], reading: [0, 0], listening: [0, 0] }, byMondai = {};
  sections.forEach(function (s) {
    s.questions.forEach(function (ex, i) {
      var ok = answers[s.key][i] === ex.correct ? 1 : 0;
      var part = s.key === 'grammar' && ex.type === 'reading' ? 'reading' : s.key;
      parts[part][0] += ok; parts[part][1]++;
      var m = byMondai[ex.mondai] || (byMondai[ex.mondai] = [0, 0]);
      m[0] += ok; m[1]++;
    });
  });
  var acc = {};
  Object.keys(parts).forEach(function (k) { acc[k] = parts[k][1] ? parts[k][0] / parts[k][1] : 0; });
  return { mockId: mock.id, takenAt: now, parts: parts, byMondai: byMondai, answers: answers, estimate: mockEstimate(acc, mock.level) };
}

// Attempts (ticket 49). A mock doc is write-once, so "practice" is derived: the first sitting of a mock
// (by takenAt) is the real attempt, every later sitting of the same mock is practice (the questions are
// known by then). Practice never becomes the headline estimate; the trend chart still plots it, hollow.
// mockAttempts(mocks) → [{ doc, n (1-based per mockId), practice }], oldest first.
function mockAttempts(mocks) {
  var seen = {};
  return (mocks || []).slice().sort(function (a, b) { return a.takenAt - b.takenAt; }).map(function (d) {
    var n = seen[d.mockId] = (seen[d.mockId] || 0) + 1;
    return { doc: d, n: n, practice: n > 1 };
  });
}
// mockIsPractice(mocks, doc): doc (saved or just finished) is not the first sitting of its mock.
function mockIsPractice(mocks, doc) {
  return (mocks || []).some(function (m) { return m.mockId === doc.mockId && m.takenAt < doc.takenAt; });
}
// mockHeadline(mocks, mockId): the first attempt's doc, or null.
function mockHeadline(mocks, mockId) {
  var first = mockAttempts((mocks || []).filter(function (m) { return m.mockId === mockId; }))[0];
  return first ? first.doc : null;
}
// mockTrend(mocks, level) → { pass, points: [{ takenAt, mockId, total, passed, practice }] } oldest first.
function mockTrend(mocks, level) {
  return { pass: JLPT_PASS[level || 'N5'].total, points: mockAttempts(mocks).map(function (a) {
    return { takenAt: a.doc.takenAt, mockId: a.doc.mockId, total: a.doc.estimate.total, passed: a.doc.estimate.passed, practice: a.practice };
  }) };
}

// The running mock attempt (resume after a reload). Device-only like RECENT_Q_KEY: never synced, never exported.
// { mockId, phase: 'part' | 'between', sec, cur, deadline, answers, flags, plays, at }
var MOCK_RUN_KEY = 'jlpt_mock_run';
function mockRunLoad(mockId) {
  try {
    var r = JSON.parse(localStorage.getItem(MOCK_RUN_KEY) || 'null');
    return r && r.mockId === mockId && (r.phase === 'part' || r.phase === 'between') && r.answers ? r : null;
  } catch (e) { return null; }
}
function mockRunSave(run) { try { localStorage.setItem(MOCK_RUN_KEY, JSON.stringify(run)); } catch (e) {} }
function mockRunClear() { try { localStorage.removeItem(MOCK_RUN_KEY); } catch (e) {} }

// prepDrill(unit): a prep unit's timed section drill (unit.drill = { blueprint key: count }):
// `count` catalog items per mondai, random each time, in test order. Passages, listening items
// and authored mondai that a mock uses are left out, so the mocks stay unseen.
function prepDrill(unit) {
  var ctx = quizContext(unit), skip = mockItemIds(), out = [];
  var fresh = function (xs) { return rndShuffle(xs.filter(function (x) { return !skip[x.id]; })); };
  var order = ['kanjiYomi', 'hyouki', 'bunmyaku', 'iikae', 'gap', 'order', 'bunshou', 'short', 'mid', 'info', 'task', 'point', 'utterance', 'quick'];
  order.forEach(function (key) {
    var n = (unit.drill || {})[key];
    if (!n) return;
    var got = 0, add = function (qs) { if (qs.length && got < n) { out = out.concat(qs); got++; } };
    if (key === 'iikae' || key === 'bunshou') {
      fresh(catalogOf('mondai').filter(function (m) { return m.type === key; })).forEach(function (m) { add(mondaiQuestions(key, m, ctx)); });
    } else if (['short', 'mid', 'info'].indexOf(key) >= 0) {
      fresh(passagesFor(unit.level, key)).forEach(function (p) { add(p.questions.map(function (_, i) { return readingQuestion(p, i, ctx.taughtKanji); })); });
    } else if (LISTEN_PROMPTS[key]) {
      fresh(listeningFor(unit.level, key)).forEach(function (l) { add([listenQuestion(l, ctx.taughtKanji, { mock: true })]); });
    } else {
      var kind = MONDAI[key].section === 'bunpou' ? 'grammar' : 'vocab';
      fresh(catalogOf(kind).filter(function (x) { return x.level === unit.level && !x.alt; })).forEach(function (x) {
        if (got < n) add(mondaiQuestions(key, x, ctx));
      });
    }
  });
  return out;
}

// chunkSpeech(text, max): split a line for speech synthesis at sentence ends, then commas /
// spaces, so no utterance runs long (Chrome's network voices stop after ~15 s). Pieces are
// merged back up to max characters; a piece with no break point is cut hard.
var SPEECH_CHUNK = 40; // ~10 s of Japanese at 0.5× rate; network voices only (local ones have no limit)
var SPEECH_CHUNK_LOCAL = 400;
function chunkSpeech(text, max) {
  max = max || SPEECH_CHUNK;
  var pieces = (text.match(/[^。！？!?]+[。！？!?]*/g) || []).reduce(function (acc, s) {
    if (s.length <= max) return acc.concat([s]);
    var parts = s.match(/[^、　 ]+[、　 ]*/g) || [s];
    return acc.concat([].concat.apply([], parts.map(function (p) {
      var cut = [];
      for (var i = 0; i < p.length; i += max) cut.push(p.slice(i, i + max));
      return cut;
    })));
  }, []);
  var out = [];
  pieces.forEach(function (p) {
    if (out.length && (out[out.length - 1] + p).length <= max) out[out.length - 1] += p;
    else out.push(p);
  });
  return out.map(function (s) { return s.trim(); }).filter(Boolean);
}

// assignVoices(voices): speaker → { voice, pitch } for M (man), F (woman), N (narrator).
// Two different ja voices when there are (by name: a male-named voice for M, a female-named one
// for F), else the same voice with pitch 0.8 (M) / 1.25 (F); a voice already of that gender keeps
// pitch 1. Local voices first: network ones (Chrome's Google voice) cut out on long lines.
// Narrator (the exam's instruction voice, never an actor): a third ja voice (female-named first),
// else F's voice at pitch 0.85 so it still sounds like someone else. No ja voice: voice null,
// pitches only (the browser picks a voice from lang).
// ponytail: gender by voice name (Edge names its Natural voices in kanji: 七海 = Nanami, 圭太 = Keita); an unknown name just gets the pitch split.
var JA_MALE_VOICE = /ichiro|keita|otoya|hattori|daichi|naoki|takumi|masaru|圭太|一郎|直樹|大智|拓海|male|男性/i;
var JA_FEMALE_VOICE = /haruka|ayumi|nanami|kyoko|sayaka|o-ren|mizuki|aoi|shiori|mayu|七海|晴香|美月|葵|google|female|女性/i;
function assignVoices(voices) {
  var ja = (voices || []).filter(function (v) { return /^ja/i.test(v.lang || ''); })
    .sort(function (a, b) { return (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
  var isMale = function (v) { return !!v && JA_MALE_VOICE.test(v.name) && !/female/i.test(v.name); };
  var isFemale = function (v) { return !!v && JA_FEMALE_VOICE.test(v.name); };
  var m = ja.filter(isMale)[0], f = ja.filter(function (v) { return v !== m && isFemale(v); })[0];
  var other = function (not) { return ja.filter(function (v) { return v !== not; })[0] || not; };
  if (!m && !f) { m = ja[0]; f = ja[1] || ja[0]; } else if (!f) f = other(m); else if (!m) m = other(f);
  var rest = ja.filter(function (v) { return v !== m && v !== f; });
  var n = rest.filter(isFemale)[0] || rest.filter(function (v) { return !isMale(v); })[0] || rest[0];
  return {
    M: { voice: m || null, pitch: isMale(m) ? 1 : 0.8 },
    F: { voice: f || null, pitch: isFemale(f) && f !== m ? 1 : 1.25 },
    N: n ? { voice: n, pitch: 1 } : { voice: f || null, pitch: f ? 0.85 : 1 }
  };
}

// requeueExercise(unit, ex): a missed question asked again at the end of the
// quiz (Q31), same item in another form when there is one. Not scored.
function requeueExercise(unit, ex) {
  var o = ex.type === 'reading' && rndShuffle(ex.options.map(function (_, i) { return i; })); // same question, options reshuffled
  var r = o ? Object.assign({}, ex, { options: o.map(function (i) { return ex.options[i]; }), optionParts: o.map(function (i) { return ex.optionParts[i]; }), correct: o.indexOf(ex.correct) })
    : ex.type === 'listen_dialog' ? listenQuestion(CATALOG.items[ex.itemId], quizContext(unit).taughtKanji, { mock: ex.maxPlays > 0 })
    : ex.item && makeQuestion(ex.item, quizContext(unit), null, [ex.form], false, ex.part);
  return r ? Object.assign(r, { requeue: true }) : null;
}

// answerIsRight(ex, response): response = option index (MC), picks (pair_match:
// option index per item; reorder: item indexes in order) or typed text.
function answerIsRight(ex, resp) {
  if (ex.type === 'pair_match') {
    var meaningOf = {};
    (ex.pairs || []).forEach(function (p) { meaningOf[p[0]] = p[1]; });
    return Array.isArray(resp) && ex.items.every(function (w, i) { return typeof resp[i] === 'number' && ex.options[resp[i]] === meaningOf[w]; });
  }
  if (ex.type === 'reorder') return Array.isArray(resp) && resp.map(function (i) { return ex.items[i]; }).join('') === ex.answer;
  if (ex.options && typeof ex.correct === 'number') return resp === ex.correct;
  if (ex.romaji) return romajiMatches(resp, ex.romaji); // a kana word typed in romaji: exact
  // ponytail: romaji answers (kana items) go through the English path too; at ≤ 3 letters no typo
  // or plural rule can fire on them
  return checkTyping(String(resp == null ? '' : resp), ex.answers, englishPool());
}

// scoreQuiz(kind, exs, results): results[i] = was exs[i] right. Score = first
// attempts (re-queued questions don't count); missed = items answered wrong
// on any attempt (flagged for SRS).
// A kana quiz (questions tagged with part, ticket 44) is split: split = { read, meaning } each
// { right, total, need }; reading (single kana + kana words) needs 85%, meanings of taught words
// 80%, and it passes only when both parts do (a part with no questions passes).
function scoreQuiz(kind, exs, results) {
  var right = 0, total = 0, missed = [], parts = null;
  exs.forEach(function (e, i) {
    if (i >= results.length) return;
    if (!e.requeue) {
      total++;
      if (results[i]) right++;
      if (e.part) {
        parts = parts || { read: { right: 0, total: 0, need: KANA_READ_PASS }, meaning: { right: 0, total: 0, need: KANA_MEANING_PASS } };
        parts[e.part].total++;
        if (results[i]) parts[e.part].right++;
      }
    }
    if (!results[i] && e.itemId && missed.indexOf(e.itemId) < 0) missed.push(e.itemId);
  });
  var ok = function (p) { return !p.total || p.right / p.total >= p.need - 1e-9; };
  var passed = parts ? total > 0 && ok(parts.read) && ok(parts.meaning) : quizPassed(right, total, kind);
  return { right: right, total: total, need: passMark(kind), passed: passed, missed: missed, split: parts };
}
// NFKC folds full-width romaji/digits/punctuation to half-width, half-width
// katakana to full-width, and composes combining marks (か+゙ → が).
// Hiragana and katakana stay distinct on purpose: wrong script = wrong answer.
function foldAns(s) {
  return s.normalize('NFKC').trim().toLowerCase();
}
function normAns(s) {
  return foldAns(s).replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~\\]/g, '').trim();
}
// ── English answers (ticket 41) ─────────────────────────────────────────────
// normEn(s): an English answer reduced to what matters: lower case, no accents, punctuation or
// parenthetical, hyphens as spaces, no leading article / "to ", British spellings folded to
// American (colour → color, -ise → -ize, theatre → theater). Applied to both sides.
var EN_SPELLING = [
  [/([a-z]{2})our(s|ite|ites|able|ed|ing|er|ers|hood|hoods)?\b/g, '$1or$2'], [/([a-z]{2})tre(s?)\b/g, '$1ter$2'],
  [/([a-z]{2})is(e|es|ed|ing|ation|ations)\b/g, '$1iz$2'], [/([a-z])ys(e|es|ed|ing)\b/g, '$1yz$2'],
  [/\b(travel|cancel|jewel|model|label)l(ed|ing|er|ers)\b/g, '$1$2'], [/\bgrey/g, 'gray'], [/\bprogramme/g, 'program'],
  [/\baeroplane/g, 'airplane'], [/\bstorey/g, 'story'], [/\btyre/g, 'tire'], [/\bpyjama/g, 'pajama'], [/\bpractise/g, 'practice'],
  [/\bmum(s?)\b/g, 'mom$1'], [/\bcheque/g, 'check']
];
var _enMemo = {};
function normEn(s) {
  if (_enMemo[s] !== undefined) return _enMemo[s];
  var t = String(s).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\([^)]*\)/g, ' ')
    .replace(/['’]/g, '').replace(/[-_/]/g, ' ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  while (/^(to|a|an|the) ./.test(t)) t = t.replace(/^(to|a|an|the) /, '');
  EN_SPELLING.forEach(function (r) { t = t.replace(r[0], r[1]); });
  return (_enMemo[s] = t);
}
// enStem: plural -s / -es / -ies off every word (boxes → box, cities → city, glasses → glass).
function enStem(s) {
  return s.split(' ').map(function (w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (/(s|x|z|ch|sh)es$/.test(w)) return w.slice(0, -2);
    return w.length > 3 && /[^su]s$/.test(w) && !/is$/.test(w) ? w.slice(0, -1) : w;
  }).join(' ');
}
// osaDistance: edit distance counting a swap of two neighbours as one edit (hosue → house).
function osaDistance(a, b) {
  var d = [], i, j;
  for (i = 0; i <= a.length; i++) { d[i] = [i]; }
  for (j = 0; j <= b.length; j++) d[0][j] = j;
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      var c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}
// typoTolerance(answer): edits forgiven for a normalised answer: 1 from 5 letters, 2 from 10.
function typoTolerance(a) { var n = a.replace(/ /g, '').length; return n >= 10 ? 2 : n >= 5 ? 1 : 0; }
var _rejectMemo = { src: null, set: null };
// enSet(list): { normalised and stemmed form: true } of English strings (split on / and ,).
function enSet(list) {
  if (_rejectMemo.src === list) return _rejectMemo.set;
  var set = {};
  (list || []).forEach(function (s) {
    String(s).split(/[\/,]/).forEach(function (p) { var n = normEn(p); if (n) { set[n] = true; set[enStem(n)] = true; } });
  });
  _rejectMemo = { src: list, set: set };
  return set;
}
// englishPool(): every English meaning the catalog teaches (vocab gloss + accept, kanji meaning +
// accept), the reject set for typed English answers. Built once.
var _englishPool = null;
function englishPool() {
  if (_englishPool) return _englishPool;
  var out = [];
  catalogOf('vocab').forEach(function (v) { out.push.apply(out, meaningAnswers(v.gloss).concat(v.accept || [])); });
  catalogOf('kanji').forEach(function (k) { out.push.apply(out, meaningAnswers(k.meaning || []).concat(k.accept || [])); });
  return (_englishPool = out);
}

// checkTyping(typed, answers, reject?): exact (case, width, punctuation, / and , alternatives)
// for every answer. English answers also match after normEn, with the space dropped
// (well-lit / welllit), as a plural, or with a typo (typoTolerance) — but never when the typed
// text is the meaning of something else (reject: English strings, e.g. englishPool()).
// Kana answers stay exact: hiragana and katakana are different answers.
function checkTyping(userAns, answers, reject) {
  if (userAns.length > 200) return false;
  var u = foldAns(userAns);
  var uNorm = normAns(userAns);
  if (!answers || !answers.length) return false;
  var exact = answers.some(function (a) {
    if (typeof a !== 'string') return false;
    // split before folding so full-width ／ ， in an answer stay literal, as before
    var parts = a.split(/[\/,]/).map(foldAns);
    var partsNorm = a.split(/[\/,]/).map(function (s) {
      return normAns(s);
    });
    return foldAns(a) === u || parts.includes(u) || partsNorm.includes(uNorm);
  });
  if (exact) return true;
  var en = answers.filter(function (a) { return typeof a === 'string' && !JA_CHARS.test(a); });
  if (!en.length || JA_CHARS.test(userAns)) return false;
  var n = normEn(userAns), ns = enStem(n);
  if (!n) return false;
  var forms = [].concat.apply([], en.map(function (a) { return a.split(/[\/,]/); })).map(normEn).filter(Boolean);
  var flat = function (s) { return s.replace(/ /g, ''); };
  if (forms.some(function (f) { return f === n || flat(f) === flat(n); })) return true;
  var own = {}, ownStem = {};
  forms.forEach(function (f) { own[f] = true; ownStem[enStem(f)] = true; });
  var rej = enSet(reject);
  if ((rej[n] && !own[n]) || (rej[ns] && !ownStem[ns])) return false; // someone else's meaning (news ≠ new)
  return forms.some(function (f) {
    var fs = enStem(f), tol = typoTolerance(f);
    return fs === ns || (tol > 0 && (osaDistance(n, f) <= tol || osaDistance(ns, fs) <= tol));
  });
}
// acceptedAnswers(ex): a typed question's answers as shown after a miss, one per meaning
// (to see (a person) and its derived "see" count once).
function acceptedAnswers(ex) {
  var seen = {}, out = [];
  (ex.answers || []).forEach(function (a) {
    var k = JA_CHARS.test(a) ? kataToHira(a) : normEn(a);
    if (!seen[k]) { seen[k] = true; out.push(a); }
  });
  return out;
}
// otherReading(ex, typed): the homograph whose reading was typed (人 → じん when ひと is asked),
// or null. Not a miss: the learner is told which word is meant and tries again (ex.others, set
// by formsFor on kana-answer questions about a word that shares its spelling).
function otherReading(ex, typed) {
  if (!ex.others || !ex.others.length) return null;
  var s = String(typed == null ? '' : typed);
  if (checkTyping(s, ex.answers)) return null;
  var u = kataToHira(foldAns(s));
  return ex.others.filter(function (o) { return o.reading === u; })[0] || null;
}
function otherReadingNote(ex, o) {
  var it = ex.item || {};
  return o.reading + ' is a reading of ' + o.word + ' too, as in "' + o.gloss + '". This question wants ' + o.word +
    (it.gloss ? ' meaning "' + glossText(it) + '"' : '') + '. Try again.';
}

// ── Storage helpers ──────────────────────────────────────────────────────────
function storageAvailable() {
  try {
    var test = '__storage_test__';
    localStorage.setItem(test, '1');
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// safeSave: wraps localStorage.setItem; dispatches 'storage-save-error' event on failure.
// Returns { ok: boolean, error: string|null }.
function safeSave(key, value) {
  try {
    localStorage.setItem(key, value);
    return { ok: true, error: null };
  } catch (e) {
    var msg = e && e.message ? e.message : String(e);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('storage-save-error', { detail: msg }));
    }
    return { ok: false, error: msg };
  }
}

// ── Theme preferences ────────────────────────────────────────────────────────
// Palette ids match the :root[data-palette] blocks in styles.css.
var THEME_PALETTES = [
  { id: 'shu',      k: '朱墨', name: 'Shu & Sumi' },
  { id: 'ai',       k: '藍染', name: 'Aizome' },
  { id: 'matcha',   k: '抹茶', name: 'Matcha' },
  { id: 'yozakura', k: '夜桜', name: 'Yozakura' },
  { id: 'kokuban',  k: '黒板', name: 'Kokuban' }
];
// normalizeThemePrefs: coerces stored (possibly null/garbage) values to a
// valid { palette, theme }. Default = Kokuban dark.
function normalizeThemePrefs(palette, theme) {
  var known = THEME_PALETTES.some(function (p) { return p.id === palette; });
  return { palette: known ? palette : 'kokuban', theme: theme === 'light' ? 'light' : 'dark' };
}

// ── SVG sanitization ─────────────────────────────────────────────────────────
// Strips XSS vectors from untrusted SVG strings before injecting into the DOM.
// Regex-based (no DOMParser) so it works headlessly in Node test environments.
function sanitizeSvg(raw) {
  if (!raw || typeof raw !== 'string') return '';
  var out = raw;
  // Remove <script> blocks
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove event handler attributes (onclick, onload, onerror, …)
  out = out.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove <foreignObject> blocks (can embed arbitrary HTML)
  out = out.replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
  // Remove javascript: href values
  out = out.replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, '');
  // Remove <use> tags referencing external URLs (SVG sprite injection)
  out = out.replace(/<use[^>]*(?:href|xlink:href)\s*=\s*["'][^"']*:\/\/[^"']*["'][^>]*>/gi, '');
  return out;
}

// ── SRS: SM-2 ───────────────────────────────────────────────────────────────
// Cards persist via Store (store.js) as `card:<itemId>` docs.
// srsAddCards(unit, cards): one card per catalog item, keyed by item id (Q10),
// so the same word in two units is one card. Existing cards are never touched.
// Returns true when any card was added.
function srsAddCards(unit, cards) {
  return admitCards(unitItems([unit]), cards, [], Infinity, Date.now()).added > 0;
}
// newCard(item, now): a fresh SRS card (due now); addedAt feeds the daily cap.
function newCard(it, now) {
  var f = it.kind === 'vocab' ? { type: 'vocab', front: it.word, back: glossText(it), reading: it.reading }
    : it.kind === 'kanji' ? { type: 'kanji', front: it.char, back: it.meaning.join(', '), reading: kanjiReadings(it).join('・') }
    : it.kind === 'grammar' ? { type: 'grammar', front: it.pattern, back: it.meaning }
    : { type: 'kana', front: it.char, back: it.romaji };
  return Object.assign({ id: it.id }, f, { interval: 1, ease: 2.5, due: now, reps: 0, addedAt: now });
}
// ── New-card cap (Q34) ──────────────────────────────────────────────────────
// admitCards(items, cards, pending, room, now): adds cards for the pending ids
// (oldest first), then for items without a card, up to `room` new cards
// (mutates cards). → { pending: ids still waiting, added }. Pending ids missing
// from the catalog are dropped.
function admitCards(items, cards, pending, room, now) {
  var byId = {}, queue = [], rest = [], added = 0;
  items.forEach(function (it) { byId[it.id] = it; });
  pending.concat(items.map(function (it) { return it.id; })).forEach(function (id) {
    if (!cards[id] && queue.indexOf(id) < 0) queue.push(id);
  });
  queue.forEach(function (id) {
    var it = byId[id] || CATALOG.items[id];
    if (!it) return;
    if (added < room) { cards[id] = newCard(it, now); added++; } else rest.push(id);
  });
  return { pending: rest, added: added };
}
// cardsAddedToday: cards whose addedAt falls on now's local date.
function cardsAddedToday(cards, now) {
  var today = localDate(new Date(now));
  return Object.keys(cards).filter(function (id) {
    return cards[id].addedAt && localDate(new Date(cards[id].addedAt)) === today;
  }).length;
}
// dailyCardCap(pace, units, from): new cards per day = the items the pace's
// next units (from index `from`) introduce, at least DAILY_CARD_FLOOR.
// ponytail: floor = one kana unit, so short units or the plan's end never stall.
var DAILY_CARD_FLOOR = 10;
function dailyCardCap(pace, units, from) {
  return Math.max(DAILY_CARD_FLOOR, newCardCap(pace, units.slice(from)));
}
// srsFlagMissed(cards, ids, now): items missed in a quiz (Q31) come back
// sooner: due now (if later) and ease −0.2 (floor 1.3). Replaces the card
// objects (no mutation of the old ones). Returns true when any card changed.
function srsFlagMissed(cards, ids, now) {
  var changed = false;
  ids.forEach(function (id) {
    var c = cards[id];
    if (!c) return;
    cards[id] = Object.assign({}, c, { due: Math.min(c.due, now), ease: Math.max(1.3, Math.round((c.ease - 0.2) * 100) / 100) });
    changed = true;
  });
  return changed;
}
// srsPreview(card) → { again, hard, good, easy }: days until the next review for each rating.
// pass = the SM-2 pass interval (reps 0 → 1d, reps 1 → 6d, else round(interval × ease)).
// Good = pass; Hard = max(1, round(pass × 0.8)); Easy = max(pass + 1, round(pass × 1.3));
// Again = 1 (and the card starts over). srsReview takes its interval from here, so the
// preview on the buttons can never drift from what a rating does.
function srsPreview(card) {
  var pass = card.reps === 0 ? 1 : card.reps === 1 ? 6 : Math.round(card.interval * card.ease);
  return { again: 1, hard: Math.max(1, Math.round(pass * 0.8)), good: pass, easy: Math.max(pass + 1, Math.round(pass * 1.3)) };
}
function srsReview(card, quality) {
  var q = [0, 3, 4, 5][quality];
  var interval = card.interval,
    ease = card.ease,
    reps = card.reps;
  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    interval = srsPreview(card)[['again', 'hard', 'good', 'easy'][quality]];
    reps += 1;
  }
  ease = Math.max(1.3, ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  var due = Date.now() + interval * 86400000;
  return _objectSpread(_objectSpread({}, card), {}, {
    interval: interval,
    ease: ease,
    reps: reps,
    due: due,
    lastReviewedAt: Date.now() // merge key for card docs (pickStoreWinner)
  });
}
function srsDueCards(cards) {
  var now = Date.now();
  return Object.values(cards).filter(function (c) {
    return c.due <= now;
  });
}

// stageOf(id, units?) → the unit (stage) that teaches the item, or null. First unit in order wins.
function stageOf(id, units) {
  units = units || allUnits();
  for (var i = 0; i < units.length; i++) {
    if (unitItems([units[i]]).some(function (it) { return it.id === id; })) return units[i];
  }
  return null;
}
var EXAMPLE_MAX_UNTAUGHT = 2;
// cardExample(id, units?) → { s: sentence, at, end } | null: a catalog sentence for the card's back.
// Picks the sentence using the fewest items not yet taught by the item's stage (0 = all taught), then
// the shortest, then lowest id: deterministic. null for kana, items without a sentence, and when even
// the best one leans on more than EXAMPLE_MAX_UNTAUGHT items learned later.
// at/end = char range of the word in s.jp (vocab: wordSpan, else the word spelled exactly once; kanji: the
// char), or null when it can't be found once and unambiguously (grammar, inflected words).
function cardExample(id, units) {
  if (id.indexOf('v:') !== 0 && id.indexOf('k:') !== 0 && id.indexOf('g:') !== 0) return null;
  var stage = stageOf(id, units);
  if (!stage) return null;
  var known = taughtIds(stage), best = null, bestKey = null;
  sentencesUsing(id).forEach(function (s) {
    var miss = untaughtCount(s, known);
    var key = [miss, s.jp.length, s.id];
    if (!bestKey || key[0] < bestKey[0] || (key[0] === bestKey[0] && (key[1] < bestKey[1] || (key[1] === bestKey[1] && key[2] < bestKey[2])))) { best = s; bestKey = key; }
  });
  if (!best || bestKey[0] > EXAMPLE_MAX_UNTAUGHT) return null;
  var it = CATALOG.items[id], span = null;
  if (it && it.kind === 'vocab') {
    span = best.furigana ? wordSpan(furiganaParts(best.furigana), it.word, it.reading) : null;
    if (!span && best.jp.indexOf(it.word) >= 0 && best.jp.indexOf(it.word, best.jp.indexOf(it.word) + 1) < 0) {
      var a = best.jp.indexOf(it.word); span = { at: a, end: a + it.word.length };
    }
  } else if (it && it.kind === 'kanji') {
    var k = best.jp.indexOf(it.char);
    if (k >= 0 && best.jp.indexOf(it.char, k + 1) < 0) span = { at: k, end: k + 1 };
  }
  return { s: best, at: span ? span.at : null, end: span ? span.end : null };
}

// ── Already-known import (ticket 37, Q35) ───────────────────────────────────
// Learners who already know items seed them as "known" cards: the known button
// in review, a quick-sort session per level, or a pasted / uploaded text list.
// A known card: interval KNOWN_MIN_DAYS–KNOWN_MAX_DAYS, reps 2 (so a pass grows
// it by ease, a miss lapses it like any card: the first review is a real test),
// lastReviewedAt 0, no addedAt (not counted against the daily new-card cap),
// imported: { source, at, batchId, prior? } (prior = the unreviewed card it
// replaced, put back on undo).
var KNOWN_MIN_DAYS = 21, KNOWN_MAX_DAYS = 28;
// Daily review budget = REVIEW_BUDGET_FACTOR × the daily new-card cap
// (dailyCardCap, Q34): each new card costs ~5 reviews in its first weeks, so a
// day at full pace already sees about that many. Seeded cards fill a day only up
// to the budget minus what is already due that day; the rest move later.
var REVIEW_BUDGET_FACTOR = 5;
function reviewBudget(newCap) { return REVIEW_BUDGET_FACTOR * newCap; }
function hasRealReviews(c) { return !!(c && (c.reps > 0 || c.lastReviewedAt)); }
// seedKnownCards(itemIds, cards, now, opts) → { added, replaced, skipped } (id
// lists); mutates cards. opts: { source, batchId, budget (due cards per day),
// rnd (test hook, default Math.random) }. Spread: each card draws a day in
// [KNOWN_MIN_DAYS, KNOWN_MAX_DAYS]; while that day already holds `budget` due
// cards (existing + seeded), it moves to the next day. Due = local midnight.
// Skipped: unknown ids and cards with real reviews (reps > 0 or reviewed once),
// which includes cards already seeded as known.
function seedKnownCards(itemIds, cards, now, opts) {
  var rnd = opts.rnd || Math.random, budget = Math.max(1, opts.budget || 1);
  var today = dayStart(now, 0), load = {};
  Object.keys(cards).forEach(function (id) {
    var d = Math.round((dayStart(cards[id].due, 0) - today) / 86400000);
    load[d] = (load[d] || 0) + 1;
  });
  var out = { added: [], replaced: [], skipped: [] };
  itemIds.forEach(function (id) {
    var it = CATALOG.items[id], cur = cards[id];
    if (!it || hasRealReviews(cur) || out.added.indexOf(id) >= 0 || out.replaced.indexOf(id) >= 0) {
      out.skipped.push(id);
      return;
    }
    var d = KNOWN_MIN_DAYS + Math.floor(rnd() * (KNOWN_MAX_DAYS - KNOWN_MIN_DAYS + 1));
    while ((load[d] || 0) >= budget) d++;
    load[d] = (load[d] || 0) + 1;
    var c = newCard(it, now);
    delete c.addedAt;
    var imported = { source: opts.source, at: now, batchId: opts.batchId };
    if (cur) { imported.prior = cur; out.replaced.push(id); } else out.added.push(id);
    cards[id] = Object.assign(c, { interval: d, reps: 2, due: dayStart(now, d), lastReviewedAt: 0, imported: imported });
  });
  return out;
}
// undoImport(batchId, cards, ids?) → { removed, restored, skipped }; mutates
// cards. Takes back the batch's cards (only `ids` of them when given): a card
// that replaced one goes back to it, others are removed. Cards reviewed since
// the import are kept (skipped): reviews are truth.
function undoImport(batchId, cards, ids) {
  var out = { removed: [], restored: [], skipped: [] };
  Object.keys(cards).forEach(function (id) {
    var c = cards[id];
    if (!c.imported || c.imported.batchId !== batchId || (ids && ids.indexOf(id) < 0)) return;
    if (c.lastReviewedAt) { out.skipped.push(id); return; }
    if (c.imported.prior) { cards[id] = c.imported.prior; out.restored.push(id); } else { delete cards[id]; out.removed.push(id); }
  });
  return out;
}
// importBatches(cards) → [{ batchId, source, at, count, reviewed }], newest first.
function importBatches(cards) {
  var by = {};
  Object.keys(cards).forEach(function (id) {
    var im = cards[id].imported;
    if (!im || !im.batchId) return;
    var b = by[im.batchId] || (by[im.batchId] = { batchId: im.batchId, source: im.source, at: im.at, count: 0, reviewed: 0 });
    b.count++;
    if (cards[id].lastReviewedAt) b.reviewed++;
    if (im.at < b.at) b.at = im.at;
  });
  return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return b.at - a.at; });
}
// knownCount(items, cards): how many of the items were seeded as already known.
function knownCount(items, cards) {
  return items.filter(function (it) { return cards[it.id] && cards[it.id].imported; }).length;
}
// quickSortItems(units, level): the kana / vocab / kanji the level's units teach,
// in teaching order. Grammar is left out: a pattern can't be judged known in a
// second, and a wrong "known" hides it for weeks.
function quickSortItems(units, level) {
  return unitItems(units.filter(function (u) { return u.level === level; })).filter(function (it) {
    return it.kind !== 'grammar';
  });
}
// matchCatalogText(text) → item ids found in any text (Anki notes, a word list,
// a spreadsheet), in order of first appearance: vocab by longest match of its
// word or reading (readings of 2+ kana only: single kana match everywhere), a
// duplicate spelling counts as its `alt`; plus every catalog kanji character.
// ponytail: longest-match scan, no tokenizer; kana-only text can match words
// inside longer words. The preview lets the learner untick those.
var _matchIndex = null;
function matchIndex() {
  if (_matchIndex) return _matchIndex;
  var keys = {}, maxLen = 0;
  var put = function (k, id) {
    (keys[k] || (keys[k] = [])).indexOf(id) < 0 && keys[k].push(id);
    maxLen = Math.max(maxLen, k.length);
  };
  catalogOf('vocab').forEach(function (v) {
    var id = v.alt || v.id;
    put(v.word, id);
    if (v.reading.length >= 2) put(v.reading, id);
  });
  return (_matchIndex = { keys: keys, maxLen: maxLen });
}
function matchCatalogText(text) {
  var ix = matchIndex(), seen = {}, out = [];
  var add = function (id) { if (!seen[id]) { seen[id] = true; out.push(id); } };
  for (var i = 0; i < text.length;) {
    var hit = 0;
    for (var n = Math.min(ix.maxLen, text.length - i); n > 0 && !hit; n--) {
      var ids = ix.keys[text.substr(i, n)];
      if (ids) { ids.forEach(add); hit = n; }
    }
    for (var end = i + (hit || 1); i < end; i++) if (CATALOG.items['k:' + text.charAt(i)]) add('k:' + text.charAt(i));
  }
  return out;
}

// ── Store docs (synced learning data, persisted by store.js) ────────────────
// One doc per entity; every doc also carries updatedAt (ms) + deviceId.
//   unit:<unitId>   { done, completedAt (ms | null), skipped? }  skipped:true = done by placement,
//                   not by passing the quiz (ticket 38). Absent otherwise. It travels with done:true;
//                   a real quiz pass rewrites the doc without it, un-marking clears it. Merge: last write wins.
//   card:<itemId>   SRS card fields (id, type, front, back, reading?, interval,
//                   ease, due, reps) + lastReviewedAt (0 = never reviewed)
//                   + imported? { source, at, batchId, prior? } (seeded as
//                   already known, see seedKnownCards)
//   prefs:learning  { currentUnit (unit id | null), pace (units/day, default 1),
//                   examDate (null), furigana (true|false; null/absent = level-based),
//                   uiLang ('auto'|'en'|'ja'), kanjiView ('rows'|'focus', lesson
//                   Kanji layout, default rows), pendingCards ([item ids] passed
//                   but over the daily new-card cap, added on later days) }
//   log:<YYYY-MM-DD>:<deviceId>   dated activity log, one doc per local date per
//                   device: { date, lessons: [unit ids marked done], quizzes:
//                   [{ unit, right, total, at }], reviews: { count, again } }.
//                   Append-only within the day; only its own device writes it,
//                   so devices never conflict; two tabs can, and are merged
//                   field-wise (mergeLogDocs).
//                   Readers aggregate across devices and treat missing fields
//                   as empty, so fields can be added without migration.
//   mock:<mockId>:<takenAt ms>   one taken mock exam (ticket 18, mockResult): { mockId, takenAt,
//                   parts: { vocab | grammar | reading | listening: [right, total] }, byMondai:
//                   { mondai key: [right, total] }, answers: { section: [option index | null] },
//                   estimate: { lkr, listening, total, passed } }. Written once, never changed:
//                   the merge rule (last write wins) never has two versions to pick from.
//   ach:<id>        { unlockedAt (ms) }  one earned achievement (ticket 08). Sticky: written once by
//                   Store.putUnlocks, never deleted by evaluation, un-marking a unit or undoing an
//                   import; replaceAll keeps them. Merge: earliest unlockedAt wins (mergeAchDocs).
// Device-only prefs stay in localStorage and never become docs:
var DEVICE_PREF_KEYS = ['jlpt_palette', 'jlpt_theme', 'jlpt_tts_rate', 'jlpt_sfx_mute'];
var STORE_ID_RE = /^(unit:n[1-5]\.u\d{3}|card:(v:[^|\s]+\|[^|\s]+|k:\S+|g:[\w-]+|c:\S+)|prefs:learning|log:\d{4}-\d{2}-\d{2}:[\w-]+|mock:x:[\w-]+:\d+|ach:[\w-]+)$/;
var PREFS_DEFAULTS = { currentUnit: null, pace: 1, examDate: null, furigana: null, uiLang: 'en', kanjiView: 'rows' };

// ── Activity log (log:* docs) ───────────────────────────────────────────────
// localDate: the user's local calendar date as 'YYYY-MM-DD' (not UTC).
function localDate(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// normalizeLog: a log doc body with every field present (missing → empty).
function normalizeLog(log) {
  var r = log.reviews || {};
  return {
    date: log.date,
    lessons: (log.lessons || []).slice(),
    quizzes: (log.quizzes || []).map(function (q) { return Object.assign({}, q); }),
    reviews: { count: r.count || 0, again: r.again || 0 }
  };
}
function logDocs(docs) {
  return docs.filter(function (d) { return d._id && d._id.indexOf('log:') === 0; });
}
// aggregateLogs: log docs (any devices) → { date: { lessons: [unique unit ids],
// quizzes: [sorted by at], reviews: { count, again } } }.
function aggregateLogs(logs) {
  var out = {};
  logs.forEach(function (raw) {
    var l = normalizeLog(raw);
    var a = out[l.date] || (out[l.date] = { lessons: [], quizzes: [], reviews: { count: 0, again: 0 } });
    l.lessons.forEach(function (n) { if (a.lessons.indexOf(n) === -1) a.lessons.push(n); });
    a.quizzes = a.quizzes.concat(l.quizzes);
    a.reviews.count += l.reviews.count;
    a.reviews.again += l.reviews.again;
  });
  Object.keys(out).forEach(function (k) {
    out[k].lessons.sort();
    out[k].quizzes.sort(function (x, y) { return x.at - y.at; });
  });
  return out;
}
// studyDates: sorted unique dates with any activity.
function studyDates(logs) {
  var agg = aggregateLogs(logs);
  return Object.keys(agg).filter(function (k) {
    var a = agg[k];
    return a.lessons.length || a.quizzes.length || a.reviews.count;
  }).sort();
}
function dateToDayIndex(s) {
  var p = s.split('-');
  return Math.round(Date.UTC(+p[0], p[1] - 1, +p[2]) / 86400000);
}
// computeStreak(dates, today) → { current, longest }. `current` counts back
// from today, or from yesterday when today has no activity yet (so the streak
// doesn't read 0 in the morning). No streak freezes.
function computeStreak(dates, today) {
  var idx = dates.map(dateToDayIndex).sort(function (a, b) { return a - b; })
    .filter(function (n, i, arr) { return i === 0 || n !== arr[i - 1]; });
  var have = {};
  var longest = 0, run = 0;
  idx.forEach(function (n, i) {
    have[n] = true;
    run = i > 0 && n === idx[i - 1] + 1 ? run + 1 : 1;
    if (run > longest) longest = run;
  });
  var t = dateToDayIndex(today);
  var start = have[t] ? t : t - 1;
  var current = 0;
  while (have[start - current]) current++;
  return { current: current, longest: longest };
}
// firstQuizAttempts: { unitId: earliest quiz entry for that unit, across all logs }.
// Anti-farm rewards count first attempts only.
function firstQuizAttempts(logs) {
  var first = {};
  logs.forEach(function (l) {
    normalizeLog(l).quizzes.forEach(function (q) {
      if (!first[q.unit] || q.at < first[q.unit].at) first[q.unit] = q;
    });
  });
  return first;
}
// activityTotals: lifetime { lessons (distinct units marked done), quizzes,
// perfectQuizzes, reviews, overrides ("I was right" on a typed answer) }.
function activityTotals(logs) {
  var days = {}, t = { lessons: 0, quizzes: 0, perfectQuizzes: 0, reviews: 0, overrides: 0 };
  logs.forEach(function (raw) {
    var l = normalizeLog(raw);
    l.lessons.forEach(function (n) { days[n] = true; });
    t.quizzes += l.quizzes.length;
    t.overrides += l.quizzes.reduce(function (n, q) { return n + (q.overrides || 0); }, 0);
    t.perfectQuizzes += l.quizzes.filter(function (q) { return q.total > 0 && q.right === q.total; }).length;
    t.reviews += l.reviews.count;
  });
  t.lessons = Object.keys(days).length;
  return t;
}

// ── Stats view (SRS + activity) ─────────────────────────────────────────────
// Maturity stages by interval (Anki cutoffs): new = never reviewed, learning
// < 7 days, young 7–20, mature ≥ 21. A lapsed card (reps reset to 0) has a
// lastReviewedAt, so it counts as learning, not new.
var SRS_STAGES = ['new', 'learning', 'young', 'mature'];
var SRS_TYPES = ['kana', 'vocab', 'kanji', 'grammar'];
function cardStage(c) {
  if (!c.reps && !c.lastReviewedAt) return 0;
  return c.interval < 7 ? 1 : c.interval < 21 ? 2 : 3;
}
// srsStats(cards) → { total, new, learning, young, mature, byType: { kana, vocab,
// kanji, grammar: [new, learning, young, mature] } }.
function srsStats(cards) {
  var s = { total: 0, 'new': 0, learning: 0, young: 0, mature: 0, byType: {} };
  SRS_TYPES.forEach(function (ty) { s.byType[ty] = [0, 0, 0, 0]; });
  Object.keys(cards).forEach(function (id) {
    var c = cards[id], st = cardStage(c);
    s.total++;
    s[SRS_STAGES[st]]++;
    (s.byType[c.type] || (s.byType[c.type] = [0, 0, 0, 0]))[st]++;
  });
  return s;
}
// dayStart(now, offset): ms of local midnight `offset` days after now's date.
// Built from calendar fields, so DST days (23/25 h) stay one calendar day.
function dayStart(now, offset) {
  var d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (offset || 0)).getTime();
}
// dueForecast(cards, now, days) → { overdue: due before today's local midnight,
// perDay: [days] cards due on each local day from today (today includes cards
// due earlier today and later today) }. Cards due after the window are left out.
function dueForecast(cards, now, days) {
  days = days || 14;
  var bounds = [];
  for (var i = 0; i <= days; i++) bounds.push(dayStart(now, i));
  var out = { overdue: 0, perDay: bounds.slice(1).map(function () { return 0; }) };
  Object.keys(cards).forEach(function (id) {
    var due = cards[id].due;
    if (due < bounds[0]) { out.overdue++; return; }
    for (var j = 0; j < days; j++) if (due < bounds[j + 1]) { out.perDay[j]++; return; }
  });
  return out;
}
// reviewTotals(agg, from, to): summed reviews over day indexes [from, to].
function reviewTotals(agg, from, to) {
  var r = { reviews: 0, again: 0 };
  Object.keys(agg).forEach(function (date) {
    var n = dateToDayIndex(date);
    if (n < from || n > to) return;
    r.reviews += agg[date].reviews.count;
    r.again += agg[date].reviews.again;
  });
  return r;
}
// retention(logs, today, days) → { rate: 1 − again ÷ reviews over the last
// `days` days ending today ('YYYY-MM-DD'), or null with no reviews; reviews; again }.
function retention(logs, today, days) {
  var t = dateToDayIndex(today);
  var r = reviewTotals(aggregateLogs(logs), t - (days || 30) + 1, t);
  return { rate: r.reviews ? 1 - r.again / r.reviews : null, reviews: r.reviews, again: r.again };
}
// weeklyRetention(logs, today, weeks) → [weeks] rates, oldest first; each a
// 7-day window, the last one ending today. null for a week with no reviews.
function weeklyRetention(logs, today, weeks) {
  weeks = weeks || 12;
  var agg = aggregateLogs(logs), t = dateToDayIndex(today), out = [];
  for (var w = weeks - 1; w >= 0; w--) {
    var r = reviewTotals(agg, t - w * 7 - 6, t - w * 7);
    out.push(r.reviews ? 1 - r.again / r.reviews : null);
  }
  return out;
}
// studyHeatmap(logs, today, weeks) → weeks×7 cells, column-major (Sun..Sat per
// week), starting the Sunday `weeks - 1` weeks before today's week:
// { date, reviews, lessons, level 0–4, future }. Activity = reviews + 20 per
// unit finished. ponytail: fixed level cutoffs (30/55/80) from the sketch;
// switch to per-user quantiles if they feel wrong for light or heavy users.
function studyHeatmap(logs, today, weeks) {
  weeks = weeks || 52;
  var agg = aggregateLogs(logs), p = today.split('-');
  var t = new Date(+p[0], p[1] - 1, +p[2]);
  var cells = [];
  for (var i = 0; i < weeks * 7; i++) {
    var date = localDate(new Date(t.getFullYear(), t.getMonth(), t.getDate() - t.getDay() - (weeks - 1) * 7 + i));
    var a = agg[date], reviews = a ? a.reviews.count : 0, lessons = a ? a.lessons.length : 0;
    var act = reviews + lessons * 20;
    cells.push({ date: date, reviews: reviews, lessons: lessons, future: date > today,
      level: !act ? 0 : act < 30 ? 1 : act < 55 ? 2 : act < 80 ? 3 : 4 });
  }
  return cells;
}

function stripDocMeta(doc) {
  var out = {};
  Object.keys(doc).forEach(function (k) {
    if (['_id', '_rev', '_conflicts', 'updatedAt', 'deviceId'].indexOf(k) === -1) out[k] = doc[k];
  });
  return out;
}

// pickStoreWinner: deterministic merge of two revisions of the same doc
// (sync design decision 11). card:* → latest lastReviewedAt (then updatedAt);
// everything else → last write (updatedAt) wins. Ties → higher deviceId.
// Use as revs.reduce(pickStoreWinner).
function pickStoreWinner(a, b) {
  var isCard = a._id.indexOf('card:') === 0;
  var ka = isCard ? [a.lastReviewedAt || 0, a.updatedAt || 0] : [a.updatedAt || 0];
  var kb = isCard ? [b.lastReviewedAt || 0, b.updatedAt || 0] : [b.updatedAt || 0];
  for (var i = 0; i < ka.length; i++) {
    if (ka[i] !== kb[i]) return ka[i] > kb[i] ? a : b;
  }
  return String(a.deviceId || '') >= String(b.deviceId || '') ? a : b;
}

// mergeLogDocs: field-wise merge of two revisions of one log:* doc (two tabs on
// one device race on today's doc). Lessons: union; quizzes: union by at+unit;
// reviews: max of each counter. Returns a or b itself when the merge adds
// nothing to it, so a settled merge never rewrites (no sync ping-pong).
// ponytail: max() undercounts reviews done in two tabs at once; per-tab
// counters if that ever matters.
function mergeLogDocs(a, b) {
  var la = normalizeLog(a), lb = normalizeLog(b);
  var lessons = la.lessons.concat(lb.lessons.filter(function (n) { return la.lessons.indexOf(n) === -1; }));
  var key = function (q) { return q.at + '|' + q.unit; };
  var seen = {};
  la.quizzes.forEach(function (q) { seen[key(q)] = true; });
  var quizzes = la.quizzes.concat(lb.quizzes.filter(function (q) { return !seen[key(q)]; }))
    .sort(function (x, y) { return x.at - y.at; });
  var reviews = { count: Math.max(la.reviews.count, lb.reviews.count), again: Math.max(la.reviews.again, lb.reviews.again) };
  var covers = function (l) { // merged is a superset of each side, so equal sizes = equal content
    return l.lessons.length === lessons.length && l.quizzes.length === quizzes.length &&
      l.reviews.count === reviews.count && l.reviews.again === reviews.again;
  };
  if (covers(la)) return a;
  if (covers(lb)) return b;
  return Object.assign({}, b, a, { date: la.date, lessons: lessons, quizzes: quizzes, reviews: reviews,
    updatedAt: Math.max(a.updatedAt || 0, b.updatedAt || 0) });
}
// mergeStoreDocs: the merge rule for any two revisions of one doc.
function mergeStoreDocs(a, b) {
  if (a._id.indexOf('ach:') === 0) return mergeAchDocs(a, b);
  return a._id.indexOf('log:') === 0 ? mergeLogDocs(a, b) : pickStoreWinner(a, b);
}
// mergeAchDocs: two revisions of one ach:* doc → the earlier unlock (ties: higher deviceId).
function mergeAchDocs(a, b) {
  var ua = a.unlockedAt || Infinity, ub = b.unlockedAt || Infinity;
  if (ua !== ub) return ua < ub ? a : b;
  return String(a.deviceId || '') >= String(b.deviceId || '') ? a : b;
}

// ── Remote sync helpers (Settings → Sync; PouchDB wiring is in store.js) ────
// checkSyncUrl: the database URL typed in Settings → { ok, url, error }, error =
// a UI_STRINGS key. https only, except a loopback CouchDB for development
// (browsers allow http://localhost from https pages). The URL must name the
// database; credentials go in their own fields, never in the URL.
function checkSyncUrl(raw) {
  var s = String(raw || '').trim();
  var bad = function (k) { return { ok: false, url: null, error: k }; };
  if (!s) return bad('sync_err_url_empty');
  var u;
  try { u = new URL(s); } catch (e) { return bad('sync_err_url'); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return bad('sync_err_url');
  if (u.username || u.password) return bad('sync_err_url_creds');
  var loopback = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  if (u.protocol === 'http:' && !loopback) return bad('sync_err_https');
  var path = u.pathname.replace(/\/+$/, '');
  if (!path || u.search || u.hash) return bad('sync_err_url_db');
  return { ok: true, url: u.origin + path, error: null };
}
// syncStatusFor: a PouchDB sync event → 'synced' | 'syncing' | 'offline' | 'error'
// | 'off'. `err` = the event's error argument (paused carries one while a
// retry:true replication is waiting out a network failure); online = navigator.onLine.
function syncStatusFor(event, err, online) {
  if (event === 'active' || event === 'change') return 'syncing';
  if (event === 'paused') return err || online === false ? 'offline' : 'synced';
  if (event === 'complete') return 'off';
  if (event === 'error' && syncErrorKey(err) === 'sync_err_network') return 'offline';
  return 'error'; // denied, error
}
// syncErrorKey: a PouchDB/fetch error → UI_STRINGS key for Settings.
function syncErrorKey(err) {
  if (!err) return null;
  var msg = String(err.message || err.reason || '');
  if (!err.status || /failed to fetch|networkerror|load failed|network/i.test(msg)) return 'sync_err_network';
  if (err.status === 401) return 'sync_err_auth';
  if (err.status === 403) return 'sync_err_forbidden';
  if (err.status === 404) return 'sync_err_missing';
  return 'sync_err_other';
}
// syncMergeSummary: counts for the one-line note after a first connect merged
// two non-empty sides → { units: units marked done, cards: SRS cards }.
function syncMergeSummary(docs) {
  var s = docsToSnapshot(docs);
  return { units: s.completed.length, cards: Object.keys(s.srsCards).length };
}

// ── Pace (spec §5): units/day, today target, projection, exam-date suggestion ─
// `key` = UI_STRINGS label. Nothing is locked (Q22): pace only drives targets.
var PACE_MODES = [
  { pace: 0.5, key: 'pace_casual' },
  { pace: 1, key: 'pace_standard' },
  { pace: 2, key: 'pace_intensive' },
  { pace: 3, key: 'pace_super' }
];
var EXAM_BUFFER_DAYS = 7; // finish this many days before the exam
// todayTarget(pace) → { units: ceil(pace), everyDays } (casual: 1 unit every 2 days).
function todayTarget(pace) {
  return pace < 1 ? { units: 1, everyDays: Math.round(1 / pace) } : { units: Math.ceil(pace), everyDays: 1 };
}
// unitsDoneToday: done unit:* docs whose completedAt falls on now's local date.
function unitsDoneToday(unitDocs, now) {
  var today = localDate(new Date(now));
  return unitDocs.filter(function (d) {
    return d._id.indexOf('unit:') === 0 && d.done && !d.skipped && d.completedAt && localDate(new Date(d.completedAt)) === today;
  }).length;
}
// projectFinish → local Date, ceil(remaining / pace) calendar days after now.
function projectFinish(remainingUnits, pace, now) {
  var d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + Math.ceil(remainingUnits / pace));
}
// suggestPace → the slowest PACE_MODES pace that finishes ≥ EXAM_BUFFER_DAYS
// before examDate ('YYYY-MM-DD'), or null when even super intensive can't.
function suggestPace(remainingUnits, examDate, now) {
  var days = dateToDayIndex(examDate) - dateToDayIndex(localDate(new Date(now))) - EXAM_BUFFER_DAYS;
  for (var i = 0; i < PACE_MODES.length; i++) {
    if (Math.ceil(remainingUnits / PACE_MODES[i].pace) <= days || remainingUnits === 0) return PACE_MODES[i].pace;
  }
  return null;
}
// newCardCap: items (= new SRS cards) introduced by the next ceil(pace) units.
// Enforced through dailyCardCap / admitCards (Q34).
function newCardCap(pace, upcomingUnits) {
  return upcomingUnits.slice(0, Math.ceil(pace)).reduce(function (n, u) {
    return n + (u.kana || []).length + (u.vocab || []).length + (u.kanji || []).length + (u.grammar || []).length;
  }, 0);
}

// ── Day plan (Today tab): read → quiz → review as a checklist, from pace + progress ──
// realCompletions(unitDocs): stages passed for real (not skipped by placement), oldest first → [{ id, at }].
function realCompletions(unitDocs) {
  return unitDocs.filter(function (d) {
    return d._id.indexOf('unit:') === 0 && d.done && !d.skipped && d.completedAt;
  }).map(function (d) { return { id: d._id.slice(5), at: d.completedAt }; })
    .sort(function (a, b) { return a.at - b.at; });
}
var BACKLOG_OVERDUE = 20; // cards overdue before today's midnight: review goes first
// dayPlan(o) → { steps, done, rest, backlog, levelEnd, nextStageIn, stageTarget, stagesDone, due, overdue }
//   o.pace, o.now (ms), o.cards (srs map), o.doneToday: units passed today (oldest first),
//   o.lastStageDate: 'YYYY-MM-DD' of the last real pass (or null), o.ahead: units not done, in order,
//   o.reviewedToday: reviews logged today.
// steps: { kind: 'stage'|'review'|'complete', status: 'done'|'now'|'next'|'rest', unit?, due? }. Exactly one
// step is 'now' until the day is done. 'rest' (casual off day) is informational, not part of the plan.
// Review goes last (a passed stage's cards are due at once) unless a backlog sends it first.
function dayPlan(o) {
  var now = o.now, cards = o.cards || {}, doneToday = o.doneToday || [], ahead = o.ahead || [];
  var tgt = todayTarget(o.pace), today = localDate(new Date(now));
  var due = Object.keys(cards).filter(function (id) { return cards[id].due <= now; }).length;
  var overdue = dueForecast(cards, now, 1).overdue;
  var since = o.lastStageDate ? dateToDayIndex(today) - dateToDayIndex(o.lastStageDate) : Infinity;
  var rest = tgt.everyDays > 1 && !doneToday.length && since < tgt.everyDays;
  var stageTarget = rest ? 0 : tgt.units;
  var left = Math.min(Math.max(0, stageTarget - doneToday.length), ahead.length);
  var backlog = overdue >= BACKLOG_OVERDUE && due > 0;
  var stages = doneToday.map(function (u) { return { kind: 'stage', done: true, unit: u }; })
    .concat(ahead.slice(0, left).map(function (u) { return { kind: 'stage', done: false, unit: u }; }));
  var reviewDone = due === 0 && (o.reviewedToday > 0 || doneToday.length > 0 || stageTarget === 0 || !ahead.length);
  var review = { kind: 'review', done: reviewDone, due: due, overdue: overdue };
  var steps = backlog ? [review].concat(stages) : stages.concat([review]);
  var seenNow = false;
  steps.forEach(function (s) {
    s.status = s.done ? 'done' : seenNow ? 'next' : (seenNow = true, 'now');
    delete s.done;
  });
  if (rest && ahead.length) steps.push({ kind: 'stage', status: 'rest', unit: ahead[0] });
  var allDone = !seenNow;
  steps.push({ kind: 'complete', status: allDone ? 'done' : 'next' });
  return {
    steps: steps, done: allDone, rest: rest, backlog: backlog, levelEnd: !ahead.length,
    nextStageIn: rest ? tgt.everyDays - since : 0, stageTarget: stageTarget,
    stagesDone: doneToday.length, due: due, overdue: overdue
  };
}

// foldDoneStages(steps, after): when more than `after` stage steps are done, merge them into ONE
// { kind: 'fold', status: 'done', units } step at the first one's place (Today tab, grind days).
function foldDoneStages(steps, after) {
  var done = steps.filter(function (s) { return s.kind === 'stage' && s.status === 'done'; });
  if (done.length <= after) return steps;
  var fold = { kind: 'fold', status: 'done', units: done.map(function (s) { return s.unit; }) };
  return steps.reduce(function (out, s) {
    if (s === done[0]) out.push(fold);
    else if (done.indexOf(s) < 0) out.push(s);
    return out;
  }, []);
}

// dayPlural(n, one, other): '{n}' in the chosen form becomes the count.
function dayPlural(n, one, other) { return (n === 1 ? one : other).replace('{n}', n); }
// quizHandoff: what the passed-quiz screen offers next, from the day plan after the pass.
// → { line, primary: { label, onClick }, secondary: { label, onClick } | null }
function quizHandoff(plan, unit, units, handlers) {
  var rev = plan.steps.filter(function (s) { return s.kind === 'review'; })[0];
  var nextStage = plan.steps.filter(function (s) { return s.kind === 'stage' && s.status === 'now'; })[0];
  var target = Math.max(plan.stageTarget, 1);
  var line = "Today: " + Math.min(plan.stagesDone, target) + ' / ' + target + ' stages';
  var next = unit.index < units.length - 1 ? { label: t('nav_next_stage', unit.level), onClick: handlers.nextStage } : null;
  var reviewLabel = dayPlural(rev.due, 'Review {n} card', 'Review {n} cards');
  if (nextStage) return { line: line + '. ' + (plan.stageTarget - plan.stagesDone > 1 ? (plan.stageTarget - plan.stagesDone) + ' more' : 'One more') + ', then review.',
    primary: { label: 'Start stage ' + (nextStage.unit.index + 1), onClick: function () { handlers.openStage(nextStage.unit.index); } },
    secondary: rev.due ? { label: reviewLabel, onClick: handlers.review } : null };
  if (rev.due) return { line: line + " ✓. Review left, then you're done.", primary: { label: reviewLabel.replace(/$/, ' now'), onClick: handlers.review }, secondary: next };
  return { line: line + " ✓. That's today done.", primary: { label: 'Back to Today', onClick: handlers.today }, secondary: next };
}

// docsToSnapshot: docs → App's synchronous state shape.
function docsToSnapshot(docs) {
  var snap = { completed: [], srsCards: {}, currentUnit: null, pace: 1, examDate: null, furiganaPref: null, uiLang: 'en', kanjiView: 'rows', pendingCards: [], mocks: [], unlocked: {}, skipped: [] };
  docs.forEach(function (d) {
    if (d._id.indexOf('unit:') === 0) {
      if (d.done) { snap.completed.push(d._id.slice(5)); if (d.skipped) snap.skipped.push(d._id.slice(5)); } // skipped units are also in completed
    } else if (d._id.indexOf('card:') === 0) {
      snap.srsCards[d._id.slice(5)] = stripDocMeta(d);
    } else if (d._id === 'prefs:learning') {
      if (typeof d.currentUnit === 'string') snap.currentUnit = d.currentUnit;
      if (d.pace > 0) snap.pace = d.pace;
      if (typeof d.examDate === 'string') snap.examDate = d.examDate;
      if (typeof d.furigana === 'boolean') snap.furiganaPref = String(d.furigana);
      // ponytail: 'en' fallback while under development (see App); 'auto' for release.
      if (d.uiLang === 'auto' || d.uiLang === 'ja') snap.uiLang = d.uiLang;
      if (d.kanjiView === 'focus') snap.kanjiView = 'focus';
      if (Array.isArray(d.pendingCards)) snap.pendingCards = d.pendingCards.slice();
    } else if (d._id.indexOf('mock:') === 0) {
      snap.mocks.push(stripDocMeta(d));
    } else if (d._id.indexOf('ach:') === 0 && d.unlockedAt > 0) {
      snap.unlocked[d._id.slice(4)] = d.unlockedAt;
    }
  });
  snap.mocks.sort(function (a, b) { return b.takenAt - a.takenAt; }); // newest first
  return snap;
}

// Progress file format. v3 = unit/item-keyed docs; older files are rejected
// (no users before the catalog rebuild, map Q5).
var PROGRESS_VERSION = 3;

// exportProgress: progress file from the store's docs plus device-only
// prefs read via `get(key)` (localStorage.getItem).
function exportProgress(docs, get) {
  var device = {};
  DEVICE_PREF_KEYS.forEach(function (k) {
    var v = get(k);
    if (v !== null && v !== undefined) device[k] = v;
  });
  return {
    version: PROGRESS_VERSION,
    exported: new Date().toISOString(),
    docs: docs.map(function (d) {
      var c = Object.assign({}, d);
      delete c._rev;
      delete c._conflicts;
      return c;
    }),
    device: device
  };
}

// progressFileToDocs: a validated progress file → { docs, device }.
// `device` = localStorage keys to write back as-is (device prefs).
function progressFileToDocs(data) {
  return { docs: data.docs, device: data.device || {} };
}

// validateProgressData: checks that a parsed progress file has the expected
// shape. Returns { valid: boolean, error: string|null }.
function validateProgressData(data) {
  if (!data || typeof data !== 'object') return { valid: false, error: 'not an object' };
  if (data.version !== PROGRESS_VERSION) return { valid: false, error: 'unsupported version: ' + data.version };
  function bad(msg) { return { valid: false, error: 'version ' + PROGRESS_VERSION + ': ' + msg }; }
  if (!Array.isArray(data.docs)) return bad('missing docs array');
  for (var i = 0; i < data.docs.length; i++) {
    var d = data.docs[i];
    if (!d || typeof d !== 'object' || typeof d._id !== 'string' || !STORE_ID_RE.test(d._id)) {
      return bad('bad doc id: ' + (d && d._id));
    }
    if (typeof d.updatedAt !== 'number') return bad(d._id + ' missing updatedAt');
    if (d._id.indexOf('unit:') === 0 && typeof d.done !== 'boolean') return bad(d._id + ' missing done');
    if (d._id.indexOf('unit:') === 0 && d.skipped !== undefined && (d.skipped !== true || !d.done)) return bad(d._id + ' bad skipped flag');
    if (d._id.indexOf('card:') === 0 && ['interval', 'ease', 'due', 'reps'].some(function (f) {
      return typeof d[f] !== 'number';
    })) return bad(d._id + ' missing SRS fields');
    if (d._id.indexOf('log:') === 0 && d.date !== d._id.split(':')[1]) return bad(d._id + ' date mismatch');
    if (d._id.indexOf('ach:') === 0 && !(d.unlockedAt > 0)) return bad(d._id + ' missing unlockedAt');
    if (d._id.indexOf('mock:') === 0 && (d._id !== 'mock:' + d.mockId + ':' + d.takenAt || !d.estimate)) return bad(d._id + ' bad mock result');
  }
  if (data.device !== undefined) {
    if (!data.device || typeof data.device !== 'object') return bad('device is not an object');
    var dk = Object.keys(data.device);
    for (var j = 0; j < dk.length; j++) {
      if (DEVICE_PREF_KEYS.indexOf(dk[j]) === -1) return bad('unknown device key: ' + dk[j]);
      if (typeof data.device[dk[j]] !== 'string') return bad('device key ' + dk[j] + ' is not a string');
    }
  }
  return { valid: true, error: null };
}

// ── Achievements (ticket 08; list: .scratch/achievements/achievements-draft.md) ─
// Pure rule engine. ACHIEVEMENTS = definitions (data + rule functions); evaluateAchievements reads
// the store docs and returns what is newly earned. Unlocks persist as ach:<id> docs (see above).
// Categories: progress 進 · habit 習 · quiz 問 · mock 試 · review 復 · mastery 極.
var MOCK_SCORE_MAX = 180; // scaled estimate: lkr 0-120 + listening 0-60 (mockEstimate)
var ACH_CATEGORIES = { progress: '進', habit: '習', quiz: '問', mock: '試', review: '復', mastery: '極' };

function dateMs(d) { var p = d.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).getTime(); }
function realMature(c) { return !!c && c.interval >= 21 && c.lastReviewedAt > 0; } // import-proof
function cleanPerfect(q) { return q.total >= 5 && q.right === q.total && !q.overrides; }
function mockCounted(m) { // ≥ 50% of the questions answered (a blank submit doesn't count)
  var n = 0, got = 0;
  Object.keys(m.answers || {}).forEach(function (k) {
    m.answers[k].forEach(function (a) { n++; if (a !== null && a !== undefined) got++; });
  });
  return n > 0 && got * 2 >= n;
}

// achievementState(docs, units, catalog, now): everything the rules read, derived once.
function achievementState(docs, units, catalog, now) {
  var s = { units: units, catalog: catalog, now: now, done: {}, skipped: {}, cards: {}, mocks: [] };
  var known = {};
  units.forEach(function (u) { known[u.id] = true; });
  docs.forEach(function (d) {
    if (d._id.indexOf('unit:') === 0) { if (d.done && known[d._id.slice(5)]) { s.done[d._id.slice(5)] = d.completedAt || 0; if (d.skipped) s.skipped[d._id.slice(5)] = true; } }
    // skipped (placement) counts as done for progress rows; quiz rows read s.quizzes/byUnit, never s.done
    else if (d._id.indexOf('card:') === 0) s.cards[d._id.slice(5)] = d;
    else if (d._id.indexOf('mock:') === 0 && catalog.items[d.mockId] && mockCounted(d)) s.mocks.push(d);
  });
  s.mocks.sort(function (a, b) { return a.takenAt - b.takenAt; });
  s.logs = logDocs(docs);
  s.agg = aggregateLogs(s.logs);
  s.dates = studyDates(s.logs);
  s.longest = computeStreak(s.dates, localDate(new Date(now))).longest;
  s.reviews = activityTotals(s.logs).reviews;
  s.quizzes = [];
  s.logs.forEach(function (l) { s.quizzes = s.quizzes.concat(normalizeLog(l).quizzes); });
  s.quizzes.sort(function (a, b) { return a.at - b.at; });
  s.byUnit = {};
  s.quizzes.forEach(function (q) { (s.byUnit[q.unit] || (s.byUnit[q.unit] = [])).push(q); });
  s.perfectAt = {}; // unit → earliest clean perfect
  s.quizzes.forEach(function (q) { if (cleanPerfect(q) && !s.perfectAt[q.unit]) s.perfectAt[q.unit] = q.at; });
  return s;
}

// A rule returns false, true (earned; date unknown = ship day) or a ms timestamp (earned then).
function _all(times) { // every entry must be a time; the latest one is when it was complete
  if (!times.length) return false;
  var mx = 0;
  for (var i = 0; i < times.length; i++) { if (times[i] === undefined || times[i] === null) return false; mx = Math.max(mx, times[i]); }
  return mx || true;
}
function _nth(times, n) { times = times.slice().sort(function (a, b) { return a - b; }); return times.length >= n ? times[n - 1] || true : false; }
function _perDay(s, n) { // earliest moment some day reached n done units
  var days = {}, best = false;
  Object.keys(s.done).forEach(function (id) {
    if (s.done[id] && !s.skipped[id]) (days[localDate(new Date(s.done[id]))] = days[localDate(new Date(s.done[id]))] || []).push(s.done[id]);
  });
  Object.keys(days).forEach(function (k) {
    days[k].sort(function (a, b) { return a - b; });
    if (days[k].length >= n && (!best || days[k][n - 1] < best)) best = days[k][n - 1];
  });
  return best;
}
function _streakAt(dates, n) { // date a run of n consecutive study dates completed
  var run = 0, prev = null, hit = false;
  dates.forEach(function (d) {
    var i = dateToDayIndex(d);
    run = prev !== null && i === prev + 1 ? run + 1 : 1;
    prev = i;
    if (!hit && run >= n) hit = dateMs(d) || true;
  });
  return hit;
}
function _matureCount(s, pred) {
  return Object.keys(s.cards).filter(function (id) { return realMature(s.cards[id]) && (!pred || pred(s.cards[id])); }).length;
}

// Row builders. A def: { id, category, rarity, hidden, name, desc, revealed, level, test(s) → rule result,
// progress?(s) → [x, goal] }. _ctr = "at least goal of a count", with a progress bar while locked.
function _def(id, category, rarity, name, desc, test, extra) {
  return Object.assign({ id: id, category: category, rarity: rarity, hidden: false, name: name, desc: desc, revealed: '', level: null, test: test }, extra);
}
function _ctr(id, category, rarity, name, desc, goal, count, times) {
  return _def(id, category, rarity, name, desc, function (s) {
    if (count(s) < goal) return false;
    return times ? times(s, goal) : true;
  }, { progress: function (s) { return [Math.min(count(s), goal), goal]; } });
}
function _hid(d, revealed) { d.hidden = true; d.revealed = revealed; return d; }

// levelAchievements(L, units, catalog): the per-level template rows for level L (kana rows only at N5).
// Rows whose unit kind / mock format the level lacks are not instantiated.
function levelAchievements(L, units, catalog) {
  var l = L.toLowerCase(), isN5 = L === 'N5';
  var nm = function (n) { return isN5 ? n : n + ' (' + L + ')'; }; // ponytail: N4+ get a "(N4)" suffix until puns are written
  var lv = units.filter(function (u) { return u.level === L; });
  var kindUnits = function (k) { return lv.filter(function (u) { return u.kind === k; }); };
  var doneAll = function (list) { return function (s) { return _all(list.map(function (u) { return s.done[u.id]; })); }; };
  var doneProg = function (list) { return function (s) { return [list.filter(function (u) { return s.done[u.id] !== undefined; }).length, list.length]; }; };
  var mocksOf = function (fmt) {
    return Object.keys(catalog.items).map(function (k) { return catalog.items[k]; })
      .filter(function (m) { return m.kind === 'mock' && m.level === L && m.format === fmt; });
  };
  var sittings = function (s, mockId) { return s.mocks.filter(function (m) { return m.mockId === mockId; }); };
  var fullIds = mocksOf('full').map(function (m) { return m.id; });
  var diagIds = mocksOf('diagnostic').map(function (m) { return m.id; });
  var fullSittings = function (s) { return s.mocks.filter(function (m) { return fullIds.indexOf(m.mockId) >= 0; }); };
  var firstSittings = function (s) { return fullIds.map(function (id) { return sittings(s, id)[0]; }).filter(Boolean); };
  var out = [];
  var add = function (d) { d.level = L; out.push(d); return d; };
  var tag = function (id) { return l + '-' + id; };
  [['all-lessons', 'lesson', 'rare', 'Lesson Learned', 'Pass every {L} lesson unit.'],
    ['all-reviews', 'review', 'uncommon', 'Déjà Vu All Over Again', 'Pass every {L} review unit.'],
    ['prep', 'prep', 'uncommon', 'Strategy Session', 'Finish the {L} test-prep block.']].forEach(function (k) {
    var list = kindUnits(k[1]);
    if (list.length) add(_def(tag(k[0]), 'progress', k[2], nm(k[3]), k[4].replace('{L}', L), doneAll(list), { progress: doneProg(list) }));
  });
  add(_def(tag('clear'), 'progress', 'epic', nm('Go Go N5'), 'Clear every ' + L + ' unit.', doneAll(lv), { progress: doneProg(lv) }));
  var quizzed = lv.filter(function (u) { return u.kind !== 'mock'; });
  add(_def(tag('quiz-sweep'), 'quiz', 'legendary', nm('Hanamaru Garden'), 'Ace the quiz of every ' + L + ' unit.',
    function (s) { return _all(quizzed.map(function (u) { return s.perfectAt[u.id]; })); },
    { progress: function (s) { return [quizzed.filter(function (u) { return s.perfectAt[u.id]; }).length, quizzed.length]; } }));
  var firstAt = function (arr) { return arr.length ? arr[0].takenAt : false; };
  var passed = function (m) { return m.estimate && m.estimate.passed; };
  if (diagIds.length) {
    add(_def(tag('diagnostic'), 'mock', 'common', nm('Jiko Shōkai'), 'Sit the ' + L + ' diagnostic.', function (s) {
      return firstAt(s.mocks.filter(function (x) { return diagIds.indexOf(x.mockId) >= 0; }));
    }));
  }
  if (fullIds.length) {
    add(_def(tag('mock-sat'), 'mock', 'common', nm('Dress Rehearsal'), 'Sit a full ' + L + ' mock exam.', function (s) { return firstAt(fullSittings(s)); }));
    add(_def(tag('mock-pass'), 'mock', 'uncommon', nm('Gōkaku!'), 'Pass a full ' + L + ' mock (estimate).', function (s) { return firstAt(fullSittings(s).filter(passed)); }));
    add(_def(tag('mock-pass-all'), 'mock', 'rare', nm('Double Gōkaku'), 'Pass every full ' + L + ' mock.',
      function (s) { return _all(fullIds.map(function (id) { var p = sittings(s, id).filter(passed)[0]; return p ? p.takenAt : null; })); },
      { progress: function (s) { return [fullIds.filter(function (id) { return sittings(s, id).some(passed); }).length, fullIds.length]; } }));
    add(_def(tag('mock-honors'), 'mock', 'epic', nm('Gōkaku with Honors'), 'Score 80%+ on a full ' + L + ' mock, first try.',
      function (s) { return firstAt(firstSittings(s).filter(function (m) { return m.estimate.total >= 0.8 * MOCK_SCORE_MAX; })); }));
    add(_def(tag('mock-perfect'), 'mock', 'legendary', nm('Zenmon Seikai'), 'Perfect score on a full ' + L + ' mock, first try.',
      function (s) {
        return firstAt(firstSittings(s).filter(function (m) {
          return m.estimate.total === MOCK_SCORE_MAX && Object.keys(m.parts).every(function (k) { return m.parts[k][1] > 0 && m.parts[k][0] === m.parts[k][1]; });
        }));
      }));
    add(_def(tag('mock-balanced'), 'mock', 'rare', nm('Four Corners'), '80%+ in all four parts of one full ' + L + ' mock.',
      function (s) {
        return firstAt(fullSittings(s).filter(function (m) {
          return ['vocab', 'grammar', 'reading', 'listening'].every(function (k) { return m.parts[k] && m.parts[k][1] > 0 && m.parts[k][0] / m.parts[k][1] >= 0.8; });
        }));
      }));
  }
  // Mastery: every taught item a real-mature card (seeded "already known" cards don't count until reviewed).
  var items = unitItems(lv);
  var of = function (kind) { return items.filter(function (it) { return it.kind === kind; }); };
  var matureAll = function (list) { return function (s) { return list.length > 0 && list.every(function (it) { return realMature(s.cards[it.id]); }); }; };
  var matureProg = function (list) { return function (s) { return [list.filter(function (it) { return realMature(s.cards[it.id]); }).length, list.length]; }; };
  [['vocab-mature', 'vocab', 'epic', 'Vocab Vault', 'Every {L} vocab word is a real-mature card.'],
    ['kanji-mature', 'kanji', 'epic', 'Kanji Kaiser', 'Every {L} kanji is a real-mature card.'],
    ['grammar-mature', 'grammar', 'rare', 'Particle Physicist', 'Every {L} grammar point is a real-mature card.']].forEach(function (k) {
    if (of(k[1]).length) add(_def(tag(k[0]), 'mastery', k[2], nm(k[3]), k[4].replace('{L}', L), matureAll(of(k[1])), { progress: matureProg(of(k[1])) }));
  });
  if (items.length) add(_def(tag('all-mature'), 'mastery', 'legendary', nm('Elephant Graveyard of Doubt'), 'Every ' + L + ' card is real-mature. (Konpurīto for memory.)', matureAll(items), { progress: matureProg(items) }));
  if (isN5) {
    var script = function (u, sc) { return u.kana.length > 0 && u.kana.every(function (k) { return k.script === sc; }); };
    var hira = lv.filter(function (u) { return script(u, 'hiragana'); }), kata = lv.filter(function (u) { return script(u, 'katakana'); });
    add(_def('n5-hiragana', 'progress', 'common', 'Hira-gone Wild', 'Pass the hiragana units and their review.', doneAll(hira), { progress: doneProg(hira) }));
    add(_def('n5-katakana', 'progress', 'common', 'Kata-strophe Averted', 'Pass the katakana units and their review.', doneAll(kata), { progress: doneProg(kata) }));
    var kanaOf = function (sc) { return items.filter(function (it) { return it.kind === 'kana' && it.script === sc; }); };
    add(_def('hiragana-mastered', 'mastery', 'rare', 'Hiragana Black Belt', 'Every hiragana card real-mature.', matureAll(kanaOf('hiragana')), { progress: matureProg(kanaOf('hiragana')) }));
    add(_def('katakana-mastered', 'mastery', 'rare', 'Kata Master', 'Every katakana card real-mature. (Kata: also a martial-arts form.)', matureAll(kanaOf('katakana')), { progress: matureProg(kanaOf('katakana')) }));
    // Zero to Hero in a Day: every hiragana unit has a passing quiz entry (any attempt) on one local date.
    add(_hid(_def('hiragana-blitz', 'progress', 'rare', 'Zero to Hero in a Day', 'Pass all ten hiragana units in one calendar day.', function (s) {
      if (!hira.length) return false;
      var byDate = {}, best = false;
      hira.forEach(function (u) {
        (s.byUnit[u.id] || []).forEach(function (q) {
          // legacy entries have no `passed`: kana quizzes pass at >= 80% overall (words mark), so use that
          if (!(q.passed !== undefined ? q.passed : quizPassed(q.right, q.total, isKanaQuiz(u) ? 'lesson' : u.kind))) return;
          var d = localDate(new Date(q.at)), e = byDate[d] || (byDate[d] = {});
          if (!e[u.id] || q.at < e[u.id]) e[u.id] = q.at;
        });
      });
      Object.keys(byDate).forEach(function (d) {
        var t = hira.map(function (u) { return byDate[d][u.id]; });
        if (t.every(Boolean)) { var mx = Math.max.apply(null, t); if (!best || mx < best) best = mx; }
      });
      return best;
    }), 'Did all of hiragana in a day.'));
  }
  return out;
}

// globalAchievements(): the level-independent rows (completionist last).
function globalAchievements() {
  var G = [], c = _ctr, d = _def;
  var doneTimes = function (s) { return Object.keys(s.done).map(function (k) { return s.done[k]; }); };
  [['first-steps', 'common', 'Ichi Step at a Time', 'Pass your first unit.', 1], ['units-10', 'common', 'Jū-st Getting Started', 'Pass 10 units.', 10],
    ['units-25', 'uncommon', 'Nijūgo Strong', 'Pass 25 units.', 25], ['units-50', 'uncommon', 'Gojū-on the Roll', 'Pass 50 units.', 50],
    ['units-100', 'rare', 'Hyaku Percent Effort', 'Pass 100 units.', 100]].forEach(function (r) {
    G.push(c(r[0], 'progress', r[1], r[2], r[3], r[4], function (s) { return Object.keys(s.done).length; }, function (s, n) { return _nth(doneTimes(s), n); }));
  });
  [['streak-4', 'common', 'Mikka Bōzu Breaker', 'Study 4 days in a row. No three-day monk here.', 4],
    ['streak-7', 'uncommon', 'Isshūkan Ironclad', 'Study 7 days in a row.', 7], ['streak-30', 'rare', 'Tsuki-ing With It', 'Study 30 days in a row.', 30],
    ['streak-100', 'epic', 'Hyaku-nichi Hero', 'Study 100 days in a row.', 100], ['streak-365', 'legendary', 'Nen-stop', 'Study every day for a year.', 365]].forEach(function (r) {
    G.push(c(r[0], 'habit', r[1], r[2], r[3], r[4], function (s) { return s.longest; }, function (s, n) { return _streakAt(s.dates, n); }));
  });
  [['study-days-30', 'common', 'Thirty-Something', 'Study on 30 different days.', 30], ['study-days-100', 'uncommon', 'Slow and Steady Kame', 'Study on 100 different days.', 100],
    ['study-days-200', 'rare', 'Kame Marathon', 'Study on 200 different days.', 200]].forEach(function (r) {
    G.push(c(r[0], 'habit', r[1], r[2], r[3], r[4], function (s) { return s.dates.length; }, function (s, n) { return dateMs(s.dates[n - 1]) || true; }));
  });
  G.push(d('double-feature', 'habit', 'common', 'Double Feature', 'Pass 2 units in one calendar day.', function (s) { return _perDay(s, 2); }));
  G.push(d('hat-trick', 'habit', 'uncommon', 'Hat Trick', 'Pass 3 units in one day.', function (s) { return _perDay(s, 3); }));
  G.push(d('binge', 'habit', 'rare', 'Binge Watcher', 'Pass 5 units in one day.', function (s) { return _perDay(s, 5); }));
  G.push(_hid(d('comeback', 'habit', 'uncommon', 'Nana Korobi Ya Oki', 'Fall down seven times, stand up eight.', function (s) {
    for (var i = 1; i < s.dates.length; i++) if (dateToDayIndex(s.dates[i]) - dateToDayIndex(s.dates[i - 1]) >= 8) return dateMs(s.dates[i]) || true;
    return false;
  }), 'Came back after a week+ away.'));
  var hourQuiz = function (lo, hi) {
    return function (s) {
      var q = s.quizzes.filter(function (x) { var h = new Date(x.at).getHours(); return h >= lo && h <= hi; })[0];
      return q ? q.at : false;
    };
  };
  G.push(_hid(d('early-bird', 'habit', 'uncommon', 'Hayaoki wa Sanmon no Toku', 'Rise early, gain three mon.', hourQuiz(5, 6)), 'Finished a quiz before 7 a.m.'));
  G.push(_hid(d('night-owl', 'habit', 'uncommon', 'Yoru no Fukurō', 'Hoot hoot, hiragana.', hourQuiz(0, 3)), 'Finished a quiz after midnight.'));
  G.push(_hid(d('new-year', 'habit', 'uncommon', 'Akemashite Omedetō', 'Start the year with study.', function (s) {
    var x = s.dates.filter(function (k) { return k.slice(5) === '01-01'; })[0];
    return x ? dateMs(x) || true : false;
  }), "Studied on New Year's Day."));
  // Quiz
  G.push(d('first-quiz', 'quiz', 'common', 'Pop Quiz Hot Shot', 'Finish your first quiz.', function (s) { return s.quizzes.length ? s.quizzes[0].at : false; }));
  var perfTimes = function (s) { return Object.keys(s.perfectAt).map(function (k) { return s.perfectAt[k]; }); };
  var nPerf = function (s) { return Object.keys(s.perfectAt).length; };
  var nthPerf = function (s, n) { return _nth(perfTimes(s), n); };
  G.push(c('first-perfect', 'quiz', 'common', 'Hanamaru', 'Ace a quiz. Have a flower circle. 💮', 1, nPerf, nthPerf));
  G.push(c('perfect-10', 'quiz', 'uncommon', 'Hanamaru Bouquet', 'Ace the quiz of 10 different units.', 10, nPerf, nthPerf));
  G.push(c('perfect-50', 'quiz', 'rare', 'Hanami Season', 'Ace the quiz of 50 different units.', 50, nPerf, nthPerf));
  var firstPerfect = function (s) { return Object.keys(s.byUnit).map(function (u) { return s.byUnit[u][0]; }).filter(cleanPerfect); };
  G.push(c('ippatsu', 'quiz', 'rare', 'Ippatsu', 'Ace 25 units on the very first attempt.', 25,
    function (s) { return firstPerfect(s).length; }, function (s, n) { return _nth(firstPerfect(s).map(function (q) { return q.at; }), n); }));
  G.push(_hid(d('redemption-arc', 'quiz', 'uncommon', 'Redemption Arc', 'Struggle with a quiz, then come back and ace it.', function (s) {
    var best = false;
    Object.keys(s.byUnit).forEach(function (u) {
      var qs = s.byUnit[u], f = qs[0];
      if (!f.total || f.right / f.total >= 0.6) return;
      var day = localDate(new Date(f.at));
      qs.forEach(function (q) { if (cleanPerfect(q) && localDate(new Date(q.at)) > day && (!best || q.at < best)) best = q.at; });
    });
    return best;
  }), 'Aced a quiz you once scored under 60% on.'));
  // Mock
  var nMocks = function (s) { return s.mocks.length; };
  G.push(c('mock-sittings-5', 'mock', 'uncommon', 'Mock-ingbird', 'Sit 5 mock exams.', 5, nMocks, function (s, n) { return s.mocks[n - 1].takenAt; }));
  G.push(c('mock-sittings-15', 'mock', 'rare', 'Mock Star', 'Sit 15 mock exams.', 15, nMocks, function (s, n) { return s.mocks[n - 1].takenAt; }));
  // Review
  var reviewDays = function (s) { return Object.keys(s.agg).filter(function (k) { return s.agg[k].reviews.count > 0; }).sort(); };
  var nReviews = function (s) { return s.reviews; };
  G.push(c('first-review', 'review', 'common', 'Flip Side', 'Rate your first flashcard.', 1, nReviews, function (s) { return dateMs(reviewDays(s)[0]) || true; }));
  G.push(c('reviews-100', 'review', 'common', 'Card Shark', 'Review 100 cards.', 100, nReviews));
  G.push(c('reviews-1000', 'review', 'uncommon', 'Sen-bazuru', 'Review 1,000 cards.', 1000, nReviews));
  G.push(c('reviews-5000', 'review', 'epic', 'Go-sen Flips', 'Review 5,000 cards.', 5000, nReviews));
  var reviewDay = function (n) {
    return function (s) {
      var k = reviewDays(s).filter(function (x) { return s.agg[x].reviews.count >= n; })[0];
      return k ? dateMs(k) || true : false;
    };
  };
  G.push(d('review-day-50', 'review', 'uncommon', 'Zen Deck', 'Rate 50 cards in one calendar day.', reviewDay(50)));
  G.push(d('review-day-100', 'review', 'rare', 'Marathon Mōdo', 'Rate 100 cards in one calendar day.', reviewDay(100)));
  var nMature = function (s) { return _matureCount(s); };
  G.push(c('mature-1', 'review', 'common', 'Graduation Day', 'Grow a card to a 21-day interval.', 1, nMature));
  G.push(c('mature-100', 'review', 'uncommon', 'Long-Term Memory Lane', 'Have 100 real-mature cards.', 100, nMature));
  G.push(c('mature-500', 'review', 'epic', 'Elephants Never Wasureru', 'Have 500 real-mature cards.', 500, nMature));
  G.push(d('interval-365', 'review', 'rare', 'Mata Rainen', 'A card scheduled a full year out.', function (s) {
    return Object.keys(s.cards).some(function (k) { return s.cards[k].interval >= 365 && s.cards[k].lastReviewedAt > 0; });
  }));
  G.push(d('import-first', 'review', 'common', 'Head Start', 'Mark something as already known.', function (s) {
    return Object.keys(s.cards).some(function (k) { return !!s.cards[k].imported; });
  }));
  G.push(c('import-proved', 'review', 'uncommon', 'Told You So', '25 known cards that passed their first real test.', 25, function (s) {
    return Object.keys(s.cards).filter(function (k) { var x = s.cards[k]; return x.imported && x.lastReviewedAt > 0 && x.reps >= 3; }).length;
  }));
  // Mastery by type
  var kanjiMature = function (s) { return _matureCount(s, function (x) { return x.type === 'kanji'; }); };
  G.push(c('kanji-mature-25', 'mastery', 'uncommon', 'Kanji-nator', 'Have 25 real-mature kanji cards.', 25, kanjiMature));
  G.push(c('kanji-mature-50', 'mastery', 'rare', 'Radical Behavior', 'Have 50 real-mature kanji cards.', 50, kanjiMature));
  // completionist: decided in evaluateAchievements (needs every other row), so its test never fires alone.
  G.push(_hid(d('completionist', 'progress', 'legendary', 'Konpurīto', 'Unlock every other achievement.', function () { return false; }), 'Unlocked everything. お疲れ様でした。'));
  return G;
}

// achievementDefs(units, catalog): global rows + the level template for each level that has units.
// Order is stable; completionist is last.
function achievementDefs(units, catalog) {
  var levels = [], out = [], all = globalAchievements(), end = all.pop();
  units.forEach(function (u) { if (levels.indexOf(u.level) < 0) levels.push(u.level); });
  levels.forEach(function (L) { out = out.concat(levelAchievements(L, units, catalog)); });
  return all.concat(out, [end]);
}
// ACHIEVEMENTS: the list for the built content. Rows are { id, name, desc, category, rarity, hidden,
// revealed, level } plus rule functions (test, progress?). Shown text for a locked hidden row: see achievementList.
var ACHIEVEMENTS = achievementDefs(allUnits(), CATALOG);

// evaluateAchievements(docs, unlocked, ctx) → [{ id, at }] newly earned, in list order.
// docs = store docs; unlocked = { id: unlockedAtMs } already held (sticky, never revoked);
// ctx = { units, catalog, now?, defs? }. `at` = the date the data proves (ms), else `now` (ship day).
function evaluateAchievements(docs, unlocked, ctx) {
  var now = ctx.now || Date.now(), defs = ctx.defs || achievementDefs(ctx.units, ctx.catalog);
  var s = achievementState(docs, ctx.units, ctx.catalog, now), out = [], have = Object.assign({}, unlocked);
  defs.forEach(function (d) {
    if (have[d.id] || d.id === 'completionist') return;
    var r = d.test(s);
    if (!r) return;
    var at = typeof r === 'number' ? Math.min(r, now) : now;
    have[d.id] = at;
    out.push({ id: d.id, at: at });
  });
  if (!have.completionist && defs.some(function (d) { return d.id === 'completionist'; }) &&
      defs.every(function (d) { return d.id === 'completionist' || have[d.id]; })) {
    var last = defs.reduce(function (m, d) { return d.id === 'completionist' ? m : Math.max(m, have[d.id]); }, 0);
    out.push({ id: 'completionist', at: Math.min(last || now, now) });
  }
  return out;
}

// achievementList(docs, unlocked, ctx) → one row per def for the collection screen:
// { id, category, rarity, hidden, level, unlocked, unlockedAt, name, desc, revealed, progress }.
// A locked hidden row shows only "???" (no text, no progress); locked counters carry progress [x, goal].
function achievementList(docs, unlocked, ctx) {
  var now = ctx.now || Date.now(), defs = ctx.defs || achievementDefs(ctx.units, ctx.catalog);
  var s = achievementState(docs, ctx.units, ctx.catalog, now);
  return defs.map(function (d) {
    var on = !!unlocked[d.id], mask = d.hidden && !on;
    return { id: d.id, category: d.category, rarity: d.rarity, hidden: d.hidden, level: d.level, unlocked: on, unlockedAt: unlocked[d.id] || null,
      name: mask ? '???' : d.name, desc: mask ? '' : d.desc, revealed: mask ? '' : d.revealed,
      progress: !on && !d.hidden && d.progress ? d.progress(s) : null };
  });
}

// achievementBatch(newly, mode) → what the toasts show (ticket 30), or null when nothing is new.
// 'retro' (app start, after sync, new content): silent, ONE summary. 'live' (after a logged event):
// newest first, max 3 shown + `more`, ONE jingle for the batch. Unlocks that arrive from another
// device never come through here: they only add to the badge (unseenUnlocks).
function achievementBatch(newly, mode, maxShown) {
  maxShown = maxShown || 3;
  if (!newly.length) return null;
  if (mode === 'retro') return { summary: newly.length, toasts: [], more: 0, jingle: false };
  var ids = newly.map(function (n) { return n.id; }).reverse();
  return { summary: 0, toasts: ids.slice(0, maxShown), more: Math.max(0, ids.length - maxShown), jingle: true };
}

// unseenUnlocks(unlocked, seen) → ids not yet opened on this device (Achievements tab badge;
// `seen` = device-local id list, so another device's unlocks count too).
function unseenUnlocks(unlocked, seen) {
  return Object.keys(unlocked).filter(function (id) { return (seen || []).indexOf(id) < 0; });
}

// ── Placement questions (roadmap ticket 37) ─────────────────────────────────
// placementQuestions(unit, count, taken): up to `count` hardest-form questions about distinct items
// the stage (a kana or lesson unit) teaches, none already in `taken` (item ids asked earlier in the
// test). Same exercise shape as a quiz question plus itemId / item / form / recall. Typed answers
// first; grammar asks the hardest multiple choice (order, then gap). A kana stage asks only real
// words written in kana (its vocab + practice, 2+ kana), never a single letter. Bound vocab only
// in context (formsFor → boundForms). Fewer than `count` back when the stage can't make that many.
var PLACEMENT_FORMS = { grammar: ['order', 'gap', 'patternMc'] };
function placementQuestions(unit, count, taken) {
  if (unit.kind !== 'kana' && unit.kind !== 'lesson') return [];
  var ctx = quizContext(unit), seen = {}, out = [];
  (taken || []).forEach(function (id) { seen[id] = true; });
  var kanaStage = unit.kind === 'kana';
  // a practice word is shown in kana on the stage (read-only list), so it is asked as its reading
  var asKana = function (it) { return it.word === it.reading || !KANA_WORD_RE.test(it.reading) ? it : Object.assign({}, it, { word: it.reading }); };
  var pool = kanaStage ? (unit.vocab || []).concat((unit.practice || []).map(asKana)) : ctx.items;
  pool = rndShuffle(pool.filter(function (it, i, a) {
    if (!it || seen[it.id] || a.map(function (x) { return x.id; }).indexOf(it.id) !== i) return false;
    return kanaStage ? it.kind === 'vocab' && KANA_WORD_RE.test(it.word) && Array.from(it.word).length >= 2 && kanaReadable(it.word, ctx.learned) : it.kind !== 'kana';
  }));
  for (var i = 0; i < pool.length && out.length < count; i++) {
    var it = pool[i], forms = rndShuffle(formsFor(it, ctx)), want = PLACEMENT_FORMS[it.kind];
    var rank = function (fm) { return want ? (want.indexOf(fm.name) < 0 ? 99 : want.indexOf(fm.name)) : fm.recall ? 0 : 1; };
    forms.sort(function (a, b) { return rank(a) - rank(b); });
    for (var j = 0; j < forms.length; j++) {
      var ex = forms[j].make();
      if (ex && !answerLeaks(Object.assign(ex, { item: it }))) {
        out.push(Object.assign(ex, { itemId: it.id, item: it, form: forms[j].name, recall: forms[j].recall }));
        break;
      }
    }
  }
  return out;
}

// ── Placement engine (roadmap ticket 36) ────────────────────────────────────
// Binary search over the teaching stages (kana + lesson units; review/prep/mock never), then
// spot-checks below the boundary. State is a plain mutable object:
//   s = placementStart(units, rnd?)      rnd = () => [0,1), default Math.random
//   set = placementNext(s)               { kind: 'probe'|'spot', stageId, round, wanted, questions[] } | null when done
//   placementAnswer(s, answers)          answers[i] = response to set.questions[i] (option index or typed
//                                        text, graded by answerIsRight); null/undefined = "I don't know" = wrong
//   placementResult(s)                   { passedStageIds, holeStageIds, startStageId, log }
// Probe = 2 questions of one stage, all right = known through it. No stage is asked twice and no item
// twice (s.taken). Spot round r (max 2; round 2 only when round 1 found a hole): 3 untested stages
// below the boundary at different fractions per round, 1 question each. A missed spot-check makes its
// stage a hole; it does NOT move the boundary. A stage that gives fewer questions than wanted is judged
// on what it gave (log entry asked < wanted); one that gives none counts as failed (probe) or is
// skipped (spot). s.answered = questions answered so far (progress bar: about 17).
var PLACEMENT_PROBE_QUESTIONS = 2;
var PLACEMENT_SPOT_FRACTIONS = [[0.2, 0.5, 0.85], [0.35, 0.65, 0.95]];
function placementStart(units, rnd) {
  var stages = units.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; });
  return { stages: stages, rnd: rnd || Math.random, lo: 0, hi: stages.length, searching: true, round: 0, roundMissed: false,
    tested: {}, taken: [], holes: [], spots: [], cur: null, done: false, log: [], answered: 0 };
}
function _placementAsk(s, stage, count) {
  var real = Math.random;
  Math.random = s.rnd; // the quiz builders shuffle with Math.random: inject ours for determinism
  try { return placementQuestions(stage, count, s.taken); } finally { Math.random = real; }
}
function _placementRound(s) { // queue the next spot round's stages (untested ones nearest each fraction of the boundary)
  var b = s.lo, f = PLACEMENT_SPOT_FRACTIONS[s.round++];
  s.roundMissed = false;
  f.forEach(function (fr) {
    var want = Math.max(1, Math.round(fr * b)), best = 0;
    for (var d = 0; d < b && !best; d++) {
      [want - d, want + d].forEach(function (n) { if (!best && n >= 1 && n <= b && !s.tested[s.stages[n - 1].id]) best = n; });
    }
    if (best) { s.tested[s.stages[best - 1].id] = true; s.spots.push(s.stages[best - 1]); }
  });
  if (!s.spots.length) s.done = true;
}
function placementNext(s) {
  while (!s.cur && !s.done) {
    if (s.spots.length) {
      var st = s.spots.shift(), qs = _placementAsk(s, st, 1);
      if (qs.length) s.cur = { kind: 'spot', stageId: st.id, round: s.round, wanted: 1, questions: qs };
      else s.log.push({ k: 'spot', stageId: st.id, right: 0, asked: 0, wanted: 1, pass: null, note: 'no questions available, skipped' });
    } else if (s.searching && s.lo < s.hi) {
      var m = Math.ceil((s.lo + s.hi) / 2), pu = s.stages[m - 1], pq = _placementAsk(s, pu, PLACEMENT_PROBE_QUESTIONS);
      s.tested[pu.id] = true;
      if (pq.length) s.cur = { kind: 'probe', stageId: pu.id, stage: m, round: 0, wanted: PLACEMENT_PROBE_QUESTIONS, questions: pq };
      else { s.hi = m - 1; s.log.push({ k: 'probe', stageId: pu.id, right: 0, asked: 0, wanted: PLACEMENT_PROBE_QUESTIONS, pass: false, note: 'no questions available, counted as not known' }); }
    } else if (s.round === 0 || (s.round < PLACEMENT_SPOT_FRACTIONS.length && s.roundMissed)) {
      s.searching = false; _placementRound(s);
    } else s.done = true;
  }
  return s.cur;
}
function placementAnswer(s, answers) {
  var c = s.cur;
  if (!c) return s;
  var right = c.questions.filter(function (q, i) { return answers && answers[i] != null && answerIsRight(q, answers[i]); }).length;
  c.questions.forEach(function (q) { s.taken.push(q.itemId); });
  s.answered += c.questions.length;
  var pass = right === c.questions.length;
  s.log.push({ k: c.kind, stageId: c.stageId, right: right, asked: c.questions.length, wanted: c.wanted, pass: pass,
    note: c.kind === 'probe' ? (pass ? 'known through this stage, search higher' : 'not yet, search lower') : (pass ? 'confirmed' : 'hole found') });
  if (c.kind === 'probe') { if (pass) s.lo = c.stage; else s.hi = c.stage - 1; }
  else if (!pass) { s.holes.push(c.stageId); s.roundMissed = true; }
  s.cur = null;
  return s;
}
function placementResult(s) {
  var passed = s.stages.slice(0, s.lo).map(function (u) { return u.id; }).filter(function (id) { return s.holes.indexOf(id) < 0; });
  return { passedStageIds: passed, holeStageIds: s.holes.slice(), startStageId: s.stages[s.lo] ? s.stages[s.lo].id : null, log: s.log.slice() };
}
// placementApply(result, units) → what the caller writes (pure; no store here):
//   doneIds     stages to mark done with skipped: true (= result.passedStageIds, plan order)
//   skippedIds  hole stages left unmarked ("you might revisit"), plan order
//   cardItems   item ids to seed as known cards via seedKnownCards: passed stages only, deduped
function placementApply(result, units) {
  var pass = {}, hole = {};
  result.passedStageIds.forEach(function (id) { pass[id] = true; });
  result.holeStageIds.forEach(function (id) { hole[id] = true; });
  var done = units.filter(function (u) { return pass[u.id]; });
  return {
    doneIds: done.map(function (u) { return u.id; }),
    skippedIds: units.filter(function (u) { return hole[u.id]; }).map(function (u) { return u.id; }),
    cardItems: unitItems(done).map(function (it) { return it.id; })
  };
}

// ── Welcome + placement UI helpers (roadmap ticket 39) ──────────────────────
// progressIsEmpty(docs): no unit / card / log / mock doc at all. Prefs and unlock docs don't count
// (the app writes prefs on first open), so the welcome shows once and never after an import or sync.
function progressIsEmpty(docs) {
  return !docs.some(function (d) { return /^(unit|card|log|mock):/.test(d._id); });
}
// examDateError(text, now) → null when it is a real date today or later, else 'bad' | 'past'.
function examDateError(text, now) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text || '');
  if (!m) return 'bad';
  var d = new Date(+m[1], +m[2] - 1, +m[3]);
  if (d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[3]) return 'bad';
  return text < localDate(new Date(now)) ? 'past' : null;
}
// placementScope(units, doneIds) → the units a (re)take may newly mark: those after the highest
// teaching stage already done. A first take (nothing done) gets every unit.
function placementScope(units, doneIds) {
  var top = -1;
  units.forEach(function (u) { if ((u.kind === 'kana' || u.kind === 'lesson') && doneIds.has(u.id)) top = Math.max(top, u.index); });
  return units.filter(function (u) { return u.index > top; });
}
// placementTrim(result, stages, pos) → the result as if the learner started at stages[pos]
// ("start earlier": only ever lower than the test's own start): fewer stages marked, holes below it kept.
function placementTrim(res, stages, pos) {
  var before = {};
  stages.slice(0, pos).forEach(function (u) { before[u.id] = true; });
  return {
    passedStageIds: res.passedStageIds.filter(function (id) { return before[id]; }),
    holeStageIds: res.holeStageIds.filter(function (id) { return before[id]; }),
    startStageId: stages[pos] ? stages[pos].id : null,
    log: res.log
  };
}
// placementReviewsWaiting(units, startIndex, doneIds) → review units inside the skipped range
// (before the start stage) that are still open. startIndex = units.length when everything is skipped.
function placementReviewsWaiting(units, startIndex, doneIds) {
  return units.filter(function (u) { return u.kind === 'review' && u.index < startIndex && !doneIds.has(u.id); });
}

// ── PWA (ticket 42) ──────────────────────────────────────────────────────────
// Storage persist: asked once per device, silently, after the first progress exists. The outcome lives in
// localStorage under PERSIST_KEY (device-only: deliberately NOT in DEVICE_PREF_KEYS, never exported).
var PERSIST_KEY = 'jlpt_persist'; // 'granted' | 'denied'
function hasProgressDocs(docs) {
  return docs.some(function (d) { return /^(unit|card|log):/.test(d._id || ''); });
}
// persistOnce(docs, storage, ls) → Promise<'granted'|'denied'|'unsupported'|null>. null = no progress yet (retry
// later); 'unsupported' is not remembered (a browser update may add it). ls = { get, set }.
function persistOnce(docs, storage, ls) {
  var known = ls.get(PERSIST_KEY);
  if (known) return Promise.resolve(known);
  if (!hasProgressDocs(docs)) return Promise.resolve(null);
  if (!storage || typeof storage.persist !== 'function') return Promise.resolve('unsupported');
  return storage.persist().then(function (ok) {
    var r = ok ? 'granted' : 'denied';
    ls.set(PERSIST_KEY, r);
    return r;
  }, function () { return 'unsupported'; });
}
// pwaInstallState(env) → 'hidden' (file:// or no worker support) | 'installed' | 'prompt' | 'ios' | 'none'.
// env: { http, standalone, hasPrompt, ios }.
function pwaInstallState(env) {
  if (env.standalone) return 'installed';
  if (!env.http) return 'hidden';
  if (env.hasPrompt) return 'prompt';
  if (env.ios) return 'ios';
  return 'none';
}

// ── Donation jar soft prompt (components/donate.js) ──────────────────────────
// Shown on the passed-quiz result screen at milestones only: the level's last unit ('level'), a
// mock ('mock') or a review unit ('review'). At most once per SUPPORT_ASK_GAP_DAYS, never after
// "Don't ask again". State is device-only, { dismissed, lastAskedAt }.
var SUPPORT_ASK_GAP_DAYS = 14;
// supportMilestone(unit, units): which milestone a passed unit is, or null.
function supportMilestone(unit, units) {
  var same = units.filter(function (u) { return u.level === unit.level; });
  if (same.length && same[same.length - 1].id === unit.id) return 'level';
  if (unit.kind === 'mock') return 'mock';
  if (unit.kind === 'review') return 'review';
  return null;
}
// shouldAskSupport(milestone, state, now): milestone = supportMilestone result.
function shouldAskSupport(milestone, state, now) {
  state = state || {};
  if (!milestone || state.dismissed) return false;
  if (!state.lastAskedAt) return true;
  return now - state.lastAskedAt >= SUPPORT_ASK_GAP_DAYS * 86400000;
}
