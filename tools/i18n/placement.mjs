// D7 placement (contract src/contracts/i18n.ts, "Where tables live"): which built file holds the runtime, the
// tables and the call sites. Input: the module lists of the card build (STATS_FILE) and the utils build
// (UTILS_STATS_FILE) that webpack.config.js writes. Returns { errors, notes }.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const lib = createRequire(import.meta.url)('./lib.cjs');

export const STATS_FILE = path.join(lib.ROOT, 'node_modules/.cache/magic-card/i18n-stats.json');
export const UTILS_STATS_FILE = path.join(lib.ROOT, 'node_modules/.cache/magic-card/i18n-stats.utils.json');

/** Files that carry their own copy of src/i18n/runtime.ts, per build (chunks below reuse a copy). */
const RUNTIME_FILES = {
  card: ['magic-card.js', 'magic-card-animation-studio.js'],
  utils: ['magic-card-theme-editor.js', 'magic-card-forum-shot.js'],
};

const fileOf = (name) => name.replace(/\?.*$/, '').replace(/\.[0-9a-f]{8}\.js$/, '.js');

/** dist file names an I18N_MODULES `bundle` / `chunk` text names; text in parentheses is a remark. */
const filesIn = (text) => [...(text ?? '').replace(/\((?:[^()]|\([^()]*\))*\)/g, ' ').matchAll(/magic-card[\w-]*\.js/g)].map((m) => m[0]);

/** Parses a module list file into objects without a prototype, so a module or file name never reaches Object.prototype. */
export function parseStats(text) {
  return JSON.parse(text, (_key, value) => {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return value;
    return Object.assign(Object.create(null), value);
  });
}

/**
 * stats: { chunks: [{ files: string[], modules: string[] }] } (module names like './src/i18n/runtime.ts').
 * Returns the files -> Set(module path without './') map.
 */
