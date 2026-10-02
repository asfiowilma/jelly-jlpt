"use strict";



// Phase 17: N3 Verbs & Adjectives (Days 771–820, 50 days)
// Topics: transitive/intransitive pairs, compound verbs, potential form,
// passive form, causative form, i-adjectives, na-adjectives,
// adverbs from adjectives, verb+noun collocations, mixed review

// ===== Days 771–775: Transitive / Intransitive Verb Pairs =====

curriculum.push({
  day: 771,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(771 / 7),
  title: "Transitive & Intransitive Pairs: Raise / Rise",
  intro: "Transitive verbs take a direct object marked with を, while intransitive verbs describe something happening on its own with が. Mastering these pairs is essential for natural Japanese.",
  type: "verbs",
  chars: [],
  vocab: [
    ["上げる", "あげる", "to raise (something)"],
    ["上がる", "あがる", "to rise / go up"],
    ["下げる", "さげる", "to lower (something)"],
    ["下がる", "さがる", "to go down / fall"],
    ["片付ける", "かたづける", "to tidy up / put away"]
  ],
  grammar: {
    pattern: "〜を + transitive verb / 〜が + intransitive verb",
    meaning: "Transitive verbs act on an object; intransitive verbs describe a change of state",
    example_jp: "先生が手を上げた。気温が上がった。",
    example_en: "The teacher raised a hand. The temperature rose."
  },
  practice: "Write five sentences using 上げる with を and five using 上がる with が. Pay attention to which particle marks the subject vs. the object.",
  tip: "A useful rule of thumb: verbs ending in -eru are often transitive, and verbs ending in -aru are often intransitive."
});

curriculum.push({
  day: 772,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(772 / 7),
  title: "Transitive & Intransitive Pairs: Start / Begin",
  intro: "Starting something vs. something starting on its own. This pair appears constantly in daily conversation and writing.",
  type: "verbs",
  chars: [],
  vocab: [
    ["始める", "はじめる", "to start (something)"],
    ["始まる", "はじまる", "to begin (by itself)"],
    ["終える", "おえる", "to finish (something)"],
    ["終わる", "おわる", "to end (by itself)"],
    ["続ける", "つづける", "to continue (something)"]
  ],
  grammar: {
    pattern: "〜を始める / 〜が始まる",
    meaning: "To start something deliberately vs. something begins on its own",
    example_jp: "先生が授業を始めた。映画が始まった。",
    example_en: "The teacher started the class. The movie began."
  },
  practice: "Write pairs of sentences: one where a person starts something (始める) and one where an event begins on its own (始まる).",
  tip: "始める can also attach to a verb stem to mean to begin doing: 食べ始める (to start eating)."
});

curriculum.push({
  day: 773,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(773 / 7),
  title: "Transitive & Intransitive Pairs: Collect / Gather",
  intro: "Gathering things vs. things gathering together. This pair is very common in daily life and news reports.",
  type: "verbs",
  chars: [],
  vocab: [
    ["集める", "あつめる", "to collect / gather (something)"],
    ["集まる", "あつまる", "to gather / assemble"],
    ["決める", "きめる", "to decide (something)"],
    ["決まる", "きまる", "to be decided / settled"],
    ["届ける", "とどける", "to deliver / report"]
  ],
  grammar: {
    pattern: "〜を集める / 〜が集まる",
    meaning: "To collect something vs. things gather on their own",
    example_jp: "彼は情報を集めている。駅前に人が集まった。",
    example_en: "He is gathering information. People gathered in front of the station."
  },
  practice: "Use 集める to describe collecting hobbies and 集まる to describe groups assembling for events. Then do the same for 決める and 決まる.",
  tip: "集める is also used figuratively: 注目を集める (to attract attention)."
});

curriculum.push({
  day: 774,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(774 / 7),
  title: "Transitive & Intransitive Pairs: Change / Break",
  intro: "Changing something vs. something changing, and breaking something vs. something breaking. Two essential pairs for describing transformation and damage.",
  type: "verbs",
  chars: [],
  vocab: [
    ["変える", "かえる", "to change (something)"],
    ["変わる", "かわる", "to change (by itself)"],
    ["壊す", "こわす", "to break / destroy (something)"],
    ["壊れる", "こわれる", "to break / be broken"],
    ["直す", "なおす", "to fix / repair"]
  ],
  grammar: {
    pattern: "〜を変える / 〜が変わる",
    meaning: "To change something deliberately vs. something changes on its own",
    example_jp: "髪の色を変えた。町の景色が変わった。",
    example_en: "I changed my hair colour. The scenery of the town has changed."
  },
  practice: "Describe three things you can actively change (変える) and three things that change naturally (変わる). Then practise with 壊す and 壊れる.",
  tip: "In Japanese, saying パソコンが壊れた (the computer broke) is neutral and avoids blaming anyone, unlike 壊した (someone broke it)."
});

curriculum.push({
  day: 775,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(775 / 7),
  title: "Transitive & Intransitive Pairs: Open / Close and Attach",
  intro: "Review day for transitive/intransitive pairs. We add opening, closing, and attaching pairs to round out the set.",
  type: "verbs",
  chars: [],
  vocab: [
    ["開ける", "あける", "to open (something)"],
    ["開く", "あく", "to open (by itself)"],
    ["閉める", "しめる", "to close (something)"],
    ["閉まる", "しまる", "to close (by itself)"],
    ["付ける", "つける", "to attach / turn on"]
  ],
  grammar: {
    pattern: "〜を開ける・閉める / 〜が開く・閉まる",
    meaning: "Open or close something vs. something opens or closes on its own",
    example_jp: "窓を開けてください。ドアが自動的に閉まった。",
    example_en: "Please open the window. The door closed automatically."
  },
  practice: "Write sentences about automatic doors using 開く and 閉まる, then about manually operating doors using 開ける and 閉める.",
  tip: "When in doubt, ask: did someone do this to something? If yes, use the transitive verb with を. If not, use the intransitive verb with が."
});

// ===== Days 776–780: Compound Verbs =====

curriculum.push({
  day: 776,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(776 / 7),
  title: "Compound Verbs with 出す: Sudden Actions",
  intro: "Compound verbs combine two verbs to create a new meaning. The suffix 出す can mean to start suddenly or to do outward.",
  type: "verbs",
  chars: [],
  vocab: [
    ["思い出す", "おもいだす", "to remember / recall"],
    ["飛び出す", "とびだす", "to jump out / rush out"],
    ["走り出す", "はしりだす", "to break into a run"],
    ["泣き出す", "なきだす", "to burst into tears"],
    ["笑い出す", "わらいだす", "to burst out laughing"]
  ],
  grammar: {
    pattern: "Verb stem + 出す = to suddenly begin doing / to do outward",
    meaning: "Adding 出す to a verb stem creates a compound meaning sudden start or outward motion",
    example_jp: "子供が急に泣き出した。昔のことを思い出した。",
    example_en: "The child suddenly burst into tears. I recalled things from the past."
  },
  practice: "Describe five surprising moments where someone suddenly started doing something. Use 急に (suddenly) for emphasis.",
  tip: "Compare: 思い出す (to recall, pulling a memory out) vs. 泣き出す (to burst into tears, tears coming out). The nuance of 出す shifts by context."
});

