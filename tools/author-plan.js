#!/usr/bin/env node
// Build data/n5/plan.js (ticket 34) from the unit outline below + the N5 catalog.
//
//   node tools/author-plan.js        # write data/n5/plan.js, print a summary
//
// The outline is the teaching decision; this script only resolves words to catalog
// ids, places kanji, inserts review units and writes the file. Edit the outline,
// not plan.js. Unit ids are given in plan order (n5.u001…); there are no users yet,
// so renumbering is fine until N5 ships — after that, keep ids stable (spec Q21).
//
// Order:
//   1. Kana: hiragana units, review, katakana units, review (map Q27). Each unit has
//      its new kana, 2–5 taught words and up to 5 practice words (≥3 words in all), all
//      readable with only the kana learned so far (checked by tests/catalog-checks.js).
//      Taught words (Q45, ticket 42) are N5 vocab whose catalog spelling is kana in the
//      unit's script (hiragana units: hiragana words, katakana units: loanwords); they get
//      SRS cards and quiz questions here and are left out of the lessons. Chosen: concrete
//      or everyday words written in kana; not bound items (さん, たち), particles,
//      conjunctions, the こそあど series (taught together in their lessons) or words a
//      lesson's grammar point is built on (ある, もう, いちばん, ください); at most 3 taken
//      from one lesson so every lesson keeps ≥7. Practice words are read-only reading
//      drills (kanji words shown in kana, or kana words a lesson still teaches).
//   2. Lessons: grammar in a Genki / Minna no Nihongo order (です → particles → ます verbs,
//      verb groups, でした, ません, ました → adjectives → existence → wants and comparisons →
//      て-form, then its family → ない-form, then its patterns → dictionary-form patterns →
//      た-form, then its patterns → plain-form patterns), vocab chosen by topic to fit each
//      unit's grammar. Each conjugation form (ticket 36) comes before every pattern built on
//      it, and the て / ない / た-form lessons have verbs in their vocab (their quiz asks for
//      that form). A review unit after every 6 lessons.
//   Load per lesson (map Q13): ~8 vocab / ~2 kanji / 1 grammar, ±25% (tests enforce 6–10
//   vocab, ≤3 kanji, ≤2 grammar). 67 grammar points over 74 lessons means some lessons are
//   vocabulary-only (counting, dates…): grammar: ''.
//   3. Kanji: placed by this script. A kanji is taught in the first lesson at or after the
//      lesson that teaches a word written with it, at most 2 per lesson, kanji whose word
//      is in the current lesson first.
// Vocab tokens: 'word' when the word is unique in the catalog, else 'word|reading'.
// Kana/kanji duplicate spellings (ticket 12): only one item is taught; the other carries
// alt: '<taught id>' in vocab.js (set via tools/n5-vocab-overrides.json) and is not listed.
"use strict";
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const load = function (rel) { vm.runInThisContext(fs.readFileSync(path.join(root, rel), "utf8"), { filename: rel }); };
load("data/catalog.js");
fs.readdirSync(path.join(root, "data/n5")).filter(function (f) { return f !== "plan.js"; }).sort()
  .forEach(function (f) { load("data/n5/" + f); });

