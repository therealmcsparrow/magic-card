import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lib = require('../tools/i18n/lib.cjs');
const keys = require('../tools/i18n/keys.cjs');

type Result = { files: string[]; calls: number; waivers: number; mentions: string[]; written: boolean };

const tmpDirs: string[] = [];
afterAll(() => {
  for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true });
});

const gb = (text: string) => ({ text, note: 'Shown in the demo screen.', max: 40, ...(text.includes('{name}') ? { vars: { name: 'The name of the light.' } } : {}) });
const tr = (text: string, from: string) => ({ text, hash: keys.sourceHash(from) });
const toMap = (o: Record<string, unknown>) => new Map(Object.entries(o));

function writeNs(dir: string, entries: Record<string, [string, string, string]>) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.ts'), 'export const t = (s: string) => s;\n');
  const g: Record<string, unknown> = {};
  const u: Record<string, unknown> = {};
  const n: Record<string, unknown> = {};
  for (const [k, [en, us, nl]] of Object.entries(entries)) {
    g[k] = gb(en);
    u[k] = tr(us, en);
    n[k] = tr(nl, en);
  }
  fs.writeFileSync(path.join(dir, 'en-GB.json'), keys.canonicalJson('gb', toMap(g)));
  fs.writeFileSync(path.join(dir, 'en-US.json'), keys.canonicalJson('tr', toMap(u)));
  fs.writeFileSync(path.join(dir, 'nl.json'), keys.canonicalJson('tr', toMap(n)));
}

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-rename-'));
  tmpDirs.push(root);
  const demo = path.join(root, 'src', 'demo', 'i18n');
  const other = path.join(root, 'src', 'other', 'i18n');
  writeNs(demo, {
    'demo.light.colour': ['Colour', 'Color', 'Kleur'],
    'demo.light.title': ['Light', 'Light', 'Licht'],
    'demo.light.toggle': ['Toggle {name}', 'Toggle {name}', '{name} schakelen'],
  });
  writeNs(other, { 'other.panel.title': ['Panel', 'Panel', 'Paneel'] });
  const a = path.join(root, 'src', 'demo', 'a.ts');
  const b = path.join(root, 'src', 'demo', 'b.ts');
  const c = path.join(root, 'src', 'other', 'c.ts');
  fs.writeFileSync(a, ["import { t, m } from './i18n';", "export const x = t('demo.light.colour');", "export const y = m('demo.light.colour');", "export const z = t('demo.light.title');", ''].join('\n'));
  fs.writeFileSync(b, ["import { t as tt } from './i18n';", 'export const x = tt("demo.light.colour");', ''].join('\n'));
  fs.writeFileSync(c, ["import { t } from './i18n';", "import { t as demoT } from '../demo/i18n';", "export const x = t('other.panel.title');", "export const y = demoT('demo.light.title');", ''].join('\n'));
  fs.mkdirSync(path.join(root, 'i18n'), { recursive: true });
  const waivers = path.join(root, 'i18n', 'waivers.json');
  const renames = path.join(root, 'i18n', 'renames.json');
  fs.writeFileSync(waivers, JSON.stringify([{ key: 'demo.light.colour', hash: keys.sourceHash('Colour'), reason: 'Typo fix' }, { key: 'demo.light.title', hash: 'abcdef12', reason: 'Other' }], null, 2) + '\n');
  fs.writeFileSync(renames, '[]\n');
  fs.mkdirSync(path.join(root, 'tests'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tests', 'mention.test.ts'), "expect(label).toBe('demo.light.colour');\n");
  const nsList = [
    { ns: 'demo', dir: demo, roots: [] },
    { ns: 'other', dir: other, roots: [] },
  ];
  return { root, demo, other, a, b, c, waivers, renames, nsList, files: [a, b, c], extraDirs: [path.join(root, 'tests')] };
}

const load = async () => await import('../tools/i18n-rename.mjs');
const read = (p: string) => fs.readFileSync(p, 'utf8');
const everything = (fx: ReturnType<typeof fixture>) => [fx.a, fx.b, fx.c, fx.waivers, fx.renames, ...[fx.demo, fx.other].flatMap((d) => ['en-GB', 'en-US', 'nl'].map((l) => path.join(d, l + '.json')))].map(read);
const jsonOf = (p: string) => JSON.parse(read(p)) as Record<string, { text: string; hash?: string }>;

describe('rename tool: inside one namespace', () => {
  it('moves the en-GB, en-US and nl entries with their hashes', async () => {
    const fx = fixture();
    const { renameKey } = await load();
    const before = {
      gb: jsonOf(path.join(fx.demo, 'en-GB.json'))['demo.light.colour'],
      us: jsonOf(path.join(fx.demo, 'en-US.json'))['demo.light.colour'],
      nl: jsonOf(path.join(fx.demo, 'nl.json'))['demo.light.colour'],
    };
    const r: Result = renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames });
    expect(r.written).toBe(true);
    for (const [slot, file] of [['gb', 'en-GB.json'], ['us', 'en-US.json'], ['nl', 'nl.json']] as const) {
      const j = jsonOf(path.join(fx.demo, file));
      expect(j['demo.light.colour']).toBeUndefined();
      expect(j['demo.light.hue']).toEqual(before[slot]);
    }
    expect(jsonOf(path.join(fx.demo, 'nl.json'))['demo.light.hue'].hash).toBe(keys.sourceHash('Colour'));
  });

  it('keeps the catalogues in canonical form', async () => {
    const fx = fixture();
    const { renameKey } = await load();
    renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.zebra', waiversFile: fx.waivers, renamesFile: fx.renames });
    const cat = keys.loadCatalogues(fx.demo);
    expect(read(path.join(fx.demo, 'en-GB.json'))).toBe(keys.canonicalJson('gb', cat.gb));
    expect([...cat.gb.keys()]).toEqual(['demo.light.title', 'demo.light.toggle', 'demo.light.zebra']);
    expect(read(path.join(fx.demo, 'nl.json'))).toBe(keys.canonicalJson('tr', cat.nl));
  });

  it('rewrites the literal at every call site, keeping its quotes and the callee', async () => {
    const fx = fixture();
    const { renameKey } = await load();
    const r: Result = renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames });
    expect(read(fx.a)).toContain("t('demo.light.hue')");
    expect(read(fx.a)).toContain("m('demo.light.hue')");
    expect(read(fx.a)).toContain("t('demo.light.title')");
    expect(read(fx.b)).toContain('tt("demo.light.hue")');
    expect(r.calls).toBe(3);
    expect(r.files.sort()).toContain('src/demo/a.ts');
  });

  it('carries the waiver of the key and leaves other waivers alone', async () => {
    const fx = fixture();
    const { renameKey } = await load();
    const r: Result = renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames });
    const w = JSON.parse(read(fx.waivers));
    expect(w).toEqual([
      { key: 'demo.light.hue', hash: keys.sourceHash('Colour'), reason: 'Typo fix' },
      { key: 'demo.light.title', hash: 'abcdef12', reason: 'Other' },
    ]);
    expect(r.waivers).toBe(1);
  });

  it('records the alias in renames.json after the earlier ones', async () => {
    const fx = fixture();
    fs.writeFileSync(fx.renames, JSON.stringify([{ from: 'demo.old.name', to: 'demo.light.title' }], null, 2) + '\n');
    const { renameKey } = await load();
    renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames });
    expect(read(fx.renames)).toBe(
      JSON.stringify([{ from: 'demo.old.name', to: 'demo.light.title' }, { from: 'demo.light.colour', to: 'demo.light.hue' }], null, 2) + '\n',
    );
  });

  it('leaves a namespace that passes the check', async () => {
    const fx = fixture();
    const { renameKey } = await load();
    renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames });
    const uses = new Map<string, unknown[]>();
    for (const f of fx.files) for (const c of lib.scanSource(f, read(f), fx.nsList).calls) if (c.ns === 'demo') uses.set(c.id, [{ file: 'x.ts', line: 1, fn: c.fn }]);
    uses.set('demo.light.toggle', [{ file: 'x.ts', line: 1, fn: 't' }]);
    expect(keys.checkNamespace({ ns: 'demo', cat: keys.loadCatalogues(fx.demo), uses })).toEqual([]);
  });

  it('writes nothing in a dry run, and names where else the old key is mentioned', async () => {
    const fx = fixture();
    const before = everything(fx);
    const { renameKey } = await load();
    const r: Result = renameKey({ ...fx, from: 'demo.light.colour', to: 'demo.light.hue', waiversFile: fx.waivers, renamesFile: fx.renames, write: false });
    expect(everything(fx)).toEqual(before);
    expect(r.written).toBe(false);
    expect(r.calls).toBe(3);
    expect(r.mentions).toEqual(['tests/mention.test.ts']);
  });
});

