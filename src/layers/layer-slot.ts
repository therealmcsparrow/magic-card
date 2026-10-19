import { css } from 'lit';
import type { Arranged, LayerRuntime, LayerSlot } from '../contracts/layer-placement';
import { childSlots } from '../utils/module-path';
import type { CardModule } from '../types';

/*
 * The sync half of layer placement (contract layer-placement 1.0.0 r3), the only part of it in
 * magic-card.js: the slot the 'layers' chunk fills from install(), the two checks that need no
 * runtime, and the two CSS rules that must hold before the chunk lands. placement.ts and
 * layer-css.ts live in the chunk; nothing outside src/layers/stack/chunk.ts imports them.
 */

let runtime: LayerRuntime | undefined;

export const layerSlot: LayerSlot = {
  provide: (r) => {
    runtime = r;
  },
  get: () => runtime,
};

/** Tests: forget the runtime (the chunk fills it again on install). */
export function __resetLayerSlotForTests(): void {
  runtime = undefined;
}

/** `placement` as a module carries it: background / overlay, else undefined (flow, unknown values). */
export const placementOf = (mod: unknown): 'background' | 'overlay' | undefined => {
  const p = (mod as { placement?: unknown } | null | undefined)?.placement;
  return p === 'background' || p === 'overlay' ? p : undefined;
};

/** The module sits behind others or on top (an explicit `placement`). */
export const isLayered = (mod: unknown): boolean => !!placementOf(mod);

/** Any module, at any depth, sits behind others or on top (prefetch and gating). */
export function hasLayers(modules: readonly CardModule[], seen = new Set<unknown>()): boolean {
  if (!Array.isArray(modules) || seen.size > 2000) return false;
  return modules.some((m) => {
    if (seen.has(m)) return false;
    seen.add(m);
    return isLayered(m) || (childSlots(m) ?? []).some((s) => hasLayers(s, seen));
  });
}

/** The children as they are, in config order: what a container renders while the slot is empty. */
export const inFlow = (children: readonly CardModule[]): Arranged => ({
  front: children.map((child, index) => ({ child, index })),
  backgrounds: [],
  hoisted: [],
  layered: false,
});

/*
 * 1 A layered wrapper before the chunk lands: out of flow and invisible, so it takes no space and
 *   nothing flashes (siblings sit where they will stay).
 * 2 The card sets `overflow`: the content is the containing block (FINDINGS #12).
 */
export const LAYER_SYNC_CSS = css`
.mc-module-wrapper[data-mc-layer-pending]{position:absolute;visibility:hidden}
.mc-card-content[data-mc-clip]{position:relative}
`;
