import type { MessageIndex } from '../contracts/i18n';
import type { BooleanOp } from '../contracts/path-booleans';
import type { PrimitiveKind } from '../contracts/path-model';
import type { PathTool } from '../contracts/path-tools';
import type { SvgAlignEdge, SvgAlignTarget, SvgArrange } from '../contracts/svg-editor';
import { m } from './i18n';

// Names the editor shows for things it holds as data, each an id marked with m() and rendered with t().

export const PRIM: Record<PrimitiveKind, MessageIndex> = {
  'rounded-rect': m('svg-editor.names.rounded-rectangle'),
  triangle: m('svg-editor.names.triangle'),
  arrow: m('svg-editor.names.arrow'),
  chevron: m('svg-editor.names.chevron'),
  plus: m('svg-editor.names.plus'),
  heart: m('svg-editor.names.heart'),
  'speech-bubble': m('svg-editor.names.speech-bubble'),
  drop: m('svg-editor.names.drop'),
  leaf: m('svg-editor.names.leaf'),
  shield: m('svg-editor.names.shield'),
  cloud: m('svg-editor.names.cloud'),
  ticket: m('svg-editor.names.ticket'),
  tab: m('svg-editor.names.tab'),
  tag: m('svg-editor.names.tag'),
  circle: m('svg-editor.names.circle'),
  ellipse: m('svg-editor.names.ellipse'),
  semicircle: m('svg-editor.names.semicircle'),
  star: m('svg-editor.names.star'),
  hexagon: m('svg-editor.names.hexagon'),
};

export const TONE: Record<'main' | 'accent' | 'both', MessageIndex> = {
  main: m('svg-editor.names.main'),
  accent: m('svg-editor.names.accent'),
  both: m('svg-editor.names.main-accent'),
};

export const ALIGN_TARGETS: Record<SvgAlignTarget, MessageIndex> = {
  selection: m('svg-editor.names.selection'),
  canvas: m('svg-editor.names.canvas'),
  safe: m('svg-editor.names.safe-area'),
};

export const ALIGN_EDGE: Record<SvgAlignEdge, MessageIndex> = {
  left: m('svg-editor.names.align-left'),
  centre: m('svg-editor.names.align-centre'),
  right: m('svg-editor.names.align-right'),
  top: m('svg-editor.names.align-top'),
  middle: m('svg-editor.names.align-middle'),
  bottom: m('svg-editor.names.align-bottom'),
};

export const ARRANGE: Record<SvgArrange, MessageIndex> = {
  front: m('svg-editor.names.bring-to-front'),
  forward: m('svg-editor.names.forward'),
  backward: m('svg-editor.names.backward'),
  back: m('svg-editor.names.send-to-back'),
};

export const BOOL_OPS: Record<BooleanOp, MessageIndex> = {
  union: m('svg-editor.names.combine'),
  subtract: m('svg-editor.names.subtract'),
  intersect: m('svg-editor.names.intersect'),
  exclude: m('svg-editor.names.exclude'),
};

export const BOOL_NAME: Record<BooleanOp, MessageIndex> = {
  union: m('svg-editor.names.combined-shape'),
  subtract: m('svg-editor.names.subtracted-shape'),
  intersect: m('svg-editor.names.intersected-shape'),
  exclude: m('svg-editor.names.excluded-shape'),
};

export const PT_NAME: Record<PathTool, MessageIndex> = {
  'outline-stroke': m('svg-editor.names.outline-stroke'),
  offset: m('svg-editor.names.offset-path'),
  simplify: m('svg-editor.names.simplify'),
  join: m('svg-editor.names.join'),
  split: m('svg-editor.names.split-at-point'),
  knife: m('svg-editor.names.knife'),
};

/** What a finished combine says; {c} shapes took part, {n} were taken away from the first one, named {from}. */
export const BOOL_DONE: Record<BooleanOp, MessageIndex> = {
  union: m('svg-editor.names.combined-c-shapes'),
  subtract: m('svg-editor.names.subtracted-n-from-from'),
  intersect: m('svg-editor.names.intersected-c-shapes'),
  exclude: m('svg-editor.names.excluded-c-shapes'),
};

export const MOVE_WHY = {
  self: m("svg-editor.names.a-group-can-t-go-inside-itself"),
  none: m("svg-editor.names.it-can-t-go-there"),
};

/** The lines of the Shortcuts popover. */
export const HELP_KEYS: MessageIndex[] = [
  m('svg-editor.names.ctrl-z-undo-ctrl-shift-z-redo-ctrl-enter'),
  m('svg-editor.names.tools-v-select-a-points-p-pen-r'),
  m('svg-editor.names.zoom-and-fit-0-grid-ctrl-snap-ctrl'),
  m('svg-editor.names.arrows-move-shift-arrows-move-far-alt'),
  m('svg-editor.names.and-previous-and-next-point-c-corner-or'),
  m('svg-editor.names.ctrl-d-duplicate-ctrl-g-group-shift-h'),
  m('svg-editor.names.show-or-hide-panels-ctrl-or'),
  m('svg-editor.names.in-a-number-field-ctrl-z-undoes-the'),
  m('svg-editor.names.on-a-mac-tab-reaches-buttons-only-when'),
];
