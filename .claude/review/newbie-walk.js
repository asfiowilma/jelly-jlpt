// usage: node .claude/review/newbie-walk.js --level n4 --units u001,u002 --out <dir> [--port 8765]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
// No npm in this repo: fall back to the newest playwright in the npx cache (installed by the Playwright MCP).
const { chromium } = (() => {
  try { return require('playwright'); } catch (e) {
    const npx = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
    const hits = (fs.existsSync(npx) ? fs.readdirSync(npx) : [])
      .map((d) => path.join(npx, d, 'node_modules', 'playwright'))
      .filter((p) => fs.existsSync(p))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    if (!hits.length) throw e;
    return require(hits[0]);
  }
})();

const argv = process.argv.slice(2);
const arg = (name, fallback) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : fallback; };
const LEVEL = arg('level');
const OUT = arg('out');
const PORT = arg('port', '8765');
const UNITS = (arg('units', '') || '').split(',').filter(Boolean);
if (!LEVEL || !OUT || !UNITS.length) { console.error('missing --level, --out or --units'); process.exit(2); }

const REPO = path.resolve(__dirname, '..', '..');
const BASE = `http://localhost:${PORT}/index.html`;
const unitUrl = (id) => `${BASE}#/unit/${LEVEL}.${id}`;
const MAX_Q = 40;
const MAX_TAPS = 40;
const CLICK_MS = 5000;
const AUDIO_WAIT_MS = 5000;
// Class names verified in components/exercises.js, components/quiz-shell.js, components/welcome-view.js.
const SEL = {
  quizStart: '#unit-quiz .qz-cta',
  question: '.qz-prompt',
  option: '.qz-opt',
  check: '.qz-btn.qz-check',
  feedback: '.qz-fb',
  next: '.qz-btn.qz-next',
  skip: 'button.qz-gb:text-is("Skip")',
  // Speak buttons on the lesson and in the quiz. Clicking them starts TTS or clip playback.
  audioTap: 'button[aria-label^="Listen"], .qz-play, .qz-gb[aria-label="Hear it"]',
  welcomeSkip: /Skip for now|今はスキップ|Close|閉じる/,
};
// Sync with docs/review/newbie.md: jargon = C3.1 terms, placeholders = C3.7 examples.
const JARGON = /\b(particle|ichidan|stem|copula)\b/gi;
const PLACEHOLDER = /Review & Practice|e\.g\.|lorem|TODO|undefined|\[object/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch (_) {}
    await sleep(200);
  }
  throw new Error('server did not start on ' + url);
}

// Runs before any page script. Records lesson clips (new Audio) and TTS utterances (speechSynthesis.speak).
// sfx clips live under sfx/ and are skipped.
const AUDIO_HOOK = () => {
  const walk = (window.__walk = { clips: [], speech: [] });
  const Orig = window.Audio;
  const Hooked = function (src) {
    const a = new Orig(src);
    const url = String(a.src || src || '');
    if (!url.includes('/audio/')) return a;
    const rec = { src: url, ok: null, why: 'pending', duration: null };
    walk.clips.push(rec);
    a.addEventListener('playing', () => { rec.ok = true; rec.why = 'playing'; rec.duration = a.duration; });
    a.addEventListener('error', () => { rec.ok = false; rec.why = 'media error ' + (a.error && a.error.code); });
    const play = a.play.bind(a);
    a.play = () => play().catch((e) => { rec.ok = false; rec.why = String(e).split('\n')[0]; throw e; });
    return a;
  };
  Hooked.prototype = Orig.prototype;
  window.Audio = Hooked;
  if (window.speechSynthesis) {
    const ss = window.speechSynthesis;
    const speak = ss.speak.bind(ss);
    ss.speak = (u) => {
      const rec = { src: 'tts:' + String(u.text).slice(0, 40), ok: null, why: 'pending', duration: null };
      walk.speech.push(rec);
      u.addEventListener('start', () => { rec.ok = true; rec.why = 'playing'; });
      u.addEventListener('error', (e) => { if (rec.ok !== true) { rec.ok = false; rec.why = 'speech error ' + e.error; } });
      speak(u);
    };
  }
};

// Taps every speak button in turn, then waits for pending plays to settle.
async function checkAudio(page) {
  const taps = await page.locator(SEL.audioTap).count();
  const n = Math.min(taps, MAX_TAPS);
  for (let i = 0; i < n; i++) {
    await page.locator(SEL.audioTap).nth(i).click({ timeout: CLICK_MS, force: true }).catch(() => {});
    await sleep(300);
  }
  await sleep(AUDIO_WAIT_MS);
  return page.evaluate(() => {
    const w = window.__walk;
    const out = [...w.clips, ...w.speech].map((r) => (r.ok === null
      ? { src: r.src, ok: false, why: 'timeout 5s' }
      : { src: r.src, ok: r.ok, why: r.why, duration: r.duration }));
    w.clips = []; w.speech = [];
    return out;
  });
}

