import { ENTITY_SOURCE_KIND, type EntityLayoutType, type EntitySourceInfo, type EntitySourceKind } from '../contracts/entity-scope';
import { ModuleRegistry } from '../modules/module-registry';
import type { CardModule, MagicCardConfig } from '../types';
import { childAt } from '../utils/module-path';
import { childScope, effectiveEntity, entityKey } from '../utils/entity-scope';
import type { ModuleSelection } from './studio/selection';

/**
 * What the editor shows for one module's entity: built only from the card's own resolver functions
 * (src/utils/entity-scope.ts), so the editor and the dashboard cannot disagree (contract entity-scope 1.0.0).
 */
export function resolveEntitySource(config: MagicCardConfig, sel: Pick<ModuleSelection, 'row' | 'col' | 'module' | 'child'>): EntitySourceInfo {
  let mod: CardModule | undefined = config.rows?.[sel.row]?.columns?.[sel.col]?.modules?.[sel.module];
  const cardKey = entityKey(config.entity);
  let up = typeof cardKey === 'string' ? cardKey : undefined;
  let from: { id: string; from: EntitySourceKind } | undefined = up ? { id: up, from: 'card' } : undefined;
  let walled = false;
  for (const step of sel.child ?? []) {
    if (!mod) break;
    const key = entityKey(mod.entity);
    const next = childScope(mod, up);
    if (key === null) {
      walled = true;
      from = undefined;
    } else if (key && mod.share_entity === true) {
      walled = false;
      from = { id: key, from: ENTITY_SOURCE_KIND[mod.type as EntityLayoutType] ?? 'row' };
    }
    up = next;
    mod = childAt(mod, step);
  }
  const own = mod?.entity;
  const key = entityKey(own);
  const inherit = mod ? ModuleRegistry.get(mod.type)?.metadata.inherit : undefined;
  const info: EntitySourceInfo = { choice: key === undefined ? 'inherit' : key === null ? 'none' : 'own' };
  info.effective = mod ? effectiveEntity(mod, up, inherit) : undefined;
  if (inherit === false) info.cardModule = true;
  else {
    if (inherit) info.domains = inherit;
    if (from && up) info.inherited = from;
    if (walled && !up) info.walled = true;
    if (info.inherited && info.domains && !info.domains.includes(info.inherited.id.split('.')[0])) info.mismatch = true;
  }
  if (typeof key === 'string' && !key.includes('.')) info.invalidOwn = true;
  return info;
}
