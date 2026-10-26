import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const NAMESPACES = ['editor', 'svg-editor', 'shape-editor', 'anim-studio', 'theme-editor'];
const LOCALES = ['en-US', 'nl'];

describe('lip tooltips come from one message with {noun} and {keys}', () => {
  for (const ns of NAMESPACES) {
    for (const loc of LOCALES) {
      it(`${ns} ${loc}: Hide and Show`, () => {
        const table = JSON.parse(readFileSync(`src/${ns}/i18n/${loc}.json`, 'utf8')) as Record<string, string>;
        for (const id of ['Hide {noun} ({keys})', 'Show {noun} ({keys})']) {
          expect(table[id], `${ns} ${loc} ${id}`).toBeTypeOf('string');
          expect(table[id]).toContain('{noun}');
          expect(table[id]).toContain('{keys}');
        }
      });
    }
  }
});
