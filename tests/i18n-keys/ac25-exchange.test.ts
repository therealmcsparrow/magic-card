// tools/i18n-flat.mjs writes one flat ARB file per locale under i18n/flat/ (key, English, note, max length, ICU
// plural forms, source hash, stale flag); export then import of unchanged files gives byte-identical source files;
// renamed keys appear only as aliases; --check exits 1 when the export is stale; imported files are untrusted.
// Contract: src/contracts/i18n-keys.ts "Exchange files". Format: ARB
// (import reads values only and rebuilds every @key and x- value from en-GB).
//
// CLI assumed from the contract text: `node tools/i18n-flat.mjs export`, `... import`, `... --check`. The file name of
// a locale is not fixed by the contract; the tests find each file by its "@@locale".
import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { EXCHANGE_DIR, EXCHANGE_MAX_BYTES } from '../../src/contracts/i18n-keys';
import { cleanupProjects, importLine, keyedProject, NAMESPACES, Project, sourceHash, writeKeyed } from './harness';

afterAll(cleanupProjects);

const DIR = NAMESPACES.demo;
const OLD_COLOUR = 'Pick a colour';
const NEW_COLOUR = 'Pick a colour for the card';
const COUNT = '{n, plural, one {# item} other {# items}}';

function fixture(): Project {
  const p = keyedProject([
    { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 20, note: 'Heading of the demo panel.' },
    { key: 'demo.panel.count', text: COUNT, nl: '{n, plural, one {# stuk} other {# stuks}}', max: 30, note: 'Number of items in the list.', vars: { n: 'Number of items' } },
    { key: 'demo.panel.hi', text: 'Hi {name}', nl: 'Hoi {name}', max: 30, note: 'Greeting above the form.', vars: { name: 'Name of the person' } },
    // stale: English changed after the Dutch was confirmed
    { key: 'demo.panel.colour', text: NEW_COLOUR, nl: 'Kies een kleur', nlHash: sourceHash(OLD_COLOUR), max: 40, note: 'Label of the colour picker.' },
  ]);
  writeKeyed(p, 'other', [{ key: 'other.misc.note', text: 'A note', nl: 'Een notitie', max: 20, note: 'Label of the note field.' }]);
  p.write('src/other/misc.ts', importLine('other') + "export const n = t('other.misc.note');\n");
  p.writeJson('i18n/renames.json', [{ from: 'demo.panel.heading', to: 'demo.panel.title' }]);
  p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.colour', hash: sourceHash(NEW_COLOUR), reason: 'Added words, the Dutch text still fits' }]);
  expect(p.build().code).toBe(0);
  const c = p.check('--strict');
  expect(c.code, 'the fixture passes --strict: ' + c.all).toBe(0);
  return p;
}

interface Flat {
  file: string;
  raw: string;
  json: Record<string, any>;
}
function flatFiles(p: Project): Record<string, Flat> {
  const out: Record<string, Flat> = {};
  const dir = p.abs(EXCHANGE_DIR);
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    const raw = fs.readFileSync(`${dir}/${f}`, 'utf8');
    const json = JSON.parse(raw);
    out[json['@@locale']] = { file: `${EXCHANGE_DIR}/${f}`, raw, json };
  }
  return out;
}

/** Source files an import may write, and the ones it must not. */
const sources = (p: Project) => {
  const s = p.snapshot();
  for (const k of Object.keys(s)) if (k.startsWith(EXCHANGE_DIR) || k.endsWith('messages.gen.ts') || k.endsWith('keys.gen.ts')) delete s[k];
  return s;
};

const exported = (): Project => {
  const p = fixture();
  const r = p.flat('export');
  expect(r.code, r.all).toBe(0);
  return p;
};

const editFlat = (p: Project, locale: string, edit: (json: Record<string, any>) => void): void => {
  const f = flatFiles(p)[locale];
  edit(f.json);
  p.write(f.file, JSON.stringify(f.json, null, 2) + '\n');
};

