// Test helper: resolves a message key the way the build does, so a test names the key, not the text.
// msg(key, args?) renders in the current locale; msgIndex(key) is the index the loader writes.
import { createRequire } from 'node:module';
import { fmtIn, i18nFor } from '../../src/i18n/runtime';
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

/** A fixture table for one locale: the en-GB base messages and the same keys in the locale `tag`. */
export interface PluralFixture {
  tag: string;
  base: Record<string, string>;
  messages: Record<string, string>;
}

const pluralBranchKeys = (text: string): Set<string> => {
  const keys = new Set<string>();
  for (const m of text.matchAll(/(?:^|[\s{}])(zero|one|two|few|many|other)\s*\{/g)) keys.add(m[1]);
  return keys;
};

/** Problems of a fixture table: a missing key, a changed placeholder, a plural without every category of the locale. */
export function fixtureProblems(f: PluralFixture): string[] {
  const out: string[] = [];
  const cats = new Set(new Intl.PluralRules(f.tag).resolvedOptions().pluralCategories);
  for (const [key, baseText] of Object.entries(f.base)) {
    const text = f.messages[key];
    if (text === undefined) {
      out.push(`${key}: missing in ${f.tag}`);
      continue;
    }
    const base = lib.parseMessage(baseText, false, new Map(), { locale: 'en-GB', quotes: true });
    const own = lib.parseMessage(text, false, new Map(), { locale: f.tag, quotes: true });
    if (own.error) {
      out.push(`${key}: ${own.error}`);
      continue;
    }
    if (!base.error && lib.argSig(own.args) !== lib.argSig(base.args)) out.push(`${key}: arguments differ (${lib.argNames(own.args)} vs ${lib.argNames(base.args)})`);
    if ([...own.args.values()].includes('plural')) {
      const have = pluralBranchKeys(text);
      for (const c of cats) if (!have.has(c)) out.push(`${key}: no ${c} branch for ${f.tag}`);
    }
  }
  return out;
}

/** Renders fixture message `key` in the fixture's locale through the runtime formatter; throws when the table has problems. */
export function msgIn(f: PluralFixture, key: string, args: Record<string, unknown> = {}): string {
  const bad = fixtureProblems(f);
  if (bad.length) throw new Error(`test-msg: ${bad.join('; ')}`);
  return fmtIn(f.tag, f.messages[key], args as never)
    .map(String)
    .join('');
}
