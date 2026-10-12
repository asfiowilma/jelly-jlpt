# Review rubric index

Independent content review of a jelly-jlpt level. Load only the files for your persona and slice. Level values live in `levels/<level>.md`.

## Load set

- Every reviewer: [common.md](common.md), [known-open.md](known-open.md), `levels/<level>.md`.
- Teacher, every slice: [teacher/teaching-order.md](teacher/teaching-order.md) plus one domain file below.
- Newbie: [newbie.md](newbie.md) plus the unit range from `levels/<level>.md`.
- Orchestrator only, never load for review: [owner-intent.md](owner-intent.md).

## Teacher slices

| Slice | Domain file | Reads | Rubric items |
|---|---|---|---|
| `vocab-kanji` | [teacher/vocab-kanji.md](teacher/vocab-kanji.md) | `vocab.js`, `kanji.js`, `kana.js`, `read-words.js`, `plan.js`, caches | B1, B2, B9 |
| `grammar-sentences` | [teacher/grammar-sentences.md](teacher/grammar-sentences.md) | `grammar.js`, `sentences.js`, `plan.js`, `mondai.js` (gap/order only), Tatoeba cache | B3, B4, B6.4, B6.6, B10.3-B10.4 |
| `exam-reading` | [teacher/exam-reading.md](teacher/exam-reading.md) | `mocks.js`, `mondai.js`, `passages.js`, `plan.js` (prep units), jlpt.jp pages | B8, B10.1-B10.2 |
| `listening-dialogues` | [teacher/listening-dialogues.md](teacher/listening-dialogues.md) | `listening.js`, `plan.js`, `audio/manifest.js`, `tools/audio/cast.json` (names, genders only) | B7, B10.5-B10.6 |

Every teacher slice also loads the full catalog headlessly, even when it reads only its own files. Credits (B10.3-B10.4) sit in the grammar-sentences slice; the orchestrator may reassign them explicitly.

## Newbie slices

Contiguous, plan order, each range ending on a review unit where possible. Ranges per level in `levels/<level>.md`. The one-time app walk (C2, last paragraph) only runs for the first or last slice.

## Rounds

- Fresh reviewer per persona per slice per round.
- Re-review reads the previous round's findings for its slice (`review/<level>/r<n-1>/`) only to confirm fixes. It still runs the whole checklist, because fixes regress other checks (a distractor change moves the centre-option rate; a plan change moves teaching order).
- Cap, severity and report format: [common.md](common.md).
