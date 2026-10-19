"use strict";

// Pool pick for the mastery challenge (full-screen flow): two doors, no stage names, no draw.
// props: level, completed (Set of done or skipped stage ids), onClose, onGo(mode)
function ChallengePool(props) {
  var ce = React.createElement, level = props.level;
  var stages = challengeStages(level);
  // not challengePool(): its 'incomplete' mode falls back to the whole level when nothing is left
  var left = stages.filter(function (u) { return !props.completed.has(u.id); });
  var none = left.length === 0;
  var _s = React.useState(none ? 'whole' : 'incomplete'), mode = _s[0], setMode = _s[1];
  var shell = useQuizLayer(true, false);
  shell.keyRef.current = function (e) { if (e.key === 'Escape') props.onClose(); else shell.trapTab(e); };
  var it = CATALOG.items['x:' + String(level).toLowerCase() + '-challenge'];
  var title = it ? it.title : level + " Mastery Challenge";
  function door(m, name, sub) {
    var on = mode === m;
    return ce("button", { key: m, className: "opt", role: "radio", 'aria-checked': on, onClick: function () { setMode(m); } },
      ce("span", { className: "tick", 'aria-hidden': "true" }, on ? "●" : "○"), ce("b", null, name), ce("small", null, sub));
  }
  var top = qzTop(ce, { xLabel: "Close", onX: props.onClose, progLabel: "Pool", now: 0, segs: [], meta: [ce("span", { key: "l" }, title)] });
  var main = [
    ce("button", { key: "bk", className: "unit-back", onClick: props.onClose }, "← Back to stages"),
    ce("section", { key: "pl", className: "panel pool" },
      ce("div", { className: "top" }, jelly(none ? 'happy' : 'smug', 64, true),
        ce("div", { className: "txt" },
          ce("div", { className: "eyebrow" }, title),
          ce("p", { className: "lead" }, none ? "Nothing left to clear. Going again?" : "What are we testing?"))),
      ce("div", { className: "opts" + (none ? " one" : ""), role: "radiogroup", 'aria-label': "Pool" },
        !none && door('incomplete', "Just what's left", left.length + " stages you haven't cleared."),
        door('whole', "The whole level", "All " + stages.length + " stages, cleared ones too.")),
      ce("div", { className: "rules" }, ce("span", null, "Up to 5 stages"), ce("span", null, "Up to 40 questions"), ce("span", null, "All mixed up")),
      ce("button", { className: "qz-btn", onClick: function () { props.onGo(mode); } }, "Let's go"))];
  return qzLayer(ce, shell, { label: title, top: top, main: main });
}
