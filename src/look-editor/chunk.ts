import { VERSION } from '../version';

/*
 * Chunk entry of dist/magic-card-look-editor.js (contract look-editor 1.0.0, webpackChunkName "look-editor"). Evaluating
 * this file changes nothing global: install() defines <mc-flow-look-editor> and <mc-slider-look-editor>, and
 * src/editor/look-editor-loader.ts calls it only when BUILD matches the editor chunk that loaded it. Only the loader
 * imports this file; the runtime renderers (flow-look, slider-look) never do and this chunk never imports them.
 * T9 stub: install() is empty; T10 and T11 define the two elements here (guarded with customElements.get).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  // empty until T10
}
