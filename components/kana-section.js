"use strict";

// ── Kana section of a kana lesson ────────────────────────────────────────────
// A gojūon chart of the unit's kana, in two modes (Learn is the default):
//   Learn    : romaji and, in lesson units, the numbered stroke order on every tile; a tap plays
//              the kana and highlights its entry in "Watch out for"
//   Practice : romaji and the a i u e o headers hidden; a tap reveals + plays; Shuffle drops the
//              position cue; Reveal all gives up
// "Watch out for": irregular sounds (catalog note, or a spelling that differs from the pattern:
// し shi, not si) and look-alike sets (KANA_LOOKALIKES). The dots match the dots on the tiles.

var KANA_COLS = ['a', 'i', 'u', 'e', 'o'];
var KANA_YOUON_COLS = ['ya', '', 'yu', '', 'yo'];

// kanaChart(items): rows of 5 cells (item | null) in gojūon order. The column is the vowel of
// the last char (きゃ → ゃ → a); a kana without one (ん, ティ) takes the next free column.
// A new row starts when the column doesn't advance. headers = every kana has a vowel column.
function kanaChart(items) {
  var rows = [], row = null, prev = -1, headers = true;
  items.forEach(function (k) {
    var v = kanaVowel(kataToHira(Array.from(k.char).pop()));
    var col = v ? KANA_COLS.indexOf(v) : prev + 1;
    if (!v) headers = false;
    if (!row || col <= prev || col > 4) {
      row = [null, null, null, null, null];
      rows.push(row);
      if (!v) col = 0;
    }
    row[col] = k;
    prev = col;
  });
  var cols = [0, 1, 2, 3, 4].filter(function (c) { return rows.some(function (r) { return r[c]; }); });
  return { rows: rows, cols: cols, headers: headers, youon: items.every(function (k) { return Array.from(k.char).length > 1; }) };
}

// Plain (single, undotted) kana only; combos and dakuten kana have no look-alike sets.
function kanaIsPlain(k) { return Array.from(k.char).length === 1 && kanaBase(k.char) === k.char; }

// kanaLookSets(items): the KANA_LOOKALIKES sets that contain at least one of these kana.
function kanaLookSets(items) {
  var chars = items.filter(kanaIsPlain).map(function (k) { return k.char; });
  return KANA_LOOKALIKES.filter(function (set) { return Array.from(set).some(function (c) { return chars.indexOf(c) >= 0; }); });
}

// kanaIrregular(k): the note shown for an irregular kana, or null. A catalog note wins; otherwise a
// single kana typed another way (し: shi / si, ふ: fu / hu) reads "shi, not si".
function kanaIrregular(k) {
  if (k.notes) return k.notes;
  return Array.from(k.char).length === 1 && k.answers && k.answers.length > 1 ? k.romaji + ", not " + k.answers[1] : null;
}

