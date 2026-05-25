import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VerticalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderSelectField } from '../../utils/form-utils';
import { getModuleTypeOptions, renderChildModuleEditor } from '../../utils/layout-editor';

/** Track which child module is expanded for editing (keyed by "moduleId:childIdx") */
const _expandedChildMap = new Map<string, boolean>();

class VerticalModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'vertical',
    name: 'Vertical',
    description: 'Arrange child modules in a column',
    category: 'layout',
    icon: 'mdi:arrow-split-horizontal',
  };

  createDefault(): VerticalModuleConfig {
    return {
      id: generateId('vertical'),
      type: 'vertical',
      modules: [],
      gap: '8px',
      align: 'stretch',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as VerticalModuleConfig;
    const children = c.modules || [];

    return html`
      <div class="mc-module mc-vertical"
        style="gap:${c.gap || '8px'}; align-items:${c.align || 'stretch'}">
        ${children.length > 0
          ? children.map((child) => {
              const mod = ModuleRegistry.get(child.type);
              return mod ? mod.renderPreview(child, hass) : html`<span class="mc-error">?</span>`;
            })
          : html`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
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
    const c = config as VerticalModuleConfig;
    const children = c.modules || [];
    const moduleTypes = getModuleTypeOptions();

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Gap', c.gap, (v) => onChange({ ...c, gap: v }), 'gap', syncCtx)}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as VerticalModuleConfig['align'] }), 'align', syncCtx)}

        <div class="mc-section">
          <div class="mc-section-header">Child Modules (${children.length})</div>
          ${this._renderChildModuleList(c, hass, onChange, moduleTypes, template)}
        </div>
      </div>
    `;
  }

  private _renderChildModuleList(
    c: VerticalModuleConfig,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    moduleTypes: Array<{ label: string; value: string }>,
    template?: string,
  ): TemplateResult {
    const children = c.modules || [];

    const updateChildren = (newModules: CardModule[]) => {
      onChange({ ...c, modules: newModules });
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
      if (newMod) updateChildren([...children, newMod]);
    };

    return html`
      ${renderChildModuleEditor({
        ownerId: c.id,
        scopeId: 'root',
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

ModuleRegistry.register(new VerticalModule());
