import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/index';
import '../src/transfer/chunk';
import { animationLibrary } from '../src/anim-studio/animation-library';
import { resetLibrary } from '../src/editor/custom/library';
import { LIBRARY_OPEN_EVENT } from '../src/contracts/preset-transfer';
import type { LibraryOpenDetail } from '../src/contracts/preset-transfer';
import { IMAGES_MIN_CONTRACT_REVISION, MAX_IMAGE_GET_IDS } from '../src/contracts/mcu-library-images';
import type { LibraryView } from '../src/transfer/library-view';
import type { TransferPanel } from '../src/transfer/panel';

const flush = async () => {
  for (let i = 0; i < 8; i++) await new Promise((r) => setTimeout(r, 0));
};
const q = <T extends Element>(el: Element, sel: string) => el.shadowRoot!.querySelector<T>(sel);
const label = (b: Element) => b.getAttribute('aria-label') ?? b.textContent?.trim();
const btn = (el: Element, text: string) => [...el.shadowRoot!.querySelectorAll('button')].find((b) => label(b) === text) as HTMLButtonElement | undefined;

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path id="roof" d="M0 0H10V10Z" fill="var(--mc-image-main)"/><circle id="lamp" cx="5" cy="5" r="2" fill="#ff0"/></svg>';
const THUMB = 'data:image/png;base64,iVBORw0KGgo=';
const BINDINGS = [{ target: 'lamp', entity: 'light.kitchen', set: 'fill', rules: [{ state: 'on', value: 'accent' }] }, { target: 'roof', entity: 'sun.sun', set: 'opacity', rules: [{ state: 'below_horizon', value: 40 }] }];

interface Stored {
  id: string;
  name: string;
  view_box: string;
  svg: string;
  bindings?: unknown[];
  thumb?: string;
  author?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
}
const make = (id: string, name: string, extra: Partial<Stored> = {}): Stored => ({ id, name, view_box: '0 0 100 50', svg: SVG, created_at: 'c', updated_at: 'u1', ...extra });
const summary = (s: Stored) => ({ id: s.id, name: s.name, view_box: s.view_box, bytes: 2048, bindings: s.bindings?.length ?? 0, ...(s.thumb ? { thumb: s.thumb } : {}), updated_at: s.updated_at });

function backend(initial: Stored[], opts: { missing?: boolean } = {}) {
  const store = new Map(initial.map((s) => [s.id, s]));
  const calls: Record<string, unknown>[] = [];
  const callWS = async (m: Record<string, unknown>): Promise<unknown> => {
    calls.push(m);
    if (opts.missing) throw Object.assign(new Error('nope'), { code: 'unknown_command' });
    switch (m.type) {
      case 'magic_card_utils/images_list':
        return { images: [...store.values()].map(summary) };
      case 'magic_card_utils/images_get':
        return { images: (m.ids as string[]).map((id) => store.get(id)).filter(Boolean) };
      case 'magic_card_utils/images_save': {
        const img = m.image as Stored;
        if (store.has(img.id) && m.base_updated_at !== store.get(img.id)!.updated_at) throw Object.assign(new Error('conflict'), { code: 'conflict' });
        store.set(img.id, { ...img, created_at: 'c', updated_at: 'u2' });
        return { image: summary(store.get(img.id)!) };
      }
      case 'magic_card_utils/images_delete':
        store.delete(m.image_id as string);
        return {};
      default:
        return {};
    }
  };
  return { store, calls, callWS, of: (type: string) => calls.filter((c) => c.type === `magic_card_utils/${type}`) };
}

async function mount(be: ReturnType<typeof backend>, props: Partial<LibraryView> = {}, admin = true, narrow = true) {
  const el = document.createElement('mc-library-view') as LibraryView;
  Object.assign(el, { context: 'mcu-panel' }, narrow ? { kinds: ['image'] } : {}, { hass: { user: { is_admin: admin }, callWS: be.callWS, connection: { subscribeMessage: async () => () => {} } } }, props);
  document.body.append(el);
  await flush();
  for (let i = 0; i < 100 && el.shadowRoot!.textContent!.includes('Loading...'); i++) await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return el;
}

