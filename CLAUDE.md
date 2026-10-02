# CLAUDE.md — jlpt-n5

## Project overview

A free, self-contained, zero-dependency interactive Japanese course from zero to JLPT N1 in 1,720 days (N5 + N4 + N3 + N2 + N1 complete).
Everything runs in the browser with no build step and no installation required.

## Repository structure

```
jlpt-n5/
├── index.html              # Shell: head, CSP, <script src> load order, <div id="root">
├── styles.css              # All app CSS (extracted from index.html's old inline <style>)
├── curriculum/             # Lesson data, one file per phase (00 = shared constants)
│   ├── 00-constants.js     #   var curriculum = []; + PHASE_COLORS/PHASE_BG/PHASE_NAMES
│   ├── 01-hiragana.js      #   each later file: curriculum.push({...}) per day, in order
│   ├── 02-katakana.js
│   ├── ...
│   └── 32-n1-test-prep.js
├── lib.js                  # Pure utility functions: SM-2, card helpers, exercises
├── app-helpers.js          # t()/translation strings, localStorage load/save, TTS, stroke-order fetch
├── components/             # One React component per file (plain React.createElement, no JSX)
│   ├── review-view.js
│   ├── typing-tip.js
│   ├── char-card.js
│   ├── exercises.js
│   ├── day-view.js
│   ├── review-mode.js
│   └── overview.js
├── app.js                  # App component + ErrorBoundary + ReactDOM.createRoot(...).render(...)
├── tests.html              # QUnit browser test suite (open directly, no server)
├── tests/                  # One file per QUnit module, loaded by tests.html via <script src>
│   ├── sm2-update.js
│   ├── check-typing.js
│   └── ... (19 files total, see Tests below)
├── README.md               # User-facing documentation
└── .nojekyll               # Disables Jekyll processing for GitHub Pages
```

No bundler, no ES modules — every file above is a plain classic `<script src>` that
defines top-level `var`/`function` globals. **Load order is load-bearing** and is
not inferred automatically; it's spelled out in a comment at the top of
`index.html`'s `<body>` (curriculum/ → lib.js → app-helpers.js → components/*.js,
any order → app.js last, since app.js is what actually calls `ReactDOM.render`).

`curriculum/*.js` and `lib.js` are loaded by both `index.html` (app) and `tests.html`
(test suite), making the pure functions testable without a build step. The headless
runner (`.claude/hooks/run-tests.js`) loads every file in `curriculum/` by reading
the directory (sorted), so a new phase file just needs to exist there — no path to
update. It also loads `app-helpers.js` + `components/*.js` + `app.js` in the same
order as `index.html` to exercise the React render smoke tests.

Adding a feature that's self-contained in its own component: add one file under
`components/`, add its `<script src>` tag to `index.html` (and to the `appFiles`
list in `.claude/hooks/run-tests.js` if it should be smoke-tested), done — no other
file needs touching.

## Running the app

Open `index.html` directly in a browser — no server needed.

```bash
# macOS
open index.html

# Linux
xdg-open index.html
```

## Tech stack

- **React 18** loaded from CDN (`cdnjs.cloudflare.com`) — no npm or bundler
- **Vanilla CSS** inlined in `<style>` tags
- **Web Speech API** for text-to-speech (Japanese voice)
- **localStorage** for progress persistence
- **No build step, no transpilation, no dependencies to install**

## Linting

HTML can be validated with:

```bash
npx html-validate index.html
```

## Tests

**Tests must pass before every commit and push.**  The pre-commit hook enforces
this automatically — any `git commit` or `git push` Bash call is blocked when
the test suite reports failures.

### Running tests

**In the browser (full suite):**
```
open tests.html        # macOS
xdg-open tests.html    # Linux
```

**Headlessly via Node.js (CI / hooks):**
```bash
node .claude/hooks/run-tests.js
```

### Test coverage — 20 modules

| Module | What is tested |
|---|---|
| `sm2Update` | All interval branches, EF formula, 1.3 clamp, due-date, no mutation |
| `checkTyping` | Exact, case, whitespace, `/` and `,` alternatives, multi-answer |
| `cardId` | ID string format |
| `addDayCards` | Card creation, initial values, no-overwrite guard |
| `getDueCards` | Past/future filtering, returns ID strings |
| `cardToItem` | Vocab/char field resolution, null reading, OOB → null |
| `rndShuffle` | Length, elements, no mutation, new reference |
| `buildExercises` | ≤5 cap, empty lesson, MC bounds, typing answers |
| `srsReview` | Quality→grade mapping, EF clamp, no mutation, new object |
| `srsAddCards` | Embedded card data, no-overwrite, bool return value |
| `srsDueCards` | Returns objects not IDs, due/not-due filtering |
| **Curriculum integrity** | 1,720 sequential days, required fields, type validity, vocab/chars structure, phase/week ranges, N5/N4/N3/N2/N1 boundary checks |
| **Phase constants** | PHASE_COLORS, PHASE_BG, PHASE_NAMES defined and correct for all 32 active phases |
| **furiganaHTML** | Ruby tag generation, hiragana passthrough, null/empty reading handling |
| **dayToLevel** | Correct N5/N4/N3/N2/N1 mapping for boundary days |
| **exerciseCap** | Returns 5/7/9 for N5+N4/N3/N2+N1 respectively |
| **buildExercises (N3+ types)** | fill_blank, conjugation, pair_match; N2: synonym, kanji_reading; cap enforced |
| **passage rendering** | All reading-type days have text_jp and text_en |
| **React render** | index.html inline script executes, App/DayView/Overview/ReviewMode render without error |

