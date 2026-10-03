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
      // passages: reading texts a unit's quiz asks about (ticket 15); not taught items, no cards
      var ps = u.passages || [];
      for (var q = 0; q < ps.length; q++) {
        var pi = catalog.items[ps[q]];
        if (!pi || pi.kind !== 'passage') return { valid: false, error: u.id + ' references missing passage ' + ps[q] };
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
function passMark(kind) { return kind === 'kana' ? 0.9 : 0.8; }
function quizPassed(right, total, kind) { return total > 0 && right / total >= passMark(kind) - 1e-9; }
// quizLength: kana 10, lesson N5 12 / N4 14 / N3+ 16, review 20. Kana and lesson
// quizzes grow to ask every item once (nItems), capped at QUIZ_MAX_QUESTIONS.
// ponytail: 30 = the biggest N5 unit (21 kana) with room; units past it get
// a random 30 of their items — split the unit if that ever happens.
var QUIZ_MAX_QUESTIONS = 30;
function quizLength(unit, nItems) {
  if (unit.kind === 'review') return 20;
  var base = unit.kind === 'kana' ? 10 : [12, 14][levelRank(unit.level)] || 16;
  return Math.min(QUIZ_MAX_QUESTIONS, Math.max(base, nItems || 0));
}

// Catalog item → display strings
function glossText(v) { return v.gloss.join(' / '); }
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
// (し/つ, か/が, きゃ/きゅ, しゃ/ちゃ), then the unit's own kana (pool), then any.
function kanaDistractors(k, n, pool) {
  var first = k.char.charAt(0), small = k.char.slice(1);
  var like = KANA_LOOKALIKES.filter(function (s) { return s.indexOf(kanaBase(first)) >= 0; }).join('');
  var tier = function (x) {
    var f = x.char.charAt(0);
    var sameSmall = x.char.slice(1) === small;
    if (like.indexOf(f) >= 0 && sameSmall) return 0; // シ → ツ before ジ/ヅ
    if (kanaBase(f) === kanaBase(first) || like.indexOf(kanaBase(f)) >= 0 && sameSmall) return 1;
    return pool.indexOf(x) >= 0 ? 2 : 3;
  };
  var cands = catalogOf('kana').filter(function (x) {
    return x.script === k.script && x.id !== k.id && x.char.length === k.char.length &&
      x.answers.indexOf(k.romaji) < 0 && k.answers.indexOf(x.romaji) < 0;
  });
  return [0, 1, 2, 3].reduce(function (acc, t) {
    return acc.concat(rndShuffle(cands.filter(function (x) { return tier(x) === t; })));
  }, []).slice(0, n);
}

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
// kanjiValidReadings: every reading of k in hiragana, incl. extra and kun stems (た of た.べる).
function kanjiValidReadings(k) {
  return kanjiReadings(k).concat(k.extra || [], (k.kun || []).map(function (r) { return r.split('.')[0]; })).map(kataToHira);
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

// Per field: texts(item, answer) = the option text(s) an item offers; reject(cand,
// target, answer, prep(target)) = would be a second right answer; score(cand, target, answer)
// = tuple after [level distance], lower first. cand = { it, text, taught }.
var lenBucket = function (a, b, step) { return Math.min(3, Math.floor(Math.abs(a.length - b.length) / step)); };
var posFamily = function (p) { return (p || '').split('-')[0]; };
var DISTRACTOR_RULES = {
  gloss: { // vocab meaning
    texts: function (it) { return [glossText(it)]; },
    // same word/reading = homograph or homophone: right answer too (and in listening)
    reject: function (c, t, ans) { return c.it.word === t.word || c.it.reading === t.reading || sharesSense(c.text, ans); },
    score: function (c, t, ans) {
      var tags = t.tags || [];
      return [posFamily(c.it.pos) !== posFamily(t.pos), !c.taught, c.it.pos !== t.pos,
        !(c.it.tags || []).some(function (x) { return tags.indexOf(x) >= 0; }), lenBucket(c.text, ans, 6)];
    }
  },
  word: { // meaning → word
    texts: function (it) { return [it.word]; },
    reject: function (c, t) { return sharesSense(glossText(c.it), glossText(t)); },
    score: function (c, t, ans) {
      return [scriptShape(c.text) !== scriptShape(ans), !c.taught, posFamily(c.it.pos) !== posFamily(t.pos),
        lenBucket(c.text, ans, 1), Math.min(3, editDistance(kataToHira(c.it.reading), kataToHira(t.reading)))];
    }
  },
  reading: { // word → reading; synthesized fakes allowed here only
    texts: function (it) { return [it.reading]; },
    fakes: true,
    prep: function (t) { // every reading of the same spelling (一日: いちにち, ついたち)
      return catalogOf('vocab').filter(function (v) { return v.word === t.word; }).map(function (v) { return v.reading; });
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
// field's score; random within a tie.
function pickDistractors(target, pool, field, n, opts) {
  opts = opts || {};
  var rule = DISTRACTOR_RULES[field], taught = opts.taught || {};
  var ans = opts.answer || rule.texts(target, '')[0];
  var lv = levelRank(target.level || opts.level);
  var ctx = rule.prep ? rule.prep(target) : null, cands = [];
  pool.forEach(function (it) {
    if (it.id === target.id || it.kind !== target.kind) return;
    rule.texts(it, ans).forEach(function (text) { cands.push({ it: it, text: text, taught: !!taught[it.id] }); });
  });
  if (rule.fakes) readingFakes(kataToHira(ans)).forEach(function (text) { cands.push({ it: target, text: text, taught: true }); });
  var scored = rndShuffle(cands).filter(function (c) {
    return c.text && c.text !== ans && !rule.reject(c, target, ans, ctx);
  }).map(function (c) {
    var l = levelRank(c.it.level || opts.level);
    return { text: c.text, s: [lv < 0 || l < 0 ? 0 : Math.abs(l - lv)].concat(rule.score(c, target, ans)) };
  });
  scored.sort(function (a, b) {
    for (var i = 0; i < a.s.length; i++) if (+a.s[i] !== +b.s[i]) return +a.s[i] - +b.s[i];
    return 0;
  });
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
// quizItems(unit): what a quiz asks about. A review mixes the previous 6
// kana/lesson units (Q29), else its own items.
function quizItems(unit) {
  if (unit.kind === 'review') {
    var prev = allUnits().filter(function (u) {
      return u.index < unit.index && (u.kind === 'lesson' || u.kind === 'kana');
    }).slice(-6);
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
// Confusables that fit the same slot with the same meaning: never distractors
// for each other (two right answers). ponytail: hand list from reviewing every
// generated N5 gap; extend it when a new level's confusables land.
var GAP_INTERCHANGEABLE = [['g:kedo', 'g:keredomo', 'g:ga'], ['g:kara', 'g:node'], ['g:ni', 'g:ni-ikimasu', 'g:made'], ['g:to', 'g:ya'],
  ['g:ne', 'g:yo'], ['g:masen-ka', 'g:mashou-ka'], ['g:nakute-wa-ikenai', 'g:nakute-wa-naranai', 'g:nakucha-ikenai']];

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
// orderQuestion(s, taughtKanji): ★ sentence composition from s.chunks. The ★ goes in one
// of the slots the author marked as fixed by grammar (default all four).
function orderQuestion(s, taughtKanji) {
  var c = s.chunks, raw = quizFurigana(furiganaParts(s.furigana || s.jp), taughtKanji, '');
  var star = rndShuffle(c.star || [0, 1, 2, 3])[0], at = c.pre.length;
  var chunkParts = c.move.map(function (m) { var p = sliceParts(raw, at, at + m.length); at += m.length; return p; });
  var slots = STAR_SLOTS.map(function (x, i) { return i === star ? '＿★＿' : x; }).join(' ');
  var order = rndShuffle([0, 1, 2, 3]);
  return { type: 'order', prompt: 'Which goes in the ★ slot?', question: c.pre + ' ' + slots + ' ' + c.post,
    parts: sliceParts(raw, 0, c.pre.length).concat({ t: ' ' + slots + ' ' }, sliceParts(raw, at, Infinity)),
    options: order.map(function (i) { return c.move[i]; }), optionParts: order.map(function (i) { return chunkParts[i]; }),
    correct: order.indexOf(star), star: star, sentence: s.id };
}
// mcFromAuthored(options, answer): shuffled options + the answer's new index.
function mcFromAuthored(options, answer) {
  var opts = rndShuffle(options);
  return { options: opts, correct: opts.indexOf(options[answer]) };
}
function iikaeQuestion(m, taughtKanji) {
  var raw = quizFurigana(furiganaParts(m.furigana || m.jp), taughtKanji, ''), at = m.jp.indexOf(m.underline);
  var parts = spliceParts(raw, at, at + m.underline.length, [{ t: m.underline, u: true }]);
  return Object.assign({ type: 'iikae', prompt: 'Which sentence means about the same? (look at the underlined part)', question: m.jp, parts: parts },
    mcFromAuthored(m.options, m.answer));
}
// bunshouQuestion(m, n, taughtKanji): blank n (1-based) of a text with blanks; the
// passage shows every blank as （ k ）, the asked one underlined.
function bunshouQuestion(m, n, taughtKanji) {
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
    mcFromAuthored(b.options, b.answer));
}
// mondaiQuestions(type, item, ctx) → [question] (bunshou: one per blank; [] when the
// item can't make that type). type = a MONDAI key; ctx = quizContext(unit).
function mondaiQuestions(type, item, ctx) {
  var tag = function (ex) { return ex && Object.assign(ex, { itemId: item.id, item: item, form: type, recall: false }); };
  if (type === 'bunshou') return item.blanks.map(function (_, i) { return tag(bunshouQuestion(item, i + 1, ctx.taughtKanji)); });
  var fm = formsFor(item, ctx).filter(function (x) { return x.name === type; })[0];
  var ex = fm && fm.make();
  return ex ? [tag(ex)] : [];
}

// ── Quiz composition (Q29-Q31) ──────────────────────────────────────────────
var RECALL_SHARE = 0.4; // Q30: at least this share typed (recall), the rest MC
var IME_HINT = 'Type in kana with a Japanese keyboard (IME).';
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
  return {
    unit: unit, items: items, rank: rank, taught: taught, taughtKanji: taughtKanji,
    vocab: own('vocab'), vPool: poolOf('vocab'), kPool: poolOf('kanji'), gPool: poolOf('grammar'),
    // verbs to conjugate: the quiz's own first, then any taught one
    verbs: own('vocab').filter(isVerbItem).concat(taughtVocab.filter(isVerbItem)),
    // N3+ cycles through the forms by unit; below that only a unit teaching a form point asks one
    conjForm: conjPoint ? conjPoint.conjForm : rank >= 2 ? CONJ_FORMS[(unit.index || 0) % CONJ_FORMS.length] : null
  };
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
    return { type: 'conjugation', prompt: 'Conjugate to ' + form + ':', question: v.word, parts: wordParts(v),
      answers: c.kanji === c.kana ? [c.kana] : [c.kanji, c.kana], targetForm: form, placeholder: form + '...', conjItem: v.id };
  };
  var f = function (name, recall, make) { return { name: name, recall: recall, make: make }; };
  // inSentence(w, make): make(sentence, raw furigana parts, span) for a random catalog
  // sentence that uses vocab w and holds it once with its reading; first non-null result.
  var inSentence = function (w, make) {
    var sents = rndShuffle(sentencesUsing(w.id));
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
      var d = kanaDistractors(k, 3, ctx.items.filter(function (x) { return x.kind === 'kana'; }));
      var right = toRomaji ? k.romaji : k.char;
      var opts = rndShuffle([right].concat(d.map(function (x) { return toRomaji ? x.romaji : x.char; })));
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

  if (item.kind === 'vocab') {
    var v = item, kanjiWord = hasKanji(v.word);
    var forms = [
      f('meaningType', true, function () {
        return typing('What does this word mean? (type in English)', v.word, meaningAnswers(v.gloss), 'English meaning...', { parts: wordParts(v) });
      }),
      f('readingType', true, function () {
        return kanjiWord ? typing('Type the reading of this word in hiragana:', v.word, [kataToHira(v.reading), v.reading].filter(function (a, i, arr) { return arr.indexOf(a) === i; }),
          'ひらがな…', { hint: IME_HINT }) : null;
      }),
      f('enToJp', true, function () {
        // only when no other taught word shares a sense (else two right answers)
        var clash = ctx.vPool.some(function (x) { return x !== v && ctx.taught[x.id] && x.word !== v.word && sharesSense(glossText(x), glossText(v)); });
        var ans = [v.reading, kataToHira(v.reading), v.word].filter(function (a, i, arr) { return arr.indexOf(a) === i; });
        return clash ? null : typing('Type the Japanese for "' + glossText(v) + '":', '', ans, 'にほんご…', { hint: IME_HINT });
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
            (x.level === v.level || ctx.taught[x.id]) && !sharesSense(glossText(x), glossText(v));
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
      forms.push(f('listen', false, function () { return mc('listen', 'Listen and choose the meaning:', v.word, 'gloss', ctx.vPool, null, { audio: v.word }); }));
    }
    if (rank >= 2 && ctx.vocab.length >= 4) forms.push(f('pairMatch', false, function () {
      var pairs = [v].concat(rndShuffle(ctx.vocab.filter(function (x) { return x !== v; })).slice(0, 3)).map(function (x) { return [x.word, glossText(x)]; });
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
      // any one reading; on accepted in hiragana too
      f('kanjiReadType', true, function () {
        return typing('Type the reading for this character:', kj.char, rs.concat((kj.on || []).map(kataToHira)), 'e.g. ' + rs[0], { hint: IME_HINT });
      }),
      f('kanjiMeanType', true, function () { return typing('What does this kanji mean? (type in English)', kj.char, meaningAnswers(kj.meaning), 'English meaning...'); }),
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
        var sents = rndShuffle((g.examples || []).map(function (id) { return CATALOG.items[id]; }).filter(Boolean));
        var surfaces = gapSurfaces(g);
        for (var i = 0; i < sents.length; i++) {
          var s = sents[i], base = quizFurigana(furiganaParts(s.furigana || s.jp), ctx.taughtKanji, '');
          for (var j = 0; j < surfaces.length; j++) {
            var parts = gapParts(base, surfaces[j]);
            if (!parts) continue;
            var ans = surfaces[j];
            var friends = [].concat.apply([g.id], GAP_INTERCHANGEABLE.filter(function (set) { return set.indexOf(g.id) >= 0; }));
            var d = [];
            GRAMMAR_CONFUSABLES.filter(function (set) { return set.indexOf(g.id) >= 0; }).forEach(function (set) {
              set.forEach(function (id) {
                var c = CATALOG.items[id], txt = c && gapSurfaces(c)[0];
                if (!txt || friends.indexOf(id) >= 0 || surfaces.indexOf(txt) >= 0 || d.indexOf(txt) >= 0 || sharesSense(c.meaning, g.meaning)) return;
                d.push(txt);
              });
            });
            if (d.length < 2) return null;
            var opts = rndShuffle([ans].concat(rndShuffle(d).slice(0, 3)));
            return { type: 'gap', prompt: 'Choose what fills the gap:', question: parts.map(function (p) { return p.t; }).join(''),
              parts: parts, note: s.en, options: opts, correct: opts.indexOf(ans) };
          }
        }
        return null;
      }),
      f('order', false, function () {
        var s = rndShuffle(sentencesUsing(g.id).filter(function (x) { return x.chunks; }))[0];
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

// makeQuestion(item, ctx, wantRecall, avoid): one exercise for item — a form
// of the wanted kind (true recall / false MC / null any) not in avoid if
// possible, then any other fresh form, then a repeat. Tagged with itemId, form,
// recall and the item itself (for the re-queue). null when nothing fits.
function makeQuestion(item, ctx, wantRecall, avoid, strict) {
  var forms = formsFor(item, ctx);
  var fresh = forms.filter(function (fm) { return avoid.indexOf(fm.name) < 0; });
  var tryAll = function (fs) {
    var list = rndShuffle(fs);
    for (var i = 0; i < list.length; i++) {
      var ex = list[i].make();
      if (ex) return Object.assign(ex, { itemId: item.id, item: item, form: list[i].name, recall: list[i].recall });
    }
    return null;
  };
  var want = function (fs) { return wantRecall === null ? fs : fs.filter(function (fm) { return fm.recall === wantRecall; }); };
  if (strict) return tryAll(want(fresh));
  return tryAll(want(fresh)) || tryAll(fresh) || tryAll(want(forms)) || tryAll(forms);
}

// buildExercises(unit): a fresh quiz for one resolved unit (buildUnits). Every
// item once (a review samples 20), then extra questions in other forms up to
// quizLength; at least RECALL_SHARE typed answers. A unit with passages (reviews) ends
// with their reading questions, in place of the same number of item questions.
function buildExercises(unit) {
  var ctx = quizContext(unit);
  if (!ctx.items.length) return [];
  var total = quizLength(unit, ctx.items.length);
  var reading = readingExercises(unit, ctx.taughtKanji); // takes slots from the item questions
  var n = total - reading.length;
  // grammar first in the first round, so a form point (て-form…) gets its recall
  // (conjugation) question while the recall share is still open
  var gram = rndShuffle(ctx.items.filter(function (it) { return it.kind === 'grammar'; }));
  var order = gram.concat(rndShuffle(ctx.items.filter(function (it) { return it.kind !== 'grammar'; })));
  while (order.length < n) order = order.concat(rndShuffle(ctx.items));
  order = order.slice(0, n);
  var need = Math.ceil(total * RECALL_SHARE), used = {}, out = [];
  var recallCount = function () { return out.filter(function (e) { return e.recall; }).length; };
  order.forEach(function (it) {
    var ex = makeQuestion(it, ctx, recallCount() < need, used[it.id] || []);
    if (!ex) return;
    out.push(ex);
    (used[it.id] = used[it.id] || []).push(ex.form);
  });
  // top-up: swap MC questions for recall ones until the share is met
  for (var i = 0; i < out.length && recallCount() < need; i++) {
    if (out[i].recall) continue;
    var r = makeQuestion(out[i].item, ctx, true, used[out[i].itemId], true) || makeQuestion(out[i].item, ctx, true, [], true);
    if (r) out[i] = r;
  }
  // reading questions last, as on the test
  return rndShuffle(out).concat(reading);
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
  var ruby = function (s) { return quizFurigana(furiganaParts(s), taughtKanji || {}, ''); };
  var text = function (s) { return furiganaParts(s).map(function (p) { return p.t; }).join(''); };
  (unit.passages || []).forEach(function (id) {
    var p = CATALOG.items[id];
    if (!p || p.kind !== 'passage') return;
    p.questions.forEach(function (q) {
      var order = rndShuffle(q.options.map(function (_, i) { return i; }));
      out.push({ type: 'reading', prompt: 'Read the text and answer the question.', passage: ruby(p.furigana),
        question: text(q.q), parts: ruby(q.q), options: order.map(function (i) { return text(q.options[i]); }),
        optionParts: order.map(function (i) { return ruby(q.options[i]); }), correct: order.indexOf(q.answer),
        explain: q.explain, itemId: p.id, form: 'reading', recall: false });
    });
  });
  return out;
}

// requeueExercise(unit, ex): a missed question asked again at the end of the
// quiz (Q31), same item in another form when there is one. Not scored.
function requeueExercise(unit, ex) {
  var o = ex.type === 'reading' && rndShuffle(ex.options.map(function (_, i) { return i; })); // same question, options reshuffled
  var r = o ? Object.assign({}, ex, { options: o.map(function (i) { return ex.options[i]; }), optionParts: o.map(function (i) { return ex.optionParts[i]; }), correct: o.indexOf(ex.correct) })
    : ex.item && makeQuestion(ex.item, quizContext(unit), null, [ex.form]);
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
  return checkTyping(String(resp == null ? '' : resp), ex.answers);
}

// scoreQuiz(kind, exs, results): results[i] = was exs[i] right. Score = first
// attempts (re-queued questions don't count); missed = items answered wrong
// on any attempt (flagged for SRS).
function scoreQuiz(kind, exs, results) {
  var right = 0, total = 0, missed = [];
  exs.forEach(function (e, i) {
    if (i >= results.length) return;
    if (!e.requeue) { total++; if (results[i]) right++; }
    if (!results[i] && e.itemId && missed.indexOf(e.itemId) < 0) missed.push(e.itemId);
  });
  return { right: right, total: total, need: passMark(kind), passed: quizPassed(right, total, kind), missed: missed };
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
function checkTyping(userAns, answers) {
  if (userAns.length > 200) return false;
  var u = foldAns(userAns);
  var uNorm = normAns(userAns);
  if (!answers || !answers.length) return false;
  return answers.some(function (a) {
    if (typeof a !== 'string') return false;
    // split before folding so full-width ／ ， in an answer stay literal, as before
    var parts = a.split(/[\/,]/).map(foldAns);
    var partsNorm = a.split(/[\/,]/).map(function (s) {
      return normAns(s);
    });
    return foldAns(a) === u || parts.includes(u) || partsNorm.includes(uNorm);
  });
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
// valid { palette, theme }. Default = Aizome dark.
function normalizeThemePrefs(palette, theme) {
  var known = THEME_PALETTES.some(function (p) { return p.id === palette; });
  return { palette: known ? palette : 'ai', theme: theme === 'light' ? 'light' : 'dark' };
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
function srsReview(card, quality) {
  var q = [0, 3, 4, 5][quality];
  var interval = card.interval,
    ease = card.ease,
    reps = card.reps;
  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) interval = 1;else if (reps === 1) interval = 6;else interval = Math.round(interval * ease);
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

// ── Store docs (synced learning data, persisted by store.js) ────────────────
// One doc per entity; every doc also carries updatedAt (ms) + deviceId.
//   unit:<unitId>   { done, completedAt (ms | null) }
//   card:<itemId>   SRS card fields (id, type, front, back, reading?, interval,
//                   ease, due, reps) + lastReviewedAt (0 = never reviewed)
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
// Reserved, not written yet (features come later):
//   ach:<id>            { unlockedAt }   merge: earliest unlock wins, never deleted
// Device-only prefs stay in localStorage and never become docs:
var DEVICE_PREF_KEYS = ['jlpt_palette', 'jlpt_theme', 'jlpt_tts_rate', 'jlpt_sfx_mute'];
var STORE_ID_RE = /^(unit:n[1-5]\.u\d{3}|card:(v:[^|\s]+\|[^|\s]+|k:\S+|g:[\w-]+|c:\S+)|prefs:learning|log:\d{4}-\d{2}-\d{2}:[\w-]+)$/;
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
// perfectQuizzes, reviews }.
function activityTotals(logs) {
  var days = {}, t = { lessons: 0, quizzes: 0, perfectQuizzes: 0, reviews: 0 };
  logs.forEach(function (raw) {
    var l = normalizeLog(raw);
    l.lessons.forEach(function (n) { days[n] = true; });
    t.quizzes += l.quizzes.length;
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
  return a._id.indexOf('log:') === 0 ? mergeLogDocs(a, b) : pickStoreWinner(a, b);
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
    return d._id.indexOf('unit:') === 0 && d.done && d.completedAt && localDate(new Date(d.completedAt)) === today;
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

// docsToSnapshot: docs → App's synchronous state shape.
function docsToSnapshot(docs) {
  var snap = { completed: [], srsCards: {}, currentUnit: null, pace: 1, examDate: null, furiganaPref: null, uiLang: 'en', kanjiView: 'rows', pendingCards: [] };
  docs.forEach(function (d) {
    if (d._id.indexOf('unit:') === 0) {
      if (d.done) snap.completed.push(d._id.slice(5));
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
    }
  });
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
    if (d._id.indexOf('card:') === 0 && ['interval', 'ease', 'due', 'reps'].some(function (f) {
      return typeof d[f] !== 'number';
    })) return bad(d._id + ' missing SRS fields');
    if (d._id.indexOf('log:') === 0 && d.date !== d._id.split(':')[1]) return bad(d._id + ' date mismatch');
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
