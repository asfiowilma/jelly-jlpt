// Listening (ticket 17): pure parts of the TTS player and the listen_dialog question.
QUnit.module('listening', function () {
  QUnit.test('chunkSpeech: short lines whole, long lines cut at sentence ends, then commas / spaces', function (assert) {
    assert.deepEqual(chunkSpeech('あした　どこへ　いきますか。'), ['あした　どこへ　いきますか。'], 'short line untouched');
    var s1 = 'わたしは　まいあさ　ろくじに　おきます。', s2 = 'それから　がっこうへ　いきます。';
    assert.deepEqual(chunkSpeech(s1 + s2, 25), [s1, s2], 'split at 。');
    assert.deepEqual(chunkSpeech(s1 + s2, 100), [s1 + s2], 'merged back when they fit');
    var long = 'あいうえおかきくけこさしすせそ、たちつてとなにぬねの、はひふへほまみむめも。';
    var parts = chunkSpeech(long, 20);
    assert.ok(parts.length > 1 && parts.every(function (p) { return p.length <= 20; }), 'a long sentence is cut at 、 within max');
    assert.strictEqual(parts.join(''), long, 'nothing lost');
    var noBreak = new Array(51).join('あ');
    assert.deepEqual(chunkSpeech(noBreak, 20).map(function (p) { return p.length; }), [20, 20, 10], 'hard cut when there is no break');
    assert.ok(Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.kind === 'listening'; })
      .every(function (it) { return listeningScript(it).every(function (l) { return chunkSpeech(l.text).every(function (c) { return c.length <= SPEECH_CHUNK; }); }); }), 'every shipped line chunks within SPEECH_CHUNK');
  });

  QUnit.test('assignVoices: two ja voices by gender, else one voice with a pitch split', function (assert) {
    var haruka = { name: 'Microsoft Haruka - Japanese', lang: 'ja-JP', localService: true };
    var ichiro = { name: 'Microsoft Ichiro - Japanese', lang: 'ja-JP', localService: true };
    var ayumi = { name: 'Microsoft Ayumi - Japanese', lang: 'ja-JP', localService: true };
    var google = { name: 'Google 日本語', lang: 'ja-JP', localService: false };
    var en = { name: 'Microsoft Zira', lang: 'en-US', localService: true };
    var c = assignVoices([en, haruka, ichiro]);
    assert.ok(c.M.voice === ichiro && c.F.voice === haruka, 'male voice for M, female for F');
    assert.ok(c.M.pitch === 1 && c.F.pitch === 1, 'gendered voices keep pitch 1');
    c = assignVoices([haruka, ayumi]);
    assert.ok(c.M.voice !== c.F.voice && c.M.pitch < 1, 'two female voices: different voices, M pitched down');
    c = assignVoices([google]);
    assert.ok(c.M.voice === google && c.F.voice === google, 'one voice for both');
    assert.ok(c.M.pitch === 0.8 && c.F.pitch === 1.25, 'pitch 0.8 / 1.25 tells them apart');
    c = assignVoices([google, haruka]);
    assert.strictEqual(c.F.voice, haruka, 'local voice before the network one');
    c = assignVoices([en]);
    assert.ok(c.M.voice === null && c.F.voice === null && c.M.pitch !== c.F.pitch, 'no ja voice: pitches only');
    assert.strictEqual(assignVoices([]).N.pitch, 1, 'narrator neutral');
    c = assignVoices([haruka, ichiro, ayumi]);
    assert.ok(c.N.voice === ayumi, 'narrator gets a third voice when there is one');
    var keita = { name: 'Microsoft Keita Online (Natural)', lang: 'ja-JP', localService: false };
    c = assignVoices([keita, ichiro, haruka, ayumi]);
    assert.ok(c.M.voice === ichiro && c.F.voice === haruka && c.N.voice === ayumi, 'narrator is a female voice, never M or F');
    var nanami = { name: 'Microsoft 七海 Online (Natural) - Japanese (Japan)', lang: 'ja-JP', localService: false };
    var keitaJa = { name: 'Microsoft 圭太 Online (Natural) - Japanese (Japan)', lang: 'ja-JP', localService: false };
    c = assignVoices([nanami, keitaJa]);
    assert.ok(c.M.voice === keitaJa && c.F.voice === nanami && c.M.pitch === 1 && c.F.pitch === 1, 'kanji-named Edge voices: 圭太 is M, 七海 is F (listed in that order)');
    c = assignVoices([haruka, ichiro]);
    assert.ok(c.N.voice === haruka && c.N.pitch < c.F.pitch, 'only two voices: narrator still sounds different from F');
  });

  QUnit.test('listeningScript: frame and question order per format; speech is kana', function (assert) {
    var task = listeningFor('N5', 'task')[0];
    var s = listeningScript(task);
    var q = speechText(task.question);
    assert.ok(s[0].speaker === 'N' && s[1].text === q && s[s.length - 1].text === q, 'task: scene, question, dialogue, question again');
    assert.strictEqual(s.length, task.lines.length + 2);
    assert.ok(s.every(function (l) { return !hasKanji(l.text); }), 'no kanji reaches the voice');
    var quick = listeningFor('N5', 'quick')[0];
    s = listeningScript(quick, [2, 0, 1]);
    assert.deepEqual(s.map(function (l) { return l.speaker; }), [quick.lines[0].speaker, 'N', quick.optionSpeaker, 'N', quick.optionSpeaker, 'N', quick.optionSpeaker], 'quick: the line, then numbered replies');
    assert.deepEqual([s[1].text, s[2].text], ['いち', speechText(quick.options[2])], 'options in the asked order');
    var utt = listeningFor('N5', 'utterance')[0];
    s = listeningScript(utt);
    assert.strictEqual(s[utt.lines.length].text, speechText(utt.question), 'utterance: question before the options');
  });

  QUnit.test('counts by format and listenQuestion', function (assert) {
    assert.deepEqual(['task', 'point', 'utterance', 'quick'].map(function (f) { return listeningFor('N5', f).length; }), [19, 17, 15, 24]);
    assert.strictEqual(listeningFor('N4').length, 0, 'none at N4 yet');
    var it = listeningFor('N5', 'point')[0];
    var ex = listenQuestion(it, {});
    assert.strictEqual(ex.type, 'listen_dialog');
    assert.strictEqual(stripMarks(it.options[it.answer]), ex.options[ex.correct], 'correct = the authored answer');
    assert.strictEqual(ex.maxPlays, 0, 'lessons: unlimited plays');
    assert.strictEqual(listenQuestion(it, {}, { mock: true }).maxPlays, 2, 'mocks: one replay');
    assert.ok(!ex.spokenOptions && listenQuestion(listeningFor('N5', 'quick')[0], {}).spokenOptions, 'quick options are spoken');
    var again = requeueExercise({ kind: 'review', index: 0 }, Object.assign({}, ex, { maxPlays: 2 }));
    assert.ok(again.requeue && again.itemId === it.id && again.maxPlays === 2, 'a missed listening question comes back, same item, same replay limit');
    function stripMarks(s) { return s.replace(/\[([^|\]]+)\|[^\]]*\]/g, '$1'); }
  });

  QUnit.test('quiz inclusion: review units ask at most one listening item, last, every word in it taught', function (assert) {
    var reviews = allUnits().filter(function (u) { return (u.listening || []).length; });
    assert.ok(reviews.length >= 10, reviews.length + ' reviews carry a listening item');
    assert.ok(allUnits().every(function (u) { return u.kind === 'review' || !u.listening; }), 'only review units');
    reviews.forEach(function (u) {
      var taught = taughtIds(u);
      var it = CATALOG.items[u.listening[0]];
      var untaught = it.uses.filter(function (id) { return /^[vg]:/.test(id) && !taught[id]; });
      assert.deepEqual(untaught, [], u.id + ': ' + it.id + ' uses only taught words');
    });
    var exs = buildExercises(reviews[0]);
    assert.strictEqual(exs.filter(function (e) { return e.type === 'listen_dialog'; }).length, 1, 'one listen_dialog question');
    assert.strictEqual(exs[exs.length - 1].type, 'listen_dialog', 'listening comes last');
    var lesson = allUnits().filter(function (u) { return u.kind === 'lesson'; })[5];
    assert.ok(buildExercises(lesson).every(function (e) { return e.type !== 'listen_dialog'; }), 'lessons have none');
  });

  // Mock replay budget: each spoken reply has its own single listen, apart from the main Play.
  QUnit.test('qzKit: a mock reply button is spent after one listen, the main Play is not', function (assert) {
    var ex = listenQuestion(listeningFor('N5', 'quick')[0], {}, { mock: true });
    var used = { 1: 1 }, played = [];
    var h = function (tag, props) { return { tag: tag, props: props || {}, kids: Array.prototype.slice.call(arguments, 2) }; };
    var walk = function (n, out) { if (Array.isArray(n)) n.forEach(function (x) { walk(x, out); }); else if (n && n.props) { out.push(n); walk(n.kids, out); } return out; };
    var kit = qzKit(h, ex, { lv: 'N5', pick: null, revealed: false, selected: null, tone: '', onPick: function () {},
      plays: 0, replyUsed: function (i) { return used[i] || 0; }, speaking: false, play: function (lines, r) { played.push(r); },
      voiceStatus: 'ok', showEarly: false, onEarly: function () {} });
    var all = walk(kit.choice().main, []);
    var rp = all.filter(function (n) { return /qz-rp/.test(n.props.className || ''); });
    assert.deepEqual(rp.map(function (n) { return n.props.disabled; }), [false, true, false], 'only the played reply is spent');
    rp[0].props.onClick();
    assert.deepEqual(played, [0], 'a reply play carries its index');
    assert.ok(!all.filter(function (n) { return /qz-play/.test(n.props.className || ''); })[0].props.disabled, 'the main Play is untouched by reply plays');
  });

  // A reply button played the dialogue: Chrome's cancel() is async, so a speak() in the same tick
  // queued behind the cancelled dialogue. speakScript now waits a beat when the engine is busy.
  QUnit.test('speakScript: starts after a beat when the engine is still speaking, at once when idle', function (assert) {
    var origSS = window.speechSynthesis, origU = typeof SpeechSynthesisUtterance === 'undefined' ? undefined : SpeechSynthesisUtterance, G = typeof global !== 'undefined' ? global : window;
    var heard = [], fake = { speaking: true, getVoices: function () { return []; }, cancel: function () {}, speak: function (u) { heard.push(u.text); } };
    window.speechSynthesis = fake;
    if (!origU) G.SpeechSynthesisUtterance = function (t) { this.text = t; };
    var line = function (t) { return [{ speaker: 'M', text: t }]; };
    speakScript(line('あ'));
    assert.deepEqual(heard, [], 'busy engine: nothing spoken in the same tick as cancel()');
    var stop = speakScript(line('い'));
    stop();
    fake.speaking = false;
    _scriptBusy = false;
    speakScript(line('う'));
    assert.deepEqual(heard, ['う'], 'idle engine: spoken at once');
    return new Promise(function (resolve) { setTimeout(resolve, SPEECH_CANCEL_GAP + 80); }).then(function () {
      assert.deepEqual(heard, ['う'], 'a superseded or stopped script never speaks after the beat');
      fake.speaking = true;
      speakScript(line('え'));
      return new Promise(function (resolve) { setTimeout(resolve, SPEECH_CANCEL_GAP + 80); });
    }).then(function () {
      assert.deepEqual(heard, ['う', 'え'], 'busy engine: spoken after the beat');
    }).then(function () {
      window.speechSynthesis = origSS;
      if (!origU) delete G.SpeechSynthesisUtterance;
    });
  });

  QUnit.test('P1-5 mock audio: browser-voice fallback is reported and shown; rate override reaches the voice', function (assert) {
    var origSS = window.speechSynthesis, origU = typeof SpeechSynthesisUtterance === 'undefined' ? undefined : SpeechSynthesisUtterance, G = typeof global !== 'undefined' ? global : window;
    var heard = [], fell = 0;
    window.speechSynthesis = { speaking: false, getVoices: function () { return []; }, cancel: function () {}, speak: function (u) { heard.push(u); } };
    if (!origU) G.SpeechSynthesisUtterance = function (t) { this.text = t; };
    _scriptBusy = false;
    var stop = speakScript([{ speaker: 'M', text: 'あ' }], { rate: 1, onFallback: function () { fell++; } });
    stop();
    window.speechSynthesis = origSS;
    if (!origU) delete G.SpeechSynthesisUtterance;
    assert.strictEqual(fell, 1, 'a script without clips reports the fallback');
    assert.strictEqual(heard[0] && heard[0].rate, 1, 'mock rate 1 overrides the learner rate');
    var h = function (tag, props) { return { tag: tag, props: props || {}, kids: Array.prototype.slice.call(arguments, 2) }; };
    var walk = function (n, out) { if (Array.isArray(n)) n.forEach(function (x) { walk(x, out); }); else if (n && n.props) { out.push(n); walk(n.kids, out); } return out; };
    var ex = listenQuestion(listeningFor('N5', 'task')[0], {}, { mock: true });
    var warn = function (status) {
      var kit = qzKit(h, ex, { lv: 'N5', pick: null, revealed: false, selected: null, tone: '', onPick: function () {},
        plays: 0, replyUsed: function () { return 0; }, speaking: false, play: function () {}, voiceStatus: status, showEarly: false, onEarly: function () {} });
      return walk(kit.choice().main, []).filter(function (n) { return /qz-warn/.test(n.props.className || ''); }).length;
    };
    assert.strictEqual(warn('ok'), 0, 'clips playing: no notice');
    assert.strictEqual(warn('fallback'), 1, 'fallback: notice shown');
  });

  QUnit.test('clips: every script line and spoken option carries its pre-rendered clip', function (assert) {
    if (typeof AUDIO_MANIFEST === 'undefined') { assert.ok(true, 'no manifest loaded: speech only'); return; }
    var bad = [];
    listeningFor('N5').filter(function (it) { return it.format !== 'dialogue'; }).forEach(function (it) { // dialogues have their own check (tests/dialogue.js)
      var files = AUDIO_MANIFEST.tracks[it.id], q = listenQuestion(it, {});
      if (!files) { bad.push(it.id + ': no track'); return; }
      if (q.script.length !== files.length) bad.push(it.id + ': ' + q.script.length + ' lines, ' + files.length + ' clips');
      if (!q.script.every(function (l, j) { return l.clip === files[j]; })) bad.push(it.id + ': script clips differ from manifest order');
      if (q.spokenOptions && !q.optionSpeech.every(function (o, i) { return o.clip === q.script[q.script.length - 2 * (q.optionSpeech.length - i) + 1].clip; })) bad.push(it.id + ': optionSpeech clip');
    });
    assert.deepEqual(bad, [], 'all tracks covered');
  });

  QUnit.test('clips: a custom option order moves option clips, number clips stay in their slot', function (assert) {
    if (typeof AUDIO_MANIFEST === 'undefined') { assert.ok(true, 'no manifest loaded'); return; }
    var quick = listeningFor('N5', 'quick')[0], files = AUDIO_MANIFEST.tracks[quick.id];
    var base = quick.lines.length + (quick.question ? 1 : 0);
    var s = listeningScript(quick, [2, 0, 1]);
    assert.deepEqual(s.slice(0, base).map(function (l) { return l.clip; }), files.slice(0, base), 'frame unchanged');
    assert.deepEqual([s[base].clip, s[base + 2].clip, s[base + 4].clip], [files[base], files[base + 2], files[base + 4]], 'number clips stay at their slot');
    assert.deepEqual([s[base + 1].clip, s[base + 3].clip, s[base + 5].clip], [files[base + 5], files[base + 1], files[base + 3]], 'option clips follow the option');
    assert.strictEqual(s[base + 1].text, speechText(quick.options[2]), 'and the text agrees');
    var task = listeningFor('N5', 'task')[0];
    assert.deepEqual(listeningScript(task).map(function (l) { return l.clip; }), AUDIO_MANIFEST.tracks[task.id], 'task: identity mapping');
  });

  // P0-5: options keep their authored order everywhere, so the authored keys must not favour a slot.
  QUnit.test('answer keys: no option slot over 45% per format or per mock; the key is rarely the one longest option', function (assert) {
    var len = function (s) { return furiganaParts(s).map(function (p) { return p.t; }).join('').replace(/　/g, '').length; };
    var share = function (items) {
      var n = [0, 0, 0, 0];
      items.forEach(function (it) { n[it.answer]++; });
      return Math.max.apply(null, n) / items.length;
    };
    ['task', 'point', 'utterance', 'quick'].forEach(function (f) {
      var items = listeningFor('N5', f);
      assert.ok(share(items) <= 0.45, f + ': top slot ' + Math.round(100 * share(items)) + '%');
      var longest = items.filter(function (it) {
        var l = it.options.map(len), mx = Math.max.apply(null, l);
        return l[it.answer] === mx && l.filter(function (x) { return x === mx; }).length === 1;
      }).length;
      assert.ok(longest / items.length <= 0.4, f + ': key is the single longest option in ' + longest + '/' + items.length);
    });
    catalogOf('mock').forEach(function (m) {
      var items = m.sections.listening.map(function (q) { return CATALOG.items[q.l]; });
      assert.ok(share(items) <= 0.45, m.id + ': top slot ' + Math.round(100 * share(items)) + '%');
    });
  });
});
QUnit.module('kanji reading speech', function () {
  QUnit.test('readingKana: no markers, no kanji, for every shown reading', function (assert) {
    assert.strictEqual(readingKana('た.べる'), 'たべる');
    assert.strictEqual(readingKana('-ちゅう'), 'ちゅう');
    Object.values(CATALOG.items).filter(function (i) { return i.kind === 'kanji'; }).forEach(function (k) {
      (k.kun || []).concat(k.on || [], k.extra || []).forEach(function (r) {
        assert.ok(/^[\u3040-\u30ff]+$/.test(readingKana(r)), k.char + ' ' + r + ' speaks kana only');
      });
    });
  });
});
