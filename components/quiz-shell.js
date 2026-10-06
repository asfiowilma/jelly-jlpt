"use strict";

// Maps exercise prompt strings to UI_STRINGS keys for translation
var PROMPT_KEYS = {
  'Listen and choose the meaning:': 'prompt_listen',
  'What is the reading for this character?': 'prompt_mc_char',
  'What does this word mean?': 'prompt_mc_word',
  'Type the reading for this character:': 'prompt_type_char',
  'What does this word mean? (type in English)': 'prompt_type_word',
};
function translatePrompt(prompt, level) {
  var key = PROMPT_KEYS[prompt];
  if (!key) return prompt;
  return t(key, level);
}

// Furigana parts ({ t, r? }, lib.js furiganaParts) → text and <ruby> elements (reading passages)
function rubyEls(parts) {
  return parts.map(function (p, i) {
    return p.r ? React.createElement("ruby", { key: i }, p.t, React.createElement("rt", null, p.r)) : p.t;
  });
}

var QZ_SENTENCE = ['gap', 'kanji_yomi', 'hyouki', 'bunmyaku', 'order', 'iikae', 'bunshou'];
var QZ_SPEAKER = { M: 'Man', F: 'Woman', N: 'Narrator' };
var QZ_JA = /[぀-ヿ一-鿿]/;
var QZ_RING = 2 * Math.PI * 60;

// Size class for the asked text: a lone kanji is huge, a word medium, a phrase small.
function exBigClass(text) {
  var n = Array.from(String(text)).length;
  return n <= 2 ? '' : n <= 6 ? ' md' : ' sm';
}

// Furigana parts (quiz rules, Q33) → ruby; u = the underlined / asked part (mondai). The （　）
// of a gap question shows the chosen option; the ★ slot of an order question does too.
// st = { chosen, revealed, selected, tone }: shared by the quiz layer and the placement test.
function exPartsEl(ex, parts, st) {
  var h = React.createElement, chosen = st.chosen, tone = st.tone;
  return parts.map(function (p, i) {
    if (ex.type === 'gap' && p.t === GAP_BLANK) {
      return h("span", { key: i, className: "qz-blank" + (st.revealed && st.selected === -1 ? ' ok' : tone) }, chosen !== null && ex.optionParts ? exPartsEl(ex, ex.optionParts[chosen], st) : chosen === null ?" " : ex.options[chosen]);
    }
    if (ex.type === 'order' && /＿/.test(p.t)) {
      return h("span", { key: i, className: "qz-slots" }, p.t.trim().split(' ').map(function (slot, k) {
        if (slot.indexOf('★') < 0) return h("span", { key: k, className: "qz-slot" }, "＿");
        return h("span", { key: k, className: "qz-slot star" + (chosen !== null ? ' f' : '') + tone },
          chosen === null ? '★' : ex.optionParts ? exPartsEl(ex, ex.optionParts[chosen], st) : ex.options[chosen]);
      }));
    }
    var el = p.r ? h("ruby", { key: i }, p.t, h("rt", null, p.r)) : p.t;
    return p.u ? h("u", { key: i, className: "ex-u" }, el) : el;
  });
}

// ── Shared quiz shell (ticket 46) ───────────────────────────────────────────
// The full-screen .ql layer (top bar, centred column, dock, leave dialog) and the rendering of a
// question's choices live here so the unit quiz (exercises.js) and the mock exam (mock-exam.js)
// look and behave the same. Everything is plain function calls (React.createElement as `h`);
// the only hook is useQuizLayer. Neither caller's own state lives here.

