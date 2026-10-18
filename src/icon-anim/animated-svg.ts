import { animationName, cssWriter, easingCss, hashString, keyframeListCss, samplePath } from '../anim-studio/compile';
import { compileTracks } from '../anim-studio/compile-v2';
import { safeCssValue, validateAnimationDoc, type AnimationDoc, type AnimationKeyframe, type Rig } from '../anim-studio/model';
import '../anim-studio/model-v2';
import { drawnTargets, rigMarkup, rigPivots } from '../anim-runtime/rig';
import { rigCss } from '../anim-runtime/rig-css';
import type { IconGeometry } from '../icons/icon-source';
import { splitIcon, type SplitPiece } from '../icons/icon-split';
import { SVG_MAX_BYTES, sanitizeSvg } from '../icons/svg-sanitize';
import { EASINGS } from '../utils/animation-presets';
import { t } from '../anim-studio/i18n';

/*
 * Animated SVG export (icon animator core): an icon animation as a standalone, looping SVG file.
 *
 * - CSS: a <style> with the document's @keyframes per part (the same rules the card's rig runtime
 *   adopts in the icon) and the element / icon keyframes on wrapper groups.
 * - SMIL fallback (opts.smil, default on): a second copy of the rig animated with <animate> /
 *   <animateTransform> for viewers without CSS animations. The CSS copy is hidden by attribute and
 *   shown by the stylesheet, the SMIL copy hidden by the stylesheet: a viewer with CSS plays the
 *   CSS copy, one without plays the SMIL copy, never both.
 * Only what a file can hold: clips (per-state timelines), value bindings and card-part tracks
 * (name, state, background) are left out with a warning; the file always loops.
 */

export interface AnimatedSvgOptions {
  /** Add the SMIL fallback copy (default true). */
  smil?: boolean;
  /** The icon colour (a CSS colour); default: currentColor (black in an <img>, the text colour inline). */
  color?: string;
}

export interface AnimatedSvgResult {
  /** The SVG document ('' when the animation cannot be exported). */
  svg: string;
  /** What was left out or changed, in sentence case. */
  warnings: string[];
}

/** Above this size the export still works, with a warning. */
export const ANIMATED_SVG_WARN_BYTES = 256 * 1024;

