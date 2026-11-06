import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { existsSync } from 'node:fs';
import { defineUiKit } from '../src/ui-kit';
defineUiKit();
import '../src/path-canvas/index';
import { setI18nLocale } from '../src/i18n/runtime';
import { t as tp } from '../src/path-canvas/i18n';
import { snapLines } from '../src/path-canvas/geometry';
import type { PathCanvasElement } from '../src/contracts/path-canvas';
import type { Box, EditPath } from '../src/contracts/path-model';

/* the path canvas speaks en-GB, en-US and Dutch from its own namespace (contract i18n 1.0.0 r3). */

type El = PathCanvasElement & HTMLElement & { updateComplete: Promise<boolean> };
const square = (): EditPath => ({
  anchors: [
    { x: 4, y: 4 },
    { x: 20, y: 4 },
    { x: 20, y: 20 },
    { x: 4, y: 20 },
  ],
  closed: true,
});
const box: Box = { x: 4, y: 4, w: 16, h: 16 };
const mounted: HTMLElement[] = [];
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.useRealTimers();
  setI18nLocale({ language: 'en-GB' });
});

async function mount(props: Record<string, unknown> = {}): Promise<El> {
  const el = document.createElement('mc-path-canvas') as El;
  Object.assign(el, { mode: 'nodes', paths: [square()], ...props });
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  const svg = el.shadowRoot!.querySelector('svg.surface') as SVGElement;
  const rect = () => ({ left: 0, top: 0, width: 480, height: 480, right: 480, bottom: 480, x: 0, y: 0, toJSON() {} }) as DOMRect;
  svg.getBoundingClientRect = rect;
  el.getBoundingClientRect = rect;
  el.fit();
  await el.updateComplete;
  el.addEventListener('mc-path-change', (e) => {
    el.paths = (e as CustomEvent).detail.paths;
  });
  return el;
}
const key = (el: El, k: string, init: KeyboardEventInit = {}): void => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true, ...init }));
};
const live = (el: El): string => el.shadowRoot!.querySelector('[role=status]')!.textContent!.trim();
const say = async (el: El, k: string, init: KeyboardEventInit = {}): Promise<string> => {
  vi.advanceTimersByTime(700);
  key(el, k, init);
  vi.advanceTimersByTime(300);
  await el.updateComplete;
  return live(el);
};

interface Words {
  role: string;
  list: string;
  option: string;
  select: string;
  all: string;
  noHandles: string;
  smooth: string;
  handleIn: string;
  handleOut: string;
  moved: string;
  added: string;
  deleted: string;
  handleDeleted: string;
  rotLabel: string;
  rotText: string;
  rotSay: string;
  scaleSay: string;
  pathSel: string;
  handleSel: string;
  cleared: string;
  limit: string;
  closed: string;
  safe: string;
  edge: string;
  centre: string;
}

async function collect(language: string): Promise<Words> {
  setI18nLocale({ language });
  const a = await mount();
  const role = a.getAttribute('aria-roledescription')!;
  const list = a.shadowRoot!.querySelector('[role=listbox]')!.getAttribute('aria-label')!;
  const option = a.shadowRoot!.querySelectorAll('[role=option]')[2].textContent!.trim();
  const select = await say(a, ']', { code: 'BracketRight' });
  const all = await say(a, 'a', { ctrlKey: true });
  a.selection = { path: 0, anchors: [0] };
  await a.updateComplete;
  const noHandles = await say(a, 'h');
  const smooth = await say(a, 'c');
  const handleIn = await say(a, 'h');
  const handleOut = await say(a, 'h');
  const moved = await say(a, 'ArrowRight');
  const priv = a as unknown as { describeSel(s: unknown, p?: unknown): string; emitLimit(p: number): void };
  const handleSel = priv.describeSel({ path: 0, anchors: [0], handle: { anchor: 0, which: 'in' } });
  const pathSel = priv.describeSel({ path: 0, anchors: [] });
  const cleared = priv.describeSel(undefined, { path: 0, anchors: [0] });
  priv.emitLimit(0);
  vi.advanceTimersByTime(700);
  await a.updateComplete;
  const limit = live(a);
  const b = await mount();
  b.selection = { path: 0, anchors: [0] };
  await b.updateComplete;
  const added = await say(b, 'Insert');
  const deleted = await say(b, 'Delete');
  const c = await mount();
  c.selection = { path: 0, anchors: [0] };
  await c.updateComplete;
  await say(c, 'c');
  await say(c, 'h');
  const handleDeleted = await say(c, 'Delete');
  const d = await mount({ mode: 'select', transform: { box, scale: true, rotate: true, keepRatio: true } });
  const rot = d.shadowRoot!.querySelector('.rot') as HTMLElement;
  const rotLabel = rot.getAttribute('aria-label')!;
  const rotText = rot.getAttribute('aria-valuetext')!;
  vi.advanceTimersByTime(700);
  rot.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true, cancelable: true }));
  vi.advanceTimersByTime(300);
  await d.updateComplete;
  const rotSay = live(d);
  const scaleSay = await say(d, 'ArrowRight', { shiftKey: true, ctrlKey: true });
  const lines = snapLines({ snap: { enabled: true, grid: 0, frame: true, safeArea: true } as never, frame: { x: 0, y: 0, w: 24, h: 24 }, safeArea: 2 }, 0);
  const find = (v: number): string => tp(lines.find((l) => l.v === v)!.label);
  return {
    role, list, option, select, all, noHandles, smooth, handleIn, handleOut, moved, added, deleted, handleDeleted,
    rotLabel, rotText, rotSay, scaleSay, pathSel, handleSel, cleared, limit,
    closed: '',
    safe: find(2),
    edge: find(0),
    centre: find(12),
  };
}