describe('rename tool: refusals write nothing', () => {
  const refuse = async (from: string, to: string, pattern: RegExp, prep?: (fx: ReturnType<typeof fixture>) => void) => {
    const fx = fixture();
    prep?.(fx);
    const before = everything(fx);
    const { renameKey } = await load();
    expect(() => renameKey({ ...fx, from, to, waiversFile: fx.waivers, renamesFile: fx.renames })).toThrow(pattern);
    expect(everything(fx)).toEqual(before);
  };

  it('onto an existing key of the same namespace', () => refuse('demo.light.colour', 'demo.light.title', /already exists/));
  it('onto an existing key of another namespace', () => refuse('demo.light.colour', 'other.panel.title', /already exists/));
  it('of a key that is not there', () => refuse('demo.light.nothing', 'demo.light.hue', /not in/));
  it('to the same key', () => refuse('demo.light.colour', 'demo.light.colour', /same/));
  it('to a key outside the key pattern', () => refuse('demo.light.colour', 'Demo Light', /pattern/));
  it('to a key longer than the limit', () => refuse('demo.light.colour', `demo.light.${'a'.repeat(100)}`, /longer than/));
  it('to a prefix that is not a namespace with keys', () => refuse('demo.light.colour', 'nowhere.light.hue', /nowhere/));
  it('to a key that an earlier rename moved away from', () =>
    refuse('demo.light.colour', 'demo.old.name', /earlier rename/, (fx) => fs.writeFileSync(fx.renames, JSON.stringify([{ from: 'demo.old.name', to: 'demo.light.title' }]) + '\n')));
  it('to a prototype key', () => refuse('demo.light.colour', '__proto__.x.y', /pattern/));
});

