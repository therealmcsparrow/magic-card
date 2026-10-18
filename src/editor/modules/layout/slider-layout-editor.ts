import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SliderLayoutModuleConfig } from '../../../types';
import { renderNumberField, renderToggleField } from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

export const sliderLayoutEditor: ModuleEditor = {
  type: 'slider-layout',
  general(config, _hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SliderLayoutModuleConfig;

    return html`
      <div class="mc-tab-content">
        ${renderToggleField(t('Pagination'), c.pagination !== false, (v: boolean) => onChange({ ...c, pagination: v }), 'pagination', syncCtx)}
        ${renderToggleField(t('Navigation'), c.navigation !== false, (v: boolean) => onChange({ ...c, navigation: v }), 'navigation', syncCtx)}
        ${renderNumberField(t('Slides per view'), c.slides_per_view ?? 1, (v) => onChange({ ...c, slides_per_view: v > 0 ? v : 1 }),
          { min: 1, max: 6, step: 0.1 }, 'slides_per_view', syncCtx)}
        ${renderNumberField(t('Space between slides (px)'), c.space_between ?? 8, (v) => onChange({ ...c, space_between: v >= 0 ? v : 0 }),
          { min: 0, step: 1 }, 'space_between', syncCtx)}
        ${renderToggleField(t('Loop'), c.loop, (v: boolean) => onChange({ ...c, loop: v }), 'loop', syncCtx,
          t('After the last slide, go back to the first one'))}
        ${renderToggleField(t('Autoplay'), c.autoplay, (v: boolean) => onChange({ ...c, autoplay: v }), 'autoplay', syncCtx)}
        ${c.autoplay
          ? renderNumberField(t('Autoplay delay (ms)'), c.autoplay_delay ?? 5000, (v) => onChange({ ...c, autoplay_delay: v }),
            { min: 1000, step: 500 }, 'autoplay_delay', syncCtx)
          : nothing}
      </div>
    `;
  },
};
