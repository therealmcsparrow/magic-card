import { describe, it, expect, afterAll, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lib = require('../tools/i18n/lib.cjs');
const keys = require('../tools/i18n/keys.cjs');
const loader = require('../tools/i18n-loader.cjs');

type Sites = { file: string; line: number; fn: string }[];
const site: Sites = [{ file: 'src/x.ts', line: 1, fn: 't' }];

const gbEntry = (text: string, extra: Record<string, unknown> = {}) => ({ text, note: 'Where the text shows and what it does.', max: 80, ...extra });
const tr = (text: string, from: string = text) => ({ text, hash: keys.sourceHash(from) });
const cat = (gb: Record<string, unknown>, us: Record<string, unknown> = {}, nl: Record<string, unknown> = {}) => ({
  has: true,
  gb: new Map(Object.entries(gb)),
  us: new Map(Object.entries(us)),
  nl: new Map(Object.entries(nl)),
  raw: { gb: null, us: null, nl: null },
});
const check = (c: ReturnType<typeof cat>, extra: Record<string, unknown> = {}) =>
  keys.checkNamespace({ ns: 'demo', cat: c, uses: new Map([...c.gb.keys()].map((k) => [k, site])), ...extra }) as { rule: string; level: string; msg: string }[];
const K = 'demo.panel.title.label';

describe('sourceHash', () => {
  it('is 8 lower-case hex characters of SHA-256 over the NFC text', () => {
    expect(keys.sourceHash('Colour')).toMatch(/^[0-9a-f]{8}$/);
    expect(keys.sourceHash('Café')).toBe(keys.sourceHash('Café'));
    expect(keys.sourceHash('Colour')).not.toBe(keys.sourceHash('Color'));
  });
});

describe('message rules (D6)', () => {
  const opts = (locale: string) => ({ locale, quotes: true });
  const parse = (t: string, locale = 'en-GB') => lib.parseMessage(t, false, new Map(), opts(locale)).error as string | undefined;
  it('refuses a message nested deeper than three brace levels', () => {
    expect(parse('{k, select, a {{n, plural, one {# x} other {# y}}} other {z}}')).toMatch(/three brace levels/);
    expect(parse('{n, plural, one {{name} has # item} other {{name} has # items}}')).toBeUndefined();
  });
  it('refuses an apostrophe before { } or #', () => {
    expect(parse("Imported '{name}'")).toMatch(/apostrophe/);
    expect(parse("{n, plural, one {'# item} other {# items}}")).toMatch(/apostrophe/);
    expect(parse("Don't {name}")).toBeUndefined();
  });
  it('does not apply the apostrophe rule to text-id messages', () => {
    expect(lib.parseMessage("Imported '{name}'").error).toBeUndefined();
  });
  it('limits plural branches to the cardinal categories of the locale, read from Intl.PluralRules', () => {
    expect(parse('{n, plural, one {a} few {b} other {c}}', 'nl')).toMatch(/"few" is not a nl category/);
    expect(parse('{n, plural, =0 {none} one {a} other {c}}', 'nl')).toBeUndefined();
    expect(parse('{n, plural, one {a} other {c}}', 'en-US')).toBeUndefined();
  });
  it('requires an other branch', () => {
    expect(parse('{n, plural, one {a}}')).toMatch(/other/);
    expect(parse('{k, select, a {x}}')).toMatch(/other/);
  });
});

describe('tablesForKeys', () => {
  const c = cat(
    { 'a.b.c': gbEntry('Colour'), 'a.b.d': gbEntry('Colour'), 'a.b.e': gbEntry('Colour'), 'a.b.f': gbEntry('Alpha') },
    { 'a.b.c': tr('Color'), 'a.b.d': tr('Color'), 'a.b.e': tr('Colour'), 'a.b.f': tr('Alpha') },
    { 'a.b.c': tr('Kleur'), 'a.b.d': tr('Kleur'), 'a.b.e': tr('Kleur'), 'a.b.f': tr('Alfa') },
  );
  const t = keys.tablesForKeys(c);
  it('orders entries by en-GB text, then key', () => {
    expect(t.rows[0]).toEqual(['Alpha', 'Colour', 'Colour']);
  });
  it('shares one entry only when all three texts are equal', () => {
    expect(t.indexOf.get('a.b.c')).toBe(t.indexOf.get('a.b.d'));
    expect(t.indexOf.get('a.b.c')).not.toBe(t.indexOf.get('a.b.e'));
    expect(t.count).toBe(3);
  });
  it('writes an en-US or nl cell equal to its en-GB cell empty', () => {
    expect(t.rows[1]).toEqual(['', 'Color', '']);
    expect(t.rows[2]).toEqual(['Alfa', 'Kleur', 'Kleur']);
  });
  it('falls back to en-GB for a missing translation, so it ships the English', () => {
    const only = keys.tablesForKeys(cat({ 'a.b.c': gbEntry('Colour') }));
    expect(only.rows).toEqual([['Colour'], [''], ['']]);
  });
});

describe('typesSource', () => {
  it('lists each key with its arguments and the English as a doc comment', () => {
    const src: string = keys.typesSource(
      cat({
        'a.b.count': gbEntry('{n, plural, one {# item} other {# items}} for {who}'),
        'a.b.plain': gbEntry('Hello */ there'),
        'a.b.kind': gbEntry('{kind, select, a {x} other {y}}'),
      }),
    );
    expect(src).toContain('export interface Keys {');
    expect(src).toContain('"a.b.count": { "n": number; "who": string | number };');
    expect(src).toContain('"a.b.plain": Record<never, never>;');
    expect(src).toContain('"a.b.kind": { "kind": string | number };');
    expect(src).toContain('/** Hello *\\/ there */');
  });
});

describe('checkNamespace', () => {
  const ok = () => cat({ [K]: gbEntry('Colour') }, { [K]: tr('Color', 'Colour') }, { [K]: tr('Kleur', 'Colour') });
  const rules = (r: { rule: string; level: string }[], level = 'error') => r.filter((x) => x.level === level).map((x) => x.rule);
  it('accepts a complete namespace', () => {
    expect(check(ok())).toEqual([]);
  });
  it('D1: a key outside the pattern, with another prefix, or not in en-GB.json', () => {
    const c = ok();
    const uses = new Map([[K, site], ['other.panel.title', site], ['demo.panel.missing', site], ['Bad Key', site]]);
    const r = keys.checkNamespace({ ns: 'demo', cat: c, uses }) as { rule: string; msg: string }[];
    expect(r.map((x) => x.msg).join('\n')).toMatch(/other\.panel\.title.*namespace "demo\."/);
    expect(r.map((x) => x.msg).join('\n')).toMatch(/demo\.panel\.missing.*not in en-GB\.json/);
    expect(r.map((x) => x.msg).join('\n')).toMatch(/Bad Key.*key pattern/);
  });
  it('D8: a missing note, a short note, a missing max', () => {
    const c = cat({ [K]: { text: 'Colour', note: 'short', max: 'x' } }, { [K]: tr('Color', 'Colour') }, { [K]: tr('Kleur', 'Colour') });
    const msgs = check(c).map((x) => x.msg).join('\n');
    expect(msgs).toMatch(/note/);
    expect(msgs).toMatch(/max must be a whole number/);
  });
  it('D8: vars must name exactly the arguments', () => {
    const text = 'Hello {name}';
    const base = (vars?: Record<string, string>) => cat({ [K]: gbEntry(text, vars ? { vars } : {}) }, { [K]: tr(text) }, { [K]: tr('Hallo {name}', text) });
    expect(check(base()).map((x) => x.msg).join()).toMatch(/vars \(none\) must describe exactly the arguments of the text \(name\)/);
    expect(check(base({ name: 'The user name' }))).toEqual([]);
    expect(check(base({ name: 'x', other: 'y' })).map((x) => x.msg).join()).toMatch(/vars \(name,other\)/);
    const none = cat({ [K]: gbEntry('Plain', { vars: { name: 'x' } }) }, { [K]: tr('Plain') }, { [K]: tr('Gewoon', 'Plain') });
    expect(check(none).map((x) => x.msg).join()).toMatch(/vars \(name\) must describe exactly the arguments of the text \(none\)/);
  });
  it('D8: an en-US or nl text over max, counted on the longest plural branch', () => {
    const c = cat({ [K]: gbEntry('Colour', { max: 8 }) }, { [K]: tr('Color', 'Colour') }, { [K]: tr('Kleurtjes!', 'Colour') });
    expect(check(c).map((x) => x.msg).join()).toMatch(/\(nl\): 10 characters, max is 8/);
    const p = '{n, plural, one {# item} other {# items in the list}}';
    expect(keys.longestText(p)).toBe('# items in the list');
  });
  it('longestText ends on an unclosed brace, also in a long run of them', () => {
    expect(keys.longestText('Hello {name')).toBe('Hello {name');
    expect(keys.longestText('{n, plural, one {# item} other {# items')).toBe('{n, plural, one {# item} other {# items');
    const run = '{'.repeat(200_000);
    const t0 = Date.now();
    expect(keys.longestText(run)).toBe(run);
    expect(Date.now() - t0).toBeLessThan(2000);
  });
  it('the American converter ends on an unclosed brace, also in a long run of them', () => {
    const us = lib.usConverter();
    expect(us('Hello {name')).toBe('Hello {name');
    const run = '{'.repeat(200_000);
    const t0 = Date.now();
    expect(us(run)).toBe(run);
    expect(Date.now() - t0).toBeLessThan(2000);
  });
  it('D8: a file with CRLF line endings fails', () => {
    const c = ok();
    c.raw.gb = String(c.raw.gb).replace(/\n/g, '\r\n');
    expect(check(c).map((x) => x.rule)).toContain('D8');
  });
  it('D8: a file that is not sorted or formatted as the contract says', () => {
    const c = ok();
    c.raw.gb = JSON.stringify(Object.fromEntries(c.gb));
    expect(check(c).map((x) => x.rule)).toContain('D8');
    c.raw.gb = keys.canonicalJson('gb', c.gb);
    expect(check(c)).toEqual([]);
  });
  it('D9: a translation made from other English is stale; a waiver for the current hash clears it', () => {
    const c = cat({ [K]: gbEntry('Colour!') }, { [K]: tr('Color!', 'Colour!') }, { [K]: tr('Kleur', 'Colour') });
    const stale = check(c);
    expect(rules(stale)).toEqual(['D9']);
    expect(stale[0].msg).toMatch(/\(nl\) is stale/);
    const waivers = new Map([[`${K}\u0000${keys.sourceHash('Colour!')}`, { key: K, hash: keys.sourceHash('Colour!'), reason: 'punctuation' }]]);
    expect(check(c, { waivers })).toEqual([]);
    expect(rules(check(c, { strict: false }), 'warn')).toEqual(['D9']);
  });
  it('D9: a waiver for an old hash does not clear a stale entry', () => {
    const c = cat({ [K]: gbEntry('Colour!') }, { [K]: tr('Color!', 'Colour!') }, { [K]: tr('Kleur', 'Colour') });
    const waivers = new Map([[`${K}\u0000${keys.sourceHash('Colour')}`, { key: K, hash: keys.sourceHash('Colour'), reason: 'typo' }]]);
    expect(rules(check(c, { waivers }))).toEqual(['D9']);
  });
  it('D2: a missing nl entry is a warning while the namespace is pending, an error otherwise', () => {
    const c = cat({ [K]: gbEntry('Colour') }, { [K]: tr('Color', 'Colour') });
    expect(rules(check(c))).toEqual(['D2']);
    expect(rules(check(c, { pending: true }), 'warn')).toEqual(['D2']);
  });
  it('D2: an en-GB entry no call uses', () => {
    const r = keys.checkNamespace({ ns: 'demo', cat: ok(), uses: new Map() }) as { msg: string }[];
    expect(r[0].msg).toMatch(/used by no call/);
  });
});

describe('waivers', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'waivers-'));
  const c = cat({ [K]: gbEntry('Colour') });
  it('flags an unknown key, an old hash and an empty reason', () => {
    const file = path.join(dir, 'waivers.json');
    fs.writeFileSync(file, JSON.stringify([
      { key: 'demo.no.key', hash: keys.sourceHash('x'), reason: 'typo' },
      { key: K, hash: keys.sourceHash('Old'), reason: 'typo' },
      { key: K, hash: keys.sourceHash('Colour'), reason: '  ' },
    ]));
    const { waivers, problems } = keys.readWaivers(file);
    expect(problems).toEqual([]);
    const out: string[] = keys.checkWaivers(waivers, [c]);
    expect(out.join('\n')).toMatch(/demo\.no\.key.*not a key of any namespace/);
    expect(out.join('\n')).toMatch(/holds hash/);
    expect(out.join('\n')).toMatch(/has no reason/);
  });
  it('rejects a file that is not an array of waivers', () => {
    const file = path.join(dir, 'bad.json');
    fs.writeFileSync(file, '{"a":1}');
    expect(keys.readWaivers(file).problems.join()).toMatch(/not a JSON array/);
  });
});

