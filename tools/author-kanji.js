#!/usr/bin/env node
// Build data/n5/kanji.js from the N5 kanji list + hand-written overrides, checked
// against KANJIDIC and Wiktionary (ticket 13).
//
//   node tools/author-kanji.js <wiktionary-cache dir> --fetch   # fill the cache (~1 req/s, skips cached)
//   node tools/author-kanji.js <wiktionary-cache dir>           # write data/n5/kanji.js, print a summary
//   VERBOSE=1 … one line per kanji; VERBOSE=2 … also how each N5 word splits into readings
//
// Inputs:
//   tools/ref/n5.json               the 79 N5 kanji (Tanos list)
//   tools/n5-kanji-overrides.json   per kanji: meaning (own words, required), optional accept (extra
//                                   English answers for the typed meaning question), extra
//                                   (≤2 common readings no N5 word uses), notes, and special =
//                                   N5 words read as a whole (jukujikun: 今日 きょう) with the reason
//   data/n5/vocab.js                N5 words: which readings a learner needs, and `words`
//   <cache>/../kanji-n5.json        Tanos meaning + KANJIDIC fields (via kanji-data; CC BY-SA, EDRDG)
//   <cache>/<kanji>.json            raw en.wiktionary wikitext (CC BY-SA)
// No bulk import: on/kun are exactly the readings N5 words use, extra is picked by hand. Nothing
// is copied from KANJIDIC or Wiktionary but readings and the stroke count (facts, kept only when
// sources agree); meanings are written in the overrides.
// verified:true = every reading is in ≥2 of KANJIDIC / Wiktionary / a JMdict-verified N5 word,
// both give the same stroke count, and the meaning shares a word with Tanos/KANJIDIC's (same
// wording, so one source) and with Wiktionary's (or the override says meaningOk after a read).
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const [cacheDir, flag] = process.argv.slice(2);
if (!cacheDir) { console.error("usage: node tools/author-kanji.js <wiktionary-cache dir> [--fetch]"); process.exit(2); }
const chars = JSON.parse(fs.readFileSync(path.join(__dirname, "ref", "n5.json"), "utf8")).kanji;
const cacheFile = function (c) { return path.join(cacheDir, c + ".json"); };

if (flag === "--fetch") {
  fs.mkdirSync(cacheDir, { recursive: true });
  const todo = chars.filter(function (c) { return !fs.existsSync(cacheFile(c)); });
  console.log(todo.length + " to fetch");
  (async function () {
    for (const c of todo) {
      const url = "https://en.wiktionary.org/w/index.php?action=raw&title=" + encodeURIComponent(c);
      const res = await fetch(url, { headers: { "User-Agent": "jelly-jlpt-author/1.0 (kanji cross-check; github.com/asfiowilma/jelly-jlpt)" } });
      if (res.ok) fs.writeFileSync(cacheFile(c), JSON.stringify({ title: c, url: url, fetched: new Date().toISOString(), wikitext: await res.text() }));
      else console.error(c + ": HTTP " + res.status);
      await new Promise(function (r) { setTimeout(r, 1100); }); // ponytail: fixed 1.1 s throttle
    }
    console.log("done");
  })();
  return;
}

// ── sources ──────────────────────────────────────────────────────────────────
const hira = function (s) { return s.replace(/[ァ-ヶ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); }); };
const kata = function (s) { return s.replace(/[ぁ-ゖ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) + 0x60); }); };
const bare = function (r) { return hira(r).replace(/^-|-$/g, ""); }; // "-び" → "び", "おお-" → "おお"
const isKata = function (r) { return /^[ァ-ヺー]+$/.test(r); };

const kd = {};
JSON.parse(fs.readFileSync(path.resolve(cacheDir, "..", "kanji-n5.json"), "utf8")).forEach(function (k) { kd[k.kanji] = k; });

