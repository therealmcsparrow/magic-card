import type { CardModule } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { toYaml } from '../../utils/yaml-utils';

/**
 * Copy / paste of a whole module (with its layout children) between cards and dialogs, like the
 * design clipboard: the editor clipboard lives in localStorage, a copy also goes to the system
 * clipboard as YAML (for a card's YAML editor or another browser).
 */
export const MODULE_CLIPBOARD_KEY = 'magic-card:module-clipboard';

/**
 * A deep copy without editor bookkeeping: `not_synced` and `_` keys at every level, undefined values.
 * Used for Copy module and Copy YAML.
 */
export function cleanItem<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => cleanItem(v)) as unknown as T;
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === 'not_synced' || k.startsWith('_') || v === undefined) continue;
    out[k] = cleanItem(v);
  }
  return out as T;
}

/** Store a module on the editor clipboard (and the system clipboard as YAML); returns the stored copy. */
export function copyModuleToClipboard(mod: CardModule): CardModule {
  const copy = cleanItem(mod);
  try {
    localStorage.setItem(MODULE_CLIPBOARD_KEY, JSON.stringify(copy));
  } catch {
    // storage full / disabled: the system clipboard below still has it
  }
  try {
    navigator.clipboard?.writeText(toYaml(copy))?.catch(() => undefined);
  } catch {
    // no clipboard permission (plain http): the editor clipboard is enough
  }
  return copy;
}

/** The copied module, or undefined when nothing (or no known module type) was copied. */
export function readModuleClipboard(): CardModule | undefined {
  try {
    const raw = localStorage.getItem(MODULE_CLIPBOARD_KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw) as CardModule;
    return v && typeof v === 'object' && !Array.isArray(v) && typeof v.type === 'string' && ModuleRegistry.get(v.type) ? v : undefined;
  } catch {
    return undefined;
  }
}
