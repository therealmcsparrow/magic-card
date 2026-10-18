import type { CustomShapeOptions, ShapeLookup } from '../contracts/custom-shape';

/*
 * `shape: custom` reference resolution and the option merge. These stay in magic-card.js (the template
 * merge and the first-paint inline copy need them synchronously); the builder is a lazy chunk
 * (src/utils/shape-custom.ts, ADR 0021).
 */

/** The last merge per local options object: the same (options, base) pair gives the same object, so memo keys can be cached. */
const merged = new WeakMap<object, [base: CustomShapeOptions, out: CustomShapeOptions]>();

/** Library copy first (when the provider has it), else the card's inline copy; local options on top. */
export function resolveCustomShape(o: CustomShapeOptions, lookup?: ShapeLookup): CustomShapeOptions {
  if (!o.ref) return o;
  const base = (lookup?.library(o.ref) ?? lookup?.inline(o.ref)) || {};
  const hit = merged.get(o);
  if (hit?.[0] === base) return hit[1];
  const out = mergeShapeOptions(base, o);
  merged.set(o, [base, out]);
  return out;
}

/** `over` on top of `base`: corners merge per key, `points` and `padding` replace as a whole, no `ref`. */
export function mergeShapeOptions(base: CustomShapeOptions, over: CustomShapeOptions): CustomShapeOptions {
  const out: CustomShapeOptions = { ...base, ...over };
  delete out.ref;
  if (base.corners && over.corners) out.corners = { ...base.corners, ...over.corners };
  return out;
}
