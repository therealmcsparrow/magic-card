import { describe, it, expect, beforeEach, vi } from 'vitest';

const mode = vi.hoisted(() => ({ value: 'throw' as 'throw' | 'revision' | 'ok' }));
vi.mock('../src/image-transfer/chunk', async (original) => {
  const real = (await original()) as typeof import('../src/image-transfer/chunk');
  return {
    get createImageTransfer() {
      if (mode.value === 'throw') throw new Error('offline');
      return mode.value === 'ok' ? real.createImageTransfer : () => ({ revision: 99 });
    },
  };
});

import '../src/index';
import '../src/transfer/chunk';
import { __resetImageTransferForTests, imageTransfer, loadImageTransfer } from '../src/transfer/image-transfer-loader';
import { animationLibrary } from '../src/anim-studio/animation-library';
import { resetLibrary } from '../src/editor/custom/library';
import type { LibraryView } from '../src/transfer/library-view';
import type { TransferPanel } from '../src/transfer/panel';

const flush = async () => {
  for (let i = 0; i < 8; i++) await new Promise((r) => setTimeout(r, 0));
};
const label = (b: Element) => b.getAttribute('aria-label') ?? b.textContent?.trim();
const btn = (el: Element, text: string) => [...el.shadowRoot!.querySelectorAll('button')].find((b) => label(b) === text) as HTMLButtonElement | undefined;
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path id="roof" d="M0 0H10V10Z"/></svg>';

describe('the image-transfer loader', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    animationLibrary.reset();
    resetLibrary();
    __resetImageTransferForTests();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('resolves undefined, never rejects, when the chunk fails to load, and tries again next time', async () => {
    mode.value = 'throw';
    await expect(loadImageTransfer()).resolves.toBeUndefined();
    expect(imageTransfer()).toBeUndefined();
    mode.value = 'ok';
    const ix = await loadImageTransfer();
    expect(ix?.revision).toBe(1);
    expect(imageTransfer()).toBe(ix);
    expect(await loadImageTransfer()).toBe(ix);
  });

  it('resolves undefined when the chunk has another revision', async () => {
    mode.value = 'revision';
    await expect(loadImageTransfer()).resolves.toBeUndefined();
    expect(imageTransfer()).toBeUndefined();
  });

  it('gives the library view its error state with Try again, and no image call', async () => {
    mode.value = 'throw';
    const calls: unknown[] = [];
    const el = document.createElement('mc-library-view') as LibraryView;
    Object.assign(el, { context: 'mcu-panel', kinds: ['image'], hass: { user: { is_admin: true }, callWS: async (m: { type: string }) => void (m.type.includes('images_') && calls.push(m)), connection: { subscribeMessage: async () => () => {} } } });
    document.body.append(el);
    await flush();
    for (let i = 0; i < 50 && el.shadowRoot!.textContent!.includes('Loading...'); i++) await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Could not reach Magic Card Utils. Your work is safe.');
    expect(btn(el, 'Try again')).toBeTruthy();
    expect(btn(el, 'Import')).toBeUndefined();
    expect(calls).toEqual([]);

    mode.value = 'ok';
    btn(el, 'Try again')!.click();
    for (let i = 0; i < 100 && !el.shadowRoot!.textContent!.includes('No images here yet.'); i++) await new Promise((r) => setTimeout(r, 20));
    expect(el.shadowRoot!.textContent).toContain('No images here yet.');
    expect(calls.length).toBeGreaterThan(0);
  });

  it('refuses an image file with "checker did not load" when the chunk does not load', async () => {
    mode.value = 'throw';
    const p = document.createElement('mc-transfer-panel') as TransferPanel;
    Object.assign(p, { host: 'mcu-panel', accept: ['image'] });
    document.body.append(p);
    await p.updateComplete;
    p.shadowRoot!.querySelector<HTMLTextAreaElement>('#paste')!.value = JSON.stringify({ magic_card_export: '1.0', kind: 'image', items: [{ id: 'a', name: 'A', data: { svg: SVG } }] });
    btn(p, 'Read')!.click();
    for (let i = 0; i < 100 && !p.shadowRoot!.querySelector('[role=alert]'); i++) await new Promise((r) => setTimeout(r, 20));
    const alert = p.shadowRoot!.querySelector('[role=alert]');
    expect(alert?.textContent).toContain('The checker for images did not load, so this image was not read.');
    expect(btn(p, 'Import 1 image')).toBeUndefined();
  });
});
