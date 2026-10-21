import { svg, nothing, type SVGTemplateResult } from 'lit';
import { FLOW_GEOMETRY } from '../contracts/flow-look';
import { at, fmt } from './sampler';
import { defaultStroke, unmix, type LineCtx, type Paint, type StrokeSpec } from './registry';
import { memo, sampled } from './lines/util';

/*
 * Gradient paint of the flow-look chunk (flow-look 1.0.0). `color` -> `colorTo` along the
 * travel direction, only while flowing (idle = the idle colour).
 * - Straight centre line: one userSpaceOnUse linearGradient from the travel start to the travel end.
 *   Exact there, whatever offset line (wave, rails) is painted, and dashes need nothing special.
 * - Any other route: N = clamp(ceil(L / 10), 4, 32) windows of the same `d` (stroke-dasharray plus
 *   dashoffset), each opaque in its arc-length colour, overlapping the next by 1 px, all in one
 *   <g> whose opacity is the mean of the two end alphas. Abutting segments leave hairlines and
 *   translucent overlaps darken, so they stay opaque.
 * - A dashed, dotted or liquid stroke on such a route: the dash pattern (with its caps and its
 *   animation) moves to a mask path and the segment group is masked by it. The segments only
 *   colour; the mask shapes. This is how gradients and dashes combine.
 * - Colours the chunk cannot mix in JS (var(), names, color-mix): the start colour as a whole path
 *   and the end colour as a whole path under a mask of grey windows (same count, same overlap)
 *   whose luminance is the blend. No colour maths needed, so entity state colours work too.
 */

export type RGBA = [number, number, number, number];

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const num = (x: string, full: number): number => (x.endsWith('%') ? (parseFloat(x) * full) / 100 : parseFloat(x));

/** hex (3, 4, 6, 8 digits), rgb[a]() and hsl[a]() in comma or space syntax; anything else: undefined. */
export function parseColour(v: string): RGBA | undefined {
  const s = v.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(s);
  if (hex) {
    const h = hex[1].length < 5 ? hex[1].replace(/./g, '$&$&') : hex[1];
    const n = (i: number): number => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length > 6 ? n(6) / 255 : 1];
  }
  const fn = /^(rgb|hsl)a?\(([^()]+)\)$/.exec(s);
  if (!fn) return undefined;
  const p = fn[2].trim().split(/[\s,/]+/);
  if (p.length < 3 || p.length > 4) return undefined;
  const a = p[3] === undefined ? 1 : num(p[3], 1);
  let c: number[];
  if (fn[1] === 'rgb') c = [0, 1, 2].map((i) => num(p[i], 255));
  else {
    const h = parseFloat(p[0]);
    const sat = num(p[1], 1);
    const l = num(p[2], 1);
    const k = sat * Math.min(l, 1 - l);
    c = [0, 8, 4].map((o) => 255 * (l - k * Math.max(-1, Math.min(((o + h / 30) % 12) - 3, 9 - ((o + h / 30) % 12), 1))));
  }
  return [...c, a].every(Number.isFinite) ? [clamp(c[0], 0, 255), clamp(c[1], 0, 255), clamp(c[2], 0, 255), clamp(a, 0, 1)] : undefined;
}

/** Straight centre line (every sample within 0.05 px of the chord): the linearGradient is exact. */
const straight = (c: LineCtx): boolean =>
  memo(`g${c.geo.d}`, () => {
    const P = c.S.pts;
    const a = P[0];
    const b = P[P.length - 1];
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return P.every((p) => Math.abs((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)) / L < 0.05);
  });

/** Ids of one flow's gradients, masks: `<flow id>-g<n>`, unique per stroke call. */
const used = new WeakMap<LineCtx, number>();
const nextId = (c: LineCtx): string => {
  const n = (used.get(c) ?? 0) + 1;
  used.set(c, n);
  return `${c.id}-g${n}`;
};

const stop = (p: Paint): string => `stop-color: ${p.paint}; stop-opacity: ${fmt(p.opacity)}`;
const px = (v: number): string => `${fmt(v)}px`;

