import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineUiKit } from '../src/ui-kit';
defineUiKit();
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { HELP_KEYS } from '../src/svg-editor/names';
import { t } from '../src/svg-editor/i18n';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';

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
const toggle = (el: Ed): HTMLButtonElement => q<HTMLButtonElement>(el, '.topbar button[aria-controls="drawer-body"]')!;
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

describe('SVG editor drawer and panel toggle', () => {
  it('wide: no lips; the top bar has one Inspector toggle, last before Shortcuts, and the drawer opens', async () => {
    const el = await open();
    expect(el.renderRoot.querySelectorAll('.lip, .lip-hint, [aria-label*="Keep"]').length).toBe(0);
    expect(q(el, '#side')).toBeNull();
    const bar = [...el.renderRoot.querySelectorAll('.topbar > button')];
    expect(bar[bar.length - 1].getAttribute('aria-label')).toBe('Shortcuts');
    expect(bar[bar.length - 2]).toBe(toggle(el));
    expect(toggle(el).getAttribute('aria-label')).toBe('Inspector');
    await until(() => el.drawer);
    expect(toggle(el).getAttribute('aria-expanded')).toBe('true');
    expect(q(el, '.drawer-body')).not.toBeNull();
  });

  it('the drawer has Inspector, Layers and Library tabs, and the arrow keys walk them', async () => {
    const el = await open();
    const tabs = (): string[] => [...el.renderRoot.querySelectorAll('.tabs [role=tab]')].map((b) => b.textContent!.trim());
    expect(tabs()).toEqual(['Inspector', 'Layers', 'Library']);
    el.showTab('library');
    await el.updateComplete;
    expect(q(el, '[aria-labelledby="tab-library"]')).not.toBeNull();
    q<HTMLElement>(el, '.tabs')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await el.updateComplete;
    expect(el.tab).toBe('inspector');
  });

  it('Ctrl and backslash from the canvas close the drawer and again open it', async () => {
    const el = await open();
    await until(() => el.drawer);
    const stage = q<HTMLElement>(el, '.stage')!;
    const e = ctrlBackslash();
    stage.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(el.drawer).toBe(false);
    stage.dispatchEvent(ctrlBackslash());
    await until(() => el.drawer);
  });

  it('AltGr and a backslash types text and changes nothing', async () => {
    const el = await open();
    await until(() => el.drawer);
    const e = ctrlBackslash({ ctrlKey: false, altKey: false });
    Object.defineProperty(e, 'getModifierState', { value: (k: string) => k === 'AltGraph' });
    q(el, '.stage')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(false);
    expect(el.drawer).toBe(true);
  });

  it('Skip to inspector shows the Inspector tab', async () => {
    const el = await open();
    el.showTab('layers');
    await el.updateComplete;
    const skip = [...el.renderRoot.querySelectorAll<HTMLButtonElement>('.skips button')].find((b) => b.textContent!.includes('inspector'))!;
    skip.click();
    await el.updateComplete;
    expect(el.tab).toBe('inspector');
  });

  it('the shortcut help line names Ctrl and Command', () => {
    expect(HELP_KEYS.map((id) => t(id))).toContain('Show or hide panels: Ctrl+\\ or ⌘\\');
  });

  it('the toggle takes the Dutch name in a Dutch interface', async () => {
    const el = await open(document.body, 'nl');
    expect(toggle(el).getAttribute('aria-label')).toBe(t('svg-editor.views.inspector'));
  });
});
