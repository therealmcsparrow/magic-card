import { describe, it, expect, vi } from 'vitest';
import '../src/index';
import { ringResizeObserver } from '../src/card/size-watch';
import { resolveRing } from '../src/utils/ring';
import { ringInset, ringStroke } from '../src/card/ring-stroke';
import type { HassEntity, HomeAssistant, MagicCardConfig, RingConfig } from '../src/types';

const ent = (entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity =>
  ({ entity_id, state, attributes }) as HassEntity;

const states = {
  'sensor.filter': ent('sensor.filter', '65'),
  'fan.purifier': ent('fan.purifier', 'on', { percentage: 40 }),
  'sensor.temp': ent('sensor.temp', '21.5'),
  'sensor.na': ent('sensor.na', 'unavailable'),
  'switch.off': ent('switch.off', 'off'),
};

describe('resolveRing', () => {
  it('off without a mode', () => {
    expect(resolveRing(undefined, { states })).toBeUndefined();
    expect(resolveRing({} as RingConfig, { states })).toBeUndefined();
    expect(resolveRing({ mode: 'nope' } as unknown as RingConfig, { states })).toBeUndefined();
  });

  it('value: (value - min) / (max - min) of the entity, default 0-100', () => {
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter' }, { states })!.fill).toBeCloseTo(0.65);
    expect(resolveRing({ mode: 'value', entity: 'sensor.temp', min: 15, max: 25 }, { states })!.fill).toBeCloseTo(0.65);
  });

  it('value: the module entity by default, an attribute when set', () => {
    expect(resolveRing({ mode: 'value' }, { states, defaultEntity: 'sensor.filter' })!.fill).toBeCloseTo(0.65);
    expect(resolveRing({ mode: 'value', attribute: 'percentage' }, { states, defaultEntity: 'fan.purifier' })!.fill).toBeCloseTo(0.4);
  });

  it('value: clamps to 0..1; unavailable / non-numeric / max = min is empty', () => {
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter', max: 50 }, { states })!.fill).toBe(1);
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter', min: 80 }, { states })!.fill).toBe(0);
    expect(resolveRing({ mode: 'value', entity: 'sensor.na' }, { states })!.fill).toBe(0);
    expect(resolveRing({ mode: 'value', entity: 'switch.off' }, { states })!.fill).toBe(0);
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter', min: 5, max: 5 }, { states })!.fill).toBe(0);
    expect(resolveRing({ mode: 'value' }, { states })!.fill).toBe(0);
  });

  it('value: thresholds colour by value, else the colour, else the theme accent', () => {
    const thresholds = [{ from: 0, color: '#f44336' }, { from: 30, color: '#ff9800' }, { from: 60, color: '#4caf50' }];
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter', thresholds }, { states })!.color).toBe('#4caf50');
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter', color: 'red' }, { states })!.color).toBe('red');
    expect(resolveRing({ mode: 'value', entity: 'sensor.filter' }, { states })!.color).toContain('--primary-color');
  });

  it('entity colours read the wrapper entity colour var', () => {
    const r = resolveRing({ mode: 'animated', color: 'entity 50%' }, { states })!;
    expect(r.color).toBe('color-mix(in srgb, var(--mc-entity-color, currentColor) 50%, transparent)');
  });

  it('unsafe colours are dropped', () => {
    expect(resolveRing({ mode: 'animated', color: 'red; background: url(x)' }, { states })!.color).toContain('--primary-color');
  });

  it('defaults: 3px inside, round caps, top, clockwise, 1s fill, no track, no glow', () => {
    const r = resolveRing({ mode: 'animated' }, { states })!;
    expect(r).toMatchObject({ animation: 'snake', width: 3, position: 'inside', linecap: 'round', start: 'top', direction: 'cw', transition: '1s', speed: '3s', length: 25, glow: 0 });
    expect(r.track).toBeUndefined();
  });

  it('track: its colour at its opacity; an opacity alone uses the ring colour', () => {
    expect(resolveRing({ mode: 'animated', color: 'red', track_color: 'blue', track_opacity: 30 }, { states })!.track).toBe('color-mix(in srgb, blue 30%, transparent)');
    expect(resolveRing({ mode: 'animated', color: 'red', track_color: 'blue' }, { states })!.track).toBe('blue');
    expect(resolveRing({ mode: 'animated', color: 'red', track_opacity: 20 }, { states })!.track).toBe('color-mix(in srgb, red 20%, transparent)');
  });

  it('show only while: hidden when its Play condition is false', () => {
    expect(resolveRing({ mode: 'animated', trigger: 'entity_on' }, { states, defaultEntity: 'switch.off' })).toBeUndefined();
    expect(resolveRing({ mode: 'animated', trigger: 'entity_on', trigger_entity: 'fan.purifier' }, { states, defaultEntity: 'switch.off' })).toBeDefined();
    expect(resolveRing({ mode: 'animated', trigger: 'entity_on' }, { states })).toBeUndefined();
  });

  it('clamps width, glow and snake length', () => {
    const r = resolveRing({ mode: 'animated', width: 999, glow: -4, length: 140 }, { states })!;
    expect([r.width, r.glow, r.length]).toEqual([40, 0, 99]);
  });

});

describe('ringInset', () => {
  it('inside: half the stroke in; center: on the edge; outside: half out', () => {
    expect(ringInset('inside', 4)).toBe(2);
    expect(ringInset('center', 4)).toBe(0);
    expect(ringInset('outside', 4)).toBe(-2);
  });
});

describe('ringStroke (pathLength 100)', () => {
  const ring = (c: RingConfig) => resolveRing(c, { states })!;

  it('value: a 100 dash shifted by the empty part, transition on the offset', () => {
    const s = ringStroke(ring({ mode: 'value', entity: 'sensor.filter' }), false);
    expect(s.dasharray).toBe('100 101');
    expect(s.dashoffset).toBe('35');
    expect(s.transition).toBe('stroke-dashoffset 1s ease-in-out, stroke 0.5s ease');
    expect(s.opacity).toBe(1);
  });

  it('value 0 hides the dot a round cap would draw', () => {
    expect(ringStroke(ring({ mode: 'value', entity: 'sensor.na' }), false).opacity).toBe(0);
  });

  it('snake: a dash of the length running around once per lap', () => {
    const s = ringStroke(ring({ mode: 'animated', animation: 'snake', length: 30, speed: '2s' }), false);
    expect(s.dasharray).toBe('30 70');
    expect(s.animation).toBe('mc-ring-run 2s linear infinite');
  });

  it('chase dots: zero-length dashes with round caps', () => {
    const s = ringStroke(ring({ mode: 'animated', animation: 'dots', linecap: 'butt' }), false);
    expect(s.dasharray).toBe('0 8.333');
    expect(s.linecap).toBe('round');
    expect(s.animation).toBe('mc-ring-run 3s linear infinite');
  });

  it('pulse breathes, full is static', () => {
    expect(ringStroke(ring({ mode: 'animated', animation: 'pulse' }), false).animation).toBe('mc-ring-pulse 3s ease-in-out infinite');
    const full = ringStroke(ring({ mode: 'animated', animation: 'full' }), false);
    expect(full.dasharray).toBe('none');
    expect(full.animation).toBe('none');
  });

  it('reduced motion: no motion, value changes are instant', () => {
    expect(ringStroke(ring({ mode: 'animated', animation: 'snake' }), true).animation).toBe('none');
    expect(ringStroke(ring({ mode: 'animated', animation: 'dots' }), true).animation).toBe('none');
    expect(ringStroke(ring({ mode: 'value', entity: 'sensor.filter' }), true).transition).toBe('none');
  });
});

// ── Card rendering ──

type CardEl = HTMLElement & { setConfig(c: MagicCardConfig): void; hass?: HomeAssistant; updateComplete: Promise<boolean> };

async function mount(config: Partial<MagicCardConfig>) {
  const el = document.createElement('magic-card') as CardEl;
  el.setConfig({ type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x' }] }] }], ...config } as MagicCardConfig);
  el.hass = { states, language: 'en', themes: { themes: {} } } as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  return el.shadowRoot!;
}

describe('card renders rings', () => {
  it('module: an aria-hidden mc-ring in the wrapper, filled from the module entity', async () => {
    const root = await mount({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'icon', icon: 'mdi:fan', entity: 'sensor.filter', design: { ring: { mode: 'value' } } }] }] }] });
    const w = root.querySelector('.mc-module-wrapper')!;
    expect(w.hasAttribute('data-mc-ring')).toBe(true);
    const ring = w.querySelector(':scope > mc-ring') as HTMLElement & { ring: { fill: number } };
    expect(ring.getAttribute('aria-hidden')).toBe('true');
    expect(ring.ring.fill).toBeCloseTo(0.65);
  });

  it('row, column and card rings', async () => {
    const root = await mount({
      ring: { mode: 'animated' },
      rows: [{ id: 'r', design: { ring: { mode: 'animated', animation: 'full' } }, columns: [{ id: 'c', design: { ring: { mode: 'animated' } }, modules: [] }] }],
    });
    expect(root.querySelector('ha-card')!.hasAttribute('data-mc-ring')).toBe(true);
    expect(root.querySelector('ha-card > mc-ring')).toBeTruthy();
    expect(root.querySelector('.mc-row > mc-ring')).toBeTruthy();
    expect(root.querySelector('.mc-column > mc-ring')).toBeTruthy();
  });

  it('card ring: ha-card clips its edge, so an Outside ring is drawn Inside (visible) instead of nothing', async () => {
    const root = await mount({ ring: { mode: 'animated', position: 'outside' }, rows: [{ id: 'r', design: { ring: { mode: 'animated', position: 'outside' } }, columns: [] }] });
    expect((root.querySelector('ha-card > mc-ring') as unknown as { ring: { position: string } }).ring.position).toBe('inside');
    // rows are not clipped by ha-card's edge: their outside ring stays outside
    expect((root.querySelector('.mc-row > mc-ring') as unknown as { ring: { position: string } }).ring.position).toBe('outside');
    expect(resolveRing({ mode: 'animated', position: 'center' }, { clipped: true })!.position).toBe('center');
  });

  it('a module ring with an entity colour sets the wrapper entity colour', async () => {
    const root = await mount({ rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'icon', icon: 'mdi:fan', entity: 'fan.purifier', design: { ring: { mode: 'animated', color: 'entity' } } }] }] }] });
    expect(root.querySelector('.mc-module-wrapper')!.getAttribute('style')).toContain('--mc-entity-color');
  });

  it('no ring: no attribute, no element', async () => {
    const root = await mount({});
    expect(root.querySelector('[data-mc-ring], mc-ring')).toBeNull();
  });
});

