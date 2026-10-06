"use strict";

// N5 mock exams (ticket 18, Q37): fixed tests, the same questions in the same order every time.
// Written for this project in the official N5 formats (nothing copied from jlpt.jp workbooks).
//   format 'full'       = the real N5 blueprint (lib.js MOCK_BLUEPRINT.full, item counts from
//                         jlpt.jp), timed at the real 20 / 40 / 30 minutes (MOCK_PACE).
//   format 'diagnostic' = about half of it, every mondai kept; open from the Units tab anytime.
// sections.vocab / grammar / listening: one entry per question, in test order. `m` = the mondai:
//   kanjiYomi / hyouki   s: catalog sentence, w: the vocab item underlined in it, o: options, a: answer
//   bunmyaku / gap       f: own sentence with （　） ([漢字|かな] ruby), o (ruby), a, en, explain
//   order                s: sentence with chunks (★), star: the ★ slot, o: chunk indexes as shown
//   iikae / bunshou      item: m: id (bunshou: blank n), o: option indexes as shown
//   reading              p: passage, q: its question index, o: option indexes as shown
//   listening            l: listening item (options keep their authored order, 1 replay)
// No passage, listening item or authored mondai is used by two mocks or by a lesson review, and
// none is drawn by prep drills (mockItemIds). `uses` / `names` cover the authored gap / bunmyaku
// Japanese (checked like an own text in tests/catalog-checks.js). verified:false: one source (own).
CATALOG.add([
  { id: "x:n5-mock-1", kind: 'mock', level: 'N5', format: "full", title: "N5 mock exam 1",
    sections: {
     vocab: [
      {"m":"kanjiYomi","s":"s:own:n5-wa-desu","w":"v:学生|がくせい","o":["がくせい","がっせい","かくせい","がくせ"],"a":0},
      {"m":"kanjiYomi","s":"s:tatoeba:152388","w":"v:外国|がいこく","o":["がいこう","がいこく","がいごく","かいこく"],"a":1},
      {"m":"kanjiYomi","s":"s:tatoeba:10901611","w":"v:名前|なまえ","o":["めいぜん","なまへ","なまえ","なまい"],"a":2},
      {"m":"kanjiYomi","s":"s:tatoeba:10901910","w":"v:今年|ことし","o":["ことじ","きょねん","こんねん","ことし"],"a":3},
      {"m":"kanjiYomi","s":"s:tatoeba:189557","w":"v:雨|あめ","o":["あま","ゆき","あめ","くも"],"a":2},
      {"m":"kanjiYomi","s":"s:tatoeba:9528358","w":"v:電車|でんしゃ","o":["てんしゃ","でんしゃ","でんしや","でんじゃ"],"a":1},
      {"m":"kanjiYomi","s":"s:tatoeba:80128","w":"v:木|き","o":["こ","もく","ぼく","き"],"a":3},
      {"m":"hyouki","s":"s:tatoeba:123124","w":"v:二人|ふたり","o":["二人","二入","二八","二大"],"a":0},
      {"m":"hyouki","s":"s:tatoeba:236801","w":"v:タクシー|タクシー","o":["タクシー","タクツー","ダクシー","クタシー"],"a":0},
      {"m":"hyouki","s":"s:tatoeba:11065768","w":"v:前|まえ","o":["後","前","間","先"],"a":1},
      {"m":"hyouki","s":"s:tatoeba:10883885","w":"v:読む|よむ","o":["語む","話む","読む","続む"],"a":2},
      {"m":"hyouki","s":"s:tatoeba:202389","w":"v:上|うえ","o":["工","止","土","上"],"a":3},
      {"m":"bunmyaku","f":"さむいですから、まどを（　）ください。","o":["あけて","きって","しめて","けして"],"a":2,"en":"It is cold, so please close the window.","explain":"When it is cold you close (しめる) a window; あける (open) is the opposite, and きる / けす don't go with まど."},
      {"m":"bunmyaku","f":"わたしは　まいばん　はを（　）から　ねます。","o":["きって","みがいて","のんで","かいて"],"a":1,"en":"Every night I brush my teeth before going to bed.","explain":"Teeth are brushed: はをみがく. かく (write), きる (cut) and のむ (drink) don't fit は."},
      {"m":"bunmyaku","f":"くらいですから、[電気|でんき]を（　）ください。","o":["おして","けして","しめて","つけて"],"a":3,"en":"It is dark, so please turn on the light.","explain":"In the dark you turn a light on: でんきをつける. けす (turn off) is the opposite; しめる and おす don't go with でんき."},
      {"m":"bunmyaku","f":"えきは　ここから（　）ですから、あるいて　[行|い]きましょう。","o":["ちかい","おもい","とおい","ひろい"],"a":0,"en":"The station is close from here, so let's walk.","explain":"You walk because it is near (ちかい). とおい (far) would be a reason not to walk; ひろい and おもい don't describe a distance."},
      {"m":"bunmyaku","f":"あついですね。つめたい（　）を　のみませんか。","o":["おちゃ","パン","おかし","ごはん"],"a":0,"en":"It's hot, isn't it? Shall we drink some cold tea?","explain":"Only a drink goes with のむ: おちゃ. Bread, sweets and rice are eaten (たべる)."},
      {"m":"bunmyaku","f":"りょこうの　しゃしんを　[友|とも]だちに（　）。","o":["みました","みせました","よみました","ききました"],"a":1,"en":"I showed my friend the photos from my trip.","explain":"Xに Yを みせる = show Y to X. みる (look at) has no 友だちに, and photos are not heard or read."},
      {"m":"iikae","item":"m:n5-iikae-kurai","o":[2,3,0,1]},
      {"m":"iikae","item":"m:n5-iikae-ototoi","o":[3,2,1,0]},
      {"m":"iikae","item":"m:n5-iikae-kashimashita","o":[1,2,0,3]}
      ],
     grammar: [
      {"m":"gap","f":"わたしは　まいあさ　コーヒー（　）のみます。","o":["に","を","で","が"],"a":1,"en":"I drink coffee every morning.","explain":"のむ takes its object with を."},
      {"m":"gap","f":"わたしは　[日|にち]ようびに　[友|とも]だち（　）いっしょに　[山|やま]へ　[行|い]きました。","o":["が","を","に","と"],"a":3,"en":"On Sunday I went to the mountains with a friend.","explain":"Together with someone is Xといっしょに."},
      {"m":"gap","f":"この　かばんは　[高|たか]い（　）、かいませんでした。","o":["から","より","に","まで"],"a":0,"en":"This bag was expensive, so I didn't buy it.","explain":"The price is the reason for not buying: から \"so\". より compares, まで marks a limit, and に can't follow an adjective."},
      {"m":"gap","f":"あしたは　[雨|あめ]が　ふる（　）。","o":["でしょう","ましょう","ください","ています"],"a":0,"en":"It will probably rain tomorrow.","explain":"A guess about tomorrow: dictionary form + でしょう. ましょう / ください / ています need other verb forms."},
      {"m":"gap","f":"へやに　だれ（　）いません。","o":["を","も","へ","で"],"a":1,"en":"There is nobody in the room.","explain":"だれも + a negative verb = nobody."},
      {"m":"gap","f":"しゅくだいを　して（　）、テレビを　[見|み]ます。","o":["より","ので","から","まで"],"a":2,"en":"I watch TV after doing my homework.","explain":"て-form + から = after doing. ので follows the plain form (するので), not して."},
      {"m":"gap","f":"ここで　しゃしんを　とって（　）いけません。","o":["が","に","を","は"],"a":3,"en":"You must not take photos here.","explain":"〜てはいけません = must not."},
      {"m":"gap","f":"わたしは　えいがを　[見|み]（　）[行|い]きます。","o":["を","で","に","へ"],"a":2,"en":"I am going to see a movie.","explain":"Going somewhere to do something: verb stem + に行く."},
      {"m":"gap","f":"きのうは　さむかった（　）、きょうは　あたたかいです。","o":["ので","が","まで","から"],"a":1,"en":"Yesterday was cold, but today is warm.","explain":"The two halves contrast, so が \"but\"; から / ので would make the cold the reason for the warmth."},
      {"m":"order","s":"s:own:n5-order-mise-pan","star":2,"o":[3,1,2,0]},
      {"m":"order","s":"s:own:n5-order-hirugohan","star":1,"o":[0,3,1,2]},
      {"m":"order","s":"s:own:n5-order-mado","star":2,"o":[0,1,2,3]},
      {"m":"order","s":"s:own:n5-order-matte-imasu","star":0,"o":[1,0,3,2]},
      {"m":"bunshou","item":"m:n5-bunshou-yama","blank":1,"o":[2,3,0,1]},
      {"m":"bunshou","item":"m:n5-bunshou-yama","blank":2,"o":[3,2,1,0]},
      {"m":"bunshou","item":"m:n5-bunshou-yama","blank":3,"o":[1,2,0,3]},
      {"m":"bunshou","item":"m:n5-bunshou-yama","blank":4,"o":[2,0,3,1]},
      {"m":"reading","p":"p:n5-library-closed","q":0,"o":[3,1,2,0]},
      {"m":"reading","p":"p:n5-bakery","q":0,"o":[0,3,1,2]},
      {"m":"reading","p":"p:n5-letter-from-tokyo","q":0,"o":[0,1,2,3]},
      {"m":"reading","p":"p:n5-letter-from-tokyo","q":1,"o":[1,0,3,2]},
      {"m":"reading","p":"p:n5-train-times","q":0,"o":[2,3,0,1]}
      ],
     listening: [
      {"m":"listening","l":"l:n5-party-drinks"},
      {"m":"listening","l":"l:n5-homework-pages"},
      {"m":"listening","l":"l:n5-first-after-school"},
      {"m":"listening","l":"l:n5-sunday-plans"},
      {"m":"listening","l":"l:n5-doctor-advice"},
      {"m":"listening","l":"l:n5-dinner-shopping"},
      {"m":"listening","l":"l:n5-where-box"},
      {"m":"listening","l":"l:n5-birthday"},
      {"m":"listening","l":"l:n5-how-many-plates"},
      {"m":"listening","l":"l:n5-how-to-school"},
      {"m":"listening","l":"l:n5-sister-in-photo"},
      {"m":"listening","l":"l:n5-sunday-where"},
      {"m":"listening","l":"l:n5-why-no-party"},
      {"m":"listening","l":"l:n5-say-again"},
      {"m":"listening","l":"l:n5-no-smoking"},
      {"m":"listening","l":"l:n5-invite-movie"},
      {"m":"listening","l":"l:n5-ask-time"},
      {"m":"listening","l":"l:n5-give-sweets"},
      {"m":"listening","l":"l:n5-lunch-together"},
      {"m":"listening","l":"l:n5-may-i-sit"},
      {"m":"listening","l":"l:n5-what-time-now"},
      {"m":"listening","l":"l:n5-where-toilet"},
      {"m":"listening","l":"l:n5-coffee-or-tea"},
      {"m":"listening","l":"l:n5-saturday"}
      ]
    },
    uses: ["g:wo","g:to","g:kara","g:deshou","g:mo","g:te-kara","g:te-wa-ikemasen","g:ni-iku","g:ga","g:te-kudasai","g:mashou","g:masen-ka","v:テレビ|テレビ","v:コーヒー|コーヒー","v:電気|でんき","v:友達|ともだち","v:山|やま","v:行く|いく","v:高い|たかい","v:雨|あめ","v:見る|みる","v:パン|パン","k:電","k:気","k:行","k:友","k:日","k:山","k:高","k:雨","k:見"],
    sources: ['own'], verified: false },
  { id: "x:n5-mock-2", kind: 'mock', level: 'N5', format: "full", title: "N5 mock exam 2",
    sections: {
     vocab: [
      {"m":"kanjiYomi","s":"s:tatoeba:8584105","w":"v:お母さん|おかあさん","o":["おかあざん","おばあさん","おかさん","おかあさん"],"a":3},
      {"m":"kanjiYomi","s":"s:tatoeba:174404","w":"v:午後|ごご","o":["ごこ","こご","ごご","ごうご"],"a":2},
      {"m":"kanjiYomi","s":"s:tatoeba:10954021","w":"v:先生|せんせい","o":["せいせん","せんせい","ぜんせい","せんせ"],"a":1},
      {"m":"kanjiYomi","s":"s:tatoeba:1050433","w":"v:今|いま","o":["いつ","こん","けさ","いま"],"a":3},
      {"m":"kanjiYomi","s":"s:tatoeba:11571575","w":"v:外|そと","o":["そと","なか","そば","がい"],"a":0},
      {"m":"kanjiYomi","s":"s:tatoeba:8576106","w":"v:車|くるま","o":["くるま","しゃ","くま","ぐるま"],"a":0},
      {"m":"kanjiYomi","s":"s:tatoeba:10961076","w":"v:毎日|まいにち","o":["まいひ","まいにち","まいじつ","めいにち"],"a":1},
      {"m":"hyouki","s":"s:own:n5-kara","w":"v:雨|あめ","o":["西","円","雨","両"],"a":2},
      {"m":"hyouki","s":"s:tatoeba:143718","w":"v:水|みず","o":["木","永","氷","水"],"a":3},
      {"m":"hyouki","s":"s:tatoeba:189031","w":"v:話す|はなす","o":["語す","読す","話す","詰す"],"a":2},
      {"m":"hyouki","s":"s:tatoeba:201948","w":"v:テレビ|テレビ","o":["テレピ","テレビ","チレビ","デレビ"],"a":1},
      {"m":"hyouki","s":"s:tatoeba:2078734","w":"v:人|ひと","o":["大","入","八","人"],"a":3},
      {"m":"bunmyaku","f":"きのうの　よるは　つかれて　いましたから、はやく（　）。","o":["ねました","あそびました","おきました","はたらきました"],"a":0,"en":"Last night I was tired, so I went to bed early.","explain":"Being tired is a reason to go to bed (ねる); getting up, working or playing early doesn't follow from it."},
      {"m":"bunmyaku","f":"ちちは　まいあさ　しんぶんを（　）います。","o":["よんで","きいて","のんで","すって"],"a":0,"en":"My father reads the newspaper every morning.","explain":"A newspaper is read: よむ. きく (listen), のむ (drink) and すう (smoke) don't go with しんぶん."},
      {"m":"bunmyaku","f":"この　[川|かわ]は　とても（　）ですから、およがないで　ください。","o":["あかるい","あぶない","しずか","たのしい"],"a":1,"en":"This river is very dangerous, so please don't swim in it.","explain":"Only danger (あぶない) is a reason not to swim; bright, fun or quiet are not."},
      {"m":"bunmyaku","f":"すみません、きってを　[五|ご]（　）ください。","o":["ほん","だい","まい","さつ"],"a":2,"en":"Excuse me, five stamps, please.","explain":"Flat things like stamps are counted with まい. さつ is for books, ほん for long things, だい for machines."},
      {"m":"bunmyaku","f":"へやが　（　）ですから、そうじを　しましょう。","o":["あかるい","しずか","きれい","きたない"],"a":3,"en":"The room is dirty, so let's clean it.","explain":"You clean because the room is dirty (きたない); a clean, quiet or bright room needs no cleaning."},
      {"m":"bunmyaku","f":"この　ズボンは　ながいですから、もう　すこし（　）ズボンを　ください。","o":["ふとい","ほそい","みじかい","ひくい"],"a":2,"en":"These trousers are long, so please give me slightly shorter ones.","explain":"The problem is length, so the other pair must be shorter: みじかい, the opposite of ながい."},
      {"m":"iikae","item":"m:n5-iikae-takakunai","o":[2,0,3,1]},
      {"m":"iikae","item":"m:n5-iikae-naratte","o":[3,1,2,0]},
      {"m":"iikae","item":"m:n5-iikae-kesa","o":[0,3,1,2]}
      ],
     grammar: [
      {"m":"gap","f":"えきまで　バス（　）[行|い]きます。","o":["で","を","に","と"],"a":0,"en":"I go to the station by bus.","explain":"The means of transport takes で: バスで."},
      {"m":"gap","f":"わたしの　へやは　あねの　へや（　）ひろいです。","o":["まで","より","だけ","から"],"a":1,"en":"My room is bigger than my older sister's room.","explain":"Comparing two things: A は B より + adjective."},
      {"m":"gap","f":"この　くすりは　[一|いち][日|にち]に　[三|さん]かい　のんで（　）。","o":["たい","です","ください","ましょう"],"a":2,"en":"Please take this medicine three times a day.","explain":"て-form + ください makes a request. たい and ましょう join the ます-stem (のみたい, のみましょう), and です can't follow a verb's て-form."},
      {"m":"gap","f":"もう　[九|く][時|じ]ですから、はやく　ねた（　）が　いいですよ。","o":["とき","あと","まえ","ほう"],"a":3,"en":"It's already nine, so you had better go to bed early.","explain":"Advice: た-form + ほうがいい."},
      {"m":"gap","f":"わたしは　まだ　ひるごはんを　[食|た]べて（　）。","o":["ください","から","いません","まで"],"a":2,"en":"I haven't had lunch yet.","explain":"まだ + 〜ていません = not yet."},
      {"m":"gap","f":"あの　みせの　パンは　とても　おいしかった（　）。","o":["ます","です","ません","でした"],"a":1,"en":"The bread at that shop was very good.","explain":"The past of an い-adjective is おいしかったです; でした is never added to an い-adjective."},
      {"m":"gap","f":"わたしは　およぐ（　）が　すきです。","o":["で","を","に","の"],"a":3,"en":"I like swimming.","explain":"Dictionary form + のがすき: の turns the verb into \"swimming\"."},
      {"m":"gap","f":"[山川|やまかわ]さんは　いま　でんわを　かけて（　）。","o":["います","ました","たい","ない"],"a":0,"en":"Mr. Yamakawa is making a phone call now.","explain":"いま + て-form + いる: an action going on now."},
      {"m":"gap","f":"きのう　デパートで　くつ（　）かばんを　かいました。","o":["や","を","が","で"],"a":0,"en":"Yesterday I bought shoes, a bag and so on at the department store.","explain":"Listing things: AやB."},
      {"m":"order","s":"s:own:n5-order-akai-kasa","star":1,"o":[1,0,3,2]},
      {"m":"order","s":"s:own:n5-order-boushi","star":2,"o":[2,3,0,1]},
      {"m":"order","s":"s:own:n5-order-umi","star":2,"o":[3,2,1,0]},
      {"m":"order","s":"s:own:n5-order-karita-hon","star":0,"o":[1,2,0,3]},
      {"m":"bunshou","item":"m:n5-bunshou-tanjoubi","blank":1,"o":[2,0,3,1]},
      {"m":"bunshou","item":"m:n5-bunshou-tanjoubi","blank":2,"o":[3,1,2,0]},
      {"m":"bunshou","item":"m:n5-bunshou-tanjoubi","blank":3,"o":[0,3,1,2]},
      {"m":"bunshou","item":"m:n5-bunshou-tanjoubi","blank":4,"o":[0,1,2,3]},
      {"m":"reading","p":"p:n5-email-absent","q":0,"o":[1,0,3,2]},
      {"m":"reading","p":"p:n5-new-classmate","q":0,"o":[2,3,0,1]},
      {"m":"reading","p":"p:n5-curry-party","q":0,"o":[3,2,1,0]},
      {"m":"reading","p":"p:n5-curry-party","q":1,"o":[1,2,0,3]},
      {"m":"reading","p":"p:n5-cafe-prices","q":0,"o":[2,0,3,1]}
      ],
     listening: [
      {"m":"listening","l":"l:n5-which-bus"},
      {"m":"listening","l":"l:n5-where-to-meet"},
      {"m":"listening","l":"l:n5-hotel-floor"},
      {"m":"listening","l":"l:n5-restaurant-order"},
      {"m":"listening","l":"l:n5-which-shirt"},
      {"m":"listening","l":"l:n5-teacher-present"},
      {"m":"listening","l":"l:n5-walk-to-hospital"},
      {"m":"listening","l":"l:n5-why-late"},
      {"m":"listening","l":"l:n5-where-key"},
      {"m":"listening","l":"l:n5-library-closed"},
      {"m":"listening","l":"l:n5-movie-time"},
      {"m":"listening","l":"l:n5-camera-price"},
      {"m":"listening","l":"l:n5-which-car"},
      {"m":"listening","l":"l:n5-ask-the-way"},
      {"m":"listening","l":"l:n5-dog-photo"},
      {"m":"listening","l":"l:n5-ask-photo"},
      {"m":"listening","l":"l:n5-ask-water"},
      {"m":"listening","l":"l:n5-turn-off-tv"},
      {"m":"listening","l":"l:n5-been-to-kyoto"},
      {"m":"listening","l":"l:n5-weather-tomorrow"},
      {"m":"listening","l":"l:n5-how-many-family"},
      {"m":"listening","l":"l:n5-how-was-test"},
      {"m":"listening","l":"l:n5-lunch-yet"},
      {"m":"listening","l":"l:n5-which-notebook"}
      ]
    },
    uses: ["g:de","g:te-kudasai","g:hou-ga-ii","g:mada-te-imasen","g:adj-i","g:no-ga-suki","g:te-iru","g:ya","v:バス|バス","v:行く|いく","v:一|いち","v:日|にち","v:三|さん","v:九|く","v:時|じ","v:食べる|たべる","v:パン|パン","v:デパート|デパート","v:川|かわ","v:五|ご","v:ズボン|ズボン","k:川","k:五","k:行","k:一","k:日","k:三","k:九","k:時","k:食","k:山"], names: ["山川|やまかわ"],
    sources: ['own'], verified: false },
  { id: "x:n5-mock-3", kind: 'mock', level: 'N5', format: "diagnostic", title: "N5 diagnostic test",
    sections: {
     vocab: [
      {"m":"kanjiYomi","s":"s:own:n5-ne","w":"v:天気|てんき","o":["てんけ","でんき","てんぎ","てんき"],"a":3},
      {"m":"kanjiYomi","s":"s:own:n5-no-ga-heta-ryouri","w":"v:父|ちち","o":["ちち","あに","はは","あね"],"a":0},
      {"m":"kanjiYomi","s":"s:tatoeba:9231680","w":"v:電話|でんわ","o":["でんわ","でんき","てんわ","でんか"],"a":0},
      {"m":"kanjiYomi","s":"s:tatoeba:2143385","w":"v:大きい|おおきい","o":["おきい","おおきい","おおぎい","だいきい"],"a":1},
      {"m":"hyouki","s":"s:own:n5-naka-de-ichiban-kudamono","w":"v:中|なか","o":["虫","央","中","申"],"a":2},
      {"m":"hyouki","s":"s:tatoeba:114844","w":"v:本|ほん","o":["休","末","木","本"],"a":3},
      {"m":"hyouki","s":"s:tatoeba:172298","w":"v:時|じ","o":["持","待","時","特"],"a":2},
      {"m":"bunmyaku","f":"きのうは　[雨|あめ]でしたから、かさを（　）[出|で]かけました。","o":["はいて","さして","きて","かぶって"],"a":1,"en":"It rained yesterday, so I went out with my umbrella up.","explain":"An umbrella is held up: かさをさす. かぶる is for hats, はく for shoes and trousers, きる for clothes."},
      {"m":"bunmyaku","f":"わたしは　コーヒーが（　）ですから、のみません。","o":["げんき","すき","じょうず","きらい"],"a":3,"en":"I don't like coffee, so I don't drink it.","explain":"Not drinking it follows from disliking it (きらい); すき would be a reason to drink it."},
      {"m":"bunmyaku","f":"さむいですから、セーターを（　）ください。","o":["きて","しめて","はいて","かぶって"],"a":0,"en":"It's cold, so please put on a sweater.","explain":"Clothes for the top half are put on with きる; はく is for shoes and trousers, かぶる for hats."},
      {"m":"iikae","item":"m:n5-iikae-shokudou","o":[0,1,2,3]},
      {"m":"iikae","item":"m:n5-iikae-heta","o":[1,0,3,2]}
      ],
     grammar: [
      {"m":"gap","f":"まいにち　[七|しち][時|じ]（　）おきます。","o":["が","で","に","を"],"a":2,"en":"I get up at seven every day.","explain":"A clock time takes に."},
      {"m":"gap","f":"この　[本|ほん]は　わたし（　）です。","o":["を","に","が","の"],"a":3,"en":"This book is mine.","explain":"わたしの = mine."},
      {"m":"gap","f":"[山川|やまかわ]さん、あした　いっしょに　えいがを　[見|み]（　）か。","o":["ました","に","ません","て"],"a":2,"en":"Mr. Yamakawa, would you like to see a movie together tomorrow?","explain":"An invitation: 〜ませんか. ましたか is past, but the plan is for tomorrow; に and て can't end the sentence before か."},
      {"m":"gap","f":"きょうしつで　たばこを　すわないで（　）。","o":["ます","ください","たい","ません"],"a":1,"en":"Please don't smoke in the classroom.","explain":"ない-form + でください = please don't."},
      {"m":"gap","f":"この　へやは　しずか（　）、きれいです。","o":["く","に","な","で"],"a":3,"en":"This room is quiet and clean.","explain":"A な-adjective joins the next one with で."},
      {"m":"order","s":"s:own:n5-order-kaban-yori","star":2,"o":[0,3,1,2]},
      {"m":"order","s":"s:own:n5-order-asobi-ni","star":0,"o":[0,1,2,3]},
      {"m":"bunshou","item":"m:n5-bunshou-kouen","blank":1,"o":[1,0,3,2]},
      {"m":"bunshou","item":"m:n5-bunshou-kouen","blank":2,"o":[2,3,0,1]},
      {"m":"bunshou","item":"m:n5-bunshou-kouen","blank":3,"o":[3,2,1,0]},
      {"m":"reading","p":"p:n5-sunday-diary","q":0,"o":[1,2,0,3]},
      {"m":"reading","p":"p:n5-lost-umbrella","q":0,"o":[2,0,3,1]},
      {"m":"reading","p":"p:n5-lost-umbrella","q":1,"o":[3,1,2,0]},
      {"m":"reading","p":"p:n5-class-party-flyer","q":0,"o":[0,3,1,2]}
      ],
     listening: [
      {"m":"listening","l":"l:n5-clean-room-first"},
      {"m":"listening","l":"l:n5-before-the-train"},
      {"m":"listening","l":"l:n5-test-classroom"},
      {"m":"listening","l":"l:n5-study-hours"},
      {"m":"listening","l":"l:n5-when-sea"},
      {"m":"listening","l":"l:n5-how-many-tickets"},
      {"m":"listening","l":"l:n5-show-me-bag"},
      {"m":"listening","l":"l:n5-buy-hat"},
      {"m":"listening","l":"l:n5-how-long-japan"},
      {"m":"listening","l":"l:n5-favorite-drink"},
      {"m":"listening","l":"l:n5-close-door"}
      ]
    },
    uses: ["g:ni","g:no","g:masen-ka","g:nai-de-kudasai","g:adj-na","v:七|しち","v:時|じ","v:本|ほん","v:見る|みる","v:雨|あめ","v:出かける|でかける","v:コーヒー|コーヒー","v:セーター|セーター","k:雨","k:出","k:七","k:時","k:本","k:山","k:川","k:見"], names: ["山川|やまかわ"],
    sources: ['own'], verified: false }
]);
