"use strict";


// ============================================================
// Phase 26 — N2 Test Prep (days 1276–1320)
// ============================================================

curriculum.push({
  day: 1276,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1276 / 7),
  title: "N2 Test Overview and Exam Strategy",
  intro: "Phase 26 prepares you for the actual JLPT N2 exam. Today we review the test format, timing, section weights, and overall strategy.",
  type: "reading",
  vocab: [
    ["試験時間", "しけんじかん", "exam duration"],
    ["配点", "はいてん", "point allocation, scoring"],
    ["合否", "ごうひ", "pass or fail"],
    ["得点", "とくてん", "score, points earned"],
    ["合格点", "ごうかくてん", "passing score"]
  ],
  chars: [],
  grammar: { pattern: "〜に備える", meaning: "to prepare for, to get ready for", example_jp: "N2試験に備えて、各セクションの配点を把握しよう。", example_en: "Let us understand the point allocation for each section in preparation for the N2 exam." },
  practice: "Create a study schedule for the remaining Phase 26 days, allocating time to your weakest sections.",
  tip: "JLPT N2 format: Language Knowledge (vocab+grammar) 105 min; Reading 105 min (same sitting); Listening 50 min. Total score 180 points (60 each). Passing requires 90/180 overall AND minimum scores in each section.",
  passage: {
    text_jp: "JLPT N2は、言語知識（文字・語彙・文法）と読解が合計105分、聴解が50分で実施される。合格点は総合180点中90点以上で、各セクションに基準点が設けられている。語彙・文法・読解・聴解のすべてで基準を超えることが必要だ。",
    text_en: "JLPT N2 consists of Language Knowledge (characters, vocabulary, grammar) and Reading for a combined 105 minutes, and Listening for 50 minutes. The passing score is 90 or more out of a total of 180 points, with minimum scores set for each section. It is necessary to exceed the standard in all areas: vocabulary, grammar, reading, and listening.",
    questions: [
      { question_jp: "N2の合格に必要な条件は何ですか。", question_en: "What conditions are required to pass N2?", answer: "総合90点以上、各セクションで基準点を超えること" }
    ]
  }
});

curriculum.push({
  day: 1277,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1277 / 7),
  title: "Vocabulary Section Strategy",
  intro: "Today we focus on the vocabulary section of JLPT N2 — question types, elimination strategies, and common traps.",
  type: "vocab",
  vocab: [
    ["同義語", "どうぎご", "synonym"],
    ["類義語", "るいぎご", "similar-meaning word"],
    ["文脈", "ぶんみゃく", "context"],
    ["言い換え", "いいかえ", "paraphrase, rewording"],
    ["誤答", "ごとう", "wrong answer"]
  ],
  chars: [],
  grammar: { pattern: "〜に相当する", meaning: "to correspond to, to be equivalent to", example_jp: "その語彙は試験のN2レベルに相当する。", example_en: "That vocabulary corresponds to the N2 level of the exam." },
  practice: "Practice 10 N2 vocabulary questions using context elimination: choose by meaning in context, not by memorized definitions alone.",
  tip: "N2 vocab questions test four skills: (1) reading kanji correctly, (2) choosing the right word for context, (3) identifying paraphrases, and (4) knowing word usage (collocation). Context elimination eliminates 2 wrong answers quickly."
});

curriculum.push({
  day: 1278,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1278 / 7),
  title: "Grammar Cloze: Choosing the Right Pattern",
  intro: "Today we practice the grammar cloze section — choosing the correct grammar pattern to complete a sentence, the most common N2 grammar question type.",
  type: "grammar",
  vocab: [
    ["空欄", "くうらん", "blank space (in a test)"],
    ["前後関係", "ぜんごかんけい", "relationship between before and after (context)"],
    ["接続", "せつぞく", "connection, attachment"],
    ["除外", "じょがい", "exclusion, elimination"],
    ["選択", "せんたく", "selection, choice"]
  ],
  chars: [],
  grammar: { pattern: "文の流れから判断する", meaning: "judge from the flow of the sentence", example_jp: "空欄の前後関係から文法を判断することが正解への近道だ。", example_en: "Judging grammar from the context before and after the blank is the shortcut to the correct answer." },
  practice: "Complete five grammar cloze questions. For each, write why each wrong answer fails — either wrong attachment form, wrong meaning, or wrong particle requirement.",
  tip: "Grammar cloze elimination method: (1) check what word class the blank must attach to — does the grammar pattern allow it? (2) check the sentence's logical direction — concession? reason? emphasis? (3) eliminate then confirm."
});

curriculum.push({
  day: 1279,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1279 / 7),
  title: "Sentence Ordering: Paragraph Reconstruction",
  intro: "Today we practice the sentence ordering question type — arranging four sentences into a logical paragraph. This is one of the hardest N2 grammar question types.",
  type: "grammar",
  vocab: [
    ["段落", "だんらく", "paragraph"],
    ["順序", "じゅんじょ", "order, sequence"],
    ["接続詞", "せつぞくし", "conjunction, connective"],
    ["指示語", "しじご", "demonstrative/reference word (それ、この、etc.)"],
    ["論理", "ろんり", "logic, reasoning"]
  ],
  chars: [],
  grammar: { pattern: "接続詞と指示語を手がかりにする", meaning: "use conjunctions and demonstratives as clues", example_jp: "「しかし」「そのため」「このように」などの接続詞を手がかりにして順序を決める。", example_en: "Determine the order using conjunctions like 'however', 'therefore', 'in this way' as clues." },
  practice: "Reconstruct three scrambled paragraphs using conjunctions (しかし、そのため、一方) and demonstratives (その、この、それ) as anchors.",
  tip: "Sentence ordering strategy: first find the opener (usually no demonstrative, introduces a new topic) and closer (often a conclusion: したがって、このように). Then chain the middle by demonstratives — それ must follow the noun it refers to."
});

curriculum.push({
  day: 1280,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1280 / 7),
  title: "Reading: Short Passage Comprehension",
  intro: "Today we practice reading short passages (150–300 characters) and answering comprehension questions — the first reading section type in N2.",
  type: "reading",
  vocab: [
    ["筆者", "ひっしゃ", "author, writer (of the passage)"],
    ["主張", "しゅちょう", "claim, argument, assertion"],
    ["要旨", "ようし", "gist, main point"],
    ["具体例", "ぐたいれい", "concrete example"],
    ["結論", "けつろん", "conclusion"]
  ],
  chars: [],
  grammar: { pattern: "筆者の主張を読み取る", meaning: "to read and identify the author's argument", example_jp: "筆者の主張を正確に読み取ることが短文読解の核心だ。", example_en: "Accurately identifying the author's argument is the core of short passage comprehension." },
  practice: "Read the passage below and answer the question in Japanese. Focus on the author's main claim, not peripheral details.",
  tip: "Short passage questions usually ask: (1) What is the author's main point? (2) What does a specific word/phrase refer to? (3) Which statement matches the passage? Answer (1) and (3) by finding the topic sentence; answer (2) by looking at the surrounding lines.",
  passage: {
    text_jp: "現代社会では、情報の量が爆発的に増加している。しかし、情報が多いからといって、それが知識につながるわけではない。大切なのは、情報を批判的に評価し、自分の考えを形成する力だ。情報リテラシーは、現代人に不可欠なスキルといえる。",
    text_en: "In modern society, the amount of information is increasing explosively. However, just because there is a lot of information does not mean it leads to knowledge. What is important is the ability to critically evaluate information and form one's own thinking. Information literacy can be said to be an indispensable skill for people today.",
    questions: [
      { question_jp: "筆者が最も伝えたいことは何ですか。", question_en: "What does the author most want to convey?", answer: "情報を批判的に評価し、自分の考えを形成する力（情報リテラシー）が重要だということ" }
    ]
  }
});

curriculum.push({
  day: 1281,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1281 / 7),
  title: "Reading: Medium Passage Comprehension",
  intro: "Today we practice medium-length passages (400–600 characters) — the core of the N2 reading section, requiring both local and global comprehension.",
  type: "reading",
  vocab: [
    ["論点", "ろんてん", "point of argument, issue"],
    ["逆説", "ぎゃくせつ", "paradox"],
    ["転換点", "てんかんてん", "turning point"],
    ["事例", "じれい", "case, example"],
    ["根拠", "こんきょ", "grounds, basis, evidence"]
  ],
  chars: [],
  grammar: { pattern: "〜に対して", meaning: "in contrast to ~, in response to ~", example_jp: "前の段落の主張に対して、筆者は新たな根拠を示している。", example_en: "In contrast to the previous paragraph's claim, the author presents new grounds." },
  practice: "Read the passage below. Answer: (1) What is the author's main argument? (2) What evidence is provided? (3) What does the underlined phrase refer to?",
  tip: "For medium passages: read the first and last sentence of each paragraph first to map the argument structure. Then read carefully for evidence. JLPT questions follow the passage order — question 1 relates to the opening, question 3 to the conclusion.",
  passage: {
    text_jp: "言語は単なるコミュニケーションの道具ではなく、思考の枠組みそのものを形成すると言われている。異なる言語を学ぶことで、世界の見方が広がり、新たな概念に触れることができる。例えば、日本語には「木漏れ日」という言葉があるが、これに対応する英語の一語は存在しない。言語の違いは文化の違いを映し出すとともに、私たちの認識の仕方にも影響を与える。多言語話者が問題解決において柔軟な思考を示すという研究結果も、この考えを裏付けている。",
    text_en: "Language is said not to be merely a tool for communication but to form the very framework of thought. By learning different languages, one's view of the world expands and one can encounter new concepts. For example, Japanese has the word 'komorebi' (sunlight filtering through leaves), but no single equivalent word exists in English. Differences in language reflect differences in culture and also influence the way we perceive things. Research results showing that multilingual speakers demonstrate flexible thinking in problem-solving also support this view.",
    questions: [
      { question_jp: "筆者の主な主張は何ですか。", question_en: "What is the author's main argument?", answer: "言語は思考の枠組みを形成し、世界の見方や認識の仕方に影響を与える" },
      { question_jp: "「木漏れ日」の例は何を示すために使われていますか。", question_en: "What is the example of 'komorebi' used to show?", answer: "言語の違いが文化の違いを反映しているということ" }
    ]
  }
});

