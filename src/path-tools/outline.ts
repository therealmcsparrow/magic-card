/*
 * Outline stroke (contract path-tools 1.0.0): the stroked area of paths as closed rings. Per smooth run of
 * segments one band between the offset curves at +-width/2, a join piece at every corner, caps on open ends;
 * the booleans chunk then unions the rings (nonzero). Pure.
 */
import { OUTLINE_ACCURACY, STROKE_MITER_LIMIT } from '../contracts/path-tools';
import type { PathToolsDeps, StrokeSpec, ToolOptions, ToolResult } from '../contracts/path-tools';
import type { Cubic, EditPath, Pt } from '../contracts/path-model';
import {
  ap,
  arcChain,
  chainToPath,
  copyAnchor,
  cubicAt,
  curvatureAtT,
  dist,
  frameScale,
  line,
  offsetCubic,
  reverseChain,
  ringSign,
  same,
  segCount,
  segCubic,
  tangentAt,
  totalSegments,
} from './geom';
import { MAX_TOOL_SEGMENTS } from '../contracts/path-tools';

/** A corner is a turn over this angle (radians) between the two tangents at an anchor. */
const CORNER_RAD = 0.002;
/** Most tight-curve discs one call adds. */
const MAX_DISCS = 120;

/** The path without coincident neighbours (their handles merge); undefined when fewer than two anchors are left. */
function clean(p: EditPath): EditPath | undefined {
  const a = p.anchors.map(copyAnchor);
  const out = [a[0]];
  for (let i = 1; i < a.length; i++) {
    const prev = out[out.length - 1];
    if (same(ap(a[i]), ap(prev))) {
      delete prev.out;
      if (a[i].out) prev.out = a[i].out;
    } else out.push(a[i]);
  }
  if (p.closed && out.length > 1 && same(ap(out[out.length - 1]), ap(out[0]))) {
    const last = out.pop()!;
    if (last.in) out[0].in = last.in;
    else delete out[0].in;
  }
  return out.length < 2 ? undefined : { anchors: out, closed: p.closed && out.length > 2 };
}

const weld = (ch: Cubic[], closed: boolean): Cubic[] => {
  const out = ch.map((c) => [c[0], c[1], c[2], c[3]] as Cubic);
  for (let i = 1; i < out.length; i++) out[i][0] = out[i - 1][3];
  if (closed && out.length) out[0][0] = out[out.length - 1][3];
  return out;
};

const offsetChain = (segs: Cubic[], d: number, tol: number): Cubic[] => {
  const out: Cubic[] = [];
  for (const s of segs) offsetCubic(s, d, tol, out);
  return out;
};

function joinRing(P: Pt, tin: Pt, tout: Pt, h: number, join: StrokeSpec['join']): Cubic[] | undefined {
  const cross = tin[0] * tout[1] - tin[1] * tout[0];
  const dot = tin[0] * tout[0] + tin[1] * tout[1];
  if (Math.atan2(Math.abs(cross), dot) <= CORNER_RAD) return undefined;
  const s = cross > 0 ? -1 : 1;
  const nIn: Pt = [-tin[1], tin[0]];
  const nOut: Pt = [-tout[1], tout[0]];
  const A: Pt = [P[0] + s * h * nIn[0], P[1] + s * h * nIn[1]];
  const B: Pt = [P[0] + s * h * nOut[0], P[1] + s * h * nOut[1]];
  let ch: Cubic[];
  if (join === 'round') {
    const arc = arcChain(P, h, Math.atan2(s * nIn[1], s * nIn[0]), Math.atan2(cross, dot));
    ch = [line(P, A), ...arc, line(B, P)];
    ch = weld(ch, true);
  } else if (join === 'miter' && 1 + dot > 1e-9 && Math.sqrt(2 / (1 + dot)) <= STROKE_MITER_LIMIT) {
    const k = (s * h) / (1 + dot);
    const M: Pt = [P[0] + k * (nIn[0] + nOut[0]), P[1] + k * (nIn[1] + nOut[1])];
    ch = [line(P, A), line(A, M), line(M, B), line(B, P)];
  } else ch = [line(P, A), line(A, B), line(B, P)];
  return ringSign(ch) > 0 ? reverseChain(ch) : ch;
}

function capChain(P: Pt, t: Pt, h: number, cap: StrokeSpec['cap'], from: Pt, to: Pt, atEnd: boolean): Cubic[] {
  if (cap === 'round') {
    const n: Pt = atEnd ? [-t[1], t[0]] : [t[1], -t[0]];
    return arcChain(P, h, Math.atan2(n[1], n[0]), -Math.PI);
  }
  if (cap === 'square') {
    const e: Pt = atEnd ? [t[0] * h, t[1] * h] : [-t[0] * h, -t[1] * h];
    const a: Pt = [from[0] + e[0], from[1] + e[1]];
    const b: Pt = [to[0] + e[0], to[1] + e[1]];
    return [line(from, a), line(a, b), line(b, to)];
  }
  return [line(from, to)];
}

/**
 * Where a curve bends tighter than the half width, its inner offset turns inside out and a plain band leaves a
 * hole. Discs of the half width along that stretch (spaced half a width apart, scallops under 0.04 of it) fill it; they
 * lie inside the stroke, so they never add area that is not there.
 */
function tightDiscs(c: Cubic, h: number, centres: Pt[]): void {
  const N = 16;
  const k = (t: number): boolean => Math.abs(curvatureAtT(c, t)) * h > 0.8;
  const hot: boolean[] = Array.from({ length: N + 1 }, (_, i) => k(i / N));
  if (!hot.some(Boolean)) return;
  const step = 0.5 * h;
  let acc = Infinity;
  let prev: Pt | undefined;
  for (let i = 0; i <= N; i++) {
    const near = hot[i] || hot[Math.max(0, i - 1)] || hot[Math.min(N, i + 1)];
    const p = cubicAt(c, i / N);
    if (!near) {
      acc = Infinity;
      prev = undefined;
      continue;
    }
    if (prev) acc += dist(prev, p);
    if (acc >= step) {
      centres.push(p);
      acc = 0;
    }
    prev = p;
  }
}

