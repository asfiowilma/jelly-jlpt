"use strict";

// Settings → "Already know some Japanese?" (ticket 37, Q35): quick sort per
// level, paste / upload import, import history with undo. Writes go through
// seedKnown / undoKnown (app.js); rules live in lib.js (seedKnownCards).
function fill(s, vals) {
  return Object.keys(vals).reduce(function (out, k) { return out.split('{' + k + '}').join(vals[k]); }, s);
}
function itemFront(it) { return it.kind === 'vocab' ? it.word : it.kind === 'grammar' ? it.pattern : it.char; }
function itemBack(it) {
  return it.kind === 'vocab' ? (it.reading !== it.word ? it.reading + ' · ' : '') + glossText(it)
    : it.kind === 'kanji' ? it.meaning.join(', ') : it.romaji;
}

function ImportSettings(props) {
  var ce = React.createElement;
  var L = props.L, cards = props.cards || {}, units = props.units || [];
  var _m = React.useState(null), sorting = _m[0], setSorting = _m[1];
  var levels = LEVELS.filter(function (lv) { return units.some(function (u) { return u.level === lv; }); });
  if (sorting) {
    return ce(QuickSort, { L: L, level: sorting, items: quickSortItems(units, sorting), cards: cards, onClose: function () { setSorting(null); } });
  }
  var batches = importBatches(cards);
  return ce(React.Fragment, null,
    ce("p", { className: "setting-hint" }, L("set_known_hint")),
    ce("h4", { className: "import-h" }, L("qs_title")),
    ce("p", { className: "setting-hint" }, L("qs_hint")),
    levels.map(function (lv) {
      var items = quickSortItems(units, lv);
      var left = QuickSort.deck(items, cards, QuickSort.load(lv).notYet).length;
      return ce("div", { key: lv, className: "setting-row" },
        ce("span", null, lv, " · ", fill(L("qs_progress"), { done: items.length - left, total: items.length })),
        ce("button", { className: "data-btn", type: "button", onClick: function () { setSorting(lv); } }, fill(L("qs_start"), { lv: lv })));
    }),
    ce("h4", { className: "import-h" }, L("paste_title")),
    ce(PasteImport, { L: L, cards: cards }),
    batches.length > 0 && ce("h4", { className: "import-h" }, L("hist_title")),
    batches.length > 0 && ce("ul", { className: "import-hist" }, batches.map(function (b) {
      return ce("li", { key: b.batchId, className: "setting-row" },
        ce("span", null, L("src_" + b.source), " · ", new Date(b.at).toLocaleDateString(), " · ", fill(L("hist_row"), { n: b.count }),
          b.reviewed > 0 && ce("span", { className: "setting-hint" }, " (" + fill(L("hist_reviewed"), { n: b.reviewed }) + ")")),
        ce("button", { className: "data-btn", type: "button", onClick: function () {
          if (window.confirm(fill(L("hist_undo_confirm"), { n: b.count - b.reviewed }))) undoKnown(b.batchId);
        } }, L("hist_undo")));
    })));
}

