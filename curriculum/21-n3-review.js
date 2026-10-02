"use strict";


// ═══ PHASE 21: N3 REVIEW (Days 961-990) ═══

// Days 961-965: Review N3 Vocabulary clusters

curriculum.push({
  day: 961,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(961 / 7),
  title: "N3 Vocabulary Review: Daily Life",
  intro: "Revisit essential N3 vocabulary related to daily life routines, household activities, and everyday interactions.",
  type: "review",
  vocab: [
    ["家事", "かじ", "housework / household chores"],
    ["炊事", "すいじ", "cooking / kitchen work"],
    ["洗濯", "せんたく", "laundry / washing clothes"],
    ["掃除", "そうじ", "cleaning / sweeping"],
    ["買い物", "かいもの", "shopping / grocery run"],
    ["近所", "きんじょ", "neighborhood / vicinity"],
    ["挨拶", "あいさつ", "greeting / salutation"]
  ],
  chars: [],
  grammar: {},
  practice: "Write five sentences describing your daily morning routine using the vocab above.",
  tip: "N3 daily-life vocab often appears in listening tasks set in homes or convenience stores. Visualize the scene as you study."
});

curriculum.push({
  day: 962,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(962 / 7),
  title: "N3 Vocabulary Review: Emotions & Feelings",
  intro: "Consolidate N3 vocabulary describing emotions, mental states, and interpersonal feelings.",
  type: "review",
  vocab: [
    ["感動", "かんどう", "being moved / deeply touched"],
    ["悔しい", "くやしい", "frustrated / mortified / vexing"],
    ["恥ずかしい", "はずかしい", "embarrassing / ashamed"],
    ["寂しい", "さびしい", "lonely / lonesome"],
    ["羨ましい", "うらやましい", "envious / jealous"],
    ["懐かしい", "なつかしい", "nostalgic / fondly remembered"],
    ["頼もしい", "たのもしい", "reliable / reassuring / dependable"]
  ],
  chars: [],
  grammar: {},
  practice: "Describe a memory that made you feel 感動 or 懐かしい using at least three vocab items.",
  tip: "Adjective-based emotions are tested in reading comprehension — pay attention to the context that triggers each feeling."
});

curriculum.push({
  day: 963,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(963 / 7),
  title: "N3 Vocabulary Review: Work & Career",
  intro: "Review N3 work-related vocabulary covering office life, career development, and professional relationships.",
  type: "review",
  vocab: [
    ["就職", "しゅうしょく", "getting a job / finding employment"],
    ["退職", "たいしょく", "retirement / resignation"],
    ["昇進", "しょうしん", "promotion / advancement in rank"],
    ["残業", "ざんぎょう", "overtime work"],
    ["給料", "きゅうりょう", "salary / wages / pay"],
    ["上司", "じょうし", "superior / boss / supervisor"],
    ["部下", "ぶか", "subordinate / junior staff"],
    ["会議", "かいぎ", "meeting / conference"]
  ],
  chars: [],
  grammar: {},
  practice: "Write a short dialogue between a boss (上司) and a subordinate (部下) about overtime (残業).",
  tip: "Work-scene dialogues appear heavily in N3 listening. Memorize relationships: 上司↔部下, 先輩↔後輩."
});

curriculum.push({
  day: 964,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(964 / 7),
  title: "N3 Vocabulary Review: Society & Community",
  intro: "Review N3 vocabulary pertaining to social structures, community events, and public life.",
  type: "review",
  vocab: [
    ["地域", "ちいき", "region / local area / community"],
    ["住民", "じゅうみん", "residents / inhabitants"],
    ["行事", "ぎょうじ", "event / function / annual occasion"],
    ["祭り", "まつり", "festival / celebration"],
    ["募集", "ぼしゅう", "recruitment / invitation / call for applicants"],
    ["参加", "さんか", "participation / joining"],
    ["協力", "きょうりょく", "cooperation / collaboration"],
    ["貢献", "こうけん", "contribution / service to"]
  ],
  chars: [],
  grammar: {},
  practice: "Write a community notice (お知らせ) inviting residents to a local festival using vocab from today.",
  tip: "Community-theme texts appear in N3 reading section 2. Look for keywords like 募集 or 参加 to quickly identify the topic."
});

