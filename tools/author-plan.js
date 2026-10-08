#!/usr/bin/env node
// Build data/<lvl>/plan.js (ticket 34) from a level's unit outline (tools/plan-<lvl>.js) + the catalog.
//
//   node tools/author-plan.js [N5|N4]   # write data/<lvl>/plan.js, print a summary (default N5)
//
// The outline (HIRAGANA, KATAKANA, LESSONS, LESSON_NOTES, DIALOGUES, GUIDES, PREP, READY) is the teaching decision; this script only resolves words to catalog
// ids, places kanji, inserts review units and writes the file. Edit the outline,
// not plan.js. Unit ids are given in plan order (n5.u001…); there are no users yet,
// so renumbering is fine until N5 ships — after that, keep ids stable (spec Q21).
//
// Order:
//   1. Kana (only when the outline has kana lists: N5): hiragana units, review, katakana units, review (map Q27). Each unit has
//      its new kana, 2–5 taught words and up to 5 practice words (≥3 words in all), all
//      readable with only the kana learned so far (checked by tests/catalog-checks.js).
//      Taught words (Q45, ticket 42) are N5 vocab whose catalog spelling is kana in the
//      unit's script (hiragana units: hiragana words, katakana units: loanwords); they get
//      SRS cards and quiz questions here and are left out of the lessons. Chosen: concrete
//      or everyday words written in kana; not bound items (さん, たち), particles,
//      conjunctions, the こそあど series (taught together in their lessons) or words a
//      lesson's grammar point is built on (ある, もう, いちばん, ください); at most 3 taken
//      from one lesson so every lesson keeps ≥7. Practice words are read-only reading
//      drills (kanji words shown in kana, or kana words a lesson still teaches).
//   2. Lessons: grammar in a Genki / Minna no Nihongo order (です → particles → ます verbs,
//      verb groups, でした, ません, ました → adjectives → existence → wants and comparisons →
//      て-form, then its family → ない-form, then its patterns → dictionary-form patterns →
//      た-form, then its patterns → plain-form patterns), vocab chosen by topic to fit each
//      unit's grammar. Each conjugation form (ticket 36) comes before every pattern built on
//      it, and the て / ない / た-form lessons have verbs in their vocab (their quiz asks for
//      that form). A review unit after every 6 lessons.
//   Load per lesson (map Q13): ~8 vocab / ~2 kanji / 1 grammar, ±25% (tests enforce 6–10
//   vocab, ≤3 kanji, ≤2 grammar). 67 grammar points over 74 lessons means some lessons are
//   vocabulary-only (counting, dates…): grammar: ''.
//   3. Kanji: placed by this script. A kanji is taught in the first lesson at or after the
//      lesson that teaches a word written with it, at most 2 per lesson, kanji whose word
//      is in the current lesson first. Above N5, a word of a lower level counts (明 in N5 明日), so
//      such kanji come early, in the order the lessons' grammar examples need them (see `need`).
//      A kanji no word of any level uses (京 at N4) is placed by hand (4th column).
// A lesson row's grammar is one id or two space-separated ones (close siblings / a short form).
// READY: false writes ready: false on the plan: the app hides the level (liveUnit in lib.js).
// Vocab tokens: 'word' when the word is unique in the catalog, else 'word|reading'.
// Kana/kanji duplicate spellings (ticket 12): only one item is taught; the other carries
// alt: '<taught id>' in vocab.js (set via tools/n5-vocab-overrides.json) and is not listed.
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const LEVEL = (process.argv[2] || "N5").toUpperCase(), lvl = LEVEL.toLowerCase();
const { HIRAGANA, KATAKANA, LESSONS, LESSON_NOTES, DIALOGUES, GUIDES, PREP, READY } = require("./plan-" + lvl + ".js");
const LEVELS_ORDER = ["N5", "N4", "N3", "N2", "N1"];
// a lesson row's grammar: one id, or two space-separated (close siblings / a short form)
const grammarIds = function (l) { return (l[1] || "").split(" ").filter(Boolean); };
const load = function (rel) { vm.runInThisContext(fs.readFileSync(path.join(root, rel), "utf8"), { filename: rel }); };
load("data/catalog.js");
// every level's catalog (word|reading tokens and dialogue ids resolve against it); plans are rebuilt, not loaded
fs.readdirSync(path.join(root, "data")).filter(function (d) { return fs.statSync(path.join(root, "data", d)).isDirectory(); }).sort().forEach(function (d) {
  fs.readdirSync(path.join(root, "data", d)).filter(function (f) { return f !== "plan.js"; }).sort().forEach(function (f) { load("data/" + d + "/" + f); });
});


