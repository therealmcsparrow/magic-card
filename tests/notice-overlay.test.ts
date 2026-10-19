/**
 * Fix "notice bar pushes the canvas": a notice, warning or result line must float over the canvas
 * (out of flow) so the canvas box never resizes when one appears or goes away.
 *
 * happy-dom has no layout, so the test checks what decides the jump: every ancestor of the notice up to
 * the editor layer is looked up in the editor's own stylesheet, and at least one of them must be
 * position:absolute or fixed. A notice that is only flow content (display:flex / grid / block children
 * of .layer or .center) shrinks the flex:1 canvas under it.
 *
 * Measured in Chrome 155 on 2026.10.11-beta.1 (1300x800): the SVG editor canvas goes 633 -> 579 px tall
 * with an import/safe-area banner, 547 with the safe-area warning or conflict, 539 with a result note
 * (515 with two lines); the shape editor canvas goes 691 -> 641 px with its top banner.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineUiKit } from '../src/ui-kit';
defineUiKit();
import '../src/svg-editor/index';
import '../src/shape-editor/index';
import { __resetIconSourceForTests } from '../src/icons/icon-source';
import { editorStyles } from '../src/svg-editor/styles';
import { studioStyles } from '../src/shape-editor/styles';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';
import type { McShapeStudio } from '../src/shape-editor/mc-shape-studio';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 1300, height: 800, right: 1300, bottom: 800, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean, ms = 3000): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
const SVG = '<svg viewBox="0 0 24 24"><path d="M2 2H8V8H2Z"/></svg>';
async function openSvg(): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg: SVG }, host: 'card' });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await until(() => !!el.ha);
  await el.updateComplete;
  return el;
}
async function openShape(): Promise<McShapeStudio> {
  const el = document.createElement('mc-shape-studio') as McShapeStudio;
  Object.assign(el, { value: { shape: 'custom', shape_options: {} }, label: 'Tile' });
  document.body.append(el);
  mounted.push(el);
  for (let i = 0; i < 4; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
  return el;
}

const cssOf = (sheets: Array<{ cssText: string }>): string => sheets.map((s) => s.cssText).join('\n');
/** True when a rule whose subject (the last compound selector) is `.cls` sets position absolute / fixed. */
const outOfFlowClass = (css: string, cls: string): boolean =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].some(
    ([, sel, body]) => /position:\s*(absolute|fixed)/.test(body) && sel.split(',').some((one) => new RegExp(`\\.${cls}(?![\\w-])[^\\s>+~]*$`).test(one.trim())),
  );

/** The ancestors of `el` (exclusive) up to the editor layer (exclusive). */
function between(el: Element, layer: Element): Element[] {
  const out: Element[] = [];
  for (let p = el.parentElement; p && p !== layer; p = p.parentElement) out.push(p);
  return out;
}
/** A notice floats when it, or a wrapper between it and the layer, is out of flow in the stylesheet. */
function floats(notice: Element, layer: Element, css: string): boolean {
  return [notice, ...between(notice, layer)].some((e) => [...e.classList].some((c) => outOfFlowClass(css, c)));
}

beforeEach(() => __resetIconSourceForTests());
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  vi.restoreAllMocks();
});

describe('SVG editor: notices do not resize the canvas', () => {
  const css = cssOf(editorStyles);
  const layerOf = (el: Ed): Element => el.renderRoot.querySelector('.layer')!;

  it('control: the canvas stage is in flow and sizes the editor', async () => {
    const el = await openSvg();
    const stage = el.renderRoot.querySelector('.stage')!;
    expect(stage).not.toBeNull();
    expect(floats(stage, layerOf(el), css)).toBe(false);
  });

  const cases: Array<[string, (el: Ed) => void, string]> = [
    ['import / safe-area banner (.banners)', (el) => (el.banners = [{ id: 'safe', kind: 'warn', text: '1 layer reaches outside the 20 x 20 safe area.' }]), '.banners .notice'],
    ['conflict banner (.banners)', (el) => (el.conflict = true), '.banners .notice'],
    ['module notice (.banners)', (el) => ((el.module = { icon: 'mdi:home' } as never), (el.noticeGone = false)), '.banners .notice'],
    ['result note with Undo (resultNote)', (el) => (el.note = { tone: 'info', lines: ['Outlined stroke.'], action: { label: 'Undo', run() {} } }), '.center > .notice, .center .notice'],
    ['result error note, two lines', (el) => (el.note = { tone: 'error', lines: ['Could not do that.', 'Nothing was changed.'] }), '.center .notice'],
  ];
  it.each(cases)('%s floats over the canvas instead of taking layout space', async (_n, set, sel) => {
    const el = await openSvg();
    set(el);
    await el.updateComplete;
    const notice = el.renderRoot.querySelector(sel);
    expect(notice, 'the notice is rendered').not.toBeNull();
    expect(floats(notice!, layerOf(el), css), `no out-of-flow ancestor for ${sel}`).toBe(true);
  });

  it('an empty .banners wrapper is not rendered when only the dismissed module notice is left (8 px padding jump)', async () => {
    const el = await openSvg();
    el.module = { icon: 'mdi:home' } as never;
    el.noticeGone = true;
    await el.updateComplete;
    const b = el.renderRoot.querySelector('.banners');
    expect(b === null || b.children.length > 0).toBe(true);
  });
});

describe('SVG editor: notice buttons are not inside the canvas stage', () => {
  it('banners and result note are siblings of .stage, so the stage capture handlers never see their clicks or keys', async () => {
    const el = await openSvg();
    el.banners = [{ id: 'dropped', kind: 'warn', text: 'Removed 2 things.' }];
    el.note = { tone: 'info', lines: ['Outlined stroke.'], action: { label: 'Undo', run() {} } };
    el.tool = 'rect';
    await el.updateComplete;
    for (const sel of ['.banners .notice', '.result .notice']) {
      const n = el.renderRoot.querySelector(sel)!;
      expect(n, sel).not.toBeNull();
      expect(n.closest('.stage'), sel).toBeNull();
      expect(n.closest('.stagebox'), sel).not.toBeNull();
    }
  });
});
