"use strict";


// ═══════════════════════════════════════════════════════════════════════════
// PHASE 11: N4 VERBS (Days 456-500)
// 45 days covering causative, passive, conditional, volitional, and compounds
// ═══════════════════════════════════════════════════════════════════════════

curriculum.push({
  day: 456,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative Form: Group 2 RU-Verbs",
  intro: "The causative form expresses making or letting someone do something. RU-verbs: drop る, add させる.",
  type: "verbs",
  chars: [
    ["食べる→食べさせる", "make/let eat"],
    ["見る→見させる", "make/let see"],
    ["起きる→起きさせる", "make/let wake up"],
    ["着る→着させる", "make/let wear"],
    ["寝る→寝させる", "make/let sleep"]
  ],
  vocab: [
    ["食べさせる", "たべさせる", "to make/let eat"],
    ["見させる", "みさせる", "to make/let see"],
    ["起きさせる", "おきさせる", "to make/let wake up"],
    ["着させる", "きさせる", "to make/let wear"],
    ["出させる", "ださせる", "to make/let leave"]
  ],
  grammar: {
    pattern: "〜させる (RU-verb causative)",
    meaning: "Make/let someone do ~",
    example_jp: "母は子どもに野菜を食べさせた。",
    example_en: "The mother made the child eat vegetables."
  },
  practice: "Practice conjugating 10 RU-verbs into their causative form. Write sentences using each.",
  tip: "The causative form has two meanings: 'make someone do' (forced) and 'let someone do' (permission). Context tells you which!"
});

curriculum.push({
  day: 457,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative Form: Group 1 U-Verbs",
  intro: "U-verbs change their final う-row kana to the あ-row, then add せる. For example: 書く→書かせる.",
  type: "verbs",
  chars: [
    ["書く→書かせる", "make/let write"],
    ["読む→読ませる", "make/let read"],
    ["飲む→飲ませる", "make/let drink"],
    ["話す→話させる", "make/let speak"],
    ["待つ→待たせる", "make/let wait"]
  ],
  vocab: [
    ["書かせる", "かかせる", "to make/let write"],
    ["読ませる", "よませる", "to make/let read"],
    ["飲ませる", "のませる", "to make/let drink"],
    ["話させる", "はなさせる", "to make/let speak"],
    ["泳がせる", "およがせる", "to make/let swim"]
  ],
  grammar: {
    pattern: "〜させる (U-verb causative)",
    meaning: "Make/let someone do ~ (U-verb pattern)",
    example_jp: "先生は学生に作文を書かせた。",
    example_en: "The teacher made the students write an essay."
  },
  practice: "Conjugate these U-verbs to causative: 行く, 帰る, 作る, 歌う, 遊ぶ. Write a sentence for each.",
  tip: "Watch out for す-ending verbs: 話す→話させる (not 話さす). The あ-row + せる pattern is consistent."
});

curriculum.push({
  day: 458,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative Form: Irregular Verbs",
  intro: "The two irregular verbs する and くる have special causative forms: させる and こさせる.",
  type: "verbs",
  chars: [
    ["する→させる", "make/let do"],
    ["くる→こさせる", "make/let come"],
    ["勉強する→勉強させる", "make/let study"],
    ["運動する→運動させる", "make/let exercise"],
    ["掃除する→掃除させる", "make/let clean"]
  ],
  vocab: [
    ["させる", "させる", "to make/let do"],
    ["こさせる", "こさせる", "to make/let come"],
    ["勉強させる", "べんきょうさせる", "to make/let study"],
    ["運動させる", "うんどうさせる", "to make/let exercise"],
    ["掃除させる", "そうじさせる", "to make/let clean"]
  ],
  grammar: {
    pattern: "する→させる / くる→こさせる",
    meaning: "Irregular causative forms",
    example_jp: "コーチは選手に毎日運動させる。",
    example_en: "The coach makes the athletes exercise every day."
  },
  practice: "Write 5 sentences using する-verb causatives (勉強させる, 練習させる, etc.) and 3 using こさせる.",
  tip: "Most する-compound verbs just replace する with させる. This makes hundreds of causatives easy to form!"
});

curriculum.push({
  day: 459,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative + てください",
  intro: "Combine causative with てください to politely ask someone to let you do something: 行かせてください (please let me go).",
  type: "verbs",
  chars: [
    ["行かせてください", "please let me go"],
    ["食べさせてください", "please let me eat"],
    ["見させてください", "please let me see"],
    ["やらせてください", "please let me do it"],
    ["参加させてください", "please let me join"]
  ],
  vocab: [
    ["行かせる", "いかせる", "to let go"],
    ["参加させる", "さんかさせる", "to let participate"],
    ["手伝わせる", "てつだわせる", "to let help"],
    ["休ませる", "やすませる", "to let rest"],
    ["使わせる", "つかわせる", "to let use"]
  ],
  grammar: {
    pattern: "〜させてください",
    meaning: "Please let me do ~",
    example_jp: "このプロジェクトをやらせてください。",
    example_en: "Please let me do this project."
  },
  practice: "Write 5 polite requests using させてください for situations at work, school, and home.",
  tip: "させてください is very useful in business Japanese. It shows humility while making a request."
});

curriculum.push({
  day: 460,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative Particles: に vs を",
  intro: "With causative verbs, に marks the person being made/let to do something. を marks the direct object.",
  type: "verbs",
  chars: [
    ["母に食べさせる", "make mother eat"],
    ["子どもを食べさせる", "feed the child"],
    ["学生に書かせる", "make students write"],
    ["弟を走らせる", "make brother run"],
    ["彼に歌わせる", "let him sing"]
  ],
  vocab: [
    ["子ども", "こども", "child"],
    ["学生", "がくせい", "student"],
    ["部下", "ぶか", "subordinate"],
    ["生徒", "せいと", "pupil"],
    ["選手", "せんしゅ", "athlete"]
  ],
  grammar: {
    pattern: "AにBをVさせる / AをVさせる",
    meaning: "Make/let A do B (transitive) / Make A do V (intransitive)",
    example_jp: "先生は学生に本を読ませた。",
    example_en: "The teacher made the students read a book."
  },
  practice: "Write 5 sentences with transitive causative (AにBをVさせる) and 5 with intransitive (AをVさせる).",
  tip: "Key rule: if the original verb is transitive (takes を), use に for the person. If intransitive, you can use を for the person."
});

