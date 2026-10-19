import { svg, type SVGTemplateResult } from 'lit';
import type { FlowLookQuality, FlowWithLook } from '../contracts/flow-look';
import { at, fmt } from './sampler';
import { unmix, type LineCtx } from './registry';

/*
 * P2 arrival effect at the To module: a 1.5 px ring growing from 0 to the arrival size (diameter) and
 * fading in 450 ms; `splash` adds 6 droplets that fly out 0.6 x size in the same time. It repeats
 * every time a shape arrives: the period is the travel time / shapes (evenly spaced shapes). Pure CSS
 * (transform and opacity on class `an`: paused offscreen, none under reduced motion, and not drawn
 * then). The keyframes are constant text with the generated flow id and numbers, inline in the
 * group, so the shared css stays as it is. Not drawn while idle, in tier minimal, under pulse (resolve
 * sets arrival none), or when no shape travels.
 */

const MS = 0.45;
const DROPS = 6;

/** Moving elements the effect adds to the card budget (ring 1, splash 7; none in tier minimal). */
export const arrivalWanted = (f: FlowWithLook, quality: FlowLookQuality): number => (f.look.arrival === 'none' || quality === 'minimal' ? 0 : f.look.arrival === 'splash' ? 1 + DROPS : 1);

export function arrival(c: LineCtx): SVGTemplateResult | undefined {
  const { l, S } = c;
  if (l.arrival === 'none' || !c.hl || c.nShapes < 1 || S.L < 1) return undefined;
  const p = at(S, c.f.direction < 0 ? 0 : S.L);
  const period = Math.max(0.1, c.f.speedS / c.nShapes);
  const end = Math.min(100, (MS / period) * 100);
  const frames = (name: string, from: string, to: string, o0: number): string => `@keyframes ${c.id}-${name}{0%{opacity:${o0};transform:${from}}${fmt(end)}%{opacity:0;transform:${to}}}`;
  const col = c.f.colorTo !== undefined ? unmix(c.f.colorTo) : c.paint;
  const anim = (name: string): string => `animation: ${c.id}-${name} ${fmt(period)}s ease-out infinite; opacity: 0`;
  const colour = (prop: string): string => `${prop}: ${col.paint}${col.opacity < 1 ? `; ${prop}-opacity: ${fmt(col.opacity)}` : ''}`;
  const R = l.arrivalSize / 2;
  const ring = svg`<circle class="an" r=${fmt(R)} style=${`fill: none; ${colour('stroke')}; stroke-width: 1.5px; vector-effect: non-scaling-stroke; ${anim('rg')}; transform: scale(0)`}></circle>`;
  const drops =
    l.arrival === 'splash'
      ? Array.from({ length: DROPS }, (_, i) => {
          const a = ((i + 0.5) / DROPS) * Math.PI * 2;
          const d = 0.6 * l.arrivalSize;
          return svg`<circle class="an" r="1.6" style=${`${colour('fill')}; --dx: ${fmt(Math.cos(a) * d)}px; --dy: ${fmt(Math.sin(a) * d)}px; ${anim('sp')}`}></circle>`;
        })
      : [];
  const css = frames('rg', 'scale(0)', 'scale(1)', 0.9) + (drops.length ? frames('sp', 'translate(0px,0px)', 'translate(var(--dx),var(--dy))', 1) : '');
  // a <style> element swallows the rest of a lit template: it is a template of its own
  const keyframes = svg`<style .textContent=${css}></style>`;
  return svg`<g class="arrival" pointer-events="none" transform=${`translate(${fmt(p.x)} ${fmt(p.y)})`}>${keyframes}${ring}${drops}</g>`;
}
