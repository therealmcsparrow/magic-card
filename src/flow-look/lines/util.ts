import { svg, type SVGTemplateResult } from 'lit';
import { fmt, lane, sample, toD, type Sampled, type XY } from '../sampler';
import { travelFrames } from '../../utils/flow-motion';
import { stops } from '../motion';
import { flowLookRegistry, type LineCtx, type StrokeSpec } from '../registry';

/* Shared helpers of the line modules. */

export const stroke = (c: LineCtx, s: StrokeSpec): SVGTemplateResult => flowLookRegistry.stroke(c, s);

/** Small caches keyed by geometry + parameters: sampling and offsets run once per geometry change, never per frame. */
const cache = new Map<string, unknown>();
export function memo<T>(key: string, make: () => T): T {
  let v = cache.get(key) as T | undefined;
  if (v === undefined) {
    if (cache.size >= 96) cache.clear();
    v = make();
    cache.set(key, v);
  }
  return v;
}

export const sampled = (d: string): Sampled => memo('s' + d, () => sample(d));

/** An offset line as a path string (cached). */
export const laneD = (c: LineCtx, off: number, s0 = 0, s1 = c.S.L): string => memo(`l${c.geo.d}|${off}|${s0}|${s1}`, () => toD(lane(c.S, off, s0, s1)));

export const polyD = (P: XY[]): string => toD(P);

/** Where the liquid / progress lies along the path: [from s, to s], starting at the travel start. */
export const span = (c: LineCtx, level: number): [number, number] => {
  const len = c.S.L * level;
  return c.f.direction < 0 ? [c.S.L - len, c.S.L] : [0, len];
};

/** Animation style of a dash pattern with period `p` (px) moving along the line at the flow speed. */
export const dashMotion = (c: LineCtx, p: number): string =>
  `animation-duration: ${(c.geo.length > 0 ? (c.f.speedS * p) / c.geo.length : c.f.speedS).toFixed(3)}s; animation-direction: ${c.dir}; --mc-flow-shift: ${-fmt(p)}px`;

/** The centre line as the hit / selection path: path.line (rule 7), transparent when the style paints elsewhere. */
export const centre = (c: LineCtx): SVGTemplateResult =>
  svg`<path class="line" d=${c.geo.d} style="stroke: transparent; stroke-width: ${fmt(c.w)}px"></path>`;

/** Most highlight dashes on one line. */
const MAX_HIGHLIGHTS = 24;

/**
 * The moving highlight: short light dashes sliding along `d` (a wave's offset line, or the centre
 * line). Each dash is a small bar that travels the whole line with transform keyframes (a compositor
 * animation); an animated `stroke-dashoffset` would re-run style, paint and commit of the whole
 * layer every frame. The dashes are spread evenly over the line, about 2.5 dash lengths apart (never
 * more than 24), and move at the flow speed. A bar cannot bend, so bending styles (wave, zigzag)
 * draw none.
 */
export function highlight(c: LineCtx, d: string, max = Infinity): SVGTemplateResult {
  const S = d === c.geo.d ? c.S : sampled(d);
  const len = Math.max(3, Math.min(max, Math.max(4, c.w * 2)));
  const n = Math.min(MAX_HIGHLIGHTS, Math.max(1, Math.round(S.L / (len * 2.5))));
  // one lap takes as long as the old dash pattern needed to cover the line once
  const lap = c.geo.length > 0 ? (c.f.speedS * S.L) / c.geo.length : c.f.speedS;
  const name = `${c.id}-hl`;
  const bar = Array.from(
    { length: n },
    (_, k) =>
      svg`<rect class="hlp an" x=${fmt(-len / 2)} y=${fmt(-c.w / 2)} width=${fmt(len)} height=${fmt(c.w)} style=${`fill: #fff; fill-opacity: 0.5; animation: ${name} ${lap.toFixed(3)}s linear ${(-(lap * k) / n).toFixed(3)}s infinite ${c.dir}`}></rect>`,
  );
  // a <style> element swallows the rest of a lit template: it is a template of its own
  const keyframes = svg`<style .textContent=${travelFrames(name, stops(S, true))}></style>`;
  return svg`${keyframes}<g class="hlg">${bar}</g>`;
}
