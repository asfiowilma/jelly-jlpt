"use strict";

// paceMode: the PACE_MODES entry for a stored pace (unknown → standard).
function paceMode(pace) {
  return PACE_MODES.filter(function (m) { return m.pace === pace; })[0] || PACE_MODES[1];
}
// showDate: Date or "YYYY-MM-DD" → "12 Oct 2026" in the browser's locale (display only; localDate stays the storage key).
function showDate(d) {
  if (typeof d === 'string') { var p = d.split('-'); d = new Date(+p[0], +p[1] - 1, +p[2]); }
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
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
    exam = React.createElement("p", null, t('pace_exam', lv), " ", showDate(props.examDate), ": ",
      sug === null ? t('pace_too_late', lv)
        : (pace >= sug ? t('pace_on_track', lv) : t('pace_behind', lv)) + " · " + t('pace_suggested', lv) + ": " + t(paceMode(sug).key, lv).split(/[:：]/)[0]);
  }
  return React.createElement("div", { className: "pace-panel ramp-meta" },
    React.createElement("p", null, React.createElement("strong", null, paceTodayLine(pace, props.doneToday, lv)), " · ", t(paceMode(pace).key, lv)),
    React.createElement("p", null, t('pace_finish', lv), " ", lv, ": ", showDate(projectFinish(lvLeft, pace, now)),
      levels && " · " + t('pace_all_levels', lv) + " (" + levels + "): " + showDate(projectFinish(allLeft, pace, now))),
    exam);
}

// Overview = the Units tab: course progress card (level ramp + Pace panel side
// by side) and the units grid per level. Nothing is locked (Q22): every unit
// opens; the next suggested unit (first not done) is highlighted. Levels
// without units yet collapse to "Coming soon" (Q24).
function Overview(props) {
  var units = props.units,
    completed = props.completed,
    current = props.current,
    suggested = props.suggested,
    setUnit = props.setUnit;
  var ramp = levelRamp(units, current);
  var cur = units[current];
  var ce = React.createElement;
  var head = function (label, right) {
    return ce("h2", { className: "panel-h" }, label, ce("span", { className: "r" }, right));
  };
  return ce("div", { className: "overview" },
    ce("section", { className: "panel", 'aria-label': "Course progress" },
      head("Course progress", completed.size + " / " + units.length + " units"),
      ce("div", { className: "course" },
        // Level ramp: one segment per level with units, filled up to the current unit
        ce("div", {
          className: "ramp",
          role: "img",
          'aria-label': "Unit " + (current + 1) + " of " + units.length + ", level " + cur.level
        }, ce("span", { className: "ramp-here", style: { '--here': ramp.here + '%' } }, t('unit_label', cur.level), " ", current + 1),
          ce("div", { className: "ramp-bars" }, ramp.segments.map(function (s) {
            return ce("i", { key: s.level, style: { flex: s.len, '--lv': LEVEL_COLORS[s.level] } }, ce("b", { style: { width: s.fill + '%' } }));
          })),
          ce("div", { className: "ramp-lbl", 'aria-hidden': "true" }, ramp.segments.map(function (s) {
            return ce("span", { key: s.level, style: { flex: s.len } }, s.level);
          }))),
        ce(PacePanel, { units: units, completed: completed, level: cur.level, pace: props.pace || 1,
          doneToday: props.doneToday || 0, examDate: props.examDate }))),
    ce("section", { className: "panel", 'aria-label': "Units" },
      head("Units", "Every unit is open. Start anywhere."),
      LEVELS.map(function (lv) {
        var lvUnits = units.filter(function (u) { return u.level === lv; });
        var done = lvUnits.filter(function (u) { return completed.has(u.id); }).length;
        var color = LEVEL_COLORS[lv];
        return ce("section", { key: lv, className: "level-section", style: { '--lv': color }, 'aria-labelledby': "lv-" + lv },
          ce("div", { className: "level-progress-item" },
            ce("h3", { id: "lv-" + lv }, lv),
            lvUnits.length > 0 && ce("div", { className: "level-progress-bar" },
              ce("div", { className: "level-progress-fill", style: { width: done / lvUnits.length * 100 + '%' } })),
            lvUnits.length > 0 ? ce("span", null, done, " / ", lvUnits.length) : ce("span", null, "Coming soon")),
          lvUnits.length > 0 && ce("ol", { className: "unit-list" }, lvUnits.map(function (u) {
            var isDone = completed.has(u.id);
            var cls = "unit-row" + (isDone ? " done" : "") + (u.index === current ? " current" : "") + (u.index === suggested ? " next" : "");
            return ce("li", { key: u.id },
              ce("button", {
                className: cls,
                'aria-current': u.index === current ? 'true' : undefined,
                onClick: function () { setUnit(u.index); }
              },
                ce("span", { className: "unit-num" }, u.index + 1),
                ce("span", { className: "unit-title" }, u.title),
                u.kind !== 'lesson' && u.kind !== 'kana' && ce("span", { className: "week-badge" }, u.kind),
                u.index === suggested && !isDone && ce("span", { className: "unit-next" }, "Up next"),
                isDone && ce("span", { className: "unit-done", 'aria-label': "completed" }, "✓")));
          })));
      })));
}
