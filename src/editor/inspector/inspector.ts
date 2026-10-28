import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  CardModule,
  ColumnConfig,
  DisplayConfig,
  EditorState,
  EditorTab,
  FlowConfig,
  HomeAssistant,
  MagicCardConfig,
  RowConfig,
  RowModuleConfig,
  TabsModuleConfig,
} from '../../types';
import type { EditorStateManager } from '../state/editor-state';
import type { SyncContext } from '../../utils/sync-path';
import { ModuleRegistry } from '../../modules/module-registry';
import { moduleEditors } from '../modules';
import { hasColumnWidths } from '../../utils/column-widths';
import { editorStyles } from '../../css/editor-css';
import {
  ModuleSelection,
  Selection,
  ENTITY_RE,
  breakableId,
  childCrumbs,
  clampSelection,
  layoutModuleAt,
  moduleAt,
  parentSelection,
  countModules,
  describeSelection,
  moduleLabel,
  isHiddenItem,
  itemAt,
  layerName,
  selectionFromPath,
  selectionKey,
  slotSelection,
  selectionToPath,
} from '../studio/selection';
import { toggleNotSynced, wrapOnChangeWithSync } from '../state/template-sync';
import { entityStats, resolveEntitySource } from '../entity-source';
import { childListKey, replaceDescendant } from '../../utils/module-path';
import { layerContext } from '../layers/placement-model';
import { onStatus } from '../layers/bg-status';
import { moveLayer, turnOnLowPower } from '../layers/layer-actions';
import type { MoveTo } from '../layers/placement-model';
import { withEditorKey } from '../../utils/editor-key';
import {
  CardUpdate,
  CardPatch,
  FlowsState,
  RulesState,
  DesignViewState,
  cardThemeOptions,
  renderCardConditions,
  renderCardDesign,
  renderCardFlows,
  renderCardGeneral,
} from './card-settings';
import { markFlowsOverridden } from '../state/flows';
import { flowKeys } from '../../utils/flow-keys';
import {
  renderColumnConditions,
  renderColumnDesign,
  renderColumnGeneral,
  renderRowActions,
  renderRowConditions,
  renderRowDesign,
  renderRowGeneral,
  renderNestedColumnConditions,
  renderNestedColumnDesign,
  renderNestedColumnGeneral,
  renderTabGeneral,
} from './container-settings';

import '../components/color-picker';
import '../components/unit-field';
import '../components/entity-picker';
import '../components/service-picker';
import '../components/icon-picker';
import '../components/media-picker';
import '../components/card-picker';
import '../components/box-field';
import '../components/design-panel';
import { t, m, type MessageIndex } from '../i18n';

type Kind = Selection['kind'];

/** Tabs are text-only in every variant (one tab style). */
const TAB_META: Record<EditorTab, { label: MessageIndex }> = {
  general: { label: m('card-editor.inspector.general') },
  actions: { label: m('card-editor.inspector.actions') },
  conditions: { label: m('card-editor.inspector.conditions') },
  design: { label: m('card-editor.inspector.design') },
  flows: { label: m('card-editor.inspector.flows') },
};
const MODULE_TAB_ORDER: EditorTab[] = ['general', 'actions', 'conditions', 'design'];
const KIND_TABS: Record<Exclude<Kind, 'module'>, EditorTab[]> = {
  card: ['general', 'design', 'conditions', 'flows'],
  row: ['general', 'actions', 'conditions', 'design'],
  column: ['general', 'conditions', 'design'],
  slot: ['general', 'conditions', 'design'],
};

/**
 * Inspector for the current selection (card / row / column / module).
 * variant 'pane'   : inside the dialog pane (no outer padding; the pane provides it)
 * variant 'studio' : studio side panel (own padding)
 */
