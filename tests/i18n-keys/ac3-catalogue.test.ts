// One en-GB file per namespace; a key without a context note (place, max length, variables) fails the check;
// an nl or en-US text over max fails it (D8). Contract: src/contracts/i18n-keys.ts "Source files"; i18n.ts D8.
import { afterAll, describe, expect, it } from 'vitest';
import { cleanupProjects, keyedProject, NAMESPACES, Project, sourceHash, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const BASE: KeyedEntry[] = [
  { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 20 },
  { key: 'demo.panel.hi', text: 'Hi {name}', nl: 'Hoi {name}', max: 30, vars: { name: 'Name of the person' } },
];
const DIR = NAMESPACES.demo;

/** Built project; `mutate` edits the source catalogues before the build. */
function project(mutate?: (p: Project, gb: Record<string, any>, nl: Record<string, any>) => void): Project {
  const p = keyedProject(BASE);
  if (mutate) {
    const gb = p.json<Record<string, any>>(`${DIR}/en-GB.json`);
    const nl = p.json<Record<string, any>>(`${DIR}/nl.json`);
    mutate(p, gb, nl);
    p.writeJson(`${DIR}/en-GB.json`, gb);
    p.writeJson(`${DIR}/nl.json`, nl);
  }
  p.build();
  return p;
}

const fails = (p: Project, key: string) => {
  const r = p.check('--ci');
  expect(r.code, r.all).toBe(1);
  expect(r.all).toMatch(/D8/);
  expect(r.all).toContain(key);
};

describe('a complete catalogue passes', () => {
  it('passes the check with notes, max and vars', () => {
    const r = project().check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
  it('accepts a note of exactly NOTE_MIN_CHARS (12) characters', () => {
    const p = project((_p, gb) => (gb['demo.panel.title'].note = 'twelve chars'));
    expect('twelve chars'.length).toBe(12);
    expect(p.check('--ci').code).toBe(0);
  });
});

describe('context note (D8)', () => {
  it('fails when a key has no note', () => {
    fails(project((_p, gb) => delete gb['demo.panel.title'].note), 'demo.panel.title');
  });
  it('fails when the note is empty', () => {
    fails(project((_p, gb) => (gb['demo.panel.title'].note = '')), 'demo.panel.title');
  });
  it('fails when the note is shorter than NOTE_MIN_CHARS (11 characters)', () => {
    expect('eleven char'.length).toBe(11);
    fails(project((_p, gb) => (gb['demo.panel.title'].note = 'eleven char')), 'demo.panel.title');
  });
  it('fails when the note is only spaces', () => {
    fails(project((_p, gb) => (gb['demo.panel.title'].note = ' '.repeat(40))), 'demo.panel.title');
  });
});

describe('max length (D8)', () => {
  it('fails when a key has no max', () => {
    fails(project((_p, gb) => delete gb['demo.panel.title'].max), 'demo.panel.title');
  });
  it.each([
    ['zero', 0],
    ['negative', -5],
    ['a fraction', 12.5],
    ['text', '20'],
    ['null', null],
  ])('fails when max is %s', (_why, value) => {
    fails(project((_p, gb) => (gb['demo.panel.title'].max = value)), 'demo.panel.title');
  });
  it('fails when the en-GB text is longer than max', () => {
    fails(project((_p, gb) => (gb['demo.panel.title'].max = 4)), 'demo.panel.title');
  });
  it('passes when the en-GB text is exactly max long', () => {
    expect(project((_p, gb) => (gb['demo.panel.title'].max = 5)).check('--ci').code).toBe(0);
  });
  it('fails when the nl text is longer than max', () => {
    fails(project((_p, _gb, nl) => (nl['demo.panel.title'].text = 'Hallo daar, wat fijn dat je er bent')), 'demo.panel.title');
  });
  it('fails when the en-US text is longer than max (an en-US exception, keyed by the English text)', () => {
    const p = keyedProject(BASE);
    p.writeJson('tools/i18n/en-US-exceptions.json', { Hello: 'Hello there, my good friend' });
    p.build();
    fails(p, 'demo.panel.title');
  });
  it('counts a plural by its longest branch with the arguments as written, not by the whole ICU string', () => {
    const plural = { key: 'demo.panel.count', text: '{n, plural, one {# item} other {# items}}', nl: '{n, plural, one {# stuk} other {# stuks}}', vars: { n: 'Number of items' } };
    // the longest rendering is "# items" / "# stuks": 7 characters
    const fits = keyedProject([{ ...plural, max: 7 }]);
    fits.build();
    expect(fits.check('--ci').code, fits.check('--ci').all).toBe(0);
    const tooLong = keyedProject([{ ...plural, max: 6 }]);
    tooLong.build();
    fails(tooLong, 'demo.panel.count');
  });
});

describe('variables (D8)', () => {
  it('fails when a text with an argument has no vars', () => {
    fails(project((_p, gb) => delete gb['demo.panel.hi'].vars), 'demo.panel.hi');
  });
  it('fails when vars names an argument the message does not have', () => {
    fails(project((_p, gb) => (gb['demo.panel.hi'].vars = { name: 'Name of the person', extra: 'Not in the text' })), 'demo.panel.hi');
  });
  it('fails when vars misses an argument of the message', () => {
    fails(project((_p, gb) => (gb['demo.panel.hi'].vars = { other: 'Wrong name' })), 'demo.panel.hi');
  });
  it('fails when a text without arguments has vars', () => {
    fails(project((_p, gb) => (gb['demo.panel.title'].vars = { name: 'Not in the text' })), 'demo.panel.title');
  });
  it('fails when an argument description is empty', () => {
    fails(project((_p, gb) => (gb['demo.panel.hi'].vars = { name: '' })), 'demo.panel.hi');
  });
  it('fails when the nl text uses other argument names than en-GB', () => {
    const p = project((_p, _gb, nl) => (nl['demo.panel.hi'].text = 'Hoi {naam}'));
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toContain('demo.panel.hi');
  });
});

describe('file format (D8): sorted by key, two-space JSON, LF, final newline', () => {
  const entries = () => ({
    gb: (rev = false) => {
      const gb = JSON.parse(JSON.stringify({ 'demo.panel.hi': { text: 'Hi {name}', note: 'Greeting in the demo panel.', max: 30, vars: { name: 'Name of the person' } }, 'demo.panel.title': { text: 'Hello', note: 'Heading of the demo panel.', max: 20 } }));
      return rev ? Object.fromEntries(Object.entries(gb).reverse()) : gb;
    },
  });
  const write = (p: Project, text: string) => p.write(`${DIR}/en-GB.json`, text);
  const fresh = () => {
    const p = keyedProject(BASE);
    p.build();
    return p;
  };

  it('fails when the keys are not sorted', () => {
    const p = fresh();
    write(p, JSON.stringify(entries().gb(true), null, 2) + '\n');
    p.build();
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D8/);
  });
  it('fails when the file uses four-space indentation', () => {
    const p = fresh();
    write(p, JSON.stringify(entries().gb(), null, 4) + '\n');
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D8/);
  });
  it('fails when the file uses CRLF line endings', () => {
    const p = fresh();
    write(p, (JSON.stringify(entries().gb(), null, 2) + '\n').replace(/\n/g, '\r\n'));
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D8/);
  });
  it('fails when the final newline is missing', () => {
    const p = fresh();
    write(p, JSON.stringify(entries().gb(), null, 2));
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D8/);
  });
  it('fails when nl.json is not sorted', () => {
    const p = fresh();
    const nl = p.json<Record<string, unknown>>(`${DIR}/nl.json`);
    p.write(`${DIR}/nl.json`, JSON.stringify(Object.fromEntries(Object.entries(nl).reverse()), null, 2) + '\n');
    const r = p.check('--ci');
    expect(r.code).toBe(1);
  });
});

describe('completeness of the locale files', () => {
  it('fails when a key has no nl entry', () => {
    const p = project((_p, _gb, nl) => delete nl['demo.panel.hi']);
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toContain('demo.panel.hi');
  });
  it('fails when nl.json holds a key en-GB.json does not have', () => {
    const p = project((_p, _gb, nl) => (nl['demo.panel.gone'] = { text: 'Weg', hash: sourceHash('Gone') }));
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toContain('demo.panel.gone');
  });
  it('fails when an nl entry is empty', () => {
    const p = project((_p, _gb, nl) => (nl['demo.panel.title'].text = ''));
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toContain('demo.panel.title');
  });
});

describe('namespaces without an en-GB.json', () => {
  it('need no note while no call uses them', () => {
    const p = new Project();
    p.build();
    expect(p.check('--ci').code).toBe(0);
  });
  it('fail the check for a key call, which has no catalogue to name it', () => {
    const p = new Project();
    p.write('src/other/panel.ts', "import { t } from './i18n';\nexport const a = t('other.panel.save');\n");
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D1 .*other.panel.save/);
  });
});
