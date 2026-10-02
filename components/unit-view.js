"use strict";

// UnitView: one resolved unit (lib.js buildUnits) — items, grammar, quiz.
function UnitView(props) {
  var unit = props.unit,
    units = props.units,
    completed = props.completed,
    toggleDone = props.toggleDone,
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
              (g.examples || []).map(function (sid) {
                var s = CATALOG.items[sid];
                return s && React.createElement("div", { key: sid, className: "grammar-example" },
                  React.createElement("div", { className: "jp" }, s.jp),
                  React.createElement("div", { className: "en" }, s.en));
              }))));
        }),
        unit.vocab.some(function (v) { return hasKanji(v.word); }) && React.createElement("button", {
          className: "furigana-toggle" + (showFurigana ? " active" : ""),
          onClick: toggleFurigana
        }, showFurigana ? t('furigana_hide', lv) : t('furigana_show', lv))),
      React.createElement(Exercises, {
        key: unit.id,
        unit: unit,
        onStart: function () { setQuizActive(true); },
        onFinish: function () { setQuizActive(false); }
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
        React.createElement("button", {
          className: "nav-btn complete " + (isDone ? 'done' : ''),
          onClick: toggleDone
        }, isDone ? t('mark_incomplete', lv) : t('mark_complete', lv))),
      React.createElement("button", {
        className: "nav-btn next",
        onClick: function () { setUnit(Math.min(last, unit.index + 1)); },
        disabled: unit.index === last,
        title: "Next unit"
      }, t('nav_next', lv))));
}
