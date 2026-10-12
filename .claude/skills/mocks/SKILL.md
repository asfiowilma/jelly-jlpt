---
name: mocks
description: Level mock exams and diagnostic for jelly-jlpt. Use when composing one level's fixed mock tests (x:<level>-mock-1, -2, and the diagnostic -3) as JSON ids in tools/<level>-mocks.json, then running tools/author-mocks.js to write data/<level>/mocks.js. Items come from the mondai, passage and listening pools. Sets the write ceiling for the level-author mocks type. Not for the unit outline (plan), vocab, kanji, grammar, dialogues, mondai items, passages, listening scripts (reading skill), or audio renders.
model: haiku
---

# Mocks (level-author)

Composes the fixed mock tests for one level: two full mocks and one diagnostic. Mocks hold ids only. Question text lives in the mondai, passage and listening pools. Counts come from `MOCK_BLUEPRINT` in `lib.js`. Rules live in [docs/playbook/exam-content.md](../../../docs/playbook/exam-content.md) and [docs/playbook/exam-formats.md](../../../docs/playbook/exam-formats.md). Cite them, do not copy them here.

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, generated-file rule, commit rules.
2. [docs/playbook/exam-content.md](../../../docs/playbook/exam-content.md) (Mocks section) and [docs/playbook/exam-formats.md](../../../docs/playbook/exam-formats.md).
3. `lib.js`: `MOCK_BLUEPRINT[level].full` and `.diagnostic`, `MOCK_SECTIONS`, `MOCK_PACE`, `MOCK_LABELS`, `mockItemIds()`.
4. `data/<level>/mondai.js`, `passages.js`, `listening.js`: the pool of ids the mock may use.
5. `tools/<level>-mocks.json` (current state, if it exists) and the header of `tools/author-mocks.js` (input shape).
6. `tests/mocks.js`, `tests/listening.js`, `tests/catalog-checks.js` (`PASSAGE_FORMATS`): the checks that will run.
7. The brief path given by the orchestrator (level, ids, notes from earlier batches).

Do not read review reports, `STATE.md`, `known-issues.md`, or other levels' stage files.

## Write ceiling

- Allowed to edit: `tools/<level>-mocks.json`.
- Allowed to run: `node tools/author-mocks.js --level <LEVEL>` (writes `data/<level>/mocks.js`), and the test runner.
- Allowed to write: `.scratch/<level>-launch/mocks/notes.md` (composition table, key counts, UNSURE items).
- Not allowed: `data/<level>/mocks.js` by hand (generated), `lib.js` (blueprint rows are added in the lib phase; a missing row is a stop), `tools/plan-<level>.js` and `data/<level>/plan.js` (outline skill owns mock unit rows), `data/<level>/mondai.js`, passages, listening, vocab, kanji, grammar, dialogues, `sw.js`, `audio/manifest.js`, `kanji-svg/strokes.js`, `tests/`, `CLAUDE.md`, `BRIEF.md`.
- Legacy: `data/n5/mocks.js` and `data/n4/mocks.js` are hand-written. Do not regenerate them unless the brief says so.

## Input shape (`tools/<level>-mocks.json`)

- Ids only. No item text is copied into the JSON.
- Per mock: `id` (`x:<level>-mock-<n>`), `format` (`full` or `diagnostic`), `title`, and `sections` for `vocab`, `grammar`, `listening`.
- Per question: `id` (mondai `m:`, passage `p:` or listening `l:`), `a` (answer index into the item's options as authored), and:
  - `o`: the options in the order the mock shows them, a permutation of the authored options. Not used for listening.
  - `blank`: 1-based blank number, for `bunshou` only. `q`: question index, for passage items.
- The generator resolves every id. The exact shape is in the header of `tools/author-mocks.js`. If the header and this section disagree, stop and report.

## Counts (must match `MOCK_BLUEPRINT`; the generator fails otherwise)

- N5 full: vocab 7 / 5 / 6 / 3 (kanjiYomi / hyouki / bunmyaku / iikae); grammar 9 gap / 4 order / 4 bunshou; reading 2 short / 2 mid / 1 info; listening 7 / 6 / 5 / 6. Total 67.
- N4 full: vocab 7 / 5 / 8 / 4 / 4 (adds youhou); grammar 13 gap / 4 order / 4 bunshou; reading 3 short / 3 mid / 2 info; listening 8 / 7 / 5 / 8. Total 85.
- Diagnostic: the `diagnostic` row of the same blueprint, every mondai kept. N4 is 45.
- Each full mock carries one katakana 表記 item.

## Rules

1. No pool item is used by two mocks, by a lesson review, or by a prep drill. `mockItemIds()` in `lib.js` must list them all.
2. No answer string appears inside another question of the same mock (stems and passages). `tests/mocks.js` checks this.
3. A mock gap has exactly one grammatical answer and no English note. Check each gap with each option before choosing it.
4. Every narrator and option line in a mock uses only taught patterns. Patterns must be listed in `uses` of the pool item.
5. Key spread: per format, no slot above the share in the playbook table. Single longest option at most 40%. Centre share for kanji-reading at most 35%. `tests/listening.js` and `tests/mocks.js` enforce this.
6. No English note explains an option by its position.
7. Items keep the `verified` status of their pool source. A mock adds no new facts. If a mock needs a fact no pool item carries, stop.
8. Original text only. Do not copy jlpt.jp mock items, skeletons or audio.
9. Mock unit rows in the plan are not added here. If a level's plan has no row for a mock, report it to the outline skill.

## Steps

1. Read the sources. Confirm the level, the blueprint rows, and the ids in the brief.
2. Choose pool items section by section. Check each against rules 1 to 4.
3. Set `a` per question. Check key spread per format.
4. Write `tools/<level>-mocks.json`.
5. Run `node tools/author-mocks.js --level <LEVEL>`. Fix every reported failure in the JSON, not in the generated file.
6. Run the level's checks: `tests/mocks.js`, `tests/listening.js`, `tests/catalog-checks.js`. Zero errors before handing in.
7. Write `notes.md`: composition table (question to pool id), key counts per format, UNSURE items.
8. In the worktree run `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`.
9. Commit once on branch `author-<level>-mocks`. Gitmoji subject, imperative, one emoji, no scope, no brackets, no colon. No co-author line.

## Stop and report (do not guess)

- `tools/author-mocks.js` rejects the input for a reason the JSON cannot fix (generator bug). Report and stop.
- The mondai, passage or listening pool cannot fill a slot. The fix needs a new pool item, which belongs to the mondai skill or another type.
- A blueprint row is missing from `lib.js`.
- A slot has no single grammatical answer.
- A narrator or option uses an untaught pattern and the fix needs `grammar.js` or the plan.
- A Japanese fact stays unsure after a source check. Mark UNSURE. Never ask the owner Japanese questions.

## Output (return message)

- Branch, commit hash.
- Counts per mock and per section, against `MOCK_BLUEPRINT`.
- Key counts per format.
- Test result (pass or fail, count).
- UNSURE list.
- Stopped at step N with reason, or `done`.

## Does not

Merge, push, force-push, `reset --hard`, delete branches, `--no-verify`, touch other worktrees, edit generated files, edit `lib.js`, author pool items, change `READY` in the plan, or render audio.
