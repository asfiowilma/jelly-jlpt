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
// Known list errors, keyed by the research row "word|reading" (ticket 12). Each
// value replaces the row's word and/or reading before parsing. Credit stays Tanos.
const VOCAB_FIXES = {
  "明い|あかるい": { word: "明るい" },                         // Tanos typo
  "伯父/叔父|おじいさん": { word: "おじいさん" },               // grandfather, misfiled under 伯父/叔父 (= uncle)
  "伯父/叔父|おじさん": { word: "伯父さん/叔父さん" },           // 伯父 alone reads おじ
  "誰|だれか": { word: "誰か" },                               // reading has か, word dropped it
  "散歩|さんぽする": { reading: "さんぽ" },                     // する belongs to the verb, not the reading
  "掃除|そうじする": { reading: "そうじ" },
  "勉強|べんきょうする": { reading: "べんきょう" },
  "練習|れんしゅうする": { reading: "れんしゅう" },
  "ラジオカセ|ラジオカセ": { word: "ラジカセ", reading: "ラジカセ" }, // elzup truncation of ラジオカセット
  "お～|お～": { word: "お", reading: "お" },                   // prefix: ～ is not part of the word
  "何～|なん～": { word: "何", reading: "なん" },
  "終る|おわる": { word: "終わる/終る" },                     // Tanos keeps the old okurigana; 終わる is standard (Jisho lists it first)
  "曲る|まがる": { word: "曲がる/曲る" },
};
function vocabEntry(e) {
  e = Object.assign({}, e, VOCAB_FIXES[e.word + "|" + e.reading]);
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
