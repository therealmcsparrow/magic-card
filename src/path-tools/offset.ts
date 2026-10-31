/* Offset path: grows or shrinks the closed subpaths by union / subtraction with a band around the outline. Open subpaths are skipped. Pure. */
import { MAX_TOOL_SEGMENTS, OFFSET_MAX_ABS, OFFSET_MIN_ABS } from '../contracts/path-tools';
import type { PathToolsDeps, ToolOptions, ToolResult } from '../contracts/path-tools';
import type { EditPath } from '../contracts/path-model';
import { frameScale, totalSegments } from './geom';
import { strokeRings } from './outline';

/** ToolOptions may carry the layer's fill rule (default nonzero); additive, hosts that omit it get nonzero. */
export type RuleOptions = ToolOptions & { fillRule?: 'nonzero' | 'evenodd' };

export const isArea = (p: EditPath): boolean => p.closed && p.anchors.length >= 3;

export function offset(paths: EditPath[], amount: number, join: 'round' | 'miter', o: ToolOptions, deps: PathToolsDeps): ToolResult {
  const closed = paths.filter(isArea);
  const skippedOpen = paths.length - closed.length;
  if (totalSegments(paths) > MAX_TOOL_SEGMENTS) return { ok: false, reason: 'too-complex', skippedOpen };
  if (!closed.length) return { ok: false, reason: 'no-area', skippedOpen };
  const scale = frameScale(o.frame);
  const a = Math.min(OFFSET_MAX_ABS * scale, Math.max(OFFSET_MIN_ABS * scale, Math.abs(amount)));
  if (!Number.isFinite(amount) || amount === 0) return { ok: false, reason: 'no-change', skippedOpen };
  const grow = amount > 0;
  const band = strokeRings(closed, { width: 2 * a, cap: 'butt', join }, o);
  const fillRule = (o as RuleOptions).fillRule ?? 'nonzero';
  const r = deps.booleans.run(
    grow ? 'union' : 'subtract',
    [
      { paths: closed, fillRule },
      { paths: band, fillRule: 'nonzero' },
    ],
    { frame: o.frame, tolerance: o.tolerance },
  );
  return r.ok ? { ok: true, paths: r.paths, skippedOpen } : { ok: false, reason: r.reason, skippedOpen };
}
