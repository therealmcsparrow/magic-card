import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { Shape } from '../src/svg-editor/model';

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

function wire(svg: string, admin = true) {
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: { type: string; ids: string[] }) => {
      if (m.type === 'magic_card_utils/images_list') return { images: [] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [{ id: 'pic', name: 'Pic', svg, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' }] : [] };
      return {};
    }),
  };
  return { hass };
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
async function open(svg: string, admin = true): Promise<Ed> {
  const w = wire(svg, admin);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'image', id: 'pic' }, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  el.snapOn = false;
  return el;
}
const $ = <T extends Element>(el: Ed, sel: string): T | null => el.renderRoot.querySelector<T>(sel);
const btn = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);
const texts = (el: Ed): Shape[] => el.doc.shapes.filter((s) => s.look?.text);
const focused = (el: Ed): Element | null => (el.renderRoot as ShadowRoot).activeElement;
const field = (el: Ed): HTMLTextAreaElement | null => $<HTMLTextAreaElement>(el, '#tx-field');

/** Pointer events on the stage at a point of the drawing. */
function pointer(el: Ed, type: string, x: number, y: number, kind = 'mouse'): void {
  const v = el.view;
  $<HTMLElement>(el, '.stage')!.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, cancelable: true, pointerId: 1, pointerType: kind, button: 0, clientX: v.x + x * v.zoom, clientY: v.y + y * v.zoom }));
}
const click = (el: Ed, x: number, y: number, kind = 'mouse'): void => {
  pointer(el, 'pointerdown', x, y, kind);
  pointer(el, 'pointerup', x, y, kind);
};
const key = (target: Element, k: string, init: KeyboardEventInit = {}): KeyboardEvent => {
  const e = new KeyboardEvent('keydown', { key: k, code: k, bubbles: true, composed: true, cancelable: true, ...init });
  target.dispatchEvent(e);
  return e;
};
const typeIn = async (el: Ed, v: string): Promise<void> => {
  const f = field(el)!;
  f.value = v;
  f.dispatchEvent(new Event('input', { bubbles: true }));
  await settle(el);
};
async function armed(svg = ONE): Promise<Ed> {
  const el = await open(svg);
  btn(el, 'Text')!.click();
  await settle(el);
  return el;
}

