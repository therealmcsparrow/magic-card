import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { scanSource, editorFiles, scanFiles } from '../tools/rtl-scan.mjs';

const sheet = (rules: string) => 'const s = css`\n' + rules + '\n`;';
const hits = (rules: string) => scanSource(sheet(rules)).length;

describe('rtl-scan accepted forms', () => {
  it.each([
    ['left', 'right: 6px;', 'inset-inline: auto 6px;'],
    ['margin', 'margin-left: 4px;', 'margin-inline: 4px 0;'],
    ['padding', 'padding-right: 4px;', 'padding-inline: 0 4px;'],
    ['border', 'border-left: 1px solid red;', 'border-inline: 1px solid red;'],
    ['border width', 'border-left: 1px solid red;', 'border-inline-width: 1px 0;'],
    ['border style', 'border-left: 1px solid red;', 'border-inline-style: solid;'],
    ['border colour', 'border-left: 1px solid red;', 'border-inline-color: red;'],
  ])('%s passes with the both-sides declaration after it', (_n, phys, logical) => {
    expect(hits(`.a { ${phys} ${logical} }`)).toBe(0);
  });

  it.each([
    ['inset-inline-start', 'left: 0;', 'inset-inline-start: 0;'],
    ['inset-inline-end', 'right: 6px;', 'inset-inline-end: 6px;'],
    ['margin-inline-start', 'margin-left: 8px;', 'margin-inline-start: 8px;'],
    ['padding-inline-end', 'padding-right: 8px;', 'padding-inline-end: 8px;'],
    ['border-inline-start', 'border-left: 1px solid red;', 'border-inline-start: 1px solid red;'],
    ['border-inline-end-width', 'border-right-width: 1px;', 'border-inline-end-width: 1px;'],
  ])('a %s longhand does not answer the physical side', (_n, phys, longhand) => {
    expect(hits(`.a { ${phys} ${longhand} }`)).toBe(1);
  });

  it('a both-sides declaration before the physical one does not count', () => {
    expect(hits('.a { margin-inline: 4px 0; margin-left: 4px; }')).toBe(1);
  });

  it('a mark ends a declaration as physical', () => {
    expect(hits('.a { left: 50%; /* physical */ }')).toBe(0);
  });

  it('text-align needs a later start or end', () => {
    expect(hits('.a { text-align: right; }')).toBe(1);
    expect(hits('.a { text-align: right; text-align: end; }')).toBe(0);
  });

  it('border radius is outside the rule', () => {
    expect(hits('.a { border-top-left-radius: 4px; border-left-radius: 2px; }')).toBe(0);
  });
});

describe('rtl-scan default list', () => {
  const files = editorFiles().map((f: string) => f.replaceAll(path.sep, '/'));
  it('covers the editor folders and the editor css sheets', () => {
    for (const part of ['src/ui-kit/', 'src/editor/', 'src/anim-studio/', 'src/theme-editor/', 'src/transfer/', 'src/css/editor-css.ts'])
      expect(files.some((f: string) => f.includes(part)), part).toBe(true);
  });
  it('leaves the card sheets out', () => {
    expect(files.some((f: string) => f.includes('src/css/css.ts') || f.includes('src/svg-image/'))).toBe(false);
  });
  it('is clean', () => {
    expect(scanFiles(files)).toEqual([]);
  });
});
