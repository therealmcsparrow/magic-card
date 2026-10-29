import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const NAMESPACES = ['editor', 'svg-editor', 'shape-editor', 'anim-studio', 'theme-editor'];
const LOCALES = ['en-US', 'nl'];

describe('lip tooltips come from one message with {noun} and {keys}', () => {
  for (const ns of NAMESPACES) {
    for (const loc of LOCALES) {
      it(`${ns} ${loc}: Hide and Show`, () => {
        const dir = `src/${ns}/i18n`;
        const read = (file: string): Record<string, unknown> => JSON.parse(readFileSync(`${dir}/${file}.json`, 'utf8'));
        const keyed = existsSync(`${dir}/en-GB.json`);
        const source = keyed ? (read('en-GB') as Record<string, { text: string }>) : {};
        const table = read(loc) as Record<string, string | { text: string }>;
        for (const id of ['Hide {noun} ({keys})', 'Show {noun} ({keys})']) {
          const key = keyed ? Object.keys(source).find((k) => source[k].text === id) : id;
          const cell = key === undefined ? undefined : table[key];
          const text = typeof cell === 'string' ? cell : cell?.text;
          expect(text, `${ns} ${loc} ${id}`).toBeTypeOf('string');
          expect(text).toContain('{noun}');
          expect(text).toContain('{keys}');
        }
      });
    }
  }
});
