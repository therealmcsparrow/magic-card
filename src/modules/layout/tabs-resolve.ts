import { ConditionsService } from '../../services/conditions-service';
import type { DisplayCondition, HomeAssistant } from '../../types';

/*
 * The design of a tabs module with its matching conditional rules applied, for the tab_ keys only (the card sheet
 * resolves the css keys itself). Flat keys override, tab_active and tab_disabled merge key by key, and
 * tab_disabled_tabs adds up: two rules can each disable their own tab, and a rule cannot enable a tab the design
 * disables. Nothing here reads config text beyond the key names it compares.
 */

const MAX_RULES = 64;
/** Most disabled tab positions read from a design. */
export const MAX_DISABLED_TABS = 64;
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

export function resolveTabsDesign(
  design: unknown,
  hass: HomeAssistant | undefined,
  moduleEntity?: string,
): Record<string, unknown> | undefined {
  if (!isObject(design)) return undefined;
  const rules = design.conditional;
  if (!Array.isArray(rules) || !rules.length || !hass) return design;

  const merged: Record<string, unknown> = { ...design };
  delete merged.conditional;
  for (const rule of rules.slice(0, MAX_RULES)) {
    if (!isObject(rule) || !Array.isArray(rule.conditions)) continue;
    const conditions = (rule.conditions as DisplayCondition[]).map((c) =>
      c && c.use_module_entity !== false && moduleEntity && !c.entity ? { ...c, entity: moduleEntity } : c,
    );
    if (!ConditionsService.ruleMatches({ conditions, mode: rule.mode as 'every' | 'any' | undefined }, hass)) continue;
    const own = isObject(rule.design) ? rule.design : {};
    for (const key of Object.keys(own)) {
      const value = own[key];
      if (!key.startsWith('tab_') || value === undefined) continue;
      if (key === 'tab_active' || key === 'tab_disabled') {
        if (isObject(value)) {
          const next: Record<string, unknown> = { ...(isObject(merged[key]) ? merged[key] : {}) };
          for (const k of Object.keys(value)) if (k.startsWith('tab_') && value[k] !== undefined) next[k] = value[k];
          merged[key] = next;
        }
      } else if (key === 'tab_disabled_tabs') {
        if (Array.isArray(value)) merged[key] = [...(Array.isArray(merged[key]) ? (merged[key] as unknown[]) : []), ...value];
      } else {
        merged[key] = value;
      }
    }
  }
  if (Array.isArray(merged.tab_disabled_tabs)) merged.tab_disabled_tabs = [...new Set(merged.tab_disabled_tabs)].slice(0, MAX_DISABLED_TABS);
  return merged;
}
