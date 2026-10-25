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
const GRAD = '<defs><linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0"><stop offset="0" stop-color="#ff0000"/><stop offset="1" stop-color="var(--mc-image-accent)"/></linearGradient></defs>';
const RICH = `<svg viewBox="0 0 400 300">${GRAD}<path id="a" data-name="Sky" d="M0 0H200V100H0Z" fill="#3F6FB5" opacity="0.5"/><path id="b" data-name="Sun" d="M0 0H200V100H0Z" fill="url(#g1)" stroke="var(--primary-color)" stroke-width="4" stroke-dasharray="8 4" stroke-dashoffset="2"/></svg>`;
const PLAIN = '<svg viewBox="0 0 400 300"><path id="a" data-name="Roof" d="M0 0H200V100H0Z" fill="var(--mc-image-main)"/></svg>';
const item = (svg: string) => ({ id: 'pic', name: 'Pic', svg, view_box: '0 0 400 300', created_at: 'c1', updated_at: 'u1' });

function wire(svg: string, admin = true) {
  const calls: any[] = [];
  const hass = {
    language: 'en-GB',
    user: { is_admin: admin },
    callWS: vi.fn(async (m: any) => {
      calls.push(m);
      if (m.type === 'magic_card_utils/images_list') return { images: [{ id: 'pic', name: 'Pic', view_box: '0 0 400 300', bytes: 1, bindings: 0, updated_at: 'u1' }] };
      if (m.type === 'magic_card_utils/images_get') return { images: m.ids[0] === 'pic' ? [item(svg)] : [] };
      if (m.type === 'magic_card_utils/images_save') return { image: { id: m.image.id, name: m.image.name, view_box: m.image.view_box, bytes: 10, bindings: 0, updated_at: 'u2' } };
      return {};
    }),
  };
  return { hass, saves: () => calls.filter((c) => c.type === 'magic_card_utils/images_save') };
}

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
const settle = async (el: Ed): Promise<void> => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
};
const text = (el: Ed): string => el.renderRoot.textContent ?? '';
const shape = (el: Ed, id: string): Shape => el.doc.shapes.find((s) => s.id === id)!;

