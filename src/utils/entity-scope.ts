import type { EntityInherit, EntityKey } from '../contracts/entity-scope';

/** Contract entity-scope 1.0.0: own id, null for `none`, undefined for inherit. */
export function entityKey(value: unknown): EntityKey {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || text === '~') return undefined;
  return text === 'none' && value === text ? null : (value as string);
}

/** What a layout hands down to its children. */
export function childScope(
  layout: { entity?: unknown; share_entity?: unknown },
  up: string | undefined,
): string | undefined {
  const key = entityKey(layout.entity);
  if (key === null) return undefined;
  return key && layout.share_entity === true ? key : up;
}

/** A module's effective entity given the scope above it and its metadata.inherit. */
export function effectiveEntity(
  module: { entity?: unknown },
  up: string | undefined,
  inherit?: EntityInherit,
): string | undefined {
  const key = entityKey(module.entity);
  if (key !== undefined) return key ?? undefined;
  if (inherit === false || (inherit && !inherit.includes((up ?? '').split('.')[0]))) return undefined;
  return up;
}

/** Jinja variables: only names the template mentions, so other templates keep their cache key. */
export function templateVars(
  template: string,
  entity: string | undefined,
  cardEntity: string | undefined,
): Record<string, string> | undefined {
  const vars: Record<string, string> = {};
  if (/\bentity\b/.test(template)) vars.entity = entity ?? '';
  if (template.includes('card_entity')) vars.card_entity = cardEntity ?? '';
  return vars.entity === undefined && vars.card_entity === undefined ? undefined : vars;
}
