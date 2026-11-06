import type { SanitisedIconMarkup } from '../contracts/svg-reader';
import type { SvgCssOption } from '../contracts/svg-safety';
import { parseLenient } from '../svg-safety/parse';
import { ICON_MAX_BYTES, ICON_MAX_DEPTH, ICON_POLICY } from '../svg-safety/policy-icon';
import { byteLength, cleanIconValue, escapeAttr, escapeText, kindOf } from '../svg-safety/values';
import { fmt, multiply, num, parseTransform, shapePath, transformPath, type Matrix } from './svg-geometry';

// Own SVG icons: user markup reduced to an allowlist of drawing elements and attributes, plus the shapes as path data.
// Nothing that runs or fetches survives. Paint styles become presentation attributes only when the caller passes
// the resolver as `css`; otherwise styles are dropped.

/** A stroked shape: its outline as path data and the stroke (width in viewBox units, transforms applied). */
export interface StrokeShape {
  d: string;
  width: number;
  cap?: string;
  join?: string;
  /** Inside `mc-accent`. */
  accent?: true;
}

export interface SanitizedSvg {
  /** The cleaned `<svg viewBox>…</svg>` (no xmlns); empty on error. Branded here, in the sanitiser, and nowhere else. */
  markup: SanitisedIconMarkup;
  viewBox: string;
  /** Filled shapes as path data (transforms applied), without the accent ones. */
  paths: string[];
  /** Filled shapes with (or inside an element with) `class="mc-accent"`: drawn in the second colour. */
  accentPaths: string[];
  /**
   * Stroked shapes (Lucide / Feather / Tabler style icons): drawn by their stroke, so effects paint the
   * stroke and the liquid fill masks with it. In the markup, filled shapes carry `mc-f`, stroked `mc-s`.
   */
  strokes: StrokeShape[];
  /** Indices of `paths` / `accentPaths` filled with fill-rule evenodd (icon rigs split them by it). */
  evenodd?: { paths?: number[]; accent?: number[] };
  error?: string;
}

export const SVG_MAX_BYTES = ICON_MAX_BYTES;
/** Deepest element nesting walked: deeper markup is rejected (a hostile 21 KB SVG can nest thousands of groups). */
export const SVG_MAX_DEPTH = ICON_MAX_DEPTH;
const DEFAULT_VIEWBOX = '0 0 24 24';

/** lowercase -> canonical name (the HTML parser lowercases SVG names). */
const canon = (names: readonly string[]) => new Map(names.map((n) => [n.toLowerCase(), n]));
const ELEMENTS = canon(ICON_POLICY.elements);
const ATTRIBUTES = canon(Object.keys(ICON_POLICY.kinds));
const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']);
/** Containers whose shapes are not drawn as the icon (definitions, clips, masks). */
const NOT_DRAWN = new Set(['defs', 'clipPath', 'mask', 'linearGradient', 'radialGradient']);

/** An attribute value that is safe to keep, or undefined (the shared value rules under the icon policy). */
function safeValue(name: string, value: string): string | undefined {
  const kind = kindOf(ICON_POLICY, name);
  return kind ? cleanIconValue(kind, value, ICON_POLICY) : undefined;
}

/** Class names the icon engine styles itself (icon-css): an own SVG's are prefixed `u-` so they can't hook in. */
const INTERNAL_CLASSES = new Set([
  'own', 'painted', 'accented', 'body', 'dim', 'fill', 'liquid', 'wave', 'paint', 'draw', 'dev', 'glow-copy', 'flame-glow',
  'ring', 'snow', 'primary', 'secondary', 'duo', 'duo-body', 'duo-line', 'old', 'morph-in',
]);
const userClass = (c: string): string =>
  c !== 'mc-accent' && (INTERNAL_CLASSES.has(c) || /^(mc-|dev-|xfade-)/.test(c)) ? `u-${c}` : c;

function viewBoxOf(root: Element): string {
  const vb = (root.getAttribute('viewBox') ?? root.getAttribute('viewbox') ?? '').trim().split(/[\s,]+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) return vb.map(fmt).join(' ');
  const w = num(root.getAttribute('width'));
  const h = num(root.getAttribute('height'));
  return w && h && w > 0 && h > 0 ? `0 0 ${fmt(w)} ${fmt(h)}` : DEFAULT_VIEWBOX;
}

export const TOO_COMPLEX = 'The SVG is too complex.';
/** The reason given when the text holds no `<svg>` element. */
export const NO_SVG_ELEMENT = 'No <svg> element found.';
const brand = (markup: string): SanitisedIconMarkup => markup as SanitisedIconMarkup;

/** The result of a refused SVG: no markup, no shapes and the reason. */
export const svgFailure = (error: string): SanitizedSvg => ({ markup: brand(''), viewBox: DEFAULT_VIEWBOX, paths: [], accentPaths: [], strokes: [], error });

/** Paint state inherited down the tree (presentation attributes; SVG defaults: filled, no stroke). */
interface Paint {
  fill: boolean;
  stroke: boolean;
  width: number;
  cap?: string;
  join?: string;
  evenodd?: boolean;
}
const ROOT_PAINT: Paint = { fill: true, stroke: false, width: 1 };
const NO_PAINT = /^(none|transparent)$/i;

