import type { CustomShapeOptions, CustomShapesConfig } from './contracts/custom-shape';
import type { CustomIconsConfig } from './contracts/mcu-library';
import type { EntityScopeNode } from './contracts/entity-scope';
import type { BackgroundLayerConfig } from './contracts/bg-stack';
import type { LayerConfig, Placement } from './contracts/layer-placement';
import type { PauseButtonCorner, PauseButtonMode } from './contracts/card-pause';

// ── Home Assistant types (subset) ──

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  /** Entity registry display entries (icon set by the user, etc.). */
  entities?: Record<string, { entity_id: string; icon?: string | null; name?: string | null }>;
  services: Record<string, Record<string, HassService>>;
  themes: HassThemes;
  language: string;
  locale: HassLocale;
  /** Core config: units and the server time zone. */
  config?: {
    time_zone?: string;
    unit_system?: { temperature?: string; length?: string; wind_speed?: string; accumulated_precipitation?: string };
  };
  callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<void>;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  connection: {
    subscribeMessage: <T>(
      callback: (msg: T) => void,
      msg: Record<string, unknown>,
    ) => Promise<() => void>;
    subscribeEvents: <T>(
      callback: (event: T) => void,
      eventType: string,
    ) => Promise<() => void>;
  };
  /** `state` overrides the entity's own state (e.g. a forecast condition). */
  formatEntityState: (entity: HassEntity, state?: string) => string;
  formatEntityAttributeValue: (entity: HassEntity, attribute: string, value?: unknown) => string;
  formatEntityAttributeName: (entity: HassEntity, attribute: string) => string;
  /** Absolute URL for a path on the Home Assistant server (relative entity_picture / proxy URLs). */
  hassUrl?: (path?: string) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: { id: string; parent_id: string | null; user_id: string | null };
}

export interface HassService {
  name?: string;
  description?: string;
  fields?: Record<string, unknown>;
}

export interface HassThemes {
  default_theme: string;
  themes: Record<string, Record<string, string>>;
  /** The frontend is in dark mode (set by HA's theme handling). */
  darkMode?: boolean;
}

export interface HassLocale {
  language: string;
  number_format: string;
  time_format: string;
  /** 'local' (browser) or 'server' (hass.config.time_zone). */
  time_zone?: string;
}

// ── Media Source types ──

export interface MediaBrowseItem {
  title: string;
  media_class: string;
  media_content_type: string;
  media_content_id: string;
  can_play: boolean;
  can_expand: boolean;
  thumbnail: string | null;
  children?: MediaBrowseItem[];
}

export interface MediaResolveResult {
  url: string;
  mime_type: string;
}

// ── Card Configuration ──

export interface MagicCardConfig {
  type: string;
  name?: string;
  template?: string;
  /** Card entity: modules without their own `entity` follow it (contract entity-scope). Per card, never in a template. */
  entity?: string;
  not_synced?: string[]; // Property paths that are not synced to template
  rows: RowConfig[];
  use_page_theme?: boolean;
  theme?: string;
  background?: string;
  background_image?: string;
  border_radius?: string;
  padding?: string;
  box_shadow?: string;
  card_height?: string;
  overflow?: 'visible' | 'hidden' | 'auto';
  css?: string;
  /** Design values applied while the pointer is over the card's content (a scoped :hover rule). */
  hover?: Partial<DesignConfig>;
  display?: DisplayConfig;
  conditional_appearance?: ConditionalCardAppearance[];
  /** Preset animations of the card itself (same entries as a design's `animations`). */
  animations?: AnimationConfig[];
  /**
   * Inline animation documents (src/anim-studio/model.ts), a list or keyed by id: used for
   * `preset: custom:<id>` when the animation library lacks the id (shared YAML keeps working).
   */
  custom_animations?: Array<Record<string, unknown>> | Record<string, Record<string, unknown>>;
  /** Template-linked card: ids of the template's `custom_animations` this card leaves out. */
  hidden_animations?: string[];
  /** Card backdrop: up to MAX_BACKGROUND_LAYERS layers, first = front (contract bg-stack 1.0.0). */
  background_layers?: BackgroundLayerConfig[];
  /** Layers drop blur, blend and pan / zoom (contract layer-placement 1.0.0 r2). */
  layers_low_power?: boolean;
  /** Viewer pause button visibility (contract card-pause 1.0.0). */
  pause_button?: PauseButtonMode;
  pause_button_corner?: PauseButtonCorner;
  /** Shape-following ring around the card (src/utils/ring.ts). */
  ring?: RingConfig;
  /** Outline shape of the card (src/utils/shape-path.ts); wins over border_radius. */
  shape?: ShapeKind;
  shape_options?: ShapeOptions;
  /** Saved-shape copies by id for `shape: custom` + `shape_options.ref` (src/utils/shape-custom.ts). */
  custom_shapes?: CustomShapesConfig;
  /** Kept copies of saved icons (sanitised markup by id) for `icon: mcu:<id>`, drawn when the library has no answer. */
  custom_icons?: CustomIconsConfig;
  /** Tank fill / history sparkline behind the card's rows (src/card/mc-value-bg.ts); needs its own entity. */
  value_background?: ValueBackgroundConfig;
  /** Show the card as a pop-up (hidden on the dashboard, opened by `#hash`, triggers or actions). */
  popup?: PopupConfig;
  /** Animated flow lines between two modules of the card (src/utils/flow.ts, <mc-flows>). */
  flows?: FlowConfig[];
  /** Seasonal scene over / behind the card (src/utils/seasonal.ts); a scene name is short for `{ scene }`. */
  seasonal?: SeasonalSetting;
}

