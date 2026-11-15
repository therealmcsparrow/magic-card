// Contract: look grammar. Version 2.1.0 (LOOK_GRAMMAR_CONTRACT), grammar 1 (LOOK_GRAMMAR). The one parser for gallery looks: keys,
// value grammar, verdict and codes. Card, gallery CI and smoke test run the same parseLook and lookTraits (src/look-kit/, built
// to dist/look-kit.mjs) and must give the same verdict for every entry of src/look-kit/fixtures/corpus.json.

import type {
  BarModuleConfig,
  ButtonModuleConfig,
  GaugeModuleConfig,
  GraphsModuleConfig,
  IconModuleConfig,
  ImageModuleConfig,
  SliderModuleConfig,
} from '../types';

export const LOOK_GRAMMAR_CONTRACT = '2.1.0';
/** Grammar number a look declares in its `grammar` field. A look with a higher number is refused with `grammar_unsupported`. */
export const LOOK_GRAMMAR = 1;

/** Limits, checked before and while walking. */
export const LOOK_MAX_BYTES = 16 * 1024;
export const LOOK_MAX_DEPTH = 8;
/** Longest single string value; a `css` declaration list may be longer. */
export const LOOK_VALUE_MAX_CHARS = 512;
export const LOOK_CSS_MAX_CHARS = 2048;
export const LOOK_ARRAY_MAX_ITEMS = 32;

/**
 * A look file: `{ grammar, card?, modules? }`, nothing else at the top level. `card` holds card-level keys (LOOK_CARD_KEYS);
 * `modules` holds one target per module type (LOOK_MODULE_TYPES) plus `"*"` for every type. A type target takes
 * LOOK_MODULE_COMMON_KEYS plus LOOK_MODULE_KEYS[type], `"*"` the common keys only; any other key is dropped. A look never
 * carries `rows`, positions or module ids: it targets keys, not places.
 */
export interface LookDoc {
  grammar: number;
  card?: Record<string, unknown>;
  modules?: Partial<Record<LookModuleType | '*', Record<string, unknown>>>;
}

export const LOOK_MODULE_TYPES = [
  'state', 'text', 'icon', 'info', 'image', 'markdown', 'bar', 'graphs', 'button', 'slider', 'spinbox', 'dropdown', 'light', 'gauge',
  'horizontal', 'vertical', 'row', 'tabs', 'separator', 'slider-layout', 'clock', 'weather', 'forecast',
] as const;
export type LookModuleType = (typeof LOOK_MODULE_TYPES)[number];

/**
 * Card-level keys a look may set. Object values are walked with the key tables (LookKeyTable): `ring` and `value_background` lose
 * every entity field and then follow the card's or module's own entity, as they do without a look.
 */
export const LOOK_CARD_KEYS = [
  'background', 'border_radius', 'padding', 'border_width', 'border_style', 'border_color', 'opacity', 'backdrop_filter', 'margin',
  'box_shadow', 'card_height', 'overflow', 'shape', 'shape_options', 'ring', 'value_background', 'pause_button', 'pause_button_corner',
  'layers_low_power', 'hover', 'seasonal', 'css',
] as const;

/** Keys every module target may set. `design` is the module's DesignConfig, walked with the DesignConfig table. */
export const LOOK_MODULE_COMMON_KEYS = ['design'] as const;

/** Declared keys of a config interface, without the `[key: string]: unknown` index signature every CardModule carries. */
export type LookKnownKeys<T> = keyof { [K in keyof T as string extends K ? never : number extends K ? never : K]: unknown };

/** The config interface each LOOK_MODULE_KEYS list is checked against. */
export interface LookModuleConfigs {
  icon: IconModuleConfig;
  bar: BarModuleConfig;
  graphs: GraphsModuleConfig;
  slider: SliderModuleConfig;
  button: ButtonModuleConfig;
  image: ImageModuleConfig;
  gauge: GaugeModuleConfig;
}

/**
 * Extra keys per module type, on top of LOOK_MODULE_COMMON_KEYS. Each is a declared key of that type's config, so a key the
 * interface lacks fails tsc. `icon_position` here is the slider's own key (`start` or `center`); other modules read
 * `design.icon_position`. Write `aspect_ratio` as `16/9`, a number or a percentage: `16:9` breaks the value grammar.
 */
