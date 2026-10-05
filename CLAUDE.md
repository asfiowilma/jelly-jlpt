# CLAUDE.md — jelly-jlpt

## Project overview

A free, browser-only Japanese course aimed at passing the JLPT. It started as a fork of
alanfwilliams/jlpt but is now a separate project: upstream is no longer synced and the
content is being rebuilt level by level from reference datasets.

- **N5** is built: kana from zero (hiragana, katakana), then vocab, kanji and grammar lessons
  with review units (timed mini-mocks), then a test-prep block (strategy units with timed drills,
  two fixed full mocks) and an anytime diagnostic mock. N5 is not released yet (needs README).
- **N4–N1** show as "Coming soon" in the Overview until each level is rebuilt.
- Content is organised in **units** (`kana`, `lesson`, `review`, `prep`, `mock`).
  "Day" is not a unit. The learner picks a **pace** (units per calendar day: 0.5 / 1 / 2 / 3)
  that only drives targets and projections. Nothing is locked; every unit is open.

No build step, no npm, no bundler, no ES modules. Every file is a classic `<script src>`
that defines top-level globals. React 18 and PouchDB 9 are vendored in `vendor/` (minified builds + license files, no CDN).

## Repository structure

```
index.html            CSP, <script src> list in load order, <div id="root">
styles.css            all app CSS (palettes + light/dark themes)
manifest.webmanifest  PWA manifest (relative paths, Kokuban dark colours); icons/icon-*.png from tools/build-icons.js
sw.js                 GENERATED service worker (precache list + content-hash cache version): never edit by hand
sw-register.js        registers sw.js (http/https only); emits `sw-update-ready`, exposes `__swApplyUpdate()`
vercel.json           no-cache headers for sw.js + manifest (static deploy, no build)
data/
  catalog.js          CATALOG { items, add } + PLAN = [] + CATALOG_ID_PREFIX
  n5/                 one file per item kind + plan.js
    kana.js vocab.js kanji.js grammar.js sentences.js mondai.js passages.js listening.js mocks.js plan.js
lib.js                pure logic (no DOM): units, conjugation, distractors, exercises,
                      SRS, store doc shapes + merge, stats, pace, export/import
store.js              Store: PouchDB persistence + optional CouchDB sync
app-helpers.js        t() progressive UI strings, TTS, icons, stroke-order SVG fetch
sfx.js                quiz/achievement sounds from sfx/ (Kenney, CC0)
components/           one React component per file, React.createElement, no JSX
  kanji-section.js kana-section.js quiz-shell.js (shared .ql layer + question renderer) exercises.js unit-view.js prep-guide.js review-mode.js today-view.js
  overview.js stats-view.js settings-view.js mock-exam.js toast-stack.js stamp.js achievements-view.js
                      (prep-guide.js renders `unit.guide`: lead, optional `part` 0-2 + `partJp` + `glance`, kinds, time/rules; strings take `**bold**` and `[漢字|かんじ]` furigana)
app.js                App: builds UNITS from PLAN + CATALOG, awaits Store.init(), mounts
vendor/               React 18.2.0, ReactDOM, PouchDB 9.0.0 (minified) + LICENSE-*.txt. Upgrade = replace file, update index.html/tests.html/credits
audio/                pre-rendered listening clips `<12 hex>.mp3` (Qwen3-TTS, Apache-2.0) + generated `manifest.js`
                      (`AUDIO_MANIFEST = { tracks: { <listening id>: [clip per script line] } }`); clips are NOT precached
kanji-svg/            KanjiVG stroke-order SVGs (<hex codepoint>.svg), CC BY-SA 3.0, plus strokes.js
                      (generated bundle `KANJI_SVG` for file://; rerun `node tools/build-strokes.js`)
tools/                zero-dep Node authoring scripts + checks (dev only, outputs committed)
  ref/n5.json         reference list: which vocab/kanji/grammar belong to N5
  audio/              listening TTS inputs: tracks.json (export-tracks.js), voice archetypes + assignments, render-notebook.ipynb (Colab); see its README
tests/                QUnit modules, one file per area
tests.html            browser QUnit runner
.claude/hooks/        run-tests.js (headless runner), pre-commit.sh, session-start.sh
legacy/curriculum/    old day-based upstream content. Not loaded; salvage quarry only
docs/adr/             architecture decision records
docs/agents/          issue-tracker and domain-doc conventions for agents
```

## Architecture

### Load order (load-bearing, nothing resolves it for you)

