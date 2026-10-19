import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SpinboxModuleConfig } from '../../../types';
import { renderNumberField, renderAttributeField, renderFieldHint } from '../../../utils/form-utils';
import { numericControl } from '../../../utils/entity-control';
import { climateRange } from '../../../modules/controls/spinbox-module';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

const optional = (v: number) => (Number.isFinite(v) ? v : undefined);

export const spinboxEditor: ModuleEditor = {
  type: 'spinbox',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const syncCtx = buildSyncContext(config, template);
    const c = config as SpinboxModuleConfig;
    const eid = entityFor(c, scope);
    const stateObj = eid ? hass?.states[eid] : undefined;
    const own = stateObj ? numericControl(hass, stateObj, c.attribute) : undefined;
    return html`
      <div class="mc-tab-content">
        ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx)}
        ${stateObj && own?.readOnly
          ? renderFieldHint(t('This value can only be shown: the entity (or this attribute) cannot be set from a spinbox.'))
          : nothing}
        ${climateRange(stateObj, c.attribute)
          ? renderFieldHint(t('The thermostat keeps a range (low / high): pick target_temp_low or target_temp_high as the attribute to set one end.'))
          : nothing}
        ${renderNumberField(t('Min'), c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField(t('Max'), c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField(t('Step'), c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint(t("Empty: the entity's own range and step. Min and max can only narrow that range; a step that is not a multiple of the entity's step is replaced by the entity's."))}
      </div>
    `;
  },
};
