import { MagicCardConfig, RowConfig, ColumnConfig, CardModule, ModuleType } from '../types';
import { ModuleRegistry } from '../modules/module-registry';
import { t } from '../card/i18n';

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
      return { valid: false, errors: [t('Config must be an object')], warnings };
    }

    const c = config as Record<string, unknown>;

    if (!c.type || typeof c.type !== 'string') {
      errors.push(t('Config must have a type'));
    }

    if (!Array.isArray(c.rows)) {
      errors.push(t('Config must have a rows array'));
      return { valid: false, errors, warnings };
    }

    (c.rows as RowConfig[]).forEach((row, ri) => {
      if (!row.columns || !Array.isArray(row.columns)) {
        errors.push(t('Row {row} must have a columns array', { row: ri }));
        return;
      }

      row.columns.forEach((col, ci) => {
        if (!col.modules || !Array.isArray(col.modules)) {
          errors.push(t('Row {row}, Column {col} must have a modules array', { row: ri, col: ci }));
          return;
        }

        col.modules.forEach((mod, mi) => {
          if (!mod || typeof mod !== 'object') {
            errors.push(t('Row {row}, Col {col}, Module {module}: must be an object', { row: ri, col: ci, module: mi }));
            return;
          }
          if (!mod.type) {
            warnings.push(t('Row {row}, Col {col}, Module {module}: missing type', { row: ri, col: ci, module: mi }));
            return;
          }

          // A module's own validation errors are shown inside that module, never fatal for the card.
          if (!ModuleRegistry.has(mod.type as ModuleType)) {
            warnings.push(t('Row {row}, Col {col}, Module {module}: unknown type "{type}"', { row: ri, col: ci, module: mi, type: String(mod.type) }));
          } else {
            const module = ModuleRegistry.get(mod.type as ModuleType);
            const moduleErrors = module ? module.validate(mod) : [];
            warnings.push(...moduleErrors.map((e) => t('Row {row}, Col {col}, Module {module} ({type}): {error}', { row: ri, col: ci, module: mi, type: String(mod.type), error: e })));
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
