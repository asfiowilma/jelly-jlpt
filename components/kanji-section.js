"use strict";

// ── Kanji section of a lesson ────────────────────────────────────────────────
// Two layouts of the same content, chosen by the synced `charView` pref:
//   'rows'  : every kanji stacked (default)
//   'focus' : one kanji at a time, picked from a row of chips
// Per kanji: meaning, kun / on readings (okurigana dimmed), the unit's words that
// contain it, and the KanjiVG stroke-order SVG (numbered, static).

// StrokeOrder: fetches + inlines kanji-svg/<hex>.svg when mounted.
function StrokeOrder(props) {
  var ch = props.ch;
  var _s = React.useState({ svg: null, error: false, loading: true, n: 0 }),
    st = _s[0],
    setSt = _s[1];
  React.useEffect(function () {
    var live = true;
    setSt(function (p) { return { svg: null, error: false, loading: true, n: p.n }; });
    loadStrokeOrderSvg(ch).then(function (svg) {
      if (live) setSt(function (p) { return { svg: sanitizeSvg(svg), error: false, loading: false, n: p.n }; });
    }, function () {
      if (live) setSt(function (p) { return { svg: null, error: true, loading: false, n: p.n }; });
    });
    return function () { live = false; };
  }, [ch, st.n]);
  if (st.loading) return React.createElement("div", { className: "stroke-loading" }, "Loading...");
  if (st.error) {
    return React.createElement("div", { className: "stroke-error" },
      React.createElement("p", null, "Stroke order unavailable"),
      React.createElement("button", {
        className: "stroke-retry-btn",
        onClick: function () { setSt(function (p) { return { svg: null, error: false, loading: true, n: p.n + 1 }; }); }
      }, "Retry"));
  }
  return React.createElement("div", { className: "stroke-viewer kj-stroke", dangerouslySetInnerHTML: { __html: st.svg } });
}

// charSectionHead: heading of a Kanji / Kana section: label, ⓘ popover (hover, focus or tap)
// and the rows <-> focus toggle. opts: { label, popId, infoLabel, info: [nodes], toggle: {label, onClick} | false }
function charSectionHead(opts) {
  return React.createElement("div", { className: "section-label kj-head" },
    React.createElement("span", { className: "kj-title" }, opts.label,
      React.createElement("span", { className: "kj-info" },
        React.createElement("button", { className: "kj-info-btn", 'aria-label': opts.infoLabel, 'aria-describedby': opts.popId }, "i"),
        React.createElement("div", { id: opts.popId, role: "tooltip", className: "kj-pop" }, opts.info))),
    opts.toggle && React.createElement("button", { className: "vocab-btn kj-toggle", onClick: opts.toggle.onClick }, opts.toggle.label));
}

// Kun readings carry okurigana after a dot ('なが.い'): stem normal, tail dimmed.
function kanjiReading(r, extra) {
  var parts = r.split('.');
  return React.createElement("span", { key: r, className: "kj-reading" + (extra ? " extra" : "") },
    parts[0], parts[1] && React.createElement("small", null, parts[1]));
}

