import { multiply, parseTransform, shapePath, type Matrix } from '../icons/svg-geometry';
import type { SvgCssResolve } from '../contracts/svg-safety';
import { SVG_MAX_BYTES, sanitizeSvg } from '../icons/svg-sanitize';
import { ANIMATION_CAPS, safeCssValue, type AnimationDoc } from './model';
import { PART_ID_RE, V2_CAPS, type Rig, type RigShape } from './model-v2';
import { isFilled, isStroked, mapD, nextShapeId, paintOrder, parseViewBox, pathArea, pathBBox, viewBoxMap } from './editors/draw-utils';

/*
 * Own SVG icons from the studio, both ways:
 * - exportRigSvg: the rig at rest (icon pieces, parts, drawn shapes; no animation) as a standalone
 *   SVG for the card's `icon: svg` + `svg:` fields. Part and shape ids are kept as `id` attributes
 *   (class `part` / `shape`), which survive the sanitiser, so the rig can be rebuilt from the file.
 * - importSvgFile: an SVG file (sanitised first, 32 KB) as rig shapes, one per drawn element, scaled
 *   into the icon's viewBox; rigFromSvgIcon makes the file the rig's source icon instead.
 * Everything goes through sanitizeSvg: nothing that runs or fetches is kept.
 */

/**
 * One piece of the source icon. B1's SplitPiece ({ index, d, bbox }) fits as it is; the optional
 * paint comes from an own SVG: `stroke` pieces are drawn by their stroke (Lucide-style icons),
 * `accent` pieces carry `mc-accent` (the icon's second colour).
 */
