// Contract: entity colour values for slider colours. Version 1.0.0. Slider colour fields get the same "use entity
// colour" option as other colour fields, including `entity N%` and a colour from an entity attribute. Provider:
// src/utils/entity-color.ts (magic-card.js), new pure function entityPaint() below.

export const ENTITY_COLOUR_CONTRACT = '1.0.0';

/** Grammar of an entity colour value with an optional attribute (slider keys only). */
export const ENTITY_PAINT_RE = /^entity(?:\.([a-z0-9_]{1,64}))?(?:\s+(\d+(?:\.\d+)?)%)?$/;

/** Parsed value: attribute (absent = the state colour) and opacity 0-100. */
export interface EntityPaintValue {
  attr?: string;
  opacity: number;
}

/** Slider keys that accept the grammar (resolved by the slider module before rendering). */
export const ENTITY_PAINT_KEYS = ['slider_color', 'track_color', 'slider_color_to', 'thumb_border_color'] as const;

/**
 * src/utils/entity-color.ts. CSS for an entity colour value of `stateObj`; undefined when `value`
 * is not an entity value or gives no colour (the caller then falls back as for an unset key).
 */
export type EntityPaint = (value: unknown, stateObj: { entity_id: string; state: string; attributes?: Record<string, unknown> } | undefined) => string | undefined;
