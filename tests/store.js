"use strict";

// Store (store.js) + its pure helpers in lib.js. Mirrored in .claude/hooks/run-tests.js.
QUnit.module('store', function () {
  function fakeLs(init) {
    var d = Object.assign({}, init);
    return {
      data: d,
      get: function (k) { return Object.prototype.hasOwnProperty.call(d, k) ? d[k] : null; },
      set: function (k, v) { d[k] = String(v); }
    };
  }
  // A memory backend that claims to persist, so migration sets its flag.
  function persistentBackend() { var b = memoryBackend(); b.name = 'fake-persistent'; return b; }
  function storeOn(ls, backend) {
    return createStore({ ls: ls, openBackend: function () { return Promise.resolve(backend); } });
  }
  var LEGACY = {
    n5_completed: '[1,2]',
    n5_srs: JSON.stringify({
      v_1_0: { id: 'v_1_0', type: 'vocab', front: 'いえ', back: 'house', reading: 'いえ', interval: 6, ease: 2.5, due: 10 * 86400000, reps: 2 },
      c_2_0: { id: 'c_2_0', type: 'char', front: 'あ', back: 'a', interval: 1, ease: 2.5, due: 5, reps: 0 }
    }),
    n5_day: '3', n5_furigana: 'false', jlpt_ui_lang: 'ja',
    jlpt_palette: 'shu', jlpt_theme: 'light', jlpt_tts_rate: '1'
  };

  QUnit.test('pickStoreWinner: day/prefs last write wins, ties → higher deviceId', function (assert) {
    var a = { _id: 'day:1', done: true, updatedAt: 200, deviceId: 'a' };
    var b = { _id: 'day:1', done: false, updatedAt: 100, deviceId: 'z' };
    assert.strictEqual(pickStoreWinner(a, b), a);
    assert.strictEqual(pickStoreWinner(b, a), a, 'order-independent');
    var p1 = { _id: 'prefs:learning', currentDay: 5, updatedAt: 1, deviceId: 'a' };
    var p2 = { _id: 'prefs:learning', currentDay: 9, updatedAt: 1, deviceId: 'b' };
    assert.strictEqual(pickStoreWinner(p1, p2), p2, 'tie → higher deviceId');
    assert.strictEqual(pickStoreWinner(p2, p1), p2);
  });

  QUnit.test('pickStoreWinner: card latest review wins over a newer write', function (assert) {
    var reviewed = { _id: 'card:v_1_0', reps: 3, lastReviewedAt: 500, updatedAt: 500, deviceId: 'a' };
    var stale = { _id: 'card:v_1_0', reps: 0, lastReviewedAt: 0, updatedAt: 900, deviceId: 'b' };
    assert.strictEqual(pickStoreWinner(reviewed, stale), reviewed);
    assert.strictEqual(pickStoreWinner(stale, reviewed), reviewed);
    var newer = Object.assign({}, stale, { lastReviewedAt: 0, updatedAt: 950 });
    assert.strictEqual(pickStoreWinner(stale, newer), newer, 'same review time → updatedAt');
  });

  QUnit.test('legacyToDocs: localStorage fixture → day/card/prefs docs', function (assert) {
    var ls = fakeLs(LEGACY);
    var docs = legacyToDocs(ls.get, 'dev1', 42);
    var byId = {};
    docs.forEach(function (d) { byId[d._id] = d; });
    assert.deepEqual(Object.keys(byId).sort(), ['card:c_2_0', 'card:v_1_0', 'day:1', 'day:2', 'prefs:learning']);
    assert.strictEqual(byId['day:1'].done, true);
    assert.deepEqual([byId['prefs:learning'].currentDay, byId['prefs:learning'].furigana, byId['prefs:learning'].uiLang], [3, false, 'ja']);
    assert.strictEqual(byId['card:v_1_0'].lastReviewedAt, 4 * 86400000, 'reviewed card: due - interval days');
    assert.strictEqual(byId['card:c_2_0'].lastReviewedAt, 0, 'never-reviewed card → 0');
    assert.ok(docs.every(function (d) { return d.updatedAt === 42 && d.deviceId === 'dev1'; }), 'stamped');
    assert.deepEqual(legacyToDocs(fakeLs({ n5_srs: 'garbage' }).get, 'd', 1), [], 'bad JSON → no docs');
  });

  QUnit.test('migration: copies legacy keys once, sets flag, leaves old + device keys alone', function (assert) {
    var ls = fakeLs(LEGACY);
    var backend = persistentBackend();
    var s1 = storeOn(ls, backend);
    return s1.init().then(function (snap) {
      assert.deepEqual(snap.completed.sort(), [1, 2]);
      assert.deepEqual([snap.dayNum, snap.furiganaPref, snap.uiLang], [3, 'false', 'ja']);
      assert.strictEqual(snap.srsCards.v_1_0.front, 'いえ');
      return s1.flush();
    }).then(function () {
      assert.strictEqual(ls.get('jlpt_store_migrated_v1'), '1', 'flag set');
      assert.strictEqual(ls.get('n5_completed'), '[1,2]', 'old key untouched');
      assert.ok(!s1.docs().some(function (d) { return /palette|theme|tts/.test(JSON.stringify(d)); }), 'device prefs not in docs');
      ls.set('n5_completed', '[1,2,7]'); // later legacy edits are not re-imported
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(snap.completed.sort(), [1, 2], 'no second migration');
    });
  });

  QUnit.test('migration: in-memory fallback does not set the flag', function (assert) {
    var ls = fakeLs(LEGACY);
    var s = createStore({ ls: ls, openBackend: function () { return Promise.reject(new Error('no idb')); } });
    return s.init().then(function (snap) {
      assert.strictEqual(s.backend, 'memory');
      assert.deepEqual(snap.completed.sort(), [1, 2], 'legacy data still shown this session');
      return s.flush();
    }).then(function () {
      assert.strictEqual(ls.get('jlpt_store_migrated_v1'), null);
    });
  });

  QUnit.test('in-memory backend round-trip: writes are visible to the next session', function (assert) {
    var backend = memoryBackend();
    var ls = fakeLs({ jlpt_store_migrated_v1: '1' });
    var s1 = storeOn(ls, backend);
    var card = { id: 'v_4_0', type: 'vocab', front: 'x', back: 'y', interval: 1, ease: 2.5, due: 1, reps: 0 };
    return s1.init().then(function () {
      s1.putDay(4, true);
      s1.putCards({ v_4_0: card });
      s1.putPrefs({ currentDay: 4, furigana: true, uiLang: 'auto' });
      return s1.flush();
    }).then(function () {
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(snap.completed, [4]);
      assert.deepEqual(snap.srsCards.v_4_0, card);
      assert.deepEqual([snap.dayNum, snap.furiganaPref, snap.uiLang], [4, 'true', 'auto']);
      var day = backend.loadAll();
      return day;
    }).then(function (docs) {
      assert.ok(docs.every(function (d) { return typeof d.updatedAt === 'number' && d.deviceId === ls.get('jlpt_device_id'); }), 'updatedAt + deviceId on every doc');
    });
  });

  QUnit.test('putPrefs/putDay skip unchanged values (no updatedAt bump)', function (assert) {
    var s = storeOn(fakeLs({ jlpt_store_migrated_v1: '1' }), memoryBackend());
    return s.init().then(function () {
      s.putPrefs({ currentDay: 1, uiLang: 'en', furigana: null });
      assert.strictEqual(s.docs().length, 0, 'defaults are not written');
      s.putDay(2, true);
      var first = s.docs()[0];
      s.putDay(2, true);
      assert.strictEqual(s.docs()[0], first, 'same doc object → no rewrite');
    });
  });

  QUnit.test('un-marking a day keeps its SRS cards (decision 10)', function (assert) {
    var s = storeOn(fakeLs({ jlpt_store_migrated_v1: '1' }), memoryBackend());
    return s.init().then(function () {
      var cards = {};
      srsAddCards(curriculum[4], cards);
      s.putDay(5, true);
      s.putCards(cards);
      s.putDay(5, false);
      var snap = s.snapshot();
      assert.deepEqual(snap.completed, [], 'day 5 not done');
      assert.deepEqual(Object.keys(snap.srsCards).sort(), Object.keys(cards).sort(), 'cards kept');
      assert.ok(Object.keys(cards).length > 0, 'day 5 has cards');
    });
  });

  QUnit.test('export v2 → validate → import round-trips docs; device prefs ride along', function (assert) {
    var docs = legacyToDocs(fakeLs(LEGACY).get, 'dev1', 42).map(function (d) { return Object.assign({ _rev: '1-x' }, d); });
    var file = exportProgress(docs, fakeLs(LEGACY).get);
    assert.strictEqual(file.version, 2);
    assert.deepEqual(file.device, { jlpt_palette: 'shu', jlpt_theme: 'light', jlpt_tts_rate: '1' });
    assert.ok(file.docs.every(function (d) { return d._rev === undefined; }), '_rev stripped');
    var parsed = JSON.parse(JSON.stringify(file));
    assert.ok(validateProgressData(parsed).valid, validateProgressData(parsed).error);
    var imp = progressFileToDocs(parsed, 'dev2', 99);
    assert.deepEqual(docsToSnapshot(imp.docs), docsToSnapshot(docs));
    assert.deepEqual(imp.device, file.device);
  });

  QUnit.test('import v1: synced keys → docs, other keys → localStorage', function (assert) {
    var v1 = { version: 1, keys: { n5_completed: '[3]', n5_day: '3', jlpt_palette: 'matcha', n5_2025: '{}' } };
    assert.ok(validateProgressData(v1).valid);
    var imp = progressFileToDocs(v1, 'dev', 7);
    assert.deepEqual(imp.docs.map(function (d) { return d._id; }).sort(), ['day:3', 'prefs:learning']);
    assert.deepEqual(imp.device, { jlpt_palette: 'matcha', n5_2025: '{}' });
  });

  QUnit.test('replaceAll: import overwrites (removes docs not in the file)', function (assert) {
    var backend = memoryBackend();
    var ls = fakeLs({ jlpt_store_migrated_v1: '1' });
    var s = storeOn(ls, backend);
    return s.init().then(function () {
      s.putDay(9, true);
      return s.replaceAll([{ _id: 'day:3', done: true, updatedAt: 1, deviceId: 'old' }]);
    }).then(function () {
      return storeOn(ls, backend).init();
    }).then(function (snap) {
      assert.deepEqual(snap.completed, [3]);
    });
  });

  QUnit.test('validateProgressData v2 rejects malformed files', function (assert) {
    function err(data) { return validateProgressData(data).error || ''; }
    var ok = { _id: 'day:1', done: true, updatedAt: 1 };
    assert.ok(err({ version: 2 }).indexOf('docs') !== -1, 'missing docs');
    assert.ok(err({ version: 2, docs: [{ _id: 'evil', updatedAt: 1 }] }).indexOf('bad doc id') !== -1);
    assert.ok(err({ version: 2, docs: [{ _id: 'day:1', done: true }] }).indexOf('updatedAt') !== -1);
    assert.ok(err({ version: 2, docs: [{ _id: 'day:1', done: 'yes', updatedAt: 1 }] }).indexOf('done') !== -1);
    assert.ok(err({ version: 2, docs: [{ _id: 'card:v_1_0', updatedAt: 1 }] }).indexOf('SRS') !== -1);
    assert.ok(err({ version: 2, docs: [ok], device: { n5_srs: '{}' } }).indexOf('unknown device key') !== -1);
    assert.ok(validateProgressData({ version: 2, docs: [ok], device: { jlpt_theme: 'dark' } }).valid);
    assert.notOk(validateProgressData({ version: 3, docs: [] }).valid, 'unknown version');
  });

  // Browser only: real PouchDB conflict resolution (the Node runner has no PouchDB).
  QUnit.test('pouchBackend.loadAll resolves conflicts by merge rules, removes losers', function (assert) {
    if (typeof PouchDB === 'undefined') { assert.ok(true, 'PouchDB not loaded — skipped'); return; }
    var db = new PouchDB('jlpt-test-' + Date.now());
    // Two leaf revs: CouchDB's winner is "1-b" (higher hash), but "1-a" is the newer write.
    return db.bulkDocs([
      { _id: 'day:3', _rev: '1-a', done: true, updatedAt: 200, deviceId: 'a' },
      { _id: 'day:3', _rev: '1-b', done: false, updatedAt: 100, deviceId: 'b' }
    ], { new_edits: false }).then(function () {
      return db.get('day:3', { conflicts: true });
    }).then(function (before) {
      assert.strictEqual(before._conflicts.length, 1, 'conflict exists');
      return pouchBackend(db).loadAll();
    }).then(function (docs) {
      assert.strictEqual(docs.length, 1);
      assert.strictEqual(docs[0].done, true, 'newer write wins');
      return db.get('day:3', { conflicts: true });
    }).then(function (after) {
      assert.strictEqual(after.done, true);
      assert.notOk(after._conflicts && after._conflicts.length, 'losers removed');
    }).then(function () { return db.destroy(); }, function (e) { return db.destroy().then(function () { throw e; }); });
  });
});
