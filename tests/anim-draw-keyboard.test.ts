import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/editor/components/unit-field';
import '../src/editor/components/color-picker';
import '../src/anim-studio/model-v2';
import '../src/anim-studio/editors/draw-tools';
import type { AnimDrawHost } from '../src/anim-studio/editors/draw-host';
import { newAnimationDoc, type AnimationDoc } from '../src/anim-studio/model';
import type { StudioSelection } from '../src/anim-studio/slots';
import { drawStore } from '../src/anim-studio/editors/draw-store';
import { rectPath, ellipsePath } from '../src/path/draw';
import { validationText } from '../src/anim-studio/validation-text';
import { setI18nLocale } from '../src/i18n/runtime';

const mode = vi.hoisted(() => ({ fail: false, urls: [] as string[] }));
vi.mock('../src/path-canvas/loader', async (orig) => {
  const real = await orig<typeof import('../src/path-canvas/loader')>();
  return {
    loadPathCanvas: () => {
      const w = (globalThis as { __webpack_require__?: { u: (id: unknown) => string } }).__webpack_require__;
      if (w) mode.urls.push(w.u('path-canvas'));
      return mode.fail ? Promise.resolve(undefined) : real.loadPathCanvas();
    },
  };
});

const base = (): AnimationDoc => newAnimationDoc('keyframes', 'd1', 'Drawn');
const withRect = (): AnimationDoc => ({ ...base(), rig: { parts: [], shapes: [{ id: 'rect-1', name: 'Rectangle 1', d: rectPath(4, 4, 8, 8, 0), fill: 'currentColor', layer: 'over' }] } });
const STAGE = { rect: { width: 240, height: 240 }, scale: 1, screen: { left: 0, top: 0, width: 240, height: 240 } };

const mounted: HTMLElement[] = [];
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  drawStore.reset();
  mode.fail = false;
  mode.urls.length = 0;
  delete (globalThis as { __webpack_require__?: unknown }).__webpack_require__;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function settle(el: AnimDrawHost): Promise<void> {
  for (let i = 0; i < 300 && (i < 3 || (el as unknown as { canvasState: string }).canvasState === 'loading'); i++) {
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 10));
  }
  await el.updateComplete;
}

async function host(selection: StudioSelection, doc = base()) {
  const el = document.createElement('mc-anim-draw-host');
  Object.assign(el, { doc, selection, stage: STAGE, pieces: [] });
  const changes: Array<{ doc: AnimationDoc; label: string; transient?: boolean }> = [];
  el.addEventListener('doc-change', (e) => {
    const d = (e as CustomEvent).detail;
    changes.push(d);
    el.doc = d.doc;
  });
  document.body.append(el);
  mounted.push(el);
  await settle(el);
  return { el, changes };
}

const press = (el: Element, k: string, init: KeyboardEventInit = {}) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true, ...init }));
const times = (el: Element, k: string, n: number, init: KeyboardEventInit = {}) => {
  for (let i = 0; i < n; i++) press(el, k, init);
};
const live = async (el: AnimDrawHost) => {
  await el.updateComplete;
  return el.shadowRoot!.querySelector('[aria-live]')!.textContent;
};
const canvasOf = (el: HTMLElement) => el.shadowRoot!.querySelector('mc-path-canvas') as HTMLElement & { paths: unknown[] };

describe('mc-anim-draw-host: a dragged point moves on screen', () => {
  it('passes every in-progress change back to the canvas as its paths', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'select', target: 'shape:rect-1' }, withRect());
    const c = canvasOf(el);
    const moved = [{ anchors: [{ x: 4, y: 4 }, { x: 13, y: 4 }, { x: 12, y: 12 }, { x: 4, y: 12 }], closed: true }];
    c.dispatchEvent(new CustomEvent('mc-path-change', { detail: { paths: moved, commit: false, label: 'Move point' }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(canvasOf(el).paths).toBe(moved);
    expect(changes).toHaveLength(0);
  });
});

