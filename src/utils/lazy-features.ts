import type { LazyChunkName, LazyFeature, NeedsCheck } from '../contracts/lazy-module';
import type { CardModule } from '../types';
import { hasFlowLook } from '../contracts/flow-look.needs';
import { hasSliderLook } from '../contracts/slider-look.needs';
import { hasLayers } from '../layers/layer-slot';
import { SEASONAL_PRESET_IDS } from './seasonal.needs';
import { configHas } from './config-walk';
import { lazyChunks } from './lazy-chunks';

/*
 * The needs table (contract lazy-module 1.4.0 "needs(config)"): one row per card chunk. A row's needs() reads
 * the card config only (proj.M13), never hass, the DOM, the date or chunk state; it is total (a throw is false).
 * prefetchLazy loads every chunk whose row says yes, all at once. The predicates still import their key lists
 * from the contracts and the preset table; S1a.2 and S1a.3 move them to *.needs.ts files.
 */

type Obj = Record<string, unknown>;

const row = (chunk: LazyChunkName, needs: NeedsCheck): LazyFeature => ({ chunk, needs });
/** The config holds a module of one of these types, at any depth (the lazy module chunks). */
const ofType =
  (...types: string[]): NeedsCheck =>
  (config) =>
    configHas(config, (n) => typeof n.type === 'string' && types.includes(n.type));

const nonEmpty = (v: unknown): boolean => Array.isArray(v) && v.length > 0;

/** The card has a backdrop (`background_layers`, or a conditional appearance rule that sets it) or any layered module. */
export function wantsLayers(config: unknown): boolean {
  const c = config as { background_layers?: unknown; conditional_appearance?: unknown; rows?: Array<{ columns?: Array<{ modules?: CardModule[] }> } | null> } | null;
  try {
    if (!c || typeof c !== 'object') return false;
    if (nonEmpty(c.background_layers)) return true;
    if (Array.isArray(c.rows) && c.rows.some((r) => Array.isArray(r?.columns) && r!.columns!.some((col) => hasLayers(col?.modules ?? [])))) return true;
    const rules = c.conditional_appearance;
    return Array.isArray(rules) && rules.slice(0, 32).some((r) => nonEmpty((r as { overrides?: { background_layers?: unknown } } | null)?.overrides?.background_layers));
  } catch {
    return false; // a needs() never throws (lazy-module 1.4.0)
  }
}

/** Module types per lazy module chunk; tests compare these with LAZY_MODULE_TYPES in the contract. */
export const LAZY_FEATURES: Record<LazyChunkName, LazyFeature> = {
  slider: row('slider', ofType('slider-layout')),
  markdown: row('markdown', ofType('markdown')),
  'modules-extra': row('modules-extra', ofType('camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card')),
  // a `seasonal` setting or a seasonal animation preset
  seasonal: row('seasonal', (c) => configHas(c, (n) => n.seasonal || (typeof n.preset === 'string' && SEASONAL_PRESET_IDS.includes(n.preset)))),
  'flow-look': row('flow-look', (c) => configHas(c, (n) => Array.isArray(n.flows) && n.flows.some((f) => !!f && typeof f === 'object' && hasFlowLook(f as Obj)))),
  'slider-look': row('slider-look', (c) => configHas(c, (n) => n.type === 'slider' && hasSliderLook(n))),
  layers: row('layers', wantsLayers),
};

const seen = new WeakSet<object>();

/**
 * Start every chunk this card config needs, at once (nested lazy modules never wait on their parent). Called by
 * setConfig and after the template merge, once per config object.
 */
export function prefetchLazy(config: unknown): void {
  if (!config || typeof config !== 'object' || seen.has(config)) return;
  seen.add(config);
  for (const f of Object.values(LAZY_FEATURES)) if (f.needs(config)) void lazyChunks[f.chunk].load();
}
