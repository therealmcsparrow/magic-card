import { describe, it, expect, vi } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { createImageTransfer } from '../src/image-transfer/chunk';
import { imageTransferKit } from '../src/transfer/image-transfer-loader';
import { IMAGE_TRANSFER_REVISION, IMAGE_TRANSFER_TEXT } from '../src/contracts/preset-transfer';
import type { TransferItem } from '../src/contracts/preset-transfer';
import { MAX_IMAGE_GET_IDS } from '../src/contracts/mcu-library-images';
import { THUMB_MAX_BYTES } from '../src/contracts/mcu-library-images';
import { THUMB_SIDE_PX } from '../src/contracts/image-editor';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path id="a" d="M0 0L5 5"/></svg>';
const THUMB = 'data:image/png;base64,iVBORw0KGgo=';

interface Saved {
  id: string;
  name: string;
  svg: string;
  view_box: string;
  author?: string;
  description?: string;
  keywords?: string[];
  bindings?: unknown[];
  thumb?: string;
  created_at: string;
  updated_at: string;
}
const make = (id: string, extra: Partial<Saved> = {}): Saved => ({ id, name: id.toUpperCase(), svg: SVG, view_box: '0 0 10 10', created_at: 'c', updated_at: 'u1', ...extra });

function setup(initial: Saved[], thumbnail: (m: string, side: number, max: number) => Promise<string | undefined> = async () => THUMB) {
  const store = new Map(initial.map((s) => [s.id, s]));
  const calls: Record<string, unknown>[] = [];
  const invalidated: string[][] = [];
  const api = { sanitizeImage: vi.fn(), thumbnail: vi.fn(thumbnail), invalidate: (ids: string[]) => void invalidated.push(ids) };
  const hass = {
    callWS: async (m: Record<string, unknown>): Promise<unknown> => {
      calls.push(m);
      switch (m.type) {
        case 'magic_card_utils/images_list':
          return { images: [...store.values()].map((s) => ({ id: s.id, name: s.name, view_box: s.view_box, bytes: 3000, bindings: 0, updated_at: s.updated_at })) };
        case 'magic_card_utils/images_get':
          return { images: (m.ids as string[]).map((id) => store.get(id)).filter(Boolean) };
        case 'magic_card_utils/images_save':
          return {};
        default:
          return {};
      }
    },
  };
  return { it: createImageTransfer(api as never, imageTransferKit), api, hass, calls, invalidated, of: (type: string) => calls.filter((c) => c.type === `magic_card_utils/${type}`) };
}

