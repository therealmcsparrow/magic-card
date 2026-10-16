// Shapes and value backgrounds performance probe: 20 shaped modules, 10 value fills and 5 sparklines
// on one card, then the same modules without shapes or value backgrounds.
// Build the harness first: npm run build:harness. Usage: node dev/probe-shapes-value-bg-perf.mjs
// Checks:
// - during 5 s idle after settling: no mc-shape / mc-value-bg renders, no clip-path writes on shaped
//   elements and no path `d` changes in the layers (the waves are CSS animations); frame time recorded;
// - a hass update of an unrelated entity re-renders no layer;
// - history fetches = the distinct entity | hours keys of the sparklines (5 sparklines, 3 keys);
// - the baseline card has no mc-shape / mc-value-bg and creates no observers from them.
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

const STATES = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [`sensor.probe_tank_${i}`, { entity_id: `sensor.probe_tank_${i}`, state: String(8 + i * 9), attributes: { friendly_name: `Tank ${i}`, unit_of_measurement: '%' } }])
    .concat([
      ['sensor.probe_temp', { entity_id: 'sensor.probe_temp', state: '21.4', attributes: { friendly_name: 'Probe temp', unit_of_measurement: '°C' } }],
      ['sensor.probe_hum', { entity_id: 'sensor.probe_hum', state: '47', attributes: { friendly_name: 'Probe humidity', unit_of_measurement: '%' } }],
      ['sensor.probe_other', { entity_id: 'sensor.probe_other', state: '1', attributes: { friendly_name: 'Unrelated' } }],
    ]),
);

// 5 sparklines over 3 history keys (temp|7, temp|7, temp|13, hum|7, hum|7); unusual hours so nothing
// the harness fetched before is already cached
const SPARKS = [
  ['sensor.probe_temp', 7],
  ['sensor.probe_temp', 7],
  ['sensor.probe_temp', 13],
  ['sensor.probe_hum', 7],
  ['sensor.probe_hum', 7],
];
const SHAPES = [
  ['squircle', {}], ['pill', {}], ['circle', {}], ['hexagon', {}], ['octagon', {}],
  ['notch', {}], ['ticket', {}], ['wave', { edge: 'bottom' }], ['blob', { seed: 7 }], ['hexagon', { cut: '30%' }],
];
const base = { background: 'var(--secondary-background-color)', border_radius: '14px', padding: '10px', min_height: '64px' };

function modules(withFx) {
  const spark = SPARKS.map(([entity, hours], i) => ({
    id: `s${i}`, type: 'info', entity,
    design: { ...base, ...(withFx ? { value_background: { type: 'sparkline', hours, color: '#ef5350' } } : {}) },
  }));
  const fills = Array.from({ length: 10 }, (_, i) => ({
    id: `f${i}`, type: 'info', entity: `sensor.probe_tank_${i}`,
    design: { ...base, ...(withFx ? { value_background: { type: 'fill', color: '#29b6f6', direction: ['up', 'right', 'down', 'left'][i % 4] } } : {}) },
  }));
  const shaped = Array.from({ length: 20 }, (_, i) => ({
    id: `h${i}`, type: 'text', text: `Shape ${i}`,
    design: { ...base, ...(withFx ? { shape: SHAPES[i % 10][0], shape_options: SHAPES[i % 10][1], border_width: '2px', border_style: 'solid', border_color: '#0288d1' } : {}) },
  }));
  return [...spark, ...fills, ...shaped];
}

// 7 rows x 5 columns: sparklines first (on screen), then fills, then shapes
const cfg = (withFx) => {
  const mods = modules(withFx);
  return {
    type: 'custom:magic-card', name: 'Shapes and value backgrounds perf',
    rows: Array.from({ length: 7 }, (_, r) => ({ id: `r${r}`, columns: Array.from({ length: 5 }, (_, c) => ({ id: `c${r}${c}`, modules: [mods[r * 5 + c]] })) })),
  };
};

// Runs in the page before anything else: records observers created by mc-shape / mc-value-bg.
const hook = () => {
  window.__obs = { mc: 0 };
  for (const name of ['ResizeObserver', 'MutationObserver', 'IntersectionObserver']) {
    const Orig = window[name];
    window[name] = class extends Orig {
      constructor(...a) { super(...a); if (/McShape|McValueBg|mc-shape|mc-value-bg/.test(new Error().stack || '')) window.__obs.mc++; }
    };
  }
};

