import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SeparatorModuleConfig, EditorTab } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderSelectField, renderColorField } from '../../utils/form-utils';

class SeparatorModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'separator',
    name: 'Separator',
    description: 'Visual divider between modules',
    category: 'layout',
    icon: 'mdi:minus',
  };

  getAvailableTabs(): EditorTab[] {
    return ['general', 'logic', 'design'];
  }

  createDefault(): SeparatorModuleConfig {
    return {
      id: generateId('separator'),
      type: 'separator',
      separator_style: 'solid',
      separator_color: 'var(--divider-color, #e5e7eb)',
      separator_width: '1px',
      direction: 'horizontal',
    };
  }

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const c = config as SeparatorModuleConfig;
    const isVertical = c.direction === 'vertical';

    if (isVertical) {
      return html`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${c.separator_style || 'solid'}; border-left-color:${c.separator_color || 'var(--divider-color)'}; border-left-width:${c.separator_width || '1px'}">
        </div>
      `;
    }

    return html`
      <hr class="mc-module mc-separator"
        style="border-top-style:${c.separator_style || 'solid'}; border-top-color:${c.separator_color || 'var(--divider-color)'}; border-top-width:${c.separator_width || '1px'}" />
    `;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as SeparatorModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderSelectField('Direction', c.direction, [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ], (v) => onChange({ ...c, direction: v as 'horizontal' | 'vertical' }))}
        ${renderSelectField('Style', c.separator_style, [
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'None', value: 'none' },
        ], (v) => onChange({ ...c, separator_style: v as SeparatorModuleConfig['separator_style'] }))}
        ${renderColorField('Color', c.separator_color, (v) => onChange({ ...c, separator_color: v }))}
        ${renderTextField('Width', c.separator_width, (v) => onChange({ ...c, separator_width: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new SeparatorModule());
