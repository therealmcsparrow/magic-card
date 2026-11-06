import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lib = require('../tools/i18n/lib.cjs');
const keys = require('../tools/i18n/keys.cjs');

type Report = {
  ns: string;
  keys: Map<string, string>;
  files: { file: string; calls: number }[];
  reworded: { locale: string; from: string; to: string }[];
  missingNl: string[];
  orphans: { us: string[]; nl: string[] };
  problems: string[];
  written: boolean;
};
type Diff = { site: string; locale: string; before: string; after: string };

const tmpDirs: string[] = [];
afterAll(() => {
  for (const d of tmpDirs) fs.rmSync(d, { recursive: true, force: true });
});

const LIGHT = [
  "import { t, tc } from './i18n';",
  "export const a = t('Colour');",
  "export const b = t('Toggle {name}', { name: 'x' });",
  "export const c = tc('fit', 'Fill');",
  "export const d = t('Imported \\'{name}\\'', { name: 'x' });",
  "export const e = t('Colour');",
  '',
].join('\n');

/** A plain copy of a tiny namespace: src/demo/i18n (text-id catalogues) and one view file. */
function fixture(view = LIGHT, nl: Record<string, string> | null = null) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-codemod-'));
  tmpDirs.push(root);
  const dir = path.join(root, 'src', 'demo', 'i18n');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.ts'), "export const t = (s: string, a?: object) => s + (a ? '' : '');\n");
  fs.writeFileSync(
    path.join(dir, 'en-US.json'),
    JSON.stringify({ Colour: 'Color', 'Toggle {name}': 'Toggle {name}', Fill: 'Fill', "Imported '{name}'": "Imported '{name}'", 'fit|Fill': 'Fill', 'Unused one': 'Unused one' }, null, 2) + '\n',
  );
  fs.writeFileSync(
    path.join(dir, 'nl.json'),
    JSON.stringify(
      nl ?? { Colour: 'Kleur', 'Toggle {name}': '{name} aan- of uitzetten', 'fit|Fill': 'Vullen', "Imported '{name}'": "'{name}' geimporteerd", 'Unused one': 'Ongebruikt' },
      null,
      2,
    ) + '\n',
  );
  const file = path.join(root, 'src', 'demo', 'light-view.ts');
  fs.writeFileSync(file, view);
  return { root, dir, file, nsList: [{ ns: 'demo', dir, roots: [] }], files: [file] };
}

const loadTool = async () => await import('../tools/i18n-codemod.mjs');
const loadSnap = async () => await import('../tools/i18n/text-snapshot.mjs');
const read = (p: string) => fs.readFileSync(p, 'utf8');
const readJson = (p: string) => JSON.parse(read(p)) as Record<string, Record<string, unknown>>;

