"use strict";

// Level colors: the active palette's level tokens (styles.css)
var LEVEL_COLORS = { N5: 'var(--n5)', N4: 'var(--n4)', N3: 'var(--n3)', N2: 'var(--n2)', N1: 'var(--n1)' };

// ── Progressive UI Translations ──────────────────────────────────────────────
// As learning-related words are taught in the curriculum, the UI progressively
// switches from English to Japanese. Each entry has {en, ja, since} where
// `since` is the level from which the Japanese label shows (Q23): words taught
// during N5 switch at N4, and so on. Settings words are never taught → N1.
var UI_STRINGS = {
  // Navigation / header
  unit_label:     { en: 'Stage',     ja: 'ステージ',   since: 'N4' },
  // Navbar tabs: kanji labels, `rt` = furigana shown via tRuby() while the pref is on
  view_today:     { en: 'Today',    ja: '今日', rt: 'きょう',     since: 'N4'   },
  // Units/Stats words aren't taught as lesson vocabulary → switch with N1 (like Settings)
  view_units:     { en: 'Stages',   ja: 'ステージ',   since: 'N1' },
  view_stats:     { en: 'Stats',    ja: '統計', rt: 'とうけい',   since: 'N1' },
  view_review:    { en: 'Review',   ja: '復習', rt: 'ふくしゅう', since: 'N4'   },
  view_achievements: { en: 'Achievements', ja: '実績', rt: 'じっせき', since: 'N1' },
  // Achievements screen
  ach_of:          { en: 'of',              ja: '/',               since: 'N1' },
  ach_locked:      { en: 'Locked',          ja: '未解除',         since: 'N1' },
  ach_secret:      { en: 'Secret achievement', ja: 'シークレット実績', since: 'N1' },
  ach_empty:       { en: 'No achievements yet.', ja: '実績はまだありません。', since: 'N1' },
  ach_cat_progress: { en: 'Progress', ja: '進捗', since: 'N1' },
  ach_cat_habit:    { en: 'Habit',    ja: '習慣', since: 'N1' },
  ach_cat_quiz:     { en: 'Quiz',     ja: 'クイズ', since: 'N1' },
  ach_cat_mock:     { en: 'Mock exams', ja: '模試', since: 'N1' },
  ach_cat_review:   { en: 'Review',   ja: '復習', since: 'N1' },
  ach_cat_mastery:  { en: 'Mastery',  ja: '定着', since: 'N1' },
  ach_r_common:     { en: 'common',    ja: 'コモン', since: 'N1' },
  ach_r_uncommon:   { en: 'uncommon',  ja: 'アンコモン', since: 'N1' },
  ach_r_rare:       { en: 'rare',      ja: 'レア', since: 'N1' },
  ach_r_epic:       { en: 'epic',      ja: 'エピック', since: 'N1' },
  ach_r_legendary:  { en: 'legendary', ja: 'レジェンド', since: 'N1' },
  // Day status
  mark_incomplete: { en: 'Mark not done', ja: 'まだ',         since: 'N4'  },
  skipped_badge:   { en: '» Skipped',      ja: '» スキップ',    since: 'N4' },
  skipped_label:   { en: 'Skipped, verified by placement', ja: 'スキップ（きじゅんテストでかくにん）', since: 'N4' },
  skipped_tag:     { en: 'Skipped', ja: 'スキップ', since: 'N4' },
  skipped_count:   { en: '{n} skipped',     ja: 'スキップ：{n}', since: 'N4' },
  complete_badge:  { en: '✓ Done',         ja: '✓ かんりょう',  since: 'N4' },
  // Navigation buttons
  nav_prev: { en: '← Previous', ja: '← まえ',   since: 'N4'  },
  nav_next: { en: 'Next →',     ja: 'つぎ →',   since: 'N4' },
  nav_skip: { en: 'Skip →',     ja: 'とばす →', since: 'N4' },
  nav_next_stage: { en: 'Next stage →', ja: 'つぎのステージ →', since: 'N4' },
  // Section labels (inside a lesson)
  section_kanji:      { en: 'Kanji',         ja: 'かんじ',     since: 'N4' },
  section_vocabulary: { en: 'Vocabulary',    ja: 'たんご',     since: 'N4' },
  section_grammar:    { en: 'Grammar point', ja: 'ぶんぽう',   since: 'N4' },
  grammar_build:      { en: 'Build',         ja: 'つくりかた', since: 'N4' },
  section_practice:   { en: 'Practice',      ja: 'れんしゅう', since: 'N4' },
  section_exercises:  { en: 'Exercises',     ja: 'もんだい',   since: 'N4' },
  section_kana:       { en: 'Kana',          ja: 'かな',       since: 'N4' },
  section_read:       { en: 'Read these words', ja: 'よんでみよう', since: 'N4' },
  section_examples:   { en: 'Example sentences', ja: 'れいぶん', since: 'N4' },
  // Vocabulary table headers
  vocab_word:    { en: 'Word',    ja: 'ことば', since: 'N4' },
  vocab_reading: { en: 'Reading', ja: 'よみ',   since: 'N4'  },
  vocab_meaning: { en: 'Meaning', ja: 'いみ',   since: 'N4' },
  // Vocabulary cover-and-test (lesson screen)
  vocab_verbs:      { en: 'Verbs',      ja: 'どうし',     since: 'N4' },
  vocab_adjectives: { en: 'Adjectives', ja: 'けいようし', since: 'N4' },
  vocab_nouns:      { en: 'Nouns',      ja: 'めいし',     since: 'N4' },
  vocab_other:      { en: 'Other',      ja: 'ほか',       since: 'N4' },
  vocab_checked:    { en: 'Checked',    ja: 'かくにん',   since: 'N4' },
  vocab_listen_all: { en: 'Listen to all', ja: 'ぜんぶきく', since: 'N4' },
  // Lesson Kanji section
  kanji_view_focus:   { en: 'View one at a time', ja: 'ひとつずつみる', since: 'N4' },
  kanji_view_rows:    { en: 'View all',           ja: 'ぜんぶみる',     since: 'N4' },
  kanji_words:        { en: "This lesson's words", ja: 'このレッスンのことば', since: 'N4' },
  kanji_strokes:      { en: 'strokes',            ja: 'かく',           since: 'N4' },
  kanji_strokes_show: { en: 'Show stroke order',  ja: 'かきじゅんをみる', since: 'N4' },
  kanji_strokes_hide: { en: 'Hide stroke order',  ja: 'かきじゅんをかくす', since: 'N4' },
  kanji_info_label:   { en: 'What are kun and on readings?', ja: 'くんよみとおんよみ', since: 'N1' },
  kanji_info_intro:   { en: 'Most kanji have more than one reading. Which one you use depends on the word.', ja: 'かんじにはよみかたがいくつかあります。', since: 'N1' },
  kanji_info_kun:     { en: "Kun (kun'yomi): the native Japanese reading. Usually used when the kanji stands alone or takes hiragana endings, like 人 → ひと. The dimmed part is the hiragana ending (okurigana).", ja: 'くん：やまとことばのよみ。ひとつでつかうことがおおい。', since: 'N1' },
  kanji_info_on:      { en: "On (on'yomi): the reading borrowed from Chinese, written in katakana. Usually used in compounds of several kanji, like 学生 → がくせい.", ja: 'おん：ちゅうごくごからきたよみ。じゅくごでつかうことがおおい。', since: 'N1' },
  kanji_info_extra:   { en: "Grey readings are extra ones that this lesson's words don't use.", ja: 'うすいよみは、このレッスンではつかわないよみ。', since: 'N1' },
  // Lesson note box
  note_label:       { en: 'Lesson note', ja: 'メモ', since: 'N4' },
  // Lesson Kana section
  mode_learn:       { en: 'Learn',        ja: 'まなぶ',       since: 'N4' },
  mode_practice:    { en: 'Practice',     ja: 'れんしゅう',   since: 'N4' },
  mode_label:        { en: 'Mode',         ja: 'モード',       since: 'N4' },
  kana_tap:         { en: 'Tap a kana to hear it', ja: 'タップするときこえます', since: 'N4' },
  kana_revealed:    { en: 'Revealed',     ja: 'みた',         since: 'N4' },
  mode_shuffle:     { en: 'Shuffle',      ja: 'シャッフル',   since: 'N4' },
  mode_reveal_all:  { en: 'Reveal all',   ja: 'ぜんぶみる',   since: 'N4' },
  mode_hide_all:    { en: 'Hide all',     ja: 'ぜんぶかくす', since: 'N4' },
  kana_watch:       { en: 'Watch out for', ja: 'ちゅうい',    since: 'N4' },
  kana_irregular:   { en: 'Irregular sound', ja: 'ふつうとちがうおと', since: 'N4' },
  kana_lookalike:   { en: 'Look alike',   ja: 'にているかたち', since: 'N4' },
  kana_later:       { en: 'taught in a later lesson', ja: 'あとのレッスンでならう', since: 'N4' },
  kana_info_label:  { en: 'How kana and romaji work', ja: 'かなとローマじ', since: 'N1' },
  kana_info_sound:  { en: 'Each kana is one sound (a syllable). Japanese has two kana scripts: hiragana and katakana.', ja: 'かなは、ひとつのおとをあらわします。', since: 'N1' },
  kana_info_romaji: { en: 'The Latin letters under each kana are romaji: a guide to the sound, not part of the language.', ja: 'ローマじは、おとのめやすです。', since: 'N1' },
  kana_info_practice: { en: 'Practice hides them so you can test yourself.', ja: 'れんしゅうでは、かくしてためせます。', since: 'N1' },
  kanji_looked:       { en: 'looked at',          ja: 'みた',           since: 'N4' },
  kanji_next:         { en: 'Next kanji →',  ja: 'つぎのかんじ →', since: 'N4' },
  // SRS review buttons
  btn_again: { en: 'Again', ja: 'もういちど',  since: 'N4'  },
  btn_hard:  { en: 'Hard',  ja: 'むずかしい', since: 'N4'  },
  btn_good:  { en: 'Good',  ja: 'いい',       since: 'N4'  },
  btn_easy:  { en: 'Easy',  ja: 'かんたん',   since: 'N4' },
  // Review card labels
  card_vocab:   { en: 'Vocabulary', ja: 'たんご', since: 'N4' },
  tap_reveal:   { en: 'tap to reveal',                    ja: 'タップしてみる',  since: 'N4'  },
  click_reveal: { en: 'Click the card to see the answer', ja: 'カードをクリック！', since: 'N4' },
  // Review completion messages
  all_caught_up:  { en: 'All caught up!',      ja: 'ぜんぶおわった！',  since: 'N4' },
  no_cards_due:   { en: 'No cards due for review right now.', ja: 'いまふくしゅうカードはありません。', since: 'N4' },
  // Review hub
  rv_start:    { en: 'Start review',  ja: 'ふくしゅうする', since: 'N4' },
  rv_cards_due:{ en: 'cards due',     ja: 'まい',           since: 'N4' },
  rv_card_due: { en: 'card due',      ja: 'まい',           since: 'N4' },
  rv_all:      { en: 'All',           ja: 'ぜんぶ',         since: 'N4' },
  rv_no_cards:    { en: 'No cards yet. Finish a stage and its words and kanji land here for review.', ja: 'まだカードがありません。ステージをおわらせるとここにでます。', since: 'N4' },
  rv_next7:    { en: 'Next 7 days',   ja: 'これから7にち',  since: 'N4' },
  rv_today:    { en: 'Today',         ja: 'きょう',         since: 'N4' },
  rv_know:     { en: 'What you know', ja: 'おぼえたカード', since: 'N4' },
  rv_new:      { en: 'New',           ja: 'あたらしい',     since: 'N4' },
  rv_learning: { en: 'Learning',      ja: 'ならいちゅう',   since: 'N4' },
  rv_known:    { en: 'Known',         ja: 'おぼえた',       since: 'N4' },
  rv_back:     { en: '← Review home', ja: '← ふくしゅう',   since: 'N4' },
  session_done:   { en: 'Session complete!',   ja: 'よくできました！',  since: 'N4' },
  // Exercise / quiz labels
  start_quiz:  { en: 'Start Quiz',               ja: 'テストをはじめる',     since: 'N4' },
  try_again:   { en: 'Try Again',                ja: 'もういちど',            since: 'N4'  },
  quiz_title:  { en: 'Ready to test yourself?',  ja: 'テストのじかんです！',  since: 'N4' },
  check_btn:   { en: 'Check',                    ja: 'かくにん',              since: 'N4' },
  // Exercise prompts (translated once prerequisite words are taught)
  prompt_listen:    { en: 'Listen and choose the meaning:', ja: 'きいて、いみをえらんでください：', since: 'N4' },
  prompt_mc_char:   { en: 'What is the reading for this character?', ja: 'このもじのよみは？', since: 'N4' },
  prompt_mc_word:   { en: 'What does this word mean?', ja: 'このことばのいみは？', since: 'N4' },
  prompt_type_char: { en: 'Type the reading for this character:', ja: 'このもじのよみをにゅうりょくしてください：', since: 'N4' },
  prompt_type_word: { en: 'What does this word mean? (type in English)', ja: 'このことばのいみは？（えいごで）', since: 'N4' },
  // N3 additions
  reading_passage: { en: 'Reading', ja: '読解', since: 'N2' },
  conjugate:       { en: 'Conjugate', ja: '活用', since: 'N2' },
  // N2 additions
  synonym_label:   { en: 'Synonym', ja: '類義語', since: 'N1' },
  reorder_label:   { en: 'Reorder', ja: '並べ替え', since: 'N1' },
  // N1 additions
  editorial:       { en: 'Editorial', ja: '社説', since: 'N1' },
  mock_exam:       { en: 'Mock Exam', ja: '模擬試験', since: 'N1' },
  furigana_label:  { en: 'Furigana', ja: 'ふりがな', since: 'N3' },
  furigana_show:   { en: 'Show furigana', ja: 'ふりがな表示', since: 'N3' },
  furigana_hide:   { en: 'Hide furigana', ja: 'ふりがな非表示', since: 'N3' },
  // Settings view. These words are never taught as lesson vocabulary, so in
  // 'auto' they switch with N1; 'ja' shows them immediately.
  settings_title:    { en: 'Settings',          ja: '設定',             since: 'N1' },
  settings_back:     { en: '← Back',            ja: '← 戻る',           since: 'N1' },
  set_appearance:    { en: 'Appearance',        ja: '外観',             since: 'N1' },
  set_palette:       { en: 'Color palette',     ja: '配色',             since: 'N1' },
  set_dark:          { en: '☾ Dark mode',       ja: '☾ ダークモード',   since: 'N1' },
  set_on:            { en: 'On',                ja: 'オン',             since: 'N1' },
  set_off:           { en: 'Off',               ja: 'オフ',             since: 'N1' },
  set_language:      { en: 'Language',          ja: '言語',             since: 'N1' },
  set_ui_lang:       { en: 'Interface language', ja: '表示言語',        since: 'N1' },
  set_lang_auto:     { en: 'Auto: switch to Japanese as you learn', ja: '自動：学習に合わせて日本語に', since: 'N1' },
  set_furigana:      { en: 'Furigana',          ja: 'ふりがな',         since: 'N1' },
  set_furi_auto:     { en: 'Auto: show until N1', ja: '自動：N1まで表示', since: 'N1' },
  set_furi_always:   { en: 'Always show',       ja: '常に表示',         since: 'N1' },
  set_furi_never:    { en: 'Never show',        ja: '表示しない',       since: 'N1' },
  set_audio:         { en: 'Audio',             ja: '音声',             since: 'N1' },
  set_speech_speed:  { en: 'Speech speed',      ja: '読み上げ速度',     since: 'N1' },
  set_data:          { en: 'Data',              ja: 'データ',           since: 'N1' },
  set_data_hint:     { en: 'Save your progress to a file, or restore it from one.', ja: '学習データをファイルに保存、またはファイルから復元します。', since: 'N1' },
  set_export:        { en: 'Export',            ja: 'エクスポート',     since: 'N1' },
  set_import:        { en: 'Import',            ja: 'インポート',       since: 'N1' },
  set_sync:          { en: 'Sync',              ja: '同期',             since: 'N1' },
  set_sync_hint:     { en: 'Sync progress across your devices with your own CouchDB database. Setup steps are in the README under “Multi-device sync”.', ja: '自分のCouchDBデータベースで端末間の進捗を同期します。設定手順はREADMEの「Multi-device sync」にあります。', since: 'N1' },
  set_sync_url:      { en: 'Database URL',      ja: 'データベースURL',  since: 'N1' },
  set_sync_user:     { en: 'Username',          ja: 'ユーザー名',       since: 'N1' },
  set_sync_pass:     { en: 'Password',          ja: 'パスワード',       since: 'N1' },
  set_sync_remember: { en: 'Remember on this device', ja: 'この端末に保存する', since: 'N1' },
  set_sync_remember_hint: { en: 'Off: you sign in again each session. On: the password is saved in this browser, where other pages on this address can read it.', ja: 'オフ：ブラウザを開くたびに再入力します。オン：同じアドレスの他のサイトから保存したパスワードを読まれる可能性があります。', since: 'N1' },
  set_sync_connect:  { en: 'Connect',           ja: '接続',             since: 'N1' },
  set_sync_disconnect: { en: 'Disconnect',      ja: '切断',             since: 'N1' },
  set_sync_forget:   { en: 'Also forget the saved login', ja: '保存したログイン情報も削除する', since: 'N1' },
  set_sync_now:      { en: 'Sync now',          ja: '今すぐ同期',       since: 'N1' },
  set_sync_as:       { en: 'Signed in as',      ja: 'ログイン中：',     since: 'N1' },
  sync_off:          { en: 'Not connected',     ja: '未接続',           since: 'N1' },
  sync_connecting:   { en: 'Connecting…',       ja: '接続中…',          since: 'N1' },
  sync_syncing:      { en: 'Syncing…',          ja: '同期中…',          since: 'N1' },
  sync_synced:       { en: 'Synced',            ja: '同期済み',         since: 'N1' },
  sync_offline:      { en: 'Offline. Retrying automatically', ja: 'オフライン。自動で再試行します', since: 'N1' },
  sync_error:        { en: 'Sync error',        ja: '同期エラー',       since: 'N1' },
  sync_merged:       { en: 'Merged {units} completed stages and {cards} cards', ja: '統合しました：完了ステージ{units}件、カード{cards}枚', since: 'N1' },
  sync_err_url_empty: { en: 'Enter the database URL.', ja: 'データベースURLを入力してください。', since: 'N1' },
  sync_err_url:      { en: 'That isn’t a valid URL.', ja: 'URLの形式が正しくありません。', since: 'N1' },
  sync_err_url_creds: { en: 'Put the username and password in their own fields, not in the URL.', ja: 'ユーザー名とパスワードはURLに含めず、それぞれの欄に入力してください。', since: 'N1' },
  sync_err_https:    { en: 'The URL must start with https:// (http:// works only for localhost).', ja: 'URLは https:// で始めてください（http:// は localhost のみ可）。', since: 'N1' },
  sync_err_url_db:   { en: 'Add the database name to the URL, e.g. https://example.com/jelly', ja: 'URLにデータベース名を含めてください（例：https://example.com/jelly）。', since: 'N1' },
  sync_err_creds_empty: { en: 'Enter the username and password.', ja: 'ユーザー名とパスワードを入力してください。', since: 'N1' },
  sync_err_network:  { en: 'Couldn’t reach the database. Check the URL and your connection. The server’s CORS settings must also allow this site with credentials (see the README).', ja: 'データベースに接続できません。URLと通信状況、そしてサーバーのCORS設定でこのサイトが（credentials付きで）許可されているか確認してください（README参照）。', since: 'N1' },
  sync_err_auth:     { en: 'Wrong username or password.', ja: 'ユーザー名またはパスワードが違います。', since: 'N1' },
  sync_err_forbidden: { en: 'This user can’t use that database. Add the user to the database’s members (_security).', ja: 'このユーザーはこのデータベースを使えません。データベースの members（_security）に追加してください。', since: 'N1' },
  sync_err_missing:  { en: 'That database doesn’t exist. Create it on your server first. The app doesn’t create databases.', ja: 'このデータベースは存在しません。先に作成してください（アプリは作成しません）。', since: 'N1' },
  sync_err_local:    { en: 'Sync needs this browser’s local database (IndexedDB), which isn’t available here.', ja: '同期にはこのブラウザのローカルデータベース（IndexedDB）が必要ですが、利用できません。', since: 'N1' },
  sync_err_other:    { en: 'Sync failed.',      ja: '同期に失敗しました。', since: 'N1' },
  set_sfx:           { en: 'Sound effects',     ja: '効果音',           since: 'N1' },
  set_official_audio: { en: 'Practice with official audio', ja: '公式の音声で練習', since: 'N1' },
  set_official_audio_hint: { en: 'Listening questions here use your browser’s voice. The official JLPT site has real sample audio (opens jlpt.jp in a new tab).', ja: 'このアプリの聴解はブラウザの音声を使います。JLPT公式サイトに本物の音声サンプルがあります（新しいタブでjlpt.jpを開きます）。', since: 'N1' },
  // Pace (Settings + Overview, see PACE_MODES in lib.js)
  set_pace_section:  { en: 'Pace',              ja: 'ペース',           since: 'N1' },
  set_pace:          { en: 'Stages per day',     ja: '1日のステージ数',  since: 'N1' },
  pace_casual:       { en: 'Casual: 1 stage every 2 days', ja: 'ゆっくり：2日に1ステージ', since: 'N1' },
  pace_standard:     { en: 'Standard: 1 stage a day',      ja: '標準：1日1ステージ',       since: 'N1' },
  pace_intensive:    { en: 'Intensive: 2 stages a day',    ja: '集中：1日2ステージ',       since: 'N1' },
  pace_super:        { en: 'Super intensive: 3 stages a day', ja: '超集中：1日3ステージ',  since: 'N1' },
  pace_super_note:   { en: 'More stages a day means more new cards, so your daily reviews grow too.', ja: 'ステージが増えると新しいカードも増え、毎日の復習も増えます。', since: 'N1' },
  set_exam_date:     { en: 'JLPT exam date (optional)', ja: 'JLPT試験日（任意）', since: 'N1' },
  set_exam_hint:     { en: 'Add it to see if your pace gets you there in time. The JLPT is held in July and December.', ja: '入力すると、今のペースで間に合うか確認できます。JLPTは7月と12月に実施されます。', since: 'N1' },
  pace_units:        { en: 'stages',             ja: 'ステージ',         since: 'N1' },
  pace_unit_one:     { en: 'stage',              ja: 'ステージ',         since: 'N1' },
  pace_finish:       { en: 'Projected finish for', ja: '修了予定',         since: 'N1' },
  pace_all_levels:   { en: 'All levels', ja: '全レベル',      since: 'N1' },
  pace_exam:         { en: 'Exam',              ja: '試験',             since: 'N1' },
  pace_on_track:     { en: 'On track',          ja: '順調',             since: 'N1' },
  pace_behind:       { en: 'Behind schedule',          ja: '遅れ気味',         since: 'N1' },
  pace_suggested:    { en: 'Suggested',         ja: 'おすすめ',         since: 'N1' },
  set_credits:       { en: 'Credits',           ja: 'クレジット',       since: 'N1' },
  cred_kanjivg:      { en: 'stroke order diagrams', ja: '筆順図',       since: 'N1' },
  cred_tanos:        { en: 'JLPT kanji and vocabulary lists', ja: 'JLPTの漢字・語彙リスト', since: 'N1' },
  cred_tatoeba:      { en: 'example sentences', ja: '例文',             since: 'N1' },
  cred_wordlist:     { en: 'JLPT word list',    ja: 'JLPT単語リスト',   since: 'N1' },
  cred_kenney:       { en: 'sound effects',     ja: '効果音',           since: 'N1' },
  cred_dicebear:     { en: 'achievement stamp icons (identicon)', ja: '実績スタンプのアイコン', since: 'N1' },
  cred_react:        { en: 'UI library',        ja: 'UIライブラリ',     since: 'N1' },
  cred_pouchdb:      { en: 'local storage and sync', ja: 'ローカル保存と同期', since: 'N1' },
  pace_too_late:   { en: "Even Super intensive won't finish a week before your exam", ja: '超集中でも試験の1週間前までに終わりません', since: 'N1' },
  // Already-known import (ticket 37). 知る is N5 vocabulary, so the review
  // button and unit badge switch at N4; the Settings part switches with N1.
  known_btn:         { en: 'I already know this', ja: 'もうしっている', since: 'N4' },
  unit_known:        { en: '{n} already known', ja: 'もうしっている：{n}', since: 'N4' },
  set_known:         { en: 'Already know some Japanese?', ja: '学習済みの項目', since: 'N1' },
  set_known_hint:    { en: 'Mark what you already know so it skips the new-card queue. Each known item comes back once in 3–4 weeks as a real test: get it wrong and it goes back into normal review.', ja: 'すでに知っている項目を「既知」にできます。既知の項目は3〜4週間後に一度テストされ、間違えると通常の復習に戻ります。', since: 'N1' },
  qs_title:          { en: 'Quick sort', ja: 'クイック仕分け', since: 'N1' },
  qs_hint:           { en: 'Flick through a level’s kana, words and kanji: about one a second. Grammar isn’t included: learn it in the lessons.', ja: 'レベルのかな・単語・漢字を1秒ほどで仕分けます。文法はレッスンで学びます。', since: 'N1' },
  qs_start:          { en: 'Sort {lv}', ja: '{lv}を仕分け', since: 'N1' },
  qs_progress:       { en: '{done} / {total} sorted', ja: '{done} / {total} 仕分け済み', since: 'N1' },
  qs_known:          { en: 'Known', ja: '知っている', since: 'N1' },
  qs_not_yet:        { en: 'Not yet', ja: 'まだ', since: 'N1' },
  qs_undo:           { en: 'Undo last', ja: '一つ戻す', since: 'N1' },
  qs_keys:           { en: 'Keys: K or → known · J or ← not yet · Backspace undo · Esc close', ja: 'キー：K / → 知っている・J / ← まだ・Backspace 戻す・Esc 閉じる', since: 'N1' },
  qs_done:           { en: 'All sorted. Known items come back for a check in 3–4 weeks.', ja: '仕分け完了。既知の項目は3〜4週間後に確認します。', since: 'N1' },
  qs_close:          { en: 'Close', ja: '閉じる', since: 'N1' },
  qs_restart:        { en: 'Show “not yet” items again', ja: '「まだ」の項目をもう一度', since: 'N1' },
  paste_title:       { en: 'Paste or upload a list', ja: 'リストを貼り付け・読み込み', since: 'N1' },
  paste_hint:        { en: 'Any text works: Anki notes exported as plain text, a WaniKani or Bunpro list, a spreadsheet saved as CSV. Course words and kanji are picked out of it.', ja: 'Ankiのテキスト書き出し、WaniKaniやBunproのリスト、CSVなど、どんなテキストでも使えます。コースの単語と漢字を探します。', since: 'N1' },
  paste_label:       { en: 'Text to scan', ja: '読み取るテキスト', since: 'N1' },
  paste_file:        { en: 'Or upload a .txt, .csv or .tsv file', ja: 'または .txt / .csv / .tsv ファイルを選ぶ', since: 'N1' },
  paste_find:        { en: 'Find words', ja: '単語を探す', since: 'N1' },
  paste_none:        { en: 'No course words or kanji found in that text.', ja: 'コースの単語や漢字は見つかりませんでした。', since: 'N1' },
  paste_found:       { en: '{n} found', ja: '{n}件', since: 'N1' },
  paste_in_srs:      { en: '{n} more are already in your reviews and stay as they are.', ja: 'ほか{n}件はすでに復習中のため変更しません。', since: 'N1' },
  paste_apply:       { en: 'Mark {n} as known', ja: '{n}件を既知にする', since: 'N1' },
  paste_cancel:      { en: 'Cancel', ja: 'キャンセル', since: 'N1' },
  paste_result:      { en: '{n} marked as known.', ja: '{n}件を既知にしました。', since: 'N1' },
  hist_title:        { en: 'Import history', ja: '取り込み履歴', since: 'N1' },
  hist_row:          { en: '{n} known',ja: '{n}件', since: 'N1' },
  hist_reviewed:     { en: '{n} reviewed since, kept on undo', ja: '{n}件は復習済み（取り消しても残ります）', since: 'N1' },
  hist_undo:         { en: 'Undo', ja: '取り消す', since: 'N1' },
  hist_undo_confirm: { en: 'Take back these {n} known items? Items reviewed since stay.', ja: 'この{n}件の既知を取り消しますか？復習済みの項目は残ります。', since: 'N1' },
  'src_known-button': { en: 'Known button', ja: '既知ボタン', since: 'N1' },
  src_quicksort:     { en: 'Quick sort', ja: 'クイック仕分け', since: 'N1' },
  src_paste:         { en: 'Pasted list', ja: '貼り付けリスト', since: 'N1' },
  // Welcome + placement test (ticket 39). JA = PLACEHOLDER drafts, need a native review before release.
  src_placement:     { en: 'Placement test', ja: 'レベル診断', since: 'N1' },
  wl_title:          { en: 'Learn Japanese for the JLPT', ja: 'JLPTのための日本語', since: 'N1' },
  wl_sub:            { en: 'N5 comes first. Every stage is open, so you can start anywhere.', ja: 'まずはN5から。どのステージからでも始められます。', since: 'N1' },
  wl_fact_1:         { en: 'Nothing is locked. Open any stage, in any order.', ja: 'ロックはありません。好きな順番で学べます。', since: 'N1' },
  wl_fact_2:         { en: 'Each stage ends in a short quiz. Pass it to complete the stage.', ja: '各ステージの最後に短いクイズがあります。合格するとステージ完了です。', since: 'N1' },
  wl_fact_3:         { en: 'What you learn comes back as a few review cards each day.', ja: '学んだことは、毎日少しずつ復習カードで戻ってきます。', since: 'N1' },
  wl_fact_4:         { en: 'Your progress stays in this browser. Back it up or sync in Settings.', ja: '進捗はこのブラウザにだけ保存されます。設定でバックアップや同期ができます。', since: 'N1' },
  wl_pace:           { en: 'Pace', ja: 'ペース', since: 'N1' },
  wl_pace_weeks:     { en: 'About {n} weeks to finish {lv} at this pace.', ja: 'このペースで{lv}を終えるまで約{n}週間。', since: 'N1' },
  wl_pace_week:      { en: 'About 1 week to finish {lv} at this pace.', ja: 'このペースで{lv}を終えるまで約1週間。', since: 'N1' },
  wl_exam:           { en: 'Exam date (optional)', ja: '試験日（任意）', since: 'N1' },
  wl_exam_bad:       { en: 'Enter a full date, like 2027-07-04.', ja: '2027-07-04のように日付を入力してください。', since: 'N1' },
  wl_exam_past:      { en: 'Choose a date in the future.', ja: '今日以降の日付を選んでください。', since: 'N1' },
  wl_exam_ok:        { en: 'You are on track for that date.', ja: 'この日程に間に合います。', since: 'N1' },
  wl_exam_try:       { en: 'To finish a week early, try {pace}.', ja: '1週間前に終えるには「{pace}」がおすすめです。', since: 'N1' },
  wl_exam_tight:     { en: 'That date is tight, even at the fastest pace.', ja: '最速のペースでも厳しい日程です。', since: 'N1' },
  wl_zero:           { en: 'Start from zero', ja: 'ゼロから始める', since: 'N1' },
  wl_zero_sub:       { en: 'Begin with the first hiragana stage.', ja: '最初のひらがなから始めます。', since: 'N1' },
  wl_find:           { en: 'Find my starting point', ja: '開始地点を見つける', since: 'N1' },
  wl_find_sub:       { en: 'About 5 minutes. Skip what you already know.', ja: '約5分。知っていることは飛ばせます。', since: 'N1' },
  wl_keep:           { en: 'Keep my progress', ja: '進捗を保つ', since: 'N1' },
  wl_keep_sub:       { en: 'Close this and go back to your stages.', ja: '閉じてステージに戻ります。', since: 'N1' },
  wl_skip:           { en: 'Skip for now', ja: '今はスキップ', since: 'N1' },
  wl_close:          { en: 'Close', ja: '閉じる', since: 'N1' },
  pt_title:          { en: 'Placement test', ja: 'レベル診断', since: 'N1' },
  pt_intro_title:    { en: 'Find your starting point', ja: '開始地点を見つける', since: 'N1' },
  pt_intro_sub:      { en: 'About 14 questions, then a few quick double-checks. You will not see right or wrong answers during the test.', ja: '約14問と、いくつかの確認問題です。テスト中は正解・不正解は表示されません。', since: 'N1' },
  pt_intro_1:        { en: 'Not sure? Tap "I don’t know". That is a fine answer.', ja: '分からないときは「分からない」を押してください。', since: 'N1' },
  pt_intro_2:        { en: 'Stages before your start are marked complete. Their words come back as review cards, so a lucky guess gets caught later.', ja: '開始地点より前のステージは完了になり、単語は復習カードとして戻ります。', since: 'N1' },
  pt_intro_3:        { en: 'Nothing is saved until you confirm the result. Leave any time.', ja: '結果を確定するまで何も保存されません。いつでも中断できます。', since: 'N1' },
  pt_intro_retake:   { en: 'This test only looks at stages after your furthest completed one. It never un-marks anything.', ja: 'このテストは、完了済みの最後のステージより後だけが対象です。完了を取り消すことはありません。', since: 'N1' },
  pt_start:          { en: 'Start the test', ja: 'テストを始める', since: 'N1' },
  pt_back:           { en: 'Back', ja: '戻る', since: 'N1' },
  pt_q:              { en: 'Question {n} of about {total}', ja: '第{n}問（全{total}問ほど）', since: 'N1' },
  pt_progress:       { en: 'Test progress', ja: 'テストの進み具合', since: 'N1' },
  pt_dk:             { en: 'I don’t know', ja: '分からない', since: 'N1' },
  pt_next:           { en: 'Next', ja: '次へ', since: 'N1' },
  pt_placeholder:    { en: 'Type your answer', ja: '答えを入力', since: 'N1' },
  pt_leave_aria:     { en: 'Leave the test', ja: 'テストを中断', since: 'N1' },
  pt_leave_title:    { en: 'Leave the test?', ja: 'テストを中断しますか？', since: 'N1' },
  pt_leave_body:     { en: 'Nothing has been saved. You can take it again from Settings.', ja: '何も保存されていません。設定からもう一度受けられます。', since: 'N1' },
  pt_keep:           { en: 'Keep going', ja: '続ける', since: 'N1' },
  pt_leave:          { en: 'Leave', ja: '中断する', since: 'N1' },
  pt_res_zero:       { en: 'Start at stage {n}', ja: 'ステージ{n}から始めましょう', since: 'N1' },
  pt_res_start:      { en: 'Start at stage {n}: {title}', ja: 'ステージ{n}「{title}」から', since: 'N1' },
  pt_res_zero_sub:   { en: 'There is nothing to skip yet. We will go step by step.', ja: 'まだ飛ばせるステージはありません。順番に進みましょう。', since: 'N1' },
  pt_res_sub:        { en: 'The stages before it are marked complete, and their words come back as review cards.', ja: 'それより前のステージは完了になり、単語は復習カードとして戻ります。', since: 'N1' },
  pt_res_all:        { en: 'You know every teaching stage', ja: 'すべての学習ステージを知っています', since: 'N1' },
  pt_res_all_sub:    { en: 'They are marked complete. Review and mock stages stay open.', ja: 'すべて完了になります。復習と模試のステージは開いたままです。', since: 'N1' },
  pt_rail:           { en: 'Teaching stages', ja: '学習ステージ', since: 'N1' },
  pt_lg_marked:      { en: 'Marked complete', ja: '完了にする', since: 'N1' },
  pt_lg_start:       { en: 'Your start', ja: '開始地点', since: 'N1' },
  pt_lg_todo:        { en: 'Still to learn', ja: 'これから', since: 'N1' },
  pt_lg_hole:        { en: 'Worth a look', ja: '要確認', since: 'N1' },
  pt_lg_done:        { en: 'Already done', ja: '完了済み', since: 'N1' },
  pt_stat_stages:    { en: 'stages marked complete', ja: 'ステージを完了に', since: 'N1' },
  pt_stat_cards:     { en: 'items added to your reviews', ja: '項目を復習に追加', since: 'N1' },
  pt_stat_qs:        { en: 'questions answered', ja: '問に回答', since: 'N1' },
  pt_earlier:        { en: 'Start earlier', ja: 'もっと前から始める', since: 'N1' },
  pt_stage_n:        { en: 'Stage {n}', ja: 'ステージ{n}', since: 'N1' },
  pt_reviews_many:   { en: '{n} reviews are waiting in the stages you skipped. They stay open.', ja: '飛ばした範囲に復習が{n}件あります。開いたままです。', since: 'N1' },
  pt_reviews_one:    { en: '1 review is waiting in the stages you skipped. It stays open.', ja: '飛ばした範囲に復習が1件あります。開いたままです。', since: 'N1' },
  pt_hole:           { en: 'You might revisit stage {n}: {title}. A spot-check there went wrong.', ja: 'ステージ{n}「{title}」はもう一度見てもよさそうです。確認問題で間違えました。', since: 'N1' },
  pt_apply:          { en: 'Start stage {n}', ja: 'ステージ{n}を始める', since: 'N1' },
  pt_apply_all:      { en: 'Save the result', ja: '結果を保存', since: 'N1' },
  pt_diag:           { en: 'Save and take the diagnostic mock', ja: '保存して診断模試を受ける', since: 'N1' },
  pt_discard:        { en: 'Discard result', ja: '結果を破棄', since: 'N1' },
  pt_res_note:       { en: 'Undo any time in Settings, under Already known. A retake only moves your start forward and never un-marks a stage.', ja: '設定の「既知」からいつでも取り消せます。再受験は開始地点を進めるだけで、完了を取り消すことはありません。', since: 'N1' },
  pt_how:            { en: 'How we got here ({n} steps)', ja: '結果までの流れ（{n}ステップ）', since: 'N1' },
  pt_col_step:       { en: 'Step', ja: 'ステップ', since: 'N1' },
  pt_col_stage:      { en: 'Stage', ja: 'ステージ', since: 'N1' },
  pt_col_result:     { en: 'Right', ja: '正解', since: 'N1' },
  pt_col_note:       { en: 'What happened', ja: '結果', since: 'N1' },
  pt_k_probe:        { en: 'Check', ja: '確認', since: 'N1' },
  pt_k_spot:         { en: 'Double-check', ja: '再確認', since: 'N1' },
  pt_n_probe_ok:     { en: 'Known. Searching later stages.', ja: '分かる。後ろを探します。', since: 'N1' },
  pt_n_probe_no:     { en: 'Not yet. Searching earlier stages.', ja: 'まだ。前を探します。', since: 'N1' },
  pt_n_spot_ok:      { en: 'Confirmed.', ja: '確認できました。', since: 'N1' },
  pt_n_spot_no:      { en: 'Worth a look.', ja: '要確認。', since: 'N1' },
  pt_n_none:         { en: 'No questions available, skipped.', ja: '出題できないため省略。', since: 'N1' },
  set_start:         { en: 'Starting point', ja: '開始地点', since: 'N1' },
  set_placement:     { en: 'Take the placement test', ja: 'レベル診断を受ける', since: 'N1' },
  set_placement_hint: { en: 'Skip the stages you already know. A retake only moves you forward and never un-marks a stage.', ja: '知っているステージを飛ばせます。再受験は先に進めるだけで、完了を取り消しません。', since: 'N1' },
  set_placement_done: { en: 'You have completed every teaching stage, so there is nothing left to skip.', ja: 'すべての学習ステージを完了済みです。', since: 'N1' },
  set_welcome:       { en: 'Show the welcome again', ja: 'ようこそ画面をもう一度見る', since: 'N1' },
  set_welcome_hint:  { en: 'The first-launch screen with pace, exam date and the start options.', ja: 'ペース、試験日、開始方法を選ぶ最初の画面です。', since: 'N1' },
  // Danger zone (ticket 43). JA lines are placeholders awaiting a native review.
  set_danger:        { en: 'Danger zone', ja: '危険な操作', since: 'N1' },
  reset_hint:        { en: 'Delete all progress and settings on this device and start over.', ja: 'この端末の学習記録と設定をすべて削除して、最初からやり直します。', since: 'N1' },
  reset_btn:         { en: 'Clear all data', ja: 'すべてのデータを消去', since: 'N1' },
  reset_title:       { en: 'Clear all data?', ja: 'すべてのデータを消去しますか？', since: 'N1' },
  reset_body:        { en: 'This permanently deletes your finished stages, review cards, activity history, mock results, achievements and settings on this device. It cannot be undone.', ja: 'この端末の完了ステージ、復習カード、学習履歴、模試の結果、実績、設定を完全に削除します。元に戻せません。', since: 'N1' },
  reset_sync:        { en: 'Sync will be turned off and the saved login forgotten. Your copy on the server is not touched.', ja: '同期を停止し、保存したログインを削除します。サーバー上のデータは変更されません。', since: 'N1' },
  reset_backup:      { en: 'Download a backup first', ja: '先にバックアップをダウンロード', since: 'N1' },
  reset_type:        { en: 'Type {word} to confirm', ja: '確認のため {word} と入力してください', since: 'N1' },
  reset_cancel:      { en: 'Cancel', ja: 'キャンセル', since: 'N1' },
  reset_go:          { en: 'Delete everything', ja: 'すべて削除する', since: 'N1' },
  reset_failed:      { en: 'Could not clear the data. Close other tabs of this app and try again.', ja: 'データを消去できませんでした。このアプリの他のタブを閉じてからもう一度お試しください。', since: 'N1' },
  // PWA (ticket 42). JA lines are placeholders awaiting a native review.
  install_title:     { en: 'Install Jelly JLPT', ja: 'Jelly JLPTをインストール', since: 'N1' },
  install_lead:      { en: 'Works fully offline. No account. Your progress stays on your device.', ja: '完全オフラインで使えます。アカウント不要。学習データは端末の中だけに残ります。', since: 'N1' },
  install_btn:       { en: 'Install app', ja: 'アプリをインストール', since: 'N1' },
  install_ios:       { en: 'In Safari, tap Share, then Add to Home Screen.', ja: 'Safariで共有ボタンを押し、「ホーム画面に追加」を選びます。', since: 'N1' },
  install_done_title: { en: 'Installed', ja: 'インストール済み', since: 'N1' },
  install_done:      { en: 'Open Jelly JLPT from your home screen or app list.', ja: 'ホーム画面またはアプリ一覧から開けます。', since: 'N1' },
  install_none:      { en: 'This browser has no install button here. Look for Install or Add to Home Screen in its menu.', ja: 'このブラウザにはインストールボタンがありません。メニューの「インストール」または「ホーム画面に追加」を探してください。', since: 'N1' },
  install_file:      { en: 'Installing needs the hosted version. Open the site over https to get the install button.', ja: 'インストールにはホスティング版が必要です。https でサイトを開くとインストールボタンが出ます。', since: 'N1' },
  update_title:      { en: 'Update ready', ja: '更新の準備ができました', since: 'N1' },
  update_body:       { en: 'Reload to get the latest version.', ja: '再読み込みで最新版になります。', since: 'N1' },
  update_wait:       { en: 'Finish your quiz first, then reload.', ja: 'クイズを終えてから再読み込みしてください。', since: 'N1' },
  update_btn:        { en: 'Reload', ja: '再読み込み', since: 'N1' },
  update_later:      { en: 'Later', ja: 'あとで', since: 'N1' },
  persist_granted:   { en: 'Protected from browser clean-up', ja: 'ブラウザの自動削除から保護されています', since: 'N1' },
  persist_denied:    { en: 'Not protected: back up regularly', ja: '保護されていません。こまめにバックアップしてください', since: 'N1' },
  persist_pending:   { en: 'Protection turns on after your first saved progress.', ja: '最初の学習記録を保存すると保護が有効になります。', since: 'N1' },
  net_online:        { en: 'You are online.', ja: 'オンラインです。', since: 'N1' },
  net_offline:       { en: 'You are offline. Everything still works, and sync resumes when you are back online.', ja: 'オフラインです。学習は続けられ、接続が戻ると同期を再開します。', since: 'N1' },
};
// t(key, level): level = the learner's current unit level ('N5'…'N1').
// window._uiLang ('auto' | 'en' | 'ja', set by App from prefs) overrides
// the progressive switch; 'auto' / unset keeps the level-based behavior.
// useQuizBusy(active): marks a quiz or mock as running while `active`, so the update toast waits (ticket 42).
// window.__quizBusy counts running ones; 'quiz-busy' fires on every change.
function useQuizBusy(active) {
  React.useEffect(function () {
    if (!active) return undefined;
    window.__quizBusy = (window.__quizBusy || 0) + 1;
    window.dispatchEvent(new Event('quiz-busy'));
    return function () { window.__quizBusy -= 1; window.dispatchEvent(new Event('quiz-busy')); };
  }, [active]);
}
function t(key, level) {
  var s = UI_STRINGS[key];
  if (!s) return key;
  if (window._uiLang === 'en') return s.en;
  if (window._uiLang === 'ja') return s.ja;
  return levelRank(level) >= levelRank(s.since) ? s.ja : s.en;
}
// tRuby: t() as a React node — a JA label with an `rt` reading gets ruby
// furigana when `furigana` is on (same pref UnitView uses, see furiganaOn).
function tRuby(key, level, furigana) {
  var s = UI_STRINGS[key], label = t(key, level);
  if (!s || !s.rt || !furigana || label !== s.ja) return label;
  return React.createElement('ruby', null, s.ja, React.createElement('rt', null, s.rt));
}

