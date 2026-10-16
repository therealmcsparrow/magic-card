import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { MagicCardConfig, HomeAssistant, EditorState } from '../types';
import { mergeTemplateWithOverrides, withTemplateAnimations } from '../services/template-merge';
import { animationDocList } from '../utils/custom-animations';
import { EDITOR_TAG } from '../utils/constants';
import { editorSystem } from '../css/editor-system';
import { EditorStateManager } from './state/editor-state';
import { clearNotSynced, countNotSynced, stripForTemplate } from './state/template-sync';
import { selectionFromKey, selectionToPath } from './studio/selection';
import { PickerDialogController } from './components/picker-parts';
import type { ChildStep } from '../utils/module-path';
import type { PaneEditor } from './studio/pane-editor';
import type { Studio } from './studio/studio';
import type { CardRequestDetail } from './components/icon-animator/card-request';

type Docs = Array<Record<string, unknown>>;
type TemplateEntry = { config: Omit<MagicCardConfig, 'type'> & { type?: string }; description?: string };

import './studio/pane-editor';
import './studio/studio';
import './panels/module-selector';
import './components/template-picker';

/**
 * Events that never leave the editor when a descendant fires them. HA's card dialog
 * (hui-card-element-editor) replaces the card's config on config-changed and switches modes on
 * GUImode-changed; HA's frontend opens dialogs / rebuilds cards on the others.
 */
export const CONTAINED_EVENTS = [
  'config-changed',
  'GUImode-changed',
  'value-changed',
  'll-rebuild',
  'll-custom',
  'hass-more-info',
  'hass-action',
];

@customElement(EDITOR_TAG)
export class MagicCardEditor extends LitElement {
  @property({ attribute: false })
  hass?: HomeAssistant;

  @property({ attribute: false })
  lovelace?: unknown;

  @state()
  private _editorState?: EditorState;

  @state()
  private _showModuleSelector = false;

  @state()
  /** Where the picked module goes: a column, or (moduleIndex, child, slot) a layout module's slot. */
  private _moduleSelectorTarget?: { rowIndex: number; colIndex: number; moduleIndex?: number; child?: ChildStep[]; slot?: number };

  @state()
  private _showTemplatePicker: 'create' | 'link' | null = null;

  @state()
  private _linkedTemplate: string | null = null;

  @state()
  private _showSyncDialog = false;
  private _syncDialogCtrl = new PickerDialogController(this, () => this._cancelSync(), {
    selector: 'dialog.mc-sync-dialog',
    focus: (dlg) => dlg.querySelector<HTMLElement>('.btn-primary')?.focus({ preventScroll: true }),
  });

  @state()
  private _pendingSyncAction?: () => void;

  @state()
  private _studioOpen = false;

  /** The studio is mounted lazily on first open and then kept (closed) for fast re-open. */
  private _studioMounted = false;

