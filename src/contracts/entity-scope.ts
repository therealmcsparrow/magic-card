// Contract: entity scope (card entity, layout sharing, effective module entity). Version 1.1.0. Rules: the nearest
// layout supplies the entity (only when it shares); the card entity is per card and never synced; a mismatch is
// silent, with an editor hint; card modules never inherit; `none` on a layout is a wall.

export const ENTITY_SCOPE_CONTRACT = '1.1.0';

/** (1.1.0) The keys a card grid row, column or row-module column holds beside a layout module. */
export interface EntityScopeNode {
  entity?: string;
  share_entity?: boolean;
}

/** Layout module types that may share their own entity with their children. */
export type EntityLayoutType = 'horizontal' | 'vertical' | 'row' | 'tabs' | 'slider-layout';

/** entityKey(): own id, `null` for none, `undefined` for inherit. */
export type EntityKey = string | null | undefined;

/** MagicModuleMetadata.inherit */
export type EntityInherit = false | readonly string[];

/** src/utils/entity-scope.ts */
export interface EntityScopeApi {
  entityKey(value: unknown): EntityKey;
  childScope(layout: { entity?: unknown; share_entity?: unknown }, up: string | undefined): string | undefined;
  effectiveEntity(module: { entity?: unknown }, up: string | undefined, inherit?: EntityInherit): string | undefined;
  /** Variables for a Jinja template; undefined when it mentions neither name. */
  templateVars(template: string, entity: string | undefined, cardEntity: string | undefined): Record<string, string> | undefined;
}

/** Where an inherited entity comes from (editor labels "Same as card / row / column / tabs"). */
export type EntitySourceKind = 'card' | 'row' | 'column' | 'tabs' | 'slides';

/** Layout type -> source kind label. */
export const ENTITY_SOURCE_KIND: Record<EntityLayoutType, EntitySourceKind> = {
  horizontal: 'row',
  row: 'row',
  vertical: 'column',
  tabs: 'tabs',
  'slider-layout': 'slides',
};

/** What the editor shows for one module (module-editor 1.2.0 passes it to every tab). */
export interface EntitySourceInfo {
  /** What the YAML says. */
  choice: 'inherit' | 'own' | 'none';
  /** The module's effective entity on the dashboard. */
  effective?: string;
  /** What "Same as ..." would give here (nearest sharing layout, else the card), and its source. */
  inherited?: { id: string; from: EntitySourceKind; path?: string };
  /** A layout above has `entity: none`: nothing reaches this module unless it picks its own. */
  walled?: boolean;
  /** Inherited id exists but the module's domain list rejects it (dashboard: no entity). */
  mismatch?: boolean;
  /** MagicModuleMetadata.inherit === false. */
  cardModule?: boolean;
  /** MagicModuleMetadata.inherit when it is a list. */
  domains?: readonly string[];
  /** Own id that is not an entity id (no dot), e.g. `None`. */
  invalidOwn?: boolean;
}
