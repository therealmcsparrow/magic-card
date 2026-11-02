import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { FORUM_SHOT_MAX_PIXELS } from '../src/contracts/forum-shot';
import { captureFrame, checkCaptureSupport } from '../src/forum-shot/capture';
import type { CaptureSeams } from '../src/forum-shot/capture';
import { deepElements, findRemoteAssets, scrubHass, scrubText, sweepRemote } from '../src/forum-shot/remote';
import { settleCard } from '../src/forum-shot/settle';
import type { SettledCard } from '../src/forum-shot/settle';

const ORIGIN = 'http://localhost:3000';
const REMOTE = 'https://t.example/entity-picture.png';
const PNG = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });

const code = (e: unknown) => (e as { code?: string }).code;
const seams = (impl?: CaptureSeams['rasterise']): CaptureSeams & { calls: string[] } => {
  const calls: string[] = [];
  return {
    calls,
    rasterise: impl ?? (async (url) => (calls.push(url), PNG)),
  };
};

let settled: SettledCard | undefined;
afterEach(() => {
  settled?.dispose();
  settled = undefined;
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('findRemoteAssets', () => {
  it('names off-origin hosts in nested modules and ignores same-origin and data URLs', () => {
    const config = {
      rows: [{ columns: [{ modules: [{ type: 'image', url: 'https://cdn.example.org/a.png' }, { type: 'image', url: '//img.example.net/b.png' }] }] }],
      ok: [`${ORIGIN}/local/x.png`, '/local/y.png', 'data:image/png;base64,AAAA', 'a//b.c'],
    };
    expect(findRemoteAssets(config, ORIGIN)).toEqual(['cdn.example.org', 'img.example.net']);
  });

  it('adds Google font families from the shared helper', () => {
    expect(findRemoteAssets({ font_family: '"Open Sans", sans-serif' }, ORIGIN)).toEqual(['Open Sans']);
  });

  it('is empty for a config with no remote asset', () => {
    expect(findRemoteAssets({ rows: [{ text: 'Hello // there' }] }, ORIGIN)).toEqual([]);
  });
});

describe('scrubbing before mount (R-12)', () => {
  it('blanks every state attribute holding an address, even a same-origin absolute one', () => {
    const hass = {
      auth: { data: { access_token: 'secret' } },
      states: {
        'media_player.a': { state: 'on', attributes: { entity_picture: REMOTE, nested: { x: [`see ${REMOTE}`] } } },
        'media_player.b': { state: 'on', attributes: { entity_picture: `${ORIGIN}/api/image/x` } },
      },
    };
    const { hass: copy, removed } = scrubHass(hass, ORIGIN);
    const s = copy.states as Record<string, { attributes: Record<string, unknown> }>;
    expect(s['media_player.a'].attributes.entity_picture).toBe('');
    expect(JSON.stringify(s['media_player.a'])).not.toContain('t.example');
    expect(s['media_player.b'].attributes.entity_picture).toBe('');
    expect('auth' in copy).toBe(false);
    expect(removed()).toBe(true);
    expect(JSON.stringify(hass)).toContain('t.example');
  });

  it('blanks a render_template result holding an address before the callback sees it', () => {
    const received: unknown[] = [];
    const connection = {
      subscribeMessage: vi.fn((cb: (m: unknown) => void) => {
        cb({ result: `![a](${REMOTE}) <img src="https://t.example/tmpl-img.png"> ![b](/local/ok.png)` });
        return Promise.resolve(() => undefined);
      }),
    };
    const { hass, removed } = scrubHass({ connection, states: {} }, ORIGIN);
    void hass.connection.subscribeMessage((m) => received.push(m), { type: 'render_template' });
    const text = (received[0] as { result: string }).result;
    expect(text).toBe('');
    expect(removed()).toBe(true);
  });

  it('scrubText keeps a plain path and blanks a double slash inside words', () => {
    expect(scrubText('/local/x.png', ORIGIN)).toBe('/local/x.png');
    expect(scrubText('a//b.c and /local/x.png', ORIGIN)).toBe('');
  });
});

describe('settleCard', () => {
  const baseHass = (connection?: unknown) => ({ states: {}, language: 'en', themes: { themes: {} }, connection });
  const textCard = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'a', type: 'text', text: 'Hello' }] }] }] };

  it('mounts the card paused and offscreen, then removes it on dispose', async () => {
    settled = await settleCard(baseHass(), textCard, { settleMs: 0 });
    const card = settled.card as HTMLElement & { previewPaused: boolean };
    expect(card.previewPaused).toBe(true);
    expect(card.hasAttribute('data-mc-paused') || card.shadowRoot?.querySelector('[data-mc-paused]') !== null).toBe(true);
    const box = card.parentElement!;
    expect(box.style.left).toBe('-100000px');
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expect(settled.notices).toEqual([]);
    settled.dispose();
    expect(document.body.contains(card)).toBe(false);
    settled = undefined;
  });

  it('throws remote_asset before anything mounts', async () => {
    const config = { ...textCard, rows: [{ columns: [{ modules: [{ type: 'image', url: REMOTE }] }] }] };
    const create = vi.spyOn(document, 'createElement');
    await expect(settleCard(baseHass(), config, { settleMs: 0 })).rejects.toMatchObject({ code: 'remote_asset' });
    expect(create).not.toHaveBeenCalled();
    expect(document.body.children.length).toBe(0);
  });

  it('builds a template image with zero off-origin URLs reaching the card', async () => {
    const connection = {
      subscribeMessage: (cb: (m: unknown) => void) => {
        queueMicrotask(() => cb({ result: `![pic](${REMOTE}) <img src="https://t.example/tmpl-img.png" alt="x">` }));
        return Promise.resolve(() => undefined);
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    const config = {
      type: 'custom:magic-card',
      rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'markdown', content: '![p]({{ state_attr("media_player.a", "entity_picture") }})' }] }] }],
    };
    const hass = baseHass(connection);
    (hass.states as Record<string, unknown>)['media_player.a'] = { state: 'on', attributes: { entity_picture: REMOTE } };
    settled = await settleCard(hass, config, { settleMs: 20 });
    const html = deepElements(settled.card.shadowRoot!).map((e) => e.outerHTML).join('');
    expect(html).not.toContain('t.example');
    expect(deepElements(settled.card.shadowRoot!).some((e) => /^(https?:)?\/\//.test(e.getAttribute('src') ?? ''))).toBe(false);
    expect(settled.notices).toEqual(['remote_placeholder']);
  });

  it('sweeps an off-origin picture that reached the DOM and reports it', () => {
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML = `<img src="${REMOTE}"><div style="background-image:url('https://t.example/b.png')"></div><img src="/local/ok.png">`;
    document.body.append(host);
    expect(sweepRemote(host.shadowRoot!, ORIGIN)).toBe(true);
    const html = host.shadowRoot!.innerHTML;
    expect(html).not.toContain('t.example');
    expect(html).toContain('/local/ok.png');
  });
});

