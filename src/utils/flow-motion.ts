// Compositor-friendly travel along a flow line: a dot or shape riding a path is animated with
// `transform` keyframes taken from the path, not `offset-distance`, so a running flow costs the
// main thread nothing per frame. Pure: no DOM.

/** A place on a path; `a` is the direction of travel in degrees, for shapes that turn. */
export interface Stop {
  x: number;
  y: number;
  a?: number;
  /** Opacity at this stop (keyframes also fade the shape); absent: not animated. */
  o?: number;
}

/** Two decimals; a non-finite value (NaN, Infinity) becomes 0, so it never reaches the CSS text. */
const r2 = (v: number): number => (Number.isFinite(v) ? Math.round(v * 100) / 100 || 0 : 0);

/**
 * `@keyframes name`: the stops from 0 % to 100 % at constant speed (the percent of a stop is its share
 * of the polyline's length, so a straight line is just two keyframes). `reverse`: shapes face the
 * other way (a flow that runs backwards plays these frames in reverse). Angles are made continuous.
 */
export function travelFrames(name: string, P: readonly Stop[], reverse = false): string {
  const cum = [0];
  for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y));
  const total = cum[cum.length - 1];
  let prev = 0;
  const frames = P.map((p, i) => {
    let turn = '';
    if (p.a !== undefined) {
      const a = p.a + (reverse ? 180 : 0);
      prev = i ? a + Math.round((prev - a) / 360) * 360 : a;
      turn = ` rotate(${r2(prev)}deg)`;
    }
    return `${total && Number.isFinite(total) ? Math.round((cum[i] / total) * 1e5) / 1e3 : i ? 100 : 0}%{transform:translate(${r2(p.x)}px,${r2(p.y)}px)${turn}${p.o === undefined || !Number.isFinite(p.o) ? '' : ';opacity:' + p.o}}`;
  });
  return `@keyframes ${name}{${frames.join('')}}`;
}

/**
 * The points of a path `d` as flow-geometry writes it (absolute M L H V C A; arcs are quarter turns,
 * rx = ry): lines by their ends, curves and arcs cut into short straight pieces.
 */
export function flattenPath(d: string): Stop[] {
  const P: Stop[] = [];
  let x = 0;
  let y = 0;
  for (const [, c, args] of d.matchAll(/([MLHVCA])([^MLHVCA]*)/g)) {
    const v = (args.match(/-?\d*\.?\d+/g) ?? []).map(Number);
    if (c === 'C') {
      for (let i = 1; i <= 24; i++) {
        const t = i / 24;
        const u = 1 - t;
        const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
        P.push({ x: w[0] * x + w[1] * v[0] + w[2] * v[2] + w[3] * v[4], y: w[0] * y + w[1] * v[1] + w[2] * v[3] + w[3] * v[5] });
      }
      [x, y] = v.slice(4);
    } else if (c === 'A') {
      const [r, , , , sweep, ex, ey] = v;
      const h = Math.hypot(ex - x, ey - y) / 2 || 1;
      const k = Math.sqrt(Math.max(0, r * r - h * h)) / h;
      // the centre lies to one side of the chord: the one the sweep flag turns around
      let cx = 0;
      let cy = 0;
      for (const g of [1, -1]) {
        cx = (x + ex) / 2 - (g * k * (ey - y)) / 2;
        cy = (y + ey) / 2 + (g * k * (ex - x)) / 2;
        if (((x - cx) * (ey - cy) - (y - cy) * (ex - cx) > 0) === !!sweep) break;
      }
      const a0 = Math.atan2(y - cy, x - cx);
      const da = (sweep ? 1 : -1) * (Math.PI / 2);
      for (let i = 1; i <= 6; i++) P.push({ x: cx + r * Math.cos(a0 + (da * i) / 6), y: cy + r * Math.sin(a0 + (da * i) / 6) });
      [x, y] = [ex, ey];
    } else {
      x = c === 'V' ? x : v[0];
      y = c === 'H' ? y : c === 'V' ? v[0] : v[1];
      P.push({ x, y });
    }
  }
  return P;
}
