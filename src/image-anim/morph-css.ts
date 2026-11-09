import { IMAGE_ID_RE, IMAGE_MAX_BYTES } from '../contracts/svg-image';
import { MORPH_EASING_RE, MORPH_PATH_DATA_RE, type ImageMorph } from '../contracts/image-animation';

// Writes the CSS `d: path()` keyframes of a morph from its stored frames. Every value is matched on an allow-list first; no frame is interpolated here.

export interface MorphTiming {
  /** s per iteration. */
  duration: number;
  /** s before the first iteration. */
  delay?: number;
  iterations: 'infinite' | number;
}

/** Longest path data accepted in one frame (characters): the same limit as the record check. */
const MAX_D_CHARS = IMAGE_MAX_BYTES;
const KEY_RE = /^[A-Za-z0-9_-]{1,64}$/;

const num = (n: number): string => String(+n.toFixed(4));

/** The frame's path data with other whitespace as spaces; undefined when it is not plain path data. */
function pathData(d: unknown): string | undefined {
  if (typeof d !== 'string' || !d || d.length > MAX_D_CHARS) return undefined;
  const text = d.replace(/\s+/g, ' ').trim();
  return MORPH_PATH_DATA_RE.test(text) ? text : undefined;
}

/** One `@keyframes` and one rule per morph, scoped to `svg[data-mc-ia="<key>"]`; a morph with any value off the lists is left out whole. */
export function morphCss(morphs: readonly ImageMorph[], timing: MorphTiming, key: string): string {
  const { duration, iterations } = timing;
  const delay = timing.delay ?? 0;
  const count = iterations === 'infinite' ? 'infinite' : typeof iterations === 'number' && Number.isFinite(iterations) && iterations > 0 ? num(iterations) : '';
  if (!KEY_RE.test(key) || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(delay) || delay < 0 || !count) return '';
  const out: string[] = [];
  morphs.forEach((m, i) => {
    if (typeof m.target !== 'string' || !IMAGE_ID_RE.test(m.target) || !Array.isArray(m.frames) || m.frames.length < 2) return;
    const steps: string[] = [];
    for (const f of m.frames) {
      const d = pathData(f.d);
      const easing = f.easing === undefined ? '' : MORPH_EASING_RE.test(f.easing) ? `animation-timing-function:${f.easing};` : undefined;
      if (!d || easing === undefined || typeof f.at !== 'number' || !(f.at >= 0 && f.at <= 100)) return;
      steps.push(`${num(f.at)}%{d:path("${d}");${easing}}`);
    }
    const name = `mcm-${key}-${i}`;
    out.push(
      `@keyframes ${name}{${steps.join('')}}`,
      `svg[data-mc-ia="${key}"] [id="${m.target}"]{animation:${name} ${num(duration)}s linear ${num(delay)}s ${count}${iterations === 'infinite' ? '' : ' forwards'};}`,
    );
  });
  return out.join('\n');
}