// useQuizLayer(active, leaving) → { layerRef, keyRef, trapTab }
// While `active`: body scroll locked, keydown handed to keyRef.current(e) (the caller sets it every
// render so it sees the current question), focus moved into the layer, and back onto the Start
// button on close. `leaving` (the leave dialog is open) pulls focus into the dialog.
function useQuizLayer(active, leaving) {
  var layerRef = React.useRef(null), keyRef = React.useRef(null);
  React.useEffect(function () {
    var b = typeof document !== 'undefined' && document.body;
    if (!active || !b || !b.classList) return undefined;
    b.classList.add('quiz-open');
    return function () { b.classList.remove('quiz-open'); };
  }, [active]);
  React.useEffect(function () {
    if (!active || typeof document === 'undefined' || !document.addEventListener) return undefined;
    var on = function (e) { if (keyRef.current) keyRef.current(e); };
    document.addEventListener('keydown', on);
    return function () { document.removeEventListener('keydown', on); };
  }, [active]);
  React.useEffect(function () {
    if (!active || typeof document === 'undefined' || !document.querySelector) return undefined;
    var l = layerRef.current;
    if (l && l.focus && !(l.contains && l.contains(document.activeElement))) l.focus();
    return function () { setTimeout(function () { var b = document.querySelector('#unit-quiz .quiz-start-btn'); if (b && b.focus) b.focus({ preventScroll: true }); }, 0); };
  }, [active]);
  React.useEffect(function () {
    var d = leaving && typeof document !== 'undefined' && document.querySelector && document.querySelector('.qz-dlg button');
    if (d) d.focus();
  }, [leaving]);
  // Tab stays inside the layer (inside the dialog / sheet while one is open): wraps at both ends, and
  // pulls focus back in when it was lost (a clicked button that left the page).
  var trapTab = function (e) {
    var root = layerRef.current;
    if (e.key !== 'Tab' || !root) return false;
    var scope = root.querySelector('.qz-dlg') || root.querySelector('.qz-sheet') || root;
    var f = [].slice.call(scope.querySelectorAll('button,input,[tabindex="0"]')).filter(function (el) { return !el.disabled && el.getClientRects().length; });
    var a = document.activeElement;
    e.preventDefault();
    if (!f.length) return true;
    if (!scope.contains(a)) f[e.shiftKey ? f.length - 1 : 0].focus();
    else if (e.shiftKey && a === f[0]) f[f.length - 1].focus();
    else if (!e.shiftKey && a === f[f.length - 1]) f[0].focus();
    else f[f.indexOf(a) + (e.shiftKey ? -1 : 1)].focus();
    return true;
  };
  return { layerRef: layerRef, keyRef: keyRef, trapTab: trapTab };
}

// qzTop(h, o): the top bar. o = { xLabel, onX, progLabel, segs: ['ok' | 'bad' | 'now' | ''...], now, meta: [nodes] }
// One segment per question; `now` = how many are answered (aria).
function qzTop(h, o) {
  return h("div", { className: "qz-top" },
    h("button", { className: "qz-x", 'aria-label': o.xLabel, onClick: o.onX }, icon('x')),
    h("div", {
      className: "qz-prog" + (o.fill != null ? " dual" : ""), role: "progressbar", 'aria-label': o.progLabel,
      'aria-valuemin': 0, 'aria-valuemax': o.segs.length, 'aria-valuenow': o.now
    }, o.segs.map(function (s, i) { return h("i", { key: i, className: "qz-seg" + (s ? ' ' + s : '') }); })),
    o.fill != null && h("div", { className: "qz-bar", 'aria-hidden': "true" }, h("i", { style: { width: o.fill + '%' } })),
    h("div", { className: "qz-meta" }, o.meta));
}

// qzLeaveDialog(h, o): the confirm over the layer. o = { label, title, text, stay, leave, onStay, onLeave }
function qzLeaveDialog(h, o) {
  return h("div", { className: "qz-scrim" },
    h("div", { className: "qz-dlg", role: "alertdialog", 'aria-label': o.label },
      h("b", null, o.title),
      h("p", null, o.text),
      h("div", { className: "qz-row" },
        h("button", { className: "qz-gb", onClick: o.onStay }, o.stay),
        h("button", { className: "qz-btn bad", onClick: o.onLeave }, o.leave))));
}