// ── 1. Kana ────────────────────────────────────────────────────────────────
// [title, kana (space-separated), taught words, practice words, notes, marks: non-kana signs first allowed here (っ ー ッ)]
const HIRAGANA = [
  ["Hiragana: the five vowels あいうえお", "あ い う え お", "いい いいえ", "ええ 家|いえ 上|うえ 青い",
    "Hiragana is the basic Japanese script: one symbol, one syllable. Every syllable ends in one of these five vowels, always pronounced the same: a as in father, i as in machine, u as in food (lips relaxed), e as in get, o as in old (short)."],
  ["Hiragana: か row and さ row", "か き く け こ さ し す せ そ", "いす おいしい", "ここ そこ あそこ 少し 駅",
    "Consonant + vowel: k + a = か ka. The さ row has one irregular sound: し is shi, not si. Look-alikes: さ and ち are mirror images; き has two crossbars, さ one."],
  ["Hiragana: た row and な row", "た ち つ て と な に ぬ ね の", "うち おなか あなた", "いくつ 猫 犬 口",
    "Irregular sounds: ち is chi and つ is tsu. Look-alikes: ぬ (loop at the end) and め (no loop); ね, れ and わ share a left stroke and differ on the right."],
  ["Hiragana: は row and ま row", "は ひ ふ へ ほ ま み む め も", "はい はし", "もしもし 頭 名前 人|ひと",
    "ふ is fu, a soft sound between f and h. は is read wa and へ is read e when they are particles (わたしは, がっこうへ). Look-alikes: は / ほ, ま / も."],
  ["Hiragana: や, ら and わ rows, and ん", "や ゆ よ ら り る れ ろ わ を ん", "きれい かわいい おもしろい", "私|わたし これ それ 山 本",
    "The Japanese r is a light tap, between English r and l. を is read o and only marks objects. ん is the only kana with no vowel. Look-alikes: る (loop) and ろ (no loop); れ / わ / ね."],
  ["Hiragana: が and ざ rows (dakuten)", "が ぎ ぐ げ ご ざ じ ず ぜ ぞ", "かぎ まずい", "学生 映画 風 地図 水",
    "Two small strokes (゛, dakuten) voice a sound: か ka → が ga, さ sa → ざ za. じ is ji."],
  ["Hiragana: だ, ば and ぱ rows", "だ ぢ づ で ど ば び ぶ べ ぼ ぱ ぴ ぷ ぺ ぽ", "かばん たばこ どうぞ", "友達 誰 ください 散歩",
    "だ row: ぢ and づ sound like じ and ず and are rare. は row + ゛ gives b (ば ba); は row + a small circle (゜, handakuten) gives p (ぱ pa)."],
  ["Hiragana: きゃ, しゃ, ちゃ and small っ", "きゃ きゅ きょ ぎゃ ぎゅ ぎょ しゃ しゅ しょ じゃ じゅ じょ ちゃ ちゅ ちょ", "ちょっと まっすぐ せっけん", "切手 お茶 一緒 今日",
    "A small ゃ ゅ ょ after an i-sound kana makes one syllable: き + ゃ = きゃ kya (not ki-ya). A small っ doubles the next consonant with a short pause: きって kitte (stamp), not きて kite (come).", "っ"],
  ["Hiragana: にゃ to りゃ and long vowels", "にゃ にゅ にょ ひゃ ひゅ ひょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ みゃ みゅ みょ りゃ りゅ りょ", "おじいさん おばあさん しょうゆ", "百 病院 旅行 牛乳 お母さん",
    "Long vowels are written with an extra vowel kana and held for two beats: おかあさん (aa), おにいさん (ii), くうき (uu), せんせい (ei is said as a long e), おとうさん (ou is said as a long o). Length changes meaning: おばさん aunt, おばあさん grandmother."]
];
const KATAKANA = [
  ["Katakana: ア, カ, サ and タ rows, and ー", "ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト", "テスト タクシー コート", "スカート セーター",
    "Katakana writes the same sounds as hiragana, mostly for words from other languages. The bar ー makes the vowel before it long: コート kōto (coat). Look-alikes: シ shi (strokes rise from the bottom) and ツ tsu (strokes fall from the top).", "ー"],
  ["Katakana: ナ, ハ and マ rows", "ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ", "コーヒー ノート ネクタイ", "ナイフ",
    "ヘ looks almost the same in both scripts. Look-alikes: ヌ / ス, ノ / メ, マ / ア."],
  ["Katakana: ヤ, ラ and ワ rows, and ン", "ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン", "カメラ ホテル レストラン トイレ", "ハンカチ",
    "Look-alikes: ソ so and ン n (ソ's long stroke falls from the top, ン's rises from the bottom); ワ / ウ / フ; ユ / コ / ロ. ヲ is almost never used."],
  ["Katakana: ガ, ザ and ダ rows", "ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド", "ラジオ ギター カレンダー", "ドア ゼロ",
    "Dakuten works the same as in hiragana: カ → ガ, サ → ザ, タ → ダ."],
  ["Katakana: バ and パ rows", "バ ビ ブ ベ ボ パ ピ プ ペ ポ", "テレビ パン バス デパート", "ペン ボタン アパート",
    "ハ row + ゛ gives b, + ゜ gives p: ハ → バ → パ."],
  ["Katakana: small ッ and キャ to チャ", "キャ キュ キョ ギャ ギュ ギョ シャ シュ ショ ジャ ジュ ジョ チャ チュ チョ", "シャツ ベッド シャワー", "カップ マッチ",
    "Small ッ doubles the next consonant, as in hiragana: カップ kappu (cup). Small ャ ュ ョ make one syllable: シャ sha.", "ッ"],
  ["Katakana: ニャ to リャ, and ティ, フィ, フォ", "ニャ ニュ ニョ ヒャ ヒュ ヒョ ビャ ビュ ビョ ピャ ピュ ピョ ミャ ミュ ミョ リャ リュ リョ ティ フィ フォ", "ニュース パーティー フォーク", "フィルム",
    "Katakana adds small ァ ィ ゥ ェ ォ to write sounds Japanese did not have: ティ ti (パーティー party), フィ fi, フォ fo (フォーク fork)."]
];

