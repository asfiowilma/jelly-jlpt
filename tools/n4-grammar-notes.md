# N4 grammar + example sentences: how they were authored

The content lives in `data/n4/grammar.js` and `data/n4/sentences.js`. This note says where it came from, so it can be
checked or redone. Two authors wrote it in parallel from one brief: part A = inventory blocks 1-7, part B = blocks 8-14
(the inventory, the brief and both authors' working scripts are in the gitignored `.scratch/n4-launch/grammar/`:
`work-A/`, `work-B/`, each with `spec-*.js` as the hand-written source, `build.js`, `validate.js`, `search.js`).
The two parts were concatenated A then B. One edit after that: four `meaning` strings held Japanese, which the catalog
check forbids (the meaning is the English gloss), so they were reworded in English (g:te-ita, g:jidoushi-tadoushi,
g:amari-nai, g:gozaimasu); the Japanese stays in `pattern`, `formation` and `notes`.

Counts: 96 grammar points (50 Tanos points under 48 items with `ref`, 48 `offList`), 417 sentences (284 Tatoeba,
133 own), 46 chunk sets.

## Which points

- **Must-cover:** the 50 Tanos N4 grammar names in `tools/ref/n4.json`. Each item's `ref` lists the Tanos name(s) it
  teaches, exactly as spelled there; `g:no-you-na` covers ～のような + ～のように, `g:te-iru-aida-ni` two names too.
  Tanos's `～かどうか` was in no inventory block; part B added it at the end of block 14 (`g:ka-dou-ka`).
