import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index';
import { __setTransferImportForTests, loadTransfer } from '../src/editor/transfer-loader';
import '../src/editor/custom/loaders';
import { TRANSFER } from '../src/transfer/chunk';
import { TRANSFER_CHUNK_FILE } from '../src/contracts/preset-transfer';
import type { TransferItem } from '../src/contracts/preset-transfer';
import { animationLibrary, GET_ANIMATIONS, SUBSCRIBE_ANIMATIONS } from '../src/anim-studio/animation-library';
import { resetLibrary } from '../src/editor/custom/library';
import type { LibraryView } from '../src/transfer/library-view';
import type { TransferPanel } from '../src/transfer/panel';

const flush = async () => {
  for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
};

describe('transfer loader', () => {
  afterEach(() => {
    vi.useRealTimers();
    __setTransferImportForTests();
  });

  it('is set on window.MagicCard by the editor chunk and resolves the chunk api once', async () => {
    expect(typeof window.MagicCard?.loadTransfer).toBe('function');
    let n = 0;
    __setTransferImportForTests(async () => (n++, { TRANSFER }));
    const [a, b] = await Promise.all([loadTransfer(), loadTransfer()]);
    expect(a).toBe(TRANSFER);
    expect(b).toBe(TRANSFER);
    await loadTransfer();
    expect(n).toBe(1);
    expect(TRANSFER.tags).toEqual({ panel: 'mc-transfer-panel', library: 'mc-library-view' });
    expect(customElements.get('mc-transfer-panel')).toBeTruthy();
    expect(customElements.get('mc-library-view')).toBeTruthy();
    expect(TRANSFER_CHUNK_FILE).toBe('magic-card-transfer.js');
  });

  it('rejects on a failed import and retries; rejects a chunk whose major is not 1', async () => {
    let n = 0;
    __setTransferImportForTests(async () => {
      if (++n === 1) throw new Error('offline');
      return { TRANSFER };
    });
    await expect(loadTransfer()).rejects.toThrow('offline');
    await expect(loadTransfer()).resolves.toBe(TRANSFER);
    __setTransferImportForTests(async () => ({ TRANSFER: { ...TRANSFER, version: '2.0.0' } }));
    await expect(loadTransfer()).rejects.toThrow(/version/);
    __setTransferImportForTests(async () => ({ TRANSFER }));
    await expect(loadTransfer()).resolves.toBe(TRANSFER);
  });

  it('times out after 8 s and clears the memo', async () => {
    vi.useFakeTimers();
    __setTransferImportForTests(() => new Promise(() => {}));
    const p = loadTransfer();
    const caught = p.catch((e: Error) => e.message);
    await vi.advanceTimersByTimeAsync(8001);
    expect(await caught).toMatch(/timed out/);
    __setTransferImportForTests(async () => ({ TRANSFER }));
    await expect(loadTransfer()).resolves.toBe(TRANSFER);
  });
});

const THEME_FILE = [
  'magic_card_export: "1.0"',
  'kind: theme',
  'items:',
  '  - id: dusk',
  '    name: Dusk',
  '    data:',
  '      primary-color: "#336699"',
  '      modes:',
  '        dark:',
  '          lovelace-background: "center / cover url(https://x.example/a.png)"',
  '          card-mod-theme: dusk',
].join('\n');

async function panel(props: Partial<TransferPanel> = {}): Promise<TransferPanel> {
  const el = document.createElement('mc-transfer-panel') as TransferPanel;
  Object.assign(el, props);
  document.body.append(el);
  await el.updateComplete;
  return el;
}
const q = <T extends Element>(el: Element, sel: string) => el.shadowRoot!.querySelector<T>(sel);
const btn = (el: Element, text: string) => [...el.shadowRoot!.querySelectorAll('button')].find((b) => b.textContent?.trim() === text || b.getAttribute('aria-label')?.startsWith(text + ' ')) as HTMLButtonElement | undefined;
const paste = async (el: TransferPanel, text: string) => {
  q<HTMLTextAreaElement>(el, '#paste')!.value = text;
  btn(el, 'Read')!.click();
  await flush();
  await el.updateComplete;
};