curriculum.push({
  day: 461,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Permissive Causative: Letting Someone Do",
  intro: "The causative form can express permission — letting someone do what they want. Often paired with てあげる.",
  type: "verbs",
  chars: [
    ["好きにさせる", "let do as one likes"],
    ["休ませてあげる", "let rest (kindly)"],
    ["遊ばせてあげる", "let play (kindly)"],
    ["選ばせる", "let choose"],
    ["自由にさせる", "let be free"]
  ],
  vocab: [
    ["好きにする", "すきにする", "to do as one likes"],
    ["自由", "じゆう", "freedom"],
    ["選ぶ", "えらぶ", "to choose"],
    ["任せる", "まかせる", "to entrust"],
    ["許す", "ゆるす", "to allow"]
  ],
  grammar: {
    pattern: "〜させてあげる",
    meaning: "Let someone do ~ (with kindness)",
    example_jp: "子どもに好きなおもちゃを選ばせてあげた。",
    example_en: "I let the child choose their favorite toy."
  },
  practice: "Write 5 sentences about things parents let children do using させてあげる.",
  tip: "させてあげる adds warmth. Compare: 遊ばせた (made/let play — neutral) vs 遊ばせてあげた (kindly let play)."
});

curriculum.push({
  day: 462,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 66,
  title: "Causative Form: Practice Day",
  intro: "Today we review all causative patterns: RU-verbs, U-verbs, irregulars, and the させてください form.",
  type: "verbs",
  chars: [
    ["食べさせる", "make/let eat"],
    ["書かせる", "make/let write"],
    ["させる", "make/let do"],
    ["行かせてください", "please let me go"],
    ["選ばせてあげる", "kindly let choose"]
  ],
  vocab: [
    ["先輩", "せんぱい", "senior"],
    ["後輩", "こうはい", "junior"],
    ["上司", "じょうし", "boss"],
    ["同僚", "どうりょう", "colleague"],
    ["先生", "せんせい", "teacher"]
  ],
  grammar: {
    pattern: "Causative review",
    meaning: "All causative patterns combined",
    example_jp: "上司は部下に新しいプロジェクトをさせた。",
    example_en: "The boss had the subordinate work on a new project."
  },
  practice: "Conjugate 10 random verbs into causative form. Write a short story using at least 5 causative sentences.",
  tip: "Remember the three meanings: force (させる), permission (させてあげる), and request (させてください)."
});

curriculum.push({
  day: 463,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Passive Form: Group 2 RU-Verbs",
  intro: "The passive form expresses that something is done TO you. RU-verbs: drop る, add られる.",
  type: "verbs",
  chars: [
    ["食べる→食べられる", "to be eaten"],
    ["見る→見られる", "to be seen"],
    ["褒める→褒められる", "to be praised"],
    ["叱る→叱られる", "to be scolded"],
    ["教える→教えられる", "to be taught"]
  ],
  vocab: [
    ["食べられる", "たべられる", "to be eaten"],
    ["見られる", "みられる", "to be seen"],
    ["褒められる", "ほめられる", "to be praised"],
    ["叱られる", "しかられる", "to be scolded"],
    ["教えられる", "おしえられる", "to be taught"]
  ],
  grammar: {
    pattern: "〜られる (RU-verb passive)",
    meaning: "To be ~ed (RU-verb passive form)",
    example_jp: "先生に褒められてうれしかった。",
    example_en: "I was happy to be praised by the teacher."
  },
  practice: "Conjugate 10 RU-verbs to passive. Write sentences about being praised, scolded, or noticed.",
  tip: "For RU-verbs, passive (られる) looks identical to potential (can do). Context tells the difference!"
});

curriculum.push({
  day: 464,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Passive Form: Group 1 U-Verbs",
  intro: "U-verbs change their final kana to the あ-row, then add れる. Example: 読む→読まれる.",
  type: "verbs",
  chars: [
    ["読む→読まれる", "to be read"],
    ["書く→書かれる", "to be written"],
    ["飲む→飲まれる", "to be drunk"],
    ["取る→取られる", "to be taken"],
    ["踏む→踏まれる", "to be stepped on"]
  ],
  vocab: [
    ["読まれる", "よまれる", "to be read"],
    ["書かれる", "かかれる", "to be written"],
    ["呼ばれる", "よばれる", "to be called"],
    ["聞かれる", "きかれる", "to be asked"],
    ["笑われる", "わらわれる", "to be laughed at"]
  ],
  grammar: {
    pattern: "〜れる (U-verb passive)",
    meaning: "To be ~ed (U-verb passive form)",
    example_jp: "友だちに名前を呼ばれた。",
    example_en: "I was called by name by my friend."
  },
  practice: "Conjugate these to passive: 言う, 使う, 売る, 殺す, 盗む. Write a sentence for each.",
  tip: "U-verb passive is straightforward: あ-row + れる. Unlike RU-verbs, passive and potential forms are different."
});

curriculum.push({
  day: 465,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Passive Form: Irregular Verbs",
  intro: "する becomes される, くる becomes こられる. These are high-frequency forms in daily Japanese.",
  type: "verbs",
  chars: [
    ["する→される", "to be done"],
    ["くる→こられる", "to be come to"],
    ["紹介する→紹介される", "to be introduced"],
    ["招待する→招待される", "to be invited"],
    ["注意する→注意される", "to be warned"]
  ],
  vocab: [
    ["される", "される", "to be done"],
    ["こられる", "こられる", "to be come to"],
    ["紹介される", "しょうかいされる", "to be introduced"],
    ["招待される", "しょうたいされる", "to be invited"],
    ["質問される", "しつもんされる", "to be questioned"]
  ],
  grammar: {
    pattern: "する→される / くる→こられる",
    meaning: "Irregular passive forms",
    example_jp: "パーティーに招待されました。",
    example_en: "I was invited to the party."
  },
  practice: "Write 5 sentences using する-verb passives in formal situations (interviews, ceremonies, meetings).",
  tip: "される is extremely common in news and formal writing. 発表された (was announced), 開催された (was held)."
});

curriculum.push({
  day: 466,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Direct Passive: Action Done to the Subject",
  intro: "Direct passive describes an action done directly to the subject. The doer is marked with に.",
  type: "verbs",
  chars: [
    ["先生に褒められた", "was praised by teacher"],
    ["母に起こされた", "was woken by mother"],
    ["友だちに誘われた", "was invited by friend"],
    ["犬にかまれた", "was bitten by dog"],
    ["上司に注意された", "was warned by boss"]
  ],
  vocab: [
    ["褒める", "ほめる", "to praise"],
    ["起こす", "おこす", "to wake someone"],
    ["誘う", "さそう", "to invite"],
    ["叱る", "しかる", "to scold"],
    ["注意する", "ちゅういする", "to warn"]
  ],
  grammar: {
    pattern: "AはBに〜(ら)れる",
    meaning: "A is ~ed by B (direct passive)",
    example_jp: "私は母に毎朝6時に起こされる。",
    example_en: "I am woken up by my mother at 6 every morning."
  },
  practice: "Write 5 sentences about things that happen to you daily using direct passive.",
  tip: "In direct passive, the に-person is the doer. The subject (は) receives the action. Think: 'I was verbed by someone.'"
});

