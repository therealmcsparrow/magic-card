import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { FlowCap } from '../contracts/flow-look';
import { at, fmt } from './sampler';
import { unmix, type LineCtx } from './registry';
import { arrival } from './arrival';

/*
 * Caps at the two ends of the line, in the travel direction (reversed travel swaps them), drawn over
 * the line and the shapes inside the flow's group, with the arrival effect last. Round node: a filled
 * circle of two thirds of the cap size (2 x width at the default 3 x width) with a 1 px ring in the
 * card background. Arrowhead: a filled triangle, cap size long and 0.8 x cap size wide, tip on the end
 * point and pointing along the tangent; a start arrowhead points out of the line (away from travel).
 * Colour: the start cap in `color`, the end cap in the gradient end colour; idle: the idle colour.
 */

function cap(c: LineCtx, kind: FlowCap, s: number, dir: 1 | -1, end: boolean): SVGTemplateResult | typeof nothing {
  if (kind === 'none') return nothing;
  const p = at(c.S, s);
  const p0 = end && c.active && c.f.colorTo !== undefined ? unmix(c.f.colorTo) : c.paint;
  const fill = `fill: ${p0.paint}${p0.opacity < 1 ? `; fill-opacity: ${fmt(p0.opacity)}` : ''}`;
  const size = c.l.capSize;
  if (kind === 'round') {
    return svg`<circle class="cap" cx=${fmt(p.x)} cy=${fmt(p.y)} r=${fmt(size / 3)} style=${`${fill}; stroke: var(--card-background-color, #fff); stroke-width: 1px`}></circle>`;
  }
  // tip on the point, pointing along `dir` * tangent (end) or against the travel (start)
  const tx = p.tx * dir;
  const ty = p.ty * dir;
  const h = size * 0.4;
  const bx = p.x - tx * size;
  const by = p.y - ty * size;
  return svg`<path class="cap" d=${`M${fmt(p.x)} ${fmt(p.y)}L${fmt(bx - ty * h)} ${fmt(by + tx * h)}L${fmt(bx + ty * h)} ${fmt(by - tx * h)}Z`} style=${`${fill}; stroke: none`}></path>`;
}

export function ends(c: LineCtx): SVGTemplateResult | undefined {
  const { startCap, endCap } = c.l;
  const fx = arrival(c);
  if (startCap === 'none' && endCap === 'none' && !fx) return undefined;
  const rev = c.f.direction < 0;
  const L = c.S.L;
  // travel start / end on the path, and the way the travel runs there (+1 along geo.d)
  return svg`${cap(c, startCap, rev ? L : 0, rev ? 1 : -1, false)}${cap(c, endCap, rev ? 0 : L, rev ? -1 : 1, true)}${fx ?? nothing}`;
}
