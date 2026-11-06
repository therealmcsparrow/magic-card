// Not-updated face: which watched entity has been quiet longer than its quiet_time, and when the next one turns quiet.

import type { StatusFace } from '../contracts/card-status';
import { quietMs } from '../contracts/card-status.needs';
import type { HassEntity, HomeAssistant } from '../types';

/** One watched entity and the quiet time written next to it. */
export interface Quiet {
  entity: string;
  ms: number;
}

const MAX_NODES = 5000;

/** Every `entity` + `quiet_time` pair written on the same node, anywhere in the config; unreadable ones are skipped. */
export function collectQuiet(node: unknown, out: Quiet[] = [], budget = { n: MAX_NODES }): Quiet[] {
  if (!node || typeof node !== 'object' || budget.n-- <= 0) return out;
  const o = node as Record<string, unknown>;
  if (!Array.isArray(node) && typeof o.entity === 'string') {
    const ms = quietMs(o.quiet_time);
    if (ms !== undefined) out.push({ entity: o.entity, ms });
  }
  for (const v of Object.values(o)) collectQuiet(v, out, budget);
  return out;
}

/** Epoch ms of an entity's last update; undefined when missing or unreadable. Home Assistant never pushes last_reported to cards. */
export function lastUpdate(entity: HassEntity | undefined): number | undefined {
  const raw = entity && typeof entity === 'object' ? entity.last_updated : undefined;
  const ms = typeof raw === 'string' ? Date.parse(raw) : NaN;
  return Number.isFinite(ms) ? ms : undefined;
}

const stateOf = (hass: HomeAssistant | undefined, id: string): HassEntity | undefined =>
  hass?.states && Object.prototype.hasOwnProperty.call(hass.states, id) ? hass.states[id] : undefined;

/** The oldest entity quiet for longer than its quiet_time, or undefined. A future or unreadable time is never stale. */
export function staleFace(pairs: readonly Quiet[], hass: HomeAssistant | undefined, now: number = Date.now()): StatusFace | undefined {
  let oldest: Extract<StatusFace, { kind: 'stale' }> | undefined;
  for (const p of pairs) {
    const ts = lastUpdate(stateOf(hass, p.entity));
    if (ts === undefined || ts > now || now - ts <= p.ms) continue;
    if (!oldest || ts < oldest.since) oldest = { kind: 'stale', entity: p.entity, since: ts };
  }
  return oldest;
}

/** The first moment after the nearest deadline still ahead, or undefined when nothing can turn quiet. */
export function nextStaleAt(pairs: readonly Quiet[], hass: HomeAssistant | undefined, now: number = Date.now()): number | undefined {
  let next: number | undefined;
  for (const p of pairs) {
    const ts = lastUpdate(stateOf(hass, p.entity));
    if (ts !== undefined && ts + p.ms >= now) next = Math.min(next ?? Infinity, ts + p.ms + 1);
  }
  return next;
}
