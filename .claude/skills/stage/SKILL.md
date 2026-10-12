---
name: stage
description: Level stage content for jelly-jlpt. Use when authoring one level's per-unit material (vocab overrides, kanji overrides, grammar items and notes, grammar example sentences) that feeds data/<level>/vocab.js, data/<level>/kanji.js and data/<level>/grammar.js. Sets the write ceiling for the level-author stage type. Not for the unit outline (plan), dialogues, mocks or mondai.
model: sonnet
---

# Stage (level-author)

Writes the lesson material of one JLPT level, one unit's worth at a time: vocab, kanji and grammar items. Output goes through the generators: `tools/<level>-vocab-overrides.json` then `tools/author-vocab.js`, `tools/<level>-kanji-overrides.json` then `tools/author-kanji.js`, and grammar items with notes. Never hand-edit a generated file (`data/<level>/vocab.js`, `data/<level>/kanji.js`).

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, stable ids, authority order, attribution, commit rules.
2. `docs/playbook/index.md`, then only the files its task table lists for your task: [source-data.md](../../../docs/playbook/source-data.md) and [kanji.md](../../../docs/playbook/kanji.md) for vocab and kanji; [grammar-sentences.md](../../../docs/playbook/grammar-sentences.md) and [tatoeba-hints.md](../../../docs/playbook/tatoeba-hints.md) for grammar; [plan.md](../../../docs/playbook/plan.md) for the load guide (one grammar point per lesson; two only for close siblings or a short form).
3. Header of `tools/author-vocab.js` (override fields: `skip`, `alt`, `contexts`, `alsoRead`, `altSpell`, `conjSkip`).
4. Header of `tools/author-kanji.js` (`--level` draws from every lower level).
5. The level ref lists: `tools/ref/<level>.json`.
6. Current overrides and grammar notes: `tools/<level>-vocab-overrides.json`, `tools/<level>-kanji-overrides.json`, `tools/<level>-grammar-notes.md`, `data/<level>/grammar.js` (only the ids named in the brief).
7. The grammar inventory for the level and the N5 precedent `data/n5/grammar.js` shape, when the brief covers grammar.
8. The brief path given by the orchestrator. The brief names the unit range and the keys.

Do not read review reports, `STATE.md`, `known-issues.md`, or other levels' stage files except the reference named in the brief.

## Write ceiling

- Allowed to edit: `tools/<level>-vocab-overrides.json`, `tools/<level>-kanji-overrides.json`, `tools/<level>-grammar-notes.md`, `data/<level>/grammar.js` (only the item blocks named in the brief).
- Allowed to run: `node tools/author-vocab.js <jisho-cache> --level <LEVEL>`, `node tools/author-kanji.js --level <LEVEL>`, the Jisho fetch with `--fetch` (about 1 request/s, cache under `.scratch/content-audit/research/data/jisho-cache/`), and the test runner.
- Not allowed: `data/<level>/vocab.js`, `data/<level>/kanji.js` (generated), `data/<level>/plan.js`, `data/<level>/mocks.js`, `data/<level>/mondai.js`, dialogues, `sw.js`, `audio/manifest.js`, `kanji-svg/strokes.js`, `STATE.md`, `known-issues.md`, `CREDITS`, `index.html`.
- Also allowed to edit: `data/<level>/sentences.js` (only the sentences for the grammar ids named in the brief). Tatoeba picks keep id, `author`, `license`, `enId`, `enAuthor`, `enLicense`; own sentences use `sources: ['own']`. Rules: [grammar-sentences.md](../../../docs/playbook/grammar-sentences.md) (Example sentences) and [tatoeba-hints.md](../../../docs/playbook/tatoeba-hints.md). `uses` must be complete (grammar, form ids, kanji, catalog words). Run `tests/teaching-order.js`.

## Rules

1. Every key in the brief gets an entry or a `skip` with a reason. Nothing else is left silent.
2. Glosses are our own words, English only, learner-typed wording. Facts (reading, pos, godan/ichidan) come from JMdict via the cached Jisho response. Never from memory alone.
3. An item is `verified` only when JMdict has the same word and reading, the pos matches, and the gloss shares a content word with a JMdict sense. Otherwise write `verified:false` with the reason in `notes`.
4. Bound items (suffixes, prefixes, counters, ～目, ～製) need `contexts`, at least two entries.
5. An `accept` entry must never equal the primary gloss of another taught word of the same pos family (check against the lower levels).
6. Kanji: only kanji from the level's ref list or lower levels. Kanji not on the list go in kana.
7. Grammar: one point per lesson in the inventory order. Two points in one lesson only for close siblings or a short form, as N4 did (`tools/plan-n4.js`). Every item has at least two sources (Tanos plus one confirming page). Meaning and notes in our own words, 1 to 4 sentences, with the contrast a learner needs. Do not re-teach a point from a lower level; reference its id.
8. Learner-facing text (`usage`, `tip`, meanings) is plain English or Japanese hint only. No raw `g:` or `k:` ids in it.
9. Japanese facts: authority order from CLAUDE.md (jlpt.jp, Tanos, JMdict/KANJIDIC for checks, Tatoeba for sentences). Do not ask the owner Japanese questions.
10. Attribution: any third-party source used gets a credit in `CREDITS` (`components/settings-view.js`) by the orchestrator. Flag the source in your return message.
11. Ids are stable. Once a level ships, never reuse or renumber an id.

## Steps

1. Read the sources. Confirm the brief's unit range and key list.
2. Fetch missing Jisho cache entries if needed (1 request/s, same shape `{keyword, fetched, data}`).
3. Edit the overrides and grammar item blocks named in the brief.
4. Run `node tools/author-vocab.js <jisho-cache> --level <LEVEL>` and `node tools/author-kanji.js --level <LEVEL>`. Read the summary. Fix every reported build failure in the overrides, not in generated output.
5. Run the checks: `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js` inside the worktree.
6. Commit once in the worktree on branch `author-<level>-stage`. Gitmoji subject, imperative, one emoji, no scope, no brackets, no colon. No co-author line.

## Stop and report (do not guess)

- A key has no JMdict entry and no safe `q` or `jmWord` fix.
- A kanji needed by the unit is outside the ref lists.
- A grammar point has fewer than two usable sources.
- The build fails after one fix attempt.
- The brief asks for a file outside the write ceiling.
- Jisho is unreachable and the cache is missing the keys.

## Output (return message)

- Branch, commit hash.
- Counts: vocab items, skips, `alt`, `contexts`; kanji added; grammar points added.
- `verified:false` list with reasons.
- Tests: pass/fail, count.
- Tags used (vocab), new tags only.
- UNSURE list (from `notes` starting with `UNSURE:`).
- Stopped at step N with reason, or `done`.

## Does not

Merge, push, force-push, `reset --hard`, delete branches, `--no-verify`, touch other worktrees, spawn sub-agents, edit generated files, write dialogues, mocks or mondai, or change `READY` in the plan.
