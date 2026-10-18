import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EditorMode, EditorState, HomeAssistant } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import type { Inspector } from '../inspector/inspector';
import type { StructureOutline } from './structure-outline';
import type { Selection } from './selection';
import { selectionKey } from './selection';
import { kitTopbar } from '../../ui-kit/css/extras';
import { editorSystem } from '../../css/editor-stack';
import type { StudioCanvas } from './studio-canvas';
import { CanvasWidth, CanvasWidthOption, DetectedView, OPTION_IDS, OPTION_LABELS, OPTION_NAMES, autoWidth, detectView, overrideWidth } from './view-detect';
import { countModules } from './selection';

import './studio-canvas';
import './structure-outline';
import './template-bar';
import '../inspector/inspector';
import '../modes/yaml-editor';
import { t, m, type MessageId } from '../i18n';

const MODES: Array<{ id: EditorMode; label: MessageId }> = [
  { id: 'form', label: m('Form') },
  { id: 'yaml', label: m('YAML') },
];

function isTyping(e: Event): boolean {
  const t = e.composedPath()[0];
  if (!(t instanceof HTMLElement)) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
}

/** Next index for roving-tabindex keys in a tablist / radiogroup, or undefined. */
function rovingIndex(key: string, idx: number, len: number): number | undefined {
  const map: Record<string, number> = {
    ArrowRight: (idx + 1) % len,
    ArrowLeft: (idx - 1 + len) % len,
    Home: 0,
    End: len - 1,
  };
  return map[key];
}

/**
 * Full-screen studio: a native modal `<dialog>` (top layer, above HA's own dialog) with a topbar,
 * layers, live canvas and inspector. Fires `studio-close` (bubbles, composed) on Back / Done / Escape.
 * Slotted children render inside the dialog, so pickers opened from the studio stack above it.
 */
