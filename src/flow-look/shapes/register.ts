import { html, svg, type SVGTemplateResult, type TemplateResult } from 'lit';
import { FLOW_SPIN_SHAPES, type FlowShape } from '../../contracts/flow-look';
import { at, fmt, rnd } from '../sampler';
import { travelFrames } from '../../utils/flow-motion';
import { stops } from '../motion';
import { flowLookRegistry, unmix, type LineCtx } from '../registry';
import { body, turns } from './geometry';

/*
 * The travelling shapes, registered as flowLookRegistry.shapes by the side-effect import in
 * ../parts.ts. Motion (flow-look rules 1 and 5):
 * - css: one element per shape playing transform keyframes sampled from the path (translate, plus
 *   rotate to the travel direction for shapes that turn, 180 degrees more for a flow that runs backwards)
 *   with a negative animation-delay: a compositor animation, no main-thread work per frame (offset-path
 *   re-ran style, layout and paint for every shape every frame). Spin is a second animation on an inner
 *   child (never the same element).
 * - pulse: shapes stay at fixed places on the line (static transform) and an inner child pulses with a
 *   period of travel time / count, rippling by phase.
 * The card budget counts elements (spin weighs 2 in mc-flows' allocateBudget), so nothing here weighs.
 */

const MAX = 40;
const SPIN: readonly FlowShape[] = FLOW_SPIN_SHAPES;
const s3 = (v: number): string => String(+v.toFixed(3) || 0);

type FlowOf = LineCtx['f'];

/** Shapes this flow wants after the tier caps (0 while idle is the caller's job). */
function wanted(f: FlowOf, length: number, quality: string): number {
  const px = f.look.spacing?.px;
  const n = px ? Math.min(MAX, Math.max(1, Math.floor(length / px))) : f.dots;
  return quality === 'minimal' ? Math.min(n, 2) : n;
}

/** Stable per-flow seed. */
const seedOf = (id: string): number => [...id].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0, 2166136261);

/** The kind of shape number k: alternate on every second one; icon without an id or without ha-icon is a dot (rule 8). */
function kindOf(c: LineCtx, k: number): FlowShape {
  const { l } = c;
  const kind = k % 2 && l.alternate ? l.alternate : l.shape;
  return kind === 'icon' && !(l.icon && customElements.get('ha-icon')) ? 'dot' : kind;
}

/** Where shape k starts, as a fraction of the path (travel), or sits (pulse: always even). */
function phases(c: LineCtx, n: number): number[] {
  const { l, S, f } = c;
  const L = Math.max(1, S.L);
  if (l.motion === 'pulse') return Array.from({ length: n }, (_, k) => (k + 0.5) / n);
  const sp = l.spacing;
  if (!sp) return Array.from({ length: n }, (_, k) => k / n);
  const seed = seedOf(f.id);
  let s = 0;
  return Array.from({ length: n }, (_, k) => {
    const here = s;
    s += sp.px * (sp.mode === 'random' ? 0.5 + rnd(seed, k) : 1);
    return (here / L) % 1;
  });
}

