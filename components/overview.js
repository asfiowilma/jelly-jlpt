"use strict";

// paceMode: the PACE_MODES entry for a stored pace (unknown → standard).
function paceMode(pace) {
  return PACE_MODES.filter(function (m) { return m.pace === pace; })[0] || PACE_MODES[1];
}
// paceTodayLine: "Today: 1 / 2 units" (also shown in UnitView).
function paceTodayLine(pace, doneToday, lv) {
  return t('view_today', lv) + ": " + doneToday + " / " + todayTarget(pace).units + " " + t('pace_units', lv);
}

// PacePanel: today target, projected finish (current level + all available
// levels) and, with an exam date, on-track status + suggested pace.
function PacePanel(props) {
  var units = props.units, completed = props.completed, lv = props.level, pace = props.pace;
  var now = Date.now();
  var left = function (us) { return us.filter(function (u) { return !completed.has(u.id); }).length; };
  var lvLeft = left(units.filter(function (u) { return u.level === lv; }));
  var allLeft = left(units);
  var levels = units[units.length - 1].level === units[0].level ? null : units[0].level + "–" + units[units.length - 1].level;
  var exam = null;
  if (props.examDate) {
    var sug = suggestPace(lvLeft, props.examDate, now);
    exam = React.createElement("p", null, t('pace_exam', lv), " ", props.examDate, ": ",
      sug === null ? t('pace_too_late', lv)
        : (pace >= sug ? t('pace_on_track', lv) : t('pace_behind', lv)) + " · " + t('pace_suggested', lv) + ": " + t(paceMode(sug).key, lv));
  }
  return React.createElement("div", { className: "pace-panel ramp-meta" },
    React.createElement("p", null, React.createElement("strong", null, paceTodayLine(pace, props.doneToday, lv)), " · ", t(paceMode(pace).key, lv)),
    React.createElement("p", null, t('pace_finish', lv), " ", lv, ": ", localDate(projectFinish(lvLeft, pace, now)),
      levels && " · " + t('pace_all_levels', lv) + " (" + levels + "): " + localDate(projectFinish(allLeft, pace, now))),
    exam);
}

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
    React.createElement(PacePanel, { units: units, completed: completed, level: cur.level, pace: props.pace || 1,
      doneToday: props.doneToday || 0, examDate: props.examDate }),
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
