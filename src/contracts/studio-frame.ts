// Contract: studio frame. Version 1.1.0. Part of the ui kit (re-exported by ./ui-kit from ui-kit 1.4.0).
// The shared shell of every studio: a thin top bar, hairline rulers on the top and start edge, a measured grid stage
// with a zoom pill, and an end-side drawer that pushes the stage at 1024 px and wider and becomes a full-height sheet
// below it. The frame owns layout, rulers, grid, drawer, pin, "Modified only" and the sheet; the studio owns every
// field, tool and string. It renders no text of its own: all words come in through `strings`.

export const STUDIO_FRAME_CONTRACT_VERSION = '1.1.0';

export const UI_STUDIO_FRAME_TAG = 'mc-ui-studio-frame';

/** Frame width (px) at and above which the drawer pushes the stage; below it the drawer is a full-height sheet. */
export const FRAME_WIDE_MIN_PX = 1024;

/** Studios that use the frame. One id each; also the value of the frame's `studio` attribute. */
export const FRAME_STUDIOS = [
  'card-studio', 'anim-studio', 'image-animator', 'image-editor', 'look-editor', 'shape-studio', 'theme-editor',
] as const;
export type FrameStudioId = (typeof FRAME_STUDIOS)[number];

/** Named slots. `start` (layers, tree, variables), `zoom` and `drawer-actions` are optional. */
export const FRAME_SLOTS = ['top', 'start', 'stage', 'zoom', 'drawer', 'drawer-actions'] as const;
export type FrameSlot = (typeof FRAME_SLOTS)[number];

/** Colour scheme. The studio passes hass.themes.darkMode; the frame never reads the OS setting itself. */
export type FrameScheme = 'light' | 'dark';

/** Why the drawer opened or closed. */
export type FrameDrawerReason = 'user' | 'stage' | 'escape' | 'pin' | 'selection';

/** Every word the frame shows or announces. Required: the frame has no fallback copy. */
export interface StudioFrameStrings {
  /** aria-label of the pin button (aria-pressed carries the state). */
  pin: string;
  /** Label of the "Modified only" switch. */
  modifiedOnly: string;
  /** Shown in the drawer when "Modified only" is on and no field differs from its default. */
  noneModified: string;
  /** aria-label of the drawer close button (wide) and the sheet back button (narrow). */
  close: string;
  /** Accessible name of the drawer region; the selection label follows it. */
  drawer: string;
  /** aria-label of the zoom pill group. */
  zoom: string;
}

/** Ruler and callout geometry the studio reports in stage units (px at 100 %). */
export interface FrameMeasure {
  /** Stage width and height shown on the rulers. */
  width: number;
  height: number;
  /** Grid step in stage units; 0 hides the grid lines but keeps the stage ground. */
  grid: number;
  /** Selection box for the selection and width callouts; null when nothing is selected. */
  selection: { x: number; y: number; width: number; height: number } | null;
  /** Zoom as a factor (1 = 100 %). */
  zoom: number;
}

/** detail of FRAME_DRAWER_EVENT. */
export interface FrameDrawerChange {
  open: boolean;
  reason: FrameDrawerReason;
}
/** detail of FRAME_MODIFIED_EVENT. */
export interface FrameModifiedChange {
  on: boolean;
}
/** detail of FRAME_PIN_EVENT. */
export interface FramePinChange {
  pinned: boolean;
}

/** Fired (bubbles, composed) after the drawer opened or closed. */
export const FRAME_DRAWER_EVENT = 'mc-frame-drawer';
/** Fired after the user flipped "Modified only". The studio re-renders its drawer with only modified fields. */
export const FRAME_MODIFIED_EVENT = 'mc-frame-modified';
/** Fired after the user flipped the pin. */
export const FRAME_PIN_EVENT = 'mc-frame-pin';

/**
 * The frame element. State lives in memory only: pin and "Modified only" start off each time a studio opens.
 * Rulers, grid and callouts are aria-hidden. Escape closes an unpinned drawer or the sheet and returns focus to
 * the element passed to openDrawer. Drawer motion is 0 ms under prefers-reduced-motion.
 */
export interface StudioFrameElement extends HTMLElement {
  studio: FrameStudioId;
  scheme: FrameScheme;
  strings: StudioFrameStrings;
  /** Name of the current selection; the drawer and sheet header always show it. */
  selectionLabel: string;
  measure: FrameMeasure | null;
  /** Rulers and grid on (default true). A studio without a measured stage (theme editor list view) may turn them off. */
  rulers: boolean;
  /**
   * Attribute `start-mode`. 'sheet' (default): below FRAME_WIDE_MIN_PX the `start` slot becomes a full-screen fixed sheet.
   * 'rail': the `start` slot stays an in-flow narrow column (--bp-rail-w, 72px) at every width.
   */
  startMode: 'sheet' | 'rail';
  readonly drawerOpen: boolean;
  readonly pinned: boolean;
  readonly modifiedOnly: boolean;
  /** True below FRAME_WIDE_MIN_PX (frame width, not the viewport). */
  readonly narrow: boolean;
  /** Opens the drawer (sheet when narrow). `opener` gets focus back on close. */
  openDrawer(opener?: HTMLElement | null, reason?: FrameDrawerReason): void;
  closeDrawer(reason?: FrameDrawerReason): void;
  /** The studio calls this when the user starts work on the stage (drag, draw, edit in place). Closes an unpinned drawer. */
  stageWork(): void;
}

/** Fonts the studios load from their own lazy chunk; never from a third-party host. */
export const STUDIO_FONT_FAMILIES = { sans: 'MC Space Grotesk', mono: 'MC Space Mono' } as const;

/** src/ui-kit/fonts/load.ts (card editor) and load-lazy.ts (standalone bundles). Idempotent; resolves false (system fallbacks stay) when the chunk or a face fails. */
export type LoadStudioFonts = () => Promise<boolean>;

/** Lazy font chunk of the animation studio and theme editor bundles; the card editor carries the faces in its own chunk. */
export const STUDIO_FONTS_CHUNK = 'magic-card-studio-fonts.js';

declare global {
  interface HTMLElementTagNameMap {
    'mc-ui-studio-frame': StudioFrameElement;
  }
}
