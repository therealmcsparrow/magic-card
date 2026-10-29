// Every call is t('<ns>.<place>.<item>') with a literal dotted key whose prefix is its namespace; a text-id call and a
// tc() call fail check-i18n and the build (D1); the loader rewrites keys to table indices.
// Contract: src/contracts/i18n-keys.ts "Keys", "Text ids", "Error cases"; src/contracts/i18n.ts D1.
import { afterAll, describe, expect, it } from 'vitest';
import { callerSource, cleanupProjects, importLine, keyedProject, Project, writeKeyed, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const ENTRIES: KeyedEntry[] = [
  { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 20 },
  { key: 'demo.panel.colour', text: 'Pick a colour', nl: 'Kies een kleur', max: 30 },
  { key: 'demo.panel.count', text: '{n, plural, one {# item} other {# items}}', nl: '{n, plural, one {# item} other {# items}}', max: 30, vars: { n: 'Number of items' } },
];

function built(entries = ENTRIES, calls?: string[]): Project {
  const p = keyedProject(entries, calls);
  const b = p.build();
  expect(b.all).not.toMatch(/Error|FAIL/);
  return p;
}

describe('keyed namespace passes', () => {
  it('builds and passes check-i18n --ci, with a key and its literal in the call site', () => {
    const p = built();
    const r = p.check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });

  it('ignores a leftover tools/i18n/legacy-count.json', () => {
    const p = built();
    p.writeJson('tools/i18n/legacy-count.json', { demo: 5, other: 0 });
    const r = p.check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
});

describe('key rules (D1)', () => {
  const cases: Array<[string, string]> = [
    ['a template string with a substitution', 'const part = "title";\nexport const x = t(`demo.panel.${part}`);\n'],
    ['a concatenation', "export const x = t('demo.panel.' + 'title');\n"],
    ['the prefix of another namespace', "export const x = t('other.panel.title');\n"],
    ['a key that is not in en-GB.json', "export const x = t('demo.panel.missing');\n"],
    ['a key of more than 96 characters', `export const x = t('demo.${'abcdefghij-'.repeat(8)}one.two');\n`],
  ];
  it.each(cases)('fails the check for %s', (_why, body) => {
    const p = built();
    p.write('src/demo/bad.ts', importLine('demo') + body);
    p.build();
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1/);
    expect(r.all).toContain('bad.ts');
  });

  it.each([
    ['one segment after the namespace', 'demo.title'],
    ['an upper-case segment', 'demo.Panel.title'],
    ['British text', 'Background colour'],
  ])('fails the check for a text-id call (%s) (D1)', (_why, id) => {
    const p = built();
    p.write('src/demo/bad.ts', importLine('demo') + `export const x = t('${id}');\n`);
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1 .*is not a key/);
  });

  it('fails the check for tc(), which has no key form', () => {
    const p = built();
    p.write('src/demo/bad.ts', importLine('demo', 'tc') + "export const x = tc('verb', 'Clear');\n");
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1 .*tc\(\) is removed/);
  });
});

describe('data literals', () => {
  it('lets t() render a value that an m() mark holds (the rendering path of data literals), marks being keys too', () => {
    const p = built();
    p.write('src/demo/data.ts', importLine('demo', 't, m') + "const item = { label: m('demo.panel.title') };\nexport const x = t(item.label);\n");
    expect(p.build().code).toBe(0);
    const r = p.check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
  it('fails an m() mark whose key is not in en-GB.json', () => {
    const p = built();
    p.write('src/demo/data.ts', importLine('demo', 'm') + "export const x = m('demo.panel.nope');\n");
    p.build();
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1/);
  });
});

describe('text ids are gone', () => {
  it('fails the check and the build for a text-id call in a namespace that has no en-GB.json', () => {
    const p = new Project();
    p.write('src/other/panel.ts', callerSource('other', ['Save']));
    expect(p.build().code).toBe(1);
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1 .*"Save" is not a key/);
  });
  it('fails the check for a text-id call whatever a count file says', () => {
    const p = built();
    p.write('src/demo/legacy.ts', importLine('demo') + "export const x = t('Hello');\n");
    p.writeJson('tools/i18n/legacy-count.json', { demo: 1, other: 0 });
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1 /);
  });
  it('fails the loader for a text id, so no text id reaches a bundle', () => {
    const p = built();
    const out = p.loader('src/demo/panel.ts', importLine('demo') + "export const x = t('Hello');\n");
    expect(out.errors.join('\n')).toMatch(/is not a key/);
  });
});

describe('loader (tools/i18n-loader.cjs)', () => {
  const load = (p: Project, rel: string, source: string) => p.loader(rel, source);

  it('rewrites a key to its table index and leaves no key text in the output', () => {
    const p = built();
    const tables = p.tables('demo')[0];
    const src = importLine('demo') + "export const a = t('demo.panel.title');\nexport const b = t('demo.panel.count', { n: 2 });\n";
    const { out, errors } = load(p, 'src/demo/panel.ts', src);
    expect(errors).toEqual([]);
    expect(out).toContain(`t(${tables.indexOf('Hello')})`);
    expect(out).toContain(`t(${tables.indexOf('{n, plural, one {# item} other {# items}}')}, { n: 2 })`);
    expect(out).not.toContain('demo.panel');
  });

  it('reports a key that is not in en-GB.json as a build error naming the key', () => {
    const p = built();
    const { errors } = load(p, 'src/demo/panel.ts', importLine('demo') + "export const a = t('demo.panel.nope');\n");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('demo.panel.nope');
  });

  it('reports a non-literal key as a build error', () => {
    const p = built();
    const { errors } = load(p, 'src/demo/panel.ts', importLine('demo') + "export const a = t('demo.panel.' + 'title');\n");
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('per-namespace setup', () => {
  it('writeKeyed keeps the fixture honest: en-GB.json is the only place that holds English next to the key', () => {
    const p = new Project();
    writeKeyed(p, 'demo', ENTRIES);
    const gb = p.json<Record<string, { text: string }>>('src/demo/i18n/en-GB.json');
    expect(Object.keys(gb)).toEqual([...Object.keys(gb)].sort());
    expect(gb['demo.panel.title'].text).toBe('Hello');
  });
});
