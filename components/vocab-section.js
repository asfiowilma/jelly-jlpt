"use strict";

// ── Vocabulary section of a lesson ───────────────────────────────────────────
// Word | Reading | Meaning, grouped by part of speech. Two modes (Learn is the default):
//   Learn    : everything open; the Reading column is the furigana
//   Practice : meaning covered, and for kanji words the reading too, each tapped open on its own;
//              Shuffle drops the part-of-speech grouping (a "Verbs" heading is a hint);
//              Reveal all gives up. Session-only, resets per unit (the parent keys it by unit id).

var VOCAB_GROUPS = [
  { key: 'verb', label: 'vocab_verbs', test: function (p) { return /^verb/.test(p); } },
  { key: 'adj', label: 'vocab_adjectives', test: function (p) { return /^adj/.test(p); } },
  { key: 'noun', label: 'vocab_nouns', test: function (p) { return /^(noun|pronoun|number|counter)$/.test(p); } }
];

function posChip(pos) {
  return pos === 'adj-i' ? 'i-adj' : pos === 'adj-na' ? 'na-adj' : pos.replace(/^verb-/, '');
}

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
function vocabHasReading(v) { return hasKanji(v.word) && v.reading !== v.word; }

function VocabSection(props) {
  var unit = props.unit,
    lv = unit.level,
    vocab = unit.vocab;
  var _pr = React.useState(false), practice = _pr[0], setPractice = _pr[1];
  var _rev = React.useState({}), rev = _rev[0], setRev = _rev[1]; // '<id>:m' / '<id>:r' → opened
  var _order = React.useState(null), order = _order[0], setOrder = _order[1]; // shuffled vocab | null
  // every coverable cell: the meaning of each word, plus the reading of each kanji word
  var cells = [];
  vocab.forEach(function (v) {
    cells.push(v.id + ':m');
    if (vocabHasReading(v)) cells.push(v.id + ':r');
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
    var readingCell = !vocabHasReading(v)
      ? React.createElement("span", { className: "vocab-cell vocab-none", 'aria-hidden': true }, "–")
      : practice && !rev[v.id + ':r'] ? cover(v.id + ':r', t('vocab_reading', lv))
      : React.createElement("span", { className: "vocab-cell vocab-reading jp" }, v.reading);
    var meaningCell = practice && !rev[v.id + ':m']
      ? cover(v.id + ':m', t('vocab_meaning', lv))
      : React.createElement("span", { className: "vocab-cell vocab-meaning" }, glossText(v),
        v.usage && React.createElement("span", { className: "vocab-usage", lang: "ja" }, v.usage),
        React.createElement("span", { className: "pos-chip" }, posChip(v.pos)));
    return React.createElement("li", { key: v.id, className: "vocab-row" },
      React.createElement("div", { className: "vocab-jp jp" }, v.word),
      React.createElement("div", { className: "vocab-col-reading" }, readingCell),
      React.createElement("div", { className: "vocab-col-meaning" }, meaningCell),
      React.createElement("button", {
        className: "speak-btn speak-btn-row", onClick: function () { speak(v.word); },
        title: "Listen to pronunciation", 'aria-label': "Listen to " + v.word
      }, "🔊"));
  };

  var groups = vocabGroups(vocab, lv);
  // Column header row. With several groups each group's label sits in the Word column of its own
  // header row; only the first repeats Reading / Meaning (the rest keep the row but hide them).
  var cols = function (label, grouped, quiet) {
    var hid = { 'aria-hidden': true };
    return React.createElement("div", { key: "h", className: "vocab-cols" + (quiet ? " quiet" : "") },
      grouped ? React.createElement("h4", { className: "vocab-cols-grp" }, label) : React.createElement("span", hid, label),
      React.createElement("span", hid, t('vocab_reading', lv)), React.createElement("span", hid, t('vocab_meaning', lv)),
      React.createElement("span", hid));
  };
  var grouped = !(practice && order) && groups.length > 1;
  var body = !grouped
    ? [cols(t('vocab_word', lv), false, false), React.createElement("ul", { key: "l", className: "vocab-list" }, (practice && order ? order : vocab).map(row))]
    : groups.map(function (g, i) {
      return React.createElement("div", { key: g.key, className: "vocab-group" },
        cols(g.label, true, i > 0),
        React.createElement("ul", { className: "vocab-list" }, g.items.map(row)));
    });
  var seg = React.createElement("span", { className: "mode-seg", role: "group", 'aria-label': t('mode_label', lv) },
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
      className: "vocab-btn", onClick: function () { speak(vocab.map(function (v) { return v.word; }).join('、')); }
    }, "🔊 ", t('vocab_listen_all', lv)),
    seg);
  return React.createElement("div", { className: "section" },
    React.createElement("div", { className: "section-label kj-head" }, React.createElement("span", null, t('section_vocabulary', lv)), controls),
    body);
}
