import { ENTITY_SOURCE_KIND, type EntityInherit, type EntityLayoutType, type EntitySourceInfo, type EntitySourceKind } from '../contracts/entity-scope';
import { ModuleRegistry } from '../modules/module-registry';
import type { CardModule, MagicCardConfig } from '../types';
import { childSlots } from '../utils/module-path';
import { moduleEditors } from './modules/registry';
import { childScope, effectiveEntity, entityKey } from '../utils/entity-scope';
import type { ModuleSelection } from './studio/selection';

interface Src {
  id: string;
  from: EntitySourceKind;
}
/** The scope while walking down: the entity in force, who gave it, and whether a `none` above walls it off. */
interface Scope {
  up?: string;
  from?: Src;
  walled?: boolean;
}
type Node = { entity?: unknown; share_entity?: unknown };

/** The scope below a node (a grid row or column, a layout module): the same rules as the dashboard's childScope. */
function enter(node: Node, s: Scope, kind: EntitySourceKind): Scope {
  const key = entityKey(node.entity);
  const up = childScope(node, s.up);
  if (key === null) return { up, walled: true };
  if (key && node.share_entity === true) return { up, from: { id: key, from: kind } };
  return { ...s, up };
}

/** What the card passes down, then (when given) the row and the column. */
function gridScope(config: MagicCardConfig, row?: number, col?: number): Scope {
  const cardKey = entityKey(config.entity);
  const up = typeof cardKey === 'string' ? cardKey : undefined;
  let s: Scope = { up, from: up ? { id: up, from: 'card' } : undefined };
  const r = row === undefined ? undefined : config.rows?.[row];
  if (r) s = enter(r, s, 'row');
  const c = col === undefined ? undefined : r?.columns?.[col];
  return c ? enter(c, s, 'column') : s;
}

/** Down the layout modules to the one at the end of `child`, entering each (and a row module's column). */
function descend(mod: CardModule | undefined, child: ReadonlyArray<{ slot: number; index: number }> | undefined, s: Scope): { mod?: CardModule; s: Scope } {
  for (const step of child ?? []) {
    if (!mod) break;
    s = enter(mod, s, ENTITY_SOURCE_KIND[mod.type as EntityLayoutType] ?? 'row');
    // a row module's column is a node of its own
    const nested = mod.type === 'row' ? (mod as { columns?: Node[] }).columns?.[step.slot] : undefined;
    if (nested) s = enter(nested, s, 'column');
    mod = childSlots(mod)?.[step.slot]?.[step.index]; // childSlots is already in magic-card.js; childAt would add an export to it
  }
  return { mod, s };
}

/** The node's own choice (what the YAML says) and what the module or container ends up with. */
function describe(node: Node | undefined, s: Scope, inherit?: EntityInherit): EntitySourceInfo {
  const key = entityKey(node?.entity);
  const info: EntitySourceInfo = { choice: key === undefined ? 'inherit' : key === null ? 'none' : 'own' };
  info.effective = node ? effectiveEntity(node, s.up, inherit) : undefined;
  if (inherit === false) info.cardModule = true;
  else {
    if (inherit) info.domains = inherit;
    if (s.from && s.up) info.inherited = s.from;
    if (s.walled && !s.up) info.walled = true;
    if (info.inherited && info.domains && !info.domains.includes(info.inherited.id.split('.')[0])) info.mismatch = true;
  }
  if (typeof key === 'string' && !key.includes('.')) info.invalidOwn = true;
  return info;
}

/**
 * What the editor shows for one module's entity: built only from the card's own resolver functions
 * (src/utils/entity-scope.ts), so the editor and the dashboard cannot disagree (contract entity-scope 1.1.0).
 */
export function resolveEntitySource(config: MagicCardConfig, sel: Pick<ModuleSelection, 'row' | 'col' | 'module' | 'child'>): EntitySourceInfo {
  const top = config.rows?.[sel.row]?.columns?.[sel.col]?.modules?.[sel.module];
  const { mod, s } = descend(top, sel.child, gridScope(config, sel.row, sel.col));
  return describe(mod, s, mod ? ModuleRegistry.get(mod.type)?.metadata.inherit : undefined);
}

/** The entity choice of a grid row, a grid column or a row module's column (`slot`), seen from the node above it. */
export function resolveContainerSource(
  config: MagicCardConfig,
  at: { row: number; col?: number; module?: number; child?: ReadonlyArray<{ slot: number; index: number }>; slot?: number },
): EntitySourceInfo {
  const row = config.rows?.[at.row];
  if (at.slot === undefined) return describe(at.col === undefined ? row : row?.columns?.[at.col], gridScope(config, at.col === undefined ? undefined : at.row));
  const top = row?.columns?.[at.col!]?.modules?.[at.module!];
  const owner = descend(top, at.child, gridScope(config, at.row, at.col));
  const s = owner.mod ? enter(owner.mod, owner.s, ENTITY_SOURCE_KIND[owner.mod.type as EntityLayoutType] ?? 'row') : owner.s;
  return describe((owner.mod as { columns?: Node[] } | undefined)?.columns?.[at.slot], s);
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
