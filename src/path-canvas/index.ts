import { PATH_CANVAS_CONTRACT_VERSION, PATH_CANVAS_TAG, type PathCanvasChunk } from '../contracts/path-canvas';
import * as pathEdit from '../path/edit';
import * as drawTools from '../path/draw';
import { tidyPath } from '../path/tidy';
import { createHistory } from './history';
import { PathCanvas } from './mc-path-canvas';

/*
 * The path canvas chunk (dist/magic-card-path-canvas.js, contract path-canvas 1.0.0 rev 2). Loaded
 * with import() by the SVG and shape editor chunks (loader.ts); never by magic-card.js. It defines
 * <mc-path-canvas> once and hands the editor-only path-model parts (edit, tidy, draw) to the editor
 * chunks, so the three of them are shipped once. Chunk rule: no imports from src/anim-studio/,
 * src/editor/, src/svg-editor/ or src/shape-editor/.
 */

if (!customElements.get(PATH_CANVAS_TAG)) customElements.define(PATH_CANVAS_TAG, PathCanvas);

export { PATH_CANVAS_CONTRACT_VERSION, createHistory, pathEdit };
export const pathTidy = { tidyPath };
export const pathDraw = drawTools as unknown as PathCanvasChunk['pathDraw'];
