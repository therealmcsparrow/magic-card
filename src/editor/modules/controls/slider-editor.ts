import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SliderModuleConfig } from '../../../types';
import {
  renderToggleField,
    renderSelectField,
  renderAttributeField,
  renderNumberField,
  renderColorField,
  renderFieldHint,
} from '../../../utils/form-utils';
import { numericControl } from '../../../utils/entity-control';
import { entityStateColor } from '../../../utils/entity-color';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';
import '../../components/slider-look-host';

const optional = (v: number) => (Number.isFinite(v) ? v : undefined);

export const sliderEditor: ModuleEditor = {
  type: 'slider',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SliderModuleConfig;
    const eid = entityFor(c, scope);
    const stateObj = eid ? hass?.states[eid] : undefined;
    const paint = { color: entityStateColor(stateObj) ?? 'currentColor', attributes: stateObj?.attributes };
    const own = stateObj ? numericControl(hass, stateObj, c.attribute) : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${stateObj && own?.readOnly
          ? renderFieldHint(t('This value can only be shown: the entity (or this attribute) cannot be set from a slider.'))
          : nothing}
        ${renderNumberField(t('Min'), c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField(t('Max'), c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField(t('Step'), c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint(t("Empty: the entity's own range and step. Min and max can only narrow that range."))}
        ${renderToggleField(t('Show value'), c.show_value !== false, (v) => onChange({ ...c, show_value: v }), 'show_value', syncCtx)}
        ${renderFieldHint(t('Same as Where in Look.'))}
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
        ${c.use_entity_color
          ? html`<div class="mc-field">
              <div class="field-head"><span class="lbl">${t('Slider colour')}</span></div>
              <p class="help">${t('Following the light')} <button type="button" class="btn sm ghost" @click=${() => onChange({ ...c, use_entity_color: undefined })}>${t('Use own colour')}</button></p>
            </div>`
          : renderColorField(t('Slider colour'), c.slider_color, (v) => onChange({ ...c, slider_color: v || undefined }), 'slider_color', syncCtx, '', '', paint)}
        ${renderColorField(t('Track colour'), c.track_color, (v) => onChange({ ...c, track_color: v || undefined }), 'track_color', syncCtx, '', '', paint)}
        <mc-slider-look-host .config=${c} .hass=${hass} .template=${template} .entity=${eid} .onChange=${(next: SliderModuleConfig) => onChange(next)}></mc-slider-look-host>
      </div>
    `;
  },
};
