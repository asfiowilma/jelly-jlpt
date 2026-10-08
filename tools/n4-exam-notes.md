# N4 exam items: how they were authored

The content lives in `data/n4/passages.js` (読解) and `data/n4/mondai.js` (言い換え類義, 用法, 文章の文法). Listening (`data/n4/listening.js`), the mocks (`data/n4/mocks.js`) and the prep units have their own sections below. This note says where the items came from and what was decided, so they can be checked or redone.

## Sources and rules

- **Format only** from jlpt.jp (`n4_e_revised.pdf`, the sample index): which sections exist, how many questions per text, rough lengths. Nothing is copied from the official workbooks, JLPT Sensei or NHK Web Easy. Every text and option is written for this project (`sources: ['own']`).
- **Kanji:** only the catalog's N5 + N4 lists (Tanos). A word with any kanji above N4 is written in kana. Every kanji sits inside a `[漢字|かな]` ruby block, and every ruby reading is backed by a used word, a name or the kanji's readings (`ownTextErrors`).
- **Topics:** everyday N4 settings (work memos, school, apartment notices, hospital, station, shop, travel, emails, timetables). Names use N5/N4 kanji only (田中, 山田, 中川…) or katakana (リン, キム, マリア…), never the lesson-dialogue cast.
- **`uses`:** grammar and vocab ids kept by hand (no tokenizer); the `k:` ids collected from the text by script. Words with no catalog entry (ことになる, ところで, おります, ぐらい, ずっと, のんびり, すごす, みなさま, ひも, ころぶ, 飼う, ただし…) stay out of `uses` and are named in the item's `notes`.

## Passages (38)

- 24 short (1 question, 103–147 characters), 6 mid (3 questions in text order, 407–454), 8 info (2 questions, 300–323, ≥3 `・` lines). Lengths count without whitespace. `PASSAGE_FORMATS.N4` in `tests/catalog-checks.js` holds the windows (short 80–260, mid 340–580, info 280–520).
- Keys spread over 0–3 per format; no explanation refers to an option position.
- `verified: true` on all 38: own text, every check passes and every `uses` item is verified (the rule in the file header).

## Mondai (38)

- 14 iikae, 14 youhou, 10 bunshou (4 blanks each). All `verified: false`: one source (own).
- **`uses` = the right reading only.** `itemErrors` checks `uses` against iikae's sentence + paraphrase, youhou's word + right sentence and bunshou's filled text. The author's youhou items also listed the distractor sentences' words and kanji (142 ids); those were dropped from `uses`. The iikae check now reads the paraphrase through `furiganaText`, as the youhou check already did, since N4 options carry ruby (言われました was hidden by `[言|い]われました`).
- **iikae / youhou options carry ruby.** `iikaeQuestion` now builds `optionParts` through `quizFurigana`, as `youhouQuestion` and `bunshouQuestion` do: ruby shows on untaught kanji, hides on taught ones, and an untaught kanji is never printed bare (`tests/mondai.js` asserts that for all three types). N5 iikae options are kana-only, so their text is unchanged.
- **youhou word with kanji:** `m:n4-youhou-yamu` keeps `word: '[止|や]む'`. `youhouQuestion` already turns the word into furigana parts and the quiz shows them large with ruby (renderer route; no data change). The other 13 words are kana because their kanji are above N4.

## Spacing

N5 texts put a full-width space between phrases, as the N5 test does. N4 texts are **unspaced**, as the N4 test prints them. Nothing depends on the spaces: `furiganaParts`, `quizFurigana` (ruby hidden on taught kanji) and `ownTextErrors` / `passageErrors` (which strip `\s` before counting or matching) work on unspaced text; the phrase-space logic in `lib.js` is the dialogue word-marking only, and `chunkSpeech` falls back to 、 and hard cuts. No engine change was needed.

## Distractor review

Each flagged blank and option was re-read as a strict teacher. The rule: every blank has exactly one option that is both grammatical and right in context. A distractor that is grammatical but wrong only by meaning is fine for 文脈 / bunshou / youhou, because the real test works that way.