describe('codemod: one namespace', () => {
  it('rewrites t / tc calls to literal keys made of the file place and the English slug', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    const src = read(fx.file);
    expect(src).toContain("t('demo.light-view.colour')");
    expect(src).toContain("t('demo.light-view.toggle-name', { name: 'x' })");
    expect(src).toContain("t('demo.light-view.fill')");
    expect(src).toContain("t('demo.light-view.imported-name', { name: 'x' })");
    expect(src).not.toMatch(/\btc\(/);
    expect(src.match(/demo\.light-view\.colour/g)).toHaveLength(2);
    expect(r.written).toBe(true);
    expect(r.problems).toEqual([]);
    expect([...r.keys.values()].sort()).toEqual(['demo.light-view.colour', 'demo.light-view.fill', 'demo.light-view.imported-name', 'demo.light-view.toggle-name']);
  });

  it('imports t in place of tc and drops tc when nothing uses it any more', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(read(fx.file).split('\n')[0]).toBe("import { t } from './i18n';");
  });

  it('adds t when the file imported only tc', async () => {
    const fx = fixture("import { tc } from './i18n';\nexport const c = tc('fit', 'Fill');\n");
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(read(fx.file)).toBe("import { t } from './i18n';\nexport const c = t('demo.light-view.fill');\n");
  });

  it('keeps a tc import that something else still uses', async () => {
    const fx = fixture("import { t, tc } from './i18n';\nexport const f = tc;\nexport const c = tc('fit', 'Fill');\n");
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(read(fx.file).split('\n')[0]).toBe("import { t, tc } from './i18n';");
  });

  it('writes en-GB.json with note, max and vars; the context of a tc call goes into the note', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gb = readJson(path.join(fx.dir, 'en-GB.json'));
    expect(Object.keys(gb)).toEqual(['demo.light-view.colour', 'demo.light-view.fill', 'demo.light-view.imported-name', 'demo.light-view.toggle-name']);
    const colour = gb['demo.light-view.colour'] as { text: string; note: string; max: number; vars?: unknown };
    expect(colour.text).toBe('Colour');
    expect(colour.note).toMatch(/light view/);
    expect(colour.note.length).toBeGreaterThanOrEqual(12);
    expect(colour.vars).toBeUndefined();
    const fill = gb['demo.light-view.fill'] as { text: string; note: string };
    expect(fill.text).toBe('Fill');
    expect(fill.note).toMatch(/fit/);
    const toggle = gb['demo.light-view.toggle-name'] as { vars: Record<string, string> };
    expect(Object.keys(toggle.vars)).toEqual(['name']);
    expect(toggle.vars.name.length).toBeGreaterThan(0);
  });

  it('sets max to the larger of 1.6 x en-GB and the en-US and nl lengths, rounded up to 5', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gb = readJson(path.join(fx.dir, 'en-GB.json')) as Record<string, { max: number }>;
    expect(gb['demo.light-view.colour'].max).toBe(10); // ceil(6 x 1.6) = 10
    expect(gb['demo.light-view.toggle-name'].max).toBe(25); // ceil(13 x 1.6) = 21 -> 25; nl is 23
    expect(gb['demo.light-view.fill'].max).toBe(10); // 4 x 1.6 = 6.4 -> 7 -> 10; nl 'Vullen' 6
  });

  it('takes the max from the nl text when it is the longest', async () => {
    const fx = fixture("import { t } from './i18n';\nexport const a = t('Colour');\n", { Colour: 'Een heel lange kleurnaam hier' });
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gb = readJson(path.join(fx.dir, 'en-GB.json')) as Record<string, { max: number }>;
    expect(gb['demo.light-view.colour'].max).toBe(30);
  });

  it('seeds en-US from the word list and nl from the old catalogue, both with the current hash as confirmed', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const us = readJson(path.join(fx.dir, 'en-US.json'));
    const nl = readJson(path.join(fx.dir, 'nl.json'));
    expect(us['demo.light-view.colour']).toEqual({ text: 'Color', hash: keys.sourceHash('Colour') });
    expect(nl['demo.light-view.colour']).toEqual({ text: 'Kleur', hash: keys.sourceHash('Colour') });
    expect(nl['demo.light-view.fill']).toEqual({ text: 'Vullen', hash: keys.sourceHash('Fill') });
    expect(Object.keys(nl)).not.toContain('demo.light-view.unused-one');
  });

  it('rewords an apostrophe before { } or # with curly quotes in every locale and reports it', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gb = readJson(path.join(fx.dir, 'en-GB.json')) as Record<string, { text: string }>;
    expect(gb['demo.light-view.imported-name'].text).toBe('Imported ‘{name}’');
    const nl = readJson(path.join(fx.dir, 'nl.json')) as Record<string, { text: string; hash: string }>;
    expect(nl['demo.light-view.imported-name'].text).toBe('‘{name}’ geimporteerd');
    expect(nl['demo.light-view.imported-name'].hash).toBe(keys.sourceHash('Imported ‘{name}’'));
    expect(r.reworded.map((x) => x.locale).sort()).toEqual(['en-GB', 'en-US', 'nl']);
  });

  it('produces catalogues that pass the namespace check', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const cat = keys.loadCatalogues(fx.dir);
    const uses = new Map<string, unknown[]>();
    const textSites: unknown[] = [];
    for (const c of lib.scanSource(fx.file, read(fx.file), fx.nsList).calls) {
      if (c.kind === 'key') uses.set(c.id, [{ file: 'light-view.ts', line: c.line, fn: c.fn }]);
      else textSites.push(c);
    }
    expect(textSites).toEqual([]);
    expect(keys.checkNamespace({ ns: 'demo', cat, uses })).toEqual([]);
  });

  it('writes the catalogues with canonicalJson (sorted, two-space, LF, final newline)', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const cat = keys.loadCatalogues(fx.dir);
    expect(read(path.join(fx.dir, 'en-GB.json'))).toBe(keys.canonicalJson('gb', cat.gb));
    expect(read(path.join(fx.dir, 'nl.json'))).toBe(keys.canonicalJson('tr', cat.nl));
    expect(read(path.join(fx.dir, 'en-US.json'))).toBe(keys.canonicalJson('tr', cat.us));
  });

  it('writes nothing in a dry run, and reports what it would do', async () => {
    const fx = fixture();
    const before = [fx.file, path.join(fx.dir, 'nl.json'), path.join(fx.dir, 'en-US.json')].map(read);
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: false });
    expect([fx.file, path.join(fx.dir, 'nl.json'), path.join(fx.dir, 'en-US.json')].map(read)).toEqual(before);
    expect(fs.existsSync(path.join(fx.dir, 'en-GB.json'))).toBe(false);
    expect(r.written).toBe(false);
    expect(r.keys.size).toBe(4);
  });

  it('is repeatable: a second run changes nothing', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const snap = [fx.file, ...['en-GB', 'en-US', 'nl'].map((l) => path.join(fx.dir, l + '.json'))].map(read);
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect([fx.file, ...['en-GB', 'en-US', 'nl'].map((l) => path.join(fx.dir, l + '.json'))].map(read)).toEqual(snap);
    expect(r.written).toBe(false);
  });

  it('gives a second text with the same slug a numbered key, and a tc call of the same text its context', async () => {
    const fx = fixture(
      ["import { t, tc } from './i18n';", "export const a = t('Colour');", "export const b = t('Colour!');", "export const c = tc('fit', 'Fill');", "export const d = tc('line', 'Fill');", ''].join('\n'),
    );
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect([...r.keys.values()].sort()).toEqual(['demo.light-view.colour', 'demo.light-view.colour-2', 'demo.light-view.fill', 'demo.light-view.fill-line']);
  });

  it('keeps every key inside the key pattern and length limit, whatever the English is', async () => {
    const { KEY_PATTERN, KEY_MAX_CHARS } = lib.loadKeysContract();
    const fx = fixture(
      [
        "import { t } from './i18n';",
        `export const a = t('${'Very long sentence '.repeat(20)}end');`,
        "export const b = t('→');",
        "export const c = t('Ünïcödé text, with: punctuation!');",
        "export const d = t('{n, plural, one {# layer} other {# layers}}', { n: 2 });",
        '',
      ].join('\n'),
    );
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(r.keys.size).toBe(4);
    for (const k of r.keys.values()) {
      expect(k).toMatch(KEY_PATTERN);
      expect(k.length).toBeLessThanOrEqual(KEY_MAX_CHARS);
    }
    expect(r.keys.get('{n, plural, one {# layer} other {# layers}}')).toBe('demo.light-view.n');
    const gb = readJson(path.join(fx.dir, 'en-GB.json')) as Record<string, { vars: Record<string, string> }>;
    expect(Object.keys(gb['demo.light-view.n'].vars)).toEqual(['n']);
  });

  it('lists a missing nl text and an unused catalogue id, and leaves a call it cannot read alone', async () => {
    const fx = fixture(["import { t } from './i18n';", "export const a = t('Brand new');", 'const id = `x${1}`;', 'export const b = t(id as never);', "export const c = t(`Colour${1}`);", ''].join('\n'));
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(r.missingNl).toEqual(['demo.light-view.brand-new']);
    expect(r.orphans.nl.sort()).toEqual(["Colour", "Imported '{name}'", 'Toggle {name}', 'Unused one', 'fit|Fill'].sort());
    expect(r.problems.join('\n')).toMatch(/light-view\.ts:5.*not a string literal/);
    expect(read(fx.file)).toContain('t(`Colour${1}`)');
  });

  it('skips a file whose own `t` would clash with the one a tc call needs, and says so', async () => {
    const view = "import { tc } from './i18n';\nexport const t = 1;\nexport const c = tc('fit', 'Fill');\n";
    const fx = fixture(view);
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(read(fx.file)).toBe(view);
    expect(r.problems.join('\n')).toMatch(/light-view\.ts.*declares t/);
    expect(r.keys.size).toBe(0);
    expect(fs.existsSync(path.join(fx.dir, 'en-GB.json'))).toBe(false);
  });

  it('refuses a namespace that is not configured', async () => {
    const fx = fixture();
    const { migrateNamespace } = await loadTool();
    expect(() => migrateNamespace({ ...fx, ns: 'nope', write: true })).toThrow(/nope/);
  });

  it('leaves calls of other namespaces and existing keys alone', async () => {
    const fx = fixture(["import { t } from './i18n';", "import { t as other } from '../other/i18n';", "export const a = t('demo.light-view.old.key');", "export const b = other('Colour');", ''].join('\n'));
    const { migrateNamespace } = await loadTool();
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    expect(r.keys.size).toBe(0);
    expect(read(fx.file)).toContain("other('Colour')");
    expect(read(fx.file)).toContain("t('demo.light-view.old.key')");
  });
});

