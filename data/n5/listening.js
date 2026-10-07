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
//               Fields: title, goal, scene, cast { <character id>: { name, jp, gender M|F, role } } (ids from tools/audio/cast.json; the
//               first key is the left speaker), lines [{ speaker <cast id>, furigana, en, say? }], bridge (max 3 words the
//               unit has not taught: { text, gloss, ctx?, id? }), remixes (1-3 swaps for the lesson's Practice card:
//               { scene, en, chunks (answer chunks + 1 distractor), answer, explain }; ungraded, not in the quiz),
//               names, uses. The voice reads natural full-kanji text built from the line and `uses` (phrase spaces removed;
//               numerals spoken from their ruby: dialogueSpeech in lib.js); `say` = optional speech override for a line it gets
//               wrong; `take` = optional integer > 1 to re-render a line whose clip came out wrong (new clip name).
//               Each character has one fixed voice (tools/audio/cast.json, tools/audio/README.md): no per-line tone,
//               delivery comes from punctuation (……, ！, ？). The full guide is docs/dialogue-authoring.md.
// Audio is pre-rendered TTS clips (audio/manifest.js; dialogues from their speech text, the other formats from the kana readings); the browser's
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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-whose-umbrella', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'これは　だれの　かさですか。' }],
    optionSpeaker: 'F',
    options: ['あそこです。', 'キムさんのです。', 'わたしの　[本|ほん]です。'], answer: 1,
    names: ['キム'],
    en: 'Man: Whose umbrella is this? — 1. It is over there. 2. It is Kim\'s. 3. It is my book.',
    explain: 'だれの asks "whose", so the reply names the owner: キムさんのです "Kim\'s". あそこです "over there" answers where, not whose. The book doesn\'t fit: the question is about an umbrella.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'v:これ|これ', 'v:誰|だれ', 'v:傘|かさ', 'v:あそこ|あそこ', 'v:さん|さん', 'v:私|わたし', 'v:本|ほん', 'k:本'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-nationality', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'マリアさんは　どこの　[国|くに]の　[人|ひと]ですか。' }],
    optionSpeaker: 'F',
    options: ['[学生|がくせい]です。', 'えいごです。', 'ブラジル[人|じん]です。'], answer: 2,
    names: ['マリア', 'ブラジル'],
    en: 'Man: Maria, which country are you from? — 1. I am a student. 2. It is English. 3. I am Brazilian.',
    explain: 'どこの国の人 asks which country someone is from, so the reply names a country + 人: ブラジル人. 学生 is an occupation and えいご a language, not a country or nationality.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'v:さん|さん', 'v:どこ|どこ', 'v:国|くに', 'v:人|ひと', 'v:人|じん', 'v:学生|がくせい', 'v:英語|えいご', 'k:国', 'k:人', 'k:学', 'k:生'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-sister-student', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'キムさんの　おねえさんも　[学生|がくせい]ですか。' }],
    optionSpeaker: 'F',
    options: ['あねは　[先生|せんせい]です。', '[母|はは][は|わ]　[先生|せんせい]です。', 'わたしの　あねです。'], answer: 0,
    names: ['キム'],
    en: 'Man: Kim, is your older sister a student too? — 1. My sister is a teacher. 2. My mother is a teacher. 3. She is my older sister.',
    explain: 'The question is about Kim\'s sister. Speaking of her own sister, Kim says あね (おねえさん is for someone else\'s): "my sister is a teacher", so not a student. The mother is not asked about, and "she is my sister" does not answer whether she is a student.',
    uses: ['g:wa-desu', 'g:ka', 'g:no', 'g:mo', 'v:さん|さん', 'v:お姉さん|おねえさん', 'v:学生|がくせい', 'v:姉|あね', 'v:先生|せんせい', 'v:母|はは', 'v:私|わたし', 'k:学', 'k:生', 'k:先', 'k:母'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-get-up-time', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'まいあさ　[何|なん][時|じ]に　おきますか。' }],
    optionSpeaker: 'F',
    options: ['[六|ろく][時|じ][間|かん]　ねます。', '[六|ろく][時|じ]に　おきます。', '[六|ろく][時|じ]に　おきました。'], answer: 1,
    en: 'Man: What time do you get up every morning? — 1. I sleep six hours. 2. I get up at six. 3. I got up at six.',
    explain: 'まいあさ…おきますか asks about a habit, so the reply keeps the present ます form: 六時におきます. おきました is past (one morning), and 六時間ねます answers "how long do you sleep".',
    uses: ['g:ni', 'g:masu', 'g:ka', 'g:mashita', 'v:毎朝|まいあさ', 'v:何|なん', 'v:時|じ', 'v:起きる|おきる', 'v:六|ろく', 'v:時間|じかん', 'v:寝る|ねる', 'k:何', 'k:時', 'k:六', 'k:間'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-where-tomorrow', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'あした　どこへ　[行|い]きますか。' }],
    optionSpeaker: 'M',
    options: ['バスで　[行|い]きます。', 'デパートへ　[行|い]きました。', 'デパートへ　[行|い]きます。'], answer: 2,
    en: 'Woman: Where are you going tomorrow? — 1. I am going by bus. 2. I went to the department store. 3. I am going to the department store.',
    explain: 'どこへ asks for a place, so the reply has a place + へ: デパートへ行きます. バスで tells how, not where, and 行きました is past, but the question is about tomorrow.',
    uses: ['g:ni-ikimasu', 'g:de', 'g:masu', 'g:mashita', 'g:ka', 'v:明日|あした', 'v:どこ|どこ', 'v:行く|いく', 'v:バス|バス', 'v:デパート|デパート', 'k:行'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-how-much', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'この　かさは　いくらですか。' }],
    optionSpeaker: 'F',
    options: ['[一|ひと]つです。', 'あの　みせです。', '[千|せん][円|えん]です。'], answer: 2,
    en: 'Man: How much is this umbrella? — 1. It is one. 2. It is that shop. 3. It is a thousand yen.',
    explain: 'いくら asks for a price: 千円です. 一つ answers "how many" (いくつ, which sounds close), and あのみせ answers "where".',
    uses: ['g:wa-desu', 'g:ka', 'v:この|この', 'v:傘|かさ', 'v:いくら|いくら', 'v:一つ|ひとつ', 'v:あの|あの', 'v:店|みせ', 'v:千|せん', 'v:円|えん', 'k:一', 'k:千', 'k:円'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-lunch-together', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'いっしょに　ひるごはんを　[食|た]べませんか。' }],
    optionSpeaker: 'M',
    options: ['[食|た]べませんでした。', 'いいですね。[食|た]べましょう。', 'どうぞ　[食|た]べて　ください。'], answer: 1,
    en: 'Woman: Would you like to have lunch together? — 1. I didn\'t eat. 2. Sounds good. Let\'s eat. 3. Please, go ahead and eat.',
    explain: '〜ませんか is an invitation; いいですね、〜ましょう accepts it. 食べませんでした is a past answer to "did you eat?", and どうぞ食べてください offers food to someone: it doesn\'t answer "shall we eat together".',
    uses: ['g:wo', 'g:masen-ka', 'g:mashita', 'g:mashou', 'g:ne', 'g:te-kudasai', 'v:一緒|いっしょ', 'v:昼御飯|ひるごはん', 'v:食べる|たべる', 'v:いい|いい', 'v:どうぞ|どうぞ', 'k:食'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-been-to-kyoto', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'きょうとへ　[行|い]ったことが　ありますか。' }],
    optionSpeaker: 'F',
    options: ['きょねん　[行|い]きました。', 'きょねん　[行|い]きます。', 'きょうとへ　[行|い]って　ください。'], answer: 0,
    names: ['きょうと'],
    en: 'Man: Have you ever been to Kyoto? — 1. I went last year. 2. I go last year. 3. Please go to Kyoto.',
    explain: '〜たことがありますか asks about experience; "I went last year" says yes. きょねん (last year) needs the past 行きました, so 行きます is wrong, and 行ってください asks the man to go: not an answer.',
    uses: ['g:ta-koto-ga-aru', 'g:ni-ikimasu', 'g:mashita', 'g:te-kudasai', 'g:ka', 'v:行く|いく', 'v:ある|ある', 'v:去年|きょねん', 'k:行'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-may-i-sit', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'ここに　すわっても　いいですか。' }],
    optionSpeaker: 'F',
    options: ['すわりました。', 'すわりたいです。', 'どうぞ、すわって　ください。'], answer: 2,
    en: 'Man: May I sit here? — 1. I sat down. 2. I want to sit down. 3. Go ahead, please sit.',
    explain: '〜てもいいですか asks for permission; どうぞ、すわってください gives it. すわりました (I sat) and すわりたいです (I want to sit) talk about the woman herself.',
    uses: ['g:ni', 'g:te-mo-ii', 'g:ka', 'g:mashita', 'g:tai', 'g:te-kudasai', 'v:ここ|ここ', 'v:座る|すわる', 'v:いい|いい', 'v:どうぞ|どうぞ'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-why-absent', format: 'quick',
    lines: [{ speaker: 'F', furigana: 'きのう　どうして　[学校|がっこう]を　[休|やす]みましたか。' }],
    optionSpeaker: 'M',
    options: ['[学校|がっこう]は　[九|く][時|じ]からです。', 'びょうきだったからです。', 'あしたは　[休|やす]みます。'], answer: 1,
    en: 'Woman: Why were you absent from school yesterday? — 1. School starts at nine. 2. Because I was sick. 3. I will be absent tomorrow.',
    explain: 'どうして asks for a reason; 〜からです gives one: "because I was sick". 九時からです also ends in から, but there it means "from nine o\'clock", not "because". Tomorrow is not what was asked.',
    uses: ['g:doushite', 'g:wo', 'g:mashita', 'g:ka', 'g:wa-desu', 'g:kara', 'g:deshita', 'g:masu', 'v:昨日|きのう', 'v:どうして|どうして', 'v:学校|がっこう', 'v:休む|やすむ', 'v:九|く', 'v:時|じ', 'v:病気|びょうき', 'v:明日|あした', 'k:学', 'k:校', 'k:休', 'k:九', 'k:時'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-weather-tomorrow', format: 'quick',
    lines: [{ speaker: 'M', furigana: 'あしたの　[天気|てんき]は　どうでしょうか。' }],
    optionSpeaker: 'F',
    options: ['[雨|あめ]が　ふるでしょう。', 'きのうは　[雨|あめ]でした。', '[雨|あめ]が　すきです。'], answer: 0,
    en: 'Man: What will the weather be like tomorrow? — 1. It will probably rain. 2. It rained yesterday. 3. I like rain.',
    explain: 'The man asks about tomorrow; 〜でしょう guesses about the future: "it will probably rain". Yesterday\'s rain is the past, and liking rain is not a forecast.',
    uses: ['g:no', 'g:wa-desu', 'g:ka', 'g:deshou', 'g:ga', 'g:deshita', 'v:明日|あした', 'v:天気|てんき', 'v:どう|どう', 'v:昨日|きのう', 'v:雨|あめ', 'v:降る|ふる', 'v:好き|すき', 'k:天', 'k:気', 'k:雨'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

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

  // ── dialogue (lesson dialogs): one scene per lesson unit, shown in the lesson ─────
  // Not a test format: no question / options / answer. See the header, docs/dialogue-authoring.md and components/dialogue-section.js.
  L({ id: 'l:n5-dlg-first-class', format: 'dialogue',
    title: 'First class', goal: "You can say who you are and ask someone's name.",
    scene: 'First day of class. Lelouch sits calmly at the front desk with a small chess set when a quiet new student walks in.',
    cast: { lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'New student' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'New student' } },
    lines: [
      { speaker: 'lelouch', furigana: 'はじめまして。わたしは　ルルーシュです。', en: 'Nice to meet you. I am Lelouch.' },
      { speaker: 'sasuke', furigana: '……せんせいですか。', en: '...Are you the teacher?' },
      { speaker: 'lelouch', furigana: 'いいえ。わたしは　[学生|がくせい]です。', en: 'No. I am a student.' },
      { speaker: 'lelouch', furigana: 'おなまえは？', en: 'And your name?' },
      { speaker: 'sasuke', furigana: '……サスケです。', en: '...Sasuke.' },
      { speaker: 'lelouch', furigana: 'サスケさんは　せんせいですか。', en: 'Are you the teacher, Sasuke?' },
      { speaker: 'sasuke', furigana: '……[学生|がくせい]です。', en: '...A student.' },
      { speaker: 'lelouch', furigana: 'サスケさん、よろしく　おねがいします。', en: 'Sasuke, it is good to meet you.' },
      { speaker: 'sasuke', furigana: '……ええ。よろしく。', en: '...Yeah. Likewise.' }
    ],
    bridge: [
      { text: 'お', ctx: 'おなまえ', id: 'v:お|お', gloss: 'お + a name: polite, for the other person’s things' },
      { text: 'か', ctx: 'ですか', id: 'g:ka', gloss: 'か at the end = a question: せんせいですか = are you the teacher? (taught next lesson)' }
    ],
    remixes: [
      { scene: 'Same classroom. Sakura walks in and introduces herself.', en: 'I am Sakura. I am a student.',
        chunks: ['わたしは', 'サクラです。', 'がくせいです。', 'サクラさんです。'], answer: ['わたしは', 'サクラです。', 'がくせいです。'],
        explain: 'さん is for other people, never for your own name: Sakura says サクラです. Lelouch calls her サクラさん.' }
    ],
    names: ['ルルーシュ', 'サスケ', 'サクラ'],
    uses: ['g:wa-desu', 'g:ka', 'v:私|わたし', 'v:先生|せんせい', 'v:学生|がくせい', 'v:いいえ|いいえ', 'v:お|お', 'v:名前|なまえ', 'v:さん|さん', 'v:ええ|ええ', 'k:学', 'k:生'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too. 先生 stays in kana: 先 is taught later.',
    verified: false }),

  L({ id: 'l:n5-dlg-forger-table', format: 'dialogue',
    title: 'At the table', goal: 'You can say what you eat and drink, and offer things.',
    scene: 'Dinner at home. Yor is a little nervous about serving her new child, and there is peanut bread.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Host' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'アーニャさん、[何|なに]を　のみますか。', en: 'Anya, what will you drink?' },
      { speaker: 'anya', furigana: 'アーニャは　ぎゅうにゅうを　のみます！', en: 'Anya will drink milk!' },
      { speaker: 'yor', furigana: 'わたしは　おちゃを　のみます。', en: 'I will drink tea.' },
      { speaker: 'yor', furigana: 'これは　ピーナッツの　パンです。[食|た]べますか。', en: 'This is peanut bread. Will you eat some?' },
      { speaker: 'anya', furigana: 'ピーナッツ！　[食|た]べます！　いただきます！', en: 'Peanuts! I will eat! Thank you for the food!' },
      { speaker: 'anya', furigana: 'おいしい！　ははも　[食|た]べますか？', en: 'Yummy! Will you eat too, Mother?' },
      { speaker: 'yor', furigana: 'はい、いただきます。', en: 'Yes, I’ll have some.' },
      { speaker: 'anya', furigana: 'パンは　どうぞ。ピーナッツは　アーニャの！', en: 'The bread, here you go. The peanuts are Anya’s!' }
    ],
    bridge: [
      { text: 'を', id: 'g:wo', gloss: 'を marks what you eat or drink (taught later)' },
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Same table, new order. Now Anya picks black tea and the food.', en: 'Anya drinks black tea. Anya eats the food.',
        chunks: ['アーニャは', 'こうちゃを', 'のみます。', 'たべものを', 'たべます。', 'のみますか。'], answer: ['アーニャは', 'こうちゃを', 'のみます。', 'たべものを', 'たべます。'],
        explain: 'Each を stays glued to its noun, and ます ends the verb. のみますか would ask a question instead of saying what Anya does.' },
      { scene: 'Yor offers Anya a glass of water.', en: 'Will you drink water?',
        chunks: ['みずを', 'のみますか。', 'たべますか。'], answer: ['みずを', 'のみますか。'],
        explain: 'You drink water: みずを のみます. たべますか would ask Anya to eat the water.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:masu', 'g:wa-desu', 'g:ka', 'g:no', 'g:mo', 'g:wo', 'v:何|なに', 'v:私|わたし', 'v:さん|さん', 'v:飲む|のむ', 'v:牛乳|ぎゅうにゅう', 'v:お茶|おちゃ', 'v:これ|これ', 'v:パン|パン', 'v:食べる|たべる', 'v:おいしい|おいしい', 'v:母|はは', 'v:どうぞ|どうぞ', 'v:はい|はい', 'k:何', 'k:食'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too. ピーナッツ is not on the N5 list: a bridge only.',
    verified: false }),

  L({ id: 'l:n5-dlg-new-face', format: 'dialogue',
    title: 'A new face', goal: 'You can ask who someone is and ask "Are you ...?"',
    scene: 'Emilia sees a new face in the classroom and says hello.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Classmate' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'New student' } },
    lines: [
      { speaker: 'emilia', furigana: 'すみません、どなたですか？', en: 'Excuse me, who are you?' },
      { speaker: 'sanji', furigana: 'はじめまして。サンジです。[学生|がくせい]です。', en: 'Nice to meet you. I am Sanji. I am a student.' },
      { speaker: 'emilia', furigana: 'エミリアです。はじめまして。サンジさんは　[外国人|がいこくじん]ですか？', en: 'I am Emilia. Nice to meet you. Sanji, are you a foreigner?' },
      { speaker: 'sanji', furigana: 'はい。エミリアさんも　[外国人|がいこくじん]ですか？', en: 'Yes. Are you a foreigner too, Emilia?' },
      { speaker: 'emilia', furigana: 'はい、わたしも　[外国人|がいこくじん]です。', en: 'Yes, I am a foreigner too.' },
      { speaker: 'sanji', furigana: 'えいごは　だいじょうぶですか？', en: 'Is English all right for you?' },
      { speaker: 'emilia', furigana: 'えいごは……ちょっと。サンジさんは？', en: 'English is... not really. And you, Sanji?' },
      { speaker: 'sanji', furigana: 'わたしも　ちょっと……。', en: 'Not really for me either...' }
    ],
    bridge: [
      { text: 'も', ctx: 'わたしも', id: 'g:mo', gloss: 'も = also, too (taught a few lessons later)' },
      { text: 'だいじょうぶ', id: 'v:大丈夫|だいじょうぶ', gloss: 'だいじょうぶ = all right, OK (taught later)' }
    ],
    remixes: [
      { scene: 'Same classroom. Emilia sees a man at the front desk and asks him.', en: 'Excuse me, are you a teacher?',
        chunks: ['すみません、', 'せんせいですか？', 'せんせいです。'], answer: ['すみません、', 'せんせいですか？'],
        explain: 'か at the end turns です into a question. せんせいです。 would tell him he is a teacher instead of asking.' },
      { scene: 'Emilia says she is a student. Sanji answers.', en: 'I am a student too.',
        chunks: ['わたしも', 'がくせいです。', 'がくせいですか？'], answer: ['わたしも', 'がくせいです。'],
        explain: 'も goes right after わたし to say "me too". ですか？ would ask a question instead of answering.' }
    ],
    names: ['エミリア', 'サンジ'],
    uses: ['g:ka', 'g:wa-desu', 'g:mo', 'v:どなた|どなた', 'v:私|わたし', 'v:学生|がくせい', 'v:さん|さん', 'v:外国人|がいこくじん', 'v:英語|えいご', 'v:大丈夫|だいじょうぶ', 'v:ちょっと|ちょっと', 'v:はい|はい', 'k:学', 'k:生', 'k:外', 'k:国', 'k:人'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-lost-umbrella', format: 'dialogue',
    title: 'Whose umbrella?', goal: 'You can say whose something is.',
    scene: 'After class, Gojo holds up the things left behind and asks Sakura whose they are.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'サクラさん、これは　だれの　かさですか？', en: 'Sakura, whose umbrella is this?' },
      { speaker: 'sakura', furigana: 'わたしの　かさです！', en: 'It is my umbrella!' },
      { speaker: 'gojo', furigana: '[本|ほん]は？　だれの　[本|ほん]ですか？', en: 'And the book? Whose book is it?' },
      { speaker: 'sakura', furigana: 'サスケさんの　[本|ほん]です。', en: 'It is Sasuke’s book.' },
      { speaker: 'gojo', furigana: 'えんぴつは？', en: 'And the pencil?' },
      { speaker: 'sakura', furigana: 'えんぴつは　ナルトのです。', en: 'The pencil is Naruto’s.' },
      { speaker: 'gojo', furigana: 'とけいは？　だれの　とけいですか？', en: 'And the watch? Whose watch is it?' },
      { speaker: 'sakura', furigana: '……[先生|せんせい]の　とけいです。', en: '...It is your watch, sensei.' }
    ],
    bridge: [
      { text: 'これ', id: 'v:これ|これ', gloss: 'これ = this (the thing near me)' }
    ],
    remixes: [
      { scene: 'Gojo holds up a dictionary.', en: 'Whose dictionary is this?',
        chunks: ['これは', 'だれの', 'じしょですか？', 'じしょです。'], answer: ['これは', 'だれの', 'じしょですか？'],
        explain: 'だれの asks "whose", and か makes the sentence a question. じしょです would end it as a statement, which cannot hold だれ.' },
      { scene: 'Sakura tells Gojo whose the dictionary is.', en: 'The dictionary is Sasuke’s.',
        chunks: ['じしょは', 'サスケさんのです。', 'サスケさんは'], answer: ['じしょは', 'サスケさんのです。'],
        explain: 'の after a name makes the owner: サスケさんのです = it is Sasuke’s. サスケさんは would start a second topic and say nothing.' }
    ],
    names: ['ゴジョウ', 'サクラ', 'サスケ', 'ナルト'],
    uses: ['g:no', 'g:ka', 'g:wa-desu', 'v:これ|これ', 'v:誰|だれ', 'v:傘|かさ', 'v:私|わたし', 'v:先生|せんせい', 'v:本|ほん', 'v:鉛筆|えんぴつ', 'v:時計|とけい', 'v:さん|さん', 'k:先', 'k:生', 'k:本'],
    verified: true }),

  L({ id: 'l:n5-dlg-lost-and-found', format: 'dialogue',
    title: 'Lost glasses', goal: 'You can say "this is not ..." and point with これ, それ and あれ.',
    scene: 'Frieren has lost her glasses and cannot see. She comes to the lost-property desk, where Hinata is helping.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'hinata', furigana: '[先生|せんせい]！　めがねは？', en: 'Sensei! Your glasses?' },
      { speaker: 'frieren', furigana: '……これは　わたしの　めがねですか。', en: '...Are these my glasses?' },
      { speaker: 'hinata', furigana: 'それは　めがねじゃ　ありません！　えんぴつです！', en: 'Those are not glasses! That is a pencil!' },
      { speaker: 'frieren', furigana: '……あの　[人|ひと]は　どなたですか。', en: '...Who is that person over there?' },
      { speaker: 'hinata', furigana: 'あれは　[人|ひと]じゃ　ありません。かさです！', en: 'That is not a person. It is an umbrella!' },
      { speaker: 'hinata', furigana: 'この　めがねは　[先生|せんせい]のですか？', en: 'Are these glasses yours, sensei?' },
      { speaker: 'frieren', furigana: '……どの　めがねですか。', en: '...Which glasses?' },
      { speaker: 'hinata', furigana: 'この　めがねです！　どうぞ！', en: 'These glasses! Here you go!' },
      { speaker: 'frieren', furigana: '……ヒナタさんですか。', en: '...Oh. It is you, Hinata.' }
    ],
    bridge: [
      { text: 'めがね', id: 'v:眼鏡|めがね', gloss: 'めがね = glasses (taught later)' }
    ],
    remixes: [
      { scene: 'Frieren points at a clock and thinks it is her book. Hinata answers.', en: 'That is not a book. It is a clock.',
        chunks: ['あれは', 'ほんじゃありません。', 'とけいです。', 'ほんです。'], answer: ['あれは', 'ほんじゃありません。', 'とけいです。'],
        explain: 'じゃありません says "it is not", then とけいです says what it is. ほんです would agree that it is a book.' },
      { scene: 'Hinata holds up a pencil from the pile.', en: 'Is this pencil yours, sensei?',
        chunks: ['この', 'えんぴつは', 'せんせいのですか？', 'これ'], answer: ['この', 'えんぴつは', 'せんせいのですか？'],
        explain: 'この goes right before a noun: この えんぴつ. これ stands on its own and cannot sit before えんぴつ.' }
    ],
    names: ['フリーレン', 'ヒナタ'],
    uses: ['g:ja-nai', 'g:no', 'g:ka', 'g:wa-desu', 'v:これ|これ', 'v:それ|それ', 'v:あれ|あれ', 'v:この|この', 'v:あの|あの', 'v:どの|どの', 'v:眼鏡|めがね', 'v:私|わたし', 'v:鉛筆|えんぴつ', 'v:人|ひと', 'v:どなた|どなた', 'v:傘|かさ', 'v:先生|せんせい', 'v:どうぞ|どうぞ', 'v:さん|さん', 'k:先', 'k:生', 'k:人'],
    verified: true }),

  L({ id: 'l:n5-dlg-family-photo', format: 'dialogue',
    title: 'A family photo', goal: 'You can introduce your family and say "this one too".',
    scene: 'In the school cafeteria, Yor shyly shows Nami the photos of her family she carries.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'yor', furigana: 'あの、ナミさん。これは　わたしの　かぞくです。', en: 'Um, Nami. This is my family.' },
      { speaker: 'nami', furigana: 'この　[人|ひと]は？', en: 'Who is this?' },
      { speaker: 'yor', furigana: '[父|ちち]です。これは　[母|はは]です。', en: 'My father. This is my mother.' },
      { speaker: 'nami', furigana: 'これは？', en: 'And this?' },
      { speaker: 'yor', furigana: 'おとうとです。', en: 'My younger brother.' },
      { speaker: 'nami', furigana: 'これも？', en: 'This one too?' },
      { speaker: 'yor', furigana: 'はい、これも　おとうとです。', en: 'Yes, this is my brother too.' },
      { speaker: 'nami', furigana: '……これも？', en: '...This one too?' },
      { speaker: 'yor', furigana: 'はい！　これも、これも、おとうとです。', en: 'Yes! This one and this one are my brother too.' },
      { speaker: 'nami', furigana: 'ヨルさんの　かぞくは　おとうとさんですね。', en: 'Your family is your little brother, Yor.' }
    ],
    bridge: [
      { text: 'ね', ctx: 'ですね', id: 'g:ne', gloss: 'ね = right? / isn’t it? (taught next lesson)' }
    ],
    remixes: [
      { scene: 'Nami shows Yor a photo of her own sister.', en: 'This is my older sister.',
        chunks: ['これは', 'わたしの', 'あねです。', 'いもうとです。'], answer: ['これは', 'わたしの', 'あねです。'],
        explain: 'あね is my older sister, いもうと my younger sister. いもうとです would make her the younger one.' },
      { scene: 'Yor turns to one more photo of her mother.', en: 'This is my mother too.',
        chunks: ['これも', 'ははです。', 'これは'], answer: ['これも', 'ははです。'],
        explain: 'も takes the place of は and adds "too". これは would only say "this is my mother".' }
    ],
    names: ['ヨル', 'ナミ'],
    uses: ['g:mo', 'g:no', 'g:wa-desu', 'g:ne', 'v:あの|あの', 'v:これ|これ', 'v:この|この', 'v:私|わたし', 'v:家族|かぞく', 'v:人|ひと', 'v:父|ちち', 'v:母|はは', 'v:弟|おとうと', 'v:さん|さん', 'v:はい|はい', 'k:人', 'k:父', 'k:母'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-teachers-office', format: 'dialogue',
    title: 'In the office', goal: 'You can check what you heard with ね.',
    scene: 'In the teacher’s office, Gojo guesses who taught Lelouch chess and keeps guessing wrong.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'ルルーシュさん、チェスの　[先生|せんせい]は　おとうさんですね。', en: 'Lelouch, your chess teacher is your father, right?' },
      { speaker: 'lelouch', furigana: 'いいえ。[父|ちち]じゃ　ありません。', en: 'No. It is not my father.' },
      { speaker: 'gojo', furigana: 'じゃあ、おかあさんですね。', en: 'Then it is your mother, right?' },
      { speaker: 'lelouch', furigana: '[母|はは]も　[先生|せんせい]じゃ　ありません。', en: 'My mother is not my teacher either.' },
      { speaker: 'gojo', furigana: 'じゃあ、いもうとさんですね。', en: 'Then it is your younger sister, right?' },
      { speaker: 'lelouch', furigana: 'いいえ。いもうとは　[学生|がくせい]です。', en: 'No. My younger sister is a student.' },
      { speaker: 'gojo', furigana: 'じゃあ、[先生|せんせい]は　だれですか？', en: 'Then who is your teacher?' },
      { speaker: 'lelouch', furigana: '……チェスの　[本|ほん]です。', en: '...A chess book.' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' },
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Gojo checks one more fact about Lelouch’s family.', en: 'Your younger sister is a student, right?',
        chunks: ['いもうとさんは', 'がくせいですね。', 'がくせいですか？'], answer: ['いもうとさんは', 'がくせいですね。'],
        explain: 'ね at the end checks something you think you know: "...right?". がくせいですか？ would ask as if Gojo had no idea.' },
      { scene: 'Gojo makes one more guess about who taught Lelouch chess.', en: 'Your older brother is the teacher, right?',
        chunks: ['おにいさんは', 'せんせいですね。', 'あには'], answer: ['おにいさんは', 'せんせいですね。'],
        explain: 'おにいさん is someone else’s older brother, the polite word Gojo needs. あに is only for your own brother.' }
    ],
    names: ['ゴジョウ', 'ルルーシュ'],
    uses: ['g:ne', 'g:ka', 'g:ja-nai', 'g:mo', 'g:no', 'g:wa-desu', 'v:お父さん|おとうさん', 'v:お母さん|おかあさん', 'v:父|ちち', 'v:母|はは', 'v:妹|いもうと', 'v:さん|さん', 'v:先生|せんせい', 'v:学生|がくせい', 'v:誰|だれ', 'v:本|ほん', 'v:じゃあ|じゃあ', 'v:いいえ|いいえ', 'k:父', 'k:母', 'k:先', 'k:学', 'k:生', 'k:本'],
    notes: 'uses v:いいえ|いいえ, which is unverified, so the dialogue is too. チェス is not on the N5 list: a bridge only.',
    verified: false }),

  L({ id: 'l:n5-dlg-school-entrance', format: 'dialogue',
    title: 'Where is it?', goal: 'You can ask where something is and answer with よ.',
    scene: 'At the school entrance, a visitor, Emilia, asks a lazy-looking man the way. He is Kakashi.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Visitor' } },
    lines: [
      { speaker: 'emilia', furigana: 'あの、おてあらいは　どこですか？', en: 'Um, where is the restroom?' },
      { speaker: 'kakashi', furigana: 'そこですよ。', en: 'Right there.' },
      { speaker: 'emilia', furigana: 'ここですか！　ありがとうございます。', en: 'Here! Thank you.' },
      { speaker: 'emilia', furigana: 'カカシ[先生|せんせい]は　どちらですか？', en: 'And where is Kakashi-sensei?' },
      { speaker: 'kakashi', furigana: 'カカシ[先生|せんせい]は……ここですよ。', en: 'Kakashi-sensei is... right here.' },
      { speaker: 'emilia', furigana: '[先生|せんせい]ですか！', en: 'You are the teacher!' },
      { speaker: 'kakashi', furigana: 'ええ。エミリアさんですね。', en: 'Yes. You are Emilia, right?' }
    ],
    remixes: [
      { scene: 'Emilia asks the way.', en: 'Where is the restroom?',
        chunks: ['おてあらいは', 'どこですか？', 'そこですよ。'], answer: ['おてあらいは', 'どこですか？'],
        explain: 'どこ means "where" and か makes it a question. そこですよ would be the answer, not the question.' },
      { scene: 'Kakashi points down the long corridor.', en: 'The restroom is over there.',
        chunks: ['おてあらいは', 'あそこですよ。', 'どこですか？'], answer: ['おてあらいは', 'あそこですよ。'],
        explain: 'あそこ is far from both of you, and よ tells the listener something new. どこですか？ would ask instead of answer.' }
    ],
    names: ['カカシ', 'エミリア'],
    uses: ['g:yo', 'g:ne', 'g:ka', 'g:wa-desu', 'v:さん|さん', 'v:お手洗い|おてあらい', 'v:どこ|どこ', 'v:そこ|そこ', 'v:ここ|ここ', 'v:どちら|どちら', 'v:あの|あの', 'v:先生|せんせい', 'v:ええ|ええ', 'k:先', 'k:生'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-party-way', format: 'dialogue',
    title: 'Which way?', goal: 'You can ask which way and when.',
    scene: 'In the school corridor, Hinata is looking for the party and Lelouch points the way.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'hinata', furigana: 'ルルーシュさん！　パーティーは　どっちですか？', en: 'Lelouch! Which way is the party?' },
      { speaker: 'lelouch', furigana: 'あっちですよ。', en: 'That way.' },
      { speaker: 'hinata', furigana: 'こっちですか？', en: 'This way?' },
      { speaker: 'lelouch', furigana: 'いいえ、そっちは　トイレです。パーティーは　あっちです。', en: 'No, that way is the restroom. The party is that way.' },
      { speaker: 'hinata', furigana: 'あっち！', en: 'That way!' },
      { speaker: 'lelouch', furigana: 'ヒナタさん。パーティーは　いつですか？', en: 'Hinata. When is the party?' },
      { speaker: 'hinata', furigana: 'いつ……？　きょうじゃ　ありませんか？', en: 'When...? Isn’t it today?' },
      { speaker: 'lelouch', furigana: 'あしたです。', en: 'Tomorrow.' },
      { speaker: 'hinata', furigana: 'あしたも　あっちですか？', en: 'Is it that way tomorrow too?' },
      { speaker: 'lelouch', furigana: '……ええ。あしたも　あっちです。', en: '...Yes. Tomorrow it is that way too.' }
    ],
    bridge: [
      { text: 'あした', id: 'v:明日|あした', gloss: 'あした = tomorrow (taught later)' },
      { text: 'きょう', id: 'v:今日|きょう', gloss: 'きょう = today (taught later)' }
    ],
    remixes: [
      { scene: 'Lelouch points Hinata the right way.', en: 'It is not this way. It is that way.',
        chunks: ['こっちじゃありません。', 'あっちです。', 'どっちですか？'], answer: ['こっちじゃありません。', 'あっちです。'],
        explain: 'こっち is near me, あっち is far from both of us. どっちですか？ would ask which way.' },
      { scene: 'Later, Hinata looks for the restroom.', en: 'Which way is the restroom?',
        chunks: ['おてあらいは', 'どっちですか？', 'あっちです。'], answer: ['おてあらいは', 'どっちですか？'],
        explain: 'どっち asks "which way", and か makes the question. あっちです is an answer, not a question.' }
    ],
    names: ['ヒナタ', 'ルルーシュ'],
    uses: ['g:ka', 'g:yo', 'g:mo', 'g:ja-nai', 'g:wa-desu', 'v:さん|さん', 'v:パーティー|パーティー', 'v:どっち|どっち', 'v:あっち|あっち', 'v:こっち|こっち', 'v:そっち|そっち', 'v:トイレ|トイレ', 'v:いつ|いつ', 'v:明日|あした', 'v:今日|きょう', 'v:ええ|ええ', 'v:いいえ|いいえ'],
    notes: 'uses v:ええ|ええ, v:いいえ|いいえ, which are unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-right-bus', format: 'dialogue',
    title: 'The right bus', goal: 'You can say where you go and where you return.',
    scene: 'At the bus stop in front of the station, Lelouch asks a stranger, Maomao, which bus goes to the university.',
    cast: { lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Stranger' } },
    lines: [
      { speaker: 'lelouch', furigana: 'すみません。この　バスは　[大学|だいがく]へ　[行|い]きますか？', en: 'Excuse me. Does this bus go to the university?' },
      { speaker: 'maomao', furigana: 'いいえ。がっこうへ　[行|い]きます。', en: 'No. It goes to the school.' },
      { speaker: 'lelouch', furigana: '[大学|だいがく]の　バスは　どれですか？', en: 'Which one is the university bus?' },
      { speaker: 'maomao', furigana: 'あれです。', en: 'That one.' },
      { speaker: 'lelouch', furigana: 'ありがとうございます。わたしは　[大学|だいがく]へ　[行|い]きます。[大学|だいがく]の　[学生|がくせい]です。', en: 'Thank you. I am going to the university. I am a university student.' },
      { speaker: 'maomao', furigana: '……そうですか。', en: '...Is that so.', take: 2 }, // take 2: the first render drifted to another voice
      { speaker: 'lelouch', furigana: '……かいしゃへ　[行|い]きますか？', en: '...Are you going to work?' },
      { speaker: 'maomao', furigana: 'いいえ。いえへ　かえります。', en: 'No. I am going home.' },
      { speaker: 'maomao', furigana: 'バス、[来|き]ますよ。', en: 'Your bus is coming.' }
    ],
    bridge: [
      { text: 'そう', ctx: 'そうですか', id: 'v:そう|そう', gloss: 'そうですか = I see (a flat そうですか can mean "and?"; taught later)' }
    ],
    remixes: [
      { scene: 'Maomao tells Lelouch where she is going.', en: 'I am going home.',
        chunks: ['わたしは', 'いえへ', 'かえります。', 'のみます。'], answer: ['わたしは', 'いえへ', 'かえります。'],
        explain: 'かえります is the verb for going back to your own place, and へ marks where. のみます means "drink", which cannot take へ.' },
      { scene: 'Lelouch tells Maomao where he is going (she did not ask).', en: 'I am going to the university.',
        chunks: ['だいがくへ', 'いきます。', 'いきますか？'], answer: ['だいがくへ', 'いきます。'],
        explain: 'へ marks where you are heading, and ます ends a statement. いきますか？ would ask her instead.' }
    ],
    names: ['ルルーシュ', 'マオマオ'],
    uses: ['g:ni-ikimasu', 'g:masu', 'g:ka', 'g:wa-desu', 'g:no', 'g:yo', 'v:バス|バス', 'v:大学|だいがく', 'v:学生|がくせい', 'v:学校|がっこう', 'v:行く|いく', 'v:来る|くる', 'v:帰る|かえる', 'v:会社|かいしゃ', 'v:家|いえ', 'v:この|この', 'v:あれ|あれ', 'v:どれ|どれ', 'v:私|わたし', 'v:そう|そう', 'v:いいえ|いいえ', 'k:大', 'k:学', 'k:生', 'k:行', 'k:来'],
    notes: 'uses v:いいえ|いいえ, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-ticket-counter', format: 'dialogue',
    title: 'At the ticket counter', goal: 'You can say small numbers and ask for tickets.',
    scene: 'At the ticket counter, Nami helps a little girl who wants to buy a ticket by herself.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Ticket seller' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'nami', furigana: 'はい、どちらへ　[行|い]きますか？', en: 'Yes, where are you going?' },
      { speaker: 'anya', furigana: 'アーニャ、がっこうへ　[行|い]く！', en: 'Anya goes to school!' },
      { speaker: 'nami', furigana: 'がっこうですね。きっぷは　[何|なん]まいですか？', en: 'To school. How many tickets?' },
      { speaker: 'anya', furigana: '[三|さん]まい！', en: 'Three!' },
      { speaker: 'nami', furigana: '[三|さん]まいですか？　アーニャさんは　ひとりですよ。', en: 'Three? You are only one person, Anya.' },
      { speaker: 'anya', furigana: '[二|に]まい！　ちがう、[一|いち]まい！', en: 'Two! No, one!' },
      { speaker: 'nami', furigana: '[一|いち]まいです。はい、どうぞ。', en: 'One ticket. Here you go.' },
      { speaker: 'anya', furigana: 'ありがとう、おねえさん！', en: 'Thank you, miss!' }
    ],
    bridge: [
      { text: 'きっぷ', id: 'v:切符|きっぷ', gloss: 'きっぷ = ticket (taught later)' },
      { text: 'まい', id: 'v:枚|まい', gloss: 'まい = counter for flat things like tickets (taught later)' },
      { text: 'ひとり', id: 'v:一人|ひとり', gloss: 'ひとり = one person (taught later)' }
    ],
    remixes: [
      { scene: 'Anya tells Nami where she is going.', en: 'Anya is going to school.',
        chunks: ['アーニャ、', 'がっこうへ', 'いく！', 'どちらへ'], answer: ['アーニャ、', 'がっこうへ', 'いく！'],
        explain: 'いく is the plain form of いきます, and kids can talk like that. どちらへ is Nami’s question word, so it cannot be Anya’s answer.' },
      { scene: 'Anya asks for tickets.', en: 'Two tickets!',
        chunks: ['きっぷ、', 'にまい！', 'さんまい！'], answer: ['きっぷ、', 'にまい！'],
        explain: 'に is two and さん is three. Numbers come before まい when you count tickets.' }
    ],
    names: ['ナミ', 'アーニャ'],
    uses: ['g:verb-groups-dict', 'g:ni-ikimasu', 'g:masu', 'g:ka', 'g:ne', 'g:yo', 'g:wa-desu', 'v:どちら|どちら', 'v:行く|いく', 'v:学校|がっこう', 'v:何|なん', 'v:三|さん', 'v:二|に', 'v:一|いち', 'v:一人|ひとり', 'v:切符|きっぷ', 'v:枚|まい', 'v:さん|さん', 'v:違う|ちがう', 'v:どうぞ|どうぞ', 'v:お姉さん|おねえさん', 'v:はい|はい', 'k:何', 'k:三', 'k:二', 'k:一', 'k:行'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-front-desk', format: 'dialogue',
    title: 'At the front desk', goal: 'You can read big numbers and say what something was.',
    scene: 'Late at night, Hinata checks in at the hotel front desk, where Sanji works. He came from the station by taxi.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Receptionist' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Guest' } },
    lines: [
      { speaker: 'sanji', furigana: 'ヒナタさんですね。へやは　せん[二|に]ひゃく[九|きゅう]です。', en: 'Mr. Hinata, right? Your room is 1209.' },
      { speaker: 'hinata', furigana: 'はい！　タクシーは　[一|いち]まん[三|さん]ぜん[円|えん]でした！', en: 'Yes! The taxi was 13,000 yen!' },
      { speaker: 'sanji', furigana: 'タクシーでしたか。えきの　バスは　[七|なな]ひゃく[円|えん]ですよ。', en: 'A taxi, was it? The bus from the station is 700 yen.' },
      { speaker: 'hinata', furigana: '……[七|なな]ひゃく[円|えん]？', en: '...700 yen?' },
      { speaker: 'sanji', furigana: 'はい。[七|なな]ひゃく[円|えん]です。', en: 'Yes. 700 yen.' },
      { speaker: 'hinata', furigana: 'わたしの　[一|いち]まん[三|さん]ぜん[円|えん]……。', en: 'My 13,000 yen...' },
      { speaker: 'sanji', furigana: '……ヒナタさん、パンです。どうぞ。ゼロ[円|えん]ですよ。', en: '...Mr. Hinata, here is some bread. It is zero yen.' },
      { speaker: 'hinata', furigana: 'ゼロ[円|えん]！　いただきます！', en: 'Zero yen! Thank you!' },
      { speaker: 'sanji', furigana: 'かぎも　どうぞ。せん[二|に]ひゃく[九|きゅう]ですよ。', en: 'Your key too. It is 1209.' }
    ],
    bridge: [
      { text: 'へや', id: 'v:部屋|へや', gloss: 'へや = room (taught later)' }
    ],
    remixes: [
      { scene: 'Hinata thinks back on the ride.', en: 'It was 13,000 yen.',
        chunks: ['いちまんさんぜんえん', 'でした。', 'です。'], answer: ['いちまんさんぜんえん', 'でした。'],
        explain: 'でした is the past of です: the ride is over. です would give a price for now. いちまん is 10,000 and さんぜん 3,000.' },
      { scene: 'Sanji gives another guest the room number.', en: 'Your room is 1200.',
        chunks: ['へやは', 'せんにひゃく', 'です。', 'にせんひゃく'], answer: ['へやは', 'せんにひゃく', 'です。'],
        explain: 'Big numbers go from the largest part down: せん (1,000) + にひゃく (200) = 1,200. にせんひゃく is 2,100.' }
    ],
    names: ['サンジ', 'ヒナタ'],
    uses: ['g:deshita', 'g:wa-desu', 'g:ka', 'g:ne', 'g:yo', 'g:no', 'g:mo', 'v:さん|さん', 'v:部屋|へや', 'v:円|えん', 'v:私|わたし', 'v:ゼロ|ゼロ', 'v:一|いち', 'v:二|に', 'v:三|さん', 'v:七|なな', 'v:九|きゅう', 'v:百|ひゃく', 'v:千|せん', 'v:万|まん', 'v:タクシー|タクシー', 'v:駅|えき', 'v:バス|バス', 'v:パン|パン', 'v:かぎ|かぎ', 'v:どうぞ|どうぞ', 'v:はい|はい', 'k:一', 'k:二', 'k:三', 'k:七', 'k:九', 'k:円'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-morning-wake', format: 'dialogue',
    title: 'Time to get up', goal: 'You can say what time you get up and go to bed.',
    scene: 'Early morning at home. Gojo, who is looking after Killua, tries to get him out of bed.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Guardian' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Child' } },
    lines: [
      { speaker: 'gojo', furigana: 'キルア！　いま　[午前|ごぜん]　[七|しち][時|じ]ですよ。', en: 'Killua! It is seven in the morning now.' },
      { speaker: 'killua', furigana: '[何|なん][時|じ]？　……ねる。', en: 'What time? ...I’m sleeping.' },
      { speaker: 'gojo', furigana: 'いま　おきますか？　ごごに　おきますか？', en: 'Are you getting up now? Or in the afternoon?' },
      { speaker: 'killua', furigana: 'ごごに　おきる。', en: 'I’ll get up in the afternoon.' },
      { speaker: 'gojo', furigana: 'ごごに？　[先生|せんせい]は　まいにち　[午前|ごぜん]　ろく[時|じ]に　おきますよ。', en: 'In the afternoon? I get up at six every morning.' },
      { speaker: 'killua', furigana: '[先生|せんせい]は　ごご　[三|さん][時|じ]ごろに　おきる。', en: 'You get up around three in the afternoon.' },
      { speaker: 'gojo', furigana: '[午前|ごぜん]　ろく[時|じ]はんに　おきますよ！', en: 'I get up at half past six!' },
      { speaker: 'killua', furigana: '[何|なん][時|じ]に　ねる？', en: 'What time do you go to bed?' },
      { speaker: 'gojo', furigana: '[午前|ごぜん]　[二|に][時|じ]ごろに　ねますよ。', en: 'Around two in the morning.' },
      { speaker: 'killua', furigana: '……ねる。', en: '...I’m going back to sleep.' }
    ],
    remixes: [
      { scene: 'Gojo says when he gets up.', en: 'I get up at half past six in the morning.',
        chunks: ['ごぜんろくじはんに', 'おきます。', 'ねます。'], answer: ['ごぜんろくじはんに', 'おきます。'],
        explain: 'に marks the clock time you do something. ねます means "go to bed", not "get up".' },
      { scene: 'Gojo admits when he goes to bed.', en: 'I go to bed around two in the morning.',
        chunks: ['ごぜんにじごろに', 'ねます。', 'おきます。'], answer: ['ごぜんにじごろに', 'ねます。'],
        explain: 'ごろ means "around" a time, and に still follows it. おきます would say he gets up then.' }
    ],
    names: ['ゴジョウ', 'キルア'],
    uses: ['g:ni', 'g:masu', 'g:ka', 'g:yo', 'g:wa-desu', 'g:verb-groups-dict', 'v:今|いま', 'v:午前|ごぜん', 'v:午後|ごご', 'v:時|じ', 'v:半|はん', 'v:七|しち', 'v:六|ろく', 'v:三|さん', 'v:二|に', 'v:何|なん', 'v:起きる|おきる', 'v:寝る|ねる', 'v:毎日|まいにち', 'v:ごろ|ごろ', 'v:先生|せんせい', 'k:時', 'k:午', 'k:前', 'k:七', 'k:三', 'k:二', 'k:何', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-days-off', format: 'dialogue',
    title: 'Days off', goal: 'You can say which days you work and which you do not.',
    scene: 'In the break room at work, Maomao asks Nami, who loves to earn, about her day off.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Coworker' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Coworker' } },
    lines: [
      { speaker: 'maomao', furigana: 'ナミさん、やすみは　いつですか？', en: 'Nami, when is your day off?' },
      { speaker: 'nami', furigana: '[月|げつ]ようびも　[火|か]ようびも　はたらきます。[水|すい]ようびも　はたらきます。', en: 'I work Mondays and Tuesdays. Wednesdays too.' },
      { speaker: 'maomao', furigana: '……[木|もく]ようびは？　きんようびは？', en: '...Thursdays? Fridays?' },
      { speaker: 'nami', furigana: 'はたらきます。どようびも　にちようびも　はたらきます！', en: 'I work. Saturdays and Sundays too!' },
      { speaker: 'maomao', furigana: '……やすみは？', en: '...And your day off?' },
      { speaker: 'nami', furigana: 'やすみ？　ありません。', en: 'Day off? I don’t have one.' },
      { speaker: 'maomao', furigana: 'わたしは　にちようびは　はたらきません。やすみです。', en: 'I do not work on Sundays. It is my day off.' },
      { speaker: 'nami', furigana: 'じゃあ、わたしも　にちようびは　はたらきません！', en: 'Then I won’t work on Sundays either!' },
      { speaker: 'maomao', furigana: '……どうぞ。', en: '...Be my guest.' },
      { speaker: 'nami', furigana: 'ごごは　はたらきます！', en: 'But I’ll work in the afternoon!' }
    ],
    bridge: [
      { text: 'ありません', id: 'v:ある|ある', gloss: 'ありません = there is none, I don’t have one (from ある, taught later)' },
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' }
    ],
    remixes: [
      { scene: 'Maomao says what she does not do on Sundays.', en: 'I do not work on Sundays.',
        chunks: ['にちようびは', 'はたらきません。', 'はたらきます。'], answer: ['にちようびは', 'はたらきません。'],
        explain: 'ません is the negative of ます. はたらきます would say she does work.' },
      { scene: 'Nami adds one more working day.', en: 'I work on Fridays too.',
        chunks: ['きんようびも', 'はたらきます。', 'はたらきません。'], answer: ['きんようびも', 'はたらきます。'],
        explain: 'も adds "too" to the day, and the verb stays positive. はたらきません would say she does not work.' }
    ],
    names: ['マオマオ', 'ナミ'],
    uses: ['g:masen', 'g:masu', 'g:ka', 'g:mo', 'g:wa-desu', 'v:月曜日|げつようび', 'v:火曜日|かようび', 'v:水曜日|すいようび', 'v:木曜日|もくようび', 'v:金曜日|きんようび', 'v:土曜日|どようび', 'v:日曜日|にちようび', 'v:働く|はたらく', 'v:休み|やすみ', 'v:いつ|いつ', 'v:ある|ある', 'v:じゃあ|じゃあ', 'v:私|わたし', 'v:さん|さん', 'v:どうぞ|どうぞ', 'v:午後|ごご', 'k:月', 'k:火', 'k:水', 'k:木'],
    verified: true }),

  L({ id: 'l:n5-dlg-exam-date', format: 'dialogue',
    title: 'The test date', goal: 'You can say dates from the 1st to the 10th.',
    scene: 'In class, Emilia asks Kakashi when the test and the class party are.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'emilia', furigana: '[先生|せんせい]、テストは　いつですか？', en: 'Sensei, when is the test?' },
      { speaker: 'kakashi', furigana: 'みっかです。', en: 'On the 3rd.' },
      { speaker: 'emilia', furigana: 'みっか……。パーティーは？', en: 'The 3rd... And the party?' },
      { speaker: 'kakashi', furigana: 'パーティーは　なのかです。ごご　[五|ご][時|じ]です。', en: 'The party is on the 7th. At five in the afternoon.' },
      { speaker: 'emilia', furigana: '[先生|せんせい]も　[来|き]ますか？', en: 'Will you come too, sensei?' },
      { speaker: 'kakashi', furigana: 'ええ。[六|ろく][時|じ]ごろに　[行|い]きます。', en: 'Yes. I will go around six.' },
      { speaker: 'emilia', furigana: '[六|ろく][時|じ]？　パーティーは　[五|ご][時|じ]ですよ！', en: 'Six? The party is at five!' },
      { speaker: 'kakashi', furigana: '……じゃあ、[七|しち][時|じ]ごろに　[行|い]きます。', en: '...Then I will go around seven.' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' }
    ],
    remixes: [
      { scene: 'Kakashi tells the class when the day off is.', en: 'The day off is the 4th.',
        chunks: ['やすみは', 'よっかです。', 'よんです。'], answer: ['やすみは', 'よっかです。'],
        explain: 'よっか is the 4th of the month. よん is only the number four, not a date.' },
      { scene: 'Kakashi says when he will get to the party.', en: 'I will go around six.',
        chunks: ['ろくじごろに', 'いきます。', 'きます。'], answer: ['ろくじごろに', 'いきます。'],
        explain: 'You go (いきます) to a place you are not at. Emilia says きますか because she will be at the party; Kakashi answers from where he is.' }
    ],
    names: ['カカシ', 'エミリア'],
    uses: ['g:mo', 'g:ka', 'g:yo', 'g:ni', 'g:wa-desu', 'g:masu', 'v:テスト|テスト', 'v:パーティー|パーティー', 'v:三日|みっか', 'v:七日|なのか', 'v:いつ|いつ', 'v:午後|ごご', 'v:五|ご', 'v:六|ろく', 'v:七|しち', 'v:時|じ', 'v:ごろ|ごろ', 'v:先生|せんせい', 'v:来る|くる', 'v:行く|いく', 'v:じゃあ|じゃあ', 'v:ええ|ええ', 'k:五', 'k:六', 'k:七', 'k:時', 'k:先', 'k:生', 'k:行', 'k:来'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-library', format: 'dialogue',
    title: 'In the library', goal: 'You can say what you read, today, yesterday and tomorrow.',
    scene: 'In the library, Lelouch finds Frieren with the same old book of magic as always.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'frieren', furigana: '……ルルーシュさん。きょうも　としょかんですか。', en: '...Lelouch. The library again today?' },
      { speaker: 'lelouch', furigana: 'はい。きょうは　べんきょうです。えいごの　[本|ほん]を　[読|よ]みます。[先生|せんせい]は？', en: 'Yes. Today I am studying. I am reading an English book. And you, sensei?' },
      { speaker: 'frieren', furigana: '……まほうの　[本|ほん]を　[読|よ]みます。', en: '...I am reading a book of magic.' },
      { speaker: 'lelouch', furigana: 'きのうも　その　[本|ほん]でしたね。', en: 'It was that book yesterday too, wasn’t it?' },
      { speaker: 'frieren', furigana: '……あしたも　[読|よ]みます。', en: '...I will read it tomorrow too.' },
      { speaker: 'lelouch', furigana: 'その　[本|ほん]は　おもしろいですか。', en: 'Is that book interesting?' },
      { speaker: 'frieren', furigana: '……いいえ。', en: '...No.' },
      { speaker: 'lelouch', furigana: '……まいにち　[読|よ]みますか？', en: '...And you read it every day?' },
      { speaker: 'frieren', furigana: '……ええ。まほうは　おもしろいですよ。', en: '...Yes. The magic is interesting.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic' }
    ],
    remixes: [
      { scene: 'Lelouch says what he reads today.', en: 'Today I read an English book.',
        chunks: ['きょうは', 'えいごの', 'ほんを', 'よみます。', 'のみます。'], answer: ['きょうは', 'えいごの', 'ほんを', 'よみます。'],
        explain: 'を marks what you read: ほんを よみます. のみます means "drink", and you cannot drink a book.' },
      { scene: 'Frieren says she will be back with her book.', en: 'I will read the book tomorrow too.',
        chunks: ['あしたも', 'ほんを', 'よみます。', 'ほんの'], answer: ['あしたも', 'ほんを', 'よみます。'],
        explain: 'を marks the thing you read: ほんを よみます. ほんの needs another noun after it.' }
    ],
    names: ['フリーレン', 'ルルーシュ'],
    uses: ['g:wo', 'g:masu', 'g:ka', 'g:mo', 'g:ne', 'g:no', 'g:yo', 'g:deshita', 'g:wa-desu', 'v:図書館|としょかん', 'v:読む|よむ', 'v:勉強|べんきょう', 'v:英語|えいご', 'v:今日|きょう', 'v:昨日|きのう', 'v:明日|あした', 'v:毎日|まいにち', 'v:本|ほん', 'v:その|その', 'v:おもしろい|おもしろい', 'v:先生|せんせい', 'v:さん|さん', 'v:ええ|ええ', 'v:はい|はい', 'v:いいえ|いいえ', 'k:本', 'k:読', 'k:先', 'k:生'],
    notes: 'uses v:ええ|ええ, v:はい|はい, v:いいえ|いいえ, which are unverified, so the dialogue is too. まほう is not on the N5 list: a bridge only.',
    verified: false }),

  L({ id: 'l:n5-dlg-going-out', format: 'dialogue',
    title: 'Going out', goal: 'You can say how you go somewhere.',
    scene: 'Killua and Anya decide how to get to the department store.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'killua', furigana: 'アーニャ、どこへ　[行|い]く？', en: 'Anya, where are you going?' },
      { speaker: 'anya', furigana: 'デパート！　キルアも　いっしょ！', en: 'The department store! You come too, Killua!' },
      { speaker: 'killua', furigana: 'いっしょか。[電車|でんしゃ]で　[行|い]く？　じてんしゃで　[行|い]く？', en: 'Together, huh. Go by train? Go by bike?' },
      { speaker: 'anya', furigana: 'じてんしゃ！　[二人|ふたり]で　[行|い]く！', en: 'Bike! The two of us go!' },
      { speaker: 'killua', furigana: 'じてんしゃは　[一人|ひとり]。', en: 'A bike is for one.' },
      { speaker: 'anya', furigana: 'じゃあ、あるく！', en: 'Then, walk!' },
      { speaker: 'killua', furigana: 'あるく？　……[電車|でんしゃ]で　[行|い]く。', en: 'Walk? ...We take the train.' },
      { speaker: 'anya', furigana: '[電車|でんしゃ]！　キルア、いっしょ！', en: 'The train! Killua, together!' },
      { speaker: 'killua', furigana: '……[行|い]くよ。', en: '...We’re going.' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' }
    ],
    remixes: [
      { scene: 'Anya cheers for the train.', en: 'Anya goes by train.',
        chunks: ['アーニャは', 'でんしゃで', 'いく。', 'あるく。'], answer: ['アーニャは', 'でんしゃで', 'いく。'],
        explain: 'で marks how you travel: でんしゃで. あるく is a way of going on its own, so it cannot follow でんしゃで.' },
      { scene: 'Killua gives in and takes the train.', en: 'Killua goes by train too.',
        chunks: ['キルアも', 'でんしゃで', 'いく。', 'でんしゃを'], answer: ['キルアも', 'でんしゃで', 'いく。'],
        explain: 'で marks the vehicle you travel by: でんしゃで. を is for the thing you read or eat, not the way you go.' }
    ],
    names: ['キルア', 'アーニャ'],
    uses: ['g:de', 'g:verb-groups-dict', 'g:ni-ikimasu', 'g:mo', 'g:ka', 'g:yo', 'v:どこ|どこ', 'v:行く|いく', 'v:デパート|デパート', 'v:一緒|いっしょ', 'v:電車|でんしゃ', 'v:自転車|じてんしゃ', 'v:二人|ふたり', 'v:一人|ひとり', 'v:歩く|あるく', 'v:じゃあ|じゃあ', 'k:行', 'k:電', 'k:車', 'k:二', 'k:一', 'k:人'],
    verified: true }),

  L({ id: 'l:n5-dlg-cafe-invite', format: 'dialogue',
    title: 'Won’t you come?', goal: 'You can invite someone with ませんか and answer.',
    scene: 'In a cafe, Sakura invites Maomao out. Maomao, a pharmacist, has her own reasons to say yes.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Friend' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'sakura', furigana: 'マオマオさん、きょう　えいがを　[見|み]ませんか。', en: 'Maomao, won’t you see a movie today?' },
      { speaker: 'maomao', furigana: '……えいがは　[見|み]ません。', en: '...I don’t watch movies.' },
      { speaker: 'sakura', furigana: 'じゃあ、こうえんへ　[行|い]きませんか。', en: 'Then won’t you go to the park?' },
      { speaker: 'maomao', furigana: 'こうえん……。[行|い]きます。', en: 'The park... I will go.' },
      { speaker: 'sakura', furigana: 'ごご　[三|さん][時|じ]に　こうえんで　あいませんか。', en: 'Why don’t we meet at the park at three in the afternoon?' },
      { speaker: 'maomao', furigana: 'ええ。こうえんの　くさは　おもしろいです。', en: 'Yes. The plants in the park are interesting.' },
      { speaker: 'sakura', furigana: '……さんぽですよ？', en: '...It is a walk, you know?' },
      { speaker: 'maomao', furigana: '……さんぽです。', en: '...A walk.' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' },
      { text: 'くさ', gloss: 'くさ = grass, wild plants' }
    ],
    remixes: [
      { scene: 'Sakura asks Maomao to a film.', en: 'Won’t you see a movie?',
        chunks: ['えいがを', 'みませんか。', 'みません。'], answer: ['えいがを', 'みませんか。'],
        explain: 'ませんか is a polite invitation: "won’t you...?". Without か, みません is Maomao’s answer: "I don’t watch".' },
      { scene: 'Sakura sets the time.', en: 'Why don’t we meet at the park at three?',
        chunks: ['さんじに', 'こうえんで', 'あいませんか。', 'こうえんへ'], answer: ['さんじに', 'こうえんで', 'あいませんか。'],
        explain: 'で marks where something happens: こうえんで あう. へ is for the place you head to, not where you meet.' }
    ],
    names: ['サクラ', 'マオマオ'],
    uses: ['g:masen-ka', 'g:masen', 'g:masu', 'g:wo', 'g:ni', 'g:ni-ikimasu', 'g:de', 'g:no', 'g:wa-desu', 'g:yo', 'v:さん|さん', 'v:今日|きょう', 'v:映画|えいが', 'v:見る|みる', 'v:じゃあ|じゃあ', 'v:公園|こうえん', 'v:行く|いく', 'v:会う|あう', 'v:午後|ごご', 'v:三|さん', 'v:時|じ', 'v:おもしろい|おもしろい', 'v:散歩|さんぽ', 'v:ええ|ええ', 'k:見', 'k:行', 'k:三', 'k:時'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too. くさ is not on the N5 list: a bridge only.',
    verified: false }),

  L({ id: 'l:n5-dlg-next-month', format: 'dialogue',
    title: 'The class trip', goal: 'You can suggest plans with ましょう and ask when and where.',
    scene: 'In class, Gojo announces next week’s class trip. Hinata cannot sit still.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'らいしゅう、りょこうへ　[行|い]きましょう！', en: 'Next week, let’s go on a trip!' },
      { speaker: 'hinata', furigana: 'りょこう！？　いつですか！', en: 'A trip?! When?!' },
      { speaker: 'gojo', furigana: 'らいしゅうの　[金|きん]ようびです。', en: 'Next Friday.' },
      { speaker: 'hinata', furigana: 'どこへ　[行|い]きますか！', en: 'Where are we going?!' },
      { speaker: 'gojo', furigana: 'がっこうの　[前|まえ]の　こうえんです！', en: 'The park in front of the school!' },
      { speaker: 'hinata', furigana: 'こうえん！　こうえんで　あそびましょう！', en: 'The park! Let’s play in the park!' },
      { speaker: 'gojo', furigana: 'ええ。[金|きん]ようびは　[九|く][時|じ]ちょうどに　がっこうで　あいましょう。', en: 'Yes. On Friday, let’s meet at school at nine sharp.' },
      { speaker: 'hinata', furigana: 'はい！　[八|はち][時|じ]に　[来|き]ます！', en: 'Yes! I will come at eight!' },
      { speaker: 'gojo', furigana: '……[先生|せんせい]は　[九|く][時|じ]に　[来|き]ますよ。', en: '...I will come at nine.' }
    ],
    bridge: [
      { text: '前', id: 'v:前|まえ', gloss: 'まえ = in front of (taught later)' }
    ],
    remixes: [
      { scene: 'Hinata has one more idea for the trip.', en: 'Let’s play in the park!',
        chunks: ['こうえんで', 'あそびましょう！', 'あそびますか？'], answer: ['こうえんで', 'あそびましょう！'],
        explain: 'ましょう means "let’s". あそびますか？ would ask whether someone plays, not suggest it.' },
      { scene: 'Gojo sets a meeting place for another trip.', en: 'Let’s meet at the station at nine sharp.',
        chunks: ['くじちょうどに', 'えきで', 'あいましょう。', 'えきへ'], answer: ['くじちょうどに', 'えきで', 'あいましょう。'],
        explain: 'で marks where you meet: えきで あいましょう. へ is for the place you head to.' }
    ],
    names: ['ゴジョウ', 'ヒナタ'],
    uses: ['g:mashou', 'g:masu', 'g:ka', 'g:ni', 'g:de', 'g:no', 'g:yo', 'g:ni-ikimasu', 'g:wa-desu', 'v:来週|らいしゅう', 'v:旅行|りょこう', 'v:行く|いく', 'v:いつ|いつ', 'v:金曜日|きんようび', 'v:どこ|どこ', 'v:公園|こうえん', 'v:遊ぶ|あそぶ', 'v:九|く', 'v:八|はち', 'v:時|じ', 'v:ちょうど|ちょうど', 'v:学校|がっこう', 'v:会う|あう', 'v:来る|くる', 'v:先生|せんせい', 'v:前|まえ', 'v:ええ|ええ', 'v:はい|はい', 'k:行', 'k:金', 'k:九', 'k:八', 'k:時', 'k:来', 'k:先', 'k:生', 'k:前'],
    notes: 'uses v:ええ|ええ, v:はい|はい, which are unverified, so the dialogue is too.',
    verified: false }),

  // ── dialogues: stages 41-62 ──
  L({ id: 'l:n5-dlg-trip-length', format: 'dialogue',
    title: 'How long is the trip?', goal: 'You can say until when, and how long something takes.',
    scene: 'At the travel agency, Emilia books a trip. Nami works the counter and would love to sell her something longer.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Travel agent' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、[来月|らいげつ]　りょこうに　[行|い]きます。[十日|とおか]から　[二十日|はつか]までです。', en: 'Nami, I am going on a trip next month. From the 10th to the 20th.' },
      { speaker: 'nami', furigana: '[十|じゅう][一|いち][日|にち]……。[二|に]しゅうかん　[行|い]きませんか？', en: 'Eleven days... Won’t you go for two weeks?' },
      { speaker: 'emilia', furigana: 'いいえ。[二十日|はつか]までです。', en: 'No. Until the 20th.' },
      { speaker: 'nami', furigana: 'バスで　[行|い]きますか？　[電車|でんしゃ]で　[行|い]きますか？', en: 'Will you go by bus? Or by train?' },
      { speaker: 'emilia', furigana: 'バスは　[何|なん]じかんですか？', en: 'How many hours is the bus?' },
      { speaker: 'nami', furigana: '[二|に][十|じゅう]じかんです。[一日|いちにち][中|じゅう]　バスですよ。', en: 'Twenty hours. You are on the bus all day.' },
      { speaker: 'emilia', furigana: '[電車|でんしゃ]は？', en: 'And the train?' },
      { speaker: 'nami', furigana: '[三|さん]じかんです。[五|ご][万|まん][円|えん]です！', en: 'Three hours. It is 50,000 yen!' },
      { speaker: 'emilia', furigana: 'バスで　[行|い]きます！　[一日|いちにち][中|じゅう]　[本|ほん]を　[読|よ]みます！', en: 'I will go by bus! I will read books all day!' }
    ],
    bridge: [
      { text: 'から', gloss: 'から = from (the start point; まで is the end point)' }
    ],
    remixes: [
      { scene: 'Emilia tells Nami when her trip ends.', en: 'My trip is until the 20th.',
        chunks: ['りょこうは', 'はつかまでです。', 'はつかへ'], answer: ['りょこうは', 'はつかまでです。'],
        explain: 'まで marks the end point in time: はつかまで = until the 20th. へ marks the way to a place, never a date.' },
      { scene: 'Emilia has picked the bus.', en: 'I will read books all day.',
        chunks: ['いちにちじゅう', 'ほんを', 'よみます。', 'ほんで'], answer: ['いちにちじゅう', 'ほんを', 'よみます。'],
        explain: 'じゅう after a span of time means "all through it": いちにちじゅう = all day. を marks what you read; ほんで would make the book a tool.' }
    ],
    names: ['ナミ', 'エミリア'],
    uses: ['g:made', 'g:masen-ka', 'g:ni-ikimasu', 'g:masu', 'g:de', 'g:wo', 'g:ka', 'g:yo', 'g:wa-desu', 'v:さん|さん', 'v:来月|らいげつ', 'v:旅行|りょこう', 'v:行く|いく', 'v:十日|とおか', 'v:二十日|はつか', 'v:十|じゅう', 'v:一|いち', 'v:日|にち', 'v:二|に', 'v:週間|しゅうかん', 'v:バス|バス', 'v:電車|でんしゃ', 'v:何|なん', 'v:時間|じかん', 'v:一日|いちにち', 'v:中|じゅう', 'v:三|さん', 'v:五|ご', 'v:万|まん', 'v:円|えん', 'v:本|ほん', 'v:読む|よむ', 'v:いいえ|いいえ', 'k:来', 'k:月', 'k:行', 'k:十', 'k:日', 'k:一', 'k:二', 'k:電', 'k:車', 'k:何', 'k:中', 'k:三', 'k:五', 'k:万', 'k:円', 'k:本', 'k:読'],
    notes: 'uses v:いいえ|いいえ, which is unverified, so the dialogue is too. から here is "from", not the "because" of a later lesson: a bridge without an id. 時間 stays in kana: 間 is taught later.',
    verified: false }),

  L({ id: 'l:n5-dlg-peanut-habits', format: 'dialogue',
    title: 'Every night', goal: 'You can say how often you do something: always, often, sometimes, not much.',
    scene: 'Evening at home. Yor asks Anya about her eating habits, and the answer is mostly peanuts.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Host' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: '[毎|まい]あさ　ぎゅうにゅうを　のみますか？', en: 'Do you drink milk every morning?' },
      { speaker: 'anya', furigana: 'ときどき！', en: 'Sometimes!' },
      { speaker: 'yor', furigana: 'ピーナッツは？', en: 'And peanuts?' },
      { speaker: 'anya', furigana: 'いつも！　[毎|まい]あさも、[毎|まい]ばんも！', en: 'Always! Every morning and every night!' },
      { speaker: 'yor', furigana: 'パンは　よく　[食|た]べますか？', en: 'Do you often eat bread?' },
      { speaker: 'anya', furigana: 'パンは　あまり　[食|た]べません。', en: 'I don’t eat bread much.' },
      { speaker: 'yor', furigana: '[今|こん]ばん　ピーナッツの　パンを　[食|た]べますか？', en: 'Will you have peanut bread tonight?' },
      { speaker: 'anya', furigana: '[食|た]べる！　ピーナッツの　パンは　いつも　[食|た]べる！', en: 'I’ll eat it! Peanut bread, I always eat!' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Anya answers about milk.', en: 'I sometimes drink milk.',
        chunks: ['ぎゅうにゅうは', 'ときどき', 'のみます。', 'あまり'], answer: ['ぎゅうにゅうは', 'ときどき', 'のみます。'],
        explain: 'ときどき = sometimes. あまり only goes with a negative verb (あまり のみません), so it cannot come before のみます.' },
      { scene: 'Yor says what she drinks every morning.', en: 'I always drink tea.',
        chunks: ['わたしは', 'いつも', 'おちゃを', 'のみます。', 'おちゃで'], answer: ['わたしは', 'いつも', 'おちゃを', 'のみます。'],
        explain: 'いつも = always, and it goes before what you do. を marks what you drink; おちゃで would make the tea a tool.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:itsumo', 'g:masu', 'g:masen', 'g:verb-groups-dict', 'g:wo', 'g:ka', 'g:mo', 'g:no', 'v:いつも|いつも', 'v:よく|よく', 'v:時々|ときどき', 'v:あまり|あまり', 'v:毎朝|まいあさ', 'v:毎晩|まいばん', 'v:今晩|こんばん', 'v:牛乳|ぎゅうにゅう', 'v:飲む|のむ', 'v:パン|パン', 'v:食べる|たべる', 'k:毎', 'k:食', 'k:今'],
    notes: 'ピーナッツ is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-first-tomato', format: 'dialogue',
    title: 'Last night', goal: 'You can say what you did and did not do.',
    scene: 'At break time, Lelouch asks Sasuke what he ate. It is always the same thing.',
    cast: { lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Classmate' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'lelouch', furigana: 'サスケさん、けさ　[何|なに]を　[食|た]べましたか？', en: 'Sasuke, what did you eat this morning?' },
      { speaker: 'sasuke', furigana: '……トマトです。', en: '...Tomatoes.' },
      { speaker: 'lelouch', furigana: 'ゆうべは？', en: 'And last night?' },
      { speaker: 'sasuke', furigana: '……ゆうべも　トマトを　[食|た]べました。', en: '...Last night I ate tomatoes too.' },
      { speaker: 'lelouch', furigana: 'わたしは　ゆうべ　はじめて　トマトを　[食|た]べました。', en: 'Last night I ate a tomato for the first time.' },
      { speaker: 'sasuke', furigana: '……けさは？', en: '...And this morning?' },
      { speaker: 'lelouch', furigana: 'けさは　[食|た]べませんでした。', en: 'This morning I did not.' },
      { speaker: 'sasuke', furigana: '……トマトです。どうぞ。', en: '...A tomato. Here.' },
      { speaker: 'lelouch', furigana: 'つぎの　[休|やす]みに　[食|た]べます。', en: 'I will eat it at the next break.' }
    ],
    bridge: [
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Lelouch talks about this morning.', en: 'This morning I did not eat.',
        chunks: ['けさは', 'たべませんでした。', 'たべます。'], answer: ['けさは', 'たべませんでした。'],
        explain: 'ませんでした is the past negative: did not. けさ is already over, so たべます (now or later) does not fit.' },
      { scene: 'Sasuke asks Lelouch the same question.', en: 'What did you eat this morning?',
        chunks: ['けさ', 'なにを', 'たべましたか？', 'たべますか？'], answer: ['けさ', 'なにを', 'たべましたか？'],
        explain: 'ました is the past of ます, and か makes it a question. たべますか would ask about now or later, not this morning.' }
    ],
    names: ['ルルーシュ', 'サスケ'],
    uses: ['g:mashita', 'g:masu', 'g:wo', 'g:ni', 'g:ka', 'g:mo', 'g:no', 'g:wa-desu', 'v:さん|さん', 'v:今朝|けさ', 'v:昨夜|ゆうべ', 'v:初めて|はじめて', 'v:次|つぎ', 'v:休み|やすみ', 'v:何|なに', 'v:食べる|たべる', 'v:私|わたし', 'v:どうぞ|どうぞ', 'k:何', 'k:食', 'k:休'],
    notes: 'トマト is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-my-room', format: 'dialogue',
    title: 'My room', goal: 'You can say what there is in a room, and what there is not.',
    scene: 'Emilia shows little Anya her tidy room. Anya’s own room is a little different.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Host' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Guest' } },
    lines: [
      { speaker: 'emilia', furigana: 'ここは　わたしの　へやです。どうぞ、アーニャさん。', en: 'This is my room. Come in, Anya.' },
      { speaker: 'anya', furigana: 'つくえが　ある！　まども　ある！', en: 'There’s a desk! There’s a window too!' },
      { speaker: 'emilia', furigana: 'ほんだなも　ありますよ。', en: 'There’s a bookshelf too.' },
      { speaker: 'anya', furigana: 'テレビは　ある？', en: 'Is there a TV?' },
      { speaker: 'emilia', furigana: 'テレビは　ありません。', en: 'No, there’s no TV.' },
      { speaker: 'anya', furigana: 'アーニャの　へやには　テレビが　ある！　つくえは　ない！', en: 'Anya’s room has a TV! No desk!' },
      { speaker: 'emilia', furigana: 'べんきょうは？', en: 'And studying?' },
      { speaker: 'anya', furigana: 'エミリアさんの　つくえで！', en: 'At your desk, Emilia!' },
      { speaker: 'emilia', furigana: 'はい、どうぞ。', en: 'Sure, go ahead.' }
    ],
    remixes: [
      { scene: 'Emilia shows one more thing in her room.', en: 'There is a window too.',
        chunks: ['まども', 'あります。', 'います。'], answer: ['まども', 'あります。'],
        explain: 'Things take あります. います is for people and animals (next lesson), so a window never いる.' },
      { scene: 'Anya says what her room is missing.', en: 'There is no desk!',
        chunks: ['つくえは', 'ない！', 'つくえを'], answer: ['つくえは', 'ない！'],
        explain: 'ない is the plain "there isn’t" (ありません). The thing is marked by が or は, never を: つくえは ない.' }
    ],
    names: ['エミリア', 'アーニャ'],
    uses: ['g:ga-arimasu', 'g:verb-groups-dict', 'g:ni', 'g:de', 'g:mo', 'g:no', 'g:yo', 'g:wa-desu', 'v:私|わたし', 'v:ここ|ここ', 'v:部屋|へや', 'v:さん|さん', 'v:どうぞ|どうぞ', 'v:机|つくえ', 'v:ある|ある', 'v:窓|まど', 'v:本棚|ほんだな', 'v:テレビ|テレビ', 'v:ない|ない', 'v:勉強|べんきょう', 'v:はい|はい'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-where-pakkun', format: 'dialogue',
    title: 'Where is the dog?', goal: 'You can say where people and animals are: on, under, next to, behind.',
    scene: 'At home, Kakashi, who is looking after Killua, cannot find his little dog Pakkun.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Guardian' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Child' } },
    lines: [
      { speaker: 'kakashi', furigana: 'キルアさん、パックンが　いません。', en: 'Killua, Pakkun is missing.' },
      { speaker: 'killua', furigana: 'いぬ？　つくえの　[下|した]は？', en: 'The dog? Under the desk?' },
      { speaker: 'kakashi', furigana: '[下|した]には　ねこが　います。', en: 'The cat is under there.' },
      { speaker: 'killua', furigana: 'ベッドの　[上|うえ]は？', en: 'On the bed?' },
      { speaker: 'kakashi', furigana: 'いません。ねこの　となりにも　いません。', en: 'He’s not there. Not next to the cat either.' },
      { speaker: 'killua', furigana: '……いる。', en: '...He’s here.' },
      { speaker: 'kakashi', furigana: 'どこに　いますか？', en: 'Where is he?' },
      { speaker: 'killua', furigana: '[先生|せんせい]の　[後|うし]ろ。', en: 'Behind you, sensei.' },
      { speaker: 'kakashi', furigana: '……いつも　[後|うし]ろに　いますね。', en: '...He is always behind me.' }
    ],
    remixes: [
      { scene: 'Kakashi says where the cat is.', en: 'The cat is under the desk.',
        chunks: ['ねこは', 'つくえの', 'したに', 'います。', 'あります。'], answer: ['ねこは', 'つくえの', 'したに', 'います。'],
        explain: 'A cat is alive, so it takes います. あります is for things.' },
      { scene: 'Killua finds Pakkun by the window.', en: 'Pakkun is in front of the window.',
        chunks: ['パックンは', 'まどの', 'まえに', 'いる。', 'まえで'], answer: ['パックンは', 'まどの', 'まえに', 'いる。'],
        explain: 'に marks where someone is: まえに いる. で is for where something happens, not where someone stays.' }
    ],
    names: ['カカシ', 'キルア', 'パックン'],
    uses: ['g:ga-imasu', 'g:ni', 'g:verb-groups-dict', 'g:no', 'g:ka', 'g:mo', 'g:ne', 'v:さん|さん', 'v:居る|いる', 'v:犬|いぬ', 'v:猫|ねこ', 'v:机|つくえ', 'v:下|した', 'v:上|うえ', 'v:ベッド|ベッド', 'v:隣|となり', 'v:後ろ|うしろ', 'v:どこ|どこ', 'v:先生|せんせい', 'v:いつも|いつも', 'k:下', 'k:上', 'k:先', 'k:生', 'k:後'],
    verified: true }),

  L({ id: 'l:n5-dlg-house-tour', format: 'dialogue',
    title: 'Around the house', goal: 'You can name the rooms of a house and list things with と.',
    scene: 'Anya plays tour guide, and Yor plays along as the guest.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'anya', furigana: 'ここ、げんかん！', en: 'This is the entrance!' },
      { speaker: 'yor', furigana: 'アーニャさん、げんかんの　はこは　[何|なん]ですか？', en: 'Anya, what is the box by the door?' },
      { speaker: 'anya', furigana: 'ちちの　はこ！　こっちは　だいどころと　おふろ！', en: 'Papa’s box! This way is the kitchen and the bath!' },
      { speaker: 'yor', furigana: 'だいどころ……。れいぞうこに　[何|なに]が　ありますか？', en: 'The kitchen... What is in the fridge?' },
      { speaker: 'anya', furigana: 'ピーナッツと　ぎゅうにゅう！', en: 'Peanuts and milk!' },
      { speaker: 'yor', furigana: 'かいだんの　[上|うえ]は？', en: 'And at the top of the stairs?' },
      { speaker: 'anya', furigana: 'アーニャの　へや！', en: 'Anya’s room!' },
      { speaker: 'yor', furigana: 'にわも　ありますか？', en: 'Is there a garden too?' },
      { speaker: 'anya', furigana: 'ある！　にわで　ボンドと　あそぶ！', en: 'Yes! I play with Bond in the garden!' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Anya points down the hall.', en: 'This way is the kitchen and the bath!',
        chunks: ['こっちは', 'だいどころと', 'おふろ！', 'だいどころを'], answer: ['こっちは', 'だいどころと', 'おふろ！'],
        explain: 'と joins the things in a list: だいどころと おふろ. を marks what a verb acts on, and there is no verb here.' },
      { scene: 'Anya says who she plays with.', en: 'I play with Bond in the garden!',
        chunks: ['にわで', 'ボンドと', 'あそぶ！', 'ボンドを'], answer: ['にわで', 'ボンドと', 'あそぶ！'],
        explain: 'と after someone means "together with": ボンドと あそぶ. あそぶ takes no を, so ボンドを does not work.' }
    ],
    names: ['ヨル', 'アーニャ', 'ボンド'],
    uses: ['g:to', 'g:ga-arimasu', 'g:verb-groups-dict', 'g:de', 'g:ni', 'g:no', 'g:mo', 'g:ka', 'g:wa-desu', 'v:ここ|ここ', 'v:こっち|こっち', 'v:玄関|げんかん', 'v:さん|さん', 'v:箱|はこ', 'v:何|なん', 'v:何|なに', 'v:父|ちち', 'v:台所|だいどころ', 'v:お風呂|おふろ', 'v:冷蔵庫|れいぞうこ', 'v:ある|ある', 'v:牛乳|ぎゅうにゅう', 'v:階段|かいだん', 'v:上|うえ', 'v:部屋|へや', 'v:庭|にわ', 'v:遊ぶ|あそぶ', 'k:何', 'k:上'],
    notes: 'ピーナッツ is not on the N5 list: a bridge only. ちち stays in kana: Anya says it the way she always does.',
    verified: true }),

  L({ id: 'l:n5-dlg-bag-shop', format: 'dialogue',
    title: 'A small bag', goal: 'You can describe things with い-adjectives, also in the negative and the past.',
    scene: 'Sakura needs a small bag for her medical kit. Nami minds the shop and has her own idea of a fair price.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Shop assistant' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'sakura', furigana: '[小|ちい]さい　かばんは　ありますか？', en: 'Do you have a small bag?' },
      { speaker: 'nami', furigana: 'ありますよ！　これです。あたらしいですよ。', en: 'We do! This one. It’s new.' },
      { speaker: 'sakura', furigana: 'あたらしい……。[高|たか]いですか？', en: 'New... Is it expensive?' },
      { speaker: 'nami', furigana: '[高|たか]くないです！　[一|いち][万|まん][円|えん]です。', en: 'It’s not expensive! It’s 10,000 yen.' },
      { speaker: 'sakura', furigana: '[高|たか]いです！', en: 'That is expensive!' },
      { speaker: 'nami', furigana: 'じゃあ、この　ふるい　かばんは？　やすいですよ。', en: 'Then how about this old bag? It’s cheap.' },
      { speaker: 'sakura', furigana: '[何|なん][円|えん]ですか？', en: 'How many yen?' },
      { speaker: 'nami', furigana: '[九|きゅう]せん[円|えん]です！', en: '9,000 yen!' },
      { speaker: 'sakura', furigana: '……やすくないです。', en: '...That’s not cheap.' },
      { speaker: 'nami', furigana: 'きのうは　もっと　[高|たか]かったですよ！', en: 'It was even more expensive yesterday!' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' },
      { text: 'もっと', id: 'v:もっと|もっと', gloss: 'もっと = more, even more (taught later)' }
    ],
    remixes: [
      { scene: 'Nami praises the new bag.', en: 'This bag is not expensive!',
        chunks: ['このかばんは', 'たかく', 'ないです！', 'たかい'], answer: ['このかばんは', 'たかく', 'ないです！'],
        explain: 'An い-adjective turns negative by changing い to く + ない: たかい → たかくない. たかい ないです is not Japanese.' },
      { scene: 'Nami insists the old bag is a bargain today.', en: 'It was even more expensive yesterday!',
        chunks: ['きのうは', 'もっと', 'たかかったです！', 'たかいでした！'], answer: ['きのうは', 'もっと', 'たかかったです！'],
        explain: 'The past of an い-adjective changes い to かった: たかい → たかかった(です). たかいでした is a common mistake.' }
    ],
    names: ['ナミ', 'サクラ'],
    uses: ['g:adj-i', 'g:ka', 'g:yo', 'g:wa-desu', 'v:小さい|ちいさい', 'v:かばん|かばん', 'v:ある|ある', 'v:これ|これ', 'v:この|この', 'v:新しい|あたらしい', 'v:高い|たかい', 'v:一|いち', 'v:万|まん', 'v:円|えん', 'v:じゃあ|じゃあ', 'v:古い|ふるい', 'v:安い|やすい', 'v:何|なん', 'v:九|きゅう', 'v:千|せん', 'v:昨日|きのう', 'v:もっと|もっと', 'k:小', 'k:高', 'k:一', 'k:万', 'k:円', 'k:何', 'k:九'],
    notes: '千 stays in kana: the kanji is taught later.',
    verified: true }),

  L({ id: 'l:n5-dlg-umbrella-colour', format: 'dialogue',
    title: 'Which colour?', goal: 'You can name colours and give examples with や.',
    scene: 'Gojo takes Anya to buy an umbrella. She wants every colour at once.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'gojo', furigana: 'どの　いろの　かさですか？', en: 'Which colour umbrella?' },
      { speaker: 'anya', furigana: 'あかや　あおや　きいろや　みどり！', en: 'Red, blue, yellow, green...!' },
      { speaker: 'gojo', furigana: 'どれですか？　あかですか？　あおですか？', en: 'Which one? Red? Blue?' },
      { speaker: 'anya', furigana: 'あかも　あおも！', en: 'Red and blue!' },
      { speaker: 'gojo', furigana: 'あかと　あおで……むらさきですね。', en: 'Red and blue together... that is purple.' },
      { speaker: 'anya', furigana: 'むらさき！　むらさきの　かさ！', en: 'Purple! A purple umbrella!' },
      { speaker: 'gojo', furigana: 'むらさきの　かさは　ありません。[白|しろ]や　くろは　ありますよ。', en: 'There is no purple umbrella. There is white, black and so on.' },
      { speaker: 'anya', furigana: '[白|しろ]！　[先生|せんせい]と　おなじ！', en: 'White! Same as you, sensei!' },
      { speaker: 'gojo', furigana: 'いい　いろですよ。', en: 'That is a good colour.' }
    ],
    bridge: [
      { text: 'むらさき', gloss: 'むらさき = purple (not on the N5 list)' }
    ],
    remixes: [
      { scene: 'Gojo tells Anya what the shop has.', en: 'There are white ones, black ones and so on.',
        chunks: ['しろや', 'くろが', 'あります。', 'います。'], answer: ['しろや', 'くろが', 'あります。'],
        explain: 'や gives examples from a longer list. Umbrellas are things, so あります; います is for people and animals.' },
      { scene: 'Anya points at Gojo’s black blindfold instead.', en: 'Black! Same as sensei!',
        chunks: ['くろ！', 'せんせいと', 'おなじ！', 'せんせいを'], answer: ['くろ！', 'せんせいと', 'おなじ！'],
        explain: 'おなじ uses と: X と おなじ = the same as X. を does not go with おなじ.' }
    ],
    names: ['ゴジョウ', 'アーニャ'],
    uses: ['g:ya', 'g:to', 'g:de', 'g:mo', 'g:no', 'g:ne', 'g:yo', 'g:ka', 'g:wa-desu', 'v:どの|どの', 'v:どれ|どれ', 'v:色|いろ', 'v:傘|かさ', 'v:赤|あか', 'v:黄色|きいろ', 'v:緑|みどり', 'v:青|あお', 'v:ある|ある', 'v:白|しろ', 'v:黒|くろ', 'v:先生|せんせい', 'v:同じ|おなじ', 'v:いい|いい', 'k:白', 'k:先', 'k:生'],
    notes: 'むらさき (purple) is not on the N5 list: a bridge only. あか and あお stay in kana: their kanji are taught later.',
    verified: true }),

  L({ id: 'l:n5-dlg-herb-cafe', format: 'dialogue',
    title: 'A famous cafe', goal: 'You can describe places with な-adjectives.',
    scene: 'Emilia wants to take Maomao to a famous cafe. Maomao is busy, until she hears what kind of tea they serve.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: '[今日|きょう]は　ひまですか？', en: 'Are you free today?' },
      { speaker: 'maomao', furigana: '……ひまじゃ　ありません。', en: '...I am not free.' },
      { speaker: 'emilia', furigana: 'ゆうめいな　きっさてんへ　[行|い]きませんか？　えきの　[前|まえ]の　べんりな　きっさてんです。', en: 'Won’t you come to a famous cafe? It is a handy cafe in front of the station.' },
      { speaker: 'maomao', furigana: '……[行|い]きません。', en: '...I won’t.' },
      { speaker: 'emilia', furigana: 'しずかな　きっさてんですよ。くさの　おちゃは　ゆうめいです。', en: 'It is a quiet cafe. And its herb tea is famous.' },
      { speaker: 'maomao', furigana: 'くさの　おちゃ。……[行|い]きます。ひまです。', en: 'Herb tea. ...I’ll go. I’m free.' },
      { speaker: 'emilia', furigana: '……ひまですか？', en: '...You’re free?' },
      { speaker: 'maomao', furigana: '……くさは　たいせつです。', en: '...Herbs are important.' }
    ],
    bridge: [
      { text: 'くさ', gloss: 'くさ = grass, wild plants (here: herbs)' }
    ],
    remixes: [
      { scene: 'Emilia describes the cafe.', en: 'It is a quiet cafe.',
        chunks: ['しずかな', 'きっさてんです。', 'しずかの'], answer: ['しずかな', 'きっさてんです。'],
        explain: 'A な-adjective takes な before a noun: しずかな きっさてん. の is for nouns.' },
      { scene: 'Maomao says what matters to her.', en: 'Herbs are important.',
        chunks: ['くさは', 'たいせつです。', 'たいせつなです。'], answer: ['くさは', 'たいせつです。'],
        explain: 'At the end of a sentence a な-adjective takes です straight away: たいせつです. な only comes before a noun.' }
    ],
    names: ['エミリア', 'マオマオ'],
    uses: ['g:adj-na', 'g:ja-nai', 'g:masen-ka', 'g:masen', 'g:masu', 'g:ni-ikimasu', 'g:no', 'g:yo', 'g:ka', 'g:wa-desu', 'v:今日|きょう', 'v:暇|ひま', 'v:有名|ゆうめい', 'v:喫茶店|きっさてん', 'v:行く|いく', 'v:静か|しずか', 'v:お茶|おちゃ', 'v:便利|べんり', 'v:駅|えき', 'v:前|まえ', 'v:大切|たいせつ', 'k:今', 'k:日', 'k:行', 'k:前'],
    notes: 'くさ is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-room-viewing', format: 'dialogue',
    title: 'Viewing a room', goal: 'You can describe rooms and books: wide, narrow, thick, thin.',
    scene: 'Lelouch is looking for a room to rent. The agent, Frieren, shows him a big room with a full bookshelf.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Agent' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'frieren', furigana: '……この　へやは　ひろいです。ほんだなも　りっぱです。', en: '...This room is spacious. The bookshelf is splendid too.' },
      { speaker: 'lelouch', furigana: 'いろいろな　[本|ほん]が　ありますね。あつい　[本|ほん]や、うすい　[本|ほん]や……。', en: 'There are all sorts of books. Thick ones, thin ones...' },
      { speaker: 'frieren', furigana: '……わたしの　[本|ほん]です。', en: '...They are my books.' },
      { speaker: 'lelouch', furigana: 'フリーレンさんの？', en: 'Yours?' },
      { speaker: 'frieren', furigana: '……わたしの　へやは　せまいです。', en: '...My own room is narrow.' },
      { speaker: 'lelouch', furigana: 'となりの　へやは？', en: 'And the room next door?' },
      { speaker: 'frieren', furigana: '……せまいです。[本|ほん]も　ありません。', en: '...Narrow. And no books.' },
      { speaker: 'lelouch', furigana: 'この　へやの　[本|ほん]は？', en: 'What about the books in this room?' },
      { speaker: 'frieren', furigana: '……へやと　いっしょです。よい　[本|ほん]ですよ。', en: '...They come with the room. They are good books.' }
    ],
    remixes: [
      { scene: 'Lelouch sums up the room.', en: 'This room is spacious.',
        chunks: ['このへやは', 'ひろいです。', 'ひろいなです。'], answer: ['このへやは', 'ひろいです。'],
        explain: 'An い-adjective takes です directly: ひろいです. な belongs to な-adjectives like りっぱ.' },
      { scene: 'Frieren holds up one of her books.', en: 'It is a thick book.',
        chunks: ['あつい', 'ほんです。', 'あついな'], answer: ['あつい', 'ほんです。'],
        explain: 'An い-adjective goes straight before a noun: あつい ほん. No な in between.' }
    ],
    names: ['フリーレン', 'ルルーシュ'],
    uses: ['g:ya', 'g:to', 'g:ga-arimasu', 'g:adj-i', 'g:adj-na', 'g:no', 'g:mo', 'g:ne', 'g:yo', 'g:wa-desu', 'v:この|この', 'v:部屋|へや', 'v:広い|ひろい', 'v:本棚|ほんだな', 'v:りっぱ|りっぱ', 'v:本|ほん', 'v:いろいろ|いろいろ', 'v:ある|ある', 'v:厚い|あつい', 'v:薄い|うすい', 'v:私|わたし', 'v:さん|さん', 'v:狭い|せまい', 'v:隣|となり', 'v:一緒|いっしょ', 'v:よい|よい', 'k:本'],
    verified: true }),

  L({ id: 'l:n5-dlg-grand-weather', format: 'dialogue',
    title: 'Today’s weather', goal: 'You can talk about the weather with とても and すこし.',
    scene: 'On the ship’s deck, Sanji asks Nami, the navigator, about the weather. It changes fast out here.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Navigator' } },
    lines: [
      { speaker: 'sanji', furigana: 'ナミさん、[今日|きょう]の　[天気|てんき]は？', en: 'Nami, what is the weather today?' },
      { speaker: 'nami', furigana: '[今|いま]は　とても　あついです。', en: 'Right now it is very hot.' },
      { speaker: 'sanji', furigana: 'つめたい　[水|みず]を　どうぞ！', en: 'Have some cold water!' },
      { speaker: 'nami', furigana: 'ありがとう。ごごは　[雨|あめ]ですよ。', en: 'Thanks. It will rain in the afternoon.' },
      { speaker: 'sanji', furigana: '[雨|あめ]！　わたしは　ナミさんの　かさを　さします！', en: 'Rain! I will hold up your umbrella!' },
      { speaker: 'nami', furigana: '[雨|あめ]は　すこしです。よるは　ゆきですよ。', en: 'Only a little rain. At night, snow.' },
      { speaker: 'sanji', furigana: 'ゆき！？　[今|いま]は　とても　あついですよ！', en: 'Snow?! It is very hot right now!' },
      { speaker: 'nami', furigana: 'よるは　とても　さむいですよ。', en: 'The night will be very cold.' },
      { speaker: 'sanji', furigana: 'じゃあ、よるは　わたしの　コートを　どうぞ！', en: 'Then tonight, take my coat!' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' }
    ],
    remixes: [
      { scene: 'Nami reports the weather right now.', en: 'It is very hot now.',
        chunks: ['いまは', 'とても', 'あついです。', 'あついでした。'], answer: ['いまは', 'とても', 'あついです。'],
        explain: 'とても goes right before the adjective. Now means the non-past あついです; the past would be あつかった, never あついでした.' },
      { scene: 'The rain starts and Sanji keeps his word.', en: 'I put up Nami’s umbrella.',
        chunks: ['ナミさんの', 'かさを', 'さします。', 'かさで'], answer: ['ナミさんの', 'かさを', 'さします。'],
        explain: 'さす (put up an umbrella) takes を: かさを さします. かさで would mean "using the umbrella".' }
    ],
    names: ['サンジ', 'ナミ'],
    uses: ['g:totemo', 'g:adj-i', 'g:wo', 'g:masu', 'g:no', 'g:yo', 'g:wa-desu', 'v:さん|さん', 'v:今日|きょう', 'v:天気|てんき', 'v:今|いま', 'v:とても|とても', 'v:暑い|あつい', 'v:冷たい|つめたい', 'v:水|みず', 'v:どうぞ|どうぞ', 'v:午後|ごご', 'v:雨|あめ', 'v:私|わたし', 'v:傘|かさ', 'v:差す|さす', 'v:少し|すこし', 'v:夜|よる', 'v:雪|ゆき', 'v:寒い|さむい', 'v:じゃあ|じゃあ', 'v:コート|コート', 'k:今', 'k:日', 'k:天', 'k:気', 'k:水', 'k:雨'],
    verified: true }),

  L({ id: 'l:n5-dlg-likes', format: 'dialogue',
    title: 'What do you like?', goal: 'You can say what you like, dislike, are good or bad at, with が.',
    scene: 'In the cafeteria, Hinata asks Sasuke what he likes. Sasuke answers as little as he can.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'hinata', furigana: 'わたしは　バレーボールが　だいすきです！　サスケさんは　スポーツが　すきですか？', en: 'I love volleyball! Sasuke, do you like sports?' },
      { speaker: 'sasuke', furigana: '……すきです。', en: '...I do.' },
      { speaker: 'hinata', furigana: 'バレーボールも　できますか？', en: 'Can you play volleyball too?' },
      { speaker: 'sasuke', furigana: '……できます。', en: '...I can.' },
      { speaker: 'hinata', furigana: 'うたは？', en: 'And singing?' },
      { speaker: 'sasuke', furigana: '……うたは　へたです。', en: '...I am bad at singing.' },
      { speaker: 'hinata', furigana: 'わたしも　へたです！　おんがくは　すきです！', en: 'Me too! But I like music!' },
      { speaker: 'sasuke', furigana: '……おんがくは　あまり　すきじゃ　ありません。', en: '...I don’t like music much.' },
      { speaker: 'hinata', furigana: 'じゃあ、サスケさんは　[何|なに]が　すきですか？', en: 'Then what do you like, Sasuke?' },
      { speaker: 'sasuke', furigana: '……ひとりが　すきです。', en: '...I like being alone.' }
    ],
    bridge: [
      { text: 'バレーボール', gloss: 'バレーボール = volleyball' },
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' }
    ],
    remixes: [
      { scene: 'Hinata says what he likes.', en: 'I like music!',
        chunks: ['おんがくが', 'すきです！', 'おんがくを'], answer: ['おんがくが', 'すきです！'],
        explain: 'With すき, the thing you like takes が, not を: おんがくが すきです.' },
      { scene: 'Sasuke admits his weak point.', en: 'I am bad at singing.',
        chunks: ['わたしは', 'うたが', 'へたです。', 'へたなです。'], answer: ['わたしは', 'うたが', 'へたです。'],
        explain: 'へた is a な-adjective: at the end of a sentence it takes です straight away. The thing you are bad at takes が.' }
    ],
    names: ['ヒナタ', 'サスケ'],
    uses: ['g:ga', 'g:adj-na', 'g:ja-nai', 'g:ka', 'g:mo', 'g:wa-desu', 'v:私|わたし', 'v:大好き|だいすき', 'v:さん|さん', 'v:スポーツ|スポーツ', 'v:好き|すき', 'v:できる|できる', 'v:歌|うた', 'v:下手|へた', 'v:音楽|おんがく', 'v:あまり|あまり', 'v:じゃあ|じゃあ', 'v:何|なに', 'v:一人|ひとり', 'k:何'],
    notes: 'バレーボール is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-new-medicine', format: 'dialogue',
    title: 'Busy and tired', goal: 'You can give a reason with から.',
    scene: 'At work, Maomao notices that Sanji looks unwell. She has just the medicine. She has never tried it.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' } },
    lines: [
      { speaker: 'maomao', furigana: 'サンジさん、げんきじゃ　ありませんね。', en: 'Sanji, you are not well, are you?' },
      { speaker: 'sanji', furigana: '[今日|きょう]は　いそがしいですから、つかれました。', en: 'I’m tired, because today is busy.' },
      { speaker: 'maomao', furigana: 'どこが　いたいですか？', en: 'Where does it hurt?' },
      { speaker: 'sanji', furigana: 'おなかが　いたいです。', en: 'My stomach hurts.' },
      { speaker: 'maomao', furigana: 'おなかの　かぜです。くすりが　あります。どうぞ。', en: 'A stomach cold. I have medicine. Here.' },
      { speaker: 'sanji', furigana: 'この　くすりは　[何|なん]ですか？', en: 'What is this medicine?' },
      { speaker: 'maomao', furigana: 'わかりません。あたらしい　くすりですから。', en: 'I don’t know. Because it is a new medicine.' },
      { speaker: 'sanji', furigana: 'わかりませんか！？', en: 'You don’t know?!' },
      { speaker: 'maomao', furigana: '[今|いま]　のみませんか？　たのしいですよ。', en: 'Won’t you take it now? It will be fun.' },
      { speaker: 'sanji', furigana: '[今|いま]は　いたくないです！', en: 'It doesn’t hurt now!' }
    ],
    remixes: [
      { scene: 'Sanji explains why he is tired.', en: 'I’m tired, because I am busy.',
        chunks: ['いそがしいですから、', 'つかれました。', 'いそがしいですまで、'], answer: ['いそがしいですから、', 'つかれました。'],
        explain: 'から after a reason means "because", and the reason comes first. まで means "until", not a reason.' },
      { scene: 'Sanji tells Maomao where it hurts.', en: 'My stomach hurts.',
        chunks: ['おなかが', 'いたいです。', 'おなかを'], answer: ['おなかが', 'いたいです。'],
        explain: 'いたい takes が for the part that hurts: おなかが いたい. を does not go with an adjective.' }
    ],
    names: ['マオマオ', 'サンジ'],
    uses: ['g:kara', 'g:adj-i', 'g:adj-na', 'g:ja-nai', 'g:ga', 'g:ga-arimasu', 'g:mashita', 'g:masen-ka', 'g:masen', 'g:no', 'g:ne', 'g:yo', 'g:ka', 'g:wa-desu', 'v:さん|さん', 'v:元気|げんき', 'v:今日|きょう', 'v:忙しい|いそがしい', 'v:疲れる|つかれる', 'v:どこ|どこ', 'v:痛い|いたい', 'v:おなか|おなか', 'v:風邪|かぜ', 'v:薬|くすり', 'v:ある|ある', 'v:どうぞ|どうぞ', 'v:この|この', 'v:何|なん', 'v:分かる|わかる', 'v:新しい|あたらしい', 'v:今|いま', 'v:飲む|のむ', 'v:楽しい|たのしい', 'k:今', 'k:日', 'k:何'],
    notes: 'げんき stays in kana: 元 is taught later.',
    verified: true }),

  L({ id: 'l:n5-dlg-day-off-spell', format: 'dialogue',
    title: 'Why were you off?', goal: 'You can ask why with どうして and ask what kind with どんな.',
    scene: 'Frieren did not come to school yesterday. Sakura wants to know why.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'sakura', furigana: 'フリーレン[先生|せんせい]、きのうは　どうして　[休|やす]みでしたか？', en: 'Frieren-sensei, why were you off yesterday?' },
      { speaker: 'frieren', furigana: '……まほうの　[本|ほん]を　[読|よ]みました。', en: '...I read a book of magic.' },
      { speaker: 'sakura', furigana: 'どんな　まほうですか？', en: 'What kind of magic?' },
      { speaker: 'frieren', furigana: '……あたたかい　ベッドの　まほうです。', en: '...A spell for a warm bed.' },
      { speaker: 'sakura', furigana: 'ベッドの　まほう……？　どうして　その　まほうですか？', en: 'A bed spell...? Why that spell?' },
      { speaker: 'frieren', furigana: '……よるは　さむいですから。', en: '...Because the nights are cold.' },
      { speaker: 'sakura', furigana: 'まほうは　どうでしたか？', en: 'How was the spell?' },
      { speaker: 'frieren', furigana: '……とても　よかったです。[一日|いちにち][中|じゅう]　ねました。', en: '...Very good. I slept all day.' },
      { speaker: 'sakura', furigana: '[先生|せんせい]、[今日|きょう]は　ねませんよ！', en: 'Sensei, no sleeping today!' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Sakura asks again, a little louder.', en: 'Why were you off yesterday?',
        chunks: ['きのうは', 'どうして', 'やすみでしたか？', 'やすみですか？'], answer: ['きのうは', 'どうして', 'やすみでしたか？'],
        explain: 'どうして asks "why". きのう is in the past, so です becomes でした; やすみですか would ask about now.' },
      { scene: 'Frieren gives her reason.', en: 'Because the nights are cold.',
        chunks: ['よるは', 'さむいですから。', 'さむいでしたから。'], answer: ['よるは', 'さむいですから。'],
        explain: 'から after the reason means "because". The nights are cold in general, so non-past さむいです; the past would be さむかった, never さむいでした.' }
    ],
    names: ['フリーレン', 'サクラ'],
    uses: ['g:doushite', 'g:kara', 'g:mashita', 'g:masen', 'g:adj-i', 'g:deshita', 'g:wo', 'g:no', 'g:ka', 'g:yo', 'g:wa-desu', 'v:先生|せんせい', 'v:昨日|きのう', 'v:どうして|どうして', 'v:休み|やすみ', 'v:本|ほん', 'v:読む|よむ', 'v:どんな|どんな', 'v:暖かい|あたたかい', 'v:ベッド|ベッド', 'v:その|その', 'v:夜|よる', 'v:寒い|さむい', 'v:どう|どう', 'v:とても|とても', 'v:よい|よい', 'v:一日|いちにち', 'v:中|じゅう', 'v:寝る|ねる', 'v:今日|きょう', 'k:先', 'k:生', 'k:休', 'k:本', 'k:読', 'k:一', 'k:日', 'k:中', 'k:今'],
    notes: 'まほう is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-summer-wish', format: 'dialogue',
    title: 'Summer plans', goal: 'You can say what you want to do with たい, and what you want with ほしい.',
    scene: 'Last day of school. Hinata asks Killua where he wants to go for the summer holidays.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'hinata', furigana: 'なつやすみです！　キルアさんは　どこへ　[行|い]きたいですか？', en: 'It’s the summer holidays! Where do you want to go, Killua?' },
      { speaker: 'killua', furigana: '[山|やま]。ゴンと　[山|やま]に　のぼりたい。', en: 'The mountains. I want to climb a mountain with Gon.' },
      { speaker: 'hinata', furigana: 'いいですね！　わたしは　うみで　およぎたいです！', en: 'Nice! I want to swim in the sea!' },
      { speaker: 'killua', furigana: 'うみは　あつい。[山|やま]で　やすみたい。', en: 'The sea is hot. I want to rest in the mountains.' },
      { speaker: 'hinata', furigana: '……わたしも　[山|やま]へ　[行|い]きたいです！', en: '...I want to go to the mountains too!' },
      { speaker: 'killua', furigana: 'いいよ。チョコが　ほしい。', en: 'Sure. I want chocolate.' },
      { speaker: 'hinata', furigana: 'チョコ？', en: 'Chocolate?' },
      { speaker: 'killua', furigana: '[山|やま]の　[上|うえ]で　[食|た]べたい。', en: 'I want to eat it on top of the mountain.' },
      { speaker: 'hinata', furigana: 'いいですよ！　[山|やま]の　[上|うえ]で　いっしょに　[食|た]べましょう！', en: 'All right! Let’s eat it together on top of the mountain!' }
    ],
    bridge: [
      { text: 'チョコ', gloss: 'チョコ = chocolate' }
    ],
    remixes: [
      { scene: 'Hinata says what he wants to do at the sea.', en: 'I want to swim in the sea!',
        chunks: ['うみで', 'およぎたいです！', 'およぐたいです！'], answer: ['うみで', 'およぎたいです！'],
        explain: 'たい joins the ます-stem: およぎます → およぎたい. およぐたい is not a form.' },
      { scene: 'Killua says who he climbs with.', en: 'I want to climb a mountain with Gon.',
        chunks: ['ゴンと', 'やまに', 'のぼりたい。', 'ゴンを'], answer: ['ゴンと', 'やまに', 'のぼりたい。'],
        explain: 'と after a person means "with". ゴンを would make Gon the thing being climbed.' }
    ],
    names: ['ヒナタ', 'キルア', 'ゴン'],
    uses: ['g:tai', 'g:ni-ikimasu', 'g:ni', 'g:de', 'g:to', 'g:no', 'g:mo', 'g:ga', 'g:yo', 'g:ne', 'g:ka', 'g:wa-desu', 'g:mashou', 'v:夏休み|なつやすみ', 'v:さん|さん', 'v:どこ|どこ', 'v:行く|いく', 'v:山|やま', 'v:登る|のぼる', 'v:いい|いい', 'v:私|わたし', 'v:海|うみ', 'v:泳ぐ|およぐ', 'v:暑い|あつい', 'v:休む|やすむ', 'v:欲しい|ほしい', 'v:上|うえ', 'v:食べる|たべる', 'v:一緒|いっしょ', 'k:行', 'k:山', 'k:上', 'k:食'],
    notes: 'チョコ is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-greengrocer', format: 'dialogue',
    title: 'At the greengrocer', goal: 'You can ask the price and say you go somewhere to buy something.',
    scene: 'Emilia comes to the greengrocer where Sanji works. He will do anything for a customer like her.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Greengrocer' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'sanji', furigana: 'エミリアさん！　かいものですか？', en: 'Emilia! Out shopping?' },
      { speaker: 'emilia', furigana: 'はい。やさいを　かいに　[来|き]ました。', en: 'Yes. I came to buy vegetables.' },
      { speaker: 'sanji', furigana: 'どうぞ！　[今日|きょう]の　やさいは　とても　やすいですよ！', en: 'Take a look! Today’s vegetables are very cheap!' },
      { speaker: 'emilia', furigana: 'これは　いくらですか？', en: 'How much is this?' },
      { speaker: 'sanji', furigana: '[百|ひゃく][円|えん]です！', en: '100 yen!' },
      { speaker: 'emilia', furigana: 'ぎゅうにゅうも　ありますか？', en: 'Do you have milk too?' },
      { speaker: 'sanji', furigana: 'ぎゅうにゅう……。ここは　やおやですから……。[今|いま]　かいに　[行|い]きます！', en: 'Milk... This is a greengrocer, so... I’ll go and buy some right now!' },
      { speaker: 'emilia', furigana: 'サンジさん、みせは？', en: 'Sanji, what about the shop?' },
      { speaker: 'sanji', furigana: '[五|ご]ふんで　かえります！', en: 'I’ll be back in five minutes!' }
    ],
    bridge: [
      { text: 'やさい', id: 'v:野菜|やさい', gloss: 'やさい = vegetables (taught later)' }
    ],
    remixes: [
      { scene: 'Sanji runs out of the shop.', en: 'I’ll go and buy milk!',
        chunks: ['ぎゅうにゅうを', 'かいに', 'いきます！', 'かうに'], answer: ['ぎゅうにゅうを', 'かいに', 'いきます！'],
        explain: 'To go and do something, put the ます-stem before に: かいます → かいに いきます. かうに is not a form.' },
      { scene: 'Emilia points at another vegetable.', en: 'How much is this?',
        chunks: ['これは', 'いくらですか？', 'いくらですよ。'], answer: ['これは', 'いくらですか？'],
        explain: 'いくら asks the price, and か makes the question. よ tells someone something, so it cannot end a question.' }
    ],
    names: ['サンジ', 'エミリア'],
    uses: ['g:ni-iku', 'g:kara', 'g:adj-i', 'g:totemo', 'g:mashita', 'g:de', 'g:no', 'g:mo', 'g:yo', 'g:ka', 'g:wa-desu', 'v:さん|さん', 'v:買い物|かいもの', 'v:野菜|やさい', 'v:買う|かう', 'v:来る|くる', 'v:どうぞ|どうぞ', 'v:今日|きょう', 'v:とても|とても', 'v:安い|やすい', 'v:これ|これ', 'v:いくら|いくら', 'v:百|ひゃく', 'v:円|えん', 'v:牛乳|ぎゅうにゅう', 'v:ある|ある', 'v:ここ|ここ', 'v:八百屋|やおや', 'v:今|いま', 'v:行く|いく', 'v:店|みせ', 'v:五|ご', 'v:分|ふん', 'v:帰る|かえる', 'v:はい|はい', 'k:来', 'k:今', 'k:日', 'k:百', 'k:円', 'k:行', 'k:五'],
    notes: 'uses v:はい|はい, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-sports-centre', format: 'dialogue',
    title: 'Where is the pool?', goal: 'You can ask the way inside a building: entrance, exit, stairs, lift.',
    scene: 'At the sports centre, Lelouch asks the staff, Maomao, the way to the pool. Lelouch is not one for exercise.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Staff' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Visitor' } },
    lines: [
      { speaker: 'lelouch', furigana: 'プールは　どこですか？', en: 'Where is the pool?' },
      { speaker: 'maomao', furigana: 'この　たてものの　[上|うえ]です。', en: 'At the top of this building.' },
      { speaker: 'lelouch', furigana: 'エレベーターは　どこですか？', en: 'Where is the lift?' },
      { speaker: 'maomao', furigana: 'あちらです。[今日|きょう]は　やすみですよ。', en: 'Over there. It is out today.' },
      { speaker: 'lelouch', furigana: '……かいだんは？', en: '...And the stairs?' },
      { speaker: 'maomao', furigana: 'かいだんは　[入|い]りぐちの　となりです。', en: 'The stairs are next to the entrance.' },
      { speaker: 'lelouch', furigana: '……[出|で]ぐちは　どこですか？', en: '...Where is the exit?' },
      { speaker: 'maomao', furigana: '[出|で]ぐちは　かいだんと　おなじ　ところです。……かえりますか？', en: 'The exit is in the same place as the stairs. ...Are you going home?' },
      { speaker: 'lelouch', furigana: '……かいだんで　プールへ　[行|い]きます。', en: '...I will take the stairs to the pool.' }
    ],
    remixes: [
      { scene: 'Maomao tells Lelouch where the stairs are.', en: 'The stairs are next to the entrance.',
        chunks: ['かいだんは', 'いりぐちの', 'となりです。', 'いりぐちを'], answer: ['かいだんは', 'いりぐちの', 'となりです。'],
        explain: 'の joins the place to となり: いりぐちの となり = next to the entrance. を needs a verb.' },
      { scene: 'Lelouch asks one more way, just in case.', en: 'Where is the exit?',
        chunks: ['でぐちは', 'どこですか？', 'どこですよ。'], answer: ['でぐちは', 'どこですか？'],
        explain: 'か makes the question. よ tells someone something, so it cannot end a question with どこ.' }
    ],
    names: ['マオマオ', 'ルルーシュ'],
    uses: ['g:to', 'g:de', 'g:no', 'g:masu', 'g:ka', 'g:yo', 'g:wa-desu', 'g:ni-ikimasu', 'v:帰る|かえる', 'v:プール|プール', 'v:どこ|どこ', 'v:この|この', 'v:建物|たてもの', 'v:上|うえ', 'v:エレベーター|エレベーター', 'v:あちら|あちら', 'v:階段|かいだん', 'v:入口|いりぐち', 'v:隣|となり', 'v:行く|いく', 'v:今日|きょう', 'v:休み|やすみ', 'v:出口|でぐち', 'v:同じ|おなじ', 'v:所|ところ', 'k:上', 'k:入', 'k:行', 'k:今', 'k:日', 'k:出'],
    notes: '入口 / 出口 are written 入りぐち / 出ぐち: 口 is taught later.',
    verified: true }),

  L({ id: 'l:n5-dlg-faster-way', format: 'dialogue',
    title: 'Train or bus?', goal: 'You can compare two things with のほうが and より.',
    scene: 'Nami and Sasuke are going to the sea. Nami wants the cheap way, Sasuke the fast way.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'nami', furigana: 'うみまで　[電車|でんしゃ]と　バスと、どちらが　はやいですか？', en: 'To the sea, which is faster, the train or the bus?' },
      { speaker: 'sasuke', furigana: '……[電車|でんしゃ]の　ほうが　はやいです。', en: '...The train is faster.' },
      { speaker: 'nami', furigana: 'バスの　ほうが　やすいですよ。[電車|でんしゃ]より　[五|ご][百|ひゃく][円|えん]　やすいです。', en: 'The bus is cheaper. 500 yen cheaper than the train.' },
      { speaker: 'sasuke', furigana: '……バスは　[電車|でんしゃ]より　[二|に][時間|じかん]　おそいです。', en: '...The bus is two hours slower than the train.' },
      { speaker: 'nami', furigana: 'じゃあ、あるきませんか？　ゼロ[円|えん]ですよ！', en: 'Then why don’t we walk? It’s zero yen!' },
      { speaker: 'sasuke', furigana: '……うみは　とおいです。えきは　ちかいです。', en: '...The sea is far. The station is near.' },
      { speaker: 'sasuke', furigana: '……きっぷは　わたしが　かいます。[電車|でんしゃ]で　[行|い]きましょう。', en: '...I’ll buy the tickets. Let’s take the train.' },
      { speaker: 'nami', furigana: '[電車|でんしゃ]の　ほうが　いいですね！', en: 'The train is better, isn’t it!' }
    ],
    bridge: [
      { text: 'じゃあ', id: 'v:じゃあ|じゃあ', gloss: 'じゃあ = then, in that case (taught later)' },
      { text: 'きっぷ', id: 'v:切符|きっぷ', gloss: 'きっぷ = ticket (taught later)' }
    ],
    remixes: [
      { scene: 'Sasuke gives his answer again.', en: 'The train is faster.',
        chunks: ['でんしゃの', 'ほうが', 'はやいです。', 'ほうを'], answer: ['でんしゃの', 'ほうが', 'はやいです。'],
        explain: 'のほうが marks the one that wins the comparison: でんしゃの ほうが はやい. を has no place in a comparison.' },
      { scene: 'Sasuke compares the station and the sea.', en: 'The station is nearer than the sea.',
        chunks: ['えきは', 'うみより', 'ちかいです。', 'うみのほうが'], answer: ['えきは', 'うみより', 'ちかいです。'],
        explain: 'より marks what you compare against: うみより = than the sea. The station is the topic, so うみのほうが would point at the wrong winner.' }
    ],
    names: ['ナミ', 'サスケ'],
    uses: ['g:hou-ga-yori', 'g:made', 'g:to', 'g:ga', 'g:masen-ka', 'g:mashou', 'g:de', 'g:no', 'g:ne', 'g:yo', 'g:ka', 'g:wa-desu', 'v:海|うみ', 'v:電車|でんしゃ', 'v:バス|バス', 'v:どちら|どちら', 'v:速い|はやい', 'v:ほう|ほう', 'v:安い|やすい', 'v:より|より', 'v:五|ご', 'v:百|ひゃく', 'v:円|えん', 'v:二|に', 'v:時間|じかん', 'v:遅い|おそい', 'v:じゃあ|じゃあ', 'v:歩く|あるく', 'v:ゼロ|ゼロ', 'v:遠い|とおい', 'v:駅|えき', 'v:近い|ちかい', 'v:切符|きっぷ', 'v:私|わたし', 'v:買う|かう', 'v:行く|いく', 'v:いい|いい', 'k:電', 'k:車', 'k:五', 'k:百', 'k:円', 'k:二', 'k:時', 'k:間', 'k:行'],
    verified: true }),

  L({ id: 'l:n5-dlg-best-season', format: 'dialogue',
    title: 'Which do you like best?', goal: 'You can ask and say which one you like best with の中で and いちばん.',
    scene: 'In the cafeteria, Sanji, who loves to cook, asks Killua about his favourite food and season.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'sanji', furigana: 'キルアさん、たべものの　[中|なか]で　[何|なに]が　いちばん　すきですか？', en: 'Killua, of all foods, what do you like best?' },
      { speaker: 'killua', furigana: 'チョコ。', en: 'Chocolate.' },
      { speaker: 'sanji', furigana: 'チョコ……。にくや　さかなや　やさいの　[中|なか]では？', en: 'Chocolate... And among meat, fish and vegetables?' },
      { speaker: 'killua', furigana: 'にく。やさいは　きらい。', en: 'Meat. I hate vegetables.' },
      { speaker: 'sanji', furigana: 'はる、なつ、あき、ふゆの　[中|なか]で、いつが　いちばん　すきですか？', en: 'Of spring, summer, autumn and winter, which do you like best?' },
      { speaker: 'killua', furigana: 'ふゆ。', en: 'Winter.' },
      { speaker: 'sanji', furigana: 'どうしてですか？', en: 'Why?' },
      { speaker: 'killua', furigana: 'ふゆは　チョコが　おいしいから。', en: 'Because chocolate tastes good in winter.' },
      { speaker: 'sanji', furigana: 'ふゆの　やさいも　おいしいですよ。たくさん　[食|た]べましょう！', en: 'Winter vegetables are tasty too. Let’s eat lots of them!' },
      { speaker: 'killua', furigana: 'にくの　ほうが　いい。', en: 'Meat is better.' }
    ],
    bridge: [
      { text: 'チョコ', gloss: 'チョコ = chocolate' }
    ],
    remixes: [
      { scene: 'Killua names his favourite season.', en: 'I like winter best.',
        chunks: ['ふゆが', 'いちばん', 'すき。', 'ふゆを'], answer: ['ふゆが', 'いちばん', 'すき。'],
        explain: 'いちばん before すき means "best". すき takes が for the thing you like, so not ふゆを.' },
      { scene: 'Sanji asks Killua about food.', en: 'Of all foods, what do you like best?',
        chunks: ['たべものの', 'なかで', 'なにが', 'いちばん', 'すきですか？', 'なにを'], answer: ['たべものの', 'なかで', 'なにが', 'いちばん', 'すきですか？'],
        explain: 'のなかで sets the group, いちばん picks the top one. すき takes が, so the question word is なにが.' }
    ],
    names: ['サンジ', 'キルア'],
    uses: ['g:naka-de-ichiban', 'g:ga', 'g:kara', 'g:adj-na', 'g:doushite', 'g:mashou', 'g:ya', 'g:no', 'g:mo', 'g:yo', 'g:ka', 'g:wa-desu', 'v:さん|さん', 'v:食べ物|たべもの', 'v:中|なか', 'v:何|なに', 'v:いちばん|いちばん', 'v:好き|すき', 'v:肉|にく', 'v:魚|さかな', 'v:野菜|やさい', 'v:嫌い|きらい', 'v:春|はる', 'v:夏|なつ', 'v:秋|あき', 'v:冬|ふゆ', 'v:いつ|いつ', 'v:どうして|どうして', 'v:おいしい|おいしい', 'v:たくさん|たくさん', 'v:食べる|たべる', 'v:ほう|ほう', 'v:いい|いい', 'k:中', 'k:何', 'k:食'],
    notes: 'チョコ is not on the N5 list: a bridge only.',
    verified: true }),

  // ── dialogues: stages 63-84 ──
  L({ id: 'l:n5-dlg-open-books', format: 'dialogue',
    title: 'Open your books', goal: 'You can link actions with the て-form and follow class instructions.',
    scene: 'In the classroom, Kakashi starts the lesson with his own little book open. Sakura has a question.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'kakashi', furigana: 'サクラさん、[本|ほん]を　あけて、ちょっと　まって　ください。', en: 'Sakura, open your book and wait a moment.' },
      { speaker: 'sakura', furigana: '[先生|せんせい]、しつもんです！', en: 'Sensei, I have a question!' },
      { speaker: 'kakashi', furigana: '……どうぞ。', en: '...Go ahead.' },
      { speaker: 'sakura', furigana: 'テストは　いつですか？', en: 'When is the test?' },
      { speaker: 'kakashi', furigana: '……あしたです。', en: '...Tomorrow.' },
      { speaker: 'sakura', furigana: 'あした！？　もういちど　ゆっくりと　いって　ください！', en: 'Tomorrow?! Please say that once more, slowly!' },
      { speaker: 'kakashi', furigana: '……あ、し、た、です。', en: '...To-mor-row.' },
      { speaker: 'sakura', furigana: '[先生|せんせい]！　その　[本|ほん]を　しめて　ください！', en: 'Sensei! Please close that book!' },
      { speaker: 'kakashi', furigana: '……あしたの　テストの　[本|ほん]ですよ。', en: '...This is the book for tomorrow’s test.' },
      { speaker: 'sakura', furigana: '[先生|せんせい]！　その　[本|ほん]を　あけて　ください！', en: 'Sensei! Please open that book!' }
    ],
    bridge: [
      { text: 'ください', ctx: 'まって　ください', id: 'g:te-kudasai', gloss: 'て-form + ください = please do it (taught next lesson)' }
    ],
    remixes: [
      { scene: 'Kakashi gives the next instruction.', en: 'Please close your book.',
        chunks: ['ほんを', 'しめて', 'ください。', 'しめます'], answer: ['ほんを', 'しめて', 'ください。'],
        explain: 'ください follows the て-form: しめて ください. The ます form cannot go before ください.' },
      { scene: 'Sakura did not catch the answer.', en: 'Please say it once more, slowly.',
        chunks: ['もういちど', 'ゆっくりと', 'いって', 'ください。', 'いいて'], answer: ['もういちど', 'ゆっくりと', 'いって', 'ください。'],
        explain: 'いう ends in う, so its て-form is いって (う → って). いいて is not a word.' }
    ],
    names: ['カカシ', 'サクラ'],
    uses: ['g:te-form', 'g:te-kudasai', 'g:wa-desu', 'g:ka', 'g:wo', 'g:no', 'g:yo', 'v:さん|さん', 'v:本|ほん', 'v:開ける|あける', 'v:ちょっと|ちょっと', 'v:待つ|まつ', 'v:ください|ください', 'v:先生|せんせい', 'v:質問|しつもん', 'v:どうぞ|どうぞ', 'v:テスト|テスト', 'v:いつ|いつ', 'v:明日|あした', 'v:もう一度|もういちど', 'v:ゆっくりと|ゆっくりと', 'v:言う|いう', 'v:その|その', 'v:閉める|しめる', 'k:本', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-heavy-bag', format: 'dialogue',
    title: 'A heavy bag', goal: 'You can ask someone to do something with 〜てください.',
    scene: 'At the school entrance, Emilia struggles with a bag of library books. Gojo, who never seems to strain, offers a hand.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'エミリアさん、その　にもつは　おもいですか？', en: 'Emilia, is that bag heavy?' },
      { speaker: 'emilia', furigana: 'とても　おもいです。としょかんで　[本|ほん]を　かりました。', en: 'Very heavy. I borrowed books from the library.' },
      { speaker: 'gojo', furigana: 'かして　ください。[先生|せんせい]が　もちますよ。', en: 'Let me have it. I’ll carry it.' },
      { speaker: 'gojo', furigana: 'かるいですよ、これ。', en: 'This is light.' },
      { speaker: 'emilia', furigana: 'ほんとうですか？　この　かばんも　もって　ください。', en: 'Really? Please carry this bag too.' },
      { speaker: 'gojo', furigana: 'いいですよ。', en: 'Sure.' },
      { speaker: 'emilia', furigana: 'かさも　おねがいします。', en: 'And my umbrella, please.' },
      { speaker: 'gojo', furigana: '……ちょっと　おもいです。', en: '...It’s a little heavy.' }
    ],
    remixes: [
      { scene: 'Gojo takes one more thing from Emilia.', en: 'Please hold this bag too.',
        chunks: ['この', 'かばんも', 'もって', 'ください。', 'もちて'], answer: ['この', 'かばんも', 'もって', 'ください。'],
        explain: 'もつ ends in つ, so its て-form is もって (つ → って). もちて is not a word.' },
      { scene: 'Emilia tells Gojo where the books go.', en: 'Please put the books here.',
        chunks: ['ほんを', 'ここに', 'おいて', 'ください。', 'おくて'], answer: ['ほんを', 'ここに', 'おいて', 'ください。'],
        explain: 'おく ends in く, so its て-form is おいて (く → いて). おくて is not a word.' }
    ],
    names: ['ゴジョウ', 'エミリア'],
    uses: ['g:te-kudasai', 'g:te-form', 'g:wa-desu', 'g:ka', 'g:de', 'g:wo', 'g:mo', 'g:yo', 'g:ga', 'g:mashita', 'g:totemo', 'v:さん|さん', 'v:その|その', 'v:荷物|にもつ', 'v:重い|おもい', 'v:とても|とても', 'v:図書館|としょかん', 'v:本|ほん', 'v:借りる|かりる', 'v:貸す|かす', 'v:ください|ください', 'v:先生|せんせい', 'v:持つ|もつ', 'v:軽い|かるい', 'v:これ|これ', 'v:ほんとう|ほんとう', 'v:この|この', 'v:かばん|かばん', 'v:いい|いい', 'v:傘|かさ', 'v:ちょっと|ちょっと', 'k:本', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-phone-call', format: 'dialogue',
    title: 'On the phone', goal: 'You can say what someone is doing now with 〜ています.',
    scene: 'Frieren calls Maomao in the evening. Someone near Maomao is singing. Neither of them says much.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Friend' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'maomao', furigana: 'もしもし。', en: 'Hello?' },
      { speaker: 'frieren', furigana: '……マオマオさん、フリーレンです。いま、[本|ほん]を　[読|よ]んで　います。', en: '...Maomao, it’s Frieren. I’m reading a book right now.' },
      { speaker: 'maomao', furigana: 'そうですか。わたしは　くすりを　のんで　います。', en: 'I see. I’m taking some medicine.' },
      { speaker: 'frieren', furigana: '……びょうきですか。', en: '...Are you sick?' },
      { speaker: 'maomao', furigana: 'いいえ。あたらしい　くすりです。おもしろいですよ。', en: 'No. It’s a new medicine. It’s interesting.' },
      { speaker: 'frieren', furigana: '……だれが　うたって　いますか。', en: '...Who is singing?' },
      { speaker: 'maomao', furigana: 'となりの　[人|ひと]です。ギターも　ひいて　います。', en: 'The person next door. They’re playing the guitar too.' },
      { speaker: 'frieren', furigana: '……じょうずです。', en: '...They’re good.' },
      { speaker: 'maomao', furigana: '……フリーレンさん。[何|なん]の　でんわですか。', en: '...Frieren. What is this call about?' },
      { speaker: 'frieren', furigana: '……マオマオさんと　[話|はな]して　います。', en: '...I’m talking with you, Maomao.' }
    ],
    remixes: [
      { scene: 'Maomao tells Frieren what she is doing.', en: 'I am taking medicine now.',
        chunks: ['いま', 'くすりを', 'のんでいます。', 'のみます。'], answer: ['いま', 'くすりを', 'のんでいます。'],
        explain: 'のみます is "I take" or "I will take". For something going on right now, use the て-form + います: のんで います.' },
      { scene: 'Maomao says who is making the noise.', en: 'The person next door is singing.',
        chunks: ['となりの', 'ひとが', 'うたって', 'います。', 'ひとを'], answer: ['となりの', 'ひとが', 'うたって', 'います。'],
        explain: 'が marks who is doing it: ひとが うたって います. を would make the person the thing being sung.' }
    ],
    names: ['マオマオ', 'フリーレン'],
    uses: ['g:te-iru', 'g:te-form', 'g:wa-desu', 'g:ka', 'g:wo', 'g:ga', 'g:no', 'g:mo', 'g:yo', 'g:to', 'g:adj-i', 'v:もしもし|もしもし', 'v:さん|さん', 'v:今|いま', 'v:本|ほん', 'v:読む|よむ', 'v:そう|そう', 'v:私|わたし', 'v:薬|くすり', 'v:飲む|のむ', 'v:病気|びょうき', 'v:いいえ|いいえ', 'v:新しい|あたらしい', 'v:おもしろい|おもしろい', 'v:誰|だれ', 'v:歌う|うたう', 'v:隣|となり', 'v:人|ひと', 'v:ギター|ギター', 'v:弾く|ひく', 'v:上手|じょうず', 'v:何|なん', 'v:電話|でんわ', 'v:話す|はなす', 'k:本', 'k:読', 'k:人', 'k:何', 'k:話'],
    notes: 'uses v:もしもし|もしもし and v:いいえ|いいえ, which are unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-may-i', format: 'dialogue',
    title: 'May I?', goal: 'You can ask for permission with 〜てもいいですか.',
    scene: 'Sanji steps into a small cafe where Nami works part time. Ever the gentleman, he asks before he does anything.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Customer' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Waitress' } },
    lines: [
      { speaker: 'sanji', furigana: 'すみません。[入|はい]っても　いいですか。', en: 'Excuse me. May I come in?' },
      { speaker: 'nami', furigana: 'ええ、こちらへ　どうぞ。', en: 'Yes, this way, please.' },
      { speaker: 'sanji', furigana: 'あの　まどの　テーブルに　すわっても　いいですか。', en: 'May I sit at that table by the window?' },
      { speaker: 'nami', furigana: 'いいですよ。コーヒーですか。', en: 'Of course. Coffee?' },
      { speaker: 'sanji', furigana: 'ええ、おねがいします。', en: 'Yes, please.' },
      { speaker: 'nami', furigana: 'コーヒーです。', en: 'Your coffee.' },
      { speaker: 'sanji', furigana: 'きれいな　コーヒーですね。しゃしんを　とっても　いいですか。', en: 'What a beautiful coffee. May I take a photo?' },
      { speaker: 'nami', furigana: 'どうぞ！　たくさん　とって　ください！', en: 'Go ahead! Take lots!' },
      { speaker: 'sanji', furigana: '……ここで　たばこを　すっても　いいですか。', en: '...May I smoke here?' },
      { speaker: 'nami', furigana: 'どうぞ。はいざらと　マッチです。マッチは　[百|ひゃく][円|えん]です。', en: 'Go ahead. Here’s an ashtray and some matches. The matches are 100 yen.' }
    ],
    remixes: [
      { scene: 'Sanji asks before he sits down.', en: 'May I sit here?',
        chunks: ['ここに', 'すわっても', 'いいですか。', 'すわりても'], answer: ['ここに', 'すわっても', 'いいですか。'],
        explain: 'すわる ends in る but is an う-verb: すわって. Add も いいですか to ask for permission.' },
      { scene: 'Sanji wants a photo of the cafe window.', en: 'May I take a photo of the window?',
        chunks: ['まどの', 'しゃしんを', 'とっても', 'いいですか。', 'とっては'], answer: ['まどの', 'しゃしんを', 'とっても', 'いいですか。'],
        explain: 'Permission is てもいいですか: とっても いいですか. とっては goes with いけません, "must not" (a later lesson).' }
    ],
    names: ['サンジ', 'ナミ'],
    uses: ['g:te-mo-ii', 'g:te-form', 'g:te-kudasai', 'g:ka', 'g:no', 'g:ni', 'g:ni-ikimasu', 'g:wo', 'g:wa-desu', 'g:de', 'g:yo', 'g:adj-na', 'g:ne', 'v:入る|はいる', 'v:いい|いい', 'v:ええ|ええ', 'v:こちら|こちら', 'v:どうぞ|どうぞ', 'v:あの|あの', 'v:窓|まど', 'v:テーブル|テーブル', 'v:座る|すわる', 'v:コーヒー|コーヒー', 'v:きれい|きれい', 'v:写真|しゃしん', 'v:撮る|とる', 'v:たくさん|たくさん', 'v:ください|ください', 'v:ここ|ここ', 'v:たばこ|たばこ', 'v:吸う|すう', 'v:灰皿|はいざら', 'g:to', 'v:マッチ|マッチ', 'v:百|ひゃく', 'v:円|えん', 'k:入', 'k:百', 'k:円'],
    notes: 'uses v:ええ|ええ, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-factory-rules', format: 'dialogue',
    title: 'Rules on the tour', goal: 'You can say what is not allowed with 〜てはいけません.',
    scene: 'On a class trip to a factory, Gojo-sensei walks his student Sasuke through the rules. Gojo has a bag of sweets in his hand.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'サスケさん、ここで　はしっては　いけませんよ。あぶないですから。', en: 'Sasuke, you must not run here. It’s dangerous.' },
      { speaker: 'sasuke', furigana: '……はしって　いません。', en: '...I’m not running.' },
      { speaker: 'gojo', furigana: 'この　ドアは　おしては　いけません。ひいて　ください。', en: 'You must not push this door. Pull it, please.' },
      { speaker: 'sasuke', furigana: '……あの　でんきは？', en: '...And that light?' },
      { speaker: 'gojo', furigana: 'あの　でんきは　けしては　いけません。いつも　つけて　います。', en: 'You must not switch that light off. It is always on.' },
      { speaker: 'sasuke', furigana: '……ゴジョウ[先生|せんせい]。ここで　[食|た]べては　いけません。', en: '...Gojo-sensei. You must not eat here.' },
      { speaker: 'gojo', furigana: '……サスケさんも　[食|た]べますか？', en: '...Want some too, Sasuke?' },
      { speaker: 'sasuke', furigana: '……[食|た]べません。', en: '...I won’t.' }
    ],
    remixes: [
      { scene: 'Gojo gives the first rule again.', en: 'You must not run here.',
        chunks: ['ここで', 'はしっては', 'いけません。', 'はしっても'], answer: ['ここで', 'はしっては', 'いけません。'],
        explain: 'はしっても いい means "you may run", and はしっても いけません means "you must not run here either" (も = also). The rule itself is the て-form + は: はしっては いけません.' },
      { scene: 'Gojo points at the light.', en: 'You must not switch off the light.',
        chunks: ['でんきを', 'けしては', 'いけません。', 'でんきに'], answer: ['でんきを', 'けしては', 'いけません。'],
        explain: 'を marks the thing you switch off: でんきを けします. に is for a place or a time.' }
    ],
    names: ['ゴジョウ', 'サスケ'],
    uses: ['g:te-wa-ikemasen', 'g:te-form', 'g:te-iru', 'g:te-kudasai', 'g:de', 'g:wa-desu', 'g:yo', 'g:kara', 'g:mo', 'g:ka', 'g:masen', 'g:masu', 'g:itsumo', 'v:さん|さん', 'v:ここ|ここ', 'v:走る|はしる', 'v:危ない|あぶない', 'v:この|この', 'v:ドア|ドア', 'v:押す|おす', 'v:引く|ひく', 'v:ください|ください', 'v:あの|あの', 'v:電気|でんき', 'v:消す|けす', 'v:いつも|いつも', 'v:つける|つける', 'v:食べる|たべる', 'v:先生|せんせい', 'k:食', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-morning-order', format: 'dialogue',
    title: 'Morning order', goal: 'You can say what comes first with 〜てから.',
    scene: 'A busy morning at home. Yor wants Anya to wash up before breakfast. Anya has her own order in mind.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Host' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'アーニャさん、かおを　あらってから、あさごはんを　[食|た]べて　ください。', en: 'Anya, wash your face first, then eat breakfast.' },
      { speaker: 'anya', furigana: 'あさごはん、[何|なに]？', en: 'What’s for breakfast?' },
      { speaker: 'yor', furigana: 'パンです。', en: 'Bread.' },
      { speaker: 'anya', furigana: '[食|た]べてから、かお　あらう！', en: 'Eat first, then wash my face!' },
      { speaker: 'yor', furigana: 'いいえ。あらってから　[食|た]べます。[食|た]べてから、はを　みがきます。', en: 'No. You wash, then you eat. After eating, you brush your teeth.' },
      { speaker: 'anya', furigana: 'はを　みがいてから、ピーナッツ！', en: 'After brushing my teeth, peanuts!' },
      { speaker: 'yor', furigana: '……ピーナッツは　かえってからです。', en: '...Peanuts are for after we come home.' },
      { speaker: 'anya', furigana: 'はい……。アーニャ、かお　あらう。', en: 'Okay... Anya will wash her face.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Yor says the order once more.', en: 'Wash your face, then eat breakfast.',
        chunks: ['かおを', 'あらってから', 'あさごはんを', 'たべます。', 'あらうから'], answer: ['かおを', 'あらってから', 'あさごはんを', 'たべます。'],
        explain: 'あらうから means "because I wash": から after the dictionary form gives a reason. For "after", join the て-form: あらって + から.' },
      { scene: 'Yor says what happens after breakfast.', en: 'After eating breakfast, we go out.',
        chunks: ['あさごはんを', 'たべてから', 'でかけます。', 'あさごはんで'], answer: ['あさごはんを', 'たべてから', 'でかけます。'],
        explain: 'を marks what you eat: あさごはんを たべて. で would mark a place or a tool.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:te-kara', 'g:te-form', 'g:te-kudasai', 'g:wo', 'g:wa-desu', 'g:verb-groups-dict', 'g:masu', 'v:さん|さん', 'v:顔|かお', 'v:洗う|あらう', 'v:朝御飯|あさごはん', 'v:食べる|たべる', 'v:ください|ください', 'v:何|なに', 'v:パン|パン', 'v:いいえ|いいえ', 'v:歯|は', 'v:磨く|みがく', 'v:帰る|かえる', 'v:はい|はい', 'k:食', 'k:何'],
    notes: 'uses v:いいえ|いいえ and v:はい|はい, which are unverified, so the dialogue is too. ピーナッツ is not on the N5 list: a bridge only.',
    verified: false }),

  L({ id: 'l:n5-dlg-class-over', format: 'dialogue',
    title: 'Is class over?', goal: 'You can say something is already done with もう.',
    scene: 'Nine o’clock in the classroom. Frieren is still reading a book of magic. Emilia is ready.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'emilia', furigana: '[先生|せんせい]、もう　[九|く][時|じ]ですよ。', en: 'Sensei, it’s already nine.' },
      { speaker: 'frieren', furigana: '……もう？', en: '...Already?' },
      { speaker: 'emilia', furigana: 'じゅぎょうは　[九|く][時|じ]に　はじまります。', en: 'Class starts at nine.' },
      { speaker: 'frieren', furigana: '……エミリアさん、しゅくだいは？', en: '...Emilia, your homework?' },
      { speaker: 'emilia', furigana: 'もう　おわりました！　さくぶんも　[書|か]きました。', en: 'I already finished it! I wrote the essay too.' },
      { speaker: 'frieren', furigana: '……もんだいの　れんしゅうは？', en: '...And the practice problems?' },
      { speaker: 'emilia', furigana: 'それも　もう　おわりました。', en: 'Those are already done too.' },
      { speaker: 'frieren', furigana: '……きょうの　じゅぎょうは　もう　おわりました。', en: '...Today’s class is already over.' },
      { speaker: 'emilia', furigana: '[先生|せんせい]！　じゅぎょうは　はじまって　いません！', en: 'Sensei! Class hasn’t even started!' },
      { speaker: 'frieren', furigana: '……もう　すこし　[本|ほん]を　[読|よ]みます。', en: '...I’ll read a little more.' }
    ],
    remixes: [
      { scene: 'Emilia reports on her homework.', en: 'I already finished my homework.',
        chunks: ['しゅくだいは', 'もう', 'おわりました。', 'もういちど'], answer: ['しゅくだいは', 'もう', 'おわりました。'],
        explain: 'もう before a finished action means "already". もういちど means "once more", which does not fit here.' },
      { scene: 'Emilia tells Frieren the time.', en: 'It is already nine o’clock.',
        chunks: ['もう', 'くじ', 'です。', 'くじに'], answer: ['もう', 'くじ', 'です。'],
        explain: 'With です the time stands alone: くじです. に marks when something happens, as in くじに はじまります.' }
    ],
    names: ['フリーレン', 'エミリア'],
    uses: ['g:mou', 'g:yo', 'g:ni', 'g:wa-desu', 'g:masu', 'g:mashita', 'g:mo', 'g:no', 'g:wo', 'g:te-iru', 'g:te-form', 'g:masen', 'v:先生|せんせい', 'v:もう|もう', 'v:九|く', 'v:時|じ', 'v:授業|じゅぎょう', 'v:始まる|はじまる', 'v:さん|さん', 'v:宿題|しゅくだい', 'v:終わる|おわる', 'v:作文|さくぶん', 'v:書く|かく', 'v:問題|もんだい', 'v:練習|れんしゅう', 'v:それ|それ', 'v:今日|きょう', 'v:少し|すこし', 'v:本|ほん', 'v:読む|よむ', 'k:先', 'k:生', 'k:九', 'k:時', 'k:書', 'k:本', 'k:読'],
    verified: true }),

  L({ id: 'l:n5-dlg-kanji-again', format: 'dialogue',
    title: 'This kanji again', goal: 'You can say what you won’t do with the ない-form.',
    scene: 'After class, Kakashi quizzes Hinata on two kanji from yesterday.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'kakashi', furigana: 'ヒナタさん、この　かんじの　いみは？', en: 'Hinata, what does this kanji mean?' },
      { speaker: 'hinata', furigana: '……わかりません！', en: '...I don’t know!' },
      { speaker: 'kakashi', furigana: 'きのう　おしえましたよ。[川|かわ]です。', en: 'I taught you yesterday. It’s "river".' },
      { speaker: 'hinata', furigana: '[川|かわ]！　もう　わすれない！', en: 'River! I won’t forget it again!' },
      { speaker: 'kakashi', furigana: 'これは？', en: 'And this one?' },
      { speaker: 'hinata', furigana: '[山|やま]です！　これも　わすれない！', en: 'Mountain! I won’t forget this one either!' },
      { speaker: 'kakashi', furigana: '……はじめの　かんじは？', en: '...And the first kanji?' },
      { speaker: 'hinata', furigana: '……[山|やま]？', en: '...Mountain?' },
      { speaker: 'kakashi', furigana: '……まだ　[川|かわ]です。', en: '...It’s still river.' },
      { speaker: 'hinata', furigana: '[先生|せんせい]！　もういちど　おしえて　ください！', en: 'Sensei! Teach me once more!' }
    ],
    remixes: [
      { scene: 'Hinata makes his promise.', en: 'I won’t forget!',
        chunks: ['もう', 'わすれない！', 'わすれらない！'], answer: ['もう', 'わすれない！'],
        explain: 'わすれる is a る-verb: drop る and add ない, わすれない. わすれらない is not a form.' },
      { scene: 'Kakashi gives Hinata a task.', en: 'Please remember this kanji.',
        chunks: ['この', 'かんじを', 'おぼえて', 'ください。', 'おぼえって'], answer: ['この', 'かんじを', 'おぼえて', 'ください。'],
        explain: 'おぼえる is a る-verb: drop る, add て, おぼえて. っ appears only in う-verbs ending in う, つ or る (and いく).' }
    ],
    names: ['カカシ', 'ヒナタ'],
    uses: ['g:nai-form', 'g:mou', 'g:te-form', 'g:te-kudasai', 'g:wa-desu', 'g:no', 'g:yo', 'g:mo', 'g:masen', 'g:mashita', 'v:さん|さん', 'v:この|この', 'v:漢字|かんじ', 'v:意味|いみ', 'v:分かる|わかる', 'v:昨日|きのう', 'v:教える|おしえる', 'v:川|かわ', 'v:もう|もう', 'v:忘れる|わすれる', 'v:これ|これ', 'v:山|やま', 'v:初め|はじめ', 'v:まだ|まだ', 'v:先生|せんせい', 'v:もう一度|もういちど', 'v:ください|ください', 'k:川', 'k:山', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-cooking-lesson', format: 'dialogue',
    title: 'Not yet!', goal: 'You can say "not yet" and "still" with まだ.',
    scene: 'In the kitchen, Sanji gently teaches Yor to make dinner. Yor is nervous: her cooking usually goes wrong, but she is very good with a knife.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' }, yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Helper' } },
    lines: [
      { speaker: 'sanji', furigana: 'ヨルさん、いっしょに　ばんごはんを　つくりましょう。', en: 'Yor, let’s make dinner together.' },
      { speaker: 'yor', furigana: 'わたしは　りょうりが　へたです……。', en: 'I’m bad at cooking...' },
      { speaker: 'sanji', furigana: 'だいじょうぶですよ。この　やさいを　きって　ください。', en: 'It’s all right. Please cut these vegetables.' },
      { speaker: 'yor', furigana: '……きりました！', en: '...Done!' },
      { speaker: 'sanji', furigana: 'もう？　……とても　きれいです！', en: 'Already? ...They’re beautiful!' },
      { speaker: 'yor', furigana: 'にくも　いれますか？', en: 'Do I put the meat in too?' },
      { speaker: 'sanji', furigana: 'いいえ、にくは　まだです。しょうゆも　まだですよ。', en: 'No, not the meat yet. Not the soy sauce yet, either.' },
      { speaker: 'yor', furigana: '……しょうゆは　もう　いれました。', en: '...I already put the soy sauce in.' },
      { speaker: 'sanji', furigana: 'だいじょうぶです！　やさいは　まだ　たくさん　ありますよ。', en: 'It’s all right! There are still lots of vegetables.' },
      { speaker: 'yor', furigana: '……もういちど　きります！', en: '...I’ll cut them again!' }
    ],
    remixes: [
      { scene: 'Yor asks before adding the soy sauce.', en: 'Do I put the soy sauce in too?',
        chunks: ['しょうゆも', 'いれますか？', 'いれりますか？'], answer: ['しょうゆも', 'いれますか？'],
        explain: 'いれる is a る-verb: drop る and add ます, いれます. いれります is not a form.' },
      { scene: 'Sanji answers about the meat.', en: 'Not yet. The meat comes later.',
        chunks: ['まだです。', 'にくは', 'あとです。', 'もうです。'], answer: ['まだです。', 'にくは', 'あとです。'],
        explain: 'まだです alone means "not yet". もう needs a finished action, like もう いれました; もうです is not said.' }
    ],
    names: ['サンジ', 'ヨル'],
    uses: ['g:mada', 'g:mou', 'g:mashou', 'g:te-form', 'g:te-kudasai', 'g:ga', 'g:wa-desu', 'g:wo', 'g:ni', 'g:mo', 'g:ka', 'g:yo', 'g:masu', 'g:mashita', 'g:totemo', 'v:さん|さん', 'v:一緒|いっしょ', 'v:晩御飯|ばんごはん', 'v:作る|つくる', 'v:私|わたし', 'v:料理|りょうり', 'v:下手|へた', 'v:大丈夫|だいじょうぶ', 'v:この|この', 'v:野菜|やさい', 'v:切る|きる', 'v:ください|ください', 'v:もう|もう', 'v:とても|とても', 'v:きれい|きれい', 'v:肉|にく', 'v:入れる|いれる', 'v:いいえ|いいえ', 'v:まだ|まだ', 'v:しょうゆ|しょうゆ', 'v:たくさん|たくさん', 'v:ある|ある', 'v:もう一度|もういちど'],
    notes: 'uses v:いいえ|いいえ, which is unverified, so the dialogue is too.',
    verified: false }),

  L({ id: 'l:n5-dlg-table-set', format: 'dialogue',
    title: 'Is the table set?', goal: 'You can say you have not done something yet with まだ〜ていません.',
    scene: 'Dinner time. Gojo, who looks after Killua, asks if the table is set.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Guardian' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Child' } },
    lines: [
      { speaker: 'gojo', furigana: 'キルアさん、もう　ちゃわんを　テーブルに　おきましたか？', en: 'Killua, have you put the bowls on the table yet?' },
      { speaker: 'killua', furigana: 'まだ　おいて　いない。', en: 'Haven’t yet.' },
      { speaker: 'gojo', furigana: 'おさらと　スプーンは？', en: 'And the plates and spoons?' },
      { speaker: 'killua', furigana: 'それも　まだ。', en: 'Not those either.' },
      { speaker: 'gojo', furigana: 'カップも　まだ　おいて　いませんか？', en: 'You haven’t put out the cups yet either?' },
      { speaker: 'killua', furigana: '[先生|せんせい]は？　ばんごはんは？', en: 'What about you, sensei? Where’s dinner?' },
      { speaker: 'gojo', furigana: '……まだ　つくって　いません。', en: '...I haven’t made it yet.' },
      { speaker: 'killua', furigana: '……チョコレートを　[食|た]べる。', en: '...I’m eating chocolate.' },
      { speaker: 'gojo', furigana: 'わたしも　[食|た]べます！', en: 'Me too!' }
    ],
    bridge: [
      { text: 'チョコレート', gloss: 'チョコレート = chocolate' }
    ],
    remixes: [
      { scene: 'Killua answers about the plates, politely this time.', en: 'I have not put the plates out yet.',
        chunks: ['おさらは', 'まだ', 'おいていません。', 'おきません。'], answer: ['おさらは', 'まだ', 'おいていません。'],
        explain: 'まだ おきません is "I won’t put them out yet" (a choice). "I haven’t done it yet" is まだ + the て-form + いません: まだ おいて いません.' },
      { scene: 'Gojo asks about the bowls again.', en: 'Have you put the bowls out yet?',
        chunks: ['もう', 'ちゃわんを', 'おきましたか？', 'まだ'], answer: ['もう', 'ちゃわんを', 'おきましたか？'],
        explain: 'To ask "yet?", use もう with ました: もう おきましたか. まだ belongs in the "not yet" answer.' }
    ],
    names: ['ゴジョウ', 'キルア'],
    uses: ['g:mada-te-imasen', 'g:mada', 'g:mou', 'g:te-iru', 'g:te-form', 'g:nai-form', 'g:mashita', 'g:masu', 'g:wo', 'g:ni', 'g:to', 'g:mo', 'g:ka', 'v:さん|さん', 'v:もう|もう', 'v:ちゃわん|ちゃわん', 'v:テーブル|テーブル', 'v:置く|おく', 'v:まだ|まだ', 'v:お皿|おさら', 'v:スプーン|スプーン', 'v:それ|それ', 'v:カップ|カップ', 'v:先生|せんせい', 'v:晩御飯|ばんごはん', 'v:作る|つくる', 'v:私|わたし', 'v:食べる|たべる', 'k:先', 'k:生', 'k:食'],
    notes: 'チョコレート is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-clinic', format: 'dialogue',
    title: 'At the clinic', goal: 'You can ask someone not to do something with 〜ないでください.',
    scene: 'Anya comes to the clinic with a stomach ache. The doctor today is Maomao.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Doctor' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Patient' } },
    lines: [
      { speaker: 'maomao', furigana: 'アーニャさん、どこが　いたいですか。', en: 'Anya, where does it hurt?' },
      { speaker: 'anya', furigana: 'おなか！　あたまも！', en: 'My tummy! My head too!' },
      { speaker: 'maomao', furigana: 'くちを　あけて　ください。', en: 'Open your mouth, please.' },
      { speaker: 'maomao', furigana: '……しめないで　ください。', en: '...Please don’t close it.' },
      { speaker: 'anya', furigana: 'いしゃ、きらい！', en: 'I don’t like doctors!' },
      { speaker: 'maomao', furigana: '……きのう、[何|なに]を　[食|た]べましたか。', en: '...What did you eat yesterday?' },
      { speaker: 'anya', furigana: 'ピーナッツ！　たくさん！', en: 'Peanuts! Lots!' },
      { speaker: 'maomao', furigana: '……ピーナッツを　たくさん　[食|た]べないで　ください。', en: '...Please don’t eat so many peanuts.' },
      { speaker: 'anya', furigana: '……すこし？', en: '...A little?' },
      { speaker: 'maomao', furigana: 'すこしは　いいですよ。', en: 'A little is fine.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Maomao checks Anya’s mouth.', en: 'Please don’t close your mouth.',
        chunks: ['くちを', 'しめないで', 'ください。', 'しめなくて'], answer: ['くちを', 'しめないで', 'ください。'],
        explain: 'しめなくて means "not closing, so…". Only the ない-form + で goes before ください to ask someone not to do something: しめないで ください.' },
      { scene: 'Maomao gives one more rule.', en: 'Please don’t eat a lot.',
        chunks: ['たくさん', 'たべないで', 'ください。', 'たべて'], answer: ['たくさん', 'たべないで', 'ください。'],
        explain: 'たべて ください asks her to eat. "Please don’t" needs the ない-form + で: たべないで ください.' }
    ],
    names: ['マオマオ', 'アーニャ'],
    uses: ['g:nai-de-kudasai', 'g:nai-form', 'g:te-kudasai', 'g:te-form', 'g:ga', 'g:ka', 'g:mo', 'g:wo', 'g:mashita', 'g:wa-desu', 'g:yo', 'v:さん|さん', 'v:どこ|どこ', 'v:痛い|いたい', 'v:おなか|おなか', 'v:頭|あたま', 'v:口|くち', 'v:開ける|あける', 'v:ください|ください', 'v:閉める|しめる', 'v:医者|いしゃ', 'v:嫌い|きらい', 'v:昨日|きのう', 'v:何|なに', 'v:食べる|たべる', 'v:たくさん|たくさん', 'v:少し|すこし', 'v:いい|いい', 'k:何', 'k:食'],
    notes: 'ピーナッツ is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-post-office', format: 'dialogue',
    title: 'At the post office', goal: 'You can say what someone has to do with 〜なくてはいけません.',
    scene: 'Sasuke brings a letter to the post office. Nami is at the counter and tries upselling.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Clerk' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'sasuke', furigana: '……この　てがみを　だしたいです。', en: '...I want to send this letter.' },
      { speaker: 'nami', furigana: 'ふうとうに　[名前|なまえ]を　[書|か]かなくては　いけませんよ。', en: 'You have to write the name on the envelope.' },
      { speaker: 'sasuke', furigana: '……[書|か]きました。', en: '...Done.' },
      { speaker: 'nami', furigana: 'きっても　かわなくては　いけません。[百|ひゃく][円|えん]です。', en: 'And you have to buy a stamp. It’s 100 yen.' },
      { speaker: 'sasuke', furigana: '……どうぞ。', en: '...Here.' },
      { speaker: 'nami', furigana: '[二|に][百|ひゃく][円|えん]の　きっては　きれいですよ。', en: 'The 200-yen stamps are pretty, you know.' },
      { speaker: 'sasuke', furigana: '……[百|ひゃく][円|えん]の　きってで　いいです。', en: '...The 100-yen stamp is fine.' },
      { speaker: 'nami', furigana: 'そうですか。ポストは　あちらです。', en: 'I see. The postbox is over there.' }
    ],
    remixes: [
      { scene: 'Nami reminds Sasuke about the stamp.', en: 'You have to buy a stamp.',
        chunks: ['きってを', 'かわなくては', 'いけません。', 'かいなくては'], answer: ['きってを', 'かわなくては', 'いけません。'],
        explain: 'かう ends in う, and its ない-form uses わ: かわない, so かわなくては. かいなくては is not a form.' },
      { scene: 'Nami points at the envelope.', en: 'You have to write the name on the envelope.',
        chunks: ['ふうとうに', 'なまえを', 'かかなくては', 'いけません。', 'いいです。'], answer: ['ふうとうに', 'なまえを', 'かかなくては', 'いけません。'],
        explain: 'なくては goes with いけません: "not doing it is not OK", so you must. なくては いいです is not said.' }
    ],
    names: ['ナミ', 'サスケ'],
    uses: ['g:nakute-wa-ikenai', 'g:tai', 'g:wo', 'g:ni', 'g:yo', 'g:mo', 'g:no', 'g:de', 'g:wa-desu', 'g:ka', 'g:mashita', 'v:この|この', 'v:手紙|てがみ', 'v:出す|だす', 'v:封筒|ふうとう', 'v:名前|なまえ', 'v:書く|かく', 'v:切手|きって', 'v:買う|かう', 'v:百|ひゃく', 'v:円|えん', 'v:二|に', 'v:どうぞ|どうぞ', 'v:きれい|きれい', 'v:いい|いい', 'v:そう|そう', 'v:ポスト|ポスト', 'v:あちら|あちら', 'k:名', 'k:前', 'k:書', 'k:百', 'k:円', 'k:二'],
    verified: true }),

  L({ id: 'l:n5-dlg-help-offer', format: 'dialogue',
    title: 'Shall I help?', goal: 'You can offer help with 〜ましょうか.',
    scene: 'Midday at the pharmacy. Sanji drops by and offers to help Maomao with everything.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Friend' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' } },
    lines: [
      { speaker: 'sanji', furigana: 'マオマオさん、その　かみを　はりましょうか。', en: 'Maomao, shall I put up that paper for you?' },
      { speaker: 'maomao', furigana: '……もう　はりました。', en: '...I already did.' },
      { speaker: 'sanji', furigana: 'わたしの　[万|まん][年|ねん]ひつを　かしましょうか。', en: 'Shall I lend you my fountain pen?' },
      { speaker: 'maomao', furigana: 'ペンは　ポケットに　あります。', en: 'I have a pen in my pocket.' },
      { speaker: 'sanji', furigana: 'おちゃを　いれましょうか。', en: 'Shall I make you some tea?' },
      { speaker: 'maomao', furigana: '……サンジさん、もう　ひるですよ。', en: '...Sanji, it’s already noon.' },
      { speaker: 'sanji', furigana: 'ひるごはんを　つくりましょうか！', en: 'Shall I make you lunch?' },
      { speaker: 'maomao', furigana: '……それは　おねがいします。', en: '...That one, yes please.' }
    ],
    remixes: [
      { scene: 'Sanji offers to put up the paper.', en: 'Shall I put up this paper?',
        chunks: ['この', 'かみを', 'はりましょうか。', 'はりましょう。'], answer: ['この', 'かみを', 'はりましょうか。'],
        explain: 'はりましょう is "let’s put it up" (both of us). ましょうか offers to do it for the other person: はりましょうか.' },
      { scene: 'Sanji offers tea.', en: 'Shall I make some tea?',
        chunks: ['おちゃを', 'いれましょうか。', 'おちゃで'], answer: ['おちゃを', 'いれましょうか。'],
        explain: 'を marks the tea you make: おちゃを いれます. で would mark a place or a tool.' }
    ],
    names: ['サンジ', 'マオマオ'],
    uses: ['g:mashou-ka', 'g:wo', 'g:wa-desu', 'g:ni', 'g:no', 'g:ka', 'g:masu', 'g:mashita', 'g:mou', 'g:yo', 'v:さん|さん', 'v:その|その', 'v:紙|かみ', 'v:貼る|はる', 'v:もう|もう', 'v:私|わたし', 'v:万年筆|まんねんひつ', 'v:貸す|かす', 'v:ペン|ペン', 'v:ポケット|ポケット', 'v:ある|ある', 'v:お茶|おちゃ', 'v:入れる|いれる', 'v:昼|ひる', 'v:昼御飯|ひるごはん', 'v:作る|つくる', 'v:それ|それ', 'k:万', 'k:年'],
    verified: true }),

  L({ id: 'l:n5-dlg-left-corner', format: 'dialogue',
    title: 'Which way to the station?', goal: 'You can give directions and say what you have to do with 〜なくてはなりません.',
    scene: 'On a street corner, Emilia, holding a map, asks a passer-by the way. It is Sasuke.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Stranger' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Passer-by' } },
    lines: [
      { speaker: 'emilia', furigana: 'あの、えきへ　[行|い]きたいです。', en: 'Um, I want to go to the station.' },
      { speaker: 'sasuke', furigana: '……この　みちを　まっすぐ　[行|い]って、かどを　[左|ひだり]に　まがって　ください。', en: '...Go straight along this road and turn left at the corner.' },
      { speaker: 'emilia', furigana: 'かどを　[左|ひだり]に……。', en: 'Left at the corner...' },
      { speaker: 'sasuke', furigana: '……はしを　わたらなくては　なりません。', en: '...You have to cross a bridge.' },
      { speaker: 'emilia', furigana: 'はし？　この　ちずに　はしは　ありません。', en: 'A bridge? There’s no bridge on this map.' },
      { speaker: 'sasuke', furigana: '……その　ちずは　[上|うえ]と　[下|した]が　ぎゃくです。', en: '...You have that map upside down.' },
      { speaker: 'emilia', furigana: 'ほんとうですね……。[右|みぎ]と　[左|ひだり]も……。', en: 'You’re right... And left and right, too...' },
      { speaker: 'sasuke', furigana: '……こうさてんも　わたらなくては　なりません。……いっしょに　[行|い]きます。', en: '...You have to cross a junction too. ...I’ll come with you.' }
    ],
    bridge: [
      { text: 'ぎゃく', gloss: 'ぎゃく = the other way round' }
    ],
    remixes: [
      { scene: 'Sasuke warns Emilia about the bridge.', en: 'You have to cross the bridge.',
        chunks: ['はしを', 'わたらなくては', 'なりません。', 'わたっては'], answer: ['はしを', 'わたらなくては', 'なりません。'],
        explain: 'わたっては なりません means "must not cross". "Have to cross" uses the ない-form: わたらなくては なりません.' },
      { scene: 'Sasuke gives the first turn again.', en: 'Turn left at the corner.',
        chunks: ['かどを', 'ひだりに', 'まがって', 'ください。', 'ひだりで'], answer: ['かどを', 'ひだりに', 'まがって', 'ください。'],
        explain: 'に marks the direction you turn: ひだりに まがります. で marks where an action happens, not which way.' }
    ],
    names: ['エミリア', 'サスケ'],
    uses: ['g:nakute-wa-naranai', 'g:tai', 'g:te-form', 'g:te-kudasai', 'g:ni-ikimasu', 'g:wo', 'g:ni', 'g:wa-desu', 'g:to', 'g:ga', 'g:mo', 'g:ne', 'g:masu', 'v:あの|あの', 'v:駅|えき', 'v:行く|いく', 'v:この|この', 'v:道|みち', 'v:まっすぐ|まっすぐ', 'v:角|かど', 'v:左|ひだり', 'v:曲がる|まがる', 'v:ください|ください', 'v:橋|はし', 'v:渡る|わたる', 'v:地図|ちず', 'v:ある|ある', 'v:その|その', 'v:上|うえ', 'v:下|した', 'v:ほんとう|ほんとう', 'v:右|みぎ', 'v:交差点|こうさてん', 'v:一緒|いっしょ', 'k:行', 'k:左', 'k:右', 'k:上', 'k:下'],
    verified: true }),

  L({ id: 'l:n5-dlg-north-bridge', format: 'dialogue',
    title: 'North of the bridge', goal: 'You can give directions with north, east and west.',
    scene: 'Gojo, new in town, asks Nami the way. Nami always knows where north is.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Local' }, gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Visitor' } },
    lines: [
      { speaker: 'gojo', furigana: 'すみません。この　へんに　えきは　ありますか。', en: 'Excuse me. Is there a station around here?' },
      { speaker: 'nami', furigana: 'えきは　[北|きた]です。あの　はしの　むこうですよ。', en: 'The station is to the north. Across that bridge.' },
      { speaker: 'gojo', furigana: '[北|きた]は　どっちですか。', en: 'Which way is north?' },
      { speaker: 'nami', furigana: '……あっちです。', en: '...That way.' },
      { speaker: 'gojo', furigana: 'えきの　ちかくに　おいしい　みせは　ありますか。', en: 'Is there a good place to eat near the station?' },
      { speaker: 'nami', furigana: '[東|ひがし]の　でぐちの　よこに　ありますよ。[西|にし]の　でぐちじゃ　ありません。', en: 'There’s one next to the east exit. Not the west exit.' },
      { speaker: 'gojo', furigana: '[東|ひがし]は　どっちですか。', en: 'Which way is east?' },
      { speaker: 'nami', furigana: '……[五|ご][百|ひゃく][円|えん]です。', en: '...That’ll be 500 yen.' },
      { speaker: 'gojo', furigana: '[何|なん]の　[五|ご][百|ひゃく][円|えん]ですか。', en: 'Five hundred yen for what?' },
      { speaker: 'nami', furigana: 'ちずです。', en: 'A map.' }
    ],
    remixes: [
      { scene: 'Nami tells Gojo where the station is.', en: 'The station is across the bridge.',
        chunks: ['えきは', 'はしの', 'むこうです。', 'むこうを'], answer: ['えきは', 'はしの', 'むこうです。'],
        explain: 'の links the two nouns: はしの むこう, "the far side of the bridge". を marks an object and cannot end this sentence.' },
      { scene: 'Nami says where the shop is.', en: 'It is next to the east exit.',
        chunks: ['ひがしの', 'でぐちの', 'よこです。', 'ひがしに'], answer: ['ひがしの', 'でぐちの', 'よこです。'],
        explain: 'の chains the places: ひがしの でぐちの よこ, "beside the east exit". ひがしに would break the chain.' }
    ],
    names: ['ナミ', 'ゴジョウ'],
    uses: ['g:wa-desu', 'g:ni', 'g:no', 'g:yo', 'g:ka', 'g:ja-nai', 'g:adj-i', 'v:この|この', 'v:辺|へん', 'v:駅|えき', 'v:ある|ある', 'v:北|きた', 'v:あの|あの', 'v:橋|はし', 'v:向こう|むこう', 'v:どっち|どっち', 'v:あっち|あっち', 'v:近く|ちかく', 'v:おいしい|おいしい', 'v:店|みせ', 'v:東|ひがし', 'v:出口|でぐち', 'v:横|よこ', 'v:西|にし', 'v:五|ご', 'v:百|ひゃく', 'v:円|えん', 'v:何|なん', 'v:地図|ちず', 'k:北', 'k:東', 'k:西', 'k:五', 'k:百', 'k:円', 'k:何'],
    verified: true }),

  L({ id: 'l:n5-dlg-chore-day', format: 'dialogue',
    title: 'Chore day', goal: 'You can say what you have to do, casually, with 〜なくちゃ.',
    scene: 'Saturday at home. Kakashi, who looks after Killua, says it is time to clean. His books are everywhere, and Killua is very fast.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Guardian' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Child' } },
    lines: [
      { speaker: 'kakashi', furigana: 'きょうは　せんたくと　そうじを　しなくちゃ　いけません。', en: 'Today we have to do the laundry and the cleaning.' },
      { speaker: 'killua', furigana: '……いま？', en: '...Now?' },
      { speaker: 'kakashi', furigana: 'いまです。この　へやは　きたないですから。', en: 'Now. This room is dirty.' },
      { speaker: 'killua', furigana: 'きたない　ものは　[先生|せんせい]の　[本|ほん]。', en: 'The mess is your books.' },
      { speaker: 'kakashi', furigana: '……[本|ほん]は　わたしが　ならべます。キルアさんは　せんたくを　して　ください。', en: '...I’ll line up the books. You do the laundry, please.' },
      { speaker: 'killua', furigana: 'もう　おわりました。[先生|せんせい]は？', en: 'Done already. And you?' },
      { speaker: 'kakashi', furigana: '……ちょっと　まって　ください。', en: '...Wait a moment.' },
      { speaker: 'killua', furigana: '[先生|せんせい]、[本|ほん]を　[読|よ]まないで　ください。ならべなくちゃ。', en: 'Sensei, don’t read the books. You have to line them up.' }
    ],
    remixes: [
      { scene: 'Kakashi says the first chore again.', en: 'We have to do the laundry.',
        chunks: ['せんたくを', 'しなくちゃ', 'いけません。', 'すなくちゃ'], answer: ['せんたくを', 'しなくちゃ', 'いけません。'],
        explain: 'する is irregular: its ない-form is しない, so しなくちゃ. すなくちゃ is not a form.' },
      { scene: 'Killua tells Kakashi what the books need.', en: 'You have to line up the books.',
        chunks: ['ほんを', 'ならべなくちゃ', 'いけません。', 'ならばなくちゃ'], answer: ['ほんを', 'ならべなくちゃ', 'いけません。'],
        explain: 'ならべる is a る-verb: drop る, ならべない, so ならべなくちゃ. ならばなくちゃ treats it like an う-verb.' }
    ],
    names: ['カカシ', 'キルア'],
    uses: ['g:nakucha-ikenai', 'g:nai-form', 'g:nai-de-kudasai', 'g:te-kudasai', 'g:te-form', 'g:to', 'g:wo', 'g:wa-desu', 'g:no', 'g:ga', 'g:kara', 'g:mou', 'g:mashita', 'g:masu', 'g:adj-i', 'v:さん|さん', 'v:今日|きょう', 'v:洗濯|せんたく', 'v:掃除|そうじ', 'v:する|する', 'v:今|いま', 'v:この|この', 'v:部屋|へや', 'v:汚い|きたない', 'v:物|もの', 'v:先生|せんせい', 'v:本|ほん', 'v:私|わたし', 'v:並べる|ならべる', 'v:ください|ください', 'v:もう|もう', 'v:終わる|おわる', 'v:ちょっと|ちょっと', 'v:待つ|まつ', 'v:読む|よむ', 'k:先', 'k:生', 'k:本', 'k:読'],
    verified: true }),

  L({ id: 'l:n5-dlg-free-time', format: 'dialogue',
    title: 'What do you like doing?', goal: 'You can say what you like doing with 〜のが好きです.',
    scene: 'At a cafe, Hinata asks Lelouch about his free time. Hinata already knows his own answer.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'hinata', furigana: 'ルルーシュさん！　やすみは　[何|なに]を　するのが　すきですか？', en: 'Lelouch! What do you like doing on your days off?' },
      { speaker: 'lelouch', furigana: '[本|ほん]や　しんぶんを　[読|よ]むのが　すきです。ざっしも　[読|よ]みます。', en: 'I like reading books and newspapers. I read magazines too.' },
      { speaker: 'hinata', furigana: 'わたしは　バレーボールを　するのが　すきです！', en: 'I like playing volleyball!' },
      { speaker: 'lelouch', furigana: '……まいにち　[聞|き]いて　います。', en: '...I hear about it every day.' },
      { speaker: 'hinata', furigana: 'ルルーシュさんは　スポーツは？', en: 'And you, Lelouch? Sports?' },
      { speaker: 'lelouch', furigana: '[見|み]るのは　すきです。', en: 'I like watching them.' },
      { speaker: 'hinata', furigana: 'あした、[見|み]に　[来|き]ませんか！', en: 'Won’t you come and watch tomorrow?!' },
      { speaker: 'lelouch', furigana: '[見|み]に　[行|い]きます。チェスの　[本|ほん]を　もって。', en: 'I’ll come and watch. With a chess book.' }
    ],
    bridge: [
      { text: 'バレーボール', gloss: 'バレーボール = volleyball' },
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Lelouch says what he likes.', en: 'I like reading newspapers.',
        chunks: ['しんぶんを', 'よむのが', 'すきです。', 'よむが'], answer: ['しんぶんを', 'よむのが', 'すきです。'],
        explain: 'の turns よむ into a thing you can like: よむの. Without の, よむが cannot go with すき.' },
      { scene: 'Hinata asks Lelouch again.', en: 'What do you like doing?',
        chunks: ['なにを', 'するのが', 'すきですか？', 'なにが'], answer: ['なにを', 'するのが', 'すきですか？'],
        explain: 'を marks what you do: なにを する. が already comes after の, so なにが has no place here.' }
    ],
    names: ['ヒナタ', 'ルルーシュ'],
    uses: ['g:no-ga-suki', 'g:wa-desu', 'g:ka', 'g:wo', 'g:ya', 'g:mo', 'g:te-iru', 'g:te-form', 'g:masen-ka', 'g:ni-iku', 'g:no', 'g:masu', 'v:さん|さん', 'v:休み|やすみ', 'v:何|なに', 'v:する|する', 'v:好き|すき', 'v:本|ほん', 'v:新聞|しんぶん', 'v:読む|よむ', 'v:雑誌|ざっし', 'v:私|わたし', 'v:毎日|まいにち', 'v:聞く|きく', 'v:スポーツ|スポーツ', 'v:見る|みる', 'v:明日|あした', 'v:来る|くる', 'v:行く|いく', 'v:持つ|もつ', 'k:何', 'k:本', 'k:読', 'k:聞', 'k:見', 'k:来', 'k:行'],
    notes: 'バレーボール and チェス are not on the N5 list: bridges only.',
    verified: true }),

  L({ id: 'l:n5-dlg-sports-club', format: 'dialogue',
    title: 'Who is that?', goal: 'You can say who is good at what with 〜のが上手です.',
    scene: 'At the sports club, Emilia and Sakura watch the others train. Gojo-sensei is training too.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Friend' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'サクラさんは　はしるのが　とても　じょうずです！', en: 'Sakura, you’re really good at running!' },
      { speaker: 'sakura', furigana: 'ありがとう！　エミリアさんは　およぐのが　じょうずですよ。', en: 'Thanks! And you’re good at swimming, Emilia.' },
      { speaker: 'emilia', furigana: 'あの　せが　[高|たか]い　[人|ひと]は？', en: 'Who’s that tall person?' },
      { speaker: 'sakura', furigana: 'サスケさんです。はしるのも　およぐのも　じょうずです。', en: 'That’s Sasuke. He’s good at running and at swimming.' },
      { speaker: 'emilia', furigana: 'あの　せが　ひくい　[人|ひと]は？', en: 'And that short person?' },
      { speaker: 'sakura', furigana: 'ヒナタさんです。ちびですよ。ゆめは　ちいさな　きょじんです！', en: 'That’s Hinata. He’s a shorty. His dream is to be the Little Giant!', say: 'ヒナタさんです。ちびですよ。夢は小さな巨人です！' },
      { speaker: 'emilia', furigana: 'いちばん　つよい　[人|ひと]は　だれですか。', en: 'Who is the strongest?' },
      { speaker: 'sakura', furigana: 'ゴジョウ[先生|せんせい]です！', en: 'Gojo-sensei!' },
      { speaker: 'emilia', furigana: 'ゴジョウ[先生|せんせい]は　からだが　ほそいですよ？', en: 'But Gojo-sensei is so slim?' },
      { speaker: 'sakura', furigana: 'ほそい　[人|ひと]も　つよいですよ！', en: 'Slim people can be strong too!' }
    ],
    remixes: [
      { scene: 'Emilia praises Sakura again.', en: 'Sakura is good at running.',
        chunks: ['サクラさんは', 'はしるのが', 'じょうずです。', 'はしるのを'], answer: ['サクラさんは', 'はしるのが', 'じょうずです。'],
        explain: 'じょうず takes が: はしるのが じょうずです. を marks the object of a verb, and じょうず is not a verb.' },
      { scene: 'Sakura points out Sasuke.', en: 'That tall person is Sasuke.',
        chunks: ['あの', 'せが', 'たかい', 'ひとは', 'サスケさんです。', 'せを'], answer: ['あの', 'せが', 'たかい', 'ひとは', 'サスケさんです。'],
        explain: 'せが たかい means "tall" (the height is high). を cannot go with an adjective like たかい.' }
    ],
    bridge: [
      { text: 'ちび', gloss: 'ちび = shorty, a small person (casual and teasing: only about a friend)' },
      { text: 'ゆめ', gloss: 'ゆめ = dream' },
      { text: 'ちいさな　きょじん', gloss: 'ちいさな きょじん (小さな巨人) = the Little Giant, the short volleyball star Hinata wants to be. ちいさな = small, きょじん = giant' }
    ],
    names: ['サクラ', 'エミリア', 'サスケ', 'ヒナタ', 'ゴジョウ'],
    uses: ['g:no-ga-jouzu', 'g:wa-desu', 'g:ga', 'g:yo', 'g:mo', 'g:ka', 'g:adj-i', 'g:totemo', 'v:さん|さん', 'v:走る|はしる', 'v:とても|とても', 'v:上手|じょうず', 'v:泳ぐ|およぐ', 'v:あの|あの', 'v:背|せ', 'v:高い|たかい', 'v:人|ひと', 'v:低い|ひくい', 'v:いちばん|いちばん', 'v:強い|つよい', 'v:誰|だれ', 'v:先生|せんせい', 'v:体|からだ', 'v:細い|ほそい', 'k:高', 'k:人', 'k:先', 'k:生'],
    notes: 'ちび, ゆめ and ちいさな きょじん (Hinata’s goal, the Little Giant) are bridges only: not taught at this stage.',
    verified: true }),

  L({ id: 'l:n5-dlg-karaoke', format: 'dialogue',
    title: 'Karaoke night', goal: 'You can say what someone is bad at with 〜のが下手です.',
    scene: 'An evening off at karaoke. Two teachers, Gojo and Kakashi, are not at work for once.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Friend' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'gojo', furigana: 'きょうは　しごとが　ありません！　カカシ[先生|せんせい]、うたいましょう！', en: 'No work today! Kakashi-sensei, let’s sing!' },
      { speaker: 'kakashi', furigana: '……わたしは　うたうのが　へたです。', en: '...I’m bad at singing.' },
      { speaker: 'gojo', furigana: 'わたしは　うたうのが　じょうずですよ！　[聞|き]いて　ください！', en: 'I’m good at singing! Listen!' },
      { speaker: 'kakashi', furigana: '……[大|おお]きな　こえです。', en: '...That’s a big voice.' },
      { speaker: 'gojo', furigana: 'つぎは　カカシ[先生|せんせい]です！　この　あかい　ボタンを　おして　ください。', en: 'You’re next, Kakashi-sensei! Press this red button.' },
      { speaker: 'kakashi', furigana: '……[小|ちい]さな　こえで　うたいます。', en: '...I’ll sing in a small voice.' },
      { speaker: 'gojo', furigana: 'ほんとうに　うたうのが　へたですね！', en: 'You really are bad at singing!' },
      { speaker: 'kakashi', furigana: '……ゴジョウ[先生|せんせい]は　[聞|き]くのが　へたです。', en: '...And you’re bad at listening, Gojo-sensei.' },
      { speaker: 'gojo', furigana: 'いっしょに　うたいましょう！', en: 'Let’s sing together!' }
    ],
    remixes: [
      { scene: 'Kakashi says it once more.', en: 'I am bad at singing.',
        chunks: ['わたしは', 'うたうのが', 'へたです。', 'うたいのが'], answer: ['わたしは', 'うたうのが', 'へたです。'],
        explain: 'Before の the verb stays in the dictionary form: うたうの. うたい is only a stem and cannot take の.' },
      { scene: 'Kakashi fires back at Gojo.', en: 'Gojo-sensei is bad at listening.',
        chunks: ['ゴジョウせんせいは', 'きくのが', 'へたです。', 'きくのに'], answer: ['ゴジョウせんせいは', 'きくのが', 'へたです。'],
        explain: 'へた takes が, like すき and じょうず: きくのが へたです. に does not go with へた here.' }
    ],
    names: ['ゴジョウ', 'カカシ'],
    uses: ['g:no-ga-heta', 'g:no-ga-jouzu', 'g:ga', 'g:ga-arimasu', 'g:mashou', 'g:wa-desu', 'g:yo', 'g:te-kudasai', 'g:te-form', 'g:de', 'g:wo', 'g:ne', 'g:ni', 'g:masu', 'g:adj-i', 'v:今日|きょう', 'v:仕事|しごと', 'v:ある|ある', 'v:歌う|うたう', 'v:私|わたし', 'v:下手|へた', 'v:上手|じょうず', 'v:聞く|きく', 'v:ください|ください', 'v:大きな|おおきな', 'v:声|こえ', 'v:次|つぎ', 'v:この|この', 'v:赤い|あかい', 'v:ボタン|ボタン', 'v:押す|おす', 'v:小さな|ちいさな', 'v:ほんとう|ほんとう', 'v:一緒|いっしょ', 'v:先生|せんせい', 'k:聞', 'k:大', 'k:小', 'k:先', 'k:生'],
    verified: true }),

  // ── dialogues: stages 85-104 ──
  L({ id: 'l:n5-dlg-warm-jacket', format: 'dialogue',
    title: 'A warm jacket', goal: 'You can say what you do before something with 〜前に.',
    scene: 'Frieren comes into a clothes shop before winter. Nami works there and likes a big sale.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Shop assistant' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'nami', furigana: 'あたらしい　ふくが　たくさん　ありますよ！　ワイシャツも　せびろも！', en: 'Lots of new clothes in! Shirts, suits, everything!' },
      { speaker: 'frieren', furigana: '……ふゆの　[前|まえ]に、あたたかい　うわぎが　ほしいです。', en: '...I’d like a warm jacket before winter.' },
      { speaker: 'nami', furigana: 'これは　どうですか？　[一|いち][万|まん][円|えん]です。', en: 'How about this one? Ten thousand yen.' },
      { speaker: 'frieren', furigana: '……かう　[前|まえ]に、きても　いいですか。', en: '...May I try it on before I buy it?' },
      { speaker: 'nami', furigana: 'どうぞ。……その　ふくは　ふるいですね。セーターも　ズボンも　ありますよ！', en: 'Go ahead. ...Your clothes are old, aren’t they? We have sweaters and trousers too!' },
      { speaker: 'frieren', furigana: '……この　ふくは　[百|ひゃく][年|ねん][前|まえ]に　かいました。', en: '...I bought these a hundred years ago.' },
      { speaker: 'nami', furigana: '[百|ひゃく][年|ねん]！？', en: 'A hundred years?!' },
      { speaker: 'frieren', furigana: '……あたたかいです。この　うわぎを　ください。[百|ひゃく][年|ねん]　きます。', en: '...It’s warm. I’ll take this jacket. I’ll wear it for a hundred years.' }
    ],
    bridge: [
      { text: '年', id: 'v:年|ねん', gloss: '年 (ねん) = year, as a counter: ひゃくねん = a hundred years (taught later)' }
    ],
    remixes: [
      { scene: 'Frieren says what she came for.', en: 'I want a jacket before winter.',
        chunks: ['ふゆの', 'まえに', 'うわぎが', 'ほしいです。', 'なつの'], answer: ['ふゆの', 'まえに', 'うわぎが', 'ほしいです。'],
        explain: 'A noun takes の before まえに: ふゆの まえに, "before winter". なつの would make it before summer.' },
      { scene: 'Frieren asks before she pays.', en: 'May I try it on before I buy it?',
        chunks: ['かう', 'まえに', 'きても', 'いいですか。', 'きては'], answer: ['かう', 'まえに', 'きても', 'いいですか。'],
        explain: 'A verb stays in the dictionary form before まえに: かう まえに. 〜ても いいですか asks permission; きては goes with いけません, "you must not wear it".' }
    ],
    names: ['ナミ', 'フリーレン'],
    uses: ['g:mae-ni', 'g:ga', 'g:yo', 'g:mo', 'g:no', 'g:wa-desu', 'g:ka', 'g:te-mo-ii', 'g:te-form', 'g:ne', 'g:wo', 'g:mashita', 'g:masu', 'g:adj-i', 'v:新しい|あたらしい', 'v:服|ふく', 'v:たくさん|たくさん', 'v:ある|ある', 'v:ワイシャツ|ワイシャツ', 'v:背広|せびろ', 'v:冬|ふゆ', 'v:前|まえ', 'v:暖かい|あたたかい', 'v:上着|うわぎ', 'v:欲しい|ほしい', 'v:これ|これ', 'v:どう|どう', 'v:一|いち', 'v:万|まん', 'v:円|えん', 'v:買う|かう', 'v:着る|きる', 'v:いい|いい', 'v:どうぞ|どうぞ', 'v:その|その', 'v:古い|ふるい', 'v:セーター|セーター', 'v:ズボン|ズボン', 'v:この|この', 'v:百|ひゃく', 'v:年|ねん', 'v:ください|ください', 'k:前', 'k:一', 'k:万', 'k:円', 'k:百', 'k:年'],
    verified: true }),

  L({ id: 'l:n5-dlg-papas-glasses', format: 'dialogue',
    title: 'Papa’s glasses', goal: 'You can say what you did, casually, with the た-form.',
    scene: 'Anya comes home. At the entrance, Yor checks that she has changed into her slippers. Anya is wearing a few things of Papa’s.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'くつを　ぬぎましたか？', en: 'Did you take your shoes off?' },
      { speaker: 'anya', furigana: 'ぬいだ！　スリッパも　はいた！', en: 'Took them off! Put my slippers on too!' },
      { speaker: 'yor', furigana: 'その　ぼうしと　めがねは　おとうさんのですか？', en: 'Are that hat and those glasses Papa’s?' },
      { speaker: 'anya', furigana: 'ちちの！　アーニャ、かぶった！　かけた！', en: 'Papa’s! Anya put it on! Put them on!' },
      { speaker: 'yor', furigana: 'めがねを　かけて　[外|そと]へ　[行|い]きましたか？', en: 'Did you go outside with the glasses on?' },
      { speaker: 'anya', furigana: '[行|い]った！　……ちょっと　あたまが　いたい。', en: 'Went! ...My head hurts a little.' },
      { speaker: 'yor', furigana: 'めがねを　とって、ぼうしも　ぬいで　ください。', en: 'Take off the glasses, and the hat too, please.' },
      { speaker: 'anya', furigana: 'とった！　ぬいだ！', en: 'Took them off! Took it off!' },
      { speaker: 'yor', furigana: 'てを　あらいましたか？', en: 'Did you wash your hands?' },
      { speaker: 'anya', furigana: 'まだ！', en: 'Not yet!' }
    ],
    remixes: [
      { scene: 'Anya reports on her shoes.', en: 'I took off my shoes!',
        chunks: ['くつを', 'ぬいだ！', 'ぬぎた！'], answer: ['くつを', 'ぬいだ！'],
        explain: 'ぬぐ ends in ぐ, so its た-form is ぬいだ (ぐ → いだ), like its て-form ぬいで. ぬぎた is not a form.' },
      { scene: 'Anya tells Yor where she went.', en: 'Anya went outside!',
        chunks: ['アーニャ、', 'そとへ', 'いった！', 'いきた！'], answer: ['アーニャ、', 'そとへ', 'いった！'],
        explain: 'いく is the one exception: its た-form is いった, like its て-form いって. いきた is not a form.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:ta-form', 'g:wo', 'g:mashita', 'g:ka', 'g:mo', 'g:to', 'g:no', 'g:wa-desu', 'g:te-form', 'g:te-kudasai', 'g:ni-ikimasu', 'g:ga', 'g:mada', 'v:靴|くつ', 'v:脱ぐ|ぬぐ', 'v:スリッパ|スリッパ', 'v:はく|はく', 'v:その|その', 'v:帽子|ぼうし', 'v:眼鏡|めがね', 'v:お父さん|おとうさん', 'v:父|ちち', 'v:かぶる|かぶる', 'v:かける|かける', 'v:外|そと', 'v:行く|いく', 'v:ちょっと|ちょっと', 'v:頭|あたま', 'v:痛い|いたい', 'v:取る|とる', 'v:ください|ください', 'v:手|て', 'v:洗う|あらう', 'v:まだ|まだ', 'k:外', 'k:行'],
    verified: true }),

  L({ id: 'l:n5-dlg-first-flight', format: 'dialogue',
    title: 'A first flight', goal: 'You can ask and say whether you have ever done something with 〜たことがある.',
    scene: 'At a cafe, Nami shows her friend Lelouch a plane ticket. She has always travelled by ship.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'nami', furigana: '[見|み]て！　ひこうきの　きっぷ！　らいしゅう、[外国|がいこく]へ　[行|い]く！', en: 'Look! A plane ticket! I’m going abroad next week!' },
      { speaker: 'lelouch', furigana: '……ナミは　ひこうきに　のった　ことが　ある？', en: '...Have you ever been on a plane, Nami?' },
      { speaker: 'nami', furigana: 'ない！　はじめて！　ルルーシュは　のった　ことが　ある？', en: 'Never! It’s my first time! Have you ever been on one, Lelouch?' },
      { speaker: 'lelouch', furigana: 'ある。りゅうがくせいの　とき、ひこうきで　[来|き]た。', en: 'I have. When I was an exchange student, I came by plane.', say: 'ある。留学生のとき、飛行機で来た。' },
      { speaker: 'nami', furigana: 'ひこうきの　なかで　[何|なに]を　した？', en: 'What did you do on the plane?' },
      { speaker: 'lelouch', furigana: '……ねた。たいしかんへ　[行|い]った　ことは　ある？', en: '...Slept. Have you ever been to the embassy?' },
      { speaker: 'nami', furigana: 'ない。どうして？', en: 'No. Why?' },
      { speaker: 'lelouch', furigana: 'その　[国|くに]へ　[行|い]く　[前|まえ]に、たいしかんへ　[行|い]かなくちゃ。', en: 'Before you go to that country, you have to go to the embassy.' },
      { speaker: 'nami', furigana: '[今|いま]から　[行|い]く！', en: 'I’m going right now!' }
    ],
    remixes: [
      { scene: 'Nami answers Lelouch.', en: 'I have never been on a plane.',
        chunks: ['ひこうきに', 'のった', 'ことが', 'ない。', 'ある。'], answer: ['ひこうきに', 'のった', 'ことが', 'ない。'],
        explain: 'た-form + ことが ない = "have never done it". ある would say she has.' },
      { scene: 'Lelouch asks about the embassy.', en: 'Have you ever been to the embassy?',
        chunks: ['たいしかんへ', 'いった', 'ことが', 'ある？', 'いく'], answer: ['たいしかんへ', 'いった', 'ことが', 'ある？'],
        explain: 'Experience takes the た-form: いった ことが ある. With the dictionary form, いく ことが ある means "I sometimes go".' }
    ],
    names: ['ナミ', 'ルルーシュ'],
    uses: ['g:ta-koto-ga-aru', 'g:ta-form', 'g:te-form', 'g:verb-groups-dict', 'g:no', 'g:ni-ikimasu', 'g:ni', 'g:de', 'g:wo', 'g:mae-ni', 'g:nakucha-ikenai', 'v:見る|みる', 'v:飛行機|ひこうき', 'v:切符|きっぷ', 'v:来週|らいしゅう', 'v:外国|がいこく', 'v:行く|いく', 'v:乗る|のる', 'v:ある|ある', 'v:ない|ない', 'v:初めて|はじめて', 'v:留学生|りゅうがくせい', 'v:時|とき', 'v:来る|くる', 'v:中|なか', 'v:何|なに', 'v:する|する', 'v:寝る|ねる', 'v:大使館|たいしかん', 'v:どうして|どうして', 'v:その|その', 'v:国|くに', 'v:前|まえ', 'v:今|いま', 'k:見', 'k:外', 'k:国', 'k:行', 'k:来', 'k:何', 'k:前', 'k:今'],
    verified: true }),

  L({ id: 'l:n5-dlg-spring-picnic', format: 'dialogue',
    title: 'Spring picnic', goal: 'You can list things you do with 〜たり〜たりする.',
    scene: 'A sunny spring day in the park. Sakura has plans for the whole day; Sasuke has one plan.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'はなが　たくさん　さいて　いる！', en: 'So many flowers are out!' },
      { speaker: 'sasuke', furigana: '……はれて　よかった。', en: '...Good thing it cleared up.' },
      { speaker: 'sakura', furigana: 'きょうは　いけの　そばを　あるいたり、とりを　[見|み]たり　したい！', en: 'Today I want to walk by the pond, watch the birds, things like that!' },
      { speaker: 'sasuke', furigana: '……[木|き]の　したで　ねたり、そらを　[見|み]たり　したい。', en: '...I want to sleep under a tree, look at the sky, things like that.' },
      { speaker: 'sakura', furigana: 'サスケくん！　いっしょに　あるいて！', en: 'Sasuke-kun! Walk with me!' },
      { speaker: 'sasuke', furigana: '……おべんとうの　あとで。', en: '...After lunch.' },
      { speaker: 'sakura', furigana: 'おべんとうに　トマトを　いれたよ。', en: 'I put tomatoes in the lunch.' },
      { speaker: 'sasuke', furigana: '……[今|いま]　[食|た]べて、あるく。', en: '...We eat now, then we walk.' },
      { speaker: 'sakura', furigana: 'やった！', en: 'Yes!' }
    ],
    bridge: [
      { text: 'くん', ctx: 'サスケくん', gloss: 'くん = a friendly name ending for a boy: Sakura always calls him サスケくん' },
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Sakura plans the day.', en: 'I want to walk, watch the birds, things like that!',
        chunks: ['あるいたり、', 'とりを', 'みたり', 'したい！', 'みて'], answer: ['あるいたり、', 'とりを', 'みたり', 'したい！'],
        explain: 'In a たり list every verb takes たり, and する closes the list: みたり したい. みて would link to a next step that never comes.' },
      { scene: 'Sasuke picks his spot.', en: 'I want to sleep under a tree.',
        chunks: ['きの', 'したで', 'ねたい。', 'うえで'], answer: ['きの', 'したで', 'ねたい。'],
        explain: 'した is "under": きの したで. うえで would put Sasuke up in the tree.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:tari-tari', 'g:te-form', 'g:te-iru', 'g:ta-form', 'g:verb-groups-dict', 'g:ga', 'g:adj-i', 'g:no', 'g:wo', 'g:de', 'g:tai', 'g:ni', 'g:yo', 'v:見る|みる', 'v:花|はな', 'v:たくさん|たくさん', 'v:咲く|さく', 'v:晴れる|はれる', 'v:よい|よい', 'v:今日|きょう', 'v:池|いけ', 'v:そば|そば', 'v:歩く|あるく', 'v:鳥|とり', 'v:する|する', 'v:木|き', 'v:下|した', 'v:寝る|ねる', 'v:空|そら', 'v:一緒|いっしょ', 'v:お弁当|おべんとう', 'v:後|あと', 'v:入れる|いれる', 'v:今|いま', 'v:食べる|たべる', 'v:やる|やる', 'k:見', 'k:木', 'k:今', 'k:食'],
    notes: 'トマト is not on the N5 list: a bridge only. くん is a name ending, not on the list: a bridge (owner rule: in plain-form couple scenes Sakura says サスケくん).',
    verified: true }),

  L({ id: 'l:n5-dlg-rain-coming', format: 'dialogue',
    title: 'Rain coming', goal: 'You can say how things change with 〜くなる and 〜になる.',
    scene: 'Late afternoon in the park. Emilia and Killua are out playing when the weather turns.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'そらが　だんだん　くらく　なって　いる。', en: 'The sky is getting darker and darker.' },
      { speaker: 'killua', furigana: 'まだ　ゆうがた。まだ　あそびたい。', en: 'It’s only evening. I still want to play.' },
      { speaker: 'emilia', furigana: 'かぜも　つよく　なった。さむい……。', en: 'The wind has got stronger too. I’m cold...' },
      { speaker: 'killua', furigana: 'さむくない。', en: 'I’m not cold.' },
      { speaker: 'emilia', furigana: '[雨|あめ]に　なった！', en: 'Now it’s raining!' },
      { speaker: 'killua', furigana: '……かさ、ない。', en: '...No umbrella.' },
      { speaker: 'emilia', furigana: 'かえらなくちゃ！　かぜを　ひくよ！', en: 'We have to go home! You’ll catch a cold!', say: '帰らなくちゃ！風邪を引くよ！' },
      { speaker: 'killua', furigana: 'かぜは　ひかない。', en: 'I don’t catch colds.', say: '風邪は引かない。' },
      { speaker: 'emilia', furigana: 'わたしは　ひく！', en: 'Well, I do!' },
      { speaker: 'killua', furigana: 'わかった。かえる。', en: 'Okay. We’re going home.' }
    ],
    unmark: [{ text: 'かぜ', ctx: 'かぜをひく' }, { text: 'かぜ', ctx: 'かぜはひか' }],
    remixes: [
      { scene: 'Emilia feels the wind.', en: 'The wind has got stronger too.',
        chunks: ['かぜも', 'つよく', 'なった。', 'つよい'], answer: ['かぜも', 'つよく', 'なった。'],
        explain: 'An い-adjective drops い and takes く before なる: つよい → つよく なった. つよい なった is not said.' },
      { scene: 'Emilia sees the rain start.', en: 'It turned to rain!',
        chunks: ['あめに', 'なった！', 'あめが'], answer: ['あめに', 'なった！'],
        explain: 'A noun takes に before なる: あめに なった, "it turned to rain". あめが なった is not said.' }
    ],
    names: ['エミリア', 'キルア'],
    uses: ['g:naru', 'g:ga', 'g:te-iru', 'g:te-form', 'g:mada', 'g:tai', 'g:mo', 'g:ta-form', 'g:adj-i', 'g:nakucha-ikenai', 'g:nai-form', 'g:wo', 'g:yo', 'g:ni', 'v:空|そら', 'v:だんだん|だんだん', 'v:暗い|くらい', 'v:なる|なる', 'v:まだ|まだ', 'v:夕方|ゆうがた', 'v:遊ぶ|あそぶ', 'v:風|かぜ', 'v:強い|つよい', 'v:寒い|さむい', 'v:雨|あめ', 'v:傘|かさ', 'v:ない|ない', 'v:帰る|かえる', 'v:風邪|かぜ', 'v:引く|ひく', 'v:私|わたし', 'v:分かる|わかる', 'k:雨'],
    verified: true }),

  L({ id: 'l:n5-dlg-bread-spell', format: 'dialogue',
    title: 'Just coffee', goal: 'You can say "only" with だけ and count flat things with まい.',
    scene: 'Frieren sits down with a book in the cafe where Sanji cooks.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'sanji', furigana: '[何|なに]を　のみますか？', en: 'What would you like to drink?' },
      { speaker: 'frieren', furigana: '……コーヒーを　ください。', en: '...Coffee, please.' },
      { speaker: 'sanji', furigana: 'パンも　ありますよ。けさ　わたしが　つくりました！', en: 'We have bread too. I made it this morning!' },
      { speaker: 'frieren', furigana: '……コーヒーだけで　いいです。', en: '...Just coffee is fine.' },
      { speaker: 'sanji', furigana: '[何|なん]の　[本|ほん]を　[読|よ]んで　いますか？', en: 'What are you reading?' },
      { speaker: 'frieren', furigana: '……パンを　つくる　まほうの　[本|ほん]です。', en: '...A book of spells for making bread.' },
      { speaker: 'sanji', furigana: 'まほうで　パンを！？', en: 'Bread, with magic?!' },
      { speaker: 'frieren', furigana: '……まほうの　パンは　まずいです。サンジさんの　パンを　[一|いち]まい　ください。', en: '...Magic bread tastes awful. One slice of your bread, please, Sanji.' },
      { speaker: 'sanji', furigana: '[一|いち]まいだけですか？', en: 'Just one slice?' },
      { speaker: 'frieren', furigana: '……[二|に]まい。', en: '...Two.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Frieren turns down the bread.', en: 'Just that is fine.',
        chunks: ['それ', 'だけで', 'いいです。', 'も'], answer: ['それ', 'だけで', 'いいです。'],
        explain: 'だけ means "only": それだけで いいです, "just that is fine". With も, それも いいです means "that is fine too".' },
      { scene: 'Sanji checks the order.', en: 'Just one slice?',
        chunks: ['いちまい', 'だけですか？', 'いっさつ'], answer: ['いちまい', 'だけですか？'],
        explain: 'まい counts flat things, like slices of bread: いちまい. さつ counts books: いっさつ is one book.' }
    ],
    names: ['サンジ', 'フリーレン'],
    uses: ['g:dake', 'g:wo', 'g:ka', 'g:mo', 'g:yo', 'g:ga', 'g:mashita', 'g:de', 'g:wa-desu', 'g:no', 'g:te-iru', 'g:te-form', 'g:masu', 'g:verb-groups-dict', 'v:何|なに', 'v:何|なん', 'v:飲む|のむ', 'v:コーヒー|コーヒー', 'v:ください|ください', 'v:パン|パン', 'v:ある|ある', 'v:今朝|けさ', 'v:私|わたし', 'v:作る|つくる', 'v:だけ|だけ', 'v:いい|いい', 'v:本|ほん', 'v:読む|よむ', 'v:まずい|まずい', 'v:さん|さん', 'v:一|いち', 'v:枚|まい', 'v:二|に', 'k:何', 'k:本', 'k:読', 'k:一', 'k:二'],
    notes: 'まほう is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-tangerines', format: 'dialogue',
    title: 'Two or ten?', goal: 'You can offer a choice with 〜か〜か and count with ひとつ, ふたつ.',
    scene: 'Hinata stops at a fruit stall. Nami is selling her own tangerines.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Customer' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Seller' } },
    lines: [
      { speaker: 'hinata', furigana: 'その　くだものを　ください！', en: 'I’ll have some of that fruit!' },
      { speaker: 'nami', furigana: 'みかんですね。いくつですか？', en: 'Tangerines? How many?' },
      { speaker: 'hinata', furigana: 'ふたつか　みっつか……。', en: 'Two or three...' },
      { speaker: 'nami', furigana: 'とおは　どうですか？', en: 'How about ten?' },
      { speaker: 'hinata', furigana: 'とお！？', en: 'Ten?!' },
      { speaker: 'nami', furigana: 'とおで　[千|せん][円|えん]です。やすいですよ！', en: 'A thousand yen for ten. It’s a bargain!' },
      { speaker: 'hinata', furigana: 'ひとつ　いくらですか？', en: 'How much for one?' },
      { speaker: 'nami', furigana: '[二|に][百|ひゃく][円|えん]です。……ふたつか　とおか、どちらですか？', en: 'Two hundred yen. ...Two or ten: which is it?' },
      { speaker: 'hinata', furigana: 'とお　ください！', en: 'Ten, please!' }
    ],
    bridge: [
      { text: 'みかん', gloss: 'みかん = a mandarin orange, a tangerine' }
    ],
    remixes: [
      { scene: 'Nami asks Hinata to choose.', en: 'Two or ten: which is it?',
        chunks: ['ふたつか', 'とおか、', 'どちらですか？', 'とおと、'], answer: ['ふたつか', 'とおか、', 'どちらですか？'],
        explain: 'In 〜か〜か each choice ends in か: ふたつか とおか. と joins things ("two and ten") and cannot offer a choice.' },
      { scene: 'Hinata asks the price.', en: 'How much is one?',
        chunks: ['ひとつ', 'いくらですか？', 'いくつですか？'], answer: ['ひとつ', 'いくらですか？'],
        explain: 'いくら asks the price. いくつ asks how many.' }
    ],
    names: ['ヒナタ', 'ナミ'],
    uses: ['g:ka-ka', 'g:wo', 'g:ne', 'g:wa-desu', 'g:ka', 'g:de', 'g:yo', 'g:adj-i', 'v:その|その', 'v:果物|くだもの', 'v:ください|ください', 'v:いくつ|いくつ', 'v:二つ|ふたつ', 'v:三つ|みっつ', 'v:十|とお', 'v:どう|どう', 'v:千|せん', 'v:円|えん', 'v:安い|やすい', 'v:一つ|ひとつ', 'v:いくら|いくら', 'v:二|に', 'v:百|ひゃく', 'v:どちら|どちら', 'k:千', 'k:円', 'k:二', 'k:百'],
    notes: 'みかん is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-stomach-medicine', format: 'dialogue',
    title: 'Three times a day', goal: 'You can talk about amounts and how often: キロ, グラム, 〜ど, ずつ.',
    scene: 'At the pharmacy, Sakura asks for medicine for a friend. The pharmacist, Maomao, tests her medicines on herself.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Customer' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' } },
    lines: [
      { speaker: 'sakura', furigana: 'ともだちの　おなかの　くすりを　ください。', en: 'Some stomach medicine for my friend, please.' },
      { speaker: 'maomao', furigana: 'その　ともだちは　[何|なに]を　[食|た]べましたか。', en: 'What did your friend eat?' },
      { speaker: 'sakura', furigana: 'にくを　[一|いち]キロ　[食|た]べました。', en: 'A kilo of meat.' },
      { speaker: 'maomao', furigana: '……[一|いち]キロ。', en: '...A kilo.' },
      { speaker: 'sakura', furigana: 'くすりは　どのくらい　のみますか？', en: 'How much of the medicine does he take?' },
      { speaker: 'maomao', furigana: '[一日|いちにち]に　[三|さん]ど、[五|ご]グラムずつ　のんで　ください。', en: 'Three times a day, five grams each time.' },
      { speaker: 'sakura', furigana: 'この　くすりは　だいじょうぶですか？', en: 'Is this medicine safe?' },
      { speaker: 'maomao', furigana: 'わたしも　きのう　のみました。', en: 'I took some myself yesterday.' },
      { speaker: 'sakura', furigana: '……マオマオさんも　おなかが　いたかったですか？', en: '...Did your stomach hurt too, Maomao?' },
      { speaker: 'maomao', furigana: 'いいえ。……すきですから。', en: 'No. ...I just like it.' }
    ],
    remixes: [
      { scene: 'Maomao gives the dose.', en: 'Take it three times a day.',
        chunks: ['いちにちに', 'さんど', 'のんで', 'ください。', 'さんじ'], answer: ['いちにちに', 'さんど', 'のんで', 'ください。'],
        explain: 'ど counts times: さんど = three times. さんじ is three o’clock.' },
      { scene: 'This time the medicine comes as tablets.', en: 'Take one each time.',
        chunks: ['ひとつずつ', 'のんで', 'ください。', 'ひとつだけ'], answer: ['ひとつずつ', 'のんで', 'ください。'],
        explain: 'ずつ means "each time, apiece": ひとつずつ. ひとつだけ would mean only one in all.' }
    ],
    names: ['サクラ', 'マオマオ'],
    uses: ['g:no', 'g:wo', 'g:wa-desu', 'g:ka', 'g:mashita', 'g:ni', 'g:te-form', 'g:te-kudasai', 'g:mo', 'g:ga', 'g:adj-i', 'g:kara', 'v:友達|ともだち', 'v:おなか|おなか', 'v:薬|くすり', 'v:ください|ください', 'v:その|その', 'v:何|なに', 'v:食べる|たべる', 'v:肉|にく', 'v:一|いち', 'v:キロ|キロ', 'v:どの|どの', 'v:くらい|くらい', 'v:飲む|のむ', 'v:一日|いちにち', 'v:三|さん', 'v:度|ど', 'v:五|ご', 'v:グラム|グラム', 'v:ずつ|ずつ', 'v:この|この', 'v:大丈夫|だいじょうぶ', 'v:私|わたし', 'v:昨日|きのう', 'v:さん|さん', 'v:痛い|いたい', 'v:好き|すき', 'k:何', 'k:食', 'k:一', 'k:日', 'k:三', 'k:五'],
    verified: true }),

  L({ id: 'l:n5-dlg-new-year-plan', format: 'dialogue',
    title: 'Next year for sure', goal: 'You can make a guess, or ask someone to agree, with 〜でしょう.',
    scene: 'At a cafe at the end of the year, Emilia tells Lelouch her plan for next year. It is not her first try.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'らいねんは　まいあさ　はやく　おきます！', en: 'Next year I’ll get up early every morning!' },
      { speaker: 'lelouch', furigana: '……[今年|ことし]も　そう　いいましたね。', en: '...You said that this year too.' },
      { speaker: 'emilia', furigana: 'きょねんも　いいました。', en: 'I said it last year too.' },
      { speaker: 'lelouch', furigana: '……たぶん、らいねんも　みっかだけでしょう。', en: '...Next year it will probably last three days too.' },
      { speaker: 'emilia', furigana: '[今年|ことし]は　よっか　はやく　おきましたよ！', en: 'This year I got up early for four days!' },
      { speaker: 'lelouch', furigana: '……らいねんは　いつかでしょう。', en: '...Then next year it will be five.' },
      { speaker: 'emilia', furigana: 'ルルーシュさんは　らいねん、[何|なに]を　しますか？', en: 'What will you do next year, Lelouch?' },
      { speaker: 'lelouch', furigana: '[毎年|まいとし]と　おなじです。チェスを　します。', en: 'The same as every year. I’ll play chess.' },
      { speaker: 'emilia', furigana: 'それは　[毎日|まいにち]　できるでしょう？', en: 'You can do that every day, can’t you?' },
      { speaker: 'lelouch', furigana: 'ええ。[毎日|まいにち]　します。', en: 'Yes. I play every day.' }
    ],
    bridge: [
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Lelouch makes his guess.', en: 'Next year it will probably be five days.',
        chunks: ['らいねんは', 'いつかでしょう。', 'いつかでした。'], answer: ['らいねんは', 'いつかでしょう。'],
        explain: 'でしょう guesses about something not certain yet, like next year. でした is the past: "it was".' },
      { scene: 'Emilia checks with Lelouch.', en: 'You can do that every day, can’t you?',
        chunks: ['それは', 'まいにち', 'できるでしょう？', 'できましたか？'], answer: ['それは', 'まいにち', 'できるでしょう？'],
        explain: 'でしょう？ with a rising voice asks the other person to agree: "right?". できましたか asks whether he managed it in the past.' }
    ],
    names: ['エミリア', 'ルルーシュ'],
    uses: ['g:deshou', 'g:wa-desu', 'g:mo', 'g:ne', 'g:mashita', 'g:dake', 'g:yo', 'g:ka', 'g:wo', 'g:to', 'g:masu', 'g:adj-i', 'v:来年|らいねん', 'v:毎朝|まいあさ', 'v:早い|はやい', 'v:起きる|おきる', 'v:今年|ことし', 'v:そう|そう', 'v:言う|いう', 'v:去年|きょねん', 'v:たぶん|たぶん', 'v:三日|みっか', 'v:だけ|だけ', 'v:四日|よっか', 'v:五日|いつか', 'v:さん|さん', 'v:何|なに', 'v:する|する', 'v:毎年|まいとし', 'v:同じ|おなじ', 'v:それ|それ', 'v:毎日|まいにち', 'v:できる|できる', 'k:今', 'k:年', 'k:何', 'k:毎', 'k:日'],
    notes: 'チェス is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-birthday-plan', format: 'dialogue',
    title: 'Birthday plans', goal: 'You can say what you plan to do with 〜つもり.',
    scene: 'At a cafe, Sakura asks Sasuke about his birthday.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'サスケくんは　[七|しち][月|がつ]　[二|に][十|じゅう][三|さん][日|にち]に　[生|う]まれたね。', en: 'You were born on the twenty-third of July, Sasuke-kun.' },
      { speaker: 'sasuke', furigana: '……らいげつ。', en: '...That’s next month.' },
      { speaker: 'sakura', furigana: 'そう！　たんじょうびは　[何|なに]を　する　つもり？', en: 'Right! What are you planning to do on your birthday?' },
      { speaker: 'sasuke', furigana: '……[何|なに]も　しない　つもり。', en: '...I’m planning to do nothing.' },
      { speaker: 'sakura', furigana: 'わたしは　トマトの　りょうりを　つくる　つもり！', en: 'I’m planning to cook something with tomatoes!' },
      { speaker: 'sasuke', furigana: '……トマトは　[食|た]べる。', en: '...Tomatoes, I’ll eat.' },
      { speaker: 'sakura', furigana: 'らいねんは　はたちね。おとなの　たんじょうびは　[何|なに]を　する？', en: 'Next year you’ll be twenty. What will you do on your first grown-up birthday?' },
      { speaker: 'sasuke', furigana: '……サクラと　いる　つもり。', en: '...I plan to be with you, Sakura.' },
      { speaker: 'sakura', furigana: 'サスケくん、[今|いま]の、もういちど　いって！', en: 'Sasuke-kun, say that again!' }
    ],
    bridge: [
      { text: 'くん', ctx: 'サスケくん', gloss: 'くん = a friendly name ending for a boy: Sakura always calls him サスケくん' },
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Sakura says her plan.', en: 'I plan to cook!',
        chunks: ['わたしは', 'りょうりを', 'つくる', 'つもり！', 'つくった'], answer: ['わたしは', 'りょうりを', 'つくる', 'つもり！'],
        explain: 'For a plan, つもり follows the dictionary form: つくる つもり. つくった つもり means "I believe I made it".' },
      { scene: 'Sasuke answers about his birthday.', en: 'I plan to do nothing.',
        chunks: ['なにも', 'しない', 'つもり。', 'する'], answer: ['なにも', 'しない', 'つもり。'],
        explain: 'なにも goes with a negative: なにも しない, "do nothing". なにも する is not said.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:tsumori', 'g:ni', 'g:ta-form', 'g:ne', 'g:wo', 'g:mo', 'g:nai-form', 'g:no', 'g:to', 'g:te-form', 'g:verb-groups-dict', 'v:月|がつ', 'v:生まれる|うまれる', 'v:七|しち', 'v:二|に', 'v:十|じゅう', 'v:三|さん', 'v:日|にち', 'v:来月|らいげつ', 'v:そう|そう', 'v:誕生日|たんじょうび', 'v:何|なに', 'v:する|する', 'v:私|わたし', 'v:料理|りょうり', 'v:作る|つくる', 'v:食べる|たべる', 'v:来年|らいねん', 'v:二十歳|はたち', 'v:大人|おとな', 'v:居る|いる', 'v:今|いま', 'v:もう一度|もういちど', 'v:言う|いう', 'k:何', 'k:月', 'k:生', 'k:七', 'k:二', 'k:十', 'k:三', 'k:日', 'k:食', 'k:今'],
    notes: 'トマト is not on the N5 list: a bridge only. くん is a name ending, not on the list: a bridge (owner rule: in plain-form couple scenes Sakura says サスケくん).',
    verified: true }),

  L({ id: 'l:n5-dlg-salty-eggs', format: 'dialogue',
    title: 'Too salty', goal: 'You can give advice with 〜たほうがいい and 〜ないほうがいい.',
    scene: 'In the kitchen, Yor has made an egg dish and asks Sanji to taste it. Sanji never wastes food.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Learner' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' } },
    lines: [
      { speaker: 'yor', furigana: 'たまごの　りょうりを　つくりました。[食|た]べて　ください。', en: 'I made an egg dish. Please try it.' },
      { speaker: 'sanji', furigana: 'いただきます。……しおが　とても　おおいですね。', en: 'Thank you. ...There’s a lot of salt in this.' },
      { speaker: 'yor', furigana: 'しおを　たくさん　いれました。', en: 'I put in lots of salt.' },
      { speaker: 'sanji', furigana: 'しおは　すこしだけ　いれた　ほうが　いいです。', en: 'You’d better put in just a little salt.' },
      { speaker: 'yor', furigana: 'さとうも　いれない　ほうが　いいですか？', en: 'Is it better not to put in sugar either?' },
      { speaker: 'sanji', furigana: 'いいえ、さとうは　すこし　いれた　ほうが　いいですよ。たまごが　あまく　なります。', en: 'No, a little sugar is better. It makes the eggs sweet.' },
      { speaker: 'yor', furigana: 'わかりました。……それは　[食|た]べないで　ください！', en: 'I see. ...Please don’t eat that one!' },
      { speaker: 'sanji', furigana: '……[食|た]べます。ヨルさんの　りょうりですから。', en: '...I’ll eat it. It’s your cooking, Yor.' },
      { speaker: 'yor', furigana: 'みずを　どうぞ！', en: 'Here, have some water!' }
    ],
    remixes: [
      { scene: 'Sanji gives the first tip.', en: 'You’d better put in just a little salt.',
        chunks: ['しおは', 'すこしだけ', 'いれた', 'ほうがいいです。', 'たくさん'], answer: ['しおは', 'すこしだけ', 'いれた', 'ほうがいいです。'],
        explain: 'すこしだけ = just a little. With たくさん the advice would be to add lots of salt, the opposite of what Sanji means.' },
      { scene: 'Yor asks about the sugar.', en: 'Is it better not to put in sugar?',
        chunks: ['さとうは', 'いれない', 'ほうがいいですか？', 'いれた'], answer: ['さとうは', 'いれない', 'ほうがいいですか？'],
        explain: 'ない-form + ほうがいい = better not to: いれない ほうがいい. いれた ほうがいい means "better to put it in".' }
    ],
    names: ['ヨル', 'サンジ'],
    uses: ['g:hou-ga-ii', 'g:no', 'g:wo', 'g:ne', 'g:mashita', 'g:te-kudasai', 'g:te-form', 'g:totemo', 'g:wa-desu', 'g:dake', 'g:ta-form', 'g:nai-form', 'g:mo', 'g:ka', 'g:yo', 'g:ga', 'g:naru', 'g:adj-i', 'g:nai-de-kudasai', 'g:kara', 'g:masu', 'v:卵|たまご', 'v:料理|りょうり', 'v:作る|つくる', 'v:食べる|たべる', 'v:ください|ください', 'v:とても|とても', 'v:塩|しお', 'v:多い|おおい', 'v:たくさん|たくさん', 'v:入れる|いれる', 'v:少し|すこし', 'v:だけ|だけ', 'v:ほう|ほう', 'v:いい|いい', 'v:砂糖|さとう', 'v:甘い|あまい', 'v:なる|なる', 'v:分かる|わかる', 'v:それ|それ', 'v:さん|さん', 'v:水|みず', 'v:どうぞ|どうぞ', 'k:食'],
    verified: true }),

  L({ id: 'l:n5-dlg-curry-bowls', format: 'dialogue',
    title: 'Too much curry', goal: 'You can say "too much" with 〜すぎる.',
    scene: 'Lunch at the school cafeteria. Hinata has eaten a lot; Killua only eats sweets.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'hinata', furigana: 'しょくどうの　カレー、[二|に]はい　[食|た]べた！', en: 'I had two bowls of cafeteria curry!' },
      { speaker: 'killua', furigana: '[二|に]はい？　[食|た]べすぎ。', en: 'Two? That’s too much.' },
      { speaker: 'hinata', furigana: 'ぎゅうにくが　たくさん　はいって　いた！　おいしすぎる！', en: 'There was loads of beef in it! It’s too good!' },
      { speaker: 'killua', furigana: 'カレーは　からすぎる。おかしの　ほうが　いい。', en: 'Curry’s too spicy. Sweets are better.' },
      { speaker: 'hinata', furigana: 'キルアは　いつも　おかし！　あますぎる！', en: 'You always eat sweets, Killua! That’s way too sweet!' },
      { speaker: 'killua', furigana: '……おなか、だいじょうぶ？', en: '...Is your stomach okay?' },
      { speaker: 'hinata', furigana: '……ちょっと　いたい。', en: '...It hurts a little.' },
      { speaker: 'killua', furigana: 'おかし、[食|た]べる？', en: 'Want some sweets?' },
      { speaker: 'hinata', furigana: '[今|いま]は　いい……。', en: 'Not now...' }
    ],
    remixes: [
      { scene: 'Killua turns down the curry.', en: 'This is too spicy.',
        chunks: ['これは', 'からすぎる。', 'からいすぎる。'], answer: ['これは', 'からすぎる。'],
        explain: 'An い-adjective drops い before すぎる: からい → からすぎる. からいすぎる is not a form.' },
      { scene: 'Hinata owns up.', en: 'I ate too much today.',
        chunks: ['きょうは', 'たべすぎた。', 'たべるすぎた。'], answer: ['きょうは', 'たべすぎた。'],
        explain: 'すぎる joins the ます-stem: たべ(ます) → たべすぎる, past たべすぎた. The dictionary form たべる cannot take すぎる.' }
    ],
    names: ['ヒナタ', 'キルア'],
    uses: ['g:sugiru', 'g:no', 'g:ta-form', 'g:ga', 'g:te-iru', 'g:te-form', 'g:itsumo', 'g:hou-ga-ii', 'g:adj-i', 'g:verb-groups-dict', 'v:食堂|しょくどう', 'v:カレー|カレー', 'v:二|に', 'v:杯|はい', 'v:食べる|たべる', 'v:牛肉|ぎゅうにく', 'v:たくさん|たくさん', 'v:入る|はいる', 'v:おいしい|おいしい', 'v:辛い|からい', 'v:お菓子|おかし', 'v:ほう|ほう', 'v:いい|いい', 'v:いつも|いつも', 'v:甘い|あまい', 'v:おなか|おなか', 'v:大丈夫|だいじょうぶ', 'v:ちょっと|ちょっと', 'v:痛い|いたい', 'v:今|いま', 'k:二', 'k:食', 'k:今'],
    verified: true }),

  L({ id: 'l:n5-dlg-flower-spell', format: 'dialogue',
    title: 'The flower spell', goal: 'You can give a reason with 〜ので.',
    scene: 'Frieren-sensei’s classroom is full today. Sasuke wants to know why.',
    cast: { sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Student' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'sasuke', furigana: '……せいとが　おおぜい　いるので、いすが　ありません。', en: '...There are so many students that there are no chairs.' },
      { speaker: 'frieren', furigana: '……となりの　クラスの　おとこのこも　おんなのこも　[来|き]て　います。', en: '...Boys and girls from the next class have come too.' },
      { speaker: 'sasuke', furigana: '[先生|せんせい]、どうしてですか。', en: 'Why, sensei?' },
      { speaker: 'frieren', furigana: 'きょうは　はなの　まほうを　おしえるので、みんな　[来|き]ました。', en: 'Today I’m teaching a flower spell, so everyone came.' },
      { speaker: 'sasuke', furigana: '……はなの　まほうは　[何|なに]が　できますか。', en: '...What can the flower spell do?' },
      { speaker: 'frieren', furigana: 'はなが　たくさん　さきます。……それだけです。', en: 'Lots of flowers bloom. ...That’s all.' },
      { speaker: 'sasuke', furigana: '……かえっても　いいですか。', en: '...May I go home?' },
      { speaker: 'frieren', furigana: '……いいえ。サスケさんは　この　クラスの　せいとなので。', en: '...No. You’re a student in this class, Sasuke.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Sasuke points at the crowd.', en: 'There are lots of students, so there are no chairs.',
        chunks: ['せいとが', 'おおぜい', 'いるので、', 'いすが', 'ありません。', 'いても、'], answer: ['せいとが', 'おおぜい', 'いるので、', 'いすが', 'ありません。'],
        explain: 'ので gives the reason: いるので, "since there are". いても means "even if there are" and gives no reason.' },
      { scene: 'Frieren gives her reason.', en: 'Because you are a student here.',
        chunks: ['ここの', 'せいとなので。', 'せいとので。'], answer: ['ここの', 'せいとなので。'],
        explain: 'After a noun, ので takes な: せいとなので. せいとので is not a form.' }
    ],
    names: ['サスケ', 'フリーレン'],
    uses: ['g:node', 'g:ga', 'g:masen', 'g:no', 'g:mo', 'g:te-iru', 'g:te-form', 'g:wa-desu', 'g:ka', 'g:wo', 'g:mashita', 'g:te-mo-ii', 'g:dake', 'g:doushite', 'g:verb-groups-dict', 'v:生徒|せいと', 'v:大勢|おおぜい', 'v:居る|いる', 'v:いす|いす', 'v:ある|ある', 'v:隣|となり', 'v:クラス|クラス', 'v:男の子|おとこのこ', 'v:女の子|おんなのこ', 'v:来る|くる', 'v:先生|せんせい', 'v:どうして|どうして', 'v:今日|きょう', 'v:花|はな', 'v:教える|おしえる', 'v:みんな|みんな', 'v:何|なに', 'v:できる|できる', 'v:たくさん|たくさん', 'v:咲く|さく', 'v:それ|それ', 'v:だけ|だけ', 'v:帰る|かえる', 'v:いい|いい', 'v:さん|さん', 'v:この|この', 'k:来', 'k:先', 'k:生', 'k:何'],
    notes: 'まほう is not on the N5 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n5-dlg-red-purse', format: 'dialogue',
    title: 'The red purse', goal: 'You can explain what happened, or ask, with 〜んです.',
    scene: 'Anya comes to the police box. The officer on duty is Gojo, who has a sweet tooth.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Police officer' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'gojo', furigana: 'どう　したんですか？', en: 'What’s the matter?' },
      { speaker: 'anya', furigana: 'さいふを　なくしたんです……。', en: 'I lost my purse...' },
      { speaker: 'gojo', furigana: 'それは　こまりましたね。どんな　さいふですか？', en: 'Oh dear. What kind of purse is it?' },
      { speaker: 'anya', furigana: 'あかい　さいふ。なかに　あめが　はいって　いる。', en: 'A red one. There’s candy in it.' },
      { speaker: 'gojo', furigana: 'けさ、だれかが　あかい　さいふを　こうばんに　もって　[来|き]ましたよ。これですか？', en: 'This morning someone brought a red purse to the police box. Is this it?' },
      { speaker: 'anya', furigana: 'それ！', en: 'That’s it!' },
      { speaker: 'gojo', furigana: 'よかったですね。なかを　みせて　ください。', en: 'Good. Show me what’s inside, please.' },
      { speaker: 'anya', furigana: 'あめ、ある！　……おまわりさん、ひとつ　どうぞ！', en: 'The candy’s there! ...Here, officer, have one!' },
      { speaker: 'gojo', furigana: 'いいんですか！', en: 'Can I really?!' }
    ],
    remixes: [
      { scene: 'Anya says why she came.', en: 'I lost my purse.',
        chunks: ['さいふを', 'なくしたんです。', 'なくすんです。'], answer: ['さいふを', 'なくしたんです。'],
        explain: 'なくした is the past: it has already happened. なくすんです would explain something that is going to happen.' },
      { scene: 'Gojo greets the next visitor.', en: 'What’s the matter?',
        chunks: ['どう', 'したんですか？', 'するんですか？'], answer: ['どう', 'したんですか？'],
        explain: 'どう したんですか asks what happened, so it takes the past した. どう するんですか asks "what will you do?".' }
    ],
    names: ['ゴジョウ', 'アーニャ'],
    uses: ['g:n-desu', 'g:ta-form', 'g:wo', 'g:wa-desu', 'g:mashita', 'g:ne', 'g:ka', 'g:ni', 'g:ga', 'g:te-iru', 'g:te-form', 'g:yo', 'g:te-kudasai', 'g:adj-i', 'v:どう|どう', 'v:する|する', 'v:財布|さいふ', 'v:無くす|なくす', 'v:それ|それ', 'v:困る|こまる', 'v:どんな|どんな', 'v:赤い|あかい', 'v:中|なか', 'v:飴|あめ', 'v:入る|はいる', 'v:今朝|けさ', 'v:誰か|だれか', 'v:交番|こうばん', 'v:持つ|もつ', 'v:来る|くる', 'v:これ|これ', 'v:よい|よい', 'v:見せる|みせる', 'v:ください|ください', 'v:ある|ある', 'v:おまわりさん|おまわりさん', 'v:一つ|ひとつ', 'v:どうぞ|どうぞ', 'v:いい|いい', 'k:来'],
    verified: true }),

  L({ id: 'l:n5-dlg-second-job', format: 'dialogue',
    title: 'Day jobs', goal: 'You can say where you live, where you work and what you sell.',
    scene: 'At a cafe counter, Yor gets talking to Killua. Both of them have a line of work they keep quiet about.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Customer' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'yor', furigana: 'この　へんに　すんで　いるんですか？', en: 'Do you live around here?' },
      { speaker: 'killua', furigana: 'ちがう。[山|やま]の　[上|うえ]の　いえ。[電車|でんしゃ]で　[三|さん][時間|じかん]　かかる。', en: 'No. A house on top of a mountain. It takes three hours by train.' },
      { speaker: 'yor', furigana: '[三|さん][時間|じかん]！　わたしは　この　まちの　やくしょに　つとめて　います。', en: 'Three hours! I work at the town office here.' },
      { speaker: 'killua', furigana: '……うちは　かぞくの　しごと。', en: '...We have a family business.' },
      { speaker: 'yor', furigana: '[何|なに]を　うって　いるんですか？', en: 'What do you sell?' },
      { speaker: 'killua', furigana: '……ひみつ。', en: '...It’s a secret.' },
      { speaker: 'yor', furigana: 'わたしも、もう　ひとつの　しごとは　ひみつです。', en: 'My other job is a secret too.' },
      { speaker: 'killua', furigana: '……おなじ　ひみつ？', en: '...The same kind of secret?' },
      { speaker: 'yor', furigana: 'ど、どうでしょう……。', en: 'W-who knows...' }
    ],
    bridge: [
      { text: 'やくしょ', gloss: 'やくしょ = the town office, city hall' },
      { text: 'ひみつ', gloss: 'ひみつ = a secret' }
    ],
    unmark: [{ text: 'いる', ctx: 'でいるん' }],
    remixes: [
      { scene: 'Yor says where she works.', en: 'I work at the town office.',
        chunks: ['まちの', 'やくしょに', 'つとめて', 'います。', 'やくしょで'], answer: ['まちの', 'やくしょに', 'つとめて', 'います。'],
        explain: 'つとめる takes に for the place you work: やくしょに つとめて います. で goes with はたらく: やくしょで はたらいて います.' },
      { scene: 'Killua says how long the trip is.', en: 'It takes three hours by train.',
        chunks: ['でんしゃで', 'さんじかん', 'かかる。', 'かける。'], answer: ['でんしゃで', 'さんじかん', 'かかる。'],
        explain: 'かかる means "it takes" (time or money). かける is to hang something up or to make a phone call.' }
    ],
    names: ['ヨル', 'キルア'],
    uses: ['g:te-iru', 'g:te-form', 'g:n-desu', 'g:ni', 'g:no', 'g:de', 'g:wa-desu', 'g:wo', 'g:mo', 'g:deshou', 'g:verb-groups-dict', 'v:この|この', 'v:辺|へん', 'v:住む|すむ', 'v:違う|ちがう', 'v:山|やま', 'v:上|うえ', 'v:家|いえ', 'v:電車|でんしゃ', 'v:三|さん', 'v:時間|じかん', 'v:かかる|かかる', 'v:私|わたし', 'v:町|まち', 'v:勤める|つとめる', 'v:うち|うち', 'v:家族|かぞく', 'v:仕事|しごと', 'v:何|なに', 'v:売る|うる', 'v:もう|もう', 'v:一つ|ひとつ', 'v:同じ|おなじ', 'v:どう|どう', 'k:山', 'k:上', 'k:電', 'k:車', 'k:三', 'k:時', 'k:間', 'k:何'],
    notes: 'やくしょ and ひみつ are not on the N5 list: bridges only.',
    verified: true }),

  L({ id: 'l:n5-dlg-staff-room-tea', format: 'dialogue',
    title: 'Tea in the staff room', goal: 'You can offer, refuse and soften what you say with けど.',
    scene: 'In the staff room, Kakashi-sensei offers Frieren-sensei a drink. Kakashi does not like sweet things.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'kakashi', furigana: 'おちゃを　いれましたけど、いかがですか。', en: 'I’ve made some tea. Would you like some?' },
      { speaker: 'frieren', furigana: '……けっこうです。', en: '...No, thank you.' },
      { speaker: 'kakashi', furigana: 'では、コーヒーは　いかがですか。', en: 'Then how about coffee?' },
      { speaker: 'frieren', furigana: '……コーヒーは　いやです。', en: '...I don’t want coffee.' },
      { speaker: 'kakashi', furigana: 'あまい　おかしも　ありますけど……。', en: 'There are some sweets as well, though...' },
      { speaker: 'frieren', furigana: '……いただきます。', en: '...I’ll have some.' },
      { speaker: 'kakashi', furigana: 'わたしは　あまい　ものが　きらいなので、どうぞ。', en: 'I don’t like sweet things, so help yourself.' },
      { speaker: 'frieren', furigana: '……カカシ[先生|せんせい]、おちゃも　いただきます。', en: '...Kakashi-sensei, I’ll have the tea too.' },
      { speaker: 'kakashi', furigana: '……おちゃは　けっこうでしたけど。', en: '...You said no to the tea, though.' },
      { speaker: 'frieren', furigana: '……おかしには　おちゃです。', en: '...Sweets need tea.' }
    ],
    remixes: [
      { scene: 'Kakashi offers the tea.', en: 'I’ve made some tea. Would you like some?',
        chunks: ['おちゃを', 'いれましたけど、', 'いかがですか。', 'いかがでしたか。'], answer: ['おちゃを', 'いれましたけど、', 'いかがですか。'],
        explain: 'けど here softens the offer: "I made tea, so... would you like some?". いかがでしたか asks how something was, after the fact.' },
      { scene: 'Kakashi reminds Frieren what she said about the tea.', en: 'You said no to the tea, though.',
        chunks: ['おちゃは', 'けっこうでした', 'けど。', 'から。'], answer: ['おちゃは', 'けっこうでした', 'けど。'],
        explain: 'けど sets what she said before against what she says now: she turned the tea down, and now she wants it. から would make her refusal the reason for something.' }
    ],
    names: ['カカシ', 'フリーレン'],
    uses: ['g:kedo', 'g:wo', 'g:mashita', 'g:ka', 'g:wa-desu', 'g:mo', 'g:ga', 'g:node', 'g:deshita', 'v:お茶|おちゃ', 'v:入れる|いれる', 'v:いかが|いかが', 'v:結構|けっこう', 'v:では|では', 'v:コーヒー|コーヒー', 'v:嫌|いや', 'v:甘い|あまい', 'v:お菓子|おかし', 'v:ある|ある', 'v:私|わたし', 'v:物|もの', 'v:嫌い|きらい', 'v:どうぞ|どうぞ', 'v:先生|せんせい', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n5-dlg-film-date', format: 'dialogue',
    title: 'Plans for tomorrow', goal: 'You can link sentences with けれども, でも, そして and それから.',
    scene: 'Evening at a cafe. Sakura tells Sasuke about her day, and about her day off tomorrow.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'きょうは　びょういんで　はたらいて、それから　としょかんへ　[行|い]った。', en: 'Today I worked at the hospital, and then I went to the library.' },
      { speaker: 'sasuke', furigana: '……つかれた？', en: '...Tired?' },
      { speaker: 'sakura', furigana: 'つかれたけれども、たのしかった！　あしたは　やすみ！', en: 'Tired, but it was fun! And tomorrow’s my day off!' },
      { speaker: 'sasuke', furigana: '……あした、[何|なに]を　する？', en: '...What will you do tomorrow?' },
      { speaker: 'sakura', furigana: 'えいがを　[見|み]て、そして　かいものを　して、また　ここで　コーヒーを　のむ！', en: 'See a film, and go shopping, and have coffee here again!' },
      { speaker: 'sasuke', furigana: '……ぜんぶ　ひとりで？', en: '...All of it on your own?' },
      { speaker: 'sakura', furigana: 'サスケくんと！', en: 'With you, Sasuke-kun!' },
      { speaker: 'sasuke', furigana: '……えいがは　すきじゃない。', en: '...I don’t like films.' },
      { speaker: 'sakura', furigana: 'しって　いる。でも、サスケくんと　[行|い]きたい！', en: 'I know. But I want to go with you!' },
      { speaker: 'sasuke', furigana: '……[行|い]くけれども、かいものは　しない。', en: '...I’ll go, but I’m not shopping.', say: '……行くけれども、買い物はしない。' }
    ],
    bridge: [
      { text: 'くん', ctx: 'サスケくん', gloss: 'くん = a friendly name ending for a boy: Sakura always calls him サスケくん' }
    ],
    remixes: [
      { scene: 'Sakura sums up her day.', en: 'Tired, but it was fun!',
        chunks: ['つかれたけれども、', 'たのしかった！', 'つかれたから、'], answer: ['つかれたけれども、', 'たのしかった！'],
        explain: 'けれども joins two things that pull different ways: tired, but fun. から would make being tired the reason it was fun.' },
      { scene: 'Sasuke gives his answer.', en: 'I’ll go, but I’m not shopping.',
        chunks: ['いくけれども、', 'かいものは', 'しない。', 'いくので、'], answer: ['いくけれども、', 'かいものは', 'しない。'],
        explain: 'けれども sets the two halves against each other: he goes, but he won’t shop. ので would make going the reason he won’t shop.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:keredomo', 'g:de', 'g:te-form', 'g:nai-form', 'g:ni-ikimasu', 'g:ta-form', 'g:adj-i', 'g:wo', 'g:to', 'g:ja-nai', 'g:te-iru', 'g:tai', 'g:no', 'g:verb-groups-dict', 'v:今日|きょう', 'v:病院|びょういん', 'v:働く|はたらく', 'v:それから|それから', 'v:図書館|としょかん', 'v:行く|いく', 'v:疲れる|つかれる', 'v:楽しい|たのしい', 'v:明日|あした', 'v:休み|やすみ', 'v:何|なに', 'v:する|する', 'v:映画|えいが', 'v:見る|みる', 'v:そして|そして', 'v:買い物|かいもの', 'v:また|また', 'v:ここ|ここ', 'v:コーヒー|コーヒー', 'v:飲む|のむ', 'v:全部|ぜんぶ', 'v:一人|ひとり', 'v:好き|すき', 'v:知る|しる', 'v:でも|でも', 'k:行', 'k:何', 'k:見'],
    notes: 'くん is a name ending, not on the list: a bridge (owner rule: in plain-form couple scenes Sakura says サスケくん).',
    verified: true })
]);
}());
