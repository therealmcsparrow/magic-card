// The animation studio measures from the preview tile: ruler 0 and the size callouts sit on the drawn card.
import { describe, it, expect, beforeEach } from 'vitest';
import type { StudioFrameElement } from '../src/contracts/studio-frame';

const bell = { id: 'bell', name: 'Doorbell wiggle', kind: 'keyframes', duration: 1.2, keyframes: [{ at: 0, transform: { rotate: 0 } }, { at: 100, transform: { rotate: 0 } }] };
const tick = async (n = 5) => {
  for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Studio = HTMLElement & { library?: unknown; standalone: boolean; hass?: unknown; updateComplete: Promise<boolean>; _selection: any };

async function open() {
  await import('../src/index');
  await import('../src/anim-studio/index');
  const el = document.createElement('magic-card-animation-studio') as Studio;
  el.standalone = true;
  el.library = { bell };
  el.hass = { themes: { themes: {}, darkMode: false }, states: {}, language: 'en', locale: { language: 'en' } };
  document.body.appendChild(el);
  await el.updateComplete;
  await tick();
  el.shadowRoot!.querySelector<HTMLButtonElement>('.lib-row[data-id="bell"] .open')!.click();
  await tick();
  await el.updateComplete;
  const root = el.shadowRoot!;
  const center = root.querySelector('.center') as HTMLElement;
  center.getBoundingClientRect = () => ({ x: 300, y: 120, left: 300, top: 120, right: 1200, bottom: 700, width: 900, height: 580, toJSON() {} }) as DOMRect;
  const stage = root.querySelector('mcas-stage') as HTMLElement;
  const frame = () => root.querySelector('mc-ui-studio-frame') as StudioFrameElement;
  const settle = async () => {
    await tick();
    await el.updateComplete;
    await tick();
  };
  return { el, stage, frame, settle };
}

beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});

describe('animation studio measure', () => {
  it('origin is where the drawn tile sits in the stage content', async () => {
    const t = await open();
    t.stage.dispatchEvent(new CustomEvent('stage-rect', { detail: { width: 360, height: 240, scale: 1, client: { left: 572, top: 260 } } }));
    await t.settle();
    expect(t.frame().measure!.origin).toEqual({ x: 272, y: 140 });
    expect(t.frame().measure!.width).toBe(360);
  });

  it('the selection is the subject box in stage px, not divided by the zoom', async () => {
    const t = await open();
    t.el._selection = { kind: 'target', target: 'icon' };
    await t.settle();
    t.stage.dispatchEvent(new CustomEvent('stage-rect', { detail: { width: 360, height: 240, scale: 0.5, subject: { x: 148, y: 88, width: 64, height: 64 }, client: { left: 400, top: 200 } } }));
    await t.settle();
    const m = t.frame().measure!;
    expect(m.zoom).toBe(0.5);
    expect(m.selection).toEqual({ x: 148, y: 88, width: 64, height: 64 });
    expect(m.origin).toEqual({ x: 100, y: 80 });
  });

  it('without a client position there is no origin', async () => {
    const t = await open();
    t.stage.dispatchEvent(new CustomEvent('stage-rect', { detail: { width: 360, height: 240, scale: 1 } }));
    await t.settle();
    expect(t.frame().measure!.origin).toBeUndefined();
  });
});
