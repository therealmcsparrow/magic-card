import type { CompiledTrack, CompiledV2 } from '../anim-studio/compile-v2';
import { safeCssValue, type Rig, type RigPart, type RigShape } from '../anim-studio/model';
import type { IconGeometry } from '../icons/icon-source';
import { pathBox, splitIcon, unionBox, type SplitPiece } from '../icons/icon-split';
import type { IconRig } from '../icons/mc-svg-icon';
import { sanitizeSvg } from '../icons/svg-sanitize';
import { cubicsToPath, toCubicSubpaths } from '../path/core';
import { rigCss, rigSelector, tracksDraw } from './rig-css';
import type { ApplyCtx, HintCtx, RuntimeHints } from './types';

// v2 runtime, icon rigs: hints give an IconRig (geometry source, body markup, stylesheet) for the module icon, which the
// card renders as <mc-svg-icon> in rig mode. Until the geometry resolves the plain icon is drawn. Imports neither Lit nor
// icon-source, so the card bundle keeps them whole.

export type Box = [number, number, number, number];
const r3 = (n: number): string => String(+n.toFixed(3));
const centre = (b: Box): [number, number] => [b[0] + b[2] / 2, b[1] + b[3] / 2];
const originStyle = (o: [number, number]): string => `transform-origin: ${r3(o[0])}px ${r3(o[1])}px`;

function viewBoxOf(vb: string): Box {
  const [x, y, w, h] = vb.split(/[\s,]+/).map(Number);
  return [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 ? [x, y, w, h] : [0, 0, 24, 24];
}

/** Path data split into one path per subpath (each draws on over its own length). */
export const subpathsOf = (d: string): string[] => toCubicSubpaths(d).map((sub) => cubicsToPath([sub]));

interface OwnPart {
  markup: string;
  box?: Box;
  /** Subpaths of its filled shapes (draw-on outlines). */
  outlines: string[];
}
/** An own-geometry part (`svg` element markup), sanitised in the icon's viewBox: inner markup, box, outlines. */
const ownParts = new Map<string, OwnPart | null>();
function ownPart(markup: string, viewBox: string): OwnPart | undefined {
  const key = `${viewBox}|${markup}`;
  let hit = ownParts.get(key);
  if (hit === undefined) {
    const s = sanitizeSvg(`<svg viewBox="${viewBox}">${markup}</svg>`);
    hit = s.error
      ? null
      : {
          markup: s.markup.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''),
          box: unionBox([...s.paths, ...s.accentPaths, ...s.strokes.map((x) => x.d)].map(pathBox)),
          outlines: [...s.paths, ...s.accentPaths, ...s.strokes.map((x) => x.d)].flatMap(subpathsOf),
        };
    if (ownParts.size > 100) ownParts.clear();
    ownParts.set(key, hit);
  }
  return hit ?? undefined;
}

/** A part's box: its pieces (or own geometry). */
export function partBox(part: RigPart, pieces: SplitPiece[], viewBox = '0 0 24 24'): Box | undefined {
  if (part.svg) return ownPart(part.svg, viewBox)?.box;
  return unionBox((part.from ?? []).map((i) => pieces[i]?.bbox).filter((b): b is Box => !!b));
}

/** Pivots (viewBox units) of every part, group and shape by target ref: the set origin, else the box centre. */
export function rigPivots(rig: Rig, pieces: SplitPiece[], viewBox = '0 0 24 24'): Map<string, [number, number]> {
  const out = new Map<string, [number, number]>();
  const boxes = new Map<string, Box>();
  for (const p of rig.parts) {
    const b = partBox(p, pieces, viewBox);
    if (b) boxes.set(p.id, b);
    const o = p.origin ?? (b ? centre(b) : undefined);
    if (o) out.set(`part:${p.id}`, o);
  }
  for (const g of rig.groups ?? []) {
    const b = unionBox(g.parts.map((id) => boxes.get(id)).filter((x): x is Box => !!x));
    const o = g.origin ?? (b ? centre(b) : undefined);
    if (o) out.set(`group:${g.id}`, o);
  }
  for (const s of rig.shapes ?? []) out.set(`shape:${s.id}`, s.origin ?? centre(pathBox(s.d)));
  return out;
}

