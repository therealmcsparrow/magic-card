import type { MenuEntry } from '../contracts/path-canvas';
import type { BooleanOp } from '../contracts/path-booleans';
import type { PathTool } from '../contracts/path-tools';
import type { SvgAlignEdge, SvgAlignTarget, SvgArrange } from '../contracts/svg-editor';
import { boolReason } from './combine';
import { moveMenu, runMove } from './layers';
import { PATH_BUTTONS, openTool, ptReason } from './pathtools';
import { toneOf } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { S } from './strings';

/* The "Shape actions" menu: entries per target, and the one place a pick turns into an editor command. */

const it = (id: string, label: string, reason?: string, keys?: string, separatorBefore?: boolean): MenuEntry => ({ id, label, reason, keys, separatorBefore });
const ARR: SvgArrange[] = ['front', 'forward', 'backward', 'back'];
const EDGES: SvgAlignEdge[] = ['left', 'centre', 'right', 'top', 'middle', 'bottom'];
const OPS: BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];

export const emptyMenu = (): MenuEntry[] => [it('all', S.selectAll), it('zoom', S.zoomToFit)];

/** The topbar Export / Import menu: what the sidebar's Export section held. */
export function xferItems(ed: McSvgEditor): MenuEntry[] {
  const no = ed.out.svg ? undefined : S.xferNone;
  return [
    it('x:export', S.exportFile, no),
    it('x:import', S.importFile),
    it('x:copy', S.copySvg, no, undefined, true),
    it('x:download', S.downloadSvg, no),
    it('x:ha', S.copyHa, no),
    ...(ed.ha?.secondary ? [it('x:accent', S.copyAccent)] : []),
  ];
}

export function pointMenu(ed: McSvgEditor): MenuEntry[] {
  const k = ed.pointCtx?.kind;
  return [it('kind', k === 'smooth' ? S.kindCorner : S.kindSmooth), it('addpt', S.pointAdd, ed.canAddPoint ? undefined : S.pointAddNo), it('delpt', S.pointDelete), it('split', S.ptHere, ptReason(ed, 'split'))];
}

const TARGETS: SvgAlignTarget[] = ['selection', 'canvas', 'safe'];

/** Align, distribute and place; the canvas toolbar adds the "relative to" choice in front. */
export function alignItems(ed: McSvgEditor, tool: boolean): MenuEntry[] {
  const n = ed.items.items.length;
  const noSafe = ed.safeOn ? undefined : S.safeHidden;
  const none = tool && !n ? S.noneSelected : undefined;
  const need3 = n >= 3 ? undefined : S.alignNeedThree;
  const off = (k: SvgAlignTarget): string | undefined => (k === 'selection' && n < 2 ? S.alignNeedTwo : k === 'safe' && !ed.safeOn ? S.safeHidden : undefined);
  return [
    ...(tool ? TARGETS.map((k) => ({ ...it(`tgt:${k}`, `${S.alignRel}: ${S.alignTargets[k]}`, off(k)), checked: ed.alignBase === k })) : []),
    ...EDGES.map((e, i) => it(`al:${e}`, S.alignEdge[e], none, undefined, tool && !i)),
    it('dist:h', S.distH, none ?? need3, undefined, tool),
    it('dist:v', S.distV, none ?? need3),
    it('place:centre', S.placeCentre, undefined, undefined, tool),
    it('place:fit', S.placeFit, noSafe),
    it('place:match', S.placeMatch, noSafe),
  ];
}

export const combineItems = (ed: McSvgEditor): MenuEntry[] => OPS.map((o) => it(`bool:${o}`, S.boolOps[o], boolReason(ed.boolean, o)));
export const pathItems = (ed: McSvgEditor): MenuEntry[] => PATH_BUTTONS.map((t) => it(`pt:${t}`, S.ptName[t], ptReason(ed, t)));

export function shapeMenu(ed: McSvgEditor): MenuEntry[] {
  return [
    it('dup', S.duplicate, undefined, 'Control+D'),
    it('del', S.remove, undefined, 'Delete'),
    it('flipH', S.flipH, undefined, 'Shift+H', true),
    it('flipV', S.flipV, undefined, 'Shift+V'),
    it('rotCW', S.rotCw),
    it('rotCCW', S.rotCcw),
    ...(ed.dualOn ? [it('tone', ed.selected.every((s) => toneOf(s) === 'accent') ? S.singleGo : S.makeAccent)] : []),
    { ...it('arrange', S.arrangeTitle, undefined, undefined, true), items: ARR.map((a) => it(`arr:${a}`, S.arrange[a], ed.canArrange(a) ? undefined : S.arrangeLimit)) },
    { ...it('align', S.alignTitle), items: alignItems(ed, false) },
    { ...it('combine', S.boolOps.union), items: combineItems(ed) },
    { ...it('path', S.ptTitle), items: pathItems(ed) },
    ...(moveMenu(ed) ? [moveMenu(ed)!] : []),
  ];
}

/** Do what a picked entry says. */
export function runMenu(ed: McSvgEditor, id: string, opener?: HTMLElement): void {
  const [k, v, w] = id.split(':');
  if (k === 'x') {
    if (v === 'export' || v === 'import') void ed.openTransfer(v, opener);
    else if (v === 'copy') ed.copySvg();
    else if (v === 'download') ed.download();
    else if (v === 'ha') ed.copyHa();
    else ed.copyAccent();
    if (v !== 'export' && v !== 'import') opener?.focus();
  } else if (k === 'dup') ed.duplicate();
  else if (k === 'del') ed.deleteSelected();
  else if (k === 'flipH' || k === 'flipV') ed.flip(k === 'flipH' ? 'h' : 'v');
  else if (k === 'rotCW' || k === 'rotCCW') ed.rotate(k === 'rotCW' ? 90 : -90);
  else if (k === 'tone') ed.setTone(ed.selected.every((s) => toneOf(s) === 'accent') ? 'main' : 'accent');
  else if (k === 'arr') ed.arrange(v as SvgArrange);
  else if (k === 'al') ed.align(v as SvgAlignEdge);
  else if (k === 'dist') ed.distribute(v as 'h' | 'v');
  else if (k === 'place') ed.place(v as 'centre' | 'fit' | 'match');
  else if (k === 'tgt') ed.alignTarget = v as SvgAlignTarget;
  else if (k === 'bool') void ed.runBoolean(v as BooleanOp);
  else if (k === 'mv') runMove(ed, v, w);
  else if (k === 'pt' || k === 'split') void openTool(ed, (k === 'pt' ? v : 'split') as PathTool);
  else if (k === 'all') ed.select(ed.doc.shapes.map((s) => s.id));
  else if (k === 'zoom') ed.fitView();
  else if (k === 'kind') ed.setKind(ed.pointCtx?.kind === 'smooth' ? 'corner' : 'smooth');
  else if (k === 'addpt') ed.addAfter();
  else if (k === 'delpt') ed.deletePoint();
}
