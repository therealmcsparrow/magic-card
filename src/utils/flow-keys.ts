import type { FlowConfig, MagicCardConfig } from '../types';

export const FLOW_DEFAULTS = {
  route: 'curve',
  min: 0,
  max: 1000,
  reverse_negative: true,
  color: 'var(--primary-color)',
  /** Unset: the theme's secondary text colour, half transparent (reads on light and dark cards). */
  idle_color: 'color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)',
  width: 3,
  scale_width: true,
  dots: 3,
  dot_size: 6,
  speed: 2,
  min_speed: 8,
  glow: 0,
  label: 'none',
  label_position: 'auto',
  show_when: 'always',
  layer: 'back',
} as const;

/**
 * The key of every entry of `flows` as the card draws it (`data-flow` in `<mc-flows>`): its id, or
 * `from>to` / `flow~i` when it has none, made unique with `~i` when repeated. The editor uses the
 * same keys to select a flow from the canvas.
 */
export function flowKeys(flows: readonly unknown[] | undefined): string[] {
  const seen = new Set<string>();
  return (flows ?? []).map((raw, i) => {
    const f = (raw && typeof raw === 'object' ? raw : {}) as Partial<FlowConfig>;
    const from = typeof f.from === 'string' ? f.from : '';
    const to = typeof f.to === 'string' ? f.to : '';
    let id = typeof f.id === 'string' && f.id ? f.id : from && to ? `${from}>${to}` : `flow~${i}`;
    if (seen.has(id)) id = `${id}~${i}`;
    seen.add(id);
    return id;
  });
}

/** Module id -> the module's entity (flow `color: entity`), nested children included; per config. */
const moduleEntityCache = new WeakMap<object, Map<string, string | undefined>>();
export function flowModuleEntities(config: MagicCardConfig): Map<string, string | undefined> {
  let map = moduleEntityCache.get(config);
  if (map) return map;
  const out = new Map<string, string | undefined>();
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const rec = node as Record<string, unknown>;
    if (typeof rec.id === 'string' && typeof rec.type === 'string' && !out.has(rec.id)) {
      out.set(rec.id, typeof rec.entity === 'string' && rec.entity !== 'none' ? rec.entity : undefined);
    }
    for (const key of ['columns', 'modules', 'tabs']) walk(rec[key]);
  };
  walk(config.rows);
  map = out;
  moduleEntityCache.set(config, map);
  return map;
}