describe('export', () => {
  it('writes one ARB file per locale under i18n/flat/, each with its "@@locale"', () => {
    const files = flatFiles(exported());
    expect(Object.keys(files).sort()).toEqual(['en-GB', 'en-US', 'nl']);
  });

  it('writes plain JSON: two-space indentation, LF, final newline, flat keys, every value a text, under the size cap', () => {
    for (const [locale, f] of Object.entries(flatFiles(exported()))) {
      expect(f.raw, locale).toBe(JSON.stringify(f.json, null, 2) + '\n');
      expect(f.raw, locale).not.toContain('\r');
      expect(Buffer.byteLength(f.raw)).toBeLessThan(EXCHANGE_MAX_BYTES);
      for (const [k, v] of Object.entries(f.json)) {
        if (k.startsWith('@') && k !== '@@locale') expect(typeof v, `${locale} ${k}`).toBe('object');
        else expect(typeof v, `${locale} ${k}`).toBe('string');
      }
    }
  });

  it('puts the card and the other namespaces together, one entry per key, the same keys in every locale', () => {
    const files = flatFiles(exported());
    const keysOf = (l: string) => Object.keys(files[l].json).filter((k) => !k.startsWith('@'));
    const want = ['demo.panel.colour', 'demo.panel.count', 'demo.panel.hi', 'demo.panel.title', 'other.misc.note'];
    for (const l of ['en-GB', 'en-US', 'nl']) expect(keysOf(l).sort(), l).toEqual(want);
  });

  it('holds the text of that locale (ICU plural branches included) as the value of the key', () => {
    const f = flatFiles(exported());
    expect(f['en-GB'].json['demo.panel.title']).toBe('Hello');
    expect(f['en-GB'].json['demo.panel.count']).toBe(COUNT);
    expect(f['nl'].json['demo.panel.count']).toBe('{n, plural, one {# stuk} other {# stuks}}');
    expect(f['nl'].json['demo.panel.title']).toBe('Hallo');
    expect(f['en-US'].json['demo.panel.colour']).toBe('Pick a color for the card');
  });

  it('describes each key: note, one line per argument and max in the description; max, hash, plural categories as x- values; no placeholders object', () => {
    const f = flatFiles(exported());
    for (const locale of ['en-GB', 'en-US', 'nl']) {
      const j = f[locale].json;
      expect(j['@demo.panel.title'].description, locale).toBe('Heading of the demo panel. Max 20 characters.');
      expect(j['@demo.panel.count'].description, locale).toBe('Number of items in the list. {n}: Number of items. Max 30 characters.');
      expect(j['@demo.panel.hi'].description, locale).toBe('Greeting above the form. {name}: Name of the person. Max 30 characters.');
      expect(j['@demo.panel.title']['x-max-length'], locale).toBe(20);
      expect(j['@demo.panel.title']['x-source-hash'], locale).toBe(sourceHash('Hello'));
      expect(Object.keys(j['@demo.panel.title']), locale).not.toContain('placeholders');
      expect([...j['@demo.panel.count']['x-plural']].sort(), locale).toEqual(['one', 'other']);
      expect(j['@demo.panel.count'].placeholders, locale).toBeUndefined();
      expect(j['@demo.panel.hi'].placeholders, locale).toBeUndefined();
      expect(Object.keys(j['@demo.panel.count']), locale).toEqual(['description', ...(locale === 'en-GB' ? [] : ['source_text']), 'x-max-length', 'x-source-hash', 'x-plural']);
      expect(j['@demo.panel.title']['x-plural'], `${locale} no plural`).toBeUndefined();
    }
  });

  it('gives translations the English as source_text and leaves it off the English file', () => {
    const f = flatFiles(exported());
    expect(f['en-GB'].json['@demo.panel.title'].source_text).toBeUndefined();
    expect(f['nl'].json['@demo.panel.title'].source_text).toBe('Hello');
    expect(f['en-US'].json['@demo.panel.title'].source_text).toBe('Hello');
  });

  it('leaves x-stale off a translation whose current English has a waiver', () => {
    const f = flatFiles(exported());
    expect(f['nl'].json['@demo.panel.colour']['x-stale']).not.toBe(true);
    expect(f['nl'].json['@demo.panel.colour']['x-source-hash']).toBe(sourceHash(NEW_COLOUR));
  });

  it('flags a waiver for an older English text as stale again', () => {
    const p = fixture();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.colour', hash: sourceHash(OLD_COLOUR), reason: 'Old revision' }]);
    expect(p.flat('export').code).toBe(0);
    expect(flatFiles(p)['nl'].json['@demo.panel.colour']['x-stale']).toBe(true);
  });

  it('flags only the stale translation with x-stale: true, never the English', () => {
    const p = fixture();
    p.writeJson('i18n/waivers.json', []);
    expect(p.flat('export').code).toBe(0);
    const f = flatFiles(p);
    expect(f['nl'].json['@demo.panel.colour']['x-stale']).toBe(true);
    for (const k of ['demo.panel.title', 'demo.panel.count', 'demo.panel.hi', 'other.misc.note']) expect(f['nl'].json[`@${k}`]['x-stale'], k).not.toBe(true);
    for (const k of Object.keys(f['en-GB'].json).filter((k) => k.startsWith('@') && k !== '@@locale')) expect(f['en-GB'].json[k]['x-stale'], k).toBeUndefined();
    // the hash is the hash of the current English, also for the stale entry
    expect(f['nl'].json['@demo.panel.colour']['x-source-hash']).toBe(sourceHash(NEW_COLOUR));
  });

  it('shows a key from renames.json only as an alias of its new key, never as an entry', () => {
    const f = flatFiles(exported());
    for (const l of ['en-GB', 'en-US', 'nl']) {
      expect(f[l].json['@demo.panel.title']['x-aliases'], l).toEqual(['demo.panel.heading']);
      expect(Object.keys(f[l].json), l).not.toContain('demo.panel.heading');
      expect(Object.keys(f[l].json), l).not.toContain('@demo.panel.heading');
    }
    expect(f['nl'].json['@demo.panel.hi']['x-aliases']).toBeUndefined();
  });

  it('is deterministic: a second export gives the same bytes', () => {
    const p = exported();
    const first = Object.fromEntries(Object.entries(flatFiles(p)).map(([l, f]) => [l, f.raw]));
    expect(p.flat('export').code).toBe(0);
    expect(Object.fromEntries(Object.entries(flatFiles(p)).map(([l, f]) => [l, f.raw]))).toEqual(first);
  });

  it('reads and writes no dist file', () => {
    const p = exported();
    p.flat('--check');
    expect(p.exists('dist')).toBe(false);
  });
});

