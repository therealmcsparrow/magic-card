import type { AnimationConfig, HassEntity } from '../types';
import { isEntityActive } from './entity-color';
import { str } from './safe-css';

/*
 * The play condition of an animation entry (not animation-specific: the ring's show condition uses it too). Plain
 * code, kept in the entry while the animation resolve is a lazy chunk.
 */

/**
 * Whether the entry plays (`always` when no trigger is set). The condition reads `trigger_entity`
 * from `states` when set, else `stateObj` (the module's entity; none for a card / row / column).
 */
export function animationTriggerActive(
  entry: Pick<AnimationConfig, 'trigger' | 'trigger_entity' | 'state'>,
  stateObj?: HassEntity,
  states?: Record<string, HassEntity>,
): boolean {
  const own = str(entry.trigger_entity);
  if (own) stateObj = states?.[own];
  switch (entry.trigger) {
    case 'entity_on':
      return isEntityActive(stateObj);
    case 'state': {
      const want = (entry.state || '').trim();
      return !!want && !!stateObj && stateObj.state === want;
    }
    default:
      return true;
  }
}
