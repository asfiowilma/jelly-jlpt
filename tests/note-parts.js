QUnit.module('noteParts', function () {
  QUnit.test('first sentence is the head, the rest of the paragraph is split into lines', function (assert) {
    assert.deepEqual(noteParts('Consonant + vowel: k + a = か ka. The さ row has one irregular sound: し is shi, not si. Look-alikes: さ and ち are mirror images.'),
      { head: 'Consonant + vowel: k + a = か ka.', body: ['The さ row has one irregular sound: し is shi, not si.', 'Look-alikes: さ and ち are mirror images.'] });
  });
  QUnit.test('a one-sentence note has no body', function (assert) {
    assert.deepEqual(noteParts('ハ row + ゛ gives b, + ゜ gives p: ハ → バ → パ.'), { head: 'ハ row + ゛ gives b, + ゜ gives p: ハ → バ → パ.', body: [] });
  });
  QUnit.test('later paragraphs stay whole; e.g. / i.e. do not end a sentence', function (assert) {
    var n = noteParts('Plan your time, e.g. 20 minutes per part. Start with vocabulary.\nSecond paragraph. Still one line.');
    assert.equal(n.head, 'Plan your time, e.g. 20 minutes per part.');
    assert.deepEqual(n.body, ['Start with vocabulary.', 'Second paragraph. Still one line.']);
  });
  QUnit.test('empty or missing notes', function (assert) {
    assert.deepEqual(noteParts(''), { head: '', body: [] });
    assert.deepEqual(noteParts(null), { head: '', body: [] });
  });
  QUnit.test('every shipped unit note yields a head', function (assert) {
    buildUnits(PLAN, CATALOG).filter(function (u) { return u.notes; }).forEach(function (u) {
      assert.ok(noteParts(u.notes).head.length > 0, u.id);
    });
  });
});
