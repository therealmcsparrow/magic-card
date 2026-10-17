import { THEME_NAME_RE } from '../contracts/theme-editor';
import type { ThemeDoc, ThemeMode, ThemeValue } from '../contracts/theme-editor';
import { cloneDoc } from './model';
import type { DocError } from './model';
import { kindOf } from './catalogue/index';

/* Small pure helpers shared by the views: names, scopes, colour maths, the YAML view. */

// ── names ──

export const RESERVED_NAMES: readonly string[] = ['default', 'backend-selected'];

/** A theme name suggestion from free text ("Midnight OLED" -> "midnight-oled"). */
export const slugName = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^[-_]+|-+$/g, '')
    .slice(0, 64);

/** `base`, or `base-2`, `base-3`... the first one not in `taken`. */
export function uniqueName(base: string, taken: ReadonlySet<string>): string {
  const root = base || 'my-theme';
  if (!taken.has(root)) return root;
  for (let i = 2; i < 1000; i++) {
    const n = `${root.slice(0, 60)}-${i}`;
    if (!taken.has(n)) return n;
  }
  return root;
}

/** The inline error for a theme name, or '' when it is fine. Mirrors the backend rule; the backend decides. */
export function nameError(name: string, taken: ReadonlySet<string>): string {
  if (!name.trim()) return 'Enter a name.';
  if (!THEME_NAME_RE.test(name)) return 'Use lowercase letters, numbers, hyphens and underscores, starting with a letter or number (64 characters at most).';
  if (RESERVED_NAMES.includes(name)) return 'This name is reserved.';
  if (taken.has(name)) return `A theme called ${name} already exists.`;
  return '';
}

// ── scopes ──

export type Scope = 'shared' | ThemeMode;
export const SCOPE_LABEL: Record<Scope, string> = { shared: 'Shared', light: 'Light', dark: 'Dark' };

const isScalar = (v: unknown): v is ThemeValue => typeof v === 'string' || typeof v === 'number';

export function blockOf(doc: ThemeDoc, scope: Scope): Record<string, unknown> | undefined {
  return scope === 'shared' ? (doc as Record<string, unknown>) : (doc.modes?.[scope] as Record<string, unknown> | undefined);
}

/** The value a scope sets itself (not inherited). */
export function ownValue(doc: ThemeDoc, scope: Scope, name: string): ThemeValue | undefined {
  if (name === 'modes') return undefined;
  const v = blockOf(doc, scope)?.[name];
  return isScalar(v) ? v : undefined;
}

/** The modes that set `name` themselves, other than the scope being edited. */
export function overriddenIn(doc: ThemeDoc, scope: Scope, name: string): ThemeMode[] {
  const modes: ThemeMode[] = ['light', 'dark'];
  return modes.filter((m) => m !== scope && ownValue(doc, m, name) !== undefined);
}

/** Every variable name set anywhere in the doc, in file order, once. */
export function allKeys(doc: ThemeDoc): string[] {
  const seen = new Set<string>();
  for (const k of Object.keys(doc)) if (k !== 'modes') seen.add(k);
  for (const m of ['light', 'dark'] as const) for (const k of Object.keys(doc.modes?.[m] ?? {})) seen.add(k);
  return [...seen];
}

export const isSetAnywhere = (doc: ThemeDoc, name: string): boolean =>
  ownValue(doc, 'shared', name) !== undefined || ownValue(doc, 'light', name) !== undefined || ownValue(doc, 'dark', name) !== undefined;

/** True when some colour variable lives inside a mode block (round 1, 16.1: decides the opening scope). */
export function hasModeColors(doc: ThemeDoc): boolean {
  for (const m of ['light', 'dark'] as const) {
    for (const k of Object.keys(doc.modes?.[m] ?? {})) {
      const kind = kindOf(k);
      if (kind === 'color' || kind === 'background' || (!kind && /color|background/.test(k))) return true;
    }
  }
  return false;
}