function render(c: LineCtx): { svg?: SVGTemplateResult; html?: TemplateResult } {
  const { f, l, o, geo, S } = c;
  const n = c.nShapes;
  if (!n) return {};
  const pulse = l.motion === 'pulse';
  const heavy = l.line === 'tube' || l.line === 'cable';
  const col = unmix(l.shapeColor ?? f.color);
  // on a tube or cable the line colour would hide the shape: white with an outline unless a colour is set
  const plain = heavy && l.shapeColor === undefined;
  const vars = `--mc-sc: ${plain ? '#fff' : col.paint}; --mc-so: ${plain ? 1 : col.opacity}`;
  const ph = phases(c, n);
  const sign = f.direction < 0 ? -1 : 1;
  const dur = `${f.speedS.toFixed(3)}s`;
  const period = f.speedS / Math.max(1, wanted(f, geo.length, o.quality));
  const gid = `${c.id}-cg`;
  const v = l.sizeVariation / 100;
  const seed = seedOf(f.id);
  const parts: SVGTemplateResult[] = [];
  const icons: TemplateResult[] = [];
  // keyframes of this flow: mv (no turn), ta (turns with the travel), tr (turns, flow runs backwards); only the ones used are written
  const used = new Set<'mv' | 'ta' | 'tr'>();
  const frame = (turns: boolean): string => {
    const v = turns ? (sign < 0 ? 'tr' : 'ta') : 'mv';
    used.add(v);
    return `${c.id}-${v}`;
  };
  let comet = false;
  for (let k = 0; k < n; k++) {
    const kind = kindOf(c, k);
    const size = Math.max(1, f.dotSize * (1 + (rnd(seed, k + 99) * 2 - 1) * v));
    const turn = turns(kind, l.iconRotate);
    const spin = l.spin && !pulse && SPIN.includes(kind);
    if (kind === 'comet') comet = true;
    const glow = f.glow > 0 && kind !== 'icon' ? svg`<circle class="gl" r=${fmt(size / 2 + f.glow)}></circle>` : '';
    const place = pulse ? at(S, ph[k] * S.L) : undefined;
    const angle = place && turn ? (Math.atan2(place.ty, place.tx) * 180) / Math.PI + (sign < 0 ? 180 : 0) : 0;
    const beat = `animation-duration: ${s3(period)}s; animation-delay: ${s3(-(k / n) * period)}s`;
    if (kind === 'icon') {
      const px = Math.max(14, size);
      const icon = html`<ha-icon icon=${l.icon!} style=${`--mdc-icon-size: ${fmt(px)}px`}></ha-icon>`;
      const box = `${vars}; width: ${fmt(px)}px; height: ${fmt(px)}px`;
      if (place) {
        icons.push(html`<div class="ic" data-shape="icon" aria-hidden="true" style=${`${box}; left: ${fmt(place.x - px / 2)}px; top: ${fmt(place.y - px / 2)}px; transform: rotate(${fmt(angle)}deg)`}><div class="pl an" style=${beat}>${icon}</div></div>`);
      } else {
        // the box sits centred on the travelled point (the keyframes move its origin)
        icons.push(html`<div class="ic dot an" data-shape="icon" aria-hidden="true" style=${`${box}; left: ${fmt(-px / 2)}px; top: ${fmt(-px / 2)}px; animation-name: ${frame(turn)}; animation-duration: ${dur}; animation-delay: ${s3(-f.speedS * ph[k])}s; animation-direction: ${c.dir}`}>${spin ? html`<div class="spi an">${icon}</div>` : icon}</div>`);
      }
      continue;
    }
    const b = body(kind, size, heavy, gid);
    if (place) {
      parts.push(svg`<g transform=${`translate(${fmt(place.x)} ${fmt(place.y)}) rotate(${fmt(angle)})`}><g class="pl an" data-shape=${kind} style=${beat}>${glow}${b}</g></g>`);
      continue;
    }
    const delay = s3(-f.speedS * ph[k]);
    const shape = spin ? svg`<g class="sp an">${b}</g>` : b;
    const m = `animation-name: ${frame(turn)}; animation-duration: ${dur}; animation-delay: ${delay}s; animation-direction: ${c.dir}`;
    if (kind === 'dot') {
      parts.push(svg`${f.glow > 0 ? svg`<circle class="glow gl an" r=${fmt(size / 2 + f.glow)} style=${m}></circle>` : ''}<circle class=${heavy ? 'dot an sf ol' : 'dot an sf'} data-shape="dot" r=${fmt(size / 2)} style=${m}></circle>`);
    } else {
      parts.push(svg`<g class="dot an" data-shape=${kind} style=${m}>${glow}${shape}</g>`);
    }
  }
  const defs = comet
    ? svg`<defs><linearGradient id=${gid} x1="1" y1="0" x2="0" y2="0"><stop offset="0" style="stop-color: var(--mc-sc); stop-opacity: 0.7"></stop><stop offset="1" style="stop-color: var(--mc-sc); stop-opacity: 0"></stop></linearGradient></defs>`
    : '';
  // a <style> element swallows the rest of a lit template: it is a template of its own
  const keyframes = used.size
    ? svg`<style .textContent=${[...used].map((v) => travelFrames(`${c.id}-${v}`, stops(S, v !== 'mv'), v === 'tr')).join('')}></style>`
    : '';
  return {
    ...(parts.length ? { svg: svg`${keyframes}<g class="dots" style=${vars}>${defs}${parts}</g>` } : used.size ? { svg: keyframes as SVGTemplateResult } : {}),
    ...(icons.length ? { html: html`${icons}` } : {}),
  };
}

flowLookRegistry.shapes = {
  requested: (f, geo, quality) => (f.active && f.direction !== 0 ? wanted(f, geo.length, quality) : 0),
  render,
};
