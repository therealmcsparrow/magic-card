import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import type { LitElement } from 'lit';
import { defineUiKit } from '../src/ui-kit';
import { defineKitElements } from '../src/ui-kit/define-parts';
import {
  UI_CHIP_GROUP_TAG,
  UI_DISCLOSURE_TAG,
  UI_KIT_CONTRACT_REVISION,
  UI_KIT_CONTRACT_VERSION,
  UI_TILE_GROUP_TAG,
  UI_TOAST_TAG,
} from '../src/contracts/ui-kit';
import type { UiChoice, UiChoiceGroupElement, UiDisclosureElement, UiToastElement } from '../src/contracts/ui-kit';

/* ui-kit 1.1.0: disclosure, tile group, chip group (manual activation), toast pause / dismiss / Escape. */

beforeAll(() => defineUiKit());
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

const flush = async (el: HTMLElement): Promise<void> => {
  await (el as unknown as LitElement).updateComplete;
  await Promise.resolve();
};
const rootOf = (el: HTMLElement): ShadowRoot => (el as unknown as LitElement).renderRoot as ShadowRoot;

const ITEMS: UiChoice[] = [
  { value: 'energy', label: 'Energy', description: 'Glowing line.', preview: '<svg viewBox="0 0 72 56"><path d="M0 0"/></svg>' },
  { value: 'water', label: 'Water', description: 'Blue tube.', preview: '<svg viewBox="0 0 72 56"><path d="M1 1"/></svg>' },
  { value: 'data', label: 'Data' },
  { value: 'heat', label: 'Heat', description: 'Warm wave.' },
];

describe('ui-kit 1.2.0 r5 definition', () => {
  it('has the new version and revision, and defines the three tags once', () => {
    expect(UI_KIT_CONTRACT_VERSION).toBe('1.2.0');
    expect(UI_KIT_CONTRACT_REVISION).toBe(5);
    for (const tag of [UI_DISCLOSURE_TAG, UI_TILE_GROUP_TAG, UI_CHIP_GROUP_TAG]) {
      const cls = customElements.get(tag) as unknown as { uiKitRevision: number };
      expect(cls.uiKitRevision).toBe(5);
      expect(() => defineUiKit()).not.toThrow();
      expect(customElements.get(tag)).toBe(cls);
    }
  });

  it('keeps a tag that another bundle already defined', () => {
    class Other extends HTMLElement {}
    customElements.define('mc-ui-test-claimed', Other);
    class Mine extends HTMLElement {}
    expect(() => defineKitElements([['mc-ui-test-claimed', Mine]])).not.toThrow();
    expect(customElements.get('mc-ui-test-claimed')).toBe(Other);
  });
});

describe('<mc-ui-disclosure>', () => {
  const mount = async (open = false): Promise<UiDisclosureElement> => {
    const d = document.createElement(UI_DISCLOSURE_TAG) as UiDisclosureElement;
    d.heading = 'Value and route';
    d.summary = 'Curve · 0 to 100';
    d.open = open;
    d.innerHTML = '<input id="x" />';
    document.body.append(d);
    await flush(d);
    return d;
  };

  it('is a button in a heading with aria-expanded and aria-controls; the summary is part of the name', async () => {
    const d = await mount();
    const root = rootOf(d);
    const head = root.querySelector('[role=heading]')!;
    const btn = head.querySelector('button')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.textContent).toContain('Value and route');
    expect(btn.textContent).toContain('Curve · 0 to 100');
    const body = root.getElementById(btn.getAttribute('aria-controls')!)!;
    expect(body.hasAttribute('hidden')).toBe(true);
    expect(body.getAttribute('aria-labelledby')).toBe(btn.id);
  });

  it('click toggles, shows the body and fires mc-toggle (bubbles, composed)', async () => {
    const d = await mount();
    const seen = vi.fn();
    document.body.addEventListener('mc-toggle', (e) => seen((e as CustomEvent).detail, e.bubbles, e.composed));
    rootOf(d).querySelector('button')!.click();
    await flush(d);
    expect(d.open).toBe(true);
    expect(seen).toHaveBeenCalledWith({ open: true }, true, true);
    expect(rootOf(d).querySelector('.body')!.hasAttribute('hidden')).toBe(false);
    expect(rootOf(d).querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
  });

  it('an inspector that sets open again after the event wins', async () => {
    const d = await mount(true);
    d.addEventListener('mc-toggle', () => {
      d.open = true;
    });
    rootOf(d).querySelector('button')!.click();
    await flush(d);
    expect(d.open).toBe(true);
  });
});

