import { ENTITY_SOURCE_KIND, type EntityLayoutType, type EntitySourceInfo, type EntitySourceKind } from '../contracts/entity-scope';
import { ModuleRegistry } from '../modules/module-registry';
import type { CardModule, MagicCardConfig } from '../types';
import { childSlots } from '../utils/module-path';
import { moduleEditors } from './modules/registry';
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
    mod = childSlots(mod)?.[step.slot]?.[step.index]; // childSlots is already in magic-card.js; childAt would add an export to it
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

/** Whether the module type takes an entity at all (its editor draws the entity field itself). */
export function takesEntity(type: string): boolean {
  return moduleEditors.get(type as never)?.entityField === true;
}

/** A static text module (no Use entity, no entity or card_entity in its template) ignores the entity it could follow. */
export function ignoresEntity(mod: CardModule): boolean {
  const m = mod as { use_entity?: boolean; use_template?: boolean; text?: string };
  return mod.type === 'text' && !m.use_entity && !(m.use_template && /entity/.test(m.text ?? ''));
}

/** Every module of the card, with the selection that points at it. */
function walk(config: MagicCardConfig, visit: (mod: CardModule, sel: Pick<ModuleSelection, 'row' | 'col' | 'module' | 'child'>) => void): void {
  const down = (mod: CardModule, row: number, col: number, module: number, child: Array<{ slot: number; index: number }>) => {
    visit(mod, { row, col, module, child });
    childSlots(mod)?.forEach((list, slot) => list.forEach((kid, index) => down(kid, row, col, module, [...child, { slot, index }])));
  };
  (config.rows ?? []).forEach((r, row) => r.columns?.forEach((c, col) => c.modules?.forEach((m, module) => down(m, row, col, module, []))));
}

/**
 * The Card entity field's lines: modules that follow the card entity, modules that need another kind of
 * device, and the domains the card's modules need (listed first in the picker).
 */
export function entityStats(config: MagicCardConfig): { following: number; needing: number; preferred: string[] } {
  const out = { following: 0, needing: 0, preferred: [] as string[] };
  const has = typeof entityKey(config.entity) === 'string';
  walk(config, (mod, sel) => {
    if (!takesEntity(mod.type) || ignoresEntity(mod)) return;
    const i = resolveEntitySource(config, sel);
    if (i.domains) out.preferred.push(...i.domains);
    if (!has || i.choice !== 'inherit' || i.cardModule) return;
    if (i.mismatch) out.needing++;
    else if (i.inherited?.from === 'card') out.following++;
  });
  out.preferred = [...new Set(out.preferred)];
  return out;
}

/** The domains the modules of a template need (listed first in the picker). */
export function templateDomains(modules: ReadonlyArray<CardModule>): string[] {
  const out = new Set<string>();
  const add = (mod: CardModule) => {
    const d = ModuleRegistry.get(mod.type)?.metadata.inherit;
    if (d) d.forEach((x) => out.add(x));
    (childSlots(mod) ?? []).forEach((list) => list.forEach(add));
  };
  modules.forEach(add);
  return [...out];
}

/** Whether a template's modules include one that would follow a card entity (no entity of its own, takes an entity, not a card module). */
export function templateFollows(modules: ReadonlyArray<CardModule>): boolean {
  const check = (mod: CardModule): boolean =>
    (takesEntity(mod.type) && entityKey(mod.entity) === undefined && ModuleRegistry.get(mod.type)?.metadata.inherit !== false) ||
    (childSlots(mod) ?? []).some((list) => list.some(check));
  return modules.some(check);
}