/** The scope a theme opens in: a mode when its colours live in modes, Shared otherwise. */
export function openingScope(doc: ThemeDoc, previewMode: ThemeMode): Scope {
  return doc.modes && hasModeColors(doc) ? previewMode : 'shared';
}

// ── the preview keeps the last valid value ──

const pathParts = (p: string): string[] => p.replace(/^theme\./, '').split('.');

/**
 * `doc` with every value that has an error replaced by what `prev` (the last preview doc) had at the
 * same place, or dropped when there was nothing. The preview never shows an invalid value.
 */
export function heldBackDoc(doc: ThemeDoc, prev: ThemeDoc, errors: readonly DocError[]): ThemeDoc {
  if (!errors.length) return doc;
  const out = cloneDoc(doc) as Record<string, unknown>;
  for (const e of errors) {
    const parts = pathParts(e.path);
    if (parts[0] === 'modes' && parts.length >= 3) {
      const mode = parts[1] as ThemeMode;
      const key = parts.slice(2).join('.');
      const block = (out.modes as Record<string, Record<string, unknown>> | undefined)?.[mode];
      if (!block) continue;
      const before = prev.modes?.[mode]?.[key];
      if (before === undefined) delete block[key];
      else block[key] = before;
    } else if (parts[0] !== 'modes') {
      const key = parts.join('.');
      const before = (prev as Record<string, unknown>)[key];
      if (before === undefined || typeof before === 'object') delete out[key];
      else out[key] = before;
    }
  }
  return out as ThemeDoc;
}

// ── installed themes (hass.themes.themes) ──

/** A theme as HA exposes it to the frontend, reduced to a ThemeDoc (scalars and the two mode blocks). */
export function docFromHass(raw: unknown): ThemeDoc {
  const out: Record<string, unknown> = {};
  if (typeof raw !== 'object' || raw === null) return out as ThemeDoc;
  const src = raw as Record<string, unknown>;
  for (const [k, v] of Object.entries(src)) if (k !== 'modes' && isScalar(v)) out[k] = v;
  const modes = src.modes as Record<string, unknown> | undefined;
  if (modes && typeof modes === 'object') {
    const m: Record<string, Record<string, ThemeValue>> = {};
    for (const mode of ['light', 'dark']) {
      const b = modes[mode];
      if (b && typeof b === 'object') {
        m[mode] = Object.fromEntries(Object.entries(b).filter(([, v]) => isScalar(v))) as Record<string, ThemeValue>;
      }
    }
    if (Object.keys(m).length) out.modes = m;
  }
  return out as ThemeDoc;
}

// ── YAML view ("Show YAML": what Save would write) ──

const PLAIN_RE = /^[A-Za-z_./%][A-Za-z0-9_./%]*(?:[ -][A-Za-z0-9_./%]+)*$/;
const RESERVED_WORD_RE = /^(?:true|false|yes|no|on|off|null|y|n|~)$/i;

function scalarYaml(v: ThemeValue): string {
  if (typeof v === 'number') return String(v);
  if (PLAIN_RE.test(v) && !RESERVED_WORD_RE.test(v)) return v;
  return JSON.stringify(v);
}

export const YAML_HEADER = '# Written by the Magic Card theme editor. Comments in this file are not kept.\n';

/** The file Save writes, as text: `{name: theme}` in key order (quoted where YAML needs it). */
export function toYaml(name: string, doc: ThemeDoc): string {
  const lines: string[] = [`${name}:`];
  const put = (obj: Record<string, unknown>, pad: string): void => {
    for (const [k, v] of Object.entries(obj)) {
      if (isScalar(v)) lines.push(`${pad}${k}: ${scalarYaml(v)}`);
      else if (v && typeof v === 'object') {
        if (Object.keys(v).length === 0) lines.push(`${pad}${k}: {}`);
        else {
          lines.push(`${pad}${k}:`);
          put(v as Record<string, unknown>, `${pad}  `);
        }
      }
    }
  };
  put(doc as Record<string, unknown>, '  ');
  return `${YAML_HEADER}${lines.join('\n')}\n`;
}

