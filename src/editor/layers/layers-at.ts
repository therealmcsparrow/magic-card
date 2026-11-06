/* Layers at a point (pure): orders the module boxes holding the point from front to back (overlays, in-flow modules, backgrounds; children before parents). */

export type HitPlacement = 'flow' | 'background' | 'overlay';

export interface HitItem {
  /** data-mc-path. */
  path: string;
  placement: HitPlacement;
  /** DOM / config order; later is in front within the same tier. */
  order: number;
  rect: { left: number; top: number; width: number; height: number };
}

const TIER: Record<HitPlacement, number> = { background: 0, flow: 1, overlay: 2 };
const depth = (p: string): number => p.split('/').length;
const isAncestor = (a: string, b: string): boolean => b.startsWith(`${a}/`);

function inRect(r: HitItem['rect'], x: number, y: number): boolean {
  return x >= r.left && x < r.left + r.width && y >= r.top && y < r.top + r.height;
}

function touches(a: HitItem['rect'], b: HitItem['rect']): boolean {
  return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
}

/** Paths holding the point, front first. */
export function layersAtPoint(items: readonly HitItem[], x: number, y: number): string[] {
  return sortFront(items.filter((i) => inRect(i.rect, x, y)));
}

/** Paths whose box overlaps a region (the selected module's box), front first. */
export function layersInRegion(items: readonly HitItem[], region: HitItem['rect']): string[] {
  return sortFront(items.filter((i) => touches(i.rect, region)));
}

function sortFront(here: HitItem[]): string[] {
  here.sort((a, b) => {
    if (isAncestor(a.path, b.path)) return 1;
    if (isAncestor(b.path, a.path)) return -1;
    if (TIER[a.placement] !== TIER[b.placement]) return TIER[b.placement] - TIER[a.placement];
    if (depth(a.path) !== depth(b.path)) return depth(b.path) - depth(a.path);
    return b.order - a.order;
  });
  return here.map((i) => i.path);
}

/**
 * The next layer in a front-first list: down (`step` 1) or up (-1), wrapping. A selection that is not
 * in the list starts at the front (or the back when going up).
 */
export function cycleTarget(here: readonly string[], current: string | undefined, step: 1 | -1 = 1): string | undefined {
  if (!here.length) return undefined;
  const at = current === undefined ? -1 : here.indexOf(current);
  if (at < 0) return step === 1 ? here[0] : here[here.length - 1];
  return here[(at + step + here.length) % here.length];
}
