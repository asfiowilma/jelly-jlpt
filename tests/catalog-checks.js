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
  // Lower bound (guide − 25%) for vocab only: 59 grammar points over 74 lessons means some
  // lessons carry no grammar, and kanji run out before vocab does.
  var LOAD_GUIDE = { N5: { vocab: 8, kanji: 2, grammar: 1 } };
  var REQUIRED = { vocab: ['word', 'reading', 'pos'], kanji: ['char'], grammar: ['pattern', 'meaning'], sentence: ['jp', 'en'],
    kana: ['char', 'romaji', 'script', 'group'] };
  var SCRIPT_RE = { hiragana: /^[ぁ-ゖ]+$/, katakana: /^[ァ-ヺ]+$/ };

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
      // '/〜' joins alternatives ('〜ている/〜ています'), so that 〜 goes before splitting.
      var tokens = it.pattern.replace(/\/\s*[〜～]/g, '/').replace(/[〜～…]|\([^)]*\)|[A-Za-z]+(-\S*)?/g, ' ').split(/\s+/).filter(Boolean);
      return tokens.every(function (t) { return t.split('/').some(function (alt) { return !alt || grammarHas(alt, jp); }); });
    }
    return true;
  }

  // A grammar token as it shows up in a sentence: て/た voice after ん-verbs (〜てから → 読んでから,
  // 〜たことがある → 読んだことがある), and a token ending in a verb's る/く/う conjugates like the vocab
  // stem rule above (〜ている → ています, 〜に行く → に行きました).
  // ponytail: ≥3 kana before the tail rule kicks in, so particles and short tokens stay exact.
  function grammarHas(tok, jp) {
    return [tok, tok.replace(/^て/, 'で').replace(/^た/, 'だ')].some(function (f) {
      return jp.indexOf(f) >= 0 ||
        (f.length >= 3 && /[るくう]$/.test(f) && new RegExp(f.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[' + HIRA + ']').test(jp));
    });
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
      // alt: a duplicate spelling the plan doesn't teach; it points at the one it does
      if (it.alt !== undefined) {
        var to = items[it.alt];
        if (!to || to.kind !== 'vocab' || to.alt) err('alt ' + it.alt + ' is not a taught vocab item');
        // same word: same written form (背|せ / 背|せい) or one reading inside the other (ふろ / おふろ)
        else if (to.word !== it.word && to.reading.indexOf(it.reading) < 0 && it.reading.indexOf(to.reading) < 0) err('alt ' + it.alt + ' is a different word');
      }
    } else if (it.kind === 'kana') {
      if (it.id !== 'c:' + it.char || Array.from(it.char).length > 2) err('id ≠ c:<kana (1-2 chars)>');
      if (!SCRIPT_RE[it.script]) err('script ' + it.script);
      else if (!SCRIPT_RE[it.script].test(it.char)) err(it.char + ' is not ' + it.script);
      if (!nonEmptyStrings(it.answers) || it.answers[0] !== it.romaji) err('answers must start with romaji');
      else it.answers.forEach(function (a) { if (!/^[a-z]+$/.test(a)) err('answer not romaji: ' + a); });
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

  // Kana-only text readable with the kana in `learned` (combos like きゃ count as one).
  function readable(s, learned) {
    for (var i = 0; i < s.length;) {
      if (learned[s.substr(i, 2)]) i += 2;
      else if (learned[s.charAt(i)]) i++;
      else return false;
    }
    return true;
  }

  // planErrors(plan, items): per-unit rules for the shipped plan (items = catalog items).
  //   lessons: no placeholder titles; vocab within guide ±25%, kanji / grammar ≤ guide +25%;
  //            a kanji only at or after a lesson teaching a word written with it.
  //   kana units: 2–5 practice words, each readable with the kana (and marks っ ー) learned so far.
  //   reviews: list no items; at most 6 lessons between reviews. Nothing taught twice.
  function planErrors(plan, items) {
    items = items || CATALOG.items;
    var e = [], taught = {};
    plan.forEach(function (lp) {
      var guide = LOAD_GUIDE[lp.level];
      var learned = {}, written = '', lessons = 0;
      lp.units.forEach(function (u) {
        if (u.kind === 'review') {
          Object.keys(UNIT_REF_FIELDS).forEach(function (f) { if ((u[f] || []).length) e.push(u.id + ': review unit lists ' + f); });
          lessons = 0;
          return;
        }
        if (PLACEHOLDER_RE.test(u.title || '')) e.push(u.id + ': placeholder title ' + u.title);
        if (u.kind === 'lesson' && ++lessons > 6) e.push(u.id + ': more than 6 lessons since the last review');
        (u.kana || []).forEach(function (id) { if (items[id]) learned[items[id].char] = true; });
        (u.marks || []).forEach(function (m) { learned[m] = true; });
        if (u.kind === 'kana') {
          var p = u.practice || [];
          if (p.length < 2 || p.length > 5) e.push(u.id + ': ' + p.length + ' practice words (want 2–5)');
          p.forEach(function (id) {
            if (items[id] && !readable(items[id].reading, learned)) e.push(u.id + ': practice ' + id + ' uses kana not learned yet');
          });
        }
        (u.vocab || []).forEach(function (id) { if (items[id]) written += items[id].word + ' '; });
        (u.kanji || []).forEach(function (id) {
          if (items[id] && written.indexOf(items[id].char) < 0) e.push(u.id + ': kanji ' + items[id].char + ' before any word written with it');
        });
        if (u.kind === 'lesson' && guide) {
          ['vocab', 'kanji', 'grammar'].forEach(function (f) {
            var n = (u[f] || []).length;
            if (n > Math.ceil(guide[f] * 1.25)) e.push(u.id + ': ' + n + ' ' + f + ' > guide ' + guide[f] + ' +25%');
            if (f === 'vocab' && n < Math.floor(guide[f] * 0.75)) e.push(u.id + ': ' + n + ' vocab < guide ' + guide[f] + ' −25%');
          });
        }
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) {
          (u[f] || []).forEach(function (id) {
            if (taught[id]) e.push(u.id + ': ' + id + ' already taught in ' + taught[id]);
            else taught[id] = u.id;
          });
        });
      });
    });
    return e;
  }

  // coverageErrors: every catalog kana / vocab / kanji / grammar item of a level with a plan is
  // taught exactly once — or, for a duplicate spelling, carries alt: <taught id> and is not taught.
  function coverageErrors(plan, items) {
    var e = [], taught = {};
    plan.forEach(function (lp) {
      lp.units.forEach(function (u) {
        Object.keys(UNIT_ITEM_FIELDS).forEach(function (f) { (u[f] || []).forEach(function (id) { taught[id] = lp.level; }); });
      });
    });
    var levels = plan.map(function (lp) { return lp.level; });
    Object.keys(items).forEach(function (id) {
      var it = items[id];
      if (!(it.kind in UNIT_ITEM_FIELDS) || levels.indexOf(it.level) < 0) return;
      if (it.alt) {
        if (taught[id]) e.push(id + ': has alt but is taught');
        if (!taught[it.alt]) e.push(id + ': alt ' + it.alt + ' is not taught');
      } else if (!taught[id]) e.push(id + ': not taught in the ' + it.level + ' plan');
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

  QUnit.test('shipped plan teaches every kana / vocab / kanji / grammar item of its levels (or its alt)', function (assert) {
    assert.deepEqual(coverageErrors(PLAN, CATALOG.items), []);
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
    assert.strictEqual(errsFor(ok('s:own:d', '読んでもいいですか。'), items), '', 'voiced て (読んで)');
    var iru = { id: 'g:te-iru', kind: 'grammar', level: 'N5', pattern: '〜ている', meaning: 'is ~ing', sources: ['x'], verified: false };
    items[iru.id] = iru;
    assert.strictEqual(errsFor(s('本を読んでいます。', [iru.id]), items), '', 'conjugated tail (ています)');
    assert.ok(/doesn't contain g:te-iru/.test(errsFor(s('本を読みます。', [iru.id]), items)), 'tail absent');
    items[iru.id] = with_(iru, { pattern: '〜くない/〜かった' });
    assert.strictEqual(errsFor(s('高かったです。', [iru.id]), items), '', "'/〜' alternatives: either one");
    assert.ok(/placeholder/.test(errsFor(with_(g, { pattern: 'Phase 6 review' }), items)), 'placeholder pattern');
  });

  QUnit.test('item checks: kana and alt', function (assert) {
    var a = { id: 'c:し', kind: 'kana', level: 'N5', char: 'し', romaji: 'shi', answers: ['shi', 'si'], script: 'hiragana', group: 'sa-row',
      sources: ['unicode', 'hepburn'], verified: true };
    assert.strictEqual(errsFor(a), '');
    assert.strictEqual(errsFor(with_(a, { id: 'c:シャ', char: 'シャ', romaji: 'sha', answers: ['sha'], script: 'katakana', group: 'youon' })), '', 'katakana combo');
    assert.ok(/not katakana/.test(errsFor(with_(a, { script: 'katakana' }))), 'script vs Unicode range');
    assert.ok(/id ≠/.test(errsFor(with_(a, { id: 'c:さ' }))), 'id ≠ char');
    assert.ok(/start with romaji/.test(errsFor(with_(a, { answers: ['si', 'shi'] }))), 'romaji first');
    assert.ok(/not romaji/.test(errsFor(with_(a, { answers: ['shi', 'し'] }))), 'answers are romaji');
    var kana = with_(v, { id: 'v:たべる|たべる', word: 'たべる' });
    var items = {}; items[kana.id] = kana;
    assert.strictEqual(errsFor(with_(v, { alt: kana.id }), items), '', 'alt to the kana spelling');
    assert.ok(/not a taught vocab/.test(errsFor(with_(v, { alt: 'v:nope|nope' }), items)), 'dangling alt');
    items['v:飲む|のむ'] = with_(v, { id: 'v:飲む|のむ', word: '飲む', reading: 'のむ' });
    assert.ok(/different word/.test(errsFor(with_(v, { alt: 'v:飲む|のむ' }), items)), 'alt to another word');
  });

  QUnit.test('plan checks: kana practice, kanji order, reviews, coverage', function (assert) {
    var items = {};
    [{ id: 'c:あ', kind: 'kana', char: 'あ' }, { id: 'c:お', kind: 'kana', char: 'お' }, { id: 'c:き', kind: 'kana', char: 'き' },
     { id: 'c:きゃ', kind: 'kana', char: 'きゃ' }, { id: 'c:く', kind: 'kana', char: 'く' },
     { id: 'v:青|あお', kind: 'vocab', word: '青', reading: 'あお' }, { id: 'v:秋|あき', kind: 'vocab', word: '秋', reading: 'あき' },
     { id: 'v:来た|きゃっく', kind: 'vocab', word: 'x', reading: 'きゃっく' }, { id: 'k:青', kind: 'kanji', char: '青' }]
      .forEach(function (it) { it.level = 'N5'; items[it.id] = it; });
    var kanaU = function (id, kana, practice, marks) { return { id: id, level: 'N5', kind: 'kana', title: 't', kana: kana, practice: practice, marks: marks }; };
    var ok = kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお', 'v:青|あお']);
    var run = function (units) { return planErrors([{ level: 'N5', units: units }], items).join('\n'); };
    assert.strictEqual(run([ok]), '');
    assert.ok(/practice v:秋\|あき uses kana not learned/.test(run([kanaU('n5.u001', ['c:あ'], ['v:青|あお', 'v:秋|あき'])])), 'unlearned kana');
    assert.ok(/1 practice words/.test(run([kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお'])])), '2–5 practice words');
    assert.strictEqual(run([kanaU('n5.u001', ['c:きゃ', 'c:く'], ['v:来た|きゃっく', 'v:来た|きゃっく'], ['っ'])]), '', 'combo + っ mark');
    assert.ok(/uses kana not learned/.test(run([kanaU('n5.u001', ['c:きゃ', 'c:く'], ['v:来た|きゃっく', 'v:来た|きゃっく'])])), 'っ needs its mark');
    var lesson = function (id, patch) {
      return Object.assign({ id: id, level: 'N5', kind: 'lesson', title: 'Colours', vocab: ['1', '2', '3', '4', '5', 'v:青|あお'] }, patch);
    };
    assert.ok(/kanji 青 before any word/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5', '6'], kanji: ['k:青'] })])), 'kanji before its word');
    assert.strictEqual(run([lesson('n5.u001'), lesson('n5.u002', { vocab: ['a', 'b', 'c', 'd', 'e', 'f'], kanji: ['k:青'] })]), '', 'kanji after its word');
    assert.ok(/5 vocab < guide/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5'] })])), 'underload');
    var seven = '1234567'.split('').map(function (n) { return lesson('n5.u00' + n, { vocab: [n + 'a', n + 'b', n + 'c', n + 'd', n + 'e', n + 'f'] }); });
    assert.ok(/n5.u007: more than 6 lessons/.test(run(seven)), 'review cadence');
    assert.ok(/review unit lists vocab/.test(run([{ id: 'n5.u001', level: 'N5', kind: 'review', title: 'Review', vocab: ['v:青|あお'] }])), 'review teaches nothing');
    var cov = function (units) { return coverageErrors([{ level: 'N5', units: units }], items).join('\n'); };
    assert.ok(/v:秋\|あき: not taught/.test(cov([lesson('n5.u001')])), 'untaught item');
    items['v:秋|あき'].alt = 'v:青|あお';
    assert.ok(!/v:秋/.test(cov([lesson('n5.u001')])), 'alt covered by its taught item');
    assert.ok(/has alt but is taught/.test(cov([lesson('n5.u001', { vocab: ['v:秋|あき'] })])), 'alt item taught');
  });

  QUnit.test('plan checks: taught twice, overload, placeholder title', function (assert) {
    var six = function (c) { return '123456'.split('').map(function (n) { return 'v:' + c + n + '|' + c; }); };
    var u = function (id, patch) { return Object.assign({ id: id, level: 'N5', kind: 'lesson', title: 'Food', vocab: six('a') }, patch); };
    assert.deepEqual(planErrors([{ level: 'N5', units: [u('n5.u001'), u('n5.u002', { vocab: six('b') }), u('n5.u003', { kind: 'review', title: 'Review', vocab: [] })] }]), []);
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