// ── 2. Lessons ─────────────────────────────────────────────────────────────
// [title, grammar id or '', vocab tokens (space-separated)]
const LESSONS = [
  // です, questions, の, negatives (Genki 1-2, Minna 1-2)
  ["Introducing yourself", "g:wa-desu", "私|わたし 学生 先生 人|ひと さん 名前 ええ", "人 学 生"],
  ["Countries and languages", "g:ka", "国 外国 外国人 人|じん 語 英語 何|なん 何|なに 誰 どなた"],
  ["Whose is it?", "g:no", "本 辞書 鉛筆 ペン ボールペン 傘 時計", "本"],
  ["This one, that one", "g:ja-nai", "これ それ あれ どれ この その あの どの 違う"],
  ["My family", "g:mo", "家族 父 母 兄 姉 弟 妹 両親 兄弟 家庭"],
  ["Someone else's family", "g:ne", "お父さん お母さん お兄さん お姉さん 伯父さん 伯母さん 奥さん 方"],
  // places; ます verbs, verb groups, でした / ません / ました, and the verb particles (Genki 2-4, Minna 3-6)
  ["Where is it?", "g:yo", "ここ そこ あそこ どこ こちら そちら あちら どちら お手洗い"],
  ["Which way? When? How many?", "", "こっち そっち あっち どっち いつ いくつ 先 側"],
  ["Eating and drinking", "g:masu", "食べる 飲む 水 お茶 牛乳 紅茶 食べ物 飲み物"],
  ["Going and coming home", "g:ni-ikimasu", "行く|いく 来る 帰る 学校 会社 大学 駅 家|いえ アパート"],
  ["Numbers 0 to 6", "g:verb-groups-dict", "ゼロ 零 一|いち 二|に 三 四|し 四|よん 五 六", "一 二 三"],
  ["Numbers 7 to 10,000", "g:deshita", "七|しち 七|なな 八 九|きゅう 九|く 十|じゅう 百 千 万 円", "七 九 円"],
  ["What time is it?", "g:ni", "時|じ 分 半 今 午前 午後 起きる 寝る 毎日 ごろ", "時 午 前"],
  ["Days of the week", "g:masen", "月曜日 火曜日 水曜日 木曜日 金曜日 土曜日 日曜日 休み 働く", "月 火 木"],
  ["Dates: the 1st to the 10th", "", "一日|ついたち 二日 三日 四日 五日 六日 七日 八日 九日 十日", "四 五 六"],
  ["At the library", "g:wo", "図書館 読む 書く 見る 聞く 勉強 昨日 今日 明日 字引", "読 書 見"],
  ["With friends", "g:de", "友達 一緒 一人 二人 電車 地下鉄 自転車 歩く"],
  ["Going out together", "g:masen-ka", "映画 映画館 喫茶店 公園 散歩 遊ぶ 会う", "校 万 八"],
  ["This week, next week", "g:mashou", "来週 先週 今週 毎週 来月 先月 今月 毎月 旅行 ちょうど", "毎 金 土"],
  ["How long? Days, weeks, months", "g:made", "二十日 日|にち 月|がつ か月 週間 一月|ひとつき 時間 一日|いちにち 中|じゅう 中|ちゅう"],
  ["Morning and night", "g:itsumo", "いつも よく 時々 あまり 毎朝 毎晩 朝 晩 夜 今晩"],
  ["Earlier and later", "g:mashita", "今朝 昨夜 昼 時|とき 後|あと 次 初め 初めて すぎ すぐに"],
  // existence and adjectives (Genki 4-5, Minna 8-10)
  ["In my room", "g:ga-arimasu", "ある ない 部屋 机 窓 ドア 本棚"],
  ["Above, below, inside", "g:ga-imasu", "居る 上 下 中|なか 前 後ろ 隣 犬 猫 動物"],
  ["Around the house", "g:to", "台所 玄関 庭 お風呂 冷蔵庫 テーブル 廊下 階段 戸 箱"],
  ["Big and small", "g:adj-i", "大きい 小さい 新しい 古い 高い 安い 悪い つまらない"],
  ["Colours", "g:ya", "色 赤 青 黄色 黒 白 茶色 緑 同じ"],
  ["Quiet, famous, convenient", "g:adj-na", "静か 賑やか 有名 便利 元気 暇 大丈夫 大切 丈夫"],
  ["Thick, thin, wide, narrow", "", "厚い 薄い 狭い 広い りっぱ 煩い いろいろ よい 冷たい"],
  ["The weather", "g:totemo", "とても 少し 暑い 寒い 暖かい 涼しい 天気 雨|あめ 雪 差す"],
  // likes, reasons, wants, comparisons (Genki 5-10, Minna 9-13)
  ["Likes and dislikes", "g:ga", "好き 嫌い 大好き 上手 下手 分かる 音楽 スポーツ 歌 できる"],
  ["Busy and tired", "g:kara", "忙しい 楽しい 難しい 易しい 痛い 疲れる 病気 薬 風邪 たいへん"],
  ["Why? How?", "g:doushite", "どうして なぜ どう どんな こんな そう ああ ほんとう"],
  ["Holiday wishes", "g:tai", "欲しい がる 海 山 川 泳ぐ 登る 夏休み 休む 写真"],
  ["Going shopping", "g:ni-iku", "買う 買い物 店 八百屋 屋 お金 財布 いくら", "百 千"],
  ["Town and buildings", "", "町 村 建物 所 入口 出口 門 プール エレベーター"],
  ["Faster, nearer: comparing", "g:hou-ga-yori", "より ほう 多い 少ない 速い 遅い 早い 近い 遠い 飛行機"],
  ["Seasons and favourite foods", "g:naka-de-ichiban", "いちばん 春 夏 秋 冬 果物 野菜 肉 魚 たくさん"],
  // て-form, then its family (Genki 6-7, Minna 14-16); ない-form before ないでください
  ["In the classroom", "g:te-form", "ください 開ける 閉める 待つ 言う 答える 質問 もう一度 ゆっくりと 教室"],
  ["Lending a hand", "g:te-kudasai", "持つ 荷物 重い 軽い 取る|とる 貸す 借りる 返す 置く 渡す"],
  ["On the phone", "g:te-iru", "電話 かける もしもし 話す 歌う 弾く 番号"],
  ["May I?", "g:te-mo-ii", "入る 座る 立つ 使う 撮る 吸う 灰皿 マッチ"],
  ["Rules and warnings", "g:te-wa-ikemasen", "危ない 走る 押す 引く 消す つける 開く 閉まる 止まる 電気"],
  ["Morning routine", "g:te-kara", "洗う 磨く 歯 顔 あびる 朝御飯 着る 出かける"],
  ["Homework and classes", "g:mou", "もう 宿題 終わる 始まる 授業 作文 問題 練習 文章"],
  ["Learning Japanese", "g:nai-form", "まだ 漢字 平仮名 片仮名 言葉 意味 覚える 忘れる 教える 習う"],
  ["Cooking dinner", "g:mada", "晩御飯 昼御飯 御飯 料理 作る お弁当 夕飯 切る 入れる"],
  ["Setting the table", "g:mada-te-imasen", "ちゃわん カップ コップ ナイフ お皿 スプーン 花瓶"],
  // ない-forms (Genki 8, 12; Minna 17)
  ["At the doctor's", "g:nai-de-kudasai", "医者 病院 頭 目 耳 鼻 口 手 足"],
  ["The bank and the post office", "g:nakute-wa-ikenai", "銀行 郵便局 手紙 葉書 切手 封筒 出す 仕事 ポスト"],
  ["Paper, pens and pockets", "g:mashou-ka", "紙 ページ 万年筆 コピーする 貼る ハンカチ ポケット ボタン たて"],
  ["Asking the way", "g:nakute-wa-naranai", "道 角 右 左 曲がる 渡る 橋 地図 交差点"],
  ["North, south, east, west", "", "東 西 南 北 外 向こう 横 近く そば 辺"],
  ["Housework", "g:nakucha-ikenai", "洗濯 掃除 する やる 汚い 物 ストーブ 並べる"],
  // dictionary form (Genki 8-9, Minna 18)
  ["Hobbies", "g:no-ga-suki", "絵 新聞 雑誌 レコード テープ テープレコーダー ラジカセ フィルム 話"],
  ["Body and build", "g:no-ga-jouzu", "体 背|せ 強い 弱い 低い 長い 短い 太い 細い 若い"],
  ["Drawing and singing", "g:no-ga-heta", "声 大きな 小さな 赤い 青い 黄色い 黒い 白い 丸い"],
  ["Clothes", "g:mae-ni", "服 洋服 ワイシャツ セーター 上着 スカート ズボン 背広"],
  ["Putting on and taking off", "g:ta-form", "靴 靴下 はく 脱ぐ かぶる 帽子 眼鏡 締める スリッパ"],
  // た-form, then its patterns (Genki 9-11, Minna 19)
  ["Travelling abroad", "g:ta-koto-ga-aru", "大使館 留学生 切符 乗る 降りる 着く 飛ぶ 車 自動車"],
  ["Spring in the park", "g:tari-tari", "花 咲く 池 木 空 鳥 鳴く ペット 晴れ 晴れる"],
  ["Changing weather", "g:naru", "なる 曇り 曇る 降る 吹く 風|かぜ 明るい 暗い 夕方 だんだん"],
  ["Counting things", "g:dake", "だけ 個 枚 冊 台 匹 杯 人|にん 回 階"],
  ["One thing, two things", "g:ka-ka", "一つ 二つ 三つ 四つ 五つ 六つ 七つ 八つ 九つ 十|とお"],
  ["Kilos, metres and how often", "", "キロ キログラム キロメートル グラム メートル 半分 度 番|ばん ずつ くらい"],
  // plain-form patterns (Genki 8-12, Minna 20-26)
  ["Next year and last year", "g:deshou", "たぶん あさって 来年 去年 今年 さ来年 おととし 一昨日 毎年 年|とし"],
  ["Birthdays and plans", "g:tsumori", "誕生日 結婚 生まれる 歳 二十歳 大人 子供 男 女 年|ねん"],
  ["Sweet, spicy, salty", "g:hou-ga-ii", "甘い 辛い 塩 砂糖 熱い 温い 卵"],
  ["Eating too much", "g:sugiru", "牛肉 豚肉 とり肉 カレー お菓子 飴 お酒 バター 食堂"],
  ["Everyone in class", "g:node", "大勢 みんな 皆さん 自分 たち 生徒 クラス 男の子 女の子 私|わたくし"],
  ["Lost and found", "g:n-desu", "無くす 困る 警官 おまわりさん 交番 頼む 呼ぶ 知る 誰か 見せる"],
  ["Living and working", "", "住む 勤める 売る 上げる 出る 並ぶ 要る かかる 消える 死ぬ"],
  ["Polite conversation", "g:kedo", "いかが どうも 結構 嫌 じゃあ では それでは さあ お"],
  ["Linking sentences", "g:keredomo", "しかし でも そして それから また もっと 全部 ほか など"],
];

