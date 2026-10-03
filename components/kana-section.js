"use strict";

// ── Kana section of a kana lesson ────────────────────────────────────────────
// Same `kanjiView` pref as the Kanji section:
//   'rows'  : gojūon chart (rows × vowel columns), tap a tile to hear it and open its detail
//   'focus' : one kana at a time, picked from chips
// Detail card: kana + romaji + Listen, stroke order (single kana only), and an info column
// that exists only when there is something to show (catalog note, look-alikes, practice words).

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

// Same-script kana that get mixed up with this one (KANA_LOOKALIKES in lib.js); plain kana only.
function kanaLookalikes(ch) {
  if (Array.from(ch).length > 1 || kanaBase(ch) !== ch) return [];
  return Array.from(KANA_LOOKALIKES.filter(function (s) { return s.indexOf(ch) >= 0; }).join(''))
    .filter(function (c, i, a) { return c !== ch && a.indexOf(c) === i; });
}

function KanaSection(props) {
  var unit = props.unit,
    lv = unit.level,
    view = props.kanjiView === 'focus' ? 'focus' : 'rows',
    kana = unit.kana,
    chart = kanaChart(kana);
  var _sel = React.useState(null), sel = _sel[0], setSel = _sel[1];
  var _seen = React.useState({}), seen = _seen[0], setSeen = _seen[1];
  var look = function (id) {
    setSel(id);
    setSeen(function (p) { return Object.assign({}, p, { [id]: true }); });
  };
  var cur = kana.filter(function (k) { return k.id === sel; })[0] || (view === 'focus' ? kana[0] : null);
  var mark = function (text, ch) {
    return text.split(ch).map(function (part, i, a) {
      return React.createElement(React.Fragment, { key: i }, part, i < a.length - 1 && React.createElement("mark", null, ch));
    });
  };

  var detail = function (k) {
    var like = kanaLookalikes(k.char);
    var words = (unit.practice || []).filter(function (v) { return v.reading.indexOf(k.char) >= 0; });
    var info = [
      k.notes && React.createElement("div", { key: "n" },
        React.createElement("div", { className: "kj-sub" }, t('kana_note', lv)), React.createElement("div", { className: "kn-note" }, k.notes)),
      like.length > 0 && React.createElement("div", { key: "l" },
        React.createElement("div", { className: "kj-sub" }, t('kana_lookalikes', lv)),
        React.createElement("div", { className: "kn-like" }, like.map(function (c) { return React.createElement("span", { key: c }, c); }))),
      words.length > 0 && React.createElement("div", { key: "w" },
        React.createElement("div", { className: "kj-sub" }, t('kana_words', lv)),
        words.map(function (v) {
          return React.createElement("div", { key: v.id, className: "kj-word" },
            React.createElement("span", { className: "kj-word-jp" }, mark(v.reading, k.char)),
            React.createElement("span", { className: "kj-word-gl" }, glossText(v)));
        }))
    ].filter(Boolean);
    return React.createElement("div", { className: "kn-card" + (info.length ? " has-info" : "") },
      React.createElement("div", { className: "kn-stage" },
        React.createElement("div", { className: "kn-big", 'aria-hidden': true }, k.char),
        React.createElement("div", { className: "kn-romaji" }, k.romaji),
        React.createElement("button", { className: "vocab-btn", onClick: function () { speak(k.char); } }, "🔊 ", t('kana_listen', lv))),
      Array.from(k.char).length === 1 && React.createElement("div", { className: "kn-sv" }, React.createElement(StrokeOrder, { key: k.id, ch: k.char })),
      info.length > 0 && React.createElement("div", { className: "kn-info" }, info));
  };

  var body;
  if (view === 'focus') {
    var i = kana.indexOf(cur);
    body = React.createElement(React.Fragment, null,
      React.createElement("div", { className: "kj-chips", role: "tablist" }, chart.rows.map(function (r, ri) {
        return React.createElement(React.Fragment, { key: ri }, ri > 0 && React.createElement("span", { className: "kn-sep" }),
          r.filter(Boolean).map(function (k) {
            return React.createElement("button", {
              key: k.id, role: "tab", className: "kj-chip kn-chip", 'aria-selected': k === cur,
              'aria-label': k.char + ", " + k.romaji, onClick: function () { look(k.id); }
            }, k.char, (seen[k.id] || k === cur) && React.createElement("span", { className: "kj-check", 'aria-hidden': true }, "✓"));
          }));
      })),
      detail(cur),
      React.createElement("div", { className: "kj-foot" },
        React.createElement("span", null, kana.filter(function (k) { return seen[k.id] || k === cur; }).length + " / " + kana.length + " " + t('kanji_looked', lv)),
        i < kana.length - 1 && React.createElement("button", { className: "vocab-btn", onClick: function () { look(kana[i + 1].id); } }, t('kana_next', lv))));
  } else {
    var cells = [];
    if (chart.headers) {
      cells.push(React.createElement("span", { key: "h" }));
      chart.cols.forEach(function (c) { cells.push(React.createElement("span", { key: "h" + c, className: "kn-col" }, (chart.youon ? KANA_YOUON_COLS : KANA_COLS)[c])); });
    }
    chart.rows.forEach(function (r, ri) {
      cells.push(React.createElement("span", { key: "r" + ri, className: "kn-rowlab jp" }, Array.from(r.filter(Boolean)[0].char)[0]));
      chart.cols.forEach(function (c) {
        var k = r[c];
        cells.push(k ? React.createElement("button", {
          key: k.id, className: "kn-tile", 'aria-pressed': k === cur, 'aria-label': k.char + ", " + k.romaji,
          onClick: function () { speak(k.char); look(k.id); }
        }, k.notes && React.createElement("i", { className: "kn-dot", title: t('kana_legend', lv) }),
        React.createElement("span", { className: "kn-k" }, k.char), React.createElement("span", { className: "kn-r" }, k.romaji))
          : React.createElement("span", { key: "e" + ri + c }));
      });
    });
    body = React.createElement(React.Fragment, null,
      React.createElement("div", { className: "kn-chart", style: { gridTemplateColumns: "34px repeat(" + chart.cols.length + ", minmax(0, 1fr))" } }, cells),
      kana.some(function (k) { return k.notes; }) && React.createElement("div", { className: "kn-legend" }, React.createElement("i", { className: "kn-dot" }), t('kana_legend', lv)),
      React.createElement("div", { className: "kn-detail" }, cur ? detail(cur) : React.createElement("p", { className: "kn-empty" }, t('kana_tap', lv))));
  }
  return React.createElement("div", { className: "section" },
    charSectionHead({
      label: t('section_kana', lv), popId: "kn-pop", infoLabel: t('kana_info_label', lv),
      info: [
        React.createElement("p", { key: "a" }, t('kana_info_sound', lv)),
        React.createElement("p", { key: "b" }, t('kana_info_romaji', lv)),
        React.createElement("p", { key: "c" }, t('kana_info_dot', lv))],
      toggle: kana.length > 1 && {
        label: view === 'focus' ? t('kana_view_rows', lv) : t('kanji_view_focus', lv),
        onClick: function () { props.setKanjiView(view === 'focus' ? 'rows' : 'focus'); }
      }
    }),
    body);
}
