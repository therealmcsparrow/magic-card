/** Start from > An icon uses the card editor's icon picker (mc-icon-picker, by tag) instead of a plain name field. */
import { afterEach, describe, expect, it, vi } from 'vitest';
import '../src/svg-editor/index';
import type { McSvgEditor } from '../src/svg-editor/mc-svg-editor';

class StubPicker extends HTMLElement {
  value = '';
  hass: unknown;
  label = '';
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<div class="with-icon"><input class="input"></div><div class="modal"><input class="search"></div>';
  }
}
customElements.define('mc-icon-picker', StubPicker);

type Ed = McSvgEditor & { updateComplete: Promise<boolean> };
const mounted: HTMLElement[] = [];
const rect = (): DOMRect => ({ left: 0, top: 0, width: 600, height: 600, right: 600, bottom: 600, x: 0, y: 0, toJSON() {} }) as DOMRect;
async function until(f: () => boolean): Promise<void> {
  const t = Date.now();
  while (!f()) {
    if (Date.now() - t > 4000) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 5));
  }
}
async function open(): Promise<Ed> {
  const el = document.createElement('mc-svg-editor') as Ed;
  Object.assign(el, { source: { kind: 'svg', svg: '<svg viewBox="0 0 24 24"><path d="M2 2h10v10H2z"/></svg>' } });
  el.getBoundingClientRect = rect;
  document.body.append(el);
  mounted.push(el);
  await until(() => el.stage !== 'loading');
  await el.updateComplete;
  el.showStart();
  el.startMode = 'icon';
  await el.updateComplete;
  return el;
}
afterEach(() => mounted.splice(0).forEach((m) => m.remove()));
const pick = (el: Ed): StubPicker => el.renderRoot.querySelector('.startform mc-icon-picker') as StubPicker;
const emit = (p: HTMLElement, value: string): void => void p.dispatchEvent(new CustomEvent('value-changed', { detail: { value }, bubbles: true, composed: true }));

describe('Start from > An icon uses the icon picker', () => {
  it('renders mc-icon-picker, not the plain name field', async () => {
    const el = await open();
    expect(pick(el)).not.toBeNull();
    expect(el.renderRoot.querySelector('input#start-icon')).toBeNull();
  });

  it('has a visible Icon name label and no private picker markup is read', async () => {
    const el = await open();
    expect(el.renderRoot.querySelector('.startform label')!.textContent).toBe('Icon name');
  });

  it('a pick or typing fills the name; the button starts the drawing', async () => {
    const el = await open();
    const go = vi.spyOn(el, 'openIcon').mockResolvedValue(true);
    pick(el).shadowRoot!.querySelector<HTMLInputElement>('.search')!.focus();
    emit(pick(el), 'mdi:star');
    await el.updateComplete;
    expect(go).not.toHaveBeenCalled();
    const btn = el.renderRoot.querySelector<HTMLButtonElement>('.startform button[type=submit]')!;
    expect(btn.disabled).toBe(false);
    btn.click();
    expect(go).toHaveBeenCalledWith('mdi:star');
  });
});
