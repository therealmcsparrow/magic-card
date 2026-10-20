import type { AnimationDoc } from '../anim-studio/model';
import { animHooks, type AnimationValidators } from '../utils/anim-hooks';

/*
 * The global animation library of the magic-card-utils integration, shared by every card on the
 * page: one fetch and one subscription per page (per HA connection), started lazily by the first
 * card that renders a `preset: custom:<id>` reference (or the editor's picker). Cards that never
 * reference a custom animation cause no request at all.
 *
 * WebSocket contract (the integration implements these; documents are validated here again and
 * invalid ones are dropped):
 *
 *   → { type: 'magic_card_utils/get_animations' }
 *   ← { animations: { [id: string]: AnimationDoc } }          (a list of documents is accepted too)
 *
 *   → { type: 'magic_card_utils/subscribe_animations' }      (a subscription: subscribeMessage)
 *   ← { action: 'saved', animation: AnimationDoc }            created or updated
 *   ← { action: 'deleted', id: string }                      (the event keeps `id`)
 *   ← { action: 'reset', animations: { [id]: AnimationDoc } } the whole library replaced (import)
 *
 *   → { type: 'magic_card_utils/save_animation', animation: AnimationDoc }   admin only
 *   ← { animation: AnimationDoc }                                          the stored (normalised) doc
 *     error { code: 'invalid_format', message, errors?: [{ path, message }] }  field paths as in model.ts
 *   → { type: 'magic_card_utils/delete_animation', animation_id: string }   admin only
 *   ← {}                     (`animation_id`, not `id`: `id` is the WebSocket message id)
 *
 * Without the integration (`unknown_command`) the status is 'unavailable' for good. Other failures
 * (`not_loaded` while it starts, a dropped socket) are 'unavailable' until a retry works: on the
 * connection's next `ready`, and after 5 s, 15 s and 60 s while it stays up. Meanwhile `custom:`
 * references fall back to the card's inline `custom_animations`, else render nothing.
 */

/**
 * The document validators. model.ts registers them when it loads (the `anim` chunk, the editor and the studio bundles all
 * carry it); this service is Core and may not import it (ADR 0043). The card starts the library from a custom-animation
 * lookup, which only the `anim` chunk makes, so they are there; a start without them is a failed fetch (retried).
 */
function validators(): AnimationValidators {
  const v = animHooks.validators;
  if (!v) throw new Error('the animation model has not loaded');
  return v;
}

/** Retry delays (ms) after a failed first fetch that may work later. */
const RETRY_MS = [5000, 15000, 60000];

export type LibraryStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

export interface LibraryConnection {
  subscribeMessage<T>(callback: (msg: T) => void, msg: Record<string, unknown>): Promise<() => void>;
  addEventListener?(event: string, cb: () => void): void;
  removeEventListener?(event: string, cb: () => void): void;
}

export interface LibraryHass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  connection?: LibraryConnection;
}

export type LibraryMessage =
  | { action: 'saved'; animation: unknown }
  | { action: 'deleted'; id: string }
  | { action: 'reset'; animations: unknown };

export const GET_ANIMATIONS = 'magic_card_utils/get_animations';
export const SUBSCRIBE_ANIMATIONS = 'magic_card_utils/subscribe_animations';

export class AnimationLibrary {
  status: LibraryStatus = 'idle';
  /** Bumped on every change (cheap change detection for renders). */
  version = 0;
  private _docs = new Map<string, AnimationDoc>();
  private _listeners = new Set<() => void>();
  private _conn?: LibraryConnection;
  private _hass?: LibraryHass;
  private _unsub?: () => void;
  /** Timed retries since the last start / reconnect (0 from _teardown); 9: the integration is missing. */
  private _tries!: number;
  private _timer?: ReturnType<typeof setTimeout>;
  /** Reconnected: refetch, or (after a failure that may pass) start over with a fresh backoff. */
  private _onReady = (): void => {
    if (this.status === 'ready') void this._refetch();
    else if (this._tries < 9) {
      this._tries = 0;
      this._retry();
    }
  };
  /** Start again after a failure (not while loading or ready). */
  private _retry = (): void => {
    if (this.status === 'unavailable') void this._start(this._hass!, this._conn!);
  };

  /** Start the fetch and subscription once for this connection (no-op after that). */
  ensure(hass: LibraryHass | undefined): void {
    const conn = hass?.connection;
    if (!hass || !conn) return;
    // another connection while the current one is still open (two hass objects on one page): keep it
    if (conn !== this._conn && (this._conn as { connected?: boolean } | undefined)?.connected === true) return;
    this._hass = hass;
    if (conn === this._conn) return;
    this._teardown();
    this._conn = conn;
    conn.addEventListener?.('ready', this._onReady);
    void this._start(hass, conn);
  }

