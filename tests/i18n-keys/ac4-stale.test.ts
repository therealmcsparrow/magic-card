// AC4: an English change on a key with nl / en-US entries fails the release check as stale (source hash per
// entry); the only way out besides confirming is an i18n/waivers.json entry (key + hash + reason) for a typo or
// punctuation change; the UI keeps showing the old translation. Contract: src/contracts/i18n-keys.ts
// "Source hash and stale translations"; i18n.ts D4, D9.
import { afterAll, describe, expect, it } from 'vitest';
import { cleanupProjects, keyedProject, NAMESPACES, Project, sourceHash, type KeyedEntry } from './harness';

afterAll(cleanupProjects);

const DIR = NAMESPACES.demo;
const BASE: KeyedEntry[] = [
  { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 40 },
  { key: 'demo.panel.colour', text: 'Pick a colour', nl: 'Kies een kleur', max: 40 },
];

function built(entries = BASE): Project {
  const p = keyedProject(entries);
  p.writeJson('i18n/waivers.json', []);
  p.writeJson('i18n/renames.json', []);
  expect(p.build().code).toBe(0);
  return p;
}

/** English of a key changed after the translation was confirmed: the nl hash is now old. */
function staleProject(): { p: Project; oldHash: string; newHash: string } {
  const p = built();
  const gb = p.json<Record<string, any>>(`${DIR}/en-GB.json`);
  gb['demo.panel.title'].text = 'Hello there';
  p.writeJson(`${DIR}/en-GB.json`, gb);
  expect(p.build().code).toBe(0);
  return { p, oldHash: sourceHash('Hello'), newHash: sourceHash('Hello there') };
}

describe('AC4 source hash in the catalogues', () => {
  it('stores the hash of its English in every en-US entry (generated) and every confirmed nl entry', () => {
    const p = built();
    const us = p.json<Record<string, { text: string; hash: string }>>(`${DIR}/en-US.json`);
    for (const e of BASE) expect(us[e.key].hash).toBe(sourceHash(e.text));
    expect(us['demo.panel.colour'].text).toBe('Pick a color');
    expect(Object.keys(us)).toEqual([...Object.keys(us)].sort());
    const nl = p.json<Record<string, { text: string; hash: string }>>(`${DIR}/nl.json`);
    for (const e of BASE) expect(nl[e.key].hash).toBe(sourceHash(e.text));
  });

  it('regenerates en-US with the new hash when the English changes, without touching nl', () => {
    const { p, newHash, oldHash } = staleProject();
    const us = p.json<Record<string, { hash: string }>>(`${DIR}/en-US.json`);
    expect(us['demo.panel.title'].hash).toBe(newHash);
    expect(p.json<Record<string, { hash: string }>>(`${DIR}/nl.json`)['demo.panel.title'].hash).toBe(oldHash);
  });

  it('hashes the NFC form: an English text typed with a combining accent does not make nl stale', () => {
    const p = keyedProject([{ key: 'demo.panel.title', text: 'Café', nl: 'Café', max: 40, nlHash: sourceHash('Café') }]);
    p.writeJson('i18n/waivers.json', []);
    p.build();
    const r = p.check('--strict');
    expect(r.all).not.toMatch(/D9/);
    expect(sourceHash('Café')).toBe(sourceHash('Café'));
  });
});

describe('AC4 stale blocks the release check (D9)', () => {
  it('fails check-i18n --strict, naming the key, when the nl hash is not the hash of the current English', () => {
    const { p } = staleProject();
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
    expect(r.all).toContain('demo.panel.title');
    expect(r.all).not.toContain('demo.panel.colour');
  });

  it('does not fail the everyday check (CI on a pull request), so work in progress is not blocked', () => {
    const { p } = staleProject();
    const r = p.check('--ci');
    expect(r.all).not.toMatch(/FAIL D9|::error::D9/);
    expect(r.code).toBe(0);
  });

  it('passes --strict once the translation is confirmed (hash rewritten) and no waiver is left', () => {
    const { p, newHash } = staleProject();
    const nl = p.json<Record<string, any>>(`${DIR}/nl.json`);
    nl['demo.panel.title'] = { text: 'Hallo daar', hash: newHash };
    p.writeJson(`${DIR}/nl.json`, nl);
    p.build();
    const r = p.check('--strict');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });

  it('fails --strict when an nl entry has a malformed hash', () => {
    const p = built();
    const nl = p.json<Record<string, any>>(`${DIR}/nl.json`);
    nl['demo.panel.title'].hash = 'xyz';
    p.writeJson(`${DIR}/nl.json`, nl);
    expect(p.check('--strict').code).toBe(1);
  });
});

