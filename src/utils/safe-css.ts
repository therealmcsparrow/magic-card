/*
 * The safe CSS value helpers every card feature shares: a trimmed string, a CSS time, a colour that cannot break out of
 * an inline style. Plain code with no imports, so the entry keeps it while the animation resolve is a lazy chunk.
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

const LENGTH = /^(\d*\.?\d+)(px|em|rem|%|vw|vh)?$/;

/** 1 to `max` CSS lengths (a bare number is px, no negatives, no functions); undefined when any token is not one. */
export function cssLengths(v: unknown, max = 4): string | undefined {
  const s = typeof v === 'number' ? (Number.isFinite(v) ? String(v) : '') : str(v);
  const tokens = s?.split(/\s+/);
  if (!tokens || tokens.length > max) return undefined;
  const out: string[] = [];
  for (const t of tokens) {
    const m = LENGTH.exec(t);
    if (!m) return undefined;
    out.push(m[1] + (m[2] ?? 'px'));
  }
  return out.join(' ');
}

/** A border-style keyword. */
export function safeBorderStyle(v: unknown): string | undefined {
  const s = str(v)?.toLowerCase();
  return s && /^(none|hidden|solid|dashed|dotted|double|groove|ridge|inset|outset)$/.test(s) ? s : undefined;
}

/** An opacity from 0 to 1 (a number or its plain text); the parsed number, never the raw text. */
export function unitOpacity(v: unknown): number | undefined {
  const n = typeof v === 'number' ? v : typeof v === 'string' && /^\s*\d*\.?\d+\s*$/.test(v) ? Number(v) : NaN;
  return n >= 0 && n <= 1 ? n : undefined;
}

const PERCENT = /^(\d*\.?\d+)(%)?$/;
const FILTER_ARG = new Map<string, RegExp>([
  ['blur', /^(\d*\.?\d+)(px|em|rem)?$/],
  ['hue-rotate', /^(-?\d*\.?\d+)(deg|grad|rad|turn)$/],
  ...['brightness', 'contrast', 'grayscale', 'invert', 'opacity', 'saturate', 'sepia'].map((f): [string, RegExp] => [f, PERCENT]),
]);

/**
 * A backdrop-filter / filter list: `none` or up to 6 of blur, brightness, contrast, grayscale, hue-rotate, invert,
 * opacity, saturate, sepia with one plain number argument (no url(), var(), calc() or drop-shadow()). The text is
 * rebuilt from the parsed functions, so nothing else is emitted.
 */
export function safeFilter(v: unknown): string | undefined {
  const s = str(v)?.toLowerCase();
  if (s === 'none') return s;
  if (!s) return undefined;
  const out: string[] = [];
  const re = /\s*([a-z-]+)\(\s*([^()\s]*)\s*\)(?=\s|$)\s*/y;
  let at = 0;
  for (let m: RegExpExecArray | null; at < s.length; at = re.lastIndex) {
    m = re.exec(s);
    const fn = m?.[1] ?? '';
    const arg = m && FILTER_ARG.get(fn)?.exec(m[2]);
    if (!arg || out.length === 6) return undefined;
    out.push(`${fn}(${arg[1]}${arg[2] ?? (fn === 'blur' ? 'px' : '')})`);
  }
  return out.join(' ');
}

/** The ha-card declarations of the card's border, opacity and backdrop filter keys (those that passed). */
export function cardFrame(c: { border_width?: unknown; border_style?: unknown; border_color?: unknown; opacity?: unknown; backdrop_filter?: unknown }): string[] {
  const w = cssLengths(c.border_width);
  const s = safeBorderStyle(c.border_style);
  const col = safeColor(c.border_color);
  const o = unitOpacity(c.opacity);
  const b = safeFilter(c.backdrop_filter);
  return [
    w && `border-width: ${w}`,
    s && `border-style: ${s}`,
    col && `border-color: ${col}`,
    o !== undefined && `opacity: ${o}`,
    b && `backdrop-filter: ${b}; -webkit-backdrop-filter: ${b}`,
  ].filter((p): p is string => !!p);
}