curriculum.push({
  day: 965,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(965 / 7),
  title: "N3 Vocabulary Review: Nature & Environment",
  intro: "Consolidate N3 nature and environment vocabulary, including weather, geography, and ecological concepts.",
  type: "review",
  vocab: [
    ["台風", "たいふう", "typhoon"],
    ["地震", "じしん", "earthquake"],
    ["洪水", "こうずい", "flood"],
    ["干ばつ", "かんばつ", "drought"],
    ["森林", "しんりん", "forest / woodland"],
    ["河川", "かせん", "rivers / waterways"],
    ["環境", "かんきょう", "environment / surroundings"],
    ["保護", "ほご", "protection / conservation"]
  ],
  chars: [],
  grammar: {},
  practice: "Write three sentences about how natural disasters affect the environment, using at least five vocab items.",
  tip: "Nature disaster vocabulary is common in N3 news-style reading passages. Match disaster types with their kanji carefully."
});

// Days 966-970: Review N3 Verbs

curriculum.push({
  day: 966,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(966 / 7),
  title: "N3 Verbs Review: Transitive vs Intransitive",
  intro: "Review the distinction between transitive (他動詞) and intransitive (自動詞) verbs — a critical N3 grammar point.",
  type: "review",
  vocab: [
    ["開ける", "あける", "to open (something) — transitive"],
    ["開く", "あく", "to open (by itself) — intransitive"],
    ["閉める", "しめる", "to close (something) — transitive"],
    ["閉まる", "しまる", "to close (by itself) — intransitive"],
    ["起こす", "おこす", "to wake (someone) up — transitive"],
    ["起きる", "おきる", "to wake up / get up — intransitive"],
    ["壊す", "こわす", "to break / destroy — transitive"],
    ["壊れる", "こわれる", "to break / get broken — intransitive"]
  ],
  chars: [],
  grammar: {
    pattern: "〜ている (transitive vs intransitive)",
    meaning: "Transitive + ている = ongoing action; Intransitive + ている = resultant state",
    example_jp: "ドアを開けている。(I am opening the door) vs ドアが開いている。(The door is open.)",
    example_en: "Transitive describes the actor's action; intransitive describes the resulting state."
  },
  practice: "Create six sentence pairs contrasting transitive and intransitive forms for each verb pair above.",
  tip: "When choosing between transitive/intransitive on the test, check whether the subject is acting on an object (transitive) or experiencing a change (intransitive)."
});

curriculum.push({
  day: 967,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(967 / 7),
  title: "N3 Verbs Review: Compound Verbs",
  intro: "Revisit N3-level compound verbs formed by combining two verb stems, expressing nuanced actions.",
  type: "review",
  vocab: [
    ["書き直す", "かきなおす", "to rewrite / to write over again"],
    ["持ち込む", "もちこむ", "to bring in / to carry inside"],
    ["話し合う", "はなしあう", "to discuss / to talk over with each other"],
    ["聞き取る", "ききとる", "to catch / to make out (speech)"],
    ["飛び出す", "とびだす", "to jump out / to dash out"],
    ["打ち明ける", "うちあける", "to confide / to open up about"],
    ["受け入れる", "うけいれる", "to accept / to take in / to receive"]
  ],
  chars: [],
  grammar: {
    pattern: "Verb stem + 合う",
    meaning: "Mutual or reciprocal action between two or more parties",
    example_jp: "二人は夜遅くまで話し合った。",
    example_en: "The two discussed until late at night."
  },
  practice: "Write sentences using each compound verb above in a realistic context.",
  tip: "Break compound verbs into their two component verbs to understand the meaning. The second verb usually carries the directional or aspectual nuance."
});

curriculum.push({
  day: 968,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(968 / 7),
  title: "N3 Verbs Review: Te-form & Aspect",
  intro: "Review the te-form and its use with auxiliary verbs to express ongoing, resultant, or preparatory states.",
  type: "review",
  vocab: [
    ["続ける", "つづける", "to continue doing — te + 続ける"],
    ["しまう", "しまう", "to end up doing (often regrettable) — te + しまう"],
    ["おく", "おく", "to do in advance / to leave as is — te + おく"],
    ["みる", "みる", "to try doing — te + みる"],
    ["くる", "くる", "to come to do / to have been doing — te + くる"],
    ["いく", "いく", "to continue doing going forward — te + いく"],
    ["あげる", "あげる", "to do for someone (giving upward) — te + あげる"],
    ["もらう", "もらう", "to have someone do for you — te + もらう"]
  ],
  chars: [],
  grammar: {
    pattern: "〜てしまう",
    meaning: "To end up doing / to do completely (often with regret or emphasis)",
    example_jp: "財布を忘れてしまった。",
    example_en: "I ended up forgetting my wallet."
  },
  practice: "Write three sentences each for てしまう, ておく, and てみる using verbs of your choice.",
  tip: "In casual speech, てしまう contracts to ちゃう and でしまう to じゃう. Recognize both forms in listening tests."
});

