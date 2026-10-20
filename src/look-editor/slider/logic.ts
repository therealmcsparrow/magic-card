import { SLIDER_LOOK_DEFAULTS } from '../../contracts/slider-look.defaults';
import { SLIDER_LOOK_KEYS } from '../../contracts/slider-look.needs';
import type { SliderStop } from '../../contracts/slider-look';
import { SLIDER_LOOK_EXISTING_KEYS, type SliderPresetId } from '../../contracts/look-editor';
import type { SliderModuleConfig } from '../../types';
import { SLIDER_PRESETS } from './presets';

/*
 * Pure rules of the slider look editor (contract look-editor 1.0.0 r2, element rules 1 to 5; designer 12). No DOM.
 * Every function returns a new object and never touches the one it is given (the host keeps it as the Undo snapshot).
 */

type Cfg = SliderModuleConfig;
type Bag = Record<string, unknown>;

export const MAX_STOPS = SLIDER_LOOK_DEFAULTS.max_stops;
const LOOK_KEYS = SLIDER_LOOK_KEYS as readonly string[];
const UNIVERSE = [...LOOK_KEYS, ...(SLIDER_LOOK_EXISTING_KEYS as readonly string[])];

const defaultOf = (k: string): string | number | boolean | undefined => {
  const d = (SLIDER_LOOK_DEFAULTS as Bag)[k];
  return typeof d === 'string' || typeof d === 'boolean' ? d : undefined;
};
/** The value the card renders for a key: the key, else the contract default of a flat key. */
const effective = (c: Bag, k: string): unknown => c[k] ?? defaultOf(k);
const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** A copy of the config with these keys changed (undefined removes the key). */
export function withKeys(c: Cfg, patch: Bag): Cfg {
  const next: Bag = { ...c };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete next[k];
    else next[k] = v;
  }
  return next as Cfg;
}

/** Number of keys that differ between two configs (look keys and the colours presets may write). */
export const changedCount = (a: Cfg, b: Cfg): number => UNIVERSE.filter((k) => !same((a as Bag)[k], (b as Bag)[k])).length;

export const hasLookKeys = (c: Cfg): boolean => LOOK_KEYS.some((k) => (c as Bag)[k] !== undefined);

/** Preset: removes every look key and the preset's own colour keys, then writes the preset's values (rule 3). */
export function applyPreset(c: Cfg, id: SliderPresetId): Cfg {
  const p = SLIDER_PRESETS.find((x) => x.id === id);
  if (!p) return c;
  const next: Bag = { ...c };
  for (const k of LOOK_KEYS) delete next[k];
  for (const k of Object.keys(p.values)) delete next[k];
  return { ...next, ...p.values } as Cfg;
}

/** Reset look: every look key goes; entity, range, direction, show_value and the two colours stay (rule 3). */
export function resetLook(c: Cfg): Cfg {
  const next: Bag = { ...c };
  for (const k of LOOK_KEYS) delete next[k];
  return next as Cfg;
}

export type LookStatus = { kind: 'default' } | { kind: 'preset'; id: SliderPresetId } | { kind: 'custom'; from?: SliderPresetId };

/** Chip and status text come from the keys (nothing is stored): exact preset, nearest one (at least half equal), own, default. */
export function lookStatus(c: Cfg): LookStatus {
  if (!hasLookKeys(c)) return { kind: 'default' };
  let best: { id: SliderPresetId; hits: number; total: number } | undefined;
  for (const p of SLIDER_PRESETS) {
    const keys = Object.keys(p.values);
    const hits = keys.filter((k) => same(effective(c as Bag, k), effective(p.values as Bag, k))).length;
    const exact =
      hits === keys.length && LOOK_KEYS.every((k) => same(effective(c as Bag, k), effective(p.values as Bag, k)));
    if (exact) return { kind: 'preset', id: p.id };
    if (!best || hits > best.hits) best = { id: p.id, hits, total: keys.length };
  }
  return best && best.hits * 2 >= best.total && best.hits > 0 ? { kind: 'custom', from: best.id } : { kind: 'custom' };
}

// ── value display (rule: show_value / value_position stay in sync) ──

export type ValuePosition = 'beside' | 'bubble' | 'track' | 'hidden';

export const valueHidden = (c: Cfg): boolean => c.show_value === false || c.value_position === 'hidden';
export const valuePosition = (c: Cfg): ValuePosition => (valueHidden(c) ? 'hidden' : (c.value_position ?? 'beside'));

/** Hidden writes show_value: false; any position removes show_value; beside is the default and removes its key. */
export const positionPatch = (pos: ValuePosition): Bag =>
  pos === 'hidden' ? { value_position: 'hidden', show_value: false } : { value_position: pos === 'beside' ? undefined : pos, show_value: undefined };

/**
 * Handle choice. None with the value hidden switches Where to Beside (the caller says so); the line handle is the
 * default and removes its key. `movedValue` tells the caller the toast text is needed.
 */
export function thumbPatch(c: Cfg, thumb: NonNullable<Cfg['thumb']>): { patch: Bag; movedValue: boolean } {
  const movedValue = thumb === 'none' && valueHidden(c);
  return { patch: { thumb: thumb === 'line' ? undefined : thumb, ...(movedValue ? positionPatch('beside') : {}) }, movedValue };
}

/** Hidden is refused while the handle is None (nothing would show the level). */
export const hiddenRefused = (c: Cfg, pos: ValuePosition): boolean => pos === 'hidden' && c.thumb === 'none';

/** A hidden value with no handle (or a track under 10 px): the level can only be read from the fill (YAML may say so). */
export const levelUnreadable = (c: Cfg): boolean => {
  if (!valueHidden(c)) return false;
  if (c.thumb === 'none') return true;
  const style = c.track_style ?? 'standard';
  const thickness = c.track_thickness ?? (SLIDER_LOOK_DEFAULTS.track_thickness as Record<string, number>)[style];
  return thickness < 10;
};

// ── stops (P4) ──

export const readStops = (c: Cfg): SliderStop[] => (Array.isArray(c.stops) ? c.stops.filter((s) => s && typeof s === 'object') : []);

export const sortStops = (s: SliderStop[]): SliderStop[] => [...s].sort((a, b) => a.value - b.value);

/** n stops evenly from min to max (n clamped to 2..12), rounded to 2 decimals. */
export function evenStops(min: number, max: number, n: number): SliderStop[] {
  const count = Math.min(MAX_STOPS, Math.max(2, Math.round(n)));
  return Array.from({ length: count }, (_x, i) => ({ value: Math.round((min + ((max - min) * i) / (count - 1)) * 100) / 100 }));
}

/** The next stop value for "Add stop": a step beyond the last one, kept in range. */
export function nextStopValue(stops: SliderStop[], min: number, max: number, step: number): number {
  if (!stops.length) return min;
  const top = Math.max(...stops.map((s) => s.value));
  return Math.min(max, top + Math.max(step, (max - min) / 4));
}

export const stopInRange = (s: SliderStop, min: number, max: number): boolean => Number.isFinite(s.value) && s.value >= min && s.value <= max;

/** The segmented control's number of the first stop label on the card (8 characters). */
export const STOP_LABEL_CHARS = 8;
