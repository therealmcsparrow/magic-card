import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const render = vi.fn();
vi.mock('../src/forum-shot/sheet', async (orig) => ({ ...(await orig<typeof import('../src/forum-shot/sheet')>()), renderSheet: (...a: unknown[]) => render(...a) }));

import { cardConfigOf, listMagicCards } from '../src/forum-shot/pick';
import { MagicCardForumShot } from '../src/forum-shot/element';
import '../src/forum-shot';

const mc = (extra: Record<string, unknown> = {}) => ({ type: 'custom:magic-card', ...extra });
const plain = { type: 'entities', entities: [] };
const overview = {
  views: [
    { title: 'Home', cards: [plain, mc({ name: 'Front door' }), { type: 'vertical-stack', cards: [mc()] }] },
    { path: 'sec', sections: [{ cards: [mc({ rows: [{ text: 'https://example.com/a.png' }] })] }] },
  ],
};
const kitchen = { views: [{ title: 'Kitchen', cards: [mc()] }] };

function wsOf(opts: { admin?: boolean; configs?: Record<string, unknown> } = {}) {
  const configs: Record<string, unknown> = opts.configs ?? { '': overview, kitchen };
  const calls: Record<string, unknown>[] = [];
  const callWS = vi.fn(async (msg: Record<string, unknown>) => {
    calls.push(msg);
    if (msg.type === 'lovelace/dashboards/list') {
      if (opts.admin === false) throw { code: 'unauthorized', message: 'Unauthorized' };
      return [{ url_path: 'kitchen', title: 'Kitchen dash', mode: 'storage' }, { url_path: 'yaml', title: 'Y', mode: 'yaml' }];
    }
    const key = (msg.url_path as string | undefined) ?? '';
    if (!(key in configs)) throw { code: 'config_not_found', message: 'no' };
    return configs[key];
  });
  return { callWS, calls };
}

describe('listMagicCards', () => {
  it('finds magic cards through stacks and sections, default dashboard first', async () => {
    const ws = wsOf();
    const refs = await listMagicCards({ callWS: ws.callWS, language: 'en' });
    expect(refs.map((r) => [r.dashboard, r.view, r.path])).toEqual([
      [null, 'Home', [0, 1]],
      [null, 'Home', [0, 2, 0]],
      [null, 'sec', [1, 0, 0]],
      ['kitchen', 'Kitchen', [0, 0]],
    ]);
    expect(refs[0].label).toContain('Front door');
    expect(refs[2].remote).toEqual(['example.com']);
    expect(refs[0].remote).toEqual([]);
  });

  it('makes only the two reads and nothing else', async () => {
    const ws = wsOf();
    await listMagicCards({ callWS: ws.callWS });
    expect(new Set(ws.calls.map((c) => c.type))).toEqual(new Set(['lovelace/dashboards/list', 'lovelace/config']));
  });

  it('lists the default dashboard when the dashboard list needs an admin', async () => {
    const refs = await listMagicCards({ callWS: wsOf({ admin: false }).callWS });
    expect(refs.every((r) => r.dashboard === null)).toBe(true);
    expect(refs.length).toBe(3);
  });

  it('throws no_cards when nothing is found and config_read_failed when nothing could be read', async () => {
    await expect(listMagicCards({ callWS: wsOf({ configs: { '': { views: [{ cards: [plain] }] } } }).callWS })).rejects.toMatchObject({ code: 'no_cards' });
    await expect(listMagicCards({ callWS: wsOf({ configs: {} }).callWS })).rejects.toMatchObject({ code: 'config_read_failed' });
    await expect(listMagicCards({})).rejects.toMatchObject({ code: 'config_read_failed' });
  });

  it('ignores a malformed reply', async () => {
    const callWS = vi.fn(async () => 'nope');
    await expect(listMagicCards({ callWS })).rejects.toMatchObject({ code: 'config_read_failed' });
  });
});

describe('cardConfigOf', () => {
  it('returns the card at the path and refuses a path that moved', async () => {
    const hass = { callWS: wsOf().callWS };
    expect(await cardConfigOf(hass, { dashboard: null, view: 'Home', path: [0, 1], label: '', remote: [] })).toMatchObject({ name: 'Front door' });
    await expect(cardConfigOf(hass, { dashboard: null, view: 'Home', path: [0, 0], label: '', remote: [] })).rejects.toMatchObject({ code: 'config_read_failed' });
  });
});

