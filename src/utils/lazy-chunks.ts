import type { LazyChunkName } from '../contracts/lazy-module';
import { hasLayers } from '../layers/layer-slot';
import { ModuleRegistry } from '../modules/module-registry';
import type { CardModule } from '../types';
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
  // <mc-bg-stack>, the card backdrop (background-layers T5, ADR 0038)
  layers: lazyChunk('layers', () => import(/* webpackChunkName: "layers" */ '../layers/stack/chunk')),
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

const nonEmpty = (v: unknown): boolean => Array.isArray(v) && v.length > 0;

/** The card has a backdrop (`background_layers`, or a conditional appearance rule that sets it) or any layered module. */
export function wantsLayers(config: unknown): boolean {
  const c = config as { background_layers?: unknown; conditional_appearance?: unknown; rows?: Array<{ columns?: Array<{ modules?: CardModule[] }> } | null> } | null;
  if (!c || typeof c !== 'object') return false;
  if (nonEmpty(c.background_layers)) return true;
  if (Array.isArray(c.rows) && c.rows.some((r) => Array.isArray(r?.columns) && r!.columns!.some((col) => hasLayers(col?.modules ?? [])))) return true;
  const rules = c.conditional_appearance;
  return Array.isArray(rules) && rules.slice(0, 32).some((r) => nonEmpty((r as { overrides?: { background_layers?: unknown } } | null)?.overrides?.background_layers));
}

/**
 * Start every chunk this card config needs, at once (nested lazy modules never wait on their
 * parent): the chunks of the lazy module types in it, and the seasonal chunk for a `seasonal`
 * setting or a seasonal animation preset. Called by setConfig and after the template merge.
 */
export function prefetchLazy(config: unknown): void {
  if (!config || typeof config !== 'object' || seen.has(config)) return;
  seen.add(config);
  ModuleRegistry.prefetch(config);
  if (wantsSeasonal(config)) void lazyChunks.seasonal.load();
  if (wantsLayers(config)) void lazyChunks.layers.load();
}

/** Tests: replace one chunk import (undefined restores it) and forget its state. */
export function __setLazyImporterForTests(name: LazyChunkName, importer: LazyImporter | undefined): void {
  lazyChunks[name].__reset(importer);
}

/** Tests (vitest setup): load and install every chunk so renderPreview output stays synchronous. */
export async function __loadAllLazyChunksForTests(): Promise<void> {
  await Promise.all(Object.values(lazyChunks).map((c) => c.load()));
}
