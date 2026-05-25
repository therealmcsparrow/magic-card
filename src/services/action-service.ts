import { ActionConfig, HomeAssistant } from '../types';

export class ActionService {
  static async execute(
    element: HTMLElement,
    hass: HomeAssistant,
    action: ActionConfig | undefined,
    entity?: string,
  ): Promise<void> {
    if (!action || action.action === 'none') return;

    if (action.confirmation) {
      const confirmed = await ActionService.confirm(action.confirmation.text);
      if (!confirmed) return;
    }

    if (action.haptic) {
      ActionService.hapticFeedback(action.haptic);
    }

    switch (action.action) {
      case 'more-info': {
        const targetEntity = action.entity || entity;
        if (targetEntity) {
          element.dispatchEvent(
            new CustomEvent('hass-more-info', {
              bubbles: true,
              composed: true,
              detail: { entityId: targetEntity },
            }),
          );
        }
        break;
      }

      case 'toggle': {
        const targetEntity = action.entity || entity;
        if (targetEntity) {
          const domain = targetEntity.split('.')[0];
          await hass.callService(domain, 'toggle', { entity_id: targetEntity });
        }
        break;
      }

      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(
            new Event('location-changed', { bubbles: true, composed: true }),
          );
        }
        break;

      case 'url':
        if (action.url_path) {
          window.open(action.url_path, '_blank');
        }
        break;

      case 'perform-action':
        if (action.service) {
          const [domain, service] = action.service.split('.');
          await hass.callService(domain, service, {
            ...action.data,
            ...action.service_data,
          });
        }
        break;

      case 'assist':
        element.dispatchEvent(
          new CustomEvent('show-dialog', {
            bubbles: true,
            composed: true,
            detail: {
              dialogTag: 'ha-voice-command-dialog',
              dialogImport: () => undefined,
              dialogParams: {},
            },
          }),
        );
        break;

      case 'fire-dom-event':
        element.dispatchEvent(
          new CustomEvent('ll-custom', {
            bubbles: true,
            composed: true,
            detail: action.data || {},
          }),
        );
        break;
    }
  }

  private static async confirm(text?: string): Promise<boolean> {
    return window.confirm(text || 'Are you sure?');
  }

  private static hapticFeedback(type: string): void {
    const event = new CustomEvent('haptic', {
      bubbles: true,
      composed: true,
      detail: { type },
    });
    window.dispatchEvent(event);
  }
}
