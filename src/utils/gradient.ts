import { svg, SVGTemplateResult } from 'lit';
import { safeColor } from './safe-css';

/*
 * A gradient colour value: `linear-gradient(<n>deg, c1, c2[, ...])` or
 * `radial-gradient(circle, c1, ...)`. CSS targets (backgrounds) take the string as is; SVG and CSS
 * variable targets read it here, and every stop has to be a safe colour (2 to 8, up to two levels
 * of parentheses each, like color-mix(in srgb, rgb(1, 2, 3), red)).
 */

export interface Gradient {
  radial: boolean;
  /** Degrees, for linear (default 180: top to bottom). */
  angle: number;
  /** The safe colours, positions removed. */
  stops: string[];
}

const HEAD = /^\s*(to\s|circle|ellipse|at\s|closest|farthest|-?[\d.]+(deg|turn|rad|grad)$)[\w\s.%-]*$/i;

/** Longest gradient string read: the stop pattern below backtracks on unclosed parentheses, so the input is capped first. */
export const MAX_GRADIENT_LENGTH = 600;

/** The gradient in `v`, or undefined when it is not one or has an unsafe stop. */
export function parseGradient(v: unknown): Gradient | undefined {
  if (typeof v !== 'string' || v.length > MAX_GRADIENT_LENGTH) return undefined;
  const m = /^\s*(linear|radial)-gradient\((.*)\)\s*$/is.exec(v as string);
  // top-level comma parts; anything the pattern skips (a stray parenthesis, an empty part) fails the join
  const a = m?.[2].match(/(?:[^(),]|\((?:[^()]|\([^()]*\))*\))+/g);
  if (!m || !a || a.join(',') !== m[2]) return undefined;
  const head = HEAD.test(a[0]) ? a.shift()! : '';
  const stops = a.map((s) => safeColor(s.replace(/(\s+-?[\d.]+[a-z%]*)+\s*$/i, '')));
  if (a.length < 2 || a.length > 8 || !stops.every(Boolean)) return undefined;
  return { radial: m[1] === 'radial', angle: /deg$/.test(head) ? parseFloat(head) : 180, stops: stops as string[] };
}

const SIDES: Record<string, number> = { top: 0, right: 90, bottom: 180, left: 270 };

/**
 * The angle of a linear gradient's head in degrees: `Ndeg`, `to <side>` (top 0, right 90, bottom 180,
 * left 270) or `to <side> <side>` (corners 45 / 135 / 225 / 315, an approximation on non-square boxes),
 * 180 without a head. Undefined for radial gradients and strings that are not a safe gradient.
 * parseGradient() itself keeps reading only degrees.
 */
export function gradientHeadAngle(v: unknown): number | undefined {
  if (typeof v !== 'string' || v.length > MAX_GRADIENT_LENGTH) return undefined;
  const g = parseGradient(v);
  if (!g || g.radial) return undefined;
  const head = /^\s*linear-gradient\(\s*to\s+([a-z]+)(?:\s+([a-z]+))?\s*,/i.exec(v as string);
  if (!head) return g.angle;
  const a = SIDES[head[1].toLowerCase()];
  if (a === undefined) return undefined;
  if (!head[2]) return a;
  const b = SIDES[head[2].toLowerCase()];
  if (b === undefined || a % 180 === b % 180) return undefined;
  const [vert, horiz] = a % 180 === 0 ? [a, b] : [b, a]; // vertical side (0 / 180), horizontal side (90 / 270)
  if (vert === 0) return horiz === 90 ? 45 : 315;
  return horiz === 90 ? 135 : 225;
}

const r3 = (n: number) => +n.toFixed(3);

/**
 * An SVG linearGradient in user space over `box`, like CSS `linear-gradient(<angle>deg, ...)` on that
 * box (the same angle on non-square boxes); the stops are spaced evenly.
 */
export function linearGradientSvg(id: string, angle: number, stops: string[], box: { x: number; y: number; w: number; h: number }): SVGTemplateResult {
  const a = (angle * Math.PI) / 180;
  const sin = Math.sin(a);
  const cos = Math.cos(a);
  const half = (Math.abs(box.w * sin) + Math.abs(box.h * cos)) / 2;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${r3(cx - sin * half)} y1=${r3(cy + cos * half)} x2=${r3(cx + sin * half)} y2=${r3(cy - cos * half)}>${stops.map(
    (c, i) => svg`<stop offset=${r3(stops.length > 1 ? i / (stops.length - 1) : 0)} stop-color=${c}></stop>`,
  )}</linearGradient>`;
}