curriculum.push({
  day: 969,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(969 / 7),
  title: "N3 Verbs Review: Potential & Passive Forms",
  intro: "Revisit potential form (can do) and passive form (is done to / gets done) — both heavily tested at N3.",
  type: "review",
  vocab: [
    ["話せる", "はなせる", "can speak — potential of 話す"],
    ["見られる", "みられる", "can see / is seen — potential/passive of 見る"],
    ["食べられる", "たべられる", "can eat / is eaten — potential/passive of 食べる"],
    ["呼ばれる", "よばれる", "to be called / to be invited — passive of 呼ぶ"],
    ["褒められる", "ほめられる", "to be praised — passive of 褒める"],
    ["叱られる", "しかられる", "to be scolded — passive of 叱る"],
    ["壊される", "こわされる", "to be broken (by someone) — passive of 壊す"]
  ],
  chars: [],
  grammar: {
    pattern: "迷惑の受け身 (adversarial passive)",
    meaning: "Passive form expressing inconvenience caused to the subject by another's action",
    example_jp: "雨に降られて、ずぶ濡れになった。",
    example_en: "It rained on me (to my misfortune) and I got soaked."
  },
  practice: "Transform five sentences from active to passive voice and identify which are adversarial passives.",
  tip: "The adversarial passive always implies the subject suffered. If the subject benefits, use てもらう instead."
});

curriculum.push({
  day: 970,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(970 / 7),
  title: "N3 Verbs Review: Causative & Causative-Passive",
  intro: "Review causative (make/let someone do) and causative-passive (be made to do) forms.",
  type: "review",
  vocab: [
    ["食べさせる", "たべさせる", "to make/let (someone) eat — causative of 食べる"],
    ["行かせる", "いかせる", "to make/let (someone) go — causative of 行く"],
    ["待たせる", "またせる", "to make (someone) wait — causative of 待つ"],
    ["食べさせられる", "たべさせられる", "to be made to eat — causative-passive"],
    ["走らせられる", "はしらせられる", "to be made to run — causative-passive"],
    ["泣かせる", "なかせる", "to make (someone) cry — causative of 泣く"],
    ["笑わせる", "わらわせる", "to make (someone) laugh — causative of 笑う"]
  ],
  chars: [],
  grammar: {
    pattern: "〜させていただく",
    meaning: "Humble expression: to humbly do something (polite causative + てもらう logic)",
    example_jp: "本日は早退させていただきます。",
    example_en: "I will humbly take my leave early today."
  },
  practice: "Write sentences showing the difference between 行かせる (make go), 行かせてもらう (get permission to go), and 行かせていただく (humbly go with permission).",
  tip: "させていただく is extremely common in formal Japanese speech and writing. Recognize it in N3 listening and reading passages."
});

// Days 971-975: Review N3 Grammar Patterns

curriculum.push({
  day: 971,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(971 / 7),
  title: "N3 Grammar Review: Conditionals",
  intro: "Review the four main conditional forms — と, ば, たら, なら — and their distinct nuances.",
  type: "review",
  vocab: [
    ["場合", "ばあい", "case / situation / circumstances"],
    ["条件", "じょうけん", "condition / requirement / terms"],
    ["仮定", "かてい", "assumption / hypothesis / supposition"],
    ["結果", "けっか", "result / outcome / consequence"],
    ["原因", "げんいん", "cause / reason / origin"],
    ["影響", "えいきょう", "influence / effect / impact"]
  ],
  chars: [],
  grammar: {
    pattern: "〜ば〜ほど",
    meaning: "The more ... the more ... (proportional increase)",
    example_jp: "練習すればするほど、上手になる。",
    example_en: "The more you practice, the better you get."
  },
  practice: "Write one sentence each using と, ば, たら, and なら conditionals with different nuances.",
  tip: "と = automatic/natural result; ば = general condition; たら = after completion / hypothetical; なら = given that (responds to context)."
});

