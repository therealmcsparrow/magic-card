import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { base } from './styles';
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
 * <mcte-save-bar>: the Save button, the visible reason when it is off, and the persistent line after
 * a clean save (design 8 and 16.4). Save is `aria-disabled`, never `disabled`, so focus stays.
 * Events: `mcte-save`, `mcte-use` (Use this theme), `mcte-reason-action` { action }.
 */
export class McteSaveBar extends LitElement {
  static properties: PropertyDeclarations = {
    reason: { attribute: false },
    saving: { type: Boolean },
    savedAt: {},
    usedMessage: {},
    canUse: { type: Boolean },
    showShortcut: { type: Boolean, attribute: 'show-shortcut' },
  };

  reason: SaveReason | null = null;
  saving = false;
  /** "14:02" after a clean save, until the next edit. */
  savedAt = '';
  /** The message shown after "Use this theme". */
  usedMessage = '';
  canUse = true;
  showShortcut = false;

  private _save(): void {
    if (this.reason || this.saving) return;
    fire(this, 'mcte-save');
  }

  focusSave(): void {
    this.renderRoot.querySelector<HTMLElement>('.save')?.focus();
  }

  protected render(): TemplateResult {
    const off = !!this.reason || this.saving;
    return html`
      <div class="line">
        ${this.reason && !this.saving && !(this.reason.quiet && this.savedAt)
          ? html`<span class="help reason" id="reason">${this.reason.text}</span>${this.reason.action
              ? html`<button type="button" class="btn btn-text btn-sm" @click=${() => fire(this, 'mcte-reason-action', { action: this.reason?.action })}>
                  ${this.reason.actionLabel}
                </button>`
              : nothing}`
          : nothing}
        ${this.savedAt && (!this.reason || this.reason.quiet)
          ? html`<span class="help saved" role="status">Saved ${this.savedAt}</span>${this.canUse
              ? html`<button type="button" class="btn btn-text btn-sm" @click=${() => fire(this, 'mcte-use')}>Use this theme</button>`
              : nothing}`
          : nothing}
        ${this.usedMessage ? html`<span class="help" role="status">${this.usedMessage}</span>` : nothing}
      </div>
      ${this.showShortcut ? html`<span class="help kbd" aria-hidden="true">Ctrl+S</span>` : nothing}
      <button
        type="button"
        class="btn btn-primary save"
        aria-disabled=${off ? 'true' : 'false'}
        aria-busy=${this.saving ? 'true' : 'false'}
        aria-describedby=${ifDefined(this.reason ? 'reason' : undefined)}
        title="Save (Ctrl+S)"
        @click=${this._save}
      >
        ${this.saving ? html`<span class="spin" aria-hidden="true"></span> Saving...` : 'Save'}
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
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .line {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 8px;
        justify-content: flex-end;
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
