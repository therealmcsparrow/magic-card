import { IMAGE_CMD, type ImageSummary } from '../contracts/mcu-library-images';
import { saveAnimation, type SaveInput, type Saved } from './save';
import type { LibraryHass } from './source';

// Counts the Magic Cards that show a library image, in the browser, so the save can say how many it changes.

export interface UseCount {
  count: number;
  /** False when a dashboard could not be read, so `count` is a minimum. */
  complete: boolean;
}

export type UseNotice = { kind: 'none' } | { kind: 'used' | 'at-least'; count: number } | { kind: 'unknown' };

const MAX_DASHBOARDS = 200;
const MAX_DEPTH = 32;
const MAX_NODES = 200_000;
const REF_BODY = /[A-Za-z0-9_-]/;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Whether the text names `mcu-image:<id>` as a whole id, not as the start of a longer one. */
function names(text: string, id: string): boolean {
  const ref = `mcu-image:${id}`;
  for (let at = text.indexOf(ref); at >= 0; at = text.indexOf(ref, at + 1)) {
    if (!REF_BODY.test(text.charAt(at + ref.length))) return true;
  }
  return false;
}

/** Magic Cards in a dashboard config that name the image; nested stacks and sections are walked, a card counts once. */
function countIn(config: unknown, id: string): number {
  let count = 0;
  let nodes = 0;
  const walk = (node: unknown, depth: number): void => {
    if (!isRecord(node) || depth > MAX_DEPTH || ++nodes > MAX_NODES) return;
    if (!Array.isArray(node) && node.type === 'custom:magic-card') {
      try {
        if (names(JSON.stringify(node), id)) count++;
      } catch {
        // an unserialisable card names nothing
      }
      return;
    }
    for (const child of Array.isArray(node) ? node : Object.values(node)) walk(child, depth + 1);
  };
  walk(config, 0);
  return count;
}

async function readDashboards(hass: LibraryHass): Promise<{ paths: (string | null)[]; complete: boolean }> {
  try {
    const rows = await hass.callWS<unknown>({ type: 'lovelace/dashboards/list' });
    const paths: (string | null)[] = [null];
    for (const row of Array.isArray(rows) ? rows : []) {
      if (isRecord(row) && typeof row.url_path === 'string' && row.mode !== 'yaml' && paths.length <= MAX_DASHBOARDS) paths.push(row.url_path);
    }
    return { paths, complete: true };
  } catch {
    return { paths: [null], complete: false };
  }
}

/** The count with whether every dashboard was read; never rejects. */
export async function countImageUseDetail(hass: LibraryHass, id: string): Promise<UseCount> {
  const { paths, complete } = await readDashboards(hass);
  const results = await Promise.all(
    paths.map(async (path) => {
      try {
        const config = await hass.callWS<unknown>({ type: 'lovelace/config', ...(path === null ? {} : { url_path: path }) });
        return { count: countIn(config, id), ok: true };
      } catch {
        return { count: 0, ok: false };
      }
    }),
  );
  return { count: results.reduce((n, r) => n + r.count, 0), complete: complete && results.every((r) => r.ok) };
}

/** How many Magic Cards show the image; a dashboard that cannot be read is skipped. */
export async function countImageUse(hass: LibraryHass, id: string): Promise<number> {
  return (await countImageUseDetail(hass, id)).count;
}

/** What to tell the user: nothing for none, a minimum when some dashboards were unreadable, unknown when nothing was found and some were unreadable. */
export function usageNotice(use: UseCount): UseNotice {
  if (use.count === 0) return use.complete ? { kind: 'none' } : { kind: 'unknown' };
  return { kind: use.complete ? 'used' : 'at-least', count: use.count };
}

export type ConfirmedSave = (Extract<Saved, { ok: true }> & { notice: UseNotice }) | Extract<Saved, { ok: false }> | { ok: false; reason: 'cancelled' };

/** Counts the uses, asks only when the notice has a count, and saves on a yes; a no sends nothing. A new image has no uses to count. */
export async function saveConfirmed(hass: LibraryHass, input: SaveInput, ask: (notice: UseNotice) => Promise<boolean>): Promise<ConfirmedSave> {
  const notice: UseNotice = input.isNew ? { kind: 'none' } : usageNotice(await countImageUseDetail(hass, input.id));
  if ((notice.kind === 'used' || notice.kind === 'at-least') && !(await ask(notice))) return { ok: false, reason: 'cancelled' };
  const r = await saveAnimation(hass, input);
  return r.ok ? { ...r, notice } : r;
}

/** The summed `bytes` of the library, or undefined when it cannot be read. */
export async function libraryImages(hass: LibraryHass): Promise<{ bytes: number }[] | undefined> {
  try {
    const r = await hass.callWS<{ images?: ImageSummary[] }>({ type: IMAGE_CMD.list });
    return Array.isArray(r?.images) ? r.images.map((i) => ({ bytes: i.bytes })) : undefined;
  } catch {
    return undefined;
  }
}
