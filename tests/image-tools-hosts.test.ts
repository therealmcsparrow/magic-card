import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const layer = { close: vi.fn(), el: undefined as HTMLElement | undefined, back: undefined as unknown };
vi.mock('../src/editor/custom/layer', () => ({
  openLayer: (el: HTMLElement, back: unknown) => {
    layer.el = el;
    layer.back = back;
    return layer.close;
  },
}));
const loaded = vi.fn(async () => true);
vi.mock('../src/editor/custom/loaders', () => ({ loadSvgEditor: () => loaded() }));

import { addImageModuleBehind } from '../src/image-tools/card-module';
import { openImageEditor } from '../src/image-tools/editor-host';

beforeEach(() => {
  layer.close.mockClear();
  loaded.mockResolvedValue(true);
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('openImageEditor', () => {
  const saved = { id: 'ground', name: 'Ground', view_box: '0 0 16 9', svg: '<svg/>' };

  it('opens <mc-svg-editor> on the source and hands back what was saved', async () => {
    const from = document.createElement('div');
    const onSaved = vi.fn();
    const hass = { user: { is_admin: true } } as never;
    expect(await openImageEditor({ from, hass, source: { kind: 'image', id: 'ground' }, onSaved })).toBe('opened');
    const el = layer.el as HTMLElement & { source: unknown; hass: unknown; libraryAvailable: boolean };
    expect(el.localName).toBe('mc-svg-editor');
    expect(el.source).toEqual({ kind: 'image', id: 'ground' });
    expect(el.hass).toBe(hass);
    expect(el.libraryAvailable).toBe(true);
    expect(layer.back).toMatchObject({ from, key: 'image-field' });

    el.dispatchEvent(new CustomEvent('mc-svg-save', { detail: { target: 'image-library', svg: '<svg/>', saved } }));
    expect(onSaved).toHaveBeenCalledWith(saved);
    expect(layer.close).toHaveBeenCalledTimes(1);
  });

  it('ignores a save that is not an image save', async () => {
    const onSaved = vi.fn();
    await openImageEditor({ from: document.createElement('div'), source: { kind: 'image-blank' }, onSaved });
    layer.el!.dispatchEvent(new CustomEvent('mc-svg-save', { detail: { target: 'library', svg: '<svg/>', saved: { id: 'x' } } }));
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('closes the layer when the editor closes', async () => {
    await openImageEditor({ from: document.createElement('div'), source: { kind: 'image-blank' }, onSaved: vi.fn() });
    layer.el!.dispatchEvent(new CustomEvent('mc-svg-close', { detail: { dirty: false } }));
    expect(layer.close).toHaveBeenCalledTimes(1);
  });

  it('reports a chunk that did not load and opens nothing', async () => {
    loaded.mockResolvedValue(false);
    layer.el = undefined;
    expect(await openImageEditor({ from: document.createElement('div'), source: { kind: 'image-blank' }, onSaved: vi.fn() })).toBe('failed');
    expect(layer.el).toBeUndefined();
  });
});

describe('addImageModuleBehind', () => {
  const cardWith = (config: object) => {
    const from = document.createElement('div');
    const sm = { getConfig: () => config, updateConfig: vi.fn() };
    document.addEventListener('mc-card-bridge', (e) => ((e as CustomEvent).detail.sm = sm), { once: true });
    return { from, sm };
  };

  it('adds an image module with placement background and the same reference to the first column', () => {
    const config = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text' }] }] }] };
    const { from, sm } = cardWith(config);
    document.body.append(from);
    expect(addImageModuleBehind(from, 'mcu-image:ground', '16:9')).toBe(true);
    const next = sm.updateConfig.mock.calls[0][0];
    const mods = next.rows[0].columns[0].modules;
    expect(mods).toHaveLength(2);
    expect(mods[0]).toEqual({ id: 'm', type: 'text' });
    expect(mods[1]).toMatchObject({ type: 'image', image: 'mcu-image:ground', placement: 'background', aspect_ratio: '16:9' });
    expect(typeof mods[1].id).toBe('string');
    expect(mods[1].description).toBeUndefined();
    expect(config.rows[0].columns[0].modules).toHaveLength(1);
    expect(sm.updateConfig.mock.calls[0][1]).toBe(true);
  });

  it('does nothing outside the card editor or on a card without a column', () => {
    const lone = document.createElement('div');
    expect(addImageModuleBehind(lone, 'mcu-image:a')).toBe(false);
    const { from, sm } = cardWith({ type: 'x', rows: [] });
    document.body.append(from);
    expect(addImageModuleBehind(from, 'mcu-image:a')).toBe(false);
    expect(sm.updateConfig).not.toHaveBeenCalled();
  });
});