describe('mc-ring element', () => {
  it('draws the outline from its parent size and radii, track below, pathLength 100', async () => {
    const parent = document.createElement('div');
    parent.style.borderRadius = '50%';
    Object.defineProperty(parent, 'offsetWidth', { value: 80 });
    Object.defineProperty(parent, 'offsetHeight', { value: 80 });
    document.body.appendChild(parent);
    const el = document.createElement('mc-ring') as HTMLElement & { ring: unknown; measure(): void; updateComplete: Promise<boolean> };
    el.ring = resolveRing({ mode: 'value', entity: 'sensor.filter', track_opacity: 20, position: 'center' }, { states });
    parent.appendChild(el);
    await el.updateComplete;
    el.measure();
    await el.updateComplete;
    const paths = [...el.shadowRoot!.querySelectorAll('path')];
    expect(paths).toHaveLength(2);
    expect(paths.every((p) => p.getAttribute('pathLength') === '100')).toBe(true);
    expect(paths[1].getAttribute('d')).toBe('M40 0 A40 40 0 0 1 80 40 A40 40 0 0 1 40 80 A40 40 0 0 1 0 40 A40 40 0 0 1 40 0 Z');
    expect(paths[1].getAttribute('style')).toContain('stroke-dashoffset: 35');
    el.remove();
  });

  it('a card re-render with an equal ring does not re-measure; a parent style change does', async () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    const el = document.createElement('mc-ring') as HTMLElement & { ring: unknown; measure(): void; updateComplete: Promise<boolean> };
    el.ring = resolveRing({ mode: 'animated' }, { states });
    parent.appendChild(el);
    await el.updateComplete;
    const spy = vi.spyOn(el, 'measure');
    el.ring = resolveRing({ mode: 'animated' }, { states });
    await el.updateComplete;
    expect(spy).not.toHaveBeenCalled();
    parent.style.borderRadius = '20px';
    await new Promise((r) => setTimeout(r, 0));
    expect(spy).toHaveBeenCalled();
    el.remove();
    parent.remove();
  });

  it('all rings share one ResizeObserver', async () => {
    const ro = ringResizeObserver()!;
    const observe = vi.spyOn(ro, 'observe');
    const unobserve = vi.spyOn(ro, 'unobserve');
    const parents = [document.createElement('div'), document.createElement('div')];
    for (const p of parents) {
      document.body.appendChild(p);
      const el = document.createElement('mc-ring') as HTMLElement & { ring: unknown; updateComplete: Promise<boolean> };
      el.ring = resolveRing({ mode: 'animated' }, { states });
      p.appendChild(el);
      await el.updateComplete;
    }
    expect(observe.mock.calls.map((c) => c[0])).toEqual(parents);
    expect(ringResizeObserver()).toBe(ro);
    parents.forEach((p) => p.remove());
    expect(unobserve.mock.calls.map((c) => c[0])).toEqual(parents);
  });
});

