import type { AnimationConfig, AnimationDirection, DesignConfig, HassEntity } from '../types';
import { entityStateColor, isEntityActive } from './entity-color';
import { resolveEntityColors } from './css-utils';
import type { ResolvedRing } from './ring';
import { dayNightScene, weatherScene, type SceneId } from './seasonal';
import {
  ANIMATION_PRESETS,
  AnimationChannel,
  DEFAULT_STRENGTH,
  hasStrength,
  AnimationPreset,
  EASINGS,
  MAX_PARTICLES,
  getAnimationPreset,
} from './animation-presets';
import { animationName, compileAnimationDoc, docVar } from '../anim-studio/compile';
import type { CompiledV2 } from '../anim-studio/compile-v2';
import type { RuntimeHints } from '../anim-runtime/types';
import type { BuiltinShape, ParticlesApplyCtx } from '../contracts/particles-v2';
import { runtimeIfLoaded } from './anim-runtime-loader';
import { customRefId, docNeedsRuntime, isCustomRef, type AnimationDoc } from '../anim-studio/model';
import { useAnimationCss } from '../card/custom-anim-sheet';
import { registerSequence } from '../card/sequence-player';

export { ANIMATION_PRESETS, getAnimationPreset };
export type { AnimationPreset };

/** Module types that render an icon hook (`.mc-anim-icon`), so Target = Icon makes sense. */
export const ANIMATION_ICON_MODULES = ['icon', 'button', 'light', 'weather'];

/** Single-animation keys of v0.0.14, read by readAnimations and removed when the list is edited. */
export const LEGACY_ANIMATION_KEYS = [
  'animation_preset',
  'animation_target',
  'animation_speed',
  'animation_trigger',
  'animation_state',
  'animation_color',
] as const;

const LEGACY_SPEEDS: Record<string, number> = { slow: 1.6, normal: 1, fast: 0.6 };
const DIRECTIONS: AnimationDirection[] = ['normal', 'reverse', 'alternate', 'alternate-reverse'];

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);

// ── values ──

/** A CSS time ("2s", "600ms", a bare number = seconds), or undefined when it is not one. */
export function cssTime(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return `${+v.toFixed(3)}s`;
  const s = str(v);
  if (!s) return undefined;
  if (/^\d*\.?\d+$/.test(s)) return `${+(+s).toFixed(3)}s`;
  return /^\d*\.?\d+m?s$/.test(s) ? s : undefined;
}

/** Seconds of a CSS time (for scaling legacy speeds). */
const seconds = (t: string): number => (t.endsWith('ms') ? parseFloat(t) / 1000 : parseFloat(t));

/** An easing id from EASINGS or a raw cubic-bezier() / steps() function. */
export function cssEasing(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  const named = EASINGS.find((e) => e.id === s);
  if (named) return named.css;
  if (/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(s)) return s;
  if (/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(s)) return s;
  return undefined;
}

/**
 * CSS functions a colour may use: colour functions, var(), light-dark() and the math functions (calc,
 * min, max, clamp). Never url() / image functions, also not nested inside these.
 */
const COLOR_FUNCTIONS = new Set([
  'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'var', 'light-dark',
  'calc', 'min', 'max', 'clamp',
]);

/**
 * A colour that is safe inside an inline style: hex, named colours, currentColor / transparent and
 * the colour functions (rgb, hsl, color-mix, var(--x, fallback)...). No declaration / rule breakouts
 * and no url() or image functions (a colour must never fetch anything).
 */
