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
  return t('view_today', lv) + ": " + doneToday + " / " + todayTarget(pace).units + " " + t(todayTarget(pace).units === 1 ? 'pace_unit_one' : 'pace_units', lv);
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

// Overview = the Stages tab: course progress card (level ramp + Pace panel side
// by side), the "Up next" card, then a level picker over the stage list (a few stages
// around the first not done (a row of done ones before it), "Show all" for the rest). Nothing is locked (Q22): every unit
// opens; the next suggested unit (first not done) is highlighted. Levels
// without units yet collapse to "Coming soon" (Q24).
var WINDOW = 12; // stages listed before "Show all" (divides evenly into 1-4 columns)
var LOOK_BACK = 4; // of those, done stages kept above the first one not done, for context
function Overview(props) {
  var units = props.units,
    completed = props.completed,
    current = props.current,
    suggested = props.suggested,
    setUnit = props.setUnit,
    skipped = props.skipped || new Set();
  var ramp = levelRamp(units, current);
  var cur = units[current];
  var ce = React.createElement;
  var next = units[suggested];
  var nextUnits = units.filter(function (u) { return u.level === next.level; });
  var nextDone = nextUnits.filter(function (u) { return completed.has(u.id); }).length;
  // Level picker: starts on the level of the suggested stage; the list shows a few stages from
  // the first one not done, earlier done ones fold into one line, "Show all" opens the lot.
  var levelState = React.useState(next.level), level = levelState[0], setLevel = levelState[1];
  var allState = React.useState(false), all = allState[0], setAll = allState[1];
  var lvUnits = units.filter(function (u) { return u.level === level; });
  var firstOpen = lvUnits.findIndex(function (u) { return !completed.has(u.id); });
  var start = firstOpen < 0 ? Math.max(0, lvUnits.length - WINDOW) : Math.max(0, firstOpen - LOOK_BACK);
  var windowEnd = Math.min(lvUnits.length, start + WINDOW);
  var shown = all ? lvUnits : lvUnits.slice(start, windowEnd);
  var hidden = start;
  var head = function (label, right) {
    return ce("h2", { className: "panel-h" }, label, ce("span", { className: "r" }, right));
  };
  return ce("div", { className: "overview" },
    ce("section", { className: "panel", 'aria-label': "Course progress" },
      head("Course progress", (completed.size - skipped.size) + " of " + units.length + " stages done" + (skipped.size ? " · " + t('skipped_count', cur.level).replace('{n}', skipped.size) : "")),
      ce("div", { className: "course" },
        // Level ramp: one segment per level with units, filled up to the current unit
        ce("div", {
          className: "ramp",
          role: "img",
          'aria-label': "Stage " + (current + 1) + " of " + units.length + ", level " + cur.level
        }, ce("span", { className: "ramp-here", style: { '--here': ramp.here + '%' } }, t('unit_label', cur.level), " ", current + 1),
          ce("div", { className: "ramp-bars" }, ramp.segments.map(function (s) {
            return ce("i", { key: s.level, style: { flex: s.len, '--lv': LEVEL_COLORS[s.level] } }, ce("b", { style: { width: s.fill + '%' } }));
          })),
          ce("div", { className: "ramp-lbl", 'aria-hidden': "true" }, ramp.segments.map(function (s) {
            return ce("span", { key: s.level, style: { flex: s.len } }, s.level);
          }))),
        ce(PacePanel, { units: units, completed: completed, level: cur.level, pace: props.pace || 1,
          doneToday: props.doneToday || 0, examDate: props.examDate }))),
    // Up next: gradient entry card (same look as the stage quiz entry), hidden once every stage is done
    completed.size < units.length && ce("section", { className: "qz-entry up-next", 'aria-label': "Up next" },
      jelly('idle', 64, true, true),
      ce("div", { className: "txt" },
        ce("div", { className: "eyebrow" }, "Up next · ", t('unit_label', next.level), " ", suggested + 1),
        ce("h3", null, next.title),
        ce("p", null, next.level, " · ", nextDone, " of ", nextUnits.length, " stages done")),
      ce("button", { className: "quiz-start-btn", onClick: function () { setUnit(suggested); } }, "Start stage " + (suggested + 1))),
    ce("section", { className: "panel", 'aria-label': "Stages" },
      head("Stages", "Every stage is open. Start anywhere."),
      // Level picker: one card per level; levels without stages yet are disabled ("Coming soon")
      ce("div", { className: "lv-cards", role: "group", 'aria-label': "Level" }, LEVELS.map(function (lv) {
        var us = units.filter(function (u) { return u.level === lv; });
        var d = us.filter(function (u) { return completed.has(u.id); }).length, sk = us.filter(function (u) { return skipped.has(u.id); }).length;
        return ce("button", {
          key: lv, className: "lv-card", disabled: us.length === 0, style: { '--lv': LEVEL_COLORS[lv] },
          'aria-pressed': lv === level ? "true" : "false",
          onClick: function () { setLevel(lv); setAll(false); }
        }, ce("b", null, lv),
          us.length ? ce("small", null, d - sk, " of ", us.length, " done", sk ? " · " + sk + " skipped" : "") : ce("small", null, "Coming soon"),
          us.length > 0 && ce("span", { className: "level-progress-bar" },
            ce("span", { className: "level-progress-fill", style: { width: d / us.length * 100 + '%' } })));
      })),
      ce("ol", { className: "unit-list", style: { '--lv': LEVEL_COLORS[level] } },
        !all && hidden > 0 && ce("li", { className: "unit-fold-li" },
          ce("button", { className: "unit-fold", onClick: function () { setAll(true); } }, "✓ Show ", hidden, " completed ", hidden === 1 ? "stage" : "stages")),
        shown.map(function (u) {
          var isDone = completed.has(u.id), isSkipped = isDone && skipped.has(u.id);
          var known = knownCount(unitItems([u]), props.cards || {});
          var cls = "unit-row" + (isSkipped ? " skipped" : isDone ? " done" : "") + (u.index === current ? " current" : "") + (u.index === suggested ? " next" : "");
          return ce("li", { key: u.id },
            ce("button", {
              className: cls,
              title: [isSkipped ? t('skipped_label', level) : "", known > 0 ? t('unit_known', level).replace('{n}', known) : ""].filter(Boolean).join(" · ") || undefined,
              'aria-current': u.index === current ? 'true' : undefined,
              onClick: function () { setUnit(u.index); }
            },
              ce("span", { className: "unit-num" }, u.index + 1),
              ce("span", { className: "unit-title" }, u.title),
              u.kind !== 'lesson' && u.kind !== 'kana' && ce("span", { className: "week-badge" }, u.kind),
              u.index === suggested && !isDone && ce("span", { className: "unit-next" }, "Up next"),
              isSkipped ? ce("span", { className: "unit-skipped", 'aria-label': t('skipped_label', level) }, t('skipped_tag', level))
                : isDone && ce("span", { className: "unit-done", 'aria-label': "completed" }, "✓")));
        })),
      lvUnits.length > windowEnd - start && ce("button", { className: "unit-showall", 'aria-expanded': all ? "true" : "false", onClick: function () { setAll(!all); } },
        all ? "Show fewer" : "Show all " + lvUnits.length + " stages")),
    props.onDiagnostic && DiagnosticPanel({ onStart: props.onDiagnostic }));
}

// DiagnosticPanel: the anytime diagnostic mock (ticket 18, x:n5-mock-3) and its last result.
var DIAGNOSTIC_MOCK = 'x:n5-mock-3';
function DiagnosticPanel(props) {
  var ce = React.createElement, m = CATALOG.items[DIAGNOSTIC_MOCK];
  if (!m) return null;
  var last = (Store.snapshot().mocks || []).filter(function (x) { return x.mockId === m.id; })[0];
  var mins = mockSections(m).reduce(function (n, s) { return n + Math.round(s.seconds / 60); }, 0);
  return ce("section", { className: "panel diagnostic", 'aria-label': "N5 diagnostic test" },
    ce("h2", { className: "panel-h" }, "N5 diagnostic test", ce("span", { className: "r" }, "About " + mins + " min · take it anytime")),
    ce("p", null, "A timed, half-length N5 test in the exam format. You get an estimated score and every missed question explained.",
      last ? " Last score: " + last.estimate.total + " / 180, " + (last.estimate.passed ? "a pass." : "below the pass mark.") : ""),
    ce("button", { className: "btn-outline", onClick: props.onStart }, last ? "Retake diagnostic" : "Start diagnostic"));
}