const PLAIN_COLOR = /^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;
/** A colour as an SVG paint attribute: entity colours, var() and anything not plain become currentColor (svg-export's rule). */
export function exportPaint(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  if (/^entity\b/i.test(t) || /var\(/i.test(t) || /^currentcolor$/i.test(t)) return 'currentColor';
  return PLAIN_COLOR.test(t) ? t : 'currentColor';
}

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n4 = (n: number): string => String(+n.toFixed(4));
const bytes = (s: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length);

type Vb = [number, number, number, number];
function viewBoxOf(vb: string): Vb {
  const [x, y, w, h] = vb.split(/[\s,]+/).map(Number);
  return [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 ? [x, y, w, h] : [0, 0, 24, 24];
}

/** A CSS transform-origin in viewBox units (keywords and % of the viewBox; lengths as viewBox units). */
export function originPoint(origin: string | undefined, vb: Vb): [number, number] {
  const parts = (origin ?? 'center').trim().split(/\s+/);
  const axis = (v: string | undefined, i: 0 | 1): number => {
    const size = vb[2 + i];
    const start = vb[i];
    if (!v || v === 'center') return start + size / 2;
    if (v === 'left' || v === 'top') return start;
    if (v === 'right' || v === 'bottom') return start + size;
    const n = parseFloat(v);
    if (!Number.isFinite(n)) return start + size / 2;
    return v.endsWith('%') ? start + (size * n) / 100 : start + n;
  };
  // "top center" / "center left": keywords may come in either order
  let [a, b] = parts;
  if (a === 'top' || a === 'bottom' || ((b === 'left' || b === 'right') && a === 'center')) [a, b] = [b, a];
  return [axis(a, 0), axis(b ?? 'center', 1)];
}

// ── SMIL ──

const BEZIER: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

/** An easing as SMIL keySplines (control points clamped to 0-1, as SMIL requires); 'steps' for step easings. */
export function smilSpline(easing: string | undefined): [number, number, number, number] | 'steps' {
  const css = (EASINGS.find((e) => e.id === easing)?.css ?? easing ?? 'ease').trim();
  if (/^steps\(/.test(css)) return 'steps';
  if (BEZIER[css]) return BEZIER[css];
  const m = /^cubic-bezier\(([^)]*)\)$/.exec(css);
  if (m) {
    const v = m[1].split(',').map((x) => Math.min(1, Math.max(0, Number(x))));
    if (v.length === 4 && v.every(Number.isFinite)) return v as [number, number, number, number];
  }
  return BEZIER.ease;
}

type Lane = 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY' | 'opacity' | 'color' | 'stroke' | 'draw';
/** Easing lane ids behind each SMIL lane (per-lane easings). */
const EASE_LANE: Record<Lane, string> = { translate: 'x', rotate: 'rotate', scale: 'scale', skewX: 'skew', skewY: 'skew', opacity: 'opacity', color: 'color', stroke: 'stroke', draw: 'draw' };

/** The value of a lane at a key (undefined: the key does not set it). */
function laneValue(k: AnimationKeyframe, lane: Lane): number[] | string | undefined {
  const t = k.transform;
  switch (lane) {
    case 'translate':
      return t && (t.x !== undefined || t.y !== undefined) ? [t.x ?? 0, t.y ?? 0] : undefined;
    case 'rotate':
      return t?.rotate !== undefined ? [t.rotate] : undefined;
    case 'scale':
      if (!t || (t.scale === undefined && t.scale_x === undefined && t.scale_y === undefined)) return undefined;
      return [(t.scale ?? 1) * (t.scale_x ?? 1), (t.scale ?? 1) * (t.scale_y ?? 1)];
    case 'skewX':
      return t && (t.skew_x !== undefined || t.skew_y !== undefined) ? [t.skew_x ?? 0] : undefined;
    case 'skewY':
      return t && (t.skew_x !== undefined || t.skew_y !== undefined) ? [t.skew_y ?? 0] : undefined;
    case 'opacity':
      return k.opacity !== undefined ? [k.opacity] : undefined;
    case 'color':
      return k.color ? (exportPaint(k.color) ?? 'currentColor') : undefined;
    case 'stroke':
      return k.stroke ? (exportPaint(k.stroke) ?? 'currentColor') : undefined;
    case 'draw':
      return k.draw !== undefined ? [1 - k.draw] : undefined;
  }
}

interface LaneTrack {
  times: number[];
  values: Array<number[] | string>;
  /** Segment easings (one per gap). */
  easings: Array<string | undefined>;
}

/** The keys of one lane, padded to 0 and 1. */
function laneTrack(keys: AnimationKeyframe[], lane: Lane, docEasing: string): LaneTrack | undefined {
  const own = keys.filter((k) => laneValue(k, lane) !== undefined);
  if (!own.length) return undefined;
  const times: number[] = [];
  const values: Array<number[] | string> = [];
  const easings: Array<string | undefined> = [];
  const push = (at: number, v: number[] | string, e: string | undefined) => {
    const t = Math.min(1, Math.max(0, at / 100));
    if (times.length && t <= times[times.length - 1]) {
      // same time twice: the later value wins (CSS merges keys at one offset)
      values[values.length - 1] = v;
      easings[easings.length - 1] = e;
      return;
    }
    times.push(t);
    values.push(v);
    easings.push(e);
  };
  if (own[0].at > 0) push(0, laneValue(own[0], lane)!, 'linear');
  for (const k of own) push(k.at, laneValue(k, lane)!, k.easings?.[EASE_LANE[lane] as keyof NonNullable<AnimationKeyframe['easings']>] ?? k.easing ?? docEasing);
  if (times[times.length - 1] < 1) push(100, values[values.length - 1], 'linear');
  if (times.length === 1) {
    times.push(1);
    values.push(values[0]);
    easings.push('linear');
  }
  easings.pop();
  return { times, values, easings };
}

const fmtValue = (v: number[] | string): string => (typeof v === 'string' ? v : v.map(n4).join(' '));

function timing(l: LaneTrack): string {
  const splines = l.easings.map(smilSpline);
  const keyTimes = ` keyTimes="${l.times.map(n4).join(';')}"`;
  if (splines.some((s) => s === 'steps')) return ` calcMode="discrete"${keyTimes}`;
  return ` calcMode="spline"${keyTimes} keySplines="${(splines as number[][]).map((s) => s.map(n4).join(' ')).join(';')}"`;
}

const REPEAT = (dur: number) => ` dur="${n4(dur)}s" repeatCount="indefinite" begin="0s"`;

function animateTransform(type: string, l: LaneTrack, dur: number, map: (v: number[]) => string): string {
  return `<animateTransform attributeName="transform" type="${type}" additive="sum" values="${l.values.map((v) => map(v as number[])).join(';')}"${timing(l)}${REPEAT(dur)}/>`;
}

function animateAttr(name: string, l: LaneTrack, dur: number): string {
  return `<animate attributeName="${name}" values="${l.values.map(fmtValue).join(';')}"${timing(l)}${REPEAT(dur)}/>`;
}

/** fill-opacity steps of a draw lane: the fill fades in over the last quarter of a draw-on (rig-css fillSteps). */
function fillLane(draw: LaneTrack): LaneTrack {
  const keys = draw.times.map((t, i): [number, number] => [t, (draw.values[i] as number[])[0] <= 0.001 ? 1 : 0]);
  const times: number[] = [];
  const values: number[][] = [];
  keys.forEach(([t, v], i) => {
    const prev = keys[i - 1];
    if (prev && prev[1] !== v) {
      const mid = prev[0] + (t - prev[0]) * (v ? 0.75 : 0.25);
      if (mid > times[times.length - 1]) {
        times.push(mid);
        values.push([0]);
      }
    }
    if (!times.length || t > times[times.length - 1]) {
      times.push(t);
      values.push([v]);
    }
  });
  return { times, values, easings: times.slice(1).map(() => 'linear') };
}

/**
 * SMIL elements for one target's keys: the transform as a sandwich of additive animateTransforms
 * around the pivot (translate to pivot + offset, rotate, scale, skew, translate back), then the
 * paint lanes. `path`: a motion path in viewBox units (sampled into a translate).
 */
export function smilFor(keys: AnimationKeyframe[], pivot: [number, number], dur: number, docEasing: string, path?: { d: string }): string {
  const out: string[] = [];
  const lane = (l: Lane) => laneTrack(keys, l, docEasing);
  const tr = lane('translate');
  const turn = [lane('rotate'), lane('scale'), lane('skewX'), lane('skewY')] as const;
  const pivoted = turn.some(Boolean);
  const [cx, cy] = pivoted ? pivot : [0, 0];
  if (path) {
    const samples = samplePath(path.d, 32);
    if (samples.length) {
      const pl: LaneTrack = { times: samples.map((s) => s.t), values: samples.map((s) => [s.x, s.y]), easings: samples.slice(1).map(() => 'linear') };
      out.push(animateTransform('translate', pl, dur, (v) => `${n4(v[0])} ${n4(v[1])}`));
    }
  }
  if (tr) out.push(animateTransform('translate', tr, dur, (v) => `${n4(v[0] + cx)} ${n4(v[1] + cy)}`));
  else if (pivoted) out.push(animateTransform('translate', { times: [0, 1], values: [[cx, cy], [cx, cy]], easings: ['linear'] }, dur, (v) => `${n4(v[0])} ${n4(v[1])}`));
  const [rotate, scale, skewX, skewY] = turn;
  if (rotate) out.push(animateTransform('rotate', rotate, dur, (v) => n4(v[0])));
  if (scale) out.push(animateTransform('scale', scale, dur, (v) => `${n4(v[0])} ${n4(v[1])}`));
  if (skewX) out.push(animateTransform('skewX', skewX, dur, (v) => n4(v[0])));
  if (skewY) out.push(animateTransform('skewY', skewY, dur, (v) => n4(v[0])));
  if (pivoted) out.push(animateTransform('translate', { times: [0, 1], values: [[-cx, -cy], [-cx, -cy]], easings: ['linear'] }, dur, (v) => `${n4(v[0])} ${n4(v[1])}`));
  const opacity = lane('opacity');
  if (opacity) out.push(animateAttr('opacity', opacity, dur));
  const color = lane('color');
  if (color) out.push(animateAttr('color', color, dur));
  const stroke = lane('stroke');
  if (stroke) out.push(animateAttr('stroke', stroke, dur));
  const draw = lane('draw');
  if (draw) {
    out.push(animateAttr('stroke-dashoffset', draw, dur));
    const fill = fillLane(draw);
    out.push(animateAttr('fill-opacity', fill, dur));
    out.push(animateAttr('stroke-opacity', { ...fill, values: fill.values.map((v) => [1 - (v as number[])[0]]) }, dur));
  }
  return out.join('');
}

/** The rig markup made self-standing for viewers without CSS: paint as attributes, no inline styles. */
function smilStatic(markup: string): string {
  return markup
    .replace(/ style="([^"]*)"/g, (_, style: string) =>
      style
        .split(';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => {
          const [p, ...rest] = d.split(':');
          const prop = p.trim();
          const v = rest.join(':').trim();
          return prop === 'fill' || prop === 'stroke' ? ` ${prop}="${esc(v === 'none' ? 'none' : (exportPaint(v) ?? 'currentColor'))}"` : '';
        })
        .join(''),
    )
    .replace(/ class="drawn"/g, ' class="drawn" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"')
    // outlines of filled parts are closed: flat ends (no cap dot before they draw), like rig-css
    .replace(/<g class="outlines">[\s\S]*?<\/g>/g, (m) => m.replace(/stroke-linecap="round"/g, 'stroke-linecap="butt"').replace(/stroke-dasharray="1"/g, 'stroke-dasharray="0.999 2"'))
    .replace(/<g class="outlines">/g, '<g class="outlines" stroke="currentColor">')
    .replace(/<g class="rig">/, '<g class="rig" fill="currentColor">');
}

