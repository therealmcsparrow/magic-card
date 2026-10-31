import { SVG_EDITOR_CONTRACT_REVISION, SVG_EDITOR_CONTRACT_VERSION, SHAPE_EDITOR_TAG } from '../contracts/svg-editor';
import { McShapeStudio } from './mc-shape-studio';
import { presetToCustom } from './model';

// The shape editor chunk, loaded by import() from the card-editor chunk; it defines <mc-shape-studio> once.

if (!customElements.get(SHAPE_EDITOR_TAG)) customElements.define(SHAPE_EDITOR_TAG, McShapeStudio);

export { SVG_EDITOR_CONTRACT_REVISION, SVG_EDITOR_CONTRACT_VERSION, McShapeStudio, presetToCustom };
