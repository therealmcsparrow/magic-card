import type { LookGalleryModule, LookGalleryOpenOptions } from '../contracts/look-gallery';
import { setI18nLocale } from '../i18n/runtime';
import { defineUiKit } from '../ui-kit';
import type { UiWindow } from '../ui-kit';
import { t } from './i18n';
import { revokePreviews } from './store';
import { GALLERY_TAG, MagicCardLookGallery } from './window';

// Chunk entry (look-gallery 1.0.0): the gallery as a full-screen ui-kit window over the editor.

export const openLookGallery: LookGalleryModule['openLookGallery'] = (host: HTMLElement, options: LookGalleryOpenOptions): (() => void) => {
  setI18nLocale(options.hass);
  defineUiKit();

  const win = document.createElement('mc-ui-window') as UiWindow;
  win.setAttribute('variant', 'sheet');
  win.setAttribute('size', 'xl');
  win.heading = t('look-gallery.window.title');
  win.closeLabel = t('look-gallery.window.close');
  win.maximized = true;

  const gallery = document.createElement(GALLERY_TAG) as MagicCardLookGallery;
  gallery.hass = options.hass;
  gallery.config = options.config;

  let done = false;
  const finish = (keep: { config: LookGalleryOpenOptions['config']; name: string } | null): void => {
    if (done) return;
    done = true;
    win.removeEventListener('keydown', onKey, true);
    win.removeEventListener('mc-window-close', onClose);
    const state = gallery.state;
    win.remove();
    if (state) {
      try {
        revokePreviews(state);
      } catch {
        // closing never depends on the release of preview images
      }
    }
    if (keep) options.onKeep(keep.config, { name: keep.name });
    else options.onClose();
  };
  const onClose = (): void => finish(null);
  const onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    if (!gallery.cancelPreview()) finish(null);
  };

  gallery.onKeep = (config, name) => finish({ config, name });
  gallery.onLeave = onClose;

  win.addEventListener('keydown', onKey, true);
  win.addEventListener('mc-window-close', onClose);
  win.append(gallery);
  host.append(win);
  win.show();

  return onClose;
};
