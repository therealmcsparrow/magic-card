import {
  BUILTIN_SHAPES,
  NEW_FLOWS,
  PARTICLES_ENGINE,
  PARTICLES_V2_CAPS,
  type BuiltinShape,
  type ParticleColliders,
  type ParticleFlow,
  type ParticlePhysics,
  type ParticleRanges,
  type ParticlesSim,
  type Range,
  type SubEmitter,
  type SubEmitTrigger,
  type WeightedShape,
} from '../contracts/particles-v2';
import { ANIMATION_CAPS, Checker, ICON_RE, PARTICLE_DIRECTIONS, safeCssValue, type FieldError } from '../anim-studio/model';
import { sanitizeSvg, SVG_MAX_BYTES } from '../icons/svg-sanitize';

/*
 * particles-v2 ParticlesModule.validateSim: checks a raw `particles.sim`.
 * - strict (studio, catalogue): every problem is an error (path `particles.sim.*`); the sim is
 *   returned too, with defaults in place of the bad values.
 * - lenient (card): bad entries are dropped (a shape, a colour, the children) or take their
 *   default; the errors are still listed. A sim the card cannot play at all (not an object, an
 *   unknown engine or flow) comes back undefined, so the v1 fallback plays.
 * Missing fields take the defaults below. Children never have children (one level).
 */

const P = 'particles.sim';
const FLOWS: readonly ParticleFlow[] = [...PARTICLE_DIRECTIONS, ...NEW_FLOWS];
const TRIGGERS: readonly SubEmitTrigger[] = ['death', 'collision', 'time'];
const CONTENT = ['none', 'icon', 'text'] as const;

/** Limits of the numeric fields (units as in the contract). */
export const SIM_LIMITS = {
  speed: [0, 1000],
  spin: [-3600, 3600],
  delay: [0, 6000],
  lifetime: [0.01, 600],
  opacity: [0, 1],
  weight: [0.001, 1000],
  angle: [-360, 360],
  gravity: [0, 1000],
  drag: [0, 20],
  turbulence: [0, 1000],
  scale: [0.1, 1000],
  bounce: [0, 1],
  at: [0, 600],
  size: [0.1, 200],
  cone: [0, 360],
  inherit: [0, 1],
} as const satisfies Record<string, readonly [number, number]>;

export const DEFAULT_RANGES: ParticleRanges = { speed: [20, 40], spin: [0, 0], delay: [0, 2], lifetime: [2, 2], opacity: [1, 1] };
export const DEFAULT_PHYSICS: ParticlePhysics = { gravity: { angle: 0, strength: 0 }, drag: 0, turbulence: { strength: 0, scale: 20 }, bounce: 0.5 };
export const DEFAULT_COLLIDERS: ParticleColliders = { floor: false, ceiling: false, left: false, right: false, content: 'none' };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const bytes = (s: string): number => (typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length);

function range(c: Checker, o: Record<string, unknown>, key: string, path: string, lim: readonly [number, number], def: Range, lenient: boolean): Range {
  const v = o[key];
  if (v === undefined || v === null) return [...def] as Range;
  if (!Array.isArray(v) || v.length !== 2 || !v.every((n) => typeof n === 'number' && Number.isFinite(n))) {
    c.err(path, 'Must be [min, max].');
    return [...def] as Range;
  }
  let [a, b] = v as [number, number];
  if (a > b) {
    if (!lenient) c.err(path, 'Min must not be above max.');
    [a, b] = [b, a];
  }
  if (a < lim[0] || b > lim[1]) {
    c.err(path, `Must be between ${lim[0]} and ${lim[1]}.`);
    if (!lenient) return [...def] as Range;
    a = Math.min(lim[1], Math.max(lim[0], a));
    b = Math.min(lim[1], Math.max(lim[0], b));
  }
  return [a, b];
}

const num = (c: Checker, o: Record<string, unknown>, key: string, path: string, lim: readonly [number, number], def: number, int = false): number =>
  c.num(o, key, path, lim[0], lim[1], def, int) ?? def;

