import { BUILTIN_SHAPES, type BuiltinShape } from '../contracts/particles-v2';
import { svgMaskUrl } from '../anim-studio/compile';

// The built-in particle shapes, drawn on a 24 x 24 grid as path data only. On the card a slot with a built-in shape
// renders <i data-s="star">; SHAPES_CSS styles every such slot on the page, so it goes into the shared stylesheet once
// (key SHAPES_KEY).

export interface ShapeDraw {
  d: string;
  /** Stroked (ring, line): width on the 24 grid; else filled. */
  stroke?: number;
}

export const BUILTIN_DRAW: Record<BuiltinShape, ShapeDraw> = {
  circle: { d: 'M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z' },
  square: { d: 'M5 5h14v14H5z' },
  triangle: { d: 'M12 4l8 15H4z' },
  star: { d: 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z' },
  heart: { d: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z' },
  ring: { d: 'M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z', stroke: 3 },
  line: { d: 'M6 19L18 5', stroke: 3 },
  spark: { d: 'M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z' },
};

export const isBuiltin = (s: unknown): s is BuiltinShape => typeof s === 'string' && (BUILTIN_SHAPES as string[]).includes(s);

/** One built-in shape as `<path>` markup on the 24 grid (paint from the parent: fill / color). */
export function builtinPath(b: BuiltinShape): string {
  const s = BUILTIN_DRAW[b];
  return s.stroke ? `<path d="${s.d}" fill="none" stroke="currentColor" stroke-width="${s.stroke}" stroke-linecap="round"/>` : `<path d="${s.d}"/>`;
}

/** Key of the shared shape rules in the card's animation stylesheet. */
export const SHAPES_KEY = 'mcp-shapes';

const mask = (b: BuiltinShape): string => {
  const url = svgMaskUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${builtinPath(b)}</svg>`);
  return `-webkit-mask:${url} center/contain no-repeat;mask:${url} center/contain no-repeat`;
};

/** Rules for every built-in shape slot (`.mc-anim-fx > i[data-s]`): a dot and a square need no mask. */
export const SHAPES_CSS: string = [
  '.mc-anim-fx>i[data-s]{background:currentColor}',
  '.mc-anim-fx>i[data-s="circle"]{border-radius:50%}',
  '.mc-anim-fx>i[data-s="square"]{border-radius:0}',
  ...BUILTIN_SHAPES.filter((b) => b !== 'circle' && b !== 'square').map((b) => `.mc-anim-fx>i[data-s="${b}"]{${mask(b)}}`),
].join('\n');
