// A key rename through tools/i18n-rename.mjs <from> <to> moves the en-GB, en-US and nl entries, their hashes
// and waivers, rewrites the literal at every call site, and appends a Rename to i18n/renames.json (history for the
// exchange files only; never read by src or webpack, never in dist). A rename onto an existing key is refused and
// writes nothing. Contract: src/contracts/i18n-keys.ts "Renames", "Error cases".
import { afterAll, describe, expect, it } from 'vitest';
import { cleanupProjects, importLine, keyedProject, NAMESPACES, Project, sourceHash, writeKeyed, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const DIR = NAMESPACES.demo;
const ODIR = NAMESPACES.other;
const NEW_COLOUR_EN = 'Pick a colour for the card';

const ENTRIES: KeyedEntry[] = [
  { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 40 },
  { key: 'demo.panel.title-long', text: 'Hello and welcome', nl: 'Hallo en welkom', max: 40 },
  // stale on purpose: the English changed after the Dutch was confirmed, a waiver covers the new English
  { key: 'demo.panel.colour', text: NEW_COLOUR_EN, nl: 'Kies een kleur', nlHash: sourceHash('Pick a colour'), max: 40 },
  { key: 'demo.panel.hi', text: 'Hi {name}', nl: 'Hoi {name}', max: 40, vars: { name: 'Name of the person' } },
];

const PANEL = `${importLine('demo', 't, tx, m')}export const a = t('demo.panel.title');
export const b = t('demo.panel.title-long');
export const c = t('demo.panel.colour');
export const d = t('demo.panel.hi', { name: 1 });
export const e = tx('demo.panel.hi', { name: 1 });
export const f = { label: m('demo.panel.title') };
`;
const SECOND = `${importLine('demo')}// the title again, in another file
export const again = t('demo.panel.title');
`;

function renameProject(): Project {
  const p = keyedProject(ENTRIES);
  p.write('src/demo/panel.ts', PANEL);
  p.write('src/demo/second.ts', SECOND);
  p.writeJson('i18n/renames.json', []);
  p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.colour', hash: sourceHash(NEW_COLOUR_EN), reason: 'Added words, the Dutch text still fits' }]);
  expect(p.build().code).toBe(0);
  { const c = p.check('--strict'); expect(c.code, 'the fixture itself must pass --strict: ' + c.all).toBe(0); }
  return p;
}

const canonical = (o: Record<string, unknown>) => JSON.stringify(Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a < b ? -1 : 1))), null, 2) + '\n';