export function gradientStroke(c: LineCtx, s: StrokeSpec): SVGTemplateResult {
  const to = c.f.colorTo;
  if (s.color !== undefined || !c.active || to === undefined || c.S.L < 1 || /\bmark\b/.test(s.cls ?? '')) return defaultStroke(c, s);
  const id = nextId(c);
  const rev = c.f.direction < 0;
  const A = unmix(c.f.color);
  const B = unmix(to);

  if (straight(c)) {
    const p0 = at(c.S, rev ? c.S.L : 0);
    const p1 = at(c.S, rev ? 0 : c.S.L);
    return svg`<defs><linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${fmt(p0.x)} y1=${fmt(p0.y)} x2=${fmt(p1.x)} y2=${fmt(p1.y)}><stop offset="0" style=${stop(A)}></stop><stop offset="1" style=${stop(B)}></stop></linearGradient></defs>${defaultStroke({ ...c, paint: { paint: `url(#${id})`, opacity: 1 } }, s)}`;
  }

  const Lp = sampled(s.d).L;
  if (Lp < 1) return defaultStroke(c, s);
  const { segmentPx, min, max, overlapPx } = FLOW_GEOMETRY.gradient;
  const n = clamp(Math.ceil(Lp / segmentPx), min, max);
  const win = Lp / n;
  const ra = parseColour(A.paint);
  const rb = parseColour(B.paint);
  const mix = !!(ra && rb);
  const alpha = ((A.opacity * (ra?.[3] ?? 1) + B.opacity * (rb?.[3] ?? 1)) / 2) * (s.op ?? 1);
  const cls = s.cls ?? 'ln';
  const hasLine = /\bline\b/.test(cls);
  const body = cls.replace(/\bline\b/, 'ln');
  const round = (s.cap ?? (/\bdash\b/.test(cls) ? 'butt' : 'round')) === 'round';
  const w = s.w;
  const [x0, y0, x1, y1] = c.S.box;
  const pad = w + 48;
  const box = { x: fmt(x0 - pad), y: fmt(y0 - pad), width: fmt(x1 - x0 + 2 * pad), height: fmt(y1 - y0 + 2 * pad) };

  /** The windows; `colour(t)` is the paint at travel position t. Round caps only on the two ends (drawn first, so the next window covers their inner caps). */
  const windows = (colour: (t: number) => string): SVGTemplateResult[] => {
    const order = Array.from({ length: n }, (_, i) => i);
    if (round) order.unshift(order.pop()!);
    return order.map((i) => {
      const t = rev ? 1 - (i + 0.5) / n : (i + 0.5) / n;
      const cap = round && (i === 0 || i === n - 1) ? 'round' : 'butt';
      return svg`<path class="ln" d=${s.d} style=${`stroke: ${colour(t)}; stroke-width: ${px(w)}; stroke-linecap: ${cap}; stroke-dasharray: ${fmt(win + overlapPx)} ${fmt(Lp * 2)}; stroke-dashoffset: ${px(-i * win)}`}></path>`;
    });
  };
  const lerp = (t: number): string => `rgb(${[0, 1, 2].map((k) => Math.round(ra![k] + (rb![k] - ra![k]) * t)).join(', ')})`;
  const grey = (t: number): string => `rgb(${[0, 0, 0].fill(Math.round(t * 255)).join(', ')})`;

  const dashed = s.dash !== undefined;
  const dmask = `${id}-d`;
  const gmask = `${id}-m`;
  // plain whole-path stroke (no dash: a dash lives in the outer mask)
  const whole = (paint: string): SVGTemplateResult => svg`<path class="ln" d=${s.d} style=${`stroke: ${paint}; stroke-width: ${px(w)}; stroke-linecap: ${round ? 'round' : 'butt'}`}></path>`;
  const inner = mix
    ? windows(lerp)
    : [whole(A.paint), svg`<g mask=${`url(#${gmask})`}>${whole(B.paint)}</g>`];
  const defs = svg`${dashed ? svg`<mask id=${dmask} maskUnits="userSpaceOnUse" x=${box.x} y=${box.y} width=${box.width} height=${box.height}>${defaultStroke(c, { ...s, color: '#fff', op: 1, cls: body })}</mask>` : nothing}${mix ? nothing : svg`<mask id=${gmask} maskUnits="userSpaceOnUse" x=${box.x} y=${box.y} width=${box.width} height=${box.height}>${windows(grey)}</mask>`}`;
  // while shapes travel on a plain line the line is their lighter track (the .line rule of flows-css)
  const track = hasLine && c.nShapes > 0 && (c.l.line === 'solid' || c.l.line === 'dashed' || c.l.line === 'dotted');
  const opacity = track ? `calc(${fmt(alpha)} * var(--mc-flow-track-opacity, ${c.o.dark ? 0.4 : 0.55}))` : fmt(alpha);
  const hit = hasLine ? svg`<path class="line" d=${s.d} style=${`stroke: transparent; stroke-width: ${px(w)}`}></path>` : nothing;
  return svg`${hit}<defs>${defs}</defs><g class="grad" style=${`opacity: ${opacity}`} mask=${dashed ? `url(#${dmask})` : nothing}>${inner}</g>`;
}