describe('captureFrame', () => {
  const frame = (w: number, h: number) => {
    const el = document.createElement('div');
    el.textContent = 'Real text';
    el.getBoundingClientRect = () => ({ width: w, height: h, top: 0, left: 0, right: w, bottom: h, x: 0, y: 0, toJSON: () => ({}) });
    document.body.append(el);
    return el;
  };

  it('returns the PNG blob at twice the CSS size through a data: SVG, never a blob: URL', async () => {
    const create = vi.spyOn(URL, 'createObjectURL');
    const s = seams();
    const out = await captureFrame(frame(420, 200), s);
    expect(out.blob.type).toBe('image/png');
    expect([out.width, out.height]).toEqual([840, 400]);
    expect(out.replaced).toBe(false);
    expect(create).not.toHaveBeenCalled();
    const real = s.calls.at(-1)!;
    expect(real.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    const svg = decodeURIComponent(real.slice(real.indexOf(',') + 1));
    expect(svg).toContain('<foreignObject');
    expect(svg).toContain('Real text');
  });

  it('serialises card text as text and swaps an off-origin picture for a placeholder', async () => {
    const el = frame(420, 100);
    el.innerHTML = `<img src="${REMOTE}"><p>a &lt;b&gt;</p>`;
    const s = seams();
    const out = await captureFrame(el, s);
    const svg = decodeURIComponent(s.calls.at(-1)!.split(',').slice(1).join(','));
    expect(svg).not.toContain('t.example');
    expect(svg).toContain('&lt;b&gt;');
    expect(out.replaced).toBe(true);
  });

  it('throws too_large before drawing when width times height is over the limit', async () => {
    const s = seams();
    const side = Math.ceil(Math.sqrt(FORUM_SHOT_MAX_PIXELS) / 2) + 1;
    await expect(captureFrame(frame(side, side), s)).rejects.toMatchObject({ code: 'too_large' });
    expect(s.calls.length).toBe(1);
  });

  it('throws capture_failed when the start-up check taints, with no retry', async () => {
    const draw = vi.fn(async () => {
      throw new DOMException('tainted', 'SecurityError');
    });
    await expect(checkCaptureSupport({ rasterise: draw })).rejects.toMatchObject({ code: 'capture_failed' });
    await expect(captureFrame(frame(420, 100), { rasterise: draw })).rejects.toMatchObject({ code: 'capture_failed' });
    expect(draw).toHaveBeenCalledTimes(2);
  });

  it('throws capture_failed when the real frame is tainted', async () => {
    let n = 0;
    const draw = async () => {
      if (++n > 1) throw new DOMException('tainted', 'SecurityError');
      return PNG;
    };
    try {
      await captureFrame(frame(420, 100), { rasterise: draw });
      expect.unreachable();
    } catch (e) {
      expect(code(e)).toBe('capture_failed');
    }
  });

  it('writes nothing to storage or the console', async () => {
    const log = vi.spyOn(console, 'log');
    const warn = vi.spyOn(console, 'warn');
    const err = vi.spyOn(console, 'error');
    const set = vi.spyOn(Storage.prototype, 'setItem');
    await captureFrame(frame(420, 100), seams());
    expect([log, warn, err, set].every((s) => s.mock.calls.length === 0)).toBe(true);
  });
});
