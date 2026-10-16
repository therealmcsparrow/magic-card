import { cubicsToPath, Pt, toCubicSubpaths } from './path-math';

/*
 * Own SVG icons: user markup reduced to an allowlist of drawing elements and attributes, plus the
 * shapes as path data for the icon effects. Nothing that runs or fetches survives: no scripts,
 * foreignObject, event handlers, styles, links / `href`, animation elements or external url().
 */

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
  /** The cleaned `<svg viewBox>…</svg>` (no xmlns); empty on error. */
  markup: string;
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

export const SVG_MAX_BYTES = 32 * 1024;
/** Deepest element nesting walked: deeper markup is rejected (a hostile 21 KB SVG can nest thousands of groups). */
export const SVG_MAX_DEPTH = 64;
const DEFAULT_VIEWBOX = '0 0 24 24';

/** lowercase -> canonical name (the HTML parser lowercases SVG names). */
const canon = (names: string[]) => new Map(names.map((n) => [n.toLowerCase(), n]));
const ELEMENTS = canon([
  'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient',
  'radialGradient', 'stop', 'clipPath', 'mask', 'title',
]);
const ATTRIBUTES = canon([
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points', 'fill', 'stroke',
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform',
  'viewBox', 'id', 'class', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform',
  'clip-path', 'mask', 'fill-rule', 'clip-rule',
]);
const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']);
/** Containers whose shapes are not drawn as the icon (definitions, clips, masks). */
const NOT_DRAWN = new Set(['defs', 'clipPath', 'mask', 'linearGradient', 'radialGradient']);

const INTERNAL_URL = /url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi;
/** Functions an attribute may call: colours in paint values, the transform list in transforms. */
const COLOR_FNS = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']);
const TRANSFORM_FNS = new Set(['matrix', 'translate', 'scale', 'rotate', 'skewx', 'skewy']);
const TRANSFORMS = new Set(['transform', 'gradientTransform']);

/** Every "(" opens an allowed function (a CSS comment or escape can't hide one: both are refused). */
function onlyFunctions(v: string, allowed: Set<string>): boolean {
  const opens = v.match(/\(/g)?.length ?? 0;
  const fns = [...v.matchAll(/([a-z-]+)\s*\(/gi)];
  return fns.length === opens && fns.every((m) => allowed.has(m[1].toLowerCase()));
}

/**
 * An attribute value that is safe to keep: internal url(#id) and colour functions in paint, transform
 * functions in transforms, nothing else that calls (image-set, src, paint, element…) or reaches out
 * (`//`), no script / data / CSS escapes or comments.
 */
function safeValue(name: string, value: string): string | undefined {
  const v = value.trim();
  if (/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i.test(v)) return undefined;
  if (TRANSFORMS.has(name)) return onlyFunctions(v, TRANSFORM_FNS) ? value : undefined;
  if (!onlyFunctions(v.replace(INTERNAL_URL, ''), COLOR_FNS)) return undefined;
  if (name === 'id') return /^[\w.:-]+$/.test(v) ? v : undefined;
  if (name === 'class') {
    const tokens = v.split(/\s+/).filter((t) => /^[\w-]+$/.test(t));
    return tokens.length ? tokens.join(' ') : undefined;
  }
  return value;
}

/** Class names the icon engine styles itself (icon-css): an own SVG's are prefixed `u-` so they can't hook in. */
const INTERNAL_CLASSES = new Set([
  'own', 'painted', 'accented', 'body', 'dim', 'fill', 'liquid', 'wave', 'paint', 'draw', 'dev', 'glow-copy', 'flame-glow',
  'ring', 'snow', 'primary', 'secondary', 'duo', 'duo-body', 'duo-line', 'old', 'morph-in',
]);
const userClass = (c: string): string =>
  c !== 'mc-accent' && (INTERNAL_CLASSES.has(c) || /^(mc-|dev-|xfade-)/.test(c)) ? `u-${c}` : c;

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (n: number) => String(+n.toFixed(3));
const num = (v: string | null | undefined): number | undefined => {
  if (v === null || v === undefined || /%/.test(v)) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};

// ── transforms ──

/** Affine matrix [a, b, c, d, e, f] (SVG order). */
export type Matrix = [number, number, number, number, number, number];
const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];
export const multiply = (m: Matrix, n: Matrix): Matrix => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
const isIdentity = (m: Matrix) => m.every((v, i) => Math.abs(v - IDENTITY[i]) < 1e-9);

export function parseTransform(t: string | null): Matrix {
  let m: Matrix = IDENTITY;
  if (!t) return m;
  for (const [, fn, args] of t.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)) {
    const a = args.split(/[\s,]+/).filter(Boolean).map(Number);
    if (a.some((n) => !Number.isFinite(n))) continue;
    let n: Matrix = IDENTITY;
    switch (fn) {
      case 'matrix':
        if (a.length === 6) n = a as Matrix;
        break;
      case 'translate':
        n = [1, 0, 0, 1, a[0] ?? 0, a[1] ?? 0];
        break;
      case 'scale':
        n = [a[0] ?? 1, 0, 0, a[1] ?? a[0] ?? 1, 0, 0];
        break;
      case 'rotate': {
        const r = ((a[0] ?? 0) * Math.PI) / 180;
        const [cx, cy] = [a[1] ?? 0, a[2] ?? 0];
        const rot: Matrix = [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0];
        n = multiply(multiply([1, 0, 0, 1, cx, cy], rot), [1, 0, 0, 1, -cx, -cy]);
        break;
      }
      case 'skewX':
        n = [1, 0, Math.tan(((a[0] ?? 0) * Math.PI) / 180), 1, 0, 0];
        break;
      case 'skewY':
        n = [1, Math.tan(((a[0] ?? 0) * Math.PI) / 180), 0, 1, 0, 0];
        break;
    }
    m = multiply(m, n);
  }
  return m;
}

