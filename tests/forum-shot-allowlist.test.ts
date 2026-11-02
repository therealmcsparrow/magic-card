import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import { findRemoteAssets, keepsText, scrubHass, scrubText, scrubValue } from '../src/forum-shot/remote';
import { modeWrapper, themeVars } from '../src/forum-shot/modes';

const ORIGIN = 'http://localhost:3000';

// Every form the security review (48) reached a server with, plus the ones it listed as closed. String.raw keeps the backslashes.
const FORMS: string[] = [
  String.raw`<img src="&#x0000000068;ttp://a1.evil.test/p.png">`,
  String.raw`<img src="&#0000000104;ttp://a2.evil.test/p.png">`,
  String.raw`[r3]:http://a3.evil.test/p.png ![a3][r3]`,
  String.raw`[r4]://a4.evil.test/p.png ![a4][r4]`,
  String.raw`//*.a5.evil.test/p.png`,
  String.raw`![a7](//*.a7.evil.test/p.png)`,
  String.raw`//,.a8.evil.test/p.png`,
  String.raw`//=a9.evil.test/p.png`,
  String.raw`/\*.a10.evil.test/p.png`,
  String.raw`&#x0000000068;ttps://a1.evil.test/p.png`,
  String.raw`//=@a6.evil.test/p.png`,
  String.raw`//;@a14.evil.test/p.png`,
  String.raw`//|.a15.evil.test/p.png`,
  'url("ht\\\nhttp://c1.evil.test/x.png")',
  'url("ht\\\r\nhttp://c1.evil.test/x.png")',
  String.raw`url("http://c2.evil.test/x.png")`,
  String.raw`url(\68ttps://evil.test/p.png)`,
  String.raw`/\evil.test`,
  String.raw`\\evil.test\a.png`,
  String.raw`https:\\evil.test`,
  String.raw`https:evil.test/p.png`,
  'ht\ttps://evil.test',
  'ht\ntps://evil.test',
  'https&colon;//evil.test',
  String.raw`&amp;#104;ttps://evil.test`,
  String.raw`![x](https://evil.test/p.png)`,
  String.raw`a.png 1x,https://evil.test/b.png 2x`,
  String.raw`HTTPS://EVIL.TEST`,
  String.raw`wss://evil.test/socket`,
  String.raw`ftp://evil.test/a`,
  String.raw`//evil.test`,
  String.raw`javascript:alert(1)`,
  String.raw`data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=`,
  String.raw`data:text/html,<img src=//evil.test>`,
  String.raw`<svg><image href="https://evil.test/x.png"/></svg>`,
  String.raw`<link rel=stylesheet href=//evil.test/a.css>`,
  String.raw`@import "//evil.test/a.css";`,
  String.raw`\2f\2f evil.test`,
];

