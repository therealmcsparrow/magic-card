// DOM-diff gate. Renders every gallery fixture (tools/fixtures/gallery/NNN.yaml) through the
// real MagicCard.setConfig in happy-dom, with a fixed hass mock, once with the current build and once with the
// reference build (git archive edc5d05, built in .cache/dom-diff/), serialises the shadow trees and compares them.
//
// Usage:
//   node tools/dom-diff.mjs                       current = ./dist, reference = edc5d05 (built once, cached)
//   node tools/dom-diff.mjs --dist <dir>          current = <dir> (a webpack output directory)
//   node tools/dom-diff.mjs --build-head          current = a fresh build of `git archive HEAD` (clean-tree proof)
//   node tools/dom-diff.mjs --ref <rev>           reference revision (default edc5d05)
//   node tools/dom-diff.mjs --only 001,063        limit to fixture ids
//   node tools/dom-diff.mjs --dump <dir>          also write both serialisations as <dir>/{current,reference}/NNN.txt
//   node tools/dom-diff.mjs --selftest            normaliser and comparison rules, no browser, no build
//
// Normalisation (the only one, and it is written here, in serialise() and normaliseText()):
//   1. runs of whitespace in a text node collapse to one space;
//   2. a whitespace-only text node equals an empty one (it is dropped);
//   3. attributes are sorted by name.
// Nothing else is normalised: comments (lit part markers) stay, class order stays, style text stays, attribute
// values stay, so a template-minifier change shows up as a difference.
//
// Fixed inputs: Date, Math.random and performance.now are pinned (the same sequence in both builds), the hass
// mock is built from the entity ids the fixture itself names, every fixture is rendered through the real
// setConfig, and the serialisation is taken when it has not changed for several polls (lazy chunks settled).
// Exit codes: 0 identical, 1 differences, 2 harness failure (build, render error, empty render).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES = path.join(ROOT, 'tools', 'fixtures', 'gallery');
const CACHE = path.join(ROOT, '.cache', 'dom-diff'); // .cache/ is git-ignored
const DEFAULT_REF = 'edc5d05';
const MAX_FIXTURE_BYTES = 262144;
const MAX_ALIASES = 1000;

// ── serialisation (pure, used by the worker and by --selftest) ───────────────────────────────────────

/** Normalisation rule 1: runs of whitespace collapse to one space. */
export function normaliseText(s) {
  return s.replace(/\s+/g, ' ');
}

/**
 * Serialise a node (any DOM-like object): elements as <tag a="v" ...>, shadow roots as #shadow-root, text nodes
 * normalised, whitespace-only text nodes dropped, attributes sorted, comments kept. One node per line.
 */
export function serialise(node, depth = 0, out = []) {
  const pad = '  '.repeat(depth);
  const type = node.nodeType;
  if (type === 3) {
    const t = normaliseText(node.nodeValue ?? '');
    if (t !== ' ' && t !== '') out.push(`${pad}"${t}"`);
  } else if (type === 8) {
    out.push(`${pad}<!--${node.nodeValue ?? ''}-->`);
  } else if (type === 1) {
    const attrs = [...node.attributes]
      .map((a) => [a.name, a.value])
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
      .map(([n, v]) => ` ${n}=${JSON.stringify(v)}`)
      .join('');
    out.push(`${pad}<${node.localName}${attrs}>`);
    if (node.shadowRoot) {
      out.push(`${pad}  #shadow-root`);
      for (const c of node.shadowRoot.childNodes) serialise(c, depth + 2, out);
    }
    for (const c of node.childNodes) serialise(c, depth + 1, out);
  } else if (type === 11) {
    for (const c of node.childNodes) serialise(c, depth, out);
  }
  return out;
}

/** First differing line of two serialisations with a little context. */
export function firstDifference(a, b) {
  const la = a.split('\n');
  const lb = b.split('\n');
  const n = Math.max(la.length, lb.length);
  for (let i = 0; i < n; i++) {
    if (la[i] !== lb[i]) {
      const from = Math.max(0, i - 2);
      return { line: i + 1, current: la.slice(from, i + 3), reference: lb.slice(from, i + 3) };
    }
  }
  return null;
}

