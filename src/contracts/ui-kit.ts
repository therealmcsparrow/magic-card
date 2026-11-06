// Contract: ui kit. Version 1.3.0. The card editor (src/editor/ + src/css/editor-system) is the base look; the kit
// is extracted FROM it (single source), not designed in parallel, so every screen has the same look and feel.
// Tags are `mc-ui-*`; `mc-*` alone is the namespace of the card's own elements such as mc-path-menu.

export * from './ui-kit-lips';

export const UI_KIT_CONTRACT_VERSION = '1.3.0';
export const UI_KIT_CONTRACT_REVISION = 6;

/**
 * Plain Event on window that the Pseudo RTL switch dispatches right after it sets or removes `dir` on the studio and
 * its preview. Nothing else dispatches it: a Home Assistant language change reaches listeners through the `dir`
 * attribute of document.documentElement. The DirectionController, the card slider track and the card ring listen.
 */
export const DIR_CHANGE_EVENT = 'mc-dir-change';

/** Text direction as the kit reads it. Anything that is not 'rtl' reads as 'ltr'. */
export type KitDirection = 'ltr' | 'rtl';

/** Whether a glyph turns with the reading direction (arrows, chevrons) or keeps its drawing (clocks, media, brand marks). */
export type GlyphDirection = 'mirror' | 'keep';

export const UI_MENU_TAG = 'mc-ui-menu';
export const UI_WINDOW_TAG = 'mc-ui-window';
export const UI_POPOVER_TAG = 'mc-ui-popover';
/** Toast element. */
export const UI_TOAST_TAG = 'mc-ui-toast';
/** Disclosure row, picture tiles and picture chips with manual activation. */
export const UI_DISCLOSURE_TAG = 'mc-ui-disclosure';
export const UI_TILE_GROUP_TAG = 'mc-ui-tile-group';
export const UI_CHIP_GROUP_TAG = 'mc-ui-chip-group';

/** Class names only src/ui-kit/ may write rules for (selector scan test). */
export const KIT_CLASSES = [
  'btn', 'btn-primary', 'btn-secondary', 'btn-text', 'btn-danger', 'btn-sm', 'icon-btn',
  'field', 'field-head', 'lbl', 'help', 'input', 'select', 'unit', 'with-icon', 'with-action', 'field-action',
  'color', 'swatch', 'field-reset', 'check', 'switch', 'switch-row', 'chip', 'seg', 'tiles', 'tile',
  'group', 'group-head', 'sectors', 'sector', 'sector-btn', 'sector-body', 'rows', 'row',
  'toolbar', 'rail', 'topbar', 'notice', 'result-note', 'toast', 'empty', 'slider-row', 'menu', 'lip',
] as const;
export type KitClass = (typeof KIT_CLASSES)[number];

/** Colour and base tokens the kit reads. They live in editorTokens (Core). */
export const KIT_TOKENS = [
  '--mc-accent', '--mc-accent-ink', '--mc-accent-fill', '--mc-on-accent', '--mc-accent-tint',
  '--mc-surface', '--mc-surface-2', '--mc-ground', '--mc-text', '--mc-text-2', '--mc-divider',
  '--mc-field-border', '--mc-warn-ink', '--mc-warn-tint', '--mc-error-ink', '--mc-success',
  '--mc-shadow-float', '--mc-mono', '--mc-radius', '--mc-radius-lg',
] as const;
/** Added to editorTokens (Core): the only Core token change. */
export const NEW_TOKENS = [
  '--mc-hit', '--mc-font', '--mc-focus', '--mc-error-tint', '--mc-error-fill', '--mc-success-ink', '--mc-success-tint',
  '--mc-scrim',
] as const;
/**
 * Kit-scoped geometry and motion tokens, declared by the `kitTokens` part on :host (Module, not Core; no colours).
 * A screen may override them on its :host like any token.
 */
export const KIT_SCOPED_TOKENS = [
  '--mc-hit-sm', '--mc-hit-xs', '--mc-radius-tag', '--mc-radius-seg', '--mc-radius-xl', '--mc-ease',
  '--mc-shadow-dialog',
] as const;

// ── Layer 2: template helpers ────────────────────────────────────────────────

/** lit TemplateResult (typed loosely so the contract does not import lit). */
export type KitTemplate = unknown;

export interface KitIcon {
  /** HA icon name, e.g. "mdi:undo" (rendered as <ha-icon>). */
  icon?: string;
  /** Kit glyph (24 x 24 stroke set). Wins over `icon`. */
  glyph?: string;
}

