#!/usr/bin/env node
// Vocab-example source check (docs/playbook/vocab-examples.md). Every `s:tatoeba:` entry in the
// `// ── Vocabulary examples` blocks of data/<level>/sentences.js must equal the Tatoeba pair file:
// jp, author, license, and the English (enId, en, enAuthor, enLicense). An English sentence with
// no owner must store enAuthor: null, never the string 'null'. Dev only; exits 1 on any mismatch.
//
//   node tools/check-vocab-example-sources.js --level n4 --tatoeba <tatoeba dir>
//
// <tatoeba dir> holds pairs-jpn-eng.jsonl (one Japanese sentence per line with its English
// translations and authors). It is research data, not in the repo; on the owner's machine it is
// .scratch/content-audit/research/data/tatoeba in the main checkout.
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const arg = function (k) { const i = args.indexOf(k); return i < 0 ? "" : args[i + 1] || ""; };
const lv = arg("--level").toLowerCase(), dir = arg("--tatoeba");
if (!/^n[1-5]$/.test(lv) || !dir) { console.error("usage: check-vocab-example-sources.js --level <n5..n1> --tatoeba <tatoeba dir>"); process.exit(2); }

const P = new Map();
fs.readFileSync(path.join(dir, "pairs-jpn-eng.jsonl"), "utf8").split("\n").forEach(function (l) {
  if (l.trim()) { const o = JSON.parse(l); P.set(o.id, o); }
});

const src = fs.readFileSync(path.join(root, "data", lv, "sentences.js"), "utf8"), start = src.indexOf("// ── Vocabulary examples");
const ids = new Set(start < 0 ? [] : (src.slice(start).match(/id: 's:tatoeba:\d+'/g) || []).map(function (x) { return x.slice(5, -1); }));
let all = [];
vm.runInNewContext(src, { CATALOG: { add: function (a) { all = all.concat(a); } } });

let n = 0, bad = 0;
all.filter(function (s) { return ids.has(s.id); }).forEach(function (s) {
  n++;
  const o = P.get(+s.id.split(":").pop());
  if (!o) { bad++; console.log("notInPairs", s.id); return; }
  const e = o.eng.find(function (x) { return x.id === s.enId; }), errs = [];
  if (o.jp !== s.jp) errs.push("jp");
  if (o.author !== s.author) errs.push("author");
  if (o.license !== s.license) errs.push("license");
  if (!e) errs.push("enId");
  else {
    if (e.text !== s.en) errs.push("en");
    if ((e.author || null) !== s.enAuthor) errs.push("enAuthor");
    if (e.license !== s.enLicense) errs.push("enLicense");
  }
  if (errs.length) { bad++; console.log(s.id, errs.join(","), s.jp, "|", s.en, "|", e && e.text); }
});
console.log("checked", n, "bad", bad);
if (bad) process.exitCode = 1;
