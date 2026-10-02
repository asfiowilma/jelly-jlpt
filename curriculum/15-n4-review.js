"use strict";



// Phase 15: N4 Review (Days 661–690)
// A 30-day consolidation of N4 content before starting N3.

// Days 661–665: Review N4 vocabulary (daily life, weather, emotions, travel, food)

curriculum.push({
  day: 661,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(661 / 7),
  title: "N4 Vocabulary Review: Daily Life",
  intro: "Welcome to Phase 15 — your 30-day N4 review before tackling N3. We begin by revisiting everyday vocabulary that forms the backbone of intermediate Japanese.",
  type: "review",
  chars: [],
  vocab: [
    ["生活", "せいかつ", "life / daily living"],
    ["習慣", "しゅうかん", "habit / custom"],
    ["用事", "ようじ", "errand / things to do"],
    ["近所", "きんじょ", "neighborhood"],
    ["引っ越し", "ひっこし", "moving (residence)"]
  ],
  grammar: {
    pattern: "～ことにする",
    meaning: "to decide to do ~",
    example_jp: "毎朝六時に起きることにしました。",
    example_en: "I decided to wake up at six every morning."
  },
  practice: "Write a paragraph describing your daily routine using at least four of today's vocabulary words and the grammar pattern.",
  tip: "～ことにする (I decide to ~) vs ～ことになる (it has been decided that ~). The する version emphasizes your own choice; the なる version indicates an external decision."
});

curriculum.push({
  day: 662,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(662 / 7),
  title: "N4 Vocabulary Review: Weather",
  intro: "Weather is a universal conversation topic and a staple of JLPT listening sections. Let's solidify your weather vocabulary.",
  type: "review",
  chars: [],
  vocab: [
    ["天気予報", "てんきよほう", "weather forecast"],
    ["台風", "たいふう", "typhoon"],
    ["季節", "きせつ", "season"],
    ["湿気", "しっけ", "humidity"],
    ["涼しい", "すずしい", "cool (temperature)"]
  ],
  grammar: {
    pattern: "～そうだ (appearance)",
    meaning: "it looks like ~ / it seems ~",
    example_jp: "空が暗いから、雨が降りそうです。",
    example_en: "The sky is dark, so it looks like it will rain."
  },
  practice: "Describe today's weather and the forecast for the week using all five vocabulary items and the appearance form of ～そうだ.",
  tip: "Appearance そうだ attaches to the verb stem (降りそうだ = looks like it will rain). Hearsay そうだ attaches to the plain form (降るそうだ = I heard it will rain). Don't mix them up!"
});

curriculum.push({
  day: 663,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(663 / 7),
  title: "N4 Vocabulary Review: Emotions",
  intro: "Expressing feelings accurately is essential for N4 and beyond. Review key emotion vocabulary and how to use it naturally.",
  type: "review",
  chars: [],
  vocab: [
    ["心配", "しんぱい", "worry / concern"],
    ["残念", "ざんねん", "regrettable / disappointing"],
    ["嬉しい", "うれしい", "happy / glad"],
    ["寂しい", "さびしい", "lonely"],
    ["悔しい", "くやしい", "frustrating / vexing"]
  ],
  grammar: {
    pattern: "～がる (third-person emotions)",
    meaning: "to show signs of ~ / to appear to feel ~",
    example_jp: "彼女は試験の結果を心配がっています。",
    example_en: "She is showing signs of worrying about the exam results."
  },
  practice: "Write five sentences describing other people's emotions using ～がる, then rewrite them from a first-person perspective without ～がる.",
  tip: "In Japanese, you cannot directly state another person's feelings with い-adjectives. Use ～がる to describe observed emotions of others: 寂しい (I'm lonely) vs 寂しがっている (he seems lonely)."
});

curriculum.push({
  day: 664,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(664 / 7),
  title: "N4 Vocabulary Review: Travel",
  intro: "Travel vocabulary is tested heavily on the JLPT, especially in listening comprehension. Let's make sure these words are firmly memorized.",
  type: "review",
  chars: [],
  vocab: [
    ["出発", "しゅっぱつ", "departure"],
    ["到着", "とうちゃく", "arrival"],
    ["乗り換える", "のりかえる", "to transfer (trains)"],
    ["予約", "よやく", "reservation"],
    ["観光", "かんこう", "sightseeing"]
  ],
  grammar: {
    pattern: "～で行く / ～に乗る",
    meaning: "to go by (transport) / to ride (transport)",
    example_jp: "空港まで電車で行って、飛行機に乗ります。",
    example_en: "I go to the airport by train and then board the airplane."
  },
  practice: "Plan a trip in Japanese: describe your departure, transfers, arrival, sightseeing plans, and return. Use all five vocabulary words.",
  tip: "The particle で marks the means of transportation (バスで = by bus, 車で = by car). The exception is walking: 歩いて (on foot) uses the て-form of 歩く instead."
});

