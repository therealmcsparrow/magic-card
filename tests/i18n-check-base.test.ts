import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
// @ts-expect-error plain .mjs tool without types
import { touchedKeys, escalateTouched } from '../tools/i18n-check.mjs';

const require = createRequire(import.meta.url);
const keys = require('../tools/i18n/keys.cjs');

type Result = { rule: string; level: string; msg: string };
const gbEntry = (text: string) => ({ text, note: 'Where the text shows and what it does.', max: 80 });
const tr = (text: string, from: string) => ({ text, hash: keys.sourceHash(from) });
const site = [{ file: 'src/x.ts', line: 1, fn: 't' }];
const cat = (gb: Record<string, unknown>, us: Record<string, unknown>, nl: Record<string, unknown>) => ({
  has: true,
  gb: new Map(Object.entries(gb)),
  us: new Map(Object.entries(us)),
  nl: new Map(Object.entries(nl)),
  raw: { gb: null, us: null, nl: null },
});
const run = (c: ReturnType<typeof cat>, base: Record<string, unknown> | null) => {
  const results = keys.checkNamespace({ ns: 'demo', cat: c, uses: new Map([...c.gb.keys()].map((k) => [k, site])), pending: true, strict: false }) as Result[];
  const touched = touchedKeys(c.gb, base === null ? null : new Map(Object.entries(base)));
  return escalateTouched(results, 'demo', touched) as Result[];
};
const level = (out: Result[], rule: string) => out.filter((r) => r.rule === rule).map((r) => r.level);

const A = 'demo.panel.title.label';
const B = 'demo.panel.other.label';

describe('touchedKeys', () => {
  it('lists a key that is new against the base or whose en-GB text differs', () => {
    const now = new Map([[A, gbEntry('Colour')], [B, gbEntry('Size')], ['demo.panel.new.label', gbEntry('New')]]);
    const base = new Map<string, unknown>([[A, gbEntry('Color')], [B, gbEntry('Size')]]);
    expect([...touchedKeys(now, base)].sort()).toEqual(['demo.panel.new.label', A]);
  });

  it('does not list a key whose note changed but whose text did not', () => {
    const now = new Map([[A, { ...gbEntry('Colour'), note: 'A different note that is long enough.' }]]);
    expect([...touchedKeys(now, new Map([[A, gbEntry('Colour')]]))]).toEqual([]);
  });

  it('lists every key when the base has no catalogue for the namespace', () => {
    expect([...touchedKeys(new Map([[A, gbEntry('Colour')]]), null)]).toEqual([A]);
  });
});

describe('--base escalation', () => {
  it('fails a touched key with a stale nl', () => {
    const c = cat({ [A]: gbEntry('Colour') }, { [A]: tr('Color', 'Colour') }, { [A]: tr('Kleur', 'Color') });
    const out = run(c, { [A]: gbEntry('Color') });
    expect(level(out, 'D9')).toEqual(['error']);
  });

  it('only warns for an untouched stale key', () => {
    const c = cat({ [A]: gbEntry('Colour') }, { [A]: tr('Color', 'Colour') }, { [A]: tr('Kleur', 'Color') });
    const out = run(c, { [A]: gbEntry('Colour') });
    expect(level(out, 'D9')).toEqual(['warn']);
  });

  it('fails a new key without nl', () => {
    const c = cat({ [A]: gbEntry('Colour') }, { [A]: tr('Color', 'Colour') }, {});
    const out = run(c, {});
    expect(level(out, 'D2')).toEqual(['error']);
  });

  it('only warns for an untouched key without nl', () => {
    const c = cat({ [A]: gbEntry('Colour') }, { [A]: tr('Color', 'Colour') }, {});
    const out = run(c, { [A]: gbEntry('Colour') });
    expect(level(out, 'D2')).toEqual(['warn']);
  });

  it('leaves errors of other rules and other keys alone', () => {
    const c = cat(
      { [A]: gbEntry('Colour'), [B]: gbEntry('Size') },
      { [A]: tr('Color', 'Colour'), [B]: tr('Size', 'Size') },
      { [A]: tr('Kleur', 'Colour'), [B]: tr('Maat', 'Old') },
    );
    const out = run(c, { [A]: gbEntry('Colour'), [B]: gbEntry('Size') });
    expect(level(out, 'D9')).toEqual(['warn']);
    expect(out.filter((r) => r.level === 'error')).toEqual([]);
  });
});

describe('command line', () => {
  const tool = path.resolve(__dirname, '../tools/check-i18n.mjs');
  const exec = (...args: string[]) => spawnSync(process.execPath, [tool, ...args], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' });

  it('fails when the base does not resolve to a commit', () => {
    const r = exec('--ci', '--base', 'no-such-ref-for-i18n-check');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/base .* does not resolve/);
  });

  it('refuses a base that looks like an option', () => {
    const r = exec('--ci', '--base', '--upload-pack=x');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/base .* does not resolve/);
  });
}, 120000);
