import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/editor/layers/bg-layers';
import type { McBgLayers } from '../src/editor/layers/bg-layers';
import { clearStatuses, setStatus } from '../src/editor/layers/bg-status';
import { statusSentence } from '../src/editor/layers/bg-layers-ops';
import { __setImageToolsImportForTests, loadImageTools } from '../src/editor/image-tools-loader';
import type { BackgroundLayerConfig, BgLayerStatus } from '../src/contracts/bg-stack';

const img = (o: Partial<BackgroundLayerConfig> = {}): BackgroundLayerConfig => ({ type: 'image', ...o }) as BackgroundLayerConfig;
const mounted: HTMLElement[] = [];

beforeEach(async () => {
  clearStatuses();
  __setImageToolsImportForTests();
  await loadImageTools();
});
afterEach(() => {
  mounted.splice(0).forEach((e) => e.remove());
  clearStatuses();
  __setImageToolsImportForTests();
  vi.restoreAllMocks();
});

async function open(layer: BackgroundLayerConfig) {
  const el = document.createElement('mc-bg-layers') as McBgLayers;
  el.layers = [layer];
  el.onWrite = (list) => {
    el.layers = JSON.parse(JSON.stringify(list));
  };
  document.body.append(el);
  mounted.push(el);
  await el.updateComplete;
  el.shadowRoot!.querySelector<HTMLElement>('.rhead')!.click();
  await el.updateComplete;
  await el.updateComplete;
  return { el, root: el.shadowRoot!, layer: () => el.layers![0] };
}
const fields = (root: ParentNode) => [...root.querySelectorAll<HTMLElement & { value: string; context: string; compact: boolean }>('mc-library-image-field')];
const change = (field: HTMLElement, keys: Record<string, unknown>) => field.dispatchEvent(new CustomEvent('image-change', { detail: { keys }, bubbles: true, composed: true }));
const settle = async (el: McBgLayers) => {
  await el.updateComplete;
  await el.updateComplete;
};

describe('the One picture source', () => {
  it('uses the library image field in the background context and writes the reference', async () => {
    const r = await open(img({ image: '/local/a.jpg' }));
    const [f] = fields(r.root);
    expect(fields(r.root)).toHaveLength(1);
    expect(f.context).toBe('background');
    expect(f.compact).toBe(false);
    expect(f.value).toBe('/local/a.jpg');
    change(f, { image: 'mcu-image:ground' });
    await settle(r.el);
    expect(r.layer().image).toBe('mcu-image:ground');
    expect(r.root.querySelector('mc-media-picker')).toBeNull();
  });

  it('clearing removes the key', async () => {
    const r = await open(img({ image: 'mcu-image:ground' }));
    change(fields(r.root)[0], { image: '' });
    await settle(r.el);
    expect(r.layer()).not.toHaveProperty('image');
  });

  it('falls back to the plain media picker when the chunk cannot load', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(async () => {
      throw new Error('404');
    });
    const r = await open(img({ image: '/local/a.jpg' }));
    expect(r.root.querySelector('mc-media-picker')).not.toBeNull();
    expect(fields(r.root)).toHaveLength(0);
  });
});

describe('Changes with state', () => {
  const states = () => img({ entity: 'weather.home', states: { sunny: 'mcu-image:sun', rainy: '/local/r.jpg' }, image: 'mcu-image:other' });

  it('puts a compact field on every row and on Any other state', async () => {
    const r = await open(states());
    const all = fields(r.root);
    expect(all).toHaveLength(3);
    expect(all.every((f) => f.compact && f.context === 'background')).toBe(true);
    expect(all.map((f) => f.value)).toEqual(['mcu-image:sun', '/local/r.jpg', 'mcu-image:other']);
  });

  it('writes a row from its field, and Any other state to image', async () => {
    const r = await open(states());
    const [sunny, , other] = fields(r.root);
    change(sunny, { image: 'mcu-image:moon' });
    await settle(r.el);
    expect(r.layer().states).toEqual({ sunny: 'mcu-image:moon', rainy: '/local/r.jpg' });
    change(fields(r.root)[2], { image: 'mcu-image:sun' });
    await settle(r.el);
    expect(r.layer().image).toBe('mcu-image:sun');
    void other;
  });

  it('asks the first row to say, once, when to use states and when to use live parts', async () => {
    const r = await open(states());
    expect(fields(r.root).map((f) => (f as never as { statesHint: boolean }).statesHint)).toEqual([true, false, false]);
  });

  it('asks Any other state when there are no rows, and nothing without a library image', async () => {
    const r = await open(img({ entity: 'weather.home', states: {}, image: 'mcu-image:other' }));
    expect(fields(r.root).map((f) => (f as never as { statesHint: boolean }).statesHint)).toEqual([true]);
    const plain = await open(img({ entity: 'weather.home', states: { sunny: '/local/s.jpg' } }));
    expect(fields(plain.root).map((f) => (f as never as { statesHint: boolean }).statesHint)).toEqual([false, false]);
  });
});

describe('Repeat is for pictures only', () => {
  const sizeContain = async (layer: BackgroundLayerConfig) => {
    const r = await open({ ...layer, size: 'contain' });
    return r;
  };
  it('is shown for a picture file and hidden for a library image', async () => {
    const file = await sizeContain(img({ image: '/local/a.jpg' }));
    expect(file.root.querySelector('select')).not.toBeNull();
    const lib = await sizeContain(img({ image: 'mcu-image:ground' }));
    expect(lib.root.querySelector('select')).toBeNull();
    expect(lib.root.textContent).not.toContain('Repeat');
  });

  it('is hidden when any state picture is a library image', async () => {
    const r = await sizeContain(img({ entity: 'weather.home', states: { sunny: 'mcu-image:sun' }, image: '/local/o.jpg' }));
    expect(r.root.querySelector('select')).toBeNull();
  });

  it('still offers position and size for a library image', async () => {
    const r = await sizeContain(img({ image: 'mcu-image:ground' }));
    expect(r.root.querySelector('mc-anchor-grid')).not.toBeNull();
    expect(r.root.querySelector('[data-seg=size]')).not.toBeNull();
  });
});

describe('the studio sentence for a missing image', () => {
  const s = (o: Partial<BgLayerStatus>): BgLayerStatus => ({ index: 0, status: 'error', ...o });
  it('maps image-missing', () => {
    expect(statusSentence(s({ reason: 'image-missing' }), img())).toBe('This image is no longer in the library.');
  });

  it('shows it on the layer row with the Problem chip', async () => {
    const r = await open(img({ image: 'mcu-image:gone' }));
    setStatus(s({ reason: 'image-missing' }));
    await settle(r.el);
    expect(r.root.textContent).toContain('This image is no longer in the library.');
    expect(r.root.textContent).toContain('Problem');
  });
});