curriculum.push({
  day: 972,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(972 / 7),
  title: "N3 Grammar Review: Cause & Reason",
  intro: "Review expressions of cause and reason: から, ので, ため, せいで, おかげで, and related patterns.",
  type: "review",
  vocab: [
    ["理由", "りゆう", "reason / cause / grounds"],
    ["根拠", "こんきょ", "basis / grounds / foundation"],
    ["おかげ", "おかげ", "thanks to / owing to (positive)"],
    ["せい", "せい", "blame / fault / due to (negative)"],
    ["ために", "ために", "in order to / for the sake of / because of"],
    ["につき", "につき", "due to / because of / per (formal)"]
  ],
  chars: [],
  grammar: {
    pattern: "〜おかげで vs 〜せいで",
    meaning: "おかげで = thanks to (positive outcome); せいで = because of (negative outcome / blame)",
    example_jp: "先生のおかげで合格できた。試験前に遊んだせいで落ちた。",
    example_en: "Thanks to my teacher I passed. I failed because I played before the exam."
  },
  practice: "Write three sentences with おかげで and three with せいで, showing clearly positive vs negative outcomes.",
  tip: "On N3 tests, おかげで and せいで are common trap choices. The emotional tone of the outcome determines which is correct."
});

curriculum.push({
  day: 973,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(973 / 7),
  title: "N3 Grammar Review: Contrast & Concession",
  intro: "Review patterns that express contrast (but, however) and concession (even though, despite): が, けれど, のに, ても, くせに.",
  type: "review",
  vocab: [
    ["一方", "いっぽう", "on the other hand / at the same time"],
    ["反面", "はんめん", "on the other side / conversely"],
    ["にもかかわらず", "にもかかわらず", "despite / in spite of / nevertheless"],
    ["それでも", "それでも", "even so / yet / still"],
    ["ところが", "ところが", "however / but (unexpected result)"],
    ["逆に", "ぎゃくに", "on the contrary / conversely / inversely"]
  ],
  chars: [],
  grammar: {
    pattern: "〜のに (concessive)",
    meaning: "Even though / despite the fact that — expresses frustration or surprise at an unexpected result",
    example_jp: "あんなに勉強したのに、試験に落ちた。",
    example_en: "Even though I studied that much, I failed the exam."
  },
  practice: "Write sentences contrasting two things using のに, にもかかわらず, and ところが.",
  tip: "のに expressing concession carries an emotional charge (frustration, disappointment). Without emotion, use のに for purpose (〜するのに = in order to do)."
});

curriculum.push({
  day: 974,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(974 / 7),
  title: "N3 Grammar Review: Degree & Extent",
  intro: "Review patterns expressing degree, limit, and scope: ほど, くらい, だけ, しか〜ない, ばかり.",
  type: "review",
  vocab: [
    ["程度", "ていど", "degree / level / extent"],
    ["限度", "げんど", "limit / maximum / boundary"],
    ["範囲", "はんい", "range / scope / extent"],
    ["ほぼ", "ほぼ", "almost / nearly / roughly"],
    ["せめて", "せめて", "at least / at the very least"],
    ["たった", "たった", "only / just / merely (emphatic)"]
  ],
  chars: [],
  grammar: {
    pattern: "〜しか〜ない",
    meaning: "Nothing but / only ... (implies insufficiency or limitation)",
    example_jp: "財布に100円しかない。",
    example_en: "I only have 100 yen in my wallet (and that's not enough)."
  },
  practice: "Write three sentences with しか〜ない and three with だけ, noticing how the nuance (limitation vs sufficiency) differs.",
  tip: "しか always takes a negative predicate. だけ is neutral. Swapping them changes the emotional tone significantly."
});

curriculum.push({
  day: 975,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(975 / 7),
  title: "N3 Grammar Review: Quotation & Hearsay",
  intro: "Review patterns for reporting speech, quoting thoughts, and relaying hearsay: と言う, そうだ, らしい, ようだ, とのことだ.",
  type: "review",
  vocab: [
    ["伝言", "でんごん", "message / verbal communication"],
    ["報告", "ほうこく", "report / account / notification"],
    ["噂", "うわさ", "rumor / gossip / hearsay"],
    ["予報", "よほう", "forecast / prediction"],
    ["情報", "じょうほう", "information / news / intelligence"],
    ["伝える", "つたえる", "to convey / to report / to pass on"]
  ],
  chars: [],
  grammar: {
    pattern: "〜らしい vs 〜ようだ vs 〜そうだ",
    meaning: "らしい = seems (based on hearsay/indirect evidence); ようだ = seems (based on direct observation); そうだ = looks like (appearance) OR I heard that (hearsay)",
    example_jp: "雨が降るらしい。(I heard it will rain.) 雨が降るようだ。(It looks like it'll rain.) 雨が降りそうだ。(It looks like rain.)",
    example_en: "Each form indicates a different source of inference."
  },
  practice: "Write news-style sentences using らしい, ようだ, and そうだ to report on a current event.",
  tip: "On the test, the source of information is the key: hearsay → らしい / とのことだ; direct evidence → ようだ / みたいだ; appearance → そうだ (stem form)."
});

