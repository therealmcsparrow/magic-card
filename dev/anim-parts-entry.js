// Dev-only entry for dev/anim-parts.html: the icon parts panels (layers, stage overlay, part
// inspector) around the real studio stage (mcas-stage, which previews on the page's magic-card).
// Build (scripts/scenarios-anim-v2-b.mjs does it when stale):
//   npx webpack --mode development --entry-reset --entry ./dev/anim-parts-entry.js --output-path .harness-build/anim-parts --output-filename anim-parts.js
import { AnimationStage } from '../src/anim-studio/studio-stage';
import '../src/anim-studio/editors/parts-layers';
import '../src/anim-studio/editors/parts-overlay';
import '../src/anim-studio/editors/part-inspector';
import { validateAnimationDoc, newAnimationDoc } from '../src/anim-studio/model';
import '../src/anim-studio/model-v2';
import { panelsFor } from '../src/anim-studio/slots';
import { toggleHidden, hiddenParts } from '../src/anim-studio/editors/parts-model';

if (!customElements.get('mcas-stage')) customElements.define('mcas-stage', AnimationStage);

window.__parts = { validateAnimationDoc, newAnimationDoc, panelsFor, toggleHidden, hiddenParts };