const PRIVACY = 'Check the picture before you post it. A card can show names, places, camera images and the state of your devices, and everyone who sees your post can see them too.';
const LOCAL = 'The picture is made in your browser. Nothing leaves Home Assistant, and Magic Card does not keep a copy.';

async function mount(hass: Record<string, unknown>, narrow = false) {
  const el = document.createElement('magic-card-forum-shot') as MagicCardForumShot;
  el.narrow = narrow;
  el.hass = hass as never;
  document.body.append(el);
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
  return el;
}
const $ = <T extends Element>(el: Element, s: string) => el.shadowRoot!.querySelector<T>(s);
const $$ = <T extends Element>(el: Element, s: string) => [...el.shadowRoot!.querySelectorAll<T>(s)];
const settle = async (el: MagicCardForumShot) => {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
};

const sheet = (notices: string[] = []) => ({ blob: new Blob([new Uint8Array([1])], { type: 'image/png' }), width: 840, height: 200, fileName: 'magic-card-forum-shot.png', frames: [], notices });

let clicks: HTMLAnchorElement[];
beforeEach(() => {
  render.mockReset();
  clicks = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    clicks.push(this);
  });
  (URL as unknown as Record<string, unknown>).createObjectURL = vi.fn(() => 'blob:mock');
  (URL as unknown as Record<string, unknown>).revokeObjectURL = vi.fn();
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('picker', () => {
  it('shows loading, then the cards as radios, with the remote card marked and disabled', async () => {
    const el = await mount({ callWS: wsOf().callWS, language: 'en', user: { is_admin: true } });
    const radios = $$<HTMLInputElement>(el, 'input[type=radio][name=card]');
    expect(radios.length).toBe(4);
    expect(radios[2].disabled).toBe(true);
    expect(radios.filter((r) => r.disabled).length).toBe(1);
    const described = radios[2].getAttribute('aria-describedby')!;
    expect($(el, `#${described}`)!.textContent).toContain('cannot be used for a forum shot');
    expect(el.shadowRoot!.textContent).not.toContain('example.com');
  });

  it('shows the legal hint and local-only sentence word for word before the Download button', async () => {
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    const text = el.shadowRoot!.textContent!.replace(/\s+/g, ' ');
    expect(text).toContain(PRIVACY);
    expect(text).toContain(LOCAL);
    const order = [...el.shadowRoot!.querySelectorAll('*')];
    const hint = order.indexOf($(el, '.privacy')!);
    expect(hint).toBeGreaterThan(-1);
    expect(hint).toBeLessThan(order.indexOf($(el, 'button.download')!));
  });

  it('gives a non-admin a clear note', async () => {
    const el = await mount({ callWS: wsOf({ admin: false }).callWS, language: 'en', user: { is_admin: false } });
    expect($(el, '.admin-note')!.textContent).toContain('administrator');
  });

  it('shows empty and error states with a way to try again', async () => {
    const el = await mount({ callWS: wsOf({ configs: { '': { views: [] } } }).callWS, language: 'en' });
    expect($(el, '[role=status].empty')!.textContent).toContain('No Magic Cards');
    const bad = await mount({ callWS: wsOf({ configs: {} }).callWS, language: 'en' });
    expect($(bad, '[role=alert]')!.textContent).toContain('could not be read');
    expect($(bad, 'button.retry')).not.toBeNull();
  });

  it('has no transitions under reduced motion and no animation of its own', () => {
    const css = String((MagicCardForumShot.styles as { cssText?: string }).cssText ?? MagicCardForumShot.styles);
    expect(css).toMatch(/prefers-reduced-motion: reduce[\s\S]*transition: none/);
    expect(css).not.toMatch(/@keyframes|animation:/);
  });

  it('region keeps its name', async () => {
    const el = await mount({ callWS: wsOf().callWS, language: 'nl' });
    expect($(el, '[role=region]')!.getAttribute('aria-label')).toBe('Forumafbeelding');
  });
});

