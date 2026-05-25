import { MagicCardConfig, RowConfig, ColumnConfig, CardModule } from '../types';
import { deepClone } from '../utils/deep-merge';

/**
 * Merges template structure with local overrides.
 * Template provides: structure (rows/columns/modules layout)
 * Local provides: overrides for properties marked in not_synced
 * Only properties in not_synced are kept from local; everything else comes from template.
 * Modules are matched by their `id` field.
 */
export function mergeTemplateWithOverrides(
  template: MagicCardConfig,
  local: MagicCardConfig,
): MagicCardConfig {
  const result = deepClone(template);
  result.type = local.type;
  result.template = local.template;

  // Preserve card-level not_synced
  const cardNotSynced = new Set(local.not_synced || []);
  if (cardNotSynced.size > 0) {
    result.not_synced = [...cardNotSynced];
  }

  // Card-level overrides: only apply if the property is not synced
  const cardOverrideKeys = [
    'use_page_theme', 'theme',
    'background', 'background_image', 'border_radius', 'padding',
    'box_shadow', 'card_height', 'overflow', 'css',
  ];
  for (const key of cardOverrideKeys) {
    if (cardNotSynced.has(key) && (local as unknown as Record<string, unknown>)[key] !== undefined) {
      (result as unknown as Record<string, unknown>)[key] = (local as unknown as Record<string, unknown>)[key];
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
      if (rowNotSynced.has('design') && localRow.design) row.design = { ...row.design, ...localRow.design };
      if (rowNotSynced.has('gap') && localRow.gap !== undefined) row.gap = localRow.gap;
      if (rowNotSynced.has('padding') && localRow.padding !== undefined) row.padding = localRow.padding;
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
      }

      const templateModIds = new Set((col.modules || []).map(m => m.id).filter(Boolean));

      // Merge modules from template
      col.modules = (col.modules || []).map((mod) => {
        const localMod = mod.id ? localModMap.get(mod.id) : undefined;
        if (localMod) {
          const modNotSynced = new Set((localMod.not_synced || []) as string[]);
          if (modNotSynced.size > 0) (mod as Record<string, unknown>).not_synced = [...modNotSynced];

          // Content fields: only override if not synced
          const contentKeys = [
            'text', 'icon', 'entity', 'image', 'content', 'label',
            'attribute', 'prefix', 'suffix', 'url', 'service', 'service_data', 'data',
          ];
          for (const key of contentKeys) {
            if (modNotSynced.has(key) && (localMod as Record<string, unknown>)[key] !== undefined) {
              (mod as Record<string, unknown>)[key] = (localMod as Record<string, unknown>)[key];
            }
          }
          // Design: only override not-synced design properties
          if (localMod.design && modNotSynced.has('design')) {
            mod.design = { ...mod.design, ...localMod.design };
          } else if (localMod.design) {
            const designOverrides: Record<string, unknown> = {};
            for (const path of modNotSynced) {
              if (path.startsWith('design.')) {
                const prop = path.slice(7);
                if ((localMod.design as Record<string, unknown>)[prop] !== undefined) {
                  designOverrides[prop] = (localMod.design as Record<string, unknown>)[prop];
                }
              }
            }
            if (Object.keys(designOverrides).length > 0) {
              mod.design = { ...mod.design, ...designOverrides };
            }
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