- **Extras:** JLPT Sensei N4 names (name checklist only) that Bunpro and / or japanesetest4you also put at N4, plus a few
  Genki II points. They carry `offList` (why they're not on Tanos) and ≥2 confirming pages in `sources`.
- **Form points** (`offList`): adjective / noun て-form, なくて, noun-modifying clauses, ていた, potential, imperative,
  な prohibitive. The volitional, ば, passive, causative and causative-passive are Tanos points (`ref`). Each form comes
  before the patterns built on it in the inventory order.
- **Not re-taught:** N5 points (`data/n5/grammar.js`) are referenced in notes, not repeated. Words like きっと, さっき are
  vocabulary, not grammar. `ta-bakari` (Tanos N3) is not included.

## Method (part A)

- **Points and order:** inventory §(d) blocks 1-7, in the inventory's order. Ids from the inventory.
- **Level + sources:** Tanos points carry `ref` (exact name from `tools/ref/n4.json`) + `'tanos'` + one confirming page
  (Genki II chapter page on the St. Olaf index, or Bunpro / japanesetest4you). Extras and form points carry `offList` with
  the reason + two pages (Bunpro / japanesetest4you / Genki). The per-point URLs are the ones recorded in
  `.scratch/content-audit/research/grammar-mapping.md` §"N4 JLPT Sensei names" plus Genki pages read off today's St. Olaf
  index; every URL was fetched (see "URL check" below for page titles / levels). No wording was copied: meaning,
  formation and notes are written from scratch.
- **Examples:** Tatoeba pool `pairs-jpn-eng.jsonl`, searched with a regex per point (`work-A/search.js`): ≤30 chars,
  author recorded, an English with an author, no bad tags (`@needs native check`, `@change`, `@check translation`,
  `@possible copyright infringement`, `not a sentence`, plus dialect / proverb / idiom / old-fashioned / い抜き tags),
  no digits, not already used by N5, and **every kanji in N5 + N4** (tools/ref). Ranked native author first, then
  furigana reviewed, then shorter. Each pick read by hand: the point in the intended sense, natural Japanese, N5/N4
  vocabulary mostly, English accurate (the best linked English chosen; `enId`).
- **Own sentences** (`s:own:n4-*`): for the first point(s) of a block (simple teaching sentences, N5 words + the
  point) and where Tatoeba had nothing clean (often because the natural sentence needs a kanji outside N5/N4).
  Words outside the N5/N4 kanji lists are written in kana.
- **`uses`:** grammar ids the sentence exemplifies, plus the forms and earlier N4 points it relies on (so the teaching-order
  filter sees them), then every kanji (`k:`), then N5/N4 words (`v:`, exact catalog / keys-file key). Vocab links came
  from `build.js` (kanji words matched with their ruby reading; kana words listed for review), then each sentence was
  reviewed by hand: wrong auto links dropped (`nov` in the spec, e.g. 赤い in 赤だ, 見る in 見つける, 足す in 足りる),
  kana words added (`v`). Grammar ids follow the catalog's own surface rule: a form id is listed only when its pattern
  token is visible (so `g:nai-form` is not listed on なくて, `g:te-iru` not on contracted 〜てる / 〜てます).
- **Readings:** from Tatoeba's furigana, each checked by hand.

## Method (part B differences)

Same as part A ("Method (part A)" above), with these differences:

- **Points and order:** inventory §(d) blocks 8-14 in the inventory's order, ids from the inventory, plus `g:ka-dou-ka`
  (see "Inventory gap" below). The optional `g:to-iwarete-iru` (block 13) is included; `g:tagaru` (block 11 "review") is
  part A's item and is not re-added. `ta-bakari` (recommended in §(c) but placed in no block, Tanos N3) is not included.
- **Sources:** Tanos points: `'tanos'` + the Genki II chapter page from the St. Olaf index (fetched today, slugs read off
  the index), plus a japanesetest4you page where one exists for a form point. Extras: Bunpro + japanesetest4you pages
  (titles carry the level), or Genki / Tae Kim where japanesetest4you has no page. Every URL was fetched (see "URL check").
- **Part A ids:** `validate.js` loads data/catalog.js, data/n5/*, grammar-A.js and sentences-A.js before part B, so any
  B id that repeats an A grammar or sentence id fails the load, and `uses` such as `g:te-miru`, `g:potential`, `g:tte`,
  `g:mitai`, `g:te-aru`, `g:te-kuru` resolve against A. No B sentence id is an A or N5 id (the search skips them).
- **Kanji rule:** many natural N4 sentences fail because of 合 (場合), 必 / 要 (必要), 降 (降る), 回, 寝, 番, 全 / 然, 頃,
  召, 申, 参 — none is N5/N4 in tools/ref. Those words are written in kana in own sentences (ばあい, ひつよう, ふる, ねる,
  いちばん, ぜんぜん, ごろ, めしあがる, もうす, まいる), and the grammar notes say so where the point's own word is affected.
- **`uses` and the catalog surface rule:** as in A, a grammar or vocab id is listed only when `tests/catalog-checks.js`
  `surfaceMatch` can see it. Consequences: `v:する|する` is not listed on すれば / しよう (the rule only knows し[てたまな] /
  さ[せれ]); `g:n-desu` is not listed on contracted 〜んだ; `g:hou-ga-ii` is not listed on 12018756 (方 written in kanji);
  `g:to-omou` not on そう思うかい. Patterns were written so the rule finds them in every example (e.g. `V-よう/V-おう と思う`,
  `〜なければ(ならない/いけない)`, `しか〜ない/〜ません/〜なかった`, `いたします/まいります/もうします`).
- **build.js changes:** besides renaming, the auto-vocab step always drops `くださる` (ください has its own key), drops
  `なさる` in a なさい sentence and `そんな` when そんなに is present (そんなに has its own key).

## Inventory gap: ～かどうか

Tanos `～かどうか` (inventory §(a) #37, id `g:ka-dou-ka`) is on the Tanos list but in none of the 14 §(d) blocks, so
neither part had it. Part B adds it at the end of block 14 (after `g:kana-kashira`, its nearest neighbour: wondering /
embedded questions). With it every one of the 50 Tanos names is covered by A + B (checked against tools/ref/n4.json).
The plan may prefer to move it earlier (it only needs plain forms); its examples use potential, てみる and the
volitional, so not before blocks 5, 7 and 11 unless those examples are hidden.

## Block 1: plain-form sentences

| point | sources | examples | notes |
|---|---|---|---|
| g:te-adj-noun | Bunpro "Verb[て]・Noun[で] + B" (N4); Genki I ch.7 | own ×2, 10901873, 190695, 10901517 | own sentences first (しずかで / 安くて) |
| g:nakute | Bunpro なくて (N4); Genki I ch.7 | own, 11527067, 10140581, 172932 | own sentence for the verb-reason use (わからなくて) |
| g:noun-modifier | Genki I ch.9, Genki II ch.15 | own ×2, 11831566 (の-subject), 1107908, 11720950 | |
| g:te-ita | Bunpro ていた (N4); Genki I ch.7 ている | 152797, 225305, 12515162, own | |
| g:to-omou | Bunpro とおもう (N4); JT4Y とおもう (N4) | 10899511, 171704, 2121372, 161836 | |
| g:tte | Bunpro って (N5); Genki II ch.17 | 10671730 (quote), 9486036, 9725630 (topic) | |
| g:to-iu | tanos; Genki II ch.20 | 3481397, 211000, 233719 | |
| g:koto | Bunpro こと (N4); JT4Y こと (N4) | own, 81616, 184779 | the natural しゅみは〜ことです sentences on Tatoeba all have 趣/夢 (not N5/N4): own instead |
| g:to-iu-koto | Bunpro ということ (N4); JT4Y (N4) | 161813, 79848, own | only 4 Tatoeba hits passed the kanji filter |

Rejected (block 1):

| point | ids | why |
|---|---|---|
| te-adj-noun / nakute | 1153118, 147979, 10654685, 12170451, 332360, 332358 | rely on the potential form (block 5) |
| nakute | 9188924 | しおれちゃった: てしまう (block 7) and しおれる (above N4) |
| nakute | 161252 | がほしい (block 3) |
| nakute | 9859212 | 止めれない: ら抜き potential with 止 read や |
| noun-modifier | 10558846, 8534194, 224392 | 話せる / できる potential (block 5) |
| noun-modifier | 11120279, 170917 | imperative 見せろ (block 12) |
| noun-modifier | 125977 | 長い間さがしていた: fine, but 見つかる is N4-only and the clause is long; kept 1107908 instead |
| te-ita | 13028941 | English "I collected stamps" loses the past-progressive / habit reading |
| te-ita | 190561 | English "I took a week off" doesn't show ていました |
| to-omou | 811769, 234384 | すぎる + と思う: fine but kept the simpler ones |
| to-omou | 171704 English | kept, but note "We expect that…" is a loose rendering of 思います |
| tte | 9458330, 9240812, 11619934 | hearsay って / んだって: kept for g:sou-da-hearsay contrast, not as first examples |
| to-iu | 10723744, 10778228, 11998539, 11390402 | あっという間 (set phrase) |
| to-iu | 228730, 10899585 | というわけではない / というか (other patterns) |
| koto | 12091477, 188096, 193171, 9700861 | ことはない "there's nothing to / never" (other pattern) |
| koto | 2041062, 5845208, 8639580 | ことはできない: ことができる point (block 5) |
| koto | 148467, 163365, 6013 … | 趣 not N5/N4 kanji |
| to-iu-koto | 8888417 | によると + 台 風 (台風 not N4 vocab), and it's hearsay ということだ (N3) |

## Block 2: linking and listing

| point | sources | examples | notes |
|---|---|---|---|
| g:shi | tanos; Genki II ch.13 | own ×2, 224297, 10969586, 1866547 | own first (apartment / shop reasons) |
| g:nado | Bunpro など (N4); JT4Y など (N4) | own ×2, 1987791 | Tatoeba など lists all failed the kanji filter or were など "contempt" uses |
| g:toka-toka | Bunpro とか〜とか (N4); JT4Y (N4) | own ×3 | 0 Tatoeba hits passed the filters: every とか hit was 何とか / しとかない (ておく) / a single とか |
| g:dake-de | Bunpro だけで (N4); JT4Y (N4) | own, 10808978, 9042473, 1683201 | |
| g:sore-ni | jlptsensei (name); Bunpro それに (N4) | own ×2, 1866547 | every Tatoeba それに hit but one was それ + に ("about it", "to it") |
| g:sore-demo | Bunpro それでも (N4); JT4Y (N4) | own ×2, 11619795 | 11619795 also uses てみる (block 7), so own sentences come first |
| g:demo | Bunpro でも (N4); JT4Y でも (N4) | 8534126, 10931325, 2992032, own | |

Rejected (block 2):

| point | ids | why |
|---|---|---|
| shi | 11052849, 157113, 11683148, 4715135 | rely on potential 聞こえる / 行ける / できる / 話せる (block 5) |
| shi | 205185 | 〜やすい (block 5) |
| shi | 10587379 | 持ってない with dropped particles; fine but harder |
| shi | 10847541 | 自転車通学 / バス通学: 通学 not N5/N4 vocabulary |
| nado | 3488410, 229409 | など + 気にするな / ほっとけ: prohibitive / slangy, and the "dismissive など" sense |
| nado | 5185695 | causative + ものか (N2) |
| nado | 151119 | 試験 + ばいいのに (block 10) |
| dake-de | 11563419 | 出そう (appearance そう, block 4) + よだれ |
| dake-de | 182118, 144947, 192537 | だけでなく "not only" (N3 pattern) |
| dake-de | 196731, 11028015 | ぞっとする / passive されてる |
| sore-demo | 10914924 | それでもよかった: reads as "even that would have been fine" (それ + でも), not "even so" |
| sore-demo | 10987893 | リスク: not N5/N4 vocabulary |
| demo | 187835, 187833 | 何でもない "it's nothing" (set phrase) |
| demo | 9373441 | 食べれる (ら抜き potential) |
| demo | 12049570 | imperative 飲め |
| demo | 228823 | 出かけられます potential (block 5) |

## Block 3: wanting and feeling

| point | sources | examples | notes |
|---|---|---|---|
| g:ga-hoshii | tanos; Genki II ch.14 | own, 151216, 161578, 187929 | |
| g:te-hoshii | tanos (garbled ～のようてほしい, read as てほしい per inventory); Bunpro, JT4Y, Genki II ch.21 | own, 157464, 1152237, 164300 | **UNSURE (ref only):** the Tanos name is a typo in Tanos's own PDF; three sources support the てほしい reading |
| g:tagaru | tanos; Bunpro たがる (N4); JT4Y たがる (N4) | own, 10796446, 2662459, 9752002 | |
| g:ga-suru | Bunpro がする (N4); JT4Y (N4) | own, 11483540, 223647, 2478353, 8505146 | 気がする included as the second use |
| g:sa | Bunpro さ (N4); JT4Y さ (N4) | own, 218746, 210451, 880317 | |

Rejected (block 3):

| point | ids | why |
|---|---|---|
| ga-hoshii | 161252 | なくて "not X but Y" (fine, but used in g:nakute's rejected list: keeps it single-point) |
| ga-hoshii | 155748, 188055 | んだ / のですが: fine, kept the plain ones |
| ga-hoshii | 159231, 1484733 | トヨタ車 / バイト: brand name, slang |
| te-hoshii | 3137742 | 冬休み明けないで: 明ける not N5/N4 vocabulary, ないでほしい is the harder negative |
| te-hoshii | 9596832, 9341595 | お前 (rough register) |
| te-hoshii | 11692632 | ほしいって quotes Tom (って, hearsay): two points at once |
| tagaru | 11683197 | 入りたがってる: fine, but "The dog wants in" is idiomatic English |
| tagaru | 84479 | 私を医者にしたがっている: "make me a doctor" (にする), harder |
| ga-suru | 11588172 | 足音: not N5/N4 vocabulary |
| ga-suru | 228271, 4563346, 11027731 | 気がする with うしろめたい / dropped particles / 方 comparison: harder |
| sa | 3340567, 4751812 | substring hits (勉強された: honorific passive) |
| sa | 11031508, 9358041 | 持ち運び / 大体: longer, extra vocabulary |
| sa | 178529, 11469877 | スーツケース: fine, kept the simpler ones |

## Block 4: appearance and inference

| point | sources | examples | notes |
|---|---|---|---|
| g:sou-da-looks | tanos (～そうです); Genki II ch.13 | own, 227830, 216464, 80451, 10809041 | inventory maps Tanos ～そうです to appearance and そうです to hearsay |
| g:mitai | tanos; Genki II ch.17 | 184879, 11052242, 12054409, own | own sentence shows みたいに |
| g:you-da | Bunpro ようだ (N4); JT4Y (its page is titled N3, but it sits on the JT4Y N4 list) | 171129, 171535, 230329, 3367120 | 230329 also uses あまり〜ない (block 12, part B) |
| g:no-you-na | tanos (～のような + ～のように); Genki II ch.22 | own, 12296469, 4930, 233478, 161400 | |
| g:sou-da-hearsay | tanos (そうです); Genki II ch.17 | own, 1594278, 189072, 2458766 | |
| g:kamo-shirenai | tanos; Genki II ch.14 | own, 2363874, 234338, 8897204 | |
| g:hazu | tanos; Genki II ch.19 | 198131, 8579884, 11173182, own | |
| g:hazu-ga-nai | Bunpro はずがない (N4); JT4Y (N4) | 141784, 11692639, 81586, own | |
| g:yotei-da | Bunpro 予定だ (N4); JT4Y (N4) | own ×3 | 予 and 定 are not N5/N4 kanji, so every Tatoeba 予定 sentence fails the kanji rule; written よてい |

Rejected (block 4):

| point | ids | why |
|---|---|---|
| sou-da-looks | 190685, 172764 | 一雨きそう: idiom, "The sky looks threatening" doesn't teach the form |
| sou-da-looks | 3496750, 10840700 | そうにない (negative), harder |
| sou-da-looks | 227604 | 死にそう "starving": hyperbole |
| sou-da-looks | 225503 | これない (ら抜き potential) + hearsay そうだ, mistranslated ("can't work") |
| mitai | 182711, 8584149, 10901740 … | 〜たい after a ます-stem (飲みたい), not みたい "seems" (the false-hit class in inventory §(e)) |
| mitai | 11500016, 10774747 | 〜てみたい "want to try" |
| mitai | 11178753 | バカみたい: rude |
| you-da | 10987703 | てくれたようだ: てくれる is block 6 |
| you-da | 84046 | てきた (block 7) |
| no-you-na | 6849888, 9941529, 199250, 8960497 | そのように / このように / どのように (demonstrative ように, not N + のように); 9941529 reads 行 as おこな |
| no-you-na | 141734, 9042091 | potential 話せる (block 5) |
| no-you-na | 10643617 | かのような (N2) |
| sou-da-hearsay | 10112354 | 入院中: fine, kept 1594278 for the plain-past form |
| sou-da-hearsay | 137744 | ダム + できる "be built": extra vocabulary |
| sou-da-hearsay | 3465083 | furigana reads 日本 as にっぽん |
| sou-da-hearsay | 145169 | 自白: above N4 |
| kamo-shirenai | 8671055, 11960427 | potential 会えない / 歩けない (block 5) |
| kamo-shirenai | 125982 | ことになる (N3) |
| kamo-shirenai | 189820 | たら (block 9) |
| hazu | 3488056 | ておいた (block 7) |
| hazu | 3552032, 8659814 | なさい / ように言う (later blocks) |
| hazu | 10644050 | 見ちゃった (てしまう) + long |
| hazu-ga-nai | 218084 | であるはずがない: written copula である (N3) |
| hazu-ga-nai | 195794, 216544 | fine; 141784 covers the same shape |

## Block 5: ability

| point | sources | examples | notes |
|---|---|---|---|
| g:potential | Genki II ch.13; Bunpro "れる・られる (Potential)" (N4); JT4Y られる-1 (N4) | own ×2 (話せます, 来られます), 158343, 226787, 10903672, 220973 | `conjForm: 'potential'` (in `CONJ_FORMS`). Pattern written without kana tokens (`V-える / V-られる`) so the catalog surface check doesn't demand れる in 話せます |
| g:koto-ga-dekiru | Bunpro ことができる (N4); JT4Y (N4) | 3456433, 11013888, 10326041, own | |
| g:yasui | tanos; Genki II ch.20 | own, 206661, 9963851, 10563891 | |
| g:nikui | tanos; Genki II ch.20 | own, 221479, 8650986 | |
| g:kata | Bunpro かた (N4); JT4Y かた (N4); Genki II ch.23 "-kata" (the St. Olaf index links it under the odd slug `kara-explanation-within-sentence-genki-i-chapter-9-2`) | own, 10565932, 7427294, 2728130 | |

Rejected (block 5):

| point | ids | why |
|---|---|---|
| potential | 5254850, 1233800, 8823050, 7486159 … | regex false hits: plain る-verbs (食べる, 起きてる, 教える) |
| potential | 8572172, 83624, 188299 | 見える / 聞こえる: lexical "can see / hear", not the form |
| potential | 8753230, 9373441 | 食べれない / 食べれる: ら抜き |
| potential | 124744 | "The telephone doesn't work": 使えない in the "out of order" sense |
| potential | 1158892 | English "know how to use" for 使える: loose |
| potential | 234782, 197615 | ＶＩＳＡ / ビザカード: full-width Latin, brand |
| koto-ga-dekiru | 171076 | 出来 in kanji (ことが出来ます): kept the kana spelling the notes teach |
| koto-ga-dekiru | 203375, 1202210, 1173421 | ば / ればいいのに (block 10) |
| koto-ga-dekiru | 8587078 | 二度と + past negative, harder |
| yasui | 205185, 2733764 | し + しかも / 親しみ (above N4) |
| yasui | 12146494 | みやすかった written in kana, and 思ってたより |
| nikui | 12047477 | its only English, "This handwriting is illegible", doesn't show にくい |
| nikui | 84054 | にくかった: fine, but the pattern token にくい isn't visible in the past form |
| nikui | 9752009 | って + んだ: two extra points |
| kata | 11571060, 10006820, 177865 … | 方 read ほう (ほうがいい), not かた |
| kata | 11029760 | なんだよその言い方は: rude |
| kata | 2311993 | お母さま + そっくり: above N4 |

## Block 6: giving and receiving favours

| point | sources | examples | notes |
|---|---|---|---|
| g:te-ageru | tanos; Genki II ch.16 | own, 8586214, 1233763, 9891143 | `v:あげる|あげる` (N4 "give"), not `上げる` "raise" |
| g:te-kureru | tanos; Genki II ch.16 | own, 9037336, 10642319, 123567 | |
| g:te-morau | tanos; Genki II ch.16 | own, 10982438, 227939, 11053931 | |
| g:te-kurete-arigatou | tanos; Genki II ch.19 | 8579832, 167138, 8619684, own | own = moving-house scene (inventory topic) |
| g:te-itadakemasen-ka | tanos; Genki II ch.16 | 146797, 201800, 148943, own | every example lists `g:potential` (いただける) |
| g:te-sumimasen | tanos; Genki II ch.16 | own ×2 (なってすみません, なくてすみませんでした), 11871026, 10193298 | pattern also carries 〜てごめん (casual) |
| g:te-yokatta | tanos; Genki II ch.19 | own, 11935865, 11924394, 11481787 | |

Rejected (block 6):

| point | ids | why |
|---|---|---|
| te-ageru | 137941, 175189 | two-word fragments; 見せてあげる (fine, but 見せる is the harder verb) |
| te-ageru | 1442737, 10906789, 12925964, 1233404 | volitional あげよう (block 11) |
| te-ageru | 9422944 | してきてあげる: てくる + てあげる stacked |
| te-ageru | 8630796 | たら (block 9) |
| te-kureru | 11795481, 3459165 … | casual question requests with さ / かな; kept plainer ones |
| te-kureru | 164478 | causative やらせて (block 13) |
| te-kureru | 9049823 | money request, casual; kept plainer ones |
| te-morau | 233721, 3459166, 161765 | てもらいたい: wish form, harder than the plain past |
| te-morau | 190688 | ないでもらいたい + ばかにする |
| te-morau | 9076386 | 千円 + いとこ + んだ: fine, kept shorter ones |
| te-morau | 190892 | non-native; ほうがいい + 見てもらう "see a doctor" idiom |
| te-kurete-arigatou | 4478302 | 待っててくれて: contracted ている inside |
| te-kurete-arigatou | 3483634 | 生まれてきてくれて: stacked てくる |
| te-itadakemasen-ka | 1307638 | 書きとめる: above N4 |
| te-itadakemasen-ka | 10229716 | たら (block 9) |
| te-sumimasen | 137945, 3024841, 11859303 | causative 待たせて / がっかりさせて (block 13) |
| te-sumimasen | 125967, 125944 | お待たせして: humble + causative |
| te-sumimasen | 3158402 | 言いすぎて: fine, but the ごめん examples were capped at one |
| te-sumimasen | 13978190 | ungrammatical ("あなたはそれを見てごめんなさい"), no native author |
| te-yokatta | 9700747, 11903894, 3700072, 161805 | potential 会えて / なれて / できて (fine after block 5, kept plain verbs) |
| te-yokatta | 142841, 10216423 | 生きててよかった: emotional, contracted ている |
| te-yokatta | 3710328 | でよかったら (conditional) |

## Block 7: aspect

| point | sources | examples | notes |
|---|---|---|---|
| g:jidoushi-tadoushi | JT4Y "Transitive & Intransitive Verbs" (N4); Genki II ch.18 | own (ドアが開きました), 13356118 (ドアを開けました), own ×2 (始まる / 始める), 11253962 | pattern written without kana tokens (`Vi / Vt`) |
| g:te-aru | tanos; Genki II ch.21 | own ×2, 10901490, 10286281 | |
| g:te-oku | tanos; Genki II ch.15 | own, 173470, 9930912, 79947 | |
| g:te-shimau | tanos; Genki II ch.18 | own ×2 (regret / completion), 198118, 84418, 8933304 (ちゃう) | |
| g:te-miru | tanos; Genki II ch.13 | own, 8098712, 3509628, 10032516 | |
| g:te-iku | Bunpro ていく (N4); JT4Y (N4) | own, 10983063, 152713, own (change) | |
| g:te-kuru | Bunpro てくる (N4); JT4Y (N4) | own, 11527664, 8866569, 8588370 | pattern lists てきた / てきま too, so the catalog surface check finds past forms |
| g:stem-compounds | Bunpro はじめる / おわる / つづける (N4); JT4Y 出す (N4) | own (ふりつづけました), 4359202, 11340615, 160640 | Tanos puts 始める at N3 (in the item's offList); 続 is not an N5/N4 kanji, so つづける is kana. No 出す example: the pattern token 出す can't be seen in 走り出した, and the 出す sentences were N3-flavoured |

Rejected (block 7):

| point | ids | why |
|---|---|---|
| jidoushi-tadoushi | 201907, 8888550 | furigana reads 開 as ひら (correct, but the pair being taught is あく / あける) |
| jidoushi-tadoushi | 201791, 225247, 201804 | なさい / な prohibitive / っぱなし (later or N3) |
| jidoushi-tadoushi | 10624576 | ようやく: above N4 |
| te-aru | 172454, 10901691, 226359 … | である (written copula), the false-hit class in inventory §(e) |
| te-aru | 10661662, 10673322 … | って + ある (topic って), not てある |
| te-aru | 650763 | 用意してあります: fine; 用意 is not N4 vocabulary |
| te-aru | 3598306 | 話を通す: idiom |
| te-oku | 1452344, 8579886, 2409468 | べき (N3) |
| te-oku | 137244, 164193 | てやろう / ほっておいてくれ: rough register |
| te-oku | 201798, 81649 | なさい (block 12) |
| te-oku | 9180386 | 注文: not N4 vocabulary (kept 9930912) |
| te-shimau | 8322766, 8971922, 10079733 | 死んじゃう (dark), kept neutral ones |
| te-shimau | 10699230, 11320559, 10705156 | すぎちゃった: two points at once |
| te-shimau | 11244515 | 待ちくたびれる: above N4 |
| te-miru | 1503524, 2249872, 151146 | 試す: 試 is N4 kanji but 試す is not N4 vocabulary |
| te-miru | 3496837, 9964557, 195805 | volitional てみよう (block 11) |
| te-miru | 10157889, 174753 | てみたら (block 9) |
| te-iku | 789580, 13115757, 10335458 … | 行く as a full verb, not 〜ていく |
| te-iku | 5748445, 11559638 | 死んでいく: dark |
| te-iku | 203675 | 上っていった: 上る keyed 上る|あがる in the N4 list but read のぼ here |
| te-kuru | 176436, 79116, 9969155 … | できた (できる), not てくる |
| te-kuru | 8588374 | 夜が明けて: 明ける not N4 vocabulary, and 夜 read よ |
| te-kuru | 124391 | 近づく: not N4 vocabulary |
| te-kuru | 180534 | でてきた written in kana for 出て |
| stem-compounds | 9529638 | 走り出した: fine, but the pattern token 出す isn't visible (see above) |
| stem-compounds | 11875851, 11898239 | イライラし始めた: onomatopoeia |
| stem-compounds | 234698, 234746, 7577131 | 思い出す: lexical compound "remember", not 〜出す "start" |
| stem-compounds | 11065669, 11065667 | たところ / たばかり (later / N3) |

## Block 8: time and sequence

| point | sources | examples | notes |
|---|---|---|---|
| g:ato-de | Bunpro あとで (N4); JT4Y 後で (N4) | own ×2, 10914867, 3024537 | every Tatoeba た後で sentence failed the kanji filter (宿, 授, 続, 付…): own sentences carry the た後で / の後で forms; Tatoeba ones show 後で "later" |
| g:made-ni | Bunpro までに (N4); JT4Y までに (N4) | own ×2, 232004, 175607 | own #2 contrasts まで / までに in one sentence |
| g:goro | Bunpro ごろ (N4); JT4Y ごろ / ころ (N4) | own, 187461, 11241491, 1751953 | 頃 above N4, so ごろ in kana |
| g:ni-frequency | tanos; Genki II ch.13 | own, 1174310, 1085893, 9200773 | 回 is not N5/N4 kanji: every example uses 度 |
| g:nagara | tanos; Genki II ch.18 | own, 11765971, 81619, 166551 | |
| g:te-iru-aida-ni | tanos; Genki II ch.21 | own ×2, 8720976, 338061 | no clean Tatoeba ている間に (all hits had 眠, 寝, 彼, 洗濯, 財布…); the two Tatoeba picks are N の間に |
| g:tokoro-da | Bunpro るところだ / ているところだ / たところだ (N4); JT4Y ところ (N4) | own, 157026, 172862, 203585 | one example each for る / ている / た + ところ |

Rejected (block 8):

| point | ids | why |
|---|---|---|
| ato-de | 195443, 9699354, 11724541 | また後で / じゃあ、また後で: set farewells, kept 10914867 / 3024537 which have a verb |
| ato-de | 9777026 | どうかしら (block 14) |
| ato-de | 10640695 | 後に, not 後で |
| ato-de | 201964, 169135, 9966336, 10489424 | kanji above N4 (宿, 杯, 続, 授) |
| made-ni | 4260187, 171833, 9651101 | ここまでにする "call it a day": idiom |
| made-ni | 172598, 84584, 8569448, 232061 … | 今までに "until now / ever": a different sense |
| made-ni | 150563, 10798137 | potential + そう / 仕上げる: harder |
| made-ni | 9961185, 9474752 | やっといて / 出さなきゃ: contracted forms |
| made-ni | 159847 | なければならない (block 12) |
| goro | 201716, 179858, 179860, 223752 | 近ごろ / このごろ "these days": vocabulary, not the point |
| goro | 223236, 223112 | 食べごろ "ripe": compound noun |
| goro | 1577997 | English "Tanaka has said…" loose, author not native; replaced by 1751953 |
| goro | 79088 | 夕食 is not N5/N4 vocabulary |
| ni-frequency | 10138301, 151369, 1174311, 126597 … | 回 not N5/N4 kanji |
| ni-frequency | 11994172, 11178869, 8855487, 1592955 | 髪, 床, 美容, 両 / 訪 above N4 |
| ni-frequency | 2435147 | 一度しか…ない (block 13 point) |
| ni-frequency | 10138297 | やってる, kept the polite / clearer ones |
| nagara | 11032270 | がっかりしながら: manner adverb + する |
| nagara | 11009755 | 話しちゃダメ (casual prohibition) |
| nagara | 11029781 | ながら "although" (といいながら): the N2 sense |
| nagara | 10762828 | ズルズル + なさい: long, onomatopoeia |
| nagara | 2357401 | 生まれながら "born": idiom |
| nagara | 12604573, 404561 | non-native authors; kept native ones |
| te-iru-aida-ni | 202925, 11013762 | 間に合う "be in time": lexical |
| te-iru-aida-ni | 2456852, 1772533, 3321099 | 間 "between" |
| te-iru-aida-ni | 228807, 11390402, 12319819 | いつの間にか / あっという間に: set phrases |
| te-iru-aida-ni | 79723 | 起こる is not N5/N4 vocabulary |
| tokoro-da | 179557, 184502, 3419652 | てきたところ: kept the plain た + ところ |
| tokoro-da | 224704 | ところ "place" (生まれたところ) |
| tokoro-da | 10774565, 8816917 | contracted てる / てた |
| tokoro-da | 198112, 202891, 3449200 | 出発 / 昼食 / 朝食 (昼食 / 朝食 not N5/N4 vocabulary); 198112 fine but kept shorter ones |
| tokoro-da | 10621107, 194136 | もう少しで〜ところだった "nearly": N3 use, passive |

## Block 9: conditionals I

| point | sources | examples | notes |
|---|---|---|---|
| g:to-conditional | tanos (Dictionary form+と); Genki II ch.18 | own ×2 (button, directions), 11038976, 11021414, 10932044 | |
| g:to-ii | tanos; Genki II ch.16 | own, 9809478, 10365237, 10989493, 11052418 | 11052418 shows the advice use |
| g:tara | tanos; Genki II ch.17 | own ×2, 10637887, 11284358, 889751 | |
| g:tara-dou | tanos; Genki II ch.14 | own, 146815, 194237, 189329, 9966058 | |
| g:baai-wa | Bunpro ばあいは (N4); JT4Y 場合 (N4) | own ×4 | every Tatoeba 場合 sentence fails on 合 (not N5/N4 kanji); written ばあい |

Rejected (block 9):

| point | ids | why |
|---|---|---|
| to-conditional | 205484, 10367623, 10841854 | それはそうと "by the way": set phrase |
| to-conditional | 8850419, 10761218, 11735145 | どっちかっていうと / 〜ようと "no matter": not the point |
| to-conditional | 8888417, 145174, 1166048, 171888 | によると "according to" |
| to-conditional | 10623513 | デブる: slang |
| to-conditional | 9191393 | 使っちゃう: てしまう contraction, fine but casual |
| to-conditional | 175195, 11052607, 221451, 222764 | 見下ろす / 思い出す / 時代 / 家族: harder vocabulary; 222764 fine, kept shorter |
| to-conditional | 10171350 | 見れる: ら抜き |
| to-ii | 12829888, 12829890 | English is the literal "If it's a nice story, that would be good" |
| to-ii | 889764, 12022630 | same sentence as 10365237 in casual form |
| to-ii | 183265, 183264, 9257598, 10680230 | 気に入る + てくれる / てもらえる / ていただける: two points; kept simpler |
| to-ii | 202862 | ちょっといいですか: no といい |
| to-ii | 11029781 | といいながら: と言い "saying" |
| tara | 9511530, 10230333, 10230334, 11172863 | 私だったら "if I were you": fine, kept verb examples |
| tara | 10129683 | 不味 not N5/N4 kanji |
| tara | 9946606, 11553271 | 〜ったら topic-marker (うちの子ったら): a different word |
| tara | 9309193 | 気づいてたら: counterfactual past with contracted forms |
| tara | 11052381 | imperative 電話しろ (block 12) |
| tara | 229358 | volitional あげよう (block 11) |
| tara | 11623783 | そんなに (block 12) + contracted |
| tara-dou | 174753 | てみたらどうだ: てみる + rough だ |
| tara-dou | 8587017, 11991839, 8218404, 202104, 602848 | たらどうなる / どうする "what if": not a suggestion |
| tara-dou | 195338 | まともな: above N4 |
| tara-dou | 124246, 230495 | 東京 / 試 (試す not N4 vocabulary) |
| baai-wa | all 62 hits | 合 not N5/N4 kanji (also 極端, 謙遜, 緊急 …) |

## Block 10: conditionals II and concession

| point | sources | examples | notes |
|---|---|---|---|
| g:ba | tanos (～ば/～れば); Genki II ch.22 | own, 10982400, 10637878, 8856423, 10083290 | |
| g:ba-yokatta | tanos; Genki II ch.18 | own, 226211, 193252, 11436390, 2280872 | 2280872 shows the negative なければよかった |
| g:nara | tanos; Genki II ch.13 | own (すしなら), 80338, 10570281, 9440712, 12365439 | 9440712 shows なら before the action (旅行するなら) |
| g:te-mo | tanos; Genki II ch.23 | own ×2, 6015, 10119936, 1488024 | every 雨が降っても sentence fails on 降: own sentence in kana |
| g:noni | tanos; Genki II ch.21 | own ×2, 10315190, 11273472 | |

Rejected (block 10):

| point | ids | why |
|---|---|---|
| ba | 8532774 | さもなければ "otherwise": set phrase |
| ba | 9676256 | 買えば as a sentence-final suggestion |
| ba | 8625417, 10079863, 12049836 | できれば "if possible": set phrase |
| ba | 11619583 | てくれれば + のに: counterfactual, two points |
| ba | 143831, 143830, 143832, 193725 | 生きられない / 生物 / 空気: potential (fine) but heavier; kept everyday ones |
| ba | 226454 | かいつまんで: above N4 |
| ba | 10224897 | 出発: fine, kept the shorter ones |
| ba-yokatta | 2718657, 124726, 5651760, 3426557 … | 〜ばよかったのに: のに is the next point in the block; kept plain よかった |
| ba-yokatta | 3567598, 3567585 | 生まれてこなければ "I wish I'd never been born": dark |
| ba-yokatta | 11191213, 9058049 | 読んどけば / やっとけば: contracted ておく |
| ba-yokatta | 3508038 | potential 会えれば + んだけど |
| nara | 216707, 216706 | さようなら |
| nara | 8637492, 11195681, 11195673, 10624302 | imperative / prohibitive (block 12) in the same sentence |
| nara | 11193208 | volitional 行こう (block 11) |
| nara | 10198644 | あいつ + みた in kana |
| nara | 10612797 | 一人 read ひとり with split furigana and 勉強中: fine, kept others |
| nara | 10726330 | ようなら: N3 |
| te-mo | 12437529, 12437526, 9928583, 10811094 | いつでも / 何が何でも / 雨でも天気でも: でも (part A g:demo) or idioms |
| te-mo | 168061 | 聞こうとしない: ようとする (N3) |
| te-mo | 8888651, 10185217, 4214960 | としても / にしても: N3 |
| te-mo | 11015493 | 長持ち, フライパン: kept shorter |
| te-mo | 203543 | たとえ…終わらせる: causative (block 13) |
| te-mo | 10206640, 10984937, 203522 … | 降 not N5/N4 kanji |
| te-mo | 1075736, 1075748 | 寒 / 暑 not N5/N4 kanji |
| noni | 4870338 | 見ろってのに: imperative + って |
| noni | 11634051, 187154, 4812, 171537 … | sentence-final 〜ばいいのに / たらいいのに "I wish": a different use (named in the notes) |
| noni | 11015497, 10938285, 9963828, 10899828 … | 面, 笑, 忘, 邪, 髪 above N4 |
| noni | 12018810, 10899650, 9525252 | のに "in order to" (N3 sense) |
| noni | 1167783 | 仕方がない + のような気がする: long |

## Block 11: intention and decision

| point | sources | examples | notes |
|---|---|---|---|
| g:volitional | tanos (～よう + ～おう); Genki II ch.15; JT4Y "Volitional Form of Verbs" (N4) | own, 124815, 188264, 11070916, 228664, 124669 | `conjForm: 'volitional'` (in `CONJ_FORMS`); 228664 = 〜ようか, 124669 = "I'll" |
| g:you-to-omou | Bunpro 〜ようと思う・〜おうと思う (N4); JT4Y ようと思う (N4); Genki II ch.15 | own, 184819, 193297, 11021427, 10868206 | |
| g:koto-ni-suru | tanos; Genki II ch.23 | own, 156129, 11852556 (negative), 8808582, 9826890 | japanesetest4you files ことにする under N3; Tanos sets N4 |

Rejected (block 11):

| point | ids | why |
|---|---|---|
| volitional | 12146654, 190670 | 一服 / 一休み: 服 fine but 一服 = smoking |
| volitional | 81576, 179791, 9489134 | 本題 / 近道 / 昼食: not N5/N4 vocabulary |
| volitional | 226826 | お昼にしよう: にする "decide on" (another use) |
| volitional | 3496835, 2249872, 9964557 | てみよう: two points (A's てみる); fine but kept bare forms |
| volitional | 3401026 | ありがとう: regex false hit |
| volitional | 9564592, 198544 | 楽しくいこう / のんびり行こう: idiomatic English |
| volitional | 10038112 | 手つなごう: dropped particle |
| you-to-omou | 889759, 9312464, 4770, 2140557 | だろうと思う "I thought that would be the case": でしょう, not volitional |
| you-to-omou | 10979962 | 行 read おこな |
| you-to-omou | 12453516, 12453517 | 待っとこう / 待ってよう: contracted |
| you-to-omou | 3577254, 3218947, 12012587 | なんで…と思ったの: "why did you decide"; past + question, harder |
| you-to-omou | 10905974 | 〜ようと思えば: conditional, N3 |
| you-to-omou | 980703 | 東京, 行ってこよう: fine but longer |
| koto-ni-suru | 9725229, 11286403, 2780711, 12505202 | なかったことにする "pretend it didn't happen": idiom |
| koto-ni-suru | 152735, 152252 | ことにしている (habit): named in the notes, kept the decision sense |
| koto-ni-suru | 194231 | ことにしようか: volitional on top |
| koto-ni-suru | 8582186, 11940204 | 今朝することにした / こもる: unclear English / above N4 |

## Block 12: obligation, permission, orders

| point | sources | examples | notes |
|---|---|---|---|
| g:nakereba-naranai | Bunpro なければならない + なければいけない (N4); JT4Y なければならない (N4) | own, 121503, 188838 (past), 80523 (いけません), 5185663 | |
| g:nakute-mo-ii | tanos; Genki II ch.17 | own, 8732421, 3023061, 182548, 10124146 | |
| g:nai-de | tanos; Genki II ch.20 | own ×2, 156631, 9993257 | taught as "without / instead of"; the "don't" request is N5 ないでください |
| g:nasai | tanos; Genki II ch.22 | own, 182972, 83322, 79943, 192757 | |
| g:imperative | Bunpro 命令形 (N4); Tae Kim "Making Requests" (command form) | own ×2 (sign, がんばれ), 4443360, 140535, 184886, 195365 | form point; no `conjForm` (not in `CONJ_FORMS`) |
| g:na-prohibitive | jlptsensei (name, N4); Bunpro な (N5); Tae Kim "Making Requests" (negative command) | own (sign), 224594, 5072721, 164115, 10903600 | |
| g:hitsuyou | Bunpro がひつよう + ひつようがある (N4); JT4Y 必要がある (N4) | own ×4 | 必 / 要 not N5/N4 kanji: every Tatoeba 必要 sentence fails; written ひつよう |
| g:ku-ni-suru | tanos (～く/ ～にする); Genki II ch.21 "Adjective + suru" | own, 194079, 202004, 229511 | |
| g:amari-nai | Bunpro あまり～ない (N4); JT4Y あまり～ない + 全然～ない (N4) | own ×2 (one ぜんぜん), 12957013, 230324, 9695689 | 全 / 然 not N5/N4 kanji: ぜんぜん in kana, own sentence only. Also resolves part A's 230329 `g:amari-nai` |
| g:sonna-ni | Bunpro そんなに (N4); JT4Y そんなに (N4) | own, 12312123, 4855, 11741527 (こんなに) | |

Rejected (block 12):

| point | ids | why |
|---|---|---|
| nakereba-naranai | 172934, 122085, 9124369 | questions (しなければいけませんか): kept statements; 入院 not N5/N4 |
| nakereba-naranai | 122202, 195121 | 中止: not N5/N4 vocabulary |
| nakereba-naranai | 9039532, 187604 | 見つける / すべき (N3) |
| nakereba-naranai | 157550, 157849, 152611 | 〜なければならないんです: fine, kept plain ones |
| nakute-mo-ii | 8797647, 8969396, 9807660 | fine; kept a spread of verbs (行く, 来る, 急ぐ) |
| nakute-mo-ii | 122086, 10769559, 126388 | 入院 / 早起き / 昼食: not N5/N4 vocabulary |
| nakute-mo-ii | 10144719 | 言われた (passive, block 13) |
| nakute-mo-ii | 173398, 9188867 | ば / なら + なくてもいい: two conditionals |
| nai-de | 123792, 3480350, 11571073, 10006825 … | ないで！ "don't!": the N5 request use, not "without" |
| nai-de | 2275758, 164836, 194187, 83636 | 〜ないでくれ: rough request |
| nai-de | 4213315, 3555810, 206619 | ないでしょう (regex false hit) |
| nai-de | 10560242, 10924296 | しかない "no choice but" (N3) |
| nai-de | 202695 | ないでおけば: long, ておく + ば |
| nasai | 227342 | お帰りなさい: set greeting |
| nasai | 78855, 10489023 | 用心 / 自重: above N4 |
| nasai | 7430536, 7430537, 8591157 | 歌い始め / 食べ終え: compound + なさい, kept bare |
| nasai | 1516320 | 帰ってきなさい: てくる on top |
| imperative | 147770, 200699, 1296640 | 出て行け / どっか行け / あっちへ行け: very rude |
| imperative | 216745 | ざまあ見ろ: insult |
| imperative | 188235 | English "See below" (instructions sense) |
| imperative | 187788, 10908731 | 何とかしろ / よく聞け: rough; kept neutral ones |
| imperative | 182975 | 病院に行けよ: fine; kept the shorter / sign-like ones |
| na-prohibitive | 3488277, 11041774, 650692 | 動くな: 動く not N5/N4 vocabulary |
| na-prohibitive | 3488162, 186751 | 近づく: not N5/N4 vocabulary |
| na-prohibitive | 81627 | 開 read ひら (N4 keyed あく) |
| na-prohibitive | 183270, 11204835, 11369150 | 気にするな / 口答え / せがむ: idiom or above N4 |
| na-prohibitive | 3607442 | あるな: sentence-final な "huh" (the false-hit class) |
| ku-ni-suru | 11195155, 177416, 226826, 11870719 … | 何にする / お昼にしよう "decide on" |
| ku-ni-suru | 183270, 137434, 5321 | 気にする / 大切にする / 大事にする: lexical |
| ku-ni-suru | 9958300, 11310782 | 一人にして "leave me alone": idiom |
| ku-ni-suru | 194093 | fine (小さく); kept 194079 + 202004 for 大きく |
| amari-nai | 5157 | English "I see it rarely" is loose |
| amari-nai | 10336896 | 話しない: ungrammatical-looking variant of 10336897 |
| amari-nai | 5748802, 2244824 | potential / できません: fine, kept plain verbs |
| amari-nai | 197662 | ないで request (N5) on top |
| amari-nai (ぜんぜん) | all 150 hits | 全 / 然 not N5/N4 kanji |
| sonna-ni | 9116055, 10657609 | 〜ないの！ as a command: harder reading |
| sonna-ni | 11041763 | 急かす: above N4 |
| sonna-ni | 164675, 236739 | potential 出せない + 金 "money" without お |
| sonna-ni | 11344081 | 食べれません: ら抜き |
| sonna-ni | 3717898 | 上手 read うま |

## Block 13: voice

| point | sources | examples | notes |
|---|---|---|---|
| g:passive | tanos (～られる, read as passive per inventory); Genki II ch.21; JT4Y られる-2 (N4) | own ×2 (suffering: 足をふまれた, にっきを読まれた), 13569023, 12018756 | `conjForm: 'passive'` |
| g:causative | tanos; Genki II ch.22; JT4Y させる (N4) | own ×2, 138033, 146817 (させてください), 8726978, 2105551 | `conjForm: 'causative'` |
| g:causative-passive | tanos; Genki II ch.23; JT4Y させられる (N4) | own ×2, 155026 (待たされた), 11846442 (食べさせられた), 225374 (読まされた) | no `conjForm` (not in `CONJ_FORMS`) |
| g:shika-nai | tanos; Genki II ch.14; JT4Y しか～ない (N4) | own, 11102012, 12882301, 155443, 9748980 | |
| g:number-mo | tanos (Number+も); Genki II ch.14 | own, 10658921, 12296733, 10986145, 2113607 (何時間も) | |
| g:to-iwarete-iru | Bunpro といわれている (N4); JT4Y と言われている page (titled N4, though absent from its N4 index) | own ×3 | optional point (inventory); every Tatoeba hit failed the kanji filter (彼, 喫煙, 健康 …) |

Rejected (block 13):

| point | ids | why |
|---|---|---|
| passive | 167556, 3782777, 3700072, 155008 … | なれた / なれる: potential of なる |
| passive | 11516182, 3122652, 9634547 | 生まれた: lexical |
| passive | 233795, 195505, 9069403 … | お目にかかれて: humble potential (N3 keigo) |
| passive | 9697204 | されてます: honorific, not passive |
| passive | 210972, 9025240 | ひかれる "be run over": 轢く not N5/N4 vocabulary |
| passive | 186646 | 国会 + 開 read ひら |
| passive | 3347244 | バカって言われた: rude word, って |
| passive | 141442, 192607 | によって + 発見 / 発明: written style |
| passive | 122725 | について (N3 pattern); picked first, dropped |
| passive | 232640 | ように言われた: ように (N3) |
| causative | 8505462 | 使いこなせる: false hit |
| causative | 3507452, 127098, 164343 | 知らせる: lexical verb |
| causative | 12700843 | まかせる: lexical |
| causative | 137945, 11001449, 10602871 | 待たせてごめん: casual apology set phrase (part A also skipped it) |
| causative | 3488654 | 死なせてくれ: dark |
| causative | 172906 | はなせません: potential |
| causative | 164478, 3506608 | やらせて: やる register |
| causative | 10654641 | 終わらせたい: fine, kept others |
| causative-passive | 184837, 203323, 160373 | だまされる: passive of だます, not causative-passive |
| causative-passive | 175179, 160401 | ハラハラ / 心を動かされた "be moved": idiom |
| causative-passive | 12057535, 123719 | 以上 / たびたび: longer |
| causative-passive | 189974 | 飲まされた alone, no context |
| shika-nai | 216202, 2040871, 9853679 … | しかと / 話しかける: false hits |
| shika-nai | 79351 | 友人 not N5/N4 vocabulary |
| shika-nai | 11839587, 10545686, 10880186, 3597465 | potential + しか: fine, kept plain verbs |
| shika-nai | 12268047, 12041773 … | コーシャ / ハラル: vocabulary |
| shika-nai | 10901653, 11001315 | としか言いようがない: idiom |
| number-mo | 10283937, 11526984, 10283939 | 何年もの "vintage": a different word |
| number-mo | 11857921 | はず (part A) + 何度も: fine, kept others |
| number-mo | 84639, 1051678, 11572952 | 一度も〜ない "not even once": named in notes, kept the "as many as" sense |
| number-mo | 10917092 | スマホ: slang |
| number-mo | 211416 | 何百年も + passive 建てられた: two points |
| to-iwarete-iru | all 36 hits | kanji above N4 (彼, 億, 喫煙, 健康, 美, 街 …) |

## Block 14: keigo and casual endings

| point | sources | examples | notes |
|---|---|---|---|
| g:sonkeigo-verbs | Bunpro いらっしゃる + なさる (N4); JT4Y いらっしゃる (N4); Genki II ch.19 | own ×2 (いらっしゃいます, めしあがって), 4805143, 226566 (おっしゃいます), 202257 (なさいます), 228622 | 召 not N5/N4 kanji: めしあがる in kana; ごらんになる named in formation only |
| g:o-ni-naru | Bunpro お～になる (N4); JT4Y お～になる (N4) | own, 4913, 198421, 3357887, 9546334 | |
| g:o-kudasai | Bunpro お～ください (N4); JT4Y (N4); Genki II ch.19 | own, 8886169, 10282137, 223201, 228854 (お電話ください) | |
| g:o-suru | Bunpro お〜する (N4); Genki II ch.20 | own, 226244, 10612520, 174354, 10838340 | no japanesetest4you page for お〜する |
| g:itasu | Bunpro いたす (N4); JT4Y いたす (N4); Genki II ch.20 | own (もうします), 10982402, 174355, 214978 (まいります), 80604 | 申 / 参 not N5/N4 kanji: kana |
| g:gozaimasu | Bunpro ございます + でございます (N4); JT4Y both (N4) | own ×2, 214063, 229205, 1336459 | |
| g:ja-nai-ka | Bunpro じゃないか (N4); JT4Y (N4) | own, 228724, 4717937, 9112549 (じゃん), 3507456 (volitional + じゃないか) | |
| g:kana-kashira | Bunpro かな + かしら (N4); JT4Y both (N4) | own, 9854115, 10528638, 11162294 (かしら), 229506 (のかしら) | |
| g:ka-dou-ka | tanos; Genki II ch.20 "Questions within larger sentences"; JT4Y かどうか (N4) | own ×2, 215673, 10187698, 171171, 9964050 | see "Inventory gap" |
| g:kai | Bunpro かい (N4); JT4Y かい (N4) | own, 213775, 194166, 4970 | recognition-level point (inventory: low priority) |

Rejected (block 14):

| point | ids | why |
|---|---|---|
| sonkeigo-verbs | 8580579 | おっしゃい！ imperative |
| sonkeigo-verbs | 4651964, 227633 | おっしゃる通り / 意味: fine, kept the name question |
| sonkeigo-verbs | 11368327 | 試着: above N4 |
| sonkeigo-verbs | 141788, 10657500 | 先生がいらっしゃったよ / わ: fine; casual endings with keigo, kept polite ones |
| sonkeigo-verbs | 226843, 3565368, 192863 | いらっしゃい "come (here)!": imperative-like |
| sonkeigo-verbs | 9474633 | 親族: above N4 |
| sonkeigo-verbs | 187552, 225665 | 召し上がる: 召 not N5/N4 kanji (own sentence in kana instead) |
| o-ni-naru | 226998, 226997, 228450 … | お世話になる: set phrase |
| o-ni-naru | 9702647, 9702631 | お金持ちになる: お + noun + になる (false hit) |
| o-ni-naru | 224669 | ほうがよいのでは: harder |
| o-ni-naru | 215602 | 方 read ほう for かた (wrong furigana) |
| o-ni-naru | 3474788, 3597359 | どなたか / お話になる (送り仮名 missing) |
| o-kudasai | 217056, 11258173, 3598250 | ご注目 / ご注意 (ご + noun): kept お + ます-stem examples, plus one お + noun (お電話) |
| o-kudasai | 10075145 | 試す not N5/N4 vocabulary |
| o-kudasai | 3878001 | 足元: not N5/N4 vocabulary |
| o-kudasai | 2271255 | おかけになって + お待ちください: two keigo forms |
| o-suru | 234458, 234299 | 明日 read あす; お話します spelling |
| o-suru | 195516, 10068166, 179914 … | お会いしましょう: fine, but very frequent set phrase; kept others |
| o-suru | 12022957, 3024539 | お見せいたしましょう / 後ほど (後 read のち) |
| o-suru | 4909219 | 注ぐ: above N4 |
| o-suru | 13083041, 12023885 | いたしかねます: N2 |
| itasu | 408295, 5278, 4705664 … | どういたしまして: set phrase |
| itasu | 9689439, 126007 | お待たせいたしました: causative + humble |
| itasu | 126195, 227404 | 何時にいたしますか / どういたしますか: いたす about the customer's choice (shop usage), fine but harder |
| itasu | 80525 | 明日 read あす |
| itasu | 191217 | 以後: not N5/N4 vocabulary |
| gozaimasu | 10880249, 12462042 | ご入用 / イスラム: above N4 |
| gozaimasu | 5955969 | とんでもございません: set phrase |
| gozaimasu | 1771925 | ＸＬ, あいにく: longer |
| gozaimasu | 347297, 2113397 | non-native authors (1336459 kept, also non-native: see UNSURE) |
| ja-nai-ka | 229343 | English "He seems like quite a find" is loose; replaced by 4717937 |
| ja-nai-ka | 10465499, 12134189 | お前: rough register |
| ja-nai-ka | 10140664 | じゃないから: plain negative, not the point |
| ja-nai-ka | 10780343, 189637, 12561924, 9316490 | んじゃないかな "I think maybe": a guess (named in notes) |
| ja-nai-ka | 205819 | 元も子もない: idiom |
| ja-nai-ka | 11263273, 11017768, 10996711 | mixed punctuation / slang (キレる, やってん) |
| kana-kashira | 11724537, 9250697 | potential 行ける / 会える + かな: fine, kept plain |
| kana-kashira | 3459165, 9178125 | 〜てくれないかな request: named in notes |
| kana-kashira | 10913682, 11063168, 12296518 | いいかな "is it OK?": permission sense |
| kana-kashira | 10648569 | 試着室: above N4 |
| kana-kashira | 150563 | そうかな + 着ける potential |
| kai | 11311195, 999701 | でかい "big": false hit |
| kai | 9851622 | 一人 read ひとり split: fine but very short |
| kai | 169101 | 上手 read うま |
| kai | 1929040 | causative + もしかして, long |
| ka-dou-ka | 12453436 | ＯＫ (Latin) |
| ka-dou-ka | 10227919 | 開けれる: ら抜き |
| ka-dou-ka | 10187695 | 同意: above N4 |
| ka-dou-ka | 222224 | 計画: fine, kept shorter |
| ka-dou-ka | 1615358, 3474822, 11563345 | potential 話せる: fine, kept one potential example (171171) |

## Conjugation forms and conjugate()

Part A:

- `g:potential` carries `conjForm: 'potential'` (it is in `CONJ_FORMS`).
- No other part-A point is a conjugation form that `conjugate()` lacks. Part-A points built on forms that are **not** in
  `conjugate()`: none of the A points needs ば / たら / imperative / causative-passive. (`g:te-adj-noun` and `g:nakute` are
  adjective / negative て-forms: `conjugate()` has no adjective forms and no なくて; they carry no `conjForm`. For a form quiz,
  conjugate() needs an `adj-te` form (い → くて, な-adj → で) and a `なくて` form.)

Part B:

- `conjForm` set: `g:volitional` ('volitional'), `g:passive` ('passive'), `g:causative` ('causative') — all in `CONJ_FORMS`.
- **Missing from `conjugate()`:** `g:ba` (ば-form), `g:tara` (たら), `g:imperative` (命令形), `g:causative-passive`
  (使役受身). They are written without `conjForm`; once conjugate() gains these forms, set `conjForm` on these four.
  Also built on missing forms, no `conjForm` needed but quizzes would benefit: `g:ba-yokatta`, `g:nakereba-naranai`
  (ば-form), `g:tara-dou` (たら), `g:nakute-mo-ii` (なくて, as in part A's note), `g:na-prohibitive` (dictionary + な: the
  dictionary form exists, so it could be quizzed today).
- `conjugate()` has a quirk worth knowing for the causative-passive: う-verbs usually take the short される form
  (飲まされる), which is not just causative + passive stacked.

## Examples that lean on other points

The teaching-order filter will hide these examples until the later point is taught; each point still has ≥3 examples
without them: 11619795 (それでも + てみる, block 7), 230329 (ようだ + あまり〜ない, block 12, part B),
the three ていただけませんか Tatoeba sentences + own (potential, block 5, earlier than block 6: fine).

None of part B's examples needs a point taught after its own block. Earlier points they rely on (all listed in `uses`):
part A's potential (10365237, 171171), てみる (9440712, 9964050), てくる (226211), てある (own imperative / な signs),
って (11241491, 4717937), みたい (11273472); part B's own earlier points: ato-de (10612520, 174354, 174355), tara
(9993257), nasai (229511), volitional (3507456, 9964050), causative + passive (causative-passive examples), passive
(to-iwarete-iru examples).

## Open questions

Part A:

- `g:te-hoshii` ref `～のようてほしい`: Tanos's garbled name, read as てほしい (inventory flag). The item itself is
  confirmed by Bunpro, JT4Y and Genki II; only the ref mapping is a judgment call. Kept `verified: true` on the item.
- `g:sore-ni`: only one independent site (Bunpro N4) confirms it; japanesetest4you has no それに page (404) and its N4
  list doesn't carry it. Sources are `'jlptsensei'` (name) + Bunpro, as N5 did for its JLPT Sensei extras.
- `g:you-da`: the japanesetest4you page slug says n3, its title and the N4 list say N4.
- Tanos `～そうです` → appearance and `そうです` → hearsay follows the inventory's mapping (the two names differ only
  by the ～).

  already in N5; check A ∪ B for duplicates when concatenating.
- 171129 (今夜は雨のようだ): its only English, "I'm afraid it'll rain tonight", is looser than ようだ.

Part B:

- `g:ka-dou-ka` placement: added to part B because no §(d) block had it (see "Inventory gap"); the plan may move it.
- `g:imperative`: level rests on Bunpro (命令形, N4) plus the need to read signs; Tae Kim confirms the form but makes no
  JLPT claim. Kept `verified: true` on two sources, as the inventory proposed; downgrade if a JLPT-level second source is required.
- `g:na-prohibitive`: Bunpro files な at N5, JLPT Sensei at N4 (so "at or below N4"); second source Tae Kim (form only).
- `g:passive` carries Tanos's ambiguous `～られる` (inventory flag: read as passive, potential is part A's `g:potential`).
- `g:koto-ni-suru`: japanesetest4you files it under N3 (its slug and list); Tanos and Genki II ch.23 put it at N4.
- `g:to-iwarete-iru`: optional; japanesetest4you's page is titled "JLPT N4" but is not on its N4 index page.
- `g:sonkeigo-verbs`: おっしゃる and めしあがる are confirmed only by the Genki II ch.19 index entry ("Honorific Verbs"),
  which does not list the verbs (inventory note); いらっしゃる / なさる have Bunpro + japanesetest4you pages.
- `g:kai`: recognition-only, low priority in the inventory; could be dropped if the load is too high.
- Non-native Tatoeba authors kept (no `authorNative`): 338061 (shiboy, 休みの間に), 1336459 (Scott, でございます), 1751953 (kino, 何時ごろ), 174355 (Ianagisacos, お電話いたします);
  each sentence was read by hand and is natural; replace if native-only is required.
- 12018756: English says "My doctor", Japanese 先生 (doctor or teacher); fine in context, noted.
- `uses` gaps forced by the catalog surface rule (see Method): する on すれば / しよう, `g:n-desu` on contracted んだ,
  `g:hou-ga-ii` on 方がいい in kanji.

## URL check

Part A: Every URL in `grammar-A.js` `sources` was fetched with curl (results in `work-A/url-check.txt`, `url-check2.txt`).
All return 200 and their titles name the point and the level: every Bunpro page title reads "(JLPT N4) | Bunpro"
except って (N5, which covers N4); every japanesetest4you page title reads "Learn JLPT N4 Grammar: …"; every St. Olaf
page title names the Genki chapter. Three first guesses were 404 and replaced: Bunpro potential → `Verb%5Bpotential%5D`
("れる・られる (Potential) (JLPT N4)"), Bunpro 方 → `かた` ("かた (JLPT N4)"), japanesetest4you それに (no page; see UNSURE).
japanesetest4you `rareru-1` is its potential page (examples are "can …").

Part B: Every URL in `grammar-B.js` `sources` (85 unique) was fetched with Node `fetch` (`work-B/urlcheck.js`, results in
`work-B/url-check-final.txt`): all 85 return 200. Every Bunpro title reads "<point> (JLPT N4) | Bunpro" except な
("な (JLPT N5)", noted above); every japanesetest4you title reads "Learn JLPT N4 Grammar: …"; every St. Olaf title names the
Genki chapter; Tae Kim's page is "Making Requests" (command form and negative command sections read). First guesses
that were 404 and replaced: japanesetest4you ようとおもう (→ learn-japanese-grammar-44), なければならない (→ -50), な
(no page; Tae Kim used instead). The St. Olaf "-mare (Genki II ch.23)" page was checked and is about 〜まで "until", not the
imperative, so it is not cited.

## Validation

Part A (`work-A/validate.js`): Checks: ids unique and not in N5 (vm load of catalog.js + data/n5/*.js + both files through `CATALOG.add`); every
grammar item N4, an inventory id, ref names exact Tanos N4 names (with `'tanos'`) or offList, ≥2 sources, ≥3 examples,
each example lists the point in `uses`, the catalog surface rule (`tests/catalog-checks.js` `surfaceMatch`, copied)
finds the pattern in every example, every `hl` regex matches ≥1 example; every sentence N4, ≤30 chars, furigana ↔ jp ↔
reading consistent, no kanji outside ruby, every kanji N5/N4 and listed as `k:`, every `uses` id exists (grammar: catalog
or inventory; `v:` in the N5 catalog or the N4 keys files; `k:` in the N5/N4 lists) and passes the surface rule, chunks
concatenate / distinct / no punctuation / don't cut ruby, Tatoeba text + author + license + enId + enAuthor + enLicense
equal the jsonl, no bad tags.

Final summary:

```
no errors
WARNINGS
s:tatoeba:230329: uses part-B id g:amari-nai (not checked)
SUMMARY: 50 grammar points (24 Tanos, 26 offList), 199 sentences (136 Tatoeba, 63 own), 21 chunk sets, 0 errors, 1 warnings
```

Part B (`work-B/validate.js`): Checks are part A's (above) with part A loaded first: catalog.js + data/n5/* + grammar-A.js +
sentences-A.js + part B through `CATALOG.add` (a repeated id fails the load); every B grammar item N4, an inventory id,
in blocks 8-14 (or `g:ka-dou-ka`), exact Tanos ref names with `'tanos'` or offList, ≥2 sources, ≥3 examples listing the
point in `uses`, surface rule finds the pattern in every example, every `hl` matches ≥1 example; every sentence N4, ≤30
chars, furigana ↔ jp ↔ reading consistent, no kanji outside ruby, every kanji N5/N4 and in `uses`, every `uses` id exists
(grammar in N5 / A / B, `v:` in the N5 catalog or N4 keys files, `k:` in the N5/N4 lists) and passes the surface rule,
chunks concatenate / distinct / no punctuation / don't cut ruby, Tatoeba text + author + license + enId + enAuthor +
enLicense equal the jsonl, no bad tags. Separately checked: A + B together cover all 50 Tanos N4 names and every §(d) id
(96 grammar items), and no `g:` id in A's or B's `uses` is unresolved.

Final summary:

```
no errors
SUMMARY: 46 grammar points (24 Tanos, 22 offList), 218 sentences (148 Tatoeba, 70 own), 25 chunk sets, 0 errors, 0 warnings
```

After concatenation: no grammar or sentence id repeats across A, B and N5 (sentence ids are global, so no N5 Tatoeba id
is reused), no Japanese text appears twice, every `examples` id resolves, and every `uses` id resolves against the
loaded catalog. Every N4 example has an untaught count of 0 against "all N5 + N4 vocabulary, kanji and grammar taught",
and every `hl` source (72 points) matches at least one of its point's examples through `dialogueGrammarRes` (lib.js).
