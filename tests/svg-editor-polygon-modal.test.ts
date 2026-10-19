/** The Polygon tool asks for its corner count in a modal window: nothing is added above or below the canvas. */
import { afterEach, describe, expect, it } from 'vitest';
import '../src/svg-editor/index';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function open(): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg: '<svg viewBox="0 0 24 24"><path d="M2 2h10v10H2z"/></svg>' } });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  const t = Date.now();
  while (el.stage === 'loading') {
    if (Date.now() - t > 4000) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
  await el.updateComplete;
  return el;
}
afterEach(() => mounted.splice(0).forEach((m) => m.remove()));
const win = (el: Ed): HTMLElement | null => el.renderRoot.querySelector('mc-ui-window');
const sides = (el: Ed): HTMLInputElement => el.renderRoot.querySelector<HTMLInputElement>('#o-sides')!;
const key = (t: HTMLElement, k: string): void => void t.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, composed: true, cancelable: true }));

describe('Polygon tool: corner count in a window', () => {
  it('choosing Polygon opens a window with the corner field and adds no row beside the canvas', async () => {
    const el = await open();
    el.setTool('polygon');
    await el.updateComplete;
    expect(el.dlg).toBe('poly');
    expect(win(el)).not.toBeNull();
    expect(sides(el)).not.toBeNull();
    expect(el.renderRoot.querySelector('.center > .opts')).toBeNull();
    expect(el.renderRoot.querySelector('.center #o-sides')).toBeNull();
  });

  it('Enter in the field applies the count and closes the window; the tool stays Polygon', async () => {
    const el = await open();
    el.setTool('polygon');
    await el.updateComplete;
    sides(el).value = '7';
    key(sides(el), 'Enter');
    await el.updateComplete;
    expect(el.opts.sides).toBe(7);
    expect(el.dlg).toBeUndefined();
    expect(win(el)).toBeNull();
    expect(el.tool).toBe('polygon');
  });

  it('Cancel brings back the old count and the tool before', async () => {
    const el = await open();
    el.setTool('rect');
    el.setTool('polygon');
    await el.updateComplete;
    sides(el).value = '9';
    sides(el).dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;
    expect(el.opts.sides).toBe(9);
    [...el.renderRoot.querySelectorAll<HTMLButtonElement>('mc-ui-window [slot=footer] button')].find((b) => b.textContent!.trim() === 'Cancel')!.click();
    await el.updateComplete;
    expect(el.opts.sides).toBe(5);
    expect(el.tool).toBe('rect');
    expect(el.dlg).toBeUndefined();
  });

  it('Escape closes it like Cancel', async () => {
    const el = await open();
    el.setTool('polygon');
    await el.updateComplete;
    win(el)!.dispatchEvent(new CustomEvent('mc-window-close', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.dlg).toBeUndefined();
    expect(el.tool).toBe('select');
  });

  it('with Star on, the inner size is asked in the same window', async () => {
    const el = await open();
    el.setTool('polygon');
    el.opts = { ...el.opts, star: true };
    await el.updateComplete;
    expect(el.renderRoot.querySelector('mc-ui-window #o-inner')).not.toBeNull();
  });

  it('picking Polygon again while it is the tool opens the window again', async () => {
    const el = await open();
    el.setTool('polygon');
    await new Promise((r) => setTimeout(r, 20));
    sides(el).blur(); // happy-dom cannot resolve a removed window's input as the active element
    el.dlg = undefined; // closed (polyOk also focuses the canvas, which happy-dom cannot resolve as active)
    await el.updateComplete;
    el.setTool('polygon');
    await el.updateComplete;
    expect(el.dlg).toBe('poly');
  });
});
