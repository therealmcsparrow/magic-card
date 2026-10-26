import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EditorMode, EditorState, HomeAssistant } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import type { Inspector } from '../inspector/inspector';
import type { StructureOutline } from './structure-outline';
import type { Selection } from './selection';
import { selectionKey } from './selection';
import { kitTopbar } from '../../ui-kit/css/extras';
import { kitLip } from '../../ui-kit/css/lip';
import { PanelLips } from '../../ui-kit/controllers/panel-lips';
import { ScrollbarWatch } from '../../ui-kit/controllers/scrollbar-width';
import type { PanelLipSpec, PanelLipStrings } from '../../contracts/ui-kit';
import { editorSystem } from '../../css/editor-stack';
import type { StudioCanvas } from './studio-canvas';
import { CanvasWidth, CanvasWidthOption, DetectedView, OPTION_IDS, OPTION_LABELS, OPTION_NAMES, autoWidth, detectView, overrideWidth } from './view-detect';
import { countModules } from './selection';

import { closeMoreInfo, feedMoreInfo, openMoreInfo } from './studio-more-info';
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

/** Ctrl+\ on most systems, the command key on Apple ones. */
function shortcutKeys(): string {
  return /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘\\' : 'Ctrl+\\';
}

/** The lip of each side panel: fixed name, noun for announcements, and the tooltips. */
function lipSpecs(): PanelLipSpec[] {
  const keys = shortcutKeys();
  return [
    { id: 'layers', side: 'start', controls: 'layers', name: t('Layers panel'), noun: t('layers'),
      hideLabel: t('Hide {noun} ({keys})', { noun: t('layers'), keys }), showLabel: t('Show {noun} ({keys})', { noun: t('layers'), keys }) },
    { id: 'inspector', side: 'end', controls: 'inspector', name: t('Inspector panel'), noun: t('inspector'),
      hideLabel: t('Hide {noun} ({keys})', { noun: t('inspector'), keys }), showLabel: t('Show {noun} ({keys})', { noun: t('inspector'), keys }) },
  ];
}

