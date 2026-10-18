/*
 * Contract: ui kit. Version 1.0.0, revision 1 (Architect-owned, 2026-10-18, PROPOSED until the Plan Gate).
 * ADR 0030. CEO request 2026-10-18: "the styling in shape and svg editor of buttons, fields etc are not
 * the same as in card studio, please create centralized components so all screens have the same look
 * and feel". CEO confirmation the same day: the card editor (src/editor/ + src/css/editor-system) is the
 * base look; the kit is extracted FROM it (single source), not designed in parallel.
 *
 * Names below are provisional until the designer's visual spec (design/10-ui-kit.md) lands; the
 * Architect then revises this file in place (ADR 0020: unreleased contracts are revised in place).
 * Class names that exist today in src/css/editor-system.ts keep their names (.btn, .input, .seg, ...).
 *
 * ── Module and placement ──
 * Module `ui-kit`, folder src/ui-kit/. NOT Core. Three layers, all shared at SOURCE level:
 *   1. CSS parts (src/ui-kit/css/*.ts): lit CSSResult per component family, plus `kitCss` = all parts.
 *      They read only tokens (Core: src/css/editor-system.ts `editorTokens`). Never colours.
 *   2. Template helpers (src/ui-kit/templates/*.ts) and controllers (src/ui-kit/controllers/*.ts):
 *      functions that return lit templates rendered in the CALLER's shadow root (light DOM there), so
 *      labels, aria-labelledby, aria-describedby and forms keep working; each bundle compiles its own copy.
 *   3. Elements (src/ui-kit/elements/*.ts): only where top layer or focus management is needed:
 *      UI_MENU_TAG, UI_WINDOW_TAG, UI_POPOVER_TAG. Defined once, guarded (defineUiKit() below).
 *
 * Physical copies (webpack splitChunks: false):
 * - magic-card-editor.js imports src/ui-kit/index.ts statically (the ONE copy for the editor family).
 *   Every chunk loaded below it (svg-editor, shape-editor, path-canvas, path-tools, svg-booleans,
 *   transfer) imports src/ui-kit/** statically and webpack leaves those modules out, because they are
 *   available in a parent chunk (the same rule that keeps lit, js-yaml and model.ts out of the transfer
 *   and path-tools chunks today). Spike S-UI1 proves this with stats.json before any migration.
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
 * - A screen may override TOKENS on its :host (the theme editor keeps its fixed accent, a11y S1).
 * - Hit size comes from --mc-hit (40 px fine, 44 px coarse); focus is :focus-visible 2 px --mc-accent.
 * - Font: --mc-font (HA's body font with Roboto, system-ui fallback). Layers stop setting system-ui.
 * - Kit CSS is in the minify-templates loader include list (webpack.config.js) in production builds.
 *
 * ── Layer 1: CSS parts (class conventions) ──
 * Each part is a CSSResult in src/ui-kit/css/; names from editor-system.ts where they exist.
 * kitBase     *, focus-visible, ::selection, .sr-only, [hidden], scrollbars, .mono, reduced motion
 * kitButton   .btn + .btn-primary | .btn-secondary | .btn-text | .btn-danger (new) | .btn-sm;
 *             .icon-btn (+ .sm, .danger); states :hover, :active, [aria-pressed=true] (new), :disabled
 *             and [aria-disabled=true] (new, keeps focus), coarse 44 px via --mc-hit
 * kitField    .field, .field-head, .lbl, .help (.error, .lead), .input (input, textarea), .select,
 *             .unit, .with-icon, .with-action, .field-action, .color, .swatch, .field-reset
 * kitSwitch   .switch-row, .switch (button role=switch aria-checked); replaces native checkboxes
 * kitChip     .chip (.is-accent, .is-warn, .is-count), button.chip, [aria-pressed=true]
 * kitSeg      .seg (.full): the one tab bar AND segmented control (role tablist | radiogroup)
 * kitTile     .tiles, .tile (new: picture tile with always-visible 12 px label; aria-checked)
 * kitSection  .group, .group-head (h3), .sectors, .sector, .sector-btn (collapsible), .sector-body
 * kitRow      .rows, .row (new: tree / list row: grip, glyph, name, trailing icon buttons;
 *             aria-level, aria-selected, aria-expanded; 32 px fine / 44 px coarse)
 * kitToolbar  .toolbar (new: floating capsule), .rail (new: vertical 56 px tool rail),
 *             .topbar (new: full-screen layer header, 52 px)
 * kitNotice   .notice (new: inline banner .info | .warn | .error, persists while true),
 *             .result-note (new: transient status with mark, text, one action), .empty
 * kitSlider   .slider-row (new: label, range, number field, unit)
 * kitMenu     .menu (popover menu look; used by UI_MENU_TAG and by MenuPopover callers)
 * kitWindow   .win-* classes used inside UI_WINDOW_TAG's shadow root (exported for the gallery)
 * editorLegacy (mc-* classes of the 30 module editors): stays in the card-editor chunk only, moved to
 *             src/ui-kit/css/legacy.ts, never imported by another screen.
 *
 * ── Layer 2: template helpers (signatures in UiKitTemplates; typed loosely, no lit import here) ──
 * Icons: `icon` is an HA icon name ("mdi:...", rendered as <ha-icon>) or `glyph` a GlyphName from the
 * kit's 24 x 24 stroke set (src/ui-kit/glyphs.ts, moved from src/svg-editor/icons.ts plus the shape
 * editor's additions). Every label string comes from the caller (aico:i18n); helpers hold no strings.
 *
 * ── Layer 3: elements ──
 * See UiMenuElement, UiWindowElement, UiPopoverElement below. CSS parts are listed per element.
 *
 * ── Controllers (source-shared) ──
 * MenuPopover (moved from src/editor/components/menu-popover.ts, unchanged API), RovingFocus
 * (toolbar, rail, seg, tree rows: arrows, Home/End, one tab stop), EscGuard (the three-layer Escape
 * rule of svg-editor 1.0.0: stopPropagation so HA's card dialog does not close), LongPress (from the
 * path canvas gesture, 8 px cancel rule).
 *
 * ── Tests (QA writes them; tests/ is git-ignored) ──
 * 1. Gallery page: every part and element in every state (default, hover, focus-visible, pressed,
 *    disabled, error), light and dark theme, fine and coarse pointer, 100 % and 200 % zoom, 320 px
 *    reflow. Screenshots compared per component against a baseline (pixel diff threshold 0.1 %).
 *    Built with a test-only config, never a dist entry.
 * 2. Extraction proof: for every class that existed in editor-system.ts, the card editor screenshots
 *    before and after the move differ by 0 px (byte-identical CSS in the move commit).
 * 3. Elements: keyboard (arrows, Home/End, type-ahead, Esc, Tab leaves, focus returns to opener),
 *    roles (menu, menuitem, menuitemcheckbox, dialog, alertdialog), aria-modal only when modal,
 *    top layer inside HA's transformed card dialog (Popover API; fixed-position fallback on Chromium
 *    85-113), Escape never closes HA's dialog, define twice is harmless, a lower-revision definition
 *    keeps working, DOM-only API (a caller built on a different lit copy can drive it).
 * 4. Import scan: magic-card.js reaches no src/ui-kit/ file; child chunks import only files
 *    src/ui-kit/index.ts reaches; stats.json lists src/ui-kit/** only in magic-card-editor.js, the
 *    studio entry and the theme editor entry.
 * 5. Selector scan: no kit class rule outside src/ui-kit/ (allow list for layout-only modifiers).
 */

