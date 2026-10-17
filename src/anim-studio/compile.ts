import { toCubicSubpaths, type Cubic, type Pt } from '../icons/path-math';
import { sanitizeSvg } from '../icons/svg-sanitize';
import { EASINGS, getAnimationPreset } from '../utils/animation-presets';
import type { CompiledV2 } from './compile-v2';
import type { ParticleSlotV2, ParticlesApplyCtx, ParticlesCompiler, ParticlesModule, ParticlesSpecV2 } from '../contracts/particles-v2';
import { presetFrames } from './css-keyframes';
import {
  customRefId,
  docNeedsParticles,
  docNeedsRuntime,
  isCustomRef,
  type EasingLaneId,
  type AnimationDoc,
  type AnimationKeyframe,
  type ParticleShape,
  type ParticlesSpec,
  type PathSpec,
} from './model';

/*
 * Animation documents (model.ts) to what the card runs, pure:
 * - keyframes: an `@keyframes` rule; amplitudes scale with the entry's intensity
 *   (`--mcc-<id>-i`, 1 = as drawn), the animation colour `var(--mc-anim-c)` takes the entry's colour
 *   (`--mcc-<id>-c`) and Strength (`--mcc-<id>-s`), like a preset's $i / $c;
 * - particles: rules for an fx particle layer (`.mc-anim-fx[data-fx=<name>]`) plus its keyframes and
 *   the per-particle layout; a document based on a preset (particles.preset) renders that preset;
 * - path: sampled `translate` (+ `rotate` when following the path) keyframes in % of the element's
 *   own size or px. Particles on a px path use `offset-path: path()` (their layer is their containing
 *   block, so the path coordinates are unambiguous), with the sampled keyframes as the fallback;
 * - sequence: a schedule of Web Animations keyframes (sequence-player.ts runs it).
 * Reduced motion: `{ reducedMotion: true }` compiles the still variant (nothing plays), like the
 * presets under prefers-reduced-motion (the card's stylesheet does the same for the CSS kinds).
 */

export interface ParticleSlot {
  /** % across (fall / rise), % down (drift). */
  x: number;
  phase: number;
  k: number;
  /** Per-particle custom properties: size, spin sign, drift, colour. */
  style: string;
}

export interface CompiledLayer {
  front: boolean;
  /** v2 slots may carry their own built-in shape or symbol (particles-v2 ParticleSlotV2). */
  particles: ParticleSlotV2[];
  /** Content of each particle: an icon or a text symbol (emoji); an SVG shape is a CSS mask. */
  symbol?: { icon: string } | { text: string };
  /** Cycle length factor (particles.speed): the layer runs `duration / speed`. */
  speed: number;
}

export interface ScheduleStep {
  /** s from the start of the cycle */
  start: number;
  /** s per play */
  duration: number;
  iterations: number;
  easing: string;
  frames: Keyframe[];
  origin?: string;
}

export interface Schedule {
  steps: ScheduleStep[];
  /** s of one cycle (one target). */
  total: number;
  loop: boolean;
  target: 'element' | 'icon';
  /** s between children when the sequence staggers across them. */
  stagger?: number;
  /** Steps whose animation is missing or cannot be sequenced (by index). */
  skipped: number[];
}

export interface CompiledAnimation {
  kind: AnimationDoc['kind'];
  /** Keyframes / data-fx name, `mcc-<id>-<hash>`; '' when nothing plays. */
  name: string;
  /** Rules for the shared stylesheet (@keyframes, particle styles); '' when none. */
  css: string;
  /** Element motion (keyframes, path on the element / icon). */
  motion?: { target: 'element' | 'icon'; origin: string };
  /** A particle layer (particles, path with particles). */
  layer?: CompiledLayer;
  /** A particles document based on a built-in preset. */
  preset?: { id: string; intensity?: number };
  schedule?: Schedule;
  /** The still variant (reduced motion). */
  reduced?: boolean;
  /**
   * Extra keyframes names (per-lane easing: lanes whose easing differs are split off into their
   * own `@keyframes <name>-l<lane>`, in `css` too); the card plays them with the same timing on the
   * same element as `name`.
   */
  lanes?: string[];
  /**
   * v2 data for the lazy runtime chunk; present iff docNeedsRuntime(doc) and the v2 compiler is
   * loaded (compile-v2.ts: the studio, and the card once its runtime chunk has loaded).
   */
  v2?: CompiledV2;
  /**
   * particles v2, compiled by the particles chunk (useParticlesCompiler) for the default geometry:
   * what the card hands to ParticlesModule.apply after the render (`spec.sim` checked lenient).
   */
  sim?: Pick<ParticlesApplyCtx, 'docId' | 'spec' | 'period'>;
  /** particles v2 without the chunk's compiler: `layer` is the v1 fallback, the chunk is wanted. */
  needsParticles?: true;
}