const GB: Words = {
  role: 'drawing canvas',
  list: 'Points',
  option: 'Point 3 of 4, corner, x 20, y 20',
  select: 'Point 1 of 4, corner, x 4, y 4.',
  all: 'All 4 points selected.',
  noHandles: 'This point has no handles. Press C to make it smooth.',
  smooth: 'Point 1 is now smooth.',
  handleIn: 'Arrow keys move the in handle.',
  handleOut: 'Arrow keys move the out handle.',
  moved: 'x 4.5, y 4',
  added: 'Point added, 5 points.',
  deleted: 'Point deleted, 4 points.',
  handleDeleted: 'Handle deleted.',
  rotLabel: 'Rotation',
  rotText: '0 degrees',
  rotSay: '1 degree',
  scaleSay: 'W 16.5 H 16.5',
  pathSel: 'Path, 4 points, closed.',
  handleSel: 'In handle of point 1, x 1.12, y 6.43.',
  cleared: 'Selection cleared.',
  limit: 'This path has 100 points, the most you can add. Move, delete or change them instead.',
  closed: '',
  safe: 'Safe area edge',
  edge: 'Edge',
  centre: 'Centre',
};

describe('path canvas i18n', () => {
  it('has its own namespace tables', () => {
    expect(existsSync('src/path-canvas/i18n/nl.json')).toBe(true);
    expect(existsSync('src/path-canvas/i18n/en-US.json')).toBe(true);
  });

  it('en-GB is the source text', async () => {
    const w = await collect('en-GB');
    expect(w).toMatchObject({ ...GB, moved: w.moved, scaleSay: w.scaleSay, rotSay: w.rotSay });
    expect(w.rotSay).toMatch(/^1 degrees?$/);
    expect(w.moved).toBe('x 7.17, y 1.33');
    expect(w.scaleSay).toMatch(/^W 1[67](\.\d+)? H 1[67](\.\d+)?$/);
  });

  it('en-US differs only in the American spelling: Center', async () => {
    const w = await collect('en-US');
    expect(w.centre).toBe('Center');
    expect({ ...w, centre: GB.centre }).toEqual({ ...(await collect('en-GB')), centre: GB.centre });
  });

  it('Dutch speaks every announcement, label and snap guide', async () => {
    const w = await collect('nl');
    expect(w).toMatchObject({
      role: 'tekenvlak',
      list: 'Punten',
      option: 'Punt 3 van 4, hoek, x 20, y 20',
      select: 'Punt 1 van 4, hoek, x 4, y 4.',
      all: 'Alle 4 punten geselecteerd.',
      noHandles: 'Dit punt heeft geen handvatten. Druk op C om het vloeiend te maken.',
      smooth: 'Punt 1 is nu vloeiend.',
      handleIn: 'De pijltjestoetsen verplaatsen het binnenhandvat.',
      handleOut: 'De pijltjestoetsen verplaatsen het buitenhandvat.',
      added: 'Punt toegevoegd, 5 punten.',
      deleted: 'Punt verwijderd, 4 punten.',
      handleDeleted: 'Handvat verwijderd.',
      rotLabel: 'Rotatie',
      rotText: '0 graden',
      pathSel: 'Pad, 4 punten, gesloten.',
      handleSel: 'Binnenhandvat van punt 1, x 1,12, y 6,43.',
      cleared: 'Selectie opgeheven.',
      limit: 'Dit pad heeft 100 punten, het maximum. Verplaats, verwijder of wijzig ze in plaats daarvan.',
      safe: 'Rand veilig gebied',
      edge: 'Rand',
      centre: 'Midden',
    });
    expect(w.rotSay).toBe('1 graad');
    expect(w.moved).toBe('x 7,17, y 1,33');
    expect(w.scaleSay).toMatch(/^B 16,5 H 1[67](,5)?$/);
  });
});
