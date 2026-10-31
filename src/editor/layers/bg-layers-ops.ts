import { MAX_BACKGROUND_LAYERS, type BackgroundLayerConfig, type BgLayerStatus, type BgLayerType } from '../../contracts/bg-stack';
import { BLUR_MAX } from '../../contracts/layer-placement';
import type { HomeAssistant } from '../../types';
import { mediaSrc } from '../../utils/media';
import { safeColor } from '../../utils/safe-css';
import { parseGradient } from '../../utils/gradient';
import { m, t } from './i18n';

// The heavy half of the Card backdrop model, carried by magic-card-layer-editor.js only.
// Every function returns new data; nothing mutates a layer.

export const LIMIT_TEXT = m('layer-editor.bg-layers-ops.limit-of-max-layers-reached-more-layers');

const MAX_STATE_ROWS = 32;
const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const SHARED: ReadonlyArray<keyof BackgroundLayerConfig> = ['hidden', 'opacity', 'blend'];

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, Number.isFinite(n) ? n : lo));

export function newLayer(type: BgLayerType): BackgroundLayerConfig {
  switch (type) {
    case 'gradient': return { type, gradient: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.6))' };
    case 'pattern': return { type, pattern: 'dots', color: 'rgba(128,128,128,.35)', size: 16, thickness: 2 };
    case 'color': return { type, color: '#03a9f4' };
    default: return { type: 'image' };
  }
}

/** A new layer in front; undefined at the limit. */
export function addLayer(list: readonly BackgroundLayerConfig[] | undefined, type: BgLayerType): BackgroundLayerConfig[] | undefined {
  const cur = list ?? [];
  if (cur.length >= MAX_BACKGROUND_LAYERS) return undefined;
  return [newLayer(type), ...cur];
}

/** Forward = toward the front (index 0). Undefined at an end. */
export function moveLayerIn(list: readonly BackgroundLayerConfig[], index: number, dir: 'forward' | 'backward'): BackgroundLayerConfig[] | undefined {
  const to = dir === 'forward' ? index - 1 : index + 1;
  if (index < 0 || index >= list.length || to < 0 || to >= list.length) return undefined;
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(to, 0, item);
  return next;
}

export function removeLayer(list: readonly BackgroundLayerConfig[], index: number): { list: BackgroundLayerConfig[]; removed: BackgroundLayerConfig; index: number } | undefined {
  if (index < 0 || index >= list.length) return undefined;
  const next = [...list];
  const [removed] = next.splice(index, 1);
  return { list: next, removed, index };
}

/** Undo of a delete: back at its place (or the end), never past the limit. */
export function restoreLayer(list: readonly BackgroundLayerConfig[], layer: BackgroundLayerConfig, index: number): BackgroundLayerConfig[] {
  if (list.length >= MAX_BACKGROUND_LAYERS) return [...list];
  const next = [...list];
  next.splice(Math.min(Math.max(index, 0), next.length), 0, layer);
  return next;
}

/** Set keys; undefined removes one. Blur is held to 0-24 px and opacity to 0-100. */
export function setLayerKeys(layer: BackgroundLayerConfig, patch: Partial<BackgroundLayerConfig>): BackgroundLayerConfig {
  const next: Record<string, unknown> = { ...layer };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete next[k];
    else next[k] = v;
  }
  if (typeof next.blur === 'number') next.blur = clamp(next.blur, 0, BLUR_MAX);
  if (typeof next.opacity === 'number') next.opacity = clamp(next.opacity, 0, 100);
  return next as unknown as BackgroundLayerConfig;
}

// ── image source ──

export type ImageSource = 'picture' | 'device' | 'state';

/** The contract rule: `states` set = Changes with state; else `entity` = Follows a device; else One picture. */
export function imageSource(layer: BackgroundLayerConfig): ImageSource {
  if (layer.states && typeof layer.states === 'object') return 'state';
  if (typeof layer.entity === 'string') return 'device';
  return 'picture';
}

export function setImageSource(layer: BackgroundLayerConfig, source: ImageSource): BackgroundLayerConfig {
  const next: Record<string, unknown> = { ...layer };
  if (source === 'picture') {
    for (const k of ['entity', 'attribute', 'states', 'refresh', 'stale_badge']) delete next[k];
  } else if (source === 'device') {
    delete next.states;
    if (typeof next.entity !== 'string') next.entity = '';
  } else {
    if (!next.states || typeof next.states !== 'object') next.states = {};
    delete next.attribute;
  }
  return next as unknown as BackgroundLayerConfig;
}

/** The layer draws a library image (its picture or any state's): Repeat does not apply to it. */
export const usesLibraryImage = (layer: BackgroundLayerConfig): boolean =>
  [layer.image, ...stateRows(layer).map(([, v]) => v)].some((v) => typeof v === 'string' && v.startsWith('mcu-image:'));

export const isCameraEntity = (e: string | undefined): boolean => typeof e === 'string' && e.startsWith('camera.');

// ── state rows ("Changes with state") ──

export function stateRows(layer: BackgroundLayerConfig): Array<[string, string]> {
  const s = layer.states;
  if (!s || typeof s !== 'object') return [];
  return Object.entries(s)
    .filter(([k]) => !BLOCKED_KEYS.has(k))
    .slice(0, MAX_STATE_ROWS)
    .map(([k, v]) => [k, typeof v === 'string' ? v : '']);
}

function withRows(layer: BackgroundLayerConfig, rows: Array<[string, string]>): BackgroundLayerConfig {
  return { ...layer, states: Object.fromEntries(rows.slice(0, MAX_STATE_ROWS)) };
}

const okName = (n: string): boolean => n.trim() !== '' && !BLOCKED_KEYS.has(n.trim());

