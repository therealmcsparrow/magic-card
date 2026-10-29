import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { SpinboxModuleConfig } from '../../../types';
import { renderNumberField, renderAttributeField, renderFieldHint } from '../../../utils/form-utils';
import { numericControl } from '../../../utils/entity-control';
import { climateRange } from '../../../modules/controls/spinbox-range';
import { entityFor, buildSyncContext } from '../base-editor';
import { t } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

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
        ${renderEntitySourceField(t('card-editor.spinbox-editor.entity'), c, onChange, hass, scope, { syncCtx })}
        ${renderAttributeField(t('card-editor.spinbox-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }), hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
        ${stateObj && own?.readOnly
          ? renderFieldHint(t('card-editor.spinbox-editor.this-value-can-only-be-shown-the-entity'))
          : nothing}
        ${climateRange(stateObj, c.attribute)
          ? renderFieldHint(t('card-editor.spinbox-editor.the-thermostat-keeps-a-range-low-high'))
          : nothing}
        ${renderNumberField(t('card-editor.spinbox-editor.min'), c.min, (v) => onChange({ ...c, min: optional(v) }), { optional: true, placeholder: own ? String(own.min) : '0' }, 'min', syncCtx)}
        ${renderNumberField(t('card-editor.spinbox-editor.max'), c.max, (v) => onChange({ ...c, max: optional(v) }), { optional: true, placeholder: own ? String(own.max) : '100' }, 'max', syncCtx)}
        ${renderNumberField(t('card-editor.spinbox-editor.step'), c.step, (v) => onChange({ ...c, step: optional(v) }), { optional: true, min: 0, placeholder: own ? String(own.step) : '1' }, 'step', syncCtx)}
        ${renderFieldHint(t("card-editor.spinbox-editor.empty-the-entity-s-own-range-and-step"))}
      </div>
    `;
  },
};
