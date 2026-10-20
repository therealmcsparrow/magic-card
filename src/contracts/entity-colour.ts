/*
 * Contract: entity colour values for slider colours. Version 1.0.0 (Architect-owned). Task
 * flow-anchors-polish (CEO 2026-10-20: slider colour fields get the same "use entity colour" option
 * as other colour fields, including `entity N%` and a colour from an entity attribute).
 *
 * Provider: src/utils/entity-color.ts (magic-card.js), new pure function entityPaint() below.
 * Consumers: the slider Module (src/modules/controls/slider-module.ts, magic-card.js) for both its
 * own markup and the slider-look view; the colour picker (card-editor chunk) and the slider look
 * editor (look-editor chunk) write the values. The slider-look chunk never parses these values
 * (slider-look 1.1.0: the host hands it resolved colours).
 *
 * ── Grammar (a colour value string; whitespace trimmed) ──
 *   entity                 the slider entity's state colour (entityStateColor: a light's own rgb
 *                          when on, else HA's theme variable chain); 100 % opacity
 *   entity N%              the same at N % opacity (0-100, decimals allowed; > 100 = 100)
 *   entity.<attr>          a colour read from attribute <attr> of the slider entity
 *   entity.<attr> N%       the same at N % opacity
 * <attr> matches /^[a-z0-9_]{1,64}$/ (lower case, as HA writes attribute names). Regex:
 *   /^entity(?:\.([a-z0-9_]{1,64}))?(?:\s+(\d+(?:\.\d+)?)%)?$/
 * parseEntityColor() (design colours, rings, icons, flows) is unchanged and keeps accepting only
 * `entity` / `entity N%`; `entity.<attr>` is valid in the keys listed under Scope only.
 *
 * ── Attribute values (hostile input: the name comes from config, the value from hass) ──
 * Read with Object.prototype.hasOwnProperty.call(attributes, attr) (so `__proto__`, `constructor`
 * and inherited names give nothing). Accepted values only:
 *  - an array of at least 3 finite numbers: rgb, each rounded and clamped to 0-255 (rgb_color and
 *    any attribute holding [r, g, b]);
 *  - attr === 'hs_color' with at least 2 finite numbers: hue (mod 360) and saturation (0-100),
 *    converted by the existing hsToRgb (full value).
 * Anything else (string, object, NaN, missing entity, missing attribute, xy_color, a colour name):
 * no colour, the key is treated as unset (next source: design colour, then the default). Never
 * pass an attribute string into CSS; the output is built only from the clamped numbers.
 *
 * ── Output (entityPaint) ──
 * - Known rgb (an attribute, or a light's own rgb from entityStateColor): `rgb(r, g, b)` at 100 %,
 *   else `rgba(r, g, b, a)` with a = N / 100 rounded to 0.01. Computed in JS: no color-mix().
 * - A theme variable chain (entity state colour of a non-light or an off light) at 100 %: the
 *   chain as entityStateColor returns it. Below 100 %: color-mix(in srgb, <chain> N%, transparent)
 *   only when CSS.supports('color', 'color-mix(in srgb, red 50%, red)') (checked once, cached);
 *   without color-mix (Chromium 85-110) the chain at full opacity (documented; a var() inside an
 *   unsupported color-mix() would make the whole custom property invalid).
 * - Domain HA does not colour (entityStateColor undefined) with `entity` / `entity N%`: undefined.
 * - Not an entity value at all: undefined (caller uses the value as a plain colour as today).
 *
 * ── Scope (keys that accept the grammar) ──
 * slider module: slider_color, track_color (both renderings), slider_color_to and
 * thumb_border_color (slider-look keys). Resolved in slider-module.ts renderPreview with the
 * module's effective entity (`c.entity`, entity scope already applied), before either rendering:
 * the slider-look view receives a shallow copy of the config with those four keys replaced by the
 * resolved CSS (keys that resolve to nothing are deleted from the copy). use_entity_color keeps
 * its slider-look meaning and still wins over slider_color for a light.
 *
 * ── Editor ──
 * The shared colour picker (src/editor/components/color-picker.ts) gains `allowAttribute`
 * (boolean, default false; set for the four slider keys together with allowEntity). In entity mode
 * it shows a native select "Colour from": "State colour" (writes `entity`) and one option per
 * attribute of the current entity whose value passes the rules above (writes `entity.<attr>`),
 * plus the existing opacity field (appends ` N%`; 100 removes it). An `entity.<attr>` value whose
 * attribute is not there now stays selected, labelled with its name. Labelled, keyboard reachable,
 * 3:1 control borders through the kit tokens. Strings in the card-editor namespace, en-US / nl.
 */

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