describe('<mc-transfer-panel> import', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps and lists external urls and card-mod keys with hosts, and confirms with "Import anyway"', async () => {
    const el = await panel({ host: 'theme-editor' });
    const seen: unknown[] = [];
    el.addEventListener('mc-transfer-import', (e) => seen.push((e as CustomEvent).detail));
    await paste(el, THEME_FILE);
    const status = q(el, '[role=status]')!;
    expect(status.textContent).toContain('holds 1 theme');
    expect(status.textContent).toContain('3 values are kept');
    const warn = q(el, '.notice.warn')!;
    expect(warn.textContent).toContain('x.example');
    expect(warn.textContent).toContain('lovelace-background');
    expect(warn.textContent).toContain('card-mod-theme');
    expect(btn(el, 'Import anyway')).toBeTruthy();
    expect(btn(el, 'Import 1 theme')).toBeUndefined();
    btn(el, 'Import anyway')!.click();
    expect(seen).toHaveLength(1);
    const d = seen[0] as { kind: string; items: TransferItem<'theme'>[] };
    expect(d.kind).toBe('theme');
    expect(d.items[0].data.modes?.dark?.['lovelace-background']).toContain('https://x.example/a.png');
    expect(d.items[0].data.modes?.dark?.['card-mod-theme']).toBe('dusk');
  });

  it('moves focus to the heading and uses role=alert for a refusal', async () => {
    const el = await panel();
    await paste(el, 'just: [some, text');
    expect(q(el, '[role=alert]')!.textContent).toMatch(/Not valid/);
    expect(el.shadowRoot!.activeElement).toBe(q(el, '#res'));
    expect(q(el, 'h3')).toBeTruthy();
    await paste(el, THEME_FILE);
    expect(q(el, '[role=alert]')!.textContent).toMatch(/Magic Card Utils > Themes/);
  });

  it('refuses a chosen file over 1 MB without reading it', async () => {
    const el = await panel();
    const text = vi.fn(async () => 'x');
    const input = q<HTMLInputElement>(el, 'input[type=file]')!;
    Object.defineProperty(input, 'files', { value: [{ size: 2 * 1024 * 1024, name: 'big.yaml', text }] });
    input.dispatchEvent(new Event('change'));
    await flush();
    await el.updateComplete;
    expect(text).not.toHaveBeenCalled();
    expect(q(el, '[role=alert]')!.textContent).toMatch(/larger than 1 MB/);
  });

  it('asks Replace or Keep both when an id exists, and sends resolved ids', async () => {
    const el = await panel({ host: 'shape-editor', taken: (_k, id) => id === 'ticket' });
    const seen: Array<{ items: TransferItem[]; choice: string }> = [];
    el.addEventListener('mc-transfer-import', (e) => seen.push((e as CustomEvent).detail));
    const file = JSON.stringify({ magic_card_export: '1.0', kind: 'shape', items: [{ id: 'ticket', name: 'Ticket', data: { corner_type: 'bevel', corner: 12 } }] });
    await paste(el, file);
    expect(q(el, '.lbl')!.textContent).toContain('1 shape already exists');
    btn(el, 'Import 1 shape')!.click();
    expect(seen[0].choice).toBe('keep-both');
    expect(seen[0].items[0].id).toBe('ticket-2');
    await paste(el, file);
    q<HTMLButtonElement>(el, '[role=radio][aria-checked=false]')!.click();
    await el.updateComplete;
    btn(el, 'Import 1 shape')!.click();
    expect(seen[1].choice).toBe('replace');
    expect(seen[1].items[0].id).toBe('ticket');
  });

  it('lists what an icon import removed, and Escape closes without leaving the panel to the host', async () => {
    const el = await panel({ host: 'svg-editor' });
    const closed = vi.fn();
    el.addEventListener('mc-transfer-close', closed);
    await paste(el, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><script>alert(1)</script><path d="M1 1h4v4z"/></svg>');
    expect(q(el, 'details')!.textContent).toContain('script');
    const outer = vi.fn();
    document.body.addEventListener('keydown', outer);
    q(el, '.wrap')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    expect(closed).toHaveBeenCalledTimes(1);
    expect(outer).not.toHaveBeenCalled();
  });

  it('refuses a theme import when there is no Magic Card Utils presets store', async () => {
    const el = await panel({ host: 'theme-editor', hasLibrary: false });
    await paste(el, THEME_FILE);
    expect(q(el, '[role=alert]')!.textContent).toContain('Update Magic Card Utils');
    expect(btn(el, 'Import anyway')!.disabled).toBe(true);
  });
});

describe('<mc-transfer-panel> export', () => {
  it('writes YAML or JSON, copies and offers Copy as HA theme for one theme', async () => {
    document.body.innerHTML = '';
    const items: TransferItem[] = [{ id: 'dusk', name: 'Dusk', data: { 'primary-color': '#336699' } as never }];
    const el = await panel({ mode: 'export', exportItems: { kind: 'theme', items } });
    const out = q<HTMLTextAreaElement>(el, '#out')!;
    expect(out.value).toContain('magic_card_export');
    expect(out.value).toContain('kind: theme');
    const written: string[] = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (t: string) => void written.push(t) }, configurable: true });
    btn(el, 'Copy as HA theme')!.click();
    await flush();
    await el.updateComplete;
    expect(written[0]).toMatch(/^Dusk:\n {2}primary-color:/);
    expect(q(el, '[role=status]')!.textContent).toBe('Copied.');
    q<HTMLButtonElement>(el, '[role=radio][aria-checked=false]')!.click();
    await el.updateComplete;
    expect(JSON.parse(q<HTMLTextAreaElement>(el, '#out')!.value).kind).toBe('theme');
  });
});

