import type { HomeAssistant } from '../types';

/**
 * Live Jinja templates for the card: one `render_template` subscription per template string (and
 * variables) for as long as some part of the card renders it. Results are cached per template
 * string, so a re-created card paints the last known value right away.
 */

export type TemplateState =
  | { status: 'pending' }
  | { status: 'ok'; result: unknown }
  | { status: 'error'; error: string }
  /** No websocket connection (thumbnails, tests, old harness): callers fall back to their raw text. */
  | { status: 'unavailable' };

type Connection = HomeAssistant['connection'];

interface RenderTemplateMessage {
  result?: unknown;
  error?: string;
  level?: 'ERROR' | 'WARNING';
}

interface Subscription {
  template: string;
  variables?: Record<string, unknown>;
  state: TemplateState;
  /** Resolves to the unsubscribe function; undefined while not subscribed. */
  active?: Promise<(() => void) | undefined>;
  /** Identity of the live subscription. */
  token?: object;
  /**
   * Home Assistant refused the subscription (a template that does not compile). Not retried on
   * every render: only when the card re-attaches or the websocket reconnects (a changed template
   * is a new subscription anyway).
   */
  failed?: boolean;
}

/** home-assistant-js-websocket Connection events ('ready' after a reconnect). */
interface ConnectionEvents {
  addEventListener?: (type: string, cb: () => void) => void;
  removeEventListener?: (type: string, cb: () => void) => void;
}

const CACHE_MAX = 300;
/** Last good result per template key, shared by every card on the page. */
const resultCache = new Map<string, TemplateState>();

function cacheResult(key: string, state: TemplateState): void {
  if (state.status !== 'ok') return;
  resultCache.delete(key);
  resultCache.set(key, state);
  if (resultCache.size > CACHE_MAX) resultCache.delete(resultCache.keys().next().value as string);
}

/** Test hook. */
export function clearTemplateCache(): void {
  resultCache.clear();
}

export function templateKey(template: string, variables?: Record<string, unknown>): string {
  return variables && Object.keys(variables).length ? `${template}\u0000${JSON.stringify(variables)}` : template;
}

