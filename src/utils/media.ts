import type { HomeAssistant } from '../types';
import { safeImageUrl } from './safe-url';
import { currentRenderContext } from '../services/render-context';
import { cachedMediaUrl, mediaSourceId, unwrapCssUrl } from '../services/media-resolver';

/** An image URL usable in the card: HA relative URLs go through hass.hassUrl when present. */
export function resolveMediaUrl(hass: HomeAssistant | undefined, url: string): string {
  if (!url) return url;
  const hassUrl = (hass as { hassUrl?: (path?: string) => string } | undefined)?.hassUrl;
  if (url.startsWith('/') && !url.startsWith('//') && typeof hassUrl === 'function') {
    try {
      return hassUrl.call(hass, url);
    } catch {
      return url;
    }
  }
  return url;
}

/**
 * A camera's `entity_picture` as a snapshot `src`: resolved against the HA URL, then parsed like the
 * browser does and kept only for http(s) and raster data: URLs. Anything else (javascript:, a data:
 * document, a protocol-relative host) gives undefined and the caller shows no picture.
 */
export function safeSnapshotSrc(hass: HomeAssistant | undefined, picture: unknown): string | undefined {
  if (typeof picture !== 'string' || !picture) return undefined;
  return safeImageUrl(resolveMediaUrl(hass, picture), location.href);
}

/**
 * The URL of a browsed media item (`media-source://` id, or an old signed URL mapped back to its id)
 * as resolved by the card being rendered; outside a card render the cached URL. Empty while it
 * resolves: a media-source id never ends up in a src.
 */
function resolvedMedia(id: string): string {
  return currentRenderContext()?.media?.(id) ?? cachedMediaUrl(id) ?? '';
}

/**
 * A media field value as an element `src`: browsed media (`media-source://` id) is resolved, an
 * old CSS `url('...')` wrapper is unwrapped, relative HA URLs go through resolveMediaUrl.
 */
export function mediaSrc(hass: HomeAssistant | undefined, value: unknown): string {
  const id = mediaSourceId(value);
  if (id) return resolveMediaUrl(hass, resolvedMedia(id));
  return resolveMediaUrl(hass, typeof value === 'string' ? unwrapCssUrl(value) : '');
}

/**
 * A background image value (card background_image, design background_image) as CSS: browsed media
 * becomes `url("<resolved>")` (empty while it resolves), a typed path or URL (`/local/...`,
 * `http(s)://...`, `data:...`) is wrapped in `url("...")`; anything else (a url(), a gradient) is kept.
 */
export function mediaCssImage(hass: HomeAssistant | undefined, value: string): string {
  const id = mediaSourceId(value);
  if (!id) {
    const v = typeof value === 'string' ? value.trim() : '';
    return /^(\/|https?:|data:)/i.test(v) ? cssUrl(resolveMediaUrl(hass, v)) : value;
  }
  const url = resolvedMedia(id);
  return url ? cssUrl(resolveMediaUrl(hass, url)) : '';
}

/** `url("...")` with the characters that would end the string escaped. */
function cssUrl(url: string): string {
  return `url("${url.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
}

/** `url` with a cache-busting query parameter that changes every `intervalMs`. */
export function withRefreshParam(url: string, intervalMs: number, now = Date.now()): string {
  if (!url || !(intervalMs > 0)) return url;
  const slot = Math.floor(now / intervalMs);
  return `${url}${url.includes('?') ? '&' : '?'}mc_t=${slot}`;
}
