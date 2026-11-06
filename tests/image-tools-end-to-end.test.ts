import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/index';
import '../src/editor/layers/bg-layers';
import type { McBgLayers } from '../src/editor/layers/bg-layers';
import { __setImageToolsImportForTests, applyKeys, loadImageTools } from '../src/editor/image-tools-loader';
import { resetImages } from '../src/image-tools/library';
import type { McLibraryImageField } from '../src/image-tools/mc-library-image-field';
import type { McImagePicker } from '../src/image-tools/mc-image-picker';
import { imageEditor } from '../src/editor/modules/content/image-editor';
import { render } from 'lit';
import { cardConfig, makeHass, mountCard, withState } from './helpers/fake-hass';
import { __setLazyImporterForTests, onDemandChunks } from '../src/utils/lazy-chunks';
import { TIMING } from '../src/utils/lazy-chunk';
import { provideSvgImageChunk } from '../src/utils/svg-image-loader';
import { __resetImageClientForTests } from '../src/svg-image/client';
import { __resetFramesForTests } from '../src/svg-image/frames';
import type { BackgroundLayerConfig } from '../src/contracts/bg-stack';
import type { HomeAssistant, ImageModuleConfig } from '../src/types';

/*
 * The image field to the card: what a user picks in the editor is what the card draws. The reference is the only thing
 * that reaches the YAML (no markup), the shape follows the drawing, and a `states` layer swaps drawings when the
 * entity changes.
 */

