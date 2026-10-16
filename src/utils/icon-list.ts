/**
 * The searchable icon catalogue for the icon picker, built the way Home Assistant's own
 * ha-icon-picker builds it:
 * - MDI: HA's frontend serves the full list with keywords (tags + aliases) at
 *   `/static/mdi/iconList.json` (`[{ name, keywords }]`, the same file ha-icon-picker imports).
 *   When that is not reachable (another host, an old HA) a small built-in list of common icons is used.
 * - Third-party icon packs: `window.customIcons[prefix].getIconList()` (HACS packs such as
 *   hass-hue-icons, custom-brand-icons). Packs that only register `window.customIconsets[prefix]`
 *   have no list: their icons can still be typed as a full id (`prefix:name`).
 */

export interface IconListItem {
  /** Full icon id, `prefix:name`. */
  id: string;
  /** Readable name: "Lightbulb outline". */
  name: string;
  /** Pack prefix (`mdi`, `phu`…). */
  prefix: string;
  /** Lowercased search text: name parts + keywords. */
  search: string;
}

interface RawIcon {
  name: string;
  keywords?: string[];
}

interface CustomIconsWindow {
  customIcons?: Record<string, { getIconList?: () => Promise<RawIcon[]> | RawIcon[] } | undefined>;
  customIconsets?: Record<string, unknown>;
}

export const MDI_LIST_URL = '/static/mdi/iconList.json';

