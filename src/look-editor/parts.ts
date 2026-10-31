import { defineFlowLookEditor } from './flow/element';
import { defineSliderLookEditor } from './slider/mc-slider-look-editor';

// The look editors parts: each exports one guarded define function, which chunk.ts calls from install().
export const lookEditorParts: ReadonlyArray<() => void> = [
  defineFlowLookEditor,
  defineSliderLookEditor,
];
