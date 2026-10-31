import type { Arranged } from '../contracts/layer-placement';
import { childSlots } from '../utils/module-path';
import type { CardModule } from '../types';

// What a module's `placement` says (contract layer-placement): the checks that placement.ts, the slot and the card's
// config walks share. No runtime, no CSS.

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
