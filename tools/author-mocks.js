#!/usr/bin/env node
// Build data/<lvl>/mocks.js (ticket 18) from tools/<lvl>-mocks.json. The JSON names pool ids only:
// question text lives in the mondai, passage and listening pools (data/<lvl>/), never in the JSON.
//
//   node tools/author-mocks.js --level N5   # write data/n5/mocks.js, or print every problem and exit 1
//
// Input: exactly three mocks, x:<lvl>-mock-1 and -2 (format full) and -3 (diagnostic).
//   { "mocks": [ { "id": "x:n5-mock-1", "format": "full", "title": "N5 mock exam 1",
//       "sections": {
//         "vocab":     [ { "id": "m:n5-iikae-kurai", "o": [2, 3, 0, 1], "a": 0 } ],
//         "grammar":   [ { "id": "m:n5-bunshou-yama", "blank": 1, "o": [0, 1, 2, 3], "a": 0 },
//                        { "id": "p:n5-mike-family", "q": 0, "o": [0, 1, 2, 3], "a": 0 } ],
//         "listening": [ { "id": "l:n5-who-is-that", "a": 0 } ] } } ] }
// id: a mondai (m:, types iikae / bunshou / youhou), passage (p:) or listening (l:) item.
// blank: bunshou blank number, 1-based (required for bunshou only). q: passage question index.
// o: the options in the order the mock shows them, as a permutation of the authored options.
//    Listening has no o: its options keep their authored order.
// a: index of the right answer in the authored options. Must equal the pool's own answer.
// Counts per section and per format must equal lib.js MOCK_BLUEPRINT. A pool item may sit in one
// mock only, and not in a lesson unit. Output: data/<lvl>/mocks.js, generated, never hand-edited.
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const LEVEL = args.indexOf("--level") >= 0 ? String(args[args.indexOf("--level") + 1] || "").toUpperCase() : "";
if (!LEVEL) { console.error("usage: node tools/author-mocks.js --level <LEVEL>"); process.exit(2); }
const lvl = LEVEL.toLowerCase();
const SECTIONS = ["vocab", "grammar", "listening"];
const REF_KEYS = ["id", "blank", "q", "o", "a"];
const load = function (rel) { vm.runInThisContext(fs.readFileSync(path.join(root, rel), "utf8"), { filename: rel }); };

// ── helpers (same reading of ruby markup as tests/mocks.js) ──────────────────
const stripRuby = function (s) { return s.replace(/\[([^|\]]+)\|[^\]]*\]/g, "$1"); };
const readingOf = function (s) { return s.replace(/\[[^|\]]+((?:\|[^|\]]*)+)\]/g, function (_, rs) { return rs.split("|").join(""); }); };
const isPerm = function (o, n) {
  return Array.isArray(o) && o.length === n && o.slice().sort(function (a, b) { return a - b; }).every(function (v, i) { return v === i; });
};
const sameCounts = function (a, b) {
  const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
  return ka.join() === kb.join() && ka.every(function (k) { return a[k] === b[k]; });
};

// poolRef(ref): the mock question a reference makes, or a string saying why it cannot.
// out: the fields lib.js mockQuestion reads. key: the MOCK_BLUEPRINT key it counts under.
function poolRef(ref) {
  const it = CATALOG.items[ref.id];
  if (!it) return "no pool item " + ref.id;
  if (it.level !== LEVEL) return ref.id + " is " + it.level;
  if (it.kind === "mondai" && it.type === "bunshou") {
    if (!Number.isInteger(ref.blank) || !it.blanks[ref.blank - 1]) return ref.id + " has no blank " + ref.blank;
    return { need: "blank", out: { m: "bunshou", item: it.id, blank: ref.blank }, key: "bunshou",
      options: it.blanks[ref.blank - 1].options, answer: it.blanks[ref.blank - 1].answer, stems: [it.text] };
  }
  if (it.kind === "mondai" && (it.type === "iikae" || it.type === "youhou")) {
    return { out: { m: it.type, item: it.id }, key: it.type, options: it.options, answer: it.answer,
      stems: [it.type === "iikae" ? it.jp : it.word] };
  }
  if (it.kind === "passage") {
    if (!Number.isInteger(ref.q) || !it.questions[ref.q]) return ref.id + " has no question " + ref.q;
    const q = it.questions[ref.q];
    return { need: "q", out: { m: "reading", p: it.id, q: ref.q }, key: it.format, options: q.options, answer: q.answer, stems: [it.furigana] };
  }
  if (it.kind === "listening") {
    return { noO: true, out: { m: "listening", l: it.id }, key: it.format, options: it.options, answer: it.answer,
      stems: it.lines.map(function (l) { return l.furigana; }) };
  }
  return ref.id + " is a " + it.kind + ": no mock form for it";
}

