import { HomeAssistant, MagicCardConfig, RowConfig, ColumnConfig, CardModule } from '../types';
import { deepClone } from '../utils/deep-merge';

interface TemplateEntry {
  config: Omit<MagicCardConfig, 'type'> & { type?: string };
  description?: string;
}

/**
 * Service for syncing card configs with templates
 * Handles merging template updates while preserving not_synced properties
 */
export class SyncService {
  /**
   * Load template from backend
   */
  static async loadTemplate(hass: HomeAssistant, templateName: string): Promise<TemplateEntry | null> {
    try {
      const result = await hass.callWS<{ templates: Record<string, TemplateEntry> }>({
        type: 'magic_card_utils/get_templates',
      });
      return result.templates?.[templateName] || null;
    } catch (err) {
      console.warn('Failed to load template:', err);
      return null;
    }
  }

  /**
   * Sync card config with its template, preserving not_synced properties
   */
  static async syncWithTemplate(hass: HomeAssistant, config: MagicCardConfig): Promise<MagicCardConfig> {
    if (!config.template) {
      return config;
    }

    const template = await this.loadTemplate(hass, config.template);
    if (!template) {
      console.warn(`Template "${config.template}" not found`);
      return config;
    }

    // Merge template into config while preserving not_synced paths
    const synced = this.mergeWithTemplate(config, template.config);
    return synced;
  }

  /**
   * Merge template config into card config, respecting not_synced paths
   */
  private static mergeWithTemplate(
    config: MagicCardConfig,
    templateConfig: Omit<MagicCardConfig, 'type'> & { type?: string }
  ): MagicCardConfig {
    const result = deepClone(config);
    const notSynced = new Set(config.not_synced || []);

    // Merge top-level properties
    for (const key of Object.keys(templateConfig)) {
      if (key === 'rows') continue; // Handle rows separately
      if (key === 'type') continue; // Local card type always wins
      if (notSynced.has(key)) continue; // Skip not_synced properties

      const value = (templateConfig as unknown as Record<string, unknown>)[key];
      (result as unknown as Record<string, unknown>)[key] = deepClone(value);
    }

    // Merge rows with special handling
    if (templateConfig.rows) {
      result.rows = this.mergeRows(config.rows, templateConfig.rows, notSynced.has('rows'));
    }

    return result;
  }

  /**
   * Merge rows from template, preserving not_synced properties at row level
   */
  private static mergeRows(
    configRows: RowConfig[],
    templateRows: RowConfig[],
    rowsNotSynced: boolean
  ): RowConfig[] {
    if (rowsNotSynced) {
      // If entire rows array is not synced, keep current rows
      return configRows;
    }

    // Create a map of config rows by ID
    const configRowsById = new Map(configRows.map(r => [r.id, r]));

    const result: RowConfig[] = [];

    for (const templateRow of templateRows) {
      const configRow = configRowsById.get(templateRow.id);

      if (configRow) {
        // Merge this row
        result.push(this.mergeRow(configRow, templateRow));
        configRowsById.delete(templateRow.id);
      } else {
        // New row from template
        result.push(deepClone(templateRow));
      }
    }

    // Add any remaining config rows that weren't in template (user added)
    for (const remainingRow of configRowsById.values()) {
      result.push(remainingRow);
    }

    return result;
  }

  /**
   * Merge single row with template row
   */
  private static mergeRow(configRow: RowConfig, templateRow: RowConfig): RowConfig {
    const result = deepClone(configRow);
    const notSynced = new Set(configRow.not_synced || []);

    // Merge row-level properties
    for (const key of Object.keys(templateRow)) {
      if (key === 'id') continue; // Don't overwrite ID
      if (key === 'columns') continue; // Handle columns separately
      if (notSynced.has(key)) continue; // Skip not_synced properties

      (result as unknown as Record<string, unknown>)[key] = deepClone((templateRow as unknown as Record<string, unknown>)[key]);
    }

    // Merge columns
    if (templateRow.columns) {
      result.columns = this.mergeColumns(configRow.columns, templateRow.columns, notSynced.has('columns'));
    }

    return result;
  }

  /**
   * Merge columns from template
   */
  private static mergeColumns(
    configColumns: ColumnConfig[],
    templateColumns: ColumnConfig[],
    columnsNotSynced: boolean
  ): ColumnConfig[] {
    if (columnsNotSynced) {
      return configColumns;
    }

    const configColumnsById = new Map(configColumns.map(c => [c.id, c]));
    const result: ColumnConfig[] = [];

    for (const templateColumn of templateColumns) {
      const configColumn = configColumnsById.get(templateColumn.id);

      if (configColumn) {
        result.push(this.mergeColumn(configColumn, templateColumn));
        configColumnsById.delete(templateColumn.id);
      } else {
        result.push(deepClone(templateColumn));
      }
    }

    for (const remainingColumn of configColumnsById.values()) {
      result.push(remainingColumn);
    }

    return result;
  }

