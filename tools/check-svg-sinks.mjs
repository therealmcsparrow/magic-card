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
//   4. the entry holds no module of src/svg-image/, and only the svg-image chunk holds the image sanitiser;
//   5. every chunk that holds a src/svg-safety module also holds a sanitiser, except the svg-css chunk and a chunk whose
//      only src/svg-safety module is css-loader.ts;
//   6. the svg-css chunk (the CSS paint resolver) holds no sink, no sanitiser, no parse.ts, no async child and only
//      src/svg-safety and src/contracts modules; css.ts and css-chunk.ts sit in no other chunk; magic-card.js and the
//      svg-icon, svg-image, anim, anim-runtime and particles chunks hold neither css.ts nor css-loader.ts; when a chunk
//      holds css-loader.ts the build has an svg-css chunk that holds css.ts and css-chunk.ts.
// The sources are checked for the svg-safety boundary: src/svg-safety/** is value-imported (import, bare import, export …
// from, import()) only by the two sanitisers and by itself, except css-loader.ts, which the files of SVG_CSS_OPEN_SITES
// (src/contracts/svg-safety.ts) may also value-import and which is all they may take from there; the sanitisers import
// neither css.ts nor css-loader.ts; css.ts is value-imported only by css-chunk.ts and index.ts, css-chunk.ts only by
// css-loader.ts; nothing outside src/svg-safety/ value-imports its index.ts; src/svg-safety value-imports only itself and
// src/contracts/** and is never an SVG sink; a cast to a Sanitised…Markup brand is made in the two sanitisers only.
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
const SAFETY_CONTRACT_REL = 'src/contracts/svg-safety.ts';

/** The files that may call loadSvgCss, read from SVG_CSS_OPEN_SITES in the svg-safety contract (as './src/...' module ids). */
export const openSites = (file = path.join(root, SAFETY_CONTRACT_REL)) => parseOpenSites(readFileSync(file, 'utf8'), file);

export const parseOpenSites = (text, file = SAFETY_CONTRACT_REL) => {
  const block = /^export const SVG_CSS_OPEN_SITES\b[^=]*=\s*\[([^\]]*)\]/m.exec(text);
  const sites = block ? [...block[1].matchAll(/'(src\/[^']+\.ts)'/g)].map((m) => `./${m[1]}`) : [];
  if (!sites.length) throw new Error(`no SVG_CSS_OPEN_SITES in ${file}`);
  return sites;
};

/** File names of the shared chunks, read from LAZY_SHARED_CHUNK_FILES in the lazy-module contract. */
export const sharedChunkFiles = (file = path.join(root, CONTRACT_REL)) => parseSharedChunkFiles(readFileSync(file, 'utf8'), file);

export const parseSharedChunkFiles = (text, file = CONTRACT_REL) => {
  const block = /^export const LAZY_SHARED_CHUNK_FILES\b[^=]*=\s*\{([^}]*)\}/m.exec(text);
  const files = block ? [...block[1].matchAll(/:\s*'([^']+\.js)'/g)].map((m) => m[1]) : [];
  if (!files.length) throw new Error(`no LAZY_SHARED_CHUNK_FILES in ${file}`);
  return files;
};

/**
 * The modules each shared chunk holds, by file name, read from the contract: the doc comment of its
 * LAZY_SHARED_CHUNK_CEILINGS entry names them ("src/path/core.ts only."). A listed module must contain no import(): then
 * the chunk has no chunk group of its own that loads anything, and is never a loader.
 */
export const sharedChunkModules = (file = path.join(root, CONTRACT_REL)) => parseSharedChunkModules(readFileSync(file, 'utf8'), file);