curriculum.push({
  day: 467,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Indirect Passive: Suffering Passive",
  intro: "Japanese has a unique 'suffering passive' for situations that negatively affect you, even if the action wasn't directed at you.",
  type: "verbs",
  chars: [
    ["雨に降られた", "was rained on"],
    ["隣の人に泣かれた", "neighbor cried (bothering me)"],
    ["電車で足を踏まれた", "foot was stepped on"],
    ["彼女に泣かれた", "she cried (on me)"],
    ["友だちに先に行かれた", "friend went ahead (leaving me)"]
  ],
  vocab: [
    ["降る", "ふる", "to fall (rain)"],
    ["泣く", "なく", "to cry"],
    ["踏む", "ふむ", "to step on"],
    ["死ぬ", "しぬ", "to die"],
    ["逃げる", "にげる", "to escape"]
  ],
  grammar: {
    pattern: "〜に〜(ら)れる (suffering passive)",
    meaning: "Be adversely affected by someone's action",
    example_jp: "帰り道に雨に降られて、びしょぬれになった。",
    example_en: "I got caught in the rain on the way home and was soaked."
  },
  practice: "Write 5 sentences about inconvenient things that happened to you using the suffering passive.",
  tip: "The suffering passive is uniquely Japanese. Even intransitive verbs like 降る (rain) and 泣く (cry) can be passivized to show you were negatively affected."
});

curriculum.push({
  day: 468,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Passive in Polite Speech",
  intro: "Passive forms are used in polite/formal Japanese to soften statements and show respect.",
  type: "verbs",
  chars: [
    ["言われました", "it was said"],
    ["聞かれました", "I was asked"],
    ["思われます", "it seems/is thought"],
    ["考えられます", "it is considered"],
    ["知られています", "it is known"]
  ],
  vocab: [
    ["言う", "いう", "to say"],
    ["聞く", "きく", "to ask"],
    ["思う", "おもう", "to think"],
    ["考える", "かんがえる", "to consider"],
    ["知る", "しる", "to know"]
  ],
  grammar: {
    pattern: "Passive in formal speech",
    meaning: "Using passive to express formality and politeness",
    example_jp: "この薬は食後に飲まれることをお勧めします。",
    example_en: "It is recommended that this medicine be taken after meals."
  },
  practice: "Rewrite 5 casual sentences in formal passive style for a business email.",
  tip: "Passive voice in Japanese, like English, creates distance and formality. 'We decided' → 'It was decided.'"
});

curriculum.push({
  day: 469,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 67,
  title: "Passive Form: Practice Day",
  intro: "Review all passive patterns: direct, indirect (suffering), and polite passives.",
  type: "verbs",
  chars: [
    ["褒められる", "to be praised"],
    ["雨に降られる", "to get rained on"],
    ["言われました", "it was said"],
    ["紹介される", "to be introduced"],
    ["足を踏まれた", "foot was stepped on"]
  ],
  vocab: [
    ["新聞", "しんぶん", "newspaper"],
    ["ニュース", "ニュース", "news"],
    ["記事", "きじ", "article"],
    ["報告", "ほうこく", "report"],
    ["発表", "はっぴょう", "announcement"]
  ],
  grammar: {
    pattern: "Passive review",
    meaning: "All passive patterns combined",
    example_jp: "このニュースは今朝発表されました。",
    example_en: "This news was announced this morning."
  },
  practice: "Write a short diary entry about your day using at least 5 passive sentences (mix direct, suffering, and formal).",
  tip: "Passive is one of the most common verb forms in written Japanese. Read news articles and notice how often it appears."
});

curriculum.push({
  day: 470,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Causative-Passive: Group 2 RU-Verbs",
  intro: "The causative-passive means 'to be made to do something.' RU-verbs: add させられる. It expresses being forced.",
  type: "verbs",
  chars: [
    ["食べさせられる", "to be made to eat"],
    ["見させられる", "to be made to watch"],
    ["覚えさせられる", "to be made to memorize"],
    ["着させられる", "to be made to wear"],
    ["調べさせられる", "to be made to investigate"]
  ],
  vocab: [
    ["食べさせられる", "たべさせられる", "to be made to eat"],
    ["見させられる", "みさせられる", "to be made to watch"],
    ["覚えさせられる", "おぼえさせられる", "to be made to memorize"],
    ["考えさせられる", "かんがえさせられる", "to be made to think"],
    ["答えさせられる", "こたえさせられる", "to be made to answer"]
  ],
  grammar: {
    pattern: "〜させられる (RU-verb causative-passive)",
    meaning: "To be made to do ~ (against one's will)",
    example_jp: "嫌いな野菜を食べさせられた。",
    example_en: "I was made to eat vegetables I don't like."
  },
  practice: "Write 5 sentences about things you were made to do as a child using させられる.",
  tip: "Causative-passive always implies being forced. It carries a nuance of complaint or reluctance."
});

curriculum.push({
  day: 471,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Causative-Passive: Group 1 U-Verbs (Short Form)",
  intro: "U-verbs have a shortened causative-passive: instead of させられる, use される. 書く→書かされる.",
  type: "verbs",
  chars: [
    ["書く→書かされる", "to be made to write"],
    ["読む→読まされる", "to be made to read"],
    ["飲む→飲まされる", "to be made to drink"],
    ["待つ→待たされる", "to be made to wait"],
    ["歌う→歌わされる", "to be made to sing"]
  ],
  vocab: [
    ["書かされる", "かかされる", "to be made to write"],
    ["読まされる", "よまされる", "to be made to read"],
    ["飲まされる", "のまされる", "to be made to drink"],
    ["走らされる", "はしらされる", "to be made to run"],
    ["歌わされる", "うたわされる", "to be made to sing"]
  ],
  grammar: {
    pattern: "〜(さ)される (U-verb short causative-passive)",
    meaning: "To be made to do ~ (U-verb shortened form)",
    example_jp: "上司に残業させられた。",
    example_en: "I was made to work overtime by my boss."
  },
  practice: "Conjugate 10 U-verbs into causative-passive. Compare the long form (〜させられる) and short form (〜される).",
  tip: "The short form (書かされる) is more common in speech than the full form (書かせられる). Both are correct!"
});

curriculum.push({
  day: 472,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Causative-Passive: Irregular Verbs",
  intro: "する→させられる, くる→こさせられる. These complete the causative-passive conjugation set.",
  type: "verbs",
  chars: [
    ["する→させられる", "to be made to do"],
    ["くる→こさせられる", "to be made to come"],
    ["勉強する→勉強させられる", "to be made to study"],
    ["掃除する→掃除させられる", "to be made to clean"],
    ["練習する→練習させられる", "to be made to practice"]
  ],
  vocab: [
    ["させられる", "させられる", "to be made to do"],
    ["こさせられる", "こさせられる", "to be made to come"],
    ["勉強させられる", "べんきょうさせられる", "to be made to study"],
    ["残業させられる", "ざんぎょうさせられる", "to be made to work overtime"],
    ["我慢させられる", "がまんさせられる", "to be made to endure"]
  ],
  grammar: {
    pattern: "する→させられる / くる→こさせられる",
    meaning: "Irregular causative-passive forms",
    example_jp: "毎日3時間も勉強させられる。",
    example_en: "I'm made to study for 3 hours every day."
  },
  practice: "Write 5 complaints about things you are made to do at work or school using させられる.",
  tip: "させられる is the longest common conjugation in Japanese. Break it down: させ (causative) + られる (passive) = made to do."
});

