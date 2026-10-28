// Renames one message key (contract src/contracts/i18n-keys.ts, "Renames").
//
//   node tools/i18n-rename.mjs <from> <to> [--dry-run]
//
// The en-GB, en-US and nl entries of <from> move to <to> with their notes and hashes, the waivers of <from> follow,
// the literal at every call site is rewritten, and { from, to } is appended to i18n/renames.json. <to> may belong
// to another namespace (a control moved to another screen); then every file that calls the key must already
// import the same function from that namespace's i18n folder, and its call is pointed at that import.
// The tool refuses before it writes anything when <to> exists, was the source of an earlier rename, is outside
// the key pattern, or a call site cannot be moved; a failed write puts the files back.
// i18n/renames.json is read by tools only; no file in src may import it.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { applyEdits, applyWrites, nsImports, quoteLike, relFile, sourceFiles } from './i18n-codemod.mjs';

const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
/** Files looked at for other mentions of the old key. */
const MENTION_EXTENSIONS = new Set(['.ts', '.mjs', '.cjs', '.js', '.json', '.md']);
const MAX_MENTIONS = 200;

const isObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

function readArray(file, label) {
  if (!fs.existsSync(file)) return [];
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`${label}: not valid JSON (${e.message})`, { cause: e });
  }
  if (!Array.isArray(data)) throw new Error(`${label}: not a JSON array`);
  return data;
}

/** Files under the given folders that contain `needle`, as paths relative to root. */
function mentionsOf(needle, dirs, root, skip) {
  const out = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (out.length >= MAX_MENTIONS || e.name === 'node_modules') continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (MENTION_EXTENSIONS.has(path.extname(e.name)) && !skip.has(p) && fs.statSync(p).size <= MAX_SOURCE_BYTES && fs.readFileSync(p, 'utf8').includes(needle)) out.push(relFile(root, p));
    }
  };
  for (const d of dirs) walk(d);
  return out.sort();
}

/**
 * Renames a key. Returns { files (relative paths written or to write), calls, waivers, mentions, written }.
 * Throws, with nothing written, when the rename is refused.
 */
