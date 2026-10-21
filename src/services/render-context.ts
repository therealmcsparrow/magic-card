import type { TemplateResult } from 'lit';
import type { TemplateState } from './template-controller';
import type { SubscriptionState } from './subscription-controller';
import type { CardModule, NestedColumnConfig } from '../types';
import type { ResolvedLayer } from '../contracts/layer-placement';
import type { LazyChunkName, OnDemandChunkName } from '../contracts/lazy-module';

/**
 * What a module may ask of the card that is rendering it. Set by the card for the duration of its
 * (synchronous) render, so modules and nested layout children reach it without extra parameters.
 * Outside a card render (editor thumbnails, tests) there is no context and modules fall back to
 * their static output.
 */
export interface RenderContext {
  /** Live result of a Jinja template (render_template subscription owned by the card). */
  template(template: string, variables?: Record<string, unknown>): TemplateState;
  /**
   * Latest message of a read-only websocket subscription (e.g. weather/subscribe_forecast) owned by
   * the card: subscribed while some module renders it, unsubscribed when none does or on disconnect.
   */
  subscribe?<T>(msg: Record<string, unknown>): SubscriptionState<T>;
  /**
   * URL of a browsed media item (`media-source://` id), resolved by the card and kept fresh;
   * undefined while it resolves or when it cannot be resolved.
   */
  media?(id: string): string | undefined;
  /** Ask the card to render again (e.g. asynchronous data arrived). */
  requestUpdate(): void;
  /** A render met a feature whose chunk is not ready (the needs() predicate missed it): the card shows that chunk's failure notice if it fails. */
  metChunk?(name: LazyChunkName | OnDemandChunkName): void;
  /**
   * Render a layout module's child through the card's module pipeline (design, animations, actions,
   * display conditions, validation errors, editor paths). `slot` is the column / tab (0 for flat lists).
   * `layer`: the child sits behind the others or on top (layer-placement 1.0.0), see arrange().
   */
  renderChild?(child: CardModule, index: number, slot?: number, layer?: ResolvedLayer): TemplateResult;
  /** Render a row module's column like a card column (with its children), `slot` its index. */
  renderColumn?(col: NestedColumnConfig, slot: number): TemplateResult | undefined;
  /**
   * The child is hidden by its display conditions on the live dashboard (it renders nothing). Always
   * false in the studio canvas, which shows hidden modules dimmed.
   */
  childHidden?(child: CardModule): boolean;
  /** The child has actions that would run (its effective entity); the default click-through of an overlay follows it. */
  childHasActions?(child: CardModule): boolean;
  /**
   * A row module is being rendered (layer-placement fill: row): whether its grid is layered, and the
   * backgrounds its columns handed up, to render inside the grid after the columns.
   */
  nestedRow?(): { layered: boolean; hoisted(): TemplateResult[] };
  /** Per-card UI state (active tab, current slide) of the module being rendered. */
  uiState?<T>(key: string): { get(): T | undefined; set(value: T): void };
  /** Studio canvas: the selected module is a descendant of the module being rendered, in this slot / index. */
  selectedChild?(): { slot: number; index: number } | undefined;
  /** Identifies the card instance (per-card state such as controls' pending values). */
  instance?: string;
  /** The card renders in the studio canvas (edit mode). */
  editMode?: boolean;
  /**
   * The card is shown as a preview (HA's card editor dialog, a dashboard in edit mode, the studio
   * canvas): embedded HA cards get it as their `preview`, like hui-card does.
   */
  preview?: boolean;
  /**
   * v2 animations: the icon rig of the module being rendered (its runtime hint, resolved by the card
   * before the module's content); renderIcon uses it for the module's main icon (`part: 'icon'`).
   */
  iconRig?: unknown;
  /** The card's `custom_icons` copies (markup by saved-icon id): drawn by `mcu:` icons the library does not answer. */
  customIcons?: Record<string, string>;
  /** Entity-scope: effective entity of the node being rendered, and the card entity. */
  entity?: string;
  cardEntity?: string;
}

let current: RenderContext | undefined;

/** One object per outermost card render (nested contexts share it); lets a module tell two renders of the same config apart. */
let pass: object | undefined;

export function withRenderContext<T>(ctx: RenderContext, fn: () => T): T {
  const previous = current;
  const outer = pass;
  current = ctx;
  if (!outer) pass = {};
  try {
    return fn();
  } finally {
    current = previous;
    pass = outer;
  }
}

/** The render pass in progress (undefined outside a card render). */
export function currentRenderPass(): object | undefined {
  return pass;
}

export function currentRenderContext(): RenderContext | undefined {
  return current;
}
