# Stroke-order SVGs: KanjiVG

The `.svg` files in this folder come unchanged from
[KanjiVG](https://kanjivg.tagaini.net/) (<https://github.com/KanjiVG/kanjivg>, `kanji/<codepoint>.svg`).

KanjiVG is copyright © 2009-2026 Ulrich Apel and released under the
[Creative Commons Attribution-Share Alike 3.0](https://creativecommons.org/licenses/by-sa/3.0/) licence.
Each file keeps its original copyright and licence comment.

`strokes.js` is a derived bundle of these SVGs (built by `tools/build-strokes.js`
so stroke order works from `file://`). It is a derivative of KanjiVG and is
licensed under the same CC BY-SA 3.0 licence.

Share-alike applies to the SVG files and `strokes.js` in this folder only. The rest of this
repository is not a derivative of KanjiVG and keeps its own licence.

Files are named by Unicode codepoint, lowercase hex padded to 5 digits
(一 U+4E00 → `04e00.svg`), the same as KanjiVG. To add characters, copy the
base file (not the `-Kaisho` etc. variants) from KanjiVG's `kanji/` folder.
