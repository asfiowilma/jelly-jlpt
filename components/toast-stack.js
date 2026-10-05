"use strict";

// Achievement toasts (ticket 08, mechanics in ticket 30). One batch at a time, stacked newest on
// top (max 3 + "+N more"), dismissed together after ~4 s; hover or focus pauses the whole stack.
// batch = achievementBatch(...) result: { summary, toasts: [ids], more }. A summary batch is one toast
// ("You've earned N achievements"). Click a toast → onOpen(id); the summary or "+N more" → onMore().
// aria-live="polite" so screen readers announce without stealing focus.
var TOAST_MS = 7000, TOAST_OUT_MS = 300; // TOAST_OUT_MS = the .toast-out animation in styles.css

// toastStamp(def): the real earned stamp (components/stamp.js), the same one the Achievements screen shows.
// The rarity chip sits at the top right of the toast, on the "Achievement unlocked" row; common has none.
// The sub line is the achievement's description (the revealed text for hidden ones), clamped to one line in CSS.
function toastStamp(def) {
  return React.createElement('span', { className: 'toast-stamp', 'aria-hidden': 'true' },
    React.createElement(Stamp, { id: def.id, uid: 'toast-' + def.id, category: def.category, rarity: def.rarity, level: def.level, earned: true, hidden: def.hidden, name: def.name }));
}

function ToastStack(props) {
  // The parent drops `batch` to dismiss; we keep rendering the last one for TOAST_OUT_MS so it can animate out.
  var shownState = React.useState(null), shown = shownState[0], setShown = shownState[1];
  var batch = props.batch || shown, leaving = !props.batch && !!shown;
  var paused = React.useState(false), isPaused = paused[0], setPaused = paused[1];
  React.useEffect(function () {
    if (!props.batch || isPaused) return undefined;
    var h = setTimeout(props.onDone, TOAST_MS);
    return function () { clearTimeout(h); };
  }, [props.batch, isPaused]);
  React.useEffect(function () {
    if (props.batch) { setShown(props.batch); return undefined; }
    var h = setTimeout(function () { setShown(null); setPaused(false); }, TOAST_OUT_MS);
    return function () { clearTimeout(h); };
  }, [props.batch]);
  var kids = [];
  if (batch && batch.summary) {
    kids.push(React.createElement('button', { key: 'summary', className: 'toast toast-summary' + (leaving ? ' toast-out' : ''), onClick: props.onMore },
      React.createElement('span', { className: 'toast-body' },
        React.createElement('strong', null, "You've earned " + batch.summary + (batch.summary === 1 ? ' achievement' : ' achievements')),
        React.createElement('span', { className: 'toast-sub' }, 'Take a look'))));
  } else if (batch) {
    batch.toasts.forEach(function (id, i) {
      var def = ACHIEVEMENTS.filter(function (a) { return a.id === id; })[0];
      if (!def) return;
      kids.push(React.createElement('button', { key: id, className: 'toast toast-' + def.rarity + (leaving ? ' toast-out' : ''), style: { '--i': i }, onClick: function () { props.onOpen(id); } },
        toastStamp(def),
        React.createElement('span', { className: 'toast-body' },
          React.createElement('span', { className: 'toast-head' },
            React.createElement('span', { className: 'toast-kicker' }, 'Achievement unlocked'),
            def.rarity !== 'common' && React.createElement('span', { className: 'toast-chip toast-chip-' + def.rarity }, def.rarity)),
          React.createElement('strong', null, def.name),
          React.createElement('span', { className: 'toast-sub' }, def.revealed || def.desc))));
    });
    if (batch.more) kids.push(React.createElement('button', { key: 'more', className: 'toast toast-more' + (leaving ? ' toast-out' : ''), style: { '--i': batch.toasts.length }, onClick: props.onMore }, '+' + batch.more + ' more'));
  }
  return React.createElement('div', {
    className: 'toast-stack', role: 'status', 'aria-live': 'polite',
    onMouseEnter: function () { setPaused(true); }, onMouseLeave: function () { setPaused(false); },
    onFocus: function () { setPaused(true); }, onBlur: function () { setPaused(false); }
  }, kids);
}
