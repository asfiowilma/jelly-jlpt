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
});
