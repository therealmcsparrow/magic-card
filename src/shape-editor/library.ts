import { CMD, LIBRARY_ID_RE, SHAPE_MAX_BYTES, type LibraryChangedDetail, type MagicCardUtilsWindow, type SavedShape, type SavedShapeInput } from '../contracts/mcu-library';
import type { CustomShapeOptions, ShapeLookup } from '../contracts/custom-shape';

/*
 * The shape editor's side of the Magic Card Utils library (mcu-library 1.0.0). Browsing and saving use
 * the WebSocket commands; resolving a `ref` uses the provider (window.magicCardUtils) so the editor
 * sees what the card sees. Cards never call these.
 */

export interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type LibraryProblem = 'missing' | 'readonly' | 'conflict' | 'full' | 'invalid' | 'unreachable';

export class LibraryError extends Error {
  constructor(public problem: LibraryProblem) {
    super(problem);
  }
}

const PROBLEMS: Record<string, LibraryProblem> = { unknown_command: 'missing', unauthorized: 'readonly', conflict: 'conflict', library_full: 'full', invalid_format: 'invalid' };

async function call<T>(hass: Hass | undefined, msg: Record<string, unknown>): Promise<T> {
  if (!hass?.callWS) throw new LibraryError('missing');
  try {
    return await hass.callWS<T>(msg);
  } catch (e) {
    throw new LibraryError(PROBLEMS[(e as { code?: string })?.code ?? ''] ?? 'unreachable');
  }
}

export const listShapes = (h?: Hass): Promise<SavedShape[]> => call<{ shapes: SavedShape[] }>(h, { type: CMD.shapesList }).then((r) => r.shapes ?? []);

export const saveShape = (h: Hass | undefined, shape: SavedShapeInput, baseUpdatedAt?: string): Promise<SavedShape> =>
  call<{ shape: SavedShape }>(h, { type: CMD.shapesSave, shape, ...(baseUpdatedAt ? { base_updated_at: baseUpdatedAt } : {}) }).then((r) => r.shape);

export const deleteShape = (h: Hass | undefined, id: string): Promise<void> => call<unknown>(h, { type: CMD.shapesDelete, shape_id: id }).then(() => undefined);

/** A library id from a name: lower case words joined by dashes, at most 64 characters. */
export function slug(name: string): string {
  const s = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/, '');
  return LIBRARY_ID_RE.test(s) ? s : 'shape';
}

/** The first free id for `name`: ticket, ticket-2, ticket-3... */
export function freeId(name: string, taken: ReadonlySet<string>): string {
  const base = slug(name).slice(0, 60);
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

/** Compact JSON bytes of a shape (the server limit is SHAPE_MAX_BYTES). */
export const shapeBytes = (o: unknown): number => new TextEncoder().encode(JSON.stringify(o)).length;
export const tooBig = (o: unknown): boolean => shapeBytes(o) > SHAPE_MAX_BYTES;

/** The provider's saved shape, undefined until it is ready and for unknown ids. */
export const providerShape = (id: string): CustomShapeOptions | undefined =>
  (window as unknown as { magicCardUtils?: Partial<MagicCardUtilsWindow> }).magicCardUtils?.shapes?.get(id);

/** What the card looks a `ref` up with: the provider first, then the card's own copies. */
export const lookupFor = (copies?: Record<string, CustomShapeOptions>): ShapeLookup => ({
  library: providerShape,
  inline: (id) => copies?.[id],
});

/** Call `cb` when the library's shapes change; returns the stop function. */
export function watchLibrary(cb: () => void): () => void {
  const on = (e: Event) => (e as CustomEvent<LibraryChangedDetail>).detail?.kind === 'shapes' && cb();
  window.addEventListener('mcu-library-changed', on);
  return () => window.removeEventListener('mcu-library-changed', on);
}