  private readonly _stateManager = new EditorStateManager((config) => {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        bubbles: true,
        composed: true,
        detail: { config },
      }),
    );
  });
  private _unsubscribe?: () => void;
  private _initialTemplateFetched = false;
  /** Every template's custom_animations by template name (from get_templates; undefined: none). */
  private _tpl = new Map<string, Docs | undefined>();
  private _tplAsk?: Promise<{ templates?: Record<string, TemplateEntry> }>;
  /** The last template _sync fetched for (a failed fetch is not retried on every edit). */
  private _asked?: string;

  constructor() {
    super();
    // Pane and studio fire the same composed events; listen once on the host.
    this.addEventListener('add-module', this._onAddModule as EventListener);
    this.addEventListener('request-add-row', this._handleAddRow);
    this.addEventListener('template-create', () => { this._showTemplatePicker = 'create'; });
    this.addEventListener('template-load', () => { this._showTemplatePicker = 'link'; });
    this.addEventListener('template-resync', this._resyncAll);
    this.addEventListener('template-save', this._saveToTemplate);
    this.addEventListener('template-unlink', this._unlinkTemplate);
    this.addEventListener('open-studio', () => this.openStudio());
    this.addEventListener('studio-close', this._closeStudio);
    // the icon picker's Animated icons tab and follow-icon (lazy chunk) read the selected module and
    // write the card's custom_animations through the state manager (icon-animator/card-request.ts)
    this.addEventListener('mc-card-bridge', (e) => {
      const d = (e as CustomEvent<CardRequestDetail | undefined>).detail;
      e.stopPropagation();
      if (d) d.sm = this._stateManager;
    });
    // This element is the only source of config-changed toward HA. Anything a descendant fires
    // (an embedded card's editor, HA form elements, a previewed card asking for more-info or a
    // rebuild) stops here: HA's card dialog would take it as the magic card's config / act on it.
    for (const type of CONTAINED_EVENTS) this.addEventListener(type, this._containEvent);
  }

  private _containEvent = (e: Event): void => {
    if (e.composedPath()[0] !== this) e.stopPropagation();
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._stateManager.attached = true;
    this.addEventListener('mc-template-reapply', this._onTemplateReapply);
    this._unsubscribe ??= this._stateManager.subscribe((s) => {
      this._editorState = s;
      this._linkedTemplate = s.config.template ?? null;
      this._sync(s);
    });
  }

  /**
   * HA's card dialog renders only the selected tab (Config / Visibility / Layout): switching tabs
   * detaches this element, calls setConfig() on it while detached (new grid_options / visibility)
   * and re-attaches the same instance. The state manager (config, undo history) therefore lives as
   * long as the element; a pending edit is sent now instead of being dropped.
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mc-template-reapply', this._onTemplateReapply);
    this._stateManager.flush();
    this._stateManager.attached = false;
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  /** HA's config is the truth: also while detached (another tab of HA's card dialog). */
  setConfig(config: MagicCardConfig): void {
    this._stateManager.setConfig(config);
    // Only fetch template on the first call, not on every config-changed round-trip
    if (config.template && this.hass && !this._initialTemplateFetched) {
      this._initialTemplateFetched = true;
      this._fetchAndApplyTemplate(config.template, config);
    }
  }

  /** Test / harness hook: select by selection key ('card', 'r0', 'r0.c1', 'r0.c1.m0'). */
  selectByKey(key: string): void {
    this._stateManager?.setSelectedPath(selectionToPath(selectionFromKey(key)));
  }

  /** Test / harness hook: switch the pane (and studio) inspector to a tab. */
  setInspectorTab(tab: string): void {
    const pane = this.shadowRoot?.querySelector<PaneEditor>('mc-pane-editor');
    pane?.inspector?.setTab(tab);
    this.shadowRoot?.querySelector<Studio>('mc-studio')?.inspector?.setTab(tab);
  }

  /** Open the full-screen studio (the pane's "Open studio" button does the same). */
  openStudio(): void {
    this._studioMounted = true;
    this._studioOpen = true;
  }

  private _closeStudio = async (): Promise<void> => {
    if (!this._studioOpen) return;
    this._studioOpen = false;
    await this.updateComplete;
    await this.shadowRoot?.querySelector<Studio>('mc-studio')?.updateComplete;
    this.shadowRoot?.querySelector<PaneEditor>('mc-pane-editor')?.focusStudioButton();
  };

  /** An override was reset (e.g. a layout's child list): re-merge the template to restore its values. */
  private _onTemplateReapply = (e: Event): void => {
    e.stopPropagation();
    const config = this._stateManager?.getConfig();
    if (config?.template) this._fetchAndApplyTemplate(config.template, config);
  };

  /**
   * The card config keeps only its own custom_animations; the linked template's are editor state
   * (templateAnimations) that follows config.template however it changes (setConfig, undo / redo,
   * YAML, Unlink): from the cache, else fetched.
   */
  private _sync = (s: EditorState): void => {
    const name = s.config.template;
    const docs = name ? this._tpl.get(name) : undefined;
    if (s.templateAnimations !== docs) this._stateManager.setTemplateAnimations(docs);
    else if (name && this.hass && !this._tpl.has(name) && name !== this._asked) {
      this._asked = name;
      this._docs(name).catch(() => {});
    }
  };

  /** Every template, fetched now (one request at a time); their custom_animations go to the cache. */
  private async _templates(): Promise<Record<string, TemplateEntry>> {
    this._tplAsk ??= this.hass!.callWS<{ templates?: Record<string, TemplateEntry> }>({
      type: 'magic_card_utils/get_templates',
    }).finally(() => { this._tplAsk = undefined; });
    const all = (await this._tplAsk).templates ?? {};
    for (const [n, e] of Object.entries(all)) {
      const docs = animationDocList(e.config.custom_animations);
      this._tpl.set(n, docs.length ? docs : undefined);
    }
    this._sync(this._stateManager.getState());
    return all;
  }

  /** A template's custom_animations: cached, else fetched (a template that is gone has none). */
  private async _docs(name: string): Promise<Docs | undefined> {
    if (!this._tpl.has(name) && !(name in (await this._templates()))) this._tpl.set(name, undefined);
    return this._tpl.get(name);
  }

  private async _fetchAndApplyTemplate(name: string, local: MagicCardConfig): Promise<void> {
    if (!this.hass) return;
    try {
      const entry = (await this._templates())[name];
      if (entry) this._stateManager.setConfig(mergeTemplateWithOverrides(entry.config as MagicCardConfig, local, true));
    } catch (err) {
      console.warn('Magic Card Editor: Failed to fetch template', name, err);
    }
  }

  protected render(): TemplateResult {
    if (!this._editorState) {
      return html`<div class="loading" aria-busy="true" aria-label="Loading editor"></div>`;
    }

    // While the studio is open, overlays are slotted into its modal <dialog> so they stack above it.
    const overlays = this._renderOverlays(this._editorState);
    return html`<mc-pane-editor .stateManager=${this._stateManager} .hass=${this.hass}></mc-pane-editor>
${this._studioMounted
  ? html`<mc-studio .stateManager=${this._stateManager} .hass=${this.hass} .open=${this._studioOpen}>${this._studioOpen ? overlays : nothing}</mc-studio>`
  : nothing}
${this._studioOpen ? nothing : overlays}`;
  }

  private _renderOverlays(state: EditorState): TemplateResult {
    // compact markup: Lit keeps a template's whitespace in the bundle
    return html`${this._showModuleSelector
  ? html`<mc-module-selector @module-selected=${this._onModuleSelected}
@mc-picker-close=${() => { this._showModuleSelector = false; }}></mc-module-selector>`
  : nothing}
${this._showTemplatePicker
  ? html`<mc-template-picker .mode=${this._showTemplatePicker} .hass=${this.hass}
.config=${withTemplateAnimations(state.config, state.templateAnimations)}
@mc-picker-close=${() => { this._showTemplatePicker = null; }}
@template-selected=${this._onTemplateSelected}></mc-template-picker>`
  : nothing}
${this._showSyncDialog ? this._renderSyncDialog() : nothing}`;
  }

  // ── add row + "update linked cards?" confirm ──

  private _renderSyncDialog(): TemplateResult {
    // A native <dialog> shown with showModal() (PickerDialogController): top layer, so it stays on
    // screen inside HA's transformed card dialog and above the studio; Escape goes to _cancelSync.
    // compact markup: Lit keeps a template's whitespace in the bundle
    return html`<dialog class="mc-sync-dialog" aria-labelledby="sync-title" aria-describedby="sync-text"
@click=${(e: Event) => { if (this._syncDialogCtrl.isBackdropClick(e)) this._cancelSync(); }}>
<div class="dialog" @click=${(e: Event) => e.stopPropagation()}><h2 id="sync-title">Update linked cards?</h2>
<p id="sync-text">This card is linked to template <span class="mono">${this._linkedTemplate}</span>. Do you want to
update all linked cards with this structural change?</p><div class="actions">
<button type="button" class="btn btn-secondary" @click=${this._handleSyncNo}>Only this card</button>
<button type="button" class="btn btn-primary" @click=${this._handleSyncYes}>Update all linked cards</button></div></div></dialog>`;
  }

  private _handleAddRow = (): void => {
    if (this._linkedTemplate) {
      this._pendingSyncAction = () => this._stateManager.addRow('1');
      this._showSyncDialog = true;
    } else {
      this._stateManager.addRow('1');
    }
  };

  private _cancelSync = (): void => {
    this._showSyncDialog = false;
    this._pendingSyncAction = undefined;
  };

  private _handleSyncNo = (): void => {
    this._pendingSyncAction?.();
    this._showSyncDialog = false;
    this._pendingSyncAction = undefined;
  };

  private _handleSyncYes = async (): Promise<void> => {
    this._pendingSyncAction?.();
    this._showSyncDialog = false;
    this._pendingSyncAction = undefined;
    // Save to template to propagate change
    await this._saveToTemplate();
  };

  // ── template actions ──

  private _resyncAll = (): void => {
    const config = clearNotSynced(this._stateManager.getConfig());
    this._stateManager.updateConfig(config);
    // Re-fetch template to restore synced values
    if (this._linkedTemplate && this.hass) {
      this._initialTemplateFetched = false;
      this._fetchAndApplyTemplate(this._linkedTemplate, config);
    }
  };

  private _saveToTemplate = async (): Promise<void> => {
    const m = this._stateManager;
    const name = m.getConfig().template;
    if (!name || !this.hass) return;
    try {
      // the template's own animations (hidden ones stay), with this card's versions and additions;
      // a card that plays only its own (custom_animations in not_synced) adds them too
      const docs = await this._docs(name);
      const entry = stripForTemplate(withTemplateAnimations({ ...m.getConfig(), not_synced: [] }, docs, false));
      await this.hass.callWS({ type: 'magic_card_utils/save_template', name, template: { config: entry } });
      const saved = animationDocList(entry.custom_animations);
      this._tpl.set(name, saved.length ? saved : undefined);
      this._sync(m.getState());
      // the card's copies now equal to the template's go (a hidden id keeps its copy: the template's
      // is not played here)
      const c = m.getConfig();
      const json = new Map(saved.map((d) => [d.id, JSON.stringify(d)]));
      const own = animationDocList(c.custom_animations);
      const keep = own.filter((d) => c.hidden_animations?.includes(d.id as string) || json.get(d.id) !== JSON.stringify(d));
      const prune = c.template === name && keep.length < own.length;
      // the template now equals the card: its override markers go, in the same step (hidden ids stay)
      if (c.template !== name || (!prune && !countNotSynced(c) && !c.not_synced)) return;
      const next = clearNotSynced(c);
      if (c.hidden_animations) next.hidden_animations = c.hidden_animations;
      if (prune) next.custom_animations = keep.length ? keep : undefined;
      m.updateConfig(next);
    } catch (err) {
      console.warn('Magic Card Editor: Failed to save template', name, err);
    }
  };

  /** The card keeps the animations it played (the template's included) as its own. */
  private _unlinkTemplate = async (): Promise<void> => {
    const m = this._stateManager;
    const name = m.getConfig().template;
    try {
      // the template's documents first: an Unlink before the fetch finished (or after it failed) copies them too
      const docs = name && (await this._docs(name));
      const config = { ...withTemplateAnimations(m.getConfig(), docs) };
      if (!name || config.template !== name) return;
      delete config.template;
      delete config.hidden_animations;
      m.updateConfig(config);
    } catch (err) {
      console.warn('Magic Card Editor: Failed to fetch template', name, err);
    }
  };

  private _onTemplateSelected = (e: CustomEvent) => {
    const config = { ...(e.detail.config as MagicCardConfig) };
    // the template supplies its custom_animations (fetched below): none of them become the card's own
    if (!config.not_synced?.includes('custom_animations')) delete config.custom_animations;
    delete config.hidden_animations;
    this._stateManager.updateConfig(config);
    this._showTemplatePicker = null;
    if (config.template) this._fetchAndApplyTemplate(config.template, config);
  };

  // ── modules ──

  private _onAddModule = (e: CustomEvent): void => {
    this._moduleSelectorTarget = e.detail;
    this._showModuleSelector = true;
  };

  private _onModuleSelected = (e: CustomEvent) => {
    const t = this._moduleSelectorTarget;
    if (t?.moduleIndex !== undefined) this._stateManager.addChildModule(t.rowIndex, t.colIndex, t.moduleIndex, t.child, t.slot ?? 0, e.detail.type);
    else if (t) this._stateManager.addModule(t.rowIndex, t.colIndex, e.detail.type);
    this._showModuleSelector = false;
    this._moduleSelectorTarget = undefined;
  };

  static styles = [
    editorSystem,
    // compact: Lit keeps a template's whitespace in the bundle
    css`
:host { display: block; }
.loading { min-height: 240px; }
.mc-sync-dialog { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; box-sizing: border-box; width: auto; height: auto; max-width: none; max-height: none; margin: 0; border: 0; padding: 16px; overflow: hidden; color: inherit; background: rgba(0, 0, 0, 0.4); overscroll-behavior: contain; }
.mc-sync-dialog:not([open]) { display: none; }
.mc-sync-dialog::backdrop { background: transparent; }
.dialog { width: min(420px, 100%); display: grid; gap: 12px; padding: 24px; border-radius: var(--mc-radius-lg); background: var(--mc-surface); box-shadow: var(--mc-shadow-float); }
.dialog h2 { margin: 0; font-size: 1.125rem; font-weight: 500; }
.dialog p { margin: 0; font-size: 0.875rem; color: var(--mc-text-2); overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 8px; }
`,
  ];
}
