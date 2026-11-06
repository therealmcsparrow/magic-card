import { svg, type SVGTemplateResult } from 'lit';
import type { FlowShape } from '../../contracts/flow-look';
import { fmt } from '../sampler';

// The shape bodies, centred on 0,0 and pointing along +x (the tangent). `s` is the shape size (the dot_size key).
// Colour comes from the classes of shapes/css.ts; `ol` adds the outline used on tube and cable.

const poly = (pts: number[][]): string => 'M' + pts.map((p) => fmt(p[0]) + ' ' + fmt(p[1])).join('L') + 'Z';

/** Shapes that follow the tangent; dot and bubble are round, icon only when shape_icon_rotate. */
export const turns = (k: FlowShape, iconRotate: boolean): boolean => (k === 'icon' ? iconRotate : k !== 'dot' && k !== 'bubble');

export function body(kind: FlowShape, s: number, ol: boolean, gid: string): SVGTemplateResult {
  const r = s / 2;
  const f = ol ? 'sf ol' : 'sf';
  const fill = (pts: number[][]): SVGTemplateResult => svg`<path class=${f} d=${poly(pts)}></path>`;
  switch (kind) {
    case 'arrow':
      return fill([[r * 1.1, 0], [-r, -r * 0.9], [-r * 0.4, 0], [-r, r * 0.9]]);
    case 'chevron': {
      const d = `M${fmt(-r / 2)} ${fmt(-r)}L${fmt(r / 2)} 0L${fmt(-r / 2)} ${fmt(r)}`;
      const w = Math.max(1.5, s * 0.28);
      return svg`${ol ? svg`<path class="so" d=${d} stroke-width=${fmt(w + 2)}></path>` : ''}<path class="ss" d=${d} stroke-width=${fmt(w)}></path>`;
    }
    case 'square':
      return svg`<rect class=${f} x=${fmt(-r)} y=${fmt(-r)} width=${fmt(s)} height=${fmt(s)} rx="1"></rect>`;
    case 'diamond':
      return fill([[r * 1.2, 0], [0, -r * 0.8], [-r * 1.2, 0], [0, r * 0.8]]);
    case 'star':
      return fill(Array.from({ length: 10 }, (_, i) => [Math.cos((i * Math.PI) / 5) * r * (i % 2 ? 0.45 : 1.1), Math.sin((i * Math.PI) / 5) * r * (i % 2 ? 0.45 : 1.1)]));
    case 'comet':
      return svg`<path d=${poly([[0, -r], [-4 * s, 0], [0, r]])} style="fill: url(#${gid})"></path><circle class=${f} r=${fmt(r)}></circle>`;
    case 'spark':
      // a bolt 1.4 s long, tip forward
      return fill([[0.15, -1], [-0.5, 0.15], [-0.05, 0.15], [-0.2, 1], [0.5, -0.25], [0.05, -0.25]].map(([x, y]) => [y * 0.7 * s, x * 0.7 * s]));
    case 'bubble': {
      const h = r * 0.6;
      const p = (a: number): string => `${fmt(Math.cos(a) * h)} ${fmt(Math.sin(a) * h)}`;
      return svg`<circle class="bb" r=${fmt(Math.max(0.5, r - 0.75))}></circle><path class="hl" d=${`M${p(3.49)}A${fmt(h)} ${fmt(h)} 0 0 1 ${p(4.36)}`}></path>`;
    }
    case 'drop': {
      const a = s * 0.6;
      const b = s * 0.4;
      return svg`<path class=${f} d=${`M${fmt(a)} 0C${fmt(s * 0.3)} ${fmt(-s * 0.1)} ${fmt(s * 0.1)} ${fmt(-b)} ${fmt(-s * 0.2)} ${fmt(-b)}A${fmt(b)} ${fmt(b)} 0 0 0 ${fmt(-s * 0.2)} ${fmt(b)}C${fmt(s * 0.1)} ${fmt(b)} ${fmt(s * 0.3)} ${fmt(s * 0.1)} ${fmt(a)} 0Z`}></path>`;
    }
    default:
      return svg`<circle class=${f} r=${fmt(r)}></circle>`;
  }
}