  get(id: string): AnimationDoc | undefined {
    return this._docs.get(id);
  }

  /** Every document, by name. */
  list(): AnimationDoc[] {
    return [...this._docs.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Called after every change (and status change); returns the unsubscribe. */
  subscribe(cb: () => void): () => void {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }

  private async _start(hass: LibraryHass, conn: LibraryConnection): Promise<void> {
    this._setStatus('loading');
    // updates that arrive while the first fetch runs are applied after it
    let pending: LibraryMessage[] | undefined = [];
    try {
      const unsub = await conn.subscribeMessage<LibraryMessage>((m) => (pending ? pending.push(m) : this._apply(m)), { type: SUBSCRIBE_ANIMATIONS });
      if (conn !== this._conn) {
        unsub();
        return;
      }
      this._unsub = unsub;
      const res = await hass.callWS<{ animations?: unknown }>({ type: GET_ANIMATIONS });
      if (conn !== this._conn) return;
      this._replace(res?.animations);
      const queued = pending;
      pending = undefined;
      for (const m of queued) this._apply(m, false);
      this._setStatus('ready');
    } catch (err) {
      if (conn !== this._conn) return;
      pending = undefined;
      this._unsub?.();
      this._unsub = undefined;
      if ((err as { code?: string })?.code === 'unknown_command') this._tries = 9;
      else {
        if (!this._tries) console.warn('Magic Card: animation library unavailable', err);
        const ms = RETRY_MS[this._tries++];
        if (ms) this._timer = setTimeout(this._retry, ms);
      }
      this._setStatus('unavailable');
    }
  }

  /** After a reconnect: the library may have changed meanwhile. */
  private async _refetch(): Promise<void> {
    const hass = this._hass;
    const conn = this._conn;
    if (!hass || !conn || this.status !== 'ready') return;
    try {
      const res = await hass.callWS<{ animations?: unknown }>({ type: GET_ANIMATIONS });
      if (conn === this._conn) {
        this._replace(res?.animations);
        this._emit();
      }
    } catch {
      // keep what we have
    }
  }

  private _replace(input: unknown): void {
    // lenient v2: an invalid part, track, clip or binding is dropped, not the whole document
    const { docs, errors } = validators().library(input ?? {}, { v2: 'lenient' });
    if (errors.length) console.warn('Magic Card: invalid animations in the library', errors);
    // keep the objects of unchanged documents (compiled results are cached per object)
    for (const [id, doc] of docs) {
      const old = this._docs.get(id);
      if (old && JSON.stringify(old) === JSON.stringify(doc)) docs.set(id, old);
    }
    this._docs = docs;
    this.version++;
  }

  private _apply(m: LibraryMessage, emit = true): void {
    if (!m || typeof m !== 'object') return;
    if (m.action === 'deleted') {
      if (!this._docs.delete(m.id)) return;
    } else if (m.action === 'saved') {
      const r = validators().doc(m.animation, { v2: 'lenient' });
      if (!r.ok) {
        console.warn('Magic Card: invalid animation from the library', r.errors);
        return;
      }
      this._docs.set(r.doc.id, r.doc);
    } else if ('animations' in m) {
      this._replace(m.animations);
    } else return;
    this.version++;
    if (emit) this._emit();
  }

  private _setStatus(s: LibraryStatus): void {
    this.status = s;
    this.version++;
    this._emit();
  }

  private _emit(): void {
    for (const cb of [...this._listeners]) cb();
  }

  private _teardown(): void {
    clearTimeout(this._timer);
    this._tries = 0;
    this._unsub?.();
    this._unsub = undefined;
    this._conn?.removeEventListener?.('ready', this._onReady);
    this._conn = undefined;
    this._docs = new Map();
    this.status = 'idle';
  }

  /** Tests: forget everything (listeners too). */
  reset(): void {
    this._teardown();
    this._hass = undefined;
    this._listeners.clear();
    this.version = 0;
  }
}

/** The page's library (one per page; every card shares it). */
export const animationLibrary = new AnimationLibrary();

const inline = new WeakMap<object, Map<string, AnimationDoc>>();

/**
 * A card's inline `custom_animations` (a list or an id-keyed map of documents), validated once
 * per config object: the fallback when the library lacks an id (shared YAML still works).
 */
export function inlineAnimations(config: { custom_animations?: unknown } | undefined): Map<string, AnimationDoc> | undefined {
  const raw = config?.custom_animations;
  if (!raw || typeof raw !== 'object') return undefined;
  let docs = inline.get(raw as object);
  if (!docs) {
    const r = validators().library(raw, { v2: 'lenient' });
    if (r.errors.length) console.warn('Magic Card: invalid custom_animations', r.errors);
    docs = r.docs;
    inline.set(raw as object, docs);
  }
  return docs;
}