// ── library view ──

type Ws = (msg: Record<string, unknown>) => unknown;

function fakeHass(ws: Ws, admin = true) {
  const calls: Array<Record<string, unknown>> = [];
  return {
    calls,
    hass: {
      user: { is_admin: admin },
      callWS: async (msg: Record<string, unknown>) => {
        calls.push(msg);
        const r = ws(msg);
        if (r instanceof Error) throw Object.assign(r, { code: (r as { code?: string }).code });
        return r;
      },
      connection: {
        subscribeMessage: async (_cb: unknown, _msg: unknown) => () => {},
      },
    },
  };
}
const err = (code: string) => Object.assign(new Error(code), { code });
const WIGGLE = { id: 'wiggle', name: 'Wiggle', kind: 'keyframes', duration: 1, keyframes: [{ at: 0, transform: { rotate: 0 } }, { at: 100, transform: { rotate: 9 } }] };

async function view(ws: Ws, props: Partial<LibraryView> = {}, admin = true) {
  const f = fakeHass(ws, admin);
  const el = document.createElement('mc-library-view') as LibraryView;
  Object.assign(el, { hass: f.hass }, props);
  document.body.append(el);
  await flush();
  await el.updateComplete;
  return { el, calls: f.calls };
}

describe('<mc-library-view>', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    animationLibrary.reset();
    resetLibrary();
  });

  const full: Ws = (m) => {
    switch (m.type) {
      case GET_ANIMATIONS:
        return { animations: { wiggle: WIGGLE } };
      case 'magic_card_utils/icons_list':
        return { icons: [{ id: 'lamp', name: 'Lamp', keywords: ['light'], updated_at: 'x' }] };
      case 'magic_card_utils/shapes_list':
        return { shapes: [{ id: 'ticket', name: 'Ticket', shape: { corner_type: 'bevel', corner: 12 }, created_at: 'a', updated_at: 'b' }] };
      case 'magic_card_utils/icons_get':
        return { icons: [{ id: 'lamp', name: 'Lamp', svg: '<svg viewBox="0 0 24 24"><path d="M1 1h4v4z"/></svg>', path: 'M1 1h4v4z', view_box: '0 0 24 24', created_at: 'a', updated_at: 'b' }] };
      default:
        return {};
    }
  };
  const go = async (el: LibraryView, label: string) => {
    btn(el, label)!.click();
    await flush();
    await el.updateComplete;
  };

  it('lists animations from the page library, then shapes and icons from the commands, and searches', async () => {
    const { el } = await view(full);
    expect(q(el, '.row')!.textContent).toContain('Wiggle');
    expect(q(el, '[role=status]')!.textContent).toBe('1 animation');
    await go(el, 'Shapes');
    expect(q(el, '.row')!.textContent).toContain('Ticket');
    await go(el, 'Icons');
    expect(q(el, '.row')!.textContent).toContain('Lamp');
    const search = q<HTMLInputElement>(el, '#q')!;
    search.value = 'light';
    search.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.row')).toHaveLength(1);
    search.value = 'zzz';
    search.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(q(el, '.empty')!.textContent).toContain('match "zzz"');
  });

  it('renames an animation with save_animation (same id, new name) and deletes with a confirm', async () => {
    const { el, calls } = await view(full);
    btn(el, 'Rename')!.click();
    await el.updateComplete;
    const input = q<HTMLInputElement>(el, '.row input.input')!;
    input.value = 'Wobble';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await flush();
    const save = calls.find((c) => c.type === 'magic_card_utils/save_animation')!;
    expect((save.animation as { id: string; name: string }).id).toBe('wiggle');
    expect((save.animation as { name: string }).name).toBe('Wobble');
    btn(el, 'Delete')!.click();
    await el.updateComplete;
    expect(q(el, '[role=alert]')!.textContent).toContain('Delete Wiggle?');
    expect(calls.some((c) => c.type === 'magic_card_utils/delete_animation')).toBe(false);
    [...el.shadowRoot!.querySelectorAll('.row button.btn-danger')].find((b) => b.textContent!.trim() === 'Delete')!.dispatchEvent(new MouseEvent('click'));
    await flush();
    expect(calls.find((c) => c.type === 'magic_card_utils/delete_animation')).toMatchObject({ animation_id: 'wiggle' });
  });

  it('renames an icon with icons_save carrying base_updated_at', async () => {
    const { el, calls } = await view(full);
    await go(el, 'Icons');
    btn(el, 'Rename')!.click();
    await el.updateComplete;
    const input = q<HTMLInputElement>(el, '.row input.input')!;
    input.value = 'Desk lamp';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await flush();
    const save = calls.find((c) => c.type === 'magic_card_utils/icons_save')!;
    expect(save.base_updated_at).toBe('b');
    expect(save.icon).toMatchObject({ id: 'lamp', name: 'Desk lamp', path: 'M1 1h4v4z' });
    expect(save.icon).not.toHaveProperty('updated_at');
  });

  it('is read only for a non-admin user', async () => {
    const { el } = await view(full, {}, false);
    expect(btn(el, 'Rename')).toBeUndefined();
    expect(btn(el, 'Delete')).toBeUndefined();
    expect(btn(el, 'Import')).toBeUndefined();
    expect(btn(el, 'Export all')).toBeTruthy();
  });

  it('says to install Magic Card Utils when a command is unknown, and still lists "This card"', async () => {
    const { el } = await view(
      (m) => (m.type === GET_ANIMATIONS ? err('unknown_command') : err('unknown_command')),
      { config: { custom_animations: [WIGGLE], custom_shapes: { ticket: { corners: {} } }, custom_icons: { lamp: '<svg viewBox="0 0 24 24"/>' } } },
    );
    expect(q(el, '.empty')!.textContent).toContain('Magic Card Utils');
    await go(el, 'This card');
    expect(q(el, '.row')!.textContent).toContain('Wiggle');
    expect(btn(el, 'Rename')).toBeUndefined();
    await go(el, 'Icons');
    expect(q(el, '.row')!.textContent).toContain('lamp');
  });

  it('theme presets: older Magic Card Utils (no presets store) says to update; with a store it lists', async () => {
    const { el } = await view(full, { kinds: ['animation', 'theme'] });
    await go(el, 'Theme presets');
    expect(q(el, '.empty')!.textContent).toContain('Update Magic Card Utils');
    const store = {
      list: async () => [{ id: 'dusk', name: 'Dusk', doc: { 'primary-color': '#336699' }, created_at: 'a', updated_at: 'b' }],
      save: vi.fn(async (p: unknown) => p),
      remove: vi.fn(async () => undefined),
    };
    el.presets = store as never;
    await flush();
    await el.updateComplete;
    expect(q(el, '.row')!.textContent).toContain('Dusk');
    btn(el, 'Rename')!.click();
    await el.updateComplete;
    const input = q<HTMLInputElement>(el, '.row input.input')!;
    input.value = 'Dawn';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await flush();
    expect(store.save).toHaveBeenCalledWith(expect.objectContaining({ id: 'dusk', name: 'Dawn' }), 'b');
  });

  it('exports the selected shapes through the panel, and imports into the library with the commands', async () => {
    const { el, calls } = await view(full);
    await go(el, 'Shapes');
    q<HTMLInputElement>(el, '.row input.check')!.click();
    await el.updateComplete;
    await go(el, 'Export 1 selected');
    const out = q(el, 'mc-transfer-panel')!.shadowRoot!.querySelector<HTMLTextAreaElement>('#out')!;
    expect(out.value).toContain('kind: shape');
    expect(out.value).toContain('id: ticket');
    q(el, 'mc-transfer-panel')!.dispatchEvent(new CustomEvent('mc-transfer-close', { bubbles: true, composed: true }));
    await el.updateComplete;
    await go(el, 'Import');
    const p = q<TransferPanel>(el, 'mc-transfer-panel')!;
    p.shadowRoot!.querySelector<HTMLTextAreaElement>('#paste')!.value = JSON.stringify({ magic_card_export: '1.0', kind: 'shape', items: [{ id: 'oval', name: 'Oval', data: { corner_type: 'round', corner: 20 } }] });
    btn(p, 'Read')!.click();
    await flush();
    await p.updateComplete;
    btn(p, 'Import 1 shape')!.click();
    await flush();
    await el.updateComplete;
    expect(calls.find((c) => c.type === 'magic_card_utils/shapes_save')).toMatchObject({ shape: { id: 'oval', name: 'Oval' } });
    expect(q(el, '[role=status]')!.textContent).toContain('Imported 1 of 1.');
  });
});

void SUBSCRIBE_ANIMATIONS;

describe('<mc-transfer-panel> v2 animation checks', () => {
  it('loads the particles validator from the card bundle before it reads a file with a sim', async () => {
    document.body.innerHTML = '';
    const el = await panel({ host: 'animation-studio' });
    const bad = { kind: 'particles', duration: 3, particles: { sim: { engine: 99 } } };
    await paste(el, JSON.stringify({ magic_card_export: '1.0', kind: 'animation', items: [{ id: 'p', name: 'P', data: bad }] }));
    await vi.waitFor(() => expect(q(el, '[role=alert]')).toBeTruthy(), { timeout: 4000 });
    expect(q(el, '[role=alert]')!.textContent).toMatch(/Nothing in this file could be imported/);
  });
});
