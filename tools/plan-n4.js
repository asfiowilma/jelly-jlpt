// N4 unit outline for tools/author-plan.js: the teaching decisions (lesson order and vocabulary,
// lesson notes). author-plan.js turns it into data/n4/plan.js; edit this file, never plan.js.
// Format: see the header of tools/author-plan.js. No kana units at N4.
// Grammar order: the 14 teaching blocks of .scratch/n4-launch/n4-grammar-inventory.md §(d), each
// conjugation form before the patterns built on it (tools/n4-grammar-notes.md). ～かどうか is in no
// block; it sits after the volitional (its examples use potential, てみる and volitional).
// Two grammar ids in one row (space-separated) only for close siblings or a short form.
// The prep and mock units (GUIDES, PREP) follow the last review as n4.u103-u109; lesson dialogues come
// later. Unit ids are given in order, so appending never renumbers the lessons.
"use strict";

// READY: false keeps N4 out of the app (Overview "Coming soon", placement, Today) while the
// level is built; tests still see the plan. Set true (and rerun author-plan.js) to ship N4.
const READY = false;

// [title, grammar id(s) or '', vocab tokens, fixed kanji?]
const LESSONS = [
  // 1. plain-form sentences
  ["Cheap and simple", "g:te-adj-noun", "簡単 特別 不便 普通 変 珍しい 美しい 固い"],
  ["Not enough time", "g:nakute", "足りる 十分 無理 だめ 残念 大事 急 ちっとも"],
  ["The person who called", "g:noun-modifier", "見つける この間 彼 彼女 男性 女性 似る"],
  ["Dear diary", "g:te-ita", "ケーキ 日記 さっき 寝坊 昔 夢 眠る 眠い"],
  ["What do you think?", "g:to-omou", "思う 考える 意見 反対 理由 訳 原因 比べる"],
  ["She said what?", "g:tte", "うん 嘘 なるほど 君|きみ 伝える もちろん 返事"],
  ["A book called…", "g:to-iu", "紹介 小説 漫画 番組 文学 歴史 アナウンサー 放送"],
  ["My hobby is fishing", "g:koto", "趣味 事 楽しむ 釣る 踊る 踊り 遊び 水泳"],
  ["What that means", "g:to-iu-koto", "説明 会話 尋ねる 相談 例えば 翻訳 承知"],
  // 2. linking and listing
  ["Choosing a flat", "g:shi", "下宿 近所 郊外 駐車場 二階建て 建て 屋上 場所"],
  ["Packing for a trip", "g:nado g:toka-toka", "スーパー 日 スーツケース 下着 手袋 サンダル お土産 食料品"],
  ["Just by looking", "g:dake-de", "見物 景色 写す 触る 美術館 展覧会 動物園 寺"],
  ["Besides, and yet", "g:sore-ni g:sore-demo", "それに それで だから すると けれども または やはり 中々"],
  ["Anyone can join", "g:demo", "会 員 自由 遠慮 是非 招待 出席 皆"],
  // 3. wanting and feeling
  ["Birthday wishes", "g:ga-hoshii", "プレゼント 贈り物 お祝い 指輪 アクセサリー ハンドバッグ 人形 おもちゃ"],
  ["Please don't be late", "g:te-hoshii", "約束 遅れる 謝る 怒る 心配 安心 なるべく 必ず"],
  ["A child who wants everything", "g:tagaru", "子 赤ちゃん 赤ん坊 息子 娘 泣く 笑う 育てる"],
  ["Smells from the kitchen", "g:ga-suru", "匂い 音 味 気 焼く 沸く 沸かす 湯"],
  ["How deep is the lake?", "g:sa", "深い 浅い 湖 形 倍 以上 以下 程"],
  // 4. appearance and inference
  ["Looks delicious", "g:sou-da-looks", "ステーキ ハンバーグ サンドイッチ サラダ ジャム ごちそう ぶどう 苦い"],
  ["Just like a child", "g:mitai", "おかしい 素晴らしい 恥ずかしい 怖い 寂しい 嬉しい 悲しい"],
  ["Not feeling well", "g:you-da", "今夜 具合 熱 喉 治る 注射 気分 歯医者"],
  ["Like stars in the sky", "g:no-you-na", "雲 星 光 光る 空気 砂 島 海岸"],
  ["Rain is coming, they say", "g:sou-da-hearsay", "天気予報 台風 降り出す 冷える 揺れる ぬれる 地震 止む"],
  ["Maybe it was a thief", "g:kamo-shirenai", "事故 火事 泥棒 すり 盗む 警察 危険 安全"],
  ["It should be there", "g:hazu g:hazu-ga-nai", "はず そんな きっと 決して 正しい 確か 間違える 答"],
  ["Plans for the week", "g:yotei-da", "予定 会議 計画 今度 さ来週 さ来月 都合 将来"],
  // 5. ability
  ["At the sports centre", "g:potential", "運動 柔道 テニス 試合 勝つ 負ける 投げる 打つ"],
  ["Things I can do", "g:koto-ga-dekiru", "経験 機会 技術 ピアノ 生きる 力 頑張る 一生懸命"],
  ["Easy to read, hard to write", "g:yasui g:nikui", "やすい にくい 字 発音 文法 辞典 テキスト 消しゴム"],
  ["How to use it", "g:kata", "泳ぎ方 仕方 うまい コンピューター パソコン ワープロ ファックス 故障"],
  // 6. giving and receiving favours
  ["Moving house", "g:te-ageru", "引っ越す 運ぶ 手伝う 片付ける 捨てる 棚 布団 畳"],
  ["A friend came to help", "g:te-kureru", "くれる 届ける 親切 優しい 世話 おかげ 迎える 連れる"],
  ["Asking a senior", "g:te-morau", "もらう 先輩 案内 直す 直る 調べる 予習 復習"],
  ["Thanks, and sorry", "g:te-kurete-arigatou g:te-sumimasen", "お礼 失礼 邪魔 お見舞い 挨拶 ほめる 叱る 喜ぶ"],
  ["Could you possibly…?", "g:te-itadakemasen-ka", "頂く 受付 事務所 用 用事 住所 チェック 社長"],
  ["Glad I went", "g:te-yokatta", "お祭り 花見 正月 式 会場 コンサート 楽しみ 見える"],
  // 7. aspect: preparing, finishing, changing
  ["It opens, I open it", "g:jidoushi-tadoushi", "始める 変わる 変える 動く 下がる 下げる 上がる 開く"],
  ["Ready for the party", "g:te-aru", "飾る 点く 電灯 カーテン 植える 冷房 暖房 ガラス"],
  ["Getting ready in advance", "g:te-oku", "予約 支度 用意 準備 集める 足す 包む"],
  ["I lost my wallet", "g:te-shimau", "落とす 無くなる 忘れ物 壊す 壊れる 割れる 汚れる 失敗"],
  ["Try it on", "g:te-miru", "着物 スーツ オーバー 格好 鏡 合う 絹 木綿"],
  ["Seasons go by", "g:te-iku g:te-kuru", "季節 増える 続く 進む これから 最近 このごろ 落ちる"],
  ["Start, keep, finish", "g:stem-compounds", "続ける だす おわる 最初 最後 終わり 途中 やっと"],
  // 8. time and sequence
  ["After the meeting", "g:ato-de", "課長 部長 会議室 工場 公務員 アルバイト パート 店員"],
  ["Due by Friday", "g:made-ni", "レポート 講義 試験 卒業 入学 学部 高校 大学生"],
  ["How often?", "g:goro g:ni-frequency", "一度 集まる 月 たまに しばらく そろそろ 久しぶり おき"],
  ["Music while studying", "g:nagara", "食事 ステレオ 研究 研究室 数学 科学 医学 地理"],
  ["While I was out", "g:te-iru-aida-ni", "間 留守 昼間 昼休み 夫 妻 家内 お宅"],
  ["Just about to leave", "g:tokoro-da", "帰り 出発 間に合う 急行 特急 乗り換える 空港 寄る", "京"],
  // 9. conditionals I
  ["Turn left and you'll see it", "g:to-conditional", "通り 向かう 回る 坂 線 遠く 周り 真中"],
  ["I hope it's sunny", "g:to-ii", "祈る 神社 教会 心 気持ち 両方 特に もし"],
  ["When I get there", "g:tara", "泊まる 旅館 港 舟 汽車 乗り物 交通 飛行場"],
  ["Why don't you rest?", "g:tara-dou", "入院 退院 看護師 看護婦 けがする 倒れる 太る 痩せる"],
  ["In case of an earthquake", "g:baai-wa", "場合 連絡 逃げる 火 規則 注意 戻る 急ぐ"],
  // 10. conditionals II and concession
  ["Cheaper if you buy two", "g:ba", "ねだん おつり 払う 品物 売り場 レジ 客 製"],
  ["I should have studied", "g:ba-yokatta", "受ける 点 習慣 生活 思い出す すっかり 大分 随分"],
  ["If it's sushi, then…", "g:nara", "米 味噌 漬ける アルコール 輸入 輸出 貿易 焼ける"],
  ["Even if it rains", "g:te-mo", "暮れる 森 林 草 虫 枝 葉"],
  ["Even though I studied", "g:noni", "驚く びっくりする 興味 熱心 真面目 専門 とうとう"],
  // 11. intention and decision
  ["Let's go!", "g:volitional", "訪ねる 通う 過ぎる 通る 移る オートバイ ガソリン ガソリンスタンド"],
  ["New Year's resolutions", "g:you-to-omou", "つもり 慣れる できるだけ ばかり 選ぶ 探す 役に立つ"],
  ["I've decided", "g:koto-ni-suru", "止める|やめる 決める 決まる 別れる けんか 関係 代わり"],
  ["Whether or not", "g:ka-dou-ka", "見つかる 拾う 捕まえる 済む 聞こえる 鳴る ベル"],
  // 12. obligation, permission, orders
  ["House rules", "g:nakereba-naranai", "ごみ 水道 ガス 押し入れ 引き出し 壁 隅 道具"],
  ["No need to hurry", "g:nakute-mo-ii", "丁寧 適当 細かい 大体 以内 別 まま まず"],
  ["Without breakfast", "g:nai-de", "起こす 噛む 乾く 塗る 髪 ひげ 毛"],
  ["Eat your vegetables", "g:nasai", "パパ 親 しっかり いじめる 小学校 中学校"],
  ["Stop! Don't go in!", "g:imperative g:na-prohibitive", "止める|とめる 立てる 付く 表 裏 エスカレーター 空く|あく"],
  ["What you need", "g:hitsuyou", "必要 以外 為 割合 代 ソフト タイプ"],
  ["Turn it down", "g:ku-ni-suru", "厳しい 柔らかい 複雑 いっぱい どんどん はっきり"],
  ["Not very much", "g:amari-nai", "全然 それほど ほとんど 非常に 最も ひどい"],
  ["Not that much", "g:sonna-ni", "そんなに あんな こう 腕 首 背中 指 血"],
  // 13. voice: passive, causative
  ["Stepped on in the train", "g:passive", "踏む 込む 空く|すく 騒ぐ 運転手 金持ち 滑る"],
  ["Making staff work", "g:causative", "運転 行う 工業 産業 生産 新聞社 国際"],
  ["Made to practise", "g:causative-passive", "校長 講堂 高校生 教育 競争 糸"],
  ["Only one left", "g:shika-nai", "残る 石 小鳥 内 すっと たいてい"],
  ["As many as that?", "g:number-mo", "億 人口 市 市民 都 区 町 軒"],
  ["It is said that…", "g:to-iwarete-iru", "建てる 社会 文化 世界 戦争 政治 経済 法律"],
  // 14. keigo and casual endings
  ["Welcome, sir", "g:sonkeigo-verbs", "いらっしゃる おっしゃる なさる 召し上がる おいでになる ごらんになる くださる ご存じ"],
  ["The teacher has gone home", "g:o-ni-naru", "様 お嬢さん 御主人 お子さん 祖父 祖母 亡くなる"],
  ["Please take a seat", "g:o-kudasai", "席 ご 利用 知らせる 電報 スクリーン"],
  ["Let me carry that", "g:o-suru", "送る かまう ひきだす 取り替える 時代 西洋"],
  ["Calling a company", "g:itasu", "致す 参る 申す 申し上げる 差し上げる 拝見 うかがう"],
  ["Here is your room", "g:gozaimasu", "ございます よろしい 田舎 アジア アフリカ アメリカ ビル"],
  ["See, I told you", "g:ja-nai-ka", "もうすぐ 折る 折れる とこや 家 盛ん"],
  ["I wonder if it's open", "g:kana-kashira g:kai", "君|くん 僕 ちゃん 凄い 彼ら あ"],
];

