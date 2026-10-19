/*
 * Contract: entity scope (card entity, layout sharing, effective module entity). Version 1.0.0
 * (Architect-owned). ADR 0033. Brief .company/work/card-entity/01-product-manager.md, plan 02-architect.md.
 * CEO rulings 2026-10-19: Q1 nearest layout (only when it shares, see C), Q2 per card / never synced,
 * Q3 silent mismatch + editor hint, card modules never inherit, B `none` on a layout is a wall.
 *
 * ── YAML (types in src/types.ts) ──
 * - Card: `entity?: string`. Per card; never part of a Magic Card Utils template (stripped on save,
 *   dropped from the template on merge and on load; applying a template keeps the card's own).
 * - Module (any type): `entity`. Read with entityKey():
 *     key absent, null, ~, '', whitespace-only, any non-string  -> inherit
 *     exactly 'none' (no trimming, case-sensitive)              -> none
 *     any other string                                          -> own id, used exactly as written
 *   (`None`, `NONE`, `' none '` are own ids that resolve to nothing; the editor flags them.)
 * - Layout modules (horizontal, vertical, row, tabs, slider-layout): `share_entity?: boolean`.
 *   Absent = false. The card editor writes `share_entity: true` on every layout it creates (one
 *   create path in the editor chunk); YAML written before this release has no key, so its layouts
 *   never pass their own entity down (AC1 holds).
 * - Card grid rows and columns, nested columns of the row module, tab entries: no own entity in 1.0.0;
 *   the scope passes through them unchanged.
 *
 * ── Resolution (src/utils/entity-scope.ts, in magic-card.js, pure) ──
 * scope(card)                = entityKey(card.entity) as a string, else undefined
 * childScope(layout, up)     = none -> undefined (wall, rule B; regardless of share_entity)
 *                              own id && share_entity === true -> own id
 *                              otherwise -> up
 * effective(module, up, ok)  = own id -> own id; none -> undefined;
 *                              inherit -> undefined when ok === false (card module),
 *                                         undefined when ok is a domain list without up's domain
 *                                         (nearest source wins, no skipping), else up
 * rows / columns / card      : effective = current scope (card entity or undefined)
 * `ok` is MagicModuleMetadata.inherit (src/modules/module-types.ts):
 *   false             card module, never inherits: custom-card
 *   readonly string[] domains accepted when inherited: camera ['camera'], weather and forecast
 *                     ['weather'], light ['light'], dropdown Object.keys(ADAPTERS)
 *   absent            any domain (all other types; slider, spinbox, graphs degrade to read-only)
 * Own ids are never domain-checked (the pickers filter them).
 *
 * ── Choke points (no other place may resolve a module entity) ──
 * - MagicCard._renderModule (src/card/magic-card.ts): computes effective() once, renders with an
 *   effective config (the same object when the id is unchanged, else a memoised shallow copy with
 *   `entity` replaced), and uses that id for design rules, ring, value background, entity colour,
 *   animations / v2, hasRunnableActions and the action actor. It sets the scope for its children
 *   (childScope) before renderModuleContent, so renderChild / renderColumn children read it.
 * - _renderRow / _renderColumn / card-level ring, value background, animations: current scope.
 * - collectDependencies (src/services/card-dependencies.ts): the same walk rules; getDependencies
 *   receives the effective config. Parity with the render is tested.
 * - Display (visibility) state / attribute conditions do NOT use any module entity (unchanged).
 * - Flows keep reading the raw module key; `none` counts as no entity (flowModuleEntities).
 *
 * ── RenderContext additions (src/services/render-context.ts) ──
 * - `entity?: string`     effective entity of the node whose conditions / content are being evaluated
 * - `cardEntity?: string` the card entity
 *
 * ── Jinja variables (templateVars below) ──
 * Text templates, markdown content and `template` conditions (display and design rules) get
 * `entity` (effective id, '' when none) only when the template text contains the word `entity`, and
 * `card_entity` ('' when none) only when it contains `card_entity`. An empty set passes no variables,
 * so templates that mention neither keep their exact cache key and subscription. Markdown keeps its
 * own `entity` / `attribute_name` object first and appends `card_entity`, so old keys stay identical.
 *
 * ── Editor (card-editor chunk) ──
 * resolveEntitySource(config, selection) in src/editor/entity-source.ts returns EntitySourceInfo
 * built only from the functions below (parity test against the card's resolver).
 *
 * Types and one constant only (0 B in magic-card.js); the functions live in src/utils/entity-scope.ts.
 */

export const ENTITY_SCOPE_CONTRACT = '1.0.0';

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
