"use strict";

// ── Vocabulary section of a lesson ───────────────────────────────────────────
// A scan list (word, reading, meaning, part of speech) grouped by part of speech; tapping a row opens
// a detail sheet (usage, tip) that steps through the list. Two modes (Learn is the default):
//   Learn    : everything open; the reading beside the word is the furigana
//   Practice : meaning covered, and for kanji words the reading too, each tapped open on its own
//              (a tap on a covered row reveals its meaning, a tap on an open row opens the sheet);
//              Shuffle drops the part-of-speech grouping (a "Verbs" heading is a hint);
//              Reveal all gives up. Session-only, resets per unit (the parent keys it by unit id).

var VOCAB_GROUPS = [
  { key: 'verb', label: 'vocab_verbs', test: function (p) { return /^verb/.test(p); } },
  { key: 'adj', label: 'vocab_adjectives', test: function (p) { return /^adj/.test(p); } },
  { key: 'noun', label: 'vocab_nouns', test: function (p) { return /^(noun|pronoun|number|counter)$/.test(p); } }
];

// Word-type chip: one name per verb group everywhere (る-verb / う-verb, as the grammar notes and
// Genki), never the catalog's godan / ichidan; POS_HELP is its hover text (N5 r1 newbie N4).
var POS_CHIP = { 'verb-godan': 'う-verb', 'verb-ichidan': 'る-verb', 'verb-suru': 'irregular verb', 'verb-kuru': 'irregular verb',
  'adj-i': 'い-adjective', 'adj-na': 'な-adjective', prenoun: 'before a noun' };
var POS_HELP = {
  'う-verb': 'Verb group: the last u-sound changes (のむ → のみます, のまない). Stage 30 shows how to tell the groups apart.',
  'る-verb': 'Verb group: ends in いる or える, and る just drops (たべる → たべます, たべない).',
  'irregular verb': 'する and くる (and words built on する) change in their own way.',
  'い-adjective': 'A describing word that ends in い and changes its ending (たかい → たかくない).',
  'な-adjective': 'A describing word that takes な before a noun (しずかな へや).',
  'before a noun': 'A word that only goes before a noun (この, その, あの, どの).',
  counter: 'A word added to a number to count things (三まい, 二ひき).',
  suffix: 'A word part that goes after another word (〜さん, 〜じん).',
  prefix: 'A word part that goes before another word (お〜, ご〜).'
};
function posChip(pos) { return POS_CHIP[pos] || pos; }

// vocabGroups(vocab, lv): items by part of speech; anything unmatched lands in "other".
function vocabGroups(vocab, lv) {
  var groups = VOCAB_GROUPS.map(function (g) {
    return { key: g.key, label: t(g.label, lv), items: vocab.filter(function (v) { return g.test(v.pos); }) };
  });
  groups.push({ key: 'other', label: t('vocab_other', lv), items: vocab.filter(function (v) {
    return !VOCAB_GROUPS.some(function (g) { return g.test(v.pos); });
  }) });
  return groups.filter(function (g) { return g.items.length > 0; });
}

// A word with a reading worth testing: kanji in it and a reading that differs.
function vocabHasReading(v, tk) { return hasKanji(v.word) && v.reading !== v.word && (!tk || displayWord(v, tk) === v.word); }

// vocabStep(list, id, d): the word d places from id in list order, wrapping at both ends.
function vocabStep(list, id, d) {
  var i = list.findIndex(function (v) { return v.id === id; });
  return list[(i + d + list.length) % list.length];
}

// vocabDetail(v, covered): the optional blocks of a word's sheet (null = not shown). Usage, examples
// (the word's catalog sentences, at most 3) and tip stay hidden while the meaning is still covered in Practice.
function vocabDetail(v, covered) {
  var ex = covered ? [] : sentencesUsing(v.id).slice(0, 3);
  return { usage: !covered && v.usage ? v.usage.split('、') : null, examples: ex.length ? ex : null, tip: !covered && v.tip ? v.tip : null };
}

