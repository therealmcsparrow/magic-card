import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CameraModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField } from '../../utils/form-utils';

class CameraModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'camera',
    name: 'Camera',
    description: 'Display a camera entity stream',
    category: 'content',
    icon: 'mdi:cctv',
  };

  createDefault(): CameraModuleConfig {
    return {
      id: generateId('camera'),
      type: 'camera',
      aspect_ratio: '16:9',
      show_controls: true,
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as CameraModuleConfig;
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    const entityPicture = entity?.attributes.entity_picture as string | undefined;
    const name = entity?.attributes.friendly_name || c.entity || 'No camera';

    return html`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(c.aspect_ratio || '16:9').replace(':', '/')}">
        ${entityPicture
          ? html`<img src="${entityPicture}" alt="${name}" />`
          : html`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${name}
            </div>`}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as CameraModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Camera Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderTextField('Aspect Ratio', c.aspect_ratio, (v) => onChange({ ...c, aspect_ratio: v }))}
        ${renderToggleField('Show Controls', c.show_controls, (v) => onChange({ ...c, show_controls: v }))}
      </div>
    `;
  }
}

ModuleRegistry.register(new CameraModule());
