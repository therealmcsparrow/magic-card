// Dev-only entry for dev/anim-sequence-editor.html: the sequence editor outside the studio shell.
// Built by scripts/scenarios-anim-sequence.mjs (or by hand:
//   npx webpack --mode development --entry-reset --entry ./dev/anim-sequence-entry.js --output-path .harness-build/anim-sequence --output-filename sequence.js)
// The card bundle first, as on the studio page: it defines mc-unit-field and the other shared
// editor elements, the studio's editors only use their tags.
import '../src/index';
import '../src/anim-studio/editors/sequence-editor';
import { validateAnimationDoc } from '../src/anim-studio/model';

window.__seqDev = { validateAnimationDoc };
