// Comment limits for tracked .ts outside tests/: a file header of at most 3 lines, no comment block over 6 lines.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ES module without types
import { commentBlocks, commentViolations } from './helpers/ts-comment-scan.mjs';

const root = path.resolve(__dirname, '..');
const tracked = execFileSync('git', ['ls-files', '-z', '--', '*.ts'], { cwd: root, maxBuffer: 1 << 26 })
  .toString().split('\0').filter((f) => f && !f.startsWith('tests/') && !f.endsWith('.d.ts'));

describe('scanner', () => {
  it('counts a header, a long block and ignores magic comments', () => {
    const src = ['// a', '// b', '// c', '// d', 'import x from "y";', '', '/**', ' * 1', ' * 2', ' * 3', ' * 4', ' * 5', ' */', 'const a = import(/* webpackChunkName: "z" */ "z");', '// eslint-disable-next-line foo', 'const b = 1;'].join('\n');
    const v = commentViolations(src, 'f.ts');
    expect(v.map((x: { header: boolean; lines: number }) => [x.header, x.lines])).toEqual([[true, 4], [false, 7]]);
    expect(commentBlocks('// ok\nconst a = 1;\n')[0].header).toBe(true);
  });
});

describe('comment limits in tracked .ts files', () => {
  it('finds the files to check', () => {
    expect(tracked.length).toBeGreaterThan(500);
    expect(tracked.some((f) => f.startsWith('src/'))).toBe(true);
  });

  it('has no header over 3 lines and no comment block over 6 lines', () => {
    const bad = tracked.flatMap((f) => commentViolations(readFileSync(path.join(root, f), 'utf8'), f));
    const report = bad.map((b: { file: string; start: number; end: number; lines: number; header: boolean; max: number }) => `${b.file}:${b.start}-${b.end} ${b.header ? 'header' : 'block'} ${b.lines} lines (max ${b.max})`);
    expect(report, `${report.length} violations`).toEqual([]);
  });

  it('keeps the one-line JSDoc on each LAZY_SHARED_CHUNK_CEILINGS entry', () => {
    const src = readFileSync(path.join(root, 'src/contracts/lazy-module.ts'), 'utf8');
    const body = src.split('export const LAZY_SHARED_CHUNK_CEILINGS')[1].split('};')[0];
    for (const name of ['path-core', 'history', 'shape-path']) {
      const re = new RegExp(String.raw`/\*\* [^\n]*\.ts[^\n]*\*/\s*\n\s*['"]?${name}['"]?:`);
      expect(body).toMatch(re);
    }
  });
});