curriculum.push({
  day: 665,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(665 / 7),
  title: "N4 Vocabulary Review: Food & Dining",
  intro: "Food vocabulary is essential for daily life in Japan and appears frequently in JLPT scenarios. Review these important dining-related words.",
  type: "review",
  chars: [],
  vocab: [
    ["材料", "ざいりょう", "ingredients / materials"],
    ["味", "あじ", "taste / flavor"],
    ["焼く", "やく", "to grill / to bake"],
    ["冷める", "さめる", "to cool down (food)"],
    ["注文", "ちゅうもん", "order (at a restaurant)"]
  ],
  grammar: {
    pattern: "～てある (resultant state)",
    meaning: "something has been done (and the result remains)",
    example_jp: "テーブルの上にお皿が並べてあります。",
    example_en: "Plates have been arranged on the table."
  },
  practice: "Describe a restaurant scene: what has been prepared, what you order, and how the food tastes. Use ～てある and all five vocabulary items.",
  tip: "～ている focuses on an ongoing action or state from the doer's perspective. ～てある focuses on the resulting state from the observer's perspective: ドアが開いている (the door is open) vs ドアが開けてある (someone has opened the door and left it open)."
});

// Days 666–670: Review N4 verbs (transitive/intransitive, te-form, potential form, passive)

curriculum.push({
  day: 666,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(666 / 7),
  title: "N4 Verb Review: Transitive & Intransitive Pairs",
  intro: "Transitive and intransitive verb pairs are one of the trickiest aspects of N4 Japanese. Today we drill the most important pairs.",
  type: "review",
  chars: [],
  vocab: [
    ["開ける", "あける", "to open (transitive)"],
    ["開く", "あく", "to open (intransitive)"],
    ["閉める", "しめる", "to close (transitive)"],
    ["壊す", "こわす", "to break (transitive)"],
    ["壊れる", "こわれる", "to break (intransitive)"]
  ],
  grammar: {
    pattern: "～が（自動詞）/ ～を（他動詞）",
    meaning: "intransitive verbs take が; transitive verbs take を",
    example_jp: "窓が開いた。私が窓を開けた。",
    example_en: "The window opened. I opened the window."
  },
  practice: "Write five pairs of sentences, one transitive and one intransitive, for each pair: 開ける/開く, 閉める/閉まる, 壊す/壊れる, 落とす/落ちる, つける/つく.",
  tip: "Common pattern: if the verb ends in ～える it is often transitive (開ける = to open something), and if it ends in ～く or ～る it is often intransitive (開く = something opens). This rule has many exceptions, but it helps as a starting point."
});

curriculum.push({
  day: 667,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(667 / 7),
  title: "N4 Verb Review: て-form Compound Expressions",
  intro: "The て-form unlocks many grammatical patterns. Today we drill the compound structures that are essential for N4 and beyond.",
  type: "review",
  chars: [],
  vocab: [
    ["届ける", "とどける", "to deliver"],
    ["集める", "あつめる", "to collect / to gather"],
    ["片付ける", "かたづける", "to tidy up"],
    ["調べる", "しらべる", "to investigate / to look up"],
    ["見つける", "みつける", "to find / to discover"]
  ],
  grammar: {
    pattern: "～てみる / ～てしまう",
    meaning: "to try doing ~ / to end up doing ~ (completion or regret)",
    example_jp: "辞書で調べてみたけど、見つからなかった。",
    example_en: "I tried looking it up in the dictionary, but I couldn't find it."
  },
  practice: "Write pairs of sentences for each verb: one using ～てみる (trying something) and one using ～てしまう (completing or regretting an action).",
  tip: "～てしまう has two nuances: (1) complete finishing — 全部食べてしまった (I ate it all up), and (2) regret — 忘れてしまった (I accidentally forgot). In casual speech it contracts to ～ちゃう/～じゃう."
});