// QuickSort: one item at a time, Known / Not yet / Undo last (+ keys).
// Resumable: known items have cards; "not yet" ids and the batch id stay in
// localStorage (device-only) under jlpt_qs_<level>.
function QuickSort(props) {
  var ce = React.createElement;
  var L = props.L, lv = props.level, items = props.items, cards = props.cards;
  // Handlers read `live` (updated synchronously) and the Store snapshot, not
  // render-time values: a fast key press can land before the re-render.
  var _s = React.useState(function () { return QuickSort.load(lv); }), st = _s[0], setSt = _s[1];
  var _h = React.useState([]), hist = _h[0], setHist = _h[1];
  var live = React.useRef(null);
  if (!live.current) live.current = { st: st, hist: hist };
  var deck = QuickSort.deck(items, cards, st.notYet);
  var cur = deck[0];
  var save = function (next) { live.current.st = next; setSt(next); safeSave('jlpt_qs_' + lv, JSON.stringify(next)); };
  var push = function (h) { live.current.hist = h; setHist(h); };
  var current = function () { return QuickSort.deck(items, Store.snapshot().srsCards, live.current.st.notYet)[0]; };
  React.useEffect(function () { save(st); }, []); // keep the batch id, so a resumed session is one history row
  var known = function () {
    var it = current();
    if (!it) return;
    seedKnown([it.id], 'quicksort', live.current.st.batchId);
    push(live.current.hist.concat([{ id: it.id, known: true }]));
  };
  var notYet = function () {
    var it = current(), s = live.current.st;
    if (!it) return;
    save({ batchId: s.batchId, notYet: s.notYet.concat([it.id]) });
    push(live.current.hist.concat([{ id: it.id, known: false }]));
  };
  var undo = function () {
    var h = live.current.hist, s = live.current.st, last = h[h.length - 1];
    if (!last) return;
    if (last.known) undoKnown(s.batchId, [last.id]);
    else save({ batchId: s.batchId, notYet: s.notYet.filter(function (id) { return id !== last.id; }) });
    push(h.slice(0, -1));
  };
  React.useEffect(function () {
    function onKey(e) {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var k = e.key;
      if (k === 'k' || k === 'K' || k === 'ArrowRight') known();
      else if (k === 'j' || k === 'J' || k === 'ArrowLeft') notYet();
      else if (k === 'Backspace') undo();
      else if (k === 'Escape') props.onClose();
      else return;
      e.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  });
  var done = items.length - deck.length;
  return ce("div", { className: "quick-sort" },
    ce("div", { className: "setting-row" },
      ce("strong", null, L("qs_title"), " · ", lv),
      ce("button", { className: "data-btn", type: "button", onClick: props.onClose }, L("qs_close"))),
    ce("div", { className: "level-progress-bar", role: "progressbar", 'aria-valuemin': 0, 'aria-valuemax': items.length, 'aria-valuenow': done,
      'aria-label': fill(L("qs_progress"), { done: done, total: items.length }) },
      ce("div", { className: "level-progress-fill", style: { width: (items.length ? done / items.length * 100 : 100) + '%' } })),
    ce("p", { className: "setting-hint" }, fill(L("qs_progress"), { done: done, total: items.length })),
    cur ? ce("div", { className: "qs-card", 'aria-live': "polite" },
      ce("div", { className: "qs-kind" }, t({ kana: 'section_kana', kanji: 'section_kanji' }[cur.kind] || 'card_vocab', props.level)),
      ce("div", { className: "qs-front", lang: "ja" }, itemFront(cur)))
      : ce("p", { className: "qs-done", role: "status" }, L("qs_done")),
    ce("div", { className: "setting-btns qs-btns" },
      ce("button", { className: "review-btn again", type: "button", disabled: !cur, onClick: notYet }, "← ", L("qs_not_yet")),
      ce("button", { className: "data-btn", type: "button", disabled: !hist.length, onClick: undo }, L("qs_undo")),
      ce("button", { className: "review-btn good", type: "button", disabled: !cur, onClick: known }, L("qs_known"), " →")),
    ce("p", { className: "setting-hint" }, L("qs_keys")),
    st.notYet.length > 0 && !cur && ce("button", { className: "data-btn", type: "button", onClick: function () {
      save({ batchId: st.batchId, notYet: [] });
      push([]);
    } }, L("qs_restart")));
}
QuickSort.load = function (lv) {
  try {
    var s = JSON.parse(localStorage.getItem('jlpt_qs_' + lv));
    if (s && typeof s.batchId === 'string' && Array.isArray(s.notYet)) return s;
  } catch (e) {}
  return { batchId: newBatchId('quicksort:' + lv), notYet: [] };
};
// deck: items still to sort (no card yet, not marked "not yet").
QuickSort.deck = function (items, cards, notYet) {
  return items.filter(function (it) { return !cards[it.id] && notYet.indexOf(it.id) < 0; });
};

// PasteImport: text or file → matched catalog items → checkbox preview by level → seed.
function PasteImport(props) {
  var ce = React.createElement;
  var L = props.L, cards = props.cards;
  var _t = React.useState(''), text = _t[0], setText = _t[1];
  var _p = React.useState(null), preview = _p[0], setPreview = _p[1]; // { ids, inSrs } | null
  var _c = React.useState({}), checked = _c[0], setChecked = _c[1];
  var _r = React.useState(null), result = _r[0], setResult = _r[1];
  var find = function () {
    var ids = matchCatalogText(text);
    var fresh = ids.filter(function (id) { return !hasRealReviews(cards[id]); });
    var on = {};
    fresh.forEach(function (id) { on[id] = true; });
    setChecked(on);
    setPreview({ ids: fresh, inSrs: ids.length - fresh.length });
    setResult(null);
  };
  var onFile = function (e) {
    var f = e.target.files && e.target.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () { setText(String(r.result)); setPreview(null); };
    r.readAsText(f);
  };
  var picked = preview ? preview.ids.filter(function (id) { return checked[id]; }) : [];
  var apply = function () {
    var r = seedKnown(picked, 'paste', newBatchId('paste'));
    setResult(fill(L("paste_result"), { n: r.added.length + r.replaced.length }));
    setPreview(null);
    setText('');
  };
  var toggle = function (id) { setChecked(function (c) { var n = Object.assign({}, c); n[id] = !n[id]; return n; }); };
  var groups = preview ? LEVELS.map(function (lv) {
    return { lv: lv, items: preview.ids.map(function (id) { return CATALOG.items[id]; }).filter(function (it) { return it.level === lv; }) };
  }).filter(function (g) { return g.items.length; }) : [];
  var countBy = function (its, kind) { return its.filter(function (it) { return it.kind === kind; }).length; };
  return ce("div", { className: "paste-import" },
    ce("p", { className: "setting-hint" }, L("paste_hint")),
    ce("label", { htmlFor: "paste-text", className: "sr-only" }, L("paste_label")),
    ce("textarea", { id: "paste-text", className: "paste-text", rows: 5, value: text, lang: "ja", placeholder: "食べる\tたべる\tto eat",
      onChange: function (e) { setText(e.target.value); setPreview(null); } }),
    ce("div", { className: "setting-row" },
      ce("label", { className: "setting-hint" }, L("paste_file"), " ",
        ce("input", { type: "file", accept: ".txt,.csv,.tsv,text/plain,text/csv,text/tab-separated-values", onChange: onFile })),
      ce("button", { className: "data-btn", type: "button", disabled: !text.trim(), onClick: find }, L("paste_find"))),
    result && ce("p", { className: "setting-hint", role: "status" }, result),
    preview && ce("div", { className: "paste-preview", role: "region", 'aria-label': fill(L("paste_found"), { n: preview.ids.length }) },
      !preview.ids.length && ce("p", { role: "status" }, L("paste_none")),
      preview.inSrs > 0 && ce("p", { className: "setting-hint" }, fill(L("paste_in_srs"), { n: preview.inSrs })),
      groups.map(function (g) {
        return ce("fieldset", { key: g.lv, className: "paste-group" },
          ce("legend", null, g.lv, " · ", fill(L("paste_found"), { n: g.items.length }), " (",
            [['kana', 'section_kana'], ['vocab', 'card_vocab'], ['kanji', 'section_kanji']].filter(function (k) { return countBy(g.items, k[0]); })
              .map(function (k) { return countBy(g.items, k[0]) + ' ' + t(k[1], props.level); }).join(' · '), ")"),
          ce("ul", { className: "paste-list" }, g.items.map(function (it) {
            return ce("li", { key: it.id },
              ce("label", null,
                ce("input", { type: "checkbox", checked: !!checked[it.id], onChange: function () { toggle(it.id); } }),
                ce("span", { lang: "ja" }, " ", itemFront(it)), ce("span", { className: "setting-hint" }, " ", itemBack(it))));
          })));
      }),
      ce("div", { className: "setting-btns" },
        ce("button", { className: "data-btn", type: "button", onClick: function () { setPreview(null); } }, L("paste_cancel")),
        ce("button", { className: "data-btn", type: "button", disabled: !picked.length, onClick: apply }, fill(L("paste_apply"), { n: picked.length })))));
}