describe('scanSource', () => {
  const file = path.resolve('src/modules/advanced/forecast-view.ts');
  const nsList = [{ ns: 'card', dir: path.resolve('src/card/i18n'), roots: [] }];
  const run = (body: string) =>
    lib.scanSource(file, "import { t, tc, tx, m } from '../../card/i18n';\n" + body, nsList) as { calls: { kind: string; fn: string; id: string }[]; violations: { fn: string; reason: string }[] };
  const scan = (body: string) => run(body).calls;
  it('reports a text id and every tc call as a violation, and a key call as none', () => {
    expect(run("t('card.panel.title'); m('card.flame.name');").violations).toEqual([]);
    const v = run("t('Background colour'); tc('verb', 'Clear'); tc('card.a.b', 'card.c.d');").violations;
    expect(v.map((x) => x.fn)).toEqual(['t', 'tc', 'tc']);
    expect(v[0].reason).toMatch(/not a key/);
    expect(v[1].reason).toMatch(/tc\(\) is removed/);
  });
  it('tells a key call from a text-id call by the key pattern', () => {
    const calls = scan("t('card.panel.title'); t('Background colour'); m('card.flame.name'); tc('verb', 'Clear'); tc('card.a.b', 'card.c.d');");
    expect(calls.map((c) => [c.fn, c.kind])).toEqual([['t', 'key'], ['t', 'text'], ['m', 'key'], ['tc', 'text'], ['tc', 'text']]);
  });
  it('does not count a call whose first argument is a value', () => {
    expect(scan('const k = "x"; t(k); t(item.label);')).toEqual([]);
  });
});

