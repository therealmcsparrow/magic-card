import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { __resetImageEditorForTests } from '../src/svg-editor/image-loader';
import { boolReason } from '../src/svg-editor/combine';
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
const WITH_TEXT = `<svg viewBox="0 0 400 300">${BOX}<text id="t" data-name="Hall label" x="200" y="220" font-size="40" font-family="serif" font-weight="700" font-style="italic" text-anchor="middle" letter-spacing="2" fill="#e53935" opacity="0.8">Hall</text></svg>`;

function wire(svg: string, admin = true) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
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
async function open(svg: string, admin = true): Promise<{ el: Ed; saves: () => any[] }> {
  const w = wire(svg, admin);
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
const btn = (el: Ed, label: string): HTMLButtonElement | undefined => [...el.renderRoot.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label || b.getAttribute('aria-label') === label);
const type = async (el: Ed, id: string, value: string): Promise<void> => {
  const i = $<HTMLTextAreaElement>(el, `#${id}`);
  i.value = value;
  i.dispatchEvent(new Event('input', { bubbles: true }));
  await settle(el);
};
const fieldSet = async (el: Ed, id: string, value: string): Promise<void> => {
  const i = $<HTMLInputElement | HTMLSelectElement>(el, `#${id}`);
  i.value = value;
  i.dispatchEvent(new Event('change', { bubbles: true }));
  await settle(el);
};
/** The option the select shows (happy-dom keeps `value` on the first option). */
const chosen = (el: Ed, id: string): string => [...el.renderRoot.querySelectorAll<HTMLOptionElement>(`#${id} option`)].find((o) => o.hasAttribute('selected'))!.value;
const texts = (el: Ed): Shape[] => el.doc.shapes.filter((s) => s.look?.text);
async function save(el: Ed, saves: () => any[]): Promise<string> {
  const n = saves().length;
  el.apply({ ...el.doc, name: `Pic ${n}` }, 'Rename image', 'name');
  await settle(el);
  (el.img as any).save();
  await until(() => saves().length === n + 1);
  return saves()[n].image.svg;
}
const parse = (svg: string): Document => new DOMParser().parseFromString(svg, 'image/svg+xml');

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

describe('text layers: opening a library image', () => {
  it('opens text for editing, with its words, type, paint, opacity and name', async () => {
    const { el } = await open(WITH_TEXT);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(false);
    const t = shape(el, 't');
    expect(t.name).toBe('Hall label');
    expect(t.look).toEqual({ fill: '#e53935', opacity: 80, text: { s: 'Hall', z: 40, w: 700, i: true, a: 'middle', l: 2, f: 'serif' } });
    expect(shape(el, 'a').look).toBeUndefined();
  });

  it('names a text layer after its words when the file gives no name', async () => {
    const { el } = await open('<svg viewBox="0 0 400 300"><text id="t" x="10" y="40" font-size="20">Front door</text></svg>');
    expect(el.img!.readOnly).toBe(false);
    expect(shape(el, 't').name).toBe('Front door');
  });

  it('keeps the layer order of text and shapes', async () => {
    const { el } = await open(`<svg viewBox="0 0 400 300"><text id="t1" x="0" y="20">One</text>${BOX}<text id="t2" x="0" y="60">Two</text></svg>`);
    expect(el.doc.shapes.map((s) => s.id)).toEqual(['t1', 'a', 't2']);
  });

  it('opens a text with two lines as one layer', async () => {
    const { el } = await open('<svg viewBox="0 0 400 300"><text id="t" x="10" y="40" font-size="20"><tspan x="10" y="40">one</tspan><tspan x="10" y="64">two</tspan></text></svg>');
    expect(el.img!.readOnly).toBe(false);
    expect(shape(el, 't').look!.text!.s).toBe('one\ntwo');
  });

  it.each([
    ['text with a transform', '<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="#fff"/><text id="t" x="1" y="1" transform="rotate(5)">Hi</text></svg>'],
    ['text in a transformed group', '<svg viewBox="0 0 400 300"><g transform="translate(5 5)"><text id="t" x="1" y="1">Hi</text></g></svg>'],
    ['text in other units', '<svg viewBox="0 0 400 300"><text id="t" x="1" y="1" font-size="2em">Hi</text></svg>'],
    ['text with a clip path next to it', '<svg viewBox="0 0 400 300"><defs><clipPath id="c"><rect width="5" height="5"/></clipPath></defs><text id="t" x="1" y="1" clip-path="url(#c)">Hi</text></svg>'],
    ['text next to a part that is still unsupported', `<svg viewBox="0 0 400 300"><text id="t" x="1" y="1">Hi</text><path id="a" d="M0 0H20V20H0Z" fill="#fff" fill-opacity="0.5"/></svg>`],
  ])('keeps %s as a locked layer, editable', async (_n, svg) => {
    const { el } = await open(svg);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(false);
    expect(el.doc.shapes.some((s) => s.locked && s.look?.part)).toBe(true);
    expect(text(el)).not.toContain('cannot change yet');
  });

  it('shows text in the view-only workspace too', async () => {
    const { el } = await open(WITH_TEXT, false);
    expect(el.img!.readOnly).toBe(true);
    expect($(el, 'svg.art text')).toBeTruthy();
  });
});

describe('text layers: adding', () => {
  it('Add text makes a selected layer in the middle of the drawing and puts the cursor in Content, selected', async () => {
    const { el } = await open(ONE);
    btn(el, 'Add text')!.click();
    await settle(el);
    const t = texts(el);
    expect(t).toHaveLength(1);
    expect(el.sel).toEqual([t[0].id]);
    expect(t[0].look!.text).toMatchObject({ s: 'Text', z: 19, w: 400, a: 'start', f: 'sans-serif' });
    expect(t[0].name).toBe('Text');
    expect(t[0].fill).toBe('main');
    expect(t[0].stroke).toBe('none');
    const b = el.unionBox!;
    expect(b.x + b.w / 2).toBeGreaterThan(150);
    expect(b.x + b.w / 2).toBeLessThan(250);
    const c = $<HTMLTextAreaElement>(el, '#tx-content');
    expect(c.value).toBe('Text');
    expect((el.renderRoot as ShadowRoot).activeElement).toBe(c);
  });

  it('the T key picks the Text tool and adds nothing, and not while typing in a field', async () => {
    const { el } = await open(ONE);
    const stage = $<HTMLElement>(el, '.stage');
    stage.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyT', key: 't', bubbles: true, composed: true }));
    await settle(el);
    expect(el.tool).toBe('text');
    expect(texts(el)).toHaveLength(0);
    el.tool = 'select';
    const c = $<HTMLElement>(el, '.stage');
    const f = document.createElement('textarea');
    c.append(f);
    f.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyT', key: 't', bubbles: true, composed: true }));
    await settle(el);
    expect(el.tool).toBe('select');
    f.remove();
  });

  it('is not offered when the image is view-only', async () => {
    const { el } = await open(WITH_TEXT, false);
    expect(btn(el, 'Add text')).toBeUndefined();
  });

  it('adds one undo step', async () => {
    const { el } = await open(ONE);
    btn(el, 'Add text')!.click();
    await settle(el);
    el.undo();
    await settle(el);
    expect(texts(el)).toHaveLength(0);
  });
});

describe('text layers: the Text section', () => {
  it('shows for a text layer and not for a shape', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['a']);
    await settle(el);
    expect(el.renderRoot.querySelector('#tx-content')).toBeNull();
    el.select(['t']);
    await settle(el);
    expect($<HTMLTextAreaElement>(el, '#tx-content').value).toBe('Hall');
    expect($<HTMLInputElement>(el, '#tx-size').value).toBe('40');
    expect(chosen(el, 'tx-weight')).toBe('700');
    expect(chosen(el, 'tx-font')).toBe('serif');
    expect(btn(el, 'Italic')!.getAttribute('aria-pressed')).toBe('true');
    expect($<HTMLInputElement>(el, '#tx-spacing').value).toBe('2');
    expect(el.renderRoot.querySelector('[role=radiogroup][aria-label=Alignment] [aria-checked=true]')!.textContent!.trim()).toBe('Centre');
  });

  it('typing changes the words, rebuilds the box round the same anchor and renames a layer named after its words', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    const before = el.unionBox!;
    const mid = before.x + before.w / 2;
    await type(el, 'tx-content', 'Hall and stairs');
    const t = shape(el, 't');
    expect(t.look!.text!.s).toBe('Hall and stairs');
    expect(t.look!.text!.z).toBe(40);
    const after = el.unionBox!;
    expect(after.w).toBeGreaterThan(before.w);
    expect(after.x + after.w / 2).toBeCloseTo(mid, 0);
    expect(t.name).toBe('Hall label');
  });

  it('a layer that still has the name of its words follows them', async () => {
    const { el } = await open('<svg viewBox="0 0 400 300"><text id="t" x="10" y="40" font-size="20">Front door</text></svg>');
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', 'Back door');
    expect(shape(el, 't').name).toBe('Back door');
  });

  it('a line break makes two lines and the box grows by a line', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    const h0 = el.unionBox!.h;
    await type(el, 'tx-content', 'Hall\nstairs');
    expect(shape(el, 't').look!.text!.s).toBe('Hall\nstairs');
    expect(el.unionBox!.h - h0).toBeCloseTo(48, 0);
  });

  it('typing is one undo step, not one for each key', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    for (const v of ['H', 'Ha', 'Hal', 'Hall x']) await type(el, 'tx-content', v);
    el.undo();
    await settle(el);
    expect(shape(el, 't').look!.text!.s).toBe('Hall');
  });

  it('strips control characters and cuts at the limit', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', 'a\u0000b\u0007c');
    expect(shape(el, 't').look!.text!.s).toBe('abc');
    expect($<HTMLTextAreaElement>(el, '#tx-content').maxLength).toBe(2048);
    await type(el, 'tx-content', 'x'.repeat(3000));
    expect(shape(el, 't').look!.text!.s).toHaveLength(2048);
  });

  it('counts the characters left from 1900 and says when the limit is reached', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    expect(el.renderRoot.querySelector('#tx-count')).toBeNull();
    await type(el, 'tx-content', 'x'.repeat(1900));
    expect($(el, '#tx-count').textContent).toBe('148 left');
    expect($<HTMLTextAreaElement>(el, '#tx-content').getAttribute('aria-describedby')).toContain('tx-count');
    await type(el, 'tx-content', 'x'.repeat(2048));
    expect($(el, '#tx-count').textContent).toBe('That is the longest text (2048 characters).');
  });

  it('size, weight, italic, alignment, spacing and font each change the layer', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await fieldSet(el, 'tx-size', '60');
    await fieldSet(el, 'tx-weight', '400');
    btn(el, 'Italic')!.click();
    await settle(el);
    const end = [...el.renderRoot.querySelectorAll<HTMLButtonElement>('[role=radiogroup][aria-label=Alignment] [role=radio]')].find((b) => b.textContent!.trim() === 'End')!;
    end.click();
    await settle(el);
    await fieldSet(el, 'tx-spacing', '0');
    await fieldSet(el, 'tx-font', 'monospace');
    expect(shape(el, 't').look!.text).toEqual({ s: 'Hall', z: 60, w: 400, a: 'end', f: 'monospace' });
    expect(shape(el, 't').look!.fill).toBe('#e53935');
  });

  it('keeps the anchor when the alignment changes, so the words do not jump', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    const sh = el.img as any;
    const at = (): number[] => {
      const n = el.renderRoot.querySelector('svg.art text')!;
      return [Number(n.getAttribute('x')), Number(n.getAttribute('y'))];
    };
    const was = at();
    const start = [...el.renderRoot.querySelectorAll<HTMLButtonElement>('[role=radiogroup][aria-label=Alignment] [role=radio]')].find((b) => b.textContent!.trim() === 'Start')!;
    start.click();
    await settle(el);
    expect(sh.readOnly).toBe(false);
    const now = at();
    expect(now[0]).toBeCloseTo(was[0], 0);
    expect(now[1]).toBeCloseTo(was[1], 0);
  });

  it('offers the four fonts from the safe list and nothing else', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    expect([...el.renderRoot.querySelectorAll<HTMLOptionElement>('#tx-font option')].map((o) => o.value)).toEqual(['sans-serif', 'serif', 'monospace', 'system-ui']);
    expect(text(el)).toContain('Nothing is downloaded');
  });

  it('removes a text layer that is left empty when the field is left, and says so', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', '');
    expect(shape(el, 't')).toBeTruthy();
    $<HTMLTextAreaElement>(el, '#tx-content').dispatchEvent(new Event('change', { bubbles: true }));
    await settle(el);
    await new Promise((r) => setTimeout(r, 100));
    await el.updateComplete;
    expect(el.doc.shapes.find((s) => s.id === 't')).toBeUndefined();
    expect(el.sel).toEqual([]);
    expect(text(el)).toContain('The empty text layer was removed.');
  });

  it('keeps a text layer whose words are only spaces out of the saved file but not out of the editor until it is left', async () => {
    const { el, saves } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', '   ');
    const svg = await save(el, saves);
    expect(svg).not.toContain('<text');
  });
});