curriculum.push({
  day: 777,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(777 / 7),
  title: "Compound Verbs with 合う: Mutual Actions",
  intro: "Compounds ending in 合う express mutual or reciprocal action, meaning doing something together or to each other.",
  type: "verbs",
  chars: [],
  vocab: [
    ["話し合う", "はなしあう", "to discuss / talk together"],
    ["助け合う", "たすけあう", "to help each other"],
    ["知り合う", "しりあう", "to get to know each other"],
    ["見つめ合う", "みつめあう", "to gaze at each other"],
    ["間に合う", "まにあう", "to be in time / make it"]
  ],
  grammar: {
    pattern: "Verb stem + 合う = to do something together or mutually",
    meaning: "Adding 合う creates a reciprocal or cooperative meaning",
    example_jp: "家族で旅行について話し合った。電車に間に合った。",
    example_en: "We discussed the trip as a family. I made it in time for the train."
  },
  practice: "Create sentences for each 合う compound. Think of situations where people cooperate or interact mutually.",
  tip: "知り合い (acquaintance) comes from 知り合う. Many 合う compounds have useful noun forms."
});

curriculum.push({
  day: 778,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(778 / 7),
  title: "Compound Verbs with 込む: Inward or Thorough Actions",
  intro: "Compounds with 込む imply going inward, deeply, or doing something thoroughly. These are very common in everyday Japanese.",
  type: "verbs",
  chars: [],
  vocab: [
    ["申し込む", "もうしこむ", "to apply / sign up"],
    ["飛び込む", "とびこむ", "to jump in / dive in"],
    ["考え込む", "かんがえこむ", "to think deeply / brood"],
    ["詰め込む", "つめこむ", "to cram / stuff in"],
    ["思い込む", "おもいこむ", "to be convinced / assume"]
  ],
  grammar: {
    pattern: "Verb stem + 込む = to do inward or deeply or thoroughly",
    meaning: "Adding 込む implies going inward, deeply, or doing something to completion",
    example_jp: "コンテストに申し込んだ。彼は一人で考え込んでいた。",
    example_en: "I applied for the contest. He was deep in thought by himself."
  },
  practice: "Write sentences about applying for events (申し込む), thinking deeply (考え込む), and cramming for exams (詰め込む).",
  tip: "申し込み (application) is the noun form of 申し込む. You will see this on many Japanese forms and websites."
});

curriculum.push({
  day: 779,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(779 / 7),
  title: "Compound Verbs with 取る and 引く",
  intro: "Compounds built on 取る (to take) and 引く (to pull) cover a wide range of meanings from cancelling to moving house.",
  type: "verbs",
  chars: [],
  vocab: [
    ["取り消す", "とりけす", "to cancel / revoke"],
    ["取り替える", "とりかえる", "to replace / exchange"],
    ["受け取る", "うけとる", "to receive / accept"],
    ["引き受ける", "ひきうける", "to undertake / accept (a task)"],
    ["引っ越す", "ひっこす", "to move (to a new home)"]
  ],
  grammar: {
    pattern: "取り + Verb / 引き + Verb = compound verbs for handling and pulling",
    meaning: "取り compounds extend the idea of taking; 引き compounds extend pulling",
    example_jp: "予約を取り消したいのですが。その仕事を引き受けた。",
    example_en: "I would like to cancel my reservation. I took on that job."
  },
  practice: "Use 取り消す in polite request sentences. Describe receiving packages with 受け取る. Talk about moving house with 引っ越す.",
  tip: "取り消し (cancellation) and 引っ越し (moving house) are the noun forms. These appear frequently in daily life."
});

curriculum.push({
  day: 780,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(780 / 7),
  title: "Compound Verbs: Mixed Review",
  intro: "Review all compound verb patterns learned this week. Focus on identifying which suffix (出す, 合う, 込む) changes the meaning and how.",
  type: "verbs",
  chars: [],
  vocab: [
    ["繰り返す", "くりかえす", "to repeat"],
    ["振り返る", "ふりかえる", "to look back / reflect"],
    ["乗り換える", "のりかえる", "to transfer (trains)"],
    ["打ち合わせる", "うちあわせる", "to arrange / have a meeting"],
    ["出来上がる", "できあがる", "to be completed / finished"]
  ],
  grammar: {
    pattern: "Compound verb patterns review: stem + 出す / 合う / 込む / 返す",
    meaning: "Each compound suffix modifies the base verb in a characteristic way",
    example_jp: "同じミスを繰り返さないでください。新宿で乗り換えてください。",
    example_en: "Please do not repeat the same mistake. Please transfer at Shinjuku."
  },
  practice: "Categorise all compound verbs from this week by their suffix. Write one new sentence for each verb from memory.",
  tip: "打ち合わせ (meeting) is one of the most common business Japanese words. It sounds more collaborative than 会議 (conference)."
});

// ===== Days 781–785: Potential Form Verbs =====

curriculum.push({
  day: 781,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(781 / 7),
  title: "Potential Form: Group 1 U-verbs",
  intro: "The potential form expresses ability: can do. For Group 1 verbs, change the final -u sound to -eru. Today we drill this conjugation with N3 verbs.",
  type: "verbs",
  chars: [],
  vocab: [
    ["読める", "よめる", "can read (potential of 読む)"],
    ["書ける", "かける", "can write (potential of 書く)"],
    ["話せる", "はなせる", "can speak (potential of 話す)"],
    ["泳げる", "およげる", "can swim (potential of 泳ぐ)"],
    ["運べる", "はこべる", "can carry (potential of 運ぶ)"]
  ],
  grammar: {
    pattern: "Group 1: change -u ending to -eru (e.g., 読む to 読める)",
    meaning: "Potential form for U-verbs: change the final vowel from u-column to e-column plus る",
    example_jp: "日本語の新聞が読めるようになりたい。",
    example_en: "I want to become able to read Japanese newspapers."
  },
  practice: "Conjugate these Group 1 verbs into potential form: 飲む, 遊ぶ, 待つ, 作る, 歩く. Then use each in a sentence.",
  tip: "Potential verbs behave like Group 2 ru-verbs for further conjugation: 読める becomes 読めます, 読めない, 読めた."
});

curriculum.push({
  day: 782,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(782 / 7),
  title: "Potential Form: Group 2 RU-verbs and Irregulars",
  intro: "Group 2 verbs drop る and add られる. The irregular verbs する and くる have special potential forms: できる and 来られる.",
  type: "verbs",
  chars: [],
  vocab: [
    ["食べられる", "たべられる", "can eat (potential of 食べる)"],
    ["見られる", "みられる", "can see (potential of 見る)"],
    ["できる", "できる", "can do (potential of する)"],
    ["来られる", "こられる", "can come (potential of 来る)"],
    ["調べられる", "しらべられる", "can investigate (potential of 調べる)"]
  ],
  grammar: {
    pattern: "Group 2: drop る, add られる / する becomes できる / 来る becomes 来られる",
    meaning: "Potential form for RU-verbs and irregular verbs",
    example_jp: "この店では新鮮な魚が食べられる。",
    example_en: "You can eat fresh fish at this restaurant."
  },
  practice: "Conjugate: 起きる, 考える, 答える, 覚える into potential form. Write sentences about things you can and cannot do.",
  tip: "In casual speech, 食べられる is often shortened to 食べれる (ら抜き言葉). This is common but considered informal."
});

curriculum.push({
  day: 783,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(783 / 7),
  title: "Potential Form: Expressing Ability and Possibility",
  intro: "The potential form is not just about ability. It also expresses possibility and permission in context. Today we explore these nuances.",
  type: "verbs",
  chars: [],
  vocab: [
    ["信じられる", "しんじられる", "can believe / unbelievable"],
    ["触れる", "ふれる", "can touch / to touch"],
    ["参加できる", "さんかできる", "can participate"],
    ["利用できる", "りようできる", "can use / is available"],
    ["予約できる", "よやくできる", "can reserve / book"]
  ],
  grammar: {
    pattern: "Potential form for possibility: 〜ことができる (formal equivalent)",
    meaning: "The potential form and 〜ことができる both express ability, but the latter is more formal",
    example_jp: "インターネットで予約できる。信じられない話だ。",
    example_en: "You can make a reservation online. It is an unbelievable story."
  },
  practice: "Write about five things that are possible at your workplace or school using potential forms. Try both casual and formal versions.",
  tip: "信じられない (unbelievable) is a very common everyday expression used for both good and bad surprises."
});