export interface CompileOptions {
  reducedMotion?: boolean;
  /** Custom documents by id, for sequence steps. */
  lookup?: (id: string) => AnimationDoc | undefined;
}

// ── helpers ──

export const r4 = (n: number): number => +n.toFixed(4);

/** Short stable hash (djb2, base 36) of a string. */
export function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** The document's keyframes / data-fx name: changes with the content, so an edit restarts it. */
export const animationName = (doc: AnimationDoc): string => `mcc-${doc.id}-${hashString(JSON.stringify(doc))}`;

/** Custom property of a document's entry values: i (amplitude), c (colour), s (strength). */
export const docVar = (id: string, x: 'i' | 'c' | 's'): string => `--mcc-${id}-${x}`;

export function easingCss(v: string | undefined): string {
  return EASINGS.find((e) => e.id === v)?.css ?? v ?? 'ease';
}

/** The animation colour of a document's rules, scaled by its entry's Strength. */
const colorExpr = (id: string): string =>
  `color-mix(in srgb, var(${docVar(id, 'c')}, var(--mc-anim-c)) calc(var(${docVar(id, 's')}, 1) * 100%), transparent)`;
const withColor = (v: string, id: string | undefined): string => (id ? v.replace(/var\(\s*--mc-anim-c\s*\)/g, colorExpr(id)) : v);

/**
 * How a number with a unit is written: CSS scales it by the entry's intensity var; Web Animations
 * frames get the number (times `amp`).
 */
export interface Writer {
  len(n: number, unit: string): string;
  scale(n: number): string;
  color(v: string): string;
}
export const cssWriter = (id: string): Writer => ({
  len: (n, unit) => (n === 0 ? `0${unit}` : `calc(${r4(n)}${unit} * var(${docVar(id, 'i')}, 1))`),
  scale: (n) => (n === 1 ? '1' : `calc(1 + ${r4(n - 1)} * var(${docVar(id, 'i')}, 1))`),
  color: (v) => withColor(v, id),
});
const frameWriter = (amp = 1): Writer => ({
  len: (n, unit) => `${r4(n * amp)}${unit}`,
  scale: (n) => String(r4(1 + (n - 1) * amp)),
  color: (v) => v,
});

/**
 * A keyframe's declarations (CSS property names). v2 additions (absent in v1 documents, so v1
 * output is unchanged): `draw` writes `stroke-dashoffset: 1 - draw` (the rig draws a part with
 * pathLength=1 and stroke-dasharray 1, so 0 = hidden, 1 = fully drawn); `stroke` the stroke colour.
 */
