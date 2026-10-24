import { IMAGE_MAX_GET_IDS, IMAGE_RETRY_MAX_MS, IMAGE_RETRY_MS, type SanitizedImage } from '../contracts/svg-image';
import { IMAGE_CMD, type SavedImage } from '../contracts/mcu-library-images';
import { LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library.needs';
import { heavyStep } from './frames';
import { parseImage, serializeImage, templateOf } from './sanitize';

/*
 * The image client: one copy per page. Reads library images through the card's own websocket (images_get, batched per
 * animation frame), keeps them in page memory only (one entry per id and updated_at), and follows the library: provider
 * events, reconnects, and a quiet retry with back-off for items that are missing.
 */

type CallWS = (msg: Record<string, unknown>) => Promise<unknown>;
interface Connection {
  addEventListener(type: string, cb: () => void): void;
  removeEventListener(type: string, cb: () => void): void;
}

/** A drawing that passed the sanitiser, kept as an inert template. */
export interface ImageEntry {
  id: string;
  updatedAt: string;
  saved: SavedImage;
  template: HTMLTemplateElement;
  viewBox: string;
  ids: string[];
  stripped: string[];
  bytes: number;
}
export type MissingWhy = 'unknown' | 'deleted' | 'unavailable' | 'refused';
export type LoadResult = { entry: ImageEntry } | { missing: MissingWhy };

interface Miss {
  why: MissingWhy;
  delay: number;
  timer?: ReturnType<typeof setTimeout>;
}

const cache = new Map<string, ImageEntry>();
const misses = new Map<string, Miss>();
/** The wait of a retry in progress, so the next miss doubles it. */
const carried = new Map<string, number>();
const inflight = new Map<string, Promise<LoadResult>>();
const waiting = new Map<string, (r: LoadResult) => void>();
const watchers = new Map<string, Set<() => void>>();
const connections = new WeakSet<object>();
const readers = new Map<object, () => void>();
let latestWS: CallWS | undefined;
let flushing = false;
let eventsBound = false;
let epoch = 0;

const codeOf = (e: unknown): string | undefined => (e && typeof e === 'object' ? (e as { code?: string }).code : undefined);
const stopsRetry = (e: unknown): boolean => ['unknown_command', 'unauthorized'].includes(codeOf(e) ?? '');

function notify(id: string): void {
  for (const cb of [...(watchers.get(id) ?? [])]) cb();
}

/** Forget everything known about the ids (all when empty) and tell their watchers. */
function drop(ids: string[]): void {
  const all = !ids.length;
  const list = all ? [...new Set([...cache.keys(), ...misses.keys(), ...watchers.keys()])] : ids;
  for (const id of list) {
    cache.delete(id);
    clearMiss(id);
    inflight.delete(id);
    notify(id);
  }
}

function clearMiss(id: string): void {
  const m = misses.get(id);
  if (m?.timer) clearTimeout(m.timer);
  misses.delete(id);
}

function libraryChanged(e: Event): void {
  const d = (e as CustomEvent<{ kind?: string; ids?: string[] }>).detail;
  if (d?.kind === 'images') drop(d.ids ?? []);
}

function bind(connection: Connection | undefined): void {
  if (!eventsBound && typeof window !== 'undefined') {
    eventsBound = true;
    window.addEventListener(LIBRARY_CHANGED_EVENT, libraryChanged);
  }
  if (!connection || connections.has(connection)) return;
  connections.add(connection);
  const onReady = (): void => void reconnected();
  readers.set(connection, onReady);
  connection.addEventListener('ready', onReady);
}

/** After a reconnect: one images_list, then refresh only what changed (and wake what stopped). */
async function reconnected(): Promise<void> {
  const ws = latestWS;
  if (!ws) return;
  let listed: Map<string, string>;
  try {
    listed = await list(ws);
  } catch {
    return;
  }
  for (const [id, entry] of [...cache]) if (listed.get(id) !== entry.updatedAt) drop([id]);
  for (const [id, m] of [...misses]) if (m.why === 'unavailable' || (listed.has(id) && m.why !== 'unknown')) drop([id]);
}

async function list(ws: CallWS): Promise<Map<string, string>> {
  const r = (await ws({ type: IMAGE_CMD.list })) as { images?: Array<{ id: string; updated_at: string }> };
  return new Map((r.images ?? []).map((i) => [i.id, i.updated_at]));
}

// ── retry ──

function startMiss(id: string, why: MissingWhy): void {
  const old = misses.get(id);
  if (old?.timer) clearTimeout(old.timer);
  const prev = carried.get(id) ?? old?.delay;
  carried.delete(id);
  const m: Miss = { why, delay: prev ? Math.min(prev * 2, IMAGE_RETRY_MAX_MS) : IMAGE_RETRY_MS };
  misses.set(id, m);
  if (why === 'unknown') arm(id, m);
}

/** The retry timer lives only while something watches the id. */
function arm(id: string, m: Miss): void {
  if (m.timer || m.why !== 'unknown' || !watchers.get(id)?.size) return;
  const mine = epoch;
  m.timer = setTimeout(() => {
    m.timer = undefined;
    if (mine === epoch) void retry(id, m);
  }, m.delay);
}

async function retry(id: string, m: Miss): Promise<void> {
  const ws = latestWS;
  if (!ws || misses.get(id) !== m) return;
  try {
    const listed = await list(ws);
    if (misses.get(id) !== m) return;
    if (!listed.has(id)) {
      m.why = 'deleted';
      return;
    }
    cache.delete(id);
    carried.set(id, m.delay);
    misses.delete(id);
    const r = await request(id, ws);
    if ('entry' in r) notify(id);
  } catch (e) {
    if (misses.get(id) !== m) return;
    if (stopsRetry(e)) m.why = 'unavailable';
    else {
      m.delay = Math.min(m.delay * 2, IMAGE_RETRY_MAX_MS);
      arm(id, m);
    }
  }
}

// ── reading ──

function settle(id: string, r: LoadResult): void {
  const done = waiting.get(id);
  waiting.delete(id);
  inflight.delete(id);
  done?.(r);
}

function accept(id: string, saved: SavedImage | undefined): void {
  if (!saved) {
    startMiss(id, 'unknown');
    settle(id, { missing: 'unknown' });
    return;
  }
  const parsed = parseImage(saved.svg);
  if ('error' in parsed) {
    startMiss(id, 'refused');
    settle(id, { missing: 'refused' });
    return;
  }
  const entry: ImageEntry = {
    id,
    updatedAt: saved.updated_at,
    saved,
    template: templateOf(parsed.root),
    viewBox: parsed.viewBox,
    ids: parsed.ids,
    stripped: parsed.stripped,
    bytes: parsed.bytes,
  };
  cache.set(id, entry);
  clearMiss(id);
  settle(id, { entry });
}

function failed(ids: string[], e: unknown): void {
  const why: MissingWhy = stopsRetry(e) ? 'unavailable' : 'unknown';
  for (const id of ids) {
    startMiss(id, why);
    settle(id, { missing: why });
  }
}

function flush(): void {
  flushing = false;
  const ws = latestWS;
  const ids = [...waiting.keys()];
  if (!ws || !ids.length) return;
  for (let i = 0; i < ids.length; i += IMAGE_MAX_GET_IDS) {
    const batch = ids.slice(i, i + IMAGE_MAX_GET_IDS);
    ws({ type: IMAGE_CMD.get, ids: batch }).then(
      (r) => {
        const images = (r as { images?: SavedImage[] } | undefined)?.images ?? [];
        // each drawing is sanitised in its own frame, after the card has painted
        for (const id of batch) heavyStep(() => accept(id, images.find((x) => x?.id === id)));
      },
      (e) => failed(batch, e),
    );
  }
}

function request(id: string, ws: CallWS): Promise<LoadResult> {
  latestWS = ws;
  const hit = cache.get(id);
  if (hit) return Promise.resolve({ entry: hit });
  const miss = misses.get(id);
  if (miss) {
    arm(id, miss);
    return Promise.resolve({ missing: miss.why });
  }
  const pending = inflight.get(id);
  if (pending) return pending;
  const p = new Promise<LoadResult>((resolve) => waiting.set(id, resolve));
  inflight.set(id, p);
  if (!flushing) {
    flushing = true;
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(flush);
    else setTimeout(flush, 16);
  }
  return p;
}

/** One library item: from page memory, else read with the other ids asked for in the same frame. */
export function loadImage(id: string, ws: CallWS, connection?: Connection): Promise<LoadResult> {
  bind(connection);
  return request(id, ws);
}

/** Calls `cb` when the id was dropped, refreshed or woken; the caller loads it again. Returns stop(). */
export function watchImage(id: string, cb: () => void): () => void {
  let set = watchers.get(id);
  if (!set) watchers.set(id, (set = new Set()));
  set.add(cb);
  const m = misses.get(id);
  if (m) arm(id, m);
  return () => {
    const s = watchers.get(id);
    s?.delete(cb);
    if (s && !s.size) {
      watchers.delete(id);
      const miss = misses.get(id);
      if (miss?.timer) {
        clearTimeout(miss.timer);
        miss.timer = undefined;
      }
    }
  };
}

export function invalidateImages(ids: string[]): void {
  drop(ids);
}

/** The editors' view of an item: the saved record and its sanitised markup. */
export async function getImage(id: string, ws: CallWS): Promise<(SavedImage & { sanitized: SanitizedImage }) | undefined> {
  const r = await loadImage(id, ws);
  if (!('entry' in r)) return undefined;
  const { saved, template, viewBox, ids, stripped, bytes } = r.entry;
  const root = template.content.firstElementChild;
  return { ...saved, sanitized: { markup: root ? serializeImage(root) : '', viewBox, ids, stripped, bytes } };
}

export function __resetImageClientForTests(): void {
  epoch++;
  for (const m of misses.values()) if (m.timer) clearTimeout(m.timer);
  cache.clear();
  misses.clear();
  carried.clear();
  inflight.clear();
  waiting.clear();
  watchers.clear();
  latestWS = undefined;
  flushing = false;
  if (eventsBound) window.removeEventListener(LIBRARY_CHANGED_EVENT, libraryChanged);
  eventsBound = false;
  for (const [c, cb] of readers) (c as Connection).removeEventListener('ready', cb);
  readers.clear();
}
