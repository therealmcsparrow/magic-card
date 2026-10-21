import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../src/svg-editor/index';
import { menuEntry } from './svg-menu-helper';
import { importSvg } from '../src/svg-editor/import';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';

/*
 * Outline stroke ("does not make it from a line to a shape"). Path tools > Outline stroke must
 * turn a stroked layer into a filled, closed shape: stroke removed, the former stroke paint (main / accent) becomes
 * the fill; a layer that had fill and stroke keeps its fill and gains "<name> outline" (contract path-tools 1.0.0,
 * host mapping src/svg-editor/pathtools.ts plan()). Four cases from the report, then the one defect found on the way.
 */

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 600, height: 600, right: 600, bottom: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 4000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
async function open(svg: string): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg } });
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
const settle = async (el: Ed, ms = 60): Promise<void> => {
  await new Promise((r) => setTimeout(r, ms));
  await el.updateComplete;
};
/** Select the last layer, run Path > Outline stroke and press Apply, like a person does. */
async function outline(el: Ed, index = 0): Promise<void> {
  el.select([el.doc.shapes[index].id]);
  await el.updateComplete;
  menuEntry(el, 'pt:outline-stroke', 'path').click();
  await until(() => !!el.pt);
  await settle(el);
  el.renderRoot.querySelector<HTMLButtonElement>('[data-act=apply]')!.click();
  await settle(el);
}
const svg = (inner: string, attrs = ''): string => `<svg viewBox="0 0 24 24"${attrs}>${inner}</svg>`;
const ringArea = (el: Ed, i: number): number =>
  Math.abs(el.doc.shapes[i].paths.reduce((a, p) => a + p.anchors.reduce((s, c, k) => { const n = p.anchors[(k + 1) % p.anchors.length]; return s + (c.x * n.y - n.x * c.y) / 2; }, 0), 0));

beforeEach(() => __resetIconSourceForTests());
afterEach(() => mounted.splice(0).forEach((e) => e.remove()));

describe('Outline stroke turns a stroked layer into a filled shape', () => {
  it('Line tool line (stroke 2, main): one closed filled path, stroke gone, fill = main, non-zero area', async () => {
    const el = await open(svg('<line x1="4" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'));
    // the Line tool stores type 'line' (an SVG <line> imports as a path), so mark it the way the tool does
    el.apply({ ...el.doc, shapes: el.doc.shapes.map((x) => ({ ...x, type: 'line' as const })) }, 'line');
    expect(el.doc.shapes[0].type).toBe('line');
    await outline(el);
    expect(el.doc.shapes).toHaveLength(1);
    const s = el.doc.shapes[0];
    expect(s.type).toBe('path');
    expect(s.stroke).toBe('none');
    expect(s.fill).toBe('main');
    expect(s.paths.every((p) => p.closed)).toBe(true);
    expect(ringArea(el, 0)).toBeGreaterThan(16 * 2 - 0.5);
  });

  it('pen open path (stroke accent): closed, fill = accent, stroke none', async () => {
    const el = await open(svg('<path class="mc-accent" d="M4 18L10 12L16 18" fill="none" stroke="currentColor" stroke-width="2"/>'));
    expect(el.doc.shapes[0].stroke).toBe('accent');
    await outline(el);
    const s = el.doc.shapes[0];
    expect([s.stroke, s.fill]).toEqual(['none', 'accent']);
    expect(s.paths.every((p) => p.closed)).toBe(true);
  });

  it('rect with stroke only: a ring (outer + inner contour), fill = main, stroke none', async () => {
    const el = await open(svg('<rect x="5" y="6" width="14" height="12" fill="none" stroke="currentColor" stroke-width="2"/>'));
    await outline(el);
    const s = el.doc.shapes[0];
    expect([s.type, s.stroke, s.fill]).toEqual(['path', 'none', 'main']);
    expect(s.paths).toHaveLength(2);
    expect(s.paths.every((p) => p.closed)).toBe(true);
    // area of the ring: outer 16 x 14 minus inner 12 x 10 = 104
    expect(ringArea(el, 0)).toBeGreaterThan(90);
  });

  it('rect with fill and stroke: fill layer kept, "<name> outline" layer above it carries the stroke paint', async () => {
    const el = await open(svg('<rect x="5" y="6" width="14" height="12" fill="currentColor" stroke="currentColor" stroke-width="2"/>'));
    const name = el.doc.shapes[0].name;
    await outline(el);
    expect(el.doc.shapes).toHaveLength(2);
    expect([el.doc.shapes[0].fill, el.doc.shapes[0].stroke]).toEqual(['main', 'none']);
    expect(el.doc.shapes[1].name).toBe(`${name} outline`);
    expect([el.doc.shapes[1].fill, el.doc.shapes[1].stroke]).toEqual(['main', 'none']);
    expect(el.doc.shapes[1].paths.every((p) => p.closed)).toBe(true);
  });

  it('the exported markup has no stroke attributes left', async () => {
    const el = await open(svg('<path d="M4 12H20" fill="none" stroke="currentColor" stroke-width="2"/>'));
    await outline(el);
    const out = el.buildOut(el.doc).svg!;
    expect(out).not.toMatch(/stroke/);
    expect(out).toMatch(/class="mc-f"/);
  });
});

