import { css } from 'lit';
import type { LayerRuntime, LayerSlot } from '../contracts/layer-placement';
import { LAYER_CSS } from './layer-css';
import { isLayered, placementOf, hasLayers, inFlow } from './layer-kind';
import { arrange, resolveLayer, scanFills, scrimCss } from './placement';

/*
 * The layer placement runtime (contract layer-placement 1.0.0) as magic-card.js carries it: the slot
 * holds placement.ts (resolveLayer, arrange, scanFills, scrimCss) and layer-css.ts from the first render,
 * so a layered module never waits for a file. The slot keeps provide() so a test can swap the runtime.
 */

const core: LayerRuntime = { resolveLayer, arrange, scanFills, scrimCss, css: LAYER_CSS };
let runtime: LayerRuntime = core;

export const layerSlot: LayerSlot = {
  provide: (r) => {
    runtime = r;
  },
  get: () => runtime,
};

/** Tests: back to the built-in runtime. */
export function __resetLayerSlotForTests(): void {
  runtime = core;
}

export { isLayered, placementOf, hasLayers, inFlow };

/** The card sets `overflow`: the content is the containing block (FINDINGS #12). */
export const LAYER_SYNC_CSS = css`
.mc-card-content[data-mc-clip]{position:relative}
`;
