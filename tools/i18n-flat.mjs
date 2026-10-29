// Exchange files for translation services (contract src/contracts/i18n-keys.ts, "Exchange files"): one ARB file per
// locale under i18n/flat/, the card namespaces and, with --mcu, the Magic Card Utils namespace together.
//   node tools/i18n-flat.mjs export [--mcu <magic-card-utils repo>]   writes i18n/flat/<locale>.arb
//   node tools/i18n-flat.mjs import [--mcu <repo>] [--locale <l>] [file ...]
//        reads the files a service returned (default: en-US.arb and nl.arb of i18n/flat/) and writes nl.json and the
//        en-US exceptions back; the English file is never read (en-GB.json is the source of the English)
//   node tools/i18n-flat.mjs --check [--mcu <repo>]                    exit 1 when the committed files differ from an export
// A returned file is untrusted: size-capped before parsing, read through Maps, every text checked as a message
// against the English before anything is written (all or nothing). Its "@<key>" objects and "x-" values are never
// read; export rebuilds them from en-GB.json.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

const contract = lib.loadKeysContract();
const BASE = 'en-GB';
const TRANSLATIONS = ['en-US', 'nl'];
const LOCALES = [BASE, ...TRANSLATIONS];
const MCU_NS = 'mcu-panel';
const PROTOTYPE_NAMES = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_TEXT_CHARS = 2000;
const MAX_REPORTED = 40;
// eslint-disable-next-line no-control-regex -- the check is for control characters
const CONTROL = /[\u0000-\u001f\u007f]/;
const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const rel = (p) => path.relative(lib.ROOT, p).split(path.sep).join('/');

class Refusal extends Error {}
const refuse = (...lines) => {
  throw new Refusal(lines.join('\n'));
};

// ---- the catalogues ----

/** Every key namespace as { ns, dir, cat }; the Magic Card Utils namespace when a repository is given. */
function loadNamespaces(mcu) {
  const out = [];
  for (const n of lib.activeNamespaces()) {
    const cat = keys.loadCatalogues(n.dir);
    if (cat.has) out.push({ ns: n.ns, dir: n.dir, cat });
  }
  if (mcu) {
    const dir = path.resolve(mcu, 'i18n');
    const cat = keys.loadCatalogues(dir);
    if (!cat.has) refuse(`${dir}: no en-GB.json (is "${mcu}" the Magic Card Utils repository?)`);
    out.push({ ns: MCU_NS, dir, cat });
  }
  return out;
}

const isObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const textOf = (e) => (isObject(e) && typeof e.text === 'string' ? e.text : '');

/** key -> { ns, gb: { text, note, max, vars } } for every English entry. */
function modelOf(namespaces) {
  const model = new Map();
  for (const { ns, cat } of namespaces) {
    for (const [key, e] of cat.gb) {
      if (!isObject(e) || typeof e.text !== 'string') continue;
      model.set(key, { key, ns, gb: e });
    }
  }
  return model;
}

/** key -> old keys: every `from` of renames.json whose chain of renames ends at the key. */
function aliasesOf(model) {
  const file = path.join(lib.ROOT, contract.RENAMES_FILE);
  let list = [];
  if (fs.existsSync(file)) {
    try {
      list = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      list = [];
    }
  }
  const next = new Map();
  if (Array.isArray(list)) for (const r of list) if (isObject(r) && typeof r.from === 'string' && typeof r.to === 'string') next.set(r.from, r.to);
  const out = new Map();
  for (const from of next.keys()) {
    let to = next.get(from);
    for (let hops = 0; next.has(to) && hops < 100; hops++) to = next.get(to);
    if (!model.has(to) || model.has(from)) continue;
    if (!out.has(to)) out.set(to, []);
    out.get(to).push(from);
  }
  for (const list2 of out.values()) list2.sort(byCode);
  return out;
}

const wordList = () => lib.loadContract().EN_US_WORDS;
const exceptionsFile = () => path.join(lib.ROOT, 'tools/i18n/en-US-exceptions.json');
function readExceptions() {
  const out = new Map();
  if (!fs.existsSync(exceptionsFile())) return out;
  const data = JSON.parse(fs.readFileSync(exceptionsFile(), 'utf8'));
  if (isObject(data)) for (const [k, v] of Object.entries(data)) if (typeof v === 'string') out.set(k, v);
  return out;
}

// ---- export ----

const stop = (s) => {
  const t = s.trim();
  return /[.!?]$/.test(t) ? t : t + '.';
};

