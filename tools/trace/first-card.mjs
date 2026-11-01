#!/usr/bin/env node
// Time-to-first-card trace. Timing is warn-only: a slow run never makes the exit code non-zero.
//
//   node tools/trace/first-card.mjs [--port 18123] [--runs 3] [--fixtures 080,063] [--json] [--profile c85]
//
// Fixed profile: headless Chrome, its own temp --user-data-dir, a fresh incognito context and the HTTP cache
// off for every run (empty cache), CPU 4x throttle, network 500 kbit/s down and up, 400 ms latency (DevTools
// "Slow 3G"). Median of --runs (default 3). Fixtures default to classification.json trace_fixtures (plain, effect).
//
// How it loads: the HA server serves magic-card.js and every chunk under /local/magic-card/. The harness page is
// not on the server: the document request for /local/magic-card/__trace.html is answered by this script (the only
// intercepted request), so nothing is written to the HA config. Everything else is a real throttled fetch.
// The hass object is a fixed mock (every entity id answers with a generic state), so numbers compare between
// stages, not with a real dashboard.
//
// Per run: first_card_ms (first animation frame in which the card shadow root holds ha-card with text; ms from
// navigation start), entry_done_ms, first_chunk_ms (null if no lazy chunk was fetched), last_chunk_ms,
// paint_before_chunk (card visible before the first chunk response finished), cls (layout-shift sum, no input),
// requests and js bytes (encoded body bytes), and the Content-Encoding the server sent for magic-card.js.
//
// --profile c85 runs the same throttled profile in an old Chromium build (CHROME85_PATH, driven over raw
// DevTools protocol by chromium85-cdp.mjs) on the pinned fixtures, or on --fixtures. A fixture is NNN (a gallery
// card) or particles-frames (tools/trace/fixtures). The first-card columns keep the median; the frame and shift
// figures are the maximum over the runs: dropped frames, worst frame, worst frame in the 500 ms after each chunk
// and the box shift per animated element type. Frames are the gaps between requestAnimationFrame callbacks from
// page start to settle. The box is the untransformed layout box (offsets up the offsetParent chain to ha-card),
// so transforms never count; a change of 1 px or more between the first card frame and settle is a shift.
// A timing over 50 ms prints a warning and exits 0. Exit codes: 0 ok, 1 a box shift or a layout-shift sum
// above 0.01, 2 a pinned fixture rendered no element of its type, 3 the run could not be made.
//   node tools/trace/first-card.mjs --profile c85 --find-fx   prints the lowest gallery id that renders .mc-anim-fx

import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import * as jsYaml from 'js-yaml';
/* global window */
import { launchChromium } from './chromium85-cdp.mjs';
import { ANIMATED_TYPES, LAYOUT_SHIFT_LIMIT, boxShifts, createSnapshotter, droppedFrames, maxOf, shiftVerdict, worstAfterChunk, worstFrame } from './frame-stats.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const puppeteer = require('puppeteer-core');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };
const port = Number(opt('port', '18123'));
const runs = Number(opt('runs', '3'));
const asJson = args.includes('--json');
const profileName = opt('profile', '');
if (profileName && profileName !== 'c85') throw new Error('--profile must be c85');
const c85 = profileName === 'c85';
const findFx = args.includes('--find-fx');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('--port must be 1-65535');
if (!Number.isInteger(runs) || runs < 1 || runs > 15) throw new Error('--runs must be 1-15');