export const parseSharedChunkModules = (text, file = CONTRACT_REL) => {
  const filesBlock = /^export const LAZY_SHARED_CHUNK_FILES\b[^=]*=\s*\{([^}]*)\}/m.exec(text);
  const ceilings = /^export const LAZY_SHARED_CHUNK_CEILINGS\b[^=]*=\s*\{([^}]*)\}/m.exec(text);
  if (!filesBlock || !ceilings) throw new Error(`no LAZY_SHARED_CHUNK_FILES or LAZY_SHARED_CHUNK_CEILINGS in ${file}`);
  const out = {};
  for (const m of filesBlock[1].matchAll(/(?:'([^']+)'|([\w$]+))\s*:\s*'([^']+\.js)'/g)) {
    const key = (m[1] ?? m[2]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doc = new RegExp(`/\\*\\*\\s*((?:src/[^\\s,]+\\.ts)(?:\\s*(?:,|and)\\s*(?:src/[^\\s,]+\\.ts))*)\\s+only\\b[^*]*\\*/\\s*(?:'${key}'|${key})\\s*:`).exec(ceilings[1]);
    if (!doc) throw new Error(`the LAZY_SHARED_CHUNK_CEILINGS entry for ${m[3]} in ${file} has no "src/… only." doc comment naming its modules`);
    out[m[3]] = [...doc[1].matchAll(/src\/[^\s,]+\.ts/g)].map((x) => `./${x[0]}`);
  }
  return out;
};
export const hasDynamicImport = (text) => /(^|[^.\w$])import\s*\(/.test(text);

const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`cannot read ${what} (${file}): ${e.message}`, { cause: e });
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

/**
 * The source without comments. Strings, template literals and regular expression literals are copied as they are, so a
 * quote inside a comment or a regex cannot hide or invent a statement.
 */
export const stripComments = (text) => {
  let out = '';
  let last = '';
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    const d = text[i + 1];
    if (c === '/' && d === '/') {
      const e = text.indexOf('\n', i);
      i = e < 0 ? n : e;
    } else if (c === '/' && d === '*') {
      const e = text.indexOf('*/', i + 2);
      i = e < 0 ? n : e + 2;
      out += ' ';
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && text[j] !== c) {
        if (text[j] === '\\') j++;
        else if (c !== '`' && text[j] === '\n') break;
        j++;
      }
      out += text.slice(i, j + 1);
      i = j + 1;
      last = c;
    } else if (c === '/' && /^[(,=:[!&|?{};]?$/.test(last)) {
      let j = i + 1;
      let inClass = false;
      while (j < n && text[j] !== '\n') {
        if (text[j] === '\\') j++;
        else if (text[j] === '[') inClass = true;
        else if (text[j] === ']') inClass = false;
        else if (text[j] === '/' && !inClass) break;
        j++;
      }
      out += text.slice(i, j + 1);
      i = j + 1;
      last = '/';
    } else {
      out += c;
      if (!/\s/.test(c)) last = c;
      i++;
    }
  }
  return out;
};

// Every form that loads a module, one pattern each: `import x from 'a'`, `import 'a'`, `export … from 'a'` and `import('a')`.
// `import type …` and `export type … from` only name types and are free; `import { type A } from` stays a value import (it
// keeps a side-effect import under verbatimModuleSyntax), and so does a default import that is named `type`.
const IMPORT_RE = /(?<![.\w$])import(?![\w$])(?!\s*\()(?!\s*type\b(?!\s+from\b))\s*(?:[^;'"`]*?\bfrom\s*)?(['"])([^'"\n]+)\1/g;
const EXPORT_RE = /(?<![.\w$])export(?![\w$])(?!\s*type\b(?!\s+from\b))\s*[^;'"`]*?\bfrom\s*(['"])([^'"\n]+)\1/g;
const DYNAMIC_RE = /(?<![.\w$])import\s*\(\s*(['"`])([^'"`\n]*)\1/g;

/** Specifiers a source text value-imports, as written (comments are skipped). */
export const valueSpecifiers = (text) => {
  const code = stripComments(text);
  return [IMPORT_RE, EXPORT_RE, DYNAMIC_RE].flatMap((re) => [...code.matchAll(re)].map((m) => m[2]));
};

/** Module ids ('./src/...') a source text value-imports, relative specifiers resolved against `module`. */
export const valueImports = (text, module = './src/x.ts') =>
  valueSpecifiers(text)
    .filter((spec) => spec.startsWith('.'))
    .map((spec) => `./${path.posix.join(path.posix.dirname(module.slice(2)), spec)}`);

// ── the svg-safety boundary ──

export const SAFETY_DIR = './src/svg-safety';
const CONTRACTS_DIR = './src/contracts/';
const inSafety = (m) => m === SAFETY_DIR || m.startsWith(`${SAFETY_DIR}/`);
/** A resolved specifier or built module id as a module path without extension (the folder is its index). */
const bare = (m) => (m === SAFETY_DIR ? `${SAFETY_DIR}/index` : m.replace(/\.ts$/, ''));
export const SVG_CSS_LOADER = `${SAFETY_DIR}/css-loader.ts`;
export const SVG_CSS_RESOLVER = `${SAFETY_DIR}/css.ts`;
export const SVG_CSS_ENTRY = `${SAFETY_DIR}/css-chunk.ts`;
const SAFETY_INDEX = `${SAFETY_DIR}/index.ts`;
const CARD_CHUNK_NAMES = ['svg-icon', 'svg-image', 'anim', 'anim-runtime', 'particles'];
const BRAND_CAST_RE = /\bas\s+Sanitised(?:Icon|Image)?Markup\b|<\s*Sanitised(?:Icon|Image)?Markup\s*>\s*[\w(]/;

/**
 * Problems with who may use src/svg-safety, from { module, text } source pairs: only the two sanitisers and other
 * svg-safety modules value-import it, the sanitisers never css.ts, css-loader.ts or index.ts; css-loader.ts alone is also
 * open to the `sites` (SVG_CSS_OPEN_SITES); css.ts is imported by css-chunk.ts and index.ts only, css-chunk.ts by
 * css-loader.ts only; svg-safety value-imports only itself and src/contracts and is never an SVG sink; a cast to a
 * Sanitised…Markup brand is made in the sanitisers only.
 */
export const boundaryProblems = (modules, sites = openSites()) => {
  const problems = [];
  for (const { module, text } of modules) {
    const code = stripComments(text);
    const specs = valueSpecifiers(code);
    const resolved = specs.map((spec) => (spec.startsWith('.') ? `./${path.posix.join(path.posix.dirname(module.slice(2)), spec)}` : spec));
    if (inSafety(module)) {
      specs.forEach((spec, i) => {
        if (!inSafety(resolved[i]) && !resolved[i].startsWith(CONTRACTS_DIR)) problems.push(`${module} value-imports '${spec}': src/svg-safety may import only itself and src/contracts`);
      });
      if (/lit\/directives\/unsafe-svg|\bunsafeSVG\s*\(/.test(code) || makesSvgBlob(code)) problems.push(`${module} is an SVG sink: src/svg-safety must never be one`);
      for (const target of resolved.map(bare)) {
        if (target === bare(SVG_CSS_RESOLVER) && module !== SVG_CSS_ENTRY && module !== SAFETY_INDEX) problems.push(`${module} value-imports ${target}: only css-chunk.ts and index.ts may`);
        if (target === bare(SVG_CSS_ENTRY) && module !== SVG_CSS_LOADER) problems.push(`${module} value-imports ${target}: only css-loader.ts may (through its import())`);
      }
    } else if (SANITIZERS.includes(module)) {
      for (const target of resolved.filter(inSafety).map(bare)) {
        if (target === bare(SVG_CSS_RESOLVER) || target === bare(SVG_CSS_LOADER) || target === bare(SVG_CSS_ENTRY) || target === bare(SAFETY_INDEX)) problems.push(`${module} value-imports ${target}: a sanitiser takes the resolver as its css option and imports none of css.ts, css-loader.ts, css-chunk.ts and index.ts`);
      }
    } else {
      for (const target of resolved.filter(inSafety)) {
        if (bare(target) === bare(SVG_CSS_LOADER) && sites.includes(module)) continue;
        problems.push(`${module} value-imports ${target}: ${sites.includes(module) ? 'an open site may take only css-loader.ts from src/svg-safety' : bare(target) === bare(SVG_CSS_LOADER) ? 'only the files of SVG_CSS_OPEN_SITES may' : 'only the two SVG sanitisers may'}`);
      }
    }
    if (!SANITIZERS.includes(module) && BRAND_CAST_RE.test(code)) problems.push(`${module} casts to a Sanitised…Markup brand: only the two SVG sanitisers may`);
  }
  return problems;
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
export const readSources = (srcDir = path.join(root, 'src')) =>
  walk(srcDir).map((f) => ({ module: `./src/${path.relative(srcDir, f).replace(/\\/g, '/')}`, text: readFileSync(f, 'utf8') }));

export const sinksInSources = (srcDir = path.join(root, 'src'), named = new Map(), sources = readSources(srcDir)) =>
  sources
    .filter(({ module }) => !SANITIZERS.includes(module))
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
export const sharedChunkProblems = ({ chunks, shared = sharedChunkFiles(), modules = sharedChunkModules(), read = (m) => readFileSync(path.join(root, m), 'utf8') }) => {
  const problems = [];
  const byId = new Map(chunks.map((c) => [c.id, c]));
  for (const f of shared) {
    const listed = modules[f];
    if (!listed) {
      problems.push(`shared chunk ${f} has no module list in the lazy-module contract`);
      continue;
    }
    for (const m of listed) if (hasDynamicImport(read(m))) problems.push(`${m} (shared chunk ${f}) contains an import(): a shared chunk must not load anything`);
    for (const c of chunks.filter((x) => (x.files ?? []).some((n) => unhashed(n) === f))) {
      const held = c.modules ?? [];
      if (held.length !== listed.length || !listed.every((m) => held.includes(m))) problems.push(`shared chunk ${f} holds ${held.join(', ') || 'no modules'}, not exactly ${listed.join(', ')}`);
      if (c.entry || c.initial) problems.push(`shared chunk ${f} is an initial chunk (it must load beside its user, never with the page)`);
      if (!(c.parents ?? []).some((id) => byId.get(id) && !isShared(byId.get(id), shared))) problems.push(`shared chunk ${f} forms a chunk group of its own: no chunk besides shared chunks loads it (it must load beside its user)`);
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

const isCssChunk = (c) => (c.names ?? []).includes('svg-css');

/** Problems with the svg-css chunk (the CSS paint resolver) and with who holds its modules, from the built graph. */
export const cssChunkProblems = (chunks, pairs) => {
  const problems = [];
  const holds = (c, m) => (c.modules ?? []).includes(m);
  const sinkModules = new Set(pairs.map((s) => s.module));
  for (const c of chunks.filter(isCssChunk)) {
    for (const m of c.modules ?? []) {
      if (SANITIZERS.includes(m)) problems.push(`${label(c)} holds the sanitiser ${m}: the resolver chunk holds no sanitiser`);
      else if (sinkModules.has(m)) problems.push(`${label(c)} holds the SVG sink ${m}: the resolver chunk holds none`);
      else if (m === `${SAFETY_DIR}/parse.ts`) problems.push(`${label(c)} holds ${m}: the resolver chunk holds no DOMParser call`);
      else if (!inSafety(m) && !m.startsWith(CONTRACTS_DIR)) problems.push(`${label(c)} holds ${m}: the resolver chunk holds only src/svg-safety and src/contracts modules`);
    }
    const child = chunks.find((o) => (o.parents ?? []).includes(c.id));
    if (child) problems.push(`${label(c)} is the parent of ${label(child)}: the resolver chunk has no async child`);
    if (!holds(c, SVG_CSS_RESOLVER) || !holds(c, SVG_CSS_ENTRY)) problems.push(`${label(c)} does not hold both css.ts and css-chunk.ts`);
  }
  for (const c of chunks.filter((x) => !isCssChunk(x))) {
    for (const m of [SVG_CSS_RESOLVER, SVG_CSS_ENTRY]) if (holds(c, m)) problems.push(`${label(c)} holds ${m}: only the svg-css chunk may`);
    const card = c.entry ? (c.files ?? []).includes(ENTRY) : (c.names ?? []).some((n) => CARD_CHUNK_NAMES.includes(n));
    if (card && holds(c, SVG_CSS_LOADER)) problems.push(`${label(c)} holds ${SVG_CSS_LOADER}: the card and its render chunks never load the resolver`);
  }
  if (chunks.some((c) => holds(c, SVG_CSS_LOADER)) && !chunks.some(isCssChunk)) problems.push('a chunk holds css-loader.ts but the build has no svg-css chunk');
  return problems;
};

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
    const safety = (c.modules ?? []).filter(inSafety);
    if (isCssChunk(c) || (safety.length && safety.every((m) => m === SVG_CSS_LOADER))) continue;
    if (safety.length && !SANITIZERS.some((san) => (c.modules ?? []).includes(san))) problems.push(`${label(c)} holds ${safety[0]}${safety.length > 1 ? ` and ${safety.length - 1} more` : ''} without an SVG sanitiser (src/svg-safety belongs in the chunks of the sanitisers)`);
  }
  problems.push(...cssChunkProblems(chunks, pairs));
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
    ['a sink chunk whose only parent is a shared chunk fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', S] }, { ...icon, parents: [8], modules: icon.modules.filter((m) => m !== S) }, particles], sinks, shared: [PATH_CORE], modules: { [PATH_CORE]: ["./src/path/core.ts", S] } }, 1],
    ['a shared chunk that holds a sink without the sanitiser fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', './src/particles/svg.ts'] }, icon, particles], sinks, shared: [PATH_CORE], modules: { [PATH_CORE]: ["./src/path/core.ts", "./src/particles/svg.ts"] } }, 1],
    ['a shared chunk holding another module fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts', './src/path/other.ts'] }, icon, particles], sinks, read: () => '' }, 1],
    ['a shared chunk missing its module fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: [] }, icon, particles], sinks, read: () => '' }, 1],
    ['an initial shared chunk fails', { chunks: [entry, { id: 8, parents: [0], initial: true, files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => '' }, 1],
    ['a shared module with an import() fails', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, shared: [PATH_CORE], read: () => "const x = import('./x');" }, 1],
    ['a shared chunk with exactly its module and no import() passes', { chunks: [entry, { id: 8, parents: [0], files: [PATH_CORE.replace('.js', '.cb8d4820.js')], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => 'export const a = 1;' }, 0],
    ['a shared chunk that no other chunk loads (a group of only the shared chunk) fails', { chunks: [entry, { id: 8, parents: [], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, icon, particles], sinks, read: () => '' }, 1],
    ['a shared chunk whose only parent is another shared chunk fails', { chunks: [entry, { id: 8, parents: [], files: [PATH_CORE], names: ['path-core'], modules: ['./src/path/core.ts'] }, { id: 11, parents: [8], files: ['magic-card-lit.js'], names: ['lit'], modules: ['./src/lit.ts'] }, icon, particles], sinks, shared: [PATH_CORE, 'magic-card-lit.js'], modules: { [PATH_CORE]: ['./src/path/core.ts'], 'magic-card-lit.js': ['./src/lit.ts'] }, read: () => '' }, 2],
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
    ['the real contract lists path-core, history and shape-path', JSON.stringify(sharedChunkFiles()) === JSON.stringify(['magic-card-path-core.js', 'magic-card-history.js', 'magic-card-shape-path.js'])],
    ['a comment naming the table above another `= {` is skipped', JSON.stringify(parseSharedChunkFiles(`// see LAZY_SHARED_CHUNK_FILES = {\nconst Z = { a: 'magic-card-z.js' };\n${decl}`)) === JSON.stringify(['magic-card-path-core.js'])],
    ['import( is found, a method call .import( is not', hasDynamicImport("x = import('./a')") && hasDynamicImport('await import (y)') && !hasDynamicImport('obj.import(y)') && !hasDynamicImport('// import statement')],
    ['the shared modules are read from the contract doc comments', JSON.stringify(parseSharedChunkModules("export const LAZY_SHARED_CHUNK_FILES: R = {\n  'path-core': 'magic-card-path-core.js',\n  lit: 'magic-card-lit.js',\n};\nexport const LAZY_SHARED_CHUNK_CEILINGS: R = {\n  /** src/path/core.ts only. */\n  'path-core': 10_240,\n  /** src/a/b.ts and src/a/c.ts only. */\n  lit: 8_192,\n};")) === JSON.stringify({ 'magic-card-path-core.js': ['./src/path/core.ts'], 'magic-card-lit.js': ['./src/a/b.ts', './src/a/c.ts'] })],
    ['a shared chunk without a module line in the contract throws', (() => { try { parseSharedChunkModules("export const LAZY_SHARED_CHUNK_FILES: R = {\n  x: 'magic-card-x.js',\n};\nexport const LAZY_SHARED_CHUNK_CEILINGS: R = {\n  x: 1,\n};"); return false; } catch { return true; } })()],
    ['the real contract gives each shared chunk its module', JSON.stringify(sharedChunkModules()) === JSON.stringify({ 'magic-card-path-core.js': ['./src/path/core.ts'], 'magic-card-history.js': ['./src/services/history-cache.ts'], 'magic-card-shape-path.js': ['./src/utils/shape-path.ts'] })],
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
  // value imports: every form that loads a module, none that only names a type
  const SAFETY = './src/svg-safety/css';
  const imports = [
    ["import { resolveCss } from '../svg-safety';", [ './src/svg-safety' ]],
    ['import { resolveCss } from "../svg-safety/css";', [ SAFETY ]],
    ["import type { SvgPolicy } from '../svg-safety';", []],
    ["import { type A, b } from '../svg-safety/css';", [ SAFETY ]],
    ["import { type A } from '../svg-safety/css';", [ SAFETY ]],
    ["import '../svg-safety/css';", [ SAFETY ]],
    ['import "../svg-safety/css";', [ SAFETY ]],
    ["export { a } from '../svg-safety/css';", [ SAFETY ]],
    ["export * from '../svg-safety/css';", [ SAFETY ]],
    ["export * as css from '../svg-safety/css';", [ SAFETY ]],
    ["export type { A } from '../svg-safety/css';", []],
    ["export type * from '../svg-safety/css';", []],
    ["const m = await import('../svg-safety/css');", [ SAFETY ]],
    ['const m = await import( "../svg-safety/css" );', [ SAFETY ]],
    ["import {\n  a,\n  b,\n} from '../svg-safety/css';", [ SAFETY ]],
    ["import type from '../svg-safety/css';", [ SAFETY ]],
    ["import typeFn from '../svg-safety/css';", [ SAFETY ]],
    ["// import { a } from '../svg-safety/css';", []],
    ["/* import('../svg-safety/css') */ const a = 1;", []],
    ["/**\n * import { a } from '../svg-safety/css';\n */", []],
    ["const importX = 1; obj.import('../svg-safety/css');", []],
    ["const re = /['\"]/; const m = import('../svg-safety/css');", [ SAFETY ]],
  ];
  for (const [text, want] of imports) {
    const got = valueImports(text, './src/icons/a.ts');
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      bad++;
      console.error(`self-test FAIL: value imports of ${JSON.stringify(text)} (expected ${JSON.stringify(want)}, got ${JSON.stringify(got)})`);
    }
  }
  // the svg-safety boundary in the sources
  const SAN = 'src/icons/svg-sanitize.ts';
  const SITES = ['./src/svg-editor/mc-svg-editor.ts', './src/image-editor/chunk.ts', './src/anim-studio/editors/draw-svg-dialog.ts', './src/transfer/panel.ts'];
  const mod = (module, text) => ({ module: `./${module}`, text });
  const boundary = [
    ['a sanitiser may value-import svg-safety', [mod(SAN, "import { cleanValue } from '../svg-safety/clean';")], 0],
    ['the image sanitiser may value-import svg-safety', [mod('src/svg-image/sanitize.ts', "import { cleanValue } from '../svg-safety/clean';")], 0],
    ['a sanitiser importing the resolver fails', [mod(SAN, "import { resolveCss } from '../svg-safety/css';")], 1],
    ['the image sanitiser importing the resolver fails', [mod('src/svg-image/sanitize.ts', 'import { resolveCss } from "../svg-safety/css";')], 1],
    ['a sanitiser importing the loader fails', [mod(SAN, "import { loadSvgCss } from '../svg-safety/css-loader';")], 1],
    ['a sanitiser importing the chunk entry fails', [mod(SAN, "const c = import('../svg-safety/css-chunk');")], 1],
    ['a sanitiser importing the index fails', [mod(SAN, "import { resolveCss } from '../svg-safety';")], 1],
    ['a sanitiser re-exporting the resolver fails', [mod('src/svg-image/sanitize.ts', "export { resolveCss } from '../svg-safety/css';")], 1],
    ['a sanitiser importing a type of the resolver is free', [mod(SAN, "import type { SvgCssResolve } from '../contracts/svg-safety';")], 0],
    ['an open site value-importing the loader passes', [mod('src/svg-editor/mc-svg-editor.ts', "import { loadSvgCss } from '../svg-safety/css-loader';")], 0],
    ['each open site may import the loader', SITES.map((s) => mod(s.slice(2), "import { loadSvgCss } from '../svg-safety/css-loader';")), 0],
    ['an open site with a double-quoted loader import passes', [mod('src/transfer/panel.ts', 'import { loadSvgCss } from "../svg-safety/css-loader";')], 0],
    ['an open site taking the resolver fails', [mod('src/transfer/panel.ts', "import { resolveCss } from '../svg-safety/css';")], 1],
    ['an open site taking the index fails', [mod('src/image-editor/chunk.ts', "import { resolveCss } from '../svg-safety';")], 1],
    ['an open site taking a value rule fails', [mod('src/image-editor/chunk.ts', "import { cleanValue } from '../svg-safety/clean';")], 1],
    ['an open site re-exporting the loader passes', [mod('src/image-editor/chunk.ts', "export { loadSvgCss } from '../svg-safety/css-loader';")], 0],
    ['an open site with a dynamic import of the loader passes', [mod('src/image-editor/chunk.ts', "const l = import('../svg-safety/css-loader');")], 0],
    ['an open site with a bare import of the resolver fails', [mod('src/image-editor/chunk.ts', "import '../svg-safety/css';")], 1],
    ['an open site with a type import of svg-safety is free', [mod('src/image-editor/chunk.ts', "import type { SvgPolicy } from '../svg-safety';")], 0],
    ['a module that is no open site importing the loader fails', [mod('src/svg-editor/layers.ts', "import { loadSvgCss } from '../svg-safety/css-loader';")], 1],
    ['a card module importing the loader fails', [mod('src/icons/mc-svg-icon.ts', "import { loadSvgCss } from '../svg-safety/css-loader';")], 1],
    ['a dynamic import of the loader outside the sites fails', [mod('src/icons/a.ts', "const l = import('../svg-safety/css-loader');")], 1],
    ['an export-from of the loader outside the sites fails', [mod('src/icons/a.ts', "export * from '../svg-safety/css-loader';")], 1],
    ['a type import of the loader is free', [mod('src/icons/a.ts', "import type { LoadSvgCss } from '../svg-safety/css-loader';")], 0],
    ['the loader may import the contracts and its own chunk entry', [mod('src/svg-safety/css-loader.ts', "import { SVG_CSS_LOAD_TIMEOUT_MS } from '../contracts/svg-safety';\nconst c = import(/* webpackChunkName: \"svg-css\" */ './css-chunk');")], 0],
    ['the chunk entry may import the resolver', [mod('src/svg-safety/css-chunk.ts', "import { resolveCss } from './css';")], 0],
    ['the index may import the resolver', [mod('src/svg-safety/index.ts', "export { resolveCss } from './css';")], 0],
    ['another svg-safety module importing the resolver fails', [mod('src/svg-safety/values.ts', "import { resolveCss } from './css';")], 1],
    ['another svg-safety module importing the chunk entry fails', [mod('src/svg-safety/values.ts', "import { BUILD } from './css-chunk';")], 1],
    ['the loader importing the resolver fails', [mod('src/svg-safety/css-loader.ts', "import { resolveCss } from './css';")], 1],
    ['the loader importing another feature fails', [mod('src/svg-safety/css-loader.ts', "import { t } from '../utils/lazy-chunk';")], 1],
    ['a type import of the resolver is free', [mod('src/svg-safety/values.ts', "import type { SvgCssOutcome } from './css';")], 0],
    ['any other module value-importing svg-safety fails', [mod('src/icons/mc-svg-icon.ts', "import { cleanValue } from '../svg-safety';")], 1],
    ['a re-export from svg-safety fails', [mod('src/icons/a.ts', "export { cleanValue } from '../svg-safety/values';")], 1],
    ['a bare import of svg-safety fails', [mod('src/icons/a.ts', "import '../svg-safety/values';")], 1],
    ['a dynamic import of svg-safety fails', [mod('src/icons/a.ts', "const m = import('../svg-safety/values');")], 1],
    ['a double-quoted import of svg-safety fails', [mod('src/icons/a.ts', 'import { x } from "../svg-safety/values";')], 1],
    ['a type import of svg-safety is free', [mod('src/icons/a.ts', "import type { SvgPolicy } from '../svg-safety';")], 0],
    ['the contract file is free', [mod('src/icons/a.ts', "import { SVG_SAFETY_CONTRACT } from '../contracts/svg-safety';")], 0],
    ['svg-safety modules may import each other and the contracts', [mod('src/svg-safety/css.ts', "import { onlyFunctions } from './values';\nimport { IMAGE_ID_RE } from '../contracts/svg-image';\nimport type { X } from 'lit';")], 0],
    ['svg-safety importing a package fails', [mod('src/svg-safety/css.ts', "import { html } from 'lit';")], 1],
    ['svg-safety importing another feature fails', [mod('src/svg-safety/css.ts', "import { fmt } from '../icons/svg-geometry';")], 1],
    ['svg-safety re-exporting another feature fails', [mod('src/svg-safety/index.ts', "export { fmt } from '../icons/svg-geometry';")], 1],
    ['svg-safety calling unsafeSVG fails', [mod('src/svg-safety/css.ts', 'const a = unsafeSVG(x);')], 1],
    ['svg-safety making an svg Blob fails', [mod('src/svg-safety/css.ts', "const b = new Blob([a], { type: 'image/svg+xml' });")], 1],
    ['a brand cast outside the sanitisers fails', [mod('src/svg-io/read.ts', 'const m = text as SanitisedIconMarkup;')], 1],
    ['a double cast to a brand fails', [mod('src/svg-io/read.ts', 'const m = text as unknown as SanitisedImageMarkup;')], 1],
    ['a brand used as a type is free', [mod('src/svg-io/read.ts', 'export const read = (m: SanitisedMarkup) => m;')], 0],
    ['a brand cast in a sanitiser is free', [mod(SAN, 'const m = text as SanitisedIconMarkup;')], 0],
    ['a brand cast in a comment is free', [mod('src/svg-io/read.ts', '// text as SanitisedIconMarkup')], 0],
  ];
  const read = [
    ['the open sites are read from the contract text', JSON.stringify(parseOpenSites("export const SVG_CSS_OPEN_SITES: readonly string[] = [\n  'src/a/b.ts',\n  'src/c/d.ts',\n];\nexport const X = ['src/e.ts'];")) === JSON.stringify(['./src/a/b.ts', './src/c/d.ts'])],
    ['the real contract lists the four open sites', JSON.stringify(openSites()) === JSON.stringify(SITES)],
  ];
  for (const [name, ok] of read) {
    if (!ok) {
      bad++;
      console.error(`self-test FAIL: ${name}`);
    }
  }
  for (const [name, modules, want] of boundary) {
    const got = boundaryProblems(modules, SITES).length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  // the built graph: a chunk with a svg-safety module holds a sanitiser
  const LOADER = './src/svg-safety/css-loader.ts';
  const CSS = './src/svg-safety/css.ts';
  const CHUNK = './src/svg-safety/css-chunk.ts';
  const cssChunk = { id: 20, parents: [12, 13], files: ['magic-card-svg-css.js'], names: ['svg-css'], modules: [CSS, CHUNK, './src/svg-safety/values.ts'] };
  const openChunk = { id: 13, parents: [0], files: ['magic-card-image-editor.js'], names: ['image-editor'], modules: ['./src/image-editor/chunk.ts', LOADER] };
  const rules = [
    ['a chunk with svg-safety and the icon sanitiser passes', { chunks: [entry, { ...icon, modules: [...icon.modules, './src/svg-safety/values.ts'] }, particles], sinks }, 0],
    ['a chunk with svg-safety and the image sanitiser passes', { chunks: [entry, icon, particles, { ...imageChunk, modules: [...imageChunk.modules, './src/svg-safety/values.ts'] }], sinks: [...sinks, imageSink] }, 0],
    ['a chunk with svg-safety and no sanitiser fails', { chunks: [entry, icon, particles, { id: 11, parents: [0], files: ['magic-card-x.js'], names: ['x'], modules: ['./src/svg-safety/values.ts'] }], sinks }, 1],
    ['a chunk whose only svg-safety module is the loader passes', { chunks: [entry, icon, particles, cssChunk, { id: 12, parents: [0], files: ['magic-card-svg-editor.js'], names: ['svg-editor'], modules: ['./src/svg-editor/x.ts', LOADER] }], sinks }, 0],
    ['a chunk with the loader and another svg-safety module but no sanitiser fails', { chunks: [entry, icon, particles, cssChunk, { id: 12, parents: [0], files: ['magic-card-svg-editor.js'], names: ['svg-editor'], modules: [LOADER, './src/svg-safety/values.ts'] }], sinks }, 1],
    ['a chunk with the loader and a sanitiser passes', { chunks: [entry, icon, particles, cssChunk, { id: 12, parents: [0], files: ['magic-card-animation-studio.js'], names: ['animation-studio'], modules: [LOADER, './src/svg-safety/values.ts', S] }], sinks }, 0],
    ['the svg-css chunk with the resolver, the entry and values passes', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, './src/svg-safety/values.ts', './src/contracts/svg-safety.ts'] }, openChunk], sinks }, 0],
    ['the svg-css chunk holding a sanitiser fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, S] }, openChunk], sinks }, 1],
    ['the svg-css chunk holding the image sanitiser fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, IS] }, openChunk], sinks }, 2],
    ['the svg-css chunk holding a sink fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, './src/particles/svg.ts'] }, openChunk], sinks }, 2],
    ['the svg-css chunk holding parse.ts fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, './src/svg-safety/parse.ts'] }, openChunk], sinks }, 1],
    ['the svg-css chunk holding a module of another folder fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CSS, CHUNK, './src/utils/x.ts'] }, openChunk], sinks }, 1],
    ['the svg-css chunk with an async child fails', { chunks: [entry, icon, particles, cssChunk, openChunk, { id: 14, parents: [20], files: ['magic-card-y.js'], names: ['y'], modules: [] }], sinks }, 1],
    ['the svg-css chunk without the resolver fails', { chunks: [entry, icon, particles, { ...cssChunk, modules: [CHUNK] }, openChunk], sinks }, 1],
    ['the resolver in a render chunk fails', { chunks: [entry, { ...icon, modules: [...icon.modules, CSS] }, particles, cssChunk, openChunk], sinks }, 1],
    ['the resolver in the entry fails', { chunks: [{ ...entry, modules: ['./src/index.ts', CSS] }, icon, particles, cssChunk, openChunk], sinks }, 2],
    ['the resolver in an editor chunk fails', { chunks: [entry, icon, particles, cssChunk, { ...openChunk, modules: [...openChunk.modules, CSS] }], sinks }, 2],
    ['the chunk entry in an editor chunk fails', { chunks: [entry, icon, particles, cssChunk, { ...openChunk, modules: [...openChunk.modules, CHUNK] }], sinks }, 2],
    ['the loader in the entry fails', { chunks: [{ ...entry, modules: ['./src/index.ts', LOADER] }, icon, particles, cssChunk, openChunk], sinks }, 1],
    ['the loader in the svg-icon chunk fails', { chunks: [entry, { ...icon, modules: [...icon.modules, LOADER] }, particles, cssChunk, openChunk], sinks }, 1],
    ['the loader in the anim-runtime chunk fails', { chunks: [entry, icon, particles, { id: 15, parents: [0], files: ['magic-card-anim-runtime.js'], names: ['anim-runtime'], modules: [LOADER] }, cssChunk, openChunk], sinks }, 1],
    ['a loader without an svg-css chunk fails', { chunks: [entry, icon, particles, openChunk], sinks }, 1],
    ['a build without the loader and without the chunk passes', { chunks: [entry, icon, particles], sinks }, 0],
    ['svg-safety in the entry without a sanitiser fails', { chunks: [{ ...entry, modules: ['./src/index.ts', './src/svg-safety/values.ts'] }, icon, particles], sinks }, 1],
  ];
  for (const [name, input, want] of rules) {
    const got = evaluate(input).problems.length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  if (bad) process.exit(1);
  console.log(`svg-sinks self-test: ${cases.length + parseCases.length + scan.length + imports.length + boundary.length + rules.length + 1} cases ok`);
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
  const sources = readSources(path.join(root, 'src'));
  const found = sinksInSources(path.join(root, 'src'), named, sources);
  const sinks = [...new Map([...listed, ...found].map((x) => [x.module, x])).values()].sort((x, y) => (x.module < y.module ? -1 : 1));
  const { problems, notes } = evaluate({ chunks: stats.chunks, sinks, strict });
  problems.push(...boundaryProblems(sources));
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
