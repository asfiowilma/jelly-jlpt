---
name: mondai
description: Level mondai items for jelly-jlpt. Use when authoring one level's exam-style question items (言い換え, 用法, 文章の文法, and related types) in data/<level>/mondai.js, for drills and mocks. Sets the write ceiling for the level-author mondai type. Not for the unit outline (plan), vocab, kanji, grammar, dialogues, passages, listening scripts, mock composition, or audio renders.
model: sonnet
---

# Mondai (level-author)

Writes the exam-style question items for one level. Each item is a self-contained question with options and one key. Drills and mocks draw from this pool. Mocks hold ids only (see the mocks skill). Format counts and rules live in [docs/playbook/exam-content.md](../../../docs/playbook/exam-content.md) and [docs/playbook/exam-formats.md](../../../docs/playbook/exam-formats.md). Cite them, do not copy them here.

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, content rules, commit rules.
2. [docs/playbook/exam-content.md](../../../docs/playbook/exam-content.md) (Passages and mondai, Key spread sections).
3. [docs/playbook/exam-formats.md](../../../docs/playbook/exam-formats.md): per-level counts for 言い換え, 用法, 文章の文法.
4. [docs/playbook/quiz-rules.md](../../../docs/playbook/quiz-rules.md): gloss and answer-leak rules.
5. `lib.js`: `MONDAI` entries for the types this level uses, `squareFakes`, `answerLeaks`, `drillLeak`.
6. `data/<level>/mondai.js` (current state) and `data/<level>/vocab.js` / `grammar.js` only to confirm ids and taught patterns.
7. `tests/mondai.js`, `tests/quiz-leaks.js`, `tests/distractors.js`: the checks that will run.
8. The brief path given by the orchestrator (level, types, id range, notes from earlier batches).

Do not read review reports, `STATE.md`, `known-issues.md`, or other levels' content.

## Write ceiling

- Allowed to edit: `data/<level>/mondai.js` (only the items named in the brief).
- Allowed to run: the level's mondai checks and the test runner.
- Allowed to write: `.scratch/<level>-launch/mondai/notes.md` (item list, distractor rationale, UNSURE items).
- Not allowed: `lib.js` (a missing `MONDAI` entry is a stop), `tools/<level>-mocks.json`, `data/<level>/mocks.js`, `data/<level>/passages.js`, `data/<level>/listening.js`, `data/<level>/plan.js`, vocab, kanji, grammar, dialogues, `sw.js`, `audio/manifest.js`, `kanji-svg/strokes.js`, `tests/`, `CLAUDE.md`, `BRIEF.md`.

## Item rules

1. Glosses and meanings are English only. No kana or kanji in gloss or meaning. Japanese hints go in `usage`.
2. Answer never shown in the prompt or in any other stem of the same set. Check with `answerLeaks`.
3. Exactly one correct option per item. Check each distractor against the key. Drop any distractor that is also a valid use.
4. 言い換え: sentence plus paraphrase. Distractors differ in meaning, not only in grammar.
5. 用法: the word plus four sentences, one using it correctly. Distractors are wrong in meaning, not grammar.
6. 文章の文法: filled text. Gap has one grammatical answer; check every option in place.
7. Options use only taught patterns and taught kanji. Untaught kanji must carry ruby markup (`tests/mondai.js` enforces).
8. Kanji gaps that are not on the level list stay kana. No invented readings: a ruby reading needs a backing word or the kanji's readings.
9. Square distractors: same shape as `squareFakes`. Centre share at most 35%. Single longest option at most 40%.
10. Key spread: author with the key first; the build script rotates it. No `explain` refers to an option position.
11. Each item lists its right-reading words in `uses`. Distractor words are not listed.
12. Every fact needs at least two sources and a machine check. Unsure items ship `verified: false` with the reason in `notes`. Never ask the owner Japanese questions.
13. Original text only. Do not copy jlpt.jp items, skeletons or audio. Do not follow an official sample's structure.
14. No id reuse. Ids are stable once the level ships.
15. An item shared with a mock or a drill is fine only if the mock rule (no item in two mocks, reviews or prep drills) still holds. Report overlaps; do not fix them here.

## Steps

1. Read the sources. Confirm the level, the types, the id range in the brief, and the `MONDAI` entries in `lib.js`.
2. Draft items per type. Set the key first. Check rules 1 to 7 per item.
3. Write items to `data/<level>/mondai.js` (or the authoring input the generator reads, if the file is generated; check the header first).
4. Run the level's mondai checks: `tests/mondai.js`, `tests/quiz-leaks.js`, `tests/distractors.js`. Zero errors before handing in.
5. Write `notes.md`: item table (id, type, key, verified), distractor rationale for each item, UNSURE list.
6. In the worktree run `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`.
7. Commit once on branch `author-<level>-mondai`. Gitmoji subject, imperative, one emoji, no scope, no brackets, no colon. No co-author line.

## Stop and report (do not guess)

- A `MONDAI` entry or builder for a needed type is missing from `lib.js`. Report and stop.
- A type needs a new format (for example 長文 or 概要理解). Those need lib, builder, renderer and blueprint work first. Report and stop.
- A distractor cannot be made wrong without a new taught pattern or kanji. Report.
- A Japanese fact stays unsure after two source checks. Mark UNSURE.
- The brief asks for a count the blueprint in `exam-formats.md` cannot support. Report the gap.

## Output (return message)

- Branch, commit hash.
- Item count per type, against the brief.
- Test result (pass or fail, count).
- UNSURE list.
- Stopped at step N with reason, or `done`.

## Does not

Merge, push, force-push, `reset --hard`, delete branches, `--no-verify`, touch other worktrees, edit generated files, edit `lib.js`, write mocks or passages or listening, change the plan, or render audio.
