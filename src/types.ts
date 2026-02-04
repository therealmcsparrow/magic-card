// ── Home Assistant types (subset) ──

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  services: Record<string, Record<string, HassService>>;
  themes: HassThemes;
  language: string;
  locale: HassLocale;
  callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<void>;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  connection: {
    subscribeMessage: <T>(
      callback: (msg: T) => void,
      msg: Record<string, unknown>,
    ) => Promise<() => void>;
  };
  formatEntityState: (entity: HassEntity) => string;
  formatEntityAttributeValue: (entity: HassEntity, attribute: string) => string;
  formatEntityAttributeName: (entity: HassEntity, attribute: string) => string;
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
}

export interface HassLocale {
  language: string;
  number_format: string;
  time_format: string;
}

// ── Card Configuration ──

export interface MagicCardConfig {
  type: string;
  name?: string;
  rows: RowConfig[];
  background?: string;
  border_radius?: string;
  padding?: string;
  box_shadow?: string;
  card_height?: string;
  overflow?: 'visible' | 'hidden' | 'auto';
  css?: string;
}

export interface RowConfig {
  id: string;
  columns: ColumnConfig[];
  layout?: string; // '1' | '1-1' | '1-2' | '2-1' | '1-1-1' | custom grid
  gap?: string;
  padding?: string;
  display?: DisplayConfig;
  design?: DesignConfig;
  actions?: ActionsConfig;
}

export interface ColumnConfig {
  id: string;
  modules: CardModule[];
  gap?: string;
  padding?: string;
  vertical_align?: 'start' | 'center' | 'end' | 'stretch';
  display?: DisplayConfig;
  design?: DesignConfig;
}

// ── Module Configuration ──

export interface CardModule {
  id: string;
  type: ModuleType;
  entity?: string;
  display?: DisplayConfig;
  design?: DesignConfig;
  actions?: ActionsConfig;
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
  | 'tabs'
  | 'separator'
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
  animation?: AnimationConfig;

  // Hover
  hover?: Partial<DesignConfig>;

  // CSS override
  css?: string;
}

export interface AnimationConfig {
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
  navigation_path?: string;
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
  | 'fire-dom-event';

export interface ConfirmationConfig {
  text?: string;
  exemptions?: Array<{ user: string }>;
}

// ── Editor ──

export type EditorMode = 'form' | 'yaml' | 'tree';

export type EditorTab = 'general' | 'actions' | 'conditions' | 'design';

export interface EditorPath {
  rowIndex?: number;
  columnIndex?: number;
  moduleIndex?: number;
}

export interface EditorState {
  config: MagicCardConfig;
  selectedPath: EditorPath | null;
  activeTab: EditorTab;
  editorMode: EditorMode;
  isDirty: boolean;
}

// ── Module-Specific Config Extensions ──

export interface TextModuleConfig extends CardModule {
  type: 'text';
  text?: string;
  use_template?: boolean;
}

export interface IconModuleConfig extends CardModule {
  type: 'icon';
  icon?: string;
  size?: string;
  icon_color?: string;
  use_entity_icon?: boolean;
}

export interface InfoModuleConfig extends CardModule {
  type: 'info';
  attribute?: string;
  prefix?: string;
  suffix?: string;
  show_name?: boolean;
  show_state?: boolean;
  show_unit?: boolean;
  secondary_info?: string;
}

export interface ImageModuleConfig extends CardModule {
  type: 'image';
  image?: string;
  entity_picture?: boolean;
  aspect_ratio?: string;
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
  severity?: Array<{ from: number; to: number; color: string }>;
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
  aspect_ratio?: string;
  show_controls?: boolean;
}

export interface ButtonModuleConfig extends CardModule {
  type: 'button';
  label?: string;
  icon?: string;
  show_state?: boolean;
  button_style?: 'default' | 'outline' | 'flat' | 'icon-only';
}

export interface SliderModuleConfig extends CardModule {
  type: 'slider';
  min?: number;
  max?: number;
  step?: number;
  attribute?: string;
  show_value?: boolean;
  slider_color?: string;
  track_color?: string;
  thumb_size?: string;
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
  options?: Array<{ label: string; value: string }>;
  attribute?: string;
}

export interface LightModuleConfig extends CardModule {
  type: 'light';
  show_brightness?: boolean;
  show_color_temp?: boolean;
  show_color?: boolean;
  compact?: boolean;
}

export interface GaugeModuleConfig extends CardModule {
  type: 'gauge';
  min?: number;
  max?: number;
  severity?: Array<{ from: number; to: number; color: string }>;
  needle?: boolean;
  gauge_style?: 'full' | 'half' | 'quarter';
}

export interface HorizontalModuleConfig extends CardModule {
  type: 'horizontal';
  modules?: CardModule[];
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export interface VerticalModuleConfig extends CardModule {
  type: 'vertical';
  modules?: CardModule[];
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export interface TabsModuleConfig extends CardModule {
  type: 'tabs';
  tabs?: Array<{
    label: string;
    icon?: string;
    modules: CardModule[];
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

export interface ClockModuleConfig extends CardModule {
  type: 'clock';
  format_12h?: boolean;
  show_seconds?: boolean;
  show_date?: boolean;
  date_format?: string;
}

export interface WeatherModuleConfig extends CardModule {
  type: 'weather';
  show_temperature?: boolean;
  show_condition?: boolean;
  show_forecast?: boolean;
  forecast_days?: number;
}

export interface ForecastModuleConfig extends CardModule {
  type: 'forecast';
  forecast_type?: 'daily' | 'hourly';
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