describe('allow-list for strings the card reads', () => {
  it.each(FORMS)('blanks %j', (v) => {
    expect(keepsText(v)).toBe(false);
    expect(scrubText(v, ORIGIN)).toBe('');
    expect(scrubText(`before ${v} after`, ORIGIN)).toBe('');
  });

  it.each(['', 'Living room', '21.5', 'on', '2026-11-02T10:30:00+00:00', 'AC/DC 1/2', '10:30', 'Time 12:30', 'mdi:lightbulb', 'hass:thermometer'])('keeps %j', (v) => {
    expect(keepsText(v)).toBe(true);
    expect(scrubText(v, ORIGIN)).toBe(v);
  });

  it.each(['Status: ok', 'Note: see below', '12:30', 'Door: open, Window: closed', 'Ratio 3:1'])('keeps ordinary text %j', (v) => {
    expect(keepsText(v)).toBe(true);
  });

  it.each(['foo:bar', 'blob:abc', 'filesystem: x', 'javascript: alert(1)', 'say data:text/plain,hi', 'ht\ntps: x', 'web+x:go'])('blanks the scheme form %j', (v) => {
    expect(keepsText(v)).toBe(false);
  });

  it.each(['/\t/h.test/x.png', '/\n/h.test/x.png', '/\r/h.test/x.png', '\t/\t/h.test/x.png', 'image-set("/\t/h.test/x.png" 1x)', '![a](/\t/h.test/x.png)'])('blanks the address split by a tab or line break %j', (v) => {
    expect(keepsText(v)).toBe(false);
    expect(scrubText(v, ORIGIN)).toBe('');
  });

  it('keeps multi-line ordinary text', () => {
    expect(keepsText('Status: ok\nNext: later')).toBe(true);
  });

  it('reports a blank only when it looked like an address', () => {
    const onRemove = vi.fn();
    scrubValue({ a: '<b>bold</b>', b: 'x'.repeat(1_000_001), c: 'a'.repeat(5) }, ORIGIN, onRemove);
    expect(onRemove).not.toHaveBeenCalled();
    scrubValue({ c: 'https://evil.test' }, ORIGIN, onRemove);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it.each(['/local/ok.png', '/api/image_proxy/media_player.a?token=abc', '/local/a b'.replace(' ', '%20'), '/hacsfiles/x/y.svg#frag'])('keeps the same-origin path %j', (v) => {
    expect(keepsText(v)).toBe(true);
  });

  it.each(['data:image/png;base64,iVBORw0KGgo=', 'data:image/jpeg;base64,/9j/4AAQ//8=', 'data:image/webp;base64,UklGRg=='])('keeps the raster data image %j', (v) => {
    expect(keepsText(v)).toBe(true);
  });

  it.each(['//x', 'data:image/png;base64,AA== x', 'http://localhost:3000/x.png', 'mdi:x http://e'])('blanks the near miss %j', (v) => {
    expect(keepsText(v)).toBe(false);
  });

  it('blanks a string over the size limit', () => {
    expect(keepsText('a'.repeat(1_000_001))).toBe(false);
  });

  it('reports every blanked string, walks state, attributes, results and subscriptions', async () => {
    const states: Record<string, unknown> = {};
    FORMS.forEach((v, i) => (states[`sensor.s${i}`] = { state: v, attributes: { entity_picture: v, friendly_name: v, nested: [{ deep: v }] } }));
    const connection = {
      subscribeMessage: (cb: (m: unknown) => void) => (cb({ result: FORMS }), Promise.resolve(() => undefined)),
      sendMessagePromise: async () => ({ r: FORMS }),
    };
    const hass = { states, connection, callWS: async () => ({ r: FORMS }) };
    const { hass: copy, removed } = scrubHass(hass, ORIGIN);
    const c = copy as unknown as typeof hass;
    const dump = JSON.stringify(c.states);
    expect(dump).not.toMatch(/evil/);
    expect(removed()).toBe(true);
    expect(JSON.stringify(await c.callWS())).not.toMatch(/evil/);
    expect(JSON.stringify(await c.connection.sendMessagePromise())).not.toMatch(/evil/);
    const got: unknown[] = [];
    void c.connection.subscribeMessage((m) => got.push(m));
    expect(JSON.stringify(got)).not.toMatch(/evil/);
  });

  it('scrubs the state string itself', () => {
    const { hass } = scrubHass({ states: { 'sensor.a': { state: String.raw`![x](//evil.test/a.png)`, attributes: {} } } }, ORIGIN);
    expect((hass.states['sensor.a'] as { state: string }).state).toBe('');
  });

  it('scrubValue blanks only the strings that fail', () => {
    const onRemove = vi.fn();
    const out = scrubValue({ a: 'fine', b: String.raw`//evil.test`, c: ['/local/x.png', 'https://evil.test'] }, ORIGIN, onRemove);
    expect(out).toEqual({ a: 'fine', b: '', c: ['/local/x.png', ''] });
    expect(onRemove).toHaveBeenCalledTimes(2);
  });
});

describe('theme and modes values use the same rule', () => {
  const hassOf = (theme: Record<string, unknown>) => ({ themes: { theme: 't', themes: { t: theme } } });
  const THEME_FORMS = FORMS.filter((f) => !f.startsWith('data:'));

  it.each(THEME_FORMS)('drops theme value %j, base and modes', (v) => {
    const out = themeVars(hassOf({ 'ha-card-background': v, modes: { dark: { 'primary-color': v, 'text-primary-color': '#111' } } }), 'dark');
    expect(JSON.stringify(out)).not.toContain('evil');
    expect(out['text-primary-color']).toBe('#111');
  });

  it('drops a value with a backslash and a line break', () => {
    const out = themeVars(hassOf({ 'ha-card-background': 'url("ht\\\ntp://c1.evil.test/x.png")' }), 'light');
    expect(out['ha-card-background']).toBeUndefined();
  });

  it('keeps colours, fonts and a plain path', () => {
    const out = themeVars(hassOf({ a: 'rgba(0, 0, 0, 0.5)', b: 'Roboto, sans-serif', c: 'var(--x)', d: '/local/ok.png' }), 'light');
    expect(out).toMatchObject({ a: 'rgba(0, 0, 0, 0.5)', b: 'Roboto, sans-serif', c: 'var(--x)', d: '/local/ok.png' });
  });

  it('sets a dropped variable to initial on the wrapper and reports it', () => {
    const onRemove = vi.fn();
    const wrap = modeWrapper(hassOf({ 'ha-card-background': 'url(//evil.test)' }), 'light', onRemove);
    expect(wrap.style.getPropertyValue('--ha-card-background')).toBe('initial');
    expect(wrap.getAttribute('style') ?? '').not.toContain('evil');
    expect(onRemove).toHaveBeenCalled();
  });
});

describe('cards with a custom-card module cannot be picked', () => {
  const at = (depth: number) => {
    let node: Record<string, unknown> = { id: 'x', type: 'custom-card', card_type: 'map' };
    for (let i = 0; i < depth; i++) node = { id: `m${i}`, type: 'tabs', tabs: [{ modules: [node] }] };
    return { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [node] }] }] };
  };

  it.each([0, 1, 3])('reports a custom-card module at depth %i', (d) => {
    expect(findRemoteAssets(at(d), ORIGIN)).toContain('custom-card module');
  });

  it('refuses a card nested past the depth limit', () => {
    expect(findRemoteAssets(at(8), ORIGIN).length).toBeGreaterThan(0);
  });

  it('does not report a card without one', () => {
    expect(findRemoteAssets({ type: 'custom:magic-card', rows: [{ columns: [{ modules: [{ type: 'text' }] }] }] }, ORIGIN)).toEqual([]);
  });

  it('refuses to mount before anything is created', async () => {
    const { settleCard } = await import('../src/forum-shot/settle');
    await expect(settleCard({ states: {} }, at(2))).rejects.toMatchObject({ code: 'remote_asset' });
    expect(document.body.querySelector('magic-card')).toBeNull();
  });
});

describe('the picture is not caught mid-draw', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    delete (document as { getAnimations?: unknown }).getAnimations;
  });

  it('finishes the card finite animations and leaves looping ones', async () => {
    const { settleCard } = await import('../src/forum-shot/settle');
    const finite = vi.fn();
    const loop = vi.fn();
    const outside = vi.fn();
    const inCard = () => document.querySelector('magic-card')?.shadowRoot?.querySelector('*') ?? undefined;
    const anim = (target: () => Element | undefined, end: number, finish: () => void) => ({
      effect: {
        get target() {
          return target();
        },
        getComputedTiming: () => ({ endTime: end }),
      },
      finish,
    });
    (document as unknown as { getAnimations: () => unknown[] }).getAnimations = () => [
      anim(inCard, 1200, finite),
      anim(inCard, Infinity, loop),
      anim(() => document.body, 500, outside),
    ];
    const config = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x' }] }] }] };
    const settled = await settleCard({ states: {}, language: 'en', themes: { themes: {} } }, config, { settleMs: 5 });
    settled.dispose();
    expect(finite).toHaveBeenCalled();
    expect(loop).not.toHaveBeenCalled();
    expect(outside).not.toHaveBeenCalled();
  });
});