describe('loader with a key namespace', () => {
  const cache = path.resolve('node_modules/.cache');
  fs.mkdirSync(cache, { recursive: true });
  const dir = fs.mkdtempSync(path.join(cache, 'i18n-keyns-'));
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));
  const write = (name: string, data: unknown) => fs.writeFileSync(path.join(dir, name), JSON.stringify(data));
  write('en-GB.json', { 'demo.a.one': gbEntry('Colour'), 'demo.a.two': gbEntry('Alpha') });
  write('en-US.json', { 'demo.a.one': tr('Color', 'Colour'), 'demo.a.two': tr('Alpha') });
  write('nl.json', { 'demo.a.one': tr('Kleur', 'Colour'), 'demo.a.two': tr('Alfa', 'Alpha') });
  fs.writeFileSync(path.join(dir, 'messages.gen.ts'), 'export default [];\n');
  const file = path.resolve('src/modules/advanced/forecast-view.ts');
  afterEach(() => vi.restoreAllMocks());
  it('rewrites a key to its table index and keeps the key out of the output', () => {
    vi.spyOn(lib, 'activeNamespaces').mockReturnValue([{ ns: 'demo', dir, roots: [] }]);
    const errors: Error[] = [];
    // the namespace's import resolves to its folder: the source imports it by a path that ends there
    const rel = path.relative(path.dirname(file), dir).split(path.sep).join('/');
    const out: string = loader.call({ resourcePath: file, addDependency: () => {}, emitError: (e: Error) => errors.push(e) }, `import { t } from '${rel}';\nt('demo.a.one'); t('demo.a.two');\n`);
    expect(errors).toEqual([]);
    expect(out).toContain('t(1); t(0);');
    expect(out).not.toContain('demo.a');
  });
  it('reports an unknown key, a text id and a foreign prefix in a key namespace', () => {
    vi.spyOn(lib, 'activeNamespaces').mockReturnValue([{ ns: 'demo', dir, roots: [] }]);
    const rel = path.relative(path.dirname(file), dir).split(path.sep).join('/');
    const msgs = (body: string) => {
      const errors: Error[] = [];
      loader.call({ resourcePath: file, addDependency: () => {}, emitError: (e: Error) => errors.push(e) }, `import { t } from '${rel}';\n${body}\n`);
      return errors.map((e) => e.message).join('\n');
    };
    expect(msgs("t('demo.a.nope');")).toMatch(/"demo\.a\.nope" is not in demo\/en-GB\.json/);
    expect(msgs("t('Colour');")).toMatch(/"Colour" is not a key/);
    expect(msgs("t('card.a.one');")).toMatch(/must start with "demo\."/);
  });
});