function paintOf(el: Element, parent: Paint): Paint {
  const get = (k: string) => {
    const v = el.getAttribute(k);
    return v === null ? undefined : safeValue(k, v)?.trim();
  };
  const fill = get('fill');
  const stroke = get('stroke');
  const width = num(get('stroke-width'));
  const cap = get('stroke-linecap');
  const join = get('stroke-linejoin');
  const rule = get('fill-rule');
  return {
    evenodd: rule === undefined ? parent.evenodd : rule === 'evenodd',
    fill: fill === undefined ? parent.fill : !NO_PAINT.test(fill),
    stroke: stroke === undefined ? parent.stroke : !NO_PAINT.test(stroke),
    width: width !== undefined && width >= 0 ? width : parent.width,
    cap: cap && /^(butt|round|square)$/.test(cap) ? cap : parent.cap,
    join: join && /^(miter|round|bevel|arcs|miter-clip)$/.test(join) ? join : parent.join,
  };
}

export function sanitizeSvg(input: string, options: SvgCssOption = {}): SanitizedSvg {
  const text = typeof input === 'string' ? input : '';
  if (byteLength(text) > SVG_MAX_BYTES) return svgFailure('The SVG is larger than 32 KB.');
  const root = parseLenient(text)?.root;
  if (!root) return svgFailure(NO_SVG_ELEMENT);

  const viewBox = viewBoxOf(root);
  if (options.css) {
    try {
      if (options.css(root, ICON_POLICY).status !== 'ok') return svgFailure(TOO_COMPLEX);
    } catch {
      return svgFailure(TOO_COMPLEX);
    }
  }
  const paths: string[] = [];
  const accentPaths: string[] = [];
  const strokes: StrokeShape[] = [];
  const eo: NonNullable<SanitizedSvg['evenodd']> = {};

  /**
   * Allowed attributes of `el` as markup (` name="value"`); the root's size / viewBox are set apart.
   * `extra` classes join the element's own.
   */
  const attrs = (el: Element, isRoot: boolean, extra: string[] = []): string => {
    let out = '';
    let cls = '';
    for (const attr of [...el.attributes]) {
      const name = ATTRIBUTES.get(attr.name.toLowerCase());
      if (!name || attr.name.includes(':')) continue;
      if (isRoot && (name === 'viewBox' || name === 'width' || name === 'height')) continue;
      const value = safeValue(name, attr.value);
      if (value === undefined) continue;
      if (name === 'class') cls = value.split(' ').map(userClass).join(' ');
      else out += ` ${name}="${escapeAttr(value)}"`;
    }
    const classes = [cls, ...extra].filter(Boolean).join(' ');
    return classes ? ` class="${escapeAttr(classes)}"${out}` : out;
  };

  let tooDeep = false;
  const walk = (el: Element, ctm: Matrix, drawn: boolean, accent: boolean, parentPaint: Paint, depth: number): string => {
    if (depth > SVG_MAX_DEPTH || tooDeep) {
      tooDeep = true;
      return '';
    }
    const name = ELEMENTS.get(el.localName.toLowerCase());
    if (!name || name === 'svg') return '';
    if (name === 'title') return `<title>${escapeText(el.textContent ?? '')}</title>`;
    const m = multiply(ctm, parseTransform(safeValue('transform', el.getAttribute('transform') ?? '') ?? null));
    const isAccent = accent || (el.getAttribute('class') ?? '').split(/\s+/).includes('mc-accent');
    const isDrawn = drawn && !NOT_DRAWN.has(name);
    const paint = paintOf(el, parentPaint);
    const marks: string[] = [];
    if (isDrawn && SHAPES.has(name)) {
      const d = shapePath(el, name);
      if (d) {
        const td = transformPath(d, m);
        // A line has no area: it only ever shows its stroke.
        if (paint.fill && name !== 'line') {
          const list = isAccent ? accentPaths : paths;
          if (paint.evenodd) (isAccent ? (eo.accent ??= []) : (eo.paths ??= [])).push(list.length);
          list.push(td);
          marks.push('mc-f');
        }
        if (paint.stroke && paint.width > 0) {
          const width = +(paint.width * Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]))).toFixed(3);
          strokes.push({ d: td, width, ...(paint.cap ? { cap: paint.cap } : {}), ...(paint.join ? { join: paint.join } : {}), ...(isAccent ? { accent: true as const } : {}) });
          marks.push('mc-s');
        }
      }
    }
    const children = [...el.children].map((c) => walk(c, m, isDrawn, isAccent, paint, depth + 1)).join('');
    return `<${name}${attrs(el, false, marks)}>${children}</${name}>`;
  };

  const rootMatrix = parseTransform(safeValue('transform', root.getAttribute('transform') ?? '') ?? null);
  const rootPaint = paintOf(root, ROOT_PAINT);
  const inner = [...root.children].map((c) => walk(c, rootMatrix, true, false, rootPaint, 1)).join('');
  if (tooDeep) return svgFailure(TOO_COMPLEX);
  if (!paths.length && !accentPaths.length && !strokes.length) return svgFailure('The SVG has no shapes to draw.');
  return { markup: brand(`<svg viewBox="${viewBox}"${attrs(root, true)}>${inner}</svg>`), viewBox, paths, accentPaths, strokes, ...(eo.paths || eo.accent ? { evenodd: eo } : {}) };
}