/** Whether a string holds Jinja syntax ({{ }}, {% %} or {# #}). */
export function hasJinja(text: string): boolean {
  return /\{\{|\{%|\{#/.test(text);
}

/** A render result as display text (HA parses results to native types: numbers, booleans, lists). */
export function templateResultToString(result: unknown): string {
  if (result === null || result === undefined) return '';
  if (typeof result === 'string') return result;
  if (typeof result === 'object') {
    try {
      return JSON.stringify(result);
    } catch {
      return String(result);
    }
  }
  return String(result);
}

/** HA's template condition semantics (result_as_boolean): true / yes / on / enable, or a non-zero number. */
export function templateResultTruthy(result: unknown): boolean {
  if (typeof result === 'boolean') return result;
  if (typeof result === 'number') return result !== 0 && !Number.isNaN(result);
  if (typeof result !== 'string') return false;
  const s = result.trim().toLowerCase();
  if (['true', 'yes', 'on', 'enable'].includes(s)) return true;
  if (s !== '' && !Number.isNaN(Number(s))) return Number(s) !== 0;
  return false;
}

function sameState(a: TemplateState, b: TemplateState): boolean {
  if (a.status !== b.status) return false;
  if (a.status === 'ok' && b.status === 'ok') {
    if (a.result === b.result) return true;
    return typeof a.result === 'object' && JSON.stringify(a.result) === JSON.stringify(b.result);
  }
  if (a.status === 'error' && b.status === 'error') return a.error === b.error;
  return true;
}

export class TemplateController {
  private _subs = new Map<string, Subscription>();
  /** Keys requested during the current render pass; null outside a pass. */
  private _wanted: Set<string> | null = null;
  private _connected = false;
  private _timer?: ReturnType<typeof setTimeout>;
  /**
   * A state changed since the last render pass. Survives a disconnect (which cancels the debounced
   * update), so a card re-attached before the update ran still re-renders: HA re-sends the same
   * result on the new subscription, which by itself changes nothing.
   */
  private _dirty = false;
  /** Connection whose 'ready' (reconnected) event we listen to. */
  private _readyOn?: ConnectionEvents;
  private readonly _onReady = (): void => {
    for (const sub of this._subs.values()) sub.failed = false;
    if (!this._connected) return;
    for (const [key, sub] of this._subs) this._subscribe(key, sub);
  };

  constructor(
    private readonly _requestUpdate: () => void,
    private readonly _connection: () => Connection | undefined,
    private readonly _debounceMs = 50,
  ) {}

  /** Start a render pass: templates not read again before `end()` are unsubscribed. */
  begin(): void {
    this._wanted = new Set();
    this._dirty = false;
  }

  /** Current state of a template; subscribes after the render pass (see `end`). */
  get(template: string, variables?: Record<string, unknown>): TemplateState {
    const key = templateKey(template, variables);
    this._wanted?.add(key);
    let sub = this._subs.get(key);
    if (!sub) {
      sub = { template, variables, state: resultCache.get(key) ?? { status: 'pending' } };
      if (!this._connection()?.subscribeMessage) sub.state = { status: 'unavailable' };
      this._subs.set(key, sub);
    }
    return sub.state;
  }

  /** End a render pass: subscribe what was read, drop what was not. */
  end(): void {
    const wanted = this._wanted;
    this._wanted = null;
    if (!wanted) return;
    for (const [key, sub] of this._subs) {
      if (!wanted.has(key)) {
        this._unsubscribe(sub);
        this._subs.delete(key);
      } else if (this._connected) {
        this._subscribe(key, sub);
      }
    }
  }

  hostConnected(): void {
    this._connected = true;
    for (const [key, sub] of this._subs) {
      sub.failed = false;
      this._subscribe(key, sub);
    }
    if (this._dirty) this._schedule();
  }

  hostDisconnected(): void {
    this._connected = false;
    for (const sub of this._subs.values()) this._unsubscribe(sub);
    this._listenReady(undefined);
    if (this._timer !== undefined) clearTimeout(this._timer);
    this._timer = undefined;
  }

  /** Number of live subscriptions (tests). */
  get size(): number {
    return [...this._subs.values()].filter((s) => s.active).length;
  }

  private _listenReady(connection: ConnectionEvents | undefined): void {
    if (this._readyOn === connection) return;
    this._readyOn?.removeEventListener?.('ready', this._onReady);
    this._readyOn = connection?.addEventListener ? connection : undefined;
    this._readyOn?.addEventListener?.('ready', this._onReady);
  }

  private _subscribe(key: string, sub: Subscription): void {
    if (sub.active || sub.failed) return;
    const connection = this._connection();
    if (!connection?.subscribeMessage) {
      this._set(key, sub, { status: 'unavailable' });
      return;
    }
    this._listenReady(connection as ConnectionEvents);
    if (sub.state.status === 'unavailable') sub.state = resultCache.get(key) ?? { status: 'pending' };
    const msg: Record<string, unknown> = { type: 'render_template', template: sub.template, report_errors: true };
    if (sub.variables) msg.variables = sub.variables;
    // Messages of a subscription that was dropped (or replaced) are ignored.
    const token = {};
    sub.token = token;
    const live = () => sub.token === token;
    const pending = connection
      .subscribeMessage<RenderTemplateMessage>((m) => {
        if (!live()) return;
        if (m && typeof m === 'object' && 'error' in m && m.error !== undefined) {
          if (m.level === 'WARNING') return; // HA keeps rendering after a warning
          this._set(key, sub, { status: 'error', error: String(m.error) });
          return;
        }
        this._set(key, sub, { status: 'ok', result: m?.result });
      }, msg);
    sub.active = Promise.resolve(pending)
      .then((fn) => fn as (() => void) | undefined)
      .catch((err: unknown) => {
        if (live()) {
          sub.active = undefined;
          sub.token = undefined;
          sub.failed = true;
          const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : String(err);
          this._set(key, sub, { status: 'error', error: message });
        }
        return undefined;
      });
  }

  private _unsubscribe(sub: Subscription): void {
    const active = sub.active;
    sub.active = undefined;
    sub.token = undefined;
    if (!active) return;
    active.then((fn) => {
      try {
        fn?.();
      } catch {
        // connection already closed
      }
    });
  }

  private _set(key: string, sub: Subscription, state: TemplateState): void {
    if (sameState(sub.state, state)) return;
    sub.state = state;
    cacheResult(key, state);
    this._dirty = true;
    if (this._connected) this._schedule();
  }

  private _schedule(): void {
    if (this._timer !== undefined) return;
    this._timer = setTimeout(() => {
      this._timer = undefined;
      this._requestUpdate();
    }, this._debounceMs);
  }
}