export function keyframeDecls(k: AnimationKeyframe, w: Writer): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  const t = k.transform;
  if (t) {
    if (t.x !== undefined || t.y !== undefined) out.push(['translate', `${w.len(t.x ?? 0, 'px')} ${w.len(t.y ?? 0, 'px')}`]);
    if (t.scale !== undefined || t.scale_x !== undefined || t.scale_y !== undefined) {
      const s = t.scale ?? 1;
      const sx = s * (t.scale_x ?? 1);
      const sy = s * (t.scale_y ?? 1);
      out.push(['scale', sx === sy ? w.scale(sx) : `${w.scale(sx)} ${w.scale(sy)}`]);
    }
    if (t.rotate !== undefined) out.push(['rotate', `${t.axis ? `${t.axis.join(' ')} ` : ''}${w.len(t.rotate, 'deg')}`]);
    if (t.skew_x !== undefined || t.skew_y !== undefined) out.push(['transform', `skew(${w.len(t.skew_x ?? 0, 'deg')}, ${w.len(t.skew_y ?? 0, 'deg')})`]);
  }
  if (k.opacity !== undefined) out.push(['opacity', String(k.opacity)]);
  if (k.color) out.push(['color', w.color(k.color)]);
  if (k.background) out.push(['background', w.color(k.background)]);
  if (k.shadow) out.push(['box-shadow', w.color(k.shadow)]);
  if (k.filter !== undefined || k.blur !== undefined) {
    const f = [k.filter && k.filter !== 'none' ? w.color(k.filter) : '', k.blur !== undefined ? `blur(${w.len(k.blur, 'px')})` : ''].filter(Boolean).join(' ');
    out.push(['filter', f || 'none']);
  }
  if (k.radius !== undefined) out.push(['border-radius', `${k.radius}px`]);
  if (k.draw !== undefined) out.push(['stroke-dashoffset', String(r4(1 - k.draw))]);
  if (k.stroke) out.push(['stroke', w.color(k.stroke)]);
  if (k.easing) out.push(['animation-timing-function', easingCss(k.easing)]);
  return out;
}

export const block = (sel: string, decls: Array<[string, string]>): string => `  ${sel} { ${decls.map(([p, v]) => `${p}: ${v};`).join(' ')} }`;
export const keyframesRule = (name: string, blocks: string[]): string => `@keyframes ${name} {\n${blocks.join('\n')}\n}`;

/** The timeline lanes behind each CSS property keyframeDecls writes (lanes sharing a property share its easing). */
const PROPERTY_LANES: Record<string, EasingLaneId[]> = {
  translate: ['x', 'y'],
  scale: ['scale', 'scale_x', 'scale_y'],
  rotate: ['rotate'],
  transform: ['skew'],
  opacity: ['opacity'],
  color: ['color'],
  background: ['background'],
  'box-shadow': ['shadow'],
  filter: ['filter', 'blur'],
  'border-radius': ['radius'],
  'stroke-dashoffset': ['draw'],
  stroke: ['stroke'],
};
const TIMING = 'animation-timing-function';

/**
 * A keyframes list as `@keyframes name` plus, with per-lane easings, one extra `@keyframes
 * name-l<lane>` per CSS property whose lanes override the easing anywhere (named after the
 * property's first lane: x for translate, scale, filter...). The extra rules hold only that
 * property, with the lane's easing (the first overriding lane of the property wins), so all of them
 * play together with the same timing on the same element. Without `easings` this is exactly the v1
 * single rule.
 */
export function keyframeListCss(name: string, kfs: AnimationKeyframe[], w: Writer): { css: string; lanes: string[] } {
  const decls = kfs.map((k) => keyframeDecls(k, w));
  const split = Object.keys(PROPERTY_LANES).filter((prop) => kfs.some((k) => PROPERTY_LANES[prop].some((l) => k.easings?.[l] !== undefined)));
  const main = keyframesRule(name, kfs.map((k, i) => block(`${r4(k.at)}%`, decls[i].filter(([p]) => !split.includes(p)))));
  if (!split.length) return { css: main, lanes: [] };
  const lanes: string[] = [];
  const rules = [main];
  for (const prop of split) {
    const lane = PROPERTY_LANES[prop][0];
    const laneName = `${name}-l${lane}`;
    const blocks: string[] = [];
    kfs.forEach((k, i) => {
      const own = decls[i].filter(([p]) => p === prop);
      if (!own.length) return;
      const override = PROPERTY_LANES[prop].map((l) => k.easings?.[l]).find((e) => e !== undefined);
      const easing = override ?? k.easing;
      blocks.push(block(`${r4(k.at)}%`, easing ? [...own, [TIMING, easingCss(easing)]] : own));
    });
    if (!blocks.length) continue;
    lanes.push(laneName);
    rules.push(keyframesRule(laneName, blocks));
  }
  return { css: rules.join('\n'), lanes };
}

const camel = (p: string): string => (p === 'animation-timing-function' ? 'easing' : p.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));

