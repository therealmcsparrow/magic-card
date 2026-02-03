import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ImageModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField, renderSelectField } from '../../utils/form-utils';

class ImageModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'image',
    name: 'Image',
    description: 'Display a static image or entity picture',
    category: 'content',
    icon: 'mdi:image',
  };

  createDefault(): ImageModuleConfig {
    return {
      id: generateId('image'),
      type: 'image',
      image: '',
      entity_picture: false,
      aspect_ratio: '16:9',
      fit: 'cover',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ImageModuleConfig;
    let src = c.image || '';

    if (c.entity_picture && c.entity && hass) {
      const entity = hass.states[c.entity];
      if (entity?.attributes.entity_picture) {
        src = entity.attributes.entity_picture as string;
      }
    }

    const fitStyle = c.fit || 'cover';
    const aspectRatio = c.aspect_ratio || '16:9';

    return html`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${aspectRatio.replace(':', '/')}; overflow: hidden;"
      >
        ${src
          ? html`<img
              src=${src}
              style="width: 100%; height: 100%; object-fit: ${fitStyle}; display: block;"
              alt=""
            />`
          : html`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult {
    const c = config as ImageModuleConfig;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass)}
        ${renderToggleField('Use Entity Picture', c.entity_picture, (v) =>
          onChange({ ...c, entity_picture: v }),
        )}
        ${!c.entity_picture
          ? renderTextField('Image URL', c.image, (v) => onChange({ ...c, image: v }))
          : nothing}
        ${renderTextField('Aspect Ratio', c.aspect_ratio, (v) =>
          onChange({ ...c, aspect_ratio: v }),
        )}
        ${renderSelectField(
          'Fit',
          c.fit,
          [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
            { label: 'None', value: 'none' },
          ],
          (v) => onChange({ ...c, fit: v as ImageModuleConfig['fit'] }),
        )}
      </div>
    `;
  }

  validate(config: CardModule): string[] {
    const errors: string[] = [];
    const c = config as ImageModuleConfig;
    if (!c.image && !c.entity_picture) {
      errors.push('An image URL or entity picture source is required');
    }
    if (c.entity_picture && !c.entity) {
      errors.push('Entity is required when using entity picture');
    }
    return errors;
  }
}

ModuleRegistry.register(new ImageModule());
