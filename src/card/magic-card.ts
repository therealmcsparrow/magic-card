import { LitElement, html, TemplateResult, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  ActionsConfig,
  MagicCardConfig,
  HomeAssistant,
  RowConfig,
  ColumnConfig,
  CardModule,
  DesignConfig,
  DisplayConfig,
  HassEntity,
} from '../types';
import { magicCardStyles } from '../css/css';
import { CARD_TAG, EDITOR_TAG, DEFAULT_LAYOUT, DEFAULT_GAP, NESTED_COLUMN_GAP, TAP_MOVE_TOLERANCE_PX } from '../utils/constants';
import {
  designToStyle,
  resolveConditionalDesign,
  resolveBorderLength,
  designUsesEntityColor,
  resolveShapeStroke,
  boxShadowToDropShadow,
  shapeElementStyle,
  insetPaddingStyle,
  hoverRule,
  splitDeclarations,
  HoverTarget,
  ShapeStroke,
  ResolvedBorderLength,
  } from '../utils/css-utils';
import { generateId } from '../utils/id-generator';
import { rowGridTemplate } from '../utils/column-widths';
import { resolveAnimations, type FxLayer, type ResolvedV2 } from '../utils/animation';
import { loadRuntime, runtimeIfLoaded } from '../utils/anim-runtime-loader';
import { loadParticles, particlesIfLoaded } from '../utils/particles-loader';
import { loadEditor } from '../utils/editor-loader';
import { animFlashes, renderAnimFx, renderBorderFx, renderRing, renderSeasonal, renderShape, renderValueBg, seasonalInsets, withShapeShadow } from './card-decorations';
import { SeasonalBudget, sceneFlashes } from '../utils/seasonal-scenes';
import { CardSeasonal } from './card-seasonal';
import { resolveValueBackground } from '../utils/value-background';
import { resolveShape, ResolvedShape } from './mc-shape';
import './mc-flows';
import { flowKeys, flowModuleEntities, resolveFlow, ResolvedFlow } from '../utils/flow';
import { playTapAnimations } from './tap-fx';
import { resolveRing } from '../utils/ring';
import { entityStateColor } from '../utils/entity-color';
import { mergeTemplateWithOverrides } from '../services/template-merge';
import { ConfigValidator } from '../services/config-validator';
import { ConditionsService } from '../services/conditions-service';
import { collectDependencies, CardDependencies } from '../services/card-dependencies';
import { hasJinja, TemplateController, templateResultToString } from '../services/template-controller';
import { SubscriptionController } from '../services/subscription-controller';
import { MediaResolver } from '../services/media-resolver';
import { mediaCssImage } from '../utils/media';
import { configGoogleFonts, loadGoogleFonts } from '../utils/google-fonts';
import { isRunnableAction } from '../utils/actions';
import { RenderContext, withRenderContext } from '../services/render-context';
import { renderModuleContent } from '../modules/render-module';
import { runServiceCall, toggleCall } from '../utils/entity-control';
import { childSlots, parseChildChain } from '../utils/module-path';
import { setLanguage } from '../localize/localize';
import { PopupController } from './popup-controller';
import { EditorPlace, navigateToPopup, popupCoordinator } from './popup-coordinator';
import { animationLibrary, inlineAnimations } from '../services/animation-library';
import type { AnimationDoc } from '../anim-studio/model';
import { adoptAnimationSheet, useAnimationCss } from './custom-anim-sheet';
import { reducedMotion, stopSequences, syncSequences, type SequencePlayer } from './sequence-player';

interface TemplateEntry {
  config: Omit<MagicCardConfig, 'type'> & { type?: string };
  description?: string;
}

type TemplateStore = Record<string, TemplateEntry>;

interface TemplateUpdatedEvent {
  data: {
    name: string;
    template: TemplateEntry;
  };
}

/**
 * A module with an id, and the same for every nested layout child (graph history and other per-module
 * state is keyed by id). A missing id is derived from the module's place, `${parentId}~${slot}.${index}`
 * for a child, so it is the same on every setConfig and every render. Copies only what it changes; the
 * caller's config is never mutated (and the card never writes ids back to the user's config).
 */
function withModuleIds(mod: CardModule, fallbackId: string): CardModule {
  if (!mod || typeof mod !== 'object') return mod;
  const id = mod.id || fallbackId;
  const out: CardModule = { ...mod, id };
  if (!childSlots(mod)) return out;
  const rec = out as Record<string, unknown>;
  const ids = (list: unknown, slot: number) =>
    Array.isArray(list) ? (list as CardModule[]).map((child, i) => withModuleIds(child, `${id}~${slot}.${i}`)) : list;
  if (mod.type === 'row' || mod.type === 'tabs') {
    const key = mod.type === 'row' ? 'columns' : 'tabs';
    if (Array.isArray(rec[key])) {
      rec[key] = (rec[key] as Array<Record<string, unknown>>).map((slot, si) =>
        slot && typeof slot === 'object' ? { ...slot, modules: ids(slot.modules, si) } : slot,
      );
    }
  } else if (Array.isArray(rec.modules)) {
    rec.modules = ids(rec.modules, 0);
  }
  return out;
}

/** Any of the tap / hold / double tap actions would run (an entity: the module's, for toggle / more-info). */
function hasRunnableActions(actions: ActionsConfig | undefined, entity?: string): boolean {
  return [actions?.tap_action, actions?.hold_action, actions?.double_tap_action].some((a) => isRunnableAction(a, entity));
}

/** What runs actions: a module, or a row (no entity of its own). */
type Actor = { actions?: ActionsConfig; entity?: string };

/**
 * Elements inside a row that handle a tap themselves: a tap there never also runs the row's action
 * (modules with actions claim their events; these are controls of modules without actions).
 */
const ROW_TAP_EXCLUDE =
  'input, select, textarea, button, a[href], [role="button"], [role="slider"], [role="switch"], [role="tab"], [role="checkbox"], [contenteditable=""], [contenteditable="true"], ha-slider, ha-switch, ha-camera-stream, mc-embedded-card, .mc-slider-pagination';

/** Content of a row that takes the keyboard itself: a row with actions around it is not focusable. */
const ROW_INTERACTIVE = `${ROW_TAP_EXCLUDE}, [tabindex]:not([tabindex="-1"])`;

/** Counter for RenderContext.instance. */
let cardInstances = 0;

/** A shaped card's border: ha-card's theme border, drawn along the shape. */
const CARD_STROKE: ShapeStroke = {
  width: 'var(--ha-card-border-width, 1px)',
  style: 'solid',
  color: 'var(--ha-card-border-color, var(--divider-color, #e0e0e0))',
};

/** What a shaped row / column / module adds: the shape layer, its stroke, style and shadow wrapper. */
interface ShapeParts {
  shape?: ResolvedShape;
  /** Border length overlay (unshaped elements only: a shape masks its own stroke). */
  border?: ResolvedBorderLength;
  stroke?: ShapeStroke;
  shadow?: string;
  style?: string;
  /** The seasonal decorations' band along the edge (px per side): the shape's content inset adds it. */
  edge?: number[];
}

/** `insets`: padding (px per side) the element keeps for its seasonal decorations. */
function shapeParts(design: DesignConfig | undefined, padding?: string, insets?: number[]): ShapeParts {
  const shape = resolveShape(design);
  if (!shape) return { border: resolveBorderLength(design), style: insets ? insetPaddingStyle(design, padding, { min: insets }) : undefined };
  return {
    shape,
    stroke: resolveShapeStroke(design),
    shadow: boxShadowToDropShadow(design?.box_shadow),
    style: shapeElementStyle(design, padding, insets),
    edge: insets,
  };
}

/** Rows, columns and modules (nested children included) with ids; missing ones derived from the position. */
function withConfigIds(config: MagicCardConfig): MagicCardConfig {
  return {
    ...config,
    rows: (config.rows || []).map((row, ri) => {
      const rowId = row.id || `row~${ri}`;
      return {
        ...row,
        id: rowId,
        columns: (row.columns || []).map((col, ci) => {
          const colId = col.id || `${rowId}~col${ci}`;
          return { ...col, id: colId, modules: (col.modules || []).map((mod, mi) => withModuleIds(mod, `${colId}~${mi}`)) };
        }),
      };
    }),
  };
}