curriculum.push({
  day: 1282,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1282 / 7),
  title: "Reading: Long Passage Comprehension",
  intro: "Today we practice long passages (700–900 characters) — the most challenging reading format in N2, requiring sustained comprehension of complex argumentation.",
  type: "reading",
  vocab: [
    ["論旨", "ろんし", "gist of an argument, thesis"],
    ["展開", "てんかい", "development, unfolding"],
    ["対比", "たいひ", "contrast, comparison"],
    ["裏付け", "うらづけ", "backing, corroboration"],
    ["含意", "がんい", "implication, connotation"]
  ],
  chars: [],
  grammar: { pattern: "〜が示唆するように", meaning: "as ~ suggests, as implied by ~", example_jp: "研究結果が示唆するように、言語習得は年齢だけでなく環境にも依存する。", example_en: "As the research results suggest, language acquisition depends not only on age but also on environment." },
  practice: "Read the passage below and answer all three questions in Japanese. Time yourself — aim for under 12 minutes for a passage this length.",
  tip: "Long passage strategy: (1) read the title and first paragraph to identify the topic, (2) skim each paragraph's first sentence to map the structure, (3) locate where in the passage each question's answer likely appears before reading in detail.",
  passage: {
    text_jp: "グローバル化が急速に進む現代において、多文化共生という理念が注目されている。多文化共生とは、異なる文化的背景を持つ人々が、互いの違いを認め尊重しながら共に生きることを意味する。しかし、この理念を実現することは容易ではない。\n文化的な違いは、価値観、コミュニケーションスタイル、日常の習慣など、生活のあらゆる場面に現れる。こうした違いが誤解や摩擦を生むこともある。特に言語の壁は大きく、意思疎通の困難さが心理的な距離を生みやすい。\nにもかかわらず、多くの地域で多文化共生の成功事例が報告されている。共通点を見つける努力と、違いを豊かさと捉える姿勢が、共生を可能にすると専門家は指摘する。言語学習や文化交流プログラムが、その橋渡し役として機能することも多い。\n多文化共生は、単なる共存にとどまらず、互いの文化から学び合い、新たな価値を共に創造するプロセスでもある。異文化理解を深めることは、個人の成長にとっても社会の発展にとっても不可欠な営みといえよう。",
    text_en: "In the modern era of rapid globalization, the ideal of multicultural coexistence is attracting attention. Multicultural coexistence means people of different cultural backgrounds living together while recognizing and respecting each other's differences. However, realizing this ideal is not easy.\nCultural differences appear in every aspect of life — values, communication styles, daily customs. Such differences can also give rise to misunderstandings and friction. The language barrier in particular is significant, and difficulties in communication tend to create psychological distance.\nNevertheless, many regions report successful cases of multicultural coexistence. Experts point out that the effort to find common ground and the attitude of seeing differences as richness make coexistence possible. Language learning and cultural exchange programs often function as bridges.\nMulticultural coexistence goes beyond mere coexistence — it is also a process of learning from each other's cultures and co-creating new values together. Deepening cross-cultural understanding is an indispensable endeavor both for individual growth and for the development of society.",
    questions: [
      { question_jp: "多文化共生を難しくする要因として、筆者が挙げているものは何ですか。", question_en: "What factors making multicultural coexistence difficult does the author mention?", answer: "価値観・コミュニケーションスタイル・習慣の違い、特に言語の壁" },
      { question_jp: "多文化共生を成功させるために必要な姿勢はどのようなものですか。", question_en: "What attitude is necessary to make multicultural coexistence succeed?", answer: "共通点を見つける努力と、違いを豊かさと捉える姿勢" },
      { question_jp: "筆者にとって多文化共生とは何ですか。", question_en: "What is multicultural coexistence according to the author?", answer: "単なる共存にとどまらず、互いの文化から学び合い、新たな価値を共に創造するプロセス" }
    ]
  }
});

curriculum.push({
  day: 1283,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1283 / 7),
  title: "Reading: Comparative Passage Questions",
  intro: "Today we practice comparative reading — two short passages expressing contrasting viewpoints, a common N2 reading format.",
  type: "reading",
  vocab: [
    ["一方", "いっぽう", "on the other hand; one side"],
    ["相違点", "そういてん", "point of difference, discrepancy"],
    ["共通点", "きょうつうてん", "common point, similarity"],
    ["立場", "たちば", "standpoint, position"],
    ["比較", "ひかく", "comparison"]
  ],
  chars: [],
  grammar: { pattern: "〜と〜を比較すると", meaning: "when comparing ~ and ~", example_jp: "AとBを比較すると、立場の違いが明確になる。", example_en: "When comparing A and B, the difference in standpoint becomes clear." },
  practice: "Read both passages below and answer: (1) What do both authors agree on? (2) What is the key difference in their positions?",
  tip: "For comparative passages: first identify each author's main claim in one sentence, then list agreements and disagreements. Questions almost always ask about the difference between positions, not about one passage alone.",
  passage: {
    text_jp: "【文章A】リモートワークは、通勤時間の削減や柔軟な働き方を可能にし、生産性向上に貢献すると多くの研究が示している。特に集中を要する作業では、オフィスより自宅の方が効率が高い場合も多い。\n【文章B】リモートワークには利点がある一方で、チームの結束力や自発的なアイデア交換が失われるリスクがある。対面でのコミュニケーションがもたらす創造的なコラボレーションは、オンラインでは再現しにくい。",
    text_en: "Passage A: Many studies show that remote work enables reduction of commuting time and flexible working styles, contributing to improved productivity. Particularly for work requiring concentration, home environments are often more efficient than offices.\nPassage B: While remote work has advantages, there is a risk of losing team cohesion and spontaneous idea exchange. Creative collaboration brought about by face-to-face communication is difficult to reproduce online.",
    questions: [
      { question_jp: "二つの文章が共通して認めていることは何ですか。", question_en: "What do both passages commonly acknowledge?", answer: "リモートワークに利点があること" },
      { question_jp: "二つの文章の立場の違いは何ですか。", question_en: "What is the difference in the positions of the two passages?", answer: "文章Aは生産性向上に注目し肯定的。文章Bはチームワークやコラボレーションの損失を懸念している" }
    ]
  }
});

curriculum.push({
  day: 1284,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1284 / 7),
  title: "Reading: Information Retrieval",
  intro: "Today we practice information retrieval questions — scanning ads, notices, charts, or schedules for specific data. This tests practical reading, not literary comprehension.",
  type: "reading",
  vocab: [
    ["案内", "あんない", "guidance, information notice"],
    ["規定", "きてい", "regulation, stipulation"],
    ["締め切り", "しめきり", "deadline"],
    ["対象", "たいしょう", "target, subject"],
    ["申込", "もうしこみ", "application, registration"]
  ],
  chars: [],
  grammar: { pattern: "〜に該当する", meaning: "to apply to ~, to fall under ~", example_jp: "この規定に該当する場合は申込が必要です。", example_en: "If this regulation applies to you, an application is required." },
  practice: "Read the notice below and answer the specific factual questions. Practice scanning, not full reading.",
  tip: "Information retrieval questions reward scanning, not careful reading. Identify the key word in the question (Who? When? How much? Which?), then scan the passage for that specific information only. Do not read the whole text linearly.",
  passage: {
    text_jp: "【日本語能力試験N2受験案内】\n受験料：5,500円（税込）\n申込期間：8月1日〜8月31日\n試験日：12月第1日曜日\n受験資格：年齢・国籍不問\n申込方法：公式ウェブサイトより必要事項を入力の上、受験料を支払うこと。申込後の変更・返金は原則不可。",
    text_en: "JLPT N2 Examination Guide\nExamination fee: ¥5,500 (tax included)\nApplication period: August 1–August 31\nTest date: First Sunday of December\nEligibility: No age or nationality restrictions\nHow to apply: Enter required information on the official website and pay the exam fee. Changes or refunds after application are generally not accepted.",
    questions: [
      { question_jp: "試験はいつ行われますか。", question_en: "When is the exam held?", answer: "12月第1日曜日" },
      { question_jp: "申込後に変更はできますか。", question_en: "Can changes be made after applying?", answer: "原則不可（できない）" }
    ]
  }
});

curriculum.push({
  day: 1285,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1285 / 7),
  title: "Mock Grammar Section I: Sentence Completion",
  intro: "Today we work through a full mock N2 grammar section — sentence completion questions testing the grammar patterns from Phases 22–24.",
  type: "grammar",
  vocab: [
    ["解答", "かいとう", "answer, response"],
    ["設問", "せつもん", "question, problem (in an exam)"],
    ["選択肢", "せんたくし", "answer choice, option"],
    ["正答率", "せいとうりつ", "correct answer rate"],
    ["難易度", "なんいど", "difficulty level"]
  ],
  chars: [],
  grammar: { pattern: "Mock N2 sentence completion", meaning: "Full grammar section practice with N2 patterns", example_jp: "彼の発言______、会議の雰囲気が一変した。(A: をきっかけに / B: にあたって / C: をもとに / D: において)", example_en: "The atmosphere of the meeting changed completely ______ his remark. (A: triggered by / B: upon the occasion of / C: based on / D: in/at)" },
  practice: "Complete the following five grammar completion questions, then explain why the correct answer is right and each wrong answer is wrong:\n1. 彼女は努力______、夢を実現した。(A: のかわりに / B: の末に / C: にあたって / D: もかまわず)\n2. 申請書は______、提出してください。(A: 記入した上で / B: 記入したものの / C: 記入するにつれ / D: 記入したとたん)\n3. 環境問題は、個人______、社会全体で取り組むべきだ。(A: はおろか / B: のみならず / C: に限らず / D: だけでなく)\n4. その計画は______、実行された。(A: 反対されながらも / B: 反対されたのに / C: 反対されたから / D: 反対されたとして)\n5. リーダーたる______、責任を持って行動せよ。(A: ものの / B: 以上は / C: からこそ / D: にもかかわらず)",
  tip: "For grammar completion: the correct answer must (1) attach to the given word form correctly, (2) match the logical direction of the sentence (reason? concession? condition?), and (3) not be contradicted by any other part of the sentence."
});

