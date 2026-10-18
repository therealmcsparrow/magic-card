import { parsePath as parseD } from '../../path/core';
import { MAX_ANCHORS, append, bounds, copyAnchor, copyPath, fmtNum, insertAt, isSmooth, moveAnchor, nearestOnPath, remove, reverse, segment, segmentCount, serialize, setClosed, setHandle as setHandleAs, smoothAll, snap, straightenAll, toEdit, toggleSmooth, translate, type Anchor, type EditPath, type Pt } from '../../path/edit';
import { samplePath, type PathSample } from '../compile';
import type { PathSpec } from '../model';

/*
 * Path motion editing for the animation studio: the generic anchor model now lives in
 * src/path/edit.ts (contract path-model 1.0.0); this file keeps the studio's names for it (a shim,
 * removed once the studio calls src/path directly) plus what only the studio needs: where the subject
 * is at a time, and the motion templates. Coordinates are the document's own units (PathSpec.units,
 * usually % of the moving element's size).
 *
 * Only the first subpath is edited (motion runs along one line); serialising writes it alone.
 */

export type { Anchor, EditPath, Pt };
export { MAX_ANCHORS, copyAnchor, copyPath, fmtNum, isSmooth, nearestOnPath, segment, segmentCount, setClosed, smoothAll, snap, straightenAll, toggleSmooth };
export { splitCubic } from '../../path/core';

