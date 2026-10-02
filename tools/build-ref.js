#!/usr/bin/env node
// Build the compact committed reference fixture tools/ref/<lvl>.json from the
// dev-only research lists (.scratch/content-audit/research/data, gitignored).
//
//   node tools/build-ref.js <research/data dir> [N5 ...]     (default: N5)
//
// Output: { vocab: ["word|reading" | ["alt|alt", ...]], kanji: ["日", ...], grammar: ["です", ...] }
// A vocab entry with spelling/reading variants (Tanos "九|きゅう / く", elzup "いい; よい",
// "勉強|べんきょう (する)") becomes an array of word|reading alternatives; any one
// of them counts as that entry. Only list membership is kept: no meanings, no KANJIDIC fields.
"use strict";
const fs = require("fs");
const path = require("path");

const [dir, ...levels] = process.argv.slice(2);
if (!dir) { console.error("usage: node tools/build-ref.js <research/data dir> [N5 ...]"); process.exit(2); }

function parts(s) {
  return s.replace(/\([^)]*\)/g, "").split(/[\/;、]|\s+/).map(function (x) { return x.replace(/^[～〜]+/, "").trim(); }).filter(Boolean);
}
function vocabEntry(e) {
  const ws = parts(e.word), rs = parts(e.reading), alts = [];
  // ponytail: same-count variants pair by index (いい/よい|いい/よい); otherwise every combination.
  if (ws.length === rs.length) ws.forEach(function (w, i) { alts.push(w + "|" + rs[i]); });
  else ws.forEach(function (w) { rs.forEach(function (r) { alts.push(w + "|" + r); }); });
  const uniq = Array.from(new Set(alts));
  return uniq.length === 1 ? uniq[0] : uniq;
}

(levels.length ? levels : ["N5"]).forEach(function (lv) {
  const n = lv.toLowerCase();
  const read = function (kind) { return JSON.parse(fs.readFileSync(path.join(dir, kind + "-" + n + ".json"), "utf8")); };
  const ref = {
    vocab: read("vocab").map(vocabEntry),
    kanji: read("kanji").map(function (k) { return k.kanji; }),
    grammar: read("grammar").map(function (g) { return g.name; }),
  };
  const out = path.join(__dirname, "ref", n + ".json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, "{\n" + ["vocab", "kanji", "grammar"].map(function (k) {
    return '  "' + k + '": [\n    ' + ref[k].map(function (x) { return JSON.stringify(x); }).join(",\n    ") + "\n  ]";
  }).join(",\n") + "\n}\n");
  console.log(out + ": " + ref.vocab.length + " vocab, " + ref.kanji.length + " kanji, " + ref.grammar.length + " grammar");
});
