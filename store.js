"use strict";

// ── Store: the one persistence seam for SYNCED learning data ────────────────
// Sync design: .scratch/roadmap/issues/20-sync-design.md. Doc shapes and the
// pure merge/export helpers live in lib.js (stripDocMeta, pickStoreWinner,
// docsToSnapshot). Device-only prefs (palette, theme, TTS rate) are NOT
// here — they stay in localStorage.
//
// Store.init() → Promise: opens PouchDB (IndexedDB); if PouchDB is missing or
// fails to open, falls back to an in-memory backend for the session (Node test
// runner, IndexedDB blocked). Then holds every doc in a memory mirror. After
// that, reads are synchronous (snapshot/docs) and writes update the mirror
// immediately, then persist through a serial async queue (write-through).
// No migration from the old day-keyed 'jlpt' DB or localStorage (map Q5).

var STORE_DB_NAME = 'jelly'; // IndexedDB: _pouch_jelly (old day-keyed data lives in _pouch_jlpt)

function memoryBackend() {
  var data = {};
  return {
    name: 'memory',
    loadAll: function () {
      return Promise.resolve(Object.keys(data).map(function (k) { return Object.assign({}, data[k]); }));
    },
    put: function (doc) { data[doc._id] = Object.assign({}, doc); return Promise.resolve('1'); },
    remove: function (id) { delete data[id]; return Promise.resolve(); }
  };
}

// Conflicting revisions (other tabs now, other devices once sync lands): keep
// pickStoreWinner's choice on the winning rev, delete the losing leaves.
function resolveConflicts(db, doc) {
  return Promise.all(doc._conflicts.map(function (rev) {
    return db.get(doc._id, { rev: rev });
  })).then(function (losers) {
    var winner = [doc].concat(losers).reduce(pickStoreWinner);
    var merged = Object.assign({}, winner, { _rev: doc._rev });
    delete merged._conflicts;
    var writes = losers.map(function (l) { return { _id: l._id, _rev: l._rev, _deleted: true }; });
    if (winner !== doc) writes.push(merged);
    return db.bulkDocs(writes).then(function (res) {
      var last = res[res.length - 1];
      if (winner !== doc && last && last.ok) merged._rev = last.rev;
      return merged;
    });
  });
}

function pouchBackend(db) {
  return {
    name: 'pouchdb',
    loadAll: function () {
      return db.allDocs({ include_docs: true, conflicts: true }).then(function (res) {
        return Promise.all(res.rows.map(function (row) {
          return row.doc._conflicts ? resolveConflicts(db, row.doc) : row.doc;
        }));
      });
    },
    put: function (doc) {
      return db.put(doc).then(function (res) { return res.rev; }, function (err) {
        if (err.status !== 409) throw err;
        // Another tab wrote this doc since we loaded it: merge rules decide.
        return db.get(doc._id).then(function (cur) {
          if (pickStoreWinner(cur, doc) === cur) return cur._rev;
          return db.put(Object.assign({}, doc, { _rev: cur._rev })).then(function (res) { return res.rev; });
        });
      });
    },
    remove: function (id) {
      return db.get(id).then(function (cur) { return db.remove(cur); }).catch(function (err) {
        if (err.status !== 404) throw err;
      });
    }
  };
}

function openDefaultBackend() {
  if (typeof PouchDB === 'undefined') return Promise.reject(new Error('PouchDB not loaded'));
  var db;
  try { db = new PouchDB(STORE_DB_NAME); } catch (e) { return Promise.reject(e); }
  return db.info().then(function () { return pouchBackend(db); });
}