// ── resolve ────────────────────────────────────────────────────────────────
// items of the plan's level: the pool for vocab tokens, kanji placement and the review pickers
const items = Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.level === LEVEL; });
const vocab = items.filter(function (it) { return it.kind === "vocab"; });
const problems = [];
function vid(tok) {
  if (tok.indexOf("|") > 0) {
    if (CATALOG.items["v:" + tok]) return "v:" + tok;
    problems.push("no vocab " + tok); return null;
  }
  const hits = vocab.filter(function (v) { return v.word === tok; });
  if (hits.length !== 1) { problems.push(tok + ": " + hits.length + " matches (" + hits.map(function (h) { return h.id; }).join(", ") + ")"); return null; }
  return hits[0].id;
}
const words = function (s) { return s.split(" ").filter(Boolean).map(vid).filter(Boolean); };

const units = [];
const uid = function () { return lvl + ".u" + String(units.length + 1).padStart(3, "0"); };
function kanaUnits(list, script) {
  list.forEach(function (u) {
    const kana = u[1].split(" ").map(function (c) { return "c:" + c; });
    kana.forEach(function (id) { if (!CATALOG.items[id]) problems.push("no kana " + id); });
    units.push({ id: uid(), level: LEVEL, kind: "kana", title: u[0], kana: kana, vocab: words(u[2]), practice: words(u[3]), notes: u[4], marks: u[5] ? u[5].split(" ") : undefined });
  });
  units.push({ id: uid(), level: LEVEL, kind: "review", title: "Review: all " + script, quiz: { cap: 10 } });
}
if (HIRAGANA) kanaUnits(HIRAGANA, "hiragana");
if (KATAKANA) kanaUnits(KATAKANA, "katakana");

