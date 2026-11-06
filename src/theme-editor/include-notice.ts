import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import type { PropertyDeclarations } from 'lit';
import type { IncludeStatus } from '../contracts/theme-editor';
import { glyph } from '../ui-kit/glyphs';
import { base } from './styles';
import { t } from './i18n';
import { copyText, fire } from './util';

export const THEMES_DOC_URL = 'https://github.com/therealmcsparrow/magic-card/blob/main/documentation/themes/README.md';

/** The sentence above the lines to add, for an include state (unknown states read like 'unknown'). */
const intro = (state: string): string =>
  state === 'missing'
    ? t('theme-editor.include-notice.home-assistant-only-loads-themes-from')
    : state === 'inline'
      ? t('theme-editor.include-notice.your-configuration-yaml-lists-themes')
      : state === 'other_layout'
        ? t('theme-editor.include-notice.your-configuration-yaml-loads-themes-in')
        : t('theme-editor.include-notice.the-editor-could-not-read-configuration');

/**
 * <mcte-include-notice>: the calm "one setup step" callout. Draws nothing when
 * the include state is ok. Events: `mcte-recheck` (the parent asks the backend again and sets
 * `checking` and `result`).
 */
export class McteIncludeNotice extends LitElement {
  static properties: PropertyDeclarations = {
    status: { attribute: false },
    checking: { type: Boolean },
    result: {},
    _copied: { state: true },
  };

  status: IncludeStatus | undefined;
  checking = false;
  /** The line announced after a check ("Still not found..."). */
  result = '';
  private _copied = false;

  private async _copy(): Promise<void> {
    if (!this.status) return;
    await copyText(this.status.hint);
    this._copied = true;
    setTimeout(() => (this._copied = false), 2000);
  }

  protected render(): TemplateResult | typeof nothing {
    const s = this.status;
    if (!s || s.state === 'ok') {
      return this.result ? html`<p class="help" role="status">${this.result}</p>` : nothing;
    }
    return html`<div class="notice info" part="callout">
      ${glyph('information')}
      <div class="body">
        <h3 class="title">${t('theme-editor.include-notice.one-setup-step-before-you-can-save')}</h3>
        <p>${intro(s.state)}</p>
        <pre class="code" tabindex="0" aria-label=${t('theme-editor.include-notice.lines-to-add-to-configuration-yaml')}>${s.hint}</pre>
        <details>
          <summary>${t('theme-editor.include-notice.where-do-i-add-these-lines')}</summary>
          <p>
            ${t('theme-editor.include-notice.open-configuration-yaml-with-the-file')}
          </p>
        </details>
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._copy}>${glyph('contentCopy')} ${t('theme-editor.include-notice.copy-lines')}</button>
          <button type="button" class="btn btn-secondary btn-sm" aria-disabled=${this.checking ? 'true' : 'false'} @click=${() => !this.checking && fire(this, 'mcte-recheck')}>
            ${this.checking ? html`<span class="spin" aria-hidden="true"></span> ${t('theme-editor.include-notice.checking')}` : t('theme-editor.include-notice.check-again')}
          </button>
          <a class="btn btn-text btn-sm" href=${THEMES_DOC_URL} target="_blank" rel="noopener noreferrer">${t('theme-editor.include-notice.show-me-how')}</a>
          <span class="help" role="status">${this._copied ? t('theme-editor.include-notice.copied') : this.checking ? t('theme-editor.include-notice.checking') : this.result}</span>
        </div>
        <p class="help">${t('theme-editor.include-notice.you-can-skip-this-for-now-try-on')}</p>
      </div>
    </div>`;
  }

  static styles = [
    base,
    css`
      :host {
        display: block;
      }
      a.btn {
        text-decoration: none;
      }
      summary {
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--mc-accent-ink);
      }
      details p {
        margin-top: 6px;
      }
    `,
  ];
}