curriculum.push({
  day: 668,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(668 / 7),
  title: "N4 Verb Review: Potential Form",
  intro: "The potential form expresses ability — what you can and cannot do. It's tested heavily on the JLPT and crucial for daily conversation.",
  type: "review",
  chars: [],
  vocab: [
    ["泳ぐ", "およぐ", "to swim"],
    ["登る", "のぼる", "to climb"],
    ["運転する", "うんてんする", "to drive"],
    ["信じる", "しんじる", "to believe"],
    ["参加する", "さんかする", "to participate"]
  ],
  grammar: {
    pattern: "～(ら)れる (potential form)",
    meaning: "can do ~ / to be able to do ~",
    example_jp: "日本語の新聞が読めるようになりました。",
    example_en: "I have become able to read Japanese newspapers."
  },
  practice: "List five things you can do now that you couldn't do before, using the potential form and ～ようになる.",
  tip: "Potential form: Group 1 — change the う-row kana to え-row + る (書く→書ける). Group 2 — drop る, add られる (食べる→食べられる). する→できる, 来る→来られる. The particle changes from を to が with potential verbs: 日本語が話せる."
});

curriculum.push({
  day: 669,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(669 / 7),
  title: "N4 Verb Review: Passive Form",
  intro: "The passive voice in Japanese has unique uses beyond English passive. Review both standard and 'suffering' passive constructions.",
  type: "review",
  chars: [],
  vocab: [
    ["褒める", "ほめる", "to praise"],
    ["叱る", "しかる", "to scold"],
    ["招待する", "しょうたいする", "to invite"],
    ["盗む", "ぬすむ", "to steal"],
    ["踏む", "ふむ", "to step on"]
  ],
  grammar: {
    pattern: "～(ら)れる (passive)",
    meaning: "to be done ~ (by someone)",
    example_jp: "電車の中で足を踏まれました。",
    example_en: "I had my foot stepped on in the train."
  },
  practice: "Write five sentences using the passive voice: two standard passives (being praised, being invited) and three 'suffering' passives (annoying things that happened to you).",
  tip: "Japanese has a 'suffering passive' (迷惑の受身) with no English equivalent. 雨に降られた (I was rained on — and it inconvenienced me). The sufferer is the subject, marked by は or が."
});

curriculum.push({
  day: 670,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(670 / 7),
  title: "N4 Verb Review: Causative & Causative-Passive",
  intro: "The causative form expresses making or letting someone do something. Combined with passive, it creates the causative-passive — a key N4 grammar point.",
  type: "review",
  chars: [],
  vocab: [
    ["練習する", "れんしゅうする", "to practice"],
    ["残業する", "ざんぎょうする", "to work overtime"],
    ["我慢する", "がまんする", "to endure / to be patient"],
    ["手伝う", "てつだう", "to help / to assist"],
    ["待つ", "まつ", "to wait"]
  ],
  grammar: {
    pattern: "～(さ)せる / ～(さ)せられる",
    meaning: "to make/let someone do ~ / to be made to do ~",
    example_jp: "上司に残業させられました。",
    example_en: "I was made to work overtime by my boss."
  },
  practice: "Write sentences for each scenario: a parent making a child do something, a teacher letting a student do something, and being made to do something you didn't want to.",
  tip: "Causative: Group 1 — あ-row + せる (書く→書かせる). Group 2 — drop る, add させる (食べる→食べさせる). Causative-passive combines both: 書かせられる (to be made to write). Group 1 contracts: 書かされる."
});

// Days 671–675: Review N4 grammar (conditionals, giving/receiving, comparison, quotation, intention)

curriculum.push({
  day: 671,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(671 / 7),
  title: "N4 Grammar Review: Conditionals (と, ば, たら, なら)",
  intro: "N4 introduces four conditional forms, each with distinct nuances. Mastering their differences is essential before N3.",
  type: "review",
  chars: [],
  vocab: [
    ["場合", "ばあい", "case / situation"],
    ["条件", "じょうけん", "condition / requirement"],
    ["結果", "けっか", "result / outcome"],
    ["変わる", "かわる", "to change"],
    ["決まる", "きまる", "to be decided"]
  ],
  grammar: {
    pattern: "～と / ～ば / ～たら / ～なら",
    meaning: "four conditional forms: if ~ / when ~",
    example_jp: "ボタンを押すと、ドアが開きます。春になれば、桜が咲きます。雨が降ったら、中止です。日本に行くなら、京都がおすすめです。",
    example_en: "If you press the button, the door opens. When spring comes, the cherry blossoms bloom. If it rains, it's cancelled. If you're going to Japan, I recommend Kyoto."
  },
  practice: "Write three sentences for each conditional form, choosing situations that highlight their unique nuances.",
  tip: "Quick guide: と = natural/automatic result; ば = general condition (often hypothetical); たら = specific one-time situation (often past discovery); なら = advice based on a topic. There is overlap, but knowing the core use helps."
});

