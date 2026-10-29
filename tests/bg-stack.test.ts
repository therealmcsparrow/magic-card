import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { install } from '../src/layers/stack/chunk';
import { defineBgStack, type McBgStack } from '../src/layers/stack/mc-bg-stack';
import { provideBgFx } from '../src/layers/stack/fx-slot';
import type { BackgroundLayerConfig, BgLayerStatus, BgStackHost } from '../src/contracts/bg-stack';
import type { HomeAssistant } from '../src/types';

// ── fakes ──
const decodes: string[] = [];
let failUrl: (u: string) => boolean = () => false;
let holdUrl: ((u: string) => boolean) | undefined;
const held: Array<() => void> = [];

class FakeImage {
  onload?: () => void;
  onerror?: () => void;
  complete = false;
  naturalWidth = 0;
  src = '';
  decode(): Promise<void> {
    const url = this.src;
    decodes.push(url);
    return new Promise((res, rej) => {
      const settle = () => (failUrl(url) ? rej(new Error('bad')) : res());
      if (holdUrl?.(url)) held.push(settle);
      else queueMicrotask(settle);
    });
  }
}

const mkHass = (states: Record<string, { state: string; attributes?: Record<string, unknown> }> = {}): HomeAssistant =>
  ({
    states: Object.fromEntries(Object.entries(states).map(([id, s]) => [id, { entity_id: id, state: s.state, attributes: s.attributes ?? {} }])),
  }) as unknown as HomeAssistant;

let badge: HTMLElement;
let low = false;
let cardEntity: string | undefined;
const mkHost = (): BgStackHost => ({
  resolveImage: (_h, s) => s,
  cardEntity: () => cardEntity,
  cssColor: (v) => v,
  observeOffscreen: () => () => {},
  badgeHost: () => badge,
  lowPower: () => low,
  staleText: (s) => `Not updated ${s}s`,
  needImage: () => {},
});

let el: McBgStack;
const statuses: BgLayerStatus[] = [];
const flush = async (ms = 0) => {
  await vi.advanceTimersByTimeAsync(ms);
  await el.updateComplete;
};
const mount = async (layers: BackgroundLayerConfig[], hass?: HomeAssistant, host: BgStackHost = mkHost()) => {
  el = document.createElement('mc-bg-stack') as McBgStack;
  el.addEventListener('mc-bg-layer-status', (e) => statuses.push((e as CustomEvent<BgLayerStatus>).detail));
  el.host = host;
  el.hass = hass;
  el.layers = layers;
  document.body.appendChild(el);
  await flush();
  return el;
};
const boxes = () => [...el.shadowRoot!.querySelectorAll('.l')] as HTMLElement[];
const pics = () => [...el.shadowRoot!.querySelectorAll('.pic, .fill')] as HTMLElement[];
const styleOf = (n: Element) => n.getAttribute('style') ?? '';
const setOffscreen = async (off: boolean) => {
  el.toggleAttribute('offscreen', off);
  await flush();
};

const realMatchMedia = window.matchMedia;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('Image', FakeImage);
  defineBgStack();
  install();
  decodes.length = 0;
  statuses.length = 0;
  held.length = 0;
  failUrl = () => false;
  holdUrl = undefined;
  low = false;
  cardEntity = undefined;
  badge = document.createElement('div');
  document.body.appendChild(badge);
});
afterEach(() => {
  el?.remove();
  provideBgFx(undefined);
  badge.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.matchMedia = realMatchMedia;
});

describe('<mc-bg-stack> definition', () => {
  it('defining twice does not throw and defines the element once; install() twice is harmless', () => {
    expect(() => {
      defineBgStack();
      defineBgStack();
      install();
      install();
    }).not.toThrow();
    expect(customElements.get('mc-bg-stack')).toBeDefined();
  });
});

