#!/usr/bin/env node
// Vocab-example grammar check (docs/playbook/vocab-examples.md). tests/teaching-order.js lets
// word-sheet sentences carry untaught words and kanji, so it never sees their grammar. This flags
// every sentence in the `// ── Vocabulary examples` blocks of data/<level>/sentences.js whose
// `uses` lists a grammar id taught after every catalog word in it (lenient: a sentence for a
// unit-40 word may use unit-40 grammar). Items of lower levels count as already taught.
// Dev only; exits 1 when anything is flagged.
//
//   node tools/check-vocab-example-grammar.js --level n4
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const lv = (args[args.indexOf("--level") + 1] || "").toLowerCase();
const LEVELS = ["n5", "n4", "n3", "n2", "n1"];
if (args.indexOf("--level") < 0 || LEVELS.indexOf(lv) < 0) { console.error("usage: check-vocab-example-grammar.js --level <n5|n4|n3|n2|n1>"); process.exit(2); }

// unit index of each item's first teach; -1 for items taught at a lower level
const unit = {};
LEVELS.slice(0, LEVELS.indexOf(lv) + 1).forEach(function (l) {
  const ctx = { PLAN: [] };
  vm.runInNewContext(fs.readFileSync(path.join(root, "data", l, "plan.js"), "utf8"), ctx);
  ctx.PLAN[0].units.forEach(function (u, i) {
    (JSON.stringify(u).match(/"[vgk]:[^"]+"/g) || []).forEach(function (m) {
      const id = JSON.parse(m);
      if (!(id in unit)) unit[id] = l === lv ? i : -1;
    });
  });
});

const file = path.join(root, "data", lv, "sentences.js");
const src = fs.readFileSync(file, "utf8"), start = src.indexOf("// ── Vocabulary examples");
if (start < 0) { console.log("flagged 0 (no vocab-example block)"); process.exit(0); }
const inBlock = new Set((src.slice(start).match(/id: '[^']+'/g) || []).map(function (s) { return s.slice(5, -1); }));
let all = [];
vm.runInNewContext(src, { CATALOG: { add: function (a) { all = all.concat(a); } } });

let n = 0;
all.filter(function (s) { return inBlock.has(s.id); }).forEach(function (s) {
  const uses = s.uses || [];
  const v = Math.max.apply(null, uses.filter(function (i) { return i.startsWith("v:") && i in unit; }).map(function (i) { return unit[i]; }));
  const late = uses.filter(function (i) { return i.startsWith("g:") && unit[i] > v; });
  if (late.length) { n++; console.log(s.id, s.jp, late.map(function (g) { return g + "@u" + (unit[g] + 1); }).join(" "), "maxV@u" + (v + 1)); }
});
console.log("flagged", n);
if (n) process.exitCode = 1;
