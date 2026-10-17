import { safeColor } from './animation';

/*
 * A gradient colour value (ADR 0009): `linear-gradient(<n>deg, c1, c2[, ...])` or
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

/** The gradient in `v`, or undefined when it is not one or has an unsafe stop. */
export function parseGradient(v: unknown): Gradient | undefined {
  const m = /^\s*(linear|radial)-gradient\((.*)\)\s*$/is.exec(v as string);
  // top-level comma parts; anything the pattern skips (a stray parenthesis, an empty part) fails the join
  const a = m?.[2].match(/(?:[^(),]|\((?:[^()]|\([^()]*\))*\))+/g);
  if (!m || !a || a.join(',') !== m[2]) return undefined;
  const head = HEAD.test(a[0]) ? a.shift()! : '';
  const stops = a.map((s) => safeColor(s.replace(/(\s+-?[\d.]+[a-z%]*)+\s*$/i, '')));
  if (a.length < 2 || a.length > 8 || !stops.every(Boolean)) return undefined;
  return { radial: m[1] === 'radial', angle: /deg$/.test(head) ? parseFloat(head) : 180, stops: stops as string[] };
}
