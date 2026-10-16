import { MagicCardConfig, RowConfig, ColumnConfig, CardModule } from '../types';
import { deepClone } from '../utils/deep-merge';
import { propertyKeys } from '../utils/css-properties';
import { childListKey } from '../utils/module-path';
import { animationDocList } from '../utils/custom-animations';

/** Module keys whose absence is a local value: overridden without a value, the template's is dropped. */
const REMOVABLE_KEYS = new Set(['icon_fx', 'icon_on', 'icon_off', 'svg']);

/**
 * A linked card's own Hide and layer name of a row, column or module (not_synced marks them): kept,
 * or (marked without a value) dropped (mutates `item`, a clone).
 */
function keepLocal(item: object, local: object, marks: Set<string>): void {
  for (const k of ['hidden', 'editor_name']) {
    if (!marks.has(k)) continue;
    const v = (local as Record<string, unknown>)[k];
    if (v === undefined) delete (item as Record<string, unknown>)[k];
    else (item as Record<string, unknown>)[k] = v;
  }
}

/** Card-level keys a linked card can override (mark not_synced) instead of taking the template's. */
export const CARD_SYNC_KEYS = [
  'use_page_theme', 'theme',
  'background', 'background_image', 'border_radius', 'padding',
  'box_shadow', 'card_height', 'overflow', 'css', 'animations', 'ring', 'popup', 'flows',
  'shape', 'value_background', 'seasonal', 'hover',
];

/** Card keys synced together with a CARD_SYNC_KEYS key (one field in the editor): the shape's options. */
const CARD_GROUPED_KEYS: Record<string, string[]> = { shape: ['shape_options'] };

/** Card-level keys whose value comes from the template (the card's content and look). */
const TEMPLATE_CARD_KEYS = new Set([
  'type', 'template', 'not_synced', 'name', 'rows', 'display', 'conditional_appearance', ...CARD_SYNC_KEYS,
  'custom_animations',
  ...Object.values(CARD_GROUPED_KEYS).flat(),
]);

/**
 * Keys Home Assistant keeps in a card's config for this one card on its dashboard (sections Layout
 * tab, Visibility tab, view layouts). Never part of a template.
 */
export const HA_INSTANCE_KEYS = ['grid_options', 'layout_options', 'visibility', 'view_layout'];

/** The keys of a card config that are not template content (HA's layout / visibility, card_mod, ...), copied. */
export function cardInstanceKeys(config: MagicCardConfig): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (!TEMPLATE_CARD_KEYS.has(key) && value !== undefined) out[key] = deepClone(value);
  }
  return out;
}

type Docs = Array<Record<string, unknown>>;

/**
 * A linked card's custom animations: the template's documents in their order, a card document with
 * the same id in place of the template's, then the card's other documents (the first of an id
 * counts). `hidden_animations` drops template documents (`hide`); `custom_animations` in
 * not_synced: only the card's own.
 */
export function mergeCustomAnimations(
  template: unknown,
  local: Pick<MagicCardConfig, 'custom_animations' | 'hidden_animations' | 'not_synced'>,
  hide = true,
): Docs | undefined {
  // a Map keeps a key's first position when set again: an override stays where the template had it
  const out = new Map<string, Record<string, unknown>>();
  const add = (list: Docs, skip?: unknown) => {
    const seen = new Set<string>();
    for (const d of list) {
      const id = String(d.id);
      if (!seen.has(id) && !(Array.isArray(skip) && skip.includes(id))) out.set(id, d);
      seen.add(id);
    }
  };
  if (!local.not_synced?.includes('custom_animations'))
    add(animationDocList(template), hide && local.hidden_animations);
  add(animationDocList(local.custom_animations));
  return out.size ? [...out.values()] : undefined;
}

/** The config with its effective `custom_animations` (linked card: merged with the template's `docs`). */
export function withTemplateAnimations(config: MagicCardConfig, docs: unknown, hide = true): MagicCardConfig {
  if (!config.template || !docs) return config;
  const out = { ...config, custom_animations: mergeCustomAnimations(docs, config, hide) };
  if (!out.custom_animations) delete out.custom_animations;
  return out;
}

/**
 * Merges template structure with local overrides.
 * Template provides: structure (rows/columns/modules layout)
 * Local provides: overrides for properties marked in not_synced
 * Only properties in not_synced are kept from local; everything else comes from template.
 * Modules are matched by their `id` field.
 * `own`: `custom_animations` stays the card's own documents (the editor: the card config holds only
 * those); otherwise it is the template's merged with them by id (mergeCustomAnimations).
 */
