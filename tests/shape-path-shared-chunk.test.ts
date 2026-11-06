import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  LAZY_MODULE_CONTRACT,
  LAZY_MODULE_CONTRACT_REVISION,
  LAZY_SHARED_CHUNK_CEILINGS,
  LAZY_SHARED_CHUNK_FILES,
} from '../src/contracts/lazy-module';
import { shapePath } from '../src/utils/shape-path';
import { useCustomBuilder } from '../src/utils/shape-custom-loader';
import type { CustomShapeChunk } from '../src/contracts/custom-shape';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

describe('shape-path shared chunk (lazy-module 1.10.0)', () => {
  it('the contract names the chunk, its file and its ceiling', () => {
    expect(LAZY_MODULE_CONTRACT).toBe('1.11.0');
    expect(LAZY_MODULE_CONTRACT_REVISION).toBe(25);
    expect(LAZY_SHARED_CHUNK_FILES['shape-path']).toBe('magic-card-shape-path.js');
    expect(LAZY_SHARED_CHUNK_CEILINGS['shape-path']).toBe(20_480);
    expect(read('src/contracts/lazy-module.ts')).toMatch(/\/\*\* src\/utils\/shape-path\.ts only\. \*\/\s*'shape-path': 20_480/);
  });

  it('webpack gives the module its own async cache group', () => {
    expect(read('webpack.config.js')).toMatch(/'shape-path': \{ test: [^\n]*shape-path[^\n]*, name: 'shape-path', chunks: 'async', enforce: true \}/);
  });

  it('the loader (entry) does not import shape-path; shape-path reads the builder from the loader', () => {
    expect(read('src/utils/shape-custom-loader.ts')).not.toMatch(/from '\.\/shape-path'/);
    expect(read('src/utils/shape-path.ts')).toMatch(/from '\.\/shape-custom-loader'/);
    expect(read('src/utils/shape-path.ts')).not.toMatch(/export function useCustomBuilder/);
  });

  it('the ring stroke maths are in the decor-only file', async () => {
    const mod = await import('../src/card/ring-stroke');
    expect(typeof mod.ringStroke).toBe('function');
    expect(typeof mod.ringTimerTick).toBe('function');
    expect(typeof mod.ringInset).toBe('function');
    const ring = read('src/utils/ring.ts');
    expect(ring).not.toMatch(/export function (ringStroke|ringTimerTick|ringInset)/);
    expect(read('src/card/mc-ring.ts')).toMatch(/from '\.\/ring-stroke'/);
  });

  it('outlines memoised before a builder arrives are dropped when it arrives or changes', () => {
    useCustomBuilder(undefined);
    expect(shapePath('custom', 100, 50, { corner: 4 })).toBeUndefined();
    const build = ((w: number) => ({ start: { x: 0, y: 0 }, segs: [{ to: { x: w, y: 0 } }], inset: { top: 1, right: 1, bottom: 1, left: 1 } })) as unknown as CustomShapeChunk['buildCustom'];
    useCustomBuilder(build);
    const first = shapePath('custom', 100, 50, { corner: 4 });
    expect(first?.d).toMatch(/^M/);
    const other = ((w: number) => ({ start: { x: 0, y: 0 }, segs: [{ to: { x: w / 2, y: 0 } }], inset: { top: 2, right: 2, bottom: 2, left: 2 } })) as unknown as CustomShapeChunk['buildCustom'];
    useCustomBuilder(other);
    expect(shapePath('custom', 100, 50, { corner: 4 })?.inset.top).toBe(2);
    useCustomBuilder(undefined);
    expect(shapePath('custom', 100, 50, { corner: 4 })).toBeUndefined();
  });
});
