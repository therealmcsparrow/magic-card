import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SliderModuleConfig } from '../../../types';
import {
  renderToggleField,
  renderEntityField,
  renderSelectField,
  renderAttributeField,
  renderNumberField,
  renderColorField,
  renderFieldHint,
} from '../../../utils/form-utils';
import { numericControl } from '../../../utils/entity-control';
import { buildSyncContext } from '../base-editor';
import { t } from '../../i18n';

const optional = (v: number) => (Number.isFinite(v) ? v : undefined);

export const sliderEditor: ModuleEditor = {
  type: 'slider',
  general(config, hass, onChange, template) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SliderModuleConfig;
    const stateObj = c.entity ? hass?.states[c.entity] : undefined;
    const own = stateObj ? numericControl(hass, stateObj, c.attribute) : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntityField(t('Entity'), c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${stateObj && own?.readOnly
          ? renderFieldHint(t('This value can only be shown: the entity (or this attribute) cannot be set from a slider.'))
          : nothing}
        ${renderNumberField(t('Min'), c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField(t('Max'), c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField(t('Step'), c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint(t("Empty: the entity's own range and step. Min and max can only narrow that range."))}
        ${renderToggleField(t('Show value'), c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${renderSelectField(
          t('Direction'),
          c.direction,
          [
            { label: t('Horizontal'), value: 'horizontal' },
            { label: t('Vertical'), value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as SliderModuleConfig['direction'] }),
          'direction',
          syncCtx,
        )}
        ${renderColorField(t('Slider colour'), c.slider_color, (v) => onChange({ ...c, slider_color: v || undefined }), 'slider_color', syncCtx)}
        ${renderColorField(t('Track colour'), c.track_color, (v) => onChange({ ...c, track_color: v || undefined }), 'track_color', syncCtx)}
      </div>
    `;
  },
};
