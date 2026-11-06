import type { Box } from './checks';

// A small registry through which the Layer group asks the studio canvas for module box measurements.

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
