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

async function settle(el: AnyEl, rounds = 4): Promise<void> {
  for (let i = 0; i < rounds; i++) {
    for (const e of deepAll(el, '*')) if (e.updateComplete) await e.updateComplete;
    if (el.updateComplete) await el.updateComplete;
    await tick();
  }
}

const doc: ThemeDoc = { 'primary-color': '#112233' };
const file: ThemeFileEntry = { name: 'mine', file: 'themes/mine.yaml', editable: true, has_modes: false, var_count: 1, mtime: 100 };
const BACKEND_TEXT = 'themes/mine.yaml was changed outside the editor (backend wording)';

function fakeBackend(code: string) {
  const include: ThemeList['include'] = { state: 'ok', dir_exists: true, hint: '' };
  const backend: ThemeBackend = {
    list: vi.fn(async () => ({ include, files: [file], loaded: ['mine'] })),
    get: vi.fn(async (name: string) => ({ name, file: file.file, editable: true, mtime: 100, theme: { ...doc } })),
    save: vi.fn(async (req) => ({ name: req.name, file: `themes/${req.name}.yaml`, mtime: 200, loaded: true })),
    remove: vi.fn(async () => {
      throw Object.assign(new Error(BACKEND_TEXT), { code });
    }),
  };
  return backend;
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

/** Opens the one theme, opens the delete dialog and presses Delete against a backend that refuses with `code`. Returns the error line shown. */
async function refuseDelete(language: string, code: string): Promise<{ text: string; ed: AnyEl }> {
  host = document.createElement('magic-card-theme-editor') as AnyEl;
  host.hass = { language, themes: { darkMode: false, themes: {} } };
  document.body.appendChild(host);
  host.backend = fakeBackend(code);
  await settle(host, 6);
  (deep(sr(host), 'mcte-start-view')!.shadowRoot!.querySelector('.row .acts button') as HTMLElement).click();
  await settle(host, 6);
  const ed = deep(sr(host), 'mcte-editor-view')!;
  ed._openDlg('delete');
  await settle(host, 6);
  await ed._delete();
  await settle(host, 6);
  expect(host.backend.remove).toHaveBeenCalledTimes(1);
  const line = deep(sr(ed), '.help.error');
  expect(line, 'delete error line').toBeTruthy();
  return { text: (line!.textContent ?? '').replace(/\s+/g, ' ').trim(), ed };
}

describe('a refused delete in the editor', () => {
  it('edited_by_hand shows the translated reason in nl, not the backend text', async () => {
    const { text, ed } = await refuseDelete('nl', 'edited_by_hand');
    expect(text).toContain('Kon mine niet verwijderen.');
    expect(text).toContain('Sla het thema op onder een nieuwe naam');
    expect(text).not.toContain('backend wording');
    expect(ed._dlgError).not.toContain('backend wording');
  });

  it('edited_by_hand shows the translated reason in en-GB, not the backend text', async () => {
    const { text } = await refuseDelete('en-GB', 'edited_by_hand');
    expect(text).toContain('Could not delete mine.');
    expect(text).toContain('The editor cannot confirm that the file is unchanged since it last wrote it');
    expect(text).toContain('Save the theme under a new name instead.');
    expect(text).not.toContain('backend wording');
  });

  it('another error code still shows the backend message', async () => {
    const { text } = await refuseDelete('en-GB', 'write_failed');
    expect(text).toContain(`Could not delete mine. ${BACKEND_TEXT}`);
    expect(text).not.toContain('cannot confirm');
  });
});