curriculum.push({
  day: 473,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Expressing Complaints with Causative-Passive",
  intro: "The causative-passive is perfect for expressing frustration about being forced to do things.",
  type: "verbs",
  chars: [
    ["宿題をさせられた", "was made to do homework"],
    ["掃除させられた", "was made to clean"],
    ["残業させられた", "was made to work overtime"],
    ["待たされた", "was made to wait"],
    ["走らされた", "was made to run"]
  ],
  vocab: [
    ["宿題", "しゅくだい", "homework"],
    ["残業", "ざんぎょう", "overtime"],
    ["掃除", "そうじ", "cleaning"],
    ["我慢", "がまん", "patience/endurance"],
    ["無理", "むり", "impossible/unreasonable"]
  ],
  grammar: {
    pattern: "〜させられた (past complaint)",
    meaning: "Was forced to do ~ (expressing frustration)",
    example_jp: "子どものとき、毎日ピアノを練習させられた。",
    example_en: "When I was a child, I was made to practice piano every day."
  },
  practice: "Write about 5 things you were forced to do growing up, using causative-passive past tense.",
  tip: "This pattern is very natural for telling stories about childhood: 〜させられた (I was made to...). Japanese people use it often!"
});

curriculum.push({
  day: 474,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Comparing: Causative vs Passive vs Causative-Passive",
  intro: "Three forms, three meanings: causative (make do), passive (is done to), causative-passive (is made to do).",
  type: "verbs",
  chars: [
    ["食べさせる", "make eat (causative)"],
    ["食べられる", "be eaten (passive)"],
    ["食べさせられる", "be made to eat (caus-pass)"],
    ["読ませる", "make read"],
    ["読まれる", "be read"]
  ],
  vocab: [
    ["比較", "ひかく", "comparison"],
    ["違い", "ちがい", "difference"],
    ["意味", "いみ", "meaning"],
    ["文法", "ぶんぽう", "grammar"],
    ["使い分け", "つかいわけ", "proper use"]
  ],
  grammar: {
    pattern: "Causative vs Passive vs Causative-Passive",
    meaning: "Comparing three voice forms",
    example_jp: "先生が読ませた。→ 先生に読まれた。→ 先生に読まされた。",
    example_en: "Teacher made [me] read. → Was read by teacher. → Was made to read by teacher."
  },
  practice: "For 5 verbs, write all three forms (causative, passive, causative-passive) and a sentence for each.",
  tip: "Think of it as a chain: I make (causative) → I am affected (passive) → I am forced (causative-passive)."
});

curriculum.push({
  day: 475,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Natural Causative-Passive Expressions",
  intro: "Some causative-passive expressions are so common they feel like set phrases in everyday Japanese.",
  type: "verbs",
  chars: [
    ["考えさせられる", "makes you think"],
    ["感動させられる", "to be moved"],
    ["驚かされる", "to be surprised"],
    ["笑わされる", "to be made to laugh"],
    ["泣かされる", "to be made to cry"]
  ],
  vocab: [
    ["感動", "かんどう", "being moved/touched"],
    ["驚く", "おどろく", "to be surprised"],
    ["笑う", "わらう", "to laugh"],
    ["泣く", "なく", "to cry"],
    ["考える", "かんがえる", "to think"]
  ],
  grammar: {
    pattern: "〜させられる (natural expressions)",
    meaning: "Common causative-passive idioms",
    example_jp: "この映画には考えさせられた。",
    example_en: "This movie really made me think."
  },
  practice: "Write about a book, movie, or experience that 考えさせられた, 感動させられた, or 驚かされた.",
  tip: "考えさせられる (makes you think) is a favorite phrase of reviewers and critics. It sounds intellectual and thoughtful."
});

curriculum.push({
  day: 476,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 68,
  title: "Causative-Passive: Practice Day",
  intro: "Review all causative-passive forms and compare with causative and passive.",
  type: "verbs",
  chars: [
    ["食べさせられる", "be made to eat"],
    ["書かされる", "be made to write"],
    ["させられる", "be made to do"],
    ["考えさせられる", "makes one think"],
    ["待たされる", "be kept waiting"]
  ],
  vocab: [
    ["復習", "ふくしゅう", "review"],
    ["練習", "れんしゅう", "practice"],
    ["確認", "かくにん", "confirmation"],
    ["応用", "おうよう", "application"],
    ["完璧", "かんぺき", "perfect"]
  ],
  grammar: {
    pattern: "Causative-passive comprehensive review",
    meaning: "All causative-passive patterns",
    example_jp: "日本語の動詞の活用を完璧に覚えさせられた。",
    example_en: "I was made to perfectly memorize Japanese verb conjugations."
  },
  practice: "Create a chart of 10 verbs showing: dictionary form, causative, passive, and causative-passive for each.",
  tip: "You now know all three voice forms! This is a major milestone. These patterns appear frequently on the JLPT N4."
});

curriculum.push({
  day: 477,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Conditional ば Form: Verbs",
  intro: "The ば form expresses 'if.' Verbs: change final え-row kana + ば. 行く→行けば, 食べる→食べれば.",
  type: "verbs",
  chars: [
    ["行く→行けば", "if go"],
    ["食べる→食べれば", "if eat"],
    ["読む→読めば", "if read"],
    ["する→すれば", "if do"],
    ["来る→来れば", "if come"]
  ],
  vocab: [
    ["行けば", "いけば", "if one goes"],
    ["食べれば", "たべれば", "if one eats"],
    ["読めば", "よめば", "if one reads"],
    ["すれば", "すれば", "if one does"],
    ["来れば", "くれば", "if one comes"]
  ],
  grammar: {
    pattern: "〜ば (verb conditional)",
    meaning: "If ~ (verb conditional)",
    example_jp: "薬を飲めば、すぐよくなりますよ。",
    example_en: "If you take the medicine, you'll get better quickly."
  },
  practice: "Conjugate 10 verbs into ば form. Write conditional sentences for each.",
  tip: "The ば conditional implies a general truth or logical consequence. 'If A, then naturally B.'"
});

curriculum.push({
  day: 478,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Conditional ば Form: Adjectives & Nouns",
  intro: "い-adjectives: drop い, add ければ. な-adjectives/nouns: add であれば or なら.",
  type: "verbs",
  chars: [
    ["高い→高ければ", "if expensive"],
    ["安い→安ければ", "if cheap"],
    ["静か→静かであれば", "if quiet"],
    ["学生→学生であれば", "if student"],
    ["いい→よければ", "if good"]
  ],
  vocab: [
    ["高ければ", "たかければ", "if expensive"],
    ["安ければ", "やすければ", "if cheap"],
    ["よければ", "よければ", "if good"],
    ["暇であれば", "ひまであれば", "if free"],
    ["元気であれば", "げんきであれば", "if healthy"]
  ],
  grammar: {
    pattern: "〜ければ / 〜であれば",
    meaning: "If ~ (adjective/noun conditional)",
    example_jp: "天気がよければ、ピクニックに行きましょう。",
    example_en: "If the weather is good, let's go on a picnic."
  },
  practice: "Write 5 sentences with い-adjective ば forms and 5 with な-adjective/noun ば forms.",
  tip: "Special case: いい becomes よければ (not いければ). This is the most common exception to memorize."
});

