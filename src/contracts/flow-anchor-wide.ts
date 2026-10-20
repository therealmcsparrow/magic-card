/* flow-anchor 1.1.0 (see flow-anchor.ts). Chunk and editor only; the main bundle gets the answer via FlowLookResolved.wide. */
const WIDE_STYLES = ['tube', 'cable', 'neon', 'zigzag'];
const SWARM_KEYS = ['spacing_mode', 'spacing', 'size_variation', 'shape_alternate', 'motion'];

/** 1.1.0: whether the flow's look is wide (the default anchor is then the box). Reads the YAML keys only. */
export const isWideFlowLook = (f: object): boolean => {
  const r = f as Record<string, unknown>;
  return WIDE_STYLES.includes(r.line_style as string) || r.electric === true || SWARM_KEYS.some((k) => r[k] !== undefined);
};
