/** Axis-aligned box in one coordinate space (the canvas content box). */
export interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Gap between the selection frame and the bar. */
const GAP = 8;
/** Room kept above the frame for its name tag when the bar goes above. */
const TAG = 28;
/** Inset from the visible canvas edge. */
const EDGE = 8;

function overlaps(a: Box, b: Box): boolean {
  return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(v, Math.max(min, max)));
}

/**
 * Position of the module float bar, an overlay that always gets a spot. Never covers a neighbouring module:
 * above the frame first (clear of the frame's name tag), then below it, then right and left of the frame,
 * and when none is free, the spot that covers the least of the neighbours. Always clamped to the visible stage.
 */
export function placeFloatBar(frame: Box, bar: Size, obstacles: Box[], viewport: Box): { top: number; left: number } {
  return findFloatBarSpot(frame, bar, obstacles, viewport) ?? leastOverlap(frame, bar, obstacles, viewport);
}

function overlapArea(a: Box, b: Box): number {
  const w = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const h = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

/**
 * No free spot: the candidate that covers the least of the neighbouring modules. The sides are slid into the
 * visible stage (so the bar hangs over the frame's edge rather than a neighbour's text), the inside corner is the
 * last choice on a tie.
 */
function leastOverlap(frame: Box, bar: Size, obstacles: Box[], viewport: Box): { top: number; left: number } {
  const vTop = viewport.top + EDGE;
  const vBottom = viewport.top + viewport.height - EDGE;
  const vLeft = viewport.left + EDGE;
  const vRight = viewport.left + viewport.width - EDGE;
  const maxTop = vBottom - bar.height;
  const maxLeft = vRight - bar.width;
  const sideTop = clamp(frame.top, vTop, maxTop);
  const candidates: Array<{ top: number; left: number }> = [
    { top: clamp(frame.top - TAG - GAP - bar.height, vTop, maxTop), left: clamp(frame.left + frame.width - bar.width, vLeft, maxLeft) },
    { top: clamp(frame.top + frame.height + GAP, vTop, maxTop), left: clamp(frame.left + frame.width - bar.width, vLeft, maxLeft) },
    { top: sideTop, left: clamp(frame.left + frame.width + GAP, vLeft, maxLeft) },
    { top: sideTop, left: clamp(frame.left - GAP - bar.width, vLeft, maxLeft) },
    insideCorner(frame, bar, viewport),
  ];
  let best = candidates[candidates.length - 1];
  let bestArea = Infinity;
  for (const c of candidates) {
    const box = { ...c, width: bar.width, height: bar.height };
    const area = obstacles.reduce((sum, o) => sum + overlapArea(box, o), 0);
    if (area < bestArea) {
      best = c;
      bestArea = area;
    }
  }
  return best;
}

/** A spot outside the frame that is clear of every obstacle and inside the visible canvas, or null when none fits. */
export function findFloatBarSpot(frame: Box, bar: Size, obstacles: Box[], viewport: Box): { top: number; left: number } | null {
  const vTop = viewport.top + EDGE;
  const vBottom = viewport.top + viewport.height - EDGE;
  const vLeft = viewport.left + EDGE;
  const vRight = viewport.left + viewport.width - EDGE;
  const alignedLeft = clamp(frame.left + frame.width - bar.width, vLeft, vRight - bar.width);

  // Beside the frame the bar slides along it, so a frame scrolled partly out of view still gets a spot.
  const sideTop = clamp(frame.top, vTop, vBottom - bar.height);

  const fits = (top: number, left: number): boolean => {
    const box = { top, left, width: bar.width, height: bar.height };
    if (top < vTop || top + bar.height > vBottom) return false;
    if (left < vLeft || left + bar.width > vRight) return false;
    return !obstacles.some((o) => overlaps(box, o));
  };

  const candidates: Array<[number, number]> = [
    [frame.top - TAG - GAP - bar.height, alignedLeft],
    [frame.top + frame.height + GAP, alignedLeft],
    [sideTop, frame.left + frame.width + GAP],
    [sideTop, frame.left - GAP - bar.width],
  ];
  for (const [top, left] of candidates) if (fits(top, left)) return { top, left };
  return null;
}

/** Inside the frame's top-right corner, kept on screen. */
function insideCorner(frame: Box, bar: Size, viewport: Box): { top: number; left: number } {
  const vTop = viewport.top + EDGE;
  const vBottom = viewport.top + viewport.height - EDGE;
  const vLeft = viewport.left + EDGE;
  const vRight = viewport.left + viewport.width - EDGE;
  return {
    top: clamp(frame.top + GAP, vTop, vBottom - bar.height),
    left: clamp(frame.left + frame.width - bar.width - GAP, vLeft, vRight - bar.width),
  };
}

/**
 * Boxes of the panel lips beside the canvas, in the canvas content box, so a bar spot never sits on one.
 * `root` is the tree the lips render in (the studio's shadow root); `toLocal` maps a screen rect to that box.
 * On a coarse pointer each lip has an invisible `::after` extension towards the canvas; the box includes it.
 */
export function lipBoxes(root: ParentNode, toLocal: (r: DOMRect) => Box): Box[] {
  const boxes: Box[] = [];
  for (const el of root.querySelectorAll<HTMLElement>('.lip')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const after = getComputedStyle(el, '::after');
    const reach = after.content && after.content !== 'none' ? parseFloat(after.width) || 0 : 0;
    // the extension points to the canvas: right of a start lip, left of an end lip, swapped in right-to-left
    const towardsRight = (el.dataset.side === 'start') !== (el.dataset.dir === 'rtl');
    const left = towardsRight ? r.left : r.left - reach;
    const width = r.width + reach;
    boxes.push(toLocal({ left, top: r.top, width, height: r.height, right: left + width, bottom: r.bottom, x: left, y: r.top, toJSON: () => ({}) } as DOMRect));
  }
  return boxes;
}
