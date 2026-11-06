import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'lit';
import { BUILD } from '../src/image-tools/chunk';
import { __setImageToolsImportForTests, loadImageTools } from '../src/editor/image-tools-loader';
import { imageEditor } from '../src/editor/modules/content/image-editor';
import type { ImageModuleConfig } from '../src/types';

const hass = { states: {}, callWS: async () => ({ images: [] }), user: { is_admin: true } } as never;
const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
  await new Promise((r) => setTimeout(r, 0));
};

function mount(c: Partial<ImageModuleConfig>, onChange = vi.fn()) {
  const box = document.createElement('div');
  document.body.append(box);
  const config = { id: 'i', type: 'image', ...c } as ImageModuleConfig;
  render(imageEditor.general(config, hass, onChange), box);
  return { box, onChange, config };
}

beforeEach(async () => {
  __setImageToolsImportForTests();
  await loadImageTools();
});
afterEach(() => {
  document.body.innerHTML = '';
  __setImageToolsImportForTests();
  vi.restoreAllMocks();
});

describe('the image module editor uses the library image field', () => {
  it('renders <mc-library-image-field> in place of the plain image input, with the module and the image', async () => {
    const { box, config } = mount({ image: 'mcu-image:ground', aspect_ratio: '16:9' });
    const field = box.querySelector('mc-library-image-field') as HTMLElement & { value: string; module: unknown; context: string; hideSource: boolean };
    expect(field).not.toBeNull();
    expect(field.value).toBe('mcu-image:ground');
    expect(field.module).toBe(config);
    expect(field.context).toBe('module');
    expect(field.hideSource).toBe(false);
    expect(box.querySelector(':scope > .mc-tab-content > .mc-field > mc-media-picker')).toBeNull();
  });

  it('applies the keys of an image-change to the module, and removes a key set to undefined', () => {
    const { box, onChange } = mount({ image: 'mcu-image:a', description: 'Plan', colors: { main: '#fff' } });
    const field = box.querySelector('mc-library-image-field')!;
    field.dispatchEvent(new CustomEvent('image-change', { detail: { keys: { image: 'mcu-image:b', aspect_ratio: '4:3', description: undefined } }, bubbles: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const next = onChange.mock.calls[0][0];
    expect(next).toMatchObject({ id: 'i', type: 'image', image: 'mcu-image:b', aspect_ratio: '4:3', colors: { main: '#fff' } });
    expect('description' in next).toBe(false);
  });

  it('hides the image source but keeps the description when the module draws from an entity picture', () => {
    const { box } = mount({ entity: 'image.bell', entity_picture: true });
    const field = box.querySelector('mc-library-image-field') as HTMLElement & { hideSource: boolean };
    expect(field.hideSource).toBe(true);
  });

  it('falls back to the plain address field while the chunk loads and when it cannot load', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(async () => {
      throw new Error('404');
    });
    const { box } = mount({ image: 'https://x/y.png' });
    expect(box.querySelector('mc-media-picker')).not.toBeNull();
    await flush();
    expect(box.querySelector('mc-media-picker')).not.toBeNull();
    expect(box.querySelector('mc-library-image-field')).toBeNull();
  });

  it('hides the plain address field in the fallback for an entity picture, as before', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(async () => {
      throw new Error('404');
    });
    const { box } = mount({ entity: 'image.bell', entity_picture: true });
    await flush();
    expect(box.querySelector('mc-media-picker')).toBeNull();
  });

  it('keeps the other fields of the editor', () => {
    const { box } = mount({ image: 'mcu-image:ground' });
    expect(box.textContent).toContain('Aspect ratio');
    expect(box.textContent).toContain('Fit');
    void BUILD;
  });
});
