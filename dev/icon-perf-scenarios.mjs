// The icon engine's 30-icon performance probe (batch 4, Task 10), reproducible:
//   npm run build:harness && node dev/probe-icon-perf.mjs
// 30 Icon modules with a liquid fill + device auto on one card, 3 distinct icon names. A MutationObserver
// counts the hidden <ha-icon> probes in the off-screen holder from page start.
// Also merged into the screenshot scenarios (scripts/shoot.mjs) when that local tool is present.

/** Shapes for the fake mdi pack (window.customIconsets.mdi). */
const PATHS = {
  'mdi:battery': 'M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z',
  'mdi:lightbulb': 'M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z',
  'mdi:fan': 'M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z',
};

const wait = (ms) => `new Promise((r) => setTimeout(r, ${ms}))`;

export const ICON_PERF_SCENARIOS = {};

// Performance: 30 Icon modules with a liquid fill + device auto on one card. Probes (hidden <ha-icon>
// lookups) must be one per distinct icon name, never one per icon; a card without icon_fx must
// render no <mc-svg-icon> and start no probe.
const PERF_NAMES = ['mdi:battery', 'mdi:fan', 'mdi:lightbulb'];
const PERF_STATES = Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`sensor.p${i}`, { entity_id: `sensor.p${i}`, state: String((i * 7) % 100), attributes: { friendly_name: `P${i}` } }]));
const perfCard = (fx) => ({ type: 'custom:magic-card', name: 'Perf', rows: Array.from({ length: 6 }, (_, r) => ({ id: `r${r}`,
  columns: Array.from({ length: 5 }, (_, c) => {
    const i = r * 5 + c;
    return { id: `r${r}c${c}`, modules: [{ id: `p${i}`, type: 'icon', size: '32px', entity: `sensor.p${i}`, icon: PERF_NAMES[i % 3], ...(fx ? { icon_fx: { fill: {}, device: 'auto' } } : {}) }] };
  }) })) });

/** Runs in the page: counts probes from the very start, optionally with the fake mdi pack, then sets the card. */
function perfSetup(paths, states, config, withPack) {
  const perf = (window.__perf = { probes: 0, probeNames: [], t0: performance.now(), frames: [], drawnMs: null });
  const seen = new Set();
  const count = (p) => { if (seen.has(p)) return; seen.add(p); perf.probes++; perf.probeNames.push(p.getAttribute('icon')); };
  new MutationObserver((recs) => {
    for (const r of recs) for (const n of r.addedNodes) {
      if (n.nodeName === 'HA-ICON' && n.parentElement && /-9999px/.test(n.parentElement.style.cssText)) count(n);
      // the holder and its first probe can arrive in one batch
      if (n.nodeType === 1 && /-9999px/.test(n.style?.cssText || '')) for (const p of n.querySelectorAll('ha-icon')) count(p);
    }
  }).observe(document.body, { childList: true, subtree: true });
  window.customIconsets = window.customIconsets || {};
  if (withPack) window.customIconsets.mdi = async (name) => (paths[`mdi:${name}`] ? { path: paths[`mdi:${name}`], viewBox: '0 0 24 24' } : undefined);
  else delete window.customIconsets.mdi;
  Object.assign(window.__mc.hass.states, states);
  window.__mc.card.hass = { ...window.__mc.hass, states: { ...window.__mc.hass.states } };
  window.__mc.card.setConfig(config);
  const sr = window.__mc.card.shadowRoot;
  let last = performance.now();
  const frame = (t) => {
    perf.frames.push(t - last);
    last = t;
    const icons = [...sr.querySelectorAll('mc-svg-icon')];
    if (perf.drawnMs === null && icons.length === 30 && icons.every((i) => i.shadowRoot?.querySelector('svg'))) perf.drawnMs = Math.round(performance.now() - perf.t0);
    if (perf.frames.length < 600) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
const perfStep = (fx, withPack) => `(${perfSetup.toString()})(${JSON.stringify(PATHS)}, ${JSON.stringify(PERF_STATES)}, ${JSON.stringify(perfCard(fx))}, ${withPack})`;

function perfCheckFn(mode) {
  const perf = window.__perf;
  const sr = window.__mc.card.shadowRoot;
  const icons = sr.querySelectorAll('mc-svg-icon').length;
  const frames = perf.frames.slice(5);
  const avg = frames.reduce((a, b) => a + b, 0) / Math.max(1, frames.length);
  perf.summary = { mode, icons, probes: perf.probes, distinctProbed: new Set(perf.probeNames).size, drawnMs: perf.drawnMs, avgFrameMs: +avg.toFixed(1), longFrames: frames.filter((f) => f > 50).length, frames: frames.length };
  const out = [];
  if (mode === 'plain') {
    if (icons) out.push(`${icons} mc-svg-icon without icon_fx`);
    if (perf.probes) out.push(`${perf.probes} probes without icon_fx`);
    return out.join('; ');
  }
  if (icons !== 30) out.push(`${icons}/30 mc-svg-icon`);
  if (perf.probes > 3) out.push(`${perf.probes} probes for 3 icon names`);
  if (mode === 'pack') {
    if (perf.probes) out.push(`${perf.probes} probes although the pack has the icons`);
    if (perf.drawnMs === null) out.push('not all 30 icons drawn');
    if (avg > 20) out.push(`avg frame ${avg.toFixed(1)}ms`);
  } else {
    // No pack, and the harness ha-icon has no ha-svg-icon: the probes time out; every icon stays a visible <ha-icon>.
    if (perf.probes < 1) out.push('no probe started');
    const blank = [...sr.querySelectorAll('mc-svg-icon')].filter((i) => !i.shadowRoot?.querySelector('ha-icon[icon], svg')).length;
    if (blank) out.push(`${blank} icons blank`);
  }
  return out.join('; ');
}
const perfCheck = (mode) => `(${perfCheckFn.toString()})(${JSON.stringify(mode)})`;
ICON_PERF_SCENARIOS['icon-fx-perf-30-probe-light'] = { w: 560, theme: 'light', steps: [perfStep(true, false), wait(3600)], check: perfCheck('probe') };
ICON_PERF_SCENARIOS['icon-fx-perf-30-pack-light'] = { w: 560, theme: 'light', steps: [perfStep(true, true), wait(2500)], check: perfCheck('pack') };
ICON_PERF_SCENARIOS['icon-fx-perf-30-plain-light'] = { w: 560, theme: 'light', steps: [perfStep(false, false), wait(1500)], check: perfCheck('plain') };
