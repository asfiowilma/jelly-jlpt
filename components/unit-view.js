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
    toggleFurigana = props.toggleFurigana;
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
  var word = function (v) {
    return showFurigana && hasKanji(v.word) && v.reading !== v.word
      ? React.createElement("ruby", null, v.word, React.createElement("rt", null, v.reading))
      : v.word;
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
  var last = units.length - 1;
  return React.createElement("div", { className: "day-card" },
    React.createElement("div", { className: "day-header" },
      React.createElement("div", { className: "day-meta" },
        React.createElement("span", { className: "day-num" }, t('unit_label', lv), " ", unit.index + 1),
        React.createElement("span", { className: "phase-badge", style: { background: LEVEL_COLORS[lv] } }, lv),
        unit.kind !== 'lesson' && React.createElement("span", { className: "week-badge" }, unit.kind),
        isDone && React.createElement("span", { className: "complete-badge" }, t('complete_badge', lv))),
      React.createElement("h2", { className: "day-title" }, unit.title)),
    React.createElement("div", { className: "day-body" },
      React.createElement("div", { className: "lesson-blurrable" + (quizActive ? ' blurred' : '') },
        unit.notes && React.createElement("div", { className: "tip-box" }, unit.notes),
        unit.kana.length > 0 && section(t('section_kana', lv),
          React.createElement("div", { className: "chars-table" }, unit.kana.map(function (k) {
            return React.createElement(CharCard, { key: k.id, kanji: k });
          }))),
        practice.length > 0 && section(t('section_read', lv),
          React.createElement("table", { className: "vocab-table" },
            React.createElement("tbody", null, practice.map(function (v) {
              return React.createElement("tr", { key: v.id },
                React.createElement("td", null, v.reading, React.createElement("button", {
                  className: "speak-btn", onClick: function () { speak(v.reading); },
                  title: "Listen to pronunciation", 'aria-label': "Listen to " + v.reading
                }, "🔊")),
                React.createElement("td", null, glossText(v)));
            })))),
        unit.vocab.length > 0 && section(t('section_vocabulary', lv),
          React.createElement("table", { className: "vocab-table" },
            React.createElement("thead", null, React.createElement("tr", null,
              React.createElement("th", null, t('vocab_word', lv)),
              React.createElement("th", null, t('vocab_meaning', lv)))),
            React.createElement("tbody", null, unit.vocab.map(function (v) {
              return React.createElement("tr", { key: v.id },
                React.createElement("td", null, word(v), React.createElement("button", {
                  className: "speak-btn",
                  onClick: function () { speak(v.word); },
                  title: "Listen to pronunciation",
                  'aria-label': "Listen to " + v.word
                }, "🔊")),
                React.createElement("td", null, glossText(v)));
            })))),
        unit.kanji.length > 0 && section(t('section_kanji', lv),
          React.createElement("div", { className: "chars-table" }, unit.kanji.map(function (k) {
            return React.createElement(CharCard, { key: k.id, kanji: k });
          }))),
        unit.grammar.map(function (g) {
          return React.createElement(React.Fragment, { key: g.id }, section(t('section_grammar', lv),
            React.createElement("div", { className: "grammar-box" },
              React.createElement("div", { className: "grammar-pattern" }, g.pattern),
              React.createElement("div", { className: "grammar-meaning" }, g.meaning),
              g.formation && React.createElement("div", { className: "grammar-meaning" }, g.formation),
              grammarExamples(g).map(sentence))));
        }),
        examples.length > 0 && section(t('section_examples', lv), examples.map(sentence)),
        (unit.vocab.some(function (v) { return hasKanji(v.word); }) || examples.length > 0 || unit.grammar.length > 0) && React.createElement("button", {
          className: "furigana-toggle" + (showFurigana ? " active" : ""),
          onClick: toggleFurigana
        }, showFurigana ? t('furigana_hide', lv) : t('furigana_show', lv))),
      React.createElement(Exercises, {
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
          "Pass the quiz (", Math.round(passMark(unit.kind) * 100), "%) to complete")),
      React.createElement("button", {
        className: "nav-btn next",
        onClick: function () { setUnit(Math.min(last, unit.index + 1)); },
        disabled: unit.index === last,
        title: "Next unit"
      }, t('nav_next', lv))));
}
