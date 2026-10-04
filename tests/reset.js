"use strict";

// Clear all data (ticket 43): Store.wipe + the type-to-confirm word. The app-level reset
// (device keys, welcome) is covered by the inline checks in .claude/hooks/run-tests.js.
QUnit.module('reset', function () {
  function fakeLs() {
    var d = {};
    return { get: function (k) { return d[k] === undefined ? null : d[k]; }, set: function (k, v) { d[k] = String(v); } };
  }
  function storeOn(backend, ls) {
    var s = createStore({ ls: ls || fakeLs(), openBackend: function () { return Promise.resolve(backend); } });
    return s.init().then(function () { return s; });
  }
  var CARD = { id: 'v:家族|かぞく', type: 'vocab', front: '家族', back: 'family', reading: 'かぞく', interval: 1, ease: 2.5, due: 1, reps: 0 };
  function fill(s) {
    s.putUnit('n5.u001', true);
    s.putCards({ 'v:家族|かぞく': CARD });
    s.putPrefs({ pace: 2 });
    s.logQuiz('n5.u001', 5, 5);
    s.putUnlocks([{ id: 'first-steps', at: 5 }]);
  }

  QUnit.test('resetWordOk: RESET in any case, trimmed; nothing else', function (assert) {
    ['RESET', 'reset', '  Reset '].forEach(function (w) { assert.ok(resetWordOk(w), w); });
    ['', 'RESE', 'RESET!', 'reset all', null, undefined].forEach(function (w) { assert.notOk(resetWordOk(w), String(w)); });
  });

  QUnit.test('Store.wipe: every doc gone, backend empty, snapshot equals a fresh store, device id kept', function (assert) {
    var ls = fakeLs(), backend = memoryBackend(), fresh = null;
    return storeOn(memoryBackend()).then(function (f) {
      fresh = f.snapshot();
      return storeOn(backend, ls);
    }).then(function (s) {
      var id = s.deviceId;
      fill(s);
      return s.flush().then(function () { return backend.loadAll(); }).then(function (before) {
        assert.ok(before.length >= 5, 'backend filled');
        return s.wipe().then(function () { return backend.loadAll(); }).then(function (after) {
          assert.strictEqual(after.length, 0, 'backend empty');
          assert.strictEqual(s.docs().length, 0, 'memory mirror empty');
          assert.deepEqual(s.snapshot(), fresh, 'snapshot equals a fresh store');
          assert.strictEqual(ls.get('jlpt_device_id'), id, 'device id kept');
          assert.strictEqual(s.deviceId, id);
        });
      });
    });
  });

  QUnit.test('Store.wipe: writes still queued do not recreate docs; writes after it work', function (assert) {
    var backend = memoryBackend();
    return storeOn(backend).then(function (s) {
      fill(s); // queued, not flushed
      return s.wipe().then(function () { return backend.loadAll(); }).then(function (docs) {
        assert.deepEqual(docs, [], 'nothing came back');
        s.putUnit('n5.u002', true);
        return s.flush().then(function () { return backend.loadAll(); });
      }).then(function (docs) {
        assert.deepEqual(docs.map(function (d) { return d._id; }), ['unit:n5.u002'], 'a fresh write after the wipe is stored');
      });
    });
  });

  QUnit.test('Store.wipe: stops sync before the backend is touched (no deletion replicates), cancels the feed', function (assert) {
    var order = [], h = { on: function () { return h; }, cancel: function () { order.push('sync-cancel'); } };
    var feed = { cancel: function () { order.push('feed-cancel'); } };
    var b = memoryBackend(), wipe = b.wipe;
    b.wipe = function () { order.push('backend-wipe'); return wipe.call(b); };
    b.watch = function () { return feed; };
    b.db = { sync: function () { return h; } };
    var remote = { info: function () { return Promise.resolve({ doc_count: 0 }); }, get: function () { return Promise.reject({ status: 404 }); },
      put: function () { return Promise.resolve({ rev: '1-a' }); }, remove: function () { return Promise.resolve({}); } };
    return storeOn(b).then(function (s) {
      fill(s);
      return s.connect(remote).then(function () {
        assert.ok(s.syncInfo.connected);
        return s.wipe();
      }).then(function () {
        assert.deepEqual(order, ['sync-cancel', 'feed-cancel', 'backend-wipe']);
        assert.deepEqual([s.syncInfo.connected, s.syncInfo.status], [false, 'off']);
      });
    });
  });

  QUnit.test('Store.wipe: a failing backend rejects', function (assert) {
    var b = memoryBackend();
    b.wipe = function () { return Promise.reject(new Error('blocked')); };
    var origErr = console.error;
    console.error = function () {};
    return storeOn(b).then(function (s) {
      return s.wipe().then(function () { assert.ok(false, 'should reject'); }, function (e) { assert.strictEqual(e.message, 'blocked'); });
    }).then(function () { console.error = origErr; }, function (e) { console.error = origErr; throw e; });
  });
});
