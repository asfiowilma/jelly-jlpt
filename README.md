# jelly-jlpt

A free Japanese course for the JLPT that runs entirely in your browser. It starts from zero with hiragana and katakana and takes you through everything on the N5 list. No install, no account, no server.

**N5 is the only level built so far.** N4, N3, N2 and N1 show as "Coming soon" and will be added one level at a time. There are no dates for them yet.

Live site: [asfiowilma.github.io/jelly-jlpt](https://asfiowilma.github.io/jelly-jlpt)

## What N5 includes

The course is a list of 112 **units**. Every unit is open from the start, so you can skip ahead or go back at any time.

| Unit type | Count | What it is |
|---|---|---|
| Kana | 16 | Hiragana and katakana from scratch, with stroke order and short reading drills |
| Lesson | 74 | About 8 words, 2 kanji and 1 grammar point each, with example sentences |
| Review | 15 | A timed mini-mock over the units since the last review, with reading passages and listening |
| Test prep | 5 | Exam prep and timed drills for each section of the test |
| Mock exam | 2 | Full-length N5 mocks in the official format and timing |

There is also a half-length **diagnostic test** you can take at any time from the Units tab.

What the units cover:

- **Vocabulary**: every word on the community N5 list (767 of 767 entries), taught as 747 entries. Some list entries are alternative spellings of the same word, and those are taught together.
- **Kanji**: all 79 kanji on the N5 list, with readings, meanings and stroke order.
- **Grammar**: 67 grammar points, including all 40 on the Tanos N5 list. The rest are N5 points confirmed by a second source.
- **Example sentences**: 224 sentences. 168 come from [Tatoeba](https://tatoeba.org) with their sentence ids and authors kept; 56 were written for this project.
- **Reading**: 36 short passages in the three N5 reading formats (short texts, mid-length texts, information search).
- **Listening**: 75 listening questions in the four N5 formats, voiced with pre-rendered AI clips (Qwen3-TTS). If a clip can't play, your browser's own Japanese voice reads the rest.
- **Exam-style questions**: the quizzes use the N5 question types (kanji reading, spelling, words in context, paraphrase, grammar gaps, sentence ordering, text grammar).

The level lists come from Tanos (via elzup/jlpt-word-list). The JLPT has published no official vocabulary, kanji or grammar list since 2010, so treat the lists as a guide to what the test asks, not a promise.

## How it works

**Pick a pace.** In Settings you choose how many units a day you want to study. The pace only sets your daily target and the projected finish date. Nothing is locked behind it.

| Pace | Units |
|---|---|
| Casual | 1 every 2 days |
| Standard | 1 a day |
| Intensive | 2 a day |
| Super intensive | 3 a day |

If you add your JLPT exam date, the app tells you whether your pace finishes at least a week before the exam and suggests a pace if it doesn't.

**Pass the quiz to finish a unit.** Each unit ends with a quiz. Kana units need 85% on reading and 80% on meanings; everything else needs 80%. Questions you miss come back later in the same quiz. Some answers are typed rather than picked, so you have to recall them. Lessons and kana units have no timer. Reviews and test-prep drills are timed at real N5 pacing.

**Review with spaced repetition.** Every kana, word, kanji and grammar point you finish becomes a flashcard in the Review tab, scheduled with SM-2 (the algorithm Anki started from). New cards are capped to what your pace introduces each day, so studying ahead doesn't flood your reviews.

**Skip what you already know.** If you've studied before, you have three ways to mark items as known:

- An **I already know this** button on a new flashcard.
- **Quick sort** in Settings: flick through a level's kana, words and kanji at about one a second.
- **Paste or upload a list** in Settings: Anki notes exported as text, a WaniKani or Bunpro list, a CSV. The app picks out the course words and kanji it finds.

A known item skips the new-card queue and comes back once, 3 to 4 weeks later, as a real test. Get it wrong and it goes back into normal review.

**Take the mocks.** The two full mocks and the diagnostic are fixed tests: the same questions in the same order each time. At the end you get an **estimated** score out of 180 checked against the real N5 pass rules (80 total, at least 38 in language knowledge and reading, at least 19 in listening), a breakdown per question type, and an explanation for every miss.

## Limits

- **The mock score is an estimate, not a prediction.** The real JLPT scores with item response theory and equates scores across test sessions, so nobody outside the JLPT can reproduce it. The app scales your share of right answers straight onto the official score ranges. Because the questions only cover what you studied here, the estimate probably runs high.
- **Listening clips are AI voices.** They were rendered with Qwen3-TTS, not recorded by people, so they are cleaner and steadier than real exam audio. Each clip downloads the first time you play it and is then kept for offline use. A clip that isn't cached yet (or fails to load) falls back to your browser's Japanese voice, whose quality depends on your device; some devices have none, and the app then shows the transcript. Practice with the [official JLPT sample audio](https://www.jlpt.jp/e/samples/sampleindex.html) too.
- **No official JLPT material is included.** Every question was written for this project in the official formats. The JLPT site has [official sample questions and workbooks](https://www.jlpt.jp/e/samples/sampleindex.html).
- **Your progress lives in this browser, per site address.** It is stored in IndexedDB (through PouchDB). Clearing site data deletes it. The live GitHub Pages site, a Vercel copy and a local `file://` copy each count as a different site and don't see each other's progress. To move between them, use Settings, then Export, and Import the file on the other one. Or set up sync below.
- **Works offline after one visit.** On a hosted copy, a service worker saves the app on the first load, and it then runs without a network. React and PouchDB ship in the repo (`vendor/`), so nothing loads from a CDN.

## Multi-device sync (optional)

Progress always lives in your browser first. To share it between devices, point the app at a CouchDB database you control. The app syncs both ways in the background and keeps working offline. Your palette, theme, speech speed and sound setting stay per device.

**1. Get a CouchDB.** Either:

- [IBM Cloudant](https://cloud.ibm.com/catalog/services/cloudant) Lite plan: free, CouchDB-compatible, HTTPS included.
- Your own CouchDB 3 (Docker `couchdb:3`, a VPS, a home server). Anything you reach from another device needs HTTPS, so put Caddy or nginx with Let's Encrypt in front. Plain `http://` only works for `http://localhost:5984` on the same machine.

**2. Create a database**, for example `jelly`. The app never creates one for you.

**3. Create a dedicated user for it.** Don't use your admin account. In CouchDB, add a user to `_users`:

```bash
curl -X PUT https://ADMIN:PASS@HOST/_users/org.couchdb.user:jelly-me \
  -H 'Content-Type: application/json' \
  -d '{"name":"jelly-me","password":"a-long-random-password","roles":[],"type":"user"}'
```

Then make that user the only member of the database, so it can reach nothing else:

```bash
curl -X PUT https://ADMIN:PASS@HOST/jelly/_security \
  -H 'Content-Type: application/json' \
  -d '{"admins":{"names":[],"roles":[]},"members":{"names":["jelly-me"],"roles":[]}}'
```

On Cloudant, generate an API key under the database's **Permissions** tab and give it `_reader` and `_writer` on that database only.

**4. Allow the site in CORS.** The browser refuses to talk to your database until it lists the site's origin: scheme and host only, no path (`https://asfiowilma.github.io` for the live site, or your own `https://YOUR_USERNAME.github.io` if you host a copy). Credentials must be on, which means you can't use `*`.

```ini
[chttpd]
enable_cors = true

[cors]
origins = https://asfiowilma.github.io
credentials = true
methods = GET, PUT, POST, HEAD, DELETE
headers = accept, authorization, content-type, origin, referer
```

In Fauxton that's **Configuration → CORS**; in Cloudant, **Account → CORS**.

**5. Connect.** Open Settings (gear icon), then Sync. Paste the full database URL (`https://HOST/jelly`), the username and password, and press **Connect**. The app checks it can read and write the database first and tells you what's wrong if not. If both sides already had progress, they're merged: finished units and settings by latest change, flashcards by latest review. A dot on the gear shows the sync status.

**Remember on this device.** Off by default, so you sign in again each browser session. Turned on, the URL, username and password are saved **in plain text** in this browser's localStorage. Anyone with access to the device or browser profile can read them, and every GitHub Pages site under the same `USERNAME.github.io` shares that storage, so any other project published there could read it. That's why the user above should only be able to reach this one database.

**Disconnect** stops syncing and keeps everything on the device. It never deletes anything on the server.

**Importing a backup while sync is on:** finished units and settings from the file win, but flashcards still follow the most recent review, so a backup can't roll back reviews you did later on another device. Anything not in the file is deleted, and that deletion syncs too.

## Run it locally

Clone the repo and open `index.html` in a browser. There is no build step and nothing to install.

Stroke-order diagrams are loaded with `fetch`, which most browsers block on `file://` pages. If the diagrams don't show, serve the folder instead, for example:

```bash
python -m http.server
```

and open `http://localhost:8000`.

To run the tests (Node, no dependencies):

```bash
node .claude/hooks/run-tests.js
```

Or open `tests.html` in a browser. See `CLAUDE.md` for how the code and content are organised.

## Install and deploy (PWA)

The app is a static folder: no build, no server code. It ships a web app manifest and a service worker (`sw.js`) that precaches every file on the first visit, so after one online load it works fully offline and can be installed to the home screen. The worker only registers on `http(s)`, not `file://`.

Every path is relative, so the same files work at a host root and under a subpath.

- **GitHub Pages** (served at `https://<user>.github.io/jelly-jlpt/`): publish the repo root from the Pages settings. Nothing else to configure.
- **Vercel** (root of a domain or custom subdomain): import the repo, framework "Other", no build command, output directory `.`. `vercel.json` makes sure `sw.js` and the manifest are never cached by the CDN, so updates reach users.

Progress is stored in the browser, per origin. The github.io and Vercel copies do not share progress, so pick one canonical host, tell learners to use it, and move progress between hosts with Settings -> export / import.

After adding or changing any shipped file (script, style, data, icon, sound), regenerate the worker or offline users keep the old copy, and the test suite fails until you do:

```bash
node tools/build-sw.js
```

### Content Security Policy

`index.html` sets a CSP in a `<meta>` tag. If you host a copy, keep it unless you change what the app loads:

| Directive | Allows | Why |
|---|---|---|
| `default-src 'self'` | files from the same site only | no CDN, no third-party scripts |
| `script-src` / `style-src 'self' 'unsafe-inline'` | local files and inline code | React's inline styles and the classic-script setup |
| `img-src 'self' data:` | local images and `data:` URLs | icons and stroke-order SVGs |
| `media-src 'self' blob:` | local audio and `blob:` URLs | listening clips are fetched whole and played from a blob URL, so the service worker can cache them |
| `connect-src 'self' https: http://localhost:5984 http://127.0.0.1:5984` | any HTTPS host, plus a local CouchDB | sync talks to whatever CouchDB you enter |

Icons are rendered once from `icons/icon.svg` with `node tools/build-icons.js` (needs Edge or Chrome installed).

## Credits and licenses

| Source | Used for | License |
|---|---|---|
| [Tanos](https://www.tanos.co.uk/jlpt/) (Jonathan Waller) | N5 vocabulary, kanji and grammar lists | [CC BY](https://creativecommons.org/licenses/by/) |
| [elzup/jlpt-word-list](https://github.com/elzup/jlpt-word-list) (Jamie Sinclair and elzup) | CSV copy of the Tanos word lists | [MIT](https://github.com/elzup/jlpt-word-list/blob/master/LICENSE) |
| [Tatoeba](https://tatoeba.org) | example sentences and translations; every sentence keeps its id and author, listed in Settings under Sentence credits | [CC BY 2.0 FR](https://creativecommons.org/licenses/by/2.0/fr/) |
| [EDRDG](https://www.edrdg.org/) (JMdict, KANJIDIC) | checking readings, meanings and stroke counts while writing the course; no files ship | [CC BY-SA 4.0](https://www.edrdg.org/edrdg/licence.html) |
| [KanjiVG](https://kanjivg.tagaini.net/) (Ulrich Apel) | stroke-order diagrams in `kanji-svg/`, bundled into `kanji-svg/strokes.js` | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| [Qwen3-TTS](https://github.com/QwenLM/Qwen3-TTS) (Alibaba Qwen team) | the model that rendered the listening clips in `audio/` | [Apache 2.0](https://github.com/QwenLM/Qwen3-TTS/blob/main/LICENSE) |
| [Kenney](https://kenney.nl/assets) Music Jingles and Interface Sounds | sound effects in `sfx/` (see `sfx/LICENSE-kenney.txt`) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| [DiceBear](https://www.dicebear.com/) identicon | achievement stamp icons (`data/stamp-icons.js`) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) |
| [React and ReactDOM](https://react.dev/) 18.2.0 | UI, vendored in `vendor/` | MIT (`vendor/LICENSE-react.txt`) |
| [PouchDB](https://pouchdb.com/) 9.0.0 | local storage and sync, vendored in `vendor/` | Apache 2.0 (`vendor/LICENSE-pouchdb.txt`) |
| [alanfwilliams/jlpt](https://github.com/alanfwilliams/jlpt) | the original project this one was forked from | MIT (stated in its README) |

The same list is in the app under Settings, followed by the per-sentence Tatoeba credits. Glosses, notes, grammar explanations, reading passages, listening scripts and exam questions are written for this project. No JMdict or KANJIDIC data ships with the app.

jelly-jlpt began as a fork of alanfwilliams/jlpt. The course content and most of the app have since been rebuilt, and the project no longer tracks upstream.

The app code is under the MIT license (see [`LICENSE`](LICENSE)). The third-party files in the table keep their own licenses and are not covered by it: `kanji-svg/` including the derived bundle `kanji-svg/strokes.js` (CC BY-SA 3.0), the Tatoeba sentences in `data/` (CC BY 2.0 FR), the Tanos-derived level lists (CC BY), `sfx/` (CC0), the DiceBear glyphs (CC0) and `vendor/` (MIT and Apache 2.0).
