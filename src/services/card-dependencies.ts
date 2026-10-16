import { ModuleRegistry } from '../modules/module-registry';
import type { MagicCardConfig, ModuleType } from '../types';

/** What a card's output depends on besides its config. */
export interface CardDependencies {
  /** Entity ids whose state changes must re-render the card. */
  entities: string[];
  /** Shortest periodic refresh requested (ms), e.g. a clock or a time condition. */
  refreshInterval?: number;
  /** Some module embeds HA cards that need every `hass` update (they track their own entities). */
  forwardHass: boolean;
}

/** Extra dependencies a module can declare on top of the entity ids found in its config. */
export interface ModuleDependencies {
  entities?: string[];
  refreshInterval?: number;
  forwardHass?: boolean;
}

/** How the card is shown: the studio canvas (edit mode) can need other refreshes than a dashboard. */
export interface DependencyContext {
  editMode: boolean;
}

const ENTITY_KEYS = new Set(['entity', 'entity_id', 'entities', 'trigger_entity']);
const ENTITY_ID = /^[a-z0-9_]+\.[a-z0-9_]+$/;
/** Time conditions are re-checked every minute. */
const TIME_CONDITION_INTERVAL = 60_000;

/** Per config object, one entry for the dashboard and one for edit mode. */
let cache = new WeakMap<object, { view?: CardDependencies; edit?: CardDependencies }>();

/**
 * Forget every cached answer: a module's dependencies changed without a config change (e.g. the
 * camera stream player got defined, so a live camera no longer needs the snapshot timer).
 */
export function invalidateDependencyCache(): void {
  cache = new WeakMap();
}

function addIds(value: unknown, out: Set<string>): void {
  if (typeof value === 'string') {
    for (const part of value.split(',')) {
      const id = part.trim();
      if (ENTITY_ID.test(id)) out.add(id);
    }
  } else if (Array.isArray(value)) {
    for (const v of value) if (typeof v === 'string') addIds(v, out);
  }
}

/**
 * Walk the whole config (rows, columns, modules, nested layout children, embedded card configs,
 * display conditions, conditional design rules, actions): every `entity` / `entity_id` /
 * `entities` value is a dependency, plus what each module declares in `getDependencies`.
 */
export function collectDependencies(config: MagicCardConfig, ctx: DependencyContext = { editMode: false }): CardDependencies {
  const slot = ctx.editMode ? 'edit' : 'view';
  const hit = cache.get(config)?.[slot];
  if (hit) return hit;
  const entities = new Set<string>();
  let refreshInterval: number | undefined;
  let forwardHass = false;
  const interval = (ms: number | undefined) => {
    if (ms && ms > 0) refreshInterval = refreshInterval === undefined ? ms : Math.min(refreshInterval, ms);
  };
  const seen = new Set<unknown>();

  const walk = (node: unknown, embedded = false): void => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const n of node) walk(n, embedded);
      return;
    }
    const rec = node as Record<string, unknown>;
    for (const [key, value] of Object.entries(rec)) {
      if (ENTITY_KEYS.has(key)) addIds(value, entities);
      if (value && typeof value === 'object') walk(value, embedded || key === 'card_config');
    }
    if (rec.type === 'time' && ('after' in rec || 'before' in rec)) interval(TIME_CONDITION_INTERVAL);
    // the Day and night animation preset follows the sun
    if (rec.preset === 'daynight') entities.add('sun.sun');
    // Module hooks; not for the HA card config embedded by a custom-card module (its `type` is a card type).
    if (!embedded && typeof rec.type === 'string') {
      const deps = ModuleRegistry.get(rec.type as ModuleType)?.getDependencies?.(rec as never, ctx);
      if (deps) {
        deps.entities?.forEach((id) => entities.add(id));
        interval(deps.refreshInterval);
        if (deps.forwardHass) forwardHass = true;
      }
    }
  };
  walk(config);

  const result: CardDependencies = { entities: [...entities], refreshInterval, forwardHass };
  cache.set(config, { ...cache.get(config), [slot]: result });
  return result;
}