curriculum.push({
  day: 784,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(784 / 7),
  title: "Potential Form: Describing Skills and Talents",
  intro: "Use potential forms to talk about what you and others are capable of. This is essential for self-introductions and describing others.",
  type: "verbs",
  chars: [],
  vocab: [
    ["弾ける", "ひける", "can play (an instrument)"],
    ["描ける", "えがける", "can draw / paint"],
    ["喋れる", "しゃべれる", "can chat / speak (casual)"],
    ["解ける", "とける", "can solve (a problem)"],
    ["耐えられる", "たえられる", "can endure / withstand"]
  ],
  grammar: {
    pattern: "〜ようになる = to become able to do (change over time)",
    meaning: "Potential form plus ようになる expresses gaining a new ability",
    example_jp: "練習して、ピアノが弾けるようになった。",
    example_en: "I practised and became able to play the piano."
  },
  practice: "Describe abilities you have gained over time using 〜ようになった. Also describe abilities you want to gain using 〜ようになりたい.",
  tip: "弾ける covers string and keyboard instruments. For wind instruments, 吹ける (ふける, can blow/play) is more natural."
});

curriculum.push({
  day: 785,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(785 / 7),
  title: "Potential Form: Review and Natural Usage",
  intro: "Review day for potential forms. Focus on using them naturally in conversation and avoiding common mistakes with particles.",
  type: "verbs",
  chars: [],
  vocab: [
    ["見える", "みえる", "can see / is visible (spontaneous)"],
    ["聞こえる", "きこえる", "can hear / is audible (spontaneous)"],
    ["分かる", "わかる", "to understand / can understand"],
    ["通じる", "つうじる", "to be understood / get through"],
    ["間に合える", "まにあえる", "can make it in time"]
  ],
  grammar: {
    pattern: "見える / 聞こえる vs. 見られる / 聞ける",
    meaning: "Spontaneous perception (見える, 聞こえる) vs. deliberate ability (見られる, 聞ける)",
    example_jp: "ここから富士山が見える。映画が見られる時間はありますか。",
    example_en: "You can see Mt. Fuji from here. Do you have time when you can watch a movie?"
  },
  practice: "Write five sentences with 見える/聞こえる (what naturally comes into view or earshot) and five with 見られる/聞ける (deliberate viewing or listening).",
  tip: "見える and 聞こえる are not potential forms but independent verbs describing spontaneous perception. This is a key distinction at N3."
});

// ===== Days 786–790: Passive Form Verbs =====

curriculum.push({
  day: 786,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(786 / 7),
  title: "Passive Form: Group 1 U-verbs",
  intro: "The passive voice in Japanese expresses that something is done to the subject. For Group 1 verbs, change -u to -areru.",
  type: "verbs",
  chars: [],
  vocab: [
    ["読まれる", "よまれる", "to be read (passive of 読む)"],
    ["呼ばれる", "よばれる", "to be called (passive of 呼ぶ)"],
    ["盗まれる", "ぬすまれる", "to be stolen (passive of 盗む)"],
    ["踏まれる", "ふまれる", "to be stepped on (passive of 踏む)"],
    ["言われる", "いわれる", "to be told / said (passive of 言う)"]
  ],
  grammar: {
    pattern: "Group 1: change -u ending to -areru (e.g., 読む to 読まれる)",
    meaning: "Passive form for U-verbs: change the final vowel to a-column plus れる",
    example_jp: "電車の中で足を踏まれた。先生に名前を呼ばれた。",
    example_en: "My foot was stepped on in the train. I was called by name by the teacher."
  },
  practice: "Conjugate into passive form: 取る, 叩く, 笑う, 怒る, 殴る. Write sentences where you were affected by someone else.",
  tip: "Japanese passive often expresses that the subject was negatively affected. This is called the suffering passive (迷惑の受身)."
});

curriculum.push({
  day: 787,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(787 / 7),
  title: "Passive Form: Group 2 and Irregular Verbs",
  intro: "Group 2 passive: drop る and add られる. Irregular: する becomes される, 来る becomes 来られる. Today also introduces the suffering passive.",
  type: "verbs",
  chars: [],
  vocab: [
    ["褒められる", "ほめられる", "to be praised (passive of 褒める)"],
    ["叱られる", "しかられる", "to be scolded (passive of 叱る)"],
    ["される", "される", "to be done (passive of する)"],
    ["招待される", "しょうたいされる", "to be invited"],
    ["紹介される", "しょうかいされる", "to be introduced"]
  ],
  grammar: {
    pattern: "Group 2: drop る, add られる / する becomes される / 来る becomes 来られる",
    meaning: "Passive form for RU-verbs and irregular verbs",
    example_jp: "先生に褒められて嬉しかった。パーティーに招待された。",
    example_en: "I was happy to be praised by the teacher. I was invited to a party."
  },
  practice: "Write three positive passive sentences (being praised, invited, helped) and three negative ones (being scolded, criticised, ignored).",
  tip: "食べられる is both potential (can eat) and passive (to be eaten). Context makes the meaning clear."
});

curriculum.push({
  day: 788,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(788 / 7),
  title: "Passive Form: The Suffering Passive",
  intro: "The indirect or suffering passive is unique to Japanese. It expresses that the subject is adversely affected by an action, even an intransitive one.",
  type: "verbs",
  chars: [],
  vocab: [
    ["降られる", "ふられる", "to be rained on (suffering passive)"],
    ["泣かれる", "なかれる", "to have someone cry on you"],
    ["死なれる", "しなれる", "to suffer from someone dying"],
    ["逃げられる", "にげられる", "to have someone run away"],
    ["笑われる", "わらわれる", "to be laughed at"]
  ],
  grammar: {
    pattern: "〜に + passive = adversely affected by someone or something",
    meaning: "The indirect passive expresses that the subject is negatively impacted by an event",
    example_jp: "雨に降られて、びしょ濡れになった。隣の人に騒がれて眠れなかった。",
    example_en: "I got caught in the rain and got soaked. The person next to me was noisy and I could not sleep."
  },
  practice: "Write five suffering passive sentences about unfortunate events such as being rained on, having someone eat your food, or a pet running away.",
  tip: "Even intransitive verbs like 泣く (to cry) and 死ぬ (to die) can be used in the suffering passive to show the speaker was negatively affected."
});

curriculum.push({
  day: 789,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(789 / 7),
  title: "Passive Form in Formal Writing and News",
  intro: "Passive voice is heavily used in formal Japanese writing, news reports, and academic texts. Today we practise reading and writing passive sentences in these contexts.",
  type: "verbs",
  chars: [],
  vocab: [
    ["行われる", "おこなわれる", "to be held / carried out"],
    ["発表される", "はっぴょうされる", "to be announced"],
    ["建てられる", "たてられる", "to be built"],
    ["選ばれる", "えらばれる", "to be chosen / elected"],
    ["認められる", "みとめられる", "to be recognised / acknowledged"]
  ],
  grammar: {
    pattern: "Passive in formal and written contexts (agent often omitted)",
    meaning: "Passive voice for objective, formal descriptions where the doer is unimportant or unknown",
    example_jp: "来月、東京で国際会議が行われる。新しい法律が発表された。",
    example_en: "An international conference will be held in Tokyo next month. A new law was announced."
  },
  practice: "Rewrite five active sentences into passive: e.g., 政府が計画を発表した becomes 計画が発表された.",
  tip: "In news Japanese, passive describes events objectively without specifying who did it, similar to English news style."
});

