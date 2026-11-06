import { afterEach, describe, expect, it, vi } from 'vitest';
import * as customCardModule from '../src/modules/advanced/custom-card-module';
import { getCardHelpers } from '../src/utils/card-helpers';

/*
 * card-helpers.ts holds no module state, so the camera and custom-card views (modules-extra) and the card editor each carry
 * a copy and magic-card.js carries none.
 */

const win = window as unknown as { loadCardHelpers?: () => Promise<unknown> };

afterEach(() => {
  delete win.loadCardHelpers;
});

describe('getCardHelpers', () => {
  it('is undefined outside Home Assistant', () => {
    expect(getCardHelpers()).toBeUndefined();
  });

  it('resolves to what HA loads', async () => {
    const helpers = { createCardElement: vi.fn() };
    win.loadCardHelpers = async () => helpers;
    await expect(getCardHelpers()).resolves.toBe(helpers);
  });

  it('asks HA again after a failed load', async () => {
    const helpers = { createCardElement: vi.fn() };
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(helpers);
    win.loadCardHelpers = load;
    await expect(getCardHelpers()).rejects.toThrow('offline');
    await expect(getCardHelpers()).resolves.toBe(helpers);
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe('custom-card-module (in magic-card.js)', () => {
  it('re-exports none of the card helpers', () => {
    expect(Object.keys(customCardModule).sort()).toEqual(['customCardEmpty']);
  });
});
