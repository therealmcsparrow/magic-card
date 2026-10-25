import { describe, it, expect, afterEach, vi } from 'vitest';
import { defineUiKit } from '../src/ui-kit';
import type { EditPath } from '../src/contracts/path-model';

const calls = vi.hoisted(() => ({ n: 0 }));
vi.mock('../src/path/edit', async (orig) => {
  const m = await orig<typeof import('../src/path/edit')>();
  return {
    ...m,
    serialize: (p: EditPath) => {
      calls.n++;
      return m.serialize(p);
    },
  };
});

defineUiKit();
await import('../src/path-canvas/index');

type El = HTMLElement & { paths: EditPath[]; paint: unknown[]; mode: string; updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
afterEach(() => mounted.splice(0).forEach((e) => e.remove()));

const sq = (x = 4): EditPath => ({ anchors: [{ x, y: 4 }, { x: 20, y: 4 }, { x: 20, y: 20 }], closed: true });
const mount = async (paths: EditPath[], mode = 'view'): Promise<El> => {
  const el = document.createElement('mc-path-canvas') as El;
  Object.assign(el, { mode, paths });
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  return el;
};
const ds = (el: El): string[] => [...el.shadowRoot!.querySelectorAll('svg path:not(.grid)')].map((p) => p.getAttribute('d') ?? '').filter((d) => d.startsWith('M'));

describe('path canvas serialise cache', () => {
  it('serialises an unchanged path once across renders', async () => {
    const a = sq();
    const b = sq(6);
    calls.n = 0;
    const el = await mount([a, b]);
    const first = calls.n;
    expect(first).toBe(2);
    el.paths = [a, b];
    el.paint = [{ fill: 'red' }, {}];
    await el.updateComplete;
    el.paint = [{ fill: 'blue' }, {}];
    await el.updateComplete;
    expect(calls.n).toBe(first);
  });

  it('draws the edit outline from the same string (one serialise per path in edit mode)', async () => {
    calls.n = 0;
    await mount([sq(), sq(6)], 'select');
    expect(calls.n).toBe(2);
  });

  it('re-serialises only the path that was replaced', async () => {
    const a = sq();
    const b = sq(6);
    const el = await mount([a, b]);
    const before = ds(el);
    calls.n = 0;
    const moved: EditPath = { anchors: b.anchors.map((p) => ({ ...p, x: p.x + 3 })), closed: b.closed };
    el.paths = [a, moved];
    await el.updateComplete;
    expect(calls.n).toBe(1);
    const after = ds(el);
    expect(after[0]).toBe(before[0]);
    expect(after[1]).not.toBe(before[1]);
    expect(after[1]).toContain('M9 4');
  });

  it('shows the old geometry again after undo puts the old object back', async () => {
    const a = sq();
    const edited: EditPath = { anchors: [...a.anchors, { x: 4, y: 20 }], closed: true };
    const el = await mount([a]);
    const original = ds(el)[0];
    el.paths = [edited];
    await el.updateComplete;
    expect(ds(el)[0]).not.toBe(original);
    el.paths = [a];
    await el.updateComplete;
    expect(ds(el)[0]).toBe(original);
  });

  it('sees closing a path and a changed anchor list on the same object', async () => {
    const a = sq();
    const el = await mount([a]);
    expect(ds(el)[0].endsWith('Z')).toBe(true);
    el.paths = [{ anchors: a.anchors, closed: false }];
    await el.updateComplete;
    expect(ds(el)[0].endsWith('Z')).toBe(false);
  });

  it('stops drawing a deleted path', async () => {
    const el = await mount([sq(), sq(6)]);
    el.paths = [sq(6)];
    await el.updateComplete;
    expect(ds(el)).toHaveLength(1);
  });
});

describe('path canvas paint changes', () => {
  const fills = (el: El): string[] => [...el.shadowRoot!.querySelectorAll('svg path[d^="M"]:not(.outline)')].map((p) => p.getAttribute('fill') ?? '');
  it('follows fill, hidden and the edit class while the path objects stay the same', async () => {
    const a = sq();
    const b = sq(6);
    const el = await mount([a, b]);
    el.paint = [{ fill: 'red' }, { fill: 'blue' }];
    await el.updateComplete;
    expect(fills(el)).toEqual(['red', 'blue']);
    el.paint = [{ fill: 'green' }, { fill: 'blue' }];
    await el.updateComplete;
    expect(fills(el)).toEqual(['green', 'blue']);
    el.paint = [{ fill: 'green', hidden: true }, { fill: 'blue' }];
    await el.updateComplete;
    expect(fills(el)).toEqual(['blue']);
    el.mode = 'select';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('svg path.outline').length).toBe(1);
  });
});
