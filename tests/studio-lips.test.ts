import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '../src/modules/index';
import '../src/card/magic-card';
import { Studio } from '../src/editor/studio/studio';
import { EditorStateManager } from '../src/editor/state/editor-state';
import type { MagicCardConfig } from '../src/types';

const cfg = { type: 'custom:magic-card', name: 'Living Room', rows: [{ id: 'r', layout: '1', columns: [
  { id: 'c', modules: [{ id: 'a', type: 'text', text: 'A' }] }] }] } as MagicCardConfig;

type El = HTMLElement & { stateManager: EditorStateManager; open: boolean; hass: unknown; updateComplete: Promise<unknown> };

async function mount(): Promise<{ el: El; root: ShadowRoot }> {
  const proto = HTMLDialogElement.prototype as unknown as { showModal?: () => void; close?: () => void };
  proto.showModal ??= function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
  proto.close ??= function (this: HTMLDialogElement) { this.removeAttribute('open'); };
  const sm = new EditorStateManager(vi.fn());
  sm.setConfig(cfg);
  const el = document.createElement('mc-studio') as El;
  el.stateManager = sm;
  el.hass = { states: {}, language: 'en', locale: { language: 'en' } };
  el.open = true;
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, root: el.shadowRoot! };
}
const lip = (root: ShadowRoot, id: string): HTMLButtonElement => root.querySelector<HTMLButtonElement>(`.lip[aria-controls="${id}"]`)!;
const ctrlBackslash = (): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true });

beforeEach(() => localStorage.clear());
afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('card studio panel lips', () => {
  it('renders a lip for Layers and Inspector, a status region and ids on both panels', async () => {
    const { root } = await mount();
    expect(lip(root, 'layers').getAttribute('aria-label')).toBe('Layers panel');
    expect(lip(root, 'inspector').getAttribute('aria-label')).toBe('Inspector panel');
    expect(root.querySelector('.lip-status[role="status"]')).not.toBeNull();
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
    expect(root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('shown');
    // the lip follows the Layers panel and precedes the Inspector, so the tab order matches what is on screen
    expect(root.querySelector('#layers')!.nextElementSibling).toBe(lip(root, 'layers'));
    expect(lip(root, 'inspector').nextElementSibling).toBe(root.querySelector('#inspector'));
  });

  it('hiding a panel gives its track to the canvas, keeps the panel mounted and remembers it', async () => {
    const { el, root } = await mount();
    const layers = root.querySelector<HTMLElement>('#layers')!;
    lip(root, 'layers').click();
    await el.updateComplete;
    expect(root.querySelector('#layers')).toBe(layers);
    expect(layers.dataset.lip).toBe('hidden');
    expect(layers.hasAttribute('inert')).toBe(true);
    expect(root.querySelector('.workspace')!.classList.contains('no-layers')).toBe(true);
    expect(localStorage.getItem('mc-panels:card-studio')).toBe('layers');
    expect(lip(root, 'layers').getAttribute('aria-expanded')).toBe('false');
  });

  it('Ctrl and backslash work from inside the studio even though the dialog stops key events', async () => {
    const { el, root } = await mount();
    const e = ctrlBackslash();
    root.querySelector('mc-studio-canvas')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
    expect(root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('hidden');
  });

  it('opens with the remembered state and shows the first-open hint once', async () => {
    localStorage.setItem('mc-panels:card-studio', 'inspector');
    const { root } = await mount();
    expect(root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('hidden');
    expect(root.querySelector('.lip-hint')).not.toBeNull();
  });

  it('Preview removes the lips and leaves the remembered state alone', async () => {
    localStorage.setItem('mc-panels:card-studio', 'layers');
    const { el, root } = await mount();
    root.querySelector<HTMLButtonElement>('.preview-toggle')!.click();
    await el.updateComplete;
    expect(root.querySelectorAll('.lip').length).toBe(0);
    const e = ctrlBackslash();
    root.querySelector('mc-studio-canvas')!.dispatchEvent(e);
    await el.updateComplete;
    expect(localStorage.getItem('mc-panels:card-studio')).toBe('layers');
    root.querySelector<HTMLButtonElement>('.preview-toggle')!.click();
    await el.updateComplete;
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
  });

  it('Edit on a layer brings a hidden Inspector back', async () => {
    localStorage.setItem('mc-panels:card-studio', 'inspector');
    const { el, root } = await mount();
    root.querySelector('mc-structure-outline')!.dispatchEvent(new CustomEvent('mc-edit-module', { bubbles: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('shown');
    expect(localStorage.getItem('mc-panels:card-studio')).toBeNull();
  });

  it('a hidden panel keeps its width: the track goes to 0, the panel keeps its own width', () => {
    const css = (Studio.styles as Array<{ cssText: string }>).map((s) => s.cssText).join('\n');
    expect(css).toMatch(/\.layers\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--lpw\)/);
    expect(css).toMatch(/\.inspector\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--ipw\)/);
    expect(css).toMatch(/\.no-inspector\s*\{[^}]*--iw:\s*0px/);
    expect(css).not.toMatch(/\[data-lip='hidden'\]\s*\{[^}]*(?:max-)?width:\s*0[;\s]/);
  });
});

describe('card studio lip leftovers', () => {
  it('the keyboard help names the panel shortcut for both systems', async () => {
    const { root } = await mount();
    const canvas = root.querySelector('mc-studio-canvas') as HTMLElement & { updateComplete: Promise<unknown> };
    await canvas.updateComplete;
    const hint = canvas.shadowRoot!.querySelector('#canvas-hint')!;
    expect(hint.textContent).toMatch(/Show or hide panels:/);
    const keys = [...hint.querySelectorAll('kbd')].map((k) => k.textContent);
    expect(keys.slice(-4)).toEqual(['Ctrl', '\\', '⌘', '\\']);
  });

  it('the Layers opener carries a 16 px chevron that points the way the panel comes from and mirrors in RTL', async () => {
    const { el, root } = await mount();
    const btn = root.querySelector<HTMLElement>('.layers-toggle')!;
    const chev = btn.querySelector<SVGElement>('svg.opener-chevron')!;
    expect(chev.getAttribute('width')).toBe('16');
    expect(chev.getAttribute('aria-hidden')).toBe('true');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.dataset.open).toBe('false');
    btn.click();
    await el.updateComplete;
    expect(btn.dataset.open).toBe('true');
    const css = (Studio.styles as Array<{ cssText: string }>).map((s) => s.cssText).join('\n');
    expect(css).toMatch(/\.layers-toggle\[data-open='true'\] \.opener-chevron[^{]*\{[^}]*scaleX\(-1\)/s);
    expect(css).toMatch(/\.layers-toggle\[data-dir='rtl'\] \.opener-chevron[^{]*\{[^}]*scaleX\(-1\)/s);
  });
});