| Item | Verdict |
|---|---|
| bunshou `library-closed` [1] | Kept. お休みいたします (humble, the library about itself) is the only fit; お休みなさいます is not a form, お休みございます needs で, お休みさせます means "make someone rest". |
| bunshou `letter-teacher` [2] | Kept. せいで is grammatical but blames the teacher for a good outcome; のに / けれど contradict. One fit (おかげで). |
| bunshou `forgot-umbrella` [2] | Kept. と + a past result is "when I did X, Y happened"; なら does not take a past result, 話すので needs 話したので, ながら needs the stem. |
| bunshou `forgot-umbrella` [3] | **Changed** けど → ながら. Spoken Japanese uses けど as a soft connector ("it turned up at the terminus, and I went this morning"), so 見つかったけど was defensible. 見つかったながら is not a form. |
| bunshou `bakery-job` [1] | Kept. Only the causative-passive こさせられて gives "I was made to come"; こさせて has no causee, こないで / こようと do not fit たいへんでした. |
| bunshou `white-cat` [1] | Kept. はずです / みたいです (second guesses) are deliberately not offered; ところです / ばかりです do not follow 〜ている that way, たがります is for wishes. |
| bunshou `white-cat` [4] | Kept. 来ていいです alone is fine, but the blank must take one of は / を / が / も, and only も works. |
| iikae `tsugou` | Kept. つごうが悪い = the time does not suit (something else is planned), so 用事があります. びょうき / てんき are other situations, ひま is the opposite. |
| iikae `sobo` | Kept. Only 母の母 is a grandmother; the father's mother is not offered, so the key is unique. |
| youhou `shikaru` | Kept. "がんばったので母にしかられてうれしかった" uses しかる where ほめる belongs: wrong in meaning, the usual 用法 distractor. |
| youhou `fukuzatsu` | **Changed** "このケーキはふくざつで、とてもおいしいです" → "きょうはかぜがふくざつで、とてもさむいです". 複雑な味 is a real collocation, so the cake sentence was defensible. Wind is つよい, not ふくざつ. |

Already replaced by the author before this review: おさらをつつむ, 手がかわく, かぜがさわぐ, バスを駅でむかえる, ふくざつなかばん, 作文をさがして出す (all valid uses), and the item なれる (also the potential of なる) became おくれる.

## The author's UNSURE list, resolved

1. **Spacing:** unspaced, see above.
2. **Info length:** info texts are 300–323 characters without whitespace (≈400 with spaces and line breaks). Kept: the nominal "about 400" in the format guide is not a hard count, N5 has the same gap (nominal 250, texts 90–300), and `PASSAGE_FORMATS.N4.info` is 280–520.
3. **Kanji gaps:** 分, 回, 点, 部, 所, 客, 乗, 昨, 合 (and 番, 号, 変, 予, 遊, 好, 港, 当) are not on the Tanos N5/N4 lists this catalog uses. That is a fact of the list, so じぶん, はんぶん, へや, ばあい, おきゃくさま, 30ぷん and "1週間に4度" stay in kana. Weekday abbreviations ([月|げつ], [水|すい]) are backed by the kanji readings.
4. **Grammar id approximations:** kept as written: `g:passive` for honorific 来られる, `g:te-iru-aida-ni` for 入院している間に, `g:demo` for 〜でもいい / どれでも, ために as `v:為|ため`. Words with no catalog entry are named in `notes`, not in `uses`.
5. **Distractors:** see the review table (two changed).
6. **Proper nouns:** kept; all N5/N4 kanji or katakana, none from the dialogue cast.
7. **Info answers that lean on reading conventions:** kept. `p:n4-parcel-redelivery` Q1 assumes the office can be reached before 8 p.m. (the text gives that time); `p:n4-clinic-hours` Q1 offers only Friday among the valid days, so the key is unique.

## Listening (90)

- 26 task, 24 point, 16 utterance, 24 quick, all `sources: ['own']`, `verified: true` by the own-text rule. Same shape and frame text as N5 (`data/n5/listening.js` header). Task / point scripts run 4 to 7 lines after the scene (N5: 2 to 6) and make the listener track a change of mind, a correction, a reason or a condition.
- Registers: plain speech among friends and family, polite with coworkers, keigo in service scenes (なさいます, ございます, いただけませんか, さしあげましょうか, めしあがってください).
- Keys were authored at option 0, then moved per format in authored order. Per format: task [7,6,7,6], point [6,6,6,6], utterance [5,6,5], quick [8,8,8]. The key is the single longest option in 1/26, 1/24, 1/16 and 6/24 items (rule: at most 40%). `tests/listening.js` now checks the spread for every level, not N5 only.
- Readings: よ[人|にん] and よ[時|じ] because the catalog has no backing reading for 四 as よ; にじゅっぷん, さんがい stay kana (分, 階 are not on the list). `[母|はは][は|わ]` in `who-picks-up-yui` keeps the voice from reading ははは.
- Voices: every M / F role has a man / woman archetype in `tools/audio/man-assignments.json` / `woman-assignments.json`, with a one-line reason (staff, teacher, parent, friend…), reusing the N5 archetypes. No clips are rendered yet; the Node runner needs `AUDIO_STALE_OK=1` until they are.
- Sets: mock 1 and mock 2 get 8 / 7 / 5 / 8 each; the diagnostic 4 / 3 / 2 / 4 (the source split had 4 / 4 / 3 / 4: `why-learn-japanese` and `message-call-back` went back to the spares, the two items with open distractor questions). The other 21 are for lesson reviews and prep drills.
- Reviews: `tools/author-plan.js` now counts every easier level as taught when it picks a review's passage or listening item (an N4 learner knows N5; alt spellings excluded, since they are never taught). Before that, no N4 review could take an item with an N5 word in it.

