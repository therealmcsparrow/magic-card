// Test helper: resolves a message key the way the build does, so a test names the key, not the text.
// msg(key, args?) renders in the current locale; msgIndex(key) is the index the loader writes.
import { createRequire } from 'node:module';
import { i18nFor } from '../../src/i18n/runtime';
import { TABLE_SEPARATOR, type I18nNamespace, type LocaleTables, type ModuleI18n, type TestMsg, type TestMsgIndex } from '../../src/contracts/i18n';

const require = createRequire(import.meta.url);
const lib = require('./lib.cjs');
const keys = require('./keys.cjs');

interface Compiled {
  indexOf: Map<string, number>;
  mod: ModuleI18n;
}
const compiled = new Map<string, Compiled>();

function forKey(key: string): Compiled {
  const ns = key.split('.')[0];
  const hit = compiled.get(ns);
  if (hit) return hit;
  const entry = (lib.activeNamespaces() as Array<{ ns: string; dir: string }>).find((n) => n.ns === ns);
  if (!entry) throw new Error(`test-msg: "${key}" does not start with the name of a namespace`);
  const tables = keys.tablesForKeys(keys.loadCatalogues(entry.dir)) as { rows: string[][]; indexOf: Map<string, number> };
  const mod = i18nFor(ns as I18nNamespace, tables.rows.map((r) => r.join(TABLE_SEPARATOR)) as unknown as LocaleTables);
  const made = { indexOf: tables.indexOf, mod };
  compiled.set(ns, made);
  return made;
}

export const msgIndex: TestMsgIndex = (key) => {
  const i = forKey(key).indexOf.get(key);
  if (i === undefined) throw new Error(`test-msg: "${key}" is not in the en-GB.json of its namespace`);
  return i;
};

export const msg: TestMsg = (key, args) => forKey(key).mod.t(msgIndex(key), args);
