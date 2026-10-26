import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { ImageExt } from '../src/image-editor/chunk';
import { decodePicture, fitScale, matchShape, readAlign, turn, writeAlign, type Picture } from '../src/image-editor/reference';

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
const BOX = '<path id="a" data-name="Box" d="M100 50H300V150H100Z" fill="var(--mc-image-main)"/>';
const ONE = `<svg viewBox="0 0 400 300">${BOX}</svg>`;
const KEY = 'mc-image-reference:';

function wire(admin: boolean) {
  const calls: Array<{ type: string }> = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: { type: string; ids: string[]; image: { id: string; name: string; view_box: string } }) => {
      calls.push(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [{ id: 'pic', name: 'Pic', svg: ONE, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' }] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass, calls };
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
async function open(source: object = { kind: 'image-blank', width: 400, height: 300 }, admin = true) {
  const w = wire(admin);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, ...w, ext: el.img as unknown as ImageExt };
}
const $ = <T extends Element>(el: Ed, sel: string): T | null => el.renderRoot.querySelector<T>(sel);
const btn = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);
const pic = (w = 4000, h = 3000): Picture => ({ canvas: document.createElement('canvas'), w, h });
const file = (name: string, type: string, size = 100): File => {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: size });
  return f;
};
async function give(el: Ed, f: File): Promise<void> {
  const input = $<HTMLInputElement>(el, '#ref-file')!;
  Object.defineProperty(input, 'files', { value: [f], configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
async function choose(el: Ed, ext: ImageExt, f: File, p: Picture | (() => Promise<Picture>) = pic()): Promise<void> {
  ext.decode = typeof p === 'function' ? p : async () => p;
  btn(el, 'Reference picture')!.click();
  await settle(el);
  await give(el, f);
  await until(() => !!ext.ref || !!ext.msg);
  await settle(el);
}
const setNum = async (el: Ed, id: string, v: string): Promise<void> => {
  const i = $<HTMLInputElement>(el, `#${id}`)!;
  i.value = v;
  i.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(el);
};

const real = customElements.get.bind(customElements);
beforeEach(() => {
  localStorage.clear();
  __resetIconSourceForTests();
  __resetImageEditorForTests();
  vi.spyOn(customElements, 'get').mockImplementation((n: string) => (n === 'mc-color-picker' ? undefined : real(n)));
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Reference picture: choosing', () => {
  it('opens a panel from the top bar with a visible Choose button, and Escape closes it back to the button', async () => {
    const { el } = await open();
    btn(el, 'Reference picture')!.click();
    await settle(el);
    expect(btn(el, 'Choose a picture…')).toBeDefined();
    expect($<HTMLInputElement>(el, '#ref-file')!.accept).toContain('image/jpeg');
    expect(el.renderRoot.textContent).toContain('The picture is never saved.');
    $(el, '#ref-pick')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, composed: true }));
    await settle(el);
    expect($(el, '#ref-panel')).toBeNull();
    expect((el.renderRoot as ShadowRoot).activeElement?.id).toBe('ref-btn');
  });

  it('is not offered when the image is view-only', async () => {
    const { el } = await open({ kind: 'image', id: 'pic' }, false);
    expect(btn(el, 'Reference picture')).toBeUndefined();
  });

  it('refuses another kind of file before reading it', async () => {
    const { el, ext } = await open();
    const spy = vi.fn(async () => pic());
    await choose(el, ext, file('plan.pdf', 'application/pdf'), spy);
    expect(ext.ref).toBeUndefined();
    expect($(el, '[role=alert]')!.textContent).toContain('Choose a PNG, JPEG, WebP, GIF, AVIF or BMP picture.');
    expect(spy).not.toHaveBeenCalled();
  });

  it('refuses a file over 64 MB before reading it', async () => {
    const { el, ext } = await open();
    const spy = vi.fn(async () => pic());
    await choose(el, ext, file('big.png', 'image/png', 64 * 1024 * 1024 + 1), spy);
    expect(ext.ref).toBeUndefined();
    expect($(el, '[role=alert]')!.textContent).toContain('over 64 MB');
    expect(spy).not.toHaveBeenCalled();
  });

  it('says so when the browser cannot decode the picture', async () => {
    const { el, ext } = await open();
    btn(el, 'Reference picture')!.click();
    await settle(el);
    ext.decode = async () => {
      throw new Error('nope');
    };
    await give(el, file('a.png', 'image/png'));
    await until(() => !!ext.msg);
    await settle(el);
    expect($(el, '[role=alert]')!.textContent).toContain('This browser cannot open that picture. Save it as a JPEG and try again.');
  });

  it('shows the picture behind the canvas as the first thing in the stage, with the pill', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    const stage = $<HTMLElement>(el, '.stage')!;
    expect(stage.firstElementChild!.classList.contains('ref')).toBe(true);
    expect(stage.querySelector('.ref canvas')).toBe(ext.ref!.canvas);
    expect(stage.classList.contains('has-ref')).toBe(true);
    expect($(el, '.ref-pill')!.textContent).toContain('Reference picture on. Not saved.');
    expect(ext.align).toEqual({ x: 0, y: 0, s: 100, r: 0, o: 50 });
  });

  it('Hide in the pill hides the picture and Show brings it back', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    btn(el, 'Hide')!.click();
    await settle(el);
    expect($(el, '.ref')).toBeNull();
    expect($(el, '.ref-pill')).toBeNull();
    $<HTMLButtonElement>(el, '#ref-show')!.click();
    await settle(el);
    expect($(el, '.ref')).not.toBeNull();
  });

  it('Remove drops the picture and frees its memory', async () => {
    const { el, ext } = await open();
    const p = pic();
    p.canvas.width = 10;
    await choose(el, ext, file('plan.png', 'image/png'), p);
    btn(el, 'Remove picture')!.click();
    await settle(el);
    expect(ext.ref).toBeUndefined();
    expect($(el, '.ref')).toBeNull();
    expect(p.canvas.width).toBe(0);
  });

  it('frees the picture when the editor closes', async () => {
    const { el, ext } = await open();
    const p = pic();
    p.canvas.width = 10;
    await choose(el, ext, file('plan.png', 'image/png'), p);
    el.remove();
    expect(p.canvas.width).toBe(0);
  });
});

