import type { TemplateResult } from 'lit';
import type { TemplateState } from './template-controller';
import type { SubscriptionState } from './subscription-controller';
import type { CardModule, NestedColumnConfig } from '../types';

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
  /**
   * Render a layout module's child through the card's module pipeline (design, animations, actions,
   * display conditions, validation errors, editor paths). `slot` is the column / tab (0 for flat lists).
   */
  renderChild?(child: CardModule, index: number, slot?: number): TemplateResult;
  /** Render a row module's column like a card column (with its children), `slot` its index. */
  renderColumn?(col: NestedColumnConfig, slot: number): TemplateResult | undefined;
  /**
   * The child is hidden by its display conditions on the live dashboard (it renders nothing). Always
   * false in the studio canvas, which shows hidden modules dimmed.
   */
  childHidden?(child: CardModule): boolean;
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
}

let current: RenderContext | undefined;

export function withRenderContext<T>(ctx: RenderContext, fn: () => T): T {
  const previous = current;
  current = ctx;
  try {
    return fn();
  } finally {
    current = previous;
  }
}

export function currentRenderContext(): RenderContext | undefined {
  return current;
}