function transformPath(d: string, m: Matrix): string {
  if (isIdentity(m)) return d;
  const apply = (p: Pt): Pt => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
  return cubicsToPath(toCubicSubpaths(d).map((sub) => sub.map((c) => c.map(apply) as typeof c)));
}

// ── shapes -> path data ──

function points(v: string | null): number[][] {
  const n = (v ?? '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const out: number[][] = [];
  for (let i = 0; i + 1 < n.length; i += 2) if (Number.isFinite(n[i]) && Number.isFinite(n[i + 1])) out.push([n[i], n[i + 1]]);
  return out;
}

export function shapePath(el: Element, name: string): string | undefined {
  const a = (k: string) => num(el.getAttribute(k));
  switch (name) {
    case 'path': {
      const d = el.getAttribute('d')?.trim();
      return d || undefined;
    }
    case 'circle':
    case 'ellipse': {
      const cx = a('cx') ?? 0;
      const cy = a('cy') ?? 0;
      const rx = name === 'circle' ? a('r') : a('rx') ?? a('ry');
      const ry = name === 'circle' ? rx : a('ry') ?? a('rx');
      if (!rx || !ry || rx <= 0 || ry <= 0) return undefined;
      const arc = `A${fmt(rx)} ${fmt(ry)} 0 1 0`;
      return `M${fmt(cx - rx)} ${fmt(cy)}${arc} ${fmt(cx + rx)} ${fmt(cy)}${arc} ${fmt(cx - rx)} ${fmt(cy)}Z`;
    }
    case 'rect': {
      const x = a('x') ?? 0;
      const y = a('y') ?? 0;
      const w = a('width');
      const h = a('height');
      if (!w || !h || w <= 0 || h <= 0) return undefined;
      let rx = a('rx') ?? a('ry') ?? 0;
      let ry = a('ry') ?? a('rx') ?? 0;
      rx = Math.min(Math.max(rx, 0), w / 2);
      ry = Math.min(Math.max(ry, 0), h / 2);
      if (!rx || !ry) return `M${fmt(x)} ${fmt(y)}H${fmt(x + w)}V${fmt(y + h)}H${fmt(x)}Z`;
      const arc = `A${fmt(rx)} ${fmt(ry)} 0 0 1`;
      return `M${fmt(x + rx)} ${fmt(y)}H${fmt(x + w - rx)}${arc} ${fmt(x + w)} ${fmt(y + ry)}V${fmt(y + h - ry)}${arc} ${fmt(x + w - rx)} ${fmt(y + h)}H${fmt(x + rx)}${arc} ${fmt(x)} ${fmt(y + h - ry)}V${fmt(y + ry)}${arc} ${fmt(x + rx)} ${fmt(y)}Z`;
    }
    case 'line':
      return `M${fmt(a('x1') ?? 0)} ${fmt(a('y1') ?? 0)}L${fmt(a('x2') ?? 0)} ${fmt(a('y2') ?? 0)}`;
    case 'polyline':
    case 'polygon': {
      const p = points(el.getAttribute('points'));
      if (p.length < 2) return undefined;
      return `M${p.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join('L')}${name === 'polygon' ? 'Z' : ''}`;
    }
  }
  return undefined;
}

// ── parsing ──

function parseRoot(input: string): Element | undefined {
  if (typeof DOMParser === 'undefined') return undefined;
  const parser = new DOMParser();
  try {
    const xml = parser.parseFromString(input, 'image/svg+xml');
    const root = xml.documentElement;
    if (root && root.localName === 'svg' && !xml.getElementsByTagName('parsererror').length) return root;
  } catch {
    /* not well-formed XML: the HTML parser below is lenient */
  }
  // Inert document: nothing in it loads or runs.
  const doc = parser.parseFromString(input, 'text/html');
  return [...doc.getElementsByTagName('*')].find((e) => e.localName.toLowerCase() === 'svg');
}

function viewBoxOf(root: Element): string {
  const vb = (root.getAttribute('viewBox') ?? root.getAttribute('viewbox') ?? '').trim().split(/[\s,]+/).map(Number);
  if (vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0) return vb.map(fmt).join(' ');
  const w = num(root.getAttribute('width'));
  const h = num(root.getAttribute('height'));
  return w && h && w > 0 && h > 0 ? `0 0 ${fmt(w)} ${fmt(h)}` : DEFAULT_VIEWBOX;
}

export const TOO_COMPLEX = 'The SVG is too complex.';
const fail = (error: string): SanitizedSvg => ({ markup: '', viewBox: DEFAULT_VIEWBOX, paths: [], accentPaths: [], strokes: [], error });

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

export function sanitizeSvg(input: string): SanitizedSvg {
  const text = typeof input === 'string' ? input : '';
  const bytes = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(text).length : text.length;
  if (bytes > SVG_MAX_BYTES) return fail('The SVG is larger than 32 KB.');
  const root = parseRoot(text);
  if (!root) return fail('No <svg> element found.');

  const viewBox = viewBoxOf(root);
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
      else out += ` ${name}="${escAttr(value)}"`;
    }
    const classes = [cls, ...extra].filter(Boolean).join(' ');
    return classes ? ` class="${escAttr(classes)}"${out}` : out;
  };

  let tooDeep = false;
  const walk = (el: Element, ctm: Matrix, drawn: boolean, accent: boolean, parentPaint: Paint, depth: number): string => {
    if (depth > SVG_MAX_DEPTH || tooDeep) {
      tooDeep = true;
      return '';
    }
    const name = ELEMENTS.get(el.localName.toLowerCase());
    if (!name || name === 'svg') return '';
    if (name === 'title') return `<title>${escText(el.textContent ?? '')}</title>`;
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
  if (tooDeep) return fail(TOO_COMPLEX);
  if (!paths.length && !accentPaths.length && !strokes.length) return fail('The SVG has no shapes to draw.');
  return { markup: `<svg viewBox="${viewBox}"${attrs(root, true)}>${inner}</svg>`, viewBox, paths, accentPaths, strokes, ...(eo.paths || eo.accent ? { evenodd: eo } : {}) };
}