const kanjiAll = items.filter(function (it) { return it.kind === "kanji"; }); // kanji.js order = Tanos frequency order
// Written forms per lesson, to see where each kanji shows up.
const lessonText = LESSONS.map(function (l) { return words(l[2]).map(function (id) { return CATALOG.items[id].word; }).join(" "); });
const soon = function (k, n) { return lessonText.slice(n + 1, n + 7).some(function (s) { return s.indexOf(k.char) >= 0; }); };
// Words of the lower levels (N5 for N4) are taught before this level's first lesson, so a kanji
// written in one (明 in 明日) may come from lesson 1. A kanji no word of any level uses (京 at N4)
// is placed only by hand (4th column).
const vocabOf = function (f) { return Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; }).filter(function (it) { return it.kind === "vocab" && f(it); }).map(function (it) { return it.word; }).join(" "); };
const lowerText = vocabOf(function (it) { return LEVELS_ORDER.indexOf(it.level) < LEVELS_ORDER.indexOf(LEVEL); });
const anyText = vocabOf(function () { return true; });
// need[char]: the lesson that first shows an example using the kanji (sentence `uses`), so each
// grammar point has clean examples (tests/teaching-order.js). Per point, greedily: of the examples
// whose words and grammar are taught by then and whose kanji can be, the 3 needing the fewest kanji
// not needed yet. Only above N5 (where a lower level's words let most kanji come early); N5 kanji
// follow their words alone.
const need = {};
const pinnedAt = {};
LESSONS.forEach(function (l, n) { (l[3] || "").split(" ").filter(Boolean).forEach(function (c) { pinnedAt[c] = n; }); });
if (lowerText) {
  const known = new Set();
  const isLower = function (id) { const it = CATALOG.items[id]; return it && LEVELS_ORDER.indexOf(it.level) < LEVELS_ORDER.indexOf(LEVEL); };
  const levelKanji = function (id) { return /^k:/.test(id) && CATALOG.items[id] && CATALOG.items[id].level === LEVEL; };
  LESSONS.forEach(function (l, n) {
    words(l[2]).concat(grammarIds(l)).forEach(function (id) { known.add(id); });
    const placeable = function (c) { return c in need || lowerText.indexOf(c) >= 0 || pinnedAt[c] <= n || lessonText.slice(0, n + 1).some(function (t) { return t.indexOf(c) >= 0; }); };
    grammarIds(l).forEach(function (g) {
      const ok = ((CATALOG.items[g] || {}).examples || []).map(function (sid) { return CATALOG.items[sid]; }).filter(function (x) {
        return x && (x.uses || []).every(function (id) {
          const it = CATALOG.items[id];
          if (levelKanji(id)) return placeable(id.slice(2));
          return !/^[vg]:/.test(id) || known.has(id) || isLower(id) || (it && it.alt && (known.has(it.alt) || isLower(it.alt)));
        });
      });
      const fresh = function (x) { return x.uses.filter(function (id) { return levelKanji(id) && !(id.slice(2) in need); }); };
      ok.map(function (x, i) { return { f: fresh(x), i: i }; }).sort(function (p, q) { return p.f.length - q.f.length || p.i - q.i; }).slice(0, 3).forEach(function (p) {
        p.f.forEach(function (id) { if (!(id.slice(2) in need)) need[id.slice(2)] = n; });
      });
    });
  });
}
// Kanji placement: in the first lesson that has a word written with it, most frequent first
// (2 per lesson, 3 when the lesson has 3+ candidates). A kanji that doesn't fit waits for its
// next lesson if that comes within 6 lessons; otherwise it joins the backlog, which fills the
// next lessons with room, oldest first.
// Reading (ticket 15): each lesson review gets the first unused short passage (passages.js
// order) whose vocab and grammar are all taught by then; kanji may be untaught (the quiz shows
// their furigana). mid / info passages are kept for test prep and mocks (passagesFor in lib.js).
// items a mock uses (data/<lvl>/mocks.js) never go into a review
const inMock = new Set([].concat.apply([], items.filter(function (it) { return it.kind === "mock"; }).map(function (m) {
  return [].concat(m.sections.vocab, m.sections.grammar, m.sections.listening).map(function (q) { return q.p || q.l || q.item; });
})));
// vocab / grammar taught by now: this plan's units so far, plus every easier level (an N4 learner knows N5;
// an alt spelling is never taught, so it stays out)
const lowerIds = Object.keys(CATALOG.items).filter(function (id) { const it = CATALOG.items[id]; return !it.alt && LEVELS_ORDER.indexOf(it.level) >= 0 && LEVELS_ORDER.indexOf(it.level) < LEVELS_ORDER.indexOf(LEVEL); });
function taughtSoFar() {
  const t = new Set(lowerIds);
  units.forEach(function (u) { (u.vocab || []).concat(u.grammar || []).forEach(function (id) { t.add(id); }); });
  return t;
}
const shortPassages = items.filter(function (it) { return it.kind === "passage" && it.format === "short" && !inMock.has(it.id); });
const usedPassages = new Set();
function pickPassage() {
  const taughtNow = taughtSoFar();
  const p = shortPassages.find(function (x) {
    return !usedPassages.has(x.id) && x.uses.every(function (id) { return !/^[vg]:/.test(id) || taughtNow.has(id); });
  });
  if (p) usedPassages.add(p.id);
  return p;
}
// Listening (ticket 17): each lesson review also gets one listening item whose vocab and grammar
// are all taught by then, formats in turn (quick, task, utterance, point; the next eligible one when
// the wanted format has none yet). The rest are kept for test prep and mocks (listeningFor in lib.js).
const listenItems = items.filter(function (it) { return it.kind === "listening" && it.format !== "dialogue" && !inMock.has(it.id); });
const LISTEN_TURN = ["quick", "task", "utterance", "point"];
const usedListening = new Set();
let listenTurn = 0;
function pickListening() {
  const taughtNow = taughtSoFar();
  const ok = listenItems.filter(function (x) {
    return !usedListening.has(x.id) && x.uses.every(function (id) { return !/^[vg]:/.test(id) || taughtNow.has(id); });
  });
  const want = LISTEN_TURN[listenTurn % LISTEN_TURN.length];
  const p = ok.filter(function (x) { return x.format === want; })[0] || ok[0];
  if (p) { usedListening.add(p.id); if (p.format === want) listenTurn++; }
  return p;
}
const placed = new Set();
const reserved = new Set([].concat.apply([], LESSONS.map(function (x) { return (x[3] || "").split(" ").filter(Boolean); })));
// The backlog starts with the kanji a lower level's words already use (none at N5), due at their
// need; a kanji that doesn't fit its lesson joins it, due that lesson. Kept sorted by due lesson,
// then frequency (with only overflow kanji in it, that is oldest first).
const early = new Set(kanjiAll.filter(function (k) { return !reserved.has(k.char) && lowerText.indexOf(k.char) >= 0; }));
const due = {};
early.forEach(function (k) { due[k.char] = k.char in need ? need[k.char] : Infinity; });
const backlog = Array.from(early);
const sortBacklog = function () {
  backlog.sort(function (a, b) { return due[a.char] - due[b.char] || kanjiAll.indexOf(a) - kanjiAll.indexOf(b); });
};
let sinceReview = [];
LESSONS.forEach(function (l, n) {
  const u = { id: uid(), level: LEVEL, kind: "lesson", title: l[0], vocab: words(l[2]), kanji: [], grammar: grammarIds(l) };
  u.grammar.forEach(function (g) { if (!CATALOG.items[g]) problems.push("no grammar " + g); });
  if (LESSON_NOTES[l[0]]) u.notes = LESSON_NOTES[l[0]];
  if (DIALOGUES[l[0]]) { u.dialogue = DIALOGUES[l[0]]; if (!CATALOG.items[u.dialogue]) problems.push("no dialogue " + u.dialogue); }
  // l[3]: kanji chosen by hand for this lesson (the rest are placed automatically)
  const fixed = (l[3] || "").split(" ").filter(Boolean).map(function (c) {
    const k = CATALOG.items["k:" + c];
    if (!k || placed.has(k.id)) problems.push(l[0] + ": kanji " + c + " missing or already placed");
    else if (anyText.indexOf(c) >= 0 && lowerText.indexOf(c) < 0 && !lessonText.slice(0, n + 1).some(function (s) { return s.indexOf(c) >= 0; })) problems.push(l[0] + ": kanji " + c + " before any word using it");
    return k;
  }).filter(Boolean);
  fixed.forEach(function (k) { const i = backlog.indexOf(k); if (i >= 0) backlog.splice(i, 1); });
  const mine = kanjiAll.filter(function (k) {
    return !placed.has(k.id) && !reserved.has(k.char) && backlog.indexOf(k) < 0 && lessonText[n].indexOf(k.char) >= 0;
  });
  // kanji due now or within the next 3 lessons (their examples use them) come first, up to 3 in all;
  // the look-ahead spreads a run of example-heavy lessons (none at N5)
  const dueNow = function (k) { return early.has(k) && due[k.char] <= n + 3; };
  sortBacklog();
  const urgent = fixed.length ? [] : mine.filter(function (k) { return need[k.char] <= n; }).slice(0, 3);
  if (!fixed.length) backlog.filter(dueNow).slice(0, 3 - urgent.length).forEach(function (k) { urgent.push(k); backlog.splice(backlog.indexOf(k), 1); });
  const cap = mine.length >= 3 || urgent.length ? 3 : 2;
  const pick = fixed.length ? fixed : urgent.concat(mine.filter(function (k) { return urgent.indexOf(k) < 0; })).slice(0, cap);
  mine.filter(function (k) { return pick.indexOf(k) < 0; }).forEach(function (k) { if (!soon(k, n)) { due[k.char] = n; backlog.push(k); } });
  sortBacklog();
  while (pick.length < 2 && backlog.length) pick.push(backlog.shift());
  pick.forEach(function (k) { placed.add(k.id); u.kanji.push(k.id); });
  units.push(u);
  sinceReview.push(u);
  if (sinceReview.length === 6 || n === LESSONS.length - 1) {
    const a = units.indexOf(sinceReview[0]) + 1, b = units.length;
    const review = { id: uid(), level: LEVEL, kind: "review", title: "Review: units " + a + "–" + b };
    const p = pickPassage();
    if (p) review.passages = [p.id];
    const l = pickListening();
    if (l) review.listening = [l.id];
    units.push(review);
    sinceReview = [];
  }
});