curriculum.push({
  day: 1286,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1286 / 7),
  title: "Mock Grammar Section II: Sentence Ordering",
  intro: "Today we practice mock N2 sentence ordering questions — arguably the trickiest grammar question type, requiring logical reconstruction of scrambled sentences.",
  type: "grammar",
  vocab: [
    ["並べ替え", "ならべかえ", "rearranging, putting in order"],
    ["手がかり", "てがかり", "clue, hint, lead"],
    ["流れ", "ながれ", "flow (of text/argument)"],
    ["冒頭", "ぼうとう", "beginning, opening"],
    ["末尾", "まつび", "end, tail"]
  ],
  chars: [],
  grammar: { pattern: "Sentence ordering: conjunction + demonstrative anchoring", meaning: "Use conjunctions and reference words to reconstruct sentence order", example_jp: "★に入る文として最も適切なものを選んでください。（そのため・しかし・このように・それに加えて）", example_en: "Select the most appropriate sentence to fill ★." },
  practice: "Reconstruct the following scrambled sentences into the correct order:\n1. [彼は] ★ [を得た] [努力によって] [成功]\n2. [この問題は] [だからこそ] ★ [解決が求められる] [複雑であり]\n3. [環境保護に] [ためには] ★ [取り組む] [全員が協力する]\nFor each, identify the conjunction or demonstrative that anchors the ordering.",
  tip: "Sentence ordering shortcut: find the ★ position first — what must come immediately before ★? What must come immediately after? The ★ sentence often contains a demonstrative (その, この, それ) that refers back to the previous sentence."
});

curriculum.push({
  day: 1287,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1287 / 7),
  title: "Kanji Reading Drills: N2 Compound Words",
  intro: "Today we drill N2 kanji readings at speed — the vocabulary section of JLPT N2 includes kanji reading questions where you identify the correct reading of underlined words.",
  type: "kanji",
  chars: [
    ["裁", "さい"],
    ["債", "さい"],
    ["滝", "たき"],
    ["嵐", "あらし"],
    ["鑑", "かん"]
  ],
  vocab: [
    ["裁判所", "さいばんしょ", "courthouse"],
    ["負債", "ふさい", "debt, liability"],
    ["那智の滝", "なちのたき", "Nachi Falls"],
    ["嵐のような", "あらしのような", "like a storm"],
    ["鑑定書", "かんていしょ", "appraisal certificate"]
  ],
  grammar: { pattern: "〜の読み方を答えなさい", meaning: "Give the reading of ~ (kanji reading question format)", example_jp: "下線部の読み方を答えなさい：「裁判所での証言が重視された。」", example_en: "Give the reading of the underlined portion: 'The testimony at the courthouse was given great weight.'" },
  practice: "Read aloud and write the reading for each underlined word: 金融機関、収穫期、循環型、廃棄物、概念図、弦楽団、憲法条文、峡谷沿い、醸造所、謙虚な態度。",
  tip: "For kanji reading questions, four answer choices often include 'trap' readings that look similar. Common traps: 融 (ゆう not じゅう), 債 (さい not たい), 崖 (がい/がけ — know both readings). On'yomi is more common in N2 compounds."
});

curriculum.push({
  day: 1288,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1288 / 7),
  title: "Kanji Writing Recognition: N2 Level",
  intro: "Today we drill kanji writing recognition — identifying which kanji matches a hiragana reading in context. This tests whether you can distinguish similar-looking kanji.",
  type: "kanji",
  chars: [
    ["融", "ゆう"],
    ["憂", "ゆう"],
    ["優", "ゆう"],
    ["裁", "さい"],
    ["採", "さい"]
  ],
  vocab: [
    ["金融", "きんゆう", "finance"],
    ["憂鬱", "ゆううつ", "melancholy"],
    ["優秀", "ゆうしゅう", "excellence, superiority"],
    ["裁判", "さいばん", "trial"],
    ["採用", "さいよう", "hiring, adoption"]
  ],
  grammar: { pattern: "文脈から正しい漢字を選ぶ", meaning: "choose the correct kanji based on context", example_jp: "「彼は（　）秀な学生として知られている。」ゆう→優", example_en: "He is known as an ex(　)llent student. ゆう → 優 (excellent)" },
  practice: "Choose the correct kanji for each blank: 1.（ゆう）力な企業 2. 心が（ゆう）鬱だ 3. 人材を（さい）用する 4. （さい）判を受ける 5. 金（ゆう）機関",
  tip: "Homophones trap: 融・憂・優・雄 all read ゆう. 裁・採・際・才 all read さい. Use meaning + radical to distinguish: 融 (melt/metal), 憂 (sad/heart), 優 (excellent/person), 裁 (judge/knife), 採 (pick/hand)."
});

curriculum.push({
  day: 1289,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1289 / 7),
  title: "Listening Strategy: N2 Audio Section",
  intro: "Today we study strategies for the N2 listening section — question types, note-taking techniques, and common pitfalls.",
  type: "vocab",
  vocab: [
    ["聴解", "ちょうかい", "listening comprehension"],
    ["会話", "かいわ", "conversation, dialogue"],
    ["要点", "ようてん", "main point, key point"],
    ["メモ", "めも", "memo, notes"],
    ["推測", "すいそく", "inference, guessing"]
  ],
  chars: [],
  grammar: { pattern: "〜から判断すると", meaning: "judging from ~, based on ~", example_jp: "会話の流れから判断すると、二人は上司と部下の関係だ。", example_en: "Judging from the flow of the conversation, the two have a boss-subordinate relationship." },
  practice: "For each of the following N2 listening question types, write one strategy: (1) task-based listening (何をしますか), (2) key-point listening (ポイント理解), (3) overview listening (概要理解), (4) immediate response (即時応答).",
  tip: "N2 listening tips: (1) Read the question before the audio plays — you get 20 seconds. (2) For task questions, listen for the final decision, not intermediate proposals. (3) For 即時応答, answer before your inner voice second-guesses — first instinct is usually right. (4) Keep short notes with a keyword or number."
});

curriculum.push({
  day: 1290,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1290 / 7),
  title: "Listening Practice: Dialogues and Monologues",
  intro: "Today we practice with N2-style listening dialogues. Use TTS (text-to-speech) to listen to the scripts below — set playback to a natural speed.",
  type: "reading",
  vocab: [
    ["確認する", "かくにんする", "to confirm, to verify"],
    ["了解する", "りょうかいする", "to understand, to acknowledge"],
    ["依頼する", "いらいする", "to request, to commission"],
    ["断る", "ことわる", "to decline, to refuse"],
    ["提案する", "ていあんする", "to propose, to suggest"]
  ],
  chars: [],
  grammar: { pattern: "〜ていただけますか", meaning: "could you please ~ (polite request)", example_jp: "資料を送っていただけますか。", example_en: "Could you please send the materials?" },
  practice: "Use TTS to listen to the dialogue below twice. First time: get the gist. Second time: answer the questions.",
  tip: "When using TTS for listening practice, set the Japanese voice to 0.85–0.9x speed for natural N2 pace. Focus on verbs and sentence-final forms — they carry the key information (what is happening, decided, or requested).",
  passage: {
    text_jp: "【会話】\n田中：山田さん、来週の会議の資料、もう準備できましたか。\n山田：あ、すみません。まだ半分しかできていないんですが、明日中には仕上げます。\n田中：そうですか。実は、木曜日から金曜日に変更になりまして。\n山田：え、そうなんですか。では、木曜日の朝までに送ればいいですか。\n田中：はい、水曜日の夕方までにいただければ、確認する時間が取れます。\n山田：わかりました。水曜日の夕方までに必ず送ります。",
    text_en: "Dialogue:\nTanaka: Yamada-san, are the materials for next week's meeting ready yet?\nYamada: Ah, I'm sorry. I've only finished half, but I'll complete them by tomorrow.\nTanaka: I see. Actually, the meeting has been changed from Thursday to Friday.\nYamada: Oh, is that so? Then should I send them by Friday morning?\nTanaka: Yes, if I could have them by Wednesday evening, I'll have time to check them.\nYamada: Understood. I will definitely send them by Wednesday evening.",
    questions: [
      { question_jp: "山田さんはいつまでに資料を送る必要がありますか。", question_en: "By when does Yamada need to send the materials?", answer: "水曜日の夕方まで" },
      { question_jp: "会議はいつに変更されましたか。", question_en: "When was the meeting changed to?", answer: "金曜日" }
    ]
  }
});

curriculum.push({
  day: 1291,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1291 / 7),
  title: "Mock Vocabulary Section: Word Meaning and Usage",
  intro: "Today we work through a full mock N2 vocabulary section — word meaning, contextual usage, paraphrase, and word formation questions.",
  type: "vocab",
  vocab: [
    ["把握", "はあく", "grasp, understanding"],
    ["克服", "こくふく", "overcoming, conquest"],
    ["促進", "そくしん", "promotion, acceleration"],
    ["妥協", "だきょう", "compromise"],
    ["貢献", "こうけん", "contribution, service"]
  ],
  chars: [],
  grammar: { pattern: "〜に貢献する", meaning: "to contribute to ~", example_jp: "科学技術の発展に貢献するために研究を続ける。", example_en: "I continue my research in order to contribute to the development of science and technology." },
  practice: "For each word, choose the correct definition and use it in a sentence:\n1. 把握する (A: 強く握る B: 理解する C: 計画する D: 解決する)\n2. 克服する (A: 勝つ B: 困難に打ち勝つ C: 批判する D: 無視する)\n3. 妥協する (A: 意見を言う B: 折り合いをつける C: 諦める D: 賛成する)\n4. 促進する (A: 速くする B: 推薦する C: 進める D: 妨げる)\n5. 貢献する (A: 役立てる B: 寄付する C: 感謝する D: 比較する)",
  tip: "N2 vocabulary paraphrase questions: the correct paraphrase uses different words but the same meaning. Wrong answers often use words that sound related or share a kanji. Test: can you substitute the answer into the original sentence without changing the meaning?"
});