export const LOOK_MODULE_KEYS = {
  icon: ['size', 'icon_color', 'icon_fx'],
  bar: ['bar_height', 'bar_color', 'bar_background', 'severity'],
  graphs: ['line_color', 'line_width', 'fill', 'fill_color'],
  slider: [
    'slider_color', 'track_color', 'slider_color_to', 'fill_mode', 'track_style', 'track_thickness', 'track_radius', 'segments',
    'segment_gap', 'glass_blur', 'icon_position', 'thumb', 'thumb_size', 'thumb_border', 'thumb_border_color', 'thumb_glow',
    'value_position', 'ticks', 'tick_every', 'show_limits', 'track_shape', 'track_shape_options',
  ],
  button: ['button_style'],
  image: ['fit', 'aspect_ratio', 'colors'],
  gauge: ['severity'],
} as const satisfies { readonly [T in keyof LookModuleConfigs]: readonly LookKnownKeys<LookModuleConfigs[T]>[] };

/**
 * Keys dropped wherever they appear inside `card` or a `modules` target, at any depth, before any value is judged and before the
 * key tables are consulted (the target names under `modules` are not keys of this list, so `modules.state` is a target). Dropping is
 * not a failure: the card applies what is left; the gallery CI fails a look whose `dropped` list is not empty.
 */
export const LOOK_DROPPED_KEYS = [
  'actions', 'tap_action', 'hold_action', 'double_tap_action', 'entity', 'entities', 'entity_id', 'attribute', 'use_entity',
  'use_entity_icon', 'use_module_entity', 'share_entity', 'weather_entity', 'trigger_entity', 'popup', 'display',
  'conditional_appearance', 'conditional', 'template', 'use_template', 'not_synced', 'text', 'label', 'content', 'flows', 'rows',
  'custom_icons', 'custom_shapes', 'custom_animations', 'icon', 'image', 'background_image', 'border_image', 'layers', 'theme',
  'use_page_theme', 'placement', 'layer', 'state', 'ref', 'id',
] as const;
/** Any key that ends in this suffix is dropped like LOOK_DROPPED_KEYS, so an entity field added to types.ts later is never kept. */
export const LOOK_DROPPED_KEY_SUFFIX = '_entity';
/**
 * A string value shaped like a Home Assistant entity id (the whole string matches) drops the key that holds it; inside an array the
 * array's key is dropped. Applies to every string, also under a style rule, so an entity id cannot ride in through a style field.
 */
export const LOOK_ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

/**
 * Allow-list below the targets: every value inside `card` or a target is judged by a rule from a key table, never by a
 * block-list, and a key missing from its table is dropped. The walk starts at CardLook or ModuleLook and follows `object` and
 * `array` rules into the next table. Drops run first, then the kind check on what is left. An object or array emptied by drops is
 * removed with no pointer of its own (`min: { entity, attribute }` gives two pointers and disappears, `min: 20` stays).
 */
export type LookTableName =
  | 'CardLook' // Pick<MagicCardConfig, LOOK_CARD_KEYS>
  | 'ModuleLook' // one flat table: `design` plus every LOOK_MODULE_KEYS key (the shared `severity` has one rule)
  | 'DesignConfig' // `design` and every `hover`. ConditionalDesign never (`conditional` is dropped)
  | 'TabStateDesign' // `tab_active`, `tab_disabled` and the other tab state objects of DesignConfig
  | 'AnimationConfig' // items of `animations` and `tab_animations`
  | 'RingConfig'
  | 'ValueBoundObject' // the object form of RingConfig `min` and `max`: { entity, attribute }, both 'drop'
  | 'ShapeOptions' // with CustomShapeOptions, `ref` dropped above. Also the slider's `track_shape_options`
  | 'ValueBackgroundConfig'
  | 'SeasonalConfig'
  | 'SeasonalCalendar' // Partial<Record<SeasonalHoliday, string | false>>: the five holiday keys, each 'value'
  | 'IconFxConfig' // `icon_fx`
  | 'TabIconFxConfig' // `tab_icon_fx`: Pick<IconFxConfig, 'device' | 'draw' | 'draw_duration'>
  | 'IconFillConfig'
  | 'IconColorsConfig'
  | 'ImageColors' // NonNullable<ImageModuleConfig['colors']>: `main` and `accent`
  | 'ColorRange'; // items of `severity` and `thresholds`
export type LookKeyRule =
  | 'drop' // the key is dropped
  | 'value' // a scalar (string, finite number, boolean) judged by the value, font or css rule
  | { object: LookTableName } // a plain object, walked with the named table
  | { array: LookTableName | 'value' } // an array of scalars ('value') or of objects (a table name)
  | { value: true; object: LookTableName }; // either form: `seasonal` (scene name, `true`, SeasonalConfig), ring `min` and `max`
/**
 * Tables live in src/look-kit/grammar.ts as LOOK_KEY_TABLES, one per LookTableName, each typed `LookKeyTable<I>` over the types.ts
 * interface named on its LookTableName line, so a key added to that interface fails tsc until it is classified. A value of a kind
 * its rule does not name is `bad_type`.
 */
