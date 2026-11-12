import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { FORUM_SHOT_MAX_PIXELS } from '../src/contracts/forum-shot';
import { captureFrame, checkCaptureSupport } from '../src/forum-shot/capture';
import type { CaptureSeams } from '../src/forum-shot/capture';
import { aliasFontValue, aliasInText, classifyCard, prepareCard } from '../src/forum-shot/font-address';
import { deepElements, findRemoteAssets, hasRemote, scrubHass, scrubText, sweepRemote } from '../src/forum-shot/remote';
import { settleCard } from '../src/forum-shot/settle';
import type { SettledCard } from '../src/forum-shot/settle';

(window as unknown as { magicCardUtils: unknown }).magicCardUtils = { settings: { googleFonts: true } };
await (await import('../src/forum-shot/font-address')).loadGoogleFontsLib();

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
  document.head.querySelectorAll('link[data-mc-font]').forEach((l) => l.remove());
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('findRemoteAssets', () => {
  it('names off-origin hosts in nested modules and ignores same-origin and data URLs', () => {
    const config = {
      rows: [{ columns: [{ modules: [{ type: 'image', url: 'https://cdn.example.org/a.png' }, { type: 'image', url: '//img.example.net/b.png' }] }] }],
      ok: [`${ORIGIN}/local/x.png`, '/local/y.png', 'data:image/png;base64,AAAA'],
    };
    expect(findRemoteAssets(config, ORIGIN)).toEqual(['cdn.example.org', 'img.example.net']);
  });

  it('adds Google font families from the shared helper', () => {
    expect(findRemoteAssets({ font_family: '"Open Sans", sans-serif' }, ORIGIN, ['Open Sans'])).toEqual(['Open Sans']);
  });

  it('is empty for a config with no remote asset', () => {
    expect(findRemoteAssets({ rows: [{ text: 'Hello there' }] }, ORIGIN)).toEqual([]);
  });

  it('counts a harmless double slash as remote: the rule judges the characters, not the meaning', () => {
    expect(findRemoteAssets({ rows: [{ text: 'Hello // there' }] }, ORIGIN)).toEqual(['unknown']);
    expect(findRemoteAssets({ ok: 'a//b.c' }, ORIGIN)).toEqual(['unknown']);
  });
});