export function renameKey({ from, to, nsList = lib.activeNamespaces(), files, root = lib.ROOT, waiversFile, renamesFile, extraDirs, write = true }) {
  const contract = lib.loadKeysContract();
  waiversFile ??= path.join(root, contract.WAIVERS_FILE);
  renamesFile ??= path.join(root, contract.RENAMES_FILE);
  extraDirs ??= [path.join(root, 'tests')];

  for (const [label, k] of [['from', from], ['to', to]]) {
    if (typeof k !== 'string' || !contract.KEY_PATTERN.test(k)) throw new Error(`${label} "${String(k).slice(0, 60)}" does not match the key pattern`);
    if (k.length > contract.KEY_MAX_CHARS) throw new Error(`${label} "${k}" is longer than ${contract.KEY_MAX_CHARS} characters`);
  }
  if (from === to) throw new Error('from and to are the same key');

  const byName = new Map(nsList.map((n) => [n.ns, n]));
  const fromNs = from.split('.')[0];
  const toNs = to.split('.')[0];
  const fromEntry = byName.get(fromNs);
  const toEntry = byName.get(toNs);
  if (!fromEntry) throw new Error(`namespace "${fromNs}" is not in tools/i18n/config.json`);
  if (!toEntry) throw new Error(`namespace "${toNs}" is not in tools/i18n/config.json`);

  const sameNs = fromNs === toNs;
  const fromCat = keys.loadCatalogues(fromEntry.dir);
  const toCat = sameNs ? fromCat : keys.loadCatalogues(toEntry.dir);
  if (!fromCat.has || !fromCat.gb.has(from)) throw new Error(`"${from}" is not in ${fromNs}/en-GB.json`);
  if (!toCat.has) throw new Error(`namespace "${toNs}" has no en-GB.json; its keys are not in use yet`);
  if (toCat.gb.has(to) || toCat.us.has(to) || toCat.nl.has(to)) throw new Error(`"${to}" already exists`);

  const renames = readArray(renamesFile, contract.RENAMES_FILE);
  if (renames.some((r) => isObject(r) && r.from === to)) throw new Error(`"${to}" was renamed away by an earlier rename; a key is never reused`);

  // catalogues: copies of the Maps, so nothing changes until every check has passed
  const slots = [['gb', 'en-GB.json', 'gb'], ['us', 'en-US.json', 'tr'], ['nl', 'nl.json', 'tr']];
  const next = (cat) => ({ gb: new Map(cat.gb), us: new Map(cat.us), nl: new Map(cat.nl) });
  const fromMaps = next(fromCat);
  const toMaps = sameNs ? fromMaps : next(toCat);
  const touched = new Map(); // `${dir}\0${slot}` -> { dir, slot, file, kind, map }
  for (const [slot, file, kind] of slots) {
    if (!fromMaps[slot].has(from)) continue;
    toMaps[slot].set(to, fromMaps[slot].get(from));
    fromMaps[slot].delete(from);
    touched.set(`${fromEntry.dir}\0${slot}`, { dir: fromEntry.dir, file, kind, map: fromMaps[slot] });
    touched.set(`${toEntry.dir}\0${slot}`, { dir: toEntry.dir, file, kind, map: toMaps[slot] });
  }

  // call sites
  const writes = new Map();
  const problems = [];
  let calls = 0;
  const callFiles = new Set();
  for (const file of [...(files ?? sourceFiles())].sort()) {
    if (fs.statSync(file).size > MAX_SOURCE_BYTES) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(from)) continue;
    const scan = lib.scanSource(file, source, nsList);
    const mine = scan.calls.filter((c) => c.kind === 'key' && c.id === from);
    if (!mine.length) continue;
    const rf = relFile(root, file);
    const targets = sameNs ? [] : nsImports(scan.sf, file, nsList).filter((i) => i.ns === toNs).flatMap((i) => i.elements);
    const edits = [];
    for (const c of mine) {
      edits.push({ start: c.start, end: c.end, text: quoteLike(source, c.start, to) });
      if (!sameNs) {
        const want = c.fn === 'lm' ? 'm' : c.fn;
        const local = targets.find((e) => e.imported === want)?.local;
        if (!local) {
          problems.push(`${rf}:${c.line} calls ${c.fn}, but the file does not import ${want} from the ${toNs} i18n folder; add that import first`);
          continue;
        }
        const callee = /^[\w$]+/.exec(source.slice(c.callStart, c.callStart + 80))[0];
        if (callee !== local) edits.push({ start: c.callStart, end: c.callStart + callee.length, text: local });
      }
      calls++;
    }
    callFiles.add(file);
    writes.set(file, applyEdits(source, edits));
  }
  if (problems.length) throw new Error(problems.join('\n'));

  for (const t of touched.values()) writes.set(path.join(t.dir, t.file), keys.canonicalJson(t.kind, t.map));

  // waivers follow the key
  const waivers = readArray(waiversFile, contract.WAIVERS_FILE);
  let moved = 0;
  const waiversOut = waivers.map((w) => {
    if (!isObject(w) || w.key !== from) return w;
    moved++;
    return { ...w, key: to };
  });
  if (moved) writes.set(waiversFile, JSON.stringify(waiversOut, null, 2) + '\n');

  writes.set(renamesFile, JSON.stringify([...renames, { from, to }], null, 2) + '\n');

  const mentions = mentionsOf(from, extraDirs, root, new Set([...callFiles]));
  const result = { files: [...writes.keys()].map((f) => relFile(root, f)).sort(), calls, waivers: moved, mentions, written: false };
  if (write) {
    applyWrites(writes);
    result.written = true;
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const [from, to] = args.filter((a) => !a.startsWith('--'));
  const dry = args.includes('--dry-run');
  if (!from || !to) {
    console.error('usage: node tools/i18n-rename.mjs <from> <to> [--dry-run]');
    process.exit(2);
  }
  try {
    const r = renameKey({ from, to, write: !dry });
    console.log(`${dry ? 'dry run, nothing written: ' : ''}${from} -> ${to}: ${r.calls} calls, ${r.waivers} waivers, ${r.files.length} files${r.written ? ' written' : ''}`);
    for (const f of r.files) console.log(`  ${f}`);
    if (r.mentions.length) console.log(`still mentions ${from} (not changed, check by hand):\n${r.mentions.map((m) => `  ${m}`).join('\n')}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
