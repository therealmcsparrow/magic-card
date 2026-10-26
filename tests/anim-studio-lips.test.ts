import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LAYERS_KEY } from '../src/anim-studio/studio';
import { studioStyles } from '../src/anim-studio/studio-styles';

const rigged = {
  id: 'rigged', name: 'Rigged bell', kind: 'keyframes', duration: 1.6,
  keyframes: [{ at: 0, opacity: 1 }, { at: 100, opacity: 1 }],
  tracks: [{ target: 'name', keyframes: [{ at: 0, opacity: 1 }, { at: 100, opacity: 0.5 }] }],
  rig: { icon: 'mdi:bell-ring', parts: [{ id: 'clapper', name: 'Clapper', from: [1] }], shapes: [{ id: 'halo', name: 'Halo', d: 'M2 2H22V22H2Z', fill: 'red', layer: 'under' }] },
};
const tick = async (n = 4) => {
  for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0));
};
type Studio = HTMLElement & { library?: unknown; standalone: boolean; updateComplete: Promise<boolean>; _width: number };

async function open(width: number) {
  await import('../src/index');
  await import('../src/anim-studio/index');
  const el = document.createElement('magic-card-animation-studio') as Studio;
  el.standalone = true;
  el.library = { rigged };
  document.body.appendChild(el);
  await el.updateComplete;
  await tick();
  el._width = width;
  el.shadowRoot!.querySelector<HTMLButtonElement>('.lib-row[data-id="rigged"] .open')!.click();
  await tick();
  await el.updateComplete;
  const root = el.shadowRoot!;
  const settle = async () => {
    await tick();
    await el.updateComplete;
    await tick();
  };
  return { el, root, settle };
}
const lip = (root: ShadowRoot, id: string): HTMLButtonElement => root.querySelector<HTMLButtonElement>(`.lip[aria-controls="${id}"]`)!;
const ctrlBackslash = (): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true });

