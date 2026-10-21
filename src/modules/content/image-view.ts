import { html, TemplateResult, nothing } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HomeAssistant, ImageModuleConfig } from '../../types';
import { cssAspectRatio } from '../../utils/aspect-ratio';
import { mediaSrc, safeSnapshotSrc } from '../../utils/media';
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

export class ImageView implements ModuleView {
  /**
   * The image URL: an entity's attribute (when one is picked and its value is a URL, e.g. a
   * cover URL or `entity_picture_local`), else its `entity_picture` (person, image.*, camera.*,
   * media players) with "Use entity picture", else the static image. Relative HA URLs go through
   * hass.hassUrl; an entity's value is parsed like the browser does and kept only as http(s) or a raster
   * data: URL (safeSnapshotSrc), anything else shows the placeholder.
   */
  imageSource(c: ImageModuleConfig, hass?: HomeAssistant): string {
    const entity = c.entity && hass ? hass.states[c.entity] : undefined;
    let src = '';
    if (entity && c.attribute) {
      const v = entity.attributes[c.attribute];
      if (typeof v === 'string' && URL_LIKE.test(v.trim())) src = safeSnapshotSrc(hass, v.trim()) ?? '';
    }
    if (!src && c.entity_picture) {
      src = safeSnapshotSrc(hass, entity?.attributes.entity_picture) ?? '';
    } else if (!src) {
      // a browsed image is written as CSS url('...')
      return mediaSrc(hass, c.image);
    }
    return src;
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const c = config as ImageModuleConfig;
    const src = this.imageSource(c, hass);
    // the static image is browsed media: its id, so a failed (expired) URL is resolved again
    const mediaId = src && src === mediaSrc(hass, c.image) ? mediaSourceId(c.image) : undefined;
    const fit = ['contain', 'cover', 'fill', 'none'].includes(c.fit as string) ? c.fit : 'cover';

    return html`
      <div class="mc-module mc-image" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)};">
        ${src
          ? html`<img src=${stableSrc(src)} data-mc-media=${mediaId ?? nothing} style="object-fit: ${fit};" alt="" @error=${onImageError} @load=${onImageLoad} /><div
                class="mc-image-fallback mc-image-error"><ha-icon icon="mdi:image-off"></ha-icon></div>`
          : html`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `;
  }
}
