import { defineFlowLookEditor } from './flow/element';
import { defineSliderLookEditor } from './slider/mc-slider-look-editor';

/*
 * The look editors' parts: each part exports one guarded define function (customElements.get, lit.M5). chunk.ts calls them
 * from install() after the loader has checked BUILD, so evaluating the chunk defines nothing. A part adds one import
 * line above and one entry below.
 */
export const lookEditorParts: ReadonlyArray<() => void> = [
  defineFlowLookEditor,
  defineSliderLookEditor,
];
