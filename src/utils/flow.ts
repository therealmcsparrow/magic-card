import type { FlowConfig, FlowSide, HomeAssistant, MagicCardConfig } from '../types';
import { flowLookSlot } from '../card/flow-look-slot';
import { hasFlowLook } from '../contracts/flow-look.needs';
import type { FlowLookResolved } from '../contracts/flow-look';
import { safeColor } from './animation';
import { entityStateColor, parseEntityColor } from './entity-color';
import { entityNumber, formatEntityValue } from './entity-value';

/**
 * Flow resolver (pure): a flow's config + hass -> what the overlay draws (`<mc-flows>`).
 *
 * Value -> motion: `|v| <= min` (or no numeric value) is idle; above it a log curve
 * `t = clamp(log1p(|v| - min) / log1p(max - min), 0, 1)` moves the traversal time from `min_speed`
 * (slowest) to `speed` (fastest) and the width from `width` to `width x 2` (`scale_width`). Power
 * values span orders of magnitude, so small loads still move visibly. A negative value reverses the
 * direction when `reverse_negative` (grid import / export). No entity: always flowing at `speed`.
 */

export type Side = FlowSide;

export interface ResolvedFlow {
  id: string;
  from: string;
  to: string;
  fromSide: Side | 'auto';
  toSide: Side | 'auto';
  route: 'curve' | 'straight' | 'elbow';
  /** Flowing (dots move); false = idle. */
  active: boolean;
  /** 1: from -> to, -1: to -> from, 0: idle. */
  direction: 1 | -1 | 0;
  /** Seconds for one dot to travel the whole line. */
  speedS: number;
  /** Line width (px). */
  width: number;
  color: string;
  idleColor: string;
  dots: number;
  dotSize: number;
  glow: number;
  /** Formatted value label (label: value). */
  label?: string;
  /** Template to render as the label (label: template). */
  labelTemplate?: string;
  labelPosition: 'auto' | 'line' | 'side' | 'hidden';
  /** False: draw nothing (missing / same endpoints, or idle with show_when: flowing). */
  visible: boolean;
  layer: 'back' | 'front';
  /** The signed numeric value of the flow's entity; undefined without one (flow-look 1.0.0). */
  value?: number;
  /** The 0..1 log curve behind speed and width: 1 without an entity, 0 while idle. */
  t: number;
  /** flow-look: the resolved look, only while the flow has look keys and the chunk filled the slot. */
  look?: FlowLookResolved;
  /** flow-anchor 1.1.0: this end attaches to the box (YAML `box`, or no key on a wide look); absent: the icon. */
  fromBox?: true;
  toBox?: true;
  /** flow-look: gradient end colour (lifted from `look.colorTo`). */
  colorTo?: string;
}

export const FLOW_DEFAULTS = {
  route: 'curve',
  min: 0,
  max: 1000,
  reverse_negative: true,
  color: 'var(--primary-color)',
  /** Unset: the theme's secondary text colour, half transparent (reads on light and dark cards). */
  idle_color: 'color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)',
  width: 3,
  scale_width: true,
  dots: 3,
  dot_size: 6,
  speed: 2,
  min_speed: 8,
  glow: 0,
  label: 'none',
  label_position: 'auto',
  show_when: 'always',
  layer: 'back',
} as const;

const SIDES: ReadonlySet<string> = new Set(['top', 'right', 'bottom', 'left']);
const ROUTES: ReadonlySet<string> = new Set(['curve', 'straight', 'elbow']);
const LABEL_POSITIONS: ReadonlySet<string> = new Set(['auto', 'line', 'side', 'hidden']);
const MAX_DOTS = 8;
/** Limits that keep a typo from freezing the browser or swallowing the card. */
const MIN_SPEED_S = 0.2;
const MAX_WIDTH = 40;
const MAX_DOT_SIZE = 40;
const MAX_GLOW = 30;
const PERCENT_RE = /^(\d+(?:\.\d+)?)\s*%$/;

/** A finite number (numeric strings too), else undefined. */
function finite(v: unknown): number | undefined {
  const n = typeof v === 'string' && v.trim() ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
}

