# Plan

Load when: writing `tools/plan-<lvl>.js` or running `author-plan.js`. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §5. Mark N4-added rules with `[N4+]`.

## Rules

- A from-zero course needs kana units first. Each kana unit also teaches 2–5 real words spelled in its own script, plus read-only practice words. Every word may use only kana already taught (a test enforces this).
- Keep the こそあど series, particles, bound items and words a grammar point rests on in their lessons.
- Kana quizzes read mostly words (any verified word of the level spelled with kana learned so far, read only, never asked for its meaning). Single kana only for a new kana no word holds. Pass: ≥85% on reading and ≥80% on the taught words' meanings.
- Check per kana stage how many new kana no level word holds. Reading-only words from higher Tanos lists fill the gap (reading checked against JMdict, `tools/build-read-words.js`). Level words always come first.
- A kana stage's words must each hold one of that stage's new kana or marks. A review is exempt. Run the per-stage word/single count after any change to the kana plan or word lists.
- Load guide per lesson (N5: about 8 vocab, about 2 kanji, 1 grammar; ±25%). Vocab-only lessons are fine when grammar runs out.
- A kanji appears only at or after the first lesson teaching a word that uses it. A word with a kanji not yet taught shows its kana only (`displayWord`), in lessons, review cards and quiz prompts, and gets no kanji→reading question. It keeps meaning and type-the-Japanese questions.
- Write own `s:own:` sentences for the early grammar units from the start. Use kana while a kanji is untaught (がっこう before 校). Do not reorder the plan to fit Tatoeba (ADR 0002).
- Reviews come every ≤6 lessons. A review introduces nothing new.
- Review passages and listening use only what has been taught by that review.
- The plan is generated from the outline in `tools/plan-<lvl>.js`. Edit the outline, never `plan.js`. Once a level ships, never renumber its unit ids.

## `[N4+]` Outline and placement

- The outline is `tools/plan-<lvl>.js`, exporting `level, READY, LESSONS, LESSON_NOTES, DIALOGUES, GUIDES, PREP` (N5 adds `HIRAGANA, KATAKANA`). `node tools/author-plan.js N4` writes `data/n4/plan.js`. A level with no kana lists gets no kana units.
- A lesson row is `[title, grammar id(s), vocab tokens, fixed kanji?]`. The grammar cell may hold two space-separated ids, only for close siblings or a short form (`g:yasui g:nikui`). Vocab tokens are `word`, or `word|reading` when the word is not unique.
- Kanji placement above N5: a kanji written in a lower level's word may come early (明 in N5 明日), in the order the grammar examples need it (3-lesson look-ahead), so every point has 3 clean examples.
- `READY: false` writes `ready: false` on the plan, and `liveUnit()` in `lib.js` keeps the level out of the app. Flip to `true` and rerun `author-plan.js` as the last commit of the level.
- Unit ids are append-only from the first plan commit. Lessons and reviews come first (n4.u001-u102); prep units, mocks and dialogues are appended later.
- Tests that pinned N5 must loop over every planned level (teaching order, quiz leaks, bound items, untaught kanji, the load guide). Add the new level's `LOAD_GUIDE` entry in `tests/catalog-checks.js`, or the load check silently skips it.
- N4 load: 87 lessons + 15 reviews = 102 units for 686 vocab, 166 kanji, 96 grammar points (about 7.9 / 1.9 / 1.1 per lesson).
