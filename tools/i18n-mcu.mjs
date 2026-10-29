// Namespace 'mcu-panel' (contracts src/contracts/i18n.ts and i18n-keys.ts): the Magic Card Utils panel is plain
// JavaScript with no build step, so its messages are read from the panel source and written to a generated,
// vendored file. Used by tools/i18n-export.mjs (`--mcu <repo>`); the checks D1-D10 run here.
//   <mcu>/custom_components/magic_card_utils/www/magic_card_utils_panel.js   the source: tr('mcu-panel.panel.save', args)
//   <mcu>/i18n/en-GB.json   the English: key -> { text, note, max, vars? }
//   <mcu>/i18n/en-US.json   generated (word list + tools/i18n/en-US-exceptions.json), committed, never edited
//   <mcu>/i18n/nl.json      written by the localizer, committed
//   <www>/mc-i18n-panel.js  generated: three '|' joined tables (en-GB, en-US, nl) and t, tx, locale bound to the keys
// A repository without i18n/en-GB.json still reads British texts as ids (tr('Save')), the form before keys.
//   node tools/i18n-mcu.mjs <mcu repo> [--write] [--reworded-out file]   moves the panel from text ids to keys
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { spellingErrors } from './i18n-check.mjs';
import { applyEdits, applyWrites, kebabWords, quoteLike, reword } from './i18n-codemod.mjs';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');
const ts = require('typescript');

export const PANEL_REL = 'custom_components/magic_card_utils/www/magic_card_utils_panel.js';
export const WWW_REL = 'custom_components/magic_card_utils/www';
export const CATALOGUE_REL = 'i18n';
const NS = 'mcu-panel';
const PLACE = 'panel';
const FNS = new Set(['t', 'tc', 'tx']);
const MAX_PANEL_BYTES = 4 * 1024 * 1024;
const MAX_SLUG_CHARS = 40;
const MAX_GROWTH = 1.6;
const MAX_STEP = 5;

/** Local names the panel binds t, tc and tx to: `{ t: tr, tx: trx } = i18nFor('mcu-panel', ...)` or `import { t as tr } from './mc-i18n-panel.js'`. */
function localNames(sf) {
  const names = new Map();
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isObjectBindingPattern(n.name) && n.initializer && ts.isCallExpression(n.initializer) && ts.isIdentifier(n.initializer.expression) && n.initializer.expression.text === 'i18nFor') {
      for (const el of n.name.elements) {
        const fn = (el.propertyName ?? el.name).text;
        if (FNS.has(fn)) names.set(el.name.text, fn);
      }
    }
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier) && /(^|\/)mc-i18n-panel\.js$/.test(n.moduleSpecifier.text) && n.importClause?.namedBindings && ts.isNamedImports(n.importClause.namedBindings)) {
      for (const el of n.importClause.namedBindings.elements) {
        const fn = (el.propertyName ?? el.name).text;
        if (FNS.has(fn)) names.set(el.name.text, fn);
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return names;
}

const lit = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : undefined);

/**
 * { ids: Set, ctx: Map, keys: Map, calls, violations, hard, names } for the panel source.
 * ids: British texts used as ids (and 'context|text' for tc); keys: key -> [{ file, line }]; calls: every literal call
 * in source order as { fn, local, id, ctx, isKey, start, end, line } (start and end are the offsets of the first argument).
 */
