# N5 grammar + example sentences: how they were authored

Ticket 14. The content lives in `data/n5/grammar.js` and `data/n5/sentences.js`. This note says where it came from, so it can be checked or redone.

## Which points

- **Must-cover:** the 40 Tanos N5 grammar names in `tools/ref/n5.json` (map Q18). Each item's `ref` lists the Tanos name(s) it teaches. `g:wa-desu` covers both は and です.
- **Extras:** the 20 JLPT Sensei N5 names that the grammar audit (`.scratch/content-audit/research/grammar-mapping.md`, "N5 JLPT Sensei names") marked CONFIRMED by a second, independent source at N5. They carry `offList` (why they're not on Tanos) and the confirming URL(s) in `sources`. JLPT Sensei is used only as a name checklist; none of its text is used.
- One audit citation was dropped: for もう, the japanesetest4you link is its **N4** page, so only Bunpro confirms N5 there.
- Not included: the JLPT Sensei names the audit marked UNCONFIRMED or DISPUTED (でも, どんな, とき, 方, お/ご, をください, しかし, そして, それから, はどうですか…).

## Meanings, notes, sources

- `meaning` and `notes` are written from scratch. The N5 meaning glosses in the audit ("N5 Tanos meanings (own wording)") were the starting point.
- `sources`: `'tanos'` (level) plus the page that confirms the meaning: St. Olaf's Genki I/II grammar index for most points, Bunpro for のがへた. For the extras it's `'jlptsensei'` (level, name only) plus the Bunpro / japanesetest4you / Genki page(s) that put it at N5. Every item has at least 2 distinct sources.
- `verified: true` needs ≥2 sources for level and meaning **and** ≥2 examples that were checked by hand (map Q1). All 59 items meet both. Weakest: いつも and とても, confirmed only by a Genki I chapter (the textbook covers N5, but it isn't a JLPT list), and arguably vocabulary.

## Example sentences

1. **Pool:** the Tatoeba jpn-eng export (`.scratch/content-audit/research/data/tatoeba/`, see its README, CC BY 2.0 FR). Search started from `n5-candidates.json`. For points where those candidates were noise or too hard, the full `pairs-jpn-eng.jsonl` was searched with a regex per point, e.g. `[てで]もいいですか`, `(い|た|な)ので`, `[ただ]り.*[ただ]り(します|しました)`. Hits were limited to ≤26 characters, ranked native authors first, then shorter first. Sentences with the tags `@needs native check`, `@change`, `@check translation`, `@possible copyright infringement` or `not a sentence` were dropped, and so were sentences with no recorded author (they can't be attributed).
2. **Pick (each one by hand):** the grammar point is present **in the intended sense** (から "because", not "from"; でしょう, not だろう; 前に "before", not "in front of"); the vocabulary is mostly N5 (N5 kanji preferred, a few common N4 words allowed); the Japanese is natural; the English is accurate. When Tatoeba links several translations, the most literal natural one was chosen (`enId`).
3. **Own sentences** (`s:own:*`, author `jelly-jlpt`, license `own`) fill gaps where Tatoeba had nothing clean: e.g. のがへた, の中で〜が一番, たり〜たり, 〜く/になる, offers with ましょうか. They use plain N5 words, with N5 kanji only. The three legacy stubs (`s:own:n5-wa-desu`, `-mo`, `-ni-ikimasu`) were rewritten in place.
4. **Reading:** for Tatoeba, kana from its furigana (`[漢字|かん|じ]` → かんじ), with the furigana kept as `furigana`. Three unreviewed furigana were wrong, so the reading was corrected by hand and the furigana dropped: 232073 (行った read as おこなった), 123124 (二人 as ににん), 8993544 (１人 had no reading).
5. **`uses`** lists only grammar ids, the ones the sentence is an example for. `vocabHints` holds N5 vocab as `tools/ref/n5.json` keys (`word|reading`), ready to link once `vocab.js` has them. For Tatoeba sentences they come from Tatoeba's word index (B-lines), kept only when the word actually appears in the sentence (the index also lists implied words). For own sentences they were written by hand.
6. Sentences stay `verified: false`: each has only one source.

Counts: 59 grammar points, 178 sentences (145 Tatoeba, 33 own).

## Rejected Tatoeba candidates

**Wrong grammar point** (the candidate regexes are loose):

| point | ids | why |
|---|---|---|
| ので | 3366882, 3507403, 8802750, 3496709, 851044, 2095053, 2130959, 4661105, 2040885 | の + です, not ので |
| も | 173357, 202714, 219488, 3555723, 204668, 234164 | 〜てもいい / 〜てもよい / とも, not the particle も |
| と | 123408, 234164, 205484 | conditional と, concessive とも, set phrase それはそうと |
| 〜てもいいです | 200671, 3602166, 8533941, 8608622, 9057500, 3491493, 10911458 | とても / どうでも / N + でもいい, not V-て + もいい |
| 〜てはいけません | 1431786, 10723299 | obligation (なくては / なくちゃ), a different point |
| 〜てはいけません | 2737333, 10908794, 10465307, 2125065, 11605306, 10589642 | casual 〜ちゃだめ, not the taught form |
| 〜ている | 6832822, 8687267 | で + いる (一人でいる), not a て-form |
| 〜がいます | 10098043, 10792680, 10661659, 11052291, 3576174 | いる = 要る "need", not existence |
| 〜く/〜になる | 2121102, 8964964, 13082994, 9628694 | idiom 気になる; honorific お〜になる |
| 〜たい | 4216208, 11576335, 1078799 | みたい ("like / seems"), not たい |
| でしょう | 4870358, 10877340, 10185636, 10914931, 10987698, 11867198 | だろう |
| 〜まえに | 9966299, 10899864 | 前に "in front of" |
| 〜ませんか | 9447658, 1160401 | requests, not invitations |
| 〜ませんか | 897046, 3576119, 9628694 | honorific forms, above N5 |
| 〜ましょう | 2782591 | どうしましょう "what should I do?", not "let's" |
| や | 184783, 195410, 75690 | idiom 〜やそこら; やだ (= いやだ); a sentence about particles |
| けど | 11746265 | やけど "burn" (substring) |
| まだ | 8571196 | 何てざまだ (substring) |
| だけ | 188596, 228969, 224879, 194336 | いただけますか (substring) |
| か〜か | 230813, 149030 | どうか / 何本か, not "A or B" |
| の | 83638, 187572, 188169 | sentence-final の, not noun-linking |
| よ | 11041776, 13080158 | あばよ / あいよ are set words |
| まで | 235131, 234974, 234904 | までに "by", a different (N4) point |
| 〜のほうが〜より | 1484928, 217324, 213663 | ほうがいい advice / ほうがましだ (N3), not comparison |
| 〜のがじょうずです | 8553735, 8916464 | 上手になってきた (N4 〜てくる); 上手い is read うまい |
| 〜てから | 122693, 122378, 168040, 167591, 10081372 | 〜てから〜になる "it has been X since", a different use |
| 〜てから | 124665 | English renders てから as "before you come": accurate, but it teaches the wrong gloss |
| 〜から | 9868348, 11056143, 3496679, 137693 | sentence-final から with the result left unsaid: hard to read as an N5 example |

**Wrong or unnatural** (translation or Japanese):

| id | sentence | why |
|---|---|---|
| 10901881 | りっぱな大人になりたいです。 | "a handsome adult" mistranslates りっぱな (fine, respectable) |
| 9966198 | 夜は涼しんだけど、昼は暑いね。 | 涼しん is a slip for 涼しいん |
| 1588525 | 来週は本を読んだりテレビを見たりします。 | the English adds "probably", which isn't in the Japanese |
| 11029284 | 仕事したり遊んだりします。 | both English versions are unnatural |
| 2446673 | あれは医者ではありません。 | あれ for a person is rude; the English "He is not…" isn't literal. Replaced by 8587365. |
| 13063899 | 大きいね。 | the English "It's big." drops the ね (used as a ね example) |
| 10185636 | テニスはどうだろう？ | だろう, and "How about playing tennis?" is loose |
