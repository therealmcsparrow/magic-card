import { MAX_GROUP_DEPTH } from '../contracts/svg-editor';
import {
  READ_MAX_PATH_CHARS,
  READ_MAX_SHAPES,
  type Matrix,
  type ReadGroup,
  type ReadNotes,
  type ReadOptions,
  type ReadResult,
  type ReadShape,
  type SanitisedMarkup,
} from '../contracts/svg-reader';
import { multiply, parseTransform, shapePath } from '../icons/svg-geometry';
import { parsePath, type Pt } from '../path/core';

// Sanitised SVG markup to a flat list of shapes: absolute path data with transforms applied, inherited attributes and the group tree.

const SHAPES: readonly ReadShape['from'][] = ['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'];
const NONE = /^(none|transparent)$/i;
const PLAIN = /^(currentcolor|inherit|black|#0{3}|#0{6})$/i;

interface Inherit {
  fill?: string;
  stroke?: string;
  width: number;
  cap?: string;
  join?: string;
  evenodd?: boolean;
  opacity?: number;
  accent: boolean;
}

const num = (n: number): string => (Object.is(n, -0) ? '-0' : String(n));

/** Path data through `m`, absolute M / L / C / Z with the numbers kept exact. */
function outline(d: string, m: Matrix): string {
  const at = (p: Pt): string => `${num(m[0] * p[0] + m[2] * p[1] + m[4])} ${num(m[1] * p[0] + m[3] * p[1] + m[5])}`;
  return parsePath(d)
    .map((s) => `M${at(s.start)}${s.segs.map((g) => (g.c1 && g.c2 ? `C${at(g.c1)} ${at(g.c2)} ${at(g.to)}` : `L${at(g.to)}`)).join('')}${s.closed ? 'Z' : ''}`)
    .join('');
}

export function readShapes(markup: SanitisedMarkup, opts: ReadOptions): ReadResult {
  const root = typeof DOMParser === 'undefined' ? undefined : new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
  if (!root || root.localName !== 'svg') return { ok: false, error: 'not_svg' };

  const maxShapes = Math.min(opts.maxShapes ?? READ_MAX_SHAPES, READ_MAX_SHAPES);
  const maxChars = Math.min(opts.maxPathChars ?? READ_MAX_PATH_CHARS, READ_MAX_PATH_CHARS);
  const notes: ReadNotes = { transforms: false, colours: false, opacity: false, mergedGroups: false };
  const shapes: ReadShape[] = [];
  const groups: ReadGroup[] = [];
  let chars = 0;
  let failed: 'too_many' | 'too_detailed' | undefined;

  const paint = (raw: string): string => {
    if (opts.paint?.(raw) === undefined && !NONE.test(raw) && !PLAIN.test(raw)) notes.colours = true;
    return raw;
  };

  /** SVG inheritance: the element's own presentation attributes over its parent's. */
  const inherit = (el: Element, inh: Inherit): Inherit => {
    const get = (k: string): string | undefined => el.getAttribute(k)?.trim();
    const p: Inherit = { ...inh };
    const fill = get('fill');
    if (fill !== undefined) p.fill = paint(fill);
    const stroke = get('stroke');
    if (stroke !== undefined) p.stroke = paint(stroke);
    const w = parseFloat(get('stroke-width') ?? '');
    if (Number.isFinite(w) && w >= 0) p.width = w;
    const cap = get('stroke-linecap');
    if (cap === 'butt' || cap === 'round' || cap === 'square') p.cap = cap;
    const join = get('stroke-linejoin');
    if (join === 'miter' || join === 'round' || join === 'bevel') p.join = join;
    const rule = get('fill-rule');
    if (rule === 'evenodd' || rule === 'nonzero') p.evenodd = rule === 'evenodd';
    if ((get('class') ?? '').split(/\s+/).includes('mc-accent')) p.accent = true;
    if (get('opacity') || get('fill-opacity') || get('stroke-opacity')) notes.opacity = true;
    const o = parseFloat(get('opacity') ?? '');
    if (Number.isFinite(o)) p.opacity = (p.opacity ?? 1) * Math.min(Math.max(o, 0), 1);
    return p;
  };

  const walk = (el: Element, m: Matrix, inh: Inherit, group: number | undefined, depth: number): void => {
    const tag = el.localName.toLowerCase();
    const from = SHAPES.find((s) => s === tag);
    if (failed || (!from && tag !== 'g' && tag !== 'svg')) return;
    const t = el.getAttribute('transform');
    if (t) notes.transforms = true;
    const mm = t ? multiply(m, parseTransform(t)) : m;
    const p = inherit(el, inh);

    if (tag === 'g') {
      let g = group;
      let dp = depth;
      if (!opts.keepGroups) {
        /* flattened: no group levels */
      } else if (depth < MAX_GROUP_DEPTH) {
        const id = el.getAttribute('id');
        groups.push({ ...(group === undefined ? {} : { parent: group }), ...(id ? { id } : {}) });
        g = groups.length - 1;
        dp++;
      } else notes.mergedGroups = true;
      for (const c of el.children) walk(c, mm, p, g, dp);
      return;
    }
    if (!from) return;
    const raw = shapePath(el, tag);
    if (!raw) return;
    if (shapes.length >= maxShapes) {
      failed = 'too_many';
      return;
    }
    const d = outline(raw, mm);
    if (!d) return;
    chars += d.length;
    if (chars > maxChars) {
      failed = 'too_detailed';
      return;
    }
    const id = el.getAttribute('id');
    const shape: ReadShape = {
      from,
      d,
      fill: p.fill,
      stroke: p.stroke,
      strokeWidth: p.width * Math.sqrt(Math.abs(mm[0] * mm[3] - mm[1] * mm[2])),
      cap: p.cap,
      join: p.join,
      evenodd: p.evenodd,
      opacity: p.opacity,
      accent: p.accent,
      group,
      ...(id ? { id } : {}),
    };
    shapes.push(opts.each ? opts.each(el, shape) : shape);
  };

  const rm = parseTransform(root.getAttribute('transform'));
  if (root.getAttribute('transform')) notes.transforms = true;
  const base = opts.matrix ? multiply(opts.matrix, rm) : rm;
  const top = inherit(root, { width: 1, accent: false });
  for (const c of root.children) walk(c, base, top, undefined, 0);
  if (failed) return { ok: false, error: failed };
  if (!shapes.length) return { ok: false, error: 'empty' };
  return { ok: true, shapes, groups, viewBox: opts.viewBox, notes };
}
