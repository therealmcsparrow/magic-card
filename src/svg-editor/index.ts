import { SVG_EDITOR_CONTRACT_VERSION, SVG_EDITOR_TAG } from '../contracts/svg-editor';
import { McSvgEditor } from './mc-svg-editor';

/*
 * The SVG editor chunk (dist/magic-card-svg-editor.js, contract svg-editor 1.0.0). Loaded with
 * import() by the card-editor chunk (loader.ts), never by magic-card.js. It defines <mc-svg-editor>
 * once. Chunk rules: imports lit, src/contracts/, src/path/core.ts, src/icons/ (the
 * sanitiser and icon source, already in magic-card.js), src/css/editor-system.ts (editorTokens) and src/ui-kit/ (held by
 * the card-editor chunk that loads this one, so the kit costs this chunk nothing), src/path-canvas/loader.ts and this folder only;
 * nothing from src/anim-studio/, src/editor/ or src/shape-editor/, and no src/path/edit.ts, tidy.ts or draw.ts
 * of its own (they come from the path canvas chunk).
 */

if (!customElements.get(SVG_EDITOR_TAG)) customElements.define(SVG_EDITOR_TAG, McSvgEditor);

export { SVG_EDITOR_CONTRACT_VERSION, McSvgEditor };
