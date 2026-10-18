import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { base } from './styles';
import { t } from './i18n';
import { fire } from './util';

export interface SaveReason {
  text: string;
  /** A link-style action beside the reason: jump to the first bad value, or check the include again. */
  action?: 'fix' | 'recheck';
  actionLabel?: string;
  /** Not worth a line when the saved line shows ("No changes to save" right after a save). */
  quiet?: boolean;
}

/**
 * <mcte-save-bar>: the Save button (design 8 and 16.4). It is `aria-disabled`, never `disabled`, so focus
 * stays, and a press while it is off still fires `mcte-save` so the editor can say why and take the
 * user to the cause (a touch user has no hover). The reason line and the "Saved" line are the editor's
 * status row; this button only carries the reason as its description.
 * Event: `mcte-save`.
 */
export class McteSaveBar extends LitElement {
  static properties: PropertyDeclarations = {
    reason: { attribute: false },
    saving: { type: Boolean },
    showShortcut: { type: Boolean, attribute: 'show-shortcut' },
  };

  reason: SaveReason | null = null;
  saving = false;
  showShortcut = false;

  private _save(): void {
    if (this.saving) return;
    fire(this, 'mcte-save');
  }

  focusSave(): void {
    this.renderRoot.querySelector<HTMLElement>('.save')?.focus();
  }

  protected render(): TemplateResult {
    const off = !!this.reason || this.saving;
    return html`
      ${this.showShortcut ? html`<span class="help kbd" aria-hidden="true">Ctrl+S</span>` : nothing}
      ${this.reason ? html`<span class="sr-only" id="reason">${this.reason.text}</span>` : nothing}
      <button
        type="button"
        class="btn btn-primary save"
        aria-disabled=${off ? 'true' : 'false'}
        aria-busy=${this.saving ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.reason ? 'reason' : undefined)}
        title=${t('Save (Ctrl+S)')}
        @click=${this._save}
      >
        ${this.saving ? html`<span class="spin" aria-hidden="true"></span> ${t('Saving...')}` : t('Save')}
      </button>
    `;
  }

  static styles = [
    base,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .kbd {
        display: none;
      }
      @media (pointer: fine) and (min-width: 1024px) {
        .kbd {
          display: inline;
        }
      }
    `,
  ];
}
