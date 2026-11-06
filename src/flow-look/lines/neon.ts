import { svg, type SVGTemplateResult } from 'lit';
import { fmt } from '../sampler';
import type { LineCtx } from '../registry';
import { stroke } from './util';

// neon: outer glow, mid stroke, core. Flicker off: one static feGaussianBlur (radius at most 8 px); flicker on: stacked
// translucent strokes with an opacity animation, no filter. Tiers lite and minimal draw flicker as off. The core is white
// on a dark card and the line colour with a black stroke on a light one. Idle: a still core, no glow.

export function neon(c: LineCtx): SVGTemplateResult {
  const { l, geo, w, S } = c;
  const core = l.neonCore !== undefined ? stroke(c, { d: geo.d, w, color: l.neonCore })
    : c.o.dark ? stroke(c, { d: geo.d, w, color: '#fff', op: 0.85 })
    : svg`${stroke(c, { d: geo.d, w })}${stroke(c, { d: geo.d, w, color: '#000', op: 0.45 })}`;
  if (!c.active) return svg`${stroke(c, { d: geo.d, w })}`;
  const glow = c.f.glow;
  const flick = l.flicker !== 'off' && !c.o.reduced && c.o.quality === 'full';
  let outer: SVGTemplateResult | '' = '';
  if (glow > 0 && flick) {
    outer = svg`${[1, 0.6, 0.3].map((k, i) => stroke(c, { d: geo.d, w: w + glow * k * 2, op: 0.14 + i * 0.1 }))}`;
  } else if (glow > 0) {
    const [x0, y0, x1, y1] = S.box;
    const pad = w + glow * 3;
    const fid = `${c.id}-f`;
    outer = svg`<defs><filter id=${fid} filterUnits="userSpaceOnUse" x=${fmt(x0 - pad)} y=${fmt(y0 - pad)} width=${fmt(x1 - x0 + 2 * pad)} height=${fmt(y1 - y0 + 2 * pad)}><feGaussianBlur stdDeviation=${fmt(Math.min(8, glow) / 2)}></feGaussianBlur></filter></defs><g filter="url(#${fid})">${stroke(c, { d: geo.d, w: w + 2, op: 0.55 })}</g>`;
  }
  const body = svg`${outer}${stroke(c, { d: geo.d, w: w + 2, op: 0.4 })}${core}`;
  return flick ? svg`<g class=${l.flicker === 'strong' ? 'fk-t an' : 'fk-s an'}>${body}</g>` : body;
}