export function safeColor(v: unknown): string | undefined {
  const s = str(v);
  if (!s || !/^[#\w\s(),.%+*/-]+$/.test(s) || s.includes('/*') || s.includes('*/')) return undefined;
  let depth = 0;
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')' && --depth < 0) return undefined;
  }
  if (depth !== 0) return undefined;
  // every "(" must open an allowed function
  const opens = s.match(/\(/g)?.length ?? 0;
  const fns = [...s.matchAll(/([a-z-]+)\s*\(/gi)];
  if (fns.length !== opens || fns.some((m) => !COLOR_FUNCTIONS.has(m[1].toLowerCase()))) return undefined;
  return s;
}

function iterations(v: unknown): string | undefined {
  if (v === 'infinite') return 'infinite';
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? String(+n.toFixed(2)) : undefined;
}

function intensity(p: AnimationPreset, v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isFinite(n)) return p.defaults.intensity;
  return Math.min(p.intensity.max, Math.max(p.intensity.min, n));
}

// ── entries ──

/** Strength 0-100 (%), or undefined when not a number. */
function strength(v: unknown): number | undefined {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : undefined;
}

type PresetFields = Pick<AnimationConfig, 'duration' | 'delay' | 'easing' | 'iterations' | 'direction' | 'intensity' | 'strength'>;

/** The preset's values for the editable fields (Strength only for presets that paint a colour). */
export function presetFields(p: AnimationPreset): PresetFields {
  // a seasonal scene has its own timing: only its density
  if (p.seasonal) return { intensity: p.defaults.intensity };
  const { duration, delay, easing, iterations, direction, intensity } = p.defaults;
  return { duration, delay, easing, iterations, direction, intensity, ...(hasStrength(p) ? { strength: DEFAULT_STRENGTH } : {}) };
}

/** A new entry with the preset's values written out, so the editor shows and edits them. */
export function newAnimation(presetId: string, id: string): AnimationConfig {
  const p = getAnimationPreset(presetId) ?? ANIMATION_PRESETS[0];
  return { id, preset: p.id, target: 'module', trigger: p.trigger ?? 'always', ...presetFields(p) };
}

/**
 * Switch preset: every timing / intensity value becomes the new preset's; target, play, state and
 * colour stay (a preset made for taps, Tap ripple / Press, switches Play to On tap).
 */
export function applyPreset(entry: AnimationConfig, presetId: string): AnimationConfig {
  if (isCustomRef(presetId)) return customPreset(entry, presetId);
  const p = getAnimationPreset(presetId);
  if (!p) return { ...entry, preset: presetId };
  const { strength: _drop, ...rest } = entry;
  void _drop;
  // a seasonal scene has its own timing: the old preset's timing goes
  if (p.seasonal) for (const k of ['duration', 'delay', 'easing', 'iterations', 'direction'] as const) delete rest[k];
  else delete rest.decorations;
  return { ...rest, preset: p.id, ...presetFields(p), ...(p.trigger ? { trigger: p.trigger } : {}) };
}

/** Fields a `custom:` entry leaves to its document (its timing, target and amplitude). */
const CUSTOM_DOC_FIELDS = ['duration', 'delay', 'easing', 'iterations', 'direction', 'intensity', 'strength', 'decorations', 'target'] as const;

/**
 * Switch to (or reset) an animation from the library: the document's own values apply, so the entry
 * keeps only play, state and colour. Target is left unset: the document says element or icon.
 */
function customPreset(entry: AnimationConfig, presetId: string): AnimationConfig {
  const next = { ...entry, preset: presetId } as Record<string, unknown>;
  for (const k of CUSTOM_DOC_FIELDS) delete next[k];
  // a tap-only preset switched Play to On tap; a custom animation starts from Always again
  if (next.trigger === 'tap' && getAnimationPreset(entry.preset)?.trigger === 'tap') next.trigger = 'always';
  return next as unknown as AnimationConfig;
}

export const resetToPreset = (entry: AnimationConfig): AnimationConfig => applyPreset(entry, entry.preset);

/**
 * The design's animations. `animations` wins; otherwise the legacy single keys become one entry
 * (id "legacy") with the preset's values, its duration scaled by the old speed.
 */
export function readAnimations(design: DesignConfig | undefined): AnimationConfig[] {
  if (!design) return [];
  if (Array.isArray(design.animations)) {
    return design.animations
      .filter((x): x is AnimationConfig => !!x && typeof x === 'object' && !!str((x as AnimationConfig).preset))
      .map((x, i) => (str(x.id) ? x : { ...x, id: `anim-${i}` }));
  }
  const presetId = str(design.animation_preset);
  if (!presetId) return [];
  const p = getAnimationPreset(presetId);
  const entry: AnimationConfig = { id: 'legacy', preset: presetId };
  if (design.animation_target) entry.target = design.animation_target;
  if (design.animation_trigger) entry.trigger = design.animation_trigger;
  if (design.animation_state) entry.state = design.animation_state;
  if (design.animation_color) entry.color = design.animation_color;
  if (!p) return [entry];
  const fields = presetFields(p);
  const speed = LEGACY_SPEEDS[design.animation_speed || 'normal'] ?? 1;
  return [{ ...entry, ...fields, duration: `${+(seconds(fields.duration!) * speed).toFixed(3)}s` }];
}

/** Design updates for an edited list: the list (or nothing) and the legacy keys removed. */
export function animationsUpdate(list: AnimationConfig[]): Record<string, unknown> {
  const out: Record<string, unknown> = { animations: list.length ? list : undefined };
  for (const k of LEGACY_ANIMATION_KEYS) out[k] = undefined;
  return out;
}

/**
 * Whether the entry plays (`always` when no trigger is set). The condition reads `trigger_entity`
 * from `states` when set, else `stateObj` (the module's entity; none for a card / row / column).
 */
export function animationTriggerActive(
  entry: Pick<AnimationConfig, 'trigger' | 'trigger_entity' | 'state'>,
  stateObj?: HassEntity,
  states?: Record<string, HassEntity>,
): boolean {
  const own = str(entry.trigger_entity);
  if (own) stateObj = states?.[own];
  switch (entry.trigger) {
    case 'entity_on':
      return isEntityActive(stateObj);
    case 'state': {
      const want = (entry.state || '').trim();
      return !!want && !!stateObj && stateObj.state === want;
    }
    default:
      return true;
  }
}

// ── composition ──

type Prop = 'rotate' | 'translate' | 'scale' | 'opacity' | 'filter' | 'box-shadow';

const PROP_LABEL: Record<Prop, string> = {
  rotate: 'rotation',
  translate: 'position',
  scale: 'scale',
  opacity: 'opacity',
  filter: 'filter',
  'box-shadow': 'glow',
};

/** CSS properties an entry animates on its element: a glow is box-shadow on a wrapper, filter on an icon. */
function props(channels: AnimationChannel[], onIcon: boolean): Prop[] {
  return channels.flatMap((c): Prop[] => (c === 'fx' ? [] : c === 'glow' ? [onIcon ? 'filter' : 'box-shadow'] : [c]));
}

const onIcon = (e: AnimationConfig, allowIcon: boolean) => allowIcon && e.target === 'icon';

/**
 * Per entry, a note when it overrides an earlier entry on the same element and property (the
 * later animation in a CSS animation list wins), e.g. "Overrides Spin: both animate the rotation".
 */
export function animationConflicts(list: AnimationConfig[], opts: { allowIcon?: boolean } = {}): Array<string | undefined> {
  const allowIcon = opts.allowIcon !== false;
  return list.map((e, i) => {
    const p = getAnimationPreset(e.preset);
    if (!p) return undefined;
    const mine = props(p.channels, onIcon(e, allowIcon));
    for (let j = i - 1; j >= 0; j--) {
      const q = getAnimationPreset(list[j].preset);
      if (!q || onIcon(list[j], allowIcon) !== onIcon(e, allowIcon)) continue;
      const shared = props(q.channels, onIcon(list[j], allowIcon)).find((x) => mine.includes(x));
      if (!shared) continue;
      const glow = p.channels.includes('glow') || q.channels.includes('glow');
      const what = shared === 'filter' && glow ? 'glow' : PROP_LABEL[shared];
      return `Overrides ${q.name}: both animate the ${what}`;
    }
    return undefined;
  });
}

// ── resolve for the card ──

export interface Particle {
  /** Horizontal position (%). */
  x: number;
  /** Phase of the cycle (0-1), used as a negative delay so particles do not move in step. */
  phase: number;
  /** Index / count (0-1), for presets that lay particles out by order (bars, orbits). */
  k: number;
  /** Custom particles: per-particle custom properties (size, colour...). */
  style?: string;
  /** particles v2: this particle's built-in shape (`data-s`). */
  shape?: BuiltinShape;
  /** particles v2: this particle's icon / text symbol (overrides the layer's). */
  symbol?: { icon: string } | { text: string };
}

export interface FxLayer {
  preset: string;
  front: boolean;
  /** Inline custom properties of the overlay. */
  style: string;
  particles: Particle[];
  /** Plays once per tap (hidden until then). */
  tap?: boolean;
  /** Ring presets: drawn by mc-ring along the outline instead of particles. */
  ring?: ResolvedRing;
  /** Seasonal presets: an mc-seasonal layer (and its border decorations) instead of particles. */
  seasonal?: SeasonalFx;
  /** Custom particles: the content of each particle (an icon or a text symbol). */
  symbol?: { icon: string } | { text: string };
  /** particles v2 compiled by the particles chunk: the card applies the layer after the render. */
  sim?: Pick<ParticlesApplyCtx, 'docId' | 'spec' | 'period' | 'part'>;
}

export interface SeasonalFx {
  scenes: SceneId[];
  /** Density 0..1. */
  intensity: number;
  /** Draw the scene's border decorations (lights, icicles, ...). */
  decorations: boolean;
}

/**
 * The scene a seasonal preset draws now: its own scene, or for `weather` the state of the entry's
 * weather entity (Entity for play condition) or the module's, for `daynight` sun.sun.
 */
function seasonalScene(
  p: AnimationPreset,
  e: AnimationConfig,
  stateObj: HassEntity | undefined,
  states: Record<string, HassEntity> | undefined,
): SceneId | undefined {
  if (p.seasonal === 'weather') {
    const own = str(e.trigger_entity);
    const src = own?.startsWith('weather.') ? states?.[own] : stateObj;
    return src?.entity_id?.startsWith('weather.') ? weatherScene(src.state) : undefined;
  }
  if (p.seasonal === 'daynight') {
    const sun = states?.['sun.sun'];
    const el = sun?.attributes?.elevation;
    return dayNightScene(sun?.state, typeof el === 'number' ? el : typeof el === 'string' && el.trim() !== '' ? Number(el) : undefined);
  }
  return p.seasonal;
}

export interface ResolvedAnimations {
  /** `data-mc-anim` tokens: "module", "icon" or both; undefined with particle layers only. */
  targets?: string;
  /** Inline custom properties for the wrapper (animation lists, intensities, colours). */
  style: string;
  fx: FxLayer[];
  /** The element has "On tap" animations (`--mc-anim-t`): `data-mc-tap`. */
  tap?: boolean;
  /** Custom sequences of the element (`data-mc-seq`): registered run keys (src/card/sequence-player.ts). */
  seq?: string;
  /** A resolved document needs the lazy v2 runtime (src/utils/anim-runtime-loader.ts). */
  needsRuntime?: boolean;
  /** A particles v2 document plays here: the card loads the particles chunk / applies its layers (src/utils/particles-loader.ts). */
  needsParticles?: boolean;
  /**
   * The documents with compiled v2 data, in entry order (the card hands each to runtime.apply);
   * empty until the runtime chunk has loaded (it brings the v2 compiler).
   */
  v2?: ResolvedV2[];
  /** `data-mc-run` of the wrapper: the run keys of `v2`, space separated. */
  run?: string;
}

/** One `custom:` entry whose document has v2 data (rig, tracks, clips, bindings). */
export interface ResolvedV2 {
  /** Run key: the document's animation name (`mcc-<id>-<hash>`). */
  run: string;
  docId: string;
  v2: CompiledV2;
  /** `<duration> <easing> <delay> <iterations> <direction>` of the entry. */
  timing: string;
  /** The entry plays on the module's icon. */
  icon: boolean;
  /** The driving entity: the entry's `entity:` override, else the module's (undefined: none known). */
  entityId?: string;
  stateObj?: HassEntity;
  /** Resolve-time runtime decisions (clip, rig); {} until the runtime chunk has loaded. */
  hints: RuntimeHints;
}

/** Custom animation documents by id (the library, then the card's inline `custom_animations`). */
export type CustomAnimationLookup = (id: string) => AnimationDoc | undefined;


const GOLDEN = 0.618034;

/** Spread `n` particles across the width, with phases that do not line up. */
export function particleLayout(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => {
    const jitter = (((i * GOLDEN) % 1) - 0.5) * (60 / n);
    const x = Math.min(96, Math.max(4, ((i + 0.5) / n) * 100 + jitter));
    return { x: +x.toFixed(1), phase: +((i * GOLDEN) % 1).toFixed(3), k: n > 1 ? +(i / n).toFixed(3) : 0 };
  });
}