function KanjiSection(props) {
  var unit = props.unit,
    lv = unit.level,
    view = props.charView === 'focus' ? 'focus' : 'rows',
    kanji = unit.kanji;
  var _sel = React.useState(0), sel = _sel[0], setSel = _sel[1];
  var _seen = React.useState({ 0: true }), seen = _seen[0], setSeen = _seen[1];
  var _open = React.useState({}), open = _open[0], setOpen = _open[1]; // rows: stroke order shown per kanji id
  var look = function (i) {
    setSel(i);
    setSeen(function (p) { return Object.assign({}, p, { [i]: true }); });
  };
  var wordsOf = function (k) {
    return unit.vocab.filter(function (v) { return v.word.indexOf(k.char) >= 0; });
  };
  var meaning = function (k) { return React.createElement("div", { className: "kj-meaning" }, k.meaning.join(" · ")); };
  var readings = function (k) {
    var kunExtra = (k.extra || []).filter(function (r) { return r.indexOf('.') >= 0; });
    var onExtra = (k.extra || []).filter(function (r) { return r.indexOf('.') < 0; });
    var line = function (tag, main, extra) {
      return main.length + extra.length > 0 && React.createElement("div", { className: "kj-rd" },
        React.createElement("span", { className: "kj-tag " + tag }, tag),
        main.map(function (r) { return kanjiReading(r, false); }),
        extra.map(function (r) { return kanjiReading(r, true); }));
    };
    return React.createElement(React.Fragment, null, line('kun', k.kun || [], kunExtra), line('on', k.on || [], onExtra));
  };
  var words = function (k) {
    var ws = wordsOf(k);
    return ws.length > 0 && React.createElement("div", { className: "kj-words" },
      React.createElement("div", { className: "kj-sub" }, t('kanji_words', lv)),
      React.createElement("div", { className: "kj-word-list" }, ws.map(function (v) {
        return React.createElement("div", { key: v.id, className: "kj-word" }, React.createElement("span", { className: "kj-word-jp" }, v.word.split(k.char).map(function (part, i, a) {
          return React.createElement(React.Fragment, { key: i }, part, i < a.length - 1 && React.createElement("mark", null, k.char));
        })), React.createElement("span", { className: "kj-word-rd" }, v.reading), React.createElement("span", { className: "kj-word-gl" }, glossText(v)));
      })));
  };
  var strokes = function (k) { return k.strokes + " " + t('kanji_strokes', lv); };

  var body;
  if (view === 'focus') {
    var k = kanji[Math.min(sel, kanji.length - 1)];
    body = React.createElement(React.Fragment, null,
      React.createElement("div", { className: "kj-chips", role: "tablist" }, kanji.map(function (x, i) {
        return React.createElement("button", {
          key: x.id, role: "tab", className: "kj-chip", 'aria-selected': i === sel,
          'aria-label': x.char + ", " + x.meaning[0], onClick: function () { look(i); }
        }, x.char, seen[i] && React.createElement("span", { className: "kj-check", 'aria-hidden': true }, "✓"));
      })),
      React.createElement("div", { className: "kj-focus" },
        React.createElement("div", { className: "kj-stage" },
          React.createElement("div", { className: "kj-big", 'aria-hidden': true }, k.char),
          React.createElement("div", { className: "kj-count" }, strokes(k)),
          React.createElement(StrokeOrder, { key: k.id, ch: k.char })),
        React.createElement("div", null, meaning(k), readings(k), words(k))),
      React.createElement("div", { className: "kj-foot" },
        React.createElement("span", null, Object.keys(seen).length + " / " + kanji.length + " " + t('kanji_looked', lv)),
        sel < kanji.length - 1 && React.createElement("button", { className: "vocab-btn", onClick: function () { look(sel + 1); } }, t('kanji_next', lv))));
  } else {
    body = kanji.map(function (k) {
      var shown = !!open[k.id];
      return React.createElement("div", { key: k.id, className: "kj-row" },
        React.createElement("div", { className: "kj-side" },
          React.createElement("div", { className: "kj-big" }, k.char,
            React.createElement("button", { className: "speak-btn speak-btn-char", onClick: function () { speak(k.char); }, 'aria-label': "Listen to " + k.char }, "🔊")),
          React.createElement("div", { className: "kj-count" }, strokes(k))),
        React.createElement("div", null, meaning(k), readings(k), words(k),
          React.createElement("button", {
            className: "vocab-btn kj-stroke-btn" + (shown ? " active" : ""), 'aria-expanded': shown,
            onClick: function () { setOpen(function (p) { return Object.assign({}, p, { [k.id]: !p[k.id] }); }); }
          }, shown ? t('kanji_strokes_hide', lv) : t('kanji_strokes_show', lv)),
          shown && React.createElement(StrokeOrder, { ch: k.char })));
    });
  }
  return React.createElement("div", { className: "section" },
    charSectionHead({
      label: t('section_kanji', lv), popId: "kj-pop", infoLabel: t('kanji_info_label', lv),
      info: [
        React.createElement("p", { key: "i" }, t('kanji_info_intro', lv)),
        React.createElement("p", { key: "k" }, React.createElement("span", { className: "kj-tag kun" }, "kun"), " ", t('kanji_info_kun', lv)),
        React.createElement("p", { key: "o" }, React.createElement("span", { className: "kj-tag on" }, "on"), " ", t('kanji_info_on', lv)),
        React.createElement("p", { key: "e" }, t('kanji_info_extra', lv))],
      toggle: kanji.length > 1 && {
        label: view === 'focus' ? t('kanji_view_rows', lv) : t('kanji_view_focus', lv),
        onClick: function () { props.setCharView(view === 'focus' ? 'rows' : 'focus'); }
      }
    }),
    body);
}