// The bottom sheet: a modal dialog over the list. Focus moves in on open; Tab stays inside; Esc closes;
// Left / Right step. The parent returns focus to the opening row.
function VocabSheet(p) {
  var v = p.v, lv = p.lv, ref = React.useRef(null);
  var _tip = React.useState(false), tipOpen = _tip[0], setTipOpen = _tip[1]; // stays as set while stepping
  React.useEffect(function () {
    var prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (ref.current) ref.current.focus();
    return function () { document.body.style.overflow = prev; };
  }, []);
  var onKey = function (e) {
    if (e.key === "Escape") { e.stopPropagation(); p.onClose(); }
    else if (e.key === "ArrowRight") p.onStep(1);
    else if (e.key === "ArrowLeft") p.onStep(-1);
    else if (e.key === "Tab") {
      var f = [].slice.call(ref.current.querySelectorAll("button, a[href]")), i = f.indexOf(document.activeElement);
      if (e.shiftKey ? i <= 0 : i === f.length - 1) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
    }
  };
  var covered = p.practice && !p.rev[v.id + ":m"], d = vocabDetail(v, covered);
  var ib = function (label, text, fn) { return React.createElement("button", { className: "vl-ib", onClick: fn, 'aria-label': label, title: label }, text); };
  return React.createElement("div", { className: "vl-scrim", onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
    React.createElement("div", {
      className: "vl-sheet", ref: ref, tabIndex: -1, role: "dialog", 'aria-modal': "true", 'aria-label': displayWord(v, p.tk), onKeyDown: onKey
    },
      React.createElement("div", { className: "vl-top" },
        React.createElement("span", { className: "vl-count" }, (p.index + 1) + " / " + p.count),
        React.createElement("span", { className: "vl-nav" },
          ib(t('vocab_prev', lv), "‹", function () { p.onStep(-1); }),
          ib(t('vocab_next', lv), "›", function () { p.onStep(1); }),
          ib(t('vocab_close', lv), "✕", p.onClose))),
      React.createElement("div", { className: "vl-big" },
        React.createElement("span", { className: "jp" }, displayWord(v, p.tk)),
        vocabHasReading(v, p.tk) && (p.practice && !p.rev[v.id + ":r"]
          ? p.cover(v.id + ":r", t('vocab_reading', lv))
          : React.createElement("span", { className: "vl-big-rd jp" }, v.reading)),
        React.createElement("button", {
          className: "speak-btn speak-btn-row", onClick: function () { speak(v.reading); },
          title: "Listen to pronunciation", 'aria-label': "Listen to " + displayWord(v, p.tk)
        }, "🔊")),
      React.createElement("div", { className: "vl-mean" },
        covered ? p.cover(v.id + ":m", t('vocab_meaning', lv)) : glossText(v),
        React.createElement("span", { className: "pos-chip", title: POS_HELP[posChip(v.pos)] }, posChip(v.pos))),
      d.usage && React.createElement("div", { className: "vl-blk" },
        React.createElement("div", { className: "vl-lbl" }, t('vocab_usage', lv)),
        React.createElement("div", { className: "vl-pills jp", lang: "ja" }, d.usage.map(function (u, i) {
          return React.createElement("span", { key: i, className: "vl-pill" }, rubyNodes(u, p.showFurigana, p.tk));
        }))),
      d.examples && React.createElement("div", { className: "vl-blk" },
        React.createElement("div", { className: "vl-lbl" }, t('vocab_example', lv)),
        d.examples.map(function (s) {
          var tat = s.id.indexOf('s:tatoeba:') === 0, n = s.id.slice(10);
          return React.createElement("div", { key: s.id, className: "vl-ex" },
            React.createElement("div", null,
              React.createElement("div", { className: "vl-sen jp", lang: "ja" }, rubyNodes(s.furigana || s.jp, p.showFurigana, p.tk)),
              React.createElement("div", { className: "vl-en" }, s.en),
              // Tatoeba CC BY: credit inline, in the Settings → Sentence credits format
              tat && React.createElement("div", { className: "vl-cred" },
                React.createElement("a", { href: "https://tatoeba.org/en/sentences/show/" + n, target: "_blank", rel: "noopener noreferrer" }, "Tatoeba #" + n),
                " " + t('cred_by', lv) + " " + s.author + " · " + s.license)),
            React.createElement("button", {
              className: "example-speak", onClick: function () { speak(speechText(s.furigana || s.jp)); }, title: "Listen", 'aria-label': "Listen to " + s.jp
            }, icon('speaker')));
        })),
      d.tip && React.createElement("div", { className: "vl-blk" },
        React.createElement("button", {
          className: "vl-tipbtn vocab-tip-label", 'aria-expanded': tipOpen, onClick: function () { setTipOpen(!tipOpen); }
        }, icon('bulb'), t('vocab_tip', lv)),
        tipOpen && React.createElement("p", { className: "vl-tip" }, rubyNodes(d.tip, p.showFurigana, p.tk)))));
}

function VocabSection(props) {
  var unit = props.unit,
    lv = unit.level,
    vocab = unit.vocab,
    tk = unitTaughtKanji(unit);
  var _pr = React.useState(false), practice = _pr[0], setPractice = _pr[1];
  var _rev = React.useState({}), rev = _rev[0], setRev = _rev[1]; // '<id>:m' / '<id>:r' → opened
  var _order = React.useState(null), order = _order[0], setOrder = _order[1]; // shuffled vocab | null
  var _sel = React.useState(null), sel = _sel[0], setSel = _sel[1]; // id of the word in the sheet | null
  var opener = React.useRef(null); // id of the row that opened the sheet, to give focus back
  React.useEffect(function () {
    if (sel !== null || opener.current === null) return;
    var el = document.querySelector('[data-vl="' + opener.current + '"]');
    opener.current = null;
    if (el) el.focus();
  }, [sel]);
  // every coverable cell: the meaning of each word, plus the reading of each kanji word
  var cells = [];
  vocab.forEach(function (v) {
    cells.push(v.id + ':m');
    if (vocabHasReading(v, tk)) cells.push(v.id + ':r');
  });
  var opened = cells.filter(function (c) { return rev[c]; }).length;
  var setMode = function (p) { setPractice(p); setRev({}); setOrder(null); };
  var open = function (key) { setRev(function (p) { return Object.assign({}, p, { [key]: true }); }); };

  var cover = function (key, label) {
    return React.createElement("button", {
      className: "vocab-cell covered", onClick: function () { open(key); }, 'aria-label': label + ", " + t('tap_reveal', lv)
    }, React.createElement("span", { className: "vocab-tap" }, t('tap_reveal', lv)));
  };
  var row = function (v) {
    var hidden = practice && !rev[v.id + ':m'];
    var readingCell = !vocabHasReading(v, tk) ? null
      : practice && !rev[v.id + ':r'] ? cover(v.id + ':r', t('vocab_reading', lv))
      : React.createElement("span", { className: "vl-rd jp" }, v.reading);
    // The row's main control is an overlay button, a sibling of the cover and speaker buttons (no
    // nested buttons); those sit above it. A covered row's main tap reveals the meaning.
    return React.createElement("li", { key: v.id, className: "vl-row" },
      React.createElement("button", {
        className: "vl-main", 'data-vl': v.id,
        'aria-label': displayWord(v, tk) + ", " + t(hidden ? 'tap_reveal' : 'vocab_details', lv),
        onClick: function () {
          if (hidden) return open(v.id + ':m');
          opener.current = v.id; setSel(v.id);
        }
      }),
      React.createElement("div", { className: "vl-w" },
        React.createElement("span", { className: "vl-word jp" }, displayWord(v, tk)), readingCell),
      React.createElement("div", { className: "vl-m" },
        hidden ? cover(v.id + ':m', t('vocab_meaning', lv)) : glossText(v)),
      React.createElement("span", { className: "pos-chip", title: POS_HELP[posChip(v.pos)] }, posChip(v.pos)),
      React.createElement("span", { className: "vl-go", 'aria-hidden': true }, "›"),
      React.createElement("button", {
        className: "speak-btn speak-btn-row", onClick: function () { speak(v.reading); },
        title: "Listen to pronunciation", 'aria-label': "Listen to " + displayWord(v, tk)
      }, "🔊"));
  };

  var groups = vocabGroups(vocab, lv);
  var grouped = !(practice && order) && groups.length > 1;
  // the sheet steps through the list in the order shown (grouped, plain or shuffled)
  var list = grouped ? [].concat.apply([], groups.map(function (g) { return g.items; })) : (practice && order ? order : vocab);
  var body = !grouped
    ? React.createElement("ul", { className: "vl-list" }, list.map(row))
    : groups.map(function (g) {
      return React.createElement("div", { key: g.key, className: "vocab-group" },
        React.createElement("h4", { className: "vl-grp" }, g.label),
        React.createElement("ul", { className: "vl-list" }, g.items.map(row)));
    });
  var cur = sel === null ? null : list.filter(function (v) { return v.id === sel; })[0];
  var sheet = cur && React.createElement(VocabSheet, {
    key: "sheet", v: cur, lv: lv, tk: tk, practice: practice, rev: rev, cover: cover, showFurigana: props.showFurigana,
    index: list.indexOf(cur), count: list.length,
    onStep: function (d) { setSel(vocabStep(list, cur.id, d).id); }, onClose: function () { setSel(null); }
  });
  var seg =React.createElement("span", { className: "mode-seg", role: "group", 'aria-label': t('mode_label', lv) },
    React.createElement("button", { 'aria-pressed': !practice, onClick: function () { setMode(false); } }, t('mode_learn', lv)),
    React.createElement("button", { 'aria-pressed': practice, onClick: function () { setMode(true); } }, t('mode_practice', lv)));
  var controls = React.createElement("span", { className: "mode-ctl" },
    practice && React.createElement(React.Fragment, null,
      React.createElement("span", { className: "mode-count" }, t('vocab_checked', lv) + " " + opened + " / " + cells.length),
      React.createElement("button", { className: "vocab-btn" + (order ? " active" : ""), 'aria-pressed': !!order, onClick: function () { setOrder(order ? null : rndShuffle(vocab)); } }, t('mode_shuffle', lv)),
      React.createElement("button", {
        className: "vocab-btn",
        onClick: function () {
          var all = {};
          if (opened < cells.length) cells.forEach(function (c) { all[c] = true; });
          setRev(all);
        }
      }, opened === cells.length ? t('mode_hide_all', lv) : t('mode_reveal_all', lv))),
    React.createElement("button", {
      className: "vocab-btn", onClick: function () { speak(vocab.map(function (v) { return v.reading; }).join('、')); }
    }, "🔊 ", t('vocab_listen_all', lv)),
    seg);
  return React.createElement("div", { className: "section" },
    React.createElement("div", { className: "section-label kj-head" }, React.createElement("span", null, t('section_vocabulary', lv)), controls),
    body, sheet);
}

// ── Review unit Words tab ────────────────────────────────────────────────────
// Default: a flashcard deck (reveal, Again re-queues, Know advances). "Show full list instead" opens
// the scan list grouped by the stage each word came from; Learn / Practice as in the lesson list.
// The parent keys it by unit id, so deck / list and progress reset on a new stage.
function ReviewVocab(props) {
  var unit = props.unit, lv = unit.level, tk = unitTaughtKanji(unit), ce = React.createElement;
  var groups = reviewSourceGroups(unit, 'vocab');
  var ordered = [], srcOf = {}, byId = {};
  groups.forEach(function (g) { g.items.forEach(function (v) { ordered.push(v); srcOf[v.id] = g.source; byId[v.id] = v; }); });
  var _view = React.useState('deck'), view = _view[0], setView = _view[1];
  var _deck = React.useState(function () { return deckStart(ordered.map(function (v) { return v.id; })); }), deck = _deck[0], setDeck = _deck[1];
  var _shuf = React.useState(false), shuf = _shuf[0], setShuf = _shuf[1];
  var _show = React.useState(false), shown = _show[0], setShown = _show[1];
  var _pr = React.useState(false), practice = _pr[0], setPractice = _pr[1];
  var _rev = React.useState({}), rev = _rev[0], setRev = _rev[1];
  var restart = function (shuffle) {
    var l = ordered.map(function (v) { return v.id; });
    setDeck(deckStart(shuffle ? rndShuffle(l) : l)); setShown(false);
  };
  var answer = function (know) { setDeck(deckAnswer(deck, know)); setShown(false); };
  // a separate reading line only when the word is shown in kanji and its reading differs
  var reading = function (v) { var w = displayWord(v, tk); return v.reading && v.reading !== w && v.reading !== v.word ? v.reading : ''; };
  var stageName = function (s) { return t('unit_label', lv) + " " + (s.index + 1); };
  var ghost = function (label, fn) { return ce("button", { className: "rw-ghost", onClick: fn }, label); };

  if (view === 'list') {
    var row = function (v) {
      var open = !practice || rev[v.id], rd = reading(v);
      return ce("li", { key: v.id, className: "rw-row" },
        ce("div", { className: "rw-main" },
          ce("div", { className: "rw-l" }, ce("span", { className: "rw-w jp" }, displayWord(v, tk)), rd && ce("span", { className: "rw-rd jp" }, rd)),
          open ? ce("div", { className: "rw-mn" }, glossText(v),
            v.usage && ce("span", { className: "vocab-usage", lang: "ja" }, " ", rubyNodes(v.usage, props.showFurigana, tk)),
            " ", ce("span", { className: "pos-chip", title: POS_HELP[posChip(v.pos)] }, posChip(v.pos)))
            : ce("button", {
              className: "vocab-cell covered rw-cover", 'aria-label': t('vocab_meaning', lv) + ", " + t('tap_reveal', lv),
              onClick: function () { setRev(function (p) { return Object.assign({}, p, { [v.id]: true }); }); }
            }, ce("span", { className: "vocab-tap" }, t('tap_reveal', lv)))),
        ce("button", { className: "speak-btn speak-btn-row", onClick: function () { speak(v.reading); }, title: "Listen to pronunciation", 'aria-label': "Listen to " + displayWord(v, tk) }, "🔊"),
        v.tip && !practice && ce("div", { className: "vocab-tip" },
          ce("div", { className: "vocab-tip-label" }, icon('bulb'), t('vocab_tip', lv)),
          ce("p", null, rubyNodes(v.tip, props.showFurigana, tk))));
    };
    var setMode = function (p) { setPractice(p); setRev({}); };
    return ce("div", { className: "section" },
      ce("div", { className: "section-label kj-head" }, ce("span", null, t('section_vocabulary', lv)),
        ce("span", { className: "mode-ctl" },
          ghost("← Back to deck", function () { setView('deck'); }),
          ce("span", { className: "mode-seg", role: "group", 'aria-label': t('mode_label', lv) },
            ce("button", { 'aria-pressed': !practice, onClick: function () { setMode(false); } }, t('mode_learn', lv)),
            ce("button", { 'aria-pressed': practice, onClick: function () { setMode(true); } }, t('mode_practice', lv))))),
      groups.map(function (g) {
        return ce("div", { key: g.source.unitId, className: "rw-group" },
          ce("div", { className: "rw-stg" }, ce("h4", null, stageName(g.source)),
            ce("span", null, g.items.length + (g.items.length === 1 ? " word" : " words")),
            ce("button", { className: "rw-open", onClick: function () { props.setUnit(g.source.index); }, 'aria-label': "Open " + stageName(g.source) }, "Open stage →")),
          ce("ul", { className: "rw-list" }, g.items.map(row)));
      }));
  }

  var head = ce("div", { className: "section-label" }, t('section_vocabulary', lv));
  if (deck.queue.length === 0) {
    return ce("div", { className: "section" }, head,
      ce("div", { className: "rw-deck" },
        ce("div", { className: "rw-done", role: "status" },
          ce("div", { className: "rw-done-t" }, "Deck done · " + deck.total + " cards, " + deck.missed.length + " needed another look"),
          ce("div", { className: "rw-btns" },
            ce("button", { className: "rw-btn go", onClick: function () { restart(shuf); } }, "Go again"),
            ce("button", { className: "rw-btn", onClick: function () { setView('list'); } }, "Show full list")))));
  }
  var v = byId[deck.queue[0]], rd = reading(v), known = deck.total - deck.queue.length;
  var cardText = displayWord(v, tk) + ", " + (shown ? (rd ? rd + ", " : "") + glossText(v) : t('tap_reveal', lv));
  return ce("div", { className: "section" }, head,
    ce("div", { className: "rw-deck" },
      ce("div", { className: "rw-prog" },
        ce("span", null, known + " / " + deck.total),
        ce("div", { className: "rw-bar", role: "progressbar", 'aria-valuemin': 0, 'aria-valuemax': deck.total, 'aria-valuenow': known, 'aria-label': "Deck progress" },
          ce("i", { style: { width: Math.round(100 * known / deck.total) + "%" } })),
        ce("span", null, deck.again + " again"),
        ce("button", { className: "rw-shuf", 'aria-pressed': shuf, onClick: function () { setShuf(!shuf); restart(!shuf); } }, t('mode_shuffle', lv))),
      ce("button", { className: "rw-card", onClick: function () { setShown(!shown); }, 'aria-label': cardText },
        ce("span", { className: "rw-big jp" }, displayWord(v, tk)),
        shown ? ce(React.Fragment, null,
          rd && ce("span", { className: "rw-crd jp" }, rd),
          ce("span", { className: "rw-cmn" }, glossText(v)))
          : ce("span", { className: "rw-tap" }, t('tap_reveal', lv)),
        ce("span", { className: "rw-tag" }, stageName(srcOf[v.id]))),
      ce("div", { className: "sr-only", 'aria-live': "polite" }, shown ? cardText : ""),
      ce("div", { className: "rw-btns" },
        ce("button", { className: "rw-btn", onClick: function () { answer(false); } }, "Again"),
        ce("button", { className: "rw-btn go", onClick: function () { answer(true); } }, "Know it")),
      ghost("Show full list instead", function () { setView('list'); })));
}
