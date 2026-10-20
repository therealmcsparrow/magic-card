/* flow-anchor 1.1.0 (see flow-anchor.ts). Chunk and editor only; the main bundle gets the answer via FlowLookResolved.wide. */
const WIDE_STYLES = ['tube', 'cable', 'neon', 'zigzag'];

/** 1.1.0: whether the flow's look is wide (the default anchor is then the box). Reads the YAML keys only. */
export const isWideFlowLook = (f: object): boolean => {
  const r = f as Record<string, unknown>;
  const alt = r.shape_alternate;
  return WIDE_STYLES.includes(r.line_style as string) || r.spacing_mode === 'random' || +(r.size_variation as number) > 0 || (!!alt && alt !== 'none');
};