const real = customElements.get.bind(customElements);
beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
  vi.spyOn(customElements, 'get').mockImplementation((n: string) => (n === 'mc-color-picker' ? undefined : real(n)));
});
afterEach(() => {
  (document.activeElement as HTMLElement | null)?.blur?.();
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('Text tool: the rail', () => {
  it('offers a Text tool next to the others, pressed when chosen', async () => {
    const el = await open(ONE);
    const b = btn(el, 'Text')!;
    expect(b).toBeDefined();
    expect(b.getAttribute('aria-pressed')).toBe('false');
    b.click();
    await settle(el);
    expect(el.tool).toBe('text');
    expect(btn(el, 'Text')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('is not offered when the image is view-only', async () => {
    const el = await open(ONE, false);
    expect(btn(el, 'Text')).toBeUndefined();
  });

  it('says what to do in the help for the tool', async () => {
    const el = await open(ONE);
    el.tool = 'text';
    el.dlg = 'help';
    await settle(el);
    expect($<HTMLElement>(el, '.help-list')!.textContent).toContain('Click or tap where the text goes');
    expect($<HTMLElement>(el, '.help-list')!.textContent).not.toContain('Drag a box');
  });
});

describe('Text tool: click to place', () => {
  it('opens the field at the click, named, with Done and Cancel, and adds nothing yet', async () => {
    const el = await armed();
    click(el, 120, 80);
    await settle(el);
    const f = field(el)!;
    expect(f).not.toBeNull();
    expect(f.getAttribute('aria-label')).toBe('Text on the canvas');
    expect(f.localName).toBe('textarea');
    expect(focused(el)).toBe(f);
    expect(btn(el, 'Done')).toBeDefined();
    expect(btn(el, 'Cancel')).toBeDefined();
    expect(texts(el)).toHaveLength(0);
    
  });

  it('Enter adds the words as one layer at the click, selected, and goes back to Select', async () => {
    const el = await armed();
    const before = el.doc.shapes.length;
    click(el, 120, 80);
    await settle(el);
    await typeIn(el, 'Hall');
    const e = key(field(el)!, 'Enter');
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    const t = texts(el);
    expect(el.doc.shapes).toHaveLength(before + 1);
    expect(t).toHaveLength(1);
    expect(t[0].look!.text!.s).toBe('Hall');
    expect(t[0].name).toBe('Hall');
    expect(el.sel).toEqual([t[0].id]);
    expect(el.tool).toBe('select');
    const b = el.unionBox!;
    expect(Math.round(b.x)).toBe(120);
    expect(Math.round(b.y)).toBe(80);
    expect(field(el)).toBeNull();
    expect((el.out.svg ?? '')).toContain('>Hall</text>');
  });

  it('is one undo step', async () => {
    const el = await armed();
    click(el, 120, 80);
    await settle(el);
    await typeIn(el, 'Hall');
    key(field(el)!, 'Enter');
    await settle(el);
    el.undo();
    await settle(el);
    expect(texts(el)).toHaveLength(0);
  });

  it('Done adds it and puts focus back on the canvas', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Door');
    btn(el, 'Done')!.click();
    await settle(el);
    expect(texts(el).map((s) => s.look!.text!.s)).toEqual(['Door']);
    expect(field(el)).toBeNull();
    expect((focused(el) as HTMLElement | null)?.localName).toBe('mc-path-canvas');
  });

  it('Cancel adds nothing, closes the field, keeps the Text tool and returns focus to the canvas', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Door');
    btn(el, 'Cancel')!.click();
    await settle(el);
    expect(texts(el)).toHaveLength(0);
    expect(field(el)).toBeNull();
    expect(el.tool).toBe('text');
    expect((focused(el) as HTMLElement | null)?.localName).toBe('mc-path-canvas');
  });

  it('Escape in the field cancels it and does not clear the selection or leave the editor', async () => {
    const el = await armed();
    el.select(['a']);
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Door');
    const e = key(field(el)!, 'Escape');
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    expect(texts(el)).toHaveLength(0);
    expect(field(el)).toBeNull();
    expect(el.sel).toEqual(['a']);
  });

  it('Escape on the Done button cancels too', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Door');
    key(btn(el, 'Done')!, 'Escape');
    await settle(el);
    expect(field(el)).toBeNull();
    expect(texts(el)).toHaveLength(0);
  });

  it('Shift+Enter is left to the field (a new line) and does not add', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Hall\nStairs');
    const e = key(field(el)!, 'Enter', { shiftKey: true });
    await settle(el);
    expect(e.defaultPrevented).toBe(false);
    expect(field(el)).not.toBeNull();
    key(field(el)!, 'Enter');
    await settle(el);
    expect(texts(el)[0].look!.text!.s).toBe('Hall\nStairs');
  });

  it('Enter while an input method is composing does not add', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'こん');
    const e = key(field(el)!, 'Enter', { isComposing: true });
    await settle(el);
    expect(e.defaultPrevented).toBe(false);
    expect(texts(el)).toHaveLength(0);
    expect(field(el)).not.toBeNull();
  });

  it('empty text adds nothing, closes the field and says so', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    key(field(el)!, 'Enter');
    await settle(el);
    expect(texts(el)).toHaveLength(0);
    expect(field(el)).toBeNull();
    await until(() => (el.renderRoot.textContent ?? '').includes('No text was added.'));
  });

  it('spaces and blank lines alone count as empty', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, '  \n ');
    btn(el, 'Done')!.click();
    await settle(el);
    expect(texts(el)).toHaveLength(0);
  });

  it('a drag places at the point where it began', async () => {
    const el = await armed();
    pointer(el, 'pointerdown', 60, 60);
    pointer(el, 'pointermove', 200, 200);
    pointer(el, 'pointerup', 200, 200);
    await settle(el);
    await typeIn(el, 'X');
    key(field(el)!, 'Enter');
    await settle(el);
    const b = el.unionBox!;
    expect(Math.round(b.x)).toBe(60);
    expect(Math.round(b.y)).toBe(60);
  });

  it('a second click moves the open field and keeps the words typed', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, 'Door');
    click(el, 200, 150);
    await settle(el);
    expect(el.renderRoot.querySelectorAll('#tx-field')).toHaveLength(1);
    expect(field(el)!.value).toBe('Door');
    key(field(el)!, 'Enter');
    await settle(el);
    expect(Math.round(el.unionBox!.x)).toBe(200);
  });

  it('works with a finger', async () => {
    const el = await armed();
    click(el, 100, 100, 'touch');
    await settle(el);
    expect(field(el)).not.toBeNull();
    await typeIn(el, 'Tap');
    btn(el, 'Done')!.click();
    await settle(el);
    expect(texts(el)).toHaveLength(1);
  });

  it('a click inside the field does not start another', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    const f = field(el)!;
    const down = new PointerEvent('pointerdown', { bubbles: true, composed: true, cancelable: true, pointerId: 2, pointerType: 'mouse', button: 0, clientX: 5, clientY: 5 });
    f.dispatchEvent(down);
    f.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, composed: true, cancelable: true, pointerId: 2, pointerType: 'mouse', button: 0, clientX: 5, clientY: 5 }));
    await settle(el);
    expect(down.defaultPrevented).toBe(false);
    expect(el.renderRoot.querySelectorAll('#tx-field')).toHaveLength(1);
  });

  it('keeps the words inside the limit and shows the count near it', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    expect(field(el)!.getAttribute('maxlength')).toBe('2048');
    await typeIn(el, 'a'.repeat(3000));
    expect(field(el)!.value).toHaveLength(2048);
    expect($(el, '#tx-field-count')!.textContent).toContain('2048 characters');
    await typeIn(el, 'a'.repeat(1950));
    expect($(el, '#tx-field-count')!.textContent).toContain('98 left');
    expect(field(el)!.getAttribute('aria-describedby')).toContain('tx-field-count');
  });

  it('brings the field into view for a soft keyboard', async () => {
    const spy = vi.fn();
    (HTMLElement.prototype as unknown as { scrollIntoView: unknown }).scrollIntoView = spy;
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    expect(spy).toHaveBeenCalled();
  });

  it('writes words with markup characters as text, never as markup', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    await typeIn(el, '</text><script>alert(1)</script><text>');
    key(field(el)!, 'Enter');
    await settle(el);
    const svg = el.out.svg!;
    expect(svg).not.toContain('<script');
    expect(new DOMParser().parseFromString(svg, 'image/svg+xml').querySelectorAll('text')).toHaveLength(1);
  });
});

