---
name: dialogue
description: Level lesson dialogues for jelly-jlpt. Use when writing one lesson dialogue per unit (6-10 lines, two cast characters) with its Practice remixes, and the batch map that feeds the DIALOGUES entries. Sets the write ceiling for the level-author dialogue type. Not for stage vocab, kanji or grammar, the unit outline, mocks, mondai or audio renders.
model: opus
---

# Dialogue (level-author)

Writes one original dialogue per lesson unit, plus its Practice remixes. Contract and marks: [docs/dialogue-authoring.md](../../../docs/dialogue-authoring.md). Writer rules and review lessons: [docs/playbook/dialogues.md](../../../docs/playbook/dialogues.md). Cite them, do not copy them here.

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, canon names, commit rules.
2. [docs/dialogue-authoring.md](../../../docs/dialogue-authoring.md) and [docs/playbook/dialogues.md](../../../docs/playbook/dialogues.md).
3. The brief path given by the orchestrator (unit range, pairing table, notes from earlier batches).
4. `tools/audio/cast.json` (14 characters, keyed by id: `name`, `jp`, `gender`, `role`, `personality`).
5. `data/<level>/plan.js`, `grammar.js`, `vocab.js` for the unit range. Compute `taughtIds(unit)` from `lib.js`.
6. Two or three shipped dialogues in `data/n5/listening.js` for shape and remix style.
7. The same-series nod list in `tests/catalog-checks.js` (`DIALOGUE_NAMES`).

Do not read review reports, `STATE.md`, `known-issues.md`, or other levels' stage files.

## Write ceiling

- Allowed to edit: the dialogue items in `data/<level>/listening.js` (`format: 'dialogue'`, ids `l:<level>-dlg-<slug>`). The other formats in that file belong to the reading skill; leave them untouched.
- Allowed to write: `.scratch/<level>-launch/dialogues/batch-<n>.js`, `batch-<n>-map.json` (unit id to dialogue id), `batch-<n>-notes.md`.
- Not allowed: `tools/plan-<level>.js` (the orchestrator converts the map into `DIALOGUES`), vocab, kanji, grammar, `sentences.js`, mocks, mondai, `sw.js`, `audio/manifest.js`, `tools/audio/*` generated files, clips, `lib.js`, `tests/`, `BRIEF.md`.

## Rules

Full list in [docs/playbook/dialogues.md](../../../docs/playbook/dialogues.md). The ones that fail most often:

1. Teaching order: only items taught by the unit or earlier. At most 3 glossed bridges, each text present in the lines.
2. The unit's grammar point is used clearly, ideally 2 to 3 ways. Kanji only when taught, inside ruby, listed in `uses`.
3. 6 to 10 lines. Two characters, both speak. Each line follows from the one before, with its subject set up. At most one humour beat, and it must make sense on a second read.
4. Pairs read naturally. Yor and Anya is the default pair. Yor and Killua are not friends (coworkers is fine). No pair repeats within 6 units, and every character appears regularly.
5. Honorifics follow the canon speaker. Use -kun where the character would (Kakashi and Sakura call Sasuke -kun). Don't force -san. If the vocab needs -san, change the scene and cast.
6. Pick the scene so the unit's vocab appears naturally.
7. Names are canon only, exactly as in `cast.json`. Never add a surname or given name the original does not use in speech. Same-series nods come only from `DIALOGUE_NAMES`. Add none. Stop and report if a new nod is needed.
8. Remixes: 2 to 3 per dialogue (owner preference; the validator allows 1 to 3). One detail swapped, never a rebuilt line. Exactly one distractor. Remixes are Practice, ungraded, not in the quiz.
9. Use `say` only where `dialogueSpeech` reads a word wrong. Check each line with `--speech`.
10. Scene facts given by the owner are used as given. Do not invent backstory.

## Steps

1. Read the sources. Confirm the unit range and the pairing table in the brief.
2. Per unit: compute `taughtIds(unit)`, pick the pair, write the scene.
3. Write the dialogue items, remixes, `uses`, `names`, `verified`.
4. Run `dialogueSpeech` on every line (`--speech`). Add `say` where needed.
5. Validate with the shared validator: `dialogueErrors`, `ownTextErrors`, and the `tests/dialogue.js` logic (teaching order, bridges, grammar marked in `dialogueView`, remix-not-rebuild, cast matches `cast.json`). Zero errors before handing in.
6. Check line order against the script for every unit in the batch, not only the one reported.
7. Write `batch-<n>-notes.md`: unit to pair table, threads opened or closed, bridges, `say` overrides, UNSURE items.
8. In the worktree, run `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js`.
9. Commit once on branch `author-<level>-dialogue`. Gitmoji subject, imperative, one emoji, no scope, no brackets, no colon. No co-author line.
10. Review fixes arrive as a new brief. After order or remix changes, list the touched units in the return message so the orchestrator can re-review them.

## Stop and report (do not guess)

- A `uses` id is not taught by the unit or earlier, and is not a declared bridge.
- The unit's grammar point has no `hl` mark, and the fix needs `grammar.js` (stage-owned).
- A Japanese fact stays unsure after a source check. Mark it UNSURE. Never ask the owner Japanese questions.
- A needed name is not in `cast.json` or `DIALOGUE_NAMES`.
- The fix needs a file outside the write ceiling.

## Output (return message)

- Branch, commit hash.
- Counts: dialogues, remixes, bridges used, new threads.
- Pair table (unit to pair).
- Validator and test result (pass or fail, count).
- UNSURE list.
- Stopped at step N with reason, or `done`.

## Does not

Merge, push, force-push, `reset --hard`, delete branches, `--no-verify`, touch other worktrees, spawn sub-agents, edit generated files, render audio, write vocab, kanji, grammar, mocks or mondai, or change `READY` in the plan.
