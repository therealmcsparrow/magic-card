/*
 * Webpack pre-loader (production and development) for src/**.ts, also run by tools/i18n/vite-plugin.mjs in tests:
 * rewrites the key of every t / tx / m call of a namespace into its index in that namespace's table,
 * t('card-editor.design.background.label') -> t(17), m('card.flame') -> 17, so no key reaches dist. Contracts
 * src/contracts/i18n.ts 2.0.0 and i18n-keys.ts.
 * Calls are found through the imports of a namespace's i18n folder (tools/i18n/lib.cjs), so only real
 * i18n calls change. The index of a key comes from the namespace's catalogues (tools/i18n/keys.cjs), the same
 * function that writes the table. A first argument that is not a key of its namespace is a build error.
 */
const fs = require('fs');
const path = require('path');
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

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
  const nsDirs = new Map(nsList.map((n) => [n.ns, n.dir]));
  const edits = [];
  for (const c of calls) {
    const where = `${lib.rel(file)}:${c.line}`;
    const dir = nsDirs.get(c.ns);
    if (!keys.hasKeys(dir)) return fail(this, `${where} "${c.id.slice(0, 40)}": ${c.ns} has no en-GB.json.`, source);
    if (c.kind !== 'key') return fail(this, `${where} "${c.id.slice(0, 40)}" is not a key; ${c.ns} takes keys only.`, source);
    if (c.text.split('.')[0] !== c.ns) return fail(this, `${where} "${c.text}" must start with "${c.ns}.".`, source);
    for (const f of ['en-GB.json', 'en-US.json', 'nl.json']) this.addDependency(path.join(dir, f));
    const i = keyIndex(dir).get(c.text);
    if (i === undefined) return fail(this, `${where} "${c.text}" is not in ${c.ns}/en-GB.json.`, source);
    edits.push(c.fn === 'm' || c.fn === 'lm' ? { from: c.callStart, to: c.callEnd, text: String(i) } : { from: c.start, to: c.end, text: String(i) });
  }
  edits.sort((a, b) => b.from - a.from);
  let out = source;
  for (const e of edits) out = out.slice(0, e.from) + e.text + out.slice(e.to);
  return out;
};