// build(input, rows, lessonIds) → { errs } or { mocks } with each question in lib.js mock shape.
function build(input, rows, lessonIds) {
  const errs = [];
  if (!input || !Array.isArray(input.mocks)) return { errs: ['"mocks" must be an array'] };
  const want = [["x:" + lvl + "-mock-1", "full"], ["x:" + lvl + "-mock-2", "full"], ["x:" + lvl + "-mock-3", "diagnostic"]];
  if (input.mocks.length !== want.length) errs.push("needs exactly " + want.length + " mocks: " + want.map(function (w) { return w[0]; }).join(", "));
  const owner = {};
  const mocks = input.mocks.map(function (m, mi) {
    const where = (m && m.id) || "mock " + (mi + 1);
    if (!m || !m.title || !m.sections || SECTIONS.some(function (k) { return !Array.isArray(m.sections[k]); })) {
      errs.push(where + ": needs a title and vocab / grammar / listening arrays");
      return null;
    }
    if (want[mi] && (m.id !== want[mi][0] || m.format !== want[mi][1])) errs.push(where + ": expected " + want[mi][0] + " " + want[mi][1]);
    const row = rows[m.format];
    if (!row) { errs.push(where + ": unknown format " + m.format); return null; }
    const seen = {}, tally = {}, sections = {}, shown = [];
    SECTIONS.forEach(function (sec) {
      tally[sec] = {};
      sections[sec] = m.sections[sec].map(function (ref, i) {
        const at = where + " " + sec + " Q" + (i + 1);
        if (!ref || typeof ref.id !== "string") { errs.push(at + ": needs an id"); return null; }
        const bad = Object.keys(ref).filter(function (k) { return REF_KEYS.indexOf(k) < 0; });
        if (bad.length) errs.push(at + ": unknown field " + bad.join(", "));
        const pr = poolRef(ref);
        if (typeof pr === "string") { errs.push(at + ": " + pr); return null; }
        if (pr.need && ref[pr.need] === undefined) errs.push(at + ": needs " + pr.need);
        if (!pr.need && (ref.blank !== undefined || ref.q !== undefined)) errs.push(at + ": blank / q only for bunshou / passage items");
        if (pr.noO ? ref.o !== undefined : !isPerm(ref.o, pr.options.length)) {
          errs.push(at + (pr.noO ? ": listening keeps its authored order, no o" : ": o is not an order of the " + pr.options.length + " options"));
        }
        if (ref.a !== pr.answer) errs.push(at + ": a " + ref.a + " is not the pool's answer " + pr.answer);
        const unit = ref.id + (pr.need ? "#" + ref[pr.need] : "");
        if (seen[unit]) errs.push(at + ": " + unit + " asked twice in this mock");
        seen[unit] = true;
        if (owner[ref.id] && owner[ref.id] !== where) errs.push(at + ": " + ref.id + " also in " + owner[ref.id]);
        owner[ref.id] = owner[ref.id] || where;
        if (lessonIds[ref.id]) errs.push(at + ": " + ref.id + " is in lesson " + lessonIds[ref.id]);
        tally[sec][pr.key] = (tally[sec][pr.key] || 0) + 1;
        const raw = pr.options[pr.answer];
        shown.push({ at: at, ans: stripRuby(raw), read: readingOf(raw), stems: pr.stems });
        return Object.assign({}, pr.out, pr.noO ? {} : { o: ref.o });
      }).filter(Boolean);
    });
    SECTIONS.forEach(function (sec) {
      if (!sameCounts(tally[sec], row[sec])) errs.push(where + " " + sec + ": " + JSON.stringify(tally[sec]) + " but the blueprint wants " + JSON.stringify(row[sec]));
    });
    // tests/mocks.js: no answer string (3+ characters) shows in another question's stem
    shown.forEach(function (a) {
      if (a.ans.length < 3) return;
      shown.forEach(function (b) {
        if (b === a) return;
        if (b.stems.some(function (s) { return stripRuby(s).indexOf(a.ans) >= 0 || readingOf(s).indexOf(a.read) >= 0; })) {
          errs.push(a.at + ": its answer " + a.ans + " is shown in " + b.at);
        }
      });
    });
    return { id: m.id, format: m.format, title: m.title, sections: sections };
  }).filter(Boolean);
  return errs.length ? { errs: errs } : { mocks: mocks };
}