describe('<mc-bg-stack> non-image layers', () => {
  it('paints back to front: the last YAML entry is the first box', async () => {
    await mount([
      { type: 'color', color: '#111111' },
      { type: 'color', color: '#222222' },
    ]);
    const colours = pics().map((p) => /background-color:\s*([^;]+)/.exec(styleOf(p))?.[1]);
    expect(colours).toEqual(['#222222', '#111111']);
  });

  it('opacity, blend and hidden layers', async () => {
    await mount([
      { type: 'color', color: 'red', opacity: 40, blend: 'multiply' },
      { type: 'color', color: 'blue', hidden: true },
    ]);
    expect(boxes()).toHaveLength(1);
    expect(styleOf(boxes()[0])).toMatch(/opacity:\s*0\.4/);
    expect(styleOf(boxes()[0])).toMatch(/mix-blend-mode:\s*multiply/);
  });

  it('refuses hostile colours, blends and gradients', async () => {
    await mount([
      { type: 'color', color: 'red; background-image: url(https://evil/x)' },
      { type: 'color', color: 'red', blend: 'normal; x' as never },
      { type: 'gradient', gradient: 'linear-gradient(red, url(https://evil/x.png))' },
      { type: 'pattern', pattern: 'dots', color: 'url(https://evil/x)' },
    ]);
    const html = el.shadowRoot!.innerHTML;
    expect(html).not.toContain('evil');
    expect(html).not.toMatch(/url\(/);
    expect(styleOf(boxes().find((b) => /blend/.test(styleOf(b)))!)).toMatch(/mix-blend-mode:\s*normal/);
  });

  it('draws a valid gradient and a pattern', async () => {
    await mount([
      { type: 'pattern', pattern: 'grid', color: 'rgba(255,255,255,0.3)', size: 20, thickness: 2 },
      { type: 'gradient', gradient: 'linear-gradient(90deg, #ff0000, #0000ff)' },
    ]);
    const [g, p] = pics();
    expect(styleOf(g)).toContain('linear-gradient(90deg, #ff0000, #0000ff)');
    expect(styleOf(p)).toContain('20px 20px');
  });

  it('keeps at most four layers and ignores junk entries', async () => {
    const layers = Array.from({ length: 10 }, () => ({ type: 'color', color: 'red' }) as BackgroundLayerConfig);
    await mount([null as never, ...layers]);
    expect(boxes().length).toBeLessThanOrEqual(3);
  });

  it('reports ok / empty status per layer', async () => {
    await mount([{ type: 'color', color: 'red' }, { type: 'gradient', gradient: 'nope' }]);
    expect(statuses).toContainEqual({ index: 0, status: 'ok' });
    expect(statuses).toContainEqual({ index: 1, status: 'empty' });
  });
});

describe('<mc-bg-stack> image layers', () => {
  it('decodes off the DOM, then shows the picture with a fade', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg', size: 'cover', position: 'top' }]);
    expect(decodes).toEqual([`${location.origin}/local/a.jpg`]);
    const pic = el.shadowRoot!.querySelector('.pic') as HTMLElement;
    expect(styleOf(pic)).toContain('/local/a.jpg');
    expect(styleOf(pic)).toContain('center top');
    expect(el.shadowRoot!.querySelector('.img')).not.toBeNull();
    expect(statuses.map((s) => s.status)).toEqual(['loading', 'ok']);
  });

  describe('arrival fade', () => {
    const fading = () => el.shadowRoot!.querySelectorAll('.img.in').length;
    const layer: BackgroundLayerConfig[] = [{ type: 'image', image: '/local/a.jpg' }];
    const reduced = () => {
      window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} })) as never;
    };

    it('an active on-screen card fades the first picture in', async () => {
      await mount(layer);
      expect(fading()).toBe(1);
      expect(el.shadowRoot!.querySelectorAll('.img')).toHaveLength(1);
    });

    it('a card that is off screen (paused) shows the picture at once', async () => {
      el = document.createElement('mc-bg-stack') as McBgStack;
      el.setAttribute('offscreen', '');
      el.host = mkHost();
      el.layers = layer;
      document.body.appendChild(el);
      await flush();
      expect(el.shadowRoot!.querySelectorAll('.img')).toHaveLength(1);
      expect(fading()).toBe(0);
    });

    it('reduced motion never adds the fading class', async () => {
      reduced();
      await mount(layer);
      expect(el.shadowRoot!.querySelectorAll('.img')).toHaveLength(1);
      expect(fading()).toBe(0);
    });

    it('a picture that arrived paused is not faded when the card resumes or scrolls back in', async () => {
      el = document.createElement('mc-bg-stack') as McBgStack;
      el.setAttribute('offscreen', '');
      el.host = mkHost();
      el.layers = layer;
      document.body.appendChild(el);
      await flush();
      await setOffscreen(false);
      el.requestUpdate();
      await flush();
      expect(fading()).toBe(0);
    });

    it('a picture that arrived active keeps its class while the card pauses and resumes', async () => {
      await mount(layer);
      await setOffscreen(true);
      await setOffscreen(false);
      expect(fading()).toBe(1);
    });

    it('a picture that arrives while off screen is not faded when the card comes back', async () => {
      const hass = mkHass({ 'sensor.x': { state: 'a' } });
      await mount([{ type: 'image', entity: 'sensor.x', states: { a: '/local/a.jpg', b: '/local/b.jpg' } }], hass);
      await setOffscreen(true);
      el.hass = mkHass({ 'sensor.x': { state: 'b' } });
      await flush();
      expect(pics()).toHaveLength(1);
      expect(fading()).toBe(0);
      await setOffscreen(false);
      expect(fading()).toBe(0);
    });

    it('a reconnected stack does not replay a finished fade', async () => {
      await mount(layer);
      el.remove();
      document.body.appendChild(el);
      await flush();
      expect(fading()).toBe(0);
    });
  });

  it('refuses hostile image values: nothing loaded, load-failed reported', async () => {
    for (const bad of ['javascript:alert(1)', ' JaVa\tscript:alert(1)', 'data:image/svg+xml,<svg/>', '//evil.example/x.png', 'url(x) ;}']) {
      statuses.length = 0;
      await mount([{ type: 'image', image: bad }]);
      expect(decodes).toEqual([]);
      expect(el.shadowRoot!.querySelector('.pic')).toBeNull();
      expect(statuses).toContainEqual({ index: 0, status: 'error', reason: 'load-failed' });
      el.remove();
    }
  });

  it('crossfades: the old picture stays until the new one is decoded and faded in', async () => {
    const hass = mkHass({ 'sensor.x': { state: 'a' } });
    await mount([{ type: 'image', entity: 'sensor.x', states: { a: '/local/a.jpg', b: '/local/b.jpg' } }], hass);
    expect(pics().map((p) => styleOf(p).includes('/a.jpg'))).toEqual([true]);
    holdUrl = (u) => u.endsWith('/b.jpg');
    el.hass = mkHass({ 'sensor.x': { state: 'b' } });
    await flush();
    expect(pics().map((p) => styleOf(p).includes('/a.jpg'))).toEqual([true]); // b still decoding, a stays
    held.forEach((f) => f());
    await flush();
    expect(pics()).toHaveLength(2); // a under b during the fade
    expect(styleOf(pics()[1])).toContain('/b.jpg');
    await flush(350);
    expect(pics()).toHaveLength(1);
    expect(styleOf(pics()[0])).toContain('/b.jpg');
  });

  it('a state with no match falls back to image, then to nothing (no-state-image)', async () => {
    const hass = mkHass({ 'sensor.x': { state: 'zzz' } });
    await mount([{ type: 'image', entity: 'sensor.x', states: { a: '/local/a.jpg' }, image: '/local/fallback.jpg' }], hass);
    expect(styleOf(pics()[0])).toContain('/fallback.jpg');
    el.remove();
    statuses.length = 0;
    await mount([{ type: 'image', entity: 'sensor.x', states: { a: '/local/a.jpg' } }], hass);
    expect(pics()).toHaveLength(0);
    expect(statuses).toContainEqual({ index: 0, status: 'empty', reason: 'no-state-image', detail: 'zzz' });
  });

  it('states alone use the card entity', async () => {
    cardEntity = 'light.lamp';
    await mount([{ type: 'image', states: { on: '/local/on.jpg' } }], mkHass({ 'light.lamp': { state: 'on' } }));
    expect(styleOf(pics()[0])).toContain('/on.jpg');
  });

  it('a state called __proto__ or constructor never reaches the prototype chain', async () => {
    const states = JSON.parse('{"__proto__":"/local/evil.jpg","constructor":"/local/evil2.jpg","ok":"/local/ok.jpg"}');
    await mount([{ type: 'image', entity: 'sensor.x', states }], mkHass({ 'sensor.x': { state: '__proto__' } }));
    expect(decodes).toEqual([]);
    expect(pics()).toHaveLength(0);
    el.remove();
    await mount([{ type: 'image', entity: 'sensor.x', states }], mkHass({ 'sensor.x': { state: 'constructor' } }));
    expect(decodes).toEqual([]);
    expect(({} as Record<string, unknown>).evil).toBeUndefined();
  });

  it('a 10k-entry states map renders quickly with at most 32 entries read', async () => {
    const states: Record<string, string> = {};
    for (let i = 0; i < 10_000; i++) states[`s${i}`] = `/local/${i}.jpg`;
    states.s9999 = '/local/last.jpg';
    const t = performance.now();
    await mount([{ type: 'image', entity: 'sensor.x', states }], mkHass({ 'sensor.x': { state: 's9999' } }));
    expect(performance.now() - t).toBeLessThan(500);
    expect(pics()).toHaveLength(0); // beyond the cap
    expect(statuses).toContainEqual({ index: 0, status: 'empty', reason: 'no-state-image', detail: 's9999' });
  });

  it('follows a device: entity_picture, missing entity, no picture', async () => {
    await mount([{ type: 'image', entity: 'media_player.tv' }], mkHass({ 'media_player.tv': { state: 'on', attributes: { entity_picture: '/api/media_player_proxy/x?token=1' } } }));
    expect(styleOf(pics()[0])).toContain('/api/media_player_proxy/x');
    el.remove();
    statuses.length = 0;
    await mount([{ type: 'image', entity: 'media_player.nope' }], mkHass());
    expect(statuses).toContainEqual({ index: 0, status: 'empty', reason: 'entity-missing', detail: 'media_player.nope' });
    el.remove();
    statuses.length = 0;
    await mount([{ type: 'image', entity: 'media_player.tv', attribute: 'album' }], mkHass({ 'media_player.tv': { state: 'on' } }));
    expect(statuses).toContainEqual({ index: 0, status: 'empty', reason: 'no-picture', detail: 'media_player.tv' });
  });

  it('refuses hostile entity ids and attribute names', async () => {
    await mount([{ type: 'image', entity: '__proto__' }, { type: 'image', entity: 'a.b', attribute: 'constructor' }], mkHass({ 'a.b': { state: 'on' } }));
    expect(decodes).toEqual([]);
  });

  it('a hostile entity_picture value is not loaded', async () => {
    await mount([{ type: 'image', entity: 'sensor.x' }], mkHass({ 'sensor.x': { state: 'on', attributes: { entity_picture: 'javascript:alert(1)' } } }));
    expect(decodes).toEqual([]);
    expect(pics()).toHaveLength(0);
  });

  it('a load error renders nothing', async () => {
    failUrl = () => true;
    await mount([{ type: 'image', image: '/local/missing.jpg' }]);
    expect(pics()).toHaveLength(0);
    expect(statuses).toContainEqual({ index: 0, status: 'error', reason: 'load-failed' });
  });

  it('a decode that resolves after disconnect writes nothing', async () => {
    holdUrl = () => true;
    await mount([{ type: 'image', image: '/local/a.jpg' }]);
    el.remove();
    statuses.length = 0;
    held.forEach((f) => f());
    await flush();
    expect(statuses).toEqual([]);
    expect(el.shadowRoot!.querySelector('.pic')).toBeNull();
  });

  it('blur adds a 3x bleed on a static box, never on the animated image', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg', blur: 10, pan_zoom: {} }]);
    const box = boxes()[0];
    expect(styleOf(box)).toMatch(/filter:\s*blur\(10px\)/);
    expect(styleOf(box)).toMatch(/top:\s*-30px/);
    const pic = el.shadowRoot!.querySelector('.pic') as HTMLElement;
    expect(styleOf(pic)).not.toMatch(/filter|blur/);
  });

  it('blur is clamped to 24 px', async () => {
    await mount([{ type: 'image', image: '/local/a.jpg', blur: 500 }]);
    expect(styleOf(boxes()[0])).toMatch(/blur\(24px\)/);
  });

  it('low power: no blur, blend normal, pan / zoom at rest', async () => {
    low = true;
    await mount([{ type: 'image', image: '/local/a.jpg', blur: 10, blend: 'multiply', pan_zoom: {} }]);
    expect(styleOf(boxes()[0])).not.toMatch(/blur/);
    expect(styleOf(boxes()[0])).toMatch(/mix-blend-mode:\s*normal/);
    expect(el.shadowRoot!.querySelector('.pic')!.getAttribute('data-pz')).toBe('start');
  });

  it('a hass push that changes nothing for any layer does not re-render', async () => {
    const hass = mkHass({ 'sensor.x': { state: 'a' }, 'sensor.other': { state: '1' } });
    await mount([{ type: 'image', entity: 'sensor.x', states: { a: '/local/a.jpg' } }], hass);
    const render = vi.spyOn(el as unknown as { render: () => unknown }, 'render');
    el.hass = mkHass({ 'sensor.x': { state: 'a' }, 'sensor.other': { state: '2' } });
    await flush();
    expect(render).not.toHaveBeenCalled();
    el.hass = mkHass({ 'sensor.x': { state: 'a' }, 'sensor.other': { state: '2' } });
    expect(decodes).toHaveLength(1);
  });
});