/** The plural categories a message uses, in the order they are written (=N branches are not categories). */
function pluralCategories(text) {
  const out = [];
  if (text.length > MAX_TEXT_CHARS) return out;
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '{') continue;
    const j = lib.closeAt(text, i);
    if (j < 0) break;
    const m = /^\s*\w+\s*,\s*plural\s*,([\s\S]*)$/.exec(text.slice(i + 1, j));
    if (m) {
      let r = m[1];
      for (;;) {
        const q = /^\s*(=?\w+)\s*\{/.exec(r);
        if (!q) break;
        const open = q[0].length - 1;
        const e = lib.closeAt(r, open);
        if (e < 0) break;
        if (!q[1].startsWith('=') && !out.includes(q[1])) out.push(q[1]);
        r = r.slice(e + 1);
      }
    }
    i = j;
  }
  return out;
}

function descriptionOf(gb) {
  const vars = isObject(gb.vars) ? gb.vars : {};
  const names = Object.keys(vars).sort(byCode);
  return [stop(String(gb.note ?? '')), ...names.map((n) => '{' + n + '}: ' + stop(String(vars[n]))), 'Max ' + gb.max + ' characters.'].join(' ');
}

/** The text of one locale for a key: '' when the locale has none yet (an untranslated unit). */
function localeText(locale, row, ns, toUS) {
  if (locale === BASE) return row.gb.text;
  const cat = ns.cat;
  if (locale === 'en-US') return textOf(cat.us.get(row.key)) || toUS(row.gb.text);
  return textOf(cat.nl.get(row.key));
}

/** locale -> file content. */
function exportAll(namespaces) {
  const model = modelOf(namespaces);
  const byNs = new Map(namespaces.map((n) => [n.ns, n]));
  const aliases = aliasesOf(model);
  const toUS = lib.usConverter();
  const rows = [...model.values()].sort((a, b) => byCode(a.key, b.key));
  const files = new Map();
  for (const locale of LOCALES) {
    const entries = [['@@locale', locale]];
    for (const row of rows) {
      const ns = byNs.get(row.ns);
      const hash = keys.sourceHash(row.gb.text);
      const text = localeText(locale, row, ns, toUS);
      const meta = { description: descriptionOf(row.gb) };
      if (locale !== BASE) meta.source_text = row.gb.text;
      meta['x-max-length'] = row.gb.max;
      meta['x-source-hash'] = hash;
      if (locale === 'nl') {
        const have = ns.cat.nl.get(row.key);
        if (isObject(have) && have.hash !== hash) meta['x-stale'] = true;
      }
      const plural = pluralCategories(text);
      if (plural.length) meta['x-plural'] = plural;
      if (aliases.has(row.key)) meta['x-aliases'] = aliases.get(row.key);
      entries.push([row.key, text], ['@' + row.key, meta]);
    }
    files.set(locale, JSON.stringify(Object.fromEntries(entries), null, 2) + '\n');
  }
  return files;
}

const exchangeDir = () => path.join(lib.ROOT, contract.EXCHANGE_DIR);
const exchangeFile = (locale) => path.join(exchangeDir(), `${locale}.arb`);

function holdsMcuKeys(file) {
  if (!fs.existsSync(file) || fs.statSync(file).size > contract.EXCHANGE_MAX_BYTES) return false;
  try {
    return Object.keys(JSON.parse(fs.readFileSync(file, 'utf8'))).some((k) => k.startsWith(MCU_NS + '.'));
  } catch {
    return false;
  }
}

function runExport(mcu) {
  if (!mcu && holdsMcuKeys(exchangeFile(BASE))) refuse(`${rel(exchangeFile(BASE))} holds ${MCU_NS} keys: pass --mcu <magic-card-utils repo> so the export keeps them`);
  const files = exportAll(loadNamespaces(mcu));
  fs.mkdirSync(exchangeDir(), { recursive: true });
  for (const [locale, content] of files) {
    const file = exchangeFile(locale);
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) fs.writeFileSync(file, content);
    console.log(`${rel(file)} ${Buffer.byteLength(content)} B`);
  }
}

/** Without --mcu the Magic Card Utils entries of a committed file are left out of the comparison. */
function withoutMcu(raw) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObject(data)) return null;
  const kept = Object.entries(data).filter(([k]) => !k.replace(/^@+/, '').startsWith(MCU_NS + '.'));
  return JSON.stringify(Object.fromEntries(kept), null, 2) + '\n';
}