export interface KitButtonOptions extends KitIcon {
  label: string;
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'md' | 'sm';
  /** Icon-only button: `label` becomes aria-label and title. */
  iconOnly?: boolean;
  pressed?: boolean;
  /** Disabled but focusable; `reason` is the visible / described reason. */
  disabledReason?: string;
  disabled?: boolean;
  keys?: string;
  haspopup?: 'menu' | 'dialog';
  expanded?: boolean;
  controls?: string;
  onClick: (e: MouseEvent) => void;
}

export interface KitFieldOptions {
  id: string;
  label: string;
  help?: string;
  error?: string;
  /** Shows the reset icon button in the head when set. */
  onReset?: () => void;
  resetLabel?: string;
  /** The control itself (input, select, unit, colour, slider), rendered by the caller with kit classes. */
  control: KitTemplate;
}

export interface KitChoice<V extends string = string> extends KitIcon {
  value: V;
  label: string;
  disabledReason?: string;
}

export interface KitSegOptions<V extends string = string> {
  /** tablist for tabs (aria-selected), radiogroup for a segmented choice (aria-checked). */
  role: 'tablist' | 'radiogroup';
  label: string;
  items: KitChoice<V>[];
  value: V;
  full?: boolean;
  onChange: (v: V) => void;
}

export interface KitTileOptions<V extends string = string> {
  label: string;
  items: (KitChoice<V> & { preview?: KitTemplate })[];
  value?: V;
  onPick: (v: V) => void;
}

export interface KitRowOptions extends KitIcon {
  id: string;
  name: string;
  level?: number;
  selected?: boolean;
  expanded?: boolean;
  /** Drag grip shown; drag itself stays in the caller (svg-editor E3 rules). */
  grip?: boolean;
  /** Trailing icon buttons (hide, lock, more). */
  actions?: KitButtonOptions[];
  /** Optional; a `check` row selects through its checkbox. */
  onSelect?: (e: MouseEvent | KeyboardEvent) => void;
  /** Second line under the name (mono), e.g. the id. */
  sub?: string;
  /** Leading `.check` checkbox; the name becomes its <label> (multi-select list). The row tints
   *  while checked. `label` is the checkbox's accessible name. */
  check?: { label: string; checked: boolean; onChange: (v: boolean) => void };
  /** A host's leading node (e.g. a shape thumbnail), drawn after the icon and
   *  before the name. Decorative content must be aria-hidden; the name stays the row's accessible text. */
  lead?: KitTemplate | Node;
  /** Replaces the name (inline rename input). */
  content?: KitTemplate;
  /** Rendered after the actions (inline delete confirmation). */
  trail?: KitTemplate;
}

export interface KitNoticeOptions {
  tone: 'info' | 'warn' | 'error' | 'success';
  text: string | string[];
  action?: { label: string; onClick: () => void };
  /** Adds .result-note: the result of an action; the caller clears it on the next edit, a mode change,
   *  or after 8 s without pointer or focus inside. role=status, or role=alert for refusals. */
  transient?: boolean;
}

export interface KitSliderOptions {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onInput: (v: number) => void;
  onChange: (v: number) => void;
  /** Aria-valuetext of the range (e.g. "90 degrees, pointing right"). */
  valueText?: string;
  /** Accessible name of the number field; default `label`. */
  numberLabel?: string;
  /** Disables the range and the number field. */
  disabled?: boolean;
}

export interface KitTopBarOptions {
  back: { label: string; onClick: () => void };
  title: string;
  /** Name field, 180 px, visible placeholder in host mcu. */
  name?: { label: string; placeholder?: string; value: string; error?: string; onInput: (v: string) => void };
  undo?: KitButtonOptions;
  redo?: KitButtonOptions;
  /** Right-hand actions in order; exactly one primary. */
  actions: KitButtonOptions[];
  help?: KitButtonOptions;
}

export interface KitLegalTextOptions {
  /** The text in the user's language. */
  text: string;
  /** The English text; shown in place of `text` while `showEnglish` is on. */
  english: string;
  /** False in English: the text stands alone, with no label and no button. */
  translated: boolean;
  showEnglish: boolean;
  onToggle: () => void;
  /** The "English prevails" label and the Show English action text. */
  prevailsLabel: string;
  showLabel: string;
  /** Id of the text element; the button controls it. */
  id: string;
}