describe('en-US for a key namespace (D4)', () => {
  const cache = path.resolve('node_modules/.cache');
  fs.mkdirSync(cache, { recursive: true });
  const dir = fs.mkdtempSync(path.join(cache, 'i18n-usns-'));
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));
  afterEach(() => vi.restoreAllMocks());
  const runCheck = async () => {
    vi.spyOn(lib, 'extractAll').mockReturnValue({ ids: new Map(), ctxIds: new Map(), nsList: [{ ns: 'demo', dir, roots: [] }] });
    const { run } = await import('../tools/i18n-us.mjs');
    return run({ check: true }).find((r: { ns: string }) => r.ns === 'demo') as { ok: boolean };
  };
  it('expects en-US.json to hold the word-list text and the current English hash per key', async () => {
    fs.writeFileSync(path.join(dir, 'en-GB.json'), keys.canonicalJson('gb', new Map([[K, gbEntry('Background colour')]])));
    fs.writeFileSync(path.join(dir, 'en-US.json'), keys.canonicalJson('tr', new Map([[K, tr('Background color', 'Background colour')]])));
    expect((await runCheck()).ok).toBe(true);
    fs.writeFileSync(path.join(dir, 'en-US.json'), keys.canonicalJson('tr', new Map([[K, tr('Background color', 'Old English')]])));
    expect((await runCheck()).ok).toBe(false);
  });
});
