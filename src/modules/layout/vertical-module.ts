import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VerticalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { renderUnitField, renderSelectField } from '../../utils/form-utils';

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
          ? children.map((child, i) => renderChildModule(child, hass, i))
          : renderEmptySlot('Empty column')}
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

    return html`
      <div class="mc-tab-content">
        ${renderUnitField('Gap', c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as VerticalModuleConfig['align'] }), 'align', syncCtx)}
      </div>
    `;
  }

}

ModuleRegistry.register(new VerticalModule());
