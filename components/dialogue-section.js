"use strict";

// DialogueSection: the lesson dialogue (listening item of format dialogue, unit.dialogue), above the
// vocabulary. Collapsed hero (Play / Read first) -> open chat bubbles with tap-to-play lines, marks
// (new word, bridge, grammar) and a gloss strip; "Heard" after one full play-through. Audio: the
// pre-rendered clips of audio/manifest.js, else the browser voice (speakScript). Open / heard is
// remembered per unit on this device only (lib.js dialogState, never synced).
// Marks and lines come from lib.js dialogueView; the Remix question is built in buildExercises.
var DLG_GAP_MS = 600;
var DLG_KIND = { nw: 'New word', br: 'Not taught yet', g: 'Grammar' };

function DialogueSection(props) {
  var h = React.createElement;
  var unit = props.unit, showFurigana = props.showFurigana;
  var item = CATALOG.items[unit.dialogue];
  var view = React.useMemo(function () { return dialogueView(item, unit); }, [unit.id]);
  var saved = React.useMemo(function () { return dialogState(unit.id); }, [unit.id]);
  var _open = React.useState(!!saved.open), open = _open[0], setOpen = _open[1];
  var _heard = React.useState(!!saved.heard), heard = _heard[0], setHeard = _heard[1];
  var _on = React.useState(-1), on = _on[0], setOn = _on[1];
  var _playing = React.useState(false), playing = _playing[0], setPlaying = _playing[1];
  var _gloss = React.useState(null), gloss = _gloss[0], setGloss = _gloss[1];
  var _en = React.useState(true), en = _en[0], setEn = _en[1];
  var _hide = React.useState(false), hide = _hide[0], setHide = _hide[1];
  var run = React.useRef(0), stopRef = React.useRef(null), timer = React.useRef(null);

  var halt = function () {
    run.current++;
    clearTimeout(timer.current);
    if (stopRef.current) { stopRef.current(); stopRef.current = null; }
  };
  React.useEffect(function () { return halt; }, [unit.id]);
  React.useEffect(function () { saveDialogState(unit.id, { open: open, heard: heard }); }, [unit.id, open, heard]);
  React.useEffect(function () {
    var m = on >= 0 && document.getElementById('dlg-m' + on);
    if (m && m.scrollIntoView) m.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [on]);

  // play(from, single): the whole script from line `from`, or just that one line
  var play = function (from, single) {
    halt();
    var my = run.current, script = listeningScript(item);
    setOpen(true);
    setPlaying(!single);
    var done = function (finished) {
      setOn(-1);
      setPlaying(false);
      if (finished && !single && from === 0) setHeard(true);
    };
    (function go(j) {
      if (my !== run.current) return;
      if (j >= script.length) return done(true);
      setOn(j);
      var next = function () {
        if (my !== run.current) return;
        if (single) return done(false);
        timer.current = setTimeout(function () { go(j + 1); }, DLG_GAP_MS);
      };
      stopRef.current = speakScript([script[j]], { onEnd: next });
      // no clip and no browser voice: nothing will call onEnd, so move on
      if (!script[j].clip && !(window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined')) timer.current = setTimeout(next, 900);
    })(from);
  };
  var collapse = function () { halt(); setOn(-1); setPlaying(false); setOpen(false); };

  var chip = function (speaker, initial, key) {
    return h('span', { key: key, className: 'dlg-chip ' + (speaker === 'M' ? 'a' : 'b'), 'aria-hidden': true }, initial);
  };
  var chips = view.cast.map(function (c, i) { return chip(c.speaker, c.initial, i); });

  // a mark opens the gloss strip; Enter / Space work on the keyboard
  var seg = function (s, i) {
    var inner = s.r && showFurigana ? h('ruby', null, s.t, h('rt', null, s.r)) : s.t;
    if (!s.kind) return h(React.Fragment, { key: i }, inner);
    var pick = function (e) { e.stopPropagation(); setGloss({ kind: s.kind, text: s.gloss }); };
    return h(s.kind === 'g' ? 'mark' : 'span', {
      key: i, className: 'dlg-' + s.kind, role: 'button', tabIndex: 0, onClick: pick,
      onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } }
    }, inner);
  };
  var bubble = function (l) {
    var a = l.speaker === 'M';
    return h('div', {
      key: l.i, id: 'dlg-m' + l.i, className: 'dlg-msg ' + (a ? 'a' : 'b') + (on === l.i ? ' on' : ''),
      role: 'button', tabIndex: 0, 'aria-label': 'Play line ' + (l.i + 1) + ', ' + l.name,
      onClick: function () { play(l.i, true); },
      onKeyDown: function (e) { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); play(l.i, true); } }
    }, chip(l.speaker, l.initial),
      h('div', { className: 'dlg-bub' },
        h('div', { className: 'dlg-nm' }, l.name),
        h('div', { className: 'dlg-jp' + (hide ? ' hide' : ''), lang: 'ja' }, l.segs.map(seg)),
        en && h('div', { className: 'dlg-en' }, l.en)));
  };

  var hero = function () {
    return h('div', { className: 'dlg-hero' },
      h('div', { className: 'dlg-hl' },
        h('div', { className: 'dlg-kick' }, h('span', { className: 'dlg-chips' }, chips), h('span', { className: 'dlg-label' }, 'Dialog'),
          heard && h('span', { className: 'dlg-heard' }, '· Heard ✓')),
        h('h3', { className: 'dlg-title' }, view.title),
        h('p', { className: 'dlg-pitch' }, view.goal),
        h('div', { className: 'dlg-meta' }, view.lines.length + ' lines · about ' + view.seconds + ' s'),
        h('div', { className: 'dlg-acts' },
          h('button', { className: 'dlg-play', onClick: function () { play(0); } }, icon('play'), heard ? 'Replay' : 'Play'),
          h('button', { className: 'dlg-ghost', onClick: function () { setOpen(true); } }, heard ? 'Read' : 'Read first'))),
      h('aside', { className: 'dlg-side' },
        h('div', { className: 'dlg-label' }, 'Cast'),
        view.cast.map(function (c, i) {
          return h('div', { key: i, className: 'dlg-cast' }, chip(c.speaker, c.initial), h('div', null, h('b', null, c.name), h('span', null, c.role)));
        }),
        h('div', { className: 'dlg-label dlg-youuse' }, 'You will use'),
        h('div', { className: 'dlg-pills' }, view.pills.map(function (w, i) { return h('span', { key: i }, w); }))));
  };

  var opened = function () {
    var tool = function (label, pressed, onClick, aria) {
      return h('button', { className: 'dlg-tool', 'aria-pressed': pressed, 'aria-label': aria, onClick: onClick }, label);
    };
    return h('div', { className: 'dlg-open' },
     h('div', { className: 'dlg-panel' },
      h('div', { className: 'dlg-dh' }, h('span', { className: 'dlg-chips' }, chips), h('b', null, view.title),
        h('span', { className: 'dlg-dacts' },
          h('button', { className: 'dlg-tool strong', onClick: function () { if (playing) { halt(); setOn(-1); setPlaying(false); } else play(0); } }, playing ? 'Stop' : 'Replay'),
          h('button', { className: 'dlg-tool', onClick: collapse }, 'Collapse'))),
      h('div', { className: 'dlg-scene' }, view.scene),
      h('div', { className: 'dlg-tools' },
        tool('あ', !!showFurigana, props.toggleFurigana, 'Furigana'),
        tool('EN', en, function () { setEn(!en); }, 'English'),
        tool('Listen only', hide, function () { setHide(!hide); }))),
      h('div', { className: 'dlg-chat' }, view.lines.map(bubble)),
      h('div', { className: 'dlg-gloss' + (gloss ? ' g-' + gloss.kind : ''), role: 'status' },
        gloss ? [h('small', { key: 'k' }, DLG_KIND[gloss.kind]), h('span', { key: 't' }, gloss.text)]
          : h('span', { className: 'dlg-hint' }, 'Tap a marked word for its meaning.')));
  };

  return h('div', { className: 'section dlg', id: 'dlg-hero' }, open ? opened() : hero());
}
