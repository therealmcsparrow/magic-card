import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { EditorMode, EditorState, HomeAssistant } from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import type { Inspector } from '../inspector/inspector';
import type { StructureOutline } from './structure-outline';
import type { Selection } from './selection';
import { describeSelection, selectionFromPath, selectionKey } from './selection';
import { kitTopbar } from '../../ui-kit/css/extras';
import { kitLip } from '../../ui-kit/css/lip';
import { kitBlueprint } from '../../ui-kit/css/blueprint';
import { defineUiKit, loadStudioFonts } from '../../ui-kit';
import { readDirection } from '../../ui-kit/controllers/direction';
import { PanelLips } from '../../ui-kit/controllers/panel-lips';
import type { PanelLipSpec, PanelLipStrings } from '../../contracts/ui-kit';
import type { FrameMeasure, StudioFrameElement, StudioFrameStrings } from '../../contracts/studio-frame';
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
import { t, m, type MessageIndex } from '../i18n';

/** What the live canvas reports about the artwork (the canvas's `mc-canvas-measure` event). */
interface CanvasMeasure {
  width: number;
  height: number;
  selection: FrameMeasure['selection'];
}

/** Grid step of the stage in px. */
const GRID_PX = 16;
/** Artwork size used until the canvas has measured itself. */
const FALLBACK_W = 400;
const FALLBACK_H = 600;

const MODES: Array<{ id: EditorMode; label: MessageIndex }> = [
  { id: 'form', label: m('card-editor.studio.form') },
  { id: 'yaml', label: m('card-editor.studio.yaml') },
];

/** Ctrl+\ on most systems, the command key on Apple ones. */
function shortcutKeys(): string {
  return /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘\\' : 'Ctrl+\\';
}

/** The lip of each side panel: fixed name, noun for announcements, and the tooltips. */
function lipSpecs(): PanelLipSpec[] {
  const keys = shortcutKeys();
  return [
    { id: 'layers', side: 'start', controls: 'layers', name: t('card-editor.studio.layers-panel'), noun: t('card-editor.studio.layers'),
      hideLabel: t('card-editor.studio.hide-noun-keys', { noun: t('card-editor.studio.layers'), keys }), showLabel: t('card-editor.studio.show-noun-keys', { noun: t('card-editor.studio.layers'), keys }) },
    { id: 'inspector', side: 'end', controls: 'inspector', name: t('card-editor.studio.inspector-panel'), noun: t('card-editor.studio.inspector'),
      hideLabel: t('card-editor.studio.hide-noun-keys', { noun: t('card-editor.studio.inspector'), keys }), showLabel: t('card-editor.studio.show-noun-keys', { noun: t('card-editor.studio.inspector'), keys }) },
  ];
}

function lipStrings(locale: string): PanelLipStrings {
  const hintOne = t('card-editor.studio.the-noun-panel-is-hidden-as-you-left-it', { noun: '{noun}' });
  return {
    locale,
    hidden: t('card-editor.studio.panels-hidden', { panels: '{panels}' }),
    shown: t('card-editor.studio.panels-shown', { panels: '{panels}' }),
    hintOne,
    hintMany: t('card-editor.studio.some-panels-are-hidden-as-you-left-them'),
    hintMigrated: hintOne,
    hintShortcut: t('card-editor.studio.shortcut-keys', { keys: shortcutKeys() }),
    gotIt: t('card-editor.studio.got-it'),
  };
}

function isTyping(e: Event): boolean {
  const t = e.composedPath()[0];
  if (!(t instanceof HTMLElement)) return false;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable;
}

