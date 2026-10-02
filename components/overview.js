"use strict";

function Overview(_ref10) {
  var curriculum = _ref10.curriculum,
    completed = _ref10.completed,
    setDay = _ref10.setDay,
    currentDay = _ref10.currentDay;
  var _React$useStateLevel = React.useState('all'),
    _React$useStateLevel2 = _slicedToArray(_React$useStateLevel, 2),
    levelFilter = _React$useStateLevel2[0],
    setLevelFilter = _React$useStateLevel2[1];
  var LEVELS = [
    { key: 'all', label: 'All', range: [1, 9999] },
    { key: 'N5', label: 'N5', range: [1, 365] },
    { key: 'N4', label: 'N4', range: [366, 660] },
    { key: 'N3', label: 'N3', range: [661, 960] },
    { key: 'N2', label: 'N2', range: [961, 1320] },
    { key: 'N1', label: 'N1', range: [1321, 1720] }
  ];
  var filteredCurriculum = curriculum.filter(function (l) {
    if (levelFilter === 'all') return true;
    var lv = LEVELS.find(function (lv) { return lv.key === levelFilter; });
    return lv && l.day >= lv.range[0] && l.day <= lv.range[1];
  });
  var phases = [];
  var seen = {};
  filteredCurriculum.forEach(function (l) {
    if (!seen[l.phaseNum]) { seen[l.phaseNum] = true; phases.push(l.phaseNum); }
  });
  // Per-level progress
  var levelProgress = LEVELS.slice(1).map(function (lv) {
    var lvDays = curriculum.filter(function (l) { return l.day >= lv.range[0] && l.day <= lv.range[1]; });
    var lvDone = lvDays.filter(function (l) { return completed.has(l.day); }).length;
    return { key: lv.key, label: lv.label, total: lvDays.length, done: lvDone, pct: lvDays.length > 0 ? Math.round(lvDone / lvDays.length * 100) : 0 };
  });
  var ramp = levelRamp(currentDay, curriculum.length);
  return /*#__PURE__*/React.createElement("div", {
    className: "overview"
  },
  // N5→N1 level ramp: segments sized by level day range, filled up to the current day
  /*#__PURE__*/React.createElement("div", {
    className: "ramp",
    role: "img",
    'aria-label': "Day " + currentDay + " of " + curriculum.length + ", level " + dayToLevel(currentDay)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ramp-here",
    style: { '--here': ramp.here + '%' }
  }, t('day_label', currentDay), " ", currentDay), /*#__PURE__*/React.createElement("div", {
    className: "ramp-bars"
  }, ramp.segments.map(function (s) {
    return /*#__PURE__*/React.createElement("i", {
      key: s.level,
      style: { flex: s.len, '--lv': LEVEL_COLORS[s.level] }
    }, /*#__PURE__*/React.createElement("b", { style: { width: s.fill + '%' } }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ramp-lbl",
    'aria-hidden': "true"
  }, ramp.segments.map(function (s) {
    return /*#__PURE__*/React.createElement("span", { key: s.level, style: { flex: s.len } }, s.level);
  }))), /*#__PURE__*/React.createElement("p", {
    className: "ramp-meta"
  }, completed.size, " / ", curriculum.length, " completed"), /*#__PURE__*/React.createElement("div", {
    className: "overview-header"
  }, /*#__PURE__*/React.createElement("h2", null, "Course Overview \u2014 All ", curriculum.length, " Days"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--muted)'
    }
  }, "Click a day to jump to it")),
  // Level filter tabs
  /*#__PURE__*/React.createElement("div", { className: "level-tabs" }, LEVELS.map(function (lv) {
    return /*#__PURE__*/React.createElement("button", {
      key: lv.key,
      className: "level-tab" + (levelFilter === lv.key ? " active" : ""),
      onClick: function () { setLevelFilter(lv.key); }
    }, lv.label);
  })),
  // Per-level progress bars
  /*#__PURE__*/React.createElement("div", { className: "level-progress" }, levelProgress.map(function (lp) {
    if (lp.total === 0) return null;
    var color = LEVEL_COLORS[lp.key] || 'var(--muted)';
    return /*#__PURE__*/React.createElement("div", { key: lp.key, className: "level-progress-item" },
      /*#__PURE__*/React.createElement("span", null, lp.label),
      /*#__PURE__*/React.createElement("div", { className: "level-progress-bar" },
        /*#__PURE__*/React.createElement("div", { className: "level-progress-fill", style: { width: lp.pct + '%', background: color } })
      ),
      /*#__PURE__*/React.createElement("span", null, lp.pct + '%'),
      lp.pct === 100 && /*#__PURE__*/React.createElement("span", { className: "level-badge", style: { background: color } }, "\u2713")
    );
  })),
  /*#__PURE__*/React.createElement("div", {
    className: "phase-legend"
  }, phases.map(function (p) {
    return /*#__PURE__*/React.createElement("div", {
      key: p,
      className: "legend-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "legend-dot",
      style: {
        background: PHASE_COLORS[p]
      }
    }), /*#__PURE__*/React.createElement("span", null, PHASE_NAMES[p]));
  })), /*#__PURE__*/React.createElement("div", {
    className: "cal-grid"
  }, filteredCurriculum.map(function (lesson) {
    var d = lesson.day;
    var col = PHASE_COLORS[lesson.phaseNum];
    var isDone = completed.has(d);
    var isCurrent = d === currentDay;
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      className: "cal-day ".concat(isDone ? 'done' : '', " ").concat(isCurrent ? 'current' : ''),
      style: {
        background: col
      },
      onClick: function onClick() {
        return setDay(d);
      },
      title: "Day ".concat(d, ": ").concat(lesson.title),
      'aria-label': "Day " + d + ": " + lesson.title + (isDone ? ", completed" : isCurrent ? ", current day" : ""),
      role: "button",
      tabIndex: 0,
      onKeyDown: function onKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDay(d); }
      }
    }, isDone ? '✓' : d);
  })));
}
