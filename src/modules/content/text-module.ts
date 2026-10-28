import { html, TemplateResult } from 'lit';
import { BaseMagicModule } from '../base-module';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, HassEntity, HomeAssistant, TextModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import { currentRenderContext } from '../../services/render-context';
import { timerCountdown } from '../../utils/timer';
import { countdown } from '../../utils/timer-countdown';
import { hasJinja, templateResultToString } from '../../services/template-controller';
import { templateVars } from '../../utils/entity-scope';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

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
    name: lm('labels.text-module.text'),
    description: lm('labels.text-module.display-static-or-template-text'),
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
    const result = ctx.template(text, templateVars(text, c.entity, ctx.cardEntity));
    switch (result.status) {
      case 'ok':
        return templateResultToString(result.result);
      case 'pending':
        return '';
      case 'error':
        return html`<span class="mc-template-error" role="alert" title=${result.error}>${t('Template error: {error}', { error: result.error })}</span>`;
      default:
        return text;
    }
  }

  /** One line: the state, the name, or "Name: state". A missing entity shows its id + "unavailable". */
  private _entityText(c: TextModuleConfig, hass?: HomeAssistant): TemplateResult | string {
    const id = c.entity!;
    const stateObj = hass?.states?.[id];
    if (!hass || !stateObj) return html`${id} <span class="mc-text-muted">${t('unavailable')}</span>`;
    const display = c.entity_display || 'state';
    if (display === 'name') return entityName(hass, stateObj);
    // a timer's live countdown; idle (and other entities) show the state
    if (display === 'remaining' && !c.attribute && timerCountdown(stateObj) !== undefined) return html`<span class="mc-text-countdown">${countdown(stateObj)}</span>`;
    const state = entityState(hass, stateObj, c.attribute);
    return display === 'name_state' ? `${entityName(hass, stateObj)}: ${state}` : state;
  }


  hints(config: CardModule): string[] {
    const textConfig = config as TextModuleConfig;
    if (textConfig.use_entity) return textConfig.entity ? [] : [t('Entity is required')];
    if (textConfig.text) return [];
    return [textConfig.use_template ? t('Template is required') : t('Text content is required')];
  }
}

ModuleRegistry.register(new TextModule());