@customElement(CARD_TAG)
export class MagicCard extends LitElement {
  static styles = magicCardStyles;

  @property({ attribute: false })
  hass?: HomeAssistant;

  /** Studio canvas mode: tags elements with editor paths, disables actions and template side effects. */
  @property({ attribute: false })
  editMode = false;

  /** Set by HA's hui-card: the card is shown as a preview (card editor, dashboard in edit mode). */
  @property({ attribute: false })
  preview = false;

  /**
   * Studio canvas: editor path of the selected module ("row.col.module/slot.index/..."), so a tabs or
   * slider layout shows the tab / slide holding a selected child.
   */
  @property({ attribute: false })
  selectedPath?: string;

  /** Studio canvas: key of the selected flow (highlighted by the flows overlay). */
  @property({ attribute: false })
  selectedFlow?: string | null;

  @state()
  private _config?: MagicCardConfig;

  @state()
  private _resolvedConfig?: MagicCardConfig;

  /** A shaped card without its own box_shadow: the theme's card shadow as a drop-shadow (read after render). */
  @state()
  private _themeShadow?: string;
  /** The last render was a shaped card without its own box_shadow. */
  private _readThemeShadow = false;

  private _unsubTemplateEvents?: () => void;
  /** The last render resolved a `custom:` animation (adopt the shared sheet, sync sequences). */
  private _customRendered = false;
  /** Re-render on library changes; only once a custom animation was looked up. */
  private _unsubLibrary?: () => void;
  /** Custom sequences of the shadow root, by element (src/card/sequence-player.ts). */
  private readonly _sequences = new Map<Element, SequencePlayer>();
  /** This render's elements (card, rows, columns, module wrappers) with v2 animation data, by `data-mc-v2` index. */
  private _v2Render: Array<{ entries: ResolvedV2[]; stateObj?: HassEntity; entityId?: string }> = [];
  /** Wrappers the v2 runtime was applied to (released when they leave). */
  private _v2Applied = new Set<HTMLElement>();
  /** This render resolved a document that needs the v2 runtime chunk. */
  private _v2Need = false;
  /** The runtime chunk is loading for this card. */
  private _v2Waiting = false;
  /** This render plays a particles v2 document (load the chunk, apply its layers). */
  private _pNeed = false;
  /** Particle layers the particles chunk was applied to (released when they leave). */
  private _pApplied = new Set<HTMLElement>();
  /**
   * `preset: custom:<id>` documents: the library (started lazily, here), then the card's inline
   * `custom_animations`. Cards without custom references never call this, so they cost nothing.
   */
  private readonly _customLookup = (id: string): AnimationDoc | undefined => {
    this._customRendered = true;
    animationLibrary.ensure(this.hass);
    if (!this._unsubLibrary && this.isConnected) this._unsubLibrary = animationLibrary.subscribe(this._onLibrary);
    return animationLibrary.get(id) ?? inlineAnimations(this._resolvedConfig ?? this._config)?.get(id);
  };
  /** A library change waits for its render (shouldUpdate must not drop it). */
  private _libDirty?: boolean;
  private readonly _onLibrary = (): void => {
    this._libDirty = true;
    this.requestUpdate();
  };
  private _templateFetched = false;
  /** Last fetched config of `_config.template`; re-merged with the local config on every setConfig. */
  private _templateConfig?: MagicCardConfig;
  private _boundRequestUpdate = () => this.requestUpdate();
  /** "On tap" animations of the elements under the pointer (src/card/tap-fx.ts). */
  private _onTapAnimations = (e: PointerEvent) => playTapAnimations(e, this);
  /** Pointer state per module wrapper (weak: a re-rendered wrapper takes its state with it). */
  private _holdTimers = new WeakMap<EventTarget, number>();
  /** Where a pointer went down on a module, to tell a tap / hold from a swipe or scroll. */
  private _downAt = new WeakMap<EventTarget, { x: number; y: number }>();
  /** Every pending hold / tap timer, cleared when the card is disconnected. */
  private _pendingTimers = new Set<number>();
  /**
   * Pointer / key events already taken by a module with actions: a layout module around it (which
   * may have actions of its own) ignores them, so a tap on a child never also runs the parent's
   * action. The event keeps bubbling (a slider still sees the swipe).
   */
  private _claimed = new WeakSet<Event>();
  /** First tap waiting for a possible second one (only when a double tap action is set). */
  private _tapTimers = new WeakMap<EventTarget, number>();
  private static readonly _DOUBLE_TAP_MS = 250;
  /** Jinja templates rendered by modules and template conditions (render_template subscriptions). */
  private readonly _templates = new TemplateController(
    () => this.requestUpdate(),
    () => this.hass?.connection,
  );
  /** Read-only websocket subscriptions modules render from (weather forecasts). */
  private readonly _subscriptions = new SubscriptionController(
    () => this.requestUpdate(),
    () => this.hass?.connection,
  );
  /** Browsed media (media-source ids) shown by the card, resolved and kept fresh. */
  private readonly _media = new MediaResolver(
    () => this.requestUpdate(),
    () => this.hass,
  );
  /** Editor paths of the modules being rendered (innermost last); children extend the top one. */
  private _pathStack: string[] = [];
  /** UI state of layout modules (active tab, slide), per card and keyed by the module's path. */
  private readonly _uiState = new Map<string, unknown>();
  private readonly _renderContext: RenderContext = {
    instance: `card-${++cardInstances}`,
    template: (template, variables) => this._templates.get(template, variables),
    subscribe: <T>(msg: Record<string, unknown>) => this._subscriptions.get<T>(msg),
    media: (id) => this._media.get(id),
    requestUpdate: () => this.requestUpdate(),
    renderChild: (child, index, slot = 0) => {
      const parent = this._pathStack[this._pathStack.length - 1];
      if (parent === undefined) return renderModuleContent(child, this.hass);
      return this._renderModule(child, `${parent}/${slot}.${index}`);
    },
    // a row module's column renders like a card column (design, conditions, valign, editor slot path)
    renderColumn: (col, slot) => {
      const parent = this._pathStack[this._pathStack.length - 1];
      return parent === undefined ? undefined : this._renderColumn(col as ColumnConfig, 0, slot, parent);
    },
    childHidden: (child) => !this.editMode && this._isHidden(child),
    uiState: <T>(key: string) => {
      const id = `${this._pathStack[this._pathStack.length - 1] ?? ''}#${key}`;
      return {
        get: () => this._uiState.get(id) as T | undefined,
        set: (value: T) => {
          this._uiState.set(id, value);
        },
      };
    },
    selectedChild: () => {
      const own = this._pathStack[this._pathStack.length - 1];
      const sel = this.selectedPath;
      if (!this.editMode || own === undefined || !sel) return undefined;
      // a selected tab / column of this module ("path#slot"), or a child below it
      if (sel.startsWith(`${own}#`)) return { slot: Number(sel.slice(own.length + 1)), index: -1 };
      if (!sel.startsWith(`${own}/`)) return undefined;
      return parseChildChain(sel.slice(own.length + 1).split('#')[0])?.[0];
    },
    editMode: false,
  };
  /** Scoped `:hover` rules of the last render, by data-mc-hover id (empty: no hover anywhere). */
  private _hoverRules = new Map<string, string>();
  /** The <style> holding the hover rules; only created once some element has a hover design. */
  private _hoverStyleEl?: HTMLStyleElement;
  /** Periodic refresh for clocks, time conditions, graph history. */
  private _tickTimer?: number;
  private _tickInterval?: number;
  private readonly _cardInstanceId: string = generateId('cardinst');
  private _registeredTemplate?: string;
  private _pendingRegisterTimer?: number;
  /** Pop-up mode (config `popup`): hidden on the dashboard, shown in a top-layer dialog. */
  private readonly _popup = new PopupController(this, {
    config: () => (this._resolvedConfig ?? this._config)?.popup,
    editorPlace: () => this._editorPlace(),
  });
  private static readonly _REGISTER_DEBOUNCE_MS = 1500;
  /** Seasonal particles of one render pass, over the card's scene and all its seasonal presets. */
  private readonly _seasonalBudget = new SeasonalBudget();
  /** The card's seasonal scene (config `seasonal`): resolution, midnight timer, editor preview date. */
  private readonly _seasonal = new CardSeasonal(this, {
    config: () => (this._resolvedConfig ?? this._config)?.seasonal,
    hass: () => this.hass,
    editorPreview: () => {
      const place = this._editorPlace();
      return place === 'canvas' || place === 'card-editor';
    },
    idle: () => this._popup.hidden && !this._popup.isOpen,
  });

