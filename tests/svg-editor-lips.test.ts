import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineUiKit } from '../src/ui-kit';
defineUiKit();
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { editorStyles } from '../src/svg-editor/styles';
import { HELP_KEYS } from '../src/svg-editor/names';
import { t } from '../src/svg-editor/i18n';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import { LIP_HOST_ATTR } from '../src/contracts/ui-kit';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 1300, height: 800, right: 1300, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 3000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const SVG = '<svg viewBox="0 0 24 24"><path d="M2 2H8V8H2Z"/></svg>';
async function open(parent: ParentNode = document.body, language?: string): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg: SVG }, host: 'card' });
  if (language) (el as unknown as { hass: unknown }).hass = { language, locale: { language }, states: {} };
  el.getBoundingClientRect = rect;
  parent.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await until(() => !!el.ha);
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: Ed, s: string): T | null => el.renderRoot.querySelector<T>(s);
const lip = (el: Ed, id: string): HTMLButtonElement => q<HTMLButtonElement>(el, `.topbar button[aria-controls="${id}"]`)!;
const ctrlBackslash = (init: KeyboardEventInit = {}): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true, ...init });
const css = (): string => editorStyles.map((s) => s.cssText).join('\n');

beforeEach(() => {
  __resetIconSourceForTests();
  localStorage.clear();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('SVG editor panel lips', () => {
  it('wide: no lip, no hint and no pin; both panels are shown and the top bar has a toggle for each', async () => {
    const el = await open();
    expect(el.renderRoot.querySelectorAll('.lip, .lip-hint, [aria-label*="Keep"]').length).toBe(0);
    expect(lip(el, 'side').getAttribute('aria-label')).toBe('Layers and library panel');
    expect(lip(el, 'inspector').getAttribute('aria-label')).toBe('Inspector');
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('true');
    expect(lip(el, 'inspector').getAttribute('aria-expanded')).toBe('true');
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
    expect(q<HTMLElement>(el, '#inspector')!.dataset.lip).toBe('shown');
    expect(q(el, '.lip-status[role="status"]')).not.toBeNull();
  });

  it('compact: the side toggle opens and closes the sheet, the inspector keeps its toggle; stacked has neither', async () => {
    const el = await open();
    el.layout = 'compact';
    await el.updateComplete;
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('false');
    lip(el, 'side').click();
    await el.updateComplete;
    expect(el.overlay).toBe(true);
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('true');
    expect(lip(el, 'inspector')).not.toBeNull();
    el.layout = 'stacked';
    await el.updateComplete;
    expect(lip(el, 'side')).toBeNull();
    expect(lip(el, 'inspector')).toBeNull();
  });

  it('a panel left hidden by an earlier visit opens shown', async () => {
    localStorage.setItem('mc-panels:svg-editor', 'side,inspector');
    const el = await open();
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
    expect(q<HTMLElement>(el, '#inspector')!.dataset.lip).toBe('shown');
    expect(q(el, '.lip-hint')).toBeNull();
  });

  it('the toggles take the Dutch names in a Dutch interface', async () => {
    const el = await open(document.body, 'nl');
    expect(lip(el, 'inspector').getAttribute('aria-label')).toBe(t('svg-editor.views.inspector'));
    expect(lip(el, 'side').getAttribute('aria-label')).toBe(t('svg-editor.views.layers-and-library-panel'));
  });

  it('a hidden panel gives its whole track to the stage and nothing reserves room for a lip', async () => {
    const el = await open();
    lip(el, 'side').click();
    await el.updateComplete;
    expect(q(el, '.work')!.classList.contains('no-side')).toBe(true);
    const flat = css().replace(/\s+/g, ' ');
    expect(flat).toMatch(/\.no-side \{ --lt: 0px;/);
    expect(flat).toMatch(/\.no-insp \{ --it: 0px;/);
    expect(flat).not.toMatch(/padding-inline-(start|end): calc\(28px/);
  });


  it('hiding a panel keeps it mounted and inert, gives its track to the stage and remembers it', async () => {
    const el = await open();
    const insp = q<HTMLElement>(el, '#inspector')!;
    lip(el, 'inspector').click();
    await el.updateComplete;
    expect(q(el, '#inspector')).toBe(insp);
    expect(insp.dataset.lip).toBe('hidden');
    expect(insp.hasAttribute('inert')).toBe(true);
    expect(q(el, '.work')!.classList.contains('no-insp')).toBe(true);
    expect(localStorage.getItem('mc-panels:svg-editor')).toBe('inspector');
    expect(lip(el, 'inspector').getAttribute('aria-expanded')).toBe('false');
  });

  it('a hidden panel keeps its own width and is never squeezed to 0', () => {
    expect(css()).toMatch(/\.left\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--lw\)/);
    expect(css()).toMatch(/\.insp\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--iw\)/);
    expect(css()).not.toMatch(/\[data-lip='hidden'\]\s*\{[^}]*(?:max-)?width:\s*0[;\s]/);
  });

  it('Ctrl and backslash from the canvas hide both panels and again show them', async () => {
    const el = await open();
    const stage = q<HTMLElement>(el, '.stage')!;
    const e = ctrlBackslash();
    stage.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('hidden');
    expect(q<HTMLElement>(el, '#inspector')!.dataset.lip).toBe('hidden');
    stage.dispatchEvent(ctrlBackslash());
    await el.updateComplete;
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
  });

  it('AltGr and a backslash types text and changes nothing', async () => {
    const el = await open();
    const e = ctrlBackslash({ ctrlKey: false, altKey: false });
    Object.defineProperty(e, 'getModifierState', { value: (k: string) => k === 'AltGraph' });
    q(el, '.stage')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(false);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
  });

  it('inside the card studio the SVG editor wins the shortcut and the studio keeps its panels', async () => {
    // Layers is a column (and has a lip) from 1280 px
    (window as unknown as { happyDOM: { setViewport(v: { width: number; height: number }): void } }).happyDOM.setViewport({ width: 1400, height: 900 });
    await import('../src/modules/index');
    await import('../src/card/magic-card');
    await import('../src/editor/studio/studio');
    const { EditorStateManager } = await import('../src/editor/state/editor-state');
    const proto = HTMLDialogElement.prototype as unknown as { showModal?: () => void; close?: () => void };
    proto.showModal ??= function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
    proto.close ??= function (this: HTMLDialogElement) { this.removeAttribute('open'); };
    const sm = new EditorStateManager(vi.fn());
    sm.setConfig({ type: 'custom:magic-card', rows: [{ id: 'r', layout: '1', columns: [{ id: 'c', modules: [{ id: 'a', type: 'text', text: 'A' }] }] }] } as never);
    const studio = document.createElement('mc-studio') as HTMLElement & { stateManager: unknown; open: boolean; hass: unknown; updateComplete: Promise<unknown> };
    studio.stateManager = sm;
    studio.hass = { states: {}, language: 'en', locale: { language: 'en' } };
    studio.open = true;
    document.body.append(studio);
    mounted.push(studio);
    await studio.updateComplete;
    const host = studio.shadowRoot!.querySelector('dialog')!;
    const el = await open(host);
    // happy-dom cannot read activeElement of a shadow root that sits inside another one
    for (const root of [el.renderRoot, studio.shadowRoot!]) Object.defineProperty(root, 'activeElement', { value: null, configurable: true });
    const e = ctrlBackslash();
    q(el, '.stage')!.dispatchEvent(e);
    await el.updateComplete;
    await studio.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('hidden');
    expect(studio.shadowRoot!.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
    // the inspector lives in the frame's drawer, not in a lip
    expect(studio.shadowRoot!.querySelector<HTMLElement>('#inspector')!.hasAttribute('hidden')).toBe(false);
    expect(localStorage.getItem('mc-panels:card-studio')).toBeNull();
  });

  it('Tab wrapping skips controls inside a hidden panel', async () => {
    const el = await open();
    lip(el, 'inspector').click();
    await el.updateComplete;
    el.wrapFocus(true);
    const active = el.renderRoot.activeElement as HTMLElement | null;
    expect(active?.closest('[data-lip="hidden"]') ?? null).toBeNull();
  });

  it('Skip to inspector brings a hidden inspector back first', async () => {
    localStorage.setItem('mc-panels:svg-editor', 'inspector');
    const el = await open();
    const skip = [...el.renderRoot.querySelectorAll<HTMLButtonElement>('.skips button')].find((b) => b.textContent!.includes('inspector'))!;
    skip.click();
    await el.updateComplete;
    await el.updateComplete;
    expect(q<HTMLElement>(el, '#inspector')!.dataset.lip).toBe('shown');
    expect(localStorage.getItem('mc-panels:svg-editor')).toBeNull();
  });

  it('the shortcut help line names Ctrl and Command', () => {
    expect(HELP_KEYS.map((id) => t(id))).toContain('Show or hide panels: Ctrl+\\ or ⌘\\');
  });

});
