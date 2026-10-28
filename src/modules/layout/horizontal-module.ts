import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, HorizontalModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { layoutChildren, renderEmptySlot } from '../render-module';
import { generateId } from '../../utils/id-generator';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

class HorizontalModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'horizontal',
    name: lm('labels.horizontal-module.horizontal'),
    description: lm('labels.horizontal-module.arrange-child-modules-in-a-row'),
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
    const laid = children.length > 0 ? layoutChildren(children, hass) : undefined;

    return html`
      <div class="mc-module mc-horizontal" data-mc-layers=${laid?.layered ? '' : nothing}
        style="gap:${c.gap || '8px'}; align-items:${c.align || 'center'}; justify-content:${c.justify || 'start'}">
        ${laid ? laid.content : renderEmptySlot(t('Empty row'))}
      </div>
    `;
  }
}

ModuleRegistry.register(new HorizontalModule());