/** `seasonal`: the object, a scene name (short for `{ scene }`) or `true` (auto). */
export type SeasonalSetting = SeasonalConfig | SeasonalSceneSetting | boolean;

/** Scenes a user can pick (`seasonal.scene`, `seasonal.combine`). */
export type SeasonalScenePick =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'christmas'
  | 'new_year'
  | 'valentine'
  | 'easter'
  | 'halloween'
  | 'weather'
  | 'daynight';

export type SeasonalSceneSetting = 'auto' | 'none' | SeasonalScenePick;

/** Holidays with a date range in `seasonal.calendar`. */
export type SeasonalHoliday = 'christmas' | 'new_year' | 'valentine' | 'easter' | 'halloween';

/** `seasonal`: a scene picked by hand or by date, drawn as a particle layer plus border decorations. */
export interface SeasonalConfig {
  /** Default auto. */
  scene?: SeasonalSceneSetting;
  /** back: behind the content (default); front: over it, dimmed, never blocks clicks. */
  layer?: 'back' | 'front';
  /** Particle density, `'50%'`, 0-100, or a fraction in (0, 1] like 0.7 (default 50%). */
  intensity?: string | number;
  /** Border decorations (lights, icicles, cobweb, vine); default true. */
  decorations?: boolean;
  /** Off switch: state `off` hides the scene. */
  entity?: string;
  /** `weather.*` entity for the `weather` scene (also when it is in `combine`). */
  weather_entity?: string;
  /** Flips the seasons (default north). */
  hemisphere?: 'north' | 'south';
  /** Holiday date ranges for auto: `MM-DD..MM-DD` (inclusive, may wrap the year end); easter also `auto`; `off` disables one. */
  calendar?: Partial<Record<SeasonalHoliday, string | false>>;
  /** Extra scenes layered on top (e.g. daynight during winter). */
  combine?: SeasonalSceneSetting[];
}

/** A side of a module's box (flow anchors). */
export type FlowSide = 'top' | 'right' | 'bottom' | 'left';

/** One animated flow line between two modules (by module id), driven by an optional entity value. */
export interface FlowConfig {
  /** Stable id of the flow (editor generated). */
  id: string;
  /** Module ids of the start and end module (any module, nested children included). */
  from: string;
  to: string;
  /** Anchor sides (auto = the facing pair). */
  from_side?: 'auto' | FlowSide;
  to_side?: FlowConfig['from_side'];
  route?: 'curve' | 'straight' | 'elbow';
  /** Value source; no entity = always flowing at `speed`. */
  entity?: string;
  attribute?: string;
  /** |value| <= min -> idle. */
  min?: number;
  /** Value at which speed and width reach their maximum. */
  max?: number;
  /** Negative value -> dots run from `to` to `from` (default true). */
  reverse_negative?: boolean;
  /** Line + dot colour; `entity` / `entity N%` use the entity's state colour. */
  color?: string;
  /** Line colour while idle; `N%` = `color` at N% opacity (default 30%). */
  idle_color?: string;
  /** Base line width (px); up to width x 2 at `max` when `scale_width`. */
  width?: number;
  scale_width?: boolean;
  /** Dots on the line at once (0-8); 0 = dashed line animation. */
  dots?: number;
  dot_size?: number;
  /** Seconds per traversal at `max` (and without an entity). */
  speed?: number;
  /** Seconds per traversal at the smallest non-idle value. */
  min_speed?: number;
  /** Drop-shadow glow on the dots (px). */
  glow?: number;
  label?: 'none' | 'value' | 'template';
  label_template?: string;
  /**
   * Where the label sits: auto = on the line when it has room, else beside it (hidden when that
   * covers a module or another label); line = always on the line; side = always beside it.
   */
  label_position?: 'auto' | 'line' | 'side' | 'hidden';
  /** flowing: hide the whole line while idle. */
  show_when?: 'always' | 'flowing';
  /** back: behind module content (default); front: over it (never blocks clicks). */
  layer?: 'back' | 'front';
}