describe('a protocol-relative address behind a delimiter', () => {
  // The URL parser strips leading and trailing C0 controls and spaces, drops tabs and line breaks, and ignores U+FEFF in a host.
  const raw = [
    '//*.evil.example/x.png', '//=evil.example/x.png', '//,evil.example/x.png', '//;evil.example/x.png', '//{a}.evil.example/x.png', "//'a'.evil.example/x.png", '//(a).evil.example/x.png', '//`a`.evil.example/x.png', '//|evil.example/x.png', '//^evil.example/x.png', '//[a].evil.example/x.png', '//{{x}}.evil.example/x.png',
    '\u0001//(a).evil.example/x.png', '\u001f//*.evil.example/x.png', '\u0001//,evil.example/x.png', '\u0000//(a).evil.example/x.png', '\u0001\u001f//(a).evil.example/x.png', '//\uFEFFevil.example/x.png', '//\uFEFF(a).evil.example/x.png', '\u0001//\uFEFFevil.example/x.png', '/\t/(a).evil.example/x.png', '\t//(a).evil.example/x.png', '/\n/*.evil.example/x.png', '\r\n//,evil.example/x.png',
    '// @evil.example/x.png', '//\u00a0@evil.example/x.png', '//\u3000@evil.example/x.png', '\u0001// @evil.example/x.png', '//\t @evil.example/x.png', '//\u00a0evil.example/x.png',
    '\uFEFF//evil.example/x.png', '\uFEFFhttp://evil.example/x.png', '\uFEFF//(a).evil.example/x.png', '\\\\(a).evil.example/x.png', '\u0001\\\\(a).evil.example/x.png', '/\\(a).evil.example/x.png', '\\/(a).evil.example/x.png', '/ /(a).evil.example/x.png', '/\u0001/(a).evil.example/x.png', '/\uFEFF/(a).evil.example/x.png',
    'a//b.c', '&#47;&#47;(a).evil.example/x.png', '\\2f \\2f (a).evil.example/x.png',
  ];
  const forms = raw.map((f) => [JSON.stringify(f), f] as const);
  // Harmless texts holding a double slash lock as well: the rule does not judge what the text means.
  const harmless = ['Hello // there', 'x // (y)', 'ends //', 'Hello \u0001// there', '// there', '/* a */ /* b */'];
  const clean = ['Hello there', 'x (y)', 'a / b', '/local/x.png', 'ends /', `${ORIGIN}/a//b`, 'http://www.w3.org/2000/svg', 'http://www.w3.org/1999/xlink', 'mdi:lightbulb'];
  const nested = (form: string) => ({ type: 'custom:magic-card', rows: [{ columns: [{ modules: [{ type: 'image', url: form }] }] }] });

  it.each(forms)('counts %s as remote in a module value', (_l, form) => {
    expect(findRemoteAssets(nested(form), ORIGIN)).not.toEqual([]);
  });

  it.each(forms)('counts %s as remote inside css url()', (_l, form) => {
    expect(findRemoteAssets({ css: `.a{background:url(${form})}` }, ORIGIN)).not.toEqual([]);
    expect(findRemoteAssets({ css: `.a{background:url("${form}")}` }, ORIGIN)).not.toEqual([]);
  });

  it.each(forms)('locks %s in classifyCard', async (_l, form) => {
    expect(await classifyCard(nested(form), ORIGIN)).toEqual({ lock: 'outside_address', fontHosts: [] });
  });

  it.each(forms)('sweeps %s from an img and a style', (_l, form) => {
    const root = document.createElement('div');
    root.innerHTML = '<img><i></i>';
    root.querySelector('img')!.setAttribute('src', form);
    root.querySelector('i')!.setAttribute('style', `background:url(${form})`);
    expect(sweepRemote(root, ORIGIN)).toBe(true);
    expect(root.querySelector('img')!.hasAttribute('src')).toBe(false);
    expect(root.querySelector('i')!.getAttribute('style') ?? '').not.toContain('//');
  });

  it.each(forms)('stops settleCard on %s before anything mounts', async (_l, form) => {
    await expect(settleCard({ states: {}, language: 'en', themes: { themes: {} } }, nested(form), { settleMs: 0 })).rejects.toMatchObject({ code: 'remote_asset' });
    expect(document.body.children.length).toBe(0);
  });

  it.each(harmless.map((f) => [JSON.stringify(f), f] as const))('locks the harmless text %s everywhere', async (_l, text) => {
    expect(findRemoteAssets({ a: text }, ORIGIN)).toEqual(['unknown']);
    expect((await classifyCard({ type: 'custom:magic-card', rows: [{ text }] }, ORIGIN)).lock).toBe('outside_address');
    const root = document.createElement('div');
    root.innerHTML = '<p></p>';
    root.querySelector('p')!.setAttribute('title', text);
    expect(hasRemote(text, ORIGIN)).toBe(true);
    expect(sweepRemote(root, ORIGIN)).toBe(false);
    root.innerHTML = '<img>';
    root.querySelector('img')!.setAttribute('src', text);
    expect(sweepRemote(root, ORIGIN)).toBe(true);
  });

  it('keeps plain addresses and texts clean everywhere', async () => {
    for (const text of clean) {
      expect(findRemoteAssets({ a: text }, ORIGIN), text).toEqual([]);
      expect((await classifyCard({ type: 'custom:magic-card', rows: [{ text }] }, ORIGIN)).lock, text).toBeNull();
      const root = document.createElement('div');
      root.innerHTML = '<p></p>';
      root.querySelector('p')!.setAttribute('title', text);
      expect(sweepRemote(root, ORIGIN), text).toBe(false);
    }
    settled = await settleCard({ states: {}, language: 'en', themes: { themes: {} } }, { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'a', type: 'text', text: 'Hello there' }] }] }] }, { settleMs: 0 });
  });
});

