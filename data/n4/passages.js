"use strict";

// N4 reading passages: original texts in the three N4 読解 formats of the official test
// (jlpt.jp n4_e_revised.pdf, format only, nothing copied): short = 内容理解(短文), a note / email /
// notice of about 100–200 characters with 1 question; mid = 内容理解(中文), about 450 characters
// with 3 questions in text order; info = 情報検索, a notice / timetable / flyer of about 400
// characters to search, 2 questions whose answers combine two or more conditions.
//
// Written by hand for this project (sources: ['own']). Text rules:
// - `furigana`: the text with [漢字|かな] ruby blocks (same markup as sentences.js); `jp` is derived
//   from it. Kanji only from the N5 + N4 lists; a word with any kanji above N4 is written in kana.
//   Not spaced: the N4 test writes its texts unspaced (N5 spaces them between phrases); the ruby,
//   quiz and check code never relies on spaces. Questions and options use the same markup.
//   In a quiz, ruby is hidden on kanji the learner has been taught.
// - `uses`: every grammar point, every content word (as its catalog vocab id) and every kanji in
//   the passage, its questions and options. Words and grammar kept by hand (no tokenizer); the k:
//   ids were collected from the text by script. Proper nouns go in `names`.
// - `answer`: index of the right option in `options` (shuffled when asked); keys spread over 0–3.
// - verified (own content): true only when every `uses` item is a verified catalog item and the
//   passage checks in tests/catalog-checks.js pass; ≥2 sources does not apply to own text.
(function () {
function P(o) {
  o.kind = 'passage';
  o.level = 'N4';
  o.jp = o.furigana.replace(/\[([^|\]]+)(\|[^\]]*)\]/g, '$1');
  o.author = 'jelly-jlpt';
  o.license = 'own';
  o.sources = ['own'];
  return o;
}

