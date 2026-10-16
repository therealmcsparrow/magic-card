import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, HorizontalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { renderUnitField, renderSelectField } from '../../utils/form-utils';

class HorizontalModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'horizontal',
    name: 'Horizontal',
    description: 'Arrange child modules in a row',
    category: 'layout',
    icon: 'mdi:arrow-split-vertical',
  };

  createDefault(): HorizontalModuleConfig {
    return {
      id: generateId('horizontal'),
      type: 'horizontal',
      modules: [],
      gap: '8px',
      align: 'center',
      justify: 'start',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as HorizontalModuleConfig;
    const children = c.modules || [];

    return html`
      <div class="mc-module mc-horizontal"
        style="gap:${c.gap || '8px'}; align-items:${c.align || 'center'}; justify-content:${c.justify || 'start'}">
        ${children.length > 0
          ? children.map((child, i) => renderChildModule(child, hass, i))
          : renderEmptySlot('Empty row')}
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
    const c = config as HorizontalModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderUnitField('Gap', c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as HorizontalModuleConfig['align'] }), 'align', syncCtx)}
        ${renderSelectField('Justify', c.justify, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Space between', value: 'space-between' },
          { label: 'Space around', value: 'space-around' },
        ], (v) => onChange({ ...c, justify: v as HorizontalModuleConfig['justify'] }), 'justify', syncCtx)}
      </div>
    `;
  }

}

ModuleRegistry.register(new HorizontalModule());
