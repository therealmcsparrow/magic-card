import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/index';
import '../src/transfer/panel';
import { cardKeyLists } from '../src/editor/transfer-loader';
import type { TransferPanel } from '../src/transfer/panel';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';

const flush = async () => {
  for (let i = 0; i < 14; i++) await new Promise((r) => setTimeout(r, 0));
};

const hostileTheme = {
  magic_card_export: '1.1',
  kind: 'theme',
  items: [{ id: 'dusk', name: 'Dusk', data: { 'primary-color': '#336699', 'card-background-color': '#fafafa', modes: { dark: { 'card-background-color': '#101820' } } } }],
};
const card = { type: 'custom:magic-card', rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: '{{ states("light.mc_placeholder_1") }}' }, { id: 'n', type: 'text', text: '{{ states("sensor.mc_placeholder_2") }}' }] }] }] };
const cardFile = JSON.stringify({ magic_card_export: '1.1', kind: 'card', items: [{ id: 'my-card', name: 'My card', data: card }] });

async function open(props: Partial<TransferPanel>, text: string): Promise<TransferPanel> {
  document.body.innerHTML = '';
  const el = document.createElement('mc-transfer-panel') as TransferPanel;
  Object.assign(el, { mode: 'import', ...props });
  document.body.append(el);
  await flush();
  const root = el.shadowRoot!;
  root.querySelector<HTMLTextAreaElement>('#paste')!.value = text;
  [...root.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'Read')!.click();
  await flush();
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: TransferPanel, s: string) => el.shadowRoot!.querySelector<T>(s);
const confirmButton = (el: TransferPanel) => [...el.shadowRoot!.querySelectorAll('button')].find((b) => /^Import/.test(b.textContent?.trim() ?? ''))!;

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('import preview', () => {
  it('opens a Wall tablet for a theme from previewSafe values only', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const el = await open({ host: 'theme-editor', accept: ['theme'] }, JSON.stringify(hostileTheme));
    const toggle = q<HTMLButtonElement>(el, '[data-wall-tablet-toggle]')!;
    expect(toggle).toBeTruthy();
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(customElements.get('mc-wall-tablet')).toBeUndefined();
    toggle.click();
    await flush();
    await el.updateComplete;
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    const tablets = [...el.shadowRoot!.querySelectorAll<HTMLElement & { vars: Record<string, string> }>('mc-wall-tablet')];
    expect(tablets.length).toBeGreaterThan(0);
    expect(JSON.stringify(tablets.map((x) => x.vars))).toContain('#336699');
    expect(customElements.get('mc-wall-tablet')).toBeDefined();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('keeps the tablet off and says so when its chunk does not load', async () => {
    const { __setShareTabletImportForTests } = await import('../src/transfer/share-kit-loader');
    __setShareTabletImportForTests(() => Promise.reject(new Error('offline')));
    const el = await open({ host: 'theme-editor', accept: ['theme'] }, JSON.stringify(hostileTheme));
    q<HTMLButtonElement>(el, '[data-wall-tablet-toggle]')!.click();
    await flush();
    await el.updateComplete;
    expect(q(el, '[data-wall-tablet-toggle]')!.getAttribute('aria-pressed')).toBe('false');
    expect(el.shadowRoot!.querySelectorAll('mc-wall-tablet').length).toBe(0);
    expect(q(el, '[data-wall-tablet-failed]')).toBeTruthy();
    __setShareTabletImportForTests();
  });

  it('shows a preview of a card with the demo states and no address', async () => {
    const el = await open({ host: 'card-editor', accept: ['card'], card: cardKeyLists() }, cardFile);
    const preview = q<HTMLElement>(el, '[data-import-preview]')!;
    expect(preview).toBeTruthy();
    expect(preview.textContent).toContain('on, 80 %');
    expect(preview.textContent).toContain('21.5 °C');
    expect(preview.innerHTML).not.toMatch(/https?:/);
  });

  it('Map offers and accepts that domain only', async () => {
    const el = await open({ host: 'card-editor', accept: ['card'], card: cardKeyLists(), entities: ['light.kitchen', 'switch.fan', 'sensor.temp'] }, cardFile);
    const imported: Array<{ items: Array<{ data: unknown }> }> = [];
    el.addEventListener('mc-transfer-import', (e) => imported.push((e as CustomEvent).detail));
    const input = () => q<HTMLInputElement>(el, '[data-map-id="light.mc_placeholder_1"]')!;
    const offered = [...el.shadowRoot!.querySelectorAll('datalist option')].map((o) => o.getAttribute('value'));
    expect(offered).toContain('light.kitchen');
    expect(offered).toContain('sensor.temp');
    expect(offered).not.toContain('switch.fan');
    input().value = 'switch.fan';
    input().dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(input().getAttribute('aria-invalid')).toBe('true');
    input().value = 'light.kitchen';
    input().dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(input().getAttribute('aria-invalid')).toBe('false');
    confirmButton(el).click();
    expect(JSON.stringify(imported[0].items[0].data)).toContain('light.kitchen');
    expect(JSON.stringify(imported[0].items[0].data)).toContain('sensor.mc_placeholder_2');
  });

  it('a wrong-domain entity is never applied', async () => {
    const el = await open({ host: 'card-editor', accept: ['card'], card: cardKeyLists() }, cardFile);
    const imported: Array<{ items: Array<{ data: unknown }> }> = [];
    el.addEventListener('mc-transfer-import', (e) => imported.push((e as CustomEvent).detail));
    const i = q<HTMLInputElement>(el, '[data-map-id="light.mc_placeholder_1"]')!;
    i.value = 'switch.fan';
    i.dispatchEvent(new Event('input'));
    await el.updateComplete;
    confirmButton(el).click();
    expect(JSON.stringify(imported[0].items[0].data)).toContain('light.mc_placeholder_1');
    expect(JSON.stringify(imported[0].items[0].data)).not.toContain('switch.fan');
  });

  it('Skip saves the item unmapped', async () => {
    const el = await open({ host: 'card-editor', accept: ['card'], card: cardKeyLists() }, cardFile);
    const imported: Array<{ items: Array<{ data: unknown }> }> = [];
    el.addEventListener('mc-transfer-import', (e) => imported.push((e as CustomEvent).detail));
    const i = q<HTMLInputElement>(el, '[data-map-id="light.mc_placeholder_1"]')!;
    i.value = 'light.kitchen';
    i.dispatchEvent(new Event('input'));
    await el.updateComplete;
    q<HTMLButtonElement>(el, '[data-map-skip]')!.click();
    await el.updateComplete;
    confirmButton(el).click();
    expect(JSON.stringify(imported[0].items[0].data)).toContain('light.mc_placeholder_1');
    expect(JSON.stringify(imported[0].items[0].data)).not.toContain('light.kitchen');
  });
});

describe('card render of hostile css', () => {
  it("adds no rule and keeps the other declarations (a user's own url() stays, plan: strangers' URLs go at import)", async () => {
    const seen: string[] = [];
    vi.stubGlobal('fetch', vi.fn((u: unknown) => (seen.push(String(u)), Promise.reject(new Error('no')))));
    const hostile = 'letter-spacing: 2px; background: url(https://evil.example/x.png); background-image: image-set("https://evil.example/y.png" 1x); width: expression(alert(1)); color: red;} .x{background:url(https://evil.example/z.png)} @import url(https://evil.example/w.css);';
    const base = await mountCard(cardConfig([{ id: 't', type: 'text', text: 'x' }], { css: 'letter-spacing: 2px' }), makeHass({}));
    const baseSheets = base.shadowRoot!.querySelectorAll('style, link').length;
    document.body.innerHTML = '';
    const el = await mountCard(cardConfig([{ id: 't', type: 'text', text: 'x' }], { css: hostile }), makeHass({}));
    const root = el.shadowRoot!;
    const styles = [...root.querySelectorAll('[style]')].map((n) => n.getAttribute('style') ?? '').join('\n');
    const sheets = [...root.querySelectorAll('style')].map((s) => s.textContent ?? '').join('\n');
    for (const bad of ['@import', 'expression']) {
      expect(styles).not.toContain(bad);
      expect(sheets).not.toContain(bad);
    }
    expect(styles).toContain('letter-spacing: 2px');
    expect(root.querySelectorAll('style, link').length).toBe(baseSheets);
    expect(seen).toEqual([]);
  });
});