curriculum.push({
  day: 479,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Conditional たら Form",
  intro: "たら is the most versatile conditional. Just add ら to the past tense: 行った→行ったら.",
  type: "verbs",
  chars: [
    ["行く→行ったら", "if/when go"],
    ["食べる→食べたら", "if/when eat"],
    ["高い→高かったら", "if expensive"],
    ["静か→静かだったら", "if quiet"],
    ["雨→雨だったら", "if rain"]
  ],
  vocab: [
    ["行ったら", "いったら", "if/when one goes"],
    ["食べたら", "たべたら", "if/when one eats"],
    ["終わったら", "おわったら", "if/when finished"],
    ["暇だったら", "ひまだったら", "if free"],
    ["安かったら", "やすかったら", "if cheap"]
  ],
  grammar: {
    pattern: "〜たら (conditional)",
    meaning: "If/when ~ (most versatile conditional)",
    example_jp: "駅に着いたら、電話してください。",
    example_en: "When you arrive at the station, please call me."
  },
  practice: "Write 5 sentences using たら for 'if' and 5 using たら for 'when.'",
  tip: "たら is the safest conditional — it works in almost any situation. When in doubt, use たら!"
});

curriculum.push({
  day: 480,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Comparing ば vs たら",
  intro: "ば implies general/logical conditions. たら is broader and can express discovered situations after the action.",
  type: "verbs",
  chars: [
    ["練習すれば上手になる", "if you practice, you improve"],
    ["練習したらうまくいった", "when I practiced, it went well"],
    ["春になれば桜が咲く", "when spring comes, cherry blossoms bloom"],
    ["家に帰ったら誰もいなかった", "when I got home, nobody was there"],
    ["安ければ買います", "if it's cheap, I'll buy it"]
  ],
  vocab: [
    ["条件", "じょうけん", "condition"],
    ["場合", "ばあい", "case/situation"],
    ["結果", "けっか", "result"],
    ["発見", "はっけん", "discovery"],
    ["事実", "じじつ", "fact"]
  ],
  grammar: {
    pattern: "ば vs たら comparison",
    meaning: "When to use ば vs たら",
    example_jp: "ば: 春になれば暖かくなる。たら: 家に帰ったら猫がいた。",
    example_en: "ば: When spring comes, it gets warm. たら: When I got home, there was a cat."
  },
  practice: "Write the same situation using both ば and たら. Note which sounds more natural in each context.",
  tip: "Rule of thumb: ば for general truths and hypotheticals. たら for one-time events and discoveries."
});

curriculum.push({
  day: 481,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Conditional なら",
  intro: "なら is used when you receive information and respond to it. 'If that's the case, then...'",
  type: "verbs",
  chars: [
    ["日本に行くなら", "if you're going to Japan"],
    ["魚なら", "if it's fish"],
    ["安いなら", "if it's cheap"],
    ["暇なら", "if you're free"],
    ["本当なら", "if it's true"]
  ],
  vocab: [
    ["旅行", "りょこう", "travel"],
    ["おすすめ", "おすすめ", "recommendation"],
    ["場所", "ばしょ", "place"],
    ["料理", "りょうり", "cooking"],
    ["経験", "けいけん", "experience"]
  ],
  grammar: {
    pattern: "〜なら",
    meaning: "If (that's the case), then ~",
    example_jp: "日本に行くなら、京都がおすすめですよ。",
    example_en: "If you're going to Japan, I recommend Kyoto."
  },
  practice: "Write 5 recommendation sentences using なら. Imagine a friend tells you something, and you respond.",
  tip: "なら is conversational. Someone says something → you react with なら: 'Oh, if that's the case, then...'"
});

curriculum.push({
  day: 482,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Conditional と",
  intro: "と expresses automatic or natural consequences. 'When A happens, B always follows.'",
  type: "verbs",
  chars: [
    ["春になると", "when spring comes"],
    ["ボタンを押すと", "when you press the button"],
    ["右に曲がると", "when you turn right"],
    ["このドアを開けると", "when you open this door"],
    ["薬を飲むと", "when you take medicine"]
  ],
  vocab: [
    ["ボタン", "ボタン", "button"],
    ["ドア", "ドア", "door"],
    ["信号", "しんごう", "traffic light"],
    ["自動的", "じどうてき", "automatic"],
    ["結果", "けっか", "result"]
  ],
  grammar: {
    pattern: "〜と (automatic consequence)",
    meaning: "When/if ~, then always ~ (natural result)",
    example_jp: "このボタンを押すと、ドアが開きます。",
    example_en: "When you press this button, the door opens."
  },
  practice: "Write 5 sentences describing automatic/natural consequences using と.",
  tip: "と cannot be used with requests, commands, or suggestions. It's for stating facts: 'When A, B happens (always).'"
});

curriculum.push({
  day: 483,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 69,
  title: "Mixed Conditionals: Practice Day",
  intro: "Review all four conditionals: ば, たら, なら, と. Each has distinct nuances.",
  type: "verbs",
  chars: [
    ["行けば", "if go (general)"],
    ["行ったら", "if/when go (versatile)"],
    ["行くなら", "if going (responding)"],
    ["行くと", "when go (automatic)"],
    ["高ければ買わない", "if expensive, won't buy"]
  ],
  vocab: [
    ["文脈", "ぶんみゃく", "context"],
    ["ニュアンス", "ニュアンス", "nuance"],
    ["使い方", "つかいかた", "how to use"],
    ["正しい", "ただしい", "correct"],
    ["間違い", "まちがい", "mistake"]
  ],
  grammar: {
    pattern: "ば vs たら vs なら vs と",
    meaning: "All four Japanese conditionals compared",
    example_jp: "ば: 読めばわかる。たら: 読んだらわかった。なら: 読むなら静かに。と: 読むと眠くなる。",
    example_en: "ば: If you read it, you'll understand. たら: When I read it, I understood. なら: If you're going to read, do it quietly. と: When I read, I get sleepy."
  },
  practice: "Rewrite the same scenario using all four conditionals. Which is most natural? Write 3 sets of comparisons.",
  tip: "JLPT N4 loves testing conditionals. The key differences: ば (hypothetical), たら (flexible), なら (reacting), と (automatic)."
});