/**
 * What the card renders for a module / row / column design, or undefined when nothing plays.
 * Each playing entry adds `<keyframes> <duration> <easing> <delay> <iterations> <direction>` to its
 * element's list (`--mc-anim-m` wrapper, `--mc-anim-i` icon, `--mc-anim-mi` both, for a module
 * without an icon) and sets its preset's intensity / colour vars; particle presets get a layer each.
 * Colour: entry colour > design colour > entity colour > (stylesheet) theme accent.
 */
export function resolveAnimations(
  design: DesignConfig | undefined,
  stateObj?: HassEntity,
  opts: { allowIcon?: boolean; states?: Record<string, HassEntity>; custom?: CustomAnimationLookup } = {},
): ResolvedAnimations | undefined {
  design = resolveEntityColors(design);
  const allowIcon = opts.allowIcon !== false;
  const lists = { m: [] as string[], i: [] as string[], mi: [] as string[], t: [] as string[] };
  const vars: string[] = [];
  const origins: { m?: string; i?: string } = {};
  const fx: FxLayer[] = [];
  const seq: string[] = [];
  const v2: ResolvedV2[] = [];
  const runtime = { need: false, p: false };

  for (let e of readAnimations(design)) {
    if (isCustomRef(e.preset)) {
      const doc = opts.custom?.(customRefId(e.preset));
      if (!doc || !animationTriggerActive(e, stateObj, opts.states)) continue;
      const based = customEntry(doc, e, { lists, vars, origins, fx, seq, v2, allowIcon, runtime, custom: opts.custom, stateObj, states: opts.states });
      if (!based) continue;
      e = based;
    }
    const p = getAnimationPreset(e.preset);
    if (!p || !animationTriggerActive(e, stateObj, opts.states)) continue;
    const d = p.defaults;
    const dur = cssTime(e.duration) ?? d.duration;
    const delay = cssTime(e.delay) ?? d.delay;
    const tap = e.trigger === 'tap';
    // a tap plays the animation once (or its finite repeat), never forever
    let iter = iterations(e.iterations) ?? iterations(d.iterations)!;
    if (tap && iter === 'infinite') iter = '1';
    const tail = `${cssEasing(e.easing) ?? cssEasing(d.easing)} ${delay} ${iter} ${DIRECTIONS.includes(e.direction!) ? e.direction : d.direction}`;
    const timing = `${dur} ${tail}`;
    const own = [`--mca-${p.id}-i: ${intensity(p, e.intensity)}`];
    const color = safeColor(e.color);
    if (color) own.push(`--mca-${p.id}-c: ${color}`);
    // Strength scales the painted colour (keyframes) or the particle layer's opacity; 100% is the default
    const s = hasStrength(p) ? strength(e.strength) : undefined;
    if (s !== undefined && s !== DEFAULT_STRENGTH) own.push(`--mca-${p.id}-s: ${+(s / 100).toFixed(3)}`);

    if (p.seasonal) {
      const scene = seasonalScene(p, e, stateObj, opts.states);
      if (!scene) continue;
      fx.push({
        preset: p.id,
        front: false,
        style: s !== undefined && s !== DEFAULT_STRENGTH ? `opacity: ${+(s / 100).toFixed(3)}` : '',
        particles: [],
        seasonal: { scenes: [scene], intensity: intensity(p, e.intensity) / 100, decorations: e.decorations !== false },
      });
      continue;
    }

    if (p.ring) {
      fx.push({ preset: p.id, front: true, style: own.join('; '), particles: [], ...(tap ? { tap } : {}), ring: ringLayer(p, e, dur, tail, s) });
      continue;
    }

    if (p.particles !== undefined) {
      const n = p.particles === 'count' ? Math.min(MAX_PARTICLES, Math.round(intensity(p, e.intensity))) : p.particles;
      fx.push({
        preset: p.id,
        front: !!p.front,
        style: [`--mc-fx-anim: mc-anim-${p.id} ${timing}`, `--mc-fx-dur: ${dur}`, `--mc-fx-delay: ${delay}`, ...own].join('; '),
        particles: particleLayout(Math.max(1, n)),
        ...(tap ? { tap } : {}),
      });
      continue;
    }

    vars.push(...own);
    if (tap) {
      lists.t.push(`mc-anim-${p.id} ${timing}`);
      if (p.origin && !origins.m) origins.m = p.origin;
      continue;
    }
    const icon = onIcon(e, allowIcon);
    lists.mi.push(`mc-anim-${p.id} ${timing}`);
    if (icon) {
      lists.i.push(`mc-anim-${p.id}${p.iconKeyframes ? '-icon' : ''} ${timing}`);
      if (p.origin && !origins.i) origins.i = p.origin;
    } else {
      lists.m.push(`mc-anim-${p.id} ${timing}`);
      if (p.origin && !origins.m) origins.m = p.origin;
    }
  }

  if (!lists.mi.length && !lists.t.length && !fx.length && !seq.length && !runtime.need) return undefined;

  const style: string[] = [];
  if (lists.m.length) style.push(`--mc-anim-m: ${lists.m.join(', ')}`);
  if (lists.t.length) style.push(`--mc-anim-t: ${lists.t.join(', ')}`);
  if (lists.i.length) style.push(`--mc-anim-i: ${lists.i.join(', ')}`, `--mc-anim-mi: ${lists.mi.join(', ')}`);
  if (origins.m) style.push(`--mc-anim-om: ${origins.m}`);
  if (origins.i) style.push(`--mc-anim-oi: ${origins.i}`);
  style.push(...dedupe(vars));
  const color = safeColor(design?.color) ?? safeColor(entityStateColor(stateObj));
  if (color) style.push(`--mc-anim-color: ${color}`);

  const targets = [lists.m.length ? 'module' : '', lists.i.length ? 'icon' : ''].filter(Boolean).join(' ');
  return {
    ...(targets ? { targets } : {}),
    style: style.join('; '),
    fx,
    ...(lists.t.length ? { tap: true } : {}),
    ...(seq.length ? { seq: seq.join(' ') } : {}),
    ...(runtime.need ? { needsRuntime: true } : {}),
    ...(runtime.p ? { needsParticles: true } : {}),
    ...(v2.length ? { v2, run: [...new Set(v2.map((x) => x.run))].join(' ') } : {}),
  };
}

