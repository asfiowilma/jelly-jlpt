"use strict";

// Lesson dialogues (pilot): plan wiring, teaching order, view marks, audio script, Remix question.
// Catalog-shape checks (cast, lines, names, bridge, remix chunks) are in tests/catalog-checks.js.
QUnit.module('dialogue', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var withDialogue = function () { return units().filter(function (u) { return u.dialogue; }); };
  var dialogues = function () { return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.kind === 'listening' && it.format === 'dialogue'; }); };

  QUnit.test('plan: unit.dialogue resolves to a dialogue item, lesson units only, each dialogue used once', function (assert) {
    var us = withDialogue();
    assert.deepEqual(us.map(function (u) { return u.id; }), ['n5.u019', 'n5.u028'], 'the two pilot lessons');
    assert.ok(us.every(function (u) { return u.kind === 'lesson' && CATALOG.items[u.dialogue].format === 'dialogue'; }));
    assert.deepEqual(us.map(function (u) { return u.dialogue; }).sort(), dialogues().map(function (d) { return d.id; }).sort(), 'every dialogue is in a unit');
    var bad = function (id, set) {
      var plan = JSON.parse(JSON.stringify(PLAN));
      Object.assign(plan[0].units.filter(function (u) { return u.id === id; })[0], set);
      return validatePlan(plan, CATALOG);
    };
    assert.ok(validatePlan(PLAN, CATALOG).valid, 'shipped plan is valid');
    assert.ok(/not a lesson/.test(bad('n5.u001', { dialogue: 'l:n5-dlg-team-seven' }).error), 'a kana unit cannot carry one');
    assert.ok(/missing dialogue/.test(bad('n5.u019', { dialogue: 'l:n5-nope' }).error), 'unknown id');
    assert.ok(/missing dialogue/.test(bad('n5.u019', { dialogue: 'l:n5-who-is-that' }).error), 'a test item is not a dialogue');
  });

  QUnit.test('teaching order: every use is taught by its unit or earlier, or is a declared bridge (max 3)', function (assert) {
    var problems = [];
    withDialogue().forEach(function (u) {
      var it = CATALOG.items[u.dialogue], known = taughtIds(u), bridgeIds = (it.bridge || []).map(function (b) { return b.id; });
      (it.uses || []).forEach(function (id) {
        var w = CATALOG.items[id];
        if (known[id] || (w && w.alt && known[w.alt]) || bridgeIds.indexOf(id) >= 0) return;
        problems.push(u.id + ' uses ' + id + ', taught later');
      });
      if ((it.bridge || []).length > 3) problems.push(u.id + ' has more than 3 bridge words');
      // the unit's own grammar point is in the lines
      (u.grammar || []).forEach(function (g) { if ((it.uses || []).indexOf(g.id) < 0) problems.push(u.id + ' dialogue does not use ' + g.id); });
      // kanji in the text are taught by this unit or earlier
      Array.from(it.lines.map(function (l) { return furiganaParts(l.furigana).map(function (p) { return p.t; }).join(''); }).join('')).forEach(function (c) {
        if (hasKanji(c) && !known['k:' + c]) problems.push(u.id + ' kanji ' + c + ' not taught yet');
      });
    });
    assert.deepEqual(problems, []);
  });

  QUnit.test('dialogueView: marks, cast, pills, estimate', function (assert) {
    var u = withDialogue()[0], v = dialogueView(CATALOG.items[u.dialogue], u);
    var kinds = function (l) { return l.segs.filter(function (s) { return s.kind; }).map(function (s) { return s.kind + ':' + s.t; }).join(' '); };
    assert.strictEqual(kinds(v.lines[0]), 'nw:わたし g:は g:です nw:せんせい g:です', 'new words dotted, grammar tokens, leading はじめまして not marked');
    assert.strictEqual(kinds(v.lines[1]), 'br:お nw:なまえ g:は', 'bridge お only inside おなまえ');
    assert.strictEqual(kinds(v.lines[3]), 'br:くん g:は nw:学生 g:です br:ね', 'ruby block marked whole, ね is a bridge here');
    assert.strictEqual(v.lines[3].segs.filter(function (s) { return s.t === '学生'; })[0].r, 'がくせい');
    assert.deepEqual(v.cast.map(function (c) { return c.initial; }), ['カ', 'サ'], 'initial chips');
    assert.ok(v.pills.indexOf('私') >= 0 && v.pills.indexOf('X は Y です') >= 0, 'pills: new words + the pattern');
    assert.ok(v.seconds >= 10 && v.seconds <= 60, 'about ' + v.seconds + ' s');
    var u2 = withDialogue()[1], v2 = dialogueView(CATALOG.items[u2.dialogue], u2);
    assert.ok(/nw:たべもの/.test(kinds(v2.lines[3])) && !/nw:たべ /.test(kinds(v2.lines[3])), 'たべもの is one word, not the たべ of 食べる');
    assert.ok(/br:を/.test(kinds(v2.lines[0])), 'を is a bridge in lesson ' + u2.id);
  });

  QUnit.test('listeningScript: lines only, no narrator, speaker M / M2, no pause marks; clips only when rendered', function (assert) {
    dialogues().forEach(function (it) {
      var s = listeningScript(it);
      assert.strictEqual(s.length, it.lines.length, it.id + ': one entry per line');
      assert.ok(s.every(function (l, i) { return l.speaker === it.lines[i].speaker && l.speaker !== 'N' && !/…/.test(l.text) && !/[一-鿿\[|]/.test(l.text); }), 'kana speech text');
      var track = typeof AUDIO_MANIFEST !== 'undefined' && AUDIO_MANIFEST.tracks[it.id];
      assert.ok(track ? s.every(function (l, i) { return l.clip === track[i]; }) : s.every(function (l) { return !l.clip; }), 'clips from the manifest, none = Web Speech fallback');
    });
  });

  QUnit.test('assignVoices: the second man gets another voice or a different pitch', function (assert) {
    var ichiro = { name: 'Microsoft Ichiro - Japanese', lang: 'ja-JP', localService: true };
    var keita = { name: 'Microsoft Keita - Japanese', lang: 'ja-JP', localService: true };
    var haruka = { name: 'Microsoft Haruka - Japanese', lang: 'ja-JP', localService: true };
    var c = assignVoices([ichiro, keita, haruka]);
    assert.ok(c.M2.voice && c.M2.voice !== c.M.voice, 'two male voices: one each');
    c = assignVoices([ichiro, haruka]);
    assert.ok(c.M2.voice === c.M.voice && c.M2.pitch !== c.M.pitch, 'one male voice: pitch tells them apart');
    c = assignVoices([haruka]);
    assert.ok(c.M2.pitch !== c.M.pitch, 'no male voice: pitches differ');
    assert.ok(assignVoices([]).M2.pitch !== assignVoices([]).M.pitch, 'no voice at all');
  });

  QUnit.test('Remix: a lesson with a dialogue ends its quiz with one reorder question; the answer builds the target, the distractor is left out', function (assert) {
    units().forEach(function (u) {
      var exs = buildExercises(u), remix = exs.filter(function (e) { return e.form === 'remix'; });
      if (!u.dialogue) { assert.strictEqual(remix.length, 0, u.id + ': no remix'); return; }
      assert.strictEqual(remix.length, 1, u.id + ': one remix');
      var ex = exs[exs.length - 1], it = CATALOG.items[u.dialogue];
      assert.strictEqual(ex, remix[0], 'last question');
      assert.ok(ex.type === 'reorder' && ex.itemId === it.id && ex.scene === it.remix.scene && ex.need === it.remix.answer.length, 'shape');
      assert.strictEqual(ex.items.length, ex.need + 1, 'exactly one distractor');
      var pick = it.remix.answer.map(function (c) { return ex.items.indexOf(c); });
      assert.ok(answerIsRight(ex, pick), 'right order');
      assert.ok(!answerIsRight(ex, pick.slice().reverse()), 'wrong order');
      var distractor = ex.items.filter(function (c) { return it.remix.answer.indexOf(c) < 0; })[0];
      assert.ok(!answerIsRight(ex, pick.concat([ex.items.indexOf(distractor)])), 'distractor used');
      assert.strictEqual(it.remix.answer.join(''), ex.answer);
      if (u.id === 'n5.u028') assert.ok(/を/.test(ex.note), 'bridge を glossed above the question');
      assert.ok(exs.length >= 8, 'quiz keeps its size: ' + exs.length);
    });
  });

  QUnit.test('dialogState: open / heard per unit, device-only (not in the synced device keys)', function (assert) {
    assert.ok(DEVICE_PREF_KEYS.indexOf(DIALOGS_KEY) < 0, 'not a synced pref');
    // the headless runner's localStorage is a no-op (run-tests.js plays the persistence through DialogueSection): skip there
    var real = false;
    try { localStorage.setItem('__dj', '1'); real = localStorage.getItem('__dj') === '1'; localStorage.removeItem('__dj'); } catch (e) {}
    if (!real) { assert.ok(true, 'no working localStorage here'); return; }
    var had = localStorage.getItem(DIALOGS_KEY);
    try {
      saveDialogState('n5.u019', { open: true, heard: false });
      saveDialogState('n5.u028', { open: false, heard: true });
      assert.deepEqual([dialogState('n5.u019'), dialogState('n5.u028'), dialogState('n5.u999')], [{ open: true, heard: false }, { open: false, heard: true }, {}]);
    } finally { if (had === null) localStorage.removeItem(DIALOGS_KEY); else localStorage.setItem(DIALOGS_KEY, had); }
  });
});
