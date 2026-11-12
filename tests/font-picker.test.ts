// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FontPicker, normaliseFontValue } from '../src/editor/components/font-picker';
import { whenGoogleFontsAllowed } from '../src/utils/google-fonts';
import { defineUiKit } from '../src/ui-kit';

defineUiKit();

const w = window as unknown as { magicCardUtils?: { settings?: { googleFonts?: boolean } } };
const links = () => [...document.head.querySelectorAll<HTMLLinkElement>('link[data-mc-font]')];
const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms));

async function mount(): Promise<FontPicker> {
  const el = document.createElement('mc-font-picker') as FontPicker;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const root = (el: FontPicker) => el.shadowRoot!;
const tabs = (el: FontPicker) => [...root(el).querySelectorAll<HTMLButtonElement>('[role="tab"]')];
async function open(el: FontPicker): Promise<void> {
  root(el).querySelector<HTMLButtonElement>('.mc-picker-row button')!.click();
  await el.updateComplete;
  await flush();
  await el.updateComplete;
}
const cats = (el: FontPicker) => [...root(el).querySelectorAll<HTMLButtonElement>('.mc-font-cat')];
const rows = (el: FontPicker) => [...root(el).querySelectorAll<HTMLElement>('[data-gf]')];
async function search(el: FontPicker, q: string): Promise<void> {
  const input = root(el).querySelector<HTMLInputElement>('.mc-picker-search input[type="search"], .mc-picker-search input')!;
  input.value = q;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await el.updateComplete;
  await flush();
}

beforeEach(() => {
  document.body.innerHTML = '';
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  links().forEach((l) => l.remove());
  delete w.magicCardUtils;
});

describe('gate off', () => {
  it('has no Google tab and adds no font links', async () => {
    const el = await mount();
    await open(el);
    expect(tabs(el)).toHaveLength(1);
    expect(links()).toHaveLength(0);
  });
});

describe('gate on', () => {
  beforeEach(() => {
    w.magicCardUtils = { settings: { googleFonts: true } };
  });

  it('lists the five categories and finds and saves Lobster', async () => {
    const el = await mount();
    const events: string[] = [];
    el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail.value));
    await open(el);
    expect(tabs(el)).toHaveLength(2);
    tabs(el)[1].click();
    await el.updateComplete;
    expect(cats(el)).toHaveLength(5);
    await search(el, 'lobster');
    const names = rows(el).map((r) => r.dataset.gf);
    expect(names).toContain('Lobster');
    rows(el).find((r) => r.dataset.gf === 'Lobster')!.click();
    await el.updateComplete;
    root(el).querySelector<HTMLButtonElement>('.btn-primary')!.click();
    await flush();
    expect(events).toEqual(['"Lobster", sans-serif']);
  });

  it('caps the list at 60 rows with a refine line and at most 60 font links', async () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const el = await mount();
    await open(el);
    tabs(el)[1].click();
    await el.updateComplete;
    await flush();
    expect(rows(el).length).toBe(60);
    expect(root(el).querySelector('.mc-font-more')).not.toBeNull();
    expect(links().length).toBeLessThanOrEqual(60);
    expect(links().length).toBeGreaterThan(0);
  });

  it('loads only the rows an observer reports in view', async () => {
    const seen: Element[] = [];
    let fire: (els: Element[]) => void = () => 0;
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: (e: unknown[]) => void) {
        fire = (els) => cb(els.map((target) => ({ target, isIntersecting: true })));
      }
      observe(el: Element) { seen.push(el); }
      disconnect() { seen.length = 0; }
    });
    const el = await mount();
    await open(el);
    tabs(el)[1].click();
    await el.updateComplete;
    await flush();
    expect(rows(el).length).toBe(60);
    expect(links()).toHaveLength(0);
    fire(seen.slice(0, 3));
    await flush();
    expect(links()).toHaveLength(3);
  });

  it('filters by category', async () => {
    const el = await mount();
    await open(el);
    tabs(el)[1].click();
    await el.updateComplete;
    cats(el)[4].click();
    await el.updateComplete;
    expect(cats(el)[4].getAttribute('aria-pressed')).toBe('true');
    expect(rows(el).length).toBeGreaterThan(0);
    expect(root(el).querySelectorAll('.mc-picker-item .mc-picker-item-meta').length).toBe(rows(el).length);
  });

  it('normalises typed text on change, not per keystroke', async () => {
    const el = await mount();
    const events: string[] = [];
    el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail.value));
    const input = root(el).querySelector<HTMLInputElement>('.mc-picker-row input')!;
    input.value = 'lato';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(events).toEqual(['lato']);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();
    expect(events.at(-1)).toBe('"Lato", sans-serif');
  });
});

