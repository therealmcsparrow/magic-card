import { CMD, LIBRARY_CHANGED_EVENT, type IconSummary, type SavedIcon, type SavedShape, type SavedShapeInput } from '../../contracts/mcu-library';
import type { LibrarySource } from '../../contracts/preset-transfer';
import type { MagicCardConfig } from '../../types';
import { animLibrary } from '../../utils/anim-hooks';
import { pruneLibraryCopies, type KnownLibrary } from './prune';

// The card editor's side of the Magic Card Utils library: lists for the pickers, one icon for "Use", saving a shape.

interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type Listing<T> = { state: 'ok'; items: T[] } | { state: 'missing' | 'error'; items: [] };

const code = (e: unknown): string => String((e as { code?: string })?.code ?? '');

let icons: Promise<Listing<IconSummary>> | undefined;
let shapes: Promise<Listing<SavedShape>> | undefined;
/** Ids of the last successful lists; what pruning may trust. */
const known: KnownLibrary = {};
let missing = false;

async function list<T, K extends 'icons' | 'shapes'>(hass: Hass | undefined, cmd: string, key: K): Promise<Listing<T>> {
  if (missing || !hass?.callWS) return { state: 'missing', items: [] };
  try {
    const r = await hass.callWS<Record<K, T[]>>({ type: cmd });
    const items = Array.isArray(r?.[key]) ? r[key] : [];
    known[key] = new Set(items.map((i) => String((i as { id: string }).id)));
    return { state: 'ok', items };
  } catch (e) {
    if (code(e) === 'unknown_command') missing = true;
    return { state: code(e) === 'unknown_command' ? 'missing' : 'error', items: [] };
  }
}

const none = (): Promise<Listing<never>> => Promise.resolve({ state: 'missing', items: [] });

export const listIcons = (hass: Hass | undefined): Promise<Listing<IconSummary>> => (!hass?.callWS ? none() : (icons ??= list<IconSummary, 'icons'>(hass, CMD.iconsList, 'icons')));
export const listShapes = (hass: Hass | undefined): Promise<Listing<SavedShape>> => (!hass?.callWS ? none() : (shapes ??= list<SavedShape, 'shapes'>(hass, CMD.shapesList, 'shapes')));

/** The saved shapes again, past the cache: a shape was saved or changed (the shape editor's Save to library). */
export function refreshShapes(hass: Hass | undefined): Promise<Listing<SavedShape>> {
  shapes = undefined;
  return listShapes(hass);
}

/** Forget the cached lists (the library changed, or "Try again"). */
export function resetLibrary(): void {
  icons = shapes = undefined;
  known.icons = known.shapes = undefined;
  missing = false;
}

if (typeof window !== 'undefined') {
  window.addEventListener(LIBRARY_CHANGED_EVENT, () => {
    icons = shapes = undefined;
    // the sets stay until the next list lands: a change event alone never lets a copy go
  });
}

/** Whether the loaded library lists this saved id (false while the list is not loaded). */
export const isSaved = (kind: 'icons' | 'shapes', id: string): boolean => !!known[kind]?.has(id);

/** Whether Magic Card Utils answered the library commands (undefined: not asked yet). */
export const libraryMissing = (): boolean => missing;

export async function getIcon(hass: Hass | undefined, id: string): Promise<SavedIcon | undefined> {
  if (!hass?.callWS) return undefined;
  try {
    const r = await hass.callWS<{ icons: SavedIcon[] }>({ type: CMD.iconsGet, ids: [id] });
    return r?.icons?.[0];
  } catch {
    return undefined;
  }
}

export async function saveShape(hass: Hass | undefined, shape: SavedShapeInput): Promise<{ shape?: SavedShape; error?: 'readonly' | 'full' | 'invalid' | 'unreachable' }> {
  if (!hass?.callWS) return { error: 'unreachable' };
  try {
    const r = await hass.callWS<{ shape: SavedShape }>({ type: CMD.shapesSave, shape });
    shapes = undefined;
    known.shapes = new Set([...(known.shapes ?? []), r.shape.id]);
    return { shape: r.shape };
  } catch (e) {
    const c = code(e);
    return { error: c === 'unauthorized' ? 'readonly' : c === 'library_full' ? 'full' : c === 'invalid_format' ? 'invalid' : 'unreachable' };
  }
}

/** A library id from a name: lower case words joined by dashes, at most 64 characters. */
export function slug(name: string, fallback: string): string {
  const s = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
  return s || fallback;
}

/** The first free id for `base`: ticket, ticket-2, ticket-3... */
export function freeId(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

/** The card without the unused library copies (pruning rule: prune.ts); the same object when none. */
export const prunedConfig = (config: MagicCardConfig): MagicCardConfig =>
  pruneLibraryCopies(config, { ...known, animations: animLibrary().status === 'ready' ? { has: (id) => !!animLibrary().get(id) } : undefined });

/** True when the card has copies and a list that makes pruning possible has not been asked for yet. */
export function needsLists(config: MagicCardConfig): { icons: boolean; shapes: boolean } {
  return {
    icons: !!config.custom_icons && Object.keys(config.custom_icons).length > 0 && !known.icons && !missing && !icons,
    shapes: !!config.custom_shapes && Object.keys(config.custom_shapes).length > 0 && !known.shapes && !missing && !shapes,
  };
}

/** The provider's shape for `id` (what a card renders from), undefined until it is ready or unknown. */
export const providerShape = (id: string) =>
  (window as unknown as { magicCardUtils?: { shapes?: { get(id: string): import('../../contracts/custom-shape').CustomShapeOptions | undefined } } }).magicCardUtils?.shapes?.get(id);

/** What <mc-library-view> reads saved icons and shapes through (preset-transfer LibrarySource): this file's cached lists. */
export const librarySource: LibrarySource = { listIcons, listShapes, getIcon, isSaved, reset: resetLibrary };