/** A keyframes document as Web Animations keyframes (sequence steps); `amp` scales the amplitudes. */
export function docFrames(doc: AnimationDoc, amp = 1): Keyframe[] {
  if (doc.kind === 'path' && doc.path) return pathFrames(doc.path, frameWriter(amp));
  if (doc.kind !== 'keyframes' || !doc.keyframes) return [];
  const byAt = new Map<number, Record<string, string>>();
  for (const k of doc.keyframes) {
    const f = byAt.get(k.at) ?? {};
    for (const [p, v] of keyframeDecls(k, frameWriter(amp))) f[camel(p)] = v;
    byAt.set(k.at, f);
  }
  return [...byAt.entries()].sort((a, b) => a[0] - b[0]).map(([at, f]) => ({ ...f, offset: r4(at / 100) }));
}

// ── path ──

export interface PathSample {
  /** 0-1 along the path (by length). */
  t: number;
  x: number;
  y: number;
  /** deg, unwrapped (no jumps of 360). */
  angle: number;
}

const cubicAt = (c: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0], a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1]];
};

/** `n + 1` points evenly spaced along the path, with the direction of travel. */
export function samplePath(d: string, n = 48): PathSample[] {
  const cubics = toCubicSubpaths(d).flat();
  if (!cubics.length) return [];
  const pts: Pt[] = [cubics[0][0]];
  for (const c of cubics) for (let i = 1; i <= 16; i++) pts.push(cubicAt(c, i / 16));
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const at = (len: number): Pt => {
    if (total === 0) return pts[0];
    let j = 1;
    while (j < cum.length - 1 && cum[j] < len) j++;
    const seg = cum[j] - cum[j - 1] || 1;
    const f = Math.min(1, Math.max(0, (len - cum[j - 1]) / seg));
    return [pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f];
  };
  const out: PathSample[] = [];
  let prev: number | undefined;
  const eps = total / (n * 4) || 1e-3;
  for (let i = 0; i <= n; i++) {
    const len = (total * i) / n;
    const p = at(len);
    const a = at(Math.max(0, len - eps));
    const b = at(Math.min(total, len + eps));
    let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    if (prev !== undefined) {
      while (angle - prev > 180) angle -= 360;
      while (angle - prev < -180) angle += 360;
    }
    prev = angle;
    out.push({ t: i / n, x: p[0], y: p[1], angle });
  }
  return out;
}

/** Sampled path declarations per offset: translate (in `unit`) and, following the path, rotate. */
export function pathDecls(path: PathSpec, w: Writer, unit: [string, string]): Array<[number, Array<[string, string]>]> {
  return samplePath(path.d).map((s) => {
    const decls: Array<[string, string]> = [['translate', `${w.len(r4(s.x), unit[0])} ${w.len(r4(s.y), unit[1])}`]];
    if (path.follow_rotation) decls.push(['rotate', `${r4(s.angle)}deg`]);
    return [r4(s.t * 100), decls];
  });
}

function pathFrames(path: PathSpec, w: Writer): Keyframe[] {
  return pathDecls(path, w, path.units === 'px' ? ['px', 'px'] : ['%', '%']).map(([at, decls]) => ({
    ...Object.fromEntries(decls.map(([p, v]) => [camel(p), v])),
    offset: r4(at / 100),
  }));
}

// ── particles ──

const GOLDEN = 0.618034;
const frac = (n: number): number => n - Math.floor(n);