// Wiktionary: every {{ja-readings}} block in the Japanese section (etymology splits them; goon/
// kanon/toon/soon/kanyoon = on, kun = kun, nanori skipped) + the Han char template's sn= strokes.
function wikt(c) {
  const t = JSON.parse(fs.readFileSync(cacheFile(c), "utf8")).wikitext;
  const sn = (t.match(/\{\{Han char\|[^}]*\bsn=(\d+)/) || [])[1];
  const ja = (t.split(/\n==Japanese==\n/)[1] || "").split(/\n==[^=]/)[0].replace(/<!--[\s\S]*?-->/g, "");
  const on = [], kun = [];
  Array.from(ja.matchAll(/\{\{ja-readings([\s\S]*?)\n\}\}/g)).forEach(function (b) {
    b[1].split("\n").forEach(function (line) {
      const m = line.match(/^\|(\w+)=(.*)$/);
      if (!m || m[1] === "nanori") return;
      // Strip historical spellings ("こう<かう"). Wiktionary marks the kanji part with "-":
      // "い-きる" → "い.きる", "おお-き.い" → "おお.きい", "なま-" stays a prefix.
      m[2].split(/[,、]/).map(function (r) { return r.replace(/<.*$/, "").replace(/\[\[|\]\]/g, "").trim(); }).filter(Boolean)
        .forEach(function (r) {
          r = hira(r.replace(/\./g, "").replace(/([ぁ-ゖ])-([ぁ-ゖ])/, "$1.$2"));
          (m[1] === "kun" ? kun : on).push(r);
        });
    });
  });
  // Definitions for the meaning check: every "# …" line of the Translingual (Han character) and
  // Japanese sections (the kanji's own senses + the words it spells on its own).
  const defs = (t.split(/\n==Japanese==\n/)[0] + "\n" + ja).match(/^# .*$/gm) || [];
  return { strokes: sn && +sn, on: on, kun: kun, defs: defs.join(" ").replace(/\{\{[^}]*\}\}/g, " ") };
}
const W = {};
chars.forEach(function (c) { W[c] = wikt(c); });

// Does a source's reading list contain r (catalog form)? Compares in hiragana, ignoring -
// affix marks; a kun also matches with the okurigana dot ignored (よみ vs よ.み).
function has(list, r) {
  const x = hira(r);
  return list.some(function (y) { y = bare(y); return y === x || (!isKata(r) && y.replace(".", "") === x.replace(".", "")); });
}

// ── which readings N5 words use ─────────────────────────────────────────────
const VOICE = { か: "が", き: "ぎ", く: "ぐ", け: "げ", こ: "ご", さ: "ざ", し: "じ", す: "ず", せ: "ぜ", そ: "ぞ", た: "だ", ち: "ぢ", つ: "づ", て: "で", と: "ど", は: "ば", ひ: "び", ふ: "ぶ", へ: "べ", ほ: "ぼ" };
const SEMI = { は: "ぱ", ひ: "ぴ", ふ: "ぷ", へ: "ぺ", ほ: "ぽ" };
// Surface forms of a reading inside a word: as is, rendaku (voiced first kana), and sokuon
// (final つ/ち/く/き → っ, as in 学校 がっこう, 一緒 いっしょ).
function forms(r) {
  const out = [r];
  if (VOICE[r[0]]) out.push(VOICE[r[0]] + r.slice(1));
  if (SEMI[r[0]]) out.push(SEMI[r[0]] + r.slice(1));
  out.slice().forEach(function (x) { if (/[つちくき]$/.test(x) && x.length > 1) out.push(x.slice(0, -1) + "っ"); });
  return out;
}
// Candidate readings of a kanji (KANJIDIC's, then Wiktionary's extra ones) as
// {key, kd, stem, oku}; key = catalog form: on in katakana, kun in hiragana, "." before okurigana.
const CAND = {};
chars.forEach(function (c) {
  const out = [];
  const add = function (fromKd, isOn) {
    return function (r) {
      const key = isOn ? kata(bare(r)) : bare(r);
      if (!out.some(function (o) { return o.key === key; })) out.push({ key: key, kd: fromKd, stem: hira(key).split(".")[0], oku: key.split(".")[1] || "" });
    };
  };
  kd[c].on.forEach(add(true, true)); kd[c].kun.forEach(add(true, false));
  W[c].on.forEach(add(false, true)); W[c].kun.forEach(add(false, false));
  CAND[c] = out;
});

// Split word|reading: kana match literally, 々 repeats the previous kanji, a non-N5 kanji takes
// 1–4 kana, an N5 kanji takes one of its candidates. Returns [[char, candidate], ...] or null.
function align(word, reading) {
  const w = Array.from(word);
  function go(i, j, acc) {
    if (i === w.length) return j === reading.length ? acc : null;
    let ch = w[i];
    if (/[ぁ-ゖァ-ヺー〜]/.test(ch)) return hira(ch) === reading[j] || ch === reading[j] ? go(i + 1, j + 1, acc) : null;
    if (ch === "々" && i > 0) ch = w[i - 1];
    if (!CAND[ch]) {
      for (let n = 1; n <= 4 && j + n <= reading.length; n++) { const r = go(i + 1, j + n, acc); if (r) return r; }
      return null;
    }
    // Prefer KANJIDIC's form, then one whose okurigana follows in the word: た.べる for 食べ物,
    // やす.む for 休み (KANJIDIC has no やす.み), か.く in 葉書 (not Wiktionary's -がき).
    const next = w.slice(i + 1).join("");
    const rank = function (x) { return (x.kd ? 2 : 0) + (x.oku && next.startsWith(x.oku[0]) ? 1 : 0); };
    for (const cand of CAND[ch].slice().sort(function (a, b) { return rank(b) - rank(a); })) {
      for (const f of forms(cand.stem)) {
        if (reading.startsWith(f, j)) { const r = go(i + 1, j + f.length, acc.concat([[ch, cand]])); if (r) return r; }
      }
    }
    return null;
  }
  return go(0, 0, []);
}

const ov = JSON.parse(fs.readFileSync(path.join(__dirname, "n5-kanji-overrides.json"), "utf8"));
const vocab = [];
global.CATALOG = { add: function (a) { vocab.push.apply(vocab, a); } };
require(path.join(root, "data", "n5", "vocab.js"));

const used = {}, jm = {}, n = {}, wordsOf = {}, unaligned = []; // jm: readings shown by a JMdict-verified N5 word; n: word count per char+reading
chars.forEach(function (c) { used[c] = []; jm[c] = []; wordsOf[c] = []; });
vocab.forEach(function (v) {
  const here = chars.filter(function (c) { return v.word.indexOf(c) >= 0; });
  here.forEach(function (c) { wordsOf[c].push(v.id); });
  if (!here.length || here.some(function (c) { return ov.items[c] && ov.items[c].special && ov.items[c].special[v.id]; })) return;
  const seg = align(v.word, v.reading);
  if (!seg) { unaligned.push(v.id); return; }
  if (process.env.VERBOSE === "2") console.log(v.id + "\t" + seg.map(function (p) { return p[0] + "=" + p[1].key; }).join(" "));
  seg.forEach(function (p) {
    if (used[p[0]].indexOf(p[1].key) < 0) used[p[0]].push(p[1].key);
    n[p[0] + p[1].key] = (n[p[0] + p[1].key] || 0) + 1;
    if (v.verified && jm[p[0]].indexOf(p[1].key) < 0) jm[p[0]].push(p[1].key);
  });
});
if (unaligned.length) { console.error(unaligned.length + " N5 words don't split into their kanji's readings; add them to an override's `special`:\n  " + unaligned.join("\n  ")); process.exit(1); }

// ── build ────────────────────────────────────────────────────────────────────
const STOP = new Set(["a", "an", "the", "of", "to", "for", "counter", "and", "or"]);
const toks = function (s) { return new Set(s.toLowerCase().split(/[^a-z]+/).filter(function (x) { return x.length > 1 && !STOP.has(x); }).map(function (x) { return x.replace(/s$/, ""); })); };
const overlap = function (a, b) { const B = toks(b); return Array.from(toks(a)).some(function (x) { return B.has(x); }); };

const out = [], problems = [], missing = [];
chars.forEach(function (c) {
  const o = ov.items[c];
  if (!o || !o.meaning) { missing.push(c); return; }
  const k = kd[c], w = W[c], extra = o.extra || [];
  // A bare kun stem that another taught kun already shows is dropped (ひと beside ひと.つ);
  // most-used reading first.
  const core = used[c].filter(function (r) {
    return isKata(r) || r.indexOf(".") >= 0 || !used[c].some(function (x) { return x !== r && x.split(".")[0] === r; });
  }).sort(function (a, b) { return n[c + b] - n[c + a]; });
  const why = [], cited = new Set(["tanos"]);
  core.concat(extra).forEach(function (r) {
    const src = [];
    if (has(isKata(r) ? k.on : k.kun, r)) src.push("kanjidic");
    if (has(isKata(r) ? w.on : w.kun, r)) src.push("wiktionary");
    if (jm[c].indexOf(r) >= 0) src.push("jmdict");
    if (src.length < 2) why.push(r + " only in " + (src.join(", ") || "no source"));
    (src.length > 2 ? src.slice(0, 2) : src).forEach(function (s) { cited.add(s); }); // jmdict cited only when needed
  });
  // Tanos's kanji meanings are KANJIDIC's wording, so they count as one source; Wiktionary is the other.
  const mine = o.meaning.join(" ");
  if (!overlap(mine, k.tanos_meaning + " " + k.meanings.join(" "))) why.push("meaning shares no word with Tanos/KANJIDIC");
  if (!overlap(mine, w.defs) && !o.meaningOk) why.push("meaning shares no word with Wiktionary");
  const strokes = k.strokes && k.strokes === w.strokes ? k.strokes : null;
  if (!strokes) why.push("stroke count: KANJIDIC " + k.strokes + ", Wiktionary " + w.strokes);
  const it = { id: "k:" + c, kind: "kanji", level: "N5", char: c,
    on: core.filter(isKata), kun: core.filter(function (r) { return !isKata(r); }), meaning: o.meaning };
  if (o.accept) it.accept = o.accept;
  if (extra.length) it.extra = extra;
  if (strokes) it.strokes = strokes;
  it.words = wordsOf[c];
  it.sources = why.length ? ["tanos"] : Array.from(cited);
  it.verified = !why.length;
  const notes = [o.notes, why.length ? "unverified: " + why.join("; ") : null].filter(Boolean).join(" ");
  if (notes) it.notes = notes;
  if (why.length) problems.push(c + ": " + why.join("; "));
  out.push(it);
});
if (missing.length) { console.error(missing.length + " kanji without a meaning in overrides: " + missing.join(" ")); process.exit(1); }

const header = '"use strict";\n\n// N5 kanji (ticket 13). Generated by tools/author-kanji.js from tools/ref/n5.json (Tanos list,\n' +
  "// credit tanos.co.uk) + tools/n5-kanji-overrides.json (meanings written for this project).\n" +
  "// on/kun = the readings the N5 words in data/n5/vocab.js use; extra = ≤2 more common ones;\n" +
  "// words = N5 vocab containing the kanji. verified:true = each reading in ≥2 of KANJIDIC\n" +
  "// (EDRDG, CC BY-SA 4.0), en.wiktionary and a JMdict-verified N5 word; stroke count agreed by\n" +
  "// KANJIDIC and Wiktionary. Do not edit by hand; edit the overrides.\n";
fs.writeFileSync(path.join(root, "data", "n5", "kanji.js"), header + "CATALOG.add([\n" +
  out.map(function (it) { return "  " + JSON.stringify(it); }).join(",\n") + "\n]);\n");
console.log(JSON.stringify({ kanji: out.length, verified: out.filter(function (i) { return i.verified; }).length }));
problems.forEach(function (p) { console.log("  " + p); });
if (process.env.VERBOSE) out.forEach(function (it) { console.log([it.char, it.on.join("、"), it.kun.join("、"), (it.extra || []).join("、"), it.strokes, it.words.length, it.sources.join(",")].join("\t")); });