curriculum.push({
  day: 1292,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1292 / 7),
  title: "Error Analysis: Common N2 Mistakes",
  intro: "Today we analyze the most common errors N2 candidates make and learn how to avoid them.",
  type: "grammar",
  vocab: [
    ["誤用", "ごよう", "misuse, incorrect usage"],
    ["混同", "こんどう", "confusion, mixing up"],
    ["格助詞", "かくじょし", "case particle (が、を、に、etc.)"],
    ["接続", "せつぞく", "connection, attachment form"],
    ["紛らわしい", "まぎらわしい", "confusing, easily mistaken"]
  ],
  chars: [],
  grammar: { pattern: "〜と〜の違い", meaning: "the difference between ~ and ~", example_jp: "「にもかかわらず」と「ながらも」の違いを正確に把握することが誤用を防ぐ。", example_en: "Accurately understanding the difference between にもかかわらず and ながらも prevents misuse." },
  practice: "Identify the error in each sentence and correct it:\n1. 試験に合格するにあたって、頑張ってください。\n2. 彼は病気であるにもかかわらず、元気そうだ。（この文は正しいか？）\n3. 努力したにはわけだ、成功した。\n4. 先生の話を聞くながら、メモを取った。\n5. 彼女こそ、リーダーにほかならない。（この文は正しいか？）",
  tip: "Top N2 grammar errors: (1) wrong attachment form (Vた+末に vs Vる+にあたって), (2) confusing にもかかわらず (despite, formal) with ながらも (despite, softer), (3) using にほかならない with the wrong predicate type."
});

curriculum.push({
  day: 1293,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1293 / 7),
  title: "Mixed Review: Vocabulary, Grammar, and Kanji",
  intro: "Today is an integrated mixed review session combining vocabulary, grammar, and kanji in the format of an actual N2 exam section.",
  type: "grammar",
  vocab: [
    ["統合", "とうごう", "integration, unification"],
    ["横断", "おうだん", "crossing, cutting across"],
    ["実践", "じっせん", "practice, implementation"],
    ["応用", "おうよう", "application, practical use"],
    ["総仕上げ", "そうしあげ", "final finishing, overall review"]
  ],
  chars: [],
  grammar: { pattern: "語彙・文法・漢字の総合練習", meaning: "Integrated vocabulary, grammar, and kanji practice", example_jp: "N2試験は語彙・文法・漢字・読解・聴解のすべてを統合した能力を問う。", example_en: "The N2 exam tests integrated ability across vocabulary, grammar, kanji, reading, and listening." },
  practice: "Complete a 20-question mixed quiz (5 vocab, 5 grammar, 5 kanji reading, 5 kanji writing) within 20 minutes. Mark your score and identify your weakest category.",
  tip: "Mixed review reveals which section costs you the most time. If kanji reading takes too long, you risk running out of time in the reading section. Allocate practice time proportionally to your weakest areas going into the exam."
});

curriculum.push({
  day: 1294,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1294 / 7),
  title: "Full Mock Test I: Language Knowledge Section",
  intro: "Today we simulate the full N2 Language Knowledge section under timed conditions. This section covers vocabulary, grammar, and reading in 105 minutes.",
  type: "grammar",
  vocab: [
    ["模擬試験", "もぎしけん", "mock exam, practice test"],
    ["時間配分", "じかんはいぶん", "time allocation"],
    ["見直し", "みなおし", "review, re-checking"],
    ["マークシート", "まーくしーと", "bubble sheet, OMR sheet"],
    ["回答欄", "かいとうらん", "answer column/box"]
  ],
  chars: [],
  grammar: { pattern: "〜を想定して", meaning: "assuming ~, simulating ~", example_jp: "本番を想定して模擬試験に取り組むことが実力向上につながる。", example_en: "Working on mock exams while simulating the real thing leads to improvement in actual ability." },
  practice: "Set a 35-minute timer and complete a grammar + vocabulary practice section (15 questions each). No dictionaries. Mark answers, then review all errors.",
  tip: "Exam time management for Language Knowledge: vocabulary questions (about 25 questions) should take 20–25 minutes. Grammar questions (about 13 questions) should take 15–20 minutes. Reading passages take the most time — save at least 55 minutes."
});

curriculum.push({
  day: 1295,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1295 / 7),
  title: "Full Mock Test II: Reading Section",
  intro: "Today we simulate the N2 reading section — four passage types under realistic time pressure.",
  type: "reading",
  vocab: [
    ["精読", "せいどく", "careful reading, close reading"],
    ["速読", "そくどく", "speed reading"],
    ["スキャン", "すきゃん", "scanning (for information)"],
    ["スキム", "すきむ", "skimming (for gist)"],
    ["読解力", "どっかいりょく", "reading comprehension ability"]
  ],
  chars: [],
  grammar: { pattern: "〜に基づいて判断する", meaning: "to judge based on ~", example_jp: "本文の内容に基づいて正解を判断してください。", example_en: "Please judge the correct answer based on the content of the passage." },
  practice: "Complete a timed reading session: one short passage (5 min), one medium passage (10 min), one long passage (15 min), one information retrieval task (5 min). Total: 35 minutes.",
  tip: "N2 reading section time budget: short passages ~3 min each (×4 = 12 min), medium passages ~8 min each (×2 = 16 min), long passage ~14 min, comparative passage ~10 min, information retrieval ~5 min. Total ≈ 57 min — leaving 8 min buffer.",
  passage: {
    text_jp: "人間は本来、社会的な生き物である。他者との関わりを通じて、私たちは成長し、アイデンティティを形成する。しかし現代社会では、デジタル技術の発達により、表面的なつながりが増える一方で、深い人間関係が失われつつあるとも言われる。本当の意味での「つながり」とは何かを、改めて問い直す必要があるかもしれない。",
    text_en: "Human beings are inherently social creatures. Through engagement with others, we grow and form our identities. However, it is also said that in modern society, while superficial connections increase with the development of digital technology, deep human relationships are being lost. It may be necessary to ask anew what 'connection' truly means.",
    questions: [
      { question_jp: "筆者が問い直すべきだと考えていることは何ですか。", question_en: "What does the author think needs to be reconsidered?", answer: "本当の意味での「つながり」とは何か" }
    ]
  }
});

curriculum.push({
  day: 1296,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1296 / 7),
  title: "Weak Point Targeting I: Grammar Deep Dive",
  intro: "Today we revisit the most commonly failed N2 grammar patterns — the ones that appear most frequently on the actual exam and are most frequently answered incorrectly.",
  type: "grammar",
  vocab: [
    ["弱点", "じゃくてん", "weak point, weakness"],
    ["集中", "しゅうちゅう", "concentration, focus"],
    ["強化", "きょうか", "strengthening, reinforcement"],
    ["定着", "ていちゃく", "settling in, taking root, establishing"],
    ["反復", "はんぷく", "repetition"]
  ],
  chars: [],
  grammar: { pattern: "High-frequency N2 grammar: ～ないことには / ～を余儀なくされる / ～に即して", meaning: "Unless ~ / to be forced to ~ / in accordance with ~", example_jp: "規則に即して行動しないことには、信頼を得ることはできない。", example_en: "Unless one acts in accordance with the rules, one cannot gain trust." },
  practice: "Write three sentences each for: ないことには, を余儀なくされる, and に即して. Then confirm the attachment form for each pattern.",
  tip: "The three hardest N2 grammar patterns for non-natives: (1) ～ないことには (requires negative plain form), (2) ～を余儀なくされる (passive of forced action — always passive voice), (3) ～に即して (formal pattern meaning 'in accordance with' — do not confuse with に沿って)."
});

curriculum.push({
  day: 1297,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1297 / 7),
  title: "Weak Point Targeting II: Vocabulary Deep Dive",
  intro: "Today we focus on the N2 vocabulary categories with the highest exam frequency and the most confusable near-synonyms.",
  type: "vocab",
  vocab: [
    ["促す", "うながす", "to urge, to prompt, to encourage"],
    ["妨げる", "さまたげる", "to hinder, to obstruct, to interfere"],
    ["備える", "そなえる", "to prepare for, to be equipped with"],
    ["生じる", "しょうじる", "to arise, to occur, to be produced"],
    ["及ぼす", "およぼす", "to exert (influence), to bring about"]
  ],
  chars: [],
  grammar: { pattern: "〜に影響を及ぼす", meaning: "to exert influence on ~, to affect ~", example_jp: "気候変動は農業生産に深刻な影響を及ぼしている。", example_en: "Climate change is exerting a serious influence on agricultural production." },
  practice: "Fill in the blank with the correct verb (促す / 妨げる / 備える / 生じる / 及ぼす):\n1. 台風に（　）ために準備を進めた。\n2. その政策は経済成長を（　）可能性がある。\n3. 新たな問題が（　）た場合は、すぐに報告すること。\n4. 教師は生徒の学習意欲を（　）必要がある。\n5. 喫煙は健康に悪影響を（　）。",
  tip: "Confusable near-synonyms for N2: 促す (urge/prompt) vs 勧める (recommend) — 促す implies urgency; 妨げる (hinder) vs 阻む (block) — 阻む is stronger/more physical; 生じる (arise) vs 起こる (occur) — 生じる is more formal/written."
});

