/* flow-anchor 1.2.0 (see flow-anchor.ts). Chunk and editor only; the main bundle gets the answer via FlowLookResolved.wide. FLOW_SHAPES, SPACING_MODES and fin are also used by flow-look/resolve.ts; no API change. */
const WIDE_STYLES = ['tube', 'cable', 'neon', 'zigzag'];
/** The values resolve.ts accepts for shape_alternate (an unknown one is dropped there, so it must not count here). */
export const FLOW_SHAPES = ['dot', 'arrow', 'chevron', 'square', 'diamond', 'star', 'comet', 'spark', 'bubble', 'drop', 'icon'];
export const SPACING_MODES = ['even', 'pixels', 'random'];

/** A finite number (numeric strings count), like resolve.ts num(). */
export const fin = (v: unknown): number | undefined => {
  const n = typeof v === 'string' && v.trim() ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : undefined;
};

/**
 * 1.2.0: whether the flow's look is wide (the default anchor is then the box). Reads the YAML keys only.
 * A swarm key (random spacing, size variation, alternate shape) counts only when shapes travel: motion is
 * not `pulse` and the flow draws shapes (a spacing in pixels or random mode, or `dots` above 0; unset = 3).
 */
export const isWideFlowLook = (f: object): boolean => {
  const r = f as Record<string, unknown>;
  if (WIDE_STYLES.includes(r.line_style as string)) return true;
  const mode = SPACING_MODES.includes(r.spacing_mode as string) ? r.spacing_mode : r.spacing !== undefined ? 'pixels' : 'even';
  const dots = fin(r.dots);
  const travelling = r.motion !== 'pulse' && (mode !== 'even' || dots === undefined || Math.round(dots) > 0);
  if (!travelling) return false;
  const alt = r.shape_alternate;
  return r.spacing_mode === 'random' || (fin(r.size_variation) ?? 0) > 0 || (typeof alt === 'string' && FLOW_SHAPES.includes(alt));
};
