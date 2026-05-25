import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, CameraModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField, renderAttributeField } from '../../utils/form-utils';
import { SyncContext } from '../../utils/sync-path';

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
          : html`<div class="mc-camera-fallback">
              <ha-icon icon="mdi:cctv"></ha-icon>${name}
            </div>`}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as CameraModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Camera Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, 'camera', 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v }), hass, c.entity, 'attribute', syncCtx)}
        ${renderTextField('Aspect Ratio', c.aspect_ratio, (v) => onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx)}
        ${renderToggleField('Show Controls', c.show_controls, (v) => onChange({ ...c, show_controls: v }), 'show_controls', syncCtx)}
      </div>
    `;
  }
}

ModuleRegistry.register(new CameraModule());