describe('normaliseFontValue', () => {
  it('turns a bare catalogue name into a stored value and leaves the rest', async () => {
    expect(await normaliseFontValue('lato')).toBe('"Lato", sans-serif');
    expect(await normaliseFontValue(' Arial ')).toBe('Arial');
    expect(await normaliseFontValue('var(--x)')).toBe('var(--x)');
    expect(await normaliseFontValue('"Lato", sans-serif')).toBe('"Lato", sans-serif');
  });

  it('still normalises with the gate closed and requests nothing', async () => {
    expect(await normaliseFontValue('Lobster')).toBe('"Lobster", sans-serif');
    expect(links()).toHaveLength(0);
  });
});

describe('whenGoogleFontsAllowed', () => {
  it('adds one listener for many waiters and runs them all on the event', () => {
    const added: string[] = [];
    const orig = window.addEventListener.bind(window);
    window.addEventListener = ((type: string, ...rest: unknown[]) => {
      if (type === 'mcu-settings') added.push(type);
      return (orig as (...a: unknown[]) => void)(type, ...rest);
    }) as typeof window.addEventListener;
    try {
      let fired = 0;
      for (let i = 0; i < 5; i++) whenGoogleFontsAllowed(() => fired++);
      expect(added).toHaveLength(1);
      window.dispatchEvent(new CustomEvent('mcu-settings'));
      expect(fired).toBe(0);
      w.magicCardUtils = { settings: { googleFonts: true } };
      window.dispatchEvent(new CustomEvent('mcu-settings'));
      expect(fired).toBe(5);
    } finally {
      window.addEventListener = orig as typeof window.addEventListener;
    }
  });
});

describe('font picker name', () => {
  it('names its textbox after the label, "Font family" without one', async () => {
    const el = await mount();
    const input = () => root(el).querySelector<HTMLInputElement>('.mc-picker-row input')!;
    expect(input().getAttribute('aria-label')).toBe('Font family');
    el.label = 'Heading font';
    await el.updateComplete;
    expect(input().getAttribute('aria-label')).toBe('Heading font');
  });
});

describe('switch turned on while the dialog is open', () => {
  it('fills the Google tab without reopening', async () => {
    const el = await mount();
    await open(el);
    expect(tabs(el)).toHaveLength(1);
    w.magicCardUtils = { settings: { googleFonts: true } };
    window.dispatchEvent(new CustomEvent('mcu-settings'));
    await el.updateComplete;
    tabs(el)[1].click();
    await el.updateComplete;
    for (let i = 0; i < 20 && !rows(el).length; i++) {
      await flush(25);
      await el.updateComplete;
    }
    expect(rows(el).length).toBeGreaterThan(0);
  });
});

describe('typing marks its events', () => {
  it('flags keystrokes as typing and the change normalisation as not', async () => {
    w.magicCardUtils = { settings: { googleFonts: true } };
    const el = await mount();
    const events: Array<{ value: string; typing?: boolean }> = [];
    el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail));
    const input = root(el).querySelector<HTMLInputElement>('.mc-picker-row input')!;
    input.value = 'lato';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flush();
    expect(events).toEqual([{ value: 'lato', typing: true }, { value: '"Lato", sans-serif' }]);
  });
});