/** Insert SMIL children into a target element of the markup (parts / groups: after the opening tag; shapes: inside the path). */
function inject(markup: string, target: string, smil: string): string {
  const m = /^(part|group|shape):(.+)$/.exec(target);
  if (!m || !smil) return markup;
  const attr = m[1] === 'part' ? 'data-p' : m[1] === 'group' ? 'data-g' : 'data-s';
  const re = new RegExp(`(<(g|path) ${attr}="${m[2]}"[^>]*>)`);
  return markup.replace(re, (open: string) => `${open}${smil}`);
}

/** The [start, end) of a target's element in the markup (its `<g>` with what it holds, or its `<path>`). */
function elementSpan(markup: string, target: string): [number, number] | undefined {
  const m = /^(part|group|shape):(.+)$/.exec(target);
  if (!m) return undefined;
  const attr = m[1] === 'part' ? 'data-p' : m[1] === 'group' ? 'data-g' : 'data-s';
  const open = new RegExp(`<(g|path) ${attr}="${m[2]}"[^>]*>`).exec(markup);
  if (!open) return undefined;
  if (open[1] === 'path') return [open.index, markup.indexOf('</path>', open.index) + 7];
  const tags = /<g\b[^>]*>|<\/g>/g;
  tags.lastIndex = open.index + open[0].length;
  let depth = 1;
  for (let t = tags.exec(markup); t; t = tags.exec(markup)) {
    depth += t[0] === '</g>' ? -1 : 1;
    if (!depth) return [open.index, t.index + 4];
  }
  return undefined;
}