curriculum.push({
  day: 790,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(790 / 7),
  title: "Passive Form: Review and Practice",
  intro: "Review all passive patterns: direct passive, suffering passive, and formal passive. Practice identifying and using each type correctly.",
  type: "verbs",
  chars: [],
  vocab: [
    ["求められる", "もとめられる", "to be required / sought"],
    ["注目される", "ちゅうもくされる", "to be noticed / attract attention"],
    ["尊敬される", "そんけいされる", "to be respected"],
    ["影響される", "えいきょうされる", "to be influenced"],
    ["期待される", "きたいされる", "to be expected / anticipated"]
  ],
  grammar: {
    pattern: "Direct vs. indirect (suffering) passive review",
    meaning: "Direct passive: the object becomes the subject. Indirect passive: the speaker is adversely affected.",
    example_jp: "彼は皆に尊敬されている。高い成果が期待されている。",
    example_en: "He is respected by everyone. High results are expected."
  },
  practice: "For each verb, write one direct passive and one suffering passive sentence. Compare how the meaning and feeling change.",
  tip: "Mastering passive forms is crucial for N3. They appear constantly in reading passages and listening comprehension on the exam."
});

// ===== Days 791–795: Causative Form Verbs =====

curriculum.push({
  day: 791,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(791 / 7),
  title: "Causative Form: Group 1 U-verbs",
  intro: "The causative form means to make or let someone do something. For Group 1 verbs, change -u to -aseru. This is essential for expressing permission and compulsion.",
  type: "verbs",
  chars: [],
  vocab: [
    ["読ませる", "よませる", "to make/let someone read"],
    ["書かせる", "かかせる", "to make/let someone write"],
    ["行かせる", "いかせる", "to make/let someone go"],
    ["待たせる", "またせる", "to make someone wait"],
    ["歌わせる", "うたわせる", "to make/let someone sing"]
  ],
  grammar: {
    pattern: "Group 1: change -u ending to -aseru (e.g., 読む to 読ませる)",
    meaning: "Causative form for U-verbs: make or let someone do an action",
    example_jp: "お客さんを30分も待たせてしまった。",
    example_en: "I ended up making the customer wait 30 minutes."
  },
  practice: "Conjugate into causative: 飲む, 走る, 帰る, 泳ぐ, 遊ぶ. Write sentences about a boss making employees do things and a parent letting children do things.",
  tip: "Context determines make vs. let: 子供を遊ばせる (let the child play) vs. 子供を勉強させる (make the child study)."
});

curriculum.push({
  day: 792,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(792 / 7),
  title: "Causative Form: Group 2 and Irregular Verbs",
  intro: "Group 2 causative: drop る, add させる. Irregular: する becomes させる, 来る becomes 来させる. Practice both making and letting.",
  type: "verbs",
  chars: [],
  vocab: [
    ["食べさせる", "たべさせる", "to make/let someone eat"],
    ["見させる", "みさせる", "to make/let someone watch"],
    ["させる", "させる", "to make/let someone do"],
    ["来させる", "こさせる", "to make someone come"],
    ["考えさせる", "かんがえさせる", "to make someone think"]
  ],
  grammar: {
    pattern: "Group 2: drop る, add させる / する becomes させる / 来る becomes 来させる",
    meaning: "Causative form for RU-verbs and irregular verbs",
    example_jp: "母は子供に野菜を食べさせた。この映画は考えさせられる。",
    example_en: "The mother made the child eat vegetables. This movie makes you think."
  },
  practice: "Write five causative sentences: three where someone is forced to do something and two where someone is allowed to do something.",
  tip: "させてください (please let me do) is a polite way to request permission: 説明させてください (please let me explain)."
});

curriculum.push({
  day: 793,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(793 / 7),
  title: "Causative Form: Permission and Requests",
  intro: "The causative form combined with てください, てもらう, or ていただく creates polite requests for permission. This is crucial for formal situations.",
  type: "verbs",
  chars: [],
  vocab: [
    ["休ませてください", "やすませてください", "please let me rest"],
    ["帰らせてもらう", "かえらせてもらう", "to be allowed to go home"],
    ["参加させていただく", "さんかさせていただく", "to humbly be allowed to participate"],
    ["発言させてもらう", "はつげんさせてもらう", "to be allowed to speak"],
    ["確認させてください", "かくにんさせてください", "please let me confirm"]
  ],
  grammar: {
    pattern: "Causative て-form + ください / もらう / いただく",
    meaning: "Polite ways to request permission: let me do, allow me to do",
    example_jp: "少し考えさせてください。一言発言させていただきます。",
    example_en: "Please let me think a moment. Allow me to say a word."
  },
  practice: "Write polite requests for five work situations using させてください and させていただく. Note the difference in formality.",
  tip: "させていただく is extremely polite and common in business Japanese. It literally means to humbly receive the favour of being allowed to do."
});

curriculum.push({
  day: 794,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(794 / 7),
  title: "Causative-Passive: Being Made to Do",
  intro: "The causative-passive combines both forms: to be made to do. For Group 1 verbs the form is -aserareru, often shortened to -asareru in speech.",
  type: "verbs",
  chars: [],
  vocab: [
    ["行かせられる", "いかせられる", "to be made to go"],
    ["飲ませられる", "のませられる", "to be made to drink"],
    ["待たせられる", "またせられる", "to be made to wait"],
    ["走らせられる", "はしらせられる", "to be made to run"],
    ["覚えさせられる", "おぼえさせられる", "to be made to memorise"]
  ],
  grammar: {
    pattern: "Group 1: -aserareru (long) or -asareru (short) / Group 2: -させられる",
    meaning: "Causative-passive expresses being forced to do something against your will",
    example_jp: "毎日残業させられている。子供の頃、嫌いな野菜を食べさせられた。",
    example_en: "I am being made to work overtime every day. As a child, I was made to eat vegetables I did not like."
  },
  practice: "Think of situations where you were forced to do something. Write five sentences using causative-passive about school, work, or family.",
  tip: "The short form (行かされる instead of 行かせられる) is very common in speech. Both forms are considered correct."
});

curriculum.push({
  day: 795,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(795 / 7),
  title: "Causative Form: Review and Comparison",
  intro: "Review day comparing potential, passive, causative, and causative-passive forms. Being able to distinguish these quickly is a key N3 skill.",
  type: "verbs",
  chars: [],
  vocab: [
    ["飲める", "のめる", "can drink (potential)"],
    ["飲まれる", "のまれる", "to be drunk (passive)"],
    ["飲ませる", "のませる", "to make/let drink (causative)"],
    ["飲ませられる", "のませられる", "to be made to drink (causative-passive)"],
    ["起こされる", "おこされる", "to be woken up (passive of 起こす)"]
  ],
  grammar: {
    pattern: "飲む: 飲める (potential) / 飲まれる (passive) / 飲ませる (causative) / 飲ませられる (causative-passive)",
    meaning: "One verb, four different conjugation forms with distinct meanings",
    example_jp: "このワインは飲める。猫にミルクを飲まれた。赤ちゃんに薬を飲ませた。",
    example_en: "This wine is drinkable. The cat drank my milk. I gave the baby medicine."
  },
  practice: "For each verb (食べる, 書く, 見る, する), write all four forms and a sentence for each. That is 16 sentences total.",
  tip: "Create a conjugation chart for quick reference. Seeing all four forms side by side helps solidify the patterns."
});

