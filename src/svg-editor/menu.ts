import type { MenuEntry } from '../contracts/path-canvas';
import type { BooleanOp } from '../contracts/path-booleans';
import type { PathTool } from '../contracts/path-tools';
import type { SvgAlignEdge, SvgAlignTarget, SvgArrange } from '../contracts/svg-editor';
import { boolReason } from './combine';
import { moveMenu, runMove } from './layers';
import { PATH_BUTTONS, openTool, ptReason } from './pathtools';
import { toneOf } from './model';
import type { McSvgEditor } from './mc-svg-editor';
import { t } from './i18n';
import { ALIGN_TARGETS, ALIGN_EDGE, ARRANGE, BOOL_OPS, PT_NAME } from './names';

/* The "Shape actions" menu: entries per target, and the one place a pick turns into an editor command. */

const it = (id: string, label: string, reason?: string, keys?: string, separatorBefore?: boolean): MenuEntry => ({ id, label, reason, keys, separatorBefore });
const ARR: SvgArrange[] = ['front', 'forward', 'backward', 'back'];
const EDGES: SvgAlignEdge[] = ['left', 'centre', 'right', 'top', 'middle', 'bottom'];
const OPS: BooleanOp[] = ['union', 'subtract', 'intersect', 'exclude'];

export const emptyMenu = (): MenuEntry[] => [it('all', t('Select all')), it('zoom', t('Zoom to fit'))];

/** The topbar Export / Import menu: what the sidebar's Export section held. */
export function xferItems(ed: McSvgEditor): MenuEntry[] {
  const no = ed.out.svg ? undefined : t('Nothing to export yet.');
  return [
    it('x:export', t('Export file'), no),
    it('x:import', t('Import file')),
    it('x:copy', t('Copy SVG'), no, undefined, true),
    it('x:download', t('Download .svg'), no),
    it('x:ha', t('Copy as HA path'), no),
    ...(ed.ha?.secondary ? [it('x:accent', t('Copy accent path'))] : []),
  ];
}

export function pointMenu(ed: McSvgEditor): MenuEntry[] {
  const k = ed.pointCtx?.kind;
  return [it('kind', k === 'smooth' ? t('Corner') : t('Smooth')), it('addpt', t('Add point after'), ed.canAddPoint ? undefined : t('This is the last point of an open line.')), it('delpt', t('Delete point')), it('split', t('Split here'), ptReason(ed, 'split'))];
}

const TARGETS: SvgAlignTarget[] = ['selection', 'canvas', 'safe'];

/** Align, distribute and place; the canvas toolbar adds the "relative to" choice in front. */
export function alignItems(ed: McSvgEditor, tool: boolean): MenuEntry[] {
  const n = ed.items.items.length;
  const noSafe = ed.safeOn ? undefined : t('The safe area is hidden.');
  const none = tool && !n ? t('Nothing selected. Pick a layer, or click a shape.') : undefined;
  const need3 = n >= 3 ? undefined : t('Select three or more shapes to space them evenly.');
  const off = (k: SvgAlignTarget): string | undefined => (k === 'selection' && n < 2 ? t('Select two or more shapes to align them to each other.') : k === 'safe' && !ed.safeOn ? t('The safe area is hidden.') : undefined);
  return [
    ...(tool ? TARGETS.map((k) => ({ ...it(`tgt:${k}`, `${t('Relative to')}: ${t(ALIGN_TARGETS[k])}`, off(k)), checked: ed.alignBase === k })) : []),
    ...EDGES.map((e, i) => it(`al:${e}`, t(ALIGN_EDGE[e]), none, undefined, tool && !i)),
    it('dist:h', t('Distribute horizontally'), none ?? need3, undefined, tool),
    it('dist:v', t('Distribute vertically'), none ?? need3),
    it('place:centre', t('Centre on canvas'), undefined, undefined, tool),
    it('place:fit', t('Fit to safe area'), noSafe),
    it('place:match', t('Match safe-area edges'), noSafe),
  ];
}

export const combineItems = (ed: McSvgEditor): MenuEntry[] => OPS.map((o) => it(`bool:${o}`, t(BOOL_OPS[o]), boolReason(ed.boolean, o)));
export const pathItems = (ed: McSvgEditor): MenuEntry[] => PATH_BUTTONS.map((tool) => it(`pt:${tool}`, t(PT_NAME[tool]), ptReason(ed, tool)));

export function shapeMenu(ed: McSvgEditor): MenuEntry[] {
  return [
    it('dup', t('Duplicate'), undefined, 'Control+D'),
    it('del', t('Delete'), undefined, 'Delete'),
    it('flipH', t('Flip horizontally'), undefined, 'Shift+H', true),
    it('flipV', t('Flip vertically'), undefined, 'Shift+V'),
    it('rotCW', t('Rotate 90 degrees clockwise')),
    it('rotCCW', t('Rotate 90 degrees anticlockwise')),
    ...(ed.dualOn ? [it('tone', ed.selected.every((s) => toneOf(s) === 'accent') ? t('Make Main') : t('Make Accent'))] : []),
    { ...it('arrange', t('Arrange'), undefined, undefined, true), items: ARR.map((a) => it(`arr:${a}`, t(ARRANGE[a]), ed.canArrange(a) ? undefined : t('It is already there.'))) },
    { ...it('align', t('Align')), items: alignItems(ed, false) },
    { ...it('combine', t(BOOL_OPS.union)), items: combineItems(ed) },
    { ...it('path', t('Path')), items: pathItems(ed) },
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