/** Entity state that opens or closes a pop-up (`state` empty: any state change). */
export interface PopupTrigger {
  entity?: string;
  state?: string;
}

/** Card-level pop-up settings (src/card/popup-controller.ts). */
export interface PopupConfig {
  enabled?: boolean;
  /** Opens while location.hash is `#<hash>` (case-sensitive, stored without '#'). */
  hash?: string;
  /** sheet: bottom sheet sliding up (default); dialog: centred. */
  style?: 'sheet' | 'dialog';
  /** Maximum width of the surface (default 600px). */
  width?: string;
  /** Maximum height of the surface (default 90vh). */
  max_height?: string;
  /** Backdrop blur (default 8px). */
  backdrop_blur?: string;
  /** Backdrop darkness 0..1 (default 0.4). */
  backdrop_opacity?: number;
  /** Close button in the header (default true). */
  show_close?: boolean;
  /** Close after this many seconds without interaction (0 / unset: off). */
  auto_close?: number;
  open_on?: PopupTrigger;
  close_on?: PopupTrigger;
  /** Header text (also the dialog's accessible name). */
  title?: string;
}

export interface ConditionalCardAppearance {
  id: string;
  name?: string;
  conditions: DisplayCondition[];
  mode?: 'every' | 'any';
  overrides: CardAppearanceOverrides;
}

export interface CardAppearanceOverrides {
  background?: string;
  background_image?: string;
  border_radius?: string;
  padding?: string;
  box_shadow?: string;
  card_height?: string;
  use_page_theme?: boolean;
  theme?: string;
  /** Design rules (ADR 0008): each key replaces the card's own value while the rule matches. `{}`, `none` or `type: none` switch it off. */
  ring?: RingConfig;
  shape?: ShapeKind;
  shape_options?: ShapeOptions;
  value_background?: ValueBackgroundConfig;
  seasonal?: SeasonalSetting;
  /** Replaces the card's whole backdrop list while the rule matches (bg-stack 1.0.0 r3); never on `hover`. */
  background_layers?: BackgroundLayerConfig[];
}

export interface RowConfig extends EntityScopeNode {
  id: string;
  columns: ColumnConfig[];
  layout?: string; // '1' | '1-1' | '1-2' | '2-1' | '1-1-1' | custom grid
  /** One width per column (`<n>fr`, `<n>%`, `<n>px` or `auto`); overrides `layout` when present. */
  column_widths?: string[];
  gap?: string;
  padding?: string;
  display?: DisplayConfig;
  design?: DesignConfig;
  actions?: ActionsConfig;
  /** Studio Hide: not shown on the dashboard (the studio shows it dimmed). */
  hidden?: boolean;
  /** Editor-only layer name (tree and canvas labels); never shown on the dashboard. */
  editor_name?: string;
  not_synced?: string[]; // Property paths that are not synced for this row
}

export interface ColumnConfig extends EntityScopeNode {
  id: string;
  modules: CardModule[];
  gap?: string;
  padding?: string;
  vertical_align?: 'start' | 'center' | 'end' | 'stretch';
  display?: DisplayConfig;
  design?: DesignConfig;
  /** Studio Hide: not shown on the dashboard (the studio shows it dimmed). */
  hidden?: boolean;
  /** Editor-only layer name (tree and canvas labels); never shown on the dashboard. */
  editor_name?: string;
  not_synced?: string[]; // Property paths that are not synced for this column
}

// ── Module Configuration ──

export interface CardModule {
  id: string;
  type: ModuleType;
  entity?: string;
  attribute?: string;
  display?: DisplayConfig;
  design?: DesignConfig;
  actions?: ActionsConfig;
  /** Studio Hide: not shown on the dashboard (the studio shows it dimmed). */
  hidden?: boolean;
  /** Where the module sits in its container: flow (default), behind the others or on top (layer-placement 1.0.0). */
  placement?: Placement;
  /** Fill, anchor, opacity, blur, blend, click-through and scrim; read only when placement is background or overlay. */
  layer?: LayerConfig;
  /** Editor-only layer name (tree and canvas labels); never shown on the dashboard. */
  editor_name?: string;
  not_synced?: string[]; // Property paths that are not synced for this module
  [key: string]: unknown; // Module-specific properties
}

