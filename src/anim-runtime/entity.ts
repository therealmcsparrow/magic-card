import type { HassEntity } from '../types';

// Entity reads of the runtime chunk, same rules as src/utils/entity-value.ts (isUnavailable, entityNumber).
// Kept here so the chunk imports no card module, each of which would have to be exposed by magic-card.js.

const UNAVAILABLE = new Set(['unavailable', 'unknown']);

/** No entity, or its state is unavailable / unknown. */
export const isUnavailable = (s: HassEntity | undefined): boolean => !s || UNAVAILABLE.has(s.state);

/** The state or an attribute as a finite number, else undefined. */
export function entityNumber(s: HassEntity | undefined, attribute?: string): number | undefined {
  if (!s) return undefined;
  const raw = attribute ? s.attributes?.[attribute] : s.state;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/** States that are never "on" (as src/utils/entity-color.ts); the card passes the domain-aware answer. */
const INACTIVE = new Set(['off', 'unavailable', 'unknown', 'idle', 'standby']);
export const simplyActive = (s: HassEntity | undefined): boolean => !!s && !INACTIVE.has(s.state);
