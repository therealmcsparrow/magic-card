import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apply, compileParticles, __resetParticlesForTests } from '../src/particles/apply';
import { __resetOffscreenObserverForTests } from '../src/icons/offscreen';
import type { ParticlesSim, ParticlesSpecV2, ParticlesApplyCtx } from '../src/contracts/particles-v2';
import { DEFAULT_PARTICLES } from '../src/anim-studio/model';

const sim = (over: Partial<ParticlesSim> = {}): ParticlesSim => ({
  engine: 1,
  mode: 'baked',
  seed: 4242,
  flow: 'fall',
  shapes: [],
  ranges: { speed: [40, 60], spin: [0, 90], delay: [0, 2], lifetime: [1.5, 2], opacity: [0.7, 1] },
  physics: { gravity: { angle: 0, strength: 0 }, drag: 0, turbulence: { strength: 0, scale: 20 }, bounce: 0.5 },
  colliders: { floor: false, ceiling: false, left: false, right: false, content: 'none' },
  ...over,
});

function layerFor(over: Partial<ParticlesSim>, ctxOver: Partial<ParticlesApplyCtx> = {}): { layer: HTMLElement; ctx: ParticlesApplyCtx } {
  const s: ParticlesSpecV2 = { ...DEFAULT_PARTICLES, count: 6, sim: sim(over) };
  const c = compileParticles('doc1', s, 2, { aspect: 2 });
  const layer = document.createElement('div');
  c.slots.forEach(() => layer.append(document.createElement('i')));
  document.body.append(layer);
  layer.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, toJSON: () => ({}) }) as DOMRect;
  return { layer, ctx: { useCss: () => undefined, reducedMotion: false, docId: 'doc1', spec: s, period: 2, ...ctxOver } };
}

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', () => 1);
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
  __resetOffscreenObserverForTests();
  __resetParticlesForTests();
});
afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('particle layer mirror', () => {
  for (const [name, over, extra] of [
    ['baked', {}, {}],
    ['live', { mode: 'live' as const }, {}],
    ['still', {}, { reducedMotion: true }],
  ] as const) {
    it(`${name}: flips the whole layer, and clears the flip when mirror turns off`, () => {
      const { layer, ctx } = layerFor(over, extra);
      apply(layer, { ...ctx, mirror: true });
      expect(layer.style.getPropertyValue('scale')).toBe('-1 1');
      apply(layer, { ...ctx, mirror: false });
      expect(layer.style.getPropertyValue('scale')).toBe('');
    });

    it(`${name}: leaves the layer alone without mirror`, () => {
      const { layer, ctx } = layerFor(over, extra);
      apply(layer, ctx);
      expect(layer.style.getPropertyValue('scale')).toBe('');
    });
  }

  it('live and still frames keep x and rotate unflipped inside the flipped layer', () => {
    const { layer, ctx } = layerFor({ mode: 'live' }, { reducedMotion: true });
    const plain = layerFor({ mode: 'live' }, { reducedMotion: true });
    apply(layer, { ...ctx, mirror: true });
    apply(plain.layer, plain.ctx);
    const read = (l: HTMLElement, p: string): string[] => [...l.children].map((c) => (c as HTMLElement).style.getPropertyValue(p));
    expect(read(layer, 'translate')).toEqual(read(plain.layer, 'translate'));
    expect(read(layer, 'rotate')).toEqual(read(plain.layer, 'rotate'));
  });
});
