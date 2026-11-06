// Text snapshot of one namespace: for every i18n call of the namespace, in file and call order, the English
// (en-GB), American English (en-US) and Dutch text the compiled tables give it, and the arguments of the message.
// A call with a text id is read from the old catalogues, a call with a key from the tables keys.tablesForKeys
// builds (the same ones the loader indexes into). Taking a snapshot before and after a namespace moves to keys
// and comparing them proves that every place still shows the same words.
//
//   node tools/i18n/text-snapshot.mjs <namespace> --out before.json
//   node tools/i18n/text-snapshot.mjs <namespace> --compare before.json [--reworded reworded.json]
//
// --reworded takes the list the codemod prints for the texts it changed on purpose ([{ locale, from, to }]).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { relFile, sourceFiles } from '../i18n-codemod.mjs';

const require = createRequire(import.meta.url);
const lib = require('./lib.cjs');
const keys = require('./keys.cjs');

const LOCALES = ['en-GB', 'en-US', 'nl'];
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;

const stringOf = (map, id) => {
  const v = map?.get(id);
  return typeof v === 'string' && v !== '' ? v : undefined;
};

const argsOf = (text) => {
  const p = lib.parseMessage(text);
  return p.error ? 'invalid' : lib.argSig(p.args);
};

/** { ns, sites: [{ site, fn, ref, 'en-GB', 'en-US', nl, args }], unresolved: [{ site, ref, why }] }; a site is `file#n`, n counting the namespace's calls in that file from 1. */
export function takeSnapshot({ ns, nsList = lib.activeNamespaces(), files, root = lib.ROOT }) {
  const entry = nsList.find((n) => n.ns === ns);
  if (!entry) throw new Error(`namespace "${ns}" is not in tools/i18n/config.json`);
  const cat = keys.loadCatalogues(entry.dir);
  const tables = cat.has ? keys.tablesForKeys(cat) : null;
  const legacy = cat.has
    ? null
    : { us: keys.readMap(path.join(entry.dir, 'en-US.json'))?.map ?? new Map(), nl: keys.readMap(path.join(entry.dir, 'nl.json'))?.map ?? new Map() };
  const sites = [];
  const unresolved = [];
  for (const file of [...(files ?? sourceFiles())].sort()) {
    if (fs.statSync(file).size > MAX_SOURCE_BYTES) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!/i18n/.test(source)) continue;
    const rf = relFile(root, file);
    let n = 0;
    for (const c of lib.scanSource(file, source, nsList).calls) {
      if (c.ns !== ns) continue;
      const site = `${rf}#${++n}`;
      let texts;
      let why = '';
      if (c.kind === 'key') {
        const i = tables?.indexOf.get(c.id);
        if (i === undefined) why = 'key not in en-GB.json';
        else {
          const gb = tables.rows[0][i];
          texts = [gb, tables.rows[1][i] || gb, tables.rows[2][i] || gb];
        }
      } else if (cat.has) why = 'text id in a namespace with keys';
      else texts = [c.text, stringOf(legacy.us, c.id) ?? c.text, stringOf(legacy.nl, c.id) ?? c.text];
      if (!texts) {
        unresolved.push({ site, ref: c.id, why });
        sites.push({ site, fn: c.fn, ref: c.id, 'en-GB': '', 'en-US': '', nl: '', args: '' });
        continue;
      }
      sites.push({ site, fn: c.fn, ref: c.id, 'en-GB': texts[0], 'en-US': texts[1], nl: texts[2], args: argsOf(texts[0]) });
    }
  }
  return { ns, sites, unresolved };
}

/**
 * Differences between two snapshots: [{ site, locale, before, after }]. locale is en-GB, en-US, nl, 'args' (the
 * arguments of the message differ), 'sites' (a call is missing on one side) or 'unresolved' (a key without text).
 * `reworded` lists texts changed on purpose; a difference that equals one of them is not reported.
 */
export function compareSnapshots(before, after, { reworded = [] } = {}) {
  const accepted = new Set(reworded.map((r) => `${r.locale}\0${r.from}\0${r.to}`));
  const diffs = [];
  if (before.sites.length !== after.sites.length) diffs.push({ site: '*', locale: 'sites', before: String(before.sites.length), after: String(after.sites.length) });
  const afterBySite = new Map(after.sites.map((s) => [s.site, s]));
  const beforeBySite = new Map(before.sites.map((s) => [s.site, s]));
  for (const b of before.sites) {
    const a = afterBySite.get(b.site);
    if (!a) {
      diffs.push({ site: b.site, locale: 'sites', before: b.ref, after: '' });
      continue;
    }
    for (const l of LOCALES) if (b[l] !== a[l] && !accepted.has(`${l}\0${b[l]}\0${a[l]}`)) diffs.push({ site: b.site, locale: l, before: b[l], after: a[l] });
    if (b.args !== a.args) diffs.push({ site: b.site, locale: 'args', before: b.args, after: a.args });
  }
  for (const a of after.sites) if (!beforeBySite.has(a.site)) diffs.push({ site: a.site, locale: 'sites', before: '', after: a.ref });
  for (const u of [...before.unresolved, ...after.unresolved]) diffs.push({ site: u.site, locale: 'unresolved', before: '', after: `${u.ref} (${u.why})` });
  return diffs;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const opt = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const ns = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  try {
    if (!ns) throw new Error('usage: node tools/i18n/text-snapshot.mjs <namespace> (--out file | --compare file [--reworded file])');
    const now = takeSnapshot({ ns });
    const out = opt('--out');
    const cmp = opt('--compare');
    if (out) {
      fs.writeFileSync(out, JSON.stringify(now, null, 2) + '\n');
      console.log(`${ns}: ${now.sites.length} calls written to ${out}`);
    } else if (cmp) {
      const rw = opt('--reworded');
      const diffs = compareSnapshots(JSON.parse(fs.readFileSync(cmp, 'utf8')), now, { reworded: rw ? JSON.parse(fs.readFileSync(rw, 'utf8')) : [] });
      for (const d of diffs) console.log(`${d.site} ${d.locale}: ${JSON.stringify(d.before)} -> ${JSON.stringify(d.after)}`);
      console.log(diffs.length ? `${ns}: ${diffs.length} differences` : `${ns}: ${now.sites.length} calls, the same text in every locale`);
      process.exit(diffs.length ? 1 : 0);
    } else throw new Error('give --out <file> or --compare <file>');
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
