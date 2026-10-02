"use strict";

// ── TypingTip ────────────────────────────────────────────────────────────────
var TYPING_NOTES = {
  3: "⚠ Exceptions: し = 'shi' (not 'si')  ·  す = 'su'",
  4: "⚠ Exceptions: ち = 'chi' (not 'ti')  ·  つ = 'tsu' (not 'tu')",
  8: "⚠ Small forms ゃゅょ appear only inside combinations — never type them alone",
  10: "⚠ ん before a vowel: type 'nn' to prevent it merging (e.g. 'kinen' = きねん, 'kinnen' stays as きんねん)",
  11: "Voiced sounds are automatic: just type 'ga' → が, 'za' → ざ. No need to type the dakuten (゛) yourself.",
  12: "Semi-voiced: 'pa' → ぱ. Double consonant っ: type the consonant twice — 'tta' → った  ·  'kka' → っか",
  13: "Combos: consonant + y + vowel — 'kya' → きゃ  ·  'sha' → しゃ  ·  'cha' → ちゃ  ·  'ja' → じゃ",
  14: "っ in words: just double the next consonant — 'kitte' → きって  ·  'zasshi' → ざっし",
  15: "Same romaji as hiragana — just switch your IME to katakana mode (usually F7 key or toggle button)."
};
function TypingTip(_ref8) {
  var lesson = _ref8.lesson;
  if (!lesson.chars || lesson.chars.length === 0) return null;
  var note = TYPING_NOTES[lesson.day];
  var examples = lesson.chars.slice(0, 6).map(function (c) {
    return "'".concat(c[1], "' \u2192 ").concat(c[0]);
  }).join('   ');
  return /*#__PURE__*/React.createElement("div", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, "\u2328 Typing on a Computer"), /*#__PURE__*/React.createElement("div", {
    className: "typing-tip-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "typing-examples"
  }, examples), note && /*#__PURE__*/React.createElement("div", {
    className: "typing-note"
  }, note), /*#__PURE__*/React.createElement("div", {
    className: "typing-hint"
  }, "Enable a Japanese IME first \u2014 Windows: Win+Space \xB7 Mac: Ctrl+Space (or globe key). Then type romaji and it converts automatically.")));
}