// Days 976-980: Review N3 Kanji

curriculum.push({
  day: 976,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(976 / 7),
  title: "N3 Kanji Review: People & Society",
  intro: "Review N3 kanji related to people, social roles, and community.",
  type: "review",
  vocab: [
    ["市民", "しみん", "citizen / city resident"],
    ["国民", "こくみん", "nation's people / nationals / citizens"],
    ["指導者", "しどうしゃ", "leader / guide / instructor"],
    ["代表", "だいひょう", "representative / delegation / symbol"],
    ["候補", "こうほ", "candidate / nominee"],
    ["世代", "せだい", "generation / era / age group"]
  ],
  chars: [
    ["民", "みん/たみ"],
    ["代", "だい/か"],
    ["指", "し/ゆび"],
    ["導", "どう/みちび"],
    ["補", "ほ/おぎな"],
    ["世", "せ/よ"]
  ],
  grammar: {},
  practice: "Write the on-yomi and kun-yomi for each kanji above and create a compound word for each reading.",
  tip: "民 appears in many social kanji compounds: 市民, 国民, 住民, 民族. Learning it well unlocks multiple words at once."
});

curriculum.push({
  day: 977,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(977 / 7),
  title: "N3 Kanji Review: Time & Change",
  intro: "Review N3 kanji dealing with time, sequence, change, and continuity.",
  type: "review",
  vocab: [
    ["変化", "へんか", "change / variation / transition"],
    ["経過", "けいか", "passage (of time) / elapsed / progress"],
    ["現在", "げんざい", "present / current / now"],
    ["将来", "しょうらい", "future / prospects"],
    ["以前", "いぜん", "previously / formerly / before"],
    ["最近", "さいきん", "recently / lately / these days"]
  ],
  chars: [
    ["変", "へん/か"],
    ["経", "けい/へ"],
    ["現", "げん/あらわ"],
    ["将", "しょう"],
    ["以", "い"],
    ["最", "さい/もっと"]
  ],
  grammar: {},
  practice: "Write a short paragraph about how something changed over time using the time-related kanji above.",
  tip: "最 is a super-useful prefix: 最近, 最初, 最後, 最大, 最小, 最高, 最低. Master 最 and unlock many N3 vocab items."
});

curriculum.push({
  day: 978,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(978 / 7),
  title: "N3 Kanji Review: Actions & Movements",
  intro: "Review N3 kanji used in verbs and action words describing movement, activity, and behavior.",
  type: "review",
  vocab: [
    ["移動", "いどう", "movement / transfer / relocation"],
    ["進める", "すすめる", "to advance / to move forward / to promote"],
    ["戻る", "もどる", "to return / to go back / to revert"],
    ["続く", "つづく", "to continue / to last / to go on"],
    ["逃げる", "にげる", "to run away / to escape / to flee"],
    ["向かう", "むかう", "to head toward / to face / to go to"]
  ],
  chars: [
    ["移", "い/うつ"],
    ["進", "しん/すす"],
    ["戻", "もど"],
    ["続", "ぞく/つづ"],
    ["逃", "とう/に"],
    ["向", "こう/む"]
  ],
  grammar: {},
  practice: "Create compound verbs or phrases using each kanji above in a travel or adventure narrative.",
  tip: "Action kanji often pair with direction words (前, 後, 上, 下, 外, 内) — study them in pairs to double your vocabulary."
});

curriculum.push({
  day: 979,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(979 / 7),
  title: "N3 Kanji Review: Abstract Concepts",
  intro: "Review N3 kanji expressing abstract ideas such as thought, judgment, and values.",
  type: "review",
  vocab: [
    ["判断", "はんだん", "judgment / decision / assessment"],
    ["意識", "いしき", "consciousness / awareness / sense"],
    ["価値", "かち", "value / worth / merit"],
    ["真実", "しんじつ", "truth / reality / the facts"],
    ["目的", "もくてき", "purpose / goal / objective"],
    ["基準", "きじゅん", "standard / criterion / benchmark"]
  ],
  chars: [
    ["判", "はん/ばん"],
    ["断", "だん/た"],
    ["識", "しき"],
    ["価", "か/あたい"],
    ["値", "ち/ね/あたい"],
    ["基", "き/もと"]
  ],
  grammar: {},
  practice: "Write sentences debating the 価値 (value) of something using 判断, 基準, and 目的.",
  tip: "Abstract kanji appear most in N3 reading comprehension passages. Focus on recognizing them in compound form rather than writing them from scratch."
});

