"use strict";

// ReviewTabs: recap of a review unit as tabs (WAI-ARIA tabs, manual activation off: arrows select).
// props.tabs = reviewTabs(unit), props.panes = { tabId: [nodes] }. The parent keys it by unit id,
// so the selection resets on a new stage. The tab row is a sticky strip under the app header, with the
// furigana toggle (props.furiTabs = tabs where it matters) and, once the quiz card has scrolled away, a
// compact Start button that clicks the card's own button (props.startLabel mirrors its label).
function ReviewTabs(props) {
  var tabs = props.tabs, st = React.useState(tabs[0].id), sel = st[0], setSel = st[1];
  var refs = React.useRef({}), barRef = React.useRef(null), rootRef = React.useRef(null), prevSel = React.useRef(sel);
  var _away = React.useState(false), away = _away[0], setAway = _away[1];
  React.useEffect(function () {
    var card = document.getElementById('unit-quiz');
    if (!card || !window.IntersectionObserver) return;
    var hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 60;
    // out of view = fully under the header
    var io = new IntersectionObserver(function (es) { setAway(!es[es.length - 1].isIntersecting); }, { rootMargin: '-' + hdr + 'px 0px 0px 0px' });
    io.observe(card);
    return function () { io.disconnect(); };
  }, []);
  // keep the picked tab in view when the row scrolls sideways (phone); the Start / furigana buttons change its width
  var showFuri = props.furiTabs.indexOf(sel) >= 0;
  React.useEffect(function () {
    var tab = refs.current[sel];
    if (tab) tab.parentNode.scrollLeft = tab.offsetLeft - (tab.parentNode.clientWidth - tab.offsetWidth) / 2;
  }, [sel, away, showFuri]);
  // A tab change aligns the panel top under the sticky strip, scrolling up only (panel heights differ a lot).
  // choose() pins the old height first: swapping to a shorter panel would collapse the page and the browser
  // would clamp the scroll position (a jump) before the smooth scroll starts. The pin is released at the end.
  var choose = function (id) {
    if (id === sel) return;
    if (rootRef.current) rootRef.current.style.minHeight = rootRef.current.offsetHeight + 'px';
    setSel(id);
  };
  React.useEffect(function () {
    if (prevSel.current === sel) return;
    prevSel.current = sel;
    var root = rootRef.current, panel = document.getElementById('rt-panel-' + sel), bar = barRef.current, done = false;
    var release = function () { if (!done) { done = true; if (root) root.style.minHeight = ''; } };
    if (!panel || !bar) { release(); return; }
    var hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 60;
    var top = panel.getBoundingClientRect().top + window.pageYOffset - hdr - bar.offsetHeight;
    // the furthest the page can scroll once the pin is gone
    var maxTop = document.documentElement.scrollHeight - root.offsetHeight + bar.offsetHeight + panel.offsetHeight - window.innerHeight;
    top = Math.max(0, Math.min(top, maxTop));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (top >= window.pageYOffset) { release(); return; }
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    if (reduce) { release(); return; }
    window.addEventListener('scrollend', release, { once: true });
    var timer = setTimeout(release, 900); // browsers without scrollend
    return function () { clearTimeout(timer); window.removeEventListener('scrollend', release); release(); };
  }, [sel]);
  var onKey = function (e) {
    var i = tabs.findIndex(function (x) { return x.id === sel; }), n = tabs.length, j;
    if (e.key === 'ArrowRight') j = (i + 1) % n;
    else if (e.key === 'ArrowLeft') j = (i + n - 1) % n;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    else return;
    e.preventDefault();
    choose(tabs[j].id);
    if (refs.current[tabs[j].id]) refs.current[tabs[j].id].focus();
  };
  return React.createElement("div", { className: "review-tabs", ref: rootRef },
    React.createElement("div", { className: "rt-bar", ref: barRef },
      React.createElement("div", { className: "rt-list", role: "tablist", 'aria-label': "Recap", onKeyDown: onKey },
        tabs.map(function (x) {
          return React.createElement("button", {
            key: x.id, id: 'rt-tab-' + x.id, role: "tab", type: "button", className: "rt-tab",
            'aria-selected': x.id === sel, 'aria-controls': 'rt-panel-' + x.id, tabIndex: x.id === sel ? 0 : -1,
            ref: function (el) { refs.current[x.id] = el; }, onClick: function () { choose(x.id); }
          }, x.label, " ", React.createElement("span", { className: "rt-n" }, x.n));
        })),
      showFuri && React.createElement("button", {
        className: "furi", type: "button", 'aria-pressed': props.showFurigana, onClick: props.toggleFurigana
      }, React.createElement("i", { 'aria-hidden': true }), React.createElement("span", { className: "furi-t" }, t('furigana_label', props.lv))),
      away && React.createElement("button", {
        className: "quiz-start-btn rt-start", type: "button",
        onClick: function () { var b = document.querySelector('#unit-quiz .quiz-start-btn'); if (b) b.click(); }
      }, !props.passed && icon('play'), props.startLabel)),
    tabs.map(function (x) {
      return React.createElement("div", {
        key: x.id, id: 'rt-panel-' + x.id, role: "tabpanel", className: "rt-panel", 'aria-labelledby': 'rt-tab-' + x.id,
        hidden: x.id !== sel, tabIndex: 0
      }, props.panes[x.id]);
    }));
}

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
  // a new stage opens at the top (Next stage from the quiz result leaves the page scrolled down)
  React.useEffect(function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [unit.id]);
  var isDone = completed.has(unit.id), isSkipped = isDone && !!props.skipped && props.skipped.has(unit.id);
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
        className: "speak-btn", onClick: function () { speak(speechText(s.furigana || s.jp)); }, title: "Listen", 'aria-label': "Listen to " + s.jp
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
        className: "example-speak", onClick: function () { speak(speechText(s.furigana || s.jp)); }, title: "Listen", 'aria-label': "Listen to " + s.jp
      }, icon('speaker')));
  };
  var grammarExamples = function (g) { return lessonExamples(g, unit); };
  // ponytail: marks come from the Tanos `ref` label, so a bare particle (で) also lights up inside
  // です; a per-point `hl` field is the upgrade if that bites.
  var grammarMarks = function (g, alts) {
    var toks = (g.ref || []).join("/").replace(/[～〜]/g, "").split("/");
    // no ref label: use the 〜-patterns themselves (single kana would light up everywhere, skip those)
    if (!g.ref && alts.length && alts[0] !== g.pattern) toks = alts.map(function (a) { return a.replace(/^[〜～]/, "").split(/[\s(]/)[0]; }).filter(function (x) { return x.length > 1; });
    return toks.map(function (x) { return x.trim(); }).filter(Boolean).sort(function (a, b) { return b.length - a.length; });
  };
  // Lesson units: up to 3 more sentences using this unit's words / kanji (lib.js unitExamples)
  var examples = unitExamples(unit);
  var terms = pageTerms(unit);
  var termsEl = function (list) {
    return list.length > 0 && React.createElement(React.Fragment, { key: 'terms' }, section("Terms on this page", React.createElement("dl", { className: "page-terms" }, list.map(function (x) {
      return React.createElement(React.Fragment, { key: x.label }, React.createElement("dt", null, x.label), React.createElement("dd", null, rubyNodes(x.line, showFurigana)));
    }))));
  };
  var practice = unit.practice || [];
  // lesson note box; lessons with a dialogue show it right after the dialogue
  var noteAfterDialogue = unit.kind === 'lesson' && !!unit.dialogue;
  var noteBox = function () {
    var note = noteParts(unit.notes);
    return React.createElement("aside", { className: "unit-note", 'aria-label': t('note_label', lv) },
      React.createElement("div", { className: "unit-note-label" }, icon('bulb'), t('note_label', lv)),
      React.createElement("h3", { className: "unit-note-head" }, note.head),
      note.body.map(function (line, i) { return React.createElement("p", { key: i, className: "unit-note-line" }, line); }));
  };
  var knownN = knownCount(unitItems([unit]), props.cards || {}); // seeded as already known (ticket 37)
  var last = units.length - 1;
  // Review units: quiz first, then the recap in tabs (P routes a piece into its tab's panel)
  var tabs = reviewTabs(unit), isReview = tabs.length > 0, panes = {};
  var P = function (id, node) { if (!isReview || !node) return node; (panes[id] = panes[id] || []).push(node); return null; };
  var quizEl = React.createElement("div", { id: "unit-quiz" }, unit.kind === 'mock' ? React.createElement(MockExam, {
    key: unit.id,
    mock: CATALOG.items[unit.mock],
    guided: !!unit.guide,
    showFurigana: showFurigana,
    onTaken: function () { props.onQuizResult({ passed: true, missed: [] }); }
  }) : React.createElement(Exercises, {
    key: unit.id,
    unit: unit,
    onResult: props.onQuizResult,
    passed: isDone,
    sfxOn: props.sfxOn,
    setSfxOn: props.setSfxOn,
    handoff: props.handoff,
    onNextStage: unit.index < last ? function () { setUnit(unit.index + 1); } : null
  }));
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
      isReview && quizEl,
      React.createElement("div", null,
        // Lesson note: first sentence as the headline, the rest as quiet lines (prep / mock notes
        // run to several paragraphs, one per line, ticket 18)
        unit.guide && React.createElement('aside', { className: 'unit-note', 'aria-label': t('guide_label', lv) },
          React.createElement('div', { className: 'unit-note-label' }, icon('bulb'), t('guide_label', lv)),
          React.createElement('h3', { className: 'unit-note-head' }, pgText(unit.guide.lead, showFurigana))),
        unit.guide && React.createElement(PrepGuide, { guide: unit.guide, level: unit.level, showFurigana: showFurigana }),
        unit.notes && !noteAfterDialogue && noteBox(),
        unit.kana.length > 0 && P('kana', React.createElement(KanaSection, { key: 'kana:' + unit.id, unit: unit })),
        unit.dialogue && unit.kind === 'lesson' && React.createElement(DialogueSection, {
          key: 'dlg:' + unit.id, unit: unit, showFurigana: showFurigana, toggleFurigana: toggleFurigana }),
        unit.notes && noteAfterDialogue && noteBox(),
        unit.vocab.length > 0 && P('words', isReview ? React.createElement(ReviewVocab, { key: 'rvocab:' + unit.id, unit: unit, showFurigana: showFurigana, setUnit: setUnit })
          : React.createElement(VocabSection, { key: 'vocab:' + unit.id, unit: unit, showFurigana: showFurigana })),
        // kana units: read-only practice words (no card, not quizzed), shown in kana
        practice.length > 0 && P(tabs[0] && tabs[0].id === 'kana' ? 'kana' : 'words', section(t('section_read', lv), React.createElement("ul", { className: "vocab-list read-list" }, practice.map(function (v) {
          return React.createElement("li", { key: v.id, className: "vocab-row" },
            React.createElement("div", { className: "vocab-jp jp" }, v.reading),
            React.createElement("div", { className: "vocab-col-meaning" }, React.createElement("span", { className: "vocab-cell vocab-meaning" }, glossText(v))),
            React.createElement("button", {
              className: "speak-btn speak-btn-row", onClick: function () { speak(v.reading); },
              title: "Listen to pronunciation", 'aria-label': "Listen to " + v.reading
            }, "🔊"));
        })))),
        unit.kanji.length > 0 && P('kanji', React.createElement(KanjiSection, {
          key: 'kanji:' + unit.id, unit: unit, review: isReview, kanjiView: kanjiView, setKanjiView: setKanjiView
        })),
        isReview && unit.grammar.length > 0 && P('grammar', section(t('section_grammar', lv),
          React.createElement("div", { className: "rg-grid" }, reviewSourceGroups(unit, 'grammar').map(function (grp) {
            return grp.items.map(function (g) {
              var alts = g.pattern.split("/");
              if (!alts.every(function (a) { return /^[〜～]/.test(a); })) alts = [g.pattern];
              var ex = grammarExamples(g)[0];
              return React.createElement("div", { key: g.id, className: "rg-card" },
                React.createElement("div", { className: "rg-pattern" }, rubyNodes(g.patternFuri || g.pattern, showFurigana)),
                React.createElement("div", { className: "rg-meaning" }, g.meaning),
                ex && React.createElement("div", { className: "rg-ex" }, sentence(ex, grammarMarks(g, alts))),
                React.createElement("button", { className: "rg-link", onClick: function () { setUnit(grp.source.index); } },
                  "Full lesson · " + t('unit_label', lv).toLowerCase() + " " + (grp.source.index + 1) + " →"));
            });
          })))),
        !isReview && unit.grammar.map(function (g) {
          // "〜A/〜B/〜C" patterns stack one per line; a long formation (て-form) leaves the rail
          // for a list in the main column
          var alts = g.pattern.split("/"), shown = (g.patternFuri || g.pattern).split("/");
          if (!alts.every(function (a) { return /^[〜～]/.test(a); })) { alts = [g.pattern]; shown = [g.patternFuri || g.pattern]; }
          var longForm = g.formation && speechText(g.formation).length > 70; // ruby markup not counted
          var toks = grammarMarks(g, alts);
          var build = g.formation && React.createElement("div", { className: "grammar-form" },
            React.createElement("b", null, t('grammar_build', lv)), rubyNodes(noteIds(g.formation), showFurigana));
          return P('grammar', React.createElement(React.Fragment, { key: g.id }, section(t('section_grammar', lv),
            React.createElement("div", { className: "grammar-card" },
              React.createElement("div", { className: "grammar-rail" },
                React.createElement("div", { className: "grammar-pattern" }, shown.map(function (a, i) {
                  return React.createElement("span", { key: i, className: "grammar-alt" }, rubyNodes(a, showFurigana));
                })),
                React.createElement("div", { className: "grammar-meaning" }, g.meaning),
                !longForm && build),
              React.createElement("div", { className: "grammar-main" },
                longForm && React.createElement("div", { className: "grammar-form grammar-steps" },
                  React.createElement("b", null, t('grammar_build', lv)),
                  React.createElement("ul", null, splitTop(noteIds(g.formation), "; ").map(function (x, i) { return React.createElement("li", { key: i }, rubyNodes(x, showFurigana)); }))),
                g.notes && React.createElement("p", { className: "grammar-notes" }, rubyNodes(noteIds(g.notes), showFurigana)),
                React.createElement("div", { className: "grammar-examples" }, grammarExamples(g).map(function (s) { return sentence(s, toks); })))))));
        }),
        // review units: each tab ends with the terms its own content uses
        isReview ? [P('words', termsEl(pageTerms(unit, 'words'))), P('grammar', termsEl(pageTerms(unit, 'grammar')))] : termsEl(terms),
        examples.length > 0 && section(t('section_examples', lv), React.createElement("div", { className: "example-list" }, examples.map(exampleCard))),
        unit.dialogue && unit.kind === 'lesson' && React.createElement(DialoguePractice, { key: 'dlgp:' + unit.id, unit: unit }),
        isReview && React.createElement(ReviewTabs, {
          key: 'tabs:' + unit.id, tabs: tabs, panes: panes, furiTabs: reviewFuriTabs(unit), showFurigana: showFurigana, toggleFurigana: toggleFurigana,
          lv: lv, passed: isDone, startLabel: isDone ? "Retake review" : "Start review"
        }),
        !isReview && (examples.length > 0 || unit.grammar.length > 0 || unit.guide) && React.createElement("button", {
          className: "furi", 'aria-pressed': showFurigana, onClick: toggleFurigana
        }, React.createElement("i", { 'aria-hidden': true }), t('furigana_label', lv))),
      // a mock unit is taken as a whole test (MockExam); taking it completes the unit, pass or not
      !isReview && quizEl),
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
          ? [React.createElement("span", { key: "d", className: "nav-ok", title: isSkipped ? t('skipped_label', lv) : undefined }, t(isSkipped ? 'skipped_badge' : 'complete_badge', lv)), " · ",
            React.createElement("button", { key: "u", className: "nav-link", onClick: unmarkDone }, t('mark_incomplete', lv))]
          : unit.kind === 'mock' ? "Take the mock to finish" : "Pass the quiz (" + passMarkText(unit) + ") to finish"),
        props.pace && React.createElement("div", { className: "nav-pace" }, paceTodayLine(props.pace, props.doneToday || 0, lv))),
      React.createElement("div", { className: "nav-act" },
        !isDone && unit.index < last && React.createElement("button", {
          className: "nav-skip", onClick: function () { setUnit(unit.index + 1); }
        }, t('nav_skip', lv)),
        isDone && unit.index < last && React.createElement("button", {
          className: "nav-btn next", onClick: function () { setUnit(unit.index + 1); }
        }, t('nav_next_stage', lv)))));
}