describe('an origin address cut at a separator', () => {
  // The URL parser reads on past the separator until `/`, `?` or `#`, so the text after it names the host.
  const seps = [' ', ' ', '　', '(', ')', ',', '=', ';', '|', '^', '*', '{', '}', '[', ']', '`', "'", '<', '>'];
  const forms = seps.map((sep) => [JSON.stringify(sep), `${ORIGIN}${sep}@evil.example/x.png`] as const);
  const nested = (form: string) => ({ type: 'custom:magic-card', rows: [{ columns: [{ modules: [{ type: 'image', url: form }] }] }] });

  it.each(forms)('counts a cut at %s as remote in a module value and in css', (_l, form) => {
    expect(findRemoteAssets(nested(form), ORIGIN)).not.toEqual([]);
    expect(findRemoteAssets({ css: `.a{background:url(${form})}` }, ORIGIN)).not.toEqual([]);
    expect(findRemoteAssets({ css: `.a{background:url("${form}")}` }, ORIGIN)).not.toEqual([]);
  });

  it.each(forms)('locks a cut at %s in classifyCard', async (_l, form) => {
    expect(await classifyCard(nested(form), ORIGIN)).toEqual({ lock: 'outside_address', fontHosts: [] });
  });

  it.each(forms)('sweeps a cut at %s from an img and a style', (_l, form) => {
    const root = document.createElement('div');
    root.innerHTML = '<img><i></i>';
    root.querySelector('img')!.setAttribute('src', form);
    root.querySelector('i')!.setAttribute('style', `background:url(${form})`);
    expect(sweepRemote(root, ORIGIN)).toBe(true);
    expect(root.querySelector('img')!.hasAttribute('src')).toBe(false);
  });

  it.each(forms)('stops settleCard on a cut at %s before anything mounts', async (_l, form) => {
    await expect(settleCard({ states: {}, language: 'en', themes: { themes: {} } }, nested(form), { settleMs: 0 })).rejects.toMatchObject({ code: 'remote_asset' });
    expect(document.body.children.length).toBe(0);
  });

  it('counts a cut namespace as remote and keeps a namespace that ends its value', () => {
    expect(hasRemote('http://www.w3.org/2000/svg(/../../x.png', ORIGIN)).toBe(true);
    expect(hasRemote('http://www.w3.org/2000/svg,/../x.png', ORIGIN)).toBe(true);
    expect(hasRemote('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink=\'http://www.w3.org/1999/xlink\'></svg>', ORIGIN)).toBe(false);
    expect(hasRemote('http://www.w3.org/2000/svg', ORIGIN)).toBe(false);
  });

  it('keeps a closed origin address and a bare one that is the whole text', () => {
    for (const text of [`${ORIGIN}/x.png`, `${ORIGIN}/x(@evil.example/`, `${ORIGIN}?a=b`, `${ORIGIN}#f`, `${ORIGIN}`, ` ${ORIGIN} `, `url("${ORIGIN}/a//b.png")`]) expect(hasRemote(text, ORIGIN), text).toBe(false);
  });
});