describe('Reference picture: large photos', () => {
  it('scales a photo with a side over 4096 down instead of refusing it', async () => {
    const draw = vi.fn();
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 8000, height: 6000, close })));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: draw } as unknown as RenderingContext);
    const p = await decodePicture(new Blob(['x']));
    expect(p.w).toBe(4096);
    expect(p.h).toBe(3072);
    expect(p.canvas.width).toBe(4096);
    expect(draw).toHaveBeenCalledWith(expect.anything(), 0, 0, 4096, 3072);
    expect(close).toHaveBeenCalled();
  });

  it('keeps a small photo at its own size', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn(async () => ({ width: 640, height: 480, close() {} })));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage() {} } as unknown as RenderingContext);
    const p = await decodePicture(new Blob(['x']));
    expect([p.w, p.h]).toEqual([640, 480]);
  });
});

describe('Reference picture: alignment', () => {
  it('numbers are validated and kept under the draft key until the first save', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    await setNum(el, 'ref-s', '150');
    await setNum(el, 'ref-x', '12,5');
    await setNum(el, 'ref-r', '700');
    expect(ext.align).toMatchObject({ s: 150, x: 12.5, r: -20 });
    expect(JSON.parse(localStorage.getItem(`${KEY}~draft`)!)).toEqual([12.5, 0, 150, -20, 50]);
    await setNum(el, 'ref-s', 'abc');
    expect(ext.align.s).toBe(150);
    await setNum(el, 'ref-s', '99999');
    expect(ext.align.s).toBe(1000);
  });

  it('moves the draft alignment to the image id on the first save', async () => {
    const { el, ext } = await open({ kind: 'image-svg', svg: ONE });
    ext.closeImport();
    await settle(el);
    await choose(el, ext, file('plan.png', 'image/png'));
    await setNum(el, 'ref-s', '150');
    btn(el, 'Save')!.click();
    await settle(el);
    const name = $<HTMLInputElement>(el, '#img-name')!;
    name.value = 'Ground floor';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(el);
    [...el.renderRoot.querySelectorAll<HTMLButtonElement>('mc-ui-window button')].find((b) => b.textContent!.trim() === 'Save')!.click();
    await until(() => !!ext.id);
    await settle(el);
    expect(localStorage.getItem(`${KEY}~draft`)).toBeNull();
    expect(JSON.parse(localStorage.getItem(`${KEY}ground-floor`)!)).toEqual([0, 0, 150, 0, 50]);
  });

  it('applies the last alignment when a picture is picked again and Reset alignment undoes it', async () => {
    writeAlign('pic', { x: 5, y: 6, s: 120, r: 90, o: 70 });
    const { el, ext } = await open({ kind: 'image', id: 'pic' });
    await choose(el, ext, file('plan.png', 'image/png'));
    expect(ext.align).toEqual({ x: 5, y: 6, s: 120, r: 90, o: 70 });
    expect(el.renderRoot.textContent).toContain('Your last alignment for this image was applied.');
    btn(el, 'Reset alignment')!.click();
    await settle(el);
    expect(ext.align).toEqual({ x: 0, y: 0, s: 100, r: 0, o: 50 });
    expect($(el, '.ref-panel')!.textContent).not.toContain('Your last alignment');
  });

  it('ignores a stored value that is not five finite numbers and clamps the rest', () => {
    localStorage.setItem(`${KEY}pic`, '[1,2,"x",4,5]');
    expect(readAlign('pic')).toBeUndefined();
    localStorage.setItem(`${KEY}pic`, '{"a":1}');
    expect(readAlign('pic')).toBeUndefined();
    localStorage.setItem(`${KEY}pic`, '[1,2,9999,400,500]');
    expect(readAlign('pic')).toEqual({ x: 1, y: 2, s: 1000, r: 40, o: 100 });
  });

  it('does not fail when storage is blocked', async () => {
    const { el, ext } = await open();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('full');
    });
    await choose(el, ext, file('plan.png', 'image/png'));
    await setNum(el, 'ref-s', '130');
    expect(ext.align.s).toBe(130);
  });

  it('turns by 90 in place, wrapping into -180..180', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    btn(el, 'Turn right 90')!.click();
    btn(el, 'Turn right 90')!.click();
    await settle(el);
    expect(ext.align.r).toBe(180);
    btn(el, 'Turn right 90')!.click();
    await settle(el);
    expect(ext.align.r).toBe(-90);
    btn(el, 'Turn left 90')!.click();
    await settle(el);
    expect(ext.align.r).toBe(180);
    expect(turn(-270)).toBe(90);
  });

  it('nudges with buttons and Fit to canvas centres it at the size that fits', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    btn(el, 'Move picture right')!.click();
    btn(el, 'Move picture down')!.click();
    await settle(el);
    expect(ext.align.x).toBeGreaterThan(0);
    expect(ext.align.y).toBeGreaterThan(0);
    await setNum(el, 'ref-r', '90');
    btn(el, 'Fit to canvas')!.click();
    await settle(el);
    expect(ext.align.x).toBe(0);
    expect(ext.align.y).toBe(0);
    expect(ext.align.s).toBe(fitScale(ext.ref!, el.doc.vb, 90));
    expect(ext.align.s).toBeLessThan(100);
  });

  it('the picture follows the canvas view', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'));
    const before = $<HTMLElement>(el, '.ref-pic')!.style.transform;
    el.view = { ...el.view, x: el.view.x + 40 };
    await settle(el);
    expect($<HTMLElement>(el, '.ref-pic')!.style.transform).not.toBe(before);
    expect(ext.ref).toBeDefined();
  });

  it('Match canvas shape opens Canvas size with the picture shape, not applied until Apply', async () => {
    const { el, ext } = await open();
    await choose(el, ext, file('plan.png', 'image/png'), pic(2000, 1000));
    const vb = { ...el.doc.vb };
    btn(el, 'Match canvas shape to this picture')!.click();
    await settle(el);
    expect(ext.size).toMatchObject({ preset: 'custom', w: '400', h: '200' });
    expect(el.doc.vb).toEqual(vb);
    expect(btn(el, 'Match reference picture')).toBeDefined();
    expect(matchShape(pic(2000, 1000), 90, { x: 0, y: 0, w: 400, h: 300 })).toEqual({ w: 200, h: 400 });
  });
});

