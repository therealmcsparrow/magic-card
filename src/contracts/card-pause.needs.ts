/*
 * card-pause 2.0.0, the names magic-card.js needs at run time. They sit in this predicate file, not in card-pause.ts,
 * because the entry may import only *.needs.ts of a contract (see tools/check-entry-graph.mjs); card-pause.ts
 * re-exports them. Plain code, no imports.
 */

export const PAUSE_ATTRIBUTE = 'data-mc-paused';
export const PAUSE_EVENT = 'mc-pause-change';
export const PAUSE_STORAGE_PREFIX = 'mc-paused:';

/** The card shows the Pause motion button (`pause_button` auto or always): the `pause` chunk draws and runs it. */
export const wantsPause = (c: unknown): boolean => {
  try {
    const mode = (c as { pause_button?: unknown } | null)?.pause_button;
    return mode === 'auto' || mode === 'always';
  } catch {
    return false;
  }
};

/**
 * Value of data-mc-pause-gap on .mc-card-content: the edge that keeps a 24 px strip for the button, undefined when the
 * button is off. It follows the config alone (shown or not, loaded or not), so the layout never moves.
 */
export const pauseGap = (c: unknown): string | undefined => {
  if (!wantsPause(c)) return undefined;
  const corner = String((c as { pause_button_corner?: unknown }).pause_button_corner);
  return ['bottom-left', 'bottom-right', 'top-left', 'top-right'].includes(corner) ? corner.split('-')[0] : 'bottom';
};
