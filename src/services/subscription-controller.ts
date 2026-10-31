import type { HomeAssistant } from '../types';

// Websocket subscriptions read while rendering (e.g. weather/subscribe_forecast): one subscription per distinct message
// for as long as some module of the card renders it, like the TemplateController does for render_template.
// The last message per subscription is cached, so a re-created card paints the last known data right away.

export type SubscriptionState<T = unknown> =
  | { status: 'pending' }
  | { status: 'ok'; data: T }
  | { status: 'error'; error: string }
  /** No websocket connection (thumbnails, tests, old harness). */
  | { status: 'unavailable' };

type Connection = HomeAssistant['connection'];

interface Subscription {
  msg: Record<string, unknown>;
  state: SubscriptionState;
  active?: Promise<(() => void) | undefined>;
  token?: object;
  /** Home Assistant refused it: retried when the card re-attaches or the websocket reconnects. */
  failed?: boolean;
}

interface ConnectionEvents {
  addEventListener?: (type: string, cb: () => void) => void;
  removeEventListener?: (type: string, cb: () => void) => void;
}

const CACHE_MAX = 100;
const dataCache = new Map<string, SubscriptionState>();

function cacheData(key: string, state: SubscriptionState): void {
  if (state.status !== 'ok') return;
  dataCache.delete(key);
  dataCache.set(key, state);
  if (dataCache.size > CACHE_MAX) dataCache.delete(dataCache.keys().next().value as string);
}

/** Test hook. */
export function clearSubscriptionCache(): void {
  dataCache.clear();
}

export function subscriptionKey(msg: Record<string, unknown>): string {
  return JSON.stringify(Object.keys(msg).sort().map((k) => [k, msg[k]]));
}

function errorMessage(err: unknown): string {
  return err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : String(err);
}

export class SubscriptionController {
  private _subs = new Map<string, Subscription>();
  private _wanted: Set<string> | null = null;
  private _connected = false;
  private _timer?: ReturnType<typeof setTimeout>;
  private _dirty = false;
  private _readyOn?: ConnectionEvents;
  private readonly _onReady = (): void => {
    for (const sub of this._subs.values()) sub.failed = false;
    if (!this._connected) return;
    for (const sub of this._subs.values()) this._subscribe(sub);
  };

  constructor(
    private readonly _requestUpdate: () => void,
    private readonly _connection: () => Connection | undefined,
    private readonly _debounceMs = 50,
  ) {}

  /** Start a render pass: subscriptions not read again before `end()` are dropped. */
  begin(): void {
    this._wanted = new Set();
    this._dirty = false;
  }

  /** Latest data of a subscription; subscribes after the render pass (see `end`). */
  get<T>(msg: Record<string, unknown>): SubscriptionState<T> {
    const key = subscriptionKey(msg);
    this._wanted?.add(key);
    let sub = this._subs.get(key);
    if (!sub) {
      sub = { msg, state: dataCache.get(key) ?? { status: 'pending' } };
      if (!this._connection()?.subscribeMessage) sub.state = { status: 'unavailable' };
      this._subs.set(key, sub);
    }
    return sub.state as SubscriptionState<T>;
  }

  end(): void {
    const wanted = this._wanted;
    this._wanted = null;
    if (!wanted) return;
    for (const [key, sub] of this._subs) {
      if (!wanted.has(key)) {
        this._unsubscribe(sub);
        this._subs.delete(key);
      } else if (this._connected) {
        this._subscribe(sub);
      }
    }
  }

  hostConnected(): void {
    this._connected = true;
    for (const sub of this._subs.values()) {
      sub.failed = false;
      this._subscribe(sub);
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

  private _subscribe(sub: Subscription): void {
    if (sub.active || sub.failed) return;
    const key = subscriptionKey(sub.msg);
    const connection = this._connection();
    if (!connection?.subscribeMessage) {
      this._set(key, sub, { status: 'unavailable' });
      return;
    }
    this._listenReady(connection as ConnectionEvents);
    if (sub.state.status === 'unavailable') sub.state = dataCache.get(key) ?? { status: 'pending' };
    const token = {};
    sub.token = token;
    const live = () => sub.token === token;
    let pending: Promise<() => void>;
    try {
      pending = connection.subscribeMessage<unknown>((m) => {
        if (live()) this._set(key, sub, { status: 'ok', data: m });
      }, { ...sub.msg });
    } catch (err) {
      pending = Promise.reject(err);
    }
    sub.active = Promise.resolve(pending)
      .then((fn) => fn as (() => void) | undefined)
      .catch((err: unknown) => {
        if (live()) {
          sub.active = undefined;
          sub.token = undefined;
          sub.failed = true;
          this._set(key, sub, { status: 'error', error: errorMessage(err) });
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

  private _set(key: string, sub: Subscription, state: SubscriptionState): void {
    if (sub.state === state) return;
    if (sub.state.status === state.status && state.status !== 'ok') {
      if (state.status !== 'error' || (sub.state as { error: string }).error === state.error) return;
    }
    sub.state = state;
    cacheData(key, state);
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
