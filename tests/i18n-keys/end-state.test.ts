// End state of the keys run on the real tree (AC1, AC2, AC3, AC4, AC7, AC9, AC25, AC26). Written first, so most of
// these fail until the migration tasks land; each test names the task that turns it green. They read the repository,
// the sibling Magic Card Utils checkout and dist/, and run the read-only checks; they write nothing.
//   T7   CI                      T9-T17 namespace migrations   T18 mcu-panel keys    T22 i18n 2.0.0
//   T23  MCU re-export           T24 exchange files            T39 final dist
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { I18N_CONTRACT_VERSION } from '../../src/contracts/i18n';
import { EXCHANGE_DIR, KEY_PATTERN, NOTE_MIN_CHARS } from '../../src/contracts/i18n-keys';
import { REPO, sourceHash } from './harness';

const read = (rel: string) => fs.readFileSync(path.join(REPO, rel), 'utf8');
const json = <T = any>(rel: string): T => JSON.parse(read(rel));
const MCU = process.env.MCU_REPO ? path.resolve(process.env.MCU_REPO) : path.resolve(REPO, '../magic-card-utils');
const MCU_WWW = path.join(MCU, 'custom_components/magic_card_utils/www');
const namespaces = (): Array<[string, string]> => Object.entries(json('tools/i18n/config.json').namespaces as Record<string, { dir: string }>).map(([ns, c]) => [ns, c.dir]);
const run = (args: string[], cwd = REPO) => {
  const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', timeout: 180_000 });
  return { code: r.status ?? -1, all: `${r.stdout}\n${r.stderr}` };
};

describe('AC1 end state: literal dotted keys everywhere, text-id path gone', () => {
  it('[T17 T22] has a legacy count of 0 in every namespace', () => {
    const counts = json<Record<string, number>>('tools/i18n/legacy-count.json');
    expect(Object.fromEntries(Object.entries(counts).filter(([, n]) => n !== 0))).toEqual({});
  });
  it('[T9-T17] gives every card namespace an en-GB.json', () => {
    const missing = namespaces().filter(([, dir]) => !fs.existsSync(path.join(REPO, dir, 'en-GB.json'))).map(([ns]) => ns);
    expect(missing).toEqual([]);
  });
  it('[T22] is i18n contract 2.0.0, with no tc() and no text-id path left in the runtime', () => {
    expect(I18N_CONTRACT_VERSION).toBe('2.0.0');
    expect(read('src/i18n/runtime.ts')).not.toMatch(/\btc\b/);
  });
  it('[T22] has no tc() call left in src/', () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.ts') && !p.includes(`${path.sep}contracts${path.sep}`) && /\btc\(/.test(fs.readFileSync(p, 'utf8'))) hits.push(path.relative(REPO, p));
      }
    };
    walk(path.join(REPO, 'src'));
    expect(hits).toEqual([]);
  });
  it('[T9-T22] passes check-i18n --ci --strict on the whole tree (D1 to D10, no stale, no waiver left unexplained)', () => {
    const r = run(['tools/check-i18n.mjs', '--ci', '--strict']);
    expect(r.all).toContain('0 errors');
    expect(r.code).toBe(0);
  });
  it('[T7] runs the key check and the typecheck in the CI workflow', () => {
    const yml = read('.github/workflows/validate.yml');
    expect(yml).toMatch(/check-i18n(\.mjs)?\s+--ci/);
    expect(yml).toMatch(/npm run typecheck|tsc --noEmit/);
  });
});

describe('AC2 end state: the tree typechecks against the generated key types', () => {
  it('[T9-T22] passes tsc --noEmit', () => {
    const r = run(['node_modules/typescript/bin/tsc', '--noEmit']);
    expect(r.all.trim()).toBe('');
    expect(r.code).toBe(0);
  });
});