curriculum.push({
  day: 484,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional Form: Group 2 RU-Verbs",
  intro: "The volitional form expresses 'let's do' or 'I'll do.' RU-verbs: drop る, add よう.",
  type: "verbs",
  chars: [
    ["食べる→食べよう", "let's eat"],
    ["見る→見よう", "let's see"],
    ["起きる→起きよう", "let's wake up"],
    ["出る→出よう", "let's leave"],
    ["寝る→寝よう", "let's sleep"]
  ],
  vocab: [
    ["食べよう", "たべよう", "let's eat"],
    ["見よう", "みよう", "let's see"],
    ["始めよう", "はじめよう", "let's begin"],
    ["出かけよう", "でかけよう", "let's go out"],
    ["調べよう", "しらべよう", "let's investigate"]
  ],
  grammar: {
    pattern: "〜よう (RU-verb volitional)",
    meaning: "Let's ~ / I shall ~",
    example_jp: "今日は早く寝よう。",
    example_en: "Let's go to bed early today."
  },
  practice: "Conjugate 10 RU-verbs into volitional form. Write invitations using each.",
  tip: "The volitional form is casual. For polite invitations, use ましょう instead: 食べましょう (let's eat)."
});

curriculum.push({
  day: 485,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional Form: Group 1 U-Verbs",
  intro: "U-verbs change their final kana to the お-row: 行く→行こう, 書く→書こう.",
  type: "verbs",
  chars: [
    ["行く→行こう", "let's go"],
    ["書く→書こう", "let's write"],
    ["読む→読もう", "let's read"],
    ["飲む→飲もう", "let's drink"],
    ["話す→話そう", "let's talk"]
  ],
  vocab: [
    ["行こう", "いこう", "let's go"],
    ["書こう", "かこう", "let's write"],
    ["読もう", "よもう", "let's read"],
    ["遊ぼう", "あそぼう", "let's play"],
    ["帰ろう", "かえろう", "let's go home"]
  ],
  grammar: {
    pattern: "〜おう (U-verb volitional)",
    meaning: "Let's ~ / I shall ~ (U-verb)",
    example_jp: "みんなで公園に行こう！",
    example_en: "Let's all go to the park!"
  },
  practice: "Conjugate 10 U-verbs to volitional. Write casual invitations to friends.",
  tip: "The お-row pattern: く→こう, む→もう, す→そう, つ→とう, ぶ→ぼう, ぬ→のう, ぐ→ごう, う→おう, る→ろう."
});

curriculum.push({
  day: 486,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional Form: Irregular Verbs",
  intro: "する→しよう, くる→こよう. Also: polite forms ましょう for all verb groups.",
  type: "verbs",
  chars: [
    ["する→しよう", "let's do"],
    ["くる→こよう", "let's come"],
    ["勉強する→勉強しよう", "let's study"],
    ["食べる→食べましょう", "let's eat (polite)"],
    ["行く→行きましょう", "let's go (polite)"]
  ],
  vocab: [
    ["しよう", "しよう", "let's do"],
    ["こよう", "こよう", "let's come"],
    ["散歩しよう", "さんぽしよう", "let's take a walk"],
    ["出発しましょう", "しゅっぱつしましょう", "let's depart"],
    ["相談しよう", "そうだんしよう", "let's discuss"]
  ],
  grammar: {
    pattern: "する→しよう / くる→こよう / 〜ましょう",
    meaning: "Irregular volitional + polite form",
    example_jp: "そろそろ出発しましょう。",
    example_en: "Let's depart soon."
  },
  practice: "Write 5 casual invitations (よう) and 5 polite ones (ましょう). Notice the difference in tone.",
  tip: "ましょう is formed from ます-stem + しょう. It works for ALL verb groups — the universal polite volitional."
});

curriculum.push({
  day: 487,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional + と思う: Expressing Intentions",
  intro: "よう＋と思う means 'I think I'll do' or 'I'm planning to do.' It expresses personal intention.",
  type: "verbs",
  chars: [
    ["食べようと思う", "I think I'll eat"],
    ["行こうと思う", "I think I'll go"],
    ["勉強しようと思う", "I think I'll study"],
    ["始めようと思う", "I think I'll start"],
    ["やめようと思う", "I think I'll quit"]
  ],
  vocab: [
    ["思う", "おもう", "to think"],
    ["計画", "けいかく", "plan"],
    ["予定", "よてい", "schedule"],
    ["目標", "もくひょう", "goal"],
    ["将来", "しょうらい", "future"]
  ],
  grammar: {
    pattern: "〜ようと思う / 〜ようと思っている",
    meaning: "I think I'll ~ / I'm thinking of ~ing",
    example_jp: "来年、日本に行こうと思っています。",
    example_en: "I'm thinking of going to Japan next year."
  },
  practice: "Write 5 intentions with ようと思う and 5 ongoing plans with ようと思っている.",
  tip: "ようと思う = just decided. ようと思っている = have been planning for a while. The ている adds duration."
});

curriculum.push({
  day: 488,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional + とする: Attempting to Do",
  intro: "よう＋とする means 'try to do' or 'be about to do.' It implies effort or imminence.",
  type: "verbs",
  chars: [
    ["食べようとする", "try to eat"],
    ["逃げようとする", "try to escape"],
    ["立ち上がろうとする", "try to stand up"],
    ["ドアを開けようとした", "tried to open the door"],
    ["眠ろうとしたが", "tried to sleep but"]
  ],
  vocab: [
    ["努力", "どりょく", "effort"],
    ["試す", "ためす", "to try"],
    ["挑戦", "ちょうせん", "challenge"],
    ["失敗", "しっぱい", "failure"],
    ["成功", "せいこう", "success"]
  ],
  grammar: {
    pattern: "〜ようとする",
    meaning: "Try to ~ / Be about to ~",
    example_jp: "ドアを開けようとしたが、鍵がかかっていた。",
    example_en: "I tried to open the door, but it was locked."
  },
  practice: "Write 5 sentences about failed attempts using ようとしたが and 5 about succeeding using ようとして.",
  tip: "ようとする emphasizes the attempt, not the result. It often pairs with が (but) to show the attempt failed."
});

curriculum.push({
  day: 489,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "ましょうか: Offering Help",
  intro: "ましょうか turns a polite volitional into an offer: 'Shall I do ~?' Very useful for polite interactions.",
  type: "verbs",
  chars: [
    ["手伝いましょうか", "shall I help?"],
    ["持ちましょうか", "shall I carry it?"],
    ["開けましょうか", "shall I open it?"],
    ["説明しましょうか", "shall I explain?"],
    ["案内しましょうか", "shall I guide you?"]
  ],
  vocab: [
    ["手伝う", "てつだう", "to help"],
    ["持つ", "もつ", "to hold/carry"],
    ["案内する", "あんないする", "to guide"],
    ["説明する", "せつめいする", "to explain"],
    ["紹介する", "しょうかいする", "to introduce"]
  ],
  grammar: {
    pattern: "〜ましょうか",
    meaning: "Shall I ~? (offering help)",
    example_jp: "重そうですね。持ちましょうか。",
    example_en: "That looks heavy. Shall I carry it?"
  },
  practice: "Write 5 offers of help using ましょうか in different situations (office, shop, station, home, street).",
  tip: "ましょうか is one of the most useful polite expressions. Japanese people use it constantly to show consideration."
});

