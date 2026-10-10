#!/usr/bin/env node
// Build the compact committed reference fixture tools/ref/<lvl>.json from the
// dev-only research lists (.scratch/content-audit/research/data, gitignored).
//
//   node tools/build-ref.js <research/data dir> [N5 ...]     (default: N5)
//
// Output: { vocab: ["word|reading" | ["alt|alt", ...]], kanji: ["日", ...], grammar: ["です", ...] }
// A vocab entry with spelling/reading variants (Tanos "九|きゅう / く", elzup "いい; よい",
// "勉強|べんきょう (する)") becomes an array of word|reading alternatives; any one
// of them counts as that entry. Only list membership is kept: no meanings, no KANJIDIC fields.
// A word already on a lower level's ref (tools/ref/n5.json when building N4) is left out:
// the lowest level wins (docs/level-playbook.md §1), so build the levels from N5 up.
// Exports vocabEntry (tools/author-vocab.js maps research rows to ref keys with it).
"use strict";
const fs = require("fs");
const path = require("path");

const ORDER = ["N5", "N4", "N3", "N2", "N1"];

function parts(s) {
  return s.replace(/\([^)]*\)/g, "").split(/[\/;、]|\s+/).map(function (x) { return x.replace(/^[～〜]+/, "").trim(); }).filter(Boolean);
}
// Known list errors, keyed by the research row "word|reading" (ticket 12). Each
// value replaces the row's word and/or reading before parsing. Credit stays Tanos.
const VOCAB_FIXES = {
  "明い|あかるい": { word: "明るい" },                         // Tanos typo
  "伯父/叔父|おじいさん": { word: "おじいさん" },               // grandfather, misfiled under 伯父/叔父 (= uncle)
  "伯父/叔父|おじさん": { word: "伯父さん/叔父さん" },           // 伯父 alone reads おじ
  "誰|だれか": { word: "誰か" },                               // reading has か, word dropped it
  "散歩|さんぽする": { reading: "さんぽ" },                     // する belongs to the verb, not the reading
  "掃除|そうじする": { reading: "そうじ" },
  "勉強|べんきょうする": { reading: "べんきょう" },
  "練習|れんしゅうする": { reading: "れんしゅう" },
  "ラジオカセ|ラジオカセ": { word: "ラジカセ", reading: "ラジカセ" }, // elzup truncation of ラジオカセット
  "お～|お～": { word: "お", reading: "お" },                   // prefix: ～ is not part of the word
  "何～|なん～": { word: "何", reading: "なん" },
  "終る|おわる": { word: "終わる/終る" },                     // Tanos keeps the old okurigana; 終わる is standard (Jisho lists it first)
  "曲る|まがる": { word: "曲がる/曲る" },
  // N4
  "明日|あす・あした": { reading: "あす/あした" },             // ・ separates two readings (the row then falls to N5, which teaches 明日 with alsoRead あす)
  "お・金持ち|かねもち/おかねもち": { word: "金持ち/お金持ち" }, // ・ marks the optional お prefix
  "ごらんになる|": { reading: "ごらんになる" },                 // elzup row with no reading
  "かまう|": { reading: "かまう" },
  "御～|ご～": { word: "ご", reading: "ご" },                   // prefix, written in kana like お (御 is above N4)
  "けんか・する|けんか・する": { word: "けんか", reading: "けんか" }, // ・する marks a する noun, like 遠慮|えんりょ・する: list the noun
  "チェック・する|チェック・する": { word: "チェック", reading: "チェック" },
  "あいさつする|挨拶": { word: "挨拶", reading: "あいさつ" },   // elzup swapped the columns and glued する on
  "堅/硬/固い|かたい": { word: "堅い/硬い/固い" },               // the okurigana belongs to each spelling
  // Tanos old okurigana: the standard spelling (Jisho lists it first) goes first, like 終わる/終る
  "上る|あがる": { word: "上がる/上る" },                       // 上る alone is normally のぼる
  "集る|あつまる": { word: "集まる/集る" },
  "起す|おこす": { word: "起こす/起す" },
  "落る|おちる": { word: "落ちる/落る" },
  "落す|おとす": { word: "落とす/落す" },
  "決る|きまる": { word: "決まる/決る" },
  "下る|さがる": { word: "下がる/下る" },                       // 下る alone is normally くだる
  "楽む|たのしむ": { word: "楽しむ" },                          // typo: 楽む is no spelling at all
  // N4 r1 vocab T4: Tanos spellings that are not the standard written form (JMdict's first form)
  "真中|まんなか": { word: "真ん中" },                          // JMdict: 真ん中 is the only まんなか form; 真中 alone is まなか
  "答|こたえ": { word: "答え" },                                // JMdict lists 答え first; 答 is a rarer form (altSpell)
};
// Rows left out of the ref (N4 list), keyed like VOCAB_FIXES: elzup rows that repeat a Tanos row
// once its variants are read, and grammar patterns filed as words (they are on the grammar list).
const VOCAB_SKIP = {
  "明日|あす": "N5 teaches 明日|あした with alsoRead あす",
  "お金持ち|かねもち; おかねもち": "repeats お・金持ち",
  "レポート; リポート|レポート; リポート": "repeats レポート/リポート",
  "けれど; けれども|けれど; けれども": "repeats けれど/けれども",
  "コンピュータ; コンピューター|コンピュータ; コンピューター": "repeats コンピューター (コンピュータ is a spelling variant, not a second word)",
  "パート (タイム)|パート (タイム)": "repeats パート",
  "回る、回す|まわる、まわす": "repeats 回る; 回す is a different word and not on the Tanos list",
  "ごらんになる|": "repeats ごらんになる",
  "故障|こしょうする": "repeats 故障|こしょう・する",
  "遠慮|えんりょする": "repeats 遠慮|えんりょ・する",
  "生産|せいさんする": "repeats 生産|せいさん・する",
  "生活|せいかつする": "repeats 生活|せいかつ・する",
  "入学|にゅうがくする": "repeats 入学|にゅうがく・する",
  "入院|にゅういんする": "repeats 入院|にゅういん・する",
  "退院|たいいんする": "repeats 退院|たいいん・する",
  "拝見|はいけんする": "repeats 拝見|はいけん・する",
  "けんかする|けんかする": "repeats けんか・する",
  "チェックする|チェックする": "repeats チェック・する",
  "～月|～つき": "repeats 月|つき",
  "～ちゃん|～ちゃん": "repeats ちゃん",
  "～続ける|～つづける": "repeats 続ける",
  "～始める|～はじめる": "repeats 始める",
  "～君|～くん": "repeats 君|くん",
  "上がる|あがる": "repeats 上る (fixed to 上がる/上る)",
  "集まる|あつまる": "repeats 集る (fixed to 集まる/集る)",
  "起こす|おこす": "repeats 起す (fixed to 起こす/起す)",
  "決まる|きまる": "repeats 決る (fixed to 決まる/決る)",
  "いくら～ても|いくら～ても": "grammar pattern (～ても)",
  "～(て) しまう|～(て) しまう": "grammar pattern (～てしまう)",
  "～(に) よると|～(に) よると": "grammar pattern (～によると)",
  "～(に) ついて|～(に) ついて": "grammar pattern (～について)",
  // N4 r1 vocab T3: よう "way, manner" only occurs bound in patterns, which the grammar list teaches
  "様|よう": "grammar, not a word card: taught as ～ようだ (g:you-da), ～のような / ～のように (g:no-you-na)",
};
function vocabEntry(e) {
  e = Object.assign({}, e, VOCAB_FIXES[e.word + "|" + e.reading]);
  // する glued onto a noun's reading (Tanos 遠慮 えんりょ・する, elzup 心配 しんぱいする): the verb's, not the word's
  if (/する$/.test(e.reading) && !/する$/.test(e.word)) e.reading = e.reading.replace(/・?する$/, "");
  // elzup swapped the columns on a few rows (うそ|嘘, うれしい|嬉しい): the kana side is the reading
  if (/[一-龯]/.test(e.reading) && /^[ぁ-ゖァ-ヺー]+$/.test(e.word)) e = Object.assign({}, e, { word: e.reading, reading: e.word });
  const ws = parts(e.word), rs = parts(e.reading), alts = [];
  // ponytail: same-count variants pair by index (いい/よい|いい/よい); otherwise every combination.
  if (ws.length === rs.length) ws.forEach(function (w, i) { alts.push(w + "|" + rs[i]); });
  else ws.forEach(function (w) { rs.forEach(function (r) { alts.push(w + "|" + r); }); });
  const uniq = Array.from(new Set(alts));
  return uniq.length === 1 ? uniq[0] : uniq;
}

