import { svg } from 'lit';
import type { FlowLookRegistry, LineCtx } from '../registry';
import { unmix } from '../paint';

/*
 * The default travelling shape: round dots on the centre line, like today's classic dots (T4 replaces
 * the registry's `shapes` with the full set). Pure CSS offset-path motion (rule 1), never rotates.
 */

export const defaultShapes: FlowLookRegistry['shapes'] = {
  requested: (f, _geo, quality) => (f.active && f.direction !== 0 ? Math.min(f.dots, quality === 'minimal' ? 2 : f.dots) : 0),
  render(c: LineCtx) {
    const { f, geo, nShapes: n } = c;
    if (!n) return {};
    const { paint, opacity } = unmix(f.color);
    const op = opacity < 1 ? `; fill-opacity: ${opacity}` : '';
    const dots = Array.from({ length: n }, (_, k) => {
      const m = `offset-path: path('${geo.d}'); animation-duration: ${f.speedS.toFixed(3)}s; animation-delay: ${+(-(f.speedS * k) / n).toFixed(3) || 0}s; animation-direction: ${c.dir}`;
      return svg`${f.glow > 0 ? svg`<circle class="glow an" r=${f.dotSize / 2 + f.glow} style=${m}></circle>` : ''}<circle class="dot an" r=${f.dotSize / 2} style=${m}></circle>`;
    });
    return { svg: svg`<g class="dots" style="fill: ${paint}${op}">${dots}</g>` };
  },
};
