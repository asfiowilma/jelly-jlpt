# Level playbook: index

Rules for building new levels (N3 and up), split by task. Load only the files your task needs.
History (what went wrong, the bug tables, review findings) lives in
[archive/level-playbook-full.md](archive/level-playbook-full.md). Read it only to learn why a rule exists.

Files must work without the gitignored scratch folders (`.scratch/`).

## Task → files to load

| Task | Load |
|---|---|
| Ref list, `build-ref.js` | [source-data.md](source-data.md) |
| Vocab overrides, `author-vocab.js` | [source-data.md](source-data.md), [kanji.md](kanji.md) for kanji fields |
| Kanji overrides, `author-kanji.js` | [kanji.md](kanji.md) |
| Grammar inventory, grammar + sentences | [grammar-sentences.md](grammar-sentences.md), [tatoeba-hints.md](tatoeba-hints.md) |
| Plan outline, `author-plan.js` | [plan.md](plan.md) |
| Quiz and lib changes | [quiz-rules.md](quiz-rules.md), [exam-formats.md](exam-formats.md) |
| Passages, mondai, mocks, guide copy | [exam-content.md](exam-content.md), [exam-formats.md](exam-formats.md) |
| Listening, audio, rendering | [listening-audio.md](listening-audio.md) |
| Lesson dialogues | [dialogues.md](dialogues.md) |
| Orchestration, review rounds | [process-review.md](process-review.md) |
| Licences, release | [licences.md](licences.md) |
| Building N3, step by step | [build-n3.md](build-n3.md) (it lists the other files per step) |

## Universal rules

- Build levels from N5 upward in one command, so the lowest level wins.
- Every fact needs at least two independent sources and a machine check. The owner cannot check Japanese.
- Quiz prompts never show the answer. Glosses are English only.
- Once a level ships, never reuse or renumber its unit ids.

## Old section numbers

Old references (`§1`, `§7b`, "Exam guide voice") still point here. Map:

| Old | New file |
|---|---|
| §1 Source data | [source-data.md](source-data.md) |
| §2 Grammar inventory, §3 Example sentences | [grammar-sentences.md](grammar-sentences.md) |
| §3 Tatoeba hint table | [tatoeba-hints.md](tatoeba-hints.md) |
| §4 Kanji | [kanji.md](kanji.md) |
| §5 Plan | [plan.md](plan.md) |
| §6 Quiz questions | [quiz-rules.md](quiz-rules.md) |
| §7 Passages, listening, mocks | [exam-content.md](exam-content.md), [listening-audio.md](listening-audio.md) |
| §7b Exam guide voice | [exam-content.md](exam-content.md) |
| §7c Lesson dialogues | [dialogues.md](dialogues.md) |
| §8 Process, review loop | [process-review.md](process-review.md) |
| §9 Licences and release | [licences.md](licences.md) |
| §10 Exam format per level | [exam-formats.md](exam-formats.md) |
| §11 Building N3 | [build-n3.md](build-n3.md) |
