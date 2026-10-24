import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const host = { open: vi.fn<(o: unknown) => Promise<'opened' | 'failed'>>(async () => 'opened'), add: vi.fn<(...a: unknown[]) => boolean>(() => true), card: true };
vi.mock('../src/image-tools/editor-host', () => ({ openImageEditor: (o: unknown) => host.open(o) }));
vi.mock('../src/image-tools/card-module', () => ({ addImageModuleBehind: (...a: unknown[]) => host.add(...a) }));
vi.mock('../src/editor/custom/bridge', () => ({ cardStateOf: () => (host.card ? {} : undefined) }));

import { install } from '../src/image-tools/chunk';
import { resetImages } from '../src/image-tools/library';
import type { McLibraryImageField } from '../src/image-tools/mc-library-image-field';
import { defineUiKit } from '../src/ui-kit';

const summary = (id: string, name: string, view_box = '0 0 1920 1080', bindings = 0) => ({ id, name, view_box, bytes: 84 * 1024, bindings, updated_at: '2026-01-01T00:00:00Z' });
const LIST = [summary('ground', 'Ground floor', '0 0 1920 1080', 2), summary('garden', 'Garden', '0 0 1280 960', 0)];
const BINDINGS = [
  { target: 'a', entity: 'light.kitchen', set: 'fill', rules: [] },
  { target: 'b', entity: 'binary_sensor.gone', set: 'visible', rules: [] },
  { target: 'c', entity: 'light.kitchen', set: 'opacity', rules: [] },
];

interface Opts { list?: unknown; admin?: boolean; fail?: string }
function makeHass(o: Opts = {}) {
  return {
    user: { is_admin: o.admin ?? true },
    states: { 'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen light' } } },
    callWS: vi.fn(async (m: { type: string; ids?: string[] }) => {
      if (o.fail) throw { code: o.fail };
      if (m.type.endsWith('images_list')) return { images: o.list ?? LIST };
      if (m.type.endsWith('images_get')) return { images: m.ids!.map((id) => ({ ...(LIST.find((i) => i.id === id) ?? summary(id, id)), svg: '<svg viewBox="0 0 16 9"/>', bindings: id === 'ground' ? BINDINGS : [] })) };
      return {};
    }),
  } as never;
}