// ===== Days 796–800: い-Adjectives N3 Level =====

curriculum.push({
  day: 796,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(796 / 7),
  title: "I-adjectives: Intensity and Severity",
  intro: "I-adjectives end in い and conjugate by dropping い. Today covers adjectives expressing intensity and severity at the N3 level.",
  type: "verbs",
  chars: [],
  vocab: [
    ["激しい", "はげしい", "intense / violent / fierce"],
    ["厳しい", "きびしい", "strict / harsh / severe"],
    ["恐ろしい", "おそろしい", "frightening / terrible"],
    ["著しい", "いちじるしい", "remarkable / significant"],
    ["騒がしい", "さわがしい", "noisy / boisterous"]
  ],
  grammar: {
    pattern: "I-adjective conjugation: い to くない (neg.) / かった (past) / くなかった (past neg.)",
    meaning: "I-adjectives conjugate by replacing the final い",
    example_jp: "今日の雨は激しかった。先生は厳しいが、公平だ。",
    example_en: "The rain today was intense. The teacher is strict but fair."
  },
  practice: "Describe extreme weather, strict teachers, and scary experiences using all four tenses of each adjective.",
  tip: "激しい rain or wind (激しい雨/風) sounds more literary than すごい. Using varied adjectives shows advanced vocabulary."
});

curriculum.push({
  day: 797,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(797 / 7),
  title: "I-adjectives: Wonder and Rarity",
  intro: "Adjectives for expressing that something is wonderful, rare, or nostalgic. These are great for sharing impressions and opinions.",
  type: "verbs",
  chars: [],
  vocab: [
    ["素晴らしい", "すばらしい", "wonderful / magnificent"],
    ["珍しい", "めずらしい", "rare / unusual"],
    ["懐かしい", "なつかしい", "nostalgic / dear"],
    ["望ましい", "のぞましい", "desirable / preferable"],
    ["好ましい", "このましい", "pleasant / likeable"]
  ],
  grammar: {
    pattern: "I-adjective + く + verb (adverbial use)",
    meaning: "I-adjectives become adverbs by changing い to く",
    example_jp: "素晴らしく美しい景色だった。珍しい鳥を見つけた。",
    example_en: "It was a wonderfully beautiful view. I found a rare bird."
  },
  practice: "Describe a memorable trip using 素晴らしい and 懐かしい. Talk about unusual things you have seen using 珍しい.",
  tip: "懐かしい is uniquely Japanese. It describes the pleasant feeling of encountering something from the past. English has no exact equivalent."
});

curriculum.push({
  day: 798,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(798 / 7),
  title: "I-adjectives: Difficulty and Ease",
  intro: "Adjectives and compound adjective patterns for describing how easy or difficult things are. The やすい and にくい patterns are essential.",
  type: "verbs",
  chars: [],
  vocab: [
    ["難しい", "むずかしい", "difficult"],
    ["易しい", "やさしい", "easy (of difficulty)"],
    ["分かりにくい", "わかりにくい", "hard to understand"],
    ["使いやすい", "つかいやすい", "easy to use"],
    ["読みやすい", "よみやすい", "easy to read"]
  ],
  grammar: {
    pattern: "Verb stem + やすい (easy to) / にくい (hard to)",
    meaning: "Attach やすい or にくい to verb stems to describe ease or difficulty of an action",
    example_jp: "この辞書は使いやすい。彼の字は読みにくい。",
    example_en: "This dictionary is easy to use. His handwriting is hard to read."
  },
  practice: "Evaluate five everyday items using やすい and にくい: phones, books, tools, chairs, websites.",
  tip: "やさしい has two meanings depending on kanji: 易しい (easy) and 優しい (kind). The reading is the same."
});

curriculum.push({
  day: 799,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(799 / 7),
  title: "I-adjectives: Emotions and Feelings",
  intro: "N3-level i-adjectives for expressing deeper emotions beyond the basics. These describe complex feelings and impressions.",
  type: "verbs",
  chars: [],
  vocab: [
    ["悔しい", "くやしい", "frustrating / vexing"],
    ["情けない", "なさけない", "pathetic / pitiful"],
    ["頼もしい", "たのもしい", "reliable / reassuring"],
    ["羨ましい", "うらやましい", "envious / jealous"],
    ["恥ずかしい", "はずかしい", "embarrassing / shy"]
  ],
  grammar: {
    pattern: "I-adjective + くて (te-form for joining clauses)",
    meaning: "The te-form of i-adjectives (change い to くて) connects clauses",
    example_jp: "試合に負けて悔しくて、泣いてしまった。",
    example_en: "I lost the match and it was so frustrating that I ended up crying."
  },
  practice: "Describe emotional moments using these adjectives. Chain emotions together: 悔しくて、情けなくて、泣いた.",
  tip: "悔しい is a very common and culturally important emotion in Japanese. It expresses frustration from losing or failing despite effort."
});

curriculum.push({
  day: 800,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(800 / 7),
  title: "I-adjectives: Appearance and Quality",
  intro: "Adjectives for describing how things look and feel, plus the important noun-forming suffix さ. These help you give detailed descriptions.",
  type: "verbs",
  chars: [],
  vocab: [
    ["美しい", "うつくしい", "beautiful"],
    ["鋭い", "するどい", "sharp / keen"],
    ["柔らかい", "やわらかい", "soft / tender"],
    ["細かい", "こまかい", "fine / detailed / meticulous"],
    ["相応しい", "ふさわしい", "appropriate / fitting"]
  ],
  grammar: {
    pattern: "I-adjective + さ = noun form (degree or extent of a quality)",
    meaning: "Change い to さ to create a noun expressing the degree of that quality",
    example_jp: "この絵の美しさに感動した。",
    example_en: "I was moved by the beauty of this painting."
  },
  practice: "Convert each adjective to its noun form with さ: 激しさ, 厳しさ, 美しさ. Use them in sentences about experiences.",
  tip: "The さ form is essential for abstract discussion: 難しさ (the difficulty), 大きさ (the size), 長さ (the length)."
});

// ===== Days 801–805: な-Adjectives N3 Level =====

curriculum.push({
  day: 801,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(801 / 7),
  title: "Na-adjectives: Importance and Necessity",
  intro: "Na-adjectives connect to nouns with な and use です or だ for the predicate form. Today covers adjectives expressing importance and necessity.",
  type: "verbs",
  chars: [],
  vocab: [
    ["重要な", "じゅうような", "important"],
    ["必要な", "ひつような", "necessary / needed"],
    ["大切な", "たいせつな", "important / precious"],
    ["貴重な", "きちょうな", "valuable / precious"],
    ["不可欠な", "ふかけつな", "indispensable / essential"]
  ],
  grammar: {
    pattern: "Na-adjective + な + noun / Na-adjective + だ or です (predicate)",
    meaning: "Na-adjectives modify nouns with な and use だ or です at the end of sentences",
    example_jp: "健康は人生で最も重要なことだ。水は生活に不可欠だ。",
    example_en: "Health is the most important thing in life. Water is indispensable for daily life."
  },
  practice: "Write sentences ranking things by importance: AはBより重要だ. Use 必要な and 大切な in similar comparisons.",
  tip: "重要 and 大切 both mean important, but 大切 has a warmer, more personal nuance (precious or dear), while 重要 is more formal."
});