  /** The editor is a lazy chunk; a rejection makes HA open its YAML editor instead. */
  static async getConfigElement(): Promise<HTMLElement> {
    if (!(await loadEditor())) throw new Error('Magic Card: the visual editor could not be loaded.');
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(): MagicCardConfig {
    return {
      type: `custom:${CARD_TAG}`,
      rows: [
        {
          id: generateId('row'),
          layout: '1',
          columns: [
            {
              id: generateId('col'),
              modules: [
                {
                  id: generateId('text'),
                  type: 'text',
                  text: 'Welcome to Magic Card',
                },
              ],
            },
          ],
        },
      ],
    };
  }

  setConfig(config: MagicCardConfig): void {
    if (!config) {
      throw new Error('No configuration provided');
    }

    const validation = ConfigValidator.validate(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join('; ')}`);
    }

    const prevTemplate = this._config?.template;

    // Every row / column / module (nested children included) gets a stable id
    this._config = withConfigIds({ ...config, rows: config.rows || [] });

    if (config.template !== prevTemplate) {
      this._templateFetched = false;
      this._templateConfig = undefined;
      this._resolvedConfig = undefined;
    }

    // Same template: re-merge the new local config (overrides may have changed) without refetching.
    if (this._templateConfig) {
      this._resolvedConfig = withConfigIds(mergeTemplateWithOverrides(this._templateConfig, this._config));
    }
  }

  getCardSize(): number {
    // a pop-up on a live dashboard takes no room (masonry places the next card right here)
    if (this._popup.hidden) return 0;
    if (!this._config?.rows) return 1;
    return Math.max(this._config.rows.length, 1);
  }

  /**
   * Sections view: HA merges these with the user's own `grid_options` (the user's win). Nothing for
   * a normal card (HA's defaults, as before); a live pop-up is one auto-height full-width cell that
   * the card then takes out of the flow (see PopupController).
   */
  getGridOptions(): Record<string, unknown> {
    return this._popup.hidden ? { columns: 'full', rows: 'auto', min_rows: 0 } : {};
  }

  /** Older HA (before getGridOptions). */
  getLayoutOptions(): Record<string, unknown> {
    return this._popup.hidden ? { grid_columns: 'full', grid_rows: 'auto', grid_min_rows: 0 } : {};
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mc-request-update', this._boundRequestUpdate);
    this.addEventListener('pointerdown', this._onTapAnimations);
    this._templates.hostConnected();
    this._subscriptions.hostConnected();
    this._media.hostConnected();
    if (this.hasUpdated) this._syncTicker();
    // re-attached (masonry rebuild, cached view): sequences were stopped and the library dropped;
    // the render restarts both
    if (this.hasUpdated && this._customRendered) this._onLibrary();
  }

  /** Everything the rendered output depends on besides the config (cached per config object). */
  private _dependencies(): CardDependencies {
    const config = this._resolvedConfig ?? this._config;
    return config ? collectDependencies(config, { editMode: this.editMode }) : { entities: [], forwardHass: false };
  }

  /** Re-render on a timer when a module or a time condition asks for it, aligned to the interval. */
  private _syncTicker(): void {
    // a closed pop-up has nothing on screen to refresh
    const idle = this._popup.hidden && !this._popup.isOpen;
    const interval = this.isConnected && !idle ? this._dependencies().refreshInterval : undefined;
    if (interval === this._tickInterval && (interval === undefined || this._tickTimer !== undefined)) return;
    if (this._tickTimer !== undefined) window.clearTimeout(this._tickTimer);
    this._tickTimer = undefined;
    this._tickInterval = interval;
    if (!interval) return;
    const schedule = () => {
      const delay = interval - (Date.now() % interval) + 20;
      this._tickTimer = window.setTimeout(() => {
        this.requestUpdate();
        schedule();
      }, delay);
    };
    schedule();
  }

  protected shouldUpdate(changedProperties: PropertyValues): boolean {
    // Module texts in the user's language from the first hass on (not only when it changes later).
    if (changedProperties.has('hass') && this.hass) setLanguage(this.hass.language);
    if (changedProperties.has('hass')) {
      this._popup.hassChanged(changedProperties.get('hass') as HomeAssistant | undefined, this.hass);
    }
    if (this._libDirty || changedProperties.has('_config') || changedProperties.has('_resolvedConfig')) {
      return true;
    }
    if (changedProperties.has('preview') || changedProperties.has('editMode')) return true;

    if (changedProperties.has('hass') && this.hass) {
      const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;
      if (!oldHass) return true;

      // Sync language when it changes
      if (oldHass.language !== this.hass.language) return true;

      // Things every module may read (theme, locale, entity registry icons/names).
      if (
        oldHass.themes !== this.hass.themes ||
        oldHass.locale !== this.hass.locale ||
        oldHass.entities !== this.hass.entities
      ) {
        return true;
      }

      // A closed pop-up renders nothing but its (empty) dialog: no entity re-renders.
      if (this._popup.hidden && !this._popup.isOpen) return false;

      // the seasonal scene's own entities (off switch, weather, sun): only when the scene changes
      if (this._seasonal.changed(oldHass)) return true;

      // Only re-render when an entity the card depends on changed (nested children included).
      const deps = this._dependencies();
      if (deps.entities.some((entityId) => oldHass.states[entityId] !== this.hass!.states[entityId])) {
        return true;
      }
      // Embedded HA cards track their own entities: hand them the new hass without re-rendering.
      if (deps.forwardHass) this._forwardHass();
      return false;
    }

    return true;
  }

  /** Embedded cards (custom-card module) get every hass update, like HA's own stacks do. */
  private _forwardHass(): void {
    const hass = this.hass;
    if (!hass) return;
    for (const el of this.renderRoot?.querySelectorAll<HTMLElement & { hass?: HomeAssistant }>('mc-embedded-card') ?? []) {
      el.hass = hass;
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    // the seasonal presets asked for another total: render again with the new share
    if (this._seasonalBudget.settle()) this.requestUpdate();
    this._syncHoverStyles();
    this._syncRowFocus();
    this._libDirty = false;
    if (this._customRendered) adoptAnimationSheet(this.renderRoot as ShadowRoot);
    if (this._customRendered || this._sequences.size) syncSequences(this.renderRoot, this._sequences);
    if (this._v2Need || this._v2Applied.size) this._syncRuntime();
    if (this._pNeed || this._pApplied.size) this._syncParticles();
    if (this._readThemeShadow) {
      // a shaped card's clip would cut off ha-card's box-shadow: the theme's, drawn as a drop-shadow
      const theme = boxShadowToDropShadow(getComputedStyle(this).getPropertyValue('--ha-card-box-shadow'));
      if (theme !== this._themeShadow) this._themeShadow = theme;
    }
    this._templates.end();
    this._subscriptions.end();
    this._media.end();
    this._syncTicker();

    if (this.editMode) return;

    this._reconcileInstanceRegistration();

    if (!this.hass || !this._config?.template) return;
    if (this._templateFetched) return;

    this._templateFetched = true;
    this._fetchTemplate(this._config.template);
    this._subscribeTemplateEvents();
  }

  private _isEditorPreview(): boolean {
    return !!this.closest('hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor');
  }

  /**
   * Where an editor shows this card: the studio canvas, HA's card editor preview, a dashboard in
   * edit mode (HA's hui-card sets preview and editMode); undefined on a live dashboard.
   */
  private _editorPlace(): EditorPlace | undefined {
    if (this.editMode && this.parentElement?.classList.contains('card-host')) return 'canvas';
    if (this._isEditorPreview()) return 'card-editor';
    if (this.preview || this.editMode) return 'dashboard-edit';
    return undefined;
  }

  private _cancelPendingRegister(): void {
    if (this._pendingRegisterTimer !== undefined) {
      window.clearTimeout(this._pendingRegisterTimer);
      this._pendingRegisterTimer = undefined;
    }
  }

  private _reconcileInstanceRegistration(): void {
    if (!this.hass || this.editMode) return;

    const connectedWithTemplate = this.isConnected && !!this._config?.template;
    const desired = connectedWithTemplate && !this._isEditorPreview()
      ? this._config!.template!
      : undefined;

    // Already in sync with no pending work — nothing to do.
    if (desired === this._registeredTemplate && this._pendingRegisterTimer === undefined) {
      return;
    }

    // Any change invalidates a pending register
    this._cancelPendingRegister();

    // Unregister immediately if we had a live registration that's no longer desired
    if (this._registeredTemplate && this._registeredTemplate !== desired) {
      const previous = this._registeredTemplate;
      this._registeredTemplate = undefined;
      this.hass
        .callWS({
          type: 'magic_card_utils/unregister_card_instance',
          name: previous,
          card_id: this._cardInstanceId,
        })
        .catch(() => {
          // Backend integration may not be installed — fail silently
        });
    }

    if (!desired || this._registeredTemplate === desired) return;

    // Debounce register so editor-preview flicker doesn't churn the backend.
    this._pendingRegisterTimer = window.setTimeout(() => {
      this._pendingRegisterTimer = undefined;
      if (!this.hass) return;
      if (!this.isConnected) return;
      if (this._isEditorPreview()) return;
      const current = this._config?.template || undefined;
      if (current !== desired) return;
      if (this._registeredTemplate === desired) return;

      this._registeredTemplate = desired;
      this.hass
        .callWS({
          type: 'magic_card_utils/register_card_instance',
          name: desired,
          card_id: this._cardInstanceId,
        })
        .catch(() => {
          // Backend integration may not be installed — fail silently
        });
    }, MagicCard._REGISTER_DEBOUNCE_MS);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mc-request-update', this._boundRequestUpdate);
    this.removeEventListener('pointerdown', this._onTapAnimations);
    this._templates.hostDisconnected();
    this._subscriptions.hostDisconnected();
    this._media.hostDisconnected();
    this._syncTicker();
    for (const timer of this._pendingTimers) window.clearTimeout(timer);
    this._pendingTimers.clear();
    this._holdTimers = new WeakMap();
    this._tapTimers = new WeakMap();
    this._downAt = new WeakMap();
    this._unsubTemplateEvents?.();
    this._unsubTemplateEvents = undefined;
    this._unsubLibrary?.();
    this._unsubLibrary = undefined;
    stopSequences(this._sequences);
    const rt = runtimeIfLoaded();
    for (const el of this._v2Applied) rt?.release(el);
    this._v2Applied = new Set();
    for (const el of this._pApplied) particlesIfLoaded()?.release(el);
    this._pApplied = new Set();
    this._cancelPendingRegister();
    this._reconcileInstanceRegistration();
  }

  private async _fetchTemplate(name: string): Promise<void> {
    if (!this.hass || !this._config) return;
    try {
      const result = await this.hass.callWS<{ templates: TemplateStore }>({
        type: 'magic_card_utils/get_templates',
      });
      const entry = result.templates?.[name];
      // Ignore a late response for a template this card is no longer linked to.
      if (entry && this._config?.template === name) {
        this._templateConfig = entry.config as MagicCardConfig;
        // Merge template with local overrides
        this._resolvedConfig = withConfigIds(mergeTemplateWithOverrides(this._templateConfig, this._config));
      }
    } catch (err) {
      console.warn('Magic Card: Failed to fetch template', name, err);
    }
  }


  private _subscribeTemplateEvents(): void {
    if (this._unsubTemplateEvents || !this.hass) return;

    this.hass.connection
      .subscribeEvents<TemplateUpdatedEvent>(
        (event) => {
          if (
            this._config?.template &&
            event.data.name === this._config.template
          ) {
            this._fetchTemplate(this._config.template);
          }
        },
        'magic_card_utils_template_updated',
      )
      .then((unsub) => {
        this._unsubTemplateEvents = unsub;
      });
  }

  protected render(): TemplateResult {
    this._customRendered = false;
    this._v2Render = [];
    this._v2Need = false;
    this._pNeed = false;
    this._templates.begin();
    this._subscriptions.begin();
    this._media.begin();
    this._renderContext.editMode = this.editMode;
    this._renderContext.preview = this.editMode || this.preview || this._isEditorPreview();
    this._pathStack = [];
    this._hoverRules = new Map();
    return withRenderContext(this._renderContext, () => this._renderCard());
  }

  private _renderCard(): TemplateResult {
    const config = this._resolvedConfig ?? this._config;
    if (!config) {
      return html`<ha-card><div class="mc-error">No configuration</div></ha-card>`;
    }
    // Google Fonts named in the config's designs / css: a stylesheet link each, once per page
    loadGoogleFonts(configGoogleFonts(config));
    const popup = this._popup.isPopup();
    this.toggleAttribute('data-mc-popup-hidden', this._popup.hidden);
    this.toggleAttribute('data-mc-popup-editor', popup && !this._popup.hidden);
    const titleId = `${this._renderContext.instance}-popup-title`;
    // a closed pop-up renders only its empty dialog: no rows, templates, subscriptions or timers
    if (this._popup.hidden && !this._popup.isOpen) return this._popup.renderDialog(nothing, '', titleId);

    if (!this.editMode && config.display?.conditions?.length && !this._evaluateDisplay(config.display)) {
      return this._popup.hidden ? this._popup.renderDialog(nothing, '', titleId) : html``;
    }

    const resolved = this._resolveCardAppearance(config);
    const cardStyle = this._buildCardStyle(resolved);
    // the card's own animations: motion / glow on ha-card, particle layers inside the content
    const anim = resolveAnimations({ animations: resolved.animations }, undefined, { allowIcon: false, states: this.hass?.states, custom: this._customLookup });
    const v2Index = this._v2(anim);
    const themeStyle = this._buildThemeStyle(resolved);
    // a shaped card: ha-card is clipped to the shape, its theme border drawn along it, the shadow on a wrapper
    const shape = resolveShape(resolved);
    // ha-card clips its edge (overflow: hidden): the card ring is drawn inside it
    const ring = resolveRing(resolved.ring, { states: this.hass?.states, clipped: true, shaped: !!shape });
    // the card's box_shadow, else the theme's card shadow (--ha-card-box-shadow, read in updated())
    const shadow = shape ? (resolved.box_shadow ? boxShadowToDropShadow(resolved.box_shadow) : this._themeShadow) : undefined;
    this._readThemeShadow = !!shape && !resolved.box_shadow;
    // ha-card takes the card's corner radius too, so its outline (borders, glows, rings) matches the content
    const haCardStyle = [themeStyle, resolved.border_radius && `border-radius: ${resolved.border_radius}`, anim?.style, shape && 'border-color: transparent; box-shadow: none']
      .filter(Boolean)
      .join('; ');
    // the seasonal scene: a layer behind (or over) the rows and border decorations, which the
    // content's padding keeps clear of (like a shape's inset)
    const seasonal = this._seasonal.resolve();
    const dark = !!this.hass?.themes?.darkMode;
    const seasonalOpts = { shape, seed: this._seasonal.seed(config), dark };
    const insets = seasonalInsets(anim, seasonal);
    const contentPad = resolved.padding || 'var(--mc-padding)';
    const inlineContentStyle = shape
      ? [cardStyle, shapeElementStyle(undefined, contentPad, insets)].filter(Boolean).join('; ')
      : [cardStyle, insets && insetPaddingStyle(undefined, contentPad, { min: insets })].filter(Boolean).join('; ');
    // flow lines: only a card with flows gets the overlay (and the content's stacking for it)
    const flows = this._resolveFlows(resolved);
    // a tank fill / sparkline behind the rows (the card needs its own entity)
    const valueBg = resolveValueBackground(resolved.value_background, { hass: this.hass });
    // the pop-up surface is not shaped: its ring keeps the rounded outline and the card's position
    const popupRing = shape ? resolveRing(resolved.ring, { states: this.hass?.states, clipped: true, shaped: false }) : ring;
    // the card's lightning (its scene or a card preset): nested layers skip theirs
    const flash = (!!seasonal && sceneFlashes(seasonal.scenes)) || animFlashes(anim);
    const rows = (animShape: ResolvedShape | undefined = shape) => {
      // each rendering of the content has the whole budget; the card's own scene takes its share first
      this._seasonalBudget.begin();
      const grant = seasonal ? this._seasonalBudget.own(seasonal.scenes, seasonal.intensity) : undefined;
      const opts = { ...seasonalOpts, grant };
      return html`${renderSeasonal(seasonal, 'back', { ...opts, shape: animShape })}${config.rows.map((row, ri) =>
        this._renderRow(row, ri),
      )}${renderAnimFx(anim, animShape, seasonalOpts.seed, dark, this._seasonalBudget)}${renderSeasonal(seasonal, 'front', opts)}${flows
        ? html`<mc-flows .flows=${flows} .selected=${this.editMode ? this.selectedFlow : undefined}
            ?dark=${dark}></mc-flows>`
        : nothing}`;
    };

    const inline = this._popup.hidden
      ? nothing
      : withShapeShadow(html`
          <ha-card style=${haCardStyle || nothing} data-mc-anim=${anim?.targets ?? nothing}
            data-mc-tap=${anim?.tap ? '' : nothing} data-mc-seq=${anim?.seq ?? nothing} data-mc-ring=${ring ? '' : nothing} data-mc-shape=${shape?.kind ?? nothing} data-mc-run=${anim?.run ?? nothing} data-mc-v2=${v2Index ?? nothing}>
            <div class="mc-card-content" style=${inlineContentStyle} data-mc-anim-fx=${anim?.fx.length ? '' : nothing}
              data-mc-hover=${this._hover('card', resolved.hover, shape ? { shape: { padding: resolved.padding || 'var(--mc-padding)', card: true } } : undefined)}
              data-mc-flows=${flows ? '' : nothing} data-mc-value-bg=${valueBg ? '' : nothing} data-mc-seasonal=${seasonal ? '' : nothing} data-mc-flash=${flash ? '' : nothing}>
              ${rows()}${renderValueBg(valueBg, this.hass)}
            </div>${renderShape(shape, shape ? CARD_STROKE : undefined, insets)}${renderRing(ring, shape)}
          </ha-card>
        `, shadow, !!shape);
    if (!popup) return inline as TemplateResult;

    // the pop-up surface: the card's background, shadow and theme on ha-card, padding etc. inside
    const parts = splitDeclarations(cardStyle);
    const prop = (p: string) => p.slice(0, p.indexOf(':')).trim().toLowerCase();
    const onSurface = (p: string) => /^(background(-[a-z-]+)?|box-shadow)$/.test(prop(p));
    const surfaceStyle = [themeStyle, anim?.style, ...parts.filter(onSurface)].filter(Boolean).join('; ');
    const contentStyle = [
      ...parts.filter((p) => !onSurface(p) && prop(p) !== 'border-radius'),
      insets && insetPaddingStyle(undefined, contentPad, { min: insets }),
    ].filter(Boolean).join('; ');
    const surface = this._popup.isOpen
      ? html`
          <ha-card class="mc-popup-surface" tabindex="-1" style=${surfaceStyle || nothing}
            data-mc-anim=${anim?.targets ?? nothing} data-mc-tap=${anim?.tap ? '' : nothing} data-mc-seq=${anim?.seq ?? nothing} data-mc-ring=${popupRing ? '' : nothing} data-mc-run=${anim?.run ?? nothing} data-mc-v2=${v2Index ?? nothing}>
            ${this._popup.renderHead(titleId)}
            <div class="mc-popup-body">
              <div class="mc-card-content" style=${contentStyle} data-mc-anim-fx=${anim?.fx.length ? '' : nothing}
                data-mc-hover=${this._hover('popup', resolved.hover)}
                data-mc-flows=${flows ? '' : nothing} data-mc-seasonal=${seasonal ? '' : nothing}
                data-mc-flash=${flash ? '' : nothing}>${rows(undefined)}</div>
            </div>${renderRing(popupRing)}
          </ha-card>
        `
      : nothing;
    const label = config.popup?.title?.trim() || config.name || 'Pop-up';
    const dialog = this._popup.renderDialog(surface, label, titleId, resolved.border_radius);
    if (this._popup.hidden) return dialog;
    // in an editor the card stays inline, marked as a pop-up
    const id = this._popup.popupId();
    return html`
      <div class="mc-popup-badge" aria-hidden="true">
        <ha-icon icon="mdi:dock-window"></ha-icon>Pop-up${id ? html` · #${id}` : nothing}
      </div>
      ${inline}${dialog}
    `;
  }

  /**
   * The card's flows resolved for the overlay (src/utils/flow.ts); undefined without flows. A
   * template label is rendered here (the card's render_template subscriptions); a Jinja one shows
   * nothing until it has a result (no raw Jinja on the line without a connection, e.g. the studio).
   */
  private _resolveFlows(c: MagicCardConfig): ResolvedFlow[] | undefined {
    if (!Array.isArray(c.flows) || !c.flows.length) return undefined;
    const entities = flowModuleEntities(this._resolvedConfig ?? this._config ?? c);
    // The overlay keys a flow by id (data-flow): unique when ids are missing / repeated (the editor uses the same keys).
    const keys = flowKeys(c.flows);
    const out = c.flows
      .map((f, i) => [f, i] as const)
      .filter(([f]) => f && typeof f === 'object')
      .map(([f, i]) => {
        const r = resolveFlow(f, this.hass, entities.get(f.from), i);
        r.id = keys[i];
        if (r.labelTemplate) {
          const label = hasJinja(r.labelTemplate)
            ? this._templates.get(r.labelTemplate).status === 'ok'
              ? this._templateText(r.labelTemplate)
              : ''
            : r.labelTemplate;
          if (label) r.label = label;
        }
        return r;
      });
    return out.length ? out : undefined;
  }

  /** A template's current text: the raw text without Jinja or without a connection; '' while pending / on error. */
  private _templateText(template: string): string {
    if (!hasJinja(template)) return template;
    const state = this._templates.get(template);
    if (state.status === 'ok') return templateResultToString(state.result);
    return state.status === 'unavailable' ? template : '';
  }

  private _resolveCardAppearance(c: MagicCardConfig): MagicCardConfig {
    const rules = c.conditional_appearance;
    if (!rules?.length) return c;

    let merged: MagicCardConfig = c;
    for (const rule of rules) {
      // like design rules: a rule without (complete) conditions changes nothing
      if (!rule || !ConditionsService.ruleMatches(rule, this.hass)) continue;

      const overrides = rule.overrides || {};
      const patch: Partial<MagicCardConfig> = {};
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === '' || value === null) continue;
        (patch as Record<string, unknown>)[key] = value;
      }
      merged = { ...merged, ...patch };
    }
    return merged;
  }

  private _buildThemeStyle(c: MagicCardConfig): string {
    if (!this.hass) return '';
    if (c.use_page_theme !== false) return '';

    const selectedTheme = c.theme || this.hass.themes?.default_theme;
    if (!selectedTheme) return '';

    const vars = this.hass.themes?.themes?.[selectedTheme];
    if (!vars) return '';

    return Object.entries(vars)
      .map(([key, value]) => `${key.startsWith('--') ? key : `--${key}`}: ${String(value)}`)
      .join('; ');
  }

  private _buildCardStyle(c: MagicCardConfig): string {
    const parts: string[] = [];
    if (c.padding) parts.push(`padding: ${c.padding}`);

    const backgroundParts = [];
    // browsed media is a media-source id, resolved here (left out until it resolves)
    const backgroundImage = c.background_image ? mediaCssImage(this.hass, c.background_image) : '';
    if (backgroundImage) backgroundParts.push(backgroundImage);
    if (c.background) backgroundParts.push(c.background);

    if (backgroundParts.length > 0) {
      parts.push(`background: ${backgroundParts.join(' ')}`);
    }

    if (backgroundImage) {
      parts.push(`background-size: cover`);
      parts.push(`background-position: center`);
      parts.push(`background-repeat: no-repeat`);
    }

    if (c.border_radius) parts.push(`border-radius: ${c.border_radius}`);
    if (c.box_shadow) parts.push(`box-shadow: ${c.box_shadow}`);
    if (c.card_height) parts.push(`min-height: ${c.card_height}`);
    if (c.overflow) parts.push(`overflow: ${c.overflow}`);
    // custom CSS last, so it wins over the fields above (like a design's css)
    const css = typeof c.css === 'string' ? c.css.trim().replace(/[;\s]+$/, '') : '';
    if (css) parts.push(css);
    return parts.join('; ');
  }

  /** Hidden on the dashboard: `hidden: true` (the studio's Hide) or its display conditions. */
  private _isHidden({ hidden, display }: { hidden?: unknown; display?: DisplayConfig }): boolean {
    return !!hidden || (!!display?.conditions?.length && !this._evaluateDisplay(display));
  }

  private _renderRow(row: RowConfig, ri: number): TemplateResult {
    const hidden = this._isHidden(row);
    if (hidden && !this.editMode) {
      return html``;
    }

    const gridTemplate = rowGridTemplate(row, DEFAULT_LAYOUT);
    const gap = row.gap || DEFAULT_GAP;
    const rowStyle = `grid-template-columns: ${gridTemplate}; gap: ${gap}${row.padding ? `; padding: ${row.padding}` : ''}`;
    const design = resolveConditionalDesign(row.design, this.hass);
    const designStyle = designToStyle(design);
    const anim = resolveAnimations(design, undefined, { allowIcon: false, states: this.hass?.states, custom: this._customLookup });
    const { shape, border, stroke, shadow, style: shapeStyle, edge } = shapeParts(design, row.padding, seasonalInsets(anim));
    // a shaped row clips its edge: the ring is drawn inside
    const ring = resolveRing(design?.ring, { states: this.hass?.states, clipped: !!shape, shaped: !!shape });
    const valueBg = resolveValueBackground(design?.value_background, { hass: this.hass });
    // row actions (not on the studio canvas) run on taps outside its modules' own actions and
    // controls. No role: a button role would hide the row's content from assistive tech. Focusable
    // (Enter / Space) only without interactive content of its own (set in updated()).
    const actor: Actor = { actions: row.actions };
    const hasActions = !this.editMode && hasRunnableActions(row.actions);
    const own = (e: Event) => !this._isRowControlEvent(e);

    return withShapeShadow(html`
      <div
        class="mc-row"
        data-mc-row-actions=${hasActions ? '' : nothing}
        @pointerdown=${hasActions ? (e: PointerEvent) => own(e) && this._onPointerDown(e, actor) : nothing}
        @pointerup=${hasActions ? (e: PointerEvent) => own(e) && this._onPointerUp(e, actor) : nothing}
        @pointermove=${hasActions ? (e: PointerEvent) => this._onPointerMove(e) : nothing}
        @pointercancel=${hasActions ? (e: PointerEvent) => this._onPointerCancel(e) : nothing}
        @pointerleave=${hasActions ? (e: PointerEvent) => this._onPointerCancel(e) : nothing}
        @keydown=${hasActions ? (e: KeyboardEvent) => e.composedPath()[0] === e.currentTarget && this._onKeyDown(e, actor) : nothing}
        data-mc-row=${this.editMode ? ri : nothing}
        data-mc-hover=${this._hover(`row-${ri}`, design?.hover, { shape: shape && { design, padding: row.padding }, borderLength: border })}
        data-mc-hidden=${this.editMode && hidden ? '' : nothing}
        data-mc-anim=${anim?.targets ?? nothing}
        data-mc-tap=${anim?.tap ? '' : nothing} data-mc-seq=${anim?.seq ?? nothing} data-mc-run=${anim?.run ?? nothing} data-mc-v2=${this._v2(anim) ?? nothing}
        data-mc-anim-fx=${anim?.fx.length ? '' : nothing}
        data-mc-flash=${animFlashes(anim) ? '' : nothing}
        data-mc-border-fx=${border ? '' : nothing}
        data-mc-ring=${ring ? '' : nothing}
        data-mc-shape=${shape?.kind ?? nothing}
        data-mc-value-bg=${valueBg ? '' : nothing}
        style="${rowStyle}; ${designStyle}${[anim?.style, border?.style, shapeStyle].filter(Boolean).map((x) => `; ${x}`).join('')}"
      >
        ${row.columns.map((col, ci) => this._renderColumn(col, ri, ci))}${renderValueBg(valueBg, this.hass)}${renderAnimFx(anim, shape, row.id, this._dark, this._seasonalBudget)}${renderBorderFx(border)}${renderShape(shape, stroke, edge)}${renderRing(ring, shape)}
      </div>
    `, shadow);
  }

  /** A card column, or (`nested`: the row module's path) a row module's column. */
  private _renderColumn(col: ColumnConfig, ri: number, ci: number, nested?: string): TemplateResult {
    const hidden = this._isHidden(col);
    if (hidden && !this.editMode) {
      return html``;
    }

    const gap = col.gap || (nested === undefined ? DEFAULT_GAP : NESTED_COLUMN_GAP);
    const colStyle = `gap: ${gap}${col.padding ? `; padding: ${col.padding}` : ''}`;
    const design = resolveConditionalDesign(col.design, this.hass);
    const designStyle = designToStyle(design);
    const anim = resolveAnimations(design, undefined, { allowIcon: false, states: this.hass?.states, custom: this._customLookup });
    const { shape, border, stroke, shadow, style: shapeStyle, edge } = shapeParts(design, col.padding, seasonalInsets(anim));
    const ring = resolveRing(design?.ring, { states: this.hass?.states, clipped: !!shape, shaped: !!shape });
    const valueBg = resolveValueBackground(design?.value_background, { hass: this.hass });
    const key = nested === undefined ? `${ri}.${ci}` : `${nested}#${ci}`;

    return withShapeShadow(html`
      <div
        class="mc-column"
        data-valign=${col.vertical_align || nothing}
        data-mc-col=${this.editMode && nested === undefined ? key : nothing}
        data-mc-slot=${this.editMode && nested !== undefined ? key : nothing}
        data-mc-hover=${this._hover(`col-${key}`, design?.hover, { shape: shape && { design, padding: col.padding }, borderLength: border })}
        data-mc-empty=${this.editMode && !col.modules?.length ? '' : nothing}
        data-mc-hidden=${this.editMode && hidden ? '' : nothing}
        data-mc-anim=${anim?.targets ?? nothing}
        data-mc-tap=${anim?.tap ? '' : nothing} data-mc-seq=${anim?.seq ?? nothing} data-mc-run=${anim?.run ?? nothing} data-mc-v2=${this._v2(anim) ?? nothing}
        data-mc-anim-fx=${anim?.fx.length ? '' : nothing}
        data-mc-flash=${animFlashes(anim) ? '' : nothing}
        data-mc-border-fx=${border ? '' : nothing}
        data-mc-ring=${ring ? '' : nothing}
        data-mc-shape=${shape?.kind ?? nothing}
        data-mc-value-bg=${valueBg ? '' : nothing}
        style="${colStyle}; ${designStyle}${[anim?.style, border?.style, shapeStyle].filter(Boolean).map((x) => `; ${x}`).join('')}"
      >
        ${(col.modules || []).map((mod, mi) => this._renderModule(mod, nested === undefined ? `${key}.${mi}` : `${nested}/${ci}.${mi}`))}${renderValueBg(valueBg, this.hass)}${renderAnimFx(anim, shape, col.id ?? key, this._dark, this._seasonalBudget)}${renderBorderFx(border)}${renderShape(shape, stroke, edge)}${renderRing(ring, shape)}
      </div>
    `, shadow);
  }

  /**
   * One module with its wrapper: design, animations, border length, entity colour, actions, display
   * conditions and (studio canvas) its editor path. Layout children come through here as well, with
   * the path "row.col.module/slot.index/..." (see RenderContext.renderChild).
   */
  private _renderModule(mod: CardModule, path: string): TemplateResult {
    const hidden = this._isHidden(mod);
    if (hidden && !this.editMode) {
      return html``;
    }

    const design = resolveConditionalDesign(mod.design as DesignConfig, this.hass, mod.entity);
    const stateObj = mod.entity ? this.hass?.states[mod.entity] : undefined;
    const anim = resolveAnimations(design, stateObj, { states: this.hass?.states, custom: this._customLookup });
    const v2Index = this._v2(anim, stateObj, mod.entity);
    const { shape, border, stroke, shadow, style: shapeStyle, edge } = shapeParts(design, undefined, seasonalInsets(anim));
    const ring = resolveRing(design?.ring, { states: this.hass?.states, defaultEntity: mod.entity, clipped: !!shape, shaped: !!shape });
    const valueBg = resolveValueBackground(design?.value_background, { hass: this.hass, entity: mod.entity });
    // `entity` design colours read this var (currentColor when unset); only set when one is used
    const entityColor = stateObj && designUsesEntityColor(design) ? entityStateColor(stateObj) : undefined;
    const designStyle = [designToStyle(design), anim?.style, border?.style, shapeStyle, entityColor && `--mc-entity-color: ${entityColor}`]
      .filter(Boolean)
      .join('; ');
    // only the configured actions: a module without them stays inert (and never claims its layout's tap)
    const actions = mod.actions;
    const acting = mod;
    const hasActions = !this.editMode && hasRunnableActions(actions, mod.entity);
    this._pathStack.push(path);
    // v2: the runtime's icon rig hint reaches the module's main icon through the render context
    const ctx = this._renderContext;
    const outerRig = ctx.iconRig;
    // the last entry with a rig: a custom clip's own document follows the one it replaces (drawn at rest)
    ctx.iconRig = anim?.v2?.filter((x) => x.hints.rig !== undefined).pop()?.hints.rig;
    let content: TemplateResult;
    try {
      content = renderModuleContent(mod, this.hass);
    } finally {
      this._pathStack.pop();
      ctx.iconRig = outerRig;
    }

    return withShapeShadow(html`
      <div
        class="mc-module-wrapper ${hasActions ? 'mc-hoverable' : ''}"
        role=${hasActions ? 'button' : nothing}
        tabindex=${hasActions ? 0 : nothing}
        aria-label=${hasActions ? this._getActionLabel(acting) : nothing}
        data-mc-path=${this.editMode ? path : nothing}
        data-mc-hover=${this._hover(`mod-${path}`, design?.hover, { shape: shape && { design }, borderLength: border })}
        data-mc-id=${mod.id || nothing}
        data-mc-hidden=${this.editMode && hidden ? '' : nothing}
        data-mc-anim=${anim?.targets ?? nothing}
        data-mc-tap=${anim?.tap ? '' : nothing} data-mc-seq=${anim?.seq ?? nothing}
        data-mc-run=${anim?.run ?? nothing} data-mc-v2=${v2Index ?? nothing}
        data-mc-anim-fx=${anim?.fx.length ? '' : nothing}
        data-mc-flash=${animFlashes(anim) ? '' : nothing}
        data-mc-border-fx=${border ? '' : nothing}
        data-mc-ring=${ring ? '' : nothing}
        data-mc-shape=${shape?.kind ?? nothing}
        data-mc-value-bg=${valueBg ? '' : nothing}
        style=${designStyle}
        @pointerdown=${hasActions ? (e: PointerEvent) => this._onPointerDown(e, acting) : nothing}
        @pointerup=${hasActions ? (e: PointerEvent) => this._onPointerUp(e, acting) : nothing}
        @pointermove=${hasActions ? (e: PointerEvent) => this._onPointerMove(e) : nothing}
        @pointercancel=${hasActions ? (e: PointerEvent) => this._onPointerCancel(e) : nothing}
        @pointerleave=${hasActions ? (e: PointerEvent) => this._onPointerCancel(e) : nothing}
        @contextmenu=${hasActions ? (e: Event) => e.preventDefault() : nothing}
        @keydown=${hasActions ? (e: KeyboardEvent) => this._onKeyDown(e, acting) : nothing}
      >
        ${content}${renderValueBg(valueBg, this.hass)}${renderAnimFx(anim, shape, mod.id, this._dark, this._seasonalBudget)}${renderBorderFx(border)}${renderShape(shape, stroke, edge)}${renderRing(ring, shape)}
      </div>
    `, shadow);
  }

  /**
   * A card / row / column / module's v2 data for _syncRuntime: its `data-mc-v2` index (undefined
   * without any). Rows, columns and the card have no entity: their documents follow an entry's own.
   */
  private _v2(anim: ReturnType<typeof resolveAnimations>, stateObj?: HassEntity, entityId?: string): number | undefined {
    if (anim?.needsRuntime) this._v2Need = true;
    if (anim?.needsParticles) this._pNeed = true;
    return anim?.v2 ? this._v2Render.push({ entries: anim.v2, stateObj, entityId }) - 1 : undefined;
  }

  /**
   * v2 animation data (rigs, tracks, clips, bindings) after a render: load the runtime chunk the
   * first time (render again when it arrives; until then, or when it fails, the base animation
   * plays), then apply each document to its element (card, row, column or module wrapper) and release
   * the elements that are gone.
   */
  private _syncRuntime(): void {
    const jobs = this._v2Render;
    const rt = runtimeIfLoaded();
    if (!rt) {
      if (this._v2Need && !this._v2Waiting) {
        this._v2Waiting = true;
        void loadRuntime().then((loaded) => {
          this._v2Waiting = false;
          if (loaded && this.isConnected) this.requestUpdate();
        });
      }
      return;
    }
    const root = this.renderRoot as ShadowRoot;
    const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lookup = (id: string): AnimationDoc | undefined => animationLibrary.get(id) ?? inlineAnimations(this._resolvedConfig ?? this._config)?.get(id);
    const seen = new Set<HTMLElement>();
    for (const el of root.querySelectorAll<HTMLElement>('[data-mc-v2]')) {
      const job = jobs[Number(el.dataset.mcV2)];
      if (!job) continue;
      seen.add(el);
      for (const e of job.entries) {
        // the entry's own entity (`entity:`) wins; else the module's
        const own = e.entityId !== undefined;
        rt.apply(el, e.v2, {
          hass: this.hass,
          stateObj: own ? e.stateObj : job.stateObj,
          entityId: own ? e.entityId : job.entityId,
          reducedMotion,
          shadowRoot: root,
          run: e.run,
          timing: e.timing,
          icon: e.icon,
          lookup,
        });
      }
      rt.commit(el, job.entries.map((e) => e.run));
    }
    // wrappers that had v2 documents: still on the page without any now, or gone
    for (const el of this._v2Applied) {
      if (seen.has(el)) continue;
      if (el.isConnected && this.renderRoot.contains(el)) rt.commit(el, []);
      else rt.release(el);
    }
    this._v2Applied = seen;
  }

  /**
   * particles v2 after a render: load the chunk the first time (render again when it arrives; the v1
   * fallback plays meanwhile or when it fails), then apply each v2 layer (re-bake for its size, live
   * engine, reduced motion still frame) and release the layers that are gone.
   */
  private _syncParticles(): void {
    const pm = particlesIfLoaded();
    if (!pm) {
      void loadParticles().then((m) => m && this.isConnected && this.requestUpdate());
      return;
    }
    const reduced = reducedMotion();
    const seen = new Set<HTMLElement>();
    for (const el of this.renderRoot.querySelectorAll<HTMLElement & { mcSim: NonNullable<FxLayer['sim']> }>('.mc-anim-fx[data-p]')) {
      const sim = el.mcSim;
      const w = el.parentElement!;
      seen.add(el);
      pm.apply(el, {
        ...sim,
        reducedMotion: reduced,
        // a geometry variant replaces the same doc's older bake for that geometry (sheet key without the spec hash);
        // content collider: `icon` = this module's own icon hook (not a nested module's; rows, columns
        // and the card have none: off), `text` = the first child that is not a decoration (all aria-hidden)
        useCss: (name, css) => useAnimationCss(name.startsWith('mcc-') ? sim.docId + name.slice(name.lastIndexOf('-g')) : name, name, css),
        content: () =>
          sim.spec.sim.colliders.content === 'icon'
            ? [...w.querySelectorAll('.mc-anim-icon')].find((e) => e.closest('.mc-module-wrapper') === w)
            : (w.querySelector(':scope>:not([aria-hidden])') ?? undefined),
      });
    }
    for (const el of this._pApplied) if (!seen.has(el)) pm.release(el);
    this._pApplied = seen;
  }

  /** The theme is dark (seasonal decorations soften their frost). */
  private get _dark(): boolean {
    return !!this.hass?.themes?.darkMode;
  }

  /**
   * The data-mc-hover id of an element with a hover design (its rule kept for the hover <style>);
   * nothing without one, so an element without hover gets no attribute and no rule.
   */
  private _hover(id: string, hover: Partial<DesignConfig> | undefined, target?: HoverTarget): string | typeof nothing {
    if (!hover) return nothing;
    const rule = hoverRule(id, hover, target);
    if (!rule) return nothing;
    this._hoverRules.set(id, rule);
    return id;
  }

  /**
   * Writes the hover rules into a <style> at the start of the shadow root (before Lit's content, so
   * renders never touch it). Reduced motion: hover elements change without transitions.
   */
  private _syncHoverStyles(): void {
    const root = this.renderRoot as ShadowRoot | undefined;
    if (!root) return;
    const css = this._hoverRules.size
      ? [...this._hoverRules.values(), '@media (prefers-reduced-motion: reduce) { [data-mc-hover] { transition: none !important; } }'].join(' ')
      : '';
    let el = this._hoverStyleEl;
    if (!css) {
      if (el && el.textContent) el.textContent = '';
      return;
    }
    if (!el || el.getRootNode() !== root) {
      el = document.createElement('style');
      el.setAttribute('data-mc-hover-styles', '');
      root.prepend(el);
      this._hoverStyleEl = el;
    }
    if (el.textContent !== css) el.textContent = css;
  }

  /**
   * A row with actions is focusable (tabindex 0, Enter / Space run them) only when nothing inside it
   * is interactive: a module with actions or a control keeps the keyboard focus to itself.
   */
  private _syncRowFocus(): void {
    for (const row of this.renderRoot.querySelectorAll<HTMLElement>('.mc-row')) {
      const focusable = row.hasAttribute('data-mc-row-actions') && !row.querySelector(ROW_INTERACTIVE);
      if (focusable && row.getAttribute('tabindex') !== '0') row.setAttribute('tabindex', '0');
      else if (!focusable && row.hasAttribute('tabindex')) row.removeAttribute('tabindex');
    }
  }

  /** A row event that started on a control inside the row (an input, a button, an embedded card, ...). */
  private _isRowControlEvent(e: Event): boolean {
    const row = e.currentTarget as Element;
    for (const node of e.composedPath()) {
      if (node === row) return false;
      if (node instanceof Element && node.matches(ROW_TAP_EXCLUDE)) return true;
    }
    return false;
  }

  private _getActionLabel(mod: CardModule): string {
    const customLabel = (mod.label as string | undefined) || (mod.name as string | undefined);
    return customLabel ? `Activate ${customLabel}` : `Activate ${mod.type} module`;
  }

  private _onPointerDown(e: PointerEvent, mod: Actor): void {
    if (this._claimed.has(e)) return;
    this._claimed.add(e);
    const target = e.currentTarget as EventTarget;
    this._downAt.set(target, { x: e.clientX, y: e.clientY });
    const timer = this._timer(() => {
      this._holdTimers.delete(target);
      this._handleAction(e, mod, 'hold');
    }, 500);
    this._holdTimers.set(target, timer);
  }

  /** Moving further than a small tolerance is a swipe or scroll: no tap, no hold. */
  private _onPointerMove(e: PointerEvent): void {
    const target = e.currentTarget as EventTarget;
    const down = this._downAt.get(target);
    if (!down || !this._holdTimers.has(target)) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_MOVE_TOLERANCE_PX) {
      this._onPointerCancel(e);
    }
  }

