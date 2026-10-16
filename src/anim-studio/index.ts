// first: the public path of the lazy chunks, before any module can call import()
import './public-path';
import { AnimationStudio } from './studio';
import { AnimationStage } from './studio-stage';
import { AnimationThumb } from './studio-thumb';
// The kind editors define their own elements (mc-anim-*-editor, mc-anim-bezier-editor,
// mc-anim-path-overlay; see editor-slots.ts). They use the card bundle's mc-unit-field /
// mc-color-picker by tag only, never importing them.
import './editors/keyframes-editor';
import './editors/particles-editor';
import './editors/path-editor';
import './editors/path-overlay';
import './editors/sequence-editor';
// studio v2 panels (each registers itself with slots.ts registerPanel when imported)
// icon parts (track B)
import './editors/parts-layers';
import './editors/parts-overlay';
import './editors/part-inspector';
// drawing tools, shape layers and inspector, SVG dialog (track C; draw-tools imports the rest)
import './editors/draw-tools';
// card parts (track D)
import './editors/targets-layers';
// states, value bindings, preview entity (track E)
import './editors/states-panel';
import './editors/bindings-panel';
import './editors/stage-sim';
// icon animator (0.0.34): part presets, the icon animation start with the icon library
import './editors/part-presets-panel';
import './editors/icon-start';

/*
 * Entry of dist/magic-card-animation-studio.js (loaded by the magic-card-utils panel, never by a
 * dashboard). It defines only the studio's own elements; the preview uses the `magic-card` the page
 * already loaded (magic-card.js), so no element is ever defined twice.
 */

export const STUDIO_ELEMENTS: Array<[string, CustomElementConstructor]> = [
  ['magic-card-animation-studio', AnimationStudio],
  ['mcas-stage', AnimationStage],
  ['mcas-thumb', AnimationThumb],
];

for (const [tag, ctor] of STUDIO_ELEMENTS) if (!customElements.get(tag)) customElements.define(tag, ctor);

export { AnimationStudio, AnimationStage, AnimationThumb };

declare global {
  interface HTMLElementTagNameMap {
    'magic-card-animation-studio': AnimationStudio;
    'mcas-stage': AnimationStage;
    'mcas-thumb': AnimationThumb;
  }
}
