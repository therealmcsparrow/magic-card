import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
// @ts-expect-error plain module
import { catalogueDigest } from '../tools/i18n/vite-plugin.mjs';

const changed = (suffix: string, name = 'en-GB.json') => (file: string) => {
  const data = readFileSync(file);
  return file.endsWith(name) ? Buffer.concat([data, Buffer.from(suffix)]) : data;
};

describe('vitest transform cache identity', () => {
  it('is stable while the catalogues are unchanged', () => {
    expect(catalogueDigest()).toBe(catalogueDigest());
  });

  it('changes when a catalogue changes', () => {
    expect(catalogueDigest(changed(' '))).not.toBe(catalogueDigest());
    expect(catalogueDigest(changed(' '))).not.toBe(catalogueDigest(changed('  ')));
  });

  it('changes when the legal labels change', () => {
    expect(catalogueDigest(changed(' ', 'legal-labels.json'))).not.toBe(catalogueDigest());
  });

  it('changes when the exceptions or key contracts change', () => {
    for (const name of ['en-US-exceptions.json', 'i18n.ts', 'i18n-keys.ts']) {
      expect(catalogueDigest(changed(' ', name))).not.toBe(catalogueDigest());
    }
  });

  it('keeps the normal key for files the plugin never rewrites', () => {
    expect(catalogueDigest(changed(' ', 'unrelated.json'))).toBe(catalogueDigest());
  });
});