curriculum.push({
  day: 490,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 70,
  title: "Volitional Form: Practice Day",
  intro: "Review all volitional uses: invitations (よう), intentions (ようと思う), attempts (ようとする), offers (ましょうか).",
  type: "verbs",
  chars: [
    ["行こう", "let's go"],
    ["行こうと思う", "I think I'll go"],
    ["行こうとした", "tried to go"],
    ["行きましょうか", "shall I go?"],
    ["行きましょう", "let's go (polite)"]
  ],
  vocab: [
    ["一緒に", "いっしょに", "together"],
    ["そろそろ", "そろそろ", "soon/about time"],
    ["ぜひ", "ぜひ", "by all means"],
    ["よかったら", "よかったら", "if you'd like"],
    ["どうぞ", "どうぞ", "please (go ahead)"]
  ],
  grammar: {
    pattern: "Volitional form comprehensive review",
    meaning: "All volitional patterns",
    example_jp: "よかったら、一緒に食べに行きましょう。",
    example_en: "If you'd like, let's go eat together."
  },
  practice: "Write a conversation between two friends making weekend plans using all volitional patterns.",
  tip: "Volitional is your go-to for suggesting and planning. Master it and your Japanese sounds much more natural."
});

curriculum.push({
  day: 491,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Potential Form Review + New N4 Verbs",
  intro: "Quick review of potential form (can do) with new N4-level verbs.",
  type: "verbs",
  chars: [
    ["届ける→届けられる", "can deliver"],
    ["届く→届く", "can reach (intransitive)"],
    ["伝える→伝えられる", "can convey"],
    ["受ける→受けられる", "can receive"],
    ["決める→決められる", "can decide"]
  ],
  vocab: [
    ["届ける", "とどける", "to deliver"],
    ["届く", "とどく", "to reach/arrive"],
    ["伝える", "つたえる", "to convey/tell"],
    ["受ける", "うける", "to receive/take"],
    ["決める", "きめる", "to decide"]
  ],
  grammar: {
    pattern: "Potential form review",
    meaning: "Expressing ability with new N4 verbs",
    example_jp: "日本語でメッセージを伝えられるようになった。",
    example_en: "I've become able to convey messages in Japanese."
  },
  practice: "Write 5 things you can now do in Japanese using potential form + ようになった.",
  tip: "Potential + ようになった (have become able to) is a powerful pattern for expressing growth and progress."
});

curriculum.push({
  day: 492,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Transitive/Intransitive Pairs 1: 開く/開ける, 閉まる/閉める",
  intro: "Japanese has pairs of verbs where one is transitive (someone does it) and one is intransitive (it happens).",
  type: "verbs",
  chars: [
    ["ドアが開く", "door opens (by itself)"],
    ["ドアを開ける", "open the door"],
    ["窓が閉まる", "window closes"],
    ["窓を閉める", "close the window"],
    ["電気がつく", "light turns on"]
  ],
  vocab: [
    ["開く", "あく", "to open (intransitive)"],
    ["開ける", "あける", "to open (transitive)"],
    ["閉まる", "しまる", "to close (intransitive)"],
    ["閉める", "しめる", "to close (transitive)"],
    ["つく", "つく", "to turn on (intransitive)"]
  ],
  grammar: {
    pattern: "Intransitive (〜が) vs Transitive (〜を)",
    meaning: "Something happens vs Someone does it",
    example_jp: "風でドアが開いた。/ 私がドアを開けた。",
    example_en: "The door opened from the wind. / I opened the door."
  },
  practice: "For each pair, write one intransitive sentence (it happened) and one transitive sentence (I did it).",
  tip: "Key pattern: intransitive uses が, transitive uses を. If it happens by itself → intransitive. If someone does it → transitive."
});

curriculum.push({
  day: 493,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Transitive/Intransitive Pairs 2: 集まる/集める, 決まる/決める",
  intro: "More important verb pairs. Notice the pattern: -ある is often intransitive, -える is often transitive.",
  type: "verbs",
  chars: [
    ["人が集まる", "people gather"],
    ["人を集める", "gather people"],
    ["日が決まる", "date is decided"],
    ["日を決める", "decide the date"],
    ["値段が下がる", "price drops"]
  ],
  vocab: [
    ["集まる", "あつまる", "to gather (intransitive)"],
    ["集める", "あつめる", "to collect (transitive)"],
    ["決まる", "きまる", "to be decided (intransitive)"],
    ["決める", "きめる", "to decide (transitive)"],
    ["下がる", "さがる", "to go down (intransitive)"]
  ],
  grammar: {
    pattern: "〜まる/〜める pairs",
    meaning: "Intransitive -aru / Transitive -eru pattern",
    example_jp: "会議の日が決まった。/ 会議の日を決めた。",
    example_en: "The meeting date was decided. / I decided the meeting date."
  },
  practice: "Write pairs of sentences for: 始まる/始める, 見つかる/見つける, 変わる/変える.",
  tip: "The -aru/-eru pattern covers many pairs: 決まる/決める, 集まる/集める, 始まる/始める, 変わる/変える."
});

curriculum.push({
  day: 494,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Transitive/Intransitive Pairs 3: 変わる/変える, 見つかる/見つける",
  intro: "More pairs with the same -aru/-eru pattern, plus some irregular pairs.",
  type: "verbs",
  chars: [
    ["季節が変わる", "season changes"],
    ["髪型を変える", "change hairstyle"],
    ["鍵が見つかる", "key is found"],
    ["犯人を見つける", "find the criminal"],
    ["仕事が増える", "work increases"]
  ],
  vocab: [
    ["変わる", "かわる", "to change (intransitive)"],
    ["変える", "かえる", "to change (transitive)"],
    ["見つかる", "みつかる", "to be found (intransitive)"],
    ["見つける", "みつける", "to find (transitive)"],
    ["増える", "ふえる", "to increase (intransitive)"]
  ],
  grammar: {
    pattern: "More transitive/intransitive pairs",
    meaning: "Expanding verb pair vocabulary",
    example_jp: "財布がやっと見つかった！",
    example_en: "My wallet was finally found!"
  },
  practice: "Write a short story using at least 5 transitive/intransitive pairs naturally.",
  tip: "When describing results or states, Japanese prefers intransitive: 窓が開いている (window is open) rather than 窓を開けてある."
});