export function mergeTemplateWithOverrides(
  template: MagicCardConfig,
  local: MagicCardConfig,
  own = false,
): MagicCardConfig {
  const result = deepClone(template);
  result.type = local.type;
  result.template = local.template;

  // Preserve card-level not_synced
  const cardNotSynced = new Set(local.not_synced || []);
  if (cardNotSynced.size > 0) {
    result.not_synced = [...cardNotSynced];
  }

  // Keys the template does not manage stay this card's own: HA's grid_options / visibility /
  // view_layout, card_mod, hidden_animations and any other key another tool keeps in the card config.
  Object.assign(result, cardInstanceKeys(local));

  // Custom animations: by id (the card's own document wins)
  const docs = own ? local.custom_animations : mergeCustomAnimations(result.custom_animations, local);
  if (docs) result.custom_animations = deepClone(docs);
  else delete result.custom_animations;

  // Card-level overrides: only apply if the property is not synced
  for (const key of CARD_SYNC_KEYS) {
    const grouped = CARD_GROUPED_KEYS[key];
    if (grouped) {
      // one field (the shape and its options): all from local once any of them is set there
      const keys = [key, ...grouped];
      const loc = local as unknown as Record<string, unknown>;
      const res = result as unknown as Record<string, unknown>;
      if (!cardNotSynced.has(key) || !keys.some((k) => loc[k] !== undefined)) continue;
      for (const k of keys) {
        if (loc[k] === undefined) delete res[k];
        else res[k] = deepClone(loc[k]);
      }
      continue;
    }
    if (cardNotSynced.has(key) && (local as unknown as Record<string, unknown>)[key] !== undefined) {
      // A copy: object values (animations, ring, popup, flows) must not share the local config's objects.
      (result as unknown as Record<string, unknown>)[key] = deepClone((local as unknown as Record<string, unknown>)[key]);
    }
  }

  // Build lookup maps for local overrides by id
  const localRowMap = new Map<string, RowConfig>();
  const localColMap = new Map<string, ColumnConfig>();
  const localModMap = new Map<string, CardModule>();

  for (const row of local.rows || []) {
    if (row.id) localRowMap.set(row.id, row);
    for (const col of row.columns || []) {
      if (col.id) localColMap.set(col.id, col);
      for (const mod of col.modules || []) {
        if (mod.id) localModMap.set(mod.id, mod);
      }
    }
  }

  // Collect template IDs to detect local-only additions
  const templateRowIds = new Set((result.rows || []).map(r => r.id).filter(Boolean));

  // Merge rows from template
  result.rows = (result.rows || []).map((row) => {
    const localRow = row.id ? localRowMap.get(row.id) : undefined;
    if (localRow) {
      const rowNotSynced = new Set(localRow.not_synced || []);
      if (rowNotSynced.size > 0) row.not_synced = [...rowNotSynced];

      if (rowNotSynced.has('layout') && localRow.layout !== undefined) row.layout = localRow.layout;
      // column widths: overridden without a value means this card uses the layout preset
      if (rowNotSynced.has('column_widths')) {
        if (localRow.column_widths !== undefined) row.column_widths = [...localRow.column_widths];
        else delete row.column_widths;
      }
      if (rowNotSynced.has('design') && localRow.design) row.design = { ...row.design, ...localRow.design };
      // actions: overridden as a whole (none left means this card's row has no actions)
      if (rowNotSynced.has('actions')) {
        if (localRow.actions) row.actions = localRow.actions;
        else delete row.actions;
      }
      if (rowNotSynced.has('gap') && localRow.gap !== undefined) row.gap = localRow.gap;
      if (rowNotSynced.has('padding') && localRow.padding !== undefined) row.padding = localRow.padding;
      keepLocal(row, localRow, rowNotSynced);
    }

    const templateColIds = new Set((row.columns || []).map(c => c.id).filter(Boolean));

    // Merge columns from template
    row.columns = (row.columns || []).map((col) => {
      const localCol = col.id ? localColMap.get(col.id) : undefined;
      if (localCol) {
        const colNotSynced = new Set(localCol.not_synced || []);
        if (colNotSynced.size > 0) col.not_synced = [...colNotSynced];

        if (colNotSynced.has('design') && localCol.design) col.design = { ...col.design, ...localCol.design };
        if (colNotSynced.has('gap') && localCol.gap !== undefined) col.gap = localCol.gap;
        if (colNotSynced.has('padding') && localCol.padding !== undefined) col.padding = localCol.padding;
        if (colNotSynced.has('vertical_align') && localCol.vertical_align !== undefined) col.vertical_align = localCol.vertical_align;
        keepLocal(col, localCol, colNotSynced);
      }

      const templateModIds = new Set((col.modules || []).map(m => m.id).filter(Boolean));

      // Merge modules from template
      col.modules = (col.modules || []).map((mod) => {
        const localMod = mod.id ? localModMap.get(mod.id) : undefined;
        if (localMod) {
          const modNotSynced = new Set((localMod.not_synced || []) as string[]);
          if (modNotSynced.size > 0) (mod as Record<string, unknown>).not_synced = [...modNotSynced];
          keepLocal(mod, localMod, modNotSynced);

          // Content fields: only override if not synced
          const contentKeys = [
            'text', 'icon', 'entity', 'image', 'content', 'label',
            'attribute', 'prefix', 'suffix', 'url', 'service', 'service_data', 'data',
            'use_entity', 'entity_display',
            'use_entity_icon', 'use_entity_color', 'icon_color', 'size',
            'icon_fx', 'icon_on', 'icon_off', 'svg', 'animated_icons',
          ];
          for (const key of contentKeys) {
            if (modNotSynced.has(key) && (localMod as Record<string, unknown>)[key] !== undefined) {
              // A copy: object values (icon_fx, service_data, data) must not share the local config's objects.
              (mod as Record<string, unknown>)[key] = deepClone((localMod as Record<string, unknown>)[key]);
            } else if (modNotSynced.has(key) && REMOVABLE_KEYS.has(key)) {
              // An icon effect key reset on this card (no value, but overridden): it stays off here.
              delete (mod as Record<string, unknown>)[key];
            }
          }
          // Layout children: the whole child list is one override (edits of any child mark it)
          const listKey = childListKey(mod);
          if (listKey && modNotSynced.has(listKey) && (localMod as Record<string, unknown>)[listKey] !== undefined) {
            (mod as Record<string, unknown>)[listKey] = deepClone((localMod as Record<string, unknown>)[listKey]);
          }
          // Design: only override not-synced design properties
          if (localMod.design && modNotSynced.has('design')) {
            mod.design = { ...mod.design, ...localMod.design };
          } else if (localMod.design) {
            const localDesign = localMod.design as Record<string, unknown>;
            const merged = { ...(mod.design || {}) } as Record<string, unknown>;
            let changed = false;
            for (const path of modNotSynced) {
              if (!path.startsWith('design.')) continue;
              const keys = propertyKeys(path.slice(7));
              // A box property (padding / margin / border_radius) is one field: shorthand and
              // per-side longhands all come from local, so a template shorthand never leaks through.
              if (keys.length > 1 && !keys.some((k) => localDesign[k] !== undefined)) continue;
              for (const k of keys) {
                if (keys.length > 1) delete merged[k];
                if (localDesign[k] !== undefined) merged[k] = localDesign[k];
                changed = true;
              }
            }
            if (changed) mod.design = merged as typeof mod.design;
          }
          // Actions: only override if not synced
          if (localMod.actions && (modNotSynced.has('actions') || [...modNotSynced].some(p => p.startsWith('actions.')))) {
            mod.actions = { ...mod.actions, ...localMod.actions };
          }
        }
        return mod;
      });

      // Append locally-added modules (IDs not in template)
      if (localCol) {
        for (const mod of localCol.modules || []) {
          if (mod.id && !templateModIds.has(mod.id)) {
            col.modules.push(deepClone(mod) as CardModule);
          }
        }
      }

      return col;
    });

    // Append locally-added columns (IDs not in template)
    if (localRow) {
      for (const col of localRow.columns || []) {
        if (col.id && !templateColIds.has(col.id)) {
          row.columns.push(deepClone(col) as ColumnConfig);
        }
      }
    }

    return row;
  });

  // Append locally-added rows (IDs not in template)
  for (const row of local.rows || []) {
    if (row.id && !templateRowIds.has(row.id)) {
      result.rows.push(deepClone(row) as RowConfig);
    }
  }

  return result;
}