// render(mocks) → data/<lvl>/mocks.js text, the same CATALOG.add shape as data/n5/mocks.js.
function render(mocks) {
  const head = '"use strict";\n\n// ' + LEVEL + ' mock exams, generated by tools/author-mocks.js from tools/' + lvl + '-mocks.json.\n' +
    '// Do not edit: change the JSON (pool ids) or the pool, then rerun the generator.\n';
  const items = mocks.map(function (m) {
    const secs = SECTIONS.map(function (sec) {
      return "    " + sec + ": [\n" + m.sections[sec].map(function (q) { return "      " + JSON.stringify(q); }).join(",\n") + "\n    ]";
    });
    return "  { id: " + JSON.stringify(m.id) + ", kind: 'mock', level: '" + LEVEL + "', format: " + JSON.stringify(m.format) +
      ", title: " + JSON.stringify(m.title) + ",\n    sections: {\n" + secs.join(",\n") + "\n    } }";
  });
  return head + "CATALOG.add([\n" + items.join(",\n") + "\n]);\n";
}

// ── load the catalog, the lib.js blueprint and this level's pool (plans give lesson ids) ─────
load("data/catalog.js");
load("lib.js");
const dataDir = path.join(root, "data", lvl);
if (!fs.existsSync(dataDir)) { console.error("no data/" + lvl + " folder"); process.exit(1); }
fs.readdirSync(dataDir).filter(function (f) { return /\.js$/.test(f) && f !== "mocks.js" && f !== "plan.js"; }).sort()
  .forEach(function (f) { load("data/" + lvl + "/" + f); });
if (fs.existsSync(path.join(dataDir, "plan.js"))) load("data/" + lvl + "/plan.js");

const rows = MOCK_BLUEPRINT[LEVEL];
if (!rows) { console.error("no blueprint row for " + LEVEL + " in lib.js MOCK_BLUEPRINT: stop, do not invent counts"); process.exit(1); }
const jsonFile = path.join(root, "tools", lvl + "-mocks.json");
if (!fs.existsSync(jsonFile)) { console.error("missing " + path.relative(root, jsonFile) + ": the mocks skill writes it first"); process.exit(1); }
const lessonIds = {};
allUnits().forEach(function (u) {
  if (u.kind === "mock") return;
  (u.passages || []).concat(u.listening || []).forEach(function (id) { lessonIds[id] = u.id; });
});

const input = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
const result = build(input, rows, lessonIds);
if (result.errs) { console.error("PROBLEMS:\n  " + result.errs.join("\n  ")); process.exit(1); }
const out = path.join(dataDir, "mocks.js");
fs.writeFileSync(out, render(result.mocks));
console.log("wrote " + path.relative(root, out) + ": " + result.mocks.map(function (m) { return m.id; }).join(", "));
