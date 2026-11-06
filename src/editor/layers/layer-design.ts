import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant, CardModule } from '../../types';
import type { LayerEditorContext } from '../../contracts/layer-editor';
import { layerEditorNote } from './layer-editor-loader';

// The Placement and Layer groups of a module's Design tab (module-editor 1.3.0), as the tag only;
// the elements come from the lazy layer-editor chunk.
export function renderLayerGroups(
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  ctx: LayerEditorContext,
  below?: TemplateResult,
): TemplateResult {
  return html`${layerEditorNote()}<mc-layer-design .config=${config} .hass=${hass} .onChange=${onChange} .ctx=${ctx}>${below ?? nothing}</mc-layer-design>`;
}
