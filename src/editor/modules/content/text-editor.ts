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
import { t, m, tl, type MessageIndex } from '../../i18n';
import { attributeCaption, renderEntitySourceField } from '../../components/entity-source';

type EntityDisplay = NonNullable<TextModuleConfig['entity_display']>;

const DISPLAY_OPTIONS: Array<{ label: MessageIndex; value: EntityDisplay }> = [
  { label: m('card-editor.text-editor.state'), value: 'state' },
  { label: m('card-editor.text-editor.name'), value: 'name' },
  { label: m('card-editor.text-editor.name-and-state'), value: 'name_state' },
];
/** Timer entities also offer their live remaining time. */
const TIMER_DISPLAY_OPTIONS = [...DISPLAY_OPTIONS, { label: m('card-editor.text-editor.remaining'), value: 'remaining' as EntityDisplay }];

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
              ${renderTextField(t('card-editor.text-editor.text'), c.text, (v) => onChange({ ...c, text: v }), 'text', syncCtx)}
              ${renderToggleField(t('card-editor.text-editor.use-template'), c.use_template, (v) =>
                onChange({ ...c, use_template: v }), 'use_template', syncCtx)}
              ${c.use_template ? renderFieldHint(t('card-editor.text-editor.use-jinja2-templates-example', { example: '{{ states(entity) }}, {{ states(card_entity) }}' })) : nothing}
            `}
        ${renderToggleField(t('card-editor.text-editor.use-entity'), c.use_entity, (v) => onChange({ ...c, use_entity: v }), 'use_entity', syncCtx,
          t("card-editor.text-editor.shows-an-entity-s-state-or-name-instead"))}
        ${c.use_template && !c.use_entity ? renderEntitySourceField(t('card-editor.text-editor.entity'), c, onChange, hass, scope, { syncCtx }) : nothing}
        ${c.use_entity
          ? html`
              ${renderEntitySourceField(t('card-editor.text-editor.entity'), c, onChange, hass, scope, { syncCtx })}
              ${renderAttributeField(t('card-editor.text-editor.attribute'), c.attribute, (v) => onChange({ ...c, attribute: v || undefined }),
                hass, eid, 'attribute', syncCtx, attributeCaption(scope))}
              ${renderSegField(t('card-editor.text-editor.display'), c.entity_display, tl(isTimer(eid) || c.entity_display === 'remaining' ? TIMER_DISPLAY_OPTIONS : DISPLAY_OPTIONS),
                (v) => onChange({ ...c, entity_display: v as EntityDisplay }), 'entity_display', syncCtx)}
            `
          : nothing}
      </div>
    `;
  },
};