describe('createImageTransfer', () => {
  it('carries the revision the loader checks', () => {
    expect(setup([]).it.revision).toBe(IMAGE_TRANSFER_REVISION);
  });

  it('has a word for every key of the contract', () => {
    const { it: ix } = setup([]);
    for (const k of IMAGE_TRANSFER_TEXT) expect(ix.text(k, { name: 'House' }), k).not.toBe('');
    expect(ix.text('export_all')).toBe('Export all images');
    expect(ix.text('view', { name: 'House' })).toBe('View House');
    expect(ix.text('copy_name', { name: 'House' })).toBe('House copy');
    expect(ix.text('delete_confirm', { name: 'House' })).toBe('Delete House? Cards that use it show that the image is missing. This cannot be undone.');
  });

  it('list answers ok, missing and error', async () => {
    const s = setup([make('a')]);
    expect(await s.it.list(s.hass)).toMatchObject({ state: 'ok', items: [{ id: 'a' }] });
    const gone = { callWS: async () => Promise.reject(Object.assign(new Error('x'), { code: 'unknown_command' })) };
    expect(await s.it.list(gone)).toEqual({ state: 'missing', items: [] });
    expect(await s.it.list({} as never)).toEqual({ state: 'missing', items: [] });
    const down = { callWS: async () => Promise.reject(new Error('offline')) };
    expect(await s.it.list(down)).toEqual({ state: 'error', items: [] });
  });

  it('exportItems reads in calls of at most 8, in the order asked, without thumbnails or timestamps', async () => {
    const all = Array.from({ length: 20 }, (_, i) => make(`img-${String(i).padStart(2, '0')}`, { thumb: THUMB, author: 'Alex', keywords: ['home'], bindings: i === 3 ? [{ target: 'a' }] : undefined }));
    const s = setup(all);
    const ids = all.map((a) => a.id).reverse();
    const items = await s.it.exportItems(s.hass, ids);
    expect(s.of('images_get').map((c) => (c.ids as string[]).length)).toEqual([8, 8, 4]);
    expect(Math.max(...s.of('images_get').map((c) => (c.ids as string[]).length))).toBeLessThanOrEqual(MAX_IMAGE_GET_IDS);
    expect(items.map((i) => i.id)).toEqual(ids);
    expect(JSON.stringify(items)).not.toContain('thumb');
    expect(JSON.stringify(items)).not.toContain('updated_at');
    expect(items.find((i) => i.id === 'img-00')).toEqual({ id: 'img-00', name: 'IMG-00', author: 'Alex', keywords: ['home'], data: { svg: SVG, view_box: '0 0 10 10' } });
    expect(items.find((i) => i.id === 'img-03')!.data.bindings).toEqual([{ target: 'a' }]);
  });

  it('rename keeps the id and names the version it replaces', async () => {
    const s = setup([make('house', { thumb: THUMB, author: 'Alex' })]);
    await s.it.rename(s.hass, 'house', 'Big house');
    const save = s.of('images_save')[0];
    expect(save.base_updated_at).toBe('u1');
    expect(save.image).toMatchObject({ id: 'house', name: 'Big house', svg: SVG, thumb: THUMB, author: 'Alex' });
    expect(save.image).not.toHaveProperty('created_at');
    expect(save.image).not.toHaveProperty('updated_at');
    expect(s.invalidated).toEqual([['house']]);
  });

  it('rename and duplicate of an image that is gone reject with "gone"', async () => {
    const s = setup([]);
    await expect(s.it.rename(s.hass, 'nope', 'X')).rejects.toThrow('gone');
    await expect(s.it.duplicate(s.hass, 'nope', 'X', () => false)).rejects.toThrow('gone');
    expect(s.of('images_save')).toEqual([]);
  });

  it('duplicate saves under a free id without base_updated_at and resolves the id', async () => {
    const s = setup([make('ground-floor', { bindings: [{ target: 'a' }] })]);
    const id = await s.it.duplicate(s.hass, 'ground-floor', 'Ground floor copy', (x) => x === 'ground-floor-copy');
    expect(id).toBe('ground-floor-copy-2');
    const save = s.of('images_save')[0];
    expect(save).not.toHaveProperty('base_updated_at');
    expect(save.image).toMatchObject({ id: 'ground-floor-copy-2', name: 'Ground floor copy', bindings: [{ target: 'a' }] });
    expect(s.invalidated).toEqual([['ground-floor-copy-2']]);
  });

  it('remove calls images_delete and forgets the cached drawing', async () => {
    const s = setup([make('house')]);
    await s.it.remove(s.hass, 'house');
    expect(s.of('images_delete')).toEqual([{ type: 'magic_card_utils/images_delete', image_id: 'house' }]);
    expect(s.invalidated).toEqual([['house']]);
  });

  it('keeps the server error and its code', async () => {
    const hass = { callWS: async () => Promise.reject(Object.assign(new Error('full'), { code: 'library_full' })) };
    const s = setup([]);
    await expect(s.it.remove(hass, 'a')).rejects.toMatchObject({ code: 'library_full' });
    await expect(s.it.save(hass, { id: 'a', name: 'A', data: { svg: SVG, view_box: '0 0 10 10' } }, undefined)).rejects.toMatchObject({ code: 'library_full' });
  });

  describe('save', () => {
    const item: TransferItem<'image'> = { id: 'house', name: 'House', author: 'Alex', keywords: ['home'], data: { svg: SVG, view_box: '0 0 10 10', bindings: [{ target: 'a', entity: 'light.a', set: 'fill', rules: [{ state: 'on', value: 'main' }] }] } };

    it('makes the thumbnail through the api with the contract sizes and sends it', async () => {
      const s = setup([]);
      await s.it.save(s.hass, item, 'u9');
      expect(s.api.thumbnail).toHaveBeenCalledWith(SVG, THUMB_SIDE_PX, THUMB_MAX_BYTES);
      const save = s.of('images_save')[0];
      expect(save.base_updated_at).toBe('u9');
      expect(save.image).toMatchObject({ id: 'house', name: 'House', author: 'Alex', keywords: ['home'], view_box: '0 0 10 10', svg: SVG, thumb: THUMB });
      expect(s.invalidated).toEqual([['house']]);
    });

    it('sends no base_updated_at for a new id', async () => {
      const s = setup([]);
      await s.it.save(s.hass, item);
      expect(s.of('images_save')[0]).not.toHaveProperty('base_updated_at');
    });

    it.each([
      ['not a data URL of an image', 'javascript:alert(1)'],
      ['an svg data URL', 'data:image/svg+xml;base64,AAAA'],
      ['a png with a stray character', 'data:image/png;base64,AA"AA'],
    ])('leaves a thumbnail out when it is %s', async (_n, thumb) => {
      const s = setup([], async () => thumb);
      await s.it.save(s.hass, item);
      expect(s.of('images_save')[0].image).not.toHaveProperty('thumb');
    });

    it('leaves the thumbnail out when the browser cannot make one, and still saves', async () => {
      for (const make of [async () => undefined, async () => Promise.reject(new Error('no canvas'))]) {
        const s = setup([], make);
        await s.it.save(s.hass, item);
        expect(s.of('images_save')).toHaveLength(1);
        expect(s.of('images_save')[0].image).not.toHaveProperty('thumb');
      }
    });
  });

  it('row shows a thumbnail only when it is a THUMB_RE data URL, with size and connections', () => {
    const { it: ix } = setup([]);
    const base = { id: 'a', name: 'A', view_box: '0 0 1 1', bytes: 2048, bindings: 0, updated_at: 'u' };
    expect(ix.row({ ...base, thumb: THUMB, bindings: 2 })).toEqual({ thumb: THUMB, meta: '2 KB · 2 connections' });
    expect(ix.row({ ...base, bindings: 1 }).meta).toBe('2 KB · 1 connection');
    expect(ix.row({ ...base, bytes: 10 })).toEqual({ meta: '1 KB' });
    expect(ix.row({ ...base, thumb: 'javascript:alert(1)' }).thumb).toBeUndefined();
  });

  it('invalidate forgets the ids in the svg-image cache', () => {
    const s = setup([]);
    s.it.invalidate(['a', 'b']);
    expect(s.invalidated).toEqual([['a', 'b']]);
  });
});

