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
    passage: ['furigana', 'jp', 'en', 'format'], listening: ['format', 'en', 'explain'], kana: ['char', 'romaji', 'script', 'group'], mondai: ['type', 'en'], mock: ['format', 'title'] };
  var CHUNK_PUNCT_RE = /[、。？！?!\s「」]/;
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
      if (it.reading === 'する') return /し[てたまな]|さ[せれ]/.test(jp); // irregular: して, しました, しない, させる
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
    // own passages / listening scripts are verified by their own rule (map Q1): see ownTextErrors
    if (it.verified && nonEmptyStrings(it.sources) && it.kind !== 'passage' && it.kind !== 'listening') {
      var distinct = it.sources.filter(function (s, i, a) { return a.indexOf(s) === i; });
      if (distinct.length < 2) err('verified needs ≥2 distinct sources');
      if (distinct.indexOf('legacy') >= 0) err("verified can't cite legacy");
    }
    (REQUIRED[it.kind] || []).forEach(function (f) { if (typeof it[f] !== 'string' || !it[f]) err('missing ' + f); });
    // glosses / meanings are English only: quiz prompts show them (vocab hints go in usage, grammar in notes)
    if (/^(vocab|kanji|grammar)$/.test(it.kind)) [].concat(it.gloss || it.meaning || []).forEach(function (g) {
      if (/[぀-ヿ㐀-鿿～〜]/.test(g)) err('Japanese in gloss/meaning: ' + g);
    });
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
      usesErrors(it.uses, it.jp, items, err);
      if (it.furigana && furiganaText(it.furigana) !== it.jp) err('furigana text ≠ jp');
      if (it.chunks) chunkErrors(it, err);
    } else if (it.kind === 'mondai') {
      if (!/^m:[a-z0-9-]+$/.test(it.id)) err('id not m:<slug>');
      var four = function (o) { return Array.isArray(o) && o.length === 4 && nonEmptyStrings(o) && new Set(o).size === 4; };
      var answerOk = function (b) { return four(b.options) && b.answer === Math.floor(b.answer) && b.answer >= 0 && b.answer < 4; };
      if (it.type === 'iikae') {
        if (typeof it.jp !== 'string' || !it.underline || it.jp.indexOf(it.underline) < 0) err('underline not in jp');
        if (!answerOk(it)) err('needs 4 distinct options + answer index');
        else if (it.options.indexOf(it.jp) >= 0) err('the sentence itself is an option');
        else usesErrors(it.uses, it.jp + it.options[it.answer], items, err); // the word and its paraphrase
      } else if (it.type === 'bunshou') {
        var marks = (it.text || '').match(/［\d+］/g) || [], blanks = it.blanks || [];
        if (!blanks.length || marks.join() !== blanks.map(function (_, i) { return '［' + (i + 1) + '］'; }).join()) err('blanks ［1］… must match blanks[] in order');
        blanks.forEach(function (b, i) { if (!answerOk(b)) err('blank ' + (i + 1) + ' needs 4 distinct options + answer index'); });
        if (!e.length) usesErrors(it.uses, furiganaText(bunshouFilled(it)), items, err);
      } else err('type ' + it.type);
    } else if (it.kind === 'passage') e = e.concat(passageErrors(it, items));
    else if (it.kind === 'listening') e = e.concat(listeningErrors(it, items));
    // mock (ticket 18): its authored gap / bunmyaku sentences, blank filled, plus options, as an own text
    else if (it.kind === 'mock') {
      var authored = [].concat.apply([], ['vocab', 'grammar', 'listening'].map(function (k) { return (it.sections || {})[k] || []; }))
        .filter(function (q) { return q.f; });
      e = e.concat(ownTextErrors(it, authored.map(function (q) { return q.f.replace('（　）', q.o[q.a]) + '\n' + q.o.join('\n'); }).join('\n'), items));
    }
    return e;
  }

  // ── Reading passages (ticket 15) ──────────────────────────────────────────
  // Per format: questions wanted, length of jp in characters (whitespace not counted).
  var PASSAGE_FORMATS = { short: { q: 1, len: [50, 160] }, mid: { q: 2, len: [180, 360] }, info: { q: 1, len: [90, 300] } };
  var RUBY_RE = /\[([^|\]]+)\|([^\]]*)\]/g;
  function stripRuby(s) { return s.replace(RUBY_RE, '$1'); }
  // A kanji's readings in hiragana: on, kun stems and full kun (た.べる → た, たべる), extra.
  function kanjiHira(k) {
    var out = [];
    (k.on || []).concat(k.extra || []).forEach(function (r) { out.push(hira(r)); });
    (k.kun || []).forEach(function (r) { r = r.replace(/-/g, ''); out.push(r.split('.')[0], r.replace('.', '')); });
    return out;
  }
  // passageErrors: the machine checks for an own passage (data/<lvl>/passages.js header).
  // Limit: there is no tokenizer, so a content word left out of `uses` is caught only when it is
  // written in kanji or katakana (the kanji, ruby and katakana checks below); a kana-only word
  // missing from `uses` is not. `uses` is kept by hand for that reason.
  function passageErrors(it, items) {
    var e = [];
    function err(msg) { e.push(it.id + ': ' + msg); }
    var f = PASSAGE_FORMATS[it.format];
    if (!/^p:n[1-5]-[a-z0-9-]+$/.test(it.id)) err('id not p:<level>-<slug>');
    if (!f) return [it.id + ': format ' + it.format];
    if (stripRuby(it.furigana) !== it.jp) err('jp ≠ furigana text');
    var len = it.jp.replace(/\s/g, '').length;
    if (len < f.len[0] || len > f.len[1]) err(len + ' characters (want ' + f.len.join('–') + ' for ' + it.format + ')');
    if (it.format === 'info' && it.jp.split('\n').filter(function (l) { return /^・/.test(l); }).length < 3) err('info passage needs a table/list (≥3 ・ lines)');
    var qs = Array.isArray(it.questions) ? it.questions : [];
    if (qs.length !== f.q) err(qs.length + ' questions (want ' + f.q + ')');
    qs.forEach(function (q, i) {
      if (!q.q || !q.explain) err('question ' + (i + 1) + ' needs q + explain');
      optionErrors(q, 4, function (m) { err('question ' + (i + 1) + ' ' + m); });
    });
    // All the Japanese: passage, questions and options.
    var marked = [].concat.apply([it.furigana], qs.map(function (q) { return [q.q || ''].concat(q.options || []); })).join('\n');
    return e.concat(ownTextErrors(it, marked, items));
  }
  // optionErrors(q, n, err): q.options = n distinct non-empty strings, q.answer an index into them.
  function optionErrors(q, n, err) {
    var opts = (q.options || []).map(stripRuby);
    if (opts.length !== n || opts.some(function (o) { return !o; })) err('needs ' + n + ' options');
    if (opts.some(function (o, j) { return opts.indexOf(o) !== j; })) err('options not distinct');
    if (!(q.answer >= 0 && q.answer < opts.length && q.answer % 1 === 0)) err('answer out of range');
  }
  // ownTextErrors(it, marked, items): the checks shared by own texts (passages, listening scripts)
  // over all their Japanese (`marked`, with [漢字|かな] ruby): uses present in the text, kanji on
  // the level's list + in uses + inside ruby, ruby readings backed, katakana words covered,
  // verified rule.
  function ownTextErrors(it, marked, items) {
    var e = [];
    function err(msg) { e.push(it.id + ': ' + msg); }
    var plain = stripRuby(marked).replace(/\s/g, '');
    var kana = marked.replace(RUBY_RE, '$2').replace(/\s/g, '');
    var names = it.names || [];
    var used = (it.uses || []).map(function (id) { return items[id]; }).filter(Boolean);
    var vocab = used.filter(function (x) { return x.kind === 'vocab'; });
    (it.uses || []).forEach(function (id) {
      var u = items[id];
      if (!u) return err('uses missing ' + id);
      if (u.kind === 'grammar') {
        // pattern words in kanji the passage writes in kana (一番, 好き): match their readings
        var kanaPattern = u.pattern;
        Object.keys(items).map(function (k) { return items[k]; })
          .filter(function (w) { return w.kind === 'vocab' && hasKanji(w.word); })
          .sort(function (a, b) { return b.word.length - a.word.length; }) // 上手 before 上
          .forEach(function (w) { kanaPattern = kanaPattern.split(w.word).join(w.reading); });
        if (!surfaceMatch(u, plain) && !surfaceMatch({ kind: 'grammar', pattern: kanaPattern }, kana)) err("text doesn't contain " + id);
      } else if (!surfaceMatch(u, plain) && !surfaceMatch(u, kana)) err("text doesn't contain " + id);
    });
    // Kanji: each one on the level's list (or an easier one), listed in uses, and inside a ruby block.
    Array.from(plain).filter(function (c, i, a) { return hasKanji(c) && a.indexOf(c) === i; }).forEach(function (c) {
      var k = items['k:' + c];
      if (!k || levelRank(k.level) > levelRank(it.level)) err('kanji ' + c + ' not on the ' + it.level + ' list');
      else if ((it.uses || []).indexOf(k.id) < 0) err('kanji ' + c + ' not in uses');
    });
    if (hasKanji(marked.replace(RUBY_RE, ''))) err('kanji outside a [漢字|かな] block');
    // Each ruby reading backed by a used word (word with the block read = its reading), a name, or the kanji's readings.
    var m;
    RUBY_RE.lastIndex = 0;
    while ((m = RUBY_RE.exec(marked))) {
      var t = m[1], r = m[2];
      var ok = (t === 'は' && r === 'わ') || // particle は spoken wa (TTS input; the shown text stays は)
        names.indexOf(t + '|' + r) >= 0 ||
        vocab.some(function (w) { return w.word.indexOf(t) >= 0 && hira(w.word.replace(t, r)) === hira(w.reading); }) ||
        (Array.from(t).length === 1 && items['k:' + t] && kanjiHira(items['k:' + t]).indexOf(r) >= 0);
      if (!ok) err('ruby ' + t + '|' + r + ' not backed by a used word, name or kanji reading');
    }
    // Katakana words: each one a used vocab word or a name.
    (stripRuby(marked).match(/[ァ-ヺ][ァ-ヺー]+/g) || []).forEach(function (w) {
      if (names.indexOf(w) < 0 && !vocab.some(function (x) { return x.word === w || x.reading === w; })) err('katakana ' + w + ' not in uses or names');
    });
    if (it.verified) {
      if (it.sources.join() !== 'own') err("verified own text must be sources ['own']");
      used.forEach(function (u) { if (!u.verified) err('verified, but uses unverified ' + u.id); });
    }
    return e;
  }

  // ── Listening scripts (ticket 17) ─────────────────────────────────────────
  // Per format: options, question wanted, line shape (data/<lvl>/listening.js header).
  var LISTEN_FORMATS = {
    task: { n: 4, question: true }, point: { n: 4, question: true },
    utterance: { n: 3, question: true, spoken: true }, quick: { n: 3, question: false, spoken: true }
  };
  function listeningErrors(it, items) {
    var e = [];
    function err(msg) { e.push(it.id + ': ' + msg); }
    var f = LISTEN_FORMATS[it.format];
    if (!/^l:n[1-5]-[a-z0-9-]+$/.test(it.id)) err('id not l:<level>-<slug>');
    if (!f) return [it.id + ': format ' + it.format];
    var lines = Array.isArray(it.lines) ? it.lines : [];
    var who = lines.map(function (l) { return l.speaker; }).join('');
    if (lines.some(function (l) { return typeof l.furigana !== 'string' || !l.furigana || ['M', 'F', 'N'].indexOf(l.speaker) < 0; })) err('every line needs speaker M/F/N + furigana');
    else if (it.format === 'quick' && !/^[MF]$/.test(who)) err('quick: one M or F line');
    else if (it.format === 'utterance' && !/^N+$/.test(who)) err('utterance: narrator lines only');
    else if (f.n === 4 && !/^N[MF]+$/.test(who)) err(it.format + ': a narrator scene line, then M/F lines');
    if (f.question !== (typeof it.question === 'string' && !!it.question)) err(f.question ? 'needs a question' : 'quick has no question');
    if (f.spoken && ['M', 'F'].indexOf(it.optionSpeaker) < 0) err('spoken options need optionSpeaker M/F');
    optionErrors(it, f.n, err);
    var marked = lines.map(function (l) { return l.furigana || ''; }).concat(it.question || '', it.options || []).join('\n');
    return e.concat(ownTextErrors(it, marked, items));
  }
  function usesErrors(uses, jp, items, err) {
    (uses || []).forEach(function (id) {
      if (!items[id]) err('uses missing ' + id);
      else if (!surfaceMatch(items[id], jp)) err("jp doesn't contain " + id);
    });
  }
  function furiganaText(s) { return furiganaParts(s).map(function (p) { return p.t; }).join(''); }
  function bunshouFilled(m) { return m.text.replace(/［(\d+)］/g, function (_, n) { var b = m.blanks[n - 1]; return b.options[b.answer]; }); }

  // ★ chunks (文の文法2): pre + move + post spell jp exactly; four distinct chunks with no
  // punctuation; no chunk edge inside a furigana block; star = allowed ★ slots (0-3).
  function chunkErrors(it, err) {
    var c = it.chunks, mv = c.move;
    if (typeof c.pre !== 'string' || typeof c.post !== 'string' || !Array.isArray(mv) || mv.length !== 4 || !nonEmptyStrings(mv)) return err('chunks need pre, post and 4 move strings');
    if (c.pre + mv.join('') + c.post !== it.jp) err('chunks ≠ jp: ' + c.pre + mv.join('|') + c.post);
    if (new Set(mv).size !== 4) err('chunks not distinct');
    mv.forEach(function (m) { if (CHUNK_PUNCT_RE.test(m)) err('chunk has punctuation: ' + m); });
    if (c.star !== undefined && !(Array.isArray(c.star) && c.star.length && c.star.every(function (n) { return [0, 1, 2, 3].indexOf(n) >= 0; }))) err('star must list slots 0-3');
    var parts = furiganaParts(it.furigana || it.jp), at = c.pre.length;
    [at].concat(mv.map(function (m) { return at += m.length; })).forEach(function (x) {
      var pos = 0;
      parts.forEach(function (p) { var s = pos; pos += p.t.length; if (p.r && s < x && x < pos) err('chunk edge cuts furigana ' + p.t); });
    });
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
  //   kana units (ticket 42): 2–5 taught words (vocab) spelled in kana of the unit's script, up to 5
  //            practice words, ≥3 words in all; every word readable with the kana (and marks っ ー)
  //            learned so far.
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
          // a review's passage (short) / listening item: used once, at most one of each, every
          // vocab / grammar item in it taught by now
          Object.keys(UNIT_QUIZ_FIELDS).forEach(function (f) {
            var kind = UNIT_QUIZ_FIELDS[f];
            if ((u[f] || []).length > 1) e.push(u.id + ': more than one ' + kind);
            (u[f] || []).forEach(function (id) {
              var p = items[id];
              if (!p || p.kind !== kind) return e.push(u.id + ': ' + kind + ' ' + id + ' missing');
              if (kind === 'passage' && p.format !== 'short') e.push(u.id + ': review passage ' + id + ' is ' + p.format + ', not short');
              if (taught[id]) e.push(u.id + ': ' + kind + ' ' + id + ' already in ' + taught[id]);
              taught[id] = u.id;
              (p.uses || []).forEach(function (x) { if (/^[vg]:/.test(x) && !taught[x]) e.push(u.id + ': ' + kind + ' ' + id + ' uses ' + x + ', not taught yet'); });
            });
          });
          lessons = 0;
          return;
        }
        if (PLACEHOLDER_RE.test(u.title || '')) e.push(u.id + ': placeholder title ' + u.title);
        if (u.kind === 'lesson' && ++lessons > 6) e.push(u.id + ': more than 6 lessons since the last review');
        (u.kana || []).forEach(function (id) { if (items[id]) learned[items[id].char] = true; });
        (u.marks || []).forEach(function (m) { learned[m] = true; });
        if (u.kind === 'kana') {
          var p = u.practice || [], w = u.vocab || [];
          var script = (items[(u.kana || [])[0]] || {}).script === 'katakana' ? /^[ァ-ヺー]+$/ : /^[ぁ-ゖっ]+$/;
          if (w.length < 2 || w.length > 5) e.push(u.id + ': ' + w.length + ' taught words (want 2–5)');
          if (p.length > 5) e.push(u.id + ': ' + p.length + ' practice words (want ≤5)');
          if (w.length + p.length < 3) e.push(u.id + ': ' + (w.length + p.length) + ' words in all (want ≥3)');
          w.forEach(function (id) {
            var it = items[id];
            if (!it) return;
            if (!script.test(it.word)) e.push(u.id + ': word ' + id + ' not spelled in the unit\'s kana script');
            else if (!readable(it.word, learned)) e.push(u.id + ': word ' + id + ' uses kana not learned yet');
          });
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
    assert.ok(/Japanese in gloss/.test(errsFor(with_(v, { gloss: ['Mr., Ms. (～さん)'] }))), 'Japanese in vocab gloss');
    assert.ok(/Japanese in gloss/.test(errsFor(with_(k, { meaning: ['eat (食べる)'] }))), 'Japanese in kanji meaning');
    assert.strictEqual(errsFor(with_(v, { usage: '～さん' })), '', 'Japanese in usage is fine');
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

  QUnit.test('item checks: ★ chunks join to jp, distinct, no punctuation, no cut furigana', function (assert) {
    var base = with_(s('本を読むのが好きです。', []), { furigana: '[本|ほん]を[読|よ]むのが[好|す]きです。' });
    var ch = function (pre, move, post, star) { return with_(base, { chunks: { pre: pre, move: move, post: post, star: star } }); };
    assert.strictEqual(errsFor(ch('', ['本を', '読む', 'のが', '好き'], 'です。')), '');
    assert.strictEqual(errsFor(ch('', ['本を', '読む', 'のが', '好き'], 'です。', [2, 3])), '', 'star slots');
    assert.ok(/chunks ≠ jp/.test(errsFor(ch('', ['本を', '読む', 'が', '好き'], 'です。'))), 'chunks must spell jp');
    assert.ok(/4 move/.test(errsFor(ch('', ['本を', '読むのが', '好き'], 'です。'))), 'four chunks');
    assert.ok(/not distinct/.test(errsFor(with_(s('のがのがのがのがです。', []), { chunks: { pre: '', move: ['のが', 'のが', 'のが', 'のが'], post: 'です。' } }))), 'distinct');
    assert.ok(/punctuation/.test(errsFor(ch('', ['本を', '読む', 'のが', '好きです。'], ''))), 'no punctuation in a chunk');
    assert.ok(/cuts furigana/.test(errsFor(with_(ch('', ['本を', '読む', 'のが', '好き'], 'です。'), { furigana: '[本を読|ほんをよ]むのが[好|す]きです。' }))), 'chunk edge inside a furigana block');
    assert.ok(/star/.test(errsFor(ch('', ['本を', '読む', 'のが', '好き'], 'です。', [4]))), 'bad star');
    assert.ok(/furigana text ≠ jp/.test(errsFor(with_(base, { furigana: '[本|ほん]をよむのが[好|す]きです。' }))), 'furigana must match jp');
  });

  QUnit.test('item checks: mondai (iikae / bunshou)', function (assert) {
    var ik = { id: 'm:x', kind: 'mondai', type: 'iikae', level: 'N5', jp: 'へやがくらいです。', underline: 'くらい', options: ['a', 'b', 'c', 'd'], answer: 0,
      en: 'x', uses: [], sources: ['own'], verified: false };
    assert.strictEqual(errsFor(ik), '');
    assert.ok(/underline/.test(errsFor(with_(ik, { underline: 'あかるい' }))), 'underline in jp');
    assert.ok(/4 distinct/.test(errsFor(with_(ik, { options: ['a', 'a', 'c', 'd'] }))), 'distinct options');
    assert.ok(/4 distinct/.test(errsFor(with_(ik, { answer: 4 }))), 'answer index');
    assert.ok(/id not m:/.test(errsFor(with_(ik, { id: 'm:X Y' }))), 'id');
    assert.ok(/missing en/.test(errsFor(with_(ik, { en: '' }))), 'en required');
    var bs = { id: 'm:y', kind: 'mondai', type: 'bunshou', level: 'N5', text: '[本|ほん]［1］[読|よ]み［2］。', en: 'x', uses: ['v:食べる|たべる'],
      blanks: [{ options: ['を', 'が', 'に', 'で'], answer: 0 }, { options: ['ます', 'ない', 'た', 'て'], answer: 0 }], sources: ['own'], verified: false };
    var items = {}; items[v.id] = with_(v, { id: v.id });
    assert.ok(/doesn't contain v:食べる/.test(errsFor(bs, items)), 'uses checked on the filled text');
    assert.strictEqual(errsFor(with_(bs, { uses: [] })), '');
    assert.ok(/match blanks/.test(errsFor(with_(bs, { uses: [], text: '本［2］読み［1］。' }))), 'blank order');
    assert.ok(/blank 2/.test(errsFor(with_(bs, { uses: [], blanks: [bs.blanks[0], { options: ['ます'], answer: 0 }] }))), 'blank options');
    assert.ok(/type/.test(errsFor(with_(bs, { type: 'nope' }))), 'type');
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

  QUnit.test('item checks: reading passages', function (assert) {
    var g = { id: 'g:wo', kind: 'grammar', level: 'N5', pattern: '〜を', meaning: 'object', sources: ['tanos', 'genki'], verified: true };
    var items = {}; [v, k, g].forEach(function (it) { items[it.id] = it; });
    var mk = function (fur, patch) {
      return Object.assign({ id: 'p:n5-x', kind: 'passage', level: 'N5', format: 'short', furigana: fur, jp: stripRuby(fur), en: 'x',
        questions: [{ q: 'なにを　たべますか。', options: ['パン', 'ごはん', 'みず', 'おちゃ'], answer: 0, explain: 'x' }],
        names: ['パン'], uses: [g.id, v.id, k.id], sources: ['own'], verified: true }, patch);
    };
    var text = new Array(8).join('パンを　[食|た]べます。');
    var p = mk(text);
    assert.strictEqual(errsFor(p, items), '', 'good passage');
    assert.ok(/kanji 飲 not on the N5 list/.test(errsFor(mk(text + '[飲|の]みます。'), items)), 'kanji off the list');
    assert.ok(/outside a/.test(errsFor(mk(text + '食べます。'), items)), 'kanji without ruby');
    assert.ok(/ruby 食\|く not backed/.test(errsFor(mk(text + '[食|く]べます。'), items)), 'wrong ruby reading');
    assert.ok(/katakana パン not in uses/.test(errsFor(mk(text, { names: [] }), items)), 'katakana word not covered');
    items['v:犬|いぬ'] = with_(v, { id: 'v:犬|いぬ', word: '犬', reading: 'いぬ', pos: 'noun' });
    assert.ok(/text doesn't contain v:犬/.test(errsFor(mk(text, { uses: p.uses.concat('v:犬|いぬ') }), items)), 'use not in the text');
    assert.ok(/uses missing v:nope/.test(errsFor(mk(text, { uses: p.uses.concat('v:nope|nope') }), items)), 'dangling use');
    var q = function (patch) { return [Object.assign({}, p.questions[0], patch)]; };
    assert.ok(/not distinct/.test(errsFor(mk(text, { questions: q({ options: ['パン', 'パン', 'みず', 'おちゃ'] }) }), items)), 'options distinct');
    assert.ok(/answer out of range/.test(errsFor(mk(text, { questions: q({ answer: 4 }) }), items)), 'answer in range');
    assert.ok(/needs 4 options/.test(errsFor(mk(text, { questions: q({ options: ['パン', 'みず'] }) }), items)), '4 options');
    assert.ok(/2 questions/.test(errsFor(mk(text, { questions: p.questions.concat(p.questions) }), items)), 'short has 1 question');
    assert.ok(/table\/list/.test(errsFor(mk(text, { format: 'info' }), items)), 'info needs a list');
    assert.strictEqual(errsFor(mk('・パン\n・パン\n・パン\n' + text + text, { format: 'info' }), items), '', 'info with a list');
    assert.ok(/characters/.test(errsFor(mk('パンを　[食|た]べます。'), items)), 'length');
    items[v.id] = with_(v, { verified: false });
    assert.ok(/uses unverified v:食べる/.test(errsFor(p, items)), 'verified needs verified uses');
    assert.strictEqual(errsFor(mk(text, { verified: false }), items), '', 'unverified is fine');
  });

  QUnit.test('item checks: listening scripts', function (assert) {
    var g = { id: 'g:ka', kind: 'grammar', level: 'N5', pattern: '〜か', meaning: 'question', sources: ['tanos', 'genki'], verified: true };
    var items = {}; [v, k, g].forEach(function (it) { items[it.id] = it; });
    var mk = function (patch) {
      return Object.assign({ id: 'l:n5-x', kind: 'listening', level: 'N5', format: 'quick', en: 'x', explain: 'x',
        lines: [{ speaker: 'M', furigana: 'パンを　[食|た]べますか。' }], optionSpeaker: 'F',
        options: ['[食|た]べます。', 'パンです。', 'パンを　[食|た]べました。'], answer: 0,
        names: ['パン'], uses: [g.id, v.id, k.id], sources: ['own'], verified: true }, patch);
    };
    assert.strictEqual(errsFor(mk({}), items), '', 'good quick item');
    assert.ok(/needs 3 options/.test(errsFor(mk({ options: ['[食|た]べます。', 'パンです。'] }), items)), 'quick has 3 options');
    assert.ok(/quick has no question/.test(errsFor(mk({ question: 'パンですか。' }), items)), 'quick has no question');
    assert.ok(/one M or F line/.test(errsFor(mk({ lines: [{ speaker: 'N', furigana: 'パンですか。' }] }), items)), 'quick line is M/F');
    assert.ok(/optionSpeaker/.test(errsFor(mk({ optionSpeaker: 'N' }), items)), 'spoken options need a speaker');
    var task = { format: 'task', question: 'パンを　[食|た]べますか。', options: ['パン', 'パンと　[食|た]べもの', 'パンを　[食|た]べる', 'パンです'] };
    assert.ok(/narrator scene line/.test(errsFor(mk(task), items)), 'task opens with a narrator line');
    assert.ok(/kanji outside/.test(errsFor(mk({ options: ['食べます。', 'パンです。', 'パン。'] }), items)), 'option text gets the same kanji checks');
    assert.ok(/katakana パン not in uses/.test(errsFor(mk({ names: [] }), items)), 'katakana covered');
    assert.ok(/answer out of range/.test(errsFor(mk({ answer: 3 }), items)), 'answer in range');
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
    [{ id: 'v:あお|あお', word: 'あお' }, { id: 'v:おあ|おあ', word: 'おあ' }, { id: 'v:きゃっく|きゃっく', word: 'きゃっく' }, { id: 'v:アオ|アオ', word: 'アオ' }, { id: 'v:くっく|くっく', word: 'くっく' }]
      .forEach(function (it) { items[it.id] = Object.assign({ kind: 'vocab', level: 'N5', reading: it.word }, it); });
    items['c:ア'] = { id: 'c:ア', kind: 'kana', level: 'N5', char: 'ア', script: 'katakana' };
    items['c:オ'] = { id: 'c:オ', kind: 'kana', level: 'N5', char: 'オ', script: 'katakana' };
    var kanaU = function (id, kana, practice, marks, vocab) {
      return { id: id, level: 'N5', kind: 'kana', title: 't', kana: kana, vocab: vocab || ['v:あお|あお', 'v:おあ|おあ'], practice: practice, marks: marks };
    };
    var ok = kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお']);
    var run = function (units) { return planErrors([{ level: 'N5', units: units }], items).join('\n'); };
    assert.strictEqual(run([ok]), '');
    assert.ok(/practice v:秋\|あき uses kana not learned/.test(run([kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお', 'v:秋|あき'])])), 'unlearned kana');
    assert.ok(/word v:おあ\|おあ uses kana not learned/.test(run([kanaU('n5.u001', ['c:あ'], ['v:青|あお'])])), 'taught word: unlearned kana');
    assert.ok(/1 taught words/.test(run([kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお', 'v:青|あお'], null, ['v:あお|あお'])])), '2–5 taught words');
    assert.ok(/2 words in all/.test(run([kanaU('n5.u001', ['c:あ', 'c:お'], [])])), '≥3 words in all');
    assert.ok(/v:青\|あお not spelled in the unit's kana script/.test(run([kanaU('n5.u001', ['c:あ', 'c:お'], ['v:青|あお'], null, ['v:あお|あお', 'v:青|あお'])])), 'no kanji word taught in a kana unit');
    assert.ok(/v:アオ\|アオ not spelled/.test(run([kanaU('n5.u001', ['c:あ', 'c:お', 'c:ア', 'c:オ'], ['v:青|あお'], null, ['v:あお|あお', 'v:アオ|アオ'])])), 'hiragana unit: hiragana words');
    assert.ok(/v:あお\|あお not spelled/.test(run([kanaU('n5.u001', ['c:ア', 'c:オ', 'c:あ', 'c:お'], ['v:青|あお'], null, ['v:アオ|アオ', 'v:あお|あお'])])), 'katakana unit: katakana words');
    assert.strictEqual(run([kanaU('n5.u001', ['c:きゃ', 'c:く'], ['v:来た|きゃっく'], ['っ'], ['v:きゃっく|きゃっく', 'v:くっく|くっく'])]), '', 'combo + っ mark');
    assert.ok(/word v:きゃっく\|きゃっく uses kana not learned/.test(run([kanaU('n5.u001', ['c:きゃ', 'c:く'], ['v:来た|きゃっく'], null, ['v:きゃっく|きゃっく', 'v:くっく|くっく'])])), 'っ needs its mark');
    var lesson = function (id, patch) {
      return Object.assign({ id: id, level: 'N5', kind: 'lesson', title: 'Colours', vocab: ['1', '2', '3', '4', '5', 'v:青|あお'] }, patch);
    };
    assert.ok(/kanji 青 before any word/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5', '6'], kanji: ['k:青'] })])), 'kanji before its word');
    assert.strictEqual(run([lesson('n5.u001'), lesson('n5.u002', { vocab: ['a', 'b', 'c', 'd', 'e', 'f'], kanji: ['k:青'] })]), '', 'kanji after its word');
    assert.ok(/5 vocab < guide/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5'] })])), 'underload');
    var seven = '1234567'.split('').map(function (n) { return lesson('n5.u00' + n, { vocab: [n + 'a', n + 'b', n + 'c', n + 'd', n + 'e', n + 'f'] }); });
    assert.ok(/n5.u007: more than 6 lessons/.test(run(seven)), 'review cadence');
    assert.ok(/review unit lists vocab/.test(run([{ id: 'n5.u001', level: 'N5', kind: 'review', title: 'Review', vocab: ['v:青|あお'] }])), 'review teaches nothing');
    items['p:n5-x'] = { id: 'p:n5-x', kind: 'passage', level: 'N5', format: 'short', uses: ['v:青|あお', 'k:青'] };
    var rev = { id: 'n5.u002', level: 'N5', kind: 'review', title: 'Review', passages: ['p:n5-x'] };
    assert.strictEqual(run([lesson('n5.u001'), rev]), '', 'review passage after its words');
    assert.ok(/uses v:青\|あお, not taught yet/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5', '6'] }), rev])), 'passage before its words');
    items['p:n5-x'].format = 'mid';
    assert.ok(/is mid, not short/.test(run([lesson('n5.u001'), rev])), 'review passages are short');
    delete items['p:n5-x'];
    items['l:n5-x'] = { id: 'l:n5-x', kind: 'listening', level: 'N5', format: 'quick', uses: ['v:青|あお'] };
    var lrev = { id: 'n5.u002', level: 'N5', kind: 'review', title: 'Review', listening: ['l:n5-x'] };
    assert.strictEqual(run([lesson('n5.u001'), lrev]), '', 'review listening after its words');
    assert.ok(/listening l:n5-x uses v:青\|あお, not taught yet/.test(run([lesson('n5.u001', { vocab: ['1', '2', '3', '4', '5', '6'] }), lrev])), 'listening before its words');
    delete items['l:n5-x'];
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
