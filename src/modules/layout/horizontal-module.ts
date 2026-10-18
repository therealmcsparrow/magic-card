import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, HorizontalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { t } from '../../card/i18n';

class HorizontalModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'horizontal',
    get name() {
      return t('Horizontal');
    },
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
          : renderEmptySlot(t('Empty row'))}
      </div>
    `;
  }
}

ModuleRegistry.register(new HorizontalModule());