/** Next index for roving-tabindex keys in a tablist / radiogroup, or undefined. */
function rovingIndex(key: string, idx: number, len: number, rtl = false): number | undefined {
  const map: Record<string, number> = {
    [rtl ? 'ArrowLeft' : 'ArrowRight']: (idx + 1) % len,
    [rtl ? 'ArrowRight' : 'ArrowLeft']: (idx - 1 + len) % len,
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
  /** Modified only mirrors the frame's switch, which starts off at every opening. */
  @state() private _modifiedOnly = false;
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
    keys: 'manual',
  });
  private _lipLocale = 'en';
  /** Layers open beside the stage by default from 1280 px; below that the toggle opens it over the stage. */
  private readonly _wideLayers = typeof window !== 'undefined' ? window.matchMedia?.('(min-width: 1280px)') : undefined;
  private _onViewport = (): void => this.requestUpdate();
  @state() private _canvasMeasure: CanvasMeasure | null = null;
  private _lastPath = '';

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _focusSel: string | null = null;
  /** The Layers overlay was opened for a rename from the canvas (it closes again afterwards). */
  private _layersForRename = false;

  private get _frame(): StudioFrameElement | null {
    return this.shadowRoot?.querySelector('mc-ui-studio-frame') ?? null;
  }

  /** Layers beside the stage: the remembered panel state at 1280 px and wider, the toggle's own state below. */
  private get _layersOpen(): boolean {
    if (this._live) return false;
    return (this._wideLayers?.matches ?? true) ? !this._lips.isHidden('layers') : this._showLayers;
  }

  get inspector(): Inspector | null {
    return this.shadowRoot?.querySelector('mc-inspector') ?? null;
  }

  private get _dialog(): HTMLDialogElement | null {
    return this.shadowRoot?.querySelector('dialog') ?? null;
  }

  connectedCallback(): void {
    super.connectedCallback();
    defineUiKit();
    void loadStudioFonts();
    this._wideLayers?.addEventListener?.('change', this._onViewport);
    this.addEventListener('keydown', this._onShortcut, { capture: true });
    if (this.stateManager && !this._unsubscribe) this._subscribe();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._wideLayers?.removeEventListener?.('change', this._onViewport);
    this.removeEventListener('keydown', this._onShortcut, { capture: true });
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
      this._modifiedOnly = false;
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
    this._lips.columns({ layers: this.open && (this._wideLayers?.matches ?? true), inspector: false });
    this.setAttribute('data-bp-mode', this.hass?.themes?.darkMode ? 'dark' : 'light');
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
    this._followSelection();
  }

  /** A new selection opens the drawer; an open or pinned drawer just follows it. */
  private _followSelection(): void {
    const path = this._state?.selectedPath ?? null;
    const key = path ? JSON.stringify(path) : '';
    if (key === this._lastPath) return;
    this._lastPath = key;
    if (path && this.open && !this._live) this._frame?.openDrawer(this.shadowRoot?.querySelector<HTMLElement>('.drawer-toggle'), 'selection');
  }

  /** The Layers lip sits at the inner edge of the column while it is shown, at the window edge otherwise. */
  private _lipTokens(): string {
    return `--mc-lip-at-start: ${this._lips.isHidden('layers') ? '0px' : 'var(--bp-layers-w)'}`;
  }

  private _onCanvasMeasure = (e: Event): void => {
    this._canvasMeasure = (e as CustomEvent<CanvasMeasure>).detail;
  };

  /** Rulers, grid and callouts: the artwork's size, or the width of the chosen view until the canvas has measured itself. */
  private _measure(mode: EditorMode): FrameMeasure | null {
    if (mode !== 'form' && !this._live) return null;
    const c = this._canvasMeasure;
    return {
      width: c?.width || this._width.px || FALLBACK_W,
      height: c?.height || FALLBACK_H,
      grid: GRID_PX,
      selection: c?.selection ?? null,
      zoom: 1,
    };
  }

  private _frameStrings(): StudioFrameStrings {
    return {
      pin: t('card-editor.studio.pin-panel'),
      modifiedOnly: t('card-editor.studio.modified-only'),
      noneModified: t('card-editor.studio.nothing-modified'),
      close: t('card-editor.item-menu.close'),
      drawer: t('card-editor.studio.inspector-panel'),
      zoom: t('card-editor.studio.zoom'),
    };
  }

  private _selectionLabel(s: EditorState): string {
    return describeSelection(s.config, selectionFromPath(s.selectedPath ?? null)).title;
  }

  private _toggleDrawer = (e: Event): void => {
    const frame = this._frame;
    if (!frame) return;
    if (frame.drawerOpen) frame.closeDrawer('user');
    else frame.openDrawer(e.currentTarget as HTMLElement, 'user');
  };

  /** Ctrl/Cmd + \ shows or hides Layers and the inspector drawer together; below the Layers column it toggles the drawer alone. */
  private _onShortcut = (e: KeyboardEvent): void => {
    const columns = this._lips.active;
    if (!this._lips.handleKey(e)) return;
    const frame = this._frame;
    if (!frame || this._live) return;
    const show = columns ? !this._lips.isHidden('layers') : !frame.drawerOpen;
    if (show) frame.openDrawer(null, 'user');
    else frame.closeDrawer('user');
  };

  private _onStagePointerDown = (): void => {
    this._frame?.stageWork();
  };

  private _toggleLayers = (): void => {
    if (this._wideLayers?.matches ?? true) this._lips.toggle('layers');
    else this._showLayers = !this._showLayers;
  };

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
    if (!(this._wideLayers?.matches ?? true)) this._showLayers = false;
    // Edit is an explicit "edit this": the drawer opens first
    this._frame?.openDrawer(this.shadowRoot?.querySelector<HTMLElement>('.drawer-toggle'), 'user');
    // the frame shows the drawer (and queues its own focus) on its update; the inspector takes focus after both
    void (async () => {
      await (this._frame as (StudioFrameElement & { updateComplete?: Promise<unknown> }) | null)?.updateComplete;
      await this.inspector?.updateComplete;
      this.inspector?.focusInspector();
    })();
  };

  /** Rename from the canvas menu: the Layers field (the overlay opens when narrow); focus returns to the canvas. */
  private _onRenameRequest = async (e: Event): Promise<void> => {
    const d = (e as CustomEvent<{ sel: Selection; returnFocus?: HTMLElement }>).detail;
    if (!d) return;
    if (!this._showLayers && !(this._wideLayers?.matches ?? true)) {
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
    if (on) this._frame?.closeDrawer('user');
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
    if (!this._live && this._showLayers && !(this._wideLayers?.matches ?? true)) {
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
    const next = rovingIndex(e.key, MODES.findIndex((m) => m.id === mode), MODES.length, readDirection(e.currentTarget as Element) === 'rtl');
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
    const next = rovingIndex(e.key, OPTION_IDS.indexOf(this._width.option), OPTION_IDS.length, readDirection(e.currentTarget as Element) === 'rtl');
    if (next === undefined) return;
    e.preventDefault();
    this._setWidth(OPTION_IDS[next]);
    this._focusSel = '.devices [aria-checked="true"]';
  }

  private _renderTopbar(s: EditorState, mode: EditorMode): TemplateResult {
    const sm = this.stateManager!;
    const live = this._live;
    return html`
      <div slot="top" class="bar-row">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._close}>
            <ha-icon class="back-arrow" icon="mdi:arrow-left"></ha-icon>${t('card-editor.studio.back-to-dialog')}
          </button>
          <button
            type="button"
            class="icon-btn layers-toggle"
            aria-label=${t('card-editor.studio.layers-2')}
            title=${t('card-editor.studio.layers-2')}
            aria-controls="layers"
            aria-expanded=${this._layersOpen ? 'true' : 'false'}
            data-open=${this._layersOpen ? 'true' : 'false'}
            data-dir=${this._lips.dir}
            ?hidden=${live}
            @click=${this._toggleLayers}
          >
            <ha-icon icon="mdi:layers-outline"></ha-icon><svg class="opener-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" fill="currentColor"></path></svg>
          </button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong>${s.config.name?.trim() || t('card-editor.studio.untitled-card')}</strong>
            <mc-template-bar compact .config=${s.config} .hass=${this.hass} .disabled=${live} class=${live ? 'dim' : nothing}></mc-template-bar>
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <div class="seg mode" role="tablist" aria-label=${t('card-editor.studio.editor-mode')}>
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
          <div class="seg devices" role="radiogroup" aria-label=${t('card-editor.studio.canvas-width')} ?hidden=${mode !== 'form' && !live}>
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
            title=${live ? t('card-editor.studio.preview-esc-to-return') : t('card-editor.studio.preview-the-card-with-live-actions')}
            @click=${() => this._setLive(!live)}>
            <ha-icon icon=${live ? 'mdi:play-circle' : 'mdi:play-circle-outline'}></ha-icon><span class="lbl">${t('card-editor.studio.preview')}</span>
          </button>
          <span class="live-chip" aria-hidden="true" ?hidden=${!live}>
            <ha-icon icon="mdi:flash-outline"></ha-icon>${t('card-editor.studio.preview-actions-are-live')}
          </span>
          <span class="sr-only" role="status" aria-live="polite">${live ? t('card-editor.studio.preview-actions-are-live') : ''}</span>
          <button type="button" class="icon-btn" aria-label=${t('card-editor.studio.undo-ctrl-z')} title=${t('card-editor.studio.undo-ctrl-z')}
            ?disabled=${live || !sm.canUndo()} @click=${() => sm.undo()}><ha-icon icon="mdi:undo"></ha-icon></button>
          <button type="button" class="icon-btn" aria-label=${t('card-editor.studio.redo-ctrl-y')} title=${t('card-editor.studio.redo-ctrl-y')}
            ?disabled=${live || !sm.canRedo()} @click=${() => sm.redo()}><ha-icon icon="mdi:redo"></ha-icon></button>
          <button type="button" class="icon-btn drawer-toggle" aria-label=${t('card-editor.studio.inspector-panel')} title=${t('card-editor.studio.inspector-panel')}
            aria-controls="inspector" aria-expanded=${this._frame?.drawerOpen ? 'true' : 'false'} ?hidden=${live} @click=${this._toggleDrawer}>
            <ha-icon icon="mdi:tune-variant"></ha-icon>
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:check"></ha-icon>${t('card-editor.studio.done')}
          </button>
        </div>
      </div>
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
        aria-label=${t('card-editor.studio.magic-card-studio')}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @keydown=${this._onKeydown}
      >
        ${this._lips.status()}
        ${s && sm && this.open
          ? html`
              <mc-ui-studio-frame
                studio="card-studio"
                class=${live ? 'live' : ''}
                .scheme=${this.hass?.themes?.darkMode ? 'dark' : 'light'}
                .strings=${this._frameStrings()}
                .selectionLabel=${this._selectionLabel(s)}
                .measure=${this._measure(mode)}
                .rulers=${mode === 'form' || live}
                @mc-frame-drawer=${() => this.requestUpdate()}
                @mc-frame-modified=${(e: CustomEvent<{ on: boolean }>) => { this._modifiedOnly = e.detail.on; }}
                @mc-canvas-measure=${this._onCanvasMeasure}
              >
                ${this._renderTopbar(s, mode)}
                <nav slot="start" class="layers" id="layers" aria-label=${t('card-editor.studio.layers-panel')} ?hidden=${!this._layersOpen} ?inert=${!this._layersOpen}
                  data-lip=${lips.state('layers')} data-dir=${lips.dir}>
                  <div class="panel-title">
                    <h2>${t('card-editor.studio.layers-2')}</h2>
                    <span class="chip is-count">${t('card-editor.studio.mods', { mods })}</span>
                  </div>
                  <mc-structure-outline .stateManager=${sm} variant="layers" @mc-edit-module=${this._onEditModule}
                    @mc-status=${this._onStatus} @mc-rename-done=${this._onRenameDone}></mc-structure-outline>
                </nav>
                ${mode === 'form' || live
                  ? html`<mc-studio-canvas slot="stage" .stateManager=${sm} .hass=${this.hass} .width=${this._width} .live=${live} @mc-match-view=${this._onMatchView}
                      @pointerdown=${this._onStagePointerDown}
                      @mc-edit-module=${this._onEditModule} @mc-rename-request=${this._onRenameRequest}
                      @mc-studio-more-info=${this._onMoreInfo}></mc-studio-canvas>`
                  : nothing}
                ${mode === 'yaml'
                  ? html`
                      <div slot="stage" class="center-alt" ?hidden=${live} @pointerdown=${this._onStagePointerDown}>
                        <div class="yaml-view"><mc-yaml-editor .stateManager=${sm} .hass=${this.hass}></mc-yaml-editor></div>
                      </div>
                    `
                  : nothing}
                <mc-inspector slot="drawer" id="inspector" .stateManager=${sm} .hass=${this.hass} variant="studio" .modifiedOnly=${this._modifiedOnly} ?hidden=${live}></mc-inspector>
              </mc-ui-studio-frame>
              <div class="lips" style=${this._lipTokens()}>${lips.lip('layers')}</div>
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
    kitBlueprint,
    css`
      :host {
        display: contents;
        /* the studio's own chrome and the inspector read the soft-blueprint palette */
        --mc-ground: var(--bp-bg);
        --mc-surface: var(--bp-sheet);
        --mc-text: var(--bp-ink);
        --mc-text-2: var(--bp-mute);
        --mc-divider: var(--bp-line);
        --mc-canvas: var(--bp-bg);
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
        font-family: var(--bp-font-ui);
        font-size: 0.875rem;
        line-height: 1.5;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.985);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      }
      dialog.studio[open] {
        display: block;
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

      :host([dir='rtl']) .back-arrow {
        transform: scaleX(-1);
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

      /* the frame lays out the bar, Layers, stage and drawer; these style what sits in them */
      mc-ui-studio-frame {
        block-size: 100%;
      }
      .bar-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
        flex: 1;
        min-width: 0;
        padding-block: 4px;
      }
      .bar-row > * {
        flex: none;
      }
      .bar-row > .spacer {
        flex: 1 1 0;
      }
      .layers {
        box-sizing: border-box;
        block-size: 100%;
        min-block-size: 0;
        overflow-y: auto;
        padding: 12px 8px;
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
      mc-studio-canvas {
        inline-size: 100%;
      }
      mc-inspector {
        display: block;
        block-size: 100%;
        min-block-size: 0;
      }
      .center-alt {
        inline-size: 100%;
      }
      .yaml-view {
        max-width: 760px;
        margin: 0 auto;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        overflow: hidden;
      }
      .drawer-toggle[hidden],
      .layers-toggle[hidden] {
        display: none;
      }
      /* the Layers lip floats over the frame's start column edge */
      .lips {
        position: absolute;
        inset: 0;
        z-index: 6;
        pointer-events: none;
      }
      .lips > * {
        pointer-events: auto;
      }
      @media (max-width: 1023px) {
        .lips {
          display: none;
        }
      }
      @media (max-width: 900px) {
        .preview-toggle .lbl {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .live-chip {
          white-space: nowrap;
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