export function scanPanel(source, file = PANEL_REL) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.ES2021, true, ts.ScriptKind.JS);
  const names = localNames(sf);
  const ids = new Set();
  const ctx = new Map();
  const used = new Map();
  const calls = [];
  const violations = [];
  const hard = [];
  const contract = lib.loadContract();
  const { KEY_PATTERN } = lib.loadKeysContract();
  const attrs = new Set(contract.SCANNED_ATTRIBUTES.map((a) => a.replace(/^\./, '')));
  const allow = new Set(lib.readJson(path.join(lib.ROOT, 'tools/i18n/allow.json'), {}).text ?? []);
  const hasLetters = (s) => /[A-Za-z]{2,}/.test(s.replace(/&#?\w+;/g, ' '));
  const userText = (s) => hasLetters(s) && !allow.has(s.trim()) && !/^custom:[\w-]+$/.test(s.trim());
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && names.has(n.expression.text)) {
      const fn = names.get(n.expression.text);
      const first = fn === 'tc' ? n.arguments[1] : n.arguments[0];
      const text = lit(first);
      const c = fn === 'tc' ? lit(n.arguments[0]) : undefined;
      if (text === undefined || (fn === 'tc' && c === undefined)) violations.push(`${file}:${line(n)} ${n.expression.text}(): the id is not a string literal (D1)`);
      else if (fn === 'tc' && c.includes('|')) violations.push(`${file}:${line(n)} tc(): the context contains '|' (D6)`);
      else if (fn !== 'tc' && KEY_PATTERN.test(text)) {
        if (!used.has(text)) used.set(text, []);
        used.get(text).push({ file, line: line(n) });
        calls.push({ fn, local: n.expression.text, id: text, isKey: true, start: first.getStart(sf), end: first.getEnd(), line: line(n) });
      } else {
        const id = fn === 'tc' ? `${c}|${text}` : text;
        ids.add(id);
        if (c !== undefined) ctx.set(id, c);
        calls.push({ fn, local: n.expression.text, id, ctx: c, isKey: false, start: first.getStart(sf), end: first.getEnd(), line: line(n) });
      }
    }
    // D5: html`` text and scanned attributes holding letters outside tr()
    if (ts.isTaggedTemplateExpression(n) && ts.isIdentifier(n.tag) && n.tag.text === 'html') {
      const t = n.template;
      const parts = ts.isNoSubstitutionTemplateLiteral(t) ? [t.text] : [t.head.text, ...t.templateSpans.map((s) => s.literal.text)];
      const joined = parts.join('\u0000').replace(/<!--[\s\S]*?-->/g, '').replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, '');
      for (const m of joined.matchAll(/(?:^|>)([^<>]*)(?=<|$)/g)) {
        const txt = m[1].replaceAll('\0', ' ');
        if (userText(txt)) hard.push(`${file}:${line(n)} text "${txt.trim().slice(0, 40)}"`);
      }
      for (const tag of joined.matchAll(/<[a-z][^<>]*>/gi)) {
        for (const a of tag[0].matchAll(/\s(\.?[a-z][\w-]*)="([^"]*)"/gi)) {
          if (attrs.has(a[1].replace(/^\./, '')) && userText(a[2].replaceAll('\0', ' '))) hard.push(`${file}:${line(n)} ${a[1]}="${a[2].slice(0, 30)}"`);
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { ids, ctx, keys: used, calls, violations, hard, names };
}

const read = (p, fallback) => lib.readJson(p, fallback);

const readPanel = (mcuRoot) => {
  const panel = path.join(mcuRoot, PANEL_REL);
  if (fs.statSync(panel).size > MAX_PANEL_BYTES) throw new Error(`${PANEL_REL}: larger than ${MAX_PANEL_BYTES} bytes, not read`);
  return fs.readFileSync(panel, 'utf8');
};

/** Everything the exporter writes for the panel, plus the check results. */
export function buildPanel(mcuRoot) {
  const dir = path.join(mcuRoot, CATALOGUE_REL);
  if (keys.hasKeys(dir)) return buildKeyed(mcuRoot, dir);
  const { ids, ctx, violations, hard, names } = scanPanel(readPanel(mcuRoot));
  const errors = [...violations];
  if (!names.size) errors.push(`${PANEL_REL}: no i18nFor('mcu-panel', ...) destructuring found`);
  const contract = lib.loadContract();
  const us = lib.generateUS(ids, ctx);
  const nl = read(path.join(mcuRoot, 'i18n/nl.json'), {});
  const list = lib.sortedIds(ids);
  const text = (id) => (ctx.has(id) ? id.slice(ctx.get(id).length + 1) : id);
  for (const id of list) {
    const base = lib.parseMessage(text(id));
    if (base.error) errors.push(`D6 ${NS} "${id}" (en-GB): ${base.error}`);
    const v = nl[id];
    if (typeof v !== 'string' || v.trim() === '') errors.push(`D2 ${NS} "${id}": no nl entry`);
    else {
      const p = lib.parseMessage(v);
      if (p.error) errors.push(`D6 ${NS} "${id}" (nl): ${p.error}`);
      else if (!base.error && lib.argSig(p.args) !== lib.argSig(base.args)) errors.push(`D2 ${NS} "${id}" (nl): arguments differ (${lib.argNames(p.args)} vs ${lib.argNames(base.args)})`);
    }
    for (const m of spellingErrors(contract, text(id))) errors.push(`D3 ${NS} "${id}": ${m}`);
  }
  for (const k of Object.keys(nl)) if (!ids.has(k)) errors.push(`D2 ${NS} nl.json: stale entry "${k}"`);
  for (const h of hard) errors.push(`D5 ${NS} ${h}`);
  const rows = [list, list.map((i) => us[i]), list.map((i) => nl[i] ?? '')];
  const lit1 = (r, i) => '  ' + JSON.stringify((i === 0 ? r.map((x) => x.replace('|', '\u0001')) : r).join('|')) + ',';
  const tables = `// Magic Card Utils panel messages (namespace 'mcu-panel', contract i18n 1.0.0), generated by tools/i18n-export.mjs in the\n// Magic Card repository from magic_card_utils_panel.js, i18n/en-US.json and i18n/nl.json. Do not edit.\n// Three '|' joined tables: en-GB, en-US, nl. Entry i of each is message i.\nexport default [\n${rows.map(lit1).join('\n')}\n];\n`;
  return { count: list.length, errors, usJson: lib.stableJson(us), tables };
}

/** en-US catalogue of a key namespace: the word list and the exceptions applied to each en-GB text, with the current hash. */
function usCatalogue(gb) {
  const toUS = lib.usConverter();
  const out = new Map();
  for (const [key, e] of gb) {
    const text = e && typeof e.text === 'string' ? e.text : '';
    out.set(key, { text: toUS(text), hash: keys.sourceHash(text) });
  }
  return out;
}

/** The generated file of a key namespace: the tables, and t, tx and locale bound to the keys (the runtime takes table indices). */
function keyedTables(rows, indexOf) {
  const lit1 = (r) => '  ' + JSON.stringify(r.join('|')) + ',';
  const map = [...indexOf.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, i]) => `  [${JSON.stringify(k)}, ${i}],`);
  return `// Magic Card Utils panel messages (namespace 'mcu-panel', contracts i18n and i18n-keys), generated by tools/i18n-export.mjs in the
// Magic Card repository from i18n/en-GB.json, i18n/en-US.json and i18n/nl.json. Do not edit.
// Three '|' joined tables: en-GB, en-US, nl. Entry i of each is message i; the key map gives the entry of a key.
import { i18nFor } from "./mc-i18n.js";

const tables = [
${rows.map(lit1).join('\n')}
];

const index = new Map([
${map.join('\n')}
]);

const bound = i18nFor("mcu-panel", tables);
const at = (key) => index.get(key) ?? key;

export const t = (key, args) => bound.t(at(key), args);
export const tx = (key, args) => bound.tx(at(key), args);
export const locale = bound.locale;
export default tables;
`;
}

