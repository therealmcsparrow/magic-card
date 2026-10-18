import { html, nothing, type TemplateResult } from 'lit';
import './kit';
import { t } from './i18n';

/** The focused element, looking through open shadow roots. */
export function deepActive(): HTMLElement | null {
  let a: Element | null = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return a && a !== document.body ? (a as HTMLElement) : null;
}

export interface StudioWindow {
  heading: string;
  /** A confirmation is an 'alert' (small, no scrim close, no grips); everything else is a 'sheet' (a bottom sheet on a phone). */
  variant?: 'alert' | 'sheet';
  size?: 's' | 'm' | 'l' | 'xl';
  /** Id of the element (inside body or footer) that gets focus first; default the first control. */
  initialFocus?: string;
  /** Scrim press closes (default true; never for an alert). */
  dismissible?: boolean;
  /** Runs when the window closes (Esc, the X, the scrim, or close()). */
  onClose: () => void;
}

/**
 * One window of the ui kit for the studio's dialogs and the drawing tools' SVG dialog: a title, a body and a footer of
 * buttons (slot="footer"), movable, resizable and maximisable (contract ui-kit r3). The caller shows it with show()
 * once it is rendered.
 */
export function studioWindow(o: StudioWindow, body: unknown, footer?: unknown): TemplateResult {
  const alert = o.variant === 'alert';
  return html`<mc-ui-window
    variant=${o.variant ?? 'sheet'}
    size=${o.size ?? nothing}
    heading=${o.heading}
    closeLabel=${t('Close')}
    ?movable=${!alert}
    ?resizable=${!alert}
    ?maximizable=${!alert}
    moveLabel=${t('Move window')}
    resizeLabel=${t('Resize window')}
    maximizeLabel=${t('Maximise')}
    restoreLabel=${t('Restore size')}
    initialFocus=${o.initialFocus ?? nothing}
    .dismissible=${o.dismissible ?? !alert}
    @mc-window-close=${(e: Event) => {
      e.stopPropagation();
      o.onClose();
    }}
  >
    ${body}${footer ? html`<div slot="footer" class="foot">${footer}</div>` : nothing}
  </mc-ui-window>`;
}