type Field = McLibraryImageField;
const flush = async (el: Field) => {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

async function mount(props: Partial<Field> & Record<string, unknown> = {}, opts: Opts = {}): Promise<{ el: Field; changes: Array<Record<string, unknown>> }> {
  const el = document.createElement('mc-library-image-field') as Field;
  Object.assign(el, { hass: makeHass(opts), value: '', context: 'module', module: {}, ...props });
  const changes: Array<Record<string, unknown>> = [];
  el.addEventListener('image-change', (e) => changes.push((e as CustomEvent).detail.keys));
  document.body.append(el);
  await flush(el);
  return { el, changes };
}

const $ = (el: Field, sel: string) => el.shadowRoot!.querySelector<HTMLElement>(sel);
const $$ = (el: Field, sel: string) => [...el.shadowRoot!.querySelectorAll<HTMLElement>(sel)];
const text = (el: Field) => el.shadowRoot!.textContent!.replace(/\s+/g, ' ');
const click = async (el: Field, sel: string) => {
  $(el, sel)!.click();
  await flush(el);
};
const buttonByText = (el: Field, label: string) => $$(el, 'button').find((b) => b.textContent!.trim() === label);

beforeEach(() => {
  defineUiKit();
  install();
  resetImages();
  host.open.mockClear();
  host.add.mockClear();
  host.card = true;
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('the choice', () => {
  it('shows the chosen library image with its name and shape', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' });
    const radio = $(el, 'input[type=radio][value=library]') as HTMLInputElement;
    expect(radio.checked).toBe(true);
    expect(text(el)).toContain('Ground floor');
    expect(text(el)).toContain('16:9');
    expect(text(el)).toContain('mcu-image:ground');
  });

  it('selecting the Library image radio only selects: nothing opens, nothing is written', async () => {
    const { el, changes } = await mount({ value: 'https://x/y.png' });
    expect(($(el, 'input[type=radio][value=url]') as HTMLInputElement).checked).toBe(true);
    ($(el, 'input[type=radio][value=library]') as HTMLInputElement).click();
    await flush(el);
    expect(($(el, 'input[type=radio][value=library]') as HTMLInputElement).checked).toBe(true);
    expect(text(el)).toContain('No image chosen');
    expect($(el, 'mc-image-picker')).toBeNull();
    expect(changes).toEqual([]);
    expect(buttonByText(el, 'Choose an image')).toBeTruthy();
  });

  it('puts the Library image choice first, and checks it for an empty value', async () => {
    const { el } = await mount({ value: '' });
    const radios = $$(el, 'input[type=radio]');
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(['library', 'url']);
    expect((radios[0] as HTMLInputElement).checked).toBe(true);
  });

  it('keeps the address field for a URL and writes what is typed', async () => {
    const { el, changes } = await mount({ value: 'https://x/y.png' });
    const media = $(el, 'mc-media-picker') as HTMLElement & { value: string };
    expect(media.value).toBe('https://x/y.png');
    media.dispatchEvent(new CustomEvent('value-changed', { detail: { value: '/local/a.png' }, bubbles: true }));
    expect(changes).toEqual([{ image: '/local/a.png' }]);
  });

  it('with Magic Card Utils missing, disables the library choice and says why', async () => {
    const { el } = await mount({ value: '' }, { fail: 'unknown_command' });
    expect(($(el, 'input[type=radio][value=library]') as HTMLInputElement).disabled).toBe(true);
    expect(($(el, 'input[type=radio][value=url]') as HTMLInputElement).checked).toBe(true);
    expect(text(el)).toContain('Images need Magic Card Utils. It is installed through HACS, like Magic Card.');
  });

  it('says so when the image is no longer in the library, with Pick another', async () => {
    const { el } = await mount({ value: 'mcu-image:deleted' });
    expect(text(el)).toContain('This image is no longer in the library.');
    expect(buttonByText(el, 'Pick another')).toBeTruthy();
    expect(text(el)).toContain('mcu-image:deleted');
  });

  it('treats a malformed reference as a library value that is missing, not as a URL', async () => {
    const { el } = await mount({ value: 'mcu-image:Not Valid' });
    expect(($(el, 'input[type=radio][value=library]') as HTMLInputElement).checked).toBe(true);
    expect(text(el)).toContain('This image is no longer in the library.');
  });
});

describe('Choose and the picker', () => {
  async function pickerOf(el: Field) {
    await click(el, '[data-act=choose]');
    const p = $(el, 'mc-image-picker')!;
    await (p as never as { updateComplete: Promise<unknown> }).updateComplete;
    for (let i = 0; i < 6; i++) await Promise.resolve();
    await (p as never as { updateComplete: Promise<unknown> }).updateComplete;
    return p;
  }

  it('opens only from the Choose button', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' });
    expect($(el, 'mc-image-picker')).toBeNull();
    const p = await pickerOf(el);
    expect(p).toBeTruthy();
    expect((p as never as { current: string }).current).toBe('ground');
  });

  it('writes the reference and the drawing shape for a module without a shape, and says so', async () => {
    const { el, changes } = await mount({ value: '' });
    const p = await pickerOf(el);
    p.dispatchEvent(new CustomEvent('pick', { detail: { id: 'ground' } }));
    await flush(el);
    expect(changes).toEqual([{ image: 'mcu-image:ground', aspect_ratio: '16:9' }]);
    expect($(el, 'mc-image-picker')).toBeNull();
    expect($(el, '[role=status]')!.textContent).toContain('Image set: Ground floor.');
    expect(el.shadowRoot!.textContent).toContain('Card shape set to 16:9.');
  });

  it('keeps a shape the module already has', async () => {
    const { el, changes } = await mount({ value: '', module: { aspect_ratio: '4:3' } });
    const p = await pickerOf(el);
    p.dispatchEvent(new CustomEvent('pick', { detail: { id: 'ground' } }));
    await flush(el);
    expect(changes).toEqual([{ image: 'mcu-image:ground' }]);
  });

  it('closes without a change on close', async () => {
    const { el, changes } = await mount({ value: '' });
    const p = await pickerOf(el);
    p.dispatchEvent(new CustomEvent('close'));
    await flush(el);
    expect($(el, 'mc-image-picker')).toBeNull();
    expect(changes).toEqual([]);
  });

  it('returns focus to the Choose button after a pick', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' });
    const p = await pickerOf(el);
    p.dispatchEvent(new CustomEvent('pick', { detail: { id: 'garden' } }));
    await flush(el);
    expect(el.shadowRoot!.activeElement).toBe($(el, '[data-act=choose]'));
  });
});

