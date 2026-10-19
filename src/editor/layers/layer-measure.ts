import type { Box } from './checks';

/*
 * The studio canvas measures module boxes inside the live card; the Layer group (a sibling in the studio,
 * an unrelated tree) asks through this small registry for the overlap and small-target checks. Without a
 * canvas (the card editor's plain tabs) nothing is measured and the checks stay quiet.
 */

export type LayerMeasurer = (paths: readonly string[]) => Record<string, Box | undefined>;

let measurer: LayerMeasurer | undefined;
const listeners = new Set<() => void>();

export function setLayerMeasurer(fn: LayerMeasurer | undefined): void {
  measurer = fn;
}

export function measureBoxes(paths: readonly string[]): Record<string, Box | undefined> {
  return measurer ? measurer(paths) : {};
}

/** The canvas calls this after it laid out again (resize, narrower view, edit). */
export function notifyLayerMeasure(): void {
  for (const fn of listeners) fn();
}

export function onLayerMeasure(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
