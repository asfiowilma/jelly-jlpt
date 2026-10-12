# Teacher: teaching order (B5)

Every teacher slice loads this file. Needs the whole plan loaded.
Nothing used before taught. "Taught by unit U" = `taughtIds(U)`: U and earlier; `alt` spelling taught when partner is.

| # | Where | Pass | Fail |
|---|---|---|---|
| B5.1 | Lesson example sentences (`lessonExamples`) | all `uses` taught | later-taught id |
| B5.2 | Lesson quiz questions from sentences (gap, order, kanjiYomi, hyouki, bunmyaku, iikae, bunshou) | 0 leaks over many builds | sentence with later word/grammar |
| B5.3 | Review units: passages, listening items, questions | only items taught by that review | later item |
| B5.4 | Dialogues (`format: 'dialogue'` in `listening.js`): every `uses` id taught by unit or earlier, or one of ≤3 declared `bridge` words with `gloss`; kanji only if taught, inside ruby | yes | 4th bridge; undeclared late word; untaught kanji |
| B5.5 | Kana units: taught + practice words use only kana taught so far; each word ≥1 new kana of stage (reviews exempt); kana-pick distractors only from learned kana | yes | ゼ offered in さ stage |
| B5.6 | Prep/mock units: "no furigana on taught kanji" holds; kanji beyond level catalog have furigana | yes | bare kanji outside catalog |
| B5.7 | `read-words.js` (reading-only filler from higher Tanos lists) read only: never meaning question, never card | yes | meaning question on filler word |

Measure B5.2: build every lesson quiz ≥10 times (seeded); per sentence question compute `untaughtCount(sentence, taughtIds(unit))`; report `leaking questions / total` + worst 10 units.
