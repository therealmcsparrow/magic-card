// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { html, render } from 'lit';
import { IMAGE_FONT_RE, imageFontValue } from '../src/contracts/svg-image';
import { IMAGE_POLICY } from '../src/svg-safety';
import * as safety from '../src/svg-safety';
import { cleanText, textAttrs, validFont, changed } from '../src/image-editor/text';
import { textRows } from '../src/image-editor/text-ui';
import { bindKit } from '../src/image-editor/kit';
import { imageKit } from '../src/svg-editor/image-kit';
import { install } from '../src/svg-image/chunk';
import { __resetImageClientForTests } from '../src/svg-image/client';
import type { McSvgImage } from '../src/svg-image/mc-svg-image';

const w = window as unknown as { magicCardUtils?: unknown };
const links = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')];
const font = (v: string) => safety.cleanValue('font', v, IMAGE_POLICY);
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

beforeEach(() => {
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});
afterEach(() => {
  document.body.innerHTML = '';
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});

describe('image font values', () => {
  it('keeps a Google family with one of the four generics', () => {
    expect(font('"Lato", serif')).toBe('"Lato", serif');
    expect(font('"Open Sans", sans-serif')).toBe('"Open Sans", sans-serif');
  });
  it('turns everything else into sans-serif', () => {
    for (const v of ['"Lato", cursive', 'Lato', '"Lato;}</style>", serif', 'url(x)', '"Lato", serif, monospace']) expect(font(v)).toBe('sans-serif');
  });
  it('writes the stored form and maps cursive to sans-serif', () => {
    expect(imageFontValue('Lato', 'serif')).toBe('"Lato", serif');
    expect(imageFontValue('Pacifico', 'cursive')).toBe('"Pacifico", sans-serif');
    expect(IMAGE_FONT_RE.test(imageFontValue('Pacifico', 'cursive'))).toBe(true);
  });
});

describe('text data with a Google family', () => {
  it('survives a change unchanged and is written as an attribute that holds the quotes', () => {
    const t = { s: 'Hi', z: 20, w: 400, a: 'start' as const, f: '"Lato", sans-serif' };
    expect(validFont(t.f)).toBe(true);
    expect(cleanText('Hi')).toBe('Hi');
    expect(changed(t, undefined, { z: 24 }).t.f).toBe('"Lato", sans-serif');
    expect(textAttrs(t, [0, 0])).toContain(`font-family='"Lato", sans-serif'`);
    expect(changed(t, undefined, { f: 'Papyrus' }).t.f).toBe('sans-serif');
  });
});

describe('mc-svg-image', () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><text x="1" y="20" font-family='"Lato", sans-serif'>Hi</text></svg>`;
  const hass = {
    states: {},
    callWS: async (m: { ids?: string[] }) => ({ images: (m.ids ?? []).map((id) => ({ id, name: id, view_box: '0 0 100 50', svg, created_at: 't0', updated_at: 't1' })) }),
  };
  const mountOne = async (): Promise<void> => {
    __resetImageClientForTests();
    install();
    const el = document.createElement('mc-svg-image') as McSvgImage;
    Object.assign(el, { ref: 'mcu-image:txt', hass });
    document.body.append(el);
    await wait(400);
  };
  it('asks for the family when the switch is on', async () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    await mountOne();
    expect(links().some((l) => l.dataset.mcFont === 'Lato')).toBe(true);
  });
  it('adds no link when the switch is off', async () => {
    await mountOne();
    expect(links()).toEqual([]);
  });
});

describe('text field', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shape = { id: 's', look: { text: { s: 'Hi', z: 10, w: 400, a: 'start', f: 'sans-serif' } } };
  const x = { shell: { requestUpdate: () => undefined }, edit: () => undefined, needColours: () => undefined, googleFont: false } as never;
  const options = () => [...host.querySelectorAll('#tx-font option, #tx-font [data-value]')].map((e) => e.textContent?.trim() ?? '').join('|') + host.querySelector('#tx-font')?.outerHTML;
  it('offers only the four generics when the switch is off', () => {
    render(textRows(x, shape as never) ?? html``, host);
    expect(options()).not.toContain('Google');
  });
  it('offers the Google option when the switch is on', () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    render(textRows(x, shape as never) ?? html``, host);
    expect(options()).toContain('Google');
  });
});

describe('help under the font field', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shape = (f: string) => ({ id: 's', look: { text: { s: 'Hi', z: 10, w: 400, a: 'start', f } } });
  const x = { shell: { requestUpdate: () => undefined, settle: () => undefined }, edit: () => undefined, needColours: () => undefined, googleFont: false } as never;
  const help = () => [...host.querySelectorAll('p.help')].map((p) => p.textContent ?? '').join('|');
  it('says a Google font loads from Google Fonts while the switch is on, without the device line', () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    render(textRows(x, shape('"Roboto", sans-serif') as never) ?? html``, host);
    expect(help()).toContain('Roboto is a Google font. It loads from Google Fonts because the switch');
    expect(help()).toContain('Viewers then contact Google.');
    expect(help()).not.toContain('Nothing is downloaded');
  });
  it('keeps the device line while the switch is off', () => {
    render(textRows(x, shape('"Roboto", sans-serif') as never) ?? html``, host);
    expect(help()).toContain('while the switch in Magic Card Utils is on');
    expect(help()).toContain('Nothing is downloaded');
  });
});

describe('measure again once a Google font loads', () => {
  it('updates the drawing through settle, never as an edit', async () => {
    bindKit(imageKit);
    w.magicCardUtils = { settings: { googleFonts: true } };
    const host = document.createElement('div');
    document.body.append(host);
    const f = '"Lato", sans-serif';
    const lato = { id: 'a', paths: [], look: { text: { s: 'Hello', z: 20, w: 400, a: 'start', f } } };
    const other = { id: 'b', paths: [], look: { text: { s: 'Hi', z: 20, w: 400, a: 'start', f: 'serif' } } };
    const edits: string[] = [];
    const settled: ((d: { shapes: unknown[] }) => { shapes: { id: string; paths: unknown[] }[] })[] = [];
    const x = {
      shell: { requestUpdate: () => undefined, settle: (fn: never) => settled.push(fn) },
      edit: (_f: unknown, label: string) => edits.push(label),
      needColours: () => undefined,
      googleFont: false,
    } as never;
    render(textRows(x, lato as never) ?? html``, host);
    for (let i = 0; i < 50 && !settled.length; i++) await wait(20);
    expect(settled.length).toBe(1);
    expect(edits).toEqual([]);
    const out = settled[0]({ shapes: [lato, other] });
    expect(out.shapes[0].paths.length).toBeGreaterThan(0);
    expect(out.shapes[1]).toBe(other);
  });
});