describe('the drawing shape', () => {
  it('offers "Use the drawing\'s shape" when the card differs, and writes it only when pressed', async () => {
    const { el, changes } = await mount({ value: 'mcu-image:ground', module: { aspect_ratio: '4:3' } });
    expect(text(el)).toContain('The card shape (4:3) differs from the drawing (16:9).');
    expect(changes).toEqual([]);
    await click(el, '[data-act=use-shape]');
    expect(changes).toEqual([{ aspect_ratio: '16:9' }]);
  });

  it('shows nothing when the shapes match or the card has none', async () => {
    const a = await mount({ value: 'mcu-image:ground', module: { aspect_ratio: '16:9' } });
    expect($(a.el, '[data-act=use-shape]')).toBeNull();
    document.body.innerHTML = '';
    const b = await mount({ value: 'mcu-image:ground', module: {} });
    expect($(b.el, '[data-act=use-shape]')).toBeNull();
  });
});

describe('Colours', () => {
  it('writes Main and Accent, and removes the key when both are empty', async () => {
    const { el, changes } = await mount({ value: 'mcu-image:ground', module: { colors: { accent: '#00ff00' } } });
    const [main, accent] = $$(el, 'mc-color-picker') as Array<HTMLElement & { value: string }>;
    expect(main.value).toBe('');
    expect(accent.value).toBe('#00ff00');
    main.dispatchEvent(new CustomEvent('value-changed', { detail: { value: '#ff0000' } }));
    expect(changes.at(-1)).toEqual({ colors: { main: '#ff0000', accent: '#00ff00' } });
    el.module = { colors: { main: '#ff0000', accent: '#00ff00' } };
    await flush(el);
    ($$(el, 'mc-color-picker')[1]).dispatchEvent(new CustomEvent('value-changed', { detail: { value: '' } }));
    expect(changes.at(-1)).toEqual({ colors: { main: '#ff0000' } });
  });

  it('removes colors when the last colour is cleared', async () => {
    const { el, changes } = await mount({ value: 'mcu-image:ground', module: { colors: { main: '#ff0000' } } });
    ($$(el, 'mc-color-picker')[0]).dispatchEvent(new CustomEvent('value-changed', { detail: { value: '' } }));
    expect(changes.at(-1)).toEqual({ colors: undefined });
  });

  it('is not shown for a URL image', async () => {
    const { el } = await mount({ value: 'https://x/y.png' });
    expect($$(el, 'mc-color-picker')).toHaveLength(0);
  });
});

describe('Description and State summary', () => {
  it('writes the description for any image source and drops the key when emptied', async () => {
    const { el, changes } = await mount({ value: 'https://x/y.png' });
    const ta = $(el, 'textarea') as HTMLTextAreaElement;
    expect(ta.maxLength).toBe(500);
    expect($(el, 'label[for=desc]')!.textContent).toContain('Description for screen readers');
    ta.value = 'Floor plan';
    ta.dispatchEvent(new Event('input'));
    expect(changes.at(-1)).toEqual({ description: 'Floor plan' });
    ta.value = '';
    ta.dispatchEvent(new Event('input'));
    expect(changes.at(-1)).toEqual({ description: undefined });
  });

  it('shows the status and the counter from 450 characters', async () => {
    const a = await mount({ value: 'mcu-image:ground', module: {} });
    expect(text(a.el)).toContain('Not set (screen readers skip this picture)');
    expect($(a.el, '.count')).toBeNull();
    document.body.innerHTML = '';
    const b = await mount({ value: 'mcu-image:ground', module: { description: 'x'.repeat(455) } });
    expect(text(b.el)).toContain('Set (screen readers read it)');
    expect($(b.el, '.count')!.textContent).toContain('45 left');
    document.body.innerHTML = '';
    const c = await mount({ value: 'mcu-image:ground', module: { description: 'x'.repeat(500) } });
    expect(text(c.el)).toContain('That is the longest description (500 characters).');
  });

  it('offers the state list only for an image with connections', async () => {
    const withConn = await mount({ value: 'mcu-image:ground', module: {} });
    const sw = $(withConn.el, '[role=switch]')!;
    expect(sw).toBeTruthy();
    expect(sw.getAttribute('aria-checked')).toBe('false');
    sw.click();
    await flush(withConn.el);
    expect(withConn.changes.at(-1)).toEqual({ state_summary: true });
    document.body.innerHTML = '';
    const without = await mount({ value: 'mcu-image:garden', module: {} });
    expect($(without.el, '[role=switch]')).toBeNull();
    document.body.innerHTML = '';
    const url = await mount({ value: 'https://x/y.png', module: {} });
    expect($(url.el, '[role=switch]')).toBeNull();
  });

  it('turns the list off by removing the key', async () => {
    const { el, changes } = await mount({ value: 'mcu-image:ground', module: { state_summary: true } });
    $(el, '[role=switch]')!.click();
    await flush(el);
    expect(changes.at(-1)).toEqual({ state_summary: undefined });
  });

  it('previews what screen readers will hear, with unknown entities marked', async () => {
    const { el } = await mount({ value: 'mcu-image:ground', module: { state_summary: true } });
    const line = $(el, '.will-read')!.textContent!.replace(/\s+/g, ' ');
    expect(line).toContain('Kitchen light: on');
    expect(line).toContain('binary_sensor.gone: (not found)');
  });

  it('nudges when the picture has connections and neither is set', async () => {
    const a = await mount({ value: 'mcu-image:ground', module: {} });
    expect(text(a.el)).toContain('This picture shows live devices. Add a description or switch on the list so everyone can follow it.');
    document.body.innerHTML = '';
    const b = await mount({ value: 'mcu-image:ground', module: { description: 'Plan' } });
    expect(text(b.el)).not.toContain('This picture shows live devices.');
  });

  it('with the source hidden (entity picture) still offers the description only', async () => {
    const { el } = await mount({ value: '', hideSource: true });
    expect($$(el, 'input[type=radio]')).toHaveLength(0);
    expect($(el, 'textarea')).toBeTruthy();
  });
});

