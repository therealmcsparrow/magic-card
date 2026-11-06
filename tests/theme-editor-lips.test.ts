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
  return { ed, root: ed.shadowRoot! };
}
const lip = (root: ShadowRoot): HTMLButtonElement | null => root.querySelector<HTMLButtonElement>('.lip[aria-controls="vars-pane"]');
const ctrlBackslash = (): KeyboardEvent => new KeyboardEvent('keydown', { key: '\\', code: 'Backslash', ctrlKey: true, bubbles: true, composed: true, cancelable: true });

describe('theme editor panel lip', () => {
  it('has a lip on the Variables pane at 1024 px and up, directly after it, and a status region', async () => {
    const { root } = await openEditor(1280);
    const l = lip(root)!;
    expect(l.getAttribute('aria-label')).toBe('Variables panel');
    expect(root.getElementById('vars-pane')!.getAttribute('aria-label')).toBe('Variables panel');
    expect(l.getAttribute('aria-expanded')).toBe('true');
    const pane = root.querySelector<HTMLElement>('#vars-pane')!;
    expect(pane.dataset.lip).toBe('shown');
    expect(pane.nextElementSibling).toBe(l);
    expect(root.querySelector('.lip-status[role="status"]')).not.toBeNull();
  });

  it('has no lip below 1024 px, where Variables and Preview are tabs', async () => {
    const { root } = await openEditor(1000);
    expect(lip(root)).toBeNull();
    expect(root.querySelector('.lip-status')).not.toBeNull();
    expect(root.querySelector('#panel-vars')).not.toBeNull();
  });

  it('hiding the pane gives its track to the preview, keeps it mounted and remembers it', async () => {
    const { ed, root } = await openEditor();
    const pane = root.querySelector<HTMLElement>('#vars-pane')!;
    lip(root)!.click();
    await settle(ed);
    expect(root.querySelector('#vars-pane')).toBe(pane);
    expect(pane.dataset.lip).toBe('hidden');
    expect(pane.hasAttribute('inert')).toBe(true);
    expect(root.querySelector('.cols')!.classList.contains('no-vars')).toBe(true);
    expect(localStorage.getItem('mc-panels:theme-editor')).toBe('variables');
    expect(lip(root)!.getAttribute('aria-expanded')).toBe('false');
    // a field typed into earlier stays: the pane is the same node
    lip(root)!.click();
    await settle(ed);
    expect(pane.dataset.lip).toBe('shown');
    expect(localStorage.getItem('mc-panels:theme-editor')).toBeNull();
  });

  it('a remembered hidden pane opens hidden with the hint', async () => {
    localStorage.setItem('mc-panels:theme-editor', 'variables');
    const { root } = await openEditor();
    expect(root.querySelector<HTMLElement>('#vars-pane')!.dataset.lip).toBe('hidden');
    expect(root.querySelector('.lip-hint p')!.textContent).toBe('The variables panel is hidden, as you left it. Use the arrow on the edge to show it.');
  });

  it('Ctrl+\\ toggles the pane, announces it, and does nothing below 1024 px', async () => {
    const { ed, root } = await openEditor();
    const ev = ctrlBackslash();
    root.querySelector('.cols')!.dispatchEvent(ev);
    await settle(ed);
    expect(ev.defaultPrevented).toBe(true);
    expect(root.querySelector<HTMLElement>('#vars-pane')!.dataset.lip).toBe('hidden');
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(root.querySelector('.lip-status')!.textContent).toBe('Variables hidden');
    ed._w = 800;
    await settle(ed);
    expect(root.querySelector('#vars-pane')).toBeNull();
    expect(root.querySelector('#panel-vars')).not.toBeNull();
    expect(root.querySelector('#panel-vars')!.hasAttribute('hidden')).toBe(false);
  });

  it('the stylesheet: the hidden pane keeps its width and the preview takes the track', async () => {
    const { ed } = await openEditor();
    const sheets = (ed.constructor as unknown as { styles: Array<{ cssText: string }> }).styles;
    const css = sheets.map((x) => x.cssText).join('\n');
    expect(css).toMatch(/\.vars\[data-lip='hidden'\]\s*\{[^}]*width:\s*var\(--vw\)/);
    expect(css).toMatch(/\.no-vars\s*\{[^}]*--cw:\s*0px/);
    expect(css).toMatch(/grid-template-columns:\s*var\(--cw, var\(--vw\)\)\s+minmax\(0,\s*1fr\)/);
  });
});