// ── Icons (navbar / settings) ────────────────────────────────────────────────
// Stroke icons from the navbar sketch; styled by .tab svg / .icon-btn svg.
var ICONS = {
  today: [['path', { d: 'M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2z' }], ['path', { d: 'M8 8h6' }]],
  units: [['rect', { x: 4, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 4, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 4, y: 13, width: 7, height: 7, rx: 1.5 }], ['rect', { x: 13, y: 13, width: 7, height: 7, rx: 1.5 }]],
  stats: [['path', { d: 'M4 20h16' }], ['path', { d: 'M7 16v-5' }], ['path', { d: 'M12 16V6' }], ['path', { d: 'M17 16v-8' }]],
  achievements: [['rect', { x: 5, y: 4, width: 14, height: 16, rx: 1, strokeDasharray: '2 2' }], ['path', { d: 'M9 13l2.2 2.2L15.5 10' }]],
  review: [['rect', { x: 3, y: 7, width: 14, height: 12, rx: 2 }], ['path', { d: 'M7 4h12a2 2 0 0 1 2 2v10' }]],
  speaker: [['path', { d: 'M4 9v6h4l5 4V5L8 9H4z' }], ['path', { d: 'M16.5 8.5a5 5 0 0 1 0 7' }]],
  speakerOff: [['path', { d: 'M4 9v6h4l5 4V5L8 9H4z' }], ['path', { d: 'M17 9l5 6M22 9l-5 6' }]],
  play: [['path', { d: 'M8 5.5v13l11-6.5z' }]],
  x: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
  check: [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
  clock: [['circle', { cx: 12, cy: 12, r: 9 }], ['path', { d: 'M12 7v5l3 2' }]],
  undo: [['path', { d: 'M9 14 4 9l5-5' }], ['path', { d: 'M4 9h10a6 6 0 0 1 0 12h-3' }]],
  bulb: [['path', { d: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z' }]],
  gear: [['circle', { cx: 12, cy: 12, r: 3 }], ['path', { d: 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' }]]
};
function icon(name) {
  return React.createElement('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' },
    ICONS[name].map(function (el, i) { return React.createElement(el[0], Object.assign({ key: i }, el[1])); }));
}

// ── Jelly mascot ─────────────────────────────────────────────────────────────
// Glass-jelly blob + two eyes, never a mouth. A mood is a vector of numbers (silhouette + eyes),
// so any two moods can be interpolated (see JellyExcited). Colours come from --jl/--jm/--jd/--jg/
// --jrim/--jeye, set per palette in styles.css, so the mascot follows the active theme.
// Silhouette: superellipse (n: 2 = ellipse) with a wider base (w), a lean and wobbly lobes (a, ph).
// The base sits on y=492 in every mood so swapping moods reads as one jelly changing shape.
// Eyes: ex/ey = offset from the body centre, er = dot radius, dot/arc = which eye style shows,
// bend = arc curve (up < 0 < down), shine = highlight on the dots, z = sleepy "z"s.
var JELLY_MOODS = {
  idle:   { rx: 228, ry: 218, n: 2.7, w: 0.07, lean: 0,    a: 0,     ph: 0, ex: 62, ey: 26, er: 30, cx: 0, dot: 1, arc: 0, bend: 0,   shine: 1, z: 0 },
  hello:  { rx: 222, ry: 226, n: 2.7, w: 0.07, lean: 0.55, a: 0,     ph: 0, ex: 63, ey: 14, er: 30, cx: 8, dot: 1, arc: 0, bend: 0,   shine: 1, z: 0 },
  happy:  { rx: 242, ry: 192, n: 2.5, w: 0.1,  lean: 0,    a: 0,     ph: 0, ex: 70, ey: 24, er: 26, cx: 0, dot: 0, arc: 1, bend: -36, shine: 1, z: 0 },
  cheer:  { rx: 204, ry: 238, n: 2.7, w: -0.1, lean: 0,    a: 0,     ph: 0, ex: 62, ey: 2,  er: 38, cx: 0, dot: 1, arc: 0, bend: 0,   shine: 1, z: 0 },
  sleepy: { rx: 236, ry: 162, n: 2.4, w: 0.15, lean: 0,    a: 0,     ph: 0, ex: 72, ey: 16, er: 26, cx: 0, dot: 0, arc: 1, bend: 26,  shine: 1, z: 1 },
  oops:   { rx: 244, ry: 196, n: 2.5, w: 0.1,  lean: -0.3, a: 0.035, ph: 1, ex: 84, ey: 52, er: 20, cx: 0, dot: 1, arc: 0, bend: 0,   shine: 0, z: 0 }
};
var JELLY_KEYS = Object.keys(JELLY_MOODS.idle);
function jellyLerp(A, B, t) {
  var o = {};
  JELLY_KEYS.forEach(function (k) { o[k] = A[k] + (B[k] - A[k]) * t; });
  return o;
}
function jellyPathOf(S) {
  var cy = 492 - S.ry, pts = [];
  for (var i = 0; i < 120; i++) {
    var t = i / 120 * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
    var x = S.rx * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), 2 / S.n);
    var y = S.ry * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), 2 / S.n);
    x *= 1 + S.a * Math.sin(3 * t + S.ph);
    y *= 1 + S.a * 0.6 * Math.sin(2 * t + S.ph);
    x *= 1 + S.w * (y / S.ry + 1) / 2;
    x += S.lean * (-y / S.ry) * 40;
    pts.push((256 + x).toFixed(1) + ',' + (cy + y).toFixed(1));
  }
  return 'M' + pts.join('L') + 'Z';
}
var JELLY_PATHS = {};
function jellyPath(mood) { return JELLY_PATHS[mood] || (JELLY_PATHS[mood] = jellyPathOf(JELLY_MOODS[mood])); }

// One renderer for static moods and animated frames: S = mood vector, id = unique gradient/clip prefix.
function jellyFrom(S, size, id, d, wobble) {
  var h = React.createElement, ry = S.ry, cy = 492 - ry, eyeCy = cy + S.ey;
  var sc = function (k, v) { var o = {}; o[k] = v; return { style: o }; };
  var stop = function (off, v, op) { return h('stop', Object.assign({ offset: off, stopOpacity: op }, sc('stopColor', 'var(' + v + ')'))); };
  var eyes = [];
  [-1, 1].forEach(function (side) {
    var x = 256 + S.cx + side * S.ex;
    if (S.dot > 0) {
      eyes.push(h('circle', Object.assign({ key: 'e' + side, cx: x, cy: eyeCy, r: S.er, opacity: S.dot }, sc('fill', 'var(--jeye)'))));
      if (S.shine > 0) eyes.push(h('circle', { key: 's' + side, cx: x + S.er * 0.32, cy: eyeCy - S.er * 0.34, r: S.er * 0.28, fill: '#fff', opacity: 0.92 * S.shine * S.dot }));
    }
    if (S.arc > 0) {
      eyes.push(h('path', Object.assign({ key: 'a' + side, d: 'M' + (x - 30) + ' ' + eyeCy + ' Q' + x + ' ' + (eyeCy + S.bend) + ' ' + (x + 30) + ' ' + eyeCy, fill: 'none', strokeWidth: 14, strokeLinecap: 'round', opacity: S.arc }, sc('stroke', 'var(--jeye)'))));
    }
  });
  if (S.z > 0) {
    eyes.push(h('text', Object.assign({ key: 'z1', x: 404, y: 180, fontSize: 64, fontWeight: 700, opacity: 0.85 * S.z, fontFamily: 'sans-serif' }, sc('fill', 'var(--jrim)')), 'z'));
    eyes.push(h('text', Object.assign({ key: 'z2', x: 440, y: 120, fontSize: 44, fontWeight: 700, opacity: 0.6 * S.z, fontFamily: 'sans-serif' }, sc('fill', 'var(--jrim)')), 'z'));
  }
  return h('svg', { className: 'jelly' + (wobble ? ' jelly-wob' : ''), viewBox: '0 0 512 512', width: size, height: size, 'aria-hidden': 'true', focusable: 'false' },
    h('defs', null,
      h('radialGradient', { id: id + 'b', cx: 0.5, cy: 0.4, r: 0.7 }, stop(0, '--jl'), stop(0.65, '--jm'), stop(1, '--jd')),
      h('radialGradient', { id: id + 'g', cx: 0.5, cy: 1.05, r: 0.7 }, stop(0, '--jg', 0.85), stop(1, '--jg', 0)),
      h('clipPath', { id: id + 'c' }, h('path', { d: d }))),
    h('path', { d: d, fill: 'url(#' + id + 'b)' }),
    h('g', { clipPath: 'url(#' + id + 'c)' },
      h('rect', { x: 0, y: cy + ry * 0.1, width: 512, height: ry * 1.2, fill: 'url(#' + id + 'g)' }),
      h('path', Object.assign({ d: d, fill: 'none', strokeOpacity: 0.7, strokeWidth: 10 }, sc('stroke', 'var(--jrim)'))),
      h('ellipse', { cx: 176 + Math.max(S.lean, 0) * 55, cy: cy - ry * 0.6, rx: 92, ry: 34, fill: '#fff', opacity: 0.8, transform: 'rotate(-22 176 ' + (cy - ry * 0.6) + ')' }),
      h('circle', { cx: 256 + S.rx * 0.5, cy: cy - ry * 0.7, r: 14, fill: '#fff', opacity: 0.7 })),
    eyes);
}
function jelly(mood, size, wobble) {
  mood = JELLY_MOODS[mood] ? mood : 'idle';
  return jellyFrom(JELLY_MOODS[mood], size, 'jl-' + mood, jellyPath(mood), wobble);
}

// Excited jelly: loops idle -> squash -> spring up to cheer -> back to idle.
// jellyCycle(t) is pure (t in ms, wraps at JELLY_CYCLE); JellyExcited drives it with rAF.
// Timing (ms) picked in the loop-timing sketch: squash, spring up, hold, bounce back; no rest.
var JELLY_TIMING = { antic: 250, rise: 250, hold: 20, back: 150, bounce: 0.25 };
var JELLY_CYCLE = JELLY_TIMING.antic + JELLY_TIMING.rise + JELLY_TIMING.hold + JELLY_TIMING.back, JELLY_UID = 0;
function jellyEase(u) { return u * u * (3 - 2 * u); }
function jellySpring(u, bounce) { // damped spring 0 -> 1, overshoots by ~bounce
  if (u >= 1) return 1;
  return 1 - Math.exp(-(8 - 2 * bounce) * u) * Math.cos(18 * bounce * u);
}
function jellyCycle(t) {
  var T = JELLY_TIMING, idle = JELLY_MOODS.idle, cheer = JELLY_MOODS.cheer;
  var squash = Object.assign({}, idle, { rx: idle.rx * 1.08, ry: idle.ry * 0.86, ey: idle.ey + 6 });
  if (t < T.antic) return jellyLerp(idle, squash, jellyEase(t / T.antic));
  t -= T.antic;
  if (t < T.rise + T.hold) return jellyLerp(squash, cheer, jellySpring(t / T.rise, T.bounce));
  t -= T.rise + T.hold;
  return jellyLerp(cheer, idle, jellySpring(t / T.back, T.bounce * 0.55));
}
function JellyExcited(props) {
  var _s = React.useState(JELLY_MOODS.cheer), S = _s[0], setS = _s[1];
  var idRef = React.useRef(null);
  if (!idRef.current) idRef.current = 'jl-x' + (++JELLY_UID);
  React.useEffect(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined; // stays on the cheer pose
    var raf, t0 = performance.now();
    (function frame(now) { setS(jellyCycle((now - t0) % JELLY_CYCLE)); raf = requestAnimationFrame(frame); })(t0);
    return function () { cancelAnimationFrame(raf); };
  }, []);
  return jellyFrom(S, props.size, idRef.current, jellyPathOf(S));
}

// ── TTS ──────────────────────────────────────────────────────────────────────
window._ttsRate = 0.85;
function speak(text) {
  if (!window.speechSynthesis) return;
  _scriptRun++; // stops a playing script (speakScript)
  window.speechSynthesis.cancel();
  var doSpeak = function() {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = window._ttsRate || 0.85;
    var vs = window.speechSynthesis.getVoices();
    var ja = vs.find(function(v) { return v.lang && v.lang.startsWith('ja'); });
    if (ja) u.voice = ja;
    window.speechSynthesis.speak(u);
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', doSpeak, {once: true});
  }
}

// speakScript(lines, opts): speak [{ speaker: 'M' | 'F' | 'N', text }] in order, one voice /
// pitch per speaker (assignVoices), long lines cut by chunkSpeech, a short pause after each
// line (opts.pause ms, default 600). opts.onEnd fires after the last line. Returns stop().
// A newer speakScript or speak() call stops this one (the run counter), so cancel()'s error
// event on the old utterance can't start its next line.
var _scriptRun = 0, _scriptUtterances = [];
function speakScript(lines, opts) {
  opts = opts || {};
  var ss = window.speechSynthesis, run = ++_scriptRun, timer = null;
  if (!ss || typeof SpeechSynthesisUtterance === 'undefined') return function () {};
  ss.cancel();
  var cast = assignVoices(ss.getVoices ? ss.getVoices() : []);
  var pause = opts.pause == null ? 600 : opts.pause;
  var queue = [];
  lines.forEach(function (l) {
    chunkSpeech(l.text).forEach(function (c, i, all) { queue.push({ speaker: l.speaker, text: c, pause: i === all.length - 1 ? pause : 0 }); });
  });
  var i = 0;
  var next = function () {
    if (run !== _scriptRun) return;
    if (i >= queue.length) { _scriptUtterances = []; if (opts.onEnd) opts.onEnd(); return; }
    var q = queue[i++], who = cast[q.speaker] || cast.N, u = new SpeechSynthesisUtterance(q.text);
    u.lang = 'ja-JP';
    u.rate = window._ttsRate || 0.85;
    u.pitch = who.pitch;
    if (who.voice) u.voice = who.voice;
    u.onend = u.onerror = function () { if (run === _scriptRun) timer = setTimeout(next, q.pause); };
    _scriptUtterances.push(u); // Chrome drops onend for utterances it has garbage-collected
    ss.speak(u);
  };
  next();
  return function stop() {
    clearTimeout(timer);
    if (run === _scriptRun) { _scriptRun++; ss.cancel(); }
  };
}
// jaVoiceStatus(settled): 'ok' (a Japanese voice), 'none', or 'pending' while the voice list is
// still empty (Chrome fills it async). settled = stop waiting: an empty list counts as 'none'.
function jaVoiceStatus(settled) {
  var ss = window.speechSynthesis;
  if (!ss || typeof SpeechSynthesisUtterance === 'undefined') return 'none';
  var vs = ss.getVoices ? ss.getVoices() : [];
  if (!vs.length) return settled ? 'none' : 'pending';
  return vs.some(function (v) { return /^ja/i.test(v.lang || ''); }) ? 'ok' : 'none';
}

// ── Stroke Order ─────────────────────────────────────────────────────────────
// Convert a kanji character to its Unicode hex filename (e.g., 一 → 04e00)
function kanjiToUnicodeHex(char) {
  var code = char.charCodeAt(0);
  return code.toString(16).padStart(5, '0');
}

// Load stroke order SVG for a kanji character (sessionStorage cache + 2 retries)
function loadStrokeOrderSvg(char) {
  var hex = kanjiToUnicodeHex(char);
  var cacheKey = 'svg_' + hex;
  // kanji-svg/strokes.js bundle works on file://; fall through to fetch if absent or missing this char
  if (typeof KANJI_SVG !== 'undefined' && KANJI_SVG[hex]) return Promise.resolve(KANJI_SVG[hex]);
  try {
    var cached = sessionStorage.getItem(cacheKey);
    if (cached) return Promise.resolve(cached);
  } catch(e) {}

  function attempt(n) {
    return fetch('kanji-svg/' + hex + '.svg')
      .then(function(response) {
        if (!response.ok) throw new Error('SVG not found');
        return response.text();
      })
      .then(function(svg) {
        // KanjiVG files open with <?xml?> + a <!DOCTYPE [...]> internal subset; the HTML
        // parser ends the doctype at its first '>' and leaks ']>' as text. Inline only <svg>.
        var i = svg.indexOf('<svg');
        return i > 0 ? svg.slice(i) : svg;
      })
      .then(function(svg) {
        try { sessionStorage.setItem(cacheKey, svg); } catch(e) {}
        return svg;
      })
      .catch(function(err) {
        if (n < 2) {
          var delay = n === 0 ? 1000 : 2000;
          return new Promise(function(resolve, reject) {
            setTimeout(function() { attempt(n + 1).then(resolve, reject); }, delay);
          });
        }
        throw err;
      });
  }
  return attempt(0);
}