async function runQuiz(page, shot) {
  const items = [];
  const start = page.locator(SEL.quizStart).first();
  if (await start.count()) await start.click({ timeout: CLICK_MS });
  for (let n = 1; n <= MAX_Q; n++) {
    const q = page.locator(SEL.question).first();
    // The next question renders after a click, so wait for it. The first wait covers the quiz start.
    if (!(await q.waitFor({ timeout: n === 1 ? CLICK_MS : 2000 }).then(() => true, () => false))) break;
    const prompt = (await q.innerText()).trim();
    // A missed question comes back once at the end, tagged "Again · not scored" (components/exercises.js).
    const again = (await page.locator('.qz-again').count()) > 0;
    const opts = await page.locator(SEL.option).allInnerTexts();
    let feedback;
    if (opts.length) {
      await page.locator(SEL.option).first().click({ timeout: CLICK_MS }); // naive pick, never the key
      await page.locator(SEL.check).first().click({ timeout: CLICK_MS });
      feedback = (await page.locator(SEL.feedback).innerText({ timeout: CLICK_MS }).catch(() => '')).trim();
    } else {
      // Typed, tile and pair questions have no options. Skip them: the walk cannot answer them honestly.
      await page.locator(SEL.skip).first().click({ timeout: CLICK_MS });
      feedback = 'skipped (no choice options)';
    }
    const flags = [];
    if (!prompt) flags.push('no question line');
    if (PLACEHOLDER.test([prompt, ...opts].join(' '))) flags.push('placeholder text');
    if (new Set(opts).size !== opts.length) flags.push('duplicate options');
    items.push({ n, prompt, options: opts, feedback, flags, ...(again ? { again: true } : {}) });
    if (flags.length) await shot(`quiz-${n}`);
    const next = page.locator(SEL.next).first();
    if (!(await next.count())) break;
    await next.click({ timeout: CLICK_MS });
  }
  return items;
}

// Mock units: start each part from the part sheet, pick option 1 on every question, finish the part,
// then report whether the results screen shows. Same naive pick as runQuiz, never the key.
async function runMock(page) {
  const parts = [];
  for (let p = 0; p < 6; p++) {
    const start = page.locator('.ms-btn').first();
    if (!(await start.count())) break;
    const label = (await start.innerText()).trim();
    await start.click({ timeout: CLICK_MS });
    let asked = 0;
    for (; asked < 120; asked++) {
      if (!(await page.locator('.qz-opt').first().waitFor({ timeout: 3000 }).then(() => true, () => false))) break;
      await page.locator('.qz-opt').first().click({ timeout: CLICK_MS });
      const fin = page.locator('.qz-finish');
      if (await fin.count()) { await fin.first().click({ timeout: CLICK_MS }); asked++; break; }
      await page.locator('.qz-nextq').first().click({ timeout: CLICK_MS });
    }
    parts.push({ part: label, answered: asked });
    await sleep(500);
  }
  const results = (await page.locator('.mr-again').count()) > 0;
  return { parts, resultsShown: results };
}

async function walkUnit(page, id, errors) {
  errors.length = 0;
  const shots = [];
  const shot = async (tag) => {
    const name = `${id}-${tag}.png`;
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
    shots.push(name);
  };
  // Hash-only goto keeps the old document, so the unit may not render before the walk reads it. Blank first forces a full load.
  await page.goto('about:blank');
  await page.goto(unitUrl(id), { waitUntil: 'load' });
  // Open the lesson dialogue ("Read first") so its lines land in lessonText; the newbie judges the lesson from this text.
  await page.locator('.dlg-hero .dlg-ghost').first().click({ timeout: 1500 }).catch(() => {});
  const text = await page.innerText('body');
  const jargonTerms = [...new Set((text.match(JARGON) || []).map((w) => w.toLowerCase()))];
  const audio = await checkAudio(page);
  const isMock = (await page.locator('.ms-btn').count()) > 0;
  const mock = isMock ? await runMock(page) : undefined;
  const quiz = isMock ? [] : await runQuiz(page, shot);
  if (isMock) await shot('mock-end');
  if (audio.some((a) => !a.ok) || errors.length) await shot('lesson');
  return { unit: `${LEVEL}.${id}`, lessonText: text, jargonTerms, audio, ...(mock ? { mock } : {}), quiz, consoleErrors: errors.slice(), screenshots: shots };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = spawn('python', ['-m', 'http.server', PORT], { cwd: REPO, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer(BASE);
    browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } }); // fresh storage per run
    await ctx.addInitScript(AUDIO_HOOK);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));

    await page.goto(BASE, { waitUntil: 'load' });
    const skip = page.locator('.pl-link', { hasText: SEL.welcomeSkip }).first();
    if (await skip.count()) await skip.click({ timeout: CLICK_MS });

    const results = [];
    const unitErrors = [];
    for (const id of UNITS) {
      try {
        const r = await walkUnit(page, id, errors);
        results.push(r);
        fs.writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(r, null, 2));
      } catch (e) {
        unitErrors.push({ unit: `${LEVEL}.${id}`, error: String(e).split('\n')[0] });
      }
    }

    const phone = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pp = await phone.newPage();
    await pp.goto(unitUrl(UNITS[0]), { waitUntil: 'load' });
    const phoneOverflow = await pp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    await phone.close();

    const summary = {
      level: LEVEL,
      units: results.length,
      unitErrors,
      failedAudio: results.flatMap((r) => r.audio.filter((a) => !a.ok).map((a) => ({ unit: r.unit, ...a }))),
      flaggedQuestions: results.flatMap((r) => r.quiz.filter((q) => q.flags.length).map((q) => ({ unit: r.unit, ...q }))),
      consoleErrors: results.filter((r) => r.consoleErrors.length).map((r) => ({ unit: r.unit, errors: r.consoleErrors })),
      phoneOverflow,
    };
    fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify({ units: summary.units, unitErrors: unitErrors.length, failedAudio: summary.failedAudio.length, flaggedQuestions: summary.flaggedQuestions.length, consoleErrors: summary.consoleErrors.length, phoneOverflow }));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
