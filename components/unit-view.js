"use strict";

// UnitView: one resolved unit (lib.js buildUnits) — items, grammar, quiz.
function UnitView(props) {
  var unit = props.unit,
    units = props.units,
    completed = props.completed,
    unmarkDone = props.unmarkDone,
    setUnit = props.setUnit,
    // Furigana pref is owned by App (shared with the navbar ruby labels)
    showFurigana = props.showFurigana,
    toggleFurigana = props.toggleFurigana,
    // Kanji layout pref ('rows' | 'focus'), owned by App
    kanjiView = props.kanjiView,
    setKanjiView = props.setKanjiView;
  var lv = unit.level;
  var isDone = completed.has(unit.id);
  var _React$useStateQuiz = React.useState(false),
    quizActive = _React$useStateQuiz[0],
    setQuizActive = _React$useStateQuiz[1];
  React.useEffect(function () {
    setQuizActive(false);
  }, [unit.id]);
  var section = function (label) {
    var children = Array.prototype.slice.call(arguments, 1);
    return React.createElement.apply(React, ["div", { className: "section" },
      React.createElement("div", { className: "section-label" }, label)].concat(children));
  };
  // A sentence with furigana (Tatoeba-style `furigana` field) when the toggle is on.
  var sentence = function (s) {
    var jp = showFurigana && s.furigana ? furiganaParts(s.furigana).map(function (p, i) {
      return p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
    }) : s.jp;
    return React.createElement("div", { key: s.id, className: "grammar-example" },
      React.createElement("div", { className: "jp" }, jp, React.createElement("button", {
        className: "speak-btn", onClick: function () { speak(s.jp); }, title: "Listen", 'aria-label': "Listen to " + s.jp
      }, "🔊")),
      React.createElement("div", { className: "en" }, s.en));
  };
  var grammarExamples = function (g) {
    return (g.examples || []).map(function (id) { return CATALOG.items[id]; }).filter(Boolean).slice(0, 2);
  };
  // Lesson units: up to 3 more sentences using this unit's words / kanji (alt spellings count),
  // most matches first, skipping the grammar examples shown above.
  var examples = [];
  if (unit.kind === 'lesson') {
    var shown = {}, weight = {};
    unit.grammar.forEach(function (g) { grammarExamples(g).forEach(function (s) { shown[s.id] = true; }); });
    unit.vocab.forEach(function (v) { weight[v.id] = 2; });
    unit.kanji.forEach(function (k) { weight[k.id] = 1; });
    catalogOf('vocab').forEach(function (v) { if (v.alt && weight[v.alt]) weight[v.id] = 2; });
    // only sentences whose grammar is taught by this unit or earlier
    var later = {};
    units.slice(unit.index + 1).forEach(function (u) { (u.grammar || []).forEach(function (g) { if (u.kind === 'lesson') later[g.id] = true; }); });
    examples = catalogOf('sentence').filter(function (s) {
      return !(s.uses || []).some(function (id) { return later[id]; });
    }).map(function (s) {
      return { s: s, w: (s.uses || []).reduce(function (n, id) { return n + (weight[id] || 0); }, 0) };
    }).filter(function (x) { return x.w > 0 && !shown[x.s.id]; })
      .sort(function (a, b) { return b.w - a.w; }).slice(0, 3).map(function (x) { return x.s; });
  }
  var practice = unit.practice || [];
  var knownN = knownCount(unitItems([unit]), props.cards || {}); // seeded as already known (ticket 37)
  var last = units.length - 1;
  return React.createElement("div", { className: "day-card" },
    React.createElement("div", { className: "day-header" },
      React.createElement("div", { className: "day-meta" },
        React.createElement("span", { className: "day-num" }, t('unit_label', lv), " ", unit.index + 1),
        React.createElement("span", { className: "phase-badge", style: { background: LEVEL_COLORS[lv] } }, lv),
        unit.kind !== 'lesson' && React.createElement("span", { className: "week-badge" }, unit.kind),
        isDone && React.createElement("span", { className: "complete-badge" }, t('complete_badge', lv)),
        knownN > 0 && React.createElement("span", { className: "week-badge" }, t('unit_known', lv).replace('{n}', knownN))),
      React.createElement("h2", { className: "day-title" }, unit.title)),
    React.createElement("div", { className: "day-body" },
      React.createElement("div", { className: "lesson-blurrable" + (quizActive ? ' blurred' : '') },
        // Lesson note: first sentence as the headline, the rest as quiet lines (prep / mock notes
        // run to several paragraphs, one per line, ticket 18)
        unit.notes && (function () {
          var note = noteParts(unit.notes);
          return React.createElement("aside", { className: "unit-note", 'aria-label': t('note_label', lv) },
            React.createElement("div", { className: "unit-note-label" }, icon('bulb'), t('note_label', lv)),
            React.createElement("h3", { className: "unit-note-head" }, note.head),
            note.body.map(function (line, i) { return React.createElement("p", { key: i, className: "unit-note-line" }, line); }));
        })(),
        unit.kana.length > 0 && React.createElement(KanaSection, { key: 'kana:' + unit.id, unit: unit }),
        unit.vocab.length > 0 && React.createElement(VocabSection, { key: 'vocab:' + unit.id, unit: unit }),
        unit.kanji.length > 0 && React.createElement(KanjiSection, {
          key: 'kanji:' + unit.id, unit: unit, kanjiView: kanjiView, setKanjiView: setKanjiView
        }),
        unit.grammar.map(function (g) {
          return React.createElement(React.Fragment, { key: g.id }, section(t('section_grammar', lv),
            React.createElement("div", { className: "grammar-box" },
              React.createElement("div", { className: "grammar-pattern" }, g.pattern),
              React.createElement("div", { className: "grammar-meaning" }, g.meaning),
              g.formation && React.createElement("div", { className: "grammar-meaning" }, g.formation),
              grammarExamples(g).map(sentence))));
        }),
        examples.length > 0 && section(t('section_examples', lv), examples.map(sentence)),
        (examples.length > 0 || unit.grammar.length > 0) && React.createElement("button", {
          className: "furigana-toggle" + (showFurigana ? " active" : ""),
          onClick: toggleFurigana
        }, showFurigana ? t('furigana_hide', lv) : t('furigana_show', lv))),
      // a mock unit is taken as a whole test (MockExam); taking it completes the unit, pass or not
      unit.kind === 'mock' ? React.createElement(MockExam, {
        key: unit.id,
        mock: CATALOG.items[unit.mock],
        onTaken: function () { props.onQuizResult({ passed: true, missed: [] }); }
      }) : React.createElement(Exercises, {
        key: unit.id,
        unit: unit,
        onStart: function () { setQuizActive(true); },
        onFinish: function () { setQuizActive(false); },
        onResult: props.onQuizResult
      })),
    React.createElement("div", { className: "nav-bar" },
      React.createElement("button", {
        className: "nav-btn prev",
        onClick: function () { setUnit(Math.max(0, unit.index - 1)); },
        disabled: unit.index === 0,
        title: "Previous unit"
      }, t('nav_prev', lv)),
      React.createElement("div", null,
        React.createElement("div", { className: "day-counter" }, t('unit_label', lv), " ", unit.index + 1, " / ", units.length),
        props.pace && React.createElement("div", { className: "day-counter" }, paceTodayLine(props.pace, props.doneToday || 0, lv)),
        // Completion comes from passing the quiz (Q28); a done unit can be un-marked.
        isDone ? React.createElement("button", {
          className: "nav-btn complete done",
          onClick: unmarkDone
        }, t('mark_incomplete', lv)) : React.createElement("div", { className: "day-counter" },
          unit.kind === 'mock' ? "Take the mock to complete" : "Pass the quiz (" + Math.round(passMark(unit.kind) * 100) + "%) to complete")),
      React.createElement("button", {
        className: "nav-btn next",
        onClick: function () { setUnit(Math.min(last, unit.index + 1)); },
        disabled: unit.index === last,
        title: "Next unit"
      }, t('nav_next', lv))));
}