export function bundlesOf(stats) {
  const by = new Map();
  for (const c of stats.chunks ?? []) {
    for (const f of c.files ?? []) {
      const set = by.get(fileOf(f)) ?? new Set();
      for (const m of c.modules ?? []) set.add(m.replace(/^\.\//, ''));
      by.set(fileOf(f), set);
    }
  }
  return by;
}

let sharedFiles;
/** File names of the shared chunks (LAZY_SHARED_CHUNK_FILES of the lazy-module contract): they sit next to their users. */
function sharedChunkFiles() {
  if (sharedFiles) return sharedFiles;
  sharedFiles = new Set();
  try {
    const text = fs.readFileSync(path.join(lib.ROOT, 'src/contracts/lazy-module.ts'), 'utf8');
    const block = /^export const LAZY_SHARED_CHUNK_FILES\b[^=]*=\s*\{([^}]*)\}/m.exec(text);
    for (const m of (block?.[1] ?? '').matchAll(/magic-card[\w-]*\.js/g)) sharedFiles.add(m[0]);
  } catch {
    // no lazy-module contract: no chunk is shared
  }
  return sharedFiles;
}

/**
 * Whether the file reaches the module: it holds it, or it is a chunk and every parent chunk reaches it (a lazy chunk
 * reuses the modules of the entry it hangs off; a chunk with two parents needs both to have it). A shared chunk
 * listed as a parent is only loaded beside its user and holds no namespace index, so it is not walked.
 */
export function reaches(stats, by, file, mod, seen = new Set()) {
  if (by.get(file)?.has(mod)) return true;
  if (seen.has(file)) return false;
  seen.add(file);
  const all = stats.chunks ?? [];
  const chunk = all.find((c) => (c.files ?? []).some((f) => fileOf(f) === file));
  const shared = sharedChunkFiles();
  const parents = (chunk?.parents ?? [])
    .map((id) => all.find((c) => c.id === id))
    .filter((p) => p && !(p.files ?? []).some((f) => shared.has(fileOf(f))));
  if (!parents.length) return false;
  return parents.every((p) => reaches(stats, by, fileOf(p.files?.[0] ?? ''), mod, new Set(seen)));
}

/**
 * Checks, for a module list:
 * - runtime.ts sits in the three entries and nowhere else;
 * - each namespace's table module (messages.gen.ts) sits only in the file I18N_MODULES names (`bundle` when the
 *   tables are inline, `chunk` when they are a table chunk), the studio copy of 'card' excepted;
 * - a table-chunk namespace's index (the lazy closure) sits only in the files named by `bundle`, so magic-card.js
 *   never holds src/i18n/labels/index.ts or an import() of a table chunk;
 * `stats` (tests) replaces the module list file.
 * - every bundle that holds a t / tc / tx / m call site of a namespace also holds that namespace's index
 *   (lm() marks are numbers and need nothing).
 */
export function placement(contract, nsList, { required, stats: given, utilsStats: utilsGiven }) {
  const errors = [];
  const notes = [];
  const report = (message, hint) => {
    if (required) errors.push(`D7 ${message}`);
    else notes.push(`i18n: D7 placement skipped (${hint ?? message})`);
  };
  const buildHint = (script, file) => `no module list at ${path.relative(lib.ROOT, file)}: run npm run ${script} first`;
  if (!given && !fs.existsSync(STATS_FILE)) {
    report(buildHint('build', STATS_FILE), 'no production build module list; `npm run build`, then `node tools/check-i18n.mjs --placement`');
    return { errors, notes };
  }
  let utils = utilsGiven;
  if (!given) {
    utils = fs.existsSync(UTILS_STATS_FILE) ? undefined : null;
    // a module list older than the sources (or from a build before the module names were written) says nothing
    const newest = Math.max(...lib.listSourceFiles().map((p) => fs.statSync(p).mtimeMs));
    const files = [STATS_FILE, ...(utils === null ? [] : [UTILS_STATS_FILE])];
    const stale = files.find((f) => fs.statSync(f).mtimeMs < newest);
    if (stale) {
      const script = stale === STATS_FILE ? 'build' : 'build:utils';
      report(`the module list is older than the sources: run npm run ${script}, then node tools/check-i18n.mjs --placement`);
      return { errors, notes };
    }
  }
  const stats = given ?? parseStats(fs.readFileSync(STATS_FILE, 'utf8'));
  if (!given && utils !== null) utils = parseStats(fs.readFileSync(UTILS_STATS_FILE, 'utf8'));
  if (utils === null) report(buildHint('build:utils', UTILS_STATS_FILE));
  const builds = [{ name: 'card', stats, by: bundlesOf(stats) }];
  if (utils) builds.push({ name: 'utils', stats: utils, by: bundlesOf(utils) });
  const where = (mod) => [...new Set(builds.flatMap((b) => [...b.by.entries()].filter(([, set]) => set.has(mod)).map(([f]) => f)))].sort();
  const cfg = lib.readJson(path.join(lib.ROOT, 'tools/i18n/config.json'), { namespaces: {} }).namespaces;
  const mods = contract.I18N_MODULES;

  // runtime
  const rt = [];
  for (const b of builds) {
    for (const [f, set] of b.by) {
      if (!set.has('src/i18n/runtime.ts')) continue;
      rt.push(f);
      if (!RUNTIME_FILES[b.name].includes(f)) errors.push(`D7 src/i18n/runtime.ts is in ${f}; only ${RUNTIME_FILES[b.name].join(', ')} carry a copy in the ${b.name} build`);
    }
  }

  // lm() marker module: identity, no tables
  const mark = where('src/i18n/labels/mark.ts');
  const fileCount = builds.reduce((n, b) => n + b.by.size, 0);
  notes.push(`i18n: D7 placement checked on ${fileCount} files (runtime in ${rt.sort().join(', ')}; lm() marks in ${mark.join(', ') || 'no file'})`);

  const indexOf = (ns) => cfg[ns] && `${cfg[ns].dir}/index.ts`;
  const genOf = (ns) => cfg[ns] && `${cfg[ns].dir}/messages.gen.ts`;
  const active = new Set(nsList.map((n) => n.ns));

  for (const [ns, e] of Object.entries(mods)) {
    if (!active.has(ns)) continue;
    const tableFiles = where(genOf(ns));
    const indexFiles = where(indexOf(ns));
    const bundleFiles = filesIn(e.bundle);
    if (ns === 'card') bundleFiles.push('magic-card-animation-studio.js'); // accepted second copy (Rule 2)
    if (e.tables === 'chunk') {
      const want = filesIn(e.chunk);
      for (const f of tableFiles) if (!want.includes(f)) errors.push(`D7 ${ns}: tables are in ${f}, they belong only in ${want.join(', ')}`);
      if (!tableFiles.length) errors.push(`D7 ${ns}: the table chunk ${want.join(', ')} holds no ${genOf(ns)}`);
      for (const f of indexFiles) if (!bundleFiles.includes(f)) errors.push(`D7 ${ns}: ${indexOf(ns)} is in ${f}, it belongs only in ${bundleFiles.join(', ')}`);
    } else {
      for (const f of tableFiles) if (!bundleFiles.includes(f)) errors.push(`D7 ${ns}: tables are in ${f}, they belong only in ${bundleFiles.join(', ')}`);
      if (!tableFiles.length && bundleFiles.length) errors.push(`D7 ${ns}: no ${genOf(ns)} in ${bundleFiles.join(', ')}`);
    }
  }

  // call sites: a bundle with a call site of a namespace holds its index
  const callSites = new Map(); // ns -> Set(file)
  for (const file of lib.listSourceFiles()) {
    if (!lib.isScanned(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!/i18n/.test(source)) continue;
    for (const c of lib.scanSource(file, source, nsList).calls) {
      if (c.fn === 'lm') continue;
      (callSites.get(c.ns) ?? callSites.set(c.ns, new Set()).get(c.ns)).add(lib.rel(file));
    }
  }
  for (const [ns, files] of callSites) {
    const index = indexOf(ns);
    for (const file of files) {
      for (const b of builds) {
        for (const [f, set] of b.by) {
          if (set.has(file) && !reaches(b.stats, b.by, f, index)) errors.push(`D7 ${ns}: ${file} is in ${f}, which does not hold ${index} (nor do all its parent chunks)`);
        }
      }
    }
  }

  return { errors, notes };
}