// ── selftest ──────────────────────────────────────────────────────────────────────────────────────

async function selftest() {
  const { Window } = await import('happy-dom');
  const win = new Window();
  const doc = win.document;
  const ser = (html) => {
    const host = doc.createElement('div');
    host.innerHTML = html;
    return serialise(host).join('\n');
  };
  const same = (a, b) => ser(a) === ser(b);
  const cases = [
    ['whitespace run collapses', same('<p>a   b\n c</p>', '<p>a b c</p>'), true],
    ['whitespace-only text node is empty', same('<div> \n <p>x</p> </div>', '<div><p>x</p></div>'), true],
    ['attribute order is sorted', same('<p id="a" class="b">x</p>', '<p class="b" id="a">x</p>'), true],
    ['a changed word is a difference', same('<p>ab</p>', '<p>ac</p>'), false],
    ['one space vs no space inside text is a difference', same('<p>a b</p>', '<p>ab</p>'), false],
    ['class token order is a difference', same('<p class="a b">x</p>', '<p class="b a">x</p>'), false],
    ['attribute value whitespace is a difference', same('<p class="a  b">x</p>', '<p class="a b">x</p>'), false],
    ['inline style text is a difference', same('<p style="color:red">x</p>', '<p style="color: red">x</p>'), false],
    ['a comment is a difference', same('<p>x</p><!---->', '<p>x</p>'), false],
    ['an added attribute is a difference', same('<p hidden>x</p>', '<p>x</p>'), false],
    ['whitespace-only node between elements is dropped (rule 2)', same('<b>a</b> <i>b</i>', '<b>a</b><i>b</i>'), true],
  ];
  // The last case documents rule 2: the whitespace-only node between elements is dropped, so it is equal.
  let bad = 0;
  for (const [name, got, want] of cases) {
    const ok = got === want;
    if (!ok) bad++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`);
  }
  const shadowHost = doc.createElement('div');
  shadowHost.attachShadow({ mode: 'open' }).innerHTML = '<span>in</span>';
  const s = serialise(shadowHost).join('\n');
  const okShadow = s.includes('#shadow-root') && s.includes('<span>');
  if (!okShadow) bad++;
  console.log(`${okShadow ? 'ok  ' : 'FAIL'} shadow root is serialised`);
  const d = firstDifference('a\nb\nc', 'a\nX\nc');
  const okDiff = d && d.line === 2;
  if (!okDiff) bad++;
  console.log(`${okDiff ? 'ok  ' : 'FAIL'} firstDifference finds line 2`);
  console.log(bad ? `${bad} selftest failure(s)` : 'selftest passed');
  return bad ? 1 : 0;
}

// ── builds ────────────────────────────────────────────────────────────────────────────────────────

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 28, shell: false, ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed (${r.status})\n${(r.stdout || '').slice(-2000)}\n${(r.stderr || '').slice(-2000)}`);
  }
  return r.stdout;
}

/**
 * Build `git archive <rev>` into .cache/dom-diff/<full-sha>/ and return its dist directory. The archive is
 * extracted below the repository, so node resolves node_modules by walking up (no junction, no copy). A dist
 * that already exists for that sha is reused; delete .cache/dom-diff to force a rebuild.
 */
function buildFromArchive(rev) {
  const sha = sh('git', ['-C', ROOT, 'rev-parse', '--verify', `${rev}^{commit}`]).trim();
  const dir = path.join(CACHE, sha);
  const dist = path.join(dir, 'dist');
  if (existsSync(path.join(dist, 'magic-card.js')) && existsSync(path.join(dir, '.built'))) return { dist, sha };
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const tarFile = path.join(CACHE, `${sha}.tar`);
  sh('git', ['-C', ROOT, 'archive', '--format=tar', '-o', tarFile, sha]);
  // relative paths and cwd: GNU tar reads 'Z:' in an absolute Windows path as a remote host
  sh('tar', ['-xf', path.basename(tarFile), '-C', sha], { cwd: CACHE });
  rmSync(tarFile, { force: true });
  console.log(`building ${rev} (${sha.slice(0, 12)}) from git archive ...`);
  // Windows needs a shell for npm.cmd; pass one fixed string, never an argument list with shell:true
  const r = process.platform === 'win32'
    ? spawnSync('npm run build', { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 28, shell: true })
    : spawnSync('npm', ['run', 'build'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 28, shell: false });
  if (r.status !== 0) throw new Error(`build of ${rev} failed\n${(r.stdout || '').slice(-3000)}\n${(r.stderr || '').slice(-2000)}`);
  writeFileSync(path.join(dir, '.built'), `${sha}\n`);
  return { dist, sha };
}

