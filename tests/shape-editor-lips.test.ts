import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import '../src/index';
import '../src/shape-editor/index';
import { loadCustomShapes } from '../src/utils/shape-custom-loader';
import { studioStyles } from '../src/shape-editor/styles';
import { SHORTCUTS } from '../src/shape-editor/names';
import type { McShapeStudio } from '../src/shape-editor/mc-shape-studio';
import { LIP_HOST_ATTR } from '../src/contracts/ui-kit';

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
const lip = (el: McShapeStudio, id: string): HTMLButtonElement => q<HTMLButtonElement>(el, `.lip[aria-controls="${id}"]`)!;
const ctrlBackslash = (init: KeyboardEventInit = {}): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true, ...init });
const css = (): string => studioStyles.map((s) => s.cssText).join('\n');
const setLayout = async (el: McShapeStudio, layout: string): Promise<void> => {
  (el as unknown as { layout: string }).layout = layout;
  await el.updateComplete;
};

describe('Shape studio panel lips', () => {
  it('wide: a lip for the side panel and the inspector, a status region, the lip after the side panel and before the inspector', async () => {
    const el = await mount();
    await setLayout(el, 'wide');
    expect(lip(el, 'side').getAttribute('aria-label')).toBe('Side panel');
    expect(lip(el, 'inspector').getAttribute('aria-label')).toBe('Inspector panel');
    expect(q(el, '.lip-status[role="status"]')).not.toBeNull();
    expect(q(el, '#side')!.nextElementSibling).toBe(lip(el, 'side'));
    expect(lip(el, 'inspector').nextElementSibling).toBe(q(el, '#inspector'));
    expect(el.hasAttribute(LIP_HOST_ATTR)).toBe(true);
  });

  it('compact has the inspector lip only, stacked none; a remembered hidden side panel waits for a column', async () => {
    localStorage.setItem('mc-panels:shape-studio', 'side');
    const el = await mount();
    await setLayout(el, 'compact');
    expect(lip(el, 'side')).toBeNull();
    expect(lip(el, 'inspector')).not.toBeNull();
    await setLayout(el, 'stacked');
    expect(el.shadowRoot!.querySelectorAll('.lip').length).toBe(0);
    await setLayout(el, 'wide');
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('hidden');
  });

  it('hiding a panel keeps it mounted and inert, gives its track to the stage and remembers it', async () => {
    const el = await mount();
    await setLayout(el, 'wide');
    const insp = q<HTMLElement>(el, '#inspector')!;
    lip(el, 'inspector').click();
    await el.updateComplete;
    expect(q(el, '#inspector')).toBe(insp);
    expect(insp.dataset.lip).toBe('hidden');
    expect(insp.hasAttribute('inert')).toBe(true);
    expect(q(el, '.work')!.classList.contains('no-insp')).toBe(true);
    expect(localStorage.getItem('mc-panels:shape-studio')).toBe('inspector');
  });

  it('a hidden lip sits in the 40 px gutter at the window edge; a shown one inside its panel', async () => {
    localStorage.setItem('mc-panels:shape-studio', 'inspector');
    const el = await mount();
    await setLayout(el, 'wide');
    const style = q<HTMLElement>(el, '.work')!.getAttribute('style')!;
    expect(style).toMatch(/--mc-lip-at-end:\s*calc\(0px - var\(--lg\)\)/);
    expect(style).toMatch(/--mc-lip-at-start:\s*calc\(var\(--lw\) - 24px - var\(--lx\) - 0px - 1px\)/);
    expect(css()).toMatch(/\.no-side\{[^}]*--lt:40px/);
    expect(css()).toMatch(/\.no-insp\{[^}]*--it:40px/);
  });

  it('a hidden panel keeps its own width and is never squeezed to 0', () => {
    expect(css()).toMatch(/\.left\[data-lip=hidden\]\{[^}]*width:var\(--lw\)/);
    expect(css()).toMatch(/\.insp\[data-lip=hidden\]\{[^}]*width:var\(--iw\)/);
    expect(css()).not.toMatch(/\[data-lip=hidden\]\{[^}]*(?:max-)?width:0[;}]/);
  });

  it('Ctrl and backslash from the stage hide both panels and again show them', async () => {
    const el = await mount();
    await setLayout(el, 'wide');
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
    const el = await mount();
    await setLayout(el, 'wide');
    const e = ctrlBackslash({ ctrlKey: false });
    Object.defineProperty(e, 'getModifierState', { value: (k: string) => k === 'AltGraph' });
    q(el, '.stage')!.dispatchEvent(e);
    await el.updateComplete;
    expect(e.defaultPrevented).toBe(false);
    expect(q<HTMLElement>(el, '#side')!.dataset.lip).toBe('shown');
  });

  it('Tab wrapping skips controls inside a hidden panel', async () => {
    const el = await mount();
    await setLayout(el, 'wide');
    lip(el, 'inspector').click();
    await el.updateComplete;
    (el as unknown as { wrapFocus(end: boolean): void }).wrapFocus(true);
    expect(el.shadowRoot!.activeElement?.closest('[data-lip="hidden"]') ?? null).toBeNull();
  });

  it('Skip to inspector brings a hidden inspector back first', async () => {
    localStorage.setItem('mc-panels:shape-studio', 'inspector');
    const el = await mount();
    await setLayout(el, 'wide');
    const skip = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.skips button')].find((b) => b.textContent!.includes('inspector'))!;
    skip.click();
    await el.updateComplete;
    await el.updateComplete;
    expect(q<HTMLElement>(el, '#inspector')!.dataset.lip).toBe('shown');
    expect(localStorage.getItem('mc-panels:shape-studio')).toBeNull();
  });

  it('the shortcut list names Ctrl and Command', () => {
    expect(SHORTCUTS).toContain('Show or hide panels: Ctrl+\\ or ⌘\\');
  });

  it('takes the Dutch names in a Dutch interface', async () => {
    const el = await mount('nl');
    await setLayout(el, 'wide');
    expect(lip(el, 'inspector').getAttribute('aria-label')).toBe('Inspectorpaneel');
  });
});
