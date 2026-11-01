import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { shapeRingPath } from '../src/utils/ring-path';
import { ringPath } from '../src/utils/ring-outline';
import { mirrorSweep } from '../src/card/ring-stroke';
import '../src/card/mc-ring';
import type { McRing } from '../src/card/mc-ring';
import type { ResolvedRing } from '../src/utils/ring';

const golden = JSON.parse(readFileSync('tests/fixtures/rtl-card-ring-ltr-golden.json', 'utf8')) as Record<string, string>;
const STARTS = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left'] as const;
const r = (x: number) => ({ x, y: x });
const OUT = {
  square: { tl: r(0), tr: r(0), br: r(0), bl: r(0) },
  round: { tl: r(12), tr: r(12), br: r(12), bl: r(12) },
  mixed: { tl: r(4), tr: r(20), br: { x: 8, y: 16 }, bl: r(0) },
};
const SHAPES = ['squircle', 'hexagon', 'circle', 'wave'] as const;

describe('ltr golden recorded from c30df8a5', () => {
  it('ringPath is byte-identical for every outline, start, direction and inset', () => {
    let n = 0;
    for (const [name, radii] of Object.entries(OUT))
      for (const start of STARTS) for (const direction of ['cw', 'ccw'] as const) for (const inset of [0, 2]) {
        expect(ringPath(200, 100, radii, { start, direction, inset })).toBe(golden[`ring/${name}/${start}/${direction}/${inset}`]);
        n++;
      }
    expect(n).toBe(96);
  });
  it('shapeRingPath is byte-identical for every shape, start and direction', () => {
    for (const kind of SHAPES)
      for (const start of STARTS) for (const direction of ['cw', 'ccw'] as const)
        expect(shapeRingPath(kind, 200, 100, undefined, { start, direction, inset: 2 })).toBe(golden[`shape/${kind}/${start}/${direction}`]);
  });
});

describe('mirrorSweep', () => {
  it('leaves ltr alone', () => {
    expect(mirrorSweep('right', 'cw', false)).toEqual({ start: 'right', direction: 'cw' });
    expect(mirrorSweep(undefined, undefined, false)).toEqual({ start: undefined, direction: undefined });
  });
  it('swaps left and right and cw and ccw under rtl', () => {
    expect(mirrorSweep('top-right', 'cw', true)).toEqual({ start: 'top-left', direction: 'ccw' });
    expect(mirrorSweep('left', 'ccw', true)).toEqual({ start: 'right', direction: 'cw' });
    expect(mirrorSweep('bottom-left', undefined, true)).toEqual({ start: 'bottom-right', direction: 'ccw' });
    expect(mirrorSweep(undefined, 'cw', true)).toEqual({ start: 'top', direction: 'ccw' });
  });
  it('is its own inverse', () => {
    for (const s of STARTS) {
      const m = mirrorSweep(s, 'cw', true);
      expect(mirrorSweep(m.start, m.direction, true)).toEqual({ start: s, direction: 'cw' });
    }
  });
  it('walks the same outline: a mirrored square starts at the mirrored x', () => {
    const m = mirrorSweep('top-right', 'cw', true);
    const first = (d: string) => d.match(/^M([\d.]+) ([\d.]+)/)!.slice(1).map(Number);
    const [lx, ly] = first(ringPath(200, 100, OUT.square, { start: 'top-right', direction: 'cw' }));
    const [rx, ry] = first(ringPath(200, 100, OUT.square, m));
    expect([rx, ry]).toEqual([200 - lx, ly]);
  });
});

describe('<mc-ring> under rtl', () => {
  const ring = { mode: 'value', fill: 0.5, start: 'top-right', direction: 'cw', width: 4, position: 'inside', color: 'red', glow: 0, linecap: 'butt', transition: '1s', speed: '1s' } as unknown as ResolvedRing;
  let parent: HTMLElement;
  afterEach(() => { parent?.remove(); document.documentElement.removeAttribute('dir'); });

  async function mount(dir?: string) {
    parent = document.createElement('div');
    Object.defineProperty(parent, 'offsetWidth', { value: 200 });
    Object.defineProperty(parent, 'offsetHeight', { value: 100 });
    if (dir) parent.setAttribute('style', `direction: ${dir}`);
    document.body.appendChild(parent);
    const el = document.createElement('mc-ring') as McRing;
    el.ring = ring;
    parent.appendChild(el);
    await el.updateComplete;
    return el;
  }
  const d = (el: McRing) => el.shadowRoot!.querySelector('path')!.getAttribute('d');
  const expected = (start: 'top-right' | 'top-left', direction: 'cw' | 'ccw') => ringPath(200, 100, OUT.square, { inset: 2, start, direction });

  it('draws the ltr path in ltr', async () => {
    const el = await mount();
    expect(d(el)).toBe(expected('top-right', 'cw'));
  });
  it('draws the mirrored sweep under a computed rtl direction', async () => {
    const el = await mount('rtl');
    expect(d(el)).toBe(expected('top-left', 'ccw'));
  });
  it('re-reads on mc-dir-change and on an html dir change', async () => {
    const el = await mount();
    parent.setAttribute('style', 'direction: rtl');
    window.dispatchEvent(new Event('mc-dir-change'));
    await el.updateComplete;
    expect(d(el)).toBe(expected('top-left', 'ccw'));
    parent.setAttribute('style', 'direction: ltr');
    window.dispatchEvent(new Event('mc-dir-change'));
    await el.updateComplete;
    expect(d(el)).toBe(expected('top-right', 'cw'));
    parent.setAttribute('style', 'direction: rtl');
    document.documentElement.setAttribute('dir', 'rtl');
    await new Promise((res) => setTimeout(res, 0));
    await el.updateComplete;
    expect(d(el)).toBe(expected('top-left', 'ccw'));
  });
  it('removes its listeners on disconnect and restores them on reconnect', async () => {
    const el = await mount('rtl');
    el.remove();
    parent.setAttribute('style', 'direction: ltr');
    const before = (el as unknown as { _box: unknown })._box;
    window.dispatchEvent(new Event('mc-dir-change'));
    expect((el as unknown as { _box: unknown })._box).toBe(before);
    parent.appendChild(el);
    await el.updateComplete;
    window.dispatchEvent(new Event('mc-dir-change'));
    await el.updateComplete;
    expect(d(el)).toBe(expected('top-right', 'cw'));
  });
});
