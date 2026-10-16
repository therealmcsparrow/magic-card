import type { HassEntity, HomeAssistant } from '../types';
import { numberLocale } from './locale-format';

/** One part of a formatted value, like HA's formatEntityStateToParts (value / unit / literal). */
interface ValuePart {
  type: string;
  value: string;
}

type PartsHass = HomeAssistant & {
  formatEntityStateToParts?: (stateObj: HassEntity, state?: string) => ValuePart[];
  formatEntityAttributeValueToParts?: (stateObj: HassEntity, attribute: string, value?: unknown) => ValuePart[];
  formatEntityName?: (stateObj: HassEntity) => string | undefined;
};

/** A state or attribute value as HA shows it, split into the number / text and its unit. */
export interface FormattedValue {
  /** The value without its unit ("21.4", "On", "Partly cloudy"). */
  value: string;
  /** Its unit ("°C", "%"), '' when it has none. */
  unit: string;
  /** Value and unit as HA writes them ("21.4 °C", "45 %"). */
  text: string;
}

const UNAVAILABLE = new Set(['unavailable', 'unknown']);

/** The entity (or its attribute) has no value: unavailable / unknown / missing attribute. */
export function isUnavailable(stateObj: HassEntity | undefined, attribute?: string): boolean {
  if (!stateObj) return true;
  if (attribute) return stateObj.attributes?.[attribute] === undefined || stateObj.attributes[attribute] === null;
  return UNAVAILABLE.has(stateObj.state);
}

/** The raw state or attribute as a finite number, else undefined ("on", "unavailable", missing). */
export function entityNumber(stateObj: HassEntity | undefined, attribute?: string): number | undefined {
  if (!stateObj) return undefined;
  const raw = attribute ? stateObj.attributes?.[attribute] : stateObj.state;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : undefined;
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/** A number with exactly `decimals` decimals in the user's number format. */
export function formatFixed(hass: HomeAssistant | undefined, value: number, decimals: number): string {
  const d = Math.max(0, Math.min(10, Math.round(decimals)));
  const opts: Intl.NumberFormatOptions = { minimumFractionDigits: d, maximumFractionDigits: d };
  if (hass?.locale?.number_format === 'none') opts.useGrouping = false;
  try {
    return new Intl.NumberFormat(hass ? numberLocale(hass) : undefined, opts).format(value);
  } catch {
    return value.toFixed(d);
  }
}

/** Value + unit the way HA joins them: no space before % and °, one space otherwise. */
export function joinUnit(value: string, unit: string): string {
  if (!unit) return value;
  return /^(%|°)$/.test(unit) ? `${value}${unit}` : `${value} ${unit}`;
}

function fromParts(parts: ValuePart[]): FormattedValue {
  const unit = parts.filter((p) => p.type === 'unit').map((p) => p.value).join('');
  const value = parts.filter((p) => p.type === 'value').map((p) => p.value).join('');
  return { value: value || parts.filter((p) => p.type !== 'unit').map((p) => p.value).join('').trim(), unit, text: parts.map((p) => p.value).join('') };
}

/**
 * The entity's state (or one attribute) formatted by Home Assistant: localised, with its unit and
 * display precision. Uses HA's ...ToParts formatters when present to split off the unit; older HA
 * (and the harness) get the unit stripped from the end of the formatted text. `decimals` rounds a
 * numeric value to that many decimals (unit kept).
 */
export function formatEntityValue(
  hass: HomeAssistant | undefined,
  stateObj: HassEntity,
  attribute?: string,
  opts: { decimals?: number } = {},
): FormattedValue {
  const h = hass as PartsHass | undefined;
  let out: FormattedValue | undefined;
  try {
    const parts = attribute
      ? h?.formatEntityAttributeValueToParts?.(stateObj, attribute)
      : h?.formatEntityStateToParts?.(stateObj);
    if (Array.isArray(parts) && parts.length) out = fromParts(parts);
  } catch {
    out = undefined;
  }
  if (!out) {
    const raw = attribute ? stateObj.attributes?.[attribute] : stateObj.state;
    let text: string | undefined;
    try {
      text = attribute ? h?.formatEntityAttributeValue?.(stateObj, attribute) : h?.formatEntityState?.(stateObj);
    } catch {
      text = undefined;
    }
    const ownUnit = attribute ? '' : String(stateObj.attributes?.unit_of_measurement ?? '');
    if (text === undefined || text === null) {
      const v = raw === undefined || raw === null ? '' : typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
      out = { value: v, unit: ownUnit, text: joinUnit(v, ownUnit) };
    } else if (ownUnit && text.endsWith(ownUnit)) {
      out = { value: text.slice(0, -ownUnit.length).trimEnd(), unit: ownUnit, text };
    } else {
      out = { value: text, unit: '', text };
    }
  }
  const n = opts.decimals !== undefined && opts.decimals !== null && Number.isFinite(Number(opts.decimals))
    ? entityNumber(stateObj, attribute)
    : undefined;
  if (n !== undefined) {
    const value = formatFixed(hass, n, Number(opts.decimals));
    out = { value, unit: out.unit, text: joinUnit(value, out.unit) };
  }
  return out;
}

/** The entity's display name: HA's formatEntityName when present, else friendly_name, else the id. */
export function entityDisplayName(hass: HomeAssistant | undefined, stateObj: HassEntity): string {
  const fmt = (hass as PartsHass | undefined)?.formatEntityName;
  let name: unknown;
  try {
    name = fmt?.(stateObj);
  } catch {
    name = undefined;
  }
  name = name || stateObj.attributes?.friendly_name;
  return typeof name === 'string' && name ? name : stateObj.entity_id;
}
