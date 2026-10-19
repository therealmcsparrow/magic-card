import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant, CardModule } from '../../types';
import type { LayerEditorContext } from './placement-model';

/*
 * The Placement and Layer groups of a module's Design tab (module-editor 1.3.0), as the tag only: the
 * registry imports this light file, the elements (layer-groups.ts, mc-anchor-grid) are defined by one
 * import line in registry.ts, so the groups can move to a lazy chunk by replacing that line.
 */
export function renderLayerGroups(
  config: CardModule,
  hass: HomeAssistant | undefined,
  onChange: (m: CardModule) => void,
  ctx: LayerEditorContext,
  below?: TemplateResult,
): TemplateResult {
  return html`<mc-layer-design .config=${config} .hass=${hass} .onChange=${onChange} .ctx=${ctx}>${below ?? nothing}</mc-layer-design>`;
}
