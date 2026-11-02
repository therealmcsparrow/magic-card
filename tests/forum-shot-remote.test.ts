import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { captureFrame } from '../src/forum-shot/capture';
import { modeWrapper, themeVars } from '../src/forum-shot/modes';
import { findRemoteAssets, hasRemote, scrubHass, scrubText, scrubValue, sweepRemote } from '../src/forum-shot/remote';

const ORIGIN = 'http://localhost:3000';
const HTTPS_ORIGIN = 'https://ha.example';

const HOSTILE = [
  'https:evil.com',
  'https:evil.com/p.png',
  '/\\evil.com',
  '/\\evil.com/p',
  '\\\\evil.com\\a.png',
  'https:\\\\evil.com',
  'ht\ttps://evil.com',
  'ht\ntps://evil.com',
  '//exämple.com',
  '//evil',
  '&#104;ttps://evil.com',
  '&#x68;ttps://evil.com',
  '&#104ttps://evil.com',
  'https&colon;//evil.com',
  'https:&sol;&sol;evil.com',
  '&amp;#104;ttps://evil.com',
  '<img src="&#104;ttps://evil.com/p">',
  '![x](https://evil.com/p.png)',
  'url(https://evil.com/p.png)',
  'url(\\68ttps://evil.com/p.png)',
  'url(\\68 ttps://evil.com/p.png)',
  'a.png 1x,https://evil.com/b.png 2x',
  'HTTPS://EVIL.COM',
  'wss://evil.com/socket',
  'http://',
];

const CLEAN = [
  '',
  'Hello // there',
  'a//b.c and /local/x.png',
  '/local/y.png',
  `${ORIGIN}/api/image/x?token=abc`,
  'data:image/png;base64,AAAA==',
  'Note: 10:30 and R&D',
  'see /local/ok.png',
  '<svg><use href="#a"></use></svg>',
];

describe('hasRemote: the URL parser decides', () => {
  it.each(HOSTILE)('treats %j as remote', (v) => {
    expect(hasRemote(v, ORIGIN)).toBe(true);
  });

  it.each(CLEAN)('treats %j as local', (v) => {
    expect(hasRemote(v, ORIGIN)).toBe(false);
  });

  it('judges a same-scheme relative form against a second base too', () => {
    expect(hasRemote('https:evil.com', HTTPS_ORIGIN)).toBe(true);
    expect(hasRemote('/\\evil.com', HTTPS_ORIGIN)).toBe(true);
    expect(hasRemote(`${HTTPS_ORIGIN}/local/a.png`, HTTPS_ORIGIN)).toBe(false);
  });

  it('counts a string over the size limit as remote', () => {
    expect(hasRemote('a'.repeat(1_000_001), ORIGIN)).toBe(true);
    expect(hasRemote(`${'a'.repeat(1_000_000)}`, ORIGIN)).toBe(false);
  });
});

describe('findRemoteAssets', () => {
  it.each(HOSTILE)('reports %j', (v) => {
    expect(findRemoteAssets({ rows: [{ x: v }] }, ORIGIN).length).toBeGreaterThan(0);
  });

  it('reports a value past the depth limit instead of calling it clean', () => {
    let deep: unknown = 'https://evil.com/x.png';
    for (let i = 0; i < 40; i++) deep = { n: deep };
    expect(findRemoteAssets(deep, ORIGIN).length).toBeGreaterThan(0);
  });

  it('reports a config past the node limit', () => {
    const big = Array.from({ length: 60_000 }, () => 1);
    expect(findRemoteAssets({ big }, ORIGIN).length).toBeGreaterThan(0);
  });

  it('reports a string over the size limit', () => {
    expect(findRemoteAssets({ t: `<img src=https://evil.com/p>${'a'.repeat(1_000_001)}` }, ORIGIN).length).toBeGreaterThan(0);
  });

  it('reports a theme-style url() in a config string', () => {
    expect(findRemoteAssets({ style: 'background: url("https://evil.com/x.png")' }, ORIGIN).length).toBeGreaterThan(0);
  });
});