const FIX_DIR = join(ROOT, 'tools', 'fixtures', 'gallery');
const cls = JSON.parse(readFileSync(join(FIX_DIR, 'classification.json'), 'utf8'));
const PARTICLES_ID = 'particles-frames';
// The pinned fixtures of --profile c85: the lowest gallery card that has the element type.
const C85_FIXTURES = [
  { id: '063', type: '[data-mc-anim]' },
  { id: '041', type: '[data-mc-v2]' },
  { id: '002', type: 'mc-ring' },
  { id: '003', type: 'mc-flows' },
  { id: '042', type: 'mc-seasonal' },
  { id: '009', type: '.mc-anim-fx' },
  { id: PARTICLES_ID, type: '.mc-anim-fx' },
];
const userIds = opt('fixtures', '') ? opt('fixtures', '').split(',') : null;
const pinned = c85 && !userIds;
const ids = userIds ?? (c85 ? C85_FIXTURES.map((f) => f.id) : [cls.trace_fixtures.plain, cls.trace_fixtures.effect]);
for (const id of ids) if (!/^\d{3}$/.test(id) && id !== PARTICLES_ID) throw new Error(`fixture id must be NNN or ${PARTICLES_ID}: ${id}`);
const pinnedType = (id) => (pinned ? C85_FIXTURES.find((f) => f.id === id)?.type : undefined);

function loadConfig(id) {
  const file = id === PARTICLES_ID ? join(ROOT, 'tools', 'trace', 'fixtures', `${id}.yaml`) : join(FIX_DIR, `${id}.yaml`);
  try {
    return jsYaml.load(readFileSync(file, 'utf8'), { schema: jsYaml.CORE_SCHEMA });
  } catch (e) {
    throw new Error(`fixture ${id} does not load`, { cause: e });
  }
}

const CHROME = process.env.CHROME_PATH
  || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');
const CHROME85 = process.env.CHROME85_PATH || '';
const BASE = `http://localhost:${port}`;
const PAGE_URL = `${BASE}/local/magic-card/__trace.html`;
const PROFILE = { cpu: 4, down_kbps: 500, up_kbps: 500, latency_ms: 400 };
const median = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

// Frame recorder and box snapshot for --profile c85. It runs before the module script, so the first frame is the
// page's own first. A snapshot lists every element of the card's shadow tree with an id and an untransformed box.
const FRAME_SCRIPT = `
window.__frames = []; window.__rec = true;
(function f(t) { if (!window.__rec) return; window.__frames.push(t); requestAnimationFrame(f); })(performance.now());
window.__ls = [];
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ t: e.startTime, v: e.value }); }).observe({ type: 'layout-shift', buffered: true });
window.__snap = (${createSnapshotter.toString()})(() => document.getElementById('c'), ${JSON.stringify(ANIMATED_TYPES)});
`;

