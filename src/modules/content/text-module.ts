import { html, nothing, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HassEntity, HomeAssistant, TextModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { currentRenderContext } from '../../services/render-context';
import { isTimer, timerCountdown } from '../../utils/timer';
import { countdown } from '../../utils/timer-countdown';
import { hasJinja, templateResultToString } from '../../services/template-controller';
import {
  renderTextField,
  renderToggleField,
  renderFieldHint,
  renderEntityField,
  renderAttributeField,
  renderSegField,
} from '../../utils/form-utils';

type EntityDisplay = NonNullable<TextModuleConfig['entity_display']>;

const DISPLAY_OPTIONS: Array<{ label: string; value: EntityDisplay }> = [
  { label: 'State', value: 'state' },
  { label: 'Name', value: 'name' },
  { label: 'Name and state', value: 'name_state' },
];
/** Timer entities also offer their live remaining time. */
const TIMER_DISPLAY_OPTIONS = [...DISPLAY_OPTIONS, { label: 'Remaining', value: 'remaining' as EntityDisplay }];

/** HA's formatters when present (localised, with units); raw values otherwise. */
function entityState(hass: HomeAssistant, stateObj: HassEntity, attribute?: string): string {
  if (attribute) {
    const formatted = hass.formatEntityAttributeValue?.(stateObj, attribute);
    return formatted ?? String(stateObj.attributes[attribute] ?? '');
  }
  const formatted = hass.formatEntityState?.(stateObj);
  if (formatted !== undefined) return formatted;
  const unit = stateObj.attributes.unit_of_measurement;
  return `${stateObj.state}${unit ? ` ${String(unit)}` : ''}`;
}

function entityName(hass: HomeAssistant, stateObj: HassEntity): string {
  const fmt = (hass as { formatEntityName?: (s: HassEntity) => string | undefined }).formatEntityName;
  const name = fmt?.(stateObj) || stateObj.attributes.friendly_name;
  return typeof name === 'string' && name ? name : stateObj.entity_id;
}

class TextModule extends BaseMagicModule {
  readonly metadata: MagicModuleMetadata = {
    type: 'text',
    name: 'Text',
    description: 'Display static or template text',
    category: 'content',
    icon: 'mdi:format-text',
  };

  createDefault(): TextModuleConfig {
    return {
      id: generateId('text'),
      type: 'text',
      text: 'Hello World',
    };
  }

  renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult {
    const textConfig = config as TextModuleConfig;
    if (textConfig.use_entity && textConfig.entity) {
      return html`<div class="mc-module mc-text" data-mc-part="name">${this._entityText(textConfig, hass)}</div>`;
    }
    if (textConfig.use_template) return html`<div class="mc-module mc-text" data-mc-part="name">${this._templateText(textConfig)}</div>`;
    return html`<div class="mc-module mc-text" data-mc-part="name">${textConfig.text || ''}</div>`;
  }

  /**
   * "Use template": the text is a Jinja template rendered by Home Assistant (render_template
   * subscription of the card). Outside a live card (no connection) the raw text is shown.
   */
  private _templateText(c: TextModuleConfig): TemplateResult | string {
    const text = c.text === undefined || c.text === null ? '' : String(c.text);
    const ctx = currentRenderContext();
    if (!ctx || !hasJinja(text)) return text;
    const result = ctx.template(text);
    switch (result.status) {
      case 'ok':
        return templateResultToString(result.result);
      case 'pending':
        return '';
      case 'error':
        return html`<span class="mc-template-error" role="alert" title=${result.error}>Template error: ${result.error}</span>`;
      default:
        return text;
    }
  }

  /** One line: the state, the name, or "Name: state". A missing entity shows its id + "unavailable". */
  private _entityText(c: TextModuleConfig, hass?: HomeAssistant): TemplateResult | string {
    const id = c.entity!;
    const stateObj = hass?.states?.[id];
    if (!hass || !stateObj) return html`${id} <span class="mc-text-muted">unavailable</span>`;
    const display = c.entity_display || 'state';
    if (display === 'name') return entityName(hass, stateObj);
    // a timer's live countdown; idle (and other entities) show the state
    if (display === 'remaining' && !c.attribute && timerCountdown(stateObj) !== undefined) return html`<span class="mc-text-countdown">${countdown(stateObj)}</span>`;
    const state = entityState(hass, stateObj, c.attribute);
    return display === 'name_state' ? `${entityName(hass, stateObj)}: ${state}` : state;
  }

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult {
    const c = config as TextModuleConfig;
    const syncCtx = this._buildSyncContext(config, template);

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
  }

  hints(config: CardModule): string[] {
    const textConfig = config as TextModuleConfig;
    if (textConfig.use_entity) return textConfig.entity ? [] : ['Entity is required'];
    if (textConfig.text) return [];
    return [textConfig.use_template ? 'Template is required' : 'Text content is required'];
  }
}

ModuleRegistry.register(new TextModule());