describe('scrubbing is complete and fails closed', () => {
  it.each(HOSTILE)('scrubText removes %j', (v) => {
    const out = scrubText(`before ${v} after`, ORIGIN);
    expect(hasRemote(out, ORIGIN)).toBe(false);
  });

  it('keeps the rest of a text when one address goes', () => {
    const out = scrubText('![a](https://evil.com/x.png) ![b](/local/ok.png)', ORIGIN);
    expect(out).toContain('/local/ok.png');
    expect(out).not.toContain('evil');
  });

  it('empties a string over the size limit and reports it', () => {
    const onRemove = vi.fn();
    expect(scrubText(`<img src=https://evil.com/p>${'a'.repeat(1_000_001)}`, ORIGIN, onRemove)).toBe('');
    expect(onRemove).toHaveBeenCalled();
  });

  it('empties a value past the depth limit', () => {
    let deep: unknown = 'https://evil.com/x.png';
    for (let i = 0; i < 40; i++) deep = { n: deep };
    const onRemove = vi.fn();
    const out = JSON.stringify(scrubValue(deep, ORIGIN, onRemove));
    expect(out).not.toContain('evil');
    expect(onRemove).toHaveBeenCalled();
  });

  it('empties values past the node limit', () => {
    const arr = [...Array.from({ length: 60_000 }, () => 'ok'), 'https://evil.com/x.png'];
    const onRemove = vi.fn();
    const out = scrubValue(arr, ORIGIN, onRemove);
    expect(out.includes('https://evil.com/x.png')).toBe(false);
    expect(onRemove).toHaveBeenCalled();
  });

  it('scrubs state attributes with each hostile form', () => {
    const states: Record<string, unknown> = {};
    HOSTILE.forEach((v, i) => (states[`media_player.p${i}`] = { state: 'on', attributes: { entity_picture: v } }));
    const { hass, removed } = scrubHass({ states }, ORIGIN);
    expect(hasRemote(JSON.stringify(hass.states), ORIGIN)).toBe(false);
    expect(removed()).toBe(true);
  });

  it('scrubs the other hass parts a card reads (themes, config, callWS, callApi, sendMessagePromise)', async () => {
    const evil = 'https:evil.com/p.png';
    const calls: string[] = [];
    const hass = {
      states: {},
      themes: { themes: { t: { 'ha-card-background': `url(${evil})` } } },
      config: { location_name: evil },
      callWS: async () => ({ picture: evil }),
      callApi: async () => ({ picture: evil }),
      connection: {
        sendMessagePromise: async () => ({ picture: evil }),
        subscribeMessage: (cb: (m: unknown) => void) => (cb({ result: evil }), Promise.resolve(() => undefined)),
        commandId: 1,
        next() {
          calls.push(String(++this.commandId));
          return this.commandId;
        },
      },
    };
    const { hass: copy } = scrubHass(hass, ORIGIN);
    const c = copy as unknown as typeof hass;
    expect(JSON.stringify(c.themes)).not.toContain('evil');
    expect(JSON.stringify(c.config)).not.toContain('evil');
    expect(JSON.stringify(await c.callWS())).not.toContain('evil');
    expect(JSON.stringify(await c.callApi())).not.toContain('evil');
    expect(JSON.stringify(await c.connection.sendMessagePromise())).not.toContain('evil');
    const got: unknown[] = [];
    void c.connection.subscribeMessage((m) => got.push(m));
    expect(JSON.stringify(got)).not.toContain('evil');
    c.connection.next();
    expect(hass.connection.commandId).toBe(2);
  });

  it('lists the hass members the forum shot wraps', () => {
    const wrapped = ['callWS', 'callApi', 'callService'];
    const fns = Object.fromEntries(wrapped.map((k) => [k, async () => ({})]));
    const { hass } = scrubHass({ states: {}, ...fns }, ORIGIN);
    for (const k of wrapped) expect((hass as Record<string, unknown>)[k]).not.toBe(fns[k]);
  });
});

describe('theme and modes values (R-2)', () => {
  const hassOf = (theme: Record<string, unknown>) => ({ themes: { theme: 't', themes: { t: theme } } });

  it('drops a remote theme value and a remote modes value, keeps a local one', () => {
    const v = themeVars(
      hassOf({
        'ha-card-background': 'url(https://evil.com/x.png)',
        'card-background-color': 'url(/local/ok.png)',
        'primary-text-color': 'url(\\68ttps://evil.com/y.png)',
        modes: { dark: { 'secondary-background-color': 'url(https:evil.com/z.png)', 'text-primary-color': '#111' } },
      }),
      'dark',
    );
    expect(JSON.stringify(v)).not.toContain('evil');
    expect(v['card-background-color']).toBe('url(/local/ok.png)');
    expect(v['text-primary-color']).toBe('#111');
  });

  it('modeWrapper never sets a remote value and reports it', () => {
    const onRemove = vi.fn();
    const wrap = modeWrapper(hassOf({ 'ha-card-background': 'url(//evil)' }), 'light', onRemove);
    expect(wrap.getAttribute('style') ?? '').not.toContain('evil');
    expect(onRemove).toHaveBeenCalled();
  });
});

