import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LitElement } from 'lit';
import { defineBgStack, type McBgStack } from '../src/layers/stack/mc-bg-stack';
import type { BackgroundLayerConfig, BgLayerStatus, BgStackHost } from '../src/contracts/bg-stack';
import type { HomeAssistant } from '../src/types';

// Live (library image) layers of <mc-bg-stack>: routing, no URL for a reference, hass pushes, state swaps.

const decodes: string[] = [];
class FakeImage {
  onload?: () => void;
  onerror?: () => void;
  complete = false;
  naturalWidth = 0;
  src = '';
  decode(): Promise<void> {
    decodes.push(this.src);
    return Promise.resolve();
  }
}

const calls = { need: 0, resolve: [] as string[] };
const mkHost = (): BgStackHost => ({
  resolveImage: (_h, s) => (calls.resolve.push(s), s),
  cardEntity: () => 'sensor.mode',
  cssColor: (v) => v,
  observeOffscreen: () => () => {},
  badgeHost: () => undefined,
  lowPower: () => false,
  staleText: (s) => `${s}`,
  needImage: () => void calls.need++,
});

const hassOf = (state: string): HomeAssistant =>
  ({ states: { 'sensor.mode': { entity_id: 'sensor.mode', state, attributes: {} } } }) as unknown as HomeAssistant;

let el: McBgStack;
const statuses: BgLayerStatus[] = [];
const flush = async (ms = 0) => {
  await vi.advanceTimersByTimeAsync(ms);
  await el.updateComplete;
};
const mount = async (layers: BackgroundLayerConfig[], hass?: HomeAssistant) => {
  el = document.createElement('mc-bg-stack') as McBgStack;
  el.addEventListener('mc-bg-layer-status', (e) => statuses.push((e as CustomEvent<BgLayerStatus>).detail));
  el.host = mkHost();
  el.hass = hass;
  el.layers = layers;
  document.body.appendChild(el);
  await flush();
  return el;
};
type Drawing = HTMLElement & { ref?: string; hass?: unknown; layer?: unknown; at?: number };
const drawings = () => [...el.shadowRoot!.querySelectorAll('mc-svg-image')] as Drawing[];

const realMatchMedia = window.matchMedia;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('Image', FakeImage);
  defineBgStack();
  decodes.length = 0;
  statuses.length = 0;
  calls.need = 0;
  calls.resolve = [];
});
afterEach(() => {
  el?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.matchMedia = realMatchMedia;
});

describe('a layer without a library image', () => {
  it('never asks for the chunk and draws no element', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg' }, { type: 'color', color: '#000' }]);
    expect(calls.need).toBe(0);
    expect(drawings()).toHaveLength(0);
    expect(decodes.map((u) => new URL(u).pathname)).toEqual(['/local/a.jpg']);
  });
});

describe('a layer whose image is a library reference', () => {
  it('starts the chunk, draws <mc-svg-image> in the picture box and decodes nothing', async () => {
    const layer: BackgroundLayerConfig = { type: 'image', image: 'mcu-image:plan', size: 'contain' };
    await mount([layer]);
    expect(calls.need).toBeGreaterThan(0);
    expect(decodes).toEqual([]);
    const [d] = drawings();
    expect(d.parentElement?.classList.contains('pic')).toBe(true);
    expect(d.ref).toBe('mcu-image:plan');
    expect(d.layer).toBe(layer);
    expect(d.at).toBe(0);
    expect(statuses.at(-1)).toMatchObject({ index: 0, status: 'ok' });
  });

  it('never reaches the host URL resolver, safeImageUrl or a CSS url()', async () => {
    await mount([{ type: 'image', image: 'mcu-image:plan' }]);
    expect(calls.resolve).toEqual([]);
    const pic = el.shadowRoot!.querySelector('.pic') as HTMLElement;
    expect(pic.getAttribute('style') ?? '').not.toMatch(/url\(|background-image/);
    expect(el.shadowRoot!.innerHTML).not.toMatch(/url\(/);
  });

  it('draws a reference that a followed attribute holds the same way', async () => {
    const hass = { states: { 'sensor.x': { entity_id: 'sensor.x', state: 'on', attributes: { entity_picture: 'mcu-image:attr' } } } } as unknown as HomeAssistant;
    await mount([{ type: 'image', entity: 'sensor.x' }], hass);
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:attr']);
    expect(calls.resolve).toEqual([]);
  });

  it('keeps pan / zoom framing on the picture box', async () => {
    await mount([{ type: 'image', image: 'mcu-image:plan', pan_zoom: { from: 100, to: 120 } }]);
    expect(drawings()).toHaveLength(1);
  });
});

describe('hass pushes', () => {
  it('re-render a stack that shows a live layer, so the element receives hass', async () => {
    await mount([{ type: 'image', image: 'mcu-image:plan' }], hassOf('a'));
    const next = hassOf('b');
    el.hass = next;
    await flush();
    expect(drawings()[0].hass).toBe(next);
  });

  it('do not re-render a stack without one', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg' }], hassOf('a'));
    const render = vi.spyOn(el as unknown as { render(): unknown }, 'render');
    el.hass = hassOf('b');
    await flush();
    expect(render).not.toHaveBeenCalled();
  });
});

describe('a states swap between two references', () => {
  const layer: BackgroundLayerConfig = { type: 'image', states: { day: 'mcu-image:sun', night: 'mcu-image:moon' } };

  it('keeps both elements for the 300 ms crossfade, then one', async () => {
    await mount([layer], hassOf('day'));
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:sun']);
    el.hass = hassOf('night');
    await flush();
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:sun', 'mcu-image:moon']);
    await flush(299);
    expect(drawings()).toHaveLength(2);
    await flush(2);
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:moon']);
  });

  it('swaps at once under reduced motion', async () => {
    window.matchMedia = ((q: string) => ({ matches: /reduce/.test(q), addEventListener() {}, removeEventListener() {} })) as never;
    await mount([layer], hassOf('day'));
    el.hass = hassOf('night');
    await flush();
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:moon']);
  });

  it('goes from a picture to a reference without mixing the two paths', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg', states: { night: 'mcu-image:moon' } }], hassOf('day'));
    expect(drawings()).toHaveLength(0);
    el.hass = hassOf('night');
    await flush();
    expect(drawings().map((d) => d.ref)).toEqual(['mcu-image:moon']);
    expect(decodes.map((u) => new URL(u).pathname)).toEqual(['/local/a.jpg']);
  });
});

describe('properties set before the element is defined', () => {
  it('arrive when the chunk defines it', async () => {
    const layer: BackgroundLayerConfig = { type: 'image', image: 'mcu-image:late' };
    const hass = hassOf('a');
    await mount([layer], hass);
    class Late extends LitElement {
      static properties = { ref: { attribute: false }, hass: { attribute: false }, layer: { attribute: false }, at: { attribute: false } };
      declare ref?: string;
      declare hass?: unknown;
      declare layer?: unknown;
      declare at?: number;
    }
    customElements.define('mc-svg-image', Late);
    const d = el.shadowRoot!.querySelector('mc-svg-image') as Late;
    await d.updateComplete;
    expect([d.ref, d.hass, d.layer, d.at]).toEqual(['mcu-image:late', hass, layer, 0]);
  });
});