describe('ring starts', () => {
  it('accepts all 8 and falls back to top', () => {
    for (const s of ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left']) {
      expect(resolveRing({ mode: 'animated', start: s as any }, {})?.start).toBe(s);
    }
    expect(resolveRing({ mode: 'animated', start: 'nope' as any }, {})?.start).toBe('top');
  });
});

describe('ring gradient', () => {
  const G = 'linear-gradient(90deg, #f00, #0f0, #00f)';
  const mountRing = async (r: unknown) => {
    const parent = document.createElement('div');
    Object.defineProperty(parent, 'offsetWidth', { value: 100 });
    Object.defineProperty(parent, 'offsetHeight', { value: 50 });
    document.body.appendChild(parent);
    const el = document.createElement('mc-ring') as HTMLElement & { ring: unknown; measure(): void; updateComplete: Promise<boolean> };
    el.ring = r;
    parent.appendChild(el);
    await el.updateComplete;
    el.measure();
    await el.updateComplete;
    return { el, done: () => parent.remove() };
  };
  it('resolveRing: paint is the gradient, colour its first stop', () => {
    const r = resolveRing({ mode: 'animated', color: G }, { states })!;
    expect(r.paint).toBe(G);
    expect(r.color).toBe('#f00');
  });
  it('an invalid gradient gives no paint and the default colour', () => {
    const r = resolveRing({ mode: 'animated', color: 'linear-gradient(red, url(x))' }, { states })!;
    expect(r.paint).toBeUndefined();
    expect(r.color).toContain('--primary-color');
    expect(resolveRing({ mode: 'animated', color: 'red' }, { states })!.paint).toBeUndefined();
  });
  it('the glow and the track use stop 0', () => {
    const r = resolveRing({ mode: 'animated', color: G, track_opacity: 20 }, { states })!;
    expect(r.track).toContain('#f00');
  });
  it('mc-ring draws a linearGradient with every stop and strokes with url(#g)', async () => {
    const { el, done } = await mountRing(resolveRing({ mode: 'animated', color: G }, { states }));
    const lg = el.shadowRoot!.querySelector('linearGradient')!;
    expect(lg.querySelectorAll('stop')).toHaveLength(3);
    expect(lg.getAttribute('gradientUnits')).toBe('userSpaceOnUse');
    expect(lg.id).toBe('g');
    expect(el.shadowRoot!.querySelector('path:last-of-type')!.getAttribute('style')).toContain('stroke: url(#g)');
    done();
  });
  it('a solid ring has no gradient', async () => {
    const { el, done } = await mountRing(resolveRing({ mode: 'animated', color: 'red' }, { states }));
    expect(el.shadowRoot!.querySelector('linearGradient')).toBeNull();
    done();
  });
  it('a matching threshold replaces the gradient', async () => {
    const r = resolveRing({ mode: 'value', entity: 'sensor.filter', color: G, thresholds: [{ from: 0, color: '#123456' }] }, { states })!;
    expect(r.color).toBe('#123456');
    const { el, done } = await mountRing(r);
    expect(el.shadowRoot!.querySelector('linearGradient')).toBeNull();
    expect(el.shadowRoot!.innerHTML).toContain('stroke: #123456');
    done();
  });
  it('a value ring keeps its gradient when no threshold matches', async () => {
    const r = resolveRing({ mode: 'value', entity: 'sensor.filter', color: G, thresholds: [{ from: 90, color: '#123456' }] }, { states })!;
    const { el, done } = await mountRing(r);
    expect(el.shadowRoot!.querySelector('linearGradient')).not.toBeNull();
    done();
  });
});
