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
const ONE = '<svg viewBox="0 0 400 300"><path id="a" data-name="Box" d="M100 50H300V150H100Z" fill="var(--mc-image-main)"/><path id="b" data-name="Line" d="M0 200H100" fill="none" stroke="var(--mc-image-accent)" stroke-width="4"/></svg>';

function wire(svg: string) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: true },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [{ id: 'pic', name: 'Pic', svg, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' }] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass, saves: () => calls.filter((c) => c.type === 'magic_card_utils/images_save') };
}
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
async function open(svg: string): Promise<{ el: Ed; saves: () => any[] }> {
  const w = wire(svg);
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'image', id: 'pic' }, hass: w.hass, host: 'mcu' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await settle(el);
  return { el, saves: w.saves };
}
const text = (el: Ed): string => el.renderRoot.textContent ?? '';
const shape = (el: Ed, id: string): Shape => el.doc.shapes.find((s) => s.id === id)!;
const $ = <T extends Element>(el: Ed, sel: string): T => el.renderRoot.querySelector<T>(sel)!;
const choose = async (el: Ed, id: string, value: string): Promise<void> => {
  const s = $<HTMLSelectElement>(el, `#${id}`);
  s.value = value;
  s.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(el);
};
const fieldSet = async (el: Ed, id: string, value: string): Promise<void> => {
  const i = $<HTMLInputElement>(el, `#${id}`);
  i.value = value;
  i.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(el);
};
const pickLayer = async (el: Ed, ...ids: string[]): Promise<void> => {
  el.select(ids);
  await settle(el);
};
const kinds = (el: Ed, id: string): string[] => [...el.renderRoot.querySelectorAll<HTMLOptionElement>(`#${id} option`)].map((o) => o.textContent!.trim());
const btn = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);

