import type { HomeAssistant, MediaResolveResult } from '../types';

/**
 * Browsed media (HA's media source) is stored as its `media-source://` id and resolved while
 * rendering: media_source/resolve_media returns a URL with a signature that expires (`authSig`),
 * so a stored URL breaks after a while or a reload. One resolve per id is in flight at a time for
 * every card; the URL is cached and resolved again shortly before its signature expires (while a
 * card shows it), when the websocket reconnects and when the media fails to load.
 */

export const MEDIA_SOURCE_PREFIX = 'media-source://';

const CSS_URL = /^url\(\s*(['"]?)(.*?)\1\s*\)$/i;
/** Resolve again this long before the signature expires. */
const EXPIRY_MARGIN_MS = 5_000;
/** Lifetime when the signature cannot be read (HA's resolve_media default is 30 s). */
const DEFAULT_LIFETIME_MS = 30_000;
/** A media error resolves again at most this often per id (a missing file does not loop). */
const ERROR_RETRY_MS = 10_000;
/** An id that could not be resolved is tried again when a card shows it after this long. */
const FAILED_RETRY_MS = 60_000;

/** The value without a CSS `url('...')` wrapper. */
export function unwrapCssUrl(value: string): string {
  const v = value.trim();
  const m = v.match(CSS_URL);
  return m ? m[2].trim() : v;
}

/**
 * The media-source id a media field refers to: the id itself, the old `url('media-source://...')`
 * fallback, or an old signed local media URL (`/media/<dir>/<path>?authSig=...`, what the media
 * picker used to store) mapped back to `media-source://media_source/<dir>/<path>`. Undefined for
 * anything else (a plain URL, a gradient), which is used as it is.
 */
export function mediaSourceId(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const v = unwrapCssUrl(value);
  if (v.startsWith(MEDIA_SOURCE_PREFIX)) return v;
  if (!v.startsWith('/') || v.startsWith('//') || !/[?&]authSig=/.test(v)) return undefined;
  const m = v.split(/[?#]/)[0].match(/^\/media\/([^/]+)\/(.+)$/);
  if (!m) return undefined;
  try {
    const path = m[2].split('/').map(decodeURIComponent).join('/');
    return `${MEDIA_SOURCE_PREFIX}media_source/${decodeURIComponent(m[1])}/${path}`;
  } catch {
    return undefined;
  }
}

/** Lifetime of a signed URL from its authSig JWT (exp - iat, both server time). */
function signatureLifetimeMs(url: string): number {
  const sig = /[?&]authSig=([^&#]+)/.exec(url)?.[1];
  const payload = sig?.split('.')[1];
  if (!payload) return DEFAULT_LIFETIME_MS;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { iat?: unknown; exp?: unknown };
    const life = Number(json.exp) - Number(json.iat);
    return Number.isFinite(life) && life > 0 ? life * 1000 : DEFAULT_LIFETIME_MS;
  } catch {
    return DEFAULT_LIFETIME_MS;
  }
}

/** The same media file with another signature (only the authSig differs). */
export function sameSignedMedia(a: string, b: string): boolean {
  if (!/[?&]authSig=/.test(a) || !/[?&]authSig=/.test(b)) return false;
  const strip = (u: string) => u.replace(/([?&])authSig=[^&#]*&?/, '$1').replace(/[?&]$/, '');
  return strip(a) === strip(b);
}

type CallWS = (msg: Record<string, unknown>) => Promise<unknown>;

interface Entry {
  url?: string;
  /** The URL may be used until then (signature still valid). */
  validUntil: number;
  /** Resolved again from then on, while a card shows it. */
  refreshAt: number;
  inflight?: Promise<void>;
  timer?: ReturnType<typeof setTimeout>;
  lastErrorRetry?: number;
  callWS?: CallWS;
}

const entries = new Map<string, Entry>();
const watchers = new Map<string, Set<MediaResolver>>();

/** Test hook. */
export function clearMediaCache(): void {
  for (const e of entries.values()) if (e.timer !== undefined) clearTimeout(e.timer);
  entries.clear();
  watchers.clear();
}

/** The resolved URL of an id while its signature is valid (no resolve is started). */
export function cachedMediaUrl(id: string): string | undefined {
  const e = entries.get(id);
  return e?.url && Date.now() < e.validUntil ? e.url : undefined;
}

function notify(id: string): void {
  for (const w of watchers.get(id) ?? []) w.changed();
}

function scheduleRefresh(id: string, entry: Entry): void {
  if (entry.timer !== undefined) clearTimeout(entry.timer);
  entry.timer = undefined;
  if (!entry.url || !watchers.get(id)?.size) return;
  entry.timer = setTimeout(() => {
    entry.timer = undefined;
    if (watchers.get(id)?.size && entry.callWS) resolve(id, entry.callWS);
  }, Math.max(0, entry.refreshAt - Date.now()));
}

function resolve(id: string, callWS: CallWS): void {
  let entry = entries.get(id);
  if (!entry) {
    entry = { validUntil: 0, refreshAt: 0 };
    entries.set(id, entry);
  }
  entry.callWS = callWS;
  if (entry.inflight) return;
  const e = entry;
  e.inflight = Promise.resolve()
    .then(() => callWS({ type: 'media_source/resolve_media', media_content_id: id }))
    .then((res) => {
      const url = (res as MediaResolveResult | undefined)?.url;
      if (typeof url !== 'string' || !url || url.startsWith(MEDIA_SOURCE_PREFIX)) throw new Error('no url');
      const now = Date.now();
      const life = signatureLifetimeMs(url);
      e.url = url;
      e.validUntil = now + life;
      e.refreshAt = now + Math.max(EXPIRY_MARGIN_MS, life - EXPIRY_MARGIN_MS);
    })
    .catch(() => {
      // unresolvable (deleted file, source gone, no websocket): the placeholder shows
      e.url = undefined;
      e.validUntil = 0;
      e.refreshAt = Date.now() + FAILED_RETRY_MS;
    })
    .finally(() => {
      e.inflight = undefined;
      scheduleRefresh(id, e);
      notify(id);
    });
}

/** A media element failed to load the id's URL (e.g. its signature expired): resolve again. */
export function reportMediaError(id: string): void {
  const e = entries.get(id);
  if (!e?.callWS || e.inflight) return;
  const now = Date.now();
  if (e.lastErrorRetry !== undefined && now - e.lastErrorRetry < ERROR_RETRY_MS) return;
  e.lastErrorRetry = now;
  resolve(id, e.callWS);
}

interface ConnectionEvents {
  addEventListener?: (type: string, cb: () => void) => void;
  removeEventListener?: (type: string, cb: () => void) => void;
}

/**
 * Per card: the media ids its modules render (collected per render pass, like the
 * SubscriptionController); re-renders the card when one of them resolves again.
 */
export class MediaResolver {
  private _ids = new Set<string>();
  private _wanted: Set<string> | null = null;
  private _connected = false;
  private _readyOn?: ConnectionEvents;
  private readonly _onReady = (): void => {
    const callWS = this._callWS();
    if (!callWS) return;
    for (const id of this._ids) resolve(id, callWS);
  };

  constructor(
    private readonly _requestUpdate: () => void,
    private readonly _hass: () => HomeAssistant | undefined,
  ) {}

  /** Called by the shared cache when an id this card shows has a new URL. */
  changed(): void {
    if (this._connected) this._requestUpdate();
  }

  begin(): void {
    this._wanted = new Set();
  }

  /** The URL to show for an id, undefined while it resolves or when it cannot be resolved. */
  get(id: string): string | undefined {
    this._wanted?.add(id);
    return cachedMediaUrl(id);
  }

  end(): void {
    const wanted = this._wanted;
    this._wanted = null;
    if (!wanted) return;
    for (const id of this._ids) if (!wanted.has(id)) this._unwatch(id);
    this._ids = wanted;
    if (this._connected) this._watchAll();
  }

  hostConnected(): void {
    this._connected = true;
    this._watchAll();
  }

  hostDisconnected(): void {
    this._connected = false;
    for (const id of this._ids) this._unwatch(id);
    this._listenReady(undefined);
  }

  private _callWS(): CallWS | undefined {
    const hass = this._hass();
    return hass?.callWS ? (msg) => hass.callWS(msg) : undefined;
  }

  private _watchAll(): void {
    const callWS = this._callWS();
    this._listenReady(this._hass()?.connection as ConnectionEvents | undefined);
    for (const id of this._ids) {
      let set = watchers.get(id);
      if (!set) watchers.set(id, (set = new Set()));
      const added = !set.has(this);
      set.add(this);
      const e = entries.get(id);
      if (!e || (!e.inflight && Date.now() >= e.refreshAt)) {
        if (callWS) resolve(id, callWS);
      } else if (added && e.timer === undefined) {
        scheduleRefresh(id, e);
      }
    }
  }

  private _unwatch(id: string): void {
    const set = watchers.get(id);
    set?.delete(this);
    if (set && !set.size) {
      watchers.delete(id);
      const e = entries.get(id);
      if (e?.timer !== undefined) clearTimeout(e.timer);
      if (e) e.timer = undefined;
    }
  }

  private _listenReady(connection: ConnectionEvents | undefined): void {
    if (this._readyOn === connection) return;
    this._readyOn?.removeEventListener?.('ready', this._onReady);
    this._readyOn = connection?.addEventListener ? connection : undefined;
    this._readyOn?.addEventListener?.('ready', this._onReady);
  }
}
