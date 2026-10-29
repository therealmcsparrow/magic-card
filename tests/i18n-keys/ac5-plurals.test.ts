// An ICU plural message is validated at build time and rendered at run time through Intl.PluralRules, with no
// ICU library in dist; nl and en one/other render correctly (Chromium 85: tests/i18n-keys/browser/chromium85.mjs,
// run below when the portable build is installed; Safari 16.4 is not covered).
// Contract: src/contracts/i18n-keys.ts "Source files" (message syntax); src/contracts/i18n.ts "Message syntax", D6.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { i18nFor, setI18nLocale } from '../../src/i18n/runtime';
import { cleanupProjects, keyedProject, Project, REPO, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const COUNT = '{n, plural, =0 {No items} one {# item} other {# items}}';
const COUNT_NL = '{n, plural, =0 {Geen items} one {# item} other {# items}}';

/** A project whose only entry is `text` (en-GB) and `nl`; `max` is generous, vars are derived from `args`. */
function project(text: string, nl: string = text, args: string[] = ['n']): Project {
  const vars = Object.fromEntries(args.map((a) => [a, `The ${a} of the demo`]));
  const entry: KeyedEntry = { key: 'demo.panel.count', text, nl, max: 200, ...(args.length ? { vars } : {}) };
  const p = keyedProject([entry]);
  p.build();
  return p;
}

const checked = (p: Project) => p.check('--ci');

describe('valid ICU messages build and pass', () => {
  it.each([
    ['plural with =0, one and other', COUNT, COUNT_NL],
    ['plural with one and other', '{n, plural, one {# point} other {# points}}', '{n, plural, one {# punt} other {# punten}}'],
    ['select with other', '{kind, select, line {A line} other {A shape}}', '{kind, select, line {Een lijn} other {Een vorm}}'],
    ['a plural with an argument in a branch', '{n, plural, one {{name} has # item} other {{name} has # items}}', '{n, plural, one {{name} heeft # item} other {{name} heeft # items}}'],
    ['an apostrophe inside a word', "Don't {verb}", 'Niet {verb}'],
  ])('accepts %s', (_why, gb, nl) => {
    const args = [...gb.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]).filter((a, i, all) => all.indexOf(a) === i);
    const r = checked(project(gb, nl, args));
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
});

describe('message syntax is validated at build time (D6)', () => {
  const bad: Array<[string, string, string?]> = [
    ['a plural without an other branch', '{n, plural, one {# item}}'],
    ['a select without an other branch', '{kind, select, line {A line}}', '{kind, select, line {Een lijn}}'],
    ['a plural inside a plural branch', '{n, plural, one {{m, plural, one {# a} other {# b}}} other {# items}}'],
    ['a message nested deeper than three brace levels', '{a, select, x {{b, select, y {{n, plural, one {# c} other {# d}}} other {e}}} other {f}}'],
    ['an apostrophe before an opening brace', "It is '{n}' items"],
    ['an apostrophe before a closing brace', "Items '}' here"],
    ['an apostrophe before a hash in a plural', "{n, plural, one {'# item} other {# items}}"],
    ['an unbalanced brace', 'Hello {name'],
    ['a stray closing brace', 'Hello }'],
    ['a pipe, which separates the table entries', 'Left | right'],
    ['a newline', 'Line one\nLine two'],
    ['a plural branch the locale does not have (few)', '{n, plural, one {# item} few {# items} other {# items}}'],
    ['a plural branch the locale does not have (zero)', '{n, plural, zero {none} one {# item} other {# items}}'],
    ['an unknown plural keyword', '{n, plural, one {# item} several {# items} other {# items}}'],
  ];
  it.each(bad)('fails the check for %s (en-GB)', (_why, text) => {
    const args = [...text.matchAll(/\{(\w+)[,}]/g)].map((m) => m[1]).filter((a, i, all) => all.indexOf(a) === i);
    const r = checked(project(text, text, args));
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D6|D8/);
  });

  it('fails when the nl text breaks the syntax although en-GB is fine', () => {
    const r = checked(project(COUNT, '{n, plural, =0 {Geen} one {# item}}'));
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D6/);
  });

  it('fails when nl has a plural branch Dutch does not have (few)', () => {
    const r = checked(project(COUNT, '{n, plural, one {# item} few {# items} other {# items}}'));
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D6/);
  });

  it('fails when nl turns a plural argument into another name', () => {
    const r = checked(project(COUNT, '{aantal, plural, one {# item} other {# items}}'));
    expect(r.code).toBe(1);
    expect(r.all).toContain('demo.panel.count');
  });
});

describe('the compiled table keeps the ICU string; no ICU library is built in', () => {
  it('writes the plural message into the three tables as one entry of ICU text', () => {
    const p = project(COUNT, COUNT_NL);
    const [gb, us, nl] = p.tables('demo');
    expect(gb).toContain(COUNT);
    expect(nl).toContain(COUNT_NL);
    expect(us.length).toBe(gb.length);
  });

  it('adds no ICU library to package.json dependencies or to the built files in dist/', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO, 'package.json'), 'utf8')) as Record<string, Record<string, string>>;
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps.filter((d) => /messageformat|formatjs|intl-|i18next|globalize|fluent|polyglot/i.test(d))).toEqual([]);
    const dist = path.join(REPO, 'dist');
    const files = fs.existsSync(dist) ? fs.readdirSync(dist).filter((f) => f.endsWith('.js')) : [];
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const code = fs.readFileSync(path.join(dist, f), 'utf8');
      expect(code, f).not.toMatch(/intl-messageformat|@formatjs|messageformat-parser|MessageFormat\(/);
    }
  });
});

describe('rendering on Intl.PluralRules (the shipped runtime, fixture tables)', () => {
  let t: (id: number, args?: Record<string, string | number>) => string;
  let index = 0;
  beforeEach(() => {
    const p = project(COUNT, COUNT_NL);
    const [gb, us, nl] = p.tables('demo');
    index = gb.indexOf(COUNT);
    // tables as the runtime gets them: three '|' joined strings
    t = i18nFor('card', [gb.join('|'), us.join('|'), nl.join('|')] as never).t as typeof t;
  });
  const render = (lang: string, n: number) => {
    setI18nLocale({ language: lang, locale: { language: lang } });
    return t(index, { n });
  };

  it.each([
    [0, 'No items'],
    [1, '1 item'],
    [2, '2 items'],
    [21, '21 items'],
  ])('en-GB renders %i as "%s"', (n, text) => {
    expect(render('en-gb', n)).toBe(text);
  });
  it.each([
    [0, 'Geen items'],
    [1, '1 item'],
    [2, '2 items'],
    [21, '21 items'],
  ])('nl renders %i as "%s"', (n, text) => {
    expect(render('nl', n)).toBe(text);
  });
  it('en-US shows the same plural forms as en-GB', () => {
    expect(render('en-us', 1)).toBe('1 item');
    expect(render('en-us', 5)).toBe('5 items');
  });
});

describe('Chromium 85', () => {
  it('renders the plural messages in nl and en on the portable Chromium 85 build (85.0.4183.0)', () => {
    const r = spawnSync(process.execPath, [path.join(REPO, 'tests/i18n-keys/browser/chromium85.mjs'), '--plurals'], { encoding: 'utf8', timeout: 90_000 });
    expect(r.stdout + r.stderr).toContain('HeadlessChrome/85.');
    expect(r.stdout + r.stderr).toContain('PASS plural messages render on Chromium 85');
    expect(r.status).toBe(0);
  });
});