describe('Found on the way: stroke icons keep their stroke on import', () => {
  // Lucide, Tabler, Feather and Heroicons set fill/stroke/stroke-width/linecap on the root <svg>; they inherit down.
  // src/svg-editor/import.ts:170 starts every child from ROOT and never reads the root's own attributes, so these
  // icons arrive as zero-area "fills" and Outline stroke says "This shape has no stroke to outline."
  const LUCIDE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  it('a root-level stroke is inherited by the shapes (stroke main, width 2, round caps, no fill)', () => {
    const r = importSvg(LUCIDE);
    expect(r.doc).toBeDefined();
    for (const s of r.doc!.shapes) {
      expect([s.fill, s.stroke, s.width, s.cap, s.join]).toEqual(['none', 'main', 2, 'round', 'round']);
    }
  });

  it('Outline stroke works on such an icon instead of refusing', async () => {
    const el = await open(LUCIDE);
    el.select([el.doc.shapes[0].id]);
    await el.updateComplete;
    expect(menuEntry(el, 'pt:outline-stroke', 'path').getAttribute('aria-disabled')).toBeNull();
  });
});

describe('Real icon sets import as strokes and outline', () => {
  const dir = resolve(__dirname, 'fixtures/svg-icons');
  const sets: [string, number, number][] = [
    ['lucide-arrow-right.svg', 2, 2],
    ['tabler-home.svg', 3, 2],
    ['feather-heart.svg', 1, 2],
    ['heroicons-outline-home.svg', 1, 1.5],
  ];
  for (const [file, n, w] of sets) {
    it(`${file}: ${n} stroked layer(s), width ${w}, round caps; Outline stroke fills them and renames`, async () => {
      const text = readFileSync(resolve(dir, file), 'utf8');
      const stroked = importSvg(text).doc!.shapes.filter((s) => s.stroke === 'main');
      expect(stroked).toHaveLength(n);
      for (const s of stroked) expect([s.fill, s.width, s.cap, s.join]).toEqual(['none', w, 'round', 'round']);
      const el = await open(text);
      const i = el.doc.shapes.findIndex((s) => s.stroke === 'main');
      const name = el.doc.shapes[i].name;
      await outline(el, i);
      const r = el.doc.shapes[i];
      expect([r.fill, r.stroke, r.name]).toEqual(['main', 'none', `${name} outline`]);
      expect(r.paths.every((p) => p.closed)).toBe(true);
      expect(el.sel).toEqual([r.id]);
    });
  }

  it('child attributes win over the root and fill="none" on the root is respected', () => {
    const r = importSvg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><g stroke-width="4"><path d="M2 2h10" stroke-width="1"/><path d="M2 8h10"/><path d="M2 12h10" fill="currentColor" stroke="none"/></g></svg>');
    expect(r.doc!.shapes.map((s) => [s.fill, s.stroke, s.width])).toEqual([['none', 'main', 1], ['none', 'main', 4], ['main', 'none', 4]]);
  });
});
