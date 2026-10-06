"use strict";

// Exam-format questions modelled on the N5 mondai (ticket 11).
QUnit.module('exam-format questions (mondai)', function () {
  var lessons = function () { return buildUnits(PLAN, CATALOG).filter(function (u) { return u.kind === 'lesson'; }); };
  var text = function (parts) { return parts.map(function (p) { return p.t; }).join(''); };
  // every question of one form the N5 lessons can make (one make() per item)
  var _all = {};
  function all(form) {
    if (_all[form]) return _all[form];
    var out = [];
    lessons().forEach(function (u) {
      var ctx = quizContext(u);
      ctx.items.forEach(function (it) {
        formsFor(it, ctx).forEach(function (f) {
          var ex = f.name === form && f.make();
          if (ex) out.push(Object.assign(ex, { item: it, ctx: ctx }));
        });
      });
    });
    return (_all[form] = out);
  }
  var underlined = function (ex) { return ex.parts.filter(function (p) { return p.u; }); };
  var sentenceOf = function (ex) { return CATALOG.items[ex.sentence]; };

  QUnit.test('sliceParts / spliceParts / wordSpan', function (assert) {
    var parts = furiganaParts('[毎日|まい|にち][学校|がっ|こう]へ[行|い]きます。');
    assert.strictEqual(text(sliceParts(parts, 2, 4)), '学校');
    assert.strictEqual(sliceParts(parts, 2, 4)[0].r, 'がっ', 'whole ruby blocks keep their ruby');
    assert.deepEqual(text(spliceParts(parts, 2, 4, [{ t: 'X' }])), '毎日Xへ行きます。');
    assert.strictEqual(spliceParts(furiganaParts('[今日|きょう]は'), 1, 3, []), null, 'never cuts a furigana block');
    assert.deepEqual(wordSpan(parts, '学校', 'がっこう'), { at: 2, end: 4 });
    assert.deepEqual(wordSpan(furiganaParts('[食|た]べる。'), '食べる', 'たべる'), { at: 0, end: 3 }, 'okurigana');
    assert.strictEqual(wordSpan(furiganaParts('カナダ[人|じん]です。'), '人', 'ひと'), null, 'same kanji, other reading');
    assert.strictEqual(wordSpan(furiganaParts('[本|ほん]と[本|ほん]'), '本', 'ほん'), null, 'twice: ambiguous');
    assert.strictEqual(wordSpan(furiganaParts('[今日|きょう]は'), '今', 'いま'), null, 'inside a block');
  });

  QUnit.test('spellingFakes: real kanji swapped in (same sound or look-alike), never a real spelling of the reading', function (assert) {
    var v = CATALOG.items['v:学校|がっこう'];
    var fakes = spellingFakes(v);
    assert.ok(fakes.length >= 3, fakes.join(' '));
    fakes.forEach(function (w) {
      assert.strictEqual(w.length, 2, w);
      assert.ok(w !== '学校' && hasKanji(w), w);
      assert.ok(w.charAt(0) === '学' || w.charAt(1) === '校', 'one kanji changed: ' + w);
    });
    var atsui = spellingFakes(CATALOG.items['v:暑い|あつい']);
    assert.ok(atsui.indexOf('熱い') < 0 && atsui.indexOf('厚い') < 0, 'other あつい words are valid spellings of the sound: ' + atsui.join(' '));
  });

  QUnit.test('漢字読み (kanji_yomi): sentence, the word underlined without furigana, choose its reading', function (assert) {
    var exs = all('kanjiYomi');
    assert.ok(exs.length > 10, exs.length + ' questions'); // was 40+ before untaught-kanji words lost this form
    exs.forEach(function (ex) {
      var v = ex.item, u = underlined(ex);
      if (u.length !== 1 || u[0].t !== v.word || u[0].r) return assert.ok(false, v.id + ' underline ' + JSON.stringify(u));
      if (text(ex.parts) !== sentenceOf(ex).jp) assert.ok(false, v.id + ' sentence text');
      ex.parts.forEach(function (p) {
        if (p.r && Array.from(p.t).some(function (ch) { return hasKanji(ch) && v.word.indexOf(ch) >= 0; })) assert.ok(false, v.id + ' ruby on a tested kanji: ' + p.t);
        if (p.r && Array.from(p.t).every(function (ch) { return !hasKanji(ch) || ex.ctx.taughtKanji[ch]; })) assert.ok(false, v.id + ' ruby on taught ' + p.t);
      });
      if (ex.options.length !== 4 || new Set(ex.options).size !== 4) assert.ok(false, v.id + ' options ' + ex.options);
      if (ex.options[ex.correct] !== v.reading) assert.ok(false, v.id + ' answer');
      var valid = catalogOf('vocab').filter(function (x) { return x.word === v.word; }).map(function (x) { return x.reading; });
      ex.options.forEach(function (o, i) { if (i !== ex.correct && valid.indexOf(o) >= 0) assert.ok(false, v.id + ' distractor ' + o + ' is a reading of ' + v.word); });
    });
    assert.strictEqual(exs[0].type, 'kanji_yomi');
  });

  QUnit.test('表記 (hyouki): the word in hiragana underlined, choose its kanji; only taught kanji asked', function (assert) {
    var exs = all('hyouki');
    assert.ok(exs.length > 30, exs.length + ' questions');
    exs.forEach(function (ex) {
      var v = CATALOG.items[ex.word], u = underlined(ex), real =catalogOf('vocab').filter(function (x) { return x.reading === v.reading; }).map(function (x) { return x.word; });
      if (u.length !== 1 || u[0].t !== v.reading) return assert.ok(false, v.id + ' underline ' + JSON.stringify(u));
      if (text(ex.parts).indexOf(v.word) >= 0) assert.ok(false, v.id + ' sentence gives the spelling away');
      if (ex.options[ex.correct] !== v.word || new Set(ex.options).size !== 4) assert.ok(false, v.id + ' options ' + ex.options);
      ex.options.forEach(function (o, i) {
        if (i !== ex.correct && real.indexOf(o) >= 0) assert.ok(false, v.id + ' distractor ' + o + ' is a real spelling');
        if (!hasKanji(o)) assert.ok(false, v.id + ' option without kanji ' + o);
      });
      Array.from(v.word).forEach(function (ch) { if (hasKanji(ch) && !ex.ctx.taughtKanji[ch]) assert.ok(false, v.id + ' kanji ' + ch + ' not taught'); });
    });
  });

  QUnit.test('文脈規定 (bunmyaku): catalog sentence with the word blanked, same-POS options, one sense fits', function (assert) {
    var exs = all('bunmyaku');
    assert.ok(exs.length > 25, exs.length + ' questions'); // was 40+ before untaught-kanji words lost this form
    exs.forEach(function (ex) {
      var v = ex.item, s = sentenceOf(ex), t = text(ex.parts);
      if (t.split(GAP_BLANK).length !== 2) return assert.ok(false, v.id + ' one blank: ' + t);
      if (ex.options.length !== 4 || new Set(ex.options).size !== 4) assert.ok(false, v.id + ' options ' + ex.options);
      if (t.replace(GAP_BLANK, v.word) !== s.jp && t.replace(GAP_BLANK, v.reading) !== s.jp) assert.ok(false, v.id + ' blank is the word');
      if (!ex.note) assert.ok(false, v.id + ' English note');
      ex.optionItems.forEach(function (o, i) {
        if (i === ex.correct) return;
        if (o.pos !== v.pos) assert.ok(false, v.id + ' distractor ' + o.id + ' pos ' + o.pos);
        if (sharesSense(glossText(o), glossText(v))) assert.ok(false, v.id + ' distractor ' + o.id + ' shares a sense');
      });
    });
  });

  QUnit.test('文の文法2 (order ★): four authored chunks, the ★ slot is one the data allows', function (assert) {
    // ★ sentences using items taught after the lesson are skipped there (teaching order, docs/adr/0002)
    assert.ok(all('order').length >= 15, all('order').length + ' questions in lessons');
    var chunked = catalogOf('sentence').filter(function (s) { return s.chunks; });
    assert.ok(chunked.length >= 40, chunked.length + ' chunked sentences');
    var taught = taughtIds(buildUnits(PLAN, CATALOG).slice(-1)[0]);
    chunked.forEach(function (s) {
      if (!s.uses.some(function (id) { return /^g:/.test(id) && taught[id]; })) assert.ok(false, s.id + ' uses no taught grammar point (never asked)');
    });
    var exs = [].concat.apply([], chunked.map(function (s) { return [1, 2, 3, 4, 5, 6].map(function () { return orderQuestion(s, {}); }); }));
    exs.forEach(function (ex) {
      var s = sentenceOf(ex), c = s.chunks;
      if (ex.options.slice().sort().join() !== c.move.slice().sort().join()) assert.ok(false, s.id + ' options = chunks');
      if (ex.options[ex.correct] !== c.move[ex.star]) assert.ok(false, s.id + ' answer = chunk at ★');
      if ((c.star || [0, 1, 2, 3]).indexOf(ex.star) < 0) assert.ok(false, s.id + ' ★ slot ' + ex.star + ' not allowed');
      var t = text(ex.parts);
      if (t.indexOf(c.pre) !== 0 || t.slice(t.length - c.post.length) !== c.post || t.split('★').length !== 2) assert.ok(false, s.id + ' frame ' + t);
      if (ex.optionParts.map(text).join() !== ex.options.join()) assert.ok(false, s.id + ' option furigana parts');
    });
  });

  QUnit.test('言い換え類義 (iikae) + 文章の文法 (bunshou) via mondaiQuestions', function (assert) {
    var u = lessons().slice(-1)[0], ctx = quizContext(u);
    var ik = catalogOf('mondai').filter(function (m) { return m.type === 'iikae'; });
    assert.ok(ik.length >= 15, ik.length + ' iikae items');
    ik.forEach(function (m) {
      var q = mondaiQuestions('iikae', m, ctx);
      assert.strictEqual(q.length, 1);
      assert.strictEqual(q[0].options[q[0].correct], m.options[m.answer], m.id);
      assert.strictEqual(underlined(q[0])[0].t, m.underline);
      assert.strictEqual(q[0].itemId, m.id);
    });
    var bs = catalogOf('mondai').filter(function (m) { return m.type === 'bunshou'; });
    assert.ok(bs.length >= 5, bs.length + ' bunshou items');
    bs.forEach(function (m) {
      var qs = mondaiQuestions('bunshou', m, ctx);
      assert.strictEqual(qs.length, m.blanks.length, m.id + ' one question per blank');
      qs.forEach(function (q, i) {
        assert.strictEqual(q.options[q.correct], m.blanks[i].options[m.blanks[i].answer]);
        var hot = q.passageParts.filter(function (p) { return p.u; });
        assert.strictEqual(hot.length, 1, 'current blank marked');
        assert.ok(hot[0].t.indexOf(String(i + 1)) >= 0);
      });
    });
    assert.deepEqual(mondaiQuestions('kanjiYomi', CATALOG.items['v:学校|がっこう'], ctx).map(function (q) { return q.type; }), ['kanji_yomi'], 'item-based types too');
    assert.ok(MONDAI.order && MONDAI.order.no === 2 && MONDAI.hyouki.section === 'moji-goi', 'mondai table');
  });

  QUnit.test('unit quizzes ask the new types', function (assert) {
    var seen = {};
    // two builds of every lesson: sentence formats only use sentences with nothing taught later, so they are rarer
    for (var r = 0; r < 2; r++) lessons().forEach(function (u) { buildExercises(u).forEach(function (e) { seen[e.type] = true; }); });
    ['kanji_yomi', 'hyouki', 'bunmyaku', 'order', 'gap'].forEach(function (t) { assert.ok(seen[t], t); });
  });
});