for (const tag of [UI_TILE_GROUP_TAG, UI_CHIP_GROUP_TAG]) {
  describe(`<${tag}> manual activation`, () => {
    const mount = async (value?: string): Promise<{ g: UiChoiceGroupElement; picks: string[]; buttons: () => HTMLButtonElement[] }> => {
      const g = document.createElement(tag) as UiChoiceGroupElement;
      g.label = 'Presets';
      g.items = ITEMS;
      g.value = value;
      const picks: string[] = [];
      g.addEventListener('mc-pick', (e) => picks.push((e as CustomEvent).detail.value));
      document.body.append(g);
      await flush(g);
      return { g, picks, buttons: () => Array.from(rootOf(g).querySelectorAll<HTMLButtonElement>('button.opt')) };
    };
    const key = (el: Element, k: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true }));

    it('is a named group of buttons with aria-pressed; previews are aria-hidden and the label is the name', async () => {
      const { g, buttons } = await mount('water');
      const group = rootOf(g).querySelector('[role=group]')!;
      expect(group.getAttribute('aria-label')).toBe('Presets');
      expect(buttons().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false', 'false']);
      expect(buttons().every((b) => b.type === 'button')).toBe(true);
      const pv = rootOf(g).querySelector('.pv')!;
      expect(pv.getAttribute('aria-hidden')).toBe('true');
      expect(buttons()[0].querySelector('.nm')!.textContent).toBe('Energy');
      expect(rootOf(g).querySelector('[role=radio],[aria-checked]')).toBeNull();
    });

    it('has one tab stop: the picked item, else the first', async () => {
      const a = await mount('data');
      expect(a.buttons().map((b) => b.tabIndex)).toEqual([-1, -1, 0, -1]);
      document.body.innerHTML = '';
      const b = await mount();
      expect(b.buttons().map((x) => x.tabIndex)).toEqual([0, -1, -1, -1]);
    });

    it('arrows, Home and End move focus only and never fire mc-pick', async () => {
      const { g, picks, buttons } = await mount('energy');
      const bs = buttons();
      bs[0].focus();
      key(bs[0], 'ArrowRight');
      await flush(g);
      expect(rootOf(g).activeElement).toBe(bs[1]);
      key(bs[1], 'ArrowDown');
      await flush(g);
      expect(rootOf(g).activeElement).toBe(bs[2]);
      key(bs[2], 'End');
      await flush(g);
      expect(rootOf(g).activeElement).toBe(bs[3]);
      key(bs[3], 'ArrowRight');
      await flush(g);
      expect(rootOf(g).activeElement).toBe(bs[0]);
      key(bs[0], 'Home');
      key(bs[0], 'ArrowLeft');
      await flush(g);
      expect(rootOf(g).activeElement).toBe(bs[3]);
      expect(picks).toEqual([]);
      expect(g.value).toBe('energy');
      expect(buttons().map((b) => b.tabIndex)).toEqual([-1, -1, -1, 0]);
    });

    it('focus alone does not pick; a click (what Space and Enter do on a button) fires mc-pick once', async () => {
      const { g, picks, buttons } = await mount();
      buttons()[1].focus();
      await flush(g);
      expect(picks).toEqual([]);
      buttons()[1].click();
      expect(picks).toEqual(['water']);
      // the host owns value: nothing changed until it sets it
      expect(buttons()[1].getAttribute('aria-pressed')).toBe('false');
      g.value = 'water';
      await flush(g);
      expect(buttons()[1].getAttribute('aria-pressed')).toBe('true');
    });

    it('lets Space and Enter through untouched, so the browser clicks the button', async () => {
      const { g, buttons } = await mount();
      for (const k of [' ', 'Enter']) {
        const e = new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true });
        buttons()[0].dispatchEvent(e);
        expect(e.defaultPrevented).toBe(false);
      }
      await flush(g);
    });

    it('shows one description line for the focused item, else the picked one, tied by aria-describedby', async () => {
      const { g, buttons } = await mount('energy');
      expect(rootOf(g).querySelector('.desc')!.textContent).toBe('Glowing line.');
      buttons()[3].focus();
      await flush(g);
      const d = rootOf(g).querySelector('.desc')!;
      expect(d.textContent).toBe('Warm wave.');
      expect(buttons()[3].getAttribute('aria-describedby')).toBe(d.id);
      buttons()[2].focus();
      await flush(g);
      expect(rootOf(g).querySelector('.desc')).toBeNull();
    });
  });
}

