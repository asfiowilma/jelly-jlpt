"use strict";

// Difficulty model (ticket 35, Q28-Q34): quiz gate, counts, recall share,
// re-queue, quiz furigana, new-card cap + pending queue.
QUnit.module('quiz difficulty model', {
  beforeEach: function () {
    this._origSpeech = window.speechSynthesis;
    try { delete window.speechSynthesis; } catch (e) { window.speechSynthesis = undefined; }
    this.units = buildUnits(PLAN, CATALOG);
  },
  afterEach: function () {
    if (this._origSpeech !== undefined) window.speechSynthesis = this._origSpeech;
  }
}, function () {
  var lessonAt = function (units, level) {
    var u = units.filter(function (x) { return x.kind === 'lesson'; })[0];
    return Object.assign({}, u, { level: level });
  };

  QUnit.test('Q28 pass marks: kana 85% (the reading mark, ticket 44), lessons and reviews 80%', function (assert) {
    assert.strictEqual(passMark('kana'), 0.85);
    assert.strictEqual(passMark('lesson'), 0.8);
    assert.strictEqual(passMark('review'), 0.8);
    assert.ok(quizPassed(17, 20, 'kana'));
    assert.notOk(quizPassed(8, 10, 'kana'));
    assert.ok(quizPassed(8, 10, 'lesson'), '80% exactly passes');
    assert.notOk(quizPassed(11, 14, 'lesson'), '78.6% fails');
    assert.notOk(quizPassed(0, 0, 'lesson'), 'empty quiz never passes');
  });

  QUnit.test('Q29 counts (maximums since ticket 43): kana 10, N5 12, N4 14, N3+ 16, review 20; raised to cover every item, max 30', function (assert) {
    assert.strictEqual(quizLength({ kind: 'kana', level: 'N5' }, 5), 10);
    assert.strictEqual(quizLength({ kind: 'kana', level: 'N5' }, 21), 21);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N5' }, 3), 12);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N5' }, 14), 14);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N4' }, 3), 14);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N3' }, 3), 16);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N1' }, 3), 16);
    assert.strictEqual(quizLength({ kind: 'lesson', level: 'N5' }, 50), QUIZ_MAX_QUESTIONS);
    assert.strictEqual(quizLength({ kind: 'review', level: 'N5' }, 70), 20, 'review samples, never raised');
  });

  QUnit.test('Q29 every shipped kana/lesson quiz has its length and asks every taught item (a kana: in a word or alone)', function (assert) {
    this.units.filter(function (u) { return u.kind === 'kana' || u.kind === 'lesson'; }).forEach(function (u) {
      var items = quizItems(u);
      var exs = buildExercises(u);
      assert.strictEqual(exs.length, quizSize(u, items), u.id + ' length');
      if (u.kind === 'lesson') assert.strictEqual(quizSize(u, items), Math.min(quizLength(u, items.length), quizCapacity(items.length)), u.id + ' lesson size');
      var asked = {};
      exs.forEach(function (e) {
        asked[e.itemId] = true;
        if (e.part === 'read' && e.item.word) kanaSyllables(e.item.word).forEach(function (c) { asked['c:' + c] = true; });
      });
      var missing = items.filter(function (it) { return !asked[it.id]; }).map(function (it) { return it.id; });
      if (missing.length) assert.ok(false, u.id + ' never asks ' + missing.join(' '));
    });
  });

  QUnit.test('quizCapacity (ticket 43): few items → shorter quiz, min 8, a second ask only to reach it', function (assert) {
    assert.strictEqual(quizCapacity(14), 14);
    assert.strictEqual(quizCapacity(8), 8);
    assert.strictEqual(quizCapacity(5), 8);
    assert.strictEqual(quizCapacity(3), 6, 'each item at most twice');
    var lesson = { kind: 'lesson', level: 'N5' };
    assert.strictEqual(quizSize(lesson, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) { return { id: 'x' + i, kind: 'vocab' }; })), 9, '9 items: 9, not 12');
  });

  QUnit.test('Q29 review quiz: 20 questions drawn from the lessons since the previous review', function (assert) {
    var units = this.units;
    var rev = units.filter(function (u) { return u.kind === 'review' && u.index > 30; })[0];
    var lastRev = units.filter(function (u) { return u.kind === 'review' && u.index < rev.index; }).pop();
    var prev = units.filter(function (u) { return u.index < rev.index && u.index > lastRev.index && (u.kind === 'lesson' || u.kind === 'kana'); });
    var allowed = {};
    prev.forEach(function (u) { quizItems(u).forEach(function (it) { allowed[it.id] = true; }); });
    var exs = buildExercises(rev);
    assert.strictEqual(exs.length, 20);
    var extra = (rev.passages || []).concat(rev.listening || []);
    assert.ok(exs.every(function (e) { return allowed[e.itemId] || ((e.type === 'reading' || e.type === 'listen_dialog') && extra.indexOf(e.itemId) >= 0); }), 'all items from the lessons since the previous review (+ its passage and listening item)');
    assert.strictEqual(exs.slice(-2).map(function (e) { return e.type; }).join(), 'reading,listen_dialog', 'reading then listening come last');
  });

  QUnit.test('kana review covers every unit of its script, from the first', function (assert) {
    var units = this.units;
    var firstKanaReview = units.filter(function (u) { return u.kind === 'review'; })[0];
    var ids = {};
    quizItems(firstKanaReview).forEach(function (it) { ids[it.id] = true; });
    var first = units.filter(function (u) { return u.kind === 'kana'; })[0];
    quizItems(first).forEach(function (it) { assert.ok(ids[it.id], firstKanaReview.id + ' covers ' + it.id + ' from ' + first.id); });
  });

  QUnit.test('Q30 at least 40% recall questions in every shipped quiz, and at N4/N3/N1', function (assert) {
    var units = this.units.filter(function (u) { return u.kind !== 'prep' && u.kind !== 'mock'; }); // prep drills are exam-format MC (ticket 18)
    var pool = units.concat(['N4', 'N3', 'N1'].map(function (lv) { return lessonAt(units, lv); }));
    pool.forEach(function (u) {
      var exs = buildExercises(u);
      var recall = exs.filter(function (e) { return e.recall; }).length;
      if (recall < Math.ceil(exs.length * RECALL_SHARE)) assert.ok(false, u.id + '@' + u.level + ' recall ' + recall + '/' + exs.length);
      exs.forEach(function (e) {
        if (e.recall !== !e.options) assert.ok(false, u.id + ' ' + e.form + ': recall = typed answer, MC = options');
      });
    });
    assert.ok(true);
  });

  QUnit.test('Q30 recall forms: kana reading of a word (kana only, IME hint), meaning, EN→JP', function (assert) {
    var u = this.units.filter(function (x) { return x.kind === 'lesson' && x.vocab.some(function (v) { return hasKanji(v.word); }); })[0];
    var seen = {};
    for (var i = 0; i < 30; i++) buildExercises(u).forEach(function (e) { seen[e.form] = e; });
    var rd = seen.readingType;
    assert.ok(rd, 'reading typing');
    var v = CATALOG.items[rd.itemId];
    assert.ok(checkTyping(v.reading, rd.answers), 'accepts the kana reading');
    assert.notOk(checkTyping(v.word, rd.answers), 'the kanji spelling is not a reading');
    assert.ok(rd.hint && /IME/.test(rd.hint), 'IME hint');
    assert.ok(seen.meaningType, 'meaning typing');
    var en = seen.enToJp;
    assert.ok(en, 'EN→JP typing');
    var w = CATALOG.items[en.itemId];
    assert.ok(checkTyping(w.reading, en.answers) && checkTyping(w.word, en.answers), 'accepts kana or the written word');
  });

  QUnit.test('Q30 grammar sentence gap: example with the pattern blanked, confusable options, one right answer', function (assert) {
    var kara = CATALOG.items['g:kara'];
    var u = this.units.filter(function (x) { return x.grammar.indexOf(kara) >= 0 && x.kind === 'lesson'; })[0];
    var gap = null;
    for (var i = 0; i < 40 && !gap; i++) gap = buildExercises(u).filter(function (e) { return e.form === 'gap'; })[0] || null;
    assert.ok(gap, 'gap question for から');
    assert.strictEqual(gap.options[gap.correct], 'から');
    assert.ok(gap.options.indexOf('ので') < 0, 'ので means the same: never a distractor for から');
    var text = gap.parts.map(function (p) { return p.t; }).join('');
    assert.ok(text.indexOf(GAP_BLANK) >= 0 && text.indexOf('から') < 0, text);
    assert.ok(gap.note, 'English translation disambiguates');
  });

  QUnit.test('gapSurfaces / gapParts: surface forms from the pattern, blank in furigana parts', function (assert) {
    assert.deepEqual(gapSurfaces(CATALOG.items['g:ni-ikimasu']), ['に', 'へ']);
    assert.deepEqual(gapSurfaces(CATALOG.items['g:te-mo-ii']), ['てもいい']);
    assert.deepEqual(gapSurfaces(CATALOG.items['g:wa-desu']), [], 'X は Y です has no single surface');
    var parts = gapParts(furiganaParts('[本|ほん]を[読|よ]むのが[好|す]きです。'), 'のが好き');
    assert.deepEqual(parts.map(function (p) { return p.t; }).join(''), '本を読む' + GAP_BLANK + 'です。');
    assert.strictEqual(parts[0].r, 'ほん', 'furigana before the gap kept');
    assert.strictEqual(gapParts(furiganaParts('トムです。'), 'で'), null, 'で inside です is not a particle');
    assert.strictEqual(gapParts(furiganaParts('トムです。'), 'から'), null);
  });

  QUnit.test('every gap question in the N5 plan has exactly one surface that fits', function (assert) {
    var n = 0;
    this.units.filter(function (u) { return u.kind === 'lesson'; }).forEach(function (u) {
      for (var r = 0; r < 4; r++) buildExercises(u).filter(function (e) { return e.form === 'gap'; }).forEach(function (e) {
        n++;
        var g = CATALOG.items[e.itemId];
        e.options.forEach(function (o, i) {
          if (i !== e.correct && gapSurfaces(g).indexOf(o) >= 0) assert.ok(false, g.id + ' distractor ' + o + ' is a form of the answer');
        });
        if (new Set(e.options).size !== e.options.length) assert.ok(false, g.id + ' duplicate options');
      });
    });
    assert.ok(n > 10, n + ' gap questions checked');
  });

  QUnit.test('Q31 requeueExercise: same item, a different form when one exists, marked requeue', function (assert) {
    var u = this.units.filter(function (x) { return x.kind === 'lesson'; })[0];
    buildExercises(u).forEach(function (e) {
      var r = requeueExercise(u, e);
      assert.ok(r, e.form + ' requeued');
      assert.strictEqual(r.itemId, e.itemId);
      assert.ok(r.requeue, 'marked');
      var other = formsFor(e.item, quizContext(u)).some(function (f) { return f.name !== e.form && f.make(); });
      if (r.form === e.form && other) assert.ok(false, e.form + ' repeated though another form exists');
    });
  });

  QUnit.test('Q31 scoreQuiz: first attempts only; missed = every item answered wrong', function (assert) {
    var exs = [{ itemId: 'a' }, { itemId: 'b' }, { itemId: 'c' }, { itemId: 'd' }, { itemId: 'e' }, { itemId: 'b', requeue: true }];
    var s = scoreQuiz('lesson', exs, [true, false, true, true, true, true]);
    assert.deepEqual([s.right, s.total, s.passed, s.need], [4, 5, true, 0.8]);
    assert.deepEqual(s.missed, ['b'], 'right on retry still flagged');
    s = scoreQuiz('kana', exs, [true, false, true, true, true, true]);
    assert.notOk(s.passed, '80% fails kana');
  });

  QUnit.test('Q31 answerIsRight scores each exercise type', function (assert) {
    var mc = { options: ['a', 'b'], correct: 1 };
    assert.ok(answerIsRight(mc, 1));
    assert.notOk(answerIsRight(mc, 0));
    var ty = { type: 'typing', answers: ['ねこ'] };
    assert.ok(answerIsRight(ty, 'ねこ'));
    assert.notOk(answerIsRight(ty, 'いぬ'));
    var pm = { type: 'pair_match', items: ['y', 'x'], options: ['X', 'Y'], pairs: [['x', 'X'], ['y', 'Y']] };
    assert.ok(answerIsRight(pm, [1, 0]));
    assert.notOk(answerIsRight(pm, [0, 1]));
    assert.notOk(answerIsRight(pm, [1]), 'unfinished pairs are wrong');
    var ro = { type: 'reorder', items: ['b', 'a'], answer: 'ab' };
    assert.ok(answerIsRight(ro, [1, 0]));
    assert.notOk(answerIsRight(ro, [0, 1]));
  });

  QUnit.test('Q31 srsFlagMissed: due now, lower ease (floor 1.3), unknown ids ignored, no mutation', function (assert) {
    var now = 1000000;
    var c = { id: 'v:x', due: now + 9e8, ease: 2.5, interval: 10, reps: 3 };
    var low = { id: 'k:y', due: now - 5, ease: 1.35, interval: 1, reps: 1 };
    var cards = { 'v:x': c, 'k:y': low };
    assert.ok(srsFlagMissed(cards, ['v:x', 'k:y', 'g:none'], now));
    assert.strictEqual(cards['v:x'].due, now);
    assert.strictEqual(cards['v:x'].ease, 2.3);
    assert.strictEqual(cards['k:y'].due, now - 5, 'already due stays');
    assert.strictEqual(cards['k:y'].ease, 1.3);
    assert.strictEqual(c.due, now + 9e8, 'original card object untouched');
    assert.notOk(srsFlagMissed(cards, ['g:none'], now));
  });

  QUnit.test('Q33 quizFurigana: shown on untaught kanji, hidden on taught, never on the tested kanji', function (assert) {
    var taught = { '日': true };
    var parts = [{ t: '毎日', r: 'まいにち' }, { t: 'を' }, { t: '日', r: 'ひ' }, { t: '本', r: 'ほん' }];
    var out = quizFurigana(parts, taught, '');
    assert.deepEqual(out.map(function (p) { return p.r || null; }), ['まいにち', null, null, 'ほん'], '毎 untaught → ruby; 日 taught → none');
    out = quizFurigana(parts, taught, '本毎');
    assert.deepEqual(out.map(function (p) { return p.r || null; }), [null, null, null, null], 'tested kanji never get ruby');
  });

  QUnit.test('Q33 quiz questions: no reading on the tested word, ruby only for untaught kanji', function (assert) {
    var u = this.units.filter(function (x) { return x.kind === 'lesson' && x.vocab.some(function (v) { return hasKanji(v.word); }); })[0];
    var taughtK = quizContext(u).taughtKanji;
    for (var i = 0; i < 10; i++) buildExercises(u).forEach(function (e) {
      if (['readingMc', 'readingType', 'kanjiReadMc', 'kanjiReadType', 'kanjiMeanMc', 'kanjiMeanType'].indexOf(e.form) >= 0) {
        if (e.parts && e.parts.some(function (p) { return p.r; })) assert.ok(false, e.form + ' shows the tested reading');
      }
      (e.parts || []).forEach(function (p) {
        if (p.r && Array.from(p.t).every(function (ch) { return !hasKanji(ch) || taughtK[ch]; })) assert.ok(false, 'ruby on taught ' + p.t);
      });
    });
    assert.ok(true);
  });

  QUnit.test('Q34 admitCards: pending first, up to room, rest pending; existing cards untouched', function (assert) {
    var it = function (id) { return { id: id, kind: 'grammar', pattern: id, meaning: id }; };
    var items = [it('g:a'), it('g:b'), it('g:c')];
    var cards = { 'g:c': { id: 'g:c', ease: 2 } };
    ['g:old', 'g:a', 'g:b'].forEach(function (id) { CATALOG.items[id] = it(id); });
    try {
      var r = admitCards(items, cards, ['g:old'], 2, 5000);
      assert.deepEqual(Object.keys(cards).sort(), ['g:a', 'g:c', 'g:old']);
      assert.deepEqual(r, { pending: ['g:b'], added: 2 });
      assert.strictEqual(cards['g:a'].addedAt, 5000);
      assert.strictEqual(cards['g:a'].due, 5000);
      assert.strictEqual(cards['g:c'].ease, 2);
      r = admitCards([], cards, r.pending, 0, 6000);
      assert.deepEqual(r, { pending: ['g:b'], added: 0 }, 'no room: nothing released');
      r = admitCards([], cards, ['g:b', 'g:gone'], 5, 6000);
      assert.deepEqual(r, { pending: [], added: 1 }, 'ids no longer in the catalog are dropped');
    } finally { ['g:old', 'g:a', 'g:b'].forEach(function (id) { delete CATALOG.items[id]; }); }
  });

  QUnit.test('Q34 cardsAddedToday + dailyCardCap', function (assert) {
    var now = new Date(2026, 4, 2, 15).getTime();
    var cards = {
      a: { addedAt: new Date(2026, 4, 2, 1).getTime() }, b: { addedAt: now }, c: { addedAt: new Date(2026, 4, 1, 23).getTime() }, d: {}
    };
    assert.strictEqual(cardsAddedToday(cards, now), 2);
    var units = [{ kana: [1, 2, 3] }, { vocab: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, { vocab: [1] }];
    assert.strictEqual(dailyCardCap(1, units, 1), 12);
    assert.strictEqual(dailyCardCap(2, units, 1), 13);
    assert.strictEqual(dailyCardCap(1, units, 0), DAILY_CARD_FLOOR, 'floor');
    assert.strictEqual(dailyCardCap(1, units, 3), DAILY_CARD_FLOOR, 'end of plan');
  });
});
