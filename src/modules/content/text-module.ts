import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TextModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField } from '../../utils/form-utils';

class TextModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'text',
    name: 'Text',
    description: 'Display static or template text',
    category: 'content',
    icon: 'mdi:format-text',
  };

  createDefault(): TextModuleConfig {
    return {
      id: generateId('text'),
      type: 'text',
      text: 'Hello World',
    };
  }

  renderPreview(config: CardModule, _hass?: HomeAssistant): TemplateResult {
    const textConfig = config as TextModuleConfig;
    return html`<div class="mc-module mc-text">${textConfig.text || ''}</div>`;
  }

  renderGeneralTab(
    config: CardModule,
    _hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const textConfig = config as TextModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Text', textConfig.text, (v) => onChange({ ...textConfig, text: v }))}
        ${renderToggleField('Use Template', textConfig.use_template, (v) =>
          onChange({ ...textConfig, use_template: v }),
        )}
        ${textConfig.use_template
          ? html`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `
          : html``}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const textConfig = config as TextModuleConfig;
    if (!textConfig.text && !textConfig.use_template) {
      errors.push('Text content is required');
    }
    return errors;
  }
}

ModuleRegistry.register(new TextModule());