/** Common icons (name, keywords) used when HA's MDI list cannot be fetched. */
const FALLBACK_MDI: Array<[string, string]> = [
  ['home', 'house'], ['home-outline', 'house'], ['lightbulb', 'light bulb lamp'], ['lightbulb-outline', 'light bulb lamp'],
  ['lightbulb-group', 'lights'], ['lamp', 'light'], ['floor-lamp', 'light'], ['ceiling-light', 'lamp'], ['led-strip', 'light'],
  ['fan', 'ventilation air'], ['fan-off', 'ventilation'], ['air-conditioner', 'ac climate cooling'], ['air-purifier', 'filter'],
  ['air-humidifier', 'humidity'], ['thermometer', 'temperature'], ['thermostat', 'climate heating'], ['radiator', 'heating'],
  ['fire', 'flame heat'], ['snowflake', 'cold cool winter'], ['water', 'drop'], ['water-percent', 'humidity'],
  ['water-boiler', 'heater'], ['weather-sunny', 'sun'], ['weather-night', 'moon'], ['weather-cloudy', 'cloud'],
  ['weather-partly-cloudy', 'cloud sun'], ['weather-rainy', 'rain'], ['weather-pouring', 'rain'], ['weather-snowy', 'snow'],
  ['weather-windy', 'wind'], ['weather-lightning', 'storm thunder'], ['white-balance-sunny', 'sun brightness'],
  ['power', 'on off'], ['power-plug', 'socket outlet'], ['power-socket-eu', 'outlet'], ['flash', 'lightning energy'],
  ['lightning-bolt', 'energy electricity'], ['solar-power', 'sun energy panel'], ['battery', 'charge'], ['battery-charging', 'charge'],
  ['ev-station', 'car charger'], ['car', 'vehicle'], ['car-electric', 'vehicle ev'], ['garage', 'car'], ['garage-open', 'car door'],
  ['gate', 'fence'], ['door', 'entrance'], ['door-open', 'entrance'], ['door-closed', 'entrance'], ['window-closed', 'glass'],
  ['window-open', 'glass'], ['window-shutter', 'blind cover'], ['window-shutter-open', 'blind cover'], ['blinds', 'cover'],
  ['curtains', 'cover'], ['lock', 'secure'], ['lock-open', 'unlock'], ['key', 'access'], ['shield-home', 'alarm security'],
  ['alarm-light', 'siren'], ['bell', 'notification'], ['bell-ring', 'notification doorbell'], ['doorbell', 'bell'],
  ['cctv', 'camera surveillance'], ['camera', 'photo'], ['video', 'camera'], ['motion-sensor', 'presence pir'],
  ['run', 'motion person'], ['account', 'person user'], ['account-group', 'people users'], ['human', 'person'],
  ['sofa', 'couch living room'], ['bed', 'bedroom sleep'], ['bed-empty', 'bedroom'], ['silverware-fork-knife', 'kitchen dining'],
  ['stove', 'kitchen cooking'], ['fridge', 'refrigerator kitchen'], ['dishwasher', 'kitchen'], ['washing-machine', 'laundry'],
  ['tumble-dryer', 'laundry'], ['coffee', 'cup'], ['coffee-maker', 'kitchen'], ['microwave', 'kitchen'], ['toilet', 'bathroom wc'],
  ['shower', 'bathroom'], ['bathtub', 'bathroom'], ['robot-vacuum', 'cleaning'], ['robot', 'automation'], ['script-text', 'script'],
  ['palette', 'scene colour'], ['television', 'tv'], ['television-classic', 'tv'], ['cast', 'chromecast media'],
  ['speaker', 'audio sound'], ['speaker-wireless', 'audio'], ['music', 'note audio'], ['play', 'media'], ['pause', 'media'],
  ['stop', 'media'], ['skip-next', 'media'], ['skip-previous', 'media'], ['volume-high', 'sound'], ['volume-off', 'mute'],
  ['wifi', 'network wireless'], ['router-wireless', 'network'], ['lan', 'network'], ['server', 'computer'],
  ['laptop', 'computer'], ['monitor', 'screen display'], ['cellphone', 'phone mobile'], ['tablet', 'ipad'],
  ['gamepad-variant', 'game console'], ['printer', 'print'], ['flower', 'plant garden'], ['sprout', 'plant'],
  ['tree', 'garden'], ['grass', 'lawn garden'], ['sprinkler', 'irrigation garden'], ['pool', 'swim'], ['dog', 'pet'],
  ['cat', 'pet'], ['paw', 'pet'], ['trash-can', 'bin garbage'], ['delete', 'trash remove'], ['calendar', 'date'],
  ['clock-outline', 'time'], ['timer-outline', 'countdown'], ['alarm', 'clock'], ['chart-line', 'graph history'],
  ['gauge', 'meter'], ['information', 'info'], ['information-outline', 'info'], ['alert', 'warning'],
  ['alert-circle', 'warning error'], ['check', 'done ok'], ['check-circle', 'done ok'], ['close', 'cancel'],
  ['plus', 'add'], ['minus', 'remove'], ['cog', 'settings gear'], ['tune', 'settings'], ['menu', 'hamburger'],
  ['magnify', 'search'], ['heart', 'favourite love'], ['star', 'favourite'], ['map-marker', 'location'],
  ['earth', 'globe world'], ['sun-clock', 'sunrise sunset'], ['moon-waning-crescent', 'night'], ['toggle-switch', 'switch'],
  ['toggle-switch-off', 'switch'], ['ray-vertex', 'number'], ['format-list-bulleted', 'list select'],
  ['eye', 'sensor view'], ['emoticon-outline', 'smile face'], ['shape-outline', 'shape'], ['help-circle', 'question'],
];

/** "mdi:lightbulb-outline" -> "Lightbulb outline". */
export function iconDisplayName(id: string): string {
  const name = id.includes(':') ? id.slice(id.indexOf(':') + 1) : id;
  const words = name.split(/[-_\s]+/).filter(Boolean).join(' ');
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}

/** A full icon id the picker accepts as typed: `prefix:name`, no spaces. */
export function isIconId(value: string): boolean {
  return /^[a-z0-9_-]+:[a-z0-9_.-]+$/i.test(value.trim());
}

function toItem(prefix: string, raw: RawIcon): IconListItem | undefined {
  if (!raw || typeof raw.name !== 'string' || !raw.name) return undefined;
  const keywords = Array.isArray(raw.keywords) ? raw.keywords.filter((k) => typeof k === 'string') : [];
  return {
    id: `${prefix}:${raw.name}`,
    name: iconDisplayName(raw.name),
    prefix,
    search: `${prefix}:${raw.name} ${raw.name.replace(/-/g, ' ')} ${keywords.join(' ')}`.toLowerCase(),
  };
}

