import type { LayerAnchor, LayerConfig, Placement, ScrimConfig, ScrimStyle } from '../../contracts/layer-placement';
import type { LayerEditorContext } from '../../contracts/layer-editor';
import type { CardModule, MagicCardConfig } from '../../types';
import { isRunnableAction } from '../../utils/actions';
import { childSlots, descendantAt } from '../../utils/module-path';
import { toYaml } from '../../utils/yaml-utils';
import { moduleDisplayName, moduleLabel, modulePathAttr, moduleSelection, type ModuleSelection } from '../studio/selection';

/*
 * Pure model of the Placement and Layer groups. The controls write the
 * contract keys (layer-placement 1.0.0) and nothing else: `placement` and `layer` on the module, never
 * `design`, never a preset name. Nothing here mutates its input.
 */

export const PLACEMENTS: readonly Placement[] = ['flow', 'background', 'overlay'];
const ANCHORS = new Set<string>(['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']);

export const isAnchor = (v: unknown): v is LayerAnchor => typeof v === 'string' && ANCHORS.has(v);

/** The module's placement; anything but background / overlay reads as flow, as the render does. */
export function placementOf(mod: CardModule): Placement {
  const p = mod.placement;
  return p === 'background' || p === 'overlay' ? p : 'flow';
}

/** video-bg without a `placement` key: it sits behind its siblings by its own rule; the editor shows "Automatic". */
export function isAutomatic(mod: CardModule): boolean {
  return mod.type === 'video-bg' && mod.placement === undefined;
}

export function layerOf(mod: CardModule): LayerConfig {
  const l = mod.layer;
  return l && typeof l === 'object' && !Array.isArray(l) ? (l as LayerConfig) : {};
}

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const clean = (layer: LayerConfig): LayerConfig | undefined => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(layer)) if (v !== undefined && !FORBIDDEN_KEYS.has(k)) out[k] = v;
  return Object.keys(out).length ? (out as LayerConfig) : undefined;
};

function withLayer(mod: CardModule, layer: LayerConfig | undefined): CardModule {
  const next = { ...mod } as CardModule;
  if (layer) next.layer = layer;
  else delete next.layer;
  return next;
}

/** Set the placement. "Normal" removes the key, except on video-bg where it writes `flow` so it stays a normal block. */
export function setPlacement(mod: CardModule, placement: Placement): CardModule {
  const layer = { ...layerOf(mod) };
  const next = { ...mod } as CardModule;
  if (placement === 'flow') {
    if (mod.type === 'video-bg') next.placement = 'flow';
    else delete next.placement;
    return withLayer(next, clean(layer));
  }
  next.placement = placement;
  if (placement === 'overlay') {
    delete layer.fill;
    layer.anchor = isAnchor(layer.anchor) ? layer.anchor : 'top-left';
    // keep the keys in a readable order: anchor first
    const { anchor, ...rest } = layer;
    return withLayer(next, clean({ anchor, ...rest }));
  }
  delete layer.anchor;
  delete layer.offset_x;
  delete layer.offset_y;
  return withLayer(next, clean(layer));
}

/** Change layer keys; undefined removes a key and an empty layer disappears. */
export function patchLayer(mod: CardModule, patch: Partial<LayerConfig>): CardModule {
  return withLayer(mod, clean({ ...layerOf(mod), ...patch }));
}

// ── scrim ("Darken behind text") ──

export const SCRIM_DEFAULT: Required<Pick<ScrimConfig, 'style' | 'strength'>> = { style: 'bottom', strength: 60 };
export const SCRIM_STYLES: readonly ScrimStyle[] = ['dim', 'bottom', 'top', 'left', 'right'];

/** Strength chips: the white-text-on-white worst case with black darkening. */
export const SCRIM_PRESETS = [
  { id: 'light', strength: 25 },
  { id: 'medium', strength: 45 },
  { id: 'strong', strength: 60 },
  { id: 'very-strong', strength: 75 },
] as const;

/** tint: not for text; large: 3:1 (large text only); readable: 4.5:1 or better. */
export function scrimLabel(strength: number): 'tint' | 'large' | 'readable' {
  if (strength >= 60) return 'readable';
  if (strength >= 45) return 'large';
  return 'tint';
}

export const clampStrength = (n: number): number => Math.max(0, Math.min(90, Math.round(Number.isFinite(n) ? n : SCRIM_DEFAULT.strength)));

export function patchScrim(mod: CardModule, change: 'on' | 'off' | Partial<ScrimConfig>): CardModule {
  const layer = layerOf(mod);
  if (change === 'off') return withLayer(mod, clean({ ...layer, scrim: undefined }));
  if (change === 'on') return withLayer(mod, clean({ ...layer, scrim: layer.scrim ?? { ...SCRIM_DEFAULT } }));
  const scrim: ScrimConfig = { ...(layer.scrim ?? SCRIM_DEFAULT), ...change };
  if (change.strength !== undefined) scrim.strength = clampStrength(change.strength);
  for (const k of Object.keys(scrim) as Array<keyof ScrimConfig>) if (scrim[k] === undefined) delete scrim[k];
  return withLayer(mod, clean({ ...layer, scrim }));
}

// ── offsets ──

export type OffsetAxis = 'x' | 'y';

/** An edge axis is measured from the container edge (0 or more); a centred axis is signed. */
export function axisKind(anchor: LayerAnchor, axis: OffsetAxis): 'edge' | 'centre' {
  if (axis === 'x') return anchor.includes('left') || anchor.includes('right') ? 'edge' : 'centre';
  return anchor.includes('top') || anchor.includes('bottom') ? 'edge' : 'centre';
}

