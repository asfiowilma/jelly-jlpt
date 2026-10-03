#!/usr/bin/env node
// Build data/n5/vocab.js from the N5 reference list + hand-written overrides +
// a JMdict cross-check via the Jisho API (ticket 12).
//
//   node tools/author-vocab.js <jisho-cache dir> --fetch   # fill the cache (~1 req/s, skips cached)
//   node tools/author-vocab.js <jisho-cache dir>           # write data/n5/vocab.js, print a summary
//
// Inputs:
//   tools/ref/n5.json            one item per distinct word|reading (array entries = one item per
//                                alternative, minus overrides.skip)
//   tools/n5-vocab-overrides.json  gloss/tags (own wording, English only, required per item) and optional
//                                usage (Japanese usage hint shown in lessons, never in quiz prompts), pos,
//                                notes, q (Jisho keyword), jmWord / jmReading (form to match in JMdict),
//                                alt (word|reading of the spelling the plan teaches instead), accept (extra
//                                English answers for typed meaning questions, own wording), contexts (bound
//                                items, pos suffix/prefix/counter: [furigana compound, English, extra readings?],
//                                the morpheme its own [kanji|reading] block or plain kana at the end/start;
//                                quizzes ask these items only inside a context, ticket 40)
//   D:/…/.scratch/content-audit/research/data/vocab-n5.json  list sources (tanos/elzup) per row
//   <cache>/<keyword>.json       raw Jisho responses (JMdict-based, CC BY-SA: used only as a check,
//                                nothing from it is copied into the output except pos labels)
// An item is verified only when JMdict has an entry with the same word+reading whose senses
// carry the item's pos and share a content word with its gloss (or the override says
// senseOk after a manual read). Otherwise verified:false with the reason in notes.
"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const [cacheDir, flag] = process.argv.slice(2);
if (!cacheDir) { console.error("usage: node tools/author-vocab.js <jisho-cache dir> [--fetch]"); process.exit(2); }
const RESEARCH = path.resolve(cacheDir, "..", "vocab-n5.json"); // cache sits next to the research lists

const ref = JSON.parse(fs.readFileSync(path.join(__dirname, "ref", "n5.json"), "utf8")).vocab;
const ov = JSON.parse(fs.readFileSync(path.join(__dirname, "n5-vocab-overrides.json"), "utf8"));
const KANA = /^[ぁ-ゖァ-ヺー]+$/;