/** A drawn target's filled pieces never take its stroke (the SMIL copy's twin of rig-css). */
function noFillStroke(markup: string, target: string): string {
  const span = elementSpan(markup, target);
  if (!span) return markup;
  const inner = markup.slice(span[0], span[1]).replace(/ class="(primary|secondary)"/g, ' class="$1" stroke="none"');
  return markup.slice(0, span[0]) + inner + markup.slice(span[1]);
}

// ── export ──

/** Keys that change nothing (every key the same look): no animation needed. */
function still(kfs: AnimationKeyframe[]): boolean {
  const look = (k: AnimationKeyframe) => {
    const c: Partial<AnimationKeyframe> = { ...k };
    delete c.at;
    delete c.easing;
    delete c.easings;
    return JSON.stringify(c);
  };
  return kfs.every((k) => look(k) === look(kfs[0]));
}

const NOT_EXPORTED_TARGETS = new Set(['name', 'state', 'background']);

/** A file name for the animated SVG from the document name. */
export function animatedSvgFileName(name: string): string {
  const slug = (name ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${slug || 'icon'}-animated.svg`;
}

/**
 * The animation as a standalone looping SVG of the icon (`geometry`: the source icon's, or the
 * own SVG source's). See the file comment for what is exported.
 */
export function exportAnimatedSvg(doc: AnimationDoc, geometry: IconGeometry, opts: AnimatedSvgOptions = {}): AnimatedSvgResult {
  const warnings: string[] = [];
  const r = validateAnimationDoc(doc, { v2: 'lenient' });
  if (!r.ok) return { svg: '', warnings: [t('The animation is not valid: {message}', { message: r.errors[0]?.message ?? t('unknown error') })] };
  const d = r.doc;
  if (d.kind !== 'keyframes') return { svg: '', warnings: [t('Only keyframe animations export as an animated SVG.')] };
  if (d.clips?.length) warnings.push(t('States (clips) are not exported: the file plays the animation’s own timeline.'));
  if (d.bindings?.length) warnings.push(t('Value bindings are not exported: the file plays at the drawn values.'));
  if (d.iterations !== 'infinite') warnings.push(t('The file loops: the repeat count is not exported.'));
  if (d.tracks?.some((t) => NOT_EXPORTED_TARGETS.has(t.target))) warnings.push(t('Tracks of card parts (name, state, background) are not exported.'));
  const smil = opts.smil !== false;
  if (smil && d.direction && d.direction !== 'normal') warnings.push(t('The SMIL fallback plays the animation forwards only.'));
  if (smil && [...(d.keyframes ?? []), ...(d.tracks ?? []).flatMap((t) => t.keyframes)].some((k) => k.transform?.axis)) warnings.push('3D turns play flat in the SMIL fallback.');

  const viewBox = geometry.viewBox || '0 0 24 24';
  const vb = viewBoxOf(viewBox);
  const pieces: SplitPiece[] = splitIcon(geometry);
  const rig: Rig = d.rig ?? { parts: [] };
  const tracks = compileTracks(d);
  const drawn = drawnTargets(tracks);
  let body = rigMarkup(rig, pieces, { viewBox, drawn });
  if (!body) {
    // no parts: the whole icon at rest
    body = `<g class="rig">${pieces.map((pc) => `<path class="${pc.secondary ? 'secondary' : 'primary'}" d="${esc(pc.d)}"${pc.evenodd ? ' fill-rule="evenodd"' : ''}></path>`).join('')}</g>`;
  }
  if (!pieces.length && !rig.shapes?.length) return { svg: '', warnings: [...warnings, t('The icon has no shapes to export.')] };

  const dur = d.duration;
  const time = `${n4(dur)}s ${easingCss(d.easing)} 0s infinite ${d.direction ?? 'normal'}`;
  const color = opts.color ? safeCssValue(opts.color, 'color') : undefined;
  if (opts.color && !color) warnings.push(t('The colour is not a valid CSS colour: the file uses currentColor.'));
  const plain = color ? (exportPaint(color) ?? 'currentColor') : undefined;

  // every rule is scoped by a class of this file (its content's hash): several exports inline in
  // one page never style each other
  const root = `mc-a-${hashString(`${body}|${JSON.stringify(d)}|${smil}|${color ?? ''}`)}`;
  // wrappers: element keyframes > element track > icon track > the rig
  const name = animationName(d);
  const w = cssWriter(d.id);
  const origin = d.origin || 'center';
  const wrapCss: string[] = [];
  const wrapAnim = (cls: string, rule: string, kfs: AnimationKeyframe[], ownOrigin?: string) => {
    if (still(kfs)) return;
    const k = keyframeListCss(rule, kfs, w);
    wrapCss.push(k.css, `.${root} .mc-css .${cls} { transform-box: view-box; transform-origin: ${ownOrigin ?? origin}; animation: ${[rule, ...k.lanes].map((n) => `${n} ${time}`).join(', ')}; }`);
  };
  const elTrack = d.tracks?.find((t) => t.target === 'element');
  const icTrack = d.tracks?.find((t) => t.target === 'icon');
  wrapAnim('mc-el', `${name}-el`, d.keyframes ?? []);
  wrapAnim('mc-et', `${name}-et`, elTrack?.keyframes ?? [], elTrack?.origin);
  wrapAnim('mc-it', `${name}-it`, icTrack?.keyframes ?? [], icTrack?.origin);

  const scope = (css: string) => css.replace(/(^|[\s,{])\.rig\b/g, `$1.${root} .mc-css .rig`);
  const style = [
    `.${root} { --mc-anim-c: ${color ?? 'currentColor'};${color ? ` color: ${color};` : ''} }`,
    ...(smil ? [`.${root} .mc-css { visibility: visible; }`, `.${root} .mc-smil { display: none; }`] : []),
    scope(rigCss(tracks, rig, { timing: time })),
    ...wrapCss,
    // reduced motion: the wrappers stand still too (the rig's own rule covers the parts)
    ...(wrapCss.length ? [`@media (prefers-reduced-motion: reduce) { .${root} .mc-el, .${root} .mc-et, .${root} .mc-it { animation: none !important; } }`] : []),
  ].join('\n');

  const wrap = (inner: string) => `<g class="mc-el"><g class="mc-et"><g class="mc-it">${inner}</g></g></g>`;
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${esc(vb.join(' '))}" class="mc-anim ${root}"${plain ? ` color="${esc(plain)}"` : ''}>`);
  out.push(`<title>${esc(d.name)}</title>`);
  out.push(`<style>\n${style}\n</style>`);
  out.push(`<g class="mc-css"${smil ? ' visibility="hidden"' : ''}>${wrap(body)}</g>`);
  if (smil) {
    let copy = smilStatic(body);
    const pivots = rigPivots(rig, pieces, viewBox);
    // a rig track's origin plays with transform-box view-box: lengths count from 0 0, as the part pivots do
    const rigVb: Vb = [0, 0, vb[2], vb[3]];
    for (const t of d.tracks ?? []) {
      if (!/^(part|group|shape):/.test(t.target)) continue;
      if (drawn.has(t.target)) copy = noFillStroke(copy, t.target);
      copy = inject(copy, t.target, smilFor(t.keyframes, t.origin ? originPoint(t.origin, rigVb) : (pivots.get(t.target) ?? originPoint('center', vb)), dur, d.easing, t.path));
    }
    const centre = originPoint(origin, vb);
    const wrapSmil = (kfs: AnimationKeyframe[] | undefined, pivot: [number, number], inner: string) => {
      const s = kfs && !still(kfs) ? smilFor(kfs, pivot, dur, d.easing) : '';
      return s ? `<g>${s}${inner}</g>` : inner;
    };
    copy = wrapSmil(icTrack?.keyframes, icTrack?.origin ? originPoint(icTrack.origin, vb) : centre, copy);
    copy = wrapSmil(elTrack?.keyframes, elTrack?.origin ? originPoint(elTrack.origin, vb) : centre, copy);
    copy = wrapSmil(d.keyframes, centre, copy);
    out.push(`<g class="mc-smil">${copy}</g>`);
  }
  out.push('</svg>');
  const svg = out.join('\n');
  if (bytes(svg) > ANIMATED_SVG_WARN_BYTES) warnings.push(t('The file is {size} KB, larger than 256 KB.', { size: Math.round(bytes(svg) / 1024) }));
  return { svg, warnings };
}

