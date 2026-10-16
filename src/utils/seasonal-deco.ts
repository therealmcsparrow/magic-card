import type { ShapeKind, ShapeOptions } from '../types';
import { clampRadii, insetRadii, Radii, shapeRingPath } from './ring-path';
import { flattenOutline, parseOutline } from './shape-outline';
import type { DecoMotif } from './seasonal-scenes';
import { seededRandom } from './seasonal-scenes';

/*
 * Border decorations (<mc-seasonal-deco>) as geometry: the element's outline (rounded rectangle
 * from its radii, or its shape from src/utils/shape-path.ts via the ring path source) as a dense
 * clockwise polyline, and per motif the points / paths to draw along it. Christmas lights hang on
 * a sagging wire along the whole outline, icicles under the top edge, frost in the corners, a
 * cobweb in the top-right corner, a pumpkin on the bottom edge, a flower vine round the bottom-left
 * corner. Sizes clamp to the element; motifs that do not fit are dropped. Pure (no DOM).
 */

export interface Pt {
  x: number;
  y: number;
}

/** A point on the outline with its unit tangent (clockwise) and unit inward normal. */
export interface OutlineSample extends Pt {
  tx: number;
  ty: number;
  nx: number;
  ny: number;
}

export interface DecoBox {
  w: number;
  h: number;
  radii: Radii;
  shape?: { kind: ShapeKind; options?: ShapeOptions };
}

export interface Bulb extends Pt {
  /** Rotation (deg) of the bulb hanging from its socket (0: pointing down). */
  angle: number;
  index: number;
}

export interface LightsLayout {
  wire: string;
  bulbs: Bulb[];
  /** Bulb scale (smaller on small elements). */
  scale: number;
  /** Distance of the wire inside the border edge. */
  inset: number;
}

export interface Icicle {
  d: string;
  /** Hanging point. */
  x: number;
  y: number;
  length: number;
}

export interface IciclesLayout {
  cap: string;
  icicles: Icicle[];
}

export interface FrostCorner extends Pt {
  radius: number;
  /** Crystal branches (stroked). */
  crystals: string;
}

export interface FrostLayout {
  /** The outline (for the edge glow and its clip). */
  outline: string;
  corners: FrostCorner[];
}

export interface CobwebLayout {
  threads: string;
  spiral: string;
  /** The spider and its thread. */
  spider: Pt & { thread: string; size: number };
}

export interface PumpkinLayout extends Pt {
  /** Width (px); the pumpkin sits on (x, y), its bottom centre. */
  size: number;
}

export interface VineLeaf extends Pt {
  angle: number;
  size: number;
}

export interface VineLayout {
  stem: string;
  tendrils: string;
  leaves: VineLeaf[];
  flowers: Array<Pt & { size: number; rotate: number }>;
}

