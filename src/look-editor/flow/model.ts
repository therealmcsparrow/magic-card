import type { FlowConfig } from '../../types';
import { FLOW_LOOK_KEYS, hasFlowLook } from '../../contracts/flow-look';
import { FLOW_LOOK_EXISTING_KEYS, type FlowPreset } from '../../contracts/look-editor';
import { FLOW_PRESETS } from '../presets';

/*
 * Pure logic of <mc-flow-look-editor>: which keys it owns, the colour and spacing modes (the contract's precedence),
 * presets, Reset look, the change count and the status line. Nothing here touches the DOM or writes on its own.
 */
type Rec = Record<string, unknown>;
const rec = (f: FlowConfig): Rec => f as unknown as Rec;

/** Every key the editor may write or remove (look keys plus the existing ones of the Look group). */
export const OWN_KEYS: readonly string[] = [...FLOW_LOOK_KEYS, ...FLOW_LOOK_EXISTING_KEYS];

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** `patch` over the flow; an undefined, empty or NaN value removes its key. */
export function withKeys(f: FlowConfig, patch: Rec): FlowConfig {
  const next: Rec = { ...rec(f), ...patch };
  for (const k of Object.keys(patch)) {
    const v = next[k];
    if (v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))) delete next[k];
  }
  return next as unknown as FlowConfig;
}

export type ColourMode = 'single' | 'gradient' | 'value';
export type SpacingMode = 'even' | 'pixels' | 'random';

/** The contract's precedence: color_mode, else thresholds, else color_to, else single. */
export const colourMode = (f: FlowConfig): ColourMode =>
  f.color_mode ?? (Array.isArray(f.thresholds) && f.thresholds.length ? 'value' : f.color_to !== undefined ? 'gradient' : 'single');

export const spacingMode = (f: FlowConfig): SpacingMode => f.spacing_mode ?? (f.spacing !== undefined ? 'pixels' : 'even');

/** Keys of a colour mode other than the active one that are set (kept in the file, not used). */
export function unusedColourKeys(f: FlowConfig): Array<'color_to' | 'thresholds'> {
  const mode = colourMode(f);
  const out: Array<'color_to' | 'thresholds'> = [];
  if (mode !== 'gradient' && f.color_to !== undefined) out.push('color_to');
  if (mode !== 'value' && f.thresholds !== undefined) out.push('thresholds');
  return out;
}

export const lookKeysSet = (f: FlowConfig): boolean => hasFlowLook(f);

/** Keys that differ between two flows, among the ones the editor owns (written plus removed plus changed). */
export function changeCount(a: FlowConfig, b: FlowConfig): number {
  return OWN_KEYS.filter((k) => !same(rec(a)[k], rec(b)[k])).length;
}

/** A preset removes every look key plus the existing keys it lists, then writes its values; no preset key is stored. */
export function applyPreset(f: FlowConfig, p: FlowPreset): FlowConfig {
  const next: Rec = { ...rec(f) };
  for (const k of FLOW_LOOK_KEYS) delete next[k];
  for (const [k, v] of Object.entries(p.values)) {
    delete next[k];
    if (k === 'tube_fill_value' && !f.entity) continue; // the level follows a value: only with an entity
    next[k] = JSON.parse(JSON.stringify(v));
  }
  return next as unknown as FlowConfig;
}

/** Reset look: every look key and the existing keys of the Look group; never Connection, Value and route, Label, Visibility. */
export function resetLook(f: FlowConfig): FlowConfig {
  const next: Rec = { ...rec(f) };
  for (const k of OWN_KEYS) delete next[k];
  return next as unknown as FlowConfig;
}

export type LookStatus = { kind: 'default' } | { kind: 'preset'; preset: FlowPreset } | { kind: 'started'; preset: FlowPreset } | { kind: 'own' };

/** The preset's keys that apply to this flow (the Water level needs an entity). */
const keysOf = (f: FlowConfig, p: FlowPreset): string[] => Object.keys(p.values).filter((k) => k !== 'tube_fill_value' || !!f.entity);

/** No look keys: default; all keys of a preset equal and no other look key: that preset; at least half equal: started from it. */
export function lookStatus(f: FlowConfig): LookStatus {
  if (!hasFlowLook(f)) return { kind: 'default' };
  let best: FlowPreset | undefined;
  let bestN = 0;
  for (const p of FLOW_PRESETS) {
    const keys = keysOf(f, p);
    const n = keys.filter((k) => same(rec(f)[k], (p.values as Rec)[k])).length;
    const extra = FLOW_LOOK_KEYS.some((k) => rec(f)[k] !== undefined && !keys.includes(k));
    if (n === keys.length && !extra) return { kind: 'preset', preset: p };
    if (n > bestN && n * 2 >= keys.length) [best, bestN] = [p, n];
  }
  return best ? { kind: 'started', preset: best } : { kind: 'own' };
}

/** The preset that is applied exactly, for the chip group's value. */
export const appliedPreset = (f: FlowConfig): string | undefined => {
  const s = lookStatus(f);
  return s.kind === 'preset' ? s.preset.id : undefined;
};