// ── rendering (worker: one process per build, because customElements is global) ───────────────────────────

const DOMAINS = [
  'light', 'sensor', 'binary_sensor', 'switch', 'climate', 'media_player', 'person', 'weather', 'todo', 'cover',
  'camera', 'input_boolean', 'input_number', 'input_select', 'input_text', 'input_datetime', 'fan', 'lock', 'vacuum',
  'sun', 'scene', 'script', 'automation', 'button', 'number', 'select', 'humidifier', 'water_heater', 'alarm_control_panel',
  'device_tracker', 'zone', 'calendar', 'update', 'timer', 'counter', 'group', 'image', 'text', 'event', 'siren', 'valve',
  'lawn_mower', 'remote', 'date', 'time', 'datetime', 'notify', 'tts', 'stt', 'conversation', 'schedule',
];
const ENTITY_RE = new RegExp(`^(${DOMAINS.join('|')})\\.[a-z0-9_]+$`);

function hash32(s) {
  return parseInt(createHash('sha1').update(s).digest('hex').slice(0, 8), 16);
}

/**
 * Entity ids named by a fixture (Map id -> wanted state or null). A condition object {entity, state: "on"} asks
 * for that state, so a card shown only while a condition holds is rendered visible.
 */
function collectEntities(value, into = new Map()) {
  if (typeof value === 'string') {
    if (ENTITY_RE.test(value) && !into.has(value)) into.set(value, null);
  } else if (Array.isArray(value)) {
    for (const v of value) collectEntities(v, into);
  } else if (value && typeof value === 'object') {
    if (typeof value.entity === 'string' && ENTITY_RE.test(value.entity) && typeof value.state === 'string') into.set(value.entity, value.state);
    for (const v of Object.values(value)) collectEntities(v, into);
  }
  return into;
}

function stateFor(id) {
  const [domain, name] = id.split('.');
  const h = hash32(id);
  const num = (h % 90) + 5;
  const base = { friendly_name: name.replace(/_/g, ' ') };
  const table = {
    light: ['on', { brightness: 128, color_mode: 'brightness', supported_color_modes: ['brightness'] }],
    switch: ['on', {}],
    input_boolean: ['on', {}],
    binary_sensor: [h % 2 ? 'on' : 'off', { device_class: 'motion' }],
    sensor: [String(num), { unit_of_measurement: '%', state_class: 'measurement' }],
    input_number: [String(num), { min: 0, max: 100, step: 1, mode: 'slider', unit_of_measurement: '%' }],
    number: [String(num), { min: 0, max: 100, step: 1, mode: 'slider' }],
    climate: ['heat', { current_temperature: 21, temperature: 22, min_temp: 7, max_temp: 35, hvac_modes: ['off', 'heat', 'cool'], hvac_action: 'heating' }],
    media_player: ['playing', { media_title: 'Song', media_artist: 'Artist', volume_level: 0.4, media_duration: 200, media_position: 60 }],
    person: ['home', {}],
    weather: ['sunny', { temperature: 20, humidity: 50, forecast: [] }],
    todo: ['3', {}],
    cover: ['open', { current_position: 60, device_class: 'blind' }],
    camera: ['idle', {}],
    fan: ['on', { percentage: 50 }],
    lock: ['locked', {}],
    vacuum: ['docked', { battery_level: 80 }],
    sun: ['above_horizon', { elevation: 40, azimuth: 180 }],
    input_select: ['one', { options: ['one', 'two', 'three'] }],
    select: ['one', { options: ['one', 'two', 'three'] }],
    input_text: ['text', {}],
    humidifier: ['on', { humidity: 45, min_humidity: 20, max_humidity: 80 }],
    alarm_control_panel: ['disarmed', {}],
    device_tracker: ['home', {}],
    timer: ['idle', {}],
    counter: ['3', {}],
    update: ['off', {}],
  };
  const [state, attrs] = table[domain] ?? ['on', {}];
  return { entity_id: id, state, attributes: { ...base, ...attrs }, last_changed: '2026-01-01T12:00:00+00:00', last_updated: '2026-01-01T12:00:00+00:00', context: { id: 'ctx', parent_id: null, user_id: null } };
}