describe('Text tool: keyboard', () => {
  it('Enter on the canvas opens the field in the middle of the drawing', async () => {
    const el = await armed();
    const e = key($<HTMLElement>(el, '.stage')!, 'Enter');
    await settle(el);
    expect(e.defaultPrevented).toBe(true);
    expect(field(el)).not.toBeNull();
    expect(focused(el)).toBe(field(el));
    await typeIn(el, 'Mid');
    key(field(el)!, 'Enter');
    await settle(el);
    const b = el.unionBox!;
    expect(Math.round(b.x)).toBe(200);
    expect(Math.round(b.y)).toBe(150);
  });

  it('Enter on Done is a press of Done, not a second field', async () => {
    const el = await armed();
    key($<HTMLElement>(el, '.stage')!, 'Enter');
    await settle(el);
    await typeIn(el, 'Mid');
    const e = key(btn(el, 'Done')!, 'Enter');
    expect(e.defaultPrevented).toBe(false);
    expect(el.renderRoot.querySelectorAll('#tx-field')).toHaveLength(1);
  });

  it('Enter on the canvas while the field is open goes back to the field', async () => {
    const el = await armed();
    key($<HTMLElement>(el, '.stage')!, 'Enter');
    await settle(el);
    await typeIn(el, 'Mid');
    ($<HTMLElement>(el, 'mc-path-canvas')!).focus();
    key($<HTMLElement>(el, '.stage')!, 'Enter');
    await settle(el);
    expect(el.renderRoot.querySelectorAll('#tx-field')).toHaveLength(1);
    expect(field(el)!.value).toBe('Mid');
    expect(focused(el)).toBe(field(el));
  });

  it('other keys on the canvas do nothing in the Text tool', async () => {
    const el = await armed();
    const e = key($<HTMLElement>(el, '.stage')!, 'ArrowRight');
    await settle(el);
    expect(e.defaultPrevented).toBe(false);
    expect(field(el)).toBeNull();
  });

  it('the T key and Add text still add a text layer at once', async () => {
    const el = await open(ONE);
    btn(el, 'Add text')!.click();
    await settle(el);
    expect(texts(el)).toHaveLength(1);
    expect($(el, '#tx-content')).not.toBeNull();
  });

  it('closes the field when the editor is closed', async () => {
    const el = await armed();
    click(el, 40, 40);
    await settle(el);
    const img = el.img as unknown as { dispose(): void; field?: unknown };
    img.dispose();
    expect(img.field).toBeUndefined();
  });
});