interface CustomCtx {
  lists: { m: string[]; i: string[]; mi: string[]; t: string[] };
  vars: string[];
  origins: { m?: string; i?: string };
  fx: FxLayer[];
  seq: string[];
  v2: ResolvedV2[];
  runtime: { need: boolean; p: boolean };
  allowIcon: boolean;
  custom?: CustomAnimationLookup;
  stateObj?: HassEntity;
  states?: Record<string, HassEntity>;
}

/**
 * A `custom:<id>` entry: its compiled rules go into the shared stylesheet and it joins the element's
 * lists like a preset (keyframes, path), adds a particle layer (particles, path with particles) or
 * a sequence run. Entry values override the document's: duration, delay, easing, iterations,
 * direction, play, target, colour, Strength; intensity is the amplitude in % (100 = as drawn).
 * Returns the entry to resolve as a preset for a document based on one (particles.preset).
 */
function customEntry(doc: AnimationDoc, e: AnimationConfig, ctx: CustomCtx): AnimationConfig | undefined {
  const c = compileAnimationDoc(doc, { lookup: ctx.custom });
  const docIter = iterations(doc.iterations) ?? 'infinite';
  const tap = e.trigger === 'tap';
  const dur = cssTime(e.duration) ?? `${doc.duration}s`;
  const delay = cssTime(e.delay) ?? '0s';
  let iter = iterations(e.iterations) ?? docIter;
  if (tap && iter === 'infinite') iter = '1';
  const dir = DIRECTIONS.includes(e.direction!) ? e.direction : (doc.direction ?? 'normal');
  const tail = `${cssEasing(e.easing) ?? cssEasing(doc.easing) ?? 'ease'} ${delay} ${iter} ${dir}`;
  const icon = ctx.allowIcon && (e.target === 'icon' || (!e.target && c.motion?.target === 'icon'));
  // v2 data (rig, tracks, clips, bindings), also for documents based on a preset: the runtime chunk
  // applies them after the render; the base animation plays meanwhile (and alone when the chunk
  // cannot load). Hints (clip, rig) are decided here, at resolve time, once the runtime is loaded.
  let clip: string | undefined;
  if (docNeedsRuntime(doc)) {
    ctx.runtime.need = true;
    if (c.v2) {
      const own = typeof e.entity === 'string' && e.entity ? e.entity : undefined;
      const stateObj = own ? ctx.states?.[own] : ctx.stateObj;
      const entityId = own ?? ctx.stateObj?.entity_id;
      // a document based on a preset compiles without a name: its run key is still its own
      const run = c.name || animationName(doc);
      const hints = runtimeIfLoaded()?.resolveHints(c.v2, { stateObj, states: ctx.states, run, timing: `${dur} ${tail}`, icon: ctx.allowIcon && e.target !== 'module', active: isEntityActive(stateObj) }) ?? {};
      clip = hints.clip?.animation;
      // a clip replaces the document's own timeline: its card-part and rig tracks stop too
      ctx.v2.push({ run, docId: doc.id, v2: clip ? { ...c.v2, tracks: [] } : c.v2, timing: `${dur} ${tail}`, icon, ...(entityId ? { entityId } : {}), ...(stateObj ? { stateObj } : {}), hints });
    }
  }
  // the state's clip plays instead of the document's own timeline (none: nothing)
  if (clip) {
    if (clip === 'none') return undefined;
    // the entry minus its timing (the clip plays with its own): entity, play condition, colour, strength stay
    const next: AnimationConfig = { ...e, preset: clip, target: icon ? 'icon' : e.target };
    for (const k of ['duration', 'delay', 'easing', 'iterations', 'direction'] as const) delete next[k];
    if (!isCustomRef(clip)) return next;
    const d = ctx.custom?.(customRefId(clip));
    return d && d !== doc ? customEntry(d, next, ctx) : undefined;
  }
  if (c.preset) {
    return {
      ...e,
      preset: c.preset.id,
      intensity: e.intensity ?? c.preset.intensity,
      duration: e.duration ?? `${doc.duration}s`,
      easing: e.easing ?? doc.easing,
      iterations: e.iterations ?? (docIter === 'infinite' ? 'infinite' : Number(docIter)),
      direction: e.direction ?? doc.direction,
    };
  }
  if (c.schedule) {
    // a sequence plays always (On tap is not supported); the entry's duration scales it
    const s = c.schedule;
    const want = cssTime(e.duration);
    const scale = want && s.total > 0 ? seconds(want) / s.total : 1;
    const cycles = typeof e.iterations === 'number' && e.iterations > 0 ? Math.round(e.iterations) : undefined;
    if (s.steps.length) ctx.seq.push(registerSequence({ ...s, delay: seconds(delay), scale, ...(cycles ? { cycles } : {}) }));
    return undefined;
  }

  const own: string[] = [];
  const amp = typeof e.intensity === 'number' && Number.isFinite(e.intensity) ? e.intensity : undefined;
  if (amp !== undefined && amp !== 100) own.push(`${docVar(doc.id, 'i')}: ${+(amp / 100).toFixed(3)}`);
  const color = safeColor(e.color);
  if (color) own.push(`${docVar(doc.id, 'c')}: ${color}`);
  const st = strength(e.strength);
  if (st !== undefined && st !== DEFAULT_STRENGTH) own.push(`${docVar(doc.id, 's')}: ${+(st / 100).toFixed(3)}`);
  useAnimationCss(doc.id, c.name, c.css);

  if (c.layer) {
    if (c.sim || c.needsParticles) ctx.runtime.p = true;
    const cycle = `${+(seconds(dur) / c.layer.speed).toFixed(3)}s`;
    // a split document (emitters on both sides of the content) pushes its second layer right after the first
    for (const [name, l, sim] of [[c.name, c.layer, c.sim] as const, ...(c.split ? [[c.split.name, c.split.layer, c.split.sim] as const] : [])]) {
      ctx.fx.push({
        preset: name,
        front: l.front,
        style: [`--mc-fx-anim: ${name} ${cycle} ${tail}`, `--mc-fx-dur: ${cycle}`, `--mc-fx-delay: ${delay}`, ...own].join('; '),
        particles: l.particles,
        ...(l.symbol ? { symbol: l.symbol } : {}),
        sim,
        ...(tap ? { tap } : {}),
      });
    }
    return undefined;
  }

  if (!c.motion) return undefined;
  // per-lane easing: the split-off lane rules play alongside, same timing
  const entry = [c.name, ...(c.lanes ?? [])].map((n) => `${n} ${dur} ${tail}`).join(', ');
  const origin = c.motion.origin !== 'center' ? c.motion.origin : undefined;
  ctx.vars.push(...own);
  if (tap) {
    ctx.lists.t.push(entry);
    if (origin && !ctx.origins.m) ctx.origins.m = origin;
    return undefined;
  }
  ctx.lists.mi.push(entry);
  if (icon) {
    ctx.lists.i.push(entry);
    if (origin && !ctx.origins.i) ctx.origins.i = origin;
  } else {
    ctx.lists.m.push(entry);
    if (origin && !ctx.origins.m) ctx.origins.m = origin;
  }
  return undefined;
}

/**
 * A ring preset as an mc-ring: width from the intensity, the entry colour (else the wrapper's
 * animation colour), Strength as its opacity, the entry's timing on the stroke animation.
 */
function ringLayer(p: AnimationPreset, e: AnimationConfig, dur: string, timing: string, s: number | undefined): ResolvedRing {
  return {
    mode: 'animated',
    fill: 1,
    animation: p.ring,
    color: safeColor(e.color) ?? 'var(--mc-anim-c)',
    width: intensity(p, e.intensity),
    linecap: p.ring === 'dashes' ? 'butt' : 'round',
    glow: 0,
    position: 'inside',
    start: 'top',
    direction: 'cw',
    length: 25,
    speed: dur,
    transition: '1s',
    timing,
    ...(s !== undefined && s !== DEFAULT_STRENGTH ? { opacity: +(s / 100).toFixed(3) } : {}),
  };
}

/** Same preset twice on one element shares its vars: the later entry's value wins. */
function dedupe(decls: string[]): string[] {
  const byName = new Map<string, string>();
  for (const d of decls) {
    const name = d.slice(0, d.indexOf(':'));
    byName.delete(name);
    byName.set(name, d);
  }
  return [...byName.values()];
}
