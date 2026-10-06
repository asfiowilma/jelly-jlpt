"use strict";

// Ticket 41: typed English answers. Normalisation, plural, typo tolerance with a reject set
// (another word's meaning is never a typo), per-item accept lists.
QUnit.module('typed English answers', function () {

  QUnit.test('normalisation: case, articles, "to", punctuation, hyphens, parentheses, accents, UK/US spelling', function (assert) {
    [
      ['Overseas', ['overseas']], ['the dog', ['dog']], ['A cat', ['cat']], ['an apple', ['apple']],
      ['to eat', ['eat']], ['eat', ['to eat']], ['bread!', ['bread']], ['see', ['to see (a person)']],
      ['well lit', ['well-lit']], ['welllit', ['well-lit']], ['cafe', ['café']], ['oclock', ["o'clock"]],
      ['colour', ['color']], ['color', ['colour']], ['memorise', ['to memorize']], ['theatre', ['theater']],
      ['grey', ['gray']], ['favourite', ['favorite']], ['neighbour', ['neighbor']], ['metre', ['meter']]
    ].forEach(function (c) { assert.ok(checkTyping(c[0], c[1]), c[0] + ' ~ ' + c[1][0]); });
    [['cat', ['dog']], ['to', ['to eat']], ['', ['eat']], ['the', ['the dog']]].forEach(function (c) {
      assert.notOk(checkTyping(c[0], c[1]), c[0] + ' !~ ' + c[1][0]);
    });
  });

  QUnit.test('plurals both ways', function (assert) {
    [['dogs', 'dog'], ['dog', 'dogs'], ['boxes', 'box'], ['cities', 'city'], ['glasses', 'glass'], ['chopstick', 'chopsticks']]
      .forEach(function (c) { assert.ok(checkTyping(c[0], [c[1]]), c[0] + ' ~ ' + c[1]); });
  });

  QUnit.test('typos: 1 edit from 5 letters, 2 from 10, swaps count once; short answers exact', function (assert) {
    [['delicous', 'delicious'], ['hosue', 'house'], ['hoose', 'house'], ['librery', 'library'],
      ['refrigirater', 'refrigerator'], ['foriegn country', 'foreign country']]
      .forEach(function (c) { assert.ok(checkTyping(c[0], [c[1]]), c[0] + ' ~ ' + c[1]); });
    [['dgo', 'dog'], ['bok', 'book'], ['hse', 'house'], ['dellisiusly', 'deliciously'], ['refrijirater', 'refrigerator']]
      .forEach(function (c) { assert.notOk(checkTyping(c[0], [c[1]]), c[0] + ' !~ ' + c[1]); });
  });

  QUnit.test('reject set: a typo or plural that is another meaning is wrong; own answers never blocked', function (assert) {
    assert.ok(checkTyping('socket', ['pocket']), 'without a reject set: a typo');
    assert.notOk(checkTyping('socket', ['pocket'], ['socket']), 'socket is another word');
    assert.ok(checkTyping('news', ['new']), 'plural of new');
    assert.notOk(checkTyping('news', ['new'], ['news', 'old']), 'news is ニュース');
    assert.ok(checkTyping('fruits', ['fruit'], ['fruit', 'vegetable']), 'own plural stays right');
    assert.ok(checkTyping('pocket', ['pocket'], ['pocket']), 'exact always right');
  });

  QUnit.test('kana answers stay exact (script matters), romaji items unaffected', function (assert) {
    assert.ok(checkTyping('にほんじん', ['にほんじん']));
    assert.notOk(checkTyping('ニホンジン', ['にほんじん']), 'katakana ≠ hiragana');
    assert.notOk(checkTyping('にほんじ', ['にほんじん']), 'no kana typo tolerance');
    assert.notOk(answerIsRight({ type: 'typing', answers: ['ka'] }, 'kas'), 'romaji: no plural rule');
  });

  QUnit.test('catalog: typed meaning accepts the accept list, rejects every near-miss that is another meaning', function (assert) {
    var ex = function (v) { return { type: 'typing', answers: meaningAnswers(v.gloss).concat(v.accept || []), item: v }; };
    var gaikoku = CATALOG.items['v:外国|がいこく'];
    assert.ok(answerIsRight(ex(gaikoku), 'overseas'), '外国: overseas (owner report)');
    assert.ok(answerIsRight(ex(gaikoku), 'Foreign countries'), '外国: plural + case');
    // every pair of meanings one typo apart (both ≥ 5 letters): typing the other one is wrong
    var vocab = catalogOf('vocab').filter(function (v) { return !v.alt; });
    var forms = vocab.map(function (v) { return { v: v, a: acceptedAnswers(ex(v)).map(normEn) }; });
    var pairs = 0, wrong = [];
    forms.forEach(function (x) {
      forms.forEach(function (y) {
        if (x === y) return;
        x.a.forEach(function (a) {
          y.a.forEach(function (b) {
            if (a === b || typoTolerance(a) === 0 || osaDistance(a, b) > typoTolerance(a)) return;
            if (x.a.some(function (o) { return o.replace(/ /g, '') === b.replace(/ /g, ''); })) return; // its own answer too
            pairs++;
            if (answerIsRight(ex(x.v), b)) wrong.push(x.v.id + ' accepts ' + b);
          });
        });
      });
    });
    assert.ok(pairs > 0, pairs + ' near-miss pairs in the catalog');
    assert.deepEqual(wrong, [], 'another meaning accepted as a typo');
  });

  QUnit.test('accept lists: short, English-only, not repeating the gloss', function (assert) {
    var n = 0, items = 0;
    catalogOf('vocab').concat(catalogOf('kanji')).forEach(function (it) {
      if (!it.accept) return;
      items++;
      var own = meaningAnswers(it.gloss || it.meaning).map(normEn);
      assert.ok(Array.isArray(it.accept) && it.accept.length >= 1 && it.accept.length <= 5, it.id + ': 1-5 entries');
      it.accept.forEach(function (a) {
        n++;
        if (JA_CHARS.test(a) || !normEn(a)) assert.ok(false, it.id + ': "' + a + '" is not English');
        if (own.indexOf(normEn(a)) >= 0) assert.ok(false, it.id + ': "' + a + '" repeats the gloss');
      });
    });
    assert.ok(items > 300 && n > 600, items + ' items, ' + n + ' accept entries');
  });

  QUnit.test('acceptedAnswers: one per meaning, in order', function (assert) {
    assert.deepEqual(acceptedAnswers({ answers: meaningAnswers(['to meet', 'to see (a person)']).concat(['to encounter']) }),
      ['to meet', 'to see (a person)', 'to encounter']);
    assert.deepEqual(acceptedAnswers({ answers: ['にほんじん', 'にっぽんじん'] }), ['にほんじん', 'にっぽんじん']);
  });

  QUnit.test('P1-12 no accept entry is the primary gloss of another taught word of the same kind', function (assert) {
    // same pos family only: 降る "to rain" vs 雨 "rain" names the action, not the noun
    var taught = {};
    allUnits().forEach(function (u) { Object.assign(taught, taughtIds(u)); });
    var vs = catalogOf('vocab').filter(function (v) { return taught[v.id] && !v.alt; }), primary = {};
    vs.forEach(function (v) { (primary[normEn(v.gloss[0])] = primary[normEn(v.gloss[0])] || []).push(v); });
    vs.forEach(function (v) {
      (v.accept || []).forEach(function (a) {
        (primary[normEn(a)] || []).forEach(function (x) {
          if (x !== v && x.word !== v.word && posFamily(x.pos) === posFamily(v.pos)) assert.ok(false, v.id + ' accepts "' + a + '", the meaning of ' + x.id);
        });
      });
    });
    ['v:兄|あに', 'v:弟|おとうと', 'v:姉|あね', 'v:妹|いもうと'].forEach(function (id) {
      var acc = (CATALOG.items[id].accept || []).map(normEn);
      assert.ok(acc.indexOf('brother') < 0 && acc.indexOf('sister') < 0, id + ': bare brother / sister never tests older vs younger');
    });
  });
});