describe('Reference picture: never saved', () => {
  it('leaves no blob:, data: or pixel data in the payload, the export, the document or storage', async () => {
    const urls = vi.spyOn(URL, 'createObjectURL');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const { el, ext, calls } = await open({ kind: 'image', id: 'pic' });
    await choose(el, ext, file('secret-plan.png', 'image/png'));
    await setNum(el, 'ref-s', '140');
    el.apply({ ...el.doc, name: 'Pic 2' }, 'Rename image', 'name');
    await settle(el);
    const toast = vi.spyOn(el, 'showToast');
    btn(el, 'Save')!.click();
    await until(() => calls.some((c) => c.type === 'magic_card_utils/images_save'));
    await settle(el);
    const save = JSON.stringify(calls.filter((c) => c.type === 'magic_card_utils/images_save'));
    expect(save).toContain('"svg"');
    const out = await new Response(ext.exportFile()!).text();
    const all = [save, out, JSON.stringify(el.doc), JSON.stringify(el.out), ...Object.values(localStorage)].join('\n');
    expect(all).not.toMatch(/blob:|data:|secret-plan|<image|base64/i);
    expect(JSON.stringify(calls)).not.toMatch(/blob:|data:|secret-plan|base64/i);
    expect(Object.keys(localStorage).sort()).toEqual([`${KEY}pic`]);
    expect(JSON.parse(localStorage.getItem(`${KEY}pic`)!)).toEqual([0, 0, 140, 0, 50]);
    expect(fetchSpy).not.toHaveBeenCalled();
    for (const c of urls.mock.calls) expect((c[0] as Blob).type).toBe('image/svg+xml');
    expect(toast.mock.calls[0][0]).toContain('The reference picture was not saved.');
  });

  it('a picture does not make the drawing changed since saved', async () => {
    const { el, ext } = await open({ kind: 'image', id: 'pic' });
    await choose(el, ext, file('plan.png', 'image/png'));
    await setNum(el, 'ref-s', '140');
    expect(el.dirty).toBe(false);
  });
});
