import { SVG_EDITOR_TAG, type SvgEditorSource, type SvgSaveDetail } from '../contracts/svg-editor';
import type { SavedImageInput } from '../contracts/mcu-library-images';
import { openLayer } from '../editor/custom/layer';
import { loadSvgEditor } from '../editor/custom/loaders';
import type { HomeAssistant } from '../types';
import { t } from './i18n';

/*
 * The card editor's side of the SVG editor in image mode (svg-editor 1.1.0): "Draw a new image" and "Edit image" open
 * <mc-svg-editor> in the top layer; an image save comes back through `onSaved`, and the layer closes. The editor saves to
 * the library itself and does not close itself.
 */

export interface ImageEditorOpen {
  /** Where focus returns (an element of the field). */
  from: HTMLElement;
  hass?: HomeAssistant;
  source: SvgEditorSource;
  onSaved(saved: SavedImageInput): void;
}

/** Resolves 'opened', or 'failed' when the editor chunk did not load (nothing changed). */
export async function openImageEditor(o: ImageEditorOpen): Promise<'opened' | 'failed'> {
  if (!(await loadSvgEditor())) return 'failed';
  const el = document.createElement(SVG_EDITOR_TAG) as HTMLElement & { hass?: unknown; source: SvgEditorSource; libraryAvailable: boolean };
  el.hass = o.hass;
  el.source = o.source;
  el.libraryAvailable = true;
  let close = (): void => undefined;
  el.addEventListener('mc-svg-save', (e) => {
    const d = (e as CustomEvent<SvgSaveDetail>).detail;
    if (d?.target !== 'image-library' || !d.saved) return;
    o.onSaved(d.saved as SavedImageInput);
    close();
  });
  el.addEventListener('mc-svg-close', () => close());
  close = openLayer(el, { from: o.from, key: 'image-field' }, undefined, t('image-tools.editor-host.image-editor'));
  return 'opened';
}
