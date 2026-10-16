// Flow lines performance probe: 10 flows x 3 dots on one card, then a card without flows.
// Build the harness first: npm run build:harness. Usage: node dev/probe-flows-perf.mjs
// Checks: path recomputes (a changed line `d`, plus mc-flows renders) during 5 s idle = 0 after settling,
// frame time recorded, a card without flows has no mc-flows and creates no observers from mc-flows.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);
const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

// 2 rows x 6 columns of text modules; 10 flows between neighbours, 3 dots each, moving at a fixed speed.
const modules = Array.from({ length: 12 }, (_, i) => ({ id: `m${i}`, type: 'text', text: `Module ${i}` }));
const cfg = (withFlows) => ({
  type: 'custom:magic-card', name: 'Flows perf',
  rows: [0, 1].map((r) => ({ id: `r${r}`, columns: Array.from({ length: 6 }, (_, c) => ({ id: `c${r}${c}`, modules: [modules[r * 6 + c]] })) })),
  ...(withFlows ? { flows: Array.from({ length: 10 }, (_, i) => ({ id: `f${i}`, from: `m${i}`, to: `m${i + 2}`, dots: 3, speed: 3, width: 3, route: 'curve' })) } : {}),
});

// Runs in the page before anything else: records observers created by mc-flows.
const hook = () => {
  window.__obs = { mc: 0 };
  for (const name of ['ResizeObserver', 'MutationObserver', 'IntersectionObserver']) {
    const Orig = window[name];
    window[name] = class extends Orig {
      constructor(...a) { super(...a); if (/McFlows/.test(new Error().stack || '')) window.__obs.mc++; }
    };
  }
};

// Runs in the page: sets the card, settles, then counts recomputes over 5 s idle and samples frames.
const run = async (config) => {
  const card = window.__mc.card;
  card.setConfig(config);
  await new Promise((r) => setTimeout(r, 1500));
  const sr = card.shadowRoot;
  const flows = sr.querySelector('mc-flows');
  const out = { hasFlows: !!flows, paths: 0, dots: 0 };
  if (flows) {
    const root = flows.shadowRoot;
    out.paths = root.querySelectorAll('path.line').length;
    out.dots = root.querySelectorAll('circle.dot').length;
    let d = 0;
    new MutationObserver((recs) => { d += recs.filter((r) => r.attributeName === 'd').length; }).observe(root, { subtree: true, attributes: true, attributeFilter: ['d'] });
    const proto = customElements.get('mc-flows').prototype;
    const render = proto.render;
    let renders = 0;
    proto.render = function () { renders++; return render.call(this); };
    const times = [];
    let last = performance.now();
    const t0 = last;
    await new Promise((res) => {
      const tick = (t) => { times.push(t - last); last = t; if (t - t0 < 5000) requestAnimationFrame(tick); else res(); };
      requestAnimationFrame(tick);
    });
    proto.render = render;
    const f = times.slice(3);
    out.recomputes = d;
    out.renders = renders;
    out.avgFrameMs = +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(2);
    out.maxFrameMs = +Math.max(...f).toFixed(1);
    out.longFrames = f.filter((x) => x > 50).length;
  }
  out.mcObservers = window.__obs.mc;
  return out;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
let failed = false;
const fail = (m) => { failed = true; console.log('FAIL', m); };
for (const withFlows of [true, false]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920 });
  await page.evaluateOnNewDocument(hook);
  await page.goto(pathToFileURL(path.join(ROOT, 'dev/harness.html')).href + '?w=900&theme=light', { waitUntil: 'networkidle0' });
  const res = await page.evaluate(run, cfg(withFlows));
  console.log(withFlows ? 'flows-10x3' : 'no-flows', JSON.stringify(res));
  if (withFlows) {
    if (!res.hasFlows) fail('no mc-flows on a card with flows');
    if (res.paths !== 10) fail(`${res.paths}/10 lines drawn`);
    if (res.dots !== 30) fail(`${res.dots}/30 dots`);
    if (res.recomputes !== 0 || res.renders !== 0) fail(`${res.recomputes} path recomputes, ${res.renders} renders during 5 s idle`);
  } else {
    if (res.hasFlows) fail('mc-flows on a card without flows');
    if (res.mcObservers) fail(`${res.mcObservers} observers created by mc-flows without flows`);
  }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
