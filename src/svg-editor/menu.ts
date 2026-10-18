import type { MenuEntry } from '../contracts/path-canvas';
import type { BooleanOp } from '../contracts/path-booleans';
import type { SvgAlignEdge, SvgArrange } from '../contracts/svg-editor';
import { boolReason } from './combine';
import { moveMenu, runMove } from './layers';
import { toneOf } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { S } from './strings';

/* The "Shape actions" menu: entries per target, and the one place a pick turns into an editor command. */

const it = (id: string, label: string, reason?: string, keys?: string, separatorBefore?: boolean): MenuEntry => ({ id, label, reason, keys, separatorBefore });
const ARR: SvgArrange[] = ['front', 'forward', 'backward', 'back'];
const EDGES: SvgAlignEdge[] = ['left', 'centre', 'right', 'top', 'middle', 'bottom'];
const OPS: BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];

export const emptyMenu = (): MenuEntry[] => [it('all', S.selectAll), it('zoom', S.zoomToFit)];

export function pointMenu(ed: McSvgEditor): MenuEntry[] {
  const k = ed.pointCtx?.kind;
  return [it('kind', k === 'smooth' ? S.kindCorner : S.kindSmooth), it('addpt', S.pointAdd, ed.canAddPoint ? undefined : S.pointAddNo), it('delpt', S.pointDelete)];
}

export function shapeMenu(ed: McSvgEditor): MenuEntry[] {
  const many3 = ed.items.items.length >= 3;
  const noSafe = ed.safeOn ? undefined : S.safeHidden;
  const st = ed.boolean;
  return [
    it('dup', S.duplicate, undefined, 'Control+D'),
    it('del', S.remove, undefined, 'Delete'),
    it('flipH', S.flipH, undefined, 'Shift+H', true),
    it('flipV', S.flipV, undefined, 'Shift+V'),
    it('rotCW', S.rotCw),
    it('rotCCW', S.rotCcw),
    ...(ed.dualOn ? [it('tone', ed.selected.every((s) => toneOf(s) === 'accent') ? S.singleGo : S.makeAccent)] : []),
    { ...it('arrange', S.arrangeTitle, undefined, undefined, true), items: ARR.map((a) => it(`arr:${a}`, S.arrange[a], ed.canArrange(a) ? undefined : S.arrangeLimit)) },
    {
      ...it('align', S.alignTitle),
      items: [
        ...EDGES.map((e) => it(`al:${e}`, S.alignEdge[e])),
        it('dist:h', S.distH, many3 ? undefined : S.alignNeedThree),
        it('dist:v', S.distV, many3 ? undefined : S.alignNeedThree),
        it('place:centre', S.placeCentre),
        it('place:fit', S.placeFit, noSafe),
        it('place:match', S.placeMatch, noSafe),
      ],
    },
    { ...it('combine', S.boolOps.union), items: OPS.map((o) => it(`bool:${o}`, S.boolOps[o], boolReason(st, o))) },
    ...(moveMenu(ed) ? [moveMenu(ed)!] : []),
  ];
}

/** Do what a picked entry says. */
export function runMenu(ed: McSvgEditor, id: string): void {
  const [k, v, w] = id.split(':');
  if (k === 'dup') ed.duplicate();
  else if (k === 'del') ed.deleteSelected();
  else if (k === 'flipH' || k === 'flipV') ed.flip(k === 'flipH' ? 'h' : 'v');
  else if (k === 'rotCW' || k === 'rotCCW') ed.rotate(k === 'rotCW' ? 90 : -90);
  else if (k === 'tone') ed.setTone(ed.selected.every((s) => toneOf(s) === 'accent') ? 'main' : 'accent');
  else if (k === 'arr') ed.arrange(v as SvgArrange);
  else if (k === 'al') ed.align(v as SvgAlignEdge);
  else if (k === 'dist') ed.distribute(v as 'h' | 'v');
  else if (k === 'place') ed.place(v as 'centre' | 'fit' | 'match');
  else if (k === 'bool') void ed.runBoolean(v as BooleanOp);
  else if (k === 'mv') runMove(ed, v, w);
  else if (k === 'all') ed.select(ed.doc.shapes.map((s) => s.id));
  else if (k === 'zoom') ed.fitView();
  else if (k === 'kind') ed.setKind(ed.pointCtx?.kind === 'smooth' ? 'corner' : 'smooth');
  else if (k === 'addpt') ed.addAfter();
  else if (k === 'delpt') ed.deletePoint();
}
