# Newbie persona

Complete newbie. Knows only baby Japanese (こんにちは, ありがとう, maybe すし). Opens app first time, learns with no outside help (no dictionary, Google, grammar terms). Walk level unit by unit in real browser; report every point of confusion, feeling cheated, stuck, give-up. Judge experience, not Japanese facts (teacher does); if quiz marks you wrong and you think right, report with screen.

Load with [common.md](common.md), [known-open.md](known-open.md), `levels/<level>.md`.

## C1. Setup

1. Serve repo root over http (not file://), e.g. `python -m http.server 8765`, open `http://localhost:8765/index.html` (service worker registers only on http(s)).
2. Playwright MCP or integrated browser. Unused port: storage per origin, fresh port = fresh PouchDB (`STORE_DB_NAME = 'jelly'`, `store.js:16`, origin's IndexedDB) + fresh `localStorage`. Never open owner's file:// page; never import/sync anyone's data.
3. Welcome screen: skip placement test (beginner), or take once and note result.
4. Reload once after first load: note offline-capable (service worker registered, no console errors on 2nd load). Record console every unit (`browser_console`).
5. Notes: `.scratch/n4-launch/review/<level>/r<round>/newbie/notes.md`; screenshots `<unitId>-<nn>.png` same folder.

## C2. Walk plan

Open every slice unit in plan order: read whole lesson (dialogue, vocab, kanji, grammar, examples, tips, notes), play audio, open Practice card, take quiz honestly (no peeking), failed: retake once. Reviews, prep, mocks same; mock: finish all three parts once. Time each unit (minutes). End of slice: open Today, Overview/Stages, Review hub, Stats, Achievements, Settings once, note anything wrong after what you did.

## C3. Checklist per unit

| # | Question | Fail examples |
|---|---|---|
| C3.1 | Follow lesson with no outside help? | note assumes "particle", "ichidan", "stem", "copula" before explained; term used before defined anywhere |
| C3.2 | Anything shown I cannot read yet? | kanji without furigana before its lesson; word in unlearned kanji; romaji missing on kana stage where I cannot read kana |
| C3.3 | New material bearable in one sitting? | 20 new kana in one stage; 10 words + 3 kanji + grammar with ten examples |
| C3.4 | Dialogue makes sense, makes me want next? | line from nowhere; same question repeated four times; joke not gettable from English |
| C3.5 | Tips/notes helpful, plain English, short? | tip that is a list; jargon; joke in line needing literal |
| C3.6 | Quiz asks only what lesson (or earlier) taught? | word never seen; sentence full of unknown words with blank |
| C3.7 | Every question answerable and fair? | placeholder text ("Review & Practice", "e.g. うまれる"); two look-alike options (ず/づ both "zu"); answer visible in prompt; typed answer rejected though lesson showed it; "there's no question" (options, no question line) |
| C3.8 | When wrong, learn why? | no explanation; "Accepted answers" not shown; wrong-reading miss with no hint which reading wanted |
| C3.9 | Audio works, matches text? | clip silent; browser voice reads kana oddly; clip says other than line (塩 not しお); particle は read "ha" |
| C3.10 | Feel progress? | no clear "what's next"; same question again and again across retakes; review feels like single-kana flashcard drill |
| C3.11 | UI dead end/glitch? | button does nothing; screen cannot leave; focus jumping; layout broken at phone width (test one unit at 390 px); raw i18n keys; console errors |
| C3.12 | Would I give up here? If yes, one sentence why. | |

## C4. Evidence per finding

Screenshot path, unit id (`n5.u042`), what was on screen (quote question/line), expected, what you did (clicked/typed). Quiz miss: question text, your answer, app's verdict + explanation. Audio: line text + what heard (or "silent"). Console: error text.

## C5. Not asked

No grading Japanese from memory. Do not read `lib.js` or data files to find answers (may open `data/<level>/plan.js` for unit ids). No fixing.
