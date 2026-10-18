import { VERSION } from '../version';
import { setI18nLocale } from '../i18n/runtime';
import { loadEditor } from './editor-loader';
import { loadSeasonal } from './lazy-chunks';

/** Current contract for the magic-card-utils panel (bump on a breaking change). */
export const API_VERSION = 1;

/**
 * Publish `window.MagicCard`, merging into an existing object so other keys survive. `loadEditor`
 * (additive, module-editor 1.0.0) loads the editor chunk, which defines the elements the animation
 * studio uses by tag (STUDIO_EDITOR_TAGS). `loadSeasonal` (additive, lazy-module 1.0.0) loads the
 * chunk that defines <mc-seasonal> and <mc-seasonal-deco>. `setLocale` (additive, 2026-10-18, module-editor
 * contract) is `setI18nLocale`: an entry with its own runtime copy (the animation studio) calls it so the
 * pickers that run on this bundle's runtime follow the Home Assistant language.
 */
export function publishContract(win: Window = window): void {
  win.MagicCard = { ...win.MagicCard, version: VERSION, apiVersion: API_VERSION, loadEditor, loadSeasonal, setLocale: setI18nLocale };
}