describe('AC3 AC9 end state: every key has a note, a max and an English dev preview', () => {
  it('[T9-T17] has en-GB.json entries with a note of NOTE_MIN_CHARS or more and a positive integer max in every namespace', () => {
    const bad: string[] = [];
    let seen = 0;
    for (const [ns, dir] of namespaces()) {
      const f = path.join(REPO, dir, 'en-GB.json');
      if (!fs.existsSync(f)) continue;
      for (const [key, e] of Object.entries(JSON.parse(fs.readFileSync(f, 'utf8')) as Record<string, any>)) {
        seen++;
        if (!KEY_PATTERN.test(key) || !key.startsWith(ns + '.') || typeof e.note !== 'string' || e.note.trim().length < NOTE_MIN_CHARS || !Number.isInteger(e.max) || e.max <= 0) bad.push(`${ns}: ${key}`);
      }
    }
    expect(seen).toBeGreaterThan(5000);
    expect(bad).toEqual([]);
  });
  it('[T9-T17] has a generated keys.gen.ts per namespace with the English of every key as its doc comment', () => {
    let seen = 0;
    for (const [ns, dir] of namespaces()) {
      const gb = path.join(REPO, dir, 'en-GB.json');
      expect(fs.existsSync(gb), `${ns} en-GB.json`).toBe(true);
      const types = read(`${dir}/keys.gen.ts`);
      for (const [key, e] of Object.entries(JSON.parse(fs.readFileSync(gb, 'utf8')) as Record<string, { text: string }>)) {
        seen++;
        expect(types, `${ns} ${key}`).toContain(`"${key}"`);
        expect(types, `${ns} ${key}`).toContain(`/** ${e.text.replace(/\*\//g, '*\\/')} */`);
      }
    }
    expect(seen).toBeGreaterThan(5000);
  });
  it('[T22] resolves keys in tests through tools/i18n/test-msg.ts and the vitest plugin', () => {
    expect(fs.existsSync(path.join(REPO, 'tools/i18n/test-msg.ts'))).toBe(true);
    expect(fs.existsSync(path.join(REPO, 'tools/i18n/vite-plugin.mjs'))).toBe(true);
    expect(read('vitest.config.mts')).toMatch(/vite-plugin/);
  });
});

describe('AC4 end state: no translation is stale on the tree', () => {
  it('[T9-T17] has the current English hash in every en-US and nl entry, or a waiver for it', () => {
    const waivers = new Set(json<Array<{ key: string; hash: string }>>('i18n/waivers.json').map((w) => `${w.key}:${w.hash}`));
    const stale: string[] = [];
    let seen = 0;
    for (const [ns, dir] of namespaces()) {
      if (!fs.existsSync(path.join(REPO, dir, 'en-GB.json'))) continue;
      const gb = json<Record<string, { text: string }>>(`${dir}/en-GB.json`);
      for (const file of ['en-US.json', 'nl.json']) {
        for (const [key, e] of Object.entries(json<Record<string, { hash: string }>>(`${dir}/${file}`))) {
          seen++;
          const want = sourceHash(gb[key]?.text ?? '');
          if (e.hash !== want && !waivers.has(`${key}:${want}`)) stale.push(`${ns} ${file} ${key}`);
        }
      }
    }
    expect(seen).toBeGreaterThan(10000);
    expect(stale).toEqual([]);
  });
});

describe('AC7 end state: no key reaches dist', () => {
  it('[T9-T39] holds no key string in any file of dist/', () => {
    const keys: string[] = [];
    for (const [, dir] of namespaces()) {
      const f = path.join(REPO, dir, 'en-GB.json');
      if (fs.existsSync(f)) keys.push(...Object.keys(JSON.parse(fs.readFileSync(f, 'utf8'))));
    }
    expect(keys.length, 'migrated keys to look for').toBeGreaterThan(5000);
    const dist = path.join(REPO, 'dist');
    const files = fs.readdirSync(dist).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    const found: string[] = [];
    for (const f of files) {
      const code = fs.readFileSync(path.join(dist, f), 'utf8');
      for (const k of keys) if (code.includes(k)) found.push(`${f}: ${k}`);
    }
    expect(found.slice(0, 20)).toEqual([]);
  });
});

