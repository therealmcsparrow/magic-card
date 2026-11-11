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
const layersToggle = (root: ShadowRoot): HTMLButtonElement => root.querySelector<HTMLButtonElement>('.layers-toggle[aria-controls="layers"]')!;
const drawerToggle = (root: ShadowRoot): HTMLButtonElement => root.querySelector<HTMLButtonElement>('.insp-toggle[aria-controls="inspector"]')!;
const frameOf = (root: ShadowRoot) => root.querySelector('mc-ui-studio-frame') as unknown as { drawerOpen: boolean; strings: { drawer: string } };
const ctrlBackslash = (): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true });

describe('animation studio panels in the frame', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    sessionStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it('keeps the Inspector name while a layer is selected', async () => {
    const t = await open(1440);
    (t.el as unknown as { _selection: unknown })._selection = { kind: 'target', target: 'part:clapper', targets: ['part:clapper'] };
    await t.settle();
    expect((t.el as unknown as { _selection: { kind: string } })._selection.kind).toBe('target');
    expect(frameOf(t.root).strings.drawer).toBe('Inspector');
    expect(drawerToggle(t.root).getAttribute('aria-label')).toBe('Inspector');
  });

  it('has a bar toggle for Layers and one for the Inspector, in tab order, and a status region from the first render', async () => {
    const t = await open(1440);
    expect(layersToggle(t.root).getAttribute('aria-label')).toBe('Layers');
    expect(layersToggle(t.root).getAttribute('aria-expanded')).toBe('true');
    expect(t.root.getElementById('layers')!.getAttribute('aria-label')).toBe('Layers panel');
    expect(t.root.querySelector('.lip-status[role="status"]')).not.toBeNull();
    const buttons = [...t.root.querySelectorAll<HTMLElement>('.fr-bar button')];
    expect(buttons.indexOf(layersToggle(t.root))).toBeLessThan(buttons.indexOf(drawerToggle(t.root)));
  });

  it('the icons-only rail and its Collapse layers button are gone', async () => {
    const t = await open(1100);
    expect(t.root.querySelector('.rail-toggle')).toBeNull();
    expect(t.root.querySelector('.layers.rail, .workspace')).toBeNull();
    expect(t.root.textContent).not.toContain('Collapse layers');
    expect(t.root.querySelector('.layers-head h2')!.textContent).toBe('Layers');
  });

  it('hiding Layers removes the panel from the frame and remembers it per device', async () => {
    const t = await open(1440);
    layersToggle(t.root).click();
    await t.settle();
    expect(t.root.querySelector('#layers')).toBeNull();
    expect(localStorage.getItem('mc-panels:anim-studio')).toBe('layers');
    expect(layersToggle(t.root).getAttribute('aria-expanded')).toBe('false');
    t.el.remove();

    const again = await open(1440);
    expect(again.root.querySelector('#layers')).toBeNull();
    expect(layersToggle(again.root).getAttribute('aria-expanded')).toBe('false');
  });

  it('the Inspector toggle closes and opens the drawer', async () => {
    const t = await open(1440);
    const f = frameOf(t.root);
    const was = f.drawerOpen;
    drawerToggle(t.root).click();
    await t.settle();
    expect(f.drawerOpen).toBe(!was);
    expect(drawerToggle(t.root).getAttribute('aria-expanded')).toBe(String(!was));
  });

  it('Ctrl+\\ toggles the drawer', async () => {
    const t = await open(1440);
    const f = frameOf(t.root);
    const was = f.drawerOpen;
    const ev = ctrlBackslash();
    t.root.querySelector('mcas-stage')!.dispatchEvent(ev);
    await t.settle();
    expect(ev.defaultPrevented).toBe(true);
    expect(f.drawerOpen).toBe(!was);
    t.root.querySelector('mcas-stage')!.dispatchEvent(ctrlBackslash());
    await t.settle();
    expect(f.drawerOpen).toBe(was);
  });

  it('below 1024 px Layers is a sheet behind its bar toggle and the Inspector opens from Settings', async () => {
    const t = await open(800);
    expect(layersToggle(t.root).getAttribute('aria-expanded')).toBe('false');
    expect(t.root.querySelector('#layers')).toBeNull();
    expect(drawerToggle(t.root).getAttribute('aria-haspopup')).toBe('dialog');
    drawerToggle(t.root).click();
    await t.settle();
    expect(frameOf(t.root).drawerOpen).toBe(true);
  });

  describe('the earlier Collapse layers choice (mcas-layers)', () => {
    it('rail: Layers opens hidden once and the choice is written under the new key', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      const t = await open(1440);
      expect(t.root.querySelector('#layers')).toBeNull();
      expect(layersToggle(t.root).getAttribute('aria-expanded')).toBe('false');
      expect(localStorage.getItem('mc-panels:anim-studio')).toBe('layers');
    });

    it('showing Layers keeps it shown on the next open', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      const t = await open(1440);
      layersToggle(t.root).click();
      await t.settle();
      expect(localStorage.getItem('mc-panels:anim-studio')).toBeNull();
      expect(localStorage.getItem(LAYERS_KEY)).toBeNull();
      t.el.remove();
      const again = await open(1440);
      expect(again.root.querySelector('#layers')).not.toBeNull();
    });

    it('open, unknown values and nothing stored leave Layers shown', async () => {
      for (const v of ['open', 'something else', '']) {
        document.body.innerHTML = '';
        localStorage.clear();
        localStorage.setItem(LAYERS_KEY, v);
        const t = await open(1440);
        expect(t.root.querySelector('#layers')).not.toBeNull();
      }
    });

    it('a stored panel state wins over the old key', async () => {
      localStorage.setItem(LAYERS_KEY, 'rail');
      localStorage.setItem('mc-panels:anim-studio', 'inspector');
      const t = await open(1440);
      expect(t.root.querySelector('#layers')).not.toBeNull();
    });

    it('blocked storage: Layers opens shown and nothing throws', async () => {
      const real = Object.getOwnPropertyDescriptor(window, 'localStorage')!;
      let touched = 0;
      Object.defineProperty(window, 'localStorage', { configurable: true, get: () => { touched++; throw new Error('blocked'); } });
      try {
        const t = await open(1440);
        expect(touched).toBeGreaterThan(0);
        expect(t.root.querySelector('#layers')).not.toBeNull();
        layersToggle(t.root).click();
        await t.settle();
        expect(t.root.querySelector('#layers')).toBeNull();
      } finally {
        Object.defineProperty(window, 'localStorage', real);
      }
    });
  });

  it('the stylesheet: no rail rules and no column tracks of the old layout', () => {
    const css = studioStyles.map((s) => s.cssText).join('\n');
    expect(css).not.toMatch(/\.rail\b/);
    expect(css).not.toMatch(/\.workspace|\.no-layers|\.no-inspector|\.insp-scrim/);
  });
});