function runCheck(mcu) {
  const want = exportAll(loadNamespaces(mcu));
  const stale = [];
  const dir = exchangeDir();
  const present = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.arb')) : [];
  for (const locale of LOCALES) {
    const file = exchangeFile(locale);
    if (!fs.existsSync(file)) {
      stale.push(`${rel(file)} is missing`);
      continue;
    }
    if (fs.statSync(file).size > contract.EXCHANGE_MAX_BYTES) {
      stale.push(`${rel(file)} is over the size cap`);
      continue;
    }
    let have = fs.readFileSync(file, 'utf8');
    if (!mcu) have = withoutMcu(have) ?? have;
    if (have !== want.get(locale)) stale.push(`${rel(file)} differs from a fresh export`);
  }
  for (const f of present) if (!LOCALES.some((l) => f === `${l}.arb`)) stale.push(`${rel(path.join(dir, f))} is not an exchange file of this project`);
  for (const s of stale) console.error('FAIL ' + s);
  if (stale.length) {
    console.error('run: node tools/i18n-flat.mjs export');
    return 1;
  }
  console.log(`exchange files ok (${LOCALES.length} locales)`);
  return 0;
}

// ---- import ----

/** One returned file as a Map name -> value, after the size cap and the name checks. */
function readExchange(file, locale, errors) {
  const name = rel(path.resolve(file));
  let size;
  try {
    size = fs.statSync(file).size;
  } catch {
    errors.push(`${name}: cannot be read`);
    return null;
  }
  if (size > contract.EXCHANGE_MAX_BYTES) {
    errors.push(`${name}: ${size} bytes is over the ${contract.EXCHANGE_MAX_BYTES} byte cap`);
    return null;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${name}: not valid JSON (${String(e.message).slice(0, 80)})`);
    return null;
  }
  if (!isObject(data)) {
    errors.push(`${name}: not a JSON object`);
    return null;
  }
  const values = new Map();
  for (const key of Object.keys(data)) {
    if (PROTOTYPE_NAMES.has(key.replace(/^@+/, ''))) {
      errors.push(`${name}: the name "${key}" is refused`);
      continue;
    }
    if (key === '@@locale') {
      if (data[key] !== locale) errors.push(`${name}: "@@locale" is ${JSON.stringify(String(data[key]).slice(0, 20))}, this file is ${locale}`);
      continue;
    }
    if (key.startsWith('@')) continue;
    values.set(key, data[key]);
  }
  return { name, values };
}

/** The texts of one returned file that pass the checks: Map key -> text. Problems go to errors. */
function checkTexts(file, locale, model, errors) {
  const texts = new Map();
  const unknown = [];
  for (const [key, value] of file.values) {
    const row = contract.KEY_PATTERN.test(key) ? model.get(key) : undefined;
    if (!row) {
      unknown.push(key);
      continue;
    }
    if (typeof value !== 'string') {
      errors.push(`${file.name}: "${key}" is not a text`);
      continue;
    }
    if (value.trim() === '') continue;
    const bad = textProblem(value, locale, row);
    if (bad) errors.push(`${file.name}: "${key}" ${bad}`);
    else texts.set(key, value);
  }
  for (const key of unknown.slice(0, MAX_REPORTED)) errors.push(`${file.name}: unknown key ${JSON.stringify(key.slice(0, 120))} is not in en-GB.json (delete it in the service)`);
  if (unknown.length > MAX_REPORTED) errors.push(`${file.name}: and ${unknown.length - MAX_REPORTED} more unknown keys`);
  return texts;
}

/** '' when a returned text is fine for its key: a valid message (D6) with the English arguments (D2) that fits (D8). */
function textProblem(text, locale, row) {
  if (text.length > MAX_TEXT_CHARS) return `is longer than ${MAX_TEXT_CHARS} characters`;
  if (CONTROL.test(text)) return 'has a control character';
  const p = lib.parseMessage(text, false, new Map(), { locale, quotes: true });
  if (p.error) return `(${locale}): ${p.error}`;
  const base = lib.parseMessage(row.gb.text, false, new Map(), { locale: BASE, quotes: true });
  if (!base.error && lib.argSig(p.args) !== lib.argSig(base.args)) return `(${locale}): arguments differ (${lib.argNames(p.args) || 'none'} vs ${lib.argNames(base.args) || 'none'})`;
  const longest = [...keys.longestText(text)].length;
  if (Number.isInteger(row.gb.max) && longest > row.gb.max) return `(${locale}): ${longest} characters, max is ${row.gb.max}`;
  return '';
}

/** Map file path -> new content for the Dutch texts that changed. */
function planDutch(texts, model, namespaces) {
  const writes = new Map();
  const byNs = new Map(namespaces.map((n) => [n.ns, n]));
  const changed = new Map();
  for (const [key, text] of texts) {
    const row = model.get(key);
    const have = byNs.get(row.ns).cat.nl.get(key);
    if (textOf(have) === text) continue;
    if (!changed.has(row.ns)) changed.set(row.ns, new Map(byNs.get(row.ns).cat.nl));
    changed.get(row.ns).set(key, { text, hash: keys.sourceHash(row.gb.text) });
  }
  for (const [ns, map] of changed) writes.set(path.join(byNs.get(ns).dir, 'nl.json'), keys.canonicalJson('tr', map));
  return writes;
}

/** Map file path -> new content for the en-US exceptions: a returned American text that differs from what the English makes. */
function planAmerican(texts, model, errors) {
  const words = wordList();
  const exceptions = readExceptions();
  const next = new Map(exceptions);
  const wanted = new Map();
  for (const [key, text] of texts) {
    const english = model.get(key).gb.text;
    const made = lib.usText(english, words);
    const current = exceptions.has(english) ? exceptions.get(english) : made;
    if (text === current) continue;
    if (wanted.has(english) && wanted.get(english) !== text) errors.push(`en-US: two different texts for the English ${JSON.stringify(english.slice(0, 60))}`);
    wanted.set(english, text);
    if (text === made) next.delete(english);
    else next.set(english, text);
  }
  const out = new Map();
  if (!wanted.size) return out;
  const sorted = Object.fromEntries([...next].sort((a, b) => byCode(a[0], b[0])));
  out.set(exceptionsFile(), JSON.stringify(sorted, null, 2) + '\n');
  return out;
}

function runImport({ mcu, locale, files }) {
  if (locale && !TRANSLATIONS.includes(locale)) refuse(`--locale ${JSON.stringify(locale.slice(0, 20))}: expected ${TRANSLATIONS.join(' or ')}`);
  const jobs = [];
  if (files.length) {
    if (locale && files.length !== 1) refuse('--locale takes exactly one file');
    for (const f of files) {
      const l = locale || path.basename(f).replace(/\.arb$/, '');
      if (!TRANSLATIONS.includes(l)) refuse(`${f}: the locale comes from the file name (${TRANSLATIONS.map((x) => x + '.arb').join(' or ')}) or --locale`);
      jobs.push({ file: f, locale: l });
    }
  } else {
    if (!fs.existsSync(exchangeDir())) refuse(`${rel(exchangeDir())} does not exist: run export first, or name the files`);
    for (const l of TRANSLATIONS) if (fs.existsSync(exchangeFile(l))) jobs.push({ file: exchangeFile(l), locale: l });
    if (!jobs.length) refuse(`${rel(exchangeDir())} holds no ${TRANSLATIONS.map((x) => x + '.arb').join(' or ')}`);
  }
  const namespaces = loadNamespaces(mcu);
  const model = modelOf(namespaces);
  const errors = [];
  const writes = new Map();
  for (const job of jobs) {
    const file = readExchange(job.file, job.locale, errors);
    if (!file) continue;
    const texts = checkTexts(file, job.locale, model, errors);
    const plan = job.locale === 'nl' ? planDutch(texts, model, namespaces) : planAmerican(texts, model, errors);
    for (const [p, content] of plan) writes.set(p, content);
  }
  if (errors.length) refuse(...errors.map((e) => 'FAIL ' + e), 'nothing was written');
  for (const [p, content] of writes) {
    fs.writeFileSync(p, content);
    console.log(`wrote ${rel(p)}`);
  }
  if (!writes.size) console.log('import: nothing changed');
}

// ---- command line ----

function parseArgs(argv) {
  const out = { command: '', mcu: '', locale: '', files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--mcu') out.mcu = argv[++i] ?? refuse('--mcu needs a path');
    else if (a === '--locale') out.locale = argv[++i] ?? refuse('--locale needs a locale');
    else if (a === '--check') out.command = 'check';
    else if (a.startsWith('--')) refuse(`unknown option ${a.slice(0, 40)}`);
    else if (!out.command && (a === 'export' || a === 'import')) out.command = a;
    else out.files.push(a);
  }
  return out;
}

export function main(argv) {
  try {
    const args = parseArgs(argv);
    if (args.command === 'export') runExport(args.mcu);
    else if (args.command === 'import') runImport(args);
    else if (args.command === 'check') return runCheck(args.mcu);
    else refuse('usage: node tools/i18n-flat.mjs export|import|--check [--mcu <magic-card-utils repo>]');
    return 0;
  } catch (e) {
    if (!(e instanceof Refusal)) throw e;
    console.error(e.message);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)));
