/* A CSS `aspect-ratio` from a module's `aspect_ratio` setting. Pure and import-free: the camera and image stubs in magic-card.js use it without the media resolver. */

export const DEFAULT_ASPECT_RATIO = '16 / 9';

const NUM = '(\\d+(?:\\.\\d+)?|\\.\\d+)';
const PAIR = new RegExp(`^${NUM}\\s*[:/x×]\\s*${NUM}$`, 'i');
const SINGLE = new RegExp(`^${NUM}$`);
const PERCENT = new RegExp(`^${NUM}\\s*%$`);

/**
 * A CSS `aspect-ratio` from what users write in YAML or the editor: a number (`1.5`, `1`),
 * `16:9`, `16/9`, `16x9`, or a percentage of the width like HA's picture cards (`56.25%`).
 * Anything else (empty, zero, text) gives `fallback`.
 */
export function cssAspectRatio(value: unknown, fallback = DEFAULT_ASPECT_RATIO): string {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? String(value) : fallback;
  if (typeof value !== 'string') return fallback;
  const v = value.trim();
  let m = PAIR.exec(v);
  if (m) {
    const w = Number(m[1]);
    const h = Number(m[2]);
    return w > 0 && h > 0 ? `${w} / ${h}` : fallback;
  }
  m = SINGLE.exec(v);
  if (m) return Number(m[1]) > 0 ? String(Number(m[1])) : fallback;
  m = PERCENT.exec(v);
  if (m) return Number(m[1]) > 0 ? `100 / ${Number(m[1])}` : fallback;
  return fallback;
}
