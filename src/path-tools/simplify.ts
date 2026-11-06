/* Simplify: per subpath, keep sharp corners fixed and refit each run with deps.draw.fitCubics; `smooth` fixes only open ends. Pure. */
import { CORNER_KEEP_DEG, MAX_TOOL_SEGMENTS, SIMPLIFY_MAX, SIMPLIFY_MIN } from '../contracts/path-tools';
import type { PathToolsDeps, ToolOptions, ToolResult } from '../contracts/path-tools';
import type { Anchor, Cubic, EditPath, Pt } from '../contracts/path-model';
import { ap, chainToPath, copyPath, cubicAt, frameScale, segCount, segCubic, tangentAt, totalSegments } from './geom';

/** Points along one cubic (end excluded) so a polyline is within tol of it. */
function sample(c: Cubic, tol: number, out: Pt[]): void {
  const m = Math.max(
    Math.hypot(c[0][0] - 2 * c[1][0] + c[2][0], c[0][1] - 2 * c[1][1] + c[2][1]),
    Math.hypot(c[1][0] - 2 * c[2][0] + c[3][0], c[1][1] - 2 * c[2][1] + c[3][1]),
  );
  const steps = m < 1e-9 ? 1 : Math.min(256, Math.max(1, Math.ceil(Math.sqrt((6 * m) / (8 * tol)))));
  for (let k = 0; k < steps; k++) out.push(k ? cubicAt(c, k / steps) : c[0]);
}

const turnDeg = (path: EditPath, i: number): number => {
  const n = path.anchors.length;
  const m = segCount(path);
  if (!path.closed && (i === 0 || i === n - 1)) return 180;
  const tin = tangentAt(segCubic(path, (i - 1 + m) % m), false);
  const tout = tangentAt(segCubic(path, i % m), true);
  return (Math.atan2(Math.abs(tin[0] * tout[1] - tin[1] * tout[0]), tin[0] * tout[0] + tin[1] * tout[1]) * 180) / Math.PI;
};

function simplifyPath(p: EditPath, tol: number, smooth: boolean, deps: PathToolsDeps): EditPath {
  const n = p.anchors.length;
  if (n < 3) return p;
  const m = segCount(p);
  const pts: Pt[] = [];
  const at: number[] = [];
  for (let i = 0; i < m; i++) {
    at.push(pts.length);
    sample(segCubic(p, i), tol / 4, pts);
  }
  at.push(pts.length);
  pts.push(ap(p.anchors[p.closed ? 0 : n - 1]));
  // fixed anchors (indices into p.anchors); at[i] is the polyline index of anchor i, at[n] the closing point
  const fixed: number[] = [];
  for (let i = 0; i < n; i++) {
    const end = !p.closed && (i === 0 || i === n - 1);
    const a = p.anchors[i];
    const sharp = !smooth && (a.kind === 'corner' || a.kind === undefined) && turnDeg(p, i) > CORNER_KEEP_DEG;
    if (end || sharp) fixed.push(i);
  }
  if (p.closed && !fixed.length) fixed.push(0);
  const runs: [number, number][] = [];
  for (let k = 0; k + 1 < fixed.length; k++) runs.push([fixed[k], fixed[k + 1]]);
  if (p.closed) runs.push([fixed[fixed.length - 1], fixed[0] + n]);
  const slice = (a: number, b: number): Pt[] =>
    b <= n ? pts.slice(at[a], at[b] + 1) : [...pts.slice(at[a]), ...pts.slice(1, at[b - n] + 1)];
  const chain: Cubic[] = [];
  const startAt: number[] = [];
  for (const [a, b] of runs) {
    startAt.push(chain.length);
    for (const c of deps.draw.fitCubics(slice(a, b), tol)) chain.push(c);
  }
  if (!chain.length) return p;
  const out = chainToPath(chain, p.closed, tol * 0.02);
  // anchors that were fixed keep their kind; fitted joints are smooth
  const kinds: (Anchor['kind'] | undefined)[] = out.anchors.map(() => 'smooth');
  runs.forEach(([a], k) => {
    const idx = startAt[k];
    kinds[idx] = p.anchors[a % n].kind ?? 'corner';
  });
  if (!p.closed) kinds[kinds.length - 1] = p.anchors[n - 1].kind ?? 'corner';
  out.anchors.forEach((a, i) => (a.kind = kinds[i]));
  return out.anchors.length < n ? out : p;
}

export function simplify(paths: EditPath[], tolerance: number, smooth: boolean, o: ToolOptions, deps: PathToolsDeps): ToolResult {
  if (totalSegments(paths) > MAX_TOOL_SEGMENTS) return { ok: false, reason: 'too-complex', skippedOpen: 0 };
  const scale = frameScale(o.frame);
  const tol = Math.min(SIMPLIFY_MAX * scale, Math.max(SIMPLIFY_MIN * scale, tolerance));
  let changed = false;
  const out = paths.map((p) => {
    const q = simplifyPath(p, tol, smooth, deps);
    if (q !== p) changed = true;
    return q === p ? copyPath(p) : q;
  });
  return changed ? { ok: true, paths: out, skippedOpen: 0 } : { ok: false, reason: 'no-change', skippedOpen: 0 };
}

