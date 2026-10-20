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
  // a finished level projects "today"; show the next unfinished level's finish instead
  var nextU = lvLeft ? null : units.filter(function (u) { return !completed.has(u.id); })[0];
  var finLv = nextU ? nextU.level : lv;
  var finLeft = nextU ? left(units.filter(function (u) { return u.level === finLv; })) : lvLeft;
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
    React.createElement("p", null, t('pace_finish', lv), " ", finLv, ": ", showDate(projectFinish(finLeft, pace, now)),
      levels && " · " + t('pace_all_levels', lv) + " (" + levels + "): " + showDate(projectFinish(allLeft, pace, now))),
    exam);
}

// markText: text with each search term wrapped in <mark> (numbers are stage numbers, never marked).
function markText(text, terms) {
  if (!terms.length) return text;
  var re = new RegExp('(' + terms.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'ig');
  return String(text).split(re).map(function (p, i) { return i % 2 ? React.createElement('mark', { key: i }, p) : p; });
}
// StageRow: one stage button (done / skipped / current / next states). o = { completed, skipped, current,
// suggested, cards, setUnit, terms, hits, showLv } (terms / hits / showLv only while searching).
function StageRow(u, o) {
  var ce = React.createElement;
  var isDone = o.completed.has(u.id), isSkipped = isDone && o.skipped.has(u.id);
  var known = knownCount(unitItems([u]), o.cards || {});
  var cls = "unit-row" + (isSkipped ? " skipped" : isDone ? " done" : "") + (u.index === o.current ? " current" : "") + (u.index === o.suggested ? " next" : "");
  var terms = o.terms || [];
  return ce("li", { key: u.id },
    ce("button", {
      className: cls, style: o.showLv ? { '--lv': LEVEL_COLORS[u.level] } : undefined,
      title: [isSkipped ? t('skipped_label', u.level) : "", known > 0 ? t('unit_known', u.level).replace('{n}', known) : ""].filter(Boolean).join(" · ") || undefined,
      'aria-current': u.index === o.current ? 'true' : undefined,
      onClick: function () { o.setUnit(u.index); }
    },
      ce("span", { className: "unit-num" }, u.index + 1),
      ce("span", { className: "unit-title" }, markText(u.title, terms),
        o.hits && o.hits.length > 0 && ce("span", { className: "unit-hits" }, o.hits.slice(0, 3).map(function (h, i) {
          return ce("span", { key: i, className: "unit-hit" }, ce("i", null, h.kind), markText(h.text, [h.term]));
        }))),
      o.showLv && ce("span", { className: "week-badge unit-lv" }, u.level),
      u.kind !== 'lesson' && u.kind !== 'kana' && ce("span", { className: "week-badge" }, u.kind),
      u.index === o.suggested && !isDone && ce("span", { className: "unit-next" }, "Up next"),
      isSkipped ? ce("span", { className: "unit-skipped", 'aria-label': t('skipped_label', u.level) }, t('skipped_tag', u.level))
        : isDone && ce("span", { className: "unit-done", 'aria-label': "completed" }, "✓")));
}
// ChapterRing: done / total ring, a green check when every stage is done.
function ChapterRing(d, n, lv) {
  var ce = React.createElement, r = 19, c = 2 * Math.PI * r, full = d === n;
  return ce("svg", { className: "ring", width: 44, height: 44, viewBox: "0 0 44 44", role: "img", 'aria-label': d + " of " + n + " stages done" },
    ce("circle", { cx: 22, cy: 22, r: r, fill: "none", stroke: "var(--surface2)", strokeWidth: 5 }),
    d > 0 && ce("circle", { cx: 22, cy: 22, r: r, fill: "none", stroke: full ? "var(--ok)" : LEVEL_COLORS[lv], strokeWidth: 5, strokeLinecap: "round", strokeDasharray: (d / n * c) + " " + c, transform: "rotate(-90 22 22)" }),
    ce("text", { x: 22, y: 25.5, textAnchor: "middle" }, full ? "✓" : d + "/" + n));
}

