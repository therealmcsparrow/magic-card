// SVG sink gate. Every chunk of the card bundle that holds an SVG sink must hold the sanitiser that sink is paired with
// (statically imported) itself, or every chain of parent chunks from magic-card.js to it must pass through a chunk that
// does (a shared chunk, lazy-module LAZY_SHARED_CHUNK_FILES, loads beside its user and is not a parent); never only in a
// sibling, never behind its own import().
//
// The sanitisers are src/icons/svg-sanitize.ts (icons, own SVG) and src/svg-image/sanitize.ts (library images).
// A sink is a source module that (a) calls unsafeSVG() / imports lit's unsafe-svg directive, (b) value-imports a
// sanitiser (it handles untrusted SVG), or (c) creates a Blob of type image/svg+xml (a blob: URL has its creator's origin,
// so an SVG blob opened as a page runs script in HA's origin); found by scanning src/**/*.ts, plus the modules named in
// tools/svg-sinks.json `sinks`. Each sink is paired with one sanitiser: the one it value-imports, else the one
// tools/svg-sinks.json names for it, else svg-sanitize.
// The built graph (node_modules/.cache/magic-card/entry-graph.json, production build, with `parents`) is then checked:
//   1. every chunk that holds a sink holds its paired sanitiser itself or in an ancestor chunk (a chunk's parents are
//      loaded before it, so a static import is always satisfied there; --strict wants the chunk itself); a sink chunk
//      with no parents and no paired sanitiser fails;
//   2. no chunk holds the sanitiser only in a sibling: that is the same test, it fails by 1;
//   3. the svg-icon chunk exists, holds mc-svg-icon.ts and icon-source.ts, and the entry (magic-card.js) holds neither;
//   4. the entry holds no module of src/svg-image/, and only the svg-image chunk holds the image sanitiser.
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
export const IMAGE_SANITIZER = './src/svg-image/sanitize.ts';
export const SANITIZERS = [SANITIZER, IMAGE_SANITIZER];
const IMAGE_DIR = './src/svg-image/';
const ENTRY = 'magic-card.js';

const CONTRACT_REL = 'src/contracts/lazy-module.ts';

/** File names of the shared chunks, read from LAZY_SHARED_CHUNK_FILES in the lazy-module contract. */
export const sharedChunkFiles = (file = path.join(root, CONTRACT_REL)) => parseSharedChunkFiles(readFileSync(file, 'utf8'), file);

export const parseSharedChunkFiles = (text, file = CONTRACT_REL) => {
  const block = /^export const LAZY_SHARED_CHUNK_FILES\b[^=]*=\s*\{([^}]*)\}/m.exec(text);
  const files = block ? [...block[1].matchAll(/:\s*'([^']+\.js)'/g)].map((m) => m[1]) : [];
  if (!files.length) throw new Error(`no LAZY_SHARED_CHUNK_FILES in ${file}`);
  return files;
};

// The modules each shared chunk may hold (the cacheGroup in webpack.config.js matches the same file). A listed module
// must contain no import(): then the chunk has no chunk group of its own that loads anything, and is never a loader.
export const SHARED_CHUNK_MODULES = { 'magic-card-path-core.js': ['./src/path/core.ts'] };
export const hasDynamicImport = (text) => /(^|[^.\w$])import\s*\(/.test(text);

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

// A value import (not `import type`) and its specifier, one per statement.
const IMPORT_RE = /^import\s+(?!type\b)[^;]*?\bfrom\s+'([^']+)'/gm;

/** Module ids ('./src/...') a source text value-imports, relative specifiers resolved against `module`. */
export const valueImports = (text, module = './src/x.ts') => {
  const out = [];
  for (const m of text.matchAll(IMPORT_RE)) {
    if (!m[1].startsWith('.')) continue;
    out.push(`./${path.posix.join(path.posix.dirname(module.slice(2)), m[1])}`);
  }
  return out;
};

const SANITIZER_BASE = { 'image': IMAGE_SANITIZER.replace(/\.ts$/, ''), 'icon': SANITIZER.replace(/\.ts$/, '') };

/** The sanitiser a source text value-imports: IMAGE_SANITIZER, SANITIZER, or undefined (the library one wins). */
export const importedSanitizer = (text, module = './src/x.ts') => {
  const got = valueImports(text, module);
  return got.includes(SANITIZER_BASE.image) ? IMAGE_SANITIZER : got.includes(SANITIZER_BASE.icon) ? SANITIZER : undefined;
};

