import { DisplayConfig, DisplayCondition, HomeAssistant } from '../types';

export class LogicService {
  static evaluate(display: DisplayConfig | undefined, hass: HomeAssistant | undefined): boolean {
    if (!display?.conditions?.length) return true;
    if (!hass) return true;

    const results = display.conditions.map((cond) => LogicService.evaluateCondition(cond, hass));

    return display.mode === 'any' ? results.some(Boolean) : results.every(Boolean);
  }

  static evaluateCondition(cond: DisplayCondition, hass: HomeAssistant): boolean {
    switch (cond.type) {
      case 'state':
        return LogicService.evaluateStateCondition(cond, hass);
      case 'attribute':
        return LogicService.evaluateAttributeCondition(cond, hass);
      case 'time':
        return LogicService.evaluateTimeCondition(cond);
      case 'template':
        return true; // Template evaluation is async, handled by TemplateService
      default:
        return true;
    }
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
