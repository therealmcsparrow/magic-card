import { svg, type SVGTemplateResult } from 'lit';
import { toD, wavy } from '../sampler';
import type { LineCtx } from '../registry';
import { highlight, memo, stroke } from './util';

/*
 * wave and zigzag: the offset line of the sampler (still shape, tapered at the ends and next to elbow
 * corners). Electric zigzag stacks three seeded variants switched by a CSS steps animation; under
 * lite / minimal tiers and reduced motion it is one still zigzag.
 */

const hash = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

export function waveLine(c: LineCtx): SVGTemplateResult {
  const { l, S, geo } = c;
  const kind = l.line === 'zigzag' ? 'zigzag' : 'wave';
  const seed = hash(c.f.id);
  const variants = kind === 'zigzag' && l.electric && c.hl && c.o.quality === 'full' ? 3 : 1;
  const ds = Array.from({ length: variants }, (_, k) =>
    memo(`w${geo.d}|${kind}|${l.amplitude}|${l.wavelength}|${variants > 1 ? seed + k + 1 : 0}`, () => toD(wavy(S, kind, l.amplitude, l.wavelength, variants > 1 ? seed + k + 1 : 0))),
  );
  const lines =
    variants > 1
      ? svg`<g class="el an">${ds.map((d, k) => stroke(c, { d, w: c.w, cls: 'ln zz an', style: `animation-delay: ${(-k * 0.12).toFixed(2)}s` }))}</g>`
      : stroke(c, { d: ds[0], w: c.w });
  return svg`${lines}${c.hl ? highlight(c, ds[0], l.wavelength / 3) : ''}`;
}