curriculum.push({
  day: 802,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(802 / 7),
  title: "Na-adjectives: Accuracy and Complexity",
  intro: "Adjectives for describing precision, complexity, and simplicity. These are essential for academic and professional contexts.",
  type: "verbs",
  chars: [],
  vocab: [
    ["正確な", "せいかくな", "accurate / precise"],
    ["複雑な", "ふくざつな", "complex / complicated"],
    ["簡単な", "かんたんな", "simple / easy"],
    ["単純な", "たんじゅんな", "simple / straightforward"],
    ["曖昧な", "あいまいな", "vague / ambiguous"]
  ],
  grammar: {
    pattern: "Na-adjective + に + verb (adverbial use)",
    meaning: "Na-adjectives become adverbs by replacing な with に",
    example_jp: "正確に答えてください。この問題は複雑だ。",
    example_en: "Please answer accurately. This problem is complex."
  },
  practice: "Describe tasks at work or school using these adjectives: Aは複雑だが、Bは簡単だ. Convert them to adverbs with に.",
  tip: "簡単 (easy) vs. 単純 (simple): 単純 can carry a slightly negative nuance of being too simple or naive."
});

curriculum.push({
  day: 803,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(803 / 7),
  title: "Na-adjectives: Safety, Sufficiency, and Suitability",
  intro: "Practical adjectives for describing whether things are safe, sufficient, or suitable. Essential for everyday decisions and advice.",
  type: "verbs",
  chars: [],
  vocab: [
    ["安全な", "あんぜんな", "safe"],
    ["危険な", "きけんな", "dangerous"],
    ["十分な", "じゅうぶんな", "sufficient / enough"],
    ["適当な", "てきとうな", "appropriate / suitable"],
    ["有効な", "ゆうこうな", "effective / valid"]
  ],
  grammar: {
    pattern: "Na-adjective + ではない or じゃない (negative form)",
    meaning: "Negate na-adjectives with ではない (formal) or じゃない (casual)",
    example_jp: "この方法は十分に安全ではない。もっと有効な手段がある。",
    example_en: "This method is not sufficiently safe. There are more effective measures."
  },
  practice: "Evaluate places and situations: この道は安全だ or 危険だ. Discuss whether resources are 十分 or not.",
  tip: "適当 has two meanings: appropriate (formal usage) and sloppy or half-hearted (casual usage). Context is crucial."
});

curriculum.push({
  day: 804,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(804 / 7),
  title: "Na-adjectives: Character and Personality",
  intro: "Adjectives for describing people. These are useful for introductions, descriptions, and storytelling.",
  type: "verbs",
  chars: [],
  vocab: [
    ["真面目な", "まじめな", "serious / diligent"],
    ["素直な", "すなおな", "honest / obedient"],
    ["丁寧な", "ていねいな", "polite / careful"],
    ["親切な", "しんせつな", "kind / helpful"],
    ["器用な", "きような", "skilful / dexterous"]
  ],
  grammar: {
    pattern: "Na-adjective + な + 人 = a certain kind of person",
    meaning: "Na-adjectives directly modify nouns like 人 (person) with な",
    example_jp: "彼女はとても真面目な人だ。丁寧に説明してくれた。",
    example_en: "She is a very serious person. She explained it to me politely."
  },
  practice: "Describe five people you know using these na-adjectives. Use both noun-modifying (な人) and predicate (は〜だ) forms.",
  tip: "真面目 is almost always a compliment in Japanese. Being serious and diligent is highly valued in Japanese culture."
});

curriculum.push({
  day: 805,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(805 / 7),
  title: "Na-adjectives: Emotions, Attitudes, and States",
  intro: "Na-adjectives expressing emotional states, attitudes, and conditions. Many of these use the productive suffix 的 to form adjectives.",
  type: "verbs",
  chars: [],
  vocab: [
    ["積極的な", "せっきょくてきな", "proactive / positive"],
    ["消極的な", "しょうきょくてきな", "passive / negative"],
    ["熱心な", "ねっしんな", "enthusiastic / keen"],
    ["冷静な", "れいせいな", "calm / composed"],
    ["自然な", "しぜんな", "natural"]
  ],
  grammar: {
    pattern: "〜的な = -tic, -tive, -al (makes a noun into a na-adjective)",
    meaning: "The suffix 的 converts nouns into na-adjectives, similar to English -tic or -ive",
    example_jp: "彼はいつも積極的に参加している。冷静に判断してください。",
    example_en: "He always participates proactively. Please judge calmly."
  },
  practice: "Describe contrasting attitudes using 積極的 and 消極的. Use 冷静 and 熱心 to describe people in various situations.",
  tip: "的 is extremely productive: 国際的 (international), 基本的 (fundamental), 一般的 (general). Learning this suffix opens many new words."
});

// ===== Days 806–810: Adverbs Derived from Adjectives =====

curriculum.push({
  day: 806,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(806 / 7),
  title: "Adverbs from I-adjectives: Basic Conversion",
  intro: "I-adjectives become adverbs by changing い to く. Today we practise this conversion with N3-level adjectives and see how they modify verbs.",
  type: "verbs",
  chars: [],
  vocab: [
    ["激しく", "はげしく", "intensely / violently"],
    ["厳しく", "きびしく", "strictly / harshly"],
    ["美しく", "うつくしく", "beautifully"],
    ["鋭く", "するどく", "sharply / keenly"],
    ["細かく", "こまかく", "finely / in detail"]
  ],
  grammar: {
    pattern: "I-adjective: い to く = adverb form",
    meaning: "Change the final い to く to turn an i-adjective into an adverb",
    example_jp: "雨が激しく降っている。先生が厳しく指導した。",
    example_en: "It is raining intensely. The teacher instructed strictly."
  },
  practice: "Take five i-adjectives from earlier lessons and convert them to adverbs. Write a sentence for each one modifying a different verb.",
  tip: "Some adverb forms have become set expressions: 大きく (greatly), 深く (deeply), 広く (widely). These are used very frequently."
});

curriculum.push({
  day: 807,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(807 / 7),
  title: "Adverbs from Na-adjectives: Basic Conversion",
  intro: "Na-adjectives become adverbs by replacing な with に. Today we practise this conversion and compare it with the i-adjective pattern.",
  type: "verbs",
  chars: [],
  vocab: [
    ["正確に", "せいかくに", "accurately / precisely"],
    ["自然に", "しぜんに", "naturally"],
    ["丁寧に", "ていねいに", "politely / carefully"],
    ["十分に", "じゅうぶんに", "sufficiently / fully"],
    ["自由に", "じゆうに", "freely"]
  ],
  grammar: {
    pattern: "Na-adjective: な to に = adverb form",
    meaning: "Replace な with に to turn a na-adjective into an adverb",
    example_jp: "自然に話せるようになりたい。丁寧に書いてください。",
    example_en: "I want to become able to speak naturally. Please write carefully."
  },
  practice: "Convert five na-adjectives to adverbs with に. Write sentences using each to modify a verb. Compare with the く adverbs from yesterday.",
  tip: "Some words like きれいに (cleanly/beautifully) are so common as adverbs that learners sometimes forget they come from na-adjectives."
});

