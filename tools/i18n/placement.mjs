// D7 placement (contract src/contracts/i18n.ts 1.0.0 r3, "Where tables live"): which built file holds the
// runtime, the tables and the call sites. Input: the module list of the production build that
// webpack.config.js writes (STATS_FILE). Pure; returns { errors, notes }.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const lib = createRequire(import.meta.url)('./lib.cjs');

export const STATS_FILE = path.join(lib.ROOT, 'node_modules/.cache/magic-card/i18n-stats.json');

/** Files that carry their own copy of src/i18n/runtime.ts (three entries; chunks below reuse a copy). */
const RUNTIME_FILES = ['magic-card.js', 'magic-card-animation-studio.js', 'magic-card-theme-editor.js'];

const fileOf = (name) => name.replace(/\?.*$/, '');

/** dist file names an I18N_MODULES `bundle` / `chunk` text names; text in parentheses is a remark. */
const filesIn = (text) => [...(text ?? '').replace(/\((?:[^()]|\([^()]*\))*\)/g, ' ').matchAll(/magic-card[\w-]*\.js/g)].map((m) => m[0]);

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

/**
 * Whether the file reaches the module: it holds it, or it is a chunk and every parent chunk reaches it (a lazy chunk
 * reuses the modules of the entry it hangs off; a chunk with two parents needs both to have it).
 */
export function reaches(stats, by, file, mod, seen = new Set()) {
  if (by.get(file)?.has(mod)) return true;
  if (seen.has(file)) return false;
  seen.add(file);
  const all = stats.chunks ?? [];
  const chunk = all.find((c) => (c.files ?? []).some((f) => fileOf(f) === file));
  const parents = (chunk?.parents ?? []).map((id) => all.find((c) => c.id === id)).filter(Boolean);
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
export function placement(contract, nsList, { required, stats: given }) {
  const errors = [];
  const notes = [];
  if (!given && !fs.existsSync(STATS_FILE)) {
    if (required) errors.push(`D7 no module list at ${path.relative(lib.ROOT, STATS_FILE)}: run npm run build first`);
    else notes.push('i18n: D7 placement skipped (no production build module list; `npm run build`, then `node tools/check-i18n.mjs --placement`)');
    return { errors, notes };
  }
  if (!given) {
    // a module list older than the sources (or from a build before the module names were written) says nothing
    const newest = Math.max(...lib.listSourceFiles().map((p) => fs.statSync(p).mtimeMs));
    if (fs.statSync(STATS_FILE).mtimeMs < newest) {
      const why = `the module list is older than the sources: run npm run build, then node tools/check-i18n.mjs --placement`;
      if (required) errors.push(`D7 ${why}`);
      else notes.push(`i18n: D7 placement skipped (${why})`);
      return { errors, notes };
    }
  }
  const stats = given ?? JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
  const by = bundlesOf(stats);
  const where = (mod) => [...by.entries()].filter(([, set]) => set.has(mod)).map(([f]) => f).sort();
  const cfg = lib.readJson(path.join(lib.ROOT, 'tools/i18n/config.json'), { namespaces: {} }).namespaces;
  const mods = contract.I18N_MODULES;

  // runtime
  const rt = where('src/i18n/runtime.ts');
  for (const f of rt) if (!RUNTIME_FILES.includes(f)) errors.push(`D7 src/i18n/runtime.ts is in ${f}; only ${RUNTIME_FILES.join(', ')} carry a copy`);

  // lm() marker module: identity, no tables
  const mark = where('src/i18n/labels/mark.ts');
  notes.push(`i18n: D7 placement checked on ${by.size} files (runtime in ${rt.join(', ')}; lm() marks in ${mark.join(', ') || 'no file'})`);

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
      for (const f of where(file)) {
        if (!reaches(stats, by, f, index)) errors.push(`D7 ${ns}: ${file} is in ${f}, which does not hold ${index} (nor do all its parent chunks)`);
      }
    }
  }

  return { errors, notes };
}