// ── resolve ────────────────────────────────────────────────────────────────
const items = Object.keys(CATALOG.items).map(function (k) { return CATALOG.items[k]; });
const vocab = items.filter(function (it) { return it.kind === "vocab"; });
const problems = [];
function vid(tok) {
  if (tok.indexOf("|") > 0) {
    if (CATALOG.items["v:" + tok]) return "v:" + tok;
    problems.push("no vocab " + tok); return null;
  }
  const hits = vocab.filter(function (v) { return v.word === tok; });
  if (hits.length !== 1) { problems.push(tok + ": " + hits.length + " matches (" + hits.map(function (h) { return h.id; }).join(", ") + ")"); return null; }
  return hits[0].id;
}
const words = function (s) { return s.split(" ").filter(Boolean).map(vid).filter(Boolean); };

const units = [];
const uid = function () { return "n5.u" + String(units.length + 1).padStart(3, "0"); };
function kanaUnits(list, script) {
  list.forEach(function (u) {
    const kana = u[1].split(" ").map(function (c) { return "c:" + c; });
    kana.forEach(function (id) { if (!CATALOG.items[id]) problems.push("no kana " + id); });
    units.push({ id: uid(), level: "N5", kind: "kana", title: u[0], kana: kana, vocab: words(u[2]), practice: words(u[3]), notes: u[4], marks: u[5] ? u[5].split(" ") : undefined });
  });
  units.push({ id: uid(), level: "N5", kind: "review", title: "Review: all " + script, quiz: { cap: 10 } });
}
kanaUnits(HIRAGANA, "hiragana");
kanaUnits(KATAKANA, "katakana");

