import { CMD, LIBRARY_ID_RE, type IconSummary, type SavedIcon, type SavedIconInput } from '../contracts/mcu-library';

// The editor side of the Magic Card Utils library (mcu-library 1.1.0): the one client for icon and image calls, failures as short texts.

export interface Hass {
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

export type LibraryProblem = 'missing' | 'readonly' | 'conflict' | 'full' | 'invalid' | 'unreachable';

export class LibraryError extends Error {
  constructor(public problem: LibraryProblem) {
    super(problem);
  }
}

/** What a rejected call means: the server's `error.code` as one of a few problems. */
export function libraryProblem(e: unknown): LibraryProblem {
  const c = typeof e === 'object' && e ? (e as { code?: unknown }).code : undefined;
  return c === 'unknown_command' ? 'missing' : c === 'unauthorized' ? 'readonly' : c === 'conflict' ? 'conflict' : c === 'library_full' ? 'full' : c === 'invalid_format' ? 'invalid' : 'unreachable';
}

/** One library command. A failure throws what `make` builds from the problem and the server's own error (none when there is no connection). */
export async function libraryCall<T>(hass: Hass | undefined, msg: Record<string, unknown>, make: (problem: LibraryProblem, raw?: unknown) => Error = (p) => new LibraryError(p)): Promise<T> {
  if (!hass?.callWS) throw make('missing');
  try {
    return await hass.callWS<T>(msg);
  } catch (e) {
    throw make(libraryProblem(e), e);
  }
}

const call = <T>(hass: Hass | undefined, msg: Record<string, unknown>): Promise<T> => libraryCall<T>(hass, msg);

export const listIcons = (h?: Hass): Promise<IconSummary[]> => call<{ icons: IconSummary[] }>(h, { type: CMD.iconsList }).then((r) => r.icons ?? []);

export const getIcon = (h: Hass | undefined, id: string): Promise<SavedIcon | undefined> =>
  call<{ icons: SavedIcon[] }>(h, { type: CMD.iconsGet, ids: [id] }).then((r) => r.icons?.[0]);

export const saveIcon = (h: Hass | undefined, icon: SavedIconInput, baseUpdatedAt?: string): Promise<SavedIcon> =>
  call<{ icon: SavedIcon }>(h, { type: CMD.iconsSave, icon, ...(baseUpdatedAt ? { base_updated_at: baseUpdatedAt } : {}) }).then((r) => r.icon);

export const deleteIcon = (h: Hass | undefined, id: string): Promise<void> => call<unknown>(h, { type: CMD.iconsDelete, icon_id: id }).then(() => undefined);

/** A library id from a name: lower case words joined by dashes, at most 64 characters. */
export function slug(name: string): string {
  const s = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
    .replace(/-+$/, '');
  return LIBRARY_ID_RE.test(s) ? s : 'icon';
}

/** The first free id for `name`: lamp, lamp-2, lamp-3… */
export function freeId(name: string, taken: ReadonlySet<string>): string {
  const base = slug(name).slice(0, 60);
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}