describe('src/image-transfer boundary', () => {
  const dir = 'src/image-transfer';
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => `${dir}/${f}`);
  const sources = files.map((f) => [f, readFileSync(f, 'utf8')] as const);

  it('has the files the contract names', () => {
    expect(files.map((f) => f.split('/').pop()).sort()).toEqual(expect.arrayContaining(['chunk.ts', 'commands.ts', 'reader.ts']));
  });

  it.each(sources)('%s imports only contracts, the i18n runtime and its own folder', (_f, src) => {
    const specs = [...src.matchAll(/(?:from|import\()\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
    for (const spec of specs) {
      expect(spec, spec).toMatch(/^(\.\/|\.\.\/contracts\/|\.\.\/i18n\/runtime$|\.\.\/\.\.\/i18n\/runtime$)/);
      if (!spec.startsWith('../contracts/')) expect(spec).not.toMatch(/transfer\/|svg-image|lazy-chunks|editor|lit/);
    }
  });

  it.each(sources)('%s holds no SVG or HTML sink', (_f, src) => {
    for (const bad of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'unsafeSVG', 'unsafeHTML', 'DOMParser', 'new Blob', 'createObjectURL', 'document.write', 'sanitizeSvg']) expect(src, bad).not.toContain(bad);
    expect(src).not.toMatch(/\bhtml`|\bsvg`/);
  });
});