curriculum.push({
  day: 672,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(672 / 7),
  title: "N4 Grammar Review: Giving & Receiving",
  intro: "The giving and receiving verb system reflects Japan's awareness of social relationships. Review all three helper verb patterns today.",
  type: "review",
  chars: [],
  vocab: [
    ["贈り物", "おくりもの", "gift / present"],
    ["お礼", "おれい", "thanks / gratitude"],
    ["紹介する", "しょうかいする", "to introduce"],
    ["案内する", "あんないする", "to guide / to show around"],
    ["お世話になる", "おせわになる", "to be taken care of"]
  ],
  grammar: {
    pattern: "～てあげる / ～てもらう / ～てくれる",
    meaning: "do ~ for someone / have someone do ~ / someone does ~ for me",
    example_jp: "友達が東京を案内してくれました。",
    example_en: "My friend kindly showed me around Tokyo."
  },
  practice: "Write a short story about a favor exchange between friends, using all three giving/receiving helper verbs at least once each.",
  tip: "The key distinction: あげる = I/we do for others (outward), くれる = others do for me/my group (inward), もらう = I receive the benefit of someone's action. Always consider the direction of the favor."
});

curriculum.push({
  day: 673,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(673 / 7),
  title: "N4 Grammar Review: Comparison",
  intro: "Comparing things is a fundamental skill tested at every JLPT level. Today we review N4 comparison patterns thoroughly.",
  type: "review",
  chars: [],
  vocab: [
    ["複雑", "ふくざつ", "complicated"],
    ["簡単", "かんたん", "simple / easy"],
    ["似ている", "にている", "to be similar"],
    ["違い", "ちがい", "difference"],
    ["同じ", "おなじ", "same"]
  ],
  grammar: {
    pattern: "～より～のほうが / ～の中で一番 / ～ほど～ない",
    meaning: "~ is more ~ than ~ / ~ is the most among ~ / not as ~ as ~",
    example_jp: "漢字はひらがなより複雑です。日本語の中で漢字が一番難しいです。カタカナは漢字ほど難しくないです。",
    example_en: "Kanji is more complicated than hiragana. Kanji is the hardest in Japanese. Katakana is not as difficult as kanji."
  },
  practice: "Compare three items in each of these categories — foods, cities, and hobbies — using all three comparison patterns.",
  tip: "～ほど～ない is the negative comparison (not as ~ as ~). It always uses the negative form: 東京は大阪ほど暑くない (Tokyo is not as hot as Osaka). This pattern is very common on the JLPT."
});

curriculum.push({
  day: 674,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(674 / 7),
  title: "N4 Grammar Review: Quotation & Reported Speech",
  intro: "Quoting and reporting what others say is essential for communication and heavily tested on the JLPT. Review these patterns today.",
  type: "review",
  chars: [],
  vocab: [
    ["意見", "いけん", "opinion"],
    ["説明", "せつめい", "explanation"],
    ["質問", "しつもん", "question"],
    ["答え", "こたえ", "answer"],
    ["噂", "うわさ", "rumor"]
  ],
  grammar: {
    pattern: "～と言う / ～と思う / ～そうだ (hearsay)",
    meaning: "to say that ~ / to think that ~ / I heard that ~",
    example_jp: "先生は試験が簡単だと言いました。私はそう思いません。難しいそうです。",
    example_en: "The teacher said the exam is easy. I don't think so. I heard it's difficult."
  },
  practice: "Write a dialogue where two people discuss a rumor: use ～と言う for direct/indirect quotes, ～と思う for opinions, and ～そうだ for hearsay.",
  tip: "Before と, always use plain form: 行くと思う (not 行きますと思う). The exception is direct quotes — you can quote polite speech: 先生は「明日来てください」と言いました."
});

curriculum.push({
  day: 675,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(675 / 7),
  title: "N4 Grammar Review: Intention & Plans",
  intro: "Expressing what you intend to do and your plans is crucial for N4 communication. Review all the intention patterns today.",
  type: "review",
  chars: [],
  vocab: [
    ["予定", "よてい", "plan / schedule"],
    ["目標", "もくひょう", "goal / target"],
    ["準備", "じゅんび", "preparation"],
    ["将来", "しょうらい", "future"],
    ["決心", "けっしん", "determination / resolution"]
  ],
  grammar: {
    pattern: "～つもりだ / ～（よ）うと思う / ～予定だ",
    meaning: "intend to ~ / am thinking of doing ~ / plan to ~",
    example_jp: "来年日本に留学するつもりです。N3に合格しようと思っています。三月に出発する予定です。",
    example_en: "I intend to study abroad in Japan next year. I'm thinking of passing N3. I plan to depart in March."
  },
  practice: "Write about your goals for the next year using all three intention patterns. Describe what you intend to do, what you're thinking of doing, and what your concrete plans are.",
  tip: "～つもりだ expresses a firm intention. ～（よ）うと思う is softer — you're considering it. ～予定だ states a scheduled plan. Choose based on how certain you are: つもり > 予定 > ～ようと思う in terms of commitment."
});

