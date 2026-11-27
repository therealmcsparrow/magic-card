import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import type { ThemeBackend, ThemeDoc, ThemeFileEntry, ThemeList } from '../src/contracts/theme-editor';

type AnyEl = HTMLElement & Record<string, any>;

const tick = (ms = 0): Promise<void> => new Promise((r) => setTimeout(r, ms));

function deepAll(root: ParentNode, sel: string): AnyEl[] {
  const out: AnyEl[] = [...root.querySelectorAll<AnyEl>(sel)];
  for (const el of root.querySelectorAll<AnyEl>('*')) if (el.shadowRoot) out.push(...deepAll(el.shadowRoot, sel));
  return out;
}
const deep = (root: ParentNode, sel: string): AnyEl | undefined => deepAll(root, sel)[0];
const sr = (el: AnyEl): ShadowRoot => el.shadowRoot!;

/** The focused element, followed through open shadow roots. */
function deepActive(): Element | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a;
}

async function settle(el: AnyEl, rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    for (const e of deepAll(el, '*')) if (e.updateComplete) await e.updateComplete;
    if (el.updateComplete) await el.updateComplete;
    await tick();
  }
}

const doc: ThemeDoc = { 'primary-color': '#112233' };
const file: ThemeFileEntry = { name: 'mine', file: 'themes/mine.yaml', editable: true, has_modes: false, var_count: 1, mtime: 100 };

function fakeBackend() {
  const state = { saveError: null as (Error & { code?: string }) | null };
  const include: ThemeList['include'] = { state: 'ok', dir_exists: true, hint: '' };
  const backend: ThemeBackend = {
    list: vi.fn(async () => ({ include, files: [file], loaded: ['mine'] })),
    get: vi.fn(async (name: string) => ({ name, file: file.file, editable: true, mtime: 100, theme: { ...doc } })),
    save: vi.fn(async (req) => {
      if (state.saveError) throw state.saveError;
      return { name: req.name, file: `themes/${req.name}.yaml`, mtime: 200, loaded: true };
    }),
    remove: vi.fn(async () => {}),
  };
  return { backend, state };
}

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

let host: AnyEl | undefined;
afterEach(() => {
  host?.remove();
  host = undefined;
  document.getElementById('mc-theme-trial')?.remove();
  document.querySelectorAll('mc-theme-trial-bar').forEach((n) => n.remove());
});

/** Opens the one theme with an unsaved change and a save that will fail with too_large, at the given width. */
async function setup(width: number): Promise<{ h: AnyEl; ed: AnyEl; frame: AnyEl }> {
  const { backend, state } = fakeBackend();
  host = document.createElement('magic-card-theme-editor') as AnyEl;
  host.hass = { language: 'en-GB', themes: { darkMode: false, themes: {} } };
  document.body.appendChild(host);
  host.backend = backend;
  await settle(host, 6);
  (deep(sr(host), 'mcte-start-view')!.shadowRoot!.querySelector('.row .acts button') as HTMLElement).click();
  await settle(host, 6);
  const ed = deep(sr(host), 'mcte-editor-view')!;
  ed._rewriteAck = true;
  ed._setScope('shared');
  deep(sr(ed), '#f-primary-color mc-color-picker')!.dispatchEvent(new CustomEvent('value-changed', { detail: { value: '#abcdef' }, bubbles: true, composed: true }));
  await settle(ed);
  const frame = deep(sr(ed), 'mc-ui-studio-frame')!;
  frame._width = width;
  ed._w = width;
  await settle(host, 6);
  state.saveError = Object.assign(new Error('themes/mine.yaml was edited by hand'), { code: 'edited_by_hand' });
  return { h: host, ed, frame };
}

const saveBtn = (ed: AnyEl): HTMLElement => deep(sr(ed), 'mcte-save-bar')!.shadowRoot!.querySelector('.save') as HTMLElement;

describe('save under a new name after edited_by_hand', () => {
  it('sends a plain create: no overwrite flag, no base_mtime', async () => {
    const { h, ed } = await setup(1200);
    const { backend } = { backend: h.backend as ThemeBackend };
    const save = backend.save as ReturnType<typeof vi.fn>;

    // the refused save of the existing theme carries the overwrite flag and the old file time
    saveBtn(ed).click();
    await settle(h, 6);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0]).toMatchObject({ name: 'mine', overwrite: true, base_mtime: 100 });

    // save under a new name
    ed._renameValue = 'mine-copy';
    ed._applyRename();
    await settle(h, 6);
    expect(ed._name).toBe('mine-copy');
    expect(ed._isNew).toBe(true);

    (ed.backend.save as any).mockImplementation(async (req: any) => ({ name: req.name, file: `themes/${req.name}.yaml`, mtime: 300, loaded: true }));
    saveBtn(ed).click();
    await settle(h, 6);
    expect(save).toHaveBeenCalledTimes(2);
    const req = save.mock.calls[1][0];
    expect(req.name).toBe('mine-copy');
    expect(req.overwrite).toBe(false);
    expect(req.base_mtime).toBeUndefined();
  });
});