describe('Uses N devices and Copy reference', () => {
  it('counts each entity once and lists them with unknown ones marked', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' });
    expect(text(el)).toContain('Uses 2 devices');
    expect($(el, '.uses-list')).toBeNull();
    await click(el, '[data-act=uses]');
    const items = $$(el, '.uses-list li').map((li) => li.textContent!.trim());
    expect(items).toEqual(['Kitchen light', 'binary_sensor.gone (not found)']);
    expect($(el, '[data-act=uses]')!.getAttribute('aria-expanded')).toBe('true');
  });

  it('says nothing about devices for an image with no connections', async () => {
    const { el } = await mount({ value: 'mcu-image:garden' });
    expect(text(el)).not.toContain('Uses');
  });

  it('copies the reference and says so', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const { el } = await mount({ value: 'mcu-image:ground' });
    await click(el, '[data-act=copy]');
    expect(writeText).toHaveBeenCalledWith('mcu-image:ground');
    expect($(el, '[role=status]')!.textContent).toContain('Reference copied.');
  });
});

describe('Draw and Edit', () => {
  it('Draw a new image opens the editor on a blank image and writes the saved image', async () => {
    const { el, changes } = await mount({ value: '' });
    await click(el, '[data-act=draw]');
    const o = host.open.mock.calls[0][0] as { source: unknown; onSaved(s: unknown): void };
    expect(o.source).toEqual({ kind: 'image-blank' });
    o.onSaved({ id: 'new-one', name: 'New one', view_box: '0 0 1024 1024', svg: '<svg/>' });
    await flush(el);
    expect(changes).toEqual([{ image: 'mcu-image:new-one', aspect_ratio: '1:1' }]);
    expect($(el, '[role=status]')!.textContent).toContain('Image set: New one.');
  });

  it('Edit image opens the editor on the image', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' });
    await click(el, '[data-act=edit]');
    expect((host.open.mock.calls[0][0] as { source: unknown }).source).toEqual({ kind: 'image', id: 'ground' });
  });

  it('forgets the cached list after a save so the picker shows the new image', async () => {
    const hass = makeHass();
    const { el } = await mount({ value: 'mcu-image:ground', hass });
    await click(el, '[data-act=edit]');
    const o = host.open.mock.calls[0][0] as { onSaved(s: unknown): void };
    o.onSaved({ id: 'ground', name: 'Ground floor', view_box: '0 0 1920 1080', svg: '<svg/>' });
    await flush(el);
    const lists = (hass as never as { callWS: { mock: { calls: Array<[{ type: string }]> } } }).callWS.mock.calls.filter((c) => c[0].type.endsWith('images_list'));
    expect(lists.length).toBeGreaterThanOrEqual(2);
  });

  it('shows a message and keeps the value when the editor did not load', async () => {
    host.open.mockResolvedValueOnce('failed');
    const { el, changes } = await mount({ value: 'mcu-image:ground' });
    await click(el, '[data-act=edit]');
    expect($(el, '[role=alert]')!.textContent).toContain('The drawing editor could not load. Try again.');
    expect(changes).toEqual([]);
  });

  it('for a user who is not an administrator: no Draw, and Edit becomes View', async () => {
    const { el } = await mount({ value: 'mcu-image:ground' }, { admin: false });
    expect($(el, '[data-act=draw]')).toBeNull();
    expect($(el, '[data-act=edit]')!.textContent!.trim()).toBe('View image');
  });
});

