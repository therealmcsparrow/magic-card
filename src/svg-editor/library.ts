import { CMD, LIBRARY_ID_RE, type IconSummary, type SavedIcon, type SavedIconInput } from '../contracts/mcu-library';

/*
 * The editor's side of the Magic Card Utils library (mcu-library 1.0.0, WebSocket commands). Only the
 * editor calls these; cards never do. Errors are mapped to a few words the panel can show.
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

function fail(e: unknown): never {
  const code = (e as { code?: string })?.code ?? '';
  throw new LibraryError(
    code === 'unknown_command' ? 'missing' : code === 'unauthorized' ? 'readonly' : code === 'conflict' ? 'conflict' : code === 'library_full' ? 'full' : code === 'invalid_format' ? 'invalid' : 'unreachable',
  );
}

async function call<T>(hass: Hass | undefined, msg: Record<string, unknown>): Promise<T> {
  if (!hass?.callWS) throw new LibraryError('missing');
  try {
    return await hass.callWS<T>(msg);
  } catch (e) {
    return fail(e);
  }
}

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
