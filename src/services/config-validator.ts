import { MagicCardConfig, RowConfig, ColumnConfig, CardModule, ModuleType } from '../types';
import { ModuleRegistry } from '../modules/module-registry';

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
      return { valid: false, errors: ['Config must be an object'], warnings };
    }

    const c = config as Record<string, unknown>;

    if (!c.type || typeof c.type !== 'string') {
      errors.push('Config must have a type');
    }

    if (!Array.isArray(c.rows)) {
      errors.push('Config must have a rows array');
      return { valid: false, errors, warnings };
    }

    (c.rows as RowConfig[]).forEach((row, ri) => {
      if (!row.columns || !Array.isArray(row.columns)) {
        errors.push(`Row ${ri} must have a columns array`);
        return;
      }

      row.columns.forEach((col, ci) => {
        if (!col.modules || !Array.isArray(col.modules)) {
          errors.push(`Row ${ri}, Column ${ci} must have a modules array`);
          return;
        }

        col.modules.forEach((mod, mi) => {
          if (!mod.type) {
            errors.push(`Row ${ri}, Col ${ci}, Module ${mi}: missing type`);
            return;
          }

          if (!ModuleRegistry.has(mod.type as ModuleType)) {
            warnings.push(`Row ${ri}, Col ${ci}, Module ${mi}: unknown type "${mod.type}"`);
          } else {
            const module = ModuleRegistry.get(mod.type as ModuleType);
            if (module) {
              const moduleErrors = module.validate(mod);
              errors.push(...moduleErrors.map((e) => `Row ${ri}, Col ${ci}, Module ${mi} (${mod.type}): ${e}`));
            }
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