/** `<svg>` markup as a CSS mask image (a data: URL never runs or fetches anything). */
export function svgMaskUrl(markup: string): string {
  const svg = markup.replace(/^<svg\b(?![^>]*\bxmlns=)/, '<svg xmlns="http://www.w3.org/2000/svg"');
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Look of particle shapes: a dot, an SVG mask, or (icon / emoji) the content of each particle. */
function shapeCss(shape: ParticleShape | undefined, svgMarkup: (svg: string) => string): string {
  if (!shape) return 'border-radius: 50%; background: currentColor;';
  if ('svg' in shape) {
    const markup = svgMarkup(shape.svg);
    if (!markup) return 'border-radius: 50%; background: currentColor;';
    const url = svgMaskUrl(markup);
    return `background: currentColor; -webkit-mask: ${url} center / contain no-repeat; mask: ${url} center / contain no-repeat;`;
  }
  return '';
}

const symbolOf = (shape: ParticleShape | undefined): CompiledLayer['symbol'] =>
  shape && 'icon' in shape ? { icon: shape.icon } : shape && 'emoji' in shape ? { text: shape.emoji } : undefined;

/** Even spread with phases that do not line up; sizes, spin signs and colours per particle. */
function particleSlots(look: Pick<ParticlesSpec, 'count' | 'size' | 'colors'>, spread = 100): ParticleSlot[] {
  const n = look.count;
  return Array.from({ length: n }, (_, i) => {
    const jitter = (frac(i * GOLDEN) - 0.5) * (60 / n);
    const x0 = Math.min(96, Math.max(4, ((i + 0.5) / n) * 100 + jitter));
    const x = 50 + (x0 - 50) * (spread / 100);
    const size = look.size[0] + (look.size[1] - look.size[0]) * frac(i * 0.381966 + 0.25);
    const color = look.colors.length ? look.colors[i % look.colors.length] : '';
    const style = [
      `--mcc-sz: ${r4(size)}px`,
      `--mcc-sp: ${i % 2 ? -1 : 1}`,
      `--mcc-dx: ${r4((frac(i * 0.7548) * 2 - 1) * 16)}`,
      color && `--mcc-pc: ${color}`,
    ].filter(Boolean).join('; ');
    return { x: r4(x), phase: r4(frac(i * GOLDEN)), k: n > 1 ? r4(i / n) : 0, style };
  });
}

const BASE_I = (name: string, id: string): string =>
  `.mc-anim-fx[data-fx="${name}"] { opacity: var(${docVar(id, 's')}, 1); }\n` +
  `.mc-anim-fx[data-fx="${name}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); ` +
  `color: var(--mcc-pc, var(${docVar(id, 'c')}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; ` +
  `font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;

function particlesCss(name: string, id: string, p: ParticlesSpec, svgMarkup: (svg: string) => string): string {
  const o0 = p.fade ? 0 : 1;
  const spin = `calc(var(--mcc-sp, 1) * ${r4(p.spin)}deg)`;
  const g = p.gravity;
  const R = `${r4(p.spread / 2)}cqmin`;
  const accel = g > 0 ? ' animation-timing-function: cubic-bezier(0.5, 0, 1, 1);' : g < 0 ? ' animation-timing-function: cubic-bezier(0, 0, 0.5, 1);' : '';
  let pos: string;
  let frames: string[];
  switch (p.direction) {
    case 'fall':
    case 'rise': {
      const sign = p.direction === 'fall' ? '' : '-';
      pos = p.direction === 'fall' ? 'top: calc(var(--mcc-sz) * -1);' : 'top: 100%;';
      frames = [
        `  0% { translate: 0 0; rotate: 0deg; opacity: ${o0};${accel} }`,
        '  10%, 90% { opacity: 1; }',
        `  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${sign}100cqh ${sign ? '-' : '+'} var(--mcc-sz) * 2); rotate: ${spin}; opacity: ${o0}; }`,
      ];
      break;
    }
    case 'drift':
      pos = 'left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);';
      frames = [
        `  0% { translate: 0 0; rotate: 0deg; opacity: ${o0}; }`,
        '  10%, 90% { opacity: 1; }',
        `  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${r4(g * 15)}cqh); }`,
        `  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${r4(g * 30)}cqh; rotate: ${spin}; opacity: ${o0}; }`,
      ];
      break;
    case 'burst':
      pos = 'left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);';
      frames = [
        `  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }`,
        `  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${R} * -1)) rotate(${spin}); translate: 0 ${r4(g * 30)}cqh; opacity: ${o0}; }`,
      ];
      break;
    case 'orbit':
      pos = 'left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);';
      frames = [
        `  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${R} * -1)) rotate(0deg); opacity: 1; }`,
        p.fade ? '  50% { opacity: 0.35; }' : '',
        `  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${R} * -1)) rotate(${spin}); opacity: 1; }`,
      ].filter(Boolean);
      break;
    case 'spiral':
      pos = 'left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));';
      frames = [
        `  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${o0}; }`,
        '  20%, 80% { opacity: 1; }',
        `  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${R} * -1)) rotate(${spin}); opacity: ${o0}; }`,
      ];
      break;
  }
  return `${BASE_I(name, id)} ${pos} ${shapeCss(p.shape, svgMarkup)} }\n${keyframesRule(name, frames)}`;
}

function pathParticlesCss(name: string, id: string, path: PathSpec, look: NonNullable<PathSpec['particles']>, svgMarkup: (svg: string) => string): string {
  const fixed = cssWriter(id);
  const rotate = path.follow_rotation ? 'auto' : '0deg';
  const sampled = (n: string) =>
    keyframesRule(n, pathDecls(path, fixed, path.units === 'px' ? ['px', 'px'] : ['cqw', 'cqh']).map(([at, d]) => block(`${at}%`, [...d, ['opacity', '1']])));
  const head =
    `${BASE_I(name, id)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); ` +
    `animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${shapeCss(look.shape, svgMarkup)} }`;
  if (path.units !== 'px') return `${head}\n${sampled(name)}`;
  const supports = 'offset-path: path("M0 0 L1 1")';
  return [
    head,
    `@supports (${supports}) {`,
    `  .mc-anim-fx[data-fx="${name}"] > i { offset-path: path("${path.d}"); offset-rotate: ${rotate}; offset-anchor: center; margin: 0; }`,
    `  @keyframes ${name} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,
    '}',
    `@supports not (${supports}) {`,
    sampled(name),
    '}',
  ].join('\n');
}

