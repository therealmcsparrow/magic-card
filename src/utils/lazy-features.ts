import type { LazyChunkName, LazyFeature, NeedsCheck } from '../contracts/lazy-module';
import type { CardModule } from '../types';
import { wantsPopup } from './popup';
import { wantsPause } from '../contracts/card-pause.needs';
import { hasFlowLook } from '../contracts/flow-look.needs';
import { hasSliderLook } from '../contracts/slider-look.needs';
import { CONTROL_MODULE_TYPES } from '../modules/controls/controls.needs';
import { hasLayers } from '../layers/layer-slot';
import { hasAnimations } from './animation.needs';
import { hasFlows } from './flows.needs';
import { SEASONAL_PRESET_IDS } from './seasonal.needs';
import { wantsSvgIcon } from '../icons/needs';
import { configHas } from './config-walk';
import { lazyChunks } from './lazy-chunks';

/*
 * The needs table (contract lazy-module 1.4.0 "needs(config)"): one row per card chunk. A row's needs() reads
 * the card config only, never hass, the DOM, the date or chunk state; it is total (a throw is false).
 * prefetchLazy loads every chunk whose row says yes, all at once. The predicates read their key lists and the
 * preset ids from the *.needs.ts files, so this table pulls in none of the chunks' own code.
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
  controls: row('controls', ofType(...CONTROL_MODULE_TYPES)),
  'modules-extra': row('modules-extra', ofType('camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card', 'tabs')),
  // a `seasonal` setting or a seasonal animation preset
  seasonal: row('seasonal', (c) => configHas(c, (n) => n.seasonal || (typeof n.preset === 'string' && SEASONAL_PRESET_IDS.includes(n.preset)))),
  // a `flows` list with an entry
  flows: row('flows', (c) => configHas(c, hasFlows)),
  // `pause_button` auto or always
  pause: row('pause', wantsPause),
  // `popup.enabled` is true
  popup: row('popup', wantsPopup),
  'flow-look': row('flow-look', (c) => configHas(c, (n) => Array.isArray(n.flows) && n.flows.some((f) => !!f && typeof f === 'object' && hasFlowLook(f as Obj)))),
  'slider-look': row('slider-look', (c) => configHas(c, (n) => n.type === 'slider' && hasSliderLook(n))),
  layers: row('layers', wantsLayers),
  // custom_icons, icon_fx, svg, or an icon that is not a plain MDI id (src/icons/needs.ts)
  'svg-icon': row('svg-icon', wantsSvgIcon),
  // a design with animations, at any depth, in `hover` or in a `conditional` design (src/utils/animation.needs.ts)
  anim: row('anim', (c) => configHas(c, hasAnimations)),
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