export type LookKeyTable<I> = { readonly [K in keyof Required<I>]-?: LookKeyRule };

/**
 * Classifying: a style rule only when the key changes how something looks and holds no entity id, attribute name, action,
 * template, content text, position, module id or external reference, else `'drop'`; when in doubt, `'drop'`. A `'drop'` turned
 * into a style rule, or a key added to a list here, is a minor version (older cards drop it, which is not a failure). A style rule
 * turned into `'drop'`, or a narrowed value rule, is a new grammar number.
 */

/**
 * An `animations` or `tab_animations` entry is dropped whole (pointer `/…/<array>/<index>`) when its `trigger` is set and not in
 * this list, or its `preset` is missing or does not match LOOK_PRESET_ID_RE. `custom:<id>` presets are dropped that way: they
 * point into the user's `custom_animations`. DesignConfig `animation` (a legacy object the card never renders) and the deprecated
 * `animation_preset`, `animation_target`, `animation_speed`, `animation_trigger`, `animation_state`, `animation_color` are `'drop'`.
 */
export const LOOK_ANIMATION_TRIGGERS = ['always', 'tap', 'entity_on'] as const;
/** An animation `preset` names a built-in library preset. Judged by this pattern only, never by the value grammar. */
export const LOOK_PRESET_ID_RE = /^[a-z0-9][a-z0-9-]{0,47}$/;

/**
 * Value grammar for every string except font families, `css` and `preset`. A string is safe when (1) it has at most
 * LOOK_VALUE_MAX_CHARS characters, all in LOOK_VALUE_CHARSET (no `\ : ; @ < > { } ! = & [ ]`, quotes, control or bidi characters),
 * (2) it holds no `//` and no `/*`, and (3) every `name(` is in LOOK_CSS_FUNCTIONS, with `var(` taking one `--name` (LOOK_VAR_RE).
 * A string that breaks a rule refuses the whole look with `unsafe_value`; it is never repaired or dropped.
 */
