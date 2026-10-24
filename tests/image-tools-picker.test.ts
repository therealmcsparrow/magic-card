import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { install } from '../src/image-tools/chunk';
import { resetImages } from '../src/image-tools/library';
import type { McImagePicker } from '../src/image-tools/mc-image-picker';
import { defineUiKit } from '../src/ui-kit';

const sum = (id: string, name: string, view_box = '0 0 1920 1080', bindings = 0, thumb?: string) => ({ id, name, view_box, bytes: 84 * 1024, bindings, thumb, updated_at: '2026-01-01T00:00:00Z' });
const THUMB = 'data:image/webp;base64,AAAA';
const LIST = [sum('garden', 'Garden', '0 0 1280 960'), sum('ground', 'Ground floor', '0 0 1920 1080', 3, THUMB), sum('attic', 'Attic', '0 0 1000 1000')];

const flush = async (el: McImagePicker) => {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

async function mount(props: Record<string, unknown> = {}, answer: () => Promise<unknown> = async () => ({ images: LIST })): Promise<McImagePicker> {
  const el = document.createElement('mc-image-picker') as McImagePicker;
  Object.assign(el, { hass: { callWS: vi.fn(answer) }, current: '', ...props });
  document.body.append(el);
  await flush(el);
  return el;
}
const $ = (el: McImagePicker, sel: string) => el.shadowRoot!.querySelector<HTMLElement>(sel);
const $$ = (el: McImagePicker, sel: string) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(sel)];
const key = async (el: McImagePicker, target: HTMLElement, k: string) => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, composed: true }));
  await flush(el);
};