export interface ExportPiece {
  index: number;
  d: string;
  stroke?: { width: number; cap?: string; join?: string };
  accent?: boolean;
  /** Filled with fill-rule evenodd (own SVG). */
  evenodd?: boolean;
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PLAIN_COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;
const LINECAP = /^(butt|round|square)$/;
const LINEJOIN = /^(miter|round|bevel|arcs|miter-clip)$/;

/** A shape colour as an SVG paint: entity colours and var() become currentColor (the icon colour). */
export function exportPaint(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  if (/^entity\b/i.test(t) || /var\(/i.test(t)) return 'currentColor';
  if (/^currentcolor$/i.test(t)) return 'currentColor';
  return PLAIN_COLOR.test(t) ? t : 'currentColor';
}

function shapeMarkup(s: RigShape): string {
  const fill = isFilled(s) ? (exportPaint(s.fill) ?? 'currentColor') : 'none';
  let a = ` id="${esc(s.id)}" class="shape" d="${esc(s.d)}" fill="${esc(fill)}"`;
  if (isStroked(s)) {
    a += ` stroke="${esc(exportPaint(s.stroke) ?? 'currentColor')}" stroke-width="${s.stroke_width ?? 1}"`;
    if (s.linecap) a += ` stroke-linecap="${s.linecap}"`;
    a += ' stroke-linejoin="round"';
  }
  return `<path${a}/>`;
}

/** A part's own element markup, cleaned (inner markup of the sanitised wrapper). */
function ownPartMarkup(svg: string, viewBox: string): string {
  const full = /^\s*<svg[\s>]/i.test(svg) ? svg : `<svg viewBox="${viewBox}">${svg}</svg>`;
  const r = sanitizeSvg(full);
  if (r.error) return '';
  return r.markup.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}

/** The paint of a piece as attributes (filled; accent; or stroked with its width, cap and join). */
function piecePaint(p: ExportPiece): { cls: string; attrs: string; key: string } {
  const cls = p.accent ? 'mc-accent' : '';
  if (!p.stroke) return p.evenodd ? { cls, attrs: ' fill="currentColor" fill-rule="evenodd"', key: `e${cls}` } : { cls, attrs: ' fill="currentColor"', key: `f${cls}` };
  let attrs = ` fill="none" stroke="currentColor" stroke-width="${+p.stroke.width.toFixed(3)}"`;
  if (p.stroke.cap && LINECAP.test(p.stroke.cap)) attrs += ` stroke-linecap="${p.stroke.cap}"`;
  if (p.stroke.join && LINEJOIN.test(p.stroke.join)) attrs += ` stroke-linejoin="${p.stroke.join}"`;
  return { cls, attrs, key: `s${cls}${attrs}` };
}

/**
 * Pieces as markup: pieces with the same paint share one `<path>`; `id` / `cls` go on that path, or
 * on a wrapping `<g>` when the pieces need more than one paint.
 */
function piecesMarkup(pieces: ExportPiece[], id: string | undefined, cls: string): string {
  const runs = new Map<string, { paint: ReturnType<typeof piecePaint>; d: string[] }>();
  for (const p of pieces) {
    const paint = piecePaint(p);
    const run = runs.get(paint.key) ?? { paint, d: [] };
    run.d.push(p.d);
    runs.set(paint.key, run);
  }
  const idAttr = id ? ` id="${esc(id)}"` : '';
  const list = [...runs.values()];
  const path = (r: (typeof list)[number], withOwn: boolean) => {
    const c = [withOwn ? cls : '', r.paint.cls].filter(Boolean).join(' ');
    return `<path${withOwn ? idAttr : ''}${c ? ` class="${c}"` : ''} d="${esc(r.d.join(' '))}"${r.paint.attrs}/>`;
  };
  if (list.length === 1) return path(list[0], true);
  return `<g${idAttr} class="${cls}">${list.map((r) => path(r, false)).join('')}</g>`;
}

/**
 * The rig at rest as an SVG document: under-layer shapes, then the icon (each part a `<path>` or
 * `<g>` with its id, pieces no part uses as `class="base"`), then over-layer shapes. Stroked and
 * accent pieces keep their paint. `viewBox` defaults to the own SVG source's or 24 x 24.
 */
export function exportRigSvg(rig: Pick<Rig, 'parts' | 'shapes' | 'svg'>, pieces: ExportPiece[], opts: { viewBox?: string } = {}): string {
  const viewBox = opts.viewBox ?? rigViewBox(rig);
  const byIndex = new Map(pieces.map((p) => [p.index, p]));
  const used = new Set<number>();
  const body: string[] = [];
  const shapes = paintOrder(rig.shapes ?? []);
  for (const s of shapes) if (s.layer === 'under') body.push(shapeMarkup(s));
  const partLines: string[] = [];
  for (const p of rig.parts ?? []) {
    if (p.svg) {
      const inner = ownPartMarkup(p.svg, viewBox);
      if (inner) partLines.push(`<g id="${esc(p.id)}" class="part" fill="currentColor">${inner}</g>`);
    } else if (p.from?.length) {
      const own = p.from
        .map((i) => {
          used.add(i);
          return byIndex.get(i);
        })
        .filter((x): x is ExportPiece => !!x);
      if (own.length) partLines.push(piecesMarkup(own, p.id, 'part'));
    }
  }
  const rest = pieces.filter((p) => !used.has(p.index));
  if (rest.length) body.push(piecesMarkup(rest, undefined, 'base'));
  body.push(...partLines);
  for (const s of shapes) if (s.layer !== 'under') body.push(shapeMarkup(s));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${esc(viewBox)}">\n${body.map((l) => `  ${l}`).join('\n')}\n</svg>`;
}

const byteLength = (s: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length);

/** Why an exported SVG can't be used as an own icon (size cap, sanitiser verdict); undefined: fine. */
export function checkExportSvg(svg: string): string | undefined {
  if (byteLength(svg) > SVG_MAX_BYTES) return 'The SVG is larger than 32 KB.';
  if (!/<path|<g/.test(svg)) return 'Nothing to save yet: draw a shape or use an icon.';
  return sanitizeSvg(svg).error;
}

/** Card YAML for an own SVG icon: `icon: svg` and the markup as a block scalar. */
export function useInCardYaml(svg: string): string {
  const lines = svg.replace(/\r\n?/g, '\n').trim().split('\n');
  return `icon: svg\nsvg: |\n${lines.map((l) => `  ${l}`).join('\n')}\n`;
}

/** A download file name from the document name. */
export function svgFileName(name: string): string {
  const slug = (name ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${slug || 'icon'}.svg`;
}

// ── import ──

const NOT_DRAWN = new Set(['defs', 'clippath', 'mask', 'lineargradient', 'radialgradient', 'title']);
const SHAPES = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']);

interface Paint {
  fill?: string;
  stroke?: string;
  width?: number;
  cap?: string;
}

/** The path encloses (next to) no area: a line. */
function isFlat(d: string): boolean {
  const b = pathBBox(d);
  return !b || pathArea(d) < Math.max(b.w, b.h) * 1e-3;
}

function parseMarkup(markup: string): Element | undefined {
  if (typeof DOMParser === 'undefined') return undefined;
  const doc = new DOMParser().parseFromString(markup, 'text/html');
  return [...doc.getElementsByTagName('*')].find((e) => e.localName.toLowerCase() === 'svg');
}

/** A paint attribute as a shape colour: safe CSS colours kept, gradients and the rest as currentColor. */
function importPaint(v: string | undefined): string | undefined {
  if (v === undefined) return undefined;
  const t = v.trim();
  if (/^(none|transparent)$/i.test(t)) return 'none';
  return safeCssValue(t, 'color') && !/url\(/i.test(t) ? t : 'currentColor';
}

/**
 * The drawn elements of an SVG file as rig shapes (layer over), scaled into `viewBox` (uniform,
 * centred). Ids: the element's own when it is a valid, free part id, else `shape-<n>`. `taken`:
 * ids already in the rig; `room`: how many shapes still fit.
 */
/** `css`: the CSS paint resolver of an open site, passed on to the sanitiser and used by nothing else. */
export function importSvgFile(text: string, viewBox: string, taken: string[] = [], room: number = V2_CAPS.shapes, css?: SvgCssResolve): RigShape[] | { error: string } {
  const r = sanitizeSvg(text, { css });
  if (r.error) return { error: r.error };
  const root = parseMarkup(r.markup);
  if (!root) return { error: 'No <svg> element found.' };
  const map = viewBoxMap(r.viewBox, viewBox);
  const ids = new Set(taken);
  const out: RigShape[] = [];
  let tooLong = false;

  /** An element's own paint over its parent's, and its matrix. */
  const own = (el: Element, ctm: Matrix, parent: Paint): { m: Matrix; paint: Paint } => {
    const attr = (k: string): string | undefined => el.getAttribute(k) ?? undefined;
    const w = Number.parseFloat(attr('stroke-width') ?? '');
    return {
      m: multiply(ctm, parseTransform(el.getAttribute('transform'))),
      paint: {
        fill: attr('fill') ?? parent.fill,
        stroke: attr('stroke') ?? parent.stroke,
        width: Number.isFinite(w) && w >= 0 ? w : parent.width,
        cap: attr('stroke-linecap') ?? parent.cap,
      },
    };
  };

  const walk = (el: Element, ctm: Matrix, parent: Paint): void => {
    const name = el.localName.toLowerCase();
    if (NOT_DRAWN.has(name)) return;
    const { m, paint } = own(el, ctm, parent);
    if (SHAPES.has(name)) {
      const raw = shapePath(el, name);
      if (raw) {
        const scale = Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2])) * map.k;
        const d = mapD(raw, (p) => [(m[0] * p[0] + m[2] * p[1] + m[4]) * map.k + map.dx, (m[1] * p[0] + m[3] * p[1] + m[5]) * map.k + map.dy]);
        if (d.length > ANIMATION_CAPS.pathLength) tooLong = true;
        else if (d) {
          const own = el.getAttribute('id') ?? '';
          const id = PART_ID_RE.test(own) && !ids.has(own) ? own : nextShapeId([...ids], 'shape');
          ids.add(id);
          const s: RigShape = { id, name: own && PART_ID_RE.test(own) ? own : `Shape ${out.length + 1}`, d, layer: 'over' };
          const fill = name === 'line' ? 'none' : (importPaint(paint.fill) ?? 'currentColor');
          const stroke = importPaint(paint.stroke);
          if (stroke && stroke !== 'none') {
            s.stroke = stroke;
            s.stroke_width = Math.round((paint.width ?? 1) * scale * 1000) / 1000;
            if (paint.cap === 'round' || paint.cap === 'butt' || paint.cap === 'square') s.linecap = paint.cap;
            if (fill !== 'none') s.fill = fill;
          } else if (fill === 'none' || isFlat(d)) {
            // unpainted, or a fill with no area (a bare line): drawn by a hairline stroke instead
            s.stroke = 'currentColor';
            s.stroke_width = Math.round(Math.max(scale, 0.05) * 1000) / 1000;
          } else s.fill = fill;
          out.push(s);
        }
      }
    }
    for (const c of [...el.children]) walk(c, m, paint);
  };
  // the root's own paint and transform reach every shape (Lucide: fill="none" stroke="currentColor")
  const top = own(root, [1, 0, 0, 1, 0, 0], {});
  for (const c of [...root.children]) walk(c, top.m, top.paint);

  if (tooLong) return { error: 'A shape in the SVG is too detailed (over 8192 characters of path data).' };
  if (!out.length) return { error: 'The SVG has no shapes to draw.' };
  if (out.length > room) return { error: `The SVG has ${out.length} shapes; at most ${room} fit.` };
  return out;
}

/**
 * "Use as icon": the SVG file becomes the rig's source (instead of an icon id). Parts cut from the
 * old icon (`from`) no longer fit and go, with groups, tracks and bindings that pointed at them;
 * drawn shapes and parts with their own geometry stay. When the new source has another viewBox than
 * the old one (`fromViewBox`, default the rig's), everything kept is rescaled into it: shape paths and
 * stroke widths, own-geometry parts (wrapped in a transform), pivots, and track motion paths.
 */
export function rigFromSvgIcon(doc: AnimationDoc, text: string, fromViewBox?: string, css?: SvgCssResolve): AnimationDoc | { error: string } {
  const r = sanitizeSvg(text, { css });
  if (r.error) return { error: r.error };
  const old = doc.rig ?? { parts: [] };
  const from = parseViewBox(fromViewBox ?? rigViewBox(old)).join(' ');
  const to = parseViewBox(r.viewBox).join(' ');
  const map = viewBoxMap(from, to);
  const same = from === to;
  const pt = (p: [number, number] | undefined): [number, number] | undefined =>
    p && !same ? [Math.round((p[0] * map.k + map.dx) * 100) / 100, Math.round((p[1] * map.k + map.dy) * 100) / 100] : p;
  const withOrigin = <T extends { origin?: [number, number] }>(x: T): T => (x.origin ? { ...x, origin: pt(x.origin) } : x);
  const fmt = (n: number): string => String(Math.round(n * 10000) / 10000);
  const parts = (old.parts ?? [])
    .filter((p) => !p.from)
    .map((p) => withOrigin(same || !p.svg ? p : { ...p, svg: `<g transform="matrix(${fmt(map.k)} 0 0 ${fmt(map.k)} ${fmt(map.dx)} ${fmt(map.dy)})">${p.svg}</g>` }));
  const shapes = old.shapes?.map((s) =>
    same
      ? s
      : withOrigin({
          ...s,
          d: mapD(s.d, (p) => [p[0] * map.k + map.dx, p[1] * map.k + map.dy]),
          ...(s.stroke_width !== undefined ? { stroke_width: Math.round(s.stroke_width * map.k * 1000) / 1000 } : {}),
        }),
  );
  const keep = new Set(parts.map((p) => p.id));
  const groups = (old.groups ?? [])
    .map((g) => withOrigin({ ...g, parts: g.parts.filter((p) => keep.has(p)) }))
    .filter((g) => g.parts.length);
  const gone = new Set<string>([
    ...(old.parts ?? []).filter((p) => !keep.has(p.id)).map((p) => `part:${p.id}`),
    ...(old.groups ?? []).filter((g) => !groups.some((x) => x.id === g.id)).map((g) => `group:${g.id}`),
  ]);
  const rig: Rig = { ...old, svg: r.markup, parts, ...(old.groups ? { groups } : {}), ...(shapes ? { shapes } : {}) };
  delete rig.icon;
  const out: AnimationDoc = { ...doc, rig };
  // motion paths are offsets in viewBox units: they scale (no shift)
  if (doc.tracks)
    out.tracks = doc.tracks
      .filter((t) => !gone.has(t.target))
      .map((t) => (t.path && !same && /^(part|group|shape):/.test(t.target) ? { ...t, path: { ...t.path, d: mapD(t.path.d, (p) => [p[0] * map.k, p[1] * map.k]) } } : t));
  if (doc.bindings) out.bindings = doc.bindings.filter((b) => !gone.has(b.target));
  return out;
}

/** The viewBox shapes are drawn in for this rig (own SVG source, else 24 x 24). */
export function rigViewBox(rig: Pick<Rig, 'svg'> | undefined): string {
  if (!rig?.svg) return '0 0 24 24';
  return parseViewBox(sanitizeSvg(rig.svg).viewBox).join(' ');
}