describe('animation studio panel lips', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it('has a lip for Layers and one for the Inspector, in tab order, and a status region from the first render', async () => {
    const t = await open(1440);
    expect(lip(t.root, 'layers').getAttribute('aria-label')).toBe('Layers panel');
    expect(lip(t.root, 'inspector').getAttribute('aria-label')).toBe('Inspector panel');
    expect(t.root.getElementById('layers')!.getAttribute('aria-label')).toBe('Layers panel');
    expect(t.root.getElementById('inspector')!.getAttribute('aria-label')).toBe('Inspector panel');
    expect(lip(t.root, 'layers').getAttribute('aria-expanded')).toBe('true');
    expect(t.root.querySelector('.lip-status[role="status"]')).not.toBeNull();
    const layers = t.root.querySelector<HTMLElement>('#layers')!;
    expect(layers.dataset.lip).toBe('shown');
    expect(layers.nextElementSibling).toBe(lip(t.root, 'layers'));
    expect(lip(t.root, 'inspector').nextElementSibling).toBe(t.root.querySelector('#inspector'));
  });

  it('the icons-only rail and its Collapse layers button are gone', async () => {
    const t = await open(944);
    expect(t.root.querySelector('.rail-toggle')).toBeNull();
    expect(t.root.querySelector('.layers.rail, .workspace.rail')).toBeNull();
    expect(t.root.textContent).not.toContain('Collapse layers');
    expect(t.root.querySelector('.layers-head h2')!.textContent).toBe('Layers');
  });

  it('hiding Layers gives the canvas its track, keeps the panel mounted, remembers it per device', async () => {
    const t = await open(1440);
    const layers = t.root.querySelector<HTMLElement>('#layers')!;
    lip(t.root, 'layers').click();
    await t.settle();
    expect(t.root.querySelector('#layers')).toBe(layers);
    expect(layers.dataset.lip).toBe('hidden');
    expect(layers.hasAttribute('inert')).toBe(true);
    expect(t.root.querySelector('.workspace')!.classList.contains('no-layers')).toBe(true);
    expect(localStorage.getItem('mc-panels:anim-studio')).toBe('layers');
    expect(lip(t.root, 'layers').getAttribute('aria-expanded')).toBe('false');
    // the panel is out of the focus order
    expect(getComputedStyle(layers).visibility).toBe('hidden');
    t.el.remove();

    const again = await open(1440);
    expect(again.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
    expect(again.root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('shown');
  });

  it('hiding the Inspector gives the canvas its track and keeps the panel', async () => {
    const t = await open(1440);
    const insp = t.root.querySelector<HTMLElement>('#inspector')!;
    lip(t.root, 'inspector').click();
    await t.settle();
    expect(t.root.querySelector('#inspector')).toBe(insp);
    expect(insp.dataset.lip).toBe('hidden');
    expect(t.root.querySelector('.workspace')!.classList.contains('no-inspector')).toBe(true);
  });

  it('Ctrl+\\ hides both column panels and shows them again, and announces it', async () => {
    const t = await open(1440);
    const ev = ctrlBackslash();
    t.el.shadowRoot!.querySelector('.stage-wrap, mcas-stage, .center')!.dispatchEvent(ev);
    await t.settle();
    expect(ev.defaultPrevented).toBe(true);
    expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
    expect(t.root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('hidden');
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await t.settle();
    expect(t.root.querySelector('.lip-status')!.textContent).toBe('Layers and inspector hidden');
    t.root.querySelector('.center')!.dispatchEvent(ctrlBackslash());
    await t.settle();
    expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
    expect(t.root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('shown');
  });

  it('the Inspector slide-over is not a column: no lip, no hidden state; Layers keeps its lip', async () => {
    localStorage.setItem('mc-panels:anim-studio', 'inspector');
    const t = await open(800);
    expect(lip(t.root, 'inspector')).toBeNull();
    expect(t.root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('off');
    expect(t.root.querySelector('.workspace')!.classList.contains('no-inspector')).toBe(false);
    expect(lip(t.root, 'layers')).not.toBeNull();
    // the slide-over still opens from its own button
    t.root.querySelector<HTMLButtonElement>('.insp-toggle')!.click();
    await t.settle();
    expect(t.root.querySelector('.workspace')!.classList.contains('insp-open')).toBe(true);
    // Ctrl+\ touches only the column panel
    t.root.querySelector('.center')!.dispatchEvent(ctrlBackslash());
    await t.settle();
    expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
    expect(t.root.querySelector('.workspace')!.classList.contains('insp-open')).toBe(true);
  });

  describe('the earlier Collapse layers choice (mcas-layers)', () => {
    it('rail: Layers opens hidden once, the hint explains it in its own words, the choice is written under the new key', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      const t = await open(1440);
      expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
      expect(localStorage.getItem('mc-panels:anim-studio')).toBe('layers');
      const hint = t.root.querySelector('.lip-hint')!;
      expect(hint.querySelector('p')!.textContent).toBe('The layers panel is hidden, as you collapsed it before. Use the arrow on the edge to show it.');
      expect(lip(t.root, 'layers').getAttribute('aria-describedby')).toBe(hint.id);
    });

    it('showing Layers keeps it shown on the next open', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      const t = await open(1440);
      lip(t.root, 'layers').click();
      await t.settle();
      expect(localStorage.getItem('mc-panels:anim-studio')).toBeNull();
      expect(localStorage.getItem(LAYERS_KEY)).toBeNull();
      t.el.remove();
      const again = await open(1440);
      expect(again.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
      expect(again.root.querySelector('.lip-hint')).toBeNull();
    });

    it('open, unknown values and nothing stored leave Layers shown', async () => {
      for (const v of ['open', 'something else', '']) {
        document.body.innerHTML = '';
        localStorage.clear();
        localStorage.setItem(LAYERS_KEY, v);
        const t = await open(1440);
        expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
      }
    });

    it('a stored panel state wins over the old key', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      localStorage.setItem('mc-panels:anim-studio', 'inspector');
      const t = await open(1440);
      expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
      expect(t.root.querySelector<HTMLElement>('#inspector')!.dataset.lip).toBe('hidden');
    });

    it('blocked storage: both panels open shown and nothing throws', async () => {
      const real = Object.getOwnPropertyDescriptor(window, 'localStorage')!;
      let touched = 0;
      Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { touched++; throw new Error('blocked'); } });
      try {
        const t = await open(1440);
        expect(touched).toBeGreaterThan(0);
        expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('shown');
        lip(t.root, 'layers').click();
        await t.settle();
        expect(t.root.querySelector<HTMLElement>('#layers')!.dataset.lip).toBe('hidden');
      } finally {
        Object.defineProperty(window, 'localStorage', real);
      }
    });
  });

  it('the stylesheet: no rail rules; a hidden panel keeps its width; the tracks follow the hidden state', () => {
    const css = studioStyles.map((s) => s.cssText).join('\n');
    expect(css).not.toMatch(/\.rail\b/);
    expect(css).toMatch(/\.layers\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--layers-w\)/);
    expect(css).toMatch(/\.inspector\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--insp-w\)/);
    expect(css).toMatch(/\.no-layers\s*\{[^}]*--lw:\s*0px/);
    expect(css).toMatch(/\.no-inspector\s*\{[^}]*--iw:\s*0px/);
  });
});