beforeEach(() => {
  defineUiKit();
  install();
  resetImages();
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('the image picker', () => {
  it('lists every image as a radio tile with its name, shape and size', async () => {
    const el = await mount();
    const tiles = $$(el, '.pick');
    expect(tiles).toHaveLength(3);
    expect(tiles.every((t) => t.getAttribute('role') === 'radio')).toBe(true);
    expect($(el, '[role=radiogroup]')!.getAttribute('aria-label')).toBe('Images');
    const ground = $(el, '[data-id=ground]')!;
    expect(ground.textContent).toContain('Ground floor');
    expect(ground.textContent).toContain('16:9');
    expect(ground.textContent).toContain('84 KiB');
    expect(ground.getAttribute('aria-label')).toBe('Ground floor, 16 to 9, 84 KiB');
    expect(ground.querySelector('img')!.getAttribute('src')).toBe(THUMB);
    expect($(el, '[data-id=garden]')!.querySelector('img')).toBeNull();
  });

  it('draws only a thumbnail that is a small raster data URL', async () => {
    const el = await mount({}, async () => ({ images: [sum('x', 'X', '0 0 1 1', 0, 'javascript:alert(1)'), sum('y', 'Y', '0 0 1 1', 0, 'data:image/svg+xml;base64,AAAA')] }));
    expect($$(el, 'img')).toHaveLength(0);
  });

  it('keeps the image in use first and marks it', async () => {
    const el = await mount({ current: 'attic' });
    const ids = $$(el, '.pick').map((t) => t.dataset.id);
    expect(ids[0]).toBe('attic');
    expect($(el, '[data-id=attic]')!.textContent).toContain('In use');
    expect($(el, '[data-id=attic]')!.getAttribute('aria-checked')).toBe('true');
  });

  it('filters by name, id and shape', async () => {
    const el = await mount();
    const search = $(el, '#mc-picker-search') as HTMLInputElement;
    search.value = 'gro';
    search.dispatchEvent(new Event('input'));
    await flush(el);
    expect($$(el, '.pick').map((t) => t.dataset.id)).toEqual(['ground']);
    search.value = '4:3';
    search.dispatchEvent(new Event('input'));
    await flush(el);
    expect($$(el, '.pick').map((t) => t.dataset.id)).toEqual(['garden']);
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    await flush(el);
    expect($$(el, '.pick')).toHaveLength(0);
    expect(el.shadowRoot!.textContent).toContain('No image matches “zzz”.');
  });

  it('moves between tiles with the arrow keys, Home and End, and selects with a click', async () => {
    const el = await mount();
    vi.spyOn(el as never as { _cols(): number }, '_cols').mockReturnValue(2);
    const tiles = () => $$(el, '.pick');
    expect(tiles().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    await key(el, tiles()[0], 'ArrowRight');
    expect(tiles().map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    await key(el, tiles()[1], 'ArrowDown');
    expect(tiles().map((t) => t.tabIndex)).toEqual([-1, -1, 0]);
    await key(el, tiles()[2], 'ArrowUp');
    expect(tiles().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    await key(el, tiles()[0], 'End');
    expect(tiles().map((t) => t.tabIndex)).toEqual([-1, -1, 0]);
    await key(el, tiles()[2], 'Home');
    expect(tiles().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    await key(el, tiles()[0], 'ArrowLeft');
    expect(tiles().map((t) => t.tabIndex)).toEqual([0, -1, -1]);
    tiles()[1].click();
    await flush(el);
    expect(tiles()[1].getAttribute('aria-checked')).toBe('true');
    expect(tiles()[0].getAttribute('aria-checked')).toBe('false');
  });

  it('Use this image is off until a tile is selected, then picks it', async () => {
    const el = await mount();
    const use = $(el, '[data-act=use]') as HTMLButtonElement;
    expect(use.disabled).toBe(true);
    const picked = vi.fn();
    el.addEventListener('pick', (e) => picked((e as CustomEvent).detail));
    $(el, '[data-id=ground]')!.click();
    await flush(el);
    expect(($(el, '[data-act=use]') as HTMLButtonElement).disabled).toBe(false);
    $(el, '[data-act=use]')!.click();
    expect(picked).toHaveBeenCalledWith({ id: 'ground' });
  });

  it('Enter on a tile selects it and uses it', async () => {
    const el = await mount();
    const picked = vi.fn();
    el.addEventListener('pick', (e) => picked((e as CustomEvent).detail));
    await key(el, $(el, '[data-id=garden]')!, 'Enter');
    expect(picked).toHaveBeenCalledWith({ id: 'garden' });
  });

  it('Cancel closes without a pick', async () => {
    const el = await mount();
    const closed = vi.fn();
    const picked = vi.fn();
    el.addEventListener('close', closed);
    el.addEventListener('pick', picked);
    $(el, '[data-act=cancel]')!.click();
    expect(closed).toHaveBeenCalled();
    expect(picked).not.toHaveBeenCalled();
  });

  it('ArrowDown in the search box goes to the first tile', async () => {
    const el = await mount();
    await key(el, $(el, '#mc-picker-search')!, 'ArrowDown');
    expect(el.shadowRoot!.activeElement).toBe($$(el, '.pick')[0]);
  });

  it('in a background layer, a connected image gets a Live chip with text and the note', async () => {
    const el = await mount({ background: true });
    expect($(el, '[data-id=ground]')!.textContent).toContain('Live: 3 connections');
    expect($(el, '[data-id=ground]')!.getAttribute('aria-label')).toContain('3 live connections');
    expect($(el, '[data-id=garden]')!.textContent).not.toContain('Live');
    expect(el.shadowRoot!.textContent).toContain('Thumbnails show the saved colours. On the card the live parts change with their devices.');
    const plain = await mount();
    expect($(plain, '[data-id=ground]')!.textContent).not.toContain('Live');
  });

  it('shows the loading, empty, unreachable and missing states', async () => {
    let release!: (v: unknown) => void;
    const pending = new Promise((r) => (release = r));
    const loading = await mount({}, () => pending);
    expect(loading.shadowRoot!.textContent).toContain('Loading images…');
    release({ images: [] });
    await flush(loading);
    expect(loading.shadowRoot!.textContent).toContain('No images yet.');
    expect(loading.shadowRoot!.textContent).toContain('Ask an administrator to add one.');
    document.body.innerHTML = '';

    resetImages();
    const admin = await mount({ canDraw: true }, async () => ({ images: [] }));
    const draw = vi.fn();
    admin.addEventListener('draw', draw);
    $(admin, '[data-act=draw]')!.click();
    expect(draw).toHaveBeenCalled();
    document.body.innerHTML = '';

    resetImages();
    const broken = await mount({}, async () => {
      throw { code: 'unknown_error' };
    });
    expect($(broken, '[role=alert]')!.textContent).toContain('The images could not be loaded.');
    document.body.innerHTML = '';

    resetImages();
    const none = await mount({}, async () => {
      throw { code: 'unknown_command' };
    });
    expect(none.shadowRoot!.textContent).toContain('Images need Magic Card Utils.');
  });

  it('Try again asks for the list again', async () => {
    let fail = true;
    const el = await mount({}, async () => {
      if (fail) throw { code: 'x' };
      return { images: LIST };
    });
    fail = false;
    $(el, '[data-act=retry]')!.click();
    await flush(el);
    expect($$(el, '.pick')).toHaveLength(3);
  });
});
