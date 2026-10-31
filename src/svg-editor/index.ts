import { SVG_EDITOR_CONTRACT_VERSION, SVG_EDITOR_TAG } from '../contracts/svg-editor';
import { McSvgEditor } from './mc-svg-editor';

/*
 * The SVG editor chunk, loaded by import() from the card-editor chunk; it defines <mc-svg-editor> once.
 * Imports lit, contracts, path core, icons, editor tokens, the ui kit, the path canvas loader and this folder only.
 */

if (!customElements.get(SVG_EDITOR_TAG)) customElements.define(SVG_EDITOR_TAG, McSvgEditor);

export { SVG_EDITOR_CONTRACT_VERSION, McSvgEditor };
