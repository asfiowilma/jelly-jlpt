# 2. Lesson sentences use only what has been taught

Date: 2026-10-06. Status: accepted.

## Context

The N5 audit (P1-1) found that most sentence-based lesson questions (kanji reading, spelling, word in context, grammar gap, ★ order) used a sentence that held an item taught in a later unit: 144 of 226 such questions over 5 builds of every lesson (64%). It also found that 61 of the 204 grammar example slots did the same. Ruby covers an untaught kanji, but an untaught word or grammar point is just there, with no gloss. The worst cases were the first grammar lessons (u019 to u044), where the learner knows only a few dozen words.

Two things caused it. `formsFor` picked a random sentence from `sentencesUsing(id)` (or from the grammar point's `examples`) without checking what the unit had taught. And the catalog had no sentence for many early points that used only early words, so a filter alone would leave those points with nothing to show.

We had two options:

1. **Filter, plus our own sentences.** Pick sentences by what is taught so far, and write simple sentences for the points that have none.
2. **Reorder the plan** so the vocabulary the existing sentences need comes earlier.

## Decision

We filter and add our own sentences. The plan order stays as it is.

- A sentence's untaught count is the number of its `uses` not in `taughtIds(unit)` (`untaughtCount` in lib.js). Another spelling (`alt`) counts as taught when the spelling the plan teaches is taught.
- Quiz questions (`inSentence`, grammar gap, ★ order) only use sentences with an untaught count of 0 (`quizSentences`). A form with no such sentence is skipped and the item is asked another way. If no form at all can be built, `makeQuestion` makes one more attempt allowing leaky sentences, picks the cleanest, and tags the result `leaky`. The test `tests/teaching-order.js` fails on a `leaky` question that is not on its exception list, and that list is empty.
- A lesson shows a grammar point's examples cleanest first (`lessonExamples`, at most 3). Authored examples are never dropped from the data, only reordered. The "more sentences" block sorts the same way.
- 59 own sentences (`s:own:n5-…`) give every lesson grammar point three clean examples. They use only items taught by that lesson, and write a word in kana while its kanji is still untaught (がっこう before 校 is taught).

We rejected reordering because the plan's order follows the topics and the per-lesson load rules. Pulling words forward to suit a few Tatoeba sentences would break both, and unit ids can't move once a level ships.

## Consequences

- Fewer sentence-based questions in lessons (226 down to 137 over 5 builds, all 74 lessons), with none leaking. Reviews and prep units come later in the plan, so more sentences qualify there.
- ★ order questions drop the most, because almost all chunked sentences use later words. More early ★ sentences would bring them back; each one needs its alternative orders checked by hand.
- The check counts only `uses`. A word missing from a sentence's `uses` still slips through, which is the same limit `cardExample` has (audit P2-6).
- `tests/teaching-order.js` keeps it from creeping back: zero leaking quiz sentences, zero leaking shown examples.