const paint = (v: string | undefined): string | undefined => {
  if (!v) return undefined;
  // `entity` / `entity N%` (the studio's colour picker; same as utils/entity-color, kept out of the card exposure)
  const m = /^entity(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(v.trim());
  if (m) {
    const n = m[1] === undefined ? 100 : Math.min(100, Number(m[1]));
    return n >= 100 ? 'var(--mc-entity-color, currentColor)' : `color-mix(in srgb, var(--mc-entity-color, currentColor) ${n}%, transparent)`;
  }
  return safeCssValue(v, 'color');
};

/** Attribute value escape (values are ids, numbers, path data and checked CSS: belt and braces). */
const esc = (v: string | number): string => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
/** ` name="value"` for each set attribute. */
const attrs = (a: Record<string, string | number | undefined | false>): string =>
  Object.entries(a)
    .filter(([, v]) => v !== undefined && v !== false && v !== '')
    .map(([k, v]) => ` ${k}="${esc(v as string | number)}"`)
    .join('');

function shapeEl(s: RigShape, o: [number, number] | undefined, drawn: boolean): string {
  const fill = paint(s.fill) ?? (s.stroke ? 'none' : 'currentColor');
  const stroke = paint(s.stroke);
  const style = [`fill: ${fill}`, stroke ? `stroke: ${stroke}` : '', o ? originStyle(o) : ''].filter(Boolean).join('; ');
  return `<path${attrs({
    'data-s': s.id,
    class: drawn && 'drawn',
    d: s.d,
    pathLength: drawn && '1',
    'stroke-width': s.stroke_width ?? (drawn || stroke ? 1 : undefined),
    'stroke-linecap': s.linecap,
    style,
  })}></path>`;
}

export interface RigMarkupOptions {
  /** viewBox of the source geometry (draw-on stroke width, own parts). */
  viewBox?: string;
  /** Target refs that are drawn on (their paths use pathLength=1). */
  drawn?: Set<string>;
}

/**
 * The rig as SVG markup: shapes under, unused pieces, parts (groups around their members), shapes over. Parts whose pieces
 * are missing are skipped; undefined when nothing can be drawn. Own geometry is sanitised.
 */
export function rigMarkup(rig: Rig, pieces: SplitPiece[], opts: RigMarkupOptions = {}): string | undefined {
  const viewBox = opts.viewBox ?? '0 0 24 24';
  const vb = viewBoxOf(viewBox);
  const drawn = opts.drawn ?? new Set<string>();
  const pivots = rigPivots(rig, pieces, viewBox);
  const width = r3((vb[2] / 24) * 1.2);
  const used = new Set(rig.parts.flatMap((p) => p.from ?? []));
  const groupOf = new Map<string, string>();
  for (const g of rig.groups ?? []) for (const id of g.parts) if (!groupOf.has(id)) groupOf.set(id, g.id);

  /** A piece at rest (fills keep their holes: one path with all subpaths, its fill rule). */
  const piecePath = (pc: SplitPiece, draw = false): string =>
    pc.stroke
      ? // a stroked shape draws itself: one path per subpath, each over its own length
        (draw ? subpathsOf(pc.d) : [pc.d])
          .map(
            (d) =>
              `<path${attrs({ class: draw && 'drawn', d, fill: 'none', stroke: 'currentColor', 'stroke-width': r3(pc.stroke!.width), 'stroke-linecap': pc.stroke!.cap, 'stroke-linejoin': pc.stroke!.join, pathLength: draw && '1' })}></path>`,
          )
          .join('')
      : `<path${attrs({ class: pc.secondary ? 'secondary' : 'primary', d: pc.d, 'fill-rule': pc.evenodd && 'evenodd' })}></path>`;
  /** Draw-on outline of filled shapes: one path per subpath (lock, fan: every ring draws evenly). */
  const outlines = (ds: string[]): string =>
    ds.length
      ? `<g class="outlines">${ds.map((d) => `<path${attrs({ class: 'drawn', d, fill: 'none', pathLength: '1', 'stroke-width': width })}></path>`).join('')}</g>`
      : '';

  let drew = false;
  const partEl = (p: RigPart, inDrawnGroup: boolean): string => {
    const draw = inDrawnGroup || drawn.has(`part:${p.id}`);
    const o = pivots.get(`part:${p.id}`);
    const open = `<g${attrs({ 'data-p': p.id, style: o && originStyle(o) })}>`;
    if (p.svg) {
      const own = ownPart(p.svg, viewBox);
      if (!own) return '';
      drew = true;
      // own geometry draws on by the outline of its shapes (its own strokes stay as drawn)
      return `${open}${own.markup}${draw ? outlines(own.outlines) : ''}</g>`;
    }
    const list = (p.from ?? []).map((i) => pieces[i]).filter((x): x is SplitPiece => !!x);
    if (!list.length) return '';
    drew = true;
    const fills = list.filter((pc) => !pc.stroke);
    return `${open}${list.map((pc) => piecePath(pc, draw)).join('')}${draw ? outlines(fills.flatMap((pc) => subpathsOf(pc.d))) : ''}</g>`;
  };

  const placed = new Set<string>();
  let items = '';
  for (const p of rig.parts) {
    const gid = groupOf.get(p.id);
    if (!gid) {
      items += partEl(p, false);
      continue;
    }
    if (placed.has(gid)) continue;
    placed.add(gid);
    const gDraw = drawn.has(`group:${gid}`);
    const members = rig.parts
      .filter((m) => groupOf.get(m.id) === gid)
      .map((m) => partEl(m, gDraw))
      .join('');
    const o = pivots.get(`group:${gid}`);
    items += `<g${attrs({ 'data-g': gid, style: o && originStyle(o) })}>${members}</g>`;
  }
  const shapes = rig.shapes ?? [];
  const shapeEls = (layer: 'under' | 'over') =>
    shapes
      .filter((s) => s.layer === layer)
      .map((s) => shapeEl(s, pivots.get(`shape:${s.id}`), drawn.has(`shape:${s.id}`)))
      .join('');
  if (!drew && !shapes.length) return undefined;
  const rest = pieces
    .filter((pc) => !used.has(pc.index))
    .map((pc) => piecePath(pc))
    .join('');
  return `<g class="rig">${shapeEls('under')}${rest}${items}${shapeEls('over')}</g>`;
}

/** Rig targets the tracks draw on. */
export function drawnTargets(tracks: CompiledTrack[]): Set<string> {
  return new Set(tracks.filter((t) => rigSelector(t.target) && tracksDraw(t)).map((t) => t.target));
}

/** An IconRig with the stylesheet to adopt next to it. */
export interface RuntimeRig extends IconRig {
  css: string;
}


/** Split pieces per geometry (geometries are cached objects in icon-source). */
const piecesOf = new WeakMap<IconGeometry, SplitPiece[]>();
export function piecesFor(g: IconGeometry): SplitPiece[] {
  let p = piecesOf.get(g);
  if (!p) piecesOf.set(g, (p = splitIcon(g)));
  return p;
}

/** Build the icon rig of a document's v2 data for one entry's timing. */
export function buildRig(v2: CompiledV2, opts: { timing?: string; still?: boolean } = {}): RuntimeRig | undefined {
  const rig = v2.rig;
  if (!rig || (!rig.parts.length && !rig.shapes?.length)) return undefined;
  const tracks = opts.still ? [] : v2.tracks;
  const drawn = drawnTargets(tracks);
  const bodies = new WeakMap<IconGeometry, string | null>();
  const css = rigCss(tracks, rig, opts);
  return {
    // the source: its icon, its own SVG (registered by the icon), else the module's own icon
    ...(rig.icon ? { ref: rig.icon } : rig.svg ? { svg: rig.svg } : {}),
    css,
    sheet: (root, on) => adoptRigCss(root, on ? css : undefined),
    body(g: IconGeometry): string | undefined {
      let b = bodies.get(g);
      if (b === undefined) bodies.set(g, (b = rigMarkup(rig, piecesFor(g), { viewBox: g.viewBox, drawn }) ?? null));
      return b ?? undefined;
    },
  };
}

// ── card glue ──

/** Rigs by run key + timing (bounded): the same document on many icons shares one object. */
const rigs = new Map<string, RuntimeRig | null>();

/**
 * The icon rig of a resolved document (resolve-time hint): the card passes it to the module's main
 * icon (renderIcon `rig`, <mc-svg-icon> rig mode). The same object for the same run key and timing,
 * so re-renders (new v2 objects every time) do not redraw the icon; undefined without a rig.
 */
export function rigHint(v2: CompiledV2, ctx: Pick<HintCtx, 'run' | 'timing' | 'still'>): RuntimeRig | undefined {
  if (!v2.rig) return undefined;
  const key = `${ctx.run ?? ''}|${ctx.timing ?? ''}${ctx.still ? '|still' : ''}`;
  let hit = ctx.run ? rigs.get(key) : undefined;
  if (hit === undefined) {
    hit = buildRig(v2, { timing: ctx.timing, still: ctx.still }) ?? null;
    if (ctx.run) {
      if (rigs.size > 64) rigs.delete(rigs.keys().next().value!);
      rigs.set(key, hit);
    }
  }
  return hit ?? undefined;
}

/** Resolve-time hints of this module (index.ts resolveHints): the icon rig, for entries on the icon. */
export function hints(v2: CompiledV2, ctx: HintCtx): RuntimeHints {
  // only an entry that reaches the module's icon draws it as a rig (not one aimed at the whole module)
  const rig = ctx.icon ? rigHint(v2, ctx) : undefined;
  return rig ? { rig } : {};
}

const canAdopt = (): boolean =>
  typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype && typeof ShadowRoot !== 'undefined' && 'adoptedStyleSheets' in ShadowRoot.prototype;

/** Constructable sheets by CSS text (bounded), shared by every icon playing the same rig. */
const sheets = new Map<string, CSSStyleSheet>();
function sheetFor(css: string): CSSStyleSheet {
  let s = sheets.get(css);
  if (!s) {
    s = new CSSStyleSheet();
    s.replaceSync(css);
    if (sheets.size > 64) sheets.delete(sheets.keys().next().value!);
    sheets.set(css, s);
  }
  return s;
}

/** What each icon's shadow root got from a rig (to swap or drop it). */
const adopted = new WeakMap<ShadowRoot, CSSStyleSheet | HTMLStyleElement>();

/** Put `css` in the shadow root as the rig sheet (undefined: remove it). */
export function adoptRigCss(root: ShadowRoot, css: string | undefined): void {
  const prev = adopted.get(root);
  if (prev instanceof HTMLStyleElement || (!canAdopt() && css !== undefined)) {
    // no constructable sheets: a <style> in the shadow root (Lit leaves foreign children alone)
    const el = prev instanceof HTMLStyleElement ? prev : document.createElement('style');
    if (css === undefined) {
      el.remove();
      adopted.delete(root);
      return;
    }
    if (el.textContent !== css) el.textContent = css;
    el.setAttribute('data-mc-rig', '');
    if (!el.isConnected) root.appendChild(el);
    adopted.set(root, el);
    return;
  }
  const next = css === undefined ? undefined : sheetFor(css);
  if (prev === next) return;
  const keep = root.adoptedStyleSheets.filter((s) => s !== prev);
  root.adoptedStyleSheets = next ? [...keep, next] : keep;
  if (next) adopted.set(root, next);
  else adopted.delete(root);
}

/** The rig itself is rendered through the resolve hint (rigHint): nothing to do after the render. */
export function apply(_wrapper: HTMLElement, _v2: CompiledV2, _ctx: ApplyCtx): void {}

/** Nothing is kept per wrapper: the rig leaves with the hint (the icon drops its sheet). */
export function prune(_wrapper: HTMLElement, _keep: string[]): void {}

/** Nothing is kept per wrapper. */
export function release(_wrapper: HTMLElement): void {}

/** Tests: forget cached rigs and sheets. */
export function __resetRigForTests(): void {
  rigs.clear();
  sheets.clear();
  ownParts.clear();
}
