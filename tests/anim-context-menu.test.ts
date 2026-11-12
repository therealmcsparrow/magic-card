/* Right-click menus in the animation studio: layer rows and the keyframe timeline. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/editor/components/unit-field';
import '../src/editor/components/color-picker';
import '../src/anim-studio/model-v2';
import '../src/anim-studio/editors/draw-layers';
import '../src/anim-studio/editors/keyframes-editor';
import type { AnimKeyframesEditor } from '../src/anim-studio/editors/keyframes-editor';
import { EMPTY_LAYER_VIEW } from '../src/contracts/studio-layers';
import { newAnimationDoc, type AnimationDoc, type AnimationKeyframe } from '../src/anim-studio/model';
import { resetLayerFocus } from '../src/anim-studio/editors/layer-row';
import type { UiMenuElement } from '../src/contracts/ui-kit';

const tick = () => new Promise((r) => setTimeout(r, 0));
const ctx = (x: number, y: number) => new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true, clientX: x, clientY: y, button: 2 });
const labels = (menu: Element) => [...menu.shadowRoot!.querySelectorAll('[role^="menuitem"] .label')].map((l) => l.textContent);
const item = (menu: Element, label: string) => [...menu.shadowRoot!.querySelectorAll<HTMLElement>('[role^="menuitem"]')].find((i) => i.querySelector('.label')!.textContent === label)!;

const shape = (id: string) => ({ id, name: id.toUpperCase(), d: 'M1 1L5 5', stroke: 'red', layer: 'over' });

describe('layer rows', () => {
  beforeEach(() => resetLayerFocus());
  afterEach(() => (document.body.innerHTML = ''));

  it('a right-click on a row selects it and opens its actions menu at the pointer', async () => {
    const doc: AnimationDoc = { ...newAnimationDoc('keyframes', 'd1', 'D'), rig: { parts: [], shapes: [shape('s1'), shape('s2')] as never } };
    const column = document.createElement('div');
    column.className = 'layers-body';
    const sec = document.createElement('section');
    sec.setAttribute('data-panel', 'shapes');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = document.createElement('mc-anim-shapes-layers') as any;
    Object.assign(el, { doc, selection: { kind: 'none' }, disabled: false, layerView: EMPTY_LAYER_VIEW, density: 'full' });
    const sels: unknown[] = [];
    el.addEventListener('selection-change', (e: Event) => sels.push((e as CustomEvent).detail.selection));
    sec.append(el);
    column.append(sec);
    document.body.append(column);
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector('li[data-ref="shape:s2"]') as HTMLElement;
    const e = ctx(120, 80);
    row.querySelector('[data-lk]')!.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    await el.updateComplete;
    await tick();
    expect(sels.length).toBe(1);
    const menu = el.shadowRoot!.querySelector('li[data-ref="shape:s2"] mc-ui-menu') as UiMenuElement;
    expect(menu).toBeTruthy();
    expect(menu.at).toEqual([120, 80]);
    expect(menu.anchor).toBeUndefined();
    expect(menu.open).toBe(true);
    expect(labels(menu)).toContain('Lock');
  });

  it('a right-click in the rename input keeps the browser menu', async () => {
    const doc: AnimationDoc = { ...newAnimationDoc('keyframes', 'd1', 'D'), rig: { parts: [], shapes: [shape('s1')] as never } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = document.createElement('mc-anim-shapes-layers') as any;
    Object.assign(el, { doc, selection: { kind: 'none' }, disabled: false, layerView: EMPTY_LAYER_VIEW, density: 'full' });
    document.body.append(el);
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector('li[data-ref="shape:s1"]') as HTMLElement;
    const input = document.createElement('input');
    row.querySelector('.lr-in')!.append(input);
    const e = ctx(10, 10);
    input.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });
});

// ── keyframe timeline ──

const TRACK = { left: 0, top: 0, right: 224, bottom: 34, width: 224, height: 34, x: 0, y: 0 };
let rectSpy: ReturnType<typeof vi.spyOn> | undefined;
const PULSE: AnimationKeyframe[] = [{ at: 0, transform: { scale: 1 } }, { at: 50, transform: { scale: 1.1 } }, { at: 100, transform: { scale: 1 } }];
const X = (at: number) => 12 + at * 2;

async function mount() {
  const el = document.createElement('mc-anim-keyframes-editor') as AnimKeyframesEditor;
  const labelsSeen: string[] = [];
  Object.assign(el, { doc: { id: 'kf', name: 'Test', kind: 'keyframes', duration: 2, easing: 'ease-in-out', iterations: 'infinite', target: 'element', origin: 'center', version: 1, keyframes: structuredClone(PULSE) }, layout: 'wide', time: 0 });
  el.addEventListener('doc-change', (e) => {
    const d = (e as CustomEvent).detail;
    labelsSeen.push(d.label);
    el.doc = d.doc;
  });
  document.body.appendChild(el);
  await el.updateComplete;
  const root = el.shadowRoot!;
  const settle = async () => {
    await el.updateComplete;
    await tick();
    await el.updateComplete;
  };
  const menu = () => root.querySelector('mc-ui-menu.ctx-menu') as UiMenuElement | null;
  return { el, root, labelsSeen, settle, menu };
}

describe('keyframe timeline', () => {
  beforeEach(() => {
    const orig = HTMLElement.prototype.getBoundingClientRect;
    rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.classList.contains('track') || this.classList.contains('ruler-track')) return { ...TRACK, toJSON: () => ({}) } as DOMRect;
      return orig.call(this);
    });
  });
  afterEach(() => {
    rectSpy?.mockRestore();
    document.body.innerHTML = '';
  });

  it('a right-click on a key selects it and offers Copy, Paste and Delete', async () => {
    const t = await mount();
    const key = t.root.querySelector('.key[data-key="scale@50"]')!;
    const e = ctx(X(50), 10);
    key.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    await t.settle();
    expect(t.el.selection).toEqual(['scale@50']);
    const m = t.menu()!;
    expect(m.open).toBe(true);
    expect(m.at).toEqual([X(50), 10]);
    const l = labels(m);
    expect(l).toEqual(expect.arrayContaining(['Copy keyframes', 'Paste keyframes at the playhead', 'Delete keyframes', 'Select all keyframes']));
    expect(l).not.toContain('Add keyframe here');
  });

  it('Delete from the menu removes the key', async () => {
    const t = await mount();
    t.root.querySelector('.key[data-key="scale@50"]')!.dispatchEvent(ctx(X(50), 10));
    await t.settle();
    item(t.menu()!, 'Delete keyframes').click();
    await t.settle();
    expect(t.el.doc!.keyframes!.map((k) => k.at)).toEqual([0, 100]);
    expect(t.menu()).toBeNull();
  });

  it('Add keyframe here on a track adds a key at the pointer time and keeps the selection until then', async () => {
    const t = await mount();
    t.root.querySelector('.lane[data-lane="scale"] .track')!.dispatchEvent(ctx(X(24.6), 10));
    await t.settle();
    expect(t.el.selection).toEqual([]);
    const m = t.menu()!;
    expect(item(m, 'Copy keyframes').getAttribute('aria-disabled')).toBe('true');
    item(m, 'Add keyframe here').click();
    await t.settle();
    expect(t.labelsSeen.at(-1)).toBe('Add scale keyframe');
    expect(t.el.doc!.keyframes!.map((k) => k.at)).toEqual([0, 25, 50, 100]);
    expect(t.el.selection).toEqual(['scale@25']);
  });
});