describe('rename inside a namespace', () => {
  it('moves the entries of all three locales with their notes, max, vars and hashes', () => {
    const p = renameProject();
    const before = {
      gb: p.json<Record<string, any>>(`${DIR}/en-GB.json`),
      us: p.json<Record<string, any>>(`${DIR}/en-US.json`),
      nl: p.json<Record<string, any>>(`${DIR}/nl.json`),
    };
    const r = p.rename('demo.panel.colour', 'demo.panel.chooser');
    expect(r.code, r.all).toBe(0);
    for (const [file, was] of [['en-GB.json', before.gb], ['en-US.json', before.us], ['nl.json', before.nl]] as const) {
      const after = p.json<Record<string, any>>(`${DIR}/${file}`);
      expect(after['demo.panel.colour'], file).toBeUndefined();
      expect(after['demo.panel.chooser'], file).toEqual(was['demo.panel.colour']);
      // every other entry is untouched
      for (const k of Object.keys(was).filter((k) => k !== 'demo.panel.colour')) expect(after[k], `${file} ${k}`).toEqual(was[k]);
      // the file keeps the contract format: sorted, two-space JSON, LF, final newline
      expect(p.read(`${DIR}/${file}`), file).toBe(canonical(after));
    }
    // the old Dutch hash travels with the entry, so it is still stale and still covered
    expect(p.json<Record<string, any>>(`${DIR}/nl.json`)['demo.panel.chooser'].hash).toBe(sourceHash('Pick a colour'));
  });

  it('moves the waiver with the key and keeps --strict green', () => {
    const p = renameProject();
    expect(p.rename('demo.panel.colour', 'demo.panel.chooser').code).toBe(0);
    const waivers = p.json<Array<{ key: string; hash: string; reason: string }>>('i18n/waivers.json');
    expect(waivers).toEqual([{ key: 'demo.panel.chooser', hash: sourceHash(NEW_COLOUR_EN), reason: 'Added words, the Dutch text still fits' }]);
    p.write('src/demo/panel.ts', PANEL.replace(/demo\.panel\.colour/g, 'demo.panel.chooser'));
    expect(p.build().code).toBe(0);
    const r = p.check('--strict');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });

  it('rewrites the literal at every call site (t, tx, m, several files) and nothing else', () => {
    const p = renameProject();
    expect(p.rename('demo.panel.title', 'demo.panel.heading').code).toBe(0);
    // title-long shares a prefix with title and must stay as it is
    expect(p.read('src/demo/panel.ts')).toBe(PANEL.replace(/'demo\.panel\.title'/g, "'demo.panel.heading'"));
    expect(p.read('src/demo/second.ts')).toBe(SECOND.replace(/'demo\.panel\.title'/g, "'demo.panel.heading'"));
    const gb = p.json<Record<string, unknown>>(`${DIR}/en-GB.json`);
    expect(Object.keys(gb)).toContain('demo.panel.title-long');
    expect(Object.keys(gb)).toContain('demo.panel.heading');
    expect(Object.keys(gb)).not.toContain('demo.panel.title');
  });

  it('leaves the compiled tables byte-identical (a rename is not a text change)', () => {
    const p = renameProject();
    const before = p.read(`${DIR}/messages.gen.ts`);
    expect(p.rename('demo.panel.title', 'demo.panel.heading').code).toBe(0);
    expect(p.build().code).toBe(0);
    expect(p.read(`${DIR}/messages.gen.ts`)).toBe(before);
    expect(p.read(`${DIR}/messages.gen.ts`)).not.toContain('demo.panel');
  });

  it('appends one Rename per call to i18n/renames.json, in order', () => {
    const p = renameProject();
    expect(p.rename('demo.panel.title', 'demo.panel.heading').code).toBe(0);
    expect(p.json('i18n/renames.json')).toEqual([{ from: 'demo.panel.title', to: 'demo.panel.heading' }]);
    expect(p.rename('demo.panel.heading', 'demo.panel.main').code).toBe(0);
    expect(p.json('i18n/renames.json')).toEqual([
      { from: 'demo.panel.title', to: 'demo.panel.heading' },
      { from: 'demo.panel.heading', to: 'demo.panel.main' },
    ]);
  });

  it('passes the check after the rename', () => {
    const p = renameProject();
    expect(p.rename('demo.panel.hi', 'demo.panel.greeting').code).toBe(0);
    p.build();
    const r = p.check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
});

describe('rename to another namespace (a control moved to another screen)', () => {
  function twoNamespaces(): Project {
    const p = renameProject();
    writeKeyed(p, 'other', [{ key: 'other.misc.note', text: 'A note', nl: 'Een notitie', max: 40 }]);
    p.write('src/other/misc.ts', importLine('other') + "export const n = t('other.misc.note');\n");
    // a file that calls a moved key already imports the target namespace's function; the tool points the call at it
    p.write('src/demo/panel.ts', "import { t as tOther } from '../other/i18n';\n" + PANEL);
    p.build();
    return p;
  }

  it('moves the three entries, the hashes and the waiver into the other namespace folder, sorted', () => {
    const p = twoNamespaces();
    const was = {
      gb: p.json<Record<string, any>>(`${DIR}/en-GB.json`)['demo.panel.colour'],
      us: p.json<Record<string, any>>(`${DIR}/en-US.json`)['demo.panel.colour'],
      nl: p.json<Record<string, any>>(`${DIR}/nl.json`)['demo.panel.colour'],
    };
    const r = p.rename('demo.panel.colour', 'other.panel.colour');
    expect(r.code, r.all).toBe(0);
    for (const [file, entry] of [['en-GB.json', was.gb], ['en-US.json', was.us], ['nl.json', was.nl]] as const) {
      expect(p.json<Record<string, any>>(`${DIR}/${file}`)['demo.panel.colour'], `demo ${file}`).toBeUndefined();
      const moved = p.json<Record<string, any>>(`${ODIR}/${file}`);
      expect(moved['other.panel.colour'], `other ${file}`).toEqual(entry);
      expect(moved['other.misc.note'], `other ${file} keeps its own entry`).toBeDefined();
      expect(p.read(`${ODIR}/${file}`), file).toBe(canonical(moved));
    }
    expect(p.json<Array<{ key: string }>>('i18n/waivers.json').map((w) => w.key)).toEqual(['other.panel.colour']);
    expect(p.json('i18n/renames.json')).toEqual([{ from: 'demo.panel.colour', to: 'other.panel.colour' }]);
  });

  it('points the call sites at the target namespace and passes the check', () => {
    const p = twoNamespaces();
    expect(p.rename('demo.panel.colour', 'other.panel.colour').code).toBe(0);
    expect(p.read('src/demo/panel.ts')).toContain("export const c = tOther('other.panel.colour');");
    expect(p.build().code).toBe(0);
    const r = p.check('--ci');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
});

describe('refusals write nothing', () => {
  const refused: Array<[string, string, string]> = [
    ['onto an existing key', 'demo.panel.title', 'demo.panel.hi'],
    ['onto an existing key of another namespace', 'demo.panel.title', 'other.misc.note'],
    ['from a key that does not exist', 'demo.panel.nope', 'demo.panel.fresh'],
    ['to a key that does not match KEY_PATTERN (one segment)', 'demo.panel.title', 'demo.title'],
    ['to a key with an upper-case segment', 'demo.panel.title', 'demo.Panel.heading'],
    ['to a key of more than 96 characters', 'demo.panel.title', `demo.${'abcdefghij-'.repeat(9)}one.two`],
    ['to a key in a namespace that does not exist', 'demo.panel.title', 'nowhere.panel.title'],
    ['to the same key', 'demo.panel.title', 'demo.panel.title'],
  ];
  it.each(refused)('refuses a rename %s', (_why, from, to) => {
    const p = renameProject();
    writeKeyed(p, 'other', [{ key: 'other.misc.note', text: 'A note', nl: 'Een notitie', max: 40 }]);
    p.write('src/other/misc.ts', importLine('other') + "export const n = t('other.misc.note');\n");
    p.build();
    expect(p.exists('tools/i18n-rename.mjs'), 'the rename tool exists').toBe(true);
    const before = p.snapshot();
    const r = p.rename(from, to);
    expect(r.code, r.all).not.toBe(0);
    expect(r.all.trim(), 'the tool says why').not.toBe('');
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND/);
    expect(p.snapshot()).toEqual(before);
  });

  it('refuses without arguments and writes nothing', () => {
    const p = renameProject();
    expect(p.exists('tools/i18n-rename.mjs'), 'the rename tool exists').toBe(true);
    const before = p.snapshot();
    const r = p.run('tools/i18n-rename.mjs');
    expect(r.code).not.toBe(0);
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND/);
    expect(p.snapshot()).toEqual(before);
  });
});
