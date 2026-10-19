import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, VerticalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { layoutChildren, renderEmptySlot } from '../render-module';
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
    const laid = children.length > 0 ? layoutChildren(children, hass) : undefined;

    return html`
      <div class="mc-module mc-vertical" data-mc-layers=${laid?.layered ? '' : nothing}
        style="gap:${c.gap || '8px'}; align-items:${c.align || 'stretch'}">
        ${laid ? laid.content : renderEmptySlot(t('Empty column'))}
      </div>
    `;
  }
}

ModuleRegistry.register(new VerticalModule());