export type ModuleType =
  // Content
  | 'text'
  | 'icon'
  | 'info'
  | 'image'
  | 'markdown'
  | 'bar'
  | 'graphs'
  | 'camera'
  // Controls
  | 'button'
  | 'slider'
  | 'spinbox'
  | 'dropdown'
  | 'light'
  | 'gauge'
  // Layout
  | 'horizontal'
  | 'vertical'
  | 'row'
  | 'tabs'
  | 'separator'
  | 'slider-layout'
  // Advanced
  | 'clock'
  | 'weather'
  | 'forecast'
  | 'video-bg'
  | 'custom-card';

export type ModuleCategory = 'content' | 'controls' | 'layout' | 'advanced';

// ── Display / Conditions ──

export interface DisplayConfig {
  conditions?: DisplayCondition[];
  mode?: 'every' | 'any'; // AND vs OR
}

export interface DisplayCondition {
  id: string;
  type: 'state' | 'attribute' | 'time' | 'template';
  entity?: string;
  use_module_entity?: boolean;
  attribute?: string;
  state?: string;
  state_not?: string;
  above?: number;
  below?: number;
  after?: string; // HH:MM
  before?: string; // HH:MM
  template?: string; // Jinja2
}

// ── Design / Styling ──

export interface DesignConfig {
  // Typography
  font_size?: string;
  font_weight?: string;
  font_family?: string;
  line_height?: string;
  text_align?: 'left' | 'center' | 'right';
  text_transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letter_spacing?: string;

  // Colors
  color?: string;
  background?: string;
  opacity?: string;

  // Spacing
  padding?: string;
  margin?: string;

  // Borders
  border?: string;
  border_radius?: string;
  border_color?: string;
  /** Shorten every drawn border side to a line of this length (e.g. '40%', '60px'). */
  border_length?: string;
  border_length_align?: 'start' | 'center' | 'end';
  /** Draw the border length line on one side only (default: every side with a border). */
  border_length_sides?: 'top' | 'right' | 'bottom' | 'left';

  // Shadows
  box_shadow?: string;
  text_shadow?: string;

  // Layout
  width?: string;
  height?: string;
  min_width?: string;
  min_height?: string;
  max_width?: string;
  max_height?: string;
  overflow?: 'visible' | 'hidden' | 'auto';
  flex?: string;

  // Effects
  filter?: string;
  backdrop_filter?: string;
  transform?: string;
  transition?: string;

  // Animation
  /** Unused legacy shape, kept for old configs. */
  animation?: CssAnimationConfig;
  /** Preset animations (src/utils/animation.ts); not CSS, the card renders them itself. */
  animations?: AnimationConfig[];
  /** @deprecated single-animation keys (v0.0.14): read as one `animations` entry, removed on edit. */
  animation_preset?: string;
  animation_target?: 'module' | 'icon';
  animation_speed?: 'slow' | 'normal' | 'fast';
  animation_trigger?: 'always' | 'entity_on' | 'state';
  animation_state?: string;
  animation_color?: string;

  /** Shape-following ring (src/utils/ring.ts); not CSS, the card renders it itself. */
  ring?: RingConfig;

  /** Outline shape (src/utils/shape-path.ts); wins over border_radius. Not CSS, the card applies it itself. */
  shape?: ShapeKind;
  shape_options?: ShapeOptions;
  /** Tank fill / history sparkline behind the content (src/utils/value-background.ts). */
  value_background?: ValueBackgroundConfig;

  // Hover
  hover?: Partial<DesignConfig>;

  // CSS override
  css?: string;

  // Conditional design rules
  conditional?: ConditionalDesign[];
}

export interface ConditionalDesign {
  id: string;
  name?: string;
  conditions: DisplayCondition[];
  mode?: 'every' | 'any';
  design: Partial<DesignConfig>;
}

/** `tap`: plays once from the pointer position on every tap / click. */
export type AnimationTrigger = 'always' | 'entity_on' | 'state' | 'tap';
export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

