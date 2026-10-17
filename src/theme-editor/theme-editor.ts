import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { THEME_EDITOR_CONTRACT_VERSION } from '../contracts/theme-editor';
import type { ThemeBackend, ThemeEditorElement } from '../contracts/theme-editor';

type Phase = 'waiting' | 'loading' | 'ready' | 'failed';

/**
 * <magic-card-theme-editor>: the theme editor host (Contract theme-editor 1.0.0). The panel sets
 * `hass`, `narrow`, `backend` and `selectedName`. This shell waits for the backend, asks
 * magic-card.js for the editor chunk (mc-color-picker, mc-unit-field: window.MagicCard.loadEditor,
 * module-editor 1.0.0) and then renders the editor views, which later tasks add.
 */
export class MagicCardThemeEditor extends LitElement implements ThemeEditorElement {
  static readonly contractVersion = THEME_EDITOR_CONTRACT_VERSION;

  @property({ attribute: false }) hass: unknown;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) backend: ThemeBackend | undefined;
  @property({ attribute: false }) selectedName: string | null = null;

  @state() private _phase: Phase = 'waiting';
  private _loading?: Promise<void>;

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('backend') && this.backend && this._phase === 'waiting') this._startLoad();
  }

  private _startLoad(): void {
    this._phase = 'loading';
    this._loading ??= (async () => {
      const load = window.MagicCard?.loadEditor;
      const ok = await Promise.resolve(load?.()).then(
        (v) => v === true,
        () => false,
      );
      this._phase = ok ? 'ready' : 'failed';
      this._loading = undefined;
    })();
  }

  protected render(): TemplateResult {
    switch (this._phase) {
      case 'waiting':
        return html`<p class="note" role="status">Waiting for Home Assistant to connect...</p>`;
      case 'loading':
        return html`<p class="note" role="status">Loading the theme editor...</p>`;
      case 'failed':
        return html`<p class="note" role="alert">
          The editor parts of Magic Card could not be loaded. Reload the page, and update Magic Card to 2026.10.06 or newer if
          it keeps happening.
        </p>`;
      default:
        return html`<div class="shell" part="shell"></div>`;
    }
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    .note {
      margin: 16px;
    }
  `;
}
