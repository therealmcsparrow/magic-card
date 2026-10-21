// Reserve probe for the lazy clock and image stubs: renders each case in a 400 px card with the modules-extra chunk held
// back, measures the module's wrapper, releases the chunk and measures again. The clock may differ by at most 2.5 px (the system sans-serif fallback has a normal line height of 1.15, the reserve assumes 1.2), the image by 0.
// Usage: node dev/probe-lazy-reserve.mjs <dist dir>   (a production build of magic-card.js and its chunks)
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find(existsSync);
const DIST = path.resolve(process.argv[2] ?? 'dist');

const cases = [
  { name: 'clock', module: { type: 'clock' }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, no date', module: { type: 'clock', show_date: false }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, line_height 1.6', module: { type: 'clock', design: { line_height: 1.6 } }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, line_height 1.6 no date', module: { type: 'clock', show_date: false, design: { line_height: 1.6 } }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, line_height 24px', module: { type: 'clock', design: { line_height: '24px' } }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, line_height 150%', module: { type: 'clock', design: { line_height: '150%' } }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, seconds and long date', module: { type: 'clock', show_seconds: true, date_format: 'long' }, sel: '.mc-clock', tol: 2.5 },
  { name: 'clock, design height', module: { type: 'clock', design: { height: '80px' } }, sel: '.mc-clock', tol: 0 },
  ...['16:9', '4/3', 1.5, '56.25%', undefined, 'bad', 0].map((r) => ({
    name: `image ${r}`, module: { type: 'image', image: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', aspect_ratio: r }, sel: '.mc-image', tol: 0,
  })),
  { name: 'image, no source', module: { type: 'image', aspect_ratio: '4:3' }, sel: '.mc-image', tol: 0 },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/') {
    res.setHeader('content-type', 'text/html');
    return res.end('<!doctype html><body style="margin:0"><script type="module" src="/magic-card.js"></script></body>');
  }
  const file = path.join(DIST, path.basename(url.pathname));
  if (!existsSync(file)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', 'text/javascript');
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
let failed = false;
for (const c of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 800 });
  let release;
  const held = new Promise((r) => (release = r));
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (/modules-extra/.test(req.url())) held.then(() => req.continue()); else req.continue();
  });
  await page.goto(base);
  const measure = (sel) => page.evaluate((s) => {
    const el = document.querySelector('magic-card')?.shadowRoot?.querySelector(s);
    return el ? el.parentElement.getBoundingClientRect().height : -1;
  }, sel);
  await page.evaluate(async (module) => {
    await customElements.whenDefined('magic-card');
    const card = document.createElement('magic-card');
    card.style.cssText = 'display:block;width:400px';
    document.body.append(card);
    card.setConfig({ type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', ...module }] }] }] });
    card.hass = { states: {}, language: 'en', locale: { language: 'en', number_format: 'language', time_format: 'language', time_zone: 'local' }, config: {}, themes: { themes: {} }, callWS: async () => ({}), connection: {} };
  }, c.module);
  await new Promise((r) => setTimeout(r, 400));
  const before = await measure(c.sel);
  const stubText = await page.evaluate((s) => document.querySelector('magic-card').shadowRoot.querySelector(s)?.textContent.trim(), c.sel);
  release();
  await new Promise((r) => setTimeout(r, 800));
  const after = await measure(c.sel);
  const diff = Math.abs(after - before);
  const ok = before >= 0 && after >= 0 && diff <= c.tol && stubText === '';
  if (!ok) failed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${c.name}: stub ${before.toFixed(2)} px, installed ${after.toFixed(2)} px (diff ${diff.toFixed(2)}, allowed ${c.tol})`);
  await page.close();
}
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
