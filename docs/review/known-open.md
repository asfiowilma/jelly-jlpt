# Known-open list

Shared by all reviewers. Do not re-report these unless worse (bigger count, new unit, new consequence). Cite id.

From N5 fix round 2026-10-06.

| id | Item | Status |
|---|---|---|
| G1 | Tanos N5 vs N4 placement of つもり, たことがある, ので, ほうがいい, すぎる, んです, ずつ, なくちゃ: tanos.co.uk unreachable, archive blocked; `tools/ref/n5.json` files them N5, content unchanged | open; if Tanos reachable (`grammar-n5.json` in cache = Wayback copy) check, report as `UNSURE` resolved |
| G2 | Kanji beyond the 79 (赤, 店 etc.) in mock stems with furigana; catalog follows reference list's 79 | by design |
| G3 | Qwen presets Serena / Ono_Anna: no separate licence terms found; part of Apache-2.0 model | open, external |
| G4 | Japanese UI strings hidden behind `UI_JA_READY = false` (`app-helpers.js:459`) pending native review | hidden; unreachable by learner |
| G5 | iOS Safari play-after-fetch untested | open, needs device |
| G6 | Grammar beyond Tanos not added: がほしい, にする, とき, はどうですか, ないで, もらう/くれる/あげる | open; report only if N5 shipped text uses one untaught |
| G7 | Listening "key = longest option" still up to 33% per format (needs new option text + clips) | open; B7.10 threshold 40% |
| G8 | 文脈規定 in lessons shows English note; some same-pos distractors would fit without it (owner kept note as disambiguator). Mocks: authored, one fit, no note | by design in lessons; report mock items only |
| G9 | 11 N5 grammar points get no gap question (all confusables are siblings); lessons have few ★ questions | by design |
| G10 | Drill 表記 has no katakana items (full mocks do) | open, nit |
| G11 | `uses` incomplete on some Tatoeba sentences (象, 肉, 夢, ネコ, ベンチ, 動物園 unlisted); `cardExample` covers ~32% of items | open; report concrete teaching-order leak it causes, not incompleteness |
| G12 | Credits: upstream alanfwilliams/jlpt row for non-shipped content; Ko-fi/Trakteer logos uncredited | nit |
| G13 | Kana stages u009, u016, u017 ask single-kana readings 33-68% (no N5-N3 words hold their new kana) | known; report only if stage with available words does it |
| G14 | Flaky random tests seen once each (mondai hyouki, conjugation generated N3+ types) | not content |
| G15 | Mock listening plays each script twice (once + one replay), free navigation; disclosed in mock intro + result copy | by design, disclosed |
| G16 | All 283 N5 sentences `verified:false` by rule (one source each: Tatoeba or own); 42 test-format listening items `verified:false` (はい/いいえ/ええ/さあ/どうも/もしもし: Jisho gives no pos); 22 mondai + 3 mocks `verified:false` | by rule; report only missing `notes` reason |
| G17 | N5 kana stages u011, u017 teach 20-21 kana; quizzes 22-24 questions | by decision: unit ids stable, no stage split; quiz cap 22 keeps single-kana share down |
| G18 | Stale or missing N5/N4 clips (e.g. `l:n5-next-train-time`), suite runs with `AUDIO_STALE_OK=1` | owner renders; transcripts are final, judge script text only |
| G19 | `g:itsumo`, `g:totemo` are adverbs filed as N5 grammar points (`offList`) | by decision 2026-10-12: kept, ids stable once shipped; notes teach usage contrasts. Playbook bars this at N4+ |
| G20 | Prep drill 文脈規定 is generated from catalog sentences: some noun keys keep a same-pos second fit (いつも（学校 / 図書館）で). The English note sits behind a hint button and shows after the answer. Mock 文脈規定 are authored single-fit | by decision 2026-10-12 (N4 r4): nit; report mock items and drill stems with 3+ fits only |
| G21 | Lesson and review grammar gaps show the English note; meaning-contrast siblings (はず / はずがない / かもしれない, ごろ / までに / 前に, かな / よ) fit the slot grammatically and the note picks one. Prep gaps skip those points (`PREP_GAP_SKIP_N4`) | by design (same as G8 and N5 r5); report prep and mock stems only |
