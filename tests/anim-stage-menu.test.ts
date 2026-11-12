/* The right-click menu on the animation studio stage. */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { UiMenuElement } from '../src/contracts/ui-kit';

const bell = { id: 'bell', name: 'Doorbell wiggle', kind: 'keyframes', duration: 1.2, target: 'element', keyframes: [{ at: 0, transform: { rotate: 0 } }, { at: 50, transform: { rotate: 8 } }, { at: 100, transform: { rotate: 0 } }] };

const tick = async (n = 5) => {
  for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0));
};
const ctx = (x: number, y: number) => new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true, clientX: x, clientY: y, button: 2 });
const rows = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('[role^="menuitem"]')];
const labels = (menu: Element) => rows(menu.shadowRoot!).map((r) => r.querySelector('.label')?.textContent);
const item = (scope: ParentNode, label: string) => rows(scope).find((i) => i.querySelector('.label')?.textContent === label)!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Studio = HTMLElement & { library?: unknown; standalone: boolean; hass?: unknown; updateComplete: Promise<boolean>; [k: string]: any };

async function openStudio() {
  await import('../src/index');
  await import('../src/anim-studio/index');
  await import('../src/anim-studio/editors/keyframes-editor');
  const el = document.createElement('magic-card-animation-studio') as Studio;
  el.standalone = true;
  el.library = { bell: structuredClone(bell) };
  el.hass = { themes: { themes: {}, darkMode: false }, states: {}, language: 'en', locale: { language: 'en' } };
  document.body.appendChild(el);
  await el.updateComplete;
  await tick();
  el.shadowRoot!.querySelector<HTMLButtonElement>('.lib-row[data-id="bell"] .open')!.click();
  await tick();
  await el.updateComplete;
  await tick();
  const root = el.shadowRoot!;
  const settle = async () => {
    await tick();
    await el.updateComplete;
    await tick();
  };
  const stage = () => root.querySelector('mcas-stage') as HTMLElement;
  const menu = () => root.querySelector('mc-ui-menu.stage-menu') as UiMenuElement | null;
  const timeline = () => root.querySelector('mc-anim-keyframes-editor.kind-editor') as Studio;
  const open = async (x = 140, y = 90) => {
    const e = ctx(x, y);
    stage().dispatchEvent(e);
    await settle();
    return e;
  };
  return { el, root, settle, stage, menu, timeline, open };
}

beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
  sessionStorage.clear();
});
afterEach(() => (document.body.innerHTML = ''));

describe('stage right-click menu', () => {
  it('a right-click on the stage opens the menu at the pointer', async () => {
    const t = await openStudio();
    const e = await t.open(140, 90);
    expect(e.defaultPrevented).toBe(true);
    const m = t.menu()!;
    expect(m).toBeTruthy();
    expect(m.open).toBe(true);
    expect(m.at).toEqual([140, 90]);
    expect(m.backLabel).toBe('Back');
    expect(labels(m)).toEqual(expect.arrayContaining(['Add property', 'Copy keyframes', 'Delete keyframes', 'Select all keyframes', 'Pause', 'What moves', 'Undo', 'Redo']));
  });

  it('a right-click in a text input keeps the browser menu', async () => {
    const t = await openStudio();
    const input = document.createElement('input');
    t.stage().append(input);
    const e = ctx(5, 5);
    input.dispatchEvent(e);
    await t.settle();
    expect(e.defaultPrevented).toBe(false);
    expect(t.menu()).toBeNull();
  });

  it('Shift+F10 on the stage opens the menu', async () => {
    const t = await openStudio();
    const k = new KeyboardEvent('keydown', { key: 'F10', shiftKey: true, bubbles: true, composed: true, cancelable: true });
    t.stage().dispatchEvent(k);
    await t.settle();
    expect(k.defaultPrevented).toBe(true);
    expect(t.menu()?.open).toBe(true);
  });

  it('Add property adds the lane to the document', async () => {
    const t = await openStudio();
    await t.open();
    const m = t.menu()!;
    item(m.shadowRoot!, 'Add property').click();
    await t.settle();
    const sub = m.shadowRoot!.querySelector('.sub')!;
    expect(sub.querySelector('.back .label')!.textContent).toBe('Back');
    item(sub, 'Scale').click();
    await t.settle();
    expect(t.menu()).toBeNull();
    const kfs = t.el._doc.keyframes as Array<{ transform?: Record<string, unknown> }>;
    expect(kfs.some((k) => k.transform && 'scale' in k.transform)).toBe(true);
  });

  it('Copy and Delete are the entries of the key menu', async () => {
    const t = await openStudio();
    const tl = t.timeline();
    const own = tl.stageMenu() as Array<{ id: string; label: string; reason?: string; keys?: string }>;
    const shared = tl._ctxItems(undefined) as Array<{ id: string; label: string; reason?: string; keys?: string }>;
    for (const id of ['copy', 'paste', 'delete', 'all']) {
      const a = own.find((e) => e.id === `kf-${id}`)!;
      const b = shared.find((e) => e.id === id)!;
      expect({ label: a.label, reason: a.reason, keys: a.keys }).toEqual({ label: b.label, reason: b.reason, keys: b.keys });
    }
    await t.open();
    expect(item(t.menu()!.shadowRoot!, 'Delete keyframes').getAttribute('aria-disabled')).toBe('true');
  });

  it('What moves sets the target', async () => {
    const t = await openStudio();
    await t.open();
    const m = t.menu()!;
    item(m.shadowRoot!, 'What moves').click();
    await t.settle();
    const sub = m.shadowRoot!.querySelector('.sub')!;
    expect(item(sub, 'Element').getAttribute('aria-checked')).toBe('true');
    item(sub, 'Icon').click();
    await t.settle();
    expect(t.el._doc.target).toBe('icon');
  });

  it('Undo is disabled with nothing to undo', async () => {
    const t = await openStudio();
    await t.open();
    const u = item(t.menu()!.shadowRoot!, 'Undo');
    expect(u.getAttribute('aria-disabled')).toBe('true');
    expect(u.getAttribute('aria-description')).toBe('Nothing to undo');
  });
});
