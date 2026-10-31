import type { KitTemplate } from './ui-kit';

/**
 * Contract: ui kit, panel lips (part of ui-kit 1.2.0; re-exported by ./ui-kit). A lip is a small button on the
 * inner edge of a side panel that hides and shows that panel. One controller per editor owns its lips, the
 * remembered state, the one-time hint, the status region and the Ctrl/Cmd + \ shortcut.
 */

/** localStorage key prefix; the editor id follows. */
export const PANEL_MEMORY_PREFIX = 'mc-panels:';
/** localStorage key prefix of the hint flag ("1" = dismissed); the editor id follows. */
export const PANEL_HINT_PREFIX = 'mc-panels-hint:';
/** Longest stored value that is read; anything longer is ignored. */
export const PANEL_MEMORY_MAX = 64;
/** Event fired on the host after a user change. */
export const PANEL_CHANGE_EVENT = 'mc-panels-change';
/** Longest panel move in ms (0 under reduced motion). */
export const LIP_MOTION_MS = 200;
/** Attribute the controller sets on its host while connected; marks a lip owner for nested shortcut handling. */
export const LIP_HOST_ATTR = 'data-mc-lips';
/** Width of the lip column in the 'gutter' model, px; the host adds its --mc-lip-pull. */
export const LIP_GUTTER_PX = 40;
/** Highest z-index a lip may use (the card studio's float bar and column handles are 5). */
export const LIP_Z_MAX = 4;

/** Editors with lips. One storage key each. */
export const PANEL_EDITORS = ['card-studio', 'anim-studio', 'svg-editor', 'shape-studio', 'theme-editor'] as const;
export type PanelEditorId = (typeof PANEL_EDITORS)[number];

/** Panel ids per editor (the storage allow-list). */
export const PANEL_IDS: Readonly<Record<PanelEditorId, readonly string[]>> = {
  'card-studio': ['layers', 'inspector'],
  'anim-studio': ['layers', 'inspector'],
  'svg-editor': ['side', 'inspector'],
  'shape-studio': ['side', 'inspector'],
  'theme-editor': ['variables'],
};

/** 'overlay': model O+ (lip over the canvas, inset by the scrollbar). 'gutter': model G40 (own 40 px track plus the pull). */
export type LipGeometry = 'overlay' | 'gutter';

/** Geometry model per editor (see "Geometry per editor"). */
export const LIP_GEOMETRY: Readonly<Record<PanelEditorId, LipGeometry>> = {
  'card-studio': 'overlay',
  'anim-studio': 'overlay',
  'svg-editor': 'gutter',
  'shape-studio': 'gutter',
  'theme-editor': 'overlay',
};

/** Class names kitLip writes rules for; screens may not style them (selector scan). */
export const LIP_CLASSES = ['lip', 'lip-hint', 'lip-hint-keys', 'lip-status'] as const;

/** Layout tokens kitLip reads; the host sets them, the part carries var() fallbacks. */
export const LIP_TOKENS = [
  '--mc-lip-at-start', '--mc-lip-at-end', '--mc-lip-top', '--mc-lip-ms', '--mc-lip-off',
  '--mc-lip-edge-gap', '--mc-lip-hint-max', '--mc-lip-z', '--mc-lip-pull',
] as const;

export type PanelSide = 'start' | 'end';
export type PanelState = 'off' | 'shown' | 'hidden';
export type PanelDir = 'ltr' | 'rtl';

export interface PanelLipSpec {
  /** One of PANEL_IDS[editor]. */
  id: string;
  side: PanelSide;
  /** DOM id of the panel element in the same shadow root (aria-controls). */
  controls: string;
  /** Fixed accessible name (aria-label) in both states, e.g. "Layers panel"; the panel's own name, if it has one, is the same. */
  name: string;
  /** Lower-case noun for announcements and the hint, e.g. "layers", "side panel". */
  noun: string;
  /** Tooltip (title) while shown, from one message with {noun} and {keys}, e.g. "Hide layers (Ctrl+\)". */
  hideLabel: string;
  /** Tooltip (title) while hidden, from one message with {noun} and {keys}, e.g. "Show layers (Ctrl+\)". */
  showLabel: string;
}