const real = customElements.get.bind(customElements);
let plain = true;
beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
  plain = true;
  vi.spyOn(customElements, 'get').mockImplementation((n: string) => (plain && n === 'mc-color-picker' ? undefined : real(n)));
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('image paints: the Fill and Stroke controls', () => {
  it('offers None, Main, Accent, a custom colour, a theme colour and two gradients for each', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    expect(kinds(el, 'fill-kind')).toEqual(['None', 'Main', 'Accent', 'Custom colour', 'Theme colour', 'Linear gradient', 'Radial gradient']);
    expect(kinds(el, 'stroke-kind')).toEqual(kinds(el, 'fill-kind'));
    expect($<HTMLSelectElement>(el, '#fill-kind').value).toBe('main');
    expect($<HTMLSelectElement>(el, '#stroke-kind').value).toBe('none');
    expect(text(el)).not.toContain('Dual-tone');
  });

  it('a custom colour starts as a blue and takes the colour typed or picked', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'colour');
    expect(shape(el, 'a').look).toEqual({ fill: '#3f6fb5' });
    expect(shape(el, 'a').fill).toBe('main');
    await fieldSet(el, 'fill-colour', '#112233');
    expect(shape(el, 'a').look!.fill).toBe('#112233');
    await fieldSet(el, 'fill-colour', 'not a colour');
    expect(shape(el, 'a').look!.fill).toBe('#112233');
    await choose(el, 'fill-kind', 'accent');
    expect(shape(el, 'a').look).toBeUndefined();
    expect(shape(el, 'a').fill).toBe('accent');
  });

  it('a theme colour is picked from the list or typed, and a bad name says why', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'theme');
    expect(shape(el, 'a').look!.fill).toBe('var(--primary-color)');
    await choose(el, 'fill-theme', '--accent-color');
    expect(shape(el, 'a').look!.fill).toBe('var(--accent-color)');
    await fieldSet(el, 'fill-theme-name', '--my-colour');
    expect(shape(el, 'a').look!.fill).toBe('var(--my-colour)');
    await fieldSet(el, 'fill-theme-name', 'my colour');
    expect(shape(el, 'a').look!.fill).toBe('var(--my-colour)');
    expect(text(el)).toContain('Use a name that starts with two dashes, like --my-colour.');
    expect($<HTMLInputElement>(el, '#fill-theme-name').getAttribute('aria-invalid')).toBe('true');
    await fieldSet(el, 'fill-theme-name', '--other');
    expect(text(el)).not.toContain('Use a name that starts with two dashes');
  });

  it('a stroke colour turns the outline on with a width', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'stroke-kind', 'colour');
    expect(shape(el, 'a').stroke).toBe('main');
    expect(shape(el, 'a').width).toBeGreaterThan(0);
    expect(shape(el, 'a').look!.stroke).toBe('#3f6fb5');
  });

  it("a gradient starts from the layer's colour to the other tone and follows the angle field", async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    const g = shape(el, 'a').look!.fill as any;
    expect(g.t).toBe('linear');
    expect(g.s).toEqual([{ o: 0, c: 'var(--mc-image-main)' }, { o: 1, c: 'var(--mc-image-accent)' }]);
    expect(g.p).toEqual([0, 0.5, 1, 0.5]);
    expect($<HTMLInputElement>(el, '#fill-angle').value).toBe('0');
    await fieldSet(el, 'fill-angle', '90');
    const h = shape(el, 'a').look!.fill as any;
    expect(h.p[0]).toBeCloseTo(0.5);
    expect(h.p[1]).toBeCloseTo(0);
    expect(h.p[3]).toBeCloseTo(1);
  });

  it('a radial gradient has a centre and a radius in percent', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'radial');
    expect((shape(el, 'a').look!.fill as any).p).toEqual([0.5, 0.5, 0.5]);
    await fieldSet(el, 'fill-cx', '25');
    await fieldSet(el, 'fill-cy', '75');
    await fieldSet(el, 'fill-r', '40');
    expect((shape(el, 'a').look!.fill as any).p).toEqual([0.25, 0.75, 0.4]);
    await fieldSet(el, 'fill-r', '0');
    expect((shape(el, 'a').look!.fill as any).p[2]).toBeGreaterThan(0);
  });

  it('stops: two to eight, each with a position and a colour; Remove waits at two', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    expect(btn(el, 'Remove stop 1')!.getAttribute('aria-disabled')).toBe('true');
    btn(el, 'Add stop')!.click();
    await settle(el);
    let g = shape(el, 'a').look!.fill as any;
    expect(g.s).toHaveLength(3);
    expect(g.s[1].o).toBe(0.5);
    await fieldSet(el, 'fill-stop-1-pos', '30');
    g = shape(el, 'a').look!.fill as any;
    expect(g.s[1].o).toBe(0.3);
    await choose(el, 'fill-stop-1-kind', 'colour');
    await fieldSet(el, 'fill-stop-1-colour', '#00ff00');
    g = shape(el, 'a').look!.fill as any;
    expect(g.s[1].c).toBe('#00ff00');
    await choose(el, 'fill-stop-2-kind', 'theme');
    g = shape(el, 'a').look!.fill as any;
    expect(g.s[2].c).toBe('var(--primary-color)');
    btn(el, 'Remove stop 2')!.click();
    await settle(el);
    expect((shape(el, 'a').look!.fill as any).s).toHaveLength(2);
    for (let i = 0; i < 8; i++) {
      const add = btn(el, 'Add stop')!;
      if (add.getAttribute('aria-disabled') === 'true') break;
      add.click();
      await settle(el);
    }
    expect((shape(el, 'a').look!.fill as any).s).toHaveLength(8);
    expect(btn(el, 'Add stop')!.getAttribute('aria-disabled')).toBe('true');
  });

  it('opacity is a number from 0 to 100 and 100 means none', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    const num = (): HTMLInputElement => $<HTMLInputElement>(el, 'input[type=number][aria-label="Opacity"]');
    expect(num().value).toBe('100');
    num().value = '40';
    num().dispatchEvent(new Event('change', { bubbles: true }));
    await settle(el);
    expect(shape(el, 'a').look).toEqual({ opacity: 40 });
    num().value = '250';
    num().dispatchEvent(new Event('change', { bubbles: true }));
    await settle(el);
    expect(shape(el, 'a').look).toBeUndefined();
  });

  it('dashes: presets from the stroke width, a typed list and an offset; only with an outline', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    expect(el.renderRoot.querySelector('#look-dash')).toBeNull();
    await pickLayer(el, 'b');
    expect($<HTMLSelectElement>(el, '#look-dash').value).toBe('solid');
    await choose(el, 'look-dash', 'dashed');
    expect(shape(el, 'b').look!.dash).toEqual([12, 8]);
    await choose(el, 'look-dash', 'dotted');
    expect(shape(el, 'b').look!.dash).toEqual([4, 8]);
    await choose(el, 'look-dash', 'custom');
    await fieldSet(el, 'look-dash-list', '10 2 3');
    expect(shape(el, 'b').look!.dash).toEqual([10, 2, 3]);
    await fieldSet(el, 'look-dash-list', '10 x');
    expect(shape(el, 'b').look!.dash).toEqual([10, 2, 3]);
    expect(text(el)).toContain('Use up to 8 numbers separated by spaces, like 8 4.');
    await fieldSet(el, 'look-dash-offset', '3');
    expect(shape(el, 'b').look!.offset).toBe(3);
    await choose(el, 'look-dash', 'solid');
    expect(shape(el, 'b').look).toBeUndefined();
  });

  it('applies to every selected layer and skips locked ones', async () => {
    const { el } = await open(ONE);
    el.editShapes(['b'], (s) => ({ ...s, locked: true }), 'Lock');
    await pickLayer(el, 'a', 'b');
    await choose(el, 'fill-kind', 'colour');
    expect(shape(el, 'a').look!.fill).toBe('#3f6fb5');
    expect(shape(el, 'b').look).toBeUndefined();
  });

  it('one undo step per change, and the saved file keeps the change', async () => {
    const { el, saves } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'colour');
    await fieldSet(el, 'fill-colour', '#112233');
    el.undo();
    await settle(el);
    expect(shape(el, 'a').look!.fill).toBe('#3f6fb5');
    el.redo();
    await settle(el);
    el.apply({ ...el.doc, name: 'Pic 2' }, 'Rename image', 'name');
    (el.img as any).save();
    await until(() => saves().length === 1);
    expect(saves()[0].image.svg).toContain('fill="#112233"');
  });
});

