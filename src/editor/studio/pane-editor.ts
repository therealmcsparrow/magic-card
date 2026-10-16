import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EditorMode, EditorState, HomeAssistant, MagicCardConfig } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import { editorSystem } from '../../css/editor-system';
import { effectiveWidths, widthWeights } from '../../utils/column-widths';
import { countModules, selectionFromPath } from './selection';
import type { Inspector } from '../inspector/inspector';

import './structure-outline';
import './template-bar';
import '../inspector/inspector';
import '../modes/yaml-editor';

const MODES: Array<{ id: EditorMode; label: string }> = [
  { id: 'form', label: 'Form' },
  { id: 'yaml', label: 'YAML' },
];

/**
 * The editor as shown inside HA's card-editor dialog: sticky head (mode + history),
 * template bar, studio call-to-action, structure outline and the inspector.
 * Fires `open-studio` (bubbles, composed).
 */
@customElement('mc-pane-editor')
export class PaneEditor extends LitElement {
  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private _state?: EditorState;

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _focusMode = false;

  get inspector(): Inspector | null {
    return this.shadowRoot?.querySelector('mc-inspector') ?? null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('stateManager') && this.stateManager !== this._subscribedTo) this._subscribe();
  }

  protected updated(): void {
    if (this._focusMode) {
      this._focusMode = false;
      this.shadowRoot?.querySelector<HTMLElement>('.mode [aria-selected="true"]')?.focus();
    }
  }

  private _subscribe(): void {
    this._unsubscribe?.();
    this._subscribedTo = this.stateManager;
    this._unsubscribe = this.stateManager?.subscribe((s) => {
      this._state = s;
    });
  }

  private _onModeKeydown(e: KeyboardEvent, mode: EditorMode): void {
    const idx = MODES.findIndex((m) => m.id === mode);
    const targets: Record<string, number> = {
      ArrowRight: (idx + 1) % MODES.length,
      ArrowLeft: (idx - 1 + MODES.length) % MODES.length,
      Home: 0,
      End: MODES.length - 1,
    };
    const next = targets[e.key];
    if (next === undefined) return;
    e.preventDefault();
    this._focusMode = true;
    this.stateManager?.setEditorMode(MODES[next].id);
  }

  /** Return focus here when the studio closes. */
  focusStudioButton(): void {
    const btn = this.shadowRoot?.querySelector<HTMLElement>('.studio-cta .btn-primary');
    if (btn) btn.focus();
    else this.shadowRoot?.querySelector<HTMLElement>('.mode [aria-selected="true"]')?.focus();
  }

  private _openStudio(): void {
    this.dispatchEvent(new CustomEvent('open-studio', { bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    const s = this._state;
    const sm = this.stateManager;
    if (!s || !sm) return html``;
    const mode = s.editorMode === 'yaml' ? 'yaml' : 'form';

    return html`
      <div class="pane-head">
        <div class="seg mode" role="tablist" aria-label="Editor mode">
          ${MODES.map((m) => {
            const on = m.id === mode;
            return html`
              <button
                type="button"
                role="tab"
                aria-selected=${on ? 'true' : 'false'}
                tabindex=${on ? '0' : '-1'}
                @click=${() => sm.setEditorMode(m.id)}
                @keydown=${(e: KeyboardEvent) => this._onModeKeydown(e, mode)}
              >${m.label}</button>
            `;
          })}
        </div>
        <button type="button" class="icon-btn" title="Undo" aria-label="Undo" ?disabled=${!sm.canUndo()} @click=${() => sm.undo()}>
          <ha-icon icon="mdi:undo"></ha-icon>
        </button>
        <button type="button" class="icon-btn" title="Redo" aria-label="Redo" ?disabled=${!sm.canRedo()} @click=${() => sm.redo()}>
          <ha-icon icon="mdi:redo"></ha-icon>
        </button>
      </div>
      <div class="pane-inner">
        <mc-template-bar .config=${s.config} .hass=${this.hass}></mc-template-bar>
        ${mode === 'yaml'
          ? html`<mc-yaml-editor .stateManager=${sm} .hass=${this.hass}></mc-yaml-editor>`
          : html`
              ${this._renderCta(s)}
              <section aria-labelledby="sec-structure">
                <div class="sec-title">
                  <h3 id="sec-structure">Structure</h3>
                  <button type="button" class="btn btn-text btn-sm" @click=${() => sm.setSelectedPath(null)}>
                    <ha-icon icon="mdi:card-outline"></ha-icon>Card settings
                  </button>
                </div>
                <mc-structure-outline
                  .stateManager=${sm}
                  variant="pane"
                  @mc-edit-module=${() => this.inspector?.focusInspector()}
                ></mc-structure-outline>
              </section>
              <div class="insp-wrap">
                <mc-inspector .stateManager=${sm} .hass=${this.hass} variant="pane"></mc-inspector>
              </div>
            `}
      </div>
    `;
  }

  private _renderCta(s: EditorState): TemplateResult {
    const config = s.config;
    const rows = config.rows || [];
    const mods = countModules(config);
    return html`
      <div class="studio-cta">
        <div class="cta-top">
          ${this._renderThumb(config, s)}
          <div class="cta-text">
            <h3>${config.name?.trim() || 'Untitled card'}</h3>
            <p>
              ${rows.length} row${rows.length === 1 ? '' : 's'} · ${mods} module${mods === 1 ? '' : 's'}. Build visually with
              layers, canvas and the full inspector.
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-primary" @click=${this._openStudio}>
          <ha-icon icon="mdi:arrow-expand"></ha-icon>Open studio
        </button>
      </div>
    `;
  }

  private _renderThumb(config: MagicCardConfig, s: EditorState): TemplateResult {
    const sel = selectionFromPath(s.selectedPath);
    const rows = config.rows || [];
    return html`
      <div class="thumb" aria-hidden="true">
        ${rows.length
          ? rows.map((row, ri) => {
              const cols = widthWeights(effectiveWidths(row)).map((w) => `${+w.toFixed(3)}fr`).join(' ');
              return html`
                <div class="t-row" style="grid-template-columns:${cols}">
                  ${row.columns.map(
                    (col, ci) => html`
                      <div class="t-col">
                        ${col.modules?.length
                          ? col.modules.map(
                              (_m, mi) => html`<span
                                class="t-mod ${sel.kind === 'module' && sel.row === ri && sel.col === ci && sel.module === mi ? 'on' : ''}"
                              ></span>`,
                            )
                          : html`<span class="t-mod none"></span>`}
                      </div>
                    `,
                  )}
                </div>
              `;
            })
          : html`<span class="t-mod none"></span>`}
      </div>
    `;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .pane-head {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--mc-surface);
        border-bottom: 1px solid var(--mc-divider);
      }
      .pane-head .seg {
        margin-right: auto;
      }
      .pane-inner {
        padding: 16px;
        display: grid;
        gap: 24px;
        min-width: 0;
      }
      .studio-cta {
        display: grid;
        gap: 16px;
        padding: 20px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .cta-top {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        min-width: 0;
      }
      .cta-text {
        min-width: 0;
      }
      .studio-cta h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .studio-cta p {
        margin: 4px 0 0;
        color: var(--mc-text-2);
        font-size: 0.875rem;
      }
      .studio-cta .btn {
        justify-self: start;
      }
      .thumb {
        flex: none;
        width: 72px;
        display: grid;
        gap: 4px;
        padding: 6px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
      }
      .t-row {
        display: grid;
        gap: 4px;
      }
      .t-col {
        display: grid;
        gap: 3px;
        align-content: start;
      }
      .t-mod {
        display: block;
        height: 7px;
        border-radius: 2px;
        background: var(--mc-field-border);
        opacity: 0.55;
      }
      .t-mod.on {
        background: var(--mc-accent);
        opacity: 1;
      }
      .t-mod.none {
        opacity: 0.2;
      }
      .sec-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .sec-title h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
      }
      .insp-wrap {
        padding-top: 20px;
        border-top: 1px solid var(--mc-divider);
        min-width: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-pane-editor': PaneEditor;
  }
}