module.exports = { vocabEntry: vocabEntry, VOCAB_SKIP: VOCAB_SKIP };
if (require.main !== module) return;

const [dir, ...levels] = process.argv.slice(2);
if (!dir) { console.error("usage: node tools/build-ref.js <research/data dir> [N5 ...]"); process.exit(2); }

(levels.length ? levels : ["N5"]).forEach(function (lv) {
  const n = lv.toLowerCase();
  const read = function (kind) { return JSON.parse(fs.readFileSync(path.join(dir, kind + "-" + n + ".json"), "utf8")); };
  // keys on the lower levels' refs: those words are taught there, not here
  const lower = new Set();
  ORDER.slice(0, ORDER.indexOf(lv)).forEach(function (l) {
    const f = path.join(__dirname, "ref", l.toLowerCase() + ".json");
    if (fs.existsSync(f)) [].concat.apply([], JSON.parse(fs.readFileSync(f, "utf8")).vocab).forEach(function (k) { lower.add(k); });
  });
  let onLower = 0;
  const ref = {
    vocab: read("vocab").filter(function (e) { return !VOCAB_SKIP[e.word + "|" + e.reading]; }).map(vocabEntry)
      .filter(function (e) { const dup = [].concat(e).some(function (k) { return lower.has(k); }); if (dup) onLower++; return !dup; }),
    kanji: read("kanji").map(function (k) { return k.kanji; }),
    grammar: read("grammar").map(function (g) { return g.name; }),
  };
  if (onLower) console.log(lv + ": " + onLower + " vocab entries left out, already on a lower level");
  const out = path.join(__dirname, "ref", n + ".json");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, "{\n" + ["vocab", "kanji", "grammar"].map(function (k) {
    return '  "' + k + '": [\n    ' + ref[k].map(function (x) { return JSON.stringify(x); }).join(",\n    ") + "\n  ]";
  }).join(",\n") + "\n}\n");
  console.log(out + ": " + ref.vocab.length + " vocab, " + ref.kanji.length + " kanji, " + ref.grammar.length + " grammar");
});
