"use strict";

// Store (store.js) + its pure helpers in lib.js. Also run headlessly by
// .claude/hooks/run-tests.js through its QUnit shim (same file, no copy).
QUnit.module('store', function () {
  function fakeLs(init) {
    var d = Object.assign({}, init);
    return {
      data: d,
      get: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null; },
      set: function (k, v) { d[k] = String(v); }
    };
  }
  function storeOn(ls, backend) {
    return createStore({ ls: ls, openBackend: function () { return Promise.resolve(backend); } });
  }
  var CARD = { id: 'v:家族|かぞく', type: 'vocab', front: '家族', back: 'family', reading: 'かぞく', interval: 1, ease: 2.5, due: 1, reps: 0 };

  QUnit.test('store DB name is bumped so old day-keyed dev data never collides', function (assert) {
    assert.strictEqual(STORE_DB_NAME, 'jelly');
  });

  QUnit.test('pickStoreWinner: unit/prefs last write wins, ties → higher deviceId', function (assert) {
    var a = { _id: 'unit:n5.u001', done: true, updatedAt: 200, deviceId: 'a' };
    var b = { _id: 'unit:n5.u001', done: false, updatedAt: 100, deviceId: 'z' };
    assert.strictEqual(pickStoreWinner(a, b), a);
    assert.strictEqual(pickStoreWinner(b, a), a, 'order-independent');
    var p1 = { _id: 'prefs:learning', currentUnit: 'n5.u001', updatedAt: 1, deviceId: 'a' };
    var p2 = { _id: 'prefs:learning', currentUnit: 'n5.u002', updatedAt: 1, deviceId: 'b' };
    assert.strictEqual(pickStoreWinner(p1, p2), p2, 'tie → higher deviceId');
    assert.strictEqual(pickStoreWinner(p2, p1), p2);
  });

  QUnit.test('pickStoreWinner: card latest review wins over a newer write', function (assert) {
    var reviewed = { _id: 'card:k:人', reps: 3, lastReviewedAt: 500, updatedAt: 500, deviceId: 'a' };
    var stale = { _id: 'card:k:人', reps: 0, lastReviewedAt: 0, updatedAt: 900, deviceId: 'b' };
    assert.strictEqual(pickStoreWinner(reviewed, stale), reviewed);
    assert.strictEqual(pickStoreWinner(stale, reviewed), reviewed);
    var newer = Object.assign({}, stale, { lastReviewedAt: 0, updatedAt: 950 });
    assert.strictEqual(pickStoreWinner(stale, newer), newer, 'same review time → updatedAt');
  });

  QUnit.test('fresh store: empty snapshot with defaults (pace 1, no current unit)', function (assert) {
    var s = storeOn(fakeLs(), memoryBackend());
    return s.init().then(function (snap) {
      assert.deepEqual(snap, { completed: [], srsCards: {}, currentUnit: null, pace: 1, examDate: null, furiganaPref: null, uiLang: 'en', kanjiView: 'rows', pendingCards: [], mocks: [], unlocked: {} });
    });
  });

  QUnit.test('old localStorage keys are ignored (no migration, map Q5)', function (assert) {
    var s = storeOn(fakeLs({ n5_completed: '[1,2]', n5_day: '3' }), memoryBackend());
    return s.init().then(function (snap) {
      assert.deepEqual(snap.completed, []);
      assert.strictEqual(s.docs().length, 0);
    });
  });

  QUnit.test('in-memory backend round-trip: unit/card/prefs docs visible to the next session', function (assert) {
    var backend = memoryBackend();
    var ls = fakeLs();
    var s1 = storeOn(ls, backend);
    return s1.init().then(function () {
      s1.putUnit('n5.u002', true);
      s1.putCards({ 'v:家族|かぞく': CARD });
      s1.putPrefs({ currentUnit: 'n5.u002', furigana: true, uiLang: 'auto', kanjiView: 'focus' });
      return s1.flush();
    }).then(function () {
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(snap.completed, ['n5.u002']);
      assert.deepEqual(snap.srsCards['v:家族|かぞく'], CARD);
      assert.deepEqual([snap.currentUnit, snap.pace, snap.furiganaPref, snap.uiLang, snap.kanjiView], ['n5.u002', 1, 'true', 'auto', 'focus']);
      return backend.loadAll();
    }).then(function (docs) {
      var ids = docs.map(function (d) { return d._id; }).sort();
      assert.deepEqual(ids, ['card:v:家族|かぞく', 'prefs:learning', 'unit:n5.u002']);
      var u = docs.filter(function (d) { return d._id === 'unit:n5.u002'; })[0];
      assert.strictEqual(typeof u.completedAt, 'number', 'completedAt stamped');
      assert.ok(docs.every(function (d) { return typeof d.updatedAt === 'number' && d.deviceId === ls.get('jlpt_device_id'); }), 'updatedAt + deviceId on every doc');
    });
  });

  QUnit.test('putPrefs/putUnit skip unchanged values (no updatedAt bump)', function (assert) {
    var s = storeOn(fakeLs(), memoryBackend());
    return s.init().then(function () {
      s.putPrefs({ currentUnit: null, pace: 1, examDate: null, uiLang: 'en', furigana: null, kanjiView: 'rows' });
      assert.strictEqual(s.docs().length, 0, 'defaults are not written');
      s.putUnit('n5.u001', true);
      var first = s.docs()[0];
      s.putUnit('n5.u001', true);
      assert.strictEqual(s.docs()[0], first, 'same doc object → no rewrite');
      s.putUnit('n5.u001', false);
      assert.deepEqual([s.docs()[0].done, s.docs()[0].completedAt], [false, null]);
    });
  });

  QUnit.test('un-marking a unit keeps its SRS cards (decision 10)', function (assert) {
    var s = storeOn(fakeLs(), memoryBackend());
    return s.init().then(function () {
      var unit = buildUnits(PLAN, CATALOG)[0];
      var cards = {};
      srsAddCards(unit, cards);
      s.putUnit(unit.id, true);
      s.putCards(cards);
      s.putUnit(unit.id, false);
      var snap = s.snapshot();
      assert.deepEqual(snap.completed, [], 'unit not done');
      assert.deepEqual(Object.keys(snap.srsCards).sort(), Object.keys(cards).sort(), 'cards kept');
      assert.ok(Object.keys(cards).length > 0, 'unit has cards');
    });
  });

  QUnit.test('export v3 → validate → import round-trips docs; device prefs ride along', function (assert) {
    var ls = fakeLs({ jlpt_palette: 'shu', jlpt_theme: 'light', jlpt_tts_rate: '1', n5_srs: '{}' });
    var s = storeOn(ls, memoryBackend());
    return s.init().then(function () {
      s.putUnit('n5.u001', true);
      s.putCards({ 'v:家族|かぞく': CARD });
      s.putPrefs({ currentUnit: 'n5.u001' });
      var docs = s.docs().map(function (d) { return Object.assign({ _rev: '1-x' }, d); });
      var file = exportProgress(docs, ls.get);
      assert.strictEqual(file.version, 3);
      assert.deepEqual(file.device, { jlpt_palette: 'shu', jlpt_theme: 'light', jlpt_tts_rate: '1' });
      assert.ok(file.docs.every(function (d) { return d._rev === undefined; }), '_rev stripped');
      var parsed = JSON.parse(JSON.stringify(file));
      assert.ok(validateProgressData(parsed).valid, validateProgressData(parsed).error);
      var imp = progressFileToDocs(parsed);
      assert.deepEqual(docsToSnapshot(imp.docs), docsToSnapshot(docs));
      assert.deepEqual(imp.device, file.device);
    });
  });

  QUnit.test('replaceAll: import overwrites (removes docs not in the file)', function (assert) {
    var backend = memoryBackend();
    var ls = fakeLs();
    var s = storeOn(ls, backend);
    return s.init().then(function () {
      s.putUnit('n5.u003', true);
      return s.replaceAll([{ _id: 'unit:n5.u001', done: true, completedAt: 1, updatedAt: 1, deviceId: 'old' }]);
    }).then(function () {
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(snap.completed, ['n5.u001']);
    });
  });

  QUnit.test('removeCards: deletes card docs (import undo)', function (assert) {
    var backend = memoryBackend();
    var ls = fakeLs();
    var s = storeOn(ls, backend);
    var other = Object.assign({}, CARD, { id: 'k:人' });
    return s.init().then(function () {
      s.putCards({ 'v:家族|かぞく': CARD, 'k:人': other });
      return s.removeCards(['v:家族|かぞく', 'k:missing']);
    }).then(function () {
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(Object.keys(snap.srsCards), ['k:人']);
    });
  });

  // Browser only: real PouchDB conflict resolution (the Node runner has no PouchDB).
  QUnit.test('pouchBackend.loadAll resolves conflicts by merge rules, removes losers', function (assert) {
    if (typeof PouchDB === 'undefined') { assert.ok(true, 'PouchDB not loaded — skipped'); return; }
    var db = new PouchDB('jelly-test-' + Date.now());
    // Two leaf revs: CouchDB's winner is "1-b" (higher hash), but "1-a" is the newer write.
    return db.bulkDocs([
      { _id: 'unit:n5.u003', _rev: '1-a', done: true, updatedAt: 200, deviceId: 'a' },
      { _id: 'unit:n5.u003', _rev: '1-b', done: false, updatedAt: 100, deviceId: 'b' }
    ], { new_edits: false }).then(function () {
      return db.get('unit:n5.u003', { conflicts: true });
    }).then(function (before) {
      assert.strictEqual(before._conflicts.length, 1, 'conflict exists');
      return pouchBackend(db).loadAll();
    }).then(function (docs) {
      assert.strictEqual(docs.length, 1);
      assert.strictEqual(docs[0].done, true, 'newer write wins');
      return db.get('unit:n5.u003', { conflicts: true });
    }).then(function (after) {
      assert.strictEqual(after.done, true);
      assert.notOk(after._conflicts && after._conflicts.length, 'losers removed');
    }).then(function () { return db.destroy(); }, function (e) { return db.destroy().then(function () { throw e; }); });
  });
});
