import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SHARE_KIT_CHUNK_CEILING } from '../src/contracts/share-kit';

const ROOT = join(__dirname, '..');
const CAPS = JSON.parse(readFileSync(join(ROOT, 'tools', 'size-caps.json'), 'utf8')) as {
  files: Record<string, { raw: number; ceiling: number }>;
  entry: { stages: { id: string; cap: number }[]; current_stage: string; br: { cap: number } };
};

/** Built dist to measure; set SIZE_DIST to a Linux release build (the Windows build is not authoritative). */
const DIST = process.env.SIZE_DIST;

describe('share-kit chunk size', () => {
  it('has its own cap entry within the contract ceiling', () => {
    const entry = CAPS.files['magic-card-share-kit.js'];
    expect(entry).toBeDefined();
    expect(entry.raw).toBeLessThanOrEqual(entry.ceiling);
    expect(entry.ceiling).toBeLessThanOrEqual(SHARE_KIT_CHUNK_CEILING);
    expect(entry.raw % 1024).toBe(0);
  });

  it('keeps the transfer chunk cap within its ceiling', () => {
    const entry = CAPS.files['magic-card-transfer.js'];
    expect(entry.raw).toBeLessThanOrEqual(entry.ceiling);
  });

  it('passes the caps file check with an argument array and no shell', () => {
    const out = execFileSync(process.execPath, [join(ROOT, 'tools', 'check-dist-size.mjs'), '--caps-only'], {
      encoding: 'utf8',
    });
    expect(out).not.toMatch(/FAIL/);
  });

  it.skipIf(!DIST || !existsSync(DIST ?? ''))('measures the built chunks within their caps', () => {
    const files = readdirSync(DIST as string).filter((f) => /^magic-card-.*\.js$/.test(f));
    const sizeOf = (name: string) => {
      const f = files.find((x) => x.replace(/\.[0-9a-f]{8}\.js$/, '.js') === name);
      expect(f, name).toBeDefined();
      return statSync(join(DIST as string, f as string)).size;
    };
    for (const name of ['magic-card-share-kit.js', 'magic-card-transfer.js', 'magic-card-editor.js', 'magic-card-theme-editor.js']) {
      expect(sizeOf(name), name).toBeLessThanOrEqual(CAPS.files[name].raw);
    }
  });
});