describe('in a background layer', () => {
  it('writes only the reference and shows the decorative sentence as text', async () => {
    const { el, changes } = await mount({ value: '', context: 'background' });
    await click(el, '[data-act=choose]');
    const p = $(el, 'mc-image-picker')!;
    p.dispatchEvent(new CustomEvent('pick', { detail: { id: 'ground' } }));
    await flush(el);
    expect(changes).toEqual([{ image: 'mcu-image:ground' }]);
    expect($$(el, 'mc-color-picker')).toHaveLength(0);
    expect($(el, 'textarea')).toBeNull();
    expect($(el, '[role=switch]')).toBeNull();
  });

  it('says it is a background and that connected parts are live', async () => {
    const { el } = await mount({ value: 'mcu-image:ground', context: 'background' });
    expect(text(el)).toContain('This is a background. Screen readers skip it, and it cannot hold buttons.');
    expect(text(el)).toContain('Live: parts of this picture follow their devices, here too.');
    document.body.innerHTML = '';
    const plain = await mount({ value: 'mcu-image:garden', context: 'background' });
    expect(text(plain.el)).toContain('This is a background.');
    expect(text(plain.el)).not.toContain('Live: parts');
  });

  it('adds an image module behind the content with the same reference, and says so', async () => {
    const { el } = await mount({ value: 'mcu-image:ground', context: 'background' });
    await click(el, '[data-act=add-module]');
    expect(host.add).toHaveBeenCalledWith(el, 'mcu-image:ground', '16:9');
    expect($(el, '[role=status]')!.textContent).toContain('Image module added behind the content. Remove the background layer if you no longer need it.');
  });

  it('hides the action outside the card editor and for a URL image', async () => {
    host.card = false;
    const a = await mount({ value: 'mcu-image:ground', context: 'background' });
    expect($(a.el, '[data-act=add-module]')).toBeNull();
    host.card = true;
    document.body.innerHTML = '';
    const b = await mount({ value: 'https://x/y.png', context: 'background' });
    expect($(b.el, '[data-act=add-module]')).toBeNull();
    expect(text(b.el)).not.toContain('This is a background.');
  });
});

describe('compact (a state row)', () => {
  it('says once when to use live parts and when to use states, only when asked', async () => {
    const asked = await mount({ value: 'mcu-image:ground', context: 'background', compact: true, statesHint: true });
    expect(text(asked.el)).toContain('To change colours, use live parts in one picture. To swap pictures, use states.');
    document.body.innerHTML = '';
    const plain = await mount({ value: 'mcu-image:ground', context: 'background', compact: true });
    expect(text(plain.el)).not.toContain('To change colours');
  });

  it('shows the address field for a URL and a Library image button', async () => {
    const { el } = await mount({ value: 'https://x/y.png', context: 'background', compact: true });
    expect($$(el, 'input[type=radio]')).toHaveLength(0);
    expect($(el, 'mc-media-picker')).toBeTruthy();
    expect($(el, '[data-act=choose]')!.textContent!.trim()).toBe('Library image');
  });

  it('shows the chosen image with Choose and Clear, and clears to an empty value', async () => {
    const { el, changes } = await mount({ value: 'mcu-image:ground', context: 'background', compact: true });
    expect($(el, 'mc-media-picker')).toBeNull();
    expect(text(el)).toContain('Ground floor');
    expect(text(el)).not.toContain('This is a background');
    expect($(el, '[data-act=add-module]')).toBeNull();
    await click(el, '[data-act=clear]');
    expect(changes).toEqual([{ image: '' }]);
  });

  it('shows a Live chip for an image with connections', async () => {
    const { el } = await mount({ value: 'mcu-image:ground', context: 'background', compact: true });
    expect(text(el)).toContain('Live');
  });

  it('shows the missing line on its own row', async () => {
    const { el } = await mount({ value: 'mcu-image:deleted', context: 'background', compact: true });
    expect(text(el)).toContain('This image is no longer in the library.');
  });
});