  private _onPointerUp(e: PointerEvent, mod: Actor): void {
    if (this._claimed.has(e)) return;
    this._claimed.add(e);
    const target = e.currentTarget as EventTarget;
    const down = this._downAt.get(target);
    this._downAt.delete(target);
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_MOVE_TOLERANCE_PX) {
      this._onPointerCancel(e);
      return;
    }
    const timer = this._holdTimers.get(target);
    if (timer !== undefined) {
      this._clearTimer(timer);
      this._holdTimers.delete(target);
      this._onTap(e, mod, target);
    }
  }

  /**
   * A tap runs the tap action right away, unless a double tap action is set: then it waits for the
   * double-tap window and a second tap inside it runs only the double tap action.
   */
  private _onTap(e: Event, mod: Actor, target: EventTarget): void {
    const double = mod.actions?.double_tap_action;
    if (!double || double.action === 'none') {
      this._handleAction(e, mod, 'tap');
      return;
    }
    const pending = this._tapTimers.get(target);
    if (pending !== undefined) {
      this._clearTimer(pending);
      this._tapTimers.delete(target);
      this._handleAction(e, mod, 'double_tap');
      return;
    }
    this._tapTimers.set(
      target,
      this._timer(() => {
        this._tapTimers.delete(target);
        this._handleAction(e, mod, 'tap');
      }, MagicCard._DOUBLE_TAP_MS),
    );
  }

  private _timer(fn: () => void, ms: number): number {
    const id = window.setTimeout(() => {
      this._pendingTimers.delete(id);
      fn();
    }, ms);
    this._pendingTimers.add(id);
    return id;
  }

  private _clearTimer(id: number): void {
    window.clearTimeout(id);
    this._pendingTimers.delete(id);
  }

  private _onPointerCancel(e: PointerEvent): void {
    const target = e.currentTarget as EventTarget;
    const timer = this._holdTimers.get(target);
    if (timer !== undefined) {
      this._clearTimer(timer);
      this._holdTimers.delete(target);
    }
    this._downAt.delete(target);
  }

  private _onKeyDown(e: KeyboardEvent, mod: Actor): void {
    if (this._claimed.has(e)) return;
    if (e.key === 'Enter' || e.key === ' ') {
      this._claimed.add(e);
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        this._handleAction(e, mod, 'double_tap');
        return;
      }
      if (e.shiftKey) {
        this._handleAction(e, mod, 'hold');
        return;
      }
      this._handleAction(e, mod, 'tap');
    }
  }

  private _evaluateDisplay(display: DisplayConfig): boolean {
    return ConditionsService.evaluate(display, this.hass);
  }

  private _handleAction(e: Event, mod: Actor, actionType: 'tap' | 'hold' | 'double_tap'): void {
    const actionKey = `${actionType}_action` as const;
    const action = mod.actions?.[actionKey];
    if (!action || action.action === 'none') return;

    // Haptic feedback
    if (action.haptic) {
      this.dispatchEvent(
        new CustomEvent('haptic', {
          bubbles: true,
          composed: true,
          detail: action.haptic,
        }),
      );
    }

    const entity = action.use_module_entity !== false ? (action.entity || mod.entity) : action.entity;

    switch (action.action) {
      case 'more-info':
        if (entity) {
          this.dispatchEvent(
            new CustomEvent('hass-more-info', {
              bubbles: true,
              composed: true,
              detail: { entityId: entity },
            }),
          );
        }
        break;

      case 'toggle':
        // like HA's toggleEntity: groups via homeassistant, locks / covers / valves open and close, ...
        if (entity && this.hass) runServiceCall(this.hass, toggleCall(this.hass, entity));
        break;

      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          window.dispatchEvent(
            new Event('location-changed', { bubbles: true, composed: true }),
          );
        }
        break;

      case 'url':
        if (action.url_path) {
          try {
            const url = new URL(action.url_path, window.location.href);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
              window.open(url.href, '_blank', 'noopener,noreferrer');
            } else {
              console.warn('Magic Card: Blocked unsafe URL protocol:', url.protocol);
            }
          } catch {
            console.warn('Magic Card: Invalid URL:', action.url_path);
          }
        }
        break;

      case 'perform-action':
        if (action.service) {
          const [domain, service] = action.service.split('.');
          this.hass?.callService(domain, service, {
            ...action.data,
            ...action.service_data,
          });
        }
        break;

      case 'assist':
        this.dispatchEvent(
          new CustomEvent('show-dialog', {
            bubbles: true,
            composed: true,
            detail: {
              dialogTag: 'ha-voice-command-dialog',
              dialogImport: () => undefined,
              dialogParams: {},
            },
          }),
        );
        break;

      case 'popup':
        // through the URL like HA's navigate to "#id": any Magic Card with that pop-up ID opens
        navigateToPopup(action.hash);
        break;

      case 'close-popup':
        popupCoordinator.closeOpen();
        break;

      case 'fire-dom-event':
        this.dispatchEvent(
          new CustomEvent('ll-custom', {
            bubbles: true,
            composed: true,
            detail: action.data || {},
          }),
        );
        break;
    }
  }
}