/** Caller strings (the kit holds none). Placeholders are replaced as plain text. */
export interface PanelLipStrings {
  /** BCP 47 tag for Intl.ListFormat and upper-casing, e.g. hass.locale.language. May be invalid. */
  locale: string;
  /** "{panels} hidden" */
  hidden: string;
  /** "{panels} shown" */
  shown: string;
  /** One hidden panel: "The {noun} panel is hidden, as you left it. ..." */
  hintOne: string;
  /** Several hidden panels. */
  hintMany: string;
  /** Hidden by `fallback` (an earlier setting carried over). */
  hintMigrated: string;
  /** Second hint line, hover devices only: "Shortcut: Ctrl+\ or ⌘\". */
  hintShortcut: string;
  /** Hint button: "Got it". */
  gotIt: string;
}

export interface PanelLipsOptions {
  editor: PanelEditorId;
  panels: readonly PanelLipSpec[];
  strings: PanelLipStrings;
  /** 'host' (default): capture-phase keydown listener on the host. 'manual': the host calls handleKey() from its own capture-phase listener. */
  keys?: 'host' | 'manual';
  /** Runs once when the storage key is absent; the allowed ids it returns start hidden and are written. */
  fallback?: () => readonly string[] | null;
}

export interface PanelChange {
  editor: PanelEditorId;
  /** Hidden panel ids after the change, in declared order. */
  hidden: string[];
  cause: 'lip' | 'key' | 'reveal' | 'api';
}

/**
 * PanelLips (src/ui-kit/controllers/panel-lips.ts):
 *   new PanelLips(host: ReactiveControllerHost & HTMLElement, options: PanelLipsOptions)
 * Requests a host update on every state change. Labels may change with the locale: the host passes new
 * specs and strings through setPanels().
 */
export interface PanelLipsController {
  readonly editor: PanelEditorId;
  /** Text direction of the host, bound as data-dir on the lip and the panel. */
  readonly dir: PanelDir;
  /** Where this open's hidden state came from: nothing hidden, the stored key, or `fallback`. */
  readonly restoredFrom: 'none' | 'stored' | 'fallback';
  /** Replace the specs (same ids) and strings after a locale change. Re-reads dir. */
  setPanels(panels: readonly PanelLipSpec[], strings: PanelLipStrings): void;
  /** Which panels are columns now; call before render (willUpdate). Unchanged input requests nothing. */
  columns(map: Readonly<Record<string, boolean>>): void;
  /** True: every panel 'off', no lips; a matching shortcut is still prevented and changes nothing. */
  suspended: boolean;
  state(id: string): PanelState;
  isHidden(id: string): boolean;
  /** At least one panel is a column and the controller is not suspended. */
  readonly active: boolean;
  /** The lip button (plus the hint while it shows), or lit `nothing` while the panel is 'off'. */
  lip(id: string): KitTemplate;
  /** The status region; rendered once by the host from the first render. */
  status(): KitTemplate;
  toggle(id: string): void;
  show(id: string): void;
  hide(id: string): void;
  /** The shortcut's action (scope and remembered set as above). False when nothing changed. */
  toggleAll(): boolean;
  /** Shows a hidden column panel, saves it, resolves after the host's update. Resolves at once otherwise. */
  reveal(id: string): Promise<void>;
  /** keys 'manual': true when the event was the shortcut and this controller owns it (preventDefault was called). */
  handleKey(e: KeyboardEvent): boolean;
  /** Re-read the memory, the hint flag and dir (for an editor element that stays connected between opens). */
  restore(): void;
}

/** src/ui-kit/controllers/scrollbar-width.ts: inline scrollbar width of `el` in px (see "Scrollbar measurement"). */
export type ScrollbarWidthFn = (el: HTMLElement) => number;

/**
 * ScrollbarWatch (src/ui-kit/controllers/scrollbar-width.ts):
 *   new ScrollbarWatch(host: ReactiveControllerHost, onChange?: (width: number) => void)
 * Adds itself to the host; behaviour under "Scrollbar measurement".
 */
export interface ScrollbarWatchController {
  /** Last measured width in px; 0 before the first measurement and for a null scroller. */
  width: number;
  /** Measure `scroller` now; (re)observe scroller and `also` when that element list changed. */
  watch(scroller: HTMLElement | null, ...also: Array<HTMLElement | null>): void;
  hostDisconnected(): void;
}
