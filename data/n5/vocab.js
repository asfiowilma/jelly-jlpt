"use strict";

// N5 vocabulary. ponytail: scaffolding stub (ticket 32) — rows salvaged from
// legacy days 85/86/89/92/102/104/106, kept only where the word is on the
// Tanos N5 list (word/reading from Tanos, gloss from legacy). Real authoring: ticket 12.
CATALOG.add([
  // Family (legacy days 85-86)
  { id: 'v:家族|かぞく', kind: 'vocab', level: 'N5', word: '家族', reading: 'かぞく', gloss: ['family'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:両親|りょうしん', kind: 'vocab', level: 'N5', word: '両親', reading: 'りょうしん', gloss: ['both parents'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:兄弟|きょうだい', kind: 'vocab', level: 'N5', word: '兄弟', reading: 'きょうだい', gloss: ['siblings'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:妹|いもうと', kind: 'vocab', level: 'N5', word: '妹', reading: 'いもうと', gloss: ['my younger sister'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:お父さん|おとうさん', kind: 'vocab', level: 'N5', word: 'お父さん', reading: 'おとうさん', gloss: ["someone's father"], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:お母さん|おかあさん', kind: 'vocab', level: 'N5', word: 'お母さん', reading: 'おかあさん', gloss: ["someone's mother"], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:お兄さん|おにいさん', kind: 'vocab', level: 'N5', word: 'お兄さん', reading: 'おにいさん', gloss: ["someone's older brother"], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:お姉さん|おねえさん', kind: 'vocab', level: 'N5', word: 'お姉さん', reading: 'おねえさん', gloss: ["someone's older sister"], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  // People & the face (legacy days 89, 92)
  { id: 'v:人|ひと', kind: 'vocab', level: 'N5', word: '人', reading: 'ひと', gloss: ['person'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:子供|こども', kind: 'vocab', level: 'N5', word: '子供', reading: 'こども', gloss: ['child'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:大人|おとな', kind: 'vocab', level: 'N5', word: '大人', reading: 'おとな', gloss: ['adult'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:友達|ともだち', kind: 'vocab', level: 'N5', word: '友達', reading: 'ともだち', gloss: ['friend'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:頭|あたま', kind: 'vocab', level: 'N5', word: '頭', reading: 'あたま', gloss: ['head'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:顔|かお', kind: 'vocab', level: 'N5', word: '顔', reading: 'かお', gloss: ['face'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:目|め', kind: 'vocab', level: 'N5', word: '目', reading: 'め', gloss: ['eye'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:口|くち', kind: 'vocab', level: 'N5', word: '口', reading: 'くち', gloss: ['mouth'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  // Food & places (legacy days 102, 104, 106)
  { id: 'v:果物|くだもの', kind: 'vocab', level: 'N5', word: '果物', reading: 'くだもの', gloss: ['fruit'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:卵|たまご', kind: 'vocab', level: 'N5', word: '卵', reading: 'たまご', gloss: ['egg'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:とり肉|とりにく', kind: 'vocab', level: 'N5', word: 'とり肉', reading: 'とりにく', gloss: ['chicken'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:豚肉|ぶたにく', kind: 'vocab', level: 'N5', word: '豚肉', reading: 'ぶたにく', gloss: ['pork'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:牛乳|ぎゅうにゅう', kind: 'vocab', level: 'N5', word: '牛乳', reading: 'ぎゅうにゅう', gloss: ['milk'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:お酒|おさけ', kind: 'vocab', level: 'N5', word: 'お酒', reading: 'おさけ', gloss: ['alcohol'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:銀行|ぎんこう', kind: 'vocab', level: 'N5', word: '銀行', reading: 'ぎんこう', gloss: ['bank'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false },
  { id: 'v:図書館|としょかん', kind: 'vocab', level: 'N5', word: '図書館', reading: 'としょかん', gloss: ['library'], pos: 'noun', sources: ['legacy', 'tanos'], verified: false }
]);
