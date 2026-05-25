import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, TextModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderFieldHint } from '../../utils/form-utils';

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
    template?: string,
  ): TemplateResult {
    const textConfig = config as TextModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);

    return html`
      <div class="mc-tab-content">
        ${renderTextField('Text', textConfig.text, (v) => onChange({ ...textConfig, text: v }), 'text', syncCtx)}
        ${renderToggleField('Use Template', textConfig.use_template, (v) =>
          onChange({ ...textConfig, use_template: v }), 'use_template', syncCtx)}
        ${textConfig.use_template
          ? renderFieldHint("Use Jinja2 templates: {{ states('sensor.temp') }}")
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