describe('text layers: the canvas draws what is saved', () => {
  it('draws <text> with the attributes of the saved file', async () => {
    const { el, saves } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', 'Hall\n\nstairs & <b>');
    const node = el.renderRoot.querySelector('svg.art text')!;
    const svg = await save(el, saves);
    const out = parse(svg).querySelector('text')!;
    for (const k of ['x', 'y', 'font-size', 'font-family', 'font-weight', 'font-style', 'text-anchor', 'letter-spacing']) {
      expect(node.getAttribute(k), k).toBe(out.getAttribute(k));
    }
    const a = [...node.querySelectorAll('tspan')].map((s) => [s.getAttribute('x'), s.getAttribute('y'), s.textContent]);
    const b = [...out.querySelectorAll('tspan')].map((s) => [s.getAttribute('x'), s.getAttribute('y'), s.textContent]);
    expect(a).toEqual(b);
    expect(b).toHaveLength(2);
    expect(b[1][2]).toBe('stairs & <b>');
    expect(node.textContent).toBe(out.textContent);
  });

  it('the canvas text carries the layer paint as the saved file does, and is not selectable by AT', async () => {
    const { el } = await open(WITH_TEXT);
    const node = el.renderRoot.querySelector('svg.art text')!;
    expect(node.getAttribute('style')).toContain('fill:#e53935');
    expect(node.getAttribute('style')).toContain('opacity:0.8');
    expect(el.renderRoot.querySelector('svg.art')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('draws nothing hidden', async () => {
    const { el } = await open(WITH_TEXT);
    el.editShapes(['t'], (s) => ({ ...s, hidden: true }), 'Hide');
    await settle(el);
    expect(el.renderRoot.querySelector('svg.art text')).toBeNull();
  });
});

describe('text layers: saving and reopening', () => {
  it('writes <text> with place, type and paint, and a second open reads the same layer back', async () => {
    const { el, saves } = await open(WITH_TEXT);
    const svg = await save(el, saves);
    const t = parse(svg).querySelector('text')!;
    expect(t.getAttribute('id')).toBe('t');
    expect(t.getAttribute('data-name')).toBe('Hall label');
    expect(t.getAttribute('fill')).toBe('#e53935');
    expect(t.getAttribute('opacity')).toBe('0.8');
    expect(t.getAttribute('text-anchor')).toBe('middle');
    expect(t.getAttribute('x')).toBe('200');
    expect(t.getAttribute('y')).toBe('220');
    expect(t.textContent).toBe('Hall');
    el.remove();
    const second = await open(svg);
    expect(second.el.img!.readOnly).toBe(false);
    expect(shape(second.el, 't').look).toEqual(shape(el, 't').look);
  });

  it('a new text layer is saved with an id the markup allows, and with the words', async () => {
    const { el, saves } = await open(ONE);
    btn(el, 'Add text')!.click();
    await settle(el);
    await type(el, 'tx-content', 'Kitchen');
    const svg = await save(el, saves);
    const t = parse(svg).querySelector('text')!;
    expect(t.getAttribute('id')).toMatch(/^[A-Za-z][\w.-]{0,63}$/);
    expect(t.textContent).toBe('Kitchen');
    expect(t.getAttribute('font-size')).toBe('19');
  });

  it('words that look like markup are saved as words', async () => {
    const { el, saves } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    await type(el, 'tx-content', '</text><script>alert(1)</script><text>');
    const svg = await save(el, saves);
    expect(svg).not.toContain('<script');
    const d = parse(svg);
    expect(d.querySelectorAll('text')).toHaveLength(1);
    expect(d.querySelector('text')!.textContent).toBe('</text><script>alert(1)</script><text>');
  });

  it('a gradient on text is placed on the box of the layer and written in drawing units', async () => {
    const { el, saves } = await open(WITH_TEXT);
    el.select(['t']);
    await settle(el);
    el.editShapes(['t'], (s) => ({ ...s, look: { ...s.look, fill: { t: 'linear', p: [0, 0, 1, 0], s: [{ o: 0, c: '#ff0000' }, { o: 1, c: '#0000ff' }] } } }), 'Paint');
    await settle(el);
    const box = el.unionBox!;
    const svg = await save(el, saves);
    const d = parse(svg);
    const url = /url\(#([\w.-]+)\)/.exec(d.querySelector('text')!.getAttribute('fill')!)![1];
    const g = d.getElementById(url)!;
    expect(g.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
    expect(Number(g.getAttribute('x1'))).toBeCloseTo(box.x, 1);
    expect(Number(g.getAttribute('x2'))).toBeCloseTo(box.x + box.w, 1);
  });

  it('an outline on text is round-joined and carries its width', async () => {
    const { el, saves } = await open(WITH_TEXT);
    el.editShapes(['t'], (s) => ({ ...s, stroke: 'accent', width: 3 }), 'Stroke');
    const svg = await save(el, saves);
    const t = parse(svg).querySelector('text')!;
    expect(t.getAttribute('stroke')).toBe('var(--mc-image-accent)');
    expect(t.getAttribute('stroke-width')).toBe('3');
    expect(t.getAttribute('stroke-linejoin')).toBe('round');
  });

  it('a drawing of only text can be saved', async () => {
    const { el, saves } = await open('<svg viewBox="0 0 400 300"><text id="t" x="10" y="40" font-size="20">Only words</text></svg>');
    const svg = await save(el, saves);
    expect(parse(svg).querySelector('text')!.textContent).toBe('Only words');
  });

  it('a duplicate of a text layer is a text layer with its own id', async () => {
    const { el } = await open(WITH_TEXT);
    el.select(['t']);
    el.duplicate();
    await settle(el);
    const t = texts(el);
    expect(t).toHaveLength(2);
    expect(new Set(t.map((s) => s.id)).size).toBe(2);
    expect(t[1].look!.text).toEqual(t[0].look!.text);
  });
});

describe('text layers: other tools', () => {
  it('moving a text layer moves its words', async () => {
    const { el } = await open(WITH_TEXT);
    const at = (): number[] => {
      const n = el.renderRoot.querySelector('svg.art text')!;
      return [Number(n.getAttribute('x')), Number(n.getAttribute('y'))];
    };
    const was = at();
    el.select(['t']);
    el.setBox({ x: el.unionBox!.x + 30, y: el.unionBox!.y + 10 }, 'Move');
    await settle(el);
    expect(at()).toEqual([was[0] + 30, was[1] + 10]);
  });

  it('text is never an operand of a boolean operation, and says why', async () => {
    const { el } = await open(`<svg viewBox="0 0 400 300">${BOX}<path id="b" d="M150 80H350V180H150Z" fill="#fff"/><text id="t" x="10" y="40" font-size="20">Hi</text></svg>`);
    el.select(['a', 't']);
    await settle(el);
    expect(el.boolean.operands.map((s) => s.id)).toEqual(['a']);
    expect(boolReason(el.boolean, 'union')).toBe('Text cannot be combined with other layers.');
    el.select(['a', 'b', 't']);
    await settle(el);
    expect(el.boolean.operands.map((s) => s.id)).toEqual(['a', 'b']);
    expect(boolReason(el.boolean, 'union')).toBeUndefined();
  });
});