/** A finite number > 0, else `def`. */
function positive(v: unknown, def: number): number {
  const n = finite(v);
  return n !== undefined && n > 0 ? n : def;
}

function side(v: unknown): Side | 'auto' {
  return typeof v === 'string' && SIDES.has(v) ? (v as Side) : 'auto';
}

function mix(color: string, opacity: number): string {
  return opacity >= 100 ? color : `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
}

/** A configured colour: `entity` / `entity N%` (state colour of `entityId`), else a safe CSS colour. */
function resolveColor(value: unknown, hass: HomeAssistant | undefined, entityId: string | undefined, fallback: string): string {
  const ent = parseEntityColor(value);
  if (ent) {
    const own = entityId ? entityStateColor(hass?.states?.[entityId]) : undefined;
    return mix(own ?? fallback, ent.opacity);
  }
  return safeColor(value) ?? fallback;
}

/**
 * `index` (the flow's position in `flows`) names a flow that has no id and no endpoints; with
 * endpoints the fallback id is `from>to` (the card makes duplicates unique).
 */
export function resolveFlow(
  f: FlowConfig,
  hass: HomeAssistant | undefined,
  moduleEntity?: string,
  index = 0,
): ResolvedFlow {
  // Compared with |v|: a negative min would make 0 count as flowing.
  const min = Math.max(0, finite(f.min) ?? FLOW_DEFAULTS.min);
  const max = finite(f.max) ?? FLOW_DEFAULTS.max;
  const fast = Math.max(MIN_SPEED_S, positive(f.speed, FLOW_DEFAULTS.speed));
  const slow = Math.max(MIN_SPEED_S, positive(f.min_speed, FLOW_DEFAULTS.min_speed));
  const baseWidth = Math.min(MAX_WIDTH, positive(f.width, FLOW_DEFAULTS.width));
  const scaleWidth = f.scale_width ?? FLOW_DEFAULTS.scale_width;
  const reverse = f.reverse_negative ?? FLOW_DEFAULTS.reverse_negative;

  let active = true;
  let direction: 1 | -1 | 0 = 1;
  let speedS = fast;
  let width = baseWidth;
  let value: number | undefined;
  let t = 1;
  const stateObj = f.entity ? hass?.states?.[f.entity] : undefined;
  if (f.entity) {
    const v = entityNumber(stateObj, f.attribute || undefined);
    value = v;
    const mag = v === undefined ? undefined : Math.abs(v);
    if (mag === undefined || mag <= min) {
      active = false;
      direction = 0;
      speedS = slow;
      t = 0;
    } else {
      // max <= min: anything above min counts as max.
      t = max > min ? Math.min(1, Math.max(0, Math.log1p(mag - min) / Math.log1p(max - min))) : 1;
      speedS = slow + (fast - slow) * t;
      if (scaleWidth) width = baseWidth * (1 + t);
      direction = v! < 0 && reverse ? -1 : 1;
    }
  }

  const colorEntity = f.entity || moduleEntity;
  const color = resolveColor(f.color ?? FLOW_DEFAULTS.color, hass, colorEntity, FLOW_DEFAULTS.color);
  const idleRaw = typeof f.idle_color === 'string' && f.idle_color.trim() ? f.idle_color.trim() : '';
  const pct = idleRaw.match(PERCENT_RE);
  const idleColor = pct
    ? mix(color, Math.min(100, Number(pct[1])))
    : idleRaw
      ? resolveColor(idleRaw, hass, colorEntity, FLOW_DEFAULTS.idle_color)
      : FLOW_DEFAULTS.idle_color;

  const dotsRaw = finite(f.dots);
  const dots = dotsRaw === undefined ? FLOW_DEFAULTS.dots : Math.min(MAX_DOTS, Math.max(0, Math.round(dotsRaw)));
  const glowRaw = finite(f.glow);

  const label = f.label ?? FLOW_DEFAULTS.label;
  let labelText: string | undefined;
  let labelTemplate: string | undefined;
  if (label === 'value' && stateObj) labelText = formatEntityValue(hass, stateObj, f.attribute || undefined).text;
  else if (label === 'template' && typeof f.label_template === 'string' && f.label_template) labelTemplate = f.label_template;

  const from = typeof f.from === 'string' ? f.from : '';
  const to = typeof f.to === 'string' ? f.to : '';
  const showWhen = f.show_when ?? FLOW_DEFAULTS.show_when;
  const visible = !!from && !!to && from !== to && (showWhen !== 'flowing' || active);

  const id = typeof f.id === 'string' && f.id ? f.id : from && to ? `${from}>${to}` : `flow~${index}`;

  const out: ResolvedFlow = {
    id,
    from,
    to,
    fromSide: side(f.from_side),
    toSide: side(f.to_side),
    route: typeof f.route === 'string' && ROUTES.has(f.route) ? f.route : FLOW_DEFAULTS.route,
    active,
    direction,
    speedS,
    width,
    color,
    idleColor,
    dots,
    dotSize: Math.min(MAX_DOT_SIZE, positive(f.dot_size, FLOW_DEFAULTS.dot_size)),
    glow: glowRaw !== undefined && glowRaw > 0 ? Math.min(MAX_GLOW, glowRaw) : FLOW_DEFAULTS.glow,
    visible,
    layer: f.layer === 'front' ? 'front' : 'back',
    t,
    labelPosition:
      typeof f.label_position === 'string' && LABEL_POSITIONS.has(f.label_position) ? f.label_position : FLOW_DEFAULTS.label_position,
  };
  if (labelText !== undefined) out.label = labelText;
  if (labelTemplate !== undefined) out.labelTemplate = labelTemplate;
  if (value !== undefined) out.value = value;
  if (f.from_anchor === 'box') out.fromBox = true;
  if (f.to_anchor === 'box') out.toBox = true;
  // flow-look: only flows with look keys reach the chunk; an empty slot (loading, failed) = classic look.
  // The renderer gets `out` as `base` and may set its colour (value mode); colorTo is lifted for the overlay.
  const renderer = hasFlowLook(f) ? flowLookSlot.get() : undefined;
  if (renderer) {
    out.look = renderer.resolve(f, out, hass, colorEntity);
    if (out.look.colorTo !== undefined) out.colorTo = out.look.colorTo;
    // flow-anchor 1.1.0: a wide look defaults unset anchors to the box; an explicit icon wins.
    if (out.look.wide) {
      if (f.from_anchor !== 'icon') out.fromBox = true;
      if (f.to_anchor !== 'icon') out.toBox = true;
    }
  }
  return out;
}

/**
 * The key of every entry of `flows` as the card draws it (`data-flow` in `<mc-flows>`): its id, or
 * `from>to` / `flow~i` when it has none, made unique with `~i` when repeated. The editor uses the
 * same keys to select a flow from the canvas.
 */
export function flowKeys(flows: readonly unknown[] | undefined): string[] {
  const seen = new Set<string>();
  return (flows ?? []).map((raw, i) => {
    const f = (raw && typeof raw === 'object' ? raw : {}) as Partial<FlowConfig>;
    const from = typeof f.from === 'string' ? f.from : '';
    const to = typeof f.to === 'string' ? f.to : '';
    let id = typeof f.id === 'string' && f.id ? f.id : from && to ? `${from}>${to}` : `flow~${i}`;
    if (seen.has(id)) id = `${id}~${i}`;
    seen.add(id);
    return id;
  });
}

/** Module id -> the module's entity (flow `color: entity`), nested children included; per config. */
const moduleEntityCache = new WeakMap<object, Map<string, string | undefined>>();
export function flowModuleEntities(config: MagicCardConfig): Map<string, string | undefined> {
  let map = moduleEntityCache.get(config);
  if (map) return map;
  const out = new Map<string, string | undefined>();
  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const rec = node as Record<string, unknown>;
    if (typeof rec.id === 'string' && typeof rec.type === 'string' && !out.has(rec.id)) {
      out.set(rec.id, typeof rec.entity === 'string' && rec.entity !== 'none' ? rec.entity : undefined);
    }
    for (const key of ['columns', 'modules', 'tabs']) walk(rec[key]);
  };
  walk(config.rows);
  map = out;
  moduleEntityCache.set(config, map);
  return map;
}
