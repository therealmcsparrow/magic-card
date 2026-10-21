/*
 * Contract: ui kit. Version 1.1.0.
 * The card editor (src/editor/ + src/css/editor-system) is the base look; the kit is extracted FROM it
 * (single source), not designed in parallel, so every screen has the same look and feel.
 *
 * Names:
 * - Tags are `mc-ui-*` (`mc-*` alone is the namespace of the card's own elements such as mc-path-menu):
 *   <mc-ui-window> (size 's'|'m'|'l'|'xl'; variant 'alert' for a confirm, 'sheet'), <mc-ui-menu>,
 *   <mc-ui-popover>, <mc-ui-toast>, <mc-ui-disclosure>, <mc-ui-tile-group>, <mc-ui-chip-group>.
 * - Hit size tokens are --mc-hit / --mc-hit-sm / --mc-hit-xs; --mc-radius-tag is the tag radius (the
 *   card's src/css/tokens.ts already has --mc-radius-sm: 4px). A "result of an action" notice is
 *   .notice.result-note (notice({ transient: true })); a tree row's small button is .row + .icon-btn.xs;
 *   the topbar is 56 px; the dialog width is 480.
 * - Kit-scoped tokens (KIT_SCOPED_TOKENS), `.toast` and `.check` are in KIT_CLASSES. --mc-accent-src is
 *   not used (it would rewrite every accent formula in Core editorTokens; the theme editor keeps
 *   overriding the accent tokens on its :host, as allowed below).
 *
 * Behaviour:
 * - Window: header drag, corner resize and maximise (UiWindowElement movable / resizable / maximizable /
 *   maximized and four caller labels; parts move, resize, maximize), with keyboard and single-pointer
 *   alternatives (WCAG 2.1.1, 2.5.7) and no persistence. Every non-alert window turns all three on, so
 *   the nine card-editor pickers, the module selector, the SVG editor's Start window and the studio
 *   dialogs behave the same. A scrim close needs press and release on the scrim. The footer shows from
 *   the first render, so a footer button can take the first focus (an alert's initialFocus).
 * - KitSliderOptions has valueText / numberLabel / disabled; KitRowOptions has sub / check / content /
 *   trail, an optional onSelect and an optional `lead`, a host's leading node drawn after the icon and
 *   before the name (the library view's shape thumbnail). Row templates only; no element changes.
 * - UiMenuEntry has an optional `sub`, a help line under the label (also the item's accessible
 *   description unless `reason` is set).
 * - <mc-ui-toast> has `dismissLabel` (a 44 px close button), Escape closes it, and a press inside it
 *   pauses the timer until the pointer is released.
 * - <mc-ui-disclosure>, <mc-ui-tile-group> and <mc-ui-chip-group> (UiDisclosureElement,
 *   UiChoiceGroupElement below). Tile and chip groups use MANUAL activation: aria-pressed buttons in
 *   role=group with a roving tabindex; arrows, Home and End move focus only; Space, Enter or a click
 *   select.
 *
 * ── Module and placement ──
 * Module `ui-kit`, folder src/ui-kit/. NOT Core. Three layers, all shared at SOURCE level:
 *   1. CSS parts (src/ui-kit/css/*.ts): lit CSSResult per component family, plus `kitCss` = all parts.
 *      Colours come only from Core tokens (src/css/editor-system.ts `editorTokens`). Geometry and motion
 *      tokens the kit adds itself (KIT_SCOPED_TOKENS) are declared on :host by the `kitTokens` part
 *      (Module-owned, no colours, so no Core change); every use carries the literal as var() fallback.
 *   2. Template helpers (src/ui-kit/templates/*.ts) and controllers (src/ui-kit/controllers/*.ts):
 *      functions that return lit templates rendered in the CALLER's shadow root (light DOM there), so
 *      labels, aria-labelledby, aria-describedby and forms keep working; each bundle compiles its own copy.
 *   3. Elements (src/ui-kit/elements/*.ts): only where top layer or focus management is needed:
 *      UI_MENU_TAG, UI_WINDOW_TAG, UI_POPOVER_TAG, UI_TOAST_TAG. Defined once, guarded (defineUiKit()).
 *
 * Physical copies (webpack splitChunks: false):
 * - magic-card-editor.js imports src/ui-kit/index.ts statically (the ONE copy for the editor family).
 *   Every chunk loaded below it (svg-editor, shape-editor, path-canvas, path-tools, svg-booleans,
 *   transfer) imports src/ui-kit/** statically and webpack leaves those modules out, because they are
 *   available in a parent chunk (the same rule that keeps lit, js-yaml and model.ts out of the transfer
 *   and path-tools chunks today). The stats.json of a build shows it.
 *   Rule: a child chunk may import only src/ui-kit/ files that src/ui-kit/index.ts reaches.
 * - magic-card-animation-studio.js and magic-card-theme-editor.js (own entries, own lit) compile their
 *   own copy of the parts they import. Same source, same release.
 * - magic-card.js: never. Import scan: nothing reachable from src/index.ts imports src/ui-kit/ (+0 B).
 * - Magic Card Utils panel (plain JS, vendored lit 3.3.3): a generated CSS-only copy,
 *   www/mc-ui-kit.js, made by tools/export-ui-kit.mjs in this repo from layer 1 and the tokens (no
 *   templates, no elements). Recorded in MCU's VENDORED.md with the Magic Card version and SHA-256.
 *   When an MCU tab has loaded Magic Card's editor chunk or studio, the kit elements are defined and the
 *   panel may use them by tag (DOM API only, see "Bundle boundary").
 *
 * ── Bundle boundary (Lit instance identity) ──
 * Elements may be defined by any of three lit copies (editor family, studio entry, theme editor entry)
 * and used from a fourth (MCU's vendored lit). So their public API is DOM-level only:
 * attributes, properties holding plain data (JSON-like, HTMLElement refs), slots, DOM CustomEvents
 * (bubbles, composed). Never a lit TemplateResult, directive, CSSResult or class instance across the
 * boundary. A stylesheet handed across a bundle is a native CSSStyleSheet, never a CSSResult.
 *
 * ── Define once ──
 * defineUiKit() calls customElements.define(tag, cls) only when customElements.get(tag) is undefined.
 * Every element class has `static uiKitRevision = UI_KIT_CONTRACT_REVISION`. When a tag already exists
 * with a lower revision, the kit logs one console.debug and keeps it (an element cannot be redefined);
 * within major 1 every change is additive, so an older definition still serves newer callers, minus the
 * new optional props. The editor-family copy and the entry copies ship in the same release (HACS
 * installs every dist file together); skew only happens with a stale browser cache.
 * Defining happens in install-style code (defineUiKit()), never at module top level of a lazy chunk
 * (lazy-module 1.0.0 rule). The card-editor chunk calls it once when it loads; the studio and the theme
 * editor call it from their entry.
 *
 * ── Styling rules (drift guard, tested) ──
 * - A screen styles its own LAYOUT only. It may not write rules for kit class names (KIT_CLASSES) in its
 *   own sheets; selector scan test over src/ (excluding src/ui-kit/ and the legacy sheet).
 * - A screen may override TOKENS on its :host (the theme editor keeps its fixed accent).
 * - Hit size comes from --mc-hit / --mc-hit-sm / --mc-hit-xs (40 / 32 / 24 px fine, all 44 px coarse);
 *   focus is :focus-visible 2 px --mc-focus.
 * - Font: --mc-font (HA's body font with Roboto, system-ui fallback). Layers stop setting system-ui.
 * - Kit CSS is in the minify-templates loader include list (webpack.config.js) in production builds.
 *
 * ── Layer 1: CSS parts (class conventions) ──
 * Each part is a CSSResult in src/ui-kit/css/; names from editor-system.ts where they exist.
 * kitTokens   :host declarations of KIT_SCOPED_TOKENS, coarse-pointer overrides included
 * kitBase     *, focus-visible, ::selection, .sr-only, [hidden], scrollbars, .mono, reduced motion
 * kitButton   .btn + .btn-primary | .btn-secondary | .btn-text | .btn-danger (new) | .btn-sm;
 *             .icon-btn (+ .sm, .xs, .danger); states :hover, :active, [aria-pressed=true] (new), :disabled
 *             and [aria-disabled=true] (new, keeps focus), coarse 44 px via --mc-hit
 * kitField    .field, .field-head, .lbl, .help (.error, .lead), .input (input, textarea), .select,
 *             .unit, .with-icon, .with-action, .field-action, .color, .swatch, .field-reset; .check
 * kitSwitch   .switch-row, .switch (button role=switch aria-checked); replaces native checkboxes
 * kitChip     .chip (.is-accent, .is-warn, .is-error, .is-count), button.chip, [aria-pressed=true]
 * kitSeg      .seg (.full): the one tab bar AND segmented control (role tablist | radiogroup)
 * kitTile     .tiles, .tile (new: picture tile with always-visible 12 px label; aria-checked)
 * kitSection  .group, .group-head (h3), .sectors, .sector, .sector-btn (collapsible), .sector-body
 * kitRow      .rows, .row (new: tree / list row: grip, glyph, name, trailing .icon-btn.xs;
 *             aria-level, aria-selected, aria-expanded; 40 px fine / 44 px coarse)
 * kitToolbar  .toolbar (new: floating capsule), .rail (new: vertical 56 px tool rail),
 *             .topbar (new: full-screen layer header, 56 px)
 * kitNotice   .notice (new: inline banner .info | .warn | .error | .success, persists while true;
 *             + .result-note modifier: result of an action, cleared on the next edit), .empty,
 *             .toast (inverse chip look, used by UI_TOAST_TAG and by the MCU CSS-only copy)
 * kitSlider   .slider-row (new: label, range, number field, unit)
 * kitMenu     .menu (popover menu look; used by UI_MENU_TAG and by MenuPopover callers)
 * kitWindow   .win-* classes used inside UI_WINDOW_TAG's shadow root (exported for the gallery)
 * editorLegacy (mc-* classes of the 30 module editors): moved to src/ui-kit/css/legacy.ts. Bundled into
 *             the card-editor chunk (magic-card-editor.js: card editor and studio) and the animation-studio
 *             chunk (magic-card-animation-studio.js, its own entry: the animation studio editors). It
 *             reaches those screens only through the editorSystem stack of src/css/editor-stack.ts; the SVG
 *             editor, shape editor, theme editor, transfer panel and MCU use kitCss and never import it.
 *
 * ── Layer 2: template helpers (signatures in UiKitTemplates; typed loosely, no lit import here) ──
 * Icons: `icon` is an HA icon name ("mdi:...", rendered as <ha-icon>) or `glyph` a GlyphName from the
 * kit's 24 x 24 stroke set (src/ui-kit/glyphs.ts: a copy of src/svg-editor/icons.ts plus the shape
 * editor's additions ). Every label string
 * comes from the caller (see the i18n contract); helpers hold no strings.
 *
 * ── Layer 3: elements ──
 * See UiMenuElement, UiWindowElement, UiPopoverElement, UiToastElement below.
 *
 * ── Controllers (source-shared) ──
 * MenuPopover (moved from src/editor/components/menu-popover.ts, unchanged API), RovingFocus
 * (toolbar, rail, seg, tree rows: arrows, Home/End, one tab stop), EscGuard (the three-layer Escape
 * rule of svg-editor 1.0.0: stopPropagation so HA's card dialog does not close), LongPress (from the
 * path canvas gesture, 8 px cancel rule).
 *
 * ── Tests ──
 * 1. Gallery page: every part and element in every state (default, hover, focus-visible, pressed,
 *    disabled, error), light and dark theme, fine and coarse pointer, 100 % and 200 % zoom, 320 px
 *    reflow. Screenshots compared per component against a baseline (pixel diff threshold 0.1 %).
 *    Built with a test-only config, never a dist entry.
 * 2. Extraction proof: for every class that existed in editor-system.ts, the card editor screenshots
 *    before and after the move differ by 0 px (byte-identical CSS in the move commit).
 * 3. Elements: keyboard (arrows, Home/End, type-ahead, Esc, Tab leaves, focus returns to opener),
 *    roles (menu, menuitem, menuitemcheckbox, dialog, alertdialog, status), aria-modal only when modal,
 *    top layer inside HA's transformed card dialog (Popover API; fixed-position fallback on Chromium
 *    85-113), Escape never closes HA's dialog, define twice is harmless, a lower-revision definition
 *    keeps working, DOM-only API (a caller built on a different lit copy can drive it), a toast shown
 *    while a window is open renders above its scrim.
 *    Window placement: header drag and corner resize with mouse and touch; arrows on the move and
 *    resize grips (16 px, Shift 64), Home resets; a click without movement docks / steps the size; the
 *    maximise button toggles and restores the previous rect; min 320 x 240, header clamp after a
 *    viewport resize; Escape during a drag cancels it and leaves the window open; a press inside the
 *    panel released on the scrim does not close; show() after close() starts centred at the default
 *    size; no storage write; alert and compact sheet show no grips.
 * 4. Import scan: magic-card.js reaches no src/ui-kit/ file; child chunks import only files
 *    src/ui-kit/index.ts reaches; stats.json lists src/ui-kit/** only in magic-card-editor.js, the
 *    studio entry and the theme editor entry.
 * 5. Selector scan: no kit class rule outside src/ui-kit/ (allow list for layout-only modifiers).
 * 6. Window scan: every `<mc-ui-window` in src/ whose variant is not 'alert' sets movable,
 *    resizable and maximizable and binds all four placement labels.
 */

