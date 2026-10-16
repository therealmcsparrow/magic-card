// Dev-only entry for dev/anim-path.html: the path motion editor (stage overlay + inspector) outside
// the studio shell. The card bundle defines mc-unit-field and mc-color-picker on a real page, so
// the harness imports them here. Build (scripts/scenarios-anim-path.mjs does it when stale):
//   npx webpack --mode development --entry ./dev/anim-path-entry.js --output-path .harness-build/anim-path --output-filename anim-path.js
import '../src/editor/components/unit-field';
import '../src/editor/components/color-picker';
import '../src/anim-studio/editors/path-overlay';
import '../src/anim-studio/editors/path-editor';
import { newAnimationDoc, validateAnimationDoc } from '../src/anim-studio/model';
import { templatePath } from '../src/anim-studio/editors/path-utils';

window.__ap = { newAnimationDoc, validateAnimationDoc, templatePath };
