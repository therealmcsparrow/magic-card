import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import * as popupModule from '../src/utils/popup';
import * as popupHashModule from '../src/utils/popup-hash';
import * as popupNav from '../src/card/popup-nav';
import { api } from '../src/card/popup-chunk';
import { __setLazyImporterForTests, lazyChunks } from '../src/utils/lazy-chunks';
import { failedChunkNames } from '../src/utils/lazy-chunk';
import type { HomeAssistant, MagicCardConfig } from '../src/types';

/*
 * What magic-card.js keeps of the pop-up code: the config tests and the out-of-flow hold. The hash helpers, the defaults
 * and the "Open pop-up" navigation belong to the popup chunk (and the editor), so a plain card carries none of them.
 */

type CardEl = HTMLElement & {
  setConfig(c: MagicCardConfig): void;
  hass?: HomeAssistant;
  updateComplete: Promise<boolean>;
  _handleAction(e: Event, mod: unknown, kind: string): void;
};

const cfg = (): MagicCardConfig =>
  ({
    type: 'custom:magic-card',
    rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'a', type: 'text', text: 'Open' }] }] }],
  }) as unknown as MagicCardConfig;

async function mount(): Promise<CardEl> {
  const el = document.createElement('magic-card') as CardEl;
  el.setConfig(cfg());
  el.hass = { states: {}, language: 'en', themes: { themes: {} } } as unknown as HomeAssistant;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

beforeEach(() => history.replaceState(null, '', location.pathname));
afterEach(() => {
  document.body.innerHTML = '';
  __setLazyImporterForTests('popup', undefined);
  vi.restoreAllMocks();
});

describe('pop-up code in the entry', () => {
  it('src/utils/popup.ts keeps only the two config tests', () => {
    expect(Object.keys(popupModule).sort()).toEqual(['isPopupEnabled', 'wantsPopup']);
  });

  it('the hash helpers and defaults are in popup-hash.ts', () => {
    expect(Object.keys(popupHashModule).sort()).toEqual([
      'POPUP_DEFAULTS',
      'isValidPopupHash',
      'normalizePopupHash',
      'popupHash',
      'urlWithHash',
    ]);
  });

  it('popup-nav.ts holds the out-of-flow rule only', () => {
    expect(Object.keys(popupNav).sort()).toEqual(['holdOutOfFlow', 'popupHidden']);
  });
});

describe('popup api navigate', () => {
  it('pushes #id and fires location-changed; false for an invalid id', () => {
    const seen: unknown[] = [];
    const on = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener('location-changed', on);
    expect(api.navigate('#kitchen')).toBe(true);
    expect(location.hash).toBe('#kitchen');
    expect(seen).toEqual([{ replace: false }]);
    expect(api.navigate('my kitchen')).toBe(false);
    expect(api.navigate(undefined)).toBe(false);
    expect(location.hash).toBe('#kitchen');
    window.removeEventListener('location-changed', on);
  });

  it('fires a replace event when the URL already has the hash', () => {
    history.replaceState(null, '', '#kitchen');
    const seen: unknown[] = [];
    const on = (e: Event) => seen.push((e as CustomEvent).detail);
    window.addEventListener('location-changed', on);
    expect(api.navigate('kitchen')).toBe(true);
    expect(seen).toEqual([{ replace: true }]);
    window.removeEventListener('location-changed', on);
  });
});

describe('"Open pop-up" action', () => {
  it('waits for the popup chunk when it has not installed yet, then navigates', async () => {
    const real = await import('../src/card/popup-chunk');
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    __setLazyImporterForTests('popup', (async () => {
      await gate;
      return real;
    }) as never);
    const el = await mount();
    el._handleAction(new Event('x'), { actions: { tap_action: { action: 'popup', hash: '#kitchen' } } }, 'tap');
    expect(location.hash).toBe('');
    release();
    await vi.waitFor(() => expect(location.hash).toBe('#kitchen'));
  });

  it('navigates at once when the chunk is installed', async () => {
    await lazyChunks.popup.load();
    const el = await mount();
    el._handleAction(new Event('x'), { actions: { tap_action: { action: 'popup', hash: 'bath' } } }, 'tap');
    expect(location.hash).toBe('#bath');
  });
});

describe('"Open pop-up" tap when the popup chunk cannot load', () => {
  it('a card that only opens a pop-up shows the load-failure notice with a retry button', async () => {
    __setLazyImporterForTests('popup', (() => Promise.reject(new Error('404'))) as never);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = await mount();
    expect(el.shadowRoot!.querySelector('.mc-n')).toBeNull();
    el._handleAction(new Event('x'), { actions: { tap_action: { action: 'popup', hash: '#kitchen' } } }, 'tap');
    await vi.waitFor(() => expect(failedChunkNames().has('popup')).toBe(true));
    await el.updateComplete;
    const notice = el.shadowRoot!.querySelector('.mc-n');
    expect(notice).not.toBeNull();
    expect(notice!.querySelector('button')).not.toBeNull();
    expect(location.hash).toBe('');
  });
});
