import { SVG_EDITOR_CONTRACT_REVISION, SVG_EDITOR_CONTRACT_VERSION, SHAPE_EDITOR_TAG } from '../contracts/svg-editor';
import { McShapeStudio } from './mc-shape-studio';
import { presetToCustom } from './model';

/*
 * The shape editor chunk (dist/magic-card-shape-editor.js, contract svg-editor 1.0.0, shape part). Loaded
 * with import() by the card-editor chunk (loader.ts), never by magic-card.js. It defines <mc-shape-studio>
 * once. Chunk rules: imports lit, src/contracts/, src/path/core.ts (shared path-core chunk), the runtime shape code that already
 * lives in magic-card.js (src/utils/shape-path.ts, shape-ref.ts, shape-custom-loader.ts), the path canvas
 * through src/path-canvas/loader.ts and this folder only. Never src/path/draw.ts, src/path/edit.ts,
 * src/path/tidy.ts, src/utils/shape-custom.ts (the builder is its own chunk), src/anim-studio/**,
 * src/svg-editor/** or src/editor/**.
 */

if (!customElements.get(SHAPE_EDITOR_TAG)) customElements.define(SHAPE_EDITOR_TAG, McShapeStudio);

export { SVG_EDITOR_CONTRACT_REVISION, SVG_EDITOR_CONTRACT_VERSION, McShapeStudio, presetToCustom };
