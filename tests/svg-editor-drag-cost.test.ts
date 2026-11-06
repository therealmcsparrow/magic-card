import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 600, height: 600, right: 600, bottom: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 3000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const THREE = '<svg viewBox="0 0 24 24"><path d="M4 4H8V8H4Z"/><path d="M10 10H14V14H10Z"/><path d="M15 15H19V19H15Z"/></svg>';
async function open(): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg: THREE } });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await el.updateComplete;
  const cv = el.canvas();
  if (cv) {
    cv.getBoundingClientRect = rect;
    cv.fit();
  }
  return el;
}
const warnChips = (el: Ed): number => el.renderRoot.querySelectorAll('.tree .chip.is-warn').length;

/** The canvas reports the first path moved by (dx, dy). */
function moveFirst(el: Ed, dx: number, dy: number, commit: boolean): void {
  const paths = el.flatBase.paths.map((p, i) => (i === 0 ? { ...p, anchors: p.anchors.map((a) => ({ ...a, x: a.x + dx, y: a.y + dy })) } : p));
  el.canvas()!.dispatchEvent(new CustomEvent('mc-path-change', { detail: { paths, commit, label: 'Move' }, bubbles: true, composed: true }));
}

beforeEach(() => __resetIconSourceForTests());
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('the canvas element', () => {
  it('is looked up once, not on every call', async () => {
    const el = await open();
    el.canvas();
    const spy = vi.spyOn(el.renderRoot, 'querySelector');
    for (let i = 0; i < 20; i++) el.canvas();
    expect(spy.mock.calls.filter((c) => c[0] === 'mc-path-canvas')).toHaveLength(0);
  });

  it('is found again after the stage mounts a new one', async () => {
    const el = await open();
    const first = el.canvas();
    expect(first).toBeTruthy();
    el.stage = 'loading';
    await el.updateComplete;
    expect(el.canvas()).toBeNull();
    el.stage = 'edit';
    await el.updateComplete;
    const second = el.canvas();
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
    expect(second!.isConnected).toBe(true);
  });
});

describe('a drag that only moves a layer', () => {
  it('does not look for windows and popovers on its frames', async () => {
    const el = await open();
    moveFirst(el, 1, 0, false);
    await el.updateComplete;
    const spy = vi.spyOn(el.renderRoot, 'querySelectorAll');
    moveFirst(el, 2, 0, false);
    await el.updateComplete;
    moveFirst(el, 3, 0, false);
    await el.updateComplete;
    expect(spy.mock.calls.filter((c) => /mc-ui-(window|popover)/.test(String(c[0])))).toHaveLength(0);
  });

  it('still opens a window that is shown after the drag', async () => {
    const el = await open();
    moveFirst(el, 1, 0, false);
    moveFirst(el, 1, 0, true);
    await el.updateComplete;
    el.dlg = 'poly';
    await el.updateComplete;
    expect(el.renderRoot.querySelector<HTMLElement & { open: boolean }>('mc-ui-window')?.open).toBe(true);
  });

  it('leaves the layers list alone until the gesture ends', async () => {
    const el = await open();
    expect(warnChips(el)).toBe(0);
    moveFirst(el, -6, 0, false);
    await el.updateComplete;
    moveFirst(el, -7, 0, false);
    await el.updateComplete;
    expect(el.doc.shapes[0].paths[0].anchors[0].x).toBe(-3);
    expect(warnChips(el)).toBe(0);
    moveFirst(el, -7, 0, true);
    await el.updateComplete;
    expect(warnChips(el)).toBe(1);
  });

  it('updates the list at once for undo', async () => {
    const el = await open();
    moveFirst(el, -7, 0, false);
    moveFirst(el, -7, 0, true);
    await el.updateComplete;
    expect(warnChips(el)).toBe(1);
    el.undo();
    await el.updateComplete;
    expect(warnChips(el)).toBe(0);
  });

  it('updates the list at once for a move that is not a drag', async () => {
    const el = await open();
    el.select([el.doc.shapes[0].id]);
    el.nudge(-7, 0);
    await el.updateComplete;
    expect(warnChips(el)).toBe(1);
  });

  it('shows the list again when the gesture is cancelled', async () => {
    const el = await open();
    moveFirst(el, -7, 0, false);
    await el.updateComplete;
    expect(warnChips(el)).toBe(0);
    el.canvas()!.dispatchEvent(new CustomEvent('mc-path-transform', { detail: { label: 'Cancel', commit: true, matrix: [1, 0, 0, 1, 0, 0], kind: 'scale' }, bubbles: true, composed: true }));
    await el.updateComplete;
    expect(warnChips(el)).toBe(0);
    expect(el.doc.shapes[0].paths[0].anchors[0].x).toBe(4);
  });
});
