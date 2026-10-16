import { html, TemplateResult, nothing } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HomeAssistant, ImageModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { renderTextField, renderToggleField, renderEntityField, renderAttributeField, renderSelectField, renderMediaField, renderFieldHint } from '../../utils/form-utils';
import { cssAspectRatio, mediaSrc, resolveMediaUrl } from '../../utils/media';
import { mediaSourceId, reportMediaError } from '../../services/media-resolver';
import { stableSrc } from '../../utils/stable-src';

/** An attribute value that is an image address (not a name, a state or a javascript: URL). */
const URL_LIKE = /^(?:\/|https?:\/\/|data:image\/)/i;

/**
 * A broken image shows the image-off placeholder; a later successful load shows the image again.
 * Browsed media whose signed URL failed (expired) is resolved again.
 */
const onImageError = (e: Event) => {
  const img = e.target as HTMLElement;
  img.parentElement?.classList.add('mc-image--broken');
  const id = img.dataset.mcMedia;
  if (id) reportMediaError(id);
};
const onImageLoad = (e: Event) => (e.target as HTMLElement).parentElement?.classList.remove('mc-image--broken');

class ImageModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'image',
    name: 'Image',
    description: 'Display a static image or entity picture',
    category: 'content',
    icon: 'mdi:image-outline',
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

  /**
   * The image URL: an entity's attribute (when one is picked and its value is a URL, e.g. a
   * cover URL or `entity_picture_local`), else its `entity_picture` (person, image.*, camera.*,
   * media players) with "Use entity picture", else the static image. Relative HA URLs go through
   * hass.hassUrl.
   */
  imageSource(c: ImageModuleConfig, hass?: HomeAssistant): string {
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    let src = '';
    if (entity && c.attribute) {
      const v = entity.attributes[c.attribute];
      if (typeof v === 'string' && URL_LIKE.test(v.trim())) src = v.trim();
    }
    if (!src && c.entity_picture) {
      const v = entity?.attributes.entity_picture;
      if (typeof v === 'string') src = v;
    } else if (!src) {
      // a browsed image is written as CSS url('...')
      return mediaSrc(hass, c.image);
    }
    return resolveMediaUrl(hass, src);
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ImageModuleConfig;
    const src = this.imageSource(c, hass);
    // the static image is browsed media: its id, so a failed (expired) URL is resolved again
    const mediaId = src && src === mediaSrc(hass, c.image) ? mediaSourceId(c.image) : undefined;
    const fit = ['contain', 'cover', 'fill', 'none'].includes(c.fit as string) ? c.fit : 'cover';

    return html`
      <div class="mc-module mc-image" style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)};">
        ${src
          ? html`<img src=${stableSrc(src)} data-mc-media=${mediaId ?? nothing} style="object-fit: ${fit};" alt="" @error=${onImageError} @load=${onImageLoad} /><div
                class="mc-image-fallback mc-image-error"><ha-icon icon="mdi:image-off"></ha-icon></div>`
          : html`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
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
    const c = config as ImageModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);
    return html`
      <div class="mc-tab-content">
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${!c.attribute
          ? renderToggleField('Use entity picture', c.entity_picture, (v) =>
              onChange({ ...c, entity_picture: v }), 'entity_picture', syncCtx,
              "Shows the entity's picture (person, image, camera, media player).")
          : nothing}
        ${renderAttributeField('Image from attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${c.entity && c.attribute ? renderFieldHint('The attribute holds the image URL; it replaces the entity picture and the image URL.') : nothing}
        ${!c.entity_picture && !(c.entity && c.attribute)
          ? renderMediaField('Image URL', c.image, (v) => onChange({ ...c, image: v }), hass, 'image', 'image', syncCtx)
          : nothing}
        ${renderTextField('Aspect ratio', c.aspect_ratio === undefined ? undefined : String(c.aspect_ratio), (v) =>
          onChange({ ...c, aspect_ratio: v }), 'aspect_ratio', syncCtx, { placeholder: '16:9' })}
        ${c.aspect_ratio !== undefined && c.aspect_ratio !== '' && cssAspectRatio(c.aspect_ratio, '') === ''
          ? renderFieldHint('Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.')
          : nothing}
        ${renderSelectField(
          'Fit',
          c.fit,
          [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
            { label: 'None', value: 'none' },
          ],
          (v) => onChange({ ...c, fit: v as ImageModuleConfig['fit'] }), 'fit', syncCtx)}
      </div>
    `;
  }

  hints(config: CardModule): string[] {
    // No image yet is not an error: the preview shows the image-off placeholder.
    const c = config as ImageModuleConfig;
    if (c.entity_picture && !c.entity) return ['Entity is required when using entity picture'];
    return [];
  }
}

ModuleRegistry.register(new ImageModule());
