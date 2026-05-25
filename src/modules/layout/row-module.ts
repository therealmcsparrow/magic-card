import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, RowModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderSelectField, renderUnitField } from '../../utils/form-utils';
import { layoutToGridTemplate } from '../../utils/css-utils';
import { getModuleTypeOptions, renderChildModuleEditor } from '../../utils/layout-editor';

// Layout presets grouped by column count
const LAYOUT_PRESETS: Record<number, Array<{ label: string; value: string }>> = {
  1: [{ label: '1 Col', value: '1' }],
  2: [
    { label: '1-1', value: '1-1' },
    { label: '1-2', value: '1-2' },
    { label: '2-1', value: '2-1' },
  ],
  3: [
    { label: '1-1-1', value: '1-1-1' },
    { label: '1-2-1', value: '1-2-1' },
  ],
};

/** Track which column is being edited (keyed by module id) */
const _editorColMap = new Map<string, number>();

/** Track which child module is expanded for editing (keyed by "moduleId:colIdx:childIdx") */
const _expandedChildMap = new Map<string, boolean>();

class RowModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'row',
    name: 'Row',
    description: 'Grid row with columns, nestable inside any column',
    category: 'layout',
    icon: 'mdi:view-sequential',
  };

  createDefault(): RowModuleConfig {
    return {
      id: generateId('row'),
      type: 'row',
      columns: [
        { modules: [] },
        { modules: [] },
      ],
      layout: '1-1',
      gap: '8px',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as RowModuleConfig;
    const columns = c.columns || [];
    const gridTemplate = layoutToGridTemplate(c.layout || '1');

    return html`
      <div class="mc-module mc-nested-row" style="display:grid; grid-template-columns:${gridTemplate}; gap:${c.gap || '8px'}">
        ${columns.map((col) => html`
          <div class="mc-nested-col">
            ${col.modules?.length
              ? col.modules.map((child) => {
                  const mod = ModuleRegistry.get(child.type);
                  return mod ? mod.renderPreview(child, hass) : html`<span class="mc-error">?</span>`;
                })
              : html`<span class="mc-placeholder-text">Empty</span>`}
          </div>
        `)}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const syncCtx = this._buildSyncContext(config, template);
    const c = config as RowModuleConfig;
    const columns = c.columns || [];
    const colCount = columns.length;
    const layoutOptions = LAYOUT_PRESETS[colCount] || LAYOUT_PRESETS[1];

    const editorActiveCol = _editorColMap.get(c.id) ?? 0;
    const clampedCol = Math.min(editorActiveCol, Math.max(colCount - 1, 0));
    const moduleTypes = getModuleTypeOptions();

    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Column Layout', c.layout, layoutOptions,
          (v) => onChange({ ...c, layout: v }), 'layout', syncCtx)}
        ${renderUnitField('Gap', c.gap, (v) => onChange({ ...c, gap: v }), 'gap', syncCtx)}

        <!-- Column management -->
        <div class="mc-section">
          <div class="mc-section-header mc-section-header-split">
            <span>Columns (${colCount})</span>
            <div class="mc-section-header-actions">
              <button class="mc-btn mc-btn-secondary mc-btn-compact" @click=${() => {
                const newCols = [...columns, { modules: [] }];
                onChange({ ...c, columns: newCols });
              }}>+ Column</button>
              ${colCount > 1 ? html`
                <button class="mc-btn mc-btn-secondary mc-btn-compact" @click=${() => {
                  const newCols = columns.slice(0, -1);
                  if (clampedCol >= newCols.length) _editorColMap.set(c.id, newCols.length - 1);
                  onChange({ ...c, columns: newCols });
                }}>- Column</button>
              ` : nothing}
            </div>
          </div>
        </div>

        <!-- Per-column child module management -->
        ${colCount > 0
          ? html`
            <div class="mc-section">
              <div class="mc-section-header">Column Content</div>
              <div class="mc-tabs-header mc-editor-tab-switcher">
                ${columns.map(
                  (_, i) => html`
                    <button
                      class="mc-tab-button ${i === clampedCol ? 'active' : ''}"
                      @click=${() => { _editorColMap.set(c.id, i); onChange({ ...c }); }}
                    >Col ${i + 1}</button>
                  `,
                )}
              </div>
              ${this._renderChildModuleList(c, clampedCol, hass, onChange, moduleTypes, template)}
            </div>
          `
          : nothing}
      </div>
    `;
  }

  private _renderChildModuleList(
    c: RowModuleConfig,
    colIdx: number,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    moduleTypes: Array<{ label: string; value: string }>,
    template?: string,
  ): TemplateResult {
    const col = c.columns![colIdx];
    const children = col.modules || [];

    const updateChildren = (newModules: CardModule[]) => {
      const newCols = [...(c.columns || [])];
      newCols[colIdx] = { ...newCols[colIdx], modules: newModules };
      onChange({ ...c, columns: newCols });
    };

    const removeChild = (childIdx: number) => {
      updateChildren(children.filter((_, i) => i !== childIdx));
    };

    const updateChild = (childIdx: number, updated: CardModule) => {
      const newModules = [...children];
      newModules[childIdx] = updated;
      updateChildren(newModules);
    };

    const addChild = (type: string) => {
      const newMod = ModuleRegistry.createDefault(type as any);
      if (newMod) {
        updateChildren([...children, newMod]);
      }
    };

    return html`
      ${renderChildModuleEditor({
        ownerId: c.id,
        scopeId: `col-${colIdx}`,
        children,
        hass,
        template,
        expandedState: _expandedChildMap,
        moduleTypes,
        onRefresh: () => onChange({ ...c }),
        onRemoveChild: removeChild,
        onUpdateChild: updateChild,
        onAddChild: addChild,
      })}
    `;
  }
}

ModuleRegistry.register(new RowModule());