`data/catalog.js` → `data/<level>/*.js` → `lib.js` → `store.js` → `app-helpers.js` →
`sfx.js` → `components/*.js` (any order) → `app.js` last. The comment at the top of
`index.html`'s `<body>` is the reference.

Adding a file means adding its `<script src>` by hand:

| New file | index.html | tests.html | run-tests.js |
|---|---|---|---|
| `data/<lvl>/*.js` | add tag | add tag | automatic (reads `data/` sorted) |
| `audio/manifest.js` (generated) | tag after the data scripts | tag | already in `appFiles` |
| `components/*.js` | add tag | — | add to `appFiles` |
| `tests/*.js` | — | add tag | automatic (reads `tests/` sorted) |

**PWA rule: relative paths only (no leading `/`, no absolute URLs) so one tree serves GitHub Pages
(subpath) and Vercel (root). After adding or changing ANY shipped file (script, css, data, icon,
sfx, kanji-svg, index.html), rerun `node tools/build-sw.js` and commit `sw.js`.** `run-tests.js`
regenerates in memory and fails if `sw.js` is stale, if a script `index.html` loads or a shipped js
on disk is missing from the precache list, or if a listed file is missing. The pre-commit hook runs
that suite, so a forgotten rerun blocks the commit. Any new top-level shipped file type needs
adding to `listFiles` in `tools/build-sw.js`. **Audio exception:** `audio/manifest.js` is precached like any script, but `audio/*.mp3` (~7 MB) is
not (`RUNTIME_ONLY` in `build-sw.js`): sw.js caches each clip on first play, cache-first, in the stable cache `jelly-audio-v1` that
activate never deletes. Offline and not yet played = the page falls back to the browser voice. Progress is per-origin: see README "Install and deploy".

### Catalog + plan

- **Catalog** (`data/<lvl>/<kind>.js`, each calling `CATALOG.add([...])`): every teachable
  item exactly once, with a content-keyed, stable id.

  | Kind | Id |
  |---|---|
  | kana | `c:<kana>` |
  | vocab | `v:<word>\|<reading>` |
  | kanji | `k:<char>` |
  | grammar | `g:<slug>` |
  | sentence | `s:tatoeba:<n>` or `s:own:<slug>` (optional `chunks` for ★ questions) |
  | mondai | `m:<slug>`: authored exam items (`type` iikae / bunshou), not taught, no SRS card |
  | mock | `x:<lvl>-mock-<n>`: a fixed mock exam (`format` full / diagnostic), sections of fixed questions |
  | passage | `p:<level>-<slug>`: own reading texts (`format` short / mid / info), review units list them in `passages` |
  | listening | `l:<level>-<slug>`: own dialogue scripts (`format` task / point / utterance / quick), review units list one in `listening` |

  Items carry `level`, `sources`, `verified`. Vocab has `pos` (drives conjugation). Vocab and kanji
  may carry `accept` (extra English answers for typed meaning questions). Bound vocab (pos
  suffix / prefix / counter: 人|じん, 枚, お…) carries `contexts` (`{ f: furigana compound, en, alt? }`)
  and is only ever asked inside one (`boundForms`: fill the blank, reading of the compound).
  A duplicate spelling carries `alt: <id of the spelling the plan teaches>`.
- **Plan** (`data/<lvl>/plan.js`, `PLAN.push({ level, units: [...] })`): ordered units that
  reference item ids (`kana`, `vocab`, `kanji`, `grammar`, `practice`). Unit ids
  (`n5.u001`…) are opaque; once a level ships, never reuse or renumber them.
- `lib.js` joins them: `validatePlan(PLAN, CATALOG)` checks every reference resolves,
  `buildUnits` resolves items and gives a review unit the items of the units since the
  previous review. `app.js` does this once at load into `UNITS`.
- **Kana units** teach their kana plus 2–5 real vocab words written only in kana learned so far
  (moved out of later lessons; read-only `practice` words fill gaps). Their quiz tests reading
  mostly through words (`kanaReadWords`: any verified N5 word spelled only with kana learned up
  to the stage and holding at least one of the stage's new kana/marks (reviews: any), hiragana
  readings of kanji words included; katakana stages katakana words only; then Tanos N4/N3 words
  from `data/n5/read-words.js`), read only, never their meaning, no card; a single-kana question
  only for a new kana no word holds (`kanaQuizSlots`). Romaji → kana typing shows ー as a macron
  (kōhī) and the box types - as ー. Taught words also get a meaning question. It passes only with ≥85% on
  reading and ≥80% on meanings (`scoreQuiz` split by `ex.part`). A review quizzes every
  kana/lesson unit since the previous review.
