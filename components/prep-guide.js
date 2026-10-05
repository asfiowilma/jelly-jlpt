// PrepGuide: the exam guide of a prep / mock unit (unit.guide, authored in tools/author-plan.js).
// The lead sentence stays in unit-view's .unit-note callout (via pgText); this renders, under it, the
// "where am I in the test" bar + glance line (prep units with `part`), the kinds of question (label rail)
// or the parts (stepper, when kinds carry `min`), then time / rules.
// Strings may hold **word** (highlight) and [漢字|かんじ] furigana (lib.js furiganaParts; plain text when
// furigana is off). Never innerHTML.
var PG_PARTS = [['Vocabulary', 20], ['Grammar + reading', 40], ['Listening', 30]];

// pgText(text, furi, tag): **marked** pieces wrapped in <tag> (default mark), furigana inside each piece.
function pgText(text, furi, tag) {
  return String(text || '').split('**').map(function (piece, i) {
    var inner = furiganaParts(piece).map(function (p, j) {
      return p.r && furi ? React.createElement('ruby', { key: j }, p.t, React.createElement('rt', null, p.r)) : p.t;
    });
    return i % 2 ? React.createElement(tag || 'mark', { key: i }, inner) : React.createElement(React.Fragment, { key: i }, inner);
  });
}

function PrepGuide(props) {
  var g = props.guide, furi = props.showFurigana;
  var h = React.createElement;
  var stepper = g.kinds.some(function (k) { return k.min != null; });
  var tx = function (s, tag) { return pgText(s, furi, tag); };
  var section = function (label, cls, child) {
    return h('div', { className: 'section ' + cls }, h('div', { className: 'section-label' }, label), child);
  };
  var row = function (cls, label, text) {
    return h('p', { className: 'pg-pt ' + cls }, h('b', null, label), tx(text));
  };
  var p = g.part;
  return h('div', { className: 'pg' },
    p != null && h('div', { className: 'pg-glance' },
      h('div', { className: 'pg-bars', role: 'img',
        'aria-label': 'Part ' + (p + 1) + ' of 3: ' + PG_PARTS[p][0] + ', ' + PG_PARTS[p][1] + ' minutes' },
        PG_PARTS.map(function (x, i) {
          return h('div', { key: i, className: i === p ? 'on' : null }, x[0] + ' · ' + x[1]);
        })),
      g.glance && h('p', null, g.partJp && [h('span', { key: 'j', className: 'pg-partjp jp' }, tx(g.partJp)), ' · '], tx(g.glance, 'b'))),
    section(g.kindsLabel, 'pg-kinds', h('ol', { className: 'pg-list ' + (stepper ? 'pg-step' : 'pg-rail') }, g.kinds.map(function (k, i) {
      var name = h('div', { className: 'pg-name' },
        k.jp && h('span', { className: 'pg-jp jp' }, tx(k.jp)),
        h('span', { className: 'pg-en' }, stepper || !k.jp ? k.en : (i + 1) + ' · ' + k.en));
      return h('li', { key: i },
        stepper ? h('div', { className: 'pg-min' }, k.min, h('small', null, 'min')) : null,
        stepper ? h('div', null, name, bodyOf(k)) : name,
        stepper ? null : h('div', null, bodyOf(k)));
    }))),
    g.time && section(g.timeLabel || 'Time', 'pg-info', h('p', { className: 'pg-pt pg-plain' }, tx(g.time))),
    g.rules && section(g.timeLabel || 'Rules', 'pg-info', h('ul', { className: 'pg-rules' }, g.rules.map(function (r, i) {
      return h('li', { key: i }, h('b', null, r[0]), ' ', tx(r[1]));
    }))));

  function bodyOf(k) {
    return [
      h('p', { className: 'pg-ask', key: 'a' }, tx(k.ask)),
      row('pg-trap', 'Watch out', k.trap),
      row('pg-tip', 'Do this', k.tip),
      k.eg ? h('span', { className: 'pg-eg', key: 'e' }, h('i', null, 'e.g.'), h('span', { className: 'jp' }, tx(k.eg))) : null
    ];
  }
}
