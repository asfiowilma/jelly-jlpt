"use strict";

// N4 listening scripts: original items in the four N4 聴解 formats (jlpt.jp guideline, format and
// counts only; nothing copied from the sample booklet, its script or its audio, and no sample skeleton).
// Same shape and rules as data/n5/listening.js (see its header): task / point open with one narrator
// line (the scene), then the dialogue; utterance lines are all narrator; quick is one M or F line.
// Kanji: N5 + N4 only, every one inside [漢字|かな] ruby; all else kana. Full-width spaces between
// phrases. The audio speaks the kana readings. は / へ particles stay plain (as at N5); [は|わ] only
// where a word ending in は sits before the particle ([母|はは][は|わ] in who-picks-up-yui).
// N4 task / point scripts run 4-7 lines after the scene (mean 5.6; N5: 2-6) and make the listener track a
// change of mind, a reason or a condition. Options keep their authored order; keys are spread per
// format (tests/listening.js). The trailing comment on each item names its proposed set: mock-1,
// mock-2, diagnostic (no item shared), or review (one per review unit; spares for prep drills).
// Written by hand for this project (sources: ['own']).
(function () {
function L(o) {
  o.kind = 'listening';
  o.level = 'N4';
  o.author = 'jelly-jlpt';
  o.license = 'own';
  o.sources = ['own'];
  return o;
}

CATALOG.add([
  // ── task (課題理解) ──
  L({ id: 'l:n4-meeting-prep-first', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[田中|たなか]さん、[明日|あした]の　かいぎの　じゅんび、てつだって　もらえませんか。' },
      { speaker: 'M', furigana: 'いいですよ。[何|なに]を　したら　いいですか。' },
      { speaker: 'F', furigana: 'まず、かいぎしつに　いすを　ならべて　ほしいんです。それから、おちゃの　よういも　おねがいします。' },
      { speaker: 'M', furigana: 'わかりました。' },
      { speaker: 'F', furigana: 'そうだ、その　[前|まえ]に、かいぎしつの　パソコンを　[見|み]て　もらえますか。きのう　うごかなかったんです。' },
      { speaker: 'M', furigana: 'パソコンですね。じゃあ、そっちから　はじめます。' },
      { speaker: 'F', furigana: 'おちゃは　[明日|あした]の　[朝|あさ]で　いいですよ。' }],
    question: '[男|おとこ]の　[人|ひと]は　まず　[何|なに]を　しますか。',
    options: ['パソコンを　[見|み]る', 'いすを　ならべる', 'おちゃを　よういする', 'いすを　はこぶ'], answer: 0,
    names: ['田中|たなか'],
    en: 'Narrator: At a company, a man and a woman are talking. What will the man do first? — F: Mr. Tanaka, could you help me get ready for tomorrow\'s meeting? M: Sure. What should I do? F: First I\'d like you to set out the chairs in the meeting room. Then please get the tea ready too. M: Got it. F: Oh, before that, could you look at the meeting-room computer? It didn\'t work yesterday. M: The computer, right. Then I\'ll start with that. F: The tea can wait until tomorrow morning. — What will the man do first?',
    explain: 'Chairs came first in her list, but then she adds その前に: check the computer that would not start yesterday. He answers そっちからはじめます, "I\'ll start with that". The tea waits until tomorrow morning, and nobody asks him to carry chairs.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:wo', 'g:ni', 'g:mo', 'g:ka', 'g:yo', 'g:ne', 'g:te-morau', 'g:potential', 'g:tara', 'g:te-hoshii', 'g:n-desu', 'g:mashita', 'g:kara', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:さん|さん', 'v:明日|あした', 'v:会議|かいぎ', 'v:準備|じゅんび', 'v:手伝う|てつだう', 'v:もらう|もらう', 'v:いい|いい', 'v:何|なに', 'v:する|する', 'v:まず|まず', 'v:会議室|かいぎしつ', 'v:いす|いす', 'v:並べる|ならべる', 'v:欲しい|ほしい', 'v:それから|それから', 'v:お茶|おちゃ', 'v:用意|ようい', 'v:分かる|わかる', 'v:そう|そう', 'v:その|その', 'v:前|まえ', 'v:パソコン|パソコン', 'v:見る|みる', 'v:昨日|きのう', 'v:動く|うごく', 'v:じゃあ|じゃあ', 'v:そっち|そっち', 'v:始める|はじめる', 'v:朝|あさ', 'v:運ぶ|はこぶ', 'k:男', 'k:人', 'k:女', 'k:話', 'k:田', 'k:中', 'k:明', 'k:日', 'k:何', 'k:前', 'k:見', 'k:朝'],
    verified: true }),

  L({ id: 'l:n4-new-tenant-mailbox', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'アパートで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'きょう　ひっこして　きた　[山本|やまもと]です。よろしく　おねがいします。' },
      { speaker: 'F', furigana: 'おおやの　[川口|かわぐち]です。ごみの　[出|だ]し[方|かた]を　せつめいしますね。もえる　ごみは　[月曜日|げつようび]と　[木曜日|もくようび]の　[朝|あさ]、[八|はち][時|じ]までに　[出|だ]して　ください。' },
      { speaker: 'M', furigana: 'きょうは　[土曜日|どようび]だから、[月曜日|げつようび]ですね。ほかに　しなければ　ならない　ことは　ありますか。' },
      { speaker: 'F', furigana: 'ポストに　なまえを　[書|か]いて　おいて　ください。なまえが　ないと、てがみが　とどきませんから。きょうじゅうに　おねがいします。' },
      { speaker: 'M', furigana: 'わかりました。となりの　[人|ひと]にも　あいさつに　[行|い]った　ほうが　いいですか。' },
      { speaker: 'F', furigana: 'それは　こんどの　[日曜日|にちようび]で　いいですよ。みんな　[昼|ひる]は　いませんから。' }],
    question: '[男|おとこ]の　[人|ひと]は　きょう　[何|なに]を　しますか。',
    options: ['もえる　ごみを　[出|だ]す', 'となりの　[人|ひと]に　あいさつする', 'ポストに　なまえを　[書|か]く', 'ごみの　[出|だ]し[方|かた]を　[聞|き]く'], answer: 2,
    names: ['山本|やまもと', '川口|かわぐち'],
    en: 'Narrator: At an apartment building, a man and a woman are talking. What will the man do today? — M: I\'m Yamamoto, I moved in today. Nice to meet you. F: I\'m Kawaguchi, the landlady. Let me explain how to put out the rubbish. Burnable rubbish goes out on Monday and Thursday mornings, by eight. M: Today is Saturday, so that\'s Monday. Is there anything else I have to do? F: Please write your name on the mailbox. Without a name, letters won\'t arrive. Please do it today. M: Got it. Should I go and greet the neighbours too? F: Next Sunday is fine for that. Nobody is home in the daytime. — What will the man do today?',
    explain: 'The landlady wants the name on the mailbox きょうじゅうに, "by the end of today". Rubbish goes out on Monday (today is Saturday), the greeting can wait until next Sunday, and the rubbish rules were already explained.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:wo', 'g:ni', 'g:mo', 'g:ka', 'g:yo', 'g:ne', 'g:te-kuru', 'g:kata', 'g:made-ni', 'g:te-kudasai', 'g:kara', 'g:nakereba-naranai', 'g:te-oku', 'g:to-conditional', 'g:hou-ga-ii', 'g:ni-iku', 'g:masen', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:アパート|アパート', 'v:今日|きょう', 'v:引っ越す|ひっこす', 'v:ごみ|ごみ', 'v:出す|だす', 'v:方|かた', 'v:説明|せつめい', 'v:月曜日|げつようび', 'v:木曜日|もくようび', 'v:朝|あさ', 'v:八|はち', 'v:時|じ', 'v:土曜日|どようび', 'v:ほか|ほか', 'v:する|する', 'v:事|こと', 'v:ある|ある', 'v:ポスト|ポスト', 'v:名前|なまえ', 'v:書く|かく', 'v:手紙|てがみ', 'v:分かる|わかる', 'v:隣|となり', 'v:挨拶|あいさつ', 'v:行く|いく', 'v:ほう|ほう', 'v:いい|いい', 'v:今度|こんど', 'v:日曜日|にちようび', 'v:みんな|みんな', 'v:昼|ひる', 'v:居る|いる', 'v:聞く|きく', 'k:男', 'k:人', 'k:女', 'k:話', 'k:山', 'k:本', 'k:川', 'k:口', 'k:出', 'k:方', 'k:月', 'k:曜', 'k:日', 'k:木', 'k:朝', 'k:八', 'k:時', 'k:土', 'k:書', 'k:行', 'k:昼', 'k:何', 'k:聞'],
    verified: true }),

  L({ id: 'l:n4-clinic-after-visit', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'びょういんで　いしゃと　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'かぜですね。ねつも　ありますから、きょうと　[明日|あした]は　かいしゃを　[休|やす]んだ　ほうが　いいですよ。' },
      { speaker: 'F', furigana: '[明日|あした]は　だいじな　かいぎが　あるんですが……。' },
      { speaker: 'M', furigana: 'むりを　すると、もっと　わるく　なりますよ。かいぎは　ほかの　[人|ひと]に　たのんで　ください。' },
      { speaker: 'F', furigana: 'わかりました。じゃあ、うちに　かえってから、かいしゃに　[電話|でんわ]します。' },
      { speaker: 'M', furigana: 'それから、きょうは　おふろに　[入|はい]らないで　くださいね。くすりは　うけつけで　もらってから　かえって　ください。' },
      { speaker: 'F', furigana: 'わかりました。' }],
    question: '[女|おんな]の　[人|ひと]は　このあと　まず　[何|なに]を　しますか。',
    options: ['かいしゃに　[電話|でんわ]する', 'くすりを　もらう', 'ほかの　[人|ひと]に　たのむ', 'おふろに　[入|はい]る'], answer: 1,
    en: 'Narrator: At a hospital, a doctor and a woman are talking. What will the woman do first after this? — M: It\'s a cold. You have a fever too, so you\'d better stay off work today and tomorrow. F: But I have an important meeting tomorrow... M: If you push yourself, it will get worse. Please ask someone else to do the meeting. F: All right. Then I\'ll phone the office after I get home. M: And please don\'t take a bath today. Get your medicine at the reception desk before you go home. F: All right. — What will the woman do first after this?',
    explain: 'The doctor says to get the medicine at reception (もらってから帰ってください), and she will phone the office only after she is home (かえってから). The bath is what she must not do today. Asking someone else about the meeting will happen on that later phone call.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:mo', 'g:kara', 'g:hou-ga-ii', 'g:ta-form', 'g:yo', 'g:n-desu', 'g:to-conditional', 'g:naru', 'g:te-kudasai', 'g:te-kara', 'g:nai-de-kudasai', 'g:ne', 'g:mashita', 'g:ni', 'g:wo', 'g:no', 'v:病院|びょういん', 'v:医者|いしゃ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:風邪|かぜ', 'v:熱|ねつ', 'v:ある|ある', 'v:今日|きょう', 'v:明日|あした', 'v:会社|かいしゃ', 'v:休む|やすむ', 'v:ほう|ほう', 'v:いい|いい', 'v:大事|だいじ', 'v:会議|かいぎ', 'v:無理|むり', 'v:する|する', 'v:もっと|もっと', 'v:悪い|わるい', 'v:なる|なる', 'v:ほか|ほか', 'v:頼む|たのむ', 'v:分かる|わかる', 'v:じゃあ|じゃあ', 'v:うち|うち', 'v:帰る|かえる', 'v:電話|でんわ', 'v:それから|それから', 'v:お風呂|おふろ', 'v:入る|はいる', 'v:薬|くすり', 'v:受付|うけつけ', 'v:もらう|もらう', 'v:この|この', 'v:後|あと', 'v:まず|まず', 'v:何|なに', 'k:女', 'k:人', 'k:話', 'k:明', 'k:日', 'k:休', 'k:電', 'k:入', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-airport-taxi', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: '[駅|えき]で　[女|おんな]の　[人|ひと]と　[駅|えき][員|いん]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'すみません、くうこうへ　[行|い]きたいんですが、きゅうこうは　まだ　[来|き]ませんか。' },
      { speaker: 'M', furigana: 'もうしわけ　ありません。じこで、きゅうこうは　いま　[止|と]まって　います。いつ　うごくか、まだ　わかりません。' },
      { speaker: 'F', furigana: 'こまったなあ。[三|さん][時|じ]の　ひこうきに　のるんです。' },
      { speaker: 'M', furigana: 'それなら、ちかてつで　[東|ひがし][駅|えき]まで　[行|い]って、そこから　バスに　のりかえると、[一|いち][時|じ][間|かん]ぐらいで　[着|つ]きますよ。' },
      { speaker: 'F', furigana: 'でも、この　おおきい　スーツケースを　[持|も]って　のりかえるのは、ちょっと……。' },
      { speaker: 'M', furigana: 'でしたら、タクシーが　いちばん　らくですね。すこし　たかいですけど。' },
      { speaker: 'F', furigana: 'じゃあ、そう　します。' }],
    question: '[女|おんな]の　[人|ひと]は　どうやって　くうこうへ　[行|い]きますか。',
    options: ['ちかてつと　バスで　[行|い]く', 'きゅうこうを　まつ', 'バスだけで　[行|い]く', 'タクシーで　[行|い]く'], answer: 3,
    names: ['東|ひがし'],
    en: 'Narrator: At a station, a woman and a station employee are talking. How will the woman get to the airport? — F: Excuse me, I want to go to the airport. Hasn\'t the express come yet? M: I\'m very sorry. Because of an accident, the express is stopped. We don\'t know yet when it will run. F: Oh no. I\'m catching a three o\'clock flight. M: In that case, take the subway to Higashi Station and change to a bus there; you\'ll arrive in about an hour. F: But changing with this big suitcase is a bit... M: Then a taxi is the easiest. It\'s a little expensive, though. F: Then I\'ll do that. — How will the woman get to the airport?',
    explain: 'The express is stopped, and the subway-plus-bus route means changing with a big suitcase, which she turns down. The man calls a taxi the easiest way and she says そうします. Only the subway-and-bus route uses a bus, never a bus alone.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:tai', 'g:n-desu', 'g:ka', 'g:mada', 'g:nara', 'g:made', 'g:to-conditional', 'g:yo', 'g:no', 'g:kedo', 'g:ne', 'g:masen', 'g:dake', 'v:駅|えき', 'v:女|おんな', 'v:人|ひと', 'v:員|いん', 'v:話す|はなす', 'v:空港|くうこう', 'v:行く|いく', 'v:急行|きゅうこう', 'v:まだ|まだ', 'v:来る|くる', 'v:事故|じこ', 'v:今|いま', 'v:止まる|とまる', 'v:いつ|いつ', 'v:動く|うごく', 'v:分かる|わかる', 'v:困る|こまる', 'v:三|さん', 'v:時|じ', 'v:飛行機|ひこうき', 'v:乗る|のる', 'v:地下鉄|ちかてつ', 'v:東|ひがし', 'v:そこ|そこ', 'v:バス|バス', 'v:乗り換える|のりかえる', 'v:一|いち', 'v:時間|じかん', 'v:着く|つく', 'v:でも|でも', 'v:この|この', 'v:大きい|おおきい', 'v:スーツケース|スーツケース', 'v:持つ|もつ', 'v:ちょっと|ちょっと', 'v:タクシー|タクシー', 'v:いちばん|いちばん', 'v:少し|すこし', 'v:高い|たかい', 'v:じゃあ|じゃあ', 'v:そう|そう', 'v:する|する', 'v:どう|どう', 'v:待つ|まつ', 'k:駅', 'k:女', 'k:人', 'k:員', 'k:話', 'k:行', 'k:来', 'k:止', 'k:三', 'k:時', 'k:東', 'k:一', 'k:間', 'k:着', 'k:持'],
    verified: true }),

  L({ id: 'l:n4-get-well-gift', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[山田|やまだ]さんの　おみまい、[明日|あした]　[行|い]きますよね。[何|なに]を　[持|も]って　[行|い]きましょうか。' },
      { speaker: 'M', furigana: 'はなは　どうですか。' },
      { speaker: 'F', furigana: 'あの　びょういんは、はなを　[持|も]って　[入|はい]っては　いけないそうですよ。' },
      { speaker: 'M', furigana: 'そうですか。じゃあ、くだものは？' },
      { speaker: 'F', furigana: '[山田|やまだ]さんは　まだ　[何|なに]も　[食|た]べられないと　[聞|き]きました。' },
      { speaker: 'M', furigana: 'それは　たいへんですね。[山田|やまだ]さんは　[本|ほん]を　[読|よ]むのが　すきだから、ざっしは　どうでしょう。' },
      { speaker: 'F', furigana: 'いいですね。そう　しましょう。' }],
    question: 'ふたりは　おみまいに　[何|なに]を　[持|も]って　いきますか。',
    options: ['はな', 'くだもの', 'ざっし', '[本|ほん]'], answer: 2,
    names: ['山田|やまだ'],
    en: 'Narrator: At a company, a man and a woman are talking. What will the two of them take on the hospital visit? — F: We\'re visiting Mr. Yamada tomorrow, right? What shall we take? M: How about flowers? F: I hear you aren\'t allowed to take flowers into that hospital. M: Really? Then fruit? F: I heard Mr. Yamada can\'t eat anything yet. M: That\'s hard on him. He likes reading, so how about magazines? F: Good idea. Let\'s do that. — What will they take?',
    explain: 'Flowers are not allowed in that hospital (入ってはいけないそうです), and he cannot eat yet, so fruit is out. Because he likes reading, they settle on ざっし. A book is only the reason for the idea; magazines are what they take.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:wo', 'g:ni', 'g:mo', 'g:ka', 'g:yo', 'g:ne', 'g:mashou-ka', 'g:sou-da-hearsay', 'g:potential', 'g:no-ga-suki', 'g:kara', 'g:deshou', 'g:mashou', 'g:wa-desu', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:さん|さん', 'v:お見舞い|おみまい', 'v:明日|あした', 'v:行く|いく', 'v:何|なに', 'v:持つ|もつ', 'v:花|はな', 'v:どう|どう', 'v:あの|あの', 'v:病院|びょういん', 'v:入る|はいる', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:果物|くだもの', 'v:まだ|まだ', 'v:食べる|たべる', 'v:聞く|きく', 'v:たいへん|たいへん', 'v:本|ほん', 'v:読む|よむ', 'v:好き|すき', 'v:雑誌|ざっし', 'v:いい|いい', 'v:する|する', 'v:二人|ふたり', 'k:男', 'k:人', 'k:女', 'k:話', 'k:山', 'k:田', 'k:明', 'k:日', 'k:行', 'k:何', 'k:持', 'k:入', 'k:食', 'k:聞', 'k:本', 'k:読'],
    verified: true }),

  L({ id: 'l:n4-report-last-page', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: '[大学|だいがく]で　[先生|せんせい]と　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'リーさん、レポート、[読|よ]みましたよ。よく　[書|か]けて　いますね。' },
      { speaker: 'M', furigana: 'ありがとうございます。' },
      { speaker: 'F', furigana: 'ただ、さいごの　ページが　ちょっと　みじかいですね。もう　すこし　くわしく　[書|か]いて　ください。' },
      { speaker: 'M', furigana: 'わかりました。かんじの　まちがいも　ありましたか。' },
      { speaker: 'F', furigana: 'それは　[二|ふた]つ　だけでしたから、もう　[赤|あか]で　なおして　おきました。' },
      { speaker: 'M', furigana: 'そうですか。いつまでに　[出|だ]せば　いいですか。' },
      { speaker: 'F', furigana: '[来週|らいしゅう]の　[月曜日|げつようび]までに　おねがいします。' }],
    question: '[学生|がくせい]は　このあと　[何|なに]を　しますか。',
    options: ['さいごの　ページを　なおす', 'かんじの　まちがいを　なおす', 'レポートを　はじめから　[書|か]く', '[先生|せんせい]に　かんじを　ならう'], answer: 0,
    names: ['リー'],
    en: 'Narrator: At a university, a teacher and a student are talking. What will the student do after this? — F: Lee, I read your report. It\'s well written. M: Thank you. F: But the last page is a bit short. Please write a little more detail. M: All right. Were there kanji mistakes too? F: Only two, so I already corrected them in red. M: I see. By when should I hand it in? F: By next Monday, please. — What will the student do after this?',
    explain: 'The only thing he must still do is make the last page longer (もうすこしくわしく書いてください). The teacher already fixed the two kanji mistakes herself (なおしておきました), and the rest of the report is fine, so there is no rewriting from the start.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:mashita', 'g:yo', 'g:potential', 'g:ne', 'g:te-kudasai', 'g:ka', 'g:mo', 'g:dake', 'g:deshita', 'g:kara', 'g:te-oku', 'g:made-ni', 'g:ba', 'g:no', 'g:wo', 'v:大学|だいがく', 'v:先生|せんせい', 'v:学生|がくせい', 'v:話す|はなす', 'v:さん|さん', 'v:レポート|レポート', 'v:読む|よむ', 'v:よく|よく', 'v:書く|かく', 'v:最後|さいご', 'v:ページ|ページ', 'v:ちょっと|ちょっと', 'v:短い|みじかい', 'v:もう|もう', 'v:少し|すこし', 'v:分かる|わかる', 'v:漢字|かんじ', 'v:ある|ある', 'v:二つ|ふたつ', 'v:赤|あか', 'v:直す|なおす', 'v:そう|そう', 'v:いつ|いつ', 'v:出す|だす', 'v:いい|いい', 'v:来週|らいしゅう', 'v:月曜日|げつようび', 'v:この|この', 'v:後|あと', 'v:何|なに', 'v:する|する', 'v:初め|はじめ', 'v:習う|ならう', 'k:大', 'k:学', 'k:先', 'k:生', 'k:話', 'k:読', 'k:書', 'k:二', 'k:赤', 'k:出', 'k:来', 'k:週', 'k:月', 'k:曜', 'k:日', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-cooking-class-water', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'りょうり　きょうしつで　[先生|せんせい]と　[男|おとこ]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きょうは　カレーを　[作|つく]ります。まず、やさいを　[小|ちい]さく　[切|き]って　ください。' },
      { speaker: 'M', furigana: 'やさいは　ぜんぶ　[切|き]るんですか。' },
      { speaker: 'F', furigana: 'そうです。でも、ちょっと　まって　ください。さきに　おゆを　わかして　おいた　ほうが　いいですね。じかんが　かかりますから。' },
      { speaker: 'M', furigana: 'じゃあ、やさいは　その　あとで　いいですか。' },
      { speaker: 'F', furigana: 'それで　いいですよ。おにくは　わたしが　[切|き]って　おきます。' }],
    question: '[男|おとこ]の　[人|ひと]は　まず　[何|なに]を　しますか。',
    options: ['やさいを　[切|き]る', 'おにくを　[切|き]る', 'カレーを　[作|つく]る', 'おゆを　わかす'], answer: 3,
    en: 'Narrator: At a cooking class, a teacher and a man are talking. What will the man do first? — F: Today we\'re making curry. First, please cut the vegetables small. M: Do I cut all the vegetables? F: Yes. But wait a moment. It\'s better to boil the water first. It takes time. M: Then can the vegetables wait until after that? F: That\'s fine. I\'ll cut the meat. — What will the man do first?',
    explain: 'Vegetables were the first instruction, but the teacher changes the order: boil water first because it takes time (さきにおゆをわかしておいたほうがいい). The vegetables come after, and the teacher cuts the meat herself.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:wo', 'g:te-kudasai', 'g:n-desu', 'g:ka', 'g:te-oku', 'g:hou-ga-ii', 'g:ne', 'g:kara', 'g:ato-de', 'g:yo', 'v:料理|りょうり', 'v:教室|きょうしつ', 'v:先生|せんせい', 'v:男|おとこ', 'v:人|ひと', 'v:話す|はなす', 'v:今日|きょう', 'v:カレー|カレー', 'v:作る|つくる', 'v:まず|まず', 'v:野菜|やさい', 'v:小さい|ちいさい', 'v:切る|きる', 'v:全部|ぜんぶ', 'v:そう|そう', 'v:でも|でも', 'v:ちょっと|ちょっと', 'v:待つ|まつ', 'v:先|さき', 'v:湯|ゆ', 'v:沸かす|わかす', 'v:ほう|ほう', 'v:いい|いい', 'v:時間|じかん', 'v:かかる|かかる', 'v:じゃあ|じゃあ', 'v:その|その', 'v:後|あと', 'v:それで|それで', 'v:肉|にく', 'v:私|わたし', 'v:何|なに', 'v:する|する', 'k:先', 'k:生', 'k:男', 'k:人', 'k:話', 'k:作', 'k:小', 'k:切', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-parcel-by-air', format: 'task', // mock-1
    lines: [
      { speaker: 'N', furigana: 'ゆうびんきょくで　[女|おんな]の　[人|ひと]と　きょくの　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'すみません、この　にもつを　アメリカに　おくりたいんですが。' },
      { speaker: 'M', furigana: 'ふねと　ひこうきが　ありますが、どちらに　なさいますか。' },
      { speaker: 'F', furigana: 'ふねだと　どのぐらい　かかりますか。' },
      { speaker: 'M', furigana: 'ひとつきぐらいです。ひこうきなら　いっしゅうかんで　[着|つ]きます。' },
      { speaker: 'F', furigana: '[来週|らいしゅう]の　[土曜日|どようび]が　いもうとの　たんじょうびなので、ひこうきで　おねがいします。' },
      { speaker: 'M', furigana: 'かしこまりました。では、まず　こちらの　かみに　あいての　じゅうしょと　なかみを　[書|か]いて　ください。その　あいだに、にもつの　おもさを　はかって　おきます。' }],
    question: '[女|おんな]の　[人|ひと]は　このあと　まず　[何|なに]を　しますか。',
    options: ['にもつの　おもさを　はかる', 'かみに　じゅうしょを　[書|か]く', 'お[金|かね]を　はらう', 'ふねで　おくる'], answer: 1,
    en: 'Narrator: At a post office, a woman and a post-office clerk are talking. What will the woman do first after this? — F: Excuse me, I\'d like to send this parcel to America. M: There\'s sea mail and airmail. Which would you like? F: How long does sea mail take? M: About a month. By air it arrives in a week. F: My sister\'s birthday is next Saturday, so airmail, please. M: Certainly. Then first, please write the address and the contents on this form. Meanwhile I\'ll weigh the parcel. — What will the woman do first?',
    explain: 'The clerk asks her to fill in the address and contents first (まずこちらのかみに…書いてください); he weighs the parcel himself while she writes. Paying comes later, and she chose airmail, not sea mail, because of the birthday.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:tai', 'g:n-desu', 'g:ka', 'g:sonkeigo-verbs', 'g:to-conditional', 'g:nara', 'g:node', 'g:te-kudasai', 'g:te-iru-aida-ni', 'g:te-oku', 'g:sa', 'g:no', 'v:郵便局|ゆうびんきょく', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:この|この', 'v:荷物|にもつ', 'v:アメリカ|アメリカ', 'v:送る|おくる', 'v:舟|ふね', 'v:飛行機|ひこうき', 'v:ある|ある', 'v:どちら|どちら', 'v:なさる|なさる', 'v:どの|どの', 'v:かかる|かかる', 'v:一月|ひとつき', 'v:週間|しゅうかん', 'v:着く|つく', 'v:来週|らいしゅう', 'v:土曜日|どようび', 'v:妹|いもうと', 'v:誕生日|たんじょうび', 'v:では|では', 'v:まず|まず', 'v:こちら|こちら', 'v:紙|かみ', 'v:住所|じゅうしょ', 'v:書く|かく', 'v:その|その', 'v:間|あいだ', 'v:重い|おもい', 'v:後|あと', 'v:何|なに', 'v:する|する', 'v:お金|おかね', 'v:払う|はらう', 'k:女', 'k:人', 'k:話', 'k:着', 'k:来', 'k:週', 'k:土', 'k:曜', 'k:日', 'k:書', 'k:何', 'k:金'],
    verified: true }),

  L({ id: 'l:n4-room-booking-change', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[高田|たかだ]さん、[明日|あした]の　[午後|ごご]の　かいぎ、[三|さん][時|じ]から　よ[時|じ]に　かわったんです。' },
      { speaker: 'F', furigana: 'そうですか。[青山|あおやま]さんの　かいしゃにも　れんらくしましょうか。' },
      { speaker: 'M', furigana: 'いや、それは　わたしが　[電話|でんわ]で　つたえて　おきます。[高田|たかだ]さんは、かいぎしつの　よやくを　かえて　おいて　くれませんか。' },
      { speaker: 'F', furigana: 'わかりました。しりょうは　どう　しますか。' },
      { speaker: 'M', furigana: 'しりょうは　もう　できて　いるから、その　ままで　いいですよ。' },
      { speaker: 'F', furigana: 'では、すぐ　よやくを　かえて　きます。' }],
    question: '[女|おんな]の　[人|ひと]は　このあと　[何|なに]を　しますか。',
    options: ['よやくを　かえる', '[青山|あおやま]さんに　[電話|でんわ]する', 'しりょうを　[作|つく]る', 'かいぎの　[時間|じかん]を　きめる'], answer: 0,
    names: ['高田|たかだ', '青山|あおやま'],
    en: 'Narrator: At a company, a man and a woman are talking. What will the woman do after this? — M: Ms. Takada, tomorrow afternoon\'s meeting has moved from three to four. F: I see. Shall I let Mr. Aoyama\'s company know too? M: No, I\'ll tell them by phone. Could you change the meeting-room booking? F: Sure. What about the handouts? M: The handouts are already done, so leave them as they are. F: Then I\'ll go and change the booking right away. — What will the woman do after this?',
    explain: 'She offers to contact Mr. Aoyama, but the man will phone him himself. The handouts are already finished. Her job is the room booking: すぐよやくをかえてきます. The new time was already decided before the talk.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:kara', 'g:ni', 'g:ta-form', 'g:n-desu', 'g:mo', 'g:mashou-ka', 'g:te-oku', 'g:te-kureru', 'g:ka', 'g:yo', 'g:te-kuru', 'g:wo', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:さん|さん', 'v:明日|あした', 'v:午後|ごご', 'v:会議|かいぎ', 'v:三|さん', 'v:時|じ', 'v:変わる|かわる', 'v:そう|そう', 'v:連絡|れんらく', 'v:私|わたし', 'v:電話|でんわ', 'v:伝える|つたえる', 'v:会議室|かいぎしつ', 'v:予約|よやく', 'v:変える|かえる', 'v:分かる|わかる', 'v:どう|どう', 'v:する|する', 'v:もう|もう', 'v:できる|できる', 'v:その|その', 'v:まま|まま', 'v:いい|いい', 'v:では|では', 'v:作る|つくる', 'v:時間|じかん', 'v:決める|きめる', 'v:この|この', 'v:後|あと', 'v:何|なに', 'k:男', 'k:人', 'k:女', 'k:話', 'k:高', 'k:田', 'k:明', 'k:日', 'k:午', 'k:後', 'k:三', 'k:時', 'k:青', 'k:山', 'k:電', 'k:何', 'k:作', 'k:間'],
    verified: true }),

  L({ id: 'l:n4-library-card-expired', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: 'としょかんで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'すみません、この　[本|ほん]を　[借|か]りたいんですが。' },
      { speaker: 'F', furigana: 'こちらで　[本|ほん]を　[借|か]りるのは　はじめてですか。' },
      { speaker: 'M', furigana: '[去年|きょねん]　[一度|いちど]　[借|か]りましたけど……。' },
      { speaker: 'F', furigana: 'すみませんが、[去年|きょねん]の　かたも、もう　いちど　[書|か]いて　いただかなければ　なりません。こちらの　かみに　おなまえと　ごじゅうしょを　[書|か]いて　ください。それから、じゅうしょが　わかる　ものを　[見|み]せて　いただけますか。' },
      { speaker: 'M', furigana: 'きょうは　[何|なに]も　[持|も]って　いないんです。' },
      { speaker: 'F', furigana: 'でしたら、きょうは　かみだけ　[書|か]いて　おいて　ください。[本|ほん]は　つぎに　[来|き]た　ときに　[借|か]りられますよ。' }],
    question: '[男|おとこ]の　[人|ひと]は　きょう　[何|なに]を　しますか。',
    options: ['[本|ほん]を　[借|か]りる', 'じゅうしょを　[見|み]せる', 'かみに　[書|か]く', 'もう　いちど　[来|く]る'], answer: 2,
    en: 'Narrator: At a library, a man and a woman are talking. What will the man do today? — M: Excuse me, I\'d like to borrow this book. F: Is this your first time borrowing here? M: I borrowed once last year... F: I\'m sorry, but people from last year also need to fill it in again. Please write your name and address on this form. And could you show me something with your address on it? M: I don\'t have anything with me today. F: In that case, just fill in the form today. You can borrow the book next time you come. — What will the man do today?',
    explain: 'He has nothing that shows his address, so today he only fills in the form (かみだけ書いておいてください). The book waits until his next visit (つぎに来たとき), which is not today.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:wo', 'g:tai', 'g:n-desu', 'g:ka', 'g:ne', 'g:potential', 'g:nakereba-naranai', 'g:te-kudasai', 'g:dake', 'g:te-oku', 'g:yo', 'g:noun-modifier', 'g:mo', 'g:no', 'g:kedo', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:図書館|としょかん', 'v:この|この', 'v:本|ほん', 'v:借りる|かりる', 'v:持つ|もつ', 'v:初めて|はじめて', 'v:去年|きょねん', 'v:一度|いちど', 'v:方|かた', 'v:もう一度|もういちど', 'v:こちら|こちら', 'v:紙|かみ', 'v:名前|なまえ', 'v:住所|じゅうしょ', 'v:書く|かく', 'v:それから|それから', 'v:分かる|わかる', 'v:物|もの', 'v:見せる|みせる', 'v:頂く|いただく', 'v:今日|きょう', 'v:何|なに', 'v:次|つぎ', 'v:来る|くる', 'v:時|とき', 'v:する|する', 'k:男', 'k:人', 'k:女', 'k:話', 'k:本', 'k:借', 'k:去', 'k:年', 'k:一', 'k:度', 'k:書', 'k:見', 'k:何', 'k:持', 'k:来'],
    verified: true }),

  L({ id: 'l:n4-concert-bank-first', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: '[電話|でんわ]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'あしたの　コンサート、[六|ろく][時|じ]に　[駅|えき]で　あおうか。' },
      { speaker: 'F', furigana: 'いいよ。でも、その　[前|まえ]に　[銀行|ぎんこう]に　よらなくちゃ。きっぷの　お[金|かね]、まだ　はらって　ないから。' },
      { speaker: 'M', furigana: 'きっぷって、かいじょうで　はらうの？' },
      { speaker: 'F', furigana: 'そう。[入口|いりぐち]で　はらうんだって。' },
      { speaker: 'M', furigana: 'そうか。ぼくは　[駅|えき]の　[本|ほん][屋|や]で　[本|ほん]を　[買|か]いたいから、[五|ご][時|じ][半|はん]に　[本|ほん][屋|や]で　あわない？' },
      { speaker: 'F', furigana: '[銀行|ぎんこう]に　[行|い]ってからでも　まにあうから、それで　いいよ。' }],
    question: '[女|おんな]の　[人|ひと]は　あした　まず　どこへ　[行|い]きますか。',
    options: ['[本|ほん][屋|や]', '[銀行|ぎんこう]', '[駅|えき]の　[入口|いりぐち]', 'コンサートの　かいじょう'], answer: 1,
    en: 'Narrator: On the phone, a man and a woman are talking. Where will the woman go first tomorrow? — M: For tomorrow\'s concert, shall we meet at the station at six? F: OK. But before that I have to stop by the bank. I haven\'t paid for the ticket yet. M: The ticket, you pay at the venue? F: Yes. Apparently you pay at the entrance. M: I see. I want to buy a book at the station bookshop, so shall we meet at the bookshop at five thirty? F: I can make it even after going to the bank, so that\'s fine. — Where will the woman go first tomorrow?',
    explain: 'She has to stop at the bank before anything else (その前に銀行によらなくちゃ), and she says she can still reach the bookshop at 5:30 after the bank. The bookshop and the concert hall come later.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:volitional', 'g:nakucha-ikenai', 'g:kara', 'g:tte', 'g:no', 'g:tai', 'g:te-kara', 'g:yo', 'g:ni', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:電話|でんわ', 'v:明日|あした', 'v:コンサート|コンサート', 'v:六|ろく', 'v:時|じ', 'v:駅|えき', 'v:会う|あう', 'v:いい|いい', 'v:でも|でも', 'v:その|その', 'v:前|まえ', 'v:銀行|ぎんこう', 'v:寄る|よる', 'v:切符|きっぷ', 'v:お金|おかね', 'v:まだ|まだ', 'v:払う|はらう', 'v:会場|かいじょう', 'v:そう|そう', 'v:入口|いりぐち', 'v:僕|ぼく', 'v:本|ほん', 'v:屋|や', 'v:買う|かう', 'v:五|ご', 'v:半|はん', 'v:行く|いく', 'v:間に合う|まにあう', 'v:それで|それで', 'v:まず|まず', 'v:どこ|どこ', 'k:電', 'k:話', 'k:男', 'k:人', 'k:女', 'k:六', 'k:時', 'k:駅', 'k:前', 'k:銀', 'k:行', 'k:金', 'k:入', 'k:口', 'k:本', 'k:屋', 'k:買', 'k:五', 'k:半'],
    verified: true }),

  L({ id: 'l:n4-hotel-bags-first', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: 'ホテルで　[女|おんな]の　[人|ひと]と　ホテルの　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'よやくして　いる　[北山|きたやま]です。' },
      { speaker: 'M', furigana: '[北山|きたやま]さまですね。もうしわけ　ありませんが、おへやの　じゅんびに　[三|さん][時|じ]まで　かかります。' },
      { speaker: 'F', furigana: 'そうですか。じゃあ、それまで　[町|まち]を　[見|み]に　[行|い]って　きます。' },
      { speaker: 'M', furigana: 'おにもつは　こちらで　おあずかり　しましょうか。' },
      { speaker: 'F', furigana: 'たすかります。それと、[町|まち]の　ちずは　ありますか。' },
      { speaker: 'M', furigana: 'ちずは　[入口|いりぐち]の　よこに　ございます。ごじゆうに　おとり　ください。' },
      { speaker: 'F', furigana: 'じゃあ、にもつを　おねがいしてから、ちずを　もらいますね。' }],
    question: '[女|おんな]の　[人|ひと]は　まず　[何|なに]を　しますか。',
    options: ['ちずを　もらう', 'へやに　[入|はい]る', '[町|まち]を　[見|み]に　[行|い]く', 'にもつを　あずける'], answer: 3,
    names: ['北山|きたやま'],
    en: 'Narrator: At a hotel, a woman and a hotel employee are talking. What will the woman do first? — F: I\'m Kitayama, I have a reservation. M: Ms. Kitayama. I\'m very sorry, but your room won\'t be ready until three. F: I see. Then I\'ll go and look around the town until then. M: Shall we keep your luggage here? F: That helps. Also, do you have a map of the town? M: The maps are next to the entrance. Please take one. F: Then I\'ll leave my luggage with you first, and then get a map. — What will the woman do first?',
    explain: 'She puts the order in words at the end: にもつをおねがいしてから、ちずをもらいます, so the luggage comes first and the map second. The room is not ready until three, and the walk around town comes after both.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:made', 'g:ni-iku', 'g:te-kuru', 'g:mashou-ka', 'g:gozaimasu', 'g:o-kudasai', 'g:te-kara', 'g:ne', 'g:ka', 'g:no', 'v:ホテル|ホテル', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:予約|よやく', 'v:様|さま', 'v:部屋|へや', 'v:準備|じゅんび', 'v:三|さん', 'v:時|じ', 'v:かかる|かかる', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:町|まち', 'v:見る|みる', 'v:行く|いく', 'v:荷物|にもつ', 'v:こちら|こちら', 'v:地図|ちず', 'v:ある|ある', 'v:入口|いりぐち', 'v:横|よこ', 'v:ございます|ございます', 'v:自由|じゆう', 'v:取る|とる', 'v:もらう|もらう', 'v:入る|はいる', 'v:まず|まず', 'v:何|なに', 'v:する|する', 'k:女', 'k:人', 'k:話', 'k:北', 'k:山', 'k:三', 'k:時', 'k:町', 'k:見', 'k:行', 'k:入', 'k:口', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-fever-medicine-on-way', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: '[電話|でんわ]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'いま　どこ？' },
      { speaker: 'M', furigana: '[駅|えき]を　[出|で]た　ところだよ。どう　したの？' },
      { speaker: 'F', furigana: 'こどもが　ねつを　[出|だ]しちゃって。かえりに　くすりを　[買|か]って　きて　くれない？' },
      { speaker: 'M', furigana: 'いいよ。いつもの　ねつの　くすり？' },
      { speaker: 'F', furigana: 'そう。それから、つめたい　[飲|の]みものも　おねがい。' },
      { speaker: 'M', furigana: 'わかった。[飲|の]みものは　うちの　ちかくの　みせで　[買|か]うよ。くすりやは　[駅|えき]の　[前|まえ]だから、さきに　くすりを　[買|か]って　いくね。' }],
    question: '[男|おとこ]の　[人|ひと]は　このあと　まず　[何|なに]を　しますか。',
    options: ['[飲|の]みものを　[買|か]う', 'すぐ　うちに　かえる', 'くすりを　[買|か]う', 'ねつの　くすりを　さがす'], answer: 2,
    en: 'Narrator: On the phone, a man and a woman are talking. What will the man do first after this? — F: Where are you now? M: I\'ve just left the station. What\'s wrong? F: Our child has a fever. Could you buy medicine on your way home? M: Sure. The usual fever medicine? F: Yes. And something cold to drink, please. M: Got it. I\'ll buy the drinks at the shop near home. The pharmacy is in front of the station, so I\'ll get the medicine first. — What will the man do first after this?',
    explain: 'The pharmacy is right by the station he just left, so he buys the medicine first (さきにくすりを買っていく). The drinks wait for the shop near home, and he goes home only after both. He already knows which medicine; there is nothing to look for.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:tokoro-da', 'g:yo', 'g:no', 'g:te-shimau', 'g:te-kuru', 'g:te-kureru', 'g:mo', 'g:kara', 'g:te-iku', 'g:ne', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:電話|でんわ', 'v:今|いま', 'v:どこ|どこ', 'v:駅|えき', 'v:出る|でる', 'v:どう|どう', 'v:する|する', 'v:子供|こども', 'v:熱|ねつ', 'v:出す|だす', 'v:帰り|かえり', 'v:薬|くすり', 'v:買う|かう', 'v:いい|いい', 'v:いつも|いつも', 'v:そう|そう', 'v:それから|それから', 'v:冷たい|つめたい', 'v:飲み物|のみもの', 'v:分かる|わかる', 'v:うち|うち', 'v:近く|ちかく', 'v:店|みせ', 'v:屋|や', 'v:前|まえ', 'v:先|さき', 'v:行く|いく', 'v:帰る|かえる', 'v:探す|さがす', 'v:この|この', 'v:後|あと', 'v:まず|まず', 'v:何|なに', 'k:電', 'k:話', 'k:男', 'k:人', 'k:女', 'k:駅', 'k:出', 'k:買', 'k:飲', 'k:前', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-hike-what-to-bring', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: '[学校|がっこう]で　[先生|せんせい]が　[学生|がくせい]に　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[明日|あした]は　[山|やま]へ　[行|い]きます。[八|はち][時|じ]までに　[学校|がっこう]に　[来|き]て　ください。' },
      { speaker: 'F', furigana: 'おべんとうを　わすれないで　くださいね。おかしは　[持|も]って　[来|こ]なくても　いいです。[山|やま]の　[上|うえ]で　みんなに　くばりますから。' },
      { speaker: 'F', furigana: '[雨|あめ]が　ふるかもしれませんが、かさは　いりません。バスの　[中|なか]に　ありますから。' },
      { speaker: 'F', furigana: 'それから、[水|みず]は　[山|やま]で　[買|か]えないので、かならず　[持|も]って　[来|き]て　ください。' }],
    question: '[学生|がくせい]は　[明日|あした]　[何|なに]を　[持|も]って　いきますか。',
    options: ['おべんとうと　[水|みず]', 'おべんとうと　おかし', 'おかしと　かさ', '[水|みず]と　かさ'], answer: 0,
    en: 'Narrator: At a school, a teacher is talking to the students. What will the students take tomorrow? — F: Tomorrow we\'re going to the mountains. Please come to school by eight. Don\'t forget your lunch. You don\'t have to bring snacks; I\'ll hand them out to everyone at the top. It may rain, but you don\'t need umbrellas: there are some on the bus. And you can\'t buy water on the mountain, so be sure to bring some. — What will the students take tomorrow?',
    explain: 'Lunch (わすれないでください) and water (かならず持ってきてください) are the two things to bring. Snacks are handed out at the top (持って来なくてもいい), and umbrellas are on the bus (いりません).',
    uses: ['g:de', 'g:ga', 'g:ni', 'g:te-iru', 'g:ni-ikimasu', 'g:made-ni', 'g:te-kudasai', 'g:nai-de-kudasai', 'g:ne', 'g:nakute-mo-ii', 'g:kara', 'g:kamo-shirenai', 'g:node', 'g:potential', 'g:te-iku', 'g:to', 'g:wo', 'v:学校|がっこう', 'v:先生|せんせい', 'v:学生|がくせい', 'v:話す|はなす', 'v:明日|あした', 'v:山|やま', 'v:行く|いく', 'v:八|はち', 'v:時|じ', 'v:来る|くる', 'v:お弁当|おべんとう', 'v:忘れる|わすれる', 'v:お菓子|おかし', 'v:持つ|もつ', 'v:いい|いい', 'v:上|うえ', 'v:みんな|みんな', 'v:雨|あめ', 'v:降る|ふる', 'v:傘|かさ', 'v:要る|いる', 'v:バス|バス', 'v:中|なか', 'v:ある|ある', 'v:それから|それから', 'v:水|みず', 'v:買う|かう', 'v:必ず|かならず', 'v:何|なに', 'k:学', 'k:校', 'k:先', 'k:生', 'k:話', 'k:明', 'k:日', 'k:山', 'k:行', 'k:八', 'k:時', 'k:来', 'k:持', 'k:上', 'k:雨', 'k:中', 'k:水', 'k:買', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-moving-day-boxes', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: '[大学|だいがく]で　[男|おとこ]の　[学生|がくせい]と　[女|おんな]の　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'ケンさん、[土曜日|どようび]の　ひっこし、てつだって　くれて　ありがとう。' },
      { speaker: 'M', furigana: 'いいよ。[何|なに]か　[持|も]って　いく　ものは　ある？' },
      { speaker: 'F', furigana: 'じゃあ、くるまを　かして　もらえないかな。' },
      { speaker: 'M', furigana: 'ごめん、[土曜日|どようび]は　[兄|あに]が　くるまを　つかうんだ。' },
      { speaker: 'F', furigana: 'そっか。じゃあ、くるまは　[父|ちち]に　たのんで　みる。それなら、はこを　いくつか　[持|も]って　きて　くれる？　[本|ほん]が　おおくて、はこが　たりないの。' },
      { speaker: 'M', furigana: 'わかった。うちに　ある　はこ、ぜんぶ　[持|も]って　いくよ。ひもは？' },
      { speaker: 'F', furigana: 'ひもは　もう　[買|か]って　あるから、だいじょうぶ。' }],
    question: '[男|おとこ]の　[学生|がくせい]は　[土曜日|どようび]に　[何|なに]を　[持|も]って　いきますか。',
    options: ['くるま', 'ひも', '[本|ほん]', 'はこ'], answer: 3,
    names: ['ケン'],
    en: 'Narrator: At a university, a male student and a female student are talking. What will the male student take on Saturday? — F: Ken, thanks for helping with my move on Saturday. M: No problem. Is there anything I should bring? F: Then could you lend me your car? M: Sorry, my brother is using the car on Saturday. F: I see. Then I\'ll try asking my dad for a car. In that case, could you bring a few boxes? I have a lot of books and not enough boxes. M: Got it. I\'ll bring all the boxes we have at home. What about string? F: I\'ve already bought string, so it\'s fine. — What will he take on Saturday?',
    explain: 'His brother has the car that day, so she will ask her father instead. She asks him for boxes because her books will not fit, and the string is already bought (買ってある). The books are hers, not something he brings.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:te-kurete-arigatou', 'g:te-kureru', 'g:te-morau', 'g:potential', 'g:kana-kashira', 'g:te-miru', 'g:nara', 'g:te-adj-noun', 'g:no', 'g:te-aru', 'g:kara', 'g:te-iku', 'g:te-kuru', 'g:ka', 'g:yo', 'v:大学|だいがく', 'v:男|おとこ', 'v:学生|がくせい', 'v:女|おんな', 'v:話す|はなす', 'v:さん|さん', 'v:土曜日|どようび', 'v:引っ越す|ひっこす', 'v:手伝う|てつだう', 'v:くれる|くれる', 'v:いい|いい', 'v:何|なに', 'v:持つ|もつ', 'v:行く|いく', 'v:物|もの', 'v:ある|ある', 'v:じゃあ|じゃあ', 'v:車|くるま', 'v:貸す|かす', 'v:もらう|もらう', 'v:兄|あに', 'v:使う|つかう', 'v:父|ちち', 'v:頼む|たのむ', 'v:箱|はこ', 'v:いくつ|いくつ', 'v:来る|くる', 'v:本|ほん', 'v:多い|おおい', 'v:足りる|たりる', 'v:分かる|わかる', 'v:うち|うち', 'v:全部|ぜんぶ', 'v:もう|もう', 'v:買う|かう', 'v:大丈夫|だいじょうぶ', 'k:大', 'k:学', 'k:男', 'k:生', 'k:女', 'k:話', 'k:土', 'k:曜', 'k:日', 'k:何', 'k:持', 'k:兄', 'k:父', 'k:本', 'k:買'],
    verified: true }),

  L({ id: 'l:n4-first-day-papers', format: 'task', // mock-2
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'きょうから　おせわに　なります、[大野|おおの]です。' },
      { speaker: 'F', furigana: 'よろしく　おねがいします。[大野|おおの]さん、しゃしんを　[二|に]まい　[出|だ]して　ほしいんですが、[持|も]って　きましたか。' },
      { speaker: 'M', furigana: 'すみません。わすれて　しまいました。' },
      { speaker: 'F', furigana: 'じゃあ、それは　[明日|あした]で　いいですよ。きょうは　[十|じゅう][一|いち][時|じ]から　あたらしい　[人|ひと]の　ための　せつめいかいが　あります。' },
      { speaker: 'F', furigana: 'その　[前|まえ]に、この　かみに　じゅうしょと　[電話|でんわ]ばんごうを　[書|か]いて　おいて　ください。' },
      { speaker: 'M', furigana: 'わかりました。すぐ　[書|か]きます。' }],
    question: '[男|おとこ]の　[人|ひと]は　このあと　まず　[何|なに]を　しますか。',
    options: ['しゃしんを　[出|だ]す', 'じゅうしょを　[書|か]く', 'せつめいかいに　[出|で]る', 'しゃしんを　とりに　[行|い]く'], answer: 1,
    names: ['大野|おおの'],
    en: 'Narrator: At a company, a man and a woman are talking. What will the man do first after this? — M: I\'m Ono, starting today. I look forward to working with you. F: Nice to have you. Mr. Ono, I\'d like you to hand in two photos; did you bring them? M: Sorry, I forgot them. F: Then tomorrow is fine for that. Today there\'s an orientation for new people from eleven. Before that, please write your address and phone number on this sheet. M: Got it. I\'ll write it right away. — What will the man do first after this?',
    explain: 'The photos can come tomorrow, and the orientation starts at eleven. Before it (その前に) he fills in the sheet with his address and phone number, and he says すぐ書きます.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:kara', 'g:te-hoshii', 'g:n-desu', 'g:te-kuru', 'g:ka', 'g:te-shimau', 'g:yo', 'g:te-oku', 'g:te-kudasai', 'g:no', 'g:ni-iku', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:今日|きょう', 'v:世話|せわ', 'v:なる|なる', 'v:さん|さん', 'v:写真|しゃしん', 'v:二|に', 'v:枚|まい', 'v:出す|だす', 'v:持つ|もつ', 'v:来る|くる', 'v:忘れる|わすれる', 'v:じゃあ|じゃあ', 'v:それ|それ', 'v:明日|あした', 'v:いい|いい', 'v:十|じゅう', 'v:一|いち', 'v:時|じ', 'v:新しい|あたらしい', 'v:為|ため', 'v:説明|せつめい', 'v:会|かい', 'v:ある|ある', 'v:その|その', 'v:前|まえ', 'v:この|この', 'v:紙|かみ', 'v:住所|じゅうしょ', 'v:電話|でんわ', 'v:番号|ばんごう', 'v:書く|かく', 'v:分かる|わかる', 'v:出る|でる', 'v:撮る|とる', 'v:行く|いく', 'v:後|あと', 'v:まず|まず', 'v:何|なに', 'v:する|する', 'k:男', 'k:人', 'k:女', 'k:話', 'k:大', 'k:野', 'k:二', 'k:出', 'k:持', 'k:明', 'k:日', 'k:十', 'k:一', 'k:時', 'k:前', 'k:電', 'k:書', 'k:何', 'k:行'],
    verified: true }),

  L({ id: 'l:n4-laptop-repair-or-new', format: 'task', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[電気|でんき][屋|や]で　[女|おんな]の　[人|ひと]と　[店|みせ]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'この　パソコン、きゅうに　うごかなく　なって　しまったんです。なおりますか。' },
      { speaker: 'M', furigana: '[見|み]て　みますね。……[中|なか]が　こわれて　いますね。なおすのに　[二|に]しゅうかんぐらい　かかります。' },
      { speaker: 'F', furigana: '[二|に]しゅうかんですか。しごとで　まいにち　つかうので、こまります。' },
      { speaker: 'M', furigana: '[新|あたら]しい　ものなら、きょう　[持|も]って　かえれますよ。' },
      { speaker: 'F', furigana: '[新|あたら]しいのは　いくらぐらいですか。' },
      { speaker: 'M', furigana: 'これは　[五|ご][万|まん][円|えん]です。なおすと　[三|さん][万|まん][円|えん]ぐらいです。' },
      { speaker: 'F', furigana: 'うーん。でも、[二|に]しゅうかんも　まてないし、[新|あたら]しいのに　します。' }],
    question: '[女|おんな]の　[人|ひと]は　どう　しますか。',
    options: ['[新|あたら]しい　パソコンを　[買|か]う', 'パソコンを　なおして　もらう', '[二|に]しゅうかん　まつ', 'ほかの　[店|みせ]に　[行|い]く'], answer: 0,
    en: 'Narrator: At an electronics shop, a woman and a shop assistant are talking. What will the woman do? — F: This computer suddenly stopped working. Can it be fixed? M: Let me have a look. ... The inside is broken. Fixing it takes about two weeks. F: Two weeks? I use it for work every day, so that\'s a problem. M: If it\'s a new one, you can take it home today. F: About how much is a new one? M: This one is 50,000 yen. Fixing yours would be about 30,000 yen. F: Hmm. But I can\'t wait as long as two weeks, so I\'ll take a new one. — What will the woman do?',
    explain: 'The repair is cheaper but takes two weeks, and she needs the computer every day. She ends with 新しいのにします, "I\'ll go with a new one". She never talks about another shop.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:te-shimau', 'g:naru', 'g:n-desu', 'g:ka', 'g:te-miru', 'g:ne', 'g:node', 'g:nara', 'g:potential', 'g:yo', 'g:to-conditional', 'g:number-mo', 'g:shi', 'g:te-morau', 'v:電気|でんき', 'v:屋|や', 'v:女|おんな', 'v:人|ひと', 'v:店|みせ', 'v:話す|はなす', 'v:この|この', 'v:パソコン|パソコン', 'v:急|きゅう', 'v:動く|うごく', 'v:なる|なる', 'v:直る|なおる', 'v:見る|みる', 'v:中|なか', 'v:壊れる|こわれる', 'v:直す|なおす', 'v:二|に', 'v:週間|しゅうかん', 'v:かかる|かかる', 'v:仕事|しごと', 'v:毎日|まいにち', 'v:使う|つかう', 'v:困る|こまる', 'v:新しい|あたらしい', 'v:物|もの', 'v:今日|きょう', 'v:持つ|もつ', 'v:帰る|かえる', 'v:いくら|いくら', 'v:これ|これ', 'v:五|ご', 'v:万|まん', 'v:円|えん', 'v:三|さん', 'v:でも|でも', 'v:待つ|まつ', 'v:する|する', 'v:どう|どう', 'v:買う|かう', 'v:ほか|ほか', 'v:行く|いく', 'k:電', 'k:気', 'k:屋', 'k:女', 'k:人', 'k:店', 'k:話', 'k:見', 'k:中', 'k:二', 'k:新', 'k:持', 'k:五', 'k:万', 'k:円', 'k:三', 'k:買', 'k:行'],
    verified: true }),

  L({ id: 'l:n4-temple-bus-up', format: 'task', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[駅|えき]の　[前|まえ]で　[女|おんな]の　[人|ひと]が　[男|おとこ]の　[人|ひと]に　みちを　[聞|き]いて　います。' },
      { speaker: 'F', furigana: 'すみません、[山|やま]の　[上|うえ]の　おてらへ　[行|い]きたいんですが、あるいて　どのぐらい　かかりますか。' },
      { speaker: 'M', furigana: 'あるくと　[一|いち][時|じ][間|かん]ぐらい　かかりますね。バスなら　にじゅっぷんです。' },
      { speaker: 'F', furigana: 'いい　てんきだから、あるいて　[行|い]こうかな。' },
      { speaker: 'M', furigana: 'でも、[午後|ごご]から　[雨|あめ]が　ふるそうですよ。[山|やま]の　みちは、[雨|あめ]が　ふると　すべりやすいですから。' },
      { speaker: 'F', furigana: 'そうですか。じゃあ、[行|い]きは　バスに　して、かえりは　てんきを　[見|み]て　きめます。' }],
    question: '[女|おんな]の　[人|ひと]は　どうやって　おてらへ　[行|い]きますか。',
    options: ['あるいて　[行|い]く', 'とちゅうまで　バスで　[行|い]く', 'バスで　[行|い]く', '[雨|あめ]が　やんでから　[行|い]く'], answer: 2,
    en: 'Narrator: In front of a station, a woman is asking a man the way. How will the woman get to the temple? — F: Excuse me, I want to go to the temple at the top of the mountain. How long does it take on foot? M: Walking takes about an hour. By bus it\'s twenty minutes. F: It\'s nice weather, so maybe I\'ll walk. M: But I hear it will rain from the afternoon. The mountain path gets slippery when it rains. F: I see. Then I\'ll take the bus there and decide about the way back when I see the weather. — How will the woman get to the temple?',
    explain: 'Her first idea was to walk, but rain is coming and the path gets slippery, so she takes the bus up (行きはバスにして). Only the way back is still open. She does not wait for the rain to stop, and nobody mentions getting off partway.',
    uses: ['g:de', 'g:ni', 'g:te-iru', 'g:tai', 'g:n-desu', 'g:ka', 'g:to-conditional', 'g:ne', 'g:nara', 'g:kara', 'g:volitional', 'g:kana-kashira', 'g:sou-da-hearsay', 'g:yasui', 'g:yo', 'g:te-kara', 'g:made', 'v:駅|えき', 'v:前|まえ', 'v:女|おんな', 'v:人|ひと', 'v:男|おとこ', 'v:道|みち', 'v:聞く|きく', 'v:山|やま', 'v:上|うえ', 'v:寺|てら', 'v:行く|いく', 'v:歩く|あるく', 'v:どの|どの', 'v:かかる|かかる', 'v:一|いち', 'v:時間|じかん', 'v:バス|バス', 'v:いい|いい', 'v:天気|てんき', 'v:でも|でも', 'v:午後|ごご', 'v:雨|あめ', 'v:降る|ふる', 'v:滑る|すべる', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:帰り|かえり', 'v:見る|みる', 'v:決める|きめる', 'v:途中|とちゅう', 'v:止む|やむ', 'v:どう|どう', 'k:駅', 'k:前', 'k:女', 'k:人', 'k:男', 'k:聞', 'k:山', 'k:上', 'k:行', 'k:一', 'k:時', 'k:間', 'k:午', 'k:後', 'k:雨', 'k:見'],
    verified: true }),

  L({ id: 'l:n4-handout-early-start', format: 'task', // diagnostic
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[中川|なかがわ]さん、この　しりょう、きょうじゅうに　まとめて　もらえないかな。' },
      { speaker: 'F', furigana: 'きょうですか。じつは　こんばん、ははの　たんじょうびで、はやく　かえらなければ　ならないんです。' },
      { speaker: 'M', furigana: 'そうか。じゃあ、[明日|あした]の　[朝|あさ]　[十|じゅう][時|じ]の　かいぎまでに　できれば　いいよ。' },
      { speaker: 'F', furigana: 'それなら、[明日|あした]は　いつもより　[一|いち][時|じ][間|かん]　はやく　[来|き]て　やります。' },
      { speaker: 'M', furigana: 'わるいね。たのむよ。' }],
    question: '[女|おんな]の　[人|ひと]は　[明日|あした]の　[朝|あさ]　まず　[何|なに]を　しますか。',
    options: ['かいぎに　[出|で]る', 'しりょうを　まとめる', 'ははと　しょくじする', 'のこって　しごとを　する'], answer: 1,
    names: ['中川|なかがわ'],
    en: 'Narrator: At a company, a man and a woman are talking. What will the woman do first tomorrow morning? — M: Ms. Nakagawa, could you put these materials together by the end of today? F: Today? Actually, tonight is my mother\'s birthday and I have to go home early. M: I see. Then it\'s fine if it\'s ready by the ten o\'clock meeting tomorrow morning. F: In that case, I\'ll come in an hour earlier than usual tomorrow and do it. M: Sorry about that. I\'m counting on you. — What will the woman do first tomorrow morning?',
    explain: 'She cannot stay late tonight because of her mother\'s birthday, so she will come in an hour early tomorrow and do the materials before the ten o\'clock meeting. The dinner is tonight, and staying late is what she said no to.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:te-morau', 'g:potential', 'g:kana-kashira', 'g:ka', 'g:nakereba-naranai', 'g:n-desu', 'g:made-ni', 'g:ba', 'g:yo', 'g:nara', 'g:ne', 'g:no', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:さん|さん', 'v:この|この', 'v:今日|きょう', 'v:もらう|もらう', 'v:今晩|こんばん', 'v:母|はは', 'v:誕生日|たんじょうび', 'v:早い|はやい', 'v:帰る|かえる', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:明日|あした', 'v:朝|あさ', 'v:十|じゅう', 'v:時|じ', 'v:会議|かいぎ', 'v:できる|できる', 'v:いい|いい', 'v:いつも|いつも', 'v:より|より', 'v:一|いち', 'v:時間|じかん', 'v:来る|くる', 'v:やる|やる', 'v:悪い|わるい', 'v:頼む|たのむ', 'v:出る|でる', 'v:食事|しょくじ', 'v:残る|のこる', 'v:仕事|しごと', 'v:する|する', 'v:まず|まず', 'v:何|なに', 'k:男', 'k:人', 'k:女', 'k:話', 'k:中', 'k:川', 'k:明', 'k:日', 'k:朝', 'k:十', 'k:時', 'k:一', 'k:間', 'k:来', 'k:何', 'k:出'],
    verified: true }),

  L({ id: 'l:n4-pool-sign-in', format: 'task', // diagnostic
    lines: [
      { speaker: 'N', furigana: 'プールの　うけつけで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'はじめての　かたですね。シャワーを　あびてから　プールに　[入|はい]って　ください。' },
      { speaker: 'M', furigana: 'あのう、みずぎを　わすれて　しまったんですが……。' },
      { speaker: 'F', furigana: 'こちらで　かりられますよ。[二|に][百|ひゃく][円|えん]です。それから、ぼうしも　ひつようです。' },
      { speaker: 'M', furigana: 'ぼうしは　[持|も]って　います。' },
      { speaker: 'F', furigana: 'では、さきに　この　かみに　おなまえを　[書|か]いて　ください。おかねは　おかえりの　ときに　いただきます。' }],
    question: '[男|おとこ]の　[人|ひと]は　まず　[何|なに]を　しますか。',
    options: ['みずぎを　かりる', 'シャワーを　あびる', 'お[金|かね]を　はらう', 'なまえを　[書|か]く'], answer: 3,
    en: 'Narrator: At the reception of a swimming pool, a man and a woman are talking. What will the man do first? — F: This is your first time, isn\'t it? Please take a shower before you go into the pool. M: Um, I forgot my swimsuit... F: You can borrow one here. It\'s 200 yen. A swimming cap is also needed. M: I have a cap. F: Then first, please write your name on this sheet. We\'ll take the money when you leave. — What will the man do first?',
    explain: 'She says さきにこのかみにおなまえを書いてください: the name comes first. Borrowing the swimsuit and the shower come after, and the money is paid on the way out (おかえりのとき).',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:ne', 'g:te-kara', 'g:te-kudasai', 'g:te-shimau', 'g:n-desu', 'g:potential', 'g:yo', 'g:hitsuyou', 'g:mo', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:プール|プール', 'v:受付|うけつけ', 'v:初めて|はじめて', 'v:方|かた', 'v:シャワー|シャワー', 'v:浴びる|あびる', 'v:入る|はいる', 'v:忘れる|わすれる', 'v:こちら|こちら', 'v:借りる|かりる', 'v:二|に', 'v:百|ひゃく', 'v:円|えん', 'v:それから|それから', 'v:帽子|ぼうし', 'v:必要|ひつよう', 'v:持つ|もつ', 'v:では|では', 'v:先|さき', 'v:この|この', 'v:紙|かみ', 'v:名前|なまえ', 'v:書く|かく', 'v:お金|おかね', 'v:帰り|かえり', 'v:時|とき', 'v:頂く|いただく', 'v:払う|はらう', 'v:まず|まず', 'v:何|なに', 'v:する|する', 'k:男', 'k:人', 'k:女', 'k:話', 'k:入', 'k:二', 'k:百', 'k:円', 'k:持', 'k:書', 'k:何', 'k:金'],
    verified: true }),

  L({ id: 'l:n4-presentation-practice', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: '[大学|だいがく]で　[男|おとこ]の　[学生|がくせい]と　[女|おんな]の　[学生|がくせい]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[来週|らいしゅう]の　はっぴょう、どう　わけようか。' },
      { speaker: 'F', furigana: 'わたしが　しらべた　ことを　[書|か]くから、ジョンさんは　しゃしんを　あつめて　くれない？' },
      { speaker: 'M', furigana: 'いいよ。でも、しゃしんは　もう　[先生|せんせい]に　もらったよ。' },
      { speaker: 'F', furigana: 'そうなの？　じゃあ、[話|はな]す　れんしゅうを　して　ほしいな。わたし、[人|ひと]の　[前|まえ]で　[話|はな]すのが　にがてで。' },
      { speaker: 'M', furigana: 'わかった。じゃあ、きょうから　れんしゅうして　おくよ。' }],
    question: '[男|おとこ]の　[学生|がくせい]は　このあと　[何|なに]を　しますか。',
    options: ['しゃしんを　あつめる', 'しらべた　ことを　[書|か]く', '[話|はな]す　れんしゅうを　する', '[先生|せんせい]に　しゃしんを　もらう'], answer: 2,
    names: ['ジョン'],
    en: 'Narrator: At a university, a male student and a female student are talking. What will the male student do after this? — M: How shall we split next week\'s presentation? F: I\'ll write up what I researched, so could you collect photos, John? M: Sure. But I already got photos from the teacher. F: Really? Then I\'d like you to practise the speaking part. I\'m bad at talking in front of people. M: Got it. Then I\'ll start practising today. — What will the male student do after this?',
    explain: 'The photos are already done (もう先生にもらった), and the writing is her part. She asks him to practise the talk (話すれんしゅうをしてほしい), and he agrees to start today.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:volitional', 'g:kara', 'g:te-kureru', 'g:yo', 'g:no', 'g:te-hoshii', 'g:te-oku', 'g:noun-modifier', 'g:ka', 'v:大学|だいがく', 'v:男|おとこ', 'v:学生|がくせい', 'v:女|おんな', 'v:話す|はなす', 'v:来週|らいしゅう', 'v:どう|どう', 'v:私|わたし', 'v:調べる|しらべる', 'v:事|こと', 'v:書く|かく', 'v:さん|さん', 'v:写真|しゃしん', 'v:集める|あつめる', 'v:くれる|くれる', 'v:いい|いい', 'v:でも|でも', 'v:もう|もう', 'v:先生|せんせい', 'v:もらう|もらう', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:練習|れんしゅう', 'v:人|ひと', 'v:前|まえ', 'v:分かる|わかる', 'v:今日|きょう', 'v:この|この', 'v:後|あと', 'v:何|なに', 'v:する|する', 'k:大', 'k:学', 'k:男', 'k:生', 'k:女', 'k:話', 'k:来', 'k:週', 'k:書', 'k:先', 'k:人', 'k:前', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-lunch-before-gas', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: 'くるまの　[中|なか]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'おなか　すいたね。さきに　おひるを　[食|た]べない？' },
      { speaker: 'M', furigana: 'そうだね。でも、ガソリンが　もう　すくないんだ。' },
      { speaker: 'F', furigana: 'この　さきに　ガソリンスタンドが　あるよ。' },
      { speaker: 'M', furigana: 'じゃあ、ガソリンを　[入|い]れてから、レストランに　[行|い]こう。' },
      { speaker: 'F', furigana: 'でも、あの　レストラン、[二|に][時|じ]までだよ。もう　[一|いち][時|じ][半|はん]だから……。' },
      { speaker: 'M', furigana: 'そうか。じゃあ、[先|さき]に　[食|た]べて、ガソリンは　その　あとに　しよう。' }],
    question: 'ふたりは　まず　[何|なに]を　しますか。',
    options: ['おひるを　[食|た]べる', 'ガソリンを　[入|い]れる', 'ガソリンスタンドを　さがす', 'レストランに　[電話|でんわ]する'], answer: 0,
    en: 'Narrator: In a car, a man and a woman are talking. What will the two of them do first? — F: I\'m hungry. Shall we eat lunch first? M: Yeah. But we\'re low on petrol. F: There\'s a petrol station up ahead. M: Then let\'s fill up and then go to the restaurant. F: But that restaurant is only open until two. It\'s already half past one... M: Right. Then let\'s eat first and get petrol after that. — What will they do first?',
    explain: 'The man first wants petrol, then lunch, but the restaurant closes at two and it is already 1:30. So he changes the order: 先に食べて、ガソリンはそのあと. They already know where the petrol station is.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:ne', 'g:yo', 'g:te-kara', 'g:volitional', 'g:made', 'g:kara', 'g:wo', 'g:ni', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:車|くるま', 'v:中|なか', 'v:おなか|おなか', 'v:空く|すく', 'v:先|さき', 'v:昼|ひる', 'v:食べる|たべる', 'v:そう|そう', 'v:でも|でも', 'v:ガソリン|ガソリン', 'v:もう|もう', 'v:少ない|すくない', 'v:この|この', 'v:ガソリンスタンド|ガソリンスタンド', 'v:ある|ある', 'v:じゃあ|じゃあ', 'v:入れる|いれる', 'v:レストラン|レストラン', 'v:行く|いく', 'v:あの|あの', 'v:二|に', 'v:時|じ', 'v:一|いち', 'v:半|はん', 'v:その|その', 'v:後|あと', 'v:する|する', 'v:探す|さがす', 'v:電話|でんわ', 'v:二人|ふたり', 'v:まず|まず', 'v:何|なに', 'k:中', 'k:男', 'k:人', 'k:女', 'k:話', 'k:食', 'k:入', 'k:行', 'k:二', 'k:時', 'k:一', 'k:半', 'k:先', 'k:何', 'k:電'],
    verified: true }),

  L({ id: 'l:n4-aircon-leave-key', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: '[電話|でんわ]で　[女|おんな]の　[人|ひと]と　アパートの　おおやさんが　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[二|に]かいの　[青木|あおき]です。へやの　れいぼうが　こわれて　しまったみたいなんです。' },
      { speaker: 'M', furigana: 'それは　こまりましたね。[明日|あした]の　[午前|ごぜん]に　[電気|でんき][屋|や]さんを　よびますが、おへやに　いますか。' },
      { speaker: 'F', furigana: '[明日|あした]は　しごとなんです。かぎを　あずけても　いいですか。' },
      { speaker: 'M', furigana: 'いいですよ。じゃあ、こんばん、わたしの　へやに　かぎを　[持|も]って　きて　ください。' },
      { speaker: 'F', furigana: 'わかりました。[八|はち][時|じ]ごろ　[行|い]きます。' }],
    question: '[女|おんな]の　[人|ひと]は　こんばん　[何|なに]を　しますか。',
    options: ['[電気|でんき][屋|や]さんを　よぶ', 'しごとを　[休|やす]む', 'れいぼうを　なおす', 'かぎを　[持|も]って　[行|い]く'], answer: 3,
    names: ['青木|あおき'],
    en: 'Narrator: On the phone, a woman and the landlord of her apartment are talking. What will the woman do tonight? — F: This is Aoki on the second floor. The air conditioner in my room seems to have broken. M: That\'s a nuisance. I\'ll call an electrician tomorrow morning; will you be in your room? F: I have work tomorrow. May I leave my key with you? M: That\'s fine. Then please bring the key to my place tonight. F: Got it. I\'ll come around eight. — What will the woman do tonight?',
    explain: 'She works tomorrow, so the landlord asks her to bring her key to his place tonight, and she says she will come around eight. The landlord calls the electrician, the repair is tomorrow, and she is not taking the day off.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:no', 'g:te-shimau', 'g:mitai', 'g:n-desu', 'g:ne', 'g:te-mo-ii', 'g:yo', 'g:te-kudasai', 'g:goro', 'g:ka', 'g:ni', 'v:電話|でんわ', 'v:女|おんな', 'v:人|ひと', 'v:アパート|アパート', 'v:話す|はなす', 'v:二|に', 'v:階|かい', 'v:部屋|へや', 'v:冷房|れいぼう', 'v:壊れる|こわれる', 'v:困る|こまる', 'v:明日|あした', 'v:午前|ごぜん', 'v:電気|でんき', 'v:屋|や', 'v:さん|さん', 'v:呼ぶ|よぶ', 'v:居る|いる', 'v:仕事|しごと', 'v:かぎ|かぎ', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:今晩|こんばん', 'v:私|わたし', 'v:持つ|もつ', 'v:来る|くる', 'v:分かる|わかる', 'v:八|はち', 'v:時|じ', 'v:行く|いく', 'v:休む|やすむ', 'v:直す|なおす', 'v:何|なに', 'v:する|する', 'k:電', 'k:話', 'k:女', 'k:人', 'k:二', 'k:青', 'k:木', 'k:明', 'k:日', 'k:午', 'k:前', 'k:気', 'k:屋', 'k:持', 'k:八', 'k:時', 'k:行', 'k:何', 'k:休'],
    verified: true }),

  L({ id: 'l:n4-gloves-for-grandma', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: 'デパートで　[女|おんな]の　[人|ひと]と　[店|みせ]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'そぼの　たんじょうびに　[何|なに]か　おくりたいんですが。' },
      { speaker: 'M', furigana: 'それでしたら、こちらの　セーターは　いかがですか。とても　あたたかいですよ。' },
      { speaker: 'F', furigana: 'セーターは　[去年|きょねん]　あげたんです。' },
      { speaker: 'M', furigana: 'では、てぶくろは　いかがでしょう。' },
      { speaker: 'F', furigana: 'いいですね。そぼは　[花|はな]が　すきなので、[花|はな]の　ような　[色|いろ]が　いいんですが。' },
      { speaker: 'M', furigana: 'こちらに　[赤|あか]い　ものと　きいろい　ものが　ございます。' },
      { speaker: 'F', furigana: 'じゃあ、[赤|あか]いのに　します。' }],
    question: '[女|おんな]の　[人|ひと]は　[何|なに]を　[買|か]いますか。',
    options: ['きいろい　てぶくろ', '[赤|あか]い　てぶくろ', '[赤|あか]い　セーター', 'きいろい　セーター'], answer: 1,
    en: 'Narrator: At a department store, a woman and a shop assistant are talking. What will the woman buy? — F: I\'d like to send something for my grandmother\'s birthday. M: In that case, how about this sweater? It\'s very warm. F: I gave her a sweater last year. M: Then how about gloves? F: Good idea. My grandmother likes flowers, so I\'d like a colour like flowers. M: We have red ones and yellow ones here. F: Then I\'ll take the red ones. — What will the woman buy?',
    explain: 'A sweater was the assistant\'s first idea, but she gave one last year, so it is gloves. Of the red and yellow gloves she says 赤いのにします.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:tai', 'g:n-desu', 'g:ka', 'g:yo', 'g:deshou', 'g:ne', 'g:node', 'g:no-you-na', 'g:gozaimasu', 'g:no', 'v:デパート|デパート', 'v:女|おんな', 'v:人|ひと', 'v:店|みせ', 'v:話す|はなす', 'v:祖母|そぼ', 'v:誕生日|たんじょうび', 'v:何|なに', 'v:送る|おくる', 'v:こちら|こちら', 'v:セーター|セーター', 'v:いかが|いかが', 'v:とても|とても', 'v:暖かい|あたたかい', 'v:去年|きょねん', 'v:あげる|あげる', 'v:では|では', 'v:手袋|てぶくろ', 'v:いい|いい', 'v:花|はな', 'v:好き|すき', 'v:色|いろ', 'v:赤い|あかい', 'v:黄色い|きいろい', 'v:物|もの', 'v:ございます|ございます', 'v:じゃあ|じゃあ', 'v:する|する', 'v:買う|かう', 'k:女', 'k:人', 'k:店', 'k:話', 'k:何', 'k:去', 'k:年', 'k:花', 'k:色', 'k:赤', 'k:買'],
    verified: true }),

  L({ id: 'l:n4-trip-ticket-only', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[来週|らいしゅう]の　おおさかの　しごと、しんかんせんの　きっぷは　もう　[買|か]いましたか。' },
      { speaker: 'F', furigana: 'まだです。[水曜日|すいようび]の　[朝|あさ]の　きっぷで　いいですか。' },
      { speaker: 'M', furigana: 'いや、[水曜日|すいようび]の　[朝|あさ]は　かいぎが　[入|はい]って　しまったんです。[火曜日|かようび]の　[夜|よる]に　[行|い]って、ホテルに　とまりましょう。' },
      { speaker: 'F', furigana: 'わかりました。じゃあ、きっぷと　ホテルを　よやくして　おきます。' },
      { speaker: 'M', furigana: 'ホテルは　わたしが　もう　とって　あるから、きっぷだけで　いいですよ。' }],
    question: '[女|おんな]の　[人|ひと]は　このあと　[何|なに]を　しますか。',
    options: ['[火曜日|かようび]の　きっぷを　[買|か]う', '[水曜日|すいようび]の　きっぷを　[買|か]う', 'ホテルを　よやくする', 'かいぎに　[出|で]る'], answer: 0,
    en: 'Narrator: At a company, a man and a woman are talking. What will the woman do after this? — M: For next week\'s work in Osaka, have you bought the bullet-train tickets yet? F: Not yet. Is a Wednesday morning ticket all right? M: No, a meeting has come up on Wednesday morning. Let\'s go on Tuesday evening and stay at a hotel. F: Got it. Then I\'ll book the tickets and the hotel. M: I\'ve already booked the hotel, so just the tickets is fine. — What will the woman do after this?',
    explain: 'Wednesday morning is out because of a new meeting, so they travel on Tuesday evening. He has already booked the hotel (とってある), so she only buys the tickets, for Tuesday.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:ka', 'g:mashita', 'g:te-shimau', 'g:n-desu', 'g:mashou', 'g:te-oku', 'g:te-aru', 'g:kara', 'g:dake', 'g:yo', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:来週|らいしゅう', 'v:仕事|しごと', 'v:切符|きっぷ', 'v:もう|もう', 'v:買う|かう', 'v:まだ|まだ', 'v:水曜日|すいようび', 'v:朝|あさ', 'v:いい|いい', 'v:会議|かいぎ', 'v:入る|はいる', 'v:火曜日|かようび', 'v:夜|よる', 'v:行く|いく', 'v:ホテル|ホテル', 'v:泊まる|とまる', 'v:分かる|わかる', 'v:じゃあ|じゃあ', 'v:予約|よやく', 'v:私|わたし', 'v:取る|とる', 'v:出る|でる', 'v:この|この', 'v:後|あと', 'v:何|なに', 'v:する|する', 'k:男', 'k:人', 'k:女', 'k:話', 'k:来', 'k:週', 'k:買', 'k:水', 'k:曜', 'k:日', 'k:朝', 'k:入', 'k:火', 'k:夜', 'k:行', 'k:何', 'k:出'],
    verified: true }),

  L({ id: 'l:n4-cat-sitting-water', format: 'task', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[来週|らいしゅう]、みっかほど　りょこうに　[行|い]くんだけど、その　あいだ、うちの　ねこを　[見|み]に　[来|き]て　もらえない？' },
      { speaker: 'M', furigana: 'いいよ。まいにち　[行|い]けば　いい？' },
      { speaker: 'F', furigana: 'ううん、ごはんは　たくさん　おいて　いくから、だいじょうぶ。[水曜日|すいようび]に　[一度|いちど]だけ　[来|き]て　くれる？' },
      { speaker: 'M', furigana: 'わかった。[行|い]ったら、[何|なに]を　すれば　いい？' },
      { speaker: 'F', furigana: '[水|みず]を　とりかえて　ほしいの。それから、まどは　あけないでね。ねこが　にげちゃうから。' },
      { speaker: 'M', furigana: 'わかった。かぎは　いつ　もらえば　いい？' },
      { speaker: 'F', furigana: '[日曜日|にちようび]に　[持|も]って　いくね。' }],
    question: '[男|おとこ]の　[人|ひと]は　[水曜日|すいようび]に　[何|なに]を　しますか。',
    options: ['ねこに　ごはんを　あげる', 'まどを　あけて　おく', 'ねこの　[水|みず]を　とりかえる', 'かぎを　わたしに　[行|い]く'], answer: 2,
    en: 'Narrator: A man and a woman are talking. What will the man do on Wednesday? — F: Next week I\'m going on a trip for about three days. Could you come and check on my cat while I\'m away? M: Sure. Should I come every day? F: No, I\'ll leave plenty of food, so it\'s fine. Could you come just once, on Wednesday? M: OK. When I go, what should I do? F: I\'d like you to change the water. And don\'t open the windows. The cat will get out. M: OK. When should I get the key? F: I\'ll bring it on Sunday. — What will the man do on Wednesday?',
    explain: 'She leaves plenty of food (ごはんはたくさんおいていく), so on Wednesday he only changes the water (水をとりかえてほしい). The windows must stay shut, and she brings him the key on Sunday.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:kedo', 'g:te-morau', 'g:potential', 'g:ni-iku', 'g:ba', 'g:kara', 'g:te-iku', 'g:dake', 'g:te-kureru', 'g:tara', 'g:te-hoshii', 'g:te-shimau', 'g:ne', 'g:no', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:来週|らいしゅう', 'v:三日|みっか', 'v:旅行|りょこう', 'v:行く|いく', 'v:その|その', 'v:間|あいだ', 'v:うち|うち', 'v:猫|ねこ', 'v:見る|みる', 'v:来る|くる', 'v:もらう|もらう', 'v:いい|いい', 'v:毎日|まいにち', 'v:御飯|ごはん', 'v:たくさん|たくさん', 'v:置く|おく', 'v:大丈夫|だいじょうぶ', 'v:水曜日|すいようび', 'v:一度|いちど', 'v:分かる|わかる', 'v:何|なに', 'v:する|する', 'v:水|みず', 'v:取り替える|とりかえる', 'v:それから|それから', 'v:窓|まど', 'v:開ける|あける', 'v:逃げる|にげる', 'v:かぎ|かぎ', 'v:いつ|いつ', 'v:日曜日|にちようび', 'v:持つ|もつ', 'v:あげる|あげる', 'v:渡す|わたす', 'k:男', 'k:人', 'k:女', 'k:話', 'k:来', 'k:週', 'k:行', 'k:見', 'k:水', 'k:曜', 'k:日', 'k:一', 'k:度', 'k:何', 'k:持'],
    verified: true }),

  // ── point (ポイント理解) ──
  L({ id: 'l:n4-dentist-next-visit', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: 'はいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'つぎの　よやくは　いつが　よろしいですか。' },
      { speaker: 'M', furigana: '[来週|らいしゅう]の　[水曜日|すいようび]の　[夕方|ゆうがた]は　あいて　いますか。' },
      { speaker: 'F', furigana: 'もうしわけ　ありません。[水曜日|すいようび]は　もう　いっぱいなんです。[木曜日|もくようび]の　[午前|ごぜん]なら　あいて　いますが。' },
      { speaker: 'M', furigana: '[午前|ごぜん]は　しごとが　あるので、ちょっと……。[金曜日|きんようび]は　どうですか。' },
      { speaker: 'F', furigana: '[金曜日|きんようび]は　おやすみなんです。[木曜日|もくようび]の　[夜|よる]　[七|しち][時|じ]は　いかがですか。' },
      { speaker: 'M', furigana: 'じゃあ、それで　おねがいします。' }],
    question: '[男|おとこ]の　[人|ひと]は　いつ　はいしゃに　[来|き]ますか。',
    options: ['[木曜日|もくようび]の　[夜|よる]', '[水曜日|すいようび]の　[夕方|ゆうがた]', '[木曜日|もくようび]の　[午前|ごぜん]', '[金曜日|きんようび]の　[夜|よる]'], answer: 0,
    en: 'Narrator: At a dentist\'s, a man and a woman are talking. When will the man come to the dentist? — F: When would you like your next appointment? M: Is next Wednesday evening free? F: I\'m very sorry. Wednesday is already full. Thursday morning is free, though. M: I work in the mornings, so that\'s a bit... How about Friday? F: We\'re closed on Friday. How about Thursday at seven in the evening? M: Then that, please. — When will the man come to the dentist?',
    explain: 'Wednesday evening is full, he works on Thursday morning, and the clinic is closed on Friday. He takes the last offer, Thursday at seven in the evening (木曜日の夜七時).',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:ka', 'g:n-desu', 'g:nara', 'g:node', 'g:ni', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:歯医者|はいしゃ', 'v:次|つぎ', 'v:予約|よやく', 'v:いつ|いつ', 'v:よろしい|よろしい', 'v:来週|らいしゅう', 'v:水曜日|すいようび', 'v:夕方|ゆうがた', 'v:空く|あく', 'v:もう|もう', 'v:いっぱい|いっぱい', 'v:木曜日|もくようび', 'v:午前|ごぜん', 'v:仕事|しごと', 'v:ある|ある', 'v:ちょっと|ちょっと', 'v:金曜日|きんようび', 'v:どう|どう', 'v:休み|やすみ', 'v:夜|よる', 'v:七|しち', 'v:時|じ', 'v:いかが|いかが', 'v:じゃあ|じゃあ', 'v:それで|それで', 'v:来る|くる', 'k:男', 'k:人', 'k:女', 'k:話', 'k:来', 'k:週', 'k:水', 'k:曜', 'k:日', 'k:夕', 'k:方', 'k:木', 'k:午', 'k:前', 'k:金', 'k:夜', 'k:七', 'k:時'],
    verified: true }),

  L({ id: 'l:n4-table-for-five', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: '[電話|でんわ]で　レストランの　[人|ひと]と　[男|おとこ]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'こんばん　[七|しち][時|じ]に　よ[人|にん]で　よやくした　[山下|やました]ですが……。' },
      { speaker: 'F', furigana: '[山下|やました]さまですね。' },
      { speaker: 'M', furigana: 'すみません、[一人|ひとり]　ふえて　[五|ご][人|にん]に　なったんですが、だいじょうぶですか。' },
      { speaker: 'F', furigana: '[七|しち][時|じ]ですと、[五|ご][人|にん]の　せきは　ちょっと……。[七|しち][時|じ][半|はん]も　いっぱいで、[八|はち][時|じ]からなら　ごよういできますが。' },
      { speaker: 'M', furigana: '[八|はち][時|じ]ですか。じゃあ、[八|はち][時|じ]に　して　ください。' },
      { speaker: 'F', furigana: 'かしこまりました。では、[五|ご][人|にん]さまで　[八|はち][時|じ]に　おまちして　います。' }],
    question: 'よやくは　[何|なん][時|じ]に　なりましたか。',
    options: ['[七|しち][時|じ]', '[七|しち][時|じ][半|はん]', '[八|はち][時|じ]', '[五|ご][時|じ]'], answer: 2,
    names: ['山下|やました'],
    en: 'Narrator: On the phone, a restaurant employee and a man are talking. What time is the booking now? — M: I\'m Yamashita; I booked for four people at seven tonight... F: Mr. Yamashita, yes. M: Sorry, one more person is coming, so we\'re five now. Is that all right? F: At seven, a table for five is a little... Half past seven is full too; from eight we can have one ready. M: Eight? Then please make it eight. F: Certainly. We\'ll expect five people at eight. — What time is the booking now?',
    explain: 'The booking was for seven, but there is no table for five at seven or at half past seven, so he moves it to eight (八時にしてください). 五 is the number of people, not the time.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:n-desu', 'g:naru', 'g:ka', 'g:ne', 'g:to-conditional', 'g:mo', 'g:nara', 'g:te-kudasai', 'g:ni', 'g:no', 'v:電話|でんわ', 'v:レストラン|レストラン', 'v:人|ひと', 'v:男|おとこ', 'v:話す|はなす', 'v:今晩|こんばん', 'v:七|しち', 'v:時|じ', 'v:人|にん', 'v:予約|よやく', 'v:様|さま', 'v:一人|ひとり', 'v:増える|ふえる', 'v:五|ご', 'v:なる|なる', 'v:大丈夫|だいじょうぶ', 'v:席|せき', 'v:ちょっと|ちょっと', 'v:半|はん', 'v:いっぱい|いっぱい', 'v:八|はち', 'v:用意|ようい', 'v:できる|できる', 'v:じゃあ|じゃあ', 'v:する|する', 'v:では|では', 'v:待つ|まつ', 'v:何|なん', 'k:電', 'k:話', 'k:人', 'k:男', 'k:七', 'k:時', 'k:山', 'k:下', 'k:一', 'k:五', 'k:半', 'k:八', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-why-quit-tennis', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'テニス、やめたんだって？　しごとが　いそがしいの？' },
      { speaker: 'F', furigana: 'しごとは　だいじょうぶなんだけど……。' },
      { speaker: 'M', furigana: 'じゃあ、お[金|かね]が　たいへん？' },
      { speaker: 'F', furigana: 'ううん。[先月|せんげつ]、[足|あし]を　けがして　しまって、いしゃに　しばらく　うんどうを　しないように　[言|い]われたの。' },
      { speaker: 'M', furigana: 'そうだったんだ。なおったら、また　やる？' },
      { speaker: 'F', furigana: 'もちろん。テニスは　だいすきだから。' }],
    question: '[女|おんな]の　[人|ひと]は　どうして　テニスを　やめましたか。',
    options: ['しごとが　いそがしいから', '[足|あし]を　けがしたから', 'お[金|かね]が　かかるから', 'テニスが　きらいに　なったから'], answer: 1,
    en: 'Narrator: A man and a woman are talking. Why did the woman quit tennis? — M: I hear you quit tennis? Are you busy with work? F: Work is fine, but... M: Then is it the money? F: No. Last month I hurt my leg, and the doctor told me not to exercise for a while. M: Oh, I see. Will you play again when it heals? F: Of course. I love tennis. — Why did the woman quit tennis?',
    explain: 'He guesses work and then money; she answers neither. She hurt her leg last month and the doctor told her not to exercise (言われた). She still loves tennis.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:tte', 'g:no', 'g:kedo', 'g:te-shimau', 'g:passive', 'g:tara', 'g:kara', 'g:naru', 'g:doushite', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:テニス|テニス', 'v:止める|やめる', 'v:仕事|しごと', 'v:忙しい|いそがしい', 'v:大丈夫|だいじょうぶ', 'v:じゃあ|じゃあ', 'v:お金|おかね', 'v:たいへん|たいへん', 'v:先月|せんげつ', 'v:足|あし', 'v:医者|いしゃ', 'v:しばらく|しばらく', 'v:運動|うんどう', 'v:する|する', 'v:言う|いう', 'v:そう|そう', 'v:治る|なおる', 'v:また|また', 'v:やる|やる', 'v:もちろん|もちろん', 'v:大好き|だいすき', 'v:かかる|かかる', 'v:嫌い|きらい', 'v:なる|なる', 'v:どうして|どうして', 'k:男', 'k:人', 'k:女', 'k:話', 'k:金', 'k:先', 'k:月', 'k:足', 'k:言'],
    verified: true }),

  L({ id: 'l:n4-left-on-train', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: '[駅|えき]で　[男|おとこ]の　[人|ひと]と　[駅|えき][員|いん]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'すみません、[電車|でんしゃ]の　[中|なか]に　わすれものを　して　しまったんですが。' },
      { speaker: 'F', furigana: 'どんな　ものですか。' },
      { speaker: 'M', furigana: '[黒|くろ]い　かばん……、いえ、ちがいました。かばんは　ここに　あります。かばんの　よこに　おいて　いた　かさです。' },
      { speaker: 'F', furigana: 'どんな　かさですか。' },
      { speaker: 'M', furigana: '[青|あお]くて、ながい　かさです。[父|ちち]に　もらった　だいじな　ものなんです。' },
      { speaker: 'F', furigana: '[青|あお]い　かさですね。しらべて　みますので、こちらで　おまち　ください。' }],
    question: '[男|おとこ]の　[人|ひと]は　[何|なに]を　わすれましたか。',
    options: ['[黒|くろ]い　かさ', '[黒|くろ]い　かばん', '[青|あお]い　かばん', '[青|あお]い　かさ'], answer: 3,
    en: 'Narrator: At a station, a man and a station employee are talking. What did the man leave behind? — M: Excuse me, I left something on the train. F: What kind of thing? M: A black bag... no, sorry, my mistake. The bag is right here. It\'s the umbrella I put next to the bag. F: What kind of umbrella? M: A long blue one. It\'s precious, my father gave it to me. F: A blue umbrella. I\'ll check, so please wait here. — What did the man leave behind?',
    explain: 'He starts to say a black bag, then corrects himself: the bag is with him. What he lost is the umbrella that was next to it, and it is blue (青くて長いかさ).',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:te-shimau', 'g:n-desu', 'g:ka', 'g:mashita', 'g:te-ita', 'g:te-adj-noun', 'g:noun-modifier', 'g:te-miru', 'g:node', 'g:o-kudasai', 'g:ne', 'g:no', 'v:駅|えき', 'v:男|おとこ', 'v:人|ひと', 'v:員|いん', 'v:話す|はなす', 'v:電車|でんしゃ', 'v:中|なか', 'v:忘れ物|わすれもの', 'v:する|する', 'v:どんな|どんな', 'v:物|もの', 'v:黒い|くろい', 'v:かばん|かばん', 'v:違う|ちがう', 'v:ここ|ここ', 'v:ある|ある', 'v:横|よこ', 'v:置く|おく', 'v:傘|かさ', 'v:青い|あおい', 'v:長い|ながい', 'v:父|ちち', 'v:もらう|もらう', 'v:大事|だいじ', 'v:調べる|しらべる', 'v:こちら|こちら', 'v:待つ|まつ', 'v:忘れる|わすれる', 'v:何|なに', 'k:駅', 'k:男', 'k:人', 'k:員', 'k:話', 'k:電', 'k:車', 'k:中', 'k:黒', 'k:青', 'k:父', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-farewell-party-recital', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[金曜日|きんようび]の　[山口|やまぐち]さんの　おわかれかい、こられますか。' },
      { speaker: 'M', furigana: 'それが、[行|い]けないんです。' },
      { speaker: 'F', furigana: 'えっ、しごとですか。' },
      { speaker: 'M', furigana: 'いえ、しごとは　[休|やす]めるんですけど、その　[日|ひ]は　むすめの　ピアノの　はっぴょうかいが　あるんです。' },
      { speaker: 'F', furigana: 'そうですか。かぜが　まだ　なおらないのかと　[思|おも]いました。' },
      { speaker: 'M', furigana: 'かぜは　もう　なおりました。[山口|やまぐち]さんには、[明日|あした]の　ひるごはんの　ときに　あいさつに　[行|い]きます。' }],
    question: '[男|おとこ]の　[人|ひと]は　どうして　おわかれかいに　[行|い]けませんか。',
    options: ['しごとを　[休|やす]む　ことが　できないから', 'かぜが　まだ　なおって　いないから', 'むすめの　はっぴょうかいが　あるから', 'ひるごはんの　ときに　[会|あ]うから'], answer: 2,
    names: ['山口|やまぐち'],
    en: 'Narrator: At a company, a man and a woman are talking. Why can\'t the man go to the farewell party? — F: Can you come to Ms. Yamaguchi\'s farewell party on Friday? M: Actually, I can\'t go. F: Oh, is it work? M: No, I can take the time off work, but that day is my daughter\'s piano recital. F: I see. I thought maybe your cold still hadn\'t got better. M: My cold is already better. I\'ll go and say goodbye to Ms. Yamaguchi at lunch tomorrow. — Why can\'t the man go?',
    explain: 'He can get the time off work, and his cold is better. The reason is his daughter\'s piano recital that day. Lunch tomorrow is when he will say goodbye, not why he misses the party.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:potential', 'g:n-desu', 'g:ka', 'g:kedo', 'g:to-omou', 'g:ni-iku', 'g:koto-ga-dekiru', 'g:kara', 'g:doushite', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:金曜日|きんようび', 'v:さん|さん', 'v:別れる|わかれる', 'v:会|かい', 'v:行く|いく', 'v:仕事|しごと', 'v:休む|やすむ', 'v:その|その', 'v:日|ひ', 'v:娘|むすめ', 'v:ピアノ|ピアノ', 'v:ある|ある', 'v:そう|そう', 'v:風邪|かぜ', 'v:まだ|まだ', 'v:治る|なおる', 'v:思う|おもう', 'v:もう|もう', 'v:明日|あした', 'v:昼御飯|ひるごはん', 'v:時|とき', 'v:挨拶|あいさつ', 'v:事|こと', 'v:できる|できる', 'v:会う|あう', 'v:どうして|どうして', 'k:男', 'k:人', 'k:女', 'k:話', 'k:金', 'k:曜', 'k:日', 'k:山', 'k:口', 'k:行', 'k:休', 'k:思', 'k:明', 'k:会'],
    verified: true }),

  L({ id: 'l:n4-apartment-sea-view', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[新|あたら]しい　アパート、どう？　[駅|えき]から　ちかいの？' },
      { speaker: 'F', furigana: 'ううん、[駅|えき]からは　あるいて　にじゅっぷんも　かかるの。' },
      { speaker: 'M', furigana: 'へやは　ひろい？' },
      { speaker: 'F', furigana: 'まえの　へやより　せまいよ。それに、となりが　こうえんで、ひるは　ちょっと　うるさいし。' },
      { speaker: 'M', furigana: 'じゃあ、どうして　そこに　したの？' },
      { speaker: 'F', furigana: 'まどから　[海|うみ]が　[見|み]えるの。それが　いちばん　[気|き]に　いってるんだ。' }],
    question: '[女|おんな]の　[人|ひと]は　[新|あたら]しい　アパートの　[何|なに]が　いちばん　いいと　[言|い]って　いますか。',
    options: ['[海|うみ]が　[見|み]える　こと', '[駅|えき]から　ちかい　こと', 'へやが　ひろい　こと', 'しずかな　こと'], answer: 0,
    en: 'Narrator: A man and a woman are talking. What does the woman say is best about her new apartment? — M: How\'s the new apartment? Is it near the station? F: No, it takes as much as twenty minutes on foot from the station. M: Is the room big? F: Smaller than my old one. And next door is a park, so it\'s a bit noisy in the daytime. M: Then why did you pick it? F: You can see the sea from the window. That\'s what I like most. — What does she say is best?',
    explain: 'It is far from the station, smaller than her old room, and noisy in the daytime, so those are not it. The sea view from the window is what she likes most (それがいちばん気にいってる).',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:no', 'g:number-mo', 'g:yo', 'g:sore-ni', 'g:te-adj-noun', 'g:shi', 'g:doushite', 'g:ka', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:新しい|あたらしい', 'v:アパート|アパート', 'v:どう|どう', 'v:駅|えき', 'v:近い|ちかい', 'v:歩く|あるく', 'v:かかる|かかる', 'v:部屋|へや', 'v:広い|ひろい', 'v:前|まえ', 'v:より|より', 'v:狭い|せまい', 'v:隣|となり', 'v:公園|こうえん', 'v:昼|ひる', 'v:ちょっと|ちょっと', 'v:煩い|うるさい', 'v:じゃあ|じゃあ', 'v:どうして|どうして', 'v:そこ|そこ', 'v:する|する', 'v:窓|まど', 'v:海|うみ', 'v:見える|みえる', 'v:それ|それ', 'v:いちばん|いちばん', 'v:気|き', 'v:言う|いう', 'v:静か|しずか', 'v:事|こと', 'v:何|なに', 'v:いい|いい', 'k:男', 'k:人', 'k:女', 'k:話', 'k:新', 'k:駅', 'k:海', 'k:見', 'k:気', 'k:何', 'k:言'],
    verified: true }),

  L({ id: 'l:n4-trip-flight-delay', format: 'point', // mock-1
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'りょこう、どうでしたか。' },
      { speaker: 'F', furigana: 'たのしかったです。[天気|てんき]も　よかったし、りょうりも　おいしかったです。' },
      { speaker: 'M', furigana: 'それは　よかったですね。' },
      { speaker: 'F', furigana: 'でも、かえりの　ひこうきが　[三|さん][時|じ][間|かん]も　おくれて、たいへんでした。くうこうで　ずっと　まって　いたんです。' },
      { speaker: 'M', furigana: 'それは　つかれましたね。ホテルは　どうでしたか。' },
      { speaker: 'F', furigana: 'ちょっと　せまかったけど、きれいでしたよ。' }],
    question: '[女|おんな]の　[人|ひと]は　りょこうで　[何|なに]が　たいへんでしたか。',
    options: ['ホテルが　せまかった　こと', '[天気|てんき]が　わるかった　こと', 'りょうりが　たかかった　こと', 'ひこうきが　おくれた　こと'], answer: 3,
    en: 'Narrator: At a company, a man and a woman are talking. What was hard for the woman on her trip? — M: How was your trip? F: It was fun. The weather was good and the food was delicious. M: That\'s great. F: But the flight home was as much as three hours late, which was awful. I waited at the airport the whole time. M: That must have been tiring. How was the hotel? F: A bit small, but clean. — What was hard for her on the trip?',
    explain: 'She calls the three-hour delay of the flight home たいへんでした. The weather was good, the food was delicious, and the hotel was small but clean, which she does not mind.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:deshita', 'g:adj-i', 'g:mo', 'g:shi', 'g:ne', 'g:number-mo', 'g:te-ita', 'g:n-desu', 'g:kedo', 'g:yo', 'g:ka', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:旅行|りょこう', 'v:どう|どう', 'v:楽しい|たのしい', 'v:天気|てんき', 'v:よい|よい', 'v:料理|りょうり', 'v:おいしい|おいしい', 'v:でも|でも', 'v:帰り|かえり', 'v:飛行機|ひこうき', 'v:三|さん', 'v:時間|じかん', 'v:遅れる|おくれる', 'v:たいへん|たいへん', 'v:空港|くうこう', 'v:待つ|まつ', 'v:疲れる|つかれる', 'v:ホテル|ホテル', 'v:ちょっと|ちょっと', 'v:狭い|せまい', 'v:きれい|きれい', 'v:悪い|わるい', 'v:高い|たかい', 'v:事|こと', 'v:何|なに', 'k:男', 'k:人', 'k:女', 'k:話', 'k:天', 'k:気', 'k:三', 'k:時', 'k:間', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-hospital-pick-up-wife', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[明日|あした]、[午後|ごご]から　[休|やす]むそうですね。どこか　わるいんですか。' },
      { speaker: 'M', furigana: 'いえ、わたしは　[元気|げんき]です。つまが　[入院|にゅういん]して　いたんですが、[明日|あした]　たいいんするので、むかえに　[行|い]くんです。' },
      { speaker: 'F', furigana: 'そうですか。よかったですね。おくさんは　けがですか。' },
      { speaker: 'M', furigana: 'あしの　けがです。もう　ひとりで　あるけるんですよ。' },
      { speaker: 'F', furigana: 'それは　あんしんですね。' }],
    question: '[男|おとこ]の　[人|ひと]は　[明日|あした]　[何|なに]を　しに　びょういんへ　[行|い]きますか。',
    options: ['じぶんの　[体|からだ]を　みて　もらう', 'おくさんを　むかえる', 'おくさんの　おみまいを　する', 'おくさんの　くすりを　もらう'], answer: 1,
    en: 'Narrator: At a company, a man and a woman are talking. What is the man going to the hospital to do tomorrow? — F: I hear you\'re taking tomorrow afternoon off. Is something wrong? M: No, I\'m fine. My wife has been in hospital, but she leaves tomorrow, so I\'m going to pick her up. F: I see. That\'s good news. Was it an injury? M: Her leg. She can already walk on her own. F: That\'s a relief. — What is the man going to the hospital to do tomorrow?',
    explain: 'The woman guesses he is ill, but he is fine (わたしは元気です). His wife leaves hospital tomorrow, and he is going to pick her up (むかえに行く). She was in hospital before; tomorrow is not a visit.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:sou-da-hearsay', 'g:ne', 'g:ka', 'g:n-desu', 'g:te-ita', 'g:node', 'g:ni-iku', 'g:potential', 'g:yo', 'g:te-morau', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:明日|あした', 'v:午後|ごご', 'v:休む|やすむ', 'v:そう|そう', 'v:どこ|どこ', 'v:悪い|わるい', 'v:私|わたし', 'v:元気|げんき', 'v:妻|つま', 'v:入院|にゅういん', 'v:退院|たいいん', 'v:迎える|むかえる', 'v:行く|いく', 'v:よい|よい', 'v:奥さん|おくさん', 'v:足|あし', 'v:もう|もう', 'v:一人|ひとり', 'v:歩く|あるく', 'v:安心|あんしん', 'v:自分|じぶん', 'v:体|からだ', 'v:見る|みる', 'v:もらう|もらう', 'v:お見舞い|おみまい', 'v:する|する', 'v:薬|くすり', 'v:病院|びょういん', 'v:何|なに', 'k:男', 'k:人', 'k:女', 'k:話', 'k:明', 'k:日', 'k:午', 'k:後', 'k:休', 'k:元', 'k:気', 'k:入', 'k:院', 'k:行', 'k:何', 'k:体'],
    verified: true }),

  L({ id: 'l:n4-train-delay-announcement', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: '[駅|えき]で　[駅|えき][員|いん]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'みなさまに　おしらせ　いたします。[北|きた][駅|えき]で　じこが　ありましたので、[電車|でんしゃ]が　おくれて　います。' },
      { speaker: 'M', furigana: 'さきほどは　じゅっぷんほど　おくれると　[言|い]いましたが、もう　すこし　かかりそうです。' },
      { speaker: 'M', furigana: 'つぎの　[電車|でんしゃ]は、いまから　にじゅっぷんほどで　[来|く]る　よていです。' },
      { speaker: 'M', furigana: 'おいそぎの　かたは、[駅|えき]の　[前|まえ]から　バスを　ごりよう　ください。バスは　さんじゅっぷんほどで　[北|きた][駅|えき]に　[着|つ]きます。' }],
    question: 'つぎの　[電車|でんしゃ]は　あと　どのぐらいで　[来|き]ますか。',
    options: ['にじゅっぷんぐらい', 'じゅっぷんぐらい', 'さんじゅっぷんぐらい', '[一|いち][時|じ][間|かん]ぐらい'], answer: 0,
    names: ['北|きた'],
    en: 'Narrator: At a station, a station employee is speaking. In about how long will the next train come? — M: An announcement for all passengers. Because of an accident at Kita Station, trains are running late. Earlier we said about ten minutes, but it looks like it will take a little longer. The next train is due in about twenty minutes from now. If you are in a hurry, please use the bus from in front of the station. The bus reaches Kita Station in about thirty minutes. — In about how long will the next train come?',
    explain: 'Ten minutes was the earlier estimate, now replaced. The next train is due in about twenty minutes (にじゅっぷんほど). Thirty minutes is how long the bus takes to reach Kita Station.',
    uses: ['g:de', 'g:te-iru', 'g:itasu', 'g:node', 'g:to', 'g:sou-da-looks', 'g:yotei-da', 'g:o-kudasai', 'g:ni', 'g:no', 'v:駅|えき', 'v:員|いん', 'v:話す|はなす', 'v:皆|みな', 'v:様|さま', 'v:知らせる|しらせる', 'v:北|きた', 'v:事故|じこ', 'v:ある|ある', 'v:電車|でんしゃ', 'v:遅れる|おくれる', 'v:先|さき', 'v:程|ほど', 'v:言う|いう', 'v:もう|もう', 'v:少し|すこし', 'v:かかる|かかる', 'v:次|つぎ', 'v:今|いま', 'v:来る|くる', 'v:予定|よてい', 'v:急ぐ|いそぐ', 'v:方|かた', 'v:前|まえ', 'v:バス|バス', 'v:利用|りよう', 'v:着く|つく', 'v:どの|どの', 'v:後|あと', 'v:一|いち', 'v:時間|じかん', 'k:駅', 'k:員', 'k:話', 'k:北', 'k:電', 'k:車', 'k:言', 'k:来', 'k:前', 'k:着', 'k:一', 'k:時', 'k:間'],
    verified: true }),

  L({ id: 'l:n4-bookshop-holiday-hours', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: '[電話|でんわ]で　[女|おんな]の　[人|ひと]と　[本|ほん][屋|や]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'すみません、そちらは　[何|なん][時|じ]まで　あいて　いますか。' },
      { speaker: 'M', furigana: 'いつもは　[夜|よる]　[九|く][時|じ]までですが、きょうは　[日曜日|にちようび]なので、[七|しち][時|じ]に　しまります。' },
      { speaker: 'F', furigana: 'そうですか。[明日|あした]は？' },
      { speaker: 'M', furigana: '[明日|あした]は　やすみの　[日|ひ]ですので、[六|ろく][時|じ]までです。' },
      { speaker: 'F', furigana: 'じゃあ、きょう　[行|い]きます。[六|ろく][時|じ]ごろに　なると　[思|おも]います。' }],
    question: '[本|ほん][屋|や]は　きょう　[何|なん][時|じ]に　しまりますか。',
    options: ['[九|く][時|じ]', '[六|ろく][時|じ]', '[七|しち][時|じ]', '[八|はち][時|じ]'], answer: 2,
    en: 'Narrator: On the phone, a woman and a bookshop employee are talking. What time does the bookshop close today? — F: Excuse me, until what time are you open? M: Usually until nine in the evening, but today is Sunday, so we close at seven. F: I see. And tomorrow? M: Tomorrow is a holiday, so until six. F: Then I\'ll come today. I think it will be around six. — What time does the bookshop close today?',
    explain: 'Nine is the usual closing time and six is tomorrow\'s (a holiday). Today, Sunday, the shop closes at seven (七時にしまります). Six is also when she plans to arrive, not when the shop closes. Listen for しち against はち.',
    uses: ['g:de', 'g:to', 'g:ga', 'g:te-iru', 'g:made', 'g:node', 'g:goro', 'g:naru', 'g:to-omou', 'g:ka', 'g:ni', 'v:電話|でんわ', 'v:女|おんな', 'v:人|ひと', 'v:本|ほん', 'v:屋|や', 'v:話す|はなす', 'v:そちら|そちら', 'v:何|なん', 'v:時|じ', 'v:開く|あく', 'v:いつも|いつも', 'v:夜|よる', 'v:九|く', 'v:今日|きょう', 'v:日曜日|にちようび', 'v:七|しち', 'v:閉まる|しまる', 'v:そう|そう', 'v:明日|あした', 'v:休み|やすみ', 'v:日|ひ', 'v:六|ろく', 'v:じゃあ|じゃあ', 'v:行く|いく', 'v:なる|なる', 'v:思う|おもう', 'v:八|はち', 'k:電', 'k:話', 'k:女', 'k:人', 'k:本', 'k:屋', 'k:何', 'k:時', 'k:夜', 'k:九', 'k:日', 'k:曜', 'k:七', 'k:明', 'k:六', 'k:行', 'k:思', 'k:八'],
    verified: true }),

  L({ id: 'l:n4-job-change-abroad', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[大川|おおかわ]さん、かいしゃを　かわったそうですね。[前|まえ]の　かいしゃは　とおかったんですか。' },
      { speaker: 'F', furigana: 'とおかったけど、それは　よかったんです。[電車|でんしゃ]の　[中|なか]で　[本|ほん]が　[読|よ]めましたから。' },
      { speaker: 'M', furigana: 'じゃあ、しごとが　いそがしすぎたんですか。' },
      { speaker: 'F', furigana: 'いそがしかったけど、たのしかったですよ。じつは、ずっと　がいこくで　はたらきたかったんです。[新|あたら]しい　かいしゃは　アジアに　じむしょが　たくさん　あるので。' },
      { speaker: 'M', furigana: 'そうだったんですか。' }],
    question: '[女|おんな]の　[人|ひと]は　どうして　かいしゃを　かわりましたか。',
    options: ['かいしゃが　とおかったから', 'がいこくで　はたらきたいから', 'しごとが　いそがしすぎたから', 'しごとが　つまらなかったから'], answer: 1,
    names: ['大川|おおかわ'],
    en: 'Narrator: A man and a woman are talking. Why did the woman change companies? — M: Ms. Okawa, I hear you changed companies. Was your old company far away? F: It was far, but that was fine. I could read books on the train. M: Then was the work too busy? F: It was busy, but fun. Actually, I\'ve always wanted to work abroad. My new company has lots of offices in Asia. M: Oh, I see. — Why did the woman change companies?',
    explain: 'Her old office was far, but she liked reading on the train, and the work was busy but fun. The real reason is that she always wanted to work abroad, and the new company has offices in Asia.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:sou-da-hearsay', 'g:ne', 'g:n-desu', 'g:kedo', 'g:potential', 'g:kara', 'g:sugiru', 'g:tai', 'g:node', 'g:doushite', 'g:yo', 'g:ka', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:さん|さん', 'v:会社|かいしゃ', 'v:変わる|かわる', 'v:そう|そう', 'v:前|まえ', 'v:遠い|とおい', 'v:よい|よい', 'v:電車|でんしゃ', 'v:中|なか', 'v:本|ほん', 'v:読む|よむ', 'v:じゃあ|じゃあ', 'v:仕事|しごと', 'v:忙しい|いそがしい', 'v:楽しい|たのしい', 'v:外国|がいこく', 'v:働く|はたらく', 'v:新しい|あたらしい', 'v:アジア|アジア', 'v:事務所|じむしょ', 'v:たくさん|たくさん', 'v:ある|ある', 'v:つまらない|つまらない', 'v:どうして|どうして', 'k:男', 'k:人', 'k:女', 'k:話', 'k:大', 'k:川', 'k:前', 'k:電', 'k:車', 'k:中', 'k:本', 'k:読', 'k:新'],
    verified: true }),

  L({ id: 'l:n4-son-broke-clock', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きのう、むすこが　へやで　あそんで　いて、たなの　[上|うえ]の　とけいを　おとしちゃったの。' },
      { speaker: 'M', furigana: 'えっ、こわれたの？' },
      { speaker: 'F', furigana: 'そう。もう　うごかないの。' },
      { speaker: 'M', furigana: 'たなの　[上|うえ]に　カメラも　なかった？　だいじょうぶ？' },
      { speaker: 'F', furigana: 'カメラは　ひきだしに　[入|い]れて　あったから、だいじょうぶ。とけいの　よこの　めがねも　おちたけど、めがねは　こわれなかった。' },
      { speaker: 'M', furigana: 'よかった。とけいは　なおせるかな。' }],
    question: 'むすこは　[何|なに]を　こわしましたか。',
    options: ['カメラ', 'めがね', 'たな', 'とけい'], answer: 3,
    en: 'Narrator: A man and a woman are talking. What did the son break? — F: Yesterday our son was playing in his room and knocked the clock off the shelf. M: What, did it break? F: Yes. It doesn\'t work any more. M: Wasn\'t the camera on the shelf too? Is it OK? F: The camera was put away in a drawer, so it\'s fine. The glasses next to the clock fell too, but they didn\'t break. M: Thank goodness. I wonder if the clock can be fixed. — What did the son break?',
    explain: 'The clock fell off the shelf and no longer works. The camera was in a drawer, and the glasses fell but did not break (こわれなかった). Nothing is said about the shelf breaking.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:te-shimau', 'g:no', 'g:te-aru', 'g:kara', 'g:kedo', 'g:potential', 'g:kana-kashira', 'g:mo', 'g:nai-form', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:昨日|きのう', 'v:息子|むすこ', 'v:部屋|へや', 'v:遊ぶ|あそぶ', 'v:棚|たな', 'v:上|うえ', 'v:時計|とけい', 'v:落とす|おとす', 'v:壊れる|こわれる', 'v:そう|そう', 'v:もう|もう', 'v:動く|うごく', 'v:カメラ|カメラ', 'v:ある|ある', 'v:大丈夫|だいじょうぶ', 'v:引き出し|ひきだし', 'v:入れる|いれる', 'v:横|よこ', 'v:眼鏡|めがね', 'v:落ちる|おちる', 'v:よい|よい', 'v:直す|なおす', 'v:壊す|こわす', 'v:何|なに', 'k:男', 'k:人', 'k:女', 'k:話', 'k:上', 'k:入', 'k:何'],
    verified: true }),

  L({ id: 'l:n4-hotel-room-noisy', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: 'ホテルで　[女|おんな]の　[人|ひと]と　ホテルの　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'すみません、へやを　かえて　いただけませんか。' },
      { speaker: 'M', furigana: 'どう　なさいましたか。' },
      { speaker: 'F', furigana: 'きのうは　れいぼうが　つかなかったんですが、それは　けさ　なおして　もらいました。' },
      { speaker: 'M', furigana: 'ほかにも　なにか？' },
      { speaker: 'F', furigana: 'へやは　ちょっと　せまいけど、それは　いいんです。ただ、となりの　へやが　[夜|よる]に　なっても　うるさくて、ねむれないんです。' },
      { speaker: 'M', furigana: 'それは　しつれい　いたしました。すぐ　ほかの　へやを　ごよういします。' }],
    question: '[女|おんな]の　[人|ひと]は　どうして　へやを　かえたいと　[言|い]って　いますか。',
    options: ['れいぼうが　つかないから', 'へやが　せまいから', 'となりが　うるさいから', 'へやが　さむいから'], answer: 2,
    en: 'Narrator: At a hotel, a woman and a hotel employee are talking. Why does the woman say she wants to change rooms? — F: Excuse me, could I change rooms? M: What seems to be the matter? F: Yesterday the air conditioner wouldn\'t come on, but that was fixed this morning. M: Is there anything else? F: The room is a bit small, but that\'s fine. It\'s just that the room next door is noisy even at night, and I can\'t sleep. M: I\'m very sorry. I\'ll get another room ready right away. — Why does she want to change rooms?',
    explain: 'The air conditioner was fixed this morning, and the small room is fine with her. The problem is the noise from next door at night, which keeps her awake (うるさくて、ねむれない).',
    uses: ['g:te-itadakemasen-ka', 'g:sonkeigo-verbs', 'g:n-desu', 'g:te-morau', 'g:mo', 'g:kedo', 'g:naru', 'g:te-mo', 'g:te-adj-noun', 'g:potential', 'g:tai', 'g:to', 'g:te-iru', 'g:doushite', 'g:ka', 'g:no', 'v:ホテル|ホテル', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:部屋|へや', 'v:変える|かえる', 'v:頂く|いただく', 'v:どう|どう', 'v:なさる|なさる', 'v:昨日|きのう', 'v:冷房|れいぼう', 'v:点く|つく', 'v:今朝|けさ', 'v:直す|なおす', 'v:もらう|もらう', 'v:ほか|ほか', 'v:何|なに', 'v:ちょっと|ちょっと', 'v:狭い|せまい', 'v:いい|いい', 'v:隣|となり', 'v:夜|よる', 'v:なる|なる', 'v:煩い|うるさい', 'v:眠る|ねむる', 'v:失礼|しつれい', 'v:用意|ようい', 'v:言う|いう', 'v:寒い|さむい', 'v:どうして|どうして', 'k:女', 'k:人', 'k:話', 'k:夜', 'k:言'],
    verified: true }),

  L({ id: 'l:n4-test-moved-tuesday', format: 'point', // mock-2
    lines: [
      { speaker: 'N', furigana: '[学校|がっこう]で　[先生|せんせい]が　[学生|がくせい]に　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'みなさん、[来週|らいしゅう]の　しけんの　ことです。[金曜日|きんようび]の　よていでしたが、[金曜日|きんようび]は　[先生|せんせい]たちの　かいぎが　[入|はい]って　しまいました。' },
      { speaker: 'F', furigana: 'それで、[月曜日|げつようび]に　しようと　[思|おも]いましたが、[月曜日|げつようび]は　やすみの　[日|ひ]ですね。' },
      { speaker: 'F', furigana: 'ですから、しけんは　[火曜日|かようび]に　します。[時間|じかん]は　かわりません。' },
      { speaker: 'F', furigana: '[水曜日|すいようび]に　しけんを　かえして、まちがえた　ところを　いっしょに　[見|み]ましょう。' }],
    question: 'しけんは　いつに　なりましたか。',
    options: ['[火曜日|かようび]', '[月曜日|げつようび]', '[金曜日|きんようび]', '[水曜日|すいようび]'], answer: 0,
    en: 'Narrator: At a school, a teacher is talking to the students. When is the test now? — F: Everyone, this is about next week\'s test. It was planned for Friday, but a teachers\' meeting has come up on Friday. So I thought of making it Monday, but Monday is a holiday, isn\'t it? So the test will be on Tuesday. The time doesn\'t change. On Wednesday I\'ll give the tests back and we\'ll look at the mistakes together. — When is the test now?',
    explain: 'Friday was the plan until a meeting came up, and Monday is a holiday, so the test is on Tuesday (しけんは火曜日にします). Wednesday is when the tests come back.',
    uses: ['g:de', 'g:ga', 'g:ni', 'g:te-iru', 'g:no', 'g:te-shimau', 'g:you-to-omou', 'g:volitional', 'g:ne', 'g:mashou', 'g:naru', 'g:masen', 'v:学校|がっこう', 'v:先生|せんせい', 'v:学生|がくせい', 'v:話す|はなす', 'v:皆さん|みなさん', 'v:来週|らいしゅう', 'v:試験|しけん', 'v:事|こと', 'v:金曜日|きんようび', 'v:予定|よてい', 'v:たち|たち', 'v:会議|かいぎ', 'v:入る|はいる', 'v:それで|それで', 'v:月曜日|げつようび', 'v:する|する', 'v:思う|おもう', 'v:休み|やすみ', 'v:日|ひ', 'v:火曜日|かようび', 'v:時間|じかん', 'v:変わる|かわる', 'v:水曜日|すいようび', 'v:返す|かえす', 'v:間違える|まちがえる', 'v:所|ところ', 'v:一緒|いっしょ', 'v:見る|みる', 'v:いつ|いつ', 'v:なる|なる', 'k:学', 'k:校', 'k:先', 'k:生', 'k:話', 'k:来', 'k:週', 'k:金', 'k:曜', 'k:日', 'k:入', 'k:月', 'k:思', 'k:火', 'k:時', 'k:間', 'k:水', 'k:見'],
    verified: true }),

  L({ id: 'l:n4-bag-birthday-discount', format: 'point', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'その　かばん、[新|あたら]しいね。' },
      { speaker: 'F', furigana: 'そうなの。きのう　デパートで　[買|か]ったの。' },
      { speaker: 'M', furigana: 'たかかったでしょう。' },
      { speaker: 'F', furigana: 'もとは　[一|いち][万|まん][円|えん]だったんだけど、[今週|こんしゅう]は　ぜんぶ　はんぶんの　ねだんだったの。' },
      { speaker: 'M', furigana: 'じゃあ、[五|ご][千|せん][円|えん]？' },
      { speaker: 'F', furigana: 'それに、たんじょうびの　[月|つき]だから、もう　[千|せん][円|えん]　やすく　して　もらったの。' }],
    question: '[女|おんな]の　[人|ひと]は　かばんを　いくらで　[買|か]いましたか。',
    options: ['[五|ご][千|せん][円|えん]', '[一|いち][万|まん][円|えん]', '[六|ろく][千|せん][円|えん]', '[四|よん][千|せん][円|えん]'], answer: 3,
    en: 'Narrator: A man and a woman are talking. How much did the woman pay for the bag? — M: That bag is new, isn\'t it? F: Yes. I bought it at a department store yesterday. M: It must have been expensive. F: It was 10,000 yen at first, but this week everything was half price. M: So, 5,000 yen? F: And since it\'s my birthday month, they took another 1,000 yen off. — How much did she pay for the bag?',
    explain: 'Half of 10,000 yen is 5,000, and another 1,000 yen came off for her birthday month (もう千円やすくしてもらった): 4,000 yen. Six thousand would be adding the 1,000 instead of taking it off.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:ne', 'g:no', 'g:deshou', 'g:kedo', 'g:sore-ni', 'g:kara', 'g:ku-ni-suru', 'g:te-morau', 'g:de', 'g:ka', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:その|その', 'v:かばん|かばん', 'v:新しい|あたらしい', 'v:そう|そう', 'v:昨日|きのう', 'v:デパート|デパート', 'v:買う|かう', 'v:高い|たかい', 'v:一|いち', 'v:万|まん', 'v:円|えん', 'v:今週|こんしゅう', 'v:全部|ぜんぶ', 'v:半分|はんぶん', 'v:値段|ねだん', 'v:じゃあ|じゃあ', 'v:五|ご', 'v:千|せん', 'v:誕生日|たんじょうび', 'v:月|つき', 'v:もう|もう', 'v:安い|やすい', 'v:する|する', 'v:もらう|もらう', 'v:四|よん', 'v:六|ろく', 'v:いくら|いくら', 'k:男', 'k:人', 'k:女', 'k:話', 'k:新', 'k:買', 'k:一', 'k:万', 'k:円', 'k:今', 'k:週', 'k:五', 'k:千', 'k:月', 'k:六', 'k:四'],
    verified: true }),

  L({ id: 'l:n4-scolded-message', format: 'point', // diagnostic
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[西田|にしだ]さん、さっき　かちょうに　しかられて　いましたね。かいぎに　おくれたんですか。' },
      { speaker: 'M', furigana: 'いえ、かいぎには　まにあったんですが……。おきゃくさまから　[電話|でんわ]が　あった　ことを、かちょうに　つたえるのを　わすれて　しまったんです。' },
      { speaker: 'F', furigana: 'そうですか。しりょうは　だいじょうぶでしたか。' },
      { speaker: 'M', furigana: 'しりょうは　ちゃんと　できて　いました。つぎから　[気|き]を　つけます。' }],
    question: '[男|おとこ]の　[人|ひと]は　どうして　しかられましたか。',
    options: ['かいぎに　おくれたから', '[電話|でんわ]の　ことを　つたえなかったから', 'しりょうが　できて　いなかったから', 'おきゃくさまに　[電話|でんわ]しなかったから'], answer: 1,
    names: ['西田|にしだ'],
    en: 'Narrator: At a company, a man and a woman are talking. Why was the man told off? — F: Mr. Nishida, the section chief was telling you off just now, wasn\'t he? Were you late for the meeting? M: No, I made it to the meeting... I forgot to tell the chief that a customer had phoned. F: I see. Were the materials all right? M: The materials were properly done. I\'ll be careful from now on. — Why was the man told off?',
    explain: 'He was on time for the meeting and the materials were ready. He forgot to pass on to the chief that a customer had called (電話があったことを…つたえるのをわすれた). He did not have to call the customer himself.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:passive', 'g:ne', 'g:n-desu', 'g:te-shimau', 'g:koto', 'g:noun-modifier', 'g:kara', 'g:te-ita', 'g:doushite', 'g:ka', 'g:no', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:さん|さん', 'v:さっき|さっき', 'v:課長|かちょう', 'v:叱る|しかる', 'v:会議|かいぎ', 'v:遅れる|おくれる', 'v:間に合う|まにあう', 'v:客|きゃく', 'v:様|さま', 'v:電話|でんわ', 'v:ある|ある', 'v:事|こと', 'v:伝える|つたえる', 'v:忘れる|わすれる', 'v:そう|そう', 'v:大丈夫|だいじょうぶ', 'v:できる|できる', 'v:次|つぎ', 'v:気|き', 'v:つける|つける', 'v:どうして|どうして', 'k:男', 'k:人', 'k:女', 'k:話', 'k:西', 'k:田', 'k:電', 'k:気'],
    verified: true }),

  L({ id: 'l:n4-birthday-wish-watch', format: 'point', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'もうすぐ　たんじょうびだね。[何|なに]か　ほしい　もの　ある？' },
      { speaker: 'M', furigana: 'そうだなあ。さいふが　ふるく　なったから、[新|あたら]しいのが　ほしいと　[思|おも]って　いたんだけど……。' },
      { speaker: 'F', furigana: 'じゃあ、さいふに　しようか。' },
      { speaker: 'M', furigana: 'いや、さいふは　この　あいだ　[父|ちち]が　くれたんだ。だから、いまは　とけいが　ほしいな。' },
      { speaker: 'F', furigana: 'とけいかあ。ちょっと　たかいね。' },
      { speaker: 'M', furigana: 'じゃあ、[本|ほん]で　いいよ。' },
      { speaker: 'F', furigana: 'ううん、だいじょうぶ。とけいに　する。' }],
    question: '[女|おんな]の　[人|ひと]は　[男|おとこ]の　[人|ひと]に　[何|なに]を　あげますか。',
    options: ['とけい', 'さいふ', '[本|ほん]', 'かばん'], answer: 0,
    en: 'Narrator: A man and a woman are talking. What will the woman give the man? — F: Your birthday is soon. Is there anything you want? M: Let me think. My wallet has got old, so I\'d been thinking I wanted a new one... F: Then shall I get a wallet? M: No, my dad gave me a wallet the other day. So now I want a watch. F: A watch. That\'s a bit expensive. M: Then a book is fine. F: No, it\'s OK. I\'ll go with the watch. — What will she give him?',
    explain: 'The wallet was his first wish, but his father already gave him one. He wants a watch, offers a book when she says it is pricey, and she decides on the watch anyway (とけいにする).',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:ne', 'g:ga-hoshii', 'g:naru', 'g:kara', 'g:to-omou', 'g:te-ita', 'g:kedo', 'g:volitional', 'g:yo', 'g:no', 'g:ka', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:もうすぐ|もうすぐ', 'v:誕生日|たんじょうび', 'v:何|なに', 'v:欲しい|ほしい', 'v:物|もの', 'v:ある|ある', 'v:そう|そう', 'v:財布|さいふ', 'v:古い|ふるい', 'v:なる|なる', 'v:新しい|あたらしい', 'v:思う|おもう', 'v:じゃあ|じゃあ', 'v:する|する', 'v:この間|このあいだ', 'v:父|ちち', 'v:くれる|くれる', 'v:だから|だから', 'v:今|いま', 'v:時計|とけい', 'v:ちょっと|ちょっと', 'v:高い|たかい', 'v:本|ほん', 'v:いい|いい', 'v:大丈夫|だいじょうぶ', 'v:あげる|あげる', 'v:かばん|かばん', 'k:男', 'k:人', 'k:女', 'k:話', 'k:何', 'k:新', 'k:思', 'k:父', 'k:本'],
    verified: true }),

  L({ id: 'l:n4-why-learn-japanese', format: 'point', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[大学|だいがく]で　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'サラさんは　どうして　[日本|にほん][語|ご]を　べんきょうして　いるんですか。しごとで　ひつようなんですか。' },
      { speaker: 'F', furigana: 'しごとでは　つかわないんです。[日本|にほん]の　まんがが　すきで、ほんやくを　[読|よ]まないで、そのまま　[読|よ]みたいんです。' },
      { speaker: 'M', furigana: 'そうなんですか。[日本|にほん]に　[住|す]んで　みたいとは　[思|おも]いませんか。' },
      { speaker: 'F', furigana: '[住|す]んで　みたいですけど、それは　まだ　さきですね。まずは　まんがです。' }],
    question: '[女|おんな]の　[人|ひと]は　どうして　[日本|にほん][語|ご]を　べんきょうして　いますか。',
    options: ['しごとで　ひつようだから', '[日本|にほん]に　[住|す]みたいから', 'まんがを　[読|よ]みたいから', 'ほんやくを　したいから'], answer: 2,
    names: ['サラ', '日本|にほん'],
    en: 'Narrator: At a university, a man and a woman are talking. Why is the woman studying Japanese? — M: Sarah, why are you studying Japanese? Do you need it for work? F: I don\'t use it at work. I like Japanese manga, and I want to read them as they are, not in translation. M: Really? Don\'t you want to live in Japan? F: I\'d like to, but that\'s still a long way off. Manga first. — Why is she studying Japanese?',
    explain: 'She does not use Japanese at work, and living in Japan is for later. She studies so she can read manga without a translation (ほんやくを読まないで…読みたい). She reads translations; she does not want to make them.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:doushite', 'g:n-desu', 'g:te-adj-noun', 'g:nai-de', 'g:tai', 'g:te-miru', 'g:kedo', 'g:ne', 'g:kara', 'g:ka', 'g:no', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:大学|だいがく', 'v:さん|さん', 'v:語|ご', 'v:勉強|べんきょう', 'v:仕事|しごと', 'v:必要|ひつよう', 'v:使う|つかう', 'v:漫画|まんが', 'v:好き|すき', 'v:翻訳|ほんやく', 'v:読む|よむ', 'v:その|その', 'v:まま|まま', 'v:思う|おもう', 'v:そう|そう', 'v:住む|すむ', 'v:まだ|まだ', 'v:先|さき', 'v:まず|まず', 'v:する|する', 'k:大', 'k:学', 'k:男', 'k:人', 'k:女', 'k:話', 'k:日', 'k:本', 'k:語', 'k:読', 'k:住', 'k:思'],
    verified: true }),

  L({ id: 'l:n4-meeting-floor-moved', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: 'かいしゃで　[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: '[明日|あした]の　かいぎ、[三|さん]がいの　かいぎしつでしたよね。' },
      { speaker: 'M', furigana: 'それが、[三|さん]がいの　へやは　ほかの　[人|ひと]が　つかう　ことに　なったので、[五|ご]かいに　かわりました。' },
      { speaker: 'F', furigana: '[五|ご]かいですか。[四|よん]かいの　しょくどうの　[上|うえ]ですね。' },
      { speaker: 'M', furigana: 'そうです。エレベーターを　おりて、すぐ　[右|みぎ]の　へやです。' }],
    question: 'かいぎは　[何|なん]がいで　ありますか。',
    options: ['[三|さん]がい', '[五|ご]かい', '[四|よん]かい', '[二|に]かい'], answer: 1,
    en: 'Narrator: At a company, a man and a woman are talking. Which floor is the meeting on? — F: Tomorrow\'s meeting is in the third-floor meeting room, right? M: Actually, other people are going to use the third-floor room, so it moved to the fifth floor. F: The fifth floor? Above the cafeteria on the fourth floor. M: That\'s right. Get off the lift and it\'s the room right on the right. — Which floor is the meeting on?',
    explain: 'The third-floor room was the old plan; it changed to the fifth floor (五かいにかわりました). The fourth floor is the cafeteria below it.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:de', 'g:no', 'g:deshita', 'g:yo', 'g:ne', 'g:node', 'g:naru', 'g:ka', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:会社|かいしゃ', 'v:明日|あした', 'v:会議|かいぎ', 'v:三|さん', 'v:階|かい', 'v:会議室|かいぎしつ', 'v:それ|それ', 'v:部屋|へや', 'v:ほか|ほか', 'v:使う|つかう', 'v:事|こと', 'v:なる|なる', 'v:五|ご', 'v:変わる|かわる', 'v:四|よん', 'v:食堂|しょくどう', 'v:上|うえ', 'v:そう|そう', 'v:エレベーター|エレベーター', 'v:降りる|おりる', 'v:右|みぎ', 'v:何|なん', 'v:ある|ある', 'v:二|に', 'k:男', 'k:人', 'k:女', 'k:話', 'k:明', 'k:日', 'k:三', 'k:五', 'k:四', 'k:上', 'k:右', 'k:何', 'k:二'],
    verified: true }),

  L({ id: 'l:n4-cherry-blossom-weather', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: '[明日|あした]の　[花見|はなみ]、[天気|てんき]は　だいじょうぶかな。' },
      { speaker: 'F', furigana: '[天気|てんき]よほうでは、[明日|あした]の　[朝|あさ]までは　[雨|あめ]だそうよ。でも、[十|じゅう][時|じ]ごろには　やんで、[午後|ごご]は　はれるって。' },
      { speaker: 'M', furigana: 'じゃあ、[午後|ごご]から　[行|い]こうか。' },
      { speaker: 'F', furigana: 'そうね。でも、[夕方|ゆうがた]から　また　[風|かぜ]が　つよく　なるそうだから、はやめに　かえろう。' }],
    question: '[明日|あした]は　いつ　はれますか。',
    options: ['[朝|あさ]', '[十|じゅう][時|じ]ごろ', '[夕方|ゆうがた]', '[午後|ごご]'], answer: 3,
    en: 'Narrator: A man and a woman are talking. When will it be sunny tomorrow? — M: I wonder if the weather will be OK for tomorrow\'s cherry-blossom viewing. F: The forecast says rain until tomorrow morning. But it stops around ten, and the afternoon will be sunny. M: Then shall we go from the afternoon? F: Yes. But they say the wind gets strong again from the evening, so let\'s head home early. — When will it be sunny tomorrow?',
    explain: 'Rain lasts until the morning and stops around ten; the sun comes in the afternoon (午後ははれる). In the evening it is the wind that is the problem.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:kana-kashira', 'g:made', 'g:sou-da-hearsay', 'g:yo', 'g:goro', 'g:tte', 'g:volitional', 'g:naru', 'g:kara', 'g:ne', 'g:de', 'g:no', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:明日|あした', 'v:花見|はなみ', 'v:天気|てんき', 'v:大丈夫|だいじょうぶ', 'v:天気予報|てんきよほう', 'v:朝|あさ', 'v:雨|あめ', 'v:そう|そう', 'v:でも|でも', 'v:十|じゅう', 'v:時|じ', 'v:止む|やむ', 'v:午後|ごご', 'v:晴れる|はれる', 'v:じゃあ|じゃあ', 'v:行く|いく', 'v:夕方|ゆうがた', 'v:また|また', 'v:風|かぜ', 'v:強い|つよい', 'v:なる|なる', 'v:帰る|かえる', 'v:いつ|いつ', 'k:男', 'k:人', 'k:女', 'k:話', 'k:明', 'k:日', 'k:花', 'k:見', 'k:天', 'k:気', 'k:朝', 'k:雨', 'k:十', 'k:時', 'k:午', 'k:後', 'k:行', 'k:夕', 'k:方', 'k:風'],
    verified: true }),

  L({ id: 'l:n4-who-picks-up-yui', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きょう、ユイを　[学校|がっこう]へ　むかえに　[行|い]ける？　わたし、[六|ろく][時|じ]まで　かいぎなの。' },
      { speaker: 'M', furigana: 'ごめん、きょうは　[七|しち][時|じ]まで　しごとなんだ。おかあさんに　たのめないかな。' },
      { speaker: 'F', furigana: '[母|はは][は|わ]　きょう　びょういんの　[日|ひ]だから、むりだと　[思|おも]う。' },
      { speaker: 'M', furigana: 'じゃあ、となりの　[田中|たなか]さんの　おくさんに　おねがいする？' },
      { speaker: 'F', furigana: 'それは　わるいよ。わたし、かいぎを　はやめに　おわらせて　もらう。' },
      { speaker: 'M', furigana: 'わるいね。たのむよ。' }],
    question: 'きょう　だれが　ユイを　むかえに　[行|い]きますか。',
    options: ['[男|おとこ]の　[人|ひと]', '[女|おんな]の　[人|ひと]の　[母|はは]', '[女|おんな]の　[人|ひと]', 'となりの　おくさん'], answer: 2,
    names: ['ユイ', '田中|たなか'],
    en: 'Narrator: A man and a woman are talking. Who will go to pick up Yui today? — F: Can you go and pick up Yui from school today? I have a meeting until six. M: Sorry, I\'m working until seven today. Could we ask your mother? F: My mother has a hospital appointment today, so I don\'t think she can. M: Then shall we ask Mrs. Tanaka next door? F: That would be too much to ask. I\'ll get them to let me finish the meeting early. M: Sorry about this. Thanks. — Who will pick up Yui today?',
    explain: 'He works until seven, her mother is at the hospital, and she thinks asking the neighbour is too much. So she will get the meeting finished early and go herself (かいぎをはやめにおわらせてもらう).',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:ni-iku', 'g:potential', 'g:made', 'g:no', 'g:kana-kashira', 'g:kara', 'g:to-omou', 'g:causative', 'g:te-morau', 'g:yo', 'g:ne', 'g:ka', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:今日|きょう', 'v:学校|がっこう', 'v:迎える|むかえる', 'v:行く|いく', 'v:私|わたし', 'v:六|ろく', 'v:時|じ', 'v:会議|かいぎ', 'v:七|しち', 'v:仕事|しごと', 'v:お母さん|おかあさん', 'v:頼む|たのむ', 'v:母|はは', 'v:病院|びょういん', 'v:日|ひ', 'v:無理|むり', 'v:思う|おもう', 'v:じゃあ|じゃあ', 'v:隣|となり', 'v:さん|さん', 'v:奥さん|おくさん', 'v:悪い|わるい', 'v:早い|はやい', 'v:終わる|おわる', 'v:もらう|もらう', 'v:誰|だれ', 'k:男', 'k:人', 'k:女', 'k:話', 'k:学', 'k:校', 'k:行', 'k:六', 'k:時', 'k:七', 'k:母', 'k:日', 'k:思', 'k:田', 'k:中'],
    verified: true }),

  L({ id: 'l:n4-station-meeting-grandpa', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'きのう、[駅|えき]で　[見|み]たよ。どこか　[行|い]ったの？' },
      { speaker: 'M', furigana: 'どこにも　[行|い]って　ないよ。いなかから　そふが　[来|き]たから、むかえに　[行|い]ったんだ。' },
      { speaker: 'F', furigana: 'そう。きっぷを　[買|か]いに　[行|い]ったのかと　[思|おも]った。' },
      { speaker: 'M', furigana: 'きっぷは　[来週|らいしゅう]　[買|か]うよ。[来月|らいげつ]、そふと　いっしょに　りょこうするんだ。' }],
    question: '[男|おとこ]の　[人|ひと]は　きのう　[何|なに]を　しに　[駅|えき]へ　[行|い]きましたか。',
    options: ['そふを　むかえに　[行|い]った', 'きっぷを　[買|か]いに　[行|い]った', '[電車|でんしゃ]に　のりに　[行|い]った', 'りょこうに　[行|い]った'], answer: 0,
    en: 'Narrator: A man and a woman are talking. What did the man go to the station for yesterday? — F: I saw you at the station yesterday. Did you go somewhere? M: I didn\'t go anywhere. My grandfather came from the countryside, so I went to meet him. F: Oh. I thought you went to buy tickets. M: I\'ll buy the tickets next week. Next month I\'m going on a trip with my grandfather. — What did the man go to the station for yesterday?',
    explain: 'He went to meet his grandfather, who came from the countryside (むかえに行った). The tickets are for next week and the trip is next month; he did not go anywhere by train.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:yo', 'g:no', 'g:ka', 'g:kara', 'g:ni-iku', 'g:to-omou', 'g:mo', 'g:de', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:昨日|きのう', 'v:駅|えき', 'v:見る|みる', 'v:どこ|どこ', 'v:行く|いく', 'v:田舎|いなか', 'v:祖父|そふ', 'v:来る|くる', 'v:迎える|むかえる', 'v:そう|そう', 'v:切符|きっぷ', 'v:買う|かう', 'v:思う|おもう', 'v:来週|らいしゅう', 'v:来月|らいげつ', 'v:一緒|いっしょ', 'v:旅行|りょこう', 'v:する|する', 'v:何|なに', 'v:電車|でんしゃ', 'v:乗る|のる', 'k:男', 'k:人', 'k:女', 'k:話', 'k:駅', 'k:見', 'k:行', 'k:来', 'k:買', 'k:思', 'k:週', 'k:月', 'k:何', 'k:電', 'k:車'],
    verified: true }),

  L({ id: 'l:n4-piano-once-a-week', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'M', furigana: 'ピアノ、まだ　ならって　いるの？' },
      { speaker: 'F', furigana: 'ならって　いるよ。[前|まえ]は　しゅうに　[三|さん][度|ど]　[行|い]って　いたけど、[今|いま]は　しごとが　いそがしくて、しゅうに　[一度|いちど]だけ。' },
      { speaker: 'M', furigana: 'そうか。いえでは　れんしゅうして　いるの？' },
      { speaker: 'F', furigana: 'まいにち　さんじゅっぷんぐらい　ひいて　いるよ。[来月|らいげつ]は　はっぴょうかいが　あるから、[今|いま]は　もう　すこし　ひいて　いるけど。' }],
    question: '[女|おんな]の　[人|ひと]は　[今|いま]　ピアノきょうしつに　しゅうに　[何|なん][度|ど]　[行|い]って　いますか。',
    options: ['[三|さん][度|ど]', '[二|に][度|ど]', 'まいにち', '[一度|いちど]'], answer: 3,
    en: 'Narrator: A man and a woman are talking. How many times a week does the woman go to her piano class now? — M: Are you still learning the piano? F: I am. I used to go three times a week, but now work is busy, so only once a week. M: I see. Do you practise at home? F: About thirty minutes every day. There\'s a recital next month, so right now I\'m playing a bit more. — How many times a week does she go to the class now?',
    explain: 'Three times a week was before (前は); now it is only once (今は…一度だけ). Every day is how often she practises at home, not how often she goes to the class.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:no', 'g:yo', 'g:ni-frequency', 'g:te-ita', 'g:kedo', 'g:te-adj-noun', 'g:dake', 'g:kara', 'g:ka', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:ピアノ|ピアノ', 'v:まだ|まだ', 'v:習う|ならう', 'v:前|まえ', 'v:三|さん', 'v:度|ど', 'v:行く|いく', 'v:今|いま', 'v:仕事|しごと', 'v:忙しい|いそがしい', 'v:一度|いちど', 'v:そう|そう', 'v:家|いえ', 'v:練習|れんしゅう', 'v:毎日|まいにち', 'v:弾く|ひく', 'v:来月|らいげつ', 'v:ある|ある', 'v:もう|もう', 'v:少し|すこし', 'v:教室|きょうしつ', 'v:何|なん', 'v:二|に', 'k:男', 'k:人', 'k:女', 'k:話', 'k:前', 'k:三', 'k:度', 'k:行', 'k:今', 'k:一', 'k:来', 'k:月', 'k:何', 'k:二'],
    verified: true }),

  L({ id: 'l:n4-after-graduation-plan', format: 'point', // review
    lines: [
      { speaker: 'N', furigana: '[男|おとこ]の　[人|ひと]と　[女|おんな]の　[人|ひと]が　[話|はな]して　います。' },
      { speaker: 'F', furigana: 'トムさん、[来年|らいねん]の　[春|はる]、[大学|だいがく]を　そつぎょうですね。その　あとは　どう　するんですか。' },
      { speaker: 'M', furigana: '[前|まえ]は　くにに　かえろうと　[思|おも]って　いたんですが、[日本|にほん]の　かいしゃで　はたらく　ことに　しました。' },
      { speaker: 'F', furigana: 'そうですか。ずっと　[日本|にほん]に　いるんですか。' },
      { speaker: 'M', furigana: '[三|さん][年|ねん]ぐらい　はたらいたら、くにへ　かえる　つもりです。' },
      { speaker: 'F', furigana: '[日本|にほん]で　もっと　べんきょうしたいとは　[思|おも]わなかったんですか。' },
      { speaker: 'M', furigana: 'それも　かんがえましたけど、はやく　しごとが　したかったんです。' }],
    question: '[男|おとこ]の　[人|ひと]は　[大学|だいがく]を　そつぎょうしたら、まず　どう　しますか。',
    options: ['くにへ　かえる', '[日本|にほん]の　かいしゃで　はたらく', '[日本|にほん]で　べんきょうを　つづける', 'くにで　はたらく'], answer: 1,
    names: ['トム', '日本|にほん'],
    en: 'Narrator: A man and a woman are talking. What will the man do first after he graduates? — F: Tom, you graduate from university next spring, right? What will you do after that? M: I used to think I\'d go back to my country, but I\'ve decided to work at a Japanese company. F: Really? Will you stay in Japan for good? M: I plan to go back home after working about three years. F: Didn\'t you want to study more in Japan? M: I thought about that too, but I wanted to start working soon. — What will he do first after he graduates?',
    explain: 'Going home was his old plan (前は…思っていた); now he has decided to work at a Japanese company (はたらくことにしました). He goes home only after about three years, and he chose work over more study.',
    uses: ['g:to', 'g:ga', 'g:te-iru', 'g:ne', 'g:n-desu', 'g:you-to-omou', 'g:te-ita', 'g:koto-ni-suru', 'g:tara', 'g:tsumori', 'g:tai', 'g:kedo', 'g:de', 'g:no', 'g:ka', 'g:mashita', 'v:男|おとこ', 'v:女|おんな', 'v:人|ひと', 'v:話す|はなす', 'v:さん|さん', 'v:来年|らいねん', 'v:春|はる', 'v:大学|だいがく', 'v:卒業|そつぎょう', 'v:その|その', 'v:後|あと', 'v:どう|どう', 'v:する|する', 'v:前|まえ', 'v:国|くに', 'v:帰る|かえる', 'v:思う|おもう', 'v:会社|かいしゃ', 'v:働く|はたらく', 'v:事|こと', 'v:そう|そう', 'v:居る|いる', 'v:三|さん', 'v:年|ねん', 'v:もっと|もっと', 'v:勉強|べんきょう', 'v:それ|それ', 'v:考える|かんがえる', 'v:早い|はやい', 'v:仕事|しごと', 'v:まず|まず', 'v:続ける|つづける', 'k:男', 'k:人', 'k:女', 'k:話', 'k:来', 'k:年', 'k:春', 'k:大', 'k:学', 'k:前', 'k:思', 'k:日', 'k:本', 'k:三'],
    verified: true }),

  // ── utterance (発話表現) ──
  L({ id: 'l:n4-leave-work-early', format: 'utterance', // mock-1
    lines: [
      { speaker: 'N', furigana: 'ねつが　あるので、きょうは　はやく　かえりたいです。' }],
    question: 'かちょうに　なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['すみません、きょうは　はやく　かえらせて　いただけませんか。', 'すみません、きょうは　はやく　かえって　いただけませんか。', 'すみません、きょうは　はやく　かえらなくても　いいですよ。'], answer: 0,
    en: 'Narrator: You have a fever, so you want to go home early today. What do you say to your section chief? — 1. Excuse me, could you let me go home early today? 2. Excuse me, could you go home early today? 3. Excuse me, you do not have to go home early today.',
    explain: 'You ask to be allowed to leave: the causative かえらせて + いただけませんか, "could you let me go home". かえっていただけませんか asks the chief to go home, and かえらなくてもいいですよ tells the chief they need not leave early.',
    uses: ['g:ka', 'g:masu', 'g:node', 'g:tai', 'g:causative', 'g:te-itadakemasen-ka', 'g:nakute-mo-ii', 'g:yo', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:熱|ねつ', 'v:ある|ある', 'v:今日|きょう', 'v:早い|はやい', 'v:帰る|かえる', 'v:課長|かちょう', 'v:頂く|いただく', 'v:いい|いい'],
    verified: true }),

  L({ id: 'l:n4-late-for-meeting', format: 'utterance', // mock-1
    lines: [
      { speaker: 'N', furigana: 'かいぎに　おくれました。いま、かいぎしつに　[入|はい]ります。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['おくれても　いいですか。', 'おくれて　よかったです。', 'おくれて　すみません。'], answer: 2,
    en: 'Narrator: You are late for a meeting. You are going into the meeting room now. What do you say? — 1. May I be late? 2. I\'m glad I was late. 3. Sorry I\'m late.',
    explain: 'You are already late, so you apologise: おくれてすみません. おくれてもいいですか asks permission before the fact, and おくれてよかった says you are glad you were late.',
    uses: ['g:ka', 'g:masu', 'g:mashita', 'g:te-sumimasen', 'g:te-mo-ii', 'g:te-yokatta', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:会議|かいぎ', 'v:遅れる|おくれる', 'v:今|いま', 'v:会議室|かいぎしつ', 'v:入る|はいる', 'v:いい|いい', 'k:入'],
    verified: true }),

  L({ id: 'l:n4-gift-wrapping', format: 'utterance', // mock-1
    lines: [
      { speaker: 'N', furigana: 'みせで　ともだちに　あげる　プレゼントを　[買|か]いました。きれいに　つつんで　ほしいです。' }],
    question: '[店|みせ]の　[人|ひと]に　なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['すみません、つつんで　さしあげましょうか。', 'すみません、つつんで　いただけませんか。', 'すみません、つつまなくても　いいですか。'], answer: 1,
    en: 'Narrator: At a shop you bought a present for a friend. You want it wrapped nicely. What do you say to the shop assistant? — 1. Excuse me, shall I wrap it for you? 2. Excuse me, could you wrap it for me? 3. Excuse me, is it all right not to wrap it?',
    explain: 'You want the assistant to wrap it: つつんでいただけませんか. さしあげましょうか offers to wrap it for the assistant, and つつまなくてもいいですか asks to skip the wrapping.',
    uses: ['g:ka', 'g:masu', 'g:de', 'g:noun-modifier', 'g:mashita', 'g:te-hoshii', 'g:te-itadakemasen-ka', 'g:mashou-ka', 'g:nakute-mo-ii', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:店|みせ', 'v:友達|ともだち', 'v:あげる|あげる', 'v:プレゼント|プレゼント', 'v:買う|かう', 'v:きれい|きれい', 'v:包む|つつむ', 'v:欲しい|ほしい', 'v:人|ひと', 'v:頂く|いただく', 'v:差し上げる|さしあげる', 'v:いい|いい', 'k:買', 'k:店', 'k:人'],
    verified: true }),

  L({ id: 'l:n4-enter-teachers-room', format: 'utterance', // mock-1
    lines: [
      { speaker: 'N', furigana: '[先生|せんせい]に　しつもんが　あります。いまから　[先生|せんせい]の　へやに　[入|はい]ります。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['しつれいしました。', 'しつれいします。', 'おまたせしました。'], answer: 1,
    en: 'Narrator: You have a question for your teacher. You are about to go into the teacher\'s room. What do you say? — 1. Excuse me (for having been here). 2. Excuse me (for coming in). 3. Sorry to keep you waiting.',
    explain: 'Going in, you say しつれいします. The past form しつれいしました is said when you leave, and おまたせしました is for someone you kept waiting.',
    uses: ['g:ka', 'g:masu', 'g:ga-arimasu', 'g:kara', 'g:no', 'g:mashita', 'v:何|なん', 'v:言う|いう', 'v:先生|せんせい', 'v:質問|しつもん', 'v:ある|ある', 'v:今|いま', 'v:部屋|へや', 'v:入る|はいる', 'v:失礼|しつれい', 'v:する|する', 'v:待つ|まつ', 'k:先', 'k:生', 'k:入'],
    verified: true }),

  L({ id: 'l:n4-thanks-moving-help', format: 'utterance', // mock-1
    lines: [
      { speaker: 'N', furigana: 'ともだちが　[日曜日|にちようび]の　ひっこしを　てつだって　くれました。' }],
    question: 'ともだちに　なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['てつだって　くれて　ありがとう。', 'こんども　てつだって　あげようか。', 'てつだって　くれない？'], answer: 0,
    en: 'Narrator: Your friend helped you move house on Sunday. What do you say to your friend? — 1. Thanks for helping me. 2. Shall I help you next time too? 3. Won\'t you help me?',
    explain: 'The help is already done, so you thank them: てつだってくれてありがとう. あげようか offers your help to them, and くれない? asks for help you already got.',
    uses: ['g:ka', 'g:masu', 'g:te-kurete-arigatou', 'g:te-kureru', 'g:te-ageru', 'g:volitional', 'g:no', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:友達|ともだち', 'v:日曜日|にちようび', 'v:引っ越す|ひっこす', 'v:手伝う|てつだう', 'v:くれる|くれる', 'v:あげる|あげる', 'v:今度|こんど', 'k:日', 'k:曜'],
    verified: true }),

  L({ id: 'l:n4-leaving-before-others', format: 'utterance', // mock-2
    lines: [
      { speaker: 'N', furigana: 'しごとが　おわりました。まだ　しごとを　して　いる　[人|ひと]より　さきに　かえります。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['どうぞ　おさきに　かえって　ください。', 'おつかれさまでした。', 'おさきに　しつれいします。'], answer: 2,
    en: 'Narrator: Your work is finished. You are going home before the people who are still working. What do you say? — 1. Please go home before me. 2. Thank you for your hard work. 3. Excuse me for leaving before you.',
    explain: 'The one who leaves first says おさきにしつれいします. おつかれさまでした is what the people staying say back to you, and どうぞおさきにかえってください tells the others to leave first.',
    uses: ['g:ka', 'g:masu', 'g:mashita', 'g:te-iru', 'g:noun-modifier', 'g:mada', 'g:ni', 'g:te-kudasai', 'v:何|なん', 'v:言う|いう', 'v:仕事|しごと', 'v:終わる|おわる', 'v:まだ|まだ', 'v:する|する', 'v:人|ひと', 'v:より|より', 'v:先|さき', 'v:帰る|かえる', 'v:失礼|しつれい', 'v:どうぞ|どうぞ', 'v:疲れる|つかれる', 'k:人'],
    verified: true }),

  L({ id: 'l:n4-broke-friends-umbrella', format: 'utterance', // mock-2
    lines: [
      { speaker: 'N', furigana: 'ともだちに　かりた　かさを　こわして　しまいました。' }],
    question: 'ともだちに　なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['かさを　こわして　しまって　ごめんね。', 'かさを　かして　くれて、ありがとう。', 'かさを　こわさないでね。'], answer: 0,
    en: 'Narrator: You broke the umbrella you borrowed from a friend. What do you say to your friend? — 1. Sorry I broke your umbrella. 2. Thanks for lending me your umbrella. 3. Don\'t break the umbrella, OK?',
    explain: 'You broke it, so you apologise for it: こわしてしまって、ごめんね (te-form + ごめん). Thanking them for the loan skips the apology, and こわさないでね tells the friend not to break it.',
    uses: ['g:ka', 'g:masu', 'g:noun-modifier', 'g:te-shimau', 'g:te-sumimasen', 'g:te-kureru', 'g:ne', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:友達|ともだち', 'v:借りる|かりる', 'v:傘|かさ', 'v:壊す|こわす', 'v:貸す|かす', 'v:くれる|くれる'],
    verified: true }),

  L({ id: 'l:n4-photo-of-us', format: 'utterance', // mock-2
    lines: [
      { speaker: 'N', furigana: 'りょこうで　ともだちと　いっしょに　しゃしんを　とりたいです。' }],
    question: 'ちかくに　いる　[人|ひと]に　なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['すみません、しゃしんを　とっても　いいですか。', 'すみません、しゃしんを　とって　さしあげましょうか。', 'すみません、しゃしんを　とって　いただけませんか。'], answer: 2,
    en: 'Narrator: On a trip, you want a photo together with your friend. What do you say to someone nearby? — 1. Excuse me, may I take a photo? 2. Excuse me, shall I take a photo for you? 3. Excuse me, could you take a photo of us?',
    explain: 'Both of you want to be in it, so someone else has to take it: とっていただけませんか. とってもいいですか asks permission to take a photo yourself, and さしあげましょうか offers to take theirs.',
    uses: ['g:ka', 'g:masu', 'g:de', 'g:to', 'g:tai', 'g:te-itadakemasen-ka', 'g:te-mo-ii', 'g:mashou-ka', 'g:noun-modifier', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:旅行|りょこう', 'v:友達|ともだち', 'v:一緒|いっしょ', 'v:写真|しゃしん', 'v:撮る|とる', 'v:近く|ちかく', 'v:居る|いる', 'v:人|ひと', 'v:頂く|いただく', 'v:いい|いい', 'v:差し上げる|さしあげる', 'k:人'],
    verified: true }),

  L({ id: 'l:n4-no-more-thank-you', format: 'utterance', // mock-2
    lines: [
      { speaker: 'N', furigana: 'ともだちの　いえで　ばんごはんを　たくさん　[食|た]べました。ともだちの　おかあさんが、もっと　どうぞと　[言|い]って　います。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['じゃあ、えんりょしないで　ください。', 'もう　じゅうぶん　いただきました。', 'どうぞ、めしあがって　ください。'], answer: 1,
    en: 'Narrator: You ate a lot of dinner at a friend\'s house. Your friend\'s mother is saying "Please have more." What do you say? — 1. Then please don\'t hold back. 2. I\'ve already had plenty, thank you. 3. Please, help yourself.',
    explain: 'You are full, so you decline politely with the humble いただきました: もうじゅうぶんいただきました. えんりょしないでください and めしあがってください are what the host says to a guest.',
    uses: ['g:ka', 'g:masu', 'g:de', 'g:mashita', 'g:to', 'g:te-iru', 'g:nai-de-kudasai', 'g:sonkeigo-verbs', 'g:te-kudasai', 'g:no', 'v:何|なん', 'v:言う|いう', 'v:友達|ともだち', 'v:家|いえ', 'v:晩御飯|ばんごはん', 'v:たくさん|たくさん', 'v:食べる|たべる', 'v:お母さん|おかあさん', 'v:もっと|もっと', 'v:どうぞ|どうぞ', 'v:もう|もう', 'v:十分|じゅうぶん', 'v:頂く|いただく', 'v:じゃあ|じゃあ', 'v:遠慮|えんりょ', 'v:召し上がる|めしあがる', 'k:食', 'k:言'],
    verified: true }),

  L({ id: 'l:n4-try-on-trousers', format: 'utterance', // mock-2
    lines: [
      { speaker: 'N', furigana: 'みせで　ズボンを　[見|み]て　います。はいて　みたいです。' }],
    question: '[店|みせ]の　[人|ひと]に　なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['これ、はいて　みて　ください。', 'これ、はいて　みても　いいですか。', 'これ、はかなくても　いいですか。'], answer: 1,
    en: 'Narrator: You are looking at trousers in a shop. You want to try them on. What do you say to the shop assistant? — 1. Please try these on. 2. May I try these on? 3. Is it all right if I don\'t wear these?',
    explain: 'You ask permission to try them: はいてみてもいいですか (てみる + てもいい). はいてみてください tells the assistant to try them on, and はかなくてもいいですか asks to be let off wearing them.',
    uses: ['g:ka', 'g:masu', 'g:de', 'g:te-iru', 'g:te-miru', 'g:tai', 'g:te-mo-ii', 'g:te-kudasai', 'g:nakute-mo-ii', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:店|みせ', 'v:ズボン|ズボン', 'v:見る|みる', 'v:はく|はく', 'v:人|ひと', 'v:これ|これ', 'v:いい|いい', 'k:見', 'k:店', 'k:人'],
    verified: true }),

  L({ id: 'l:n4-message-call-back', format: 'utterance', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[川口|かわぐち]さんの　かいしゃに　[電話|でんわ]を　かけましたが、[川口|かわぐち]さんは　いませんでした。あとで　[電話|でんわ]が　ほしいです。' }],
    question: '[電話|でんわ]に　[出|で]た　[人|ひと]に　なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['あとで　[電話|でんわ]を　くださいと　つたえて　いただけますか。', 'あとで　[電話|でんわ]を　いただいたと　つたえて　おいて　ください。', 'あとで　[電話|でんわ]を　して　あげて　いただけますか。'], answer: 0,
    names: ['川口|かわぐち'],
    en: 'Narrator: You phoned Mr. Kawaguchi\'s company, but he was not there. You want him to call you later. What do you say to the person who answered? — 1. Could you tell him to call me later? 2. Please tell him I received his call later. 3. Could you call him later for him?',
    explain: 'You want a message passed on: 電話をくださいとつたえていただけますか, "could you tell him to call me". The second option says a call already came, and the third asks the person who answered to make the call.',
    uses: ['g:ka', 'g:masu', 'g:no', 'g:deshita', 'g:mashita', 'g:ga-hoshii', 'g:te-oku', 'g:noun-modifier', 'g:te-ageru', 'g:to', 'g:ni', 'g:te-kudasai', 'v:何|なん', 'v:言う|いう', 'v:さん|さん', 'v:会社|かいしゃ', 'v:電話|でんわ', 'v:掛ける|かける', 'v:居る|いる', 'v:後|あと', 'v:欲しい|ほしい', 'v:出る|でる', 'v:人|ひと', 'v:ください|ください', 'v:伝える|つたえる', 'v:頂く|いただく', 'v:する|する', 'v:あげる|あげる', 'k:川', 'k:口', 'k:電', 'k:話', 'k:出', 'k:人'],
    verified: true }),

  L({ id: 'l:n4-guest-at-the-door', format: 'utterance', // diagnostic
    lines: [
      { speaker: 'N', furigana: '[先生|せんせい]が　あなたの　うちに　[来|き]ました。げんかんで　くつを　ぬいで　います。' }],
    question: '[先生|せんせい]に　なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['どうぞ、おかえり　ください。', 'どうぞ、おじゃまします。', 'どうぞ、おあがり　ください。'], answer: 2,
    en: 'Narrator: Your teacher has come to your home and is taking off their shoes in the entrance. What do you say to the teacher? — 1. Please, go home. 2. Please, sorry to intrude. 3. Please, come on in.',
    explain: 'You invite the guest up into the house: おあがりください (お + stem + ください). おかえりください tells the guest to leave, and おじゃまします is the guest\'s own line when coming in.',
    uses: ['g:ka', 'g:masu', 'g:o-kudasai', 'g:te-iru', 'g:ni', 'g:de', 'g:mashita', 'v:何|なん', 'v:言う|いう', 'v:先生|せんせい', 'v:あなた|あなた', 'v:うち|うち', 'v:来る|くる', 'v:玄関|げんかん', 'v:靴|くつ', 'v:脱ぐ|ぬぐ', 'v:どうぞ|どうぞ', 'v:上がる|あがる', 'v:帰る|かえる', 'v:邪魔|じゃま', 'v:する|する', 'k:先', 'k:生', 'k:来'],
    verified: true }),

  L({ id: 'l:n4-ask-heater-on', format: 'utterance', // diagnostic
    lines: [
      { speaker: 'N', furigana: 'ともだちの　へやが　さむいです。だんぼうを　つけて　ほしいです。' }],
    question: 'ともだちに　なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['ねえ、だんぼう、つけて　くれない？', 'ねえ、だんぼう、けして　くれない？', 'ねえ、だんぼう、つけて　あげようか。'], answer: 0,
    en: 'Narrator: Your friend\'s room is cold. You want the heater turned on. What do you say to your friend? — 1. Hey, could you turn the heater on? 2. Hey, could you turn the heater off? 3. Hey, shall I turn the heater on for you?',
    explain: 'You ask the friend to turn it on for you: つけてくれない? けして is "turn off", the opposite, and つけてあげようか offers to do it for them in their own room.',
    uses: ['g:ka', 'g:masu', 'g:no', 'g:te-hoshii', 'g:te-kureru', 'g:te-ageru', 'g:volitional', 'g:ni', 'v:何|なん', 'v:言う|いう', 'v:友達|ともだち', 'v:部屋|へや', 'v:寒い|さむい', 'v:暖房|だんぼう', 'v:つける|つける', 'v:欲しい|ほしい', 'v:くれる|くれる', 'v:消す|けす', 'v:あげる|あげる'],
    verified: true }),

  L({ id: 'l:n4-coworker-headache', format: 'utterance', // review
    lines: [
      { speaker: 'N', furigana: 'しごとの　とちゅうで、となりの　[人|ひと]が、あたまが　いたいと　[言|い]って　います。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['きょうは　はやく　かえらなくても　いいですよ。', 'きょうは　もう　すこし　がんばりましょうか。', 'きょうは　はやく　かえった　ほうが　いいですよ。'], answer: 2,
    en: 'Narrator: In the middle of work, the person next to you says they have a headache. What do you say? — 1. You don\'t have to go home early today. 2. Shall we work a bit harder today? 3. You\'d better go home early today.',
    explain: 'Advice to rest is ほうがいい: はやくかえったほうがいいですよ. かえらなくてもいい says they need not go home, and もうすこしがんばりましょうか pushes them to keep working.',
    uses: ['g:ka', 'g:masu', 'g:no', 'g:de', 'g:to', 'g:te-iru', 'g:hou-ga-ii', 'g:nakute-mo-ii', 'g:mashou-ka', 'g:yo', 'v:何|なん', 'v:言う|いう', 'v:仕事|しごと', 'v:途中|とちゅう', 'v:隣|となり', 'v:人|ひと', 'v:頭|あたま', 'v:痛い|いたい', 'v:今日|きょう', 'v:早い|はやい', 'v:帰る|かえる', 'v:ほう|ほう', 'v:いい|いい', 'v:もう|もう', 'v:少し|すこし', 'v:頑張る|がんばる', 'k:人', 'k:言'],
    verified: true }),

  L({ id: 'l:n4-after-dinner-host', format: 'utterance', // review
    lines: [
      { speaker: 'N', furigana: 'ともだちの　うちで　ばんごはんを　ごちそうに　なりました。[食|た]べおわりました。' }],
    question: 'なんと　いいますか。',
    optionSpeaker: 'F',
    options: ['いただきます。', 'ごちそうさまでした。', 'おまちどおさまでした。'], answer: 1,
    en: 'Narrator: Your friend treated you to dinner at their home. You have finished eating. What do you say? — 1. Let\'s eat. 2. Thank you for the meal. 3. Sorry to keep you waiting.',
    explain: 'After eating you say ごちそうさまでした. いただきます is said before you start, and おまちどおさまでした is what a cook or waiter says when the food is late.',
    uses: ['g:ka', 'g:masu', 'g:de', 'g:naru', 'g:stem-compounds', 'g:mashita', 'g:no', 'v:何|なん', 'v:言う|いう', 'v:友達|ともだち', 'v:うち|うち', 'v:晩御飯|ばんごはん', 'v:ごちそう|ごちそう', 'v:なる|なる', 'v:食べる|たべる', 'v:終わる|おわる', 'v:頂く|いただく', 'v:待つ|まつ', 'k:食'],
    verified: true }),

  L({ id: 'l:n4-leaving-sick-visit', format: 'utterance', // review
    lines: [
      { speaker: 'N', furigana: 'びょうきで　[入院|にゅういん]して　いる　ともだちの　おみまいに　[来|き]ました。もう　かえります。' }],
    question: 'ともだちに　なんと　いいますか。',
    optionSpeaker: 'M',
    options: ['じゃあ、おかげさまで。', 'じゃあ、おだいじに。', 'じゃあ、おさきに　どうぞ。'], answer: 1,
    en: 'Narrator: You came to visit a friend who is in hospital, ill. You are going home now. What do you say to your friend? — 1. Well, thanks to you. 2. Well, take care of yourself. 3. Well, after you.',
    explain: 'To someone who is ill you say おだいじに, "take care of yourself". おかげさまで is how the sick person answers when asked how they are, and おさきにどうぞ lets someone go first.',
    uses: ['g:ka', 'g:masu', 'g:te-adj-noun', 'g:te-iru', 'g:noun-modifier', 'g:ni', 'g:no', 'g:mashita', 'v:何|なん', 'v:言う|いう', 'v:病気|びょうき', 'v:入院|にゅういん', 'v:友達|ともだち', 'v:お見舞い|おみまい', 'v:来る|くる', 'v:もう|もう', 'v:帰る|かえる', 'v:じゃあ|じゃあ', 'v:大事|だいじ', 'v:おかげ|おかげ', 'v:先|さき', 'v:どうぞ|どうぞ', 'k:入', 'k:院', 'k:来'],
    verified: true }),

  // ── quick (即時応答) ──
  L({ id: 'l:n4-leaving-first', format: 'quick', // mock-1
    lines: [
      { speaker: 'M', furigana: 'おさきに　しつれいします。' }],
    optionSpeaker: 'F',
    options: ['おつかれさまでした。', 'いって　らっしゃい。', 'おまたせ　いたしました。'], answer: 0,
    en: 'Man: Excuse me for leaving before you. — 1. Thanks for your hard work. 2. See you later (have a good trip). 3. Sorry to keep you waiting.',
    explain: 'A coworker leaving first says おさきにしつれいします, and the people staying answer おつかれさまでした. いってらっしゃい sends someone off who will come back, and おまたせしました apologises for being late.',
    uses: ['g:mashita', 'v:先|さき', 'v:失礼|しつれい', 'v:する|する', 'v:疲れる|つかれる', 'v:行く|いく', 'v:待つ|まつ'],
    verified: true }),

  L({ id: 'l:n4-check-these-papers', format: 'quick', // mock-1
    lines: [
      { speaker: 'F', furigana: 'この　しりょう、[見|み]て　いただけますか。' }],
    optionSpeaker: 'M',
    options: ['じゃあ、[見|み]せて　あげましょう。', 'もう　[見|み]て　もらいましたよ。', 'いいですよ。そこに　おいて　おいて　ください。'], answer: 2,
    en: 'Woman: Could you look over these materials? — 1. Then I\'ll show them to you. 2. I already had someone look at them. 3. Sure. Please leave them there.',
    explain: 'She asks him to look at them, so he agrees and says where to put them: そこにおいておいてください. 見せてあげましょう offers to show them to her, and 見てもらいました says he had someone else check something.',
    uses: ['g:te-morau', 'g:potential', 'g:ka', 'g:yo', 'g:te-oku', 'g:te-kudasai', 'g:te-ageru', 'g:mashou', 'g:mashita', 'v:この|この', 'v:見る|みる', 'v:頂く|いただく', 'v:いい|いい', 'v:そこ|そこ', 'v:置く|おく', 'v:じゃあ|じゃあ', 'v:見せる|みせる', 'v:あげる|あげる', 'v:もう|もう', 'v:もらう|もらう', 'k:見'],
    verified: true }),

  L({ id: 'l:n4-if-it-rains', format: 'quick', // mock-1
    lines: [
      { speaker: 'M', furigana: 'あした　[雨|あめ]だったら、どう　する？' }],
    optionSpeaker: 'F',
    options: ['はれて　よかったね。', 'うちで　えいがでも　[見|み]ようか。', 'きのうは　[雨|あめ]が　ふって　いたよ。'], answer: 1,
    en: 'Man: What shall we do if it rains tomorrow? — 1. Glad it cleared up. 2. Shall we watch a film or something at home? 3. It was raining yesterday.',
    explain: 'だったら sets up "if it rains tomorrow", so she offers a rainy-day plan: うちでえいがでも見ようか. The other two talk about weather that has already happened.',
    uses: ['g:tara', 'g:demo', 'g:volitional', 'g:ka', 'g:te-yokatta', 'g:ne', 'g:te-iru', 'g:yo', 'v:明日|あした', 'v:雨|あめ', 'v:どう|どう', 'v:する|する', 'v:うち|うち', 'v:映画|えいが', 'v:見る|みる', 'v:晴れる|はれる', 'v:昨日|きのう', 'v:降る|ふる', 'k:雨', 'k:見'],
    verified: true }),

  L({ id: 'l:n4-party-next-week', format: 'quick', // mock-1
    lines: [
      { speaker: 'F', furigana: '[来週|らいしゅう]の　パーティー、[行|い]く？' }],
    optionSpeaker: 'M',
    options: ['たのしかったね。また　[行|い]こう。', '[行|い]きたいけど、しごとが　あるんだ。', 'パーティーは　[来週|らいしゅう]だったよ。'], answer: 1,
    en: 'Woman: Are you going to next week\'s party? — 1. That was fun. Let\'s go again. 2. I want to, but I have work. 3. The party was next week.',
    explain: 'The party is still to come, so he answers about his plans: he wants to go, but he has work. たのしかったね talks as if it is over, and the last reply only repeats the date in the past.',
    uses: ['g:tai', 'g:kedo', 'g:ne', 'g:volitional', 'g:yo', 'g:deshita', 'g:no', 'v:来週|らいしゅう', 'v:パーティー|パーティー', 'v:行く|いく', 'v:仕事|しごと', 'v:ある|ある', 'v:楽しい|たのしい', 'v:また|また', 'k:来', 'k:週', 'k:行'],
    verified: true }),

  L({ id: 'l:n4-cold-better', format: 'quick', // mock-1
    lines: [
      { speaker: 'M', furigana: 'かぜは　もう　いいんですか。' }],
    optionSpeaker: 'F',
    options: ['おかげさまで、よく　なりました。', 'それは　よかったですね。', 'どうぞ、おだいじに。'], answer: 0,
    en: 'Man: Is your cold better now? — 1. Yes, thank you, I\'m better now. 2. That\'s good to hear. 3. Please take care.',
    explain: 'He asks about her cold, so she answers for herself: おかげさまで、よくなりました. それはよかったですね and おだいじに are what he would say to her.',
    uses: ['g:n-desu', 'g:ka', 'g:naru', 'g:mashita', 'g:ne', 'v:風邪|かぜ', 'v:もう|もう', 'v:いい|いい', 'v:おかげ|おかげ', 'v:よく|よく', 'v:なる|なる', 'v:どうぞ|どうぞ', 'v:大事|だいじ'],
    verified: true }),

  L({ id: 'l:n4-carry-for-you', format: 'quick', // mock-1
    lines: [
      { speaker: 'M', furigana: 'にもつ、[持|も]ちましょうか。' }],
    optionSpeaker: 'F',
    options: ['じゃあ、わたしが　[持|も]って　あげますね。', 'もう　[持|も]って　もらいました。', 'すみません、おねがいします。'], answer: 2,
    en: 'Man: Shall I carry your bags? — 1. Then I\'ll carry it for you. 2. I already had someone carry it. 3. Thanks, yes please.',
    explain: '持ちましょうか offers help, so she accepts: おねがいします. 持ってあげますね offers to carry his bags instead, and もう持ってもらいました does not fit bags she is still holding.',
    uses: ['g:mashou-ka', 'g:te-ageru', 'g:ne', 'g:te-morau', 'g:mashita', 'v:荷物|にもつ', 'v:持つ|もつ', 'v:じゃあ|じゃあ', 'v:私|わたし', 'v:あげる|あげる', 'v:もう|もう', 'v:もらう|もらう', 'k:持'],
    verified: true }),

  L({ id: 'l:n4-who-made-cake', format: 'quick', // mock-1
    lines: [
      { speaker: 'F', furigana: 'この　ケーキ、おいしいね。だれが　[作|つく]ったの？' }],
    optionSpeaker: 'M',
    options: ['[母|はは]に　[作|つく]って　もらったんだ。', '[母|はは]に　[作|つく]って　あげたんだ。', '[母|はは]が　[買|か]って　きて　くれたんだ。'], answer: 0,
    en: 'Woman: This cake is delicious. Who made it? — 1. My mum made it for me. 2. I made it for my mum. 3. My mum bought it for me.',
    explain: 'だれが作ったの asks who made it: 母に作ってもらった, his mother made it for him. 作ってあげた means he made it for her, and 買ってくれた means it was bought, not made.',
    uses: ['g:ne', 'g:no', 'g:te-morau', 'g:te-ageru', 'g:te-kureru', 'g:ka', 'v:この|この', 'v:ケーキ|ケーキ', 'v:おいしい|おいしい', 'v:誰|だれ', 'v:作る|つくる', 'v:母|はは', 'v:もらう|もらう', 'v:あげる|あげる', 'v:買う|かう', 'v:くれる|くれる', 'k:作', 'k:母', 'k:買'],
    verified: true }),

  L({ id: 'l:n4-homework-handed-in', format: 'quick', // mock-1
    lines: [
      { speaker: 'M', furigana: 'しゅくだい、もう　[出|だ]した？' }],
    optionSpeaker: 'F',
    options: ['じゃあ、わたしが　[出|だ]して　あげるね。', 'もう　[出|で]かけたよ。', 'ごめん、まだ　[出|だ]して　いない。'], answer: 2,
    en: 'Man: Have you handed in the homework yet? — 1. Then I\'ll hand it in for you. 2. She already went out. 3. Sorry, I haven\'t handed it in yet.',
    explain: 'もう…出した? asks if she has handed it in, and まだ出していない answers "not yet". 出してあげる offers to hand in his, and 出かけた is "went out", a different verb.',
    uses: ['g:mada-te-imasen', 'g:te-ageru', 'g:ne', 'g:yo', 'g:te-iru', 'v:宿題|しゅくだい', 'v:もう|もう', 'v:出す|だす', 'v:まだ|まだ', 'v:じゃあ|じゃあ', 'v:あげる|あげる', 'v:私|わたし', 'v:出かける|でかける', 'k:出'],
    verified: true }),

  L({ id: 'l:n4-is-the-teacher-in', format: 'quick', // mock-2
    lines: [
      { speaker: 'M', furigana: 'すみません、[田中|たなか][先生|せんせい]は　いらっしゃいますか。' }],
    optionSpeaker: 'F',
    options: ['あとで　うかがいます。', 'いま、じゅぎょう[中|ちゅう]ですよ。', 'どうぞ、めしあがって　ください。'], answer: 1,
    names: ['田中|たなか'],
    en: 'Man: Excuse me, is Professor Tanaka in? — 1. I\'ll come and see you later. 2. She\'s in a class right now. 3. Please, help yourself.',
    explain: 'いらっしゃいますか asks whether the teacher is there, so she says where the teacher is: in class now. あとでうかがいます is the visitor\'s line, and めしあがってください offers food.',
    uses: ['g:sonkeigo-verbs', 'g:ka', 'g:yo', 'g:te-kudasai', 'g:masu', 'v:先生|せんせい', 'v:いらっしゃる|いらっしゃる', 'v:今|いま', 'v:授業|じゅぎょう', 'v:中|ちゅう', 'v:後|あと', 'v:伺う|うかがう', 'v:どうぞ|どうぞ', 'v:召し上がる|めしあがる', 'k:田', 'k:中', 'k:先', 'k:生'],
    verified: true }),

  L({ id: 'l:n4-how-was-the-film', format: 'quick', // mock-2
    lines: [
      { speaker: 'F', furigana: 'きのうの　えいが、どうだった？' }],
    optionSpeaker: 'M',
    options: ['[来週|らいしゅう]　[見|み]に　[行|い]く　よていなんだよ。', '[思|おも]ったより　おもしろかったよ。', 'いっしょに　[見|み]に　[行|い]こうか。'], answer: 1,
    en: 'Woman: How was the film yesterday? — 1. I\'m planning to go and see it next week. 2. It was more fun than I expected. 3. Shall we go and see it together?',
    explain: 'どうだった asks how a film he has already seen was, so he gives an opinion: 思ったよりおもしろかった. The other two talk about seeing a film in the future.',
    uses: ['g:no', 'g:deshita', 'g:adj-i', 'g:yo', 'g:ni-iku', 'g:volitional', 'g:ka', 'v:昨日|きのう', 'v:映画|えいが', 'v:どう|どう', 'v:思う|おもう', 'v:より|より', 'v:おもしろい|おもしろい', 'v:来週|らいしゅう', 'v:見る|みる', 'v:行く|いく', 'v:予定|よてい', 'v:一緒|いっしょ', 'k:来', 'k:週', 'k:見', 'k:行', 'k:思'],
    verified: true }),

  L({ id: 'l:n4-open-the-window', format: 'quick', // mock-2
    lines: [
      { speaker: 'F', furigana: 'まどを　あけましょうか。' }],
    optionSpeaker: 'M',
    options: ['すみません、たすかります。', 'まどを　あけても　いいですか。', 'あけて　あげますよ。'], answer: 0,
    en: 'Woman: Shall I open the window? — 1. Thanks, that would help. 2. May I open the window? 3. I\'ll open it for you.',
    explain: 'あけましょうか offers to open it for him, and he accepts with thanks. Asking permission to open it, or offering to open it for her, misses that she is the one offering.',
    uses: ['g:mashou-ka', 'g:te-mo-ii', 'g:te-ageru', 'g:yo', 'g:ka', 'v:窓|まど', 'v:開ける|あける', 'v:いい|いい', 'v:あげる|あげる'],
    verified: true }),

  L({ id: 'l:n4-getting-hungry', format: 'quick', // mock-2
    lines: [
      { speaker: 'M', furigana: 'おなか、すいたね。' }],
    optionSpeaker: 'F',
    options: ['わたしも　[食|た]べすぎて　しまった。', 'じゃあ、すこし　ここで　やすもうか。', 'じゃあ、なにか　[食|た]べに　[行|い]こうか。'], answer: 2,
    en: 'Man: I\'m getting hungry. — 1. I ate too much too. 2. Then shall we rest here a little? 3. Then shall we go and eat something?',
    explain: 'He is hungry, so going to eat fits. 食べすぎてしまった says the opposite (too full), and resting here does nothing about hunger.',
    uses: ['g:ne', 'g:ni-iku', 'g:volitional', 'g:ka', 'g:sugiru', 'g:te-shimau', 'g:mo', 'v:おなか|おなか', 'v:空く|すく', 'v:じゃあ|じゃあ', 'v:何|なに', 'v:食べる|たべる', 'v:行く|いく', 'v:私|わたし', 'v:少し|すこし', 'v:ここ|ここ', 'v:休む|やすむ', 'k:食', 'k:行'],
    verified: true }),

  L({ id: 'l:n4-borrow-your-pen', format: 'quick', // mock-2
    lines: [
      { speaker: 'F', furigana: 'この　ペン、ちょっと　かりても　いい？' }],
    optionSpeaker: 'M',
    options: ['いいよ、どうぞ。', 'ありがとう、かりるね。', 'じゃあ、かして　くれる？'], answer: 0,
    en: 'Woman: Can I borrow this pen for a moment? — 1. Sure, go ahead. 2. Thanks, I\'ll borrow it. 3. Then will you lend it to me?',
    explain: 'She asks to borrow his pen, so he lets her: いいよ、どうぞ. The other two are what someone borrowing would say, not the owner.',
    uses: ['g:te-mo-ii', 'g:yo', 'g:ne', 'g:te-kureru', 'v:この|この', 'v:ペン|ペン', 'v:ちょっと|ちょっと', 'v:借りる|かりる', 'v:いい|いい', 'v:どうぞ|どうぞ', 'v:じゃあ|じゃあ', 'v:貸す|かす', 'v:くれる|くれる'],
    verified: true }),

  L({ id: 'l:n4-train-was-late', format: 'quick', // mock-2
    lines: [
      { speaker: 'M', furigana: 'けさ、[電車|でんしゃ]が　おくれたんだって？' }],
    optionSpeaker: 'F',
    options: ['じゃあ、つぎの　[電車|でんしゃ]に　しよう。', 'あしたは　おくれないでね。', 'そうなの。[一|いち][時|じ][間|かん]も　まったよ。'], answer: 2,
    en: 'Man: I heard your train was late this morning? — 1. Then let\'s take the next train. 2. Don\'t be late tomorrow, OK? 3. Yes. I waited a whole hour.',
    explain: 'He has heard about this morning, so she confirms and adds how long she waited (一時間も). The next-train plan is for a train still to come, and おくれないでね tells him not to be late.',
    uses: ['g:tte', 'g:no', 'g:number-mo', 'g:yo', 'g:volitional', 'g:ne', 'v:今朝|けさ', 'v:電車|でんしゃ', 'v:遅れる|おくれる', 'v:そう|そう', 'v:一|いち', 'v:時間|じかん', 'v:待つ|まつ', 'v:じゃあ|じゃあ', 'v:次|つぎ', 'v:する|する', 'v:明日|あした', 'k:電', 'k:車', 'k:一', 'k:時', 'k:間'],
    verified: true }),

  L({ id: 'l:n4-sorry-to-keep-you', format: 'quick', // mock-2
    lines: [
      { speaker: 'F', furigana: 'おまたせしました。' }],
    optionSpeaker: 'M',
    options: ['ちょっと　まって　いて　ください。', 'わたしも　いま　[来|き]た　ところです。', 'どうぞ、おさきに。'], answer: 1,
    en: 'Woman: Sorry to keep you waiting. — 1. Please wait a moment. 2. I\'ve only just got here myself. 3. Please, after you.',
    explain: 'She apologises for being late, and he kindly says he has only just arrived too (来たところです). まってください asks her to wait, and おさきに lets her go first.',
    uses: ['g:tokoro-da', 'g:mo', 'g:te-kudasai', 'g:mashita', 'v:待つ|まつ', 'v:私|わたし', 'v:今|いま', 'v:来る|くる', 'v:ちょっと|ちょっと', 'v:どうぞ|どうぞ', 'v:先|さき', 'k:来'],
    verified: true }),

  L({ id: 'l:n4-please-have-cake', format: 'quick', // mock-2
    lines: [
      { speaker: 'F', furigana: 'よかったら、ケーキ、めしあがって　ください。' }],
    optionSpeaker: 'M',
    options: ['どうぞ、めしあがって　ください。', 'じゃあ、えんりょなく　いただきます。', 'ごちそうさまでした。'], answer: 1,
    en: 'Woman: If you like, please have some cake. — 1. Please, help yourself. 2. Then I\'ll help myself, thank you. 3. Thank you for the meal.',
    explain: 'She offers cake with the honorific めしあがって, and he accepts with the humble いただきます. Repeating めしあがってください offers it back to her, and ごちそうさまでした is said after eating.',
    uses: ['g:tara', 'g:sonkeigo-verbs', 'g:te-kudasai', 'g:deshita', 'v:よい|よい', 'v:ケーキ|ケーキ', 'v:召し上がる|めしあがる', 'v:じゃあ|じゃあ', 'v:遠慮|えんりょ', 'v:頂く|いただく', 'v:どうぞ|どうぞ', 'v:ごちそう|ごちそう'],
    verified: true }),

  L({ id: 'l:n4-may-i-smoke', format: 'quick', // diagnostic
    lines: [
      { speaker: 'M', furigana: 'ここで　たばこを　すっても　いいですか。' }],
    optionSpeaker: 'F',
    options: ['すみません、ここでは　ちょっと……。', 'すみません、たばこは　[売|う]って　いないんです。', 'もう　すって　しまいました。'], answer: 0,
    en: 'Man: May I smoke here? — 1. Sorry, not here, I\'m afraid... 2. We don\'t sell cigarettes. 3. I\'ve already smoked it.',
    explain: 'He asks permission, and she politely refuses with ここではちょっと…. Selling cigarettes is not what he asked, and すってしまいました answers as if she were the smoker.',
    uses: ['g:de', 'g:te-mo-ii', 'g:ka', 'g:te-iru', 'g:n-desu', 'g:te-shimau', 'g:mashita', 'v:ここ|ここ', 'v:たばこ|たばこ', 'v:吸う|すう', 'v:いい|いい', 'v:ちょっと|ちょっと', 'v:売る|うる', 'v:もう|もう', 'k:売'],
    verified: true }),

  L({ id: 'l:n4-done-by-tomorrow', format: 'quick', // diagnostic
    lines: [
      { speaker: 'M', furigana: 'この　しごと、[明日|あした]までに　できますか。' }],
    optionSpeaker: 'F',
    options: ['[明日|あした]まで　やすみに　します。', '[明日|あした]までに　こちらに　[来|き]て　ください。', 'ちょっと　むずかしいかもしれません。'], answer: 2,
    en: 'Man: Can you get this work done by tomorrow? — 1. I\'ll take the days off until tomorrow. 2. Please come by tomorrow. 3. That might be a bit difficult.',
    explain: 'He asks whether she can finish by tomorrow, and she answers about that: it might be difficult (かもしれません). The other replies reuse 明日まで but answer nothing about the work.',
    uses: ['g:made-ni', 'g:potential', 'g:ka', 'g:kamo-shirenai', 'g:made', 'g:te-kudasai', 'v:この|この', 'v:仕事|しごと', 'v:明日|あした', 'v:できる|できる', 'v:ちょっと|ちょっと', 'v:難しい|むずかしい', 'v:休み|やすみ', 'v:する|する', 'v:こちら|こちら', 'v:来る|くる', 'k:明', 'k:日', 'k:来'],
    verified: true }),

  L({ id: 'l:n4-what-to-drink', format: 'quick', // diagnostic
    lines: [
      { speaker: 'F', furigana: 'おのみものは　[何|なに]に　なさいますか。' }],
    optionSpeaker: 'M',
    options: ['コーヒーを　おねがいします。', 'コーヒーに　なさいます。', 'コーヒーを　[飲|の]んで　いました。'], answer: 0,
    en: 'Woman: What would you like to drink? — 1. Coffee, please. 2. He will have coffee (honorific). 3. I was drinking coffee.',
    explain: 'The server uses the honorific なさいますか, but the customer just orders: コーヒーをおねがいします. なさいます is never used for yourself, and 飲んでいました is about the past.',
    uses: ['g:sonkeigo-verbs', 'g:ka', 'g:te-iru', 'g:mashita', 'v:飲み物|のみもの', 'v:何|なに', 'v:なさる|なさる', 'v:コーヒー|コーヒー', 'v:飲む|のむ', 'k:何', 'k:飲'],
    verified: true }),

  L({ id: 'l:n4-used-to-life-here', format: 'quick', // diagnostic
    lines: [
      { speaker: 'M', furigana: '[日本|にほん]の　せいかつには　もう　なれましたか。' }],
    optionSpeaker: 'F',
    options: ['[日本|にほん]は　はじめてです。', 'もうすぐ　かえります。', 'だいぶ　なれました。'], answer: 2,
    names: ['日本|にほん'],
    en: 'Man: Have you got used to life in Japan yet? — 1. It\'s my first time in Japan. 2. I\'m going home soon. 3. I\'m quite used to it now.',
    explain: 'なれましたか asks whether she has got used to it, and だいぶなれました answers that. A first visit and going home soon do not say whether she is used to life there.',
    uses: ['g:no', 'g:mashita', 'g:ka', 'g:wa-desu', 'v:生活|せいかつ', 'v:もう|もう', 'v:慣れる|なれる', 'v:大分|だいぶ', 'v:初めて|はじめて', 'v:もうすぐ|もうすぐ', 'v:帰る|かえる', 'k:日', 'k:本'],
    verified: true }),

  L({ id: 'l:n4-nice-bag-where', format: 'quick', // review
    lines: [
      { speaker: 'F', furigana: 'その　かばん、いいね。どこで　[買|か]ったの？' }],
    optionSpeaker: 'M',
    options: ['[五|ご][千|せん][円|えん]ぐらいだったよ。', '[駅|えき]の　[前|まえ]の　デパートだよ。', '[先週|せんしゅう]の　[日曜日|にちようび]だよ。'], answer: 1,
    en: 'Woman: That bag is nice. Where did you buy it? — 1. It was about 5,000 yen. 2. At the department store in front of the station. 3. Last Sunday.',
    explain: 'どこで asks where, so the answer names a place: the department store by the station. The price answers いくら, and last Sunday answers いつ.',
    uses: ['g:ne', 'g:de', 'g:no', 'g:yo', 'g:deshita', 'v:その|その', 'v:かばん|かばん', 'v:いい|いい', 'v:どこ|どこ', 'v:買う|かう', 'v:駅|えき', 'v:前|まえ', 'v:デパート|デパート', 'v:五|ご', 'v:千|せん', 'v:円|えん', 'v:先週|せんしゅう', 'v:日曜日|にちようび', 'k:買', 'k:五', 'k:千', 'k:円', 'k:駅', 'k:前', 'k:先', 'k:週', 'k:日', 'k:曜'],
    verified: true }),

  L({ id: 'l:n4-help-me-tomorrow', format: 'quick', // review
    lines: [
      { speaker: 'F', furigana: '[明日|あした]、ひっこし　てつだって　くれない？' }],
    optionSpeaker: 'M',
    options: ['てつだって　くれて　ありがとう。', 'いいよ。[何|なん][時|じ]に　[行|い]けば　いい？', 'じゃあ、てつだって　もらうね。'], answer: 1,
    en: 'Woman: Could you help me move house tomorrow? — 1. Thanks for helping me. 2. Sure. What time should I come? 3. Then I\'ll get you to help.',
    explain: 'She asks for his help, so he agrees and asks what time to come. Thanking her for helping, or saying he will get her to help, turns the roles around.',
    uses: ['g:te-kureru', 'g:te-kurete-arigatou', 'g:ba', 'g:te-morau', 'g:ne', 'g:yo', 'v:明日|あした', 'v:引っ越す|ひっこす', 'v:手伝う|てつだう', 'v:くれる|くれる', 'v:いい|いい', 'v:何|なん', 'v:時|じ', 'v:行く|いく', 'v:じゃあ|じゃあ', 'v:もらう|もらう', 'k:明', 'k:日', 'k:何', 'k:時', 'k:行'],
    verified: true }),

  L({ id: 'l:n4-lend-after-reading', format: 'quick', // review
    lines: [
      { speaker: 'M', furigana: 'その　[本|ほん]、[読|よ]みおわったら　かして　くれない？' }],
    optionSpeaker: 'F',
    options: ['いいよ。[明日|あした]　[持|も]って　くるね。', 'ありがとう。[明日|あした]　かえすね。', 'じゃあ、わたしに　かして　くれる？'], answer: 0,
    en: 'Man: When you finish that book, could you lend it to me? — 1. Sure. I\'ll bring it tomorrow. 2. Thanks. I\'ll give it back tomorrow. 3. Then will you lend it to me?',
    explain: 'He asks to borrow her book after she finishes it, so she agrees to bring it. Thanking and promising to return it is the borrower\'s line, and asking him to lend it reverses who owns the book.',
    uses: ['g:stem-compounds', 'g:tara', 'g:te-kureru', 'g:yo', 'g:te-kuru', 'g:ne', 'g:ni', 'v:その|その', 'v:本|ほん', 'v:読む|よむ', 'v:終わる|おわる', 'v:貸す|かす', 'v:くれる|くれる', 'v:いい|いい', 'v:明日|あした', 'v:持つ|もつ', 'v:来る|くる', 'v:返す|かえす', 'v:じゃあ|じゃあ', 'v:私|わたし', 'k:本', 'k:読', 'k:明', 'k:日', 'k:持'],
    verified: true }),

  L({ id: 'l:n4-long-time-no-see', format: 'quick', // review
    lines: [
      { speaker: 'F', furigana: 'おひさしぶりです。おげんきでしたか。' }],
    optionSpeaker: 'M',
    options: ['はじめまして。よろしく　おねがいします。', 'じゃあ、また　[明日|あした]。', 'ほんとうに　ひさしぶりですね。[元気|げんき]でしたよ。'], answer: 2,
    en: 'Woman: It\'s been a long time. Have you been well? — 1. Nice to meet you. 2. See you tomorrow, then. 3. It really has been a long time. I\'ve been well.',
    explain: 'She greets someone she has not seen for a while, and he answers both parts: it has been long, and he has been well. はじめまして is for a first meeting, and またあした is a goodbye.',
    uses: ['g:deshita', 'g:ka', 'g:ne', 'g:yo', 'v:久しぶり|ひさしぶり', 'v:元気|げんき', 'v:ほんとう|ほんとう', 'v:初め|はじめ', 'v:じゃあ|じゃあ', 'v:また|また', 'v:明日|あした', 'k:明', 'k:日', 'k:元', 'k:気'],
    verified: true }),

  // ── dialogue (lesson dialogs): one scene per lesson unit, shown in the lesson ─────
  // Not a test format: no question / options / answer. See docs/dialogue-authoring.md and components/dialogue-section.js.
  L({ id: 'l:n4-dlg-local-train', format: 'dialogue',
    title: 'The slow train', goal: 'You can join two descriptions with 〜くて and 〜で.',
    scene: 'Emilia and Nami are planning a trip to the sea. Nami compares the trains, and the prices.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、うみまで　どの　でんしゃで　[行|い]く？', en: 'Nami, which train shall we take to the sea?' },
      { speaker: 'nami', furigana: 'しんかんせんは　はやくて　べんりだけど、たかいよ。', en: 'The bullet train is fast and convenient, but it’s expensive.' },
      { speaker: 'emilia', furigana: 'ふつうは　どう？', en: 'What about the local train?' },
      { speaker: 'nami', furigana: 'ふつうは　やすくて　いいけど、ふべんで、[五|ご][時間|じかん]　かかる。', en: 'The local is nice and cheap, but it’s inconvenient: it takes five hours.' },
      { speaker: 'emilia', furigana: '[私|わたし]は　ふつうが　いい！　まどの　そとに　うみが　あって、とても　うつくしいよ。', en: 'I’d like the local! The sea is right outside the window, and it’s really beautiful.' },
      { speaker: 'nami', furigana: 'エミリアさん、[五|ご][時間|じかん]だよ？', en: 'Emilia, it’s five hours, you know?' },
      { speaker: 'emilia', furigana: 'おべんとうを　[食|た]べて、[本|ほん]を　[読|よ]んで、ナミさんと　[話|はな]す。かんたん！', en: 'I eat a packed lunch, read a book, talk with you. Easy!' },
      { speaker: 'nami', furigana: '……やすくて、とくべつな　りょこうね。いいよ、ふつうで　[行|い]く。', en: '...A cheap, special trip, then. Fine, we’ll take the local.' }
    ],
    bridge: [
      { text: 'しんかんせん', gloss: 'しんかんせん = the bullet train (Shinkansen)' }
    ],
    remixes: [
      { scene: 'Nami checks the price of a flight as well.', en: 'Planes are fast and expensive.',
        chunks: ['ひこうきは', 'はやくて', 'たかい。', 'はやいで'], answer: ['ひこうきは', 'はやくて', 'たかい。'],
        explain: 'An い-adjective links to what follows with くて: はやい → はやくて. はやいで is not a form.' },
      { scene: 'Emilia tells Nami about the town by the sea.', en: 'The town is quiet and beautiful.',
        chunks: ['まちは', 'しずかで', 'うつくしい。', 'しずかくて'], answer: ['まちは', 'しずかで', 'うつくしい。'],
        explain: 'A な-adjective links with で: しずか → しずかで. くて is only for い-adjectives.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:te-adj-noun', 'g:made', 'g:de', 'g:kedo', 'g:yo', 'g:wo', 'g:ga', 'g:ni', 'g:no', 'g:to', 'g:te-form', 'g:ne', 'g:adj-i', 'g:adj-na', 'g:verb-groups-dict', 'v:さん|さん', 'v:海|うみ', 'v:どの|どの', 'v:電車|でんしゃ', 'v:行く|いく', 'v:速い|はやい', 'v:便利|べんり', 'v:高い|たかい', 'v:普通|ふつう', 'v:どう|どう', 'v:安い|やすい', 'v:いい|いい', 'v:不便|ふべん', 'v:五|ご', 'v:時間|じかん', 'v:かかる|かかる', 'v:私|わたし', 'v:窓|まど', 'v:外|そと', 'v:ある|ある', 'v:とても|とても', 'v:美しい|うつくしい', 'v:お弁当|おべんとう', 'v:食べる|たべる', 'v:本|ほん', 'v:読む|よむ', 'v:話す|はなす', 'v:簡単|かんたん', 'v:特別|とくべつ', 'v:旅行|りょこう', 'k:行', 'k:五', 'k:時', 'k:間', 'k:私', 'k:食', 'k:本', 'k:読', 'k:話'],
    notes: 'Opens the N4 trip thread (Emilia and Nami, a trip to the sea). しんかんせん is not on the N4 list: a bridge only.',
    verified: true }),

  L({ id: 'l:n4-dlg-late-again', format: 'dialogue',
    title: 'Not enough time', goal: 'You can give a negative reason with 〜なくて, and say "not X but Y" with じゃなくて.',
    scene: 'Sakura has been waiting outside the cinema. Sasuke finally arrives, long after the film started.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'サスケさん、おそい！　えいがは　もう　はじまったよ。', en: 'Sasuke, you’re late! The film has already started.' },
      { speaker: 'sasuke', furigana: '……きゅうな　しごとが　あった。', en: '...Something urgent came up at work.' },
      { speaker: 'sakura', furigana: 'しごとは　だいじだけど……でんわが　なくて、こまったよ。', en: 'Work matters, but... you didn’t call, and I didn’t know what to do.' },
      { speaker: 'sasuke', furigana: '……じかんが　[足|た]りなくて、でんわが　できなかった。', en: '...I didn’t have enough time, so I couldn’t call.' },
      { speaker: 'sakura', furigana: 'つぎの　えいがは　[九|く][時|じ]から。どう　する？', en: 'The next showing is at nine. What do you want to do?' },
      { speaker: 'sasuke', furigana: '……[九|く][時|じ]は　むり。きのうから　ちっとも　ねて　いない。', en: '...Nine is too much. I haven’t slept at all since yesterday.' },
      { speaker: 'sakura', furigana: 'そう……ざんねん。じゃあ、ばんごはんは？', en: 'Oh... what a shame. Then how about dinner?' },
      { speaker: 'sasuke', furigana: '……ばんごはんの　じかんは　じゅうぶん　ある。', en: '...There’s plenty of time for dinner.' },
      { speaker: 'sakura', furigana: 'えいがじゃなくて、ばんごはん。……それも　いいね！', en: 'Not a film but dinner. ...That’s nice too!' }
    ],
    remixes: [
      { scene: 'The next week, Sasuke is late again, for another reason.', en: 'The train didn’t come, so I was late.',
        chunks: ['でんしゃが', 'こなくて、', 'おそく', 'なった。', 'こないで、'], answer: ['でんしゃが', 'こなくて、', 'おそく', 'なった。'],
        explain: 'こなくて gives the reason: the train did not come, so... こないで means "without coming" or "instead of coming", and gives no reason.' },
      { scene: 'Sakura changes the place for their next date.', en: 'Next time, not the cinema but the coffee shop.',
        chunks: ['つぎは', 'えいがかんじゃなくて、', 'きっさてん。', 'えいがかんで、'], answer: ['つぎは', 'えいがかんじゃなくて、', 'きっさてん。'],
        explain: 'X じゃなくて Y says "not X but Y". えいがかんで would mean "at the cinema", the opposite of the plan.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:nakute', 'g:mou', 'g:ta-form', 'g:yo', 'g:ga', 'g:kedo', 'g:no', 'g:kara', 'g:te-iru', 'g:te-form', 'g:nai-form', 'g:mo', 'g:ne', 'g:adj-na', 'g:adj-i', 'g:verb-groups-dict', 'v:さん|さん', 'v:遅い|おそい', 'v:映画|えいが', 'v:もう|もう', 'v:始まる|はじまる', 'v:急|きゅう', 'v:仕事|しごと', 'v:ある|ある', 'v:大事|だいじ', 'v:電話|でんわ', 'v:ない|ない', 'v:困る|こまる', 'v:時間|じかん', 'v:足りる|たりる', 'v:できる|できる', 'v:次|つぎ', 'v:九|く', 'v:時|じ', 'v:どう|どう', 'v:する|する', 'v:無理|むり', 'v:昨日|きのう', 'v:ちっとも|ちっとも', 'v:寝る|ねる', 'v:そう|そう', 'v:残念|ざんねん', 'v:じゃあ|じゃあ', 'v:晩御飯|ばんごはん', 'v:十分|じゅうぶん', 'v:それ|それ', 'v:いい|いい', 'k:足', 'k:九', 'k:時'],
    notes: 'Continues the N5 Sasuke and Sakura thread. さん, not くん (N4 rule).',
    verified: true }),

  L({ id: 'l:n4-dlg-lost-wallet', format: 'dialogue',
    title: 'The man in black', goal: 'You can describe a person or thing with a sentence in front of the noun.',
    scene: 'After school, Hinata tells Sakura about a wallet he found in the park.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Classmate' } },
    lines: [
      { speaker: 'hinata', furigana: 'サクラさん！　この[間|あいだ]、こうえんで　さいふを　[見|み]つけた！', en: 'Sakura! The other day I found a wallet in the park!' },
      { speaker: 'sakura', furigana: 'こうばんに　もって　[行|い]った？', en: 'Did you take it to the police box?' },
      { speaker: 'hinata', furigana: '[行|い]った！　きのう、さいふを　なくした　[人|ひと]が　こうばんに　[来|き]たよ。', en: 'I did! Yesterday the person who lost it came to the police box.' },
      { speaker: 'sakura', furigana: 'どんな　[人|ひと]？', en: 'What was he like?' },
      { speaker: 'hinata', furigana: 'くろい　ふくを　[着|き]た、しずかな　だんせい。サクラさんの　かれに　にて　いる！', say: '黒い服を着た、静かな男性。サクラさんの彼に似ている！', en: 'A quiet man in black clothes. He looks like your boyfriend!' },
      { speaker: 'sakura', furigana: 'サスケさんに？　その　さいふ、どんな　さいふ？', en: 'Like Sasuke? What was the wallet like?' },
      { speaker: 'hinata', furigana: 'あおくて　[小|ちい]さい　さいふ。', en: 'A small blue one.' },
      { speaker: 'sakura', furigana: 'それ、[私|わたし]が　あげた　さいふ！', say: 'それ、私があげた財布！', en: 'That’s the wallet I gave him!' },
      { speaker: 'hinata', furigana: 'え！？　じゃあ、あの　だんせいは……。', en: 'What?! Then that man was...' },
      { speaker: 'sakura', furigana: 'サスケさん、[何|なに]も　[言|い]わなかった……。', en: 'Sasuke didn’t say a thing...' }
    ],
    remixes: [
      { scene: 'At the police box, the officer tells Sasuke who handed in his wallet.', en: 'The person who found it is a student.',
        chunks: ['みつけた', 'ひとは', 'がくせいです。', 'みつけて'], answer: ['みつけた', 'ひとは', 'がくせいです。'],
        explain: 'A sentence that describes a noun goes right before it, in plain form: みつけた ひと, "the person who found (it)". みつけて cannot sit before a noun.' },
      { scene: 'Sakura shows Hinata a bag she bought.', en: 'This is the bag I bought yesterday.',
        chunks: ['これは', 'きのう', 'かった', 'かばんです。', 'かいました'], answer: ['これは', 'きのう', 'かった', 'かばんです。'],
        explain: 'Before a noun the verb is in plain form, even in a polite sentence: かった かばん. かいました cannot sit before a noun.' }
    ],
    names: ['ヒナタ', 'サクラ', 'サスケ'],
    uses: ['g:noun-modifier', 'g:de', 'g:wo', 'g:ta-form', 'g:ni', 'g:ga', 'g:yo', 'g:te-iru', 'g:te-form', 'g:no', 'g:adj-na', 'g:te-adj-noun', 'g:mo', 'v:さん|さん', 'v:この間|このあいだ', 'v:公園|こうえん', 'v:財布|さいふ', 'v:見つける|みつける', 'v:交番|こうばん', 'v:持つ|もつ', 'v:行く|いく', 'v:昨日|きのう', 'v:無くす|なくす', 'v:人|ひと', 'v:来る|くる', 'v:どんな|どんな', 'v:黒い|くろい', 'v:服|ふく', 'v:着る|きる', 'v:静か|しずか', 'v:男性|だんせい', 'v:彼|かれ', 'v:似る|にる', 'v:その|その', 'v:青い|あおい', 'v:小さい|ちいさい', 'v:それ|それ', 'v:私|わたし', 'v:上げる|あげる', 'v:じゃあ|じゃあ', 'v:あの|あの', 'v:何|なに', 'v:言う|いう', 'k:間', 'k:見', 'k:行', 'k:人', 'k:来', 'k:着', 'k:小', 'k:私', 'k:何', 'k:言'],
    notes: 'Mentions Sasuke (Sakura’s boyfriend): the couple thread, seen from outside.',
    verified: true }),

  L({ id: 'l:n4-dlg-anya-diary', format: 'dialogue',
    title: 'Dear diary', goal: 'You can say what was going on at a past moment with 〜ていた.',
    scene: 'Evening at home. Anya has to write a diary for school, and Yor asks what she did today.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'アーニャさん、がっこうの　にっきは　[書|か]きましたか？', en: 'Anya, have you written your school diary?' },
      { speaker: 'anya', furigana: 'いま　[書|か]いて　いる。……でも、ねむい。', en: 'I’m writing it now. ...But I’m sleepy.' },
      { speaker: 'yor', furigana: 'きょうは　[何|なに]を　しましたか？', en: 'What did you do today?' },
      { speaker: 'anya', furigana: 'あさ、ねぼうした。ゆめを　[見|み]て　いた。', en: 'I overslept this morning. I was having a dream.' },
      { speaker: 'yor', furigana: 'どんな　ゆめを　[見|み]て　いましたか？', en: 'What were you dreaming about?' },
      { speaker: 'anya', furigana: 'ピーナッツの　ケーキを　[食|た]べて　いた！', en: 'I was eating a peanut cake!' },
      { speaker: 'yor', furigana: 'がっこうでは？', en: 'And at school?' },
      { speaker: 'anya', furigana: 'じゅぎょうの　とき、ねむって　いた。', en: 'During class, I was asleep.' },
      { speaker: 'yor', furigana: '……それは　[書|か]かないで　くださいね。', en: '...Please don’t write that one.' },
      { speaker: 'anya', furigana: 'もう　[書|か]いた。', en: 'Already wrote it.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Anya writes about what her father was doing in the evening.', en: 'Papa was reading the newspaper.',
        chunks: ['ちちは', 'しんぶんを', 'よんで', 'いた。', 'よんだ'], answer: ['ちちは', 'しんぶんを', 'よんで', 'いた。'],
        explain: '〜て いた says what was going on at that moment: よんで いた, "was reading". よんだ only reports that it happened, and cannot take いた.' },
      { scene: 'The next morning, Yor tells Anya about last night.', en: 'At ten o’clock you were asleep.',
        chunks: ['じゅうじに', 'アーニャさんは', 'ねて', 'いました。', 'います。'], answer: ['じゅうじに', 'アーニャさんは', 'ねて', 'いました。'],
        explain: 'A past moment (じゅうじに, last night) takes the past: ねて いました. ねて います is now.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:te-ita', 'g:te-iru', 'g:te-form', 'g:no', 'g:mashita', 'g:ka', 'g:wo', 'g:ta-form', 'g:de', 'g:nai-de-kudasai', 'g:mou', 'g:ne', 'g:adj-i', 'v:さん|さん', 'v:学校|がっこう', 'v:日記|にっき', 'v:書く|かく', 'v:今|いま', 'v:でも|でも', 'v:眠い|ねむい', 'v:今日|きょう', 'v:何|なに', 'v:する|する', 'v:朝|あさ', 'v:寝坊|ねぼう', 'v:夢|ゆめ', 'v:見る|みる', 'v:どんな|どんな', 'v:ケーキ|ケーキ', 'v:食べる|たべる', 'v:授業|じゅぎょう', 'v:時|とき', 'v:眠る|ねむる', 'v:それ|それ', 'v:ください|ください', 'v:もう|もう', 'k:書', 'k:何', 'k:見', 'k:食'],
    notes: 'Continues the N5 thread of Anya’s school. ピーナッツ is not on the list: a bridge only.',
    verified: true }),

  L({ id: 'l:n4-dlg-late-theory', format: 'dialogue',
    title: 'Why is sensei late?', goal: 'You can give your opinion with 〜と思う.',
    scene: 'Class should have started ten minutes ago. Kakashi-sensei is not here. Hinata and Lelouch guess why.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'hinata', furigana: 'カカシ[先生|せんせい]、また　おそいね。どうしてだと　[思|おも]う？', en: 'Kakashi-sensei is late again. Why do you think that is?' },
      { speaker: 'lelouch', furigana: '……ちょうど　りゆうを　[考|かんが]えて　いました。', en: '...I was just thinking about the reason.' },
      { speaker: 'hinata', furigana: 'ねぼうだと　[思|おも]う！', en: 'I think he overslept!' },
      { speaker: 'lelouch', furigana: 'その　いけんには　はんたいです。[先生|せんせい]は　[毎|まい]あさ　[犬|いぬ]と　さんぽして　いますよ。', en: 'I disagree. Sensei walks his dog every morning.' },
      { speaker: 'hinata', furigana: 'じゃあ、げんいんは　[犬|いぬ]？', en: 'So the dog is the cause?' },
      { speaker: 'lelouch', furigana: 'そうだと　[思|おも]います。パックンの　さんぽは　ながいですから。', en: 'I think so. Pakkun’s walks are long.' },
      { speaker: 'hinata', furigana: 'ルルーシュさん、あたまが　いい！', en: 'Lelouch, you’re so smart!' },
      { speaker: 'lelouch', furigana: '……あ、[先生|せんせい]が　[来|き]ました。[犬|いぬ]と　いっしょに。', en: '...Ah, here comes sensei. With his dog.' }
    ],
    remixes: [
      { scene: 'Hinata guesses about tomorrow.', en: 'I think sensei will be late tomorrow too.',
        chunks: ['あしたも', 'せんせいは', 'おそいと', 'おもう。', 'おそいだと'], answer: ['あしたも', 'せんせいは', 'おそいと', 'おもう。'],
        explain: 'An い-adjective goes straight before と おもう: おそいと. だ is only added after a noun or a な-adjective.' },
      { scene: 'Lelouch gives one more view on the dog.', en: 'I think the dog is not the problem.',
        chunks: ['いぬは', 'もんだいじゃ', 'ないと', 'おもいます。', 'ありませんと'], answer: ['いぬは', 'もんだいじゃ', 'ないと', 'おもいます。'],
        explain: 'Before と おもいます the thought is in plain form, even in polite speech: もんだいじゃ ないと. ありません is polite and does not go before と おもう.' }
    ],
    names: ['ヒナタ', 'ルルーシュ', 'カカシ', 'パックン'],
    uses: ['g:to-omou', 'g:ne', 'g:doushite', 'g:te-iru', 'g:te-form', 'g:wa-desu', 'g:ni', 'g:to', 'g:yo', 'g:no', 'g:kara', 'g:ga', 'g:mashita', 'g:adj-i', 'v:先生|せんせい', 'v:また|また', 'v:遅い|おそい', 'v:どうして|どうして', 'v:思う|おもう', 'v:ちょうど|ちょうど', 'v:理由|りゆう', 'v:考える|かんがえる', 'v:寝坊|ねぼう', 'v:その|その', 'v:意見|いけん', 'v:反対|はんたい', 'v:毎朝|まいあさ', 'v:犬|いぬ', 'v:散歩|さんぽ', 'v:じゃあ|じゃあ', 'v:原因|げんいん', 'v:そう|そう', 'v:長い|ながい', 'v:さん|さん', 'v:頭|あたま', 'v:いい|いい', 'v:来る|くる', 'v:一緒|いっしょ', 'k:先', 'k:生', 'k:思', 'k:考', 'k:毎', 'k:犬', 'k:来'],
    notes: 'Series nod: Kakashi is always late; Pakkun (mentioned, on the allowed list) is his dog.',
    verified: true }),

  L({ id: 'l:n4-dlg-yor-curry', format: 'dialogue',
    title: 'A message from Mama', goal: 'You can pass on what someone said with 〜って.',
    scene: 'Killua is playing at the Forgers’. Anya comes back from the kitchen with a message from her mother.',
    cast: { anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'anya', furigana: 'キルアさん！　ははが、きょうの　ばんごはんは　ははが　つくるって。', en: 'Killua! Mama says she’s making dinner tonight.' },
      { speaker: 'killua', furigana: '……うそ。', en: '...No way.' },
      { speaker: 'anya', furigana: 'うそじゃない。キルアさんに　つたえてって。', en: 'It’s not a lie. She said to tell you.' },
      { speaker: 'killua', furigana: '……[何|なに]を　つくるって？', en: '...What did she say she’s making?' },
      { speaker: 'anya', furigana: 'カレーだって。', en: 'Curry, she says.' },
      { speaker: 'killua', furigana: 'なるほど。……きみの　ははの　カレーって、おいしい？', en: 'I see. ...Is your mom’s curry any good?' },
      { speaker: 'anya', furigana: 'もちろん！　……たぶん。', en: 'Of course! ...Probably.' },
      { speaker: 'killua', furigana: 'ははに　へんじを　つたえて。「きょうは　いそがしい」って。', en: 'Give your mom my answer. Tell her "I’m busy today".' },
      { speaker: 'anya', furigana: 'キルアさん、それ、うそ。', en: 'Killua, that’s a lie.' },
      { speaker: 'killua', furigana: '……ちょっとだけ　うそ。', en: '...Only a little one.' }
    ],
    remixes: [
      { scene: 'Anya comes back with a second message from Yor.', en: 'Mama says you can come tomorrow too.',
        chunks: ['あしたも', 'きても', 'いいって。', 'いいて。'], answer: ['あしたも', 'きても', 'いいって。'],
        explain: 'って goes straight after the plain form to pass on what someone said: いいって. いいて is not a form.' },
      { scene: 'Killua passes on what his friend Gon told him.', en: 'Gon says he is coming tomorrow.',
        chunks: ['ゴンは', 'あした', 'くるって。', 'きてって。'], answer: ['ゴンは', 'あした', 'くるって。'],
        explain: 'くるって passes on Gon’s news: he will come. きてって passes on a request ("come", he says): a different message.' }
    ],
    names: ['アーニャ', 'キルア', 'ゴン'],
    uses: ['g:tte', 'g:no', 'g:ga', 'g:ni', 'g:te-form', 'g:wo', 'g:ja-nai', 'g:adj-i', 'g:dake', 'g:verb-groups-dict', 'v:さん|さん', 'v:母|はは', 'v:今日|きょう', 'v:晩御飯|ばんごはん', 'v:作る|つくる', 'v:嘘|うそ', 'v:伝える|つたえる', 'v:何|なに', 'v:カレー|カレー', 'v:なるほど|なるほど', 'v:君|きみ', 'v:おいしい|おいしい', 'v:もちろん|もちろん', 'v:たぶん|たぶん', 'v:返事|へんじ', 'v:忙しい|いそがしい', 'v:それ|それ', 'v:ちょっと|ちょっと', 'v:だけ|だけ', 'k:何'],
    notes: 'Yor’s cooking thread (she cannot cook, canonically), from the children’s side. うん is a unit word but unverified, so it is left out. Gon (mentioned, on the allowed list) is Killua’s friend.',
    verified: true }),

  L({ id: 'l:n4-dlg-library-pick', format: 'dialogue',
    title: 'A book called…', goal: 'You can name something the listener may not know with 〜という.',
    scene: 'In the library, Maomao asks Frieren, who reads everything, for a good book.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Reader' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Reader' } },
    lines: [
      { speaker: 'maomao', furigana: 'フリーレンさん、おもしろい　[本|ほん]を　しょうかいして　ください。', en: 'Frieren, please recommend me an interesting book.' },
      { speaker: 'frieren', furigana: '……「[百|ひゃく][年|ねん]の　まほう」という　しょうせつは　どうですか。', en: '...How about a novel called "A Hundred Years of Magic"?' },
      { speaker: 'maomao', furigana: 'まほうの　しょうせつは　ちょっと……。くすりの　[本|ほん]は　ありませんか。', en: 'Magic novels aren’t really for me... Don’t you have a book about medicine?' },
      { speaker: 'frieren', furigana: '……「どくの　れきし」という　[本|ほん]が　あります。', en: '...There is a book called "A History of Poison".' },
      { speaker: 'maomao', furigana: 'それです！', en: 'That’s the one!' },
      { speaker: 'frieren', furigana: '……むかしの　ぶんがくです。とても　ながいですよ。', en: '...It’s old literature. It’s very long.' },
      { speaker: 'maomao', furigana: 'どのくらいですか？', en: 'How long?' },
      { speaker: 'frieren', furigana: '……じゅっさつです。', en: '...Ten volumes.' },
      { speaker: 'maomao', furigana: '[問題|もんだい]　ありません。ぜんぶ　[読|よ]みます。', en: 'No problem. I’ll read them all.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' },
      { text: 'どく', gloss: 'どく = poison' }
    ],
    remixes: [
      { scene: 'Frieren recommends one more book.', en: 'There is a manga called "The Cat Doctor".',
        chunks: ['「ねこの　いしゃ」', 'という', 'まんがが', 'あります。', 'といって'], answer: ['「ねこの　いしゃ」', 'という', 'まんがが', 'あります。'],
        explain: 'Name + という + noun: "a manga called ...". といって would start a new sentence about what someone said.' },
      { scene: 'Maomao sees a TV show about medicine and asks Frieren its name.', en: 'What is that programme called?',
        chunks: ['それは', 'なんという', 'ばんぐみですか。', 'なんと'], answer: ['それは', 'なんという', 'ばんぐみですか。'],
        explain: 'なんという + noun asks the name of a thing: なんという ばんぐみ. なんと alone cannot sit before a noun.' }
    ],
    names: ['マオマオ', 'フリーレン'],
    uses: ['g:to-iu', 'g:wo', 'g:te-form', 'g:te-kudasai', 'g:no', 'g:wa-desu', 'g:ka', 'g:ga', 'g:yo', 'g:masu', 'g:adj-i', 'v:さん|さん', 'v:面白い|おもしろい', 'v:本|ほん', 'v:紹介|しょうかい', 'v:ください|ください', 'v:百|ひゃく', 'v:年|ねん', 'v:小説|しょうせつ', 'v:どう|どう', 'v:ちょっと|ちょっと', 'v:薬|くすり', 'v:ある|ある', 'v:歴史|れきし', 'v:それ|それ', 'v:昔|むかし', 'v:文学|ぶんがく', 'v:とても|とても', 'v:長い|ながい', 'v:どの|どの', 'v:くらい|くらい', 'v:冊|さつ', 'v:問題|もんだい', 'v:全部|ぜんぶ', 'v:読む|よむ', 'k:本', 'k:百', 'k:年', 'k:問', 'k:題', 'k:読'],
    notes: 'Series nods: Frieren reads everything (and collects magic); Maomao only wants medicine and poison. まほう and どく are not on the list: bridges only.',
    verified: true }),

  L({ id: 'l:n4-dlg-fishing-hobby', format: 'dialogue',
    title: 'My hobby is fishing', goal: 'You can talk about hobbies by turning a verb into a noun with こと.',
    scene: 'Sanji and Maomao meet at the morning market and get talking about what they do on days off.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' } },
    lines: [
      { speaker: 'sanji', furigana: 'マオマオさんの　しゅみは　[何|なん]ですか？', en: 'What’s your hobby, Maomao?' },
      { speaker: 'maomao', furigana: 'くすりを　つくることです。', en: 'Making medicine.' },
      { speaker: 'sanji', furigana: 'それは　しごとと　おなじですね。', en: 'But that’s the same as your job.' },
      { speaker: 'maomao', furigana: 'しごとも　しゅみも　くすりです。サンジさんは？', en: 'My job and my hobby are both medicine. And you, Sanji?' },
      { speaker: 'sanji', furigana: 'わたしの　しゅみは　うみで　さかなを　つることです。', en: 'My hobby is fishing in the sea.' },
      { speaker: 'maomao', furigana: 'すいえいも　しますか？', en: 'Do you swim too?' },
      { speaker: 'sanji', furigana: 'ええ、うみで　およぐことも　たのしんで　います。', en: 'Yes, I enjoy swimming in the sea too.' },
      { speaker: 'maomao', furigana: 'わたしは　およぐことは　きらいです。', en: 'I don’t like swimming.' },
      { speaker: 'sanji', furigana: 'では、こんどの　やすみに　いっしょに　さかなを　つりませんか？', en: 'Then why don’t we go fishing together on our next day off?' },
      { speaker: 'maomao', furigana: '……どくの　ある　さかなは　いますか？', en: '...Are there any poisonous fish?' }
    ],
    bridge: [
      { text: 'どく', gloss: 'どく = poison' },
      { text: 'こんど', gloss: 'こんど = next (time); こんどの やすみ = the next day off', id: 'v:今度|こんど' }
    ],
    remixes: [
      { scene: 'Maomao asks about Sanji’s other hobby.', en: 'My hobby is dancing.',
        chunks: ['わたしの', 'しゅみは', 'おどる', 'ことです。', 'おどります'], answer: ['わたしの', 'しゅみは', 'おどる', 'ことです。'],
        explain: 'こと follows the plain dictionary form: おどる こと, "dancing". おどります is polite and cannot go before こと.' },
      { scene: 'Sanji tells Maomao about a day off on the boat.', en: 'Catching fish in the sea is fun.',
        chunks: ['うみで', 'さかなを', 'つる', 'ことは', 'たのしいです。', 'つって'], answer: ['うみで', 'さかなを', 'つる', 'ことは', 'たのしいです。'],
        explain: 'つる こと turns "catch fish" into a noun, so it can be the topic of たのしい. つって is the て-form and cannot take こと.' }
    ],
    names: ['サンジ', 'マオマオ'],
    uses: ['g:koto', 'g:no', 'g:wa-desu', 'g:ka', 'g:wo', 'g:to', 'g:ne', 'g:mo', 'g:de', 'g:te-iru', 'g:te-form', 'g:ni', 'g:masen-ka', 'g:verb-groups-dict', 'v:さん|さん', 'v:趣味|しゅみ', 'v:何|なん', 'v:薬|くすり', 'v:作る|つくる', 'v:それ|それ', 'v:仕事|しごと', 'v:同じ|おなじ', 'v:私|わたし', 'v:海|うみ', 'v:魚|さかな', 'v:釣る|つる', 'v:水泳|すいえい', 'v:する|する', 'v:泳ぐ|およぐ', 'v:楽しむ|たのしむ', 'v:嫌い|きらい', 'v:では|では', 'v:今度|こんど', 'v:休み|やすみ', 'v:一緒|いっしょ', 'v:ある|ある', 'v:居る|いる', 'k:何'],
    notes: 'Series nods: Sanji fishes and cooks; Maomao lives for medicine and poison. ええ is unverified on the N5 list, so it stays out of uses (a set reply, as N5 does with いいえ). どく and こんど (taught in n4.u031) are bridges.',
    verified: true }),

  L({ id: 'l:n4-dlg-polite-phrase', format: 'dialogue',
    title: 'What that means', goal: 'You can explain what something means with 〜ということ.',
    scene: 'Emilia comes to the staff room to ask Kakashi-sensei about something a shop assistant said to her.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'emilia', furigana: 'カカシ[先生|せんせい]、ちょっと　そうだんが　あります。', en: 'Kakashi-sensei, could I ask your advice about something?' },
      { speaker: 'kakashi', furigana: 'どうぞ。どう　しましたか。', en: 'Go ahead. What’s up?' },
      { speaker: 'emilia', furigana: 'きのう、[店|みせ]の　[人|ひと]と　かいわを　しました。でも、ことばが　ひとつ　わかりませんでした。', en: 'Yesterday I had a conversation with a shop assistant. But there was one word I didn’t understand.' },
      { speaker: 'kakashi', furigana: '[何|なん]と　[言|い]いましたか。', en: 'What did she say?' },
      { speaker: 'emilia', furigana: '「しょうちしました」です。', en: '"Shouchi shimashita."' },
      { speaker: 'kakashi', furigana: 'それは「わかりました」ということです。[店|みせ]の　[人|ひと]が　よく　つかいます。', en: 'That means "understood". Shop staff use it a lot.' },
      { speaker: 'emilia', furigana: 'じゃあ、たとえば　[先生|せんせい]にも　つかって　いいですか？', en: 'So, for example, can I use it with you too?' },
      { speaker: 'kakashi', furigana: 'ええ。では……「あしたは　テストです」。', en: 'Sure. All right then... "There’s a test tomorrow."' },
      { speaker: 'emilia', furigana: '……しょうちしました……。', en: '...Understood...' },
      { speaker: 'kakashi', furigana: 'その　かおは、テストが　いやだということですね。', en: 'That face means you don’t want the test, doesn’t it?' }
    ],
    remixes: [
      { scene: 'The next day, Emilia asks about a sign on the shop door.', en: 'It means the shop is closed today.',
        chunks: ['きょうは', 'みせが', 'やすみだ', 'ということです。', 'やすみな'], answer: ['きょうは', 'みせが', 'やすみだ', 'ということです。'],
        explain: 'A noun takes だ before ということ: やすみだ ということ. な goes before a noun, not before という.' },
      { scene: 'Kakashi explains a note from another teacher.', en: 'It means there is no homework.',
        chunks: ['しゅくだいが', 'ない', 'ということです。', 'ありません'], answer: ['しゅくだいが', 'ない', 'ということです。'],
        explain: 'ということ takes the plain form: ない ということ. The polite ありません does not go before という.' }
    ],
    names: ['カカシ', 'エミリア'],
    uses: ['g:to-iu-koto', 'g:ga-arimasu', 'g:wa-desu', 'g:ka', 'g:mashita', 'g:no', 'g:to', 'g:wo', 'g:ni', 'g:mo', 'g:ne', 'g:ga', 'v:先生|せんせい', 'v:ちょっと|ちょっと', 'v:相談|そうだん', 'v:ある|ある', 'v:どうぞ|どうぞ', 'v:どう|どう', 'v:する|する', 'v:昨日|きのう', 'v:店|みせ', 'v:人|ひと', 'v:会話|かいわ', 'v:でも|でも', 'v:言葉|ことば', 'v:一つ|ひとつ', 'v:分かる|わかる', 'v:何|なん', 'v:言う|いう', 'v:承知|しょうち', 'v:それ|それ', 'v:よく|よく', 'v:使う|つかう', 'v:じゃあ|じゃあ', 'v:例えば|たとえば', 'v:いい|いい', 'v:では|では', 'v:明日|あした', 'v:テスト|テスト', 'v:その|その', 'v:顔|かお', 'v:嫌|いや', 'k:先', 'k:生', 'k:店', 'k:人', 'k:何', 'k:言'],
    notes: 'ええ is unverified on the N5 list, so it stays out of uses (a set reply).',
    verified: true }),

  L({ id: 'l:n4-dlg-boarding-house', format: 'dialogue',
    title: 'Choosing a room', goal: 'You can pile up reasons with 〜し.',
    scene: 'Hinata wants to move closer to his school. Nami works at the estate agent’s and shows him a boarding house.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Estate agent' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'nami', furigana: 'この　げしゅくは　どうですか？　がっこうに　ちかいし、やすいですよ。', en: 'How about this boarding house? It’s close to your school, and it’s cheap.' },
      { speaker: 'hinata', furigana: '[二|に]かいだてですね！　おくじょうも　ありますか？', en: 'It’s two storeys! Is there a rooftop too?' },
      { speaker: 'nami', furigana: 'ありますよ。おくじょうで　バレーボールの　れんしゅうも　できます。', en: 'There is. You can even practise volleyball up there.' },
      { speaker: 'hinata', furigana: 'いいですね！　きんじょに　[店|みせ]は　ありますか？', en: 'Great! Are there shops nearby?' },
      { speaker: 'nami', furigana: '[肉|にく]やも　あるし、パンやも　あるし、べんりな　ばしょです。', en: 'There’s a butcher, there’s a bakery: it’s a handy spot.' },
      { speaker: 'hinata', furigana: '[一|ひと]つき　いくらですか？', en: 'How much is it a month?' },
      { speaker: 'nami', furigana: '[三|さん]まん[円|えん]です。ちゅうしゃじょうは　[五|ご]せん[円|えん]です。', en: 'Thirty thousand yen. The car park is five thousand.' },
      { speaker: 'hinata', furigana: 'ちゅうしゃじょうは　いりません。じてんしゃですから。', en: 'I don’t need the car park. I ride a bike.' },
      { speaker: 'nami', furigana: 'じてんしゃも　[五|ご]せん[円|えん]です。', en: 'The bike is five thousand too.' },
      { speaker: 'hinata', furigana: '……こうがいの　げしゅくも　[見|み]せて　ください！', en: '...Please show me some boarding houses in the suburbs too!' }
    ],
    bridge: [
      { text: 'バレーボール', gloss: 'バレーボール = volleyball' }
    ],
    remixes: [
      { scene: 'Nami shows Hinata a second room.', en: 'This room is big, and it’s quiet too.',
        chunks: ['このへやは', 'ひろいし、', 'しずかです。', 'ひろくし、'], answer: ['このへやは', 'ひろいし、', 'しずかです。'],
        explain: 'し follows the plain form: ひろいし. ひろくし is not a form.' },
      { scene: 'Hinata tells Nami why he never needs a car park.', en: 'I don’t have a car, and I like walking.',
        chunks: ['くるまも', 'ないし、', 'あるくのが', 'すきです。', 'なくし、'], answer: ['くるまも', 'ないし、', 'あるくのが', 'すきです。'],
        explain: 'ない + し: ないし, "I don’t have one, and...". なくし is not a form.' }
    ],
    names: ['ナミ', 'ヒナタ'],
    uses: ['g:shi', 'g:wa-desu', 'g:ka', 'g:ni', 'g:yo', 'g:ne', 'g:mo', 'g:de', 'g:no', 'g:adj-na', 'g:kara', 'g:te-kudasai', 'g:te-form', 'g:adj-i', 'v:この|この', 'v:下宿|げしゅく', 'v:どう|どう', 'v:学校|がっこう', 'v:近い|ちかい', 'v:安い|やすい', 'v:二階建て|にかいだて', 'v:屋上|おくじょう', 'v:ある|ある', 'v:練習|れんしゅう', 'v:できる|できる', 'v:いい|いい', 'v:近所|きんじょ', 'v:店|みせ', 'v:肉|にく', 'v:屋|や', 'v:パン|パン', 'v:便利|べんり', 'v:場所|ばしょ', 'v:一月|ひとつき', 'v:いくら|いくら', 'v:三|さん', 'v:万|まん', 'v:円|えん', 'v:駐車場|ちゅうしゃじょう', 'v:五|ご', 'v:千|せん', 'v:要る|いる', 'v:自転車|じてんしゃ', 'v:郊外|こうがい', 'v:見せる|みせる', 'v:ください|ください', 'k:二', 'k:店', 'k:肉', 'k:一', 'k:三', 'k:円', 'k:五', 'k:見'],
    notes: 'Opens the N4 moving thread: Hinata moves into a boarding house near school (Nami is the agent, money-minded). バレーボール is not on the list: a bridge only.',
    verified: true }),

  L({ id: 'l:n4-dlg-heavy-suitcase', format: 'dialogue',
    title: 'Packing for the sea', goal: 'You can give a few examples with 〜など and 〜とか〜とか.',
    scene: 'The night before the trip, Nami drops by and finds Emilia’s suitcase far too full.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'nami', furigana: 'エミリアさん、その　スーツケース、[大|おお]きいね。[何|なに]が　[入|はい]って　いる？', en: 'Emilia, that suitcase is big. What’s in it?' },
      { speaker: 'emilia', furigana: 'したぎや　サンダルや　ぼうしなど。', en: 'Underwear, sandals, a hat and so on.' },
      { speaker: 'nami', furigana: 'てぶくろも　ある！　うみは　[日|ひ]が　[強|つよ]くて、あついよ。', en: 'There are gloves too! At the sea the sun is strong, and it’s hot.' },
      { speaker: 'emilia', furigana: 'よるは　さむいと　[思|おも]って……。', en: 'I thought the nights might be cold...' },
      { speaker: 'nami', furigana: 'この　かばんは？', en: 'And this bag?' },
      { speaker: 'emilia', furigana: 'しょくりょうひん。パンとか、おかしとか、おちゃとか。', en: 'Groceries. Bread, sweets, tea, that kind of thing.' },
      { speaker: 'nami', furigana: 'むこうにも　スーパーは　あるよ。', en: 'There are supermarkets over there too, you know.' },
      { speaker: 'emilia', furigana: 'そう？　じゃあ、パンなどは　おいて　[行|い]く。', en: 'Really? Then I’ll leave the bread and things here.' },
      { speaker: 'nami', furigana: 'それより、おみやげの　ばしょは？', en: 'More to the point, where’s the room for souvenirs?' },
      { speaker: 'emilia', furigana: '……あ。ばしょが　ない。', en: '...Oh. There’s no room.' }
    ],
    remixes: [
      { scene: 'Nami says what she packed herself.', en: 'I packed a map, an umbrella and so on.',
        chunks: ['わたしは', 'ちずや', 'かさなどを', 'いれた。', 'かさなどに'], answer: ['わたしは', 'ちずや', 'かさなどを', 'いれた。'],
        explain: 'など closes the list, and the particle comes after it: かさなどを いれた. かさなどに would mean "into an umbrella and so on".' },
      { scene: 'Emilia plans her shopping at the sea.', en: 'For souvenirs, I want to buy things like tea and fish.',
        chunks: ['おみやげは', 'おちゃとか', 'さかなとか', 'かいたい。', 'さかなや'], answer: ['おみやげは', 'おちゃとか', 'さかなとか', 'かいたい。'],
        explain: 'とか comes after each example: おちゃとか さかなとか. Starting with とか and switching to や in the same list sounds wrong.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:nado', 'g:toka-toka', 'g:ya', 'g:no', 'g:ga', 'g:te-iru', 'g:te-form', 'g:mo', 'g:ni', 'g:te-adj-noun', 'g:yo', 'g:to-omou', 'g:adj-i', 'v:さん|さん', 'v:その|その', 'v:スーツケース|スーツケース', 'v:大きい|おおきい', 'v:何|なに', 'v:入る|はいる', 'v:下着|したぎ', 'v:サンダル|サンダル', 'v:帽子|ぼうし', 'v:手袋|てぶくろ', 'v:ある|ある', 'v:海|うみ', 'v:日|ひ', 'v:強い|つよい', 'v:暑い|あつい', 'v:夜|よる', 'v:寒い|さむい', 'v:思う|おもう', 'v:この|この', 'v:かばん|かばん', 'v:食料品|しょくりょうひん', 'v:パン|パン', 'v:お菓子|おかし', 'v:お茶|おちゃ', 'v:向こう|むこう', 'v:スーパー|スーパー', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:置く|おく', 'v:行く|いく', 'v:それ|それ', 'v:より|より', 'v:お土産|おみやげ', 'v:場所|ばしょ', 'v:ない|ない', 'k:大', 'k:何', 'k:入', 'k:日', 'k:強', 'k:思', 'k:行'],
    notes: 'Trip thread (opened in n4.u001): Emilia packs for the trip to the sea.',
    verified: true }),

  L({ id: 'l:n4-dlg-museum-copy', format: 'dialogue',
    title: 'Just by looking', goal: 'You can say "just by doing" or "with only" with 〜だけで.',
    scene: 'A class trip to the art museum. Hinata stops in front of a mountain painting, and Gojo-sensei catches up with him.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'ヒナタさん、きょうの　てんらんかいは　どうですか。', en: 'Hinata, how do you like today’s exhibition?' },
      { speaker: 'hinata', furigana: 'とても　いいです！　この　[山|やま]の　えは　[見|み]るだけで　げんきに　なります！', en: 'It’s great! Just looking at this mountain painting gives me energy!' },
      { speaker: 'gojo', furigana: 'いい　けしきでしょう。でも、えに　さわらないで　くださいね。', en: 'Lovely scenery, isn’t it? But please don’t touch the paintings.' },
      { speaker: 'hinata', furigana: 'じゃあ、この　えを　[紙|かみ]に　うつしても　いいですか？', en: 'Then may I copy this painting onto paper?' },
      { speaker: 'gojo', furigana: 'いいですよ。えんぴつだけで　かいて　くださいね。', say: 'いいですよ。鉛筆だけで描いてくださいね。', en: 'Sure. Use only a pencil, please.' },
      { speaker: 'hinata', furigana: 'はい！　……[先生|せんせい]は　かかないんですか？', say: 'はい！……先生は描かないんですか？', en: 'Okay! ...Aren’t you drawing, sensei?' },
      { speaker: 'gojo', furigana: 'わたしは　[見|み]るだけで　いいです。めで　うつしますから。', en: 'Looking is enough for me. I copy it with my eyes.' },
      { speaker: 'hinata', furigana: 'めで？　……[先生|せんせい]、めかくしを　して　いますよね？', en: 'With your eyes? ...Sensei, you’re wearing a blindfold, aren’t you?' },
      { speaker: 'gojo', furigana: 'つぎは　おてらの　えです。[行|い]きましょう。', en: 'Next is the temple painting. Let’s go.' }
    ],
    bridge: [
      { text: 'めかくし', gloss: 'めかくし = a blindfold' }
    ],
    remixes: [
      { scene: 'On the bus home, Hinata talks about his favourite songs.', en: 'Just listening to music cheers me up.',
        chunks: ['おんがくを', 'きくだけで', 'げんきに', 'なります。', 'きくだけに'], answer: ['おんがくを', 'きくだけで', 'げんきに', 'なります。'],
        explain: 'だけで says this one small thing is enough for the result: きくだけで, "just by listening". だけに does not give that meaning here.' },
      { scene: 'Gojo shows the class a ticket for the zoo next door.', en: 'With just this ticket, you can go into the zoo too.',
        chunks: ['この', 'きっぷだけで', 'どうぶつえんにも', 'はいって', 'いいです。', 'きっぷだけを'], answer: ['この', 'きっぷだけで', 'どうぶつえんにも', 'はいって', 'いいです。'],
        explain: 'Noun + だけで: "with only this ticket". きっぷだけを would make the ticket the thing you do something to.' }
    ],
    names: ['ゴジョウ', 'ヒナタ'],
    uses: ['g:dake-de', 'g:dake', 'g:te-kudasai', 'g:nai-de-kudasai', 'g:te-mo-ii', 'g:n-desu', 'g:kara', 'g:mashou', 'g:deshou', 'g:naru', 'g:no', 'g:wo', 'g:ni', 'g:de', 'g:ka', 'g:te-iru', 'g:te-form', 'g:yo', 'g:ne', 'v:さん|さん', 'v:今日|きょう', 'v:展覧会|てんらんかい', 'v:どう|どう', 'v:とても|とても', 'v:いい|いい', 'v:この|この', 'v:山|やま', 'v:絵|え', 'v:見る|みる', 'v:元気|げんき', 'v:なる|なる', 'v:景色|けしき', 'v:でも|でも', 'v:触る|さわる', 'v:じゃあ|じゃあ', 'v:紙|かみ', 'v:写す|うつす', 'v:鉛筆|えんぴつ', 'v:書く|かく', 'v:先生|せんせい', 'v:私|わたし', 'v:目|め', 'v:する|する', 'v:次|つぎ', 'v:寺|てら', 'v:行く|いく', 'k:山', 'k:見', 'k:紙', 'k:先', 'k:生', 'k:行'],
    notes: 'Series nod: Gojo’s blindfold. めかくし is not on the N4 list: a bridge only. かく here is 描く (draw); the catalog word is 書く, same reading.',
    verified: true }),

  L({ id: 'l:n4-dlg-kitchen-job', format: 'dialogue',
    title: 'The interview', goal: 'You can add a point with それに, and go on anyway with それでも.',
    scene: 'Sasuke wants a part-time job at Sanji’s restaurant. Sanji interviews him before opening time.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Applicant' } },
    lines: [
      { speaker: 'sanji', furigana: 'サスケさん、この　レストランで　はたらきたいんですね。', en: 'Sasuke, so you want to work at this restaurant.' },
      { speaker: 'sasuke', furigana: '……はい。いえから　ちかいです。それに、[料理|りょうり]が　すきです。', en: '...Yes. It’s close to home. Besides, I like cooking.' },
      { speaker: 'sanji', furigana: 'しごとは　なかなか　たいへんですよ。あさは　はやいし、よるは　おそいです。', en: 'The work is pretty hard, you know. Mornings are early and nights are late.' },
      { speaker: 'sasuke', furigana: '……だいじょうぶです。', en: '...That’s fine.' },
      { speaker: 'sanji', furigana: 'お[金|かね]も　すくないですよ。それでも　いいですか。', en: 'And the pay is low. Is that still all right?' },
      { speaker: 'sasuke', furigana: '……はい。それでも　やります。', en: '...Yes. I’ll do it anyway.' },
      { speaker: 'sanji', furigana: 'やはり、[料理|りょうり]が　すきだからですか。', en: 'Because you love cooking, after all?' },
      { speaker: 'sasuke', furigana: '……ここの　トマトの　[料理|りょうり]が　いちばん　おいしいです。', en: '...The tomato dishes here are the best.' },
      { speaker: 'sanji', furigana: 'だから　うちに　[来|き]たんですね！　では、あしたから　おねがいします。', en: 'So that’s why you came to us! Then we’ll see you from tomorrow.' },
      { speaker: 'sasuke', furigana: '……まかないに　トマトは　ありますか。', en: '...Is there tomato in the staff meals?' }
    ],
    bridge: [
      { text: 'トマト', gloss: 'トマト = tomato' },
      { text: 'まかない', gloss: 'まかない = a staff meal (cooked for the people who work there)' }
    ],
    remixes: [
      { scene: 'That evening, Sasuke tells Sakura about the job.', en: 'The restaurant is close to home. Besides, the staff meals are good.',
        chunks: ['みせは', 'いえから', 'ちかい。', 'それに、', 'まかないも', 'おいしい。', 'それでも、'], answer: ['みせは', 'いえから', 'ちかい。', 'それに、', 'まかないも', 'おいしい。'],
        explain: 'それに adds one more good point in the same direction. それでも would set the second sentence against the first.' },
      { scene: 'After his first day, Sasuke sums it up.', en: 'Today was busy. Even so, it was fun.',
        chunks: ['きょうは', 'いそがしかった。', 'それでも、', 'たのしかった。', 'それに、'], answer: ['きょうは', 'いそがしかった。', 'それでも、', 'たのしかった。'],
        explain: 'それでも: the second fact holds in spite of the first (busy, but fun). それに would only add another point in the same direction.' }
    ],
    names: ['サンジ', 'サスケ'],
    uses: ['g:sore-ni', 'g:sore-demo', 'g:tai', 'g:n-desu', 'g:de', 'g:kara', 'g:ga', 'g:shi', 'g:yo', 'g:mo', 'g:ka', 'g:ni', 'g:no', 'g:ne', 'v:さん|さん', 'v:この|この', 'v:レストラン|レストラン', 'v:働く|はたらく', 'v:家|いえ', 'v:近い|ちかい', 'v:それに|それに', 'v:料理|りょうり', 'v:好き|すき', 'v:仕事|しごと', 'v:中々|なかなか', 'v:たいへん|たいへん', 'v:朝|あさ', 'v:早い|はやい', 'v:夜|よる', 'v:遅い|おそい', 'v:大丈夫|だいじょうぶ', 'v:お金|おかね', 'v:少ない|すくない', 'v:いい|いい', 'v:やる|やる', 'v:やはり|やはり', 'v:ここ|ここ', 'v:いちばん|いちばん', 'v:おいしい|おいしい', 'v:だから|だから', 'v:来る|くる', 'v:では|では', 'v:明日|あした', 'v:ある|ある', 'k:料', 'k:理', 'k:金', 'k:来'],
    notes: 'Opens the N4 part-time job thread: Sasuke works in Sanji’s restaurant kitchen. Series nod: Sasuke and tomatoes. トマト and まかない are not on the list: bridges.',
    verified: true }),

  L({ id: 'l:n4-dlg-class-party', format: 'dialogue',
    title: 'Anyone can come', goal: 'You can say "any ~ at all" with a question word + でも, and offer something softly with N + でも.',
    scene: 'Sakura is inviting the teachers to the class party. Frieren-sensei is not keen on noisy places.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Class rep' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'sakura', furigana: 'フリーレン[先生|せんせい]、らいしゅうの　クラスの　かいに　ぜひ　[来|き]て　ください。', en: 'Frieren-sensei, please do come to the class party next week.' },
      { speaker: 'frieren', furigana: '……しょうたいですか。だれが　しゅっせきしますか。', en: '...An invitation? Who will be there?' },
      { speaker: 'sakura', furigana: 'クラスの　みんなです。ほかの　[先生|せんせい]も　だれでも　[来|き]て　いいです。', en: 'The whole class. Any of the other teachers can come too.' },
      { speaker: 'frieren', furigana: '……わたしは、にぎやかな　ところは　ちょっと……。', en: '...Lively places aren’t really my thing...' },
      { speaker: 'sakura', furigana: 'えんりょしないで　ください。のみものも　[食|た]べものも、[何|なん]でも　じゆうに　どうぞ。', en: 'Please don’t hold back. Drinks, food, anything at all: help yourself.' },
      { speaker: 'frieren', furigana: '……[何|なん]でも？　では、[本|ほん]を　[読|よ]んで　いいですか。', en: '...Anything? Then may I read a book?' },
      { speaker: 'sakura', furigana: '[本|ほん]ですか？　……はい、いつでも　どうぞ。', en: 'A book? ...Sure, any time you like.' },
      { speaker: 'frieren', furigana: '……では、しゅっせきします。まほうの　[本|ほん]を　もって　[行|い]きます。', en: '...Then I’ll attend. I’ll bring a book of spells.' },
      { speaker: 'sakura', furigana: '[先生|せんせい]、かいでは　みなと　[話|はな]して　くださいね。', en: 'Sensei, at the party, please talk with everyone.' },
      { speaker: 'frieren', furigana: '……[本|ほん]の　あとで。', en: '...After my book.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Sakura tells Hinata about the party.', en: 'You can invite any of your friends.',
        chunks: ['ともだちは', 'だれでも', 'よんで', 'いいよ。', 'だれも'], answer: ['ともだちは', 'だれでも', 'よんで', 'いいよ。'],
        explain: 'だれでも = anyone at all. だれも goes with a negative and means "nobody".' },
      { scene: 'After the party, Sakura asks Frieren out.', en: 'After the party, how about some tea or something?',
        chunks: ['かいの', 'あとで、', 'おちゃでも', 'のみませんか。', 'おちゃでは'], answer: ['かいの', 'あとで、', 'おちゃでも', 'のみませんか。'],
        explain: 'Noun + でも offers it softly as one idea: おちゃでも, "tea or something". おちゃでは does not work as an invitation.' }
    ],
    names: ['サクラ', 'フリーレン'],
    uses: ['g:demo', 'g:te-kudasai', 'g:nai-de-kudasai', 'g:te-form', 'g:no', 'g:ni', 'g:ga', 'g:ka', 'g:mo', 'g:wa-desu', 'g:de', 'g:to', 'g:wo', 'g:ne', 'v:先生|せんせい', 'v:来週|らいしゅう', 'v:クラス|クラス', 'v:会|かい', 'v:是非|ぜひ', 'v:来る|くる', 'v:ください|ください', 'v:招待|しょうたい', 'v:誰|だれ', 'v:出席|しゅっせき', 'v:する|する', 'v:みんな|みんな', 'v:ほか|ほか', 'v:いい|いい', 'v:私|わたし', 'v:賑やか|にぎやか', 'v:所|ところ', 'v:ちょっと|ちょっと', 'v:遠慮|えんりょ', 'v:飲み物|のみもの', 'v:食べ物|たべもの', 'v:何|なん', 'v:自由|じゆう', 'v:どうぞ|どうぞ', 'v:では|では', 'v:本|ほん', 'v:読む|よむ', 'v:いつ|いつ', 'v:持つ|もつ', 'v:行く|いく', 'v:皆|みな', 'v:話す|はなす', 'v:後|あと', 'k:先', 'k:生', 'k:来', 'k:食', 'k:何', 'k:本', 'k:読', 'k:行', 'k:話'],
    notes: 'Series nod: Frieren reads anywhere and collects spells. まほう is a bridge. 本を読んでいいですか (て いい, without も) is the spoken short form of てもいい; it also keeps the でも of 読んでも from being marked as this lesson’s でも.',
    verified: true }),

  L({ id: 'l:n4-dlg-birthday-advice', format: 'dialogue',
    title: 'What does she want?', goal: 'You can say what you want with 〜がほしい.',
    scene: 'Sakura’s birthday is next week. Sasuke, who never asks anyone for advice, asks Nami.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'sasuke', furigana: '……ナミさん、そうだんが　ある。', en: '...Nami, I need some advice.' },
      { speaker: 'nami', furigana: 'めずらしいね。なに？', en: 'That’s a first. What is it?' },
      { speaker: 'sasuke', furigana: '……らいしゅう、サクラさんの　たんじょうびの　おいわいを　する。プレゼントは　[何|なに]が　いいと　[思|おも]う？', en: '...Next week we’re celebrating Sakura’s birthday. What do you think would make a good present?' },
      { speaker: 'nami', furigana: 'サクラさんは　[何|なに]が　ほしいって　[言|い]って　いた？', en: 'What did Sakura say she wants?' },
      { speaker: 'sasuke', furigana: '……[新|あたら]しい　ハンドバッグが　ほしいと　[言|い]って　いた。', en: '...She said she wants a new handbag.' },
      { speaker: 'nami', furigana: 'いいね。アクセサリーも　いいよ。ゆびわとか。', en: 'Nice. Accessories are good too. A ring, say.' },
      { speaker: 'sasuke', furigana: '……ゆびわは　まだ　はやい。', en: '...A ring is too soon.' },
      { speaker: 'nami', furigana: 'そう。じゃあ、ハンドバッグね。……わたしも　[新|あたら]しい　ハンドバッグが　ほしいな。', en: 'Okay. The handbag, then. ...I’d like a new handbag too.' },
      { speaker: 'sasuke', furigana: '……ナミさんの　たんじょうびは　まだだ。', en: '...Your birthday isn’t for a while.' }
    ],
    remixes: [
      { scene: 'Nami says what she would like for herself.', en: 'I want a new ring.',
        chunks: ['わたしは', 'あたらしい', 'ゆびわが', 'ほしい。', 'ゆびわを'], answer: ['わたしは', 'あたらしい', 'ゆびわが', 'ほしい。'],
        explain: 'The thing you want takes が: ゆびわが ほしい. ほしい is an adjective, so を does not go with it.' },
      { scene: 'Sasuke remembers his birthdays as a small boy.', en: 'When I was a child, I wanted toys.',
        chunks: ['こどもの', 'とき、', 'おもちゃが', 'ほしかった。', 'ほしいかった。'], answer: ['こどもの', 'とき、', 'おもちゃが', 'ほしかった。'],
        explain: 'ほしい changes like an い-adjective: ほしい → ほしかった. ほしいかった is not a form.' }
    ],
    names: ['ナミ', 'サスケ', 'サクラ'],
    uses: ['g:ga-hoshii', 'g:tte', 'g:to-omou', 'g:te-ita', 'g:no', 'g:ga', 'g:wo', 'g:ne', 'g:yo', 'g:mo', 'v:さん|さん', 'v:相談|そうだん', 'v:ある|ある', 'v:珍しい|めずらしい', 'v:何|なに', 'v:来週|らいしゅう', 'v:誕生日|たんじょうび', 'v:お祝い|おいわい', 'v:する|する', 'v:プレゼント|プレゼント', 'v:いい|いい', 'v:思う|おもう', 'v:言う|いう', 'v:新しい|あたらしい', 'v:ハンドバッグ|ハンドバッグ', 'v:アクセサリー|アクセサリー', 'v:指輪|ゆびわ', 'v:まだ|まだ', 'v:早い|はやい', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:私|わたし', 'k:何', 'k:思', 'k:言', 'k:新'],
    notes: 'Sasuke and Sakura thread, from Sasuke’s side; Nami’s nod: she wants one too. ほしいと言っていた reports Sakura’s own words, so ほしい (not ほしがる) is right here.',
    verified: true }),

  L({ id: 'l:n4-dlg-zoo-promise', format: 'dialogue',
    title: 'Nine o’clock sharp', goal: 'You can say what you want someone else to do with 〜てほしい.',
    scene: 'In the staff room, Gojo reminds Kakashi about tomorrow’s class trip to the zoo.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'gojo', furigana: 'カカシさん、あした　[九|く][時|じ]の　やくそく、おぼえて　いますか？', en: 'Kakashi, you remember our nine o’clock arrangement tomorrow?' },
      { speaker: 'kakashi', furigana: 'ええ。せいとと　どうぶつえんに　[行|い]く　やくそくですね。', en: 'Yes. We’re taking the students to the zoo.' },
      { speaker: 'gojo', furigana: 'あしたは　おくれないで　ほしいんです。せいとが　しんぱいしますから。', en: 'I’d like you not to be late tomorrow. The students will worry.' },
      { speaker: 'kakashi', furigana: '……なるべく　はやく　[来|き]ます。', en: '...I’ll come as early as I can.' },
      { speaker: 'gojo', furigana: '「なるべく」じゃなくて、かならず　[来|き]て　ほしいです。', en: 'Not "as early as you can". I want you to come, without fail.' },
      { speaker: 'kakashi', furigana: 'わかりました。おくれた　ときは、あやまります。', en: 'Understood. If I’m late, I’ll apologise.' },
      { speaker: 'gojo', furigana: 'あやまるより、[九|く][時|じ]に　[来|き]て　ほしいなあ。', en: 'Rather than apologise, I’d like you to be here at nine.' },
      { speaker: 'kakashi', furigana: 'ゴジョウさん、おこって　いますか？', en: 'Gojo, are you angry?' },
      { speaker: 'gojo', furigana: 'おこって　いませんよ。でも、まえは　[三|さん][時間|じかん]　まちましたから。', en: 'I’m not angry. But last time I waited three hours.' },
      { speaker: 'kakashi', furigana: '……あしたは　[九|く][時|じ]に。あんしんして　ください。', en: '...Nine o’clock tomorrow. Rest easy.' }
    ],
    remixes: [
      { scene: 'Gojo tells the class what to bring to the zoo.', en: 'Tomorrow, I want you to bring a packed lunch.',
        chunks: ['あしたは', 'おべんとうを', 'もって', 'きて　ほしいです。', 'きたいです。'], answer: ['あしたは', 'おべんとうを', 'もって', 'きて　ほしいです。'],
        explain: 'て ほしい = you want someone else to do it. もって きたいです would mean you want to bring it yourself.' },
      { scene: 'At the zoo gate, at nine sharp, Kakashi answers Gojo.', en: 'I don’t want you to worry, Gojo.',
        chunks: ['ゴジョウさんには', 'しんぱいしないで', 'ほしいです。', 'しんぱいしなくて'], answer: ['ゴジョウさんには', 'しんぱいしないで', 'ほしいです。'],
        explain: 'The negative wish is ないで + ほしい: しんぱいしないで ほしい. しんぱいしなくて gives a reason, not a wish.' }
    ],
    names: ['ゴジョウ', 'カカシ'],
    uses: ['g:te-hoshii', 'g:te-iru', 'g:te-form', 'g:no', 'g:to', 'g:ni', 'g:n-desu', 'g:kara', 'g:nakute', 'g:mashita', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:明日|あした', 'v:九|く', 'v:時|じ', 'v:約束|やくそく', 'v:覚える|おぼえる', 'v:生徒|せいと', 'v:動物園|どうぶつえん', 'v:行く|いく', 'v:遅れる|おくれる', 'v:心配|しんぱい', 'v:なるべく|なるべく', 'v:早い|はやい', 'v:来る|くる', 'v:必ず|かならず', 'v:分かる|わかる', 'v:時|とき', 'v:謝る|あやまる', 'v:より|より', 'v:怒る|おこる', 'v:でも|でも', 'v:前|まえ', 'v:三|さん', 'v:時間|じかん', 'v:待つ|まつ', 'v:安心|あんしん', 'v:ください|ください', 'k:九', 'k:時', 'k:行', 'k:来', 'k:三', 'k:間'],
    notes: 'Series nod: Kakashi is always late. ええ is unverified on the N5 list, so it stays out of uses (a set reply).',
    verified: true }),

  L({ id: 'l:n4-dlg-cake-counter', format: 'dialogue',
    title: 'She wants them all', goal: 'You can say what someone else wants with 〜たがる / 〜たがっている.',
    scene: 'Yor brings Anya to Sanji’s restaurant. Anya heads straight for the cake counter.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' } },
    lines: [
      { speaker: 'sanji', furigana: 'ヨルさん、どうぞ　こちらへ。', en: 'Yor, this way, please.' },
      { speaker: 'yor', furigana: 'ありがとうございます。……あ、むすめは　あちらで　ケーキを　[見|み]て　います。', en: 'Thank you. ...Oh, my daughter is over there looking at the cakes.' },
      { speaker: 'sanji', furigana: 'アーニャさんは　ケーキが　すきなんですね。', en: 'Anya likes cake, then.' },
      { speaker: 'yor', furigana: 'はい……ぜんぶ　[食|た]べたがって　いて、こまって　います。', en: 'Yes... She wants to eat every one of them. I don’t know what to do.' },
      { speaker: 'sanji', furigana: 'いいじゃないですか。[子|こ]どもは　みんな　そうですよ。', en: 'Where’s the harm? All children are like that.' },
      { speaker: 'yor', furigana: 'きのうは　おもちゃを　ほしがって、ないて　いました。[子|こ]どもを　そだてるのは　むずかしいです。', en: 'Yesterday she wanted a toy and cried. Raising a child is hard.' },
      { speaker: 'sanji', furigana: 'では、[小|ちい]さい　ケーキを　ひとつ　プレゼントします。', en: 'Then let me give her one small cake, on the house.' },
      { speaker: 'yor', furigana: 'え、いいんですか？', en: 'Oh, are you sure?' },
      { speaker: 'sanji', furigana: 'もちろん。……[見|み]て　ください、もう　わらって　いますよ。', en: 'Of course. ...Look, she’s smiling already.' },
      { speaker: 'yor', furigana: '……あ。ほかの　ケーキも　[食|た]べたがって　います……。', en: '...Oh. Now she wants the other cakes too...' }
    ],
    remixes: [
      { scene: 'At the next table, a father talks to Sanji about his little boy.', en: 'My son wants to drink water.',
        chunks: ['むすこが', 'みずを', 'のみたがって　います。', 'のみたいです。'], answer: ['むすこが', 'みずを', 'のみたがって　います。'],
        explain: 'For someone else’s wish use たがって いる: むすこが のみたがって います. のみたいです is only for your own wish.' },
      { scene: 'Yor tells Sanji about last Sunday.', en: 'Anya wanted to go to the zoo.',
        chunks: ['アーニャさんは', 'どうぶつえんに', 'いきたがって', 'いました。', 'いきたかって'], answer: ['アーニャさんは', 'どうぶつえんに', 'いきたがって', 'いました。'],
        explain: 'ます-stem + たがる: いき + たがる → いきたがって いました. いきたかって is not a form.' }
    ],
    names: ['ヨル', 'サンジ', 'アーニャ'],
    uses: ['g:tagaru', 'g:te-iru', 'g:te-form', 'g:n-desu', 'g:ja-nai', 'g:ga', 'g:wo', 'g:de', 'g:wa-desu', 'g:ne', 'g:yo', 'g:mo', 'g:ka', 'g:no', 'v:さん|さん', 'v:どうぞ|どうぞ', 'v:こちら|こちら', 'v:娘|むすめ', 'v:あちら|あちら', 'v:ケーキ|ケーキ', 'v:見る|みる', 'v:好き|すき', 'v:全部|ぜんぶ', 'v:食べる|たべる', 'v:困る|こまる', 'v:いい|いい', 'v:子供|こども', 'v:子|こ', 'v:みんな|みんな', 'v:そう|そう', 'v:昨日|きのう', 'v:おもちゃ|おもちゃ', 'v:泣く|なく', 'v:育てる|そだてる', 'v:難しい|むずかしい', 'v:では|では', 'v:小さい|ちいさい', 'v:一つ|ひとつ', 'v:プレゼント|プレゼント', 'v:する|する', 'v:もちろん|もちろん', 'v:ください|ください', 'v:もう|もう', 'v:笑う|わらう', 'v:ほか|ほか', 'k:見', 'k:食', 'k:子', 'k:小'],
    notes: 'Threads: Anya always wants more (her school/home thread) and Sanji’s restaurant (part-time job thread). ほしがって is the がる form of ほしい, in the grammar note of g:tagaru.',
    verified: true }),

  L({ id: 'l:n4-dlg-strange-smell', format: 'dialogue',
    title: 'Something smells odd', goal: 'You can say there is a smell, a sound or a taste with 〜がする.',
    scene: 'Killua is at the Forgers’ again. A strange smell is coming from the kitchen, where Yor is baking.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'killua', furigana: '……[何|なに]か、へんな　においが　する。', en: '...Something smells weird.' },
      { speaker: 'anya', furigana: 'ははが　だいどころで　ケーキを　やいて　いる。', en: 'Mama is baking a cake in the kitchen.' },
      { speaker: 'killua', furigana: 'ケーキ？　ケーキの　においじゃない。', en: 'A cake? That’s not what cake smells like.' },
      { speaker: 'anya', furigana: '……たぶん　ケーキ。', en: '...Probably a cake.' },
      { speaker: 'killua', furigana: 'それに、[大|おお]きい　おとも　する。', en: 'And there’s a loud noise too.' },
      { speaker: 'anya', furigana: 'おゆを　わかして　いる。おゆが　わく　おと。', en: 'She’s boiling water. It’s the sound of water boiling.' },
      { speaker: 'killua', furigana: '……ケーキに　おゆ？', en: '...Hot water, for a cake?' },
      { speaker: 'anya', furigana: 'ははの　ケーキは　とくべつ。あじも　とくべつな　あじが　する。', en: 'Mama’s cakes are special. They taste special too.' },
      { speaker: 'killua', furigana: '……[急|きゅう]に　おなかが　いたい　[気|き]が　する。', en: '...I have a feeling my stomach suddenly hurts.' },
      { speaker: 'anya', furigana: 'キルアさん、かえらないで。いっしょに　[食|た]べる。', en: 'Killua, don’t go home. We’ll eat it together.' }
    ],
    remixes: [
      { scene: 'Anya pours Killua some of Yor’s tea.', en: 'This tea has a strange taste.',
        chunks: ['この', 'おちゃは', 'へんな', 'あじが', 'する。', 'あじを'], answer: ['この', 'おちゃは', 'へんな', 'あじが', 'する。'],
        explain: 'A taste you notice takes が + する: あじが する. あじを する is not said.' },
      { scene: 'The next day, Anya tells Killua about last night.', en: 'Last night there was a noise from upstairs.',
        chunks: ['きのうの　よる、', 'うえから', 'おとが', 'した。', 'きいた。'], answer: ['きのうの　よる、', 'うえから', 'おとが', 'した。'],
        explain: 'おとが する: the sound is noticed, so する, not きく. おとが きいた is wrong; you would say おとを きいた.' }
    ],
    names: ['キルア', 'アーニャ'],
    uses: ['g:ga-suru', 'g:te-iru', 'g:te-form', 'g:sore-ni', 'g:noun-modifier', 'g:ja-nai', 'g:no', 'g:ga', 'g:de', 'g:wo', 'g:mo', 'g:ni', 'g:ka', 'v:何|なに', 'v:変|へん', 'v:匂い|におい', 'v:する|する', 'v:母|はは', 'v:台所|だいどころ', 'v:ケーキ|ケーキ', 'v:焼く|やく', 'v:たぶん|たぶん', 'v:それに|それに', 'v:大きい|おおきい', 'v:音|おと', 'v:湯|ゆ', 'v:沸かす|わかす', 'v:沸く|わく', 'v:特別|とくべつ', 'v:味|あじ', 'v:急|きゅう', 'v:おなか|おなか', 'v:痛い|いたい', 'v:気|き', 'v:帰る|かえる', 'v:一緒|いっしょ', 'v:食べる|たべる', 'v:さん|さん', 'k:何', 'k:大', 'k:急', 'k:気', 'k:食'],
    notes: 'Yor’s cooking thread (she cannot cook, canonically), with Killua again. おゆ = お + 湯 (v:湯|ゆ).',
    verified: true }),

  L({ id: 'l:n4-dlg-lake-depth', format: 'dialogue',
    title: 'How deep is the lake?', goal: 'You can talk about size, length and depth with 〜さ.',
    scene: 'Nami guides visitors around a mountain lake. Frieren has a question that has nothing to do with the view.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Guide' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Visitor' } },
    lines: [
      { speaker: 'frieren', furigana: '……ナミさん、この　みずうみの　ふかさは　どのくらいですか。', en: '...Nami, how deep is this lake?' },
      { speaker: 'nami', furigana: 'いちばん　ふかい　ところは　[百|ひゃく]メートル[以上|いじょう]です。どうしてですか？', en: 'The deepest part is over a hundred metres. Why do you ask?' },
      { speaker: 'frieren', furigana: '……そこに　めずらしい　まほうが　あると　[聞|き]きました。', en: '...I heard there is a rare spell down there.' },
      { speaker: 'nami', furigana: 'え、およいで　みつけますか？　むりですよ。', en: 'What, you’ll swim down and find it? That’s impossible.' },
      { speaker: 'frieren', furigana: '……では、あさい　ところは　どこですか。', en: '...Then where is it shallow?' },
      { speaker: 'nami', furigana: 'こちらの　ちかくは　[一|いち]メートル[以下|いか]です。でも、まほうは　ないと　[思|おも]います。', en: 'Near here it’s a metre or less. But I don’t think there are any spells.' },
      { speaker: 'frieren', furigana: '……この　みずうみの　[大|おお]きさは？', en: '...How big is this lake?' },
      { speaker: 'nami', furigana: '[長|なが]さは　[五|ご]キロほどです。かたちは　ほそくて　ながいです。', en: 'It’s about five kilometres long. It’s a long, thin shape.' },
      { speaker: 'frieren', furigana: '……では、[夜|よる]まで　あるいて　みつけます。', en: '...Then I’ll walk around it until night and find it.' },
      { speaker: 'nami', furigana: 'じゃあ、この　ちずを　どうぞ。[二|に][千|せん][円|えん]です。ふつうの　[二|に]ばいですけど。', en: 'Then here’s a map. Two thousand yen. That’s double the usual price, mind you.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'From the shore, Frieren looks up at the mountain behind the lake.', en: 'How high is that mountain?',
        chunks: ['あの', 'やまの', 'たかさは', 'どのくらいですか。', 'たかいは'], answer: ['あの', 'やまの', 'たかさは', 'どのくらいですか。'],
        explain: 'たかい → たかさ: drop い, add さ, and the adjective becomes a noun, "height". An adjective cannot take は as a topic like that: たかいは is wrong.' },
      { scene: 'Nami compares the lake with the river below it.', en: 'The depth of this lake is twice the river’s.',
        chunks: ['この', 'みずうみの', 'ふかさは', 'かわの', 'にばいです。', 'ふかくは'], answer: ['この', 'みずうみの', 'ふかさは', 'かわの', 'にばいです。'],
        explain: 'ふかい → ふかさ, "depth", a noun you can measure: ふかさは かわの にばい. ふかくは is the adverb form and cannot be the topic here.' }
    ],
    names: ['ナミ', 'フリーレン'],
    uses: ['g:sa', 'g:no', 'g:wa-desu', 'g:ka', 'g:te-adj-noun', 'g:to-omou', 'g:made', 'g:te-form', 'g:wo', 'g:ga-arimasu', 'v:さん|さん', 'v:この|この', 'v:湖|みずうみ', 'v:深い|ふかい', 'v:どの|どの', 'v:くらい|くらい', 'v:いちばん|いちばん', 'v:所|ところ', 'v:百|ひゃく', 'v:メートル|メートル', 'v:以上|いじょう', 'v:どうして|どうして', 'v:そこ|そこ', 'v:珍しい|めずらしい', 'v:ある|ある', 'v:聞く|きく', 'v:泳ぐ|およぐ', 'v:見つける|みつける', 'v:無理|むり', 'v:では|では', 'v:浅い|あさい', 'v:どこ|どこ', 'v:こちら|こちら', 'v:近く|ちかく', 'v:一|いち', 'v:以下|いか', 'v:でも|でも', 'v:ない|ない', 'v:思う|おもう', 'v:大きい|おおきい', 'v:長い|ながい', 'v:五|ご', 'v:キロ|キロ', 'v:程|ほど', 'v:形|かたち', 'v:細い|ほそい', 'v:夜|よる', 'v:歩く|あるく', 'v:じゃあ|じゃあ', 'v:地図|ちず', 'v:どうぞ|どうぞ', 'v:二|に', 'v:千|せん', 'v:円|えん', 'v:普通|ふつう', 'v:倍|ばい', 'k:百', 'k:以', 'k:上', 'k:聞', 'k:一', 'k:下', 'k:思', 'k:大', 'k:長', 'k:五', 'k:夜', 'k:二', 'k:千', 'k:円'],
    notes: 'Series nods: Frieren collects rare spells; Nami knows the water and charges double. まほう is a bridge. ふかさ is not marked by the g:sa hl (its stem list has no 深), 大きさ and 長さ are.',
    verified: true }),

  L({ id: 'l:n4-dlg-lunch-menu', format: 'dialogue',
    title: 'It all looks good', goal: 'You can say how something looks with 〜そうだ / 〜そうな.',
    scene: 'Lunchtime at Sanji’s restaurant. Hinata comes in hungry after practice.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Customer' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' } },
    lines: [
      { speaker: 'hinata', furigana: 'サンジさん！　きょうの　ごはんは　どれも　おいしそうです！', en: 'Sanji! Everything today looks delicious!' },
      { speaker: 'sanji', furigana: 'ありがとうございます。きょうは　ステーキと　ハンバーグが　ありますよ。', en: 'Thank you. Today we have steak and hamburg steak.' },
      { speaker: 'hinata', furigana: 'ハンバーグに　します！　あと、サラダも。', say: 'ハンバーグにします！あと、サラダも。', en: 'I’ll have the hamburg steak! And a salad.' },
      { speaker: 'sanji', furigana: 'サラダには　ぶどうも　[入|はい]って　います。', en: 'There are grapes in the salad too.' },
      { speaker: 'hinata', furigana: 'ぶどう！？　……げんきに　なりそうな　サラダですね！', en: 'Grapes?! ...That’s a salad that looks like it’ll give me energy!' },
      { speaker: 'sanji', furigana: 'それから、これは　にがい　おちゃです。からだに　いいですよ。', en: 'And this is a bitter tea. It’s good for you.' },
      { speaker: 'hinata', furigana: 'にがいのは　ちょっと……。', en: 'Bitter things aren’t really my...' },
      { speaker: 'sanji', furigana: 'では、パンに　ジャムは　どうですか。あまくて　おいしいですよ。', en: 'Then how about bread with jam? It’s sweet and tasty.' },
      { speaker: 'hinata', furigana: 'それに　します！　……あ、サスケさんが　[走|はし]って　います。いそがしそうですね。', en: 'I’ll have that! ...Oh, Sasuke is running around. He looks busy.' },
      { speaker: 'sanji', furigana: 'きょうは　ひとが　おおいですから。でも、サスケさんは　たのしそうですよ。', en: 'There are a lot of people today. But Sasuke looks like he’s enjoying it.' }
    ],
    remixes: [
      { scene: 'Hinata sees what the next table ordered.', en: 'Those are tasty-looking grapes.',
        chunks: ['それは', 'おいしそうな', 'ぶどうです。', 'おいしそうに'], answer: ['それは', 'おいしそうな', 'ぶどうです。'],
        explain: 'Before a noun the "looks" そう becomes そうな: おいしそうな ぶどう. そうに goes before a verb.' },
      { scene: 'Hinata looks out of the window before he leaves.', en: 'Outside, it looks like it’s going to rain.',
        chunks: ['そとは', 'あめが', 'ふりそうです。', 'ふるそうです。'], answer: ['そとは', 'あめが', 'ふりそうです。'],
        explain: 'For what you see, そう goes on the ます-stem: ふり + そう, "looks like rain". ふるそう is a different そう, "I hear it will rain".' }
    ],
    names: ['ヒナタ', 'サンジ', 'サスケ'],
    uses: ['g:sou-da-looks', 'g:te-adj-noun', 'g:te-iru', 'g:te-form', 'g:naru', 'g:kara', 'g:no', 'g:ni', 'g:to', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'g:wa-desu', 'g:adj-i', 'v:さん|さん', 'v:今日|きょう', 'v:御飯|ごはん', 'v:どれ|どれ', 'v:おいしい|おいしい', 'v:ステーキ|ステーキ', 'v:ハンバーグ|ハンバーグ', 'v:ある|ある', 'v:する|する', 'v:後|あと', 'v:サラダ|サラダ', 'v:ぶどう|ぶどう', 'v:入る|はいる', 'v:元気|げんき', 'v:なる|なる', 'v:それから|それから', 'v:これ|これ', 'v:苦い|にがい', 'v:お茶|おちゃ', 'v:体|からだ', 'v:いい|いい', 'v:ちょっと|ちょっと', 'v:では|では', 'v:パン|パン', 'v:ジャム|ジャム', 'v:どう|どう', 'v:甘い|あまい', 'v:それ|それ', 'v:走る|はしる', 'v:忙しい|いそがしい', 'v:人|ひと', 'v:多い|おおい', 'v:でも|でも', 'v:楽しい|たのしい', 'k:入', 'k:走'],
    notes: 'Part-time job thread: Sasuke at work in Sanji’s restaurant, seen by Hinata. Of the "looks" そう forms, おいしそう, なりそう, いそがしそう and たのしそう are marked by the hl.',
    verified: true }),

  L({ id: 'l:n4-dlg-haunted-house', format: 'dialogue',
    title: 'Like a little kid', goal: 'You can say what something is like or seems like, casually, with 〜みたい.',
    scene: 'Summer festival. Sakura and Sasuke have just come out of the haunted house.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'ああ、おもしろかった！　サスケさんは　どうだった？', en: 'Ah, that was fun! How was it for you, Sasuke?' },
      { speaker: 'sasuke', furigana: '……ふつう。', en: '...Nothing special.' },
      { speaker: 'sakura', furigana: 'でも、なかで　わたしの　[手|て]を　もって　いたよ。こどもみたい。', en: 'But you were holding my hand in there. Like a little kid.' },
      { speaker: 'sasuke', furigana: '……くらかった　だけだ。こわくは　なかった。', en: '...It was just dark. I wasn’t scared.' },
      { speaker: 'sakura', furigana: 'ほんとう？　かおが　まだ　しろいよ。おばけみたい。', en: 'Really? Your face is still white. You look like a ghost.' },
      { speaker: 'sasuke', furigana: '……はずかしいから、もう　[言|い]わないで。', en: '...It’s embarrassing, so stop saying it.' },
      { speaker: 'sakura', furigana: 'わかった、わかった。でも、わたしは　ちょっと　うれしかったよ。', en: 'Okay, okay. But I was a little happy, you know.' },
      { speaker: 'sasuke', furigana: '……つぎは　あかるい　ところが　いい。', en: '...Somewhere bright next time.' },
      { speaker: 'sakura', furigana: 'じゃあ、[海|うみ]を　[見|み]に　[行|い]かない？　すばらしい　けしきだよ。', en: 'Then shall we go and see the sea? The view is wonderful.' },
      { speaker: 'sasuke', furigana: '……[海|うみ]は　こわくない。', en: '...The sea isn’t scary.' }
    ],
    bridge: [
      { text: 'おばけ', gloss: 'おばけ = a ghost' }
    ],
    remixes: [
      { scene: 'Sakura watches Sasuke walk off quietly through the crowd.', en: 'Sasuke, you’re a cat-like person.',
        chunks: ['サスケさんは', 'ねこみたいな', 'ひとだね。', 'ねこみたいに'], answer: ['サスケさんは', 'ねこみたいな', 'ひとだね。'],
        explain: 'Before a noun, みたい becomes みたいな: ねこみたいな ひと. みたいに goes before a verb or an adjective.' },
      { scene: 'At the sea, Sakura fans herself.', en: 'Today it’s hot, like summer.',
        chunks: ['きょうは', 'なつみたいに', 'あついね。', 'なつみたいな'], answer: ['きょうは', 'なつみたいに', 'あついね。'],
        explain: 'Before an adjective or a verb, みたい becomes みたいに: なつみたいに あつい. みたいな needs a noun after it.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:mitai', 'g:adj-i', 'g:te-iru', 'g:te-form', 'g:no', 'g:ni-iku', 'g:ga', 'g:kara', 'g:dake', 'g:yo', 'g:wo', 'g:ni', 'v:面白い|おもしろい', 'v:さん|さん', 'v:どう|どう', 'v:普通|ふつう', 'v:でも|でも', 'v:中|なか', 'v:私|わたし', 'v:手|て', 'v:持つ|もつ', 'v:子供|こども', 'v:暗い|くらい', 'v:だけ|だけ', 'v:怖い|こわい', 'v:ほんとう|ほんとう', 'v:顔|かお', 'v:まだ|まだ', 'v:白い|しろい', 'v:恥ずかしい|はずかしい', 'v:もう|もう', 'v:言う|いう', 'v:分かる|わかる', 'v:ちょっと|ちょっと', 'v:嬉しい|うれしい', 'v:次|つぎ', 'v:明るい|あかるい', 'v:所|ところ', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:海|うみ', 'v:見る|みる', 'v:行く|いく', 'v:素晴らしい|すばらしい', 'v:景色|けしき', 'k:手', 'k:言', 'k:海', 'k:見', 'k:行'],
    notes: 'Sasuke and Sakura thread: a festival date. Series nod: Sasuke curt and proud. おばけ is not on the list: a bridge.',
    verified: true }),

  L({ id: 'l:n4-dlg-sore-throat', format: 'dialogue',
    title: 'It seems to be a cold', goal: 'You can say what seems to be the case with 〜ようだ.',
    scene: 'Lelouch comes to Maomao’s clinic the day before an important chess match.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Doctor' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Patient' } },
    lines: [
      { speaker: 'maomao', furigana: 'きょうは　どう　しましたか。', en: 'What seems to be the trouble today?' },
      { speaker: 'lelouch', furigana: 'きのうから　のどが　いたくて、きぶんが　わるいです。', en: 'My throat has hurt since yesterday, and I feel unwell.' },
      { speaker: 'maomao', furigana: 'ねつも　ありますね。[三|さん][十|じゅう][八|はち]ど……かぜの　ようです。', en: 'You have a fever too. Thirty-eight degrees... It seems to be a cold.' },
      { speaker: 'lelouch', furigana: 'かぜですか。あしたは　だいじな　チェスが　あるんですが。', en: 'A cold? I have an important chess match tomorrow.' },
      { speaker: 'maomao', furigana: 'ぐあいは　とても　わるい　ようです。ちゅうしゃを　しますか。', en: 'You seem to be in quite a bad way. Shall I give you an injection?' },
      { speaker: 'lelouch', furigana: '……ちゅうしゃは　ちょっと……。くすりだけで　なおりますか。', en: '...I’d rather not have an injection... Will medicine alone cure it?' },
      { speaker: 'maomao', furigana: 'なおりますよ。でも、この　くすりは　とても　にがいです。', en: 'It will. But this medicine is very bitter.' },
      { speaker: 'lelouch', furigana: 'だいじょうぶです。ちゅうしゃより　いいです。', en: 'That’s fine. Better than an injection.' },
      { speaker: 'maomao', furigana: 'こんやは　はやく　ねて　ください。それから、はいしゃにも　[行|い]った　ほうが　いい　ようです。', en: 'Go to bed early tonight. Also, it looks like you’d better see a dentist.' },
      { speaker: 'lelouch', furigana: '……チェスより　むずかしい　[病気|びょうき]の　ようですね。', en: '...This seems to be a harder problem than chess.' }
    ],
    bridge: [
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Maomao sees the next patient, Lelouch’s classmate.', en: 'It seems you have a fever too.',
        chunks: ['あなたも', 'ねつが', 'ある', 'ようです。', 'あるの'], answer: ['あなたも', 'ねつが', 'ある', 'ようです。'],
        explain: 'A verb goes straight before ようです: ある ようです. の is added only after a noun (かぜの ようです).' },
      { scene: 'Lelouch phones the dentist, but nobody answers.', en: 'It seems the dentist is closed today.',
        chunks: ['はいしゃは', 'きょう', 'やすみの', 'ようです。', 'やすみな'], answer: ['はいしゃは', 'きょう', 'やすみの', 'ようです。'],
        explain: 'Noun + の + ようです: やすみの ようです. な is for な-adjectives (しずかな ようです), not nouns.' }
    ],
    names: ['マオマオ', 'ルルーシュ'],
    uses: ['g:you-da', 'g:te-adj-noun', 'g:te-kudasai', 'g:hou-ga-ii', 'g:n-desu', 'g:dake-de', 'g:no', 'g:ga', 'g:mo', 'g:ka', 'g:ne', 'g:yo', 'g:wo', 'g:kara', 'g:ni', 'v:今日|きょう', 'v:どう|どう', 'v:する|する', 'v:昨日|きのう', 'v:喉|のど', 'v:痛い|いたい', 'v:気分|きぶん', 'v:悪い|わるい', 'v:熱|ねつ', 'v:ある|ある', 'v:三|さん', 'v:十|じゅう', 'v:八|はち', 'v:度|ど', 'v:風邪|かぜ', 'v:明日|あした', 'v:大事|だいじ', 'v:具合|ぐあい', 'v:とても|とても', 'v:注射|ちゅうしゃ', 'v:ちょっと|ちょっと', 'v:薬|くすり', 'v:だけ|だけ', 'v:治る|なおる', 'v:でも|でも', 'v:この|この', 'v:苦い|にがい', 'v:大丈夫|だいじょうぶ', 'v:より|より', 'v:いい|いい', 'v:今夜|こんや', 'v:早い|はやい', 'v:寝る|ねる', 'v:ください|ください', 'v:それから|それから', 'v:歯医者|はいしゃ', 'v:行く|いく', 'v:難しい|むずかしい', 'v:病気|びょうき', 'k:三', 'k:十', 'k:八', 'k:行', 'k:病', 'k:気'],
    notes: 'Series nods: Maomao is the blunt doctor; Lelouch plays chess. チェス is not on the list: a bridge.',
    verified: true }),

  L({ id: 'l:n4-dlg-night-beach', format: 'dialogue',
    title: 'Like jewels', goal: 'You can compare things with 〜のような and 〜のように.',
    scene: 'The trip at last. Emilia and Nami walk on the beach at night.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、[見|み]て！　そらに　ほしが　たくさん　ある！', en: 'Nami, look! There are so many stars in the sky!' },
      { speaker: 'nami', furigana: 'きれいね。くもが　ひとつも　ない。', say: 'きれいね。雲が一つもない。', en: 'Pretty. There isn’t a single cloud.' },
      { speaker: 'emilia', furigana: 'あの　ほしは　ほうせきのように　ひかって　いる。', en: 'That star is shining like a jewel.' },
      { speaker: 'nami', furigana: 'ほうせき……。わたしは　ほんとうの　ほうせきの　ほうが　すき。', en: 'Jewels... I prefer real ones.' },
      { speaker: 'emilia', furigana: 'もう、ナミさん。……かいがんの　すなも、ゆきのように　しろいよ。', en: 'Oh, Nami. ...The sand on the beach is white like snow, too.' },
      { speaker: 'nami', furigana: 'うみの　くうきも　つめたくて　いいね。', en: 'And the sea air is nice and cool.' },
      { speaker: 'emilia', furigana: 'あ、むこうに　しまが　ある。しまの　ひかりも　きれい。', en: 'Oh, there’s an island over there. The lights on the island are pretty too.' },
      { speaker: 'nami', furigana: 'あしたは　あの　しまに　[行|い]く？', en: 'Shall we go to that island tomorrow?' },
      { speaker: 'emilia', furigana: '[行|い]く！　きょうは　ゆめのような　[日|ひ]だった。', en: 'Yes! Today was like a dream.' },
      { speaker: 'nami', furigana: '……[少|すこ]し　さむいね。ホテルに　かえる？', en: '...It’s a little cold. Shall we go back to the hotel?' }
    ],
    bridge: [
      { text: 'ほうせき', gloss: 'ほうせき = a jewel, a precious stone' }
    ],
    remixes: [
      { scene: 'Back at the hotel, Emilia writes a postcard.', en: 'The sea was blue like the sky.',
        chunks: ['うみは', 'そらのように', 'あおかった。', 'そらのような'], answer: ['うみは', 'そらのように', 'あおかった。'],
        explain: 'Before an adjective or a verb use のように: そらのように あおい. のような goes before a noun.' },
      { scene: 'Nami tells Emilia what the island looks like.', en: 'It’s an island like a small mountain.',
        chunks: ['ちいさい', 'やまのような', 'しまだよ。', 'やまのように'], answer: ['ちいさい', 'やまのような', 'しまだよ。'],
        explain: 'Before a noun use のような: やまのような しま. のように goes before a verb or an adjective.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:no-you-na', 'g:te-iru', 'g:te-form', 'g:te-adj-noun', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:ne', 'g:yo', 'g:deshita', 'v:さん|さん', 'v:見る|みる', 'v:空|そら', 'v:星|ほし', 'v:たくさん|たくさん', 'v:ある|ある', 'v:きれい|きれい', 'v:雲|くも', 'v:一つ|ひとつ', 'v:ない|ない', 'v:あの|あの', 'v:光る|ひかる', 'v:私|わたし', 'v:ほんとう|ほんとう', 'v:好き|すき', 'v:もう|もう', 'v:海岸|かいがん', 'v:砂|すな', 'v:雪|ゆき', 'v:白い|しろい', 'v:海|うみ', 'v:空気|くうき', 'v:冷たい|つめたい', 'v:いい|いい', 'v:向こう|むこう', 'v:島|しま', 'v:光|ひかり', 'v:明日|あした', 'v:行く|いく', 'v:今日|きょう', 'v:夢|ゆめ', 'v:日|ひ', 'v:少し|すこし', 'v:寒い|さむい', 'v:ホテル|ホテル', 'v:帰る|かえる', 'k:見', 'k:行', 'k:日', 'k:少'],
    notes: 'Trip thread: Emilia and Nami at the sea (u001 planned, u012 packed). Nami’s nod: real jewels please. ほうせき is a bridge.',
    verified: true }),

  L({ id: 'l:n4-dlg-typhoon-news', format: 'dialogue',
    title: 'A typhoon is coming', goal: 'You can pass on what you heard with 〜そうだ.',
    scene: 'After school. Hinata runs into the staff room to ask Kakashi-sensei about tomorrow’s practice.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'hinata', furigana: 'カカシ[先生|せんせい]！　あしたの　れんしゅうは　ありますか？', en: 'Kakashi-sensei! Is there practice tomorrow?' },
      { speaker: 'kakashi', furigana: 'てんきよほうで　[聞|き]きました。たいふうが　[来|く]るそうです。', en: 'I heard the weather forecast. They say a typhoon is coming.' },
      { speaker: 'hinata', furigana: 'たいふう！？　いつですか？', en: 'A typhoon?! When?' },
      { speaker: 'kakashi', furigana: 'あしたの　ひるごろから　あめが　ふりだすそうです。', en: 'They say the rain will start around noon tomorrow.' },
      { speaker: 'hinata', furigana: 'でも、たいせつな　れんしゅうです……。', en: 'But it’s an important practice...' },
      { speaker: 'kakashi', furigana: 'かぜも　つよいそうですよ。がっこうの　まどが　ゆれて、あぶないです。', en: 'They say the wind will be strong too. The school windows shake; it’s dangerous.' },
      { speaker: 'hinata', furigana: 'じゃあ、あめが　やむまで　まちます！', say: 'じゃあ、雨がやむまで待ちます！', en: 'Then I’ll wait till the rain stops!' },
      { speaker: 'kakashi', furigana: 'あめは　あさってまで　やまないそうです。', say: '雨はあさってまでやまないそうです。', en: 'They say it won’t stop until the day after tomorrow.' },
      { speaker: 'hinata', furigana: '……ぬれても　いいです！', en: '...I don’t mind getting wet!' },
      { speaker: 'kakashi', furigana: 'よるは　ひえるそうですよ。いえで　しゅくだいを　して　ください。', en: 'They say it’ll get cold at night. Do your homework at home.' }
    ],
    remixes: [
      { scene: 'Hinata phones Sakura with the news.', en: 'I hear there’s no practice tomorrow.',
        chunks: ['あしたの', 'れんしゅうは', 'ないそうだよ。', 'なさそうだよ。'], answer: ['あしたの', 'れんしゅうは', 'ないそうだよ。'],
        explain: 'To pass on news, そうだ goes after the plain form: ない + そうだ. なさそうだ is the other そう, "it looks like there isn’t".' },
      { scene: 'The next morning, Kakashi reads the news to the class.', en: 'They say there was an earthquake last night.',
        chunks: ['きのうの　よる、', 'じしんが', 'あったそうです。', 'ありそうです。'], answer: ['きのうの　よる、', 'じしんが', 'あったそうです。'],
        explain: 'Hearsay そうです follows the plain form, here the past あった. ありそうです means "it looks like there will be one".' }
    ],
    names: ['ヒナタ', 'カカシ'],
    uses: ['g:sou-da-hearsay', 'g:te-mo-ii', 'g:te-kudasai', 'g:te-form', 'g:made', 'g:no', 'g:ga', 'g:de', 'g:ka', 'g:mo', 'g:yo', 'g:wo', 'g:adj-na', 'v:先生|せんせい', 'v:明日|あした', 'v:練習|れんしゅう', 'v:ある|ある', 'v:天気予報|てんきよほう', 'v:聞く|きく', 'v:台風|たいふう', 'v:来る|くる', 'v:いつ|いつ', 'v:昼|ひる', 'v:ごろ|ごろ', 'v:雨|あめ', 'v:降り出す|ふりだす', 'v:でも|でも', 'v:大切|たいせつ', 'v:風|かぜ', 'v:強い|つよい', 'v:学校|がっこう', 'v:窓|まど', 'v:揺れる|ゆれる', 'v:危ない|あぶない', 'v:じゃあ|じゃあ', 'v:止む|やむ', 'v:待つ|まつ', 'v:あさって|あさって', 'v:ぬれる|ぬれる', 'v:いい|いい', 'v:夜|よる', 'v:冷える|ひえる', 'v:家|いえ', 'v:宿題|しゅくだい', 'v:する|する', 'v:ください|ください', 'k:先', 'k:生', 'k:聞', 'k:来'],
    notes: 'Hinata (volleyball, never tired) wants to practise in a typhoon; Kakashi stays calm. やまない is the ない form of the unit word 止む.',
    verified: true }),

  L({ id: 'l:n4-dlg-missing-peanuts', format: 'dialogue',
    title: 'The peanut thief', goal: 'You can say something might be so with 〜かもしれない.',
    scene: 'Break time at school. Anya runs to Gojo-sensei: her peanuts are gone.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Pupil' } },
    lines: [
      { speaker: 'anya', furigana: 'ゴジョウ[先生|せんせい]！　アーニャの　ピーナッツが　ない！', en: 'Gojo-sensei! Anya’s peanuts are gone!' },
      { speaker: 'gojo', furigana: 'かばんの　なかは　[見|み]ましたか？', en: 'Did you look inside your bag?' },
      { speaker: 'anya', furigana: '[見|み]た。ない。……どろぼうかもしれない！', en: 'Looked. Not there. ...It might be a thief!' },
      { speaker: 'gojo', furigana: 'どろぼう？　それは　きけんですね。', en: 'A thief? That’s dangerous.' },
      { speaker: 'anya', furigana: 'だれかが　ぬすんだかもしれない。けいさつに　でんわする！', en: 'Someone might have stolen them. I’m calling the police!' },
      { speaker: 'gojo', furigana: 'まって　ください。ほかの　ところに　あるかもしれませんよ。', en: 'Hold on. They might be somewhere else.' },
      { speaker: 'anya', furigana: 'ほかの　ところ？', en: 'Somewhere else?' },
      { speaker: 'gojo', furigana: 'たとえば……アーニャさんの　ポケットとか。', en: 'For example... your pocket, Anya.' },
      { speaker: 'anya', furigana: '……あった。', en: '...Found them.' },
      { speaker: 'gojo', furigana: 'よかった。きょうしつは　あんぜんですね。', en: 'Good. The classroom is safe, then.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'The next day, Anya cannot find her pencil.', en: 'I might have left it at home.',
        chunks: ['いえに', 'わすれた', 'かもしれない。', 'かもしれる。'], answer: ['いえに', 'わすれた', 'かもしれない。'],
        explain: 'かもしれない is a fixed ending: "might". There is no form かもしれる.' },
      { scene: 'Gojo looks at the dark sky before the afternoon break.', en: 'It might rain this afternoon.',
        chunks: ['ごごは', 'あめ', 'かもしれません。', 'あめだ'], answer: ['ごごは', 'あめ', 'かもしれません。'],
        explain: 'A noun joins かもしれません directly, without だ: あめ かもしれません.' }
    ],
    names: ['ゴジョウ', 'アーニャ'],
    uses: ['g:kamo-shirenai', 'g:te-kudasai', 'g:mashita', 'g:ta-form', 'g:no', 'g:ga', 'g:ni', 'g:ka', 'g:ne', 'g:yo', 'v:先生|せんせい', 'v:ない|ない', 'v:かばん|かばん', 'v:中|なか', 'v:見る|みる', 'v:泥棒|どろぼう', 'v:それ|それ', 'v:危険|きけん', 'v:誰か|だれか', 'v:盗む|ぬすむ', 'v:警察|けいさつ', 'v:電話|でんわ', 'v:する|する', 'v:待つ|まつ', 'v:ください|ください', 'v:ほか|ほか', 'v:所|ところ', 'v:ある|ある', 'v:例えば|たとえば', 'v:さん|さん', 'v:ポケット|ポケット', 'v:いい|いい', 'v:教室|きょうしつ', 'v:安全|あんぜん', 'k:先', 'k:生', 'k:見'],
    notes: 'Anya’s school thread (Gojo as her teacher). Series nod: Anya’s peanuts. ピーナッツ is a bridge, as in u004. Anya speaks of herself as アーニャ.',
    verified: true }),

  L({ id: 'l:n4-dlg-wrong-answer', format: 'dialogue',
    title: 'That can’t be', goal: 'You can say what should be true with 〜はずだ, and deny it with 〜はずがない.',
    scene: 'Frieren-sensei hands back a test. For once, Lelouch did not get full marks.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'frieren', furigana: '……ルルーシュさん、テストです。[一|ひと]つ　まちがえました。', en: '...Lelouch, your test. You got one wrong.' },
      { speaker: 'lelouch', furigana: 'そんなはずは　ありません。ぜんぶ　[正|ただ]しいはずです。', en: 'That can’t be. They should all be right.' },
      { speaker: 'frieren', furigana: '……[三|さん]ばんの　[答|こた]えです。', say: '……三番の答えです。', en: '...The answer to number three.' },
      { speaker: 'lelouch', furigana: '[三|さん]ばん……。たしか、[答|こた]えは　「[北|きた]」でした。', say: '三番……。確か、答えは「北」でした。', en: 'Number three... If I remember right, the answer was "north".' },
      { speaker: 'frieren', furigana: '……[問題|もんだい]は　「[南|みなみ]は　どちらですか」でした。', en: '...The question was "Which way is south?"' },
      { speaker: 'lelouch', furigana: '……わたしが　まちがえるはずが　ありません。', en: '...There’s no way I made a mistake.' },
      { speaker: 'frieren', furigana: '……きっと　つかれて　いたんですね。', en: '...You must have been tired.' },
      { speaker: 'lelouch', furigana: 'では、[問題|もんだい]の　[方|ほう]が　おかしいはずです。', en: 'Then the question must be the strange one.' },
      { speaker: 'frieren', furigana: '……[問題|もんだい]は　わたしが　つくりました。', en: '...I wrote the question.' },
      { speaker: 'lelouch', furigana: '……もう[一|いち]ど　[勉強|べんきょう]します。', en: '...I’ll study it again.' }
    ],
    remixes: [
      { scene: 'Before class, Frieren checks the timetable.', en: 'The lesson should start at ten.',
        chunks: ['じゅぎょうは', 'じゅうじに', 'はじまる', 'はずです。', 'はじまります'], answer: ['じゅぎょうは', 'じゅうじに', 'はじまる', 'はずです。'],
        explain: 'はず follows the plain form: はじまる はずです. The polite はじまります cannot go before はず.' },
      { scene: 'Lelouch hears a rumour that Frieren once got a sum wrong.', en: 'There’s no way sensei got it wrong.',
        chunks: ['せんせいが', 'まちがえる', 'はずが', 'ない。', 'まちがえて'], answer: ['せんせいが', 'まちがえる', 'はずが', 'ない。'],
        explain: 'はずが ない = "there is no way that ...", after the plain form: まちがえる はずが ない. The て-form cannot go before はず.' }
    ],
    names: ['フリーレン', 'ルルーシュ'],
    uses: ['g:hazu', 'g:hazu-ga-nai', 'g:te-ita', 'g:n-desu', 'g:no', 'g:ka', 'g:ga', 'g:ne', 'g:wa-desu', 'g:deshita', 'g:mashita', 'v:さん|さん', 'v:テスト|テスト', 'v:一つ|ひとつ', 'v:間違える|まちがえる', 'v:そんな|そんな', 'v:はず|はず', 'v:全部|ぜんぶ', 'v:正しい|ただしい', 'v:三|さん', 'v:番|ばん', 'v:答|こたえ', 'v:確か|たしか', 'v:北|きた', 'v:問題|もんだい', 'v:南|みなみ', 'v:どちら|どちら', 'v:私|わたし', 'v:きっと|きっと', 'v:疲れる|つかれる', 'v:では|では', 'v:ほう|ほう', 'v:おかしい|おかしい', 'v:作る|つくる', 'v:もう一度|もういちど', 'v:勉強|べんきょう', 'k:一', 'k:正', 'k:三', 'k:答', 'k:北', 'k:問', 'k:題', 'k:南', 'k:方', 'k:勉', 'k:強'],
    notes: 'Series nod: Lelouch never accepts defeat; Frieren, flat, wrote the test. はず is written right after the word before it (no phrase space), so the hl of g:hazu / g:hazu-ga-nai marks it and not the unit word はず.',
    verified: true }),

  L({ id: 'l:n4-dlg-moving-plan', format: 'dialogue',
    title: 'What’s the plan?', goal: 'You can talk about plans and schedules with 〜よていだ.',
    scene: 'Hinata is about to move into the boarding house near school. Sakura wants to know his plan.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'sakura', furigana: 'ヒナタさん、げしゅくには　いつから　すむ　よてい？', en: 'Hinata, when are you going to start living at the boarding house?' },
      { speaker: 'hinata', furigana: 'さらいしゅうの　どようびから！　にもつは　すくないから　かんたんだよ。', en: 'From Saturday the week after next! I don’t have much stuff, so it’s easy.' },
      { speaker: 'sakura', furigana: 'けいかくは　ある？　その　[日|ひ]は　わたしも　つごうが　いいから、[行|い]くよ。', en: 'Do you have a plan? I’m free that day, so I’ll come.' },
      { speaker: 'hinata', furigana: 'けいかく？　……あさ　おきて、[行|い]く。それだけ。', en: 'A plan? ...Get up in the morning and go. That’s it.' },
      { speaker: 'sakura', furigana: 'それは　けいかくじゃない。……つくえは？', en: 'That’s not a plan. ...What about a desk?' },
      { speaker: 'hinata', furigana: 'つくえは　こんど　かう　よていだよ。', en: 'I’m going to buy a desk some other time.' },
      { speaker: 'sakura', furigana: 'こんどって　いつ？', en: '"Some other time" meaning when?' },
      { speaker: 'hinata', furigana: '……さらいげつ。', en: '...The month after next.' },
      { speaker: 'sakura', furigana: 'じゃあ、わたしの　つくえを　[貸|か]す。べんきょうは　だいじだよ。', en: 'Then I’ll lend you my desk. Studying matters.' },
      { speaker: 'hinata', furigana: 'ありがとう！　しょうらいは　サクラさんみたいな　ひとに　なりたい！', en: 'Thanks! In the future I want to be someone like you, Sakura!' }
    ],
    remixes: [
      { scene: 'Sakura asks about Hinata’s Friday.', en: 'On Friday I’ve got a meeting scheduled.',
        chunks: ['きんようびは', 'かいぎの', 'よていだよ。', 'かいぎな'], answer: ['きんようびは', 'かいぎの', 'よていだよ。'],
        explain: 'Noun + の + よていだ: かいぎの よてい. な goes after a な-adjective, not after a noun.' },
      { scene: 'Sakura tells Hinata her own plan.', en: 'I’m going to go back to my home town the month after next.',
        chunks: ['わたしは', 'さらいげつ', 'くにに', 'かえる', 'よていだよ。', 'かえった'], answer: ['わたしは', 'さらいげつ', 'くにに', 'かえる', 'よていだよ。'],
        explain: 'A plan takes the dictionary form: かえる よてい. かえった would be something already done.' }
    ],
    names: ['ヒナタ', 'サクラ'],
    uses: ['g:yotei-da', 'g:mitai', 'g:tai', 'g:naru', 'g:kara', 'g:ja-nai', 'g:tte', 'g:te-form', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:wo', 'v:さん|さん', 'v:下宿|げしゅく', 'v:いつ|いつ', 'v:住む|すむ', 'v:予定|よてい', 'v:さ来週|さらいしゅう', 'v:土曜日|どようび', 'v:荷物|にもつ', 'v:少ない|すくない', 'v:簡単|かんたん', 'v:計画|けいかく', 'v:ある|ある', 'v:その|その', 'v:日|ひ', 'v:私|わたし', 'v:都合|つごう', 'v:いい|いい', 'v:行く|いく', 'v:朝|あさ', 'v:起きる|おきる', 'v:それ|それ', 'v:だけ|だけ', 'v:机|つくえ', 'v:今度|こんど', 'v:買う|かう', 'v:さ来月|さらいげつ', 'v:じゃあ|じゃあ', 'v:貸す|かす', 'v:勉強|べんきょう', 'v:大事|だいじ', 'v:将来|しょうらい', 'v:人|ひと', 'v:なる|なる', 'k:日', 'k:行', 'k:貸'],
    notes: 'Moving thread (u011): Hinata moves in; Sakura (practical, a little bossy) lends him a desk. 予定 stays in kana (予 and 定 are N3 kanji).',
    verified: true }),

  L({ id: 'l:n4-dlg-tennis-lesson', format: 'dialogue',
    title: 'I can’t hit it', goal: 'You can say what you can and cannot do with the potential form.',
    scene: 'At the sports centre. Killua is teaching Emilia tennis. It is not going well.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Friend' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'killua', furigana: 'エミリアさん、テニス　できる？', en: 'Emilia, can you play tennis?' },
      { speaker: 'emilia', furigana: 'あまり……。わたしは　はやく　[走|はし]れないし、うんどうは　ちょっと……。', en: 'Not really... I can’t run fast, and sport is not my thing...' },
      { speaker: 'killua', furigana: 'じゃあ、[教|おし]える。おれが　なげるから、うって。', en: 'Then I’ll teach you. I’ll throw, you hit.' },
      { speaker: 'emilia', furigana: '……あ、はやすぎて　うてない！', en: '...Ah, it’s too fast, I can’t hit it!' },
      { speaker: 'killua', furigana: 'じゃあ、おそく　なげる。……これは　うてる？', en: 'Then I’ll throw slowly. ...Can you hit this one?' },
      { speaker: 'emilia', furigana: 'うてた！　……でも、そとに　[行|い]った。', en: 'I hit it! ...But it went out.' },
      { speaker: 'killua', furigana: 'はじめは　みんな　そうだよ。', en: 'Everyone’s like that at first.' },
      { speaker: 'emilia', furigana: 'キルアさんは　[何|なん]でも　できるね。じゅうどうも　できる？', en: 'You can do anything, Killua. Can you do judo too?' },
      { speaker: 'killua', furigana: 'できる。おとなも　なげられる。', en: 'I can. I can throw grown-ups, too.' },
      { speaker: 'emilia', furigana: 'じゃあ、こんどの　[試|し]あいは　キルアさんと　でたい。きっと　かてる！', en: 'Then I want to enter the next match with you. We’d win for sure!' }
    ],
    bridge: [
      { text: 'おれ', gloss: 'おれ = I, me (casual, used by boys and men)' }
    ],
    remixes: [
      { scene: 'Emilia tells Sakura about the sports centre.', en: 'Killua can swim very fast.',
        chunks: ['キルアさんは', 'とても', 'はやく', 'およげる。', 'およがれる。'], answer: ['キルアさんは', 'とても', 'はやく', 'およげる。'],
        explain: 'For an う-verb, the last sound moves to the e-row + る: およぐ → およげる. およがれる is not the potential form.' },
      { scene: 'Killua talks about a judo friend.', en: 'Sakura is strong, so I can’t throw her.',
        chunks: ['サクラさんは', 'つよくて', 'なげられない。', 'なげれない。'], answer: ['サクラさんは', 'つよくて', 'なげられない。'],
        explain: 'For a る-verb, る → られる: なげる → なげられる, なげられない. なげれない is heard in casual talk, but write られる.' }
    ],
    names: ['キルア', 'エミリア', 'サクラ'],
    uses: ['g:potential', 'g:sugiru', 'g:te-adj-noun', 'g:demo', 'g:shi', 'g:kara', 'g:to', 'g:ga', 'g:mo', 'g:ne', 'g:yo', 'g:ni', 'v:さん|さん', 'v:テニス|テニス', 'v:できる|できる', 'v:あまり|あまり', 'v:私|わたし', 'v:速い|はやい', 'v:走る|はしる', 'v:運動|うんどう', 'v:ちょっと|ちょっと', 'v:じゃあ|じゃあ', 'v:教える|おしえる', 'v:投げる|なげる', 'v:打つ|うつ', 'v:遅い|おそい', 'v:これ|これ', 'v:でも|でも', 'v:外|そと', 'v:行く|いく', 'v:初め|はじめ', 'v:みんな|みんな', 'v:そう|そう', 'v:何|なん', 'v:柔道|じゅうどう', 'v:大人|おとな', 'v:今度|こんど', 'v:試合|しあい', 'v:出る|でる', 'v:きっと|きっと', 'v:勝つ|かつ', 'k:走', 'k:教', 'k:行', 'k:何', 'k:試'],
    notes: 'Series nod: Killua is good at everything. おれ is not on the list until later: a bridge (Killua’s casual "I"). Potential forms here: 走れない, うてる / うてた, なげられる, かてる; only 走れない and なげられる are marked by the hl (kana stems need a listed kanji before them).',
    verified: true }),

  L({ id: 'l:n4-dlg-pharmacy-trainee', format: 'dialogue',
    title: 'A chance to learn', goal: 'You can say what someone can do, or what is possible, with 〜ことができる.',
    scene: 'Sakura, who helps at the hospital, visits Maomao’s pharmacy with a request.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Trainee nurse' } },
    lines: [
      { speaker: 'sakura', furigana: 'マオマオさん、おねがいが　あります。ここで　くすりの　[勉強|べんきょう]を　する　ことが　できますか。', en: 'Maomao, I have a favour to ask. Could I study medicine here?' },
      { speaker: 'maomao', furigana: '……くすりの　けいけんは　ありますか。', en: '...Do you have any experience with medicine?' },
      { speaker: 'sakura', furigana: 'はい。びょういんで　[一|いち][年|ねん]　はたらいた　ことが　あります。', en: 'Yes. I’ve worked at a hospital for a year.' },
      { speaker: 'maomao', furigana: '[何|なに]が　できますか。', en: 'What can you do?' },
      { speaker: 'sakura', furigana: 'ちゅうしゃを　する　ことが　できます。それに、[力|ちから]が　つよいです。', en: 'I can give injections. And I’m strong.' },
      { speaker: 'maomao', furigana: '[力|ちから]は　くすりに　いりません。……でも、いい　きかいです。らいしゅうから　[来|き]て　ください。', en: 'Strength is no use for medicine. ...But it’s a good chance. Come from next week.' },
      { speaker: 'sakura', furigana: 'ほんとうですか！　いっしょうけんめい　がんばります！', en: 'Really? I’ll do my very best!' },
      { speaker: 'maomao', furigana: 'ここでは　どくの　[勉強|べんきょう]も　する　ことが　できますよ。', en: 'Here you can study poisons too.' },
      { speaker: 'sakura', furigana: '……どく、ですか。', en: '...Poisons?' },
      { speaker: 'maomao', furigana: 'どくを　[知|し]る　ことは、くすりを　[知|し]る　ことです。', en: 'To know poisons is to know medicine.' }
    ],
    bridge: [
      { text: 'どく', gloss: 'どく = poison' }
    ],
    remixes: [
      { scene: 'At home, Sakura talks about her little sister.', en: 'My little sister can write kanji.',
        chunks: ['いもうとは', 'かんじを', 'かく', 'ことが　できる。', 'かいて'], answer: ['いもうとは', 'かんじを', 'かく', 'ことが　できる。'],
        explain: 'ことが できる follows the dictionary form: かく ことが できる. The て-form cannot go before こと.' },
      { scene: 'Maomao shows Sakura the rules of the workroom.', en: 'You can’t eat in this room.',
        chunks: ['この', 'へやでは', 'たべる', 'ことが', 'できません。', 'ことを'], answer: ['この', 'へやでは', 'たべる', 'ことが', 'できません。'],
        explain: 'The pattern is ことが できる, with が. ことを できる is wrong.' }
    ],
    names: ['マオマオ', 'サクラ'],
    uses: ['g:koto-ga-dekiru', 'g:ta-koto-ga-aru', 'g:koto', 'g:sore-ni', 'g:te-kudasai', 'g:de', 'g:no', 'g:wo', 'g:ga', 'g:ka', 'g:mo', 'g:ni', 'g:kara', 'g:yo', 'v:さん|さん', 'v:ある|ある', 'v:ここ|ここ', 'v:薬|くすり', 'v:勉強|べんきょう', 'v:する|する', 'v:事|こと', 'v:できる|できる', 'v:経験|けいけん', 'v:病院|びょういん', 'v:一|いち', 'v:年|ねん', 'v:働く|はたらく', 'v:何|なに', 'v:注射|ちゅうしゃ', 'v:それに|それに', 'v:力|ちから', 'v:強い|つよい', 'v:要る|いる', 'v:でも|でも', 'v:いい|いい', 'v:機会|きかい', 'v:来週|らいしゅう', 'v:来る|くる', 'v:ください|ください', 'v:ほんとう|ほんとう', 'v:一生懸命|いっしょうけんめい', 'v:頑張る|がんばる', 'v:知る|しる', 'k:勉', 'k:強', 'k:一', 'k:年', 'k:何', 'k:力', 'k:来', 'k:知'],
    notes: 'Series nods: Sakura is a medic and strong; Maomao loves poisons. どく is a bridge (as in u008, u009). いりません is the unit word 要る, N5.',
    verified: true }),

  L({ id: 'l:n4-dlg-recipe-notes', format: 'dialogue',
    title: 'Hard to read', goal: 'You can say something is easy or hard to do with 〜やすい and 〜にくい.',
    scene: 'Before service, Sanji hands Sasuke his notes for today’s dishes.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Kitchen hand' } },
    lines: [
      { speaker: 'sanji', furigana: 'サスケさん、これが　きょうの　[料理|りょうり]の　ノートです。', en: 'Sasuke, here are my notes for today’s dishes.' },
      { speaker: 'sasuke', furigana: '……[字|じ]が　[読|よ]みにくいです。', en: '...Your writing is hard to read.' },
      { speaker: 'sanji', furigana: 'え？　わたしの　[字|じ]は　きれいですよ。', en: 'What? My handwriting is beautiful.' },
      { speaker: 'sasuke', furigana: '……この　[字|じ]は　「しお」ですか、「さとう」ですか。', en: '...Does this say "salt" or "sugar"?' },
      { speaker: 'sanji', furigana: '……「さとう」です。けして、もう[一|いち]ど　[書|か]きます。', en: '..."Sugar". I’ll rub it out and write it again.' },
      { speaker: 'sasuke', furigana: '……この　ペンを　どうぞ。[書|か]きやすいです。', en: '...Use this pen. It’s easy to write with.' },
      { speaker: 'sanji', furigana: 'ありがとう。……はい、どうですか。', en: 'Thanks. ...There. How’s that?' },
      { speaker: 'sasuke', furigana: '……さっきより　[読|よ]みやすいです。', en: '...Easier to read than before.' },
      { speaker: 'sanji', furigana: 'よかった。でも、この　[料理|りょうり]の　なまえは　はつおんしにくいですよ。', en: 'Good. But the name of this dish is hard to pronounce.' },
      { speaker: 'sasuke', furigana: '……なまえより、あじが　だいじです。', en: '...The taste matters more than the name.' }
    ],
    remixes: [
      { scene: 'Sasuke tries the new chopsticks in the kitchen.', en: 'These chopsticks are easy to use.',
        chunks: ['この', 'はしは', 'つかいやすいです。', 'つかうやすいです。'], answer: ['この', 'はしは', 'つかいやすいです。'],
        explain: 'やすい joins the ます-stem: つかい + やすい. The dictionary form つかう cannot take やすい.' },
      { scene: 'Sanji brings an old dictionary of recipes to the kitchen.', en: 'This dictionary is heavy and hard to carry.',
        chunks: ['この', 'じてんは', 'おもくて', 'もちにくい。', 'もってにくい。'], answer: ['この', 'じてんは', 'おもくて', 'もちにくい。'],
        explain: 'にくい joins the ます-stem too: もち + にくい. The て-form cannot take にくい.' }
    ],
    names: ['サンジ', 'サスケ'],
    uses: ['g:yasui', 'g:nikui', 'g:te-form', 'g:no', 'g:ga', 'g:ka', 'g:de', 'g:wo', 'g:yo', 'g:wa-desu', 'v:さん|さん', 'v:これ|これ', 'v:今日|きょう', 'v:料理|りょうり', 'v:ノート|ノート', 'v:字|じ', 'v:読む|よむ', 'v:にくい|にくい', 'v:私|わたし', 'v:きれい|きれい', 'v:この|この', 'v:塩|しお', 'v:砂糖|さとう', 'v:消す|けす', 'v:もう一度|もういちど', 'v:書く|かく', 'v:ペン|ペン', 'v:どうぞ|どうぞ', 'v:やすい|やすい', 'v:どう|どう', 'v:さっき|さっき', 'v:より|より', 'v:いい|いい', 'v:でも|でも', 'v:名前|なまえ', 'v:発音|はつおん', 'v:する|する', 'v:味|あじ', 'v:大事|だいじ', 'k:料', 'k:理', 'k:字', 'k:読', 'k:一', 'k:書'],
    notes: 'Part-time job thread: Sasuke, blunt as ever, in Sanji’s kitchen.',
    verified: true }),
  L({ id: 'l:n4-dlg-old-fax', format: 'dialogue',
    title: 'The new computer', goal: 'You can talk about how to do something with 〜方.',
    scene: 'In the staff room, Kakashi-sensei calls Lelouch over to look at a computer that will not start.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'kakashi', furigana: 'ルルーシュさん、ちょっと　いいかな。この　パソコン、こしょうかも　しれない。', en: 'Lelouch, have you got a minute? This computer might be broken.' },
      { speaker: 'lelouch', furigana: 'こしょうですか。……[先生|せんせい]、ここを　おしましたか。', en: 'Broken? ...Sir, did you press this?' },
      { speaker: 'kakashi', furigana: 'ここ？　……おお。ほんとうは　パソコンの　[使|つか]い[方|かた]が　よく　わからないんだ。', en: 'This? ...Oh. The truth is, I don’t really know how to use a computer.' },
      { speaker: 'lelouch', furigana: 'では、[手紙|てがみ]の　[書|か]き[方|かた]を　せつめいしましょうか。', en: 'Then shall I explain how to write a letter on it?' },
      { speaker: 'kakashi', furigana: 'たのむよ。むかしは　ワープロを　うまく　[使|つか]って　いたんだけどね。', en: 'Please. I used to be good with a word processor, you know.' },
      { speaker: 'lelouch', furigana: 'ワープロ……ファックスも　[使|つか]って　いましたか。', en: 'A word processor... Did you use a fax machine too?' },
      { speaker: 'kakashi', furigana: 'ああ。ファックスは　いまでも　じょうずだよ。', en: 'Yes. I’m still good with a fax machine.' },
      { speaker: 'lelouch', furigana: 'コンピューターは　ファックスより　かんたんですよ。ここを　[見|み]て　ください。', en: 'A computer is easier than a fax machine. Look here, please.' },
      { speaker: 'kakashi', furigana: 'はい、はい。……きみの　せつめいの　しかたは　うまいね。いい　[先生|せんせい]に　なれるよ。', en: 'Yes, yes. ...You explain things well. You could be a good teacher.' },
      { speaker: 'lelouch', furigana: '……でも、[手紙|てがみ]は　[先生|せんせい]が　[書|か]いて　くださいね。', en: '...All the same, you write the letter yourself, sir.' }
    ],
    remixes: [
      { scene: 'Kakashi wants to make the homework sheets on the computer, too.', en: 'Please teach me how to make the homework sheets.',
        chunks: ['しゅくだいの', 'つくりかたを', 'おしえて　ください。', 'つくるかたを'], answer: ['しゅくだいの', 'つくりかたを', 'おしえて　ください。'],
        explain: '方 (かた) joins the ます-stem: つくり + かた = how to make. The dictionary form つくる cannot take かた.' },
      { scene: 'Lelouch asks Kakashi about swimming lessons when he was young.', en: 'Who taught you how to swim?',
        chunks: ['だれに', 'およぎかたを', 'ならいましたか。', 'およぐかたを'], answer: ['だれに', 'およぎかたを', 'ならいましたか。'],
        explain: 'およぎかた (泳ぎ方) is the ます-stem およぎ + かた: the way of swimming. およぐかた is not a word.' }
    ],
    names: ['カカシ', 'ルルーシュ'],
    uses: ['g:kata', 'g:kamo-shirenai', 'g:ka', 'g:te-kudasai', 'g:no', 'g:wo', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'g:mashou-ka', 'g:n-desu', 'g:kedo', 'g:te-ita', 'g:potential', 'g:naru', 'v:さん|さん', 'v:ちょっと|ちょっと', 'v:いい|いい', 'v:この|この', 'v:パソコン|パソコン', 'v:故障|こしょう', 'v:先生|せんせい', 'v:ここ|ここ', 'v:押す|おす', 'v:ほんとう|ほんとう', 'v:使う|つかう', 'v:よく|よく', 'v:分かる|わかる', 'v:では|では', 'v:手紙|てがみ', 'v:書く|かく', 'v:説明|せつめい', 'v:する|する', 'v:頼む|たのむ', 'v:昔|むかし', 'v:ワープロ|ワープロ', 'v:うまい|うまい', 'v:ファックス|ファックス', 'v:今|いま', 'v:上手|じょうず', 'v:コンピューター|コンピューター', 'v:より|より', 'v:簡単|かんたん', 'v:見る|みる', 'v:君|きみ', 'v:仕方|しかた', 'v:なる|なる', 'v:でも|でも', 'k:先', 'k:生', 'k:使', 'k:方', 'k:手', 'k:紙', 'k:書', 'k:見'],
    notes: 'Kakashi is a fan of old machines; Lelouch tutors the teacher. The "try to get the student to do it" beat is Kakashi’s lazy streak.',
    verified: true }),

  L({ id: 'l:n4-dlg-moving-day', format: 'dialogue',
    title: 'Moving day', goal: 'You can offer to do something for someone with 〜てあげる.',
    scene: 'Hinata moves into his boarding house. Gojo-sensei turns up to help.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'ヒナタさん、きょう　ひっこすんだよね。てつだいに　[来|き]たよ。', en: 'Hinata, you’re moving today, right? I came to help.' },
      { speaker: 'hinata', furigana: 'ゴジョウ[先生|せんせい]！　ありがとうございます！　にもつは　ふとんと　はこ　[三|みっ]つだけです。', en: 'Gojo-sensei! Thank you! All I have is a futon and three boxes.' },
      { speaker: 'gojo', furigana: 'じゃあ、ふとんは　はこんで　あげるよ。', en: 'Then I’ll carry the futon for you.' },
      { speaker: 'hinata', furigana: 'えっ、おもいですよ！', en: 'What? It’s heavy!' },
      { speaker: 'gojo', furigana: 'だいじょうぶ。ちからは　つよいから。', en: 'No problem. I’m strong.' },
      { speaker: 'hinata', furigana: 'わあ……。じゃあ、わたしは　たなを　かたづけます。', en: 'Wow... Then I’ll tidy the shelves.' },
      { speaker: 'gojo', furigana: 'この　ふるい　ざっしは　すてて　あげる。', en: 'I’ll throw away these old magazines for you.' },
      { speaker: 'hinata', furigana: 'すてないで　ください！　だいじな　ざっしなんです。', en: 'Please don’t throw them away! They’re important magazines.' },
      { speaker: 'gojo', furigana: 'はいはい。……お、たたみの　へやだね。ちょっと　ねても　いい？', en: 'Okay, okay. ...Oh, a tatami room. Mind if I lie down for a bit?' },
      { speaker: 'hinata', furigana: 'だめです！　ふとんを　はこんで　あげるって　[言|い]いましたよね！', en: 'No! You said you’d carry the futon for me!' }
    ],
    remixes: [
      { scene: 'Gojo offers to take the boxes up as well.', en: 'I’ll carry the boxes for you too.',
        chunks: ['はこも', 'はこんで', 'あげるよ。', 'はこぶ'], answer: ['はこも', 'はこんで', 'あげるよ。'],
        explain: 'あげる follows the て-form: はこぶ → はこんで あげる (carry it for you).' },
      { scene: 'Hinata helps the girl next door, who is moving out.', en: 'I’ll tidy up your room for you.',
        chunks: ['へやを', 'かたづけて', 'あげます。', 'かたづける'], answer: ['へやを', 'かたづけて', 'あげます。'],
        explain: 'The favour is the て-form + あげる: かたづけて あげます. Don’t use it to a teacher or a boss: it sounds like you are doing them a big favour.' }
    ],
    names: ['ゴジョウ', 'ヒナタ'],
    uses: ['g:te-ageru', 'g:n-desu', 'g:yo', 'g:ne', 'g:wa-desu', 'g:to', 'g:dake', 'g:kara', 'g:wo', 'g:no', 'g:te-mo-ii', 'g:nai-de-kudasai', 'g:tte', 'g:adj-na', 'v:さん|さん', 'v:今日|きょう', 'v:引っ越す|ひっこす', 'v:手伝う|てつだう', 'v:来る|くる', 'v:先生|せんせい', 'v:荷物|にもつ', 'v:布団|ふとん', 'v:箱|はこ', 'v:三つ|みっつ', 'v:じゃあ|じゃあ', 'v:運ぶ|はこぶ', 'v:重い|おもい', 'v:大丈夫|だいじょうぶ', 'v:力|ちから', 'v:強い|つよい', 'v:私|わたし', 'v:棚|たな', 'v:片付ける|かたづける', 'v:この|この', 'v:古い|ふるい', 'v:雑誌|ざっし', 'v:捨てる|すてる', 'v:大事|だいじ', 'v:畳|たたみ', 'v:部屋|へや', 'v:ちょっと|ちょっと', 'v:寝る|ねる', 'v:だめ|だめ', 'v:言う|いう', 'k:来', 'k:先', 'k:生', 'k:三', 'k:言'],
    notes: 'Moving thread (batch 1 u011, u031): moving day. Gojo strong and lazy at once.',
    verified: true }),

  L({ id: 'l:n4-dlg-moving-helpers', format: 'dialogue',
    title: 'Everyone helped', goal: 'You can say what someone did for you with 〜てくれる.',
    scene: 'After the weekend, Lelouch asks Hinata how his move went.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'lelouch', furigana: 'ヒナタさん、[新|あたら]しい　へやは　どう？', en: 'Hinata, how’s your new room?' },
      { speaker: 'hinata', furigana: 'いいよ！　ひっこす　[日|ひ]は　みんなが　てつだってくれた。とても　はやく　おわった。', en: 'It’s great! Everyone helped me on moving day. It was over really fast.' },
      { speaker: 'lelouch', furigana: 'みんなって？', en: 'Who’s "everyone"?' },
      { speaker: 'hinata', furigana: 'ゴジョウ[先生|せんせい]が　ふとんを　はこんで　くれたし、サクラさんが　つくえを　とどけてくれた。', en: 'Gojo-sensei carried my futon, and Sakura brought me a desk.' },
      { speaker: 'lelouch', furigana: 'しんせつな　[人|ひと]たちだね。サスケさんは？', en: 'Kind people. And Sasuke?' },
      { speaker: 'hinata', furigana: 'サスケさんは　えきまで　むかえに　[来|き]て　くれた。みちが　わからなかったから。', en: 'Sasuke came to meet me at the station. I didn’t know the way.' },
      { speaker: 'lelouch', furigana: 'やさしいな。きみは　みんなの　せわに　なって　いるね。', en: 'That’s kind of him. Everyone is looking after you.' },
      { speaker: 'hinata', furigana: 'うん、みんなの　おかげ！　こんどは　ルルーシュさんも　あそびに　[来|き]て。', en: 'Yeah, thanks to everyone! Next time you come over too, Lelouch.' },
      { speaker: 'lelouch', furigana: 'では、チェスを　しに　[行|い]くよ。', en: 'Then I’ll come over to play chess.' },
      { speaker: 'hinata', furigana: 'チェス？　……じゃあ、やり[方|かた]を　おしえて　くれない？', en: 'Chess? ...Then will you teach me how to play?' }
    ],
    bridge: [
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Hinata remembers who found him the room.', en: 'Nami found the room for me.',
        chunks: ['ナミさんが', 'へやを', 'みつけて', 'くれた。', 'あげた。'], answer: ['ナミさんが', 'へやを', 'みつけて', 'くれた。'],
        explain: 'Someone did it for me: て-form + くれる. あげる is for a favour going from me (or us) to someone else.' },
      { scene: 'Hinata tells Lelouch about the boxes.', en: 'Sasuke carried the boxes for me.',
        chunks: ['サスケさんが', 'はこを', 'はこんで', 'くれた。', 'はこぶ'], answer: ['サスケさんが', 'はこを', 'はこんで', 'くれた。'],
        explain: 'くれる follows the て-form: はこぶ → はこんで くれた. The giver (サスケさん) takes が.' }
    ],
    names: ['ヒナタ', 'ルルーシュ', 'ゴジョウ', 'サクラ', 'サスケ', 'ナミ'],
    uses: ['g:te-kureru', 'g:ni-iku', 'g:tte', 'g:shi', 'g:kara', 'g:made', 'g:te-iru', 'g:te-form', 'g:ga', 'g:wo', 'g:no', 'g:mo', 'g:yo', 'g:ne', 'g:naru', 'g:kata', 'g:adj-na', 'v:さん|さん', 'v:新しい|あたらしい', 'v:部屋|へや', 'v:どう|どう', 'v:いい|いい', 'v:引っ越す|ひっこす', 'v:日|ひ', 'v:みんな|みんな', 'v:手伝う|てつだう', 'v:とても|とても', 'v:早い|はやい', 'v:終わる|おわる', 'v:先生|せんせい', 'v:布団|ふとん', 'v:運ぶ|はこぶ', 'v:机|つくえ', 'v:届ける|とどける', 'v:親切|しんせつ', 'v:人|ひと', 'v:たち|たち', 'v:駅|えき', 'v:迎える|むかえる', 'v:来る|くる', 'v:道|みち', 'v:分かる|わかる', 'v:優しい|やさしい', 'v:君|きみ', 'v:世話|せわ', 'v:なる|なる', 'v:おかげ|おかげ', 'v:今度|こんど', 'v:遊ぶ|あそぶ', 'v:では|では', 'v:行く|いく', 'v:じゃあ|じゃあ', 'v:やる|やる', 'v:教える|おしえる', 'k:新', 'k:日', 'k:先', 'k:生', 'k:人', 'k:来', 'k:行', 'k:方'],
    notes: 'Moving thread: Gojo carried the futon (u037), Sakura’s desk (u031), Sasuke met him at the station. チェス is a bridge (as in batch 1 u025).',
    verified: true }),

  L({ id: 'l:n4-dlg-homework-senior', format: 'dialogue',
    title: 'Ask a senior', goal: 'You can ask someone to do something for you with 〜てもらう.',
    scene: 'Anya brings her homework to Killua, who is older and, she has decided, her senior.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Older friend' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'anya', furigana: 'キルアさんは　アーニャの　せんぱい。たのみたい　ことが　ある。', en: 'Killua, you are Anya’s senior. Anya has something to ask you.' },
      { speaker: 'killua', furigana: 'なに？　また　しゅくだい？', en: 'What? Homework again?' },
      { speaker: 'anya', furigana: 'うん。しゅくだいの　こたえ、しらべて　もらえる？', en: 'Yes. Can you look up the answers to my homework for me?', say: 'うん。宿題の答え、調べてもらえる？' },
      { speaker: 'killua', furigana: 'それは　アーニャさんの　しごとだろ。', en: 'That’s your job, isn’t it?' },
      { speaker: 'anya', furigana: 'ちちは　いそがしくて、なおして　もらえなかった。', en: 'Papa was busy, so Anya couldn’t get him to correct it.' },
      { speaker: 'killua', furigana: '……しかたないな。まちがえた　ところを　おしえて　あげる。でも、なおすのは　じぶんで。', en: '...Oh, all right. I’ll show you where you went wrong. But you fix it yourself.' },
      { speaker: 'anya', furigana: 'わかった！　キルアさん、やさしい。', en: 'Okay! Killua is kind.' },
      { speaker: 'killua', furigana: 'あしたの　よしゅうと、きょうの　ふくしゅうも　して。', en: 'And do tomorrow’s preparation and today’s review too.' },
      { speaker: 'anya', furigana: 'よしゅうも……キルアさんに　して　もらえる？　ピーナッツ　あげる。', en: 'The preparation too... Can Killua do it for Anya? Anya will give you peanuts.' },
      { speaker: 'killua', furigana: '……ピーナッツは　いらない。よしゅうは　じぶんで　しなくちゃ。', en: '...I don’t want peanuts. You have to do your own preparation.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'At home, Anya asks Yor to read her diary.', en: 'Mama, can you read my diary for me?',
        chunks: ['はは、', 'にっきを', 'よんで', 'もらえる？', 'よむ'], answer: ['はは、', 'にっきを', 'よんで', 'もらえる？'],
        explain: 'もらう follows the て-form: よむ → よんで もらう (get someone to read). もらえる？ asks "can I get you to…?"' },
      { scene: 'Killua remembers how he learned the way to the station.', en: 'I got Gon to show me the way.',
        chunks: ['ゴンに', 'みちを', 'おしえて', 'もらった。', 'ゴンが'], answer: ['ゴンに', 'みちを', 'おしえて', 'もらった。'],
        explain: 'With もらう the person who does the favour takes に: ゴンに おしえて もらった. With が, Gon would be the one receiving.' }
    ],
    names: ['キルア', 'アーニャ', 'ゴン'],
    uses: ['g:te-morau', 'g:te-ageru', 'g:potential', 'g:nakucha-ikenai', 'g:te-adj-noun', 'g:ga-arimasu', 'g:no', 'g:wo', 'g:ni', 'g:mo', 'g:to', 'g:noun-modifier', 'v:さん|さん', 'v:先輩|せんぱい', 'v:頼む|たのむ', 'v:事|こと', 'v:何|なに', 'v:また|また', 'v:宿題|しゅくだい', 'v:答|こたえ', 'v:調べる|しらべる', 'v:もらう|もらう', 'v:それ|それ', 'v:仕事|しごと', 'v:父|ちち', 'v:忙しい|いそがしい', 'v:直す|なおす', 'v:仕方|しかた', 'v:間違える|まちがえる', 'v:所|ところ', 'v:教える|おしえる', 'v:でも|でも', 'v:自分|じぶん', 'v:分かる|わかる', 'v:優しい|やさしい', 'v:明日|あした', 'v:予習|よしゅう', 'v:今日|きょう', 'v:復習|ふくしゅう', 'v:する|する', 'v:あげる|あげる', 'v:要る|いる'],
    notes: 'Anya’s school thread. ちち = Loid (allowed as a family word). The swap names Gon (allowed list).',
    verified: true }),

  L({ id: 'l:n4-dlg-sick-visit', format: 'dialogue',
    title: 'A get-well visit', goal: 'You can thank someone with 〜てくれてありがとう and apologise with 〜てすみません / 〜てごめん.',
    scene: 'Sasuke has a fever. Sakura comes to see him.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'サスケさん、おみまいに　[来|き]たよ。おじゃまします。', en: 'Sasuke, I came to see how you are. Sorry to barge in.' },
      { speaker: 'sasuke', furigana: '……[来|き]て　くれてありがとう。', en: '...Thanks for coming.' },
      { speaker: 'sakura', furigana: 'ねつは　どう？　くすりは　[飲|の]んだ？', en: 'How’s the fever? Did you take your medicine?' },
      { speaker: 'sasuke', furigana: '……[飲|の]んだ。きのう、ねつが　あったけど　[店|みせ]に　[行|い]った。', en: '...I did. Yesterday I had a fever, but I went to the restaurant.' },
      { speaker: 'sakura', furigana: 'えっ！　サンジさん、しかったでしょう？', en: 'What! Sanji must have told you off, right?' },
      { speaker: 'sasuke', furigana: '……ああ。だから、「むりを　して　すみません」って　あやまった。', en: '...Yeah. So I apologised: "Sorry for pushing myself."' },
      { speaker: 'sakura', furigana: 'よく　できました。じゃあ、ほめて　あげる。', en: 'Well done. Then I’ll give you some praise.' },
      { speaker: 'sasuke', furigana: '……サクラさんにも。しんぱいを　かけて　ごめん。', en: '...You too. Sorry for worrying you.' },
      { speaker: 'sakura', furigana: 'いいよ。はい、トマト。おれいは　げんきに　なってから　ね。', en: 'It’s fine. Here, tomatoes. You can thank me when you’re better.' },
      { speaker: 'sasuke', furigana: '……トマトの　おかげで、もう　げんきに　なった。', en: '...Thanks to the tomatoes, I’m already better.' }
    ],
    bridge: [
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Sasuke remembers Sakura phoned him in the morning.', en: 'Thanks for calling me this morning.',
        chunks: ['けさ', 'でんわして', 'くれて', 'ありがとう。', 'あげて'], answer: ['けさ', 'でんわして', 'くれて', 'ありがとう。'],
        explain: 'Thanking someone for what they did for you: て-form + くれて + ありがとう. あげて would mean you did it for them.' },
      { scene: 'Sasuke also missed their date last week.', en: 'Sorry I was late last week.',
        chunks: ['せんしゅうは', 'おそく', 'なって', 'ごめん。', 'なったから'], answer: ['せんしゅうは', 'おそく', 'なって', 'ごめん。'],
        explain: 'Apologising for what you did: て-form + ごめん (or すみません). The reason is in the て-form, not in から.' }
    ],
    names: ['サクラ', 'サスケ', 'サンジ'],
    uses: ['g:te-kurete-arigatou', 'g:te-sumimasen', 'g:te-ageru', 'g:te-kara', 'g:deshou', 'g:tte', 'g:naru', 'g:kedo', 'g:tte', 'g:potential', 'g:wo', 'g:ga', 'g:ni', 'g:no', 'g:de', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:お見舞い|おみまい', 'v:来る|くる', 'v:邪魔|じゃま', 'v:熱|ねつ', 'v:どう|どう', 'v:薬|くすり', 'v:飲む|のむ', 'v:昨日|きのう', 'v:ある|ある', 'v:店|みせ', 'v:行く|いく', 'v:叱る|しかる', 'v:謝る|あやまる', 'v:無理|むり', 'v:する|する', 'v:よく|よく', 'v:できる|できる', 'v:じゃあ|じゃあ', 'v:ほめる|ほめる', 'v:心配|しんぱい', 'v:かける|かける', 'v:いい|いい', 'v:お礼|おれい', 'v:元気|げんき', 'v:なる|なる', 'v:おかげ|おかげ', 'v:もう|もう', 'v:だから|だから', 'k:来', 'k:飲', 'k:店', 'k:行'],
    notes: 'Sasuke + Sakura thread; part-time job thread (Sanji scolds Sasuke for working with a fever). トマト is a bridge (batch 1 u015).',
    verified: true }),

  L({ id: 'l:n4-dlg-front-desk', format: 'dialogue',
    title: 'At the front desk', goal: 'You can make a very polite request with 〜ていただけませんか.',
    scene: 'Nami brings a map she drew to a company office. Yor is at the front desk.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Receptionist' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Visitor' } },
    lines: [
      { speaker: 'nami', furigana: 'すみません。この　じむしょの　うけつけは　どこですか。', en: 'Excuse me. Where is the front desk of this office?' },
      { speaker: 'yor', furigana: 'はい、うけつけは　こちらです。どんな　ごようですか。', en: 'Yes, this is the front desk. How can I help you?' },
      { speaker: 'nami', furigana: 'しゃちょうさんに　ちずを　とどけに　[来|き]ました。わたして　いただけませんか。', en: 'I’ve come to deliver a map to the company president. Could you possibly hand it to him?' },
      { speaker: 'yor', furigana: 'はい。では、こちらに　お[名前|なまえ]と　ごじゅうしょを　[書|か]いて　いただけますか。', en: 'Certainly. Then could you write your name and address here?' },
      { speaker: 'nami', furigana: 'はい。……それと、もう[一|ひと]つ　ようじが　あるんです。', en: 'Sure. ...And I have one more thing to take care of.' },
      { speaker: 'yor', furigana: 'どんな　ごようじですか。', en: 'What would that be?' },
      { speaker: 'nami', furigana: 'ちずの　おかねです。きょう　いただけますか。', en: 'The money for the map. Can I have it today?' },
      { speaker: 'yor', furigana: 'あの……ちずを　[先|さき]に　チェックしても　いいですか。', en: 'Um... may I check the map first?' },
      { speaker: 'nami', furigana: 'どうぞ。とても　いい　ちずですよ。[三|さん][万|まん][円|えん]です。', en: 'Go ahead. It’s a very good map. Thirty thousand yen.' },
      { speaker: 'yor', furigana: 'さ、さんまん……。ちょっと　[待|ま]って　いて　いただけませんか。', en: 'Th-thirty thousand... Could you possibly wait a moment?' }
    ],
    remixes: [
      { scene: 'The president is out, so Yor asks Nami about another day.', en: 'Could you possibly come again tomorrow?',
        chunks: ['あした', 'また', 'きて', 'いただけませんか。', 'くて'], answer: ['あした', 'また', 'きて', 'いただけませんか。'],
        explain: 'いただけませんか follows the て-form: くる → きて. くて is not a form of くる.' },
      { scene: 'Nami asks Yor for the president’s answer by phone.', en: 'Could you possibly phone me tonight?',
        chunks: ['こんばん', 'でんわして', 'いただけませんか。', 'でんわする'], answer: ['こんばん', 'でんわして', 'いただけませんか。'],
        explain: 'The very polite request is the て-form + いただけませんか: でんわして いただけませんか.' }
    ],
    names: ['ヨル', 'ナミ'],
    uses: ['g:te-itadakemasen-ka', 'g:te-mo-ii', 'g:n-desu', 'g:wa-desu', 'g:ka', 'g:no', 'g:wo', 'g:ni', 'g:to', 'g:ga', 'g:yo', 'v:この|この', 'v:事務所|じむしょ', 'v:受付|うけつけ', 'v:どこ|どこ', 'v:こちら|こちら', 'v:どんな|どんな', 'v:用|よう', 'v:社長|しゃちょう', 'v:さん|さん', 'v:地図|ちず', 'v:届ける|とどける', 'v:来る|くる', 'v:渡す|わたす', 'v:では|では', 'v:名前|なまえ', 'v:住所|じゅうしょ', 'v:書く|かく', 'v:それ|それ', 'v:もう|もう', 'v:一つ|ひとつ', 'v:用事|ようじ', 'v:ある|ある', 'v:お金|おかね', 'v:今日|きょう', 'v:頂く|いただく', 'v:あの|あの', 'v:先|さき', 'v:チェック|チェック', 'v:する|する', 'v:どうぞ|どうぞ', 'v:とても|とても', 'v:いい|いい', 'v:三|さん', 'v:万|まん', 'v:円|えん', 'v:ちょっと|ちょっと', 'v:待つ|まつ', 'k:来', 'k:名', 'k:前', 'k:書', 'k:一', 'k:先', 'k:三', 'k:万', 'k:円', 'k:待'],
    notes: 'Nami’s money nod. Yor is polite, not keigo (the keigo block comes last).',
    verified: true }),

  L({ id: 'l:n4-dlg-festival-glad', format: 'dialogue',
    title: 'Glad I went', goal: 'You can say you are glad you did something with 〜てよかった.',
    scene: 'After the summer holiday, Gojo-sensei asks Emilia about her trip to the sea with Nami.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'エミリアさん、うみの　りょこうは　どうだった？', en: 'Emilia, how was your trip to the sea?' },
      { speaker: 'emilia', furigana: 'とても　たのしかったです。[行|い]って　よかったです！', en: 'It was so much fun. I’m glad I went!' },
      { speaker: 'gojo', furigana: 'いちばん　よかったのは？', en: 'What was the best part?' },
      { speaker: 'emilia', furigana: 'まちの　おまつりです。ナミさんと　かいじょうまで　[歩|ある]きました。', en: 'The town festival. Nami and I walked to the grounds.' },
      { speaker: 'gojo', furigana: 'うみは　[見|み]えた？', en: 'Could you see the sea?' },
      { speaker: 'emilia', furigana: 'はい、よく　[見|み]えました。ナミさんが　いい　ばしょを　[知|し]って　いて　よかったです。', en: 'Yes, very well. It’s lucky Nami knew a good spot.' },
      { speaker: 'gojo', furigana: 'いいなあ。わたしは　しごとで、コンサートにも　[行|い]けなかったよ。', en: 'Lucky you. I had work, so I couldn’t even go to a concert.' },
      { speaker: 'emilia', furigana: 'ざんねんでしたね。あ、[先生|せんせい]に　おみやげが　あります。まちの　おかしです。', en: 'That’s a shame. Oh, I have a souvenir for you, sir. Sweets from the town.' },
      { speaker: 'gojo', furigana: 'ほんとう？　あまい　もの、だいすき。きょう　[学校|がっこう]に　[来|き]て　よかった。', en: 'Really? I love sweet things. I’m glad I came to school today.' },
      { speaker: 'emilia', furigana: 'みんなにも　ありますから、[一|ひと]つだけですよ。', en: 'There are some for everyone else too, so just one, please.' }
    ],
    remixes: [
      { scene: 'Emilia tells Gojo about the weather on the trip.', en: 'I’m glad the weather was good.',
        chunks: ['てんきが', 'よくて', 'よかったです。', 'いいくて'], answer: ['てんきが', 'よくて', 'よかったです。'],
        explain: 'An adjective takes くて before よかった, and いい becomes よくて. いいくて is not a form.' },
      { scene: 'Gojo looks around the class on the first day back.', en: 'I’m glad everyone is well.',
        chunks: ['みんな', 'げんきで', 'よかった。', 'げんきだ'], answer: ['みんな', 'げんきで', 'よかった。'],
        explain: 'A noun or な-adjective takes で before よかった: げんきで よかった.' }
    ],
    names: ['ゴジョウ', 'エミリア', 'ナミ'],
    uses: ['g:te-yokatta', 'g:adj-i', 'g:no', 'g:to', 'g:made', 'g:te-iru', 'g:potential', 'g:de', 'g:kara', 'g:dake', 'g:wa-desu', 'g:mo', 'g:ni', 'g:yo', 'g:ne', 'v:さん|さん', 'v:海|うみ', 'v:旅行|りょこう', 'v:どう|どう', 'v:とても|とても', 'v:楽しい|たのしい', 'v:行く|いく', 'v:いい|いい', 'v:一番|いちばん', 'v:町|まち', 'v:お祭り|おまつり', 'v:会場|かいじょう', 'v:歩く|あるく', 'v:見える|みえる', 'v:よく|よく', 'v:場所|ばしょ', 'v:知る|しる', 'v:私|わたし', 'v:仕事|しごと', 'v:コンサート|コンサート', 'v:残念|ざんねん', 'v:先生|せんせい', 'v:お土産|おみやげ', 'v:ある|ある', 'v:お菓子|おかし', 'v:ほんとう|ほんとう', 'v:甘い|あまい', 'v:物|もの', 'v:大好き|だいすき', 'v:今日|きょう', 'v:学校|がっこう', 'v:来る|くる', 'v:みんな|みんな', 'v:一つ|ひとつ', 'k:行', 'k:歩', 'k:見', 'k:知', 'k:先', 'k:生', 'k:学', 'k:校', 'k:来', 'k:一'],
    notes: 'Trip thread: Emilia and Nami’s sea trip (batch 1 u001, u012, u026) is over. Gojo and sweets.',
    verified: true }),

  L({ id: 'l:n4-dlg-opening-time', format: 'dialogue',
    title: 'Not open yet', goal: 'You can tell "it opens" from "I open it" (intransitive and transitive verbs).',
    scene: 'Nami is outside Sanji’s restaurant before it opens. Sanji comes to the door.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Customer' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' } },
    lines: [
      { speaker: 'nami', furigana: 'サンジさん、まだ　[店|みせ]が　[開|あ]いて　いないの？　はやく　[食|た]べたい！', en: 'Sanji, the restaurant isn’t open yet? I want to eat now!' },
      { speaker: 'sanji', furigana: 'ナミさん！　すこし　[下|さ]がって　ください。いま　ドアを　[開|あ]けます。', en: 'Nami! Please step back a little. I’m opening the door now.' },
      { speaker: 'nami', furigana: 'きょうの　りょうりは　かわった？', en: 'Have the dishes changed today?' },
      { speaker: 'sanji', furigana: 'はい。あきの　りょうりに　かえました。', en: 'Yes. I changed them to autumn dishes.' },
      { speaker: 'nami', furigana: 'おかねは？　やすく　なった？', en: 'And the prices? Did they get cheaper?' },
      { speaker: 'sanji', furigana: 'いいえ……[肉|にく]が　たかく　なったんです。', en: 'No... meat has got more expensive.' },
      { speaker: 'nami', furigana: 'じゃあ、わたしだけ　やすく　して。', en: 'Then make it cheaper just for me.' },
      { speaker: 'sanji', furigana: 'う……。では、きょうは　とくべつに　ケーキも　だします。', en: 'Ugh... All right, today I’ll serve you a cake as well, specially.' },
      { speaker: 'nami', furigana: 'やった！　じゃあ、はやく　りょうりを　[始|はじ]めて。', en: 'Yes! Then start cooking, quick.' },
      { speaker: 'sanji', furigana: 'はい！　……あ、まだ　[電気|でんき]を　つけて　いなかった。', en: 'Right away! ...Oh, I hadn’t even turned on the lights.' }
    ],
    unmark: [
      { text: '開', ctx: '開いて' }
    ],
    remixes: [
      { scene: 'Sanji looks at the clock on the wall.', en: 'Lunch starts at eleven.',
        chunks: ['ひるごはんは', 'じゅういちじに', 'はじまります。', 'はじめます。'], answer: ['ひるごはんは', 'じゅういちじに', 'はじまります。'],
        explain: 'Lunch starts by itself: はじまる (intransitive, with が / は). はじめる needs someone who starts something (を).' },
      { scene: 'Inside, Nami finds the restaurant too warm.', en: 'Please open the window.',
        chunks: ['まどを', 'あけて', 'ください。', 'あいて'], answer: ['まどを', 'あけて', 'ください。'],
        explain: 'Someone opens it: まどを あける (transitive). まどが あく is the window opening by itself.' }
    ],
    names: ['ナミ', 'サンジ'],
    uses: ['g:jidoushi-tadoushi', 'g:te-iru', 'g:tai', 'g:naru', 'g:n-desu', 'g:dake', 'g:te-form', 'g:mada', 'g:no', 'g:wo', 'g:ga', 'g:ni', 'g:mo', 'v:さん|さん', 'v:まだ|まだ', 'v:店|みせ', 'v:開く|あく', 'v:早い|はやい', 'v:食べる|たべる', 'v:少し|すこし', 'v:下がる|さがる', 'v:ください|ください', 'v:今|いま', 'v:ドア|ドア', 'v:開ける|あける', 'v:今日|きょう', 'v:料理|りょうり', 'v:変わる|かわる', 'v:秋|あき', 'v:変える|かえる', 'v:お金|おかね', 'v:安い|やすい', 'v:肉|にく', 'v:高い|たかい', 'v:なる|なる', 'v:じゃあ|じゃあ', 'v:私|わたし', 'v:する|する', 'v:では|では', 'v:特別|とくべつ', 'v:ケーキ|ケーキ', 'v:出す|だす', 'v:始める|はじめる', 'v:電気|でんき', 'v:つける|つける', 'k:店', 'k:開', 'k:食', 'k:下', 'k:肉', 'k:始', 'k:電', 'k:気'],
    notes: 'Nami haggles (money nod). 開いて is the N5 あく, not the unit word ひらく: unmarked.',
    verified: true }),

  L({ id: 'l:n4-dlg-party-ready', format: 'dialogue',
    title: 'All set for the party', goal: 'You can describe things that have been done on purpose with 〜てある.',
    scene: 'Killua arrives early for Anya’s birthday party. Yor shows him in.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Host parent' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Guest' } },
    lines: [
      { speaker: 'killua', furigana: 'おじゃまします。……へやが　きれいに　かざって　ある。', en: 'Sorry to bother you. ...The room is all nicely decorated.' },
      { speaker: 'yor', furigana: 'キルアさん、どうぞ　[入|はい]って　ください。きょうは　アーニャさんの　たんじょうびですから。', en: 'Killua, come in, please. Today is Anya’s birthday, after all.' },
      { speaker: 'killua', furigana: 'まどの　ガラスに　[紙|かみ]の　はなが　はって　ある。', en: 'There are paper flowers stuck on the window glass.' },
      { speaker: 'yor', furigana: 'アーニャさんが　[作|つく]ったんです。テーブルには　ケーキも　おいて　あります。', en: 'Anya made them. There’s a cake on the table too.' },
      { speaker: 'killua', furigana: '……ヨルさんが　[作|つく]った　ケーキ？', en: '...A cake you made?' },
      { speaker: 'yor', furigana: 'いいえ、サンジさんの　お[店|みせ]で　かいました。', en: 'No, I bought it at Sanji’s restaurant.' },
      { speaker: 'killua', furigana: 'よかった。……でも、この　へや、ちょっと　あつくない？', en: 'Phew. ...But isn’t this room a bit hot?' },
      { speaker: 'yor', furigana: 'あ、だんぼうが　ついて　いますね。れいぼうに　かえます。', en: 'Oh, the heating is on. I’ll switch to the air conditioning.' },
      { speaker: 'killua', furigana: 'でんとうは　つけて　あるけど、カーテンは　しめて　あるね。', en: 'The lights are on, but the curtains are closed.' },
      { speaker: 'yor', furigana: 'はい。アーニャさんが　かえるまで、[言|い]わないで　くださいね。', en: 'Yes. Please don’t tell Anya until she gets home.', say: 'はい。アーニャさんが帰るまで、言わないでくださいね。' }
    ],
    remixes: [
      { scene: 'Killua sees a card next to the flowers.', en: 'Anya’s name is written on the paper.',
        chunks: ['かみに', 'アーニャさんの', 'なまえが', 'かいて', 'ある。', 'いる。'], answer: ['かみに', 'アーニャさんの', 'なまえが', 'かいて', 'ある。'],
        explain: 'Someone wrote it on purpose and it is still there: て-form + ある (なまえが かいて ある). ている is for an action going on or a state.' },
      { scene: 'Yor checks the drinks.', en: 'The tea has already been made.',
        chunks: ['おちゃは', 'もう', 'いれて', 'あります。', 'はいって'], answer: ['おちゃは', 'もう', 'いれて', 'あります。'],
        explain: 'てある needs a transitive verb (someone did it): いれる → いれて ある. はいる (it goes in) cannot take てある.' }
    ],
    names: ['ヨル', 'キルア', 'アーニャ', 'サンジ'],
    uses: ['g:te-aru', 'g:te-kudasai', 'g:nai-de-kudasai', 'g:te-iru', 'g:kara', 'g:made', 'g:n-desu', 'g:adj-i', 'g:noun-modifier', 'g:wa-desu', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:de', 'g:ne', 'v:邪魔|じゃま', 'v:部屋|へや', 'v:きれい|きれい', 'v:飾る|かざる', 'v:さん|さん', 'v:どうぞ|どうぞ', 'v:入る|はいる', 'v:今日|きょう', 'v:誕生日|たんじょうび', 'v:窓|まど', 'v:ガラス|ガラス', 'v:紙|かみ', 'v:花|はな', 'v:貼る|はる', 'v:テーブル|テーブル', 'v:ケーキ|ケーキ', 'v:置く|おく', 'v:作る|つくる', 'v:店|みせ', 'v:買う|かう', 'v:いい|いい', 'v:でも|でも', 'v:この|この', 'v:ちょっと|ちょっと', 'v:暑い|あつい', 'v:暖房|だんぼう', 'v:点く|つく', 'v:冷房|れいぼう', 'v:変える|かえる', 'v:電灯|でんとう', 'v:つける|つける', 'g:kedo', 'v:カーテン|カーテン', 'v:閉める|しめる', 'v:帰る|かえる', 'v:言う|いう', 'k:入', 'k:紙', 'k:作', 'k:店', 'k:言'],
    notes: 'Anya’s home thread; Yor’s cooking nod (Killua is relieved the cake is from Sanji’s).',
    verified: true }),

  L({ id: 'l:n4-dlg-winter-prep', format: 'dialogue',
    title: 'Packing ahead', goal: 'You can say you will do something in advance with 〜ておく.',
    scene: 'Emilia and Nami plan a winter trip to a hot-spring town and split the jobs.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、ふゆの　りょこうの　じゅんび、もう　[始|はじ]めた？', en: 'Nami, have you started getting ready for the winter trip?' },
      { speaker: 'nami', furigana: 'うん。へやは　もう　よやくして　おいたよ。', en: 'Yes. I’ve already booked our room.' },
      { speaker: 'emilia', furigana: 'はやい！　わたしは　なにを　して　おく？', en: 'That was quick! What should I do beforehand?' },
      { speaker: 'nami', furigana: 'エミリアさんの　でんしゃの　おかねを　ようい　して　おいて。', en: 'Have your train money ready.' },
      { speaker: 'emilia', furigana: 'わかった。……それと、おべんとうも　[作|つく]って　おくね。', en: 'Okay. ...And I’ll make packed lunches too.' },
      { speaker: 'nami', furigana: 'いいね。あ、さむいから、あたたかい　ふくも　したくして　おいて。', en: 'Nice. Oh, it’ll be cold, so get some warm clothes ready too.' },
      { speaker: 'emilia', furigana: 'ナミさんの　かばんは？', en: 'What about your bag?' },
      { speaker: 'nami', furigana: 'まだ。でも、かんたん。おかねと　ちずだけ。', en: 'Not yet. But it’s easy. Money and a map, that’s all.' },
      { speaker: 'emilia', furigana: 'それだけ？　……じゃあ、わたしの　セーターも　つつんで　おくね。', en: 'That’s all? ...Then I’ll wrap up one of my sweaters for you too.' },
      { speaker: 'nami', furigana: 'エミリアさん、やさしい！　じゃあ、わたしは　でんしゃの　[時間|じかん]を　しらべて　おく。', en: 'You’re so kind! Then I’ll look up the train times.' }
    ],
    remixes: [
      { scene: 'Nami wants the tickets before the trains fill up.', en: 'I’ll buy the tickets in advance.',
        chunks: ['きっぷを', 'かって', 'おく。', 'かう'], answer: ['きっぷを', 'かって', 'おく。'],
        explain: 'おく follows the て-form: かう → かって おく (buy it now, to be ready).' },
      { scene: 'Emilia thinks about the weather in the mountains.', en: 'I’ll check the weather beforehand.',
        chunks: ['てんきを', 'しらべて', 'おくね。', 'しらべる'], answer: ['てんきを', 'しらべて', 'おくね。'],
        explain: 'Doing something ahead of time: て-form + おく. しらべる おく is not a form.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:te-oku', 'g:dake', 'g:kara', 'g:adj-i', 'g:no', 'g:wo', 'g:mo', 'g:to', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:冬|ふゆ', 'v:旅行|りょこう', 'v:準備|じゅんび', 'v:もう|もう', 'v:始める|はじめる', 'v:部屋|へや', 'v:予約|よやく', 'v:する|する', 'v:早い|はやい', 'v:私|わたし', 'v:何|なに', 'v:電車|でんしゃ', 'v:お金|おかね', 'v:用意|ようい', 'v:分かる|わかる', 'v:それ|それ', 'v:お弁当|おべんとう', 'v:作る|つくる', 'v:いい|いい', 'v:寒い|さむい', 'v:暖かい|あたたかい', 'v:服|ふく', 'v:支度|したく', 'v:かばん|かばん', 'v:まだ|まだ', 'v:でも|でも', 'v:簡単|かんたん', 'v:地図|ちず', 'v:じゃあ|じゃあ', 'v:セーター|セーター', 'v:包む|つつむ', 'v:優しい|やさしい', 'v:時間|じかん', 'v:調べる|しらべる', 'k:始', 'k:作', 'k:時', 'k:間'],
    notes: 'Trip thread, part 2: a winter trip to a hot-spring town (they arrive in u061).',
    verified: true }),

  L({ id: 'l:n4-dlg-broken-window', format: 'dialogue',
    title: 'Oops', goal: 'You can say something happened by accident, or is done and over, with 〜てしまう / 〜ちゃう.',
    scene: 'A crash in the school yard. Gojo-sensei finds Killua next to a broken window.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Pupil' } },
    lines: [
      { speaker: 'gojo', furigana: 'キルアさん、いまの　[音|おと]は　なに？', en: 'Killua, what was that noise just now?' },
      { speaker: 'killua', furigana: '……まどの　ガラスが　われちゃった。', en: '...The window glass broke.' },
      { speaker: 'gojo', furigana: 'あらら。キルアさんは　だいじょうぶ？', en: 'Oh dear. Are you all right?' },
      { speaker: 'killua', furigana: 'うん。でも、ふくが　よごれて　しまった。', en: 'Yeah. But my clothes got dirty.' },
      { speaker: 'gojo', furigana: 'なにを　なげたの？', en: 'What did you throw?' },
      { speaker: 'killua', furigana: '……ごめん。しっぱいしちゃった。', en: '...Sorry. I messed up.' },
      { speaker: 'gojo', furigana: 'まどは　なおして　もらうから、いいよ。', en: 'We’ll get the window fixed, so it’s fine.' },
      { speaker: 'killua', furigana: 'よかった。……あ、これ、わすれもの？　[先生|せんせい]の　めがね？', en: 'Phew. ...Oh, did someone leave this? Is it your glasses, sir?' },
      { speaker: 'gojo', furigana: 'あ、わたしの！　けさ、どこかで　おとして　しまったんだ。', en: 'Oh, they’re mine! I lost them somewhere this morning.' },
      { speaker: 'killua', furigana: 'まどの　したに　あったよ。めがねは　こわれて　いない。', en: 'They were under the window. The glasses aren’t broken.' }
    ],
    remixes: [
      { scene: 'Killua tells Gojo about his phone.', en: 'I dropped my phone.',
        chunks: ['でんわを', 'おとして', 'しまった。', 'おとす'], answer: ['でんわを', 'おとして', 'しまった。'],
        explain: 'しまう follows the て-form: おとす → おとして しまった (I dropped it, and I wish I hadn’t).' },
      { scene: 'Gojo confesses about the class’s sweets.', en: 'I ate all the sweets.',
        chunks: ['おかしを', 'ぜんぶ', 'たべちゃった。', 'たべじゃった。'], answer: ['おかしを', 'ぜんぶ', 'たべちゃった。'],
        explain: 'Casual てしまった is ちゃった: たべて しまった → たべちゃった. じゃった is for で-verbs only (のんで → のんじゃった).' }
    ],
    names: ['ゴジョウ', 'キルア'],
    uses: ['g:te-shimau', 'g:te-morau', 'g:te-iru', 'g:kara', 'g:no', 'g:ga', 'g:wo', 'g:de', 'g:yo', 'v:さん|さん', 'v:今|いま', 'v:音|おと', 'v:何|なに', 'v:窓|まど', 'v:ガラス|ガラス', 'v:割れる|われる', 'v:大丈夫|だいじょうぶ', 'v:でも|でも', 'v:服|ふく', 'v:汚れる|よごれる', 'v:投げる|なげる', 'v:失敗|しっぱい', 'v:する|する', 'v:直す|なおす', 'v:もらう|もらう', 'v:いい|いい', 'v:これ|これ', 'v:忘れ物|わすれもの', 'v:先生|せんせい', 'v:眼鏡|めがね', 'v:私|わたし', 'v:今朝|けさ', 'v:落とす|おとす', 'v:下|した', 'v:ある|ある', 'v:壊れる|こわれる', 'k:音', 'k:先', 'k:生'],
    notes: 'Killua’s mischief; Gojo’s glasses (a nod to his eyewear). どこか is in kana (not on the list as one word: どこ + か).',
    verified: true }),

  L({ id: 'l:n4-dlg-try-the-suit', format: 'dialogue',
    title: 'Try it on', goal: 'You can say you will try doing something with 〜てみる.',
    scene: 'Sakura takes Sasuke to a clothes shop. He needs something to wear to a friend’s ceremony.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'サスケさん、この　スーツ、[着|き]て　みて。', en: 'Sasuke, try this suit on.' },
      { speaker: 'sasuke', furigana: '……スーツは　きらいだ。', en: '...I hate suits.' },
      { speaker: 'sakura', furigana: 'らいしゅうの　ともだちの　しきに　いるでしょう？　かがみで　[見|み]て　みて。', en: 'You need one for our friend’s ceremony next week, don’t you? Look at yourself in the mirror.' },
      { speaker: 'sasuke', furigana: '……かっこうが　へんだ。', en: '...I look strange.' },
      { speaker: 'sakura', furigana: 'そう？　いいよ。オーバーも　[着|き]て　みる？', en: 'Really? You look good. Want to try the overcoat too?' },
      { speaker: 'sasuke', furigana: '……あつい。', en: '...Too hot.' },
      { speaker: 'sakura', furigana: 'じゃあ、きものは？　きぬの　きものは　きれいだよ。', en: 'Then what about a kimono? Silk kimonos are beautiful.' },
      { speaker: 'sasuke', furigana: '……たかい。もめんで　いい。', en: '...Too expensive. Cotton will do.' },
      { speaker: 'sakura', furigana: 'もう……。じゃあ、この　くつ、あしに　あうか　はいて　みて。', en: 'Honestly... Then try these shoes and see if they fit.' },
      { speaker: 'sasuke', furigana: '……サクラさんが　いいと　おもう　ものを　[着|き]る。', en: '...I’ll wear whatever you think looks good.' }
    ],
    remixes: [
      { scene: 'In the shoe section, Sakura picks a pair for herself.', en: 'I’ll try these shoes on.',
        chunks: ['この', 'くつを', 'はいて', 'みる。', 'はくて'], answer: ['この', 'くつを', 'はいて', 'みる。'],
        explain: 'みる follows the て-form: はく → はいて みる (try them on and see). はくて is not a form.' },
      { scene: 'Back at Sanji’s kitchen, Sasuke has an idea.', en: 'I want to try making a new dish.',
        chunks: ['あたらしい', 'りょうりを', 'つくって', 'みたい。', 'つくりて'], answer: ['あたらしい', 'りょうりを', 'つくって', 'みたい。'],
        explain: 'Try doing: て-form + みる, here + たい (want to): つくって みたい.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:te-miru', 'g:to-omou', 'g:noun-modifier', 'g:deshou', 'g:ka', 'g:no', 'g:de', 'g:mo', 'g:ni', 'g:yo', 'v:さん|さん', 'v:この|この', 'v:スーツ|スーツ', 'v:着る|きる', 'v:嫌い|きらい', 'v:来週|らいしゅう', 'v:友達|ともだち', 'v:式|しき', 'v:要る|いる', 'v:鏡|かがみ', 'v:格好|かっこう', 'v:変|へん', 'v:そう|そう', 'v:いい|いい', 'v:オーバー|オーバー', 'v:暑い|あつい', 'v:じゃあ|じゃあ', 'v:着物|きもの', 'v:絹|きぬ', 'v:きれい|きれい', 'v:高い|たかい', 'v:木綿|もめん', 'v:もう|もう', 'v:靴|くつ', 'v:足|あし', 'v:合う|あう', 'v:はく|はく', 'v:思う|おもう', 'v:物|もの', 'k:着', 'k:見'],
    notes: 'Sasuke + Sakura thread. The ceremony is a friend’s (no name). 見ていい = "looks good to you" (見る + て + いい): natural?',
    verified: true }),

  L({ id: 'l:n4-dlg-falling-leaves', format: 'dialogue',
    title: 'Seasons go by', goal: 'You can talk about change over time with 〜ていく and 〜てくる.',
    scene: 'On the way out of school, Hinata walks with Frieren-sensei under the autumn trees.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'hinata', furigana: 'フリーレン[先生|せんせい]、さいきん　さむく　なって　きましたね。', en: 'Frieren-sensei, it’s been getting cold lately.' },
      { speaker: 'frieren', furigana: '……そうだね。きせつが　かわって　いく。', en: '...It has. The seasons keep changing.' },
      { speaker: 'hinata', furigana: 'これから　もっと　さむく　なって　いきますか。', en: 'Will it keep getting colder from now on?', say: 'これからもっと寒くなっていきますか。' },
      { speaker: 'frieren', furigana: '……ふゆまで　つづく。でも、わたしには　みじかい。', en: '...Until winter. But for me, that’s a short time.' },
      { speaker: 'hinata', furigana: 'みじかい？　ふゆまで　[二|に]かげつ　ありますよ。', en: 'Short? It’s two months till winter.' },
      { speaker: 'frieren', furigana: '……わたしは　[千|せん][年|ねん]　いきて　いるから。', en: '...I’ve been alive for a thousand years.' },
      { speaker: 'hinata', furigana: 'ええっ！　じゃあ、このごろの　[一|いち][年|ねん]は……？', en: 'Whoa! Then what’s a year to you these days...?' },
      { speaker: 'frieren', furigana: '……すこし。でも、さいきん　[一日|いちにち]が　すこし　ながく　なって　きた。', en: '...A little while. But lately the days have started to feel a little longer.' },
      { speaker: 'hinata', furigana: 'どうしてですか。', en: 'Why is that?' },
      { speaker: 'frieren', furigana: '……せいとが　ふえて、まいにち　いろいろな　ことが　あるから。', en: '...I have more students now, and something happens every day.' }
    ],
    remixes: [
      { scene: 'Hinata talks about the volleyball club.', en: 'More and more people have been joining.',
        chunks: ['ひとが', 'ふえて', 'きました。', 'ふえる'], answer: ['ひとが', 'ふえて', 'きました。'],
        explain: 'A change that has been going on up to now: て-form + くる: ふえて きました.' },
      { scene: 'Frieren picks up an old book from the staff room.', en: 'I’ll take this book with me.',
        chunks: ['この', 'ほんを', 'もって', 'いく。', 'もつ'], answer: ['この', 'ほんを', 'もって', 'いく。'],
        explain: 'Do something and go: て-form + いく: もって いく (take it along).' }
    ],
    names: ['フリーレン', 'ヒナタ'],
    uses: ['g:te-iku', 'g:te-kuru', 'g:naru', 'g:te-iru', 'g:te-adj-noun', 'g:made', 'g:kara', 'g:doushite', 'g:adj-na', 'g:koto', 'g:ga-arimasu', 'g:no', 'g:ga', 'g:mo', 'g:ni', 'g:yo', 'g:ne', 'g:ka', 'v:先生|せんせい', 'v:最近|さいきん', 'v:寒い|さむい', 'v:なる|なる', 'v:そう|そう', 'v:季節|きせつ', 'v:変わる|かわる', 'v:これから|これから', 'v:もっと|もっと', 'v:冬|ふゆ', 'v:続く|つづく', 'v:でも|でも', 'v:私|わたし', 'v:二|に', 'v:か月|かげつ', 'v:ある|ある', 'v:千|せん', 'v:年|ねん', 'v:生きる|いきる', 'v:じゃあ|じゃあ', 'v:このごろ|このごろ', 'v:一|いち', 'v:短い|みじかい', 'v:一日|いちにち', 'v:少し|すこし', 'v:長い|ながい', 'v:どうして|どうして', 'v:生徒|せいと', 'v:増える|ふえる', 'v:毎日|まいにち', 'v:いろいろ|いろいろ', 'v:事|こと', 'k:先', 'k:生', 'k:二', 'k:千', 'k:年', 'k:一', 'k:日'],
    notes: 'Frieren’s long life, gently (series nod by habit, no lines quoted).',
    verified: true }),

  L({ id: 'l:n4-dlg-favorite-book', format: 'dialogue',
    title: 'One more chapter', goal: 'You can say you start, finish or keep doing something with 〜始める, 〜終わる, 〜続ける and 〜出す.',
    scene: 'The bell has gone. Sakura finds Kakashi-sensei in the staff room, still reading his favourite book.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'sakura', furigana: 'カカシ[先生|せんせい]、また　その　[本|ほん]を　[読|よ]んで　いるんですか。', en: 'Kakashi-sensei, are you reading that book again?' },
      { speaker: 'kakashi', furigana: 'うん。きのう、さいしょから　[読|よ]み[始|はじ]めたんだ。', en: 'Yes. I started it again from the beginning yesterday.' },
      { speaker: 'sakura', furigana: 'その　[本|ほん]、もう　じゅっかいは　[読|よ]みましたよね。', en: 'You’ve read that book ten times already.' },
      { speaker: 'kakashi', furigana: 'ああ。でも、とちゅうが　いちばん　おもしろいんだよ。', en: 'Yes. But the middle is the best part.' },
      { speaker: 'sakura', furigana: 'じゅぎょうは？　もう　[始|はじ]まって　いますよ。', en: 'What about class? It’s already started.' },
      { speaker: 'kakashi', furigana: 'あと　[一|いち]ページで　[読|よ]み[終|お]わる。', en: 'One more page and I’ll have finished it.' },
      { speaker: 'sakura', furigana: 'もう！　みんな、きょうしつで　うたいだしましたよ。', en: 'Honestly! Everyone in the classroom has started singing.' },
      { speaker: 'kakashi', furigana: '……よし、おわり。いい　おわりだった。', en: '...Right, the end. That was a good ending.' },
      { speaker: 'sakura', furigana: 'やっと　[来|き]て　くれますか。', en: 'Will you come at last?' },
      { speaker: 'kakashi', furigana: 'ああ。……でも、よる　また　さいごまで　[読|よ]みつづけるよ。', en: 'Yes. ...But tonight I’ll keep reading it to the end again.' }
    ],
    remixes: [
      { scene: 'Sakura talks about her medicine textbook.', en: 'I finally finished reading the medicine book.',
        chunks: ['やっと', 'くすりの　ほんを', 'よみおわった。', 'よむおわった。'], answer: ['やっと', 'くすりの　ほんを', 'よみおわった。'],
        explain: 'おわる joins the ます-stem: よみ + おわる = finish reading. The dictionary form よむ cannot join.' },
      { scene: 'Kakashi looks out of the classroom window.', en: 'It suddenly started to rain.',
        chunks: ['あめが', 'ふりだした。', 'ふるだした。'], answer: ['あめが', 'ふりだした。'],
        explain: 'だす on the ます-stem means something starts suddenly: ふり + だす = start to rain.' }
    ],
    names: ['カカシ', 'サクラ'],
    uses: ['g:stem-compounds', 'g:n-desu', 'g:te-iru', 'g:te-kureru', 'g:made', 'g:wo', 'g:de', 'g:no', 'g:mo', 'g:yo', 'g:ne', 'g:ka', 'v:先生|せんせい', 'v:また|また', 'v:その|その', 'v:本|ほん', 'v:読む|よむ', 'v:昨日|きのう', 'v:最初|さいしょ', 'v:始める|はじめる', 'v:もう|もう', 'v:回|かい', 'v:でも|でも', 'v:途中|とちゅう', 'v:一番|いちばん', 'v:面白い|おもしろい', 'v:授業|じゅぎょう', 'v:始まる|はじまる', 'v:一|いち', 'v:ページ|ページ', 'v:みんな|みんな', 'v:教室|きょうしつ', 'v:歌う|うたう', 'v:終わり|おわり', 'v:いい|いい', 'v:やっと|やっと', 'v:来る|くる', 'v:夜|よる', 'v:最後|さいご', 'v:続ける|つづける', 'k:先', 'k:生', 'k:本', 'k:読', 'k:始', 'k:一', 'k:終', 'k:来'],
    notes: 'Kakashi’s favourite book (never named) and his lateness. 読みつづける is in the lines, but its mark goes to the unit word つづける (the point is marked by 始め / 終わ / だし).',
    verified: true }),

  L({ id: 'l:n4-dlg-after-meeting', format: 'dialogue',
    title: 'After the meeting', goal: 'You can say "after ~" and "later" with 〜後で / あとで.',
    scene: 'Late in the evening, Yor comes into Sanji’s restaurant. Sasuke is working there part-time.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Customer' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Part-timer' } },
    lines: [
      { speaker: 'sasuke', furigana: '……ヨルさん。きょうは　ひとりですか。', en: '...Yor. Are you on your own today?' },
      { speaker: 'yor', furigana: 'はい。しごとの　かいぎの　あとで、[来|き]ました。', en: 'Yes. I came after a meeting at work.' },
      { speaker: 'sasuke', furigana: '……なんの　しごとですか。', en: '...What kind of work do you do?' },
      { speaker: 'yor', furigana: 'こうむいんです。きょうは　かちょうと　ぶちょうと、[三|さん][時間|じかん]　かいぎでした。', en: 'I’m a civil servant. Today I had a three-hour meeting with my section chief and department head.' },
      { speaker: 'sasuke', furigana: '……たいへんでしたね。', en: '...That sounds hard.' },
      { speaker: 'yor', furigana: 'サスケさんは　ここで　アルバイトを　して　いるんですね。', en: 'So you have a part-time job here.' },
      { speaker: 'sasuke', furigana: '……はい。[学校|がっこう]の　あとで、まいにち。', en: '...Yes. Every day, after school.' },
      { speaker: 'yor', furigana: 'まいにち？　がんばって　いますね。サンジさんは？', en: 'Every day? You’re working hard. Where’s Sanji?' },
      { speaker: 'sasuke', furigana: '……[肉|にく]の　こうじょうに　[行|い]って　います。あとで　[来|き]ます。', en: '...He’s gone to the meat factory. He’ll be here later.' },
      { speaker: 'yor', furigana: 'では、[食|た]べた　[後|あと]で、サンジさんに　あいさつして　かえります。', en: 'Then after I’ve eaten, I’ll say hello to Sanji before I go home.' }
    ],
    remixes: [
      { scene: 'Yor plans her evening.', en: 'I’ll do the shopping after dinner.',
        chunks: ['ばんごはんの', 'あとで', 'かいものを', 'します。', 'ばんごはん'], answer: ['ばんごはんの', 'あとで', 'かいものを', 'します。'],
        explain: 'A noun takes の before あとで: ばんごはんの あとで. Without の it is not correct.' },
      { scene: 'Sasuke tells Yor about his evenings.', en: 'After work finishes, I study.',
        chunks: ['しごとが', 'おわった', 'あとで', 'べんきょうします。', 'おわる'], answer: ['しごとが', 'おわった', 'あとで', 'べんきょうします。'],
        explain: 'A verb before あとで is in the た-form: おわった あとで (after it finished).' }
    ],
    names: ['ヨル', 'サスケ', 'サンジ'],
    uses: ['g:ato-de', 'g:te-iru', 'g:n-desu', 'g:noun-modifier', 'g:deshita', 'g:wa-desu', 'g:to', 'g:no', 'g:de', 'g:ni', 'g:wo', 'g:ka', 'g:ne', 'v:さん|さん', 'v:今日|きょう', 'v:一人|ひとり', 'v:仕事|しごと', 'v:会議|かいぎ', 'v:来る|くる', 'v:何|なん', 'v:公務員|こうむいん', 'v:課長|かちょう', 'v:部長|ぶちょう', 'v:三|さん', 'v:時間|じかん', 'v:大変|たいへん', 'v:ここ|ここ', 'v:アルバイト|アルバイト', 'v:する|する', 'v:学校|がっこう', 'v:毎日|まいにち', 'v:頑張る|がんばる', 'v:肉|にく', 'v:工場|こうじょう', 'v:行く|いく', 'v:では|では', 'v:食べる|たべる', 'v:挨拶|あいさつ', 'v:帰る|かえる', 'k:来', 'k:三', 'k:時', 'k:間', 'k:学', 'k:校', 'k:肉', 'k:行', 'k:食', 'k:後'],
    notes: 'Part-time job thread: Sasuke works after school. Yor is a civil servant (true to the series).',
    verified: true }),

  L({ id: 'l:n4-dlg-report-deadline', format: 'dialogue',
    title: 'Due by Wednesday', goal: 'You can give a deadline with 〜までに.',
    scene: 'After the lecture, Kakashi-sensei stops Lelouch about the report.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Lecturer' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'University student' } },
    lines: [
      { speaker: 'kakashi', furigana: 'ルルーシュさん、こうぎの　レポート、おぼえて　いる？', en: 'Lelouch, do you remember the report for the lecture?' },
      { speaker: 'lelouch', furigana: 'はい。[金曜日|きんようび]までに　だしますよね。', en: 'Yes. We hand it in by Friday, don’t we?' },
      { speaker: 'kakashi', furigana: 'それが……[水曜日|すいようび]までに　かわったんだ。', en: 'About that... it’s changed to Wednesday.' },
      { speaker: 'lelouch', furigana: '[水曜日|すいようび]？　あさってじゃ　ないですか。', en: 'Wednesday? Isn’t that the day after tomorrow?' },
      { speaker: 'kakashi', furigana: 'ごめんね。しけんの　[前|まえ]に　[読|よ]みたくて。', en: 'Sorry. I want to read them before the exam.' },
      { speaker: 'lelouch', furigana: 'だいじょうぶです。もう　[書|か]き[終|お]わって　います。', en: 'It’s fine. I’ve already finished writing it.' },
      { speaker: 'kakashi', furigana: 'はやいね！　こうこうの　ときから　そう？', en: 'That was fast! Have you been like that since high school?' },
      { speaker: 'lelouch', furigana: 'はい。しゅくだいは　いつも　[一日|いちにち][前|まえ]までに　だして　いました。', en: 'Yes. I always handed in homework at least a day early.' },
      { speaker: 'kakashi', furigana: 'そつぎょうまでに、きみに　かてる　[大学生|だいがくせい]は　いないね。', en: 'By graduation, no student here will be able to beat you.' },
      { speaker: 'lelouch', furigana: '[先生|せんせい]にも　まけませんよ。', en: 'I won’t lose to you either, sir.' }
    ],
    remixes: [
      { scene: 'Kakashi gives the class some reading.', en: 'Please read this by Monday.',
        chunks: ['これを', 'げつようびまでに', 'よんで', 'ください。', 'げつようびまで'], answer: ['これを', 'げつようびまでに', 'よんで', 'ください。'],
        explain: 'A deadline takes までに (by Monday). まで alone means "until": you keep reading all the way to Monday.' },
      { scene: 'Lelouch tells his family when he will be back.', en: 'I’ll be home by seven.',
        chunks: ['しちじまでに', 'いえに', 'かえります。', 'しちじまで'], answer: ['しちじまでに', 'いえに', 'かえります。'],
        explain: 'An action done once, before a time limit: までに. まで is for something that goes on up to that time.' }
    ],
    names: ['カカシ', 'ルルーシュ'],
    uses: ['g:made-ni', 'g:made', 'g:mae-ni', 'g:tai', 'g:te-adj-noun', 'g:stem-compounds', 'g:te-iru', 'g:te-ita', 'g:potential', 'g:noun-modifier', 'g:ja-nai', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:講義|こうぎ', 'v:レポート|レポート', 'v:覚える|おぼえる', 'v:金曜日|きんようび', 'v:出す|だす', 'v:それ|それ', 'v:水曜日|すいようび', 'v:変わる|かわる', 'v:あさって|あさって', 'v:試験|しけん', 'v:前|まえ', 'v:読む|よむ', 'v:大丈夫|だいじょうぶ', 'v:もう|もう', 'v:書く|かく', 'v:早い|はやい', 'v:高校|こうこう', 'v:時|とき', 'v:そう|そう', 'v:宿題|しゅくだい', 'v:いつも|いつも', 'v:一日|いちにち', 'v:卒業|そつぎょう', 'v:君|きみ', 'v:勝つ|かつ', 'v:大学生|だいがくせい', 'v:居る|いる', 'v:先生|せんせい', 'v:負ける|まける', 'k:金', 'k:曜', 'k:日', 'k:水', 'k:前', 'k:読', 'k:書', 'k:終', 'k:一', 'k:大', 'k:学', 'k:生', 'k:先'],
    notes: 'Lelouch competitive and always early; Kakashi, the late one, moves a deadline forward. Kakashi as a university lecturer here.',
    verified: true }),

  L({ id: 'l:n4-dlg-long-time', format: 'dialogue',
    title: 'Long time no see', goal: 'You can say how often (〜に〜度) and about when (〜ごろ).',
    scene: 'Frieren comes back to Sanji’s restaurant for the first time in years.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Old customer' } },
    lines: [
      { speaker: 'sanji', furigana: 'フリーレンさん！　ひさしぶりですね。', en: 'Frieren! It’s been a long time.' },
      { speaker: 'frieren', furigana: '……うん。しばらく　[来|こ]なかった。', en: '...Yes. I haven’t come for a while.' },
      { speaker: 'sanji', furigana: 'しばらくって……[十|じゅう][年|ねん]ですよ。', en: 'A while? It’s been ten years.' },
      { speaker: 'frieren', furigana: '……そう？　すこしだと　おもった。', en: '...Has it? I thought it was a short time.' },
      { speaker: 'sanji', furigana: 'むかしは　[月|つき]に　[二|に][度|ど]　[来|き]て　くれましたよね。', en: 'You used to come twice a month.' },
      { speaker: 'frieren', furigana: '……うん。ともだちと　ここに　あつまって　いた。', en: '...Yes. My friends and I used to meet here.' },
      { speaker: 'sanji', furigana: 'きょうは　なん[時|じ]ごろまで　いられますか。', en: 'Until about what time can you stay today?' },
      { speaker: 'frieren', furigana: '……[九|く][時|じ]ごろ。そろそろ　つぎの　まちに　[行|い]く。', en: '...About nine. It’s nearly time to go on to the next town.' },
      { speaker: 'sanji', furigana: 'では、これからは　たまに　[来|き]て　ください。みっかおきでも　いいですよ。', en: 'Then come by now and then from now on. Every three days would be fine.' },
      { speaker: 'frieren', furigana: '……じゃあ、[十|じゅう][年|ねん]に　[一|いち][度|ど]。', en: '...Then once every ten years.' }
    ],
    remixes: [
      { scene: 'Sanji talks about his market trips.', en: 'I buy fish twice a day.',
        chunks: ['いちにちに', 'にど', 'さかなを', 'かいます。', 'いちにちで'], answer: ['いちにちに', 'にど', 'さかなを', 'かいます。'],
        explain: 'How often: period + に + number + ど: いちにちに にど (twice a day). で does not give a frequency.' },
      { scene: 'Frieren tells Sanji when the next town’s festival starts.', en: 'It starts around the tenth.',
        chunks: ['とおかごろに', 'はじまる。', 'とおかごろを'], answer: ['とおかごろに', 'はじまる。'],
        explain: 'About a point in time: ごろ (+ に): とおかごろに. を does not mark a time.' }
    ],
    names: ['サンジ', 'フリーレン'],
    uses: ['g:ni-frequency', 'g:goro', 'g:tte', 'g:to-omou', 'g:te-kureru', 'g:te-ita', 'g:potential', 'g:made', 'g:te-kudasai', 'g:demo', 'g:te-mo-ii', 'g:no', 'g:ni', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:久しぶり|ひさしぶり', 'v:しばらく|しばらく', 'v:来る|くる', 'v:十|じゅう', 'v:年|ねん', 'v:そう|そう', 'v:少し|すこし', 'v:思う|おもう', 'v:昔|むかし', 'v:月|つき', 'v:二|に', 'v:友達|ともだち', 'v:ここ|ここ', 'v:集まる|あつまる', 'v:今日|きょう', 'v:何|なん', 'v:時|じ', 'v:居る|いる', 'v:九|く', 'v:そろそろ|そろそろ', 'v:次|つぎ', 'v:町|まち', 'v:行く|いく', 'v:では|では', 'v:これから|これから', 'v:たまに|たまに', 'v:三日|みっか', 'v:おき|おき', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:一|いち', 'k:来', 'k:十', 'k:年', 'k:月', 'k:二', 'k:度', 'k:時', 'k:九', 'k:行', 'k:一'],
    notes: 'Frieren’s sense of time (a series nod). 十年に一度: the unit word 一度 takes that mark; 月に二度 carries the grammar mark.',
    verified: true }),

  L({ id: 'l:n4-dlg-lab-lunch', format: 'dialogue',
    title: 'Lunch in the lab', goal: 'You can say you do two things at once with 〜ながら.',
    scene: 'Emilia visits Maomao in her research lab at lunchtime.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Researcher' } },
    lines: [
      { speaker: 'emilia', furigana: 'マオマオさん、けんきゅうしつに　いますか。', en: 'Maomao, are you in the lab?' },
      { speaker: 'maomao', furigana: 'はい。……どうぞ。', en: 'Yes. ...Come in.' },
      { speaker: 'emilia', furigana: 'あっ、パンを　[食|た]べながら　[研究|けんきゅう]して　いる！', en: 'Oh, you’re doing research while eating bread!' },
      { speaker: 'maomao', furigana: 'しょくじの　[時間|じかん]が　ないので。', en: 'There’s no time for a proper meal.' },
      { speaker: 'emilia', furigana: 'ステレオも　ついて　いますね。おんがくを　[聞|き]きながら？', en: 'The stereo is on too. While listening to music?' },
      { speaker: 'maomao', furigana: 'はい。しずかな　へやでは　ねむく　なります。', en: 'Yes. I get sleepy in a quiet room.' },
      { speaker: 'emilia', furigana: 'なんの　[研究|けんきゅう]ですか。', en: 'What is your research on?' },
      { speaker: 'maomao', furigana: 'くすりと　どくです。いがくと　かがくの　[研究|けんきゅう]です。', en: 'Medicine and poison. It’s research in medical science and chemistry.' },
      { speaker: 'emilia', furigana: 'でも、どくを　さわりながら、[食|た]べないで　くださいね。', en: 'But please don’t eat while you’re touching poison.' },
      { speaker: 'maomao', furigana: '……だいじょうぶです。てぶくろを　して　います。', en: '...It’s fine. I’m wearing gloves.' }
    ],
    bridge: [
      { text: 'どく', gloss: 'どく = poison' }
    ],
    remixes: [
      { scene: 'Emilia studies for a test at home.', en: 'I study while drinking tea.',
        chunks: ['おちゃを', 'のみながら', 'べんきょうします。', 'のむながら'], answer: ['おちゃを', 'のみながら', 'べんきょうします。'],
        explain: 'ながら joins the ます-stem: のみ + ながら. The dictionary form のむ cannot take ながら.' },
      { scene: 'Maomao suggests going out of the lab.', en: 'Let’s talk while we walk.',
        chunks: ['あるきながら', 'はなしましょう。', 'あるくながら'], answer: ['あるきながら', 'はなしましょう。'],
        explain: 'ながら joins the ます-stem: あるき + ながら (while walking). The main action comes last: はなしましょう.' }
    ],
    names: ['エミリア', 'マオマオ'],
    uses: ['g:nagara', 'g:te-iru', 'g:node', 'g:nai-de-kudasai', 'g:naru', 'g:adj-na', 'g:to', 'g:no', 'g:wo', 'g:de', 'g:mo', 'g:ka', 'g:ne', 'v:さん|さん', 'v:研究室|けんきゅうしつ', 'v:居る|いる', 'v:どうぞ|どうぞ', 'v:パン|パン', 'v:食べる|たべる', 'v:研究|けんきゅう', 'v:する|する', 'v:食事|しょくじ', 'v:時間|じかん', 'v:ない|ない', 'v:ステレオ|ステレオ', 'v:点く|つく', 'v:音楽|おんがく', 'v:聞く|きく', 'v:静か|しずか', 'v:部屋|へや', 'v:眠い|ねむい', 'v:なる|なる', 'v:何|なん', 'v:薬|くすり', 'v:医学|いがく', 'v:科学|かがく', 'v:でも|でも', 'v:触る|さわる', 'v:大丈夫|だいじょうぶ', 'v:手袋|てぶくろ', 'k:食', 'k:研', 'k:究', 'k:時', 'k:間', 'k:聞'],
    notes: 'Maomao loves poison and forgets meals (series nods). どく is a bridge (as in batch 1). かがく here is the catalog 科学 (science); "chemistry" in the en is loose: check.',
    verified: true }),

  L({ id: 'l:n4-dlg-while-out', format: 'dialogue',
    title: 'While I was out', goal: 'You can say something happened while something else was going on with 〜間に.',
    scene: 'Yor comes home and finds the cake for dinner half gone. Anya explains.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'アーニャさん、わたしが　るすの　あいだに、だれか　[来|き]ましたか。', en: 'Anya, did anyone come while I was out?' },
      { speaker: 'anya', furigana: 'となりの　おばさん。ははに　おかしを　くれた。', en: 'The lady next door. She gave you some sweets, Mama.', say: 'となりのおばさん。母にお菓子をくれた。' },
      { speaker: 'yor', furigana: 'まあ、しんせつですね。あとで　おれいを　[言|い]わなくちゃ。', en: 'Oh, how kind. I must thank her later.' },
      { speaker: 'anya', furigana: 'それと……アーニャが　ねて　いる　あいだに、ボンドが　ケーキを　[食|た]べた。', en: 'And... while Anya was asleep, Bond ate the cake.' },
      { speaker: 'yor', furigana: 'ええっ！　おとうさんの　ケーキを？', en: 'What! Your father’s cake?' },
      { speaker: 'anya', furigana: 'ボンド、はやかった。アーニャは　わるくない。', en: 'Bond was fast. It’s not Anya’s fault.' },
      { speaker: 'yor', furigana: 'しかたないですね。あした、しごとの　ひるやすみに　また　かって　きます。', en: 'It can’t be helped. Tomorrow I’ll go and buy another one in my lunch break at work.' },
      { speaker: 'anya', furigana: 'ひるま？　アーニャが　[学校|がっこう]に　いる　あいだに？', en: 'In the daytime? While Anya is at school?' },
      { speaker: 'yor', furigana: 'はい。おとうさんが　かえる　[前|まえ]に。', en: 'Yes. Before your father gets home.' },
      { speaker: 'anya', furigana: 'じゃあ、ケーキが　ある　あいだは、ボンドを　アーニャの　へやに　いれる。', en: 'Then while the cake is here, Anya will keep Bond in her room.' }
    ],
    remixes: [
      { scene: 'Yor tells Anya about the laundry.', en: 'It rained while I was out.',
        chunks: ['わたしが', 'るすの', 'あいだに', 'あめが', 'ふりました。', 'るす'], answer: ['わたしが', 'るすの', 'あいだに', 'あめが', 'ふりました。'],
        explain: 'A noun takes の before あいだに: るすの あいだに (while I was away).' },
      { scene: 'Anya has a plan for the afternoon.', en: 'While Mama is cooking, Anya will read a book.',
        chunks: ['ははが', 'りょうりして　いる', 'あいだに', 'ほんを', 'よむ。', 'りょうりする'], answer: ['ははが', 'りょうりして　いる', 'あいだに', 'ほんを', 'よむ。'],
        explain: 'While something goes on: ている + あいだに: りょうりして いる あいだに.' }
    ],
    names: ['ヨル', 'アーニャ', 'ボンド'],
    uses: ['g:te-iru-aida-ni', 'g:nakucha-ikenai', 'g:te-kuru', 'g:mae-ni', 'g:adj-i', 'g:wa-desu', 'g:no', 'g:ni', 'g:ga', 'g:wo', 'g:ka', 'g:ne', 'v:さん|さん', 'v:私|わたし', 'v:留守|るす', 'v:間|あいだ', 'v:誰か|だれか', 'v:来る|くる', 'v:隣|となり', 'v:伯母さん|おばさん', 'v:母|はは', 'v:お菓子|おかし', 'v:くれる|くれる', 'v:親切|しんせつ', 'v:後|あと', 'v:お礼|おれい', 'v:言う|いう', 'v:それ|それ', 'v:寝る|ねる', 'v:ケーキ|ケーキ', 'v:食べる|たべる', 'v:お父さん|おとうさん', 'v:早い|はやい', 'v:悪い|わるい', 'v:仕方|しかた', 'v:明日|あした', 'v:仕事|しごと', 'v:昼休み|ひるやすみ', 'v:また|また', 'v:買う|かう', 'v:昼間|ひるま', 'v:学校|がっこう', 'v:居る|いる', 'v:帰る|かえる', 'v:前|まえ', 'v:じゃあ|じゃあ', 'v:ある|ある', 'v:部屋|へや', 'v:入れる|いれる', 'k:来', 'k:言', 'k:食', 'k:学', 'k:校', 'k:前'],
    notes: 'Anya’s home thread; Bond (allowed name) and the cake. Yor says おとうさん to Anya (Loid). The unit word 間 (あいだ) takes every あいだ, so the grammar 〜間に has no own mark (lib limit, see notes).',
    verified: true }),

  L({ id: 'l:n4-dlg-late-for-the-plane', format: 'dialogue',
    title: 'Just leaving', goal: 'You can say you are about to, in the middle of, or have just done something with 〜ところだ.',
    scene: 'Class trip day. Everyone is at the station except Kakashi-sensei. Killua phones him.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Pupil' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'killua', furigana: 'カカシ[先生|せんせい]、いま　どこ？　みんな　[駅|えき]で　[待|ま]って　いるよ。', en: 'Kakashi-sensei, where are you? Everyone is waiting at the station.' },
      { speaker: 'kakashi', furigana: 'いま　いえを　[出|で]る　ところだよ。', en: 'I’m just about to leave the house.' },
      { speaker: 'killua', furigana: 'しゅっぱつは　[九|く][時|じ]だよ。あと　ごふん。', en: 'We leave at nine. That’s five minutes.' },
      { speaker: 'kakashi', furigana: 'だいじょうぶ。とっきゅうに　のりかえるから、まにあうよ。', en: 'No problem. I’ll change to the limited express, so I’ll make it.' },
      { speaker: 'killua', furigana: 'とっきゅう？　この　まちの　[駅|えき]に、とっきゅうは　とまらないよ。', en: 'The limited express? It doesn’t stop at our town’s station.' },
      { speaker: 'kakashi', furigana: '……じゃあ、きゅうこうで。', en: '...The express, then.' },
      { speaker: 'killua', furigana: '[先生|せんせい]、ほんとうは　まだ　ねて　いる　ところでしょう？', en: 'Sir, you’re actually still in bed, aren’t you?' },
      { speaker: 'kakashi', furigana: '……いま　おきた　ところだ。', en: '...I’ve just got up.' },
      { speaker: 'killua', furigana: 'もう。じゃあ、くうこうで　[待|ま]って　いる。どこにも　よらないで　[来|き]てよ。', en: 'Honestly. Then we’ll wait at the airport. Come without stopping anywhere.' },
      { speaker: 'kakashi', furigana: 'はいはい。……かえりの　ひこうきには、かならず　まにあうよ。', en: 'Yes, yes. ...I’ll definitely make the flight home.' }
    ],
    remixes: [
      { scene: 'Killua sends Gon a message from the platform.', en: 'I’m just about to get on the train.',
        chunks: ['いま', 'でんしゃに', 'のる', 'ところ。', 'のった'], answer: ['いま', 'でんしゃに', 'のる', 'ところ。'],
        explain: 'About to do it: dictionary form + ところ (のる ところ). のった ところ would mean you have just got on.' },
      { scene: 'At last, Kakashi phones from the airport.', en: 'I’ve just arrived at the airport.',
        chunks: ['いま', 'くうこうに', 'ついた', 'ところです。', 'つく'], answer: ['いま', 'くうこうに', 'ついた', 'ところです。'],
        explain: 'Have just done it: た-form + ところ (ついた ところ).' }
    ],
    names: ['キルア', 'カカシ'],
    uses: ['g:tokoro-da', 'g:te-iru', 'g:deshou', 'g:kara', 'g:potential', 'g:mada', 'g:no', 'g:ni', 'g:de', 'g:wo', 'g:mo', 'g:yo', 'v:先生|せんせい', 'v:今|いま', 'v:どこ|どこ', 'v:みんな|みんな', 'v:駅|えき', 'v:待つ|まつ', 'v:家|いえ', 'v:出る|でる', 'v:所|ところ', 'v:出発|しゅっぱつ', 'v:九|く', 'v:時|じ', 'v:五|ご', 'v:分|ふん', 'v:大丈夫|だいじょうぶ', 'v:特急|とっきゅう', 'v:乗り換える|のりかえる', 'v:間に合う|まにあう', 'v:この|この', 'v:町|まち', 'v:止まる|とまる', 'v:じゃあ|じゃあ', 'v:急行|きゅうこう', 'v:ほんとう|ほんとう', 'v:まだ|まだ', 'v:寝る|ねる', 'v:起きる|おきる', 'v:もう|もう', 'v:空港|くうこう', 'v:寄る|よる', 'v:来る|くる', 'v:帰り|かえり', 'v:飛行機|ひこうき', 'v:必ず|かならず', 'k:先', 'k:生', 'k:駅', 'k:待', 'k:出', 'k:九', 'k:時', 'k:来'],
    notes: 'Kakashi always late (batch 1 u005, u018). The class trip flies from the airport.',
    verified: true }),

  L({ id: 'l:n4-dlg-the-way-up', format: 'dialogue',
    title: 'Up the hill', goal: 'You can give directions with the dictionary form + と (when you do A, B happens).',
    scene: 'Sasuke is visiting Hinata’s new boarding house for the first time. He phones from the station.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'sasuke', furigana: '……ヒナタさん。[駅|えき]に　ついた。ここから　どう　[行|い]く？', en: '...Hinata. I’m at the station. How do I get there from here?' },
      { speaker: 'hinata', furigana: '[駅|えき]を　[出|で]て、おおきい　とおりを　[右|みぎ]に　まがって！', en: 'Leave the station and turn right at the big street!' },
      { speaker: 'sasuke', furigana: '……まがった。', en: '...Done.' },
      { speaker: 'hinata', furigana: 'まっすぐ　[行|い]くと、さかが　ある。さかを　のぼると、こうえんが　[見|み]えるよ。', en: 'Go straight and there’s a hill. When you climb the hill, you’ll see a park.' },
      { speaker: 'sasuke', furigana: '……こうえんの　まわりに　なにが　ある？', en: '...What’s around the park?' },
      { speaker: 'hinata', furigana: 'こうえんの　まんなかに　[木|き]が　ある。その　[木|き]に　むかって　[歩|ある]くと、[白|しろ]い　いえ！', en: 'There’s a tree in the middle of the park. Walk towards the tree and there’s a white house!' },
      { speaker: 'sasuke', furigana: '……[白|しろ]い　いえが　[三|みっ]つ　ある。', en: '...There are three white houses.' },
      { speaker: 'hinata', furigana: 'えっ？　えーと……[電車|でんしゃ]の　せんに　ちかい　いえ！', en: 'What? Um... the one near the train line!' },
      { speaker: 'sasuke', furigana: '……[電車|でんしゃ]の　せんは　とおくに　[見|み]える。', en: '...The train line is a long way off.' },
      { speaker: 'hinata', furigana: 'あ、まどから　サスケさんが　[見|み]えた！　そこで　[待|ま]って　いて！', en: 'Oh, I can see you from my window! Wait there!' }
    ],
    remixes: [
      { scene: 'Hinata gives Sakura the way to the station.', en: 'If you go straight, you’ll see the station.',
        chunks: ['まっすぐ', 'いくと、', 'えきが', 'みえます。', 'いったと、'], answer: ['まっすぐ', 'いくと、', 'えきが', 'みえます。'],
        explain: '〜と for "whenever A, then B" takes the dictionary form: いくと. The た-form cannot go before this と.' },
      { scene: 'Hinata talks about the park in spring.', en: 'When spring comes, it gets warm.',
        chunks: ['はるに', 'なると、', 'あたたかく', 'なる。', 'なったと、'], answer: ['はるに', 'なると、', 'あたたかく', 'なる。'],
        explain: 'Something that always follows: dictionary form + と: はるに なると (when spring comes).' }
    ],
    names: ['ヒナタ', 'サスケ'],
    uses: ['g:to-conditional', 'g:te-form', 'g:te-iru', 'g:kara', 'g:no', 'g:wo', 'g:ni', 'g:ga', 'g:de', 'g:yo', 'v:さん|さん', 'v:駅|えき', 'v:着く|つく', 'v:ここ|ここ', 'v:どう|どう', 'v:行く|いく', 'v:出る|でる', 'v:大きい|おおきい', 'v:通り|とおり', 'v:右|みぎ', 'v:曲がる|まがる', 'v:まっすぐ|まっすぐ', 'v:坂|さか', 'v:ある|ある', 'v:登る|のぼる', 'v:公園|こうえん', 'v:見える|みえる', 'v:周り|まわり', 'v:何|なに', 'v:真中|まんなか', 'v:木|き', 'v:その|その', 'v:向かう|むかう', 'v:歩く|あるく', 'v:白い|しろい', 'v:家|いえ', 'v:三つ|みっつ', 'v:電車|でんしゃ', 'v:線|せん', 'v:近い|ちかい', 'v:遠く|とおく', 'v:窓|まど', 'v:そこ|そこ', 'v:待つ|まつ', 'k:駅', 'k:行', 'k:出', 'k:右', 'k:見', 'k:木', 'k:歩', 'k:白', 'k:三', 'k:電', 'k:車', 'k:待'],
    notes: 'Moving thread: Sasuke’s first visit to Hinata’s boarding house. Hinata’s directions are vague (one humour beat).',
    verified: true }),

  L({ id: 'l:n4-dlg-shrine-wish', format: 'dialogue',
    title: 'At the shrine', goal: 'You can say what you hope for with 〜といい.',
    scene: 'Maomao takes Anya to a small shrine near the pharmacy.',
    cast: { anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' } },
    lines: [
      { speaker: 'anya', furigana: 'マオマオさん、じんじゃで　なにを　いのる？', en: 'Maomao, what will you pray for at the shrine?' },
      { speaker: 'maomao', furigana: 'くすりの　しごとが　うまく　いくと　いいです。', en: 'I hope my work with medicine goes well.' },
      { speaker: 'anya', furigana: 'アーニャは、あしたの　テストが　ないと　いい。', en: 'Anya hopes there’s no test tomorrow.' },
      { speaker: 'maomao', furigana: '……べんきょうした　ほうが　いいですよ。', en: '...You’d better study.' },
      { speaker: 'anya', furigana: 'じゃあ、テストが　かんたんだと　いい！', en: 'Then Anya hopes the test is easy!' },
      { speaker: 'maomao', furigana: 'いのる　[前|まえ]に、こころを　しずかに　して　ください。', en: 'Before you pray, please make your heart calm.' },
      { speaker: 'anya', furigana: 'アーニャの　きもち、もう　しずか。', en: 'Anya’s feelings are already calm.' },
      { speaker: 'maomao', furigana: '……では、どうぞ。', en: '...Then go ahead.' },
      { speaker: 'anya', furigana: '……おわった！　マオマオさんは、とくに　なにを　いのった？', en: '...Done! Maomao, what did you pray for most of all?' },
      { speaker: 'maomao', furigana: '……あたらしい　どくを　みつけられると　いいです。', en: '...I hope I can find a new poison.' }
    ],
    bridge: [
      { text: 'どく', gloss: 'どく = poison' }
    ],
    remixes: [
      { scene: 'Anya thinks about the school trip.', en: 'I hope it’s sunny tomorrow.',
        chunks: ['あした', 'はれると', 'いいな。', 'はれたと'], answer: ['あした', 'はれると', 'いいな。'],
        explain: 'Hope: dictionary form + と いい: はれる → はれると いい.' },
      { scene: 'Maomao gives Anya some advice for the test.', en: 'You should read the book once more.',
        chunks: ['もういちど', 'ほんを', 'よむと', 'いいですよ。', 'よんで'], answer: ['もういちど', 'ほんを', 'よむと', 'いいですよ。'],
        explain: 'といい also gives advice: よむと いいですよ (it would be good to read).' }
    ],
    names: ['アーニャ', 'マオマオ'],
    uses: ['g:to-ii', 'g:hou-ga-ii', 'g:mae-ni', 'g:te-kudasai', 'g:potential', 'g:noun-modifier', 'g:adj-na', 'g:no', 'g:de', 'g:wo', 'g:ga', 'g:yo', 'v:さん|さん', 'v:神社|じんじゃ', 'v:何|なに', 'v:祈る|いのる', 'v:薬|くすり', 'v:仕事|しごと', 'v:うまい|うまい', 'v:行く|いく', 'v:いい|いい', 'v:明日|あした', 'v:テスト|テスト', 'v:ない|ない', 'v:勉強|べんきょう', 'v:する|する', 'v:じゃあ|じゃあ', 'v:簡単|かんたん', 'v:前|まえ', 'v:心|こころ', 'v:静か|しずか', 'v:気持ち|きもち', 'v:もう|もう', 'v:では|では', 'v:どうぞ|どうぞ', 'v:終わる|おわる', 'v:特に|とくに', 'v:新しい|あたらしい', 'v:見つける|みつける', 'k:前'],
    notes: 'Maomao and poison again (series nod).',
    verified: true }),

  L({ id: 'l:n4-dlg-island-boat', format: 'dialogue',
    title: 'When we get there', goal: 'You can say "when / if ~ (has happened)" with 〜たら.',
    scene: 'Emilia and Nami’s winter trip: the train runs along the coast towards the port.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、みなとが　[見|み]えて　きたよ！', en: 'Nami, I can see the port now!' },
      { speaker: 'nami', furigana: 'みなとに　ついたら、ふねに　のりかえるよ。', en: 'When we get to the port, we change to a boat.' },
      { speaker: 'emilia', furigana: 'きしゃに　ふねに……のりものが　たくさんで、たのしいね。', en: 'A train, then a boat... so many kinds of transport. It’s fun.' },
      { speaker: 'nami', furigana: 'しまは　こうつうが　ふべんだから。ひこうじょうも　ないし。', en: 'Getting around the island is hard. There’s no airfield either.' },
      { speaker: 'emilia', furigana: 'しまに　ついたら、なにを　する？', en: 'What shall we do when we get to the island?' },
      { speaker: 'nami', furigana: 'りょかんに　にもつを　おいたら、うみを　[見|み]に　[行|い]く。', en: 'Once we’ve left our bags at the inn, we go and look at the sea.' },
      { speaker: 'emilia', furigana: 'あしたは？　もし　あめが　ふったら？', en: 'And tomorrow? What if it rains?' },
      { speaker: 'nami', furigana: 'あめだったら、りょかんに　もう[一日|いちにち]　とまる。', en: 'If it rains, we stay one more day at the inn.' },
      { speaker: 'emilia', furigana: 'え、おかねは　だいじょうぶ？', en: 'Oh, is the money all right?' },
      { speaker: 'nami', furigana: 'だいじょうぶ。……かえったら、エミリアさんに　かりるから。', en: 'It’s fine. ...When we get back, I’ll borrow some from you.' }
    ],
    remixes: [
      { scene: 'Emilia makes a plan for after the trip.', en: 'When I get home, I’ll write a letter.',
        chunks: ['いえに', 'かえったら、', 'てがみを', 'かきます。', 'かえるたら、'], answer: ['いえに', 'かえったら、', 'てがみを', 'かきます。'],
        explain: 'たら is made from the た-form: かえった + ら. かえるたら is not a form.' },
      { scene: 'Nami looks at the souvenirs at the port.', en: 'If it’s cheap, I’ll buy it.',
        chunks: ['やすかったら、', 'かう。', 'やすいたら、'], answer: ['やすかったら、', 'かう。'],
        explain: 'An い-adjective takes かったら: やすい → やすかったら.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:tara', 'g:te-kuru', 'g:ni-iku', 'g:shi', 'g:kara', 'g:te-adj-noun', 'g:adj-na', 'g:no', 'g:ni', 'g:wo', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:港|みなと', 'v:見える|みえる', 'v:着く|つく', 'v:舟|ふね', 'v:乗り換える|のりかえる', 'v:汽車|きしゃ', 'v:乗り物|のりもの', 'v:たくさん|たくさん', 'v:楽しい|たのしい', 'v:島|しま', 'v:交通|こうつう', 'v:不便|ふべん', 'v:飛行場|ひこうじょう', 'v:ない|ない', 'v:何|なに', 'v:する|する', 'v:旅館|りょかん', 'v:荷物|にもつ', 'v:置く|おく', 'v:海|うみ', 'v:見る|みる', 'v:行く|いく', 'v:明日|あした', 'v:もし|もし', 'v:雨|あめ', 'v:降る|ふる', 'v:もう|もう', 'v:一日|いちにち', 'v:泊まる|とまる', 'v:お金|おかね', 'v:大丈夫|だいじょうぶ', 'v:帰る|かえる', 'v:借りる|かりる', 'k:見', 'k:行', 'k:一', 'k:日'],
    notes: 'Trip thread, part 2 (u046 prep): on the way to an island inn. Nami’s money nod. The catalog spells ふね as 舟.',
    verified: true }),

  L({ id: 'l:n4-dlg-rest-your-leg', format: 'dialogue',
    title: 'Why not rest?', goal: 'You can make a suggestion with 〜たらどう(ですか).',
    scene: 'Hinata hurt his leg at volleyball practice. Sakura, who trains as a medic, finds him at school.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Classmate' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Classmate' } },
    lines: [
      { speaker: 'sakura', furigana: 'ヒナタさん、あしを　けがしたって　[聞|き]いたよ。', en: 'Hinata, I heard you hurt your leg.' },
      { speaker: 'hinata', furigana: 'うん。れんしゅうで　たおれて、[一日|いちにち]　にゅういんした。', en: 'Yeah. I fell at practice and was in hospital for a day.' },
      { speaker: 'sakura', furigana: 'もう　たいいんしたの？', en: 'You’re already out of hospital?' },
      { speaker: 'hinata', furigana: 'きのう！　あしたから　また　れんしゅうする！', en: 'Yesterday! I’m back at practice from tomorrow!' },
      { speaker: 'sakura', furigana: 'だめ。すこし　やすんだら　どう？', en: 'No. Why don’t you rest for a while?' },
      { speaker: 'hinata', furigana: 'でも、うごかないと　ふとっちゃう。', en: 'But if I don’t move, I’ll get fat.' },
      { speaker: 'sakura', furigana: 'ふとらないよ。じゃあ、すこし　[歩|ある]いたら　どう？', en: 'You won’t. Then how about walking a little?' },
      { speaker: 'hinata', furigana: '[歩|ある]くのは　つまらない……。', en: 'Walking is boring...' },
      { speaker: 'sakura', furigana: 'かんごしさんも　「やすんで」って　[言|い]ったでしょう？', en: 'The nurse told you to rest too, didn’t she?' },
      { speaker: 'hinata', furigana: '……はい。じゃあ、ねながら　テレビで　しあいを　[見|み]る！', en: '...Yes. Then I’ll watch matches on TV lying down!' }
    ],
    remixes: [
      { scene: 'Sakura has one more idea.', en: 'Why don’t you go to bed early tonight?',
        chunks: ['こんばん', 'はやく', 'ねたら', 'どう？', 'ねて'], answer: ['こんばん', 'はやく', 'ねたら', 'どう？'],
        explain: 'A suggestion: た-form + ら + どう: ねた → ねたら どう？' },
      { scene: 'At the hospital, the nurse talks to Hinata.', en: 'Why don’t you walk a little?',
        chunks: ['すこし', 'あるいたら', 'どうですか。', 'あるくたら'], answer: ['すこし', 'あるいたら', 'どうですか。'],
        explain: 'たら comes from the た-form: あるいた + ら. どうですか is the polite version of どう.' }
    ],
    names: ['サクラ', 'ヒナタ'],
    uses: ['g:tara-dou', 'g:to-conditional', 'g:te-shimau', 'g:tte', 'g:deshou', 'g:nagara', 'g:kara', 'g:no', 'g:wo', 'g:de', 'g:mo', 'g:yo', 'v:さん|さん', 'v:足|あし', 'v:聞く|きく', 'v:練習|れんしゅう', 'v:倒れる|たおれる', 'v:一日|いちにち', 'v:入院|にゅういん', 'v:する|する', 'v:もう|もう', 'v:退院|たいいん', 'v:昨日|きのう', 'v:明日|あした', 'v:また|また', 'v:だめ|だめ', 'v:少し|すこし', 'v:休む|やすむ', 'v:どう|どう', 'v:でも|でも', 'v:動く|うごく', 'v:太る|ふとる', 'v:じゃあ|じゃあ', 'v:歩く|あるく', 'v:つまらない|つまらない', 'v:看護師|かんごし', 'v:言う|いう', 'v:寝る|ねる', 'v:テレビ|テレビ', 'v:試合|しあい', 'v:見る|みる', 'k:聞', 'k:一', 'k:日', 'k:歩', 'k:言', 'k:見'],
    notes: 'Hinata’s volleyball (by habit, not named), Sakura the medic. Hinata calls her a classmate, casual; his はい to her is a sulky yes.',
    verified: true }),

  L({ id: 'l:n4-dlg-kitchen-rules', format: 'dialogue',
    title: 'Kitchen rules', goal: 'You can give instructions for a situation with 〜場合は.',
    scene: 'Before service, Sanji goes through the restaurant’s rules with Sasuke.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Kitchen hand' } },
    lines: [
      { speaker: 'sanji', furigana: 'サスケさん、きょうは　[店|みせ]の　きそくを　おしえます。', en: 'Sasuke, today I’ll teach you the restaurant’s rules.' },
      { speaker: 'sasuke', furigana: '……はい。', en: '...Okay.' },
      { speaker: 'sanji', furigana: 'ひが　[出|で]た　ばあいは、みんなと　いっしょに　[外|そと]に　にげて　ください。', en: 'If there’s a fire, get outside together with everyone.' },
      { speaker: 'sasuke', furigana: '……ひを　けすのは？', en: '...What about putting it out?' },
      { speaker: 'sanji', furigana: 'ちいさい　ひの　ばあいは、これで　けして　ください。', en: 'If it’s a small fire, put it out with this.' },
      { speaker: 'sasuke', furigana: '……やすむ　ばあいは？', en: '...And if I need a day off?' },
      { speaker: 'sanji', furigana: 'でんわで　れんらくして　ください。ねつが　ある　ばあいは、[来|こ]ないで　くださいね。', en: 'Let me know by phone. If you have a fever, don’t come in, all right?' },
      { speaker: 'sasuke', furigana: '……ちゅういします。', en: '...I’ll be careful.' },
      { speaker: 'sanji', furigana: 'それから、いそいで　いる　ときも、ここでは　[走|はし]らないで　ください。', en: 'And even when you’re in a hurry, don’t run in here.' },
      { speaker: 'sasuke', furigana: '……サンジさんは　さっき　[走|はし]って　いました。ナミさんが　[来|き]た　ときに。', en: '...You were running just now. When Nami came in.' }
    ],
    remixes: [
      { scene: 'Sanji adds a rule for rainy days.', en: 'In case of rain, please come by train.',
        chunks: ['あめの', 'ばあいは、', 'でんしゃで', 'きて　ください。', 'あめ'], answer: ['あめの', 'ばあいは、', 'でんしゃで', 'きて　ください。'],
        explain: 'A noun takes の before ばあいは: あめの ばあいは. A verb comes straight before it (おくれる ばあいは).' },
      { scene: 'Sanji talks about being late.', en: 'If you are going to be late, please let me know.',
        chunks: ['おくれる', 'ばあいは、', 'れんらくして', 'ください。', 'おくれるの'], answer: ['おくれる', 'ばあいは、', 'れんらくして', 'ください。'],
        explain: 'A verb goes straight before ばあいは, without の: おくれる ばあいは.' }
    ],
    names: ['サンジ', 'サスケ', 'ナミ'],
    uses: ['g:baai-wa', 'g:te-kudasai', 'g:nai-de-kudasai', 'g:te-iru', 'g:noun-modifier', 'g:to', 'g:no', 'g:wo', 'g:ga', 'g:ni', 'g:de', 'g:mo', 'g:ne', 'v:さん|さん', 'v:今日|きょう', 'v:店|みせ', 'v:規則|きそく', 'v:教える|おしえる', 'v:火|ひ', 'v:出る|でる', 'v:場合|ばあい', 'v:みんな|みんな', 'v:一緒|いっしょ', 'v:外|そと', 'v:逃げる|にげる', 'v:消す|けす', 'v:小さい|ちいさい', 'v:これ|これ', 'v:休む|やすむ', 'v:電話|でんわ', 'v:連絡|れんらく', 'v:する|する', 'v:熱|ねつ', 'v:ある|ある', 'v:来る|くる', 'v:注意|ちゅうい', 'v:それから|それから', 'v:急ぐ|いそぐ', 'v:時|とき', 'v:ここ|ここ', 'v:走る|はしる', 'v:さっき|さっき', 'k:店', 'k:出', 'k:外', 'k:来', 'k:走'],
    notes: 'Part-time job thread: the fever rule calls back u040. Sanji runs when Nami arrives (series nod). The unit word 場合 (ばあい) takes the mark of every ばあい, so 〜場合は has no own mark (lib limit, see notes).',
    verified: true }),

  L({ id: 'l:n4-dlg-two-cakes', format: 'dialogue',
    title: 'Buy two', goal: 'You can say "if ~, then ~" with 〜ば / 〜れば.',
    scene: 'Nami finds Gojo-sensei at the cake counter of a department store.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Student' }, gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'nami', furigana: 'ゴジョウ[先生|せんせい]、おかしの　[売|う]り[場|ば]で　なにを　して　いるんですか。', en: 'Gojo-sensei, what are you doing at the sweets counter?' },
      { speaker: 'gojo', furigana: 'どの　ケーキが　いいか、かんがえて　いるんだ。', en: 'I’m thinking about which cake to get.' },
      { speaker: 'nami', furigana: 'それ、[二|ふた]つ　かえば　やすく　なりますよ。', en: 'If you buy two of those, they get cheaper.', say: 'それ、二つ買えば安くなりますよ。' },
      { speaker: 'gojo', furigana: 'ほんとう？　ねだんは？', en: 'Really? How much are they?' },
      { speaker: 'nami', furigana: '[一|ひと]つ　さんびゃく[円|えん]。[二|ふた]つで　ごひゃく[円|えん]です。', en: 'Three hundred yen for one. Five hundred for two.' },
      { speaker: 'gojo', furigana: 'じゃあ、[四|よっ]つ　かえば　もっと　やすい？', en: 'Then if I buy four, is it even cheaper?', say: 'じゃあ、四つ買えばもっと安い？' },
      { speaker: 'nami', furigana: 'はい！　それに、[先生|せんせい]が　はらえば、[一|ひと]つ　わたしに　くれても　いいですよ。', en: 'Yes! And if you pay, you can give one to me.', say: 'はい！それに、先生が払えば、一つ私にくれてもいいですよ。' },
      { speaker: 'gojo', furigana: 'はいはい。レジは　どこ？', en: 'Okay, okay. Where’s the till?' },
      { speaker: 'nami', furigana: 'あちらです。おつりは　わたしが　もらいますね。', en: 'Over there. I’ll take the change.' },
      { speaker: 'gojo', furigana: '……ナミさん、おきゃくさんより　お[店|みせ]の　[人|ひと]みたいだね。', en: '...Nami, you’re more like a shop assistant than a customer.' }
    ],
    remixes: [
      { scene: 'Gojo looks at the price of the cookies.', en: 'If they’re cheap, I’ll buy three.',
        chunks: ['やすければ、', 'みっつ', 'かう。', 'やすいば、'], answer: ['やすければ、', 'みっつ', 'かう。'],
        explain: 'An い-adjective: い → ければ: やすい → やすければ.' },
      { scene: 'Nami’s tip for the bakery.', en: 'If you go early, there’s plenty.',
        chunks: ['はやく', 'いけば、', 'たくさん', 'あります。', 'いくば、'], answer: ['はやく', 'いけば、', 'たくさん', 'あります。'],
        explain: 'A う-verb moves its last sound to the え-row + ば: いく → いけば.' }
    ],
    names: ['ナミ', 'ゴジョウ'],
    uses: ['g:ba', 'g:te-iru', 'g:n-desu', 'g:naru', 'g:sore-ni', 'g:te-mo-ii', 'g:mitai', 'g:ka', 'g:no', 'g:de', 'g:ga', 'g:ni', 'g:yo', 'g:ne', 'v:先生|せんせい', 'v:お菓子|おかし', 'v:売り場|うりば', 'v:何|なに', 'v:する|する', 'v:どの|どの', 'v:ケーキ|ケーキ', 'v:いい|いい', 'v:考える|かんがえる', 'v:それ|それ', 'v:二つ|ふたつ', 'v:買う|かう', 'v:安い|やすい', 'v:なる|なる', 'v:ほんとう|ほんとう', 'v:ねだん|ねだん', 'v:一つ|ひとつ', 'v:円|えん', 'v:じゃあ|じゃあ', 'v:四つ|よっつ', 'v:もっと|もっと', 'v:それに|それに', 'v:払う|はらう', 'v:私|わたし', 'v:くれる|くれる', 'v:レジ|レジ', 'v:どこ|どこ', 'v:あちら|あちら', 'v:おつり|おつり', 'v:もらう|もらう', 'v:さん|さん', 'v:客|きゃく', 'v:より|より', 'v:店|みせ', 'v:人|ひと', 'k:先', 'k:生', 'k:売', 'k:場', 'k:二', 'k:一', 'k:円', 'k:四', 'k:店', 'k:人'],
    notes: 'Nami and money, Gojo and sweets (series nods).',
    verified: true }),

  L({ id: 'l:n4-dlg-twenty-points', format: 'dialogue',
    title: 'Twenty points', goal: 'You can say what you should (not) have done with 〜ばよかった.',
    scene: 'Anya comes home with a test paper and a long face.',
    cast: { anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' }, yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' } },
    lines: [
      { speaker: 'anya', furigana: 'はは……テスト、にじゅってん。', en: 'Mama... the test, twenty points.' },
      { speaker: 'yor', furigana: 'まあ……。テストを　うけたのは　いつでしたか。', en: 'Oh dear... When did you take the test?' },
      { speaker: 'anya', furigana: 'きのう。べんきょう　すれば　よかった。', en: 'Yesterday. Anya should have studied.' },
      { speaker: 'yor', furigana: '[前|まえ]の　[日|ひ]に　なにを　して　いましたか。', en: 'What were you doing the day before?' },
      { speaker: 'anya', furigana: 'テレビを　[見|み]て　いた。[見|み]なければ　よかった。', en: 'Watching TV. Anya shouldn’t have watched it.' },
      { speaker: 'yor', furigana: 'わたしも　こどもの　とき、そうでした。', en: 'I was the same when I was a child.' },
      { speaker: 'anya', furigana: 'ははも？', en: 'Mama too?' },
      { speaker: 'yor', furigana: 'はい。でも、まいにち　すこしずつ　べんきょうする　しゅうかんを　つけたら、だいぶ　よく　なりました。', en: 'Yes. But once I got into the habit of studying a little every day, I got a lot better.' },
      { speaker: 'anya', furigana: 'しゅうかん……？　アーニャ、すっかり　わすれてた。きょうの　しゅくだいも！', en: 'A habit...? Anya completely forgot. Today’s homework too!' },
      { speaker: 'yor', furigana: 'では、いまから　いっしょに　しましょう。', en: 'Then let’s do it together, starting now.' }
    ],
    remixes: [
      { scene: 'It starts to rain on Anya’s way home.', en: 'I should have brought an umbrella.',
        chunks: ['かさを', 'もって', 'くれば', 'よかった。', 'くると'], answer: ['かさを', 'もって', 'くれば', 'よかった。'],
        explain: 'Regret: ば-form + よかった. くる → くれば: もって くれば よかった (I wish I had brought it).' },
      { scene: 'Yor was late for work in the morning.', en: 'I should have got up early.',
        chunks: ['はやく', 'おきれば', 'よかった。', 'おきるば'], answer: ['はやく', 'おきれば', 'よかった。'],
        explain: 'A る-verb: る → れば: おきる → おきれば よかった.' }
    ],
    names: ['アーニャ', 'ヨル'],
    uses: ['g:ba-yokatta', 'g:ba', 'g:tara', 'g:te-iru', 'g:te-ita', 'g:noun-modifier', 'g:mashou', 'g:deshita', 'g:no', 'g:wo', 'g:ni', 'g:mo', 'g:ka', 'v:母|はは', 'v:テスト|テスト', 'v:点|てん', 'v:受ける|うける', 'v:いつ|いつ', 'v:昨日|きのう', 'v:勉強|べんきょう', 'v:する|する', 'v:前|まえ', 'v:日|ひ', 'v:何|なに', 'v:テレビ|テレビ', 'v:見る|みる', 'v:私|わたし', 'v:子供|こども', 'v:時|とき', 'v:そう|そう', 'v:でも|でも', 'v:毎日|まいにち', 'v:少し|すこし', 'v:ずつ|ずつ', 'v:習慣|しゅうかん', 'v:つける|つける', 'v:大分|だいぶ', 'v:よく|よく', 'v:なる|なる', 'v:すっかり|すっかり', 'v:忘れる|わすれる', 'v:今日|きょう', 'v:宿題|しゅくだい', 'v:では|では', 'v:今|いま', 'v:一緒|いっしょ', 'k:前', 'k:日', 'k:見'],
    notes: 'Anya’s school thread (bad at tests, true to the series). わすれてた is the casual ていた.',
    verified: true }),

  L({ id: 'l:n4-dlg-rice-and-miso', format: 'dialogue',
    title: 'If it’s rice…', goal: 'You can say "if it’s ~ (then)" with 〜なら.',
    scene: 'Killua drops into Sanji’s kitchen to ask what is for dinner.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Boy' } },
    lines: [
      { speaker: 'killua', furigana: 'サンジさん、きょうの　ばんごはん、なに？', en: 'Sanji, what’s for dinner today?' },
      { speaker: 'sanji', furigana: 'キルアさんは　なにが　[食|た]べたいですか。', en: 'What would you like to eat, Killua?' },
      { speaker: 'killua', furigana: 'さかなと　ごはん。', en: 'Fish and rice.' },
      { speaker: 'sanji', furigana: 'ごはんなら、この　おこめが　いちばんです。きのう　かいました。', en: 'If it’s rice, this rice is the best. I bought it yesterday.' },
      { speaker: 'killua', furigana: 'その　こめ、ゆにゅうした　もの？', en: 'Is that rice imported?' },
      { speaker: 'sanji', furigana: 'いいえ、この　くにの　こめです。でも、この　みそは　ゆにゅうした　ものです。', en: 'No, it’s rice from this country. But this miso is imported.' },
      { speaker: 'killua', furigana: 'じゃあ、さかなは？', en: 'And the fish?' },
      { speaker: 'sanji', furigana: 'さかななら、もう　やけて　いますよ。', en: 'If it’s the fish you mean, it’s already grilled.' },
      { speaker: 'killua', furigana: '……おとなの　のみものは？', en: '...What about a grown-up drink?' },
      { speaker: 'sanji', furigana: 'アルコールなら、だめです。キルアさんは　こどもでしょう。', en: 'If you mean alcohol, no. You’re a child.' }
    ],
    remixes: [
      { scene: 'Sanji recommends a drink instead.', en: 'If it’s tea, this one is good.',
        chunks: ['おちゃなら、', 'これが', 'いいです。', 'おちゃたら、'], answer: ['おちゃなら、', 'これが', 'いいです。'],
        explain: 'A noun takes なら straight after it: おちゃなら (if it’s tea). おちゃたら is not a form.' },
      { scene: 'Killua says he is going out.', en: 'If you’re going shopping, buy some rice.',
        chunks: ['かいものに', 'いくなら、', 'こめを', 'かって　きて。', 'いくたら、'], answer: ['かいものに', 'いくなら、', 'こめを', 'かって　きて。'],
        explain: 'なら after the dictionary form: いくなら (if you are going). The rice is bought before or on the way.' }
    ],
    names: ['サンジ', 'キルア'],
    uses: ['g:nara', 'g:tai', 'g:te-iru', 'g:noun-modifier', 'g:deshou', 'g:to', 'g:no', 'g:ga', 'g:yo', 'g:ka', 'v:さん|さん', 'v:今日|きょう', 'v:晩御飯|ばんごはん', 'v:何|なに', 'v:食べる|たべる', 'v:魚|さかな', 'v:御飯|ごはん', 'v:この|この', 'v:米|こめ', 'v:一番|いちばん', 'v:昨日|きのう', 'v:買う|かう', 'v:その|その', 'v:輸入|ゆにゅう', 'v:する|する', 'v:物|もの', 'v:国|くに', 'v:でも|でも', 'v:味噌|みそ', 'v:じゃあ|じゃあ', 'v:もう|もう', 'v:焼ける|やける', 'v:大人|おとな', 'v:飲み物|のみもの', 'v:アルコール|アルコール', 'v:だめ|だめ', 'v:子供|こども', 'k:食'],
    notes: 'The plan title says sushi; the catalog has no すし, so the scene uses rice and fish. いいえ is a plain reply (いいえ is unverified: kept out of uses).',
    verified: true }),

  L({ id: 'l:n4-dlg-silver-flower', format: 'dialogue',
    title: 'Even after dark', goal: 'You can say "even if ~" with 〜ても / 〜でも.',
    scene: 'Late afternoon in the forest. Emilia helps Frieren-sensei look for a rare flower.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Student' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'emilia', furigana: 'フリーレン[先生|せんせい]、もう　[日|ひ]が　くれますよ。', en: 'Frieren-sensei, the sun is going down already.' },
      { speaker: 'frieren', furigana: '……[日|ひ]が　くれても、かえらない。あの　はなを　みつけたい。', en: '...Even if it gets dark, I’m not going home. I want to find that flower.' },
      { speaker: 'emilia', furigana: 'どんな　はなですか。', en: 'What kind of flower is it?' },
      { speaker: 'frieren', furigana: '……もりの　なかで　さく　[白|しろ]い　はな。よるに　なると、ひかる。', en: '...A white flower that blooms in the forest. When night comes, it glows.' },
      { speaker: 'emilia', furigana: 'でも、くらく　なっても　だいじょうぶですか。むしも　いますよ。', en: 'But will we be all right even when it gets dark? There are insects too.' },
      { speaker: 'frieren', furigana: '……むしが　いても、いい。', en: '...Even if there are insects, it doesn’t matter.' },
      { speaker: 'emilia', furigana: 'あ、あの　えだの　したの　くさが　ひかって　います！', en: 'Oh, the grass under that branch is glowing!' },
      { speaker: 'frieren', furigana: '……あった。', en: '...There it is.' },
      { speaker: 'emilia', furigana: 'きれい……。はやしや　もりで　[見|み]たのは　はじめてです。', en: 'Beautiful... It’s the first time I’ve seen one in the woods or the forest.' },
      { speaker: 'frieren', furigana: '……まえは　なんかい　[来|き]ても　なかった。エミリアさんの　おかげだね。', en: '...Before, it was never here, however many times I came. It’s thanks to you, Emilia.' }
    ],
    unmark: [{ text: 'は', ctx: 'のは' }],
    remixes: [
      { scene: 'Emilia promises to come back tomorrow.', en: 'Even if it rains, I’ll come.',
        chunks: ['あめが', 'ふっても', 'きます。', 'ふるても'], answer: ['あめが', 'ふっても', 'きます。'],
        explain: 'Even if: て-form + も: ふる → ふって + も. ふるても is not a form.' },
      { scene: 'Frieren finds an old book of spells at a stall.', en: 'Even if it’s expensive, I’ll buy it.',
        chunks: ['たかくても', 'かう。', 'たかいても'], answer: ['たかくても', 'かう。'],
        explain: 'An い-adjective: い → くても: たかい → たかくても.' }
    ],
    names: ['エミリア', 'フリーレン'],
    uses: ['g:te-mo', 'g:tai', 'g:to-conditional', 'g:naru', 'g:te-iru', 'g:noun-modifier', 'g:ga-imasu', 'g:ya', 'g:no', 'g:de', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'v:先生|せんせい', 'v:もう|もう', 'v:日|ひ', 'v:暮れる|くれる', 'v:帰る|かえる', 'v:あの|あの', 'v:花|はな', 'v:見つける|みつける', 'v:どんな|どんな', 'v:森|もり', 'v:中|なか', 'v:咲く|さく', 'v:白い|しろい', 'v:夜|よる', 'v:なる|なる', 'v:光る|ひかる', 'v:でも|でも', 'v:暗い|くらい', 'v:大丈夫|だいじょうぶ', 'v:虫|むし', 'v:居る|いる', 'v:いい|いい', 'v:枝|えだ', 'v:下|した', 'v:草|くさ', 'v:ある|ある', 'v:きれい|きれい', 'v:林|はやし', 'v:見る|みる', 'v:初めて|はじめて', 'v:前|まえ', 'v:何|なん', 'v:回|かい', 'v:来る|くる', 'v:さん|さん', 'v:おかげ|おかげ', 'k:先', 'k:生', 'k:日', 'k:白', 'k:見', 'k:来'],
    notes: 'Frieren collecting rare things (series nod). The one-kana 葉 (は) is not used: it would need special care in speech.',
    verified: true }),

  L({ id: 'l:n4-dlg-chess-beginner', format: 'dialogue',
    title: 'Beginner’s luck', goal: 'You can say "even though ~" (with surprise or annoyance) with 〜のに.',
    scene: 'Sasuke has just beaten Lelouch at chess, the day after learning the game.',
    cast: { lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Chess player' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Beginner' } },
    lines: [
      { speaker: 'lelouch', furigana: 'サスケさん、チェスを　ならったのは　きのうなのに、もう　つよいね。', en: 'Sasuke, you only learned chess yesterday, and you’re already strong.' },
      { speaker: 'sasuke', furigana: '……そうか。', en: '...Is that so.' },
      { speaker: 'lelouch', furigana: 'わたしは　まじめに　[十|じゅう][年|ねん]も　べんきょうして　いるのに。', en: 'Even though I’ve studied it seriously for ten years.' },
      { speaker: 'sasuke', furigana: '……ルルーシュさんは　ねっしんだからな。', en: '...You’re keen, that’s why.' },
      { speaker: 'lelouch', furigana: 'きみは　チェスに　きょうみが　あるの？', en: 'Are you interested in chess?' },
      { speaker: 'sasuke', furigana: '……ない。', en: '...No.' },
      { speaker: 'lelouch', furigana: 'きょうみが　ないのに、どうして　かてるんだ。', en: 'You’re not interested, so how can you win?' },
      { speaker: 'sasuke', furigana: '……ルルーシュさんの　[手|て]を　よく　[見|み]て　いた。', en: '...I watched your moves closely.' },
      { speaker: 'lelouch', furigana: '……おどろいた。とうとう　まけたよ。', en: '...I’m amazed. I finally lost.' },
      { speaker: 'sasuke', furigana: '……もう[一|いち]ど　やるか。', en: '...Another game?' }
    ],
    bridge: [
      { text: 'チェス', gloss: 'チェス = chess' }
    ],
    remixes: [
      { scene: 'Lelouch goes out to buy a new chess set.', en: 'Even though it’s Sunday, the shop is closed.',
        chunks: ['にちようびなのに、', 'みせが', 'しまって　いる。', 'にちようびのに、'], answer: ['にちようびなのに、', 'みせが', 'しまって　いる。'],
        explain: 'A noun takes な before のに: にちようびなのに. Without な it is not correct.' },
      { scene: 'Sasuke tries to remember a chess rule.', en: 'Even though I studied it, I forgot.',
        chunks: ['べんきょうしたのに、', 'わすれた。', 'べんきょうしたなのに、'], answer: ['べんきょうしたのに、', 'わすれた。'],
        explain: 'A verb takes のに straight after it, without な: べんきょうしたのに.' }
    ],
    names: ['ルルーシュ', 'サスケ'],
    uses: ['g:noni', 'g:potential', 'g:kara', 'g:doushite', 'g:te-iru', 'g:te-ita', 'g:mo', 'g:no', 'g:wo', 'g:ni', 'g:ga', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:習う|ならう', 'v:昨日|きのう', 'v:もう|もう', 'v:強い|つよい', 'v:そう|そう', 'v:私|わたし', 'v:真面目|まじめ', 'v:十|じゅう', 'v:年|ねん', 'v:勉強|べんきょう', 'v:する|する', 'v:熱心|ねっしん', 'v:君|きみ', 'v:興味|きょうみ', 'v:ある|ある', 'v:ない|ない', 'v:どうして|どうして', 'v:勝つ|かつ', 'v:手|て', 'v:よく|よく', 'v:見る|みる', 'v:驚く|おどろく', 'v:とうとう|とうとう', 'v:負ける|まける', 'v:もう一度|もういちど', 'v:やる|やる', 'k:十', 'k:年', 'k:手', 'k:見', 'k:一'],
    notes: 'Lelouch and chess (series nod). Sasuke wins by watching (his sharp eyes, by habit). チェス is a bridge.',
    verified: true }),
  L({ id: 'l:n4-dlg-island-ride', format: 'dialogue',
    title: 'Round the island', goal: 'You can suggest or decide something among friends with the volitional form (〜よう / 〜おう).',
    scene: 'Emilia and Nami’s winter trip: on the island, Nami has rented a motorbike.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'nami', furigana: 'エミリアさん、オートバイを　かりて　きたよ！　しまを　まわろう。', en: 'Emilia, I’ve rented a motorbike! Let’s go round the island.' },
      { speaker: 'emilia', furigana: 'わあ、いいね！　でも、ガソリンは　だいじょうぶ？', en: 'Wow, great! But is there enough petrol?' },
      { speaker: 'nami', furigana: '……あ、すくない。さきに　ガソリンスタンドへ　[行|い]こう。', en: '...Oh, it’s low. Let’s go to a petrol station first.' },
      { speaker: 'emilia', furigana: 'うん。その　あとで、きのうの　おばあさんを　たずねようか。みちを　おしえて　くれた　ひと。', en: 'Okay. After that, shall we visit the old lady from yesterday? The one who showed us the way.' },
      { speaker: 'nami', furigana: 'いいね。あの　ひとの　いえは　みなとの　ちかくだったね。', en: 'Good idea. Her house was near the port, wasn’t it?' },
      { speaker: 'emilia', furigana: 'うん。むかし、ふねで　まちの　[病院|びょういん]に　かよって　いたんだって。[医|い]しゃだったの。', en: 'Yes. She said she used to go to the hospital in town by boat. She was a doctor.' },
      { speaker: 'nami', furigana: 'そうなんだ。じゃあ、みなとを　とおって　[行|い]こう。', en: 'Really? Then let’s go by way of the port.' },
      { speaker: 'emilia', furigana: '……ナミさん、いま　ガソリンスタンドを　すぎちゃったよ。', en: '...Nami, we just went past the petrol station.' },
      { speaker: 'nami', furigana: 'あっ！　もどろう。……ガソリンの　おかねは　はんぶんずつね。', en: 'Oh! Let’s go back. ...We split the petrol money half and half, okay?' },
      { speaker: 'emilia', furigana: 'きょうは　ナミさんも　はらうんだね。', en: 'So today you’re paying too, Nami.' }
    ],
    remixes: [
      { scene: 'Emilia has an idea for tomorrow.', en: 'Tomorrow, let’s look at the sea from the boat.',
        chunks: ['あしたは', 'ふねから', 'うみを', 'みよう。', 'みろう。'], answer: ['あしたは', 'ふねから', 'うみを', 'みよう。'],
        explain: 'みる is a る-verb: る → よう gives みよう. みろう is not a form.' },
      { scene: 'The motorbike will not start, so Nami changes the plan.', en: 'Let’s walk to the port.',
        chunks: ['みなとまで', 'あるこう。', 'あるきよう。'], answer: ['みなとまで', 'あるこう。'],
        explain: 'あるく is an う-verb: the last sound く moves to こ, then う: あるこう.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:volitional', 'g:te-kuru', 'g:te-kureru', 'g:noun-modifier', 'g:tte', 'g:te-ita', 'g:te-shimau', 'g:ni-ikimasu', 'g:wo', 'g:ni', 'g:de', 'g:no', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:オートバイ|オートバイ', 'v:借りる|かりる', 'v:島|しま', 'v:回る|まわる', 'v:いい|いい', 'v:でも|でも', 'v:ガソリン|ガソリン', 'v:大丈夫|だいじょうぶ', 'v:少ない|すくない', 'v:先|さき', 'v:ガソリンスタンド|ガソリンスタンド', 'v:行く|いく', 'v:その|その', 'v:後|あと', 'v:昨日|きのう', 'v:おばあさん|おばあさん', 'v:訪ねる|たずねる', 'v:道|みち', 'v:教える|おしえる', 'v:人|ひと', 'v:あの|あの', 'v:家|いえ', 'v:港|みなと', 'v:近く|ちかく', 'v:昔|むかし', 'v:舟|ふね', 'v:町|まち', 'v:病院|びょういん', 'v:通う|かよう', 'v:医者|いしゃ', 'v:そう|そう', 'v:じゃあ|じゃあ', 'v:通る|とおる', 'v:今|いま', 'v:過ぎる|すぎる', 'v:戻る|もどる', 'v:お金|おかね', 'v:半分|はんぶん', 'v:ずつ|ずつ', 'v:今日|きょう', 'v:払う|はらう', 'k:行', 'k:病', 'k:院', 'k:医'],
    notes: 'Trip thread, part 3 (u061 island inn): touring the island. Nami’s money nod (she said in u061 she would borrow from Emilia). うん is a plain reply (unverified item, kept out of uses).',
    verified: true }),

  L({ id: 'l:n4-dlg-new-year-plans', format: 'dialogue',
    title: 'This year', goal: 'You can say what you are planning to do with 〜ようと思う.',
    scene: 'The first school day of the year, in the staff room. Kakashi-sensei asks Frieren-sensei about her plans.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'kakashi', furigana: 'フリーレン[先生|せんせい]、ことしは　なにを　しようと　おもって　いますか。', en: 'Frieren-sensei, what are you thinking of doing this year?' },
      { speaker: 'frieren', furigana: '……[古|ふる]い　まほうの　[本|ほん]を　さがそうと　おもって　います。', en: '...I’m thinking of looking for old books of magic.' },
      { speaker: 'kakashi', furigana: 'また　まほうですか。やくに　たつんですか。', en: 'Magic again? Is it useful?' },
      { speaker: 'frieren', furigana: '……やくに　たたない　まほうばかりです。でも、それで　いい。', en: '...It’s nothing but useless magic. But that’s fine.' },
      { speaker: 'kakashi', furigana: 'なるほど。わたしは　ことし、できるだけ　はやく　[来|こ]ようと　おもって　います。', en: 'I see. This year I intend to come in as early as I can.' },
      { speaker: 'frieren', furigana: '……[去年|きょねん]も　そう　[言|い]って　いました。', en: '...You said that last year too.' },
      { speaker: 'kakashi', furigana: 'ことしは　ほんとうですよ。とけいを　[三|みっ]つ　えらんで　かいました。', en: 'This year I mean it. I picked out three clocks and bought them.' },
      { speaker: 'frieren', furigana: '……その　とけいは、やくに　たちますか。', en: '...Will those clocks be useful?' },
      { speaker: 'kakashi', furigana: 'それは……。あさ　はやく　おきるのには、まだ　なれて　いませんが。', en: 'Well... I’m not used to getting up early yet, though.' },
      { speaker: 'frieren', furigana: '……では、カカシ[先生|せんせい]を　まちながら、まほうを　[一|ひと]つ　おぼえようと　おもいます。', en: '...Then I’ll learn one spell while I wait for you, Kakashi-sensei.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Frieren tells Kakashi what she will do after work today.', en: 'Today I’m thinking of going home early.',
        chunks: ['きょうは', 'はやく', 'かえろうと', 'おもいます。', 'かえようと'], answer: ['きょうは', 'はやく', 'かえろうと', 'おもいます。'],
        explain: 'かえる (go home) is an う-verb, even though it ends in える: かえる → かえろう. かえよう is a different verb (change).' },
      { scene: 'Kakashi has another plan for the new year.', en: 'I’m thinking of reading a book every month.',
        chunks: ['まいつき', 'ほんを', 'よもうと', 'おもって　います。', 'よみようと'], answer: ['まいつき', 'ほんを', 'よもうと', 'おもって　います。'],
        explain: 'よむ is an う-verb: む → も + う = よもう, then と おもって います for a plan you already have.' }
    ],
    names: ['フリーレン', 'カカシ'],
    uses: ['g:you-to-omou', 'g:volitional', 'g:te-iru', 'g:n-desu', 'g:nagara', 'g:wo', 'g:no', 'g:ni', 'g:wa-desu', 'g:ka', 'g:mo', 'g:yo', 'g:ga', 'v:先生|せんせい', 'v:今年|ことし', 'v:何|なに', 'v:する|する', 'v:思う|おもう', 'v:古い|ふるい', 'v:本|ほん', 'v:探す|さがす', 'v:また|また', 'v:役に立つ|やくにたつ', 'v:ばかり|ばかり', 'v:でも|でも', 'v:それで|それで', 'v:いい|いい', 'v:なるほど|なるほど', 'v:私|わたし', 'v:できるだけ|できるだけ', 'v:早い|はやい', 'v:来る|くる', 'v:去年|きょねん', 'v:そう|そう', 'v:言う|いう', 'v:ほんとう|ほんとう', 'v:時計|とけい', 'v:三つ|みっつ', 'v:選ぶ|えらぶ', 'v:買う|かう', 'v:その|その', 'v:それ|それ', 'v:朝|あさ', 'v:起きる|おきる', 'v:まだ|まだ', 'v:慣れる|なれる', 'v:では|では', 'v:待つ|まつ', 'v:一つ|ひとつ', 'v:覚える|おぼえる', 'k:先', 'k:生', 'k:古', 'k:本', 'k:来', 'k:去', 'k:年', 'k:言', 'k:三', 'k:一'],
    notes: 'Kakashi-late thread (b1 u005, u018; b2 u058) and Frieren collecting spells. まほう is a bridge (as in batch 1).',
    verified: true }),

  L({ id: 'l:n4-dlg-made-up-mind', format: 'dialogue',
    title: 'I’ve decided', goal: 'You can report a decision with 〜ことにする / 〜ことにした.',
    scene: 'At the pharmacy where Sakura trains, Maomao notices she keeps making mistakes.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Trainee' }, maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' } },
    lines: [
      { speaker: 'maomao', furigana: 'サクラさん、きょうは　くすりの　なまえを　よく　まちがえますね。', en: 'Sakura, you keep getting the medicine names wrong today.' },
      { speaker: 'sakura', furigana: 'すみません……。きのう、サスケさんと　けんかを　したんです。', en: 'I’m sorry... Yesterday I had a fight with Sasuke.' },
      { speaker: 'maomao', furigana: 'そうですか。それは　くすりと　かんけい　ありません。', en: 'I see. That has nothing to do with medicine.' },
      { speaker: 'sakura', furigana: 'つめたい！　……わたし、もう　サスケさんと　[話|はな]さない　ことに　しました。', en: 'So cold! ...I’ve decided not to talk to Sasuke any more.' },
      { speaker: 'maomao', furigana: 'なにが　[悪|わる]かったんですか。', en: 'What went wrong?' },
      { speaker: 'sakura', furigana: 'サスケさんが　やくそくに　おくれて、わたしが　おこって　[帰|かえ]って　しまったんです。', en: 'Sasuke was late for our date, and I got angry and went home.' },
      { speaker: 'maomao', furigana: 'では、どちらも　[少|すこ]し　[悪|わる]いですね。', en: 'Then you were both a little in the wrong.' },
      { speaker: 'sakura', furigana: '……そうですね。きょう、わたしから　あやまる　ことに　します。', en: '...You’re right. I’ll be the one to apologise, today.' },
      { speaker: 'maomao', furigana: 'きまりましたね。では、もう　[帰|かえ]って　いいですよ。たなは　わたしが　[代|か]わりに　かたづけます。', en: 'That’s settled, then. You can go home now. I’ll tidy the shelves instead of you.' },
      { speaker: 'sakura', furigana: 'マオマオさん……。つめたく　なかった！', en: 'Maomao... You weren’t cold after all!' }
    ],
    remixes: [
      { scene: 'Sakura makes one more decision for tomorrow.', en: 'I’ve decided to make him a fish dish.',
        chunks: ['さかなの', 'りょうりを', 'つくる', 'ことに', 'しました。', 'つくった'], answer: ['さかなの', 'りょうりを', 'つくる', 'ことに', 'しました。'],
        explain: 'ことに する takes the dictionary form (つくる), even when the decision is in the past: つくる ことに しました.' },
      { scene: 'Maomao talks about her own day off.', en: 'I’ve decided not to go out on Sundays.',
        chunks: ['にちようびは', 'でかけない', 'ことに', 'しました。', 'でかけなくて'], answer: ['にちようびは', 'でかけない', 'ことに', 'しました。'],
        explain: 'Not to do: the ない-form + ことに する: でかけない ことに しました.' }
    ],
    names: ['サクラ', 'マオマオ', 'サスケ'],
    uses: ['g:koto-ni-suru', 'g:n-desu', 'g:te-shimau', 'g:to', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'g:ka', 'v:さん|さん', 'v:今日|きょう', 'v:薬|くすり', 'v:名前|なまえ', 'v:よく|よく', 'v:間違える|まちがえる', 'v:昨日|きのう', 'v:けんか|けんか', 'v:する|する', 'v:そう|そう', 'v:それ|それ', 'v:関係|かんけい', 'v:ある|ある', 'v:冷たい|つめたい', 'v:私|わたし', 'v:もう|もう', 'v:話す|はなす', 'v:何|なに', 'v:悪い|わるい', 'v:約束|やくそく', 'v:遅れる|おくれる', 'v:怒る|おこる', 'v:帰る|かえる', 'v:では|では', 'v:どちら|どちら', 'v:少し|すこし', 'v:謝る|あやまる', 'v:決まる|きまる', 'v:いい|いい', 'v:棚|たな', 'v:代わり|かわり', 'v:片付ける|かたづける', 'k:話', 'k:悪', 'k:帰', 'k:少', 'k:代'],
    notes: 'Sasuke + Sakura thread: a small quarrel, made up off stage (u081 shows them planning a day out); Sakura still trains at Maomao’s pharmacy (b1 u033).',
    verified: true }),

  L({ id: 'l:n4-dlg-lost-notebook', format: 'dialogue',
    title: 'Whether it’s there', goal: 'You can say "whether or not ~" with 〜かどうか.',
    scene: 'After school, Emilia helps out in the library at Anya’s school. Anya has lost her notebook.',
    cast: { anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' }, emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Library helper' } },
    lines: [
      { speaker: 'anya', furigana: 'エミリアさん、アーニャの　ノート、みつからない。', en: 'Emilia, I can’t find my notebook.' },
      { speaker: 'emilia', furigana: 'え？　どこに　おいたか、おぼえて　いる？', en: 'Oh? Do you remember where you put it?' },
      { speaker: 'anya', furigana: '[図|と][書|しょ]かんに　もって　きたかどうか、わからない。', en: 'I don’t know whether I brought it to the library.' },
      { speaker: 'emilia', furigana: 'じゃあ、だれかが　ひろったかどうか、[先生|せんせい]に　きいて　みよう。', en: 'Then let’s ask the teacher whether someone picked it up.', say: 'じゃあ、誰かが拾ったかどうか、先生に聞いてみよう。' },
      { speaker: 'anya', furigana: 'あ、ベルが　なった！　……いまの　ベル、きこえた？', en: 'Oh, the bell rang! ...Did you hear that bell?' },
      { speaker: 'emilia', furigana: 'うん、きこえた。でも、さがすのが　すむまで、ここに　いて　いいよ。', en: 'Yes, I heard it. But you can stay here until we’ve finished looking.' },
      { speaker: 'anya', furigana: '……あった！　ほんだなの　うえ！', en: '...Found it! On top of the bookshelf!' },
      { speaker: 'emilia', furigana: 'よかった。でも、アーニャさんのかどうか、なかを　[見|み]て　みて。', en: 'Thank goodness. But look inside and check whether it’s yours.', say: 'よかった。でも、アーニャさんのかどうか、中を見てみて。' },
      { speaker: 'anya', furigana: 'アーニャの　なまえ、かいて　ある。……ピーナッツの　えも。', en: 'My name is written on it. ...And a picture of peanuts.' },
      { speaker: 'emilia', furigana: 'ほんとうだ。じゃあ、[教室|きょうしつ]まで　いっしょに　[行|い]こう。', en: 'So it is. Then let’s go to your classroom together.' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Anya cannot remember something else either.', en: 'I don’t know whether I wore my hat today.',
        chunks: ['きょう', 'ぼうしを', 'かぶって', 'きたかどうか', 'わからない。', 'きましたかどうか'], answer: ['きょう', 'ぼうしを', 'かぶって', 'きたかどうか', 'わからない。'],
        explain: 'Before かどうか the verb is in the plain form, even in a polite sentence: きたか どうか, not きましたか どうか.' },
      { scene: 'Emilia wants to come back at the weekend.', en: 'Let’s ask whether the library is open on Sunday.',
        chunks: ['にちようびに', 'としょかんが', 'あいて　いるかどうか', 'きいて　みよう。', 'あいて　いますかどうか'], answer: ['にちようびに', 'としょかんが', 'あいて　いるかどうか', 'きいて　みよう。'],
        explain: 'A yes / no question inside a sentence: plain form + か どうか (あいて いるか どうか).' }
    ],
    names: ['アーニャ', 'エミリア'],
    uses: ['g:ka-dou-ka', 'g:volitional', 'g:te-miru', 'g:te-iru', 'g:te-aru', 'g:made', 'g:no', 'g:ni', 'g:ga', 'g:wo', 'g:mo', 'g:yo', 'v:さん|さん', 'v:ノート|ノート', 'v:見つかる|みつかる', 'v:どこ|どこ', 'v:置く|おく', 'v:覚える|おぼえる', 'v:図書館|としょかん', 'v:持つ|もつ', 'v:分かる|わかる', 'v:じゃあ|じゃあ', 'v:誰か|だれか', 'v:拾う|ひろう', 'v:先生|せんせい', 'v:聞く|きく', 'v:ベル|ベル', 'v:鳴る|なる', 'v:今|いま', 'v:聞こえる|きこえる', 'v:でも|でも', 'v:探す|さがす', 'v:済む|すむ', 'v:ここ|ここ', 'v:居る|いる', 'v:いい|いい', 'v:ある|ある', 'v:本棚|ほんだな', 'v:上|うえ', 'v:中|なか', 'v:見る|みる', 'v:名前|なまえ', 'v:書く|かく', 'v:絵|え', 'v:ほんとう|ほんとう', 'v:教室|きょうしつ', 'v:一緒|いっしょ', 'v:行く|いく', 'k:図', 'k:書', 'k:先', 'k:生', 'k:見', 'k:教', 'k:室', 'k:行'],
    notes: 'Anya’s school thread. 図書館 is written [図|と][書|しょ]かん (館 comes in u078). ピーナッツ is a bridge (as in batches 1 and 2). うん, a plain reply, kept out of uses.',
    verified: true }),

  L({ id: 'l:n4-dlg-house-rules', format: 'dialogue',
    title: 'House rules', goal: 'You can say what someone must do with 〜なければならない / 〜なければいけない.',
    scene: 'A month after the move, Nami, the agent, goes over the boarding-house rules with Hinata.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Agent' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Lodger' } },
    lines: [
      { speaker: 'nami', furigana: 'ヒナタさん、げしゅくの　きそくを　もう[一|いち]ど　せつめいするよ。', en: 'Hinata, I’ll go over the boarding-house rules once more.' },
      { speaker: 'hinata', furigana: 'はい！　おねがいします！', en: 'Okay! Go ahead!' },
      { speaker: 'nami', furigana: 'ごみは　かようびの　あさ　[八|はち][時|じ]までに　ださなければ　ならない。', en: 'Rubbish has to go out by eight on Tuesday morning.' },
      { speaker: 'hinata', furigana: '[八|はち][時|じ]……あさの　れんしゅうの　まえですね。わかりました！', en: 'Eight... That’s before morning practice. Got it!' },
      { speaker: 'nami', furigana: 'それから、ガスの　ひは　つかった　あとで　かならず　けさなければ　いけないよ。', en: 'And after you use the gas, you must always turn it off.' },
      { speaker: 'hinata', furigana: 'はい！　……あの、かべを　つかって　バレーボールの　れんしゅうを　しても　いいですか。', en: 'Okay! ...Um, can I practise volleyball against the wall?' },
      { speaker: 'nami', furigana: 'だめ。となりの　へやに　おとが　きこえるでしょう。', en: 'No. The room next door will hear the noise.' },
      { speaker: 'hinata', furigana: 'じゃあ、れんしゅうの　どうぐは　おしいれか　へやの　すみに　おきます。', en: 'Then I’ll keep my practice things in the closet or in the corner of the room.' },
      { speaker: 'nami', furigana: 'いいよ。……あと、へやと　すいどうの　おかねは、まいつき　[二|に][十|じゅう][五|ご][日|にち]までに　はらわなければ　ならないからね。', en: 'Fine. ...Oh, and the rent and the water bill must be paid by the twenty-fifth of every month.', say: 'いいよ。……あと、部屋と水道のお金は、毎月にじゅうごにちまでに払わなければならないからね。' },
      { speaker: 'hinata', furigana: '……ナミさん、それが　いちばん　だいじな　きそくですね。', en: '...Nami, that’s the most important rule, isn’t it?' }
    ],
    bridge: [
      { text: 'バレーボール', gloss: 'バレーボール = volleyball' }
    ],
    remixes: [
      { scene: 'Nami adds a rule about the shared kitchen.', en: 'After eating, you must wash up.',
        chunks: ['たべた', 'あとで', 'あらわなければ', 'ならない。', 'あらうなければ'], answer: ['たべた', 'あとで', 'あらわなければ', 'ならない。'],
        explain: 'Must: the ない-form without い + ければ: あらわない → あらわなければ ならない.' },
      { scene: 'Hinata tells a classmate about his curfew.', en: 'I have to be home by ten at night.',
        chunks: ['よる', 'じゅうじまでに', 'かえらなければ', 'いけません。', 'かえるなければ'], answer: ['よる', 'じゅうじまでに', 'かえらなければ', 'いけません。'],
        explain: 'かえる → かえらない → かえらなければ いけません. The dictionary form cannot take なければ.' }
    ],
    names: ['ナミ', 'ヒナタ'],
    uses: ['g:nakereba-naranai', 'g:made-ni', 'g:te-mo-ii', 'g:deshou', 'g:kara', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:wa-desu', 'g:to', 'g:yo', 'g:ne', 'v:さん|さん', 'v:下宿|げしゅく', 'v:規則|きそく', 'v:もう一度|もういちど', 'v:説明|せつめい', 'v:する|する', 'v:ごみ|ごみ', 'v:火曜日|かようび', 'v:朝|あさ', 'v:八|はち', 'v:時|じ', 'v:出す|だす', 'v:練習|れんしゅう', 'v:前|まえ', 'v:分かる|わかる', 'v:それから|それから', 'v:ガス|ガス', 'v:火|ひ', 'v:使う|つかう', 'v:後|あと', 'v:必ず|かならず', 'v:消す|けす', 'v:あの|あの', 'v:壁|かべ', 'v:いい|いい', 'v:だめ|だめ', 'v:隣|となり', 'v:部屋|へや', 'v:音|おと', 'v:聞こえる|きこえる', 'v:じゃあ|じゃあ', 'v:道具|どうぐ', 'v:押し入れ|おしいれ', 'v:隅|すみ', 'v:置く|おく', 'v:水道|すいどう', 'v:お金|おかね', 'v:毎月|まいつき', 'v:払う|はらう', 'v:それ|それ', 'v:いちばん|いちばん', 'v:大事|だいじ', 'k:一', 'k:八', 'k:時', 'k:二', 'k:十', 'k:五', 'k:日'],
    notes: 'Moving thread, closed: Hinata has settled into the boarding house (b1 u011, u031; b2 u037, u038, u059). Nami’s money nod. Hinata’s volleyball (バレーボール bridge, as in batch 1).',
    verified: true }),

  L({ id: 'l:n4-dlg-ten-pages', format: 'dialogue',
    title: 'No need to be neat', goal: 'You can say someone does not have to do something with 〜なくてもいい.',
    scene: 'Lelouch asks Frieren-sensei how to write the report for her class.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'lelouch', furigana: 'フリーレン[先生|せんせい]、レポートは　ていねいに　かかなければ　なりませんか。', en: 'Frieren-sensei, do we have to write the report neatly?' },
      { speaker: 'frieren', furigana: '……ていねいに　かかなくても　いい。だいたいで　いい。', en: '...You don’t have to write it neatly. Roughly is fine.' },
      { speaker: 'lelouch', furigana: 'こまかい　ことも　かかなくても　いいんですか。', en: 'We don’t have to write the details either?' },
      { speaker: 'frieren', furigana: '……いい。でも、[二|に]まい　いないで　おねがい。', en: '...That’s fine. But keep it within two pages, please.' },
      { speaker: 'lelouch', furigana: '[二|に]まい……。では、まず　なにから　かけば　いいですか。', en: 'Two pages... Then what should I write first?' },
      { speaker: 'frieren', furigana: '……まず、じぶんの　ことばで　かんがえて。', en: '...First, think in your own words.' },
      { speaker: 'lelouch', furigana: 'わかりました。……でも、もう　[十|じゅう]まい　かいて　しまいました。', en: 'I understand. ...But I’ve already written ten pages.' },
      { speaker: 'frieren', furigana: '……[十|じゅう]まい。', en: '...Ten pages.' },
      { speaker: 'lelouch', furigana: '[赤|あか]い　ペンで　なおした　ところも　あります。その　ままで　だしても　いいですか。', en: 'There are parts I corrected in red pen, too. May I hand it in as it is?' },
      { speaker: 'frieren', furigana: '……いいよ。でも、わたしは　ぜんぶ　よまなくても　いい？', en: '...Fine. But I don’t have to read all of it, do I?' }
    ],
    remixes: [
      { scene: 'Frieren tells the class about tomorrow’s test.', en: 'You don’t have to bring a dictionary tomorrow.',
        chunks: ['あしたは', 'じしょを', 'もって　こなくても', 'いい。', 'もって　こないても'], answer: ['あしたは', 'じしょを', 'もって　こなくても', 'いい。'],
        explain: 'The ない-form, ない → なくて, then も いい: こない → こなくても いい.' },
      { scene: 'Lelouch asks about the next report.', en: 'Do I have to hand it in by tomorrow?',
        chunks: ['あしたまでに', 'ださなければ', 'なりませんか。', 'だすなければ'], answer: ['あしたまでに', 'ださなければ', 'なりませんか。'],
        explain: 'Must I…? is the ない-form + ければ なりませんか: だす → ださない → ださなければ. The answer "no need" is ださなくても いいです.' }
    ],
    names: ['フリーレン', 'ルルーシュ'],
    uses: ['g:nakute-mo-ii', 'g:nakereba-naranai', 'g:te-mo-ii', 'g:ba', 'g:te-shimau', 'g:n-desu', 'g:de', 'g:no', 'g:mo', 'g:kara', 'g:ka', 'g:ni', 'g:yo', 'v:先生|せんせい', 'v:レポート|レポート', 'v:丁寧|ていねい', 'v:書く|かく', 'v:いい|いい', 'v:大体|だいたい', 'v:細かい|こまかい', 'v:事|こと', 'v:でも|でも', 'v:二|に', 'v:枚|まい', 'v:以内|いない', 'v:では|では', 'v:まず|まず', 'v:何|なに', 'v:自分|じぶん', 'v:言葉|ことば', 'v:考える|かんがえる', 'v:分かる|わかる', 'v:もう|もう', 'v:十|じゅう', 'v:赤い|あかい', 'v:ペン|ペン', 'v:直す|なおす', 'v:所|ところ', 'v:ある|ある', 'v:その|その', 'v:まま|まま', 'v:出す|だす', 'v:私|わたし', 'v:全部|ぜんぶ', 'v:読む|よむ', 'k:先', 'k:生', 'k:二', 'k:十', 'k:赤'],
    notes: 'Lelouch over-prepares; Frieren’s flat understatement turns the grammar point back on herself.',
    verified: true }),

L({ id: 'l:n4-dlg-no-breakfast', format: 'dialogue',
    title: 'Without breakfast', goal: 'You can say you did something without doing something else with 〜ないで.',
    scene: 'Morning in the staff room. Kakashi-sensei has only just made it, and Gojo-sensei notices.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'gojo', furigana: 'カカシ[先生|せんせい]、おはよう。……あれ、かみが　ぬれてるよ。', en: 'Morning, Kakashi-sensei. ...Huh, your hair is wet.' },
      { speaker: 'kakashi', furigana: '……まだ　かわいて　いないんです。じかんが　なくて。', en: '...It hasn’t dried yet. I didn’t have time.' },
      { speaker: 'gojo', furigana: 'ひげも　その　ままだね。あさごはんは？', en: 'You haven’t shaved, either. And breakfast?' },
      { speaker: 'kakashi', furigana: 'たべないで　[来|き]ました。', en: 'I came without eating.' },
      { speaker: 'gojo', furigana: 'また　ねぼう？　とけいを　[三|みっ]つ　かったのに。', en: 'Overslept again? Even though you bought three clocks.' },
      { speaker: 'kakashi', furigana: 'とけいは　ぜんぶ　なりました。でも、おきないで　ねて　いました。', en: 'All the clocks went off. But I didn’t get up; I stayed asleep.' },
      { speaker: 'gojo', furigana: 'だれか　おこして　くれる　ひとは　いないの？', en: 'Isn’t there anyone who can wake you up?' },
      { speaker: 'kakashi', furigana: '……パックンが　いますが、パックンも　あさは　おきないんです。', en: '...There’s Pakkun, but Pakkun doesn’t get up in the mornings either.' },
      { speaker: 'gojo', furigana: 'じゃあ、これ　あげる。パン[屋|や]の　パンに　ジャムを　たくさん　ぬって　きたよ。', en: 'Then have this. It’s bread from the bakery; I spread lots of jam on it.' },
      { speaker: 'kakashi', furigana: '……あまそうですね。かまないで　のめそうです。', en: '...Looks sweet. I could swallow it without chewing.' }
    ],
    remixes: [
      { scene: 'Gojo’s morning went wrong too.', en: 'I went out without taking an umbrella.',
        chunks: ['かさを', 'もたないで', 'でかけた。', 'もたなくて'], answer: ['かさを', 'もたないで', 'でかけた。'],
        explain: 'Without doing X: the ない-form + で (もたないで). もたなくて gives a reason ("I didn’t have one, so…"), not "without".' },
      { scene: 'Kakashi admits what happened the night before.', en: 'I fell asleep without turning off the light.',
        chunks: ['でんきを', 'けさないで', 'ねて　しまった。', 'けさなくて'], answer: ['でんきを', 'けさないで', 'ねて　しまった。'],
        explain: 'けさないで ねた: he slept, and did not turn the light off first. The same person does both things.' }
    ],
    names: ['ゴジョウ', 'カカシ', 'パックン'],
    uses: ['g:nai-de', 'g:te-iru', 'g:n-desu', 'g:noni', 'g:te-kureru', 'g:te-kuru', 'g:sou-da-looks', 'g:potential', 'g:noun-modifier', 'g:wa-desu', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'v:先生|せんせい', 'v:あれ|あれ', 'v:髪|かみ', 'v:ぬれる|ぬれる', 'v:まだ|まだ', 'v:乾く|かわく', 'v:時間|じかん', 'v:ない|ない', 'v:ひげ|ひげ', 'v:その|その', 'v:まま|まま', 'v:朝御飯|あさごはん', 'v:食べる|たべる', 'v:来る|くる', 'v:また|また', 'v:寝坊|ねぼう', 'v:時計|とけい', 'v:三つ|みっつ', 'v:買う|かう', 'v:全部|ぜんぶ', 'v:鳴る|なる', 'v:でも|でも', 'v:起きる|おきる', 'v:寝る|ねる', 'v:誰か|だれか', 'v:起こす|おこす', 'v:人|ひと', 'v:居る|いる', 'v:朝|あさ', 'v:じゃあ|じゃあ', 'v:これ|これ', 'v:あげる|あげる', 'v:パン|パン', 'v:屋|や', 'v:ジャム|ジャム', 'v:たくさん|たくさん', 'v:塗る|ぬる', 'v:甘い|あまい', 'v:噛む|かむ', 'v:飲む|のむ', 'k:先', 'k:生', 'k:来', 'k:三', 'k:屋'],
    notes: 'Kakashi-late thread: the three clocks of u072 did not help. Pakkun (Kakashi’s dog, an allowed Naruto name) is mentioned. のめそう: the potential + そう (looks like he could swallow it).',
    verified: true }),

  L({ id: 'l:n4-dlg-eat-your-vegetables', format: 'dialogue',
    title: 'Eat your vegetables', goal: 'You can give a gentle order, as a parent does, with 〜なさい.',
    scene: 'Dinner at the Forgers’. Anya is pushing her vegetables to the side of the plate.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Mother' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'yor', furigana: 'アーニャさん、やさいも　たべなさい。', en: 'Anya, eat your vegetables too.' },
      { speaker: 'anya', furigana: 'この　[色|いろ]の　やさい、にがいから　いや。', en: 'Vegetables this colour are bitter. I don’t want them.', say: 'この色の野菜、苦いから嫌。' },
      { speaker: 'yor', furigana: 'しっかり　たべないと、つよく　なれませんよ。', en: 'If you don’t eat properly, you won’t get strong.' },
      { speaker: 'anya', furigana: 'つよく　なったら、クラスの　おとこのこに　かてる？　アーニャを　いじめる　こ。', en: 'If I get strong, can I beat the boy in my class? The one who picks on me.' },
      { speaker: 'yor', furigana: 'けんかは　だめですよ。でも、いやな　ことは　「やめて」と　しっかり　[言|い]いなさい。', en: 'No fighting. But when something is mean, say "stop it", and say it firmly.', say: 'けんかはだめですよ。でも、嫌なことは「やめて」としっかり言いなさい。' },
      { speaker: 'anya', furigana: 'ははは　しょうがっこうの　とき、つよかった？', en: 'Mum, were you strong in primary school?' },
      { speaker: 'yor', furigana: 'ちゅうがっこうの　ときは、もう　だれにも　まけませんでした。', en: 'By junior high, I never lost to anyone.' },
      { speaker: 'anya', furigana: '……アーニャ、やさい　たべる。', en: '...Anya will eat the vegetables.' },
      { speaker: 'yor', furigana: 'いい　こですね。じゃあ、よく　かんで　たべなさい。', en: 'Good girl. Then chew them well.' },
      { speaker: 'anya', furigana: '……この　やさい、[黒|くろ]い。だから　にがい？', en: '...These vegetables are black. Is that why they’re bitter?', say: '……この野菜、黒い。だから苦い？' }
    ],
    remixes: [
      { scene: 'After dinner, Yor sends Anya to bed.', en: 'Go to bed early today.',
        chunks: ['きょうは', 'はやく', 'ねなさい。', 'ねるなさい。'], answer: ['きょうは', 'はやく', 'ねなさい。'],
        explain: 'なさい joins the ます-stem: ねます → ね + なさい. The dictionary form cannot take なさい.' },
      { scene: 'Anya wants to watch TV after school.', en: 'Do your homework first.',
        chunks: ['さきに', 'しゅくだいを', 'しなさい。', 'するなさい。'], answer: ['さきに', 'しゅくだいを', 'しなさい。'],
        explain: 'する → します → し + なさい = しなさい. Parents and teachers say it; you never say it to someone above you.' }
    ],
    names: ['ヨル', 'アーニャ'],
    uses: ['g:nasai', 'g:to-conditional', 'g:potential', 'g:naru', 'g:tara', 'g:noun-modifier', 'g:kara', 'g:wa-desu', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:野菜|やさい', 'v:食べる|たべる', 'v:この|この', 'v:色|いろ', 'v:苦い|にがい', 'v:嫌|いや', 'v:しっかり|しっかり', 'v:強い|つよい', 'v:なる|なる', 'v:クラス|クラス', 'v:男の子|おとこのこ', 'v:勝つ|かつ', 'v:いじめる|いじめる', 'v:子|こ', 'v:けんか|けんか', 'v:だめ|だめ', 'v:でも|でも', 'v:事|こと', 'v:止める|やめる', 'v:言う|いう', 'v:母|はは', 'v:小学校|しょうがっこう', 'v:時|とき', 'v:中学校|ちゅうがっこう', 'v:もう|もう', 'v:誰|だれ', 'v:負ける|まける', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:よく|よく', 'v:噛む|かむ', 'v:黒い|くろい', 'v:だから|だから', 'k:色', 'k:言', 'k:黒'],
    notes: 'Anya’s home + Yor’s cooking threads: the vegetables are bitter because Yor burnt them (the last beat). Anya calls Yor はは (as in batches 1 and 2). Yor strong as a girl: a series nod, wholesome. やめて is a quoted request (止める, やめる).',
    verified: true }),

  L({ id: 'l:n4-dlg-escalator', format: 'dialogue',
    title: 'Don’t run!', goal: 'You can understand and give blunt commands with the imperative (〜ろ / 〜え) and the prohibitive (〜な).',
    scene: 'At a department store, Killua races ahead of Hinata up the escalator.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Kid' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Friend' } },
    lines: [
      { speaker: 'killua', furigana: 'ヒナタさん、おそいよ！　はやく　[来|こ]い！', en: 'Hinata, you’re slow! Come on, hurry!' },
      { speaker: 'hinata', furigana: 'キルアさん、エスカレーターで　はしるな！', en: 'Killua, don’t run on the escalator!' },
      { speaker: 'killua', furigana: 'だいじょうぶだって。……あれ？　とまった。', en: 'I said it’s fine. ...Huh? It stopped.' },
      { speaker: 'hinata', furigana: '[見|み]ろ。キルアさんが　はしったから、[店|みせ]の　ひとが　とめたんだ。', en: 'Look. You ran, so the shop staff stopped it.' },
      { speaker: 'killua', furigana: '……わるかったよ。', en: '...Sorry, okay.' },
      { speaker: 'hinata', furigana: 'それに、キルアさんの　シャツ、うらだよ。', en: 'And your shirt is on inside out.' },
      { speaker: 'killua', furigana: 'えっ……。わらうな！', en: 'What... Don’t laugh!' },
      { speaker: 'hinata', furigana: 'わらって　ないよ。あそこで　なおして　[来|こ]い。', en: 'I’m not laughing. Go and fix it over there.' },
      { speaker: 'killua', furigana: '……あ、あそこの　いす、あいた。ヒナタさんが　すわれよ。', en: '...Oh, that chair over there is free. You sit down, Hinata.' },
      { speaker: 'hinata', furigana: 'いいから、はやく　なおせ。かさは　ここに　たてて　おくから。', en: 'Never mind that, go and fix it. I’ll stand your umbrella here.', say: 'いいから、早く直せ。傘はここに立てておくから。' }
    ],
    remixes: [
      { scene: 'On the platform, Hinata shouts to Killua.', en: 'Don’t get on that train!',
        chunks: ['その', 'でんしゃに', 'のるな！', 'のらな！'], answer: ['その', 'でんしゃに', 'のるな！'],
        explain: 'Don’t!: the dictionary form + な: のる + な. Nothing changes in the verb.' },
      { scene: 'Killua runs off again in the shop.', en: 'Wait over there!',
        chunks: ['あそこで', 'まて！', 'まちろ！'], answer: ['あそこで', 'まて！'],
        explain: 'まつ is an う-verb: つ → て gives the command まて. ろ is only for る-verbs (たべろ, みろ).' }
    ],
    names: ['キルア', 'ヒナタ'],
    uses: ['g:imperative', 'g:na-prohibitive', 'g:tte', 'g:kara', 'g:te-oku', 'g:de', 'g:no', 'g:ni', 'g:ga', 'g:yo', 'v:さん|さん', 'v:遅い|おそい', 'v:早い|はやい', 'v:来る|くる', 'v:エスカレーター|エスカレーター', 'v:走る|はしる', 'v:大丈夫|だいじょうぶ', 'v:あれ|あれ', 'v:止まる|とまる', 'v:見る|みる', 'v:店|みせ', 'v:人|ひと', 'v:止める|とめる', 'v:悪い|わるい', 'v:それに|それに', 'v:シャツ|シャツ', 'v:裏|うら', 'v:笑う|わらう', 'v:あそこ|あそこ', 'v:直す|なおす', 'v:いす|いす', 'v:空く|あく', 'v:座る|すわる', 'v:いい|いい', 'v:傘|かさ', 'v:ここ|ここ', 'v:立てる|たてる', 'v:置く|おく', 'k:来', 'k:見', 'k:店'],
    notes: 'Killua (kid, casual) and Hinata (older friend): rough commands between friends. The shirt worn inside out (裏) is the one humour beat.',
    verified: true }),

  L({ id: 'l:n4-dlg-what-to-pack', format: 'dialogue',
    title: 'What we need', goal: 'You can say what is needed, or not, with 必要 (ひつよう).',
    scene: 'Sasuke and Sakura have made up. Sakura plans their day trip.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Girlfriend' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Boyfriend' } },
    lines: [
      { speaker: 'sakura', furigana: 'サスケさん、こんどの　[旅行|りょこう]、なにが　ひつよう？', en: 'Sasuke, what do we need for our trip?' },
      { speaker: 'sasuke', furigana: '……[服|ふく]と　おかね。', en: '...Clothes and money.' },
      { speaker: 'sakura', furigana: 'それだけ？　かさは？', en: 'That’s all? What about an umbrella?' },
      { speaker: 'sasuke', furigana: '……あしたは　はれだ。かさは　ひつよう　ない。', en: '...Tomorrow will be sunny. We don’t need an umbrella.' },
      { speaker: 'sakura', furigana: 'でも、くすりは　ひつようよ。サスケさんの　ために、もう　かって　あるの。', en: 'But we do need medicine. I’ve already bought some, for you.' },
      { speaker: 'sasuke', furigana: '……でんしゃ[代|だい]は　はらう。', en: '...I’ll pay the train fare.' },
      { speaker: 'sakura', furigana: 'いいの？　じゃあ、ひるごはんは　わたしが　つくるね。なにが　いい？', en: 'Are you sure? Then I’ll make lunch. What would you like?' },
      { speaker: 'sasuke', furigana: '……トマト。', en: '...Tomatoes.' },
      { speaker: 'sakura', furigana: 'トマト　いがいは？', en: 'And apart from tomatoes?' },
      { speaker: 'sasuke', furigana: '……ひつよう　ない。', en: '...Don’t need anything else.' }
    ],
    bridge: [
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Sakura checks the weather again: it will be very sunny.', en: 'A hat is necessary.',
        chunks: ['ぼうしが', 'ひつようです。', 'ぼうしを'], answer: ['ぼうしが', 'ひつようです。'],
        explain: 'The thing that is needed takes が: ぼうしが ひつようです.' },
      { scene: 'Sasuke looks at Sakura’s heavy bag.', en: 'There’s no need to take a dictionary.',
        chunks: ['じしょを', 'もって　いく', 'ひつようは', 'ない。', 'ひつようを'], answer: ['じしょを', 'もって　いく', 'ひつようは', 'ない。'],
        explain: 'No need to ~: the dictionary form + ひつようは ない (ありません).' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:hitsuyou', 'g:te-aru', 'g:to', 'g:no', 'g:ga', 'g:ka', 'g:yo', 'g:ne', 'v:さん|さん', 'v:今度|こんど', 'v:旅行|りょこう', 'v:何|なに', 'v:必要|ひつよう', 'v:服|ふく', 'v:お金|おかね', 'v:それ|それ', 'v:だけ|だけ', 'v:傘|かさ', 'v:明日|あした', 'v:晴れ|はれ', 'v:ない|ない', 'v:でも|でも', 'v:薬|くすり', 'v:為|ため', 'v:もう|もう', 'v:買う|かう', 'v:電車|でんしゃ', 'v:代|だい', 'v:払う|はらう', 'v:いい|いい', 'v:じゃあ|じゃあ', 'v:昼御飯|ひるごはん', 'v:私|わたし', 'v:作る|つくる', 'v:以外|いがい', 'k:旅', 'k:行', 'k:服', 'k:代'],
    notes: 'Sasuke + Sakura thread: they made up after u073. Sasuke’s tomatoes (トマト bridge, as in batches 1 and 2). Lib limit: the unit word 必要 (ひつよう) takes every ひつよう, so g:hitsuyou gets no mark (validator WARN).',
    verified: true }),

L({ id: 'l:n4-dlg-low-heat', format: 'dialogue',
    title: 'Turn it down', goal: 'You can say you make something a certain way with 〜くする / 〜にする.',
    scene: 'In the restaurant kitchen after closing, Sanji gives Yor a cooking lesson.',
    cast: { yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Student cook' }, sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Cook' } },
    lines: [
      { speaker: 'yor', furigana: 'サンジさん、きょうは　よろしく　おねがいします。やさいを　[黒|くろ]く　しない　やきかたを　おしえて　ください。', en: 'Sanji, thank you for today. Please teach me how to cook vegetables without turning them black.' },
      { speaker: 'sanji', furigana: 'よろこんで。まず、ひを　よわく　して　ください。', en: 'With pleasure. First, turn the heat down low.' },
      { speaker: 'yor', furigana: 'よわく……。わたし、いつも　ひを　いちばん　つよく　して　いました。', en: 'Low... I always turned the heat up as high as it goes.' },
      { speaker: 'sanji', furigana: 'それでは、やさいが　どんどん　[黒|くろ]く　なりますよ。', en: 'That way, the vegetables quickly turn black.' },
      { speaker: 'yor', furigana: 'だから、いつも　かたく　なって　いたんですね。', en: 'So that’s why they always went hard.' },
      { speaker: 'sanji', furigana: 'よわい　ひで　やけば、やわらかく　なります。はしで　おして　みて　ください。', en: 'If you cook them on a low heat, they go soft. Try pressing one with your chopsticks.' },
      { speaker: 'yor', furigana: '……あ、やわらかいです！　あじは　ふくざつに　しなくても　いいですか。', en: '...Oh, it’s soft! Do I need to make the flavour complicated?' },
      { speaker: 'sanji', furigana: 'いいえ。しおを　すこしだけ。りょうりは　かんたんに　して　いいんです。', en: 'No. Just a little salt. Cooking can be kept simple.' },
      { speaker: 'yor', furigana: 'サンジさんは　もっと　きびしい　[先生|せんせい]だと　おもって　いました。', en: 'I thought you would be a much stricter teacher, Sanji.' },
      { speaker: 'sanji', furigana: 'ヨルさんには　きびしく　できませんよ。……こんやの　[夕|ゆう]はんは、ひとりで　つくって　みて　くださいね。', en: 'I couldn’t be strict with you, Yor. ...Try making tonight’s dinner on your own.', say: 'ヨルさんには厳しくできませんよ。……今夜の夕飯は、一人で作ってみてくださいね。' }
    ],
    remixes: [
      { scene: 'Sanji explains the next dish.', en: 'Make the meat soft.',
        chunks: ['にくを', 'やわらかく', 'して　ください。', 'やわらかいに'], answer: ['にくを', 'やわらかく', 'して　ください。'],
        explain: 'An い-adjective: い → く + する: やわらかい → やわらかく します (make it soft).' },
      { scene: 'Anya is singing loudly while Yor cooks.', en: 'Please keep the room quiet.',
        chunks: ['へやを', 'しずかに', 'して　ください。', 'しずかく'], answer: ['へやを', 'しずかに', 'して　ください。'],
        explain: 'A な-adjective takes に + する: しずかに します. Only い-adjectives take く.' }
    ],
    names: ['ヨル', 'サンジ'],
    uses: ['g:ku-ni-suru', 'g:kata', 'g:naru', 'g:te-iru', 'g:te-ita', 'g:ba', 'g:te-miru', 'g:te-kudasai', 'g:nakute-mo-ii', 'g:n-desu', 'g:dake', 'g:de', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:yo', 'g:ne', 'v:さん|さん', 'v:今日|きょう', 'v:野菜|やさい', 'v:黒い|くろい', 'v:焼く|やく', 'v:教える|おしえる', 'v:喜ぶ|よろこぶ', 'v:まず|まず', 'v:火|ひ', 'v:弱い|よわい', 'v:する|する', 'v:私|わたし', 'v:いつも|いつも', 'v:いちばん|いちばん', 'v:強い|つよい', 'v:それでは|それでは', 'v:どんどん|どんどん', 'v:なる|なる', 'v:だから|だから', 'v:固い|かたい', 'v:柔らかい|やわらかい', 'v:はし|はし', 'v:押す|おす', 'v:味|あじ', 'v:複雑|ふくざつ', 'v:いい|いい', 'v:塩|しお', 'v:少し|すこし', 'v:料理|りょうり', 'v:簡単|かんたん', 'v:もっと|もっと', 'v:厳しい|きびしい', 'v:先生|せんせい', 'v:思う|おもう', 'v:できる|できる', 'v:今夜|こんや', 'v:夕飯|ゆうはん', 'v:一人|ひとり', 'v:作る|つくる', 'k:黒', 'k:先', 'k:生', 'k:夕'],
    notes: 'Yor’s cooking thread, closed: after the burnt vegetables of u079 she learns to cook them on a low heat (kuru-suru vs kuru-naru contrast: 黒くする / 黒くなる). いいえ is a plain reply (unverified, kept out of uses).',
    verified: true }),

  L({ id: 'l:n4-dlg-canteen-lunch', format: 'dialogue',
    title: 'Not much at all', goal: 'You can say "not very" and "not at all" with あまり / ぜんぜん + a negative.',
    scene: 'Maomao is visiting the school as pharmacist. In the canteen, she looks at Gojo-sensei’s tray.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' }, gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' } },
    lines: [
      { speaker: 'maomao', furigana: 'ゴジョウ[先生|せんせい]、[食堂|しょくどう]の　ひるごはん、ぜんぜん　たべて　いませんね。', en: 'Gojo-sensei, you haven’t eaten any of your canteen lunch.' },
      { speaker: 'gojo', furigana: 'うん、あまり　すきじゃないんだ。あまい　ものは　ぜんぶ　たべたよ。', en: 'Yeah, I don’t really like it. I ate all the sweet things.' },
      { speaker: 'maomao', furigana: 'やさいは？', en: 'And the vegetables?' },
      { speaker: 'gojo', furigana: 'やさいは　ほとんど　たべない。', en: 'I hardly ever eat vegetables.' },
      { speaker: 'maomao', furigana: '……ひどい。それでは　からだに　よく　ありません。', en: '...That’s terrible. It isn’t good for your body.' },
      { speaker: 'gojo', furigana: 'でも　げんきだよ。かぜも　ぜんぜん　ひかないし。', en: 'But I’m fine. I never catch colds, either.' },
      { speaker: 'maomao', furigana: 'では、この　[鳥|とり]の　りょうりを　どうぞ。それほど　からく　ないです。', en: 'Then try this chicken dish. It isn’t that spicy.' },
      { speaker: 'gojo', furigana: '……あれ？　おいしい。やさいの　あじが　あまり　しない。', en: '...Huh? It’s good. I can hardly taste the vegetables.' },
      { speaker: 'maomao', furigana: '……さとうを　すこし　いれました。', en: '...I put in a little sugar.' },
      { speaker: 'gojo', furigana: 'マオマオさんの　ほうが　ひどいね。', en: 'You’re the terrible one, Maomao.' }
    ],
    remixes: [
      { scene: 'Gojo talks about the canteen’s fish.', en: 'I don’t really like fish.',
        chunks: ['さかなは', 'あまり', 'すきじゃない。', 'すきだ。'], answer: ['さかなは', 'あまり', 'すきじゃない。'],
        explain: 'あまり needs a negative ending later in the sentence: あまり すきじゃない (not very).' },
      { scene: 'Maomao was up all night testing medicine.', en: 'I didn’t sleep at all last night.',
        chunks: ['きのうは', 'ぜんぜん', 'ねなかった。', 'ねた。'], answer: ['きのうは', 'ぜんぜん', 'ねなかった。'],
        explain: 'ぜんぜん + a negative = not at all: ぜんぜん ねなかった.' }
    ],
    names: ['マオマオ', 'ゴジョウ'],
    uses: ['g:amari-nai', 'g:te-iru', 'g:shi', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'v:先生|せんせい', 'v:食堂|しょくどう', 'v:昼御飯|ひるごはん', 'v:全然|ぜんぜん', 'v:食べる|たべる', 'v:好き|すき', 'v:甘い|あまい', 'v:物|もの', 'v:全部|ぜんぶ', 'v:野菜|やさい', 'v:ほとんど|ほとんど', 'v:ひどい|ひどい', 'v:それでは|それでは', 'v:体|からだ', 'v:いい|いい', 'v:でも|でも', 'v:元気|げんき', 'v:風邪|かぜ', 'v:引く|ひく', 'v:では|では', 'v:この|この', 'v:鳥|とり', 'v:料理|りょうり', 'v:どうぞ|どうぞ', 'v:それほど|それほど', 'v:辛い|からい', 'v:あれ|あれ', 'v:おいしい|おいしい', 'v:味|あじ', 'v:する|する', 'v:砂糖|さとう', 'v:少し|すこし', 'v:入れる|いれる', 'v:さん|さん', 'k:先', 'k:生', 'k:食', 'k:堂', 'k:鳥'],
    notes: 'Gojo’s sweet tooth; Maomao, blunt, sneaks sugar in (her testing streak). The ひどい callback is the one humour beat. うん is a plain reply (unverified, kept out of uses).',
    verified: true }),

  L({ id: 'l:n4-dlg-this-high', format: 'dialogue',
    title: 'This high!', goal: 'You can talk about degree with そんなに / こんなに / あんなに.',
    scene: 'Hinata comes into Maomao’s pharmacy after volleyball practice, aching all over.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' }, hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'hinata', furigana: 'マオマオさん！　うでと　くびと　せなかが　いたいです！', en: 'Maomao! My arms, my neck and my back hurt!' },
      { speaker: 'maomao', furigana: '……そんなに　いろいろな　ところが　いたいんですか。なにを　したんですか。', en: '...So many places hurt? What did you do?' },
      { speaker: 'hinata', furigana: 'きのうの　[冬|ふゆ]の　れんしゅうで、こんなに　たかく　とんだんです！', en: 'At winter practice yesterday, I jumped this high!' },
      { speaker: 'maomao', furigana: 'こう　ですか。……あ、ゆびから　ちが　でて　いますよ。', en: 'Like this? ...Oh, your finger is bleeding.' },
      { speaker: 'hinata', furigana: 'えっ！　ほんとうだ。ぜんぜん　しらなかった！', en: 'What! So it is. I had no idea!' },
      { speaker: 'maomao', furigana: 'そんなに　ふかく　ないですね。くすりを　ぬって　おきます。', en: 'It isn’t that deep. I’ll put some ointment on it.' },
      { speaker: 'hinata', furigana: '……あの、マオマオさんは　さっき、あんなに　にがい　くすりを　のんで　いましたね。', en: '...Um, a minute ago you were drinking really bitter medicine, weren’t you?' },
      { speaker: 'maomao', furigana: '……あれは、どくが　あるか　どうか　しらべて　いたんです。', en: '...I was checking whether it was poisonous.' },
      { speaker: 'hinata', furigana: 'ええっ！　だいじょうぶなんですか！', en: 'Whaat! Are you all right?' },
      { speaker: 'maomao', furigana: '……ヒナタさんは　ご[飯|はん]を　しっかり　たべて、きょうは　はやく　ねて　ください。', en: '...You, Hinata, eat a proper meal and go to bed early today.' }
    ],
    bridge: [
      { text: 'どく', gloss: 'どく = poison' }
    ],
    remixes: [
      { scene: 'Hinata looks at the bottle of medicine.', en: 'Is the medicine that bitter?',
        chunks: ['くすりは', 'そんなに', 'にがいですか。', 'そんな'], answer: ['くすりは', 'そんなに', 'にがいですか。'],
        explain: 'Before an adjective it is そんなに (to that degree). そんな goes before a noun: そんな くすり.' },
      { scene: 'Maomao checks Hinata’s arm.', en: 'It doesn’t hurt that much, right?',
        chunks: ['そんなに', 'いたく', 'ないでしょう。', 'いたい'], answer: ['そんなに', 'いたく', 'ないでしょう。'],
        explain: 'そんなに + a negative = not that ~: いたい → いたく ない.' }
    ],
    names: ['マオマオ', 'ヒナタ'],
    uses: ['g:sonna-ni', 'g:n-desu', 'g:te-iru', 'g:te-ita', 'g:te-oku', 'g:ka-dou-ka', 'g:te-kudasai', 'g:to', 'g:de', 'g:wo', 'g:no', 'g:ga', 'g:yo', 'g:ne', 'v:さん|さん', 'v:腕|うで', 'v:首|くび', 'v:背中|せなか', 'v:痛い|いたい', 'v:そんなに|そんなに', 'v:いろいろ|いろいろ', 'v:所|ところ', 'v:何|なに', 'v:する|する', 'v:昨日|きのう', 'v:冬|ふゆ', 'v:練習|れんしゅう', 'v:高い|たかい', 'v:飛ぶ|とぶ', 'v:こう|こう', 'v:指|ゆび', 'v:血|ち', 'v:出る|でる', 'v:ほんとう|ほんとう', 'v:全然|ぜんぜん', 'v:知る|しる', 'v:深い|ふかい', 'v:薬|くすり', 'v:塗る|ぬる', 'v:あの|あの', 'v:さっき|さっき', 'v:あんな|あんな', 'v:苦い|にがい', 'v:飲む|のむ', 'v:あれ|あれ', 'v:ある|ある', 'v:調べる|しらべる', 'v:大丈夫|だいじょうぶ', 'v:御飯|ごはん', 'v:しっかり|しっかり', 'v:食べる|たべる', 'v:今日|きょう', 'v:早い|はやい', 'v:寝る|ねる', 'k:冬', 'k:飯'],
    notes: 'Hinata jumping; Maomao testing medicine on herself (series nod; どく bridge, as in batches 1 and 2). Lib note: the unit words そんなに and あんな take そんなに / あんなに, so the grammar mark sits on こんなに.',
    verified: true }),

  L({ id: 'l:n4-dlg-crowded-train', format: 'dialogue',
    title: 'Stepped on', goal: 'You can say something was done to you with the passive (〜れる / 〜られる).',
    scene: 'On the way back from a class trip, Frieren-sensei and Killua stand in a crowded train.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Pupil' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' } },
    lines: [
      { speaker: 'killua', furigana: '[昼|ひる]なのに、でんしゃ、こんでるね。……いたい！　あしを　ふまれた。', en: 'It’s the middle of the day, but the train is packed. ...Ow! Someone stepped on my foot.' },
      { speaker: 'frieren', furigana: '……だいじょうぶ？', en: '...Are you all right?' },
      { speaker: 'killua', furigana: 'うん。むこうの　こどもたちが　さわいで　いるから、おされるんだよ。', en: 'Yeah. The kids over there are making a fuss, so we get pushed.' },
      { speaker: 'frieren', furigana: '……わたしも　さっき、あの　こたちに　としを　きかれた。', en: '...A little while ago those kids asked me my age, too.' },
      { speaker: 'killua', furigana: 'なんて　こたえたの？', en: 'What did you say?' },
      { speaker: 'frieren', furigana: '……[千|せん]さいって　[言|い]ったら、わらわれた。', en: '...I said a thousand, and they laughed at me.' },
      { speaker: 'killua', furigana: 'ほんとうなのにね。', en: 'Even though it’s true.' },
      { speaker: 'frieren', furigana: '……つぎの　えきで　すくよ。うんてんしゅさんが　そう　[言|い]って　いた。', en: '...It empties out at the next station. The driver said so.' },
      { speaker: 'killua', furigana: 'あ、ほんとうだ。すいて　きた。', en: 'Oh, you’re right. It’s getting emptier.' },
      { speaker: 'frieren', furigana: '……キルアさん、すわって。また　ふまれるよ。', en: '...Sit down, Killua. You’ll get stepped on again.' }
    ],
    remixes: [
      { scene: 'Killua checks his bag after getting off.', en: 'My bag got stepped on too.',
        chunks: ['かばんも', 'ふまれた。', 'ふんだ。'], answer: ['かばんも', 'ふまれた。'],
        explain: 'Passive of an う-verb: ふむ → ふま + れる → ふまれた. ふんだ would mean the bag stepped on something.' },
      { scene: 'Frieren tells Killua about her day at school.', en: 'I was asked a question by a pupil.',
        chunks: ['せいとに', 'しつもんを', 'された。', 'した。'], answer: ['せいとに', 'しつもんを', 'された。'],
        explain: 'The passive of する is される. The person who did it takes に: せいとに.' }
    ],
    names: ['キルア', 'フリーレン'],
    uses: ['g:passive', 'g:noni', 'g:te-iru', 'g:te-kuru', 'g:tara', 'g:kara', 'g:tte', 'g:te-ita', 'g:de', 'g:wo', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'v:昼|ひる', 'v:電車|でんしゃ', 'v:込む|こむ', 'v:痛い|いたい', 'v:足|あし', 'v:踏む|ふむ', 'v:大丈夫|だいじょうぶ', 'v:向こう|むこう', 'v:子供|こども', 'v:たち|たち', 'v:騒ぐ|さわぐ', 'v:押す|おす', 'v:私|わたし', 'v:さっき|さっき', 'v:あの|あの', 'v:子|こ', 'v:年|とし', 'v:聞く|きく', 'v:答える|こたえる', 'v:千|せん', 'v:歳|さい', 'v:言う|いう', 'v:笑う|わらう', 'v:ほんとう|ほんとう', 'v:次|つぎ', 'v:駅|えき', 'v:そう|そう', 'v:運転手|うんてんしゅ', 'v:空く|すく', 'v:座る|すわる', 'v:また|また', 'v:さん|さん', 'k:昼', 'k:千', 'k:言'],
    notes: 'Frieren and time (her age; “a thousand” kept vague as in batch 2 u050). うん is a plain reply (unverified, kept out of uses).',
    verified: true }),

  L({ id: 'l:n4-dlg-food-fair', format: 'dialogue',
    title: 'Let me do it', goal: 'You can say you make or let someone do something with the causative (〜せる / 〜させる).',
    scene: 'Before opening, Sanji tells his part-timer Sasuke about a visit from a newspaper.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Part-timer' } },
    lines: [
      { speaker: 'sanji', furigana: 'サスケさん、あした、しんぶんしゃの　ひとが　この　[店|みせ]に　[来|き]ますよ。', en: 'Sasuke, tomorrow someone from a newspaper is coming to the restaurant.' },
      { speaker: 'sasuke', furigana: '……しんぶんしゃ？', en: '...A newspaper?' },
      { speaker: 'sanji', furigana: 'らいげつ、まちで　こくさい　りょうりの　おまつりを　おこなうんです。その　はなしを　ききに。', en: 'Next month the town is holding an international food festival. They’re coming to hear about it.' },
      { speaker: 'sasuke', furigana: '……わたしは　なにを　すれば　いいですか。', en: '...What should I do?' },
      { speaker: 'sanji', furigana: 'サスケさんには、トマトの　りょうりを　つくらせます。', en: 'I’m going to have you make the tomato dishes.' },
      { speaker: 'sasuke', furigana: '……やらせて　ください。', en: '...Let me do it.' },
      { speaker: 'sanji', furigana: 'いい　へんじです。やさいを　とりに　[行|い]く　くるまは、わたしが　うんてんします。', en: 'Good answer. I’ll drive the van to pick up the vegetables.' },
      { speaker: 'sasuke', furigana: '……でも、らいしゅうは　しけんが　あるので、[二日|ふつか]　やすませて　ください。', en: '...But I have exams next week, so please let me have two days off.' },
      { speaker: 'sanji', furigana: 'もちろん。べんきょうは　だいじです。サクラさんに　おこられますからね。', en: 'Of course. Studying comes first. Sakura would be angry with me, after all.' },
      { speaker: 'sasuke', furigana: '……それは　こまる。', en: '...That would be bad.' }
    ],
    bridge: [
      { text: 'トマト', gloss: 'トマト = tomato' }
    ],
    remixes: [
      { scene: 'Sasuke has a fever and asks to leave.', en: 'Please let me go home early today.',
        chunks: ['きょうは', 'はやく', 'かえらせて', 'ください。', 'かえさせて'], answer: ['きょうは', 'はやく', 'かえらせて', 'ください。'],
        explain: 'かえる is an う-verb: る → ら + せる = かえらせる. Asking permission: 〜させて ください.' },
      { scene: 'Sanji plans the morning for the newspaper visit.', en: 'I’ll have Sasuke carry the vegetables.',
        chunks: ['サスケさんに', 'やさいを', 'はこばせます。', 'はこぶせます。'], answer: ['サスケさんに', 'やさいを', 'はこばせます。'],
        explain: 'Causative of an う-verb: the last sound to the あ-row + せる: はこぶ → はこばせる. The person made to do it takes に.' }
    ],
    names: ['サンジ', 'サスケ', 'サクラ'],
    uses: ['g:causative', 'g:passive', 'g:n-desu', 'g:ni-iku', 'g:ba', 'g:node', 'g:kara', 'g:te-kudasai', 'g:de', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:yo', 'g:ne', 'v:さん|さん', 'v:明日|あした', 'v:新聞社|しんぶんしゃ', 'v:人|ひと', 'v:この|この', 'v:店|みせ', 'v:来る|くる', 'v:来月|らいげつ', 'v:町|まち', 'v:国際|こくさい', 'v:料理|りょうり', 'v:お祭り|おまつり', 'v:行う|おこなう', 'v:その|その', 'v:話|はなし', 'v:聞く|きく', 'v:私|わたし', 'v:何|なに', 'v:する|する', 'v:いい|いい', 'v:作る|つくる', 'v:やる|やる', 'v:返事|へんじ', 'v:野菜|やさい', 'v:取る|とる', 'v:行く|いく', 'v:車|くるま', 'v:運転|うんてん', 'v:でも|でも', 'v:来週|らいしゅう', 'v:試験|しけん', 'v:ある|ある', 'v:二日|ふつか', 'v:休む|やすむ', 'v:もちろん|もちろん', 'v:勉強|べんきょう', 'v:大事|だいじ', 'v:怒る|おこる', 'v:それ|それ', 'v:困る|こまる', 'k:店', 'k:来', 'k:行', 'k:二', 'k:日'],
    notes: 'Part-time job thread, closed here: Sasuke is trusted with the tomato dishes for the food fair and gets time off for exams. Sanji’s gallantry towards Sakura. トマト bridge (as in batches 1 and 2).',
    verified: true }),

  L({ id: 'l:n4-dlg-made-to-clean', format: 'dialogue',
    title: 'Made to clean', goal: 'You can say you were made to do something with the causative-passive (〜させられる).',
    scene: 'Sakura finds Kakashi-sensei alone in the school hall with a broom.',
    cast: { kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Teacher' }, sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Student' } },
    lines: [
      { speaker: 'sakura', furigana: 'カカシ[先生|せんせい]、こうどうで　なにを　して　いるんですか。', en: 'Kakashi-sensei, what are you doing in the hall?' },
      { speaker: 'kakashi', furigana: 'こうちょう[先生|せんせい]に　そうじを　させられて　いるんだ。', en: 'The principal is making me clean it.' },
      { speaker: 'sakura', furigana: 'また　おくれたんですか。', en: 'Were you late again?' },
      { speaker: 'kakashi', furigana: '……けさ、すこしね。それに、いすも　ぜんぶ　ならべさせられた。', en: '...A bit, this morning. And I was made to line up all the chairs, too.' },
      { speaker: 'sakura', furigana: 'わたしたち　こうこうせいも、きのう　こうちょう[先生|せんせい]の　ながい　はなしを　きかされました。', en: 'Yesterday we high-school students were made to listen to a long talk by the principal, too.' },
      { speaker: 'kakashi', furigana: 'ああ、きょういくの　はなしだね。', en: 'Ah, the one about education.' },
      { speaker: 'sakura', furigana: 'はい。「きょうそうより　だいじな　ことが　ある」って。', en: 'Yes. "There are things more important than competition."' },
      { speaker: 'kakashi', furigana: 'わたしも　まえに　きかされたよ。', en: 'I was made to listen to that one before, too.' },
      { speaker: 'sakura', furigana: '……てつだいましょうか。', en: '...Shall I help?' },
      { speaker: 'kakashi', furigana: 'たのむよ。……でも、わたしが　サクラさんに　てつだわせたと　[言|い]わないでね。', en: 'Please. ...But don’t say I made you help.' }
    ],
    remixes: [
      { scene: 'Kakashi complains about the principal again.', en: 'I was made to wait for an hour.',
        chunks: ['いちじかん', 'またされた。', 'まちされた。'], answer: ['いちじかん', 'またされた。'],
        explain: 'まつ → causative またせる → causative-passive またせられる, usually shortened to またされる.' },
      { scene: 'Sakura tells Kakashi about the school festival.', en: 'We were made to sing in the hall.',
        chunks: ['こうどうで', 'うたを', 'うたわされた。', 'うたさせられた。'], answer: ['こうどうで', 'うたを', 'うたわされた。'],
        explain: 'うたう → うたわせる (made to sing) → うたわされる (was made to sing). うたさせられた is not a form.' }
    ],
    names: ['カカシ', 'サクラ'],
    uses: ['g:causative-passive', 'g:causative', 'g:te-iru', 'g:n-desu', 'g:tte', 'g:mashou-ka', 'g:de', 'g:wo', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'v:先生|せんせい', 'v:講堂|こうどう', 'v:何|なに', 'v:する|する', 'v:校長|こうちょう', 'v:掃除|そうじ', 'v:また|また', 'v:遅れる|おくれる', 'v:今朝|けさ', 'v:少し|すこし', 'v:それに|それに', 'v:いす|いす', 'v:全部|ぜんぶ', 'v:並べる|ならべる', 'v:私|わたし', 'v:たち|たち', 'v:高校生|こうこうせい', 'v:昨日|きのう', 'v:長い|ながい', 'v:話|はなし', 'v:聞く|きく', 'v:教育|きょういく', 'v:競争|きょうそう', 'v:より|より', 'v:大事|だいじ', 'v:事|こと', 'v:ある|ある', 'v:前|まえ', 'v:手伝う|てつだう', 'v:頼む|たのむ', 'v:でも|でも', 'v:さん|さん', 'v:言う|いう', 'k:先', 'k:生', 'k:言'],
    notes: 'Kakashi-late thread, near its end (closed in u093). The principal is not named (no canon name needed).',
    verified: true }),

  L({ id: 'l:n4-dlg-hundred-yen', format: 'dialogue',
    title: 'Only one', goal: 'You can say "only ~" with しか + a negative.',
    scene: 'Back home after the winter trip, Emilia brings Nami the photos.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Friend' }, nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Friend' } },
    lines: [
      { speaker: 'emilia', furigana: 'ナミさん、[旅行|りょこう]の　[写真|しゃしん]が　できたよ。しまの　ことりの　[写真|しゃしん]も　ある。', en: 'Nami, the photos from the trip are ready. There’s one of the little birds on the island, too.' },
      { speaker: 'nami', furigana: 'ありがとう。……はあ。', en: 'Thanks. ...Sigh.' },
      { speaker: 'emilia', furigana: 'どうしたの？', en: 'What’s wrong?' },
      { speaker: 'nami', furigana: 'さいふに　[百|ひゃく][円|えん]しか　のこって　いないの。', en: 'I’ve only got a hundred yen left in my purse.' },
      { speaker: 'emilia', furigana: 'おみやげを　たくさん　かったからね。', en: 'Because you bought lots of souvenirs.' },
      { speaker: 'nami', furigana: '……エミリアさんに　かりた　おかねも、まだ　かえして　いないし。', en: '...And I still haven’t paid back the money I borrowed from you.' },
      { speaker: 'emilia', furigana: 'いいよ、あとで。……あ、これ、しまの　うみで　ひろった　いし。', en: 'That’s fine, later. ...Oh, this is a stone I picked up by the sea on the island.' },
      { speaker: 'nami', furigana: 'きれい……。でも、[一|ひと]つしかないよ。', en: 'Pretty... But there’s only one.' },
      { speaker: 'emilia', furigana: 'うん。だから　ナミさんに　あげる。', en: 'Yes. That’s why I’m giving it to you.' },
      { speaker: 'nami', furigana: '……たいてい　もらった　ものは　うるけど、これは　うらない。だいじに　する。', en: '...Usually I sell the things people give me, but not this. I’ll take good care of it.' }
    ],
    remixes: [
      { scene: 'Nami counts the photos of herself.', en: 'There are only two photos of me.',
        chunks: ['わたしの', 'しゃしんは', 'にまいしか', 'ない。', 'にまいだけ'], answer: ['わたしの', 'しゃしんは', 'にまいしか', 'ない。'],
        explain: 'しか goes with a negative (ない) and stresses "fewer than I wanted". だけ would take ある: にまいだけ ある.' },
      { scene: 'Emilia talks about the last night of the trip.', en: 'I only slept three hours.',
        chunks: ['さんじかんしか', 'ねなかった。', 'ねた。'], answer: ['さんじかんしか', 'ねなかった。'],
        explain: 'しか needs a negative verb: しか ねなかった (only slept…). しか ねた is not correct.' }
    ],
    names: ['エミリア', 'ナミ'],
    uses: ['g:shika-nai', 'g:te-iru', 'g:kara', 'g:shi', 'g:noun-modifier', 'g:no', 'g:ni', 'g:wo', 'g:de', 'g:ga', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:旅行|りょこう', 'v:写真|しゃしん', 'v:できる|できる', 'v:島|しま', 'v:小鳥|ことり', 'v:ある|ある', 'v:どう|どう', 'v:財布|さいふ', 'v:百|ひゃく', 'v:円|えん', 'v:残る|のこる', 'v:お土産|おみやげ', 'v:たくさん|たくさん', 'v:買う|かう', 'v:借りる|かりる', 'v:お金|おかね', 'v:まだ|まだ', 'v:返す|かえす', 'v:いい|いい', 'v:後|あと', 'v:これ|これ', 'v:海|うみ', 'v:拾う|ひろう', 'v:石|いし', 'v:きれい|きれい', 'v:でも|でも', 'v:一つ|ひとつ', 'v:だから|だから', 'v:あげる|あげる', 'v:たいてい|たいてい', 'v:もらう|もらう', 'v:物|もの', 'v:売る|うる', 'v:大事|だいじ', 'v:する|する', 'k:旅', 'k:行', 'k:写', 'k:真', 'k:百', 'k:円', 'k:一'],
    notes: 'Trip thread, closed: back home, the photos; Nami still owes Emilia the money from u061 / u071. Nami keeps the stone instead of selling it (her money habit, turned soft). しかない is written without a phrase space so the lib can mark it (the ref token is しかない). うん is a plain reply (unverified).',
    verified: true }),

  L({ id: 'l:n4-dlg-five-houses', format: 'dialogue',
    title: 'As many as that?', goal: 'You can say an amount is surprisingly large with number + も.',
    scene: 'In a social studies lesson, Frieren-sensei answers Anya’s question about the city.',
    cast: { frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Teacher' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Pupil' } },
    lines: [
      { speaker: 'anya', furigana: 'フリーレン[先生|せんせい]、この　しの　じんこうは　なん[人|にん]？', en: 'Frieren-sensei, what’s the population of this city?' },
      { speaker: 'frieren', furigana: '……[百|ひゃく]まん[人|にん]くらい。', en: '...About a million.' },
      { speaker: 'anya', furigana: '[百|ひゃく]まん[人|にん]も　いるの？', en: 'There are as many as a million people?' },
      { speaker: 'frieren', furigana: '……そう。でも　むかしは、いえが　[五|ご]けんしかなかった。', en: '...Yes. But long ago there were only five houses.' },
      { speaker: 'anya', furigana: '[五|ご]けん？　[先生|せんせい]、[見|み]たの？', en: 'Five houses? Did you see them, sensei?' },
      { speaker: 'frieren', furigana: '……[見|み]た。[千|せん][年|ねん]くらい　まえ。その　あと、しみんが　どんどん　ふえた。', en: '...I did. About a thousand years ago. After that, the number of people living here grew and grew.' },
      { speaker: 'anya', furigana: '[千|せん][年|ねん]も　まえ！　じゃあ、この　くにの　ひとは　なん[人|にん]？', en: 'A whole thousand years ago! Then how many people are there in this country?' },
      { speaker: 'frieren', furigana: '……[一|いち]おく[人|にん]いじょう。', en: '...More than a hundred million.' },
      { speaker: 'anya', furigana: 'アーニャ、そんなに　たくさんの　なまえ、おぼえられない。', en: 'Anya can’t remember that many names.' },
      { speaker: 'frieren', furigana: '……おぼえなくても　いい。わたしも　ぜんぶは　おぼえて　いない。だいじな　ひとの　なまえだけ。', en: '...You don’t have to. I don’t remember them all either. Only the names of the people who matter to me.' }
    ],
    unmark: [{ text: 'し', ctx: 'むかし' }, { text: 'く', ctx: 'くに' }],
    remixes: [
      { scene: 'Anya tells Frieren about waiting for the bus.', en: 'I waited as long as two hours.',
        chunks: ['にじかんも', 'まった。', 'にじかんしか'], answer: ['にじかんも', 'まった。'],
        explain: 'Number + も stresses a large amount (as long as two hours). しか would need a negative verb.' },
      { scene: 'Anya reports on her snack time.', en: 'I ate as many as five sweets.',
        chunks: ['おかしを', 'いつつも', 'たべた。', 'いつつしか'], answer: ['おかしを', 'いつつも', 'たべた。'],
        explain: 'いつつも = as many as five (more than expected). いつつしか needs ない: いつつしか たべなかった.' }
    ],
    names: ['フリーレン', 'アーニャ'],
    uses: ['g:number-mo', 'g:shika-nai', 'g:sonna-ni', 'g:nakute-mo-ii', 'g:potential', 'g:te-iru', 'g:dake', 'g:no', 'g:ga', 'g:mo', 'v:先生|せんせい', 'v:この|この', 'v:市|し', 'v:人口|じんこう', 'v:何|なん', 'v:人|にん', 'v:百|ひゃく', 'v:万|まん', 'v:くらい|くらい', 'v:居る|いる', 'v:そう|そう', 'v:でも|でも', 'v:昔|むかし', 'v:家|いえ', 'v:五|ご', 'v:軒|けん', 'v:見る|みる', 'v:千|せん', 'v:年|ねん', 'v:前|まえ', 'v:その|その', 'v:後|あと', 'v:市民|しみん', 'v:どんどん|どんどん', 'v:増える|ふえる', 'v:じゃあ|じゃあ', 'v:国|くに', 'v:人|ひと', 'v:一|いち', 'v:億|おく', 'v:以上|いじょう', 'v:そんなに|そんなに', 'v:たくさん|たくさん', 'v:名前|なまえ', 'v:覚える|おぼえる', 'v:いい|いい', 'v:私|わたし', 'v:全部|ぜんぶ', 'v:大事|だいじ', 'k:先', 'k:生', 'k:人', 'k:百', 'k:五', 'k:見', 'k:千', 'k:年', 'k:一'],
    notes: 'Frieren-and-time thread, closed: she saw the city when it was five houses, and keeps only the names that matter (a quiet nod to her series, no names). Lib limit: g:number-mo has no hl and its ref "Number+も" is not text, so it can never be marked (needs an hl in data/n4/grammar.js).',
    verified: true }),

L({ id: 'l:n4-dlg-old-temple', format: 'dialogue',
    title: 'They say', goal: 'You can report what people say or believe with 〜と言われている.',
    scene: 'On a class trip, Gojo-sensei shows Lelouch round an old temple.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Student' } },
    lines: [
      { speaker: 'gojo', furigana: 'ルルーシュさん、この　おてらは　[五|ご][百|ひゃく][年|ねん]　まえに　たてられたと　[言|い]われて　いるんだ。', en: 'Lelouch, this temple is said to have been built five hundred years ago.' },
      { speaker: 'lelouch', furigana: '[五|ご][百|ひゃく][年|ねん]……。だれが　たてたんですか。', en: 'Five hundred years... Who built it?' },
      { speaker: 'gojo', furigana: 'まちの　ひとたちだよ。せんそうの　あとで、いっしょに　たてたと　[言|い]われて　いる。', en: 'The people of the town. It’s said they built it together after a war.' },
      { speaker: 'lelouch', furigana: 'では、むかしは　まちの　せいじや　けいざいの　まんなかでも　あったんですね。', en: 'Then long ago it was also the centre of the town’s politics and economy.' },
      { speaker: 'gojo', furigana: 'よく　しってるね。ほうりつの　はなしも、ここで　したそうだよ。', en: 'You know a lot. Apparently they discussed the laws here, too.' },
      { speaker: 'lelouch', furigana: 'しゃかいや　ぶんかの　れきしが　すきなんです。', en: 'I like the history of society and culture.' },
      { speaker: 'gojo', furigana: 'じゃあ、これも　おぼえて。ここの　おかしは　[世界|せかい]で　いちばん　おいしいと　[言|い]われて　いる。', en: 'Then remember this too. The sweets here are said to be the best in the world.' },
      { speaker: 'lelouch', furigana: '……それは、だれが　[言|い]って　いるんですか。', en: '...And who says that?' },
      { speaker: 'gojo', furigana: 'わたし。', en: 'I do.' },
      { speaker: 'lelouch', furigana: '……[先生|せんせい]、それは　「[言|い]われて　いる」では　ありません。', en: '...Sensei, that is not "it is said".' }
    ],
    remixes: [
      { scene: 'Gojo explains why the temple serves green tea.', en: 'It is said that tea is good for the body.',
        chunks: ['おちゃは', 'からだに', 'いいと', 'いわれて　いる。', 'いいだと'], answer: ['おちゃは', 'からだに', 'いいと', 'いわれて　いる。'],
        explain: 'The plain form goes before と: いいと いわれて いる. An い-adjective takes no だ.' },
      { scene: 'Lelouch reads a sign by the pond.', en: 'People say this lake is deep.',
        chunks: ['この', 'みずうみは', 'ふかいと', 'いわれて　います。', 'いって　います。'], answer: ['この', 'みずうみは', 'ふかいと', 'いわれて　います。'],
        explain: 'と いわれて います (passive of いう + ている) reports what people in general say, without naming anyone.' }
    ],
    names: ['ゴジョウ', 'ルルーシュ'],
    uses: ['g:to-iwarete-iru', 'g:passive', 'g:te-iru', 'g:n-desu', 'g:sou-da-hearsay', 'g:ya', 'g:de', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'v:さん|さん', 'v:この|この', 'v:お|お', 'v:寺|てら', 'v:五|ご', 'v:百|ひゃく', 'v:年|ねん', 'v:前|まえ', 'v:建てる|たてる', 'v:言う|いう', 'v:誰|だれ', 'v:町|まち', 'v:人|ひと', 'v:たち|たち', 'v:戦争|せんそう', 'v:後|あと', 'v:一緒|いっしょ', 'v:では|では', 'v:昔|むかし', 'v:政治|せいじ', 'v:経済|けいざい', 'v:真中|まんなか', 'v:よく|よく', 'v:知る|しる', 'v:法律|ほうりつ', 'v:話|はなし', 'v:社会|しゃかい', 'v:文化|ぶんか', 'v:歴史|れきし', 'v:好き|すき', 'v:じゃあ|じゃあ', 'v:これ|これ', 'v:覚える|おぼえる', 'v:ここ|ここ', 'v:お菓子|おかし', 'v:世界|せかい', 'v:いちばん|いちばん', 'v:おいしい|おいしい', 'v:それ|それ', 'v:私|わたし', 'v:先生|せんせい', 'v:ある|ある', 'k:五', 'k:百', 'k:年', 'k:言', 'k:世', 'k:界', 'k:先', 'k:生'],
    notes: 'Gojo’s sweet tooth; Lelouch’s precision turns the grammar point into the joke (one person vs people in general). The number 五百 is in ruby so speech reads ごひゃく.',
    verified: true }),

  L({ id: 'l:n4-dlg-early-guest', format: 'dialogue',
    title: 'Welcome, sir', goal: 'You can use the honorific verbs いらっしゃる, めしあがる, ごらんになる and おっしゃる for a guest.',
    scene: 'Evening at Sanji’s restaurant. Kakashi-sensei arrives for dinner with Gojo-sensei, and he is early.',
    cast: { sanji: { name: 'Sanji', jp: 'サンジ', gender: 'M', role: 'Chef' }, kakashi: { name: 'Kakashi', jp: 'カカシ', gender: 'M', role: 'Guest' } },
    lines: [
      { speaker: 'sanji', furigana: 'いらっしゃいませ。カカシさん、きょうは　おひとりですか。', en: 'Welcome. Kakashi, are you on your own today?' },
      { speaker: 'kakashi', furigana: 'いえ、あとで　ゴジョウ[先生|せんせい]が　[来|き]ます。', en: 'No, Gojo-sensei is coming later.' },
      { speaker: 'sanji', furigana: 'ゴジョウさんは　なん[時|じ]に　いらっしゃいますか。', en: 'What time will Gojo be arriving?' },
      { speaker: 'kakashi', furigana: '[七|しち][時|じ]と　[言|い]って　いました。わたしは　[六|ろく][時|じ][半|はん]に　[来|き]ましたよ。', en: 'He said seven. I came at half past six.' },
      { speaker: 'sanji', furigana: 'カカシさんが　はやく　いらっしゃるのは、めずらしいですね。', en: 'It’s unusual for you to arrive early.' },
      { speaker: 'kakashi', furigana: 'ほんとうは、[時間|じかん]を　まちがえたんです。', en: 'To be honest, I got the time wrong.' },
      { speaker: 'sanji', furigana: 'そうでしたか。では、なにを　めしあがりますか。きょうの　さかなも　ごらんになりますか。', en: 'I see. Then what will you have? Would you also like to see today’s fish?' },
      { speaker: 'kakashi', furigana: 'コーヒーを　おねがいします。……あ、ゴジョウ[先生|せんせい]から　[電話|でんわ]です。「すこし　おくれる」そうです。', en: 'A coffee, please. ...Oh, a call from Gojo-sensei. He says he’ll be a little late.' },
      { speaker: 'sanji', furigana: 'ゴジョウさんが　そう　おっしゃって　いましたか。', en: 'Gojo said that, did he?' },
      { speaker: 'kakashi', furigana: '……きょうは　わたしが　まつ　ばんですね。', en: '...So today it’s my turn to wait.' }
    ],
    remixes: [
      { scene: 'Sanji takes the drinks order at another table.', en: 'What will you have to drink?',
        chunks: ['のみものは', 'なにを', 'めしあがりますか。', 'めしあがるますか。'], answer: ['のみものは', 'なにを', 'めしあがりますか。'],
        explain: 'めしあがる is a normal う-verb: めしあがり + ます. It is the respectful verb for someone else’s eating or drinking.' },
      { scene: 'Sanji asks about a regular customer.', en: 'What time will the teacher come?',
        chunks: ['せんせいは', 'なんじに', 'いらっしゃいますか。', 'いらっしゃりますか。'], answer: ['せんせいは', 'なんじに', 'いらっしゃいますか。'],
        explain: 'The ます-form of いらっしゃる is irregular: る → い + ます = いらっしゃいます (not いらっしゃります).' }
    ],
    names: ['サンジ', 'カカシ', 'ゴジョウ'],
    uses: ['g:sonkeigo-verbs', 'g:n-desu', 'g:te-iru', 'g:sou-da-hearsay', 'g:wo', 'g:no', 'g:ni', 'g:ga', 'g:mo', 'g:to', 'g:yo', 'g:ne', 'g:ka', 'v:いらっしゃる|いらっしゃる', 'v:さん|さん', 'v:今日|きょう', 'v:お|お', 'v:一人|ひとり', 'v:後|あと', 'v:先生|せんせい', 'v:来る|くる', 'v:何|なん', 'v:時|じ', 'v:七|しち', 'v:言う|いう', 'v:私|わたし', 'v:六|ろく', 'v:半|はん', 'v:早い|はやい', 'v:珍しい|めずらしい', 'v:ほんとう|ほんとう', 'v:時間|じかん', 'v:間違える|まちがえる', 'v:そう|そう', 'v:では|では', 'v:待つ|まつ', 'v:番|ばん', 'v:召し上がる|めしあがる', 'v:コーヒー|コーヒー', 'v:魚|さかな', 'v:ごらんになる|ごらんになる', 'v:電話|でんわ', 'v:少し|すこし', 'v:遅れる|おくれる', 'v:おっしゃる|おっしゃる', 'k:先', 'k:生', 'k:来', 'k:時', 'k:七', 'k:言', 'k:六', 'k:半', 'k:間', 'k:電', 'k:話'],
    notes: 'Kakashi-late thread, closed: he arrives early for once, by mistake, and Gojo is the late one. Sanji uses respectful verbs for his guests (Kakashi, and Gojo on the phone).',
    verified: true }),

  L({ id: 'l:n4-dlg-pharmacy-counter', format: 'dialogue',
    title: 'At the counter', goal: 'You can talk respectfully about what a customer does with お〜になる.',
    scene: 'At the pharmacy counter, Maomao gives Yor the medicine for Anya.',
    cast: { maomao: { name: 'Maomao', jp: 'マオマオ', gender: 'F', role: 'Pharmacist' }, yor: { name: 'Yor', jp: 'ヨル', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'maomao', furigana: 'ヨルさま、こちらが　おじょうさんの　くすりです。', en: 'Here is your daughter’s medicine, Mrs Yor.' },
      { speaker: 'yor', furigana: 'ありがとうございます。いつ　のませれば　いいですか。', en: 'Thank you. When should I give it to her?' },
      { speaker: 'maomao', furigana: 'ごはんの　あとです。おこさんが　お[飲|の]みに　なる　ときは、みずと　いっしょに。', en: 'After meals. When your child takes it, with water.' },
      { speaker: 'yor', furigana: 'わかりました。', en: 'I understand.' },
      { speaker: 'maomao', furigana: 'それから、ご[主|しゅ]じんの　くすりは、もう　お[持|も]ちに　なりましたか。', en: 'Also, has your husband already taken his medicine home?' },
      { speaker: 'yor', furigana: 'はい、きのう　[持|も]って　[帰|かえ]りました。……あの、そふと　そぼの　くすりも　おねがいしたいんですが。', en: 'Yes, he took it home yesterday. ...Um, I’d also like to ask about medicine for my grandfather and grandmother.' },
      { speaker: 'maomao', furigana: 'おふたりは　いつも、どんな　くすりを　お[飲|の]みに　なりますか。', en: 'What medicine do they usually take?' },
      { speaker: 'yor', furigana: '……わかりません。こんど　きいて　きます。', en: '...I don’t know. I’ll ask them next time.' },
      { speaker: 'maomao', furigana: 'では、いま　のんで　いる　くすりの　なまえを　かいて　きて　ください。', en: 'Then please write down the names of the medicines they take now, and bring them.' },
      { speaker: 'yor', furigana: 'マオマオさんは、いつも　ていねいですね。', en: 'You’re always so polite, Maomao.' }
    ],
    remixes: [
      { scene: 'A regular customer asks about Frieren-sensei.', en: 'Has the teacher already gone home?',
        chunks: ['せんせいは', 'もう', 'おかえりに', 'なりましたか。', 'おかえるに'], answer: ['せんせいは', 'もう', 'おかえりに', 'なりましたか。'],
        explain: 'お + the ます-stem (かえり) + に なる. The dictionary form (かえる) does not fit in the pattern.' },
      { scene: 'Maomao asks another customer about their medicine.', en: 'Which medicine will you take?',
        chunks: ['どの', 'くすりを', 'おのみに', 'なりますか。', 'おのむに'], answer: ['どの', 'くすりを', 'おのみに', 'なりますか。'],
        explain: 'お〜に なる raises the listener: おのみに なります = (you) take. Never use it for yourself.' }
    ],
    names: ['マオマオ', 'ヨル'],
    uses: ['g:o-ni-naru', 'g:causative', 'g:ba', 'g:te-iru', 'g:te-kudasai', 'g:te-kuru', 'g:n-desu', 'g:noun-modifier', 'g:to', 'g:no', 'g:ni', 'g:wo', 'g:ga', 'g:mo', 'g:ne', 'v:様|さま', 'v:こちら|こちら', 'v:お嬢さん|おじょうさん', 'v:薬|くすり', 'v:いつ|いつ', 'v:飲む|のむ', 'v:いい|いい', 'v:御飯|ごはん', 'v:後|あと', 'v:お子さん|おこさん', 'v:なる|なる', 'v:時|とき', 'v:水|みず', 'v:一緒|いっしょ', 'v:分かる|わかる', 'v:それから|それから', 'v:御主人|ごしゅじん', 'v:もう|もう', 'v:持つ|もつ', 'v:昨日|きのう', 'v:帰る|かえる', 'v:あの|あの', 'v:祖父|そふ', 'v:祖母|そぼ', 'v:二人|ふたり', 'v:どんな|どんな', 'v:今度|こんど', 'v:聞く|きく', 'v:では|では', 'v:今|いま', 'v:名前|なまえ', 'v:書く|かく', 'v:さん|さん', 'v:いつも|いつも', 'v:丁寧|ていねい', 'k:飲', 'k:持', 'k:帰', 'k:主'],
    notes: 'Anya’s home thread (her medicine); Yor at the pharmacy (b1 u033 Sakura trains there). Maomao is formal with a customer (お〜になる, 〜さま) and blunt underneath. Yor says そふ / そぼ for her own grandparents.',
    verified: true }),

  L({ id: 'l:n4-dlg-cinema-seat', format: 'dialogue',
    title: 'Please wait here', goal: 'You can make a very polite request with お〜ください.',
    scene: 'Sakura has a part-time job at the cinema. Sasuke turns up at her counter.',
    cast: { sakura: { name: 'Sakura', jp: 'サクラ', gender: 'F', role: 'Cinema staff' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Customer' } },
    lines: [
      { speaker: 'sakura', furigana: 'いらっしゃいませ。ごりよう　ありがとう　ございます。……あ、サスケさん。', en: 'Welcome, and thank you for coming. ...Oh, Sasuke.' },
      { speaker: 'sasuke', furigana: '……[映画|えいが]を　[見|み]に　[来|き]た。', en: '...I came to see a film.' },
      { speaker: 'sakura', furigana: 'では、きっぷを　お[見|み]せ　ください。', en: 'Then please show me your ticket.' },
      { speaker: 'sasuke', furigana: '……サクラさん、ふつうに　[話|はな]せ。', en: '...Sakura, talk normally.' },
      { speaker: 'sakura', furigana: 'いまは　しごと[中|ちゅう]です。まえの　せきと　うしろの　せき、どちらに　なさいますか。', en: 'I’m working right now. Would you like a seat at the front or at the back?' },
      { speaker: 'sasuke', furigana: '……うしろ。', en: '...The back.' },
      { speaker: 'sakura', furigana: 'では、こちらで　[少|すこ]し　お[待|ま]ち　ください。……はい、うしろの　せきです。スクリーンが　よく　[見|み]えますよ。', en: 'Then please wait here a moment. ...Here: a seat at the back. You can see the screen well.' },
      { speaker: 'sasuke', furigana: '……しごとは　なん[時|じ]に　[終|お]わる？', en: '...What time does your shift end?' },
      { speaker: 'sakura', furigana: '[九|く][時|じ]。[終|お]わったら　しらせるね。', en: 'Nine. I’ll let you know when I finish.' },
      { speaker: 'sasuke', furigana: '……まって　いる。', en: '...I’ll wait.' }
    ],
    unmark: [{ text: 'ご', ctx: 'ございます' }, { text: 'ご', ctx: 'しごと' }],
    remixes: [
      { scene: 'Sakura talks to the next customer.', en: 'Please wait over there.',
        chunks: ['あちらで', 'おまち', 'ください。', 'おまつ'], answer: ['あちらで', 'おまち', 'ください。'],
        explain: 'お + the ます-stem (まち) + ください: more polite than まって ください.' },
      { scene: 'A customer wants a membership card.', en: 'Please write your name here.',
        chunks: ['ここに', 'おなまえを', 'おかき', 'ください。', 'おかく'], answer: ['ここに', 'おなまえを', 'おかき', 'ください。'],
        explain: 'かく → かきます → お + かき + ください. The dictionary form cannot go in the pattern.' }
    ],
    names: ['サクラ', 'サスケ'],
    uses: ['g:o-kudasai', 'g:sonkeigo-verbs', 'g:imperative', 'g:tara', 'g:to', 'g:de', 'g:no', 'g:ni', 'g:wo', 'g:ga', 'g:yo', 'g:ne', 'v:ご|ご', 'v:利用|りよう', 'v:さん|さん', 'v:映画|えいが', 'v:見る|みる', 'v:来る|くる', 'v:では|では', 'v:切符|きっぷ', 'v:見せる|みせる', 'v:普通|ふつう', 'v:話す|はなす', 'v:今|いま', 'v:仕事|しごと', 'v:中|ちゅう', 'v:前|まえ', 'v:席|せき', 'v:後ろ|うしろ', 'v:どちら|どちら', 'v:なさる|なさる', 'v:こちら|こちら', 'v:少し|すこし', 'v:待つ|まつ', 'v:スクリーン|スクリーン', 'v:よく|よく', 'v:見える|みえる', 'v:何|なん', 'v:時|じ', 'v:終わる|おわる', 'v:九|く', 'v:知らせる|しらせる', 'k:映', 'k:画', 'k:見', 'k:来', 'k:話', 'k:中', 'k:少', 'k:待', 'k:時', 'k:終', 'k:九'],
    notes: 'Sasuke + Sakura thread, closed: Sakura’s part-time job at the cinema; she keeps to keigo at the counter, then drops it for one line. Sasuke uses さん (cast rule) with a plain imperative (話せ). Lib note: せき is written without お so the new-word mark can take it (おせき fails the word-boundary rule).',
    verified: true }),

  L({ id: 'l:n4-dlg-western-book', format: 'dialogue',
    title: 'Let me send it', goal: 'You can offer to do something for a customer with the humble お〜する.',
    scene: 'Nami works in an old bookshop. Frieren-sensei finds a book she has been looking for.',
    cast: { nami: { name: 'Nami', jp: 'ナミ', gender: 'F', role: 'Shop staff' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Customer' } },
    lines: [
      { speaker: 'nami', furigana: 'いらっしゃいませ。その　[本|ほん]、お[見|み]せ　しましょうか。', en: 'Welcome. Shall I show you that book?' },
      { speaker: 'frieren', furigana: '……おねがい。いつの　じだいの　[本|ほん]？', en: '...Please. What period is it from?' },
      { speaker: 'nami', furigana: 'せいようの、[三|さん]びゃく[年|ねん]　まえの　[本|ほん]です。', en: 'It’s a Western book, three hundred years old.' },
      { speaker: 'frieren', furigana: '……まほうの　[本|ほん]だ。いくら？', en: '...It’s a book of magic. How much?' },
      { speaker: 'nami', furigana: '[三|さん]まん[円|えん]です。', en: 'Thirty thousand yen.' },
      { speaker: 'frieren', furigana: '……たかい。でも、かう。おかねを　ひきだして　くる。', en: '...Expensive. But I’ll buy it. I’ll go and take out some money.' },
      { speaker: 'nami', furigana: 'ありがとうございます！　おもいので、いえまで　お[送|おく]り　しましょうか。', en: 'Thank you very much! It’s heavy, so shall I send it to your home?' },
      { speaker: 'frieren', furigana: '……かまわないの？', en: '...You don’t mind?' },
      { speaker: 'nami', furigana: 'はい、かまいません。ページが　たりなかったら、あたらしいのと　とりかえます。', en: 'No, not at all. If there are pages missing, we’ll exchange it for another one.' },
      { speaker: 'frieren', furigana: '……では、おねがい。[千|せん][年|ねん]　さがして　いた　[本|ほん]だから。', en: '...Then please do. It’s a book I’ve been looking for for a thousand years.' }
    ],
    bridge: [
      { text: 'まほう', gloss: 'まほう = magic, a spell' }
    ],
    remixes: [
      { scene: 'Another customer comes in with lots of bags.', en: 'Shall I carry your luggage?',
        chunks: ['おにもつを', 'おもち', 'しましょうか。', 'おもつ'], answer: ['おにもつを', 'おもち', 'しましょうか。'],
        explain: 'Humble: お + the ます-stem (もち) + する. It is about your own action for the other person.' },
      { scene: 'Nami tells Frieren when the book will arrive.', en: 'I’ll send it tomorrow.',
        chunks: ['あした', 'おおくり', 'します。', 'おおくる'], answer: ['あした', 'おおくり', 'します。'],
        explain: 'おくる → おくります → お + おくり + します. The stem, not the dictionary form, goes between お and する.' }
    ],
    names: ['ナミ', 'フリーレン'],
    uses: ['g:o-suru', 'g:mashou-ka', 'g:te-kuru', 'g:node', 'g:tara', 'g:te-iru', 'g:noun-modifier', 'g:kara', 'g:made', 'g:no', 'g:wo', 'g:to', 'g:ga', 'v:その|その', 'v:本|ほん', 'v:見せる|みせる', 'v:いつ|いつ', 'v:時代|じだい', 'v:西洋|せいよう', 'v:三|さん', 'v:年|ねん', 'v:前|まえ', 'v:いくら|いくら', 'v:万|まん', 'v:円|えん', 'v:高い|たかい', 'v:でも|でも', 'v:買う|かう', 'v:お金|おかね', 'v:ひきだす|ひきだす', 'v:重い|おもい', 'v:家|いえ', 'v:送る|おくる', 'v:かまう|かまう', 'v:ページ|ページ', 'v:足りる|たりる', 'v:新しい|あたらしい', 'v:取り替える|とりかえる', 'v:では|では', 'v:千|せん', 'v:探す|さがす', 'k:本', 'k:見', 'k:三', 'k:年', 'k:円', 'k:送', 'k:千'],
    notes: 'Nami (money, sales) as shop staff and Frieren collecting old books of magic: their second meeting (b1 u022). まほう is a bridge.',
    verified: true }),

  L({ id: 'l:n4-dlg-job-call', format: 'dialogue',
    title: 'Calling about the job', goal: 'You can talk humbly about your own actions with いたします / まいります / もうします.',
    scene: 'Emilia phones a bookshop about a part-time job. Lelouch, who works there, answers.',
    cast: { emilia: { name: 'Emilia', jp: 'エミリア', gender: 'F', role: 'Caller' }, lelouch: { name: 'Lelouch', jp: 'ルルーシュ', gender: 'M', role: 'Shop staff' } },
    lines: [
      { speaker: 'lelouch', furigana: 'はい、[本|ほん][屋|や]です。', en: 'Hello, bookshop.' },
      { speaker: 'emilia', furigana: 'エミリアと　もうします。アルバイトの　ことで　お[電話|でんわ]　いたしました。', en: 'My name is Emilia. I’m calling about the part-time job.' },
      { speaker: 'lelouch', furigana: '……エミリアさん？　ルルーシュです。', en: '...Emilia? It’s Lelouch.' },
      { speaker: 'emilia', furigana: 'えっ、ルルーシュさん？　……あ、[店|みせ]の　かたは　いらっしゃいますか。', en: 'Oh, Lelouch? ...Ah, is the person in charge there?' },
      { speaker: 'lelouch', furigana: 'いま　でかけて　います。わたしから　つたえて　おきます。', en: 'They’re out right now. I’ll pass on the message.' },
      { speaker: 'emilia', furigana: 'では、あした　[十|じゅう][時|じ]に　そちらへ　まいります。', en: 'Then I’ll come over at ten tomorrow.' },
      { speaker: 'lelouch', furigana: 'わかりました。……エミリアさん、どうして　そんなに　ていねいなんですか。', en: 'Understood. ...Emilia, why are you being so polite?' },
      { speaker: 'emilia', furigana: 'しごとの　お[電話|でんわ]ですから。……あした、[店|みせ]の　なかも　はいけん　したいです。', en: 'Because it’s a work call. ...Tomorrow I’d like to have a look inside the shop, too.' },
      { speaker: 'lelouch', furigana: 'どうぞ。では、お[待|ま]ち　して　います。', en: 'Of course. Then I’ll be waiting for you.' },
      { speaker: 'emilia', furigana: 'よろしく　おねがい　いたします。', en: 'Thank you, I look forward to it.' }
    ],
    remixes: [
      { scene: 'Emilia calls back the next day.', en: 'I’ll come again tomorrow.',
        chunks: ['あした', 'また', 'まいります。', 'いらっしゃいます。'], answer: ['あした', 'また', 'まいります。'],
        explain: 'まいります is the humble verb for your own coming or going. いらっしゃいます raises the other person, so it is never used about yourself.' },
      { scene: 'Lelouch answers the phone at the shop.', en: 'My name is Lelouch.',
        chunks: ['ルルーシュと', 'もうします。', 'おっしゃいます。'], answer: ['ルルーシュと', 'もうします。'],
        explain: 'Your own name: 〜と もうします (humble). おっしゃいます is for what someone above you says.' }
    ],
    names: ['エミリア', 'ルルーシュ'],
    uses: ['g:itasu', 'g:o-suru', 'g:sonkeigo-verbs', 'g:te-iru', 'g:te-oku', 'g:tai', 'g:sonna-ni', 'g:n-desu', 'g:kara', 'g:no', 'g:ni', 'g:to', 'g:mo', 'v:本|ほん', 'v:屋|や', 'v:申す|もうす', 'v:アルバイト|アルバイト', 'v:事|こと', 'v:電話|でんわ', 'v:致す|いたす', 'v:さん|さん', 'v:店|みせ', 'v:方|かた', 'v:いらっしゃる|いらっしゃる', 'v:今|いま', 'v:出かける|でかける', 'v:私|わたし', 'v:伝える|つたえる', 'v:では|では', 'v:明日|あした', 'v:十|じゅう', 'v:時|じ', 'v:そちら|そちら', 'v:参る|まいる', 'v:分かる|わかる', 'v:どうして|どうして', 'v:そんなに|そんなに', 'v:丁寧|ていねい', 'v:仕事|しごと', 'v:中|なか', 'v:拝見|はいけん', 'v:どうぞ|どうぞ', 'v:待つ|まつ', 'k:本', 'k:屋', 'k:電', 'k:話', 'k:店', 'k:十', 'k:時', 'k:待'],
    notes: 'A new small thread to close the course: Emilia looks for a part-time job (Lelouch already works at the bookshop). Lib limit: the unit words 申す, 致す, 参る take every もうし / いたし / まいり, so g:itasu gets no mark (validator WARN, as batch 1 u015 / u031).',
    verified: true }),

  L({ id: 'l:n4-dlg-country-inn', format: 'dialogue',
    title: 'Here is your room', goal: 'You can understand very polite ございます / でございます from hotel and shop staff.',
    scene: 'Hinata is helping at an inn in the countryside over the winter break. Frieren arrives as a guest.',
    cast: { hinata: { name: 'Hinata', jp: 'ヒナタ', gender: 'M', role: 'Inn staff' }, frieren: { name: 'Frieren', jp: 'フリーレン', gender: 'F', role: 'Guest' } },
    lines: [
      { speaker: 'hinata', furigana: 'いらっしゃいませ！　フリーレンさまで　いらっしゃいますか。', en: 'Welcome! Would you be Ms Frieren?' },
      { speaker: 'frieren', furigana: '……そう。しずかな　ところだね。', en: '...Yes. It’s a quiet place.' },
      { speaker: 'hinata', furigana: 'はい！　いなかですから。おへやは　[二|に]かいで　ございます。', en: 'Yes! It’s the countryside. Your room is on the second floor.' },
      { speaker: 'frieren', furigana: '……まちの　ビルより　いい。', en: '...Better than the buildings in town.' },
      { speaker: 'hinata', furigana: 'こちらで　ございます。おちゃも　ございますよ。', en: 'Here it is. There’s tea, too.' },
      { speaker: 'frieren', furigana: '……この　え、アフリカ？', en: '...This picture: is it Africa?', say: '……この絵、アフリカ？' },
      { speaker: 'hinata', furigana: 'いいえ、アジアの　やまで　ございます。アメリカの　おきゃくさまにも　よく　きかれます。', en: 'No, it’s a mountain in Asia. Guests from America often ask too.' },
      { speaker: 'frieren', furigana: '……むかし、あの　やまに　のぼった。', en: '...I climbed that mountain long ago.' },
      { speaker: 'hinata', furigana: 'ほんとうですか！　……あ、[夕|ゆう]はんは　[七|しち][時|じ]で　ございます。よろしければ、おへやで　めしあがりますか。', en: 'Really! ...Oh, dinner is at seven. If you like, would you have it in your room?' },
      { speaker: 'frieren', furigana: '……おねがい。やまの　はなしは、その　あとで　して　あげる。', en: '...Yes, please. I’ll tell you about the mountain after that.' }
    ],
    remixes: [
      { scene: 'Hinata shows another guest round the inn.', en: 'The bath is on the first floor.',
        chunks: ['おふろは', 'いっかいに', 'ございます。', 'ございです。'], answer: ['おふろは', 'いっかいに', 'ございます。'],
        explain: 'に ございます is the very polite に あります (where something is). ございです is not a form.' },
      { scene: 'Hinata brings a tray to the room.', en: 'This is the tea.',
        chunks: ['こちらが', 'おちゃで', 'ございます。', 'おちゃに'], answer: ['こちらが', 'おちゃで', 'ございます。'],
        explain: 'で ございます is the very polite です: おちゃです → おちゃで ございます.' }
    ],
    names: ['ヒナタ', 'フリーレン'],
    uses: ['g:gozaimasu', 'g:sonkeigo-verbs', 'g:passive', 'g:ba', 'g:te-ageru', 'g:kara', 'g:de', 'g:no', 'g:ni', 'g:mo', 'g:yo', 'g:ne', 'v:様|さま', 'v:いらっしゃる|いらっしゃる', 'v:そう|そう', 'v:静か|しずか', 'v:所|ところ', 'v:田舎|いなか', 'v:お|お', 'v:部屋|へや', 'v:二|に', 'v:階|かい', 'v:ございます|ございます', 'v:町|まち', 'v:ビル|ビル', 'v:より|より', 'v:いい|いい', 'v:こちら|こちら', 'v:お茶|おちゃ', 'v:この|この', 'v:絵|え', 'v:アフリカ|アフリカ', 'v:アジア|アジア', 'v:山|やま', 'v:アメリカ|アメリカ', 'v:客|きゃく', 'v:よく|よく', 'v:聞く|きく', 'v:昔|むかし', 'v:あの|あの', 'v:登る|のぼる', 'v:ほんとう|ほんとう', 'v:夕飯|ゆうはん', 'v:七|しち', 'v:時|じ', 'v:よろしい|よろしい', 'v:召し上がる|めしあがる', 'v:話|はなし', 'v:その|その', 'v:後|あと', 'v:する|する', 'k:二', 'k:夕', 'k:七', 'k:時'],
    notes: 'Frieren travelling (series nod: she has climbed every mountain, long ago). Hinata in keigo at a part-time inn job is the comic register clash; he keeps to it throughout. おきゃくさま = お + 客 + 様.',
    verified: true }),

  L({ id: 'l:n4-dlg-broken-umbrella', format: 'dialogue',
    title: 'See, I told you', goal: 'You can point something out ("see, isn’t it!") with 〜じゃないか.',
    scene: 'Sasuke, just back from the barber’s, walks home with Killua under a grey sky.',
    cast: { killua: { name: 'Killua', jp: 'キルア', gender: 'M', role: 'Kid' }, sasuke: { name: 'Sasuke', jp: 'サスケ', gender: 'M', role: 'Older friend' } },
    lines: [
      { speaker: 'killua', furigana: 'サスケさん、とこやの　かえり？', en: 'Sasuke, on your way back from the barber’s?' },
      { speaker: 'sasuke', furigana: '……ああ。……キルアさん、かさで　えだを　おるな。', en: '...Yeah. ...Killua, don’t break branches with the umbrella.' },
      { speaker: 'killua', furigana: 'だいじょうぶ、だいじょうぶ。……あ。', en: 'It’s fine, it’s fine. ...Oops.' },
      { speaker: 'sasuke', furigana: '……かさが　おれた　じゃないか。', en: '...See, the umbrella’s broken.' },
      { speaker: 'killua', furigana: '……えだは　おって　ない。えだが　かたかったんだ。', en: '...I didn’t break the branch. The branch was too hard.' },
      { speaker: 'sasuke', furigana: 'だから　やめろと　[言|い]った　じゃないか。', en: 'That’s why I told you to stop.' },
      { speaker: 'killua', furigana: '……わるかった。これ、サスケさんの　かさだったね。', en: '...Sorry. This was your umbrella, wasn’t it?' },
      { speaker: 'sasuke', furigana: '……もうすぐ　あめが　ふる。', en: '...It’s going to rain soon.' },
      { speaker: 'killua', furigana: 'じゃあ、はしろう！', en: 'Then let’s run!' },
      { speaker: 'sasuke', furigana: '……かみが　ぬれる。', en: '...My hair will get wet.' }
    ],
    remixes: [
      { scene: 'The rain starts before they get home.', en: 'See, it’s raining!',
        chunks: ['あめが', 'ふって　いる', 'じゃないか。', 'ふって　いるだ'], answer: ['あめが', 'ふって　いる', 'じゃないか。'],
        explain: 'じゃないか follows the plain form directly: ふって いる じゃないか. No だ before it.' },
      { scene: 'Sasuke finds his other umbrella in Killua’s bag.', en: 'Isn’t that my umbrella!',
        chunks: ['それは', 'わたしの　かさ', 'じゃないか。', 'わたしの　かさだ'], answer: ['それは', 'わたしの　かさ', 'じゃないか。'],
        explain: 'A noun goes straight before じゃないか: かさ じゃないか (falling tone: "look, it’s my umbrella!").' }
    ],
    names: ['キルア', 'サスケ'],
    uses: ['g:ja-nai-ka', 'g:na-prohibitive', 'g:imperative', 'g:volitional', 'g:kara', 'g:de', 'g:no', 'g:wo', 'g:ga', 'g:to', 'g:ne', 'v:さん|さん', 'v:とこや|とこや', 'v:帰り|かえり', 'v:傘|かさ', 'v:枝|えだ', 'v:折る|おる', 'v:大丈夫|だいじょうぶ', 'v:折れる|おれる', 'v:固い|かたい', 'v:だから|だから', 'v:止める|やめる', 'v:言う|いう', 'v:悪い|わるい', 'v:これ|これ', 'v:もうすぐ|もうすぐ', 'v:雨|あめ', 'v:降る|ふる', 'v:じゃあ|じゃあ', 'v:走る|はしる', 'v:髪|かみ', 'v:ぬれる|ぬれる', 'k:言'],
    notes: 'Sasuke (curt, older) and Killua (mischievous kid): first pairing. The fresh haircut is the closing beat. Remix 2 uses わたし for Sasuke (おれ is not taught).',
    verified: true }),

  L({ id: 'l:n4-dlg-sweet-shop', format: 'dialogue',
    title: 'I wonder if it’s open', goal: 'You can wonder aloud with かな, and ask a friendly question with かい.',
    scene: 'On a Saturday, Gojo-sensei meets Anya on the way to a sweet shop near the station.',
    cast: { gojo: { name: 'Gojo', jp: 'ゴジョウ', gender: 'M', role: 'Teacher' }, anya: { name: 'Anya', jp: 'アーニャ', gender: 'F', role: 'Child' } },
    lines: [
      { speaker: 'gojo', furigana: 'アーニャさん、げんきかい？', en: 'Hi Anya, how are you doing?' },
      { speaker: 'anya', furigana: 'げんき！　ゴジョウ[先生|せんせい]、どこ　[行|い]くの？', en: 'Good! Gojo-sensei, where are you going?' },
      { speaker: 'gojo', furigana: 'ぼくは　えきの　まえの　おかしの　[店|みせ]。きょうは　あいて　いるかな。', en: 'I’m off to the sweet shop by the station. I wonder if it’s open today.' },
      { speaker: 'anya', furigana: 'アーニャも　[行|い]く！　……あ、ひとが　いっぱい　ならんで　いる。', en: 'Anya’s coming too! ...Oh, lots of people are queuing.' },
      { speaker: 'gojo', furigana: 'かれらも　[店|みせ]が　あくのを　まって　いるのかな。', en: 'I wonder if they’re waiting for the shop to open, too.' },
      { speaker: 'anya', furigana: 'すごい……。おかし、のこって　いるかな。', en: 'Wow... I wonder if there’ll be any sweets left.' },
      { speaker: 'gojo', furigana: 'だいじょうぶ。アーニャさんは　なにが　ほしいの？', en: 'Don’t worry. What do you want, Anya?' },
      { speaker: 'anya', furigana: 'ピーナッツの　おかし！', en: 'Peanut sweets!' },
      { speaker: 'gojo', furigana: 'あるかな。……あ、あいたよ。[行|い]くかい？', en: 'I wonder if they have them. ...Oh, it’s open. Shall we go?' },
      { speaker: 'anya', furigana: '[行|い]く！', en: 'Let’s go!' }
    ],
    bridge: [
      { text: 'ピーナッツ', gloss: 'ピーナッツ = peanuts' }
    ],
    remixes: [
      { scene: 'Gojo looks at the sky as they leave the shop.', en: 'I wonder if it will rain tomorrow.',
        chunks: ['あしたは', 'あめが', 'ふるかな。', 'ふりますかな。'], answer: ['あしたは', 'あめが', 'ふるかな。'],
        explain: 'かな follows the plain form: ふるかな. For a polite question, use 〜でしょうか instead.' },
      { scene: 'Gojo asks Anya about the next weekend.', en: 'Are you coming again next week, Anya?',
        chunks: ['アーニャさんも', 'らいしゅう', 'くるかい？', 'きますかい？'], answer: ['アーニャさんも', 'らいしゅう', 'くるかい？'],
        explain: 'かい is a friendly yes / no question ending after the plain form (くるかい). It is not added to です / ます.' }
    ],
    names: ['ゴジョウ', 'アーニャ'],
    uses: ['g:kana-kashira', 'g:kai', 'g:te-iru', 'g:no', 'g:wo', 'g:ga', 'g:mo', 'g:yo', 'v:さん|さん', 'v:元気|げんき', 'v:先生|せんせい', 'v:どこ|どこ', 'v:行く|いく', 'v:僕|ぼく', 'v:駅|えき', 'v:前|まえ', 'v:お菓子|おかし', 'v:店|みせ', 'v:今日|きょう', 'v:開く|あく', 'v:人|ひと', 'v:いっぱい|いっぱい', 'v:並ぶ|ならぶ', 'v:彼ら|かれら', 'v:待つ|まつ', 'v:凄い|すごい', 'v:残る|のこる', 'v:大丈夫|だいじょうぶ', 'v:何|なに', 'v:欲しい|ほしい', 'v:ある|ある', 'k:先', 'k:生', 'k:行', 'k:店'],
    notes: 'Anya’s peanuts (ピーナッツ bridge) and Gojo’s sweets; Gojo says ぼく (taught here). The unit words 君 (くん) and ちゃん are not used: the cast keeps さん everywhere (owner decision). かしら is not used (Anya and Gojo would not say it); かな carries the point.',
    verified: true })
]);
})();
