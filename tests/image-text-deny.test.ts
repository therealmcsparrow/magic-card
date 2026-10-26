import { describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { refusedWord } from '../src/image-editor/text';

/*
 * Words that Magic Card Utils refuses anywhere in an image, with and without a tab, line break or carriage return
 * inside them. The card and the server must give the same answer for every line. With MCU_TEXT_DENY_OUT set to a file
 * path the list is written there as JSON; the server's tests read the same list.
 */
const CASES: Array<{ text: string; word?: string }> = [
  { text: 'javascript:alert(1)', word: 'javascript:' },
  { text: 'JavaScript:alert(1)', word: 'javascript:' },
  { text: 'java\tscript:x', word: 'javascript:' },
  { text: 'java\nscript:x', word: 'javascript:' },
  { text: 'java\rscript:x', word: 'javascript:' },
  { text: 'java\r\nscript:x', word: 'javascript:' },
  { text: 'vbscript:x', word: 'vbscript:' },
  { text: 'vb\tscript:x', word: 'vbscript:' },
  { text: 'x @import url(a)', word: '@import' },
  { text: '@\timport', word: '@import' },
  { text: 'EXPRESSION(1)', word: 'expression(' },
  { text: 'expr\nession(1)', word: 'expression(' },
  { text: 'java script:x' },
  { text: 'javascript' },
  { text: 'java-script:' },
  { text: 'expression (1)' },
  { text: 'an import of goods' },
  { text: 'Kitchen' },
];

describe('refused words: card and server agree', () => {
  for (const c of CASES) {
    it(`${JSON.stringify(c.text)} -> ${c.word ?? 'allowed'}`, () => {
      expect(refusedWord(c.text)).toBe(c.word);
    });
  }

  it('writes the list for the server tests', () => {
    const file = process.env.MCU_TEXT_DENY_OUT;
    if (!file) return;
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(CASES, null, 1) + '\n');
  });
});