describe('round trip', () => {
  it('leaves every source file byte-identical after export then import of unchanged files (stale stays stale)', () => {
    const p = exported();
    const before = sources(p);
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
  });

  it('writes a changed Dutch text back to nl.json and nothing else', () => {
    const p = exported();
    const before = sources(p);
    editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hallo daar'));
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    const after = sources(p);
    const changed = Object.keys(after).filter((k) => after[k] !== before[k]);
    expect(changed).toEqual([`${DIR}/nl.json`]);
    expect(p.json<Record<string, any>>(`${DIR}/nl.json`)['demo.panel.title'].text).toBe('Hallo daar');
  });

  it('accepts a plural that came back reformatted, as long as it is valid (checked by D6, not compared byte for byte)', () => {
    const p = exported();
    editFlat(p, 'nl', (j) => (j['demo.panel.count'] = '{n, plural, one { # stuk } other { # stuks }}'));
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    p.build();
    expect(p.check('--ci').code).toBe(0);
  });

  it('writes a changed American text back as an en-US exception keyed by the English, and generates it', () => {
    const p = exported();
    editFlat(p, 'en-US', (j) => (j['demo.panel.title'] = 'Howdy'));
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(p.json('tools/i18n/en-US-exceptions.json')).toEqual({ Hello: 'Howdy' });
    p.build();
    expect(p.json<Record<string, any>>(`${DIR}/en-US.json`)['demo.panel.title'].text).toBe('Howdy');
    expect(p.check('--ci').code).toBe(0);
  });

  it('writes no exception for an American text that equals what the word list makes', () => {
    const p = exported();
    editFlat(p, 'en-US', (j) => (j['demo.panel.colour'] = 'Pick a color for the card'));
    expect(p.flat('import').code).toBe(0);
    expect(p.json('tools/i18n/en-US-exceptions.json')).toEqual({});
  });

  it('never lets the English file change en-GB.json (the repository is the source of the English)', () => {
    const p = exported();
    const before = p.read(`${DIR}/en-GB.json`);
    editFlat(p, 'en-GB', (j) => (j['demo.panel.title'] = 'Changed in the tool'));
    p.flat('import');
    expect(p.read(`${DIR}/en-GB.json`)).toBe(before);
  });
});