function makeHass(entities) {
  const states = {};
  for (const id of [...entities.keys()].sort()) {
    states[id] = stateFor(id);
    if (entities.get(id) !== null) states[id].state = entities.get(id);
  }
  const unsub = () => {};
  return {
    states,
    entities: {},
    devices: {},
    areas: {},
    services: {},
    config: { unit_system: { temperature: '°C', length: 'km', mass: 'kg', volume: 'L' }, location_name: 'Home', time_zone: 'UTC', version: '2026.10.0', components: [] },
    locale: { language: 'en', number_format: 'language', time_format: '24', time_zone: 'local', date_format: 'language' },
    language: 'en',
    selectedLanguage: 'en',
    themes: { darkMode: false, theme: 'default', themes: {} },
    selectedTheme: null,
    user: { id: 'u1', name: 'Tester', is_admin: true, is_owner: true },
    panels: {},
    resources: {},
    connected: true,
    callService: () => Promise.resolve(),
    callWS: () => Promise.resolve([]),
    callApi: () => Promise.resolve({}),
    fetchWithAuth: () => Promise.resolve({ ok: false, status: 404, json: async () => ({}), text: async () => '' }),
    formatEntityState: (s) => String(s?.state ?? ''),
    formatEntityAttributeValue: (_s, a) => String(_s?.attributes?.[a] ?? ''),
    formatEntityAttributeName: (_s, a) => String(a),
    connection: {
      subscribeEvents: () => Promise.resolve(unsub),
      subscribeMessage: () => Promise.resolve(unsub),
      sendMessagePromise: () => Promise.resolve([]),
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  };
}

async function loadYaml(file) {
  const jsYaml = await import('js-yaml');
  const text = readFileSync(file, 'utf8');
  if (Buffer.byteLength(text) > MAX_FIXTURE_BYTES) throw new Error(`${file}: larger than ${MAX_FIXTURE_BYTES} bytes`);
  const doc = jsYaml.load(text, { schema: jsYaml.CORE_SCHEMA, maxAliases: MAX_ALIASES });
  // plain objects, prototype-polluting keys dropped
  return JSON.parse(JSON.stringify(doc), (k, v) => (k === '__proto__' || k === 'constructor' || k === 'prototype' ? undefined : v));
}

function fixtureFiles(only) {
  return readdirSync(FIXTURES)
    .filter((f) => /^\d{3}\.yaml$/.test(f))
    .filter((f) => !only || only.includes(f.slice(0, 3)))
    .sort();
}

/** Pin the sources of nondeterminism. Called once per worker before the dist is imported. */
function pinGlobals() {
  const FIXED = Date.UTC(2026, 0, 15, 12, 0, 0);
  const RealDate = Date;
  class FixedDate extends RealDate {
    constructor(...a) {
      if (a.length === 0) super(FIXED);
      else super(...a);
    }
    static now() {
      return FIXED;
    }
  }
  globalThis.Date = FixedDate;
  let seed = 0x9e3779b9;
  Math.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let tick = 0;
  performance.now = () => (tick += 16);
}

function installDom(win) {
  const skip = new Set(['undefined', 'NaN', 'Infinity', 'globalThis', 'console', 'process', 'Date', 'Math', 'performance']);
  const force = new Set(['window', 'document', 'navigator', 'location', 'self', 'top', 'parent', 'frames']);
  const names = new Set(Object.getOwnPropertyNames(win));
  for (const proto of [Object.getPrototypeOf(win)]) {
    for (const n of Object.getOwnPropertyNames(proto ?? {})) names.add(n);
  }
  for (const n of names) {
    if (skip.has(n) || n === 'constructor') continue;
    if (n in globalThis && !force.has(n) && !/^[A-Z]/.test(n) && n !== 'requestAnimationFrame' && n !== 'cancelAnimationFrame') continue;
    if (n in globalThis && /^[A-Z]/.test(n) && !/^(HTML|SVG|Shadow|Document|Node|Element|Event|Mutation|CSS|Custom|Text|Comment|Intersection|Resize|Range|Selection|Keyboard|Mouse|Pointer|Touch|Animation|DOM|Style|Media|Input|Focus|Wheel|Drag|Transition)/.test(n)) continue;
    try {
      Object.defineProperty(globalThis, n, {
        configurable: true,
        get: () => (typeof win[n] === 'function' && !/^[A-Z]/.test(n) ? win[n].bind(win) : win[n]),
        set: (v) => Object.defineProperty(globalThis, n, { value: v, configurable: true, writable: true }),
      });
    } catch {
      // read-only host property: leave the Node one
    }
  }
  globalThis.window = globalThis;
  Object.defineProperty(globalThis, 'document', { configurable: true, value: win.document });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: win.navigator });
  Object.defineProperty(globalThis, 'location', { configurable: true, value: win.location });
  globalThis.customElements = win.customElements;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renderOne(el, hass, config) {
  el.setConfig(config);
  el.hass = hass;
  document.body.appendChild(el);
  let last = null;
  let stable = 0;
  for (let i = 0; i < 80 && stable < 6; i++) {
    if (el.updateComplete) await el.updateComplete;
    await sleep(15);
    const cur = serialise(el.shadowRoot ?? el).join('\n');
    if (cur === last) stable++;
    else {
      stable = 0;
      last = cur;
    }
  }
  return { text: last, settled: stable >= 6 };
}

