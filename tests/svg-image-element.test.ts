import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { install } from '../src/svg-image/chunk';
import { __resetImageClientForTests } from '../src/svg-image/client';
import { __resetFramesForTests } from '../src/svg-image/frames';
import type { McSvgImage } from '../src/svg-image/mc-svg-image';
import { BG_LAYER_STATUS_EVENT } from '../src/contracts/bg-stack.needs';
import { IMAGE_SKELETON_MS, MAX_LAYER_PREFETCH } from '../src/contracts/svg-image';

const svgOf = (n: number) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path id="p${n}" d="M0 0L10 10" fill="var(--mc-image-main)"/><circle id="c" cx="150" cy="50" r="10" fill="var(--mc-image-accent)"/></svg>`;

interface Fake {
  images: Map<string, { id: string; name: string; view_box: string; svg: string; created_at: string; updated_at: string }>;
  calls: Array<{ type: string; ids?: string[] }>;
  hass: { callWS: (m: { type: string; ids?: string[] }) => Promise<unknown>; states: Record<string, unknown>; connection?: undefined };
}
const fake = (...ids: string[]): Fake => {
  const f: Fake = {
    images: new Map(ids.map((id, i) => [id, { id, name: id, view_box: '0 0 200 100', svg: svgOf(i), created_at: 't0', updated_at: 't1' }])),
    calls: [],
    hass: {
      states: {},
      callWS: async (m) => {
        f.calls.push(m);
        return { images: (m.ids ?? []).flatMap((id) => (f.images.has(id) ? [f.images.get(id)!] : [])) };
      },
    },
  };
  return f;
};

const frames = (n = 6) => vi.advanceTimersByTimeAsync(n * 40);
const mount = (props: Partial<McSvgImage> & { hass?: unknown }): McSvgImage => {
  const el = document.createElement('mc-svg-image') as McSvgImage;
  Object.assign(el, props);
  document.body.append(el);
  return el;
};
const stage = (el: McSvgImage) => el.shadowRoot!.querySelector<HTMLElement>('.stage')!;
const drawing = (el: McSvgImage) => el.shadowRoot!.querySelector<SVGElement>('.stage > svg');

beforeEach(() => {
  vi.useFakeTimers();
  __resetImageClientForTests();
  __resetFramesForTests();
  install();
});
afterEach(() => {
  document.body.innerHTML = '';
  __resetImageClientForTests();
  __resetFramesForTests();
  vi.useRealTimers();
});

describe('<mc-svg-image> in a module', () => {
  it('shows a skeleton box while it waits, then the drawing', async () => {
    const f = fake('plan');
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.sk')).not.toBeNull();
    expect(drawing(el)).toBeNull();
    expect(el.status).toBe('waiting');
    await frames();
    expect(drawing(el)?.querySelector('path')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.sk')).toBeNull();
    expect(el.status).toBe('ready');
  });

  it('draws a decorative svg without a description, with an accessible name when it has one', async () => {
    const f = fake('plan');
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass });
    await frames();
    expect(drawing(el)?.getAttribute('aria-hidden')).toBe('true');
    expect(drawing(el)?.hasAttribute('role')).toBe(false);
    el.description = 'Floor plan of the ground floor';
    await frames();
    expect(drawing(el)?.getAttribute('role')).toBe('img');
    expect(drawing(el)?.getAttribute('aria-label')).toBe('Floor plan of the ground floor');
    expect(drawing(el)?.hasAttribute('aria-hidden')).toBe(false);
    expect(el.hasAttribute('role')).toBe(false);
    expect(stage(el).hasAttribute('role')).toBe(false);
  });

  it('keeps an overlay slot in the stage beside the drawing', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass });
    await frames();
    expect(stage(el).querySelector('slot')).not.toBeNull();
    expect(stage(el).firstElementChild?.localName).toBe('svg');
  });

  it('sizes the stage by the drawing ratio and the fit', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass });
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--ar: 2');
    expect(stage(el).getAttribute('style')).toContain('100cqw');
    expect(drawing(el)?.getAttribute('preserveAspectRatio')).not.toBe('none');
    el.fit = 'fill';
    await frames();
    expect(drawing(el)?.getAttribute('preserveAspectRatio')).toBe('none');
    el.fit = 'none';
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--vw: 200');
  });

  it('sets Main and Accent from the design colours, with the theme as default', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass });
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--mc-image-main: var(--primary-text-color)');
    expect(stage(el).getAttribute('style')).toContain('--mc-image-accent: var(--accent-color)');
    el.colors = { main: '#ff0000', accent: 'rgb(0, 128, 0)' };
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--mc-image-main: #ff0000');
    expect(stage(el).getAttribute('style')).toContain('--mc-image-accent: rgb(0, 128, 0)');
    el.colors = { main: 'red; background: url(x)' };
    await frames();
    expect(stage(el).getAttribute('style')).not.toContain('url(x)');
  });

  it('is missing for an unknown id, a bad reference and after IMAGE_SKELETON_MS of waiting', async () => {
    const el = mount({ ref: 'mcu-image:nope', hass: fake().hass });
    await frames();
    expect(el.status).toBe('missing');
    const bad = mount({ ref: 'https://x/y.svg', hass: fake().hass });
    await frames();
    expect(bad.status).toBe('missing');

    const slow = fake('slow');
    slow.hass.callWS = () => new Promise(() => undefined);
    const waiting = mount({ ref: 'mcu-image:slow', hass: slow.hass });
    await frames();
    expect(waiting.status).toBe('waiting');
    await vi.advanceTimersByTimeAsync(IMAGE_SKELETON_MS);
    expect(waiting.status).toBe('missing');
  });

  it('draws again when the library says the item changed', async () => {
    const f = fake('plan');
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass });
    await frames();
    expect(drawing(el)?.querySelector('#p0')).not.toBeNull();
    f.images.set('plan', { ...f.images.get('plan')!, svg: svgOf(7), updated_at: 't2' });
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'images', ids: ['plan'] } }));
    await frames();
    expect(drawing(el)?.querySelector('#p7')).not.toBeNull();
    expect(drawing(el)?.querySelector('#p0')).toBeNull();
  });

  it('replaces the drawing when ref changes and leaves one drawing in the stage', async () => {
    const f = fake('a', 'b');
    const el = mount({ ref: 'mcu-image:a', hass: f.hass });
    await frames();
    el.ref = 'mcu-image:b';
    await frames();
    expect(stage(el).querySelectorAll(':scope > svg')).toHaveLength(1);
    expect(drawing(el)?.querySelector('#p1')).not.toBeNull();
  });

  it('does not re-render for a hass push when no colour follows an entity', async () => {
    const f = fake('plan');
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass });
    await frames();
    const spy = vi.spyOn(el, 'render');
    el.hass = { ...f.hass, states: { 'light.x': {} } } as never;
    await frames();
    expect(spy).not.toHaveBeenCalled();
  });

  it('follows an entity colour on a hass push', async () => {
    const f = fake('plan');
    f.hass.states = { 'light.x': { entity_id: 'light.x', state: 'on', attributes: { rgb_color: [10, 20, 30] } } };
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass, entity: 'light.x', colors: { main: 'entity' } });
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--mc-image-main: rgb(10, 20, 30)');
    f.hass.states = { 'light.x': { entity_id: 'light.x', state: 'on', attributes: { rgb_color: [1, 2, 3] } } };
    el.hass = { ...f.hass } as never;
    await frames();
    expect(stage(el).getAttribute('style')).toContain('--mc-image-main: rgb(1, 2, 3)');
  });

  it('reports the centre of a part in percent of the drawing', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass });
    await frames();
    const rect = (x: number, y: number, w: number, h: number) => ({ left: x, top: y, width: w, height: h, right: x + w, bottom: y + h, x, y }) as DOMRect;
    vi.spyOn(drawing(el)!, 'getBoundingClientRect').mockReturnValue(rect(10, 20, 200, 100));
    vi.spyOn(drawing(el)!.querySelector('#c')!, 'getBoundingClientRect').mockReturnValue(rect(10 + 140, 20 + 40, 20, 20));
    expect(el.pointOf('c')).toEqual({ x: 75, y: 50 });
    expect(el.pointOf('none')).toBeUndefined();
  });

  it('stops everything when removed', async () => {
    const f = fake('plan');
    const el = mount({ ref: 'mcu-image:plan', hass: f.hass });
    el.remove();
    await frames(3);
    expect(vi.getTimerCount()).toBe(0);
    expect(drawing(el)).toBeNull();
  });
});

describe('<mc-svg-image> in a background layer', () => {
  const layer = (extra: Record<string, unknown> = {}) => ({ type: 'image', image: 'mcu-image:plan', ...extra }) as never;
  const events = (el: HTMLElement) => {
    const seen: Array<{ index: number; status: string; reason?: string }> = [];
    el.addEventListener(BG_LAYER_STATUS_EVENT, (e) => seen.push((e as CustomEvent).detail));
    return seen;
  };

  it('draws nothing while it waits and never a skeleton', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass, layer: layer(), at: 2 });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.sk')).toBeNull();
    await frames();
    expect(drawing(el)).not.toBeNull();
  });

  it('tells the stack with ok once drawn and with image-missing when the item is gone', async () => {
    const f = fake('plan');
    const a = document.createElement('mc-svg-image') as McSvgImage;
    const seenA = events(a);
    Object.assign(a, { ref: 'mcu-image:plan', hass: f.hass, layer: layer(), at: 2 });
    document.body.append(a);
    await frames();
    expect(seenA).toEqual([{ index: 2, status: 'ok' }]);
    const b = document.createElement('mc-svg-image') as McSvgImage;
    const seenB = events(b);
    Object.assign(b, { ref: 'mcu-image:gone', hass: f.hass, layer: layer(), at: 0 });
    document.body.append(b);
    await frames();
    expect(seenB).toEqual([{ index: 0, status: 'error', reason: 'image-missing' }]);
  });

  it('ignores colours, description and overlays: decorative, defaults only', async () => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass, layer: layer(), at: 0, colors: { main: '#f00' }, description: 'x' });
    await frames();
    expect(drawing(el)?.getAttribute('aria-hidden')).toBe('true');
    expect(drawing(el)?.hasAttribute('aria-label')).toBe(false);
    expect(stage(el).getAttribute('style')).toContain('--mc-image-main: var(--primary-text-color)');
  });

  it.each([
    [{ size: 'cover' }, '100cqw', 'max('],
    [{ size: 'contain' }, '100cqw', 'min('],
    [{ size: 'auto' }, '--vw: 200', ''],
    [{ size: '50%' }, 'calc(100cqw * 0.5)', ''],
    [{}, '100cqw', 'max('],
    [{ size: 'junk' }, '100cqw', 'max('],
  ])('maps size %j to the stage', async (extra, a, b) => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass, layer: layer(extra), at: 0 });
    await frames();
    const style = stage(el).getAttribute('style')!;
    expect(style).toContain(a);
    expect(style).toContain(b);
  });

  it.each([
    ['top-left', '--px: 0', '--py: 0'],
    ['bottom-right', '--px: 1', '--py: 1'],
    ['25% 75%', '--px: 0.25', '--py: 0.75'],
    ['center', '--px: 0.5', '--py: 0.5'],
    [undefined, '--px: 0.5', '--py: 0.5'],
    ['nonsense', '--px: 0.5', '--py: 0.5'],
  ])('places the stage like background-position %s', async (position, x, y) => {
    const el = mount({ ref: 'mcu-image:plan', hass: fake('plan').hass, layer: layer(position ? { position } : {}), at: 0 });
    await frames();
    expect(stage(el).getAttribute('style')).toContain(x);
    expect(stage(el).getAttribute('style')).toContain(y);
  });

  it('prefetches the other references of its layer, at most MAX_LAYER_PREFETCH, after its own draw', async () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const f = fake(...ids);
    const states: Record<string, string> = { on: 'mcu-image:b', off: 'mcu-image:c', x1: 'mcu-image:d', x2: 'mcu-image:e', x3: 'mcu-image:f', x4: 'mcu-image:g', plain: '/local/x.png', dup: 'mcu-image:b' };
    mount({ ref: 'mcu-image:a', hass: f.hass, layer: layer({ image: 'mcu-image:a', states }), at: 0 });
    await frames(2);
    const askedBefore = new Set(f.calls.flatMap((c) => c.ids ?? []));
    expect([...askedBefore]).toEqual(['a']);
    await vi.advanceTimersByTimeAsync(5000);
    const asked = new Set(f.calls.flatMap((c) => c.ids ?? []));
    asked.delete('a');
    expect(asked.size).toBe(MAX_LAYER_PREFETCH);
    expect([...asked].every((id) => ids.includes(id))).toBe(true);
    expect(asked.has('x')).toBe(false);
  });

  it('makes the first draw of page-wide elements one per frame', async () => {
    const f = fake('plan');
    const els = Array.from({ length: 4 }, () => mount({ ref: 'mcu-image:plan', hass: f.hass, layer: layer(), at: 0 }));
    await vi.advanceTimersByTimeAsync(0);
    await frames(1);
    const drawn = () => els.filter((e) => drawing(e)).length;
    const first = drawn();
    expect(first).toBeLessThanOrEqual(2);
    await frames(10);
    expect(drawn()).toBe(4);
    expect(f.calls.filter((c) => c.type === 'magic_card_utils/images_get')).toHaveLength(1);
  });
});