// Overview = the Stages tab: course progress card (level ramp + Pace panel side
// by side), the "Up next" card, then a level picker over the level's chapters (buildChapters:
// lessons up to each review, one closing exam-prep chapter) as quest cards: ring, name, one pip
// per stage while folded. The chapter holding the suggested stage opens by default; cleared
// chapters fold into one line (a fully done level into a stamped strip), a one-stage chapter is
// a plain row. A milestone bar jumps to a chapter; the search box (`/` focuses, Esc clears,
// Enter opens the first hit) looks across every level. Nothing is locked (Q22): every unit opens;
// the next suggested unit (first not done) is highlighted. Levels without units yet collapse to "Coming soon" (Q24).
// Secondary entry to the mastery challenge, at the bottom of the overview. Hidden when the level has no stages.
function dareCard(level, completed, onChallenge) {
  var ce = React.createElement, stages = challengeStages(level);
  if (!stages.length) return null;
  var L = stages.filter(function (u) { return !completed.has(u.id); }).length; // completed includes skipped stages
  var early = (stages.length - L) * 10 < stages.length; // early state: under 10% of lesson + kana stages cleared, so no "forgotten" pitch
  var it = CATALOG.items['x:' + level.toLowerCase() + '-challenge'], title = it ? it.title : level + " Mastery Challenge";
  return ce("section", { className: "panel dare", 'aria-label': title },
    ce("span", { className: "dare-stamp", 'aria-hidden': "true" }, "Dare"),
    ce("div", { className: "row" }, jelly(L ? 'smug' : 'happy', 78, true),
      ce("div", { className: "txt" },
        ce("div", { className: "eyebrow" }, title),
        ce("p", { className: "lead" }, !L ? "Fine, you remembered everything." : early ? "Bet you already know this." : "Bet you've forgotten some of it."),
        ce("p", null, !L ? "Go again anyway. Jelly dares you." : early ? "Ace it and the stage is done. Blow it and, well, you'll find out what you didn't know." : "Stage quizzes check what you just studied. This checks what stuck. A perfect stage counts as passed, no quiz needed."))),
    ce("div", { className: "rules" }, ce("span", null, "Perfect or nothing"), ce("span", null, "Retake all you like"), ce("span", null, "No timer")),
    ce("button", { className: "btn-outline", onClick: function () { onChallenge(level); } }, early ? "Prove yourself" : "Prove me wrong"));
}

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
  // Level picker: starts on the level of the suggested stage.
  var levelState = React.useState(next.level), level = levelState[0], setLevel = levelState[1];
  var qState = React.useState(''), q = qState[0], setQ = qState[1];
  var openState = React.useState({}), openMap = openState[0], setOpenMap = openState[1]; // chapter id → open (unset = default)
  var foldState = React.useState({}), foldOpen = foldState[0], setFoldOpen = foldState[1]; // level → cleared chapters shown
  var revisitState = React.useState({}), revisit = revisitState[0], setRevisit = revisitState[1]; // level → done strip's chapters shown
  var searchRef = React.useRef(null), indexRef = React.useRef(null), chRef = React.useRef(null);
  if (!chRef.current || chRef.current.units !== units) chRef.current = { units: units, list: buildChapters(units) };
  var chapters = chRef.current.list;
  var lvChapters = chapters.filter(function (c) { return c.level === level; });
  var lvUnits = units.filter(function (u) { return u.level === level; });
  var lvDone = lvUnits.filter(function (u) { return completed.has(u.id); }).length, lvSkipped = lvUnits.filter(function (u) { return skipped.has(u.id); }).length;
  var levelDone = lvUnits.length > 0 && lvDone === lvUnits.length;
  var nextOpen = !completed.has(next.id);
  var hasQuery = q.trim() !== '';
  var res = null, byIndex = {};
  if (hasQuery) {
    indexRef.current = indexRef.current || buildStageIndex(units); // built on the first search
    res = searchStages(indexRef.current, q);
    res.forEach(function (r) { byIndex[r.unit.index] = r; });
  }
  var terms = hasQuery ? q.toLowerCase().trim().split(/\s+/).filter(function (x) { return !/^#?\d+$/.test(x); }) : [];
  React.useEffect(function () {
    // "/" focuses the search box unless the user is already typing somewhere
    function onKey(e) {
      var tg = e.target, tag = tg && tg.tagName;
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (tg && tg.isContentEditable)) return;
      if (searchRef.current) { e.preventDefault(); searchRef.current.focus(); }
    }
    document.addEventListener('keydown', onKey);
    return function () { document.removeEventListener('keydown', onKey); };
  }, []);
  var head = function (label, right) {
    return ce("h2", { className: "panel-h" }, label, ce("span", { className: "r" }, right));
  };
  var rowOpts = function (extra) {
    return Object.assign({ completed: completed, skipped: skipped, current: current, suggested: suggested, cards: props.cards, setUnit: setUnit }, extra);
  };
  var isCur = function (c) { return nextOpen && c.units.some(function (u) { return u.index === suggested; }); };
  var isOpen = function (c) { return res ? true : openMap[c.id] != null ? openMap[c.id] : isCur(c); };
  var jump = function (c) {
    var m = Object.assign({}, openMap), f = Object.assign({}, foldOpen), r = Object.assign({}, revisit);
    m[c.id] = true; f[c.level] = true; r[c.level] = true;
    setOpenMap(m); setFoldOpen(f); setRevisit(r);
    setTimeout(function () { // after the card exists; smooth scroll unless the user prefers less motion
      var el = document.getElementById('ch-' + c.id), still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (el) el.scrollIntoView({ block: 'start', behavior: still ? 'auto' : 'smooth' });
    }, 0);
  };
  // one chapter: a plain row when it has a single stage, else a collapsible quest card
  var chapterCard = function (c) {
    var rows = res ? c.units.filter(function (u) { return byIndex[u.index]; }) : c.units;
    if (res && !rows.length) return null;
    var row = function (u) { return StageRow(u, rowOpts(res ? { terms: terms, hits: byIndex[u.index].hits, showLv: true } : {})); };
    if (c.units.length === 1) return ce("ol", { key: c.id, className: "unit-list solo", style: { '--lv': LEVEL_COLORS[c.level] } }, row(c.units[0]));
    var d = c.units.filter(function (u) { return completed.has(u.id); }).length, n = c.units.length, cleared = d === n;
    var open = isOpen(c), here = isCur(c);
    return ce("div", { key: c.id, id: "ch-" + c.id, className: "q" + (here ? " cur" : "") + (cleared ? " clr" : "") + (open ? " open" : ""), style: { '--lv': LEVEL_COLORS[c.level] } },
      ce("button", {
        className: "q-h", 'aria-expanded': open ? "true" : "false",
        onClick: function () { if (res) return; var m = Object.assign({}, openMap); m[c.id] = !open; setOpenMap(m); }
      },
        ChapterRing(d, n, c.level),
        ce("span", { className: "q-t" },
          ce("b", null, res ? c.level + " · " + c.name : c.name),
          ce("small", null, c.range + (c.topics ? " · " + c.topics : "")),
          !open && ce("span", { className: "pips", 'aria-hidden': "true" }, c.units.map(function (u) {
            var done = completed.has(u.id);
            return ce("i", { key: u.id, className: done ? (skipped.has(u.id) ? "skipped" : "done") : u.index === suggested ? "next" : "todo", 'data-cp': u.kind === 'review' || u.kind === 'prep' || u.kind === 'mock' ? "1" : undefined });
          }))),
        ce("span", { className: "q-r" }, cleared ? ce("span", { className: "ok" }, "✓ cleared") : ce("span", { className: "go" }, d ? (n - d) + " to go" : n + " stages")),
        ce("span", { className: "car", 'aria-hidden': "true" }, "▶")),
      open && ce("div", { className: "q-b" },
        here && !res && ce("div", { className: "q-cta" },
          ce("span", null, ce("b", null, "Up next · stage " + (suggested + 1)), next.title),
          ce("button", { className: "quiz-start-btn", 'aria-label': "Start stage " + (suggested + 1), onClick: function () { setUnit(suggested); } }, "Start")),
        ce("ol", { className: "unit-list" }, rows.map(row))));
  };
  var chapterList = function () {
    if (res) {
      var found = chapters.map(chapterCard).filter(Boolean);
      return found.length ? found : ce("p", { className: "unit-empty" }, "No stage matches “" + q.trim() + "”. Try a shorter word, or a stage number.");
    }
    var out = [], run = [];
    var flush = function () {
      if (!run.length) return;
      var shown = foldOpen[level] || (levelDone && revisit[level]), lvl = level;
      if (run.length > 1 && !(levelDone && revisit[level])) out.push(ce("button", { key: "fold" + run[0].id, className: "fold-done", 'aria-expanded': shown ? "true" : "false",
        onClick: function () { var f = Object.assign({}, foldOpen); f[lvl] = !shown; setFoldOpen(f); } },
        ce("b", null, "✓"), " " + run.length + " chapters cleared" + (shown ? "" : " · stages " + run[0].first + "–" + run[run.length - 1].last), ce("span", { className: "r" }, shown ? "Hide" : "Show")));
      if (run.length === 1 || shown) run.forEach(function (c) { out.push(chapterCard(c)); });
      run = [];
    };
    lvChapters.forEach(function (c) {
      if (c.units.length > 1 && c.units.every(function (u) { return completed.has(u.id); })) { run.push(c); return; }
      flush(); out.push(chapterCard(c));
    });
    flush();
    return out;
  };
  var here = lvChapters.filter(isCur)[0];
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
          onClick: function () { setLevel(lv); }
        }, ce("b", null, lv),
          us.length ? ce("small", null, d - sk, " of ", us.length, " done", sk ? " · " + sk + " skipped" : "") : ce("small", null, "Coming soon"),
          us.length > 0 && ce("span", { className: "level-progress-bar" },
            ce("span", { className: "level-progress-fill", style: { width: d / us.length * 100 + '%' } })),
          us.length > 0 && d === us.length && ce("span", { className: "seal", 'aria-hidden': "true" }, "済"));
      })),
      ce("div", { className: "st-search" },
        ce("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", 'aria-hidden': "true" }, ce("circle", { cx: 11, cy: 11, r: 7 }), ce("path", { d: "M20 20l-4-4" })),
        ce("input", {
          ref: searchRef, type: "search", value: q, autoComplete: "off", spellCheck: false, 'aria-label': "Search stages",
          placeholder: "Search stages, words, kanji, grammar",
          onChange: function (e) { setQ(e.target.value); },
          onKeyDown: function (e) {
            if (e.key === 'Escape') setQ('');
            else if (e.key === 'Enter' && res && res.length) setUnit(res[0].unit.index);
          }
        }),
        hasQuery ? ce("button", { className: "st-clear", 'aria-label': "Clear search", onClick: function () { setQ(''); if (searchRef.current) searchRef.current.focus(); } }, "×")
          : ce("span", { className: "st-kbd", 'aria-hidden': "true" }, "/")),
      !hasQuery && lvChapters.length > 0 && ce("div", { className: "ms-bar", style: { '--lv': LEVEL_COLORS[level] } }, lvChapters.map(function (c) {
        var d = c.units.filter(function (u) { return completed.has(u.id); }).length;
        return ce("button", { key: c.id, className: "ms" + (c.final ? " final" : "") + (isCur(c) ? " cur" : ""), onClick: function () { jump(c); },
          title: c.name + " · " + d + "/" + c.units.length, 'aria-label': c.name + ", " + d + " of " + c.units.length + " done" },
          ce("i", { style: { width: d / c.units.length * 100 + '%' } }));
      })),
      !hasQuery && here && ce("button", { className: "btn-outline ms-jump", onClick: function () { jump(here); } }, "↓ Jump to your chapter"),
      !hasQuery && levelDone && ce("div", { className: "cleared", style: { '--lv': LEVEL_COLORS[level] } },
        ce("span", { className: "seal", 'aria-hidden': "true" }, "済"),
        ce("span", null, ce("b", null, level + " cleared"), ce("small", null, "All " + lvUnits.length + " stages done" + (lvSkipped ? " · " + lvSkipped + " skipped" : ""))),
        ce("button", { className: "btn-outline", 'aria-expanded': revisit[level] ? "true" : "false", onClick: function () { var r = Object.assign({}, revisit); r[level] = !r[level]; setRevisit(r); } }, revisit[level] ? "Hide chapters" : "Revisit chapters")),
      (hasQuery || !levelDone || revisit[level]) && ce("div", { className: "q-list" }, chapterList())),
    dareCard(level, completed, props.onChallenge));
}
