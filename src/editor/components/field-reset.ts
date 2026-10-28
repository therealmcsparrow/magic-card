import { html, TemplateResult, nothing } from 'lit';
import { t } from '../../i18n/labels';

/**
 * The reset affordance of a field head (editor system `.field-reset`): a small icon button, shown
 * only while the field has a value. Resetting removes the value, so the default / inherited value
 * applies again; the caller makes it one (undoable) edit.
 */
export function fieldReset(label: string, visible: boolean, onReset: () => void, title?: string): TemplateResult | typeof nothing {
  if (!visible) return nothing;
  return html`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${t('labels.field-reset.reset-label', { label })}
    title=${title ?? t('labels.field-reset.reset-to-default')}
    @click=${(e: Event) => {
      e.stopPropagation();
      onReset();
    }}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`;
}
