import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VerticalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { renderChildModule, renderEmptySlot } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

class VerticalModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'vertical',
    name: lm('Vertical'),
    description: lm('Arrange child modules in a column'),
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
          : renderEmptySlot(t('Empty column'))}
      </div>
    `;
  }
}

ModuleRegistry.register(new VerticalModule());