- **Quiz variety** (ticket 43): `quizLength` is a maximum; `quizSize` shortens to the items
  (min 8, each item at most twice, `spaceOut` keeps repeats 3+ questions apart). Early units
  widen the distractor pool with untaught same-level items (`DISTRACTOR_MIN_POOL`), with no cap
  on how often a word is a wrong option. `localStorage` `jlpt_recent_q` (last 100 item|form,
  device-only, never synced, no SRS effect) steers the next quiz to other forms and items.

### Persistence (store.js)

PouchDB database `jelly` (IndexedDB), in-memory fallback when PouchDB is missing (Node tests,
blocked IndexedDB). Reads come from a synchronous memory mirror; writes go through an async
queue. Doc shapes are documented in `lib.js` above `STORE_ID_RE`:

| Doc id | Body |
|---|---|
| `unit:<unitId>` | `{ done, completedAt }` |
| `card:<itemId>` | SM-2 card (`interval`, `ease`, `due`, `reps`, `lastReviewedAt`…). Same item = same card wherever it appears |
| `prefs:learning` | `{ currentUnit, pace, examDate, furigana, uiLang, kanjiView }` (defaults: `PREFS_DEFAULTS`; `kanjiView` = lesson Kanji layout, `rows` or `focus`) |
| `log:<YYYY-MM-DD>:<deviceId>` | daily activity log, written only by its own device |
| `mock:<mockId>:<takenAt>` | one taken mock (`mockResult`): parts, byMondai, answers, estimate. Write-once |
| `ach:<achievementId>` | `{ unlockedAt }` one earned achievement. Sticky: written once, merge = earliest unlock wins, `replaceAll` keeps them |

Every doc also gets `updatedAt` and `deviceId`. Conflicts merge through `mergeStoreDocs`.
Device-only prefs (palette, theme, TTS rate, sfx mute) stay in localStorage
(`DEVICE_PREF_KEYS`) and never sync. There is no migration from the old day-keyed data.

### Main lib.js functions