// Optional lesson note (the box above the lesson): first sentence = headline, rest = quiet lines.
const LESSON_NOTES = {
  "Turn left and you'll see it": "と says the result always follows: turn left and the station is there. The second half states a fact, never a request or a plan. For those, wait for たら and ば in the next lessons.",
  "When I get there": "たら is the all-rounder: \"if\", or \"once this has happened\". When you can't decide between と, ば and たら in speech, たら is usually the safe choice.",
  "Cheaper if you buy two": "ば puts the weight on the condition: if only this happens, the rest follows. Verbs swap their last sound for the え-sound + ば (かう → かえば, たべる → たべれば). い-adjectives take ければ (やすい → やすければ).",
  "Welcome, sir": "Keigo raises the other person or lowers yourself. This block starts with raising: special verbs for what a customer, a guest or a teacher does. You will hear them most from shop and hotel staff, so recognising them matters more than saying them.",
  "Calling a company": "Humble verbs lower your own side: まいります for going, もうします for your name, いたします for doing. Use them about yourself and your own company, never about the person you're talking to.",
};
const DIALOGUES = {
  "Cheap and simple": "l:n4-dlg-local-train",
  "Not enough time": "l:n4-dlg-late-again",
  "The person who called": "l:n4-dlg-lost-wallet",
  "Dear diary": "l:n4-dlg-anya-diary",
  "What do you think?": "l:n4-dlg-late-theory",
  "She said what?": "l:n4-dlg-yor-curry",
  "A book called…": "l:n4-dlg-library-pick",
  "My hobby is fishing": "l:n4-dlg-fishing-hobby",
  "What that means": "l:n4-dlg-polite-phrase",
  "Choosing a flat": "l:n4-dlg-boarding-house",
  "Packing for a trip": "l:n4-dlg-heavy-suitcase",
  "Just by looking": "l:n4-dlg-museum-copy",
  "Besides, and yet": "l:n4-dlg-kitchen-job",
  "Anyone can join": "l:n4-dlg-class-party",
  "Birthday wishes": "l:n4-dlg-birthday-advice",
  "Please don't be late": "l:n4-dlg-zoo-promise",
  "A child who wants everything": "l:n4-dlg-cake-counter",
  "Smells from the kitchen": "l:n4-dlg-strange-smell",
  "How deep is the lake?": "l:n4-dlg-lake-depth",
  "Looks delicious": "l:n4-dlg-lunch-menu",
  "Just like a child": "l:n4-dlg-haunted-house",
  "Not feeling well": "l:n4-dlg-sore-throat",
  "Like stars in the sky": "l:n4-dlg-night-beach",
  "Rain is coming, they say": "l:n4-dlg-typhoon-news",
  "Maybe it was a thief": "l:n4-dlg-missing-peanuts",
  "It should be there": "l:n4-dlg-wrong-answer",
  "Plans for the week": "l:n4-dlg-moving-plan",
  "At the sports centre": "l:n4-dlg-tennis-lesson",
  "Things I can do": "l:n4-dlg-pharmacy-trainee",
  "Easy to read, hard to write": "l:n4-dlg-recipe-notes",
  "How to use it": "l:n4-dlg-old-fax",
  "Moving house": "l:n4-dlg-moving-day",
  "A friend came to help": "l:n4-dlg-moving-helpers",
  "Asking a senior": "l:n4-dlg-homework-senior",
  "Thanks, and sorry": "l:n4-dlg-sick-visit",
  "Could you possibly…?": "l:n4-dlg-front-desk",
  "Glad I went": "l:n4-dlg-festival-glad",
  "It opens, I open it": "l:n4-dlg-opening-time",
  "Ready for the party": "l:n4-dlg-party-ready",
  "Getting ready in advance": "l:n4-dlg-winter-prep",
  "I lost my wallet": "l:n4-dlg-broken-window",
  "Try it on": "l:n4-dlg-try-the-suit",
  "Seasons go by": "l:n4-dlg-falling-leaves",
  "Start, keep, finish": "l:n4-dlg-favorite-book",
  "After the meeting": "l:n4-dlg-after-meeting",
  "Due by Friday": "l:n4-dlg-report-deadline",
  "How often?": "l:n4-dlg-long-time",
  "Music while studying": "l:n4-dlg-lab-lunch",
  "While I was out": "l:n4-dlg-while-out",
  "Just about to leave": "l:n4-dlg-late-for-the-plane",
  "Turn left and you'll see it": "l:n4-dlg-the-way-up",
  "I hope it's sunny": "l:n4-dlg-shrine-wish",
  "When I get there": "l:n4-dlg-island-boat",
  "Why don't you rest?": "l:n4-dlg-rest-your-leg",
  "In case of an earthquake": "l:n4-dlg-kitchen-rules",
  "Cheaper if you buy two": "l:n4-dlg-two-cakes",
  "I should have studied": "l:n4-dlg-twenty-points",
  "If it's sushi, then…": "l:n4-dlg-rice-and-miso",
  "Even if it rains": "l:n4-dlg-silver-flower",
  "Even though I studied": "l:n4-dlg-chess-beginner",
  "Let's go!": "l:n4-dlg-island-ride",
  "New Year's resolutions": "l:n4-dlg-new-year-plans",
  "I've decided": "l:n4-dlg-made-up-mind",
  "Whether or not": "l:n4-dlg-lost-notebook",
  "House rules": "l:n4-dlg-house-rules",
  "No need to hurry": "l:n4-dlg-ten-pages",
  "Without breakfast": "l:n4-dlg-no-breakfast",
  "Eat your vegetables": "l:n4-dlg-eat-your-vegetables",
  "Stop! Don't go in!": "l:n4-dlg-escalator",
  "What you need": "l:n4-dlg-what-to-pack",
  "Turn it down": "l:n4-dlg-low-heat",
  "Not very much": "l:n4-dlg-canteen-lunch",
  "Not that much": "l:n4-dlg-this-high",
  "Stepped on in the train": "l:n4-dlg-crowded-train",
  "Making staff work": "l:n4-dlg-food-fair",
  "Made to practise": "l:n4-dlg-made-to-clean",
  "Only one left": "l:n4-dlg-hundred-yen",
  "As many as that?": "l:n4-dlg-five-houses",
  "It is said that…": "l:n4-dlg-old-temple",
  "Welcome, sir": "l:n4-dlg-early-guest",
  "The teacher has gone home": "l:n4-dlg-pharmacy-counter",
  "Please take a seat": "l:n4-dlg-cinema-seat",
  "Let me carry that": "l:n4-dlg-western-book",
  "Calling a company": "l:n4-dlg-job-call",
  "Here is your room": "l:n4-dlg-country-inn",
  "See, I told you": "l:n4-dlg-broken-umbrella",
  "I wonder if it's open": "l:n4-dlg-sweet-shop",
};
// Exam guide per prep / mock unit: same shape as tools/plan-n5.js (rendered by components/prep-guide.js;
// **word** = highlight, one per trap; every kanji in a [漢字|かんじ] block). N4 numbers: 85 questions in
// 115 minutes, parts of 25 / 55 / 35 (.scratch/n4-launch/n4-format.md, from jlpt.jp). Voice: docs/level-playbook.md §7b.
const MOCK_GUIDE = {
  kindsLabel: "The three parts",
  kinds: [
    { jp: "[文字|もじ]・[語彙|ごい]", en: "Vocabulary", min: 25, ask: "Kanji reading, writing, word in context, same meaning, usage.", trap: "Spending **too long** on one word. It is one question out of 85.", tip: "Flag it and move on." },
    { jp: "[文法|ぶんぽう]・[読解|どっかい]", en: "Grammar + reading", min: 55, ask: "Grammar gaps, ★ ordering, text gaps, then reading.", trap: "Leaving **too little** for reading.", tip: "Finish grammar in about 20 minutes." },
    { jp: "[聴解|ちょうかい]", en: "Listening", min: 35, ask: "Four listening types, one replay per question.", trap: "Missing the start of a clip.", tip: "Check your volume before you start, not during the first line." }
  ],
  timeLabel: "Rules",
  rules: [
    ["Own clock.", "Each part is timed separately and locks when it ends."],
    ["Blanks count as wrong.", "A guess has a chance. A blank has none."],
    ["Flag and return.", "Inside a part you can change answers and revisit flagged questions."],
    ["Rest between parts.", "Set aside about two hours."]
  ]
};
const GUIDES = [
  { lead: "Vocabulary is part 1: about 28 questions in 25 minutes. That is under a minute each, so keep moving.",
    part: 0, partJp: "[文字|もじ]・[語彙|ごい]", glance: "**5** question types.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[漢字|かんじ][読|よ]み", en: "Kanji reading", ask: "A word in kanji is underlined. Pick its reading.", trap: "Wrong choices differ by **one or two sounds**: a missing ゛, a long vowel made short, a small っ. Some choices carry two slips at once.", tip: "Sound each choice out slowly in your head. Rushing is how しゅうかん becomes しゅかん.", eg: "しゅうかん / しゅかん" },
      { jp: "[表記|ひょうき]", en: "Writing", ask: "A word in hiragana is underlined. Pick how it is written: kanji, or katakana for a loanword.", trap: "Wrong choices swap **one piece** for a lookalike: a kanji with one stroke more, or a katakana twin.", tip: "Check every kanji of the word. For katakana, ソ and ン have been fooling people for a very long time.", eg: "ソ / ン" },
      { jp: "[文脈規定|ぶんみゃくきてい]", en: "Word in context", ask: "A sentence has a gap. Pick the word that fits.", trap: "Two choices fit the gap, but only **one fits the whole sentence**. The other is a decoy in a nice suit.", tip: "Read the whole sentence before you touch the choices. The reason (〜ので) or the object (〜を) usually decides it.", eg: "まどを ＿＿ ください。" },
      { jp: "[言|い]い[換|か]え[類義|るいぎ]", en: "Same meaning", ask: "Pick the sentence that means about the same as the underlined part.", trap: "Wrong choices change who, when, or flip it to the **opposite**.", tip: "The right one says it another way. Expect a disguise, not a copy.", eg: "るす = うちに いない" },
      { jp: "[用法|ようほう]", en: "Usage", ask: "A word is given. Pick the one sentence of four that uses it correctly.", trap: "The wrong sentences use the word where a **near-synonym** belongs. They sound almost right, which is the whole trick.", tip: "Ask what kind of word it is and what it goes with. Shoes take はく, but a hat never does.", eg: "くつを はく / ぼうしを かぶる" }
    ],
    time: "Answer what you know right away, flag the rest, come back. **Never leave a blank**: a wrong answer costs the same as an empty one, so a guess is free." },
  { lead: "Grammar is about 21 questions, roughly a minute each. That leaves more than half of the 55 minutes for reading.",
    part: 1, partJp: "[文法|ぶんぽう]", glance: "**3** question types. About **20** of the 55 minutes.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[文|ぶん]の[文法|ぶんぽう]1", en: "Sentence grammar", ask: "A gap in a sentence. Pick the particle or form. About 13 of the 21 grammar questions are this kind.", trap: "Looking at one side only. The **words after the gap** pick the form: a noun wants な, a ください wants て.", tip: "Look at the words on both sides of the gap. Your eyes will want to stop at the left one.", eg: "[道|みち]を [聞|き]かれる / [弟|おとうと]に [待|ま]たされる" },
      { jp: "[文|ぶん]の[文法|ぶんぽう]2 (★)", en: "Sentence order", ask: "Four pieces to put in order. Answer with the piece that lands on ★.", trap: "Judging pieces one by one. Particles **stick to the word before them**.", tip: "Build the whole sentence first and write the order down (1-3-4-2). Then read off the ★ slot." },
      { jp: "[文章|ぶんしょう]の[文法|ぶんぽう]", en: "Text gaps", ask: "A short text with four numbered gaps.", trap: "A choice that fits its own sentence but not **the story**: but or so, giving or receiving.", tip: "Read the sentence before and after each gap. A gap never lives alone." }
    ],
    time: "Grammar and reading share part 2 (55 minutes). If two choices both seem fine, one breaks a rule that only the full sentence shows. **Read it once more** with each choice in place." },
  { lead: "Reading is about 8 questions in the same 55 minutes as grammar. Plan on about 30 minutes for it.",
    part: 1, partJp: "[読解|どっかい]", glance: "**3** question types. About **30** of the 55 minutes.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[内容理解|ないようりかい]（[短文|たんぶん]）", en: "Short text", ask: "A note, an email or a notice of 100 to 200 characters, one question. There are three of them.", trap: "Wrong choices use words from the text in the **wrong place**. They feel right because you just read them.", tip: "Read the question first. Then find the sentence that answers it." },
      { jp: "[内容理解|ないようりかい]（[中文|ちゅうぶん]）", en: "Medium text", ask: "One longer text of about 450 characters with three questions, in the order of the text.", trap: "Stopping at the first idea. The writer's real point is often **at the end**.", tip: "The questions follow the text, so read it in pieces. Watch for でも, それで and the last lines." },
      { jp: "[情報検索|じょうほうけんさく]", en: "Information search", ask: "A timetable, a price list or a flyer of about 400 characters, with two questions.", trap: "Reading it all instead of **scanning**. It is a flyer, not a novel.", tip: "Note the conditions in the question (day, time, price, age). Then look for the one line that meets all of them." }
    ],
    time: "In this course the clock gives each reading question about 4 minutes. Kanji from the N4 list show no furigana in these questions, so **read them as you would on the day**." },
  { lead: "Listening is part 3: about 28 questions in 35 minutes, and the audio never waits for you.",
    part: 2, partJp: "[聴解|ちょうかい]", glance: "**4** question types, **1** replay each.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[課題理解|かだいりかい]", en: "Task", ask: "You hear the question first (what will the man do first?), then the talk.", trap: "People change their minds mid-talk. The answer is the **final decision**, not the first idea.", tip: "Listen for でも, じゃあ and その[前|まえ]に. Plans usually change right after them." },
      { jp: "ポイント[理解|りかい]", en: "Key point", ask: "You hear what to listen for (いつ, どこ, どうして, いくら) before the talk.", trap: "Following **everything else**. The talk offers three reasons and asks about one.", tip: "Hold on to that one word and let the rest float past." },
      { jp: "[発話表現|はつわひょうげん]", en: "Right thing to say", ask: "On the test you see a picture. Here the narrator describes the situation.", trap: "Mixing up **who does the favour**. A request and an offer can use the same verb.", tip: "Is it a request (〜ていただけませんか), an offer (〜ましょうか) or an apology? Decide before the choices start.", eg: "〜ていただけませんか" },
      { jp: "[即時応答|そくじおうとう]", en: "Quick reply", ask: "One short line and three replies, nothing printed. N4 has 8 of these.", trap: "Dwelling on one answer. It eats the next question, so **move on**.", tip: "Go with your first instinct, then let it go. A polite line expects a polite reply." }
    ],
    time: "On the real test you hear everything once. Here you get **one replay** per question, because the computer voice is slower and flatter than the real thing. Try the official sample audio too (link in Settings and on the mock results)." },
  Object.assign({ lead: "A full N4 test: 85 questions in three timed parts. You get an estimate of the real scaled score at the end." }, MOCK_GUIDE),
  { lead: "Open your mock results. The table for each もんだい shows where you lost points. Missed words come back sooner in your reviews, so do those first.",
    kindsLabel: "Three kinds of miss",
    kinds: [
      { jp: "", en: "Didn't know it", ask: "The word or grammar point was new or forgotten.", trap: "It stays **missed** unless you go back to it. Hoping is not a study method.", tip: "Study the word or grammar point again." },
      { jp: "", en: "Misread it", ask: "You knew it but picked the wrong choice.", trap: "Reading too fast on one **もんだい**. Nerves love to skip the last word.", tip: "Slow down on that もんだい." },
      { jp: "", en: "Ran out of time", ask: "Questions left blank or guessed at the end.", trap: "Staying **too long** on one question until it feels personal.", tip: "Move on sooner and come back." }
    ],
    timeLabel: "Next",
    time: "The mixed drill below has every part of the test at real pacing. Take **mock 2** when you can pass it with time to spare." },
  Object.assign({ lead: "The second full test, with all new questions. Take it a few days before the exam under exam conditions: one sitting, no notes. Treat it like the real one." }, MOCK_GUIDE)
];
// After the last lesson review: 4 section drills, mock 1, a mixed fix-up drill, mock 2 (as at N5). Counts are
// questions per mondai, or passages / listening items per format; the mix follows the official share.
const PREP = [
  ["Exam prep: vocabulary", { kanjiYomi: 3, hyouki: 3, bunmyaku: 4, iikae: 3, youhou: 3 }],
  ["Exam prep: grammar", { gap: 6, order: 3, bunshou: 1 }],
  ["Exam prep: reading", { short: 3, mid: 1, info: 2 }],
  ["Exam prep: listening", { task: 2, point: 2, utterance: 2, quick: 3 }],
  ["Full mock exam 1", null, "x:n4-mock-1"],
  ["After the mock: find and fix weak spots", { kanjiYomi: 2, hyouki: 2, bunmyaku: 2, iikae: 1, youhou: 1, gap: 4, order: 2, short: 1, mid: 1, info: 1, point: 1, quick: 2 }],
  ["Full mock exam 2", null, "x:n4-mock-2"]
];

module.exports = { level: "N4", READY, LESSONS, LESSON_NOTES, DIALOGUES, GUIDES, PREP, MOCK_GUIDE };
