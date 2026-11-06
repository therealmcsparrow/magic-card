import { describe, it, expect, beforeEach } from 'vitest';
import '../src/index';
import '../src/editor/custom/loaders';
import '../src/transfer/chunk';
import { GET_ANIMATIONS, animationLibrary } from '../src/anim-studio/animation-library';
import { resetLibrary } from '../src/editor/custom/library';
import { LIBRARY_OPEN_EVENT } from '../src/contracts/preset-transfer';
import type { LibraryOpenDetail } from '../src/contracts/preset-transfer';
import type { LibraryView } from '../src/transfer/library-view';

const flush = async () => {
  for (let i = 0; i < 6; i++) await new Promise((r) => setTimeout(r, 0));
};
const q = <T extends Element>(el: Element, sel: string) => el.shadowRoot!.querySelector<T>(sel);
const btns = (el: Element) => [...el.shadowRoot!.querySelectorAll('button')];
const btn = (el: Element, text: string) => btns(el).find((b) => (b.getAttribute('aria-label') ?? b.textContent?.trim()) === text);
const ws = (m: Record<string, unknown>): unknown => {
  switch (m.type) {
    case GET_ANIMATIONS:
      return { animations: {} };
    case 'magic_card_utils/icons_list':
      return { icons: [{ id: 'lamp', name: 'Lamp', updated_at: 'x' }] };
    case 'magic_card_utils/shapes_list':
      return { shapes: [{ id: 'ticket', name: 'Ticket', shape: { corner_type: 'bevel', corner: 12 }, updated_at: 'b' }] };
    default:
      return {};
  }
};

async function mount(props: Partial<LibraryView> = {}) {
  const el = document.createElement('mc-library-view') as LibraryView;
  Object.assign(el, { hass: { user: { is_admin: true }, callWS: async (m: Record<string, unknown>) => ws(m), connection: { subscribeMessage: async () => () => {} } } }, props);
  document.body.append(el);
  await flush();
  await el.updateComplete;
  return el;
}

describe('<mc-library-view context="mcu-panel">', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    animationLibrary.reset();
    resetLibrary();
  });

  it('offers icons, shapes, images, animations and theme presets, icons first, and no "This card" source', async () => {
    const el = await mount({ context: 'mcu-panel', presets: { list: async () => [], save: async () => ({}), remove: async () => undefined } as never });
    const kinds = [...el.shadowRoot!.querySelectorAll('[aria-label=Kind] button')].map((b) => b.textContent);
    expect(kinds).toEqual(['Icons', 'Shapes', 'Images', 'Animations', 'Theme presets']);
    expect(q(el, '[aria-label=Kind] [aria-selected=true]')!.textContent).toBe('Icons');
    expect(q(el, '[aria-label=Source]')).toBeNull();
    expect(btn(el, 'This card')).toBeUndefined();
  });

  it('New icon / Edit fire mc-library-open (bubbling, composed) and never load an editor', async () => {
    const el = await mount({ context: 'mcu-panel' });
    const got: LibraryOpenDetail[] = [];
    let bubbled = false;
    document.body.addEventListener(LIBRARY_OPEN_EVENT, (e) => {
      bubbled = (e as CustomEvent).composed;
      got.push((e as CustomEvent<LibraryOpenDetail>).detail);
    });
    btn(el, 'New icon')!.click();
    btn(el, 'Edit Lamp')!.click();
    btn(el, 'Shapes')!.click();
    await flush();
    await el.updateComplete;
    expect(btn(el, 'New icon')).toBeUndefined();
    btn(el, 'New shape')!.click();
    btn(el, 'Edit Ticket')!.click();
    expect(got).toEqual([{ kind: 'icon' }, { kind: 'icon', id: 'lamp' }, { kind: 'shape' }, { kind: 'shape', id: 'ticket' }]);
    expect(bubbled).toBe(true);
    btn(el, 'Animations')!.click();
    await flush();
    await el.updateComplete;
    expect(btns(el).some((b) => /^New |^Edit /.test(b.textContent!.trim()))).toBe(false);
  });

  it('opens the transfer panel with host mcu-panel', async () => {
    const el = await mount({ context: 'mcu-panel' });
    btn(el, 'Import')!.click();
    await el.updateComplete;
    expect(q(el, 'mc-transfer-panel')!.getAttribute('host') ?? (q(el, 'mc-transfer-panel') as unknown as { host: string }).host).toBe('mcu-panel');
  });

  it('kinds narrows the panel context: ["shape"] shows only shapes, no kind selector, New shape and Edit', async () => {
    const el = await mount({ context: 'mcu-panel', kinds: ['shape'] });
    expect(q(el, '[aria-label=Kind]')).toBeNull();
    expect(btn(el, 'New shape')).toBeTruthy();
    expect(btn(el, 'New icon')).toBeUndefined();
    expect(btn(el, 'Edit Ticket')).toBeTruthy();
    expect(btn(el, 'Edit Lamp')).toBeUndefined();
    expect(btn(el, 'Rename Ticket')).toBeTruthy();
    expect(btn(el, 'Delete Ticket')).toBeTruthy();
    expect(btn(el, 'Export all')).toBeTruthy();
  });

  it('rowExtra: a host adds a leading node and a meta text to each row, nothing without it', async () => {
    const el = await mount({ context: 'mcu-panel', kinds: ['shape'] });
    expect(q(el, '.row .lead')).toBeNull();
    const asked: string[] = [];
    el.rowExtra = (kind, id) => {
      asked.push(`${kind}:${id}`);
      const n = document.createElement('i');
      n.className = 'thumb';
      return { thumb: n, meta: '4 points' };
    };
    await el.updateComplete;
    expect(asked).toContain('shape:ticket');
    expect(q(el, '.row i.thumb')).toBeTruthy();
    expect(q(el, '.row .name small')!.textContent).toBe('ticket · 4 points');
    el.rowExtra = () => undefined;
    await el.updateComplete;
    expect(q(el, '.row i.thumb')).toBeNull();
    expect(q(el, '.row .name small')!.textContent).toBe('ticket');
  });

  it('kinds with nothing the panel hosts falls back to all four kinds', async () => {
    const el = await mount({ context: 'mcu-panel', kinds: [] });
    expect(q(el, '[aria-label=Kind]')).not.toBeNull();
  });

  it('the default context keeps the card editor: This card source, no New / Edit', async () => {
    const el = await mount();
    expect(btn(el, 'This card')).toBeTruthy();
    btn(el, 'Icons')!.click();
    await flush();
    await el.updateComplete;
    expect(btn(el, 'New icon')).toBeUndefined();
    expect(btn(el, 'Edit Lamp')).toBeUndefined();
  });
});

describe('<mc-library-view> contract revision', () => {
  it('carries the same static contractRevision as the editors (the panel gate reads it)', async () => {
    const { SVG_EDITOR_MCU_MIN_REVISION } = await import('../src/contracts/svg-editor');
    const C = customElements.get('mc-library-view') as unknown as { contractRevision: number };
    expect(C.contractRevision).toBeGreaterThanOrEqual(SVG_EDITOR_MCU_MIN_REVISION);
  });
});
