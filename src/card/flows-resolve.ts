import type { HomeAssistant, MagicCardConfig } from '../types';
import { flowKeys, flowModuleEntities } from '../utils/flow-keys';
import { resolveFlow, type ResolvedFlow } from '../utils/flow';
import { flowLookSlot } from './flow-look-slot';

/** The card's flows resolved for the overlay; undefined without a flow entry. */
export function resolveCardFlows(
  c: MagicCardConfig,
  entityConfig: MagicCardConfig,
  hass: HomeAssistant | undefined,
  label: (template: string) => string,
): ResolvedFlow[] | undefined {
  if (!Array.isArray(c.flows) || !c.flows.length) return undefined;
  const entities = flowModuleEntities(entityConfig);
  // The overlay keys a flow by id (data-flow): unique when ids are missing / repeated (the editor uses the same keys).
  const keys = flowKeys(c.flows);
  const look = flowLookSlot.get();
  const out = c.flows
    .map((f, i) => [f, i] as const)
    .filter(([f]) => f && typeof f === 'object')
    .map(([f, i]) => {
      const r = resolveFlow(f, hass, entities.get(f.from), i, look);
      r.id = keys[i];
      if (r.labelTemplate) {
        const text = label(r.labelTemplate);
        if (text) r.label = text;
      }
      return r;
    });
  return out.length ? out : undefined;
}
