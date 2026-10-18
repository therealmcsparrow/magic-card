import type { Anchor, AnchorKind, EditPath, Pt } from '../contracts/path-model';
import { copyPath, isSmooth, setHandle, setKind, toggleSmooth } from '../path/edit';

/*
 * Edit operations the canvas needs on top of src/path/edit.ts: moving or removing several anchors in
 * one copy (a 1,000-anchor path is copied once per frame, not once per anchor), the keyboard focus
 * order, and the corner <-> smooth toggle. Pure; the input is never changed.
 */

export const effectiveKind = (a: Anchor): AnchorKind => a.kind ?? (isSmooth(a) ? 'smooth' : 'corner');

/** Move the anchors in `set` by (dx, dy); their handles move with them. */
export function moveSet(p: EditPath, set: readonly number[], dx: number, dy: number): EditPath {
  const out = copyPath(p);
  for (const i of set) {
    const a = out.anchors[i];
    if (!a) continue;
    a.x += dx;
    a.y += dy;
    if (a.in) a.in = [a.in[0] + dx, a.in[1] + dy];
    if (a.out) a.out = [a.out[0] + dx, a.out[1] + dy];
  }
  return out;
}

/** The whole path moved. */
export const moveAll = (p: EditPath, dx: number, dy: number): EditPath =>
  moveSet(
    p,
    p.anchors.map((_, i) => i),
    dx,
    dy,
  );

/** Move one handle (the anchor stays). */
export function moveHandle(p: EditPath, i: number, which: 'in' | 'out', dx: number, dy: number): EditPath {
  const a = p.anchors[i]?.[which];
  return a ? setHandle(p, i, which, [a[0] + dx, a[1] + dy]) : p;
}

/** Remove the anchors in `set` (any order). A path left with fewer than 2 anchors is open. */
export function removeSet(p: EditPath, set: readonly number[]): EditPath {
  const drop = new Set(set);
  const anchors = p.anchors.filter((_, i) => !drop.has(i)).map((a) => ({ ...a }));
  return { anchors, closed: p.closed && anchors.length > 1 };
}

/** What a tap on the kind control or C does: corner -> smooth (or symmetric), anything else -> corner. */
export function nextKind(a: Anchor, kinds: readonly AnchorKind[]): AnchorKind | undefined {
  if (effectiveKind(a) === 'corner') return (['smooth', 'symmetric'] as const).find((k) => kinds.includes(k));
  return kinds.includes('corner') ? 'corner' : undefined;
}

/** Give anchor i its next kind. A corner without handles gets automatic ones (Catmull-Rom). */
export function toggleKind(p: EditPath, i: number, kinds: readonly AnchorKind[]): EditPath {
  const a = p.anchors[i];
  if (!a) return p;
  const to = nextKind(a, kinds);
  if (!to) return p;
  let q = p;
  if (to !== 'corner') {
    if (!a.in && !a.out) {
      q = copyPath(p);
      q = toggleSmooth(q, i);
    } else if (!a.in !== !a.out) {
      const which = a.in ? 'in' : 'out';
      q = setHandle(p, i, which, a[which]!, 'symmetric');
    }
  }
  return setKind(q, i, to);
}

export interface Stop {
  i: number;
  which?: 'in' | 'out';
}

/** Tab order: each anchor, then its handles. */
export function stops(p: EditPath): Stop[] {
  const out: Stop[] = [];
  p.anchors.forEach((a, i) => {
    out.push({ i });
    if (a.in) out.push({ i, which: 'in' });
    if (a.out) out.push({ i, which: 'out' });
  });
  return out;
}

/** Index of the stop with this anchor (and handle) in `stops(p)`, or -1. */
export const stopIndex = (list: readonly Stop[], i: number, which?: 'in' | 'out'): number => list.findIndex((s) => s.i === i && s.which === which);

/** Anchors inside a screen rectangle, given a mapper from anchor to screen. */
export function anchorsInRect(p: EditPath, to: (q: Pt) => Pt, a: Pt, b: Pt): number[] {
  const x0 = Math.min(a[0], b[0]);
  const x1 = Math.max(a[0], b[0]);
  const y0 = Math.min(a[1], b[1]);
  const y1 = Math.max(a[1], b[1]);
  const out: number[] = [];
  p.anchors.forEach((an, i) => {
    const s = to([an.x, an.y]);
    if (s[0] >= x0 && s[0] <= x1 && s[1] >= y0 && s[1] <= y1) out.push(i);
  });
  return out;
}
