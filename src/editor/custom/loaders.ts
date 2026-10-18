import { loadSvgEditorChunk } from '../../svg-editor/loader';
import { loadShapeEditorChunk } from '../../shape-editor/loader';

/*
 * window.MagicCard.loadSvgEditor() / loadShapeEditor() (svg-editor 1.0.0, additive, apiVersion stays 1):
 * set when the card-editor chunk loads, so magic-card.js does not grow. Each resolves true once the
 * element (<mc-svg-editor>, <mc-shape-studio>) is defined; false on failure or after 8 s, and the next
 * call tries again.
 */
export const loadSvgEditor = loadSvgEditorChunk;
export const loadShapeEditor = loadShapeEditorChunk;

if (typeof window !== 'undefined') {
  window.MagicCard = { ...window.MagicCard, loadSvgEditor, loadShapeEditor } as NonNullable<Window['MagicCard']>;
}
