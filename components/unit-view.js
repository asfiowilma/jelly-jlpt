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
  var section = function (label) {
    var children = Array.prototype.slice.call(arguments, 1);
    return React.createElement.apply(React, ["div", { className: "section" },
      React.createElement("div", { className: "section-label" }, label)].concat(children));
  };
  // A sentence with furigana (Tatoeba-style `furigana` field) when the toggle is on.
  // `toks` = the taught particle(s)/endings to underline in the sentence (grammar examples only)
  var mark = function (text, toks) {
    if (!toks || !toks.length) return text;
    var re = new RegExp("(" + toks.map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")", "g");
    return text.split(re).map(function (p, i) { return i % 2 ? React.createElement("mark", { key: i }, p) : p; });
  };
  var sentence = function (s, toks) {
    var jp = showFurigana && s.furigana ? furiganaParts(s.furigana).map(function (p, i) {
      return p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : React.createElement(React.Fragment, { key: i }, mark(p.t, toks));
    }) : mark(s.jp, toks);
    return React.createElement("div", { key: s.id, className: "grammar-example" },
      React.createElement("div", { className: "jp" }, jp, React.createElement("button", {
        className: "speak-btn", onClick: function () { speak(s.jp); }, title: "Listen", 'aria-label': "Listen to " + s.jp
      }, "🔊")),
      React.createElement("div", { className: "en" }, s.en));
  };
  // Lesson "Example sentences" section: a tinted card per sentence, quiet audio icon at the right
  var exampleCard = function (s) {
    var jp = showFurigana && s.furigana ? furiganaParts(s.furigana).map(function (p, i) {
      return p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
    }) : s.jp;
    return React.createElement("div", { key: s.id, className: "example-card" },
      React.createElement("div", { className: "example-text" },
        React.createElement("div", { className: "jp", lang: "ja" }, jp),
        React.createElement("div", { className: "en" }, s.en)),
      React.createElement("button", {
        className: "example-speak", onClick: function () { speak(s.jp); }, title: "Listen", 'aria-label': "Listen to " + s.jp
      }, icon('speaker')));
  };
  var grammarExamples = function (g) {
    return (g.examples || []).map(function (id) { return CATALOG.items[id]; }).filter(Boolean).slice(0, 3);
  };
  // ponytail: marks come from the Tanos `ref` label, so a bare particle (で) also lights up inside
  // です; a per-point `hl` field is the upgrade if that bites.
  var grammarMarks = function (g, alts) {
    var toks = (g.ref || []).join("/").replace(/[～〜]/g, "").split("/");
    // no ref label: use the 〜-patterns themselves (single kana would light up everywhere, skip those)
    if (!g.ref && alts.length && alts[0] !== g.pattern) toks = alts.map(function (a) { return a.replace(/^[〜～]/, "").split(/[\s(]/)[0]; }).filter(function (x) { return x.length > 1; });
    return toks.map(function (x) { return x.trim(); }).filter(Boolean).sort(function (a, b) { return b.length - a.length; });
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
      React.createElement("div", null,
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
          // "〜A/〜B/〜C" patterns stack one per line; a long formation (て-form) leaves the rail
          // for a list in the main column
          var alts = g.pattern.split("/");
          if (!alts.every(function (a) { return /^[〜～]/.test(a); })) alts = [g.pattern];
          var longForm = g.formation && g.formation.length > 70;
          var toks = grammarMarks(g, alts);
          var build = g.formation && React.createElement("div", { className: "grammar-form" },
            React.createElement("b", null, t('grammar_build', lv)), g.formation);
          return React.createElement(React.Fragment, { key: g.id }, section(t('section_grammar', lv),
            React.createElement("div", { className: "grammar-card" },
              React.createElement("div", { className: "grammar-rail" },
                React.createElement("div", { className: "grammar-pattern" }, alts.map(function (a, i) {
                  return React.createElement("span", { key: i, className: "grammar-alt" }, a);
                })),
                React.createElement("div", { className: "grammar-meaning" }, g.meaning),
                !longForm && build),
              React.createElement("div", { className: "grammar-main" },
                longForm && React.createElement("div", { className: "grammar-form grammar-steps" },
                  React.createElement("b", null, t('grammar_build', lv)),
                  React.createElement("ul", null, g.formation.split("; ").map(function (x, i) { return React.createElement("li", { key: i }, x); }))),
                g.notes && React.createElement("p", { className: "grammar-notes" }, g.notes),
                React.createElement("div", { className: "grammar-examples" }, grammarExamples(g).map(function (s) { return sentence(s, toks); }))))));
        }),
        examples.length > 0 && section(t('section_examples', lv), React.createElement("div", { className: "example-list" }, examples.map(exampleCard))),
        (examples.length > 0 || unit.grammar.length > 0) && React.createElement("button", {
          className: "furi", 'aria-pressed': showFurigana, onClick: toggleFurigana
        }, React.createElement("i", { 'aria-hidden': true }), t('furigana_label', lv))),
      // a mock unit is taken as a whole test (MockExam); taking it completes the unit, pass or not
      React.createElement("div", { id: "unit-quiz" }, unit.kind === 'mock' ? React.createElement(MockExam, {
        key: unit.id,
        mock: CATALOG.items[unit.mock],
        onTaken: function () { props.onQuizResult({ passed: true, missed: [] }); }
      }) : React.createElement(Exercises, {
        key: unit.id,
        unit: unit,
        onResult: props.onQuizResult,
        passed: isDone,
        sfxOn: props.sfxOn,
        setSfxOn: props.setSfxOn,
        onNextStage: unit.index < last ? function () { setUnit(unit.index + 1); } : null
      }))),
    // Bottom bar: one action that follows the stage state. Skip only navigates; a stage is done
    // only by passing its quiz (Q28), and a done stage can be un-marked from the status line.
    React.createElement("div", { className: "nav-bar" },
      React.createElement("div", { className: "nav-edge", 'aria-hidden': true },
        React.createElement("i", { style: { width: Math.round(100 * completed.size / units.length) + "%" } })),
      React.createElement("button", {
        className: "nav-arrow",
        onClick: function () { setUnit(Math.max(0, unit.index - 1)); },
        disabled: unit.index === 0,
        title: "Previous stage", 'aria-label': "Previous stage"
      }, "←"),
      React.createElement("div", { className: "nav-mid" },
        React.createElement("b", null, t('unit_label', lv), " ", unit.index + 1, " ", React.createElement("span", null, "/ ", units.length)),
        React.createElement("div", { className: "nav-status" }, isDone
          ? [React.createElement("span", { key: "d", className: "nav-ok" }, t('complete_badge', lv)), " · ",
            React.createElement("button", { key: "u", className: "nav-link", onClick: unmarkDone }, t('mark_incomplete', lv))]
          : unit.kind === 'mock' ? "Take the mock to finish" : "Pass the quiz (" + Math.round(passMark(unit.kind) * 100) + "%) to finish"),
        props.pace && React.createElement("div", { className: "nav-pace" }, paceTodayLine(props.pace, props.doneToday || 0, lv))),
      React.createElement("div", { className: "nav-act" },
        !isDone && unit.index < last && React.createElement("button", {
          className: "nav-skip", onClick: function () { setUnit(unit.index + 1); }
        }, t('nav_skip', lv)),
        isDone && unit.index < last && React.createElement("button", {
          className: "nav-btn next", onClick: function () { setUnit(unit.index + 1); }
        }, t('nav_next_stage', lv)))));
}
