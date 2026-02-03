import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, HorizontalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderSelectField } from '../../utils/form-utils';

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
          ? children.map((child) => {
              const mod = ModuleRegistry.get(child.type);
              return mod ? mod.renderPreview(child, hass) : html`<span class="mc-error">?</span>`;
            })
          : html`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as HorizontalModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderTextField('Gap', c.gap, (v) => onChange({ ...c, gap: v }))}
        ${renderSelectField('Align', c.align, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ], (v) => onChange({ ...c, align: v as HorizontalModuleConfig['align'] }))}
        ${renderSelectField('Justify', c.justify, [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Space Between', value: 'space-between' },
          { label: 'Space Around', value: 'space-around' },
        ], (v) => onChange({ ...c, justify: v as HorizontalModuleConfig['justify'] }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new HorizontalModule());
