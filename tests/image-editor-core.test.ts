import { beforeAll, describe, expect, it, vi } from 'vitest';
import * as chunk from '../src/path-canvas/index';
import { bind } from '../src/svg-editor/bind';
import { bindKit } from '../src/image-editor/kit';
import { imageKit } from '../src/svg-editor/image-kit';
import { freeImageId, imageSlug } from '../src/image-editor/ids';
import { kibShown, meterLevel, savedBytes } from '../src/image-editor/meter';
import { gridFor, keepRatio, outsideCount, presetOf, readSize } from '../src/image-editor/canvas';
import { buildSave } from '../src/image-editor/save';
import { ImageError, fetchImage, listImages, storeImage } from '../src/image-editor/library';
import { api } from '../src/svg-image/chunk';
import { IMAGE_MAX_BYTES } from '../src/contracts/mcu-library-images';
import { blankDoc, newShape } from '../src/svg-editor/model';

beforeAll(() => {
  bind(chunk as never);
  bindKit(imageKit);
});

const SVG = '<svg viewBox="0 0 100 50"><path id="a" data-name="Roof" d="M0 0H10V10Z" fill="var(--mc-image-main)"/></svg>';

describe('image ids', () => {
  it('makes a slug of at most 48 characters and falls back to image', () => {
    expect(imageSlug('Ground floor')).toBe('ground-floor');
    expect(imageSlug('  Café Zoë!! ')).toBe('cafe-zoe');
    expect(imageSlug('???')).toBe('image');
    expect(imageSlug('x'.repeat(80))).toHaveLength(48);
  });
  it('adds -2, -3 when the id is taken', () => {
    expect(freeImageId('Garden', new Set())).toBe('garden');
    expect(freeImageId('Garden', new Set(['garden']))).toBe('garden-2');
    expect(freeImageId('Garden', new Set(['garden', 'garden-2']))).toBe('garden-3');
    expect(freeImageId('', new Set(['image']))).toBe('image-2');
  });
  it('keeps a long id inside 48 characters with its suffix', () => {
    const base = 'a'.repeat(48);
    const id = freeImageId(base, new Set([base]));
    expect(id).toHaveLength(48);
    expect(id.endsWith('-2')).toBe(true);
  });
});

describe('size meter', () => {
  it('has four levels at 96, 224 and 256 KiB', () => {
    expect(meterLevel(0)).toBe('small');
    expect(meterLevel(96 * 1024 - 1)).toBe('small');
    expect(meterLevel(96 * 1024)).toBe('big');
    expect(meterLevel(224 * 1024 - 1)).toBe('big');
    expect(meterLevel(224 * 1024)).toBe('full');
    expect(meterLevel(IMAGE_MAX_BYTES)).toBe('full');
    expect(meterLevel(IMAGE_MAX_BYTES + 1)).toBe('over');
  });
  it('never shows an over-size image as 256', () => {
    expect(kibShown(IMAGE_MAX_BYTES)).toBe(256);
    expect(kibShown(IMAGE_MAX_BYTES + 1)).toBe(257);
    expect(kibShown(150 * 1024)).toBe(150);
  });
  it('counts the connections only when there are some', () => {
    expect(savedBytes('abc', [])).toBe(3);
    expect(savedBytes('abc', [{ a: 1 }])).toBe(3 + '[{"a":1}]'.length);
  });
});

describe('canvas size', () => {
  it('reads sizes and names the field at fault', () => {
    expect(readSize('1920', '1080')).toEqual({ ok: true, w: 1920, h: 1080 });
    expect(readSize('15', '1080')).toEqual({ ok: false, bad: ['w'] });
    expect(readSize('4097', 'abc')).toEqual({ ok: false, bad: ['w', 'h'] });
    expect(readSize('', '100')).toEqual({ ok: false, bad: ['w'] });
    expect(readSize('16', '4096')).toEqual({ ok: true, w: 16, h: 4096 });
    expect(readSize('99,6', '50')).toEqual({ ok: true, w: 100, h: 50 });
  });
  it('keeps the ratio inside the allowed range', () => {
    expect(keepRatio({ w: 1920, h: 1080 }, 'w', 960)).toEqual({ w: 960, h: 540 });
    expect(keepRatio({ w: 1920, h: 1080 }, 'h', 540)).toEqual({ w: 960, h: 540 });
    expect(keepRatio({ w: 4096, h: 16 }, 'w', 16).h).toBe(16);
  });
  it('picks a grid from the ladder: longest side / 48', () => {
    expect(gridFor(1920, 1080)).toBe(40);
    expect(gridFor(1024, 1024)).toBe(20);
    expect(gridFor(16, 16)).toBe(1);
    expect(gridFor(4096, 4096)).toBe(100);
  });
  it('names a preset by its size', () => {
    expect(presetOf(1920, 1080)).toBe('16:9');
    expect(presetOf(1000, 1000)).toBe('custom');
  });
  it('counts layers outside a smaller canvas', () => {
    let d = { ...blankDoc('x'), vb: { x: 0, y: 0, w: 1920, h: 1080 } };
    const sq = (x: number, y: number) => newShape('path', [{ anchors: [{ x, y }, { x: x + 100, y }, { x: x + 100, y: y + 100 }, { x, y: y + 100 }], closed: true }]);
    d = { ...d, shapes: [sq(0, 0), sq(1800, 900)] };
    expect(outsideCount(d, 1920, 1080)).toBe(0);
    expect(outsideCount(d, 1000, 1000)).toBe(1);
  });
});

