import type { LazyChunkName, LazyFeature, NeedsCheck } from '../contracts/lazy-module';
import { wantsPopup } from './popup';
import { wantsPause } from '../contracts/card-pause.needs';
import { wantsBgFx } from '../contracts/bg-stack.needs';
import { wantsDecor } from './decor.needs';
import { hasFlowLook } from '../contracts/flow-look.needs';
import { hasSliderLook } from '../contracts/slider-look.needs';
import { CONTROL_MODULE_TYPES } from '../modules/controls/controls.needs';
import { hasAnimations } from './animation.needs';
import { hasFlows } from './flows.needs';
import { SEASONAL_PRESET_IDS } from './seasonal.needs';
import { wantsSvgIcon } from '../icons/needs';
import { configHas } from './config-walk';
import { lazyChunks } from './lazy-chunks';

/** The needs table (contract lazy-module 1.4.0): one row per card chunk, read from the card config only. */

type Obj = Record<string, unknown>;

const row = (chunk: LazyChunkName, needs: NeedsCheck): LazyFeature => ({ chunk, needs });
/** The config holds a module of one of these types, at any depth (the lazy module chunks). */
const ofType =
  (...types: string[]): NeedsCheck =>
  (config) =>
    configHas(config, (n) => typeof n.type === 'string' && types.includes(n.type));

/** Like ofType, but a background layer of the same name (an image layer) is not a module, so `background_layers` is not searched. */
const modulesOutsideLayers =
  (...types: string[]): NeedsCheck =>
  (config) =>
    configHas(config, (n) => typeof n.type === 'string' && types.includes(n.type), ['background_layers']);

/** The backdrop moves: a pan / zoom or camera image layer (src/contracts/bg-stack.needs.ts). */
export const wantsLayers: NeedsCheck = wantsBgFx;

/** Module types per lazy module chunk; tests compare these with LAZY_MODULE_TYPES in the contract. */
export const LAZY_FEATURES: Record<LazyChunkName, LazyFeature> = {
  slider: row('slider', ofType('slider-layout')),
  markdown: row('markdown', ofType('markdown')),
  controls: row('controls', ofType(...CONTROL_MODULE_TYPES)),
  'modules-extra': row('modules-extra', (config) => ofType('camera', 'video-bg', 'weather', 'forecast', 'graphs', 'custom-card', 'tabs')(config) || modulesOutsideLayers('clock', 'image')(config)),
  // a `seasonal` setting or a seasonal animation preset
  seasonal: row('seasonal', (c) => configHas(c, (n) => n.seasonal || (typeof n.preset === 'string' && SEASONAL_PRESET_IDS.includes(n.preset)))),
  // a `flows` list with an entry
  flows: row('flows', (c) => configHas(c, hasFlows)),
  // `pause_button` auto or always
  pause: row('pause', wantsPause),
  // `popup.enabled` is true
  popup: row('popup', wantsPopup),
  // a ring, shape or value background, or a ring animation preset
  decor: row('decor', (c) => configHas(c, wantsDecor)),
  'flow-look': row('flow-look', (c) => configHas(c, (n) => Array.isArray(n.flows) && n.flows.some((f) => !!f && typeof f === 'object' && hasFlowLook(f as Obj)))),
  'slider-look': row('slider-look', (c) => configHas(c, (n) => n.type === 'slider' && hasSliderLook(n))),
  layers: row('layers', wantsLayers),
  // custom_icons, icon_fx, svg, or an icon that is not a plain MDI id (src/icons/needs.ts)
  'svg-icon': row('svg-icon', wantsSvgIcon),
  // a design with animations, at any depth, in `hover` or in a `conditional` design (src/utils/animation.needs.ts)
  anim: row('anim', (c) => configHas(c, hasAnimations)),
  // the card is linked to a template (card level only)
  templates: row('templates', (c) => {
    try {
      const t = (c as Obj).template;
      return typeof t === 'string' && t !== '';
    } catch {
      return false;
    }
  }),
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