curriculum.push({
  day: 1298,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1298 / 7),
  title: "Timed Reading Sprint: N2 Passage Speed",
  intro: "Today we push reading speed — practicing extracting key information from N2 passages faster than exam pace.",
  type: "reading",
  vocab: [
    ["速度", "そくど", "speed, velocity"],
    ["効率", "こうりつ", "efficiency"],
    ["省略", "しょうりゃく", "omission, abbreviation"],
    ["核心", "かくしん", "core, crux, heart of the matter"],
    ["余裕", "よゆう", "leeway, surplus, composure"]
  ],
  chars: [],
  grammar: { pattern: "〜に的を絞る", meaning: "to focus on ~, to narrow down to ~", example_jp: "設問の核心に的を絞って読むと、余裕が生まれる。", example_en: "When you focus your reading on the crux of the question, you gain extra time." },
  practice: "Read the passage below in under 4 minutes and answer the question without re-reading. This trains you to extract key information in a single focused pass.",
  tip: "Speed reading technique for N2: read the question before the passage. Then skim for the answer to that specific question rather than reading all text equally. The wrong approach is reading everything carefully then finding the question — reverse it.",
  passage: {
    text_jp: "科学技術の急速な発展は、私たちの生活に多大な恩恵をもたらしている。医療の進歩により平均寿命は延び、情報技術の普及により世界中の人々がつながるようになった。しかし一方で、技術の発展が新たな格差を生んでいるという指摘もある。デジタルデバイドと呼ばれる情報格差は、技術を使いこなせる者とそうでない者の間に経済的・社会的な差をもたらしている。技術の恩恵が広く公平に行き渡るような仕組みを社会全体で作ることが求められている。",
    text_en: "The rapid development of science and technology has brought great benefits to our lives. Medical advances have extended average lifespans, and the spread of information technology has connected people around the world. However, it has also been pointed out that technological development is generating new disparities. The information gap known as the 'digital divide' is creating economic and social differences between those who can use technology and those who cannot. Society as a whole is called upon to create mechanisms ensuring that the benefits of technology reach everyone broadly and fairly.",
    questions: [
      { question_jp: "筆者が問題提起していることは何ですか。", question_en: "What issue is the author raising?", answer: "技術の発展が新たな格差（デジタルデバイド）を生んでいること" }
    ]
  }
});

curriculum.push({
  day: 1299,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1299 / 7),
  title: "Keigo and Formal Language Review",
  intro: "Today we review N2-level keigo (polite language) and formal written Japanese — essential for the reading section and for real-world use.",
  type: "grammar",
  vocab: [
    ["尊敬語", "そんけいご", "respectful language (honorific)"],
    ["謙譲語", "けんじょうご", "humble language"],
    ["丁寧語", "ていねいご", "polite language"],
    ["二重敬語", "にじゅうけいご", "double honorific (incorrect usage)"],
    ["敬称", "けいしょう", "honorific title"]
  ],
  chars: [],
  grammar: { pattern: "〜ていただく / 〜てくださる", meaning: "receive the favor of ~ (humble) / give the favor of ~ (respectful)", example_jp: "ご確認いただけますでしょうか。（謙譲語）/ ご確認くださいますでしょうか。（尊敬語）", example_en: "Would you be so kind as to confirm? (humble) / Would you please confirm? (respectful)" },
  practice: "Convert each sentence from plain/polite form to appropriate keigo:\n1. 来てください → (respectful) ?\n2. 送ります → (humble) ?\n3. 食べましたか → (respectful) ?\n4. 私が案内します → (humble) ?\n5. 部長が言いました → (respectful) ?",
  tip: "N2 keigo essentials: いただく (humble — I receive) vs くださる (respectful — you/they give). Common double-keigo error to avoid: ×おっしゃられました (says + passive honorific — double), ○おっしゃいました. N2 reading passages use formal keigo extensively."
});

curriculum.push({
  day: 1300,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1300 / 7),
  title: "Day 1300 Milestone: N2 Integration Review",
  intro: "Day 1300 — a major milestone. Today we review the full N2 curriculum: vocabulary (Phase 22), verbs and expressions (Phase 23), grammar (Phase 24), and kanji (Phase 25).",
  type: "grammar",
  vocab: [
    ["節目", "ふしめ", "milestone, turning point"],
    ["総括", "そうかつ", "summary, overall review"],
    ["振り返り", "ふりかえり", "reflection, looking back"],
    ["達成感", "たっせいかん", "sense of achievement"],
    ["継続", "けいぞく", "continuation, persistence"]
  ],
  chars: [],
  grammar: { pattern: "〜を経て", meaning: "after going through ~, having passed through ~", example_jp: "300日以上の学習を経て、N2の全範囲を網羅した。", example_en: "Having gone through over 300 days of study, we have covered the full N2 range." },
  practice: "Write a 200-character self-assessment of your N2 learning journey, identifying your three strongest and three weakest areas.",
  tip: "At Day 1300, you have covered: N5 (days 1–365), N4 (days 366–690), N3 (days 691–960), N3 Review + N2 Vocabulary (days 961–1090), N2 Verbs (days 1091–1140), N2 Grammar (days 1141–1230), N2 Kanji (days 1231–1275). That is remarkable progress."
});

curriculum.push({
  day: 1301,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1301 / 7),
  title: "Reading: Academic Text Comprehension",
  intro: "Today we practice reading academic texts — the hardest reading format in N2, using specialized vocabulary and complex argument structures.",
  type: "reading",
  vocab: [
    ["考察", "こうさつ", "consideration, examination, reflection"],
    ["論拠", "ろんきょ", "grounds for argument, rationale"],
    ["仮定", "かてい", "assumption, hypothesis, supposition"],
    ["検討", "けんとう", "examination, consideration, review"],
    ["帰結", "きけつ", "conclusion, result, consequence"]
  ],
  chars: [],
  grammar: { pattern: "〜に照らして", meaning: "in light of ~, in reference to ~", example_jp: "事実に照らして、その仮定が正しいかどうかを検討する。", example_en: "In light of the facts, we examine whether that assumption is correct." },
  practice: "Read the passage below and answer in Japanese. Focus on how the author builds the argument step by step.",
  tip: "Academic text structure: introduction (問題提起) → background (背景説明) → claim (主張) → evidence (根拠・事例) → conclusion (まとめ). Identifying this structure before answering questions saves significant time.",
  passage: {
    text_jp: "近年、人工知能（AI）の発展は目覚ましく、様々な分野でその応用が進んでいる。しかし、AIに関する倫理的問題もまた浮上しており、慎重な対応が求められている。特に問題となるのは、AIによる意思決定の透明性である。医療診断や司法判断など、人の人生に深く関わる領域でAIが活用される場合、その判断根拠が明確でなければ、社会的な信頼を得ることはできない。AIの発展と倫理の両立は、現代社会が解決すべき重要な課題である。",
    text_en: "In recent years, the development of artificial intelligence (AI) has been remarkable, with its application advancing in various fields. However, ethical issues related to AI are also emerging, requiring careful responses. Particularly problematic is the transparency of AI decision-making. When AI is used in areas that deeply affect people's lives, such as medical diagnosis and judicial decisions, social trust cannot be obtained unless the basis for its judgments is clear. The coexistence of AI advancement and ethics is an important challenge that modern society must resolve.",
    questions: [
      { question_jp: "筆者がAIに関して特に問題だと述べていることは何ですか。", question_en: "What does the author state is particularly problematic about AI?", answer: "AIによる意思決定の透明性（判断根拠が不明確なこと）" }
    ]
  }
});

curriculum.push({
  day: 1302,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1302 / 7),
  title: "N2 Writing: Formal Essay Structure",
  intro: "The JLPT does not test writing, but composing N2-level essays is the best way to consolidate grammar patterns, vocabulary, and kanji simultaneously. Today we study formal essay structure.",
  type: "grammar",
  vocab: [
    ["序論", "じょろん", "introduction (essay)"],
    ["本論", "ほんろん", "body (essay)"],
    ["結論", "けつろん", "conclusion (essay)"],
    ["段落構成", "だんらくこうせい", "paragraph structure"],
    ["論拠", "ろんきょ", "grounds, rationale"]
  ],
  chars: [],
  grammar: { pattern: "〜と言わざるを得ない", meaning: "one cannot help but say ~, one must say ~", example_jp: "現在の教育制度には改善の余地があると言わざるを得ない。", example_en: "One must say that there is room for improvement in the current education system." },
  practice: "Write a 250-character formal essay on one of the following topics, using at least six N2 grammar patterns: (1) 環境問題への対応 (2) テクノロジーと人間関係 (3) 生涯学習の重要性",
  tip: "N2 essay structure: (序論) introduce the topic and your position — 1 paragraph; (本論) present 2 reasons with evidence — 2 paragraphs; (結論) restate your position and summarize — 1 paragraph. Aim for consistency: use the same polite register (です・ます or だ・である) throughout."
});

