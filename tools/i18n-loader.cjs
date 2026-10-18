/*
 * Webpack pre-loader (production and development) for src/**.ts: rewrites the id of every t / tx / m /
 * tc call of a namespace into its index in that namespace's table, t('Background colour') -> t(17),
 * m('Flame') -> 17, tc('verb', 'Clear') -> tc('verb', 17). Contract src/contracts/i18n.ts 1.0.0 r3, ADR 0032 r2.
 * Calls are found through the imports of a namespace's i18n folder (tools/i18n/lib.cjs), so only real
 * i18n calls change. The index map is the en-GB table of the namespace's messages.gen.ts
 * (written by npm run i18n, which the prebuild script runs); an id missing there is a build error.
 */
const fs = require('fs');
const path = require('path');
const lib = require('./i18n/lib.cjs');

const maps = new Map(); // gen file -> { mtime, index }

function indexOf(genFile) {
  const mtime = fs.statSync(genFile).mtimeMs;
  const hit = maps.get(genFile);
  if (hit && hit.mtime === mtime) return hit.index;
  const index = new Map(lib.readGenIds(genFile).map((id, i) => [id, i]));
  maps.set(genFile, { mtime, index });
  return index;
}

module.exports = function i18nLoader(source) {
  if (!/i18n/.test(source)) return source;
  const file = this.resourcePath;
  if (!lib.isScanned(file)) return source;
  const nsList = lib.activeNamespaces();
  if (!nsList.length) return source;
  const { calls, violations } = lib.scanSource(file, source, nsList);
  if (violations.length) {
    const v = violations[0];
    this.emitError(new Error(`${lib.rel(file)}:${v.line} ${v.fn}(): ${v.reason}`));
    return source;
  }
  if (!calls.length) return source;
  const dirs = new Map(nsList.map((n) => [n.ns, path.join(n.dir, 'messages.gen.ts')]));
  const edits = [];
  for (const c of calls) {
    const gen = dirs.get(c.ns);
    this.addDependency(gen);
    const i = indexOf(gen).get(c.id);
    if (i === undefined) {
      this.emitError(new Error(`${lib.rel(file)}:${c.line} "${c.id}" is not in the ${c.ns} tables. Run npm run i18n.`));
      return source;
    }
    edits.push(c.fn === 'm' || c.fn === 'lm' ? { from: c.callStart, to: c.callEnd, text: String(i) } : { from: c.start, to: c.end, text: String(i) });
  }
  edits.sort((a, b) => b.from - a.from);
  let out = source;
  for (const e of edits) out = out.slice(0, e.from) + e.text + out.slice(e.to);
  return out;
};