/** One preset animation of a module / row / column design. Unset fields use the preset's defaults. */
export interface AnimationConfig {
  id: string;
  /** ANIMATION_PRESETS id (src/utils/animation-presets.ts). */
  preset: string;
  target?: 'module' | 'icon';
  trigger?: AnimationTrigger;
  /** Entity the Play condition reads; default the module's entity (card / row / column: required). */
  trigger_entity?: string;
  /** State value for trigger "state". */
  state?: string;
  color?: string;
  /** CSS time, e.g. "2s" or "600ms". */
  duration?: string;
  delay?: string;
  /** Easing id (EASINGS) or a cubic-bezier() / steps() function. */
  easing?: string;
  iterations?: 'infinite' | number;
  direction?: AnimationDirection;
  /** Preset-specific: degrees, scale %, px or particle count. */
  intensity?: number;
  /** 0-100 (%): how strongly the colour is painted (glows, particles); default 100. */
  strength?: number;
  /** Seasonal presets: draw the scene's border decorations (lights, icicles, ...); default true. */
  decorations?: boolean;
  /** Custom animations with clips / bindings: the driving entity instead of the module's. */
  entity?: string;
  /**
   * Editor metadata of an icon library pick (contract icon-library LibraryPickFields): the library
   * entry the inline document was derived from, and its Style (absent: Living). The card ignores both.
   */
  library_icon?: string;
  icon_style?: 'quiet' | 'glow';
}

export type RingMode = 'value' | 'animated';
export type RingAnimation = 'snake' | 'pulse' | 'full' | 'dots' | 'dashes';
export type ShapeKind = 'custom' | 'squircle' | 'hexagon' | 'octagon' | 'blob' | 'wave' | 'notch' | 'ticket' | 'pill' | 'circle' | 'none';

/** `design.shape_options`: lengths are px numbers, `'16px'` or `'%'` of the element's smaller side. */
export interface ShapeOptions extends CustomShapeOptions {
  /** Squircle corner smoothing 0..1 (1 = roundest). */
  smoothing?: number | string;
  /** Notch / ticket cut size, hexagon / octagon side cut; squircle corner size. */
  corner?: number | string;
  /** Wave: which edge waves. */
  edge?: 'top' | 'right' | 'bottom' | 'left' | 'all';
  /** Wave height. */
  amplitude?: number | string;
  /** Wave count along the edge. */
  waves?: number | string;
  /** Blob: deterministic random seed. */
  seed?: number | string;
  /** Blob irregularity 0..1. */
  wobble?: number | string;
  /** Blob morphs slowly / wave edge flows (motion, paused off-screen and for reduced motion). */
  animate?: boolean;
  /**
   * Internal (the card's wave animation frames): waves shifted by this many periods; every frame
   * then has the same path commands. Not an editor option.
   */
  phase?: number;
}

/** `design.value_background`: a fill level or history sparkline drawn behind the element's content. */
export interface ValueBackgroundConfig {
  /** `none`: off, also over a template's or the default design's value background. */
  type?: 'fill' | 'sparkline' | 'none';
  /** Default: the module's entity (rows / columns / card need one). */
  entity?: string;
  attribute?: string;
  /** Fill: default 0..100. Sparkline: default the data's own range. */
  min?: number | string;
  max?: number | string;
  /** A CSS colour, or `entity` / `entity N%` (the entity's state colour). */
  color?: string;
  /** Fill opacity / sparkline area opacity (`25%`, 0.25 or 25). */
  opacity?: number | string;
  /** Fill only. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Fill only: animated wave surface. */
  wave?: boolean;
  /** Sparkline only: history window in hours. */
  hours?: number | string;
  /** Sparkline only. */
  line_width?: number | string;
  /** Sparkline only: filled area under the line. */
  area?: boolean;
  /** Sparkline only: curved line. */
  smoothing?: boolean;
}

export type RingStart = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
export type RingPosition = 'inside' | 'center' | 'outside';

/**
 * An SVG outline that follows the element's rendered border radius. Value: filled to
 * (value - min) / (max - min) of an entity / attribute; animated: snake, pulse, full or chase dots.
 * No `mode` (or anything else) is off.
 */
/** A min / max: a number, or the numeric state (or attribute) of an entity. */
export type ValueBound = number | { entity: string; attribute?: string };

