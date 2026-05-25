export const CARD_TAG = 'magic-card';
export const EDITOR_TAG = 'magic-card-editor';
export const CARD_NAME = 'Magic Card';
export const CARD_DESCRIPTION = 'A fully open-source multi-module card with advanced editor';

export const DEFAULT_LAYOUT = '1';
export const DEFAULT_GAP = '8px';
export const DEFAULT_PADDING = '16px';
export const DEFAULT_BORDER_RADIUS = '12px';

export const EDITOR_DEBOUNCE_MS = 200;
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