  /**
   * Merge single column with template column
   */
  private static mergeColumn(configColumn: ColumnConfig, templateColumn: ColumnConfig): ColumnConfig {
    const result = deepClone(configColumn);
    const notSynced = new Set(configColumn.not_synced || []);

    for (const key of Object.keys(templateColumn)) {
      if (key === 'id') continue;
      if (key === 'modules') continue;
      if (notSynced.has(key)) continue;

      (result as unknown as Record<string, unknown>)[key] = deepClone((templateColumn as unknown as Record<string, unknown>)[key]);
    }

    if (templateColumn.modules) {
      result.modules = this.mergeModules(configColumn.modules, templateColumn.modules, notSynced.has('modules'));
    }

    return result;
  }

  /**
   * Merge modules from template
   */
  private static mergeModules(
    configModules: CardModule[],
    templateModules: CardModule[],
    modulesNotSynced: boolean
  ): CardModule[] {
    if (modulesNotSynced) {
      return configModules;
    }

    const configModulesById = new Map(configModules.map(m => [m.id, m]));
    const result: CardModule[] = [];

    for (const templateModule of templateModules) {
      const configModule = configModulesById.get(templateModule.id);

      if (configModule) {
        result.push(this.mergeModule(configModule, templateModule));
        configModulesById.delete(templateModule.id);
      } else {
        result.push(deepClone(templateModule));
      }
    }

    for (const remainingModule of configModulesById.values()) {
      result.push(remainingModule);
    }

    return result;
  }

  /**
   * Merge single module with template module
   */
  private static mergeModule(configModule: CardModule, templateModule: CardModule): CardModule {
    const result = deepClone(configModule);
    const notSynced = new Set(configModule.not_synced || []);

    for (const key of Object.keys(templateModule)) {
      if (key === 'id') continue;
      if (notSynced.has(key)) continue;

      (result as Record<string, unknown>)[key] = deepClone((templateModule as Record<string, unknown>)[key]);
    }

    return result;
  }

  /**
   * Mark a property path as not synced
   */
  static markNotSynced(
    config: Record<string, unknown>,
    propertyPath: string
  ): void {
    const notSynced = (config.not_synced as string[] | undefined) || [];
    if (!notSynced.includes(propertyPath)) {
      config.not_synced = [...notSynced, propertyPath];
    }
  }

  /**
   * Remove a property from not_synced (re-sync it)
   */
  static markSynced(
    config: Record<string, unknown>,
    propertyPath: string
  ): void {
    const notSynced = (config.not_synced as string[] | undefined) || [];
    config.not_synced = notSynced.filter(p => p !== propertyPath);
    if ((config.not_synced as string[]).length === 0) {
      delete config.not_synced;
    }
  }

  /**
   * Check if a property path is not synced
   */
  static isNotSynced(
    config: Record<string, unknown>,
    propertyPath: string
  ): boolean {
    const notSynced = (config.not_synced as string[] | undefined) || [];
    return notSynced.includes(propertyPath);
  }

  /**
   * Re-sync a specific property from template
   */
  static async resyncProperty(
    hass: HomeAssistant,
    config: MagicCardConfig,
    propertyPath: string
  ): Promise<MagicCardConfig> {
    if (!config.template) {
      return config;
    }

    const template = await this.loadTemplate(hass, config.template);
    if (!template) {
      return config;
    }

    // Remove from not_synced
    this.markSynced(config as unknown as Record<string, unknown>, propertyPath);

    // Re-sync with template
    return this.syncWithTemplate(hass, config);
  }

  /**
   * Get all synced and not synced properties for UI display
   */
  static getSyncStatus(config: MagicCardConfig): {
    synced: string[];
    notSynced: string[];
    isLinked: boolean;
  } {
    const isLinked = !!config.template;
    const notSynced = config.not_synced || [];

    // List of all possible top-level properties that can be synced
    const allProperties = [
      'name', 'rows', 'use_page_theme', 'theme', 'background', 'background_image', 'border_radius',
      'padding', 'box_shadow', 'card_height', 'overflow', 'css'
    ];

    const synced = isLinked
      ? allProperties.filter(p => !notSynced.includes(p))
      : [];

    return {
      synced,
      notSynced: isLinked ? notSynced : [],
      isLinked
    };
  }
}
