import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests, loadImageEditor } from '../src/svg-editor/image-loader';
import * as loader from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import { IMAGE_MAX_BYTES } from '../src/contracts/mcu-library-images';

vi.mock('../src/svg-editor/image-loader', async (orig) => {
  const m = await orig<typeof import('../src/svg-editor/image-loader')>();
  return { ...m, loadImageEditor: vi.fn(m.loadImageEditor) };
});

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 1400, height: 800, right: 1400, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 4000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const SVG =
  '<svg viewBox="0 0 1920 1080"><path id="a" data-name="Roof" d="M100 100H500V400H100Z" fill="var(--mc-image-main)"/><path id="b" data-name="Wall" d="M600 100H900V400H600Z" fill="var(--mc-image-accent)" stroke="var(--mc-image-main)" stroke-width="4"/></svg>';
const STORED = { id: 'ground-floor', name: 'Ground floor', svg: SVG, view_box: '0 0 1920 1080', bindings: [{ target: 'a', entity: 'light.kitchen', set: 'fill', rules: [{ state: 'on', value: 'main' }] }], created_at: 'c1', updated_at: 'u1' };
const summary = (m: any) => ({ id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' });

function wire(over: Partial<Record<string, (m: any) => unknown>> = {}, admin = true) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (over[m.type]) return over[m.type]!(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'ground-floor', name: 'Ground floor', view_box: '0 0 1920 1080', bytes: 1, bindings: 1, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'ground-floor' ? [STORED] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: summary(m) };
      return {};
    }),
  };
  return { hass, calls, saves: () => calls.filter((c) => c.type === 'magic_card_utils/images_save') };
}

async function open(source: object, hass: unknown, host = 'mcu'): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass, host });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await el.updateComplete;
  return el;
}
const qa = <T extends Element>(el: Ed, s: string): T[] => [...el.renderRoot.querySelectorAll<T>(s)];
const text = (el: Ed): string => el.renderRoot.textContent ?? '';
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const button = (el: Ed, label: string): HTMLButtonElement | undefined => qa<HTMLButtonElement>(el, 'button').find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);
const events = (el: Ed, name: string): any[] => {
  const got: any[] = [];
  el.addEventListener(name, (e) => got.push((e as CustomEvent).detail));
  return got;
};
const win = (el: Ed, label: string): HTMLButtonElement | undefined => qa<HTMLButtonElement>(el, 'mc-ui-window button').find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);
const type = (el: Ed, id: string, value: string): void => {
  const i = el.renderRoot.querySelector<HTMLInputElement>(`#${id}`)!;
  i.value = value;
  i.dispatchEvent(new Event('input', { bubbles: true }));
};

beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
  vi.mocked(loadImageEditor).mockClear();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('image editor: opening', () => {
  it('an icon source never loads the image-editor chunk', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'svg', svg: '<svg viewBox="0 0 24 24"><path d="M2 2H8V4H2Z"/></svg>' }, hass);
    expect(el.img).toBeUndefined();
    expect(loader.loadImageEditor).not.toHaveBeenCalled();
  });

  it('a blank image without a size opens the canvas size window; Cancel closes the editor', async () => {
    const { hass } = wire();
    const closed: any[] = [];
    const el = document.createElement('mc-svg-editor') as Ed;
    Object.assign(el, { source: { kind: 'image-blank' }, hass, host: 'mcu' });
    el.getBoundingClientRect = rect;
    el.addEventListener('mc-svg-close', (e) => closed.push((e as CustomEvent).detail));
    document.body.append(el);
    mounted.push(el);
    await until(() => el.stage === 'edit');
    await settle(el);
    expect(text(el)).toContain('Canvas size');
    expect(qa(el, 'mc-ui-window').length).toBe(1);
    expect(qa(el, 'mc-ui-window [role=radio][aria-checked=true]')[0].textContent).toContain('16:9');
    win(el, 'Cancel')!.click();
    expect(closed).toEqual([{ dirty: false }]);
  });

  it('Create makes the canvas from the preset: 1920 x 1080, grid 40, no safe area, no Dual-tone', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image-blank' }, hass);
    await settle(el);
    win(el, 'Create')!.click();
    await settle(el);
    expect(el.doc.vb).toEqual({ x: 0, y: 0, w: 1920, h: 1080 });
    expect(el.grid).toBe(40);
    expect(el.safe).toBe(false);
    expect(qa(el, 'mc-ui-window').length).toBe(0);
    expect(text(el)).not.toContain('Dual-tone');
    expect(text(el)).not.toContain('safe area');
    expect(button(el, 'Preview')).toBeUndefined();
    expect(el.renderRoot.querySelector('mc-path-canvas')!.getAttribute('aria-label')).toBe('Image canvas');
  });

  it('a given size skips the window; a custom size is checked with the reason in words', async () => {
    const { hass } = wire();
    const sized = await open({ kind: 'image-blank', width: 640, height: 480 }, hass);
    expect(sized.doc.vb).toMatchObject({ w: 640, h: 480 });
    expect(qa(sized, 'mc-ui-window').length).toBe(0);
    const el = await open({ kind: 'image-blank' }, hass);
    await settle(el);
    win(el, 'Custom')!.click();
    await settle(el);
    type(el, 'size-w', '10');
    await settle(el);
    expect(text(el)).toContain('Use a number from 16 to 4096.');
    expect(win(el, 'Create')!.getAttribute('aria-disabled')).toBe('true');
    type(el, 'size-w', '1000');
    await settle(el);
    expect(text(el)).not.toContain('Use a number from 16 to 4096.');
  });

  it('Escape closes the canvas size window and keeps the editor; Apply changes the canvas and the grid', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image-blank', width: 640, height: 480 }, hass);
    button(el, 'Canvas size')!.click();
    await settle(el);
    expect(qa(el, 'mc-ui-window').length).toBe(1);
    el.renderRoot.querySelector('.layer')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle(el);
    expect(qa(el, 'mc-ui-window').length).toBe(0);
    expect(el.stage).toBe('edit');
    button(el, 'Canvas size')!.click();
    await settle(el);
    win(el, '1:1 · 1024 x 1024')!.click();
    await settle(el);
    win(el, 'Apply')!.click();
    await settle(el);
    expect(el.doc.vb).toMatchObject({ w: 1024, h: 1024 });
    expect(el.grid).toBe(20);
    expect(qa(el, 'mc-ui-window').length).toBe(0);
  });

  it('warns before cutting off layers and applies on the second press', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    button(el, 'Canvas size')!.click();
    await settle(el);
    el.renderRoot.querySelector<HTMLButtonElement>('#size-keep')!.click();
    await settle(el);
    type(el, 'size-w', '300');
    type(el, 'size-h', '300');
    await settle(el);
    win(el, 'Apply')!.click();
    await settle(el);
    expect(text(el)).toContain('2 layers sit outside the new canvas. They are kept but will be cut off.');
    expect(el.doc.vb.w).toBe(1920);
    win(el, 'Apply anyway')!.click();
    await settle(el);
    expect(el.doc.vb).toMatchObject({ w: 300, h: 300 });
    expect(el.doc.shapes).toHaveLength(2);
  });

  it('keeps the ratio while typing a width', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image-blank' }, hass);
    await settle(el);
    win(el, 'Custom')!.click();
    await settle(el);
    type(el, 'size-w', '960');
    await settle(el);
    expect(el.renderRoot.querySelector<HTMLInputElement>('#size-h')!.value).toBe('540');
  });

  it('a library image opens with its name, ids and size; the meter shows words', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    expect(el.doc.name).toBe('Ground floor');
    expect(el.doc.shapes.map((s) => [s.id, s.name, s.fill, s.stroke])).toEqual([['a', 'Roof', 'main', 'none'], ['b', 'Wall', 'accent', 'main']]);
    expect(el.doc.vb).toMatchObject({ w: 1920, h: 1080 });
    const m = el.renderRoot.querySelector('[role=meter]')!;
    expect(m.getAttribute('aria-valuetext')).toMatch(/of 256 KiB, fine$/);
    expect(text(el)).toMatch(/Image size: \d+ KiB of 256 KiB\. Fine\./);
    expect(text(el)).toContain('Includes connections.');
  });

  it('a missing library image says so, with Try again', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'gone' }, hass);
    expect(el.stage).toBe('fail');
    expect(text(el)).toContain('This image is no longer in the library.');
  });

  it('a file opened as an image keeps its shapes and says what was left out', async () => {
    const { hass } = wire();
    const svg = '<svg viewBox="0 0 100 50"><switch/><path d="M0 0H40V40Z" fill="currentColor"/></svg>';
    const el = await open({ kind: 'image-svg', svg }, hass);
    expect(el.stage).toBe('edit');
    expect(el.doc.shapes.length).toBe(1);
    expect(text(el)).toContain('Removed other parts an image cannot use.');
    expect(text(el)).toContain('cannot be edited yet');
  });

  it('a file that is only a script has nothing to draw and is refused with a reason', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image-svg', svg: '<svg viewBox="0 0 100 50"><script>alert(1)</script></svg>' }, hass);
    expect(el.stage).toBe('fail');
    expect(text(el)).toContain('That file has no shapes an image can use.');
  });
});

