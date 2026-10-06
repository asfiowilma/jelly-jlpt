"use strict";

// No question gives its answer away: the text shown before answering (prompt, question,
// furigana parts (shown in place of question when present), English note, hint, placeholder)
// never contains the answer. Independent oracle for the leak guard in lib.js (answerLeaks). Seeded Math.random so a failure reproduces.
QUnit.module('quiz answer leaks', function () {
  var JA = /[぀-ヿ㐀-鿿]/;
  // Sentence-body types: the rest of the sentence may repeat a particle or chunk; only the
  // English around it counts. Listening shows nothing but its prompt before answering.
  var BODY_OK = { gap: true, order: true, bunshou: true, iikae: true, reading: true };
  function partsText(ps) { return (ps || []).map(function (p) { return p.t + ' ' + (p.r || ''); }).join(' '); }
  function leaks(ex) {
    if (ex.type === 'pair_match') return null;
    var answers = ex.type === 'reorder' ? [ex.answer] : ex.answers ? ex.answers.slice() : [ex.options[ex.correct]]; // Remix: the built line
    var it = ex.item;
    // a Japanese word answer: its reading gives it away too (表記 shows the reading on purpose)
    if (it && it.kind === 'vocab' && ex.type !== 'hyouki' && answers.indexOf(it.word) >= 0) answers.push(it.reading);
    var en = [ex.prompt, ex.note, ex.hint, ex.placeholder].join(' \n ');
    var body = ex.type === 'listen_dialog' || BODY_OK[ex.type] ? '' : [ex.parts ? partsText(ex.parts) : ex.question, (ex.items || []).join(' ')].join(' \n ');
    for (var i = 0; i < answers.length; i++) {
      var a = answers[i];
      if (JA.test(a)) {
        if (en.indexOf(a) >= 0 || (a.length > 1 && body.indexOf(a) >= 0)) return a;
      } else {
        var re = new RegExp('(^|[^a-z])' + a.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^a-z])');
        if (re.test(body.toLowerCase())) return a; // prompt/hint are fixed English instructions
      }
    }
    if (ex.options && ex.answers === undefined) {
      var ans = ex.options[ex.correct];
      if (ex.options.some(function (o, j) { return j !== ex.correct && (o === ans || kataToHira(o) === kataToHira(ans)); })) return 'duplicate option ' + ans;
    }
    return null;
  }
  function seeded(seed) {
    return function () { // mulberry32
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  QUnit.test('20 builds of every N5 unit: no question shows its answer', function (assert) {
    var rnd = Math.random, found = {}, n = 0, examples = {};
    Math.random = seeded(5);
    try {
      buildUnits(PLAN, CATALOG).filter(function (u) { return u.level === 'N5'; }).forEach(function (u) {
        for (var r = 0; r < 20; r++) buildExercises(u).forEach(function (ex) {
          n++;
          var l = leaks(ex);
          if (!l) return;
          var key = ex.type + '/' + ex.form;
          found[key] = (found[key] || 0) + 1;
          examples[key] = examples[key] || u.id + ': "' + ex.prompt + '" ' + (ex.question || '') + ' → ' + l;
        });
      });
    } finally { Math.random = rnd; }
    assert.ok(n > 1000, n + ' questions built');
    assert.deepEqual(found, {}, 'leaks by type/form: ' + JSON.stringify(examples));
  });

  QUnit.test('the oracle catches a leak (negative)', function (assert) {
    var v = CATALOG.items['v:あなた|あなた'];
    assert.ok(leaks({ type: 'mc', prompt: 'Which word means "you (あなた)"?', question: '', options: ['あなた', 'はい'], correct: 0, item: v }), 'answer in prompt');
    assert.ok(leaks({ type: 'mc', prompt: 'What does this word mean?', question: 'ぼく', options: ['I', 'I'], correct: 0 }), 'duplicate option');
    assert.notOk(leaks({ type: 'mc', prompt: 'Which word means "you"?', question: '', options: ['あなた', 'はい'], correct: 0, item: v }), 'clean');
  });
});
