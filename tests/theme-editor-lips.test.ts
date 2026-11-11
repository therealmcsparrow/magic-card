import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import type { ThemeBackend, ThemeDoc } from '../src/contracts/theme-editor';

type AnyEl = HTMLElement & Record<string, any>;
const tick = (ms = 0): Promise<void> => new Promise((r) => setTimeout(r, ms));

function deepAll(root: ParentNode, sel: string): AnyEl[] {
  const out: AnyEl[] = [...root.querySelectorAll<AnyEl>(sel)];
  for (const el of root.querySelectorAll<AnyEl>('*')) if (el.shadowRoot) out.push(...deepAll(el.shadowRoot, sel));
  return out;
}
async function settle(el: AnyEl, rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    for (const e of deepAll(el, '*')) if (e.updateComplete) await e.updateComplete;
    if (el.updateComplete) await el.updateComplete;
    await tick(15);
  }
}

const backend: ThemeBackend = {
  list: vi.fn(async () => ({ include: { state: 'ok' as const, dir_exists: true, hint: 'frontend:\n  themes: !include_dir_merge_named themes' }, files: [], loaded: [] })),
  get: vi.fn(async () => {
    throw Object.assign(new Error('not found'), { code: 'not_found' });
  }),
  save: vi.fn(async (req) => ({ name: req.name, file: `themes/${req.name}.yaml`, mtime: 200, loaded: true })),
  remove: vi.fn(async () => undefined),
};
const HASS = { language: 'en-GB', themes: { darkMode: false, themes: {} } };

let host: AnyEl | undefined;
beforeAll(async () => {
  (window as any).MagicCard = { version: 'x', apiVersion: 1, loadEditor: async () => true };
  if (!customElements.get('mc-color-picker')) {
    customElements.define(
      'mc-color-picker',
      class extends HTMLElement {
        value = '';
        label = '';
        gradient = '';
        connectedCallback(): void {
          this.attachShadow({ mode: 'open' }).innerHTML = '<input class="input" />';
        }
      },
    );
  }
  await import('../src/theme-editor/index');
});
beforeEach(() => localStorage.clear());
afterEach(() => {
  host?.remove();
  host = undefined;
  localStorage.clear();
});

async function openEditor(width = 1280): Promise<{ ed: AnyEl; root: ShadowRoot }> {
  host = document.createElement('magic-card-theme-editor') as AnyEl;
  host.hass = HASS;
  document.body.appendChild(host);
  host.backend = backend;
  await settle(host, 6);
  const start = deepAll(host.shadowRoot!, 'mcte-start-view')[0];
  start.openCreate();
  await settle(host);
  (start.shadowRoot!.querySelector('mc-ui-window')!.querySelector('button[type=submit]') as HTMLElement).click();
  await settle(host, 6);
  const ed = deepAll(host.shadowRoot!, 'mcte-editor-view')[0];
  ed._w = width;
  await settle(ed);
  // jsdom has no layout, so the frame never measures a wide screen on its own: open its drawer the way a wide editor does
  if (width >= 1024) {
    ed._frame().openDrawer(null, 'selection');
    await settle(ed);
  }
  return { ed, root: ed.shadowRoot! };
}
const toggle = (root: ShadowRoot): HTMLButtonElement | null => root.querySelector<HTMLButtonElement>('.vars-toggle[aria-controls="vars"]');
const status = (root: ShadowRoot): string => [...root.querySelectorAll('p.sr-only[role="status"]')].map((n) => n.textContent).join('');
const ctrlBackslash = (): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true });

describe('theme editor variables drawer toggle', () => {
  it('has a toggle in the bar named Variables panel, with the shortcut in its title, and the drawer slot holds the variables', async () => {
    const { root } = await openEditor(1280);
    const b = toggle(root)!;
    expect(b.getAttribute('aria-label')).toBe('Variables panel');
    expect(b.getAttribute('aria-expanded')).toBe('true');
    expect(b.title).toMatch(/^Hide variables \((Ctrl\+\\|⌘\\)\)/);
    expect(root.querySelector('#vars[slot="drawer"]')).not.toBeNull();
    expect(root.querySelector('header[aria-label="Editor panels"]')).not.toBeNull();
  });

  it('below 1024 px the drawer is a sheet that starts closed, and the toggle announces a dialog', async () => {
    const { root } = await openEditor(800);
    const b = toggle(root)!;
    expect(b.getAttribute('aria-haspopup')).toBe('dialog');
    expect(b.getAttribute('aria-expanded')).toBe('false');
    expect(root.querySelector('#vars[slot="drawer"]')).not.toBeNull();
  });

  it('pressing the toggle closes and reopens the drawer and announces it', async () => {
    const { ed, root } = await openEditor();
    toggle(root)!.click();
    await settle(ed);
    expect(toggle(root)!.getAttribute('aria-expanded')).toBe('false');
    expect(status(root)).toBe('Variables panel hidden');
    expect(root.querySelector('.panel-hint')).toBeNull();
    toggle(root)!.click();
    await settle(ed);
    expect(toggle(root)!.getAttribute('aria-expanded')).toBe('true');
    expect(status(root)).toBe('Variables panel shown');
  });

  it('has no pin and no lip: the frame keeps its drawer fixed beside the preview', async () => {
    const { ed, root } = await openEditor();
    const frame = ed._frame();
    expect(frame.hasAttribute('fixed-drawer')).toBe(true);
    expect(frame.shadowRoot!.querySelector('[data-bp="pin"]')).toBeNull();
    expect(root.querySelector('.lip, .lip-hint')).toBeNull();
    root.querySelector<HTMLElement>('.stage')!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    await settle(ed);
    expect(frame.drawerOpen).toBe(true);
  });

  it('Ctrl+\\ toggles the drawer and prevents the default', async () => {
    const { ed, root } = await openEditor();
    const ev = ctrlBackslash();
    ed.dispatchEvent(ev);
    await settle(ed);
    expect(ev.defaultPrevented).toBe(true);
    expect(toggle(root)!.getAttribute('aria-expanded')).toBe('false');
  });
});
