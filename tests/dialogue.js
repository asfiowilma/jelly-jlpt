"use strict";

// Lesson dialogues (pilot): plan wiring, teaching order, view marks, audio script, Practice swaps.
// Catalog-shape checks (cast, lines, names, bridge, remixes chunks) are in tests/catalog-checks.js.
QUnit.module('dialogue', function () {
  var units = function () { return buildUnits(PLAN, CATALOG); };
  var withDialogue = function () { return units().filter(function (u) { return u.dialogue; }); };
  var dialogues = function () { return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.kind === 'listening' && it.format === 'dialogue'; }); };

  QUnit.test('plan: unit.dialogue resolves to a dialogue item, lesson units only, each dialogue used once', function (assert) {
    var us = withDialogue();
    assert.deepEqual(us.map(function (u) { return u.id; }), ['n5.u019', 'n5.u020', 'n5.u021', 'n5.u022', 'n5.u023', 'n5.u024', 'n5.u026', 'n5.u027', 'n5.u028', 'n5.u029', 'n5.u030', 'n5.u031', 'n5.u033', 'n5.u034', 'n5.u035', 'n5.u036', 'n5.u037', 'n5.u038', 'n5.u040', 'n5.u041', 'n5.u042', 'n5.u043', 'n5.u044', 'n5.u045', 'n5.u047', 'n5.u048', 'n5.u049', 'n5.u050', 'n5.u051', 'n5.u052', 'n5.u054', 'n5.u055', 'n5.u056', 'n5.u057', 'n5.u058', 'n5.u059', 'n5.u061', 'n5.u062', 'n5.u063', 'n5.u064', 'n5.u065', 'n5.u066', 'n5.u068', 'n5.u069', 'n5.u070', 'n5.u071', 'n5.u072', 'n5.u073', 'n5.u075', 'n5.u076', 'n5.u077', 'n5.u078', 'n5.u079', 'n5.u080', 'n5.u082', 'n5.u083', 'n5.u084'], 'the lessons that carry a dialogue so far (stages 19 to 84, batches 1 to 3)');
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
    assert.strictEqual(kinds(v.lines[0]), 'nw:わたし g:は g:です', 'new words dotted, grammar tokens, leading はじめまして and the name not marked');
    assert.strictEqual(kinds(v.lines[3]), 'br:お nw:なまえ g:は', 'bridge お only inside おなまえ');
    assert.strictEqual(kinds(v.lines[2]), 'nw:わたし g:は nw:学生 g:です', 'ruby block marked whole');
    assert.strictEqual(v.lines[2].segs.filter(function (s) { return s.t === '学生'; })[0].r, 'がくせい');
    assert.strictEqual(kinds(v.lines[5]), 'nw:さん g:は nw:せんせい g:です br:か', 'か is a bridge here');
    assert.deepEqual(v.cast.map(function (c) { return c.initial; }), ['ル', 'サ'], 'initial chips: first character of the jp name');
    assert.deepEqual(v.cast.map(function (c) { return c.side; }), ['a', 'b'], 'first cast key is side a');
    assert.deepEqual(v.lines.map(function (l) { return l.side; }), ['a', 'b', 'a', 'a', 'b', 'a', 'b', 'a', 'b'], 'bubble sides follow the speaker');
    assert.ok(v.pills.indexOf('私') >= 0 && v.pills.indexOf('X は Y です') >= 0, 'pills: new words + the pattern');
    assert.ok(v.seconds >= 10 && v.seconds <= 60, 'about ' + v.seconds + ' s');
    var u2 = withDialogue().filter(function (x) { return x.id === 'n5.u028'; })[0], v2 = dialogueView(CATALOG.items[u2.dialogue], u2);
    assert.ok(/nw:ぎゅうにゅう/.test(kinds(v2.lines[1])) && /nw:のみ/.test(kinds(v2.lines[1])), 'new words in the milk line');
    assert.ok(/br:を/.test(kinds(v2.lines[0])), 'を is a bridge in lesson ' + u2.id);
    assert.ok(/br:ピーナッツ/.test(kinds(v2.lines[3])), 'multi-character bridge word');
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

  QUnit.test('listeningScript: lines only, no narrator, speaker = the character gender, who / slot, text = dialogueSpeech; clips only when rendered', function (assert) {
    dialogues().forEach(function (it) {
      var s = listeningScript(it);
      assert.strictEqual(s.length, it.lines.length, it.id + ': one entry per line');
      assert.ok(s.every(function (l, i) { return l.who === it.lines[i].speaker && l.speaker === it.cast[l.who].gender && l.text === dialogueSpeech(it.lines[i], it) && !/[　\[|]/.test(l.text) && !('tone' in l); }), 'speech text, gender role, character id, no tone');
      var slots = {};
      s.forEach(function (l) { slots[l.who] = l.slot; });
      var want = Object.keys(it.cast).map(function (k) { return it.cast[k].gender; }).map(function (g, i, a) { return a.indexOf(g) === i ? g : g + '2'; });
      assert.deepEqual(Object.keys(it.cast).map(function (k) { return slots[k]; }), want, 'second character of a gender gets slot M2 / F2');
      var track = typeof AUDIO_MANIFEST !== 'undefined' && AUDIO_MANIFEST.tracks[it.id];
      assert.ok(track ? s.every(function (l, i) { return l.clip === track[i]; }) : s.every(function (l) { return !l.clip; }), 'clips from the manifest, none = Web Speech fallback');
    });
  });

  QUnit.test('dialogueSpeech: the display text with kanji kept and no phrase spaces, numerals spoken from their ruby, say wins', function (assert) {
    [['わたしは　[学生|がくせい]です。', 'わたしは学生です。', 'kanji kept, particle は as written, U+3000 removed'],
      ['……[先生|せんせい]の　とけいです。', '……先生のとけいです。', 'pause marks kept'],
      ['ごご　[三|さん][時|じ]ごろに　おきる。', 'ごごさんじごろにおきる。', 'from a numeral block to the phrase end: its kana (九時 くじ)'],
      ['[午前|ごぜん]　[七|しち][時|じ]ですよ。', '午前しちじですよ。', 'only the numeral run'],
      ['[四日|よっか]です！', 'よっかです！', 'a numeral inside one block'],
      ['[一|いち]まん[三|さん]ぜん[円|えん]でした！', 'いちまんさんぜんえんでした！', 'later ruby blocks of the same phrase too (the counter)'],
      ['[金|きん]ようびは？', '金ようびは？', 'no numeral: kanji kept'],
      ['[二人|ふたり]で　[行|い]く！', 'ふたりで行く！', 'a phrase space ends the number']
    ].forEach(function (c) { assert.strictEqual(dialogueSpeech({ furigana: c[0] }), c[1], c[2]); });
    var line = { furigana: 'はは　です。', say: 'ハハです。' };
    assert.strictEqual(dialogueSpeech(line), 'ハハです。', "a line's say overrides the rule");
    assert.strictEqual(line.furigana, 'はは　です。', 'display text unchanged');
    dialogues().forEach(function (it) {
      it.lines.forEach(function (l) { assert.ok(!/　/.test(dialogueSpeech(l)), it.id + ': no full-width spaces'); });
    });
  });

  QUnit.test('dialogueSpeech with the item: kana words in their normal kanji spelling at word boundaries; numbers, kana words and display untouched', function (assert) {
    var it = { uses: ['v:午後|ごご', 'v:金曜日|きんようび', 'v:家|いえ', 'v:いいえ|いいえ', 'v:働く|はたらく', 'v:見る|みる', 'v:来る|くる', 'v:行く|いく',
      'v:高い|たかい', 'v:名前|なまえ', 'v:何|なん', 'v:これ|これ', 'v:三日|みっか', 'v:五|ご', 'v:時|じ',
      'v:明日|あした', 'v:今|いま', 'v:上|うえ', 'v:歯|は', 'v:本|ほん', 'v:居る|いる'] };
    [['ごごは　はたらきます。', '午後は働きます。', 'ごごは: the noun in kanji, the particle は kept'],
      ['[金|きん]ようびは？', '金曜日は？', 'a kana + kanji mix (金ようび) in full kanji'],
      ['いいえ、いえです。', 'いいえ、いえです。', '家 stays kana (ambiguous: うち)'],
      ['あしたも　いま　[上|うえ]に　います。', 'あしたもいまうえにいます。', 'ambiguous readings stay kana, in kana or in ruby (明日 あす, 今 こん, 上 かみ, 居る おる)'],
      ['[何|なに]を？　[何|なん]ですか。', 'なにを？なんですか。', '何 spoken from its ruby'],
      ['はを　みがきます。ピーナッツは　かえります。', '歯をみがきます。ピーナッツはかえります。', 'a one-kana word only before a particle'],
      ['いくらですか？　ほんとうですか？', 'いくらですか？ほんとうですか？', 'no 行くら, no 本とう'],
      ['ろく[時|じ]に　ろく[時|じ][半|はん]です。', 'ろくじにろくじはんです。', 'a counter after a kana number in its kana'],
      ['さん[円|えん]？　[何|なん][円|えん]？', 'さんえん？なんえん？', 'a counter after a kana number or a kana 何'],
      ['ゼロ[円|えん]、[本|ほん]', 'ゼロ円、本', 'a counter kanji after no kana number stays kanji'],
      ['はたらきました。はたらきません。はたらいて　います。', '働きました。働きません。働いています。', 'a verb in ました / ません / て form'],
      ['みて　ください。', '見てください。', 'an ichidan て form; ください stays kana'],
      ['きのう　きました。こない。', 'きのう来ました。来ない。', '来る: き / こ stems; a word not in uses stays kana'],
      ['[行|い]きます。', '行きます。', 'never a word right after a ruby block (no 行来ます)'],
      ['たかくない。たかかった。', '高くない。高かった。', 'an i-adjective in くない / かった'],
      ['これは　なんですか。', 'これはなんですか。', 'a word whose normal spelling is kana stays kana; 何 is ambiguous (なに / なん)'],
      ['おなまえは？', 'お名前は？', 'after a phrase-initial お prefix'],
      ['みっか　ごご　[五|ご][時|じ]です。', 'みっか午後ごじです。', 'dates, numbers and counters stay as their kana']
    ].forEach(function (c) { assert.strictEqual(dialogueSpeech({ furigana: c[0] }, it), c[1], c[2]); });
    assert.strictEqual(dialogueSpeech({ furigana: 'ごごは　はたらきます。' }), 'ごごははたらきます。', 'without the item: nothing swapped');
    assert.strictEqual(dialogueSpeech({ furigana: 'ごごは', say: 'ごごわ' }, it), 'ごごわ', 'say still wins');
    dialogues().forEach(function (it) {
      var before = JSON.stringify(it.lines);
      it.lines.forEach(function (l) {
        var s = dialogueSpeech(l, it);
        assert.ok(s && !/[　\[|\]]/.test(s), it.id + ': ' + s + ': no full-width space, no ruby markup');
      });
      listeningScript(it);
      assert.strictEqual(JSON.stringify(it.lines), before, it.id + ': display text unchanged');
    });
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