curriculum.push({
  day: 980,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(980 / 7),
  title: "N3 Kanji Review: Nature & Science",
  intro: "Review N3 kanji related to the natural world and basic scientific concepts.",
  type: "review",
  vocab: [
    ["気温", "きおん", "air temperature / atmospheric temperature"],
    ["水分", "すいぶん", "moisture / water content / fluid"],
    ["植物", "しょくぶつ", "plant / vegetation / flora"],
    ["動物", "どうぶつ", "animal / fauna"],
    ["物質", "ぶっしつ", "matter / substance / material"],
    ["現象", "げんしょう", "phenomenon / occurrence / event"]
  ],
  chars: [
    ["温", "おん/あたた"],
    ["植", "しょく/う"],
    ["物", "ぶつ/もの"],
    ["質", "しつ/ち"],
    ["象", "しょう/ぞう"],
    ["現", "げん/あらわ"]
  ],
  grammar: {},
  practice: "Write a short science-report style paragraph about a natural phenomenon using the kanji above.",
  tip: "物 is one of the most productive kanji: 動物, 植物, 食物, 物質, 人物, 物語, 荷物 — learn all its compounds together."
});

// Days 981-985: Mixed review sessions

curriculum.push({
  day: 981,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(981 / 7),
  title: "N3 Mixed Review: Vocab + Grammar Integration",
  intro: "Combine N3 vocabulary and grammar patterns in integrated practice exercises.",
  type: "review",
  vocab: [
    ["工夫", "くふう", "ingenuity / clever idea / device"],
    ["解決", "かいけつ", "solution / resolution / settlement"],
    ["改善", "かいぜん", "improvement / betterment / reform"],
    ["取り組む", "とりくむ", "to tackle / to work on / to grapple with"],
    ["見直す", "みなおす", "to reconsider / to review / to reassess"],
    ["乗り越える", "のりこえる", "to overcome / to get over / to surmount"]
  ],
  chars: [],
  grammar: {
    pattern: "〜ようにする vs 〜ようになる",
    meaning: "〜ようにする = to make an effort so that; 〜ようになる = to reach a state where (natural change)",
    example_jp: "毎日運動するようにしている。日本語が話せるようになった。",
    example_en: "I make an effort to exercise every day. I have come to be able to speak Japanese."
  },
  practice: "Write a self-improvement plan using ようにする, ようになる, 工夫, and 取り組む.",
  tip: "ようにする (intentional effort) vs ようになる (natural result) — the test often asks which to choose based on whether the change is deliberate or organic."
});

curriculum.push({
  day: 982,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(982 / 7),
  title: "N3 Mixed Review: Reading Comprehension Skills",
  intro: "Practice key skills for N3 reading: identifying main ideas, understanding references, and following logical flow.",
  type: "review",
  vocab: [
    ["要点", "ようてん", "main point / gist / key point"],
    ["概要", "がいよう", "outline / summary / overview"],
    ["筆者", "ひっしゃ", "author / writer (of a text)"],
    ["主張", "しゅちょう", "assertion / claim / argument"],
    ["根拠", "こんきょ", "grounds / basis / evidence"],
    ["結論", "けつろん", "conclusion / final decision"],
    ["段落", "だんらく", "paragraph / section"]
  ],
  chars: [],
  grammar: {
    pattern: "〜というのは〜ということだ",
    meaning: "What ... means is ... (used to explain or define a concept)",
    example_jp: "「改善」というのは、より良くしようとすることだ。",
    example_en: "What 'improvement' means is the act of trying to make things better."
  },
  practice: "Read a short text and identify: 筆者の主張, 根拠, and 結論 in three bullet points.",
  tip: "N3 reading questions often ask what こ/そ/あ/ど words refer back to. Underline all demonstratives in the passage and trace their references."
});