function lipStrings(locale: string): PanelLipStrings {
  const hintOne = t('The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.', { noun: '{noun}' });
  return {
    locale,
    hidden: t('{panels} hidden', { panels: '{panels}' }),
    shown: t('{panels} shown', { panels: '{panels}' }),
    hintOne,
    hintMany: t('Some panels are hidden, as you left them. Use the arrows on the edges to show them.'),
    hintMigrated: hintOne,
    hintShortcut: t('Shortcut: {keys}', { keys: shortcutKeys() }),
    gotIt: t('Got it'),
  };
}

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
  /**
   * Preview: the canvas card runs live (real actions) and the studio is read-only. Layers, inspector and
   * the YAML editor stay mounted (hidden), so leaving brings everything back as it was. Never kept across openings.
   */
  @state() private _live = false;
  /** The Escape that left Preview also raises a dialog `cancel` in the same task: that one must not close the studio. */
  private _swallowCancel = false;

  /** Panel lips: hide and show Layers and Inspector, remembered per device; Ctrl/Cmd + \ toggles the column panels. */
  private readonly _lips = new PanelLips(this, {
    editor: 'card-studio',
    panels: lipSpecs(),
    strings: lipStrings('en'),
  });
  private _lipLocale = 'en';
  /** Width of the scrollbar the lips face (the canvas or the YAML scroller), measured. */
  private readonly _bar = new ScrollbarWatch(this);
  private _barSig = '';
  private readonly _wideLayers = typeof window !== 'undefined' ? window.matchMedia?.('(min-width: 901px)') : undefined;
  private readonly _wideInspector = typeof window !== 'undefined' ? window.matchMedia?.('(min-width: 641px)') : undefined;
  private _onViewport = (): void => this.requestUpdate();

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
    this._wideLayers?.addEventListener?.('change', this._onViewport);
    this._wideInspector?.addEventListener?.('change', this._onViewport);
    if (this.stateManager && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._wideLayers?.removeEventListener?.('change', this._onViewport);
    this._wideInspector?.removeEventListener?.('change', this._onViewport);
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('stateManager') && this.stateManager !== this._subscribedTo) this._subscribe();
    // The view is read when the studio opens, and again when `lovelace` arrives later.
    if ((changed.has('open') && this.open) || changed.has('lovelace')) this._detect();
    // every opening and closing starts in editing (here, so it costs no second update)
    if (changed.has('open')) {
      this._live = false;
      if (this.open) this._lips.restore();
    }
    const language = this.hass?.locale?.language ?? 'en';
    if (language !== this._lipLocale) {
      this._lipLocale = language;
      this._lips.setPanels(lipSpecs(), lipStrings(language));
    }
    // a panel has a lip only while it is a column beside the canvas (the layout breakpoints below)
    this._lips.suspended = this._live;
    this._lips.columns({
      layers: this.open && (this._wideLayers?.matches ?? true),
      inspector: this.open && (this._wideInspector?.matches ?? true),
    });
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
    if (changed.has('hass')) {
      const host = this._moreInfoHost;
      if (host) feedMoreInfo(host, this.hass);
    }
    if (this._focusSel) {
      this.shadowRoot?.querySelector<HTMLElement>(this._focusSel)?.focus();
      this._focusSel = null;
    }
    this._watchScrollbar();
  }

  /**
   * Where the lips sit, measured from each window edge: a shown panel's lip at its inner edge, a hidden
   * panel's at the window edge. The canvas scrollbar is at the inline end, so the end lip stays clear of it.
   */
  private _lipTokens(): string {
    const lips = this._lips;
    const start = lips.isHidden('layers') ? '0px' : 'var(--lpw)';
    const end = lips.isHidden('inspector') ? '0px' : 'var(--ipw)';
    return `--mc-lip-at-start: ${start}; --mc-lip-at-end: calc(${end} + ${this._bar.width}px)`;
  }

  /** The scroller on the canvas side of the lips: the canvas in Form mode and Preview, the YAML view otherwise. */
  private _watchScrollbar(retry = true): void {
    // only a layout change moves the scroller; its size changes are the observer's
    const sig = `${this.open}|${this._state?.editorMode}|${this._live}|${this._lips.state('layers')}|${this._lips.state('inspector')}|${retry}`;
    if (retry && sig === this._barSig) return;
    if (retry) this._barSig = sig;
    const root = this.shadowRoot;
    const canvas = root?.querySelector<StudioCanvas>('mc-studio-canvas');
    const inner = canvas?.shadowRoot?.querySelector<HTMLElement>('.canvas');
    // the canvas renders on its own schedule: look again once it has
    if (canvas && !inner && retry) void canvas.updateComplete.then(() => this._watchScrollbar(false));
    const scroller = inner ?? root?.querySelector<HTMLElement>('.center-alt') ?? null;
    this._bar.watch(scroller, root?.querySelector<HTMLElement>('.workspace') ?? null);
  }

  private _syncOpen(): void {
    this._closeMoreInfo();
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
    // Edit is an explicit "edit this": a hidden Inspector column comes back first
    if (this._lips.isHidden('inspector')) void this._lips.reveal('inspector').then(() => this.inspector?.focusInspector());
    else this.inspector?.focusInspector();
  };

  /** Rename from the canvas menu: the Layers field (the overlay opens when narrow); focus returns to the canvas. */
  private _onRenameRequest = async (e: Event): Promise<void> => {
    const d = (e as CustomEvent<{ sel: Selection; returnFocus?: HTMLElement }>).detail;
    if (!d) return;
    if (!this._showLayers && window.matchMedia?.('(max-width: 900px)').matches) {
      this._showLayers = true;
      this._layersForRename = true;
    }
    if (this._lips.isHidden('layers')) await this._lips.reveal('layers');
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
    if (this._live || this._swallowCancel) {
      // Escape in Preview ends Preview, never the studio
      if (this._live) this._setLive(false);
      return;
    }
    this._close();
  };

  /** Preview on or off. Both ways leave focus on the toggle (the control just used; never on a live card control). */
  private _setLive(on: boolean): void {
    if (on === this._live) return;
    this._live = on;
    this._focusSel = '.preview-toggle';
    if (!on) this._closeMoreInfo();
  }

  private get _moreInfoHost(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.more-info-host') ?? null;
  }

  private _closeMoreInfo(): void {
    const host = this._moreInfoHost;
    if (host) closeMoreInfo(host);
  }

  /** A more-info action in the live card: HA's dialog opens inside the studio, above it. */
  private _onMoreInfo = (e: Event): void => {
    e.stopPropagation(); // handled here: it must not keep bubbling into HA's dialog
    const host = this._moreInfoHost;
    const entityId = (e as CustomEvent<{ entityId?: string }>).detail?.entityId;
    if (this._live && host && entityId) openMoreInfo(host, this.hass, entityId);
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
      if (this._live) return; // the config is read-only in Preview
      if (key === 'y' || e.shiftKey) sm.redo();
      else sm.undo();
      return;
    }
    if (e.key !== 'Escape') return;
    if (!this._live && this._showLayers && window.matchMedia?.('(max-width: 900px)').matches) {
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
    if (nested) {
      e.preventDefault();
      return;
    }
    if (this._live) {
      e.preventDefault();
      this._setLive(false);
      this._swallowCancel = true;
      setTimeout(() => { this._swallowCancel = false; }, 0);
    }
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
    const live = this._live;
    return html`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${t('Back to dialog')}
          </button>
          <button
            type="button"
            class="icon-btn layers-toggle"
            aria-label=${t('Layers')}
            title=${t('Layers')}
            aria-controls="layers"
            aria-expanded=${this._showLayers ? 'true' : 'false'}
            data-open=${this._showLayers ? 'true' : 'false'}
            data-dir=${this._lips.dir}
            ?hidden=${live}
            @click=${() => { this._showLayers = !this._showLayers; }}
          >
            <ha-icon icon="mdi:layers-outline"></ha-icon><svg class="opener-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" fill="currentColor"></path></svg>
          </button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong>${s.config.name?.trim() || t('Untitled card')}</strong>
            <mc-template-bar compact .config=${s.config} .hass=${this.hass} .disabled=${live} class=${live ? 'dim' : ''}></mc-template-bar>
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
                ?disabled=${live}
                @click=${() => sm.setEditorMode(m.id)}
                @keydown=${(e: KeyboardEvent) => this._onModeKeydown(e, mode)}
              >${t(m.label)}</button>`;
            })}
          </div>
          <div class="seg devices" role="radiogroup" aria-label=${t('Canvas width')} ?hidden=${mode !== 'form' && !live}>
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
        <div class="grp end">
          <button type="button" class="btn btn-secondary btn-sm preview-toggle" aria-pressed=${live ? 'true' : 'false'}
            title=${live ? t('Preview (Esc to return)') : t('Preview the card with live actions')}
            @click=${() => this._setLive(!live)}>
            <ha-icon icon=${live ? 'mdi:play-circle' : 'mdi:play-circle-outline'}></ha-icon><span class="lbl">${t('Preview')}</span>
          </button>
          <span class="live-chip" aria-hidden="true" ?hidden=${!live}>
            <ha-icon icon="mdi:flash-outline"></ha-icon>${t('Preview: actions are live')}
          </span>
          <span class="sr-only" role="status" aria-live="polite">${live ? t('Preview: actions are live') : ''}</span>
          <button type="button" class="icon-btn" aria-label=${t('Undo (Ctrl+Z)')} title=${t('Undo (Ctrl+Z)')}
            ?disabled=${live || !sm.canUndo()} @click=${() => sm.undo()}><ha-icon icon="mdi:undo"></ha-icon></button>
          <button type="button" class="icon-btn" aria-label=${t('Redo (Ctrl+Y)')} title=${t('Redo (Ctrl+Y)')}
            ?disabled=${live || !sm.canRedo()} @click=${() => sm.redo()}><ha-icon icon="mdi:redo"></ha-icon></button>
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
    const live = this._live;
    const lips = this._lips;

    return html`
      <dialog
        class="studio ${this._showLayers ? 'show-layers' : ''}"
        aria-label=${t('Magic Card studio')}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @keydown=${this._onKeydown}
      >
        ${this._lips.status()}
        ${s && sm && this.open
          ? html`
              ${this._renderTopbar(s, mode)}
              <div class="workspace ${live ? 'live' : ''} ${lips.isHidden('layers') ? 'no-layers' : ''} ${lips.isHidden('inspector') ? 'no-inspector' : ''}"
                style=${this._lipTokens()}>
                <nav class="panel layers" id="layers" aria-label=${t('Layers panel')} ?hidden=${live} ?inert=${live || lips.isHidden('layers')}
                  data-lip=${lips.state('layers')} data-dir=${lips.dir}>
                  <div class="panel-title">
                    <h2>${t('Layers')}</h2>
                    <span class="chip is-count">${t('{mods, plural, one {# module} other {# modules}}', { mods })}</span>
                  </div>
                  <mc-structure-outline .stateManager=${sm} variant="layers" @mc-edit-module=${this._onEditModule}
                    @mc-status=${this._onStatus} @mc-rename-done=${this._onRenameDone}></mc-structure-outline>
                </nav>
                ${lips.lip('layers')}
                <div class="center">
                  ${mode === 'form' || live
                    ? html`<mc-studio-canvas .stateManager=${sm} .hass=${this.hass} .width=${this._width} .live=${live} @mc-match-view=${this._onMatchView}
                        @mc-edit-module=${this._onEditModule} @mc-rename-request=${this._onRenameRequest}
                        @mc-studio-more-info=${this._onMoreInfo}></mc-studio-canvas>`
                    : nothing}
                  ${mode === 'yaml'
                    ? html`
                        <div class="center-alt" ?hidden=${live}>
                          <div class="yaml-view"><mc-yaml-editor .stateManager=${sm} .hass=${this.hass}></mc-yaml-editor></div>
                        </div>
                      `
                    : nothing}
                </div>
                ${lips.lip('inspector')}
                <aside class="panel inspector" id="inspector" aria-label=${t('Inspector panel')} ?hidden=${live} ?inert=${live || lips.isHidden('inspector')}
                  data-lip=${lips.state('inspector')} data-dir=${lips.dir}>
                  <mc-inspector .stateManager=${sm} .hass=${this.hass} variant="studio"></mc-inspector>
                </aside>
              </div>
            `
          : html``}
        <slot></slot>
        <div class="more-info-host"></div>
      </dialog>
    `;
  }

  static styles = [
    editorSystem,
    kitTopbar,
    kitLip,
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
      /* the opener's chevron points the way the Layers panel moves, as a lip's does: in when closed, back when open; right to left mirrors both */
      .layers-toggle .opener-chevron {
        flex: none;
        margin-inline-start: 2px;
      }
      .layers-toggle[data-open='true'] .opener-chevron,
      .layers-toggle[data-dir='rtl'] .opener-chevron {
        transform: scaleX(-1);
      }
      .layers-toggle[data-open='true'][data-dir='rtl'] .opener-chevron {
        transform: none;
      }
      .more-info-host {
        display: contents;
      }

      /* Preview: the pressed state uses the float bar's accent pair; the icon and the chip carry it too, not colour alone */
      .preview-toggle[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .live-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 500;
        background: var(--mc-warn-tint);
        color: var(--mc-warn-ink);
        --mdc-icon-size: 16px;
      }
      .live-chip[hidden] {
        display: none;
      }
      mc-template-bar.dim,
      .mode button:disabled {
        opacity: 0.5;
      }
      .mode button:disabled {
        cursor: default;
      }

      /* workspace */
      .workspace {
        --lpw: 240px;
        --ipw: 340px;
        position: relative;
        display: grid;
        grid-template-columns: var(--lw, var(--lpw)) minmax(0, 1fr) var(--iw, var(--ipw));
        min-height: 0;
      }
      /*
       * A hidden panel gives its track to the canvas but keeps its own width, so its content never reflows
       * and a nested scroller keeps its place (WebKit loses it in a 0 px item). It slides off its edge.
       */
      .no-layers {
        --lw: 0px;
      }
      .no-inspector {
        --iw: 0px;
      }
      .layers {
        --mc-lip-off: -100%;
      }
      .inspector {
        --mc-lip-off: 100%;
      }
      .layers[data-lip='hidden'] {
        width: var(--lpw);
      }
      .inspector[data-lip='hidden'] {
        width: var(--ipw);
        justify-self: end;
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

      /* Preview: one column, the canvas takes the width; layers and inspector stay mounted, out of the layout */
      .workspace.live {
        grid-template-columns: minmax(0, 1fr);
      }
      .workspace.live .layers,
      .workspace.live .inspector,
      .layers-toggle[hidden] {
        display: none;
      }

      @media (max-width: 1180px) {
        .workspace {
          --lpw: 220px;
          --ipw: 320px;
        }
      }
      @media (max-width: 900px) {
        .workspace {
          --ipw: 340px;
          grid-template-columns: minmax(0, 1fr) var(--iw, var(--ipw));
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: auto;
          min-width: 40px;
          padding-inline: 8px;
        }
        /* the label drops out of sight, the button keeps its name; the notice takes its own line under the buttons */
        .preview-toggle .lbl {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .grp.end {
          flex-wrap: wrap;
        }
        .live-chip {
          order: 9;
          flex: 1 0 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