// ── 4. Test prep (ticket 18) ───────────────────────────────────────────────
// After the last lesson review: strategy units, each with a timed section drill (lib.js prepDrill;
// drill = questions per mondai, or passages / listening items per format), then the two fixed full
// mocks (data/<lvl>/mocks.js), with a mixed drill between them. The diagnostic mock (N5: x:n5-mock-3) is
// not a unit: it opens from the Units tab anytime. Unit ids continue after the lessons (n5.u106…).
PREP.forEach(function (p, i) {
  const u = { id: uid(), level: LEVEL, kind: p[2] ? "mock" : "prep", title: p[0], guide: GUIDES[i] };
  if (p[2]) u.mock = p[2]; else u.drill = p[1];
  units.push(u);
});

// ── report ─────────────────────────────────────────────────────────────────
const taught = new Set();
units.forEach(function (u) { ["kana", "vocab", "kanji", "grammar"].forEach(function (f) { (u[f] || []).forEach(function (id) {
  if (taught.has(id)) problems.push(id + " taught twice"); taught.add(id); }); }); });
const left = function (kind) { return items.filter(function (it) { return it.kind === kind && !taught.has(it.id) && !it.alt; }); };
["vocab", "kanji", "grammar", "kana"].forEach(function (kind) {
  const l = left(kind);
  console.log(kind + " not taught: " + l.length + (l.length ? "  " + l.map(function (it) { return it.id; }).join(" ") : ""));
});
if (problems.length) { console.error("PROBLEMS:\n  " + problems.join("\n  ")); process.exit(1); }

const header = '"use strict";\n\n// ' + LEVEL + " plan (ticket 34): ordered units. Generated by tools/author-plan.js from " + (LEVEL === "N5" ? "its outline" : "tools/plan-" + lvl + ".js") + "\n" +
  "// (the teaching order and topic choices live there). Do not edit by hand; edit the outline.\n" +
  "// Ids are opaque and never reused once " + LEVEL + " ships (spec §4, Q21).\n";
fs.mkdirSync(path.join(root, "data", lvl), { recursive: true });
fs.writeFileSync(path.join(root, "data", lvl, "plan.js"), header + "PLAN.push({ level: '" + LEVEL + "', " + (READY === false ? "ready: false, " : "") + "units: [\n" +
  units.map(function (u) { return "  " + JSON.stringify(u); }).join(",\n") + "\n] });\n");
const kinds = {};
units.forEach(function (u) { kinds[u.kind] = (kinds[u.kind] || 0) + 1; });
console.log(units.length + " units " + JSON.stringify(kinds));
