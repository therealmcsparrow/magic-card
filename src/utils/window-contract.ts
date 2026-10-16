import { VERSION } from '../version';
import { loadEditor } from './editor-loader';

/** Current contract for the magic-card-utils panel (bump on a breaking change). */
export const API_VERSION = 1;

/**
 * Publish `window.MagicCard`, merging into an existing object so other keys survive. `loadEditor`
 * (additive, module-editor 1.0.0) loads the editor chunk, which defines the elements the animation
 * studio uses by tag (STUDIO_EDITOR_TAGS).
 */
export function publishContract(win: Window = window): void {
  win.MagicCard = { ...win.MagicCard, version: VERSION, apiVersion: API_VERSION, loadEditor };
}