describe('mc-anim-draw-host: drawing with the keyboard', () => {
  it('rectangle: arrows move a cursor, Enter sets the corner, Enter again draws it', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'rect' });
    expect(el.getAttribute('aria-label')).toMatch(/Enter/);
    press(el, 'ArrowRight');
    expect(await live(el)).toBe('Cursor at x 13, y 12. Press Enter to start.');
    press(el, 'Enter');
    expect(await live(el)).toMatch(/^Started at x 13, y 12/);
    times(el, 'ArrowRight', 3);
    times(el, 'ArrowDown', 2, { shiftKey: true });
    expect(await live(el)).toBe('Cursor at x 16, y 22. Press Enter to finish.');
    press(el, 'Enter');
    expect(changes).toHaveLength(1);
    expect(changes[0].doc.rig!.shapes![0].d).toBe(rectPath(13, 12, 3, 10, drawStore.options.radius));
    expect(await live(el)).toBe('Rectangle 1 added.');
  });

  it('line and ellipse use the same keys', async () => {
    const line = await host({ kind: 'tool', tool: 'line' });
    press(line.el, 'Enter');
    times(line.el, 'ArrowLeft', 4);
    press(line.el, 'Enter');
    expect(line.changes[0].doc.rig!.shapes![0]).toMatchObject({ d: 'M12 12 L8 12', stroke: 'currentColor' });
    const ell = await host({ kind: 'tool', tool: 'ellipse' });
    press(ell.el, 'Enter');
    times(ell.el, 'ArrowRight', 4);
    times(ell.el, 'ArrowDown', 2);
    press(ell.el, 'Enter');
    expect(ell.changes[0].doc.rig!.shapes![0].d).toBe(ellipsePath(14, 13, 2, 1));
  });

  it('Alt moves by a tenth, the second Enter on the start point draws nothing and says why', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'line' });
    press(el, 'Enter');
    press(el, 'Enter');
    expect(changes).toHaveLength(0);
    expect(await live(el)).toBe('Move away from the start first.');
    press(el, 'ArrowRight', { altKey: true });
    expect(await live(el)).toMatch(/x 12\.1, y 12/);
  });

  it('Escape drops the drawing in progress', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'rect' });
    press(el, 'Enter');
    times(el, 'ArrowRight', 3);
    press(el, 'Escape');
    expect(await live(el)).toBe('Drawing cancelled.');
    press(el, 'Enter');
    press(el, 'Enter');
    expect(changes).toHaveLength(0);
  });

  it('freehand: Enter places points, Enter again on the last point finishes the stroke', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'freehand' });
    press(el, 'Enter');
    times(el, 'ArrowRight', 5, { shiftKey: true });
    press(el, 'Enter');
    expect(changes).toHaveLength(0);
    press(el, 'ArrowDown', { shiftKey: true });
    press(el, 'Enter');
    press(el, 'Enter');
    expect(changes).toHaveLength(1);
    expect(changes[0].doc.rig!.shapes![0]).toMatchObject({ id: 'stroke-1', stroke: 'currentColor' });
    expect(changes[0].doc.rig!.shapes![0].d).toMatch(/^M12 12/);
    expect(drawStore.lastFreehand?.id).toBe('stroke-1');
  });

  it('keys pressed on a button inside the host are left to the button', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'rect' });
    const b = document.createElement('button');
    el.shadowRoot!.append(b);
    press(b, 'Enter');
    press(b, 'Enter');
    expect(changes).toHaveLength(0);
  });

  it('the cursor is drawn once it has moved, and goes when the tool changes', async () => {
    const { el } = await host({ kind: 'tool', tool: 'rect' });
    expect(el.shadowRoot!.querySelector('.cross')).toBeNull();
    press(el, 'ArrowRight');
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.cross')).toBeTruthy();
    el.selection = { kind: 'tool', tool: 'line' };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.cross')).toBeNull();
  });

  it('says so while the drawing tools are still loading', async () => {
    mode.fail = true;
    const { el, changes } = await host({ kind: 'tool', tool: 'rect' });
    press(el, 'Enter');
    press(el, 'ArrowRight');
    press(el, 'Enter');
    expect(changes).toHaveLength(0);
    expect(await live(el)).toBe('The drawing tools are not loaded yet.');
  });
});

describe('mc-anim-draw-host: focus and announcements', () => {
  it('Finish path puts focus on the drawing area and announces the new path', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'pen' });
    const send = (anchors: Array<{ x: number; y: number }>) => canvasOf(el).dispatchEvent(new CustomEvent('mc-path-change', { detail: { paths: [{ anchors, closed: false }], commit: true, label: 'Add point' }, bubbles: true, composed: true }));
    send([{ x: 2, y: 2 }, { x: 8, y: 8 }, { x: 9, y: 3 }]);
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.finish')!;
    btn.focus();
    btn.click();
    await el.updateComplete;
    await el.updateComplete;
    expect(changes).toHaveLength(1);
    expect(el.shadowRoot!.activeElement).toBe(canvasOf(el));
    expect(await live(el)).toBe('Path 1 added, 3 points.');
  });

  it('the second Escape in the pen says the path was saved', async () => {
    const { el, changes } = await host({ kind: 'tool', tool: 'pen' });
    canvasOf(el).dispatchEvent(new CustomEvent('mc-path-change', { detail: { paths: [{ anchors: [{ x: 2, y: 2 }, { x: 8, y: 8 }], closed: false }], commit: true, label: 'Add point' }, bubbles: true, composed: true }));
    press(el, 'Escape');
    expect(changes).toHaveLength(1);
    expect(await live(el)).toBe('Path 1 added, 2 points.');
  });
});