const iconWindow = (): CustomIconsWindow => (typeof window === 'undefined' ? {} : (window as unknown as CustomIconsWindow));

let mdiPromise: Promise<IconListItem[]> | undefined;
const packCache = new Map<string, IconListItem[]>();

function fallbackMdi(): IconListItem[] {
  return FALLBACK_MDI.map(([name, kw]) => toItem('mdi', { name, keywords: kw.split(' ') })!);
}

async function loadMdi(hassUrl?: (path?: string) => string): Promise<IconListItem[]> {
  if (!mdiPromise) {
    mdiPromise = (async () => {
      try {
        const res = await fetch(hassUrl ? hassUrl(MDI_LIST_URL) : MDI_LIST_URL);
        if (!res.ok) throw new Error(String(res.status));
        const raw = (await res.json()) as unknown;
        if (!Array.isArray(raw) || raw.length === 0) throw new Error('empty');
        return raw.map((r) => toItem('mdi', r as RawIcon)).filter((i): i is IconListItem => !!i);
      } catch {
        // Not served here (or offline): use the common icons, and try again on the next open.
        mdiPromise = undefined;
        return fallbackMdi();
      }
    })();
  }
  return mdiPromise;
}

/** Icons of the installed third-party packs that publish a list (re-read on every call: packs load late). */
async function loadPacks(): Promise<IconListItem[]> {
  const packs = iconWindow().customIcons ?? {};
  const lists = await Promise.all(
    Object.keys(packs).map(async (prefix) => {
      const cached = packCache.get(prefix);
      if (cached) return cached;
      const getIconList = packs[prefix]?.getIconList;
      if (typeof getIconList !== 'function') return [];
      try {
        const raw = await getIconList();
        const items = (Array.isArray(raw) ? raw : []).map((r) => toItem(prefix, r)).filter((i): i is IconListItem => !!i);
        packCache.set(prefix, items);
        return items;
      } catch {
        return [];
      }
    }),
  );
  return lists.flat();
}

/** Prefixes of the installed packs (listed or not), for the empty-state hint. */
export function installedIconPrefixes(): string[] {
  const w = iconWindow();
  return [...new Set([...Object.keys(w.customIcons ?? {}), ...Object.keys(w.customIconsets ?? {})])].sort();
}

/** Third-party pack icons first (they are the ones the user installed on purpose), then MDI. */
export async function loadIconList(hassUrl?: (path?: string) => string): Promise<IconListItem[]> {
  const [packs, mdi] = await Promise.all([loadPacks(), loadMdi(hassUrl)]);
  return [...packs, ...mdi];
}

/**
 * Filter + rank `items` for `query`: exact id/name, then id prefix, then name contains, then keyword.
 * Returns the total match count and at most `cap` items.
 */
export function searchIcons(items: IconListItem[], query: string, cap: number): { items: IconListItem[]; total: number } {
  const q = query.trim().toLowerCase();
  if (!q) return { items: items.slice(0, cap), total: items.length };
  const dashed = q.replace(/\s+/g, '-');
  const spaced = q.replace(/-/g, ' ');
  const ranked: Array<[number, number, IconListItem]> = [];
  items.forEach((it, i) => {
    const id = it.id.toLowerCase();
    const bare = id.slice(id.indexOf(':') + 1);
    let rank = -1;
    if (id === dashed || bare === dashed) rank = 0;
    else if (id.startsWith(dashed) || bare.startsWith(dashed)) rank = 1;
    else if (id.includes(dashed)) rank = 2;
    else if (it.search.includes(spaced)) rank = 3;
    if (rank >= 0) ranked.push([rank, i, it]);
  });
  ranked.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return { items: ranked.slice(0, cap).map((r) => r[2]), total: ranked.length };
}

/** Test hook: forget the cached lists. */
export function resetIconListCache(): void {
  mdiPromise = undefined;
  packCache.clear();
}
