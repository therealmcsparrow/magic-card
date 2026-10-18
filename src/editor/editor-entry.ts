import { VERSION } from '../version';
// the card editor and everything it renders (studio, pane, YAML mode, pickers, mc-unit-field, ...)
import './magic-card-editor';
// every module's settings tabs (module-editor 1.0.0)
import './modules';
// window.MagicCard.loadSvgEditor / loadShapeEditor (svg-editor 1.0.0)
import './custom/loaders';
// the ui-kit Module (ADR 0030): one copy for the editor family; the lazy chunks below it import it too and call this copy
import { defineUiKit } from '../ui-kit';

// guarded define of mc-ui-menu / mc-ui-window / mc-ui-popover (a no-op when another bundle defined them first)
defineUiKit();

/*
 * Entry of the lazy editor chunk, dist/magic-card-editor.js (ADR 0007). Only
 * src/utils/editor-loader.ts imports it, through import(). It may import dashboard modules;
 * dashboard code never imports this file or anything under src/editor/.
 */

/** Release the chunk was built for (a literal in the build, so a stale magic-card.js can tell). */
declare const __MC_BUILD_VERSION__: string | undefined;

export const EDITOR_VERSION: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;
