# 日本語 N5–N1 Course

A free, self-contained interactive Japanese course from zero to JLPT N1 level.
**No install. No account. Just open `index.html` in any browser.**

🔗 **Live:** [alanfwilliams.github.io/jlpt](https://alanfwilliams.github.io/jlpt)

---

## What's inside

| Feature | Details |
|---|---|
| **N5 + N4 + N3 + N2 + N1 curriculum** | Complete N5 (365 days) + N4 (295 days) + N3 (300 days) + N2 (360 days) + N1 (400 days) — 1,720 days total |
| **Spaced repetition (SRS)** | SM-2 algorithm, same as Anki — cards scheduled automatically |
| **Text-to-speech** | Native browser Japanese voice on every vocab word |
| **Listening exercises** | Hear a word, pick the meaning |
| **Quiz mode** | Multiple choice + typing, lesson content blurred so you can't cheat |
| **Progress saved** | localStorage — your place is remembered between sessions |
| **Kanji stroke order** | Toggle to show/hide stroke order diagrams (N5 kanji + expanding) |
| **Offline** | Works without internet after first load |

## How to use

1. Open `index.html` in Chrome, Edge, or Safari (Firefox works but TTS quality varies)
2. Study the day's content
3. Click **Start Quiz** to test yourself
4. Use the **Review** tab daily for spaced-repetition flashcards
5. Click **✓ Mark as done** when done

## Publishing to GitHub Pages

```bash
git init
git add index.html README.md
git commit -m "Initial commit: N5/N4/N3/N2/N1 1720-day course"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jlpt-n5.git
git push -u origin main
```

Then in your repo: **Settings → Pages → Source: Deploy from branch → main / root → Save**

Your site will be live at `https://YOUR_USERNAME.github.io/jlpt-n5` within a minute.

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

**4. Allow the site in CORS.** The browser refuses to talk to your database until it lists your Pages origin: scheme and host only, no path (`https://YOUR_USERNAME.github.io`). Credentials must be on, which means you can't use `*`.

```ini
[chttpd]
enable_cors = true

[cors]
origins = https://YOUR_USERNAME.github.io
credentials = true
methods = GET, PUT, POST, HEAD, DELETE
headers = accept, authorization, content-type, origin, referer
```

In Fauxton that's **Configuration → CORS**; in Cloudant, **Account → CORS**.

**5. Connect.** Open Settings (gear icon) → Sync, paste the full database URL (`https://HOST/jelly`), the username and password, and press **Connect**. The app checks it can read and write the database first and tells you what's wrong if not. If both sides already had progress, they're merged: finished units and settings by latest change, flashcards by latest review. A dot on the gear shows the sync status.

**Remember on this device.** Off by default, so you sign in again each browser session. Turned on, the login is saved in this browser's localStorage. Every GitHub Pages site under `YOUR_USERNAME.github.io` shares that storage, so any other project you publish there could read it. That's why the user above should only be able to reach this one database.

**Disconnect** stops syncing and keeps everything on the device. It never deletes anything on the server.

**Importing a backup while sync is on:** finished units and settings from the file win, but flashcards still follow the most recent review, so a backup can't roll back reviews you did later on another device. Anything not in the file is deleted, and that deletion syncs too.

## Curriculum overview

### N5 Course (Days 1–365)
- **Days 1–14** — Hiragana (all 46 characters)
- **Days 15–28** — Katakana (all 46 characters)
- **Days 29–84** — Foundations (numbers, particles, basic sentences)
- **Days 85–140** — Core N5 Vocabulary (~200 words)
- **Days 141–182** — Essential Verbs (て-form, ます-form, conjugation)
- **Days 183–252** — Grammar Patterns (particles, conditionals, keigo)
- **Days 253–308** — Kanji (all ~100 N5 kanji)
- **Days 309–365** — Review & JLPT N5 Test Prep

### N4 Course (Days 366–660)
- **Days 366–395** — N5 Review & Bridge Grammar (30 days)
- **Days 396–455** — N4 Vocabulary (~300 words)
- **Days 456–500** — N4 Verbs (て-form extensions, potential, passive, causative)
- **Days 501–555** — N4 Grammar Patterns
- **Days 556–620** — N4 Kanji (~175 kanji)
- **Days 621–660** — Review & JLPT N4 Test Prep

### N3 Course (Days 661–960)
- **Days 661–690** — N4 Review & Bridge to N3 (30 days)
- **Days 691–770** — N3 Vocabulary (~1,500 words)
- **Days 771–820** — N3 Verbs & Adjectives (transitive/intransitive, compound verbs, conjugation forms)
- **Days 821–895** — N3 Grammar Patterns (~120 patterns)
- **Days 896–930** — N3 Kanji (~170 kanji)
- **Days 931–960** — Review & JLPT N3 Test Prep

### N2 Course (Days 961–1320)
- **Days 961–990** — N3 Review & Bridge to N2 (30 days)
- **Days 991–1090** — N2 Vocabulary (~3,000 words, business, law, science, medicine)
- **Days 1091–1140** — N2 Verbs & Expressions (compound verbs, honorifics, idioms)
- **Days 1141–1230** — N2 Grammar Patterns (~180 patterns)
- **Days 1231–1275** — N2 Kanji (~200 kanji, government, economy, science)
- **Days 1276–1320** — Review & JLPT N2 Test Prep

### N1 Course (Days 1321–1720)
- **Days 1321–1350** — N2 Review & Bridge to N1 (30 days)
- **Days 1351–1470** — N1 Vocabulary (~4,000 words: formal, academic, literary, idioms)
- **Days 1471–1530** — N1 Verbs & Expressions (literary verbs, classical remnants, keigo mastery)
- **Days 1531–1640** — N1 Grammar (~220 patterns: formal, classical, literary)
- **Days 1641–1690** — N1 Kanji (~300 kanji: literary, formal, poetic, medical, virtue)
- **Days 1691–1720** — Review & JLPT N1 Test Prep

## Browser compatibility

| Browser | Lessons | TTS | Speech recognition |
|---|---|---|---|
| Chrome / Edge | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ |
| Firefox | ✅ | ⚠️ limited | ❌ |

## License

MIT — free to use, share, and modify.

Sound effects in `sfx/` are from Kenney's [Music Jingles](https://kenney.nl/assets/music-jingles) pack (CC0); see `sfx/LICENSE-kenney.txt`.