describe('<mc-ui-toast> r5', () => {
  const mount = async (dismissLabel?: string) => {
    const t = document.createElement(UI_TOAST_TAG) as UiToastElement;
    if (dismissLabel) t.dismissLabel = dismissLabel;
    document.body.append(t);
    await flush(t);
    return t;
  };

  it('stays open for the full 20 s duration, then closes', async () => {
    vi.useFakeTimers();
    const t = await mount();
    t.show({ text: 'Water look applied', duration: 20_000 });
    vi.advanceTimersByTime(19_900);
    expect(t.open).toBe(true);
    vi.advanceTimersByTime(200);
    expect(t.open).toBe(false);
  });

  it('a press inside pauses until the pointer is released anywhere', async () => {
    vi.useFakeTimers();
    const t = await mount();
    t.show({ text: 'x', duration: 20_000 });
    await flush(t);
    const toast = rootOf(t).querySelector('.toast')!;
    vi.advanceTimersByTime(10_000);
    toast.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    vi.advanceTimersByTime(60_000);
    expect(t.open).toBe(true);
    window.dispatchEvent(new Event('pointerup'));
    vi.advanceTimersByTime(19_900);
    expect(t.open).toBe(true);
    vi.advanceTimersByTime(200);
    expect(t.open).toBe(false);
  });

  it('hover and focus within still pause', async () => {
    vi.useFakeTimers();
    const t = await mount();
    t.show({ text: 'x', duration: 20_000 });
    await flush(t);
    const toast = rootOf(t).querySelector('.toast')!;
    toast.dispatchEvent(new Event('pointerenter'));
    vi.advanceTimersByTime(60_000);
    expect(t.open).toBe(true);
    toast.dispatchEvent(new Event('pointerleave'));
    vi.advanceTimersByTime(20_100);
    expect(t.open).toBe(false);
  });

  it('has a dismiss button only when dismissLabel is set; it closes the toast', async () => {
    const plain = await mount();
    plain.show({ text: 'x' });
    await flush(plain);
    expect(rootOf(plain).querySelector('.dismiss')).toBeNull();
    document.body.innerHTML = '';
    const t = await mount('Dismiss');
    t.show({ text: 'x', action: { id: 'undo', label: 'Undo' } });
    await flush(t);
    const b = rootOf(t).querySelector<HTMLButtonElement>('.dismiss')!;
    expect(b.getAttribute('aria-label')).toBe('Dismiss');
    expect(b.type).toBe('button');
    expect(rootOf(t).querySelector('.toast')!.classList.contains('big')).toBe(true);
    b.click();
    expect(t.open).toBe(false);
  });

  it('Escape closes it, from anywhere on the page, and stops listening afterwards', async () => {
    const t = await mount('Dismiss');
    t.show({ text: 'x' });
    await flush(t);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(t.open).toBe(false);
    const spy = vi.spyOn(t, 'close');
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('Escape with focus inside the toast does not reach an outer Escape handler', async () => {
    const t = await mount('Dismiss');
    t.show({ text: 'x' });
    await flush(t);
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    const b = rootOf(t).querySelector('.dismiss')!;
    b.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    expect(t.open).toBe(false);
    expect(outer).not.toHaveBeenCalled();
  });
});