curriculum.push({
  day: 1303,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1303 / 7),
  title: "Listening Practice: Monologue and Announcement",
  intro: "Today we practice N2 listening with monologue and announcement formats — longer audio than dialogues, requiring sustained attention.",
  type: "reading",
  vocab: [
    ["アナウンス", "あなうんす", "announcement"],
    ["独話", "どくわ", "monologue, one-person speech"],
    ["要点把握", "ようてんはあく", "grasping the key points"],
    ["聞き取り", "ききとり", "listening comprehension"],
    ["再生", "さいせい", "playback, reproduction"]
  ],
  chars: [],
  grammar: { pattern: "〜についてご案内します", meaning: "we would like to inform you about ~ (announcement opener)", example_jp: "本日のセミナーの日程変更についてご案内します。", example_en: "We would like to inform you about a schedule change for today's seminar." },
  practice: "Use TTS to listen to the announcement below three times: first for gist, second for specific facts, third to confirm answers.",
  tip: "Announcement listening: the key information always appears at the start and end. The middle contains explanatory detail. For '何をしますか' questions, focus on the final decision stated, not the deliberation process.",
  passage: {
    text_jp: "【アナウンス】\n皆様にご案内申し上げます。本日予定しておりました市民講座「やさしい日本語」は、講師の体調不良により、来週月曜日の同じ時刻に延期となりました。受講予定の方は、改めてご来場くださいますようお願い申し上げます。なお、すでにお申し込みいただいた方については、手続きの変更は不要です。ご不便をおかけして、誠に申し訳ございません。",
    text_en: "Announcement to all attendees: The civic lecture 'Easy Japanese' scheduled for today has been postponed to the same time next Monday due to the lecturer's illness. We ask those planning to attend to please visit us again at that time. Please note that no change in procedure is required for those who have already registered. We sincerely apologize for the inconvenience.",
    questions: [
      { question_jp: "講座はいつに変更されましたか。", question_en: "When was the lecture rescheduled to?", answer: "来週月曜日の同じ時刻" },
      { question_jp: "申し込み済みの人は何をする必要がありますか。", question_en: "What do those who have already registered need to do?", answer: "何もしなくてよい（手続きの変更は不要）" }
    ]
  }
});

curriculum.push({
  day: 1304,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1304 / 7),
  title: "N2 Grammar: Expression Review by Function",
  intro: "Today we review all N2 grammar expressions organized by communicative function — this is the most effective final review method.",
  type: "grammar",
  vocab: [
    ["機能別", "きのうべつ", "organized by function"],
    ["文末表現", "ぶんまつひょうげん", "sentence-final expression"],
    ["接続表現", "せつぞくひょうげん", "connective expression"],
    ["強調表現", "きょうちょうひょうげん", "emphatic expression"],
    ["条件表現", "じょうけんひょうげん", "conditional expression"]
  ],
  chars: [],
  grammar: { pattern: "機能別文法総復習", meaning: "Function-based grammar final review", example_jp: "強調：にほかならない・からこそ。逆接：ながらも・にもかかわらず。添加：ばかりか・もさることながら。否定：わけがない・とは限らない。条件：ないことには・からには。", example_en: "Emphasis: nothing other than / precisely because. Concession: even though / despite. Addition: not only / goes without saying. Negation: no way / not necessarily. Condition: unless / now that." },
  practice: "Create your own quick-reference table: list the 20 N2 grammar patterns you find most difficult, with one example sentence each.",
  tip: "Final grammar review priority: focus on patterns that appear most frequently in JLPT past papers. Based on analysis: ～ないことには, ～を余儀なくされる, ～からこそ, ～にほかならない, ～ながらも, ～に即して are among the highest frequency N2 grammar points."
});

curriculum.push({
  day: 1305,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1305 / 7),
  title: "Vocabulary Consolidation: N2 Word Families",
  intro: "Today we study N2 vocabulary by word family — learning kanji stems that generate multiple words simultaneously.",
  type: "vocab",
  vocab: [
    ["促進", "そくしん", "promotion, facilitation"],
    ["促す", "うながす", "to urge, to prompt"],
    ["催促", "さいそく", "urging, pressing, dunning"],
    ["推進", "すいしん", "promotion, driving forward"],
    ["推測", "すいそく", "inference, conjecture"]
  ],
  chars: [],
  grammar: { pattern: "語族学習（word family learning）", meaning: "learning multiple words sharing a common kanji stem", example_jp: "「促」の字族：促進・促す・催促。「推」の字族：推進・推測・推薦・推論。", example_en: "The 促 word family: promotion / to urge / pressing. The 推 word family: promotion / inference / recommendation / reasoning." },
  practice: "Build word families for these stems: 解 (かい), 判 (はん), 制 (せい), 認 (にん). List at least three compound words for each.",
  tip: "Word family learning multiplies your vocabulary acquisition speed. Learning 解 gives you: 解決 (solve), 解釈 (interpret), 解放 (liberate), 理解 (understand), 和解 (reconcile), 分解 (decompose), 解散 (dissolve). One kanji stem, seven words."
});

curriculum.push({
  day: 1306,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1306 / 7),
  title: "Mock Test III: Full Integrated Practice",
  intro: "Today we simulate a complete N2 section under strict timed conditions — vocabulary, grammar cloze, sentence ordering, and reading, all in sequence.",
  type: "grammar",
  vocab: [
    ["本番", "ほんばん", "real thing, actual performance/exam"],
    ["集中力", "しゅうちゅうりょく", "concentration, focus"],
    ["焦らず", "あせらず", "without rushing, calmly"],
    ["ケアレスミス", "けあれすみす", "careless mistake"],
    ["見直し", "みなおし", "review, double-check"]
  ],
  chars: [],
  grammar: { pattern: "〜を心がける", meaning: "to keep in mind ~, to be conscious of ~", example_jp: "試験中は焦らず、一問一問丁寧に解くことを心がけよう。", example_en: "During the exam, let us be conscious of solving each question carefully without rushing." },
  practice: "Set a 50-minute timer. Complete: 10 vocabulary questions (10 min), 10 grammar questions (15 min), 2 reading passages with questions (25 min). No dictionaries. Review all errors afterward.",
  tip: "Careless mistake reduction: (1) always reread the question after choosing an answer, (2) for grammar questions, check the attachment form after choosing the content, (3) for reading questions, verify your answer is stated in the passage — not just logically implied."
});

curriculum.push({
  day: 1307,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1307 / 7),
  title: "Reading: Science and Society Passage",
  intro: "Today we practice reading a science-and-society passage — a very common topic in N2 reading sections, mixing factual content with the author's opinion.",
  type: "reading",
  vocab: [
    ["持続可能", "じぞくかのう", "sustainable"],
    ["革新", "かくしん", "innovation, reform"],
    ["普及", "ふきゅう", "spread, diffusion, popularization"],
    ["課題", "かだい", "challenge, task, issue"],
    ["対策", "たいさく", "countermeasure, measure"]
  ],
  chars: [],
  grammar: { pattern: "〜に取り組む", meaning: "to tackle ~, to work on ~", example_jp: "社会全体で持続可能な開発の課題に取り組む必要がある。", example_en: "It is necessary for all of society to tackle the challenges of sustainable development." },
  practice: "Read the passage below. Identify: (1) the main problem discussed, (2) the solution proposed, (3) the author's stance.",
  tip: "Science-and-society passages often follow this structure: (1) describe a positive development (e.g., new technology), (2) introduce a problem or complication, (3) propose a solution or call to action. Identify the 'however' (しかし/一方で) moment — it marks the transition to the problem.",
  passage: {
    text_jp: "再生可能エネルギーの普及が世界的に進む中、日本でも太陽光発電や風力発電への投資が拡大している。しかし、再生可能エネルギーには安定供給という課題がある。天候に左右されるため、電力需要のピーク時に対応できない場合がある。この問題を解決するために、蓄電技術の革新と電力網の整備が急務とされている。持続可能なエネルギー社会の実現には、技術の発展と社会インフラの整備が両輪となって進む必要がある。",
    text_en: "As the spread of renewable energy advances globally, investment in solar and wind power is expanding in Japan as well. However, renewable energy faces the challenge of stable supply. Because it is influenced by weather, it may not be able to meet demand during peak electricity consumption periods. To solve this problem, innovation in storage technology and improvement of the power grid are considered urgent priorities. Realizing a sustainable energy society requires both technological development and social infrastructure improvement to advance as two wheels of the same vehicle.",
    questions: [
      { question_jp: "再生可能エネルギーの課題として挙げられているものは何ですか。", question_en: "What challenge of renewable energy is mentioned?", answer: "安定供給（天候に左右されるため、ピーク時に対応できない場合がある）" },
      { question_jp: "課題の解決策として挙げられているものは何ですか。", question_en: "What solutions are proposed for the challenge?", answer: "蓄電技術の革新と電力網の整備" }
    ]
  }
});

curriculum.push({
  day: 1308,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1308 / 7),
  title: "Reading: Culture and Society Passage",
  intro: "Today we practice a culture-and-society passage — another major N2 topic area, often involving Japanese traditions, lifestyle changes, or social commentary.",
  type: "reading",
  vocab: [
    ["伝統", "でんとう", "tradition"],
    ["変容", "へんよう", "transformation, change in form"],
    ["世代", "せだい", "generation"],
    ["継承", "けいしょう", "succession, passing down"],
    ["担い手", "にないて", "person who carries on, bearer"]
  ],
  chars: [],
  grammar: { pattern: "〜が失われつつある", meaning: "~ is being lost, ~ is gradually disappearing", example_jp: "地方の伝統工芸が担い手不足により失われつつある。", example_en: "Traditional crafts in rural areas are gradually being lost due to a shortage of those who carry them on." },
  practice: "Read the passage below and answer in Japanese. Identify the author's implicit recommendation.",
  tip: "Culture passages often have an implicit recommendation rather than an explicit one — the author describes a problem (traditional culture declining) and implies a solution (support, inheritance, revival) without stating it directly. Look for the concluding sentence's emotional register.",
  passage: {
    text_jp: "日本各地に伝わる伝統工芸は、その土地の歴史と人々の知恵の結晶である。しかし近年、職人の高齢化と後継者不足により、多くの技術が消滅の危機に瀕している。若者の都市集中が進む中、地方の伝統産業を守る担い手が減少しているのだ。このような状況を打開するには、伝統工芸の価値を広く社会に知らしめるとともに、後継者育成のための制度的支援が不可欠である。文化の継承は、社会全体の責任でもある。",
    text_en: "Traditional crafts passed down throughout Japan are a crystallization of local history and people's wisdom. However, in recent years, many skills are on the verge of extinction due to the aging of craftspeople and a shortage of successors. As the concentration of young people in cities advances, those who protect traditional regional industries are decreasing. To break through this situation, it is indispensable both to make the value of traditional crafts widely known in society and to provide institutional support for training successors. The inheritance of culture is also the responsibility of society as a whole.",
    questions: [
      { question_jp: "伝統工芸が危機に瀕している原因として挙げられているものは何ですか。", question_en: "What causes of the crisis facing traditional crafts are mentioned?", answer: "職人の高齢化と後継者不足、若者の都市集中" }
    ]
  }
});