curriculum.push({
  day: 983,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(983 / 7),
  title: "N3 Mixed Review: Listening Strategy",
  intro: "Review N3 listening strategies, common patterns in audio prompts, and key vocabulary for listening tasks.",
  type: "review",
  vocab: [
    ["聞き取り", "ききとり", "listening comprehension / dictation"],
    ["内容", "ないよう", "content / substance / details"],
    ["確認", "かくにん", "confirmation / verification / check"],
    ["依頼", "いらい", "request / commission / favor"],
    ["断る", "ことわる", "to refuse / to decline / to turn down"],
    ["承知", "しょうち", "understanding / acknowledgment / consent"],
    ["了解", "りょうかい", "roger / understood / comprehension"]
  ],
  chars: [],
  grammar: {
    pattern: "〜ていただけますか / 〜てもらえますか",
    meaning: "Could you please ... (polite request forms used heavily in listening tasks)",
    example_jp: "資料を送っていただけますか。",
    example_en: "Could you please send the documents?"
  },
  practice: "Write three telephone conversation exchanges using 依頼 (request), 断る (refuse), and 承知 (consent).",
  tip: "In N3 listening, focus on the FINAL decision made by the speaker — preliminary statements often change. Listen for でも, やっぱり, and やはり as signals of reversal."
});

curriculum.push({
  day: 984,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(984 / 7),
  title: "N3 Mixed Review: Vocabulary in Context",
  intro: "Practice selecting the correct word from near-synonyms — a core N3 vocabulary section skill.",
  type: "review",
  vocab: [
    ["眺める", "ながめる", "to gaze at / to look out over (scenic/distant)"],
    ["見つめる", "みつめる", "to stare at / to gaze intently at"],
    ["見かける", "みかける", "to happen to see / to catch sight of"],
    ["見物", "けんぶつ", "sightseeing / viewing / watching"],
    ["観察", "かんさつ", "observation / study / watching closely"],
    ["監視", "かんし", "surveillance / monitoring / watch"],
    ["注目", "ちゅうもく", "attention / notice / watching with interest"]
  ],
  chars: [],
  grammar: {},
  practice: "Choose the best verb from today's list to complete each scenario: (1) watching the sunset, (2) staring at a classmate, (3) scientists studying insects, (4) security cameras.",
  tip: "N3 vocabulary section presents four near-synonym choices. Ask yourself: Who is doing it? To what? With what intensity? Distance? Purpose? — each question narrows the answer."
});

curriculum.push({
  day: 985,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(985 / 7),
  title: "N3 Mixed Review: Error Correction Practice",
  intro: "Practice identifying and correcting common grammar and vocabulary errors — a key skill for N3 language knowledge section.",
  type: "review",
  vocab: [
    ["誤り", "あやまり", "error / mistake / wrong"],
    ["正しい", "ただしい", "correct / right / proper"],
    ["適切", "てきせつ", "appropriate / suitable / proper"],
    ["不自然", "ふしぜん", "unnatural / awkward / forced"],
    ["違和感", "いわかん", "sense of incongruity / feeling that something is off"],
    ["文脈", "ぶんみゃく", "context / flow of text"]
  ],
  chars: [],
  grammar: {
    pattern: "〜にとって",
    meaning: "For ... / from the standpoint of ... (marking the person affected by or concerned with something)",
    example_jp: "この問題は子供にとって難しい。",
    example_en: "This problem is difficult for children."
  },
  practice: "Find and correct the errors: (1)「彼は医者になるために、毎日勉強しています。」(2)「試験に合格したおかげで、準備が不足でした。」",
  tip: "For error-finding tasks: read each sentence and ask 'Does this feel natural?' If there is 違和感, isolate each particle and grammatical element one by one."
});

// Days 986-990: N3 Mock test preparation

curriculum.push({
  day: 986,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(986 / 7),
  title: "N3 Mock Prep: Language Knowledge Section",
  intro: "Simulate the N3 language knowledge (vocabulary + grammar) section with timed practice.",
  type: "review",
  vocab: [
    ["制限時間", "せいげんじかん", "time limit / time allowance"],
    ["選択肢", "せんたくし", "options / choices / alternatives (on a test)"],
    ["消去法", "しょうきょほう", "process of elimination"],
    ["見直し", "みなおし", "review / checking over (answers)"],
    ["解答", "かいとう", "answer / solution / response"],
    ["正答率", "せいとうりつ", "correct answer rate / accuracy"]
  ],
  chars: [],
  grammar: {
    pattern: "〜に応じて",
    meaning: "According to / depending on / in response to",
    example_jp: "難易度に応じて、勉強方法を変えるべきだ。",
    example_en: "You should change your study method according to the difficulty level."
  },
  practice: "Set a 30-minute timer and complete 20 N3-style vocabulary and grammar fill-in-the-blank questions from your study materials.",
  tip: "N3 language knowledge section gives 30 minutes for vocabulary (25 questions) and grammar (20 questions). Budget ~40 seconds per question to leave time for review."
});

