import type { CornerRadius, Radii, RingPathOptions } from './ring-path';
import { clampRadii, insetRadii, RING_STARTS } from './ring-path';

/*
 * The outline of a CSS rounded rectangle as an SVG path (the ring's path). It sits apart from ring-path.ts so a chunk that
 * only reads radii or draws a shaped outline does not carry it.
 */

interface Pt {
  x: number;
  y: number;
}

/** One piece of the outline, walked clockwise; `group` merges pieces of one side / corner again. */
interface Seg {
  kind: 'L' | 'A';
  group: string;
  from: Pt;
  to: Pt;
  rx: number;
  ry: number;
}

const fmt = (n: number): string => {
  const v = Math.round(n * 100) / 100;
  return String(Object.is(v, -0) ? 0 : v);
};
const same = (a: Pt, b: Pt) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6;

/** The two halves of a corner arc around `c`, from angle a0 to a0 + 90deg (clockwise on screen). */
function corner(group: string, c: Pt, r: CornerRadius, a0: number): Seg[] {
  const at = (deg: number): Pt => {
    const t = (deg * Math.PI) / 180;
    return { x: c.x + r.x * Math.cos(t), y: c.y + r.y * Math.sin(t) };
  };
  const [p0, pm, p1] = [at(a0), at(a0 + 45), at(a0 + 90)];
  return [
    { kind: 'A', group, from: p0, to: pm, rx: r.x, ry: r.y },
    { kind: 'A', group, from: pm, to: p1, rx: r.x, ry: r.y },
  ];
}

function side(group: string, from: Pt, to: Pt): Seg[] {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  return [
    { kind: 'L', group, from, to: mid, rx: 0, ry: 0 },
    { kind: 'L', group, from: mid, to, rx: 0, ry: 0 },
  ];
}

/**
 * The outline path of a w x h border box with these radii. Empty for an empty box. Radii are
 * clamped like CSS (for the box and again for the inset outline).
 */
export function ringPath(w: number, h: number, radii: Radii, opts: RingPathOptions = {}): string {
  const d = opts.inset ?? 0;
  const x0 = d;
  const y0 = d;
  const x1 = w - d;
  const y1 = h - d;
  if (!(w > 0 && h > 0) || x1 <= x0 || y1 <= y0) return '';
  const r = clampRadii(insetRadii(clampRadii(radii, w, h), d), x1 - x0, y1 - y0);

  // clockwise from the top side's middle: top (2nd half), TR, right, BR, bottom, BL, left, TL, top (1st half)
  const top = side('top', { x: x0 + r.tl.x, y: y0 }, { x: x1 - r.tr.x, y: y0 });
  const loop: Seg[] = [
    top[1],
    ...corner('tr', { x: x1 - r.tr.x, y: y0 + r.tr.y }, r.tr, -90),
    ...side('right', { x: x1, y: y0 + r.tr.y }, { x: x1, y: y1 - r.br.y }),
    ...corner('br', { x: x1 - r.br.x, y: y1 - r.br.y }, r.br, 0),
    ...side('bottom', { x: x1 - r.br.x, y: y1 }, { x: x0 + r.bl.x, y: y1 }),
    ...corner('bl', { x: x0 + r.bl.x, y: y1 - r.bl.y }, r.bl, 90),
    ...side('left', { x: x0, y: y1 - r.bl.y }, { x: x0, y: y0 + r.tl.y }),
    ...corner('tl', { x: x0 + r.tl.x, y: y0 + r.tl.y }, r.tl, 180),
    top[0],
  ];
  const i = 2 * Math.max(0, RING_STARTS.indexOf(opts.start ?? 'top'));
  let segs = [...loop.slice(i), ...loop.slice(0, i)];
  const ccw = opts.direction === 'ccw';
  if (ccw) segs = segs.reverse().map((s) => ({ ...s, from: s.to, to: s.from }));

  // drop empty pieces, merge consecutive pieces of the same side / corner
  const merged: Seg[] = [];
  for (const s of segs) {
    if (same(s.from, s.to)) continue;
    const prev = merged[merged.length - 1];
    if (prev && prev.group === s.group && same(prev.to, s.from)) prev.to = s.to;
    else merged.push({ ...s });
  }
  if (!merged.length) return '';
  const start = merged[0].from;
  // the closing line is drawn by Z
  const last = merged[merged.length - 1];
  if (last.kind === 'L' && same(last.to, start) && merged.length > 1) merged.pop();

  const sweep = ccw ? 0 : 1;
  const parts = [`M${fmt(start.x)} ${fmt(start.y)}`];
  for (const s of merged) {
    parts.push(
      s.kind === 'L'
        ? `L${fmt(s.to.x)} ${fmt(s.to.y)}`
        : `A${fmt(s.rx)} ${fmt(s.ry)} 0 0 ${sweep} ${fmt(s.to.x)} ${fmt(s.to.y)}`,
    );
  }
  parts.push('Z');
  return parts.join(' ');
}
