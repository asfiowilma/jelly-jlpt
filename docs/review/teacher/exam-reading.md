# Teacher slice: exam-reading (B8, B10.1-B10.2)

Reads: `mocks.js`, `mondai.js`, `passages.js`, `plan.js` (prep units), jlpt.jp pages.
Load with [common.md](../common.md), [teaching-order.md](teaching-order.md), [known-open.md](../known-open.md), `levels/<level>.md`.

## B8. Exam-format fidelity (drills, prep units, mocks)

| # | Check | Pass | Fail |
|---|---|---|---|
| B8.1 | `MOCK_BLUEPRINT` + each full mock match jlpt.jp counts per mondai, section order, timing (`MOCK_PACE`); diagnostic keeps every mondai | exact | any count/clock off |
| B8.2 | `JLPT_PASS` for level matches jlpt.jp (values in `levels/<level>.md`) | exact | wrong |
| B8.3 | Every fixed mock question, passage question, mondai blank, listening item: exactly one supported answer, stored key right; solve each yourself from rendered question (`mockSections`), not key | 0 wrong keys | wrong or double |
| B8.4 | Mocks share no passage, listening item, mondai, sentence with each other or review units | none | overlap |
| B8.5 | Each full mock has one katakana 表記 item; 表記 distractors real kanji look-alikes; 漢字読み distractors differ by one sound (dakuten, long vowel, small っ), never a valid reading | yes | missing; valid reading as distractor |
| B8.6 | 文脈規定: same-pos distractors do not also fit; mock items no English note | one fit | two words fit |
| B8.7 | 言い換え: pairs genuinely equivalent; wrong options change who/when/opposite | yes | wrong option also a paraphrase |
| B8.8 | 情報検索 tables/stems consistent; arithmetic recomputed (prices, times) | yes | table yielding second answer |
| B8.9 | Passages: every kanji in level catalog or inside ruby; length plausible (length in `levels/<level>.md`) | yes | above-level kanji bare |
| B8.10 | Prep guide text (`unit.guide` in `plan.js`): counts, times, question names, claims true; every guide kanji in `[漢字|かんじ]` with right reading; no emoji/em dashes | yes | false claim ("you hear everything once" is secondary-sourced: label so); bare kanji |
| B8.11 | Mock listening plays, rate, navigation: stated honestly where easier than real test (replay, free navigation); fallback voice announced | disclosed | silent easing |
| B8.12 | Score estimate labelled estimate that runs high; no claim of real scaled score | yes | "you passed" without caveat |

## B10.1-B10.2. Originality and source rules

| # | Check | Pass | Fail |
|---|---|---|---|
| B10.1 | No text, item, passage, dialogue, table, audio copied from jlpt.jp sample workbooks, JLPT Sensei, NHK Web Easy; no item tracking official sample skeleton (same structure + tested points, words swapped) | none | verbatim/structural copy |
| B10.2 | No bulk EDRDG data: no JMdict/KANJIDIC field dumps (ke_pri, misc tags, grade, freq, skip codes); glosses own wording | none | dumped field |
