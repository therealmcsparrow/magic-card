#!/usr/bin/env node
// Time-to-first-card trace. Warn-only: it never exits non-zero for a slow run.
//
//   node tools/trace/first-card.mjs [--port 18123] [--runs 3] [--fixtures 080,063] [--json]
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

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import * as jsYaml from 'js-yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(join(ROOT, 'package.json'));
const puppeteer = require('puppeteer-core');

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };
const port = Number(opt('port', '18123'));
const runs = Number(opt('runs', '3'));
const asJson = args.includes('--json');
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('--port must be 1-65535');
if (!Number.isInteger(runs) || runs < 1 || runs > 15) throw new Error('--runs must be 1-15');

const FIX_DIR = join(ROOT, 'tools', 'fixtures', 'gallery');
const cls = JSON.parse(readFileSync(join(FIX_DIR, 'classification.json'), 'utf8'));
const ids = opt('fixtures', '') ? opt('fixtures', '').split(',') : [cls.trace_fixtures.plain, cls.trace_fixtures.effect];
for (const id of ids) if (!/^\d{3}$/.test(id)) throw new Error('fixture id must be NNN: ' + id);

const CHROME = process.env.CHROME_PATH
  || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');
const BASE = `http://localhost:${port}`;
const PAGE_URL = `${BASE}/local/magic-card/__trace.html`;
const PROFILE = { cpu: 4, down_kbps: 500, up_kbps: 500, latency_ms: 400 };
const median = (a) => { const s = a.filter((x) => x != null).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

function pageHtml(config) {
  // The config goes in as JSON inside a script element; "<" is escaped so the data cannot close the tag.
  const json = JSON.stringify(config).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><title>trace</title><style>body{margin:0;background:#fff}magic-card{display:block;width:400px;margin:16px}</style></head>
<body><magic-card id="c"></magic-card>
<script type="application/json" id="cfg">${json}</script>
<script type="module">
window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
const mk = (id) => ({ entity_id: id, state: id.startsWith('climate.') ? 'heat' : '21', last_changed: new Date().toISOString(), last_updated: new Date().toISOString(), context: {}, attributes: { friendly_name: id, unit_of_measurement: '', current_temperature: 21, temperature: 21, hvac_action: 'heating' } });
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
await new Promise((res) => { const f = () => { if (shown()) { t.first_card = performance.now(); res(); } else requestAnimationFrame(f); }; f(); });
window.__t = t;
window.__done = true;
</script></body></html>`;
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
  const entryUrl = `${BASE}/local/magic-card/magic-card.js`;
  const chunks = m.res.filter((e) => /\/magic-card-[^/]*\.js(\?|$)/.test(e.url) && e.url !== entryUrl).sort((a, b) => a.end - b.end);
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
    requests: m.res.length,
    js_bytes: jsAll.reduce((s, e) => s + e.bytes, 0),
    content_encoding: enc[entryUrl] ?? 'unknown',
    errors,
  };
}

// The build under test: size and sha256 of the served entry (plain fetch, no throttling).
const entryRes = await fetch(`${BASE}/local/magic-card/magic-card.js`, { headers: { 'accept-encoding': 'identity' } });
if (!entryRes.ok) throw new Error('demo HA does not serve magic-card.js: HTTP ' + entryRes.status);
const entryBuf = Buffer.from(await entryRes.arrayBuffer());
const build = { entry_bytes: entryBuf.length, entry_sha256: createHash('sha256').update(entryBuf).digest('hex').slice(0, 16) };

const userDataDir = mkdtempSync(join(tmpdir(), 'mc-trace-'));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', userDataDir, args: ['--no-sandbox', '--disable-extensions', '--disable-background-networking'] });
const pid = browser.process()?.pid;
const out = { profile: PROFILE, runs, chrome: await browser.version(), build, fixtures: {} };
try {
  for (const id of ids) {
    const config = jsYaml.load(readFileSync(join(FIX_DIR, `${id}.yaml`), 'utf8'), { schema: jsYaml.CORE_SCHEMA });
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
if (asJson) console.log(JSON.stringify(out, null, 2));
else {
  console.log(`trace on ${BASE}  build entry ${build.entry_bytes} B sha256 ${build.entry_sha256}  ${out.chrome}`);
  console.log(`profile: CPU ${PROFILE.cpu}x, ${PROFILE.down_kbps} kbit/s, ${PROFILE.latency_ms} ms, median of ${runs}, empty cache`);
  for (const [id, f] of Object.entries(out.fixtures)) {
    const m = f.median;
    console.log(`${id}: first card ${m.first_card_ms} ms | entry ${m.entry_done_ms} ms | first chunk ${m.first_chunk_ms ?? '-'} ms | last chunk ${m.last_chunk_ms ?? '-'} ms | CLS ${m.cls} | chunks ${m.chunks} | js ${m.js_bytes} B | paint before chunk ${f.paint_before_chunk} | Content-Encoding ${f.content_encoding}`);
    const errs = f.all_runs.flatMap((r) => r.errors); if (errs.length) console.log('  page errors: ' + [...new Set(errs)].join(' | '));
  }
  console.log('timing is warn-only; exit 0');
}