// qzLayer(h, shell, o): the layer. o = { label, top, main, dock, wide, overlay } (overlay = dialog / sheet)
function qzLayer(h, shell, o) {
  return h("div", { className: "ql", ref: shell.layerRef, tabIndex: -1, role: "dialog", 'aria-modal': "true", 'aria-label': o.label },
    o.top, h("div", { className: "qz-main" }, h("div", { className: "qz-col" + (o.wide ? " wide" : "") }, o.main)), o.dock, o.overlay);
}

// qzKit(h, ex, st): renders one choice question (options, furigana, listen button) for any
// caller. st = {
//   lv, pick (chosen option, not checked), revealed, selected (checked option, -1 skipped), tone,
//   onPick(i), plays (used), replyUsed(i) (mock: replies played), speaking, play(lines), voiceStatus, showEarly, onEarly() }
// → { partsEl, promptEl, questionEl(), optClass(i), optionsList(), choice() → { main, wide } }
// choice() covers the three choice shapes: a listening dialogue, a reading passage, plain options.
// Typing, reorder and pair questions stay with the quiz and use partsEl / promptEl / questionEl.
function qzKit(h, ex, st) {
  var lv = st.lv, revealed = st.revealed, pick = st.pick, selected = st.selected;
  var chosen = revealed ? (selected !== null && selected >= 0 ? selected : ex.correct) : pick;
  var partsEl = function partsEl(parts) {
    return exPartsEl(ex, parts, { chosen: chosen, revealed: revealed, selected: selected, tone: st.tone });
  };
  var promptEl = h("p", { key: "pr", className: "qz-prompt" }, translatePrompt(ex.prompt, lv));
  // The question line, the passage of a text-with-blanks, and the English of a gap sentence.
  var questionEl = function () {
    var q = ex.parts ? ex.parts.map(function (p) { return p.t; }).join('') : ex.question;
    var sentence = QZ_SENTENCE.indexOf(ex.type) >= 0;
    return [
      ex.passageParts && h("div", { key: "ps", className: "qz-passage", lang: "ja" }, partsEl(ex.passageParts)),
      !ex.passageParts && (ex.question || ex.parts) && h("div", {
        key: "q", className: sentence ? "qz-sent" : "qz-big" + exBigClass(q), lang: "ja"
      }, ex.parts ? partsEl(ex.parts) : ex.question),
      ex.note && h("p", { key: "n", className: "qz-gloss" }, ex.note),
      ex.type === 'order' && revealed && ex.sentence && CATALOG.items[ex.sentence] &&
        h("p", { key: "solved", className: "qz-solved", lang: "ja" }, CATALOG.items[ex.sentence].jp)];
  };
  var optClass = function (i) {
    var c = 'qz-opt';
    if (!revealed) { if (pick === i) c += ' sel'; } else if (i === ex.correct) c += ' ok'; else if (i === selected) c += ' bad'; else c += ' dim';
    return c;
  };
  var optionsList = function () {
    var long = ex.options.length % 2 === 1 || ex.options.some(function (o) { return String(o).length > 8; });
    return h("div", { key: "opts", className: "qz-opts " + (long ? 'g1' : 'g2') }, ex.options.map(function (opt, i) {
      return h("button", {
        key: i, className: optClass(i), disabled: revealed, 'aria-pressed': !revealed && pick === i,
        lang: QZ_JA.test(opt) ? "ja" : "en", onClick: function () { st.onPick(i); }
      }, h("kbd", null, i + 1), h("span", null, ex.optionParts ? partsEl(ex.optionParts[i]) : opt));
    }));
  };
  var choice = function () {
    if (ex.type === 'listen_dialog') {
      // Listening (ticket 17): Play speaks the script (speakScript); the transcript, English and
      // explanation show after checking. Spoken options (utterance / quick) are numbered rows with
      // their own play button; their text shows only after checking.
      var playsLeft = ex.maxPlays ? ex.maxPlays - st.plays : Infinity;
      var transcript = function () { return h("div", { key: "script", className: "qz-script", lang: "ja" },
        ex.lines.map(function (l, i) {
          return h("div", { key: i }, h("span", { className: "who", lang: "en" }, QZ_SPEAKER[l.speaker]), partsEl(l.parts));
        }),
        ex.questionParts && h("div", null, h("span", { className: "who", lang: "en" }, QZ_SPEAKER.N), partsEl(ex.questionParts)),
        revealed && h("span", { className: "en", lang: "en" }, ex.en)); };
      var list = ex.spokenOptions
        ? [h("div", { key: "opts", className: "qz-opts g1" }, ex.options.map(function (opt, i) {
          return h("div", { key: i, className: "qz-srow" },
            h("button", {
              className: "qz-rp", 'aria-label': "Play reply " + (i + 1), disabled: !!(ex.maxPlays && st.replyUsed && st.replyUsed(i) >= 1),
              onClick: function () { st.play([ex.optionSpeech[i]], i); }
            }, icon('speaker')),
            h("button", {
              className: optClass(i), lang: "ja", disabled: revealed, 'aria-pressed': !revealed && pick === i,
              'aria-label': !revealed ? "Choose reply " + (i + 1) : undefined, onClick: function () { st.onPick(i); }
            }, h("kbd", null, i + 1), h("span", null, revealed ? partsEl(ex.optionParts[i]) : "Reply " + (i + 1))));
        })), !revealed && (pick === null || pick === undefined) && h("p", { key: "hint", className: "qz-hint", lang: "en" }, st.replyHint || "The replies show after you answer.")]
        : optionsList();
      return { wide: false, main: [promptEl,
        h("div", { key: "player", className: "qz-player" },
          h("button", {
            className: "qz-play" + (st.speaking ? " on" : ""), disabled: playsLeft <= 0, 'aria-label': "Play audio",
            onClick: function () { st.play(ex.script); }
          }, icon('speaker')),
          ex.maxPlays ? h("div", { className: "qz-pips" },
            Array.from({ length: ex.maxPlays }, function (_, i) { return h("i", { key: i, className: "qz-pip" + (i >= playsLeft ? " off" : "") }); }),
            h("span", null, playsLeft > 0 ? playsLeft + (playsLeft === 1 ? " play" : " plays") + " left" : "No replays left")) : null),
        st.voiceStatus === 'none' && !revealed && h("div", { key: "warn", className: "qz-warn", role: "status" },
          "This browser has no Japanese voice, so the audio may be silent or wrong. ",
          st.showEarly ? "The transcript is below." : h("button", { className: "link-btn", onClick: st.onEarly }, "Read the transcript instead")),
        st.voiceStatus === 'fallback' && !revealed && h("div", { key: "warn", className: "qz-warn", role: "status" },
          "The recorded audio could not play, so your browser's voice is reading it instead. It may sound different from the real test."),
        (revealed || st.showEarly) && transcript(), list] };
    }
    // Choice (mc, gap, ★ order, iikae …), a single audio clip (listen), or a reading passage
    var sound = ex.type === 'listen' && h("div", { key: "player", className: "qz-player" },
      h("button", { className: "qz-play", 'aria-label': "Listen to audio", onClick: function () { speak(ex.audio); } }, icon('speaker')));
    if (ex.type === 'reading') {
      return { wide: true, main: h("div", { className: "qz-split" },
        h("div", null, promptEl, h("div", { className: "qz-passage", lang: "ja" }, rubyEls(ex.passage))),
        h("div", null,
          ex.parts && h("div", { className: "qz-sent qz-readq", lang: "ja" }, partsEl(ex.parts)),
          optionsList())) };
    }
    return { wide: false, main: [promptEl, sound || questionEl(), optionsList()] };
  };
  return { partsEl: partsEl, promptEl: promptEl, questionEl: questionEl, optClass: optClass, optionsList: optionsList, choice: choice };
}
