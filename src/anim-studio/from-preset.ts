import { getAnimationPreset } from '../utils/animation-presets';
import { parseKeyframeBlocks, presetKeyframesBody } from './css-keyframes';
import { DEFAULT_PARTICLES, type AnimationDoc, type AnimationKeyframe, type KeyframeTransform } from './model';

/*
 * "Customise a preset": a built-in preset as an editable document.
 * - Motion presets (rotate / translate / scale / opacity / filter / glow) become keyframes documents:
 *   the preset's keyframes at its default intensity, calc() evaluated to numbers; filters and
 *   shadows stay CSS text with the animation colour as `var(--mc-anim-c)`.
 * - Particle, ring, scene and seasonal presets become particles documents based on the preset
 *   (`particles.preset`): their look stays, the parameter (count, width, density) and the timing
 *   are editable.
 */

/** Evaluate a numeric CSS expression (`calc(16 * -1px)`, `calc(1 + 4 / 100)`, `-40px`) to its number. */
export function evalCssNumber(s: string): number {
  const src = s.replace(/calc\(/g, '(').replace(/(\d)(px|deg|%)/g, '$1');
  let i = 0;
  const peek = () => {
    while (src[i] === ' ') i++;
    return src[i];
  };
  const atom = (): number => {
    const c = peek();
    if (c === '(') {
      i++;
      const v = sum();
      if (peek() !== ')') throw new Error(`Expected ) in "${s}"`);
      i++;
      return v;
    }
    if (c === '-' || c === '+') {
      i++;
      const v = atom();
      return c === '-' ? -v : v;
    }
    const m = /^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(src.slice(i));
    if (!m) throw new Error(`Not a number in "${s}"`);
    i += m[0].length;
    return Number(m[0]);
  };
  const product = (): number => {
    let v = atom();
    for (let c = peek(); c === '*' || c === '/'; c = peek()) {
      i++;
      const r = atom();
      v = c === '*' ? v * r : v / r;
    }
    return v;
  };
  const sum = (): number => {
    let v = product();
    for (let c = peek(); c === '+' || c === '-'; c = peek()) {
      i++;
      const r = product();
      v = c === '+' ? v + r : v - r;
    }
    return v;
  };
  const v = sum();
  if (peek() !== undefined) throw new Error(`Unexpected "${src.slice(i)}" in "${s}"`);
  return +v.toFixed(4);
}

/** Split a value at top-level spaces (`calc(a * b) 0` -> two tokens). */
export function splitTopLevel(v: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of v.trim()) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ' ' && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

const AXES: Record<string, [number, number, number]> = { x: [1, 0, 0], y: [0, 1, 0] };

function applyDecl(k: AnimationKeyframe, prop: string, value: string, presetId: string): void {
  const t: KeyframeTransform = (k.transform ??= {});
  switch (prop) {
    case 'translate': {
      const [x, y = '0'] = splitTopLevel(value);
      t.x = evalCssNumber(x);
      t.y = evalCssNumber(y);
      return;
    }
    case 'scale': {
      const parts = splitTopLevel(value).map(evalCssNumber);
      if (parts.length === 1) t.scale = parts[0];
      else {
        t.scale_x = parts[0];
        t.scale_y = parts[1];
      }
      return;
    }
    case 'rotate': {
      const parts = splitTopLevel(value);
      t.rotate = evalCssNumber(parts[parts.length - 1]);
      if (parts.length === 2 && AXES[parts[0]]) t.axis = AXES[parts[0]];
      else if (parts.length === 4) t.axis = [evalCssNumber(parts[0]), evalCssNumber(parts[1]), evalCssNumber(parts[2])];
      return;
    }
    case 'opacity':
      k.opacity = evalCssNumber(value);
      return;
    case 'filter':
      k.filter = value;
      return;
    case 'box-shadow':
      k.shadow = value;
      return;
  }
  throw new Error(`Preset ${presetId}: cannot convert "${prop}"`);
}

/** The preset's keyframes as document keyframes (one per offset, sorted). */
export function presetKeyframes(presetId: string): AnimationKeyframe[] {
  const body = presetKeyframesBody(presetId);
  if (body === undefined) throw new Error(`Preset ${presetId} has no keyframes`);
  const byAt = new Map<number, AnimationKeyframe>();
  for (const b of parseKeyframeBlocks(body)) {
    for (const at of b.offsets) {
      const k = byAt.get(at) ?? { at };
      for (const [prop, value] of b.decls) applyDecl(k, prop, value, presetId);
      byAt.set(at, k);
    }
  }
  return [...byAt.values()]
    .map((k) => (k.transform && !Object.keys(k.transform).length ? (({ transform: _t, ...rest }) => rest)(k) : k))
    .sort((a, b) => a.at - b.at);
}

/** A document id from a preset id (`spin` -> `spin-custom`). */
export const presetDocId = (presetId: string): string => `${presetId.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}-custom`.slice(0, 64);

/** "Customise a preset": the preset as a new document; undefined for an unknown preset. */
export function docFromPreset(presetId: string, id = presetDocId(presetId), name?: string): AnimationDoc | undefined {
  const p = getAnimationPreset(presetId);
  if (!p) return undefined;
  const d = p.defaults;
  const base: AnimationDoc = {
    id,
    name: name ?? p.name,
    kind: 'keyframes',
    duration: parseFloat(d.duration),
    easing: d.easing,
    iterations: d.iterations,
    ...(d.direction !== 'normal' ? { direction: d.direction } : {}),
    target: 'element',
    origin: p.origin ?? 'center',
    version: 1,
  };
  if (p.channels.includes('fx')) {
    return {
      ...base,
      kind: 'particles',
      particles: {
        ...DEFAULT_PARTICLES,
        size: [...DEFAULT_PARTICLES.size],
        colors: [],
        ...(p.particles === 'count' ? { count: Math.max(1, Math.round(d.intensity)) } : {}),
        layer: p.front ? 'front' : 'back',
        preset: p.id,
        intensity: d.intensity,
      },
    };
  }
  return { ...base, keyframes: presetKeyframes(p.id) };
}