function buildKeyed(mcuRoot, dir) {
  const { ids, violations, hard, names, keys: used } = scanPanel(readPanel(mcuRoot));
  const errors = [...violations];
  if (!names.size) errors.push(`${PANEL_REL}: no tr / trx binding to the mcu-panel messages found`);
  const contract = lib.loadContract();
  const cat = keys.loadCatalogues(dir);
  cat.us = usCatalogue(cat.gb);
  cat.raw.us = null;
  const waivers = keys.readWaivers(path.join(mcuRoot, lib.loadKeysContract().WAIVERS_FILE));
  for (const id of ids) errors.push(`D1 ${NS} ${PANEL_REL}: "${id.slice(0, 40)}" is not a key; the panel takes keys only`);
  for (const r of keys.checkNamespace({ ns: NS, cat, uses: used, waivers: waivers.waivers, spelling: (t) => spellingErrors(contract, t) })) {
    if (r.level === 'error') errors.push(`${r.rule} ${r.msg}`);
  }
  for (const p of waivers.problems) errors.push(p);
  errors.push(...keys.checkWaivers(waivers.waivers, [cat]));
  for (const h of hard) errors.push(`D5 ${NS} ${h}`);
  for (const [key, e] of cat.gb) {
    for (const loc of ['gb', 'us', 'nl']) {
      const text = loc === 'gb' ? e?.text : cat[loc].get(key)?.text;
      if (typeof text === 'string' && text.includes('|')) errors.push(`D6 ${NS} "${key}" (${loc}): a text cannot hold '|'`);
    }
  }
  const { rows, indexOf, count } = keys.tablesForKeys(cat);
  return { count, errors, usJson: keys.canonicalJson('tr', cat.us), tables: keyedTables(rows, indexOf) };
}