describe('<mc-bg-stack> pan / zoom', () => {
  const layer: BackgroundLayerConfig = { type: 'image', image: '/local/a.jpg', pan_zoom: { to: 130, focus: 'top-left', duration: 20 } };
  const motion = () => el.shadowRoot!.querySelector('.pic')!.getAttribute('data-pz');

  it('transform on the image box with custom properties; plays while on screen', async () => {
    await mount([layer]);
    const s = styleOf(el.shadowRoot!.querySelector('.pic')!);
    expect(s).toContain('--t: 1.3');
    expect(s).toContain('--d: 20s');
    expect(s).toContain('--tx: 15%');
    expect(motion()).toBe('play');
  });

  it('pauses when off screen and when the page is hidden', async () => {
    await mount([layer]);
    await setOffscreen(true);
    expect(motion()).toBe('pause');
    await setOffscreen(false);
    expect(motion()).toBe('play');
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    await flush();
    expect(motion()).toBe('pause');
  });

  it('rests at the start framing under reduced motion; the studio preview overrides', async () => {
    const mq = { matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    window.matchMedia = (() => mq) as never;
    await mount([layer]);
    expect(motion()).toBe('start');
    el.preview = 'play';
    await flush();
    expect(motion()).toBe('play');
    el.preview = 'end';
    await flush();
    expect(motion()).toBe('end');
  });

  it('pause_when_idle: rests after 120 s without input, resumes on input', async () => {
    await mount([{ ...layer, pan_zoom: { ...layer.pan_zoom, pause_when_idle: true } }]);
    expect(motion()).toBe('play');
    await flush(120_001);
    expect(motion()).toBe('pause');
    document.dispatchEvent(new Event('pointermove'));
    await flush();
    expect(motion()).toBe('play');
  });

  it('off screen clears the idle timer too', async () => {
    await mount([{ ...layer, pan_zoom: { ...layer.pan_zoom, pause_when_idle: true } }]);
    await setOffscreen(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('<mc-bg-stack> camera refresh and stale', () => {
  const cam: BackgroundLayerConfig = { type: 'image', entity: 'camera.door', refresh: 10 };
  const hass = () => mkHass({ 'camera.door': { state: 'idle', attributes: { entity_picture: '/api/camera_proxy/camera.door?token=abc' } } });

  it('refreshes on the period with a cache-busting query on the parsed URL', async () => {
    await mount([cam], hass());
    expect(decodes).toHaveLength(1);
    await flush(10_000);
    expect(decodes).toHaveLength(2);
    expect(decodes[1]).toMatch(/\?token=abc&mc_t=\d+$/);
    await flush(10_000);
    expect(decodes).toHaveLength(3);
  });

  it('the refresh period has a 5 s floor', async () => {
    await mount([{ ...cam, refresh: 1 }], hass());
    await flush(4_000);
    expect(decodes).toHaveLength(1);
    await flush(1_001);
    expect(decodes).toHaveLength(2);
  });

  it('clears every timer off screen and when the page is hidden, and refreshes at once on return', async () => {
    await mount([cam], hass());
    await setOffscreen(true);
    expect(vi.getTimerCount()).toBe(0);
    await flush(60_000);
    expect(decodes).toHaveLength(1);
    await setOffscreen(false);
    await flush();
    expect(decodes).toHaveLength(2); // one immediate refresh, it was due
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    await flush(400); // the 300 ms crossfade of the frame just swapped in may still run
    expect(vi.getTimerCount()).toBe(0);
    await flush(60_000);
    expect(decodes).toHaveLength(2);
  });

  it('clears the timer when disconnected', async () => {
    await mount([cam], hass());
    el.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('three failed refreshes show the stale pill, dim the frame, and a good frame clears it', async () => {
    await mount([cam], hass());
    failUrl = (u) => u.includes('mc_t');
    await flush(10_000);
    await flush(10_000);
    expect(badge.textContent).toBe('');
    await flush(10_000);
    expect(badge.textContent).toMatch(/^Not updated \d+s$/);
    expect(styleOf(boxes()[0])).toMatch(/grayscale\(1\)/);
    expect(styleOf(boxes()[0])).toMatch(/opacity:\s*0\.6/);
    expect(statuses.some((s) => s.reason === 'stale')).toBe(true);
    failUrl = () => false;
    await flush(10_000);
    expect(badge.textContent).toBe('');
    expect(styleOf(boxes()[0])).not.toMatch(/grayscale/);
  });

  it('stale_badge: false shows no pill', async () => {
    await mount([{ ...cam, stale_badge: false }], hass());
    failUrl = (u) => u.includes('mc_t');
    await flush(40_000);
    expect(badge.textContent).toBe('');
  });

  it('the pill goes when the stack leaves the page', async () => {
    await mount([cam], hass());
    failUrl = (u) => u.includes('mc_t');
    await flush(30_000);
    expect(badge.textContent).not.toBe('');
    el.remove();
    expect(badge.textContent).toBe('');
  });
});

describe('layers chunk prefetch', () => {
  const pz = { type: 'image', image: '/a.jpg', pan_zoom: {} } as BackgroundLayerConfig;
  const cam = { type: 'image', entity: 'camera.door' } as BackgroundLayerConfig;

  it('wantsLayers: pan_zoom or a camera.* image layer, in the card or a conditional rule', async () => {
    const { wantsLayers } = await import('../src/utils/lazy-features');
    expect(wantsLayers({ background_layers: [pz] })).toBe(true);
    expect(wantsLayers({ background_layers: [{ ...pz, hidden: true }] })).toBe(true);
    expect(wantsLayers({ background_layers: [cam] })).toBe(true);
    expect(wantsLayers({ conditional_appearance: [{ overrides: { background_layers: [pz] } }] })).toBe(true);
    expect(wantsLayers({ layers_low_power: true, background_layers: [pz] })).toBe(true);
    expect(wantsLayers({ background_layers: [{ ...cam, states: { on: '/x.jpg' } }] })).toBe(false);
    expect(wantsLayers({ background_layers: [{ type: 'color', color: 'red' }, { type: 'image', image: '/a.jpg' }] })).toBe(false);
    expect(wantsLayers({ background_layers: [{ type: 'color', pan_zoom: {} } as never] })).toBe(false);
    expect(wantsLayers({ background_layers: [{ type: 'image', pan_zoom: [] } as never] })).toBe(false);
    expect(wantsLayers({ background_layers: [{ type: 'image', entity: 'sensor.cam' }] })).toBe(false);
    expect(wantsLayers({ background_layers: [] })).toBe(false);
    expect(wantsLayers({ background_layers: 'x' })).toBe(false);
    expect(wantsLayers({ rows: [] })).toBe(false);
    expect(wantsLayers(null)).toBe(false);
    expect(wantsLayers({ conditional_appearance: [null, 5] })).toBe(false);
  });

  it('drift: the predicate agrees with the camera formula of the stack', async () => {
    const { wantsLayers } = await import('../src/utils/lazy-features');
    const entities = [undefined, 'camera.door', 'sensor.x', 'camera.', 'Camera.door', 'camera.a b', 5];
    const states = [undefined, null, {}, { on: '/x.jpg' }];
    cardEntity = 'camera.card';
    for (const entity of entities) {
      for (const st of states) {
        const layer = { type: 'image', image: '/a.jpg', ...(entity !== undefined ? { entity } : {}), ...(st !== undefined ? { states: st } : {}) } as unknown as BackgroundLayerConfig;
        const e = await mount([layer], mkHass({ 'camera.door': { state: 'idle', attributes: { entity_picture: '/c.jpg' } }, 'camera.card': { state: 'idle', attributes: { entity_picture: '/d.jpg' } } }));
        const item = (e as unknown as { items: Array<{ camera: boolean; base?: string }> }).items[0];
        const stackSaysCamera = !!item.base && item.camera;
        expect(wantsLayers({ background_layers: [layer] }), JSON.stringify(layer)).toBe(stackSaysCamera);
        e.remove();
      }
    }
  });

  it('prefetchLazy starts the layers chunk for a moving backdrop only', async () => {
    const { prefetchLazy } = await import('../src/utils/lazy-features');
    const { __setLazyImporterForTests } = await import('../src/utils/lazy-chunks');
    const importer = vi.fn(() => Promise.resolve({ BUILD: 'x', install: () => {} }) as never);
    __setLazyImporterForTests('layers', importer);
    prefetchLazy({ type: 'custom:magic-card', rows: [] });
    prefetchLazy({ type: 'custom:magic-card', rows: [], background_layers: [{ type: 'color', color: 'red' }, { type: 'image', image: '/a.jpg' }] });
    expect(importer).not.toHaveBeenCalled();
    prefetchLazy({ type: 'custom:magic-card', rows: [], background_layers: [pz] });
    expect(importer).toHaveBeenCalledTimes(1);
    __setLazyImporterForTests('layers', undefined);
  });
});

describe('<mc-bg-stack> without the layers chunk, and when it installs', () => {
  const hassCam = () => mkHass({ 'camera.door': { state: 'idle', attributes: { entity_picture: '/c.jpg' } } });
  const moving = { type: 'image', image: '/a.jpg', pan_zoom: { from: 110, to: 130 } } as BackgroundLayerConfig;
  const bounds = () => JSON.stringify(el.getBoundingClientRect());

  it('draws a still picture and rests unscaled until the chunk installs', async () => {
    provideBgFx(undefined);
    await mount([moving]);
    await flush(1);
    expect(pics()).toHaveLength(1);
    expect(pics()[0].classList.contains('pz')).toBe(false);
    expect(pics()[0].hasAttribute('data-pz')).toBe(false);
  });

  it('installing fades the moving picture in over the still one, with no box change', async () => {
    provideBgFx(undefined);
    await mount([moving]);
    await flush(1);
    const before = bounds();
    install();
    await flush(0);
    expect(pics()).toHaveLength(2);
    expect(pics()[0].classList.contains('pz')).toBe(false);
    expect(pics()[1].classList.contains('pz')).toBe(true);
    expect(pics()[1].getAttribute('data-pz')).toBe('play');
    expect(bounds()).toBe(before);
    await flush(300);
    expect(pics()).toHaveLength(1);
    expect(pics()[0].classList.contains('pz')).toBe(true);
    expect(bounds()).toBe(before);
  });

  it('installing swaps in place when the start framing is the unscaled picture', async () => {
    provideBgFx(undefined);
    await mount([{ type: 'image', image: '/a.jpg', pan_zoom: { from: 100, to: 130 } }]);
    await flush(1);
    install();
    await flush(0);
    expect(pics()).toHaveLength(1);
    expect(pics()[0].classList.contains('pz')).toBe(true);
  });

  it('installing under reduced motion switches at once, no fade', async () => {
    window.matchMedia = ((q: string) => ({ matches: q.includes('reduce'), addEventListener() {}, removeEventListener() {} })) as never;
    provideBgFx(undefined);
    await mount([moving]);
    await flush(1);
    install();
    await flush(0);
    expect(pics()).toHaveLength(1);
    expect(pics()[0].classList.contains('pz')).toBe(true);
    expect(pics()[0].getAttribute('data-pz')).toBe('start');
  });

  it('a stack that connects after the install gets the moving picture from the start', async () => {
    await mount([moving]);
    await flush(1);
    expect(pics()).toHaveLength(1);
    expect(pics()[0].classList.contains('pz')).toBe(true);
  });

  it('a static backdrop is the same with and without the chunk', async () => {
    const layers = [{ type: 'color', color: '#123456' }, { type: 'gradient', gradient: 'linear-gradient(90deg, red, blue)' }, { type: 'pattern', pattern: 'dots', color: '#fff' }] as BackgroundLayerConfig[];
    provideBgFx(undefined);
    await mount(layers);
    const plain = el.shadowRoot!.innerHTML;
    el.remove();
    install();
    await mount(layers);
    expect(el.shadowRoot!.innerHTML).toBe(plain);
  });

  it('a camera layer without the chunk keeps its first frame and does not refresh; installing starts refresh', async () => {
    provideBgFx(undefined);
    await mount([{ type: 'image', entity: 'camera.door' }], hassCam());
    await flush(1);
    const first = decodes.length;
    expect(first).toBe(1);
    await flush(60_000);
    expect(decodes.length).toBe(first);
    install();
    await flush(0);
    await flush(10_000);
    expect(decodes.length).toBeGreaterThan(first);
    expect(decodes[decodes.length - 1]).toMatch(/mc_t=/);
  });

  it('a camera whose first frame failed before the chunk loads again after it installs', async () => {
    provideBgFx(undefined);
    failUrl = () => true;
    await mount([{ type: 'image', entity: 'camera.door' }], hassCam());
    await flush(1);
    expect(pics()).toHaveLength(0);
    failUrl = () => false;
    install();
    await flush(1);
    expect(pics()).toHaveLength(1);
  });
});
