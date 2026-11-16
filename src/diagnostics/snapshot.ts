// Builds the read-only setup snapshot (diagnostics 1.0.0) from what the page hands in. Pure: no DOM, no timers.
// Every read that can throw sits in its own try, so one bad value is only missing itself.
import {
  CONFIG_WALK_BUDGET,
  FONT_KEYS,
  LOOK_KEYS,
  NAME_REPLACED,
  UTILS_PROVIDER_API,
  VERSION_RE,
  type BuildSnapshot,
  type ChunkEntry,
  type ChunkState,
  type LookEntry,
  type LookKey,
  type SetupSnapshot,
  type SnapshotInput,
  type UtilsInfo,
} from '../contracts/diagnostics';

const isObject = (v: unknown): v is object => typeof v === 'object' && v !== null;

const compare = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const read = (target: object, key: string): unknown => {
  try {
    return (target as Record<string, unknown>)[key];
  } catch {
    return undefined;
  }
};

const ownKeys = (target: object): string[] => {
  try {
    return Object.keys(target);
  } catch {
    return [];
  }
};

const cleanName = (raw: string): string => raw.replace(NAME_REPLACED, ' ').trim();

const readVersion = (v: unknown): string | null => (typeof v === 'string' && VERSION_RE.test(v) ? v : null);

const readUtils = (utils: unknown): UtilsInfo => {
  if (!isObject(utils)) return { installed: false };
  if (read(utils, 'apiVersion') !== UTILS_PROVIDER_API) return { installed: true, version: null };
  const settings = read(utils, 'settings');
  if (!isObject(settings)) return { installed: true, version: null };
  return { installed: true, version: readVersion(read(settings, 'version')) };
};

/** Walks objects and arrays breadth first, at most CONFIG_WALK_BUDGET nodes, each node once. */
const readNames = (config: unknown): { looks: LookEntry[]; fonts: string[] } => {
  const looks = new Map<string, LookEntry>();
  const fonts = new Set<string>();
  if (!isObject(config)) return { looks: [], fonts: [] };
  const seen = new Set<object>([config]);
  const queue: object[] = [config];
  const lookKeys: readonly string[] = LOOK_KEYS;
  const fontKeys: readonly string[] = FONT_KEYS;
  let visited = 0;
  for (let i = 0; i < queue.length && visited < CONFIG_WALK_BUDGET; i++) {
    const node = queue[i];
    visited++;
    for (const key of ownKeys(node)) {
      const value = read(node, key);
      if (typeof value === 'string') {
        const isLook = lookKeys.indexOf(key) >= 0;
        if (!isLook && fontKeys.indexOf(key) < 0) continue;
        const name = cleanName(value);
        if (name === '') continue;
        if (isLook) looks.set(`${key}=${name}`, { key: key as LookKey, name });
        else fonts.add(name);
      } else if (isObject(value) && !seen.has(value)) {
        seen.add(value);
        queue.push(value);
      }
    }
  }
  const sortedKeys = Array.from(looks.keys()).sort(compare);
  return { looks: sortedKeys.map((k) => looks.get(k) as LookEntry), fonts: Array.from(fonts).sort(compare) };
};

const byName = (a: ChunkEntry, b: ChunkEntry): number => compare(a.name, b.name);

const readState = (input: SnapshotInput, name: string): ChunkState | 'idle' => {
  try {
    return input.chunkState(name);
  } catch {
    return 'idle';
  }
};

const isNeeded = (input: SnapshotInput, name: string): boolean => {
  try {
    return input.needs[name](input.config) === true;
  } catch {
    return false;
  }
};

const readFirstPaint = (input: SnapshotInput): ChunkEntry[] => {
  const out: ChunkEntry[] = [];
  if (!isObject(input.needs)) return out;
  for (const name of ownKeys(input.needs)) {
    if (!isNeeded(input, name)) continue;
    const state = readState(input, name);
    out.push({ name, state: state === 'idle' ? 'pending' : state });
  }
  return out.sort(byName);
};

const readNameList = (input: SnapshotInput): string[] => {
  try {
    return Array.isArray(input.onDemand) ? input.onDemand.slice() : [];
  } catch {
    return [];
  }
};

/** On-demand chunks the page has installed or failed; one already listed under first paint is not repeated. */
const readOnClick = (input: SnapshotInput, firstPaint: readonly ChunkEntry[]): ChunkEntry[] => {
  const out: ChunkEntry[] = [];
  const listed = firstPaint.map((c) => c.name);
  for (const name of readNameList(input)) {
    if (listed.indexOf(name) >= 0) continue;
    const state = readState(input, name);
    if (state !== 'idle') out.push({ name, state });
  }
  return out.sort(byName);
};

export const buildSnapshot: BuildSnapshot = (input: SnapshotInput): SetupSnapshot => {
  const { looks, fonts } = readNames(input.config);
  const firstPaint = readFirstPaint(input);
  return {
    card: readVersion(input.cardVersion),
    utils: readUtils(input.utils),
    looks,
    fonts,
    firstPaint,
    onClick: readOnClick(input, firstPaint),
    transport: input.secure === true ? 'secure' : input.secure === false ? 'not-secure' : null,
  };
};