describe('the @key and x- values of an imported file are not trusted', () => {
  it('rebuilds them from en-GB: edited descriptions, max, hash and stale flags change nothing, and the next export restores them', () => {
    const p = exported();
    const clean = flatFiles(p)['nl'].raw;
    const before = sources(p);
    editFlat(p, 'nl', (j) => {
      j['@demo.panel.title'].description = 'Hacked. Max 1 characters.';
      j['@demo.panel.title']['x-max-length'] = 1;
      j['@demo.panel.title']['x-source-hash'] = 'deadbeef';
      j['@demo.panel.colour']['x-stale'] = false;
      j['@demo.panel.hi']['x-aliases'] = ['demo.panel.title'];
    });
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
    expect(p.flat('export').code).toBe(0);
    expect(flatFiles(p)['nl'].raw).toBe(clean);
  });

  it('imports a file that has no @key blocks at all (a service that creates units without metadata)', () => {
    const p = exported();
    const before = sources(p);
    editFlat(p, 'nl', (j) => {
      for (const k of Object.keys(j)) if (k.startsWith('@') && k !== '@@locale') delete j[k];
    });
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
  });
});

describe('services rewrite the file', () => {
  it('imports the same values from a file whose @key objects carry stale x- values and a Weblate-style placeholders object', () => {
    const p = exported();
    const before = sources(p);
    editFlat(p, 'nl', (j) => {
      j['@demo.panel.hi'].placeholders = { $NAME$: { content: '{name}' } };
      j['@demo.panel.hi']['x-source-hash'] = '00000000';
      j['@demo.panel.hi']['x-stale'] = true;
      j['@demo.panel.count'].placeholders = 'not an object';
    });
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
  });

  it('accepts a plural with other spacing and branch order, writes it as it came, and the next export gives the same text back', () => {
    const p = exported();
    editFlat(p, 'nl', (j) => (j['demo.panel.count'] = '{n,plural,other{# stuks} one{# stuk}}'));
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(p.flat('export').code).toBe(0);
    expect(flatFiles(p)['nl'].json['demo.panel.count']).toBe('{n,plural,other{# stuks} one{# stuk}}');
    expect(flatFiles(p)['nl'].json['@demo.panel.count']['x-plural']).toEqual(['other', 'one']);
  });

  it('takes the locale from the file name when "@@locale" is missing, and keeps the repository text of a key that came back missing or empty', () => {
    const p = exported();
    const before = sources(p);
    editFlat(p, 'nl', (j) => {
      delete j['@@locale'];
      delete j['demo.panel.hi'];
      j['demo.panel.title'] = '';
    });
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
  });

  it('ignores "@@" names other than "@@locale"', () => {
    const p = exported();
    const before = sources(p);
    editFlat(p, 'nl', (j) => {
      j['@@last_modified'] = '2026-10-28T00:00:00Z';
      j['@@author'] = 'someone';
      j['@@x-note'] = { a: 1 };
    });
    const r = p.flat('import');
    expect(r.code, r.all).toBe(0);
    expect(sources(p)).toEqual(before);
  });
});