curriculum.push({
  day: 1309,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1309 / 7),
  title: "Grammar Patterns: Nuanced Negation Review",
  intro: "Today we review N2 nuanced negation — the patterns that express partial negation, impossibility, unlikelihood, and unexpectedness.",
  type: "grammar",
  vocab: [
    ["否定", "ひてい", "negation, denial"],
    ["不可能", "ふかのう", "impossible"],
    ["可能性", "かのうせい", "possibility"],
    ["必然性", "ひつぜんせい", "necessity, inevitability"],
    ["例外", "れいがい", "exception"]
  ],
  chars: [],
  grammar: { pattern: "〜とは限らない / 〜わけではない / 〜わけがない / 〜はずがない", meaning: "not necessarily ~ / it's not that ~ / there's no way ~ / there's no reason ~", example_jp: "高い物が良い物とは限らない。高価だからといって効果があるわけではない。", example_en: "Expensive things are not necessarily good things. It is not that something is effective just because it is expensive." },
  practice: "Write one sentence for each: とは限らない / わけではない / わけがない / はずがない / ないとは言えない. Then explain what makes each different from the others.",
  tip: "Nuanced negation distinctions: とは限らない (not always true — counterexample exists) vs わけではない (not the case — correcting a misconception) vs わけがない (logically impossible) vs はずがない (unexpected impossibility — my expectation is violated)."
});

curriculum.push({
  day: 1310,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1310 / 7),
  title: "Grammar Patterns: Emphasis and Contrast Review",
  intro: "Today we review N2 emphasis and contrast patterns — the structures that add rhetorical force to arguments.",
  type: "grammar",
  vocab: [
    ["強調", "きょうちょう", "emphasis"],
    ["対比", "たいひ", "contrast"],
    ["逆説", "ぎゃくせつ", "paradox, counterintuitive statement"],
    ["主張", "しゅちょう", "assertion, claim"],
    ["譲歩", "じょうほ", "concession"]
  ],
  chars: [],
  grammar: { pattern: "〜にほかならない / 〜からこそ / 〜もさることながら / 〜ながらも", meaning: "is nothing but ~ / precisely because ~ / not only ~ but also / while ~, yet ~", example_jp: "努力こそが成功の鍵にほかならない。困難であるからこそ、達成感も大きい。", example_en: "Effort is nothing but the key to success. Precisely because it is difficult, the sense of achievement is also great." },
  practice: "Combine two contrasting ideas using each pattern: (1) にほかならない (2) からこそ (3) ながらも (4) もさることながら.",
  tip: "In JLPT reading, these emphasis patterns mark the author's MAIN claim — they are not peripheral. When you see にほかならない or からこそ in a passage, the sentence containing it is almost certainly the answer to a 'what is the author's main point?' question."
});

curriculum.push({
  day: 1311,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1311 / 7),
  title: "Comprehensive Mock: Vocabulary + Grammar",
  intro: "Today we work through a comprehensive mock section combining vocabulary and grammar in the actual N2 exam format and sequence.",
  type: "grammar",
  vocab: [
    ["網羅", "もうら", "comprehensive coverage, encompassing all"],
    ["精度", "せいど", "precision, accuracy"],
    ["攻略", "こうりゃく", "strategy for conquering, cracking"],
    ["本番直前", "ほんばんちょくぜん", "just before the real exam"],
    ["仕上げ", "しあげ", "finishing, final touches"]
  ],
  chars: [],
  grammar: { pattern: "〜に臨む", meaning: "to face ~, to confront ~, to take (an exam)", example_jp: "万全の準備で試験に臨むことが重要だ。", example_en: "It is important to face the exam with thorough preparation." },
  practice: "30-minute timed mock: complete 10 vocabulary, 5 grammar cloze, and 3 sentence-ordering questions. Aim for 80% accuracy. Review all errors before moving on.",
  tip: "Pre-exam final tips: (1) Sleep 8 hours the night before — no cramming. (2) Arrive 30 minutes early to settle anxiety. (3) Bring your admission ticket, photo ID, pencils (2B recommended for OMR sheets), and an eraser. (4) Answer all questions — no penalty for wrong answers."
});

curriculum.push({
  day: 1312,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1312 / 7),
  title: "Reading Marathon: Sustained Comprehension",
  intro: "Today we train sustained reading comprehension — the ability to maintain focus and comprehension over 45+ minutes of dense N2 text.",
  type: "reading",
  vocab: [
    ["持久力", "じきゅうりょく", "endurance, stamina"],
    ["集中持続", "しゅうちゅうじぞく", "sustained concentration"],
    ["読解スタミナ", "どっかいすたみな", "reading stamina"],
    ["認知疲労", "にんちひろう", "cognitive fatigue"],
    ["リフレッシュ", "りふれっしゅ", "refresh, revitalize"]
  ],
  chars: [],
  grammar: { pattern: "〜にもかかわらず集中を保つ", meaning: "to maintain concentration despite ~", example_jp: "疲労にもかかわらず集中を保つには、事前の訓練が必要だ。", example_en: "Advance training is necessary to maintain concentration despite fatigue." },
  practice: "Read two consecutive medium-length passages (approximately 500 characters each) without a break. Answer all questions. Time: 20 minutes total.",
  tip: "Reading stamina training: the N2 reading section can cause cognitive fatigue toward the end. Train by doing two or three consecutive passage readings in practice sessions. Your comprehension score on the last passage should be as high as on the first — build that endurance now.",
  passage: {
    text_jp: "コミュニケーション能力とは、単に流暢に話す力ではない。相手の話をよく聞き、意図を正確に把握し、適切に応答する力が、真のコミュニケーション能力の核心をなす。現代社会では、発信力が重視されがちだが、傾聴力こそが人間関係の質を決定すると多くの専門家は指摘する。話すことよりも聞くことに、もっと注意を払うべきかもしれない。",
    text_en: "Communication ability is not simply the ability to speak fluently. The ability to listen carefully to the other person, accurately grasp their intent, and respond appropriately forms the core of true communication ability. In modern society, the ability to transmit information tends to be emphasized, but many experts point out that listening ability determines the quality of human relationships. We may need to pay more attention to listening than to speaking.",
    questions: [
      { question_jp: "筆者によると、真のコミュニケーション能力の核心は何ですか。", question_en: "According to the author, what is the core of true communication ability?", answer: "相手の話をよく聞き、意図を正確に把握し、適切に応答する力（傾聴力）" }
    ]
  }
});

curriculum.push({
  day: 1313,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1313 / 7),
  title: "Final Vocabulary Review: High-Frequency N2 Words",
  intro: "Today we drill the highest-frequency N2 vocabulary — the words most likely to appear on the actual exam based on past paper analysis.",
  type: "vocab",
  vocab: [
    ["依然として", "いぜんとして", "still, as before, unchanged"],
    ["いわゆる", "いわゆる", "so-called, what is called"],
    ["かえって", "かえって", "on the contrary, rather, instead"],
    ["せいぜい", "せいぜい", "at most, at best"],
    ["あくまでも", "あくまでも", "to the end, stubbornly, strictly"]
  ],
  chars: [],
  grammar: { pattern: "副詞の使い方", meaning: "adverb usage in N2 formal Japanese", example_jp: "状況は依然として厳しいが、あくまでも原則を守る必要がある。", example_en: "The situation is still difficult, but it is necessary to adhere strictly to principles." },
  practice: "Use each adverb in a sentence: 依然として / いわゆる / かえって / せいぜい / あくまでも. These are frequently tested in N2 vocabulary sections.",
  tip: "N2 adverbs are frequently tested because they carry nuance that changes sentence meaning completely. かえって (contrary to expectation) is often confused with むしろ (preferably/rather). せいぜい (at most) implies a low ceiling — a pessimistic nuance absent in 最大 (maximum)."
});

curriculum.push({
  day: 1314,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1314 / 7),
  title: "Final Grammar Review: High-Frequency Patterns",
  intro: "Today we review the highest-frequency N2 grammar patterns — the ones that appear most consistently across past JLPT N2 exams.",
  type: "grammar",
  vocab: [
    ["頻出", "ひんしゅつ", "frequently appearing, high-frequency"],
    ["出題傾向", "しゅつだいけいこう", "exam question trend"],
    ["定番", "ていばん", "standard, staple, classic"],
    ["差がつく", "さがつく", "to make a difference, to separate scores"],
    ["押さえる", "おさえる", "to nail down, to cover (key points)"]
  ],
  chars: [],
  grammar: { pattern: "頻出N2文法総復習", meaning: "High-frequency N2 grammar final review", example_jp: "ないことには・を余儀なくされる・にほかならない・からこそ・ながらも・に即してを最終確認する。", example_en: "Final confirmation of: ないことには / を余儀なくされる / にほかならない / からこそ / ながらも / に即して." },
  practice: "Write two sentences for each of the six patterns above. Focus on natural, contextually appropriate usage rather than mechanical construction.",
  tip: "High-frequency N2 grammar patterns based on past paper analysis: (1) ～ないことには (unless), (2) ～を余儀なくされる (be forced to), (3) ～にほかならない (nothing but), (4) ～からこそ (precisely because), (5) ～ながらも (despite), (6) ～に即して (in accordance with). Master all six."
});

