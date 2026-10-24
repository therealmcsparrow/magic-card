import { describe, it, expect, vi, afterEach } from 'vitest';
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