const svg = (fill: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path id="p" d="M0 0L10 10" fill="${fill}"/></svg>`;
const DRAWINGS: Record<string, { name: string; view_box: string; svg: string }> = {
  plan: { name: 'Floor plan', view_box: '0 0 200 100', svg: svg('#111111') },
  day: { name: 'Day', view_box: '0 0 200 100', svg: svg('#aaaa00') },
  night: { name: 'Night', view_box: '0 0 200 100', svg: svg('#0000aa') },
};
const summary = (id: string) => ({ id, name: DRAWINGS[id].name, view_box: DRAWINGS[id].view_box, bytes: 2048, bindings: 0, updated_at: 't1' });
const full = (id: string) => ({ ...summary(id), svg: DRAWINGS[id].svg, created_at: 't0', bindings: [] });

const wsLog: Array<{ type: string; ids?: string[] }> = [];
const libraryHass = (extra: Record<string, unknown> = {}): HomeAssistant =>
  makeHass(
    { 'sensor.mode': { state: 'day' } },
    {
      user: { is_admin: true },
      callWS: async (m: { type: string; ids?: string[] }) => {
        wsLog.push(m);
        if (m.type.endsWith('images_list')) return { images: Object.keys(DRAWINGS).map(summary) };
        if (m.type.endsWith('images_get')) return { images: (m.ids ?? []).filter((i) => DRAWINGS[i]).map(full) };
        return {};
      },
      ...extra,
    },
  );

const wait = async (done: () => boolean, ms = 3000) => {
  const end = Date.now() + ms;
  while (!done() && Date.now() < end) await new Promise((r) => setTimeout(r, 15));
};
const settle = async (el: { updateComplete: Promise<unknown> }) => {
  for (let i = 0; i < 8; i++) {
    await Promise.resolve();
    await el.updateComplete;
  }
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

beforeEach(async () => {
  wsLog.length = 0;
  resetImages();
  __setImageToolsImportForTests();
  await loadImageTools();
  provideSvgImageChunk(onDemandChunks['svg-image']);
  __resetImageClientForTests();
  __resetFramesForTests();
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  TIMING.silent = 0;
  TIMING.background = [];
});
afterEach(() => {
  document.body.innerHTML = '';
  __setLazyImporterForTests('svg-image', undefined);
  __resetImageClientForTests();
  __resetFramesForTests();
  __setImageToolsImportForTests();
  vi.restoreAllMocks();
});

async function pick(field: McLibraryImageField, id: string): Promise<void> {
  field.shadowRoot!.querySelector<HTMLElement>('[data-act=choose]')!.click();
  await settle(field);
  const picker = field.shadowRoot!.querySelector<McImagePicker>('mc-image-picker')!;
  await settle(picker);
  picker.shadowRoot!.querySelector<HTMLElement>(`[data-id=${id}]`)!.click();
  await settle(picker);
  picker.shadowRoot!.querySelector<HTMLElement>('[data-act=use]')!.click();
  await settle(field);
}

describe('an image module', () => {
  it('picks a drawing in the editor and the card draws it, with only the reference in the YAML', async () => {
    const hass = libraryHass();
    let module = { id: 'a', type: 'image', fit: 'contain' } as ImageModuleConfig;
    const box = document.createElement('div');
    document.body.append(box);
    const draw = () => render(imageEditor.general(module, hass, (next) => { module = next as ImageModuleConfig; draw(); }), box);
    draw();
    const field = box.querySelector<McLibraryImageField>('mc-library-image-field')!;
    await settle(field);

    await pick(field, 'plan');

    expect(module.image).toBe('mcu-image:plan');
    expect(module.aspect_ratio).toBe('2:1');
    expect(JSON.stringify(module)).not.toContain('<svg');

    const card = await mountCard(cardConfig([module]), hass);
    const image = card.shadowRoot!.querySelector<HTMLElement & { status: string }>('.mc-image mc-svg-image')!;
    expect(card.shadowRoot!.querySelector<HTMLElement>('.mc-image')!.getAttribute('style')).toContain('aspect-ratio: 2 / 1;');
    await wait(() => image.status === 'ready');
    expect(image.status).toBe('ready');
    expect(image.shadowRoot!.querySelector('.stage > svg path')).not.toBeNull();
    expect(wsLog.some((m) => m.type.endsWith('images_get') && m.ids?.includes('plan'))).toBe(true);
  });

  it('writes the description and the state list the card reads', async () => {
    const hass = libraryHass();
    let module = { id: 'a', type: 'image', image: 'mcu-image:plan', aspect_ratio: '2:1' } as ImageModuleConfig;
    const box = document.createElement('div');
    document.body.append(box);
    const draw = () => render(imageEditor.general(module, hass, (next) => { module = next as ImageModuleConfig; draw(); }), box);
    draw();
    const field = box.querySelector<McLibraryImageField>('mc-library-image-field')!;
    await settle(field);
    const ta = field.shadowRoot!.querySelector<HTMLTextAreaElement>('textarea')!;
    ta.value = 'Floor plan of the ground floor';
    ta.dispatchEvent(new Event('input'));
    expect(module.description).toBe('Floor plan of the ground floor');
    const card = await mountCard(cardConfig([module]), hass);
    const image = card.shadowRoot!.querySelector<HTMLElement>('.mc-image mc-svg-image')!;
    await wait(() => (image as never as { status: string }).status === 'ready');
    expect(image.shadowRoot!.querySelector('svg')!.getAttribute('aria-label')).toBe('Floor plan of the ground floor');
  });
});

describe('a background layer with states', () => {
  it('picks a drawing per state and the card swaps them when the entity changes', async () => {
    const hass = libraryHass();
    const el = document.createElement('mc-bg-layers') as McBgLayers;
    el.hass = hass;
    el.layers = [{ type: 'image', entity: 'sensor.mode', states: { day: '/local/d.jpg', night: '/local/n.jpg' } } as BackgroundLayerConfig];
    el.onWrite = (list) => {
      el.layers = JSON.parse(JSON.stringify(list));
    };
    document.body.append(el);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLElement>('.rhead')!.click();
    await settle(el);

    const fieldFor = (state: string) => el.shadowRoot!.querySelector<McLibraryImageField>(`[data-state=${state}] mc-library-image-field`)!;
    await settle(fieldFor('day'));
    await pick(fieldFor('day'), 'day');
    await settle(el);
    await settle(fieldFor('night'));
    await pick(fieldFor('night'), 'night');
    await settle(el);

    const layer = el.layers![0];
    expect(layer.states).toEqual({ day: 'mcu-image:day', night: 'mcu-image:night' });
    expect(JSON.stringify(layer)).not.toContain('<svg');
    // Repeat is for picture files, not drawings
    expect(el.shadowRoot!.querySelector('select')).toBeNull();

    const card = await mountCard(cardConfig([{ id: 't', type: 'text', text: 'hi' }], { background_layers: [layer] }), hass);
    const drawn = () => [...card.shadowRoot!.querySelector('mc-bg-stack')!.shadowRoot!.querySelectorAll<HTMLElement & { ref: string }>('mc-svg-image')].map((d) => d.ref);
    await wait(() => drawn().length > 0);
    expect(drawn()).toEqual(['mcu-image:day']);

    card.hass = withState(hass, 'sensor.mode', 'night');
    await card.updateComplete;
    await wait(() => drawn().includes('mcu-image:night'));
    expect(drawn()).toContain('mcu-image:night');
  });
});

it('applyKeys keeps the rest of the object and removes undefined keys', () => {
  expect(applyKeys({ a: 1, b: 2 }, { b: undefined, c: 3 })).toEqual({ a: 1, c: 3 });
});