export interface UiKitTemplates {
  button(o: KitButtonOptions): KitTemplate;
  legalText(o: KitLegalTextOptions): KitTemplate;
  field(o: KitFieldOptions): KitTemplate;
  switchRow(o: { id: string; label: string; help?: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void }): KitTemplate;
  chip(o: { label: string; tone?: 'accent' | 'warn' | 'count'; pressed?: boolean; onClick?: () => void } & KitIcon): KitTemplate;
  seg<V extends string>(o: KitSegOptions<V>): KitTemplate;
  tiles<V extends string>(o: KitTileOptions<V>): KitTemplate;
  sectionHead(o: { title: string; level?: 3 | 4; collapsible?: boolean; expanded?: boolean; onToggle?: () => void } & KitIcon): KitTemplate;
  row(o: KitRowOptions): KitTemplate;
  toolbar(o: { label: string; orientation: 'horizontal' | 'vertical'; kind: 'float' | 'rail'; items: (KitButtonOptions | 'divider')[] }): KitTemplate;
  topBar(o: KitTopBarOptions): KitTemplate;
  notice(o: KitNoticeOptions): KitTemplate;
  slider(o: KitSliderOptions): KitTemplate;
  empty(o: { title: string; text?: string; action?: KitButtonOptions } & KitIcon): KitTemplate;
  glyph(name: string, size?: 18 | 20 | 24): KitTemplate;
}

// ── Layer 3: elements ────────────────────────────────────────────────────────

/** Same shape as path-canvas MenuEntry; the path canvas re-exports this. */
export interface UiMenuEntry {
  id: string;
  label: string;
  /** Optional help line under the label ; also the item's accessible description unless `reason` is set. */
  sub?: string;
  /** Shortcut hint on fine pointers and aria-keyshortcuts, e.g. "Control+D". */
  keys?: string;
  /** Set = unavailable (aria-disabled, still focusable); the text says why. */
  reason?: string;
  /** Set = menuitemcheckbox. */
  checked?: boolean;
  /** Danger tone (Delete). */
  danger?: boolean;
  glyph?: string;
  icon?: string;
  separatorBefore?: boolean;
  /** One submenu level; entries inside must not have `items`. */
  items?: UiMenuEntry[];
}

/** Event 'mc-menu-pick' (bubbles, composed). Same name and detail as path-canvas. */
export interface UiMenuPick {
  id: string;
}
/** Event 'mc-menu-close' (bubbles, composed). */
export interface UiMenuClose {
  reason: 'pick' | 'escape' | 'outside' | 'tab';
}

/**
 * <mc-ui-menu>: action / overflow / context menu. Built from <mc-path-menu> (data API, roving focus,
 * one submenu level, coarse 44 px items) and MenuPopover (top layer through the Popover API, flips up,
 * follows scroll in every shadow root; fixed-position fallback without the Popover API). No strings
 * of its own. CSS parts: menu, item, item-glyph, item-label, item-keys, item-why, separator, submenu.
 */
export interface UiMenuElement extends HTMLElement {
  items: UiMenuEntry[];
  /** Accessible name, e.g. "Shape actions". */
  label: string;
  /** Open at a viewport point (right-click, long-press) ... */
  at?: [number, number];
  /** ... or under / over this element (menu button). */
  anchor?: HTMLElement;
  align?: 'start' | 'end';
  touch?: boolean;
  /** Focus returns here on close without a pick (default: anchor). */
  opener?: HTMLElement;
  readonly open: boolean;
  show(): void;
  close(reason?: UiMenuClose['reason']): void;
}

/** Event 'mc-window-close' (bubbles, composed). */
export interface UiWindowClose {
  reason: 'close-button' | 'escape' | 'scrim' | 'action';
}

/**
 * <mc-ui-window>: one modal window for dialogs, pickers, confirmations and bottom sheets. Native <dialog> +
 * showModal() inside its shadow root (top layer, real focus trap, ::backdrop scrim --mc-scrim). Escape: the
 * 'cancel' event is handled (EscGuard): it closes this window only and never reaches HA's card dialog.
 */