// ── sequences ──

function compileSchedule(doc: AnimationDoc, lookup: CompileOptions['lookup']): Schedule {
  const steps: ScheduleStep[] = [];
  const skipped: number[] = [];
  let cursor = 0;
  const icon = doc.target === 'icon';
  (doc.steps ?? []).forEach((s, i) => {
    let frames: Keyframe[] | undefined;
    let duration = s.duration;
    let easing: string | undefined;
    let origin: string | undefined;
    if (isCustomRef(s.animation)) {
      const ref = lookup?.(customRefId(s.animation));
      if (ref && (ref.kind === 'keyframes' || (ref.kind === 'path' && ref.path?.subject !== 'particles'))) {
        frames = docFrames(ref);
        duration ??= ref.duration;
        easing = easingCss(ref.easing);
        origin = ref.origin;
      }
    } else {
      const p = getAnimationPreset(s.animation);
      frames = p && !p.channels.includes('fx') ? presetFrames(p.id, { icon }) : undefined;
      if (p) {
        duration ??= parseFloat(p.defaults.duration);
        easing = easingCss(p.defaults.easing);
        origin = p.origin;
      }
    }
    if (!frames?.length || !duration) {
      skipped.push(i);
      return;
    }
    const start = cursor + s.delay;
    steps.push({ start: r4(start), duration, iterations: s.repeat, easing: easing ?? 'ease', frames, ...(origin && origin !== 'center' ? { origin } : {}) });
    cursor = start + duration * s.repeat;
  });
  return {
    steps,
    total: r4(cursor),
    loop: doc.loop !== false,
    target: doc.target,
    ...(doc.stagger?.children ? { stagger: doc.stagger.delay } : {}),
    skipped,
  };
}

// ── documents ──

const cache = new WeakMap<AnimationDoc, CompiledAnimation>();

/**
 * Compile a (validated) document. Results of the CSS kinds are cached per document object;
 * sequences are compiled on every call (their steps may reference other documents).
 */
export function compileAnimationDoc(doc: AnimationDoc, opts: CompileOptions = {}): CompiledAnimation {
  const sim = !opts.reducedMotion && docNeedsParticles(doc);
  let base = (sim && compileSim(doc)) || compileBase(doc, opts);
  if (sim && !particlesCompiler) base = { ...base, needsParticles: true };
  // v2 data depend on the lookup (clip recursion guard), so they are added per call, never cached
  return v2Compiler && docNeedsRuntime(doc) ? { ...base, v2: v2Compiler(doc, opts) } : base;
}

let particlesCompiler: ParticlesCompiler | undefined;
let checkSim: ParticlesModule['validateSim'] | undefined;
let simCache = new WeakMap<AnimationDoc, CompiledAnimation>();

/**
 * Turn on particles v2 (particles-v2 ParticlesCompiler; the card's particles loader and the studio
 * call this). `check` re-checks `sim` lenient (documents validated before the chunk arrived keep it
 * as stored); without it nothing compiles. Until then a v2 document compiles its v1 fallback and flags `needsParticles`.
 */
