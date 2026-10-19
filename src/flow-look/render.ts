import { svg, nothing, type SVGTemplateResult } from 'lit';
import type { FlowGeometry } from '../utils/flow-geometry';
import type { FlowLookParts, FlowLookQuality, FlowLookRenderOptions, FlowWithLook } from '../contracts/flow-look';
import { at, fmt } from './sampler';
import { flowLookRegistry, unmix, type LineCtx } from './registry';
import { arrivalWanted } from './arrival';
import { cable } from './lines/cable';
import { double, dashed, dotted, solid } from './lines/plain';
import { neon } from './lines/neon';
import { tube } from './lines/tube';
import { waveLine } from './lines/wavy';
import { centre, sampled, stroke } from './lines/util';

const LINES: Record<string, (c: LineCtx) => SVGTemplateResult> = { solid, dashed, dotted, double, wave: waveLine, zigzag: waveLine, tube, neon, cable };
/** Styles that paint on `path.line` themselves (the others get a transparent centre path). */
const OWN_LINE = new Set(['solid', 'dashed', 'dotted']);

const flowing = (f: FlowWithLook): boolean => f.active && f.direction !== 0;

/** Bubbles this flow wants after the tier caps (tube only; none while idle or at the minimum). */
export function bubblesWanted(f: FlowWithLook, quality: FlowLookQuality): number {
  const l = f.look;
  return l.line === 'tube' && flowing(f) && l.level > 0 ? Math.min(l.bubbles, quality === 'lite' ? 2 : quality === 'minimal' ? 0 : 8) : 0;
}

/** Moving elements this flow asks for (slot.requested): travelling shapes plus bubbles. */
export function wanted(f: FlowWithLook, geo: FlowGeometry, reduced: boolean, quality: FlowLookQuality): number {
  if (reduced || !flowing(f)) return 0;
  const shapes = flowLookRegistry.shapes.requested(f, geo, quality);
  // the arrival ring / splash only plays when shapes arrive, and counts toward the card budget
  return shapes + bubblesWanted(f, quality) + (shapes > 0 ? arrivalWanted(f, quality) : 0);
}

/** Reduced motion and direction: a 14 px chevron every 160 px (one at 55 % on lines under 160 px). */
function chevrons(c: LineCtx): SVGTemplateResult | typeof nothing {
  if (!c.o.reduced || !c.active || c.l.endCap === 'arrow') return nothing;
  const { S } = c;
  const n = Math.max(1, Math.floor(S.L / 160));
  const sign = c.f.direction < 0 ? -1 : 1;
  let d = '';
  for (let i = 0; i < n; i++) {
    const s = n === 1 ? S.L * 0.55 : ((i + 0.5) * S.L) / n;
    const p = at(c.S, s);
    // chevron pointing along the travel: tip 4 ahead, wings 7 across and 3 behind
    const tx = p.tx * sign;
    const ty = p.ty * sign;
    const pt = (a: number, b: number): string => `${fmt(p.x + tx * a - ty * b)} ${fmt(p.y + ty * a + tx * b)}`;
    d += `M${pt(-3, -7)}L${pt(4, 0)}L${pt(-3, 7)}`;
  }
  return stroke(c, { d, w: 2.5, cap: 'round', cls: 'ln mark' });
}

export function renderFlow(f: FlowWithLook, geo: FlowGeometry, o: FlowLookRenderOptions): FlowLookParts {
  const l = f.look;
  const active = flowing(f);
  const S = sampled(geo.d);
  const shapeReq = o.reduced || !active || o.motion === 'none' ? 0 : flowLookRegistry.shapes.requested(f, geo, o.quality);
  const nShapes = Math.min(shapeReq, o.count);
  const c: LineCtx = {
    f,
    l,
    geo,
    o,
    S,
    id: `mc-flow-${o.index}`,
    active,
    w: f.width,
    paint: unmix(active ? f.color : f.idleColor),
    nShapes,
    nBubbles: o.motion === 'none' || o.reduced ? 0 : Math.min(bubblesWanted(f, o.quality), Math.max(0, o.count - nShapes)),
    level: active ? l.level : 0,
    dir: f.direction < 0 ? 'reverse' : 'normal',
    hl: active && !o.reduced && o.quality !== 'minimal',
  };
  // a path with no length cannot be styled: the plain line
  const style = S.L < 1 ? 'solid' : l.line;
  const body = LINES[style](c);
  const shapes = nShapes ? flowLookRegistry.shapes.render(c) : {};
  const faint = nShapes > 0 && OWN_LINE.has(style);
  return {
    svg: svg`<g class="flow" data-flow=${f.id} data-line=${style} data-dots=${faint ? '' : nothing}>${OWN_LINE.has(style) ? nothing : centre(c)}${body}${chevrons(c)}${shapes.svg ?? nothing}${flowLookRegistry.ends?.(c) ?? nothing}</g>`,
    ...(shapes.html ? { html: shapes.html } : {}),
  };
}