describe('image editor: saving', () => {
  it('Save sends the stored id, the version it opened, the layer ids and names, and fires mc-svg-save', async () => {
    const { hass, saves } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    const got = events(el, 'mc-svg-save');
    el.apply({ ...el.doc, name: 'Ground floor renamed' }, 'Rename image', 'name');
    await settle(el);
    button(el, 'Save')!.click();
    await until(() => saves().length === 1);
    await settle(el);
    const m = saves()[0];
    expect(m.image.id).toBe('ground-floor');
    expect(m.image.name).toBe('Ground floor renamed');
    expect(m.base_updated_at).toBe('u1');
    expect(m.image.svg).toContain('id="a"');
    expect(m.image.svg).toContain('data-name="Roof"');
    expect(m.image.svg).toContain('fill="var(--mc-image-main)"');
    expect(m.image.svg).toContain('fill="var(--mc-image-accent)"');
    expect(m.image.view_box).toBe('0 0 1920 1080');
    expect(m.image.bindings).toEqual(STORED.bindings);
    expect(got).toHaveLength(1);
    expect(got[0].target).toBe('image-library');
    expect(got[0].saved.id).toBe('ground-floor');
    expect(el.stage).toBe('edit');
    expect(el.dirty).toBe(false);
    // the second save is against the version the first one returned, with the same id
    el.apply({ ...el.doc, shapes: el.doc.shapes.slice(0, 1) }, 'Delete', undefined);
    await settle(el);
    button(el, 'Save')!.click();
    await until(() => saves().length === 2);
    expect(saves()[1].image.id).toBe('ground-floor');
    expect(saves()[1].base_updated_at).toBe('u2');
  });

  it('a first save asks for the name, shows the address and takes a free id', async () => {
    const { hass, saves } = wire();
    const el = await open({ kind: 'image-blank', width: 640, height: 480 }, hass);
    el.apply({ ...el.doc, shapes: [{ ...(await openShape(el)) }] }, 'Add');
    await settle(el);
    button(el, 'Save')!.click();
    await settle(el);
    expect(text(el)).toContain('Name is the only thing you need.');
    type(el, 'img-name', 'Ground floor');
    await settle(el);
    expect(text(el)).toContain('mcu-image:ground-floor-2');
    expect(text(el)).toContain('It cannot be changed later.');
    const got = events(el, 'mc-svg-save');
    win(el, 'Save')!.click();
    await until(() => saves().length === 1);
    expect(saves()[0].image.id).toBe('ground-floor-2');
    expect('base_updated_at' in saves()[0]).toBe(false);
    expect('bindings' in saves()[0].image).toBe(false);
    await settle(el);
    expect(got[0].target).toBe('image-library');
    expect(qa(el, 'mc-ui-window').length).toBe(0);
  });

  it('Save as a copy takes a new name and id and goes on with the copy', async () => {
    const { hass, saves } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    el.img!.pick('copy');
    await settle(el);
    expect(el.renderRoot.querySelector<HTMLInputElement>('#img-name')!.value).toBe('Ground floor copy');
    win(el, 'Save')!.click();
    await until(() => saves().length === 1);
    await settle(el);
    expect(saves()[0].image.id).toBe('ground-floor-copy');
    expect('base_updated_at' in saves()[0]).toBe(false);
    expect((el.img as unknown as { id: string }).id).toBe('ground-floor-copy');
    expect(el.doc.name).toBe('Ground floor copy');
  });

  it('Duplicate saves the stored version under a new id and opens the copy', async () => {
    const { hass, saves } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    el.img!.pick('duplicate');
    await settle(el);
    win(el, 'Duplicate')!.click();
    await until(() => saves().length === 1);
    await settle(el);
    expect(saves()[0].image.id).toBe('ground-floor-copy');
    expect(saves()[0].image.bindings).toEqual(STORED.bindings);
    expect((el.img as unknown as { id: string }).id).toBe('ground-floor-copy');
    expect(el.dirty).toBe(false);
  });

  it('refuses over 256 KiB with the size in words and offers the way out', async () => {
    const { hass } = wire({ 'magic_card_utils/images_save': () => Promise.reject({ code: 'invalid_format', errors: [{ path: 'svg', message: 'too_large', bytes: 300000, limit: IMAGE_MAX_BYTES }] }) });
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    button(el, 'Save')!.click();
    await until(() => text(el).includes('Image size: 293 KiB of 256 KiB. Too big to save.'));
    expect(text(el)).toContain('Select the biggest layer');
  });

  it('names the 200 image limit before sending a new image', async () => {
    const full = Array.from({ length: 200 }, (_, i) => ({ id: `i${i}`, name: `I${i}`, view_box: '0 0 1 1', bytes: 1, bindings: 0, updated_at: 'u' }));
    const { hass, saves } = wire({ 'magic_card_utils/images_list': () => ({ images: full }) });
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    el.img!.pick('copy');
    await settle(el);
    win(el, 'Save')!.click();
    await until(() => text(el).includes('The library is full (200 images)'));
    expect(saves()).toHaveLength(0);
  });

  it('a conflict offers Save as a copy and Reload and keeps the work', async () => {
    const { hass } = wire({ 'magic_card_utils/images_save': () => Promise.reject({ code: 'conflict' }) });
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    button(el, 'Save')!.click();
    await until(() => text(el).includes('This image was changed somewhere else.'));
    expect(button(el, 'Save as a copy')).toBeTruthy();
    expect(button(el, 'Reload')).toBeTruthy();
    expect(el.doc.shapes).toHaveLength(2);
  });

  it('unauthorized turns the editor to view-only and keeps the drawing', async () => {
    const { hass } = wire({ 'magic_card_utils/images_save': () => Promise.reject({ code: 'unauthorized' }) });
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    button(el, 'Save')!.click();
    await until(() => !!el.img?.readOnly);
    await settle(el);
    expect(text(el)).toContain('You can look at this image but not change it. Ask an administrator.');
    expect(el.doc.shapes).toHaveLength(2);
  });
});