export const LOOK_VALUE_CHARSET = /^[A-Za-z0-9 #%.,()+\-*/_]*$/;
/**
 * Only functions the browser floor (Chromium 85, Safari 16.4) renders, so a look looks the same everywhere. Refused among others:
 * `url(`, `image-set(`, `image(`, `cross-fade(`, `element(`, `src(`, `paint(`, `attr(`, `env(`, `expression(`, `color-mix(`,
 * `hwb(`, `lab(`, `lch(`, `oklab(`, `oklch(` and `color(`.
 */
export const LOOK_CSS_FUNCTIONS = [
  'rgb', 'rgba', 'hsl', 'hsla', 'linear-gradient', 'radial-gradient',
  'conic-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient', 'calc', 'min', 'max', 'clamp',
  'var', 'cubic-bezier', 'steps', 'translate', 'translatex', 'translatey', 'rotate', 'scale', 'scalex', 'scaley', 'skew', 'skewx',
  'skewy', 'matrix', 'perspective', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity',
  'saturate', 'sepia', 'inset', 'circle', 'ellipse', 'polygon', 'repeat', 'minmax', 'fit-content',
] as const;
export const LOOK_VAR_RE = /^var\(\s*--[a-z0-9-]{1,64}\s*\)$/i;

/** Keys whose string is a font-family list: up to 4 comma-separated items, each a generic family or a name of letters, digits and spaces (1-64), optionally in matching quotes. */
export const LOOK_FONT_KEYS = ['font_family', 'tab_font_family', 'label_font_family'] as const;
export const LOOK_FONT_GENERICS = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded'] as const;
export const LOOK_FONT_NAME_RE = /^(?:"[A-Za-z0-9 ]{1,64}"|'[A-Za-z0-9 ]{1,64}'|[A-Za-z0-9 ]{1,64})$/;

/**
 * `css` (card level and inside `design`): a declaration list only, at most LOOK_CSS_MAX_CHARS. Split on `;`; each part is
 * `property: value` with an optional trailing `!important`. The property matches LOOK_CSS_PROPERTY_RE and is not in
 * LOOK_CSS_PROPERTY_DENY; a `font-family` value follows the font rule, every other value the value grammar. Any `{`, `}`, `@`,
 * `\`, `/*` or `<` anywhere refuses the look with `unsafe_value`.
 */
export const LOOK_CSS_PROPERTY_RE = /^-?[a-z][a-z0-9-]{0,63}$/;
export const LOOK_CSS_PROPERTY_DENY = ['behavior', '-moz-binding', 'content', 'src', 'cursor', 'list-style-image', 'mask-image', 'background-image', 'border-image', 'border-image-source'] as const;

/** Numbers must be finite; booleans pass; `null` is dropped; arrays hold at most LOOK_ARRAY_MAX_ITEMS items. Anything else is `bad_type`. */
export type LookParseCode =
  | 'json' // not valid JSON or not UTF-8
  | 'too_large' // over LOOK_MAX_BYTES, LOOK_MAX_DEPTH or an array limit
  | 'grammar_unsupported' // `grammar` missing, not an integer, or above LOOK_GRAMMAR
  | 'not_object' // top level or a target is not a plain object
  | 'unknown_target' // a `modules` key outside LOOK_MODULE_TYPES and "*"
  | 'bad_type' // a value of a type the key cannot hold
  | 'unsafe_value' // a string breaks the value, font or css rule
  | 'empty'; // nothing left to apply after drops

export interface LookDrop {
  /** JSON-pointer path of the dropped key or array entry in the input, e.g. `/modules/icon/design/conditional`. */
  path: string;
}

/** `look` is a new object built only from accepted keys and values (never the parsed input); it is what preview and Keep use. */
export type LookParseResult =
  | { ok: true; look: LookDoc; dropped: LookDrop[] }
  | { ok: false; code: LookParseCode; path: string };

/**
 * parseLook(text): pure and synchronous, no DOM, no globals, no network. It takes the exact bytes as text (the caller decodes
 * UTF-8 with `fatal: true`) so card, CI and smoke test judge the same input. Unknown keys are dropped like LOOK_DROPPED_KEYS.
 */
export type ParseLook = (text: string) => LookParseResult;

/**
 * applyLook(config, look): a new card config plus a summary. Card target: every LOOK_CARD_KEYS key is removed from the card, then
 * the look's card keys are written. Module targets: every module (rows, columns, tabs and nested children included) whose type the
 * look names, or every module when it has `"*"`, gets its target keys replaced: `"*"` first, then the type's own keys over them.
 * Entities, content, actions, templates and every key outside the targets stay. The result holds no gallery id, URL or other trace.
 */
export type ApplyLook = <C extends object>(config: C, look: LookDoc) => { config: C; summary: LookApplySummary };

/**
 * `design` is replaced key by key, never whole: every DesignConfig key with a style rule is removed from a matched module's
 * `design` (also when the look writes no `design`), then the `"*"` design keys and the type's design keys are written, the type
 * winning per key. Keys the DesignConfig table drops (`conditional` and the rest) stay; an emptied `design` is removed. An object
 * value (`hover`, `ring`, `tab_active`) is written whole. Every written animation entry gets `id: 'anim-<n>'`, n its 1-based index.
 */

/**
 * What Keep changes, for the preview's "What changes" list. One area for the card (when the look has `card`) and one per module type
 * that occurs in the config and is matched by the look (by its own target or by `"*"`); types the config does not use are left out.
 * Setting names are target keys, except that each key inside `design` is listed as `design.<key>`; the UI maps names to editor
 * field labels and falls back to the name. Lists are sorted and unique.
 */
export interface LookApplySummary {
  /** Sum over areas of set.length + cleared.length. */
  count: number;
  areas: LookApplyArea[];
}
export interface LookApplyArea {
  target: 'card' | LookModuleType;
  /** Modules of this type the look reaches; 1 for the card area. */
  modules: number;
  /** Settings the look writes in this area. */
  set: string[];
  /** Allow-listed settings present before Keep in at least one matched module (or the card) that the look does not write: removed. */
  cleared: string[];
}

/**
 * `animated` is true when any of these is left after drops, at any depth: a non-empty `animations` or `tab_animations`; `seasonal`
 * other than `false`, `'none'` or an object whose `scene` is `'none'`; `shape_options` or `track_shape_options` with `animate: true`;
 * an `icon_fx` or `tab_icon_fx` whose `device` or `draw` is anything but `off`, or `morph: true`; `icon_fx.fill.wave: true`; a
 * `ring` with `mode: 'animated'`; a `value_background` with `wave: true` and `type` absent or `fill`; a `css` `animation*` property.
 */

/**
 * lookTraits(look): facts the tile and the index entry carry, from a parse result's `look` only (never the raw text): `animated` by
 * the rules above, and `fonts`, every non-generic family in a LOOK_FONT_KEYS value or a `css` `font-family` value, quotes removed,
 * sorted, unique. Both are fixed for grammar 1: a new trait rule is a new grammar number.
 */
export type LookTraits = (look: LookDoc) => { animated: boolean; fonts: string[] };

/** One corpus entry: the bytes as text and the verdict every runner must give, traits included. */
export interface LookCorpusEntry {
  name: string;
  text: string;
  expect: { ok: true; dropped: string[]; animated: boolean; fonts: string[] } | { ok: false; code: LookParseCode };
}
