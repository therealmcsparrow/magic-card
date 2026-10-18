import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, SeparatorModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { lm } from '../../i18n/labels/mark';

class SeparatorModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'separator',
    name: lm('Separator'),
    description: lm('Visual divider between modules'),
    category: 'layout',
    icon: 'mdi:minus',
  };

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
}

ModuleRegistry.register(new SeparatorModule());
