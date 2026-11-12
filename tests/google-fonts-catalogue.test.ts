import { describe, expect, it } from 'vitest';
import { findFamily, genericFor, parseCatalogue } from '../src/google-fonts/catalogue';
import { PACKED } from '../src/google-fonts/catalogue.gen';

describe('google fonts catalogue', () => {
  it('finds families case-insensitively', () => {
    expect(findFamily('lato')?.name).toBe('Lato');
  });
  it('finds a family only under the name its stylesheet declares', () => {
    expect(findFamily('Source Sans Pro')).toBeUndefined();
    expect(findFamily('source sans 3')?.name).toBe('Source Sans 3');
  });
  it('knows no system fonts', () => {
    expect(findFamily('Segoe UI')).toBeUndefined();
    expect(findFamily('Arial')).toBeUndefined();
  });
  it('lists upright weights', () => {
    expect(findFamily('Lato')!.weights).toEqual(expect.arrayContaining([300, 400, 700]));
  });
  it('has safe names and a large catalogue', () => {
    const all = parseCatalogue(PACKED);
    expect(all.length).toBeGreaterThan(1500);
    for (const f of all) expect(f.name).toMatch(/^[A-Za-z0-9 ]{1,64}$/);
  });
  it('maps categories to generics', () => {
    expect(genericFor('handwriting')).toBe('cursive');
    expect(genericFor('display')).toBe('sans-serif');
    expect(genericFor('monospace')).toBe('monospace');
  });
  it('parses empty input', () => {
    expect(parseCatalogue('')).toEqual([]);
  });
});
