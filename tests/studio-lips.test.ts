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
  (window as unknown as { happyDOM: { setViewport(v: { width: number; height: number }): void } }).happyDOM.setViewport({ width: 1400, height: 900 });
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

const toggle = (root: ShadowRoot): HTMLButtonElement => root.querySelector<HTMLButtonElement>('.layers-toggle')!;

describe('card studio panels without lips', () => {
  it('renders no lip, keeps the status region and the Layers id, with the inspector in the frame drawer', async () => {
    const { root } = await mount();
    expect(root.querySelector('.lip')).toBeNull();
    expect(root.querySelector('.lips')).toBeNull();
    expect(root.getElementById('layers')!.getAttribute('aria-label')).toBe('Layers panel');
    expect(root.querySelector('mc-ui-studio-frame > #inspector')!.getAttribute('slot')).toBe('drawer');
    expect(root.querySelector('.lip-status[role="status"]')).not.toBeNull();
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
  });

  it('hiding Layers with its toggle keeps the panel mounted and remembers it', async () => {
    const { el, root } = await mount();
    const layers = root.querySelector<HTMLElement>('#layers')!;
    toggle(root).click();
    await el.updateComplete;
    expect(root.querySelector('#layers')).toBe(layers);
    expect(layers.dataset.lip).toBe('hidden');
    expect(layers.hasAttribute('inert')).toBe(true);
    expect(localStorage.getItem('mc-panels:card-studio')).toBe('layers');
    expect(toggle(root).getAttribute('aria-expanded')).toBe('false');
  });

  it('Ctrl and backslash work from inside the studio even though the dialog stops key events', async () => {
    const { el, root } = await mount();
    const e = ctrlBackslash();
    root.querySelector('mc-studio-canvas')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
  });

  it('every opening shows Layers, whatever an earlier visit left behind', async () => {
    localStorage.setItem('mc-panels:card-studio', 'layers');
    const { root } = await mount();
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
    expect(root.querySelector('.lip-hint')).toBeNull();
  });

  it('Preview ignores the shortcut and leaves the hidden state alone', async () => {
    const { el, root } = await mount();
    toggle(root).click();
    await el.updateComplete;
    root.querySelector<HTMLButtonElement>('.preview-toggle')!.click();
    await el.updateComplete;
    const e = ctrlBackslash();
    root.querySelector('mc-studio-canvas')!.dispatchEvent(e);
    await el.updateComplete;
    expect(localStorage.getItem('mc-panels:card-studio')).toBe('layers');
    root.querySelector<HTMLButtonElement>('.preview-toggle')!.click();
    await el.updateComplete;
    expect(root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
  });

  it('Edit on a layer keeps the frame drawer open', async () => {
    const { el, root } = await mount();
    const frame = root.querySelector('mc-ui-studio-frame') as HTMLElement & { drawerOpen: boolean };
    root.querySelector('mc-structure-outline')!.dispatchEvent(new CustomEvent('mc-edit-module', { bubbles: true }));
    await el.updateComplete;
    await el.updateComplete;
    expect(frame.drawerOpen).toBe(true);
    expect(localStorage.getItem('mc-panels:card-studio')).toBeNull();
  });

  it('a hidden Layers panel stays mounted and the studio styles carry no lip layer', () => {
    const css = (Studio.styles as Array<{ cssText: string }>).map((s) => s.cssText).join('\n');
    expect(css).not.toMatch(/\.lips\s*\{/);
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

  it('the Layers opener has no chevron and still reports its state', async () => {
    const { el, root } = await mount();
    const btn = toggle(root);
    expect(btn.querySelector('svg')).toBeNull();
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Layers');
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-label')).toBe('Layers');
  });
});