describe('the drawing tools after a failed load', () => {
  const webpack = () => {
    const w = { u: (id: unknown) => `magic-card-${String(id)}.js` };
    (globalThis as { __webpack_require__?: unknown }).__webpack_require__ = w;
    return w;
  };

  it('Try again asks for the chunk under a URL not requested before and leaves the URL function as it was', async () => {
    const w = webpack();
    const u = w.u;
    mode.fail = true;
    const { el } = await host({ kind: 'tool', tool: 'pen' });
    expect(mode.urls).toEqual(['magic-card-path-canvas.js']);
    mode.fail = false;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!.click();
    await settle(el);
    expect(mode.urls).toHaveLength(2);
    expect(mode.urls[1]).toMatch(/^magic-card-path-canvas\.js\?r=\d+$/);
    expect(w.u).toBe(u);
    expect(canvasOf(el)).toBeTruthy();
  });

  it('a second retry uses another number', async () => {
    webpack();
    mode.fail = true;
    const { el } = await host({ kind: 'tool', tool: 'pen' });
    el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!.click();
    await settle(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!.click();
    await settle(el);
    expect(new Set(mode.urls).size).toBe(3);
  });

  it('after a successful retry focus is on the drawing area and the tools are announced', async () => {
    mode.fail = true;
    const { el } = await host({ kind: 'tool', tool: 'pen' });
    mode.fail = false;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!;
    btn.focus();
    btn.click();
    await settle(el);
    expect(el.shadowRoot!.activeElement).toBe(canvasOf(el));
    expect(await live(el)).toBe('The drawing tools are ready.');
  });

  it('Reload page asks before it throws unsaved work away', async () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal('confirm', confirm);
    const reload = vi.fn();
    const loc = window.location;
    Object.defineProperty(window, 'location', { configurable: true, value: { ...loc, reload } });
    try {
      const ctor = customElements.get('mc-path-canvas') as unknown as { contractRevision: number };
      const was = ctor?.contractRevision;
      await host({ kind: 'tool', tool: 'pen' });
      ctor.contractRevision = 7;
      const { el } = await host({ kind: 'tool', tool: 'pen' });
      el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!.click();
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(reload).not.toHaveBeenCalled();
      confirm.mockReturnValue(true);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.host-notice button')!.click();
      expect(reload).toHaveBeenCalledTimes(1);
      ctor.contractRevision = was;
    } finally {
      Object.defineProperty(window, 'location', { configurable: true, value: loc });
    }
  });
});

describe('the notice and Finish buttons read at 4.5:1', () => {
  const lum = (rgb: number[]) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  it('white on the action colour mixed from the measured accent', async () => {
    const { el } = await host({ kind: 'tool', tool: 'pen' });
    const css = (el.constructor as unknown as { styles: Array<{ cssText: string }> }).styles.map((s) => s.cssText).join('\n');
    const mix = /--ch-action:\s*color-mix\(in srgb,\s*var\(--ch-accent\)\s*(\d+)%,\s*#000\)/.exec(css);
    expect(mix).toBeTruthy();
    const k = Number(mix![1]) / 100;
    const bg = [0, 154, 199].map((v) => v * k);
    expect((1.05 / (lum(bg) + 0.05))).toBeGreaterThanOrEqual(4.5);
    expect(css).toMatch(/\.finish\s*\{[^}]*background:\s*var\(--ch-action\)/);
    expect(css).toMatch(/\.host-notice button\s*\{[^}]*background:\s*var\(--ch-action\)/);
  });
});

describe('the "too many shapes" message', () => {
  it('is translated with its number', () => {
    const msg = 'The SVG has too many shapes; at most 12 fit.';
    try {
      setI18nLocale({ language: 'nl' });
      expect(validationText(msg)).toBe('De SVG heeft te veel vormen; er passen nog maar 12.');
      setI18nLocale({ language: 'en-US' });
      expect(validationText(msg)).toBe(msg);
    } finally {
      setI18nLocale({ language: 'en-GB' });
    }
  });
});
