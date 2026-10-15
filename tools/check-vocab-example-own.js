#!/usr/bin/env node
// Vocab-example own-sentence check (docs/playbook/vocab-examples.md). Every `s:own:` entry in the
// `// ── Vocabulary examples` blocks of data/<level>/sentences.js must name its model as
// `tatoeba:<id>` in `notes`; the model must exist in the Tatoeba Japanese file and must not be the
// same text (a verbatim copy ships as a credited Tatoeba entry, never as own).
// Dev only; exits 1 on any bad entry.
//
//   node tools/check-vocab-example-own.js --level n4 --tatoeba <tatoeba dir>
//
// <tatoeba dir> holds raw/jpn_sentences_detailed.tsv (the Tatoeba export: id, lang, text, author, ...).
// It is research data, not in the repo; on the owner's machine it is
// .scratch/content-audit/research/data/tatoeba in the main checkout.
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const arg = function (k) { const i = args.indexOf(k); return i < 0 ? "" : args[i + 1] || ""; };
const lv = arg("--level").toLowerCase(), dir = arg("--tatoeba");
if (!/^n[1-5]$/.test(lv) || !dir) { console.error("usage: check-vocab-example-own.js --level <n5..n1> --tatoeba <tatoeba dir>"); process.exit(2); }

const T = new Map();
fs.readFileSync(path.join(dir, "raw", "jpn_sentences_detailed.tsv"), "utf8").split("\n").forEach(function (l) {
  const c = l.split("\t");
  if (c[0]) T.set(c[0], c[2]);
});

const src = fs.readFileSync(path.join(root, "data", lv, "sentences.js"), "utf8"), start = src.indexOf("// ── Vocabulary examples");
const own = new Set(start < 0 ? [] : src.slice(start).match(/s:own:[^']+/g) || []);
let all = [];
vm.runInNewContext(src, { CATALOG: { add: function (a) { all = all.concat(a); } } });

let n = 0, bad = 0;
all.filter(function (s) { return own.has(s.id); }).forEach(function (s) {
  n++;
  const m = (s.notes || "").match(/tatoeba:(\d+)/);
  if (!m || !T.has(m[1])) { bad++; console.log("nomodel", s.id, s.notes); }
  else if (T.get(m[1]) === s.jp) { bad++; console.log("verbatim", s.id, "= tatoeba:" + m[1]); }
});
console.log("own", n, "bad", bad);
if (bad) process.exitCode = 1;
