# Exam content: passages, mondai, mocks, guide

Load when: writing passages, mondai, mock items, prep drills, or the guide copy. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §7 and §7b. Listening and audio are in [listening-audio.md](listening-audio.md). Format counts are in [exam-formats.md](exam-formats.md).

## Passages and mondai

- Own passages and listening are `verified: true` only if every `uses` item is verified and the checks pass: every kanji at or below the level and inside ruby; every ruby reading backed by a used word, a name or the kanji's readings; every katakana word in `uses` or `names`.
- A kana-only word missing from `uses` cannot be detected (no tokenizer). Maintain `uses` by hand.
- `uses` on mondai = the right reading only (iikae: sentence + paraphrase; youhou: word + right sentence; bunshou: filled text). Listing distractor sentences' words added 142 ids nobody needed.
- Never copy jlpt.jp items or audio. Link to the official samples. Do not follow an official sample's skeleton either: a self-introduction 文章 tracking もんだい3's structure was a structural copy risk and got rewritten.
- New mondai type 用法 (`MONDAI.youhou`, N4 and up): the word plus four sentences, one using it right. Authored like 言い換え. Distractors are wrong in meaning, not grammar (the real test works that way). Drop any distractor that turns out to be a valid use. N4 replaced おさらをつつむ, 手がかわく, かぜがさわぐ, ふくざつなかばん and a ふくざつ cake (複雑な味 is a real collocation), and the item なれる (also the potential of なる).
- N4 texts are unspaced (the N4 test prints them so); N5 stays spaced. Nothing in the engine depends on the phrase spaces outside dialogues.
- N4 lengths (no whitespace): short 100–200 (authored 103–147); mid about 450 with 3 questions (407–454); info about 400 with 2 questions (300–323 without spaces, close to 400 with them); bunshou 150–260. Check windows: short 80–260, mid 340–580, info 280–520.
- Kanji gaps force kana. 分, 回, 点, 部, 番, 所, 客, 乗, 昨, 好, 階, 降, 次 and others are not on the Tanos N5/N4 lists, so じぶん, はんぶん, へや, ばあい, 30ぷん stay kana, and "1週間に4度" stands in for 4回. `[四|よ]` and `[十|じゅっ]` have no backing reading: write よ[人|にん], じゅっぷん.
- Authored distractors follow the same square shape as `squareFakes`. Test: centre share at most 35%. (A 漢字読み key was the centre option in 10 of 18 mock items before this rule.)

## Mocks

- Mocks are fixed, follow the official mondai counts ([exam-formats.md](exam-formats.md)), share no items with each other or with reviews. Results show an estimated score, labelled as an estimate. The linear estimate is optimistic against real scaled scores; the result copy says so.
- No answer string inside another question of the same mock (電話 answered in one item, printed in another stem). `tests/mocks.js` checks stems and passages.
- Mock gaps have exactly one grammatical answer with no English note (N5 mock-1 had けど and から both fit). Each full mock carries one katakana 表記 item.
- A narrator line in a mock uses only taught patterns: list every pattern in `uses`. A mock is graded, so a form the course never teaches is a defect, not a nit.
- Everything exam-shaped is keyed by level: `MOCK_PACE`, `MOCK_BLUEPRINT`, `JLPT_PASS` (read through `levelTable()`, which falls back to the nearest easier level), `PASSAGE_FORMATS` in `tests/catalog-checks.js`, the estimate weights (from the blueprint, not N5's 21 / 17 / 5), `quizSeconds` (takes the unit or mock level), and the diagnostic (`x:<lvl>-mock-3`). A new level adds its rows.

## Key spread

- Author every item with the key first, then let the build script rotate it (cycle 0,2,1,3,2,0,3,1 for 4 options; 0,2,1,1,0,2 for 3), keeping the distractor order. No `explain` may refer to an option position.
- N4 result (per slot share, top slot, key = single longest option):

| Format | n | per slot | top | key = single longest |
|---|---|---|---|---|
| short | 24 | 6/6/6/6 | 25% | — |
| mid (questions) | 18 | 5/4/5/4 | 28% | — |
| info (questions) | 16 | 4/4/4/4 | 25% | — |
| 言い換え / 用法 | 14 / 14 | 4/3/4/3 | 29% | — |
| task | 26 | 7/6/7/6 | 27% | 4% |
| point | 24 | 6/6/6/6 | 25% | 4% |
| utterance | 16 | 5/6/5 | 38% | 6% |
| quick | 24 | 8/8/8 | 33% | 25% (nine rebalanced) |

## Exam guide voice

The guide on prep and mock units (`unit.guide`, `GUIDES` in `tools/plan-<lvl>.js`) speaks like a senpai coaching a kouhai the week before the exam: warm, direct, a little dry.

- At most one light joke per question type, in the `trap` or `tip` line, never in `ask`, which stays literal. The joke is about the learner's situation, never at the learner or at Japanese. The tip must still work without it. Leave about a third of the lines plain.
- No emoji, no em dashes (use period, comma or colon), no dated slang.
- Facts, numbers and Japanese examples never change for a joke.
- Sentences of about 8 to 18 words, sentence case, plain English a 7th grader follows.
- One `**highlight**` per trap and one in `time`.
- Every kanji in a guide string sits in a `[漢字|かんじ]` block. Check each reading against the catalog or a dictionary. Titles stay plain text with no Japanese.
- Every number in a guide belongs to its level. N4 values:
  - Vocabulary: about 28 questions in 25 minutes, 5 types. The fifth is 用法 (check part of speech and particle before the word).
  - Grammar: about 21 questions, 13 gap-fill. Keep about 20 of the 55 minutes for it.
  - Reading: about 8 questions in the rest of the 55: 3 short texts (100–200 characters), one mid text of about 450 with 3 questions, an information search with 2. Kanji from the N4 list show no furigana.
  - Listening: about 28 questions in 35 minutes. 即時応答 is 8 items.
  - Mock: "A full N4 test: 85 questions in three timed parts", 25 / 55 / 35 minutes, "Set aside about two hours". Pass line 90 total, minimums 38 / 19.
- Do not state a distractor pattern as absolute ("wrong choices differ by one sound"). Official samples also use other-word and semantic distractors.
