// PrepGuide: the exam guide of a prep / mock unit (unit.guide, authored in tools/author-plan.js).
// The lead sentence stays in unit-view's .unit-note callout; this renders the rest: a facts line,
// the kinds of question (label rail) or the parts (stepper, when kinds carry `min`), then time / rules.
// Strings may hold **word** → <mark>. Never innerHTML.
function pgMarks(text) {
  return String(text || '').split('**').map(function (p, i) {
    return i % 2 ? React.createElement('mark', { key: i }, p) : p;
  });
}

function PrepGuide(props) {
  var g = props.guide;
  var h = React.createElement;
  var stepper = g.kinds.some(function (k) { return k.min != null; });
  var section = function (label, cls, child) {
    return h('div', { className: 'section ' + cls }, h('div', { className: 'section-label' }, label), child);
  };
  var row = function (cls, label, text) {
    return h('p', { className: 'pg-pt ' + cls }, h('b', null, label), pgMarks(text));
  };
  return h('div', { className: 'pg' },
    h('div', { className: 'pg-facts' }, g.facts.map(function (f, i) {
      return h('span', { key: i }, f[0] + ' ', h('b', null, f[1]));
    })),
    section(g.kindsLabel, 'pg-kinds', h('ol', { className: 'pg-list ' + (stepper ? 'pg-step' : 'pg-rail') }, g.kinds.map(function (k, i) {
      var name = h('div', { className: 'pg-name' },
        k.jp && h('span', { className: 'pg-jp jp' }, k.jp),
        h('span', { className: 'pg-en' }, stepper || !k.jp ? k.en : (i + 1) + ' · ' + k.en));
      return h('li', { key: i },
        stepper ? h('div', { className: 'pg-min' }, k.min, h('small', null, 'min')) : null,
        stepper ? h('div', null, name, bodyOf(k)) : name,
        stepper ? null : h('div', null, bodyOf(k)));
    }))),
    g.time && section(g.timeLabel || 'Time', 'pg-info', h('p', { className: 'pg-pt pg-plain' }, pgMarks(g.time))),
    g.rules && section(g.timeLabel || 'Rules', 'pg-info', h('ul', { className: 'pg-rules' }, g.rules.map(function (r, i) {
      return h('li', { key: i }, h('b', null, r[0]), ' ' + r[1]);
    }))));

  function bodyOf(k) {
    return [
      h('p', { className: 'pg-ask', key: 'a' }, k.ask),
      row('pg-trap', 'Watch out', k.trap),
      row('pg-tip', 'Do this', k.tip),
      k.eg ? h('span', { className: 'pg-eg', key: 'e' }, h('i', null, 'e.g.'), h('span', { className: 'jp' }, k.eg)) : null
    ];
  }
}
