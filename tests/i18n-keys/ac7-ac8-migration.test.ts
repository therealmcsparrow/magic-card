// AC7: no key string in any compiled output; a migrated namespace builds to the same tables as before (same
// indices, same bytes); identical English gets two keys and shares one table entry only when all locales match.
// AC8: the codemod keeps the rendered text of every locale byte-identical and seeds the hashes as confirmed.
// Contract: src/contracts/i18n-keys.ts "Compiled tables", "Two phases"; plan T8 (tools/i18n-codemod.mjs <namespace>).
//
// The codemod CLI is not in a contract: these tests use its header, `node tools/i18n-codemod.mjs <namespace>` (dry
// run, writes nothing) and `... --write` (rewrites the call sites, writes en-GB.json / en-US.json / nl.json).
import { afterAll, describe, expect, it } from 'vitest';
import { I18N_CONTRACT_VERSION } from '../../src/contracts/i18n';
import { KEY_PATTERN, NOTE_MIN_CHARS } from '../../src/contracts/i18n-keys';
import { callerSource, cleanupProjects, importLine, keyedProject, NAMESPACES, Project, sourceHash, writeLegacy, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const DIR = NAMESPACES.demo;
const phase2 = I18N_CONTRACT_VERSION.startsWith('2.');

describe('AC7 table order and sharing', () => {
  const entries: KeyedEntry[] = [
    { key: 'demo.c.x', text: 'Alpha', nl: 'Anders', max: 20 },
    { key: 'demo.b.one', text: 'Alpha', nl: 'Alfa', max: 20 },
    { key: 'demo.a.zeta', text: 'Alpha', nl: 'Alfa', max: 20 },
    { key: 'demo.d.beta', text: 'Beta', nl: 'Bèta', max: 20 },
  ];
  const src = importLine('demo') + entries.map((e, i) => `export const c${i} = t('${e.key}');\n`).join('');

  it('sorts the tables by en-GB text, then key, and gives keys with equal English and equal translations one entry', () => {
    const p = keyedProject(entries);
    p.write('src/demo/panel.ts', src);
    expect(p.build().code).toBe(0);
    const [gb, , nl] = p.tables('demo');
    expect(gb).toEqual(['Alpha', 'Alpha', 'Beta']);
    expect(nl).toEqual(['Alfa', 'Anders', 'Bèta']);
  });

  it('maps the sharing keys to one index and the key with another Dutch text to its own', () => {
    const p = keyedProject(entries);
    p.write('src/demo/panel.ts', src);
    p.build();
    const out = p.loader('src/demo/panel.ts', src).out;
    const idx = [...out.matchAll(/export const c(\d) = t\((\d+)\)/g)].reduce<Record<string, number>>((a, m) => ((a[entries[+m[1]].key] = +m[2]), a), {});
    expect(idx['demo.b.one']).toBe(idx['demo.a.zeta']);
    expect(idx['demo.c.x']).not.toBe(idx['demo.a.zeta']);
    expect(idx['demo.a.zeta']).toBeLessThan(idx['demo.c.x']);
    expect(idx['demo.d.beta']).toBeGreaterThan(idx['demo.c.x']);
  });

  it('never writes a key into a compiled table or a rewritten source', () => {
    const p = keyedProject(entries);
    p.write('src/demo/panel.ts', src);
    p.build();
    expect(p.read(`${DIR}/messages.gen.ts`)).not.toMatch(/demo\.[a-z]/);
    expect(p.loader('src/demo/panel.ts', src).out).not.toMatch(/demo\.[a-z]/);
  });
});

describe('AC7 a migrated namespace builds to the tables it had as text ids', () => {
  // every locale text differs from the English here (en-US spells colour, centre and favourite its own way)
  const rows: Array<{ key: string; text: string; nl: string; vars?: Record<string, string> }> = [
    { key: 'demo.panel.colour', text: 'Pick a colour', nl: 'Kies een kleur' },
    { key: 'demo.panel.centre', text: 'Centre {n}', nl: 'Centreer {n}', vars: { n: 'A number' } },
    { key: 'demo.panel.favs', text: '{n, plural, one {# favourite} other {# favourites}}', nl: '{n, plural, one {# favoriet} other {# favorieten}}', vars: { n: 'Number of favourites' } },
  ];
  const withSame = [...rows, { key: 'demo.panel.same', text: 'Same', nl: 'Same' }];

  function pair(list: typeof withSame): { legacy: Project; keyed: Project; legacySrc: string; keyedSrc: string } {
    const legacy = new Project();
    writeLegacy(legacy, 'demo', Object.fromEntries(list.map((r) => [r.text, r.nl])));
    const legacySrc = callerSource('demo', list.map((r) => r.text));
    legacy.write('src/demo/panel.ts', legacySrc);
    legacy.writeJson('tools/i18n/legacy-count.json', { demo: list.length, other: 0 });
    const keyed = keyedProject(list.map((r) => ({ key: r.key, text: r.text, nl: r.nl, max: 60, vars: r.vars })));
    const keyedSrc = callerSource('demo', list.map((r) => r.key));
    keyed.write('src/demo/panel.ts', keyedSrc);
    expect(legacy.build().code).toBe(0);
    expect(keyed.build().code).toBe(0);
    return { legacy, keyed, legacySrc, keyedSrc };
  }

  it('writes byte-identical messages.gen.ts when no locale cell equals the English', () => {
    const { legacy, keyed } = pair(rows);
    expect(keyed.read(`${DIR}/messages.gen.ts`)).toBe(legacy.read(`${DIR}/messages.gen.ts`));
  });

  it('rewrites the call sites to the same indices as the text ids had', () => {
    const { legacy, keyed, legacySrc, keyedSrc } = pair(rows);
    expect(keyed.loader('src/demo/panel.ts', keyedSrc).out).toBe(legacy.loader('src/demo/panel.ts', legacySrc).out);
  });

  it(`builds the cells that equal the English the way the contract phase says (${phase2 ? 'empty, i18n 2.0.0' : 'full, i18n 1.1.0: byte-identical to the text-id tables'})`, () => {
    const { legacy, keyed } = pair(withSame);
    if (!phase2) expect(keyed.read(`${DIR}/messages.gen.ts`)).toBe(legacy.read(`${DIR}/messages.gen.ts`));
    else {
      const [gb, us, nl] = keyed.tables('demo');
      const i = gb.indexOf('Same');
      expect(us[i]).toBe('');
      expect(nl[i]).toBe('');
    }
  });
});

describe('AC8 the codemod keeps the rendered text of every locale', () => {
  const NL: Record<string, string> = {
    Hello: 'Hallo',
    'Pick a colour': 'Kies een kleur',
    'Items: {n}': 'Items: {n}',
    'Hi {name}': 'Hoi {name}',
    '{n, plural, one {# item} other {# items}}': '{n, plural, one {# stuk} other {# stuks}}',
    'verb|Clear': 'Wissen',
    'noun|Clear': 'Helder',
    Flame: 'Vlam',
    Ok: 'Oké, prima gedaan',
  };
  const SOURCE = `${importLine('demo', 't, tc, tx, m')}export const a = [
  t('Hello'),
  t('Pick a colour'),
  t('Items: {n}', { n: 2 }),
  tx('Hi {name}', { name: 1 }),
  t('{n, plural, one {# item} other {# items}}', { n: 2 }),
  tc('verb', 'Clear'),
  tc('noun', 'Clear'),
  m('Flame'),
  t('Ok'),
];
`;
  // one call per line; m('x') becomes the bare index
  const CALL = /^\s*(?:tc\('[^']*',\s*|tx\(|t\(|m\()?(\d+)/gm;

  function legacy(): Project {
    const p = new Project();
    writeLegacy(p, 'demo', NL);
    p.write('src/demo/panel.ts', SOURCE);
    p.writeJson('tools/i18n/legacy-count.json', { demo: 9, other: 0 });
    p.writeJson('i18n/waivers.json', []);
    p.writeJson('i18n/renames.json', []);
    expect(p.build().code).toBe(0);
    return p;
  }

  /** The text each call renders, per locale, in call order. An empty cell shows en-GB (runtime fallback). */
  function rendered(p: Project): string[][] {
    const out = p.loader('src/demo/panel.ts', p.read('src/demo/panel.ts')).out;
    const [gb, us, nl] = p.tables('demo');
    const idx = [...out.matchAll(CALL)].map((m) => +m[1]);
    const strip = (c: string) => c.split('\u0001').pop() as string;
    const cell = (table: string[], i: number) => (table[i] === '' ? strip(gb[i]) : table[i]);
    return [idx.map((i) => strip(gb[i])), idx.map((i) => cell(us, i)), idx.map((i) => cell(nl, i))];
  }

  function migrated(): { p: Project; before: string[][] } {
    const p = legacy();
    const before = rendered(p);
    expect(before[0].length).toBe(9);
    const r = p.run('tools/i18n-codemod.mjs', 'demo', '--write');
    expect(r.code, r.all).toBe(0);
    p.writeJson('tools/i18n/legacy-count.json', { demo: 0, other: 0 });
    expect(p.build().code).toBe(0);
    return { p, before };
  }

  it('writes nothing without --write (dry run)', () => {
    const p = legacy();
    const before = p.snapshot();
    const r = p.run('tools/i18n-codemod.mjs', 'demo');
    expect(r.code, r.all).toBe(0);
    expect(p.snapshot()).toEqual(before);
  });

  it('renders the same text in en-GB, en-US and nl for every call, before and after', () => {
    const { p, before } = migrated();
    expect(rendered(p)).toEqual(before);
  });

  it('turns every call into a literal key of the namespace (tc included) and keeps two contexts apart', () => {
    const { p } = migrated();
    const src = p.read('src/demo/panel.ts');
    const keys = [...src.matchAll(/\b(?:tc|tx|t|m)\('([^']+)'/g)].map((m) => m[1]);
    expect(keys.length).toBeGreaterThanOrEqual(9);
    for (const k of keys) {
      expect(KEY_PATTERN.test(k), k).toBe(true);
      expect(k.startsWith('demo.'), k).toBe(true);
    }
    expect(new Set(keys).size, 'one key per place, the two Clear texts differ').toBe(keys.length);
    expect(src).not.toMatch(/\btc\(/);
  });

  it('writes en-GB.json with English, a note and a max for every key; the context of a tc call goes into its note', () => {
    const { p } = migrated();
    const gb = p.json<Record<string, { text: string; note: string; max: number }>>(`${DIR}/en-GB.json`);
    const texts = Object.values(gb).map((e) => e.text);
    for (const t of ['Hello', 'Pick a colour', 'Items: {n}', 'Hi {name}', 'Clear', 'Flame', 'Ok']) expect(texts, t).toContain(t);
    for (const e of Object.values(gb)) {
      expect(e.note.trim().length).toBeGreaterThanOrEqual(NOTE_MIN_CHARS);
      expect(Number.isInteger(e.max) && e.max > 0).toBe(true);
    }
    const clears = Object.values(gb).filter((e) => e.text === 'Clear');
    expect(clears).toHaveLength(2);
    expect(clears.some((e) => /verb/i.test(e.note))).toBe(true);
    expect(clears.some((e) => /noun/i.test(e.note))).toBe(true);
  });

  it('sets max to the larger of 1.6 x the English, en-US and nl, rounded up to a multiple of 5', () => {
    const { p } = migrated();
    const gb = p.json<Record<string, { text: string; max: number }>>(`${DIR}/en-GB.json`);
    const us = p.json<Record<string, { text: string }>>(`${DIR}/en-US.json`);
    const nl = p.json<Record<string, { text: string }>>(`${DIR}/nl.json`);
    for (const [key, e] of Object.entries(gb).filter(([, e]) => !e.text.includes('plural'))) {
      const want = Math.ceil(Math.max(Math.ceil([...e.text].length * 1.6), [...us[key].text].length, [...nl[key].text].length) / 5) * 5;
      expect(e.max, `${key} "${e.text}"`).toBe(want);
    }
  });

  it('seeds every nl hash as confirmed, so --strict needs no waiver', () => {
    const { p } = migrated();
    const gb = p.json<Record<string, { text: string }>>(`${DIR}/en-GB.json`);
    const nl = p.json<Record<string, { hash: string }>>(`${DIR}/nl.json`);
    for (const [key, e] of Object.entries(gb)) expect(nl[key].hash, key).toBe(sourceHash(e.text));
    expect(p.json('i18n/waivers.json')).toEqual([]);
    const r = p.check('--strict');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });

  it('keeps the Dutch texts as the localizer wrote them', () => {
    const { p } = migrated();
    const gb = p.json<Record<string, { text: string }>>(`${DIR}/en-GB.json`);
    const nl = p.json<Record<string, { text: string }>>(`${DIR}/nl.json`);
    const byText = (t: string) => Object.entries(gb).filter(([, e]) => e.text === t).map(([k]) => nl[k].text);
    expect(byText('Hello')).toEqual(['Hallo']);
    expect(byText('Ok')).toEqual(['Oké, prima gedaan']);
    expect(byText('Clear').sort()).toEqual(['Helder', 'Wissen']);
  });
});

describe('AC8 texts with a quote before a brace', () => {
  // D6 forbids an apostrophe before { } or # (the runtime has no quoting). 'Saved '{name}'.' is such a text in the
  // image editor and in Magic Card Utils today. AC8 says the rendered text is byte-identical.
  it('keeps the exact characters of an English text such as Saved \'{name}\'. through the codemod', () => {
    const p = new Project();
    writeLegacy(p, 'demo', { "Saved '{name}'.": "'{name}' opgeslagen." });
    p.write('src/demo/panel.ts', importLine('demo') + 'export const a = t("Saved \'{name}\'.", { name: 1 });\n');
    p.writeJson('tools/i18n/legacy-count.json', { demo: 1, other: 0 });
    p.writeJson('i18n/waivers.json', []);
    p.writeJson('i18n/renames.json', []);
    expect(p.build().code).toBe(0);
    const r = p.run('tools/i18n-codemod.mjs', 'demo', '--write');
    expect(r.code, r.all).toBe(0);
    const gb = Object.values(p.json<Record<string, { text: string }>>(`${DIR}/en-GB.json`)).map((e) => e.text);
    const nl = Object.values(p.json<Record<string, { text: string }>>(`${DIR}/nl.json`)).map((e) => e.text);
    expect(gb).toEqual(["Saved '{name}'."]);
    expect(nl).toEqual(["'{name}' opgeslagen."]);
  });
});
