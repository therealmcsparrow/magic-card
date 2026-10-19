import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { TextModuleConfig } from '../../../types';
import { isTimer } from '../../../utils/timer';
import {
  renderTextField,
  renderToggleField,
  renderFieldHint,
    renderAttributeField,
  renderSegField,
} from '../../../utils/form-utils';
import { entityFor, buildSyncContext } from '../base-editor';
import { t, m, tl, type MessageId } from '../../i18n';
import { renderEntitySourceField } from '../../components/entity-source';

type EntityDisplay = NonNullable<TextModuleConfig['entity_display']>;

const DISPLAY_OPTIONS: Array<{ label: MessageId; value: EntityDisplay }> = [
  { label: m('State'), value: 'state' },
  { label: m('Name'), value: 'name' },
  { label: m('Name and state'), value: 'name_state' },
];
/** Timer entities also offer their live remaining time. */
const TIMER_DISPLAY_OPTIONS = [...DISPLAY_OPTIONS, { label: m('Remaining'), value: 'remaining' as EntityDisplay }];

export const textEditor: ModuleEditor = {
  type: 'text',
  entityField: true,
  general(config, hass, onChange, template, scope) {
    const c = config as TextModuleConfig;
    const eid = entityFor(c, scope);
    const syncCtx = buildSyncContext(config, template);

    // "Use entity" hides the static Text field; its value stays in the config for switching back.
    return html`
      <div class="mc-tab-content">
        ${c.use_entity
          ? nothing
          : html`
              ${renderTextField(t('Text'), c.text, (v) => onChange({ ...c, text: v }), 'text', syncCtx)}
              ${renderToggleField(t('Use template'), c.use_template, (v) =>
                onChange({ ...c, use_template: v }), 'use_template', syncCtx)}
              ${c.use_template ? renderFieldHint(t('Use Jinja2 templates: {example}', { example: "{{ states('sensor.temp') }}" })) : nothing}
            `}
        ${renderToggleField(t('Use entity'), c.use_entity, (v) => onChange({ ...c, use_entity: v }), 'use_entity', syncCtx,
          t("Shows an entity's state or name instead of the text."))}
        ${c.use_entity
          ? html`
              ${renderEntitySourceField(t('Entity'), c, onChange, hass, scope, { syncCtx })}
              ${renderAttributeField(t('Attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }),
                hass, eid, 'attribute', syncCtx)}
              ${renderSegField(t('Display'), c.entity_display, tl(isTimer(eid) || c.entity_display === 'remaining' ? TIMER_DISPLAY_OPTIONS : DISPLAY_OPTIONS),
                (v) => onChange({ ...c, entity_display: v as EntityDisplay }), 'entity_display', syncCtx)}
            `
          : nothing}
      </div>
    `;
  },
};
