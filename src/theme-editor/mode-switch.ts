import { LitElement, html, css, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { base } from './styles';
import { fire } from './util';

export interface SwitchOption {
  value: string;
  label: string;
  /** For tablists: the id of the panel this tab controls. */
  controls?: string;
}

/**
 * <mcte-mode-switch>: one segmented control with a roving tabindex. Used for the editing scope
 * (Shared / Light / Dark), the Variables / Preview tabs and the create dialog's "Start from".
 * `kind` picks the ARIA pattern: a radiogroup (default) or a tablist. Arrow keys move and select,
 * Home and End jump. Event: `mcte-change` { value }.
 */
export class McteModeSwitch extends LitElement {
  static properties: PropertyDeclarations = {
    label: {},
    options: { attribute: false },
    value: {},
    kind: {},
    full: { type: Boolean },
  };

  label = '';
  options: SwitchOption[] = [];
  value = '';
  kind: 'radiogroup' | 'tablist' = 'radiogroup';
  full = false;

  private _select(value: string, focus = false): void {
    if (value !== this.value) fire(this, 'mcte-change', { value });
    if (focus) {
      void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`)?.focus());
    }
  }

  private _key(e: KeyboardEvent): void {
    const values = this.options.map((o) => o.value);
    const at = values.indexOf(this.value);
    let to = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (at + 1) % values.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (at - 1 + values.length) % values.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = values.length - 1;
    if (to < 0) return;
    e.preventDefault();
    this._select(values[to], true);
  }

  protected render(): TemplateResult {
    const tabs = this.kind === 'tablist';
    return html`<div class="seg ${this.full ? 'full' : ''}" role=${this.kind} aria-label=${this.label} @keydown=${this._key}>
      ${this.options.map((o) => {
        const on = o.value === this.value;
        return html`<button
          type="button"
          data-value=${o.value}
          role=${tabs ? 'tab' : 'radio'}
          aria-checked=${ifDefined(tabs ? undefined : on ? 'true' : 'false')}
          aria-selected=${ifDefined(tabs ? (on ? 'true' : 'false') : undefined)}
          aria-controls=${ifDefined(o.controls)}
          tabindex=${on ? '0' : '-1'}
          @click=${() => this._select(o.value)}
        >
          ${o.label}
        </button>`;
      })}
    </div>`;
  }

  static styles = [base, css`:host { display: inline-block; max-width: 100%; } :host([full]) { display: block; }`];
}
