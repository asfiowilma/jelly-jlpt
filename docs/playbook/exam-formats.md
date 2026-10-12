# Exam formats per level

Load when: writing mock blueprints, mondai, `MOCK_PACE`, or scoring. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §10.

From jlpt.jp (`testsections.html`, `results.html`, the 2020 N4/N5 count images, the per-level guideline PDFs). N5 and N4 were re-checked on 2026-10-08. **N3 figures are the 2009 Guidebook counts** (no later official revision found) and must be re-fetched before building N3. Counts are approximate by JLPT's own wording.

| | N5 | N4 | N3 (re-check) |
|---|---|---|---|
| Sections, minutes | vocab 20 / grammar・reading 40 / listening 30 = 90 | 25 / 55 / 35 = 115 | 30 / 70 / 40 = 140 |
| Scoring sections | LK・Reading 0–120, Listening 0–60 | same | LK 0–60, Reading 0–60, Listening 0–60 |
| Pass mark / section minimums | 80 / 38, 19 | 90 / 38, 19 | 95 / 19 each |
| 漢字読み | 7 | 7 | 8 |
| 表記 | 5 | 5 | 6 |
| 文脈規定 | 6 | 8 | 11 |
| 言い換え類義 | 3 | 4 | 5 |
| 用法 | — | 4 | 5 |
| **Vocab total** | **21** | **28** | **35** |
| 文の文法１ (gap) | 9 | 13 | 13 |
| 文の文法２ (★) | 4 | 4 | 5 |
| 文章の文法 | 4 | 4 | 5 |
| **Grammar total** | **17** | **21** | **23** |
| 短文 | 2 (≈80 chars) | 3 (100–200) | 4 |
| 中文 | 2 (1 text ≈250) | 3 (1 text ≈450) | 6 |
| 長文 | — | — | 4 |
| 情報検索 | 1 (≈250) | 2 (≈400) | 2 |
| **Reading total** | **5** | **8** | **16** |
| 課題理解 | 7 | 8 | 6 |
| ポイント理解 | 6 | 7 | 6 |
| 概要理解 | — | — | 3 |
| 発話表現 | 5 | 5 | 4 |
| 即時応答 | 6 | 8 | 9 |
| **Listening total** | **24** | **28** | **28** |
| **Items** | **67** | **85** | **102** |
| `MOCK_PACE` vocab / grammar / reading / listening (s) | 57 / 60 / 276 / 75 | 54 / 60 / 255 / 75 | derive: section seconds ÷ items |
| Furigana in booklet | on kanji above N5 | on kanji above N4 | check a sample booklet |
| Passages | spaced | unspaced | check a sample booklet |

## What changes structurally at N3

Plan the code before the content.

- Three scoring sections: language knowledge (vocab booklet plus the grammar part of the second booklet), reading and listening, each 0–60 with a minimum of 19. `JLPT_PASS`, `mockEstimate`, `mockOutlook` and the result slip assume one LK・Reading section today.
- New mondai: 長文 (long passage) and 概要理解 (summary listening). Each needs a `MONDAI` / format entry, a builder, a renderer, a blueprint row, check windows and a guide section.
- `MOCK_SECTIONS` stays three timed parts (the booklets do not merge until N2).
- `build-exercises-n3-plus.js` already gives N3+ units extra generated types (pairMatch, fill_blank). Check they still fit once real N3 units exist.