/** Add a row or change its picture. Names that could reach the prototype, and rows past the cap, are refused. */
export function setStateRow(layer: BackgroundLayerConfig, state: string, image: string): BackgroundLayerConfig {
  const name = state.trim();
  if (!okName(name)) return withRows(layer, stateRows(layer));
  const rows = stateRows(layer);
  const at = rows.findIndex(([k]) => k === name);
  if (at >= 0) rows[at] = [name, image];
  else if (rows.length < MAX_STATE_ROWS) rows.push([name, image]);
  return withRows(layer, rows);
}

export function renameStateRow(layer: BackgroundLayerConfig, from: string, to: string): BackgroundLayerConfig {
  const name = to.trim();
  const rows = stateRows(layer);
  const at = rows.findIndex(([k]) => k === from);
  if (at < 0 || !okName(name) || (name !== from && rows.some(([k]) => k === name))) return layer;
  rows[at] = [name, rows[at][1]];
  return withRows(layer, rows);
}

export function removeStateRow(layer: BackgroundLayerConfig, state: string): BackgroundLayerConfig {
  return withRows(layer, stateRows(layer).filter(([k]) => k !== state));
}

// ── type switch ──

/** Switch the type: hidden, opacity and blend carry over; the rest goes (the editor offers Undo). */
export function switchType(layer: BackgroundLayerConfig, type: BgLayerType): BackgroundLayerConfig {
  const keep: Record<string, unknown> = {};
  for (const k of SHARED) if (layer[k] !== undefined) keep[k] = layer[k];
  return { ...newLayer(type), ...keep, type } as BackgroundLayerConfig;
}

// ── summary and status ──

// ── status ──

export const staleMinutes = (seconds: number): number => Math.max(1, Math.ceil(seconds / 60));

/** The sentence for a layer status; undefined when there is nothing to say. */
export function statusSentence(s: BgLayerStatus, layer: BackgroundLayerConfig | undefined): string | undefined {
  const detail = s.detail === undefined ? '' : String(s.detail);
  switch (s.reason) {
    case 'entity-missing': return t('layer-editor.bg-layers-ops.entity-not-found-id-the-next-layer-is', { id: detail });
    case 'no-picture': return t('layer-editor.bg-layers-ops.id-has-no-picture-attribute-try-another', { id: detail });
    case 'no-state-image':
      return layer?.image
        ? t('layer-editor.bg-layers-ops.no-picture-for-state-state-the-any-other', { state: detail })
        : t('layer-editor.bg-layers-ops.no-picture-for-state-state-no-any-other', { state: detail });
    case 'image-missing': return t('layer-editor.bg-layers-ops.this-image-is-no-longer-in-the-library');
    case 'load-failed': return t('layer-editor.bg-layers-ops.the-picture-could-not-be-loaded-the-next');
    case 'snapshot-failed': return t('layer-editor.bg-layers-ops.snapshot-failed-the-last-good-frame');
    case 'stale': return t('layer-editor.bg-layers-ops.not-updated-n-min', { n: staleMinutes(Number(s.detail) || 0) });
    default: return undefined;
  }
}

// ── thumbnails ──

/**
 * A picture value as a thumbnail `src`, or undefined (the row shows an icon). Only http(s), a same-origin
 * relative path or a raster data: image; never javascript:, svg data, a protocol-relative host or a
 * media-source id that has not been resolved.
 */
export function previewSrc(hass: HomeAssistant | undefined, value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const v = value.trim();
  if (!v || v.startsWith('//') || v.startsWith('\\') || /^\s*(javascript|vbscript):/i.test(v)) return undefined;
  const src = mediaSrc(hass, v);
  if (!src) return undefined;
  try {
    const u = new URL(src, globalThis.location?.href ?? 'http://localhost/');
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    if (u.protocol === 'data:' && /^data:image\/(png|jpe?g|gif|webp|avif|bmp)[;,]/i.test(src)) return src;
  } catch {
    return undefined;
  }
  return undefined;
}

const PATTERN_THUMBS: Record<string, (ink: string) => string> = {
  dots: (c) => `background:radial-gradient(circle, ${c} 1.5px, transparent 2px) 0 0 / 8px 8px`,
  grid: (c) => `background:linear-gradient(${c} 1px, transparent 1px) 0 0 / 8px 8px, linear-gradient(90deg, ${c} 1px, transparent 1px) 0 0 / 8px 8px`,
  lines: (c) => `background:repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 6px)`,
  diagonal: (c) => `background:repeating-linear-gradient(45deg, ${c} 0 1px, transparent 1px 6px)`,
  checks: (c) => `background:repeating-conic-gradient(${c} 0 25%, transparent 0 50%) 0 0 / 12px 12px`,
};

/** The thumbnail background of a layer, built only from values that passed their checks (never the raw strings). */
export function thumbStyle(layer: BackgroundLayerConfig): string {
  if (layer.type === 'gradient') {
    const g = parseGradient(layer.gradient);
    return g ? `background:${g.radial ? 'radial' : 'linear'}-gradient(${g.radial ? 'circle' : `${g.angle}deg`}, ${g.stops.join(', ')})` : '';
  }
  if (layer.type === 'color') {
    const c = safeColor(layer.color);
    return c ? `background:${c}` : '';
  }
  if (layer.type === 'pattern') {
    const ink = safeColor(layer.color) ?? 'rgba(128,128,128,.6)';
    const name = layer.pattern ?? 'dots';
    return (Object.prototype.hasOwnProperty.call(PATTERN_THUMBS, name) ? PATTERN_THUMBS[name] : PATTERN_THUMBS.dots)(ink);
  }
  return '';
}