const kanjiAll = items.filter(function (it) { return it.kind === "kanji"; }); // kanji.js order = Tanos frequency order
// Written forms per lesson, to see where each kanji shows up.
// Lesson dialogs (pilot): lesson title -> l:n5-dlg-… (data/n5/listening.js, format dialogue). Shown above the vocabulary.
// Optional lesson note (the box above the lesson): first sentence = headline, rest = quiet lines.
const LESSON_NOTES = {
  "One thing, two things": "These ten words have a rhythm: ひとつ, ふたつ, みっつ … ここのつ, とお. Songs make rhythm stick. Try searching for the Naruto \"Bijuu Kazoe Uta\" (the tailed-beast counting song) and sing along. It runs from ひとつ to ここのつ, which is most of this lesson.",
};
const DIALOGUES = {
  "Introducing yourself": "l:n5-dlg-first-class",
  "Eating and drinking": "l:n5-dlg-forger-table",
  "Countries and languages": "l:n5-dlg-new-face",
  "Whose is it?": "l:n5-dlg-lost-umbrella",
  "This one, that one": "l:n5-dlg-lost-and-found",
  "My family": "l:n5-dlg-family-photo",
  "Someone else's family": "l:n5-dlg-teachers-office",
  "Where is it?": "l:n5-dlg-school-entrance",
  "Which way? When? How many?": "l:n5-dlg-party-way",
  "Going and coming home": "l:n5-dlg-right-bus",
  "Numbers 0 to 6": "l:n5-dlg-ticket-counter",
  "Numbers 7 to 10,000": "l:n5-dlg-front-desk",
  "What time is it?": "l:n5-dlg-morning-wake",
  "Days of the week": "l:n5-dlg-days-off",
  "Dates: the 1st to the 10th": "l:n5-dlg-exam-date",
  "At the library": "l:n5-dlg-library",
  "With friends": "l:n5-dlg-going-out",
  "Going out together": "l:n5-dlg-cafe-invite",
  "This week, next week": "l:n5-dlg-next-month",
  "How long? Days, weeks, months": "l:n5-dlg-trip-length",
  "Morning and night": "l:n5-dlg-peanut-habits",
  "Earlier and later": "l:n5-dlg-first-tomato",
  "In my room": "l:n5-dlg-my-room",
  "Above, below, inside": "l:n5-dlg-where-pakkun",
  "Around the house": "l:n5-dlg-house-tour",
  "Big and small": "l:n5-dlg-bag-shop",
  "Colours": "l:n5-dlg-umbrella-colour",
  "Quiet, famous, convenient": "l:n5-dlg-herb-cafe",
  "Thick, thin, wide, narrow": "l:n5-dlg-room-viewing",
  "The weather": "l:n5-dlg-grand-weather",
  "Likes and dislikes": "l:n5-dlg-likes",
  "Busy and tired": "l:n5-dlg-new-medicine",
  "Why? How?": "l:n5-dlg-day-off-spell",
  "Holiday wishes": "l:n5-dlg-summer-wish",
  "Going shopping": "l:n5-dlg-greengrocer",
  "Town and buildings": "l:n5-dlg-sports-centre",
  "Faster, nearer: comparing": "l:n5-dlg-faster-way",
  "Seasons and favourite foods": "l:n5-dlg-best-season",
  "In the classroom": "l:n5-dlg-open-books",
  "Lending a hand": "l:n5-dlg-heavy-bag",
  "On the phone": "l:n5-dlg-phone-call",
  "May I?": "l:n5-dlg-may-i",
  "Rules and warnings": "l:n5-dlg-factory-rules",
  "Morning routine": "l:n5-dlg-morning-order",
  "Homework and classes": "l:n5-dlg-class-over",
  "Learning Japanese": "l:n5-dlg-kanji-again",
  "Cooking dinner": "l:n5-dlg-cooking-lesson",
  "Setting the table": "l:n5-dlg-table-set",
  "At the doctor's": "l:n5-dlg-clinic",
  "The bank and the post office": "l:n5-dlg-post-office",
  "Paper, pens and pockets": "l:n5-dlg-help-offer",
  "Asking the way": "l:n5-dlg-left-corner",
  "North, south, east, west": "l:n5-dlg-north-bridge",
  "Housework": "l:n5-dlg-chore-day",
  "Hobbies": "l:n5-dlg-free-time",
  "Body and build": "l:n5-dlg-sports-club",
  "Drawing and singing": "l:n5-dlg-karaoke",
  "Clothes": "l:n5-dlg-warm-jacket",
  "Putting on and taking off": "l:n5-dlg-papas-glasses",
  "Travelling abroad": "l:n5-dlg-first-flight",
  "Spring in the park": "l:n5-dlg-spring-picnic",
  "Changing weather": "l:n5-dlg-rain-coming",
  "Counting things": "l:n5-dlg-bread-spell",
  "One thing, two things": "l:n5-dlg-tangerines",
  "Kilos, metres and how often": "l:n5-dlg-stomach-medicine",
  "Next year and last year": "l:n5-dlg-new-year-plan",
  "Birthdays and plans": "l:n5-dlg-birthday-plan",
  "Sweet, spicy, salty": "l:n5-dlg-salty-eggs",
  "Eating too much": "l:n5-dlg-curry-bowls",
  "Everyone in class": "l:n5-dlg-flower-spell",
  "Lost and found": "l:n5-dlg-red-purse",
  "Living and working": "l:n5-dlg-second-job",
  "Polite conversation": "l:n5-dlg-staff-room-tea",
  "Linking sentences": "l:n5-dlg-film-date"
};
const lessonText = LESSONS.map(function (l) { return words(l[2]).map(function (id) { return CATALOG.items[id].word; }).join(" "); });
const soon = function (k, n) { return lessonText.slice(n + 1, n + 7).some(function (s) { return s.indexOf(k.char) >= 0; }); };
// Kanji placement: in the first lesson that has a word written with it, most frequent first
// (2 per lesson, 3 when the lesson has 3+ candidates). A kanji that doesn't fit waits for its
// next lesson if that comes within 6 lessons; otherwise it joins the backlog, which fills the
// next lessons with room, oldest first.
// Reading (ticket 15): each lesson review gets the first unused short passage (passages.js
// order) whose vocab and grammar are all taught by then; kanji may be untaught (the quiz shows
// their furigana). mid / info passages are kept for test prep and mocks (passagesFor in lib.js).
// items a mock uses (data/n5/mocks.js) never go into a review
const inMock = new Set([].concat.apply([], items.filter(function (it) { return it.kind === "mock"; }).map(function (m) {
  return [].concat(m.sections.vocab, m.sections.grammar, m.sections.listening).map(function (q) { return q.p || q.l || q.item; });
})));
const shortPassages = items.filter(function (it) { return it.kind === "passage" && it.format === "short" && !inMock.has(it.id); });
const usedPassages = new Set();
function pickPassage() {
  const taughtNow = new Set();
  units.forEach(function (u) { (u.vocab || []).concat(u.grammar || []).forEach(function (id) { taughtNow.add(id); }); });
  const p = shortPassages.find(function (x) {
    return !usedPassages.has(x.id) && x.uses.every(function (id) { return !/^[vg]:/.test(id) || taughtNow.has(id); });
  });
  if (p) usedPassages.add(p.id);
  return p;
}
// Listening (ticket 17): each lesson review also gets one listening item whose vocab and grammar
// are all taught by then, formats in turn (quick, task, utterance, point; the next eligible one when
// the wanted format has none yet). The rest are kept for test prep and mocks (listeningFor in lib.js).
const listenItems = items.filter(function (it) { return it.kind === "listening" && it.format !== "dialogue" && !inMock.has(it.id); });
const LISTEN_TURN = ["quick", "task", "utterance", "point"];
const usedListening = new Set();
let listenTurn = 0;
function pickListening() {
  const taughtNow = new Set();
  units.forEach(function (u) { (u.vocab || []).concat(u.grammar || []).forEach(function (id) { taughtNow.add(id); }); });
  const ok = listenItems.filter(function (x) {
    return !usedListening.has(x.id) && x.uses.every(function (id) { return !/^[vg]:/.test(id) || taughtNow.has(id); });
  });
  const want = LISTEN_TURN[listenTurn % LISTEN_TURN.length];
  const p = ok.filter(function (x) { return x.format === want; })[0] || ok[0];
  if (p) { usedListening.add(p.id); if (p.format === want) listenTurn++; }
  return p;
}
const backlog = [], placed = new Set();
let sinceReview = [];
LESSONS.forEach(function (l, n) {
  const u = { id: uid(), level: "N5", kind: "lesson", title: l[0], vocab: words(l[2]), kanji: [], grammar: l[1] ? [l[1]] : [] };
  if (l[1] && !CATALOG.items[l[1]]) problems.push("no grammar " + l[1]);
  if (LESSON_NOTES[l[0]]) u.notes = LESSON_NOTES[l[0]];
  if (DIALOGUES[l[0]]) { u.dialogue = DIALOGUES[l[0]]; if (!CATALOG.items[u.dialogue]) problems.push("no dialogue " + u.dialogue); }
  // l[3]: kanji chosen by hand for this lesson (the rest are placed automatically)
  const fixed = (l[3] || "").split(" ").filter(Boolean).map(function (c) {
    const k = CATALOG.items["k:" + c];
    if (!k || placed.has(k.id)) problems.push(l[0] + ": kanji " + c + " missing or already placed");
    else if (!lessonText.slice(0, n + 1).some(function (s) { return s.indexOf(c) >= 0; })) problems.push(l[0] + ": kanji " + c + " before any word using it");
    return k;
  }).filter(Boolean);
  fixed.forEach(function (k) { const i = backlog.indexOf(k); if (i >= 0) backlog.splice(i, 1); });
  const reserved = new Set([].concat.apply([], LESSONS.map(function (x) { return (x[3] || "").split(" ").filter(Boolean); })));
  const mine = kanjiAll.filter(function (k) {
    return !placed.has(k.id) && !reserved.has(k.char) && backlog.indexOf(k) < 0 && lessonText[n].indexOf(k.char) >= 0;
  });
  const cap = mine.length >= 3 ? 3 : 2;
  const pick = fixed.length ? fixed : mine.slice(0, cap);
  mine.filter(function (k) { return pick.indexOf(k) < 0; }).forEach(function (k) { if (!soon(k, n)) backlog.push(k); });
  while (pick.length < 2 && backlog.length) pick.push(backlog.shift());
  pick.forEach(function (k) { placed.add(k.id); u.kanji.push(k.id); });
  units.push(u);
  sinceReview.push(u);
  if (sinceReview.length === 6 || n === LESSONS.length - 1) {
    const a = units.indexOf(sinceReview[0]) + 1, b = units.length;
    const review = { id: uid(), level: "N5", kind: "review", title: "Review: units " + a + "–" + b };
    const p = pickPassage();
    if (p) review.passages = [p.id];
    const l = pickListening();
    if (l) review.listening = [l.id];
    units.push(review);
    sinceReview = [];
  }
});