function browserLocalStorage() {
  return {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
}

// createStore({ ls, openBackend }) — both injectable for tests; defaults are the
// browser's localStorage and PouchDB. `ls` = { get(k) → string|null, set(k, v) }.
function createStore(opts) {
  opts = opts || {};
  var ls = opts.ls || browserLocalStorage();
  var openBackend = opts.openBackend || openDefaultBackend;
  var mirror = {}; // _id → doc without _rev
  var revs = {};   // _id → latest known _rev
  var backend = memoryBackend();
  var queue = Promise.resolve();

  var deviceId = ls.get('jlpt_device_id');
  if (!deviceId) {
    deviceId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    ls.set('jlpt_device_id', deviceId);
  }

  function enqueue(fn) {
    queue = queue.then(fn).catch(function (e) {
      console.error('Store write failed:', e);
      if (typeof window !== 'undefined' && window.dispatchEvent && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('storage-save-error', { detail: String(e && e.message || e) }));
      }
    });
    return queue;
  }
  function putNow(doc) {
    if (mirror[doc._id] !== doc) return Promise.resolve(); // superseded by a newer write
    var payload = Object.assign({}, doc);
    if (revs[doc._id]) payload._rev = revs[doc._id];
    return backend.put(payload).then(function (rev) { revs[doc._id] = rev; });
  }
  function stamp(id, body) {
    return Object.assign({ _id: id }, body, { updatedAt: Date.now(), deviceId: deviceId });
  }
  // write: no-op when the body is unchanged (so re-saves don't bump updatedAt
  // and win LWW merges they shouldn't).
  function write(id, body) {
    var cur = mirror[id];
    if (cur && JSON.stringify(stripDocMeta(cur)) === JSON.stringify(body)) return queue;
    var doc = stamp(id, body);
    mirror[id] = doc;
    return enqueue(function () { return putNow(doc); });
  }

  function appendLog(fn) {
    var date = localDate();
    var id = 'log:' + date + ':' + deviceId;
    var cur = mirror[id] || { date: date };
    var body = Object.assign(stripDocMeta(cur), normalizeLog(cur)); // keeps unknown (newer) fields
    fn(body);
    var p = write(id, body);
    if (typeof window !== 'undefined' && window.dispatchEvent && typeof CustomEvent !== 'undefined') {
      window.dispatchEvent(new CustomEvent('activity-logged'));
    }
    return p;
  }

  var store = {
    backend: null, // 'pouchdb' | 'memory' once init() resolves
    deviceId: deviceId,
    init: function () {
      return openBackend().then(function (b) {
        return b.loadAll().then(function (docs) { return { b: b, docs: docs }; });
      }).catch(function (e) {
        console.warn('PouchDB unavailable, keeping progress in memory for this session:', String(e && e.message || e));
        return { b: memoryBackend(), docs: [] };
      }).then(function (r) {
        backend = r.b;
        store.backend = r.b.name;
        r.docs.forEach(function (d) {
          revs[d._id] = d._rev;
          var c = Object.assign({}, d);
          delete c._rev;
          delete c._conflicts;
          mirror[d._id] = c;
        });
        return store.snapshot();
      });
    },
    // { completed: [unitId...], srsCards: {itemId: card}, currentUnit, pace, examDate,
    //   furiganaPref: 'true'|'false'|null, uiLang }
    snapshot: function () { return docsToSnapshot(store.docs()); },
    docs: function () { return Object.keys(mirror).map(function (k) { return mirror[k]; }); },
    // Re-marking with the same done state is a no-op (keeps completedAt).
    putUnit: function (id, done) {
      var cur = mirror['unit:' + id];
      if (cur && cur.done === !!done) return queue;
      return write('unit:' + id, { done: !!done, completedAt: done ? Date.now() : null });
    },
    // Writes only the cards that differ from what's stored.
    // ponytail: O(cards) JSON compare per call; track dirty ids if reviews get slow.
    putCards: function (cards) {
      Object.keys(cards).forEach(function (id) { write('card:' + id, cards[id]); });
      return queue;
    },
    // Partial update of prefs:learning; values equal to the current (or default) prefs are skipped.
    putPrefs: function (partial) {
      var cur = mirror['prefs:learning'];
      var body = Object.assign(cur ? stripDocMeta(cur) : {}, partial);
      var effective = Object.assign({}, PREFS_DEFAULTS, cur ? stripDocMeta(cur) : {});
      var changed = Object.keys(partial).some(function (k) { return effective[k] !== partial[k]; });
      return changed ? write('prefs:learning', body) : queue;
    },
    // Activity log: appends to today's log:<date>:<deviceId> doc (see lib.js).
    // ponytail: two tabs on one device can race on today's doc (409 → LWW drops
    // the other tab's append); merge log docs field-wise if that ever matters.
    logLesson: function (unitId) {
      return appendLog(function (l) { if (l.lessons.indexOf(unitId) === -1) l.lessons.push(unitId); });
    },
    logQuiz: function (unitId, right, total) {
      return appendLog(function (l) { l.quizzes.push({ unit: unitId, right: right, total: total, at: Date.now() }); });
    },
    // quality: ReviewMode grade 0–3 (0 = Again, see srsReview).
    logReview: function (quality) {
      return appendLog(function (l) { l.reviews.count++; if (quality === 0) l.reviews.again++; });
    },
    logs: function () { return logDocs(store.docs()); },
    // Import: replace every doc. Imported docs are re-stamped as this device's
    // fresh write so they win LWW against older copies elsewhere.
    replaceAll: function (docs) {
      var keep = {};
      docs.forEach(function (d) { keep[d._id] = true; });
      Object.keys(mirror).forEach(function (id) {
        if (keep[id]) return;
        delete mirror[id];
        enqueue(function () { return backend.remove(id).then(function () { delete revs[id]; }); });
      });
      docs.forEach(function (d) {
        var doc = stamp(d._id, stripDocMeta(d));
        mirror[d._id] = doc;
        enqueue(function () { return putNow(doc); });
      });
      return queue;
    },
    flush: function () { return queue; }
  };
  return store;
}

var Store = createStore();
