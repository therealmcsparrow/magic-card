import { MAX_BACKGROUND_LAYERS, type BackgroundLayerConfig, type BgLayerStatus, type BgLayerType } from '../../contracts/bg-stack';
import { BLUR_MAX } from '../../contracts/layer-placement';
import type { HomeAssistant } from '../../types';
import { mediaSrc } from '../../utils/media';
import { safeColor } from '../../utils/animation';
import { parseGradient } from '../../utils/gradient';
import { m, t } from '../i18n';
import { getStatus } from './bg-status';

/*
 * Pure model of the Card backdrop group (designer 03 section 4, 11 B, E, F, K). `background_layers`: first
 * entry = front, at most MAX_BACKGROUND_LAYERS. Every function returns new data; nothing mutates a layer.
 */

export const LAYER_TYPES: ReadonlyArray<{ value: BgLayerType; label: ReturnType<typeof m>; icon: string }> = [
  { value: 'image', label: m('Image'), icon: 'mdi:image-outline' },
  { value: 'gradient', label: m('Gradient'), icon: 'mdi:gradient-vertical' },
  { value: 'pattern', label: m('Pattern'), icon: 'mdi:dots-grid' },
  { value: 'color', label: m('Colour'), icon: 'mdi:palette-outline' },
];

export const LIMIT_TEXT = m('Limit of 4 layers reached. More layers slow down older wall tablets. Remove one to add another.');

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

export function layerSummary(layer: BackgroundLayerConfig): { type: ReturnType<typeof m>; detail?: string } {
  const type = LAYER_TYPES.find((x) => x.value === layer.type)?.label ?? m('Image');
  let detail: string | undefined;
  if (layer.type === 'image') {
    detail = layer.entity || (layer.image ? layer.image.split('/').pop() : undefined) || undefined;
  } else if (layer.type === 'pattern') detail = layer.pattern;
  else if (layer.type === 'color') detail = layer.color;
  return detail ? { type, detail } : { type };
}

export const staleMinutes = (seconds: number): number => Math.max(1, Math.ceil(seconds / 60));

/** The designer's sentence for a layer status; undefined when there is nothing to say. */
export function statusSentence(s: BgLayerStatus, layer: BackgroundLayerConfig | undefined): string | undefined {
  const detail = s.detail === undefined ? '' : String(s.detail);
  switch (s.reason) {
    case 'entity-missing': return t('Entity not found: {id}. The next layer is shown instead.', { id: detail });
    case 'no-picture': return t('{id} has no picture attribute. Try another attribute.', { id: detail });
    case 'no-state-image':
      return layer?.image
        ? t('No picture for state {state}. The Any other state picture is used.', { state: detail })
        : t('No picture for state {state}. No Any other state picture is set, so the next layer is shown.', { state: detail });
    case 'load-failed': return t('The picture could not be loaded. The next layer is shown.');
    case 'snapshot-failed': return t('Snapshot failed. The last good frame stays visible.');
    case 'stale': return t('Not updated {n} min', { n: staleMinutes(Number(s.detail) || 0) });
    default: return undefined;
  }
}

// ── rule view ──

/** "Change backgrounds in this rule": the normal layers, copied in. */
export function startRuleLayers(normal: readonly BackgroundLayerConfig[] | undefined): BackgroundLayerConfig[] {
  return normal ? (JSON.parse(JSON.stringify(normal)) as BackgroundLayerConfig[]) : [];
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
    return (PATTERN_THUMBS[layer.pattern ?? 'dots'] ?? PATTERN_THUMBS.dots)(ink);
  }
  return '';
}

/** A card with a layer that fell back: the group header shows a warning mark. */
export function backdropHasProblem(layers: readonly BackgroundLayerConfig[] | undefined): boolean {
  return (layers ?? []).some((l, i) => {
    const s = getStatus(i);
    return !!s && !l.hidden && s.status === 'error' && s.reason !== 'stale';
  });
}