const roundUp = (n, step) => Math.ceil(n / step) * step;

const stringOf = (map, id) => {
  const v = map?.get(id);
  return typeof v === 'string' && v !== '' ? v : undefined;
};

/** The words of a message for its key: an {argument} gives its name, a plural or select gives its `other` branch. */
function flatten(text, depth = 0) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '{') {
      out += text[i];
      continue;
    }
    const j = lib.closeAt(text, i);
    if (j < 0) break;
    const body = text.slice(i + 1, j);
    const other = depth < 3 ? /\bother\s*\{/.exec(body) : null;
    if (other) {
      const open = other.index + other[0].length - 1;
      const close = lib.closeAt(body, open);
      out += ` ${flatten(body.slice(open + 1, close < 0 ? body.length : close), depth + 1)} `;
    } else out += ` ${/^\s*(\w+)/.exec(body)?.[1] ?? ''} `;
    i = j;
  }
  return out;
}

/** Key for one text: namespace, place, slug of its words; a taken slug gets 2, 3 ... */
function allocate(text, claimed, KEY_MAX_CHARS) {
  let slug = '';
  for (const w of kebabWords(flatten(text))) {
    const next = slug ? `${slug}-${w}` : w;
    if (next.length > MAX_SLUG_CHARS) {
      if (!slug) slug = w.slice(0, MAX_SLUG_CHARS);
      break;
    }
    slug = next;
  }
  slug ||= 'text';
  for (let n = 1; n < 1000; n++) {
    const suffix = n === 1 ? '' : `-${n}`;
    const room = Math.max(1, KEY_MAX_CHARS - NS.length - PLACE.length - 2 - suffix.length);
    const key = `${NS}.${PLACE}.${slug.slice(0, room).replace(/-+$/, '') || 'text'}${suffix}`;
    if (!claimed.has(key)) return key;
  }
  return '';
}

