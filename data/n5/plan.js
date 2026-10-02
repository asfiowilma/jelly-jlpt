"use strict";

// N5 plan: ordered units. Ids are opaque and never reused (spec §4, Q21).
// ponytail: 3-lesson scaffold + 1 review; the real N5 plan comes with tickets 12-14.
PLAN.push({ level: 'N5', units: [
  { id: 'n5.u001', level: 'N5', kind: 'lesson', title: 'Family',
    vocab: ['v:家族|かぞく', 'v:両親|りょうしん', 'v:兄弟|きょうだい', 'v:妹|いもうと',
            'v:お父さん|おとうさん', 'v:お母さん|おかあさん', 'v:お兄さん|おにいさん', 'v:お姉さん|おねえさん'],
    kanji: ['k:男', 'k:女'], grammar: ['g:wa-desu'] },
  { id: 'n5.u002', level: 'N5', kind: 'lesson', title: 'People & the face',
    vocab: ['v:人|ひと', 'v:子供|こども', 'v:大人|おとな', 'v:友達|ともだち',
            'v:頭|あたま', 'v:顔|かお', 'v:目|め', 'v:口|くち'],
    kanji: ['k:人', 'k:大'], grammar: ['g:mo'] },
  { id: 'n5.u003', level: 'N5', kind: 'lesson', title: 'Food & places',
    vocab: ['v:果物|くだもの', 'v:卵|たまご', 'v:とり肉|とりにく', 'v:豚肉|ぶたにく',
            'v:牛乳|ぎゅうにゅう', 'v:お酒|おさけ', 'v:銀行|ぎんこう', 'v:図書館|としょかん'],
    kanji: ['k:水', 'k:円'], grammar: ['g:ni-ikimasu'] },
  { id: 'n5.u004', level: 'N5', kind: 'review', title: 'Review: units 1–3' }
] });
