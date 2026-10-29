import type { MagicCardConfig, CardModule } from '../../types';
import { deepClone } from '../../utils/deep-merge';
import { childSlots } from '../../utils/module-path';
import { HA_INSTANCE_KEYS } from '../../services/template-merge';
import { animationDocList } from '../../utils/custom-animations';
import { t } from '../i18n';

/** Remove not_synced from a module and every nested layout child (mutates: callers pass a clone). */
function deleteModuleNotSynced(mod: CardModule): void {
  if (!mod || typeof mod !== 'object') return;
  delete (mod as Record<string, unknown>).not_synced;
  for (const slot of childSlots(mod) ?? []) for (const child of slot) deleteModuleNotSynced(child);
}

export interface NotSyncedEntry { location: string; paths: string[] }

/** Collect all not_synced entries from the entire config tree. */
export function collectNotSynced(config: MagicCardConfig): NotSyncedEntry[] {
  const entries: NotSyncedEntry[] = [];

  if (config.not_synced?.length) {
    entries.push({ location: t('card-editor.template-sync.card'), paths: [...config.not_synced] });
  }

  for (let ri = 0; ri < (config.rows || []).length; ri++) {
    const row = config.rows[ri];
    if (row.not_synced?.length) {
      entries.push({ location: t('card-editor.template-sync.row-n', { n: ri + 1 }), paths: [...row.not_synced] });
    }
    for (let ci = 0; ci < (row.columns || []).length; ci++) {
      const col = row.columns[ci];
      if (col.not_synced?.length) {
        entries.push({ location: t('card-editor.template-sync.row-row-col-col', { row: ri + 1, col: ci + 1 }), paths: [...col.not_synced] });
      }
      for (let mi = 0; mi < (col.modules || []).length; mi++) {
        const mod = col.modules[mi];
        if (mod.not_synced?.length) {
          const name = (mod as Record<string, unknown>).label || mod.type;
          entries.push({ location: `${name}`, paths: [...(mod.not_synced as string[])] });
        }
      }
    }
  }

  return entries;
}

export function countNotSynced(config: MagicCardConfig): number {
  return collectNotSynced(config).reduce((sum, e) => sum + e.paths.length, 0);
}

/** Deep copy of the config with every not_synced array (and the hidden template animations) removed. */
export function clearNotSynced(config: MagicCardConfig): MagicCardConfig {
  const copy = deepClone(config);
  delete copy.not_synced;
  delete copy.hidden_animations;
  for (const row of copy.rows || []) {
    delete row.not_synced;
    for (const col of row.columns || []) {
      delete col.not_synced;
      for (const mod of col.modules || []) deleteModuleNotSynced(mod);
    }
  }
  return copy;
}

/**
 * Strip not_synced arrays (card-instance-specific), the `template` link and HA's per-card keys
 * (grid_options, visibility, ...) from a config before saving it as a template. Does not mutate the input.
 */
export function stripForTemplate(config: MagicCardConfig): Record<string, unknown> {
  const result = clearNotSynced(config) as unknown as Record<string, unknown>;
  delete result['template'];
  delete result['entity']; // per card, so one template fits any device
  for (const key of HA_INSTANCE_KEYS) delete result[key];
  return result;
}

/** Add (currentlySynced) or remove (!currentlySynced) a path from a not_synced list. */
export function toggleNotSynced(list: string[] | undefined, path: string, currentlySynced: boolean): string[] {
  const set = new Set(list || []);
  if (currentlySynced) set.add(path);
  else set.delete(path);
  return Array.from(set);
}

/**
 * Wraps onChange to auto-detect changed top-level properties and add them to
 * not_synced (structural keys are ignored). Like the original, it sets
 * not_synced on the `updated` object it receives.
 */
export function wrapOnChangeWithSync(
  current: CardModule,
  onChange: (m: CardModule) => void,
): (m: CardModule) => void {
  return (updated: CardModule) => {
    const notSynced = new Set((updated.not_synced || []) as string[]);
    const oldRec = current as Record<string, unknown>;
    const newRec = updated as Record<string, unknown>;

    const skipKeys = new Set(['id', 'type', 'not_synced', 'design', 'actions', 'display']);
    for (const key of Object.keys(newRec)) {
      if (skipKeys.has(key)) continue;
      if (newRec[key] !== oldRec[key]) notSynced.add(key);
    }
    // a removed entity (Same as card) must stay removed: the merge restores the template's unless it is marked
    if (oldRec.entity !== undefined && !('entity' in newRec)) notSynced.add('entity');

    newRec.not_synced = Array.from(notSynced);
    onChange(updated);
  };
}

/** The card with the template's animation `id` left out (`hidden`) or shown again (hidden_animations). */
export function setAnimationHidden(config: MagicCardConfig, id: string, hidden: boolean): MagicCardConfig {
  const list = (config.hidden_animations ?? []).filter((h) => h !== id);
  if (hidden) list.push(id);
  const out: MagicCardConfig = { ...config, hidden_animations: list };
  if (!list.length) delete out.hidden_animations;
  return out;
}

/** The card without its own animation document `id` (the template's plays again; a map becomes a list). */
export function dropOwnAnimation(config: MagicCardConfig, id: string): MagicCardConfig {
  const next = animationDocList(config.custom_animations).filter((d) => d.id !== id);
  const out: MagicCardConfig = { ...config, custom_animations: next };
  if (!next.length) delete out.custom_animations;
  return out;
}
