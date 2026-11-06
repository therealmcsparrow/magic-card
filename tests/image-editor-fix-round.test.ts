import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { ImageExt } from '../src/image-editor/chunk';
import { ImageError } from '../src/image-editor/library';
import { imageStyles } from '../src/image-editor/styles';
import { TEXT_FILL, TEXT_OUTLINE, newText } from '../src/image-editor/text-ui';
import { MCU_PREVIEW_MAIN } from '../src/contracts/svg-editor';

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
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const svg = (inner: string): string => `<svg viewBox="0 0 400 300">${inner}</svg>`;
const CLIP = '<defs><clipPath id="c"><rect x="0" y="0" width="50" height="50"/></clipPath></defs>';
const A = '<path id="a" data-name="First" d="M0 0H100V100H0Z" fill="#ff0000"/>';
const B = '<path id="b" data-name="Last" d="M200 0H300V100H200Z" fill="#00ff00"/>';
const WIN = '<rect id="win" x="10" y="10" width="80" height="80" fill="#0000ff" clip-path="url(#c)"/>';
const WITH_PART = svg(`${CLIP}${A}${WIN}${B}`);
const item = (s: string) => ({ id: 'pic', name: 'Pic', svg: s, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' });

function wire(markup: string, over: Record<string, (m: any) => unknown> = {}) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: true },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (over[m.type]) return over[m.type](m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'pic', name: 'Pic', view_box: '0 0 400 300', bytes: 1, bindings: 0, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [item(markup)] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass, saves: () => calls.filter((c) => c.type === 'magic_card_utils/images_save') };
}

async function mount(source: object, markup = '', over: Record<string, (m: any) => unknown> = {}) {
  const w = wire(markup, over);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, ext: el.img as unknown as ImageExt, saves: w.saves };
}
const open = (markup: string, over: Record<string, (m: any) => unknown> = {}) => mount({ kind: 'image', id: 'pic' }, markup, over);
const blank = () => mount({ kind: 'image-blank', width: 400, height: 300 });
const text = (el: Ed): string => el.renderRoot.textContent ?? '';
const live = (el: Ed): string => String((el as unknown as { live: string }).live ?? '');
const win = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('mc-ui-window button')].find((b) => b.textContent!.trim() === label);
const noteText = (el: Ed): string => (el.note?.lines ?? []).join(' ');

beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('imported parts: Unlock', () => {
  it('names the reason on the layer button instead of a pressed Unlock, and says it when pressed, with no undo step', async () => {
    const { el } = await open(WITH_PART);
    const row = el.renderRoot.querySelector('[role=treeitem][data-id="win"]')!;
    const lock = row.querySelector<HTMLButtonElement>('button[aria-label*="stays locked"]')!;
    expect(lock).toBeTruthy();
    expect(lock.hasAttribute('aria-pressed')).toBe(false);
    expect(row.querySelector('button[aria-label^="Unlock"]')).toBeNull();
    // an ordinary layer keeps its Lock button
    expect(el.renderRoot.querySelector('[role=treeitem][data-id="a"] button[aria-label^="Lock"]')).toBeTruthy();
    const before = el.doc;
    const canUndo = el.hist?.canUndo;
    lock.click();
    await until(() => live(el).includes('stays locked'));
    expect(live(el)).toContain('Imported part stays locked: imported parts cannot be edited.');
    expect(el.doc).toBe(before);
    expect(el.hist?.canUndo).toBe(canUndo);
  });

  it('describes the Locked switch in the inspector with the reason, and pressing it changes nothing', async () => {
    const { el } = await open(WITH_PART);
    el.select(['win']);
    await settle(el);
    const sw = el.renderRoot.querySelector<HTMLButtonElement>('#sw-locked')!;
    const help = el.renderRoot.querySelector(`#${sw.getAttribute('aria-describedby')}`)!;
    expect(help.textContent).toContain('stays locked');
    const before = el.doc;
    sw.click();
    await settle(el);
    expect(el.doc).toBe(before);
    await until(() => live(el).includes('stays locked'));
    el.select(['a']);
    await settle(el);
    expect(el.renderRoot.querySelector('#sw-locked')!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('leaves a part out of an unlock of several layers, says so, and writes one step for the others', async () => {
    const { el } = await open(WITH_PART);
    el.apply({ ...el.doc, shapes: el.doc.shapes.map((s) => (s.id === 'a' ? { ...s, locked: true } : s)) }, 'Lock');
    el.select(['a', 'win']);
    el.patch({ locked: false }, 'Lock');
    await settle(el);
    expect(el.doc.shapes.find((s) => s.id === 'a')!.locked).toBe(false);
    expect(el.doc.shapes.find((s) => s.id === 'win')!.locked).toBe(true);
    await until(() => live(el).includes('stays locked'));
  });
});

describe('imported parts: the size limit counts the last part', () => {
  const BIG = `<defs><mask id="m">${'<rect x="1" y="1" width="2" height="2" fill="#fff"/>'.repeat(2400)}</mask></defs>`;
  const many = (n: number) => svg(`${BIG}${Array.from({ length: n }, (_, i) => `<path id="p${i}" d="M0 0H10V10Z"/><rect id="w${i}" width="5" height="5" mask="url(#m)"/>`).join('')}`);

  it('opens view-only when the fifth part is the one that goes over twice the size of an image', async () => {
    const four = await open(many(4));
    expect(four.ext.readOnly).toBe(false);
    expect(four.el.doc.shapes.filter((s) => !!(s.look as any)?.part)).toHaveLength(4);
    const five = await open(many(5));
    expect(five.ext.readOnly).toBe(true);
  });
});

describe('imported parts: long ids on the canvas', () => {
  it('keeps every url(#id) of a part pointing at an id that is drawn, also for the longest ids', async () => {
    const id = `c${'x'.repeat(63)}`;
    const { el } = await open(svg(`<defs><clipPath id="${id}"><rect width="50" height="50"/></clipPath></defs>${A}<rect id="win" width="80" height="80" clip-path="url(#${id})"/>${B}`));
    const art = el.renderRoot.querySelector('svg.art')!;
    const html = [...art.querySelectorAll('g[style*="--mc-image-main"]')].map((g) => g.innerHTML).join('');
    const refs = [...html.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThan(0);
    for (const r of refs) expect(art.querySelector(`[id="${r}"]`), r).toBeTruthy();
    for (const e of art.querySelectorAll('g[style*="--mc-image-main"] [id]')) expect(e.id.length).toBeLessThanOrEqual(64);
  });
});

describe('save: text the library refuses', () => {
  it('stops before Save, selects the layer and names the word', async () => {
    const { el, ext, saves } = await open(svg(A));
    const t = newText(ext, undefined, 'visit javascript:alert');
    el.addShape(t);
    await settle(el);
    ext.save();
    await settle(el);
    expect(saves()).toHaveLength(0);
    expect(ext.details).toBeUndefined();
    expect(noteText(el)).toContain('"javascript:"');
    expect(noteText(el)).toContain('Change it, then save again.');
    expect(el.sel).toEqual([t.id]);
    expect(el.renderRoot.querySelector('.result [role=alert]')!.textContent).toContain('"javascript:"');
  });

  it('checks layer names too, and words split by a line break are not hidden', async () => {
    const { el, ext, saves } = await open(svg(A));
    el.apply({ ...el.doc, shapes: el.doc.shapes.map((s) => ({ ...s, name: 'x EXPRESSION(1)' })) }, 'Rename');
    await settle(el);
    ext.save();
    await settle(el);
    expect(saves()).toHaveLength(0);
    expect(noteText(el)).toContain('"expression("');
    el.apply({ ...el.doc, shapes: el.doc.shapes.map((s) => ({ ...s, name: 'java\nscript:' })) }, 'Rename');
    ext.save();
    await settle(el);
    expect(saves()).toHaveLength(0);
  });

  it('keeps Save as a copy from starting with such text, with the reason in the menu', async () => {
    const { el, ext } = await open(svg(A));
    el.addShape(newText(ext, undefined, 'vbscript:x'));
    await settle(el);
    const copy = ext.menuItems().find((m) => m.id === 'img:copy')!;
    expect(copy.reason).toContain('"vbscript:"');
  });

  it('lets ordinary words through', async () => {
    const { el, ext, saves } = await open(svg(A));
    el.addShape(newText(ext, undefined, 'Kitchen'));
    await settle(el);
    ext.save();
    await until(() => saves().length === 1);
  });
});

describe('save: the message names the cause', () => {
  const reject = (e: unknown) => ({ 'magic_card_utils/images_save': () => Promise.reject(e) });

  it('the library refused a word', async () => {
    const { ext } = await open(svg(A), reject({ code: 'invalid_format', errors: [{ path: 'svg', message: 'forbidden_text', word: 'vbscript:' }] }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).includes('vbscript:'));
    expect(noteText(el)).toContain('Change it, then save again.');
    expect(noteText(el)).not.toContain('Tidy it');
  });

  it('the library refused the markup with its own reason', async () => {
    const { ext } = await open(svg(A), reject({ code: 'invalid_format', errors: [{ path: 'svg', message: 'Too many elements (at most 5000)' }] }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).includes('Too many elements'));
    expect(noteText(el)).toContain('The library refused this image: Too many elements (at most 5000)');
    expect(noteText(el)).not.toContain('Tidy it');
  });

  it('the library refused without a reason', async () => {
    const { ext } = await open(svg(A), reject({ code: 'invalid_format' }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).includes('Export file'));
    expect(noteText(el)).not.toContain('Tidy it');
  });

  it('the library is full', async () => {
    const { ext } = await open(svg(A), reject({ code: 'library_full' }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => noteText(el).includes('library is full'));
  });

  it('too big says how big, in the Too big window and in the words of a toast', async () => {
    const { ext } = await open(svg(A), reject({ code: 'invalid_format', errors: [{ path: 'svg', message: 'too_large', bytes: 300000, limit: 262144 }] }));
    const el = ext.shell as unknown as Ed;
    ext.save();
    await until(() => text(el).includes('293 KiB of 256 KiB'));
    expect((ext as any).problemText(new ImageError('too_large', 300000))).toBe('Too big to save: 293 KiB of 256 KiB.');
  });

  it('shows a refusal inside the Save window, which stays open', async () => {
    const { el, ext } = await blank();
    el.addShape(newText(ext, undefined, 'Hall'));
    await settle(el);
    const forbidden = { 'magic_card_utils/images_save': () => Promise.reject({ code: 'invalid_format', errors: [{ path: 'svg', message: 'Event, style and link attributes are not allowed' }] }) };
    const hass = (el as any).hass;
    hass.callWS.mockImplementation(async (m: any) => (m.type === 'magic_card_utils/images_save' ? forbidden[m.type]() : m.type === 'magic_card_utils/images_list' ? { images: [] } : {}));
    ext.save();
    await settle(el);
    const field = el.renderRoot.querySelector<HTMLInputElement>('#img-name')!;
    field.value = 'Hall';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await settle(el);
    win(el, 'Save')!.click();
    await until(() => !!ext.details?.fault);
    await settle(el);
    expect(el.renderRoot.querySelector('mc-ui-window [role=alert]')!.textContent).toContain('The library refused this image: Event, style and link attributes are not allowed');
    expect(ext.details).toBeTruthy();
  });
});

describe('Canvas size', () => {
  it('Create hands focus to the canvas', async () => {
    const { el } = await mount({ kind: 'image-blank' });
    win(el, 'Create')!.click();
    await settle(el);
    expect(el.renderRoot.querySelector('mc-ui-window')).toBeNull();
    expect((el.renderRoot as ShadowRoot).activeElement?.localName).toBe('mc-path-canvas');
  });
});

describe('colours', () => {
  const lum = (hex: string): number => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const contrast = (a: string, b: string): number => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const mix = (a: number[], b: number[], share: number): string => '#' + a.map((v, i) => Math.round(v * share + b[i] * (1 - share)).toString(16).padStart(2, '0')).join('');

  it('the Too big line takes the error ink, which holds 4.5:1 on a dark and a light editor', () => {
    const css = imageStyles.cssText;
    expect(css).toMatch(/\.img-meter\.is-over \.sentence \{[^}]*color: var\(--mc-error-ink/);
    const error = [0xdb, 0x44, 0x37];
    // --mc-error-ink is 75 % of the error colour mixed with the theme text colour
    expect(contrast(mix(error, [0xe1, 0xe1, 0xe1], 0.75), '#111111')).toBeGreaterThanOrEqual(4.5);
    expect(contrast(mix(error, [0x21, 0x21, 0x21], 0.75), '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('a new text layer reads against the default fill, its own outline and a bare light board', async () => {
    expect(contrast(TEXT_FILL, MCU_PREVIEW_MAIN)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(TEXT_FILL, TEXT_OUTLINE)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(TEXT_OUTLINE, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    const { el, ext } = await blank();
    const t = newText(ext);
    expect(t.fill).toBe('main');
    expect(t.stroke).toBe('main');
    expect(t.look).toMatchObject({ fill: TEXT_FILL, stroke: TEXT_OUTLINE });
    el.addShape(t);
    await settle(el);
    const node = el.renderRoot.querySelector('svg.art text')!;
    expect(node.getAttribute('style')).toContain('fill:#ffffff');
  });
});

describe('layout: nothing moves the canvas', () => {
  it('the Rectangle options float over the stage, so choosing the tool leaves the column as it was', async () => {
    const { el } = await blank();
    el.setTool('select');
    await settle(el);
    const shape = () => [...el.renderRoot.querySelector('.center')!.children].map((c) => c.className);
    const before = shape();
    el.setTool('rect');
    await settle(el);
    expect(el.renderRoot.querySelector('.center > .opts')).toBeNull();
    expect(el.renderRoot.querySelector('.stagebox > .opts')!.textContent).toContain('Corner radius');
    expect(shape()).toEqual(before);
    expect(imageStyles.cssText + (el.constructor as any).elementStyles.map((s: any) => s.cssText).join('')).toMatch(/\.stagebox > \.opts \{[^}]*position: absolute/);
  });

  it('a dragged rectangle lands where it was dragged', async () => {
    const { el } = await blank();
    el.snapOn = false;
    el.setTool('rect');
    await settle(el);
    const stage = el.renderRoot.querySelector('.stage')!;
    const ev = (type: string, x: number, y: number) => stage.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, pointerId: 1, bubbles: true, composed: true, cancelable: true, button: 0 }));
    const a = el.point({ clientX: 300, clientY: 200 });
    const b = el.point({ clientX: 500, clientY: 350 });
    ev('pointerdown', 300, 200);
    ev('pointermove', 400, 300);
    ev('pointermove', 500, 350);
    ev('pointerup', 500, 350);
    await settle(el);
    expect(el.doc.shapes).toHaveLength(1);
    const box = el.unionBox!;
    expect(box.x).toBeCloseTo(Math.min(a[0], b[0]), 1);
    expect(box.y).toBeCloseTo(Math.min(a[1], b[1]), 1);
    expect(box.w).toBeCloseTo(Math.abs(b[0] - a[0]), 1);
    expect(box.h).toBeCloseTo(Math.abs(b[1] - a[1]), 1);
  });

  it('the Reference picture panel floats over the workspace instead of pushing the canvas down', async () => {
    const { el, ext } = await blank();
    const before = [...el.renderRoot.querySelector('.layer')!.children].map((c) => c.className);
    ext.refOpen = true;
    el.requestUpdate();
    await settle(el);
    const panel = el.renderRoot.querySelector('#ref-panel')!;
    const dock = panel.closest('.ref-dock')!;
    expect(dock).toBeTruthy();
    expect(imageStyles.cssText).toMatch(/\.ref-dock \{[^}]*height: 0/);
    expect(imageStyles.cssText).toMatch(/\.ref-panel \{[^}]*position: absolute/);
    // the stage is the same size box: only the zero-height dock is new
    const after = [...el.renderRoot.querySelector('.layer')!.children].map((c) => c.className).filter((c) => c !== 'ref-dock');
    expect(after).toEqual(before);
  });
});

describe('Import an SVG file over a drawing', () => {
  const FILE = '<svg viewBox="0 0 800 600"><rect x="10" y="10" width="200" height="100" fill="#ff0000"/></svg>';

  it('asks first when the drawing has content, and Keep leaves everything as it was', async () => {
    const { el, ext } = await open(svg(A));
    const before = el.doc;
    ext.importSvg(FILE, 'plan.svg');
    await settle(el);
    expect(ext.replacing).toBeTruthy();
    expect(ext.imp).toBeUndefined();
    expect(el.doc).toBe(before);
    const w = el.renderRoot.querySelector('mc-ui-window')!;
    expect(w.getAttribute('heading')).toBe('Replace your drawing?');
    expect(w.getAttribute('variant')).toBe('alert');
    expect(w.textContent).toContain("Importing ‘plan.svg’ replaces everything on the canvas. You can undo it.");
    win(el, 'Keep my drawing')!.click();
    await settle(el);
    expect(ext.replacing).toBeUndefined();
    expect(el.doc).toBe(before);
    expect(el.renderRoot.querySelector('mc-ui-window')).toBeNull();
    expect((el.renderRoot as ShadowRoot).activeElement?.localName).toBe('mc-path-canvas');
  });

  it('Escape answers no', async () => {
    const { el, ext } = await open(svg(A));
    ext.importSvg(FILE, 'plan.svg');
    await settle(el);
    expect(ext.close()).toBe(true);
    expect(ext.replacing).toBeUndefined();
    expect(el.doc.vb.w).toBe(400);
  });

  it('Replace imports as one undo step and keeps the summary', async () => {
    const { el, ext } = await open(svg(A));
    ext.importSvg(FILE, 'plan.svg');
    await settle(el);
    win(el, 'Replace')!.click();
    await settle(el);
    expect(el.doc.vb.w).toBe(800);
    expect(ext.imp?.name).toBe('plan.svg');
    el.undo();
    await settle(el);
    expect(el.doc.vb.w).toBe(400);
    expect(el.doc.shapes[0].name).toBe('First');
  });

  it('does not ask on an empty canvas, and a file that cannot be used is refused without asking', async () => {
    const empty = await blank();
    empty.ext.importSvg(FILE, 'plan.svg');
    await settle(empty.el);
    expect(empty.ext.replacing).toBeUndefined();
    expect(empty.el.doc.vb.w).toBe(800);
    const full = await open(svg(A));
    full.ext.importSvg('<svg viewBox="0 0 10 10"><script>x()</script></svg>', 'bad.svg');
    await settle(full.el);
    expect(full.ext.replacing).toBeUndefined();
    expect(full.ext.imp?.error).toContain('no shapes');
  });
});