// ── colour maths (contrast hint) ──

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number): number => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

/** hex, rgb()/rgba() and hsl()/hsla() colours; null for anything else (names, var(), gradients). */
export function parseColor(value: string): Rgba | null {
  const v = value.trim().toLowerCase();
  let m = /^#([0-9a-f]{3,8})$/.exec(v);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const n = (i: number): number => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = /^(rgba?|hsla?)\(\s*([^)]*)\)$/.exec(v);
  if (!m) return null;
  const parts = m[2].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  if ([parts[0], parts[1], parts[2]].some((p) => Number.isNaN(parseFloat(p)))) return null;
  const num = (s: string, pct = 1): number => (s.endsWith('%') ? (parseFloat(s) / 100) * pct : parseFloat(s));
  const alpha = parts[3] === undefined ? 1 : clamp(num(parts[3], 1), 0, 1);
  if (m[1].startsWith('rgb')) return { r: clamp(num(parts[0], 255), 0, 255), g: clamp(num(parts[1], 255), 0, 255), b: clamp(num(parts[2], 255), 0, 255), a: alpha };
  const [r, g, b] = hslToRgb(((parseFloat(parts[0]) % 360) + 360) % 360, clamp(num(parts[1], 1), 0, 1), clamp(num(parts[2], 1), 0, 1));
  return { r, g, b, a: alpha };
}

const over = (top: Rgba, base: Rgba): Rgba => ({
  r: top.r * top.a + base.r * (1 - top.a),
  g: top.g * top.a + base.g * (1 - top.a),
  b: top.b * top.a + base.b * (1 - top.a),
  a: 1,
});

const lum = ({ r, g, b }: Rgba): number => {
  const c = [r, g, b].map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

export function contrastRatio(fg: Rgba, bg: Rgba): number {
  const a = lum(fg);
  const b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** The darkest colour stop of a gradient, else null (a translucent card is checked over it). */
export function darkestStop(value: string): Rgba | null {
  const stops = value.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi) ?? [];
  const colours = stops.map(parseColor).filter((c): c is Rgba => !!c);
  if (!colours.length) return null;
  return colours.reduce((a, b) => (lum(a) <= lum(b) ? a : b));
}

export interface ContrastResult {
  ratio: number;
  ok: boolean;
}

/**
 * Contrast of a text colour on a card colour. `stage` is what a translucent card sits on. Returns
 * 'transparent' when the text itself is translucent, null when a value cannot be measured.
 */
export function textContrast(text: string, card: string, stage: string | undefined): ContrastResult | 'transparent' | null {
  const fg = parseColor(text);
  if (!fg) return null;
  if (fg.a < 1) return 'transparent';
  if (/gradient\(/i.test(card)) return null;
  let bg = parseColor(card);
  if (!bg) return null;
  if (bg.a < 1) {
    const base = (stage ? (parseColor(stage) ?? darkestStop(stage)) : null) ?? { r: 255, g: 255, b: 255, a: 1 };
    bg = over(bg, base.a < 1 ? over(base, { r: 255, g: 255, b: 255, a: 1 }) : base);
  }
  const ratio = contrastRatio(fg, bg);
  return { ratio, ok: ratio >= 4.5 };
}

// ── hass ──

export interface HassLike {
  themes?: { darkMode?: boolean; themes?: Record<string, unknown>; theme?: string };
}

export const hassOf = (h: unknown): HassLike => (typeof h === 'object' && h !== null ? (h as HassLike) : {});
export const browserMode = (h: unknown): ThemeMode => (hassOf(h).themes?.darkMode ? 'dark' : 'light');

// ── events ──

/** A bubbling, composed CustomEvent from `el` (the views talk to each other with `mcte-*` events). */
export const fire = <T>(el: EventTarget, name: string, detail?: T): boolean =>
  el.dispatchEvent(new CustomEvent<T>(name, { detail: detail as T, bubbles: true, composed: true }));

/** Copy text; true when the browser allowed it. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
