import type { SVGTemplateResult } from 'lit';
import { svg } from 'lit';
import { fmt, rails, toD } from '../sampler';
import type { LineCtx } from '../registry';
import { dashMotion, highlight, memo, stroke } from './util';

/* solid, dashed, dotted and double rail. */

export const solid = (c: LineCtx): SVGTemplateResult => svg`${stroke(c, { d: c.geo.d, w: c.w, cls: 'line' })}${c.hl && !c.nShapes ? highlight(c, c.geo.d) : ''}`;

/** Static dashes; with no shapes travelling they slide along the line (the classic moving-dash mode). */
export function dashed(c: LineCtx): SVGTemplateResult {
  const { dashLength: dl, dashGap: dg } = c.l;
  const move = c.hl && !c.nShapes;
  return stroke(c, { d: c.geo.d, w: c.w, dash: `${fmt(dl)} ${fmt(dg)}`, cap: 'butt', cls: move ? 'line dash an' : 'line', style: move ? dashMotion(c, dl + dg) : undefined });
}

/** A dashed line with dash length 0 and round caps: each dot is `width` wide. */
export function dotted(c: LineCtx): SVGTemplateResult {
  const p = c.l.dashGap + c.w;
  const move = c.hl && !c.nShapes;
  return stroke(c, { d: c.geo.d, w: c.w, dash: `0.01 ${fmt(p)}`, cap: 'round', cls: move ? 'line dash an' : 'line', style: move ? dashMotion(c, p) : undefined });
}

/** Two rails at +-(gap + width) / 2, each `width` wide; shapes travel the centre line between them. */
export function double(c: LineCtx): SVGTemplateResult {
  const ds = memo(`r${c.geo.d}|${c.l.railGap}|${c.w}`, () => rails(c.S, c.l.railGap, c.w).map(toD));
  return svg`${ds.map((d) => stroke(c, { d, w: c.w }))}${c.hl && !c.nShapes ? highlight(c, c.geo.d) : ''}`;
}
