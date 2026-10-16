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
        ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
        ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, c.entity, 'attribute', syncCtx)}
        ${stateObj && own?.readOnly
          ? renderFieldHint('This value can only be shown: the entity (or this attribute) cannot be set from a slider.')
          : nothing}
        ${renderNumberField('Min', c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField('Max', c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField('Step', c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint("Empty: the entity's own range and step. Min and max can only narrow that range.")}
        ${renderToggleField('Show value', c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${renderSelectField(
          'Direction',
          c.direction,
          [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
          (v) => onChange({ ...c, direction: v as SliderModuleConfig['direction'] }),
          'direction',
          syncCtx,
        )}
        ${renderColorField('Slider color', c.slider_color, (v) => onChange({ ...c, slider_color: v || undefined }), 'slider_color', syncCtx)}
        ${renderColorField('Track color', c.track_color, (v) => onChange({ ...c, track_color: v || undefined }), 'track_color', syncCtx)}
      </div>
    `;
  },
};