// Days 676–680: Review N4 kanji reading practice

curriculum.push({
  day: 676,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(676 / 7),
  title: "N4 Kanji Review: People & Relationships",
  intro: "Kanji related to people and social relationships appear constantly on the JLPT. Review their readings and common compounds today.",
  type: "review",
  chars: [],
  vocab: [
    ["家族", "かぞく", "family"],
    ["親切", "しんせつ", "kind / kindness"],
    ["兄弟", "きょうだい", "siblings"],
    ["夫婦", "ふうふ", "married couple"],
    ["知り合い", "しりあい", "acquaintance"]
  ],
  grammar: {
    pattern: "～という (naming / defining)",
    meaning: "called ~ / named ~",
    example_jp: "田中さんという人を知っていますか。",
    example_en: "Do you know a person called Tanaka?"
  },
  practice: "Write sentences introducing five people using ～という, and describe their relationship to you using the family and relationship vocabulary.",
  tip: "Many N4 kanji have both on'yomi and kun'yomi readings. For compound words (jukugo), usually on'yomi: 家族 (かぞく). For standalone or with okurigana, usually kun'yomi: 家 (いえ)."
});

curriculum.push({
  day: 677,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(677 / 7),
  title: "N4 Kanji Review: Nature & Seasons",
  intro: "Nature and season kanji are common in JLPT reading passages and listening scenarios. Review the key characters and their compounds.",
  type: "review",
  chars: [],
  vocab: [
    ["自然", "しぜん", "nature"],
    ["地震", "じしん", "earthquake"],
    ["海岸", "かいがん", "coast / seashore"],
    ["森林", "しんりん", "forest"],
    ["景色", "けしき", "scenery / view"]
  ],
  grammar: {
    pattern: "～ようだ / ～みたいだ",
    meaning: "it seems like ~ / it appears that ~ (based on observation)",
    example_jp: "この森林はとても古いようです。",
    example_en: "This forest seems to be very old."
  },
  practice: "Describe a natural landscape using all five vocabulary words, incorporating ～ようだ or ～みたいだ to express your impressions.",
  tip: "～ようだ is more formal/written; ～みたいだ is more casual/spoken. Both express judgment based on what you observe. Compare with ～らしい, which is based on what you heard or read."
});

curriculum.push({
  day: 678,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(678 / 7),
  title: "N4 Kanji Review: Time & Duration",
  intro: "Time expressions and duration kanji are fundamental to scheduling and narration. Review these high-frequency characters and compounds.",
  type: "review",
  chars: [],
  vocab: [
    ["期間", "きかん", "period / duration"],
    ["最近", "さいきん", "recently"],
    ["以上", "いじょう", "more than / above"],
    ["以下", "いか", "less than / below"],
    ["未来", "みらい", "future"]
  ],
  grammar: {
    pattern: "～までに",
    meaning: "by (a deadline)",
    example_jp: "来週の金曜日までにレポートを出してください。",
    example_en: "Please submit the report by next Friday."
  },
  practice: "Create five sentences with deadlines using ～までに, incorporating time and duration kanji from today's vocabulary.",
  tip: "まで means 'until' (duration), while までに means 'by' (deadline). Compare: 5時まで働く (I work until 5) vs 5時までに届ける (I'll deliver it by 5). This distinction is a common JLPT trap."
});

curriculum.push({
  day: 679,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(679 / 7),
  title: "N4 Kanji Review: Actions & Movement",
  intro: "Action and movement kanji are among the most frequently used in everyday Japanese. Ensure you know both readings and key compounds.",
  type: "review",
  chars: [],
  vocab: [
    ["運動", "うんどう", "exercise / movement"],
    ["動く", "うごく", "to move"],
    ["届く", "とどく", "to arrive / to reach"],
    ["乗り物", "のりもの", "vehicle / ride"],
    ["引っ越す", "ひっこす", "to move (residence)"]
  ],
  grammar: {
    pattern: "～ようにする",
    meaning: "to make an effort to ~ / to make sure to ~",
    example_jp: "毎日運動するようにしています。",
    example_en: "I make sure to exercise every day."
  },
  practice: "Write five good habits you try to maintain using ～ようにしている, incorporating action and movement vocabulary.",
  tip: "～ようにする = I make an effort to do ~. ～ようになる = I reach the point where I can do ~. The する/なる contrast mirrors ことにする/ことになる: one is by choice, the other is a natural development."
});