async function openShape(el: Ed) {
  const { newShape } = await import('../src/svg-editor/model');
  return newShape('path', [{ anchors: [{ x: 10, y: 10 }, { x: 100, y: 10 }, { x: 100, y: 100 }], closed: true }], { name: 'Tri' });
}

describe('image editor: size meter', () => {
  it('prints a sentence for every level and announces a crossing once', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    const x = el.img as unknown as { sentence(b: number): string; word(l: string): string; changed(o: any): void };
    expect(x.sentence(84 * 1024)).toBe('Image size: 84 KiB of 256 KiB. Fine.');
    expect(x.sentence(150 * 1024)).toBe('Image size: 150 KiB of 256 KiB. Getting big. Large images can be slow on wall tablets.');
    expect(x.sentence(240 * 1024)).toBe('Image size: 240 KiB of 256 KiB. Nearly full. You can add a little more.');
    expect(x.sentence(312 * 1024)).toBe('Image size: 312 KiB of 256 KiB. Too big to save.');
    const say = vi.spyOn(el, 'say');
    x.changed({ bytes: 100 * 1024 });
    x.changed({ bytes: 110 * 1024 });
    expect(say).toHaveBeenCalledTimes(1);
    x.changed({ bytes: 230 * 1024 });
    expect(say).toHaveBeenCalledTimes(2);
  });

  it('What is KiB? is a disclosure button', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    const b = button(el, 'What is KiB?')!;
    expect(b.getAttribute('aria-expanded')).toBe('false');
    b.click();
    await settle(el);
    expect(text(el)).toContain('KiB is a kibibyte');
  });
});

