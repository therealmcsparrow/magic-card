import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant, CardModule } from '../../types';
import type { LayerEditorContext } from '../../contracts/layer-editor';
import { layerEditorNote } from './layer-editor-loader';

/*
 * The Placement and Layer groups of a module's Design tab (module-editor 1.3.0), as the tag only: the
 * registry imports this light file; the elements (layer-groups.ts, mc-anchor-grid) are defined by the lazy
 * chunk magic-card-layer-editor.js (layer-editor 1.0.0). Until it lands the tag shows nothing and the note
 * says why; the rest of the design tab (the slot) renders as before.
 */
export function renderLayerGroups(
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  ctx: LayerEditorContext,
  below?: TemplateResult,
): TemplateResult {
  return html`${layerEditorNote()}<mc-layer-design .config=${config} .hass=${hass} .onChange=${onChange} .ctx=${ctx}>${below ?? nothing}</mc-layer-design>`;
}
