// Dev-only entry for dev/anim-draw.html: the studio v2 drawing panels (toolbar + stage overlay,
// shape inspector, shapes list, own-icon dialog) outside the studio shell, over a sample icon.
// The card bundle defines mc-unit-field and mc-color-picker on a real page, so the harness imports
// them here. Built by scripts/scenarios-anim-v2-c.mjs when stale:
//   npx webpack --mode development --entry-reset --entry ./dev/anim-draw-entry.js --output-path .harness-build/anim-draw --output-filename anim-draw.js
import '../src/editor/components/unit-field';
import '../src/editor/components/color-picker';
import '../src/anim-studio/model-v2';
import '../src/anim-studio/editors/draw-tools';
import { newAnimationDoc, validateAnimationDoc } from '../src/anim-studio/model';
import { drawStore } from '../src/anim-studio/editors/draw-store';
import { cubicsToD, fitFreehand, rectPath, ellipsePath } from '../src/anim-studio/editors/draw-utils';
import { toCubicSubpaths } from '../src/icons/path-math';
import { exportRigSvg } from '../src/anim-studio/svg-export';

/** mdi:bell-ring (Pictogrammers, Apache 2.0). */
const BELL =
  'M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z';
const pieces = toCubicSubpaths(BELL)
  .filter((s) => s.length)
  .map((s, index) => ({ index, d: cubicsToD([s]) }));

window.__dr = { newAnimationDoc, validateAnimationDoc, drawStore, fitFreehand, rectPath, ellipsePath, exportRigSvg, BELL, pieces };
