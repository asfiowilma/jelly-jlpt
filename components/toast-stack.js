"use strict";

// Achievement toasts (ticket 08, mechanics in ticket 30). One batch at a time, stacked newest on
// top (max 3 + "+N more"), dismissed together after ~4 s; hover or focus pauses the whole stack.
// batch = achievementBatch(...) result: { summary, toasts: [ids], more }. A summary batch is one toast
// ("You've earned N achievements"). Click a toast → onOpen(id); the summary or "+N more" → onMore().
// aria-live="polite" so screen readers announce without stealing focus.
var TOAST_MS = 4000;

// toastStamp(def): the stamp image in a toast. Placeholder (category kanji on a tile); swap this one
// call for the real stamp renderer when it is merged.
function toastStamp(def) {
  return React.createElement('span', { className: 'toast-stamp', 'aria-hidden': 'true' }, ACH_CATEGORIES[def.category]);
}

function ToastStack(props) {
  var batch = props.batch;
  var paused = React.useState(false), isPaused = paused[0], setPaused = paused[1];
  React.useEffect(function () {
    if (!batch || isPaused) return undefined;
    var h = setTimeout(props.onDone, TOAST_MS);
    return function () { clearTimeout(h); };
  }, [batch, isPaused]);
  var kids = [];
  if (batch && batch.summary) {
    kids.push(React.createElement('button', { key: 'summary', className: 'toast toast-summary', onClick: props.onMore },
      React.createElement('span', { className: 'toast-body' },
        React.createElement('strong', null, "You've earned " + batch.summary + (batch.summary === 1 ? ' achievement' : ' achievements')),
        React.createElement('span', { className: 'toast-sub' }, 'Take a look'))));
  } else if (batch) {
    batch.toasts.forEach(function (id) {
      var def = ACHIEVEMENTS.filter(function (a) { return a.id === id; })[0];
      if (!def) return;
      kids.push(React.createElement('button', { key: id, className: 'toast toast-' + def.rarity, onClick: function () { props.onOpen(id); } },
        toastStamp(def),
        React.createElement('span', { className: 'toast-body' },
          React.createElement('span', { className: 'toast-kicker' }, 'Achievement unlocked'),
          React.createElement('strong', null, def.name),
          React.createElement('span', { className: 'toast-sub' }, def.rarity + ' · ' + def.category))));
    });
    if (batch.more) kids.push(React.createElement('button', { key: 'more', className: 'toast toast-more', onClick: props.onMore }, '+' + batch.more + ' more'));
  }
  return React.createElement('div', {
    className: 'toast-stack', role: 'status', 'aria-live': 'polite',
    onMouseEnter: function () { setPaused(true); }, onMouseLeave: function () { setPaused(false); },
    onFocus: function () { setPaused(true); }, onBlur: function () { setPaused(false); }
  }, kids);
}
