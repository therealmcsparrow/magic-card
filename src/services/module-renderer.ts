import { TemplateResult, html } from 'lit';
import { CardModule, HomeAssistant, DesignConfig } from '../types';
import { ModuleRegistry } from '../modules/module-registry';
import { designToStyle } from '../utils/css-utils';
import { LogicService } from './logic-service';

export class ModuleRenderer {
  static render(
    module: CardModule,
    hass?: HomeAssistant,
  ): TemplateResult {
    // Check display conditions
    if (hass && !LogicService.evaluate(module.display, hass)) {
      return html``;
    }

    const handler = ModuleRegistry.get(module.type);
    if (!handler) {
      return html`<div class="mc-error">Unknown module: ${module.type}</div>`;
    }

    const designStyle = designToStyle(module.design as DesignConfig);

    return html`
      <div class="mc-module-wrapper" style=${designStyle}>
        ${handler.renderPreview(module, hass)}
      </div>
    `;
  }

  static renderAll(
    modules: CardModule[],
    hass?: HomeAssistant,
  ): TemplateResult[] {
    return modules.map((mod) => this.render(mod, hass));
  }
}