export function useParticlesCompiler(fn: ParticlesCompiler | undefined, check?: ParticlesModule['validateSim']): void {
  particlesCompiler = fn;
  checkSim = check;
  simCache = new WeakMap();
}

/** A v2 particles document through the chunk's compiler; undefined (the v1 fallback plays) when its `sim` is unusable. */
function compileSim(doc: AnimationDoc): CompiledAnimation | undefined {
  let out = simCache.get(doc);
  const p = doc.particles!;
  const sim = particlesCompiler && !out && checkSim?.(p.sim, 'lenient').sim;
  if (sim) {
    const spec: ParticlesSpecV2 = { ...p, sim };
    const period = doc.duration / p.speed;
    const v = particlesCompiler!(doc.id, spec, period, { aspect: 2 });
    simCache.set(doc, (out = { kind: 'particles', name: v.name, css: v.css, layer: { front: v.front, particles: v.slots, speed: p.speed }, sim: { docId: doc.id, spec, period } }));
  }
  return out;
}

/** Compiles a document's v2 data (compile-v2.ts compileV2, registered when that file loads). */
export type V2Compiler = (doc: AnimationDoc, opts: CompileOptions) => CompiledV2;
let v2Compiler: V2Compiler | undefined;

/**
 * Turn on `CompiledAnimation.v2` (compile-v2.ts calls this when it loads: the studio bundle and the
 * card's lazy runtime chunk). Until then, documents compile to their base animation only.
 */
export function useV2Compiler(fn: V2Compiler | undefined): void {
  v2Compiler = fn;
}

function compileBase(doc: AnimationDoc, opts: CompileOptions): CompiledAnimation {
  if (opts.reducedMotion) return { kind: doc.kind, name: '', css: '', reduced: true, ...(doc.kind === 'sequence' ? { schedule: { steps: [], total: 0, loop: false, target: doc.target, skipped: [] } } : {}) };
  if (doc.kind === 'sequence') return { kind: 'sequence', name: animationName(doc), css: '', schedule: compileSchedule(doc, opts.lookup) };
  const hit = cache.get(doc);
  if (hit) return hit;
  const name = animationName(doc);
  // own SVG shapes always go through the sanitiser (a cached result must never hold raw markup)
  const svg = (s: string): string => sanitizeSvg(s).markup;
  let out: CompiledAnimation;
  switch (doc.kind) {
    case 'keyframes': {
      const { css, lanes } = keyframeListCss(name, doc.keyframes ?? [], cssWriter(doc.id));
      out = { kind: 'keyframes', name, css, motion: { target: doc.target, origin: doc.origin }, ...(lanes.length ? { lanes } : {}) };
      break;
    }
    case 'particles': {
      const p = doc.particles!;
      if (p.preset) {
        out = { kind: 'particles', name: '', css: '', preset: { id: p.preset, ...(p.intensity !== undefined ? { intensity: p.intensity } : {}) } };
        break;
      }
      out = {
        kind: 'particles',
        name,
        css: particlesCss(name, doc.id, p, svg),
        layer: { front: p.layer === 'front', particles: particleSlots(p, p.spread), speed: p.speed, ...(symbolOf(p.shape) ? { symbol: symbolOf(p.shape) } : {}) },
      };
      break;
    }
    case 'path': {
      const path = doc.path!;
      if (path.subject === 'particles') {
        const look = path.particles ?? { count: 3, size: [8, 8] as [number, number], colors: [] };
        out = {
          kind: 'path',
          name,
          css: pathParticlesCss(name, doc.id, path, look, svg),
          layer: { front: false, particles: particleSlots(look), speed: 1, ...(symbolOf(look.shape) ? { symbol: symbolOf(look.shape) } : {}) },
        };
        break;
      }
      const blocks = pathDecls(path, cssWriter(doc.id), path.units === 'px' ? ['px', 'px'] : ['%', '%']).map(([at, d]) => block(`${at}%`, d));
      out = { kind: 'path', name, css: keyframesRule(name, blocks), motion: { target: path.subject === 'icon' ? 'icon' : 'element', origin: doc.origin } };
      break;
    }
  }
  cache.set(doc, out);
  return out;
}
