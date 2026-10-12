# Teacher slice: grammar-sentences (B3, B4, B6.4, B6.6, B10.3-B10.4)

Reads: `grammar.js`, `sentences.js`, `plan.js`, `mondai.js` (gap/order only), Tatoeba cache.
Load with [common.md](../common.md), [teaching-order.md](teaching-order.md), [known-open.md](../known-open.md), `levels/<level>.md`.

## B3. Grammar notes and inventory

| # | Check | Pass | Fail |
|---|---|---|---|
| B3.1 | Every `pattern`, `formation`, `notes`, `meaning` correct grammar, own words, level register | correct | wrong rule (e.g. "ない cannot follow て"; てない is standard contraction of ていない); missing core use (に indirect object; ている habit/state) = major if lesson sentence/exam item relies on it |
| B3.2 | `meaning` English only (Japanese hints in `usage`) | yes | kana/kanji in `meaning` |
| B3.3 | Every point of reference grammar list (`grammar-<level>.json`, Tanos) in catalog (`ref` field) and taught (`tools/coverage.js` 100%) | 100% | any missing |
| B3.4 | Conjugation-form points exist and precede every pattern built on them (ます/ません/ました/でした, dictionary form, て/ない/た form, plain past for たことがある, つもり, ほうがいい) | dependent unit after form unit in `plan.js` | てください before て-form unit |
| B3.5 | Extras beyond Tanos = real grammar, not vocab (いつも, とても are vocab) | yes | vocab padded in as grammar |
| B3.6 | Level placement: Tanos-N4 point absent from N5 lessons, sentences, passages, listening, mocks (reverse for N4: no N3 pattern). Not N5: potential, passive, causative, たら, ば, ながら, そう, ように, てしまう, ておく, かもしれない, と思う, という, なさい | none found | later-level form in shipped text (食べられません in N5 example) |
| B3.7 | Each point ≥3 examples whose `uses` all taught by that point's unit (`taughtIds(unit)`) | ≥3 clean | fewer |
| B3.8 | Gap questions: no option set with two interchangeable answers. Sibling families: から/ので; けど/けれども/が; ましょう/ませんか/ましょうか; てもいい/てはいけません/ないでください; なくちゃ/なくてはいけない/なくてはならない; のが上手/下手/好き; もう/まだ; を/で (ラジオを聞く vs ラジオで聞く); まで/から | every generated gap stem has exactly one grammatical answer in context | stem where two options parse |

Measure B3.8: run `buildExercises` (or `mondaiQuestions('gap', ...)` via `prepDrill`) for every lesson, review, prep unit ≥8 times, different seeds; collect distinct `(stem, option set)`; read each by hand, count those with ≥2 grammatical fills. Report `ambiguous / distinct stems`. Mock gaps (`mocks.js`) show no English note: must disambiguate from Japanese alone.

## B4. Sentences (Tatoeba and own)

| # | Check | Pass | Fail |
|---|---|---|---|
| B4.1 | Every `s:tatoeba:<id>` matches source: `jp`, `author`, `license`, `enId`, `en`, `enAuthor`, `enLicense` | all match | any text/attribution diff; missing `author` |
| B4.2 | `furigana` present whenever `jp` has kanji; stripping ruby gives `jp`; joining readings gives `reading`; all correct (行った いった not おこなった; 二人 ふたり not ににん; 今日 きょう; 上手 じょうず) | all | bare-kanji sentence; wrong ruby |
| B4.3 | `uses` names every grammar point, content word, kanji in sentence (set phrases excluded) | complete | content word missing from `uses` (hides teaching-order leak) |
| B4.4 | No false-friend matches: ので ≠ の+です; いる "exist" ≠ 要る; たい ≠ みたい; でしょう ≠ だろう; 前に "before" ≠ "in front of"; から "because" ≠ "from"; まで ≠ までに; てもいい ≠ とても/どうでもいい; ましょう ≠ どうしましょう; ている ≠ で+いる; よ ≠ あばよ | example shows point in intended sense | false match |
| B4.5 | English faithful (no invented content, no dropped ね/よ nuance changing meaning); most accurate translation chosen | yes | mistranslation |
| B4.6 | ★ order: authored `chunks` join to `jp`; exactly one valid order, or `star` restricts slot where several valid | one answer | second grammatical order data allows |

## B6.4 and B6.6. Review cadence and grammar order

| # | Check | Pass | Fail |
|---|---|---|---|
| B6.4 | Review every ≤6 lessons, teaches nothing new | yes | gap >6; review with new items |
| B6.6 | Grammar order: て-form before てください/ている; ない-form before ないでください/なくてはいけない; dictionary form before のが好き/前に; た-form before たことがある/たり/ほうがいい | yes | dependent before its form |

## B10.3-B10.4. Attribution (Tatoeba and credits)

| # | Check | Pass | Fail |
|---|---|---|---|
| B10.3 | Every Tatoeba sentence keeps `id`, `author`, `license`, `enId`, `enAuthor`, `enLicense`; Settings lists every author (`components/settings-view.js`, generated from catalog) | all shown | missing author display |
| B10.4 | `CREDITS` in `components/settings-view.js` names every third-party source: Tanos (Jonathan Waller, CC BY), elzup, EDRDG (when `jmdict`/`kanjidic` in `sources`), Tatoeba, KanjiVG (CC BY-SA, separate files), Kenney (every pack used), Qwen3-TTS, React, PouchDB, DiceBear; new N4 source gets row | complete | missing row |