describe('import refuses untrusted input and writes nothing', () => {
  const raw = (p: Project, locale: string, edit: (text: string, json: Record<string, any>) => string) => {
    const f = flatFiles(p)[locale];
    p.write(f.file, edit(f.raw, f.json));
  };
  const cases: Array<[string, (p: Project) => void]> = [
    ['an unknown key', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.ghost'] = 'Boe'))],
    ['an @ name for __proto__', (p) => raw(p, 'nl', (t) => t.replace(/\n}\n$/, ',\n  "@__proto__": { "description": "x" }\n}\n'))],
    ['an @ name for constructor', (p) => editFlat(p, 'nl', (j) => (j['@constructor'] = { description: 'x' }))],
    ['an @@ name for prototype', (p) => raw(p, 'nl', (t) => t.replace(/\n}\n$/, ',\n  "@@prototype": "x"\n}\n'))],
    ['a wrong "@@locale"', (p) => editFlat(p, 'nl', (j) => (j['@@locale'] = 'de'))],
    ['a text whose arguments differ from the English', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.hi'] = 'Hoi {naam}'))],
    ['a text without the English arguments', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.hi'] = 'Hoi'))],
    ['a plural turned into a plain argument', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.count'] = '{n} stuks'))],
    ['a text longer than its maximum', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hallo daar, dit is veel te lang voor de kop'))],
    ['a key of a namespace that does not exist', (p) => editFlat(p, 'nl', (j) => (j['nowhere.panel.title'] = 'Boe'))],
    ['the key __proto__', (p) => raw(p, 'nl', (t) => t.replace(/\n}\n$/, ',\n  "__proto__": "polluted"\n}\n'))],
    ['the key constructor', (p) => editFlat(p, 'nl', (j) => (j.constructor = 'polluted'))],
    ['a key that does not match KEY_PATTERN', (p) => editFlat(p, 'nl', (j) => (j['Demo.Bad'] = 'Boe'))],
    ['a text with a pipe', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hallo | wereld'))],
    ['a text with a right-to-left override', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0x202E) + 'lo'))],
    ['a text with a bidi isolate', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0x2066) + 'lo'))],
    ['a text with a C1 control character', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0x0085) + 'lo'))],
    ['a text with a zero-width space', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0x200B) + 'lo'))],
    ['a text with a byte order mark', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0xFEFF) + 'lo'))],
    ['a text with a null character', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hal' + String.fromCodePoint(0x0000) + 'lo'))],
    ['a text with a newline', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hallo\nwereld'))],
    ['a plural without an other branch', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.count'] = '{n, plural, one {# stuk}}'))],
    ['a plural branch Dutch does not have', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.count'] = '{n, plural, one {# stuk} few {# stuks} other {# stuks}}'))],
    ['an unbalanced brace', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.hi'] = 'Hoi {name'))],
    ['a text that is not a string', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 42))],
    ['an object where a text belongs', (p) => editFlat(p, 'nl', (j) => (j['demo.panel.title'] = { text: 'Hallo' }))],
    ['a file over the size cap', (p) => editFlat(p, 'nl', (j) => (j['@demo.panel.title'].description = 'x'.repeat(EXCHANGE_MAX_BYTES + 1)))],
    ['a file that is not JSON', (p) => raw(p, 'nl', () => '{ not json')],
    ['a JSON array instead of an object', (p) => raw(p, 'nl', () => '["demo.panel.title"]\n')],
    ['an empty file', (p) => raw(p, 'nl', () => '')],
  ];

  it.each(cases)('refuses %s', (_why, tamper) => {
    const p = exported();
    expect(p.exists('tools/i18n-flat.mjs'), 'the exchange tool exists').toBe(true);
    tamper(p);
    const before = p.snapshot();
    const r = p.flat('import');
    expect(r.code, r.all).not.toBe(0);
    expect(r.all.trim(), 'the tool says why').not.toBe('');
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND|heap out of memory/);
    expect(p.snapshot()).toEqual(before);
    expect(({} as Record<string, unknown>).polluted, 'Object.prototype stays clean').toBeUndefined();
  });

  it('does not repeat the file bytes when the file is not valid JSON', () => {
    const p = exported();
    raw(p, 'nl', () => '{ "SECRETWORD": nope }');
    const r = p.flat('import');
    expect(r.code).not.toBe(0);
    expect(r.all).toContain('not valid JSON');
    expect(r.all).not.toContain('SECRETWORD');
  });

  it('refuses an import when the exchange folder is missing', () => {
    const p = fixture();
    const before = p.snapshot();
    const r = p.flat('import');
    expect(r.code).not.toBe(0);
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND/);
    expect(p.snapshot()).toEqual(before);
  });
});

describe('--check', () => {
  it('exits 0 for a fresh export and writes nothing', () => {
    const p = exported();
    const before = p.snapshot();
    const r = p.flat('--check');
    expect(r.code, r.all).toBe(0);
    expect(p.snapshot()).toEqual(before);
  });

  it('exits 1 when the English changed after the last export', () => {
    const p = exported();
    const gb = p.json<Record<string, any>>(`${DIR}/en-GB.json`);
    gb['demo.panel.title'].text = 'Hello again';
    p.writeJson(`${DIR}/en-GB.json`, gb);
    p.build();
    const before = p.snapshot();
    const r = p.flat('--check');
    expect(r.code).toBe(1);
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND/);
    expect(p.snapshot()).toEqual(before);
  });

  it('exits 1 when the Dutch changed after the last export', () => {
    const p = exported();
    const nl = p.json<Record<string, any>>(`${DIR}/nl.json`);
    nl['demo.panel.title'].text = 'Goedendag';
    p.writeJson(`${DIR}/nl.json`, nl);
    expect(p.flat('--check').code).toBe(1);
  });

  it('exits 1 when an exchange file was edited by hand', () => {
    const p = exported();
    editFlat(p, 'nl', (j) => (j['demo.panel.title'] = 'Hallo daar'));
    expect(p.flat('--check').code).toBe(1);
  });

  it('exits 1 when an exchange file is missing', () => {
    const p = exported();
    fs.rmSync(p.abs(flatFiles(p)['nl'].file));
    expect(p.flat('--check').code).toBe(1);
  });

  it('exits 1 when there is no export yet', () => {
    const r = fixture().flat('--check');
    expect(r.code).toBe(1);
    expect(r.all).not.toMatch(/Cannot find module|MODULE_NOT_FOUND/);
  });
});

describe('the Magic Card Utils namespace', () => {
  const withMcu = (): Project => {
    const p = fixture();
    const hash = sourceHash('Save');
    p.writeJson('mcu/i18n/en-GB.json', { 'mcu-panel.panel.save': { text: 'Save', note: 'Label of the save button.', max: 20 } });
    p.writeJson('mcu/i18n/en-US.json', { 'mcu-panel.panel.save': { text: 'Save', hash } });
    p.writeJson('mcu/i18n/nl.json', { 'mcu-panel.panel.save': { text: 'Opslaan', hash } });
    return p;
  };

  it('is exported with --mcu, imported back into that repository, and left out of a plain --check', () => {
    const p = withMcu();
    const mcu = p.abs('mcu');
    expect(p.flat('export', '--mcu', mcu).code).toBe(0);
    expect(flatFiles(p)['nl'].json['mcu-panel.panel.save']).toBe('Opslaan');
    expect(p.flat('--check', '--mcu', mcu).code).toBe(0);
    expect(p.flat('--check').code).toBe(0);
    editFlat(p, 'nl', (j) => (j['mcu-panel.panel.save'] = 'Bewaren'));
    const before = sources(p);
    const r = p.flat('import', '--mcu', mcu);
    expect(r.code, r.all).toBe(0);
    const after = sources(p);
    expect(Object.keys(after).filter((k) => after[k] !== before[k])).toEqual(['mcu/i18n/nl.json']);
    expect(p.json<Record<string, any>>('mcu/i18n/nl.json')['mcu-panel.panel.save']).toEqual({ text: 'Bewaren', hash: sourceHash('Save') });
  });

  it('refuses a key of that namespace when --mcu is not given, and refuses an export that would drop it', () => {
    const p = withMcu();
    expect(p.flat('export', '--mcu', p.abs('mcu')).code).toBe(0);
    const before = p.snapshot();
    const r = p.flat('import');
    expect(r.code).not.toBe(0);
    expect(r.all).toContain('--mcu');
    expect(r.all).toContain('mcu-panel.panel.save');
    expect(r.all, 'no advice to delete a key the repository does own').not.toMatch(/delete it in the service/);
    expect(p.flat('export').code).not.toBe(0);
    expect(p.snapshot()).toEqual(before);
  });

  it('refuses a Magic Card Utils key that --mcu does not know and says to delete it', () => {
    const p = withMcu();
    expect(p.flat('export', '--mcu', p.abs('mcu')).code).toBe(0);
    editFlat(p, 'nl', (j) => (j['mcu-panel.panel.ghost'] = 'Boe'));
    const before = p.snapshot();
    const r = p.flat('import', '--mcu', p.abs('mcu'));
    expect(r.code).not.toBe(0);
    expect(r.all).toContain('mcu-panel.panel.ghost');
    expect(p.snapshot()).toEqual(before);
  });
});

describe('the refusal names what is wrong', () => {
  it('names every unknown key so the localizer can delete it in the service', () => {
    const p = exported();
    editFlat(p, 'nl', (j) => {
      j['demo.panel.ghost'] = 'Boe';
      j['demo.panel.spook'] = 'Boe';
    });
    const r = p.flat('import');
    expect(r.code).not.toBe(0);
    expect(r.all).toContain('demo.panel.ghost');
    expect(r.all).toContain('demo.panel.spook');
  });
});
