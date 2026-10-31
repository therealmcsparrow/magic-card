/* Overlap and small-target checks: pure geometry on boxes the studio canvas measures. */

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** A fingertip: WCAG 2.5.8 asks 24 px, the design asks 44 px for an overlay that has an action. */
export const SMALL_TARGET = 44;

export function isSmallTarget(box: Box): boolean {
  if (box.width <= 0 && box.height <= 0) return false;
  return box.width < SMALL_TARGET || box.height < SMALL_TARGET;
}

const overlaps = (a: Box, b: Box): boolean =>
  a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;

/** The in-flow modules with actions the overlay's box covers (touching edges do not count). */
export function overlapWith<T extends { box: Box }>(overlay: Box, others: readonly T[]): T[] {
  if (overlay.width <= 0 || overlay.height <= 0) return [];
  return others.filter((o) => o.box.width > 0 && o.box.height > 0 && overlaps(overlay, o.box));
}