describe('rename tool: across namespaces', () => {
  it('moves the entries to the other namespace and points the call at the function imported from it', async () => {
    const fx = fixture();
    fs.writeFileSync(fx.a, ["import { t } from './i18n';", "export const x = t('demo.light.colour');", ''].join('\n'));
    fs.writeFileSync(fx.c,["import { t } from './i18n';", "import { t as demoT } from '../demo/i18n';", "export const x = t('other.panel.title');", "export const y = demoT('demo.light.title');", ''].join('\n'));
    const { renameKey } = await load();
    renameKey({ ...fx, from: 'demo.light.title', to: 'other.panel.heading', waiversFile: fx.waivers, renamesFile: fx.renames });
    expect(jsonOf(path.join(fx.demo, 'en-GB.json'))['demo.light.title']).toBeUndefined();
    expect(jsonOf(path.join(fx.other, 'en-GB.json'))['other.panel.heading'].text).toBe('Light');
    expect(jsonOf(path.join(fx.other, 'nl.json'))['other.panel.heading']).toEqual({ text: 'Licht', hash: keys.sourceHash('Light') });
    expect(read(fx.c)).toContain("t('other.panel.heading')");
    expect(read(fx.c)).not.toContain('demoT(');
    expect(JSON.parse(read(fx.renames))).toEqual([{ from: 'demo.light.title', to: 'other.panel.heading' }]);
    expect(JSON.parse(read(fx.waivers))[1]).toEqual({ key: 'other.panel.heading', hash: 'abcdef12', reason: 'Other' });
  });

  it('refuses when a file calling the key does not import the function from the other namespace', async () => {
    const fx = fixture();
    const before = everything(fx);
    const { renameKey } = await load();
    expect(() => renameKey({ ...fx, from: 'demo.light.colour', to: 'other.panel.colour', waiversFile: fx.waivers, renamesFile: fx.renames })).toThrow(/src\/demo\/a\.ts.*import/);
    expect(everything(fx)).toEqual(before);
  });
});

describe('applyWrites', () => {
  it('puts back the files already written when a later write fails', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-writes-'));
    tmpDirs.push(root);
    const one = path.join(root, 'one.txt');
    fs.writeFileSync(one, 'before');
    const { applyWrites } = await import('../tools/i18n-codemod.mjs');
    expect(() =>
      applyWrites(
        new Map([
          [one, 'after'],
          [path.join(root, 'missing-dir', 'two.txt'), 'x'],
        ]),
      ),
    ).toThrow();
    expect(read(one)).toBe('before');
    expect(fs.readdirSync(root).sort()).toEqual(['one.txt']);
  });
});
