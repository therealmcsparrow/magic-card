import { parseGradient } from '../../utils/gradient';
import { safeColor } from '../../utils/animation';
import { BLUR_MAX, LAYER_ANCHORS, type LayerAnchor } from '../../contracts/layer-placement';
import type { BgPattern } from '../../contracts/bg-stack';

/*
 * Pure value checks of <mc-bg-stack> (contract bg-stack 1.0.0 r2): every value that reaches CSS or a
 * URL load goes through one of these allow-lists (proj.M1, proj.M2). No lit, no DOM except `URL`.
 */

const MAX_URL = 8192;
const MAX_DATA_URL = 2_000_000;
const MAX_GRADIENT = 600;
export const MAX_STATES = 32;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const num = (v: unknown, min: number, max: number, dflt: number): number => {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : dflt;
};

/**
 * An image URL the card may load, parsed the way the browser parses it: http(s) or same-origin
 * relative, plus raster data: URLs. Returns the serialised URL, or undefined.
 */
export function safeImageUrl(v: unknown, base: string): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  if (!s || s.length > (/^data:/i.test(s) ? MAX_DATA_URL : MAX_URL)) return undefined;
  // protocol-relative and breakouts: a typed path starts with one slash, nothing here needs braces or quotes
  if (/^[\\/]{2}/.test(s) || /[{}<>\\"`]/.test(s) || /\burl\s*\(/i.test(s)) return undefined;
  let u: URL;
  try {
    u = new URL(s, base);
  } catch {
    return undefined;
  }
  if (u.username || u.password) return undefined;
  if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
  if (u.protocol === 'data:' && /^data:image\/(png|jpe?g|gif|webp|avif|bmp)[;,]/i.test(u.href)) return u.href;
  return undefined;
}

/** `url("...")` for an already validated URL; the characters that would end the string are escaped. */
export function cssUrl(href: string): string {
  return `url("${href.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

/** The `states` map of a layer: null prototype, string values, prototype keys dropped, at most MAX_STATES entries. */
export function sanitiseStates(raw: unknown): Record<string, string> {
  const out: Record<string, string> = Object.create(null);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  let n = 0;
  // for-in with an early exit: a 10k-entry map is never materialised
  for (const k in raw as Record<string, unknown>) {
    if (!Object.prototype.hasOwnProperty.call(raw, k) || FORBIDDEN_KEYS.has(k)) continue;
    if (++n > MAX_STATES) break;
    const val = (raw as Record<string, unknown>)[k];
    if (typeof val === 'string') out[k] = val;
  }
  return out;
}

/** A gradient colour value rebuilt from parseGradient output (never the raw string), or undefined. */
export function gradientCss(v: unknown): string | undefined {
  if (typeof v !== 'string' || v.length > MAX_GRADIENT) return undefined;
  const g = parseGradient(v);
  if (!g || !Number.isFinite(g.angle)) return undefined;
  const stops = g.stops.join(',');
  return g.radial ? `radial-gradient(circle,${stops})` : `linear-gradient(${g.angle}deg,${stops})`;
}

export interface PatternCss {
  image: string;
  size: string;
}

/** A pattern as CSS gradients: numbers clamped, ink through safeColor. */
export function patternCss(kind: BgPattern, cell: unknown, thickness: unknown, ink: unknown): PatternCss {
  const c = Math.round(num(cell, 4, 64, 16));
  const t = Math.round(num(thickness, 1, 8, kind === 'dots' || kind === 'checks' ? 2 : 1));
  const k = safeColor(ink) ?? 'rgba(128, 128, 128, 0.4)';
  const size = `${c}px ${c}px`;
  switch (kind) {
    case 'dots':
      return { image: `radial-gradient(circle at 50% 50%,${k} 0,${k} ${t}px,transparent ${t + 1}px)`, size };
    case 'grid':
      return { image: `linear-gradient(to right,${k} ${t}px,transparent ${t}px),linear-gradient(to bottom,${k} ${t}px,transparent ${t}px)`, size };
    case 'lines':
      return { image: `linear-gradient(to bottom,${k} ${t}px,transparent ${t}px)`, size };
    case 'diagonal':
      return { image: `repeating-linear-gradient(45deg,${k} 0,${k} ${t}px,transparent ${t}px,transparent ${c}px)`, size };
    default:
      return { image: `conic-gradient(${k} 25%,transparent 0 50%,${k} 0 75%,transparent 0)`, size };
  }
}

/** Blur in px, 0 to BLUR_MAX. */
export const blurOf = (v: unknown): number => num(v, 0, BLUR_MAX, 0);
/** Opacity 0-100 as 0-1. */
export const opacityOf = (v: unknown): number => num(v, 0, 100, 100) / 100;

/** Anchor -> [x, y] in -1..1 (left/top = -1): LAYER_ANCHORS is row-major. */
const anchorXY = (a: LayerAnchor): [number, number] => {
  const i = LAYER_ANCHORS.indexOf(a);
  return [(i % 3) - 1, Math.floor(i / 3) - 1];
};
const isAnchor = (v: unknown): v is LayerAnchor => typeof v === 'string' && (LAYER_ANCHORS as readonly string[]).includes(v);
const XW = ['left', 'center', 'right'];
const YW = ['top', 'center', 'bottom'];

const PCT = /^\s*(-?\d{1,4}(?:\.\d{1,3})?)%\s+(-?\d{1,4}(?:\.\d{1,3})?)%\s*$/;

/** background-position from an anchor or "<x>% <y>%" (clamped 0-100); anything else is centre. */
export function positionCss(v: unknown): string {
  if (isAnchor(v)) {
    const [x, y] = anchorXY(v);
    return x === 0 && y === 0 ? 'center' : `${XW[x + 1]} ${YW[y + 1]}`;
  }
  const m = typeof v === 'string' ? PCT.exec(v) : null;
  return m ? `${num(m[1], 0, 100, 50)}% ${num(m[2], 0, 100, 50)}%` : 'center';
}

/** background-size: cover | contain | auto | "<n>%" (1-400); a bare number is a percentage. */
export function sizeCss(v: unknown): string {
  if (v === 'cover' || v === 'contain' || v === 'auto') return v;
  if (typeof v === 'number') return `${num(v, 1, 400, 100)}%`;
  const m = typeof v === 'string' ? /^\s*(\d{1,5}(?:\.\d{1,3})?)%\s*$/.exec(v) : null;
  return m ? `${num(m[1], 1, 400, 100)}%` : 'cover';
}

/** background-repeat from the allow-list; ignored (no-repeat) with cover. */
export function repeatCss(v: unknown, size: string): string {
  if (size === 'cover') return 'no-repeat';
  return v === 'repeat' || v === 'repeat-x' || v === 'repeat-y' ? v : 'no-repeat';
}

export interface PanZoom {
  from: number;
  to: number;
  /** Focus direction, -1..1. */
  fx: number;
  fy: number;
  duration: number;
  alternate: boolean;
  idle: boolean;
}

/** Pan / zoom settings with the contract defaults and clamps; undefined when the key is not an object. */
export function panZoomOf(v: unknown): PanZoom | undefined {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return undefined;
  const o = v as Record<string, unknown>;
  const [fx, fy] = anchorXY(isAnchor(o.focus) ? o.focus : 'center');
  return {
    from: num(o.from, 100, 200, 100) / 100,
    to: num(o.to, 100, 200, 115) / 100,
    fx,
    fy,
    duration: num(o.duration, 10, 120, 30),
    alternate: o.alternate !== false,
    idle: o.pause_when_idle === true,
  };
}