export const UI_KIT_CONTRACT_VERSION = '1.0.0';
export const UI_KIT_CONTRACT_REVISION = 1;

export const UI_MENU_TAG = 'mc-ui-menu';
export const UI_WINDOW_TAG = 'mc-ui-window';
export const UI_POPOVER_TAG = 'mc-ui-popover';

/** Class names only src/ui-kit/ may write rules for (selector scan test). */
export const KIT_CLASSES = [
  'btn', 'btn-primary', 'btn-secondary', 'btn-text', 'btn-danger', 'btn-sm', 'icon-btn',
  'field', 'field-head', 'lbl', 'help', 'input', 'select', 'unit', 'with-icon', 'with-action', 'field-action',
  'color', 'swatch', 'field-reset', 'switch', 'switch-row', 'chip', 'seg', 'tiles', 'tile',
  'group', 'group-head', 'sectors', 'sector', 'sector-btn', 'sector-body', 'rows', 'row',
  'toolbar', 'rail', 'topbar', 'notice', 'result-note', 'empty', 'slider-row', 'menu',
] as const;
export type KitClass = (typeof KIT_CLASSES)[number];

/** Tokens the kit reads. Existing ones live in editorTokens (Core); NEW_TOKENS are additive (Plan Gate). */
export const KIT_TOKENS = [
  '--mc-accent', '--mc-accent-ink', '--mc-accent-fill', '--mc-on-accent', '--mc-accent-tint',
  '--mc-surface', '--mc-surface-2', '--mc-ground', '--mc-text', '--mc-text-2', '--mc-divider',
  '--mc-field-border', '--mc-warn-ink', '--mc-warn-tint', '--mc-error-ink', '--mc-success',
  '--mc-shadow-float', '--mc-mono', '--mc-radius', '--mc-radius-lg',
] as const;
/** Added to editorTokens in revision 1 (names already used by the theme editor and the layers). */
export const NEW_TOKENS = [
  '--mc-hit', '--mc-font', '--mc-focus', '--mc-error-tint', '--mc-error-fill', '--mc-success-ink', '--mc-success-tint',
  '--mc-scrim',
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
  onSelect: (e: MouseEvent | KeyboardEvent) => void;
}

export interface KitNoticeOptions {
  tone: 'info' | 'warn' | 'error' | 'success';
  text: string | string[];
  action?: { label: string; onClick: () => void };
  /** result-note: role=status, or role=alert for refusals. Cleared by the caller on the next edit. */
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

/** Same shape as path-canvas MenuEntry (r5); the path canvas re-exports this from revision 6. */
export interface UiMenuEntry {
  id: string;
  label: string;
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

/** Event 'mc-menu-pick' (bubbles, composed). Same name and detail as path-canvas r5. */
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
 * CSS parts: panel, header, title, close, body, footer.
 */
export interface UiWindowElement extends HTMLElement {
  heading: string;
  /** Close button label (i18n from the caller). */
  closeLabel: string;
  /** dialog: 440 px; picker: min(640px, 100vw - 32px); alert: role=alertdialog, no scrim close;
   *  sheet: bottom sheet at compact width, dialog otherwise. */
  variant: 'dialog' | 'picker' | 'alert' | 'sheet';
  /** Element (by id inside the slotted content) that gets focus first; default the first focusable. */
  initialFocus?: string;
  opener?: HTMLElement;
  /** Scrim click closes (default true, never for 'alert'). */
  dismissible?: boolean;
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

/** src/ui-kit/index.ts exports this; the card-editor chunk, the studio and the theme editor call it once. */
export interface UiKitModule {
  version: typeof UI_KIT_CONTRACT_VERSION;
  revision: number;
  /** Guarded define of the three elements. Safe to call more than once and from several bundles. */
  defineUiKit(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-ui-menu': UiMenuElement;
    'mc-ui-window': UiWindowElement;
    'mc-ui-popover': UiPopoverElement;
  }
}