beforeEach(() => {
  __resetIconSourceForTests();
  __resetImageEditorForTests();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('image paints: opening a library image', () => {
  it('opens colours, a gradient, opacity and dashes for editing, with the layer ids kept', async () => {
    const { el } = await open(RICH);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(false);
    const a = shape(el, 'a');
    expect(a.fill).toBe('main');
    expect(a.look).toEqual({ fill: '#3f6fb5', opacity: 50 });
    const b = shape(el, 'b');
    expect(b.stroke).toBe('main');
    expect(b.look).toEqual({
      fill: { t: 'linear', p: [0, 0, 1, 0], s: [{ o: 0, c: '#ff0000' }, { o: 1, c: 'var(--mc-image-accent)' }] },
      stroke: 'var(--primary-color)',
      dash: [8, 4],
      offset: 2,
    });
  });

  it('keeps an image with Main, Accent and none exactly as before: no look at all', async () => {
    const { el } = await open(PLAIN);
    expect(el.img!.readOnly).toBe(false);
    expect(shape(el, 'a').look).toBeUndefined();
  });

  it('inherits fill, stroke and dashes from a group', async () => {
    const svg = '<svg viewBox="0 0 400 300"><g fill="#00ff00" stroke="#0000ff" stroke-width="3" stroke-dasharray="2 2"><path id="a" d="M0 0H20V20H0Z"/></g></svg>';
    const { el } = await open(svg);
    expect(el.img!.readOnly).toBe(false);
    expect(shape(el, 'a').look).toEqual({ fill: '#00ff00', stroke: '#0000ff', dash: [2, 2] });
  });

  it.each([
    ['text', '<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="#fff"/><text id="t" x="1" y="1">Hi</text></svg>'],
    ['a clip path', '<svg viewBox="0 0 400 300"><defs><clipPath id="c"><rect width="5" height="5"/></clipPath></defs><path id="a" d="M0 0H20V20H0Z" clip-path="url(#c)"/></svg>'],
    ['fill opacity', '<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="#fff" fill-opacity="0.5"/></svg>'],
    ['group opacity', '<svg viewBox="0 0 400 300"><g opacity="0.5"><path id="a" d="M0 0H20V20H0Z"/></g></svg>'],
    ['a colour keyword', '<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="currentColor"/></svg>'],
    ['a gradient transform', `<svg viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" x2="1" gradientTransform="rotate(30)"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><path id="a" d="M0 0H20V20H0Z" fill="url(#g)"/></svg>`],
    ['an unknown gradient', '<svg viewBox="0 0 400 300"><path id="a" d="M0 0H20V20H0Z" fill="url(#nope)"/></svg>'],
  ])('still opens view-only for %s, with the reason', async (_n, svg) => {
    const { el } = await open(svg);
    expect(el.stage).toBe('edit');
    expect(el.img!.readOnly).toBe(true);
    expect(text(el)).toContain('cannot change yet');
  });
});

describe('image paints: saving', () => {
  it('writes the colours, the gradient in drawing units, opacity and dashes back', async () => {
    const { el, saves } = await open(RICH);
    el.apply({ ...el.doc, name: 'Pic 2' }, 'Rename image', 'name');
    await settle(el);
    (el.img as any).save();
    await until(() => saves().length === 1);
    const svg: string = saves()[0].image.svg;
    expect(svg).toMatch(/<path[^>]*id="a"[^>]*fill="#3f6fb5"[^>]*opacity="0\.5"/);
    const m = /id="b"[^>]*fill="url\(#([\w.-]+)\)"/.exec(svg)!;
    expect(m).toBeTruthy();
    expect(svg).toMatch(new RegExp(`<linearGradient[^>]*id="${m[1]}"[^>]*gradientUnits="userSpaceOnUse"[^>]*x1="0"[^>]*y1="0"[^>]*x2="200"[^>]*y2="0"`));
    expect(svg).toContain('stop-color="#ff0000"');
    expect(svg).toContain('stop-color="var(--mc-image-accent)"');
    expect(svg).toMatch(/id="b"[^>]*stroke="var\(--primary-color\)"[^>]*stroke-dasharray="8 4"[^>]*stroke-dashoffset="2"/);
  });

  it('a gradient follows its layer when the layer moves', async () => {
    const { el, saves } = await open(RICH);
    el.editShapes(['b'], (s) => ({ ...s, paths: s.paths.map((p) => ({ ...p, anchors: p.anchors.map((q) => ({ ...q, x: q.x + 50, y: q.y + 20 })) })) }), 'Move');
    el.apply({ ...el.doc, name: 'Pic 2' }, 'Rename image', 'name');
    await settle(el);
    (el.img as any).save();
    await until(() => saves().length === 1);
    expect(saves()[0].image.svg).toMatch(/<linearGradient[^>]*x1="50"[^>]*y1="20"[^>]*x2="250"[^>]*y2="20"/);
  });

  it('a paint-only change marks the image as changed', async () => {
    const { el } = await open(RICH);
    expect(el.dirty).toBe(false);
    el.editShapes(['a'], (s) => ({ ...s, look: { ...s.look, fill: '#ff00ff' } }), 'Colour');
    await settle(el);
    expect(el.dirty).toBe(true);
    el.undo();
    await settle(el);
    expect(el.dirty).toBe(false);
  });
});

describe('image paints: the canvas', () => {
  const art = (el: Ed) => [...el.renderRoot.querySelectorAll<SVGPathElement>('svg.art path')].filter((p) => p.getAttribute('style'));

  it('draws colours, opacity, dashes and a gradient the way the saved file will', async () => {
    const { el } = await open(RICH);
    const [a, b] = art(el);
    const sa = a.getAttribute('style')!;
    expect(sa).toContain('fill:#3f6fb5');
    expect(sa).toContain('opacity:0.5');
    const sb = b.getAttribute('style')!;
    expect(sb).toMatch(/fill:url\(#(cg-[\w.-]+)\)/);
    expect(sb).toContain('stroke:var(--primary-color)');
    expect(sb).toContain('stroke-dasharray:8 4');
    expect(sb).toContain('stroke-dashoffset:2');
    const id = /fill:url\(#([\w.-]+)\)/.exec(sb)![1];
    const g = el.renderRoot.querySelector(`svg.art linearGradient[id="${id}"]`)!;
    expect(g).toBeTruthy();
    expect(g.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
    expect([g.getAttribute('x1'), g.getAttribute('y1'), g.getAttribute('x2'), g.getAttribute('y2')]).toEqual(['0', '0', '200', '0']);
    const stops = [...g.querySelectorAll('stop')];
    expect(stops.map((s) => s.getAttribute('style'))).toEqual(['stop-color:#ff0000', 'stop-color:var(--a)']);
  });

  it('still draws Main and Accent through the editor variables, and the old layers need no look', async () => {
    const { el } = await open(PLAIN);
    expect(art(el)[0].getAttribute('style')).toContain('fill:var(--m);stroke:none');
    expect(el.renderRoot.querySelector('svg.art linearGradient')).toBeNull();
  });
});

describe('image paints: view-only', () => {
  it('names the colour and the gradient of a layer in the read-only inspector', async () => {
    const { el } = await open(RICH, false);
    expect(el.img!.readOnly).toBe(true);
    const pick = async (name: string): Promise<void> => {
      [...el.renderRoot.querySelectorAll<HTMLButtonElement>('.layer-btns button')].find((b) => b.textContent!.trim() === name)!.click();
      await settle(el);
    };
    await pick('Sky');
    expect(text(el)).toContain('Fill: #3f6fb5');
    await pick('Sun');
    expect(text(el)).toContain('Fill: Linear gradient');
    expect(text(el)).toContain('Outline: var(--primary-color)');
  });
});