describe('AC4 the old translation stays on screen while stale', () => {
  it('ships the stored nl text of a stale key in the compiled table, so users see the old translation', () => {
    const { p } = staleProject();
    const [gb, , nl] = p.tables('demo');
    const i = gb.indexOf('Hello there');
    expect(i).toBeGreaterThanOrEqual(0);
    expect(nl[i]).toBe('Hallo');
  });
});

describe('AC4 waivers (i18n/waivers.json)', () => {
  it('lets a waiver for the key and the current hash, with a reason, pass --strict', () => {
    const { p, newHash } = staleProject();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.title', hash: newHash, reason: 'Added a word, meaning unchanged for the Dutch text' }]);
    const r = p.check('--strict');
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });

  it('fails a waiver that holds the old hash', () => {
    const { p, oldHash } = staleProject();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.title', hash: oldHash, reason: 'Typo' }]);
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
  });

  it('fails a waiver for a key that does not exist', () => {
    const p = built();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.nope', hash: sourceHash('Hello'), reason: 'Typo' }]);
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
    expect(r.all).toContain('demo.panel.nope');
  });

  it.each([
    ['empty', ''],
    ['only spaces', '   '],
  ])('fails a waiver whose reason is %s', (_why, reason) => {
    const { p, newHash } = staleProject();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.title', hash: newHash, reason }]);
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
  });

  it('does not let a waiver for one key cover another key', () => {
    const { p, newHash } = staleProject();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.colour', hash: newHash, reason: 'Typo' }]);
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
  });

  it('stops covering a key when its English changes again (the waiver is for one revision)', () => {
    const { p, newHash } = staleProject();
    p.writeJson('i18n/waivers.json', [{ key: 'demo.panel.title', hash: newHash, reason: 'Typo' }]);
    const gb = p.json<Record<string, any>>(`${DIR}/en-GB.json`);
    gb['demo.panel.title'].text = 'Hello again';
    p.writeJson(`${DIR}/en-GB.json`, gb);
    p.build();
    const r = p.check('--strict');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D9/);
  });
});

describe('AC4 en-US stays generated (D4)', () => {
  it('fails when en-US.json was edited by hand', () => {
    const p = built();
    const us = p.json<Record<string, any>>(`${DIR}/en-US.json`);
    us['demo.panel.colour'].text = 'Pick a hue';
    p.writeJson(`${DIR}/en-US.json`, us);
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D4/);
  });

  it('keeps a reviewed exception while its English is unchanged', () => {
    const p = keyedProject(BASE);
    p.writeJson('tools/i18n/en-US-exceptions.json', { 'Pick a colour': 'Choose a color' });
    p.writeJson('i18n/waivers.json', []);
    p.build();
    expect(p.json<Record<string, any>>(`${DIR}/en-US.json`)['demo.panel.colour'].text).toBe('Choose a color');
    expect(p.check('--ci').code).toBe(0);
  });

  it('orphans an exception when its English is edited, and the check fails (the exception is keyed by the English text)', () => {
    const p = keyedProject(BASE);
    p.writeJson('tools/i18n/en-US-exceptions.json', { 'Pick a colour': 'Choose a color' });
    p.writeJson('i18n/waivers.json', []);
    p.build();
    const gb = p.json<Record<string, any>>(`${DIR}/en-GB.json`);
    gb['demo.panel.colour'].text = 'Choose a colour';
    p.writeJson(`${DIR}/en-GB.json`, gb);
    p.build();
    const r = p.check('--ci');
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/D4/);
    expect(r.all).toContain('Pick a colour');
  });
});
