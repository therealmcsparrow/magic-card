import type { HassEntity } from '../../types';
import type { AnimationDoc } from '../model';
import type { Binding, ClipWhen } from '../model-v2-core';
import type { PreviewChangeDetail } from '../slots';
import { t } from '../i18n';

// The preview's simulated entity: its animation entry drives clips and bindings from SIM_ENTITY, and the stage merges the
// simulated state into the hass it hands the card (withSimEntity). Fed by `preview-change` from stage-sim.ts.

/** Entity id of the preview's simulated entity (a light: on / off are its active states). */
export const SIM_ENTITY = 'light.mc_studio_preview';

/** `preview-change` event detail (slots.ts): state as text, value 0..1 across each binding's input range, the attributes the bindings read at it. */
export type { PreviewChangeDetail };

export interface PreviewSim {
  state: string;
  value: number;
  attributes: Record<string, unknown>;
}

/** The document has something the simulated entity drives (states or value bindings). */
export const simulates = (doc: AnimationDoc | undefined): boolean => (doc?.clips?.length ?? 0) > 0 || (doc?.bindings?.length ?? 0) > 0;

export const DEFAULT_SIM: PreviewSim = { state: 'on', value: 0.6, attributes: {} };

const r3 = (n: number): number => Math.round(n * 1000) / 1000;

/** A binding's raw input at 0..1 of its range. */
export const inputAt = (b: Binding, value: number): number => r3(b.input.min + (b.input.max - b.input.min) * Math.min(1, Math.max(0, value)));

/** The bindings and clips of a document read a number (an attribute, or the state itself). */
export function simNeeds(doc: AnimationDoc | undefined): { value: boolean; numericState: boolean; stateRange?: [number, number] } {
  const bindings = doc?.bindings ?? [];
  const stateBinding = bindings.find((b) => !b.input.attribute);
  const numericClip = (doc?.clips ?? []).some((c) => 'above' in c.when || 'below' in c.when);
  return {
    value: bindings.length > 0 || numericClip,
    numericState: !!stateBinding || numericClip,
    ...(stateBinding ? { stateRange: [stateBinding.input.min, stateBinding.input.max] as [number, number] } : {}),
  };
}

/** The attributes the document's bindings read, at `value` (0..1 of each range). */
export function simAttributes(doc: AnimationDoc | undefined, value: number): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const b of doc?.bindings ?? []) if (b.input.attribute && !(b.input.attribute in out)) out[b.input.attribute] = inputAt(b, value);
  return out;
}

/** The number a "Value" state is at `value` (the first state-reading binding's range, else 0..100). */
export function simNumericState(doc: AnimationDoc | undefined, value: number): string {
  const [min, max] = simNeeds(doc).stateRange ?? [0, 100];
  return String(r3(min + (max - min) * Math.min(1, Math.max(0, value))));
}

/** The simulated entity for a state, value and attributes. */
export function simEntity(sim: Partial<PreviewSim>): HassEntity {
  const now = new Date(0).toISOString();
  return {
    entity_id: SIM_ENTITY,
    state: sim.state ?? DEFAULT_SIM.state,
    attributes: { friendly_name: t('anim-studio.states-sim.preview'), ...(sim.attributes ?? {}) },
    last_changed: now,
    last_updated: now,
    context: { id: 'mc-studio-preview', parent_id: null, user_id: null },
  };
}

/** A hass with the simulated entity added to its states (a new object; the input is not changed). */
export function withSimEntity<T extends { states?: unknown }>(hass: T, sim: Partial<PreviewSim>): T {
  const states = (hass.states as Record<string, HassEntity> | undefined) ?? {};
  return { ...hass, states: { ...states, [SIM_ENTITY]: simEntity(sim) } };
}

/** Merge a `preview-change` detail into the current simulation. */
export function applyPreviewChange(sim: PreviewSim, d: PreviewChangeDetail): PreviewSim {
  return {
    state: d.state ?? sim.state,
    value: d.value ?? sim.value,
    attributes: d.attributes ?? sim.attributes,
  };
}

/** A clip condition in words ("State is on", "Value above 20"). */
export function whenLabel(w: ClipWhen): string {
  if ('state' in w) return t('anim-studio.states-sim.state-is-state', { state: w.state });
  if ('state_not' in w) return t('anim-studio.states-sim.state-is-not-state-not', { state_not: w.state_not });
  if ('entity_on' in w) return w.entity_on ? t('anim-studio.states-sim.entity-is-on') : t('anim-studio.states-sim.entity-is-off');
  if ('above' in w) return t('anim-studio.states-sim.value-above-above', { above: w.above });
  return t('anim-studio.states-sim.value-below-below', { below: w.below });
}