/** Which side the distance is measured from. */
export function offsetSide(anchor: LayerAnchor, axis: OffsetAxis): 'left' | 'right' | 'top' | 'bottom' | 'centre' {
  if (axisKind(anchor, axis) === 'centre') return 'centre';
  if (axis === 'x') return anchor.includes('left') ? 'left' : 'right';
  return anchor.includes('top') ? 'top' : 'bottom';
}

const OFFSET_RE = /^-?\d{1,4}(\.\d{1,2})?(px|%)$/;

/** Why a typed offset is wrong; the editor shows the sentence and never clamps silently. */
export function offsetError(value: string, anchor: LayerAnchor, axis: OffsetAxis): 'format' | 'negative' | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (!OFFSET_RE.test(v)) return 'format';
  if (v.startsWith('-') && axisKind(anchor, axis) === 'edge') return 'negative';
  return undefined;
}

// ── order ──

/** Position counted from the front (1 = top layer). Later in config = in front. */
export function frontNumber(rank: { index: number; count: number }): number {
  return rank.count - rank.index;
}

// ── actions and click-through ──

/** Any of tap / hold / double tap would run (the module's own entity for toggle / more-info). */
export function hasModuleAction(mod: CardModule): boolean {
  const a = mod.actions as { tap_action?: never; hold_action?: never; double_tap_action?: never } | undefined;
  const entity = typeof mod.entity === 'string' ? mod.entity : undefined;
  return [a?.tap_action, a?.hold_action, a?.double_tap_action].some((x) => isRunnableAction(x, entity));
}

/** The runtime default: background passes clicks; an overlay does when it has no action. */
export function clickThroughDefault(mod: CardModule): boolean {
  return placementOf(mod) === 'overlay' ? !hasModuleAction(mod) : true;
}

export function effectiveClickThrough(mod: CardModule): boolean {
  const v = layerOf(mod).click_through;
  return typeof v === 'boolean' ? v : clickThroughDefault(mod);
}

// ── YAML disclosure ──

export function layerYaml(mod: CardModule): string {
  const out: Record<string, unknown> = {};
  if (mod.placement !== undefined) out.placement = mod.placement;
  if (mod.layer !== undefined && placementOf(mod) !== 'flow') out.layer = mod.layer;
  return Object.keys(out).length ? toYaml(out).trimEnd() : '';
}

// ── reorder ──

export type MoveTo = 'front' | 'forward' | 'backward' | 'back';

/**
 * The config index a layered module moves to: among the modules of the same placement, one step toward
 * the front (later in config), one toward the back, or to an end. Undefined when it cannot move.
 */
export function reorderTarget(list: readonly CardModule[], index: number, to: MoveTo): number | undefined {
  const self = list[index];
  if (!self) return undefined;
  const p = placementOf(self);
  const same: number[] = [];
  list.forEach((m, i) => {
    if (placementOf(m) === p) same.push(i);
  });
  const at = same.indexOf(index);
  const pos = to === 'front' ? same.length - 1 : to === 'back' ? 0 : to === 'forward' ? at + 1 : at - 1;
  if (pos < 0 || pos >= same.length || pos === at) return undefined;
  return same[pos];
}

// ── context for the inspector ──

export type { LayerEditorContext };

export function moduleName(mod: CardModule): string {
  const own = typeof mod.editor_name === 'string' && mod.editor_name.trim();
  if (own) return own;
  const label = moduleLabel(mod);
  const name = moduleDisplayName(mod);
  return label ? `${name} · ${label}` : name;
}

const isFlow = (m: CardModule): boolean => placementOf(m) === 'flow' && !isAutomatic(m);

/** The module list holding the selection, with a function from list index to data-mc-path. */
export function containerOf(config: MagicCardConfig, sel: ModuleSelection): { list: CardModule[]; index: number; parent?: CardModule; pathOf: (i: number) => string } | undefined {
  const child = sel.child;
  if (!child?.length) {
    const list = config.rows?.[sel.row]?.columns?.[sel.col]?.modules;
    if (!Array.isArray(list)) return undefined;
    return { list, index: sel.module, pathOf: (i) => modulePathAttr(moduleSelection(sel.row, sel.col, i)) };
  }
  const top = config.rows?.[sel.row]?.columns?.[sel.col]?.modules?.[sel.module];
  const parent = descendantAt(top, child.slice(0, -1));
  const last = child[child.length - 1];
  const list = childSlots(parent)?.[last.slot];
  if (!list || !parent) return undefined;
  return {
    list, index: last.index, parent,
    pathOf: (i) => modulePathAttr(moduleSelection(sel.row, sel.col, sel.module, [...child.slice(0, -1), { slot: last.slot, index: i }])),
  };
}

export function layerContext(config: MagicCardConfig, sel: ModuleSelection): LayerEditorContext {
  const found = containerOf(config, sel);
  const self = found?.list[found.index];
  const placement = self ? placementOf(self) : 'flow';
  const list = found?.list ?? [];
  const siblings = list.filter((m, i) => i !== found?.index && isFlow(m)).length;
  const same = list.map((m, i) => ({ m, i })).filter(({ m }) => placementOf(m) === placement && !(placement === 'flow'));
  const at = same.findIndex(({ i }) => i === found?.index);
  const others = list.flatMap((m, i) => (i !== found?.index && isFlow(m) && hasModuleAction(m) ? [{ path: found!.pathOf(i), name: moduleName(m) }] : []));
  return {
    siblings,
    // a card grid column, or a column of a row module
    canHoist: !sel.child?.length || found?.parent?.type === 'row',
    ...(at >= 0 ? { rank: { index: at, count: same.length } } : {}),
    path: modulePathAttr(sel),
    name: self ? moduleName(self) : '',
    others,
  };
}
