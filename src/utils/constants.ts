export const CARD_TAG = 'magic-card';
export const EDITOR_TAG = 'magic-card-editor';
export const CARD_NAME = 'Magic Card';
export const CARD_DESCRIPTION = 'A fully open-source multi-module card with advanced editor';

export const DEFAULT_LAYOUT = '1';
export const DEFAULT_GAP = '8px';
/** Gap between the modules of a row module's column without its own gap (the gap these columns always had). */
export const NESTED_COLUMN_GAP = 'var(--mc-gap)';
export const DEFAULT_PADDING = '16px';
export const DEFAULT_BORDER_RADIUS = '12px';

export const EDITOR_DEBOUNCE_MS = 200;
/** While a slider is dragged, config-changed goes out at most this often (and once more at the end). */
export const EDITOR_DRAG_SEND_MS = 100;
/** A drag with no further slider event for this long counts as over. */
export const EDITOR_DRAG_IDLE_MS = 250;
export const UNDO_STACK_LIMIT = 50;
export const TEMPLATE_CACHE_TTL_MS = 1000;

export const MODULE_CATEGORIES = ['content', 'controls', 'layout', 'advanced'] as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * How far (px) a pointer may move between down and up and still be a tap / hold on a module. The
 * slider layout uses the same value as Swiper's drag threshold, so a move is either a tap or a swipe.
 */
export const TAP_MOVE_TOLERANCE_PX = 10;
