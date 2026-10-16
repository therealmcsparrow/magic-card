import { KEYFRAMES } from '../css/animation-keyframes';
import { SCENE_KEYFRAMES } from '../css/animation-scenes';
import { EXTRA_KEYFRAMES } from '../css/animation-extra';
import { getAnimationPreset } from '../utils/animation-presets';

/*
 * The presets' keyframe bodies (src/css/animation-*.ts) as data: blocks of offsets and
 * declarations, and as Web Animations keyframes for sequences. `$i` becomes the intensity, `$c`
 * the animation colour `var(--mc-anim-c)`.
 */

export interface KeyframeBlock {
  /** 0-100 */
  offsets: number[];
  decls: Array<[string, string]>;
}

/** Body of `@keyframes mc-anim-<key>` with the tokens filled in; undefined for an unknown key. */
export function presetKeyframesBody(key: string, intensity?: number): string | undefined {
  const body = KEYFRAMES[key] ?? SCENE_KEYFRAMES[key] ?? EXTRA_KEYFRAMES[key];
  if (body === undefined) return undefined;
  const p = getAnimationPreset(key.replace(/-icon$/, ''));
  const i = intensity ?? p?.defaults.intensity ?? 1;
  return body.replace(/\$i/g, String(i)).replace(/\$c/g, 'var(--mc-anim-c)');
}

/** `0%, 50% { a: b; c: d }` blocks of a keyframes body. */
export function parseKeyframeBlocks(body: string): KeyframeBlock[] {
  const out: KeyframeBlock[] = [];
  for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const offsets = m[1]
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .map((s) => (s === 'from' ? 0 : s === 'to' ? 100 : parseFloat(s)))
      .filter((n) => Number.isFinite(n));
    const decls: Array<[string, string]> = [];
    for (const d of m[2].split(';')) {
      const at = d.indexOf(':');
      if (at < 0) continue;
      const prop = d.slice(0, at).trim().toLowerCase();
      const value = d.slice(at + 1).trim().replace(/\s+/g, ' ');
      if (prop && value) decls.push([prop, value]);
    }
    if (offsets.length && decls.length) out.push({ offsets, decls });
  }
  return out;
}

const camel = (p: string): string => (p === 'animation-timing-function' ? 'easing' : p.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));

/** Blocks as Web Animations keyframes: one per offset (declarations of a repeated offset merged), sorted. */
export function blocksToFrames(blocks: KeyframeBlock[]): Keyframe[] {
  const byOffset = new Map<number, Record<string, string>>();
  for (const b of blocks) {
    for (const o of b.offsets) {
      const f = byOffset.get(o) ?? {};
      for (const [p, v] of b.decls) f[camel(p)] = v;
      byOffset.set(o, f);
    }
  }
  return [...byOffset.entries()].sort((a, b) => a[0] - b[0]).map(([o, f]) => ({ ...f, offset: +(o / 100).toFixed(4) }));
}

/** A motion preset's keyframes for element.animate (the icon variant for an icon when it has one). */
export function presetFrames(id: string, opts: { intensity?: number; icon?: boolean } = {}): Keyframe[] | undefined {
  const p = getAnimationPreset(id);
  if (!p) return undefined;
  const body = presetKeyframesBody(opts.icon && p.iconKeyframes ? `${id}-icon` : id, opts.intensity);
  return body === undefined ? undefined : blocksToFrames(parseKeyframeBlocks(body));
}