/** A 16-sided disc inside the stroke (never past its edge), clockwise like the bands. */
function disc(c: Pt, r: number): Cubic[] {
  const pts: Pt[] = Array.from({ length: 16 }, (_, i) => [c[0] + r * Math.cos((-i * Math.PI) / 8), c[1] + r * Math.sin((-i * Math.PI) / 8)]);
  return pts.map((p, i) => line(p, pts[(i + 1) % 16]));
}

/** The rings of one cleaned path. */
function pathRings(p: EditPath, stroke: StrokeSpec, tol: number, rings: Cubic[][], centres: Pt[]): void {
  const h = stroke.width / 2;
  const m = segCount(p);
  const n = p.anchors.length;
  const segs: Cubic[] = Array.from({ length: m }, (_, i) => segCubic(p, i));
  for (const c of segs) tightDiscs(c, h, centres);
  // joint j sits at anchor j between seg j-1 and seg j
  const joints: number[] = [];
  for (let j = p.closed ? 0 : 1; j < (p.closed ? n : n - 1); j++) {
    const tin = tangentAt(segs[(j - 1 + m) % m], false);
    const tout = tangentAt(segs[j % m], true);
    const ring = joinRing(ap(p.anchors[j]), tin, tout, h, stroke.join);
    const corner = Math.atan2(Math.abs(tin[0] * tout[1] - tin[1] * tout[0]), tin[0] * tout[0] + tin[1] * tout[1]) > CORNER_RAD;
    if (corner) {
      joints.push(j);
      if (ring) rings.push(ring);
    }
  }
  if (p.closed && joints.length === 0) {
    rings.push(weld(offsetChain(segs, h, tol), true));
    rings.push(reverseChain(weld(offsetChain(segs, -h, tol), true)));
    return;
  }
  // runs of segments between corners (open: also the path ends)
  const runs: { s: number; len: number; first: boolean; last: boolean }[] = [];
  if (p.closed) {
    for (let k = 0; k < joints.length; k++) {
      const s = joints[k];
      const e = joints[(k + 1) % joints.length];
      runs.push({ s, len: ((e - s + m) % m) || m, first: false, last: false });
    }
  } else {
    const cuts = [0, ...joints, m];
    for (let k = 0; k + 1 < cuts.length; k++) runs.push({ s: cuts[k], len: cuts[k + 1] - cuts[k], first: k === 0, last: k + 2 === cuts.length });
  }
  for (const r of runs) {
    const S: Cubic[] = [];
    for (let i = 0; i < r.len; i++) S.push(segs[(r.s + i) % m]);
    const L = offsetChain(S, h, tol);
    const R = offsetChain(S, -h, tol);
    if (!L.length || !R.length) continue;
    const Lend = L[L.length - 1][3];
    const Rend = R[R.length - 1][3];
    const Rstart = R[0][0];
    const Lstart = L[0][0];
    const tEnd = tangentAt(S[S.length - 1], false);
    const tStart = tangentAt(S[0], true);
    const endCap = r.last ? capChain(ap({ x: (Lend[0] + Rend[0]) / 2, y: (Lend[1] + Rend[1]) / 2 }), tEnd, h, stroke.cap, Lend, Rend, true) : [line(Lend, Rend)];
    const startCap = r.first ? capChain([(Lstart[0] + Rstart[0]) / 2, (Lstart[1] + Rstart[1]) / 2], tStart, h, stroke.cap, Rstart, Lstart, false) : [line(Rstart, Lstart)];
    rings.push(weld([...L, ...endCap, ...reverseChain(R), ...startCap], true));
  }
}

/** Closed rings whose nonzero union is the stroked area. Undefined when there is nothing to stroke. */
export function strokeRings(paths: EditPath[], stroke: StrokeSpec, o: ToolOptions): EditPath[] {
  const tol = Math.max(1e-4, OUTLINE_ACCURACY * frameScale(o.frame) * 0.15);
  const rings: Cubic[][] = [];
  const centres: Pt[] = [];
  for (const p of paths) {
    const c = p.anchors.length > 1 ? clean(p) : undefined;
    if (c) pathRings(c, stroke, tol, rings, centres);
  }
  // pathological input (every curve tighter than the stroke): thin the discs so the time stays bounded
  const every = Math.max(1, Math.ceil(centres.length / MAX_DISCS));
  for (let i = 0; i < centres.length; i += every) rings.push(disc(centres[i], stroke.width / 2));
  return rings.filter((r) => r.length > 1).map((r) => chainToPath(r, true));
}

export function outlineStroke(paths: EditPath[], stroke: StrokeSpec, o: ToolOptions, deps: PathToolsDeps): ToolResult {
  if (totalSegments(paths) > MAX_TOOL_SEGMENTS) return { ok: false, reason: 'too-complex', skippedOpen: 0 };
  if (!(stroke.width > 0)) return { ok: false, reason: 'no-stroke', skippedOpen: 0 };
  const rings = strokeRings(paths, stroke, o);
  if (!rings.length) return { ok: false, reason: 'empty', skippedOpen: 0 };
  const r = deps.booleans.run('union', [{ paths: rings, fillRule: 'nonzero' }], { frame: o.frame, tolerance: o.tolerance });
  return r.ok ? { ok: true, paths: r.paths, skippedOpen: 0 } : { ok: false, reason: r.reason, skippedOpen: 0 };
}

