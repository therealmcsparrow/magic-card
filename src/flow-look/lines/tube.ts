import { svg, type SVGTemplateResult } from 'lit';
import { FLOW_LOOK_THEME } from '../../contracts/flow-look';
import { at, fmt, lane } from '../sampler';
import { travelFrames } from '../../utils/flow-motion';
import type { LineCtx } from '../registry';
import { laneD, memo, span, stroke } from './util';

/*
 * tube: glass fill, a 1 px wall (a masked stroke, so the inside stays see-through), the liquid
 * (inset 2 px, rounded, from the start end, as long as the level), a highlight along the upper
 * edge, a 2 px level mark across the tube at the liquid surface (shown while the level is below
 * full or while idle, so a pale liquid still reads) and rising bubbles on lanes of the liquid.
 * Idle: no liquid, no bubbles, the wall and the mark at the start end stay (AC5).
 */

const T = FLOW_LOOK_THEME;

export function tube(c: LineCtx): SVGTemplateResult {
  const { geo, S, w, level, l } = c;
  const L = S.L;
  const tint = l.tubeTint !== undefined ? { color: l.tubeTint, op: 1 } : { color: T.tubeTint.paint, op: T.tubeTint.opacity };
  const lw = Math.max(1, w - 4);
  const [s0, s1] = span(c, level);
  const len = s1 - s0;
  const [x0, y0, x1, y1] = S.box;
  const pad = w + 4;
  const mid = `${c.id}-m`;
  // liquid: the path cut by a dash (start end: s0)
  const liquid =
    level <= 0
      ? ''
      : stroke(c, {
          d: geo.d,
          w: lw,
          op: 0.85,
          cap: 'round',
          dash: level >= 1 ? undefined : `${fmt(len)} ${fmt(L * 2)}`,
          dashOffset: level >= 1 ? undefined : -s0,
        });
  const high = level > 0 && w >= 8 ? stroke(c, { d: laneD(c, -(w / 2 - 3), s0, s1), w: 2, color: '#fff', op: 0.35, cap: 'round' }) : '';
  let mark: SVGTemplateResult | '' = '';
  if (level < 1) {
    const p = at(S, c.f.direction < 0 ? s0 : s1);
    const h = w / 2;
    mark = stroke(c, { d: `M${fmt(p.x + p.ty * h)} ${fmt(p.y - p.tx * h)}L${fmt(p.x - p.ty * h)} ${fmt(p.y + p.tx * h)}`, w: 2, color: T.tubeWall.paint, op: T.tubeWall.opacity, cap: 'butt' });
  }
  return svg`<defs><mask id=${mid} maskUnits="userSpaceOnUse" x=${fmt(x0 - pad)} y=${fmt(y0 - pad)} width=${fmt(x1 - x0 + 2 * pad)} height=${fmt(y1 - y0 + 2 * pad)}>
      <path d=${geo.d} style="stroke: #fff; stroke-width: ${fmt(w)}px"></path><path d=${geo.d} style="stroke: #000; stroke-width: ${fmt(Math.max(0, w - 2))}px"></path></mask></defs>
    ${stroke(c, { d: geo.d, w, color: tint.color, op: tint.op })}${liquid}${high}
    <g mask="url(#${mid})">${stroke(c, { d: geo.d, w, color: T.tubeWall.paint, op: T.tubeWall.opacity })}</g>${mark}${bubbles(c, s0, s1)}`;
}

/** Bubbles ride three lanes inside the liquid at the flow speed (transform keyframes along each lane, never rotated). */
function bubbles(c: LineCtx, s0: number, s1: number): SVGTemplateResult | '' {
  const n = c.nBubbles;
  if (!n || s1 - s0 < 4) return '';
  const room = Math.max(1, c.w - 4) / 4;
  const lanes = [0, 1, 2].map((i) => memo(`bp${c.geo.d}|${c.w}|${i}|${s0}|${s1}`, () => lane(c.S, (i - 1) * room, s0, s1)));
  // one keyframe set per lane; a <style> element swallows the rest of a lit template: it is a template of its own
  const keyframes = svg`<style .textContent=${lanes.map((p, i) => travelFrames(`${c.id}-b${i}`, p)).join('')}></style>`;
  const speed = c.f.speedS;
  const rMax = Math.max(1.5, c.w / 3);
  return svg`${keyframes}<g class="bubbles" style="fill: #fff; fill-opacity: 0.55">${Array.from({ length: n }, (_, i) => {
    const dur = speed * (1.15 + 0.2 * (i % 3));
    const r = 1.5 + ((i * 7) % 5) * ((rMax - 1.5) / 4);
    return svg`<circle class="dot an" r=${fmt(r)} style="animation-name: ${c.id}-b${i % 3}; animation-duration: ${dur.toFixed(3)}s; animation-delay: ${(-(dur * i) / n).toFixed(3)}s; animation-direction: ${c.dir}"></circle>`;
  })}</g>`;
}
