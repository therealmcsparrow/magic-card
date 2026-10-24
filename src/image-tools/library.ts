import { LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library.needs';
import type { ImageSummary, SavedImage } from '../contracts/mcu-library-images';
import { CMD_GET, CMD_LIST } from './model';

/*
 * The card editor's side of the image library (mcu-library 1.1.0, images part): the list for the picker and one
 * image with its connections. Both are cached for the page and dropped when the library changes. A missing command
 * (`unknown_command`) means Magic Card Utils is not installed and is remembered for the page.
 */

interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type Listing = { state: 'ok'; items: ImageSummary[] } | { state: 'missing' | 'error'; items: [] };

const code = (e: unknown): string => String((e as { code?: string })?.code ?? '');

let listing: Promise<Listing> | undefined;
const items = new Map<string, Promise<SavedImage | undefined>>();
let missing = false;

export function listImages(hass: Hass | undefined): Promise<Listing> {
  if (missing || !hass?.callWS) return Promise.resolve({ state: 'missing', items: [] });
  listing ??= hass.callWS<{ images?: ImageSummary[] }>({ type: CMD_LIST }).then(
    (r): Listing => ({ state: 'ok', items: Array.isArray(r?.images) ? r.images : [] }),
    (e: unknown): Listing => {
      listing = undefined;
      if (code(e) === 'unknown_command') {
        missing = true;
        return { state: 'missing', items: [] };
      }
      return { state: 'error', items: [] };
    },
  );
  return listing;
}

/** One image (with its connections), or undefined when it is unknown or unreadable. */
export function getImage(hass: Hass | undefined, id: string): Promise<SavedImage | undefined> {
  if (!hass?.callWS) return Promise.resolve(undefined);
  let p = items.get(id);
  if (!p) {
    p = hass.callWS<{ images?: SavedImage[] }>({ type: CMD_GET, ids: [id] }).then(
      (r) => r?.images?.find((i) => i.id === id),
      () => {
        items.delete(id);
        return undefined;
      },
    );
    items.set(id, p);
  }
  return p;
}

/** Forget what was read ("Try again", or the library changed). */
export function resetImages(): void {
  listing = undefined;
  items.clear();
  missing = false;
}

if (typeof window !== 'undefined') {
  window.addEventListener(LIBRARY_CHANGED_EVENT, (e) => {
    if ((e as CustomEvent<{ kind?: string }>).detail?.kind !== 'images') return;
    listing = undefined;
    items.clear();
  });
}