// Runs in the page: sets the card (history calls counted), settles, then counts recomputes over 5 s idle.
const run = async (states, config) => {
  const card = window.__mc.card;
  Object.assign(window.__mc.hass.states, states);
  const calls = [];
  const callWS = window.__mc.hass.callWS;
  const hass = {
    ...window.__mc.hass,
    states: { ...window.__mc.hass.states },
    callWS: (msg) => {
      if (msg.type === 'history/history_during_period') {
        const hours = Math.round((Date.parse(msg.end_time) - Date.parse(msg.start_time)) / 3600_000);
        calls.push(`${msg.entity_ids[0]}|${hours}`);
      }
      return callWS(msg);
    },
  };
  card.hass = hass;
  card.setConfig(config);
  await new Promise((r) => setTimeout(r, 2000));
  const sr = card.shadowRoot;
  const layers = [...sr.querySelectorAll('mc-value-bg')];
  const shapes = [...sr.querySelectorAll('mc-shape')];
  const out = {
    shaped: sr.querySelectorAll('[data-mc-shape]').length,
    fills: layers.filter((l) => l.value?.type === 'fill').length,
    sparklines: layers.filter((l) => l.value?.type === 'sparkline' && l.shadowRoot.querySelector('path.line')).length,
    historyFetches: calls.length,
    historyKeys: [...new Set(calls)].sort(),
  };
  if (layers.length || shapes.length) {
    // recompute counters: renders, clip-path writes on shaped elements, path `d` changes in the layers
    const protos = ['mc-shape', 'mc-value-bg'].map((t) => customElements.get(t).prototype);
    const renders = { 'mc-shape': 0, 'mc-value-bg': 0 };
    const orig = protos.map((p) => p.render);
    protos.forEach((p, i) => {
      const tag = i ? 'mc-value-bg' : 'mc-shape';
      p.render = function () { renders[tag]++; return orig[i].call(this); };
    });
    let clipWrites = 0;
    let dChanges = 0;
    const clipObs = new MutationObserver((recs) => {
      for (const r of recs) if (r.target.style.clipPath !== r.oldValue?.match(/clip-path:\s*([^;]+)/)?.[1]?.trim()) clipWrites++;
    });
    sr.querySelectorAll('[data-mc-shape]').forEach((el) => clipObs.observe(el, { attributes: true, attributeFilter: ['style'], attributeOldValue: true }));
    const dObs = new MutationObserver((recs) => { dChanges += recs.length; });
    for (const el of [...layers, ...shapes]) if (el.shadowRoot) dObs.observe(el.shadowRoot, { subtree: true, attributes: true, attributeFilter: ['d'] });
    const times = [];
    let last = performance.now();
    const t0 = last;
    await new Promise((res) => {
      const tick = (t) => { times.push(t - last); last = t; if (t - t0 < 5000) requestAnimationFrame(tick); else res(); };
      requestAnimationFrame(tick);
    });
    const f = times.slice(3);
    out.idleRenders = { ...renders };
    out.idleClipWrites = clipWrites;
    out.idleDChanges = dChanges;
    out.avgFrameMs = +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(2);
    out.maxFrameMs = +Math.max(...f).toFixed(1);
    out.longFrames = f.filter((x) => x > 50).length;
    // an unrelated entity changes: no layer renders
    renders['mc-shape'] = 0;
    renders['mc-value-bg'] = 0;
    card.hass = { ...hass, states: { ...hass.states, 'sensor.probe_other': { ...hass.states['sensor.probe_other'], state: '2' } } };
    await new Promise((r) => setTimeout(r, 300));
    out.unrelatedUpdateRenders = { ...renders };
    protos.forEach((p, i) => { p.render = orig[i]; });
    clipObs.disconnect();
    dObs.disconnect();
    out.historyFetchesAfter = calls.length;
  }
  out.mcObservers = window.__obs.mc;
  return out;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] });
let failed = false;
const fail = (m) => { failed = true; console.log('FAIL', m); };
for (const withFx of [true, false]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1600 });
  await page.evaluateOnNewDocument(hook);
  await page.goto(pathToFileURL(path.join(ROOT, 'dev/harness.html')).href + '?w=900&theme=light', { waitUntil: 'networkidle0' });
  const res = await page.evaluate(run, STATES, cfg(withFx));
  console.log(withFx ? 'shapes-20 fills-10 sparklines-5' : 'baseline', JSON.stringify(res));
  if (withFx) {
    const keys = [...new Set(SPARKS.map(([e, h]) => `${e}|${h}`))].sort();
    if (res.shaped !== 20) fail(`${res.shaped}/20 shaped modules`);
    if (res.fills !== 10) fail(`${res.fills}/10 fills`);
    if (res.sparklines !== 5) fail(`${res.sparklines}/5 sparklines drawn`);
    if (res.historyFetches !== keys.length || JSON.stringify(res.historyKeys) !== JSON.stringify(keys)) {
      fail(`${res.historyFetches} history fetches (${res.historyKeys}) for ${keys.length} distinct keys (${keys})`);
    }
    const idle = res.idleRenders['mc-shape'] + res.idleRenders['mc-value-bg'] + res.idleClipWrites + res.idleDChanges;
    if (idle) fail(`recomputes during 5 s idle: ${JSON.stringify(res.idleRenders)}, ${res.idleClipWrites} clip writes, ${res.idleDChanges} path changes`);
    if (res.unrelatedUpdateRenders['mc-shape'] + res.unrelatedUpdateRenders['mc-value-bg']) fail(`an unrelated hass update re-rendered layers: ${JSON.stringify(res.unrelatedUpdateRenders)}`);
    if (res.historyFetchesAfter !== res.historyFetches) fail(`${res.historyFetchesAfter - res.historyFetches} history fetches while idle`);
  } else {
    if (res.shaped || res.fills || res.sparklines) fail('shape / value background on the baseline card');
    if (res.historyFetches) fail(`${res.historyFetches} history fetches without sparklines`);
    if (res.mcObservers) fail(`${res.mcObservers} observers created by mc-shape / mc-value-bg without them`);
  }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
