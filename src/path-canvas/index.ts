import { PATH_CANVAS_CONTRACT_VERSION, PATH_CANVAS_TAG } from '../contracts/path-canvas';
import * as pathEdit from '../path/edit';
import { ellipsePath, fitCubics, fitFreehand, linePath, polygonPath, rdp, rectPath, starPath } from '../path/draw';
import { primitive } from '../path/primitives';
import { tidyPath } from '../path/tidy';
import { createHistory } from './history';
import { PathCanvas } from './mc-path-canvas';

/*
 * The path canvas chunk (dist/magic-card-path-canvas.js): defines <mc-path-canvas> once and hands
 * the editor-only path-model parts to the SVG and shape editor chunks. Never loaded by magic-card.js.
 */

if (!customElements.get(PATH_CANVAS_TAG)) customElements.define(PATH_CANVAS_TAG, PathCanvas);

export { PATH_CANVAS_CONTRACT_VERSION, createHistory, pathEdit };
export const pathTidy = { tidyPath };
export const pathDraw = { rectPath, ellipsePath, linePath, polygonPath, starPath, fitFreehand, fitCubics, rdp, primitive };