export interface RingConfig {
  mode?: RingMode;
  /** Value mode: default the module's entity. */
  entity?: string;
  attribute?: string;
  /** A number, or `{ entity, attribute? }` read from that entity (src/utils/value-bound.ts). */
  min?: ValueBound;
  max?: ValueBound;
  /** Value mode on a timer entity: the ring empties as time runs out (default) or fills up. */
  timer_fill?: 'remaining' | 'elapsed';
  /** Value mode: colour by value, like colour ranges ({ from, color }); a timer's remaining %. */
  thresholds?: ColorRange[];
  /** Value mode: CSS time of the fill transition (default 1s). */
  transition?: string;
  animation?: RingAnimation;
  /** Snake: segment length (% of the outline). */
  length?: number;
  /** Animated: CSS time of one lap / pulse (default 3s). */
  speed?: string;
  /** Stroke width in px (default 3). */
  width?: number;
  color?: string;
  track_color?: string;
  /** 0-100 (%), default 100 when a track colour is set. */
  track_opacity?: number;
  start?: RingStart;
  direction?: 'cw' | 'ccw';
  linecap?: 'round' | 'butt';
  /** drop-shadow blur in px (0 = off). */
  glow?: number;
  position?: RingPosition;
  /** Show only while: same Play options as animations (tap is not offered). */
  trigger?: AnimationTrigger;
  trigger_entity?: string;
  state?: string;
}

export interface CssAnimationConfig {
  type: 'none' | 'pulse' | 'bounce' | 'spin' | 'fade' | 'custom';
  duration?: string;
  delay?: string;
  iteration_count?: string;
  custom_keyframes?: string;
}

// ── Actions ──

