// Contract suite: src/contracts/i18n-keys.ts (1.2.0) and src/contracts/i18n.ts (2.0.0), constants and
// shapes only. Covers the plain facts of the key rules, the catalogues, the stale check and the exchange files.
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import * as keys from '../../src/contracts/i18n-keys';
import * as i18n from '../../src/contracts/i18n';
import { REPO, sourceHash } from './harness';

const read = (rel: string) => fs.readFileSync(path.join(REPO, rel), 'utf8');

describe('i18n-keys contract, constants', () => {
  it('has only type imports, so the tools can transpile and run the file alone', () => {
    const code = read('src/contracts/i18n-keys.ts').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/^\s*import\b(?!\s+type\b)/m);
    expect(code).not.toMatch(/\brequire\(/);
  });

  it('holds the documented numbers and paths', () => {
    expect(keys.I18N_KEYS_CONTRACT_VERSION).toBe('1.2.0');
    expect(keys.KEY_MAX_CHARS).toBe(96);
    expect(keys.SOURCE_HASH_CHARS).toBe(8);
    expect(keys.NOTE_MIN_CHARS).toBe(12);
    expect(keys.EXCHANGE_FORMAT).toBe('arb');
    expect(keys.EXCHANGE_DIR).toBe('i18n/flat');
    expect(keys.EXCHANGE_MAX_BYTES).toBe(4_194_304);
    expect(keys.WAIVERS_FILE).toBe('i18n/waivers.json');
    expect(keys.RENAMES_FILE).toBe('i18n/renames.json');
    expect('LEGACY_COUNT_FILE' in keys).toBe(false);
  });

  it.each([
    'card-editor.design.background.label',
    'card.a.b',
    'card.a.b.c.d.e',
    'svg-editor.step2.label',
    'card.1a.b',
    'mcu-panel.templates.delete-confirm',
    'card.design-tab.bg-colour',
  ])('accepts the key %s', (key) => {
    expect(keys.KEY_PATTERN.test(key)).toBe(true);
  });

  it.each([
    ['one segment after the namespace', 'card.title'],
    ['namespace only', 'card'],
    ['six segments', 'card.a.b.c.d.e.f'],
    ['upper-case namespace', 'Card.a.b'],
    ['upper-case segment', 'card.Title.b'],
    ['underscore', 'card.a_b.c'],
    ['empty segment', 'card.a..b'],
    ['segment starting with a dash', 'card.-a.b'],
    ['segment ending with a dash', 'card.a-.b'],
    ['double dash', 'card.a--b.c'],
    ['space', 'card.a b.c'],
    ['trailing newline', 'card.a.b\n'],
    ['namespace starting with a digit', '1card.a.b'],
    ['British text', 'Background colour'],
  ])('rejects a key with %s', (_why, key) => {
    expect(keys.KEY_PATTERN.test(key)).toBe(false);
  });
});

describe('source hash reference', () => {
  it('is the first 8 hex characters of SHA-256 over the UTF-8 bytes', () => {
    expect(sourceHash('Hello')).toBe('185f8db3');
    expect(sourceHash('Hello')).toMatch(/^[0-9a-f]{8}$/);
  });
  it('hashes the NFC form, so a decomposed accent gives the same hash', () => {
    expect(sourceHash('Café')).toBe(sourceHash('Café'));
  });
});

describe('i18n contract', () => {
  it('is at 2.1.0 (keys replace text ids)', () => {
    expect(i18n.I18N_CONTRACT_VERSION).toBe('2.1.0');
  });
  it('lists the namespaces of tools/i18n/config.json plus mcu-panel, nothing else', () => {
    const cfg = JSON.parse(read('tools/i18n/config.json')).namespaces as Record<string, unknown>;
    expect(Object.keys(i18n.I18N_MODULES).filter((n) => n !== 'mcu-panel').sort()).toEqual(Object.keys(cfg).sort());
    expect(Object.keys(i18n.I18N_MODULES)).toContain('mcu-panel');
  });
  it('keeps three locales in the table order en-GB, en-US, nl', () => {
    expect(i18n.LOCALES).toEqual(['en-GB', 'en-US', 'nl']);
    expect(i18n.TABLE_SEPARATOR).toBe('|');
  });
});

describe('repository wiring of the keys work', () => {
  it('package.json has typecheck (tsc --noEmit) and a pretypecheck that regenerates the key types', () => {
    const scripts = JSON.parse(read('package.json')).scripts as Record<string, string>;
    expect(scripts.typecheck).toBe('tsc --noEmit');
    expect(scripts.pretypecheck).toBe('npm run i18n');
  });
  it('git-ignores the generated key types beside the generated tables', () => {
    const ignore = read('.gitignore').split(/\r?\n/);
    expect(ignore).toContain('keys.gen.ts');
    expect(ignore).toContain('messages.gen.ts');
  });
  it('ships i18n/waivers.json and i18n/renames.json as JSON arrays', () => {
    expect(Array.isArray(JSON.parse(read(keys.WAIVERS_FILE)))).toBe(true);
    expect(Array.isArray(JSON.parse(read(keys.RENAMES_FILE)))).toBe(true);
  });
  it('lets no src file, webpack rule or loader read i18n/renames.json', () => {
    const hits: string[] = [];
    const scan = (file: string) => {
      if (/renames\.json|RENAMES_FILE/.test(fs.readFileSync(file, 'utf8'))) hits.push(path.relative(REPO, file).replace(/\\/g, '/'));
    };
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(ts|js|mjs|cjs)$/.test(e.name)) scan(p);
      }
    };
    walk(path.join(REPO, 'src'));
    // the contract names the file in its text and constants; the loader and the webpack config must not
    scan(path.join(REPO, 'webpack.config.js'));
    scan(path.join(REPO, 'tools/i18n-loader.cjs'));
    expect(hits.filter((h) => h !== 'src/contracts/i18n-keys.ts')).toEqual([]);
  });
});
