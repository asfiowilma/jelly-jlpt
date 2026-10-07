"use strict";

// Lesson dialogues (pilot): plan wiring, teaching order, view marks, audio script, Practice swaps.
// Catalog-shape checks (cast, lines, names, bridge, remixes chunks) are in tests/catalog-checks.js.
QUnit.module('dialogue', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var withDialogue = function () { return units().filter(function (u) { return u.dialogue; }); };
  var dialogues = function () { return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.kind === 'listening' && it.format === 'dialogue'; }); };

  QUnit.test('plan: unit.dialogue resolves to a dialogue item, lesson units only, each dialogue used once', function (assert) {
    var us = withDialogue();
    assert.deepEqual(us.map(function (u) { return u.id; }), ['n5.u019', 'n5.u020', 'n5.u021', 'n5.u022', 'n5.u023', 'n5.u024', 'n5.u026', 'n5.u027', 'n5.u028', 'n5.u029', 'n5.u030', 'n5.u031', 'n5.u033', 'n5.u034', 'n5.u035', 'n5.u036', 'n5.u037', 'n5.u038', 'n5.u040'], 'the lessons that carry a dialogue so far (stages 19 to 40, batch 1)');
    assert.ok(us.every(function (u) { return u.kind === 'lesson' && CATALOG.items[u.dialogue].format === 'dialogue'; }));
    assert.deepEqual(us.map(function (u) { return u.dialogue; }).sort(), dialogues().map(function (d) { return d.id; }).sort(), 'every dialogue is in a unit');
    var bad = function (id, set) {
      var plan = JSON.parse(JSON.stringify(PLAN));
      Object.assign(plan[0].units.filter(function (u) { return u.id === id; })[0], set);
      return validatePlan(plan, CATALOG);
    };
    assert.ok(validatePlan(PLAN, CATALOG).valid, 'shipped plan is valid');
    assert.ok(/not a lesson/.test(bad('n5.u001', { dialogue: 'l:n5-dlg-first-class' }).error), 'a kana unit cannot carry one');
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
    assert.strictEqual(kinds(v.lines[3]), 'nw:さん g:は nw:学生 g:です br:ね', 'ruby block marked whole, ね is a bridge here');
    assert.strictEqual(v.lines[3].segs.filter(function (s) { return s.t === '学生'; })[0].r, 'がくせい');
    assert.ok(/br:しずかな/.test(kinds(v.lines[5])), 'multi-character bridge word');
    assert.deepEqual(v.cast.map(function (c) { return c.initial; }), ['カ', 'サ'], 'initial chips: first character of the jp name');
    assert.deepEqual(v.cast.map(function (c) { return c.side; }), ['a', 'b'], 'first cast key is side a');
    assert.deepEqual(v.lines.map(function (l) { return l.side; }), ['a', 'a', 'b', 'a', 'b', 'a', 'b', 'a'], 'bubble sides follow the speaker');
    assert.ok(v.pills.indexOf('私') >= 0 && v.pills.indexOf('X は Y です') >= 0, 'pills: new words + the pattern');
    assert.ok(v.seconds >= 10 && v.seconds <= 60, 'about ' + v.seconds + ' s');
    var u2 = withDialogue().filter(function (x) { return x.id === 'n5.u028'; })[0], v2 = dialogueView(CATALOG.items[u2.dialogue], u2);
    assert.ok(/nw:ぎゅうにゅう/.test(kinds(v2.lines[1])) && /nw:のみ/.test(kinds(v2.lines[1])), 'new words in the milk line');
    assert.ok(/br:を/.test(kinds(v2.lines[0])), 'を is a bridge in lesson ' + u2.id);
    assert.deepEqual(v2.cast.map(function (c) { return c.initial + c.side; }), ['ヨa', 'アb'], 'two women: still a and b');
  });

  QUnit.test('dialogueView: set phrases carry no grammar mark, real grammar still does', function (assert) {
    var seen = 0, real = 0;
    withDialogue().forEach(function (u) {
      dialogueView(CATALOG.items[u.dialogue], u).lines.forEach(function (l) {
        var plain = l.segs.map(function (s) { return s.t; }).join(''), mark = [], o = 0;
        l.segs.forEach(function (s) { if (s.kind === 'g') { mark.push([o, o + s.t.length]); real++; } o += s.t.length; });
        SET_PHRASES.forEach(function (ph) {
          for (var p = plain.indexOf(ph); p >= 0; p = plain.indexOf(ph, p + 1)) {
            seen++;
            assert.ok(!mark.some(function (r) { return p < r[1] && p + ph.length > r[0]; }), u.id + ': no grammar mark in ' + ph);
          }
        });
      });
    });
    assert.ok(seen >= 2 && real > 0, 'set phrases present (' + seen + '), grammar marks kept (' + real + ')');
    var u2 = withDialogue().filter(function (x) { return x.id === 'n5.u028'; })[0], v2 = dialogueView(CATALOG.items[u2.dialogue], u2);
    assert.ok(v2.lines.some(function (l) { return l.segs.some(function (s) { return s.kind === 'g' && /たべ?ます|ます/.test(s.t) && l.en; }); }), 'ます still marked outside set phrases');
  });

  QUnit.test('listeningScript: lines only, no narrator, speaker = the character gender, who / slot / tone, no pause marks; clips only when rendered', function (assert) {
    dialogues().forEach(function (it) {
      var s = listeningScript(it);
      assert.strictEqual(s.length, it.lines.length, it.id + ': one entry per line');
      assert.ok(s.every(function (l, i) { return l.who === it.lines[i].speaker && l.speaker === it.cast[l.who].gender && !/…/.test(l.text) && !/[一-鿿\[|]/.test(l.text) && l.tone === it.lines[i].tone; }), 'kana speech text, gender role, character id, tone');
      var slots = {};
      s.forEach(function (l) { slots[l.who] = l.slot; });
      var want = Object.keys(it.cast).map(function (k) { return it.cast[k].gender; }).map(function (g, i, a) { return a.indexOf(g) === i ? g : g + '2'; });
      assert.deepEqual(Object.keys(it.cast).map(function (k) { return slots[k]; }), want, 'second character of a gender gets slot M2 / F2');
      var track = typeof AUDIO_MANIFEST !== 'undefined' && AUDIO_MANIFEST.tracks[it.id];
      assert.ok(track ? s.every(function (l, i) { return l.clip === track[i]; }) : s.every(function (l) { return !l.clip; }), 'clips from the manifest, none = Web Speech fallback');
    });
  });

  QUnit.test('particleSpeech: phrase-final は / へ / を are spoken わ / え / お, words keep their kana', function (assert) {
    [['ははは　げんきです。', 'ははわ　げんきです。'], ['はなは　きれいです。', 'はなわ　きれいです。'], ['へやへ　いきます。', 'へやえ　いきます。'],
      ['はい、そうです。', 'はい、そうです。'], ['こんにちは！', 'こんにちわ！'], ['こんばんは。', 'こんばんわ。'], ['それでは、また。', 'それでわ、また。'],
      ['わたしは　がくせいです。', 'わたしわ　がくせいです。'], ['えきへ　いきます。', 'えきえ　いきます。'], ['パンを　たべます。', 'パンお　たべます。'],
      ['がくせいでは　ありません。', 'がくせいでわ　ありません。'], ['まいにちは　いそがしいです。', 'まいにちわ　いそがしいです。'], ['がっこうには　いきません', 'がっこうにわ　いきません'],
      ['おなまえは？', 'おなまえわ？'], ['ははです。', 'ははです。'], ['はじめまして。', 'はじめまして。'], ['へやは　ここです。', 'へやわ　ここです。']
    ].forEach(function (c) { assert.strictEqual(particleSpeech(c[0]), c[1], c[0]); });
    assert.strictEqual(dialogueSpeech({ furigana: '……[私|わたし]は　[七|なな]ひゃく[円|えん]です。' }), 'わたしわ　ななひゃくえんです。', 'ruby read, pause marks dropped');
    assert.strictEqual(dialogueSpeech({ furigana: 'はは。', say: 'はは。' }), 'はは。', 'a line\'s say overrides the rule (word-final は at a phrase end)');
  });

  QUnit.test('dialogue speech: no particle は / へ / を left (every remaining は / へ sits in a used word or a set phrase)', function (assert) {
    var SET = ['はじめまして', 'おはよう'], left = [];
    dialogues().forEach(function (it) {
      var words = SET.concat((it.uses || []).filter(function (id) { return /^v:/.test(id); }).map(function (id) {
        var v = CATALOG.items[id], r = kataToHira(v.reading);
        return /^(verb|adj-i)/.test(v.pos) ? r.slice(0, -1) : r; // inflected: the stem (はたらき-ます)
      }));
      listeningScript(it).forEach(function (l, j) {
        if (it.lines[j].say) return; // spelled out by hand
        var s = l.text.replace(/[\u3000\s]/g, ''), covered = {};
        words.forEach(function (w) { for (var i = s.indexOf(w); i >= 0; i = s.indexOf(w, i + 1)) for (var k = i; k < i + w.length; k++) covered[k] = true; });
        for (var i = 0; i < s.length; i++) if ((s[i] === 'を' || /[はへ]/.test(s[i]) && !covered[i])) left.push(it.id + ' line ' + (j + 1) + ': ' + s);
      });
    });
    assert.deepEqual(left, [], 'add a `say` to a line the rule gets wrong (docs/dialogue-authoring.md)');
  });

  QUnit.test('assignVoices: the second man / woman gets another voice or a different pitch', function (assert) {
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
    var ayumi = { name: 'Microsoft Ayumi - Japanese', lang: 'ja-JP', localService: true };
    c = assignVoices([ichiro, haruka, ayumi]);
    assert.ok(c.F2.voice && c.F2.voice !== c.F.voice, 'two female voices: one each');
    c = assignVoices([ichiro, haruka]);
    assert.ok(c.F2.voice === c.F.voice && c.F2.pitch !== c.F.pitch, 'one female voice: pitch tells them apart');
    assert.ok(assignVoices([]).F2.pitch !== assignVoices([]).F.pitch, 'no voice at all, women');
  });

  QUnit.test('Quiz has no Remix question; Practice swaps (dialogueSwaps) build the target and leave the distractor out', function (assert) {
    units().forEach(function (u) {
      var exs = buildExercises(u), swaps = dialogueSwaps(u);
      assert.ok(!exs.some(function (e) { return e.type === 'reorder'; }), u.id + ': no reorder in the quiz');
      if (!u.dialogue) { assert.strictEqual(swaps.length, 0, u.id + ': no swaps'); return; }
      var it = CATALOG.items[u.dialogue];
      assert.strictEqual(swaps.length, it.remixes.length, u.id + ': one per remix');
      swaps.forEach(function (ex, n) {
        var r = it.remixes[n];
        assert.ok(ex.type === 'reorder' && ex.scene === r.scene && ex.need === r.answer.length && ex.items.length === ex.need + 1, 'shape');
        var pick = r.answer.map(function (c) { return ex.items.indexOf(c); });
        assert.ok(answerIsRight(ex, pick), 'right order');
        assert.ok(!answerIsRight(ex, pick.slice().reverse()), 'wrong order');
        var distractor = ex.items.filter(function (c) { return r.answer.indexOf(c) < 0; })[0];
        assert.ok(!answerIsRight(ex, pick.concat([ex.items.indexOf(distractor)])), 'distractor used');
        if (u.id === 'n5.u028') assert.ok(/を/.test(ex.note), 'bridge を glossed');
      });
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
      saveDialogState('n5.u019', { practiced: true }); saveDialogState('n5.u019', { open: true, heard: false });
      assert.strictEqual(dialogState('n5.u019').practiced, true, 'practiced survives an open / heard save');
      saveDialogState('n5.u019', { practiced: false });
      assert.deepEqual([dialogState('n5.u019'), dialogState('n5.u028'), dialogState('n5.u999')], [{ open: true, heard: false, practiced: false }, { open: false, heard: true, practiced: false }, {}]);
    } finally { if (had === null) localStorage.removeItem(DIALOGS_KEY); else localStorage.setItem(DIALOGS_KEY, had); }
  });
});
