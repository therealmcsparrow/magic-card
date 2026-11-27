// Theme editor: a save or delete refused because themes/<name>.yaml was edited by hand (error code
// edited_by_hand, theme-files) is shown in plain words in en-GB, en-US and nl, and the contract knows the code.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const src = join(__dirname, '..', 'src');
const read = (...p: string[]) => readFileSync(join(src, ...p), 'utf8');
const table = (l: string) => JSON.parse(read('theme-editor', 'i18n', `${l}.json`)) as Record<string, { text: string; note?: string; max?: number }>;

describe('edited_by_hand in the theme editor', () => {
  it('is a ThemeErrorCode in the contract mirror', () => {
    const ts = read('contracts', 'theme-editor.ts');
    const block = ts.slice(ts.indexOf('export type ThemeErrorCode'), ts.indexOf('export interface ThemeBackendError'));
    expect(block).toContain("'edited_by_hand'");
  });

  it('has its own case in the save banner, not the generic default', () => {
    expect(read('theme-editor', 'editor-view.ts')).toMatch(/case 'edited_by_hand'/);
  });

  describe.each(['en-GB', 'en-US', 'nl'])('%s', (locale) => {
    const keys = Object.keys(table('en-GB')).filter((k) => /by hand/i.test(table('en-GB')[k].text));
    it('has a message that says the file was edited by hand', () => {
      expect(keys.length).toBeGreaterThanOrEqual(1);
      for (const k of keys) expect(table(locale)[k]?.text?.trim(), k).toBeTruthy();
    });
    it('is translated and noted', () => {
      for (const k of keys) {
        expect(table('en-GB')[k].note, k).toBeTruthy();
        if (locale === 'nl') expect(table('nl')[k].text).not.toBe(table('en-GB')[k].text);
      }
    });
    it('names the way forward: save under a new name', () => {
      const all = keys.map((k) => table(locale)[k]?.text ?? '').join(' ');
      const re = locale === 'nl' ? /nieuwe naam|andere naam|kopie/i : /new name|another name|copy/i;
      expect(all).toMatch(re);
    });
  });
});