curriculum.push({
  day: 680,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(680 / 7),
  title: "N4 Kanji Review: Abstract Concepts",
  intro: "Abstract concept kanji are harder to memorize because they lack concrete imagery. Today we reinforce these important characters and their compounds.",
  type: "review",
  chars: [],
  vocab: [
    ["意味", "いみ", "meaning"],
    ["理由", "りゆう", "reason"],
    ["関係", "かんけい", "relationship / connection"],
    ["反対", "はんたい", "opposite / opposition"],
    ["特別", "とくべつ", "special"]
  ],
  grammar: {
    pattern: "～ために (purpose / cause)",
    meaning: "in order to ~ / for the sake of ~ / because of ~",
    example_jp: "試験に合格するために、毎日勉強しています。",
    example_en: "I study every day in order to pass the exam."
  },
  practice: "Write five goal statements using ～ために, explaining why you do certain activities. Then write two sentences where ～ために expresses a cause rather than a purpose.",
  tip: "～ために has two uses: (1) purpose — dictionary form + ために (合格するために = in order to pass), and (2) cause — た-form + ために (台風が来たために = because the typhoon came). Context makes the difference."
});

// Days 681–685: Review N4 listening comprehension vocabulary

curriculum.push({
  day: 681,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(681 / 7),
  title: "N4 Listening Review: Announcements & Instructions",
  intro: "JLPT listening sections often feature announcements and instructions. Review the vocabulary you need to understand these common scenarios.",
  type: "review",
  chars: [],
  vocab: [
    ["放送", "ほうそう", "broadcast / announcement"],
    ["案内", "あんない", "guidance / information"],
    ["集合", "しゅうごう", "gathering / assembly"],
    ["注意", "ちゅうい", "caution / attention"],
    ["確認", "かくにん", "confirmation / checking"]
  ],
  grammar: {
    pattern: "～ことになっている",
    meaning: "it is the rule that ~ / it has been decided that ~",
    example_jp: "三時に駅前に集合することになっています。",
    example_en: "It has been decided that we will meet in front of the station at three."
  },
  practice: "Write five announcement-style sentences for different situations (train station, school, office, store, event) using today's vocabulary and grammar.",
  tip: "In JLPT listening, announcements often use polite/formal language with ～てください, ～ことになっています, and ～ようお願いいたします. Listen for these patterns to quickly identify the type of information being conveyed."
});

curriculum.push({
  day: 682,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(682 / 7),
  title: "N4 Listening Review: Phone Conversations",
  intro: "Phone conversations are a staple of JLPT listening tests. Review the vocabulary and expressions used in typical phone interactions.",
  type: "review",
  chars: [],
  vocab: [
    ["連絡", "れんらく", "contact / communication"],
    ["伝言", "でんごん", "message"],
    ["折り返す", "おりかえす", "to call back"],
    ["留守", "るす", "absence / not at home"],
    ["都合", "つごう", "convenience / circumstances"]
  ],
  grammar: {
    pattern: "～ていただけませんか",
    meaning: "could you please ~ (polite request)",
    example_jp: "田中さんに折り返し電話していただけませんか。",
    example_en: "Could you please have Tanaka call me back?"
  },
  practice: "Write two complete phone conversation scripts: one leaving a message and one scheduling an appointment. Use all five vocabulary items.",
  tip: "Phone Japanese has set phrases: もしもし (hello), ～と申しますが (my name is ~, humble), 少々お待ちください (please wait a moment), 失礼します (goodbye, polite). Memorize these as chunks."
});

curriculum.push({
  day: 683,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(683 / 7),
  title: "N4 Listening Review: Daily Conversations",
  intro: "Everyday conversations between friends, colleagues, and family members appear frequently in JLPT listening. Review the vocabulary that drives these dialogues.",
  type: "review",
  chars: [],
  vocab: [
    ["相談", "そうだん", "consultation / advice"],
    ["約束", "やくそく", "promise / appointment"],
    ["断る", "ことわる", "to refuse / to decline"],
    ["誘う", "さそう", "to invite / to ask out"],
    ["賛成", "さんせい", "agreement / approval"]
  ],
  grammar: {
    pattern: "～かどうか",
    meaning: "whether or not ~",
    example_jp: "明日のパーティーに行くかどうか、まだ決めていません。",
    example_en: "I haven't decided yet whether or not I'll go to tomorrow's party."
  },
  practice: "Write a conversation between two friends making weekend plans, including inviting, declining, consulting, and reaching agreement. Use ～かどうか at least twice.",
  tip: "In JLPT listening, pay attention to the final sentence — it often contains the speaker's real intention. Japanese speakers may hedge before stating their actual opinion or decision."
});

