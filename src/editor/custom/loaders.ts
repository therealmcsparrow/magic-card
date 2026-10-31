import { loadSvgEditorChunk } from '../../svg-editor/loader';
import { loadShapeEditorChunk } from '../../shape-editor/loader';
import { loadTransfer } from '../transfer-loader';

// window.MagicCard.loadSvgEditor() / loadShapeEditor() (svg-editor 1.0.0): set when the card-editor chunk loads.
// Each resolves true once its element is defined.
export const loadSvgEditor = loadSvgEditorChunk;
export const loadShapeEditor = loadShapeEditorChunk;
/** (module-editor 1.1.0) window.MagicCard.loadTransfer(): the preset transfer chunk, see transfer-loader.ts. */
export { loadTransfer };

/**
 * Adds the loaders to the existing window.MagicCard object in place. A caller that took `window.MagicCard`
 * before awaiting loadEditor() (the Magic Card Utils panel did) must see them; replacing the object left
 * it holding one without loadSvgEditor / loadShapeEditor / loadTransfer.
 */
export function installLoaders(): void {
  window.MagicCard = Object.assign(window.MagicCard ?? ({} as NonNullable<Window['MagicCard']>), { loadSvgEditor, loadShapeEditor, loadTransfer });
}

if (typeof window !== 'undefined') installLoaders();
