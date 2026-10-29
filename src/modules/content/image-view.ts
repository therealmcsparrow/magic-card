import { html, TemplateResult, nothing } from 'lit';
import type { ModuleView } from '../../contracts/lazy-module';
import { CardModule, HomeAssistant, ImageModuleConfig } from '../../types';
import { cssAspectRatio } from '../../utils/aspect-ratio';
import { mediaSrc, safeSnapshotSrc } from '../../utils/media';
import { mediaSourceId, reportMediaError } from '../../services/media-resolver';
import { stableSrc } from '../../utils/stable-src';
import { currentRenderContext } from '../../services/render-context';
import { needSvgImage } from '../../utils/svg-image-loader';
import { t } from '../i18n';

/** A library image reference (contract svg-image IMAGE_REF_RE; tests/image-view-library.test.ts keeps the two equal). */
const LIBRARY_REF = /^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/;

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

/** A library drawing that is missing shows the image-off placeholder; when it is drawn after all (a retry), the drawing again. */
const onDrawingStatus = (e: Event) => {
  const drawing = e.target as HTMLElement;
  const missing = (e as CustomEvent<{ status: string }>).detail?.status === 'missing';
  drawing.parentElement?.classList.toggle('mc-image--broken', missing);
  drawing.style.display = missing ? 'none' : 'block';
};

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
    const lib = LIBRARY_REF.test(c.image ?? '') ? c.image : undefined;
    if (lib) return this.libraryPreview(c, lib, hass);
    // a reference that is not well formed is never a URL
    const src = this.imageSource(c.image?.startsWith('mcu-image:') ? { ...c, image: '' } : c, hass);
    // the static image is browsed media: its id, so a failed (expired) URL is resolved again
    const mediaId = src && src === mediaSrc(hass, c.image) ? mediaSourceId(c.image) : undefined;
    const fit = ['contain', 'cover', 'fill', 'none'].includes(c.fit as string) ? c.fit : 'cover';

    return html`
      <div class="mc-module mc-image" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)};">
        ${src
          ? html`<img src=${stableSrc(src)} data-mc-media=${mediaId ?? nothing} style="object-fit: ${fit};" alt="" .alt=${c.description ?? ''} @error=${onImageError} @load=${onImageLoad} /><div
                class="mc-image-fallback mc-image-error"><ha-icon icon="mdi:image-off"></ha-icon></div>`
          : html`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `;
  }

  /** A saved drawing: <mc-svg-image> (svg-image chunk) in the module's box; a missing item shows the placeholder with a plain text, no id. */
  private libraryPreview(c: ImageModuleConfig, ref: string, hass?: HomeAssistant): TemplateResult {
    needSvgImage(currentRenderContext());
    const fit = ['contain', 'cover', 'fill', 'none'].includes(c.fit as string) ? c.fit : undefined;
    return html`
      <div class="mc-module mc-image" data-mc-flow-end style="aspect-ratio: ${cssAspectRatio(c.aspect_ratio)};">
        <mc-svg-image
          style="display: block; width: 100%; height: 100%;"
          .ref=${ref}
          .hass=${hass}
          .colors=${c.colors}
          .fit=${fit}
          .entity=${c.entity}
          .description=${c.description}
          .stateSummary=${c.state_summary === true}
          @mc-svg-image-status=${onDrawingStatus}
        ></mc-svg-image>
        <div class="mc-image-fallback mc-image-error">
          <span class="mc-image-missing" style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 6px; background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121);">
            <ha-icon icon="mdi:image-off"></ha-icon>
            <span>${t('modules-extra.image-view.picture-not-available')}</span>
          </span>
        </div>
      </div>
    `;
  }
}
