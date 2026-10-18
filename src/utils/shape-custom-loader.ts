import { useCustomBuilder } from './shape-path';
import { sameBuild } from './build-version';

/*
 * The `shape: custom` builder (src/utils/shape-custom.ts) is a lazy chunk, dist/magic-card-shape-custom.js
 * (ADR 0021). A card that uses a custom shape starts the load; until the builder is registered the
 * element renders as `shape: none`, and the card re-renders once when the load resolves. When the load
 * fails (one console warning, no retry until the page reloads) the element stays unshaped.
 */

let pending: Promise<boolean> | undefined;
let ready = false;

/** Load the builder chunk once and register it; resolves false (and warns once) when it cannot be loaded. */
export function loadCustomShapes(): Promise<boolean> {
  pending ??= import(/* webpackChunkName: "shape-custom" */ './shape-custom').then(
    (m) => {
      // a cached older magic-card.js must not run a newer builder: warned once, the element stays unshaped
      if (!sameBuild('magic-card-shape-custom.js', m)) return false;
      useCustomBuilder(m.buildCustom);
      return (ready = true);
    },
    (err: unknown) => {
      console.warn('Magic Card: magic-card-shape-custom.js did not load', err);
      return false;
    },
  );
  return pending;
}

/** The builder is registered (never starts a load). */
export const customShapesReady = (): boolean => ready;

/** Tests: forget the load and the registered builder. */
export function __resetCustomShapesForTests(): void {
  pending = undefined;
  ready = false;
  useCustomBuilder(undefined);
}
