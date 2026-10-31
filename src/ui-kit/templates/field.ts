import { html, nothing, type TemplateResult } from 'lit';
import type { KitFieldOptions } from '../../contracts/ui-kit';
import { iconOf } from './icon';

// Field shell: head (label, optional reset), the control of the caller, then help or error.
export const fieldHelpId = (id: string): string => `${id}-help`;
export const fieldErrorId = (id: string): string => `${id}-error`;

export function field(o: KitFieldOptions): TemplateResult {
  return html`<div class="field">
    <div class="field-head">
      <label for=${o.id}>${o.label}</label>
      ${o.onReset
        ? html`<button type="button" class="icon-btn sm field-reset" aria-label=${o.resetLabel ?? ''} title=${o.resetLabel ?? ''} @click=${o.onReset}>${iconOf({ icon: 'mdi:restore' })}</button>`
        : nothing}
    </div>
    ${o.control as TemplateResult}
    ${o.error
      ? html`<p class="help error" id=${fieldErrorId(o.id)} role="alert">${o.error}</p>`
      : o.help
        ? html`<p class="help" id=${fieldHelpId(o.id)}>${o.help}</p>`
        : nothing}
  </div>`;
}

/** A boolean setting: always a switch, never a native checkbox. */
export function switchRow(o: { id: string; label: string; help?: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void }): TemplateResult {
  return html`<div class="switch-row">
    <div class="txt">
      <div class="field-head"><label for=${o.id}>${o.label}</label></div>
      ${o.help ? html`<p class="help" id=${fieldHelpId(o.id)}>${o.help}</p>` : nothing}
    </div>
    <button
      type="button"
      class="switch"
      id=${o.id}
      role="switch"
      aria-checked=${o.checked ? 'true' : 'false'}
      aria-describedby=${o.help ? fieldHelpId(o.id) : nothing}
      ?disabled=${o.disabled}
      @click=${() => o.onChange(!o.checked)}
    ></button>
  </div>`;
}