function pageHtml(config, withFrames = false) {
  // The config goes in as JSON inside a script element; "<" is escaped so the data cannot close the tag.
  const json = JSON.stringify(config).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><title>trace</title><style>body{margin:0;background:#fff}magic-card{display:block;width:400px;margin:16px}</style></head>
<body>${withFrames ? `<script>${FRAME_SCRIPT}</script>` : ''}<magic-card id="c"></magic-card>
<script type="application/json" id="cfg">${json}</script>
<script type="module">
window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
const mk = (id) => ({ entity_id: id, state: id.startsWith('climate.') ? 'heat' : ${withFrames ? "id.startsWith('weather.') ? 'rainy' : " : ''}'21', last_changed: new Date().toISOString(), last_updated: new Date().toISOString(), context: {}, attributes: { friendly_name: id, unit_of_measurement: '', current_temperature: 21, temperature: 21, hvac_action: 'heating' } });
const states = new Proxy({}, { get: (t, k) => (typeof k === 'string' ? (t[k] ??= mk(k)) : undefined), has: () => true });
const hass = { states, language: 'en', locale: { language: 'en', number_format: 'language', time_format: '24' }, themes: { darkMode: false }, selectedTheme: null, config: { unit_system: { temperature: '°C' }, time_zone: 'UTC' }, entities: {}, devices: {}, areas: {}, user: { is_admin: false },
  callService() {}, callWS: () => Promise.resolve({}), connection: { subscribeMessage: () => Promise.resolve(() => {}), subscribeEvents: () => Promise.resolve(() => {}) },
  hassUrl: (p) => p, formatEntityState: (s) => s.state, formatEntityAttributeValue: (s, a) => String(s.attributes[a]) };
const t = {};
await import('/local/magic-card/magic-card.js');
t.entry_done = performance.now();
await customElements.whenDefined('magic-card');
const c = document.getElementById('c');
c.setConfig(JSON.parse(document.getElementById('cfg').textContent));
c.hass = hass;
const shown = () => { const h = c.shadowRoot && c.shadowRoot.querySelector('ha-card'); return !!h && (h.textContent || '').trim().length > 0; };
await new Promise((res) => { const f = () => { if (shown()) { t.first_card = performance.now(); ${withFrames ? 'window.__first = window.__snap();' : ''} res(); } else requestAnimationFrame(f); }; f(); });
window.__t = t;
window.__done = true;
</script></body></html>`;
}

const ENTRY_URL = `${BASE}/local/magic-card/magic-card.js`;

// The first-card columns of one run, from the page's timings and resource entries.
function summarise(m, enc, withEnds = false) {
  const chunks = m.res.filter((e) => /\/magic-card-[^/]*\.js(\?|$)/.test(e.url) && e.url !== ENTRY_URL).sort((a, b) => a.end - b.end);
  const jsAll = m.res.filter((e) => /\.js(\?|$)/.test(e.url));
  const first = chunks[0]?.end ?? null;
  return {
    first_card_ms: Math.round(m.t.first_card),
    entry_done_ms: Math.round(m.t.entry_done),
    first_chunk_ms: first == null ? null : Math.round(first),
    last_chunk_ms: chunks.length ? Math.round(chunks[chunks.length - 1].end) : null,
    paint_before_chunk: first == null ? null : m.t.first_card <= first,
    cls: Number(m.cls.toFixed(4)),
    chunks: chunks.length,
    ...(withEnds ? { chunk_ends: chunks.map((c) => c.end) } : {}),
    requests: m.res.length,
    js_bytes: jsAll.reduce((s, e) => s + e.bytes, 0),
    content_encoding: enc[ENTRY_URL] ?? 'unknown',
    errors: m.errors ?? [],
  };
}

async function oneRun(browser, config) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 1000, height: 800 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const enc = {};
  cdp.on('Network.responseReceived', (e) => {
    const h = e.response.headers; const k = Object.keys(h).find((x) => x.toLowerCase() === 'content-encoding');
    enc[e.response.url] = k ? h[k] : 'none';
  });
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    if (r.url() === PAGE_URL) r.respond({ status: 200, contentType: 'text/html', body: pageHtml(config) });
    else r.continue();
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROFILE.cpu });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: PROFILE.latency_ms,
    downloadThroughput: PROFILE.down_kbps * 1024 / 8, uploadThroughput: PROFILE.up_kbps * 1024 / 8,
  });
  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForFunction('window.__done === true', { timeout: 120000, polling: 100 });
  // Settle: wait until no new resource entry shows up for 2.5 s (chunks that follow the first paint), max 60 s.
  let last = -1; let still = 0;
  for (let i = 0; i < 240 && still < 10; i++) {
    const n = await page.evaluate('performance.getEntriesByType("resource").length');
    still = n === last ? still + 1 : 0; last = n;
    await new Promise((r) => setTimeout(r, 250));
  }
  const m = await page.evaluate(`(() => {
    const res = performance.getEntriesByType('resource').map((e) => ({ url: e.name, end: e.responseEnd, start: e.startTime, bytes: e.encodedBodySize }));
    return { t: window.__t, cls: window.__cls, res };
  })()`);
  await ctx.close();
  return { ...summarise(m, enc), errors };
}


const FRAME_BUDGET_MS = 50;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One run in the old Chromium build: the first-card columns plus the frame measures and the box snapshots.
async function oneRunC85(browser, config) {
  const page = await browser.newPage();
  try {
    const errors = [];
    const enc = {};
    page.on('Runtime.exceptionThrown', (e) => errors.push(String(e.exceptionDetails?.exception?.description ?? e.exceptionDetails?.text ?? '').slice(0, 200)));
    page.on('Network.responseReceived', (e) => {
      const h = e.response.headers; const k = Object.keys(h).find((x) => x.toLowerCase() === 'content-encoding');
      enc[e.response.url] = k ? h[k] : 'none';
    });
    await page.send('Runtime.enable');
    await page.send('Network.enable');
    await page.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.send('Page.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 800, deviceScaleFactor: 1, mobile: false });
    await page.serve(PAGE_URL, pageHtml(config, true));
    await page.send('Emulation.setCPUThrottlingRate', { rate: PROFILE.cpu });
    await page.send('Network.emulateNetworkConditions', {
      offline: false, latency: PROFILE.latency_ms,
      downloadThroughput: PROFILE.down_kbps * 1024 / 8, uploadThroughput: PROFILE.up_kbps * 1024 / 8,
    });
    await page.send('Page.navigate', { url: PAGE_URL });
    const until = Date.now() + 120000;
    while (!(await page.evaluate(() => window.__done === true))) {
      if (Date.now() > until) throw new Error('the card never showed');
      await sleep(100);
    }
    // Settle: no new resource entry for 2.5 s (chunks that follow the first paint), max 60 s.
    let last = -1; let still = 0;
    for (let i = 0; i < 240 && still < 10; i++) {
      const n = await page.evaluate(() => performance.getEntriesByType('resource').length);
      still = n === last ? still + 1 : 0; last = n;
      await sleep(250);
    }
    const m = await page.evaluate(() => {
      window.__rec = false;
      const res = performance.getEntriesByType('resource').map((e) => ({ url: e.name, end: e.responseEnd, start: e.startTime, bytes: e.encodedBodySize }));
      const cls = window.__ls.reduce((a, e) => a + e.v, 0);
      return { t: window.__t, cls, res, frames: window.__frames, first: window.__first || [], settle: window.__snap(), ls: window.__ls };
    });
    const run = summarise({ ...m, errors }, enc, true);
    const lsAfterFirst = m.ls.filter((e) => e.t > m.t.first_card).reduce((a, e) => a + e.v, 0);
    const shifts = boxShifts(m.first, m.settle);
    return {
      ...run,
      dropped_frames: droppedFrames(m.frames),
      worst_frame_ms: Math.round(worstFrame(m.frames)),
      worst_after_chunk_ms: Math.round(worstAfterChunk(m.frames, run.chunk_ends)),
      layout_shift_after_first: Number(lsAfterFirst.toFixed(4)),
      shifts,
      shift: shiftVerdict(shifts, lsAfterFirst),
      present: [...new Set(m.settle.flatMap((e) => e.types))],
    };
  } finally {
    await page.close();
  }
}

async function runC85(out) {
  if (!CHROME85) throw new Error('set CHROME85_PATH to the Chromium 85 executable');
  const browser = await launchChromium({ executablePath: CHROME85 });
  try {
    out.chrome = await browser.version();
    for (const id of ids) {
      const config = loadConfig(id);
      const rs = [];
      for (let i = 0; i < runs; i++) rs.push(await oneRunC85(browser, config));
      const pick = (k) => median(rs.map((r) => r[k]));
      const byType = {};
      for (const r of rs) for (const [t, n] of Object.entries(r.shifts.byType)) byType[t] = Math.max(byType[t] ?? 0, n);
      const need = pinnedType(id);
      out.fixtures[id] = {
        median: {
          first_card_ms: pick('first_card_ms'), entry_done_ms: pick('entry_done_ms'), first_chunk_ms: pick('first_chunk_ms'),
          last_chunk_ms: pick('last_chunk_ms'), cls: pick('cls'), chunks: pick('chunks'), requests: pick('requests'), js_bytes: pick('js_bytes'),
        },
        paint_before_chunk: rs.every((r) => r.paint_before_chunk !== false),
        content_encoding: [...new Set(rs.map((r) => r.content_encoding))].join(','),
        frames: {
          dropped: maxOf(rs.map((r) => r.dropped_frames)),
          worst_ms: maxOf(rs.map((r) => r.worst_frame_ms)),
          worst_after_chunk_ms: maxOf(rs.map((r) => r.worst_after_chunk_ms)),
        },
        shifts: {
          by_type: byType,
          layout_shift_after_first: maxOf(rs.map((r) => r.layout_shift_after_first)),
          shift: rs.some((r) => r.shift),
          list: rs.flatMap((r) => r.shifts.shifts).slice(0, 20),
          late: rs[0].shifts.late.filter((l) => l.types.length).map((l) => ({ types: l.types, box: l.box })),
        },
        pinned_type: need ?? null,
        pinned_missing: need ? !rs.some((r) => r.present.includes(need)) : false,
        all_runs: rs,
      };
    }
  } finally {
    await browser.close();
  }
}

async function runPuppeteer(out) {
  const userDataDir = mkdtempSync(join(tmpdir(), 'mc-trace-'));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', userDataDir, args: ['--no-sandbox', '--disable-extensions', '--disable-background-networking'] });
  const pid = browser.process()?.pid;
  out.chrome = await browser.version();
  try {
    for (const id of ids) {
      const config = loadConfig(id);
      const rs = [];
      for (let i = 0; i < runs; i++) rs.push(await oneRun(browser, config));
      const pick = (k) => median(rs.map((r) => r[k]));
      out.fixtures[id] = {
        median: {
          first_card_ms: pick('first_card_ms'), entry_done_ms: pick('entry_done_ms'), first_chunk_ms: pick('first_chunk_ms'),
          last_chunk_ms: pick('last_chunk_ms'), cls: pick('cls'), chunks: pick('chunks'), requests: pick('requests'), js_bytes: pick('js_bytes'),
        },
        paint_before_chunk: rs.every((r) => r.paint_before_chunk !== false),
        content_encoding: [...new Set(rs.map((r) => r.content_encoding))].join(','),
        all_runs: rs,
      };
    }
  } finally {
    await browser.close().catch(() => {});
    if (pid) { try { process.kill(pid, 0); process.kill(pid); } catch { /* already gone */ } }
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

// The lowest gallery card that renders a .mc-anim-fx layer, found without throttling.
async function findFxFixture() {
  if (!CHROME85) throw new Error('set CHROME85_PATH to the browser to scan with');
  const browser = await launchChromium({ executablePath: CHROME85 });
  try {
    for (const f of readdirSync(FIX_DIR).filter((n) => /^\d{3}\.yaml$/.test(n)).sort()) {
      const id = f.slice(0, 3);
      const page = await browser.newPage();
      try {
        await page.send('Page.enable');
        await page.serve(PAGE_URL, pageHtml(loadConfig(id), true));
        await page.send('Page.navigate', { url: PAGE_URL });
        const until = Date.now() + 15000;
        while (Date.now() < until) {
          if (await page.evaluate(() => window.__done === true && window.__snap().some((e) => e.types.includes('.mc-anim-fx')))) return id;
          await sleep(200);
        }
      } finally {
        await page.close();
      }
    }
    return null;
  } finally {
    await browser.close();
  }
}

function printC85(out) {
  for (const [id, f] of Object.entries(out.fixtures)) {
    const m = f.median;
    console.log(`${id}: first card ${m.first_card_ms} ms | first chunk ${m.first_chunk_ms ?? '-'} ms | last chunk ${m.last_chunk_ms ?? '-'} ms | chunks ${m.chunks} | CLS ${m.cls}`);
    console.log(`  frames (max of ${runs}): dropped ${f.frames.dropped} | worst ${f.frames.worst_ms} ms | worst in 500 ms after a chunk ${f.frames.worst_after_chunk_ms} ms`);
    const types = Object.entries(f.shifts.by_type).map(([t, n]) => `${t} ${n}`).join(', ');
    console.log(`  box shift: ${f.shifts.shift ? 'SHIFT' : 'none'}${types ? ` (${types})` : ''} | layout shift after first card ${f.shifts.layout_shift_after_first} | late elements ${f.shifts.late.length}`);
    for (const s of f.shifts.list) console.log(`    shift ${s.types.join('+')}: ${JSON.stringify(s.changes)}`);
    if (f.pinned_missing) console.log(`  MISSING: no ${f.pinned_type} element rendered`);
    const errs = f.all_runs.flatMap((r) => r.errors); if (errs.length) console.log('  page errors: ' + [...new Set(errs)].join(' | '));
    if (f.frames.worst_after_chunk_ms > FRAME_BUDGET_MS) console.log(`  warning: worst frame after a chunk is over ${FRAME_BUDGET_MS} ms`);
  }
}

function printPlain(out) {
  for (const [id, f] of Object.entries(out.fixtures)) {
    const m = f.median;
    console.log(`${id}: first card ${m.first_card_ms} ms | entry ${m.entry_done_ms} ms | first chunk ${m.first_chunk_ms ?? '-'} ms | last chunk ${m.last_chunk_ms ?? '-'} ms | CLS ${m.cls} | chunks ${m.chunks} | js ${m.js_bytes} B | paint before chunk ${f.paint_before_chunk} | Content-Encoding ${f.content_encoding}`);
    const errs = f.all_runs.flatMap((r) => r.errors); if (errs.length) console.log('  page errors: ' + [...new Set(errs)].join(' | '));
  }
}

async function main() {
  if (findFx) {
    const id = await findFxFixture();
    console.log(id ?? 'no gallery card renders .mc-anim-fx');
    return 0;
  }
  // The build under test: size and sha256 of the served entry (plain fetch, no throttling).
  const entryRes = await fetch(ENTRY_URL, { headers: { 'accept-encoding': 'identity' } });
  if (!entryRes.ok) throw new Error('demo HA does not serve magic-card.js: HTTP ' + entryRes.status);
  const entryBuf = Buffer.from(await entryRes.arrayBuffer());
  const build = { entry_bytes: entryBuf.length, entry_sha256: createHash('sha256').update(entryBuf).digest('hex').slice(0, 16) };
  const out = { profile: { ...PROFILE, ...(c85 ? { name: 'c85' } : {}) }, runs, chrome: '', build, fixtures: {} };
  if (c85) await runC85(out); else await runPuppeteer(out);

  if (asJson) console.log(JSON.stringify(out, null, 2));
  else {
    console.log(`trace on ${BASE}  build entry ${build.entry_bytes} B sha256 ${build.entry_sha256}  ${out.chrome}`);
    console.log(`profile: CPU ${PROFILE.cpu}x, ${PROFILE.down_kbps} kbit/s, ${PROFILE.latency_ms} ms, ${c85 ? 'first-card median, frame and shift maximum' : 'median'} of ${runs}, empty cache`);
    if (c85) printC85(out); else printPlain(out);
  }
  if (!c85) {
    if (!asJson) console.log('timing is warn-only; exit 0');
    return 0;
  }
  const fx = Object.values(out.fixtures);
  const shifted = fx.some((f) => f.shifts.shift);
  const missing = fx.some((f) => f.pinned_missing);
  if (!asJson) {
    if (missing) console.log('exit 2: a pinned fixture rendered no element of its type');
    else if (shifted) console.log(`exit 1: box shift or layout-shift sum above ${LAYOUT_SHIFT_LIMIT}`);
    else console.log('timing is warn-only; exit 0');
  }
  return missing ? 2 : shifted ? 1 : 0;
}

try {
  process.exitCode = await main();
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exitCode = c85 || findFx ? 3 : 1;
}
