import { DisplayConfig, DisplayCondition, HomeAssistant } from '../types';
import { currentRenderContext } from './render-context';
import { templateResultTruthy } from './template-controller';
import { templateVars } from '../utils/entity-scope';

export class ConditionsService {
  static evaluate(display: DisplayConfig | undefined, hass: HomeAssistant | undefined): boolean {
    if (!display?.conditions?.length) return true;
    if (!hass) return true;

    const results = display.conditions.map((cond) => ConditionsService.evaluateCondition(cond, hass));

    return display.mode === 'any' ? results.some(Boolean) : results.every(Boolean);
  }

  /**
   * Whether a condition is filled in enough to decide anything: a state / attribute condition needs
   * its entity (an attribute one its attribute too), a template one its template, a time one a bound.
   */
  static isComplete(cond: DisplayCondition | undefined): boolean {
    if (!cond || typeof cond !== 'object') return false;
    switch (cond.type) {
      case 'state':
        return !!cond.entity?.trim();
      case 'attribute':
        return !!cond.entity?.trim() && !!cond.attribute?.trim();
      case 'template':
        return !!cond.template?.trim();
      case 'time':
        return !!cond.after?.trim() || !!cond.before?.trim();
      default:
        return false;
    }
  }

  /**
   * A design / appearance rule is active when it has conditions, all of them complete, and they
   * match. A rule still being set up (no conditions, or one without its entity) changes nothing.
   */
  static ruleMatches(rule: { conditions?: DisplayCondition[]; mode?: 'every' | 'any' }, hass: HomeAssistant | undefined): boolean {
    const conditions = rule.conditions;
    if (!Array.isArray(conditions) || !conditions.length || !conditions.every((c) => ConditionsService.isComplete(c))) return false;
    return ConditionsService.evaluate({ conditions, mode: rule.mode }, hass);
  }

  static evaluateCondition(cond: DisplayCondition, hass: HomeAssistant): boolean {
    switch (cond.type) {
      case 'state':
        return ConditionsService.evaluateStateCondition(cond, hass);
      case 'attribute':
        return ConditionsService.evaluateAttributeCondition(cond, hass);
      case 'time':
        return ConditionsService.evaluateTimeCondition(cond);
      case 'template':
        return ConditionsService.evaluateTemplateCondition(cond);
      default:
        return true;
    }
  }

  /**
   * Met when the template renders truthy (true / yes / on / enable or a non-zero number). The result
   * comes from the render_template subscription of the card being rendered; until it arrives, on
   * error, or outside a card render it is not met. An empty template is not configured yet: met.
   */
  private static evaluateTemplateCondition(cond: DisplayCondition): boolean {
    if (!cond.template?.trim()) return true;
    const ctx = currentRenderContext();
    const result = ctx?.template(cond.template, templateVars(cond.template, ctx.entity, ctx.cardEntity));
    return result?.status === 'ok' && templateResultTruthy(result.result);
  }

  private static evaluateStateCondition(cond: DisplayCondition, hass: HomeAssistant): boolean {
    if (!cond.entity) return true;
    const entity = hass.states[cond.entity];
    if (!entity) return false;

    const state = entity.state;

    if (cond.state !== undefined && cond.state !== '') {
      return state === cond.state;
    }
    if (cond.state_not !== undefined && cond.state_not !== '') {
      return state !== cond.state_not;
    }

    const numState = Number(state);
    if (!isNaN(numState)) {
      if (cond.above !== undefined && numState <= cond.above) return false;
      if (cond.below !== undefined && numState >= cond.below) return false;
    }

    return true;
  }

  private static evaluateAttributeCondition(cond: DisplayCondition, hass: HomeAssistant): boolean {
    if (!cond.entity || !cond.attribute) return true;
    const entity = hass.states[cond.entity];
    if (!entity) return false;

    const val = String(entity.attributes[cond.attribute] ?? '');

    if (cond.state !== undefined && cond.state !== '') {
      return val === cond.state;
    }
    if (cond.state_not !== undefined && cond.state_not !== '') {
      return val !== cond.state_not;
    }

    const numVal = Number(val);
    if (!isNaN(numVal)) {
      if (cond.above !== undefined && numVal <= cond.above) return false;
      if (cond.below !== undefined && numVal >= cond.below) return false;
    }

    return true;
  }

  private static evaluateTimeCondition(cond: DisplayCondition): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (cond.after) {
      const parts = cond.after.split(':').map(Number);
      if (parts.length >= 2) {
        const afterMinutes = parts[0] * 60 + parts[1];
        if (currentMinutes < afterMinutes) return false;
      }
    }

    if (cond.before) {
      const parts = cond.before.split(':').map(Number);
      if (parts.length >= 2) {
        const beforeMinutes = parts[0] * 60 + parts[1];
        if (currentMinutes >= beforeMinutes) return false;
      }
    }

    return true;
  }
}
