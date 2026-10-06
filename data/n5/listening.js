"use strict";

// N5 listening scripts (ticket 17): original dialogues in the four N5 聴解 formats of the official
// test (jlpt.jp sample index, format only, nothing copied or recorded from it):
//   task      = 課題理解: narrator sets the scene and asks what someone will do / buy / take; dialogue;
//               the question again; 4 options printed.
//   point     = ポイント理解: same frame, the question asks for one detail (when, where, why, how many).
//   utterance = 発話表現: the narrator describes a situation (the test shows a picture; here it is
//               spoken) and asks なんと いいますか; 3 options, heard only.
//   quick     = 即時応答: one short line, then 3 replies, heard only; no question.
//   dialogue  = not a test format: a short scene shown in a lesson unit (unit.dialogue, components/dialogue-section.js).
//               Fields: title, goal, scene, cast { M, M2 }, lines [{ speaker M | M2, furigana, en }], bridge (max 3 words the
//               unit has not taught: { text, gloss, ctx?, id? }), remixes (1-3 swaps for the lesson's Practice card:
//               { scene, en, chunks (answer chunks + 1 distractor), answer, explain }; ungraded, not in the quiz),
//               names, uses. Two men, so the second speaker is M2 (own voice archetype, tools/audio/README.md).
// Audio is pre-rendered TTS clips (audio/manifest.js, spoken from the kana readings); the browser's
// speech synthesis is the fallback when a clip is missing or cannot load.
//
// Written by hand for this project (sources: ['own']). Fields:
// - `lines`: [{ speaker: 'M' | 'F' | 'N' (narrator), furigana }]. task / point open with one N line
//   (the scene); utterance lines are all N; quick is one M or F line. Same [漢字|かな] markup and
//   kanji rules as passages.js (N5 kanji only, others in kana; full-width spaces between phrases).
//   The audio speaks the kana readings, so a kanji is never misread by the voice.
// - `question`: the narrator's question (task / point / utterance), spoken before the dialogue and
//   again after it (task / point) or before the options (utterance).
// - `options`: task / point 4 (printed); utterance / quick 3 (spoken by `optionSpeaker`, shown as
//   text only after answering). `answer`: index of the right one.
// - `en`: English of the whole script; `explain`: why the answer is right and the others are not.
// - `uses`, `names`, `verified`: as in passages.js (uses = every grammar point, content word and
//   kanji in lines, question and options; verified only when every use is verified and the checks
//   in tests/catalog-checks.js pass). Set phrases (ありがとう, すみません…) are not catalog items,
//   so none are used; はい / いいえ / ええ are avoided because those vocab items are unverified.
(function () {
function L(o) {
  o.kind = 'listening';
  o.level = 'N5';
  o.author = 'jelly-jlpt';
  o.license = 'own';
  o.sources = ['own'];
  return o;
}
// Narrator frame for task / point: "<place>で X と Y が 話しています。"
var MF = '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。';
var FRAME_USES = ['g:to', 'g:ga', 'g:te-iru', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'k:男', 'k:女', 'k:人', 'k:話'];
var ASK = 'なんと　いいますか。';
var ASK_USES = ['g:ka', 'g:masu', 'v:何|なん', 'v:言う|いう'];
function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

CATALOG.add([
  // ── quick (即時応答) ───────────────────────────────────────────────────────
  L({ id: 'l:n5-who-is-that', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'あの　かたは　どなたですか。' }],
    optionSpeaker: 'M',
    options: ['わたしの　あにです。', 'わたしの　[本|ほん]です。', 'わたしも　[学生|がくせい]です。'], answer: 0,
    en: 'Woman: Who is that person? — 1. He is my older brother. 2. It is my book. 3. I am a student too.',
    explain: 'どなた is a polite だれ, "who", so the reply names a person: わたしのあにです. The book answers "what" or "whose", and "I am a student too" says nothing about that person.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'g:mo', 'v:あの|あの', 'v:方|かた', 'v:どなた|どなた', 'v:私|わたし', 'v:兄|あに', 'v:本|ほん', 'v:学生|がくせい', 'k:本', 'k:学', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-whose-umbrella', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'これは　だれの　かさですか。' }],
    optionSpeaker: 'F',
    options: ['あそこです。', 'キムさんのです。', 'わたしの　[本|ほん]です。'], answer: 1,
    names: ['キム'],
    en: 'Man: Whose umbrella is this? — 1. It is over there. 2. It is Kim\'s. 3. It is my book.',
    explain: 'だれの asks "whose", so the reply names the owner: キムさんのです "Kim\'s". あそこです "over there" answers where, not whose. The book doesn\'t fit: the question is about an umbrella.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'v:これ|これ', 'v:誰|だれ', 'v:傘|かさ', 'v:あそこ|あそこ', 'v:さん|さん', 'v:私|わたし', 'v:本|ほん', 'k:本'],
    verified: true }),

  L({ id: 'l:n5-nationality', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'マリアさんは　どこの　[国|くに]の　[人|ひと]ですか。' }],
    optionSpeaker: 'F',
    options: ['[学生|がくせい]です。', 'えいごです。', 'ブラジル[人|じん]です。'], answer: 2,
    names: ['マリア', 'ブラジル'],
    en: 'Man: Maria, which country are you from? — 1. I am a student. 2. It is English. 3. I am Brazilian.',
    explain: 'どこの国の人 asks which country someone is from, so the reply names a country + 人: ブラジル人. 学生 is an occupation and えいご a language, not a country or nationality.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'v:さん|さん', 'v:どこ|どこ', 'v:国|くに', 'v:人|ひと', 'v:人|じん', 'v:学生|がくせい', 'v:英語|えいご', 'k:国', 'k:人', 'k:学', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-sister-student', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'キムさんの　おねえさんも　[学生|がくせい]ですか。' }],
    optionSpeaker: 'F',
    options: ['あねは　[先生|せんせい]です。', '[母|はは][は|わ]　[先生|せんせい]です。', 'わたしの　あねです。'], answer: 0,
    names: ['キム'],
    en: 'Man: Kim, is your older sister a student too? — 1. My sister is a teacher. 2. My mother is a teacher. 3. She is my older sister.',
    explain: 'The question is about Kim\'s sister. Speaking of her own sister, Kim says あね (おねえさん is for someone else\'s): "my sister is a teacher", so not a student. The mother is not asked about, and "she is my sister" does not answer whether she is a student.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'g:mo', 'v:さん|さん', 'v:お姉さん|おねえさん', 'v:学生|がくせい', 'v:姉|あね', 'v:先生|せんせい', 'v:母|はは', 'v:私|わたし', 'k:学', 'k:生', 'k:先', 'k:母'],
    verified: true }),

  L({ id: 'l:n5-get-up-time', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'まいあさ　[何|なん][時|じ]に　おきますか。' }],
    optionSpeaker: 'F',
    options: ['[六|ろく][時|じ][間|かん]　ねます。', '[六|ろく][時|じ]に　おきます。', '[六|ろく][時|じ]に　おきました。'], answer: 1,
    en: 'Man: What time do you get up every morning? — 1. I sleep six hours. 2. I get up at six. 3. I got up at six.',
    explain: 'まいあさ…おきますか asks about a habit, so the reply keeps the present ます form: 六時におきます. おきました is past (one morning), and 六時間ねます answers "how long do you sleep".',
    uses: ['g:ni', 'g:masu', 'g:ka', 'g:mashita', 'v:毎朝|まいあさ', 'v:何|なん', 'v:時|じ', 'v:起きる|おきる', 'v:六|ろく', 'v:時間|じかん', 'v:寝る|ねる', 'k:何', 'k:時', 'k:六', 'k:間'],
    verified: true }),

  L({ id: 'l:n5-where-tomorrow', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'あした　どこへ　[行|い]きますか。' }],
    optionSpeaker: 'M',
    options: ['バスで　[行|い]きます。', 'デパートへ　[行|い]きました。', 'デパートへ　[行|い]きます。'], answer: 2,
    en: 'Woman: Where are you going tomorrow? — 1. I am going by bus. 2. I went to the department store. 3. I am going to the department store.',
    explain: 'どこへ asks for a place, so the reply has a place + へ: デパートへ行きます. バスで tells how, not where, and 行きました is past, but the question is about tomorrow.',
    uses: ['g:ni-ikimasu', 'g:de', 'g:masu', 'g:mashita', 'g:ka', 'v:明日|あした', 'v:どこ|どこ', 'v:行く|いく', 'v:バス|バス', 'v:デパート|デパート', 'k:行'],
    verified: true }),

  L({ id: 'l:n5-how-much', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'この　かさは　いくらですか。' }],
    optionSpeaker: 'F',
    options: ['[一|ひと]つです。', 'あの　みせです。', '[千|せん][円|えん]です。'], answer: 2,
    en: 'Man: How much is this umbrella? — 1. It is one. 2. It is that shop. 3. It is a thousand yen.',
    explain: 'いくら asks for a price: 千円です. 一つ answers "how many" (いくつ, which sounds close), and あのみせ answers "where".',
    uses: ['g:wa-desu', 'g:ka', 'v:この|この', 'v:傘|かさ', 'v:いくら|いくら', 'v:一つ|ひとつ', 'v:あの|あの', 'v:店|みせ', 'v:千|せん', 'v:円|えん', 'k:一', 'k:千', 'k:円'],
    verified: true }),

  L({ id: 'l:n5-lunch-together', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'いっしょに　ひるごはんを　[食|た]べませんか。' }],
    optionSpeaker: 'M',
    options: ['[食|た]べませんでした。', 'いいですね。[食|た]べましょう。', 'どうぞ　[食|た]べて　ください。'], answer: 1,
    en: 'Woman: Would you like to have lunch together? — 1. I didn\'t eat. 2. Sounds good. Let\'s eat. 3. Please, go ahead and eat.',
    explain: '〜ませんか is an invitation; いいですね、〜ましょう accepts it. 食べませんでした is a past answer to "did you eat?", and どうぞ食べてください offers food to someone: it doesn\'t answer "shall we eat together".',
    uses: ['g:wo', 'g:masen-ka', 'g:mashita', 'g:mashou', 'g:ne', 'g:te-kudasai', 'v:一緒|いっしょ', 'v:昼御飯|ひるごはん', 'v:食べる|たべる', 'v:いい|いい', 'v:どうぞ|どうぞ', 'k:食'],
    verified: true }),

  L({ id: 'l:n5-been-to-kyoto', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'きょうとへ　[行|い]ったことが　ありますか。' }],
    optionSpeaker: 'F',
    options: ['きょねん　[行|い]きました。', 'きょねん　[行|い]きます。', 'きょうとへ　[行|い]って　ください。'], answer: 0,
    names: ['きょうと'],
    en: 'Man: Have you ever been to Kyoto? — 1. I went last year. 2. I go last year. 3. Please go to Kyoto.',
    explain: '〜たことがありますか asks about experience; "I went last year" says yes. きょねん (last year) needs the past 行きました, so 行きます is wrong, and 行ってください asks the man to go: not an answer.',
    uses: ['g:ta-koto-ga-aru', 'g:ni-ikimasu', 'g:mashita', 'g:te-kudasai', 'g:ka', 'v:行く|いく', 'v:ある|ある', 'v:去年|きょねん', 'k:行'],
    verified: true }),

  L({ id: 'l:n5-may-i-sit', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'ここに　すわっても　いいですか。' }],
    optionSpeaker: 'F',
    options: ['すわりました。', 'すわりたいです。', 'どうぞ、すわって　ください。'], answer: 2,
    en: 'Man: May I sit here? — 1. I sat down. 2. I want to sit down. 3. Go ahead, please sit.',
    explain: '〜てもいいですか asks for permission; どうぞ、すわってください gives it. すわりました (I sat) and すわりたいです (I want to sit) talk about the woman herself.',
    uses: ['g:ni', 'g:te-mo-ii', 'g:ka', 'g:mashita', 'g:tai', 'g:te-kudasai', 'v:ここ|ここ', 'v:座る|すわる', 'v:いい|いい', 'v:どうぞ|どうぞ'],
    verified: true }),

  L({ id: 'l:n5-why-absent', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'きのう　どうして　[学校|がっこう]を　[休|やす]みましたか。' }],
    optionSpeaker: 'M',
    options: ['[学校|がっこう]は　[九|く][時|じ]からです。', 'びょうきだったからです。', 'あしたは　[休|やす]みます。'], answer: 1,
    en: 'Woman: Why were you absent from school yesterday? — 1. School starts at nine. 2. Because I was sick. 3. I will be absent tomorrow.',
    explain: 'どうして asks for a reason; 〜からです gives one: "because I was sick". 九時からです also ends in から, but there it means "from nine o\'clock", not "because". Tomorrow is not what was asked.',
    uses: ['g:doushite', 'g:wo', 'g:mashita', 'g:ka', 'g:wa-desu', 'g:kara', 'g:deshita', 'g:masu', 'v:昨日|きのう', 'v:どうして|どうして', 'v:学校|がっこう', 'v:休む|やすむ', 'v:九|く', 'v:時|じ', 'v:病気|びょうき', 'v:明日|あした', 'k:学', 'k:校', 'k:休', 'k:九', 'k:時'],
    verified: true }),

  L({ id: 'l:n5-weather-tomorrow', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'あしたの　[天気|てんき]は　どうでしょうか。' }],
    optionSpeaker: 'F',
    options: ['[雨|あめ]が　ふるでしょう。', 'きのうは　[雨|あめ]でした。', '[雨|あめ]が　すきです。'], answer: 0,
    en: 'Man: What will the weather be like tomorrow? — 1. It will probably rain. 2. It rained yesterday. 3. I like rain.',
    explain: 'The man asks about tomorrow; 〜でしょう guesses about the future: "it will probably rain". Yesterday\'s rain is the past, and liking rain is not a forecast.',
    uses: ['g:no', 'g:wa-desu', 'g:ka', 'g:deshou', 'g:ga', 'g:deshita', 'v:明日|あした', 'v:天気|てんき', 'v:どう|どう', 'v:昨日|きのう', 'v:雨|あめ', 'v:降る|ふる', 'v:好き|すき', 'k:天', 'k:気', 'k:雨'],
    verified: true }),

  // ── utterance (発話表現) ───────────────────────────────────────────────────
  L({ id: 'l:n5-borrow-pen', format: 'utterance',
    lines: [{ speaker: 'N', furigana: 'ともだちの　ペンを　つかいたいです。' }],
    question: ASK, optionSpeaker: 'M',
    options: ['ペンを　かして　ください。', 'ペンを　かしましょうか。', 'ペンを　かりて　ください。'], answer: 0,
    en: 'Narrator: You want to use your friend\'s pen. What do you say? — 1. Please lend me your pen. 2. Shall I lend you a pen? 3. Please borrow a pen.',
    explain: 'You need the friend to lend: かす "lend" + てください, "please lend me". かしましょうか offers to lend your own pen, and かりてください asks the friend to borrow one.',
    uses: uniq(ASK_USES.concat(['g:no', 'g:wo', 'g:tai', 'g:te-kudasai', 'g:mashou-ka', 'v:友達|ともだち', 'v:ペン|ペン', 'v:使う|つかう', 'v:貸す|かす', 'v:借りる|かりる'])),
    verified: true }),

  L({ id: 'l:n5-open-window', format: 'utterance',
    lines: [{ speaker: 'N', furigana: 'へやが　あついです。まどを　あけたいです。' }],
    question: 'となりの　[人|ひと]に　' + ASK, optionSpeaker: 'F',
    options: ['まどを　しめても　いいですか。', 'まどを　あけないで　ください。', 'まどを　あけても　いいですか。'], answer: 2,
    en: 'Narrator: The room is hot. You want to open the window. What do you say to the person next to you? — 1. May I close the window? 2. Please don\'t open the window. 3. May I open the window?',
    explain: 'You want to open it yourself, so you ask permission: あけてもいいですか. しめる is "close", the opposite, and あけないでください asks the other person not to open it.',
    uses: uniq(ASK_USES.concat(['g:ga', 'g:wo', 'g:tai', 'g:no', 'g:ni', 'g:te-mo-ii', 'g:nai-de-kudasai', 'v:部屋|へや', 'v:暑い|あつい', 'v:窓|まど', 'v:開ける|あける', 'v:隣|となり', 'v:人|ひと', 'v:閉める|しめる', 'v:いい|いい', 'k:人'])),
    verified: true }),

  L({ id: 'l:n5-offer-carry', format: 'utterance',
    lines: [{ speaker: 'N', furigana: '[先生|せんせい]が　おもい　にもつを　もって　います。' }],
    question: ASK, optionSpeaker: 'M',
    options: ['にもつを　もって　ください。', 'にもつを　もちましょうか。', 'にもつを　もちませんか。'], answer: 1,
    en: 'Narrator: Your teacher is carrying heavy luggage. What do you say? — 1. Please carry the luggage. 2. Shall I carry the luggage? 3. Won\'t you carry the luggage?',
    explain: '〜ましょうか offers help: "shall I carry it?". もってください tells the teacher to carry it, and もちませんか invites the teacher to carry it: both leave the work with the teacher.',
    uses: uniq(ASK_USES.concat(['g:ga', 'g:wo', 'g:te-iru', 'g:te-kudasai', 'g:mashou-ka', 'g:masen-ka', 'v:先生|せんせい', 'v:重い|おもい', 'v:荷物|にもつ', 'v:持つ|もつ', 'k:先', 'k:生'])),
    verified: true }),

  L({ id: 'l:n5-say-again', format: 'utterance',
    lines: [{ speaker: 'N', furigana: '[先生|せんせい]の　[話|はなし]が　わかりませんでした。' }],
    question: ASK, optionSpeaker: 'F',
    options: ['もういちど　いって　ください。', 'もういちど　いいましょうか。', 'もういちど　いいます。'], answer: 0,
    en: 'Narrator: You did not understand what your teacher said. What do you say? — 1. Please say it again. 2. Shall I say it again? 3. I will say it again.',
    explain: 'You want the teacher to repeat: いってください "please say (it)". いいましょうか offers to say it yourself, and いいます says you will say it.',
    uses: uniq(ASK_USES.concat(['g:no', 'g:ga', 'g:mashita', 'g:mashou-ka', 'g:te-kudasai', 'v:先生|せんせい', 'v:話|はなし', 'v:分かる|わかる', 'v:もう一度|もういちど', 'k:先', 'k:生', 'k:話'])),
    verified: true }),

  L({ id: 'l:n5-no-smoking', format: 'utterance',
    lines: [{ speaker: 'N', furigana: '[電車|でんしゃ]の　[中|なか]で　[男|おとこ]の　[人|ひと]が　たばこを　すって　います。' }],
    question: ASK, optionSpeaker: 'F',
    options: ['ここで　たばこを　すっても　いいですよ。', 'ここで　たばこを　すわないで　ください。', 'いっしょに　たばこを　すいましょう。'], answer: 1,
    en: 'Narrator: On the train, a man is smoking. What do you say? — 1. You may smoke here. 2. Please don\'t smoke here. 3. Let\'s smoke together.',
    explain: 'Smoking is not allowed on a train, so you ask him to stop: 〜ないでください "please don\'t". The other two allow or invite smoking.',
    uses: uniq(ASK_USES.concat(['g:no', 'g:de', 'g:ga', 'g:wo', 'g:te-iru', 'g:nai-de-kudasai', 'g:te-mo-ii', 'g:yo', 'g:mashou', 'v:電車|でんしゃ', 'v:中|なか', 'v:男|おとこ', 'v:人|ひと', 'v:たばこ|たばこ', 'v:吸う|すう', 'v:ここ|ここ', 'v:いい|いい', 'v:一緒|いっしょ', 'k:電', 'k:車', 'k:中', 'k:男', 'k:人'])),
    verified: true }),

  L({ id: 'l:n5-ask-the-way', format: 'utterance',
    lines: [{ speaker: 'N', furigana: 'えきへ　[行|い]きたいです。でも、みちが　わかりません。' }],
    question: ASK, optionSpeaker: 'M',
    options: ['えきは　あそこです。', 'えきへ　[行|い]きましょう。', 'えきは　どこですか。'], answer: 2,
    en: 'Narrator: You want to go to the station, but you don\'t know the way. What do you say? — 1. The station is over there. 2. Let\'s go to the station. 3. Where is the station?',
    explain: 'You don\'t know the way, so you ask: えきはどこですか. あそこです is what someone who knows would answer, and 行きましょう invites someone to go with you.',
    uses: uniq(ASK_USES.concat(['g:ni-ikimasu', 'g:tai', 'g:ga', 'g:masen', 'g:wa-desu', 'g:mashou', 'v:駅|えき', 'v:行く|いく', 'v:でも|でも', 'v:道|みち', 'v:分かる|わかる', 'v:あそこ|あそこ', 'v:どこ|どこ', 'k:行'])),
    verified: true }),

  L({ id: 'l:n5-dog-photo', format: 'utterance',
    lines: [{ speaker: 'N', furigana: 'こうえんに　[女|おんな]の　[人|ひと]と　かわいい　いぬが　います。いぬの　しゃしんを　とりたいです。' }],
    question: '[女|おんな]の　[人|ひと]に　' + ASK, optionSpeaker: 'M',
    options: ['いぬの　しゃしんを　とって　ください。', 'いぬの　しゃしんを　とっても　いいですか。', 'いぬの　しゃしんを　とりましょうか。'], answer: 1,
    en: 'Narrator: In the park there is a woman and a cute dog. You want to take a photo of the dog. What do you say to the woman? — 1. Please take a photo of the dog. 2. May I take a photo of the dog? 3. Shall I take a photo of the dog (for you)?',
    explain: 'You will take the photo, so you ask permission: とってもいいですか. とってください asks the woman to take it, and とりましょうか offers to take one for her.',
    uses: uniq(ASK_USES.concat(['g:ni', 'g:to', 'g:ga-imasu', 'g:no', 'g:wo', 'g:tai', 'g:te-kudasai', 'g:te-mo-ii', 'g:mashou-ka', 'v:公園|こうえん', 'v:女|おんな', 'v:人|ひと', 'v:かわいい|かわいい', 'v:犬|いぬ', 'v:居る|いる', 'v:写真|しゃしん', 'v:撮る|とる', 'v:いい|いい', 'k:女', 'k:人'])),
    verified: true }),

  L({ id: 'l:n5-show-me-bag', format: 'utterance',
    lines: [{ speaker: 'N', furigana: 'デパートで　くろい　かばんを　[見|み]たいです。' }],
    question: 'みせの　[人|ひと]に　' + ASK, optionSpeaker: 'F',
    options: ['この　くろい　かばんを　[見|み]て　ください。', 'くろい　かばんを　[見|み]せましょうか。', 'その　くろい　かばんを　[見|み]せて　ください。'], answer: 2,
    en: 'Narrator: At a department store you want to look at a black bag. What do you say to the shop assistant? — 1. Please look at this black bag. 2. Shall I show you a black bag? 3. Please show me that black bag.',
    explain: '見せる is "show": 見せてください "please show me". 見てください asks the assistant to look at it, and 見せましょうか is what the assistant would say to you.',
    uses: uniq(ASK_USES.concat(['g:de', 'g:wo', 'g:tai', 'g:no', 'g:ni', 'g:te-kudasai', 'g:mashou-ka', 'v:デパート|デパート', 'v:黒い|くろい', 'v:かばん|かばん', 'v:見る|みる', 'v:店|みせ', 'v:人|ひと', 'v:この|この', 'v:見せる|みせる', 'v:その|その', 'k:見', 'k:人'])),
    verified: true }),

  // ── task (課題理解) ────────────────────────────────────────────────────────
  L({ id: 'l:n5-party-drinks', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'みせで　' + MF },
      { speaker: 'M', furigana: 'あしたの　パーティーの　のみものは　[何|なに]が　いいですか。' },
      { speaker: 'F', furigana: 'おちゃと　コーヒーを　かいましょう。' },
      { speaker: 'M', furigana: 'おちゃは　うちに　たくさん　ありますよ。' },
      { speaker: 'F', furigana: 'じゃあ、コーヒーだけ　かって　ください。' },
      { speaker: 'M', furigana: 'ぎゅうにゅうも　かいましょうか。' },
      { speaker: 'F', furigana: 'ぎゅうにゅうは　いりません。' }],
    question: '[男|おとこ]の　[人|ひと]は　[何|なに]を　かいますか。',
    options: ['おちゃ', 'おちゃと　コーヒー', 'コーヒー', 'コーヒーと　ぎゅうにゅう'], answer: 2,
    en: 'Narrator: At a shop, a man and a woman are talking. What will the man buy? — M: What drinks should we get for tomorrow\'s party? F: Let\'s buy tea and coffee. M: We have lots of tea at home. F: Then please buy just coffee. M: Shall I buy milk too? F: We don\'t need milk. — What will the man buy?',
    explain: 'Tea was the first idea, but there is plenty at home, so the woman says コーヒーだけ "just coffee", and milk is not needed (いりません).',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:no', 'g:wa-desu', 'g:ka', 'g:wo', 'g:mashou', 'g:ni', 'g:yo', 'g:dake', 'g:te-kudasai', 'g:mo', 'g:mashou-ka', 'g:masen', 'g:masu', 'v:店|みせ', 'v:明日|あした', 'v:パーティー|パーティー', 'v:飲み物|のみもの', 'v:何|なに', 'v:いい|いい', 'v:お茶|おちゃ', 'v:コーヒー|コーヒー', 'v:買う|かう', 'v:うち|うち', 'v:たくさん|たくさん', 'v:ある|ある', 'v:じゃあ|じゃあ', 'v:牛乳|ぎゅうにゅう', 'v:要る|いる', 'k:何'])),
    verified: true }),

  L({ id: 'l:n5-which-bus', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'えきの　[前|まえ]で　' + MF },
      { speaker: 'F', furigana: 'この　バスは　としょかんへ　[行|い]きますか。' },
      { speaker: 'M', furigana: 'この　バスは　[行|い]きません。[三|さん]ばんか　[七|なな]ばんの　バスに　のって　ください。' },
      { speaker: 'F', furigana: '[三|さん]ばんの　バスは　[何|なん][時|じ]に　[来|き]ますか。' },
      { speaker: 'M', furigana: '[三|さん]ばんは　[一|いち][時|じ][半|はん]です。[七|なな]ばんは　[一|いち][時|じ]です。' },
      { speaker: 'F', furigana: 'じゃあ、はやい　ほうに　のります。' }],
    question: '[女|おんな]の　[人|ひと]は　どの　バスに　のりますか。',
    options: ['[三|さん]ばんの　バス', '[七|なな]ばんの　バス', '[五|ご]ばんの　バス', 'この　バス'], answer: 1,
    en: 'Narrator: In front of a station, a man and a woman are talking. Which bus will the woman take? — F: Does this bus go to the library? M: This bus doesn\'t. Please take number 3 or number 7. F: What time does number 3 come? M: Number 3 is at 1:30. Number 7 is at 1:00. F: Then I\'ll take the earlier one. — Which bus will the woman take?',
    explain: 'Both 3 and 7 go to the library. She takes the earlier one (はやいほう): number 7 at one o\'clock comes before number 3 at half past one. The bus they are standing at does not go there, and number 5 is never mentioned.',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:wa-desu', 'g:ni-ikimasu', 'g:ka', 'g:masen', 'g:ka-ka', 'g:no', 'g:ni', 'g:te-kudasai', 'g:masu', 'v:駅|えき', 'v:前|まえ', 'k:前', 'v:この|この', 'v:バス|バス', 'v:図書館|としょかん', 'v:行く|いく', 'v:三|さん', 'v:番|ばん', 'v:七|なな', 'v:乗る|のる', 'v:何|なん', 'v:時|じ', 'v:来る|くる', 'v:一|いち', 'v:半|はん', 'v:じゃあ|じゃあ', 'v:早い|はやい', 'v:ほう|ほう', 'v:どの|どの', 'v:五|ご', 'k:行', 'k:三', 'k:七', 'k:何', 'k:時', 'k:来', 'k:一', 'k:半', 'k:五'])),
    verified: true }),

  L({ id: 'l:n5-homework-pages', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'きょうしつで　[先生|せんせい]と　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きょうの　しゅくだいです。[本|ほん]の　[三|さん][十|じゅう]ページを　[読|よ]んで　ください。それから、[三|さん][十|じゅう][一|いち]ページの　もんだいを　ノートに　[書|か]いて　ください。' },
      { speaker: 'M', furigana: '[先生|せんせい]、[三|さん][十|じゅう][二|に]ページも　しますか。' },
      { speaker: 'F', furigana: '[三|さん][十|じゅう][二|に]ページは　あした　きょうしつで　しましょう。' }],
    question: '[学生|がくせい]は　きょう　うちで　どの　ページを　しますか。',
    options: ['[三|さん][十|じゅう][一|いち]ページと　[三|さん][十|じゅう][二|に]ページ', '[三|さん][十|じゅう]ページだけ', '[三|さん][十|じゅう]ページと　[三|さん][十|じゅう][一|いち]ページ', '[三|さん][十|じゅう][二|に]ページだけ'], answer: 2,
    en: 'Narrator: In a classroom, a teacher and a student are talking. Which pages will the student do at home today? — F: Here is today\'s homework. Please read page 30 of the book. Then write the exercises on page 31 in your notebook. M: Teacher, do we do page 32 too? F: We\'ll do page 32 in class tomorrow. — Which pages will the student do at home today?',
    explain: 'The homework is reading page 30 and the exercises on page 31. Page 32 is done in class tomorrow, not at home.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'v:話す|はなす', 'k:話', 'g:de', 'g:wa-desu', 'g:no', 'g:wo', 'g:te-kudasai', 'g:ni', 'g:mo', 'g:ka', 'g:mashou', 'g:dake', 'g:masu', 'v:教室|きょうしつ', 'v:先生|せんせい', 'v:学生|がくせい', 'v:今日|きょう', 'v:宿題|しゅくだい', 'v:本|ほん', 'v:三|さん', 'v:十|じゅう', 'v:一|いち', 'v:二|に', 'v:ページ|ページ', 'v:読む|よむ', 'v:それから|それから', 'v:問題|もんだい', 'v:ノート|ノート', 'v:書く|かく', 'v:する|する', 'v:明日|あした', 'v:うち|うち', 'v:どの|どの', 'k:先', 'k:生', 'k:学', 'k:本', 'k:三', 'k:十', 'k:一', 'k:二', 'k:読', 'k:書'],
    verified: true }),

  L({ id: 'l:n5-where-to-meet', format: 'task',
    lines: [
      { speaker: 'N', furigana: MF.replace('[話|はな]して', '[電話|でんわ]で　[話|はな]して') },
      { speaker: 'M', furigana: 'あしたの　えいがは　[三|さん][時|じ]からですね。どこで　あいましょうか。' },
      { speaker: 'F', furigana: 'えきの　[前|まえ]は　どうですか。' },
      { speaker: 'M', furigana: 'えきの　[前|まえ]は　[人|ひと]が　おおいですよ。えいがかんの　[中|なか]の　きっさてんは　どうですか。' },
      { speaker: 'F', furigana: 'いいですね。じゃあ、[二|に][時|じ][半|はん]に　そこで　あいましょう。' }],
    question: '[二人|ふたり]は　どこで　あいますか。',
    options: ['えきの　[前|まえ]', 'えきの　[中|なか]の　きっさてん', 'えいがかんの　[前|まえ]', 'えいがかんの　[中|なか]の　きっさてん'], answer: 3,
    en: 'Narrator: A man and a woman are talking on the phone. Where will the two of them meet? — M: Tomorrow\'s movie is from three, right? Where shall we meet? F: How about in front of the station? M: There are a lot of people in front of the station. How about the café inside the cinema? F: Sounds good. Then let\'s meet there at half past two. — Where will the two of them meet?',
    explain: 'The woman suggests the front of the station, but the man says it is crowded and suggests the café inside the cinema. She agrees: そこで "there".',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:no', 'g:wa-desu', 'g:kara', 'g:ne', 'g:mashou-ka', 'g:ka', 'g:yo', 'g:ni', 'g:mashou', 'g:masu', 'v:電話|でんわ', 'v:明日|あした', 'v:映画|えいが', 'v:三|さん', 'v:時|じ', 'v:どこ|どこ', 'v:会う|あう', 'v:駅|えき', 'v:前|まえ', 'v:どう|どう', 'v:多い|おおい', 'v:映画館|えいがかん', 'v:中|なか', 'v:喫茶店|きっさてん', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:二|に', 'v:半|はん', 'v:そこ|そこ', 'v:二人|ふたり', 'k:電', 'k:三', 'k:時', 'k:前', 'k:中', 'k:二', 'k:半'])),
    verified: true }),

  L({ id: 'l:n5-what-to-bring', format: 'task',
    lines: [
      { speaker: 'N', furigana: '[先生|せんせい]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'あしたは　こうえんへ　[行|い]きます。おべんとうと　[水|みず]を　もって　[来|き]て　ください。[雨|あめ]は　ふりませんから、かさは　いりません。カメラは　[学校|がっこう]の　カメラを　つかいます。' }],
    question: '[学生|がくせい]は　あした　[何|なに]を　もって　[来|き]ますか。',
    options: ['おべんとうと　かさ', 'おべんとうと　[水|みず]', '[水|みず]と　カメラ', 'かさと　カメラ'], answer: 1,
    en: 'Narrator: A teacher is talking. What will the students bring tomorrow? — F: Tomorrow we are going to the park. Please bring a packed lunch and water. It won\'t rain, so you don\'t need an umbrella. For cameras, we\'ll use the school\'s camera. — What will the students bring tomorrow?',
    explain: 'もって来てください names the lunch and the water. No umbrella (it won\'t rain), and the class uses the school\'s camera, so nobody brings one.',
    uses: ['g:ga', 'g:te-iru', 'g:ni-ikimasu', 'g:to', 'g:wo', 'g:te-kudasai', 'g:kara', 'g:masen', 'g:no', 'g:ka', 'g:te-form', 'g:masu', 'v:先生|せんせい', 'v:話す|はなす', 'v:明日|あした', 'v:公園|こうえん', 'v:行く|いく', 'v:お弁当|おべんとう', 'v:水|みず', 'v:持つ|もつ', 'v:来る|くる', 'v:雨|あめ', 'v:降る|ふる', 'v:傘|かさ', 'v:要る|いる', 'v:カメラ|カメラ', 'v:学校|がっこう', 'v:使う|つかう', 'v:学生|がくせい', 'v:何|なに', 'k:先', 'k:生', 'k:話', 'k:行', 'k:水', 'k:来', 'k:雨', 'k:学', 'k:校', 'k:何'],
    verified: true }),

  L({ id: 'l:n5-first-after-school', format: 'task',
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[学生|がくせい]と　[女|おんな]の　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きょう、うちへ　かえってから　[何|なに]を　しますか。' },
      { speaker: 'M', furigana: 'しゅくだいが　たくさん　あります。でも、いぬの　さんぽに　[行|い]ってから　します。' },
      { speaker: 'F', furigana: 'ばんごはんは？' },
      { speaker: 'M', furigana: 'しゅくだいの　あとで　[食|た]べます。' }],
    question: '[男|おとこ]の　[学生|がくせい]は　うちへ　かえって、はじめに　[何|なに]を　しますか。',
    options: ['いぬの　さんぽに　[行|い]きます', 'しゅくだいを　します', 'ばんごはんを　[食|た]べます', 'おふろに　[入|はい]ります'], answer: 0,
    en: 'Narrator: A male student and a female student are talking. What will the male student do first when he gets home? — F: What are you doing after you get home today? M: I have a lot of homework. But I\'ll do it after I take the dog for a walk. F: And dinner? M: I\'ll eat after my homework. — What will the male student do first when he gets home?',
    explain: '〜てから "after ~": he walks the dog first, then does the homework, then eats dinner. The bath is never mentioned.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:ni-ikimasu', 'g:te-kara', 'g:wo', 'g:ka', 'g:no', 'g:ni-iku', 'g:de', 'g:ni', 'g:te-form', 'g:masu', 'v:男|おとこ', 'v:学生|がくせい', 'v:女|おんな', 'v:話す|はなす', 'v:今日|きょう', 'v:うち|うち', 'v:帰る|かえる', 'v:何|なに', 'v:する|する', 'v:宿題|しゅくだい', 'v:たくさん|たくさん', 'v:ある|ある', 'v:でも|でも', 'v:犬|いぬ', 'v:散歩|さんぽ', 'v:行く|いく', 'v:晩御飯|ばんごはん', 'v:後|あと', 'v:食べる|たべる', 'v:初め|はじめ', 'v:お風呂|おふろ', 'v:入る|はいる', 'k:男', 'k:学', 'k:生', 'k:女', 'k:話', 'k:何', 'k:行', 'k:食', 'k:入'],
    verified: true }),

  L({ id: 'l:n5-hotel-floor', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'ホテルで　[女|おんな]の　[人|ひと]と　ホテルの　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'レストランは　どこですか。' },
      { speaker: 'M', furigana: '[五|ご]かいです。エレベーターは　あちらです。' },
      { speaker: 'F', furigana: '[二|に]かいに　みせが　ありますね。' },
      { speaker: 'M', furigana: '[二|に]かいの　みせは　[六|ろく][時|じ]までです。' },
      { speaker: 'F', furigana: 'じゃあ、[先|さき]に　みせへ　[行|い]きます。レストランは　その　あとで　[行|い]きます。' }],
    question: '[女|おんな]の　[人|ひと]は　はじめに　どこへ　[行|い]きますか。',
    options: ['[二|に]かいの　みせ', '[二|に]かいの　レストラン', '[五|ご]かいの　みせ', '[五|ご]かいの　レストラン'], answer: 0,
    en: 'Narrator: At a hotel, a woman and a hotel employee are talking. Where will the woman go first? — F: Where is the restaurant? M: On the fifth floor. The elevator is over there. F: There are shops on the second floor, aren\'t there? M: The shops on the second floor are open until six. F: Then I\'ll go to the shops first. I\'ll go to the restaurant after that. — Where will the woman go first?',
    explain: 'The shops close at six, so she goes to the shops on the 2nd floor first (先に) and to the restaurant on the 5th floor afterwards.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:no', 'g:wa-desu', 'g:ka', 'g:ni', 'g:ga-arimasu', 'g:ne', 'g:made', 'g:ni-ikimasu', 'g:masu', 'v:ホテル|ホテル', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:レストラン|レストラン', 'v:どこ|どこ', 'v:五|ご', 'v:階|かい', 'v:エレベーター|エレベーター', 'v:あちら|あちら', 'v:二|に', 'v:店|みせ', 'v:ある|ある', 'v:六|ろく', 'v:時|じ', 'v:じゃあ|じゃあ', 'v:先|さき', 'v:行く|いく', 'v:その|その', 'v:後|あと', 'v:初め|はじめ', 'k:女', 'k:人', 'k:話', 'k:五', 'k:二', 'k:六', 'k:時', 'k:先', 'k:行'],
    verified: true }),

  L({ id: 'l:n5-sunday-plans', format: 'task',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'F', furigana: 'どようびと　にちようびは　[何|なに]を　しますか。' },
      { speaker: 'M', furigana: 'どようびは　ともだちと　[山|やま]に　のぼる　つもりです。' },
      { speaker: 'F', furigana: 'にちようびは？' },
      { speaker: 'M', furigana: 'にちようびは　つかれて　いますから、うちで　[本|ほん]を　[読|よ]んだり、テレビを　[見|み]たり　します。' }],
    question: '[男|おとこ]の　[人|ひと]は　にちようびに　[何|なに]を　しますか。',
    options: ['[山|やま]に　のぼります', 'うちで　[本|ほん]を　[読|よ]みます', 'ともだちと　あいます', 'デパートへ　かいものに　[行|い]きます'], answer: 1,
    en: 'Narrator: A man and a woman are talking. What will the man do on Sunday? — F: What are you doing on Saturday and Sunday? M: On Saturday I plan to climb a mountain with a friend. F: And Sunday? M: On Sunday I\'ll be tired, so I\'ll read books and watch TV at home and so on. — What will the man do on Sunday?',
    explain: 'The mountain with a friend is Saturday. On Sunday he stays home: 本を読んだり、テレビを見たり (reading, watching TV and so on). Shopping is never mentioned.',
    uses: uniq(FRAME_USES.concat(['g:wa-desu', 'g:wo', 'g:ka', 'g:ni', 'g:tsumori', 'g:kara', 'g:de', 'g:tari-tari', 'g:ni-iku', 'g:ni-ikimasu', 'g:masu', 'v:土曜日|どようび', 'v:日曜日|にちようび', 'v:何|なに', 'v:する|する', 'v:友達|ともだち', 'v:山|やま', 'v:登る|のぼる', 'v:疲れる|つかれる', 'v:うち|うち', 'v:本|ほん', 'v:読む|よむ', 'v:テレビ|テレビ', 'v:見る|みる', 'v:会う|あう', 'v:デパート|デパート', 'v:買い物|かいもの', 'v:行く|いく', 'k:何', 'k:山', 'k:本', 'k:読', 'k:見', 'k:行'])),
    verified: true }),

  L({ id: 'l:n5-restaurant-order', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'レストランで　' + MF },
      { speaker: 'M', furigana: '[何|なに]を　[食|た]べますか。この　カレーは　おいしいですよ。' },
      { speaker: 'F', furigana: 'カレーは　ちょっと　からいですから…。さかなは　どうですか。' },
      { speaker: 'M', furigana: 'さかなは　きょうは　ありません。とりにくか　ぶたにくの　りょうりが　ありますよ。' },
      { speaker: 'F', furigana: 'わたしは　ぶたにくが　あまり　すきじゃありません。' },
      { speaker: 'M', furigana: 'じゃあ、とりにくですね。' },
      { speaker: 'F', furigana: 'そうですね。それを　[食|た]べます。' }],
    question: '[女|おんな]の　[人|ひと]は　[何|なに]を　[食|た]べますか。',
    options: ['カレー', 'さかなの　りょうり', 'ぶたにくの　りょうり', 'とりにくの　りょうり'], answer: 3,
    en: 'Narrator: At a restaurant, a man and a woman are talking. What will the woman eat? — M: What will you eat? This curry is good. F: Curry is a bit spicy, so… How about fish? M: There\'s no fish today. There are chicken or pork dishes. F: I don\'t really like pork. M: Then the chicken, right? F: Yes. I\'ll eat that. — What will the woman eat?',
    explain: 'Curry is too spicy for her, there is no fish today, and she doesn\'t like pork, so the man says とりにく and she agrees: the chicken dish.',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:wo', 'g:ka', 'g:wa-desu', 'g:yo', 'g:kara', 'g:ka-ka', 'g:no', 'g:ja-nai', 'g:ne', 'g:masu', 'v:レストラン|レストラン', 'v:何|なに', 'v:食べる|たべる', 'v:この|この', 'v:カレー|カレー', 'v:おいしい|おいしい', 'v:ちょっと|ちょっと', 'v:辛い|からい', 'v:魚|さかな', 'v:どう|どう', 'v:今日|きょう', 'v:ある|ある', 'v:とり肉|とりにく', 'v:豚肉|ぶたにく', 'v:料理|りょうり', 'v:私|わたし', 'v:あまり|あまり', 'v:好き|すき', 'v:じゃあ|じゃあ', 'v:そう|そう', 'v:それ|それ', 'k:何', 'k:食'])),
    verified: true }),

  L({ id: 'l:n5-doctor-advice', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'びょういんで　おいしゃさんと　[男|おとこ]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'かぜですね。この　くすりを　ばんごはんの　あとで　のんで　ください。' },
      { speaker: 'M', furigana: 'おふろに　[入|はい]っても　いいですか。' },
      { speaker: 'F', furigana: 'きょうは　[入|はい]らない　ほうが　いいですね。はやく　ねて　ください。' },
      { speaker: 'M', furigana: 'あしたは　しごとに　[行|い]っても　いいですか。' },
      { speaker: 'F', furigana: 'あしたは　[休|やす]んで　ください。' }],
    question: '[男|おとこ]の　[人|ひと]は　きょう　うちで　[何|なに]を　しますか。',
    options: ['おふろに　[入|はい]って、はやく　ねます', 'くすりを　のんで、おふろに　[入|はい]ります', 'くすりを　のんで、はやく　ねます', 'しごとに　[行|い]きます'], answer: 2,
    en: 'Narrator: At a hospital, a doctor and a man are talking. What will the man do at home today? — F: It\'s a cold. Please take this medicine after dinner. M: May I take a bath? F: Today you\'d better not. Please go to bed early. M: May I go to work tomorrow? F: Please rest tomorrow. — What will the man do at home today?',
    explain: 'He takes the medicine after dinner and goes to bed early. 入らないほうがいい means "better not take a bath", and work is about tomorrow (and the doctor says to rest).',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:wa-desu', 'g:ne', 'g:wo', 'g:no', 'g:te-kudasai', 'g:ni', 'g:te-mo-ii', 'g:ka', 'g:nai-form', 'g:hou-ga-ii', 'g:ni-iku', 'g:te-form', 'g:masu', 'v:病院|びょういん', 'v:お|お', 'v:医者|いしゃ', 'v:さん|さん', 'v:男|おとこ', 'v:人|ひと', 'v:話す|はなす', 'v:風邪|かぜ', 'v:この|この', 'v:薬|くすり', 'v:晩御飯|ばんごはん', 'v:後|あと', 'v:飲む|のむ', 'v:お風呂|おふろ', 'v:入る|はいる', 'v:いい|いい', 'v:今日|きょう', 'v:ほう|ほう', 'v:早い|はやい', 'v:寝る|ねる', 'v:明日|あした', 'v:仕事|しごと', 'v:行く|いく', 'v:休む|やすむ', 'v:うち|うち', 'v:何|なに', 'v:する|する', 'k:男', 'k:人', 'k:話', 'k:入', 'k:行', 'k:休', 'k:何'],
    verified: true }),

  L({ id: 'l:n5-which-shirt', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'デパートで　' + MF },
      { speaker: 'M', furigana: 'この　しろい　シャツと　あおい　シャツと、どちらが　いいですか。' },
      { speaker: 'F', furigana: 'あおい　ほうが　いいですね。しろいのは　ちょっと　[小|ちい]さいですよ。' },
      { speaker: 'M', furigana: 'でも、あおいのは　[高|たか]いですね。[五|ご][千|せん][円|えん]です。' },
      { speaker: 'F', furigana: 'じゃあ、この　くろい　シャツは？　[千|せん][円|えん]ですよ。' },
      { speaker: 'M', furigana: 'くろいのは　あまり　すきじゃありません。あおいのを　かいます。' }],
    question: '[男|おとこ]の　[人|ひと]は　どの　シャツを　かいますか。',
    options: ['しろい　シャツ', 'あおい　シャツ', 'くろい　シャツ', 'しろい　シャツと　あおい　シャツ'], answer: 1,
    en: 'Narrator: At a department store, a man and a woman are talking. Which shirt will the man buy? — M: Which is better, this white shirt or the blue shirt? F: The blue one is better. The white one is a bit small. M: But the blue one is expensive. It\'s 5,000 yen. F: Then how about this black shirt? It\'s 1,000 yen. M: I don\'t really like the black one. I\'ll buy the blue one. — Which shirt will the man buy?',
    explain: 'The white one is too small and he doesn\'t like the black one, so in the end he buys the blue one (あおいのをかいます) even though it costs more.',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:wa-desu', 'g:ka', 'g:ne', 'g:yo', 'g:no', 'g:ja-nai', 'g:wo', 'g:masu', 'v:デパート|デパート', 'v:この|この', 'v:白い|しろい', 'v:シャツ|シャツ', 'v:青い|あおい', 'v:どちら|どちら', 'v:いい|いい', 'v:ほう|ほう', 'v:ちょっと|ちょっと', 'v:小さい|ちいさい', 'v:でも|でも', 'v:高い|たかい', 'v:五|ご', 'v:千|せん', 'v:円|えん', 'v:じゃあ|じゃあ', 'v:黒い|くろい', 'v:あまり|あまり', 'v:好き|すき', 'v:買う|かう', 'v:どの|どの', 'k:小', 'k:高', 'k:五', 'k:千', 'k:円'])),
    verified: true }),

  L({ id: 'l:n5-clean-room-first', format: 'task',
    lines: [
      { speaker: 'N', furigana: 'うちで　お[母|かあ]さんと　[男|おとこ]の[子|こ]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'へやの　そうじは　もう　しましたか。' },
      { speaker: 'M', furigana: 'まだです。いまから　テレビを　[見|み]ます。' },
      { speaker: 'F', furigana: 'テレビは　あとで　[見|み]て　ください。[先|さき]に　へやを　そうじしなくちゃ　いけませんよ。' },
      { speaker: 'M', furigana: 'わかりました。でも、しゅくだいも　あります。' },
      { speaker: 'F', furigana: 'しゅくだいは　そうじの　あとで　して　ください。' }],
    question: '[男|おとこ]の[子|こ]は　はじめに　[何|なに]を　しますか。',
    options: ['テレビを　[見|み]ます', 'しゅくだいを　します', '[本|ほん]を　[読|よ]みます', 'へやを　そうじします'], answer: 3,
    en: 'Narrator: At home, a mother and her son are talking. What will the boy do first? — F: Have you cleaned your room yet? M: Not yet. I\'m going to watch TV now. F: Watch TV later. You have to clean your room first. M: OK. But I have homework too. F: Do your homework after the cleaning. — What will the boy do first?',
    explain: 'The mother says 先にへやをそうじしなくちゃいけません: cleaning comes first, then homework (そうじのあとで), and TV later. Reading a book is never mentioned.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:no', 'g:wa-desu', 'g:mou', 'g:mashita', 'g:ka', 'g:mada', 'g:kara', 'g:wo', 'g:te-kudasai', 'g:nakucha-ikenai', 'g:yo', 'g:mo', 'g:masu', 'v:うち|うち', 'v:お母さん|おかあさん', 'v:男の子|おとこのこ', 'v:話す|はなす', 'v:部屋|へや', 'v:掃除|そうじ', 'v:もう|もう', 'v:する|する', 'v:まだ|まだ', 'v:今|いま', 'v:テレビ|テレビ', 'v:見る|みる', 'v:後|あと', 'v:先|さき', 'v:分かる|わかる', 'v:でも|でも', 'v:宿題|しゅくだい', 'v:ある|ある', 'v:初め|はじめ', 'v:何|なに', 'v:本|ほん', 'v:読む|よむ', 'k:母', 'k:男', 'k:子', 'k:話', 'k:見', 'k:先', 'k:何', 'k:本', 'k:読'],
    verified: true }),

  // ── point (ポイント理解) ───────────────────────────────────────────────────
  L({ id: 'l:n5-birthday', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'M', furigana: 'たんじょうびは　いつですか。' },
      { speaker: 'F', furigana: '[九|く][月|がつ][八日|ようか]です。' },
      { speaker: 'M', furigana: '[九|く][月|がつ][四日|よっか]ですか。' },
      { speaker: 'F', furigana: '[四日|よっか]じゃありません。[八日|ようか]です。' },
      { speaker: 'M', furigana: 'わたしは　[十|じゅう][月|がつ][四日|よっか]です。' }],
    question: '[女|おんな]の　[人|ひと]の　たんじょうびは　いつですか。',
    options: ['[九|く][月|がつ][四日|よっか]', '[九|く][月|がつ][八日|ようか]', '[十|じゅう][月|がつ][四日|よっか]', '[十|じゅう][月|がつ][八日|ようか]'], answer: 1,
    en: 'Narrator: A man and a woman are talking. When is the woman\'s birthday? — M: When is your birthday? F: September 8th. M: September 4th? F: Not the 4th. The 8th. M: Mine is October 4th. — When is the woman\'s birthday?',
    explain: 'Listen for ようか (8th) against よっか (4th): she corrects him, 四日じゃありません、八日です. October 4th is the man\'s birthday.',
    uses: uniq(FRAME_USES.concat(['g:wa-desu', 'g:ka', 'g:ja-nai', 'g:no', 'v:誕生日|たんじょうび', 'v:いつ|いつ', 'v:九|く', 'v:月|がつ', 'v:八日|ようか', 'v:四日|よっか', 'v:私|わたし', 'v:十|じゅう', 'k:九', 'k:月', 'k:八', 'k:日', 'k:四', 'k:十'])),
    verified: true }),

  L({ id: 'l:n5-why-late', format: 'point',
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　' + MF },
      { speaker: 'F', furigana: 'きょうは　どうして　おそかったんですか。[電車|でんしゃ]が　とまりましたか。' },
      { speaker: 'M', furigana: '[電車|でんしゃ]は　だいじょうぶでした。あさ、[雨|あめ]が　ふって　いましたから、バスで　えきへ　[行|い]きました。でも、バスが　とても　おそかったんです。' }],
    question: '[男|おとこ]の　[人|ひと]は　どうして　おそく　なりましたか。',
    options: ['バスが　おそかったから', '[電車|でんしゃ]が　とまったから', 'あさ　おそく　おきたから', 'かさを　わすれたから'], answer: 0,
    en: 'Narrator: At a company, a man and a woman are talking. Why was the man late? — F: Why were you late today? Did the train stop? M: The train was fine. In the morning it was raining, so I took the bus to the station. But the bus was very slow. — Why was the man late?',
    explain: 'The woman guesses the train stopped, but he says the train was fine (大丈夫でした): the bus he took because of the rain was slow. Getting up late and forgetting an umbrella are never mentioned.',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:wa-desu', 'g:doushite', 'g:adj-i', 'g:n-desu', 'g:ka', 'g:mashita', 'g:deshita', 'g:kara', 'g:ni-ikimasu', 'g:ta-form', 'g:naru', 'g:wo', 'v:会社|かいしゃ', 'v:今日|きょう', 'v:どうして|どうして', 'v:遅い|おそい', 'v:電車|でんしゃ', 'v:止まる|とまる', 'v:大丈夫|だいじょうぶ', 'v:朝|あさ', 'v:雨|あめ', 'v:降る|ふる', 'v:バス|バス', 'v:駅|えき', 'v:行く|いく', 'v:でも|でも', 'v:とても|とても', 'v:なる|なる', 'v:起きる|おきる', 'v:傘|かさ', 'v:忘れる|わすれる', 'k:電', 'k:車', 'k:雨', 'k:行'])),
    verified: true }),

  L({ id: 'l:n5-how-many-plates', format: 'point',
    lines: [
      { speaker: 'N', furigana: 'うちで　' + MF },
      { speaker: 'F', furigana: 'きょうは　ともだちが　[三|さん][人|にん]　[来|き]ます。おさらを　[出|だ]して　ください。' },
      { speaker: 'M', furigana: 'わたしたちの　おさらも　いりますね。じゃあ、[五|ご]まいですね。' },
      { speaker: 'F', furigana: 'ともだちの　[山川|やまかわ]さんの　おくさんも　[来|き]ますから、[六|ろく]まい　[出|だ]して　ください。' }],
    question: '[男|おとこ]の　[人|ひと]は　おさらを　[何|なん]まい　[出|だ]しますか。',
    options: ['[三|さん]まい', '[四|よん]まい', '[五|ご]まい', '[六|ろく]まい'], answer: 3,
    names: ['山川|やまかわ'],
    en: 'Narrator: At home, a man and a woman are talking. How many plates will the man put out? — F: Three friends are coming today. Please put out the plates. M: We need plates for us too. So, five, right? F: The wife of our friend Mr. Yamakawa is coming too, so please put out six. — How many plates will the man put out?',
    explain: 'Three friends plus the two of them makes five, and Mr. Yamakawa\'s wife is coming too: 六まい. Listen for the last number, not the first.',
    uses: uniq(FRAME_USES.concat(['g:de', 'g:wa-desu', 'g:wo', 'g:te-kudasai', 'g:no', 'g:mo', 'g:ne', 'g:kara', 'g:ka', 'g:masu', 'v:うち|うち', 'v:今日|きょう', 'v:友達|ともだち', 'v:三|さん', 'v:人|にん', 'v:来る|くる', 'v:お皿|おさら', 'v:出す|だす', 'v:私|わたし', 'v:たち|たち', 'v:要る|いる', 'v:じゃあ|じゃあ', 'v:五|ご', 'v:枚|まい', 'v:さん|さん', 'v:奥さん|おくさん', 'v:六|ろく', 'v:何|なん', 'v:四|よん', 'k:三', 'k:来', 'k:出', 'k:五', 'k:山', 'k:川', 'k:六', 'k:何', 'k:四'])),
    verified: true }),

  L({ id: 'l:n5-where-key', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'M', furigana: 'かぎが　ありません。つくえの　[上|うえ]に　ありませんか。' },
      { speaker: 'F', furigana: 'つくえの　[上|うえ]には　ありませんよ。いすの　[下|した]は？' },
      { speaker: 'M', furigana: 'いすの　[下|した]にも　ありません。' },
      { speaker: 'F', furigana: 'あ、ドアの　[前|まえ]に　ありましたよ。' }],
    question: 'かぎは　どこに　ありましたか。',
    options: ['つくえの　[上|うえ]', 'いすの　[下|した]', 'ドアの　[下|した]', 'ドアの　[前|まえ]'], answer: 3,
    en: 'Narrator: A man and a woman are talking. Where was the key? — M: My key is gone. Isn\'t it on the desk? F: It\'s not on the desk. What about under the chair? M: It\'s not under the chair either. F: Oh, it was in front of the door. — Where was the key?',
    explain: 'The desk and the chair are checked and the key is not there (ありません). The woman finds it in front of the door: ドアの前にありました.',
    uses: uniq(FRAME_USES.concat(['g:no', 'g:ni', 'g:ka', 'g:masen', 'g:yo', 'g:mo', 'g:mashita', 'v:かぎ|かぎ', 'v:ある|ある', 'v:机|つくえ', 'v:上|うえ', 'v:いす|いす', 'v:下|した', 'v:ドア|ドア', 'v:前|まえ', 'v:どこ|どこ', 'k:上', 'k:下', 'k:前'])),
    verified: true }),

  L({ id: 'l:n5-how-to-school', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'F', furigana: '[学校|がっこう]まで　バスで　[来|き]ますか。' },
      { speaker: 'M', furigana: 'バスは　[高|たか]いですから、のりません。' },
      { speaker: 'F', furigana: 'じゃあ、[電車|でんしゃ]ですか。' },
      { speaker: 'M', furigana: '[電車|でんしゃ]は　えきが　とおいですから…。じてんしゃで　[来|き]ます。[雨|あめ]の　ときは　あるいて　[来|き]ます。' }],
    question: '[男|おとこ]の　[人|ひと]は　いつも　[何|なに]で　[学校|がっこう]へ　[来|き]ますか。',
    options: ['じてんしゃ', 'バス', '[電車|でんしゃ]', 'あるいて'], answer: 0,
    en: 'Narrator: A man and a woman are talking. How does the man usually come to school? — F: Do you come to school by bus? M: The bus is expensive, so I don\'t take it. F: Then by train? M: The station is far for the train… I come by bicycle. When it rains, I walk. — How does the man usually come to school?',
    explain: 'Bus (too expensive) and train (station too far) are ruled out. He comes by bicycle; walking is only for rainy days, so usually (いつも) it is the bicycle.',
    uses: uniq(FRAME_USES.concat(['g:made', 'g:de', 'g:ka', 'g:wa-desu', 'g:kara', 'g:masen', 'g:no', 'g:itsumo', 'g:ni-ikimasu', 'g:te-form', 'g:masu', 'v:学校|がっこう', 'v:バス|バス', 'v:来る|くる', 'v:高い|たかい', 'v:乗る|のる', 'v:じゃあ|じゃあ', 'v:電車|でんしゃ', 'v:駅|えき', 'v:遠い|とおい', 'v:自転車|じてんしゃ', 'v:雨|あめ', 'v:時|とき', 'v:歩く|あるく', 'v:いつも|いつも', 'v:何|なに', 'k:学', 'k:校', 'k:来', 'k:高', 'k:電', 'k:車', 'k:雨', 'k:何'])),
    verified: true }),

  L({ id: 'l:n5-library-closed', format: 'point',
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[学生|がくせい]と　[女|おんな]の　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'あした　いっしょに　としょかんで　べんきょうしませんか。' },
      { speaker: 'F', furigana: 'あしたは　げつようびですよ。としょかんは　[休|やす]みです。' },
      { speaker: 'M', furigana: 'あ、そうですね。じゃあ、すいようびは　どうですか。' },
      { speaker: 'F', furigana: 'すいようびは　いいですよ。せんしゅうは　すいようびも　[休|やす]みでしたけど、いつもは　げつようびだけです。' }],
    question: 'としょかんの　[休|やす]みは　いつですか。',
    options: ['かようび', 'すいようび', 'げつようびと　すいようび', 'げつようび'], answer: 3,
    en: 'Narrator: A male student and a female student are talking. When is the library closed? — M: Shall we study together at the library tomorrow? F: Tomorrow is Monday. The library is closed. M: Oh, that\'s right. Then how about Wednesday? F: Wednesday is fine. Last week it was closed on Wednesday too, but usually it is only Monday. — When is the library closed?',
    explain: 'Last Wednesday was a one-off; いつもはげつようびだけ: the library is normally closed only on Mondays. Tuesday is never mentioned.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:masen-ka', 'g:wa-desu', 'g:yo', 'g:ne', 'g:ka', 'g:mo', 'g:deshita', 'g:kedo', 'g:itsumo', 'g:dake', 'g:no', 'v:男|おとこ', 'v:学生|がくせい', 'v:女|おんな', 'v:話す|はなす', 'v:明日|あした', 'v:一緒|いっしょ', 'v:図書館|としょかん', 'v:勉強|べんきょう', 'v:月曜日|げつようび', 'v:休み|やすみ', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:水曜日|すいようび', 'v:どう|どう', 'v:いい|いい', 'v:先週|せんしゅう', 'v:いつも|いつも', 'v:いつ|いつ', 'v:火曜日|かようび', 'k:男', 'k:学', 'k:生', 'k:女', 'k:話', 'k:休'],
    verified: true }),

  L({ id: 'l:n5-sister-in-photo', format: 'point',
    lines: [
      { speaker: 'N', furigana: '[女|おんな]の　[人|ひと]と　[男|おとこ]の　[人|ひと]が　しゃしんを　[見|み]て　います。' },
      { speaker: 'M', furigana: 'これは　かぞくの　しゃしんですか。' },
      { speaker: 'F', furigana: 'そうです。[父|ちち]と　[母|はは]と　あねと　わたしです。' },
      { speaker: 'M', furigana: 'この　めがねの　[人|ひと]が　おねえさんですか。' },
      { speaker: 'F', furigana: 'それは　[母|はは]です。あねは　[母|はは]の　となりの　せが　[高|たか]い　[人|ひと]です。' },
      { speaker: 'M', furigana: 'ぼうしの　[人|ひと]ですか。' },
      { speaker: 'F', furigana: 'ぼうしの　[人|ひと]は　わたしです。' }],
    question: '[女|おんな]の　[人|ひと]の　おねえさんは　どの　[人|ひと]ですか。',
    options: ['せが　[高|たか]い　[人|ひと]', 'めがねの　[人|ひと]', 'ぼうしの　[人|ひと]', 'せが　ひくい　[人|ひと]'], answer: 0,
    en: 'Narrator: A woman and a man are looking at a photo. Which person is the woman\'s older sister? — M: Is this a photo of your family? F: Yes. My father, my mother, my older sister and me. M: Is this person with glasses your sister? F: That\'s my mother. My sister is the tall person next to my mother. M: The one with the hat? F: The one with the hat is me. — Which person is the woman\'s older sister?',
    explain: 'The person with glasses is the mother and the one with the hat is the speaker herself. Her sister is せが高い人, the tall one next to the mother.',
    uses: ['g:to', 'g:ga', 'g:wo', 'g:te-iru', 'g:wa-desu', 'g:no', 'g:ka', 'v:女|おんな', 'v:男|おとこ', 'v:人|ひと', 'v:写真|しゃしん', 'v:見る|みる', 'v:これ|これ', 'v:家族|かぞく', 'v:そう|そう', 'v:父|ちち', 'v:母|はは', 'v:姉|あね', 'v:私|わたし', 'v:この|この', 'v:眼鏡|めがね', 'v:お姉さん|おねえさん', 'v:それ|それ', 'v:隣|となり', 'v:背|せ', 'v:高い|たかい', 'v:帽子|ぼうし', 'v:低い|ひくい', 'v:どの|どの', 'k:女', 'k:男', 'k:人', 'k:見', 'k:父', 'k:母', 'k:高'],
    verified: true }),

  L({ id: 'l:n5-movie-time', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'F', furigana: 'えいがは　[六|ろく][時|じ]からですね。' },
      { speaker: 'M', furigana: '[六|ろく][時|じ]じゃありませんよ。[五|ご][時|じ][半|はん]からです。' },
      { speaker: 'F', furigana: 'じゃあ、[五|ご][時|じ]に　えきで　あいましょう。' },
      { speaker: 'M', furigana: 'えきから　えいがかんまで　あるいて　[五|ご]ふんです。[五|ご][時|じ][十|じゅう][五|ご]ふんに　えきで　あいましょう。' }],
    question: 'えいがは　[何|なん][時|じ]に　はじまりますか。',
    options: ['[五|ご][時|じ]', '[五|ご][時|じ][十|じゅう][五|ご]ふん', '[五|ご][時|じ][半|はん]', '[六|ろく][時|じ]'], answer: 2,
    en: 'Narrator: A man and a woman are talking. What time does the movie start? — F: The movie is from six, right? M: Not six. It\'s from half past five. F: Then let\'s meet at the station at five. M: From the station to the cinema is a five-minute walk. Let\'s meet at the station at 5:15. — What time does the movie start?',
    explain: 'The man corrects her: 六時じゃありません、五時半からです. Five and 5:15 are times to meet at the station, not when the movie starts.',
    uses: uniq(FRAME_USES.concat(['g:wa-desu', 'g:kara', 'g:ne', 'g:ja-nai', 'g:yo', 'g:ni', 'g:de', 'g:mashou', 'g:made', 'g:te-form', 'g:ka', 'v:映画|えいが', 'v:六|ろく', 'v:時|じ', 'v:五|ご', 'v:半|はん', 'v:じゃあ|じゃあ', 'v:駅|えき', 'v:会う|あう', 'v:映画館|えいがかん', 'v:歩く|あるく', 'v:分|ふん', 'v:十|じゅう', 'v:何|なん', 'v:始まる|はじまる', 'k:六', 'k:時', 'k:五', 'k:半', 'k:十', 'k:何'])),
    verified: true }),

  L({ id: 'l:n5-sunday-where', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'M', furigana: 'にちようびは　[何|なに]を　しましたか。' },
      { speaker: 'F', furigana: 'ともだちと　うみへ　[行|い]く　つもりでしたけど、[雨|あめ]でしたから、[行|い]きませんでした。' },
      { speaker: 'M', furigana: 'じゃあ、うちに　いましたか。' },
      { speaker: 'F', furigana: 'デパートで　かいものを　して、それから　えいがかんで　えいがを　[見|み]ました。' }],
    question: '[女|おんな]の　[人|ひと]は　にちようびに　どこへ　[行|い]きましたか。',
    options: ['うみ', 'こうえん', 'うみと　デパート', 'デパートと　えいがかん'], answer: 3,
    en: 'Narrator: A man and a woman are talking. Where did the woman go on Sunday? — M: What did you do on Sunday? F: I was going to go to the sea with a friend, but it rained, so I didn\'t go. M: So you stayed home? F: I went shopping at a department store, and then saw a movie at the cinema. — Where did the woman go on Sunday?',
    explain: 'The sea was the plan (つもりでした), but because of the rain she didn\'t go. She went shopping at the department store and then to the cinema. The park is never mentioned.',
    uses: uniq(FRAME_USES.concat(['g:wo', 'g:mashita', 'g:ka', 'g:ni-ikimasu', 'g:tsumori', 'g:deshita', 'g:kedo', 'g:kara', 'g:ni', 'g:de', 'g:te-form', 'v:日曜日|にちようび', 'v:何|なに', 'v:する|する', 'v:友達|ともだち', 'v:海|うみ', 'v:行く|いく', 'v:雨|あめ', 'v:じゃあ|じゃあ', 'v:うち|うち', 'v:居る|いる', 'v:デパート|デパート', 'v:買い物|かいもの', 'v:それから|それから', 'v:映画館|えいがかん', 'v:映画|えいが', 'v:見る|みる', 'v:どこ|どこ', 'v:公園|こうえん', 'k:何', 'k:行', 'k:雨', 'k:見'])),
    verified: true }),

  L({ id: 'l:n5-camera-price', format: 'point',
    lines: [
      { speaker: 'N', furigana: 'みせで　[男|おとこ]の　[人|ひと]と　みせの　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'この　カメラは　いくらですか。' },
      { speaker: 'F', furigana: '[三|さん][万|まん][円|えん]です。' },
      { speaker: 'M', furigana: 'ちょっと　[高|たか]いですね。もっと　やすいのは　ありますか。' },
      { speaker: 'F', furigana: 'こちらは　[二|に][万|まん][円|えん]です。[小|ちい]さくて　かるいですよ。' },
      { speaker: 'M', furigana: 'いいですね。でも、もっと　やすいのは？' },
      { speaker: 'F', furigana: 'こちらは　[一|いち][万|まん][五|ご][千|せん][円|えん]ですけど、ちょっと　ふるいです。' },
      { speaker: 'M', furigana: 'ふるいのは　ちょっと…。じゃあ、[二|に][万|まん][円|えん]の　カメラを　ください。' }],
    question: '[男|おとこ]の　[人|ひと]が　かう　カメラは　いくらですか。',
    options: ['[一|いち][万|まん][円|えん]', '[一|いち][万|まん][五|ご][千|せん][円|えん]', '[二|に][万|まん][円|えん]', '[三|さん][万|まん][円|えん]'], answer: 2,
    en: 'Narrator: At a shop, a man and a shop assistant are talking. How much is the camera the man buys? — M: How much is this camera? F: 30,000 yen. M: That\'s a bit expensive. Do you have a cheaper one? F: This one is 20,000 yen. It\'s small and light. M: Nice. But is there an even cheaper one? F: This one is 15,000 yen, but it\'s a bit old. M: An old one is… no. Then I\'ll take the 20,000-yen camera. — How much is the camera the man buys?',
    explain: '30,000 is too expensive and the 15,000-yen one is old, so he takes the small, light one: 二万円のカメラをください. 10,000 yen is never offered.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:wa-desu', 'g:ka', 'g:ne', 'g:te-form', 'g:yo', 'g:kedo', 'g:no', 'g:wo', 'v:店|みせ', 'v:男|おとこ', 'v:人|ひと', 'v:話す|はなす', 'v:この|この', 'v:カメラ|カメラ', 'v:いくら|いくら', 'v:三|さん', 'v:万|まん', 'v:円|えん', 'v:ちょっと|ちょっと', 'v:高い|たかい', 'v:もっと|もっと', 'v:安い|やすい', 'v:ある|ある', 'v:こちら|こちら', 'v:二|に', 'v:小さい|ちいさい', 'v:軽い|かるい', 'v:いい|いい', 'v:でも|でも', 'v:一|いち', 'v:五|ご', 'v:千|せん', 'v:古い|ふるい', 'v:じゃあ|じゃあ', 'v:ください|ください', 'v:買う|かう', 'k:男', 'k:人', 'k:話', 'k:三', 'k:万', 'k:円', 'k:高', 'k:二', 'k:小', 'k:一', 'k:五', 'k:千'],
    verified: true }),

  L({ id: 'l:n5-where-she-lives', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'M', furigana: 'いま　どこに　すんで　いますか。' },
      { speaker: 'F', furigana: '[大学|だいがく]の　ちかくの　アパートです。' },
      { speaker: 'M', furigana: '[大学|だいがく]の　[前|まえ]の　アパートですか。' },
      { speaker: 'F', furigana: '[前|まえ]じゃありません。[大学|だいがく]の　うしろです。きょねんまで　えきの　[前|まえ]に　すんで　いましたけど、[大学|だいがく]から　とおかったんです。' }],
    question: '[女|おんな]の　[人|ひと]は　いま　どこに　すんで　いますか。',
    options: ['[大学|だいがく]の　[前|まえ]', '[大学|だいがく]の　うしろ', 'えきの　[前|まえ]', 'えきの　うしろ'], answer: 1,
    en: 'Narrator: A man and a woman are talking. Where does the woman live now? — M: Where do you live now? F: In an apartment near the university. M: The apartment in front of the university? F: Not in front. Behind the university. Until last year I lived in front of the station, but it was far from the university. — Where does the woman live now?',
    explain: 'She corrects him: 前じゃありません、大学のうしろです. In front of the station is where she lived until last year (いました), not now.',
    uses: uniq(FRAME_USES.concat(['g:ni', 'g:ka', 'g:no', 'g:wa-desu', 'g:ja-nai', 'g:made', 'g:mashita', 'g:kedo', 'g:kara', 'g:adj-i', 'g:n-desu', 'v:今|いま', 'v:どこ|どこ', 'v:住む|すむ', 'v:大学|だいがく', 'v:近く|ちかく', 'v:アパート|アパート', 'v:前|まえ', 'v:後ろ|うしろ', 'v:去年|きょねん', 'v:駅|えき', 'v:遠い|とおい', 'k:大', 'k:学', 'k:前'])),
    verified: true }),

  L({ id: 'l:n5-study-hours', format: 'point',
    lines: [
      { speaker: 'N', furigana: MF },
      { speaker: 'F', furigana: '[日本|にほん][語|ご]の　べんきょうは　[毎日|まいにち]　しますか。' },
      { speaker: 'M', furigana: 'しますよ。あさ　[一|いち][時間|じかん]と、よる　[二|に][時間|じかん]です。' },
      { speaker: 'F', furigana: '[毎日|まいにち]　[三|さん][時間|じかん]ですか。たいへんですね。' },
      { speaker: 'M', furigana: 'でも、どようびと　にちようびは　よるだけ　します。' }],
    question: '[男|おとこ]の　[人|ひと]は　どようびに　[何|なん][時間|じかん]　べんきょうしますか。',
    options: ['[一|いち][時間|じかん]', '[二|に][時間|じかん]', '[三|さん][時間|じかん]', '[五|ご][時間|じかん]'], answer: 1,
    names: ['日本|にほん'],
    en: 'Narrator: A man and a woman are talking. How many hours does the man study on Saturdays? — F: Do you study Japanese every day? M: I do. One hour in the morning and two hours at night. F: Three hours every day? That\'s a lot. M: But on Saturdays and Sundays I only study at night. — How many hours does the man study on Saturdays?',
    explain: 'On weekdays it is 1 + 2 = 3 hours, but on Saturday and Sunday only the night session: two hours (よるだけ).',
    uses: uniq(FRAME_USES.concat(['g:no', 'g:wa-desu', 'g:ka', 'g:yo', 'g:ne', 'g:dake', 'g:ni', 'g:masu', 'v:語|ご', 'v:勉強|べんきょう', 'v:毎日|まいにち', 'v:する|する', 'v:朝|あさ', 'v:一|いち', 'v:時間|じかん', 'v:夜|よる', 'v:二|に', 'v:三|さん', 'v:たいへん|たいへん', 'v:でも|でも', 'v:土曜日|どようび', 'v:日曜日|にちようび', 'v:何|なん', 'v:五|ご', 'k:日', 'k:本', 'k:語', 'k:毎', 'k:一', 'k:時', 'k:間', 'k:二', 'k:三', 'k:何', 'k:五'])),
    verified: true }),

  // ── written for the mock exams (ticket 18): kept out of lesson reviews and prep drills ──
  L({id: "l:n5-what-time-now",format: "quick",lines: [{speaker: "F",furigana: "[今|いま]　[何|なん][時|じ]ですか。"}],optionSpeaker: "M",options: ["[三|さん][時|じ][半|はん]です。","[三|さん][時間|じかん]です。","きのうの　[三|さん][時|じ]です。"],answer: 0,en: "Woman: What time is it now? — 1. It is half past three. 2. It is three hours. 3. It is three o'clock yesterday.",explain: "何時 asks for the time: 三時半です. 三時間 is a length of time, the answer to 何時間 \"how many hours\", and the question is about now, not yesterday.",uses: ["g:ka","g:no","v:今|いま","v:何|なん","v:時|じ","v:三|さん","v:半|はん","v:時間|じかん","v:昨日|きのう","k:今","k:何","k:時","k:三","k:半","k:間"],verified: true}),

  L({id: "l:n5-how-many-family",format: "quick",lines: [{speaker: "M",furigana: "ごかぞくは　[何|なん][人|にん]ですか。"}],optionSpeaker: "F",options: ["よんばんです。","よにんです。","みんな　げんきです。"],answer: 1,en: "Man: How many people are in your family? — 1. It is number four. 2. Four people. 3. They are all well.",explain: "何人 asks how many people: 四人です. よんばん is a place in a row (番), and みんなげんきです answers \"how is your family?\", not \"how many\".",uses: ["g:wa-desu","g:ka","v:家族|かぞく","v:何|なん","v:人|にん","v:四|よん","v:番|ばん","v:みんな|みんな","v:元気|げんき","k:何","k:人"],verified: true}),

  L({id: "l:n5-where-toilet",format: "quick",lines: [{speaker: "M",furigana: "トイレは　どこですか。"}],optionSpeaker: "F",options: ["トイレは　きれいです。","トイレへ　[行|い]きたいです。","かいだんの　となりです。"],answer: 2,en: "Man: Where is the toilet? — 1. The toilet is clean. 2. I want to go to the toilet. 3. It is next to the stairs.",explain: "どこ asks for a place: かいだんのとなり \"next to the stairs\". きれいです says what the toilet is like, and 行きたいです is what the woman wants, not where it is.",uses: ["g:wa-desu","g:ka","g:no","g:tai","g:ni-ikimasu","g:adj-na","v:トイレ|トイレ","v:どこ|どこ","v:きれい|きれい","v:階段|かいだん","v:隣|となり","v:行く|いく","k:行"],verified: true}),

  L({id: "l:n5-how-was-test",format: "quick",lines: [{speaker: "F",furigana: "きのうの　テストは　どうでしたか。"}],optionSpeaker: "M",options: ["あした　テストが　あります。","テストは　[九|く][時|じ]からです。","とても　むずかしかったです。"],answer: 2,en: "Woman: How was yesterday's test? — 1. There is a test tomorrow. 2. The test is from nine o'clock. 3. It was very difficult.",explain: "どうでしたか asks how something in the past went, so the reply is past too: むずかしかったです. Tomorrow's test and the start time do not say how yesterday's test was.",uses: ["g:no","g:wa-desu","g:ka","g:deshita","g:totemo","g:adj-i","g:ga-arimasu","g:kara","v:昨日|きのう","v:テスト|テスト","v:どう|どう","v:とても|とても","v:難しい|むずかしい","v:明日|あした","v:ある|ある","v:九|く","v:時|じ","k:九","k:時"],verified: true}),

  L({id: "l:n5-coffee-or-tea",format: "quick",lines: [{speaker: "M",furigana: "コーヒーと　こうちゃと、どちらが　いいですか。"}],optionSpeaker: "F",options: ["こうちゃが　いいです。","コーヒーを　のみました。","こうちゃは　あそこです。"],answer: 0,en: "Man: Which would you like, coffee or tea? — 1. Tea, please. 2. I drank coffee. 3. The tea is over there.",explain: "XとYと、どちらがいいですか asks you to choose one: こうちゃがいいです. のみました is something already done, and あそこです says where the tea is.",uses: ["g:to","g:ga","g:ka","g:wo","g:mashita","g:wa-desu","v:コーヒー|コーヒー","v:紅茶|こうちゃ","v:どちら|どちら","v:いい|いい","v:飲む|のむ","v:あそこ|あそこ"],verified: true}),

  L({id: "l:n5-how-long-japan",format: "quick",lines: [{speaker: "F",furigana: "[日本|にほん]に　どのくらい　いますか。"}],optionSpeaker: "M",options: ["とうきょうです。","[三|さん]か[月|げつ]です。","ひこうきで　[来|き]ました。"],answer: 1,names: ["とうきょう","日本|にほん"],en: "Woman: How long have you been in Japan? — 1. Tokyo. 2. Three months. 3. I came by plane.",explain: "どのくらい asks how long: 三か月です. とうきょう answers \"where\", and ひこうきで answers \"how did you come\".",uses: ["g:ni","g:ka","g:de","g:mashita","v:どの|どの","v:居る|いる","v:三|さん","v:か月|かげつ","v:飛行機|ひこうき","v:来る|くる","k:日","k:本","k:三","k:月","k:来"],verified: true}),

  L({id: "l:n5-saturday",format: "quick",lines: [{speaker: "M",furigana: "[土|ど]ようびは　[何|なに]を　しましたか。"}],optionSpeaker: "F",options: ["[友|とも]だちと　こうえんへ　[行|い]きます。","[友|とも]だちと　こうえんへ　[行|い]きました。","こうえんが　すきです。"],answer: 1,en: "Man: What did you do on Saturday? — 1. I will go to the park with a friend. 2. I went to the park with a friend. 3. I like parks.",explain: "しましたか asks about the past, so the reply is past: 行きました. 行きます is the future, and すきです does not say what she did.",uses: ["g:mashita","g:ka","g:wo","g:to","g:ga","g:masu","g:ni-ikimasu","v:土曜日|どようび","v:何|なに","v:する|する","v:友達|ともだち","v:公園|こうえん","v:行く|いく","v:好き|すき","k:土","k:何","k:友","k:行"],verified: true}),

  L({id: "l:n5-lunch-yet",format: "quick",lines: [{speaker: "F",furigana: "もう　ひるごはんを　[食|た]べましたか。"}],optionSpeaker: "M",options: ["まだです。これから　[食|た]べます。","もう　[食|た]べません。","ひるごはんを　[食|た]べて　ください。"],answer: 0,en: "Woman: Have you had lunch yet? — 1. Not yet. I'm going to eat now. 2. I won't eat any more. 3. Please eat lunch.",explain: "もう〜ましたか \"have you … yet?\" is answered with まだです \"not yet\". もう食べません means \"I won't eat any more\", and 食べてください asks her to eat.",uses: ["g:mou","g:mada","g:wo","g:mashita","g:ka","g:masu","g:masen","g:te-kudasai","v:もう|もう","v:まだ|まだ","v:昼御飯|ひるごはん","v:食べる|たべる","k:食"],verified: true}),

  L({id: "l:n5-which-notebook",format: "quick",lines: [{speaker: "M",furigana: "あなたの　ノートは　どれですか。"}],optionSpeaker: "F",options: ["ノートは　[百|ひゃく][円|えん]です。","ノートに　[書|か]きました。","その　あおい　ノートです。"],answer: 2,en: "Man: Which one is your notebook? — 1. The notebook is 100 yen. 2. I wrote it in my notebook. 3. That blue notebook.",explain: "どれ asks \"which one\": そのあおいノート. The price answers いくら, and ノートに書きました says where she wrote something.",uses: ["g:no","g:wa-desu","g:ka","g:ni","g:mashita","g:adj-i","v:あなた|あなた","v:ノート|ノート","v:どれ|どれ","v:その|その","v:青い|あおい","v:百|ひゃく","v:円|えん","v:書く|かく","k:百","k:円","k:書"],verified: true}),

  L({id: "l:n5-favorite-drink",format: "quick",lines: [{speaker: "F",furigana: "どんな　のみものが　すきですか。"}],optionSpeaker: "M",options: ["ぎゅうにゅうが　すきです。","のみものは　つめたいです。","みせで　かいました。"],answer: 0,en: "Woman: What kind of drinks do you like? — 1. I like milk. 2. The drinks are cold. 3. I bought them at a shop.",explain: "どんな asks \"what kind\": ぎゅうにゅうがすきです names one. のみものはつめたいです describes the drinks without choosing one, and みせでかいました answers \"where did you buy them\".",uses: ["g:ga","g:ka","g:wa-desu","g:adj-i","g:de","g:mashita","v:どんな|どんな","v:飲み物|のみもの","v:好き|すき","v:牛乳|ぎゅうにゅう","v:冷たい|つめたい","v:店|みせ","v:買う|かう"],verified: true}),

  L({id: "l:n5-close-door",format: "quick",lines: [{speaker: "M",furigana: "ドアを　しめて　ください。"}],optionSpeaker: "F",options: ["ドアを　あけましょう。","わかりました。しめます。","ドアを　しめないで　ください。"],answer: 1,en: "Man: Please close the door. — 1. Let's open the door. 2. All right. I'll close it. 3. Please don't close the door.",explain: "The man asks her to close the door; わかりました、しめます agrees to do it. あけましょう (open) and しめないでください (don't close) go against the request.",uses: ["g:wo","g:te-kudasai","g:mashita","g:masu","g:mashou","g:nai-de-kudasai","v:ドア|ドア","v:閉める|しめる","v:分かる|わかる","v:開ける|あける"],verified: true}),

  L({id: "l:n5-where-live",format: "quick",lines: [{speaker: "F",furigana: "どこに　すんで　いますか。"}],optionSpeaker: "M",options: ["とうきょうへ　[行|い]きます。","とうきょうは　[大|おお]きいです。","とうきょうに　すんで　います。"],answer: 2,names: ["とうきょう"],en: "Woman: Where do you live? — 1. I am going to Tokyo. 2. Tokyo is big. 3. I live in Tokyo.",explain: "すんでいます \"live\" needs the same verb in the reply: とうきょうにすんでいます. 行きます is \"go\", and 大きいです describes the city.",uses: ["g:ni","g:te-iru","g:ka","g:ni-ikimasu","g:wa-desu","g:adj-i","v:どこ|どこ","v:住む|すむ","v:行く|いく","v:大きい|おおきい","k:行","k:大"],verified: true}),

  L({id: "l:n5-invite-movie",format: "utterance",lines: [{speaker: "N",furigana: "[友|とも]だちと　えいがを　[見|み]たいです。"}],question: "[友|とも]だちに　なんと　いいますか。",optionSpeaker: "M",options: ["いっしょに　えいがを　[見|み]ませんか。","えいがを　[見|み]ましたか。","えいがは　おもしろかったです。"],answer: 0,en: "Narrator: You want to see a movie with a friend. What do you say to your friend? — 1. Would you like to see a movie together? 2. Did you see the movie? 3. The movie was interesting.",explain: "〜ませんか invites: \"won't you see a movie with me?\". 見ましたか asks about the past, and おもしろかったです gives an opinion of a film already seen.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:to","g:wo","g:tai","g:ni","g:masen-ka","g:mashita","g:wa-desu","g:adj-i","v:友達|ともだち","v:映画|えいが","v:見る|みる","v:一緒|いっしょ","v:面白い|おもしろい","k:友","k:見"],verified: true}),

  L({id: "l:n5-ask-photo",format: "utterance",lines: [{speaker: "N",furigana: "こうえんで　しゃしんを　とって　もらいたいです。"}],question: "ちかくの　[人|ひと]に　なんと　いいますか。",optionSpeaker: "F",options: ["しゃしんを　とりましょうか。","しゃしんを　とって　ください。","しゃしんを　とっても　いいですか。"],answer: 1,en: "Narrator: In a park, you would like someone to take your photo. What do you say to a person nearby? — 1. Shall I take a photo (for you)? 2. Please take a photo (of me). 3. May I take a photo?",explain: "You want the other person to do it: とってください \"please take\". とりましょうか offers to take their photo, and とってもいいですか asks permission to take one yourself.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:de","g:wo","g:tai","g:ni","g:te-kudasai","g:mashou-ka","g:te-mo-ii","v:公園|こうえん","v:写真|しゃしん","v:撮る|とる","v:近く|ちかく","v:人|ひと","v:いい|いい","k:人"],verified: true}),

  L({id: "l:n5-ask-time",format: "utterance",lines: [{speaker: "N",furigana: "とけいを　わすれました。[時間|じかん]が　わかりません。"}],question: "となりの　[人|ひと]に　なんと　いいますか。",optionSpeaker: "M",options: ["[何|なん][時|じ]に　[来|き]ましたか。","とけいを　かいましょう。","[今|いま]　[何|なん][時|じ]ですか。"],answer: 2,en: "Narrator: You forgot your watch. You don't know the time. What do you say to the person next to you? — 1. What time did you come? 2. Let's buy a watch. 3. What time is it now?",explain: "You need the time now: 今何時ですか. 何時に来ましたか asks when the other person arrived, and とけいをかいましょう suggests buying a watch.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:wo","g:mashita","g:ga","g:masen","g:ni","g:no","g:mashou","v:時計|とけい","v:忘れる|わすれる","v:時間|じかん","v:分かる|わかる","v:隣|となり","v:人|ひと","v:今|いま","v:時|じ","v:来る|くる","v:買う|かう","k:時","k:間","k:人","k:今","k:何","k:来"],verified: true}),

  L({id: "l:n5-ask-water",format: "utterance",lines: [{speaker: "N",furigana: "レストランで　[水|みず]が　ほしいです。"}],question: "みせの　[人|ひと]に　なんと　いいますか。",optionSpeaker: "F",options: ["[水|みず]を　ください。","[水|みず]を　どうぞ。","[水|みず]を　のみましたか。"],answer: 0,en: "Narrator: At a restaurant, you want some water. What do you say to the staff? — 1. Some water, please. 2. Here is some water. 3. Did you drink the water?",explain: "Xをください asks for something: 水をください. 水をどうぞ is what the staff say when they give you water, and のみましたか asks about the past.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:de","g:ga","g:no","g:ni","g:wo","g:mashita","g:adj-i","v:レストラン|レストラン","v:水|みず","v:欲しい|ほしい","v:店|みせ","v:人|ひと","v:ください|ください","v:どうぞ|どうぞ","v:飲む|のむ","k:水","k:人"],verified: true}),

  L({id: "l:n5-give-sweets",format: "utterance",lines: [{speaker: "N",furigana: "[友|とも]だちに　おかしを　あげたいです。"}],question: "なんと　いいますか。",optionSpeaker: "M",options: ["おかしを　ください。","おかしを　どうぞ。","おかしを　かいましたか。"],answer: 1,en: "Narrator: You want to give your friend some sweets. What do you say? — 1. Some sweets, please. 2. Have some sweets. 3. Did you buy sweets?",explain: "どうぞ offers something to someone: おかしをどうぞ. おかしをください asks the friend to give you sweets, the other way round, and かいましたか asks about shopping.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:ni","g:wo","g:tai","g:mashita","v:友達|ともだち","v:お菓子|おかし","v:上げる|あげる","v:どうぞ|どうぞ","v:ください|ください","v:買う|かう","k:友"],verified: true}),

  L({id: "l:n5-turn-off-tv",format: "utterance",lines: [{speaker: "N",furigana: "テレビが　うるさいです。べんきょうしたいです。"}],question: "おとうとに　なんと　いいますか。",optionSpeaker: "F",options: ["テレビを　つけて　ください。","テレビを　[見|み]ても　いいですか。","テレビを　けして　ください。"],answer: 2,en: "Narrator: The TV is noisy. You want to study. What do you say to your younger brother? — 1. Please turn on the TV. 2. May I watch TV? 3. Please turn off the TV.",explain: "You want quiet, so ask him to turn it off: けしてください. つける is \"turn on\", the opposite, and 見てもいいですか asks to watch it yourself.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:ga","g:tai","g:ni","g:wo","g:te-kudasai","g:te-mo-ii","g:adj-i","v:テレビ|テレビ","v:煩い|うるさい","v:勉強|べんきょう","v:弟|おとうと","v:消す|けす","v:つける|つける","v:見る|みる","v:いい|いい","k:見"],verified: true}),

  L({id: "l:n5-buy-hat",format: "utterance",lines: [{speaker: "N",furigana: "みせで　この　ぼうしを　かいたいです。"}],question: "みせの　[人|ひと]に　なんと　いいますか。",optionSpeaker: "M",options: ["この　ぼうしを　ください。","この　ぼうしを　かいましたか。","この　ぼうしは　わたしのです。"],answer: 0,en: "Narrator: In a shop, you want to buy this hat. What do you say to the shop assistant? — 1. I'll take this hat, please. 2. Did you buy this hat? 3. This hat is mine.",explain: "In a shop, Xをください says you will buy it. かいましたか asks the assistant about the past, and わたしのです says the hat already belongs to you.",uses: ["g:ka","g:masu","v:何|なん","v:言う|いう","g:de","g:wo","g:tai","g:no","g:ni","g:mashita","g:wa-desu","v:店|みせ","v:この|この","v:帽子|ぼうし","v:買う|かう","v:人|ひと","v:ください|ください","v:私|わたし","k:人"],verified: true}),

  L({id: "l:n5-dinner-shopping",format: "task",lines: [{speaker: "N",furigana: "うちで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "きょうの　ばんごはんは　カレーですね。にくと　やさいは　ありますか。"},{speaker: "F",furigana: "にくは　ありますけど、やさいが　ありません。"},{speaker: "M",furigana: "じゃあ、わたしが　やさいを　かいに　[行|い]きます。たまごも　かいましょうか。"},{speaker: "F",furigana: "たまごは　きのう　かいましたから、いりません。"}],question: "[男|おとこ]の　[人|ひと]は　[何|なに]を　かいますか。",options: ["やさい","にく","やさいと　たまご","にくと　たまご"],answer: 0,en: "Narrator: At home, a man and a woman are talking. What will the man buy? — M: Tonight's dinner is curry, right? Do we have meat and vegetables? F: We have meat, but no vegetables. M: Then I'll go and buy vegetables. Shall I buy eggs too? F: I bought eggs yesterday, so we don't need them. — What will the man buy?",explain: "There is meat at home but no vegetables, so he goes to buy vegetables. The woman bought eggs yesterday, so he does not need to buy them (いりません).",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:wa-desu","g:ne","g:ka","g:kedo","g:masen","g:ni-iku","g:mo","g:mashou-ka","g:kara","g:mashita","g:masu","v:うち|うち","v:今日|きょう","v:晩御飯|ばんごはん","v:カレー|カレー","v:肉|にく","v:野菜|やさい","v:ある|ある","v:じゃあ|じゃあ","v:私|わたし","v:買う|かう","v:行く|いく","v:卵|たまご","v:昨日|きのう","v:要る|いる","v:何|なに","k:男","k:人","k:女","k:話","k:行","k:何"],verified: true}),

  L({id: "l:n5-test-classroom",format: "task",lines: [{speaker: "N",furigana: "[学校|がっこう]で　[先生|せんせい]と　[学生|がくせい]が　[話|はな]して　います。"},{speaker: "F",furigana: "あしたの　テストは　[三|さん]がいの　きょうしつじゃ　ありません。[二|に]かいの　きょうしつで　します。"},{speaker: "M",furigana: "[二|に]かいの　どの　きょうしつですか。"},{speaker: "F",furigana: "エレベーターの　となりです。トイレの　となりじゃ　ありませんよ。"}],question: "[学生|がくせい]は　あした　どの　きょうしつへ　[行|い]きますか。",options: ["[二|に]かいの　エレベーターの　となり","[二|に]かいの　トイレの　となり","[三|さん]がいの　エレベーターの　となり","[三|さん]がいの　トイレの　となり"],answer: 0,en: "Narrator: At school, a teacher and a student are talking. Which classroom will the student go to tomorrow? — F: Tomorrow's test is not in the classroom on the third floor. We'll do it in a classroom on the second floor. M: Which classroom on the second floor? F: The one next to the elevator. Not the one next to the toilets. — Which classroom will the student go to tomorrow?",explain: "The test is on the second floor (二かい), not the third, in the room next to the elevator; the teacher says it is not the one next to the toilets.",uses: ["g:to","g:ga","g:te-iru","g:de","g:no","g:wa-desu","g:ja-nai","g:ka","g:yo","g:ni-ikimasu","g:masu","v:学校|がっこう","v:先生|せんせい","v:学生|がくせい","v:話す|はなす","v:明日|あした","v:テスト|テスト","v:三|さん","v:階|かい","v:教室|きょうしつ","v:二|に","v:する|する","v:どの|どの","v:エレベーター|エレベーター","v:隣|となり","v:トイレ|トイレ","v:行く|いく","k:学","k:校","k:先","k:生","k:話","k:三","k:二","k:行"],verified: true}),

  L({id: "l:n5-before-the-train",format: "task",lines: [{speaker: "N",furigana: "えきで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "つぎの　でんしゃは　[何|なん][時|じ]ですか。"},{speaker: "F",furigana: "[十|じゅう][時|じ][半|はん]です。きっぷは　もう　かいましたよ。"},{speaker: "M",furigana: "まだ　[時間|じかん]が　ありますね。あそこの　きっさてんで　コーヒーを　のみませんか。"},{speaker: "F",furigana: "いいですね。そう　しましょう。"}],question: "[二人|ふたり]は　この[後|あと]　すぐ　[何|なに]を　しますか。",options: ["きっぷを　かいます。","でんしゃに　のります。","きっさてんへ　[行|い]きます。","えきで　まちます。"],answer: 2,en: "Narrator: At a station, a man and a woman are talking. What will the two of them do right after this? — M: What time is the next train? F: Half past ten. I already bought the tickets. M: We still have time, then. Shall we have a coffee at that café over there? F: Good idea. Let's do that. — What will the two of them do right after this?",explain: "The tickets are already bought (もうかいました) and the train is not until 10:30, so they go to the café first: そうしましょう agrees with the man's idea.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:wa-desu","g:ka","g:mou","g:mashita","g:yo","g:ne","g:wo","g:masen-ka","g:mashou","g:ni","g:ni-ikimasu","g:masu","v:駅|えき","v:次|つぎ","v:電車|でんしゃ","v:何|なん","v:時|じ","v:十|じゅう","v:半|はん","v:切符|きっぷ","v:もう|もう","v:買う|かう","v:まだ|まだ","v:時間|じかん","v:ある|ある","v:あそこ|あそこ","v:喫茶店|きっさてん","v:コーヒー|コーヒー","v:飲む|のむ","v:いい|いい","v:そう|そう","v:する|する","v:二人|ふたり","v:この|この","v:後|あと","v:何|なに","v:行く|いく","v:乗る|のる","v:待つ|まつ","k:男","k:人","k:女","k:話","k:何","k:時","k:十","k:半","k:間","k:二","k:後","k:行"],verified: true}),

  L({id: "l:n5-teacher-present",format: "task",lines: [{speaker: "N",furigana: "デパートで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "F",furigana: "[山川|やまかわ][先生|せんせい]の　たんじょうびに　[何|なに]を　あげましょうか。"},{speaker: "M",furigana: "ネクタイは　どうですか。"},{speaker: "F",furigana: "ネクタイは　[先月|せんげつ]　あげましたよ。"},{speaker: "M",furigana: "じゃあ、[本|ほん]は　どうですか。[先生|せんせい]は　[本|ほん]を　[読|よ]むのが　すきですよ。カップも　かいましょうか。"},{speaker: "F",furigana: "[本|ほん]が　いいですね。カップは　いりません。"}],question: "[二人|ふたり]は　[何|なに]を　かいますか。",options: ["ネクタイ","[本|ほん]","[本|ほん]と　カップ","ネクタイと　カップ"],answer: 1,names: ["山川|やまかわ"],en: "Narrator: At a department store, a man and a woman are talking. What will the two of them buy? — F: What shall we give Mr. Yamakawa, our teacher, for his birthday? M: How about a tie? F: We gave him a tie last month. M: Then how about a book? He likes reading. Shall we buy a cup too? F: A book is good. We don't need a cup. — What will the two of them buy?",explain: "They gave a tie last month, so not that. The woman agrees to the book (本がいいですね) and says the cup is not needed.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:ni","g:wo","g:mashou-ka","g:wa-desu","g:ka","g:mashita","g:yo","g:no-ga-suki","g:mo","g:ne","g:masen","g:masu","v:デパート|デパート","v:先生|せんせい","v:誕生日|たんじょうび","v:何|なに","v:上げる|あげる","v:ネクタイ|ネクタイ","v:どう|どう","v:先月|せんげつ","v:じゃあ|じゃあ","v:本|ほん","v:読む|よむ","v:好き|すき","v:カップ|カップ","v:買う|かう","v:いい|いい","v:要る|いる","v:二人|ふたり","k:男","k:人","k:女","k:話","k:山","k:川","k:先","k:生","k:何","k:月","k:本","k:読","k:二"],verified: true}),

  L({id: "l:n5-where-box",format: "task",lines: [{speaker: "N",furigana: "うちで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "この　はこは　どこに　おきましょうか。"},{speaker: "F",furigana: "つくえの　[上|うえ]に　おいて　ください。でも、つくえの　[上|うえ]には　[本|ほん]が　たくさん　ありますね。じゃあ、ベッドの　[下|した]に　おいて　ください。"},{speaker: "M",furigana: "ベッドの　[下|した]ですね。わかりました。"}],question: "[男|おとこ]の　[人|ひと]は　どこに　はこを　おきますか。",options: ["つくえの　[上|うえ]","つくえの　[下|した]","ベッドの　[上|うえ]","ベッドの　[下|した]"],answer: 3,en: "Narrator: At home, a man and a woman are talking. Where will the man put the box? — M: Where shall I put this box? F: Please put it on the desk. But there are a lot of books on the desk, aren't there. Then please put it under the bed. M: Under the bed. All right. — Where will the man put the box?",explain: "The desk was the first idea, but it is covered with books, so the woman changes her mind (じゃあ): under the bed.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:wa-desu","g:ni","g:mashou-ka","g:te-kudasai","g:no","g:ne","g:mashita","g:ka","g:masu","v:うち|うち","v:この|この","v:箱|はこ","v:どこ|どこ","v:置く|おく","v:机|つくえ","v:上|うえ","v:でも|でも","v:本|ほん","v:たくさん|たくさん","v:ある|ある","v:じゃあ|じゃあ","v:ベッド|ベッド","v:下|した","v:分かる|わかる","k:男","k:人","k:女","k:話","k:上","k:本","k:下"],verified: true}),

  L({id: "l:n5-walk-to-hospital",format: "task",lines: [{speaker: "N",furigana: "えきの　[前|まえ]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "F",furigana: "びょういんまで　どう　[行|い]きますか。バスですか。"},{speaker: "M",furigana: "バスは　[時間|じかん]が　かかりますから、タクシーで　[行|い]きましょう。"},{speaker: "F",furigana: "タクシーは　たかいですよ。あるいて　[行|い]きませんか。にじゅっぷんぐらいです。"},{speaker: "M",furigana: "そうですね。じゃあ、そう　しましょう。"}],question: "[二人|ふたり]は　どうやって　びょういんへ　[行|い]きますか。",options: ["バスで","タクシーで","あるいて","でんしゃで"],answer: 2,en: "Narrator: In front of a station, a man and a woman are talking. How will the two of them get to the hospital? — F: How shall we get to the hospital? By bus? M: The bus takes time, so let's go by taxi. F: Taxis are expensive. Why don't we walk? It's about twenty minutes. M: That's true. Then let's do that. — How will the two of them get to the hospital?",explain: "The bus is slow and the taxi expensive; the woman suggests walking (あるいて) and the man agrees: そうしましょう.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:made","g:ka","g:wa-desu","g:kara","g:mashou","g:yo","g:masen-ka","g:ne","g:te-form","g:adj-i","g:ni-ikimasu","v:駅|えき","v:前|まえ","v:病院|びょういん","v:どう|どう","v:行く|いく","v:バス|バス","v:時間|じかん","v:かかる|かかる","v:タクシー|タクシー","v:高い|たかい","v:歩く|あるく","v:そう|そう","v:じゃあ|じゃあ","v:する|する","v:二人|ふたり","v:電車|でんしゃ","k:前","k:男","k:人","k:女","k:話","k:行","k:時","k:間","k:二"],verified: true}),

  L({id: "l:n5-test-desk",format: "task",lines: [{speaker: "N",furigana: "きょうしつで　[先生|せんせい]が　[話|はな]して　います。"},{speaker: "F",furigana: "テストの　ときは、かばんを　うしろの　つくえに　おいて　ください。えんぴつと　ノートは　つくえの　[上|うえ]に　おいて　ください。じしょは　かばんに　いれて　ください。"}],question: "[学生|がくせい]は　つくえの　[上|うえ]に　[何|なに]を　おきますか。",options: ["えんぴつと　ノート","えんぴつと　じしょ","かばんと　じしょ","かばんと　ノート"],answer: 0,en: "Narrator: In a classroom, a teacher is talking. What will the students put on their desks? — F: During the test, please put your bags on the desks at the back. Please put your pencils and notebooks on your desk. Please put your dictionaries in your bags. — What will the students put on their desks?",explain: "Only the pencils and notebooks go on the desk (つくえの上). Bags go on the desks at the back, and dictionaries go inside the bags.",uses: ["g:ga","g:te-iru","g:de","g:no","g:wo","g:ni","g:te-kudasai","g:to","g:ka","g:masu","v:教室|きょうしつ","v:先生|せんせい","v:話す|はなす","v:テスト|テスト","v:時|とき","v:かばん|かばん","v:後ろ|うしろ","v:机|つくえ","v:置く|おく","v:鉛筆|えんぴつ","v:ノート|ノート","v:上|うえ","v:辞書|じしょ","v:入れる|いれる","v:学生|がくせい","v:何|なに","k:先","k:生","k:話","k:上","k:学","k:何"],verified: true}),

  L({id: "l:n5-why-no-party",format: "point",lines: [{speaker: "N",furigana: "[学校|がっこう]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "あしたの　パーティーに　[来|き]ますか。"},{speaker: "F",furigana: "[行|い]きたいですけど、[行|い]きません。"},{speaker: "M",furigana: "どうしてですか。いそがしいですか。"},{speaker: "F",furigana: "いそがしくないです。でも、あしたは　[母|はは]の　たんじょうびですから、うちで　ごはんを　[食|た]べます。"}],question: "[女|おんな]の　[人|ひと]は　どうして　パーティーに　[行|い]きませんか。",options: ["いそがしいから","びょうきだから","[母|はは]の　たんじょうびだから","パーティーが　きらいだから"],answer: 2,en: "Narrator: At school, a man and a woman are talking. Why isn't the woman going to the party? — M: Are you coming to the party tomorrow? F: I want to go, but I'm not going. M: Why? Are you busy? F: I'm not busy. But tomorrow is my mother's birthday, so I'm having dinner at home. — Why isn't the woman going to the party?",explain: "She says she is not busy (いそがしくないです); the reason comes with から: it is her mother's birthday. She wants to go, so she does not dislike parties.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:ni","g:ka","g:tai","g:kedo","g:masen","g:doushite","g:adj-i","g:wa-desu","g:kara","g:wo","g:masu","g:ni-ikimasu","v:学校|がっこう","v:明日|あした","v:パーティー|パーティー","v:来る|くる","v:行く|いく","v:どうして|どうして","v:忙しい|いそがしい","v:でも|でも","v:母|はは","v:誕生日|たんじょうび","v:うち|うち","v:御飯|ごはん","v:食べる|たべる","v:病気|びょうき","v:嫌い|きらい","k:学","k:校","k:男","k:人","k:女","k:話","k:来","k:行","k:母","k:食"],verified: true}),

  L({id: "l:n5-when-sea",format: "point",lines: [{speaker: "N",furigana: "[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "F",furigana: "なつやすみに　[何|なに]を　しますか。"},{speaker: "M",furigana: "うみへ　[行|い]きます。"},{speaker: "F",furigana: "いいですね。[七|しち][月|がつ]ですか。"},{speaker: "M",furigana: "[七|しち][月|がつ]は　しごとが　いそがしいですから、[八|はち][月|がつ]の　はじめに　[行|い]きます。"}],question: "[男|おとこ]の　[人|ひと]は　いつ　うみへ　[行|い]きますか。",options: ["[七|しち][月|がつ]の　はじめ","[七|しち][月|がつ]の　おわり","[八|はち][月|がつ]の　はじめ","[八|はち][月|がつ]の　おわり"],answer: 2,en: "Narrator: A man and a woman are talking. When will the man go to the sea? — F: What will you do in the summer holidays? M: I'm going to the sea. F: Nice. In July? M: Work is busy in July, so I'll go at the beginning of August. — When will the man go to the sea?",explain: "July is busy at work, so he goes at the beginning (はじめ) of August. The end of a month is never mentioned.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:ni","g:wo","g:ka","g:masu","g:ni-ikimasu","g:ne","g:wa-desu","g:kara","g:no","g:adj-i","v:夏休み|なつやすみ","v:何|なに","v:する|する","v:海|うみ","v:行く|いく","v:いい|いい","v:七|しち","v:月|がつ","v:仕事|しごと","v:忙しい|いそがしい","v:八|はち","v:初め|はじめ","v:いつ|いつ","k:男","k:人","k:女","k:話","k:何","k:行","k:七","k:月","k:八"],verified: true}),

  L({id: "l:n5-which-car",format: "point",lines: [{speaker: "N",furigana: "[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "[山川|やまかわ]さんの　[車|くるま]は　あの　[白|しろ]い　[車|くるま]ですか。"},{speaker: "F",furigana: "[白|しろ]いのは　[父|ちち]の　[車|くるま]です。"},{speaker: "M",furigana: "じゃあ、あの　[小|ちい]さい　あかい　[車|くるま]ですか。"},{speaker: "F",furigana: "あかいのは　あねのです。わたしのは　その　[右|みぎ]の　あおい　[車|くるま]です。"}],question: "[女|おんな]の　[人|ひと]の　[車|くるま]は　どれですか。",options: ["あおい　[車|くるま]","[白|しろ]い　[車|くるま]","あかい　[車|くるま]","くろい　[車|くるま]"],answer: 0,names: ["山川|やまかわ"],en: "Narrator: A man and a woman are talking. Which car is the woman's? — M: Is your car that white car, Ms. Yamakawa? F: The white one is my father's car. M: Then is it that small red car? F: The red one is my older sister's. Mine is the blue car to the right of it. — Which car is the woman's?",explain: "The white car is her father's and the red one her sister's; わたしのは…あおい車です: hers is the blue one. No black car is mentioned.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:no","g:wa-desu","g:ka","g:adj-i","v:さん|さん","v:車|くるま","v:あの|あの","v:白い|しろい","v:父|ちち","v:じゃあ|じゃあ","v:小さい|ちいさい","v:赤い|あかい","v:姉|あね","v:私|わたし","v:その|その","v:右|みぎ","v:青い|あおい","v:黒い|くろい","v:どれ|どれ","k:男","k:人","k:女","k:話","k:山","k:川","k:車","k:白","k:父","k:小","k:右"],verified: true}),

  L({id: "l:n5-how-many-tickets",format: "point",lines: [{speaker: "N",furigana: "えいがかんで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "えいがの　きっぷを　ください。おとな　[二|に]まいと　こども　[一|いち]まいです。"},{speaker: "F",furigana: "こどもは　[何|なん]さいですか。"},{speaker: "M",furigana: "[五|ご]さいです。"},{speaker: "F",furigana: "[六|ろく]さいまでは　きっぷは　いりません。"},{speaker: "M",furigana: "そうですか。じゃあ、おとなの　きっぷだけ　ください。"}],question: "[男|おとこ]の　[人|ひと]は　きっぷを　[何|なん]まい　かいますか。",options: ["[一|いち]まい","[二|に]まい","[三|さん]まい","[五|ご]まい"],answer: 1,en: "Narrator: At a cinema, a man and a woman are talking. How many tickets will the man buy? — M: Movie tickets, please: two adults and one child. F: How old is the child? M: Five. F: Children up to six don't need a ticket. M: I see. Then just the adult tickets, please. — How many tickets will the man buy?",explain: "He first asks for three, but the child is five and children up to six need no ticket, so he buys only the two adult tickets.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:no","g:wo","g:wa-desu","g:ka","g:made","g:masen","g:dake","g:masu","v:映画館|えいがかん","v:映画|えいが","v:切符|きっぷ","v:ください|ください","v:大人|おとな","v:二|に","v:枚|まい","v:子供|こども","v:一|いち","v:何|なん","v:歳|さい","v:五|ご","v:六|ろく","v:要る|いる","v:そう|そう","v:じゃあ|じゃあ","v:三|さん","v:買う|かう","k:男","k:人","k:女","k:話","k:二","k:一","k:何","k:五","k:六","k:三"],verified: true}),

  L({id: "l:n5-shop-sunday",format: "point",lines: [{speaker: "N",furigana: "みせで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。"},{speaker: "M",furigana: "この　みせは　[何|なん][時|じ]まで　あいて　いますか。"},{speaker: "F",furigana: "[月|げつ]ようびから　[土|ど]ようびまでは　よる　[九|く][時|じ]までです。"},{speaker: "M",furigana: "[日|にち]ようびも　[九|く][時|じ]までですか。"},{speaker: "F",furigana: "[日|にち]ようびは　[六|ろく][時|じ]までです。"}],question: "この　みせは　[日|にち]ようびは　[何|なん][時|じ]まで　あいて　いますか。",options: ["[六|ろく][時|じ]","[七|しち][時|じ]","[八|はち][時|じ]","[九|く][時|じ]"],answer: 0,en: "Narrator: In a shop, a man and a woman are talking. Until what time is this shop open on Sundays? — M: Until what time is this shop open? F: From Monday to Saturday, until nine in the evening. M: Is it until nine on Sundays too? F: On Sundays it is until six. — Until what time is this shop open on Sundays?",explain: "Nine o'clock is for Monday to Saturday; for Sunday the woman says 六時までです.",uses: ["g:to","g:ga","g:te-iru","v:男|おとこ","v:女|おんな","v:人|ひと","v:話す|はなす","g:de","g:wa-desu","g:made","g:ka","g:kara","g:mo","v:この|この","v:店|みせ","v:何|なん","v:時|じ","v:開く|あく","v:月曜日|げつようび","v:土曜日|どようび","v:夜|よる","v:九|く","v:日曜日|にちようび","v:六|ろく","v:七|しち","v:八|はち","k:男","k:人","k:女","k:話","k:何","k:時","k:月","k:土","k:九","k:日","k:六","k:七","k:八"],verified: true}),

  // ── dialogue (lesson dialogs, pilot): one scene per lesson unit, shown in the lesson ─────
  // Not a test format: no question / options / answer. See the header and components/dialogue-section.js.
  L({ id: 'l:n5-dlg-team-seven', format: 'dialogue',
    title: 'First day of Team 7', goal: "You can say who you are and ask someone's name.",
    scene: 'Kakashi-sensei meets his new student.',
    cast: { M: { name: 'Kakashi', jp: 'カカシ', role: 'Teacher' }, M2: { name: 'Sasuke', jp: 'サスケ', role: 'Student' } },
    lines: [
      { speaker: 'M', furigana: 'はじめまして。わたしは　カカシです。せんせいです。', en: 'Nice to meet you. I am Kakashi. I am a teacher.' },
      { speaker: 'M', furigana: 'おなまえは？', en: 'Your name?' },
      { speaker: 'M2', furigana: '……サスケです。', en: '...Sasuke.' },
      { speaker: 'M', furigana: 'サスケくんは　[学生|がくせい]ですね。', en: 'You are a student, right?' },
      { speaker: 'M2', furigana: '……ええ。', en: '...Yeah.' },
      { speaker: 'M', furigana: 'よろしく、サスケくん。', en: 'Looking forward to it.' },
      { speaker: 'M2', furigana: '……よろしく　おねがいします。', en: '...Please take care of me.' }
    ],
    bridge: [
      { text: 'お', ctx: 'おなまえ', gloss: 'お + a name: polite, for the other person\u2019s things' },
      { text: 'くん', gloss: 'like さん; what a teacher calls a boy' },
      { text: 'ね', ctx: 'ですね', id: 'g:ne', gloss: 'ね = right? / isn\u2019t it? (taught a few lessons later)' }
    ],
    remixes: [{ scene: 'Same scene, new student. Sakura walks in and introduces herself.', en: 'I am Sakura. I am a student.',
      chunks: ['サクラです。', 'わたしは', 'がくせいです。', 'せんせいです。'], answer: ['サクラです。', 'わたしは', 'がくせいです。'],
      explain: 'がくせいです means "I am a student"; せんせいです would say Sakura is a teacher.' }],
    names: ['カカシ', 'サスケ', 'サクラ'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too. The course teaches polite form; a real teacher and student would be more casual.',
    uses: ['g:wa-desu', 'v:私|わたし', 'v:先生|せんせい', 'v:学生|がくせい', 'v:名前|なまえ', 'v:ええ|ええ', 'g:ne', 'k:学', 'k:生'],
    verified: false }),

  L({ id: 'l:n5-dlg-gojo-lunch', format: 'dialogue',
    title: 'Lunch with Gojo-sensei', goal: 'You can say what you eat and drink, and offer things.',
    scene: 'Lunch break. Gojo-sensei takes his student Itadori out to eat.',
    cast: { M: { name: 'Gojo', jp: 'ごじょう', role: 'Teacher' }, M2: { name: 'Itadori', jp: 'いたどり', role: 'Student' } },
    lines: [
      { speaker: 'M', furigana: 'いたどりくん、なにを　のみますか。', en: 'Itadori, what are you drinking?' },
      { speaker: 'M2', furigana: 'ぼくは　ぎゅうにゅうを　のみます。', en: "I'll have milk." },
      { speaker: 'M', furigana: 'ぎゅうにゅう？　わたしは　おちゃを　のみます。', en: "Milk? I'm having tea." },
      { speaker: 'M', furigana: 'これは　たべものですよ。[食|た]べますか。', en: 'This is food. Will you eat?' },
      { speaker: 'M2', furigana: 'ええ、[食|た]べます！いただきます。', en: "Yes, I will! Let's eat." },
      { speaker: 'M', furigana: 'いたどりくんは　[食|た]べますね。', en: 'You really do eat, huh.' }
    ],
    bridge: [
      { text: 'を', id: 'g:wo', gloss: 'を marks what you eat or drink (taught later)' },
      { text: 'くん', gloss: 'like さん; what a teacher calls a boy' },
      { text: 'ぼく', gloss: 'I, me: a boy\u2019s or man\u2019s casual word' }
    ],
    remixes: [{ scene: 'Same lunch, new order. Now Itadori picks tea and food.', en: 'I drink tea. I eat the food.',
      chunks: ['おちゃを', 'のみます。', 'たべものを', 'たべます。', 'のみますか。'], answer: ['おちゃを', 'のみます。', 'たべものを', 'たべます。'],
      explain: 'Each を stays glued to its noun, and ます ends the verb. のみますか would ask a question instead of saying what you do.' }],
    names: ['いたどり', 'ごじょう'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too. The course teaches polite form; a real teacher and student would be more casual.',
    uses: ['g:masu', 'g:wa-desu', 'g:ka', 'g:yo', 'g:ne', 'g:wo', 'v:何|なに', 'v:私|わたし', 'v:飲む|のむ', 'v:牛乳|ぎゅうにゅう', 'v:お茶|おちゃ', 'v:これ|これ', 'v:食べ物|たべもの', 'v:食べる|たべる', 'v:ええ|ええ', 'k:食'],
    verified: false }),
]);
}());
