import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CopyFeedback, CopyFeedbackState } from '../../contracts/clipboard-port';
import type { HomeAssistant } from '../../types';
import { editorTokens } from '../../css/editor-system';
import type { EditorStateManager } from '../state/editor-state';
import { t } from '../i18n';
import { createClipboardPort } from './clipboard';
import { createCopyFeedback } from './copy-state';
import { buildSetupBlock } from './source';

const REASON_ID = 'mc-setup-copy-reason';

/** The Copy my setup button, its helper text and, when the browser blocks the clipboard, a read-only box holding the same text. */
@customElement('mc-setup-copy')
export class McSetupCopy extends LitElement {
  @property({ attribute: false }) sm?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _state: CopyFeedbackState = 'idle';
  @state() private _status = '';
  @state() private _text = '';
  @state() private _prepareFailed = false;

  private _feedback?: CopyFeedback;
  private _unsubscribe?: () => void;
  private _frame = 0;
  private readonly _port = createClipboardPort();

  connectedCallback(): void {
    super.connectedCallback();
    const feedback = createCopyFeedback({
      setTimeout: (cb, ms) => setTimeout(cb, ms),
      clearTimeout: (h) => clearTimeout(h as ReturnType<typeof setTimeout>),
    });
    this._feedback = feedback;
    this._state = feedback.state;
    this._unsubscribe = feedback.subscribe((s) => this._onState(s));
    document.addEventListener('pointerdown', this._onOutside, true);
    document.addEventListener('keydown', this._onKeydown, true);
  }

  disconnectedCallback(): void {
    document.removeEventListener('pointerdown', this._onOutside, true);
    document.removeEventListener('keydown', this._onKeydown, true);
    this._frame++;
    this._unsubscribe?.();
    this._feedback?.dispose();
    this._feedback = undefined;
    super.disconnectedCallback();
  }

  private readonly _onOutside = (e: Event): void => {
    if (!e.composedPath().includes(this)) this._feedback?.reset('outside-pointerdown');
  };

  private _onState(s: CopyFeedbackState): void {
    this._state = s;
    if (s === 'idle') return;
    if (s === 'copied') this._announce(t('card-editor.setup-copy.copied'));
    else this._announce(this._prepareFailed ? t('card-editor.setup-copy.failed') : t('card-editor.setup-copy.blocked-status'));
  }

  /** Clears the status node, then sets it on the next frame, so a repeat is announced again. */
  private _announce(text: string): void {
    const mine = ++this._frame;
    this._status = '';
    requestAnimationFrame(() => {
      if (mine === this._frame) this._status = text;
    });
  }

  private _onClick = (): void => {
    const feedback = this._feedback;
    if (!feedback) return;
    const ticket = feedback.click();
    let text: string;
    try {
      text = buildSetupBlock(this.sm?.getConfig());
    } catch {
      this._prepareFailed = true;
      this._text = '';
      feedback.settle(ticket, 'blocked', false);
      return;
    }
    this._prepareFailed = false;
    this._text = text;
    const coarse = (): boolean => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    void this._port.writeText(text).then((outcome) => feedback.settle(ticket, outcome, coarse()));
  };

  /** Capture on the document so the dialog around the editor never sees this Escape; preventDefault stops its native cancel. */
  private readonly _onKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape' || this._feedback?.state !== 'copied' || !e.composedPath().includes(this)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    this._feedback.reset('escape');
  };

  private _selectAll = (e: Event): void => (e.target as HTMLTextAreaElement).select();

  protected render(): TemplateResult {
    const copied = this._state === 'copied';
    const blocked = this._state === 'blocked';
    return html`<div class="box">
<button type="button" class="copy ${copied ? 'done' : ''}" @click=${this._onClick} @blur=${() => this._feedback?.reset('blur')}>
<ha-icon icon=${copied ? 'mdi:check' : 'mdi:content-copy'} aria-hidden="true"></ha-icon>
<span class="labels"><span class="label" aria-hidden=${copied ? 'true' : 'false'} ?data-off=${copied}>${t('card-editor.setup-copy.copy')}</span><span class="label" aria-hidden=${copied ? 'false' : 'true'} ?data-off=${!copied}>${t('card-editor.setup-copy.copied')}</span></span>
</button>
<div class="area"><p class="helper" ?data-off=${blocked}>${t('card-editor.setup-copy.helper')}</p>
${blocked
  ? html`<div class="fallback"><p class="reason" id=${REASON_ID}>${this._prepareFailed ? t('card-editor.setup-copy.failed') : t('card-editor.setup-copy.blocked')}</p>
${this._prepareFailed ? nothing : html`<textarea readonly rows="6" lang="en" spellcheck="false" aria-label=${t('card-editor.setup-copy.textarea-label')} aria-describedby=${REASON_ID} .value=${this._text} @focus=${this._selectAll}></textarea>`}</div>`
  : nothing}</div>
<div class="sr" role="status" aria-live="polite">${this._status}</div>
</div>`;
  }

  static styles = [
    editorTokens,
    css`
:host { display: block; margin-bottom: 8px; }
.box { display: grid; gap: 8px; align-content: start; width: 100%; min-height: 15rem; box-sizing: border-box; }
.copy { display: inline-flex; align-items: center; justify-content: center; gap: 8px; justify-self: start; min-width: 15rem; min-height: 36px; padding: 0 16px; font: inherit; font-size: 0.875rem; font-weight: 500; white-space: nowrap; cursor: pointer; border-radius: var(--mc-radius, 8px); border: 1px solid var(--mc-field-border, var(--divider-color)); background: var(--mc-surface, var(--card-background-color)); color: var(--mc-text, var(--primary-text-color)); }
.copy:hover { background: var(--mc-surface-2, var(--secondary-background-color)); }
.copy ha-icon { --mdc-icon-size: 18px; }
.copy:focus { outline: 2px solid var(--mc-accent, var(--primary-color)); outline-offset: 2px; }
.copy:focus:not(:focus-visible) { outline: none; }
@media (pointer: coarse) { .copy { min-height: 44px; } }
.copy.done { color: var(--success-color, #2e7d32); }
.labels { display: inline-grid; }
.label { grid-area: 1 / 1; }
.label[data-off] { visibility: hidden; }
.area { display: grid; }
.area > * { grid-area: 1 / 1; }
.helper, .reason { margin: 0; font-size: 0.8125rem; color: var(--mc-text-2); overflow-wrap: anywhere; }
.helper[data-off] { visibility: hidden; }
.fallback { display: grid; gap: 8px; align-content: start; }
textarea { width: 100%; box-sizing: border-box; font-family: var(--code-font-family, monospace); font-size: 0.75rem; resize: none; padding: 8px; color: var(--primary-text-color); background: var(--mc-surface-2, var(--secondary-background-color)); border: 1px solid var(--divider-color); border-radius: var(--mc-radius, 8px); }
.sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0; white-space: nowrap; clip-path: inset(50%); }
`,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-setup-copy': McSetupCopy;
  }
}
