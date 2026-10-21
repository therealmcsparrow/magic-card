// SVG sink gate. Every chunk of the card bundle that holds an SVG sink must hold the
// sanitiser (src/icons/svg-sanitize.ts, statically imported) itself, or every chain of parent chunks from magic-card.js to
// it must pass through a chunk that does (a shared chunk, lazy-module LAZY_SHARED_CHUNK_FILES, loads beside its user and is not a parent); never only in a sibling, never behind its own import().
//
// A sink is a source module that (a) calls unsafeSVG() / imports lit's unsafe-svg directive, or (b) imports the sanitiser
// (it handles untrusted SVG), found by scanning src/**/*.ts, plus the modules named in tools/svg-sinks.json `sinks`.
// The built graph (node_modules/.cache/magic-card/entry-graph.json, production build, with `parents`) is then checked:
//   1. every chunk that holds a sink holds the sanitiser itself or in an ancestor chunk (a chunk's parents are loaded
//      before it, so a static import is always satisfied there; --strict wants the chunk itself);
//   2. no chunk holds the sanitiser only in a sibling: that is the same test, it fails by 1;
//   3. the svg-icon chunk exists, holds mc-svg-icon.ts and icon-source.ts, and the entry (magic-card.js) holds neither.
//
// Usage: node tools/check-svg-sinks.mjs [--strict] [stats.json]    check the last production build
//        node tools/check-svg-sinks.mjs --self-test                the rule against synthetic graphs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATS_DEFAULT = path.join(root, 'node_modules/.cache/magic-card/entry-graph.json');
const RULES_REL = 'tools/svg-sinks.json';
export const SANITIZER = './src/icons/svg-sanitize.ts';
const ENTRY = 'magic-card.js';

const CONTRACT_REL = 'src/contracts/lazy-module.ts';

/** File names of the shared chunks, read from LAZY_SHARED_CHUNK_FILES in the lazy-module contract. */
export const sharedChunkFiles = (file = path.join(root, CONTRACT_REL)) => {
  const block = /LAZY_SHARED_CHUNK_FILES[^=]*=\s*\{([^}]*)\}/.exec(readFileSync(file, 'utf8'));
  const files = block ? [...block[1].matchAll(/:\s*'([^']+\.js)'/g)].map((m) => m[1]) : [];
  if (!files.length) throw new Error(`no LAZY_SHARED_CHUNK_FILES in ${file}`);
  return files;
};

const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`cannot read ${what} (${file}): ${e.message}`);
  }
};

// ── sinks found in the sources ───────────────────────────────────────────────

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.ts') && !p.endsWith('.d.ts')) out.push(p);
  }
  return out;
};

/** True when a source text is an SVG sink: unsafeSVG, or a value import of the sanitiser. */
export const isSinkSource = (text) =>
  /lit\/directives\/unsafe-svg|\bunsafeSVG\s*\(/.test(text) || /^import\s+(?!type\b)[^;]*from\s+'[^']*svg-sanitize'/m.test(text);

export const sinksInSources = (srcDir = path.join(root, 'src')) =>
  walk(srcDir)
    .filter((f) => path.relative(srcDir, f).replace(/\\/g, '/') !== 'icons/svg-sanitize.ts')
    .filter((f) => isSinkSource(readFileSync(f, 'utf8')))
    .map((f) => `./src/${path.relative(srcDir, f).replace(/\\/g, '/')}`)
    .sort();

// ── the rule (pure) ──────────────────────────────────────────────────────────

// A shared chunk is fetched in the same Promise.all as the chunk that uses it: a sibling of its user, never what loads it.
// webpack still lists it among the user's parents; it is left out of the parent set (it is checked as a sink holder itself).
// Built file names carry a content hash (magic-card-path-core.cb8d4820.js); the contract names the unhashed file.
const unhashed = (f) => f.replace(/\.[0-9a-f]{6,}\.js$/, '.js');
const isShared = (c, shared) => (c.files ?? []).some((f) => shared.includes(unhashed(f)));
const loaders = (chunk, byId, shared) => (chunk.parents ?? []).filter((id) => !(byId.get(id) && isShared(byId.get(id), shared)));

const ancestors = (chunk, byId, shared) => {
  const out = [];
  const seen = new Set([chunk.id]);
  const todo = [...loaders(chunk, byId, shared)];
  while (todo.length) {
    const id = todo.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    const c = byId.get(id);
    if (!c) continue;
    out.push(c);
    todo.push(...loaders(c, byId, shared));
  }
  return out;
};

