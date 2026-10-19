import { svg, type SVGTemplateResult } from 'lit';
import { FLOW_LOOK_THEME } from '../../contracts/flow-look';
import { at, fmt } from '../sampler';
import type { LineCtx } from '../registry';
import { memo, stroke } from './util';

/*
 * cable: a 1 px outline, the sheath (cable_color, else the line colour under a 35 % black stroke:
 * a darker shade without color-mix), the core (width - 2) in the line colour, and with `twisted`
 * diagonal strand marks every width x 1.6 px at 30 % opacity. It never animates.
 */

const OUT = FLOW_LOOK_THEME.cableOutline;

export function cable(c: LineCtx): SVGTemplateResult {
  const { geo, w, l } = c;
  const sheath = l.cableColor !== undefined ? stroke(c, { d: geo.d, w, color: l.cableColor }) : svg`${stroke(c, { d: geo.d, w })}${stroke(c, { d: geo.d, w, color: '#000', op: 0.35 })}`;
  const marks = l.twisted ? stroke(c, { d: strands(c), w: 1.2, color: '#000', op: 0.3, cap: 'butt' }) : '';
  return svg`${stroke(c, { d: geo.d, w: w + 2, color: OUT.paint, op: OUT.opacity })}${sheath}${stroke(c, { d: geo.d, w: Math.max(1, w - 2) })}${marks}`;
}

/** Diagonal marks across the cable (45 degrees to the path), one every width x 1.6 px. */
function strands(c: LineCtx): string {
  return memo(`t${c.geo.d}|${c.w}`, () => {
    const h = Math.max(1, c.w / 2 - 0.5);
    const step = c.w * 1.6;
    let d = '';
    for (let s = step / 2; s < c.S.L; s += step) {
      const p = at(c.S, s);
      // from (-n, -t) to (+n, +t), n = (-ty, tx)
      d += `M${fmt(p.x + p.ty * h - p.tx * h)} ${fmt(p.y - p.tx * h - p.ty * h)}L${fmt(p.x - p.ty * h + p.tx * h)} ${fmt(p.y + p.tx * h + p.ty * h)}`;
    }
    return d;
  });
}
