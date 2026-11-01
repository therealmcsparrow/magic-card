import { MagicCardConfig, RowConfig, ColumnConfig, CardModule, ModuleType } from '../types';
import { ModuleRegistry } from '../modules/module-registry';
import { t } from '../card/i18n';
import { MAX_BACKGROUND_LAYERS } from '../contracts/bg-stack.needs';
import { hasBadQuiet, quietMs } from '../contracts/card-status.needs';

const PLACEMENTS = ['flow', 'background', 'overlay'];
const LAYER_TYPES = ['image', 'gradient', 'pattern', 'color'];
const PAUSE_BUTTONS = ['auto', 'always', 'hidden'];
const PAUSE_CORNERS = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
const isObj = (v: unknown): boolean => !!v && typeof v === 'object' && !Array.isArray(v);

/** Layer and pause keys: contract defaults apply to bad values, so these are warnings, never errors. */
function layerWarnings(c: Record<string, unknown>): string[] {
  const w: string[] = [];
  const bl = c.background_layers;
  if (bl !== undefined) {
    if (!Array.isArray(bl)) w.push(t('card.config-validator.background-layers-must-be-a-list'));
    else {
      if (bl.length > MAX_BACKGROUND_LAYERS) w.push(t('card.config-validator.background-layers-only-the-first-max', { max: MAX_BACKGROUND_LAYERS }));
      // never walk more than the cap
      bl.slice(0, MAX_BACKGROUND_LAYERS).forEach((l, i) => {
        if (!isObj(l) || !LAYER_TYPES.includes(String((l as Record<string, unknown>).type))) w.push(t('card.config-validator.background-layers-index-unknown-layer', { index: i }));
      });
    }
  }
  if (c.layers_low_power !== undefined && typeof c.layers_low_power !== 'boolean') w.push(t('card.config-validator.layers-low-power-must-be-true-or-false'));
  if (c.pause_button !== undefined && !PAUSE_BUTTONS.includes(String(c.pause_button))) w.push(t('card.config-validator.pause-button-must-be-auto-always-or'));
  if (c.pause_button_corner !== undefined && !PAUSE_CORNERS.includes(String(c.pause_button_corner))) w.push(t('card.config-validator.pause-button-corner-is-not-a-corner'));
  return w;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidator {
  static validate(config: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!config || typeof config !== 'object') {
      return { valid: false, errors: [t('card.config-validator.config-must-be-an-object')], warnings };
    }

    const c = config as Record<string, unknown>;

    if (!c.type || typeof c.type !== 'string') {
      errors.push(t('card.config-validator.config-must-have-a-type'));
    }

    if (!Array.isArray(c.rows)) {
      errors.push(t('card.config-validator.config-must-have-a-rows-array'));
      return { valid: false, errors, warnings };
    }

    if (c.quiet_time !== undefined && quietMs(c.quiet_time) === undefined) errors.push(t('card.config-validator.quiet-time-must-be-seconds-or-h-mm-ss'));

    warnings.push(...layerWarnings(c));

    (c.rows as RowConfig[]).forEach((row, ri) => {
      if (!row.columns || !Array.isArray(row.columns)) {
        errors.push(t('card.config-validator.row-row-must-have-a-columns-array', { row: ri }));
        return;
      }

      row.columns.forEach((col, ci) => {
        if (!col.modules || !Array.isArray(col.modules)) {
          errors.push(t('card.config-validator.row-row-column-col-must-have-a-modules', { row: ri, col: ci }));
          return;
        }

        col.modules.forEach((mod, mi) => {
          if (!mod || typeof mod !== 'object') {
            errors.push(t('card.config-validator.row-row-col-col-module-module-must-be-an', { row: ri, col: ci, module: mi }));
            return;
          }
          if (!mod.type) {
            warnings.push(t('card.config-validator.row-row-col-col-module-module-missing', { row: ri, col: ci, module: mi }));
            return;
          }

          const m = mod as Record<string, unknown>;
          if (m.placement !== undefined && !PLACEMENTS.includes(String(m.placement))) {
            warnings.push(t('card.config-validator.row-row-col-col-module-module-unknown', { row: ri, col: ci, module: mi }));
          }
          if (hasBadQuiet(m)) {
            errors.push(t('card.config-validator.row-row-col-col-module-module-type-error', { row: ri, col: ci, module: mi, type: String(mod.type), error: t('card.config-validator.quiet-time-must-be-seconds-or-h-mm-ss') }));
          }
          if (m.layer !== undefined && !isObj(m.layer)) {
            warnings.push(t('card.config-validator.row-row-col-col-module-module-layer-must', { row: ri, col: ci, module: mi }));
          }

          // A module's own validation errors are shown inside that module, never fatal for the card.
          if (!ModuleRegistry.has(mod.type as ModuleType)) {
            warnings.push(t('card.config-validator.row-row-col-col-module-module-unknown-2', { row: ri, col: ci, module: mi, type: String(mod.type) }));
          } else {
            const module = ModuleRegistry.get(mod.type as ModuleType);
            const moduleErrors = module ? module.validate(mod) : [];
            warnings.push(...moduleErrors.map((e) => t('card.config-validator.row-row-col-col-module-module-type-error', { row: ri, col: ci, module: mi, type: String(mod.type), error: e })));
          }
        });
      });
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
