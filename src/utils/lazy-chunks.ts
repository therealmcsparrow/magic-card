import type { LazyChunkName } from '../contracts/lazy-module';
import { ModuleRegistry } from '../modules/module-registry';
import { hasFlowLook } from '../contracts/flow-look';
import { hasSliderLook } from '../contracts/slider-look';
import { getAnimationPreset } from './animation-presets';
import { lazyChunk, type LazyChunkControl, type LazyImporter } from './lazy-chunk';

/*
 * The chunk table: one lazyChunk() per LazyChunkName, each with its literal import(). Nothing else
 * calls import() for these entries (contract lazy-module 1.0.0). Output file names come from the
 * webpackChunkName: dist/magic-card-<name>.js.
 */

export const lazyChunks: Record<LazyChunkName, LazyChunkControl> = {
  slider: lazyChunk('slider', () => import(/* webpackChunkName: "slider" */ '../modules/lazy/slider-chunk')),
  seasonal: lazyChunk('seasonal', () => import(/* webpackChunkName: "seasonal" */ '../card/seasonal-chunk')),
  markdown: lazyChunk('markdown', () => import(/* webpackChunkName: "markdown" */ '../modules/lazy/markdown-chunk')),
  'modules-extra': lazyChunk('modules-extra', () => import(/* webpackChunkName: "modules-extra" */ '../modules/lazy/extras-chunk')),
  'flow-look': lazyChunk('flow-look', () => import(/* webpackChunkName: "flow-look" */ '../flow-look/chunk')),
  'slider-look': lazyChunk('slider-look', () => import(/* webpackChunkName: "slider-look" */ '../slider-look/chunk')),
};

/** window.MagicCard.loadSeasonal: true once <mc-seasonal> and <mc-seasonal-deco> are defined. */
export const loadSeasonal = (): Promise<boolean> => lazyChunks.seasonal.load();

const seen = new WeakSet<object>();

const wantsSeasonal = (node: unknown, visited = new Set<unknown>()): boolean => {
  if (!node || typeof node !== 'object' || visited.has(node)) return false;
  visited.add(node);
  if (Array.isArray(node)) return node.some((n) => wantsSeasonal(n, visited));
  for (const [key, value] of Object.entries(node)) {
    if (key === 'card_config') continue;
    if (key === 'seasonal' && value) return true;
    if (key === 'preset' && typeof value === 'string' && getAnimationPreset(value)?.seasonal) return true;
    if (value && typeof value === 'object' && wantsSeasonal(value, visited)) return true;
  }
  return false;
};

type Obj = Record<string, unknown>;
type Wanted = { flow: boolean; slider: boolean };

/** (1.2.0) Same walk as wantsSeasonal: a `flows` entry with a look key, a `slider` module with one. */
const wantsLooks = (node: unknown, found: Wanted = { flow: false, slider: false }, visited = new Set<unknown>()): Wanted => {
  if (!node || typeof node !== 'object' || visited.has(node) || (found.flow && found.slider)) return found;
  visited.add(node);
  if (Array.isArray(node)) {
    for (const n of node) wantsLooks(n, found, visited);
    return found;
  }
  if ((node as Obj).type === 'slider' && hasSliderLook(node as Obj)) found.slider = true;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'card_config') continue;
    if (key === 'flows' && Array.isArray(value) && value.some((f) => !!f && typeof f === 'object' && hasFlowLook(f as Obj))) found.flow = true;
    if (value && typeof value === 'object') wantsLooks(value, found, visited);
  }
  return found;
};

/**
 * Start every chunk this card config needs, at once (nested lazy modules never wait on their
 * parent): the chunks of the lazy module types in it, the seasonal chunk for a `seasonal`
 * setting or a seasonal animation preset, and the flow-look / slider-look chunks for look keys. Called by setConfig and after the template merge.
 */
export function prefetchLazy(config: unknown): void {
  if (!config || typeof config !== 'object' || seen.has(config)) return;
  seen.add(config);
  ModuleRegistry.prefetch(config);
  if (wantsSeasonal(config)) void lazyChunks.seasonal.load();
  const looks = wantsLooks(config);
  if (looks.flow) void lazyChunks['flow-look'].load();
  if (looks.slider) void lazyChunks['slider-look'].load();
}

/** Tests: replace one chunk import (undefined restores it) and forget its state. */
export function __setLazyImporterForTests(name: LazyChunkName, importer: LazyImporter | undefined): void {
  lazyChunks[name].__reset(importer);
}

/** Tests (vitest setup): load and install every chunk so renderPreview output stays synchronous. */
export async function __loadAllLazyChunksForTests(): Promise<void> {
  await Promise.all(Object.values(lazyChunks).map((c) => c.load()));
}