describe('sweepRemote (safety net)', () => {
  const sweep = (html: string) => {
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML = html;
    document.body.append(host);
    const removed = sweepRemote(host.shadowRoot!, ORIGIN);
    return { removed, html: host.shadowRoot!.innerHTML };
  };
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    '<img src="https:evil.com/p.png">',
    '<img src="/\\evil.com/p.png">',
    '<img src="ht\ttps://evil.com/p.png">',
    '<img srcset="/local/a.png 1x, //evil/b.png 2x">',
    '<div style="background-image:url(\\68ttps://evil.com/b.png)"></div>',
    '<div style="background-image:url(https:evil.com/b.png)"></div>',
    '<style>@import url(https://evil.com/a.css); .a{background:url(//evil/x)}</style>',
  ])('removes %j', (markup) => {
    const out = sweep(markup);
    expect(out.removed).toBe(true);
    expect(out.html).not.toContain('evil');
  });

  it('leaves local pictures and fragments alone', () => {
    const out = sweep('<img src="/local/ok.png"><svg><use href="#a"></use></svg>');
    expect(out.removed).toBe(false);
  });
});

describe('capture fetches (R-3)', () => {
  const png = () => new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
  const frameWith = (html: string) => {
    const el = document.createElement('div');
    el.innerHTML = html;
    el.getBoundingClientRect = () => ({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) });
    document.body.append(el);
    return el;
  };
  const rasterise = (calls: string[]) => async (url: string) => (calls.push(url), png());
  const svgOf = (calls: string[]) => decodeURIComponent(calls.at(-1)!.split(',').slice(1).join(','));
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('does not fetch <a href>; it removes the attribute', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const calls: string[] = [];
    await captureFrame(frameWith('<a href="/local/big.bin">link</a>'), { rasterise: rasterise(calls) });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(svgOf(calls)).not.toContain('big.bin');
    vi.unstubAllGlobals();
  });

  it('replaces a picture whose content-length is over the byte cap, without reading it', async () => {
    const blob = vi.fn();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, headers: new Headers({ 'content-length': String(50 * 1024 * 1024), 'content-type': 'image/png' }), blob, body: null })));
    const calls: string[] = [];
    await captureFrame(frameWith('<img src="/local/huge.png">'), { rasterise: rasterise(calls) });
    expect(blob).not.toHaveBeenCalled();
    expect(svgOf(calls)).not.toContain('/local/huge.png');
    vi.unstubAllGlobals();
  });

  it('stops reading a stream without a length once it passes the cap', async () => {
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(c) {
        pulled++;
        c.enqueue(new Uint8Array(1024 * 1024));
      },
    });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body, { headers: { 'content-type': 'image/png' } })));
    const calls: string[] = [];
    await captureFrame(frameWith('<img src="/api/camera_proxy_stream/x">'), { rasterise: rasterise(calls) });
    expect(pulled).toBeLessThan(40);
    vi.unstubAllGlobals();
  });

  it('replaces a response that is not a picture or a font', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>', { headers: { 'content-type': 'text/html' } })));
    const calls: string[] = [];
    await captureFrame(frameWith('<img src="/local/page">'), { rasterise: rasterise(calls) });
    expect(svgOf(calls)).not.toContain('<html>');
    vi.unstubAllGlobals();
  });

  it('aborts a fetch that takes too long', async () => {
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_u: string, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        return new Promise(() => undefined);
      }),
    );
    vi.useFakeTimers();
    const calls: string[] = [];
    const p = captureFrame(frameWith('<img src="/api/camera_proxy_stream/x">'), { rasterise: rasterise(calls) });
    await vi.advanceTimersByTimeAsync(30_000);
    await p;
    expect(signal?.aborted).toBe(true);
    vi.unstubAllGlobals();
  });
});

describe('the scrub before mount leaves the sweep nothing to do', () => {
  it('mounts a card fed every hostile form and finds nothing for the sweep', async () => {
    const { settleCard } = await import('../src/forum-shot/settle');
    const md = HOSTILE.map((h) => `![p](${h}) <img src="${h}"> <div style="background-image:url('${h}')">x</div>`).join('\n');
    const connection = {
      subscribeMessage: (cb: (m: unknown) => void) => {
        queueMicrotask(() => cb({ result: md }));
        return Promise.resolve(() => undefined);
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    const config = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'markdown', content: '{{ x }}' }] }] }] };
    const hass = { states: { 'media_player.a': { state: 'on', attributes: { entity_picture: HOSTILE[0] } } }, language: 'en', themes: { themes: {} }, connection };
    const settled = await settleCard(hass, config, { settleMs: 20 });
    try {
      expect(sweepRemote(settled.card.shadowRoot!, ORIGIN)).toBe(false);
      expect(deepElementsHtml(settled.card)).not.toContain('evil');
    } finally {
      settled.dispose();
    }
  });
});

const deepElementsHtml = (card: HTMLElement) => card.shadowRoot!.innerHTML;
