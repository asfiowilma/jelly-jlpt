"use strict";

// Content accuracy checks (ticket 26, spec §9): machine checks the owner can
// trust without reading Japanese. Each check returns a list of "id: problem"
// strings; the shipped catalog + plan must produce none.
// REF (reference lists, tools/ref/<level>.json) is set by run-tests.js; tests.html
// runs from file:// and can't read JSON, so the level check is headless-only.
QUnit.module('catalog checks', function () {
  var HIRA = 'ぁ-ゖー', KATA = 'ァ-ヺー';
  var KANA_RE = new RegExp('^[' + HIRA + KATA + ']+$');
  var ON_RE = new RegExp('^-?[' + KATA + ']+-?$');
  var KUN_RE = new RegExp('^-?[' + HIRA + ']+(\\.[' + HIRA + ']+)?-?$');
  var PLACEHOLDER_RE = /review|practice|復習|comprehensive|^phase\s*\d|^day\s*\d|todo|tbd|placeholder|lorem/i;
  // Load guide per lesson unit (map Q13), upper bound = guide + 25%.
  // ponytail: no lower bound — kanji/grammar run out long before vocab does.
  var LOAD_GUIDE = { N5: { vocab: 8, kanji: 2, grammar: 1 } };
  var REQUIRED = { vocab: ['word', 'reading', 'pos'], kanji: ['char'], grammar: ['pattern', 'meaning'], sentence: ['jp', 'en'] };

  function nonEmptyStrings(a) { return Array.isArray(a) && a.length > 0 && a.every(function (s) { return typeof s === 'string' && s; }); }
  function hira(s) { return kataToHira(s); }

  // Strings an item should show up as inside a sentence. Vocab: word, reading,
  // or for verbs / い-adjectives the stem (dict form minus its last kana) followed
  // by kana — covers 食べます, 飲んだ, 高くない without a tokenizer.
  // ponytail: an all-kana verb stem of 1 kana (のむ → の) matches almost anything;
  // swap in conjugate() forms if that ever lets a bad sentence through.
  function surfaceMatch(it, jp) {
    if (it.kind === 'kanji') return jp.indexOf(it.char) >= 0;
    if (it.kind === 'vocab') {
      if (jp.indexOf(it.word) >= 0 || jp.indexOf(it.reading) >= 0) return true;
      if (!/^(verb|adj-i)/.test(it.pos || '')) return false;
      return [it.word, it.reading].some(function (w) {
        return w.length > 1 && new RegExp(w.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[' + HIRA + ']').test(jp);
      });
    }
    if (it.kind === 'grammar') {
      // Kana/kanji tokens of the pattern ('X は Y です' → は, です; '〜く/〜になる' → alternatives).
      var tokens = it.pattern.replace(/[〜～…]|\([^)]*\)|[A-Za-z]+(-\S*)?/g, ' ').split(/\s+/).filter(Boolean);
      return tokens.every(function (t) { return t.split('/').some(function (alt) { return !alt || jp.indexOf(alt) >= 0; }); });
    }
    return true;
  }

  function itemErrors(it, items) {
    var e = [];
    function err(msg) { e.push(it.id + ': ' + msg); }
    if (it.id.indexOf(CATALOG_ID_PREFIX[it.kind]) !== 0) err('id prefix ≠ kind');
    if (levelRank(it.level) < 0) err('level ' + it.level);
    if (!nonEmptyStrings(it.sources)) err('no sources');
    if (typeof it.verified !== 'boolean') err('verified not boolean');
    if (it.verified && nonEmptyStrings(it.sources)) {
      var distinct = it.sources.filter(function (s, i, a) { return a.indexOf(s) === i; });
      if (distinct.length < 2) err('verified needs ≥2 distinct sources');
      if (distinct.indexOf('legacy') >= 0) err("verified can't cite legacy");
    }
    (REQUIRED[it.kind] || []).forEach(function (f) { if (typeof it[f] !== 'string' || !it[f]) err('missing ' + f); });
    if (e.length) return e;

    if (it.kind === 'vocab') {
      if (it.id !== 'v:' + it.word + '|' + it.reading) err('id ≠ word|reading');
      if (!nonEmptyStrings(it.gloss)) err('missing gloss');
      if (!KANA_RE.test(it.reading)) err('reading not kana: ' + it.reading);
      // Kana in the word (okurigana, お-, -さん) must sit in the same place in the
      // reading; each non-kana run (kanji, 々) stands for ≥1 kana.
      var shape = hira(it.word).replace(new RegExp('[^' + HIRA + ']+', 'g'), '\u0000').split('\u0000').join('.+');
      if (!new RegExp('^' + shape + '$').test(hira(it.reading))) err('reading ' + it.reading + " doesn't fit " + it.word);
    } else if (it.kind === 'kanji') {
      if (it.id !== 'k:' + it.char || Array.from(it.char).length !== 1) err('id ≠ k:<one char>');
      if (!Array.isArray(it.on) || !Array.isArray(it.kun) || it.on.length + it.kun.length === 0) err('no readings');
      else {
        it.on.forEach(function (r) { if (!ON_RE.test(r)) err('on reading not katakana: ' + r); });
        it.kun.forEach(function (r) { if (!KUN_RE.test(r)) err('kun reading not hiragana: ' + r); });
      }
      if (!nonEmptyStrings(it.meaning)) err('missing meaning');
    } else if (it.kind === 'grammar') {
      if (!/^g:[a-z0-9-]+$/.test(it.id)) err('id not g:<slug>');
      if (PLACEHOLDER_RE.test(it.pattern)) err('placeholder pattern ' + it.pattern);
      var ex = it.examples || [];
      if (it.verified && ex.length < 2) err('verified needs ≥2 examples');
      ex.forEach(function (s) {
        var sen = items[s];
        if (!sen || sen.kind !== 'sentence') err('example ' + s + ' missing');
        else if ((sen.uses || []).indexOf(it.id) < 0) err('example ' + s + " doesn't list it in uses");
      });
    } else if (it.kind === 'sentence') {
      if (!/^s:(own:[a-z0-9-]+|tatoeba:\d+)$/.test(it.id)) err('id not s:own:<slug> / s:tatoeba:<n>');
      if (/^s:tatoeba:/.test(it.id) && !(it.license && it.author)) err('tatoeba sentence needs license + author');
      if (it.reading && hasKanji(it.reading)) err('reading has kanji');
      (it.uses || []).forEach(function (id) {
        if (!items[id]) err('uses missing ' + id);
        else if (!surfaceMatch(items[id], it.jp)) err("jp doesn't contain " + id);
      });
    }
    return e;
  }

  function catalogErrors(items) {
    return [].concat.apply([], Object.keys(items).map(function (k) { return itemErrors(items[k], items); }));
  }

  // Level consistency vs the reference lists: an item at a level with a ref list
  // must be on it (grammar via its `ref` names) or say why not (offList); an item
  // on a level's list must carry that level.
  function refErrors(items, ref) {
    var e = [];
    var sets = {};
    Object.keys(ref).forEach(function (lv) {
      sets[lv] = { vocab: new Set([].concat.apply([], ref[lv].vocab)), kanji: new Set(ref[lv].kanji), grammar: new Set(ref[lv].grammar) };
    });
    Object.keys(items).forEach(function (k) {
      var it = items[k];
      if (!(it.kind in { vocab: 1, kanji: 1, grammar: 1 }) || it.offList) return;
      var keys = it.kind === 'vocab' ? [it.word + '|' + it.reading] : it.kind === 'kanji' ? [it.char] : (it.ref || []);
      var on = function (lv) { return keys.length > 0 && keys.every(function (x) { return sets[lv][it.kind].has(x); }); };
      if (sets[it.level] && !on(it.level)) e.push(it.id + ': not on the ' + it.level + ' list (add offList:"reason" if intended)');
      Object.keys(sets).forEach(function (lv) {
        if (lv !== it.level && on(lv)) e.push(it.id + ': tagged ' + it.level + ' but on the ' + lv + ' list');
      });
    });
    return e;
  }

  function planErrors(plan) {
    var e = [], taught = {};
    plan.forEach(function (lp) {
      var guide = LOAD_GUIDE[lp.level];
      lp.units.forEach(function (u) {
        if (u.kind !== 'lesson') return;
        if (PLACEHOLDER_RE.test(u.title || '')) e.push(u.id + ': placeholder title ' + u.title);
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
          var ids = u[f] || [];
          if (guide && ids.length > Math.ceil(guide[f] * 1.25)) e.push(u.id + ': ' + ids.length + ' ' + f + ' > guide ' + guide[f] + ' +25%');
          ids.forEach(function (id) {
            if (taught[id]) e.push(u.id + ': ' + id + ' already taught in ' + taught[id]);
            else taught[id] = u.id;
          });
        });
      });
    });
    return e;
  }

  // ── shipped content ────────────────────────────────────────────────────────
  QUnit.test('shipped catalog passes every item check', function (assert) {
    assert.ok(Object.keys(CATALOG.items).length > 0, 'catalog not empty');
    assert.deepEqual(catalogErrors(CATALOG.items), []);
  });

  QUnit.test('shipped plan: no item taught twice, load within guide, no placeholder titles', function (assert) {
    assert.deepEqual(planErrors(PLAN), []);
  });

  QUnit.test('shipped catalog levels match the reference lists (tools/ref)', function (assert) {
    if (typeof REF === 'undefined') { assert.ok(true, 'skipped: REF is loaded by run-tests.js only'); return; }
    assert.ok(REF.N5 && REF.N5.vocab.length > 500, 'N5 ref list loaded');
    assert.deepEqual(refErrors(CATALOG.items, REF), []);
  });

  // ── the checks catch what they claim to ───────────────────────────────────
  function errsFor(bad, extra) {
    var items = Object.assign({}, extra || {});
    items[bad.id] = bad;
    return itemErrors(bad, items).join('\n');
  }
  var v = { id: 'v:食べる|たべる', kind: 'vocab', level: 'N5', word: '食べる', reading: 'たべる', gloss: ['to eat'],
    pos: 'verb-ichidan', sources: ['tanos', 'elzup'], verified: true };
  var k = { id: 'k:食', kind: 'kanji', level: 'N5', char: '食', on: ['ショク'], kun: ['た.べる'], meaning: ['eat'],
    sources: ['tanos', 'kanjidic'], verified: true };
  function s(jp, uses) { return { id: 's:own:x', kind: 'sentence', level: 'N5', jp: jp, en: 'x', uses: uses, sources: ['own'], verified: false }; }
  function with_(o, patch) { return Object.assign({}, o, patch); }

  QUnit.test('item checks accept good items', function (assert) {
    assert.strictEqual(errsFor(v), '');
    assert.strictEqual(errsFor(k), '');
    assert.strictEqual(errsFor(with_(v, { id: 'v:パン|パン', word: 'パン', reading: 'パン', pos: 'noun' })), '', 'kana word = reading');
    assert.strictEqual(errsFor(with_(v, { id: 'v:お父さん|おとうさん', word: 'お父さん', reading: 'おとうさん', pos: 'noun' })), '', 'okurigana shape');
  });

  QUnit.test('item checks: sources, verified, ids, required fields', function (assert) {
    assert.ok(/distinct/.test(errsFor(with_(v, { sources: ['tanos', 'tanos'] }))), 'duplicate source');
    assert.ok(/legacy/.test(errsFor(with_(v, { sources: ['legacy', 'tanos'] }))), 'verified + legacy');
    assert.strictEqual(errsFor(with_(v, { sources: ['legacy', 'tanos'], verified: false })), '', 'legacy ok while unverified');
    assert.ok(/no sources/.test(errsFor(with_(v, { sources: [] }))), 'empty sources');
    assert.ok(/level/.test(errsFor(with_(v, { level: 'N6' }))), 'bad level');
    assert.ok(/id ≠/.test(errsFor(with_(v, { reading: 'たべます', id: 'v:食べる|たべる' }))), 'id ≠ content');
    assert.ok(/missing pos/.test(errsFor(with_(v, { pos: undefined }))), 'vocab pos');
    assert.ok(/gloss/.test(errsFor(with_(v, { gloss: [] }))), 'vocab gloss');
    assert.ok(/k:<one char>/.test(errsFor(with_(k, { id: 'k:食べ', char: '食べ' }))), 'kanji char');
  });

  QUnit.test('item checks: readings', function (assert) {
    assert.ok(/not kana/.test(errsFor(with_(v, { id: 'v:食べる|食べる', reading: '食べる' }))), 'reading = kanji word');
    assert.ok(/not kana/.test(errsFor(with_(v, { id: 'v:食べる|taberu', reading: 'taberu' }))), 'romaji reading');
    assert.ok(/doesn't fit/.test(errsFor(with_(v, { id: 'v:食べる|たべた', reading: 'たべた' }))), 'okurigana mismatch');
    assert.ok(/doesn't fit/.test(errsFor(with_(v, { id: 'v:食べる|べる', reading: 'べる' }))), 'kanji with no reading');
    assert.ok(/on reading/.test(errsFor(with_(k, { on: ['しょく'] }))), 'on in hiragana');
    assert.ok(/kun reading/.test(errsFor(with_(k, { kun: ['タ.ベル'] }))), 'kun in katakana');
    assert.ok(/no readings/.test(errsFor(with_(k, { on: [], kun: [] }))), 'no readings');
  });

  QUnit.test('item checks: sentences contain what they use', function (assert) {
    var items = {}; items[v.id] = v; items[k.id] = k;
    assert.strictEqual(errsFor(s('パンを食べます。', [v.id, k.id]), items), '', 'stem + kana');
    assert.strictEqual(errsFor(s('パンを たべた。', [v.id]), items), '', 'kana stem');
    assert.ok(/doesn't contain v:食べる/.test(errsFor(s('水を飲みます。', [v.id]), items)), 'vocab absent');
    assert.ok(/doesn't contain k:食/.test(errsFor(s('水を飲みます。', [k.id]), items)), 'kanji absent');
    assert.ok(/uses missing/.test(errsFor(s('x', ['v:nope|nope']), items)), 'dangling use');
    assert.ok(/license/.test(errsFor(with_(s('パンを食べます。', []), { id: 's:tatoeba:1' }))), 'tatoeba license');
    assert.strictEqual(errsFor(with_(s('パンを食べます。', []), { id: 's:tatoeba:1', license: 'CC BY 2.0 FR', author: 'x' })), '');
    assert.ok(/reading has kanji/.test(errsFor(with_(s('パンを食べます。', []), { reading: 'パンを食べます' }))), 'sentence reading');
  });

  QUnit.test('item checks: grammar examples', function (assert) {
    var g = { id: 'g:te-mo-ii', kind: 'grammar', level: 'N5', pattern: '〜てもいい', meaning: 'may', examples: ['s:own:a', 's:own:b'],
      sources: ['tanos', 'tofugu'], verified: true };
    var ok = function (id, jp) { return with_(s(jp, [g.id]), { id: id }); };
    var items = { 's:own:a': ok('s:own:a', '食べてもいいです。'), 's:own:b': ok('s:own:b', '見てもいい？') };
    assert.strictEqual(errsFor(g, items), '');
    assert.ok(/≥2 examples/.test(errsFor(with_(g, { examples: ['s:own:a'] }), items)), 'verified needs 2');
    assert.ok(/missing/.test(errsFor(with_(g, { examples: ['s:own:a', 's:own:zz'] }), items)), 'dangling example');
    items['s:own:b'] = with_(items['s:own:b'], { uses: [] });
    assert.ok(/uses/.test(errsFor(g, items)), 'example must list the grammar');
    items[g.id] = g;
    assert.ok(/doesn't contain g:te-mo-ii/.test(errsFor(ok('s:own:c', '食べます。'), items)), 'pattern absent');
    assert.ok(/placeholder/.test(errsFor(with_(g, { pattern: 'Phase 6 review' }), items)), 'placeholder pattern');
  });

  QUnit.test('plan checks: taught twice, overload, placeholder title', function (assert) {
    var u = function (id, patch) { return Object.assign({ id: id, level: 'N5', kind: 'lesson', title: 'Food', vocab: ['v:a|a'] }, patch); };
    assert.deepEqual(planErrors([{ level: 'N5', units: [u('n5.u001'), u('n5.u002', { vocab: ['v:b|b'] }), u('n5.u003', { kind: 'review', title: 'Review', vocab: ['v:a|a'] })] }]), []);
    assert.ok(/already taught in n5.u001/.test(planErrors([{ level: 'N5', units: [u('n5.u001'), u('n5.u002')] }]).join()), 'taught twice');
    assert.ok(/11 vocab > guide/.test(planErrors([{ level: 'N5', units: [u('n5.u001', { vocab: '01234567890'.split('').map(function (c) { return 'v:' + c + '|' + c; }) })] }]).join()), 'overload');
    assert.ok(/placeholder title/.test(planErrors([{ level: 'N5', units: [u('n5.u001', { title: 'Grammar practice' })] }]).join()), 'placeholder');
  });

  QUnit.test('ref checks: off-list and wrong-level items', function (assert) {
    var ref = { N5: { vocab: ['食べる|たべる', ['九|きゅう', '九|く']], kanji: ['食'], grammar: ['です'] } };
    var items = function (list) { var o = {}; list.forEach(function (it) { o[it.id] = it; }); return o; };
    var g = { id: 'g:desu', kind: 'grammar', level: 'N5', ref: ['です'] };
    var ku = with_(v, { id: 'v:九|く', word: '九', reading: 'く' });
    assert.deepEqual(refErrors(items([v, k, g, ku]), ref), []);
    assert.ok(/not on the N5 list/.test(refErrors(items([with_(v, { id: 'v:x', word: '飲む', reading: 'のむ' })]), ref).join()), 'off list');
    assert.deepEqual(refErrors(items([with_(v, { id: 'v:x', word: '飲む', reading: 'のむ', offList: 'needed for unit 3' })]), ref), [], 'offList');
    assert.ok(/tagged N4 but on the N5 list/.test(refErrors(items([with_(k, { level: 'N4' })]), ref).join()), 'wrong level');
    assert.ok(/not on the N5 list/.test(refErrors(items([with_(g, { ref: undefined })]), ref).join()), 'grammar without ref');
  });
});
