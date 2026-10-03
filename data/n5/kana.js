"use strict";

// Kana (ticket 34, map Q27): hiragana + katakana, id c:<kana>, answer = romaji.
// romaji = modified Hepburn (the system in Genki, Minna no Nihongo and most
// textbooks); answers = romaji first, then the other spellings people type
// (Kunrei / Nihon-shiki si, ti, tu, hu, zi; wo for を; nn for ん).
// Kana ↔ romaji is a fixed standard, so items are verified from two references:
// the Unicode kana blocks (U+3040, U+30A0) and the Hepburn table.
// Katakana = the hiragana row shifted by 0x60, so both scripts share one table.
// `extended` = katakana-only combos that N5 words need: パーティー, フィルム, フォーク.
(function () {
  // [group, kana, romaji answers ('|'-separated, Hepburn first), ...]
  var ROWS = [
    ['a-row', 'あ', 'a', 'い', 'i', 'う', 'u', 'え', 'e', 'お', 'o'],
    ['ka-row', 'か', 'ka', 'き', 'ki', 'く', 'ku', 'け', 'ke', 'こ', 'ko'],
    ['sa-row', 'さ', 'sa', 'し', 'shi|si', 'す', 'su', 'せ', 'se', 'そ', 'so'],
    ['ta-row', 'た', 'ta', 'ち', 'chi|ti', 'つ', 'tsu|tu', 'て', 'te', 'と', 'to'],
    ['na-row', 'な', 'na', 'に', 'ni', 'ぬ', 'nu', 'ね', 'ne', 'の', 'no'],
    ['ha-row', 'は', 'ha', 'ひ', 'hi', 'ふ', 'fu|hu', 'へ', 'he', 'ほ', 'ho'],
    ['ma-row', 'ま', 'ma', 'み', 'mi', 'む', 'mu', 'め', 'me', 'も', 'mo'],
    ['ya-row', 'や', 'ya', 'ゆ', 'yu', 'よ', 'yo'],
    ['ra-row', 'ら', 'ra', 'り', 'ri', 'る', 'ru', 'れ', 're', 'ろ', 'ro'],
    ['wa-row', 'わ', 'wa', 'を', 'o|wo', 'ん', 'n|nn'],
    ['dakuten', 'が', 'ga', 'ぎ', 'gi', 'ぐ', 'gu', 'げ', 'ge', 'ご', 'go',
      'ざ', 'za', 'じ', 'ji|zi', 'ず', 'zu', 'ぜ', 'ze', 'ぞ', 'zo',
      'だ', 'da', 'ぢ', 'ji|di', 'づ', 'zu|du', 'で', 'de', 'ど', 'do',
      'ば', 'ba', 'び', 'bi', 'ぶ', 'bu', 'べ', 'be', 'ぼ', 'bo'],
    ['handakuten', 'ぱ', 'pa', 'ぴ', 'pi', 'ぷ', 'pu', 'ぺ', 'pe', 'ぽ', 'po'],
    ['youon', 'きゃ', 'kya', 'きゅ', 'kyu', 'きょ', 'kyo', 'ぎゃ', 'gya', 'ぎゅ', 'gyu', 'ぎょ', 'gyo',
      'しゃ', 'sha|sya', 'しゅ', 'shu|syu', 'しょ', 'sho|syo', 'じゃ', 'ja|zya|jya', 'じゅ', 'ju|zyu|jyu', 'じょ', 'jo|zyo|jyo',
      'ちゃ', 'cha|tya|cya', 'ちゅ', 'chu|tyu|cyu', 'ちょ', 'cho|tyo|cyo', 'にゃ', 'nya', 'にゅ', 'nyu', 'にょ', 'nyo',
      'ひゃ', 'hya', 'ひゅ', 'hyu', 'ひょ', 'hyo', 'びゃ', 'bya', 'びゅ', 'byu', 'びょ', 'byo',
      'ぴゃ', 'pya', 'ぴゅ', 'pyu', 'ぴょ', 'pyo', 'みゃ', 'mya', 'みゅ', 'myu', 'みょ', 'myo',
      'りゃ', 'rya', 'りゅ', 'ryu', 'りょ', 'ryo']
  ];
  var EXTENDED = ['ティ', 'ti', 'フィ', 'fi', 'フォ', 'fo'];
  var NOTES = {
    'を': 'Read "o", same as お. Used only as the object particle.',
    'ん': 'The only kana with no vowel: just n. It also sounds like m before ま/ば/ぱ (さんぽ).',
    'ぢ': 'Sounds like じ. Rare: only in a few words (はなぢ, ちぢむ).',
    'づ': 'Sounds like ず. Rare: only in a few words (つづく, みかづき).',
    'は': 'Read "wa" when it is the topic particle (わたしは).',
    'へ': 'Read "e" when it is the direction particle (がっこうへ).',
    'ヲ': 'Read "o". Almost never used: the particle is written を.',
    'ン': 'The only kana with no vowel: just n.',
    'ヂ': 'Sounds like ジ. Very rare.',
    'ヅ': 'Sounds like ズ. Very rare.'
  };
  var toKata = function (s) { return s.replace(/[ぁ-ゖ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); }); };
  var items = [];
  var add = function (ch, answers, script, group) {
    var a = answers.split('|');
    var it = { id: 'c:' + ch, kind: 'kana', level: 'N5', char: ch, romaji: a[0], answers: a, script: script, group: group,
      sources: ['unicode', 'hepburn'], verified: true };
    if (NOTES[ch]) it.notes = NOTES[ch];
    items.push(it);
  };
  ['hiragana', 'katakana'].forEach(function (script) {
    ROWS.forEach(function (row) {
      for (var i = 1; i < row.length; i += 2) add(script === 'hiragana' ? row[i] : toKata(row[i]), row[i + 1], script, row[0]);
    });
  });
  for (var i = 0; i < EXTENDED.length; i += 2) add(EXTENDED[i], EXTENDED[i + 1], 'katakana', 'extended');
  CATALOG.add(items);
})();