function shape(c: Checker, raw: unknown, path: string): WeightedShape['shape'] | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const keys = (['builtin', 'icon', 'emoji', 'svg'] as const).filter((k) => o[k] !== undefined && o[k] !== '');
  if (keys.length !== 1) return c.err(path, 'Set one of builtin, icon, emoji or svg.');
  const k = keys[0];
  const v = o[k];
  if (typeof v !== 'string') return c.err(`${path}.${k}`, 'Must be text.');
  if (k === 'builtin') return (BUILTIN_SHAPES as string[]).includes(v) ? { builtin: v as BuiltinShape } : c.err(`${path}.builtin`, `Must be one of: ${BUILTIN_SHAPES.join(', ')}.`);
  if (k === 'icon') return ICON_RE.test(v.trim()) ? { icon: v.trim() } : c.err(`${path}.icon`, 'Must be an icon id like mdi:star.');
  if (k === 'emoji') {
    const s = v.trim();
    return s && [...s].length <= 8 && !/[<>&"'\\{};]/.test(s) ? { emoji: s } : c.err(`${path}.emoji`, 'Must be up to 8 characters (an emoji or a symbol).');
  }
  if (bytes(v) > SVG_MAX_BYTES) return c.err(`${path}.svg`, 'The SVG is larger than 32 KB.');
  if (!/<svg[\s>]/i.test(v)) return c.err(`${path}.svg`, 'No <svg> element found.');
  if (typeof DOMParser !== 'undefined') {
    const r = sanitizeSvg(v);
    if (r.error) return c.err(`${path}.svg`, r.error);
  }
  return { svg: v };
}

function shapes(c: Checker, raw: unknown, path: string): WeightedShape[] {
  if (raw === undefined || raw === null) return [];
  const list = c.list(raw, path, PARTICLES_V2_CAPS.shapes);
  const out: WeightedShape[] = [];
  list?.forEach((x, i) => {
    const o = c.obj(x, `${path}[${i}]`);
    if (!o) return;
    const s = shape(c, o.shape, `${path}[${i}].shape`);
    const w = c.num(o, 'weight', `${path}[${i}].weight`, SIM_LIMITS.weight[0], SIM_LIMITS.weight[1], 1);
    if (s && w !== undefined) out.push({ shape: s, weight: w });
  });
  return out;
}

function colors(c: Checker, raw: unknown, path: string): string[] {
  if (raw === undefined || raw === null) return [];
  const out: string[] = [];
  c.list(raw, path, ANIMATION_CAPS.colors)?.forEach((x, i) => {
    const v = safeCssValue(x, 'color');
    if (v) out.push(v);
    else c.err(`${path}[${i}]`, 'Not a valid colour.');
  });
  return out;
}

function physics(c: Checker, raw: unknown, path: string, def: ParticlePhysics, partial: boolean): Partial<ParticlePhysics> {
  if (raw === undefined || raw === null) return partial ? {} : { ...def };
  const o = c.obj(raw, path);
  if (!o) return partial ? {} : { ...def };
  const out: Partial<ParticlePhysics> = {};
  const has = (k: string) => !partial || (o[k] !== undefined && o[k] !== null);
  if (has('gravity')) {
    const g = isObj(o.gravity) ? o.gravity : (c.obj(o.gravity ?? {}, `${path}.gravity`) ?? {});
    out.gravity = {
      angle: num(c, g, 'angle', `${path}.gravity.angle`, SIM_LIMITS.angle, def.gravity.angle),
      strength: num(c, g, 'strength', `${path}.gravity.strength`, SIM_LIMITS.gravity, def.gravity.strength),
    };
  }
  if (has('drag')) out.drag = num(c, o, 'drag', `${path}.drag`, SIM_LIMITS.drag, def.drag);
  if (has('turbulence')) {
    const t = isObj(o.turbulence) ? o.turbulence : (c.obj(o.turbulence ?? {}, `${path}.turbulence`) ?? {});
    out.turbulence = {
      strength: num(c, t, 'strength', `${path}.turbulence.strength`, SIM_LIMITS.turbulence, def.turbulence.strength),
      scale: num(c, t, 'scale', `${path}.turbulence.scale`, SIM_LIMITS.scale, def.turbulence.scale),
    };
  }
  if (has('bounce')) out.bounce = num(c, o, 'bounce', `${path}.bounce`, SIM_LIMITS.bounce, def.bounce);
  return out;
}

function colliders(c: Checker, raw: unknown, path: string): ParticleColliders {
  if (raw === undefined || raw === null) return { ...DEFAULT_COLLIDERS };
  const o = c.obj(raw, path);
  if (!o) return { ...DEFAULT_COLLIDERS };
  return {
    floor: c.bool(o, 'floor', `${path}.floor`, false),
    ceiling: c.bool(o, 'ceiling', `${path}.ceiling`, false),
    left: c.bool(o, 'left', `${path}.left`, false),
    right: c.bool(o, 'right', `${path}.right`, false),
    content: c.oneOf(o, 'content', `${path}.content`, CONTENT, 'none') ?? 'none',
  };
}