curriculum.push({
  day: 1315,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1315 / 7),
  title: "Final Kanji Review: High-Frequency N2 Kanji",
  intro: "Today we review the N2 kanji most likely to appear in the exam — both in the kanji section and embedded in vocabulary and reading passages.",
  type: "kanji",
  chars: [
    ["融", "ゆう"],
    ["裁", "さい"],
    ["循", "じゅん"],
    ["謙", "けん"],
    ["廃", "はい"]
  ],
  vocab: [
    ["金融機関", "きんゆうきかん", "financial institution"],
    ["裁判官", "さいばんかん", "judge (in court)"],
    ["循環器", "じゅんかんき", "circulatory system"],
    ["謙遜", "けんそん", "modesty, humility"],
    ["廃止", "はいし", "abolition, discontinuation"]
  ],
  grammar: { pattern: "〜の読み方を確認する", meaning: "to confirm the reading of ~", example_jp: "試験直前には重要な漢字の読み方を再確認しよう。", example_en: "Just before the exam, let us reconfirm the readings of important kanji." },
  practice: "Write the reading and meaning for each: 融資、裁量、循環、謙虚、廃棄、憲法、症状、概念、矛盾、醸造。",
  tip: "Kanji reading exam tips: (1) Scan for the radical — it usually constrains the meaning. (2) For unfamiliar compounds, try combining the meanings of individual kanji. (3) When two answer choices have the same meaning but different readings, eliminate by on'yomi vs kun'yomi rule."
});

curriculum.push({
  day: 1316,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1316 / 7),
  title: "Pre-Exam Simulation: Full Timed Mock",
  intro: "Today we run the closest simulation to the actual N2 exam — a full-length practice session combining all question types under exam conditions.",
  type: "grammar",
  vocab: [
    ["シミュレーション", "しみゅれーしょん", "simulation"],
    ["想定", "そうてい", "assumption, expectation, simulation"],
    ["徹底", "てってい", "thoroughness, completeness"],
    ["試行", "しこう", "trial, attempt"],
    ["最終調整", "さいしゅうちょうせい", "final adjustment"]
  ],
  chars: [],
  grammar: { pattern: "〜に向けて最終調整する", meaning: "to make final adjustments toward ~", example_jp: "本番に向けて最終調整として模擬試験を行う。", example_en: "We conduct a mock exam as a final adjustment toward the real exam." },
  practice: "Set a 90-minute timer. Complete: 12 vocabulary, 8 grammar cloze, 3 sentence-ordering, and 3 reading passages with questions. Mark honestly without dictionaries. Review all wrong answers.",
  tip: "After this mock test, do not study new material. Spend your remaining prep time consolidating what you know and reducing anxiety. Rest is a legitimate exam preparation strategy — cognitive performance drops measurably with poor sleep."
});

curriculum.push({
  day: 1317,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1317 / 7),
  title: "Mindset and Exam Day Preparation",
  intro: "Today we focus on exam-day psychology, logistics, and mindset — factors that determine performance as much as knowledge does.",
  type: "vocab",
  vocab: [
    ["平常心", "へいじょうしん", "composure, calm state of mind"],
    ["焦り", "あせり", "impatience, anxiety"],
    ["切り替え", "きりかえ", "switching, changeover"],
    ["深呼吸", "しんこきゅう", "deep breath"],
    ["諦めない", "あきらめない", "not giving up"]
  ],
  chars: [],
  grammar: { pattern: "〜に左右されない", meaning: "not to be swayed by ~, unaffected by ~", example_jp: "平常心を保ち、緊張に左右されないことが大切だ。", example_en: "It is important to maintain composure and not be swayed by nervousness." },
  practice: "Write your personal exam-day plan: wake-up time, breakfast, travel, arrival, pre-exam routine. Also write three affirmations you will tell yourself if you feel anxious during the exam.",
  tip: "Exam day mindset tips: (1) if you hit a question you cannot answer, mark it and move on — do not let one hard question derail the whole exam. (2) If anxiety rises, take three slow deep breaths — proven to reduce cortisol. (3) Trust your preparation — 1300 days of study is real knowledge."
});

curriculum.push({
  day: 1318,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1318 / 7),
  title: "Final Reading Practice: Social Commentary Passage",
  intro: "Today we practice a social commentary passage — a high-frequency N2 topic combining factual information with the author's critical perspective.",
  type: "reading",
  vocab: [
    ["格差", "かくさ", "disparity, gap, inequality"],
    ["是正", "ぜせい", "correction, redress, rectification"],
    ["施策", "しさく", "policy, measure"],
    ["実効性", "じっこうせい", "effectiveness, practical effect"],
    ["包括的", "ほうかつてき", "comprehensive, inclusive"]
  ],
  chars: [],
  grammar: { pattern: "〜が問われる", meaning: "~ is questioned, ~ is put to the test", example_jp: "政策の実効性が問われている。", example_en: "The effectiveness of the policy is being questioned." },
  practice: "Read the passage below. Identify the problem, the proposed solution, and the author's critical stance in three sentences.",
  tip: "Social commentary passages often use these argument signals: 〜とされている (it is said that — author may or may not agree), 〜ではないだろうか (isn't it the case that — author's implicit opinion), 〜が求められる (is required — author's recommendation).",
  passage: {
    text_jp: "経済的格差の拡大は、現代社会における深刻な問題の一つである。高所得者と低所得者の間の差は年々広がり、教育機会や医療へのアクセスにも不平等が生じている。政府はこれまでさまざまな是正策を打ち出してきたが、その実効性には疑問の声も多い。格差を真に是正するためには、表面的な施策にとどまらず、社会構造の根本的な見直しが必要ではないだろうか。包括的かつ長期的な視点からの取り組みが求められる。",
    text_en: "The widening of economic disparities is one of the serious problems of modern society. The gap between high-income and low-income earners is widening year by year, and inequalities are also arising in access to education and medical care. While the government has put forward various corrective measures, there are many voices questioning their effectiveness. To truly correct disparities, is it not necessary to go beyond superficial measures and fundamentally reconsider social structures? A comprehensive and long-term approach is required.",
    questions: [
      { question_jp: "筆者は格差是正のために何が必要だと考えていますか。", question_en: "What does the author think is necessary for correcting disparities?", answer: "表面的な施策にとどまらず、社会構造の根本的な見直し。包括的・長期的な取り組み" }
    ]
  }
});

curriculum.push({
  day: 1319,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1319 / 7),
  title: "Phase 26 Review: Final N2 Consolidation",
  intro: "Today we complete a final consolidation of everything covered in Phase 26 — strategies, question types, and key knowledge — before the final milestone day.",
  type: "grammar",
  vocab: [
    ["総復習", "そうふくしゅう", "comprehensive review"],
    ["仕上げ", "しあげ", "finishing touches, final polish"],
    ["自信", "じしん", "confidence, self-confidence"],
    ["準備万端", "じゅんびばんたん", "fully prepared, all set"],
    ["実力発揮", "じつりょくはっき", "demonstrating one's true ability"]
  ],
  chars: [],
  grammar: { pattern: "〜に自信を持つ", meaning: "to be confident in ~, to have confidence in ~", example_jp: "ここまで学んできた自分の力に自信を持って試験に臨もう。", example_en: "Let us face the exam with confidence in the ability we have built up to this point." },
  practice: "Write a final pre-exam checklist: what to bring, which grammar patterns to review one final time, and your personal test-taking strategy for each section.",
  tip: "You have covered N2 across 330 days (days 991–1319). Phase 22 (vocabulary), Phase 23 (verbs), Phase 24 (grammar), Phase 25 (kanji), Phase 26 (test prep). Your preparation is comprehensive. Trust it."
});

curriculum.push({
  day: 1320,
  phaseNum: 26,
  phaseName: "N2 Test Prep",
  week: Math.ceil(1320 / 7),
  title: "N2 Complete: A Major Achievement",
  intro: "Day 1320 — the completion of the full N2 curriculum. You have now studied Japanese for 1,320 consecutive days, covering N5, N4, N3, and N2. This is a remarkable achievement.",
  type: "reading",
  vocab: [
    ["完了", "かんりょう", "completion, accomplishment"],
    ["到達", "とうたつ", "attainment, reaching"],
    ["成果", "せいか", "result, achievement, fruit of effort"],
    ["飛躍", "ひやく", "leap, great advance"],
    ["次なるステップ", "つぎなるすてっぷ", "next step"]
  ],
  chars: [],
  grammar: { pattern: "〜を成し遂げる", meaning: "to accomplish ~, to achieve ~, to complete ~", example_jp: "1,320日間の学習を成し遂げたことは、真の努力の証にほかならない。", example_en: "Having accomplished 1,320 days of continuous study is nothing less than proof of true effort." },
  practice: "Write a 300-character reflection on your Japanese learning journey from day 1 to day 1320. Use at least ten N2 grammar patterns. This is your N2 graduation essay.",
  tip: "You have completed JLPT N5 through N2. Your Japanese spans hiragana, katakana, ~2,000 kanji, ~8,000 vocabulary items, and ~400 grammar patterns. The path to N1 — if you choose to walk it — begins with N1 vocabulary (Phase 28, day 1321). 継続は力なり。",
  passage: {
    text_jp: "言語を学ぶということは、単に単語や文法を覚えることではない。それは、新たな世界観を獲得し、異なる文化の思考様式に触れ、自己の視野を広げることである。日本語という複雑で豊かな言語を学び続けてきたあなたは、その過程でかけがえのない何かを手に入れたはずだ。試験の合否を超えて、日本語があなたの人生を豊かにし続けることを願っている。",
    text_en: "Learning a language is not merely memorizing words and grammar. It is acquiring a new worldview, encountering the ways of thinking of different cultures, and broadening one's own horizons. You, who have continued to study Japanese — a complex and rich language — must have gained something irreplaceable through that process. Beyond the pass or fail of an exam, I hope Japanese continues to enrich your life.",
    questions: [
      { question_jp: "筆者によると、言語を学ぶことの本当の意味は何ですか。", question_en: "According to the author, what is the true meaning of learning a language?", answer: "新たな世界観を獲得し、異文化の思考様式に触れ、自己の視野を広げること" }
    ]
  }
});