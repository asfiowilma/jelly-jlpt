---
name: reading
description: Level reading passages and listening scripts for jelly-jlpt. Use when authoring one level's original texts (内容理解 short and mid, 情報検索, and the 課題理解, ポイント理解, 発話表現, 即時応答 listening items) in data/<level>/passages.js and the non-dialogue items of data/<level>/listening.js. Written to read like real notes, messages and conversations, not textbook drills. Sets the write ceiling for the level-author reading type. Not for lesson dialogues, mondai, mock composition, the outline, stage vocab, kanji or grammar, sentences, or audio renders.
model: opus
---

# Reading (level-author)

Writes the original texts of one level: reading passages (`p:`) and non-dialogue listening items (`l:`). Pools feed review units, prep drills and mocks. Format counts: [docs/playbook/exam-formats.md](../../../docs/playbook/exam-formats.md). Content rules: [docs/playbook/exam-content.md](../../../docs/playbook/exam-content.md) and [docs/playbook/listening-audio.md](../../../docs/playbook/listening-audio.md). Cite them, do not copy them here.

## Sources to read (only these)

1. `CLAUDE.md`: hard constraints, content rules, commit rules.
2. `docs/playbook/index.md`, then [exam-content.md](../../../docs/playbook/exam-content.md) (Passages and mondai, Key spread), [exam-formats.md](../../../docs/playbook/exam-formats.md) and [listening-audio.md](../../../docs/playbook/listening-audio.md) (Listening items).
3. `data/<level>/passages.js` and `listening.js` as they stand. The header comments hold the text rules; the N4 files are the shape reference. Do not copy their skeletons.
4. `data/<level>/vocab.js`, `kanji.js`, `grammar.js` and `plan.js`, only to confirm ids and what each unit has taught.
5. `PASSAGE_FORMATS` in `tests/catalog-checks.js`, `tests/listening.js`, `tests/teaching-order.js`: the checks that will run.
6. `tools/audio/man-assignments.json` and `woman-assignments.json` (shape of an entry).
7. The brief path given by the orchestrator (level, format counts per set, set split, genre map, notes from earlier batches).

Do not read review reports, `STATE.md`, `known-issues.md`, official PDFs, or other levels' content except the reference named in the brief.

## Write ceiling