@customElement('mc-inspector')
export class Inspector extends LitElement {
  @property({ attribute: false }) stateManager?: EditorStateManager;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ reflect: true }) variant: 'pane' | 'studio' = 'pane';

  @state() private _state?: EditorState;
  @state() private _tabs: Record<Kind, EditorTab> = { card: 'general', row: 'general', column: 'general', module: 'general', slot: 'general' };
  @state() private _expandedRules = new Set<string>();
  @state() private _expandedFlows = new Set<string>();
  /** Flow blocks: disclosure states and the look editor's one-level Undo snapshots, per flow key, for the session (never YAML). */
  @state() private _flowSections = new Map<string, boolean>();
  @state() private _flowUndo = new Map<string, FlowConfig>();
  /** Card Design tab: which design is edited (Default, Hover or a rule id) and the groups the user toggled. */
  @state() private _designView = 'default';
  @state() private _designOpen = new Map<string, boolean>();

  private _unsubscribe?: () => void;
  private _subscribedTo?: EditorStateManager;
  private _focusTab = false;
  /** The selected flow last seen: a newly selected one opens Card settings → Flows with its block. */
  private _seenFlow: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.stateManager && !this._unsubscribe) this._subscribe();
    // a Card backdrop layer that fell back shows a warning mark on its group header
    this._stopStatus = onStatus(() => this.requestUpdate());
  }

  private _stopStatus?: () => void;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopStatus?.();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
    this._subscribedTo = undefined;
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('stateManager') && this.stateManager !== this._subscribedTo) this._subscribe();
  }

  protected updated(): void {
    this._syncScroller();
    if (this._focusCardEntity) {
      const picker = this.shadowRoot?.querySelector<HTMLElement & { focusInput?: () => void; updateComplete: Promise<unknown> }>('mc-entity-picker[data-card-entity]');
      if (picker) {
        this._focusCardEntity = false;
        picker.scrollIntoView?.({ block: 'nearest' });
        // the studio canvas takes the focus back after a selection change: focus again once it has settled
        const focus = () => picker.focusInput?.();
        void picker.updateComplete.then(focus);
        setTimeout(focus, 80);
      }
    }
    // the card Design tab's "Editing design for" select follows the state (?selected alone does not move it)
    const view = this.shadowRoot?.querySelector<HTMLSelectElement>('select#design-view');
    if (view && view.value !== this._designView && [...view.options].some((o) => o.value === this._designView)) view.value = this._designView;
    const tab = this.shadowRoot?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!tab) return;
    // Keep the active tab visible in the horizontally scrolling tablist (without scrolling the page).
    const list = tab.parentElement!;
    if (tab.offsetLeft < list.scrollLeft) list.scrollLeft = tab.offsetLeft - 4;
    else if (tab.offsetLeft + tab.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollLeft = tab.offsetLeft + tab.offsetWidth - list.clientWidth + 4;
    }
    if (this._focusTab) {
      this._focusTab = false;
      tab.focus();
    }
  }

  private _scrollKey = '';
  private _seenSeq = 0;

  /** Studio: a tab switch or new selection starts at the top of the (only) scrolling body. */
  private _syncScroller(): void {
    const body = this.shadowRoot?.querySelector<HTMLElement>('.insp-body');
    if (!body) return;
    const sel = this._selection();
    const key = `${this._state?.selectedPath ?? ''}|${this._activeTab(sel, this._tabsFor(sel))}`;
    const seq = this.stateManager?.selectionSeq ?? 0;
    const seqChanged = seq !== this._seenSeq;
    this._seenSeq = seq;
    const skip = seqChanged && this.stateManager?.selectionReveal === false;
    if (key !== this._scrollKey) {
      const switched = this._scrollKey !== '';
      this._scrollKey = key;
      body.scrollTop = 0;
      // Narrow or short layout: the page scrolls, not the body, so bring the panel's head into view.
      // A context click selects without it, so the page does not move under the open menu.
      if (switched && !skip && getComputedStyle(body).overflowY === 'visible') this.shadowRoot?.querySelector<HTMLElement>('.insp-head')?.scrollIntoView?.({ block: 'nearest' });
    }
  }

  private _subscribe(): void {
    this._unsubscribe?.();
    this._subscribedTo = this.stateManager;
    this._unsubscribe = this.stateManager?.subscribe((s) => {
      this._state = s;
      // Open blocks of flows that no longer exist (undo, delete) close, so redo doesn't reopen them.
      if (this._expandedFlows.size) {
        const live = new Set(flowKeys(Array.isArray(s.config.flows) ? s.config.flows : []));
        if ([...this._expandedFlows].some((k) => !live.has(k))) this._expandedFlows = new Set([...this._expandedFlows].filter((k) => live.has(k)));
      }
      const flow = s.selectedFlow ?? null;
      if (flow && flow !== this._seenFlow) {
        this._tabs = { ...this._tabs, card: 'flows' };
        if (!this._expandedFlows.has(flow)) this._expandedFlows = new Set(this._expandedFlows).add(flow);
      }
      this._seenFlow = flow;
    });
  }

  /** Activate a tab ('general' | 'actions' | 'conditions' | 'design') for the current selection kind. */
  setTab(tab: string): void {
    const sel = this._selection();
    if (!this._tabsFor(sel).includes(tab as EditorTab)) return;
    this._tabs = { ...this._tabs, [sel.kind]: tab as EditorTab };
  }

  private _focusCardEntity = false;

  /** "Card settings > General" link of an entity source: select the card, show General and focus the Card entity field. */
  private _openCardEntity = (): void => {
    this._tabs = { ...this._tabs, card: 'general' };
    this._focusCardEntity = true;
    this._goTo({ kind: 'card' });
    this.requestUpdate();
  };

  /** "Show in tree" of a tabs module's design: select its first tab, where the tab settings are. */
  private _showFirstTab = (): void => {
    const sel = this._selection();
    if (sel.kind === 'module') this._goTo(slotSelection(sel.row, sel.col, sel.module, sel.child, 0));
  };

  /** Move keyboard focus to the inspector (its active tab) once the current selection has rendered. */
  focusInspector(): void {
    this._focusTab = true;
    this.requestUpdate();
  }

  // ── helpers ──

  private _selection(): Selection {
    return selectionFromPath(this._state?.selectedPath ?? null);
  }

  private _module(sel: Selection): CardModule | undefined {
    const config = this._state?.config;
    return config ? moduleAt(config, sel) : undefined;
  }

  private _tabsFor(sel: Selection): EditorTab[] {
    // A tab has only its General settings.
    if (sel.kind === 'slot' && this._state && layoutModuleAt(this._state.config, sel)?.type === 'tabs') return ['general'];
    if (sel.kind !== 'module') return KIND_TABS[sel.kind];
    const mod = this._module(sel);
    if (!mod) return ['general'];
    const listed = moduleEditors.tabs(mod.type);
    return MODULE_TAB_ORDER.filter((t) => listed.includes(t));
  }

  private _activeTab(sel: Selection, tabs: EditorTab[]): EditorTab {
    const want = this._tabs[sel.kind];
    return tabs.includes(want) ? want : tabs[0];
  }

  private _goTo(sel: Selection): void {
    this.stateManager?.setSelectedPath(selectionToPath(sel));
  }

  private _onTabKeydown(e: KeyboardEvent, sel: Selection, tabs: EditorTab[], current: EditorTab): void {
    const idx = tabs.indexOf(current);
    const targets: Record<string, number> = {
      ArrowRight: (idx + 1) % tabs.length,
      ArrowLeft: (idx - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = targets[e.key];
    if (next === undefined) return;
    e.preventDefault();
    this._focusTab = true;
    this._tabs = { ...this._tabs, [sel.kind]: tabs[next] };
  }

  /** `field-sync-toggle` from any sync indicator: flip the path in the selected item's not_synced. */
  private _onSyncToggle = (e: Event): void => {
    const sm = this.stateManager;
    const config = sm?.getConfig();
    if (!sm || !config?.template) return;
    const { propertyPath, synced } = (e as CustomEvent<{ propertyPath: string; synced: boolean }>).detail;
    const sel = this._selection();
    switch (sel.kind) {
      case 'card':
        sm.updateConfig({ ...config, not_synced: toggleNotSynced(config.not_synced, propertyPath, synced) });
        break;
      case 'row':
        sm.updateRow(sel.row, { not_synced: toggleNotSynced(config.rows[sel.row]?.not_synced, propertyPath, synced) });
        break;
      case 'column':
        sm.updateColumn(sel.row, sel.col, {
          not_synced: toggleNotSynced(config.rows[sel.row]?.columns[sel.col]?.not_synced, propertyPath, synced),
        });
        break;
      case 'module': {
        const mod = this._module(sel);
        if (!mod) return;
        sm.updateModule(sel.row, sel.col, sel.module, {
          not_synced: toggleNotSynced(mod.not_synced as string[] | undefined, propertyPath, synced),
        }, sel.child);
        break;
      }
    }
  };

  private get _rulesState(): RulesState {
    const set = (next: Set<string>) => {
      this._expandedRules = next;
    };
    return {
      expanded: this._expandedRules,
      toggle: (id) => {
        const next = new Set(this._expandedRules);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        set(next);
      },
      expand: (id) => set(new Set(this._expandedRules).add(id)),
      collapse: (id) => {
        const next = new Set(this._expandedRules);
        next.delete(id);
        set(next);
      },
    };
  }

  private get _designState(): DesignViewState {
    return {
      view: this._designView,
      set: (v) => {
        this._designView = v;
      },
      open: this._designOpen,
      toggle: (id, open) => {
        this._designOpen = new Map(this._designOpen).set(id, open);
      },
    };
  }

  private get _flowsState(): FlowsState {
    const sm = this.stateManager;
    const selected = this._state?.selectedFlow ?? null;
    return {
      expanded: this._expandedFlows,
      selected,
      // Opening a block selects its flow (highlighted on the canvas); closing the selected one clears it.
      toggle: (key) => {
        const next = new Set(this._expandedFlows);
        const open = !next.has(key);
        if (open) next.add(key);
        else next.delete(key);
        this._expandedFlows = next;
        if (open) sm?.selectFlow(key);
        else if (selected === key) sm?.selectFlow(null);
      },
      sections: this._flowSections,
      setSection: (id, open) => {
        this._flowSections = new Map(this._flowSections).set(id, open);
      },
      undoSnapshots: this._flowUndo,
      setUndoSnapshot: (flowKey, snapshot) => {
        const next = new Map(this._flowUndo);
        if (snapshot) next.set(flowKey, snapshot);
        else next.delete(flowKey);
        this._flowUndo = next;
      },
      rekey: (from, to) => {
        // The block's section states follow its flow to the new key; an Undo snapshot is dropped (it belonged to the old ends).
        const moved = new Map<string, boolean>();
        for (const [id, open] of this._flowSections) moved.set(id.startsWith(`${from}|`) ? `${to}|${id.slice(from.length + 1)}` : id, open);
        this._flowSections = moved;
        if (this._flowUndo.has(from)) {
          const u = new Map(this._flowUndo);
          u.delete(from);
          this._flowUndo = u;
        }
        if (selected === from) sm?.selectFlow(to);
        if (!this._expandedFlows.has(from)) return;
        const next = new Set(this._expandedFlows);
        next.delete(from);
        next.add(to);
        this._expandedFlows = next;
      },
    };
  }

  // ── render ──

  protected render(): TemplateResult {
    const config = this._state?.config;
    if (!config || !this.stateManager) return html``;
    const sel = this._selection();
    const tabs = this._tabsFor(sel);
    const tab = this._activeTab(sel, tabs);

    return html`
      <div class="insp" @field-sync-toggle=${this._onSyncToggle} @mc-open-card-entity=${this._openCardEntity} @mc-select-first-tab=${this._showFirstTab}>
        <div class="insp-head">
          ${this._renderIdentity(config, sel)}
          <div class="seg full tabs" role="tablist" aria-label=${t('card-editor.inspector.settings')}>
            ${tabs.map((id) => {
              const on = id === tab;
              return html`
                <button
                  type="button"
                  role="tab"
                  id="tab-${id}"
                  aria-controls="panel-${id}"
                  aria-selected=${on ? 'true' : 'false'}
                  tabindex=${on ? '0' : '-1'}
                  @click=${() => this.setTab(id)}
                  @keydown=${(e: KeyboardEvent) => this._onTabKeydown(e, sel, tabs, tab)}
                >
                  ${t(TAB_META[id].label)}
                </button>
              `;
            })}
          </div>
        </div>
        <div class="insp-body" role="tabpanel" tabindex="0" id="panel-${tab}" aria-labelledby="tab-${tab}">
          ${this._renderBody(config, sel, tab)}
        </div>
      </div>
    `;
  }

  private _renderIdentity(config: MagicCardConfig, sel: Selection): TemplateResult {
    const info = describeSelection(config, sel);
    const s = clampSelection(config, sel);
    const crumb = (label: string, target: Selection) =>
      html`<button type="button" class="crumb" title=${t('card-editor.inspector.select-label', { label })} @click=${() => this._goTo(target)}>${label}</button>`;
    const dot = html`<span aria-hidden="true"> · </span>`;
    const rowOf = (i: number) => t('card-editor.inspector.row-n', { n: i + 1 });
    const colOf = (i: number) => t('card-editor.inspector.column-n', { n: i + 1 });
    const rows = (n: number) => t('card-editor.inspector.n', { n });
    const columns = (n: number) => t('card-editor.inspector.n-2', { n });
    const modules = (n: number) => t('card-editor.inspector.n-3', { n });

    // Header: "<Type> · <label>" with a one-line path under it.
    let title = info.title;
    let icon = info.icon;
    let path: TemplateResult;
    switch (s.kind) {
      case 'card': {
        title = config.name?.trim() ? `${t('card-editor.inspector.card')} · ${info.title}` : t('card-editor.inspector.card');
        path = html`${rows((config.rows || []).length)} · ${modules(countModules(config))}`;
        break;
      }
      case 'row': {
        const row = config.rows[s.row];
        icon = 'mdi:table-row';
        path = html`${columns(row.columns.length)} · ${hasColumnWidths(row) ? t('card-editor.inspector.custom-widths') : t('card-editor.inspector.layout-layout', { layout: row.layout || '1' })}`;
        break;
      }
      case 'column': {
        const n = config.rows[s.row].columns[s.col].modules?.length ?? 0;
        path = html`${crumb(rowOf(s.row), { kind: 'row', row: s.row })}${dot}${modules(n)}`;
        break;
      }
      case 'slot': {
        // "Row 1 · Column 1 · Tabs": the way back up to the layout module that owns the tab / column.
        const owner = parentSelection(s) as ModuleSelection;
        path = html`${crumb(rowOf(s.row), { kind: 'row', row: s.row })}${dot}${crumb(colOf(s.col), {
          kind: 'column',
          row: s.row,
          col: s.col,
        })}${childCrumbs(config, owner).map((p) => html`${dot}${crumb(p.label, p.target)}`)}`;
        break;
      }
      case 'module': {
        const mod = moduleAt(config, s);
        if (!mod || typeof mod !== 'object') {
          path = html`${crumb(rowOf(s.row), { kind: 'row', row: s.row })}`;
          break;
        }
        const label = moduleLabel(mod);
        // a layer name stands on its own; else "<Type> · <label>"
        if (label && !layerName(mod)) title = `${info.title} · ${label}`;
        const entity = typeof mod.entity === 'string' && ENTITY_RE.test(mod.entity) ? mod.entity : '';
        // A layout child: its layout modules (with tab / column) lead back up, e.g. "Row 1 · Column 1 · Tabs · Living".
        const parents = childCrumbs(config, s).slice(0, -1);
        const up = parentSelection(s, config);
        const slot = up.kind === 'slot' ? crumb(describeSelection(config, up).title, up) : undefined;
        path = html`${crumb(rowOf(s.row), { kind: 'row', row: s.row })}${dot}${crumb(colOf(s.col), {
          kind: 'column',
          row: s.row,
          col: s.col,
        })}${parents.map((p) => html`${dot}${crumb(p.label, p.target)}`)}${slot ? html`${dot}${slot}` : nothing}${entity
          ? html`${dot}<span class="mono">${breakableId(entity)}</span>`
          : nothing}`;
        break;
      }
    }

    return html`
      <div class="insp-id">
        <span class="ico k-${s.kind === 'slot' ? 'column' : s.kind}"><ha-icon icon=${icon}></ha-icon></span>
        <div class="txt">
          <h2>${title}</h2>
          <p class="path">${path}${isHiddenItem(itemAt(config, s))
            ? html`${dot}<span class="hidden-note"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${t('card-editor.inspector.hidden-on-dashboard')}</span>`
            : nothing}</p>
        </div>
      </div>
    `;
  }

  private _renderBody(config: MagicCardConfig, sel: Selection, tab: EditorTab): TemplateResult {
    const sm = this.stateManager!;
    switch (sel.kind) {
      case 'card':
        return this._renderCard(config, tab);
      case 'row': {
        const row: RowConfig | undefined = config.rows[sel.row];
        if (!row) return html``;
        if (tab === 'design') return renderRowDesign(sel.row, row, sm, this.hass);
        if (tab === 'conditions') return renderRowConditions(sel.row, row, sm, this.hass);
        if (tab === 'actions') return renderRowActions(sel.row, row, sm, this.hass);
        return renderRowGeneral(sel.row, row, sm, this.hass);
      }
      case 'column': {
        const col: ColumnConfig | undefined = config.rows[sel.row]?.columns[sel.col];
        if (!col) return html``;
        if (tab === 'design') return renderColumnDesign(sel.row, sel.col, col, sm, this.hass);
        if (tab === 'conditions') return renderColumnConditions(sel.row, sel.col, col, sm, this.hass);
        return renderColumnGeneral(sel.row, sel.col, col, sm, this.hass);
      }
      case 'module':
        return this._renderModule(config, sel, tab);
      case 'slot':
        return this._renderSlot(config, sel, tab);
    }
  }

  private _renderCard(config: MagicCardConfig, tab: EditorTab): TemplateResult {
    const sm = this.stateManager!;
    const syncCtx: SyncContext | undefined = config.template
      ? { templateName: config.template, notSynced: config.not_synced || [], basePath: '' }
      : undefined;
    const update: CardUpdate = (prop, value) => {
      const current = sm.getConfig();
      const next = { ...current, [prop]: value } as MagicCardConfig;
      if (current.template) next.not_synced = toggleNotSynced(current.not_synced, prop as string, true);
      sm.updateConfig(next);
    };
    const patch: CardPatch = (updates, syncKey) => {
      const current = sm.getConfig();
      const next = { ...current } as Record<string, unknown>;
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined) delete next[k];
        else next[k] = v;
      }
      if (current.template) next.not_synced = toggleNotSynced(current.not_synced, syncKey as string, true);
      sm.updateConfig(next as unknown as MagicCardConfig);
    };
    if (tab === 'design') {
      return renderCardDesign(config, update, syncCtx, this.hass, patch, sm.getState().templateAnimations, (next) => sm.updateConfig(next), this._designState, (t) => this.setTab(t));
    }
    if (tab === 'conditions') {
      return renderCardConditions(
        config,
        (d: DisplayConfig) => update('display', d),
        syncCtx,
        this.hass,
        update,
        cardThemeOptions(this.hass),
        this._rulesState,
        (t) => this.setTab(t),
      );
    }
    if (tab === 'flows') {
      const write = (next: MagicCardConfig) => {
        const out = { ...next };
        markFlowsOverridden(out);
        sm.updateConfig(out);
      };
      return renderCardFlows(config, write, syncCtx, this.hass, this._flowsState);
    }
    const entityField = {
      ...entityStats(config),
      // a card entity belongs to this card only: no not_synced mark, even on a template-linked card
      onChange: (entity: string | undefined) => {
        const next = { ...sm.getConfig() } as Record<string, unknown>;
        if (entity === undefined) delete next.entity;
        else next.entity = entity;
        sm.updateConfig(next as unknown as MagicCardConfig);
      },
    };
    return renderCardGeneral(config, update, syncCtx, this.hass, this.variant === 'studio', entityField);
  }

  /** A tab (General) or a row-module column (General, Conditions, Design). */
  private _renderSlot(config: MagicCardConfig, sel: Extract<Selection, { kind: 'slot' }>, tab: EditorTab): TemplateResult {
    const sm = this.stateManager!;
    const mod = layoutModuleAt(config, sel);
    if (!mod) return html``;
    if (mod.type === 'tabs') return renderTabGeneral(sel, sel.slot, mod as TabsModuleConfig, sm, this.hass);
    const row = mod as RowModuleConfig;
    if (tab === 'design') return renderNestedColumnDesign(sel, sel.slot, row, sm, this.hass);
    if (tab === 'conditions') return renderNestedColumnConditions(sel, sel.slot, row, sm, this.hass);
    return renderNestedColumnGeneral(sel, sel.slot, row, sm, this.hass);
  }

  private _renderModule(config: MagicCardConfig, sel: Extract<Selection, { kind: 'module' }>, tab: EditorTab): TemplateResult {
    const mod = this._module(sel);
    if (!mod) return html``;
    if (!ModuleRegistry.get(mod.type)) {
      return html`
        <div class="empty">
          <ha-icon icon="mdi:puzzle-remove-outline"></ha-icon>
          <strong>${t('card-editor.inspector.unknown-module-type')}</strong>
          <p class="mono">${mod.type}</p>
        </div>
      `;
    }
    const linked = config.template;
    const sm = this.stateManager!;
    let onChange: (m: CardModule) => void;
    // A child of a template-linked card has no per-field sync: its layout's whole child list is the
    // override (the template merge keeps or replaces that list as a whole), so its editors get no template.
    let template = linked;
    if (!sel.child?.length) {
      const update = (m: CardModule) => sm.replaceModule(sel.row, sel.col, sel.module, m);
      onChange = linked ? wrapOnChangeWithSync(mod, update) : update;
    } else if (!linked) {
      onChange = (m: CardModule) => sm.replaceModule(sel.row, sel.col, sel.module, m, sel.child);
    } else {
      // Template-linked: overrides are tracked on the top-level module (its child list becomes local),
      // the same as editing the child inline in the layout module's General tab.
      template = undefined;
      const top = config.rows[sel.row].columns[sel.col].modules[sel.module];
      const updateTop = wrapOnChangeWithSync(top, (m: CardModule) => sm.replaceModule(sel.row, sel.col, sel.module, m));
      onChange = (m: CardModule) => updateTop(replaceDescendant(top, sel.child!, m));
    }
    const body = withEditorKey(selectionKey(sel), () => moduleEditors.render(tab, mod, this.hass, onChange, template, resolveEntitySource(config, sel), layerContext(config, sel)));
    // the Layer group's order buttons and the Low-power button leave as events (they need the list and the card)
    return html`<div class="mod-body" @mc-layer-move=${(e: CustomEvent<{ to: MoveTo }>) => { if (sm) moveLayer(sm, sel, e.detail.to); }} @mc-layers-low-power=${() => { if (sm) turnOnLowPower(sm); }}>${this._renderChildListSync(config, sel)}${body}</div>`;
  }

  /**
   * Template-linked card, a layout child or a layout module selected: one sync control for the
   * layout's child list ("Reset to template" while it is overridden) instead of per-field indicators.
   */
  private _renderChildListSync(config: MagicCardConfig, sel: Extract<Selection, { kind: 'module' }>): TemplateResult | typeof nothing {
    if (!config.template) return nothing;
    const top = config.rows[sel.row]?.columns[sel.col]?.modules[sel.module];
    const key = childListKey(top);
    if (!top || !key) return nothing;
    const overridden = ((top.not_synced || []) as string[]).includes(key);
    const child = !!sel.child?.length;
    return html`
      <div class="child-list-sync" data-overridden=${overridden ? '' : nothing}>
        <p class="help">${overridden
          ? child ? t("card-editor.inspector.this-module-is-part-of-its-layout-the") : t("card-editor.inspector.the-modules-inside-this-layout-the")
          : child ? t('card-editor.inspector.this-module-is-part-of-its-layout-they') : t('card-editor.inspector.the-modules-inside-this-layout-they')}</p>
        ${overridden
          ? html`<button type="button" class="btn btn-text btn-sm child-list-reset" @click=${() => this._resetChildList(sel.row, sel.col, sel.module, key)}>
              <ha-icon icon="mdi:backup-restore"></ha-icon>${t('card-editor.inspector.reset-to-template')}
            </button>`
          : nothing}
      </div>
    `;
  }

  /** Sync the layout's child list with the template again and re-merge (the editor refetches the template). */
  private _resetChildList(row: number, col: number, module: number, key: string): void {
    const sm = this.stateManager;
    const top = sm?.getConfig().rows[row]?.columns[col]?.modules[module];
    if (!sm || !top) return;
    sm.updateModule(row, col, module, { not_synced: toggleNotSynced(top.not_synced as string[] | undefined, key, false) });
    this.dispatchEvent(new CustomEvent('mc-template-reapply', { bubbles: true, composed: true }));
  }

  static styles = [
    ...editorStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .insp-head {
        padding: 16px 16px 12px;
        display: grid;
        gap: 12px;
        border-bottom: 1px solid var(--mc-divider);
      }
      .mod-body {
        display: contents;
      }
      .insp-body {
        padding: 16px;
        display: grid;
        gap: 20px;
        align-content: start;
        min-width: 0;
      }
      /* studio: head and tabs stay put, only the body scrolls; sticky when stacked */
      :host([variant='studio']),
      :host([variant='studio']) .insp {
        height: 100%;
      }
      :host([variant='studio']) .insp {
        display: flex;
        flex-direction: column;
      }
      :host([variant='studio']) .insp-head {
        flex: none;
        background: var(--mc-surface);
      }
      :host([variant='studio']) .insp-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      @media (max-width: 640px), (max-height: 480px) {
        :host([variant='studio']),
        :host([variant='studio']) .insp {
          height: auto;
        }
        :host([variant='studio']) .insp-body {
          overflow: visible;
        }
      }
      @media (max-width: 640px) and (min-height: 481px) {
        :host([variant='studio']) .insp-head {
          position: sticky;
          top: 0;
          z-index: 2;
        }
      }
      :host([variant='pane']) .insp-head {
        padding: 0 0 12px;
      }
      /* row: Column widths (one number + unit per column) */
      .col-width-list {
        display: grid;
        gap: 8px;
      }
      .col-width {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
      }
      .col-width-lbl {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .col-widths-foot {
        display: flex;
        justify-content: flex-start;
        margin-left: -8px;
      }
      :host([variant='pane']) .insp-body {
        padding: 16px 0 0;
      }
      .insp-id {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      .insp-id .ico {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        /* level colour (.k-card / .k-row / .k-column / .k-module), matching the canvas frame */
        background: var(--k-tint);
        flex: none;
        color: var(--k-ink);
        --mdc-icon-size: 22px;
      }
      .insp-id .txt {
        flex: 1;
        min-width: 0;
      }
      .insp-id h2 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .path {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
      }
      .path .mono {
        font-size: 0.75rem;
      }
      .path .hidden-note {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }
      /* path segments navigate up, but read as plain path text */
      .crumb {
        border: 0;
        background: transparent;
        padding: 0;
        border-radius: 2px;
        font-size: inherit;
        color: inherit;
      }
      .crumb:hover {
        color: var(--mc-accent-ink);
        text-decoration: underline;
      }
      .tabs {
        position: relative;
      }
      /* studio: fixed 340px panel, tighter padding so all four tabs fit */
      :host([variant='studio']) .tabs > button {
        padding: 0 8px;
      }
      .cond-list {
        display: grid;
        gap: 12px;
      }
      .design-tab {
        display: grid;
        gap: 20px;
      }
      .rule-pick {
        display: grid;
        gap: 8px;
      }
      .rule-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 8px;
      }
      @media (min-height: 520px) {
        .rule-pick {
          position: sticky;
          top: 0;
          z-index: 1;
          padding-bottom: 12px;
          background: var(--mc-surface);
          border-bottom: 1px solid var(--mc-divider);
        }
      }
      .rule-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .rule-head h3 {
        margin: 0;
        flex: 1;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .rule-conds {
        display: grid;
        gap: 12px;
      }
      .design-tab > .rule {
        display: grid;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .dgroups {
        display: grid;
        gap: 12px;
      }
      .dgroup {
        display: grid;
        gap: 8px;
      }
      .dgroup-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 0 8px 0 4px;
        border: 0;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, transparent);
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--mc-text);
      }
      .dgroup-btn:hover {
        background: var(--mc-surface-2);
      }
      .dgroup-btn .nm {
        flex: 1;
        min-width: 0;
      }
      .dgroup-btn .chev {
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(-90deg);
      }
      .dgroup-body {
        display: grid;
        gap: 16px;
      }
      .dgroup-body[hidden] {
        display: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .dgroup-btn .chev {
          transition: none;
        }
      }
      .rule {
        background: color-mix(in srgb, var(--mc-surface-2) 40%, transparent);
      }
      .rule .cond {
        background: var(--mc-surface);
      }
      .rule .rule-name {
        flex: 1;
        min-width: 0;
        min-height: 32px;
        padding: 4px 8px;
      }
      .rule-body {
        display: grid;
        gap: 16px;
      }
      .rule-body .sub-head {
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .layout-seg > button {
        justify-content: center;
        min-width: 48px;
      }
      .layout-glyph {
        display: inline-grid;
        gap: 2px;
        width: 28px;
        height: 14px;
        flex: none;
      }
      .layout-glyph i {
        display: block;
        border-radius: 2px;
        background: currentColor;
        opacity: 0.45;
      }
      [aria-checked='true'] > .layout-glyph i {
        opacity: 1;
      }
      p.help {
        margin: 0;
      }
      .child-list-sync {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid var(--mc-divider);
      }
      .child-list-sync[data-overridden] {
        border-color: color-mix(in srgb, var(--warning-color, #ffa600) 40%, transparent);
        background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, transparent);
      }
      .mc-action-config {
        display: grid;
        gap: 16px;
        padding: 0;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-inspector': Inspector;
  }
}
