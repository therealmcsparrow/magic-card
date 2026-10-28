// Compiled tables of a key namespace: sorted by en-GB text, then key; keys with equal English and equal translations
// share one entry; a cell that equals the English is empty; no key reaches a compiled table or a rewritten source.
// Contract: src/contracts/i18n-keys.ts "Compiled tables".
import { afterAll, describe, expect, it } from 'vitest';
import { i18nFor, setI18nLocale } from '../../src/i18n/runtime';
import { cleanupProjects, importLine, keyedProject, NAMESPACES, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const DIR = NAMESPACES.demo;

describe('table order and sharing', () => {
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

describe('cells that equal the English', () => {
  const entries: KeyedEntry[] = [
    { key: 'demo.panel.colour', text: 'Pick a colour', nl: 'Kies een kleur', max: 60 },
    { key: 'demo.panel.same', text: 'Same', nl: 'Same', max: 60 },
  ];

  it('writes an en-US or nl cell empty when it equals the en-GB cell and keeps the others in full', () => {
    const p = keyedProject(entries);
    expect(p.build().code).toBe(0);
    const [gb, us, nl] = p.tables('demo');
    const same = gb.indexOf('Same');
    const colour = gb.indexOf('Pick a colour');
    expect([us[same], nl[same]]).toEqual(['', '']);
    expect([us[colour], nl[colour]]).toEqual(['Pick a color', 'Kies een kleur']);
  });

  it('shows the en-GB text for an empty cell through the shipped runtime', () => {
    const p = keyedProject(entries);
    p.build();
    const [gb, us, nl] = p.tables('demo');
    const t = i18nFor('card', [gb.join('|'), us.join('|'), nl.join('|')] as never).t;
    const same = gb.indexOf('Same');
    for (const language of ['en-gb', 'en-us', 'nl']) {
      setI18nLocale({ language });
      expect(t(same), language).toBe('Same');
    }
    setI18nLocale({ language: 'en-gb' });
  });
});
