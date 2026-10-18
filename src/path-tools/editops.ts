/*
 * Join and Split (contract path-tools 1.0.0): the two tools that only rearrange anchors. Pure.
 */
import { JOIN_MERGE_DIST } from '../contracts/path-tools';
import type { ToolOptions, ToolResult } from '../contracts/path-tools';
import type { Anchor, EditPath } from '../contracts/path-model';
import { ap, copyAnchor, copyPath, dist, frameScale, reversePath } from './geom';

const isOpen = (p: EditPath | undefined): p is EditPath => !!p && !p.closed && p.anchors.length >= 2;

/** Two open paths a, b: the nearest pair of ends is joined; one open path (no b) is closed. */
export function join(a: EditPath, b: EditPath | undefined, o: ToolOptions): ToolResult {
  if (!isOpen(a) || (b && !isOpen(b))) return { ok: false, reason: 'not-open', skippedOpen: 0 };
  const merge = JOIN_MERGE_DIST * frameScale(o.frame);
  if (!b) {
    const p = copyPath(a);
    const first = p.anchors[0];
    const last = p.anchors[p.anchors.length - 1];
    if (p.anchors.length > 2 && dist(ap(first), ap(last)) < merge) {
      p.anchors.pop();
      delete first.in;
      if (last.in) first.in = last.in;
      first.kind = 'corner';
    }
    p.closed = true;
    return { ok: true, paths: [p], skippedOpen: 0 };
  }
  const ea = [ap(a.anchors[0]), ap(a.anchors[a.anchors.length - 1])];
  const eb = [ap(b.anchors[0]), ap(b.anchors[b.anchors.length - 1])];
  let best = { i: 1, j: 0, d: Infinity };
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (dist(ea[i], eb[j]) < best.d - 1e-12) best = { i, j, d: dist(ea[i], eb[j]) };
  // a keeps its direction: its joined end is the last (b follows, turned to start at the joint) or the first (b comes
  // before it, turned to end at the joint)
  const head = best.i === 1 ? copyPath(a) : best.j === 1 ? copyPath(b) : reversePath(b);
  const tail = best.i === 1 ? (best.j === 0 ? copyPath(b) : reversePath(b)) : copyPath(a);
  const out: Anchor[] = head.anchors.map(copyAnchor);
  const t = tail.anchors.map(copyAnchor);
  const last = out[out.length - 1];
  if (best.d < merge) {
    const m = t.shift()!;
    delete last.out;
    if (m.out) last.out = m.out;
    last.kind = 'corner';
  }
  return { ok: true, paths: [{ anchors: [...out, ...t], closed: false }], skippedOpen: 0 };
}

/** Split `path` at anchor i. Open: two open paths sharing a copy of i. Closed: one open path from i around to i. */
export function split(path: EditPath, i: number): ToolResult {
  const n = path.anchors.length;
  if (!Number.isInteger(i) || i < 0 || i >= n || n < 2) return { ok: false, reason: 'at-end', skippedOpen: 0 };
  if (path.closed) {
    const rot = [...path.anchors.slice(i), ...path.anchors.slice(0, i)].map(copyAnchor);
    const startA = rot[0];
    const endA = copyAnchor(startA);
    delete endA.out;
    delete startA.in;
    endA.kind = 'corner';
    startA.kind = 'corner';
    const src = path.anchors[i];
    delete endA.in;
    if (src.in) endA.in = [src.in[0], src.in[1]];
    return { ok: true, paths: [{ anchors: [...rot, endA], closed: false }], skippedOpen: 0 };
  }
  if (i === 0 || i === n - 1) return { ok: false, reason: 'at-end', skippedOpen: 0 };
  const left = path.anchors.slice(0, i + 1).map(copyAnchor);
  const right = path.anchors.slice(i).map(copyAnchor);
  delete left[i].out;
  delete right[0].in;
  left[i].kind = 'corner';
  right[0].kind = 'corner';
  return {
    ok: true,
    paths: [
      { anchors: left, closed: false },
      { anchors: right, closed: false },
    ],
    skippedOpen: 0,
  };
}