describe('save payload', () => {
  it('uses the sanitised view box, leaves out empty bindings and a thumb that cannot be made', async () => {
    const r = await buildSave(api, SVG, [], { id: 'roof', name: 'Roof' });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.input.view_box).toBe('0 0 100 50');
    expect('bindings' in r.input).toBe(false);
    expect('thumb' in r.input).toBe(false);
    expect(r.input.svg).toContain('data-name="Roof"');
  });
  it('adds the thumbnail from the api and the bindings', async () => {
    const fake = { ...api, thumbnail: vi.fn(async () => 'data:image/webp;base64,AAAA') };
    const b = [{ target: 'a', entity: 'light.x', set: 'fill' as const, rules: [{ state: 'on', value: 'main' }] }];
    const r = await buildSave(fake, SVG, b, { id: 'roof', name: 'Roof', keywords: ['a'] });
    expect(r.ok && r.input.thumb).toBe('data:image/webp;base64,AAAA');
    expect(r.ok && r.input.bindings).toEqual(b);
    expect(fake.thumbnail).toHaveBeenCalledWith(expect.stringContaining('<svg'), 320, 16 * 1024);
  });
  it('refuses over 256 KiB before sending and says the size', async () => {
    const tiny = '<svg viewBox="0 0 10 10"><path d="M0 0H1V1Z"/></svg>';
    const fake = { ...api, sanitizeImage: () => ({ markup: tiny, viewBox: '0 0 10 10', ids: [], stripped: [], bytes: 1 }) };
    const bindings = Array.from({ length: 4000 }, (_, i) => ({ target: `t${i}`, entity: 'light.a_very_long_entity_name_for_size', set: 'fill' as const, rules: [{ state: 'on', value: '#ff00ff' }, { state: 'off', value: '#00ff00' }] }));
    const r = await buildSave(fake, tiny, bindings, { id: 'a', name: 'A' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe('too_large');
      expect(r.bytes).toBeGreaterThan(IMAGE_MAX_BYTES);
    }
  });
  it('reports unusable markup', async () => {
    const r = await buildSave(api, '<svg viewBox="0 0 10 10"></svg>', [], { id: 'a', name: 'A' });
    expect(r.ok).toBe(false);
  });
});

describe('image library calls', () => {
  it('maps server errors', async () => {
    const hass = (err: unknown) => ({ callWS: vi.fn(async () => Promise.reject(err)) });
    await expect(storeImage(hass({ code: 'library_full' }), {} as never)).rejects.toMatchObject({ problem: 'full' });
    await expect(storeImage(hass({ code: 'conflict' }), {} as never)).rejects.toMatchObject({ problem: 'conflict' });
    await expect(storeImage(hass({ code: 'unauthorized' }), {} as never)).rejects.toMatchObject({ problem: 'readonly' });
    await expect(listImages(hass({ code: 'unknown_command' }))).rejects.toMatchObject({ problem: 'missing' });
    await expect(listImages(undefined)).rejects.toBeInstanceOf(ImageError);
    const big = hass({ code: 'invalid_format', errors: [{ path: 'svg', message: 'too_large', bytes: 300000, limit: IMAGE_MAX_BYTES }] });
    await expect(storeImage(big, {} as never)).rejects.toMatchObject({ problem: 'too_large', bytes: 300000, limit: IMAGE_MAX_BYTES });
  });
  it('sends base_updated_at only for an existing id and reads one image', async () => {
    const callWS = vi.fn(async (m: any) => (m.type.endsWith('images_get') ? { images: [{ id: 'a' }] } : { image: { id: 'a' } }));
    await storeImage({ callWS }, { id: 'a' } as never, 'u1');
    await storeImage({ callWS }, { id: 'b' } as never);
    expect(callWS.mock.calls[0][0]).toMatchObject({ type: 'magic_card_utils/images_save', base_updated_at: 'u1' });
    expect('base_updated_at' in callWS.mock.calls[1][0]).toBe(false);
    expect(await fetchImage({ callWS }, 'a')).toEqual({ id: 'a' });
    expect(callWS.mock.calls[2][0]).toEqual({ type: 'magic_card_utils/images_get', ids: ['a'] });
  });
});
