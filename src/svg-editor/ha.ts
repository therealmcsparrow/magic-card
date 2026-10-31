import type { EditPath, PathData, Pt, SubPath } from '../contracts/path-model';
import { flatten, reverse } from '../path/core';
import { E, T } from './bind';
import { isOff, type Doc, type Shape } from './model';

/*
 * The "In Home Assistant" form of a drawing: one fill `path` and one `secondary_path` with the nonzero rule, subpaths wound so holes stay holes.
 * `lost` is the share of covered area the form does not reproduce.
 */

export interface HaForm {
  path: string;
  secondary: string;
  viewBox: string;
  empty: boolean;
  /** 0 to 1: the part of the drawing the form misses. */
  lost: number;
}

const area = (poly: Pt[]): number => {
  let a = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
  return a / 2;
};

const evenOdd = (p: Pt, poly: Pt[]): boolean => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a[1] > p[1] !== b[1] > p[1] && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
};

const winding = (p: Pt, poly: Pt[]): number => {
  let w = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[j];
    const b = poly[i];
    const cross = (b[0] - a[0]) * (p[1] - a[1]) - (p[0] - a[0]) * (b[1] - a[1]);
    if (a[1] <= p[1]) {
      if (b[1] > p[1] && cross > 0) w++;
    } else if (b[1] <= p[1] && cross < 0) w--;
  }
  return w;
};

const closedSub = (p: EditPath): SubPath => E.fromEdit({ anchors: p.anchors, closed: true });

/** The subpaths of one shape that Home Assistant can fill, wound so that nonzero gives the shape's look. */
export function haSubpaths(s: Shape): SubPath[] {
  if (s.hidden) return [];
  const fillOn = s.fill !== 'none';
  const paths = s.paths.filter((p) => p.anchors.length > 2 && (fillOn || (s.stroke !== 'none' && p.closed)));
  if (!paths.length) return [];
  const subs = paths.map(closedSub);
  const polys = subs.map((x) => flatten(x, 8));
  const areas = polys.map(area);
  const ref = Math.sign(areas.reduce((m, a) => (Math.abs(a) > Math.abs(m) ? a : m), 0)) || 1;
  return subs.map((sub, i) => {
    let want: number;
    if (fillOn && s.rule === 'evenodd') {
      const depth = polys.reduce((n, q, j) => n + (j !== i && evenOdd(polys[i][0], q) ? 1 : 0), 0);
      want = depth % 2 ? -1 : 1;
    } else want = Math.sign(areas[i]) === ref ? 1 : -1;
    return Math.sign(areas[i]) * want < 0 ? reverse(sub) : sub;
  });
}

const GRID = 40;

export function haForm(d: Doc, decimals = 2): HaForm {
  const main: SubPath[] = [];
  const second: SubPath[] = [];
  for (const s of d.shapes) if (!isOff(d, s, 'hidden')) (s.fill === 'accent' || (s.fill === 'none' && s.stroke === 'accent') ? second : main).push(...haSubpaths(s));
  const str = (x: SubPath[]): string => (x.length ? T.tidyPath(x as PathData, { decimals }) : '');
  const path = str(main);
  const secondary = str(second);
  const vb = d.vb;
  const out: HaForm = { path, secondary, viewBox: `${vb.x} ${vb.y} ${vb.w} ${vb.h}`, empty: !path && !secondary, lost: 0 };

  // coverage of the drawing against the form, sampled on a grid
  const drawn = d.shapes.filter((s) => !isOff(d, s, 'hidden') && (s.fill !== 'none' || s.stroke !== 'none'));
  const info = drawn.map((s) => ({
    s,
    polys: s.paths.filter((p) => p.anchors.length > 1).map((p) => ({ pts: flatten(E.fromEdit({ anchors: p.anchors, closed: s.fill !== 'none' || p.closed }), 6), closed: p.closed })),
  }));
  const ha = [...main, ...second].map((x) => flatten(x, 6));
  let a = 0;
  let b = 0;
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const p: Pt = [vb.x + ((i + 0.5) * vb.w) / GRID, vb.y + ((j + 0.5) * vb.h) / GRID];
      const covered = info.some(({ s, polys }) => {
        if (s.fill !== 'none') {
          const hit = s.rule === 'evenodd' ? polys.reduce((n, q) => n + (evenOdd(p, q.pts) ? 1 : 0), 0) % 2 === 1 : polys.reduce((n, q) => n + winding(p, q.pts), 0) !== 0;
          if (hit) return true;
        }
        if (s.stroke === 'none' || s.width <= 0) return false;
        const r = s.width / 2;
        return polys.some(({ pts, closed }) => {
          const n = pts.length;
          for (let k = 0; k < (closed ? n : n - 1); k++) if (segDist(p, pts[k], pts[(k + 1) % n]) <= r) return true;
          return false;
        });
      });
      if (!covered) continue;
      a++;
      if (ha.reduce((n, q) => n + winding(p, q), 0) !== 0) b++;
    }
  }
  out.lost = a ? 1 - b / a : 0;
  return out;
}

function segDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Design W11: nothing for Home Assistant to draw, or more than half of the drawing missing. */
export const haWarns = (f: HaForm): boolean => f.empty || f.lost > 0.5;