/**
 * The sanitiser is installed before the chunk runs on EVERY path to it: the chunk holds it, or it has parents and each
 * one is available. A child's import() is code inside its parent, so what a parent holds is installed first. A chunk with a
 * parent that lacks it (a second parent, a sibling, an entry without it) fails: one good ancestor on one path is not enough.
 */
const available = (chunk, byId, shared, seen = new Set()) => {
  if ((chunk.modules ?? []).includes(SANITIZER)) return true;
  const parents = loaders(chunk, byId, shared);
  if (!parents.length || seen.has(chunk.id)) return false;
  seen.add(chunk.id);
  return parents.every((id) => {
    const p = byId.get(id);
    return !!p && available(p, byId, shared, new Set(seen));
  });
};

const label = (c) => (c.files ?? []).find((f) => f.endsWith('.js')) ?? (c.names ?? []).join('+') ?? String(c.id);

/** Returns { problems, notes }. `sinks`: module names; `strict`: the sanitiser must sit in the sink's own chunk. */
export const evaluate = ({ chunks, sinks, strict = false, shared = sharedChunkFiles() }) => {
  const problems = [];
  const notes = [];
  const byId = new Map(chunks.map((c) => [c.id, c]));
  for (const c of chunks) {
    const here = new Set(c.modules ?? []);
    const held = sinks.filter((s) => here.has(s));
    if (!held.length) continue;
    if (here.has(SANITIZER)) {
      notes.push(`${label(c)}: ${held.length} sink module${held.length === 1 ? '' : 's'}, sanitiser in the same chunk`);
      continue;
    }
    const from = ancestors(c, byId, shared).find((a) => (a.modules ?? []).includes(SANITIZER));
    if (from && !strict && available(c, byId, shared)) notes.push(`${label(c)}: ${held.length} sink module${held.length === 1 ? '' : 's'}, sanitiser from the ancestor chunk ${label(from)} (not a copy, and on every path to this chunk; strict mode wants one in this chunk)`);
    else problems.push(`${label(c)} holds ${held[0]}${held.length > 1 ? ` and ${held.length - 1} more` : ''} without ${SANITIZER}${from ? (strict ? ' in the same chunk (only in ' + label(from) + ')' : ' on every path (only in ' + label(from) + ', not in each parent)') : ' in the chunk or an ancestor'}`);
  }
  const icon = chunks.find((c) => (c.names ?? []).includes('svg-icon'));
  if (!icon) problems.push('no svg-icon chunk in the build');
  else
    for (const m of ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts']) {
      if (!(icon.modules ?? []).includes(m)) problems.push(`the svg-icon chunk does not hold ${m}`);
    }
  const entry = chunks.find((c) => c.entry && (c.files ?? []).includes(ENTRY));
  if (entry) for (const m of ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts']) if ((entry.modules ?? []).includes(m)) problems.push(`${ENTRY} holds ${m} (it belongs in the svg-icon chunk; a plain icon needs only <ha-icon>)`);
  return { problems, notes };
};

// ── self test ────────────────────────────────────────────────────────────────

const selfTest = () => {
  const S = SANITIZER;
  const sinks = ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts', './src/particles/svg.ts'];
  const entry = { id: 0, entry: true, files: ['magic-card.js'], names: ['magic-card'], modules: ['./src/index.ts'] };
  const icon = { id: 1, parents: [0], files: ['magic-card-svg-icon.js'], names: ['svg-icon'], modules: ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts', S] };
  const particles = { id: 2, parents: [0], files: ['magic-card-particles.js'], names: ['particles'], modules: ['./src/particles/svg.ts', S] };
  const PATH_CORE = sharedChunkFiles()[0];
  const cases = [
    ['sanitiser in each sink chunk passes', { chunks: [entry, icon, particles], sinks }, 0],
    ['sink chunk without the sanitiser fails', { chunks: [entry, icon, { ...particles, modules: ['./src/particles/svg.ts'] }], sinks }, 1],
    ['sanitiser only in a sibling chunk fails', { chunks: [entry, { ...icon, modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 1],
    ['sanitiser in the entry (an ancestor) passes, with a note', { chunks: [{ ...entry, modules: ['./src/index.ts', S] }, { ...icon, modules: icon.modules.filter((m) => m !== S) }, { ...particles, modules: ['./src/particles/svg.ts'] }], sinks }, 0],
    ['--strict wants the sanitiser in the chunk itself', { chunks: [{ ...entry, modules: ['./src/index.ts', S] }, { ...icon, modules: icon.modules.filter((m) => m !== S) }, particles], sinks, strict: true }, 1],
    ['entry holding the icon element fails', { chunks: [{ ...entry, modules: ['./src/index.ts', './src/icons/mc-svg-icon.ts', S] }, icon, particles], sinks }, 1],
    ['no svg-icon chunk fails', { chunks: [entry, particles], sinks }, 1],
    ['svg-icon chunk without icon-source fails', { chunks: [entry, { ...icon, modules: ['./src/icons/mc-svg-icon.ts', S] }, particles], sinks }, 1],
    ['a child with two parents, one of them fed by the entry that holds the sanitiser, passes', { chunks: [{ ...entry, modules: ['./src/index.ts', S] }, { id: 6, parents: [0], files: ['magic-card-anim.js'], names: ['anim'], modules: [S] }, { id: 7, parents: [0], files: ['magic-card-other.js'], names: ['other'], modules: [] }, { ...icon, parents: [6, 7], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 0],
    ['a child with two parents that both hold the sanitiser passes', { chunks: [entry, { id: 6, parents: [0], files: ['magic-card-anim.js'], names: ['anim'], modules: [S] }, { id: 7, parents: [0], files: ['magic-card-other.js'], names: ['other'], modules: [S] }, { ...icon, parents: [6, 7], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 0],
    ['a child with two parents where only one holds the sanitiser fails', { chunks: [entry, { id: 6, parents: [0], files: ['magic-card-anim.js'], names: ['anim'], modules: [S] }, { id: 7, parents: [0], files: ['magic-card-other.js'], names: ['other'], modules: [] }, { ...icon, parents: [6, 7], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 1],
    ['a shared chunk listed as a parent next to the real parent that holds the sanitiser passes', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE.replace('.js', '.cb8d4820.js')], names: ['path-core'], modules: ['./src/path/core.ts'] }, { id: 6, parents: [0], files: ['magic-card-anim.js'], names: ['anim'], modules: [S] }, { ...icon, parents: [6, 8], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 0],
    ['a real parent without the sanitiser still fails beside a shared one', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, { id: 7, parents: [0], files: ['magic-card-other.js'], names: ['other'], modules: [] }, { ...icon, parents: [7, 8], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 1],
    ['a sink chunk whose only parent is a shared chunk fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', S] }, { ...icon, parents: [8], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 1],
    ['a shared chunk that holds a sink without the sanitiser fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', './src/particles/svg.ts'] }, icon, particles], sinks }, 1],
    ['sanitiser two chunks up passes', { chunks: [{ ...entry, modules: ['./src/index.ts', S] }, { id: 5, parents: [0], files: ['magic-card-editor.js'], names: ['editor'], modules: [] }, { ...icon, parents: [5], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 0],
  ];
  let bad = 0;
  for (const [name, input, want] of cases) {
    const got = evaluate(input).problems.length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  // the source scan
  const scan = [
    ["import { unsafeSVG } from 'lit/directives/unsafe-svg.js';", true],
    ["import { sanitizeSvg } from '../icons/svg-sanitize';", true],
    ["import { SVG_MAX_BYTES, sanitizeSvg } from './svg-sanitize';", true],
    ["import type { SanitizedSvg } from './svg-sanitize';", false],
    ["const x = svg`<g>${unsafeSVG(own)}</g>`;", true],
    ["import { html } from 'lit';", false],
  ];
  for (const [text, want] of scan) {
    if (isSinkSource(text) !== want) {
      bad++;
      console.error(`self-test FAIL: scan of ${JSON.stringify(text)} (expected ${want})`);
    }
  }
  if (bad) process.exit(1);
  console.log(`svg-sinks self-test: ${cases.length + scan.length} cases ok`);
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();
  const strict = args.includes('--strict');
  const file = args.find((a) => !a.startsWith('--'));
  const rules = readJson(path.join(root, RULES_REL), RULES_REL);
  const stats = readJson(file ? path.resolve(file) : STATS_DEFAULT, 'entry-graph stats');
  if (!stats.chunks?.length || !stats.chunks.some((c) => 'parents' in c)) throw new Error('the stats have no chunk parents (run a production build: npm run build)');
  const sinks = [...new Set([...sinksInSources(), ...(rules.sinks ?? [])])].sort();
  const { problems, notes } = evaluate({ chunks: stats.chunks, sinks, strict });
  for (const n of notes) console.log(`svg-sinks: ${n}`);
  if (problems.length) {
    for (const p of problems) console.error(`svg-sinks: ${p}`);
    console.error(`svg-sinks: FAIL (${problems.length} problem${problems.length === 1 ? '' : 's'}, ${sinks.length} sink modules)`);
    process.exit(1);
  }
  console.log(`svg-sinks: ok, ${sinks.length} sink modules, the sanitiser is in the chunk or an ancestor of every chunk that holds one${strict ? ' (strict: in the chunk itself)' : ''}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`svg-sinks: ${e.message}`);
    process.exit(1);
  }
}