describe('text snapshot', () => {
  it('shows the same English before and after the codemod, apart from the reworded quotes', async () => {
    const fx = fixture();
    const { takeSnapshot, compareSnapshots } = await loadSnap();
    const { migrateNamespace } = await loadTool();
    const before = takeSnapshot({ ...fx, ns: 'demo' });
    expect(before.sites).toHaveLength(5);
    const r: Report = migrateNamespace({ ...fx, ns: 'demo', write: true });
    const after = takeSnapshot({ ...fx, ns: 'demo' });
    expect(after.sites).toHaveLength(5);
    expect(after.unresolved).toEqual([]);
    expect(compareSnapshots(before, after, { reworded: r.reworded })).toEqual([]);
    const bare: Diff[] = compareSnapshots(before, after);
    expect(bare.map((d) => d.locale).sort()).toEqual(['en-GB', 'en-US', 'nl']);
    expect(bare.every((d) => d.site.endsWith('#4'))).toBe(true);
  });

  it('reads en-US and nl through the compiled tables and falls back to en-GB for an empty cell', async () => {
    const fx = fixture("import { t } from './i18n';\nexport const a = t('Toggle {name}', { name: 'x' });\n", { Other: 'x' });
    const { takeSnapshot } = await loadSnap();
    const { migrateNamespace } = await loadTool();
    const before = takeSnapshot({ ...fx, ns: 'demo' });
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const after = takeSnapshot({ ...fx, ns: 'demo' });
    expect(before.sites[0]).toMatchObject({ 'en-GB': 'Toggle {name}', 'en-US': 'Toggle {name}', nl: 'Toggle {name}', args: 'name:x' });
    expect(after.sites[0]).toMatchObject({ 'en-GB': 'Toggle {name}', nl: 'Toggle {name}', args: 'name:x' });
  });

  it('reports a text that changed, a missing key, and a different number of calls', async () => {
    const fx = fixture();
    const { takeSnapshot, compareSnapshots } = await loadSnap();
    const { migrateNamespace } = await loadTool();
    const before = takeSnapshot({ ...fx, ns: 'demo' });
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gbFile = path.join(fx.dir, 'en-GB.json');
    const gb = JSON.parse(read(gbFile));
    gb['demo.light-view.colour'].text = 'Hue';
    fs.writeFileSync(gbFile, JSON.stringify(gb, null, 2) + '\n');
    fs.writeFileSync(fx.file, read(fx.file).replace("t('demo.light-view.fill')", "t('demo.light-view.gone')"));
    const after = takeSnapshot({ ...fx, ns: 'demo' });
    expect(after.unresolved).toHaveLength(1);
    const diffs: Diff[] = compareSnapshots(before, after, { reworded: [{ locale: 'en-GB', from: "Imported '{name}'", to: 'Imported ‘{name}’' }] });
    expect(diffs.some((d) => d.before === 'Colour' && d.after === 'Hue')).toBe(true);
    expect(diffs.some((d) => /unresolved|missing/i.test(d.locale + d.after))).toBe(true);
    const short = { ...after, sites: after.sites.slice(1) };
    expect(compareSnapshots(before, short).some((d: Diff) => d.locale === 'sites')).toBe(true);
  });

  it('flags a changed argument list even when the words match', async () => {
    const fx = fixture("import { t } from './i18n';\nexport const a = t('Toggle {name}', { name: 'x' });\n");
    const { takeSnapshot, compareSnapshots } = await loadSnap();
    const { migrateNamespace } = await loadTool();
    const before = takeSnapshot({ ...fx, ns: 'demo' });
    migrateNamespace({ ...fx, ns: 'demo', write: true });
    const gbFile = path.join(fx.dir, 'en-GB.json');
    const gb = JSON.parse(read(gbFile));
    gb['demo.light-view.toggle-name'].text = 'Toggle {title}';
    fs.writeFileSync(gbFile, JSON.stringify(gb, null, 2) + '\n');
    const diffs: Diff[] = compareSnapshots(before, takeSnapshot({ ...fx, ns: 'demo' }));
    expect(diffs.some((d) => d.locale === 'args')).toBe(true);
  });
});