describe('image paints: the colour popup', () => {
  it('uses the colour popup of the card editor when it is defined, and writes what it reports', async () => {
    plain = false;
    expect(real('mc-color-picker')).toBeTruthy();
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'colour');
    const p = $<HTMLElement & { value: string }>(el, 'mc-color-picker');
    expect(p.value).toBe('#3f6fb5');
    expect(el.renderRoot.querySelector('#fill-colour')).toBeNull();
    const say = async (v: string): Promise<void> => {
      p.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: v } }));
      await settle(el);
    };
    await say('rgb(10 20 30 / 50%)');
    expect(shape(el, 'a').look!.fill).toBe('rgb(10 20 30 / 50%)');
    await say('url(javascript:1)');
    expect(shape(el, 'a').look!.fill).toBe('rgb(10 20 30 / 50%)');
    await say('var(--accent-color)');
    expect(shape(el, 'a').look!.fill).toBe('var(--accent-color)');
    expect($<HTMLSelectElement>(el, '#fill-kind').value).toBe('theme');
  });
});

describe('image paints: gradient handles', () => {
  const handle = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('.gh button')].find((b) => b.getAttribute('aria-label') === label);
  const key = async (el: Ed, b: HTMLElement, k: string, shift = false): Promise<void> => {
    b.dispatchEvent(new KeyboardEvent('keydown', { key: k, shiftKey: shift, bubbles: true, cancelable: true }));
    await settle(el);
  };
  const grad = (el: Ed) => shape(el, 'a').look!.fill as any;

  it('shows no handles without a gradient', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    expect(el.renderRoot.querySelectorAll('.gh button')).toHaveLength(0);
  });

  it('puts a named, focusable button at the start and end of a linear gradient', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    const labels = [...el.renderRoot.querySelectorAll('.gh button')].map((b) => b.getAttribute('aria-label'));
    expect(labels).toEqual(['Gradient start', 'Gradient end']);
    expect(handle(el, 'Gradient start')!.tagName).toBe('BUTTON');
    const { x, y, zoom } = el.view;
    // the box of layer a is 100..300 by 50..150: the start sits at its left edge, halfway down
    expect(handle(el, 'Gradient start')!.getAttribute('style')).toContain(`left:${x + 100 * zoom}px;top:${y + 100 * zoom}px`);
  });

  it('arrow keys move a handle by 1 unit and Shift by 10; Escape returns to the layer', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    await key(el, handle(el, 'Gradient end')!, 'ArrowDown');
    expect(grad(el).p).toEqual([0, 0.5, 1, 0.51]);
    await key(el, handle(el, 'Gradient end')!, 'ArrowLeft', true);
    expect(grad(el).p).toEqual([0, 0.5, 0.95, 0.51]);
    await key(el, handle(el, 'Gradient start')!, 'ArrowUp', true);
    expect(grad(el).p[1]).toBe(0.4);
    const focus = vi.fn();
    (el.canvas() as any).focus = focus;
    await key(el, handle(el, 'Gradient start')!, 'Escape');
    expect(focus).toHaveBeenCalled();
  });

  it('a dragged handle follows the pointer and is one undo step', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    const before = el.hist!.canUndo;
    expect(before).toBe(true);
    const b = handle(el, 'Gradient end')!;
    b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 1 }));
    el.point = () => [200, 150];
    b.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, pointerId: 1 }));
    await settle(el);
    expect(grad(el).p).toEqual([0, 0.5, 0.5, 1]);
    b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerId: 1 }));
    await settle(el);
    el.undo();
    await settle(el);
    expect(grad(el).p).toEqual([0, 0.5, 1, 0.5]);
  });

  it('middle stops get their own handle, named by place', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'linear');
    btn(el, 'Add stop')!.click();
    await settle(el);
    expect([...el.renderRoot.querySelectorAll('.gh button')].map((b) => b.getAttribute('aria-label'))).toEqual(['Gradient start', 'Gradient end', 'Gradient stop 2 of 3']);
    await key(el, handle(el, 'Gradient stop 2 of 3')!, 'ArrowRight', true);
    expect(grad(el).s[1].o).toBe(0.55);
  });

  it('a radial gradient has a centre and a radius handle', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'fill-kind', 'radial');
    expect([...el.renderRoot.querySelectorAll('.gh button')].map((b) => b.getAttribute('aria-label'))).toEqual(['Gradient centre', 'Gradient radius']);
    await key(el, handle(el, 'Gradient radius')!, 'ArrowRight', true);
    expect(grad(el).p[2]).toBeCloseTo(0.5 + 10 / 200);
  });

  it('shows handles for the outline gradient when only the stroke has one, and none when two layers are picked', async () => {
    const { el } = await open(ONE);
    await pickLayer(el, 'a');
    await choose(el, 'stroke-kind', 'radial');
    expect(handle(el, 'Gradient centre')).toBeTruthy();
    await pickLayer(el, 'a', 'b');
    expect(el.renderRoot.querySelectorAll('.gh button')).toHaveLength(0);
  });

  it('shows none in the view-only editor', async () => {
    const { el } = await open('<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="currentColor"/></svg>');
    await pickLayer(el, 'a');
    expect(el.renderRoot.querySelectorAll('.gh button')).toHaveLength(0);
  });
});