/** Path data -> anchors (first subpath; lines get no handles, a handle on its anchor is none). */
export function parsePath(d: string): EditPath {
  const sub = d ? parseD(d)[0] : undefined;
  if (sub) return toEdit(sub);
  // "M x y" alone: a single anchor (a path being drawn)
  const n = String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`;
  const m = new RegExp(String.raw`^\s*[Mm]\s*${n}[\s,]*${n}`).exec(d || '');
  return { anchors: m ? [{ x: Number(m[1]), y: Number(m[2]) }] : [], closed: false };
}

/** Anchors -> path data: L for straight segments, C otherwise, Z when closed. */
export const serializePath = serialize;
export const pathBounds = bounds;
export const insertPoint = insertAt;
export const appendPoint = append;
export const removePoint = remove;
export const reversePath = reverse;
export const translatePath = translate;
export { moveAnchor };

/** Set a handle of anchor i. `mirror`: the opposite handle mirrors it (symmetric); otherwise only this one moves (a cusp). */
export const setHandle = (p: EditPath, i: number, which: 'in' | 'out', q: Pt, mirror: boolean): EditPath => setHandleAs(p, i, which, q, mirror ? 'symmetric' : 'corner');

// ── where the subject is ──

const sampleCache = new Map<string, PathSample[]>();

/** The subject's position and heading at progress t (0-1, by length, like the compiled motion). */
export function pointAtTime(d: string, t: number): PathSample | undefined {
  let s = sampleCache.get(d);
  if (!s) {
    s = d ? samplePath(d, 200) : [];
    if (sampleCache.size > 32) sampleCache.clear();
    sampleCache.set(d, s);
  }
  if (!s.length) return undefined;
  const f = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 0)) * (s.length - 1);
  const i = Math.min(s.length - 2, Math.floor(f));
  if (i < 0) return s[0];
  const a = s[i];
  const b = s[i + 1];
  const k = f - i;
  return { t: a.t + (b.t - a.t) * k, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: a.angle + (b.angle - a.angle) * k };
}

// ── templates ──

export type PathTemplateId = 'circle' | 'figure-8' | 'wave' | 'bounce' | 'zigzag' | 'spiral';

export const PATH_TEMPLATES: Array<{ id: PathTemplateId; label: string }> = [
  { id: 'circle', label: 'Circle' },
  { id: 'figure-8', label: 'Figure 8' },
  { id: 'wave', label: 'Wave' },
  { id: 'bounce', label: 'Bounce' },
  { id: 'zigzag', label: 'Zigzag' },
  { id: 'spiral', label: 'Spiral' },
];

/**
 * A parametric curve as smooth anchors (Hermite to bezier: handle = P ± P'·Δ/3), sampled at `n`
 * steps over [t0, t1]; `closed` drops the duplicate end point.
 */
function parametric(f: (t: number) => Pt, df: (t: number) => Pt, t0: number, t1: number, n: number, closed: boolean): EditPath {
  const dt = (t1 - t0) / n;
  const anchors: Anchor[] = [];
  const count = closed ? n : n + 1;
  for (let i = 0; i < count; i++) {
    const t = t0 + i * dt;
    const [x, y] = f(t);
    const [vx, vy] = df(t);
    const h: Pt = [(vx * dt) / 3, (vy * dt) / 3];
    anchors.push({
      x,
      y,
      in: closed || i > 0 ? [x - h[0], y - h[1]] : undefined,
      out: closed || i < count - 1 ? [x + h[0], y + h[1]] : undefined,
    });
  }
  return { anchors, closed };
}

/**
 * Template path data in % units around `center` (the rest position (0, 0) for an element or icon,
 * the middle (50, 50) of the layer for particles). `size` is the half-width in % (default 40).
 */
export function templatePath(id: PathTemplateId, center: Pt = [0, 0], size = 40): string {
  const [cx, cy] = center;
  const s = size / 40;
  const TAU = Math.PI * 2;
  let p: EditPath;
  switch (id) {
    case 'circle': {
      const r = 30 * s;
      p = parametric((t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)], (t) => [-r * Math.sin(t), r * Math.cos(t)], 0, TAU, 8, true);
      break;
    }
    case 'figure-8': {
      // lemniscate of Gerono on its side: crosses the centre at t = 0 and π
      const a = 36 * s;
      const b = 56 * s;
      p = parametric(
        (t) => [cx + a * Math.sin(t), cy + b * Math.sin(t) * Math.cos(t)],
        (t) => [a * Math.cos(t), b * Math.cos(2 * t)],
        0,
        TAU,
        8,
        true,
      );
      break;
    }
    case 'wave': {
      const w = 80 * s;
      const amp = 20 * s;
      const waves = 2;
      const k = (TAU * waves) / w;
      p = parametric((t) => [cx - w / 2 + t, cy - amp * Math.sin(k * t)], (t) => [1, -amp * k * Math.cos(k * t)], 0, w, waves * 4, false);
      break;
    }
    case 'bounce': {
      // hops of falling height left to right on a floor below the centre; each landing is a corner
      const floor = cy + 20 * s;
      const heights = [40, 25, 12].map((h) => h * s);
      const widths = [34, 26, 20].map((w) => w * s);
      let x = cx - 40 * s;
      const anchors: Anchor[] = [{ x, y: floor }];
      heights.forEach((h, i) => {
        const x1 = x + widths[i];
        // the parabola's quadratic control, raised to cubic controls
        const q: Pt = [x + widths[i] / 2, floor - 2 * h];
        anchors[anchors.length - 1].out = [x + (2 / 3) * (q[0] - x), floor + (2 / 3) * (q[1] - floor)];
        anchors.push({ x: x1, y: floor, in: [x1 + (2 / 3) * (q[0] - x1), floor + (2 / 3) * (q[1] - floor)] });
        x = x1;
      });
      p = { anchors, closed: false };
      break;
    }
    case 'zigzag': {
      const anchors: Anchor[] = [];
      const steps = 6;
      for (let i = 0; i <= steps; i++) anchors.push({ x: cx - 40 * s + (80 * s * i) / steps, y: cy + (i % 2 ? -15 : 15) * s });
      p = { anchors, closed: false };
      break;
    }
    case 'spiral': {
      // Archimedean, from the centre out, 2.5 turns
      const turns = 2.5;
      const end = TAU * turns;
      const b = (40 * s) / end;
      p = parametric(
        (t) => [cx + b * t * Math.cos(t), cy + b * t * Math.sin(t)],
        (t) => [b * (Math.cos(t) - t * Math.sin(t)), b * (Math.sin(t) + t * Math.cos(t))],
        0,
        end,
        turns * 4,
        false,
      );
      break;
    }
  }
  return serializePath(p);
}

/** Where templates centre for this subject: the rest position, or the layer middle for particles. */
export const templateCenter = (spec: Pick<PathSpec, 'subject' | 'units'>): Pt => (spec.subject === 'particles' && spec.units === 'percent' ? [50, 50] : [0, 0]);
