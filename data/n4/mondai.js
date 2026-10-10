"use strict";

// N4 exam-format items that can't be generated safely from the catalog, all written for this
// project (nothing copied from the official workbooks or any prep site):
//   iikae   言い換え類義 (文字・語彙 もんだい4): a sentence with an underlined part, choose the
//           sentence closest in meaning. options[answer] is the paraphrase; the other three
//           change the meaning (opposite, another property, another time or person).
//   youhou  用法 (文字・語彙 もんだい5, N4 and up): a word and four sentences that all contain it;
//           options[answer] uses it correctly, the other three in a wrong sense, collocation
//           or part of speech (often the sense of a near-synonym). `explain` says why.
//   bunshou 文章の文法 (文法 もんだい3): a text of 150–250 characters with numbered blanks
//           ［1］…; each blank has four options and exactly one is grammatical in context.
// `furigana` / `text` / `options` use sentence furigana ([漢字|かんじ]); `jp` (iikae) is derived
// from `furigana`, and `underline` is a substring of `jp`. Kanji: N5 + N4 only, all in ruby.
// `uses` = grammar / vocab / kanji of the right reading only (k: ids collected by script): iikae the
// sentence + its paraphrase, youhou the word + the right sentence, bunshou the text with every blank
// filled (tests/catalog-checks.js itemErrors). Distractor words are not listed.
// verified:false: one source (own).
CATALOG.add([
  // ── 言い換え類義 ──
  { id: 'm:n4-iikae-rusu', kind: 'mondai', type: 'iikae', level: 'N4', jp: '田中さんは今、るすです。',
    furigana: '[田中|たなか]さんは[今|いま]、るすです。', underline: 'るす',
    options: ['[田中|たなか]さんは[今|いま]、うちにいません。', '[田中|たなか]さんは[今|いま]、うちでねています。', '[田中|たなか]さんは[今|いま]、いそがしいです。', '[田中|たなか]さんは[今|いま]、でかけるところです。'],
    answer: 0, en: 'Mr. Tanaka is out (not at home) now.',
    names: ['田中|たなか'],
    uses: ['v:留守|るす', 'v:今|いま', 'v:うち|うち', 'v:居る|いる', 'v:さん|さん', 'k:田', 'k:中', 'k:今'], sources: ['own'], verified: false },

  { id: 'm:n4-iikae-shumi', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'わたしのしゅみは、写真をとることです。',
    furigana: 'わたしのしゅみは、[写真|しゃしん]をとることです。', underline: 'しゅみ',
    options: ['わたしのしごとは、[写真|しゃしん]をとることです。', 'わたしは、[写真|しゃしん]をとるのがへたです。', 'わたしは、[写真|しゃしん]をとるのがすきです。', 'わたしは、[写真|しゃしん]をとるのをならっています。'],
    answer: 2, en: 'My hobby is taking photos.',
    uses: ['g:koto', 'v:私|わたし', 'v:趣味|しゅみ', 'v:写真|しゃしん', 'v:撮る|とる', 'v:好き|すき', 'k:写', 'k:真'], sources: ['own'], verified: false,
    notes: 'A hobby is something you like doing; being bad at it, doing it for work or taking lessons in it are other meanings.' },

  { id: 'm:n4-iikae-chuui', kind: 'mondai', type: 'iikae', level: 'N4', jp: '先生に注意されました。',
    furigana: '[先生|せんせい]に[注意|ちゅうい]されました。', underline: '注意されました',
    options: ['[先生|せんせい]にほめられました。', '[先生|せんせい]に「[気|き]をつけなさい」と[言|い]われました。', '[先生|せんせい]におしえてもらいました。', '[先生|せんせい]にしつもんされました。'],
    answer: 1, en: 'I was warned by the teacher.',
    uses: ['g:passive', 'g:nasai', 'v:先生|せんせい', 'v:注意|ちゅうい', 'v:気|き', 'v:つける|つける', 'v:言う|いう', 'k:先', 'k:生', 'k:注', 'k:意', 'k:気', 'k:言'], sources: ['own'], verified: false },

  { id: 'm:n4-iikae-tsugou', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'あしたは、つごうが悪いです。',
    furigana: 'あしたは、つごうが[悪|わる]いです。', underline: 'つごうが悪い',
    options: ['あしたは、ひまです。', 'あしたは、[休|やす]みです。', 'あしたは、てんきがわるいです。', 'あしたは、[用事|ようじ]があります。'],
    answer: 3, en: 'Tomorrow is not convenient for me.',
    uses: ['v:明日|あした', 'v:都合|つごう', 'v:悪い|わるい', 'v:用事|ようじ', 'v:ある|ある', 'k:悪', 'k:用', 'k:事'], sources: ['own'], verified: false,
    notes: 'つごうが悪い = the time does not suit you, typically because something else is planned (用事). A day off or the weather are other situations, and ひま is the opposite.' },

  { id: 'm:n4-iikae-yushutsu', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'この会社は、車をゆしゅつしています。',
    furigana: 'この[会社|かいしゃ]は、[車|くるま]をゆしゅつしています。', underline: 'ゆしゅつしています',
    options: ['この[会社|かいしゃ]は、[車|くるま]をほかの[国|くに]からかっています。', 'この[会社|かいしゃ]は、[車|くるま]をつくっています。', 'この[会社|かいしゃ]は、[車|くるま]をほかの[国|くに]に[売|う]っています。', 'この[会社|かいしゃ]は、[車|くるま]をなおしています。'],
    answer: 2, en: 'This company exports cars.',
    uses: ['g:te-iru', 'v:この|この', 'v:会社|かいしゃ', 'v:車|くるま', 'v:輸出|ゆしゅつ', 'v:する|する', 'v:ほか|ほか', 'v:国|くに', 'v:売る|うる', 'k:会', 'k:社', 'k:車', 'k:国', 'k:売'], sources: ['own'], verified: false,
    notes: 'Exporting = selling to other countries; buying from other countries is importing (ゆにゅう).' },

  { id: 'm:n4-iikae-sukkari', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'しゅくだいは、すっかり終わりました。',
    furigana: 'しゅくだいは、すっかり[終|お]わりました。', underline: 'すっかり',
    options: ['しゅくだいは、ぜんぶ[終|お]わりました。', 'しゅくだいは、すこし[終|お]わりました。', 'しゅくだいは、はやく[終|お]わりました。', 'しゅくだいは、やっと[終|お]わりました。'],
    answer: 0, en: 'My homework is completely finished.',
    uses: ['v:宿題|しゅくだい', 'v:すっかり|すっかり', 'v:終わる|おわる', 'v:全部|ぜんぶ', 'k:終'], sources: ['own'], verified: false,
    notes: 'すっかり = completely, all of it. やっと (at last) says it took long, not that all of it is done.' },

  { id: 'm:n4-iikae-kowarete', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'このへやのテレビは、こわれています。',
    furigana: 'このへやのテレビは、こわれています。', underline: 'こわれています',
    options: ['このへやのテレビは、あたらしいです。', 'このへやのテレビは、つけてあります。', 'このへやのテレビは、おおきいです。', 'このへやのテレビは、つきません。'],
    answer: 3, en: 'The TV in this room is broken.',
    uses: ['g:te-iru', 'v:この|この', 'v:部屋|へや', 'v:テレビ|テレビ', 'v:壊れる|こわれる', 'v:点く|つく'], sources: ['own'], verified: false },

  { id: 'm:n4-iikae-hiruma', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'ひるま、兄はうちにいません。',
    furigana: 'ひるま、[兄|あに]はうちにいません。', underline: 'ひるま',
    options: ['よる、[兄|あに]はうちにいません。', '[朝|あさ]から[夕方|ゆうがた]まで、[兄|あに]はうちにいません。', 'あさだけ、[兄|あに]はうちにいません。', 'ゆうがたから、[兄|あに]はうちにいません。'],
    answer: 1, en: 'My older brother is not at home in the daytime.',
    uses: ['g:kara', 'g:made', 'v:昼間|ひるま', 'v:兄|あに', 'v:うち|うち', 'v:居る|いる', 'v:朝|あさ', 'v:夕方|ゆうがた', 'k:兄', 'k:朝', 'k:夕', 'k:方'], sources: ['own'], verified: false },

  { id: 'm:n4-iikae-shinsetsu', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'となりの人は、とても親切です。',
    furigana: 'となりの[人|ひと]は、とても[親切|しんせつ]です。', underline: '親切',
    options: ['となりの[人|ひと]は、とてもやさしいです。', 'となりの[人|ひと]は、とてもこわいです。', 'となりの[人|ひと]は、とてもうるさいです。', 'となりの[人|ひと]は、とてもまじめです。'],
    answer: 0, en: 'The person next door is very kind.',
    uses: ['v:隣|となり', 'v:人|ひと', 'v:とても|とても', 'v:親切|しんせつ', 'v:優しい|やさしい', 'k:人', 'k:親', 'k:切'], sources: ['own'], verified: false,
    notes: 'まじめ (serious, hard-working) is a different quality from kindness.' },

  { id: 'm:n4-iikae-tsumori', kind: 'mondai', type: 'iikae', level: 'N4', jp: '来月、ひっこすつもりです。',
    furigana: '[来月|らいげつ]、ひっこすつもりです。', underline: 'ひっこすつもりです',
    options: ['[来月|らいげつ]、ひっこしました。', '[来月|らいげつ]、ひっこしたくないです。', '[来月|らいげつ]、ひっこそうと[思|おも]っています。', '[来月|らいげつ]、ひっこさなければなりません。'],
    answer: 2, en: 'I intend to move next month.',
    uses: ['g:tsumori', 'g:volitional', 'g:you-to-omou', 'g:te-iru', 'v:来月|らいげつ', 'v:引っ越す|ひっこす', 'v:つもり|つもり', 'v:思う|おもう', 'k:来', 'k:月', 'k:思'], sources: ['own'], verified: false,
    notes: 'つもり = your own plan, the same as 〜ようと思っています; なければなりません is an obligation, not a plan.' },

  { id: 'm:n4-iikae-sakki', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'さっき、田中さんから電話がありました。',
    furigana: 'さっき、[田中|たなか]さんから[電話|でんわ]がありました。', underline: 'さっき',
    options: ['きのう、[田中|たなか]さんから[電話|でんわ]がありました。', '[少|すこ]し[前|まえ]に、[田中|たなか]さんから[電話|でんわ]がありました。', 'いま、[田中|たなか]さんから[電話|でんわ]があります。', 'あとで、[田中|たなか]さんから[電話|でんわ]があります。'],
    answer: 1, en: 'There was a call from Mr. Tanaka a little while ago.',
    names: ['田中|たなか'],
    uses: ['g:kara', 'v:さっき|さっき', 'v:さん|さん', 'v:電話|でんわ', 'v:ある|ある', 'v:少し|すこし', 'v:前|まえ', 'k:田', 'k:中', 'k:電', 'k:話', 'k:少', 'k:前'], sources: ['own'], verified: false },

  { id: 'm:n4-iikae-shippai', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'きのうのテストは、しっぱいしました。',
    furigana: 'きのうのテストは、しっぱいしました。', underline: 'しっぱいしました',
    options: ['きのうのテストは、よくできました。', 'きのうのテストは、うけませんでした。', 'きのうのテストは、かんたんでした。', 'きのうのテストは、うまくできませんでした。'],
    answer: 3, en: 'Yesterday\'s test went badly.',
    uses: ['v:昨日|きのう', 'v:テスト|テスト', 'v:失敗|しっぱい', 'v:する|する', 'v:うまい|うまい', 'v:できる|できる'], sources: ['own'], verified: false,
    notes: 'Not taking the test (うけませんでした) is not failing it.' },

  { id: 'm:n4-iikae-reibou', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'へやのれいぼうをつけました。',
    furigana: 'へやのれいぼうをつけました。', underline: 'れいぼうをつけました',
    options: ['へやをあたたかくしました。', 'へやをあかるくしました。', 'へやをすずしくしました。', 'へやをきれいにしました。'],
    answer: 2, en: 'I turned on the air conditioning in the room.',
    uses: ['v:部屋|へや', 'v:冷房|れいぼう', 'v:つける|つける', 'v:涼しい|すずしい'], sources: ['own'], verified: false,
    notes: 'れいぼう cools a room; warming is だんぼう, lighting is でんき.' },

  { id: 'm:n4-iikae-sobo', kind: 'mondai', type: 'iikae', level: 'N4', jp: 'そぼは、80さいです。',
    furigana: 'そぼは、80さいです。', underline: 'そぼ',
    options: ['[母|はは]の[母|はは]は、80さいです。', '[母|はは]のあねは、80さいです。', '[父|ちち]のあねは、80さいです。', '[父|ちち]のおばさんは、80さいです。'],
    answer: 0, en: 'My grandmother is 80.',
    uses: ['v:祖母|そぼ', 'v:母|はは', 'v:歳|さい', 'k:母'], sources: ['own'], verified: false,
    notes: 'そぼ = a parent\'s mother; the father\'s mother is not among the options, so only はは の はは fits. An aunt is a parent\'s sister.' },

  // ── 用法 ──
  { id: 'm:n4-youhou-tsutsumu', kind: 'mondai', type: 'youhou', level: 'N4', word: 'つつむ', reading: 'つつむ',
    options: ['プレゼントを、きれいな[紙|かみ]でつつみました。', 'さむいので、ドアをつつんでください。', 'ごはんのあとで、はをつつみました。', 'へやのでんきをつつんでから、ねました。'],
    answer: 0, en: 'I wrapped the present in pretty paper.',
    explain: 'つつむ = to wrap something in paper or cloth. Doors are shut (しめる), teeth are brushed (みがく) and lights are switched off (けす).',
    uses: ['v:包む|つつむ', 'v:プレゼント|プレゼント', 'v:きれい|きれい', 'v:紙|かみ', 'k:紙'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-sawagu', kind: 'mondai', type: 'youhou', level: 'N4', word: 'さわぐ', reading: 'さわぐ',
    options: ['[朝|あさ]から[雨|あめ]がさわいでいます。', 'かばんの[中|なか]で、[電話|でんわ]がさわいでいます。', '[図書館|としょかん]の[中|なか]で、さわがないでください。', 'つくえの[上|うえ]に、[本|ほん]がたくさんさわいでいます。'],
    answer: 2, en: 'Please do not make a noise in the library.',
    explain: 'さわぐ = people being noisy or making a fuss. Rain falls (ふる), a phone rings (なる) and books lie on a desk (ある).',
    uses: ['g:nai-de-kudasai', 'v:騒ぐ|さわぐ', 'v:図書館|としょかん', 'v:中|なか', 'k:図', 'k:書', 'k:館', 'k:中'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-okureru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'おくれる', reading: 'おくれる',
    options: ['[兄|あに]は、わたしよりせがおくれています。', 'ねぼうして、[会社|かいしゃ]におくれてしまいました。', 'この[料理|りょうり]は、[味|あじ]が[少|すこ]しおくれています。', 'まいあさ、[犬|いぬ]とこうえんをおくれます。'],
    answer: 1, en: 'I overslept and was late for work.',
    explain: 'おくれる (遅れる) = to be late, behind time. Height is ひくい, a weak taste is うすい, and a walk in the park is さんぽする.',
    uses: ['g:te-shimau', 'v:遅れる|おくれる', 'v:寝坊|ねぼう', 'v:会社|かいしゃ', 'k:会', 'k:社'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-ukeru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'うける', reading: 'うける',
    options: ['まいあさ、[犬|いぬ]とこうえんをうけます。', '[毎朝|まいあさ]、[電車|でんしゃ]にうけて[会社|かいしゃ]へ[行|い]きます。', 'あついので、まどをうけました。', 'あした、[日本|にほん][語|ご]のしけんをうけます。'],
    answer: 3, en: 'Tomorrow I am taking a Japanese exam.',
    explain: 'うける = to take (an exam), to receive (a lesson, an operation). A walk with the dog is さんぽする, a train is ridden (のって) and a window is opened (あけました).',
    names: ['日本|にほん'],
    uses: ['v:受ける|うける', 'v:明日|あした', 'v:語|ご', 'v:試験|しけん', 'k:日', 'k:本', 'k:語'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-hirou', kind: 'mondai', type: 'youhou', level: 'N4', word: 'ひろう', reading: 'ひろう',
    options: ['きのうの[夜|よる]、ねつがひろって[病院|びょういん]へ[行|い]きました。', '[友|とも]だちに[電話|でんわ]をひろって、[話|はな]しました。', '[道|みち]でさいふをひろったので、こうばんにとどけました。', 'しゅくだいは、あしたまでに[先生|せんせい]にひろってください。'],
    answer: 2, en: 'I picked up a wallet in the street, so I took it to the police box.',
    explain: 'ひろう = to pick up something from the ground. A fever goes up (上がる), you call a friend (電話をかける) and hand in homework (出す).',
    uses: ['v:拾う|ひろう', 'v:道|みち', 'v:財布|さいふ', 'v:交番|こうばん', 'v:届ける|とどける', 'k:道'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-kawaku', kind: 'mondai', type: 'youhou', level: 'N4', word: 'かわく', reading: 'かわく',
    options: ['[天気|てんき]がいいので、せんたくものがよくかわきました。', 'へやがさむいので、ストーブをかわきました。', 'へやのでんきがかわいたので、くらいです。', 'ラジオのおとがかわいて、[聞|き]こえません。'],
    answer: 0, en: 'The weather is good, so the washing has dried well.',
    explain: 'かわく = to become dry. A heater is switched on (つける), a light goes out (きえる) and a sound gets quiet (小さくなる).',
    uses: ['v:乾く|かわく', 'v:天気|てんき', 'v:洗濯|せんたく', 'v:物|もの', 'k:天', 'k:気'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-shikaru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'しかる', reading: 'しかる',
    options: ['となりの[犬|いぬ]がよるおそくまでしかっていて、ねられません。', 'あかちゃんが、おなかがすいてしかっています。', 'がんばったので、[母|はは]にしかられて、うれしかったです。', 'しゅくだいをわすれて、[先生|せんせい]にしかられました。'],
    answer: 3, en: 'I forgot my homework and was told off by the teacher.',
    explain: 'しかる = to scold. A dog barks (ほえる), a baby cries (なく), and being praised for trying hard is ほめられる.',
    uses: ['g:passive', 'v:叱る|しかる', 'v:宿題|しゅくだい', 'v:忘れる|わすれる', 'v:先生|せんせい', 'k:先', 'k:生'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-yamu', kind: 'mondai', type: 'youhou', level: 'N4', word: '[止|や]む', reading: 'やむ',
    options: ['バスが[駅|えき]の[前|まえ]で[止|や]みました。', '[雨|あめ]が[止|や]んだら、[出|で]かけましょう。', '[体|からだ]によくないので、たばこを[止|や]みました。', 'じゅぎょうは、[午後|ごご]3[時|じ]に[止|や]みます。'],
    answer: 1, en: 'Let\'s go out when the rain stops.',
    explain: 'やむ = rain, snow or wind stops by itself. A bus stops (とまる), you quit smoking (やめる) and a class ends (終わる).',
    uses: ['g:tara', 'g:mashou', 'v:止む|やむ', 'v:雨|あめ', 'v:出かける|でかける', 'k:止', 'k:雨', 'k:出'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-kimaru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'きまる', reading: 'きまる',
    options: ['[試合|しあい]の[日|ひ]が、やっときまりました。', 'パーティーの[日|ひ]は、わたしがきまります。', 'こまったときは、[先生|せんせい]にきまってください。', '[電車|でんしゃ]が、[駅|えき]にきまりました。'],
    answer: 0, en: 'The day of the match has finally been decided.',
    explain: 'きまる (intransitive) = something gets decided. A person decides with きめる, you talk things over with そうだんする, and a train arrives (つく).',
    uses: ['v:決まる|きまる', 'v:試合|しあい', 'v:日|ひ', 'v:やっと|やっと', 'k:試', 'k:日'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-sagasu', kind: 'mondai', type: 'youhou', level: 'N4', word: 'さがす', reading: 'さがす',
    options: ['あしたの[天気|てんき]を、テレビでさがします。', 'ゆうべはつかれていたので、[早|はや]くさがしました。', 'なくしたかぎを、1[時間|じかん]もさがしました。', 'えんぴつで、[作文|さくぶん]をさがしました。'],
    answer: 2, en: 'I looked for the key I lost for a whole hour.',
    explain: 'さがす = to look for something you want to find. You check the weather (見る / しらべる), go to bed early (ねる) and write an essay in pencil (書く).',
    uses: ['g:number-mo', 'v:探す|さがす', 'v:無くす|なくす', 'v:鍵|かぎ', 'v:時間|じかん', 'k:時', 'k:間'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-mukaeru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'むかえる', reading: 'むかえる',
    options: ['[国|くに]の[家族|かぞく]に、プレゼントをむかえました。', '[駅|えき]まで、[友|とも]だちをむかえに[行|い]きます。', 'にもつを、[友|とも]だちのうちにむかえました。', 'あついので、まどをむかえました。'],
    answer: 1, en: 'I am going to the station to meet my friend.',
    explain: 'むかえる = to go and meet someone who is arriving. A present or parcel is sent (おくる / とどける), and a window is opened (あける).',
    uses: ['g:ni-iku', 'v:迎える|むかえる', 'v:駅|えき', 'v:行く|いく', 'k:駅', 'k:友', 'k:行'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-majime', kind: 'mondai', type: 'youhou', level: 'N4', word: 'まじめ', reading: 'まじめ',
    options: ['この[料理|りょうり]は、とてもまじめです。', '[今日|きょう]はまじめな[天気|てんき]なので、[出|で]かけましょう。', 'このへやはまじめで、とてもしずかです。', '[弟|おとうと]はまじめで、[毎日|まいにち]よくべんきょうします。'],
    answer: 3, en: 'My younger brother is serious and studies hard every day.',
    explain: 'まじめ describes people and attitudes: serious, hard-working. Food is おいしい, weather is いい, and a room is きれい or しずか.',
    uses: ['g:te-adj-noun', 'v:真面目|まじめ', 'v:弟|おとうと', 'v:毎日|まいにち', 'v:勉強|べんきょう', 'v:今日|きょう', 'k:弟', 'k:毎', 'k:日'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-fukuzatsu', kind: 'mondai', type: 'youhou', level: 'N4', word: 'ふくざつ', reading: 'ふくざつ',
    options: ['このみずはふくざつで、つめたいです。', 'この[犬|いぬ]はふくざつで、かわいいです。', 'この[駅|えき]は[出口|でぐち]がたくさんあって、ふくざつです。', 'きょうはかぜがふくざつで、とてもさむいです。'],
    answer: 2, en: 'This station has a lot of exits and is complicated.',
    explain: 'ふくざつ = complicated, with many parts. Water is きれい, a dog is かわいい because of how it looks, and a wind is つよい.',
    uses: ['g:te-adj-noun', 'v:複雑|ふくざつ', 'v:駅|えき', 'v:出口|でぐち', 'v:たくさん|たくさん', 'k:駅', 'k:出', 'k:口'], sources: ['own'], verified: false },

  { id: 'm:n4-youhou-tsutaeru', kind: 'mondai', type: 'youhou', level: 'N4', word: 'つたえる', reading: 'つたえる',
    options: ['[田中|たなか]さんに、あしたのかいぎは[休|やす]みだとつたえてください。', 'きのう、[友|とも]だちに[手紙|てがみ]をつたえました。', 'この[道|みち]をまっすぐつたえると、[駅|えき]があります。', 'にもつを、[友|とも]だちのうちにつたえました。'],
    answer: 0, en: 'Please tell Mr. Tanaka that tomorrow\'s meeting is cancelled.',
    explain: 'つたえる = to pass on a message or information. A letter is sent (出す / おくる), you go along a road (行く) and a parcel is delivered (とどける).',
    names: ['田中|たなか'],
    uses: ['v:伝える|つたえる', 'v:さん|さん', 'v:明日|あした', 'v:会議|かいぎ', 'v:休み|やすみ', 'k:田', 'k:中', 'k:休'], sources: ['own'], verified: false },

  // ── 文章の文法 ──
  { id: 'm:n4-bunshou-new-town', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: 'わたしは[先月|せんげつ]、この[町|まち]にひっこして[来|き]ました。はじめは[知|し]っている[人|ひと]が[一人|ひとり]もいなくて、とてもさびしかったです。［1］、となりの[家|いえ]のおばあさんが、[町|まち]のいろいろな[店|みせ]を[教|おし]えて［2］。[駅|えき]の[近|ちか]くのパン[屋|や]は[朝|あさ]7[時|じ]から[開|あ]いて［3］、[会社|かいしゃ]へ[行|い]く[前|まえ]によく[行|い]きます。[今|いま]は、この[町|まち]がだいすきです。こんどの[日曜日|にちようび]は、おばあさんにおれいのおかしを［4］と[思|おも]っています。',
    blanks: [{ options: ['でも', 'だから', 'それに', 'または'], answer: 0 },
      { options: ['あげました', 'もらいました', 'くれました', 'やりました'], answer: 2 },
      { options: ['あるので', 'いるので', 'おくので', 'しまうので'], answer: 1 },
      { options: ['わたして', 'わたされる', 'わたしたら', 'わたそう'], answer: 3 }],
    en: 'Last month I moved to this town. At first I did not know a single person and was very lonely. But the old woman next door told me about all sorts of shops in town. The bakery near the station is open from 7 a.m., so I often go there before work. Now I love this town. Next Sunday I am going to give her some sweets as a thank-you.',
    uses: ['g:te-iru', 'g:nakute', 'g:te-kureru', 'g:node', 'g:volitional', 'g:you-to-omou', 'g:mae-ni', 'v:私|わたし', 'v:先月|せんげつ', 'v:この|この', 'v:町|まち', 'v:引っ越す|ひっこす', 'v:来る|くる', 'v:初め|はじめ', 'v:知る|しる', 'v:人|ひと', 'v:一人|ひとり', 'v:居る|いる', 'v:とても|とても', 'v:寂しい|さびしい', 'v:でも|でも', 'v:隣|となり', 'v:家|いえ', 'v:おばあさん|おばあさん', 'v:いろいろ|いろいろ', 'v:店|みせ', 'v:教える|おしえる', 'v:くれる|くれる', 'v:駅|えき', 'v:近く|ちかく', 'v:パン|パン', 'v:屋|や', 'v:朝|あさ', 'v:時|じ', 'v:開く|あく', 'v:会社|かいしゃ', 'v:行く|いく', 'v:前|まえ', 'v:よく|よく', 'v:今|いま', 'v:大好き|だいすき', 'v:今度|こんど', 'v:日曜日|にちようび', 'v:お礼|おれい', 'v:お菓子|おかし', 'v:渡す|わたす', 'v:思う|おもう', 'k:先', 'k:月', 'k:町', 'k:来', 'k:知', 'k:人', 'k:一', 'k:家', 'k:店', 'k:教', 'k:駅', 'k:近', 'k:屋', 'k:朝', 'k:時', 'k:開', 'k:会', 'k:社', 'k:行', 'k:前', 'k:今', 'k:日', 'k:曜', 'k:思'], sources: ['own'], verified: false,
    notes: 'Blank 3: 開く is intransitive, so 開いてある is out; 開いている is the state. Blank 4: only the volitional fits 〜と思っています as a plan.' },

  { id: 'm:n4-bunshou-library-closed', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: '[図書館|としょかん]からのお[知|し]らせ\n[図書館|としょかん]は、[本|ほん]をかたづけるため、[来週|らいしゅう]の[月曜日|げつようび]から[水曜日|すいようび]まで、お[休|やす]み［1］。この[間|あいだ]に[本|ほん]をかえしたい[方|かた]は、[入口|いりぐち]の[前|まえ]のはこにお[入|い]れ［2］。また、[木曜日|もくようび]からは、[本|ほん]を[借|か]りることができる[時間|じかん]が[夜|よる]8[時|じ]までに［3］。わからないことが［4］、うけつけの[人|ひと]にお[聞|き]きください。[月曜日|げつようび]から[水曜日|すいようび]までは、[電話|でんわ]にも[出|で]られませんので、ご[注意|ちゅうい]ください。',
    blanks: [{ options: ['させます', 'ございます', 'いたします', 'なさいます'], answer: 2 },
      { options: ['ください', 'ません', 'ました', 'たいです'], answer: 0 },
      { options: ['します', 'あります', 'います', 'なります'], answer: 3 },
      { options: ['あっても', 'あったら', 'あるのに', 'あるし'], answer: 1 }],
    en: 'Notice from the library — To tidy the books, the library will be closed from next Monday to Wednesday. If you want to return books during this time, please put them in the box in front of the entrance. Also, from Thursday the hours when you can borrow books will be until 8 p.m. If anything is unclear, please ask a member of staff at the desk. Please note that from Monday to Wednesday we cannot answer the phone either.',
    uses: ['g:itasu', 'g:o-kudasai', 'g:koto-ga-dekiru', 'g:made-ni', 'g:naru', 'g:tara', 'g:tai', 'g:made', 'g:potential', 'g:node', 'v:図書館|としょかん', 'v:片付ける|かたづける', 'v:為|ため', 'v:お|お', 'v:来週|らいしゅう', 'v:月曜日|げつようび', 'v:水曜日|すいようび', 'v:休み|やすみ', 'v:間|あいだ', 'v:本|ほん', 'v:返す|かえす', 'v:方|かた', 'v:入口|いりぐち', 'v:前|まえ', 'v:箱|はこ', 'v:入れる|いれる', 'v:ください|ください', 'v:また|また', 'v:木曜日|もくようび', 'v:借りる|かりる', 'v:できる|できる', 'v:時間|じかん', 'v:夜|よる', 'v:時|じ', 'v:なる|なる', 'v:分かる|わかる', 'v:事|こと', 'v:ある|ある', 'v:受付|うけつけ', 'v:人|ひと', 'v:聞く|きく', 'v:電話|でんわ', 'v:出る|でる', 'v:ご|ご', 'v:注意|ちゅうい', 'k:図', 'k:書', 'k:館', 'k:知', 'k:本', 'k:来', 'k:週', 'k:月', 'k:曜', 'k:日', 'k:水', 'k:休', 'k:間', 'k:方', 'k:入', 'k:口', 'k:前', 'k:木', 'k:借', 'k:時', 'k:夜', 'k:人', 'k:聞', 'k:電', 'k:話', 'k:出', 'k:注', 'k:意'], sources: ['own'], verified: false,
    notes: 'Blank 1: the library speaks of itself, so humble いたします; なさいます is respectful (for others), ございます needs で (お休みでございます), させます makes no sense. Blank 2: お〜ください is the polite request; お入れ + ません / ました / たいです are not forms.' },

  { id: 'm:n4-bunshou-forgot-umbrella', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: 'きのう、わたしは[電車|でんしゃ]の[中|なか]にかさをわすれて［1］。[駅|えき]の[人|ひと]に[話|はな]す［2］、すぐに[電話|でんわ]で[聞|き]いてくれました。かさは、[終|お]わりの[駅|えき]で[見|み]つかった［3］、[今日|きょう]の[朝|あさ]、とりに[行|い]きました。このかさは、[母|はは]が[去年|きょねん]わたしに[買|か]って［4］ものなので、[見|み]つかってよかったです。[駅|えき]の[人|ひと]は「つぎからは、[電車|でんしゃ]をおりる[前|まえ]に、わすれものがないか[見|み]てくださいね」と[言|い]いました。',
    blanks: [{ options: ['しまいました', 'みました', 'あげました', 'くれました'], answer: 0 },
      { options: ['なら', 'ので', 'と', 'ながら'], answer: 2 },
      { options: ['のに', 'ので', 'ながら', 'ても'], answer: 1 },
      { options: ['もらった', 'あげた', 'しまった', 'くれた'], answer: 3 }],
    en: 'Yesterday I left my umbrella on the train. When I told the station staff, they asked by phone straight away. The umbrella was found at the last station, so I went to get it this morning. My mother bought me this umbrella last year, so I am glad it was found. The station staff said, "From now on, check that you have not left anything behind before you get off the train."',
    uses: ['g:te-shimau', 'g:to-conditional', 'g:te-kureru', 'g:node', 'g:ni-iku', 'g:te-yokatta', 'g:noun-modifier', 'g:mae-ni', 'g:te-kudasai', 'g:ne', 'g:ka', 'v:昨日|きのう', 'v:私|わたし', 'v:電車|でんしゃ', 'v:中|なか', 'v:傘|かさ', 'v:忘れる|わすれる', 'v:駅|えき', 'v:人|ひと', 'v:話す|はなす', 'v:すぐに|すぐに', 'v:電話|でんわ', 'v:聞く|きく', 'v:終わり|おわり', 'v:見つかる|みつかる', 'v:今日|きょう', 'v:朝|あさ', 'v:取る|とる', 'v:行く|いく', 'v:この|この', 'v:母|はは', 'v:去年|きょねん', 'v:買う|かう', 'v:くれる|くれる', 'v:物|もの', 'v:いい|いい', 'v:次|つぎ', 'v:降りる|おりる', 'v:前|まえ', 'v:忘れ物|わすれもの', 'v:ない|ない', 'v:見る|みる', 'v:言う|いう', 'k:電', 'k:車', 'k:中', 'k:駅', 'k:人', 'k:話', 'k:聞', 'k:終', 'k:見', 'k:今', 'k:日', 'k:朝', 'k:行', 'k:母', 'k:去', 'k:年', 'k:買', 'k:前', 'k:言'], sources: ['own'], verified: false,
    notes: 'Blank 2: 話すと + a past result is the "when I did X, Y happened" use; なら does not take a past result, ので and ながら do not attach to 話す this way. Blank 3: ので (reason); のに / ても contradict going to fetch it, and ながら takes the stem (見つかりながら), not the past. Blank 4: the giver is 母が, the receiver わたしに, so only くれた fits.' },

  { id: 'm:n4-bunshou-kanji-practice', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: '[来週|らいしゅう]、[日本|にほん][語|ご]のしけんがあります。しけんでいいてんをとる［1］、[毎日|まいにち]3[時間|じかん]べんきょうしています。でも、[漢字|かんじ]がなかなかおぼえられません。[先生|せんせい]に[聞|き]くと、「[何|なん][度|ど]も［2］、おぼえられますよ」と[言|い]われました。それで、きのうから[漢字|かんじ]を10かいずつ[書|か]いて［3］。[今日|きょう]の[小|ちい]さいテストは、いつもよりよくできたので、[先生|せんせい]に［4］、とてもうれしかったです。',
    blanks: [{ options: ['ので', 'のに', 'ために', 'ながら'], answer: 2 },
      { options: ['かけば', 'かくし', 'かいたり', 'かくのに'], answer: 0 },
      { options: ['あります', 'おきます', 'みます', 'います'], answer: 3 },
      { options: ['ほめて', 'ほめられて', 'ほめさせて', 'ほめたら'], answer: 1 }],
    en: 'Next week I have a Japanese exam. To get a good score, I study for three hours every day. But I just cannot remember the kanji. When I asked my teacher, I was told, "If you write them many times, you will remember them." So since yesterday I have been writing each kanji ten times. In today\'s small test I did better than usual, and the teacher praised me, so I was very happy.',
    names: ['日本|にほん'],
    uses: ['g:ga-arimasu', 'g:te-iru', 'g:potential', 'g:to-conditional', 'g:ba', 'g:passive', 'g:node', 'v:来週|らいしゅう', 'v:語|ご', 'v:試験|しけん', 'v:ある|ある', 'v:いい|いい', 'v:点|てん', 'v:取る|とる', 'v:為|ため', 'v:毎日|まいにち', 'v:時間|じかん', 'v:勉強|べんきょう', 'v:する|する', 'v:でも|でも', 'v:漢字|かんじ', 'v:中々|なかなか', 'v:覚える|おぼえる', 'v:先生|せんせい', 'v:聞く|きく', 'v:何|なん', 'v:度|ど', 'v:書く|かく', 'v:言う|いう', 'v:それで|それで', 'v:昨日|きのう', 'v:回|かい', 'v:ずつ|ずつ', 'v:今日|きょう', 'v:小さい|ちいさい', 'v:テスト|テスト', 'v:いつも|いつも', 'v:より|より', 'v:よく|よく', 'v:できる|できる', 'v:褒める|ほめる', 'v:とても|とても', 'v:嬉しい|うれしい', 'k:来', 'k:週', 'k:日', 'k:本', 'k:語', 'k:毎', 'k:時', 'k:間', 'k:漢', 'k:字', 'k:先', 'k:生', 'k:聞', 'k:何', 'k:度', 'k:言', 'k:書', 'k:今', 'k:小'], sources: ['own'], verified: false,
    notes: 'Blank 1: ために (purpose) is not a catalog grammar point; it is listed as v:為|ため. Blank 3: きのうから + an ongoing habit needs ています. Blank 4: 先生に + the passive (I was praised by the teacher).' },

  { id: 'm:n4-bunshou-winter-trip', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: '[冬|ふゆ][休|やす]みに、[家族|かぞく]と[北海道|ほっかいどう]へ[旅行|りょこう]に[行|い]きました。くうこうからホテルまでは、バスで1[時間|じかん]かかりました。[北海道|ほっかいどう]はとてもさむくて、[毎日|まいにち]ゆきがふって［1］。ホテルの[人|ひと]に「[外|そと]に[出|で]るときは、くつの[下|した]にこれをつけて［2］」と[言|い]われて、すべらないものを[借|か]りました。［3］、[一度|いちど]もころびませんでした。[夜|よる]は、[有名|ゆうめい]な[店|みせ]で[魚|さかな]を[食|た]べました。とてもおいしかったので、[来年|らいねん]もまた［4］と[思|おも]います。',
    blanks: [{ options: ['いました', 'ありました', 'おきました', 'みました'], answer: 0 },
      { options: ['くれます', 'あげます', 'ください', 'もらいます'], answer: 2 },
      { options: ['それでも', 'それで', 'でも', 'それとも'], answer: 1 },
      { options: ['いった', 'いって', 'いかれた', 'いこう'], answer: 3 }],
    en: 'In the winter holidays I went to Hokkaido with my family. From the airport to the hotel took an hour by bus. Hokkaido was very cold, and it snowed every day. The hotel staff told us, "When you go outside, please put these under your shoes," and we borrowed things to stop us slipping. Because of that, we did not fall over once. In the evening we ate fish at a famous restaurant. It was so good that I am thinking of going again next year.',
    names: ['北海道|ほっかいどう'],
    uses: ['g:te-adj-noun', 'g:te-iru', 'g:te-ita', 'g:te-kudasai', 'g:passive', 'g:noun-modifier', 'g:node', 'g:volitional', 'g:you-to-omou', 'v:冬|ふゆ', 'v:休み|やすみ', 'v:家族|かぞく', 'v:旅行|りょこう', 'v:行く|いく', 'v:空港|くうこう', 'v:バス|バス', 'v:時間|じかん', 'v:かかる|かかる', 'v:とても|とても', 'v:寒い|さむい', 'v:毎日|まいにち', 'v:雪|ゆき', 'v:降る|ふる', 'v:ホテル|ホテル', 'v:人|ひと', 'v:外|そと', 'v:出る|でる', 'v:時|とき', 'v:靴|くつ', 'v:下|した', 'v:これ|これ', 'v:つける|つける', 'v:ください|ください', 'v:言う|いう', 'v:滑る|すべる', 'v:物|もの', 'v:借りる|かりる', 'v:それで|それで', 'v:一度|いちど', 'v:夜|よる', 'v:有名|ゆうめい', 'v:店|みせ', 'v:魚|さかな', 'v:食べる|たべる', 'v:おいしい|おいしい', 'v:来年|らいねん', 'v:また|また', 'v:思う|おもう', 'k:冬', 'k:休', 'k:家', 'k:族', 'k:北', 'k:海', 'k:道', 'k:旅', 'k:行', 'k:時', 'k:間', 'k:毎', 'k:日', 'k:人', 'k:外', 'k:出', 'k:下', 'k:言', 'k:借', 'k:一', 'k:度', 'k:夜', 'k:有', 'k:名', 'k:店', 'k:魚', 'k:食', 'k:来', 'k:年', 'k:思'], sources: ['own'], verified: false,
    notes: 'Blank 2: a request quoted from the hotel staff, so 〜てください. Blank 3: それで (as a result); でも / それでも would contrast with borrowing the grips.' },

  { id: 'm:n4-bunshou-broken-computer', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: '[先週|せんしゅう]、[会社|かいしゃ]で[大切|たいせつ]なかいぎに[使|つか]う[紙|かみ]を[作|つく]っていましたが、とちゅうでコンピューターがこわれて［1］。こまっていると、となりのせきの[山田|やまだ]さんが「わたしのパソコンを［2］いいですよ」と[言|い]って、[貸|か]してくれました。その[上|うえ]、[作|つく]り[方|かた]も[教|おし]えて［3］。おかげで、かいぎにまにあいました。[山田|やまだ]さんがこまっているときは、[今度|こんど]はわたしが［4］つもりです。',
    blanks: [{ options: ['おきました', 'ありました', 'しまいました', 'みました'], answer: 2 },
      { options: ['つかっても', 'つかったり', 'つかうので', 'つかわせて'], answer: 0 },
      { options: ['あげました', 'もらいました', 'いただきました', 'くれました'], answer: 3 },
      { options: ['てつだってもらう', 'てつだってあげる', 'てつだってくれる', 'てつだわれる'], answer: 1 }],
    en: 'Last week at work I was making the papers for an important meeting, but halfway through my computer broke. While I was stuck, Ms. Yamada at the next desk said, "You can use my computer," and lent it to me. On top of that, she showed me how to make the papers. Thanks to her, I was in time for the meeting. Next time Ms. Yamada is in trouble, I intend to help her.',
    names: ['山田|やまだ'],
    uses: ['g:te-ita', 'g:noun-modifier', 'g:te-shimau', 'g:to-conditional', 'g:te-iru', 'g:te-mo-ii', 'g:te-kureru', 'g:kata', 'g:te-ageru', 'g:tsumori', 'v:先週|せんしゅう', 'v:会社|かいしゃ', 'v:大切|たいせつ', 'v:会議|かいぎ', 'v:使う|つかう', 'v:紙|かみ', 'v:作る|つくる', 'v:途中|とちゅう', 'v:コンピューター|コンピューター', 'v:壊れる|こわれる', 'v:困る|こまる', 'v:隣|となり', 'v:席|せき', 'v:さん|さん', 'v:私|わたし', 'v:パソコン|パソコン', 'v:いい|いい', 'v:言う|いう', 'v:貸す|かす', 'v:その|その', 'v:上|うえ', 'v:方|かた', 'v:教える|おしえる', 'v:お陰|おかげ', 'v:間に合う|まにあう', 'v:時|とき', 'v:今度|こんど', 'v:手伝う|てつだう', 'v:あげる|あげる', 'v:つもり|つもり', 'k:先', 'k:週', 'k:会', 'k:社', 'k:大', 'k:切', 'k:使', 'k:紙', 'k:作', 'k:山', 'k:田', 'k:言', 'k:貸', 'k:上', 'k:方', 'k:教', 'k:今', 'k:度'], sources: ['own'], verified: false,
    notes: 'Blank 1: こわれる is intransitive, so not てある; the trouble calls for てしまいました. Blank 3: 山田さんが is the giver, so くれました (もらう / いただく need に). Blank 4: わたしが gives the help: てあげる.' },

  { id: 'm:n4-bunshou-white-cat', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: 'このごろ、うちのにわに[白|しろ]いねこがよく[来|き]ます。くびに[赤|あか]いひもをつけた、とてもきれいなねこなので、だれかがかっている［1］。きのう、となりのおばあさんに[聞|き]いて［2］、おばあさんのねこでした。おばあさんは「ねこがおたくのにわに[入|はい]って［3］すみません」と[言|い]いました。わたしはねこがすきなので、「いつでも[来|き]て［4］いいですよ」と[答|こた]えました。',
    blanks: [{ options: ['ようです', 'たがります', 'ところです', 'ばかりです'], answer: 0 },
      { options: ['おくと', 'あると', 'みると', 'しまうと'], answer: 2 },
      { options: ['おいて', 'しまって', 'みて', 'あって'], answer: 1 },
      { options: ['は', 'を', 'が', 'も'], answer: 3 }],
    en: 'These days a white cat often comes into our garden. It is a very pretty cat with a red string around its neck, so it seems someone keeps it. Yesterday, when I asked the old woman next door, it turned out to be her cat. She said, "I\'m sorry my cat goes into your garden." I like cats, so I answered, "It can come any time."',
    uses: ['g:noun-modifier', 'g:node', 'g:te-iru', 'g:you-da', 'g:te-miru', 'g:to-conditional', 'g:te-shimau', 'g:te-sumimasen', 'g:demo', 'g:te-mo-ii', 'v:この頃|このごろ', 'v:うち|うち', 'v:庭|にわ', 'v:白い|しろい', 'v:首|くび', 'v:赤い|あかい', 'v:つける|つける', 'v:猫|ねこ', 'v:よく|よく', 'v:来る|くる', 'v:とても|とても', 'v:きれい|きれい', 'v:誰か|だれか', 'v:昨日|きのう', 'v:隣|となり', 'v:おばあさん|おばあさん', 'v:聞く|きく', 'v:お宅|おたく', 'v:入る|はいる', 'v:言う|いう', 'v:私|わたし', 'v:好き|すき', 'v:いつ|いつ', 'v:答える|こたえる', 'k:白', 'k:来', 'k:赤', 'k:聞', 'k:入', 'k:言', 'k:答'], sources: ['own'], verified: false,
    notes: 'Blank 1: ようです is a guess from what the writer sees (a pretty, cared-for cat); ところです / ばかりです do not fit 〜ている, and たがります is for wishes. Blank 2: 聞いてみると, "when I tried asking, it turned out…".' },

  { id: 'm:n4-bunshou-water-notice', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: 'アパートに[住|す]んでいるみなさまへ\n[来月|らいげつ]15[日|にち]の[午前|ごぜん]9[時|じ]から12[時|じ]まで、[水道|すいどう]をなおす[仕事|しごと]がございます。この[時間|じかん]は、[水|みず]が［1］。トイレもエレベーターも[止|と]まりますので、ご[注意|ちゅうい]ください。[料理|りょうり]やせんたくに[使|つか]う[水|みず]は、[前|まえ]の[日|ひ]［2］よういしておいてください。[雨|あめ]がふった［3］、つぎの[日|ひ]の[同|おな]じ[時間|じかん]になります。わからないことが［4］、1かいの[山田|やまだ]までお[知|し]らせください。',
    blanks: [{ options: ['つかいません', 'つかっています', 'つかえません', 'つかわせます'], answer: 2 },
      { options: ['までに', 'まで', 'ながら', 'しか'], answer: 0 },
      { options: ['のに', 'ながら', 'ほど', 'ばあいは'], answer: 3 },
      { options: ['あっても', 'あったら', 'あるので', 'あるし'], answer: 1 }],
    en: 'To everyone living in the apartment building — Next month on the 15th, from 9 a.m. to 12, there will be work to repair the water pipes. During this time the water cannot be used. The toilets and the lift will also stop, so please take note. Please get the water you need for cooking and washing ready by the day before. If it rains, the work moves to the same time the next day. If anything is unclear, please let Yamada on the first floor know.',
    names: ['山田|やまだ'],
    uses: ['g:te-iru', 'g:gozaimasu', 'g:noun-modifier', 'g:potential', 'g:ya', 'g:made-ni', 'g:te-oku', 'g:te-kudasai', 'g:baai-wa', 'g:naru', 'g:tara', 'g:o-kudasai', 'g:node', 'g:mo', 'v:アパート|アパート', 'v:住む|すむ', 'v:来月|らいげつ', 'v:日|にち', 'v:午前|ごぜん', 'v:時|じ', 'v:水道|すいどう', 'v:直す|なおす', 'v:仕事|しごと', 'v:ございます|ございます', 'v:この|この', 'v:時間|じかん', 'v:水|みず', 'v:トイレ|トイレ', 'v:エレベーター|エレベーター', 'v:止まる|とまる', 'v:ご|ご', 'v:注意|ちゅうい', 'v:使う|つかう', 'v:料理|りょうり', 'v:洗濯|せんたく', 'v:前|まえ', 'v:日|ひ', 'v:用意|ようい', 'v:置く|おく', 'v:ください|ください', 'v:雨|あめ', 'v:降る|ふる', 'v:場合|ばあい', 'v:次|つぎ', 'v:同じ|おなじ', 'v:なる|なる', 'v:分かる|わかる', 'v:事|こと', 'v:ある|ある', 'v:階|かい', 'v:お|お', 'v:知らせる|しらせる', 'k:住', 'k:来', 'k:月', 'k:日', 'k:午', 'k:前', 'k:時', 'k:水', 'k:道', 'k:仕', 'k:事', 'k:間', 'k:止', 'k:注', 'k:意', 'k:料', 'k:理', 'k:使', 'k:雨', 'k:同', 'k:山', 'k:田', 'k:知'], sources: ['own'], verified: false,
    notes: 'Blank 1: 水が + potential (can be used); 水が つかいません / つかっています need を. Blank 2: までに marks a deadline for a one-off action; まで would mean "keep doing it until". みなさま (the honorific of みなさん) has no catalog entry; not in uses.' },

  { id: 'm:n4-bunshou-bakery-job', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: 'わたしは[高校生|こうこうせい]のとき、パン[屋|や]でアルバイトをしていました。はじめは、[毎朝|まいあさ]5[時|じ]に[店|みせ]に［1］、とてもたいへんでした。でも、[店|みせ]の[人|ひと]にパンの[作|つく]り[方|かた]を［2］、だんだん[仕事|しごと]が[楽|たの]しくなりました。[今|いま]は[大学|だいがく]で[料理|りょうり]のべんきょうをしています。あのアルバイトをしなかった［3］、[料理|りょうり]にきょうみを[持|も]たなかったかもしれません。いつか、あの[店|みせ]のような[店|みせ]を［4］と[思|おも]っています。',
    blanks: [{ options: ['こさせられて', 'こさせて', 'こないで', 'こようと'], answer: 0 },
      { options: ['おしえてあげて', 'おしえさせて', 'おしえてもらって', 'おしえられないで'], answer: 2 },
      { options: ['ので', 'ら', 'のに', 'り'], answer: 1 },
      { options: ['ひらかれる', 'ひらいた', 'ひらいて', 'ひらきたい'], answer: 3 }],
    en: 'When I was a high-school student, I worked part-time at a bakery. At first I was made to come to the shop at 5 every morning, and it was very hard. But the people at the shop taught me how to make bread, and little by little the work became fun. Now I study cooking at university. If I had not done that job, I might not have become interested in cooking. Some day I want to open a shop like that one.',
    uses: ['g:te-ita', 'g:causative-passive', 'g:te-adj-noun', 'g:te-morau', 'g:kata', 'g:naru', 'g:te-iru', 'g:tara', 'g:kamo-shirenai', 'g:no-you-na', 'g:tai', 'g:to-omou', 'v:私|わたし', 'v:高校生|こうこうせい', 'v:時|とき', 'v:パン|パン', 'v:屋|や', 'v:アルバイト|アルバイト', 'v:する|する', 'v:初め|はじめ', 'v:毎朝|まいあさ', 'v:時|じ', 'v:店|みせ', 'v:来る|くる', 'v:とても|とても', 'v:大変|たいへん', 'v:でも|でも', 'v:人|ひと', 'v:作る|つくる', 'v:方|かた', 'v:教える|おしえる', 'v:もらう|もらう', 'v:段々|だんだん', 'v:仕事|しごと', 'v:楽しい|たのしい', 'v:なる|なる', 'v:今|いま', 'v:大学|だいがく', 'v:料理|りょうり', 'v:勉強|べんきょう', 'v:あの|あの', 'v:興味|きょうみ', 'v:持つ|もつ', 'v:開く|ひらく', 'v:思う|おもう', 'k:高', 'k:校', 'k:生', 'k:屋', 'k:毎', 'k:朝', 'k:時', 'k:店', 'k:人', 'k:作', 'k:方', 'k:仕', 'k:事', 'k:楽', 'k:今', 'k:大', 'k:学', 'k:料', 'k:理', 'k:持', 'k:思'], sources: ['own'], verified: false,
    notes: 'Blank 2: 店の人に + てもらって (the writer receives the teaching). Blank 3: しなかったら + かもしれません is a counterfactual; しなかったので would contradict the facts.' },

  { id: 'm:n4-bunshou-letter-teacher', kind: 'mondai', type: 'bunshou', level: 'N4',
    text: '[先生|せんせい]、お[元気|げんき]でいらっしゃいますか。[去年|きょねん]、[先生|せんせい]のクラスで[日本|にほん][語|ご]を[教|おし]えて［1］リーです。[先生|せんせい]に[教|おし]えていただいた［2］、[今|いま]は[日本|にほん]の[会社|かいしゃ]ではたらいています。[毎日|まいにち][日本|にほん][語|ご]を[使|つか]うので、たいへんですが、とても[楽|たの]しいです。［3］、[来月|らいげつ]、[仕事|しごと]で[東京|とうきょう]へ[行|い]く[用事|ようじ]があります。もし[先生|せんせい]のごつごうがよろしければ、[学校|がっこう]へごあいさつに［4］たいのですが、いかがでしょうか。',
    blanks: [{ options: ['あげた', 'さしあげた', 'いただいた', 'いらっしゃった'], answer: 2 },
      { options: ['おかげで', 'せいで', 'のに', 'けれど'], answer: 0 },
      { options: ['だから', 'それとも', 'すると', 'それから'], answer: 3 },
      { options: ['いらっしゃい', 'うかがい', 'めしあがり', 'ごらんになり'], answer: 1 }],
    en: 'Dear teacher, are you keeping well? I am Lee, whom you taught Japanese in your class last year. Thanks to what you taught me, I now work at a Japanese company. I use Japanese every day, so it is hard, but it is great fun. Also, next month I have business in Tokyo. If it suits you, I would like to visit the school to say hello. Would that be all right?',
    names: ['日本|にほん', '東京|とうきょう', 'リー'],
    uses: ['g:sonkeigo-verbs', 'g:te-iru', 'g:noun-modifier', 'g:ba', 'g:tai', 'g:node', 'g:deshou', 'v:先生|せんせい', 'v:お|お', 'v:元気|げんき', 'v:いらっしゃる|いらっしゃる', 'v:去年|きょねん', 'v:クラス|クラス', 'v:語|ご', 'v:教える|おしえる', 'v:頂く|いただく', 'v:お陰|おかげ', 'v:今|いま', 'v:会社|かいしゃ', 'v:働く|はたらく', 'v:毎日|まいにち', 'v:使う|つかう', 'v:大変|たいへん', 'v:とても|とても', 'v:楽しい|たのしい', 'v:来月|らいげつ', 'v:仕事|しごと', 'v:行く|いく', 'v:用事|ようじ', 'v:ある|ある', 'v:もし|もし', 'v:ご|ご', 'v:都合|つごう', 'v:よろしい|よろしい', 'v:学校|がっこう', 'v:挨拶|あいさつ', 'v:伺う|うかがう', 'v:いかが|いかが', 'v:それから|それから', 'k:先', 'k:生', 'k:元', 'k:気', 'k:去', 'k:年', 'k:日', 'k:本', 'k:語', 'k:教', 'k:今', 'k:会', 'k:社', 'k:毎', 'k:使', 'k:楽', 'k:来', 'k:月', 'k:仕', 'k:事', 'k:東', 'k:京', 'k:行', 'k:用', 'k:学', 'k:校'], sources: ['own'], verified: false,
    notes: 'Blank 1: the writer received the teaching (教えていただいた); あげた / さしあげた would make Lee the teacher (くださった was dropped: as a relative clause on the recipient it is marginal, N4 r1 exam T6). Blank 3: それから adds the next piece of news; だから, それとも and すると do not follow from "it is fun" (the key was ところで, an N3 word). Blank 4: humble うかがう for the writer\'s own visit; the others are respectful verbs for other people.' }
]);