curriculum.push({
  day: 684,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(684 / 7),
  title: "N4 Listening Review: Shopping & Services",
  intro: "Shopping and service encounters are common JLPT listening scenarios. Review the vocabulary you need to understand store conversations and transactions.",
  type: "review",
  chars: [],
  vocab: [
    ["値段", "ねだん", "price"],
    ["割引", "わりびき", "discount"],
    ["届ける", "とどける", "to deliver"],
    ["交換", "こうかん", "exchange / replacement"],
    ["領収書", "りょうしゅうしょ", "receipt"]
  ],
  grammar: {
    pattern: "～ことにする / ～ことにした",
    meaning: "to decide to do ~ / decided to do ~",
    example_jp: "やっぱりこちらの商品を買うことにします。",
    example_en: "I'll go ahead and decide to buy this product after all."
  },
  practice: "Write a shopping dialogue that includes asking about prices, requesting a discount, deciding to buy, and asking for a receipt.",
  tip: "Shopping vocabulary often appears with counters: 一つ, 二枚, 三本. Review common counters alongside shopping words. Also listen for やっぱり (after all / as expected) — it signals a decision or realization."
});

curriculum.push({
  day: 685,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(685 / 7),
  title: "N4 Listening Review: Directions & Locations",
  intro: "Understanding directions and location descriptions is critical for JLPT listening. Review the key vocabulary for navigating spaces and following directions.",
  type: "review",
  chars: [],
  vocab: [
    ["交差点", "こうさてん", "intersection"],
    ["信号", "しんごう", "traffic light"],
    ["角", "かど", "corner"],
    ["向かい", "むかい", "opposite side / across from"],
    ["突き当たり", "つきあたり", "end of the road / dead end"]
  ],
  grammar: {
    pattern: "～を渡る / ～を曲がる / ～を過ぎる",
    meaning: "to cross ~ / to turn at ~ / to pass ~",
    example_jp: "信号を渡って、次の角を右に曲がると、左側にあります。",
    example_en: "Cross at the traffic light, turn right at the next corner, and it will be on your left side."
  },
  practice: "Draw a simple map and write detailed directions from a station to three different destinations, using all five vocabulary items and the grammar patterns.",
  tip: "Direction words to review: 右 (みぎ, right), 左 (ひだり, left), まっすぐ (straight), 手前 (てまえ, just before), 先 (さき, ahead/beyond). In JLPT listening, directions often use ～たら to mark turning points: 信号があったら右に曲がってください."
});

// Days 686–690: Mixed N4 review and N3 preview

curriculum.push({
  day: 686,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(686 / 7),
  title: "N4 Mixed Review: Comprehensive Vocabulary Drill",
  intro: "Time for mixed drills combining vocabulary from all N4 categories. This broad review ensures no gaps remain before N3.",
  type: "review",
  chars: [],
  vocab: [
    ["経済", "けいざい", "economy"],
    ["社会", "しゃかい", "society"],
    ["文化", "ぶんか", "culture"],
    ["国際", "こくさい", "international"],
    ["政治", "せいじ", "politics"]
  ],
  grammar: {
    pattern: "～について",
    meaning: "about ~ / concerning ~",
    example_jp: "日本の文化について調べています。",
    example_en: "I am researching about Japanese culture."
  },
  practice: "Choose three topics from today's vocabulary and write a short paragraph about each using ～について and at least three other N4 grammar patterns per paragraph.",
  tip: "～について is indispensable for discussing topics. At N3 you will also encounter ～に関して (more formal) and ～に対して (toward / against). Master ～について now as the foundation."
});