describe('a raster data image as a whole token', () => {
  const rasters = ['data:image/png;base64,AA//BB==', 'data:image/jpeg;base64,/9j//gA7', 'data:image/webp;base64,//8AAAA='];
  const around = (r: string) => [r, `"${r}"`, `url(${r})`, `url("${r}")`, `.a{background:url('${r}')} .b{color:red}`, `a ${r} b`];

  it.each(rasters.flatMap((r) => around(r).map((t) => [JSON.stringify(t), t] as const)))('keeps %s clean', async (_l, text) => {
    expect(hasRemote(text, ORIGIN)).toBe(false);
    expect(findRemoteAssets({ a: text }, ORIGIN)).toEqual([]);
    expect((await classifyCard({ type: 'custom:magic-card', rows: [{ text }] }, ORIGIN)).lock).toBeNull();
    const root = document.createElement('div');
    root.innerHTML = '<img><i></i>';
    root.querySelector('img')!.setAttribute('src', text);
    root.querySelector('i')!.setAttribute('style', `background:url(${text})`);
    expect(sweepRemote(root, ORIGIN)).toBe(false);
    expect(root.querySelector('img')!.getAttribute('src')).toBe(text);
  });

  it.each([
    'data:image/svg+xml;base64,AA//BB==',
    'data:text/html;base64,AA//BB==',
    'data:image/png;base64,AA//BB==;//evil.example/x.png',
    'data:image/png;base64,AA//BB==//evil.example/x.png',
    'data:image/png;base64,AA//BB==x//y',
    'data:image/png,AA//BB==',
    'x/data:image/png;base64,AA//BB==',
    'data:image/png;base64,AA//BB== // x',
    '/data:image/png;base64,AA//BB== /',
    'http://localhost:3000(data:image/png;base64,AA//BB==',
  ])('still counts %s as remote', (text) => {
    expect(hasRemote(text, ORIGIN)).toBe(true);
  });
});

