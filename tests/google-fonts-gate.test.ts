// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { googleFontsAllowed } from '../src/utils/google-fonts';
import { fontCandidates, googleFontUrl, loadFontsFor } from '../src/google-fonts/loader';

const links = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')];
const w = window as unknown as { magicCardUtils?: { settings?: { googleFonts?: boolean } } };
const flush = () => new Promise((r) => setTimeout(r, 50));

beforeEach(() => {
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});
afterEach(() => {
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});

describe('gate', () => {
  it('is closed without Utils or with the switch off, open with it on', () => {
    expect(googleFontsAllowed()).toBe(false);
    w.magicCardUtils = { settings: { googleFonts: false } };
    expect(googleFontsAllowed()).toBe(false);
    w.magicCardUtils = { settings: { googleFonts: true } };
    expect(googleFontsAllowed()).toBe(true);
  });

  it('loads nothing while closed, then loads after mcu-settings opens it', async () => {
    loadFontsFor(['Lato']);
    await flush();
    expect(links()).toHaveLength(0);
    w.magicCardUtils = { settings: { googleFonts: true } };
    window.dispatchEvent(new CustomEvent('mcu-settings'));
    await flush();
    expect(links().map((l) => l.getAttribute('href'))).toEqual(['https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap']);
  });

  it('loads no system fonts when open', async () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    loadFontsFor(['Segoe UI', 'Arial']);
    await flush();
    expect(links()).toHaveLength(0);
  });

  it('follows renames', async () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    loadFontsFor(['Source Sans Pro']);
    await flush();
    expect(links()[0]?.getAttribute('href')).toContain('family=Source+Sans+3');
  });
});

describe('candidates', () => {
  it('filters generics, variables and unsafe names', () => {
    expect(fontCandidates("'open sans', Arial, sans-serif")).toEqual(['open sans']);
    expect(fontCandidates('var(--x)')).toEqual([]);
    expect(fontCandidates('"Open Sans;}</style>", serif')).toEqual([]);
    expect(fontCandidates('A'.repeat(65))).toEqual([]);
  });
});

describe('url', () => {
  it('omits the weights when no common one exists', () => {
    expect(googleFontUrl({ name: 'X Y', category: 'display', weights: [900] })).toBe('https://fonts.googleapis.com/css2?family=X+Y&display=swap');
  });
});

describe('loadConfigFonts', () => {
  it('fetches nothing while closed, then links once the switch opens', async () => {
    const { loadConfigFonts } = await import('../src/utils/google-fonts');
    loadConfigFonts({ cards: [{ font_family: 'Oswald, sans-serif' }] });
    await flush();
    expect(links()).toHaveLength(0);
    w.magicCardUtils = { settings: { googleFonts: true } };
    window.dispatchEvent(new CustomEvent('mcu-settings'));
    await flush();
    expect(links()).toHaveLength(1);
  });

  it('does nothing for a config without fonts', async () => {
    const { loadConfigFonts } = await import('../src/utils/google-fonts');
    w.magicCardUtils = { settings: { googleFonts: true } };
    loadConfigFonts({ type: 'x' });
    await flush();
    expect(links()).toHaveLength(0);
  });
});