/** True when a source text creates a Blob of type image/svg+xml. */
export const makesSvgBlob = (text) => /\bnew\s+Blob\s*\(/.test(text) && text.includes('image/svg+xml');

/** True when a source text is an SVG sink: unsafeSVG, a value import of a sanitiser, or an image/svg+xml Blob. */
export const isSinkSource = (text, module) =>
  /lit\/directives\/unsafe-svg|\bunsafeSVG\s*\(/.test(text) || importedSanitizer(text, module) !== undefined || makesSvgBlob(text);

/** Sanitiser module a sink source is paired with: what it imports, else `named`, else svg-sanitize. */
export const pairedSanitizer = (text, module, named) => importedSanitizer(text, module) ?? named ?? SANITIZER;

/** { module, sanitiser } for every sink module in the sources. `named`: module -> sanitiser from tools/svg-sinks.json. */
export const sinksInSources = (srcDir = path.join(root, 'src'), named = new Map()) =>
  walk(srcDir)
    .map((f) => ({ f, module: `./src/${path.relative(srcDir, f).replace(/\\/g, '/')}` }))
    .filter(({ module }) => !SANITIZERS.includes(module))
    .map(({ f, module }) => ({ module, text: readFileSync(f, 'utf8') }))
    .filter(({ module, text }) => isSinkSource(text, module))
    .map(({ module, text }) => ({ module, sanitiser: pairedSanitizer(text, module, named.get(module)) }))
    .sort((a, b) => (a.module < b.module ? -1 : 1));

// ── the rule (pure) ──────────────────────────────────────────────────────────

// A shared chunk is fetched in the same Promise.all as the chunk that uses it: a sibling of its user, never what loads it.
// webpack still lists it among the user's parents; it is left out of the parent set (it is checked as a sink holder itself).
// Built file names carry a content hash (magic-card-path-core.cb8d4820.js); the contract names the unhashed file.
const unhashed = (f) => f.replace(/\.[0-9a-f]{6,}\.js$/, '.js');
const isShared = (c, shared) => (c.files ?? []).some((f) => shared.includes(unhashed(f)));
const loaders = (chunk, byId, shared) => (chunk.parents ?? []).filter((id) => !(byId.get(id) && isShared(byId.get(id), shared)));

/** Problems with the shared chunks of a build: each holds exactly its listed modules, is not initial, and its modules have no import(). */
export const sharedChunkProblems = ({ chunks, shared = sharedChunkFiles(), modules = SHARED_CHUNK_MODULES, read = (m) => readFileSync(path.join(root, m), 'utf8') }) => {
  const problems = [];
  for (const f of shared) {
    const listed = modules[f];
    if (!listed) {
      problems.push(`shared chunk ${f} has no module list in SHARED_CHUNK_MODULES (tools/check-svg-sinks.mjs)`);
      continue;
    }
    for (const m of listed) if (hasDynamicImport(read(m))) problems.push(`${m} (shared chunk ${f}) contains an import(): a shared chunk must not load anything`);
    for (const c of chunks.filter((x) => (x.files ?? []).some((n) => unhashed(n) === f))) {
      const held = c.modules ?? [];
      if (held.length !== listed.length || !listed.every((m) => held.includes(m))) problems.push(`shared chunk ${f} holds ${held.join(', ') || 'no modules'}, not exactly ${listed.join(', ')}`);
      if (c.entry || c.initial) problems.push(`shared chunk ${f} is an initial chunk (it must load beside its user, never with the page)`);
    }
  }
  return problems;
};

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
 * The sanitiser `san` is installed before the chunk runs on EVERY path to it: the chunk holds it, or it has parents and each
 * one is available. A child's import() is code inside its parent, so what a parent holds is installed first. A chunk with a
 * parent that lacks it (a second parent, a sibling, an entry without it) fails: one good ancestor on one path is not enough.
 */
const available = (chunk, byId, shared, san, seen = new Set()) => {
  if ((chunk.modules ?? []).includes(san)) return true;
  const parents = loaders(chunk, byId, shared);
  if (!parents.length || seen.has(chunk.id)) return false;
  seen.add(chunk.id);
  return parents.every((id) => {
    const p = byId.get(id);
    return !!p && available(p, byId, shared, san, new Set(seen));
  });
};

const label = (c) => (c.files ?? []).find((f) => f.endsWith('.js')) ?? (c.names ?? []).join('+') ?? String(c.id);

/** A sink as { module, sanitiser }; a bare module name is paired with the icon sanitiser. */
const asSink = (s) => (typeof s === 'string' ? { module: s, sanitiser: SANITIZER } : { module: s.module, sanitiser: s.sanitiser ?? SANITIZER });

/** Returns { problems, notes }. `sinks`: module names or { module, sanitiser }; `strict`: the sanitiser must sit in the sink's own chunk. */
export const evaluate = ({ chunks, sinks, strict = false, shared = sharedChunkFiles(), modules, read }) => {
  const problems = sharedChunkProblems({ chunks, shared, ...(modules ? { modules } : {}), ...(read ? { read } : {}) });
  const notes = [];
  const byId = new Map(chunks.map((c) => [c.id, c]));
  const pairs = sinks.map(asSink);
  for (const c of chunks) {
    const here = new Set(c.modules ?? []);
    const held = pairs.filter((s) => here.has(s.module));
    if (!held.length) continue;
    for (const san of [...new Set(held.map((s) => s.sanitiser))].sort()) {
      const mine = held.filter((s) => s.sanitiser === san);
      const count = `${mine.length} sink module${mine.length === 1 ? '' : 's'}`;
      if (here.has(san)) {
        notes.push(`${label(c)}: ${count} paired with ${san}, sanitiser in the same chunk`);
        continue;
      }
      const from = ancestors(c, byId, shared).find((a) => (a.modules ?? []).includes(san));
      if (from && !strict && available(c, byId, shared, san)) notes.push(`${label(c)}: ${count} paired with ${san}, sanitiser from the ancestor chunk ${label(from)} (not a copy, and on every path to this chunk; strict mode wants one in this chunk)`);
      else problems.push(`${label(c)} holds ${mine[0].module}${mine.length > 1 ? ` and ${mine.length - 1} more` : ''} without ${san}${from ? (strict ? ' in the same chunk (only in ' + label(from) + ')' : ' on every path (only in ' + label(from) + ', not in each parent)') : ' in the chunk or an ancestor'}`);
    }
  }
  const icon = chunks.find((c) => (c.names ?? []).includes('svg-icon'));
  if (!icon) problems.push('no svg-icon chunk in the build');
  else
    for (const m of ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts']) {
      if (!(icon.modules ?? []).includes(m)) problems.push(`the svg-icon chunk does not hold ${m}`);
    }
  const entry = chunks.find((c) => c.entry && (c.files ?? []).includes(ENTRY));
  if (entry) for (const m of ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts']) if ((entry.modules ?? []).includes(m)) problems.push(`${ENTRY} holds ${m} (it belongs in the svg-icon chunk; a plain icon needs only <ha-icon>)`);
  const inEntry = (entry?.modules ?? []).filter((m) => m.startsWith(IMAGE_DIR));
  if (inEntry.length) problems.push(`${ENTRY} holds ${inEntry[0]}${inEntry.length > 1 ? ` and ${inEntry.length - 1} more` : ''} (library images belong in the svg-image chunk)`);
  for (const c of chunks) {
    if ((c.modules ?? []).includes(IMAGE_SANITIZER) && !(c.names ?? []).includes('svg-image')) problems.push(`${label(c)} holds ${IMAGE_SANITIZER}; only the svg-image chunk may (editors reach it through its api)`);
  }
  return { problems, notes };
};

// ── self test ────────────────────────────────────────────────────────────────

const selfTest = () => {
  const S = SANITIZER;
  const sinks = ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts', './src/particles/svg.ts'];
  const entry = { id: 0, entry: true, files: ['magic-card.js'], names: ['magic-card'], modules: ['./src/index.ts'] };
  const icon = { id: 1, parents: [0], files: ['magic-card-svg-icon.js'], names: ['svg-icon'], modules: ['./src/icons/mc-svg-icon.ts', './src/icons/icon-source.ts', S] };
  const particles = { id: 2, parents: [0], files: ['magic-card-particles.js'], names: ['particles'], modules: ['./src/particles/svg.ts', S] };
  const IS = IMAGE_SANITIZER;
  const imageSink = { module: './src/svg-image/export.ts', sanitiser: IS };
  const imageChunk = { id: 9, parents: [0], files: ['magic-card-svg-image.js'], names: ['svg-image'], modules: ['./src/svg-image/export.ts', IS] };
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
    ['a sink chunk whose only parent is a shared chunk fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', S] }, { ...icon, parents: [8], modules: icon.modules.filter((m) => m !== S) }, particles], sinks, modules: { [PATH_CORE]: ["./src/path/core.ts", S] } }, 1],
    ['a shared chunk that holds a sink without the sanitiser fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', './src/particles/svg.ts'] }, icon, particles], sinks, modules: { [PATH_CORE]: ["./src/path/core.ts", "./src/particles/svg.ts"] } }, 1],
    ['a shared chunk holding another module fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', './src/path/other.ts'] }, icon, particles], sinks, read: () => '' }, 1],
    ['a shared chunk missing its module fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: [] }, icon, particles], sinks, read: () => '' }, 1],
    ['an initial shared chunk fails', { chunks: [entry, { id: 8, parents: [0], initial: true, files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => '' }, 1],
    ['a shared module with an import() fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => "const x = import('./x');" }, 1],
    ['a shared chunk with exactly its module and no import() passes', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE.replace('.js', '.cb8d4820.js')], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => 'export const a = 1;' }, 0],
    ['sanitiser two chunks up passes', { chunks: [{ ...entry, modules: ['./src/index.ts', S] }, { id: 5, parents: [0], files: ['magic-card-editor.js'], names: ['editor'], modules: [] }, { ...icon, parents: [5], modules: icon.modules.filter((m) => m !== S) }, particles], sinks }, 0],
    ['an image sink beside the image sanitiser in its chunk passes', { chunks: [entry, icon, particles, imageChunk], sinks: [...sinks, imageSink] }, 0],
    ['an image sink behind the icon sanitiser only fails (pairing)', { chunks: [entry, icon, particles, { ...imageChunk, modules: ['./src/svg-image/export.ts', S] }], sinks: [...sinks, imageSink] }, 1],
    ['an image sink with no parent chunk and no image sanitiser fails', { chunks: [entry, icon, particles, { id: 9, parents: [], files: ['magic-card-svg-image.js'], names: ['svg-image'], modules: ['./src/svg-image/export.ts'] }], sinks: [...sinks, imageSink] }, 1],
    ['an image sink under a parent that holds the image sanitiser passes', { chunks: [entry, icon, particles, imageChunk, { id: 10, parents: [9], files: ['magic-card-image-editor.js'], names: ['image-editor'], modules: ['./src/image-editor/x.ts'] }], sinks: [...sinks, imageSink, { module: './src/image-editor/x.ts', sanitiser: IS }] }, 0],
    ['a sink named for the image sanitiser in a chunk without it fails even beside the icon sanitiser', { chunks: [entry, icon, particles, { id: 9, parents: [0], files: ['magic-card-x.js'], names: ['x'], modules: ['./src/x.ts', S] }], sinks: [...sinks, { module: './src/x.ts', sanitiser: IS }] }, 1],
    ['a sink with both sanitisers is checked against its own pairing', { chunks: [entry, icon, particles, { id: 9, parents: [0], files: ['magic-card-svg-image.js'], names: ['svg-image'], modules: ['./src/x.ts', S, IS] }], sinks: [...sinks, { module: './src/x.ts', sanitiser: IS }] }, 0],
    ['the entry holding a svg-image module fails', { chunks: [{ ...entry, modules: ['./src/index.ts', './src/svg-image/client.ts'] }, icon, particles], sinks }, 1],
    ['the image sanitiser in a chunk that is not svg-image fails', { chunks: [entry, icon, particles, { id: 9, parents: [0], files: ['magic-card-image-editor.js'], names: ['image-editor'], modules: [IS] }], sinks }, 1],
    ['a missing svg-image chunk is not an error', { chunks: [entry, icon, particles], sinks }, 0],
  ];
  let bad = 0;
  for (const [name, input, want] of cases) {
    const got = evaluate(input).problems.length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  // the shared chunk list is read from the declaration, not from a mention of its name
  const decl = "export const LAZY_SHARED_CHUNK_FILES: Record<X, string> = {\n  'path-core': 'magic-card-path-core.js',\n};";
  const parseCases = [
    ['the real contract lists path-core only', JSON.stringify(sharedChunkFiles()) === JSON.stringify(['magic-card-path-core.js'])],
    ['a comment naming the table above another `= {` is skipped', JSON.stringify(parseSharedChunkFiles(`// see LAZY_SHARED_CHUNK_FILES = {\nconst Z = { a: 'magic-card-z.js' };\n${decl}`)) === JSON.stringify(['magic-card-path-core.js'])],
    ['import( is found, a method call .import( is not', hasDynamicImport("x = import('./a')") && hasDynamicImport('await import (y)') && !hasDynamicImport('obj.import(y)') && !hasDynamicImport('// import statement')],
    ['the real shared modules have no import()', sharedChunkProblems({ chunks: [] }).length === 0],
  ];
  for (const [name, ok] of parseCases) {
    if (!ok) {
      bad++;
      console.error(`self-test FAIL: ${name}`);
    }
  }
  // the source scan
  const scan = [
    ["import { unsafeSVG } from 'lit/directives/unsafe-svg.js';", './src/a.ts', true, SANITIZER],
    ["import { sanitizeSvg } from '../icons/svg-sanitize';", './src/x/a.ts', true, SANITIZER],
    ["import { SVG_MAX_BYTES, sanitizeSvg } from './svg-sanitize';", './src/icons/a.ts', true, SANITIZER],
    ["import type { SanitizedSvg } from './svg-sanitize';", './src/icons/a.ts', false, SANITIZER],
    ["const x = svg`<g>${unsafeSVG(own)}</g>`;", './src/a.ts', true, SANITIZER],
    ["import { html } from 'lit';", './src/a.ts', false, SANITIZER],
    ["import { sanitizeImage } from './sanitize';", './src/svg-image/export.ts', true, IMAGE_SANITIZER],
    ["import { sanitizeImage } from '../svg-image/sanitize';", './src/image-editor/a.ts', true, IMAGE_SANITIZER],
    ["import { sanitizeImage } from '../svg-image/sanitize';\nimport { sanitizeSvg } from '../icons/svg-sanitize';", './src/image-editor/a.ts', true, IMAGE_SANITIZER],
    ["import type { SanitizedImage } from '../svg-image/sanitize';", './src/image-editor/a.ts', false, SANITIZER],
    ["import { sanitize } from './sanitize';", './src/other/a.ts', false, SANITIZER],
    ["const u = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));", './src/a.ts', true, SANITIZER],
    ["const b = new Blob([text], { type: 'application/json' });", './src/a.ts', false, SANITIZER],
    ["const t = 'image/svg+xml';", './src/a.ts', false, SANITIZER],
  ];
  for (const [text, module, want, san] of scan) {
    if (isSinkSource(text, module) !== want || (want && pairedSanitizer(text, module) !== san)) {
      bad++;
      console.error(`self-test FAIL: scan of ${JSON.stringify(text)} (expected ${want} paired with ${san})`);
    }
  }
  if (pairedSanitizer("const u = new Blob([a], { type: 'image/svg+xml' });", './src/a.ts', IMAGE_SANITIZER) !== IMAGE_SANITIZER) {
    bad++;
    console.error('self-test FAIL: a sink the rules file names for the image sanitiser is paired with it');
  }
  if (bad) process.exit(1);
  console.log(`svg-sinks self-test: ${cases.length + parseCases.length + scan.length + 1} cases ok`);
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();
  const strict = args.includes('--strict');
  const file = args.find((a) => !a.startsWith('--'));
  const rules = readJson(path.join(root, RULES_REL), RULES_REL);
  const stats = readJson(file ? path.resolve(file) : STATS_DEFAULT, 'entry-graph stats');
  if (!stats.chunks?.length || !stats.chunks.some((c) => 'parents' in c)) throw new Error('the stats have no chunk parents (run a production build: npm run build)');
  const listed = (rules.sinks ?? []).map(asSink);
  const named = new Map(listed.map((x) => [x.module, x.sanitiser]));
  const found = sinksInSources(path.join(root, 'src'), named);
  const sinks = [...new Map([...listed, ...found].map((x) => [x.module, x])).values()].sort((x, y) => (x.module < y.module ? -1 : 1));
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