CATALOG.add([
  // ── short (内容理解・短文) ──
  P({ id: 'p:n4-cooking-class', format: 'short',
    furigana: '[土曜日|どようび]の[料理|りょうり][教室|きょうしつ]\n[毎週|まいしゅう][土曜日|どようび]の[午前|ごぜん]10[時|じ]から12[時|じ]まで、[駅|えき]の[前|まえ]のビルで[料理|りょうり][教室|きょうしつ]をしています。[今月|こんげつ]は[魚|さかな][料理|りょうり]の[作|つく]り[方|かた]を[習|なら]います。はじめての[人|ひと]でも、かんたんに[作|つく]ることができます。1かい1,000[円|えん]です。[来|き]たい[人|ひと]は、[前|まえ]の[日|ひ]までに[電話|でんわ]でれんらくしてください。',
    en: 'Saturday cooking class — Every Saturday from 10 a.m. to 12 we hold a cooking class in the building in front of the station. This month we learn how to cook fish dishes. Even first-timers can make them easily. It costs 1,000 yen per session. If you want to come, please call us by the day before.',
    questions: [
      { q: 'この[料理|りょうり][教室|きょうしつ]に[行|い]きたい[人|ひと]は、どうしなければなりませんか。',
        options: ['[金曜日|きんようび]までに[電話|でんわ]でれんらくする', '[土曜日|どようび]の[朝|あさ]に[電話|でんわ]でれんらくする', '[前|まえ]の[日|ひ]までに1,000[円|えん]をはらう', '[土曜日|どようび]の[午前|ごぜん]10[時|じ]に[電話|でんわ]をかける'], answer: 0,
        explain: 'The class is on Saturday, and you must phone by the day before (前の日までに), that is by Friday. A call on Saturday is too late, and the text gives no payment deadline.' }],
    uses: ['g:te-iru', 'g:kata', 'g:demo', 'g:koto-ga-dekiru', 'g:tai', 'g:made-ni', 'g:te-kudasai', 'g:nakereba-naranai', 'g:kara', 'g:made', 'g:de', 'g:no', 'g:wo', 'g:ka', 'v:土曜日|どようび', 'v:料理|りょうり', 'v:教室|きょうしつ', 'v:毎週|まいしゅう', 'v:午前|ごぜん', 'v:時|じ', 'v:駅|えき', 'v:前|まえ', 'v:ビル|ビル', 'v:今月|こんげつ', 'v:魚|さかな', 'v:作る|つくる', 'v:方|かた', 'v:習う|ならう', 'v:初めて|はじめて', 'v:人|ひと', 'v:簡単|かんたん', 'v:回|かい', 'v:円|えん', 'v:来る|くる', 'v:日|ひ', 'v:電話|でんわ', 'v:連絡|れんらく', 'v:する|する', 'v:ください|ください', 'v:行く|いく', 'v:どう|どう', 'v:金曜日|きんようび', 'v:朝|あさ', 'v:払う|はらう', 'v:掛ける|かける', 'k:土', 'k:曜', 'k:日', 'k:料', 'k:理', 'k:教', 'k:室', 'k:毎', 'k:週', 'k:午', 'k:前', 'k:時', 'k:駅', 'k:今', 'k:月', 'k:魚', 'k:作', 'k:方', 'k:習', 'k:人', 'k:円', 'k:来', 'k:電', 'k:話', 'k:行', 'k:金', 'k:朝'],
    verified: true }),

  P({ id: 'p:n4-sick-day-memo', format: 'short',
    furigana: 'ぶちょう\n[山田|やまだ]です。きのうの[夜|よる]からねつがあるので、[今日|きょう]は[休|やす]ませていただけませんか。[午後|ごご]3[時|じ]におきゃくさまが[来|こ]られるよていですが、そのことは[田中|たなか]さんに[話|はな]しておきました。おきゃくさまにわたす[紙|かみ]は、わたしのつくえの[上|うえ]においてあります。',
    en: 'To the department head — This is Yamada. I have had a fever since last night, so could I possibly take today off? A client is scheduled to come at 3 p.m., but I have already told Tanaka about it. The papers to hand to the client are on my desk.',
    questions: [
      { q: '[山田|やまだ]さんがいちばんつたえたいことは[何|なん]ですか。',
        options: ['[田中|たなか]さんに、おきゃくさまのことを[話|はな]してほしいこと', 'ぶちょうに、おきゃくさまと[会|あ]ってほしいこと', '[今日|きょう]、[会社|かいしゃ]を[休|やす]みたいこと', '[紙|かみ]を、つくえの[上|うえ]においてほしいこと'], answer: 2,
        explain: 'The memo is a request to be off today (休ませていただけませんか); the rest is handover. Tanaka has already been told (話しておきました), the papers are already on the desk (おいてあります), and the head is not asked to meet the client.' }],
    names: ['山田|やまだ', '田中|たなか'],
    notes: '来られる here is the respectful passive form (honorific), not a real passive; listed as g:passive because the catalog has no separate point for it.',
    uses: ['g:node', 'g:causative', 'g:te-itadakemasen-ka', 'g:passive', 'g:yotei-da', 'g:te-oku', 'g:te-aru', 'g:tai', 'g:te-hoshii', 'g:noun-modifier', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:部長|ぶちょう', 'v:昨日|きのう', 'v:夜|よる', 'v:熱|ねつ', 'v:ある|ある', 'v:今日|きょう', 'v:休む|やすむ', 'v:午後|ごご', 'v:時|じ', 'v:お|お', 'v:客|きゃく', 'v:様|さま', 'v:来る|くる', 'v:予定|よてい', 'v:その|その', 'v:事|こと', 'v:さん|さん', 'v:話す|はなす', 'v:渡す|わたす', 'v:紙|かみ', 'v:私|わたし', 'v:机|つくえ', 'v:上|うえ', 'v:置く|おく', 'v:いちばん|いちばん', 'v:伝える|つたえる', 'v:何|なん', 'v:会社|かいしゃ', 'v:会う|あう', 'k:山', 'k:田', 'k:夜', 'k:今', 'k:日', 'k:休', 'k:午', 'k:後', 'k:時', 'k:来', 'k:中', 'k:話', 'k:紙', 'k:上', 'k:何', 'k:会', 'k:社'],
    verified: true }),

  P({ id: 'p:n4-shop-seating', format: 'short',
    furigana: 'おきゃくさまへ\nこの[店|みせ]で[買|か]った[食|た]べ[物|もの]や[飲|の]み[物|もの]は、2かいのせきでめしあがることができます。[外|そと]の[店|みせ]で[買|か]った[物|もの]は、ここで[食|た]べないでください。2かいのせきは[夜|よる]8[時|じ]までです。ごみは、1かいの[入口|いりぐち]のそばにおすてください。',
    en: 'To our customers — Food and drinks bought in this shop can be eaten at the seats on the second floor. Please do not eat things bought at other shops here. The second-floor seats are open until 8 p.m. Please throw your rubbish away by the entrance on the first floor.',
    questions: [
      { q: 'この[店|みせ]で[買|か]ったパンを、[店|みせ]の[中|なか]で[食|た]べたい[人|ひと]は、どうしますか。',
        options: ['1かいの[入口|いりぐち]のそばで[食|た]べる', '[夜|よる]8[時|じ]までに、2かいのせきで[食|た]べる', '[夜|よる]8[時|じ]から、2かいのせきで[食|た]べる', '[外|そと]の[店|みせ]で[買|か]った[物|もの]といっしょに[食|た]べる'], answer: 1,
        explain: 'Things bought here may be eaten upstairs (2かいのせき), and the seats are open until 8 p.m. The entrance is where the rubbish goes, and things from other shops may not be eaten here.' }],
    uses: ['g:sonkeigo-verbs', 'g:koto-ga-dekiru', 'g:nai-de-kudasai', 'g:o-kudasai', 'g:noun-modifier', 'g:ya', 'g:made', 'g:made-ni', 'g:tai', 'g:de', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:お|お', 'v:客|きゃく', 'v:様|さま', 'v:店|みせ', 'v:買う|かう', 'v:食べ物|たべもの', 'v:飲み物|のみもの', 'v:階|かい', 'v:席|せき', 'v:召し上がる|めしあがる', 'v:外|そと', 'v:物|もの', 'v:ここ|ここ', 'v:食べる|たべる', 'v:夜|よる', 'v:時|じ', 'v:ごみ|ごみ', 'v:入口|いりぐち', 'v:そば|そば', 'v:捨てる|すてる', 'v:ください|ください', 'v:パン|パン', 'v:中|なか', 'v:人|ひと', 'v:どう|どう', 'v:一緒|いっしょ', 'k:店', 'k:買', 'k:食', 'k:物', 'k:飲', 'k:外', 'k:夜', 'k:時', 'k:入', 'k:口', 'k:中', 'k:人'],
    verified: true }),

  P({ id: 'p:n4-kanji-test', format: 'short',
    furigana: '[来週|らいしゅう]の[漢字|かんじ]のテストは、テキストの20ページから35ページまでです。[毎日|まいにち][少|すこ]しずつれんしゅうすれば、だれでもいいてんがとれるはずです。テストの[前|まえ]の[日|ひ]にたくさんれんしゅうするより、そのほうがおぼえやすいと[思|おも]います。[読|よ]み[方|かた]も[書|か]き[方|かた]もおぼえてください。テストの[日|ひ]は、じしょを[持|も]って[来|き]てはいけません。',
    en: 'Next week\'s kanji test covers pages 20 to 35 of the textbook. If you practise a little every day, anyone should be able to get a good score. I think that is easier to remember than practising a lot the day before the test. Learn both the readings and how to write them. On the day of the test you must not bring a dictionary.',
    questions: [
      { q: '[先生|せんせい]は、テストの[前|まえ]にどうしたほうがいいと[言|い]っていますか。',
        options: ['テストの[前|まえ]の[日|ひ]にたくさんれんしゅうする', '[読|よ]み[方|かた]だけおぼえる', 'じしょを[見|み]ながられんしゅうする', '[毎日|まいにち][少|すこ]しずつれんしゅうする'], answer: 3,
        explain: 'The teacher says practising a little every day (毎日少しずつ) works and is easier to remember than cramming the day before. Both readings and writing are needed, and the dictionary rule is about the test day.' }],
    uses: ['g:ba', 'g:hazu', 'g:potential', 'g:yasui', 'g:to-omou', 'g:kata', 'g:te-wa-ikemasen', 'g:hou-ga-ii', 'g:nagara', 'g:dake', 'g:mo', 'g:kara', 'g:made', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:来週|らいしゅう', 'v:漢字|かんじ', 'v:テスト|テスト', 'v:テキスト|テキスト', 'v:ページ|ページ', 'v:毎日|まいにち', 'v:少し|すこし', 'v:ずつ|ずつ', 'v:練習|れんしゅう', 'v:する|する', 'v:誰|だれ', 'v:いい|いい', 'v:点|てん', 'v:取る|とる', 'v:はず|はず', 'v:前|まえ', 'v:日|ひ', 'v:たくさん|たくさん', 'v:より|より', 'v:その|その', 'v:ほう|ほう', 'v:覚える|おぼえる', 'v:思う|おもう', 'v:読む|よむ', 'v:方|かた', 'v:書く|かく', 'v:ください|ください', 'v:辞書|じしょ', 'v:持つ|もつ', 'v:来る|くる', 'v:先生|せんせい', 'v:言う|いう', 'v:だけ|だけ', 'v:見る|みる', 'k:来', 'k:週', 'k:漢', 'k:字', 'k:毎', 'k:日', 'k:少', 'k:前', 'k:思', 'k:読', 'k:方', 'k:書', 'k:持', 'k:先', 'k:生', 'k:言', 'k:見'],
    verified: true }),

  P({ id: 'p:n4-noisy-neighbor', format: 'short',
    furigana: 'わたしの[上|うえ]のへやに[住|す]んでいる[人|ひと]は、まいばん[夜|よる]おそくまで[音楽|おんがく]を[聞|き]いています。[音|おと]が[大|おお]きいので、わたしはなかなかねられません。[先週|せんしゅう]、[話|はな]しに[行|い]こうと[思|おも]いましたが、こわい[人|ひと]だったらどうしようと[思|おも]って、[行|い]けませんでした。それで、アパートの[会社|かいしゃ]に[電話|でんわ]して、[話|はな]してもらうことにしました。',
    en: 'The person who lives in the room above mine listens to music until late every night. The sound is loud, so I can hardly sleep. Last week I thought I would go and talk to them, but I worried what I would do if they were scary, and I could not go. So I phoned the apartment company and decided to have them talk to the person.',
    questions: [
      { q: 'この[人|ひと]は、[音|おと]のことをどうすることにしましたか。',
        options: ['じぶんで[上|うえ]の[人|ひと]に[話|はな]しに[行|い]く', '[上|うえ]の[人|ひと]に[電話|でんわ]する', 'アパートの[会社|かいしゃ]から[上|うえ]の[人|ひと]に[話|はな]してもらう', 'アパートの[会社|かいしゃ]へ[話|はな]しに[行|い]く'], answer: 2,
        explain: 'The writer phoned the apartment company and decided to have them speak to the neighbour (話してもらうことにしました). Going in person was the plan that was given up, and the phone call went to the company, not the neighbour.' }],
    uses: ['g:te-iru', 'g:made', 'g:node', 'g:potential', 'g:ni-iku', 'g:volitional', 'g:you-to-omou', 'g:tara', 'g:te-morau', 'g:koto-ni-suru', 'g:noun-modifier', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:私|わたし', 'v:上|うえ', 'v:部屋|へや', 'v:住む|すむ', 'v:人|ひと', 'v:毎晩|まいばん', 'v:夜|よる', 'v:遅い|おそい', 'v:音楽|おんがく', 'v:聞く|きく', 'v:音|おと', 'v:大きい|おおきい', 'v:中々|なかなか', 'v:寝る|ねる', 'v:先週|せんしゅう', 'v:話す|はなす', 'v:行く|いく', 'v:思う|おもう', 'v:怖い|こわい', 'v:どう|どう', 'v:する|する', 'v:それで|それで', 'v:アパート|アパート', 'v:会社|かいしゃ', 'v:電話|でんわ', 'v:事|こと', 'v:自分|じぶん', 'k:上', 'k:住', 'k:人', 'k:夜', 'k:音', 'k:楽', 'k:聞', 'k:大', 'k:先', 'k:週', 'k:話', 'k:行', 'k:思', 'k:会', 'k:社', 'k:電'],
    verified: true }),

  P({ id: 'p:n4-bus-trip-change', format: 'short',
    furigana: 'みなさん\nあしたのバス[旅行|りょこう]のことです。[山|やま]の[上|うえ]は[天気|てんき]がよくないので、[山|やま]にはのぼらないで、[海|うみ]の[近|ちか]くのびじゅつかんへ[行|い]くことにしました。[集|あつ]まる[時間|じかん]とばしょはかわりません。[朝|あさ]8[時|じ]に[駅|えき]の[東|ひがし]がわに[来|き]てください。ひるご[飯|はん]はびじゅつかんのレストランで[食|た]べますので、おべんとうは[持|も]って[来|こ]なくてもいいです。',
    en: 'To everyone — About tomorrow\'s bus trip. The weather on the mountain is bad, so instead of climbing it we have decided to go to the art museum near the sea. The meeting time and place do not change: please come to the east side of the station at 8 a.m. We will have lunch at the museum restaurant, so you do not need to bring a packed lunch.',
    questions: [
      { q: 'あした、[旅行|りょこう]に[行|い]く[人|ひと]は、どうしますか。',
        options: ['[朝|あさ]8[時|じ]に[駅|えき]へ[行|い]く。おべんとうは[持|も]って[行|い]かない', '[朝|あさ]8[時|じ]に[駅|えき]へ[行|い]く。おべんとうを[持|も]って[行|い]く', '[朝|あさ]8[時|じ]にびじゅつかんへ[行|い]く。おべんとうは[持|も]って[行|い]かない', '[時間|じかん]がかわったので、[朝|あさ]9[時|じ]に[駅|えき]へ[行|い]く'], answer: 0,
        explain: 'The meeting time and place stay the same (8 a.m., station east side), and lunch is at the museum, so no packed lunch is needed (持って来なくてもいいです). The group goes to the museum by bus, so nobody goes there directly.' }],
    uses: ['g:node', 'g:nai-de', 'g:koto-ni-suru', 'g:noun-modifier', 'g:te-kudasai', 'g:nakute-mo-ii', 'g:to', 'g:de', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:皆さん|みなさん', 'v:明日|あした', 'v:バス|バス', 'v:旅行|りょこう', 'v:事|こと', 'v:山|やま', 'v:上|うえ', 'v:天気|てんき', 'v:いい|いい', 'v:登る|のぼる', 'v:海|うみ', 'v:近く|ちかく', 'v:美術館|びじゅつかん', 'v:行く|いく', 'v:する|する', 'v:集まる|あつまる', 'v:時間|じかん', 'v:場所|ばしょ', 'v:変わる|かわる', 'v:朝|あさ', 'v:時|じ', 'v:駅|えき', 'v:東|ひがし', 'v:側|がわ', 'v:来る|くる', 'v:ください|ください', 'v:昼御飯|ひるごはん', 'v:レストラン|レストラン', 'v:食べる|たべる', 'v:お弁当|おべんとう', 'v:持つ|もつ', 'v:人|ひと', 'v:どう|どう', 'k:旅', 'k:行', 'k:山', 'k:上', 'k:天', 'k:気', 'k:海', 'k:近', 'k:集', 'k:時', 'k:間', 'k:朝', 'k:駅', 'k:東', 'k:来', 'k:飯', 'k:食', 'k:持', 'k:人'],
    verified: true }),

  P({ id: 'p:n4-hospital-visits', format: 'short',
    furigana: '[病院|びょういん]からのお[知|し]らせ\n[入院|にゅういん]している[方|かた]へのおみまいは、[午後|ごご]1[時|じ]から[夜|よる]7[時|じ]までです。かぜをひいている[方|かた]は、[病院|びょういん]に[入|はい]らないでください。へやに[花|はな]をおくことはできません。[食|た]べ[物|もの]をわたしたいときは、[前|まえ]にかんごしにお[聞|き]きください。',
    en: 'Notice from the hospital — Visiting hours for inpatients are from 1 p.m. to 7 p.m. People with a cold, please do not come into the hospital. Flowers cannot be kept in the rooms. If you want to give food, please ask a nurse first.',
    questions: [
      { q: '[入院|にゅういん]している[友|とも]だちにおみまいを[持|も]って[行|い]きます。どれを[持|も]って[行|い]くとき、[前|まえ]にかんごしに[聞|き]かなければなりませんか。',
        options: ['[花|はな]', '[本|ほん]', '[写真|しゃしん]', 'ケーキ'], answer: 3,
        explain: 'Only food needs a nurse\'s OK first (食べ物をわたしたいときは…お聞きください), and cake is food. Flowers are simply not allowed, and the notice says nothing about books or photos.' }],
    uses: ['g:te-iru', 'g:nai-de-kudasai', 'g:tai', 'g:o-kudasai', 'g:nakereba-naranai', 'g:noun-modifier', 'g:kara', 'g:made', 'g:ni', 'g:no', 'g:wo', 'g:ka', 'v:病院|びょういん', 'v:お|お', 'v:知らせる|しらせる', 'v:入院|にゅういん', 'v:方|かた', 'v:お見舞い|おみまい', 'v:午後|ごご', 'v:時|じ', 'v:夜|よる', 'v:風邪|かぜ', 'v:引く|ひく', 'v:入る|はいる', 'v:ください|ください', 'v:部屋|へや', 'v:花|はな', 'v:置く|おく', 'v:事|こと', 'v:できる|できる', 'v:食べ物|たべもの', 'v:渡す|わたす', 'v:時|とき', 'v:前|まえ', 'v:看護師|かんごし', 'v:聞く|きく', 'v:友達|ともだち', 'v:持つ|もつ', 'v:行く|いく', 'v:どれ|どれ', 'v:ケーキ|ケーキ', 'v:本|ほん', 'v:写真|しゃしん', 'k:病', 'k:院', 'k:知', 'k:入', 'k:方', 'k:午', 'k:後', 'k:時', 'k:夜', 'k:花', 'k:食', 'k:物', 'k:前', 'k:聞', 'k:友', 'k:持', 'k:行', 'k:本', 'k:写', 'k:真'],
    verified: true }),

  P({ id: 'p:n4-piano-daughter', format: 'short',
    furigana: 'むすめは5さいの[時|とき]からピアノを[習|なら]っています。はじめはわたしが[習|なら]わせたので、あまりすきではなかったようです。でも、[去年|きょねん]、[小|ちい]さなコンサートでひいてから、[毎日|まいにち]じぶんでれんしゅうしはじめました。[今|いま]は、[大|おお]きくなったらピアノの[先生|せんせい]になりたいと[言|い]っています。',
    en: 'My daughter has been learning the piano since she was five. At first I was the one who made her take lessons, so it seems she did not like it much. But last year, after she played at a small concert, she started practising by herself every day. Now she says she wants to be a piano teacher when she grows up.',
    questions: [
      { q: 'むすめさんは、いつから[毎日|まいにち]じぶんでれんしゅうしていますか。',
        options: ['5さいの[時|とき]から', '[去年|きょねん]、コンサートでひいてから', 'ピアノを[習|なら]いはじめた[時|とき]から', 'ピアノの[先生|せんせい]になりたいと[思|おも]ってから'], answer: 1,
        explain: 'She started practising on her own after playing at a concert last year (コンサートでひいてから). Five is when the lessons began, and at first she did not like them; wanting to be a teacher is what she says now.' }],
    uses: ['g:te-iru', 'g:causative', 'g:node', 'g:amari-nai', 'g:you-da', 'g:te-kara', 'g:stem-compounds', 'g:tara', 'g:naru', 'g:tai', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:娘|むすめ', 'v:歳|さい', 'v:時|とき', 'v:ピアノ|ピアノ', 'v:習う|ならう', 'v:初め|はじめ', 'v:私|わたし', 'v:余り|あまり', 'v:好き|すき', 'v:でも|でも', 'v:去年|きょねん', 'v:小さな|ちいさな', 'v:コンサート|コンサート', 'v:弾く|ひく', 'v:毎日|まいにち', 'v:自分|じぶん', 'v:練習|れんしゅう', 'v:始める|はじめる', 'v:今|いま', 'v:大きい|おおきい', 'v:なる|なる', 'v:先生|せんせい', 'v:言う|いう', 'v:いつ|いつ', 'v:思う|おもう', 'v:さん|さん', 'k:時', 'k:習', 'k:去', 'k:年', 'k:小', 'k:毎', 'k:日', 'k:今', 'k:大', 'k:先', 'k:生', 'k:言', 'k:思'],
    verified: true }),

  P({ id: 'p:n4-bicycle-parking', format: 'short',
    furigana: '[自転車|じてんしゃ]をとめる[方|かた]へ\n[駅|えき]の[前|まえ]に[自転車|じてんしゃ]をとめないでください。[駅|えき]の[前|まえ]にとめた[自転車|じてんしゃ]は、[町|まち]の[人|ひと]が[運|はこ]んでいきます。[自転車|じてんしゃ]は、[駅|えき]の[北|きた]がわのばしょにとめてください。1[日|にち]100[円|えん]です。[運|はこ]ばれた[自転車|じてんしゃ]をとりに[行|い]くときは、2,000[円|えん]はらわなければなりません。',
    en: 'To cyclists — Please do not park bicycles in front of the station. Bicycles parked there will be taken away by the town. Park your bicycle at the place on the north side of the station: 100 yen a day. To collect a bicycle that was taken away, you have to pay 2,000 yen.',
    questions: [
      { q: '[駅|えき]の[前|まえ]に[自転車|じてんしゃ]をとめると、どうなりますか。',
        options: ['[自転車|じてんしゃ]が[運|はこ]ばれて、とりに[行|い]くときに2,000[円|えん]かかる', '[北|きた]がわのばしょに[運|はこ]ばれて、1[日|にち]100[円|えん]かかる', '[町|まち]の[人|ひと]に[注意|ちゅうい]されるだけで、お[金|かね]はかからない', '[自転車|じてんしゃ]をなくしてしまうが、お[金|かね]ははらわなくてもいい'], answer: 0,
        explain: 'Bicycles left in front of the station are taken away, and getting one back costs 2,000 yen. 100 yen a day is the fee of the proper parking place on the north side, which is where you should park in the first place.' }],
    uses: ['g:nai-de-kudasai', 'g:noun-modifier', 'g:te-iku', 'g:te-kudasai', 'g:passive', 'g:ni-iku', 'g:nakereba-naranai', 'g:to-conditional', 'g:dake', 'g:te-shimau', 'g:nakute-mo-ii', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:自転車|じてんしゃ', 'v:止める|とめる', 'v:方|かた', 'v:駅|えき', 'v:前|まえ', 'v:町|まち', 'v:人|ひと', 'v:運ぶ|はこぶ', 'v:北|きた', 'v:側|がわ', 'v:場所|ばしょ', 'v:ください|ください', 'v:日|にち', 'v:円|えん', 'v:取る|とる', 'v:行く|いく', 'v:時|とき', 'v:払う|はらう', 'v:どう|どう', 'v:なる|なる', 'v:かかる|かかる', 'v:注意|ちゅうい', 'v:だけ|だけ', 'v:お金|おかね', 'v:無くす|なくす', 'k:自', 'k:転', 'k:車', 'k:方', 'k:駅', 'k:前', 'k:町', 'k:人', 'k:運', 'k:北', 'k:日', 'k:円', 'k:行', 'k:注', 'k:意', 'k:金'],
    verified: true }),

  P({ id: 'p:n4-cancel-movie', format: 'short',
    furigana: 'ユイさん\nごめんなさい。[今日|きょう]いっしょに[映画|えいが]を[見|み]るやくそくだったのに、[行|い]けなくなってしまいました。アルバイトの[人|ひと]がかぜで[休|やす]んだので、[店|みせ]の[人|ひと]に[夕方|ゆうがた]から[来|き]てほしいとたのまれたんです。[映画|えいが]は[来週|らいしゅう]の[日曜日|にちようび]でもいいですか。きっぷはわたしが[買|か]っておきます。\nサラ',
    en: 'Yui — I\'m sorry. We promised to see a film together today, but I can\'t go any more. A part-timer is off with a cold, and the shop asked me to come in from the evening. Is next Sunday all right for the film? I\'ll buy the tickets beforehand. — Sara',
    questions: [
      { q: 'サラさんは、どうして[映画|えいが]に[行|い]けなくなりましたか。',
        options: ['かぜをひいてしまったから', '[映画|えいが]のきっぷが[買|か]えなかったから', 'アルバイトに[行|い]かなければならなくなったから', '[来週|らいしゅう]の[日曜日|にちようび]にアルバイトがあるから'], answer: 2,
        explain: 'A co-worker is off sick, and the shop asked Sara to come in from the evening, so she has to work. The cold is the co-worker\'s, the tickets are still to be bought, and next Sunday is her new date for the film.' }],
    names: ['ユイ', 'サラ'],
    notes: 'ごめんなさい is an expression outside the catalog; not listed in uses.',
    uses: ['g:noni', 'g:potential', 'g:naru', 'g:te-shimau', 'g:node', 'g:te-hoshii', 'g:passive', 'g:n-desu', 'g:te-mo-ii', 'g:te-oku', 'g:nakereba-naranai', 'g:doushite', 'g:kara', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:さん|さん', 'v:今日|きょう', 'v:一緒|いっしょ', 'v:映画|えいが', 'v:見る|みる', 'v:約束|やくそく', 'v:行く|いく', 'v:なる|なる', 'v:アルバイト|アルバイト', 'v:人|ひと', 'v:風邪|かぜ', 'v:休む|やすむ', 'v:店|みせ', 'v:夕方|ゆうがた', 'v:来る|くる', 'v:頼む|たのむ', 'v:来週|らいしゅう', 'v:日曜日|にちようび', 'v:いい|いい', 'v:切符|きっぷ', 'v:私|わたし', 'v:買う|かう', 'v:どうして|どうして', 'v:引く|ひく', 'v:ある|ある', 'k:今', 'k:日', 'k:映', 'k:画', 'k:見', 'k:行', 'k:人', 'k:休', 'k:店', 'k:夕', 'k:方', 'k:来', 'k:週', 'k:曜', 'k:買'],
    verified: true }),

  P({ id: 'p:n4-supermarket-weekend', format: 'short',
    furigana: 'スーパー[東|ひがし]からのお[知|し]らせ\n[今週|こんしゅう]の[土曜日|どようび]と[日曜日|にちようび]は、[肉|にく]と[魚|さかな]がぜんぶいつものはんぶんのねだんになります。でも、[午後|ごご]5[時|じ]からです。やさいは[日曜日|にちようび]の[朝|あさ]だけ、どれでも100[円|えん]です。お[店|みせ]は[朝|あさ]9[時|じ]から[夜|よる]10[時|じ]まであいています。みなさん、ぜひ[来|き]てください。',
    en: 'News from Supermarket Higashi — This Saturday and Sunday all meat and fish will be half the usual price, but only from 5 p.m. Vegetables are 100 yen each, whichever you choose, on Sunday morning only. The shop is open from 9 a.m. to 10 p.m. Do come, everyone.',
    questions: [
      { q: '[肉|にく]を[安|やす]く[買|か]いたい[人|ひと]は、いつ[行|い]けばいいですか。',
        options: ['[日曜日|にちようび]の[朝|あさ]', '[土曜日|どようび]か[日曜日|にちようび]の[午後|ごご]5[時|じ]から', '[土曜日|どようび]の[朝|あさ]から', '[今週|こんしゅう]の[月曜日|げつようび]の[午後|ごご]5[時|じ]から'], answer: 1,
        explain: 'Meat is half price on Saturday and Sunday, but only from 5 p.m. (でも、午後5時からです). Sunday morning is the vegetable sale, and the sale does not include Monday.' }],
    names: ['東|ひがし'],
    uses: ['g:naru', 'g:dake', 'g:demo', 'g:te-kudasai', 'g:tai', 'g:ba', 'g:ka-ka', 'g:to', 'g:kara', 'g:no', 'g:wo', 'g:ka', 'v:スーパー|スーパー', 'v:お|お', 'v:知らせる|しらせる', 'v:今週|こんしゅう', 'v:土曜日|どようび', 'v:日曜日|にちようび', 'v:肉|にく', 'v:魚|さかな', 'v:全部|ぜんぶ', 'v:いつも|いつも', 'v:半分|はんぶん', 'v:値段|ねだん', 'v:なる|なる', 'v:でも|でも', 'v:午後|ごご', 'v:時|じ', 'v:野菜|やさい', 'v:朝|あさ', 'v:だけ|だけ', 'v:どれ|どれ', 'v:円|えん', 'v:店|みせ', 'v:夜|よる', 'v:開く|あく', 'v:皆さん|みなさん', 'v:是非|ぜひ', 'v:来る|くる', 'v:ください|ください', 'v:安い|やすい', 'v:買う|かう', 'v:人|ひと', 'v:いつ|いつ', 'v:行く|いく', 'v:いい|いい', 'v:月曜日|げつようび', 'k:東', 'k:知', 'k:今', 'k:週', 'k:土', 'k:曜', 'k:日', 'k:肉', 'k:魚', 'k:午', 'k:後', 'k:時', 'k:朝', 'k:円', 'k:店', 'k:夜', 'k:来', 'k:安', 'k:買', 'k:人', 'k:行', 'k:月'],
    verified: true }),

  P({ id: 'p:n4-translation-job', format: 'short',
    furigana: 'わたしは[今月|こんげつ]から[東京|とうきょう]の[会社|かいしゃ]ではたらいています。[会社|かいしゃ]では、[英語|えいご]の[手紙|てがみ]を[日本|にほん][語|ご]にほんやくしています。わからないことばがあったら、となりのせきのせんぱいに[聞|き]いてみます。せんぱいはいつもていねいに[教|おし]えてくれます。[仕事|しごと]はまだむずかしいですが、とても[楽|たの]しいです。[来月|らいげつ]からは、[一人|ひとり]でほんやくをするよていです。',
    en: 'Since this month I have been working at a company in Tokyo. At work I translate English letters into Japanese. When there is a word I do not know, I try asking the senior colleague at the next desk, who always explains things carefully. The work is still difficult, but it is a lot of fun. From next month I am scheduled to translate on my own.',
    questions: [
      { q: 'この[人|ひと]は、わからないことばがあったとき、どうしますか。',
        options: ['[一人|ひとり]でじしょでしらべる', '[英語|えいご]の[先生|せんせい]に[聞|き]く', '[来月|らいげつ]まで[待|ま]つ', 'となりのせきのせんぱいに[聞|き]く'], answer: 3,
        explain: 'わからないことばがあったら、となりのせきのせんぱいに聞いてみます: the writer asks the senior colleague at the next desk. Working alone (一人で) only starts next month, and no dictionary or teacher is mentioned.' }],
    names: ['東京|とうきょう', '日本|にほん'],
    uses: ['g:te-iru', 'g:tara', 'g:te-miru', 'g:te-kureru', 'g:yotei-da', 'g:noun-modifier', 'g:kara', 'g:de', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:私|わたし', 'v:今月|こんげつ', 'v:会社|かいしゃ', 'v:働く|はたらく', 'v:英語|えいご', 'v:手紙|てがみ', 'v:語|ご', 'v:翻訳|ほんやく', 'v:分かる|わかる', 'v:言葉|ことば', 'v:ある|ある', 'v:隣|となり', 'v:席|せき', 'v:先輩|せんぱい', 'v:聞く|きく', 'v:いつも|いつも', 'v:丁寧|ていねい', 'v:教える|おしえる', 'v:仕事|しごと', 'v:まだ|まだ', 'v:難しい|むずかしい', 'v:とても|とても', 'v:楽しい|たのしい', 'v:来月|らいげつ', 'v:一人|ひとり', 'v:する|する', 'v:予定|よてい', 'v:人|ひと', 'v:時|とき', 'v:どう|どう', 'v:辞書|じしょ', 'v:調べる|しらべる', 'v:先生|せんせい', 'v:待つ|まつ', 'k:今', 'k:月', 'k:東', 'k:京', 'k:会', 'k:社', 'k:英', 'k:語', 'k:手', 'k:紙', 'k:日', 'k:本', 'k:聞', 'k:教', 'k:仕', 'k:事', 'k:楽', 'k:来', 'k:一', 'k:人', 'k:先', 'k:生', 'k:待'],
    verified: true }),

  P({ id: 'p:n4-meeting-moved', format: 'short',
    furigana: '[田中|たなか]さん\nあしたの[午後|ごご]2[時|じ]からのかいぎですが、かちょうが[急|きゅう]に[病院|びょういん]へ[行|い]かなければならなくなったので、[木曜日|もくようび]の[午前|ごぜん]10[時|じ]にかわりました。ばしょは[同|おな]じ3かいのかいぎしつです。かいぎで[使|つか]う[紙|かみ]は、[水曜日|すいようび]までに20まい[用意|ようい]しておいてください。\n[山田|やまだ]',
    en: 'Mr./Ms. Tanaka — About tomorrow\'s 2 p.m. meeting: the section chief suddenly has to go to hospital, so it has moved to Thursday at 10 a.m. The place is the same meeting room on the third floor. Please have 20 copies of the handout for the meeting ready by Wednesday. — Yamada',
    questions: [
      { q: '[田中|たなか]さんは、いつまでに[何|なに]をしておかなければなりませんか。',
        options: ['[木曜日|もくようび]までに、[紙|かみ]を[用意|ようい]する', 'あしたの[午後|ごご]2[時|じ]までに、かいぎしつへ[行|い]く', '[水曜日|すいようび]までに、[紙|かみ]を[用意|ようい]する', '[水曜日|すいようび]までに、[病院|びょういん]へ[行|い]く'], answer: 2,
        explain: 'The last request is 水曜日までに…用意しておいてください: the handout must be ready by Wednesday. Thursday is the new meeting day, tomorrow at 2 is the old time, and the hospital is where the section chief goes.' }],
    names: ['田中|たなか', '山田|やまだ'],
    uses: ['g:nakereba-naranai', 'g:naru', 'g:node', 'g:te-oku', 'g:te-kudasai', 'g:made-ni', 'g:noun-modifier', 'g:ga', 'g:no', 'g:ni', 'g:de', 'g:wo', 'g:ka', 'v:さん|さん', 'v:明日|あした', 'v:午後|ごご', 'v:時|じ', 'v:会議|かいぎ', 'v:課長|かちょう', 'v:急|きゅう', 'v:病院|びょういん', 'v:行く|いく', 'v:なる|なる', 'v:木曜日|もくようび', 'v:午前|ごぜん', 'v:変わる|かわる', 'v:場所|ばしょ', 'v:同じ|おなじ', 'v:階|かい', 'v:会議室|かいぎしつ', 'v:使う|つかう', 'v:紙|かみ', 'v:水曜日|すいようび', 'v:枚|まい', 'v:用意|ようい', 'v:する|する', 'v:ください|ください', 'v:何|なに', 'k:田', 'k:中', 'k:午', 'k:後', 'k:時', 'k:急', 'k:病', 'k:院', 'k:行', 'k:木', 'k:曜', 'k:日', 'k:前', 'k:同', 'k:使', 'k:紙', 'k:水', 'k:用', 'k:意', 'k:山', 'k:何'],
    verified: true }),

  P({ id: 'p:n4-library-overdue', format: 'short',
    furigana: '[山田|やまだ]さま\n[東|ひがし][図書館|としょかん]です。5[月|がつ]15[日|にち]にお[借|か]りになった[本|ほん]2さつが、まだかえされていません。かえす[日|ひ]は5[月|がつ]29[日|にち]でした。なるべく[早|はや]く、うけつけにかえしてください。[図書館|としょかん]がしまっている[時|とき]は、[入口|いりぐち]の[右|みぎ]にあるはこに[入|い]れてください。',
    en: 'Dear Mr./Ms. Yamada — This is Higashi Library. The two books you borrowed on 15 May have not been returned yet. They were due on 29 May. Please return them to the front desk as soon as possible. When the library is closed, please put them in the box to the right of the entrance.',
    questions: [
      { q: '[図書館|としょかん]がしまっている[時|とき]、[本|ほん]をどうしますか。',
        options: ['[入口|いりぐち]の[右|みぎ]にあるはこに[入|い]れる', 'うけつけにかえす', '5[月|がつ]29[日|にち]にかえす', 'つぎの[日|ひ]にうけつけにかえす'], answer: 0,
        explain: 'For times when the library is closed, the notice says 入口の右にあるはこに入れてください: use the box by the entrance. The front desk is for opening hours, and 29 May was the due date, already past.' }],
    names: ['山田|やまだ'],
    uses: ['g:o-ni-naru', 'g:passive', 'g:mada', 'g:te-iru', 'g:te-kudasai', 'g:noun-modifier', 'g:wa-desu', 'g:deshita', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:様|さま', 'v:東|ひがし', 'v:図書館|としょかん', 'v:月|がつ', 'v:日|にち', 'v:お|お', 'v:借りる|かりる', 'v:なる|なる', 'v:本|ほん', 'v:冊|さつ', 'v:まだ|まだ', 'v:返す|かえす', 'v:日|ひ', 'v:なるべく|なるべく', 'v:早い|はやい', 'v:受付|うけつけ', 'v:閉まる|しまる', 'v:時|とき', 'v:入口|いりぐち', 'v:右|みぎ', 'v:ある|ある', 'v:箱|はこ', 'v:入れる|いれる', 'v:ください|ください', 'v:次|つぎ', 'v:どう|どう', 'k:山', 'k:田', 'k:東', 'k:図', 'k:書', 'k:館', 'k:月', 'k:日', 'k:借', 'k:本', 'k:早', 'k:時', 'k:入', 'k:口', 'k:右'],
    verified: true }),

  P({ id: 'p:n4-dentist-reschedule', format: 'short',
    furigana: 'リンさま\n[中川|なかがわ]はいしゃのうけつけです。あしたの[午後|ごご]4[時|じ]のよやくですが、[先生|せんせい]がかぜをひいてしまったので、お[休|やす]みになりました。つぎのよやくは、[金曜日|きんようび]の[午前|ごぜん]か[土曜日|どようび]の[午後|ごご]ならとれます。ごつごうのいい[日|ひ]を、[今日|きょう]の[夕方|ゆうがた]までにお[知|し]らせください。',
    en: 'Dear Lin — This is the front desk of Nakagawa Dental. About your 4 p.m. appointment tomorrow: the dentist has caught a cold, so we will be closed. We can offer Friday morning or Saturday afternoon for the next appointment. Please let us know which day suits you by this evening.',
    questions: [
      { q: 'リンさんは[今日|きょう]、[何|なに]をしなければなりませんか。',
        options: ['あしたの[午後|ごご]4[時|じ]にはいしゃへ[行|い]く', '[金曜日|きんようび]の[午前|ごぜん]にはいしゃへ[行|い]く', '[今日|きょう]の[夕方|ゆうがた]にはいしゃへ[行|い]く', 'つごうのいい[日|ひ]を、[夕方|ゆうがた]までにはいしゃに[知|し]らせる'], answer: 3,
        explain: 'The message ends with 今日の夕方までにお知らせください: Lin must tell the clinic which day suits her by this evening. Tomorrow at 4 is cancelled, and Friday morning is only one of two choices she has not made yet. The evening is a deadline, not a visit.' }],
    names: ['リン', '中川|なかがわ'],
    uses: ['g:te-shimau', 'g:node', 'g:naru', 'g:nara', 'g:potential', 'g:o-kudasai', 'g:made-ni', 'g:ka-ka', 'g:nakereba-naranai', 'g:no', 'g:ga', 'g:wo', 'g:ka', 'v:様|さま', 'v:歯医者|はいしゃ', 'v:受付|うけつけ', 'v:明日|あした', 'v:午後|ごご', 'v:時|じ', 'v:予約|よやく', 'v:先生|せんせい', 'v:風邪|かぜ', 'v:引く|ひく', 'v:お|お', 'v:休み|やすみ', 'v:なる|なる', 'v:次|つぎ', 'v:金曜日|きんようび', 'v:午前|ごぜん', 'v:土曜日|どようび', 'v:取る|とる', 'v:ご|ご', 'v:都合|つごう', 'v:いい|いい', 'v:日|ひ', 'v:今日|きょう', 'v:夕方|ゆうがた', 'v:知らせる|しらせる', 'v:ください|ください', 'v:さん|さん', 'v:何|なに', 'v:する|する', 'v:行く|いく', 'k:中', 'k:川', 'k:午', 'k:後', 'k:時', 'k:先', 'k:生', 'k:休', 'k:金', 'k:曜', 'k:日', 'k:前', 'k:土', 'k:今', 'k:夕', 'k:方', 'k:知', 'k:何', 'k:行'],
    verified: true }),

  P({ id: 'p:n4-garbage-days', format: 'short',
    furigana: 'アパートに[住|す]んでいるみなさんへ\nだいどころのごみは[月曜日|げつようび]と[木曜日|もくようび]、ふるい[新聞|しんぶん]やざっしは[水曜日|すいようび]です。どれも[朝|あさ]8[時|じ]までに[出|だ]してください。[前|まえ]の[日|ひ]の[夜|よる]に[出|だ]すと、[鳥|とり]にごみを[食|た]べられてしまいますので、[夜|よる]は[出|だ]さないでください。わからないことがあったら、101の[山田|やまだ]に[聞|き]いてください。',
    en: 'To everyone living in the apartment building — Kitchen rubbish goes out on Mondays and Thursdays, old newspapers and magazines on Wednesdays. Put everything out by 8 a.m. If you put it out the night before, birds eat the rubbish, so please do not put it out at night. If anything is unclear, ask Yamada in 101.',
    questions: [
      { q: 'ふるいざっしを[出|だ]したい[人|ひと]は、いつ[出|だ]しますか。',
        options: ['[火曜日|かようび]の[夜|よる]に', '[水曜日|すいようび]の[朝|あさ]8[時|じ]までに', '[月曜日|げつようび]か[木曜日|もくようび]の[朝|あさ]に', '[水曜日|すいようび]の[夜|よる]に'], answer: 1,
        explain: 'Magazines go out on Wednesday, and everything must be out by 8 a.m. Tuesday night is the night before, which the notice forbids (birds). Monday and Thursday are for kitchen rubbish.' }],
    names: ['山田|やまだ'],
    uses: ['g:te-iru', 'g:ya', 'g:made-ni', 'g:te-kudasai', 'g:to-conditional', 'g:passive', 'g:te-shimau', 'g:node', 'g:nai-de-kudasai', 'g:tara', 'g:noun-modifier', 'g:to', 'g:ni', 'g:no', 'g:wo', 'g:ka', 'g:tai', 'v:アパート|アパート', 'v:住む|すむ', 'v:皆さん|みなさん', 'v:台所|だいどころ', 'v:ごみ|ごみ', 'v:月曜日|げつようび', 'v:木曜日|もくようび', 'v:古い|ふるい', 'v:新聞|しんぶん', 'v:雑誌|ざっし', 'v:水曜日|すいようび', 'v:どれ|どれ', 'v:朝|あさ', 'v:時|じ', 'v:出す|だす', 'v:前|まえ', 'v:日|ひ', 'v:夜|よる', 'v:鳥|とり', 'v:食べる|たべる', 'v:分かる|わかる', 'v:事|こと', 'v:ある|ある', 'v:聞く|きく', 'v:ください|ください', 'v:人|ひと', 'v:いつ|いつ', 'v:火曜日|かようび', 'k:住', 'k:月', 'k:曜', 'k:日', 'k:木', 'k:新', 'k:聞', 'k:水', 'k:朝', 'k:時', 'k:出', 'k:前', 'k:夜', 'k:鳥', 'k:食', 'k:山', 'k:田', 'k:人', 'k:火'],
    verified: true }),

  P({ id: 'p:n4-cafe-job', format: 'short',
    furigana: 'わたしは[先月|せんげつ]から、[駅|えき]の[前|まえ]のきっさてんでアルバイトをしています。はじめは[料理|りょうり]の[名前|なまえ]がなかなかおぼえられなくて、よく[店|みせ]の[人|ひと]に[注意|ちゅうい]されました。でも、このごろは[少|すこ]しなれてきました。きのうは、いつも[来|く]るおじいさんに「ありがとう」と[言|い]われて、とてもうれしかったです。',
    en: 'Since last month I have been working part-time at a café in front of the station. At first I could not remember the names of the dishes, and the staff often warned me. But these days I have got a little used to it. Yesterday an old man who always comes said "thank you" to me, and I was very happy.',
    questions: [
      { q: 'この[人|ひと]は、[今|いま]アルバイトについてどう[言|い]っていますか。',
        options: ['[少|すこ]しなれてきた', 'まだ[料理|りょうり]の[名前|なまえ]がおぼえられない', '[店|みせ]の[人|ひと]によく[注意|ちゅうい]される', 'おじいさんに「ありがとう」と[言|い]いたい'], answer: 0,
        explain: 'このごろは少しなれてきました: these days the writer has got a little used to the job. Not remembering the dishes and being warned were at first (はじめは). It was the old man who said thank you, to the writer.' }],
    uses: ['g:te-iru', 'g:potential', 'g:nakute', 'g:passive', 'g:te-kuru', 'g:adj-i', 'g:mashita', 'g:kara', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:tai', 'v:私|わたし', 'v:先月|せんげつ', 'v:駅|えき', 'v:前|まえ', 'v:喫茶店|きっさてん', 'v:アルバイト|アルバイト', 'v:する|する', 'v:初め|はじめ', 'v:料理|りょうり', 'v:名前|なまえ', 'v:中々|なかなか', 'v:覚える|おぼえる', 'v:よく|よく', 'v:店|みせ', 'v:人|ひと', 'v:注意|ちゅうい', 'v:でも|でも', 'v:この頃|このごろ', 'v:少し|すこし', 'v:慣れる|なれる', 'v:昨日|きのう', 'v:いつも|いつも', 'v:来る|くる', 'v:おじいさん|おじいさん', 'v:言う|いう', 'v:とても|とても', 'v:嬉しい|うれしい', 'v:今|いま', 'v:どう|どう', 'k:先', 'k:月', 'k:駅', 'k:前', 'k:料', 'k:理', 'k:名', 'k:店', 'k:人', 'k:注', 'k:意', 'k:少', 'k:来', 'k:言', 'k:今'],
    verified: true }),

  P({ id: 'p:n4-train-delay', format: 'short',
    furigana: 'おきゃくさまへ\n[今朝|けさ]から[強|つよ]い[雨|あめ]がふっているため、[電車|でんしゃ]が30ぷんぐらいおくれております。[急|いそ]いでいるおきゃくさまは、[駅|えき]の[前|まえ]から[出|で]ているバスをごりようください。バスのきっぷは[駅|えき]の[中|なか]では[売|う]っておりませんので、バスの[中|なか]でおはらいください。',
    en: 'To our passengers — Because of heavy rain since this morning, trains are running about 30 minutes late. Passengers in a hurry, please use the bus that leaves from in front of the station. Bus tickets are not sold inside the station, so please pay on the bus.',
    questions: [
      { q: '[急|いそ]いでいる[人|ひと]は、どうしたらいいですか。',
        options: ['[駅|えき]の[中|なか]でバスのきっぷを[買|か]って、バスにのる', '30ぷん[待|ま]って、[電車|でんしゃ]にのる', '[駅|えき]の[前|まえ]からバスにのって、バスの[中|なか]でお[金|かね]をはらう', '[駅|えき]の[前|まえ]で[電車|でんしゃ]のきっぷを[買|か]う'], answer: 2,
        explain: 'People in a hurry are told to take the bus from the station front, and since bus tickets are not sold in the station, to pay on the bus. Waiting 30 minutes is for those who are not in a hurry.' }],
    notes: 'おります (humble いる) is not a catalog grammar point; it is not listed in uses.',
    uses: ['g:te-iru', 'g:o-kudasai', 'g:node', 'g:tara', 'g:noun-modifier', 'g:kara', 'g:de', 'g:ga', 'g:no', 'g:wo', 'g:ka', 'v:お|お', 'v:様|さま', 'v:今朝|けさ', 'v:強い|つよい', 'v:雨|あめ', 'v:降る|ふる', 'v:為|ため', 'v:電車|でんしゃ', 'v:遅れる|おくれる', 'v:急ぐ|いそぐ', 'v:駅|えき', 'v:前|まえ', 'v:出る|でる', 'v:バス|バス', 'v:ご|ご', 'v:利用|りよう', 'v:ください|ください', 'v:切符|きっぷ', 'v:中|なか', 'v:売る|うる', 'v:払う|はらう', 'v:人|ひと', 'v:どう|どう', 'v:する|する', 'v:いい|いい', 'v:乗る|のる', 'v:お金|おかね', 'v:買う|かう', 'v:待つ|まつ', 'k:今', 'k:朝', 'k:強', 'k:雨', 'k:電', 'k:車', 'k:急', 'k:駅', 'k:前', 'k:出', 'k:中', 'k:売', 'k:人', 'k:買', 'k:待', 'k:金'],
    verified: true }),

  P({ id: 'p:n4-lost-wallet', format: 'short',
    furigana: 'きのう、[電車|でんしゃ]の[中|なか]でさいふをなくしてしまいました。[駅|えき]の[人|ひと]に[話|はな]すと、「[見|み]つかったら[電話|でんわ]します」と[言|い]われました。[夜|よる]、[電話|でんわ]があって、となりの[駅|えき]でさいふが[見|み]つかったそうです。[中|なか]のお[金|かね]もきっぷもそのままでした。[今日|きょう]、[会社|かいしゃ]の[帰|かえ]りにとりに[行|い]くつもりです。',
    en: 'Yesterday I lost my wallet on the train. When I told the station staff, they said, "We will call you if it turns up." In the evening they called: it seems the wallet was found at the next station. The money and the tickets inside were untouched. Today I plan to go and pick it up on my way home from work.',
    questions: [
      { q: 'この[人|ひと]は[今日|きょう]、[何|なに]をしますか。',
        options: ['[電車|でんしゃ]の[中|なか]でさいふをさがす', '[会社|かいしゃ]から[帰|かえ]る[時|とき]に、となりの[駅|えき]へさいふをとりに[行|い]く', '[駅|えき]の[人|ひと]に[電話|でんわ]する', '[会社|かいしゃ]へ[行|い]く[前|まえ]に、さいふをとりに[行|い]く'], answer: 1,
        explain: 'The wallet was found at the next station, and the writer will pick it up 会社の帰りに, on the way home from work, not before work. The station staff already called, so there is no need to search or to call.' }],
    uses: ['g:te-shimau', 'g:to-conditional', 'g:tara', 'g:passive', 'g:sou-da-hearsay', 'g:tsumori', 'g:ni-iku', 'g:mo', 'g:mashita', 'g:de', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:昨日|きのう', 'v:電車|でんしゃ', 'v:中|なか', 'v:財布|さいふ', 'v:無くす|なくす', 'v:駅|えき', 'v:人|ひと', 'v:話す|はなす', 'v:見つかる|みつかる', 'v:電話|でんわ', 'v:する|する', 'v:言う|いう', 'v:夜|よる', 'v:ある|ある', 'v:隣|となり', 'v:お金|おかね', 'v:切符|きっぷ', 'v:その|その', 'v:まま|まま', 'v:今日|きょう', 'v:会社|かいしゃ', 'v:帰り|かえり', 'v:取る|とる', 'v:行く|いく', 'v:つもり|つもり', 'v:何|なに', 'v:帰る|かえる', 'v:時|とき', 'v:探す|さがす', 'v:前|まえ', 'k:電', 'k:車', 'k:中', 'k:駅', 'k:人', 'k:話', 'k:見', 'k:言', 'k:夜', 'k:金', 'k:今', 'k:日', 'k:会', 'k:社', 'k:帰', 'k:行', 'k:何', 'k:時', 'k:前'],
    verified: true }),

  P({ id: 'p:n4-report-extension', format: 'short',
    furigana: '[田中|たなか][先生|せんせい]\n[日本|にほん][語|ご]クラスのキムです。[月曜日|げつようび]までに[出|だ]すレポートのことですが、[病気|びょうき]で1[週間|しゅうかん][学校|がっこう]を[休|やす]んでいたので、まだはんぶんしか[書|か]けていません。すみませんが、[水曜日|すいようび]まで[待|ま]っていただけませんか。[木曜日|もくようび]からはまた[学校|がっこう]に[行|い]けると[思|おも]います。',
    en: 'Professor Tanaka — This is Kim from the Japanese class. About the report due by Monday: I was off school sick for a week, so I have only written half of it. I\'m sorry, but could you possibly wait until Wednesday? I think I will be able to come to school again from Thursday.',
    questions: [
      { q: 'キムさんは[先生|せんせい]に[何|なに]をたのんでいますか。',
        options: ['レポートを[月曜日|げつようび]までに[読|よ]んでほしい', '[病気|びょうき]なので、[木曜日|もくようび]までクラスを[休|やす]ませてほしい', 'レポートをはんぶんだけ[出|だ]させてほしい', 'レポートを[出|だ]す[日|ひ]を[水曜日|すいようび]にしてほしい'], answer: 3,
        explain: '水曜日まで待っていただけませんか asks the teacher to wait until Wednesday for the report. Monday is the original deadline, Thursday is when Kim expects to be back (not a request), and half is how much is written so far.' }],
    names: ['田中|たなか', 'キム', '日本|にほん'],
    notes: 'すみません is not a catalog word (an expression); it is not listed in uses.',
    uses: ['g:made-ni', 'g:te-ita', 'g:node', 'g:shika-nai', 'g:potential', 'g:te-itadakemasen-ka', 'g:to-omou', 'g:made', 'g:te-hoshii', 'g:causative', 'g:noun-modifier', 'g:dake', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:先生|せんせい', 'v:語|ご', 'v:クラス|クラス', 'v:月曜日|げつようび', 'v:出す|だす', 'v:レポート|レポート', 'v:事|こと', 'v:病気|びょうき', 'v:週間|しゅうかん', 'v:学校|がっこう', 'v:休む|やすむ', 'v:まだ|まだ', 'v:半分|はんぶん', 'v:書く|かく', 'v:水曜日|すいようび', 'v:待つ|まつ', 'v:木曜日|もくようび', 'v:また|また', 'v:行く|いく', 'v:思う|おもう', 'v:頼む|たのむ', 'v:日|ひ', 'v:する|する', 'v:読む|よむ', 'v:だけ|だけ', 'v:何|なに', 'v:さん|さん', 'k:田', 'k:中', 'k:先', 'k:生', 'k:日', 'k:本', 'k:語', 'k:月', 'k:曜', 'k:出', 'k:病', 'k:気', 'k:週', 'k:間', 'k:学', 'k:校', 'k:休', 'k:書', 'k:水', 'k:待', 'k:木', 'k:行', 'k:思', 'k:何', 'k:読'],
    verified: true }),

  P({ id: 'p:n4-pool-rules', format: 'short',
    furigana: 'しみんプールのごあんない\nプールに[入|はい]る[前|まえ]に、かならずシャワーをあびてください。プールではぼうしをかぶらなければなりません。ぼうしをわすれた[人|ひと]は、うけつけで[借|か]りることができます（100[円|えん]）。12さいまでの[子|こ]どもは、[大人|おとな]といっしょでなければ[入|はい]れません。',
    en: 'Guide to the city pool — Always take a shower before getting into the pool. A swimming cap must be worn in the pool. If you forgot your cap, you can borrow one at the front desk (100 yen). Children aged 12 and under cannot go in unless they are with an adult.',
    questions: [
      { q: 'このプールについて、[正|ただ]しいものはどれですか。',
        options: ['ぼうしは、うけつけでお[金|かね]をはらわないで[借|か]りられる', '[子|こ]どもは、[一人|ひとり]でプールに[入|はい]ってもいい', 'ぼうしがない[人|ひと]は、うけつけで[借|か]りられる', 'シャワーは、プールに[入|はい]った[後|あと]であびる'], answer: 2,
        explain: 'Caps can be borrowed at the desk (うけつけで借りることができます); it costs 100 yen, so it is not free. Children need an adult, and the shower comes before (前に) going in, not after.' }],
    uses: ['g:mae-ni', 'g:te-kudasai', 'g:nakereba-naranai', 'g:koto-ga-dekiru', 'g:potential', 'g:noun-modifier', 'g:made', 'g:nai-de', 'g:te-mo-ii', 'g:ato-de', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:市民|しみん', 'v:プール|プール', 'v:ご|ご', 'v:案内|あんない', 'v:入る|はいる', 'v:前|まえ', 'v:必ず|かならず', 'v:シャワー|シャワー', 'v:浴びる|あびる', 'v:帽子|ぼうし', 'v:かぶる|かぶる', 'v:忘れる|わすれる', 'v:人|ひと', 'v:受付|うけつけ', 'v:借りる|かりる', 'v:円|えん', 'v:歳|さい', 'v:子供|こども', 'v:大人|おとな', 'v:一緒|いっしょ', 'v:正しい|ただしい', 'v:物|もの', 'v:どれ|どれ', 'v:ない|ない', 'v:お金|おかね', 'v:払う|はらう', 'v:一人|ひとり', 'v:いい|いい', 'v:後|あと', 'k:入', 'k:前', 'k:人', 'k:借', 'k:円', 'k:子', 'k:大', 'k:正', 'k:金', 'k:一', 'k:後'],
    verified: true }),

  P({ id: 'p:n4-new-apartment', format: 'short',
    furigana: 'マリアさん、お[元気|げんき]ですか。わたしは[先週|せんしゅう]、[新|あたら]しいアパートにひっこしました。[前|まえ]のアパートより[少|すこ]しせまいですが、[駅|えき]から[近|ちか]くて、[会社|かいしゃ]まで[歩|ある]いて[行|い]けます。[近|ちか]くに[大|おお]きいスーパーもあるので、とてもべんりです。まどから[海|うみ]が[見|み]えるのも、とても[気|き]に[入|い]っています。[今度|こんど]、あそびに[来|き]てください。',
    en: 'Maria, how are you? Last week I moved to a new apartment. It is a little smaller than my old one, but it is close to the station and I can walk to the office. There is a big supermarket nearby too, so it is very convenient. I also really like that I can see the sea from the window. Come and visit next time.',
    questions: [
      { q: '[新|あたら]しいアパートについて、[正|ただ]しいものはどれですか。',
        options: ['[駅|えき]から[近|ちか]くて、[会社|かいしゃ]まで[歩|ある]いて[行|い]ける', '[前|まえ]のアパートより[少|すこ]し[広|ひろ]い', '[近|ちか]くにスーパーがないので、あまりべんりではない', 'まどから[海|うみ]は[見|み]えない'], answer: 0,
        explain: '駅から近くて、会社まで歩いて行けます: close to the station, and the office is in walking distance. The new place is a little smaller (せまい), not bigger; there is a big supermarket nearby; and the sea can be seen from the window.' }],
    names: ['マリア'],
    notes: '気に入る is read as 気 + 入る.',
    uses: ['g:te-adj-noun', 'g:potential', 'g:node', 'g:te-kudasai', 'g:amari-nai', 'g:te-iru', 'g:mo', 'g:no', 'g:kara', 'g:made', 'g:ni', 'g:ka', 'v:さん|さん', 'v:お|お', 'v:元気|げんき', 'v:私|わたし', 'v:先週|せんしゅう', 'v:新しい|あたらしい', 'v:アパート|アパート', 'v:引っ越す|ひっこす', 'v:前|まえ', 'v:より|より', 'v:少し|すこし', 'v:狭い|せまい', 'v:駅|えき', 'v:近い|ちかい', 'v:会社|かいしゃ', 'v:歩く|あるく', 'v:行く|いく', 'v:近く|ちかく', 'v:大きい|おおきい', 'v:スーパー|スーパー', 'v:ある|ある', 'v:とても|とても', 'v:便利|べんり', 'v:窓|まど', 'v:海|うみ', 'v:見える|みえる', 'v:気|き', 'v:入る|はいる', 'v:今度|こんど', 'v:遊ぶ|あそぶ', 'v:来る|くる', 'v:ください|ください', 'v:正しい|ただしい', 'v:物|もの', 'v:どれ|どれ', 'v:広い|ひろい', 'v:余り|あまり', 'k:元', 'k:気', 'k:先', 'k:週', 'k:新', 'k:前', 'k:少', 'k:駅', 'k:近', 'k:会', 'k:社', 'k:歩', 'k:行', 'k:大', 'k:海', 'k:見', 'k:入', 'k:今', 'k:度', 'k:来', 'k:正', 'k:広'],
    verified: true }),

  P({ id: 'p:n4-no-umbrella', format: 'short',
    furigana: '[今朝|けさ]のてんきよほうで、[午後|ごご]から[雨|あめ]がふると[言|い]っていました。でも、[空|そら]がとても[青|あお]くて、[雨|あめ]はふらないと[思|おも]ったので、かさを[持|も]たないで[出|で]かけました。[夕方|ゆうがた]、[会社|かいしゃ]を[出|で]ると、[雨|あめ]がふっていました。[駅|えき]まで[走|はし]りましたが、ぬれてしまいました。これからは、てんきよほうを[聞|き]いたら、かならずかさを[持|も]って[行|い]こうと[思|おも]います。',
    en: 'This morning the weather forecast said it would rain from the afternoon. But the sky was very blue, and I thought it would not rain, so I went out without an umbrella. In the evening, when I left the office, it was raining. I ran to the station but got wet. From now on, when I hear the forecast, I\'m going to take an umbrella without fail.',
    questions: [
      { q: 'この[人|ひと]は、どうしてぬれてしまいましたか。',
        options: ['てんきよほうを[聞|き]かなかったから', '[会社|かいしゃ]を[出|で]る[時|とき]に、かさをなくしたから', '[駅|えき]まで[走|はし]らなかったから', '[雨|あめ]はふらないと[思|おも]って、かさを[持|も]たないで[出|で]かけたから'], answer: 3,
        explain: 'The writer heard the forecast but trusted the blue sky, thought it would not rain and left without an umbrella. They did hear the forecast, did run to the station, and never lost an umbrella.' }],
    uses: ['g:te-ita', 'g:te-adj-noun', 'g:to-omou', 'g:node', 'g:nai-de', 'g:to-conditional', 'g:te-shimau', 'g:tara', 'g:you-to-omou', 'g:volitional', 'g:doushite', 'g:kara', 'g:made', 'g:de', 'g:wo', 'g:ga', 'g:ka', 'v:今朝|けさ', 'v:天気予報|てんきよほう', 'v:午後|ごご', 'v:雨|あめ', 'v:降る|ふる', 'v:言う|いう', 'v:でも|でも', 'v:空|そら', 'v:とても|とても', 'v:青い|あおい', 'v:思う|おもう', 'v:傘|かさ', 'v:持つ|もつ', 'v:出かける|でかける', 'v:夕方|ゆうがた', 'v:会社|かいしゃ', 'v:出る|でる', 'v:駅|えき', 'v:走る|はしる', 'v:ぬれる|ぬれる', 'v:これから|これから', 'v:聞く|きく', 'v:必ず|かならず', 'v:行く|いく', 'v:人|ひと', 'v:どうして|どうして', 'v:時|とき', 'v:無くす|なくす', 'k:今', 'k:朝', 'k:午', 'k:後', 'k:雨', 'k:言', 'k:空', 'k:青', 'k:思', 'k:持', 'k:出', 'k:夕', 'k:方', 'k:会', 'k:社', 'k:駅', 'k:走', 'k:聞', 'k:行', 'k:人', 'k:時'],
    verified: true }),

  P({ id: 'p:n4-inn-arrival', format: 'short',
    furigana: 'キムさま\n[旅館|りょかん]「[山|やま]の[花|はな]」でございます。10[月|がつ]12[日|にち]と13[日|にち]におとまりのごよやく、ありがとうございます。おへやには[午後|ごご]3[時|じ]から[入|はい]れます。それより[早|はや]くお[着|つ]きになるばあいは、にもつだけうけつけにおいて、[近|ちか]くをさんぽすることもできます。[夕飯|ゆうはん]は6[時|じ]から、[朝|あさ]ご[飯|はん]は7[時|じ]から9[時|じ]までです。',
    en: 'Dear Kim — This is the inn Yama no Hana. Thank you for your booking for the nights of 12 and 13 October. You can enter your room from 3 p.m. If you arrive earlier than that, you can leave just your luggage at the front desk and take a walk nearby. Dinner is from 6, and breakfast from 7 to 9.',
    questions: [
      { q: '[旅館|りょかん]の[人|ひと]は、[早|はや]く[着|つ]いた[人|ひと]に[何|なに]ができると[言|い]っていますか。',
        options: ['3[時|じ]より[早|はや]く、おへやに[入|はい]ること', 'にもつだけうけつけにおいて、[近|ちか]くをさんぽすること', '[夕飯|ゆうはん]を6[時|じ]より[早|はや]く[食|た]べること', 'にもつを[持|も]って、[朝|あさ]ご[飯|はん]を[食|た]べること'], answer: 1,
        explain: 'For guests who arrive early (お着きになるばあい), the inn offers to keep the luggage at the desk so they can walk around. Rooms open only at 3, dinner starts at 6, and breakfast is for the next morning.' }],
    names: ['キム', '山|やま', '花|はな'],
    notes: 'ありがとうございます is an expression outside the catalog; not listed in uses.',
    uses: ['g:gozaimasu', 'g:potential', 'g:o-ni-naru', 'g:baai-wa', 'g:dake', 'g:noun-modifier', 'g:kara', 'g:made', 'g:to', 'g:no', 'g:ni', 'g:wo', 'g:ka', 'v:様|さま', 'v:旅館|りょかん', 'v:月|がつ', 'v:日|にち', 'v:お|お', 'v:泊まる|とまる', 'v:ご|ご', 'v:予約|よやく', 'v:部屋|へや', 'v:午後|ごご', 'v:時|じ', 'v:入る|はいる', 'v:より|より', 'v:早い|はやい', 'v:着く|つく', 'v:なる|なる', 'v:場合|ばあい', 'v:荷物|にもつ', 'v:だけ|だけ', 'v:受付|うけつけ', 'v:置く|おく', 'v:近く|ちかく', 'v:散歩|さんぽ', 'v:する|する', 'v:夕飯|ゆうはん', 'v:朝御飯|あさごはん', 'v:人|ひと', 'v:何|なに', 'v:言う|いう', 'v:食べる|たべる', 'v:持つ|もつ', 'v:事|こと', 'v:できる|できる', 'k:旅', 'k:館', 'k:山', 'k:花', 'k:月', 'k:日', 'k:午', 'k:後', 'k:時', 'k:入', 'k:早', 'k:着', 'k:近', 'k:夕', 'k:飯', 'k:朝', 'k:人', 'k:何', 'k:言', 'k:食', 'k:持'],
    verified: true }),

  // ── mid (内容理解・中文) ──
  P({ id: 'p:n4-homestay-thanks', format: 'mid',
    furigana: '[大野|おおの]さんのごかぞくのみなさんへ\nお[元気|げんき]ですか。[先月|せんげつ]まで2か[月|げつ]、おせわになったトムです。[国|くに]に[帰|かえ]ってから、もう3[週間|しゅうかん]になります。\n[日本|にほん]に[着|つ]いた[日|ひ]、わたしは[日本|にほん][語|ご]があまり[話|はな]せなくて、とてもしんぱいでした。でも、お[母|かあ]さんが[毎日|まいにち]ゆっくり[話|はな]してくれたので、わかることが[少|すこ]しずつ[多|おお]くなりました。お[父|とう]さんには、[日曜日|にちようび]によく[近|ちか]くの[山|やま]や[海|うみ]へつれて[行|い]っていただきました。[雨|あめ]の[日|ひ]は、[家|いえ]で[日本|にほん]の[料理|りょうり]の[作|つく]り[方|かた]を[教|おし]えてもらいました。[今|いま]でも[国|くに]でときどき[作|つく]っています。\nいちばん[楽|たの]しかったのは、[夏|なつ]のおまつりです。はじめてきものを[着|き]て、[町|まち]の[人|ひと]といっしょにおどりました。[写真|しゃしん]をたくさんとったので、[国|くに]の[家族|かぞく]や[友|とも]だちにも[見|み]せました。みんな、[日本|にほん]へ[行|い]ってみたいと[言|い]っています。\n[今|いま]、わたしは[国|くに]の[大学|だいがく]で[日本|にほん][語|ご]のべんきょうをつづけています。[来年|らいねん]の[春|はる]からは、[東京|とうきょう]の[大学|だいがく]で1[年|ねん]べんきょうするよていです。そのときは、またみなさんに[会|あ]いに[行|い]きたいと[思|おも]っています。どうぞお[体|からだ]に[気|き]をつけてください。\nトム',
    en: 'To the Ono family — How are you? This is Tom, who stayed with you for two months until last month. It is already three weeks since I went home. On the day I arrived in Japan I could hardly speak Japanese and was very worried. But Mother spoke to me slowly every day, so little by little I understood more. Father often took me to the mountains and the sea nearby on Sundays. On rainy days they taught me at home how to cook Japanese dishes, and I still sometimes make them back home. The most fun of all was the summer festival. I wore a kimono for the first time and danced with the people of the town. I took a lot of photos and showed them to my family and friends back home too. They all say they want to try going to Japan. Now I am continuing to study Japanese at university in my country. From next spring I am scheduled to study for a year at a university in Tokyo. When I do, I would like to come and see you all again. Please take care of yourselves. — Tom',
    questions: [
      { q: 'トムさんは、[日本|にほん]に[着|つ]いた[日|ひ]、どうでしたか。',
        options: ['[日本|にほん][語|ご]があまり[話|はな]せなくて、しんぱいだった', 'お[母|かあ]さんがゆっくり[話|はな]してくれて、うれしかった', '[日本|にほん][語|ご]がよくわかって、[楽|たの]しかった', 'すぐに[国|くに]に[帰|かえ]りたくなった'], answer: 0,
        explain: 'The second paragraph opens with 日本に着いた日、わたしは日本語があまり話せなくて、とても心配でした. The host mother\'s slow talk helped later (でも…), so it is not about that first day.' },
      { q: 'トムさんがいちばん[楽|たの]しかったことは[何|なん]ですか。',
        options: ['[日曜日|にちようび]に[山|やま]や[海|うみ]へ[行|い]ったこと', '[写真|しゃしん]をたくさんとったこと', 'きものを[着|き]て、[町|まち]の[人|ひと]とおどったこと', '[家族|かぞく]や[友|とも]だちに[写真|しゃしん]を[見|み]せたこと'], answer: 2,
        explain: 'いちばん楽しかったのは、夏のおまつりです, where he wore a kimono and danced with the townspeople. The Sunday trips and the photos are mentioned, but not as the best part.' },
      { q: 'トムさんは、[来年|らいねん]の[春|はる]から[何|なに]をしますか。',
        options: ['[国|くに]の[大学|だいがく]で[日本|にほん][語|ご]をべんきょうしはじめる', '[東京|とうきょう]の[大学|だいがく]でべんきょうする', '[大野|おおの]さんの[家|いえ]にまた2か[月|げつ]とまる', '[国|くに]の[家族|かぞく]と[日本|にほん]へ[旅行|りょこう]する'], answer: 1,
        explain: '来年の春からは、東京の大学で1年べんきょうするよていです. He already studies at home (つづけています), he only hopes to visit the family, and his family just say they want to go.' }],
    names: ['大野|おおの', 'トム', '日本|にほん', '東京|とうきょう'],
    notes: 'つれて行っていただきました: humble いただく after て (the polite partner of てもらう); listed as v:頂く|いただく, since g:te-morau does not match the surface.',
    uses: ['g:potential', 'g:nakute', 'g:te-kureru', 'g:node', 'g:naru', 'g:ya', 'g:te-miru', 'g:tai', 'g:te-iru', 'g:yotei-da', 'g:to-omou', 'g:te-kara', 'g:noun-modifier', 'g:stem-compounds', 'g:te-morau', 'g:kata', 'g:no', 'g:to', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:te-kudasai', 'v:さん|さん', 'v:ご|ご', 'v:家族|かぞく', 'v:皆さん|みなさん', 'v:お|お', 'v:元気|げんき', 'v:先月|せんげつ', 'v:か月|かげつ', 'v:世話|せわ', 'v:なる|なる', 'v:国|くに', 'v:帰る|かえる', 'v:もう|もう', 'v:週間|しゅうかん', 'v:着く|つく', 'v:日|ひ', 'v:私|わたし', 'v:語|ご', 'v:余り|あまり', 'v:話す|はなす', 'v:とても|とても', 'v:心配|しんぱい', 'v:でも|でも', 'v:お母さん|おかあさん', 'v:毎日|まいにち', 'v:分かる|わかる', 'v:事|こと', 'v:少し|すこし', 'v:ずつ|ずつ', 'v:多い|おおい', 'v:お父さん|おとうさん', 'v:日曜日|にちようび', 'v:よく|よく', 'v:近く|ちかく', 'v:山|やま', 'v:海|うみ', 'v:連れる|つれる', 'v:行く|いく', 'v:頂く|いただく', 'v:料理|りょうり', 'v:作る|つくる', 'v:方|かた', 'v:教える|おしえる', 'v:時々|ときどき', 'v:どうぞ|どうぞ', 'v:体|からだ', 'v:つける|つける', 'v:雨|あめ', 'v:いちばん|いちばん', 'v:楽しい|たのしい', 'v:夏|なつ', 'v:お祭り|おまつり', 'v:初めて|はじめて', 'v:着物|きもの', 'v:着る|きる', 'v:町|まち', 'v:人|ひと', 'v:一緒|いっしょ', 'v:踊る|おどる', 'v:写真|しゃしん', 'v:たくさん|たくさん', 'v:撮る|とる', 'v:友達|ともだち', 'v:見せる|みせる', 'v:みんな|みんな', 'v:言う|いう', 'v:今|いま', 'v:大学|だいがく', 'v:勉強|べんきょう', 'v:続ける|つづける', 'v:来年|らいねん', 'v:春|はる', 'v:年|ねん', 'v:する|する', 'v:予定|よてい', 'v:その|その', 'v:時|とき', 'v:また|また', 'v:会う|あう', 'v:思う|おもう', 'v:何|なん', 'v:何|なに', 'v:嬉しい|うれしい', 'v:すぐに|すぐに', 'v:家|いえ', 'v:泊まる|とまる', 'v:旅行|りょこう', 'v:始める|はじめる', 'k:大', 'k:野', 'k:元', 'k:気', 'k:先', 'k:月', 'k:国', 'k:帰', 'k:週', 'k:間', 'k:日', 'k:本', 'k:着', 'k:語', 'k:話', 'k:母', 'k:毎', 'k:少', 'k:多', 'k:父', 'k:曜', 'k:近', 'k:山', 'k:海', 'k:行', 'k:雨', 'k:家', 'k:料', 'k:理', 'k:作', 'k:方', 'k:教', 'k:今', 'k:楽', 'k:夏', 'k:町', 'k:人', 'k:写', 'k:真', 'k:族', 'k:友', 'k:見', 'k:言', 'k:学', 'k:来', 'k:年', 'k:春', 'k:東', 'k:京', 'k:会', 'k:思', 'k:体', 'k:何', 'k:旅'],
    verified: true }),

  P({ id: 'p:n4-bicycle-fall', format: 'mid',
    furigana: '[先月|せんげつ]、[雨|あめ]の[日|ひ]に、[自転車|じてんしゃ]でさかをおりていたとき、すべってたおれてしまいました。[足|あし]がとてもいたくて、[立|た]つことができませんでした。[近|ちか]くにいた[人|ひと]が[病院|びょういん]までつれて[行|い]ってくれました。[医者|いしゃ]に[足|あし]がおれていると[言|い]われて、2[週間|しゅうかん][入院|にゅういん]しなければなりませんでした。\n[入院|にゅういん]している[間|あいだ]に、[会社|かいしゃ]の[人|ひと]たちがおみまいに[来|き]てくれました。わたしは[仕事|しごと]のことがずっと[気|き]になっていましたが、かちょうに「[仕事|しごと]のことはしんぱいしなくてもいいですよ」と[言|い]われて、[安心|あんしん]しました。それからは、ベッドの[上|うえ]で[本|ほん]を[読|よ]んだり、[日本|にほん][語|ご]のべんきょうをしたりして、のんびりすごしました。[病院|びょういん]のご[飯|はん]はあまりおいしくありませんでしたが、かんごしの[方|かた]たちはみんな[親切|しんせつ]で、[毎日|まいにち]「[足|あし]はどうですか」と[聞|き]いてくれました。\n[今|いま]はもう[歩|ある]けますが、まだ[走|はし]ることはできません。[医者|いしゃ]は、あと1か[月|げつ]ぐらいかかると[言|い]っています。それで、[会社|かいしゃ]へはしばらくバスで[通|かよ]うつもりです。それに、これからは、[雨|あめ]の[日|ひ]は[自転車|じてんしゃ]にのらないことにしました。',
    en: 'Last month, on a rainy day, I slipped and fell while riding my bicycle down a slope. My leg hurt so much that I could not stand up. A person who was nearby took me to hospital. The doctor told me my leg was broken, and I had to stay in hospital for two weeks. While I was in hospital, people from the office came to visit me. I had been worried about work the whole time, but the section chief told me, "You don\'t need to worry about work," and I felt relieved. After that I took it easy, reading books in bed and studying Japanese. The hospital food was not very good, but the nurses were all kind and asked me every day how my leg was. Now I can walk, but I still cannot run. The doctor says it will take about another month. So for a while I plan to go to the office by bus. And from now on, I have decided not to ride my bicycle on rainy days.',
    questions: [
      { q: 'この[人|ひと]は、[入院|にゅういん]する[前|まえ]に、どうしましたか。',
        options: ['[雨|あめ]の[日|ひ]に、さかを[歩|ある]いておりていて、すべった', '[自転車|じてんしゃ]でさかをのぼっていて、たおれた', '[会社|かいしゃ]で[仕事|しごと]をしていて、たおれた', '[雨|あめ]の[日|ひ]に、[自転車|じてんしゃ]でさかをおりていて、すべった'], answer: 3,
        explain: 'The first sentence: on a rainy day, riding a bicycle down a slope (自転車でさかをおりていた), the writer slipped and fell. Not walking, not going uphill, and not at work.' },
      { q: 'この[人|ひと]は、どうして[安心|あんしん]しましたか。',
        options: ['[医者|いしゃ]に、もうすぐ[走|はし]れると[言|い]われたから', 'ベッドの[上|うえ]で[日本|にほん][語|ご]のべんきょうができたから', 'かちょうに、[仕事|しごと]のことはしんぱいしなくてもいいと[言|い]われたから', '[会社|かいしゃ]の[人|ひと]たちが[病院|びょういん]までつれて[行|い]ってくれたから'], answer: 2,
        explain: 'The writer felt relieved (安心しました) after the section chief said not to worry about work. The doctor said it will take another month, and it was a stranger nearby, not colleagues, who took the writer to hospital.' },
      { q: 'この[人|ひと]は、これからどうしますか。',
        options: ['しばらくバスで[会社|かいしゃ]へ[通|かよ]う', '[毎日|まいにち][走|はし]るれんしゅうをする', '[雨|あめ]の[日|ひ]だけ、バスで[会社|かいしゃ]へ[行|い]く', 'あと1か[月|げつ][入院|にゅういん]する'], answer: 0,
        explain: 'しばらくバスで通うつもりです: for now the writer will commute by bus every day, not only on rainy days. Running is not possible yet, and the extra month is how long the leg needs, not more hospital.' }],
    names: ['日本|にほん'],
    notes: 'ずっと, のんびり, すごす and ぐらい are outside the catalog (kana, not in uses). g:te-iru-aida-ni matched by 間 in 入院している間 (the "while" span sense, without に).',
    uses: ['g:te-ita', 'g:te-shimau', 'g:te-adj-noun', 'g:koto-ga-dekiru', 'g:te-kureru', 'g:passive', 'g:nakereba-naranai', 'g:te-iru-aida-ni', 'g:te-iru', 'g:nakute-mo-ii', 'g:tari-tari', 'g:potential', 'g:tsumori', 'g:sore-ni', 'g:koto-ni-suru', 'g:noun-modifier', 'g:dake', 'g:made', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:amari-nai', 'v:先月|せんげつ', 'v:雨|あめ', 'v:日|ひ', 'v:自転車|じてんしゃ', 'v:坂|さか', 'v:下りる|おりる', 'v:時|とき', 'v:滑る|すべる', 'v:倒れる|たおれる', 'v:足|あし', 'v:とても|とても', 'v:痛い|いたい', 'v:立つ|たつ', 'v:近く|ちかく', 'v:居る|いる', 'v:人|ひと', 'v:病院|びょういん', 'v:連れる|つれる', 'v:行く|いく', 'v:医者|いしゃ', 'v:折れる|おれる', 'v:言う|いう', 'v:週間|しゅうかん', 'v:入院|にゅういん', 'v:間|あいだ', 'v:会社|かいしゃ', 'v:たち|たち', 'v:お見舞い|おみまい', 'v:来る|くる', 'v:私|わたし', 'v:仕事|しごと', 'v:事|こと', 'v:気|き', 'v:課長|かちょう', 'v:心配|しんぱい', 'v:安心|あんしん', 'v:それから|それから', 'v:御飯|ごはん', 'v:余り|あまり', 'v:おいしい|おいしい', 'v:看護師|かんごし', 'v:方|かた', 'v:みんな|みんな', 'v:親切|しんせつ', 'v:聞く|きく', 'v:ベッド|ベッド', 'v:上|うえ', 'v:本|ほん', 'v:読む|よむ', 'v:語|ご', 'v:勉強|べんきょう', 'v:する|する', 'v:今|いま', 'v:もう|もう', 'v:歩く|あるく', 'v:まだ|まだ', 'v:走る|はしる', 'v:後|あと', 'v:か月|かげつ', 'v:かかる|かかる', 'v:それで|それで', 'v:しばらく|しばらく', 'v:バス|バス', 'v:通う|かよう', 'v:つもり|つもり', 'v:それに|それに', 'v:これから|これから', 'v:乗る|のる', 'v:前|まえ', 'v:どう|どう', 'v:どうして|どうして', 'v:もうすぐ|もうすぐ', 'v:できる|できる', 'v:毎日|まいにち', 'v:練習|れんしゅう', 'v:だけ|だけ', 'k:先', 'k:月', 'k:雨', 'k:日', 'k:自', 'k:転', 'k:車', 'k:足', 'k:立', 'k:近', 'k:人', 'k:病', 'k:院', 'k:行', 'k:医', 'k:者', 'k:言', 'k:週', 'k:間', 'k:入', 'k:会', 'k:社', 'k:来', 'k:仕', 'k:事', 'k:気', 'k:安', 'k:心', 'k:上', 'k:本', 'k:読', 'k:語', 'k:飯', 'k:方', 'k:親', 'k:切', 'k:毎', 'k:聞', 'k:今', 'k:歩', 'k:走', 'k:通', 'k:前'],
    verified: true }),

  P({ id: 'p:n4-summer-festival-help', format: 'mid',
    furigana: 'わたしの[町|まち]では、[毎年|まいとし]8[月|がつ]に[大|おお]きなおまつりがあります。[今年|ことし]、わたしははじめて[夏|なつ]のおまつりのてつだいをしました。[友|とも]だちに「いっしょにやってみない？」と[言|い]われて、かるい[気持|きも]ちで「いいよ」と[答|こた]えたのです。\nわたしたちの[仕事|しごと]は、まつりの[前|まえ]の[日|ひ]に、こうえんにテーブルやいすを[運|はこ]ぶことと、まつりの[日|ひ]に[道|みち]をあんないすることでした。テーブルはとても[重|おも]くて、[運|はこ]ぶのはたいへんでした。\nまつりの[日|ひ]は、[朝|あさ]は[雨|あめ]がふりそうでしたが、[午後|ごご]からはれて、たくさんの[人|ひと]が[来|き]ました。[今年|ことし]は[去年|きょねん]より[来|き]た[人|ひと]が[多|おお]かったそうです。わたしは[駅|えき]の[前|まえ]に[立|た]って、[来|き]た[人|ひと]にこうえんまでの[道|みち]を[教|おし]えました。[外国|がいこく]から[来|き]た[人|ひと]も[多|おお]かったので、[英語|えいご]でもせつめいしました。「ありがとう」と[言|い]われると、とてもうれしかったです。\n[夜|よる]、まつりが[終|お]わってから、てつだった[人|ひと]たちといっしょに、ごみをひろったり、テーブルをかたづけたりしました。とてもつかれましたが、いいけいけんになりました。[来年|らいねん]もまたやろうと[思|おも]います。',
    en: 'In my town there is a big festival every August. This year I helped at the summer festival for the first time. A friend asked me, "Why don\'t we try it together?" and I said "Sure" without thinking much. Our jobs were to carry tables and chairs to the park on the day before the festival, and to show people the way on the day itself. The tables were very heavy, and carrying them was hard work. On the festival day it looked like rain in the morning, but it cleared up in the afternoon and lots of people came. I hear more people came this year than last year. I stood in front of the station and told the people who came the way to the park. Many came from abroad, so I explained in English too. When they said "thank you", I was very happy. In the evening, after the festival ended, I picked up rubbish and put the tables away with the other helpers. I was very tired, but it was a good experience. I think I will do it again next year.',
    questions: [
      { q: 'まつりの[前|まえ]の[日|ひ]、この[人|ひと]は[何|なに]をしましたか。',
        options: ['[駅|えき]の[前|まえ]で[道|みち]をあんないした', 'てつだった[人|ひと]たちとごみをひろった', '[外国|がいこく]の[人|ひと]に[英語|えいご]でせつめいした', 'こうえんにテーブルやいすを[運|はこ]んだ'], answer: 3,
        explain: 'まつりの前の日に、こうえんにテーブルやいすを運ぶこと was the day-before job. Showing the way and explaining in English were on the festival day, and picking up rubbish was that evening.' },
      { q: 'まつりの[日|ひ]の[天気|てんき]は、どうでしたか。',
        options: ['[朝|あさ]から[雨|あめ]がふっていた', '[朝|あさ]は[雨|あめ]がふりそうだったが、[午後|ごご]からはれた', '[朝|あさ]ははれていたが、[午後|ごご]から[雨|あめ]がふった', '1[日|にち]じゅう[雨|あめ]がふりそうだった'], answer: 1,
        explain: '朝は雨がふりそうでしたが、午後からはれて: in the morning it only looked like rain (そう), and it cleared up in the afternoon. It never actually rained.' },
      { q: 'この[人|ひと]は、まつりのてつだいについて、どう[思|おも]っていますか。',
        options: ['つかれたが、[来年|らいねん]もまたやりたい', '[仕事|しごと]がたいへんだったので、もうやりたくない', '[英語|えいご]でせつめいできなくて、こまった', '[来年|らいねん]は[友|とも]だちだけにやってほしい'], answer: 0,
        explain: 'The last lines: とてもつかれましたが、いいけいけんになりました。来年もまたやろうと思います. The writer did explain in English and was glad to be thanked.' }],
    notes: 'g:keredomo stands for the contrastive が (…でしたが、…). ありがとう is an expression outside the catalog.',
    uses: ['g:ga-arimasu', 'g:te-miru', 'g:passive', 'g:sou-da-hearsay', 'g:noun-modifier', 'g:koto', 'g:ya', 'g:te-adj-noun', 'g:sou-da-looks', 'g:node', 'g:to-conditional', 'g:te-kara', 'g:tari-tari', 'g:volitional', 'g:you-to-omou', 'g:naru', 'g:tai', 'g:te-hoshii', 'g:potential', 'g:nakute', 'g:dake', 'g:made', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:私|わたし', 'v:町|まち', 'v:毎年|まいとし', 'v:月|がつ', 'v:夏|なつ', 'v:お祭り|おまつり', 'v:ある|ある', 'v:今年|ことし', 'v:大きな|おおきな', 'v:去年|きょねん', 'v:より|より', 'v:初めて|はじめて', 'v:手伝う|てつだう', 'v:する|する', 'v:友達|ともだち', 'v:一緒|いっしょ', 'v:やる|やる', 'v:言う|いう', 'v:軽い|かるい', 'v:気持ち|きもち', 'v:いい|いい', 'v:答える|こたえる', 'v:たち|たち', 'v:仕事|しごと', 'v:前|まえ', 'v:日|ひ', 'v:公園|こうえん', 'v:テーブル|テーブル', 'v:いす|いす', 'v:運ぶ|はこぶ', 'v:事|こと', 'v:道|みち', 'v:案内|あんない', 'v:とても|とても', 'v:重い|おもい', 'v:大変|たいへん', 'v:朝|あさ', 'v:雨|あめ', 'v:降る|ふる', 'v:午後|ごご', 'v:晴れる|はれる', 'v:たくさん|たくさん', 'v:人|ひと', 'v:来る|くる', 'v:駅|えき', 'v:立つ|たつ', 'v:教える|おしえる', 'v:外国|がいこく', 'v:多い|おおい', 'v:英語|えいご', 'v:説明|せつめい', 'v:嬉しい|うれしい', 'v:夜|よる', 'v:終わる|おわる', 'v:ごみ|ごみ', 'v:拾う|ひろう', 'v:片付ける|かたづける', 'v:疲れる|つかれる', 'v:経験|けいけん', 'v:なる|なる', 'v:来年|らいねん', 'v:また|また', 'v:思う|おもう', 'v:何|なに', 'v:天気|てんき', 'v:どう|どう', 'v:日|にち', 'v:中|じゅう', 'v:もう|もう', 'v:困る|こまる', 'v:だけ|だけ', 'k:町', 'k:毎', 'k:年', 'k:月', 'k:大', 'k:今', 'k:夏', 'k:友', 'k:言', 'k:気', 'k:持', 'k:答', 'k:仕', 'k:事', 'k:前', 'k:日', 'k:運', 'k:道', 'k:重', 'k:朝', 'k:雨', 'k:午', 'k:後', 'k:人', 'k:来', 'k:去', 'k:多', 'k:駅', 'k:立', 'k:教', 'k:外', 'k:国', 'k:英', 'k:語', 'k:夜', 'k:終', 'k:思', 'k:何', 'k:天'],
    verified: true }),

  P({ id: 'p:n4-learning-to-cook', format: 'mid',
    furigana: 'わたしは[去年|きょねん]の[春|はる]から[一人|ひとり]で[住|す]んでいます。[家|いえ]にいたときは、[母|はは]がいつもご[飯|はん]を[作|つく]ってくれたので、[料理|りょうり]をしたことがあまりありませんでした。\n[一人|ひとり]で[住|す]みはじめたころは、[毎日|まいにち][店|みせ]でおべんとうを[買|か]っていました。でも、お[金|かね]がかかるし、やさいもあまり[食|た]べられないし、[体|からだ]によくないと[思|おも]って、じぶんで[作|つく]ってみることにしました。\nはじめはしっぱいばかりでした。[肉|にく]をやきすぎて[黒|くろ]くしてしまったり、しおを[入|い]れすぎたりしました。こまったときは、[母|はは]に[電話|でんわ]して[作|つく]り[方|かた]を[聞|き]きました。[母|はは]は「さいしょはだれでもそうよ」と[言|い]って、ていねいに[教|おし]えてくれました。でも、[母|はは]の[料理|りょうり]と[同|おな]じ[味|あじ]にするのは、まだむずかしいです。\n[今|いま]では、1[週間|しゅうかん]に4[度|ど]ぐらい[料理|りょうり]をします。やさいは[安|やす]い[日|ひ]にたくさん[買|か]っておくので、お[金|かね]もあまりかかりません。[友|とも]だちが[来|き]たときは、カレーを[作|つく]ってあげます。おいしいと[言|い]ってもらえると、とてもうれしいです。[来月|らいげつ]は[母|はは]のたんじょうびなので、[母|はは]に[料理|りょうり]を[作|つく]ってあげようと[思|おも]っています。',
    en: 'I have lived on my own since last spring. When I lived at home, my mother always cooked for me, so I had not cooked much. When I started living alone, I bought a boxed lunch at a shop every day. But it cost money, I could not eat many vegetables, and I thought it was bad for my health, so I decided to try cooking for myself. At first I failed all the time. I burnt meat black or put in far too much salt. When I was stuck, I phoned my mother and asked how to make things. She said, "Everyone is like that at the start," and taught me carefully. Still, getting the same taste as her cooking is hard for me even now. Now I cook about four times a week. I buy lots of vegetables on days when they are cheap, so it does not cost much either. When friends come over, I make curry for them. I am very happy when they tell me it is good. Next month is my mother\'s birthday, so I am thinking of cooking for her.',
    questions: [
      { q: 'この[人|ひと]は、どうしてじぶんで[料理|りょうり]を[作|つく]ることにしましたか。',
        options: ['[母|はは]に[作|つく]ってみなさいと[言|い]われたから', '[店|みせ]のおべんとうがおいしくなかったから', 'お[金|かね]がかかるし、[体|からだ]によくないと[思|おも]ったから', '[友|とも]だちにカレーを[作|つく]ってあげたかったから'], answer: 2,
        explain: 'The writer listed reasons with し: boxed lunches cost money, there were few vegetables, and it seemed bad for the body. The mother only helped later, and the taste of the lunches and the friends are not the reason.' },
      { q: 'この[人|ひと]が[母|はは]に[電話|でんわ]したのは、どうしてですか。',
        options: ['[母|はは]のたんじょうびだったから', '[料理|りょうり]がうまくできなくて、[作|つく]り[方|かた]を[聞|き]きたかったから', '[母|はは]に[料理|りょうり]を[作|つく]ってほしかったから', '[友|とも]だちにカレーを[作|つく]ってあげたかったから'], answer: 1,
        explain: 'こまったときは、母に電話して作り方を聞きました: the calls were for help after failures. The birthday is next month, and the writer wants to cook for the mother, not the other way round.' },
      { q: 'この[人|ひと]は、[来月|らいげつ][何|なに]をするつもりですか。',
        options: ['[友|とも]だちにカレーを[作|つく]ってもらう', '[母|はは]に[料理|りょうり]を[教|おし]えてもらう', '1[週間|しゅうかん]に4[度|ど][料理|りょうり]をしはじめる', '[母|はは]に[料理|りょうり]を[作|つく]ってあげる'], answer: 3,
        explain: '来月は母のたんじょうびなので、母に料理を作ってあげようと思っています. Cooking four times a week is already true now (今では), and the curry is something the writer makes for friends.' }],
    notes: 'ぐらい (approximately) is outside the catalog. 1週間に4度: 度 is used as the counter so the text stays inside the kanji list (回 is above N4 in this catalog); 4回 is the more common wording.',
    uses: ['g:te-iru', 'g:te-kureru', 'g:node', 'g:ta-koto-ga-aru', 'g:stem-compounds', 'g:shi', 'g:potential', 'g:to-omou', 'g:te-miru', 'g:koto-ni-suru', 'g:sugiru', 'g:te-shimau', 'g:ku-ni-suru', 'g:tari-tari', 'g:kata', 'g:ni-frequency', 'g:te-ageru', 'g:te-morau', 'g:to-conditional', 'g:you-to-omou', 'g:volitional', 'g:nasai', 'g:passive', 'g:amari-nai', 'g:tsumori', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:te-oku', 'v:私|わたし', 'v:去年|きょねん', 'v:春|はる', 'v:一人|ひとり', 'v:住む|すむ', 'v:家|いえ', 'v:居る|いる', 'v:時|とき', 'v:母|はは', 'v:いつも|いつも', 'v:御飯|ごはん', 'v:作る|つくる', 'v:料理|りょうり', 'v:する|する', 'v:余り|あまり', 'v:毎日|まいにち', 'v:店|みせ', 'v:お弁当|おべんとう', 'v:買う|かう', 'v:でも|でも', 'v:お金|おかね', 'v:かかる|かかる', 'v:野菜|やさい', 'v:食べる|たべる', 'v:体|からだ', 'v:いい|いい', 'v:思う|おもう', 'v:自分|じぶん', 'v:初め|はじめ', 'v:失敗|しっぱい', 'v:ばかり|ばかり', 'v:肉|にく', 'v:焼く|やく', 'v:黒い|くろい', 'v:塩|しお', 'v:入れる|いれる', 'v:困る|こまる', 'v:電話|でんわ', 'v:方|かた', 'v:聞く|きく', 'v:最初|さいしょ', 'v:誰|だれ', 'v:そう|そう', 'v:言う|いう', 'v:丁寧|ていねい', 'v:教える|おしえる', 'v:今|いま', 'v:週間|しゅうかん', 'v:度|ど', 'v:友達|ともだち', 'v:来る|くる', 'v:カレー|カレー', 'v:同じ|おなじ', 'v:味|あじ', 'v:まだ|まだ', 'v:難しい|むずかしい', 'v:安い|やすい', 'v:日|ひ', 'v:たくさん|たくさん', 'v:おいしい|おいしい', 'v:もらう|もらう', 'v:とても|とても', 'v:嬉しい|うれしい', 'v:来月|らいげつ', 'v:誕生日|たんじょうび', 'v:つもり|つもり', 'v:何|なに', 'v:うまい|うまい', 'v:できる|できる', 'v:始める|はじめる', 'k:去', 'k:年', 'k:春', 'k:一', 'k:人', 'k:住', 'k:家', 'k:母', 'k:飯', 'k:作', 'k:料', 'k:理', 'k:毎', 'k:日', 'k:店', 'k:買', 'k:金', 'k:食', 'k:体', 'k:思', 'k:肉', 'k:黒', 'k:入', 'k:電', 'k:話', 'k:方', 'k:聞', 'k:言', 'k:教', 'k:同', 'k:味', 'k:今', 'k:週', 'k:間', 'k:度', 'k:安', 'k:友', 'k:来', 'k:月', 'k:何'],
    verified: true }),

  P({ id: 'p:n4-old-town-trip', format: 'mid',
    furigana: '[先週|せんしゅう]の[休|やす]みに、[一人|ひとり]で[古|ふる]いおてらが[多|おお]い[町|まち]へ[旅行|りょこう]に[行|い]きました。[駅|えき]で[地図|ちず]をもらって[歩|ある]きはじめましたが、ほそい[道|みち]がたくさんあって、すぐに[道|みち]がわからなくなってしまいました。\nこまっていると、[犬|いぬ]とさんぽをしていたおばあさんが、「どこへ[行|い]きたいんですか」と[聞|き]いてくれました。わたしが[地図|ちず]を[見|み]せると、おばあさんは「そのおてらなら、わたしの[家|いえ]の[近|ちか]くですよ。いっしょに[行|い]きましょう」と[言|い]って、15ふんぐらいいっしょに[歩|ある]いてくれました。[歩|ある]きながら、おばあさんは[町|まち]のれきしや、おいしい[店|みせ]のことをいろいろ[教|おし]えてくれました。おばあさんの[話|はなし]はとてもおもしろくて、[時間|じかん]がすぐにすぎました。\nおてらに[着|つ]いたとき、おばあさんは「よかったら、[帰|かえ]りにうちでお[茶|ちゃ]を[飲|の]んでいきませんか」と[言|い]いました。おてらの[中|なか]には[古|ふる]い[木|き]がたくさんあって、とてもしずかでした。わたしはおてらを[見|み]てから、おばあさんの[家|いえ]へ[行|い]きました。にわのきれいな[古|ふる]い[家|いえ]で、おばあさんと[飲|の]んだお[茶|ちゃ]は、とてもおいしかったです。[今度|こんど]あの[町|まち]へ[行|い]くときは、おばあさんにおみやげを[持|も]って[行|い]こうと[思|おも]います。',
    en: 'Last week, on my day off, I travelled alone to a town with many old temples. I got a map at the station and started walking, but there were lots of narrow streets and I soon got lost. While I was stuck, an old woman who was walking her dog asked me, "Where do you want to go?" When I showed her the map, she said, "That temple is near my house. Let\'s go together," and walked with me for about fifteen minutes. As we walked, she told me all sorts of things about the town\'s history and good restaurants. Her stories were so interesting that the time flew by. When we reached the temple, she said, "If you like, why not have tea at my place on your way back?" Inside the temple grounds there were many old trees, and it was very quiet. After seeing the temple, I went to her house. The tea I drank with her in that old house with a pretty garden was delicious. Next time I go to that town, I\'m going to take her a present.',
    questions: [
      { q: 'この[人|ひと]は、どうして[道|みち]がわからなくなりましたか。',
        options: ['[駅|えき]で[地図|ちず]をもらわなかったから', '[犬|いぬ]とさんぽをしていたから', 'ほそい[道|みち]がたくさんあったから', 'おばあさんの[家|いえ]をさがしていたから'], answer: 2,
        explain: 'ほそい道がたくさんあって、すぐに道がわからなくなってしまいました: the many narrow streets are why. The writer did get a map, the dog belonged to the old woman, and the writer was looking for a temple.' },
      { q: 'おばあさんは、どうしていっしょに[歩|ある]いてくれましたか。',
        options: ['そのおてらが、おばあさんの[家|いえ]の[近|ちか]くだったから', 'この[人|ひと]に[町|まち]のれきしを[教|おし]えたかったから', 'この[人|ひと]といっしょにお[茶|ちゃ]を[飲|の]みたかったから', 'おいしい[店|みせ]へ[行|い]くとちゅうだったから'], answer: 0,
        explain: 'She said そのおてらなら、わたしの家の近くですよ。いっしょに行きましょう: the temple was near her home. The history talk and the tea came later, and the restaurants were only something she talked about.' },
      { q: 'この[人|ひと]は、おばあさんの[家|いえ]へいつ[行|い]きましたか。',
        options: ['おてらを[見|み]る[前|まえ]', '[駅|えき]で[地図|ちず]をもらう[前|まえ]', 'つぎの[日|ひ]の[朝|あさ]', 'おてらを[見|み]た[後|あと]'], answer: 3,
        explain: 'わたしはおてらを見てから、おばあさんの家へ行きました: after seeing the temple, on the way back (帰りに), as the old woman had suggested.' }],
    notes: 'g:keredomo stands for the contrastive が. 15ふんぐらい: ぷ/ふ — the text writes ふん after 15 (じゅうごふん), matching v:分|ふん. よかったら (いい + たら) is listed under v:いい|いい; g:tara is not claimed because the surface よかったら is lexical.',
    uses: ['g:ni-iku', 'g:stem-compounds', 'g:te-adj-noun', 'g:naru', 'g:te-shimau', 'g:to-conditional', 'g:te-iru', 'g:n-desu', 'g:tai', 'g:te-kureru', 'g:nara', 'g:mashou', 'g:nagara', 'g:ya', 'g:masen-ka', 'g:te-iku', 'g:te-kara', 'g:noun-modifier', 'g:volitional', 'g:you-to-omou', 'g:doushite', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:先週|せんしゅう', 'v:休み|やすみ', 'v:一人|ひとり', 'v:古い|ふるい', 'v:お|お', 'v:寺|てら', 'v:多い|おおい', 'v:町|まち', 'v:旅行|りょこう', 'v:行く|いく', 'v:駅|えき', 'v:地図|ちず', 'v:もらう|もらう', 'v:歩く|あるく', 'v:始める|はじめる', 'v:細い|ほそい', 'v:道|みち', 'v:たくさん|たくさん', 'v:ある|ある', 'v:すぐに|すぐに', 'v:分かる|わかる', 'v:なる|なる', 'v:困る|こまる', 'v:犬|いぬ', 'v:散歩|さんぽ', 'v:する|する', 'v:おばあさん|おばあさん', 'v:どこ|どこ', 'v:聞く|きく', 'v:私|わたし', 'v:見せる|みせる', 'v:その|その', 'v:家|いえ', 'v:近く|ちかく', 'v:一緒|いっしょ', 'v:言う|いう', 'v:分|ふん', 'v:歴史|れきし', 'v:話|はなし', 'v:面白い|おもしろい', 'v:時間|じかん', 'v:過ぎる|すぎる', 'v:中|なか', 'v:木|き', 'v:静か|しずか', 'v:おいしい|おいしい', 'v:店|みせ', 'v:事|こと', 'v:いろいろ|いろいろ', 'v:教える|おしえる', 'v:着く|つく', 'v:時|とき', 'v:いい|いい', 'v:帰り|かえり', 'v:うち|うち', 'v:お茶|おちゃ', 'v:飲む|のむ', 'v:見る|みる', 'v:庭|にわ', 'v:きれい|きれい', 'v:とても|とても', 'v:今度|こんど', 'v:あの|あの', 'v:お土産|おみやげ', 'v:持つ|もつ', 'v:思う|おもう', 'v:人|ひと', 'v:どうして|どうして', 'v:探す|さがす', 'v:途中|とちゅう', 'v:後|あと', 'v:前|まえ', 'v:次|つぎ', 'v:日|ひ', 'v:朝|あさ', 'v:いつ|いつ', 'k:先', 'k:週', 'k:休', 'k:一', 'k:人', 'k:古', 'k:多', 'k:町', 'k:旅', 'k:行', 'k:駅', 'k:地', 'k:図', 'k:歩', 'k:道', 'k:犬', 'k:聞', 'k:見', 'k:家', 'k:近', 'k:言', 'k:店', 'k:教', 'k:話', 'k:時', 'k:間', 'k:着', 'k:帰', 'k:茶', 'k:飲', 'k:中', 'k:木', 'k:今', 'k:度', 'k:持', 'k:思', 'k:前', 'k:日', 'k:朝', 'k:後'],
    verified: true }),

  P({ id: 'p:n4-early-home-day', format: 'mid',
    furigana: 'わたしの[会社|かいしゃ]では、[先月|せんげつ]から[毎週|まいしゅう][水曜日|すいようび]が「[早|はや]く[帰|かえ]る[日|ひ]」になりました。この[日|ひ]は、[夕方|ゆうがた]6[時|じ]までに[仕事|しごと]を[終|お]わらせて、[会社|かいしゃ]を[出|で]なければなりません。6[時|じ]になると[会社|かいしゃ]の[電気|でんき]がぜんぶきえてしまうので、のこって[仕事|しごと]をすることはできません。\nはじめは、6[時|じ]までに[終|お]わるはずがないと[思|おも]っていました。いつもは8[時|じ]ごろまで[会社|かいしゃ]にいたからです。でも、[水曜日|すいようび]はかいぎを[早|はや]く[終|お]わらせたり、ほかの[人|ひと]にてつだってもらったりして、[朝|あさ]から[急|いそ]いで[仕事|しごと]をしています。すると、たいてい6[時|じ]までに[終|お]われます。\n[早|はや]く[帰|かえ]れる[水曜日|すいようび]の[夜|よる]、わたしは[駅|えき]の[近|ちか]くの[教室|きょうしつ]で[英語|えいご]を[習|なら]っています。[英語|えいご]で[外国|がいこく]のおきゃくさまと[少|すこ]し[話|はな]せるので、[仕事|しごと]にもやくに[立|た]っています。[同|おな]じ[会社|かいしゃ]の[人|ひと]には、スポーツをしている[人|ひと]や、[家族|かぞく]とばんご[飯|はん]を[食|た]べる[人|ひと]もいます。みんな[前|まえ]より[元気|げんき]になったようです。\nぶちょうは「ほかの[日|ひ]もこうなるといいね」と[言|い]っています。わたしも、[金曜日|きんようび]も[早|はや]く[帰|かえ]れる[日|ひ]になればいいと[思|おも]います。',
    en: 'At my company, since last month, every Wednesday has been an "early home day". On this day we have to finish our work by 6 p.m. and leave the office. At 6 all the office lights go off, so nobody can stay on and work. At first I thought there was no way I could finish by 6, because I usually stayed at the office until about 8. But on Wednesdays we finish meetings early, get help from other people and so on, and I work fast from the morning. Then I can usually finish by 6. On Wednesday evenings, when I can go home early, I learn English at a school near the station. I can talk a little in English with foreign clients, so it helps at work too. Among my colleagues, some do sports and some have dinner with their families. Everyone seems livelier than before. The department head says, "It would be good if the other days were like this too." I also think it would be nice if Friday became an early home day as well.',
    questions: [
      { q: '「[早|はや]く[帰|かえ]る[日|ひ]」には、[何|なに]をしなければなりませんか。',
        options: ['8[時|じ]ごろまで[会社|かいしゃ]にいる', '6[時|じ]までに[仕事|しごと]を[終|お]わらせて、[会社|かいしゃ]を[出|で]る', 'かいぎをしないで、[朝|あさ]から[急|いそ]いで[仕事|しごと]をする', '[駅|えき]の[近|ちか]くの[教室|きょうしつ]で[英語|えいご]を[習|なら]う'], answer: 1,
        explain: 'The rule: 夕方6時までに仕事を終わらせて、会社を出なければなりません. Staying until 8 was the old habit, meetings still happen (they just end early), and English class is the writer\'s own choice.' },
      { q: 'この[人|ひと]は、はじめどう[思|おも]っていましたか。',
        options: ['6[時|じ]までに[仕事|しごと]が[終|お]わるはずがない', '[早|はや]く[帰|かえ]れるのはうれしい', 'ほかの[人|ひと]にてつだってもらえばいい', '[金曜日|きんようび]も[早|はや]く[帰|かえ]れる[日|ひ]になればいい'], answer: 0,
        explain: 'はじめは、6時までに終わるはずがないと思っていました. Getting help is how the writer manages now, and the wish about Friday comes at the end.' },
      { q: 'この[人|ひと]は、[水曜日|すいようび]の[夜|よる]、[何|なに]をしていますか。',
        options: ['[家族|かぞく]とばんご[飯|はん]を[食|た]べている', 'スポーツをしている', '[駅|えき]の[近|ちか]くで[英語|えいご]を[習|なら]っている', '8[時|じ]ごろまで[会社|かいしゃ]で[仕事|しごと]をしている'], answer: 2,
        explain: 'On early Wednesday evenings the writer learns English near the station. Sports and family dinners are what some colleagues do.' }],
    uses: ['g:naru', 'g:made-ni', 'g:causative', 'g:nakereba-naranai', 'g:hazu-ga-nai', 'g:to-omou', 'g:te-ita', 'g:goro', 'g:kara', 'g:tari-tari', 'g:te-morau', 'g:te-iru', 'g:potential', 'g:noun-modifier', 'g:ya', 'g:you-da', 'g:to-ii', 'g:ba', 'g:nai-de', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:to-conditional', 'g:te-shimau', 'g:node', 'v:私|わたし', 'v:会社|かいしゃ', 'v:先月|せんげつ', 'v:毎週|まいしゅう', 'v:水曜日|すいようび', 'v:早い|はやい', 'v:帰る|かえる', 'v:日|ひ', 'v:なる|なる', 'v:この|この', 'v:夕方|ゆうがた', 'v:時|じ', 'v:仕事|しごと', 'v:終わる|おわる', 'v:出る|でる', 'v:初め|はじめ', 'v:はず|はず', 'v:思う|おもう', 'v:いつも|いつも', 'v:ごろ|ごろ', 'v:居る|いる', 'v:でも|でも', 'v:会議|かいぎ', 'v:ほか|ほか', 'v:人|ひと', 'v:手伝う|てつだう', 'v:朝|あさ', 'v:急ぐ|いそぐ', 'v:する|する', 'v:すると|すると', 'v:大抵|たいてい', 'v:夜|よる', 'v:駅|えき', 'v:近く|ちかく', 'v:教室|きょうしつ', 'v:英語|えいご', 'v:習う|ならう', 'v:同じ|おなじ', 'v:電気|でんき', 'v:全部|ぜんぶ', 'v:消える|きえる', 'v:残る|のこる', 'v:外国|がいこく', 'v:お|お', 'v:客|きゃく', 'v:様|さま', 'v:少し|すこし', 'v:話す|はなす', 'v:役に立つ|やくにたつ', 'v:できる|できる', 'v:スポーツ|スポーツ', 'v:家族|かぞく', 'v:晩御飯|ばんごはん', 'v:食べる|たべる', 'v:みんな|みんな', 'v:前|まえ', 'v:より|より', 'v:元気|げんき', 'v:部長|ぶちょう', 'v:こう|こう', 'v:いい|いい', 'v:言う|いう', 'v:金曜日|きんようび', 'v:何|なに', 'v:どう|どう', 'v:嬉しい|うれしい', 'v:もらう|もらう', 'k:会', 'k:社', 'k:先', 'k:月', 'k:毎', 'k:週', 'k:水', 'k:曜', 'k:日', 'k:早', 'k:帰', 'k:夕', 'k:方', 'k:時', 'k:仕', 'k:事', 'k:終', 'k:出', 'k:電', 'k:気', 'k:思', 'k:人', 'k:朝', 'k:急', 'k:夜', 'k:駅', 'k:近', 'k:教', 'k:室', 'k:英', 'k:語', 'k:習', 'k:外', 'k:国', 'k:少', 'k:話', 'k:立', 'k:同', 'k:家', 'k:族', 'k:飯', 'k:食', 'k:前', 'k:元', 'k:言', 'k:金', 'k:何'],
    verified: true }),

  // ── info (情報検索) ──
  P({ id: 'p:n4-kids-swim-classes', format: 'info',
    furigana: 'みなみ[町|まち]プール　[子|こ]どもすいえい[教室|きょうしつ]のごあんない\n・Aクラス　はじめての[人|ひと]　[月|げつ]・[水|すい]　[午後|ごご]4[時|じ]〜5[時|じ]　1か[月|げつ]3,000[円|えん]\n・Bクラス　25メートルおよげない[人|ひと]　[火|か]・[木|もく]　[午後|ごご]4[時|じ]〜5[時|じ]　1か[月|げつ]3,500[円|えん]\n・Cクラス　25メートルおよげる[人|ひと]　[火|か]・[金|きん]　[午後|ごご]5[時|じ]〜6[時|じ]　1か[月|げつ]4,000[円|えん]\n・[土曜日|どようび]クラス　だれでも　[土|ど]　[午前|ごぜん]10[時|じ]〜11[時|じ]　1か[月|げつ]2,500[円|えん]\nどのクラスも、6さいから12さいまでの[子|こ]どもが[入|はい]れます。はじめての[月|つき]は、クラスのお[金|かね]のほかに、[一人|ひとり]1,000[円|えん]かかります。[兄弟|きょうだい]で[入|はい]るばあいは、2[人|にん][目|め]からクラスのお[金|かね]が500[円|えん][安|やす]くなります。クラスに[入|はい]りたい[人|ひと]は、[前|まえ]の[月|つき]の25[日|にち]までに、うけつけで[名前|なまえ]を[書|か]いてください。ぼうしは、じぶんのものを[持|も]って[来|き]てください。',
    en: 'Minami Town Pool — Children\'s swimming classes. A class: first-timers, Mon & Wed, 4–5 p.m., 3,000 yen a month. B class: can\'t swim 25 m yet, Tue & Thu, 4–5 p.m., 3,500 yen. C class: can swim 25 m, Tue & Fri, 5–6 p.m., 4,000 yen. Saturday class: anyone, Sat 10–11 a.m., 2,500 yen. Every class takes children aged 6 to 12. In the first month there is an extra 1,000 yen per child on top of the class fee. When brothers and sisters join together, the class fee is 500 yen cheaper from the second child on. To join, write your name at the front desk by the 25th of the month before. Please bring your own swimming cap.',
    questions: [
      { q: 'リーさんのむすこは8さいで、25メートルおよげます。[月曜日|げつようび]と[水曜日|すいようび]はピアノを[習|なら]っていて、[土曜日|どようび]は[家族|かぞく]で[出|で]かけることが[多|おお]いです。どのクラスがいちばんいいですか。',
        options: ['Cクラス', 'Aクラス', 'Bクラス', '[土曜日|どようび]クラス'], answer: 0,
        explain: 'He can already swim 25 m, so A (first-timers) and B (cannot swim 25 m) do not fit; Mondays and Wednesdays are piano anyway, and Saturdays the family goes out. C (Tue & Fri, for children who can swim 25 m) fits.' },
      { q: '[兄弟|きょうだい][二人|ふたり]が、いっしょにBクラスに[入|はい]ります。はじめの[月|つき]は、ぜんぶでいくらはらいますか。',
        options: ['7,500[円|えん]', '9,000[円|えん]', '8,500[円|えん]', '6,500[円|えん]'], answer: 2,
        explain: 'B costs 3,500 yen; the second child pays 500 less (3,000), so 6,500. In the first month each child also pays 1,000 yen: 6,500 + 2,000 = 8,500. 7,500 counts the extra fee once, 9,000 forgets the sibling discount, 6,500 forgets the extra fee.' }],
    names: ['A', 'リー'],
    notes: 'Class letters A/B/C are Latin letters, not katakana. 月・水・火・木・金・土 are the one-kanji weekday abbreviations used in timetables (readings げつ, すい, か, もく, きん, ど); their ruby is backed by the kanji readings (no catalog word for them).',
    uses: ['g:noun-modifier', 'g:potential', 'g:made', 'g:made-ni', 'g:baai-wa', 'g:naru', 'g:tai', 'g:te-kudasai', 'g:te-iru', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:町|まち', 'v:プール|プール', 'v:子供|こども', 'v:水泳|すいえい', 'v:教室|きょうしつ', 'v:ご|ご', 'v:案内|あんない', 'v:クラス|クラス', 'v:初めて|はじめて', 'v:人|ひと', 'v:午後|ごご', 'v:時|じ', 'v:か月|かげつ', 'v:円|えん', 'v:メートル|メートル', 'v:泳ぐ|およぐ', 'v:土曜日|どようび', 'v:誰|だれ', 'v:午前|ごぜん', 'v:どの|どの', 'v:歳|さい', 'v:入る|はいる', 'v:月|つき', 'v:お金|おかね', 'v:ほか|ほか', 'v:一人|ひとり', 'v:かかる|かかる', 'v:兄弟|きょうだい', 'v:場合|ばあい', 'v:人|にん', 'v:目|め', 'v:安い|やすい', 'v:なる|なる', 'v:前|まえ', 'v:日|にち', 'v:受付|うけつけ', 'v:名前|なまえ', 'v:書く|かく', 'v:ください|ください', 'v:さん|さん', 'v:息子|むすこ', 'v:帽子|ぼうし', 'v:自分|じぶん', 'v:物|もの', 'v:持つ|もつ', 'v:月曜日|げつようび', 'v:水曜日|すいようび', 'v:ピアノ|ピアノ', 'v:習う|ならう', 'v:家族|かぞく', 'v:出かける|でかける', 'v:事|こと', 'v:多い|おおい', 'v:いちばん|いちばん', 'v:いい|いい', 'v:二人|ふたり', 'v:一緒|いっしょ', 'v:初め|はじめ', 'v:全部|ぜんぶ', 'v:いくら|いくら', 'v:払う|はらう', 'k:町', 'k:子', 'k:教', 'k:室', 'k:人', 'k:月', 'k:水', 'k:午', 'k:後', 'k:時', 'k:円', 'k:火', 'k:木', 'k:金', 'k:土', 'k:曜', 'k:日', 'k:前', 'k:入', 'k:一', 'k:兄', 'k:弟', 'k:目', 'k:安', 'k:名', 'k:書', 'k:持', 'k:来', 'k:習', 'k:家', 'k:族', 'k:出', 'k:多', 'k:二'],
    verified: true }),

  P({ id: 'p:n4-hospital-bus', format: 'info',
    furigana: '[東|ひがし][駅|えき]から[北山|きたやま][病院|びょういん]へ[行|い]くバス\n・[月|げつ]〜[金|きん]　8:00　8:40　9:20　10:00　11:00\n・[土|ど]　8:30　9:30　10:30\n・[日|にち]・[休|やす]みの[日|ひ]　バスはありません\n[東|ひがし][駅|えき]から[北山|きたやま][病院|びょういん]までは、25ふんぐらいかかります。8:00と8:40のバスは、[朝|あさ]は[道|みち]がこむので、10ぷんぐらいおくれることがあります。[病院|びょういん]のうけつけは[午前|ごぜん]8[時|じ]30ぷんから11[時|じ]までです。バスのお[金|かね]は、[大人|おとな]220[円|えん]、[子|こ]ども110[円|えん]です。[土曜日|どようび]は、[子|こ]どものお[金|かね]はいりません。[病院|びょういん]から[東|ひがし][駅|えき]へ[帰|かえ]るバスは、[午前|ごぜん]10[時|じ]から[午後|ごご]5[時|じ]まで、1[時間|じかん]に2[本|ほん]あります。[病院|びょういん]の[中|なか]で、[帰|かえ]るバスの[時間|じかん]を[見|み]ることができます。バスには[後|うし]ろのドアからのって、おりるときにお[金|かね]をはらってください。バスの[中|なか]では、[電話|でんわ]で[話|はな]さないでください。',
    en: 'Buses from Higashi Station to Kitayama Hospital. Mon–Fri: 8:00, 8:40, 9:20, 10:00, 11:00. Sat: 8:30, 9:30, 10:30. Sundays and holidays: no buses. The ride takes about 25 minutes. The 8:00 and 8:40 buses can be about 10 minutes late, because the roads are busy in the morning. The hospital front desk is open from 8:30 to 11 a.m. The fare is 220 yen for adults and 110 yen for children; on Saturdays children ride free. Buses from the hospital back to Higashi Station run twice an hour from 10 a.m. to 5 p.m.; their times are posted inside the hospital. Get on by the back door and pay when you get off. Please do not talk on the phone on the bus.',
    questions: [
      { q: '[木曜日|もくようび]に[病院|びょういん]へ[行|い]きます。うけつけが[終|お]わる[前|まえ]に[着|つ]きたいですが、[朝|あさ]はできるだけゆっくりしたいです。どのバスにのりますか。',
        options: ['8:40', '10:00', '9:20', '11:00'], answer: 1,
        explain: 'The desk closes at 11. The 10:00 bus arrives at about 10:25, in time; the 11:00 bus arrives too late. 8:40 and 9:20 also arrive in time, but they are earlier, and the question asks for the latest one that works.' },
      { q: '[大人|おとな][一人|ひとり]と[子|こ]ども[二人|ふたり]で、[土曜日|どようび]の9:30のバスにのります。バスのお[金|かね]は、ぜんぶでいくらですか。',
        options: ['440[円|えん]', '330[円|えん]', '0[円|えん]', '220[円|えん]'], answer: 3,
        explain: 'On Saturdays children ride free, so only the adult pays 220 yen. 440 charges both children at 110, 330 charges one of them, and 0 forgets the adult.' }],
    names: ['北山|きたやま'],
    notes: 'ゆっくり and ぐらい are kana words outside the catalog (ゆっくりと is the catalog entry). g:keredomo stands for the contrastive が in 着きたいですが.',
    uses: ['g:ni-ikimasu', 'g:node', 'g:koto', 'g:kara', 'g:made', 'g:tai', 'g:mae-ni', 'g:noun-modifier', 'g:koto-ga-dekiru', 'g:nai-de-kudasai', 'g:no', 'g:de', 'g:ni', 'g:ka', 'v:本|ほん', 'v:中|なか', 'v:時間|じかん', 'v:後ろ|うしろ', 'v:ドア|ドア', 'v:乗る|のる', 'v:降りる|おりる', 'v:払う|はらう', 'v:見る|みる', 'v:電話|でんわ', 'v:話す|はなす', 'v:ください|ください', 'v:東|ひがし', 'v:駅|えき', 'v:病院|びょういん', 'v:行く|いく', 'v:バス|バス', 'v:日|にち', 'v:休み|やすみ', 'v:日|ひ', 'v:ある|ある', 'v:分|ふん', 'v:かかる|かかる', 'v:朝|あさ', 'v:道|みち', 'v:込む|こむ', 'v:遅れる|おくれる', 'v:事|こと', 'v:受付|うけつけ', 'v:午前|ごぜん', 'v:時|じ', 'v:お金|おかね', 'v:大人|おとな', 'v:円|えん', 'v:子供|こども', 'v:土曜日|どようび', 'v:要る|いる', 'v:帰る|かえる', 'v:午後|ごご', 'v:木曜日|もくようび', 'v:終わる|おわる', 'v:前|まえ', 'v:着く|つく', 'v:できるだけ|できるだけ', 'v:どの|どの', 'v:一人|ひとり', 'v:二人|ふたり', 'v:全部|ぜんぶ', 'v:いくら|いくら', 'k:東', 'k:駅', 'k:北', 'k:山', 'k:病', 'k:院', 'k:行', 'k:月', 'k:金', 'k:土', 'k:日', 'k:休', 'k:朝', 'k:道', 'k:午', 'k:前', 'k:時', 'k:大', 'k:人', 'k:円', 'k:子', 'k:曜', 'k:帰', 'k:後', 'k:間', 'k:本', 'k:中', 'k:見', 'k:電', 'k:話', 'k:木', 'k:終', 'k:着', 'k:一', 'k:二'],
    verified: true }),

  P({ id: 'p:n4-apartment-list', format: 'info',
    furigana: '[駅|えき]の[近|ちか]くのアパート\n・[青山|あおやま]アパート　[駅|えき]から[歩|ある]いて5ふん　2かい　1か[月|げつ]60,000[円|えん]　ペットはだめ\n・[川口|かわぐち]アパート　[駅|えき]から[歩|ある]いて15ふん　1かい　1か[月|げつ]45,000[円|えん]　ペットはいい\n・[田中|たなか]アパート　[駅|えき]から[歩|ある]いて8ぷん　3かい　1か[月|げつ]52,000[円|えん]　ペットはいい\n・[大川|おおかわ]アパート　[駅|えき]から[歩|ある]いて12ふん　1かい　1か[月|げつ]50,000[円|えん]　ペットはだめ\n・[山本|やまもと]アパート　[駅|えき]から[歩|ある]いて3ぷん　4かい　1か[月|げつ]70,000[円|えん]　ペットはいい\nどのアパートも、[上|うえ]のお[金|かね]のほかに、[毎月|まいつき]3,000[円|えん]かかります。1かいのへやには、[小|ちい]さいにわがあります。どのへやも、[中|なか]でたばこをすうことはできません。へやを[見|み]たい[方|かた]は、[前|まえ]の[日|ひ]までに[電話|でんわ]でよやくしてください。[見|み]に[来|く]る[日|ひ]は、[午前|ごぜん]10[時|じ]から[午後|ごご]5[時|じ]までです。',
    en: 'Apartments near the station. Aoyama: 5 minutes\' walk, 2nd floor, 60,000 yen a month, no pets. Kawaguchi: 15 minutes, 1st floor, 45,000 yen, pets OK. Tanaka: 8 minutes, 3rd floor, 52,000 yen, pets OK. Okawa: 12 minutes, 1st floor, 50,000 yen, no pets. Yamamoto: 3 minutes, 4th floor, 70,000 yen, pets OK. Every apartment costs another 3,000 yen a month on top of the amount above. First-floor rooms have a small garden. Smoking is not allowed inside any of the rooms. If you want to see a room, please book by phone by the day before. Viewings are from 10 a.m. to 5 p.m.',
    questions: [
      { q: 'リーさんは、ねこといっしょに[住|す]みたいです。[駅|えき]から[歩|ある]いて10ぷんいないで、[毎月|まいつき]はらうお[金|かね]はぜんぶで56,000[円|えん]までにしたいです。どのアパートがいいですか。',
        options: ['[青山|あおやま]アパート', '[川口|かわぐち]アパート', '[田中|たなか]アパート', '[大川|おおかわ]アパート'], answer: 2,
        explain: 'Pets are allowed only at Kawaguchi and Tanaka. Kawaguchi is 15 minutes away; Tanaka is 8 minutes and costs 52,000 + 3,000 = 55,000 yen, under 56,000. Aoyama and Okawa do not allow pets, and Yamamoto costs 73,000 yen in all.' },
      { q: 'にわのあるへやに[住|す]みたいです。[駅|えき]からいちばん[近|ちか]いのは、どのアパートですか。',
        options: ['[大川|おおかわ]アパート', '[川口|かわぐち]アパート', '[青山|あおやま]アパート', '[田中|たなか]アパート'], answer: 0,
        explain: 'Only first-floor rooms have a garden: Kawaguchi (15 minutes) and Okawa (12 minutes), so Okawa is nearer. Yamamoto and Aoyama are nearer, but they are not on the first floor.' }],
    names: ['青山|あおやま', '川口|かわぐち', '田中|たなか', '大川|おおかわ', '山本|やまもと', 'リー'],
    uses: ['g:te-kudasai', 'g:tai', 'g:made', 'g:made-ni', 'g:noun-modifier', 'g:mo', 'g:no', 'g:kara', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:駅|えき', 'v:近く|ちかく', 'v:アパート|アパート', 'v:歩く|あるく', 'v:分|ふん', 'v:階|かい', 'v:か月|かげつ', 'v:円|えん', 'v:ペット|ペット', 'v:だめ|だめ', 'v:いい|いい', 'v:どの|どの', 'v:上|うえ', 'v:お金|おかね', 'v:ほか|ほか', 'v:毎月|まいつき', 'v:かかる|かかる', 'v:部屋|へや', 'v:小さい|ちいさい', 'v:庭|にわ', 'v:中|なか', 'v:たばこ|たばこ', 'v:吸う|すう', 'v:事|こと', 'v:できる|できる', 'v:ある|ある', 'v:見る|みる', 'v:方|かた', 'v:前|まえ', 'v:日|ひ', 'v:電話|でんわ', 'v:予約|よやく', 'v:する|する', 'v:ください|ください', 'v:来る|くる', 'v:午前|ごぜん', 'v:時|じ', 'v:午後|ごご', 'v:さん|さん', 'v:猫|ねこ', 'v:一緒|いっしょ', 'v:住む|すむ', 'v:以内|いない', 'v:払う|はらう', 'v:全部|ぜんぶ', 'v:いちばん|いちばん', 'v:近い|ちかい', 'k:駅', 'k:近', 'k:青', 'k:山', 'k:歩', 'k:月', 'k:円', 'k:川', 'k:口', 'k:田', 'k:中', 'k:大', 'k:本', 'k:上', 'k:金', 'k:毎', 'k:小', 'k:見', 'k:方', 'k:前', 'k:日', 'k:電', 'k:話', 'k:来', 'k:午', 'k:時', 'k:後', 'k:住'],
    verified: true }),

  P({ id: 'p:n4-museum-tickets', format: 'info',
    furigana: '[東山|ひがしやま]びじゅつかん　[入|はい]るときのお[金|かね]\n・[大人|おとな]　800[円|えん]\n・[高校生|こうこうせい]・[大学生|だいがくせい]　500[円|えん]\n・65さい[以上|いじょう]の[方|かた]　400[円|えん]\n・15さいまでの[子|こ]ども　お[金|かね]はいりません\n20[人|にん][以上|いじょう]でいっしょに[来|く]るばあいは、[一人|ひとり]100[円|えん][安|やす]くなります。[毎月|まいつき][三日|みっか]は「[町|まち]の[日|ひ]」で、だれでもお[金|かね]がいりません。\n[開|あ]いている[時間|じかん]は、[午前|ごぜん]9[時|じ]から[午後|ごご]5[時|じ]までです。[入|はい]ることができるのは、4[時|じ]30ぷんまでです。[月曜日|げつようび]はお[休|やす]みです。[月曜日|げつようび]が[休|やす]みの[日|ひ]のばあいは、つぎの[日|ひ]がお[休|やす]みになります。\nびじゅつかんの[中|なか]で[写真|しゃしん]をとってもいいですが、[大|おお]きなこえで[話|はな]したり、[食|た]べたり[飲|の]んだりしないでください。1かいにきっさてんがあります。ちゅうしゃじょうはありませんので、[電車|でんしゃ]かバスで[来|き]てください。[今月|こんげつ]は「[世界|せかい]の[花|はな]のえ」を[見|み]ることができます。',
    en: 'Higashiyama Art Museum — admission. Adults 800 yen. High-school and university students 500 yen. People aged 65 and over 400 yen. Children up to 15: free. Groups of 20 or more coming together get 100 yen off per person. On the 3rd of every month, "Town Day", admission is free for everyone. Open 9 a.m. to 5 p.m.; last entry 4:30. Closed on Mondays; when Monday is a holiday, the museum closes the following day instead. Photos are allowed inside, but please do not talk loudly, eat or drink. There is a café on the first floor. There is no car park, so please come by train or bus. This month you can see "Flower Paintings of the World".',
    questions: [
      { q: '[大学生|だいがくせい]のリンさんと、70さいのおばあさんと、10さいの[弟|おとうと]の3[人|にん]で、10[日|か]にびじゅつかんへ[行|い]きます。ぜんぶでいくらですか。',
        options: ['1,300[円|えん]', '1,700[円|えん]', '0[円|えん]', '900[円|えん]'], answer: 3,
        explain: 'Lin pays the student price (500), the grandmother is over 65 (400) and the brother is under 15 (free): 900 yen. 1,300 charges the grandmother as an adult, 1,700 also forgets the student price, and 0 would only be right on the 3rd.' },
      { q: '[会社|かいしゃ]の[人|ひと]25[人|にん]で、いっしょに[行|い]きます。みんな[大人|おとな]です。[行|い]く[日|ひ]は[三日|みっか]ではありません。[一人|ひとり]いくらですか。',
        options: ['800[円|えん]', '700[円|えん]', '600[円|えん]', '400[円|えん]'], answer: 1,
        explain: 'Groups of 20 or more get 100 yen off each: adults pay 800 − 100 = 700. 800 forgets the group discount, and it is not the 3rd, so the visit is not free.' }],
    names: ['東山|ひがしやま', 'リン', '十日|とおか'],
    uses: ['g:noun-modifier', 'g:made', 'g:baai-wa', 'g:naru', 'g:koto-ga-dekiru', 'g:te-iru', 'g:ni-ikimasu', 'g:de', 'g:no', 'g:ni', 'g:ka', 'g:node', 'g:te-kudasai', 'g:te-mo-ii', 'g:tari-tari', 'g:nai-de-kudasai', 'v:美術館|びじゅつかん', 'v:入る|はいる', 'v:時|とき', 'v:お金|おかね', 'v:大人|おとな', 'v:円|えん', 'v:高校生|こうこうせい', 'v:大学生|だいがくせい', 'v:歳|さい', 'v:以上|いじょう', 'v:方|かた', 'v:子供|こども', 'v:要る|いる', 'v:人|にん', 'v:一緒|いっしょ', 'v:来る|くる', 'v:場合|ばあい', 'v:一人|ひとり', 'v:安い|やすい', 'v:なる|なる', 'v:毎月|まいつき', 'v:三日|みっか', 'v:町|まち', 'v:日|ひ', 'v:誰|だれ', 'v:開く|あく', 'v:時間|じかん', 'v:午前|ごぜん', 'v:時|じ', 'v:午後|ごご', 'v:月曜日|げつようび', 'v:中|なか', 'v:写真|しゃしん', 'v:撮る|とる', 'v:いい|いい', 'v:大きな|おおきな', 'v:声|こえ', 'v:話す|はなす', 'v:食べる|たべる', 'v:飲む|のむ', 'v:する|する', 'v:ください|ください', 'v:階|かい', 'v:喫茶店|きっさてん', 'v:駐車場|ちゅうしゃじょう', 'v:電車|でんしゃ', 'v:バス|バス', 'v:ある|ある', 'v:今月|こんげつ', 'v:世界|せかい', 'v:花|はな', 'v:絵|え', 'v:見る|みる', 'v:休み|やすみ', 'v:次|つぎ', 'v:さん|さん', 'v:おばあさん|おばあさん', 'v:弟|おとうと', 'v:行く|いく', 'v:全部|ぜんぶ', 'v:いくら|いくら', 'v:会社|かいしゃ', 'v:人|ひと', 'v:みんな|みんな', 'v:事|こと', 'v:できる|できる', 'k:東', 'k:山', 'k:入', 'k:金', 'k:大', 'k:人', 'k:円', 'k:高', 'k:校', 'k:生', 'k:学', 'k:以', 'k:上', 'k:方', 'k:子', 'k:来', 'k:一', 'k:安', 'k:毎', 'k:月', 'k:三', 'k:日', 'k:町', 'k:開', 'k:時', 'k:間', 'k:午', 'k:前', 'k:後', 'k:曜', 'k:休', 'k:中', 'k:写', 'k:真', 'k:話', 'k:食', 'k:飲', 'k:電', 'k:車', 'k:今', 'k:世', 'k:界', 'k:花', 'k:見', 'k:弟', 'k:行', 'k:会', 'k:社'],
    verified: true }),

  P({ id: 'p:n4-clinic-hours', format: 'info',
    furigana: '[山下|やました][病院|びょういん]（[東|ひがし][駅|えき]から[歩|ある]いて7ふん）　[開|あ]いている[時間|じかん]\n・[月|げつ]・[火|か]・[木|もく]・[金|きん]　[午前|ごぜん]9[時|じ]〜12[時|じ]　[午後|ごご]3[時|じ]〜6[時|じ]\n・[水|すい]　[午前|ごぜん]9[時|じ]〜12[時|じ]（[午後|ごご]はお[休|やす]み）\n・[土|ど]　[午前|ごぜん]9[時|じ]〜[午後|ごご]1[時|じ]\n・[日|にち]　お[休|やす]み\nはじめて[来|く]る[方|かた]は、しまる30ぷん[前|まえ]までに[来|き]てください。よやくをした[方|かた]から[先|さき]に[医者|いしゃ]に[見|み]てもらえます。よやくは、[前|まえ]の[日|ひ]の[午後|ごご]6[時|じ]までに[電話|でんわ]でしてください。ねつのある[方|かた]は、[病院|びょういん]に[入|はい]る[前|まえ]に、うけつけに[電話|でんわ]してください。くすりは、[病院|びょういん]の[中|なか]でもらえます。[病院|びょういん]の[前|まえ]にちゅうしゃじょうがあります（10[台|だい]）。[車|くるま]で[来|く]る[方|かた]は、うけつけで[車|くるま]のばんごうを[言|い]ってください。[日曜日|にちようび]や[夜|よる]、[急|きゅう]にぐあいが[悪|わる]くなったときは、[東|ひがし][町|まち][病院|びょういん]（03-1234-5678）に[電話|でんわ]してください。',
    en: 'Yamashita Hospital (7 minutes\' walk from Higashi Station) — opening hours. Mon, Tue, Thu, Fri: 9–12 a.m., 3–6 p.m. Wed: 9–12 a.m. (closed in the afternoon). Sat: 9 a.m.–1 p.m. Sun: closed. First-time patients, please come at least 30 minutes before closing. Patients with a booking see the doctor first. Book by phone by 6 p.m. the day before. If you have a fever, phone the front desk before coming into the hospital. Medicine can be collected inside the hospital. There is a car park for 10 cars in front; if you come by car, give your number plate at the front desk. If you suddenly feel ill on a Sunday or at night, call Higashi Town Hospital (03-1234-5678).',
    questions: [
      { q: 'はじめてこの[病院|びょういん]へ[行|い]きます。[仕事|しごと]が[午後|ごご]5[時|じ]に[終|お]わるので、そのあとで[行|い]きたいです。いつまでに[着|つ]けばいいですか。',
        options: ['[金曜日|きんようび]の[午後|ごご]5[時|じ]30ぷんまでに', '[水曜日|すいようび]の[午後|ごご]5[時|じ]30ぷんまでに', '[金曜日|きんようび]の[午後|ごご]6[時|じ]までに', '[土曜日|どようび]の[午後|ごご]5[時|じ]30ぷんまでに'], answer: 0,
        explain: 'After 5 p.m. only Mon, Tue, Thu and Fri are open (until 6). First-timers must arrive 30 minutes before closing, so by 5:30 on Friday. Wednesday afternoon and Saturday after 1 are closed, and 6:00 is closing time, too late for a first visit.' },
      { q: '[土曜日|どようび]の[朝|あさ]に[行|い]きたいので、よやくをします。いつまでに[電話|でんわ]しなければなりませんか。',
        options: ['[土曜日|どようび]の[午前|ごぜん]9[時|じ]まで', '[金曜日|きんようび]の[午後|ごご]3[時|じ]まで', '[金曜日|きんようび]の[午後|ごご]6[時|じ]まで', '[土曜日|どようび]の[午後|ごご]1[時|じ]まで'], answer: 2,
        explain: 'Bookings are made by phone by 6 p.m. the day before (前の日の午後6時まで), so Friday by 6. Saturday morning is the visit itself, and 3 p.m. is only when the Friday afternoon session opens.' }],
    names: ['山下|やました'],
    uses: ['g:te-iru', 'g:made', 'g:made-ni', 'g:te-kudasai', 'g:te-morau', 'g:potential', 'g:mae-ni', 'g:node', 'g:tai', 'g:ba', 'g:nakereba-naranai', 'g:noun-modifier', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:naru', 'g:ya', 'v:病院|びょういん', 'v:開く|あく', 'v:時間|じかん', 'v:午前|ごぜん', 'v:時|じ', 'v:午後|ごご', 'v:お|お', 'v:休み|やすみ', 'v:日|にち', 'v:初めて|はじめて', 'v:来る|くる', 'v:方|かた', 'v:閉まる|しまる', 'v:分|ふん', 'v:前|まえ', 'v:ください|ください', 'v:予約|よやく', 'v:する|する', 'v:先|さき', 'v:医者|いしゃ', 'v:見る|みる', 'v:もらう|もらう', 'v:日|ひ', 'v:電話|でんわ', 'v:熱|ねつ', 'v:ある|ある', 'v:入る|はいる', 'v:受付|うけつけ', 'v:東|ひがし', 'v:駅|えき', 'v:歩く|あるく', 'v:薬|くすり', 'v:中|なか', 'v:駐車場|ちゅうしゃじょう', 'v:台|だい', 'v:日曜日|にちようび', 'v:夜|よる', 'v:急|きゅう', 'v:具合|ぐあい', 'v:悪い|わるい', 'v:なる|なる', 'v:町|まち', 'v:車|くるま', 'v:番号|ばんごう', 'v:言う|いう', 'v:行く|いく', 'v:仕事|しごと', 'v:終わる|おわる', 'v:後|あと', 'v:いつ|いつ', 'v:着く|つく', 'v:いい|いい', 'v:金曜日|きんようび', 'v:水曜日|すいようび', 'v:土曜日|どようび', 'v:朝|あさ', 'k:山', 'k:下', 'k:病', 'k:院', 'k:東', 'k:駅', 'k:歩', 'k:開', 'k:時', 'k:間', 'k:月', 'k:火', 'k:木', 'k:金', 'k:午', 'k:前', 'k:後', 'k:水', 'k:休', 'k:土', 'k:日', 'k:来', 'k:方', 'k:先', 'k:医', 'k:者', 'k:見', 'k:電', 'k:話', 'k:入', 'k:中', 'k:台', 'k:車', 'k:言', 'k:曜', 'k:夜', 'k:急', 'k:悪', 'k:町', 'k:行', 'k:仕', 'k:事', 'k:終', 'k:着', 'k:朝'],
    verified: true }),

  P({ id: 'p:n4-japanese-class-events', format: 'info',
    furigana: '[東|ひがし][町|まち][日本|にほん][語|ご][教室|きょうしつ]　10[月|がつ]のお[知|し]らせ（[電話|でんわ]03-2345-6789）\n・11[日|にち]（[土|ど]）　[日本|にほん]の[料理|りょうり]を[作|つく]ろう　[午前|ごぜん]10[時|じ]から　500[円|えん]\n・12[日|にち]（[日|にち]）　[町|まち]のおてらを[見|み]に[行|い]こう　[午後|ごご]1[時|じ]から　お[金|かね]はいりません\n・18[日|にち]（[土|ど]）　[日本|にほん]の[歌|うた]を[歌|うた]おう　[午後|ごご]2[時|じ]から　お[金|かね]はいりません\n・25[日|にち]（[土|ど]）　きものを[着|き]てみよう　[午前|ごぜん]10[時|じ]から　1,000[円|えん]\n[来|き]たい[人|ひと]は、1[週間|しゅうかん][前|まえ]までに、[教室|きょうしつ]のうけつけで[名前|なまえ]を[書|か]いてください。おてらへ[行|い]く[日|ひ]に[雨|あめ]がふったら、1[週間|しゅうかん][後|あと]の[同|おな]じ[時間|じかん]になります。[料理|りょうり]ときものは、20[人|にん]になったら、そこで[終|お]わりです。[料理|りょうり]の[日|ひ]は、[作|つく]った[料理|りょうり]をみんなで[食|た]べますので、ひるご[飯|はん]はいりません。きものは[教室|きょうしつ]で[借|か]りることができますが、じぶんのきものを[持|も]って[来|き]てもいいです。',
    en: 'Higashi Town Japanese class — October events. 11th (Sat): let\'s cook Japanese food, from 10 a.m., 500 yen. 12th (Sun): let\'s go and see the town\'s temples, from 1 p.m., free. 18th (Sat): let\'s sing Japanese songs, from 2 p.m., free. 25th (Sat): let\'s try on kimono, from 10 a.m., 1,000 yen. If you want to come, write your name at the class front desk at least a week before. If it rains on the temple day, it moves to the same time one week later. Cooking and kimono close when 20 people have signed up. On the cooking day everyone eats what they made, so no lunch is needed. Kimono can be borrowed at the class, but you may also bring your own.',
    questions: [
      { q: 'マリアさんは、[土曜日|どようび]の[午前|ごぜん]は[仕事|しごと]があります。お[金|かね]がかからないものに[行|い]きたいですが、[歌|うた]はあまりすきではありません。どれに[行|い]きますか。',
        options: ['11[日|にち]の[料理|りょうり]', '12[日|にち]のおてら', '18[日|にち]の[歌|うた]', '25[日|にち]のきもの'], answer: 1,
        explain: 'Only the temple walk (12th) and the singing (18th) are free; Maria does not like singing, so the temple walk. It is on a Sunday afternoon, so her Saturday-morning job does not clash.' },
      { q: '12[日|にち]は[雨|あめ]がふりました。おてらへ[行|い]くのは、いつになりますか。',
        options: ['13[日|にち]の[午後|ごご]1[時|じ]', '18[日|にち]の[午後|ごご]2[時|じ]', '19[日|にち]の[午前|ごぜん]10[時|じ]', '19[日|にち]の[午後|ごご]1[時|じ]'], answer: 3,
        explain: 'If it rains, the walk moves to the same time one week later: Sunday the 19th at 1 p.m. The 13th is the next day, and 2 p.m. on the 18th is the singing event.' }],
    names: ['日本|にほん', 'マリア'],
    notes: '作ろう / 行こう / 歌おう / 着てみよう are volitional event titles (let\'s …).',
    uses: ['g:volitional', 'g:ni-iku', 'g:te-miru', 'g:tai', 'g:made-ni', 'g:te-kudasai', 'g:tara', 'g:naru', 'g:amari-nai', 'g:kara', 'g:to', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:node', 'g:koto-ga-dekiru', 'g:te-mo-ii', 'g:noun-modifier', 'v:東|ひがし', 'v:町|まち', 'v:語|ご', 'v:教室|きょうしつ', 'v:月|がつ', 'v:お|お', 'v:日|にち', 'v:料理|りょうり', 'v:作る|つくる', 'v:午前|ごぜん', 'v:時|じ', 'v:円|えん', 'v:寺|てら', 'v:見る|みる', 'v:行く|いく', 'v:午後|ごご', 'v:お金|おかね', 'v:要る|いる', 'v:歌|うた', 'v:歌う|うたう', 'v:着物|きもの', 'v:着る|きる', 'v:来る|くる', 'v:人|ひと', 'v:週間|しゅうかん', 'v:前|まえ', 'v:受付|うけつけ', 'v:名前|なまえ', 'v:書く|かく', 'v:ください|ください', 'v:日|ひ', 'v:雨|あめ', 'v:降る|ふる', 'v:後|あと', 'v:電話|でんわ', 'v:同じ|おなじ', 'v:みんな|みんな', 'v:食べる|たべる', 'v:昼御飯|ひるごはん', 'v:借りる|かりる', 'v:自分|じぶん', 'v:持つ|もつ', 'v:時間|じかん', 'v:なる|なる', 'v:人|にん', 'v:そこ|そこ', 'v:終わり|おわり', 'v:さん|さん', 'v:土曜日|どようび', 'v:仕事|しごと', 'v:ある|ある', 'v:かかる|かかる', 'v:物|もの', 'v:余り|あまり', 'v:好き|すき', 'v:どれ|どれ', 'v:いつ|いつ', 'k:東', 'k:町', 'k:日', 'k:本', 'k:語', 'k:教', 'k:室', 'k:月', 'k:知', 'k:電', 'k:話', 'k:土', 'k:料', 'k:理', 'k:作', 'k:午', 'k:前', 'k:時', 'k:円', 'k:見', 'k:行', 'k:後', 'k:金', 'k:歌', 'k:着', 'k:来', 'k:人', 'k:週', 'k:間', 'k:名', 'k:書', 'k:雨', 'k:同', 'k:終', 'k:食', 'k:飯', 'k:借', 'k:持', 'k:曜', 'k:仕', 'k:事'],
    verified: true }),

  P({ id: 'p:n4-parcel-redelivery', format: 'info',
    furigana: '[田中|たなか]さま　おとどけもののお[知|し]らせ\n[電話|でんわ]：0120-345-678（[午前|ごぜん]8[時|じ]〜[午後|ごご]8[時|じ]）\n[今日|きょう]の[午前|ごぜん]11[時|じ]におにもつを[持|も]って[来|き]ましたが、るすでしたので、[持|も]って[帰|かえ]りました。もう[一度|いちど]とどけてほしい[時間|じかん]を、[電話|でんわ]でお[知|し]らせください。\n・[午前|ごぜん]　8[時|じ]〜12[時|じ]\n・[午後|ごご]1　12[時|じ]〜3[時|じ]\n・[午後|ごご]2　3[時|じ]〜6[時|じ]\n・[夜|よる]　6[時|じ]〜9[時|じ]\n[今日|きょう]もう[一度|いちど]とどけてほしいばあいは、[午後|ごご]5[時|じ]までにお[電話|でんわ]ください。5[時|じ]より[後|あと]のお[電話|でんわ]は、つぎの[日|ひ]になります。[会社|かいしゃ]までとりに[来|く]ることもできます（[午前|ごぜん]9[時|じ]〜[午後|ごご]8[時|じ]）。[会社|かいしゃ]は[東|ひがし][駅|えき]の[北|きた]がわにあります。とりに[来|く]るときは、このお[知|し]らせを[持|も]って[来|き]てください。1[週間|しゅうかん]の[間|あいだ]にれんらくがないばあいは、おにもつを[送|おく]った[方|かた]にかえします。',
    en: 'Mr./Ms. Tanaka — Delivery notice. Phone: 0120-345-678 (8 a.m.–8 p.m.). We brought your parcel at 11 a.m. today, but nobody was home, so we took it back. Please phone us with the time you would like it delivered again. Morning 8–12; Afternoon 1: 12–3; Afternoon 2: 3–6; Evening 6–9. If you want it again today, please call by 5 p.m. Calls after 5 are for the next day. You can also collect it at our office (9 a.m.–8 p.m.), on the north side of Higashi Station; please bring this notice. If we hear nothing within a week, the parcel goes back to the sender.',
    questions: [
      { q: '[田中|たなか]さんは[午後|ごご]6[時|じ]にうちに[帰|かえ]って、このお[知|し]らせを[見|み]ました。にもつをいちばん[早|はや]く[手|て]に[入|い]れたいです。どうしますか。',
        options: ['[電話|でんわ]して、[今日|きょう]の[夜|よる]にとどけてもらう', '[電話|でんわ]して、あしたの[午前|ごぜん]にとどけてもらう', '[今日|きょう]の[午後|ごご]8[時|じ]までに、[会社|かいしゃ]へとりに[行|い]く', '1[週間|しゅうかん]、れんらくを[待|ま]つ'], answer: 2,
        explain: 'It is already past 5 p.m., so a phone call only gets a delivery tomorrow. The office is open until 8 p.m., so collecting it there tonight is fastest. Waiting a week sends the parcel back.' },
      { q: '[田中|たなか]さんは[午後|ごご]1[時|じ]に[電話|でんわ]をかけます。[今日|きょう]は[午後|ごご]3[時|じ]から6[時|じ]までうちにいて、[夜|よる]は[出|で]かけます。どの[時間|じかん]をえらびますか。',
        options: ['[午後|ごご]2', '[午前|ごぜん]', '[午後|ごご]1', '[夜|よる]'], answer: 0,
        explain: 'Tanaka is home 3–6 p.m., which is exactly the Afternoon 2 slot, and a 1 p.m. call is before the 5 p.m. cut-off for same-day delivery. The morning is over, Afternoon 1 ends at 3 when nobody is home yet, and in the evening Tanaka is out.' }],
    names: ['田中|たなか'],
    notes: 'おとどけもの (お届け物) is read as お + 届ける + 物.',
    uses: ['g:node', 'g:te-hoshii', 'g:o-kudasai', 'g:made-ni', 'g:baai-wa', 'g:naru', 'g:te-iru-aida-ni', 'g:te-kudasai', 'g:ni-iku', 'g:te-morau', 'g:tai', 'g:noun-modifier', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:様|さま', 'v:お|お', 'v:届ける|とどける', 'v:物|もの', 'v:知らせる|しらせる', 'v:今日|きょう', 'v:午前|ごぜん', 'v:時|じ', 'v:荷物|にもつ', 'v:持つ|もつ', 'v:来る|くる', 'v:留守|るす', 'v:帰る|かえる', 'v:もう一度|もういちど', 'v:時間|じかん', 'v:電話|でんわ', 'v:ください|ください', 'v:午後|ごご', 'v:夜|よる', 'v:場合|ばあい', 'v:より|より', 'v:後|あと', 'v:次|つぎ', 'v:日|ひ', 'v:会社|かいしゃ', 'v:東|ひがし', 'v:駅|えき', 'v:北|きた', 'v:側|がわ', 'v:ある|ある', 'v:取る|とる', 'v:この|この', 'v:時|とき', 'v:事|こと', 'v:できる|できる', 'v:週間|しゅうかん', 'v:間|あいだ', 'v:連絡|れんらく', 'v:ない|ない', 'v:送る|おくる', 'v:方|かた', 'v:返す|かえす', 'v:さん|さん', 'v:見る|みる', 'v:いちばん|いちばん', 'v:早い|はやい', 'v:手|て', 'v:入れる|いれる', 'v:どう|どう', 'v:する|する', 'v:行く|いく', 'v:明日|あした', 'v:待つ|まつ', 'v:掛ける|かける', 'v:居る|いる', 'v:出かける|でかける', 'v:どの|どの', 'v:選ぶ|えらぶ', 'k:田', 'k:中', 'k:知', 'k:電', 'k:話', 'k:午', 'k:前', 'k:時', 'k:後', 'k:今', 'k:日', 'k:持', 'k:来', 'k:帰', 'k:一', 'k:度', 'k:間', 'k:夜', 'k:会', 'k:社', 'k:東', 'k:駅', 'k:北', 'k:週', 'k:送', 'k:方', 'k:見', 'k:早', 'k:手', 'k:入', 'k:行', 'k:待', 'k:出'],
    verified: true }),

  P({ id: 'p:n4-part-time-ads', format: 'info',
    furigana: 'アルバイトの[人|ひと]をさがしています\n・パン[屋|や]　[朝|あさ]6[時|じ]〜10[時|じ]　1[時間|じかん]1,100[円|えん]　[土|ど]・[日|にち]だけ\n・[本|ほん][屋|や]　[午後|ごご]5[時|じ]〜9[時|じ]　1[時間|じかん]1,000[円|えん]　[月|げつ]〜[金|きん]（1[週間|しゅうかん]に3[日|か]から）\n・レストラン　[夜|よる]6[時|じ]〜11[時|じ]　1[時間|じかん]1,300[円|えん]　[金|きん]・[土|ど]・[日|にち]\n・スーパー　[午前|ごぜん]9[時|じ]〜[午後|ごご]1[時|じ]　1[時間|じかん]1,050[円|えん]　[月|げつ]〜[土|ど]　[学生|がくせい]はだめ\nどの[店|みせ]も、はじめの1か[月|げつ]は、1[時間|じかん]のお[金|かね]が50[円|えん][安|やす]くなります。[夜|よる]10[時|じ]より[後|あと]の[仕事|しごと]は、18さい[以上|いじょう]の[人|ひと]しかできません。[仕事|しごと]がしたい[人|ひと]は、[店|みせ]に[電話|でんわ]してから、[会|あ]いに[来|き]てください。どの[店|みせ]も[駅|えき]から[歩|ある]いて10ぷんいないです。[仕事|しごと]のときに[着|き]る[服|ふく]は、[店|みせ]で[貸|か]します。パン[屋|や]では、[仕事|しごと]のあとでパンをもらえます。レストランでは、ばんご[飯|はん]を[食|た]べることができます。',
    en: 'Part-time staff wanted. Bakery: 6–10 a.m., 1,100 yen an hour, Sat & Sun only. Bookshop: 5–9 p.m., 1,000 yen an hour, Mon–Fri (from 3 days a week). Restaurant: 6–11 p.m., 1,300 yen an hour, Fri, Sat & Sun. Supermarket: 9 a.m.–1 p.m., 1,050 yen an hour, Mon–Sat, no students. At every shop the hourly pay is 50 yen lower for the first month. Only people aged 18 or over can work after 10 p.m. If you want a job, phone the shop first and then come and meet us. Every shop is within a 10-minute walk of the station. Work clothes are lent by the shop. At the bakery you can take bread home after work, and at the restaurant you can eat dinner.',
    questions: [
      { q: 'リーさんは[大学生|だいがくせい]です。じゅぎょうは[月曜日|げつようび]から[金曜日|きんようび]の[午前|ごぜん]9[時|じ]から[午後|ごご]4[時|じ]までです。[月曜日|げつようび]から[木曜日|もくようび]の[夕方|ゆうがた]から[夜|よる]にはたらきたいです。どれがいいですか。',
        options: ['パン[屋|や]', 'レストラン', 'スーパー', '[本|ほん][屋|や]'], answer: 3,
        explain: 'Lee wants Monday–Thursday evenings. The bookshop runs 5–9 p.m. Mon–Fri, after classes. The bakery is weekend mornings, the restaurant only Fri–Sun, and the supermarket is daytime and takes no students.' },
      { q: '17さいの[高校生|こうこうせい]が、[土曜日|どようび]と[日曜日|にちようび]だけはたらきたいです。どれがいいですか。',
        options: ['[本|ほん][屋|や]', 'パン[屋|や]', 'レストラン', 'スーパー'], answer: 1,
        explain: 'The bakery is Saturday and Sunday mornings only. The bookshop is weekdays, the supermarket takes no students, and the restaurant runs until 11 p.m., later than a 17-year-old may work.' }],
    names: ['リー'],
    uses: ['g:te-iru', 'g:dake', 'g:kara', 'g:naru', 'g:shika-nai', 'g:tai', 'g:te-kara', 'g:te-kudasai', 'g:potential', 'g:koto-ga-dekiru', 'g:made', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'v:アルバイト|アルバイト', 'v:人|ひと', 'v:探す|さがす', 'v:パン|パン', 'v:屋|や', 'v:朝|あさ', 'v:時|じ', 'v:時間|じかん', 'v:円|えん', 'v:日|にち', 'v:だけ|だけ', 'v:本|ほん', 'v:午後|ごご', 'v:週間|しゅうかん', 'v:レストラン|レストラン', 'v:夜|よる', 'v:スーパー|スーパー', 'v:午前|ごぜん', 'v:学生|がくせい', 'v:だめ|だめ', 'v:どの|どの', 'v:店|みせ', 'v:初め|はじめ', 'v:か月|かげつ', 'v:お金|おかね', 'v:安い|やすい', 'v:より|より', 'v:後|あと', 'v:仕事|しごと', 'v:歳|さい', 'v:以上|いじょう', 'v:できる|できる', 'v:する|する', 'v:電話|でんわ', 'v:会う|あう', 'v:来る|くる', 'v:時|とき', 'v:駅|えき', 'v:歩く|あるく', 'v:以内|いない', 'v:着る|きる', 'v:服|ふく', 'v:貸す|かす', 'v:もらう|もらう', 'v:晩御飯|ばんごはん', 'v:食べる|たべる', 'v:事|こと', 'v:さん|さん', 'v:大学生|だいがくせい', 'v:授業|じゅぎょう', 'v:月曜日|げつようび', 'v:金曜日|きんようび', 'v:木曜日|もくようび', 'v:夕方|ゆうがた', 'v:働く|はたらく', 'v:どれ|どれ', 'v:いい|いい', 'v:高校生|こうこうせい', 'v:土曜日|どようび', 'v:日曜日|にちようび', 'k:人', 'k:屋', 'k:朝', 'k:時', 'k:間', 'k:円', 'k:土', 'k:日', 'k:本', 'k:午', 'k:後', 'k:月', 'k:金', 'k:週', 'k:夜', 'k:前', 'k:学', 'k:生', 'k:店', 'k:安', 'k:仕', 'k:事', 'k:以', 'k:上', 'k:電', 'k:話', 'k:会', 'k:来', 'k:駅', 'k:歩', 'k:着', 'k:服', 'k:貸', 'k:飯', 'k:食', 'k:大', 'k:曜', 'k:木', 'k:夕', 'k:方', 'k:高', 'k:校'],
    verified: true })
]);
})();
