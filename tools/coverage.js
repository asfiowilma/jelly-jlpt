#!/usr/bin/env node
// Coverage report (tickets 05 + 26): per level, how much of the reference list
// (tools/ref/<level>.json) the catalog has and the plan teaches, verified vs
// unverified counts, and the first 50 missing ref items. Dev only; always exits 0.
//
//   node tools/coverage.js
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const load = function (rel) { vm.runInThisContext(fs.readFileSync(path.join(root, rel), "utf8"), { filename: rel }); };
load("data/catalog.js");
fs.readdirSync(path.join(root, "data")).filter(function (d) { return fs.statSync(path.join(root, "data", d)).isDirectory(); }).sort()
  .forEach(function (d) { fs.readdirSync(path.join(root, "data", d)).sort().forEach(function (f) { load(path.join("data", d, f)); }); });

const items = Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; });
const planned = new Set();
PLAN.forEach(function (lp) { lp.units.forEach(function (u) { ["vocab", "kanji", "grammar"].forEach(function (f) { (u[f] || []).forEach(function (id) { planned.add(id); }); }); }); });
// The ref keys an item covers: vocab word|reading, kanji char, grammar its `ref` names.
const keysOf = function (it) { return it.kind === "vocab" ? [it.word + "|" + it.reading] : it.kind === "kanji" ? [it.char] : (it.ref || []); };

["N5", "N4", "N3", "N2", "N1"].forEach(function (lv) {
  const mine = items.filter(function (it) { return it.level === lv; });
  const verified = mine.filter(function (it) { return it.verified; }).length;
  console.log("\n== " + lv + " == catalog " + mine.length + " items (" + verified + " verified, " + (mine.length - verified) + " unverified)");
  const refFile = path.join(__dirname, "ref", lv.toLowerCase() + ".json");
  if (!fs.existsSync(refFile)) { console.log("  no reference list (tools/ref/" + lv.toLowerCase() + ".json)"); return; }
  const ref = JSON.parse(fs.readFileSync(refFile, "utf8"));
  const missing = [];
  ["vocab", "kanji", "grammar"].forEach(function (kind) {
    const inCatalog = new Set(), inPlan = new Set();
    mine.filter(function (it) { return it.kind === kind; }).forEach(function (it) {
      keysOf(it).forEach(function (k) { inCatalog.add(k); if (planned.has(it.id)) inPlan.add(k); });
    });
    let cat = 0, taught = 0;
    ref[kind].forEach(function (entry) {
      const alts = [].concat(entry); // a variant entry counts once, via any alternative
      if (alts.some(function (a) { return inCatalog.has(a); })) cat++;
      if (alts.some(function (a) { return inPlan.has(a); })) taught++;
      else missing.push(kind + " " + alts.join(" / "));
    });
    const pct = function (n) { return (100 * n / ref[kind].length).toFixed(1) + "%"; };
    console.log("  " + kind.padEnd(8) + "taught " + String(taught).padStart(4) + " / " + ref[kind].length + " (" + pct(taught) + ")   in catalog " + cat + " (" + pct(cat) + ")");
  });
  console.log("  missing (not taught): " + missing.length + (missing.length > 50 ? ", first 50:" : ":"));
  missing.slice(0, 50).forEach(function (m) { console.log("    " + m); });
});
process.exit(0);