## Mocks (`data/n4/mocks.js`)

- `x:n4-mock-1`, `x:n4-mock-2`: `MOCK_BLUEPRINT.N4.full` exactly (vocab 7 / 5 / 8 / 4 / 4, grammar 13 / 4 / 4, reading 3 short + 1 mid × 3 + 1 info × 2, listening 8 / 7 / 5 / 8 = 85). Timed 25 / 55 / 35 min. `x:n4-mock-3`: the diagnostic blueprint (45 questions).
- **Item split** (no passage, listening item, mondai or sentence shared, and none in a review):

  | | mock 1 | mock 2 | diagnostic |
  |---|---|---|---|
  | short | library-overdue, garbage-days, lost-wallet | cafe-job, report-extension, inn-arrival | pool-rules |
  | mid | old-town-trip | bicycle-fall | learning-to-cook |
  | info | hospital-bus | clinic-hours | part-time-ads |
  | iikae | tsugou, sakki, reibou, shinsetsu | rusu, sukkari, tsumori, sobo | shumi, kowarete |
  | youhou | tsutsumu, okureru, kawaku, mukaeru | hirou, shikaru, kimaru, majime | sagasu, fukuzatsu |
  | bunshou | broken-computer 1-4 | forgot-umbrella 1-4 | winter-trip 2-3 |
  | order | te-kureru-keeki, tara-dou-kusuri, kamo-shirenai-yuki, you-to-omou-natsu | hazu-ga-nai-shiranai, ba-kusuri, te-miru-fuku, ka-dou-ka-sensei | nai-de-kasa, tokoro-deru |

- **漢字読み / 表記** come from catalog sentences. Only about a dozen N4-level words with kanji sit in a sentence with their reading, too few for 31 items, so the tested word is an N4-level word where one fits and otherwise an N5-level word written with an N4 kanji (病気, 写真, 大切): the kanji is what the real 漢字読み tests. 漢字読み fakes are "squares": two one-sound slips (voicing, a long vowel, a dropped ん) and both together, so the key is never the option the others orbit (centre share 0 of 36 across all six mocks; rule ≤35%). No fake is another reading of the same word (妹 got いもおと rather than いもと, which some dictionaries list as an older reading). Each full mock has one katakana 表記 item (ピアノ, テニス; the diagnostic has ケーキ) with lookalike fakes (ピアソ, テニヌ); 表記 kanji fakes are lookalikes that are not words.
- **文脈規定 / 文の文法1** are written for the mocks, with ruby on every kanji and `uses` / `names` for the own-text check. Each was solved as a teacher: one option fits the sentence, the others are ungrammatical or wrong in meaning (as in the real test). Changed on review: 2 bunmyaku / gap distractors that also fitted (さいふを**わたして**しまったので → あらって; やすい**が**、料理も → ので, since が can be a soft "and"), and ★ on the fixed last chunk ですか moved to みても.
- **Keys**: a seeded shuffle per block of four questions. Vocab [7,7,7,7] and grammar [7,8,7,7] / [7,7,8,7] in the full mocks, [4,4,4,3] / [4,4,4,5] in the diagnostic. Listening keys are authored: [9,7,8,4], [7,10,8,3], [5,2,4,2] (top slot 32%, 36%, 38%).
- No answer string appears in another question of the same mock, and no 表記 kanji is printed earlier in its section (`tests/mocks.js`).

## Prep units (n4.u103-u109)

- `tools/plan-n4.js` GUIDES / PREP / MOCK_GUIDE, same 7-unit shape as N5: vocabulary { kanjiYomi 3, hyouki 3, bunmyaku 4, iikae 3, youhou 3 }, grammar { gap 6, order 3, bunshou 1 }, reading { short 3, mid 1, info 2 }, listening { task 2, point 2, utterance 2, quick 3 }, mock 1, the fix-up drill, mock 2. Lesson units are unchanged; the seven units are appended.
- Guide facts: 85 questions in 115 minutes, parts of 25 / 55 / 35, 用法 as the fifth vocabulary type, 13 of 21 grammar questions are gap-fill, 3 short texts, one mid-size text with 3 questions, 2 information-search questions, 8 quick replies. Examples in the guides avoid answers from the mocks.

## Checks

- `tests/catalog-checks.js`: `itemErrors` (iikae, youhou, bunshou shapes; `uses` in the text), `passageErrors` + `ownTextErrors` (lengths per level, question counts, kanji level / ruby / readings, katakana words).
- `tests/mondai.js`: every catalog iikae, youhou and bunshou question builds, its key matches the authored answer, and no option (or 用法 word) prints an untaught kanji without ruby.
- `.claude/hooks/run-tests.js`: the mock walk plays the first catalog iikae, bunshou and youhou items (youhou used to be an inline fixture).
