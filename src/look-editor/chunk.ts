import { VERSION } from '../version';
import { lookEditorParts } from './parts';

// Chunk entry of dist/magic-card-look-editor.js (contract look-editor 1.0.0); install() defines <mc-flow-look-editor> and <mc-slider-look-editor>.
// Only the loader imports this file; evaluating it changes nothing global.

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

export function install(): void {
  for (const define of lookEditorParts) define();
}
