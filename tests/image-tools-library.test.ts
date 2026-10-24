import { afterEach, describe, expect, it, vi } from 'vitest';
import { getImage, listImages, resetImages } from '../src/image-tools/library';

const summary = (id: string) => ({ id, name: id, view_box: '0 0 16 9', bytes: 10, bindings: 0, updated_at: '2026-01-01T00:00:00Z' });
const hassWith = (callWS: (m: Record<string, unknown>) => Promise<unknown>) => ({ callWS }) as never;

afterEach(() => resetImages());

describe('images_list', () => {
  it('lists once and shares the answer', async () => {
    const callWS = vi.fn(async () => ({ images: [summary('a'), summary('b')] }));
    const hass = hassWith(callWS);
    const [x, y] = await Promise.all([listImages(hass), listImages(hass)]);
    expect(x).toBe(y);
    expect(x).toMatchObject({ state: 'ok' });
    expect(x.items.map((i) => i.id)).toEqual(['a', 'b']);
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS).toHaveBeenCalledWith({ type: 'magic_card_utils/images_list' });
  });

  it('says missing when Magic Card Utils does not know the command, and remembers it', async () => {
    const callWS = vi.fn(async () => {
      throw { code: 'unknown_command' };
    });
    const hass = hassWith(callWS);
    expect((await listImages(hass)).state).toBe('missing');
    expect((await listImages(hass)).state).toBe('missing');
    expect(callWS).toHaveBeenCalledTimes(1);
    resetImages();
    expect((await listImages(hass)).state).toBe('missing');
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it('says error for any other failure and tries again next time', async () => {
    let fail = true;
    const callWS = vi.fn(async () => {
      if (fail) throw { code: 'unknown_error' };
      return { images: [summary('a')] };
    });
    const hass = hassWith(callWS);
    expect((await listImages(hass)).state).toBe('error');
    fail = false;
    expect((await listImages(hass)).state).toBe('ok');
  });

  it('has no hass: missing, no call', async () => {
    expect((await listImages(undefined)).state).toBe('missing');
  });

  it('drops the list when the library changes', async () => {
    const callWS = vi.fn(async () => ({ images: [summary('a')] }));
    const hass = hassWith(callWS);
    await listImages(hass);
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'images', ids: ['a'] } }));
    await listImages(hass);
    expect(callWS).toHaveBeenCalledTimes(2);
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'icons', ids: [] } }));
    await listImages(hass);
    expect(callWS).toHaveBeenCalledTimes(2);
  });
});

describe('images_get', () => {
  it('fetches one image with its connections and caches it', async () => {
    const callWS = vi.fn(async () => ({ images: [{ ...summary('a'), svg: '<svg/>', bindings: [{ target: 'x', entity: 'light.k', set: 'fill', rules: [] }] }] }));
    const hass = hassWith(callWS);
    const a = await getImage(hass, 'a');
    expect(a?.bindings?.[0].entity).toBe('light.k');
    await getImage(hass, 'a');
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS).toHaveBeenCalledWith({ type: 'magic_card_utils/images_get', ids: ['a'] });
  });

  it('answers undefined for an unknown id and for a failure', async () => {
    expect(await getImage(hassWith(async () => ({ images: [] })), 'zz')).toBeUndefined();
    resetImages();
    expect(await getImage(hassWith(async () => { throw { code: 'x' }; }), 'zz')).toBeUndefined();
  });
});
