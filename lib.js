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

// ── Levels ───────────────────────────────────────────────────────────────────
var LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
// levelRank: 0 (N5) … 4 (N1); -1 for anything else. "N3+" = levelRank(lv) >= 2.
function levelRank(level) { return LEVELS.indexOf(level); }

// ── Units: PLAN + CATALOG joined (spec §4) ──────────────────────────────────
var UNIT_KINDS = ['lesson', 'review', 'prep', 'mock'];
var UNIT_ITEM_FIELDS = { vocab: 'vocab', kanji: 'kanji', grammar: 'grammar' }; // unit field → item kind
var REVIEW_SPAN = 3; // review units quiz the previous N lesson units

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
      for (var f in UNIT_ITEM_FIELDS) {
        var ids = u[f] || [];
        for (var j = 0; j < ids.length; j++) {
          var it = catalog.items[ids[j]];
          if (!it) return { valid: false, error: u.id + ' references missing ' + ids[j] };
          if (it.kind !== UNIT_ITEM_FIELDS[f]) return { valid: false, error: u.id + '.' + f + ' has ' + it.kind + ' ' + ids[j] };
        }
      }
    }
  }
  return { valid: true, error: null };
}

// buildUnits: flat, ordered list of resolved units — plan fields + `index`
// (global position) with vocab/kanji/grammar as catalog items. A review unit
// gets the items of the previous REVIEW_SPAN lesson units. Call validatePlan first.
function buildUnits(plan, catalog) {
  var out = [];
  plan.slice().sort(function (a, b) { return levelRank(a.level) - levelRank(b.level); }).forEach(function (lp) {
    lp.units.forEach(function (u) {
      var r = Object.assign({}, u, { index: out.length });
      if (u.kind === 'review') {
        var prev = out.filter(function (x) { return x.kind === 'lesson'; }).slice(-REVIEW_SPAN);
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
          r[f] = [].concat.apply([], prev.map(function (x) { return x[f]; }));
        });
      } else {
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
          r[f] = (u[f] || []).map(function (id) { return catalog.items[id]; });
        });
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

function exerciseCap(level) {
  var r = levelRank(level);
  return r <= 1 ? 5 : r === 2 ? 7 : 9;
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

// buildExercises(unit): a shuffled, capped quiz for one resolved unit (buildUnits).
function buildExercises(unit) {
  var exs = [];
  var rank = levelRank(unit.level);
  var vocabItems = unit.vocab || [];
  var kanjiItems = unit.kanji || [];
  var row = function (v) { return [v.word, v.reading, glossText(v)]; };
  var kRow = function (k) { return [k.char, kanjiReadings(k).join('・')]; };
  var vocab0 = vocabItems.map(row);
  var allVocab = catalogOf('vocab').map(row);
  var allChars = catalogOf('kanji').map(kRow);

  // Listening exercise: hear a word, pick its meaning
  if (vocab0.length >= 2 && window.speechSynthesis) {
    var vocab = rndShuffle(vocab0);
    var v = vocab[0];
    var wrongM = rndShuffle(allVocab.filter(function (w) {
      return w[2] && w[2].trim() && w[2] !== v[2];
    })).slice(0, 3);
    var opts = rndShuffle([v[2]].concat(wrongM.map(function (w) { return w[2]; })));
    exs.push({
      type: 'listen',
      prompt: 'Listen and choose the meaning:',
      question: v[0],
      audio: v[0],
      options: opts,
      correct: opts.indexOf(v[2])
    });
  }

  // ── Kanji exercises ──
  if (kanjiItems.length > 0) {
    var ks = rndShuffle(kanjiItems);

    // MC: kanji → readings
    var c0 = kRow(ks[0]);
    var wrongs = rndShuffle(allChars.filter(function (c) {
      return c[1] && c[1].trim() && c[1] !== c0[1];
    })).slice(0, 3);
    var mcOpts = rndShuffle([c0[1]].concat(wrongs.map(function (c) { return c[1]; })));
    exs.push({
      type: 'mc',
      prompt: 'What is the reading for this character?',
      question: c0[0],
      options: mcOpts,
      correct: mcOpts.indexOf(c0[1])
    });

    // Typing: kanji → any one reading (on accepted in hiragana too)
    if (ks.length > 1) {
      var k1 = ks[1], r1 = kanjiReadings(k1);
      exs.push({
        type: 'typing',
        prompt: 'Type the reading for this character:',
        question: k1.char,
        answers: r1.concat((k1.on || []).map(kataToHira)),
        placeholder: 'e.g. ' + r1[0]
      });
    }
  }

  // ── Vocab exercises ──
  if (vocab0.length > 0) {
    var _vocab = rndShuffle(vocab0);

    // MC: word → meaning
    var v0 = _vocab[0];
    var _wrongM = rndShuffle(allVocab.filter(function (w) {
      return w[2] && w[2].trim() && w[2] !== v0[2];
    })).slice(0, 3);
    var mcM = rndShuffle([v0[2]].concat(_wrongM.map(function (w) { return w[2]; })));
    exs.push({
      type: 'mc',
      prompt: 'What does this word mean?',
      question: v0[0],
      options: mcM,
      correct: mcM.indexOf(v0[2])
    });

    // MC: meaning → word (pick the right Japanese)
    if (_vocab.length > 1) {
      var v1 = _vocab[1];
      var wrongW = rndShuffle(allVocab.filter(function (w) {
        return w[0] && w[0].trim() && w[0] !== v1[0];
      })).slice(0, 3);
      var mcW = rndShuffle([v1[0]].concat(wrongW.map(function (w) { return w[0]; })));
      exs.push({
        type: 'mc',
        prompt: 'Which word means "' + v1[2] + '"?',
        question: '',
        options: mcW,
        correct: mcW.indexOf(v1[0])
      });
    }

    // Typing: word → English meaning
    if (_vocab.length > 2) {
      var v2 = _vocab[2];
      var answers = v2[2].split(/[\/,]/).map(function (s) { return s.trim(); }).filter(Boolean);
      exs.push({
        type: 'typing',
        prompt: 'What does this word mean? (type in English)',
        question: v2[0],
        answers: answers,
        placeholder: 'English meaning...'
      });
    }

    // Listening: hear a word, pick meaning
    var vL = rndShuffle(vocab0)[0];
    var wrongL = rndShuffle(allVocab.filter(function (w) {
      return w[2] !== vL[2];
    })).slice(0, 3);
    var mcL = rndShuffle([vL[2]].concat(wrongL.map(function (w) { return w[2]; })));
    exs.push({
      type: 'listen',
      prompt: 'Listen and choose the meaning:',
      question: vL[0],
      audio: vL[0],
      options: mcL,
      correct: mcL.indexOf(vL[2])
    });
  }

  // ── N3+ exercise types ──────────────────────────────────────────────────
  // ponytail: no reading-comprehension exercise until passages are catalog
  // items (spec §1 `passage`); the renderer (typing + ex.passage) stays.

  // Conjugation (N3+): verbs by item pos, else the old "to …" gloss heuristic
  if (rank >= 2) {
    var form = CONJ_FORMS[(unit.index || 0) % CONJ_FORMS.length];
    var vConj = rndShuffle(vocabItems.filter(function (v) {
      var g = glossText(v);
      var isVerb = v.pos ? /^verb/.test(v.pos) : /^to /i.test(g) && !/passive|potential|causative/i.test(g);
      return isVerb && conjugate(v.word, v.reading, form, v.pos);
    }))[0];
    if (vConj) {
      var conj = conjugate(vConj.word, vConj.reading, form, vConj.pos);
      exs.push({
        type: 'conjugation',
        prompt: 'Conjugate to ' + form + ':',
        question: vConj.word + (vConj.word !== vConj.reading ? ' (' + vConj.reading + ')' : ''),
        answers: conj.kanji === conj.kana ? [conj.kana] : [conj.kanji, conj.kana],
        targetForm: form,
        placeholder: form + '...'
      });
    }
  }

  // Pair match (N3+): word → meaning
  if (rank >= 2 && vocab0.length >= 4) {
    var pairs = vocab0.slice(0, 4);
    var pairAnswers = pairs.map(function (v) { return v[2]; });
    exs.push({
      type: 'pair_match',
      prompt: 'Match each word to its meaning:',
      question: '',
      items: rndShuffle(pairs.map(function (v) { return v[0]; })),
      answers: pairAnswers,
      pairs: pairs.map(function (v) { return [v[0], v[2]]; }), // word → meaning (items are shuffled)
      options: rndShuffle(pairAnswers)
    });
  }

  // Fill-in-the-blank (N3+): meaning → pattern
  var gram = (unit.grammar || [])[0];
  if (rank >= 2 && gram) {
    var wrongPats = rndShuffle(catalogOf('grammar').map(function (g) { return g.pattern; }).filter(function (p, i, arr) {
      return p !== gram.pattern && arr.indexOf(p) === i;
    })).slice(0, 3);
    if (wrongPats.length >= 2) {
      var fillOpts = rndShuffle([gram.pattern].concat(wrongPats));
      exs.push({
        type: 'fill_blank',
        prompt: 'Choose the correct grammar pattern:',
        question: gram.meaning,
        options: fillOpts,
        correct: fillOpts.indexOf(gram.pattern)
      });
    }
  }

  // Synonym exercise (N2+)
  if (rank >= 3 && vocab0.length >= 3) {
    var vSyn = rndShuffle(vocab0)[0];
    var wrongSyn = rndShuffle(allVocab.filter(function (w) {
      return w[2] && w[2].trim() && w[2] !== vSyn[2] && w[0] !== vSyn[0];
    })).slice(0, 3);
    var synOpts = rndShuffle([vSyn[2]].concat(wrongSyn.map(function (w) { return w[2]; })));
    exs.push({
      type: 'synonym',
      prompt: 'Choose the closest meaning to: ' + vSyn[0],
      question: vSyn[0],
      options: synOpts,
      correct: synOpts.indexOf(vSyn[2])
    });
  }

  // ponytail: no reorder until the catalog has hand-authored chunks (ticket 11);
  // heuristic splitting broke words (信頼で|きる). The reorder renderer stays.

  // Kanji reading (N2+)
  if (rank >= 3 && kanjiItems.length >= 2) {
    var kChar = kRow(rndShuffle(kanjiItems)[0]);
    var wrongK = rndShuffle(allChars.filter(function (c) {
      return c[1] && c[1].trim() && c[1] !== kChar[1];
    })).slice(0, 3);
    var kOpts = rndShuffle([kChar[1]].concat(wrongK.map(function (c) { return c[1]; })));
    exs.push({
      type: 'kanji_reading',
      prompt: 'Select the correct reading:',
      question: kChar[0],
      options: kOpts,
      correct: kOpts.indexOf(kChar[1])
    });
  }

  var cap = unit.quiz && unit.quiz.cap || exerciseCap(unit.level);
  return rndShuffle(exs).slice(0, cap);
}
function normAns(s) {
  return s.trim().toLowerCase().replace(/[!"#$%&'()*+,./:;<=>?@[\]^_`{|}~\\]/g, '').trim();
}
function checkTyping(userAns, answers) {
  var u = userAns.trim().toLowerCase();
  var uNorm = normAns(userAns);
  if (!answers || !answers.length) return false;
  return answers.some(function (a) {
    if (typeof a !== 'string') return false;
    var parts = a.split(/[\/,]/).map(function (s) {
      return s.trim().toLowerCase();
    });
    var partsNorm = a.split(/[\/,]/).map(function (s) {
      return normAns(s);
    });
    return a.trim().toLowerCase() === u || parts.includes(u) || partsNorm.includes(uNorm);
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
  var changed = false;
  var now = Date.now();
  function add(id, fields) {
    if (cards[id]) return;
    cards[id] = Object.assign({ id: id }, fields, { interval: 1, ease: 2.5, due: now, reps: 0 });
    changed = true;
  }
  (unit.vocab || []).forEach(function (v) {
    add(v.id, { type: 'vocab', front: v.word, back: glossText(v), reading: v.reading });
  });
  (unit.kanji || []).forEach(function (k) {
    add(k.id, { type: 'kanji', front: k.char, back: k.meaning.join(', '), reading: kanjiReadings(k).join('・') });
  });
  (unit.grammar || []).forEach(function (g) {
    add(g.id, { type: 'grammar', front: g.pattern, back: g.meaning });
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
//                   uiLang ('auto'|'en'|'ja') }
//   log:<YYYY-MM-DD>:<deviceId>   dated activity log, one doc per local date per
//                   device: { date, lessons: [unit ids marked done], quizzes:
//                   [{ unit, right, total, at }], reviews: { count, again } }.
//                   Append-only within the day; only its own device writes it,
//                   so merges never conflict across devices (LWW is fine).
//                   Readers aggregate across devices and treat missing fields
//                   as empty, so fields can be added without migration.
// Reserved, not written yet (features come later):
//   ach:<id>            { unlockedAt }   merge: earliest unlock wins, never deleted
// Device-only prefs stay in localStorage and never become docs:
var DEVICE_PREF_KEYS = ['jlpt_palette', 'jlpt_theme', 'jlpt_tts_rate', 'jlpt_sfx_mute'];
var STORE_ID_RE = /^(unit:n[1-5]\.u\d{3}|card:(v:[^|\s]+\|[^|\s]+|k:\S+|g:[\w-]+)|prefs:learning|log:\d{4}-\d{2}-\d{2}:[\w-]+)$/;
var PREFS_DEFAULTS = { currentUnit: null, pace: 1, examDate: null, furigana: null, uiLang: 'en' };

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

// docsToSnapshot: docs → App's synchronous state shape.
function docsToSnapshot(docs) {
  var snap = { completed: [], srsCards: {}, currentUnit: null, pace: 1, examDate: null, furiganaPref: null, uiLang: 'en' };
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