// ── 4. Test prep (ticket 18) ───────────────────────────────────────────────
// After the last lesson review: strategy units, each with a timed section drill (lib.js prepDrill;
// drill = questions per mondai, or passages / listening items per format), then the two fixed full
// mocks (data/n5/mocks.js), with a mixed drill between them. The diagnostic mock (x:n5-mock-3) is
// not a unit: it opens from the Units tab anytime. Unit ids continue after the lessons (n5.u106…).
// Exam guide per prep / mock unit (rendered by components/prep-guide.js; **word** = highlight, one per trap;
// [漢字|かんじ] = furigana markup, shown with the lesson furigana toggle; every kanji must sit in a block).
// guide = { lead, part?: 0|1|2 (vocabulary / grammar+reading / listening: lights a segment of the test bar),
//           partJp?, glance?, kindsLabel, kinds: [{ jp, en, ask, trap, tip, eg?, min? }],
//           time?, timeLabel?, rules?: [[lead-in, text]] }. kinds with `min` render as a stepper (mocks).
// Voice: docs/level-playbook.md "Exam guide voice".
const MOCK_GUIDE = {
  kindsLabel: "The three parts",
  kinds: [
    { jp: "[文字|もじ]・[語彙|ごい]", en: "Vocabulary", min: 20, ask: "Kanji reading, writing, word in context, same meaning.", trap: "Spending **too long** on one word. It is one question out of 67.", tip: "Flag it and move on." },
    { jp: "[文法|ぶんぽう]・[読解|どっかい]", en: "Grammar + reading", min: 40, ask: "Grammar gaps, ★ ordering, text gaps, then reading.", trap: "Leaving **too little** for reading.", tip: "Finish grammar in about 20 minutes." },
    { jp: "[聴解|ちょうかい]", en: "Listening", min: 30, ask: "Four listening types, one replay per question.", trap: "Missing the start of a clip.", tip: "Check your volume before you start, not during the first line." }
  ],
  timeLabel: "Rules",
  rules: [
    ["Own clock.", "Each part is timed separately and locks when it ends."],
    ["Blanks count as wrong.", "A guess has a chance. A blank has none."],
    ["Flag and return.", "Inside a part you can change answers and revisit flagged questions."],
    ["Rest between parts.", "Set aside about 90 minutes."]
  ]
};
const GUIDES = [
  { lead: "Vocabulary is part 1: about 21 questions in 20 minutes. That is under a minute each, so do not marry any single word.",
    part: 0, partJp: "[文字|もじ]・[語彙|ごい]", glance: "**4** question types.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[漢字|かんじ][読|よ]み", en: "Kanji reading", ask: "A word in kanji is underlined. Pick its reading.", trap: "Wrong choices differ by **one sound**: a missing ゛, a long vowel made short, a missing small っ.", tip: "Sound each choice out slowly in your head. Rushing is how きょねん becomes きょうねん.", eg: "きょねん / きょうねん" },
      { jp: "[表記|ひょうき]", en: "Writing", ask: "A word in hiragana is underlined. Pick its kanji.", trap: "Wrong choices swap **one kanji** for a lookalike. [休|やす] and [体|からだ] love to cause trouble.", tip: "Check every kanji of the word. The impostor usually hides in the second one.", eg: "[休|やす] / [体|からだ]" },
      { jp: "[文脈規定|ぶんみゃくきてい]", en: "Word in context", ask: "A sentence has a gap. Pick the word that fits.", trap: "Two choices fit the gap, but only **one fits the whole sentence**. The other is a decoy in a nice suit.", tip: "Read the whole sentence before you touch the choices. The reason (〜から) or the object (まどを) usually decides it.", eg: "まどを ＿＿ ください。" },
      { jp: "[言|い]い[換|か]え[類義|るいぎ]", en: "Same meaning", ask: "Pick the sentence that means about the same as the underlined part.", trap: "Wrong choices change who, when, or the **opposite**. Same words, different story.", tip: "The right one often says it another way. Expect a disguise, not a copy.", eg: "たかくない = やすい" }
    ],
    time: "Answer what you know right away, flag the rest, come back. **Never leave a blank**: a wrong answer costs the same as an empty one, so a guess is free." },
  { lead: "Grammar is about 17 questions, roughly a minute each. That leaves most of the 40 minutes for reading.",
    part: 1, partJp: "[文法|ぶんぽう]", glance: "**3** question types. About **20** of the 40 minutes.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[文|ぶん]の[文法|ぶんぽう]1", en: "Sentence grammar", ask: "A gap in a sentence. Pick the particle or form.", trap: "Looking at one side only. The **verb after the gap** picks the particle, and the form before it picks the ending.", tip: "Look at the words on both sides of the gap. Your eyes will want to stop at the left one.", eg: "コーヒーを のむ / ねた ほうがいい" },
      { jp: "[文|ぶん]の[文法|ぶんぽう]2 (★)", en: "Sentence order", ask: "Four pieces to put in order. Answer with the piece that lands on ★.", trap: "Judging pieces one by one. Particles **stick to the word before them**.", tip: "Build the whole sentence first and write the order down (1-3-4-2). Then read off the ★ slot.", eg: "かばん + を" },
      { jp: "[文章|ぶんしょう]の[文法|ぶんぽう]", en: "Text gaps", ask: "A short text with numbered gaps.", trap: "A choice that fits its own sentence but not **the story**: past or future, but or so.", tip: "Read the sentence before and after each gap. A gap never lives alone." }
    ],
    time: "Grammar and reading share part 2 (40 minutes). If two choices both seem fine, one breaks a rule that only the full sentence shows. **Read it once more** with each choice in place." },
  { lead: "Reading is about 5 questions in the same 40 minutes as grammar. Plan on about 20 minutes for it.",
    part: 1, partJp: "[読解|どっかい]", glance: "**3** question types. About **20** of the 40 minutes.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[内容理解|ないようりかい]（[短文|たんぶん]）", en: "Short text", ask: "A note, an email or a notice of a few lines, one question.", trap: "Wrong choices use words from the text in the **wrong place**. They feel right because you just read them.", tip: "Read the question first. Then find the sentence that answers it." },
      { jp: "[内容理解|ないようりかい]（[中文|ちゅうぶん]）", en: "Medium text", ask: "A longer text with two questions, in the order of the text.", trap: "Stopping at the first idea. The writer's real point is often **at the end**.", tip: "Watch for でも, しかし and the last lines of the text. The twist hides there." },
      { jp: "[情報検索|じょうほうけんさく]", en: "Information search", ask: "A timetable, a price list or a flyer.", trap: "Reading it all instead of **scanning**. It is a flyer, not a novel.", tip: "Note the conditions in the question (day, time, price, who). Then look for the one line that meets all of them." }
    ],
    time: "In this course the clock gives each reading question about 4½ minutes. Kanji from the N5 list show no furigana in these questions, so **read them as you would on the day**." },
  { lead: "Listening is part 3: about 24 questions in 30 minutes, and the audio never waits for you.",
    part: 2, partJp: "[聴解|ちょうかい]", glance: "**4** question types, **1** replay each.",
    kindsLabel: "Question types",
    kinds: [
      { jp: "[課題理解|かだいりかい]", en: "Task", ask: "You hear the question first (what will the man buy?), then the talk.", trap: "People change their minds mid-talk. The answer is the **final decision**, not the first idea.", tip: "Listen for でも, じゃあ and いりません. Plans usually change right after them." },
      { jp: "ポイント[理解|りかい]", en: "Key point", ask: "You hear what to listen for (いつ, どこ, どうして, いくつ) before the talk.", trap: "Following **everything else**. The talk is chatty and almost none of it is asked.", tip: "Hold on to that one word and let the rest float past." },
      { jp: "[発話表現|はつわひょうげん]", en: "Right thing to say", ask: "On the test you see a picture. Here the narrator describes the situation.", trap: "Mixing up **who speaks to whom**. A perfect sentence to the wrong person is still wrong.", tip: "Is it a favour (〜てください), an offer (〜ましょうか) or permission (〜てもいいですか)?", eg: "〜ましょうか" },
      { jp: "[即時応答|そくじおうとう]", en: "Quick reply", ask: "One short line and three replies, nothing printed.", trap: "Dwelling on one answer. It eats the next question, so **move on**.", tip: "Go with your first instinct, then let it go." }
    ],
    time: "On the real test you hear everything once. Here you get **one replay** per question, because the computer voice is slower and flatter than the real thing. Try the official sample audio too (link in Settings and on the mock results)." },
  Object.assign({ lead: "A full N5 test: 67 questions in three timed parts. You get an estimate of the real scaled score at the end." }, MOCK_GUIDE),
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
const PREP = [
  ["Exam prep: vocabulary", { kanjiYomi: 3, hyouki: 3, bunmyaku: 3, iikae: 3 }],
  ["Exam prep: grammar", { gap: 5, order: 3, bunshou: 1 }],
  ["Exam prep: reading", { short: 2, mid: 1, info: 1 }],
  ["Exam prep: listening", { task: 1, point: 2, utterance: 2, quick: 2 }],
  ["Full mock exam 1", null, "x:n5-mock-1"],
  ["After the mock: find and fix weak spots", { kanjiYomi: 2, hyouki: 2, bunmyaku: 2, iikae: 1, gap: 3, order: 2, short: 1, info: 1, point: 1, quick: 2 }],
  ["Full mock exam 2", null, "x:n5-mock-2"]
];
PREP.forEach(function (p, i) {
  const u = { id: uid(), level: "N5", kind: p[2] ? "mock" : "prep", title: p[0], guide: GUIDES[i] };
  if (p[2]) u.mock = p[2]; else u.drill = p[1];
  units.push(u);
});