curriculum.push({
  day: 687,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(687 / 7),
  title: "N4 Mixed Review: Grammar Pattern Integration",
  intro: "Today we combine multiple grammar patterns in single sentences — a skill that N3 reading passages demand. Practice building complex, natural-sounding Japanese.",
  type: "review",
  chars: [],
  vocab: [
    ["成績", "せいせき", "grades / results"],
    ["努力", "どりょく", "effort"],
    ["達成", "たっせい", "achievement"],
    ["自信", "じしん", "confidence"],
    ["実力", "じつりょく", "real ability"]
  ],
  grammar: {
    pattern: "～ように～ために (combined purpose clauses)",
    meaning: "using multiple clause types in complex sentences",
    example_jp: "N3に合格できるように、毎日努力するために時間を作っています。",
    example_en: "I am making time to put in daily effort so that I can pass N3."
  },
  practice: "Write five complex sentences, each combining at least two different N4 grammar patterns (for example, ～ても + ～つもりだ, or ～たら + ～てもらう).",
  tip: "N3 reading passages often pack multiple grammar patterns into a single sentence. Practice parsing long sentences by identifying each clause boundary — look for て-forms, と, から, ので, and comma breaks."
});

curriculum.push({
  day: 688,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(688 / 7),
  title: "N4→N3 Bridge: Formal Register & Keigo Preview",
  intro: "N3 demands comfort with both formal and informal Japanese. Today we bridge N4 polite forms into the honorific registers you will encounter.",
  type: "review",
  chars: [],
  vocab: [
    ["敬語", "けいご", "honorific language"],
    ["丁寧語", "ていねいご", "polite language"],
    ["尊敬語", "そんけいご", "respectful language"],
    ["謙譲語", "けんじょうご", "humble language"],
    ["目上", "めうえ", "superior / senior"]
  ],
  grammar: {
    pattern: "お～になる (respectful) / お～する (humble)",
    meaning: "honorific verb forms for respectful and humble speech",
    example_jp: "先生がお話しになりました。私がお持ちします。",
    example_en: "The teacher spoke (respectful). I will carry it (humble)."
  },
  practice: "Rewrite five casual sentences into respectful (尊敬語) and humble (謙譲語) versions. Then identify which register you would use in each real-life situation.",
  tip: "N3 keigo essentials: respectful お～になる elevates others' actions; humble お～する lowers your own. Memorize the irregular pairs: いらっしゃる/おる, おっしゃる/申す, ご覧になる/拝見する."
});

curriculum.push({
  day: 689,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(689 / 7),
  title: "N4→N3 Bridge: Complex Sentences & Reading Preview",
  intro: "N3 reading passages are significantly longer and more complex than N4. Today we develop strategies for tackling extended Japanese texts.",
  type: "review",
  chars: [],
  vocab: [
    ["段落", "だんらく", "paragraph"],
    ["筆者", "ひっしゃ", "author / writer"],
    ["主張", "しゅちょう", "claim / assertion"],
    ["要点", "ようてん", "main point"],
    ["結論", "けつろん", "conclusion"]
  ],
  grammar: {
    pattern: "～のに (despite) / ～ても (even if)",
    meaning: "despite ~ / even if ~",
    example_jp: "たくさん勉強したのに、試験に落ちてしまった。",
    example_en: "Despite studying a lot, I failed the exam."
  },
  practice: "Read a short Japanese paragraph and identify the main claim, key points, and conclusion. Then write your own short essay with clear paragraph structure.",
  tip: "N3 reading strategy: first read the questions, then scan the passage for discourse markers like しかし (however), つまり (in other words), そのため (therefore), and 一方 (on the other hand). These signal the argument structure."
});

curriculum.push({
  day: 690,
  phaseNum: 15,
  phaseName: "N4 Review",
  week: Math.ceil(690 / 7),
  title: "N4→N3 Bridge: Final Review & Ready for N3",
  intro: "Congratulations on completing the N4 review phase! Today we consolidate everything and set the stage for your N3 journey.",
  type: "review",
  chars: [],
  vocab: [
    ["挑戦", "ちょうせん", "challenge"],
    ["上達", "じょうたつ", "improvement / progress"],
    ["合格", "ごうかく", "passing (an exam)"],
    ["応援", "おうえん", "support / cheering"],
    ["復習", "ふくしゅう", "review / revision"]
  ],
  grammar: {
    pattern: "～ことができる (ability summary)",
    meaning: "to be able to do ~",
    example_jp: "N4の文法が全部分かるようになったので、N3に挑戦することができます。",
    example_en: "Since I have come to understand all N4 grammar, I can take on the N3 challenge."
  },
  practice: "Write a self-reflection essay in Japanese: describe what you have learned in this N4 review phase, what areas still need work, and your goals for N3. Use at least ten different grammar patterns.",
  tip: "You have built a strong N4 foundation. N3 will introduce roughly 180 new grammar points, 350 new kanji, and 3700 vocabulary items. The key is consistent daily study — just as you have been doing. がんばって！"
});