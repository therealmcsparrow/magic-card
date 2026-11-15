// Contract: look grammar. Version 2.0.0 (LOOK_GRAMMAR_CONTRACT), grammar 1 (LOOK_GRAMMAR). The one parser for gallery looks:
// which keys a look may carry, the value grammar every string passes, the verdict shape and its fixed codes. The card, the
// gallery CI and the gallery smoke test all run the same `parseLook` and `lookTraits` (src/look-kit/, built to dist/look-kit.mjs)
// and must give the same verdict for every entry of the shared fixture corpus (src/look-kit/fixtures/corpus.json).

export const LOOK_GRAMMAR_CONTRACT = '2.0.0';
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
 * A look file: `{ grammar, card?, modules? }`, nothing else at the top level.
 * - `card`: card-level style keys (LOOK_CARD_KEYS).
 * - `modules`: style per module type (LOOK_MODULE_TYPES) plus `"*"` for every module type. Each holds `design` and that type's own
 *   look keys (LOOK_MODULE_KEYS). A look never carries `rows`, positions or module ids: it targets keys, not places.
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

/** Keys every module target may set. `design` is the whole DesignConfig, walked with the same value grammar. */
export const LOOK_MODULE_COMMON_KEYS = ['design', 'icon_position'] as const;

/** Extra look keys per module type (on top of LOOK_MODULE_COMMON_KEYS). A prefix ending in `*` matches every key that starts with it. */
export const LOOK_MODULE_KEYS: Partial<Record<LookModuleType, readonly string[]>> = {
  icon: ['size', 'icon_color', 'icon_fx', 'icon_style'],
  bar: ['bar_*', 'severity'],
  graphs: ['line_*', 'fill*'],
  slider: ['slider_color', 'track_color', 'slider_look'],
  button: ['button_style'],
  image: ['fit', 'aspect_ratio', 'colors'],
  gauge: ['severity'],
};

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
 * Allow-list below the targets. Every value inside `card` or a `modules` target is judged by a key rule from a key table, never by
 * a block-list: a key missing from its table is dropped. The walk starts at the card table (LOOK_CARD_KEYS) or a module target's
 * table (LOOK_MODULE_COMMON_KEYS plus that type's LOOK_MODULE_KEYS) and follows `object` / `array` rules into the next table.
 * Rules: `'drop'` drops the key; `'value'` takes a scalar (string, finite number, boolean) judged by the value, font or css rule;
 * `{ object }` walks a plain object with the named table; `{ array }` takes an array of scalars (`'value'`) or of objects (a table
 * name); `{ value: true, object }` accepts either form (`seasonal`: a scene name, `true` or SeasonalConfig). A value of a kind its
 * rule does not name is `bad_type`. Drops run first and the kind check runs on what is left; an object or array left empty after
 * drops is dropped itself (so `min: { entity, attribute }` disappears, and `min: 20` stays).
 *
 * Tables live in src/look-kit/grammar.ts as LOOK_KEY_TABLES, one per name in LookTableName, each typed `LookKeyTable<I>` over
 * the types.ts interface it mirrors (named in the comment on LookTableName), so a key added to that interface fails the type check
 * until it is classified.
 * Prefix keys in LOOK_MODULE_KEYS (`bar_*`) expand through `Extract<keyof I, \`bar_${string}\`>` the same way.
 * Classifying: a style rule (`'value'`, `object` or `array`) only when the key changes how something looks and holds no
 * entity id, attribute name, action, template, content text, position, module id or external reference; otherwise `'drop'`; when in
 * doubt, `'drop'`. Turning a `'drop'` into a style rule is a minor version of this Contract (older cards drop the key, which is not a
 * failure); turning a style rule into `'drop'` or narrowing a value rule is a new grammar number.
 */
export type LookTableName =
  | 'CardLook' // Pick<MagicCardConfig, LOOK_CARD_KEYS>
  | 'ModuleLook' // LOOK_MODULE_COMMON_KEYS plus one Pick<…ModuleConfig, LOOK_MODULE_KEYS[type]> per module type
  | 'DesignConfig' // `design`, every `hover`, ConditionalDesign never (`conditional` is dropped)
  | 'TabStateDesign' // `tab_active`, `tab_disabled` and the other tab state objects of DesignConfig
  | 'AnimationConfig' // items of `animations` and `tab_animations`
  | 'CssAnimationConfig' // DesignConfig `animation`
  | 'RingConfig'
  | 'ShapeOptions' // with CustomShapeOptions; `ref` is dropped above
  | 'ValueBackgroundConfig'
  | 'SeasonalConfig'
  | 'SeasonalCalendar' // Partial<Record<SeasonalHoliday, string | false>>: the five holiday keys, each `'value'`
  | 'IconFxConfig' // `icon_fx`; `tab_icon_fx` uses the same table restricted to its Pick
  | 'IconFillConfig'
  | 'IconColorsConfig'
  | 'ColorRange'; // items of `severity` and `thresholds`
export type LookKeyRule =
  | 'drop'
  | 'value'
  | { object: LookTableName }
  | { array: LookTableName | 'value' }
  | { value: true; object: LookTableName };
export type LookKeyTable<I> = { readonly [K in keyof Required<I>]-?: LookKeyRule };

/** An `animations` / `tab_animations` entry keeps only these triggers; an entry with any other trigger is dropped whole. */
export const LOOK_ANIMATION_TRIGGERS = ['always', 'hover', 'tap', 'entity_on'] as const;
/** An animation `preset` must name a built-in library preset: this shape, never `custom:`. */
export const LOOK_PRESET_ID_RE = /^[a-z0-9][a-z0-9-]{0,47}$/;

/**
 * Value grammar for every string except font families and `css`. A string is safe when all of these hold:
 * 1. at most LOOK_VALUE_MAX_CHARS characters, and every character is in LOOK_VALUE_CHARSET (no `\`, `:`, `;`, `@`, `<`, `>`, `{`, `}`,
 *    `!`, quotes, `=`, `&`, `[`, `]`, control or bidi characters), so CSS escapes, HTML, templates and at-rules cannot be written;
 * 2. no `//` and no `/*`;
 * 3. every `name(` is a function in LOOK_CSS_FUNCTIONS (so `url(`, `image-set(`, `image(`, `cross-fade(`, `element(`, `src(`,
 *    `paint(`, `attr(`, `env(` and `expression(` are refused); `var(` takes exactly one `--name` (LOOK_VAR_RE).
 * A string that breaks any rule refuses the whole look with `unsafe_value` (it is never repaired or dropped).
 * LOOK_CSS_FUNCTIONS holds only functions the browser floor (Chromium 85, Safari 16.4) renders, so a look looks the same on every
 * supported browser: `color-mix(`, `hwb(`, `lab(`, `lch(`, `oklab(`, `oklch(` and `color(` are refused.
 */
export const LOOK_VALUE_CHARSET = /^[A-Za-z0-9 #%.,()+\-*/_]*$/;
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
  /** JSON-pointer path of the dropped key, e.g. `/modules/icon/design/conditional`. */
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
 * applyLook(config, look): returns a new card config and a summary of what changed. Card target: every LOOK_CARD_KEYS key is
 * removed from the card, then the look's card keys are written. Module targets: for every module (rows, columns, tabs and nested
 * children included) whose type the look names, or every module when it has `"*"`, the target's keys (common plus per-type) are
 * removed and the look's written, `"*"` first and the type's own keys after. Entities, content, actions, templates and every key
 * outside the targets stay as they were. The result holds no gallery id, URL or other trace of the look's origin.
 */
export type ApplyLook = <C extends object>(config: C, look: LookDoc) => { config: C; summary: LookApplySummary };

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
 * lookTraits(look): facts the tile and the index entry carry, computed from a parse result's `look` only (never the raw text).
 * - `animated` is true when any of these is left after drops: a non-empty `animations` or `tab_animations` array at any depth; a
 *   `seasonal` value other than `false`, `'none'` or an object whose `scene` is `'none'`; `shape_options.animate: true`; an `icon_fx` with `device` or `draw` set to anything but
 *   `off`, or `morph: true`; a `css` declaration whose property starts with `animation`.
 * - `fonts` is every non-generic family named in a LOOK_FONT_KEYS value or a `css` `font-family` value, quotes removed, sorted,
 *   unique.
 * Fixed for grammar 1; a new trait rule is a new grammar number.
 */
export type LookTraits = (look: LookDoc) => { animated: boolean; fonts: string[] };

/** One corpus entry: the bytes as text and the verdict every runner must give, traits included. */
export interface LookCorpusEntry {
  name: string;
  text: string;
  expect: { ok: true; dropped: string[]; animated: boolean; fonts: string[] } | { ok: false; code: LookParseCode };
}
