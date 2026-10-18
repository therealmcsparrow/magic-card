import type { Box } from '../contracts/path-model';
import { SVG_SAFE_INSET, type SvgAlignEdge } from '../contracts/svg-editor';
import { boxOf, unionBox, type Doc } from './model';

/*
 * Align, distribute and placement: pure box maths. An item is a layer, or a whole selected group (the
 * union of its layers). Boxes ignore stroke width and follow the stored geometry (rotation is baked in).
 */

export interface Item {
  ids: string[];
  box: Box;
}
export interface Move {
  ids: string[];
  dx: number;
  dy: number;
}

export const safeBox = (vb: Box): Box => ({ x: vb.x + SVG_SAFE_INSET, y: vb.y + SVG_SAFE_INSET, w: vb.w - 2 * SVG_SAFE_INSET, h: vb.h - 2 * SVG_SAFE_INSET });

/** The visible, unlocked layers among `sel` as items, and how many selected layers were left out. */
export function itemsOf(d: Doc, sel: readonly string[]): { items: Item[]; leftOut: number } {
  const g = new Map(d.groups.map((x) => [x.id, x]));
  const off = (s: Doc['shapes'][number]): boolean => !!(s.hidden || s.locked || (s.group && (g.get(s.group)?.hidden || g.get(s.group)?.locked)));
  const picked = d.shapes.filter((s) => sel.includes(s.id));
  const items: Item[] = [];
  const seen = new Set<string>();
  for (const s of picked) {
    if (off(s) || seen.has(s.id)) continue;
    const whole = s.group ? d.shapes.filter((m) => m.group === s.group) : [s];
    const members = whole.every((m) => sel.includes(m.id)) ? whole : [s];
    members.forEach((m) => seen.add(m.id));
    const box = boxOf(members);
    if (box) items.push({ ids: members.map((m) => m.id), box });
  }
  return { items, leftOut: picked.filter(off).length };
}

export const union = (items: Item[]): Box | undefined => unionBox(items.map((i) => i.box));

/** Move every item so the chosen edge (or centre line) sits on the same edge of `to`. */
export function alignMoves(items: Item[], edge: SvgAlignEdge, to: Box): Move[] {
  return items.map((it) => {
    const b = it.box;
    let dx = 0;
    let dy = 0;
    if (edge === 'left') dx = to.x - b.x;
    else if (edge === 'centre') dx = to.x + to.w / 2 - (b.x + b.w / 2);
    else if (edge === 'right') dx = to.x + to.w - (b.x + b.w);
    else if (edge === 'top') dy = to.y - b.y;
    else if (edge === 'middle') dy = to.y + to.h / 2 - (b.y + b.h / 2);
    else dy = to.y + to.h - (b.y + b.h);
    return { ids: it.ids, dx, dy };
  });
}

/** Equal gaps between neighbouring boxes; the first and the last (sorted by left / top) stay. */
export function distributeMoves(items: Item[], axis: 'h' | 'v'): Move[] {
  const lo = (b: Box): number => (axis === 'h' ? b.x : b.y);
  const len = (b: Box): number => (axis === 'h' ? b.w : b.h);
  const sorted = items.slice().sort((p, q) => lo(p.box) - lo(q.box));
  const n = sorted.length;
  if (n < 3) return [];
  const start = lo(sorted[0].box);
  const span = lo(sorted[n - 1].box) + len(sorted[n - 1].box) - start;
  const gap = (span - sorted.reduce((t, i) => t + len(i.box), 0)) / (n - 1);
  let at = start;
  return sorted.map((it) => {
    const d = at - lo(it.box);
    at += len(it.box) + gap;
    return axis === 'h' ? { ids: it.ids, dx: d, dy: 0 } : { ids: it.ids, dx: 0, dy: d };
  });
}

/** Translation that puts the box centre on the centre of `vb`. */
export const centreMove = (b: Box, vb: Box): { dx: number; dy: number } => ({ dx: vb.x + vb.w / 2 - (b.x + b.w / 2), dy: vb.y + vb.h / 2 - (b.y + b.h / 2) });

/** The box scaled uniformly (about its centre, it may grow) to the largest size inside `safe`, centred there. */
export function fitBox(b: Box, safe: Box): Box {
  const k = b.w > 1e-9 || b.h > 1e-9 ? Math.min(b.w > 1e-9 ? safe.w / b.w : Infinity, b.h > 1e-9 ? safe.h / b.h : Infinity) : 1;
  const w = b.w * k;
  const h = b.h * k;
  return { x: safe.x + (safe.w - w) / 2, y: safe.y + (safe.h - h) / 2, w, h };
}

/** Least translation that brings a box inside `safe`; on an axis where it is larger than `safe` it is centred. */
export function matchMove(b: Box, safe: Box): { dx: number; dy: number } {
  const one = (lo: number, len: number, sLo: number, sLen: number): number => {
    if (len > sLen) return sLo + sLen / 2 - (lo + len / 2);
    if (lo < sLo) return sLo - lo;
    if (lo + len > sLo + sLen) return sLo + sLen - (lo + len);
    return 0;
  };
  return { dx: one(b.x, b.w, safe.x, safe.w), dy: one(b.y, b.h, safe.y, safe.h) };
}
