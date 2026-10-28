/*
 * Webpack pre-loader (production and development) for src/**.ts: rewrites the id of every t / tx / m /
 * tc call of a namespace into its index in that namespace's table, t('Background colour') -> t(17),
 * m('Flame') -> 17, tc('verb', 'Clear') -> tc('verb', 17); a key becomes its index too,
 * t('card-editor.design.background.label') -> t(17), so no key reaches dist. Contracts src/contracts/i18n.ts
 * 1.1.0 and i18n-keys.ts.
 * Calls are found through the imports of a namespace's i18n folder (tools/i18n/lib.cjs), so only real
 * i18n calls change. The index map is the en-GB table of the namespace's messages.gen.ts
 * (written by npm run i18n, which the prebuild script runs); an id missing there is a build error. The index of a
 * key comes from the namespace's catalogues (tools/i18n/keys.cjs), the same function that writes the table; a
 * namespace with an en-GB.json takes keys only.
 */
const fs = require('fs');
const path = require('path');
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

const maps = new Map(); // gen file -> { mtime, index }

function indexOf(genFile) {
  const mtime = fs.statSync(genFile).mtimeMs;
  const hit = maps.get(genFile);
  if (hit && hit.mtime === mtime) return hit.index;
  const index = new Map(lib.readGenIds(genFile).map((id, i) => [id, i]));
  maps.set(genFile, { mtime, index });
  return index;
}

const keyMaps = new Map(); // namespace folder -> { stamp, index }

/** key -> table index of a key namespace, rebuilt when one of its catalogues changes. */
function keyIndex(dir) {
  const stamp = ['en-GB.json', 'en-US.json', 'nl.json'].map((f) => (fs.existsSync(path.join(dir, f)) ? fs.statSync(path.join(dir, f)).mtimeMs : 0)).join(',');
  const hit = keyMaps.get(dir);
  if (hit && hit.stamp === stamp) return hit.index;
  const index = keys.tablesForKeys(keys.loadCatalogues(dir)).indexOf;
  keyMaps.set(dir, { stamp, index });
  return index;
}

function fail(ctx, message, source) {
  ctx.emitError(new Error(message));
  return source;
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
  const nsDirs = new Map(nsList.map((n) => [n.ns, n.dir]));
  const edits = [];
  for (const c of calls) {
    const gen = dirs.get(c.ns);
    const migrated = keys.hasKeys(nsDirs.get(c.ns));
    this.addDependency(gen);
    let i;
    if (c.kind === 'key' || migrated) {
      const where = `${lib.rel(file)}:${c.line}`;
      if (!migrated) return fail(this, `${where} "${c.id}" is a key and ${c.ns} has no en-GB.json.`, source);
      if (c.kind !== 'key') return fail(this, `${where} "${c.id.slice(0, 40)}" is a text id; ${c.ns} takes keys only.`, source);
      if (c.text.split('.')[0] !== c.ns) return fail(this, `${where} "${c.text}" must start with "${c.ns}.".`, source);
      for (const f of ['en-GB.json', 'en-US.json', 'nl.json']) this.addDependency(path.join(nsDirs.get(c.ns), f));
      i = keyIndex(nsDirs.get(c.ns)).get(c.text);
      if (i === undefined) return fail(this, `${where} "${c.text}" is not in ${c.ns}/en-GB.json.`, source);
    } else i = indexOf(gen).get(c.id);
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