export interface UiWindowElement extends HTMLElement {
  heading: string;
  /** Close button label (i18n from the caller). */
  closeLabel: string;
  /** dialog: size m; picker: size l; alert: role=alertdialog, size s, no scrim close;
   *  sheet: bottom sheet (r 16 16 0 0, max 60vh) at compact width, dialog otherwise. */
  variant: 'dialog' | 'picker' | 'alert' | 'sheet';
  /** Width, overriding the variant's default: s 420, m 480, l 640, xl 880 px (preset grids);
   *  always max-width 100 %, max-height min(80vh, 720px). Attribute `size`. The xl rule is added by the
   *  first screen that opens an 880 px grid; until then no caller passes 'xl'. */
  size?: 's' | 'm' | 'l' | 'xl';
  /** Element (by id inside the slotted content) that gets focus first; default the first focusable. */
  initialFocus?: string;
  opener?: HTMLElement;
  /** Scrim click closes (default true, never for 'alert'). */
  dismissible?: boolean;
  /** Header drag plus the move grip. Attribute `movable`. Default false. */
  movable?: boolean;
  /** Corner resize grip. Attribute `resizable`. Default false. */
  resizable?: boolean;
  /** Maximise / restore button. Attribute `maximizable`. Default false. */
  maximizable?: boolean;
  /** Current maximised state; settable, reflected as attribute `maximized`. Reset to false on close. */
  maximized?: boolean;
  /** Accessible names from the caller (British copy, e.g. "Move window", "Resize window",
   *  "Maximise", "Restore size"). */
  moveLabel?: string;
  resizeLabel?: string;
  maximizeLabel?: string;
  restoreLabel?: string;
  readonly open: boolean;
  show(): void;
  close(reason?: UiWindowClose['reason']): void;
}

/** Event 'mc-popover-close' (bubbles, composed). */
export interface UiPopoverClose {
  reason: 'escape' | 'outside' | 'tab' | 'action';
}

/**
 * <mc-ui-popover>: non-modal anchored panel (Shortcuts help, colour pop, Preview overlay controls).
 * Popover API (top layer) with the MenuPopover placement; Esc and outside click close; focus returns
 * to the anchor; the anchor carries aria-expanded / aria-controls (caller). Not a dialog: no aria-modal.
 * Slot: default. CSS parts: panel.
 */
export interface UiPopoverElement extends HTMLElement {
  anchor: HTMLElement;
  label: string;
  align?: 'start' | 'end';
  readonly open: boolean;
  show(): void;
  close(reason?: UiPopoverClose['reason']): void;
}

/** Event 'mc-toast-action' (bubbles, composed): the toast's action button was pressed. */
export interface UiToastAction {
  id: string;
}

/**
 * <mc-ui-toast>: transient confirmation of an action that needs no decision ("Copied SVG"). One per screen root; a
 * new show() replaces the current message. Look: `.toast`, bottom centre, `offset` px above the bottom edge. Top
 * layer (popover="manual") so it shows above an open <mc-ui-window>.
 */
export interface UiToastElement extends HTMLElement {
  /** Default 16. Raise it when a save bar sits at the bottom. */
  offset?: number;
  /** Accessible name of the close button (44 px). Without it there is no button; Escape still closes. */
  dismissLabel?: string;
  readonly open: boolean;
  show(o: { text: string; action?: { id: string; label: string }; duration?: number }): void;
  close(): void;
}

/**
 * <mc-ui-disclosure>: a collapsible section row (button with aria-expanded, a heading around it). `heading` is the
 * title (never truncated), `summary` a short state line after it (truncates, wraps under the title when narrow;
 * part of the button's accessible name).
 */
export interface UiDisclosureElement extends HTMLElement {
  heading: string;
  summary?: string;
  open: boolean;
  level?: number;
}

/** One choice of a tile or chip group. `preview` is static SVG markup from a chunk constant (never config). */
export interface UiChoice {
  value: string;
  label: string;
  /** One line shown under the group for the focused or selected choice. */
  description?: string;
  preview?: string;
}

/** Event 'mc-pick' (bubbles, composed): a choice was selected (Space, Enter or click). */
export interface UiChoicePick {
  value: string;
}

/**
 * <mc-ui-tile-group> and <mc-ui-chip-group>: MANUAL activation. Buttons with aria-pressed in a role=group named
 * `label`; one tab stop (roving); Left / Right / Up / Down / Home / End move focus only; Space, Enter or a click
 * fire 'mc-pick'.
 */
export interface UiChoiceGroupElement extends HTMLElement {
  label: string;
  items: UiChoice[];
  value?: string;
}

/** src/ui-kit/index.ts exports this; the card-editor chunk, the studio and the theme editor call it once. */
export interface UiKitModule {
  version: typeof UI_KIT_CONTRACT_VERSION;
  revision: number;
  /** Guarded define of the kit elements. Safe to call more than once and from several bundles. */
  defineUiKit(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-ui-menu': UiMenuElement;
    'mc-ui-window': UiWindowElement;
    'mc-ui-popover': UiPopoverElement;
    'mc-ui-toast': UiToastElement;
    'mc-ui-disclosure': UiDisclosureElement;
    'mc-ui-tile-group': UiChoiceGroupElement;
    'mc-ui-chip-group': UiChoiceGroupElement;
  }
}
