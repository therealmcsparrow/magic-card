/** Shim for the merged path model (src/path/core.ts, contract path-model 1.0.0). Removed one release after the merge. */
export type { Cubic, Pt } from '../path/core';
export { cubicsToPath, interpolate, matchShapes, resample, toCubicSubpaths } from '../path/core';