describe('image editor: view-only', () => {
  it('a non-administrator gets the viewer: no Save, Rename, Delete or Canvas size in the tab order', async () => {
    const { hass } = wire({}, false);
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    expect(el.img!.readOnly).toBe(true);
    expect(text(el)).toContain('You can look at this image but not change it. Ask an administrator.');
    const names = qa<HTMLElement>(el, 'button, input, textarea, select, [tabindex="0"]').map((b) => (b.textContent || b.getAttribute('aria-label') || '').trim());
    for (const bad of ['Save', 'Canvas size', 'Delete', 'Rename', 'Reference picture', 'Undo']) expect(names).not.toContain(bad);
    expect(qa(el, 'input[type=text]').length).toBe(0);
    expect(button(el, 'Close')).toBeTruthy();
    expect(button(el, 'Export file')).toBeTruthy();
    // a layer can be read, not changed
    button(el, 'Roof')!.click();
    await settle(el);
    expect(text(el)).toContain('Fill: Main');
    el.apply({ ...el.doc, shapes: [] }, 'Delete');
    expect(el.doc.shapes).toHaveLength(2);
  });

  it('without Magic Card Utils it says how to get it', async () => {
    const { hass } = wire();
    const e2 = document.createElement('mc-svg-editor') as Ed;
    Object.assign(e2, { source: { kind: 'image', id: 'ground-floor' }, hass, host: 'card', libraryAvailable: false });
    e2.getBoundingClientRect = rect;
    document.body.append(e2);
    mounted.push(e2);
    await until(() => e2.stage !== 'loading');
    await settle(e2);
    expect(text(e2)).toContain('Images need Magic Card Utils. It is installed through HACS, like Magic Card.');
  });
});

describe('image editor: dragging', () => {
  it('moved layers carry will-change: transform until the gesture ends', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    el.select(['a']);
    await settle(el);
    const art = (): string[] => qa<SVGPathElement>(el, 'svg.art path').map((p) => p.getAttribute('style') ?? '');
    expect(art().some((s) => s.includes('will-change'))).toBe(false);
    const paths = el.flat.paths.map((p, i) => (el.flat.map[i].sid === 'a' ? { ...p, anchors: p.anchors.map((a) => ({ ...a, x: a.x + 5 })) } : p));
    el.onChange(new CustomEvent('mc-path-change', { detail: { paths, commit: false, label: 'Move' } }));
    await settle(el);
    const moving = art();
    expect(moving[0]).toContain('will-change:transform');
    expect(moving[1]).not.toContain('will-change');
    el.onChange(new CustomEvent('mc-path-change', { detail: { paths, commit: true, label: 'Move' } }));
    await settle(el);
    expect(art().some((s) => s.includes('will-change'))).toBe(false);
  });

  it('a nudge burst marks the layer for a moment', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'image', id: 'ground-floor' }, hass);
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      el.select(['a']);
      el.nudge(1, 0);
      expect(el.moving.has('a')).toBe(true);
      vi.advanceTimersByTime(400);
      expect(el.moving.size).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('icon sources never set it', async () => {
    const { hass } = wire();
    const el = await open({ kind: 'svg', svg: '<svg viewBox="0 0 24 24"><path d="M2 2H8V4H2Z"/></svg>' }, hass);
    el.select([el.doc.shapes[0].id]);
    el.onChange(new CustomEvent('mc-path-change', { detail: { paths: el.flat.paths, commit: false, label: 'Move' } }));
    expect(el.moving.size).toBe(0);
  });
});