export interface DecoLayout {
  /** Clip path of the element (motifs that stay inside it). */
  clip: string;
  lights?: LightsLayout;
  icicles?: IciclesLayout;
  frost?: FrostLayout;
  cobweb?: CobwebLayout;
  pumpkin?: PumpkinLayout;
  vine?: VineLayout;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const P = (x: number, y: number): Pt => ({ x, y });
const fmt = (p: Pt) => `${r2(p.x)} ${r2(p.y)}`;
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

/** A rounded rectangle (CSS radii, clamped like CSS) moved inward by `d`, clockwise from the top-left corner's end. */
function roundedOutline(w: number, h: number, radii: Radii, d: number): Pt[] {
  const x0 = d;
  const y0 = d;
  const x1 = w - d;
  const y1 = h - d;
  if (!(x1 > x0 && y1 > y0)) return [];
  const r = clampRadii(insetRadii(clampRadii(radii, w, h), d), x1 - x0, y1 - y0);
  const pts: Pt[] = [];
  const arc = (cx: number, cy: number, rx: number, ry: number, a0: number) => {
    const steps = Math.max(1, Math.ceil((Math.max(rx, ry) * Math.PI) / 2 / 1.5));
    for (let i = 0; i <= steps; i++) {
      const t = ((a0 + (90 * i) / steps) * Math.PI) / 180;
      pts.push(P(cx + rx * Math.cos(t), cy + ry * Math.sin(t)));
    }
  };
  arc(x1 - r.tr.x, y0 + r.tr.y, r.tr.x, r.tr.y, -90);
  arc(x1 - r.br.x, y1 - r.br.y, r.br.x, r.br.y, 0);
  arc(x0 + r.bl.x, y1 - r.bl.y, r.bl.x, r.bl.y, 90);
  arc(x0 + r.tl.x, y0 + r.tl.y, r.tl.x, r.tl.y, 180);
  // drop repeats (zero radii give the same corner point several times)
  return pts.filter((p, i) => i === 0 || dist(p, pts[i - 1]) > 1e-6).filter((p, i, a) => i < a.length - 1 || dist(p, a[0]) > 1e-6);
}

function signedArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** The element's outline moved inward by `inset` as a closed clockwise polyline (on screen); empty when nothing is left. */
export function decoOutline(box: DecoBox, inset = 0): Pt[] {
  let pts: Pt[];
  if (box.shape) {
    const o = parseOutline(shapeRingPath(box.shape.kind, box.w, box.h, box.shape.options, { inset }));
    pts = o ? flattenOutline(o, 24) : [];
  } else pts = roundedOutline(box.w, box.h, box.radii, inset);
  // y points down: clockwise on screen has a positive shoelace area
  return pts.length > 2 && signedArea(pts) < 0 ? pts.reverse() : pts;
}

export function polylineLength(pts: Pt[], closed = true): number {
  let len = 0;
  const n = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < n; i++) len += dist(pts[i], pts[(i + 1) % pts.length]);
  return len;
}

/** The point at arc length `s` (wrapping) of a closed polyline, with tangent and inward normal. */
function sampler(pts: Pt[]): { length: number; at: (s: number) => OutlineSample } {
  const cum = [0];
  for (let i = 0; i < pts.length; i++) cum.push(cum[i] + dist(pts[i], pts[(i + 1) % pts.length]));
  const length = cum[cum.length - 1];
  const at = (s0: number): OutlineSample => {
    const s = ((s0 % length) + length) % length;
    let lo = 0;
    let hi = pts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (cum[mid] <= s) lo = mid;
      else hi = mid - 1;
    }
    const a = pts[lo];
    const b = pts[(lo + 1) % pts.length];
    const seg = cum[lo + 1] - cum[lo] || 1;
    const t = (s - cum[lo]) / seg;
    const tx = (b.x - a.x) / seg;
    const ty = (b.y - a.y) / seg;
    // clockwise on screen: the inside is to the right of the direction of travel
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, tx, ty, nx: -ty, ny: tx };
  };
  return { length, at };
}

/** `n` points evenly spaced along the closed outline (half a gap from its start). */
export function samplesAlong(pts: Pt[], n: number, phase = 0.5): OutlineSample[] {
  if (pts.length < 2 || n <= 0) return [];
  const s = sampler(pts);
  return Array.from({ length: n }, (_, k) => s.at(((k + phase) * s.length) / n));
}