async function worker(distDir, outFile, only) {
  pinGlobals();
  const { Window } = await import('happy-dom');
  const win = new Window({ url: 'http://localhost:8123/', width: 1024, height: 768, settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true, handleDisabledFileLoadingAsSuccess: true } });
  installDom(win);
  const origErr = console.error;
  const origInfo = console.info;
  const origWarn = console.warn;
  const noise = [];
  console.info = () => {};
  console.warn = (...a) => noise.push(`warn: ${a.map(String).join(' ').slice(0, 200)}`);
  console.error = (...a) => noise.push(`error: ${a.map(String).join(' ').slice(0, 200)}`);
  await import(pathToFileURL(path.join(distDir, 'magic-card.js')).href);
  const Card = customElements.get('magic-card');
  if (!Card) throw new Error('magic-card was not registered by the entry');
  const results = {};
  for (const f of fixtureFiles(only)) {
    const id = f.slice(0, 3);
    try {
      const config = await loadYaml(path.join(FIXTURES, f));
      const hass = makeHass(collectEntities(config));
      const el = document.createElement('magic-card');
      const { text, settled } = await renderOne(el, hass, config);
      el.remove();
      await sleep(5);
      results[id] = { text, settled, nodes: text.split('\n').length };
    } catch (e) {
      results[id] = { error: String(e && e.stack ? e.stack : e).slice(0, 1500) };
    }
  }
  console.error = origErr;
  console.info = origInfo;
  console.warn = origWarn;
  writeFileSync(outFile, JSON.stringify({ dist: distDir, noise: noise.slice(0, 50), results }));
  process.exit(0);
}

