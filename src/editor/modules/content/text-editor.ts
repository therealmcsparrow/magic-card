import { html, nothing } from 'lit';
import type { ModuleEditor } from '../../../contracts/module-editor';
import type { TextModuleConfig } from '../../../types';
import { isTimer } from '../../../utils/timer';
import {
  renderTextField,
  renderToggleField,
  renderFieldHint,
  renderEntityField,
  renderAttributeField,
  renderSegField,
} from '../../../utils/form-utils';
import { buildSyncContext } from '../base-editor';

type EntityDisplay = NonNullable<TextModuleConfig['entity_display']>;

const DISPLAY_OPTIONS: Array<{ label: string; value: EntityDisplay }> = [
  { label: 'State', value: 'state' },
  { label: 'Name', value: 'name' },
  { label: 'Name and state', value: 'name_state' },
];
/** Timer entities also offer their live remaining time. */
const TIMER_DISPLAY_OPTIONS = [...DISPLAY_OPTIONS, { label: 'Remaining', value: 'remaining' as EntityDisplay }];

export const textEditor: ModuleEditor = {
  type: 'text',
  general(config, hass, onChange, template) {
    const c = config as TextModuleConfig;
    const syncCtx = buildSyncContext(config, template);

    // "Use entity" hides the static Text field; its value stays in the config for switching back.
    return html`
      <div class="mc-tab-content">
        ${c.use_entity
          ? nothing
          : html`
              ${renderTextField('Text', c.text, (v) => onChange({ ...c, text: v }), 'text', syncCtx)}
              ${renderToggleField('Use template', c.use_template, (v) =>
                onChange({ ...c, use_template: v }), 'use_template', syncCtx)}
              ${c.use_template ? renderFieldHint("Use Jinja2 templates: {{ states('sensor.temp') }}") : nothing}
            `}
        ${renderToggleField('Use entity', c.use_entity, (v) => onChange({ ...c, use_entity: v }), 'use_entity', syncCtx,
          "Shows an entity's state or name instead of the text.")}
        ${c.use_entity
          ? html`
              ${renderEntityField('Entity', c.entity, (v) => onChange({ ...c, entity: v }), hass, undefined, 'entity', syncCtx)}
              ${renderAttributeField('Attribute', c.attribute, (v) => onChange({ ...c, attribute: v || undefined }),
                hass, c.entity, 'attribute', syncCtx)}
              ${renderSegField('Display', c.entity_display, isTimer(c.entity) || c.entity_display === 'remaining' ? TIMER_DISPLAY_OPTIONS : DISPLAY_OPTIONS,
                (v) => onChange({ ...c, entity_display: v as EntityDisplay }), 'entity_display', syncCtx)}
            `
          : nothing}
      </div>
    `;
  },
};