describe('AC25 end state: exchange files of the card and Magic Card Utils', () => {
  it('[T24] has an ARB file per locale in i18n/flat/ and a fresh --check', () => {
    const dir = path.join(REPO, EXCHANGE_DIR);
    expect(fs.existsSync(dir)).toBe(true);
    const locales = fs.readdirSync(dir).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))['@@locale']);
    expect(locales.sort()).toEqual(['en-GB', 'en-US', 'nl']);
    const r = run(['tools/i18n-flat.mjs', '--check']);
    expect(r.code, r.all).toBe(0);
  });
  it('[T24] carries the mcu-panel keys beside the card keys', () => {
    const dir = path.join(REPO, EXCHANGE_DIR);
    const nl = fs.readdirSync(dir).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).find((j) => j['@@locale'] === 'nl');
    const keys = Object.keys(nl).filter((k) => !k.startsWith('@'));
    expect(keys.some((k) => k.startsWith('mcu-panel.'))).toBe(true);
    expect(keys.some((k) => k.startsWith('card.'))).toBe(true);
  });
});

describe('AC26 end state: Magic Card Utils on keys, matching the card runtime', () => {
  it('has the Magic Card Utils checkout next to this repository (or in MCU_REPO)', () => {
    expect(fs.existsSync(MCU_WWW), `${MCU_WWW} (set MCU_REPO to the checkout)`).toBe(true);
  });
  it('[guard] records in VENDORED.md the SHA-256 of mc-i18n.js and mc-i18n-panel.js as they are on disk', () => {
    const doc = fs.readFileSync(path.join(MCU_WWW, 'VENDORED.md'), 'utf8');
    for (const f of ['mc-i18n.js', 'mc-i18n-panel.js']) {
      const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(MCU_WWW, f))).digest('hex');
      expect(doc, f).toContain(sha);
    }
  });
  it('[T18] has i18n/en-GB.json with mcu-panel keys, notes and max, and nl.json entries with confirmed hashes', () => {
    const gb = JSON.parse(fs.readFileSync(path.join(MCU, 'i18n/en-GB.json'), 'utf8')) as Record<string, { text: string; note: string; max: number }>;
    const nl = JSON.parse(fs.readFileSync(path.join(MCU, 'i18n/nl.json'), 'utf8')) as Record<string, { text: string; hash: string }>;
    const keys = Object.keys(gb);
    expect(keys.length).toBeGreaterThan(50);
    for (const k of keys) {
      expect(KEY_PATTERN.test(k) && k.startsWith('mcu-panel.'), k).toBe(true);
      expect(gb[k].note.trim().length, k).toBeGreaterThanOrEqual(NOTE_MIN_CHARS);
      expect(Number.isInteger(gb[k].max) && gb[k].max > 0, k).toBe(true);
      expect(nl[k]?.hash, k).toBe(sourceHash(gb[k].text));
    }
    expect(Object.keys(nl).sort()).toEqual([...keys].sort());
  });
  it('[T18] calls tr() with literal mcu-panel keys only, no British text', () => {
    const src = fs.readFileSync(path.join(MCU_WWW, 'magic_card_utils_panel.js'), 'utf8');
    const calls = [...src.matchAll(/\b(?:tr|trx)\(\s*(['"`])([^'"`]*)\1/g)].map((m) => m[2]);
    expect(calls.length).toBeGreaterThan(50);
    expect(calls.filter((c) => !KEY_PATTERN.test(c) || !c.startsWith('mcu-panel.'))).toEqual([]);
  });
  it('[T23] exports t, tx and locale already bound from mc-i18n-panel.js, with the key map inside and no British text id', () => {
    const src = fs.readFileSync(path.join(MCU_WWW, 'mc-i18n-panel.js'), 'utf8');
    expect(src).toMatch(/export\s*\{[^}]*\bt\b[^}]*\}|export\s+(const|function)\s+t\b/);
    expect(src).toMatch(/\btx\b/);
    expect(src).toMatch(/\blocale\b/);
    expect(src).toContain('mcu-panel.');
  });
  it('[T23] has generated files the export tool finds fresh (node tools/i18n-export.mjs <www> --mcu <repo> --check)', () => {
    const r = run(['tools/i18n-export.mjs', MCU_WWW, '--mcu', MCU, '--check']);
    expect(r.code, r.all).toBe(0);
  });
});
