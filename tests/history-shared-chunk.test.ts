// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LAZY_SHARED_CHUNK_CEILINGS,
  LAZY_SHARED_CHUNK_FILES,
} from '../src/contracts/lazy-module';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('history shared chunk (lazy-module 1.9.0 and later)', () => {
  it('the contract names the chunk, its file and its ceiling', () => {
    expect(LAZY_SHARED_CHUNK_FILES.history).toBe('magic-card-history.js');
    expect(LAZY_SHARED_CHUNK_CEILINGS.history).toBe(4096);
  });

  it('the contract comment on the ceiling names the one module (the svg-sinks checker reads it)', () => {
    expect(read('src/contracts/lazy-module.ts')).toMatch(/\/\*\* src\/services\/history-cache\.ts only\. \*\/\s*history: 4_096/);
  });

  it('webpack gives the module its own async cache group', () => {
    const w = read('webpack.config.js');
    expect(w).toMatch(/history:\s*\{\s*test:\s*\/\[\\\\\/\]src\[\\\\\/\]services\[\\\\\/\]history-cache\\\.ts\$\/,\s*name:\s*'history',\s*chunks:\s*'async',\s*enforce:\s*true\s*\}/);
  });

  it('the entry reaches history-cache from nowhere: not value-background.ts, not graphs-module.ts', () => {
    expect(read('src/utils/value-background.ts')).not.toMatch(/history-cache/);
    expect(read('src/modules/content/graphs-module.ts')).not.toMatch(/history-cache/);
  });

  it('the sparkline maths live in the decor-only file and are the ones mc-value-bg uses', async () => {
    const spark = await import('../src/card/value-bg-sparkline');
    expect(typeof spark.sparklinePath).toBe('function');
    expect(typeof spark.sparklineHistory).toBe('function');
    expect(read('src/utils/value-background.ts')).not.toMatch(/sparkline(Path|History)/);
    expect(read('src/card/mc-value-bg.ts')).toMatch(/from '\.\/value-bg-sparkline'/);
  });

  it('only decor and modules-extra files import the cache', () => {
    const importers = ['src/card/mc-value-bg.ts', 'src/card/value-bg-sparkline.ts', 'src/modules/content/graphs-view.ts'];
    for (const f of importers) expect(read(f), f).toMatch(/history-cache/);
  });
});