/** The outline point nearest to `p` (arc length and sample). */
function nearestOn(pts: Pt[], p: Pt): { s: number; sample: OutlineSample } {
  const sm = sampler(pts);
  let best = { s: 0, d: Infinity };
  let acc = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = dist(a, b);
    const t = len ? clamp(((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (len * len), 0, 1) : 0;
    const d = Math.hypot(a.x + (b.x - a.x) * t - p.x, a.y + (b.y - a.y) * t - p.y);
    if (d < best.d) best = { s: acc + t * len, d };
    acc += len;
  }
  return { s: best.s, sample: sm.at(best.s) };
}

const pathOf = (pts: Pt[], close = true) => (pts.length ? `M${pts.map(fmt).join('L')}${close ? 'Z' : ''}` : '');

/** A smooth open path through `pts` (Catmull-Rom as cubics). */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return '';
  let d = `M${fmt(pts[0])}`;
  for (let i = 0; i + 1 < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = P(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6);
    const c2 = P(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6);
    d += `C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d;
}

// ── Fitting ──

/** Smallest element side (px) each motif needs. */
export const MOTIF_MIN: Record<DecoMotif, number> = { lights: 36, icicles: 40, frost: 32, cobweb: 72, pumpkin: 72, vine: 72 };

/** The motifs that fit a w x h element (small elements drop the big motifs; lights also need room along the outline). */
export function fittingMotifs(motifs: readonly DecoMotif[], w: number, h: number): DecoMotif[] {
  const side = Math.min(w, h);
  return motifs.filter((m) => side >= MOTIF_MIN[m] && (m !== 'lights' || 2 * (w + h) >= 160) && (m !== 'icicles' || w >= 60));
}

// ── Motifs ──

const LIGHT_SPACING = 30;
export const LIGHT_INSET = 5;

/** Bulbs evenly spaced along the outline (the wire LIGHT_INSET inside the border), the wire sagging between them. */
export function lightsLayout(box: DecoBox): LightsLayout | undefined {
  const pts = decoOutline(box, LIGHT_INSET);
  if (pts.length < 3) return undefined;
  const len = polylineLength(pts);
  const n = clamp(Math.round(len / LIGHT_SPACING), 6, 40);
  const samples = samplesAlong(pts, n);
  const gap = len / n;
  const sag = clamp(gap * 0.14, 1.5, 4.5);
  const scale = r2(clamp(Math.min(box.w, box.h) / 110, 0.6, 0.9));
  let wire = `M${fmt(samples[0])}`;
  samples.forEach((a, i) => {
    const b = samples[(i + 1) % n];
    const tx = (b.x - a.x) / (dist(a, b) || 1);
    const ty = (b.y - a.y) / (dist(a, b) || 1);
    // gravity on runs across, a little inward on runs down the sides (control point: twice the dip)
    const nx = -ty;
    const ny = tx;
    const c = P((a.x + b.x) / 2 + nx * sag * 1.2 * Math.abs(ty), (a.y + b.y) / 2 + 2 * sag * Math.abs(tx) + ny * sag * 1.2 * Math.abs(ty));
    wire += `Q${fmt(c)} ${fmt(b)}`;
  });
  const bulbs = samples.map((s, i) => {
    // hang inward, pulled down a little by gravity, alternately tilted
    const hx = s.nx;
    const hy = s.ny + 0.8;
    const hl = Math.hypot(hx, hy);
    const dir = hl < 0.3 ? Math.atan2(s.ny, s.nx) : Math.atan2(hy / hl, hx / hl);
    const angle = (dir * 180) / Math.PI - 90 + (i % 2 ? 14 : -14);
    return { x: r2(s.x), y: r2(s.y), angle: Math.round(angle), index: i };
  });
  return { wire, bulbs, scale, inset: LIGHT_INSET };
}

/** Icicles under the top part of the outline (where it faces up), lengths varied from `seed`, and a snow cap. */
export function iciclesLayout(box: DecoBox, seed: string): IciclesLayout | undefined {
  const pts = decoOutline(box, 0.5);
  if (pts.length < 3) return undefined;
  const len = polylineLength(pts);
  const step = 6.5;
  const all = samplesAlong(pts, Math.max(8, Math.round(len / 2)));
  const rnd = seededRandom(`${seed}|icicles`);
  const maxLen = clamp(box.h * 0.2, 6, 18);
  // runs of the outline whose inside faces down (the top edge)
  const top = all.filter((s) => s.ny > 0.82);
  if (!top.length) return undefined;
  const icicles: Icicle[] = [];
  let last = -Infinity;
  for (const s of top.sort((a, b) => a.x - b.x)) {
    if (s.x - last < step) continue;
    last = s.x + rnd() * 2;
    const big = rnd() < 0.3;
    const length = r2(maxLen * (big ? 0.7 + rnd() * 0.3 : 0.25 + rnd() * 0.4));
    const w = r2(clamp(length * 0.38, 2.4, 5.4));
    const x = s.x;
    const y = s.y - 0.5;
    const tip = P(x + (rnd() - 0.5) * 1.2, y + length);
    const d =
      `M${r2(x - w / 2)} ${r2(y)}` +
      `C${r2(x - w / 2)} ${r2(y + length * 0.35)} ${r2(tip.x - w * 0.12)} ${r2(y + length * 0.75)} ${fmt(tip)}` +
      `C${r2(tip.x + w * 0.12)} ${r2(y + length * 0.75)} ${r2(x + w / 2)} ${r2(y + length * 0.35)} ${r2(x + w / 2)} ${r2(y)}Z`;
    icicles.push({ d, x: r2(x), y: r2(y), length });
  }
  // the snow cap: the top run of the outline, gently lumpy
  const capPts = top.sort((a, b) => a.x - b.x).filter((_, i) => i % 3 === 0).map((s, i) => P(s.x, s.y + 1 + (i % 2 ? 0.8 : -0.2) * (0.6 + rnd() * 0.6)));
  return { cap: smoothPath(capPts), icicles };
}

/** Frost: an edge glow along the outline and crystals growing in from each corner. */
export function frostLayout(box: DecoBox, seed: string): FrostLayout | undefined {
  const pts = decoOutline(box, 0);
  if (pts.length < 3) return undefined;
  const rnd = seededRandom(`${seed}|frost`);
  const size = clamp(Math.min(box.w, box.h) * 0.32, 14, 46);
  const centre = P(box.w / 2, box.h / 2);
  const corners = [P(0, 0), P(box.w, 0), P(box.w, box.h), P(0, box.h)].map((c) => {
    const { sample } = nearestOn(pts, c);
    const toC = P(centre.x - sample.x, centre.y - sample.y);
    const l = Math.hypot(toC.x, toC.y) || 1;
    const dir = Math.atan2(toC.y / l, toC.x / l);
    let crystals = '';
    // three fern branches fanning inward, each with paired side twigs
    for (const spread of [-0.55, 0, 0.55]) {
      const a = dir + spread + (rnd() - 0.5) * 0.25;
      const L = size * (spread === 0 ? 0.85 : 0.6) * (0.8 + rnd() * 0.3);
      const o = P(sample.x + Math.cos(dir) * 1.5, sample.y + Math.sin(dir) * 1.5);
      const end = P(o.x + Math.cos(a) * L, o.y + Math.sin(a) * L);
      crystals += `M${fmt(o)}L${fmt(end)}`;
      for (const k of [0.35, 0.6, 0.82]) {
        const b = P(o.x + Math.cos(a) * L * k, o.y + Math.sin(a) * L * k);
        const tw = L * (1 - k) * 0.55;
        for (const side of [-1, 1]) {
          const ta = a + side * 0.9;
          crystals += `M${fmt(b)}L${fmt(P(b.x + Math.cos(ta) * tw, b.y + Math.sin(ta) * tw))}`;
        }
      }
    }
    return { x: r2(sample.x), y: r2(sample.y), radius: r2(size * 1.25), crystals };
  });
  return { outline: pathOf(pts), corners };
}

/** A cobweb across the top-left corner, scaled to the corner radius, with a spider on a thread. */
export function cobwebLayout(box: DecoBox): CobwebLayout | undefined {
  const pts = decoOutline(box, 0);
  if (pts.length < 3) return undefined;
  const { sample } = nearestOn(pts, P(0, 0));
  const r = Math.max(box.radii.tl.x, box.radii.tl.y);
  const S = clamp(Math.max(46, r * 2.2), 30, Math.min(box.w, box.h) * 0.45);
  // the hub sits a little outside the outline (clipped), so the web looks anchored to the edge
  const gap = Math.min(dist(sample, P(0, 0)), S * 0.3);
  const inward = Math.atan2(sample.ny, sample.nx);
  const toCorner = Math.hypot(sample.x, sample.y) > 1e-6 ? Math.atan2(sample.y, sample.x) + Math.PI : inward + Math.PI;
  const hub = P(sample.x + Math.cos(toCorner) * gap, sample.y + Math.sin(toCorner) * gap);
  const spokes = 6;
  const angles = Array.from({ length: spokes }, (_, i) => inward - Math.PI / 4 - 0.1 + ((Math.PI / 2 + 0.2) * i) / (spokes - 1));
  let threads = '';
  for (const a of angles) threads += `M${fmt(hub)}L${fmt(P(hub.x + Math.cos(a) * S * 1.15, hub.y + Math.sin(a) * S * 1.15))}`;
  let spiral = '';
  for (const k of [0.2, 0.36, 0.53, 0.7, 0.86, 1]) {
    const rr = S * k;
    for (let i = 0; i + 1 < angles.length; i++) {
      const a = angles[i];
      const b = angles[i + 1];
      const p1 = P(hub.x + Math.cos(a) * rr, hub.y + Math.sin(a) * rr);
      const p2 = P(hub.x + Math.cos(b) * rr, hub.y + Math.sin(b) * rr);
      // each strand sags toward the hub
      const m = (a + b) / 2;
      const c = P(hub.x + Math.cos(m) * rr * 0.82, hub.y + Math.sin(m) * rr * 0.82);
      spiral += `${i === 0 ? `M${fmt(p1)}` : ''}Q${fmt(c)} ${fmt(p2)}`;
    }
  }
  // the spider hangs from the middle spoke
  const mid = angles[Math.floor(spokes / 2)];
  const from = P(hub.x + Math.cos(mid) * S * 0.62, hub.y + Math.sin(mid) * S * 0.62);
  const size = r2(clamp(S * 0.16, 5, 8));
  const at = P(from.x, from.y + S * 0.42);
  return { threads, spiral, spider: { x: r2(at.x), y: r2(at.y), size, thread: `M${fmt(from)}L${fmt(at)}` } };
}

/** A pumpkin sitting on the bottom edge near the bottom-right corner. */
export function pumpkinLayout(box: DecoBox): PumpkinLayout | undefined {
  const pts = decoOutline(box, 1);
  if (pts.length < 3) return undefined;
  const size = r2(clamp(Math.min(box.w, box.h) * 0.3, 20, 36));
  const all = samplesAlong(pts, Math.max(8, Math.round(polylineLength(pts) / 2)));
  const bottom = all.filter((s) => s.ny < -0.9);
  if (!bottom.length) return undefined;
  const right = Math.max(...bottom.map((s) => s.x));
  const want = right - size * 0.75;
  const spot = bottom.reduce((a, b) => (Math.abs(b.x - want) < Math.abs(a.x - want) ? b : a));
  return { x: r2(spot.x), y: r2(spot.y), size };
}

/** A flowering vine following the outline round the bottom-left corner. */
export function vineLayout(box: DecoBox, seed: string): VineLayout | undefined {
  const pts = decoOutline(box, 4);
  if (pts.length < 3) return undefined;
  const sm = sampler(pts);
  const rnd = seededRandom(`${seed}|vine`);
  const { s: s0 } = nearestOn(pts, P(0, box.h));
  // up the left side (with the clockwise direction) and along the bottom (against it), counter-clockwise from the top end
  const up = clamp(box.h * 0.55, 28, 100);
  const along = clamp(box.w * 0.36, 40, 150);
  const n = Math.max(8, Math.round((up + along) / 6));
  const path: OutlineSample[] = [];
  for (let k = 0; k <= n; k++) path.push(sm.at(s0 + up - ((up + along) * k) / n));
  const wob = path.map((p, k) => {
    const amp = 1.6 * Math.sin(((k / n) * (up + along)) / 3.5);
    return P(p.x + p.nx * amp, p.y + p.ny * amp);
  });
  const leaves: VineLeaf[] = [];
  const flowers: Array<Pt & { size: number; rotate: number }> = [];
  const leafEvery = Math.max(2, Math.round(n / 14));
  path.forEach((p, k) => {
    if (k === 0 || k === n || k % leafEvery) return;
    // travelling counter-clockwise: the direction is minus the tangent
    const dir = (Math.atan2(-p.ty, -p.tx) * 180) / Math.PI;
    const side = (k / leafEvery) % 2 ? 1 : -1;
    leaves.push({ x: r2(wob[k].x), y: r2(wob[k].y), angle: Math.round(dir + side * 55), size: r2(7 + rnd() * 3) });
  });
  for (const t of [0.12, 0.38, 0.62, 0.88]) {
    const k = Math.round(t * n);
    const p = wob[k];
    const q = path[k];
    flowers.push({ x: r2(p.x + q.nx * 3), y: r2(p.y + q.ny * 3), size: r2(t === 0.38 ? 10 : 7.5 + rnd() * 2), rotate: Math.round(rnd() * 72) });
  }
  // little curls at both ends
  const curl = (p: Pt, q: OutlineSample, sign: number) => {
    const ax = -q.tx * sign;
    const ay = -q.ty * sign;
    const a = P(p.x + ax * 4 + q.nx * 2, p.y + ay * 4 + q.ny * 2);
    const b = P(a.x + q.nx * 3, a.y + q.ny * 3);
    const c = P(b.x - ax * 2.5, b.y - ay * 2.5);
    return `M${fmt(p)}Q${fmt(a)} ${fmt(b)}Q${fmt(c)} ${fmt(P(c.x - q.nx * 1.4, c.y - q.ny * 1.4))}`;
  };
  return {
    stem: smoothPath(wob),
    tendrils: curl(wob[0], path[0], -1) + curl(wob[n], path[n], 1),
    leaves,
    flowers,
  };
}

/** The box seen in a mirror (left and right swapped): its radii swap sides. */
function mirrorBox(box: DecoBox): DecoBox {
  const r = box.radii;
  return { ...box, radii: { tl: r.tr, tr: r.tl, br: r.bl, bl: r.br } };
}

/** A path of absolute x y pairs (M / L / Q / C only) mirrored across the box's width. */
const mirrorPath = (d: string, w: number) => {
  let i = 0;
  return d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (n) => (i++ % 2 === 0 ? String(r2(w - Number(n))) : n));
};

/**
 * The cobweb laid out for the top-left corner of the mirrored box, moved to the top-right corner:
 * titles usually start top-left, so the web stays clear of them.
 */
function mirrorCobweb(l: CobwebLayout | undefined, w: number): CobwebLayout | undefined {
  if (!l) return undefined;
  const s = l.spider;
  return {
    threads: mirrorPath(l.threads, w),
    spiral: mirrorPath(l.spiral, w),
    spider: { ...s, x: r2(w - s.x), thread: mirrorPath(s.thread, w) },
  };
}

/** Every motif of `motifs` that fits the box, laid out. */
export function layoutDeco(motifs: readonly DecoMotif[], box: DecoBox, seed = 'mc'): DecoLayout {
  const fit = fittingMotifs(motifs, box.w, box.h);
  const out: DecoLayout = { clip: pathOf(decoOutline(box, 0)) };
  if (fit.includes('lights')) out.lights = lightsLayout(box);
  if (fit.includes('icicles')) out.icicles = iciclesLayout(box, seed);
  if (fit.includes('frost')) out.frost = frostLayout(box, seed);
  if (fit.includes('cobweb')) out.cobweb = mirrorCobweb(cobwebLayout(mirrorBox(box)), box.w);
  if (fit.includes('pumpkin')) out.pumpkin = pumpkinLayout(box);
  if (fit.includes('vine')) out.vine = vineLayout(box, seed);
  return out;
}

/**
 * Room (px: top, right, bottom, left) the content keeps from the edge so decorations never cover
 * it: the hanging light bulbs on every side, icicles under the top, the pumpkin above the bottom,
 * the vine along the bottom-left; cobweb and frost are faint corner backdrops (under the content).
 * The card pads its element to at least this (like a shape's inset). Undefined: nothing to keep.
 */
export function decoInsets(motifs: readonly DecoMotif[]): [number, number, number, number] | undefined {
  const out: [number, number, number, number] = [0, 0, 0, 0];
  const atLeast = (i: number, v: number) => (out[i] = Math.max(out[i], v));
  for (const m of motifs) {
    if (m === 'lights') for (let i = 0; i < 4; i++) atLeast(i, 20);
    else if (m === 'icicles') atLeast(0, 20);
    else if (m === 'pumpkin') atLeast(2, 30);
    else if (m === 'vine') {
      atLeast(2, 18);
      atLeast(3, 20);
    }
  }
  return out.some((v) => v > 0) ? out : undefined;
}