curriculum.push({
  day: 495,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Compound Verbs 1: 持っていく, 持ってくる",
  intro: "Compound verbs combine two verbs. て-form + いく/くる express movement away/toward.",
  type: "verbs",
  chars: [
    ["持っていく", "take (away)"],
    ["持ってくる", "bring (here)"],
    ["連れていく", "take someone along"],
    ["連れてくる", "bring someone"],
    ["送っていく", "see someone off"]
  ],
  vocab: [
    ["持っていく", "もっていく", "to take along"],
    ["持ってくる", "もってくる", "to bring"],
    ["連れていく", "つれていく", "to take (a person)"],
    ["連れてくる", "つれてくる", "to bring (a person)"],
    ["送っていく", "おくっていく", "to see off / escort"]
  ],
  grammar: {
    pattern: "〜ていく / 〜てくる",
    meaning: "Going/coming while doing ~ (compound direction)",
    example_jp: "パーティーにケーキを持っていきます。",
    example_en: "I will bring a cake to the party."
  },
  practice: "Write 5 sentences with ていく (moving away) and 5 with てくる (moving toward).",
  tip: "Think of it as direction: ていく = verb + go away. てくる = verb + come here. 持っていく = hold + go = take."
});

curriculum.push({
  day: 496,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Compound Verbs 2: 取り出す, 飛び出す, 走り出す",
  intro: "〜出す compounds express 'starting to' or 'bursting out.' They add sudden or dramatic action.",
  type: "verbs",
  chars: [
    ["取り出す", "take out"],
    ["飛び出す", "jump out"],
    ["走り出す", "start running"],
    ["泣き出す", "burst into tears"],
    ["笑い出す", "burst out laughing"]
  ],
  vocab: [
    ["取り出す", "とりだす", "to take out"],
    ["飛び出す", "とびだす", "to jump/fly out"],
    ["走り出す", "はしりだす", "to start running"],
    ["泣き出す", "なきだす", "to burst into tears"],
    ["降り出す", "ふりだす", "to start raining"]
  ],
  grammar: {
    pattern: "〜出す (compound verb: start/burst out)",
    meaning: "Start doing ~ suddenly",
    example_jp: "子どもが急に泣き出した。",
    example_en: "The child suddenly burst into tears."
  },
  practice: "Write 5 sentences about sudden events using 〜出す compounds.",
  tip: "〜出す has two meanings: physically taking out (取り出す) and suddenly starting (泣き出す). Context makes it clear."
});

curriculum.push({
  day: 497,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 71,
  title: "Compound Verbs 3: 思い出す, 申し込む",
  intro: "More compound verbs common at N4 level. These function as single vocabulary items.",
  type: "verbs",
  chars: [
    ["思い出す", "remember/recall"],
    ["申し込む", "apply for"],
    ["打ち合わせる", "meet/discuss"],
    ["間に合う", "be in time"],
    ["片付ける", "tidy up"]
  ],
  vocab: [
    ["思い出す", "おもいだす", "to remember/recall"],
    ["申し込む", "もうしこむ", "to apply for"],
    ["間に合う", "まにあう", "to be in time"],
    ["片付ける", "かたづける", "to tidy up"],
    ["引っ越す", "ひっこす", "to move house"]
  ],
  grammar: {
    pattern: "Common N4 compound verbs",
    meaning: "Multi-verb compounds used as vocabulary",
    example_jp: "締め切りに間に合わなかった。",
    example_en: "I didn't make it in time for the deadline."
  },
  practice: "Use each compound verb in a sentence. Try to use them in a short diary entry about your week.",
  tip: "Compound verbs are a huge part of intermediate Japanese. Learning them greatly expands your vocabulary."
});

curriculum.push({
  day: 498,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 72,
  title: "Verb Conjugation Review: All Forms",
  intro: "Comprehensive review of all verb forms learned: causative, passive, causative-passive, conditional, and volitional.",
  type: "verbs",
  chars: [
    ["食べさせる", "make eat (causative)"],
    ["食べられる", "be eaten (passive)"],
    ["食べさせられる", "be made to eat"],
    ["食べれば", "if eat (conditional)"],
    ["食べよう", "let's eat (volitional)"]
  ],
  vocab: [
    ["活用", "かつよう", "conjugation"],
    ["形", "かたち", "form/shape"],
    ["動詞", "どうし", "verb"],
    ["変換", "へんかん", "conversion"],
    ["暗記", "あんき", "memorization"]
  ],
  grammar: {
    pattern: "All conjugation forms review",
    meaning: "Complete verb form overview",
    example_jp: "日本語の動詞の活用をしっかり復習しよう。",
    example_en: "Let's thoroughly review Japanese verb conjugations."
  },
  practice: "Create a full conjugation chart for 5 verbs (one RU, one U, する, くる, and one compound).",
  tip: "Make a wall chart with all conjugation forms. Visual reference helps enormously during review."
});

curriculum.push({
  day: 499,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 72,
  title: "N4 Verb Pairs and Compounds Review",
  intro: "Review all transitive/intransitive pairs and compound verbs from this phase.",
  type: "verbs",
  chars: [
    ["開く↔開ける", "open (intr/tr)"],
    ["閉まる↔閉める", "close (intr/tr)"],
    ["持っていく", "take along"],
    ["思い出す", "recall"],
    ["間に合う", "be in time"]
  ],
  vocab: [
    ["対", "つい", "pair/opposite"],
    ["組み合わせ", "くみあわせ", "combination"],
    ["自動詞", "じどうし", "intransitive verb"],
    ["他動詞", "たどうし", "transitive verb"],
    ["複合動詞", "ふくごうどうし", "compound verb"]
  ],
  grammar: {
    pattern: "Verb pairs and compounds review",
    meaning: "Transitive/intransitive and compound verbs",
    example_jp: "ドアが開いた。→ ドアを開けた。（自動詞↔他動詞）",
    example_en: "The door opened. → I opened the door. (intransitive ↔ transitive)"
  },
  practice: "Write a conversation using at least 3 verb pairs and 3 compound verbs naturally.",
  tip: "Verb pairs test your understanding of who is doing the action. Compounds test vocabulary. Both are N4 essentials."
});

curriculum.push({
  day: 500,
  phaseNum: 11,
  phaseName: "N4 Verbs",
  week: 72,
  title: "Comprehensive N4 Verb Test Prep",
  intro: "Final verb phase review covering everything from causative to compound verbs. Test yourself!",
  type: "verbs",
  chars: [
    ["させる/される/させられる", "causative/passive/caus-pass"],
    ["ば/たら/なら/と", "four conditionals"],
    ["よう/ようと思う", "volitional/intention"],
    ["持っていく/持ってくる", "take/bring"],
    ["開く/開ける", "open (intr/tr)"]
  ],
  vocab: [
    ["完了", "かんりょう", "completion"],
    ["達成", "たっせい", "achievement"],
    ["自信", "じしん", "confidence"],
    ["実力", "じつりょく", "true ability"],
    ["合格", "ごうかく", "passing (exam)"]
  ],
  grammar: {
    pattern: "N4 verb comprehensive review",
    meaning: "All N4 verb patterns in one lesson",
    example_jp: "N4の動詞の勉強が終わった。自信を持って次に進もう。",
    example_en: "N4 verb study is complete. Let's move forward with confidence."
  },
  practice: "Take a practice test: conjugate 20 random verbs into all forms. Score yourself and review any mistakes.",
  tip: "Congratulations on completing the N4 Verbs phase! You now command the most important verb forms for intermediate Japanese."
});