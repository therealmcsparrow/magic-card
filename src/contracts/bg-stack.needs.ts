// bg-stack, what magic-card.js needs at run time. It sits in this file, not in bg-stack.ts, because the entry may
// import only *.needs.ts of a contract (see tools/check-entry-graph.mjs); bg-stack.ts re-exports the constants.

export const MAX_BACKGROUND_LAYERS = 4;
export const BG_LAYER_STATUS_EVENT = 'mc-bg-layer-status';

const ENTITY = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const MAX_RULES = 32;

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

/** An image layer that moves (`pan_zoom` object) or follows a camera snapshot (`camera.*` entity, no `states`). */
function movingLayer(layer: unknown): boolean {
  if (!isObj(layer) || layer.type !== 'image') return false;
  if (isObj(layer.pan_zoom)) return true;
  const e = layer.entity;
  return typeof e === 'string' && ENTITY.test(e) && e.startsWith('camera.') && (layer.states === undefined || layer.states === null);
}

const anyMoving = (list: unknown): boolean => Array.isArray(list) && list.slice(0, MAX_BACKGROUND_LAYERS).some(movingLayer);

/**
 * The backdrop needs the 'layers' chunk: some `background_layers` entry, in the card or in a
 * `conditional_appearance` override, hidden entries included, moves. Pan and zoom counts under
 * `layers_low_power` too, because the resting frame is the scaled start framing.
 */
export function wantsBgFx(config: unknown): boolean {
  try {
    if (!isObj(config)) return false;
    if (anyMoving(config.background_layers)) return true;
    const rules = config.conditional_appearance;
    return Array.isArray(rules) && rules.slice(0, MAX_RULES).some((r) => isObj(r) && isObj(r.overrides) && anyMoving(r.overrides.background_layers));
  } catch {
    return false;
  }
}
