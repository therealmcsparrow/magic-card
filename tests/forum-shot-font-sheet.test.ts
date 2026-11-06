import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { renderSheet } from '../src/forum-shot/sheet';
import type { SheetSeams } from '../src/forum-shot/sheet';
import type { FontResponse, FontSeams } from '../src/forum-shot/font-fetch';
import { classifyCard, faceRules, prepareCard } from '../src/forum-shot/font-address';

const PNG = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
const ORIGIN = location.origin;
const hass = { states: {}, language: 'en', themes: { themes: {} } };
const WOFF2 = new Uint8Array([0x77, 0x4f, 0x46, 0x32, 1, 2, 3, 4]);
const SHEET =
  "@font-face{font-family:'Open Sans';font-style:normal;font-weight:400;src:url(https://fonts.gstatic.com/s/opensans/v1/a.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131;}";

const cardWith = (extra: Record<string, unknown> = {}, font = 'Open Sans') => ({
  type: 'custom:magic-card',
  ...extra,
  rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'Hello', design: { font_family: font } }] }] }],
});

const body = (bytes: Uint8Array, type: string): FontResponse => ({
  status: 200,
  type: 'cors',
  redirected: false,
  headers: { get: (n) => (n.toLowerCase() === 'content-type' ? type : null) },
  body: {
    getReader: () => {
      let done = false;
      return { read: async () => (done ? { done: true } : ((done = true), { done: false, value: bytes })), cancel: async () => undefined };
    },
  },
  arrayBuffer: async () => bytes.buffer as ArrayBuffer,
});

const sheetReply = () => body(new TextEncoder().encode(SHEET), 'text/css');

function fonts(route: (url: string) => FontResponse | null = (url) => (url.includes('googleapis') ? sheetReply() : body(WOFF2, 'font/woff2'))) {
  const urls: string[] = [];
  const s: FontSeams = {
    fetch: async (url) => {
      urls.push(url);
      const r = route(url);
      if (!r) throw new TypeError('Failed to fetch');
      return r;
    },
    loadFace: async () => true,
  };
  return { s, urls };
}

function run(config: Record<string, unknown>, f: FontSeams, fontHosts: string[] = prepareCard(config, ORIGIN).plan.fontHosts, h: object = hass) {
  const svgs: string[] = [];
  const compose = vi.fn(async () => PNG);
  const seams: SheetSeams = { capture: { rasterise: async (url) => (url.includes('foreignObject') || decodeURIComponent(url).includes('foreignObject') ? svgs.push(decodeURIComponent(url)) : 0, PNG) }, compose, settleMs: 0, fonts: f };
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 400, height: 100, top: 0, left: 0, right: 400, bottom: 100, x: 0, y: 0, toJSON: () => ({}) });
  return { svgs, compose, go: () => renderSheet(h, { config, modes: ['light'], looks: ['as-configured'], fontHosts }, seams) };
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