## Curriculum structure

| Days      | Phase | Name                                               |
|-----------|-------|----------------------------------------------------|
| 1–14      | 1     | Hiragana (46 characters)                           |
| 15–28     | 2     | Katakana (46 characters)                           |
| 29–84     | 3     | Foundations (numbers, particles, basic sentences)  |
| 85–140    | 4     | Vocabulary (~200 N5 words)                         |
| 141–182   | 5     | Verbs (て-form, ます-form, conjugation)            |
| 183–252   | 6     | Grammar Patterns (particles, conditionals, keigo)  |
| 253–308   | 7     | Kanji (~100 N5 kanji)                              |
| 309–365   | 8     | Test Prep (N5 review & JLPT prep)                  |
| 366–395   | 9     | N5 Review (bridge to N4)                           |
| 396–455   | 10    | N4 Vocabulary (~300 words)                         |
| 456–500   | 11    | N4 Verbs                                           |
| 501–555   | 12    | N4 Grammar Patterns                                |
| 556–620   | 13    | N4 Kanji (~175 kanji)                              |
| 621–660   | 14    | N4 Test Prep                                       |
| 661–690   | 15    | N4 Review (bridge to N3)                           |
| 691–770   | 16    | N3 Vocabulary (~1,500 words)                       |
| 771–820   | 17    | N3 Verbs & Adjectives                              |
| 821–895   | 18    | N3 Grammar Patterns (~120 patterns)                |
| 896–930   | 19    | N3 Kanji (~170 kanji)                              |
| 931–960   | 20    | N3 Test Prep                                       |
| 961–990   | 21    | N3 Review (bridge to N2)                           |
| 991–1090  | 22    | N2 Vocabulary (~3,000 words)                       |
| 1091–1140 | 23    | N2 Verbs & Expressions                             |
| 1141–1230 | 24    | N2 Grammar Patterns (~180 patterns)                |
| 1231–1275 | 25    | N2 Kanji (~200 kanji)                              |
| 1276–1320 | 26    | N2 Test Prep                                       |
| 1321–1350 | 27    | N2 Review (bridge to N1)                           |
| 1351–1470 | 28    | N1 Vocabulary (~4,000 words)                       |
| 1471–1530 | 29    | N1 Verbs & Expressions                             |
| 1531–1640 | 30    | N1 Grammar (~220 patterns)                         |
| 1641–1690 | 31    | N1 Kanji (~300 kanji)                              |
| 1691–1720 | 32    | N1 Test Prep                                       |

## Key implementation notes

- All 1,720 day definitions live in `curriculum.js` — the first 365 as a JSON array literal, days 366–1,720 appended via `curriculum.push()` calls
- Two SM-2 implementations exist side-by-side: `sm2Update` (older, used by `ReviewView`) and `srsReview` (newer, used by `ReviewMode` + `App`). Both use `ease`/`ef` for the same concept.
- Quiz state, SRS card data, and completed-day flags are stored in `localStorage`
- The lesson view, overview calendar, and review flashcard deck are separate React components in `index.html`
- TTS is triggered via `window.speechSynthesis` using `lang: 'ja-JP'`
- Pure utility functions (`sm2Update`, `checkTyping`, `cardId`, `buildExercises`, etc.) live in `lib.js` and are tested headlessly by `.claude/hooks/run-tests.js`

## Browser compatibility

| Browser       | Lessons | TTS          | Speech recognition |
|---------------|---------|--------------|--------------------|
| Chrome / Edge | Yes     | Yes          | Yes                |
| Safari        | Yes     | Yes          | Yes                |
| Firefox       | Yes     | Limited      | No                 |

## Deployment

Hosted on GitHub Pages — push to `main`, enable Pages from repo Settings (branch: main, root `/`).
Live URL pattern: `https://<username>.github.io/jlpt-n5`

## Commit convention

Commits follow [gitmoji](https://gitmoji.dev/): `<emoji> [scope?]: <imperative message>`, body only when the why isn't obvious. One emoji per commit. Common ones: ✨ feature, 🐛 fix, ♻️ refactor, 📝 docs, ✅ tests, 🔧 config, 🚑️ hotfix, 💥 breaking change.

## Agent skills

### Issue tracker

Issues and specs are tracked as local markdown files under `.scratch/<feature-slug>/`, one file per ticket. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root, read lazily when they exist. See `docs/agents/domain.md`.
