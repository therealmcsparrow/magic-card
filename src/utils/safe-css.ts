/*
 * The safe CSS value helpers every card feature shares: a trimmed string, a CSS time, a colour that cannot break out of
 * an inline style. Plain code with no imports, so the entry keeps it while the animation resolve is a lazy chunk (ADR
 * 0043). Moved verbatim from src/utils/animation.ts.
 */

export const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined);

/** A CSS time ("2s", "600ms", a bare number = seconds), or undefined when it is not one. */
export function cssTime(v: unknown): string | undefined {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0) return `${+v.toFixed(3)}s`;
  const s = str(v);
  if (!s) return undefined;
  if (/^\d*\.?\d+$/.test(s)) return `${+(+s).toFixed(3)}s`;
  return /^\d*\.?\d+m?s$/.test(s) ? s : undefined;
}

/**
 * CSS functions a colour may use: colour functions, var(), light-dark() and the math functions (calc,
 * min, max, clamp). Never url() / image functions, also not nested inside these.
 */
export const COLOR_FUNCTIONS: ReadonlySet<string> = new Set([
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
