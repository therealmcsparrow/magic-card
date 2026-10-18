import type { BooleanOp, BooleanOperand } from '../contracts/path-booleans';
import { isOff, newShape, pruneGroups, type Doc, type Shape } from './model';
import { S } from './strings';
import type { EditPath } from '../contracts/path-model';

/*
 * Boolean buttons, the pure part: which selected layers are operands, why an operation is unavailable,
 * and the document after a result. The chunk call itself lives in the editor (it is async).
 */

const closedOf = (s: Shape): number => s.paths.filter((p) => p.closed && p.anchors.length >= 3).length;
const openOf = (s: Shape): number => s.paths.filter((p) => !(p.closed && p.anchors.length >= 3) && p.anchors.length > 1).length;

export interface BoolState {
  /** Visible, unlocked selected layers with a closed subpath, in drawing order. */
  operands: Shape[];
  /** Selected layers left out because they are locked or hidden, and how many are locked. */
  leftOut: number;
  lockedOnly: boolean;
  /** Open subpaths of layers that have no closed one. */
  openOnly: number;
  /** Selected layers that were eligible but had no closed subpath. */
  openLayers: number;
  /** One operand with 2+ closed subpaths (Combine merges its parts). */
  merge: boolean;
}

export function boolState(d: Doc, sel: readonly string[]): BoolState {
  const operands: Shape[] = [];
  let leftOut = 0;
  let nLocked = 0;
  let openOnly = 0;
  let openLayers = 0;
  for (const s of d.shapes) {
    if (!sel.includes(s.id)) continue;
    const isLocked = isOff(d, s, 'locked');
    const isHidden = isOff(d, s, 'hidden');
    if (isLocked || isHidden) {
      leftOut++;
      if (isLocked) nLocked++;
    } else if (closedOf(s)) operands.push(s);
    else {
      openLayers++;
      openOnly += openOf(s);
    }
  }
  return { operands, leftOut, lockedOnly: leftOut > 0 && nLocked === leftOut, openOnly, openLayers, merge: operands.length === 1 && closedOf(operands[0]) >= 2 };
}

/** Why the operation can not run, or undefined when it can. First match wins (design 7.3). */
export function boolReason(st: BoolState, op: BooleanOp): string | undefined {
  const n = st.operands.length;
  if (n >= 2 || (n === 1 && op === 'union' && st.merge)) return undefined;
  if (n === 1) return S.boolSecond;
  if (st.openLayers) return S.boolOpen;
  return S.boolNone;
}

export function operandsOf(st: BoolState): BooleanOperand[] {
  return st.operands.map((s) => ({ paths: s.paths, fillRule: s.rule }));
}

/** The document with the operands replaced by one result layer at the bottom-most operand's place. */
export function withResult(d: Doc, st: BoolState, op: BooleanOp, paths: EditPath[]): { doc: Doc; shape: Shape } {
  const base = st.operands[0];
  const ids = new Set(st.operands.map((s) => s.id));
  const shape = newShape('path', paths, {
    name: S.boolName[op],
    fill: base.fill,
    stroke: base.stroke,
    width: base.width,
    cap: base.cap,
    join: base.join,
    rule: 'nonzero',
    group: base.group,
  });
  const shapes: Shape[] = [];
  for (const s of d.shapes) {
    if (s.id === base.id) shapes.push(shape);
    else if (!ids.has(s.id)) shapes.push(s);
  }
  return { doc: pruneGroups({ ...d, shapes }), shape };
}

/** The result's note text. */
export function boolNote(op: BooleanOp, st: BoolState, skipped: number): string {
  const n = st.operands.length;
  const main = n === 1 ? S.boolMerged(closedOf(st.operands[0])) : S.boolDone[op](n, st.operands[0].name);
  return skipped > 0 ? `${main} ${S.boolSkipped(skipped)}` : main;
}
