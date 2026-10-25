import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { ImageExt } from '../src/image-editor/chunk';
import { removedKinds } from '../src/image-editor/importer';

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
const ONE = '<svg viewBox="0 0 400 300"><path id="a" data-name="Box" d="M100 50H300V150H100Z" fill="var(--mc-image-main)"/></svg>';
const FLOOR = '<svg viewBox="0 0 800 600"><script>alert(1)</script><rect id="r" x="10" y="10" width="200" height="100" onclick="x()" onload="y()" fill="red"/><path d="M0 0H50V50Z"/></svg>';
const CLEAN = '<svg viewBox="0 0 800 600"><rect x="10" y="10" width="200" height="100" fill="#ff0000"/></svg>';

async function open(source: object, admin = true) {
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: { type: string; ids: string[]; image: { id: string; name: string; view_box: string } }) => (m.type === 'magic_card_utils/images_list' ? { images: [] } : {})),
  };
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, ext: el.img as unknown as ImageExt };
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const $ = <T extends Element>(el: Ed, sel: string): T | null => el.renderRoot.querySelector<T>(sel);
const win = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('mc-ui-window button')].find((b) => b.textContent!.trim() === label);
async function give(el: Ed, name: string, text: string, type = 'image/svg+xml', size?: number): Promise<void> {
  const f = new File([text], name, { type });
  if (size !== undefined) Object.defineProperty(f, 'size', { value: size });
  const input = $<HTMLInputElement>(el, '#img-import')!;
  Object.defineProperty(input, 'files', { value: [f], configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await until(() => !!(el.img as unknown as ImageExt).imp);
  await settle(el);
}

const real = customElements.get.bind(customElements);
beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
  vi.spyOn(customElements, 'get').mockImplementation((n: string) => (n === 'mc-color-picker' ? undefined : real(n)));
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('Import an SVG file', () => {
  it('is in the More menu and opens the file picker', async () => {
    const { el, ext } = await open({ kind: 'image-blank', width: 400, height: 300 });
    expect(ext.menuItems().map((m) => m.label)).toContain('Import an SVG file…');
    const input = $<HTMLInputElement>(el, '#img-import')!;
    expect(input.accept).toContain('.svg');
    const click = vi.spyOn(input, 'click');
    ext.pick('import');
    expect(click).toHaveBeenCalled();
  });

  it('lists what was removed, keeps the rest and Continue closes the summary', async () => {
    const { el, ext } = await open({ kind: 'image-blank', width: 400, height: 300 });
    await give(el, 'floor.svg', FLOOR);
    expect(el.doc.shapes).toHaveLength(2);
    expect(el.doc.vb).toMatchObject({ w: 800, h: 600 });
    const w = $<HTMLElement>(el, 'mc-ui-window')!;
    expect(w.getAttribute('heading')).toBe("Imported 'floor.svg'");
    expect(w.textContent).toContain('Removed scripts, event handlers.');
    win(el, 'Continue')!.click();
    await settle(el);
    expect(ext.imp).toBeUndefined();
    expect($(el, 'mc-ui-window')).toBeNull();
  });

  it('says nothing was removed for a clean file', async () => {
    const { el } = await open({ kind: 'image-blank', width: 400, height: 300 });
    await give(el, 'clean.svg', CLEAN);
    expect($(el, 'mc-ui-window')!.textContent).toContain('Nothing was removed.');
  });

  it('is one undo step', async () => {
    const { el } = await open({ kind: 'image-svg', svg: ONE });
    (el.img as unknown as ImageExt).closeImport();
    await give(el, 'clean.svg', CLEAN);
    expect(el.doc.vb.w).toBe(800);
    el.undo();
    await settle(el);
    expect(el.doc.vb.w).toBe(400);
    expect(el.doc.shapes[0].name).toBe('Box');
  });

  it('refuses a file with nothing drawable: an alert, no Continue, a way to choose another', async () => {
    const { el } = await open({ kind: 'image-blank', width: 400, height: 300 });
    await give(el, 'bad.svg', '<svg viewBox="0 0 10 10"><script>alert(1)</script></svg>');
    const w = $<HTMLElement>(el, 'mc-ui-window')!;
    expect(w.getAttribute('variant')).toBe('alert');
    expect(w.querySelector('[role=alert]')!.textContent).toContain('That file has no shapes an image can use.');
    expect(win(el, 'Continue')).toBeUndefined();
    const input = $<HTMLInputElement>(el, '#img-import')!;
    const click = vi.spyOn(input, 'click');
    win(el, 'Choose another file')!.click();
    expect(click).toHaveBeenCalled();
    expect(el.doc.shapes).toHaveLength(0);
  });

  it('checks the name and size before reading the file', async () => {
    const { el } = await open({ kind: 'image-blank', width: 400, height: 300 });
    const read = vi.spyOn(File.prototype, 'text');
    await give(el, 'photo.png', 'x', 'image/png');
    expect($(el, 'mc-ui-window')!.textContent).toContain('Choose an SVG file.');
    win(el, 'Close')!.click();
    await settle(el);
    await give(el, 'huge.svg', CLEAN, 'image/svg+xml', 9 * 1024 * 1024);
    expect($(el, 'mc-ui-window')!.textContent).toContain('over 8 MB');
    expect(read).not.toHaveBeenCalled();
  });

  it('a file opened as a new image shows the same summary', async () => {
    const { el } = await open({ kind: 'image-svg', svg: FLOOR });
    expect(el.stage).toBe('edit');
    const w = $<HTMLElement>(el, 'mc-ui-window')!;
    expect(w.textContent).toContain('Removed scripts, event handlers.');
    expect(w.querySelector('button')).not.toBeNull();
  });

  it('words for the removed parts', () => {
    expect(removedKinds(['script', 'rect@onclick', 'a@href', 'image', 'switch', 'rect@onload'])).toEqual(['scripts', 'event handlers', 'links to another site', 'embedded pictures', 'other parts an image cannot use']);
  });
});
