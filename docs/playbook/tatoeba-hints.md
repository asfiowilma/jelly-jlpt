# Tatoeba match hints

Load when: picking Tatoeba sentences for a grammar point. Always hand-check every pick. Source: [archive/level-playbook-full.md](archive/level-playbook-full.md) §3.

## False matches seen on N5

| Looking for | Matched by mistake |
|---|---|
| ので | の + です |
| いる "exist" | いる "need" (要る) |
| 〜たい | みたい |
| でしょう | だろう |
| 前に "before" | 前に "in front of" |
| から "because" | から "from" |
| まで | までに |
| てもいい | とても / どうでもいい |
| ましょう | どうしましょう |
| 〜ている | で + いる |
| よ | あばよ |
| sentence-final の | — |

## `[N4+]` Regex hints for N4 points

Each row names what to exclude or label. Always hand-check.

| Looking for | Exclude or label |
|---|---|
| ～し (reasons) | し inside words (話し, 少し, 美しい), しか, して, しまう, しよう |
| そうだ hearsay | appearance そう on a stem (おいしそう), そうですね / そうですか, そう思う |
| そうだ appearance | hearsay (plain + そう), the adverb そう (そうしましょう) |
| なら | ならう, ならぶ, ならない (なければならない), 奈良 |
| たがる | がる on adjectives (嫌がる, 怖がる), 下がる, 上がる, 曲がる |
| しか～ない | しかし, 確か; ない must close the same clause |
| ておく | 置く as a full verb; label the とく contraction |
| volitional よう / おう | ようだ / ように / ような, 用 / 曜, 思う / 言う |
| てあげる / てくれる / てもらう | 上げる, 暮れる, あげる / もらう without て |
| といいです | といいます / という (a name or quote) |
| させる | lexical 見せる, 乗せる, 知らせる, 聞かせる |
| ば-form | 例えば, そういえば, と言えば, なければならない, しばらく, ばかり |
| ても | てもいい (N5), とても, いつでも / 誰でも, sentence-initial でも |
| たら | たらどう, 〜たらしい, あたらしい |
| みたい | 〜たい, 見たい |
| dict + と | と "and" / "with", と思う / と言う, という |
| ながら | 長らく, sentence-initial ながら; require a ます-stem |
| やすい / にくい | 安い, 憎い; require a ます-stem |
| passive られる / れる | potential (え-row + る), lexical れる (疲れる, 忘れる, 生まれる); る-verbs are ambiguous: tag by hand |
| てある | ある as a full verb, written copula である |
| のに | the purpose のに (作るのに三時間), の + に after a nominaliser |
| させられる | される as the passive of する (勉強される), 見せられる |
| ところだ | ところ "place", ところで, 〜たところ |
| potential | 寝る, 出る, 見る (ichidan verbs that look like え-row potentials); できる only under ことができる |
| imperative | 行け inside 行けば / 行ける |
| な prohibitive | な-adjective な, sentence-final softener な (高いな) |
| ございます | おはようございます / ありがとうございます |
| お～ください | お + noun + ください (お茶ください); require a ます-stem |
