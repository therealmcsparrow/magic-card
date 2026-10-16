import type { AnimationDoc, AnimationKeyframe } from './model';

/*
 * Animation studio v2 document fields (all optional; the document stays `version: 1`):
 * - rig: an icon split into named parts (subpaths of the source icon or own geometry), groups of
 *   parts and drawn shapes, in the icon's viewBox units (keyframes documents only);
 * - tracks: keyframes per target (a card part, an icon part / group / shape); the top-level
 *   `keyframes` stay the Element / Icon track (keyframes documents only);
 * - clips: per-state choice of what plays (any kind);
 * - bindings: an entity value driving a property of a target (keyframes documents only).
 * A 0.0.32 card drops these fields and plays the base animation.
 *
 * This file holds the types and the small helpers the card bundle needs (model.ts re-exports it);
 * the validators live in model-v2.ts (studio bundle and the lazy runtime chunk only, to keep
 * magic-card.js small). Import from model-v2.ts (it re-exports everything here) or model.ts.
 */

export type TargetRef = 'element' | 'icon' | 'name' | 'state' | 'background' | `part:${string}` | `group:${string}` | `shape:${string}`;

export interface RigPart {
  id: string;
  name: string;
  /** Subpath indices of the source icon (auto-split pieces). */
  from?: number[];
  /** Own geometry: SVG element markup (a drawn or imported shape); sanitised when rendered. */
  svg?: string;
  /** Pivot in icon viewBox units (default: the part's bbox centre). */
  origin?: [number, number];
}

export interface RigGroup {
  id: string;
  name: string;
  /** Part ids. */
  parts: string[];
  origin?: [number, number];
}

export interface RigShape {
  id: string;
  name: string;
  /** Path data in icon viewBox units. */
  d: string;
  /** Safe CSS colour, `currentColor` or `entity`. */
  fill?: string;
  stroke?: string;
  stroke_width?: number;
  linecap?: 'round' | 'butt' | 'square';
  /** Drawn under the parts or over them. */
  layer: 'over' | 'under';
  origin?: [number, number];
}

export interface Rig {
  /** The icon the parts come from; none: the module's own icon. */
  icon?: string;
  /** An own SVG as the source (instead of `icon`). */
  svg?: string;
  parts: RigPart[];
  groups?: RigGroup[];
  shapes?: RigShape[];
}

export interface Track {
  target: TargetRef;
  keyframes: AnimationKeyframe[];
  /** transform-origin of the target (card parts); icon parts use their rig origin. */
  origin?: string;
  /** Motion path of the target in its own units (viewBox units for icon parts); wins over x / y. */
  path?: { d: string; follow_rotation?: boolean };
}

export type ClipWhen = { state: string } | { state_not: string } | { entity_on: boolean } | { above: number } | { below: number };

export interface Clip {
  when: ClipWhen;
  /** 'self' (this document's own timeline) | 'none' | a preset id | custom:<id> */
  animation: string;
  transition?: 'cut' | 'crossfade' | 'finish';
}

export type BindProperty = 'rotate' | 'x' | 'y' | 'scale' | 'opacity' | 'draw' | 'color_mix' | 'speed' | 'rotate_speed';

export interface Binding {
  target: TargetRef;
  property: BindProperty;
  input: { attribute?: string; min: number; max: number };
  /** Numbers, or colours for color_mix. */
  output: [number, number] | [string, string];
  /** s of CSS transition. */
  smoothing?: number;
}

/** The timeline lanes (keyframes-utils LANES ids, same order). */
export const LANE_IDS = ['x', 'y', 'scale', 'scale_x', 'scale_y', 'rotate', 'skew', 'opacity', 'color', 'background', 'shadow', 'blur', 'radius', 'filter'] as const;
export type LaneId = (typeof LANE_IDS)[number];
/** Lanes that may hold a per-lane easing: the timeline lanes plus the v2 part lanes. */
export const EASING_LANE_IDS = [...LANE_IDS, 'draw', 'stroke'] as const;
export type EasingLaneId = (typeof EASING_LANE_IDS)[number];

/**
 * The document has data only the v2 runtime chunk can play. Safe on unchecked data: without the v2
 * validator (the card bundle before the runtime chunk loads) these fields are kept as stored.
 */
export function docNeedsRuntime(doc: AnimationDoc): boolean {
  const some = (v: unknown): boolean => Array.isArray(v) && v.length > 0;
  const rig = doc.rig as Partial<Rig> | undefined;
  return some(doc.tracks) || some(doc.clips) || some(doc.bindings) || (!!rig && typeof rig === 'object' && (some(rig.parts) || some(rig.shapes)));
}
