import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '../src/index';
import { __setLazyImporterForTests, onDemandChunks } from '../src/utils/lazy-chunks';
import { TIMING } from '../src/utils/lazy-chunk';
import { BG_LAYER_STATUS_EVENT } from '../src/contracts/bg-stack.needs';
import { IMAGE_REF_PREFIX } from '../src/contracts/svg-image';
import * as imageChunk from '../src/svg-image/chunk';
import { createStackHost } from '../src/layers/stack-host';
import { needSvgImage, provideSvgImageChunk } from '../src/utils/svg-image-loader';

// The card entry side of library images: the loader slot and the bg-stack host's needImage().

afterEach(() => provideSvgImageChunk(undefined));

describe('needSvgImage', () => {
  it('starts the chunk and tells the render it was met', () => {
    const load = vi.fn(() => Promise.resolve(true));
    provideSvgImageChunk({ load });
    const metChunk = vi.fn();
    needSvgImage({ metChunk });
    expect(load).toHaveBeenCalledTimes(1);
    expect(metChunk).toHaveBeenCalledWith('svg-image');
  });

  it('does nothing and does not throw with an empty slot or no context', () => {
    expect(() => needSvgImage(undefined)).not.toThrow();
    const metChunk = vi.fn();
    needSvgImage({ metChunk });
    expect(metChunk).toHaveBeenCalledWith('svg-image');
  });
});

describe('bg-stack host needImage', () => {
  it('goes through the card render context', () => {
    const load = vi.fn(() => Promise.resolve(true));
    provideSvgImageChunk({ load });
    const metChunk = vi.fn();
    const host = createStackHost({ renderRoot: document.createElement('div') }, () => ({ metChunk }) as never, () => false);
    host.needImage();
    expect(load).toHaveBeenCalledTimes(1);
    expect(metChunk).toHaveBeenCalledWith('svg-image');
  });
});

describe('a card with a background layer', () => {
  type CardEl = HTMLElement & { setConfig(c: unknown): void; updateComplete: Promise<boolean> };
  const frame = () => new Promise((r) => setTimeout(r, 40));
  const card = async (image: string): Promise<CardEl> => {
    const el = document.createElement('magic-card') as CardEl;
    el.setConfig({ type: 'custom:magic-card', background_layers: [{ type: 'image', image }], rows: [{ columns: [{ modules: [{ type: 'text', text: 'Hello' }] }] }] });
    document.body.append(el);
    await el.updateComplete;
    for (let i = 0; i < 4; i++) {
      await frame();
      await el.updateComplete;
    }
    return el;
  };
  beforeEach(() => {
    provideSvgImageChunk(onDemandChunks['svg-image']);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    TIMING.silent = 0;
    TIMING.background = [];
  });
  afterEach(() => {
    document.body.replaceChildren();
    __setLazyImporterForTests('svg-image', undefined);
    vi.restoreAllMocks();
  });

  it('is in the chunk table as an on-demand chunk', () => {
    expect(onDemandChunks['svg-image'].name).toBe('svg-image');
  });

  it('a picture makes no request for the chunk and shows no notice', async () => {
    const importer = vi.fn(async () => imageChunk);
    __setLazyImporterForTests('svg-image', importer);
    const el = await card('/local/a.jpg');
    expect(importer).not.toHaveBeenCalled();
    expect(el.shadowRoot!.querySelector('.mc-n')).toBeNull();
  });

  it('a library reference starts the chunk once', async () => {
    const importer = vi.fn(async () => imageChunk);
    __setLazyImporterForTests('svg-image', importer);
    const el = await card('mcu-image:plan');
    expect(importer).toHaveBeenCalledTimes(1);
    expect(onDemandChunks['svg-image'].ready()).toBe(true);
    expect(el.shadowRoot!.querySelector('.mc-n')).toBeNull();
  });

  it('a failed load shows the chunk notice and the rest of the card', async () => {
    __setLazyImporterForTests('svg-image', () => Promise.reject(new Error('404')));
    const el = await card('mcu-image:plan');
    expect(onDemandChunks['svg-image'].failed()).toBe(true);
    const content = el.shadowRoot!.querySelector('.mc-card-content')!;
    expect(content.textContent).toContain('Hello');
    expect(content.querySelector('.mc-n')).not.toBeNull();
  });
});

describe('the prefix the entry tests', () => {
  it('is the contract prefix, and the entry does not import the contract file', () => {
    const src = readFileSync(resolve(__dirname, '../src/layers/stack/mc-bg-stack.ts'), 'utf8');
    expect(src).toContain(`startsWith('${IMAGE_REF_PREFIX}')`);
    expect(src).not.toMatch(/from '[./]*\/contracts\/svg-image'/);
  });
});

describe('the drawing element and the entry scope', () => {
  it('writes the layer status event name out, as the contract names it', () => {
    const src = readFileSync(resolve(__dirname, '../src/svg-image/mc-svg-image.ts'), 'utf8');
    expect(src).toContain(`const BG_LAYER_STATUS_EVENT = '${BG_LAYER_STATUS_EVENT}'`);
    expect(src).not.toMatch(/import \{[^}]*BG_LAYER_STATUS_EVENT[^}]*\} from/);
  });
});

describe('plain keys: a library image value in a background layer', () => {
  const keys = JSON.parse(readFileSync(resolve(__dirname, '../tools/plain-keys.json'), 'utf8'));
  const classify = async (layer: Record<string, unknown>) =>
    (await import('../tools/classify-gallery.mjs' as string)).classifyConfig({ type: 'custom:magic-card', background_layers: [{ type: 'image', ...layer }] }, keys);

  it('a picture stays plain', async () => {
    expect((await classify({ image: '/local/a.jpg' })).class).toBe('plain');
    expect((await classify({ states: { on: '/local/a.jpg' }, image: 'media-source://x' })).class).toBe('plain');
  });

  it.each([
    ['image', { image: 'mcu-image:plan' }],
    ['a state value', { image: '/local/a.jpg', states: { night: 'mcu-image:moon' } }],
  ])('%s is the svg-image feature', async (_n, layer) => {
    const r = await classify(layer);
    expect(r.class).toBe('feature');
    expect(r.chunks).toEqual(['svg-image']);
    expect(r.reserve_kind).toBe('none');
    expect(r.unknown_keys).toEqual([]);
  });
});
