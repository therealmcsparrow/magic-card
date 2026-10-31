import type { BakedElement, BakedLoop, BakedStop, WeightedShape } from '../contracts/particles-v2';
import { hashString } from '../anim-studio/compile';
import { safeCssValue } from '../anim-studio/model';
import { sanitizeSvg, SVG_MAX_BYTES } from '../icons/svg-sanitize';
import { builtinPath } from './shapes';
import { stopAt } from './css';

// A baked loop as a standalone animated SVG (bakedSvg, the studio export). It stays inside the export check: only svg, g,
// path and style elements, no links or url(), drawing under 32 KB. Each particle is a <g> moved by CSS keyframes; icons
// and emoji export as dots. Reduced motion shows the middle of the loop, still.

const DOT = '<path d="M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"/>';
/** The drawing's budget: the sanitiser refuses more than SVG_MAX_BYTES; head and tail need some room. */
const DRAWING_BUDGET = SVG_MAX_BYTES - 1024;
/** An own shape this large is drawn as a dot (its copies would not fit the budget). */
const OWN_SHAPE_MAX = 2048;
const DEFAULT_COLOR = '#03a9f4';

const n2 = (v: number): string => String(Math.round(v * 100) / 100 || 0);
const n3 = (v: number): string => String(Math.round(v * 1000) / 1000 || 0);
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface Drawn {
  /** Paths on the shape's own grid, centred on 0 0 by `shift`. */
  markup: string;
  /** Scale from px size to the shape grid: size / grid. */
  grid: number;
}

/** A shape as paths centred on 0 0 (the 24 grid, or an own SVG's viewBox). */
function drawShape(shape: WeightedShape['shape']): Drawn {
  const centred = (inner: string, x: number, y: number, w: number, h: number): Drawn => ({
    markup: `<g transform="translate(${n3(-(x + w / 2))} ${n3(-(y + h / 2))})">${inner}</g>`,
    grid: Math.max(w, h) || 24,
  });
  if ('builtin' in shape) return centred(builtinPath(shape.builtin), 0, 0, 24, 24);
  if ('svg' in shape) {
    const s = sanitizeSvg(shape.svg);
    if (!s.error) {
      const eo = new Set(s.evenodd?.paths ?? []);
      const eoA = new Set(s.evenodd?.accent ?? []);
      const inner = [
        ...s.paths.map((d, i) => `<path d="${esc(d)}"${eo.has(i) ? ' fill-rule="evenodd"' : ''}/>`),
        ...s.accentPaths.map((d, i) => `<path d="${esc(d)}"${eoA.has(i) ? ' fill-rule="evenodd"' : ''}/>`),
        ...s.strokes.map(
          (k) => `<path d="${esc(k.d)}" fill="none" stroke="currentColor" stroke-width="${n3(k.width)}"${k.cap ? ` stroke-linecap="${esc(k.cap)}"` : ''}${k.join ? ` stroke-linejoin="${esc(k.join)}"` : ''}/>`,
        ),
      ].join('');
      const [x, y, w, h] = s.viewBox.split(/[\s,]+/).map(Number);
      if (inner.length <= OWN_SHAPE_MAX && [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0) return centred(inner, x, y, w, h);
    }
  }
  return centred(DOT, 0, 0, 24, 24);
}

/** A colour usable as an SVG presentation attribute in a file of its own (no custom properties there). */
function fileColor(c: string | undefined): string | undefined {
  const v = c !== undefined ? safeCssValue(c, 'color') : undefined;
  return v && !/var\(/i.test(v) ? v : undefined;
}

const decl = (s: BakedStop, k: number): string =>
  `transform:translate(${n2(s.x)}px,${n2(s.y)}px) rotate(${n2(s.rotate)}deg) scale(${n3(s.scale * k)});opacity:${n3(s.opacity)}`;

export function bakedSvg(loop: BakedLoop, opts: { width: number; height: number; background?: string }): string {
  const W = Number.isFinite(opts.width) && opts.width > 0 ? Math.round(opts.width) : 200;
  const H = Number.isFinite(opts.height) && opts.height > 0 ? Math.round(opts.height) : 100;
  const period = loop.period > 0 && Number.isFinite(loop.period) ? loop.period : 1;
  const p = `p${hashString(JSON.stringify([loop.period, loop.geometry, loop.elements.length, loop.stats.bytes]))}`;
  const bg = opts.background !== undefined ? fileColor(opts.background) : undefined;

  const shapes = new Map<string, Drawn>();
  const drawn = (s: WeightedShape['shape']): Drawn => {
    const key = JSON.stringify(s);
    let d = shapes.get(key);
    if (!d) shapes.set(key, (d = drawShape(s)));
    return d;
  };
  const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="currentColor" color="${DEFAULT_COLOR}">`;
  const back = bg ? `<path d="M0 0H${W}V${H}H0z" fill="${esc(bg)}"/>` : '';
  let size = head.length + back.length + 64;
  const body: string[] = [];
  const rules: string[] = [];
  const moves: string[] = [];
  const at = (s: BakedStop): BakedStop => ({ ...s, x: (s.x / 100) * W, y: (s.y / 100) * H });
  // back part first (the document's part 1 is the front one when `parts.front`)
  const order = loop.elements.map((_, k) => k);
  if (loop.parts && !loop.parts.front) order.push(...order.splice(0, loop.parts.element));
  order.forEach((k) => {
    const e: BakedElement = loop.elements[k];
    const d = drawn(e.shape);
    const c = fileColor(e.color);
    const g = `<g class="${p}e${k}"${c ? ` color="${esc(c)}"` : ''}>${d.markup}</g>`;
    if (size + g.length > DRAWING_BUDGET) return;
    size += g.length;
    body.push(g);
    const scale = e.size / d.grid;
    rules.push(`.${p}e${k}{${decl(at(stopAt(e.stops, 0.5)), scale)}}`);
    const frames = e.stops.map((s) => `${n3(s.t * 100)}%{${decl(at(s), scale)}}`).join('');
    moves.push(`.${p} .${p}e${k}{animation-name:${p}a${k}}@keyframes ${p}a${k}{${frames}}`);
  });
  const style = [
    `.${p}>g{transform-box:view-box;transform-origin:0 0}`,
    ...rules,
    `@media (prefers-reduced-motion:no-preference){.${p}>g{animation-duration:${n3(period)}s;animation-timing-function:linear;animation-iteration-count:infinite}`,
    ...moves,
    '}',
  ].join('\n');
  return [head, `<style>${style}</style>`, back, `<g class="${p}">`, ...body, '</g>', '</svg>'].join('\n');
}