curriculum.push({
  day: 987,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(987 / 7),
  title: "N3 Mock Prep: Reading Section",
  intro: "Simulate the N3 reading comprehension section with short and medium-length texts.",
  type: "review",
  vocab: [
    ["速読", "そくどく", "speed reading / rapid reading"],
    ["精読", "せいどく", "careful reading / close reading"],
    ["把握", "はあく", "grasp / comprehension / understanding"],
    ["要約", "ようやく", "summary / abstract / synopsis"],
    ["言い換え", "いいかえ", "rephrasing / paraphrase / rewording"],
    ["前後関係", "ぜんごかんけい", "context / before-and-after relationship"]
  ],
  chars: [],
  grammar: {},
  practice: "Read a 300-character N3 passage and answer: (1) What is the main topic? (2) What does the underlined word mean? (3) What is the author's opinion?",
  tip: "N3 reading section = 60 minutes for ~12 texts. Read the questions FIRST, then skim the passage for answers. Don't read every word — locate then verify."
});

curriculum.push({
  day: 988,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(988 / 7),
  title: "N3 Mock Prep: Listening Section",
  intro: "Simulate the N3 listening section and review strategies for task types 1–4.",
  type: "review",
  vocab: [
    ["集中", "しゅうちゅう", "concentration / focus / attention"],
    ["メモ", "めも", "note / memo (loanword)"],
    ["場面", "ばめん", "scene / situation / setting"],
    ["登場人物", "とうじょうじんぶつ", "characters (in a story/dialogue)"],
    ["話者", "わしゃ", "speaker / person speaking"],
    ["状況", "じょうきょう", "situation / circumstances / state of affairs"]
  ],
  chars: [],
  grammar: {},
  practice: "Listen to three N3-level audio tracks. For each: write the 場面, identify the 話者, and summarize the 状況 in one sentence.",
  tip: "N3 listening = 40 minutes, 4 task types. Task 1 (immediate response) is fast — trust your instinct. Tasks 2-4 give more thinking time. Write key words, not full sentences."
});

curriculum.push({
  day: 989,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(989 / 7),
  title: "N3 Mock Prep: Full Practice Test",
  intro: "Complete a full-length N3 mock test under real exam conditions (no dictionary, timed).",
  type: "review",
  vocab: [
    ["本番", "ほんばん", "the real thing / actual performance / the actual test"],
    ["緊張", "きんちょう", "tension / nervousness / being on edge"],
    ["落ち着く", "おちつく", "to calm down / to settle / to compose oneself"],
    ["深呼吸", "しんこきゅう", "deep breathing / deep breath"],
    ["自信", "じしん", "confidence / self-assurance"],
    ["実力", "じつりょく", "real ability / actual skill / true competence"]
  ],
  chars: [],
  grammar: {},
  practice: "Complete a timed full N3 mock test (approximately 110 minutes total). Score your answers and identify weakest areas for final review.",
  tip: "On test day: arrive early, use the bathroom before the test begins, and eat a light meal. Physical comfort directly impacts concentration."
});

curriculum.push({
  day: 990,
  phaseNum: 21,
  phaseName: "N3 Review",
  week: Math.ceil(990 / 7),
  title: "N3 Review Complete: Bridge to N2",
  intro: "Celebrate completing N3 review and orient yourself for the higher demands of N2 study.",
  type: "review",
  vocab: [
    ["上級", "じょうきゅう", "advanced level / upper grade"],
    ["飛躍", "ひやく", "leap / jump / dramatic improvement"],
    ["継続", "けいぞく", "continuation / persistence / ongoing"],
    ["動機", "どうき", "motive / motivation / drive"],
    ["挑戦", "ちょうせん", "challenge / attempt / defiance"],
    ["基礎", "きそ", "foundation / basis / fundamentals"],
    ["応用", "おうよう", "application / applied use / practical use"]
  ],
  chars: [],
  grammar: {
    pattern: "〜を踏まえて",
    meaning: "Based on / taking ... into account / building on",
    example_jp: "N3の学習を踏まえて、N2に挑戦しよう。",
    example_en: "Building on your N3 learning, let's challenge N2."
  },
  practice: "Write a one-page study plan for N2: list your goals, your weaknesses from N3, and three concrete daily habits you will maintain.",
  tip: "N2 requires approximately 600 additional study hours beyond N3. Consistency beats intensity — 90 minutes daily is more effective than 6-hour weekend sessions."
});