function children(c: Checker, raw: unknown, path: string, lenient: boolean): SubEmitter | undefined {
  const o = c.obj(raw, path);
  if (!o) return undefined;
  const before = c.errors.length;
  if (o.children !== undefined && o.children !== null) c.err(`${path}.children`, 'Children cannot have children of their own.');
  const trigger = c.oneOf(o, 'trigger', `${path}.trigger`, TRIGGERS);
  if (!trigger && o.trigger === undefined) c.err(`${path}.trigger`, 'Required.');
  const r = isObj(o.ranges) ? o.ranges : (c.obj(o.ranges ?? {}, `${path}.ranges`) ?? {});
  const out: SubEmitter = {
    trigger: trigger ?? 'death',
    count: num(c, o, 'count', `${path}.count`, [1, PARTICLES_V2_CAPS.childrenPerParent], 3, true),
    shapes: shapes(c, o.shapes, `${path}.shapes`),
    size: range(c, o, 'size', `${path}.size`, SIM_LIMITS.size, [4, 6], lenient),
    colors: colors(c, o.colors, `${path}.colors`),
    ranges: {
      speed: range(c, r, 'speed', `${path}.ranges.speed`, SIM_LIMITS.speed, [20, 40], lenient),
      lifetime: range(c, r, 'lifetime', `${path}.ranges.lifetime`, SIM_LIMITS.lifetime, [0.5, 1], lenient),
      opacity: range(c, r, 'opacity', `${path}.ranges.opacity`, SIM_LIMITS.opacity, [1, 1], lenient),
      spin: range(c, r, 'spin', `${path}.ranges.spin`, SIM_LIMITS.spin, [0, 0], lenient),
    },
    cone: num(c, o, 'cone', `${path}.cone`, SIM_LIMITS.cone, 360),
    inherit: num(c, o, 'inherit', `${path}.inherit`, SIM_LIMITS.inherit, 0),
  };
  if (out.trigger === 'time') out.at = num(c, o, 'at', `${path}.at`, SIM_LIMITS.at, 0.5);
  else if (o.at !== undefined && o.at !== null && !lenient) c.err(`${path}.at`, 'Only for the trigger time.');
  const ph = physics(c, o.physics, `${path}.physics`, DEFAULT_PHYSICS, true);
  if (Object.keys(ph).length) out.physics = ph;
  // lenient: broken children are dropped as a whole (the parents still play)
  if (lenient && c.errors.length > before) return undefined;
  return out;
}

/** particles-v2 ParticlesModule.validateSim. */
export function validateSim(raw: unknown, mode: 'strict' | 'lenient'): { sim?: ParticlesSim; errors: FieldError[] } {
  const lenient = mode === 'lenient';
  const c = new Checker();
  const o = c.obj(raw, P);
  if (!o) return { errors: c.errors };
  if (o.engine !== PARTICLES_ENGINE) {
    c.err(`${P}.engine`, o.engine === undefined ? 'Required.' : `This card plays engine ${PARTICLES_ENGINE}; update Magic Card to play this animation.`);
    if (lenient) return { errors: c.errors };
  }
  const flow = c.oneOf(o, 'flow', `${P}.flow`, FLOWS);
  if (!flow) {
    if (o.flow === undefined) c.err(`${P}.flow`, 'Required.');
    if (lenient) return { errors: c.errors };
  }
  const r = isObj(o.ranges) ? o.ranges : (c.obj(o.ranges ?? {}, `${P}.ranges`) ?? {});
  const d = DEFAULT_RANGES;
  const sim: ParticlesSim = {
    engine: PARTICLES_ENGINE,
    mode: c.oneOf(o, 'mode', `${P}.mode`, ['baked', 'live'] as const, 'baked') ?? 'baked',
    seed: num(c, o, 'seed', `${P}.seed`, [0, 0xffffffff], 0, true) >>> 0,
    flow: flow ?? 'fall',
    shapes: shapes(c, o.shapes, `${P}.shapes`),
    ranges: {
      speed: range(c, r, 'speed', `${P}.ranges.speed`, SIM_LIMITS.speed, d.speed, lenient),
      spin: range(c, r, 'spin', `${P}.ranges.spin`, SIM_LIMITS.spin, d.spin, lenient),
      delay: range(c, r, 'delay', `${P}.ranges.delay`, SIM_LIMITS.delay, d.delay, lenient),
      lifetime: range(c, r, 'lifetime', `${P}.ranges.lifetime`, SIM_LIMITS.lifetime, d.lifetime, lenient),
      opacity: range(c, r, 'opacity', `${P}.ranges.opacity`, SIM_LIMITS.opacity, d.opacity, lenient),
    },
    physics: physics(c, o.physics, `${P}.physics`, DEFAULT_PHYSICS, false) as ParticlePhysics,
    colliders: colliders(c, o.colliders, `${P}.colliders`),
  };
  if (o.children !== undefined && o.children !== null) {
    const ch = children(c, o.children, `${P}.children`, lenient);
    if (ch) sim.children = ch;
  }
  return { sim, errors: c.errors };
}
