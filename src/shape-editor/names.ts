import type { CornerKey, CornerType } from '../contracts/custom-shape';
import type { PrimitiveKind } from '../contracts/path-model';
import { m, type NameKey } from './i18n';

// Names the shape editor shows for things it holds as data, each an id marked with m() and rendered with t().

export const CORNER: Record<CornerKey, NameKey> = {
  tl: m('shape-editor.names.top-left-corner'),
  tr: m('shape-editor.names.top-right-corner'),
  br: m('shape-editor.names.bottom-right-corner'),
  bl: m('shape-editor.names.bottom-left-corner'),
};

/** The Edit at choices, in order. */
export const EDIT_AT: Array<[string, NameKey]> = [
  ['tile', m('shape-editor.names.tile')],
  ['row', m('shape-editor.names.row')],
  ['wide', m('shape-editor.names.wide')],
  ['custom', m('shape-editor.names.custom')],
];

export const SIZE: Record<string, NameKey> = {
  tile: m('shape-editor.names.tile-square-120-x-120'),
  row: m('shape-editor.names.row-wide-360-x-120'),
  wide: m('shape-editor.names.wide-banner-720-x-200'),
  custom: m('shape-editor.names.custom-size'),
};

export const SHORT: Record<string, NameKey> = {
  tile: m('shape-editor.names.tile'),
  row: m('shape-editor.names.row'),
  wide: m('shape-editor.names.wide-banner'),
  custom: m('shape-editor.names.custom-size'),
};

export const STARTER: Record<string, NameKey> = {
  rounded: m('shape-editor.names.rounded'),
  cut: m('shape-editor.names.cut-corners'),
  scooped: m('shape-editor.names.scooped'),
  notched: m('shape-editor.names.notched'),
  two: m('shape-editor.names.two-notched-corners'),
};

export const TYPE: Record<CornerType, NameKey> = {
  round: m('shape-editor.names.round'),
  squircle: m('shape-editor.names.squircle'),
  bevel: m('shape-editor.names.bevel'),
  scoop: m('shape-editor.names.scoop'),
  notch: m('shape-editor.names.notch'),
  square: m('shape-editor.names.square'),
};

export const TYPE_HELP: Record<CornerType, NameKey> = {
  round: m('shape-editor.names.a-quarter-circle'),
  squircle: m('shape-editor.names.a-softer-round-between-a-circle-and-a'),
  bevel: m('shape-editor.names.a-straight-diagonal-cut'),
  scoop: m('shape-editor.names.a-quarter-circle-cut-into-the-card'),
  notch: m('shape-editor.names.a-square-step-cut-into-the-corner'),
  square: m('shape-editor.names.no-change-a-sharp-corner'),
};

export const SIDE: Record<'top' | 'right' | 'bottom' | 'left', NameKey> = {
  top: m('shape-editor.names.top'),
  right: m('shape-editor.names.right'),
  bottom: m('shape-editor.names.bottom'),
  left: m('shape-editor.names.left'),
};

export const HANDLE: Record<'in' | 'out', NameKey> = { in: m('shape-editor.names.in-handle'), out: m('shape-editor.names.out-handle') };

export const BOX: Record<'x' | 'y' | 'w' | 'h', NameKey> = { x: m('shape-editor.names.x'), y: m('shape-editor.names.y'), w: m('shape-editor.names.w'), h: m('shape-editor.names.h') };

export const PRIM: Record<PrimitiveKind, NameKey> = {
  'rounded-rect': m('shape-editor.names.rounded-rectangle'),
  triangle: m('shape-editor.names.triangle'),
  arrow: m('shape-editor.names.arrow'),
  chevron: m('shape-editor.names.chevron'),
  plus: m('shape-editor.names.plus'),
  heart: m('shape-editor.names.heart'),
  'speech-bubble': m('shape-editor.names.speech-bubble'),
  drop: m('shape-editor.names.drop'),
  leaf: m('shape-editor.names.leaf'),
  shield: m('shape-editor.names.shield'),
  cloud: m('shape-editor.names.cloud'),
  ticket: m('shape-editor.names.ticket'),
  tab: m('shape-editor.names.tab'),
  tag: m('shape-editor.names.tag'),
  circle: m('shape-editor.names.circle'),
  ellipse: m('shape-editor.names.ellipse'),
  semicircle: m('shape-editor.names.semicircle'),
  star: m('shape-editor.names.star'),
  hexagon: m('shape-editor.names.hexagon'),
};

/** What an anchored axis measures, by anchor and axis (xl: from the left edge, yr: from the bottom edge ...). */
export const DIST: Record<string, NameKey> = {
  xl: m('shape-editor.names.distance-from-the-left-edge'),
  xr: m('shape-editor.names.distance-from-the-right-edge'),
  yl: m('shape-editor.names.distance-from-the-top-edge'),
  yr: m('shape-editor.names.distance-from-the-bottom-edge'),
};

/** The shape's own names for the presets "Edit as custom" starts from (model.ts keeps them as English keys). */
export const PRESET: Record<string, NameKey> = {
  Squircle: m('shape-editor.names.squircle'),
  Notch: m('shape-editor.names.notch'),
  Octagon: m('shape-editor.names.octagon'),
  Pill: m('shape-editor.names.pill'),
  Circle: m('shape-editor.names.circle'),
  Hexagon: m('shape-editor.names.hexagon'),
};

/** Combine, Subtract, Intersect: the id is the path-booleans operation. */
export const OPS: Array<[string, NameKey]> = [
  ['union', m('shape-editor.names.combine')],
  ['subtract', m('shape-editor.names.subtract')],
  ['intersect', m('shape-editor.names.intersect')],
];

/** The two sample lines drawn in the text area. */
export const SAMPLE: NameKey[] = [m('shape-editor.names.living-room'), m('shape-editor.names.lamp-on')];

/** Why the library said no, by problem. */
export const FAIL: Record<string, NameKey> = {
  readonly: m('shape-editor.names.your-account-can-use-the-library-but-not'),
  conflict: m('shape-editor.names.this-shape-changed-while-you-were'),
  full: m('shape-editor.names.the-library-is-full-delete-a-shape-first'),
  missing: m('shape-editor.names.keep-your-own-shapes-for-every-dashboard'),
  invalid: m('shape-editor.names.this-shape-is-too-big-for-the-library-8'),
};

/** The lines of the Shortcuts popover. */
export const SHORTCUTS: NameKey[] = [
  m('shape-editor.names.tab-into-the-canvas-then-and-choose-a'),
  m('shape-editor.names.arrow-keys-move-the-point-shift-moves-it'),
  m('shape-editor.names.delete-removes-the-point'),
  m('shape-editor.names.v-is-select-p-is-pen'),
  m('shape-editor.names.ctrl-z-undoes-ctrl-shift-z-redoes-ctrl-s'),
  m('shape-editor.names.right-click-long-press-the-menu-key-or'),
  m('shape-editor.names.show-or-hide-panels-ctrl-or'),
  m('shape-editor.names.esc-closes-a-window-then-ends-a-drawing'),
];

/** The id for a preset's name; one that is not listed shows as it is. */
export const presetName = (from: string): NameKey => PRESET[from] ?? from;