function runWorker(distDir, label, only) {
  mkdirSync(CACHE, { recursive: true });
  const out = path.join(CACHE, `render-${label}-${process.pid}.json`);
  const args = [fileURLToPath(import.meta.url), '--worker', distDir, out];
  if (only) args.push('--only', only.join(','));
  const r = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 1 << 28, timeout: 15 * 60 * 1000 });
  if (r.status !== 0 || !existsSync(out)) {
    throw new Error(`render worker (${label}) failed (${r.status})\n${(r.stdout || '').slice(-2000)}\n${(r.stderr || '').slice(-3000)}`);
  }
  const data = JSON.parse(readFileSync(out, 'utf8'));
  rmSync(out, { force: true });
  return data;
}

// ── main ──────────────────────────────────────────────────────────────────────────────────────────

function arg(name) {
  const i = process.argv.indexOf(name);
  return i < 0 ? null : (process.argv[i + 1] ?? null);
}

async function main() {
  if (process.argv.includes('--selftest')) return selftest();
  if (process.argv[2] === '--worker') return worker(process.argv[3], process.argv[4], arg('--only')?.split(','));

  const only = arg('--only')?.split(',') ?? null;
  const rev = arg('--ref') ?? DEFAULT_REF;
  const ref = buildFromArchive(rev);
  let currentDist;
  let currentLabel;
  if (process.argv.includes('--build-head')) {
    const head = buildFromArchive('HEAD');
    currentDist = head.dist;
    currentLabel = `git archive HEAD ${head.sha.slice(0, 12)}`;
  } else {
    currentDist = path.resolve(arg('--dist') ?? path.join(ROOT, 'dist'));
    currentLabel = currentDist;
  }
  if (!existsSync(path.join(currentDist, 'magic-card.js'))) throw new Error(`no magic-card.js in ${currentDist}`);

  console.log(`reference: ${rev} (${ref.sha.slice(0, 12)})  ${ref.dist}`);
  console.log(`current:   ${currentLabel}`);
  const cur = runWorker(currentDist, 'current', only);
  const reference = runWorker(ref.dist, 'reference', only);

  const ids = [...new Set([...Object.keys(cur.results), ...Object.keys(reference.results)])].sort();
  const dump = arg('--dump');
  let identical = 0;
  const diffs = [];
  const failures = [];
  for (const id of ids) {
    const a = cur.results[id];
    const b = reference.results[id];
    if (!a || !b) {
      failures.push(`${id}: missing in ${a ? 'reference' : 'current'}`);
      continue;
    }
    for (const [label, r] of [['current', a], ['reference', b]]) {
      if (r.error) failures.push(`${id} (${label}): render error: ${r.error.split('\n')[0]}`);
      else if (!r.settled) failures.push(`${id} (${label}): did not settle`);
      else if (r.nodes < 4) failures.push(`${id} (${label}): empty render (${r.nodes} lines)`);
    }
    if (a.error || b.error) continue;
    if (dump) {
      for (const [label, r] of [['current', a], ['reference', b]]) {
        mkdirSync(path.join(dump, label), { recursive: true });
        writeFileSync(path.join(dump, label, `${id}.txt`), r.text + '\n');
      }
    }
    if (a.text === b.text) identical++;
    else diffs.push({ id, ...firstDifference(a.text, b.text) });
  }
  const totalLines = ids.reduce((n, id) => n + (cur.results[id]?.nodes ?? 0), 0);
  console.log(`fixtures: ${ids.length}  identical: ${identical}  different: ${diffs.length}  failed: ${failures.length}  (${totalLines} serialised lines in current)`);
  for (const d of diffs.slice(0, 20)) {
    console.log(`\nDIFF ${d.id} first difference at line ${d.line}`);
    console.log('  current:\n    ' + d.current.join('\n    '));
    console.log('  reference:\n    ' + d.reference.join('\n    '));
  }
  if (diffs.length > 20) console.log(`... and ${diffs.length - 20} more`);
  for (const f of failures) console.log(`FAIL ${f}`);
  if (!ids.length) {
    console.log('FAIL no fixture rendered');
    return 2;
  }
  if (failures.length) return 2;
  return diffs.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then(
    (code) => process.exit(code),
    (e) => {
      console.error(e && e.stack ? e.stack : e);
      process.exit(2);
    },
  );
}
