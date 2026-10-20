import { svg } from 'lit';
import type { FlowLookRegistry, LineCtx } from '../registry';
import { travelFrames } from '../../utils/flow-motion';
import { stops } from '../motion';
import { unmix } from '../paint';

/*
 * The default travelling shape: round dots on the centre line, like today's classic dots (T4 replaces
 * the registry's `shapes` with the full set). Pure CSS motion (rule 1: transform keyframes along the line), never rotates.
 */

export const defaultShapes: FlowLookRegistry['shapes'] = {
  requested: (f, _geo, quality) => (f.active && f.direction !== 0 ? Math.min(f.dots, quality === 'minimal' ? 2 : f.dots) : 0),
  render(c: LineCtx) {
    const { f, nShapes: n } = c;
    if (!n) return {};
    const { paint, opacity } = unmix(f.color);
    const op = opacity < 1 ? `; fill-opacity: ${opacity}` : '';
    const name = `${c.id}-mv`;
    const dots = Array.from({ length: n }, (_, k) => {
      const m = `animation-name: ${name}; animation-duration: ${f.speedS.toFixed(3)}s; animation-delay: ${+(-(f.speedS * k) / n).toFixed(3) || 0}s; animation-direction: ${c.dir}`;
      return svg`${f.glow > 0 ? svg`<circle class="glow an" r=${f.dotSize / 2 + f.glow} style=${m}></circle>` : ''}<circle class="dot an" r=${f.dotSize / 2} style=${m}></circle>`;
    });
    // a <style> element swallows the rest of a lit template: it is a template of its own
    const keyframes = svg`<style .textContent=${travelFrames(name, stops(c.S, false))}></style>`;
    return { svg: svg`${keyframes}<g class="dots" style="fill: ${paint}${op}">${dots}</g>` };
  },
};