describe('download', () => {
  async function pickFirst(el: MagicCardForumShot) {
    const radio = $<HTMLInputElement>(el, 'input[type=radio][name=card]')!;
    radio.click();
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(el);
  }

  it('does nothing until a card is picked (the button says why)', async () => {
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    const btn = $<HTMLButtonElement>(el, 'button.download')!;
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    btn.click();
    await settle(el);
    expect(render).not.toHaveBeenCalled();
  });

  it('renders the picked card with both modes and as-configured, saves one PNG through a blob URL and revokes it', async () => {
    render.mockResolvedValue(sheet());
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await settle(el);
    expect(render).toHaveBeenCalledTimes(1);
    const [, req] = render.mock.calls[0];
    expect(req.modes).toEqual(['light', 'dark']);
    expect(req.looks).toEqual(['as-configured']);
    expect(req.config).toMatchObject({ name: 'Front door' });
    expect(clicks.length).toBe(1);
    expect(clicks[0].href).toBe('blob:mock');
    expect(clicks[0].download).toMatch(/^magic-card-forum-shot-\d{8}-\d{4}\.png$/);
    expect(clicks[0].download).not.toMatch(/front|door|kitchen/i);
    expect($(el, '[role=status].done')!.textContent).toContain('saved');
    expect($<HTMLImageElement>(el, 'img.preview')!.alt).not.toBe('');
    el.remove();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('asks for the three looks when the option is on, and one mode when chosen', async () => {
    render.mockResolvedValue(sheet());
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    const looks = $<HTMLInputElement>(el, 'input.looks')!;
    looks.click();
    const dark = $$<HTMLInputElement>(el, 'input[name=mode]').find((r) => r.value === 'dark')!;
    dark.click();
    dark.dispatchEvent(new Event('change', { bubbles: true }));
    await settle(el);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await settle(el);
    const [, req] = render.mock.calls[0];
    expect(req.looks).toEqual(['quiet', 'living', 'glow']);
    expect(req.modes).toEqual(['dark']);
  });

  it('shows the placeholder notice under the preview', async () => {
    render.mockResolvedValue(sheet(['remote_placeholder']));
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await settle(el);
    expect($(el, '.notices')!.textContent).toContain('replaced by a placeholder');
  });

  it('shows an error from the sheet without card names, and stays usable', async () => {
    render.mockRejectedValue(Object.assign(new Error('too_large'), { code: 'too_large' }));
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    const btn = $<HTMLButtonElement>(el, 'button.download')!;
    btn.click();
    await settle(el);
    expect($(el, '[role=alert]')!.textContent).toContain('too large');
    expect(clicks.length).toBe(0);
    expect($<HTMLButtonElement>(el, 'button.download')!.getAttribute('aria-disabled')).not.toBe('true');
  });

  it('ignores a second press while busy', async () => {
    let done!: (v: unknown) => void;
    render.mockReturnValue(new Promise((r) => (done = r)));
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    const btn = $<HTMLButtonElement>(el, 'button.download')!;
    btn.click();
    await settle(el);
    expect($(el, '[role=status].busy')!.textContent).toContain('Making');
    expect($(el, 'button.download')!.getAttribute('aria-busy')).toBe('true');
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await settle(el);
    expect(render).toHaveBeenCalledTimes(1);
    done(sheet());
    await settle(el);
  });

  it('writes nothing to storage and logs nothing', async () => {
    const set = vi.spyOn(Storage.prototype, 'setItem');
    const log = [vi.spyOn(console, 'log'), vi.spyOn(console, 'warn'), vi.spyOn(console, 'error'), vi.spyOn(console, 'info')];
    render.mockResolvedValue(sheet());
    const el = await mount({ callWS: wsOf().callWS, language: 'en' });
    await pickFirst(el);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await settle(el);
    expect(set).not.toHaveBeenCalled();
    for (const l of log) expect(l).not.toHaveBeenCalled();
  });
});

describe('library icon documents', () => {
  it('are not remote assets: an SVG namespace name is never fetched, a real address still is', async () => {
    const { findRemoteAssets } = await import('../src/forum-shot/remote');
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0 0"/></svg>';
    expect(findRemoteAssets({ custom_animations: [{ svg }] }, location.origin)).toEqual([]);
    expect(findRemoteAssets({ a: `${svg}<image href="http://www.w3.org/evil.png"/>` }, location.origin)).toEqual(['www.w3.org']);
  });
});