// ── report ─────────────────────────────────────────────────────────────────
const taught = new Set();
units.forEach(function (u) { ["kana", "vocab", "kanji", "grammar"].forEach(function (f) { (u[f] || []).forEach(function (id) {
  if (taught.has(id)) problems.push(id + " taught twice"); taught.add(id); }); }); });
const left = function (kind) { return items.filter(function (it) { return it.kind === kind && !taught.has(it.id) && !it.alt; }); };
["vocab", "kanji", "grammar", "kana"].forEach(function (kind) {
  const l = left(kind);
  console.log(kind + " not taught: " + l.length + (l.length ? "  " + l.map(function (it) { return it.id; }).join(" ") : ""));
});
if (problems.length) { console.error("PROBLEMS:\n  " + problems.join("\n  ")); process.exit(1); }

const header = '"use strict";\n\n// N5 plan (ticket 34): ordered units. Generated by tools/author-plan.js from its outline\n' +
  "// (the teaching order and topic choices live there). Do not edit by hand; edit the outline.\n" +
  "// Ids are opaque and never reused once N5 ships (spec §4, Q21).\n";
fs.writeFileSync(path.join(root, "data", "n5", "plan.js"), header + "PLAN.push({ level: 'N5', units: [\n" +
  units.map(function (u) { return "  " + JSON.stringify(u); }).join(",\n") + "\n] });\n");
const kinds = {};
units.forEach(function (u) { kinds[u.kind] = (kinds[u.kind] || 0) + 1; });
console.log(units.length + " units " + JSON.stringify(kinds));