export interface ActionsConfig {
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface ActionConfig {
  action: ActionType;
  entity?: string;
  use_module_entity?: boolean;
  navigation_path?: string;
  /** `popup` action: the pop-up ID to open (`#hash`); `close-popup` ignores it. */
  hash?: string;
  url_path?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  data?: Record<string, unknown>;
  confirmation?: ConfirmationConfig;
  haptic?: 'success' | 'warning' | 'failure' | 'light' | 'medium' | 'heavy' | 'selection';
}

export type ActionType =
  | 'none'
  | 'more-info'
  | 'toggle'
  | 'navigate'
  | 'url'
  | 'perform-action'
  | 'assist'
  | 'fire-dom-event'
  | 'popup'
  | 'close-popup';

export interface ConfirmationConfig {
  text?: string;
  exemptions?: Array<{ user: string }>;
}

// ── Editor ──

export type EditorMode = 'form' | 'yaml';

export type EditorTab = 'general' | 'actions' | 'conditions' | 'design' | 'flows';

export interface EditorPath {
  rowIndex?: number;
  columnIndex?: number;
  moduleIndex?: number;
  /** Below the module: layout children, outermost first (slot = row column / tab, 0 for flat lists). */
  childPath?: Array<{ slot: number; index: number }>;
  /** A tab / row-module column of the layout module at the path (a tree slot node). */
  slotIndex?: number;
}

export interface EditorState {
  config: MagicCardConfig;
  selectedPath: EditorPath | null;
  activeTab: EditorTab;
  editorMode: EditorMode;
  isDirty: boolean;
  /**
   * The flow picked on the studio canvas, by its key (`flowKeys`): highlighted there and opened in
   * Card settings → Flows. Selecting a row, column or module clears it.
   */
  selectedFlow?: string | null;
  /** The linked template's `custom_animations` (a list); the card config holds only its own. */
  templateAnimations?: Array<Record<string, unknown>>;
}

// ── Icon effects (SVG icon engine) ──

export type DeviceAnim = 'spin' | 'glow' | 'flame' | 'drum' | 'swing' | 'pulse' | 'snow' | 'shake' | 'eq';

export interface IconFillConfig {
  /** Value source; default: the module's entity (its numeric state). */
  entity?: string;
  attribute?: string;
  min?: number;
  max?: number;
  color?: string;
  /** Opacity of the unfilled icon (default 25%). */
  empty_color?: string;
  wave?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface IconColorsConfig {
  style?: 'solid' | 'duotone' | 'gradient' | 'value';
  primary?: string;
  secondary?: string;
  gradient?: string[];
  angle?: number;
}

/** `icon_fx`: effects drawn by <mc-svg-icon>. Without any, modules render today's <ha-icon>. */
export interface IconFxConfig {
  fill?: IconFillConfig;
  device?: DeviceAnim | 'auto' | 'off';
  draw?: 'off' | 'load' | 'change' | 'loop';
  draw_duration?: string;
  morph?: boolean;
  colors?: IconColorsConfig;
}

/** Keys of modules that draw a main icon through renderIcon(). */
export interface IconFxKeys {
  icon_fx?: IconFxConfig;
  /** Icon while the entity is on / off (also without a morph). */
  icon_on?: string;
  icon_off?: string;
  /**
   * Own SVG markup (max 32 KB, sanitised), drawn when the module's `icon` is the `svg` sentinel.
   * `class="mc-accent"` parts take the second colour (`icon_fx.colors.secondary`).
   */
  svg?: string;
}

// ── Module-Specific Config Extensions ──

export interface TextModuleConfig extends CardModule {
  type: 'text';
  text?: string;
  use_template?: boolean;
  /** Show an entity's state / attribute / name instead of the static text. */
  use_entity?: boolean;
  entity?: string;
  attribute?: string;
  /**
   * What the entity shows: its state (default), its name, "Name: state", or a timer's live remaining time.
   * Not `display`: that key holds every module's visibility conditions.
   */
  entity_display?: 'state' | 'name' | 'name_state' | 'remaining';
}

/** Colour from a value up: the range with the highest `from` at or below the value applies. */
export interface ColorRange {
  from: number;
  /** Older configs: the range ends here. */
  to?: number;
  color: string;
}

export interface IconModuleConfig extends CardModule, IconFxKeys {
  type: 'icon';
  icon?: string;
  size?: string;
  icon_color?: string;
  use_entity_icon?: boolean;
  /** Colour the icon like HA does for the entity's state (beats icon_color and the design colour). */
  use_entity_color?: boolean;
}

export interface InfoModuleConfig extends CardModule, IconFxKeys {
  type: 'info';
  attribute?: string;
  prefix?: string;
  suffix?: string;
  show_name?: boolean;
  show_state?: boolean;
  show_unit?: boolean;
  secondary_info?: string;
  /** Icon in front of the text: `icon`, else the entity's icon. */
  show_icon?: boolean;
  icon?: string;
}

export interface ImageModuleConfig extends CardModule {
  type: 'image';
  image?: string;
  entity_picture?: boolean;
  /** `16:9`, `16/9`, a number (1.5) or a percentage of the width (56.25%). */
  aspect_ratio?: string | number;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
}

export interface MarkdownModuleConfig extends CardModule {
  type: 'markdown';
  content?: string;
}

export interface BarModuleConfig extends CardModule {
  type: 'bar';
  min?: number;
  max?: number;
  severity?: ColorRange[];
  /** Decimals of the shown value (default: the entity's display precision). */
  decimals?: number;
  bar_height?: string;
  bar_color?: string;
  bar_background?: string;
  show_value?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export interface GraphsModuleConfig extends CardModule {
  type: 'graphs';
  hours_to_show?: number;
  points_per_hour?: number;
  line_color?: string;
  line_width?: number;
  fill?: boolean;
  fill_color?: string;
  show_points?: boolean;
  show_labels?: boolean;
}

export interface CameraModuleConfig extends CardModule {
  type: 'camera';
  aspect_ratio?: string | number;
  /** Live stream (default) or a snapshot refreshed every `refresh_interval` seconds. */
  camera_view?: 'live' | 'snapshot';
  refresh_interval?: number;
  show_controls?: boolean;
}

export interface ButtonModuleConfig extends CardModule, IconFxKeys {
  type: 'button';
  label?: string;
  icon?: string;
  show_state?: boolean;
  /** Show this attribute (formatted by HA) instead of the state. */
  attribute?: string;
  /** The entity's icon (as HA picks it) instead of `icon`. */
  use_entity_icon?: boolean;
  /** Colour the icon like HA does for the entity's state. */
  use_entity_color?: boolean;
  button_style?: 'default' | 'outline' | 'flat' | 'icon-only';
}

export interface SliderModuleConfig extends CardModule {
  type: 'slider';
  attribute?: string;
  show_value?: boolean;
  /** Narrow the entity's range / its step (empty: the entity's own). */
  min?: number;
  max?: number;
  step?: number;
  slider_color?: string;
  track_color?: string;
  direction?: 'horizontal' | 'vertical';
}

export interface SpinboxModuleConfig extends CardModule {
  type: 'spinbox';
  min?: number;
  max?: number;
  step?: number;
  attribute?: string;
}

export interface DropdownModuleConfig extends CardModule {
  type: 'dropdown';
  /** Own labels / a subset of the entity's options; YAML may list plain strings. */
  options?: Array<{ label: string; value: string } | string>;
  attribute?: string;
}

export interface LightModuleConfig extends CardModule, IconFxKeys {
  type: 'light';
  /** Own icon; empty shows the light's entity icon (mdi:lightbulb without one). */
  icon?: string;
  show_brightness?: boolean;
  show_color_temp?: boolean;
  show_color?: boolean;
  /** Effect list (lights with effects). */
  show_effect?: boolean;
  compact?: boolean;
}

export interface GaugeModuleConfig extends CardModule {
  type: 'gauge';
  min?: number;
  max?: number;
  severity?: ColorRange[];
  needle?: boolean;
  show_name?: boolean;
  show_unit?: boolean;
  decimals?: number;
  gauge_style?: 'full' | 'half' | 'quarter';
}

export interface HorizontalModuleConfig extends CardModule {
  /** Pass this layout's own `entity` to the modules inside (absent = false). */
  share_entity?: boolean;
  type: 'horizontal';
  modules?: CardModule[];
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export interface VerticalModuleConfig extends CardModule {
  /** Pass this layout's own `entity` to the modules inside (absent = false). */
  share_entity?: boolean;
  type: 'vertical';
  modules?: CardModule[];
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

/** A row module's column: settings like a card column (ids are added by the editor; old configs have none). */
export interface NestedColumnConfig extends EntityScopeNode {
  id?: string;
  modules: CardModule[];
  gap?: string;
  padding?: string;
  vertical_align?: 'start' | 'center' | 'end' | 'stretch';
  display?: DisplayConfig;
  design?: DesignConfig;
  /** Studio Hide: not shown on the dashboard (the studio shows it dimmed). */
  hidden?: boolean;
  /** Editor-only layer name (tree and canvas labels); never shown on the dashboard. */
  editor_name?: string;
}

export interface RowModuleConfig extends CardModule {
  /** Pass this layout's own `entity` to the modules inside (absent = false). */
  share_entity?: boolean;
  type: 'row';
  columns?: NestedColumnConfig[];
  layout?: string;
  /** One width per column, like a card row's; overrides `layout` when present. */
  column_widths?: string[];
  gap?: string;
  padding?: string;
}

export interface TabsModuleConfig extends CardModule, IconFxKeys {
  /** Pass this layout's own `entity` to the modules inside (absent = false). */
  share_entity?: boolean;
  type: 'tabs';
  tabs?: Array<{
    label: string;
    icon?: string;
    modules: CardModule[];
    /** Studio Hide: the tab is left out on the dashboard. */
    hidden?: boolean;
  }>;
  active_tab?: number;
  tab_style?: 'default' | 'pills' | 'underline';
}

export interface SeparatorModuleConfig extends CardModule {
  type: 'separator';
  separator_style?: 'solid' | 'dashed' | 'dotted' | 'none';
  separator_color?: string;
  separator_width?: string;
  direction?: 'horizontal' | 'vertical';
}

export interface SliderLayoutModuleConfig extends CardModule {
  /** Pass this layout's own `entity` to the modules inside (absent = false). */
  share_entity?: boolean;
  type: 'slider-layout';
  modules?: CardModule[];
  pagination?: boolean;
  navigation?: boolean;
  /** Slides visible at once (fractions peek at the next slide). Default 1. */
  slides_per_view?: number;
  /** Gap between slides in px. Default 8. */
  space_between?: number;
  /** After the last slide go back to the first (Swiper `rewind`). */
  loop?: boolean;
  autoplay?: boolean;
  /** Autoplay delay in ms. Default 5000. */
  autoplay_delay?: number;
}

export interface ClockModuleConfig extends CardModule {
  type: 'clock';
  format_12h?: boolean;
  show_seconds?: boolean;
  show_date?: boolean;
  date_format?: string;
}

export interface WeatherModuleConfig extends CardModule, IconFxKeys {
  type: 'weather';
  /** Animated weather icons instead of HA's static ones (new modules: on). */
  animated_icons?: boolean;
  show_temperature?: boolean;
  show_condition?: boolean;
  show_forecast?: boolean;
  forecast_days?: number;
}

export interface ForecastModuleConfig extends CardModule, IconFxKeys {
  type: 'forecast';
  /** Animated weather icons instead of HA's static ones (new modules: on). */
  animated_icons?: boolean;
  forecast_type?: 'daily' | 'hourly' | 'twice_daily';
  num_forecasts?: number;
  show_temperature?: boolean;
  show_precipitation?: boolean;
  show_wind?: boolean;
}

export interface VideoBgModuleConfig extends CardModule {
  type: 'video-bg';
  url?: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** How the video fills its area (default cover). */
  fit?: 'cover' | 'contain';
}

export interface CustomCardModuleConfig extends CardModule {
  type: 'custom-card';
  name?: string;
  card_type?: string;
  card_config?: Record<string, unknown>;
  card_config_yaml?: string;
}

// ── Event types ──

export interface ConfigChangedEvent {
  config: MagicCardConfig;
}

// ── HA Lovelace types ──

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: MagicCardConfig): void;
  getCardSize?(): number;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  lovelace?: unknown;
  setConfig(config: MagicCardConfig): void;
}