describe('the picture carries the real font', () => {
  it('embeds the real font and adds no link', async () => {
    const { s, urls } = fonts();
    const r = run(cardWith(), s);
    await r.go();
    const svg = r.svgs[r.svgs.length - 1];
    expect(svg).toContain('mc-shot-open-sans');
    expect(svg).toContain('data:font/woff2;base64,');
    expect(svg).toContain('unicode-range:U+0000-00FF,U+0131');
    expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
    expect(document.head.querySelector('style[data-mc-shot-font]')).toBeNull();
    expect(urls).toEqual([expect.stringContaining('https://fonts.googleapis.com/css2?family=Open+Sans'), 'https://fonts.gstatic.com/s/opensans/v1/a.woff2']);
  });

  it('sends no request for Roboto or for a card with no web font', async () => {
    const { s, urls } = fonts();
    await run(cardWith({}, 'Roboto'), s).go();
    await run(cardWith({}, 'Arial'), s).go();
    expect(urls).toEqual([]);
  });

  it('stops with font_unavailable before any card mounts when a font cannot be fetched', async () => {
    const { s } = fonts((url) => (url.includes('googleapis') ? sheetReply() : null));
    const r = run(cardWith(), s);
    const append = vi.spyOn(document.body, 'append');
    await expect(r.go()).rejects.toMatchObject({ code: 'font_unavailable' });
    expect(append).not.toHaveBeenCalled();
    expect(r.compose).not.toHaveBeenCalled();
    expect(r.svgs).toEqual([]);
    expect(document.head.querySelector('style[data-mc-shot-font]')).toBeNull();
  });

  it('makes no request when the fresh config names a host outside the disclosed ones', async () => {
    const { s, urls } = fonts();
    const r = run(cardWith(), s, ['fonts.example.com']);
    const append = vi.spyOn(document.body, 'append');
    await expect(r.go()).rejects.toMatchObject({ code: 'hosts_changed' });
    expect(urls).toEqual([]);
    expect(append).not.toHaveBeenCalled();
  });

  it('treats no disclosed hosts as none: a font card stops with hosts_changed', async () => {
    const { s, urls } = fonts();
    await expect(run(cardWith(), s, []).go()).rejects.toMatchObject({ code: 'hosts_changed' });
    expect(urls).toEqual([]);
  });

  it('fetches when the disclosed hosts cover the fresh ones, and when fewer are needed', async () => {
    const { s, urls } = fonts();
    await run(cardWith(), s, ['fonts.googleapis.com', 'fonts.gstatic.com', 'extra.example.com']).go();
    expect(urls.length).toBe(2);
  });

  it('stops with font_unavailable when a listed family has no prepared face', async () => {
    const other = SHEET.replace('Open Sans', 'Lora');
    const { s } = fonts((url) => (url.includes('googleapis') ? body(new TextEncoder().encode(other), 'text/css') : body(WOFF2, 'font/woff2')));
    const r = run(cardWith(), s);
    const append = vi.spyOn(document.body, 'append');
    await expect(r.go()).rejects.toMatchObject({ code: 'font_unavailable' });
    expect(append).not.toHaveBeenCalled();
    expect(document.head.querySelector('style[data-mc-shot-font]')).toBeNull();
  });

  it('stops with font_unavailable for a template family on a card with no font sheets, and adds no link', async () => {
    const { s, urls } = fonts();
    const connection = {
      subscribeMessage: (cb: (m: unknown) => void) => {
        queueMicrotask(() => cb({ result: 'font-family: Lora' }));
        return Promise.resolve(() => undefined);
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    const states = { 'media_player.a': { state: 'on', attributes: { entity_picture: 'x' } } };
    const config = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'markdown', content: '{{ state_attr("media_player.a", "entity_picture") }}' }] }] }] };
    await expect(run(config, s, [], { ...hass, states, connection }).go()).rejects.toMatchObject({ code: 'font_unavailable' });
    expect(urls).toEqual([]);
    expect(document.head.querySelector('link[data-mc-font]')).toBeNull();
  });

  it('rejects a locked card as remote_asset without any request', async () => {
    const { s, urls } = fonts();
    await expect(run(cardWith({ css: '@import url(http://fonts.example.com/a.css);' }), s).go()).rejects.toMatchObject({ code: 'remote_asset' });
    expect(urls).toEqual([]);
  });

  it('reads a font-only css: its @import and @font-face are fetched and neither reaches the mounted copy', async () => {
    const css = '@import url("https://fonts.googleapis.com/css2?family=Lora");@font-face{font-family:Mine;src:url(https://fonts.gstatic.com/m.woff2);}';
    const kit = prepareCard(cardWith({ css }), ORIGIN);
    expect(kit.lock).toBeNull();
    expect(JSON.stringify(kit.mount)).not.toMatch(/@import|@font-face|gstatic|googleapis/);
    expect(kit.plan.sheets).toEqual([
      { url: 'https://fonts.googleapis.com/css2?family=Lora' },
      { css: expect.stringContaining('Mine') },
      { url: expect.stringContaining('Open+Sans') },
    ]);
    const { s, urls } = fonts();
    await run(cardWith({ css }), s).go();
    expect(urls).toContain('https://fonts.gstatic.com/m.woff2');
    expect(document.head.querySelector('link')).toBeNull();
  });

  it('renames a listed family to its alias on the mounted copy and leaves the real config alone', () => {
    const config = cardWith({ css: '.a{font-family:"Open Sans", sans-serif;} .b{font-family:Roboto}' });
    const kit = prepareCard(config, ORIGIN);
    const text = JSON.stringify(kit.mount);
    expect(text).toContain('mc-shot-open-sans');
    expect(text).not.toContain('Open Sans');
    expect(text).toContain('Roboto');
    expect(JSON.stringify(config)).toContain('Open Sans');
    expect(kit.aliases.get('open sans')).toBe('mc-shot-open-sans');
  });

  it('renames only the families it detects: an undetected css family and a label font outside a button keep their names', () => {
    const kit = prepareCard({ type: 'custom:magic-card', css: '.a{font-family:Open Sans}', rows: [{ label_font_family: 'Lora' }] }, ORIGIN);
    const text = JSON.stringify(kit.mount);
    expect(text).toContain('Open Sans');
    expect(text).toContain('Lora');
    expect(text).not.toContain('mc-shot-');
    expect(kit.aliases.size).toBe(0);
  });

  it('renames a label font inside a button because it is detected', () => {
    const kit = prepareCard({ type: 'custom:magic-card', rows: [{ type: 'button', label_font_family: 'Lora' }] }, ORIGIN);
    expect(JSON.stringify(kit.mount)).toContain('mc-shot-lora');
  });

  it('locks a card with an own __proto__ key as cannot_judge', () => {
    const config = JSON.parse('{"type":"custom:magic-card","rows":[{"__proto__":{"image":"https://evil.example/x.png"}}]}');
    expect(prepareCard(config, ORIGIN).lock).toBe('cannot_judge');
    expect(classifyCard(config, ORIGIN).lock).toBe('cannot_judge');
  });

  it('writes only checked values into the prepared style, and refuses a face it cannot write safely', () => {
    const face = { family: 'A"};x{', weight: '400', unicodeRange: 'U+0-FF', url: 'https://f.example.com/a', mime: 'font/woff2', bytes: WOFF2, dataUrl: 'data:font/woff2;base64,AAAA' };
    expect(faceRules([face], new Map())).toBe('@font-face{font-family:"Ax";src:url("data:font/woff2;base64,AAAA");font-weight:400;unicode-range:U+0-FF;}');
    expect(faceRules([{ ...face, unicodeRange: 'U+0;}body{x:y' }], new Map())).toBeNull();
    expect(faceRules([{ ...face, dataUrl: 'data:font/woff2;base64,AA"}' }], new Map())).toBeNull();
  });

  it('stops with font_unavailable when the prepared style cannot be read back', async () => {
    const { s } = fonts();
    const unreadable = { ownerNode: { hasAttribute: () => true }, get cssRules(): never { throw new Error('blocked'); } };
    vi.spyOn(document, 'styleSheets', 'get').mockReturnValue([unreadable] as unknown as StyleSheetList);
    await expect(run(cardWith(), s).go()).rejects.toMatchObject({ code: 'font_unavailable' });
  });
});