curriculum.push({
  day: 808,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(808 / 7),
  title: "Adverbs from Adjectives: Degree and Manner",
  intro: "Today we focus on adverbs that express degree (how much) and manner (how). These adverbs add precision to your sentences.",
  type: "verbs",
  chars: [],
  vocab: [
    ["深く", "ふかく", "deeply"],
    ["広く", "ひろく", "widely / broadly"],
    ["強く", "つよく", "strongly / powerfully"],
    ["静かに", "しずかに", "quietly / silently"],
    ["確かに", "たしかに", "certainly / surely"]
  ],
  grammar: {
    pattern: "Adverb + verb for precise description of manner",
    meaning: "Adverbs modify verbs to explain how an action is performed",
    example_jp: "この問題について深く考えた。確かに、彼の言う通りだ。",
    example_en: "I thought deeply about this problem. Indeed, he is right."
  },
  practice: "For each adverb, write two sentences: one describing a physical action and one describing an abstract or mental action.",
  tip: "確かに is a versatile discourse marker meaning indeed or certainly. It is very useful for agreeing with someone or acknowledging a point."
});

curriculum.push({
  day: 809,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(809 / 7),
  title: "Adverbs: Adjective-derived vs. Pure Adverbs",
  intro: "Some adverbs come from adjectives, while others are pure adverbs that do not derive from any adjective. Today we compare both types.",
  type: "verbs",
  chars: [],
  vocab: [
    ["次第に", "しだいに", "gradually"],
    ["直ちに", "ただちに", "immediately"],
    ["一層", "いっそう", "even more / further"],
    ["極めて", "きわめて", "extremely"],
    ["割と", "わりと", "relatively / fairly"]
  ],
  grammar: {
    pattern: "Pure adverbs that do not derive from adjectives",
    meaning: "Some common N3 adverbs exist independently and are not formed from adjectives",
    example_jp: "状況は次第に改善している。直ちに対応してください。",
    example_en: "The situation is gradually improving. Please respond immediately."
  },
  practice: "Use each adverb in a sentence about work or school. Try replacing them with similar adverbs to see the nuance difference.",
  tip: "割と is casual and means relatively or fairly. It softens statements: 割と簡単だった (it was fairly easy)."
});

curriculum.push({
  day: 810,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(810 / 7),
  title: "Adverbs: Review and Natural Usage",
  intro: "Review day for adverbs. Focus on choosing the right adverb to express degree, manner, and frequency in natural Japanese.",
  type: "verbs",
  chars: [],
  vocab: [
    ["明らかに", "あきらかに", "obviously / clearly"],
    ["穏やかに", "おだやかに", "calmly / gently"],
    ["豊かに", "ゆたかに", "richly / abundantly"],
    ["新たに", "あらたに", "newly / freshly"],
    ["速やかに", "すみやかに", "promptly / swiftly"]
  ],
  grammar: {
    pattern: "Multiple adverbs in one sentence for layered description",
    meaning: "Combining adverbs adds richness and precision to sentences",
    example_jp: "速やかに、そして正確に対応してください。問題は明らかに改善された。",
    example_en: "Please respond promptly and accurately. The problem was clearly improved."
  },
  practice: "Rewrite five plain sentences by adding appropriate adverbs to make them more descriptive and natural.",
  tip: "速やかに is formal and often seen in official announcements and instructions. The casual equivalent is すぐに (right away)."
});

// ===== Days 811–815: Verb + Noun Collocations =====

curriculum.push({
  day: 811,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(811 / 7),
  title: "Verb + Noun Collocations: Taking Actions",
  intro: "Japanese has many set verb-noun combinations that must be learned as pairs. Today we cover collocations with する verbs for taking actions.",
  type: "verbs",
  chars: [],
  vocab: [
    ["責任を取る", "せきにんをとる", "to take responsibility"],
    ["努力する", "どりょくする", "to make an effort"],
    ["注意する", "ちゅういする", "to pay attention / be careful"],
    ["連絡する", "れんらくする", "to contact / get in touch"],
    ["相談する", "そうだんする", "to consult / discuss"]
  ],
  grammar: {
    pattern: "Noun + を + する / Noun + する (する verbs)",
    meaning: "Many abstract nouns combine with する to form verbs",
    example_jp: "問題があったら、すぐに連絡してください。先輩に相談した。",
    example_en: "If there is a problem, please contact us immediately. I consulted my senior."
  },
  practice: "Write five sentences using these collocations in workplace scenarios. Try using both polite and casual forms.",
  tip: "相談する takes に for the person consulted: 先生に相談する (to consult with the teacher)."
});

curriculum.push({
  day: 812,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(812 / 7),
  title: "Verb + Noun Collocations: Giving and Receiving",
  intro: "Collocations related to giving, receiving, and exchanging. These are crucial for polite Japanese and business communication.",
  type: "verbs",
  chars: [],
  vocab: [
    ["影響を与える", "えいきょうをあたえる", "to give influence / affect"],
    ["許可を得る", "きょかをえる", "to obtain permission"],
    ["印象を受ける", "いんしょうをうける", "to receive an impression"],
    ["迷惑をかける", "めいわくをかける", "to cause trouble / bother"],
    ["世話になる", "せわになる", "to be in the care of someone"]
  ],
  grammar: {
    pattern: "Noun + を + verb (set collocations)",
    meaning: "Certain nouns pair with specific verbs to form natural expressions",
    example_jp: "ご迷惑をおかけして申し訳ありません。いつもお世話になっております。",
    example_en: "I am sorry for causing you trouble. Thank you for always taking care of me."
  },
  practice: "Write formal apologies using 迷惑をかける and formal greetings using お世話になる. These are essential business phrases.",
  tip: "お世話になっております is one of the most common business greetings in Japanese. It is used at the start of emails and calls."
});

curriculum.push({
  day: 813,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(813 / 7),
  title: "Verb + Noun Collocations: Decisions and Results",
  intro: "Collocations for describing decisions, outcomes, and results. These help you discuss plans and their consequences.",
  type: "verbs",
  chars: [],
  vocab: [
    ["結論を出す", "けつろんをだす", "to reach a conclusion"],
    ["成果を上げる", "せいかをあげる", "to achieve results"],
    ["目標を立てる", "もくひょうをたてる", "to set a goal"],
    ["計画を立てる", "けいかくをたてる", "to make a plan"],
    ["判断を下す", "はんだんをくだす", "to make a judgment"]
  ],
  grammar: {
    pattern: "Abstract noun + を + specific verb (set expression)",
    meaning: "Many Japanese expressions pair abstract nouns with particular verbs that cannot be freely substituted",
    example_jp: "まず目標を立てて、それから計画を立てよう。",
    example_en: "First let us set a goal, and then make a plan."
  },
  practice: "Describe a project from start to finish: set a goal (目標を立てる), make a plan (計画を立てる), achieve results (成果を上げる), reach a conclusion (結論を出す).",
  tip: "These collocations cannot be freely mixed. You say 目標を立てる (set a goal) but not 目標を出す. Learn each pair as a unit."
});

curriculum.push({
  day: 814,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(814 / 7),
  title: "Verb + Noun Collocations: Emotions and Reactions",
  intro: "Collocations for expressing emotions and reactions. Japanese often uses noun-verb pairs where English uses a single verb.",
  type: "verbs",
  chars: [],
  vocab: [
    ["感動する", "かんどうする", "to be moved / impressed"],
    ["感謝する", "かんしゃする", "to be grateful / appreciate"],
    ["期待する", "きたいする", "to expect / look forward to"],
    ["我慢する", "がまんする", "to endure / be patient"],
    ["反省する", "はんせいする", "to reflect on / regret"]
  ],
  grammar: {
    pattern: "Emotion noun + する = to feel/experience that emotion",
    meaning: "Many emotions in Japanese are expressed as noun + する combinations",
    example_jp: "彼の話に感動した。今回の失敗を反省している。",
    example_en: "I was moved by his story. I am reflecting on this failure."
  },
  practice: "Write a diary entry about your week using at least three of these emotion collocations. Describe what caused each feeling.",
  tip: "我慢する covers a wide range: enduring pain, being patient, holding back desires. It is a very important concept in Japanese culture."
});

