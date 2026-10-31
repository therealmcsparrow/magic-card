import { VERSION } from '../version';
import { setI18nLocale } from '../i18n/runtime';
import { loadEditor } from './editor-loader';
import { loadSeasonal } from './lazy-chunks';

/** Current contract for the magic-card-utils panel (bump on a breaking change). */
export const API_VERSION = 1;

/**
 * Publish `window.MagicCard`, merging into an existing object. Adds `loadEditor` (loads the editor
 * chunk), `loadSeasonal` (loads the seasonal chunk) and `setLocale` (follows the HA language).
 */
export function publishContract(win: Window = window): void {
  win.MagicCard = { ...win.MagicCard, version: VERSION, apiVersion: API_VERSION, loadEditor, loadSeasonal, setLocale: setI18nLocale };
}