describe('<mc-library-view kinds=["image"]>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    animationLibrary.reset();
    resetLibrary();
  });

  it('lists images with thumbnail, size and connections, and carries a contract revision of at least 6', async () => {
    const be = backend([make('house', 'House', { thumb: THUMB, bindings: BINDINGS }), make('evil', 'Evil', { thumb: 'javascript:alert(1)' })]);
    const el = await mount(be);
    expect((customElements.get('mc-library-view') as unknown as { contractRevision: number }).contractRevision).toBeGreaterThanOrEqual(IMAGES_MIN_CONTRACT_REVISION);
    expect(q(el, '[aria-label=Kind]')).toBeNull();
    const rows = [...el.shadowRoot!.querySelectorAll('.row')];
    expect(rows).toHaveLength(2);
    const house = rows.find((r) => r.textContent!.includes('House'))!;
    const img = house.querySelector('img')!;
    expect(img.getAttribute('src')).toBe(THUMB);
    expect(img.getAttribute('alt')).toBe('');
    expect(house.textContent).toContain('2 KB');
    expect(house.textContent).toContain('2 connections');
    expect(rows.find((r) => r.textContent!.includes('Evil'))!.querySelector('img')).toBeNull();
    expect(el.shadowRoot!.innerHTML).not.toContain('javascript:');
  });

  it('New image and Edit fire mc-library-open with kind image', async () => {
    const el = await mount(backend([make('house', 'House')]));
    const got: LibraryOpenDetail[] = [];
    document.body.addEventListener(LIBRARY_OPEN_EVENT, (e) => got.push((e as CustomEvent<LibraryOpenDetail>).detail));
    btn(el, 'New image')!.click();
    btn(el, 'Edit House')!.click();
    expect(got).toEqual([{ kind: 'image' }, { kind: 'image', id: 'house' }]);
  });

  it('shows images in the Library tab between shapes and animations', async () => {
    const el = await mount(backend([make('house', 'House')]), {}, true, false);
    const kinds = [...el.shadowRoot!.querySelectorAll('[aria-label=Kind] button')].map((b) => b.textContent);
    expect(kinds).toEqual(['Icons', 'Shapes', 'Images', 'Animations', 'Theme presets']);
  });

  it('is read-only for a non-admin: the list, View and Export, nothing that changes the library', async () => {
    const el = await mount(backend([make('house', 'House')]), {}, false);
    expect(btn(el, 'View House')).toBeTruthy();
    expect(btn(el, 'Export all images')).toBeTruthy();
    for (const l of ['Edit House', 'Rename House', 'Duplicate House', 'Delete House', 'New image', 'Import']) expect(btn(el, l), l).toBeUndefined();
  });

  it('says Magic Card Utils is needed when the images commands are missing, and offers no import', async () => {
    const el = await mount(backend([], { missing: true }));
    expect(el.shadowRoot!.textContent).toContain('Images need Magic Card Utils');
    expect(btn(el, 'Import')).toBeUndefined();
    expect(btn(el, 'New image')).toBeUndefined();
  });

  it('Duplicate asks for a name, saves a copy under a new id without base_updated_at, then opens it', async () => {
    const be = backend([make('ground-floor', 'Ground floor', { thumb: THUMB, bindings: BINDINGS, author: 'Alex', keywords: ['home'] })]);
    const el = await mount(be);
    const opened: LibraryOpenDetail[] = [];
    document.body.addEventListener(LIBRARY_OPEN_EVENT, (e) => opened.push((e as CustomEvent<LibraryOpenDetail>).detail));
    btn(el, 'Duplicate Ground floor')!.click();
    await el.updateComplete;
    const input = q<HTMLInputElement>(el, '.row .input')!;
    expect(input.value).toBe('Ground floor copy');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flush();
    const saves = be.of('images_save');
    expect(saves).toHaveLength(1);
    expect(saves[0].base_updated_at).toBeUndefined();
    expect(saves[0].image).toMatchObject({ id: 'ground-floor-copy', name: 'Ground floor copy', svg: SVG, bindings: BINDINGS, author: 'Alex', keywords: ['home'], thumb: THUMB });
    expect(saves[0].image).not.toHaveProperty('created_at');
    expect(saves[0].image).not.toHaveProperty('updated_at');
    expect(opened).toEqual([{ kind: 'image', id: 'ground-floor-copy' }]);
    expect(be.store.has('ground-floor')).toBe(true);
  });

  it('Duplicate numbers the id when the slug is taken', async () => {
    const be = backend([make('ground-floor', 'Ground floor'), make('ground-floor-copy', 'Ground floor copy')]);
    const el = await mount(be);
    btn(el, 'Duplicate Ground floor')!.click();
    await el.updateComplete;
    btn(el, 'Create copy')!.click();
    await flush();
    expect((be.of('images_save')[0].image as Stored).id).toBe('ground-floor-copy-2');
  });

  it('Duplicate is disabled at 200 images, with the reason in view', async () => {
    const be = backend(Array.from({ length: 200 }, (_, i) => make(`img-${i}`, `Image ${i}`)));
    const el = await mount(be);
    expect(btn(el, 'Duplicate Image 1')!.disabled).toBe(true);
    expect(el.shadowRoot!.textContent).toContain('The library is full.');
  });

  it('Rename keeps the id and sends base_updated_at', async () => {
    const be = backend([make('house', 'House')]);
    const el = await mount(be);
    btn(el, 'Rename House')!.click();
    await el.updateComplete;
    const input = q<HTMLInputElement>(el, '.row .input')!;
    input.value = 'Big house';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flush();
    const save = be.of('images_save')[0];
    expect(save.base_updated_at).toBe('u1');
    expect(save.image).toMatchObject({ id: 'house', name: 'Big house', svg: SVG });
  });

  it('Delete calls images_delete', async () => {
    const be = backend([make('house', 'House')]);
    const el = await mount(be);
    btn(el, 'Delete House')!.click();
    await el.updateComplete;
    btn(el, 'Delete')!.click();
    await flush();
    expect(be.of('images_delete')).toEqual([{ type: 'magic_card_utils/images_delete', image_id: 'house' }]);
  });

  it('Export all reads the images in calls of at most 8 and writes a JSON envelope without thumbnails', async () => {
    const be = backend(Array.from({ length: 20 }, (_, i) => make(`img-${String(i).padStart(2, '0')}`, `Image ${String(i).padStart(2, '0')}`, { thumb: THUMB, bindings: i === 3 ? BINDINGS : undefined })));
    const el = await mount(be);
    btn(el, 'Export all images')!.click();
    await flush();
    const sizes = be.of('images_get').map((c) => (c.ids as string[]).length);
    expect(sizes).toEqual([8, 8, 4]);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(MAX_IMAGE_GET_IDS);
    const p = q<TransferPanel>(el, 'mc-transfer-panel')!;
    await p.updateComplete;
    expect(p.shadowRoot!.querySelector('[aria-label="File format"]')).toBeNull();
    const out = JSON.parse(p.shadowRoot!.querySelector<HTMLTextAreaElement>('#out')!.value);
    expect(out.kind).toBe('image');
    expect(out.items).toHaveLength(20);
    expect(out.items[3].data.bindings).toEqual(BINDINGS);
    expect(JSON.stringify(out)).not.toContain('thumb');
    expect(out.items[0].data).toEqual({ svg: SVG, view_box: '0 0 100 50' });
  });

  async function importText(el: LibraryView, text: string) {
    btn(el, 'Import')!.click();
    await el.updateComplete;
    const p = q<TransferPanel>(el, 'mc-transfer-panel')!;
    p.shadowRoot!.querySelector<HTMLTextAreaElement>('#paste')!.value = text;
    btn(p, 'Read')!.click();
    for (let i = 0; i < 100 && !p.shadowRoot!.querySelector('#res'); i++) await new Promise((r) => setTimeout(r, 20));
    await flush();
    await p.updateComplete;
    return p;
  }
  const file = (items: unknown[]) => JSON.stringify({ magic_card_export: '1.0', kind: 'image', items });

  it('imports an exported file through images_save, with a thumbnail when the browser can make one', async () => {
    const be = backend([make('house', 'House')]);
    const el = await mount(be);
    const p = await importText(el, file([{ id: 'house', name: 'House', keywords: ['home'], data: { svg: SVG, view_box: '0 0 100 50', bindings: BINDINGS } }, { id: 'barn', name: 'Barn', data: { svg: SVG, view_box: '0 0 100 50' } }]));
    expect(p.shadowRoot!.textContent).toContain('(you have this one)');
    btn(p, 'Import 2 images')!.click();
    await flush();
    const saves = be.of('images_save').map((c) => c.image as Stored);
    expect(saves.map((s) => s.id)).toEqual(['house-2', 'barn']);
    expect(saves[0]).toMatchObject({ name: 'House', keywords: ['home'], bindings: BINDINGS, view_box: '0 0 100 50' });
    expect(saves[0]).not.toHaveProperty('thumb');
    expect(be.of('images_save').map((c) => c.base_updated_at)).toEqual([undefined, undefined]);
  });

  it('Replace overwrites the saved image under its own id', async () => {
    const be = backend([make('house', 'House')]);
    const el = await mount(be);
    const p = await importText(el, file([{ id: 'house', name: 'House', data: { svg: SVG, view_box: '0 0 100 50' } }]));
    [...p.shadowRoot!.querySelectorAll<HTMLElement>('[role=radio]')].find((r) => r.textContent!.trim() === 'Replace them')!.click();
    await p.updateComplete;
    btn(p, 'Import 1 image')!.click();
    await flush();
    expect((be.of('images_save')[0].image as Stored).id).toBe('house');
    expect(be.of('images_save')[0].base_updated_at).toBe('u1');
  });

  it('strips hostile markup from an import, lists it before the user confirms, and saves only the clean drawing', async () => {
    const bad = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><script>alert(1)</script><path id="p" d="M0 0L5 5L5 0Z" onclick="x" fill="#f00"/></svg>';
    const be = backend([]);
    const el = await mount(be);
    const p = await importText(el, file([{ id: 'bad', name: 'Bad', data: { svg: bad } }]));
    const text = p.shadowRoot!.textContent!;
    expect(text).toMatch(/script/);
    expect(text).toMatch(/onclick/);
    expect(p.shadowRoot!.querySelector('details')!.hasAttribute('open')).toBe(true);
    btn(p, 'Import 1 image')!.click();
    await flush();
    const svg = (be.of('images_save')[0].image as Stored).svg.toLowerCase();
    expect(svg).not.toContain('script');
    expect(svg).not.toContain('onclick');
    expect(svg).not.toContain('onload');
  });

  it('refuses YAML for images and says why', async () => {
    const el = await mount(backend([]));
    const p = await importText(el, `magic_card_export: '1.0'\nkind: image\nitems:\n  - id: a\n    name: A\n    data:\n      svg: '${SVG}'\n`);
    expect(p.shadowRoot!.textContent).toContain('JSON');
    expect(btn(p, 'Import 1 image')).toBeUndefined();
  });

  it('does not take an image file on another kind tab', async () => {
    const el = await mount(backend([]), { kinds: ['icon'] });
    const p = await importText(el, file([{ id: 'a', name: 'A', data: { svg: SVG, view_box: '0 0 100 50' } }]));
    expect(p.shadowRoot!.textContent).toMatch(/Images/);
    expect(btn(p, 'Import 1 image')).toBeUndefined();
  });

  it('keeps going when one save fails and reports it', async () => {
    const be = backend([]);
    const real = be.callWS;
    let n = 0;
    const el = await mount({ ...be, callWS: async (m: Record<string, unknown>) => (m.type === 'magic_card_utils/images_save' && ++n === 1 ? Promise.reject(Object.assign(new Error('x'), { code: 'library_full' })) : real(m)) } as never);
    const p = await importText(el, file([{ id: 'a', name: 'A', data: { svg: SVG } }, { id: 'b', name: 'B', data: { svg: SVG } }]));
    btn(p, 'Import 2 images')!.click();
    await flush();
    expect(el.shadowRoot!.textContent).toContain('Imported 1 of 2');
    expect(el.shadowRoot!.textContent).toContain('library is full');
  });

  it('a click-through spy: nothing is fetched during import', async () => {
    const f = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const el = await mount(backend([]));
    await importText(el, file([{ id: 'a', name: 'A', data: { svg: SVG.replace('<path', '<image href="http://evil/x.png"/><path') } }]));
    expect(f).not.toHaveBeenCalled();
    f.mockRestore();
  });
});