| Area | Functions |
|---|---|
| Units | `validatePlan`, `buildUnits`, `nextUnit`, `levelRamp`, `taughtIds` |
| Quiz | `buildExercises(unit)`, `quizLength`, `passMark`/`quizPassed`, `scoreQuiz`, `pickDistractors`, `checkTyping` (English: `normEn`, plural, typos, reject set `englishPool()`), `otherReading` (homograph reading = retry), `isBound`/`boundForms` |
| Distractors | `pickDistractors` (+ `DISTRACTOR_RULES`), `kanaDistractors`, `readingFakes`, `spellingFakes` |
| Mocks + timing (ticket 18) | `MOCK_BLUEPRINT`, `MOCK_PACE` (real N5 pacing), `quizSeconds`, `isTimedQuiz`, `mockSections`, `mockSteps` (start + between-parts rows), `mockResult`, `mockEstimate` (linear scaled-score estimate, `JLPT_PASS`), `prepDrill` |
| Exam formats (N5 mondai) | `MONDAI` table, `mondaiQuestions(type, item, ctx)` (for mocks); in quizzes via `formsFor`: kanjiYomi, hyouki, bunmyaku (vocab), hyouki (kanji), gap, order ★ (grammar); iikae / bunshou authored in `mondai.js` |
| Reading / listening | `passagesFor`, `readingExercises`; `listeningFor(level, format)`, `listenQuestion(item, taughtKanji, { mock })` (mock = 1 replay), `listeningScript`, `chunkSpeech`, `assignVoices` (app-helpers.js `speakScript` plays the pre-rendered clip of each script line when every line has `clip`, else Web Speech; a clip that fails hands the rest to Web Speech). Script lines and `optionSpeech` get `clip` from `AUDIO_MANIFEST` (`listenClips`); with a custom option `order`, narrator number clips stay in their slot and option clips follow the option |
| Grammar | `conjugate(dict, reading, form, pos)` (rule-based, by `pos`) |
| SRS | `srsAddCards(unit, cards)`, `srsReview(card, quality)`, `srsPreview(card)` (days per rating: Good = SM-2 pass interval, Hard = 0.8×, Easy = 1.3×, Again = 1; `srsReview` reads it, so buttons can't drift), `srsDueCards`, `srsFlagMissed`, `admitCards` (app.js: `releasePendingCards`, `markUnitsDone`) |
| Review card back | `stageOf(id)` (unit that teaches an item), `cardExample(id)` → `{ s, at, end }`: catalog sentence for the card (fewest later-taught items, ≤ `EXAMPLE_MAX_UNTAUGHT`; none for kana) + highlight range of the word, null when ambiguous. Review UI (`components/review-mode.js`): hub, full-screen session in the `.ql` layer, day-aware summary (reads `dayPlan`) |
| Already known (import) | `seedKnownCards` (21–28 day cards, spread under `reviewBudget` = 5 × `dailyCardCap`), `undoImport`, `importBatches`, `knownCount`, `quickSortItems`, `matchCatalogText` (app.js: `seedKnown`, `undoKnown`; UI in `components/import-view.js`) |
| Day plan (Today tab) | `dayPlan` (steps stage/review/complete from pace + progress; review first when ≥20 cards overdue), `realCompletions`, `quizHandoff` (what the passed-quiz screen offers next), `foldDoneStages` (>3 passed stages become one `fold` step in the plan panel, bar and step numbers). `components/today-view.js`: `currentDayPlan`, `TodayView` (copy: `.scratch/today-home/copy.md`) |
| Pace | `PACE_MODES`, `todayTarget`, `projectFinish`, `suggestPace`, `newCardCap`, `dailyCardCap` (enforced via pending cards) |
| Store | `docsToSnapshot`, `mergeStoreDocs`, `exportProgress`, `validateProgressData` |
| Stats | `srsStats`, `dueForecast`, `computeStreak`, `retention`, `studyHeatmap` |
| Achievements (ticket 08) | `ACHIEVEMENTS` (defs: id, name, desc, category, rarity, hidden, revealed, level), `achievementDefs`, `evaluateAchievements(docs, unlocked, ctx)`, `achievementList`, `achievementBatch` (retro = 1 summary, live = stack + 1 jingle), `unseenUnlocks`; store.js `achievementUnlocks()`, `Store.putUnlocks` |
| Display | `furiganaHTML`, `furiganaOn(stored, level)` |

UI strings (`t(key, level)` in `app-helpers.js`) are English at N5. From N4 a `ja` string shows when it
has no kanji, or when every kanji in it is learned (kanji of completed or placement-skipped stages:
`learnedKanji`/`uiJaShown` in lib.js, `window._learnedKanji` set by App each render). Kanji not in the
catalog never count as learned, so those strings stay English. The `uiLang` pref overrides.

## Content pipeline

**Building a new level? Read `docs/level-playbook.md` first**: every N5 mistake (data
errors, loose sentence matching, answer leaks, bound-morpheme questions, strict typed answers…)
and the rule that prevents it.

| Step | Tool |
|---|---|
| Reference list per level (list membership only) | `node tools/build-ref.js <research/data dir> N5` → `tools/ref/n5.json` |
| Vocab | `node tools/author-vocab.js <jisho-cache dir> [--fetch]` → `data/n5/vocab.js`, from `tools/ref` + `tools/n5-vocab-overrides.json`, JMdict cross-check via Jisho |
| Kanji | `node tools/author-kanji.js <wiktionary-cache dir> [--fetch]` → `data/n5/kanji.js`, from `tools/ref` + `tools/n5-kanji-overrides.json`, checked against KANJIDIC + Wiktionary |
| Grammar + sentences | hand-authored in `data/n5/grammar.js` / `sentences.js`; method in `tools/n5-grammar-notes.md` |
| Kana | hand-authored table in `data/n5/kana.js` |
| Kana reading words beyond N5 | `node tools/build-read-words.js <jisho-cache dir> [--fetch]` → `data/n5/read-words.js` (Tanos N4/N3 katakana + yōon/ぱ-row words, reading checked against JMdict; read only) |
| Plan | `node tools/author-plan.js` → `data/n5/plan.js`, from the outline inside the script |
| Coverage report | `node tools/coverage.js` (catalog vs ref list, taught vs not, verified counts) |
| Listening audio | `node tools/export-tracks.js` → `tools/audio/tracks.json`; render in the Colab notebook (`tools/audio/render-notebook.ipynb`); `node tools/build-audio-manifest.js <rendered dir>` → `audio/manifest.js` (checks every clip name = sha1 of its clipKey, files present); copy the mp3s into `audio/`, then `node tools/build-sw.js`. `run-tests.js` fails if a transcript changed without re-rendering |
| Service worker | `node tools/build-sw.js` → `sw.js` (rerun after any shipped-file change) |
| PWA icons | `node tools/build-icons.js` → `icons/icon-{192,512,maskable-512}.png` from `icons/icon.svg` via headless Edge/Chrome (one-off) |

Generated files (`vocab.js`, `kanji.js`, `plan.js`) say "do not edit by hand": change the
overrides JSON or the plan outline and rerun the script. The research inputs and fetch caches
live in `.scratch/content-audit/research/data/` (gitignored); see each script's header for
exact inputs.

Catalog checks (`tests/catalog-checks.js`, `tests/catalog-plan.js`) run with the test suite:
unique ids and id prefixes, required fields per kind, readings well-formed and consistent
with kanji, `verified:true` needs ≥2 distinct sources (`legacy` doesn't count), sentences
contain what they `uses`, furigana spells jp, ★ chunks spell jp (4 distinct, no cut furigana),
mondai items (4 distinct options + answer, blanks numbered in order), grammar examples, every plan reference resolves, no item taught
twice, per-lesson load within the guide (N5: ~8 vocab / ~2 kanji / 1 grammar), no placeholder
titles, every reference-list item taught, catalog levels match `tools/ref`.

## Content rules

Japanese facts (levels, readings, meanings, grammar) come from research against the sources
below, never from the project owner. The owner decides technical shape only; don't ask them
Japanese questions.

1. **Authority order**: jlpt.jp (format, scoring) > Tanos (vocab/kanji/grammar levels) >
   Jisho/JMdict, KANJIDIC (readings, glosses: authoring-time check only) > Tatoeba
   (sentences) > JLPT Sensei / Tofugu / NHK Easy (cross-check and links only).
2. **Verified** = ≥2 independent sources plus the automated checks. Anything less ships as
   `verified:false` with the reason in `notes`.
3. **Never copy** text, items or audio from jlpt.jp (official workbooks), JLPT Sensei or NHK
   News Web Easy. Link out; write original items in the official formats.
4. **No bulk EDRDG data** (JMdict, KANJIDIC are CC BY-SA): use them to check facts, don't
   ship their fields or files.
5. **Explanations in our own words**: glosses, meanings, notes and grammar explanations are
   written for this project.
6. **Attribution**: credits live in Settings (`CREDITS` in `components/settings-view.js`).
   Tanos (CC BY), Tatoeba (CC BY 2.0 FR: every Tatoeba sentence keeps its id, `author`,
   `license`, and `enId`/`enAuthor`/`enLicense`), KanjiVG (CC BY-SA 3.0; keep the SVGs as
   separate files), elzup/jlpt-word-list (MIT). Adding a third-party source means adding a
   credit.

Full source and license notes: `.scratch/content-audit/research/sources.md` and
`licenses-and-audio.md`.

## Running the app

Open `index.html` in a browser. No server needed.

## Tests

**Tests must pass before every commit and push.** `.claude/hooks/pre-commit.sh` (a
PreToolUse hook) runs the suite on any `git commit` / `git push` Bash call and blocks on
failure.

```bash
node .claude/hooks/run-tests.js     # headless, exit 0 = pass
```

`run-tests.js` loads the same scripts as `index.html` into a Node `vm` with stubbed
browser APIs and React, sets `REF` from `tools/ref/*.json`, runs every `tests/*.js` through
a minimal QUnit shim, then runs inline Node-only checks (React render smoke tests,
`safeSave`, `sanitizeSvg`, stroke-order fetch).

`tests.html` runs the same QUnit modules in a browser (open it directly). From `file://` it
can't read JSON, so the reference-list level check is headless-only.

**Worktree gotcha:** `run-tests.js` and the hooks resolve the project root from
`CLAUDE_PROJECT_DIR` when it is set. In a git worktree that variable can point at the main
checkout, so the hook tests main's files, not yours. Run the suite against the worktree
explicitly: `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`.

## Commit convention

[gitmoji](https://gitmoji.dev/): `<emoji> <Imperative message>`, body only when the
why isn't obvious. No scopes, brackets or colons in the subject. One emoji per commit. Common: ✨ feature, 🐛 fix, ♻️ refactor, 📝 docs,
✅ tests, 🔧 config, 🍱 assets/data, 🚑️ hotfix, 💥 breaking change.

## Agent skills

### Issue tracker

Issues and specs are local markdown files under `.scratch/<feature-slug>/` (gitignored), one
file per ticket. See `docs/agents/issue-tracker.md`. The content rebuild lives in
`.scratch/content-audit/` (`map.md` decisions, `spec.md`, `issues/`).

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root, read lazily when they exist.
See `docs/agents/domain.md`.
