"use strict";

// Overview: units per level. Nothing is locked (Q22): every unit opens; the
// next suggested unit (first not done) is highlighted. Levels without units
// yet show "Coming soon" (Q24).
function Overview(props) {
  var units = props.units,
    completed = props.completed,
    current = props.current,
    suggested = props.suggested,
    setUnit = props.setUnit;
  var ramp = levelRamp(units, current);
  var cur = units[current];
  return React.createElement("div", { className: "overview" },
    // Level ramp: one segment per level with units, filled up to the current unit
    React.createElement("div", {
      className: "ramp",
      role: "img",
      'aria-label': "Unit " + (current + 1) + " of " + units.length + ", level " + cur.level
    }, React.createElement("span", {
      className: "ramp-here",
      style: { '--here': ramp.here + '%' }
    }, t('unit_label', cur.level), " ", current + 1), React.createElement("div", {
      className: "ramp-bars"
    }, ramp.segments.map(function (s) {
      return React.createElement("i", { key: s.level, style: { flex: s.len, '--lv': LEVEL_COLORS[s.level] } },
        React.createElement("b", { style: { width: s.fill + '%' } }));
    })), React.createElement("div", { className: "ramp-lbl", 'aria-hidden': "true" }, ramp.segments.map(function (s) {
      return React.createElement("span", { key: s.level, style: { flex: s.len } }, s.level);
    }))),
    React.createElement("p", { className: "ramp-meta" }, completed.size, " / ", units.length, " units completed"),
    React.createElement("div", { className: "overview-header" },
      React.createElement("h2", null, "Course Overview"),
      React.createElement("span", { style: { fontSize: '0.85rem', color: 'var(--muted)' } }, "Every unit is open — pick any")),
    LEVELS.map(function (lv) {
      var lvUnits = units.filter(function (u) { return u.level === lv; });
      var done = lvUnits.filter(function (u) { return completed.has(u.id); }).length;
      var color = LEVEL_COLORS[lv];
      return React.createElement("section", { key: lv, className: "level-section", 'aria-labelledby': "lv-" + lv },
        React.createElement("div", { className: "level-progress-item" },
          React.createElement("h3", { id: "lv-" + lv, style: { color: color } }, lv),
          lvUnits.length > 0 && React.createElement("div", { className: "level-progress-bar" },
            React.createElement("div", { className: "level-progress-fill", style: { width: done / lvUnits.length * 100 + '%', background: color } })),
          lvUnits.length > 0 && React.createElement("span", null, done, " / ", lvUnits.length)),
        lvUnits.length === 0 ? React.createElement("p", { className: "level-soon" }, "Coming soon")
          : React.createElement("ol", { className: "unit-list" }, lvUnits.map(function (u) {
            var isDone = completed.has(u.id);
            var cls = "unit-row" + (isDone ? " done" : "") + (u.index === current ? " current" : "") + (u.index === suggested ? " next" : "");
            return React.createElement("li", { key: u.id },
              React.createElement("button", {
                className: cls,
                style: { '--lv': color },
                'aria-current': u.index === current ? 'true' : undefined,
                onClick: function () { setUnit(u.index); }
              },
                React.createElement("span", { className: "unit-num" }, u.index + 1),
                React.createElement("span", { className: "unit-title" }, u.title),
                u.kind !== 'lesson' && React.createElement("span", { className: "week-badge" }, u.kind),
                u.index === suggested && !isDone && React.createElement("span", { className: "unit-next" }, "Next"),
                isDone && React.createElement("span", { className: "unit-done", 'aria-label': "completed" }, "✓")));
          })));
    }));
}