- Allowed to edit: `data/<level>/passages.js` (items named in the brief) and the non-dialogue items of `data/<level>/listening.js` (formats `task`, `point`, `utterance`, `quick`).
- Allowed to edit: `tools/audio/man-assignments.json` and `woman-assignments.json` (one entry per new non-dialogue item).
- Allowed to write: `.scratch/<level>-launch/reading/notes.md` (item table, genre map, set split, UNSURE items).
- Not allowed: dialogue items (`format: 'dialogue'`, the dialogue skill's), `data/<level>/mondai.js`, `mocks.js`, `sentences.js`, `plan.js`, vocab, kanji, grammar, `lib.js`, `tests/`, `audio/manifest.js`, `tools/audio/cast.json`, clips, `sw.js` by hand, `CLAUDE.md`, `BRIEF.md`.
- `listening.js` is shared with the dialogue skill. Touch only your ids, so the two branches rebase cleanly.

## Voice (what makes these not read like a textbook)

1. Every text has a scene and a reason to exist: a note on a fridge, a club notice, a message that changes plans, a clinic hours sheet. Never a bare grammar demonstration.
2. One human detail per text: a small problem, a preference, a correction, a change of mind. The question asks about it.
3. Vary the genre across the set (note, email, notice, diary, flyer, timetable, message thread). The brief holds the genre map. No genre above a third of a format.
4. Vary the speaker setup and register in listening: friends, coworkers, family, shop or station staff. Keigo only in service scenes.
5. No line only restates the grammar point. Teach by using, not announcing. A taught pattern appears where a speaker would really say it.
6. People use short answers, fillers, trailing off and corrections in speech, within taught forms. No full-sentence interview answers.
7. Concrete details over abstract ones: times, prices, places, brand-free shop names, weather. Invented names are fine for people and shops, never real businesses.
8. The exam format is plain on purpose. Aim for natural and specific, not clever. Do not follow an official sample's skeleton.
9. Re-read each finished text as a learner would. A line you would skip is a line to rewrite.

## Hard rules (the checks enforce these)

1. Teaching order: only items taught by the unit the item belongs to, or earlier. Review items go after the unit that teaches their words. List every grammar id, content word (`v:` catalog key) and kanji (`k:`) in `uses`. Proper nouns go in `names`.
2. Kanji only from the level and lower, every one inside `[漢字|かな]` ruby. A word with any kanji above the level stays kana. Each ruby reading needs a backing word, a name or the kanji's readings.
3. Lengths and shapes per format: per `exam-formats.md` and the check windows in `PASSAGE_FORMATS`. Listening follows the level's header: one narrator scene line then 4 to 7 speaker lines for `task` and `point`, all-narrator lines for `utterance`, one M or F line for `quick`.
4. One correct option per question. Wrong options are wrong in meaning, not in grammar. Options are of similar length. Single longest option is the key in at most 40% of a format. No answer string inside another stem of the same set.
5. Key spread: passages author the key first, the build rotates it. Listening options are not shuffled at runtime, so the authored order sets the key. Per format and per set, no slot above 45%. No `explain` refers to an option position.
6. Sets: mock-1, mock-2, diagnostic and review (with spares for prep drills) per the brief. No item in two sets. A set swap is cheaper now than after the plan exists.
7. Every new non-dialogue listening item has an archetype entry (`man`, `woman`, one-line reason read from the transcript) in both assignment files. `export-tracks.js` fails without it.
8. `furigana` is the source; `jp` is derived. Write the kana reading so TTS speaks it right: は as particle stays は, `[は|わ]` ruby only where the clip needs it.
9. Original text only. Never copy jlpt.jp, JLPT Sensei or NHK text, skeletons or audio. `sources: ['own']`, `verified` only when every `uses` item is verified and the checks pass; otherwise `verified: false` with the reason in `notes`.
10. Ids are stable. No reuse or renumber.
11. A new item with no manifest track is skipped (the suite fails until its clip is rendered). A changed transcript of a shipped item goes in the rerender notes (id, line, why).

## Steps

1. Read the sources. Confirm the level, the format counts per set, the genre map and the ids in the brief.
2. Plan the set: genre and detail per item, before any text. Check the genre spread.
3. Write each item. Run the Voice checklist and the hard rules per item.
4. Add assignment entries for each new listening item.
5. Run `tests/catalog-checks.js`, `tests/listening.js`, `tests/teaching-order.js`, `tests/quiz-leaks.js`. Zero errors before handing in.
6. Write `notes.md`: item table (id, format, set, genre, detail, verified), key counts per format and set, UNSURE items.
7. In the worktree run `CLAUDE_PROJECT_DIR=$(pwd) node .claude/hooks/run-tests.js` (the level-author agent file sets the exact command).
8. Commit once on branch `author-<level>-reading`. Gitmoji subject, imperative, one emoji, no scope, no brackets, no colon. No co-author line.

## Stop and report (do not guess)

- A needed word, kanji or grammar point is not taught by the unit, and the fix needs stage or outline work.
- A format needs a new type (長文, 概要理解). Those need lib, builder, renderer and blueprint work first.
- A slot cannot be filled with one right answer and wrong-in-meaning distractors.
- A Japanese fact stays unsure after a source check. Mark UNSURE. Never ask the owner Japanese questions.
- The fix needs a file outside the write ceiling.

## Output (return message)

- Branch, commit hash.
- Counts per format and set, against the brief.
- Genre map and key counts per format.
- Test result (pass or fail, count).
- UNSURE list. `verified: false` items with reasons. New third-party sources, if any.
- Stopped at step N with reason, or `done`.

## Does not

Merge, push, force-push, `reset --hard`, delete branches, `--no-verify`, touch other worktrees, spawn sub-agents, edit generated files, write dialogues, mondai, mocks or sentences, change the plan, or render audio.
