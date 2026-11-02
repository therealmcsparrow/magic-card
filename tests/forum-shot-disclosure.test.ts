import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const render = vi.fn();
vi.mock('../src/forum-shot/sheet', async (orig) => ({ ...(await orig<typeof import('../src/forum-shot/sheet')>()), renderSheet: (...a: unknown[]) => render(...a) }));

import { MagicCardForumShot } from '../src/forum-shot/element';
import { forumShotError } from '../src/forum-shot/settle';
import '../src/forum-shot';

const mc = (extra: Record<string, unknown> = {}) => ({ type: 'custom:magic-card', ...extra });
const font = mc({ name: 'Alpha', css: '@import url(https://fonts.googleapis.com/css2?family=Lora);' });
const plain = mc({ name: 'Beta' });

function ws(cards: Record<string, unknown>[]) {
  const callWS = vi.fn(async (msg: Record<string, unknown>) => (msg.type === 'lovelace/dashboards/list' ? [] : { views: [{ title: 'Home', cards }] }));
  return { callWS, language: 'en', panels: { lovelace: { title: 'Overview' } } };
}
const flush = async (el: MagicCardForumShot) => {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
};
async function mount(hass: unknown) {
  const el = document.createElement('magic-card-forum-shot') as MagicCardForumShot;
  el.hass = hass as never;
  document.body.append(el);
  await flush(el);
  return el;
}
const $ = <T extends Element>(el: Element, s: string) => el.shadowRoot!.querySelector<T>(s);
const $$ = <T extends Element>(el: Element, s: string) => [...el.shadowRoot!.querySelectorAll<T>(s)];
const pick = async (el: MagicCardForumShot, i: number) => {
  $$<HTMLInputElement>(el, 'input[name=card]')[i].click();
  await flush(el);
};
const text = (el: Element) => el.shadowRoot!.textContent!.replace(/\s+/g, ' ');
const sheet = () => ({ blob: new Blob([new Uint8Array([1])], { type: 'image/png' }), width: 840, height: 200, fileName: 'x.png', frames: [], notices: ['remote_placeholder'] });

const CONTACT = /To draw the fonts, your browser asks fonts\.googleapis\.com, fonts\.gstatic\.com for them\. Those sites can see your IP address, the time of the request, which fonts you ask for and the ordinary details every browser sends, such as its type and language\. Your cards and settings are not sent\./;
const LOCAL_FONT = 'The picture is made in your browser, and Magic Card does not keep a copy. Your cards and settings stay in Home Assistant, but the fonts are fetched from the sites named here.';
const LOCAL = 'Nothing leaves Home Assistant';

let fetchSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  render.mockReset();
  fetchSpy = vi.fn();
  vi.stubGlobal('fetch', fetchSpy);
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  (URL as unknown as Record<string, unknown>).createObjectURL = vi.fn(() => 'blob:mock');
  (URL as unknown as Record<string, unknown>).revokeObjectURL = vi.fn();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('font hosts before Download', () => {
  it('names hosts and fetches nothing before Download', async () => {
    const el = await mount(ws([font, plain]));
    expect(text(el)).not.toContain('To draw the fonts');
    await pick(el, 0);
    expect(text(el)).toMatch(CONTACT);
    expect(text(el)).toContain(LOCAL_FONT);
    expect(text(el)).not.toContain(LOCAL);
    expect($$(el, 'input[type=checkbox]').map((c) => c.id)).toEqual(['looks']);
    const contact = [...el.shadowRoot!.querySelectorAll('p')].find((p) => p.textContent!.includes('To draw the fonts'))!;
    const download = $<HTMLButtonElement>(el, 'button.download')!;
    expect(contact.compareDocumentPosition(download) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  it('shows no host text for a card without outside fonts', async () => {
    const el = await mount(ws([font, plain]));
    await pick(el, 1);
    expect(text(el)).not.toContain('To draw the fonts');
    expect(text(el)).not.toContain(LOCAL_FONT);
  });

  it('uses the font placeholder notice for a font card and the plain one otherwise', async () => {
    render.mockResolvedValue(sheet());
    const el = await mount(ws([font, plain]));
    await pick(el, 0);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await flush(el);
    expect(text(el)).toContain('A picture from outside Home Assistant was replaced by a placeholder, and no server was asked for it.');
  });
});

describe('hosts changed between the list and Download', () => {
  it('sends the shown hosts, then re-reads the list and says the hosts changed', async () => {
    render.mockRejectedValueOnce(forumShotError('hosts_changed'));
    const hass = ws([font, plain]);
    const el = await mount(hass);
    await pick(el, 0);
    const reads = hass.callWS.mock.calls.length;
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await flush(el);
    expect(render.mock.calls[0][1]).toMatchObject({ fontHosts: ['fonts.googleapis.com', 'fonts.gstatic.com'] });
    expect(hass.callWS.mock.calls.length).toBeGreaterThan(reads);
    const alert = el.shadowRoot!.querySelector('p.error[role=alert]')!;
    expect(alert.textContent).toContain('fonts this card asks for changed');
    expect(text(el)).not.toContain('Saved');
    expect($(el, 'img.preview')).toBeNull();
  });
});

describe('a failed font', () => {
  it('stops with a clear error and drops any earlier preview', async () => {
    render.mockResolvedValueOnce(sheet()).mockRejectedValueOnce(forumShotError('font_unavailable'));
    const el = await mount(ws([font, plain]));
    await pick(el, 0);
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await flush(el);
    expect($(el, 'img.preview')).not.toBeNull();
    $<HTMLButtonElement>(el, 'button.download')!.click();
    await flush(el);
    expect(el.shadowRoot!.querySelector('img.preview')).toBeNull();
    expect(el.shadowRoot!.querySelector('.notices')).toBeNull();
    const alert = el.shadowRoot!.querySelector('p.error[role=alert]')!;
    expect(alert.textContent).toContain('font');
    expect(alert.textContent).not.toContain('could not be made in this browser');
    expect(text(el)).not.toContain('Saved');
  });
});
