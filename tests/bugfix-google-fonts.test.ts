// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import '../src/index';
import { configFontCandidates, fontCandidates, googleFontUrl, loadGoogleFonts } from '../src/google-fonts/loader';
import { cardConfig, makeHass, mountCard } from './helpers/fake-hass';
import type { MagicCardConfig } from '../src/types';

const links = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')];

const w = window as unknown as { magicCardUtils?: unknown };
beforeEach(() => {
  links().forEach((l) => l.remove());
  w.magicCardUtils = { settings: { googleFonts: true } };
});
afterEach(() => {
  document.body.innerHTML = '';
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});

describe('google font detection', () => {
  it('finds family names in a font-family value, in their own case', () => {
    expect(fontCandidates('"Open Sans", sans-serif')).toEqual(['Open Sans']);
    expect(fontCandidates("'playfair display', serif")).toEqual(['playfair display']);
    expect(fontCandidates('Lato')).toEqual(['Lato']);
  });

  it('ignores local fonts, Roboto and generic families', () => {
    expect(fontCandidates('Arial, sans-serif')).toEqual([]);
    expect(fontCandidates("Georgia, 'Iowan Old Style', serif")).toEqual(['Iowan Old Style']);
    expect(fontCandidates('Roboto, inherit')).toEqual([]);
    expect(fontCandidates('')).toEqual([]);
  });

  it('collects fonts from designs, hover, rules, nested modules and css', () => {
    const config = {
      type: 'custom:magic-card',
      css: 'font-family: Poppins, sans-serif',
      rows: [{
        id: 'r', design: { font_family: 'Lato, sans-serif' },
        columns: [{
          id: 'c', design: { hover: { font_family: 'Raleway' } },
          modules: [
            { id: 'a', type: 'text', design: { conditional: [{ id: 'x', conditions: [], design: { font_family: '"Fira Code", monospace' } }] } },
            { id: 'h', type: 'horizontal', modules: [{ id: 'b', type: 'text', design: { css: 'font-family: "Dancing Script"; color: red' } }] },
            { id: 'd', type: 'text', design: { font_family: 'Georgia, serif' } },
          ],
        }],
      }],
    } as unknown as MagicCardConfig;
    expect(configFontCandidates(config).sort()).toEqual(['Dancing Script', 'Fira Code', 'Lato', 'Poppins', 'Raleway']);
  });
});

describe('loading', () => {
  it('adds one stylesheet link per family, once', () => {
    loadGoogleFonts([{ name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 700] }, { name: 'Lato', category: 'sans-serif', weights: [300, 400, 700, 900] }]);
    loadGoogleFonts([{ name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 700] }]);
    const l = links();
    expect(l.map((x) => x.getAttribute('href'))).toEqual([
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    ]);
    expect(l.every((x) => x.rel === 'stylesheet')).toBe(true);
  });

  it('requests the common upright weights, only those the family has', () => {
    expect(googleFontUrl({ name: 'PT Sans', category: 'sans-serif', weights: [400, 700] })).toBe('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');
    expect(googleFontUrl({ name: 'Dancing Script', category: 'handwriting', weights: [400, 500, 600, 700] })).toContain(':wght@400;500;700&');
  });

  it('the card loads the Google Fonts its config uses', async () => {
    await mountCard(cardConfig([{ id: 't', type: 'text', text: 'x', design: { font_family: 'Montserrat, sans-serif' } }]), makeHass({}));
    await new Promise((r) => setTimeout(r, 100));
    expect(links().map((l) => l.dataset.mcFont)).toEqual(['Montserrat']);
  });

  it('system fonts load nothing', async () => {
    await mountCard(cardConfig([{ id: 't', type: 'text', text: 'x', design: { font_family: 'Arial, sans-serif' } }]), makeHass({}));
    await new Promise((r) => setTimeout(r, 100));
    expect(links()).toEqual([]);
  });
});

describe('label font family', () => {
  it('loads for a button module, its hover and its rules, and for no other module', () => {
    const button = { type: 'button', design: { label_font_family: 'Lato', hover: { label_font_family: 'Raleway' }, conditional_appearance: [{ design: { label_font_family: 'Poppins' } }] } };
    expect(configFontCandidates({ rows: [{ columns: [{ modules: [button] }] }] }).sort()).toEqual(['Lato', 'Poppins', 'Raleway']);
    expect(configFontCandidates({ rows: [{ columns: [{ modules: [{ type: 'text', design: { label_font_family: 'Lato' } }] }] }] })).toEqual([]);
    expect(configFontCandidates({ design: { label_font_family: 'Lato' } })).toEqual([]);
  });
});