// Distinct item keys in ref order.
const keys = [];
ref.forEach(function (e) { [].concat(e).forEach(function (k) { if (!ov.skip[k] && keys.indexOf(k) < 0) keys.push(k); }); });
const split = function (k) { const i = k.indexOf("|"); return [k.slice(0, i), k.slice(i + 1)]; };
const queryOf = function (k) { return (ov.items[k] && ov.items[k].q) || split(k)[0]; };
// ctxWords(f): a context's furigana ('[三|さん][階|がい]') → [word, reading]
const ctxWords = function (f) {
  const t = f.replace(/\[([^|\]]+)[^\]]*\]/g, "$1");
  const r = f.replace(/\[[^|\]]+((?:\|[^|\]]*)+)\]/g, function (_, rs) { return rs.split("|").join(""); });
  return [t, r];
};
const cacheFile = function (q) { return path.join(cacheDir, q.replace(/[\\/:*?"<>|]/g, "_") + ".json"); };

if (flag === "--fetch") {
  fs.mkdirSync(cacheDir, { recursive: true });
  const compounds = [].concat.apply([], keys.map(function (k) { return ((ov.items[k] || {}).contexts || []).map(function (c) { return ctxWords(c[0])[0]; }); }));
  const todo = Array.from(new Set(keys.map(queryOf).concat(compounds))).filter(function (q) { return !fs.existsSync(cacheFile(q)); });
  console.log(todo.length + " to fetch");
  (async function () {
    for (const q of todo) {
      for (let tries = 0; tries < 4; tries++) {
        try {
          const res = await fetch("https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(q),
            { headers: { "User-Agent": "jelly-jlpt-author/1.0 (vocab cross-check; github.com/asfiowilma/jelly-jlpt)" } });
          if (!res.ok) throw new Error("HTTP " + res.status);
          const body = await res.json();
          fs.writeFileSync(cacheFile(q), JSON.stringify({ keyword: q, fetched: new Date().toISOString(), data: body.data }));
          break;
        } catch (err) { console.error(q + ": " + err.message); await new Promise(function (r) { setTimeout(r, 5000 * (tries + 1)); }); }
      }
      await new Promise(function (r) { setTimeout(r, 1100); }); // ponytail: fixed 1.1 s throttle
    }
    console.log("done");
  })();
  return;
}

// ── build ────────────────────────────────────────────────────────────────────
// JMdict part-of-speech labels (as Jisho prints them) → catalog pos.
const POS_MAP = [
  [/^Godan verb/, "verb-godan"], [/^Ichidan verb/, "verb-ichidan"], [/^Kuru verb/, "verb-kuru"],
  [/^Suru verb/, "verb-suru"], [/^(I-adjective|Adjective \(keiyoushi\))/i, "adj-i"], [/^Na-adjective/, "adj-na"],
  [/^Pre-noun adjectival|^Noun or verb acting prenominally/, "prenoun"], [/^Pronoun/, "pronoun"],
  [/^Adverb/, "adverb"], [/^Particle/, "particle"], [/^Conjunction/, "conjunction"], [/^Counter/, "counter"],
  [/^Expressions/, "expression"], [/^Interjection/, "interjection"], [/^Prefix/, "prefix"], [/^Suffix/, "suffix"],
  [/^Numeric/, "number"], [/^Noun, used as a suffix/, "suffix"], [/^Noun, used as a prefix/, "prefix"], [/^(Noun|Adverbial noun|Temporal noun)/, "noun"],
];
const posOf = function (label) { const m = POS_MAP.find(function (p) { return p[0].test(label); }); return m && m[1]; };
const STOP = new Set(["to", "a", "an", "the", "of", "be", "is", "in", "on", "at", "for", "s", "and", "or", "with", "something", "someone", "etc", "e", "g"]);
const words = function (s) { return s.toLowerCase().replace(/\([^)]*\)/g, " ").split(/[^a-z0-9]+/).filter(function (w) { return w && !STOP.has(w); })
  .map(function (w) { return w.length > 4 ? w.replace(/(ing|ed|es|e|s)$/, "") : w; }); }; // ponytail: crude stem (dislike/disliking)

const listSources = {};
JSON.parse(fs.readFileSync(RESEARCH, "utf8")).forEach(function (row, i) {
  [].concat(ref[i]).forEach(function (k) { listSources[k] = Array.from(new Set((listSources[k] || []).concat(row.sources))); });
});

function check(k, o) {
  const [w, r] = split(k);
  const file = cacheFile(queryOf(k));
  if (!fs.existsSync(file)) return { reason: "no JMdict lookup cached" };
  const jw = o.jmWord || w, jr = o.jmReading || r;
  const entries = JSON.parse(fs.readFileSync(file, "utf8")).data.filter(function (e) {
    return e.japanese.some(function (j) {
      return j.reading === jr && (j.word === jw || (KANA.test(jw) && (!j.word || !o.jmWord)));
    });
  });
  if (!entries.length) return { reason: "JMdict has no entry for " + jw + "|" + jr };
  const mine = new Set(words(o.gloss.join(" ")));
  // Common entries first, so kana words don't land on a rare homophone.
  entries.sort(function (a, b) { return (b.is_common ? 1 : 0) - (a.is_common ? 1 : 0); });
  const scored = entries.map(function (e) {
    let prev = []; // Jisho leaves parts_of_speech empty when a sense shares the previous one's
    const labels = [].concat.apply([], e.senses.map(function (s) { prev = s.parts_of_speech.length ? s.parts_of_speech : prev; return prev; }));
    // An unlabeled first sense means Jisho dropped the label (interjections): don't trust later senses' pos.
    const pos = e.senses[0].parts_of_speech.length ? Array.from(new Set(labels.map(posOf).filter(Boolean))) : [];
    const defs = new Set(words([].concat.apply([], e.senses.map(function (s) { return s.english_definitions; })).join(" ")));
    return { e: e, pos: pos, glossOk: !!o.senseOk || Array.from(mine).some(function (x) { return defs.has(x); }) };
  });
  const best = scored.find(function (s) { return s.glossOk && (!o.pos || s.pos.indexOf(o.pos) >= 0); }) ||
    scored.find(function (s) { return s.glossOk; }) || scored[0];
  const pos = o.pos || best.pos[0];
  if (!best.pos.length) return { pos: pos, reason: "Jisho gives no pos for this entry" };
  if (!pos) return { reason: "JMdict pos not mappable" };
  if (best.pos.indexOf(pos) < 0) return { pos: pos, reason: "JMdict pos is " + best.pos.join("/") + ", not " + pos };
  if (!best.glossOk) return { pos: pos, reason: "gloss shares no word with the JMdict senses (needs a manual read)" };
  // VERBOSE=1: one line per verified item (key, pos, JMdict entry, its pos, first sense) for review.
  if (process.env.VERBOSE) console.log([k, pos, best.e.slug, best.pos.join("/"), best.e.senses[0].english_definitions.slice(0, 3).join("; ")].join("\t"));
  return { pos: pos, ok: true };
}

const out = [], missing = [], reasons = {};
keys.forEach(function (k) {
  const o = ov.items[k];
  if (!o || !o.gloss || !o.tags) { missing.push(k); return; }
  const [w, r] = split(k);
  const c = check(k, o);
  const it = { id: "v:" + k, kind: "vocab", level: "N5", word: w, reading: r, gloss: o.gloss, pos: c.pos || o.pos || "noun", tags: o.tags,
    sources: (listSources[k] || ["tanos"]).concat(c.ok ? ["jmdict"] : []), verified: !!c.ok };
  const notes = [o.notes, c.ok ? null : "unverified: " + c.reason].filter(Boolean).join(" ");
  if (o.accept) it.accept = o.accept;
  if (o.contexts) it.contexts = o.contexts.map(function (c) { const x = { f: c[0], en: c[1] }; if (c[2]) x.alt = c[2]; return x; });
  if (o.usage) it.usage = o.usage;
  if (notes) it.notes = notes;
  if (o.alt) it.alt = "v:" + o.alt; // duplicate spelling: not taught, covered by the alt item (ticket 34)
  if (!c.ok) reasons[c.reason.replace(/ for .*| is .*/, "")] = (reasons[c.reason.replace(/ for .*| is .*/, "")] || 0) + 1;
  out.push(it);
});
if (missing.length) { console.error(missing.length + " keys without gloss/tags in overrides:\n  " + missing.join("\n  ")); process.exit(1); }

const header = '"use strict";\n\n// N5 vocabulary (ticket 12). Generated by tools/author-vocab.js from tools/ref/n5.json\n' +
  "// (Tanos list, credit tanos.co.uk; elzup/jlpt-word-list, MIT) + tools/n5-vocab-overrides.json\n" +
  "// (glosses and tags written for this project). verified:true = word, reading and pos\n" +
  "// confirmed against JMdict (EDRDG, via jisho.org). Do not edit by hand; edit the overrides.\n";
fs.writeFileSync(path.join(root, "data", "n5", "vocab.js"), header + "CATALOG.add([\n" +
  out.map(function (it) { return "  " + JSON.stringify(it); }).join(",\n") + "\n]);\n");
const count = function (f) { const m = {}; out.forEach(function (it) { [].concat(it[f]).forEach(function (x) { m[x] = (m[x] || 0) + 1; }); }); return m; };
console.log(JSON.stringify({ items: out.length, verified: out.filter(function (i) { return i.verified; }).length, unverified: reasons, pos: count("pos"), tags: count("tags") }, null, 1));
for (const it of out) if (!it.verified) console.log("  " + it.id + "  " + it.notes);
// Context readings vs JMdict (cached by compound). Numeral + counter compounds are mostly not
// JMdict entries: those were checked by hand against the counter sound-change rules and Tatoeba
// furigana (ticket 40). A JMdict entry that disagrees fails the build.
const notInJm = [];
let jmOk = 0;
out.forEach(function (it) {
  (it.contexts || []).forEach(function (c) {
    const [w, r] = ctxWords(c.f), file = cacheFile(w);
    const rs = !fs.existsSync(file) ? [] : [].concat.apply([], JSON.parse(fs.readFileSync(file, "utf8")).data.map(function (e) {
      return e.japanese.filter(function (j) { return j.word === w; }).map(function (j) { return j.reading; });
    }));
    if (!rs.length) { notInJm.push(w + " " + r); return; }
    if (![r].concat(c.alt || []).some(function (x) { return rs.indexOf(x) >= 0; })) {
      console.error("context " + w + " " + r + ": JMdict reads " + rs.join("/"));
      process.exitCode = 1;
      return;
    }
    jmOk++;
  });
});
console.log("contexts confirmed by JMdict: " + jmOk + "; not in JMdict (hand-checked): " + notInJm.join(", "));