describe('a card whose accepted font rule sits between comments', () => {
  it('passes the remote gate on the mount the picker offered', async () => {
    const css = '/* fonts */\n@import url("https://fonts.googleapis.com/css2?family=Lora");\n/* rest */\n.a{color:red}';
    const rows = [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'a', type: 'text', text: 'Hello there' }] }] }];
    const kit = await prepareCard({ type: 'custom:magic-card', rows, css }, ORIGIN);
    expect(kit.lock).toBeNull();
    settled = await settleCard({ states: {}, language: 'en', themes: { themes: {} } }, kit.mount, { settleMs: 0 });
    expect(settled).toBeDefined();
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

  describe('a family that arrives through a template result', () => {
    const family = (name: string) => ({
      subscribeMessage: (cb: (m: unknown) => void) => {
        queueMicrotask(() => cb({ result: `font-family: ${name}` }));
        return Promise.resolve(() => undefined);
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    });
    const withState = (h: ReturnType<typeof baseHass>) => ((h.states as Record<string, unknown>)['media_player.a'] = { state: 'on', attributes: { entity_picture: 'x' } }, h);
    const config = {
      type: 'custom:magic-card',
      rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'markdown', content: '{{ state_attr("media_player.a", "entity_picture") }}' }] }] }],
    };

    it('is aliased in the scrubbed copy when a face was prepared for it, and Roboto is left alone', async () => {
      const missing = vi.fn();
      const received: unknown[] = [];
      const { hass } = scrubHass(
        { connection: family('Lora'), states: {} } as { connection: ReturnType<typeof family>; states: object },
        ORIGIN,
        (text) => aliasInText(text, new Set(['lora']), missing),
      );
      void hass.connection.subscribeMessage((m: unknown) => received.push(m));
      await Promise.resolve();
      expect(received).toEqual([{ result: 'font-family: "mc-shot-lora"' }]);
      const roboto = scrubHass({ connection: family('Roboto'), states: {} } as { connection: ReturnType<typeof family>; states: object }, ORIGIN, (t) => aliasInText(t, new Set(), missing));
      void roboto.hass.connection.subscribeMessage((m: unknown) => received.push(m));
      await Promise.resolve();
      expect(received[1]).toEqual({ result: 'font-family: Roboto' });
      expect(missing).not.toHaveBeenCalled();
    });

    it('stops with font_unavailable when no face was prepared for it', async () => {
      await expect(settleCard(withState(baseHass(family('Lora'))), config, { settleMs: 20, preparedFamilies: new Set(['open sans']) })).rejects.toMatchObject({ code: 'font_unavailable' });
      expect(document.body.children.length).toBe(0);
    });

    it('stops with font_unavailable when no set was given at all, and adds no font link', async () => {
      await expect(settleCard(withState(baseHass(family('Lora'))), config, { settleMs: 20 })).rejects.toMatchObject({ code: 'font_unavailable' });
      expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
      expect(document.body.children.length).toBe(0);
    });

    it('renames a font key inside a result, and stops for a Google family with no face', async () => {
      const keyed = (value: string) => ({
        subscribeMessage: (cb: (m: unknown) => void) => {
          queueMicrotask(() => cb({ result: { font_family: value, nested: [{ label_font_family: value }] } }));
          return Promise.resolve(() => undefined);
        },
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      });
      const received: unknown[] = [];
      const { hass } = scrubHass({ connection: keyed('Lato, sans-serif'), states: {} } as { connection: ReturnType<typeof keyed>; states: object }, ORIGIN, undefined, (v) =>
        aliasFontValue(v, new Set(['lato']), () => undefined),
      );
      void hass.connection.subscribeMessage((m: unknown) => received.push(m));
      await Promise.resolve();
      expect(JSON.stringify(received)).toContain('mc-shot-lato');
      expect(JSON.stringify(received)).not.toContain('"Lato');
      await expect(settleCard(withState(baseHass(keyed('Lato'))), config, { settleMs: 20, preparedFamilies: new Set() })).rejects.toMatchObject({ code: 'font_unavailable' });
      expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
    });

    describe('a card whose template holds the family', () => {
      const viaTemplate = (templateConfig: Record<string, unknown>) => ({
        subscribeMessage: (cb: (m: unknown) => void, msg: { name?: string }) => {
          queueMicrotask(() => cb({ action: 'saved', name: msg.name, template: { config: templateConfig } }));
          return Promise.resolve(() => undefined);
        },
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      });
      const templated = { type: 'custom:magic-card', template: 'x', rows: [] };
      const forms: Array<[string, Record<string, unknown>]> = [
        ['a font key', { font_family: 'Lato' }],
        ['a font key in a nested design', { rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'a', font_family: 'Poppins' }] }] }] }],
        ['a css rule', { css: '.a{font-family: Lora;}' }],
        ['a css rule in a module', { rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'a', css: '.a{font-family: Lora;}' }] }] }] }],
        ['a family after a closing brace in a module css', { rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'a', css: '.a{font-family: x}, Nunito;}' }] }] }] }],
        ['a family beside a prepared one', { font_family: 'Oswald' }],
        ['a family in the second rule of minified css', { css: '.a{font-family: Arial}.b{font-family: Lora}' }],
      ];

      it.each(forms)('adds no font link and stops with font_unavailable for %s with no face', async (_n, tpl) => {
        await expect(settleCard(baseHass(viaTemplate(tpl)), templated, { settleMs: 20, preparedFamilies: new Set(['open sans']) })).rejects.toMatchObject({ code: 'font_unavailable' });
        expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
        expect(document.body.children.length).toBe(0);
      });

      it('renames a prepared family and adds no link', async () => {
        settled = await settleCard(baseHass(viaTemplate({ font_family: 'Ubuntu' })), templated, { settleMs: 20, preparedFamilies: new Set(['ubuntu']) });
        expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
      });
    });

    it('leaves a non-plain object in a result as it is', async () => {
      const when = new Date(0);
      const { hass } = scrubHass({ callWS: async () => ({ when, text: 'font-family: Roboto' }), states: {} }, ORIGIN, (t) => t, (v) => v);
      const r = (await hass.callWS()) as { when: Date };
      expect(r.when).toBe(when);
    });
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