curriculum.push({
  day: 815,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(815 / 7),
  title: "Verb + Noun Collocations: Review and Expansion",
  intro: "Review all collocations from this week and add new ones related to daily activities and social interactions.",
  type: "verbs",
  chars: [],
  vocab: [
    ["約束を守る", "やくそくをまもる", "to keep a promise"],
    ["夢を叶える", "ゆめをかなえる", "to make a dream come true"],
    ["気を付ける", "きをつける", "to be careful / watch out"],
    ["手間がかかる", "てまがかかる", "to take effort / be laborious"],
    ["役に立つ", "やくにたつ", "to be useful / helpful"]
  ],
  grammar: {
    pattern: "Set collocations with を, が, and に particles",
    meaning: "Collocations have fixed particle usage that must be memorised",
    example_jp: "約束を守ることは大切だ。この本は日本語の勉強に役に立つ。",
    example_en: "Keeping promises is important. This book is useful for studying Japanese."
  },
  practice: "For each collocation, identify the particle used and explain why. Write sentences using all five in a connected story.",
  tip: "役に立つ (to be useful) is extremely common. The negative 役に立たない (useless) is also frequently used."
});

// ===== Days 816–820: Mixed Verb / Adjective Review =====

curriculum.push({
  day: 816,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(816 / 7),
  title: "Mixed Review: Transitive/Intransitive and Compound Verbs",
  intro: "Review of transitive/intransitive pairs and compound verbs from the first half of Phase 17. Test your recall and usage.",
  type: "verbs",
  chars: [],
  vocab: [
    ["落とす", "おとす", "to drop (something)"],
    ["落ちる", "おちる", "to fall / drop"],
    ["消す", "けす", "to turn off / erase"],
    ["消える", "きえる", "to disappear / go out"],
    ["見つける", "みつける", "to find / discover"]
  ],
  grammar: {
    pattern: "Transitive/intransitive and compound verb review",
    meaning: "Choosing the correct verb form is key to sounding natural in Japanese",
    example_jp: "財布を落とした。電気が消えた。やっと鍵を見つけた。",
    example_en: "I dropped my wallet. The lights went out. I finally found the key."
  },
  practice: "For each transitive/intransitive pair learned in days 771-775, write one sentence for each form from memory without looking at notes.",
  tip: "If you can consistently choose the right form between transitive and intransitive, your Japanese will sound much more natural to native speakers."
});

curriculum.push({
  day: 817,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(817 / 7),
  title: "Mixed Review: All Verb Conjugation Forms",
  intro: "Comprehensive review of potential, passive, causative, and causative-passive forms. Quick-fire conjugation practice.",
  type: "verbs",
  chars: [],
  vocab: [
    ["作る", "つくる", "to make / create"],
    ["作れる", "つくれる", "can make (potential)"],
    ["作られる", "つくられる", "to be made (passive)"],
    ["作らせる", "つくらせる", "to make someone create (causative)"],
    ["作らせられる", "つくらせられる", "to be made to create (causative-passive)"]
  ],
  grammar: {
    pattern: "Complete conjugation: dictionary to potential to passive to causative to causative-passive",
    meaning: "Full conjugation chain for one verb demonstrates all forms at once",
    example_jp: "この料理は誰でも作れる。プロに作らせた方がいい。",
    example_en: "Anyone can make this dish. It is better to have a professional make it."
  },
  practice: "Create complete conjugation tables for: 食べる, 書く, する, 来る. All four forms for each verb. Check your work carefully.",
  tip: "Knowing these forms for any verb is a major milestone. If you can conjugate fluently, your reading and listening comprehension will improve dramatically."
});

curriculum.push({
  day: 818,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(818 / 7),
  title: "Mixed Review: I-adjectives and Na-adjectives",
  intro: "Review of all N3-level adjectives covered in this phase. Focus on conjugation, adverb formation, and natural usage in context.",
  type: "verbs",
  chars: [],
  vocab: [
    ["有名な", "ゆうめいな", "famous"],
    ["立派な", "りっぱな", "splendid / admirable"],
    ["新鮮な", "しんせんな", "fresh"],
    ["豊かな", "ゆたかな", "rich / abundant"],
    ["乏しい", "とぼしい", "scarce / lacking"]
  ],
  grammar: {
    pattern: "Na-adjective: な (attributive), だ (predicate), に (adverb), で (te-form), ではない (negative), だった (past)",
    meaning: "Complete na-adjective conjugation review with all forms",
    example_jp: "有名な店で新鮮な魚を食べた。とても豊かな味だった。",
    example_en: "I ate fresh fish at a famous restaurant. It was a very rich flavour."
  },
  practice: "For each adjective learned this phase, write it in all forms: attributive, predicate, adverb, te-form, negative, and past.",
  tip: "Na-adjectives often come from Chinese-origin words. Recognising the kanji helps you guess meanings of unfamiliar ones."
});

curriculum.push({
  day: 819,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(819 / 7),
  title: "Mixed Review: Collocations and Adverbs in Context",
  intro: "Review of verb-noun collocations and adverbs. Practice using them together in connected discourse rather than isolated sentences.",
  type: "verbs",
  chars: [],
  vocab: [
    ["徐々に", "じょじょに", "gradually / little by little"],
    ["必死に", "ひっしに", "desperately / with all effort"],
    ["意見を述べる", "いけんをのべる", "to state an opinion"],
    ["興味を持つ", "きょうみをもつ", "to have interest / become interested"],
    ["経験を積む", "けいけんをつむ", "to gain experience"]
  ],
  grammar: {
    pattern: "Adverb + collocation for natural, fluent expression",
    meaning: "Combining adverbs with set collocations creates natural-sounding sentences",
    example_jp: "必死に努力して、徐々に成果を上げることができた。",
    example_en: "I worked desperately hard and was gradually able to achieve results."
  },
  practice: "Write a short paragraph about learning Japanese using at least three collocations and three adverbs from this phase.",
  tip: "徐々に and 次第に both mean gradually, but 次第に implies a clearer progression over time."
});

curriculum.push({
  day: 820,
  phaseNum: 17,
  phaseName: "N3 Verbs & Adjectives",
  week: Math.ceil(820 / 7),
  title: "Phase 17 Final Review: Comprehensive Practice",
  intro: "Final review of all Phase 17 material: transitive/intransitive pairs, compound verbs, verb conjugation forms, na-adjectives, i-adjectives, adverbs, and collocations.",
  type: "verbs",
  chars: [],
  vocab: [
    ["穏やかな", "おだやかな", "calm / gentle / mild"],
    ["盛んな", "さかんな", "thriving / popular / active"],
    ["頑張る", "がんばる", "to do your best / persevere"],
    ["挑戦する", "ちょうせんする", "to challenge / attempt"],
    ["成長する", "せいちょうする", "to grow / develop"]
  ],
  grammar: {
    pattern: "Comprehensive review: all verb forms plus i-adjective and na-adjective conjugations",
    meaning: "Full review of Phase 17 grammar patterns and vocabulary",
    example_jp: "穏やかな天気の日に、盛んに行われている祭りを見に行こうと思っている。",
    example_en: "On a calm day, I am thinking of going to see the festival that is being actively held."
  },
  practice: "Write a short essay of ten sentences about your language learning journey. Include at least one transitive/intransitive pair, one compound verb, one passive, one causative, and three adjectives.",
  tip: "You have covered a huge range of N3 verbs and adjectives in this phase. Regular review using spaced repetition will help you retain them long-term."
});