export const UI_KIT_CONTRACT_VERSION = '1.1.0';
export const UI_KIT_CONTRACT_REVISION = 5;

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
  'toolbar', 'rail', 'topbar', 'notice', 'result-note', 'toast', 'empty', 'slider-row', 'menu',
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
 * Kit-scoped geometry and motion tokens, declared by the `kitTokens` part on :host (Module, not
 * Core; no colours). A screen may override them on its :host like any token. Values (fine / coarse):
 *   --mc-hit-sm       32px / 44px     small controls, float-toolbar buttons, row menu button
 *   --mc-hit-xs       24px / 44px     in-row .icon-btn.xs
 *   --mc-radius-tag   6px             chips, tiles' inner preview, tags
 *   --mc-radius-seg   10px            segmented track, float toolbar capsule
 *   --mc-radius-xl    16px            window, sheet (top corners)
 *   --mc-ease         .15s ease-out   colour, border and shadow transitions (0s under reduced motion)
 *   --mc-shadow-dialog 0 24px 64px rgba(0,0,0,.22), 0 4px 12px rgba(0,0,0,.1)
 * (--mc-hit itself, 40px / 44px, is Core.)
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

export interface UiKitTemplates {
  button(o: KitButtonOptions): KitTemplate;
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
 * <mc-ui-window>: one modal window for dialogs, pickers, confirmations and bottom sheets. Native
 * <dialog> + showModal() inside its shadow root (top layer, real focus trap, ::backdrop scrim
 * --mc-scrim). Escape: the 'cancel' event is handled (EscGuard): it closes this window only and
 * never reaches HA's card dialog. Focus returns to `opener`. `aria-modal` is true because it is.
 * Content is slotted (light DOM in the caller's root, styled by the caller's kit CSS).
 * Slots: default (body), "footer" (buttons, primary last), "header-actions" (optional icon buttons).
 * CSS parts: panel, header, title, close, body, footer; move, resize, maximize.
 * Scrim close: only when the press AND the release are on the scrim (a drag or a text selection
 * that starts in the panel and ends outside never closes; the old PickerDialogController rule).
 *
 * Placement (every window behaves the same). Each flag is off by default; every
 * caller of a non-alert window sets all three (test 6). Ignored, and their controls not rendered, for
 * variant 'alert' and for 'sheet' at compact width (the bottom sheet under 600 px).
 * - movable: drag by the header with mouse, pen or touch (pointer capture, touch-action none on the
 *   header), not when the press starts on a button, input, select or textarea. The header starts with
 *   a grip button (part `move`, glyph 'grip', aria-label moveLabel). Keyboard on the grip: arrows move
 *   16 px, Shift+arrows 64 px, Home re-centres. Single pointer without dragging (WCAG 2.5.7): a click
 *   on the grip docks the window, centre -> inline-end edge -> inline-start edge -> centre (16 px
 *   margin), so HA's card preview beside the editor can be seen.
 * - resizable: grip button at the bottom inline-end corner (part `resize`, aria-label resizeLabel).
 *   Drag resizes; arrows 16 px, Shift+arrows 64 px; Home returns to the size default; a click steps the
 *   width s -> m -> l -> xl -> s (WCAG 2.5.7). Minimum 320 x 240 px; maximum the viewport minus 16 px
 *   per side.
 * - maximizable: icon button before Close (part `maximize`, aria-pressed, aria-label maximizeLabel or
 *   restoreLabel): the panel fills the viewport minus 16 px per side; restoring returns the rect it had
 *   before. `maximized` is settable (also before show()) and reflects as an attribute.
 * - "A click" is a pointer release within 4 px of its press; more than that is a drag.
 * - Once moved, resized or maximised the panel has an explicit size: the body scrolls, header and footer
 *   stay. At least 48 px of the header stays inside the viewport, also after a viewport resize.
 * - Escape during a drag or resize cancels it (rect restored) and is consumed; the window stays open.
 * - Persistence: none, as today (the pickers' ModalDragResizeController.reset() runs on close; the SVG
 *   Start window keeps Maximise in memory only). Every show() starts centred at the size default and not
 *   maximised unless the caller set `maximized`. Nothing goes to localStorage, the config or MCU storage.
 * - Grips are 32 px fine (--mc-hit-sm) and 44 px coarse; focus ring per the styling rules; no rect
 *   transition (so reduced motion needs nothing extra). The kit holds no strings: a flag that is on
 *   without its label renders the control and logs one console.debug (test 6 keeps src/ clean).
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
 * <mc-ui-toast>: transient confirmation of an action that needs no decision ("Copied SVG").
 * One per screen root; a new show() replaces the current message. Look: `.toast`,
 * bottom centre, `offset` px above the bottom edge. Top layer (popover="manual") so it shows above an
 * open <mc-ui-window>. Live region role=status (polite), never focus-stealing. Hides after `duration`
 * ms (default 6000), paused while hovered or focused within, and while pressed. Never the only place a failure is
 * reported (failures are a .notice). No strings of its own. CSS parts: toast, text, action.
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
 * <mc-ui-disclosure>: a collapsible section row (button with aria-expanded, a heading around it).
 * `heading` is the title (never truncated), `summary` a short state line after it (truncates, wraps under the
 * title when narrow; part of the button's accessible name). `open` is settable and reflects; a click toggles
 * it and fires 'mc-toggle' { open } (bubbles, composed), so an inspector that owns the state can set `open`
 * again. Slot: default (the body, hidden while closed). `level` is the heading level (default 3).
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
 * <mc-ui-tile-group> and <mc-ui-chip-group>: MANUAL activation. Buttons with aria-pressed in a role=group
 * named `label`; one tab stop (roving); Left / Right / Up / Down / Home / End move focus only; Space, Enter or
 * a click fire 'mc-pick'. `value` is owned by the host (the groups never change it themselves), so a group
 * never applies a choice on focus. Previews are aria-hidden; the label is the accessible name. They wrap at
 * every width, 44 px targets on coarse pointers.
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
