import { describe, it, expect, vi, afterEach } from 'vitest';
import { lazyChunks, __setLazyImporterForTests } from '../src/utils/lazy-chunks';
import { prefetchLazy } from '../src/utils/lazy-features';
import {
  LAZY_CHUNK_CEILINGS, LAZY_CHUNK_FILES, LAZY_MODULE_CONTRACT, LAZY_MODULE_TYPES,
} from '../src/contracts/lazy-module';
import type { LazyChunkModule } from '../src/contracts/lazy-module';
import { BUILD_VERSION } from '../src/utils/lazy-chunk';
import { flowLookSlot } from '../src/card/flow-look-slot';
import { sliderLookSlot } from '../src/modules/controls/slider-look-slot';
import * as flowChunk from '../src/flow-look/chunk';
import * as sliderChunk from '../src/slider-look/chunk';

const ok = (): LazyChunkModule => ({ BUILD: BUILD_VERSION, install: () => undefined });

function spy() {
  const flow = vi.fn(async () => ok());
  const slider = vi.fn(async () => ok());
  __setLazyImporterForTests('flow-look', flow);
  __setLazyImporterForTests('slider-look', slider);
  return { flow, slider };
}

afterEach(() => {
  __setLazyImporterForTests('flow-look', undefined);
  __setLazyImporterForTests('slider-look', undefined);
});

describe('lazy-module 1.2.0 tables', () => {
  it('names the two look chunks', () => {
    expect(LAZY_MODULE_CONTRACT).toBe('1.12.0');
    expect(LAZY_CHUNK_FILES['flow-look']).toBe('magic-card-flow-look.js');
    expect(LAZY_CHUNK_FILES['slider-look']).toBe('magic-card-slider-look.js');
    expect(LAZY_CHUNK_CEILINGS['flow-look']).toBe(32_768);
    expect(LAZY_CHUNK_CEILINGS['slider-look']).toBe(28_672);
    expect(Object.keys(LAZY_MODULE_TYPES)).not.toContain('flow-look');
    expect(Object.keys(LAZY_MODULE_TYPES)).not.toContain('slider-look');
    expect(Object.keys(lazyChunks)).toEqual(expect.arrayContaining(['flow-look', 'slider-look']));
  });
});

describe('prefetchLazy for look keys', () => {
  it('loads nothing for configs without look keys', () => {
    const { flow, slider } = spy();
    prefetchLazy({ flows: [{ from: 'a', to: 'b', color: 'red', width: 3 }], rows: [{ columns: [{ modules: [{ type: 'slider', entity: 'light.x', show_value: true, min: 1 }] }] }] });
    expect(flow).not.toHaveBeenCalled();
    expect(slider).not.toHaveBeenCalled();
  });

  it('loads flow-look (after the flows chunk) when a flow has a look key', async () => {
    const { flow, slider } = spy();
    prefetchLazy({ flows: [{ from: 'a', to: 'b' }, { from: 'a', to: 'c', line_style: 'neon' }] });
    await vi.waitFor(() => expect(flow).toHaveBeenCalledTimes(1));
    expect(slider).not.toHaveBeenCalled();
  });

  it('loads slider-look for a nested slider with a look key, not inside card_config', async () => {
    const { flow, slider } = spy();
    prefetchLazy({ rows: [{ columns: [{ modules: [{ type: 'slider', entity: 'light.x', track_style: 'glass' }] }] }] });
    await vi.waitFor(() => expect(slider).toHaveBeenCalledTimes(1));
    expect(flow).not.toHaveBeenCalled();
    const s2 = spy();
    prefetchLazy({ modules: [{ type: 'custom-card', card_config: { type: 'slider', track_style: 'glass', flows: [{ line_style: 'neon' }] } }] });
    expect(s2.slider).not.toHaveBeenCalled();
    expect(s2.flow).not.toHaveBeenCalled();
  });
});

describe('stub chunk entries and slots', () => {
  it('export BUILD and an install that does not throw', () => {
    for (const m of [flowChunk, sliderChunk]) {
      expect(m.BUILD).toBe(BUILD_VERSION);
      expect(() => m.install()).not.toThrow();
    }
  });

  it('slots keep what is provided (the chunks installed by the test setup are cleared first)', () => {
    flowLookSlot.provide(undefined as never);
    sliderLookSlot.provide(undefined as never);
    expect(flowLookSlot.get()).toBeUndefined();
    expect(sliderLookSlot.get()).toBeUndefined();
    const view = { renderPreview: () => ({}) as never };
    sliderLookSlot.provide(view);
    expect(sliderLookSlot.get()).toBe(view);
    sliderLookSlot.provide(undefined as never);
  });
});
