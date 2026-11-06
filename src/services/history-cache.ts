import type { HomeAssistant } from '../types';

// Recorded history shared by everything that draws it (graphs module, sparkline value backgrounds):
// one cache per entity | hours | attribute, one in-flight fetch per key, refetched after 5 minutes.

/** One recorded value at a time (ms). */
export interface HistorySample {
  t: number;
  v: number;
}

export interface CachedHistory {
  samples: HistorySample[];
  timestamp: number;
  error?: boolean;
}

/** One state of HA's compressed history format (history/history_during_period). */
export interface CompressedState {
  s: string;
  a?: Record<string, unknown>;
  lu?: number;
  lc?: number;
}

/**
 * History per entity | hours | attribute (what was fetched), shared by every reader that shows it.
 * Not per module id: ids are position based and repeat across cards.
 */
const _historyCache = new Map<string, CachedHistory>();
/** In-flight fetches (per history key) and the readers waiting for each. */
const _pendingFetches = new Map<string, Set<() => void>>();

export const HISTORY_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Forget all fetched history (tests). */
export function clearHistoryCache(): void {
  _historyCache.clear();
  _pendingFetches.clear();
}

/** Keep a fetched history; drop the ones nobody refreshed for a while (edited or removed readers). */
function storeHistory(key: string, entry: CachedHistory): void {
  for (const [k, v] of _historyCache) if (entry.timestamp - v.timestamp > 2 * HISTORY_TTL_MS) _historyCache.delete(k);
  _historyCache.set(key, entry);
}

export const historyKey = (entityId: string, hours: number, attribute?: string) => `${entityId}|${hours}|${attribute || ''}`;

/**
 * The history request: the state alone is a minimal response without attributes; an attribute
 * needs every recorded state with its attributes (attribute changes are not "significant" and a
 * minimal response drops attributes after the first state).
 */
export function historyRequest(entityId: string, start: Date, end: Date, attribute?: string): Record<string, unknown> {
  return {
    type: 'history/history_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: [entityId],
    include_start_time_state: true,
    minimal_response: !attribute,
    no_attributes: !attribute,
    significant_changes_only: !attribute,
  };
}

/** Numeric samples from HA's compressed states (non-numeric states such as "unavailable" are gaps). */
export function parseHistory(states: CompressedState[], attribute: string | undefined, start: number): HistorySample[] {
  const out: HistorySample[] = [];
  for (const st of states) {
    const raw = attribute ? st.a?.[attribute] : st.s;
    const v = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
    if (!Number.isFinite(v)) continue;
    const sec = st.lu ?? st.lc;
    const t = typeof sec === 'number' && Number.isFinite(sec) ? Math.max(sec * 1000, start) : start;
    out.push({ t, v });
  }
  return out.sort((a, b) => a.t - b.t);
}

/**
 * `count` equal buckets between `start` and `end`: each is the average of its samples (at the
 * bucket's middle), a bucket without samples keeps the last value before it (the state did not
 * change). Buckets before the first sample are left out. `samples` sorted by time.
 */
export function bucketWindow(samples: HistorySample[], start: number, end: number, count: number): HistorySample[] {
  if (!(count >= 1) || !(end > start) || !samples.length) return [];
  return buckets(samples, start, end, (end - start) / Math.floor(count), Math.floor(count));
}

function buckets(samples: HistorySample[], start: number, end: number, size: number, n: number): HistorySample[] {
  const out: HistorySample[] = [];
  let i = 0;
  let last: number | undefined;
  for (let b = 0; b < n; b++) {
    const from = start + b * size;
    const to = b === n - 1 ? Infinity : from + size;
    let sum = 0;
    let k = 0;
    while (i < samples.length && samples[i].t < to) {
      if (samples[i].t >= from) {
        sum += samples[i].v;
        k++;
      }
      last = samples[i].v;
      i++;
    }
    const v = k ? sum / k : last;
    if (v !== undefined) out.push({ t: Math.min(from + size / 2, end), v });
  }
  return out;
}

/**
 * `points_per_hour` buckets between `start` and `end` (bucketWindow; the graphs module). The samples
 * unchanged without a rate.
 */
export function downsample(samples: HistorySample[], start: number, end: number, pointsPerHour: number): HistorySample[] {
  if (!(pointsPerHour > 0) || end <= start || !samples.length) return samples;
  const size = 3600_000 / pointsPerHour;
  return buckets(samples, start, end, size, Math.max(1, Math.ceil((end - start) / size)));
}

function fetchHistory(hass: HomeAssistant, key: string, entityId: string, hours: number, attribute: string | undefined, onDone?: () => void): void {
  const waiting = _pendingFetches.get(key);
  if (waiting) {
    if (onDone) waiting.add(onDone);
    return;
  }
  _pendingFetches.set(key, new Set(onDone ? [onDone] : []));

  const end = new Date();
  const start = new Date(end.getTime() - hours * 3600_000);
  Promise.resolve()
    .then(() => hass.callWS<Record<string, CompressedState[]>>(historyRequest(entityId, start, end, attribute)))
    .then((result) => {
      const states = (result && result[entityId]) || [];
      storeHistory(key, { samples: parseHistory(states, attribute, start.getTime()), timestamp: Date.now() });
    })
    .catch((err) => {
      console.warn('magic-card: failed to fetch history for', entityId, err);
      // a failed refetch keeps what was fetched before (still drawn), flagged with the error
      storeHistory(key, { samples: _historyCache.get(key)?.samples ?? [], timestamp: Date.now(), error: true });
    })
    .finally(() => {
      const callbacks = _pendingFetches.get(key);
      _pendingFetches.delete(key);
      callbacks?.forEach((cb) => cb());
    });
}

/**
 * The cached history of an entity (or one attribute) over the last `hours`, undefined until it
 * arrived. Starts a fetch when there is none or it is older than 5 minutes (one fetch per key, however
 * many readers ask); `onDone` runs once that fetch finished (re-render then).
 */
export function getHistory(
  hass: HomeAssistant,
  entityId: string,
  hours: number,
  attribute?: string,
  onDone?: () => void,
): CachedHistory | undefined {
  const key = historyKey(entityId, hours, attribute || undefined);
  const cached = _historyCache.get(key);
  const fresh = cached && Date.now() - cached.timestamp <= HISTORY_TTL_MS;
  if (!fresh) fetchHistory(hass, key, entityId, hours, attribute || undefined, onDone);
  return cached;
}

/**
 * The cached history of a key without fetching (stale or not): what an off-screen reader shows until
 * it is on screen again.
 */
export function peekHistory(entityId: string, hours: number, attribute?: string): CachedHistory | undefined {
  return _historyCache.get(historyKey(entityId, hours, attribute || undefined));
}
