import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import '../src/index';
import '../src/shape-editor/index';
import { loadCustomShapes } from '../src/utils/shape-custom-loader';
import { studioStyles } from '../src/shape-editor/styles';
import { SHORTCUTS } from '../src/shape-editor/names';
import { msgIndex } from '../tools/i18n/test-msg';
import type { McShapeStudio } from '../src/shape-editor/mc-shape-studio';

beforeAll(async () => {
  await loadCustomShapes();
});
const mounted: HTMLElement[] = [];
beforeEach(() => localStorage.clear());
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  localStorage.clear();
});

async function mount(language?: string): Promise<McShapeStudio> {
  const el = document.createElement('mc-shape-studio') as McShapeStudio;
  Object.assign(el, { value: { shape: 'custom', shape_options: { corner: 16, corner_type: 'notch' } }, label: 'this card' });
  if (language) (el as unknown as { hass: unknown }).hass = { language, locale: { language }, callWS: async () => [] };
  document.body.append(el);
  mounted.push(el);
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
  return el;
}
const q = <T extends Element>(el: McShapeStudio, s: string): T | null => el.shadowRoot!.querySelector<T>(s);
const lip = (el: McShapeStudio, id: string): HTMLButtonElement => q<HTMLButtonElement>(el, `button[aria-controls="${id}"]`)!;
const ctrlBackslash = (init: KeyboardEventInit = {}): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true, ...init });
const css = (): string => studioStyles.map((s) => s.cssText).join('\n');
const frame = (el: McShapeStudio): HTMLElement & { drawerOpen: boolean } => q<HTMLElement & { drawerOpen: boolean }>(el, 'mc-ui-studio-frame')!;
const wide = async (el: McShapeStudio): Promise<void> => {
  (el as unknown as { narrowFrame: boolean }).narrowFrame = false;
  await el.updateComplete;
};

describe('Shape studio panel lips', () => {
  it('wide: no lip, no pin and no hint; the side panel and the inspector are open with a toggle each in the top bar', async () => {
    const el = await mount();
    await wide(el);
    expect(el.shadowRoot!.querySelectorAll('.lip, .lip-hint').length).toBe(0);
    expect(frame(el).hasAttribute('fixed-drawer')).toBe(true);
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('true');
    expect(lip(el, 'inspector').getAttribute('aria-expanded')).toBe('true');
    expect(lip(el, 'inspector').getAttribute('aria-label')).toBe('Inspector panel');
    expect(frame(el).drawerOpen).toBe(true);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
    expect(q(el, '.lip-status[role="status"]')).not.toBeNull();
    expect(q(el, '#inspector')!.getAttribute('slot')).toBe('drawer');
    expect(frame(el).shadowRoot!.querySelector('[data-bp="pin"]')).toBeNull();
  });

  it('a side panel left hidden by an earlier visit opens shown', async () => {
    localStorage.setItem('mc-panels:shape-studio', 'side');
    const el = await mount();
    await wide(el);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('true');
  });

  it('Ctrl and backslash hide both panels and show both again', async () => {
    const el = await mount();
    await wide(el);
    const stage = q<HTMLElement>(el, '.stage')!;
    stage.dispatchEvent(ctrlBackslash());
    await el.updateComplete;
    expect(frame(el).drawerOpen).toBe(false);
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('false');
    stage.dispatchEvent(ctrlBackslash());
    await el.updateComplete;
    expect(frame(el).drawerOpen).toBe(true);
    expect(lip(el, 'side').getAttribute('aria-expanded')).toBe('true');
  });


  it('hiding the side panel keeps it mounted and inert, and remembers it', async () => {
    const el = await mount();
    await wide(el);
    const side = q<HTMLElement>(el, '#side')!;
    lip(el, 'side').click();
    await el.updateComplete;
    expect(q(el, '#side')).toBe(side);
    expect(side.dataset.lip).toBe('hidden');
    expect(side.hasAttribute('inert')).toBe(true);
    expect(localStorage.getItem('mc-panels:shape-studio')).toBe('side');
  });

  it('Ctrl and backslash from the stage toggles the inspector drawer', async () => {
    const el = await mount();
    await wide(el);
    const stage = q<HTMLElement>(el, '.stage')!;
    const before = frame(el).drawerOpen;
    const e = ctrlBackslash();
    stage.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(true);
    expect(frame(el).drawerOpen).toBe(!before);
    stage.dispatchEvent(ctrlBackslash());
    await el.updateComplete;
    expect(frame(el).drawerOpen).toBe(before);
  });

  it('AltGr and a backslash types text and changes nothing', async () => {
    const el = await mount();
    await wide(el);
    const before = frame(el).drawerOpen;
    const e = ctrlBackslash({ ctrlKey: false });
    Object.defineProperty(e, 'getModifierState', { value: (k: string) => k === 'AltGraph' });
    q(el, '.stage')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(false);
    expect(frame(el).drawerOpen).toBe(before);
  });

  it('Tab wrapping skips controls inside a hidden panel', async () => {
    const el = await mount();
    await wide(el);
    lip(el, 'side').click();
    await el.updateComplete;
    (el as unknown as { wrapFocus(end: boolean): void }).wrapFocus(true);
    expect(el.shadowRoot!.activeElement?.closest('[data-lip="hidden"]') ?? null).toBeNull();
  });

  it('Skip to inspector opens a closed inspector drawer first', async () => {
    const el = await mount();
    await wide(el);
    (frame(el) as unknown as { closeDrawer(): void }).closeDrawer();
    await el.updateComplete;
    expect(frame(el).drawerOpen).toBe(false);
    const skip = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.skips button')].find((b) => b.textContent!.includes('inspector'))!;
    skip.click();
    await el.updateComplete;
    await el.updateComplete;
    expect(frame(el).drawerOpen).toBe(true);
  });

  it('the shortcut list names Ctrl and Command', () => {
    expect(SHORTCUTS).toContain(msgIndex('shape-editor.names.show-or-hide-panels-ctrl-or'));
  });

});