@customElement('mc-studio')
export class Studio extends LitElement {
  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) open = false;
  /** The dashboard config HA gives the card editor (views); read to match the canvas width to the view. */
  @property({ attribute: false }) lovelace?: unknown;

  @state() private _state?: EditorState;
  @state() private _view: DetectedView = { kind: 'unknown', reason: '' };
  /** The user's pick; null = follow the view. Lives as long as this dialog. */
  @state() private _override: CanvasWidthOption | null = null;
  @state() private _showLayers = false;

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _focusSel: string | null = null;
  /** The Layers overlay was opened for a rename from the canvas (it closes again afterwards). */
  private _layersForRename = false;

  get inspector(): Inspector | null {
    return this.shadowRoot?.querySelector('mc-inspector') ?? null;
  }

  private get _dialog(): HTMLDialogElement | null {
    return this.shadowRoot?.querySelector('dialog') ?? null;
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
    // The view is read when the studio opens, and again when `lovelace` arrives later.
    if ((changed.has('open') && this.open) || changed.has('lovelace')) this._detect();
  }

  private _detect(): void {
    const card = this.stateManager?.getState().config as unknown as Record<string, unknown> | undefined;
    this._view = detectView(this.lovelace, window.location.pathname, card);
  }

  private get _width(): CanvasWidth {
    return this._override ? overrideWidth(this._override, this._view) : autoWidth(this._view);
  }

  private _onMatchView = (): void => {
    this._override = null;
    this._focusSel = '.devices [aria-checked="true"]';
  };

  private _subscribe(): void {
    this._unsubscribe?.();
    this._subscribedTo = this.stateManager;
    this._unsubscribe = this.stateManager?.subscribe((s) => {
      this._state = s;
    });
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('open')) this._syncOpen();
    if (this._focusSel) {
      this.shadowRoot?.querySelector<HTMLElement>(this._focusSel)?.focus();
      this._focusSel = null;
    }
  }

  private _syncOpen(): void {
    const dlg = this._dialog;
    if (!dlg) return;
    if (this.open && !dlg.open) {
      dlg.showModal();
      this._showLayers = false;
      const canvas = this.shadowRoot?.querySelector<StudioCanvas>('mc-studio-canvas');
      canvas?.updateComplete.then(() => canvas.focusCanvas());
    } else if (!this.open && dlg.open) {
      dlg.close();
    }
  }

  private _close = (): void => {
    this.dispatchEvent(new CustomEvent('studio-close', { bubbles: true, composed: true }));
  };

  /** Layers "Edit": the module is selected; hide the Layers overlay (narrow) and focus the inspector. */
  private _onEditModule = (): void => {
    if (this._showLayers && window.matchMedia?.('(max-width: 900px)').matches) this._showLayers = false;
    this.inspector?.focusInspector();
  };

  /** Rename from the canvas menu: the Layers field (the overlay opens when narrow); focus returns to the canvas. */
  private _onRenameRequest = async (e: Event): Promise<void> => {
    const d = (e as CustomEvent<{ sel: Selection; returnFocus?: HTMLElement }>).detail;
    if (!d) return;
    if (!this._showLayers && window.matchMedia?.('(max-width: 900px)').matches) {
      this._showLayers = true;
      this._layersForRename = true;
    }
    await this.updateComplete;
    this.shadowRoot?.querySelector<StructureOutline>('mc-structure-outline')?.startRename(selectionKey(d.sel), d.returnFocus);
  };

  private _onRenameDone = (): void => {
    if (this._layersForRename) this._showLayers = false;
    this._layersForRename = false;
  };

  /** Copy / paste feedback from the Layers menus goes to the canvas status capsule. */
  private _onStatus = (e: Event): void => {
    const message = (e as CustomEvent<{ message: string }>).detail?.message;
    if (message) this.shadowRoot?.querySelector<StudioCanvas>('mc-studio-canvas')?.showStatus(message);
  };

  // ── dialog events ──

  private _onCancel = (e: Event): void => {
    e.preventDefault();
    this._close();
  };

  /** Native close without a cancel event (e.g. the browser's repeated-Escape escape hatch). */
  private _onNativeClose = (e: Event): void => {
    // Only the studio dialog's own close: a bubbling `close` from slotted content is not ours.
    if (e.target !== e.currentTarget) return;
    if (this.open) this._close();
  };

  /**
   * Bubble-phase listener on the <dialog>: in-dialog handlers run first, then nothing leaves the studio.
   */
  private _onKeydown = (e: KeyboardEvent): void => {
    e.stopPropagation();
    const sm = this.stateManager;
    if (!sm || e.defaultPrevented) return;
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (key === 'z' || key === 'y')) {
      if (isTyping(e)) return; // native text undo
      e.preventDefault();
      if (key === 'y' || e.shiftKey) sm.redo();
      else sm.undo();
      return;
    }
    if (e.key !== 'Escape') return;
    if (this._showLayers && window.matchMedia?.('(max-width: 900px)').matches) {
      e.preventDefault();
      this._showLayers = false;
      this._focusSel = '.layers-toggle';
      return;
    }
    // Escape inside a picker modal (a <dialog> or role="dialog" inside the studio's own dialog) must
    // not close the whole studio.
    const path = e.composedPath();
    const inner = path.slice(0, Math.max(0, path.indexOf(e.currentTarget as EventTarget)));
    const nested = inner.some((t) => t instanceof HTMLDialogElement || (t instanceof HTMLElement && t.getAttribute('role') === 'dialog'));
    if (nested) e.preventDefault();
  };

  // ── topbar ──

  private _onModeKeydown(e: KeyboardEvent, mode: EditorMode): void {
    const next = rovingIndex(e.key, MODES.findIndex((m) => m.id === mode), MODES.length);
    if (next === undefined) return;
    e.preventDefault();
    this._focusSel = '.mode [aria-selected="true"]';
    this.stateManager?.setEditorMode(MODES[next].id);
  }

  private _setWidth(id: CanvasWidthOption): void {
    // The checked option is already what is drawn: choosing it changes nothing.
    if (id !== this._width.option) this._override = id;
  }

  private _onDeviceKeydown(e: KeyboardEvent): void {
    const next = rovingIndex(e.key, OPTION_IDS.indexOf(this._width.option), OPTION_IDS.length);
    if (next === undefined) return;
    e.preventDefault();
    this._setWidth(OPTION_IDS[next]);
    this._focusSel = '.devices [aria-checked="true"]';
  }

  private _renderTopbar(s: EditorState, mode: EditorMode): TemplateResult {
    const sm = this.stateManager!;
    return html`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${t('Back to dialog')}
          </button>
          <button
            type="button"
            class="icon-btn layers-toggle"
            aria-label=${this._showLayers ? t('Hide layers') : t('Show layers')}
            title=${t('Layers')}
            aria-controls="layers"
            aria-expanded=${this._showLayers ? 'true' : 'false'}
            @click=${() => { this._showLayers = !this._showLayers; }}
          >
            <ha-icon icon="mdi:layers-outline"></ha-icon>
          </button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong>${s.config.name?.trim() || t('Untitled card')}</strong>
            <mc-template-bar compact .config=${s.config} .hass=${this.hass}></mc-template-bar>
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <div class="seg mode" role="tablist" aria-label=${t('Editor mode')}>
            ${MODES.map((m) => {
              const on = m.id === mode;
              return html`<button
                type="button"
                role="tab"
                aria-selected=${on ? 'true' : 'false'}
                tabindex=${on ? '0' : '-1'}
                @click=${() => sm.setEditorMode(m.id)}
                @keydown=${(e: KeyboardEvent) => this._onModeKeydown(e, mode)}
              >${t(m.label)}</button>`;
            })}
          </div>
          <div class="seg devices" role="radiogroup" aria-label=${t('Canvas width')} ?hidden=${mode !== 'form'}>
            ${OPTION_IDS.map((id) => {
              const on = id === this._width.option;
              return html`<button
                type="button"
                role="radio"
                aria-checked=${on ? 'true' : 'false'}
                tabindex=${on ? '0' : '-1'}
                aria-label=${t(OPTION_NAMES[id])}
                title=${t(OPTION_NAMES[id])}
                @click=${() => this._setWidth(id)}
                @keydown=${this._onDeviceKeydown}
              >${t(OPTION_LABELS[id])}</button>`;
            })}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button type="button" class="icon-btn" aria-label=${t('Undo (Ctrl+Z)')} title=${t('Undo (Ctrl+Z)')}
            ?disabled=${!sm.canUndo()} @click=${() => sm.undo()}><ha-icon icon="mdi:undo"></ha-icon></button>
          <button type="button" class="icon-btn" aria-label=${t('Redo (Ctrl+Y)')} title=${t('Redo (Ctrl+Y)')}
            ?disabled=${!sm.canRedo()} @click=${() => sm.redo()}><ha-icon icon="mdi:redo"></ha-icon></button>
          <button type="button" class="btn btn-primary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:check"></ha-icon>${t('Done')}
          </button>
        </div>
      </header>
    `;
  }

  // ── render ──

  protected render(): TemplateResult {
    // The workspace renders only while open: a closed studio keeps no live canvas, layers or inspector fed with hass.
    const s = this._state;
    const sm = this.stateManager;
    const mode: EditorMode = s?.editorMode === 'yaml' ? 'yaml' : 'form';
    const mods = s ? countModules(s.config) : 0;

    return html`
      <dialog
        class="studio ${this._showLayers ? 'show-layers' : ''}"
        aria-label=${t('Magic Card studio')}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @keydown=${this._onKeydown}
      >
        ${s && sm && this.open
          ? html`
              ${this._renderTopbar(s, mode)}
              <div class="workspace">
                <nav class="panel layers" id="layers" aria-label=${t('Layers')}>
                  <div class="panel-title">
                    <h2>${t('Layers')}</h2>
                    <span class="chip is-count">${t('{mods, plural, one {# module} other {# modules}}', { mods })}</span>
                  </div>
                  <mc-structure-outline .stateManager=${sm} variant="layers" @mc-edit-module=${this._onEditModule}
                    @mc-status=${this._onStatus} @mc-rename-done=${this._onRenameDone}></mc-structure-outline>
                </nav>
                <div class="center">
                  ${mode === 'form'
                    ? html`<mc-studio-canvas .stateManager=${sm} .hass=${this.hass} .width=${this._width} @mc-match-view=${this._onMatchView}
                        @mc-edit-module=${this._onEditModule} @mc-rename-request=${this._onRenameRequest}></mc-studio-canvas>`
                    : html`
                        <div class="center-alt">
                          <div class="yaml-view"><mc-yaml-editor .stateManager=${sm} .hass=${this.hass}></mc-yaml-editor></div>
                        </div>
                      `}
                </div>
                <aside class="panel inspector" aria-label=${t('Inspector')}>
                  <mc-inspector .stateManager=${sm} .hass=${this.hass} variant="studio"></mc-inspector>
                </aside>
              </div>
            `
          : html``}
        <slot></slot>
      </dialog>
    `;
  }

  static styles = [
    editorSystem,
    kitTopbar,
    css`
      :host {
        display: contents;
      }
      dialog.studio {
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        max-width: none;
        max-height: none;
        margin: 0;
        padding: 0;
        border: 0;
        inset: 0;
        background: var(--mc-ground);
        color: var(--mc-text);
        font-size: 0.875rem;
        line-height: 1.5;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.985);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      }
      dialog.studio[open] {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        opacity: 1;
        transform: none;
      }
      @starting-style {
        dialog.studio[open] {
          opacity: 0;
          transform: scale(0.985);
        }
      }
      dialog.studio::backdrop {
        background: transparent;
      }
      @media (prefers-reduced-motion: reduce) {
        dialog.studio {
          transition: none;
        }
      }

      .grp {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        flex-wrap: wrap;
      }
      .title strong {
        font-size: 1rem;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .vr {
        width: 1px;
        height: 24px;
        background: var(--mc-divider);
      }
      .spacer {
        flex: 1;
      }
      .layers-toggle {
        display: none;
      }

      /* workspace */
      .workspace {
        position: relative;
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr) 340px;
        min-height: 0;
      }
      .panel {
        background: var(--mc-surface);
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
      }
      .layers {
        border-right: 1px solid var(--mc-divider);
        padding: 12px 8px;
      }
      .inspector {
        border-left: 1px solid var(--mc-divider);
        overflow: hidden;
      }
      .panel-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 8px 8px;
      }
      .panel-title h2 {
        margin: 0;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .center {
        position: relative;
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        min-height: 0;
        min-width: 0;
      }
      .center-alt {
        padding: 24px;
        overflow: auto;
        min-height: 0;
      }
      .yaml-view {
        max-width: 760px;
        margin: 0 auto;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        overflow: hidden;
      }

      @media (max-width: 1180px) {
        .workspace {
          grid-template-columns: 220px minmax(0, 1fr) 320px;
        }
      }
      @media (max-width: 900px) {
        .workspace {
          grid-template-columns: minmax(0, 1fr) min(340px, 100%);
        }
        .layers {
          display: none;
          position: absolute;
          z-index: 7;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          box-shadow: var(--mc-shadow-float);
        }
        .show-layers .layers {
          display: block;
        }
        .layers-toggle {
          display: inline-grid;
        }
      }
      @media (max-height: 480px) {
        .inspector {
          overflow-y: auto;
        }
      }
      @media (max-width: 640px) {
        .workspace {
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto;
          align-content: start;
          overflow-y: auto;
        }
        .center {
          grid-template-rows: auto;
          min-height: 320px;
        }
        .inspector {
          border-left: 0;
          border-top: 1px solid var(--mc-divider);
          overflow: visible;
        }
        .layers {
          max-width: 100%;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-studio': Studio;
  }
}