const ALLOWED = new Set(['svg', 'g', 'path', 'title', 'style', 'animate', 'animatetransform']);

/**
 * Why an exported animated SVG is unsafe or broken (undefined: fine): only drawing, style and SMIL
 * animation elements; nothing that runs or fetches (scripts, handlers, links, external url(),
 * @import, entities); and its drawing passes the own-icon sanitiser with shapes left.
 */
export function checkAnimatedSvg(svg: string): string | undefined {
  if (/<script|<foreignobject|<iframe|<image|<use|<!entity|<!doctype/i.test(svg)) return t('Contains an element that runs or fetches.');
  if (/\son[a-z]+\s*=/i.test(svg)) return t('Contains an event handler.');
  if (/\shref\s*=|xlink:/i.test(svg)) return t('Contains a link.');
  if (/url\(\s*['"]?(?!#)/i.test(svg) || /@import|javascript:|expression\s*\(/i.test(svg)) return t('Contains an external reference.');
  for (const m of svg.matchAll(/<([a-zA-Z][\w-]*)/g)) if (!ALLOWED.has(m[1].toLowerCase())) return t('Unexpected element <{element}>.', { element: m[1] });
  // the drawing as the sanitiser sees it (no style, no animation); a large file: its CSS copy
  let drawing = svg.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<animate(Transform)?\b[^>]*\/>/g, '');
  if (bytes(drawing) > SVG_MAX_BYTES && drawing.includes('<g class="mc-smil">')) drawing = `${drawing.slice(0, drawing.indexOf('<g class="mc-smil">'))}</svg>`;
  const s = sanitizeSvg(drawing);
  if (s.error) return s.error;
  if (!s.paths.length && !s.strokes.length && !s.accentPaths.length) return t('Nothing is drawn.');
  return undefined;
}

/**
 * Icon geometry from split pieces (the studio keeps the pieces, not the source): filled pieces as
 * paths, accent pieces as secondary paths, stroked pieces as strokes. Splitting it again gives the
 * same pieces in the same order (one piece per element; a lone piece keeps its holes).
 */
export function geometryFromPieces(pieces: Array<{ d: string; accent?: boolean; secondary?: boolean; stroke?: { width: number; cap?: string; join?: string }; evenodd?: boolean }>, viewBox = '0 0 24 24'): IconGeometry {
  const accent = (p: (typeof pieces)[number]) => !!(p.accent || p.secondary);
  const filled = pieces.filter((p) => !p.stroke && !accent(p));
  const secondary = pieces.filter((p) => !p.stroke && accent(p));
  const strokes = pieces.filter((p) => p.stroke);
  const eo = (list: typeof pieces) => list.map((p, i) => (p.evenodd ? i : -1)).filter((i) => i >= 0);
  const evenodd = { paths: eo(filled), accent: eo(secondary) };
  return {
    paths: filled.map((p) => p.d),
    viewBox,
    ...(secondary.length ? { secondary: secondary.map((p) => p.d) } : {}),
    ...(strokes.length ? { strokes: strokes.map((p) => ({ d: p.d, width: p.stroke!.width, ...(p.stroke!.cap ? { cap: p.stroke!.cap } : {}), ...(p.stroke!.join ? { join: p.stroke!.join } : {}), ...(accent(p) ? { accent: true as const } : {}) })) } : {}),
    ...(evenodd.paths.length || evenodd.accent.length ? { evenodd } : {}),
  };
}