function KanaSection(props) {
  var unit = props.unit,
    lv = unit.level,
    kana = unit.kana,
    chart = kanaChart(kana),
    strokes = unit.kind === 'kana'; // review units can hold 100+ kana: no per-tile stroke fetches
  var _pr = React.useState(false), practice = _pr[0], setPractice = _pr[1];
  var _rev = React.useState({}), rev = _rev[0], setRev = _rev[1];
  var _order = React.useState(null), order = _order[0], setOrder = _order[1]; // Practice shuffle: kana list | null
  var _sel = React.useState(null), sel = _sel[0], setSel = _sel[1];
  var looks = kanaLookSets(kana);
  var inUnit = {};
  kana.forEach(function (k) { inUnit[k.char] = true; });
  var revealed = kana.filter(function (k) { return rev[k.id]; }).length;

  var setMode = function (p) { setPractice(p); setRev({}); setOrder(null); setSel(null); };
  var tile = function (k) {
    if (practice) {
      var open = !!rev[k.id];
      return React.createElement("button", {
        key: k.id, className: "kn-tile cover" + (open ? "" : " covered"),
        'aria-label': k.char + (open ? ", " + k.romaji : ", " + t('tap_reveal', lv)),
        onClick: function () { speak(k.char); setRev(function (p) { return Object.assign({}, p, { [k.id]: true }); }); }
      }, React.createElement("span", { className: "kn-k" }, k.char), React.createElement("span", { className: "kn-r" }, open ? k.romaji : " "));
    }
    var irr = !!kanaIrregular(k),
      like = looks.some(function (s) { return kanaIsPlain(k) && s.indexOf(k.char) >= 0; });
    return React.createElement("button", {
      key: k.id, className: "kn-tile" + (sel === k.id ? " sel" : ""),
      'aria-label': k.char + ", " + k.romaji + (irr ? ", " + t('kana_irregular', lv) : ""),
      onClick: function () { speak(k.char); setSel(k.id); }
    },
    (irr || like) && React.createElement("span", { className: "kn-mk", 'aria-hidden': true },
      irr && React.createElement("i", { className: "irr" }), like && React.createElement("i", { className: "like" })),
    React.createElement("span", { className: "kn-k" }, k.char),
    strokes && Array.from(k.char).length === 1 && React.createElement(StrokeOrder, { ch: k.char, compact: true }),
    React.createElement("span", { className: "kn-r" }, k.romaji));
  };

  var cells = [];
  if (practice && order) {
    cells = order.map(tile);
  } else {
    if (chart.headers && !practice) {
      cells.push(React.createElement("span", { key: "h" }));
      chart.cols.forEach(function (c) { cells.push(React.createElement("span", { key: "h" + c, className: "kn-col" }, (chart.youon ? KANA_YOUON_COLS : KANA_COLS)[c])); });
    }
    chart.rows.forEach(function (r, ri) {
      cells.push(React.createElement("span", { key: "r" + ri, className: "kn-rowlab" }, Array.from(r.filter(Boolean)[0].char)[0]));
      chart.cols.forEach(function (c) { cells.push(r[c] ? tile(r[c]) : React.createElement("span", { key: "e" + ri + c })); });
    });
  }
  var shuffled = practice && order;
  // In shuffled Practice the grid has no row labels or headers: 5 equal columns.
  var tpl = shuffled ? "repeat(5, minmax(0, 1fr))" : "34px repeat(" + chart.cols.length + ", minmax(0, 1fr))";
  var group = function (dot, label, chips) {
    return chips.length > 0 && React.createElement("span", { className: "kn-grp" }, React.createElement("i", { className: dot }), label, chips);
  };
  var irrChips = practice ? [] : kana.filter(function (k) { return kanaIrregular(k); }).map(function (k) {
    return React.createElement("span", { key: k.id, className: "kn-chip" + (sel === k.id ? " hl" : "") },
      React.createElement("span", { className: "kn-chip-k" }, k.char), " ", kanaIrregular(k));
  });
  var selChar = sel && CATALOG.items[sel].char;
  var likeChips = looks.map(function (s) {
    var hl = selChar && Array.from(s).indexOf(selChar) >= 0;
    return React.createElement("span", { key: s, className: "kn-chip" + (hl ? " hl" : "") },
      Array.from(s).map(function (c) { return React.createElement("span", { key: c, className: "kn-chip-k" + (inUnit[c] ? "" : " later"), title: inUnit[c] ? undefined : t('kana_later', lv) }, c); }));
  });
  var seg = React.createElement("span", { className: "mode-seg", role: "group", 'aria-label': t('mode_label', lv) },
    React.createElement("button", { 'aria-pressed': !practice, onClick: function () { setMode(false); } }, t('mode_learn', lv)),
    React.createElement("button", { 'aria-pressed': practice, onClick: function () { setMode(true); } }, t('mode_practice', lv)));
  var right = React.createElement("span", { className: "mode-ctl" },
    practice
      ? React.createElement(React.Fragment, null,
        React.createElement("span", { className: "mode-count" }, t('kana_revealed', lv) + " " + revealed + " / " + kana.length),
        React.createElement("button", { className: "vocab-btn" + (order ? " active" : ""), 'aria-pressed': !!order, onClick: function () { setOrder(order ? null : rndShuffle(kana)); } }, t('mode_shuffle', lv)),
        React.createElement("button", {
          className: "vocab-btn",
          onClick: function () {
            var all = {};
            if (revealed < kana.length) kana.forEach(function (k) { all[k.id] = true; });
            setRev(all);
          }
        }, revealed === kana.length ? t('mode_hide_all', lv) : t('mode_reveal_all', lv)))
      : React.createElement("span", { className: "mode-count" }, t('kana_tap', lv)),
    seg);
  return React.createElement("div", { className: "section" },
    charSectionHead({
      label: t('section_kana', lv), popId: "kn-pop", infoLabel: t('kana_info_label', lv),
      info: [
        React.createElement("p", { key: "a" }, t('kana_info_sound', lv)),
        React.createElement("p", { key: "b" }, t('kana_info_romaji', lv) + " " + t('kana_info_practice', lv))],
      right: right
    }),
    React.createElement("div", { className: "kn-chart", style: { gridTemplateColumns: tpl } }, cells),
    (irrChips.length > 0 || likeChips.length > 0) && React.createElement("div", { className: "kn-watch" },
      React.createElement("b", null, t('kana_watch', lv)),
      group("irr", t('kana_irregular', lv), irrChips),
      group("like", t('kana_lookalike', lv), likeChips)));
}
