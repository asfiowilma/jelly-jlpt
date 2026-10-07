"use strict";

// DialoguePractice: the last section of a lesson with a dialogue (unit.dialogue), above the quiz.
// Ungraded Remix practice: same scene, one detail swapped, build the line from chunks (lib.js
// dialogueSwaps; the item's `remixes`, 1-3). No score, no SRS card, never blocks the quiz. Only
// "done" is remembered, per unit on this device (lib.js dialogState, never synced).
function DialoguePractice(props) {
  var h = React.createElement;
  var unit = props.unit;
  var _swaps = React.useState(function () { return dialogueSwaps(unit); }), swaps = _swaps[0], setSwaps = _swaps[1];
  var _done = React.useState(function () { return !!dialogState(unit.id).practiced; }), done = _done[0], setDone = _done[1];
  var _i = React.useState(0), i = _i[0], setI = _i[1];
  var _picks = React.useState([]), picks = _picks[0], setPicks = _picks[1];
  var _res = React.useState(null), res = _res[0], setRes = _res[1]; // null | 'ok' | 'bad'
  if (!swaps.length) return null;
  var ex = swaps[i], many = swaps.length > 1, last = i === swaps.length - 1;
  var replay = function () {
    var el = document.getElementById('dlg-hero');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };
  var check = function () {
    var ok = answerIsRight(ex, picks);
    setRes(ok ? 'ok' : 'bad');
    if (ok) playSfx('correct'); // no sound on a miss: practice is ungraded
    if (ok && last) { setDone(true); saveDialogState(unit.id, { practiced: true }); }
  };
  var again = function () {
    saveDialogState(unit.id, { practiced: false });
    setSwaps(dialogueSwaps(unit)); setDone(false); setI(0); setPicks([]); setRes(null);
  };
  var next = function () { setI(i + 1); setPicks([]); setRes(null); };
  var locked = res === 'ok';
  var head = h('div', { className: 'dlg-pr-head' }, h('h3', null, 'Practice'),
    many && !(done && res === null) && h('span', { className: 'dlg-pr-count' }, (i + 1) + ' / ' + swaps.length),
    h('span', { className: 'dlg-pr-opt' }, 'optional, not scored'));

  // revisited stage: just the Done state
  if (done && res === null) {
    return h('div', { className: 'section dlg-practice dlg-pr-done' }, head,
      h('div', { className: 'dlg-pr-end' }, h('b', { className: 'dlg-pr-ok' }, 'Done ✓'),
        h('button', { className: 'dlg-ghost', onClick: again }, 'Practise again')));
  }
  return h('div', { className: 'section dlg-practice' }, head,
    h('p', { className: 'dlg-pr-scene' }, ex.scene + ' ', h('button', { className: 'link-btn', onClick: replay }, 'Replay dialog')),
    h('p', { className: 'dlg-pr-target' }, 'Build it in Japanese: ', h('b', null, ex.prompt)),
    ex.note && h('p', { className: 'dlg-pr-note' }, ex.note),
    h('div', { className: 'qz-answerline' + (res ? ' ' + res : ''), lang: 'ja' }, picks.map(function (itemIdx, pos) {
      return h('button', { key: pos, className: 'qz-tile', disabled: locked,
        onClick: function () { setPicks(picks.filter(function (_, p) { return p !== pos; })); setRes(null); } }, ex.items[itemIdx]);
    })),
    h('div', { className: 'qz-bank', lang: 'ja' }, ex.items.map(function (item, k) {
      return h('button', { key: k, className: 'qz-tile' + (picks.indexOf(k) >= 0 ? ' used' : ''), disabled: locked || picks.indexOf(k) >= 0,
        onClick: function () { setPicks(picks.concat([k])); setRes(null); } }, item);
    })),
    res && h('p', { className: 'dlg-pr-why ' + res, role: 'status' }, res === 'ok' ? '✓ ' : 'Not quite. ', ex.explain),
    h('div', { className: 'dlg-pr-acts' },
      !locked && h('button', { className: 'dlg-play', disabled: picks.length !== ex.need, onClick: check }, 'Check'),
      !locked && h('button', { className: 'dlg-ghost', disabled: !picks.length, onClick: function () { setPicks([]); setRes(null); } }, 'Reset'),
      locked && !last && h('button', { className: 'dlg-play', onClick: next }, 'Next swap'),
      locked && last && [h('b', { key: 'd', className: 'dlg-pr-ok' }, 'Done ✓'),
        h('button', { key: 'a', className: 'dlg-ghost', onClick: again }, 'Practise again')]));
}