const varsFor = (args) => {
  if (!args.size) return undefined;
  const out = {};
  for (const [name, kind] of [...args.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) out[name] = kind === 'plural' ? 'The count the text is about.' : `The value that replaces ${name} in the text.`;
  return out;
};

const longest = (text, ok) => [...(ok ? keys.longestText(text) : text)].length;

/**
 * Moves the panel from text ids to keys: every tr / trx call with a British text becomes a call with a literal key,
 * and i18n/en-GB.json, en-US.json and nl.json are written in the contract's shape (the Dutch text and the
 * hash of the English it was made from carry over). Nothing is written when a call cannot be converted.
 * Returns { keys: Map id -> key, calls, reworded, missingNl, orphans, problems, written }.
 */
export function migratePanel(mcuRoot, { write = false } = {}) {
  const dir = path.join(mcuRoot, CATALOGUE_REL);
  const panelFile = path.join(mcuRoot, PANEL_REL);
  const source = readPanel(mcuRoot);
  const scan = scanPanel(source);
  const { KEY_PATTERN, KEY_MAX_CHARS } = lib.loadKeysContract();
  const problems = [...scan.violations];
  const reworded = [];
  const missingNl = [];
  const idKey = new Map();
  const claimed = new Set();
  const gbOut = new Map();
  const usOut = new Map();
  const nlOut = new Map();
  const edits = [];
  const toUS = lib.usConverter();
  const old = { us: keys.readMap(path.join(dir, 'en-US.json'))?.map ?? new Map(), nl: keys.readMap(path.join(dir, 'nl.json'))?.map ?? new Map() };
  if (keys.hasKeys(dir)) problems.push(`${CATALOGUE_REL}/en-GB.json exists: the panel already has keys`);
  if (!scan.names.size) problems.push(`${PANEL_REL}: no tr / trx binding to the mcu-panel messages found`);

  let converted = 0;
  for (const c of scan.calls) {
    if (c.isKey) continue;
    if (c.fn === 'tc') {
      problems.push(`${PANEL_REL}:${c.line} ${c.local}(): a context call; write it as a plain call first`);
      continue;
    }
    let key = idKey.get(c.id);
    if (!key) {
      const gb = reword(c.id);
      const parsed = lib.parseMessage(gb, false, new Map(), { locale: 'en-GB', quotes: true });
      key = allocate(gb, claimed, KEY_MAX_CHARS);
      if (!key || !KEY_PATTERN.test(key) || key.length > KEY_MAX_CHARS) {
        problems.push(`${PANEL_REL}:${c.line} no valid key for "${c.id.slice(0, 40)}"`);
        continue;
      }
      if (parsed.error) problems.push(`${key}: ${parsed.error}`);
      claimed.add(key);
      idKey.set(c.id, key);
      const entry = { text: gb, note: `Shown in the Magic Card Utils panel (${NS}).`, max: 0 };
      const vars = parsed.error ? undefined : varsFor(parsed.args);
      if (vars) entry.vars = vars;
      if (gb !== c.id) reworded.push({ locale: 'en-GB', from: c.id, to: gb });
      const us = toUS(gb);
      const oldUs = stringOf(old.us, c.id);
      if (oldUs !== undefined && oldUs !== us) reworded.push({ locale: 'en-US', from: oldUs, to: us });
      const oldNl = stringOf(old.nl, c.id);
      const nl = oldNl === undefined ? undefined : reword(oldNl);
      if (oldNl !== undefined && nl !== oldNl) reworded.push({ locale: 'nl', from: oldNl, to: nl });
      entry.max = roundUp(Math.max(Math.ceil(longest(gb, !parsed.error) * MAX_GROWTH), longest(us, true), nl === undefined ? 0 : longest(nl, true)), MAX_STEP);
      gbOut.set(key, entry);
      const hash = keys.sourceHash(gb);
      usOut.set(key, { text: us, hash });
      if (nl === undefined) missingNl.push(key);
      else nlOut.set(key, { text: nl, hash });
    }
    edits.push({ start: c.start, end: c.end, text: quoteLike(source, c.start, key) });
    converted++;
  }

  const blocked = problems.length > 0;
  const writes = new Map();
  if (!blocked && converted) {
    writes.set(panelFile, applyEdits(source, edits));
    writes.set(path.join(dir, 'en-GB.json'), keys.canonicalJson('gb', gbOut));
    writes.set(path.join(dir, 'en-US.json'), keys.canonicalJson('tr', usOut));
    writes.set(path.join(dir, 'nl.json'), keys.canonicalJson('tr', nlOut));
  }
  const written = write && writes.size > 0;
  if (written) applyWrites(writes);
  return {
    keys: idKey,
    calls: converted,
    reworded,
    missingNl: missingNl.sort(),
    orphans: { nl: [...old.nl.keys()].filter((id) => !idKey.has(id)).sort(), us: [...old.us.keys()].filter((id) => !idKey.has(id)).sort() },
    problems: blocked ? [...problems, 'nothing written: fix the calls above and run again'] : problems,
    written,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const rwOut = args.includes('--reworded-out') ? args[args.indexOf('--reworded-out') + 1] : undefined;
  const root = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--reworded-out');
  if (!root) {
    console.error('usage: node tools/i18n-mcu.mjs <magic-card-utils repo> [--write] [--reworded-out file]');
    process.exit(2);
  }
  try {
    const r = migratePanel(root, { write });
    console.log(`${write ? '' : 'dry run, nothing written: '}${NS}: ${r.keys.size} keys for ${r.calls} calls${r.written ? ' (written)' : ''}`);
    if (r.reworded.length) console.log(`reworded:\n${r.reworded.map((x) => `  ${x.locale}: ${JSON.stringify(x.from)} -> ${JSON.stringify(x.to)}`).join('\n')}`);
    if (r.missingNl.length) console.log(`no nl text yet (${r.missingNl.length}):\n${r.missingNl.map((k) => `  ${k}`).join('\n')}`);
    const orphans = [...r.orphans.nl.map((id) => `nl ${JSON.stringify(id)}`), ...r.orphans.us.map((id) => `en-US ${JSON.stringify(id)}`)];
    if (orphans.length) console.log(`catalogue entries no call uses (dropped):\n${orphans.slice(0, 20).map((x) => `  ${x}`).join('\n')}`);
    if (r.problems.length) console.log(`problems:\n${r.problems.map((p) => `  ${p}`).join('\n')}`);
    if (rwOut) fs.writeFileSync(rwOut, JSON.stringify(r.reworded, null, 2) + '\n');
    process.exit(r.problems.length ? 1 : 0);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
